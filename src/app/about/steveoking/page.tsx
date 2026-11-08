import Link from 'next/link';
import type { Metadata } from 'next';
import sitesData from '../../../../data/sites.json';
import { Icon } from '@/components/ui';
import {
  MobileDisclosure,
  ResponsiveCopy,
  SectionAtmosphere,
} from '@/components/MobileExperience';

export const metadata: Metadata = {
  title: 'Steveoking (Stevenson) — Co-Founder & Brand/Graphic Designer | KR8 DIGITALS',
  description:
    'Profile of Steveoking (Stevenson) — Professional Graphic Designer, Brand Designer, Founder of Motionverse, and Co-Founder of KR8 DIGITALS.',
  alternates: { canonical: '/about/steveoking' },
};

const DESIGN_PILLARS = [
  {
    num: 'DISCIPLINE 01 · BRAND STRATEGY & IDENTITY',
    title: 'Visual Identity Systems That Command Category Authority',
    body: 'Steveoking crafts complete brand architectures — primary and secondary logomarks, typographic pairings, color systems, and comprehensive Brand Guidelines designed to keep growing organisations unmistakable across every physical and digital touchpoint.',
    mobileBody: 'Complete logo suites, typography, color systems, and Brand Playbooks engineered for unmistakable authority.',
    tags: ['Logo Architecture', 'Brand Guidelines', 'Typography & Color', 'Visual Positioning'],
  },
  {
    num: 'DISCIPLINE 02 · COMMERCIAL GRAPHIC DESIGN',
    title: 'Campaign Key Art & Promotional Flyers Built to Convert',
    body: 'Through Motionverse and KR8 DIGITALS, Steveoking directs campaign artwork engineered for the critical first half-second on mobile feeds and print — giving product launches, retail brands, and events immediate visual gravity.',
    mobileBody: 'Scroll-stopping campaign flyers, product key art, and event visual suites across mobile feeds and print.',
    tags: ['Campaign Key Art', 'Product & Retail Flyers', 'Event Visual Suites', 'Print & Social Formats'],
  },
  {
    num: 'DISCIPLINE 03 · MOTIONVERSE & ACADEMY MENTORSHIP',
    title: 'Leading Motionverse & Teaching the Next Generation',
    body: 'As Founder of Motionverse and Co-Founder of KR8 DIGITALS, Steveoking bridges active studio art direction with hands-on Graphic Design instruction inside KR8 Academy — holding learners to real commercial composition standards.',
    mobileBody: 'Leads Motionverse art direction and mentors emerging designers inside KR8 Academy’s free Graphic Design track.',
    tags: ['Motionverse Founder', 'KR8 Co-Founder', 'Graphic Design Instructor', 'Creative Critique'],
  },
];

export default function SteveokingProfilePage() {
  const featuredFlyers = sitesData.flyers.slice(0, 4);

  return (
    <>
      {/* =================================================== PROFILE HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name="founder-craft-design" deskOpacity={0.32} mobOpacity={0.42} flare />
        <div className="wrap">
          <nav className="kr8-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/about">About</Link>
            <span>/</span>
            <span style={{ color: '#fff' }}>Steveoking</span>
          </nav>

          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill">
                <i className="kr8-pill__dot" /> Co-Founder · KR8 DIGITALS &amp; Motionverse
              </span>
              <h1
                className="kr8-subhero__title"
                style={{ wordBreak: 'keep-all', overflowWrap: 'normal', hyphens: 'none' }}
              >
                Steveoking
              </h1>
              <p
                style={{
                  marginTop: 8,
                  fontFamily: 'var(--f-mono)',
                  fontSize: 12.5,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--magenta)',
                }}
              >
                Stevenson · Brand Designer, Graphic Designer &amp; Founder of Motionverse
              </p>

              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={
                  <>
                    <strong>Steveoking</strong> (Stevenson) is a professional graphic designer, brand designer,
                    Founder of <strong>Motionverse</strong>, and Co-Founder of <strong>KR8 DIGITALS</strong>. He
                    leads brand identity architecture, commercial campaign design, and visual design mentorship across
                    the KR8 DIGITALS ecosystem.
                  </>
                }
                mobile={
                  <>
                    <strong>Steveoking</strong> (Stevenson) is a professional graphic designer, brand designer,
                    Founder of <strong>Motionverse</strong>, and Co-Founder of <strong>KR8 DIGITALS</strong>.
                  </>
                }
              />

              <blockquote
                style={{
                  margin: '18px 0 0',
                  padding: '13px 16px',
                  borderLeft: '3px solid var(--magenta)',
                  background: 'rgba(168, 85, 247, 0.08)',
                  borderRadius: '0 14px 14px 0',
                  fontSize: 14,
                  lineHeight: 1.58,
                  color: 'rgba(245, 240, 255, 0.9)',
                }}
              >
                &ldquo;Great brand and graphic design earns trust in half a second — before a prospect reads a
                single paragraph.&rdquo;
              </blockquote>

              <div className="kr8-subhero__actions">
                <Link href="/contact?service=branding" className="btn-primary">
                  Start a Brand or Design Brief <Icon name="arrow" size={17} />
                </Link>
                <Link href="/partners/motionverse" className="btn-ghost">
                  Explore Motionverse
                </Link>
              </div>
            </div>

            <div className="kr8-subhero__frame kr8-subhero__frame--portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/team/stevenson.jpg"
                alt="Steveoking (Stevenson), Co-Founder of KR8 DIGITALS and Founder of Motionverse"
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>Founder 02 · Brand &amp; Visual Design</span>
                  <strong>Steveoking · Stevenson</strong>
                </div>
                <span style={{ color: '#e9d5ff' }}>Motionverse</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= BIOGRAPHY & DESIGN ETHOS */}
      <section className="section">
        <div className="wrap">
          <div className="kr8-grid-2" style={{ alignItems: 'center', gap: 36 }}>
            <div>
              <div className="eyebrow">Creative Direction &amp; Story</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                Where strategic brand clarity meets <span className="text-grad">unforgettable visual craft.</span>
              </h2>

              <div className="prose-lg kr8-desk-only" style={{ marginTop: 18, display: 'grid', gap: 16 }}>
                <p>
                  Every organisation communicates visually long before anyone reads its pitch. Through his design
                  practice <strong>Motionverse</strong> and as Co-Founder of <strong>KR8 DIGITALS</strong>,{' '}
                  <strong>Steveoking</strong> (Stevenson) ensures businesses show up with visual authority worthy
                  of the products and services they deliver.
                </p>
                <p>
                  His practice spans two distinct yet connected disciplines: foundational{' '}
                  <strong>Branding</strong> (identity systems, logos, typography, and brand books that define who a
                  company is) and high-velocity <strong>Graphic Design</strong> (campaign flyers, retail product
                  key art, and event visuals engineered to stop the scroll and drive immediate customer action).
                </p>
                <p>
                  Committed to multiplying creative excellence beyond client briefs, Steveoking teaches the
                  Graphic Design track inside <strong>KR8 Academy</strong> — mentoring emerging designers in
                  hierarchy, typography, lighting, and commercial discipline at zero tuition cost.
                </p>
              </div>

              <div className="kr8-mob-only" style={{ marginTop: 12 }}>
                <p className="kr8-card__body">
                  Through <strong>Motionverse</strong> and <strong>KR8 DIGITALS</strong>,{' '}
                  <strong>Steveoking</strong> (Stevenson) directs foundational Brand Identity systems and
                  high-converting Campaign Graphic Design — while mentoring designers tuition-free inside{' '}
                  <strong>KR8 Academy</strong>.
                </p>
                <MobileDisclosure label="Read Steveoking's full creative story">
                  <p>
                    His practice spans foundational Branding (identity systems, vector logos, typography, and
                    Brand Books) alongside high-velocity Graphic Design (campaign flyers, retail product key art,
                    and event visuals built to convert).
                  </p>
                  <p>
                    Inside KR8 Academy, he mentors emerging designers in hierarchy, typography, lighting, and
                    commercial discipline at zero tuition cost.
                  </p>
                </MobileDisclosure>
              </div>
            </div>

            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/services/brand-identity.webp"
                alt="Brand identity guidelines and visual design systems directed at KR8 DIGITALS with Motionverse"
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>KR8 DIGITALS × Motionverse</span>
                  <strong>Brand Systems · Campaign Art Direction</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================== THREE DISCIPLINES */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <SectionAtmosphere name="services-atmosphere" deskOpacity={0.12} mobOpacity={0.22} flare />
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Design Leadership</div>
              <h2 className="section-title">
                What Steveoking leads <span className="text-grad">at KR8 DIGITALS.</span>
              </h2>
            </div>
          </div>

          <div className="kr8-grid-3" style={{ marginTop: 28 }}>
            {DESIGN_PILLARS.map((d, idx) => (
              <article
                className={`kr8-card ${idx === 0 ? 'kr8-card--accent' : ''} reveal up`}
                key={d.num}
              >
                <div className="kr8-card__num">{d.num}</div>
                <h3 className="kr8-card__title">{d.title}</h3>
                <ResponsiveCopy
                  as="p"
                  className="kr8-card__body"
                  desktop={d.body}
                  mobile={d.mobileBody}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                  {d.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================== PUBLISHED DESIGN SHOWCASE */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Selected Commercial Artwork</div>
              <h2 className="section-title">Client design crafted with Motionverse.</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop="Real commercial campaign flyers and retail visuals designed for named clients inside the KR8 DIGITALS × Motionverse practice."
                mobile="Commercial campaign flyers and retail visuals designed inside KR8 DIGITALS × Motionverse."
              />
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href="/services/branding" className="btn-link">
                Branding Service <Icon name="arrow" size={14} />
              </Link>
              <Link href="/services/graphic-design" className="btn-link">
                Graphic Design Gallery <Icon name="arrow" size={14} />
              </Link>
            </div>
          </div>

          <div className="kr8-grid-4" style={{ marginTop: 28 }}>
            {featuredFlyers.map((f) => (
              <article className="kr8-card reveal up" key={f.slug} style={{ padding: 14 }}>
                <div
                  className="kr8-card__media kr8-card__media--tall"
                  style={{ margin: '0 0 12px', aspectRatio: '4 / 5' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.card} alt={`${f.title} — commercial design for ${f.client}`} loading="lazy" />
                </div>
                <div className="kr8-card__num" style={{ marginBottom: 4 }}>
                  {f.kind}
                </div>
                <h3 className="kr8-card__title" style={{ fontSize: 16 }}>
                  {f.title}
                </h3>
                {f.client && (
                  <p className="kr8-card__body" style={{ fontSize: 12.5, marginTop: 4 }}>
                    Client: {f.client}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ CO-FOUNDER NAVIGATION & CTA */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Founding Leadership</div>
              <h2 className="section-title">Meet the rest of the founding team.</h2>
            </div>
            <Link href="/about#founders" className="btn-link">
              Back to About KR8 DIGITALS <Icon name="arrow" size={15} />
            </Link>
          </div>

          <div className="kr8-grid-2" style={{ marginTop: 24 }}>
            <Link href="/about/timfire" className="kr8-card" style={{ textDecoration: 'none' }}>
              <div className="kr8-card__num">FOUNDER &amp; CHIEF EXECUTIVE</div>
              <h3 className="kr8-card__title">Timfire (Kenneth Timothy Iziogo)</h3>
              <p className="kr8-card__body">
                Website developer, AI agent developer, and Founder &amp; Chief Executive of KR8 DIGITALS.
              </p>
              <div className="kr8-card__foot">
                <span className="btn-link">
                  Read About Timfire <Icon name="arrow" size={14} />
                </span>
              </div>
            </Link>

            <Link href="/about/creative-expression" className="kr8-card" style={{ textDecoration: 'none' }}>
              <div className="kr8-card__num">CO-FOUNDER · CHIGOMA</div>
              <h3 className="kr8-card__title">Creative Expression (Daniel Akachukwu Augustine)</h3>
              <p className="kr8-card__body">
                Professional video editor, Founder of Chigoma, and Co-Founder of KR8 DIGITALS.
              </p>
              <div className="kr8-card__foot">
                <span className="btn-link">
                  Read About Creative Expression <Icon name="arrow" size={14} />
                </span>
              </div>
            </Link>
          </div>

          <div className="kr8-cta-banner reveal up" style={{ marginTop: 34 }}>
            <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.45} mobOpacity={0.55} flare />
            <div>
              <span className="kr8-pill">Work With Steveoking &amp; Motionverse</span>
              <h2 className="section-title" style={{ marginTop: 14 }}>
                Ready for a brand identity or campaign visual suite that stands apart?
              </h2>
              <p className="section-lede" style={{ marginTop: 10 }}>
                Commission Brand Strategy &amp; Identity or Commercial Graphic Design directly through KR8
                DIGITALS.
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/contact?service=branding" className="btn-primary">
                Commission Branding <Icon name="arrow" size={17} />
              </Link>
              <Link href="/services/graphic-design" className="btn-ghost">
                Graphic Design
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
