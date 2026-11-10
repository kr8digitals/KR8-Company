import CmsSections from '@/components/CmsSections';
import { formatEditableText } from '@/lib/content-format';
import { getEditableDocument } from '@/lib/editable-content';
import { getSiteCatalog } from '@/lib/site-content';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getCmsPageBySlug, getCmsSeoForRoute, getCmsServices } from '@/lib/cms';
import { Icon } from '@/components/ui';
import Showcase, { type ShowcaseMode } from '@/components/Showcase';
import { ResponsiveCopy, SectionAtmosphere } from '@/components/MobileExperience';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getCmsSeoForRoute('/services');
  return {
    title: seo?.metaTitle || 'Services — Websites, Branding, Graphic Design, Video Editing, SEO & AI | KR8 DIGITALS',
    description:
      seo?.metaDescription ||
      'Explore all six commercial disciplines at KR8 DIGITALS: Website Design & Development, Branding, Graphic Design, Video Editing, SEO Optimization, and AI Agent & Automation.',
    alternates: { canonical: '/services' },
    robots: seo?.noindex ? { index: false, follow: false } : undefined,
  };
}

const DIAGNOSTIC_ROUTES = [
  {
    problem: '“Our website feels outdated, loads slowly on mobile, or fails to convert visitors.”',
    service: 'Website Design & Development',
    href: '/services/website-design',
  },
  {
    problem: '“Our logo, colors, and brand presence look inconsistent across touchpoints.”',
    service: 'Branding & Identity Systems',
    href: '/services/branding',
  },
  {
    problem: '“Our campaign flyers and social graphics get scrolled past without action.”',
    service: 'Commercial Graphic Design',
    href: '/services/graphic-design',
  },
  {
    problem: '“We have raw footage and client stories sitting unedited on camera rolls.”',
    service: 'Video Editing & Post-Production',
    href: '/services/video-editing',
  },
  {
    problem: '“Buyers searching Google for what we offer find our competitors instead of us.”',
    service: 'SEO Optimization',
    href: '/services/seo',
  },
  {
    problem: '“Our team spends hours answering repetitive enquiries and routing leads manually.”',
    service: 'AI Agent & Automation',
    href: '/services/ai-automation',
  },
];

const MOBILE_SERVICE_SUMMARIES: Record<string, string> = {
  'website-design':
    'Custom Next.js sites, client portals, e-commerce, and 18 ready-built launch sites ($450–$1,900) engineered for speed and conversion.',
  branding:
    'Complete brand positioning, vector logo suites, typography, color systems, and Brand Playbooks led by Motionverse.',
  'graphic-design':
    'High-converting event flyers, product key art, pitch decks, and social design systems tailored for digital and print.',
  'video-editing':
    'Retention-cut vertical reels, launch promos, documentary stories, and color-graded edits led by Chigoma.',
  seo:
    'Technical Core Web Vitals, schema markup, local search rankings, and intent-driven content architecture.',
  'ai-automation':
    'Grounded 24/7 AI receptionists, WhatsApp/CRM lead routing, and custom workflow automations built by Timfire.',
};

export default async function ServicesPage() {
  const editableContent = await getEditableDocument("app:services:page");
  const DIAGNOSTIC_ROUTES = editableContent.blocks.DIAGNOSTIC_ROUTES as EditableBlockTypes["DIAGNOSTIC_ROUTES"];
  const MOBILE_SERVICE_SUMMARIES = editableContent.blocks.MOBILE_SERVICE_SUMMARIES as EditableBlockTypes["MOBILE_SERVICE_SUMMARIES"];

  const sitesData = await getSiteCatalog();
  const [publishedServices, pageDoc] = await Promise.all([
    getCmsServices(),
    getCmsPageBySlug('services'),
  ]);

  return (
    <>
      {/* ============================================================ HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name="website-engineering-cinema" deskOpacity={0.16} mobOpacity={0.28} flare />
        <div className="wrap">
          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill">
                <i className="kr8-pill__dot" /> {pageDoc?.eyebrow || editableContent.texts.copy_8fc76601be}
              </span>
              <h1 className="kr8-subhero__title">
                {pageDoc?.heroTitle || editableContent.texts.copy_9734c89fc4}{' '}
                <em>{pageDoc?.heroHighlight || editableContent.texts.copy_f0c5255537}</em>
              </h1>
              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={
                  pageDoc?.heroLede ||
                  editableContent.texts.copy_186def940b
                }
                mobile={editableContent.texts.field_4b80f7092e}
              />
              <div className="kr8-subhero__actions">
                <Link href={editableContent.texts.field_4eb9506365} className="btn-primary">
                  {editableContent.texts.text_98ee7ba71e}<Icon name="arrow" size={17} />
                </Link>
                <a href={editableContent.texts.field_b2db58732f} className="btn-ghost">
                  {editableContent.texts.text_5b4c85d789}</a>
              </div>
            </div>

            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={editableContent.texts.field_ff837143d1}
                alt={editableContent.texts.field_f7bd4fd15d}
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>{editableContent.texts.text_9650bb7598}</span>
                  <strong>
                    {sitesData.sites.length} {editableContent.texts.text_348471df26}</strong>
                </div>
                <Link href={editableContent.texts.field_4eb9506365} className="btn-link" style={{ whiteSpace: 'nowrap' }}>
                  {editableContent.texts.text_429dc95d12}<Icon name="arrow" size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================== SIX-SERVICE MATRIX */}
      <section className="section" id="service-matrix">
        <SectionAtmosphere name="services-atmosphere" deskOpacity={0.13} mobOpacity={0.22} flare />
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{editableContent.texts.text_9a95dd348b}</div>
              <h2 className="section-title">
                {editableContent.texts.text_bcac3e5d03}<span className="text-grad">{editableContent.texts.text_5f7d4ff28a}</span>
              </h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop={editableContent.texts.field_67bb4b813b}
                mobile={editableContent.texts.field_3c87f664ec}
              />
            </div>
          </div>

          <div className="kr8-grid-3" style={{ marginTop: 32 }}>
            {publishedServices.map((s, idx) => (
              <article
                className={`kr8-card ${idx === 0 ? 'kr8-card--accent' : ''} reveal up`}
                key={s.slug}
              >
                <div className="kr8-card__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.heroImage} alt={formatEditableText(editableContent.texts.copy_b3e1e6cbcd, [s.name])} loading="lazy" />
                </div>
                <div className="kr8-card__num">
                  {editableContent.texts.text_9c4a4ad229}{String(idx + 1).padStart(2, '0')} · {s.short}
                </div>
                <h3 className="kr8-card__title">{s.name}</h3>
                <ResponsiveCopy
                  as="p"
                  className="kr8-card__body"
                  desktop={s.summary}
                  mobile={MOBILE_SERVICE_SUMMARIES[s.slug] || s.summary}
                />
                <ul className="kr8-check-list" style={{ marginTop: 14 }}>
                  {s.deliverables.slice(0, 3).map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <div className="kr8-card__foot">
                  <Link href={formatEditableText("/services/{0}", [s.slug])} className="btn-link">
                    {editableContent.texts.text_4c4e5f812f}<Icon name="arrow" size={14} />
                  </Link>
                  <a href={`#${s.anchor}`} className="btn-link" style={{ opacity: 0.78 }}>
                    {editableContent.texts.text_43fcf769a1}</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ PROBLEM -> SOLUTION DIAGNOSTIC */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{editableContent.texts.text_c3a8a3f7f0}</div>
              <h2 className="section-title">
                {editableContent.texts.text_1a3f94a444}<span className="text-grad">{editableContent.texts.text_ee39b96546}</span>
              </h2>
            </div>
          </div>

          <div className="kr8-grid-3" style={{ marginTop: 26 }}>
            {DIAGNOSTIC_ROUTES.map((d) => (
              <Link
                href={d.href}
                key={d.href}
                className="kr8-card reveal up"
                style={{ textDecoration: 'none', padding: '24px 26px' }}
              >
                <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--t-strong)', fontWeight: 500 }}>{d.problem}</p>
                <div className="kr8-card__foot" style={{ paddingTop: 14 }}>
                  <span className="btn-link">
                    {d.service} <Icon name="arrow" size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ LIVE SHOWCASE PER SERVICE */}
      {publishedServices.map((s, idx) => (
        <section
          className="section"
          id={s.anchor}
          key={s.slug}
          style={{ borderTop: '1px solid var(--hair-soft)', scrollMarginTop: 92 }}
        >
          <div className="wrap">
            <div className="sec-head reveal up">
              <div>
                <div className="eyebrow">
                  {String(idx + 1).padStart(2, '0')} · {s.name}
                </div>
                <h2 className="section-title">{s.tagline}</h2>
                <ResponsiveCopy
                  as="p"
                  className="section-lede"
                  desktop={s.summary}
                  mobile={MOBILE_SERVICE_SUMMARIES[s.slug] || s.summary}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <Link href={formatEditableText("/services/{0}", [s.slug])} className="btn-ghost">
                  {editableContent.texts.text_66036c01a0}{s.short} {editableContent.texts.text_b073f6c68e}</Link>
                <Link href={formatEditableText("/contact?service={0}", [s.slug])} className="btn-primary">
                  {s.cta} <Icon name="arrow" size={16} />
                </Link>
              </div>
            </div>

            <div style={{ marginTop: 26 }}>
              <Showcase catalog={sitesData}
                mode={s.gallery as ShowcaseMode}
                limit={s.gallery === 'sites' ? 6 : undefined}
              />
            </div>

            {s.gallery === 'sites' && (
              <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center' }}>
                <Link href={editableContent.texts.field_8b058c1ad9} className="btn-ghost">
                  {editableContent.texts.text_7618820c9b}{sitesData.sites.length} {editableContent.texts.text_145a9bcc06}<Icon name="arrow" size={15} />
                </Link>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* ================================================= CLOSING CTA */}
      <section className="section" style={{ paddingTop: 12 }}>
        <div className="wrap">
          <div className="kr8-cta-banner reveal up">
            <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.45} mobOpacity={0.55} flare />
            <div>
              <span className="kr8-pill">{editableContent.texts.text_a83bc4dca1}</span>
              <h2 className="section-title" style={{ marginTop: 14 }}>
                {editableContent.texts.text_c22f19fda2}</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop={editableContent.texts.field_8a37074238}
                mobile={editableContent.texts.field_706baab178}
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href={editableContent.texts.field_4eb9506365} className="btn-primary">
                {editableContent.texts.text_807cb8165d}<Icon name="arrow" size={17} />
              </Link>
              <Link href={editableContent.texts.field_6d0f8c425c} className="btn-ghost">
                {editableContent.texts.text_c8e3d99e54}</Link>
            </div>
          </div>
        </div>
      </section>
      <CmsSections sections={pageDoc?.sections || []} />
    </>
  );
}

type EditableBlockTypes = { DIAGNOSTIC_ROUTES: typeof DIAGNOSTIC_ROUTES; MOBILE_SERVICE_SUMMARIES: typeof MOBILE_SERVICE_SUMMARIES };
