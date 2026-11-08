import Link from 'next/link';
import type { Metadata } from 'next';
import programmesSeed from '../../../data/programmes.json';
import { getCmsPageBySlug, getCmsPrograms, getCmsSeoForRoute } from '@/lib/cms';
import { Icon } from '@/components/ui';
import {
  MobileDisclosure,
  ResponsiveCopy,
  SectionAtmosphere,
} from '@/components/MobileExperience';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getCmsSeoForRoute('/programs');
  return {
    title:
      seo?.metaTitle ||
      'Programs — Free Digital Training, KR8 DIGITALS TRIBE, Mindset Shift & Studio Pathway',
    description:
      seo?.metaDescription ||
      'Explore KR8 DIGITALS ecosystem programs: 100% tuition-free digital skills and academic training, KR8 DIGITALS TRIBE community, Mindset Shift leadership forum, and Join the Team.',
    alternates: { canonical: '/programs' },
    robots: seo?.noindex ? { index: false, follow: false } : undefined,
  };
}

const AUDIENCE_FIT = [
  {
    slug: 'free-training',
    who: 'Aspiring Designers, Developers, Editors & Secondary Students',
    gain: 'Structured practical mentorship across 7 digital tracks via KR8 Academy or WAEC/JAMB academic excellence via Next Gen Scholars — 100% tuition-free.',
  },
  {
    slug: 'tribe',
    who: 'Working Creatives, Academy Alumni & Self-Taught Builders',
    gain: 'Honest work-in-progress critique, interdisciplinary sprint teams, peer accountability, and shared creative opportunities.',
  },
  {
    slug: 'mindset-shift',
    who: 'Young Founders, Freelancers, Students & Ambitious Professionals',
    gain: 'Candid practitioner conversations on career longevity, discipline, ethical value creation, and execution habits.',
  },
  {
    slug: 'join-the-team',
    who: 'Proven Engineers, Designers, Video Editors & SEO Specialists',
    gain: 'Merit-based onboarding onto real commercial client deliveries inside the KR8 DIGITALS studio.',
  },
];

export default async function ProgramsPage() {
  const [cmsPrograms, pageDoc] = await Promise.all([
    getCmsPrograms(),
    getCmsPageBySlug('programs'),
  ]);
  const programmes = {
    ...programmesSeed,
    programmes: cmsPrograms,
  };
  return (
    <>
      {/* ============================================================ HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name="academy-cohort-cinema" deskOpacity={0.18} mobOpacity={0.3} flare />
        <div className="wrap">
          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill">
                <i className="kr8-pill__dot" /> {pageDoc?.eyebrow || programmes.intro.eyebrow}
              </span>
              <h1 className="kr8-subhero__title">
                {pageDoc?.heroTitle || 'Human capacity built alongside'}{' '}
                <em>{pageDoc?.heroHighlight || 'commercial craft.'}</em>
              </h1>
              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={pageDoc?.heroLede || programmes.intro.lede}
                mobile="Four 100% free human-capacity pathways ($0 / ₦0): KR8 Academy & Next Gen Scholars, our 3,000+ creator Tribe, Mindset Shift, and Join the Team."
              />
              <div className="kr8-subhero__actions">
                <a
                  href="https://academy.kr8digitals.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Explore KR8 Academy <Icon name="external" size={16} />
                </a>
                <a href="#program-lineup" className="btn-ghost">
                  Compare All 4 Programs
                </a>
              </div>
            </div>

            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={programmes.intro.image} alt={programmes.intro.imageAlt} />
              <div className="kr8-subhero__badge">
                <div>
                  <span>Zero Tuition Gatekeeping</span>
                  <strong>KR8 Academy · Next Gen Scholars · KR8 Tribe</strong>
                </div>
                <Link href="/tribe" className="btn-link" style={{ whiteSpace: 'nowrap' }}>
                  Join Tribe <Icon name="arrow" size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================== COMMERCIAL SERVICES VS ECOSYSTEM PROGRAMS */}
      <section className="section" style={{ paddingBottom: 24 }}>
        <div className="wrap">
          <div className="kr8-grid-2">
            <div className="kr8-card kr8-card--accent">
              <div className="kr8-card__num">HERE FOR HUMAN CAPACITY · PROGRAMS</div>
              <h2 className="kr8-card__title">If you are here to learn, belong, or build with us</h2>
              <ResponsiveCopy
                as="p"
                className="kr8-card__body"
                desktop="Our four ecosystem programs exist for learners, creatives, students, and builders — offering tuition-free skill education, peer community, leadership conversations, and studio career pathways."
                mobile="For learners, students, and creatives: 100% free skill cohorts, WAEC/JAMB prep, peer critique, and studio roles."
              />
            </div>
            <div className="kr8-card">
              <div className="kr8-card__num">HIRING FOR YOUR BUSINESS? · COMMERCIAL SERVICES</div>
              <h2 className="kr8-card__title">If you run an organisation commissioning digital work</h2>
              <ResponsiveCopy
                as="p"
                className="kr8-card__body"
                desktop="Looking to hire KR8 DIGITALS for custom Website Design, Branding, Graphic Design, Video Editing, SEO Optimization, or AI Automation? Head directly to our commercial services hub."
                mobile="Need a custom website, brand identity, graphic suite, video edit, SEO, or AI agent? Explore our commercial studio."
              />
              <div className="kr8-card__foot">
                <Link href="/services" className="btn-link">
                  Go to Commercial Services <Icon name="arrow" size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= ALL 4 PROGRAMS IN DEPTH */}
      <section className="section" id="program-lineup">
        <SectionAtmosphere name="nextgen-scholars-cinema" deskOpacity={0.11} mobOpacity={0.2} flare />
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Four Structured Initiatives</div>
              <h2 className="section-title">
                Every pathway inside the <span className="text-grad">KR8 DIGITALS ecosystem.</span>
              </h2>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 26, marginTop: 28 }}>
            {programmes.programmes.map((p: any, idx: number) => {
              const fit = AUDIENCE_FIT.find((a) => a.slug === p.slug);
              const pillClass =
                p.status === 'open' || p.status === 'active'
                  ? 'kr8-pill kr8-pill--green'
                  : 'kr8-pill kr8-pill--amber';

              return (
                <article
                  className="kr8-card reveal up"
                  id={p.slug}
                  key={p.slug}
                  style={{ scrollMarginTop: 96, padding: 'clamp(20px, 3.2vw, 40px)' }}
                >
                  <div className="kr8-grid-2 prog-split-grid" style={{ alignItems: 'center', gap: 28 }}>
                    <div className={idx % 2 === 1 ? 'prog-col-text--alt' : 'prog-col-text'}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                        <span className="kr8-card__num" style={{ marginBottom: 0 }}>
                          PROGRAM {String(idx + 1).padStart(2, '0')} · {p.type}
                        </span>
                        <span className={pillClass}>
                          <i className="kr8-pill__dot" /> {p.statusLabel}
                        </span>
                      </div>

                      <h3
                        className="kr8-card__title"
                        style={{ fontSize: 'clamp(21px, 2.6vw, 34px)', marginTop: 12 }}
                      >
                        {p.name}
                      </h3>
                      <p
                        style={{
                          marginTop: 8,
                          fontSize: 15,
                          fontWeight: 500,
                          color: 'var(--t-strong)',
                          lineHeight: 1.52,
                        }}
                      >
                        {p.lede}
                      </p>

                      {/* Desktop full program detail; Mobile progressive disclosure */}
                      <div className="kr8-desk-only">
                        <p className="kr8-card__body" style={{ marginTop: 12 }}>
                          {p.body}
                        </p>
                        {fit && (
                          <div
                            style={{
                              marginTop: 18,
                              padding: '14px 18px',
                              borderRadius: 14,
                              background: 'var(--surface-subtle)',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            <div
                              style={{
                                fontFamily: 'var(--f-mono)',
                                fontSize: 11,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                color: 'var(--magenta)',
                              }}
                            >
                              Who This Is Built For · {fit.who}
                            </div>
                            <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6, color: 'var(--t-body)' }}>
                              {fit.gain}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="kr8-mob-only">
                        <MobileDisclosure label={`Program details & who ${p.name} is for`}>
                          <p>{p.body}</p>
                          {fit && (
                            <p>
                              <strong>Built for {fit.who}:</strong> {fit.gain}
                            </p>
                          )}
                        </MobileDisclosure>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                        {p.tracks.map((t: string) => (
                          <span className="tag" key={t}>
                            {t}
                          </span>
                        ))}
                      </div>

                      {'editionsNote' in p && p.editionsNote && (
                        <p
                          style={{
                            marginTop: 12,
                            fontSize: 12.5,
                            color: 'var(--t-sub)',
                            fontStyle: 'italic',
                          }}
                        >
                          {p.editionsNote}
                        </p>
                      )}

                      <div className="kr8-subhero__actions" style={{ marginTop: 18 }}>
                        {p.action.outbound ? (
                          <a
                            href={p.action.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                          >
                            {p.action.label} <Icon name="external" size={16} />
                          </a>
                        ) : (
                          <Link href={p.action.href} className="btn-primary">
                            {p.action.label} <Icon name="arrow" size={16} />
                          </Link>
                        )}
                        <span style={{ fontSize: 12.5, color: 'var(--t-sub)' }}>{p.commitment}</span>
                      </div>
                    </div>

                    <div className={idx % 2 === 1 ? 'prog-col-media--alt' : 'prog-col-media'}>
                      <div className="kr8-subhero__frame">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.imageAlt} loading="lazy" />
                      </div>

                      {p.doors && p.doors.length > 0 && (
                        <div className="kr8-grid-2" style={{ marginTop: 14, gap: 12 }}>
                          {p.doors.map((d: any) => (
                            <div
                              key={d.name}
                              style={{
                                padding: 15,
                                borderRadius: 14,
                                background: 'var(--surface-subtle)',
                                border: '1px solid var(--border-subtle)',
                              }}
                            >
                              <div className="kr8-card__num" style={{ marginBottom: 4 }}>
                                {d.partner}
                              </div>
                              <strong style={{ display: 'block', fontSize: 14.5, color: 'var(--t-strong)' }}>{d.name}</strong>
                              <p style={{ fontSize: 12.8, lineHeight: 1.5, color: 'var(--t-sub)', marginTop: 5 }}>
                                {d.line}
                              </p>
                              <div style={{ marginTop: 10 }}>
                                {d.outbound ? (
                                  <a
                                    href={d.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-link"
                                  >
                                    {d.cta} <Icon name="external" size={13} />
                                  </a>
                                ) : (
                                  <Link href={d.href} className="btn-link">
                                    {d.cta} <Icon name="arrow" size={13} />
                                  </Link>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================= ECOSYSTEM PRINCIPLES */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Program Standards</div>
              <h2 className="section-title">How every KR8 DIGITALS initiative is run.</h2>
            </div>
          </div>

          <div className="kr8-grid-3" style={{ marginTop: 26 }}>
            {programmes.principles.map((pr, i) => (
              <article className="kr8-card reveal up" key={pr.t}>
                <div className="kr8-card__num">PRINCIPLE 0{i + 1}</div>
                <h3 className="kr8-card__title">{pr.t}</h3>
                <p className="kr8-card__body">{pr.d}</p>
              </article>
            ))}
          </div>

          <div className="kr8-cta-banner reveal up" style={{ marginTop: 36 }}>
            <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.45} mobOpacity={0.55} flare />
            <div>
              <span className="kr8-pill">Institutional &amp; Educational Sponsors</span>
              <h2 className="section-title" style={{ marginTop: 14 }}>
                Want to co-host a cohort, sponsor learners, or partner with KR8 Academy?
              </h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop="Schools, NGOs, brands, and community organisations collaborate directly with KR8 DIGITALS to expand tuition-free training impact."
                mobile="Schools, NGOs, and organisations partner directly with us to expand free digital and academic training."
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/partners#propose" className="btn-primary">
                Propose a Partnership <Icon name="arrow" size={17} />
              </Link>
              <Link href="/contact" className="btn-ghost">
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
