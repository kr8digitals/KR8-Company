import Link from 'next/link';
import type { Metadata } from 'next';
import sitesData from '../../../data/sites.json';
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
                <i className="kr8-pill__dot" /> {pageDoc?.eyebrow || 'Six Commercial Disciplines · One Standard'}
              </span>
              <h1 className="kr8-subhero__title">
                {pageDoc?.heroTitle || 'Every digital layer that makes your organisation'}{' '}
                <em>{pageDoc?.heroHighlight || 'found, trusted, and chosen.'}</em>
              </h1>
              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={
                  pageDoc?.heroLede ||
                  'KR8 DIGITALS brings engineering, brand strategy, graphic design, film editing, search visibility, and applied AI under one accountable roof. Explore our six commercial services below — each backed by real, inspectable client deliverables.'
                }
                mobile="Websites, brand identity, campaign design, video editing, SEO, and AI automation under one accountable roof — backed by 200+ shipped works."
              />
              <div className="kr8-subhero__actions">
                <Link href="/contact" className="btn-primary">
                  Request a Written Scope <Icon name="arrow" size={17} />
                </Link>
                <a href="#service-matrix" className="btn-ghost">
                  Compare All 6 Services
                </a>
              </div>
            </div>

            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/sites/afristem-full.webp"
                alt="Live commercial digital platform engineered by KR8 DIGITALS"
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>Verified Live Portfolio</span>
                  <strong>
                    {sitesData.sites.length} Live Web Builds · Brand Systems · Campaign Reels
                  </strong>
                </div>
                <Link href="/contact" className="btn-link" style={{ whiteSpace: 'nowrap' }}>
                  Start Brief <Icon name="arrow" size={13} />
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
              <div className="eyebrow">Commercial Capabilities</div>
              <h2 className="section-title">
                Six distinct services. <span className="text-grad">Zero guesswork.</span>
              </h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop="Commission a single focused engagement — such as a website build, a complete brand identity, or a campaign graphic suite — or combine disciplines seamlessly on one project scope."
                mobile="Commission one focused build or combine web, brand, video, SEO, and AI into a single milestone scope."
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
                  <img src={s.heroImage} alt={`${s.name} — KR8 DIGITALS commercial service`} loading="lazy" />
                </div>
                <div className="kr8-card__num">
                  SERVICE {String(idx + 1).padStart(2, '0')} · {s.short}
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
                  <Link href={`/services/${s.slug}`} className="btn-link">
                    Service Details <Icon name="arrow" size={14} />
                  </Link>
                  <a href={`#${s.anchor}`} className="btn-link" style={{ opacity: 0.78 }}>
                    See Proof ↓
                  </a>
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
              <div className="eyebrow">Where Should We Start?</div>
              <h2 className="section-title">
                Match the bottleneck you are facing <span className="text-grad">to the right craft.</span>
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
                <p style={{ fontSize: 15, lineHeight: 1.55, color: '#fff', fontWeight: 500 }}>{d.problem}</p>
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
                <Link href={`/services/${s.slug}`} className="btn-ghost">
                  Full {s.short} Scope
                </Link>
                <Link href={`/contact?service=${s.slug}`} className="btn-primary">
                  {s.cta} <Icon name="arrow" size={16} />
                </Link>
              </div>
            </div>

            <div style={{ marginTop: 26 }}>
              <Showcase
                mode={s.gallery as ShowcaseMode}
                limit={s.gallery === 'sites' ? 6 : undefined}
              />
            </div>

            {s.gallery === 'sites' && (
              <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center' }}>
                <Link href="/services/website-design" className="btn-ghost">
                  Explore All {sitesData.sites.length} Deployed Websites <Icon name="arrow" size={15} />
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
              <span className="kr8-pill">Transparent Fixed Scopes</span>
              <h2 className="section-title" style={{ marginTop: 14 }}>
                Tell us what your organisation needs to launch, fix, or scale.
              </h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop="Every project is scoped clearly in writing with defined deliverables, timeline milestones, and a transparent fixed figure before work begins."
                mobile="Defined deliverables, clear milestones, and a fixed written quote in USD or NGN within 1 business day."
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/contact" className="btn-primary">
                Request a Project Quote <Icon name="arrow" size={17} />
              </Link>
              <Link href="/partners" className="btn-ghost">
                Agency &amp; Org Partnerships
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
