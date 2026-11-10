import { formatEditableText } from '@/lib/content-format';
import { getEditableDocument } from '@/lib/editable-content';
import { getPublicContent } from '@/lib/public-content';
import Link from 'next/link';
import type { Metadata } from 'next';
import { store } from '@/lib/store';
import { verifyOrder } from '@/lib/order-token';
import site from '../../../../data/site.json';
import { SectionAtmosphere } from '@/components/MobileExperience';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return (await getEditableDocument("app:order:[ref]:page")).blocks.metadata as Metadata;
}

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ ref: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const editableContent = await getEditableDocument("app:order:[ref]:page");

  const publicData = await getPublicContent();
  const site = publicData.site;

  const { ref } = await params;
  const { t = '' } = await searchParams;
  const storedOrder = await store.findOne('orders', { reference: ref });
  const tokenOrder = verifyOrder(t);
  const order = storedOrder;

  if (!order) {
    return (
      <section className="kr8-subhero" style={{ minHeight: '72vh' }}>
        <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.3} mobOpacity={0.42} flare />
        <div className="wrap" style={{ maxWidth: 680 }}>
          <span className="kr8-pill kr8-pill--amber">{editableContent.texts.text_4683840232}</span>
          <h1 className="kr8-subhero__title" style={{ fontSize: 'clamp(26px, 5vw, 38px)' }}>
            {editableContent.texts.text_1b16d7e18c}</h1>
          <p className="kr8-subhero__lede">
            {editableContent.texts.text_ab0cedb8fb}<code>{ref}</code> {editableContent.texts.text_b0ce014c34}</p>
          <div className="kr8-subhero__actions">
            <a
              className="btn-primary"
              href={formatEditableText("https://wa.me/{0}?text={1}", [site.company.whatsapp, encodeURIComponent(`Order reference: ${ref}`)])}
              target="_blank"
              rel="noopener noreferrer"
            >
              {editableContent.texts.text_03a9e7ed61}</a>
            <Link href={editableContent.texts.field_3b1aeccb74} className="btn-ghost">
              {editableContent.texts.text_27c68678da}</Link>
          </div>
        </div>
      </section>
    );
  }

  const fullAccess = Boolean(tokenOrder && tokenOrder.reference === order.reference && tokenOrder.id === order.id);
  const instructions = { bankName: process.env.KR8_BANK_NAME, accountName: process.env.KR8_BANK_ACCOUNT_NAME, accountNumber: process.env.KR8_BANK_ACCOUNT };

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
              {editableContent.texts.text_01a2d3f916}{order.reference}
            </span>
            <span className={`badge-status ${order.status === 'paid' ? 'paid' : 'pending'}`}>
              {order.status}
            </span>
          </div>

          <h1 className="kr8-card__title" style={{ fontSize: 'clamp(20px, 4.5vw, 28px)', marginTop: 14 }}>
            {order.item || editableContent.texts.copy_efd9df819a}
          </h1>

          {fullAccess ? (
            <>
              <p className="kr8-card__body">
                {editableContent.texts.text_ca6adce9d1}<strong>{order.name || editableContent.texts.copy_27f0d486b6}</strong>{editableContent.texts.text_c67bea61b0}<strong>{order.reference}</strong> {editableContent.texts.text_a1667db2f4}</p>

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
                    <strong>{editableContent.texts.text_9bb4213079}</strong> ₦{Number(order.amountNgn).toLocaleString('en-US')}
                  </div>
                )}
                {instructions.bankName && (
                  <div>
                    <strong>{editableContent.texts.text_4be33ffe82}</strong> {instructions.bankName}
                  </div>
                )}
                {instructions.accountName && (
                  <div>
                    <strong>{editableContent.texts.text_af540d8305}</strong> {instructions.accountName}
                  </div>
                )}
                {instructions.accountNumber && (
                  <div>
                    <strong>{editableContent.texts.text_093adba7d4}</strong> {instructions.accountNumber}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="kr8-card__body">
              {editableContent.texts.text_c95ecd1389}{' '}
              <strong>{order.reference}</strong>.
            </p>
          )}

          <div className="kr8-subhero__actions">
            <a
              className="btn-primary"
              href={formatEditableText("https://wa.me/{0}?text={1}", [site.company.whatsapp, encodeURIComponent(`Hello KR8 DIGITALS — payment confirmation for order ${order.reference}`)])}
              target="_blank"
              rel="noopener noreferrer"
            >
              {editableContent.texts.text_d67a75eb81}</a>
            <Link href="/" className="btn-ghost">
              {editableContent.texts.text_d2f9ecbf6c}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
