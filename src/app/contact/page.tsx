import { formatEditableText } from '@/lib/content-format';
import { getEditableDocument } from '@/lib/editable-content';
import { getPublicContent } from '@/lib/public-content';
import Link from 'next/link';
import type { Metadata } from 'next';
import site from '../../../data/site.json';
import services from '../../../data/services.json';
import LeadForm from '@/components/LeadForm';
import { Icon } from '@/components/ui';
import { ResponsiveCopy, SectionAtmosphere } from '@/components/MobileExperience';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return (await getEditableDocument("app:contact:page")).blocks.metadata as Metadata;
}

type Props = {
  searchParams: Promise<{ service?: string; site?: string; ref?: string }>;
};

export default async function ContactPage({ searchParams }: Props) {
  const editableContent = await getEditableDocument("app:contact:page");

  const publicData = await getPublicContent();
  const site = publicData.site;
  const services = publicData.services;

  const sp = await searchParams;
  const matchedService = services.find((s) => s.slug === sp.service);

  return (
    <>
      {/* ============================================================ HERO */}
      <section className="kr8-subhero" style={{ paddingBottom: 34 }}>
        <SectionAtmosphere name="website-engineering-cinema" deskOpacity={0.18} mobOpacity={0.3} flare />
        <div className="wrap">
          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill">
                <i className="kr8-pill__dot" /> {editableContent.texts.text_120b4967e2}</span>
              <h1 className="kr8-subhero__title">
                {editableContent.texts.text_6b19ffc76e}{' '}
                <em>{editableContent.texts.text_55f066dd94}</em>
              </h1>
              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={
                  <>
                    {editableContent.texts.text_c9d05973ab}<strong>{editableContent.texts.text_0bbfb207b2}</strong> {editableContent.texts.text_0d9a0f7afe}</>
                }
                mobile={
                  <>
                    {editableContent.texts.text_a82e1df408}<strong>{editableContent.texts.text_cae0c06b2d}</strong>.
                  </>
                }
              />
            </div>

            <div className="kr8-grid-2 kr8-contact-quad" style={{ gap: 14 }}>
              <a
                href={formatEditableText("mailto:{0}", [site.company.email])}
                className="kr8-card"
                style={{ textDecoration: 'none', padding: '22px 24px' }}
              >
                <div className="kr8-card__num">{editableContent.texts.text_275a568aba}</div>
                <strong style={{ color: 'var(--t-strong)', fontSize: 13.5, overflowWrap: 'anywhere' }}>
                  {site.company.email}
                </strong>
                <span style={{ fontSize: 12.5, color: 'var(--t-sub)', marginTop: 6, display: 'block' }}>
                  {editableContent.texts.text_5b6be7bbf9}</span>
              </a>

              <a
                href={formatEditableText("https://wa.me/{0}", [site.company.whatsapp])}
                target="_blank"
                rel="noopener noreferrer"
                className="kr8-card kr8-card--accent"
                style={{ textDecoration: 'none', padding: '22px 24px' }}
              >
                <div className="kr8-card__num">{editableContent.texts.text_6dd68d4276}</div>
                <strong style={{ color: 'var(--t-strong)', fontSize: 14.5 }}>{site.company.phone}</strong>
                <span style={{ fontSize: 12.5, color: 'var(--t-sub)', marginTop: 6, display: 'block' }}>
                  {editableContent.texts.text_f066f7bc47}</span>
              </a>

              <Link
                href={editableContent.texts.field_e97169a86c}
                className="kr8-card"
                style={{ textDecoration: 'none', padding: '22px 24px' }}
              >
                <div className="kr8-card__num">{editableContent.texts.text_88c4ce23a6}</div>
                <strong style={{ color: 'var(--t-strong)', fontSize: 14.5 }}>{editableContent.texts.text_f917533459}</strong>
                <span style={{ fontSize: 12.5, color: 'var(--t-sub)', marginTop: 6, display: 'block' }}>
                  {editableContent.texts.text_cae5a80b2f}</span>
              </Link>

              <a
                href={editableContent.texts.field_fd6b7397b2}
                target="_blank"
                rel="noopener noreferrer"
                className="kr8-card"
                style={{ textDecoration: 'none', padding: '22px 24px' }}
              >
                <div className="kr8-card__num">{editableContent.texts.text_4633bbfb98}</div>
                <strong style={{ color: 'var(--t-strong)', fontSize: 14.5 }}>{editableContent.texts.text_ca538eaf54}</strong>
                <span style={{ fontSize: 12.5, color: 'var(--t-sub)', marginTop: 6, display: 'block' }}>
                  {editableContent.texts.text_6b89de70d6}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================== SCOPING FORM + EXPECTATIONS */}
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="wrap">
          <div className="kr8-grid-2" style={{ alignItems: 'start', gap: 32 }}>
            <div className="panel" style={{ padding: 'clamp(18px, 3.2vw, 40px)' }}>
              <LeadForm
                variant="quote"
                defaultService={matchedService?.name || sp.service}
                siteId={sp.site || sp.ref}
              />
            </div>

            <div style={{ display: 'grid', gap: 18 }}>
              <article className="kr8-card">
                <div className="kr8-card-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={editableContent.texts.field_55f987af05}
                    alt={editableContent.texts.field_7858480091}
                  />
                  <span className="kr8-card-photo__tag">{editableContent.texts.text_4b6e4d2f41}</span>
                </div>
                <div className="kr8-card__num">{editableContent.texts.text_8f486ddb7b}</div>
                <h2 className="kr8-card__title">{editableContent.texts.text_6149acac42}</h2>
                <ul className="kr8-check-list" style={{ marginTop: 14 }}>
                  <li>
                    <strong>{editableContent.texts.text_a0c3b838d4}</strong> {editableContent.texts.text_f7d584521c}</li>
                  <li>
                    <strong>{editableContent.texts.text_72c2d9c6a2}</strong> {editableContent.texts.text_5b796bcf7b}</li>
                  <li>
                    <strong>{editableContent.texts.text_e1542e6ab0}</strong> {editableContent.texts.text_a5cba23ae5}</li>
                </ul>
              </article>

              <article className="kr8-card">
                <div className="kr8-card__num">{editableContent.texts.text_0a9a0d978b}</div>
                <h3 className="kr8-card__title" style={{ fontSize: 19 }}>
                  {editableContent.texts.text_582e9356b1}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={formatEditableText("/services/{0}", [s.slug])}
                      className="btn-ghost btn-sm"
                    >
                      {s.short} <Icon name="arrow" size={13} />
                    </Link>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
