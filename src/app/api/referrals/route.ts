import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { store, newId } from '@/lib/store';
import { sendMail, row, shell } from '@/lib/notify';

export const runtime = 'nodejs';

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 4;
}

function code(name: string) {
  const base = (name || 'kr8').toLowerCase().replace(/[^a-z]/g, '').slice(0, 6) || 'kr8';
  return `${base}${crypto.randomBytes(2).toString('hex')}`;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) return NextResponse.json({ ok: false, error: 'Too many attempts. Try again shortly.' }, { status: 429 });

  let b: any;
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 }); }

  const name = String(b.name || '').trim().slice(0, 120);
  const email = String(b.email || '').trim().toLowerCase().slice(0, 160);
  const phone = String(b.phone || '').trim().slice(0, 40);
  const focus = String(b.focus || '').trim().slice(0, 80);
  const rawCta = b.cta && typeof b.cta === 'object' ? b.cta : {};
  const cta = {
    ctaId: String(rawCta.ctaId || 'referral-signup:/referrals#join').slice(0, 180),
    ctaSourcePath: String(rawCta.sourcePath || '/referrals').slice(0, 240),
    ctaDestination: String(rawCta.destination || '/referrals#join').slice(0, 400),
    ctaLabel: String(rawCta.label || 'Create your referral account').slice(0, 120),
    ctaCapturedAt: String(rawCta.capturedAt || '').slice(0, 40),
  };

  if (name.length < 2) return NextResponse.json({ ok: false, error: 'Please enter your name.' }, { status: 422 });
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) return NextResponse.json({ ok: false, error: 'Please enter a valid email.' }, { status: 422 });
  if (b.consent !== true) return NextResponse.json({ ok: false, error: 'Please accept the terms.' }, { status: 422 });

  const existing = await store.findOne('referrals', { email });
  if (existing) {
    return NextResponse.json({
      ok: true, existing: true, code: existing.code, key: existing.key || '',
      message: 'You already have a referral account. Sign in with your email to see the ledger.',
      link: `/r/${existing.code}`,
    });
  }

  const c = code(name);
  const key = crypto.randomBytes(18).toString('base64url');
  const ref = await store.insert('referrals', {
    id: newId('rf_'), code: c, name, email, phone, focus, key,
    status: 'active', paidReferrals: 0, earnedUsd: 0, confirmedUsd: 0, withdrawnUsd: 0,
    emailVerified: false, ip,
    ...cta,
  });

  await sendMail({
    subject: `New referrer — ${name}`,
    html: shell('New referral account', [
      row('Name', name), row('Email', email), row('Phone', phone), row('Focus', focus), row('Code', c),
    ].join(''), `Referral link: /r/${c}`),
  });

  return NextResponse.json({
    ok: true, code: c, link: `/r/${c}`, key,
    message: 'Your account is created. Share your link — we track every introduction.',
  });
}

export async function GET(req: Request) {
  // Ledger read. Requires the private key issued at signup (or the admin password).
  const url = new URL(req.url);
  const refCode = (url.searchParams.get('code') || '').trim();
  const key = (url.searchParams.get('key') || '').trim();
  const admin = (url.searchParams.get('admin') || '') === (process.env.ADMIN_PASSWORD || '');
  if (!refCode) return NextResponse.json({ ok: false, error: 'Missing code' }, { status: 400 });

  const ref = await store.findOne('referrals', { code: refCode });
  if (!ref) return NextResponse.json({ ok: false, error: 'No such referral account' }, { status: 404 });
  if (!admin && (!key || key !== ref.key)) {
    return NextResponse.json({ ok: false, error: 'That key does not match this account.' }, { status: 401 });
  }

  const commissions = await store.find('commissions', { referrerCode: refCode }, 200);
  const paid = commissions.filter((c) => c.status === 'paid');
  const earned = commissions.filter((c) => c.status === 'earned');
  const pending = commissions.filter((c) => c.status === 'pending');

  return NextResponse.json({
    ok: true,
    referrer: { code: ref.code, name: ref.name, email: ref.email, joined: ref.createdAt },
    totals: {
      pendingUsd: pending.reduce((a, c) => a + (Number(c.valueUsd) || 0), 0),
      earnedUsd: earned.reduce((a, c) => a + (Number(c.commissionUsd) || 0), 0),
      paidUsd: paid.reduce((a, c) => a + (Number(c.commissionUsd) || 0), 0),
      leads: commissions.length,
    },
    rate: commissions.length >= 3 ? 12 : null,
    commissions: commissions.map((c) => ({
      id: c.id, at: c.createdAt, lead: c.leadName, type: c.type,
      value: c.valueUsd, commission: c.commissionUsd, status: c.status,
    })),
  });
}
