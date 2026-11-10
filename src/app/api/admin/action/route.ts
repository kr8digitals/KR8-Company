import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/auth';
import { store, databaseConfigured, databaseRequest, decodeRow } from '@/lib/store';
import { sendMail, row, shell } from '@/lib/notify';
import { getSettings } from '@/lib/settings';

export const runtime = 'nodejs';


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

      case 'commission.confirm':
      case 'commission.pay': {
        if (!id) throw new Error('id required');
        if (!databaseConfigured()) throw new Error('Financial actions require the production database.');
        const value = patch?.valueUsd === undefined ? null : Number(patch.valueUsd);
        if (value !== null && (!Number.isFinite(value) || value <= 0)) throw new Error('Project value must be positive');
        const result = await databaseRequest('rpc/kr8_commission_transition', {
          method: 'POST', body: JSON.stringify({ p_id: id,
            p_action: op === 'commission.confirm' ? 'confirm' : 'pay',
            p_value: value, p_note: String(patch?.note || '').slice(0, 1000), p_rates: (await getSettings()).referralRates }),
        });
        const doc = decodeRow(result);
        let notification = { emailed: false };
        if (op === 'commission.confirm' && result.transitioned) {
          const referrer = await store.findOne('referrals', { code: doc.referrerCode });
          if (referrer?.email) notification = await sendMail({
            to: [referrer.email], subject: `Your referral commission is confirmed — $${doc.commissionUsd}`,
            html: shell('Commission confirmed', row('Referred', doc.leadName) + row('Your commission', `$${doc.commissionUsd}`),
              'View your ledger at kr8digitals.com/referrals/dashboard.'),
          });
        }
        return NextResponse.json({ ok: true, doc, ...notification });
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
        if (patch?.notify_email && !String(patch.notify_email).split(',').every(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) throw new Error('Enter valid notification email addresses');
        if (patch?.notify_webhook_url && new URL(patch.notify_webhook_url).protocol !== 'https:') throw new Error('Webhook URL must use HTTPS');
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
