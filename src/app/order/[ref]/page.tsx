import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { store } from '@/lib/store';
import { activeProvider } from '@/lib/payments';
import site from '../../../../data/site.json';
import { Icon } from '@/components/ui';
import { verifyOrder } from '@/lib/order-token';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Your order', robots: { index: false, follow: false } };

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ ref: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { ref } = await params;
  const { t } = await searchParams;

  const stored = await store.findOne('orders', { reference: ref });
  // The link carries its own signed copy of the order, so a transfer page can
  // always render even if the record is not readable from this instance.
  const signed = stored ? null : verifyOrder(t);
  const order = stored || (signed && signed.reference === ref ? signed : null);
  if (!order) notFound();

  const intent = activeProvider().create({
    id: order.id, reference: order.reference, amountUsd: order.amountUsd,
    amountNgn: order.amountNgn, note: order.note || '',
  });

  return (
    <section className="section" style={{ paddingTop: 150, minHeight: '80vh' }}>
      <div className="wrap" style={{ maxWidth: 860 }}>
        <div className="split" style={{ alignItems: 'flex-start' }}>
          <div>
            <div className="eyebrow">Order {order.reference}</div>
            <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 44, fontWeight: 800, letterSpacing: '-.03em', marginTop: 10 }}>
              Transfer to finish.
            </h1>
            <p className="lede" style={{ marginTop: 14 }}>
              {order.item} — <b style={{ color: '#fff' }}>${order.amountUsd.toLocaleString('en-US')}</b>
            </p>
            <div className="panel" style={{ padding: 26, marginTop: 28 }}>
              {intent.fields.map((f) => (
                <div className="kv" key={f.label}><span>{f.label}</span><span><b style={{ color: '#fff' }}>{f.value}</b></span></div>
              ))}
            </div>
            <ol className="price-list" style={{ marginTop: 26 }}>
              {intent.instructions.map((i) => <li key={i}><Icon name="check" size={15} /> <span>{i}</span></li>)}
            </ol>
            <div style={{ display: 'flex', gap: 12, marginTop: 26, flexWrap: 'wrap' }}>
              <a className="btn-primary" href={`https://wa.me/${site.company.whatsapp}?text=${encodeURIComponent(`Receipt for order ${order.reference}`)}`} target="_blank" rel="noopener noreferrer">
                <Icon name="wa" size={16} /> Send the receipt
              </a>
              <Link href="/contact" className="btn-ghost">Ask a question</Link>
            </div>
          </div>
          <div className="panel" style={{ padding: 26, minWidth: 260 }}>
            <div className="tag" style={{ color: 'var(--magenta)' }}>Status</div>
            <p style={{ marginTop: 8, fontSize: 16, color: '#fff', fontWeight: 600 }}>Awaiting transfer</p>
            <p style={{ marginTop: 10, fontSize: 13, color: 'var(--t-muted)', lineHeight: 1.65 }}>
              {intent.confirmHint}
            </p>
            <p style={{ marginTop: 16, fontSize: 12, color: 'var(--t-faint)', lineHeight: 1.6 }}>
              Keep this page bookmarked. It always shows the current status of this order.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
