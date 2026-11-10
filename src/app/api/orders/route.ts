import { NextResponse } from 'next/server';
import { store, newId } from '@/lib/store';
import { getRates } from '@/lib/rates';
import { activeProvider } from '@/lib/payments';
import { sendMail, row, shell } from '@/lib/notify';
import { signOrder } from '@/lib/order-token';

export const runtime = 'nodejs';

function reference() {
  const chunk = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KR8-${chunk()}-${chunk()}`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });

  const item = String(body.item || '').slice(0, 120);
  const amountUsd = Math.round(Number(body.amountUsd));
  if (!item || !Number.isFinite(amountUsd) || amountUsd <= 0) {
    return NextResponse.json({ ok: false, error: 'That order is not valid.' }, { status: 422 });
  }

  const { rates } = await getRates();
  const amountNgn = Math.round((amountUsd * (rates.NGN || 1550)) / 100) * 100;
  const ref = reference();

  const rawCta = body.cta && typeof body.cta === 'object' ? body.cta : {};
  const cta = {
    ctaId: String(rawCta.ctaId || `buy-site:${String(body.siteId || item)}`).slice(0, 180),
    ctaSourcePath: String(rawCta.sourcePath || '/showcase').slice(0, 240),
    ctaDestination: String(rawCta.destination || '/order').slice(0, 400),
    ctaLabel: String(rawCta.label || 'Reserve this build').slice(0, 120),
    ctaCapturedAt: String(rawCta.capturedAt || '').slice(0, 40),
  };

  const order = await store.insert('orders', {
    id: newId('or_'),
    reference: ref,
    item,
    amountUsd,
    amountNgn,
    currency: 'NGN',
    provider: activeProvider().id,
    status: 'awaiting_transfer',
    name: String(body.name || '').slice(0, 120),
    email: String(body.email || '').slice(0, 160),
    phone: String(body.phone || '').slice(0, 40),
    note: String(body.note || '').slice(0, 500),
    siteId: String(body.siteId || '').slice(0, 120),
    ...cta,
    history: [{ at: new Date().toISOString(), what: 'created' }],
  });

  await sendMail({
    subject: `New order ${ref} — ${item}`,
    html: shell('New order', [
      row('Reference', ref), row('Item', item), row('Amount', `$${amountUsd} / NGN ${amountNgn.toLocaleString('en-NG')}`),
      row('Name', body.name), row('Email', body.email), row('Phone', body.phone), row('Note', body.note),
    ].join(''), 'Confirm the transfer in the dashboard once the money lands.'),
  });

  const token = signOrder({
    id: order.id, reference: ref, item, amountUsd, amountNgn,
    name: String(body.name || ''), email: String(body.email || ''),
    note: String(body.note || ''), createdAt: order.createdAt,
  });

  return NextResponse.json({ ok: true, reference: ref, amountUsd, amountNgn, token });
}
