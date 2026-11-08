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
          <nav className="kr8-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/services">Services</Link>
            <span>/</span>
            <span style={{ color: '#fff' }}>{service.name}</span>
          </nav>

          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill">
                <i className="kr8-pill__dot" /> Service 0{service.order} · KR8 DIGITALS
              </span>
              <h1 className="kr8-subhero__title">{service.name}</h1>
              <p
                style={{
                  marginTop: 12,
                  fontSize: 'clamp(16px, 1.5vw, 22px)',
                  fontWeight: 600,
                  color: '#f5d0fe',
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
                <Link href={`/contact?service=${service.slug}`} className="btn-primary">
                  {service.cta} <Icon name="arrow" size={17} />
                </Link>
                <a href="#live-proof" className="btn-ghost">
                  Inspect Live Work
                </a>
              </div>
            </div>

            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={service.heroImage} alt={`${service.name} — KR8 DIGITALS`} />
              <div className="kr8-subhero__badge">
                <div>
                  <span>Commercial Delivery</span>
                  <strong>{service.name}</strong>
                </div>
                <Link
                  href={`/contact?service=${service.slug}`}
                  className="btn-link"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Get Scope <Icon name="arrow" size={13} />
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
              <div className="kr8-card__num">01 · WHO THIS IS BUILT FOR</div>
              <h2 className="kr8-card__title">Organisations &amp; Leaders We Serve</h2>
              <p className="kr8-card__body">{service.forWhom}</p>
            </article>

            <article className="kr8-card kr8-card--accent">
              <div className="kr8-card__num">02 · THE COMMERCIAL BOTTLENECK</div>
              <h2 className="kr8-card__title">Why Generic Execution Costs Revenue</h2>
              <p className="kr8-card__body">{service.problem}</p>
            </article>
          </div>

          <div className="kr8-grid-3" style={{ marginTop: 22 }}>
            <article className="kr8-card">
              <div className="kr8-card__num">OUR APPROACH</div>
              <h3 className="kr8-card__title">How We Engineer Results</h3>
              <ul className="kr8-check-list">
                {service.approach.map((a: string) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </article>

            <article className="kr8-card">
              <div className="kr8-card__num">MEASURABLE OUTCOMES</div>
              <h3 className="kr8-card__title">What Changes After Launch</h3>
              <ul className="kr8-check-list">
                {service.outcomes.map((o: string) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </article>

            <article className="kr8-card">
              <div className="kr8-card__num">INCLUDED DELIVERABLES</div>
              <h3 className="kr8-card__title">What You Receive</h3>
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
              <div className="eyebrow">Execution Workflow</div>
              <h2 className="section-title">
                Four clear steps <span className="text-grad">from brief to handover.</span>
              </h2>
            </div>
          </div>

          <div className="kr8-grid-4" style={{ marginTop: 26 }}>
            {service.process.map((st: any) => (
              <div className="kr8-card reveal up" key={st.n} style={{ padding: '24px 26px' }}>
                <div className="kr8-card__num">STEP {st.n}</div>
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
              <div className="eyebrow">Shipped Work &amp; Proof</div>
              <h2 className="section-title">
                Inspect real {service.short.toLowerCase()} deliverables.
              </h2>
            </div>
            <Link href={`/contact?service=${service.slug}`} className="btn-primary">
              {service.cta} <Icon name="arrow" size={16} />
            </Link>
          </div>

          <div style={{ marginTop: 26 }}>
            <Showcase mode={service.gallery as ShowcaseMode} />
          </div>
        </div>
      </section>

      {/* ========================================= PRICING & FAQ */}
      <Pricing slug={service.slug === 'branding' || service.slug === 'graphic-design' ? 'brand-graphic-design' : service.slug} />

      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Common Questions</div>
              <h2 className="section-title">{service.name} — FAQs.</h2>
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
              Explore Other KR8 DIGITALS Services
            </div>
            <div className="kr8-grid-3">
              {others.slice(0, 3).map((o: any) => (
                <Link
                  href={`/services/${o.slug}`}
                  key={o.slug}
                  className="kr8-card"
                  style={{ textDecoration: 'none', padding: '22px 24px' }}
                >
                  <div className="kr8-card__num">SERVICE 0{o.order}</div>
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
