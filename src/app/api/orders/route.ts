import { NextResponse } from 'next/server';
import { store, newId } from '@/lib/store';
import { getRates } from '@/lib/rates';
import { activeProvider } from '@/lib/payments';
import { sendMail, row, shell } from '@/lib/notify';
import { signOrder } from '@/lib/order-token';
import { getSiteCatalog } from '@/lib/site-content';
import crypto from 'node:crypto';

export const runtime = 'nodejs';

function reference() {
  return `KR8-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });

  if (String(body.name || '').trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email || '').trim())) {
    return NextResponse.json({ ok: false, error: 'Enter your name and a valid email address.' }, { status: 422 });
  }
  const catalog = await getSiteCatalog();
  const selected = catalog.sites.find(s => s.slug === String(body.siteId || '') && s.status === 'for-sale');
  if (!selected || typeof selected.priceUsd !== 'number' || !Number.isFinite(selected.priceUsd) || selected.priceUsd <= 0) {
    return NextResponse.json({ ok: false, error: 'Select an available site from the catalogue.' }, { status: 422 });
  }
  const item = `${selected.name} — ready-built site`;
  const amountUsd = selected.priceUsd;
  // Validate signing configuration before persisting an order.
  signOrder({ id: 'check', reference: 'check', item, amountUsd, amountNgn: 0, createdAt: new Date().toISOString() });

  const { rates } = await getRates();
  const amountNgn = Math.round((amountUsd * (rates.NGN || 1550)) / 100) * 100;
  const ref = reference();

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
