import { formatEditableText } from '@/lib/content-format';
import { getEditableDocument } from '@/lib/editable-content';
import { getSiteCatalog } from '@/lib/site-content';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getCmsServices } from '@/lib/cms';
import { Icon } from '@/components/ui';
import Showcase, { type ShowcaseMode } from '@/components/Showcase';
import Pricing from '@/components/Pricing';
import {
  MobileDisclosure,
  SectionAtmosphere,
   type CinemaAssetName,
} from '@/components/MobileExperience';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

const SERVICE_ATMO: Record<string, CinemaAssetName> = {
  'website-design': 'website-engineering-cinema',
  branding: 'services-atmosphere',
  'graphic-design': 'services-atmosphere',
  'video-editing': 'tribe-creative-room',
  seo: 'website-engineering-cinema',
  'ai-automation': 'website-engineering-cinema',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === 'brand-graphic-design') {
    return { title: 'Branding | KR8 DIGITALS' };
  }
  const services = await getCmsServices();
  const s = services.find((x: any) => x.slug === slug);
  if (!s) return { title: 'Service Not Found | KR8 DIGITALS' };
  return {
    title: `${s.name} — ${s.tagline} | KR8 DIGITALS`,
    description: s.summary,
    alternates: { canonical: `/services/${s.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const editableContent = await getEditableDocument("app:services:[slug]:page");

  const { slug } = await params;

  if (slug === 'brand-graphic-design') {
    redirect('/services/branding');
  }

  const services = await getCmsServices();
  const service = services.find((x: any) => x.slug === slug);
  if (!service) notFound();

  const others = services.filter((x: any) => x.slug !== service.slug);
  const heroAtmo = SERVICE_ATMO[service.slug] || 'services-atmosphere';

  return (
    <>
      {/* ============================================================ HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name={heroAtmo} deskOpacity={0.16} mobOpacity={0.28} flare />
        <div className="wrap">
          <nav className="kr8-breadcrumb" aria-label={editableContent.texts.field_2bd873d6c7}>
            <Link href="/">{editableContent.texts.text_3a78695388}</Link>
            <span>/</span>
            <Link href={editableContent.texts.field_3b1aeccb74}>{editableContent.texts.text_604dce445e}</Link>
            <span>/</span>
            <span style={{ color: 'var(--t-strong)' }}>{service.name}</span>
          </nav>

          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill">
                <i className="kr8-pill__dot" /> {editableContent.texts.text_57dc8930b7}{service.order} {editableContent.texts.text_a95e56ac61}</span>
              <h1 className="kr8-subhero__title">{service.name}</h1>
              <p
                style={{
                  marginTop: 12,
                  fontSize: 'clamp(16px, 1.5vw, 22px)',
                  fontWeight: 600,
                  color: 'var(--t-accent-soft)',
                  lineHeight: 1.4,
                }}
              >
                {service.tagline}
              </p>
              <p className="kr8-subhero__lede" style={{ marginTop: 12 }}>
                {service.summary}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 16 }}>
                {service.categories.map((c: string) => (
                  <span className="tag" key={c}>
                    {c}
                  </span>
                ))}
              </div>

              <div className="kr8-subhero__actions">
                <Link href={formatEditableText("/contact?service={0}", [service.slug])} className="btn-primary">
                  {service.cta} <Icon name="arrow" size={17} />
                </Link>
                <a href={editableContent.texts.field_3f5e93f798} className="btn-ghost">
                  {editableContent.texts.text_1c06746715}</a>
              </div>
            </div>

            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={service.heroImage} alt={formatEditableText(editableContent.texts.copy_37d293a3e4, [service.name])} />
              <div className="kr8-subhero__badge">
                <div>
                  <span>{editableContent.texts.text_8267926758}</span>
                  <strong>{service.name}</strong>
                </div>
                <Link
                  href={formatEditableText("/contact?service={0}", [service.slug])}
                  className="btn-link"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {editableContent.texts.text_6d560425ea}<Icon name="arrow" size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ WHO IT'S FOR & PROBLEM SOLVED */}
      <section className="section">
        <div className="wrap">
          <div className="kr8-grid-2">
            <article className="kr8-card">
              <div className="kr8-card__num">{editableContent.texts.text_a62d21afd3}</div>
              <h2 className="kr8-card__title">{editableContent.texts.text_aeae31f3a9}</h2>
              <p className="kr8-card__body">{service.forWhom}</p>
            </article>

            <article className="kr8-card kr8-card--accent">
              <div className="kr8-card__num">{editableContent.texts.text_c99258c680}</div>
              <h2 className="kr8-card__title">{editableContent.texts.text_520731a40b}</h2>
              <p className="kr8-card__body">{service.problem}</p>
            </article>
          </div>

          <div className="kr8-grid-3" style={{ marginTop: 22 }}>
            <article className="kr8-card">
              <div className="kr8-card__num">{editableContent.texts.text_52cae1e20f}</div>
              <h3 className="kr8-card__title">{editableContent.texts.text_251e7b4a8c}</h3>
              <ul className="kr8-check-list">
                {service.approach.map((a: string) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </article>

            <article className="kr8-card">
              <div className="kr8-card__num">{editableContent.texts.text_e6f8e680da}</div>
              <h3 className="kr8-card__title">{editableContent.texts.text_79e8189834}</h3>
              <ul className="kr8-check-list">
                {service.outcomes.map((o: string) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </article>

            <article className="kr8-card">
              <div className="kr8-card__num">{editableContent.texts.text_5162f1bc34}</div>
              <h3 className="kr8-card__title">{editableContent.texts.text_08c3142ccc}</h3>
              <ul className="kr8-check-list">
                {service.deliverables.map((d: string) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* ========================================= 4-STEP PROCESS */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <SectionAtmosphere name="services-atmosphere" deskOpacity={0.11} mobOpacity={0.2} flare />
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{editableContent.texts.text_cc4522954f}</div>
              <h2 className="section-title">
                {editableContent.texts.text_7bf2840ce7}<span className="text-grad">{editableContent.texts.text_da6bcde3b4}</span>
              </h2>
            </div>
          </div>

          <div className="kr8-grid-4" style={{ marginTop: 26 }}>
            {service.process.map((st: any) => (
              <div className="kr8-card reveal up" key={st.n} style={{ padding: '24px 26px' }}>
                <div className="kr8-card__num">{editableContent.texts.text_94bccdb1d5}{st.n}</div>
                <h3 className="kr8-card__title" style={{ fontSize: 19 }}>
                  {st.t}
                </h3>
                <p className="kr8-card__body" style={{ fontSize: 14 }}>
                  {st.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================= LIVE PORTFOLIO */}
      <section
        className="section"
        id="live-proof"
        style={{ borderTop: '1px solid var(--hair-soft)', scrollMarginTop: 92 }}
      >
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{editableContent.texts.text_a110fc1fc6}</div>
              <h2 className="section-title">
                {editableContent.texts.text_697547a35a}{service.short.toLowerCase()} {editableContent.texts.text_dc65230477}</h2>
            </div>
            <Link href={formatEditableText("/contact?service={0}", [service.slug])} className="btn-primary">
              {service.cta} <Icon name="arrow" size={16} />
            </Link>
          </div>

          <div style={{ marginTop: 26 }}>
            <Showcase catalog={await getSiteCatalog()} mode={service.gallery as ShowcaseMode} />
          </div>
        </div>
      </section>

      {/* ========================================= PRICING & FAQ */}
      <Pricing slug={service.slug === 'branding' || service.slug === 'graphic-design' ? 'brand-graphic-design' : service.slug} />

      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{editableContent.texts.text_dfbe4d437b}</div>
              <h2 className="section-title">{service.name} {editableContent.texts.text_b65c2b5de2}</h2>
            </div>
          </div>

          {/* Desktop 3-column FAQ cards preserved 100% */}
          <div className="kr8-grid-3 kr8-desk-only" style={{ marginTop: 32 }}>
            {service.faqs.map((f: any) => (
              <article className="kr8-card reveal up" key={f.q}>
                <h3 className="kr8-card__title" style={{ fontSize: 18.5 }}>
                  {f.q}
                </h3>
                <p className="kr8-card__body" style={{ fontSize: 14.5 }}>
                  {f.a}
                </p>
              </article>
            ))}
          </div>

          {/* Mobile progressive-disclosure FAQ accordions — zero lost information */}
          <div className="kr8-mob-only" style={{ display: 'grid', gap: 10, marginTop: 18 }}>
            {service.faqs.map((f: any, idx: number) => (
              <MobileDisclosure key={f.q} label={f.q} defaultOpenMobile={idx === 0}>
                <p>{f.a}</p>
              </MobileDisclosure>
            ))}
          </div>

          {/* Cross-navigation to remaining 5 services */}
          <div style={{ marginTop: 44 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>
              {editableContent.texts.text_041ce3f2f6}</div>
            <div className="kr8-grid-3">
              {others.slice(0, 3).map((o: any) => (
                <Link
                  href={formatEditableText("/services/{0}", [o.slug])}
                  key={o.slug}
                  className="kr8-card"
                  style={{ textDecoration: 'none', padding: '22px 24px' }}
                >
                  <div className="kr8-card__num">{editableContent.texts.text_2cdae4a9f6}{o.order}</div>
                  <h3 className="kr8-card__title" style={{ fontSize: 20 }}>
                    {o.name}
                  </h3>
                  <p className="kr8-card__body" style={{ fontSize: 13.8 }}>
                    {o.tagline}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
