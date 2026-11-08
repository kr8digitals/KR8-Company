import Link from 'next/link';
import type { Metadata } from 'next';
import site from '../../../data/site.json';
import services from '../../../data/services.json';
import LeadForm from '@/components/LeadForm';
import { Icon } from '@/components/ui';
import { ResponsiveCopy, SectionAtmosphere } from '@/components/MobileExperience';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact & Project Briefs — Work With KR8 DIGITALS',
  description:
    'Request a fixed project scope for Website Design, Branding, Graphic Design, Video Editing, SEO Optimization, or AI Automation — or reach the KR8 DIGITALS team directly.',
  alternates: { canonical: '/contact' },
};

type Props = {
  searchParams: Promise<{ service?: string; site?: string; ref?: string }>;
};

export default async function ContactPage({ searchParams }: Props) {
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
                <i className="kr8-pill__dot" /> Start a Project · KR8 DIGITALS
              </span>
              <h1 className="kr8-subhero__title">
                Tell us what you are building.{' '}
                <em>Get a real scope in writing.</em>
              </h1>
              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={
                  <>
                    Every commercial engagement at <strong>KR8 DIGITALS</strong> starts with clarity: your business
                    objective, defined deliverables, timeline milestones, and a transparent fixed figure — answered
                    directly by the practitioners who will build the work.
                  </>
                }
                mobile={
                  <>
                    Share your goal in a sentence or two — receive a clear written scope, timeline, and fixed
                    quote within <strong>1 business day</strong>.
                  </>
                }
              />
            </div>

            <div className="kr8-grid-2 kr8-contact-quad" style={{ gap: 14 }}>
              <a
                href={`mailto:${site.company.email}`}
                className="kr8-card"
                style={{ textDecoration: 'none', padding: '22px 24px' }}
              >
                <div className="kr8-card__num">DIRECT EMAIL</div>
                <strong style={{ color: 'var(--t-strong)', fontSize: 13.5, overflowWrap: 'anywhere' }}>
                  {site.company.email}
                </strong>
                <span style={{ fontSize: 12.5, color: 'var(--t-sub)', marginTop: 6, display: 'block' }}>
                  Written briefs &amp; docs
                </span>
              </a>

              <a
                href={`https://wa.me/${site.company.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="kr8-card kr8-card--accent"
                style={{ textDecoration: 'none', padding: '22px 24px' }}
              >
                <div className="kr8-card__num">WHATSAPP / PHONE</div>
                <strong style={{ color: 'var(--t-strong)', fontSize: 14.5 }}>{site.company.phone}</strong>
                <span style={{ fontSize: 12.5, color: 'var(--t-sub)', marginTop: 6, display: 'block' }}>
                  Fast executive reply →
                </span>
              </a>

              <Link
                href="/partners#propose"
                className="kr8-card"
                style={{ textDecoration: 'none', padding: '22px 24px' }}
              >
                <div className="kr8-card__num">PARTNERSHIPS</div>
                <strong style={{ color: 'var(--t-strong)', fontSize: 14.5 }}>Propose an Alliance</strong>
                <span style={{ fontSize: 12.5, color: 'var(--t-sub)', marginTop: 6, display: 'block' }}>
                  Studios, schools &amp; sponsors →
                </span>
              </Link>

              <a
                href="https://academy.kr8digitals.com"
                target="_blank"
                rel="noopener noreferrer"
                className="kr8-card"
                style={{ textDecoration: 'none', padding: '22px 24px' }}
              >
                <div className="kr8-card__num">FREE TRAINING</div>
                <strong style={{ color: 'var(--t-strong)', fontSize: 14.5 }}>KR8 Academy</strong>
                <span style={{ fontSize: 12.5, color: 'var(--t-sub)', marginTop: 6, display: 'block' }}>
                  100% free admissions ↗
                </span>
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
                    src="/img/contact/scoping-session.webp"
                    alt="KR8 DIGITALS engineering and creative leads scoping a client project in a sunlit studio"
                  />
                  <span className="kr8-card-photo__tag">1 Business Day Reply</span>
                </div>
                <div className="kr8-card__num">HOW SCOPING WORKS AT KR8 DIGITALS</div>
                <h2 className="kr8-card__title">What happens after you send a brief</h2>
                <ul className="kr8-check-list" style={{ marginTop: 14 }}>
                  <li>
                    <strong>Practitioner Review:</strong> Your brief goes straight to our engineering, design, or
                    post-production lead — never a scripted call center.
                  </li>
                  <li>
                    <strong>Written Scope &amp; Fixed Figure:</strong> We reply with clear deliverables, milestone
                    dates, and a fixed quote before you commit to anything.
                  </li>
                  <li>
                    <strong>100% Client Ownership:</strong> Domains, source repositories, brand master files, and
                    final exports belong cleanly to your organisation.
                  </li>
                </ul>
              </article>

              <article className="kr8-card">
                <div className="kr8-card__num">SIX COMMERCIAL DISCIPLINES</div>
                <h3 className="kr8-card__title" style={{ fontSize: 19 }}>
                  Explore Service Specifications
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
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
