import Link from 'next/link';
import type { Metadata } from 'next';
import { store } from '@/lib/store';
import { verifyOrder } from '@/lib/order-token';
import site from '../../../../data/site.json';
import { SectionAtmosphere } from '@/components/MobileExperience';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Order Summary & Settlement | KR8 DIGITALS',
  robots: { index: false, follow: false },
};

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ ref: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { ref } = await params;
  const { t = '' } = await searchParams;
  const storedOrder = await store.findOne('orders', { reference: ref });
  const tokenOrder = verifyOrder(t);
  const order: any =
    storedOrder ||
    (tokenOrder && tokenOrder.reference === ref
      ? {
          ...tokenOrder,
          itemLabel: tokenOrder.item,
          buyerName: tokenOrder.name,
          buyerEmail: tokenOrder.email,
          status: 'pending',
        }
      : null);

  if (!order) {
    return (
      <section className="kr8-subhero" style={{ minHeight: '72vh' }}>
        <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.3} mobOpacity={0.42} flare />
        <div className="wrap" style={{ maxWidth: 680 }}>
          <span className="kr8-pill kr8-pill--amber">Order Lookup</span>
          <h1 className="kr8-subhero__title" style={{ fontSize: 'clamp(26px, 5vw, 38px)' }}>
            Order reference not found
          </h1>
          <p className="kr8-subhero__lede">
            Reference <code>{ref}</code> could not be located. If you recently requested an invoice or settlement
            instruction, message our team on WhatsApp with your reference and we will assist right away.
          </p>
          <div className="kr8-subhero__actions">
            <a
              className="btn-primary"
              href={`https://wa.me/${site.company.whatsapp}?text=${encodeURIComponent(`Order reference: ${ref}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Confirm on WhatsApp
            </a>
            <Link href="/services" className="btn-ghost">
              Back to Services
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const fullAccess = Boolean(tokenOrder && tokenOrder.reference === order.reference);
  const instructions = order.instructions || {};

  return (
    <section className="kr8-subhero" style={{ minHeight: '76vh' }}>
      <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.32} mobOpacity={0.44} flare />
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div className="kr8-card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <span className="kr8-card__num" style={{ marginBottom: 0, overflowWrap: 'anywhere' }}>
              ORDER REFERENCE · {order.reference}
            </span>
            <span className={`badge-status ${order.status === 'paid' ? 'paid' : 'pending'}`}>
              {order.status}
            </span>
          </div>

          <h1 className="kr8-card__title" style={{ fontSize: 'clamp(20px, 4.5vw, 28px)', marginTop: 14 }}>
            {order.itemLabel || 'KR8 DIGITALS Engagement'}
          </h1>

          {fullAccess ? (
            <>
              <p className="kr8-card__body">
                Confirmed settlement summary for <strong>{order.buyerName || order.buyerEmail}</strong>. Quote
                reference <strong>{order.reference}</strong> on your transfer narration so our finance desk matches
                it immediately.
              </p>

              <div
                style={{
                  marginTop: 18,
                  padding: '16px 16px',
                  borderRadius: 14,
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                  display: 'grid',
                  gap: 10,
                  fontSize: 14,
                  overflowWrap: 'anywhere',
                }}
              >
                {order.amountNgn && (
                  <div>
                    <strong>Settlement Amount (NGN):</strong> ₦{Number(order.amountNgn).toLocaleString('en-US')}
                  </div>
                )}
                {instructions.bankName && (
                  <div>
                    <strong>Bank:</strong> {instructions.bankName}
                  </div>
                )}
                {instructions.accountName && (
                  <div>
                    <strong>Account Name:</strong> {instructions.accountName}
                  </div>
                )}
                {instructions.accountNumber && (
                  <div>
                    <strong>Account Number:</strong> {instructions.accountNumber}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="kr8-card__body">
              Full settlement details are restricted to the private order link issued at checkout. Open the
              complete URL sent to you, or verify directly on WhatsApp quoting{' '}
              <strong>{order.reference}</strong>.
            </p>
          )}

          <div className="kr8-subhero__actions">
            <a
              className="btn-primary"
              href={`https://wa.me/${site.company.whatsapp}?text=${encodeURIComponent(`Hello KR8 DIGITALS — payment confirmation for order ${order.reference}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Confirm Settlement on WhatsApp
            </a>
            <Link href="/" className="btn-ghost">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
