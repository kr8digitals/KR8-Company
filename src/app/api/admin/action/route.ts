import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/auth';
import { store } from '@/lib/store';
import { sendMail, row, shell } from '@/lib/notify';
import site from '../../../../../data/site.json';

export const runtime = 'nodejs';

const RATES = site.settings.referralRates;

function rateFor(type: string, paidCount: number) {
  const t = (type || '').toLowerCase();
  if (paidCount >= RATES.bonusAfterPaidReferrals) return RATES.bonus;
  if (t.includes('design') || t.includes('video') || t.includes('seo') || t.includes('search') || t.includes('brand')) return RATES.design;
  if (t.includes('small')) return RATES.small;
  return RATES.website;
}

export async function POST(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ ok: false, error: 'unauthorised' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || !body.op) return NextResponse.json({ ok: false, error: 'bad request' }, { status: 400 });

  const { op, id, patch, leadId, text, to } = body as {
    op: string; id?: string; patch?: Record<string, any>;
    leadId?: string; text?: string; to?: string;
  };

  try {
    switch (op) {
      case 'lead.update': {
        if (!id) throw new Error('id required');
        const allowed = ['status', 'notes', 'assignee', 'valueUsd'];
        const clean: Record<string, any> = {};
        for (const k of allowed) if (patch && k in patch) clean[k] = patch[k];
        const out = await store.update('leads', id, clean);
        return NextResponse.json({ ok: true, doc: out });
      }

      case 'commission.confirm': {
        if (!id) throw new Error('id required');
        const cm = (await store.find('commissions', { id }, 1))[0];
        if (!cm) throw new Error('not found');
        const ref = (await store.find('referrals', { code: cm.referrerCode }, 1))[0];
        const value = Number(patch?.valueUsd ?? cm.valueUsd) || 0;
        const paidCount = (await store.find('commissions', { referrerCode: cm.referrerCode, status: 'paid' }, 200)).length;
        const rate = rateFor(cm.type, paidCount);
        let commissionUsd = Math.round((value * rate) / 100);
        if ((cm.type || '').toLowerCase().includes('small')) commissionUsd = Math.max(commissionUsd, RATES.smallMinimumUsd);

        const updated = await store.update('commissions', id, {
          valueUsd: value, ratePct: rate, commissionUsd, status: 'earned', confirmedAt: new Date().toISOString(),
        });

        if (ref) {
          await store.update('referrals', ref.id, {
            earnedUsd: (Number(ref.earnedUsd) || 0) + commissionUsd,
            paidReferrals: Number(ref.paidReferrals) || 0,
          });
          await sendMail({
            subject: `Your referral commission is confirmed — $${commissionUsd}`,
            to: [ref.email],
            html: shell('Commission confirmed', [
              row('Referred', cm.leadName), row('Project value', `$${value}`),
              row('Your rate', `${rate}%`), row('You earned', `$${commissionUsd}`),
            ].join(''), 'It is now in your ledger at kr8digitals.com/referrals/dashboard.'),
          });
        }
        return NextResponse.json({ ok: true, doc: updated });
      }

      case 'commission.pay': {
        if (!id) throw new Error('id required');
        const cm = (await store.find('commissions', { id }, 1))[0];
        const updated = await store.update('commissions', id, { status: 'paid', paidAt: new Date().toISOString(), paidNote: patch?.note || '' });
        if (cm) {
          const ref = (await store.find('referrals', { code: cm.referrerCode }, 1))[0];
          if (ref) {
            await store.update('referrals', ref.id, {
              withdrawnUsd: (Number(ref.withdrawnUsd) || 0) + (Number(cm.commissionUsd) || 0),
              paidReferrals: (Number(ref.paidReferrals) || 0) + 1,
            });
          }
        }
        return NextResponse.json({ ok: true, doc: updated });
      }

      case 'lead.reply': {
        // Human reply inside the Host conversation.
        if (!leadId || !text) throw new Error('leadId and text required');
        const doc = await store.insert('host_messages', {
          visitorId: leadId, who: 'team', name: 'KR8 team', text,
        });
        return NextResponse.json({ ok: true, doc });
      }

      case 'order.paid': {
        if (!id) throw new Error('id required');
        const out = await store.update('orders', id, { status: 'paid', paidAt: new Date().toISOString() });
        return NextResponse.json({ ok: true, doc: out });
      }

      case 'settings.save': {
        const existing = (await store.find('settings', { id: 'site' }, 1))[0];
        if (existing) {
          const out = await store.update('settings', existing.id, { values: { ...(existing.values || {}), ...(patch || {}) } });
          return NextResponse.json({ ok: true, doc: out });
        }
        const out = await store.insert('settings', { id: 'site', values: patch || {} });
        return NextResponse.json({ ok: true, doc: out });
      }

      default:
        return NextResponse.json({ ok: false, error: `unknown op ${op}` }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'failed' }, { status: 400 });
  }
}
