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
  title: 'Creative Expression (Daniel Akachukwu Augustine) — Co-Founder & Video Editor | KR8 DIGITALS',
  description:
    'Profile of Creative Expression (Daniel Akachukwu Augustine) — Professional Video Editor, Founder of Chigoma, and Co-Founder of KR8 DIGITALS.',
  alternates: { canonical: '/about/creative-expression' },
};

const FILM_PILLARS = [
  {
    num: 'CRAFT 01 · RETENTION-DRIVEN VIDEO EDITING',
    title: 'Commercial Cuts Engineered for How Modern Audiences Watch',
    body: 'Creative Expression transforms raw camera rolls into crisp, persuasive narratives — opening with immediate visual hooks, deliberate rhythmic pacing, and burned-in kinetic captions that hold attention whether watched with sound on or muted.',
    mobileBody: 'Raw footage turned into high-retention reels with sharp visual hooks, tight pacing, and dynamic captions.',
    tags: ['Commercial Reels', 'Hook & Rhythm Pacing', 'Dynamic Captions', 'Multi-Aspect Delivery'],
  },
  {
    num: 'CRAFT 02 · DOCUMENTARY & BRAND STORYTELLING',
    title: 'Authentic Human Proof Through Color, Sound & Structure',
    body: 'Through Chigoma and KR8 DIGITALS, he shapes founder stories, student journeys, and client testimonials with clean dialogue mastering, purposeful sound design, and cohesive color grading.',
    mobileBody: 'Founder films, documentaries, and client stories finished with clean audio mastering and color grading.',
    tags: ['Brand Documentaries', 'Client Testimonials', 'Audio Sweetening', 'Color Grading'],
  },
  {
    num: 'CRAFT 03 · CHIGOMA & FILM MENTORSHIP',
    title: 'Founder of Chigoma & Video Editing Instructor at KR8 Academy',
    body: 'Alongside leading post-production across KR8 DIGITALS client briefs, Creative Expression mentors aspiring filmmakers and editors inside KR8 Academy’s tuition-free Video Editing track.',
    mobileBody: 'Leads Chigoma post-production and mentors emerging video editors tuition-free inside KR8 Academy.',
    tags: ['Chigoma Founder', 'KR8 Co-Founder', 'Video Editing Mentor', 'Portfolio Reviews'],
  },
];

export default function CreativeExpressionProfilePage() {
  const videos = sitesData.videos;

  return (
    <>
      {/* =================================================== PROFILE HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name="founder-craft-film" deskOpacity={0.32} mobOpacity={0.42} flare />
        <div className="wrap">
          <nav className="kr8-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/about">About</Link>
            <span>/</span>
            <span style={{ color: '#fff' }}>Creative Expression</span>
          </nav>

          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill">
                <i className="kr8-pill__dot" /> Co-Founder · KR8 DIGITALS &amp; Chigoma
              </span>
              <h1 className="kr8-subhero__title">Creative Expression</h1>
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
                Daniel Akachukwu Augustine · Professional Video Editor &amp; Founder of Chigoma
              </p>

              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={
                  <>
                    <strong>Creative Expression</strong> (Daniel Akachukwu Augustine) is a professional video editor,
                    Founder of <strong>Chigoma</strong>, and Co-Founder of <strong>KR8 DIGITALS</strong>. He directs
                    video post-production, narrative pacing, commercial film cuts, and hands-on editing mentorship
                    across KR8 DIGITALS.
                  </>
                }
                mobile={
                  <>
                    <strong>Creative Expression</strong> (Daniel Akachukwu Augustine) is a professional video editor,
                    Founder of <strong>Chigoma</strong>, and Co-Founder of <strong>KR8 DIGITALS</strong>.
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
                &ldquo;Raw footage is only potential. Deliberate pacing, sound, and clarity turn a recording into
                proof people stay to watch.&rdquo;
              </blockquote>

              <div className="kr8-subhero__actions">
                <Link href="/contact?service=video-editing" className="btn-primary">
                  Commission a Video Edit <Icon name="arrow" size={17} />
                </Link>
                <Link href="/partners/chigoma" className="btn-ghost">
                  Explore Chigoma
                </Link>
              </div>
            </div>

            <div className="kr8-subhero__frame kr8-subhero__frame--portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/team/daniel.jpg"
                alt="Creative Expression (Daniel Akachukwu Augustine), Co-Founder of KR8 DIGITALS and Founder of Chigoma"
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>Founder 03 · Video &amp; Post-Production</span>
                  <strong>Creative Expression · Daniel Akachukwu Augustine</strong>
                </div>
                <span style={{ color: '#e9d5ff' }}>Chigoma</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= BIOGRAPHY & REEL */}
      <section className="section">
        <div className="wrap">
          <div className="kr8-grid-2" style={{ alignItems: 'center', gap: 36 }}>
            <div>
              <div className="eyebrow">Post-Production Craft &amp; Story</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                Turning unshaped footage into <span className="text-grad">stories that earn trust.</span>
              </h2>

              <div className="prose-lg kr8-desk-only" style={{ marginTop: 18, display: 'grid', gap: 16 }}>
                <p>
                  In an attention economy where viewers decide within three seconds whether to stay or scroll past,
                  video editing is no longer an afterthought — it is where commercial persuasion happens. Working
                  under his creative moniker <strong>Creative Expression</strong> and as Founder of{' '}
                  <strong>Chigoma</strong>, Daniel Akachukwu Augustine co-founded <strong>KR8 DIGITALS</strong> to
                  anchor the studio&apos;s moving-image standard.
                </p>
                <p>
                  Whether shaping vertical campaign reels, documentary testimonials, event films, or product
                  walkthroughs, his editing philosophy prioritizes human truth, rhythmic clarity, clean dialogue
                  mixes, and mobile-first framing that communicates clearly even before sound is turned on.
                </p>
                <p>
                  Inside <strong>KR8 Academy</strong>, he brings that exact commercial edit-bay discipline into the
                  classroom — training emerging video editors free of tuition so they graduate with watchable client
                  reels rather than abstract exercises.
                </p>
              </div>

              <div className="kr8-mob-only" style={{ marginTop: 12 }}>
                <p className="kr8-card__body">
                  As Founder of <strong>Chigoma</strong> and Co-Founder of <strong>KR8 DIGITALS</strong>,{' '}
                  <strong>Creative Expression</strong> (Daniel Akachukwu Augustine) anchors our commercial edit bay
                  — shaping vertical reels, brand documentaries, and tuition-free Video Editing mentorship inside{' '}
                  <strong>KR8 Academy</strong>.
                </p>
                <MobileDisclosure label="Read Creative Expression's full story">
                  <p>
                    Whether shaping vertical campaign reels, documentary testimonials, event films, or product
                    walkthroughs, his editing prioritizes human truth, rhythmic clarity, clean dialogue mixes, and
                    mobile-first framing.
                  </p>
                  <p>
                    Inside KR8 Academy, he brings that exact commercial edit-bay discipline into the classroom so
                    students graduate with real client-grade reels at zero tuition cost.
                  </p>
                </MobileDisclosure>
              </div>
            </div>

            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/services/video-editing-suite.webp"
                alt="Commercial film editing and colour-grading studio at KR8 DIGITALS with Chigoma"
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>KR8 DIGITALS × Chigoma</span>
                  <strong>Narrative Pacing · Color · Sound · Motion</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================== THREE PILLARS */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <SectionAtmosphere name="tribe-creative-room" deskOpacity={0.12} mobOpacity={0.22} flare />
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Production Leadership</div>
              <h2 className="section-title">
                What Creative Expression leads <span className="text-grad">at KR8 DIGITALS.</span>
              </h2>
            </div>
          </div>

          <div className="kr8-grid-3" style={{ marginTop: 28 }}>
            {FILM_PILLARS.map((p, idx) => (
              <article
                className={`kr8-card ${idx === 0 ? 'kr8-card--accent' : ''} reveal up`}
                key={p.num}
              >
                <div className="kr8-card__num">{p.num}</div>
                <h3 className="kr8-card__title">{p.title}</h3>
                <ResponsiveCopy
                  as="p"
                  className="kr8-card__body"
                  desktop={p.body}
                  mobile={p.mobileBody}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                  {p.tags.map((tag) => (
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

      {/* ===================================== PUBLISHED FILM CUTS */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Selected Cuts &amp; Stories</div>
              <h2 className="section-title">Published documentary &amp; vertical cuts.</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop="Play any of the films below directly in place — real stories and vertical edits published across the KR8 DIGITALS ecosystem."
                mobile="Tap any film below to play real vertical reels and documentary cuts in place."
              />
            </div>
            <Link href="/services/video-editing" className="btn-link">
              Explore Video Editing Service <Icon name="arrow" size={15} />
            </Link>
          </div>

          <div className="kr8-grid-4" style={{ marginTop: 28 }}>
            {videos.map((v) => (
              <article className="kr8-card reveal up" key={v.slug} style={{ padding: 14 }}>
                <div
                  className="kr8-card__media kr8-card__media--tall"
                  style={{ margin: '0 0 12px', aspectRatio: '9 / 14' }}
                >
                  <video
                    src={v.src}
                    poster={v.poster}
                    controls
                    playsInline
                    preload="metadata"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div className="kr8-card__num" style={{ marginBottom: 4 }}>
                  {v.kind} · {v.duration}
                </div>
                <h3 className="kr8-card__title" style={{ fontSize: 16 }}>
                  {v.title}
                </h3>
                <p className="kr8-card__body" style={{ fontSize: 12.5, marginTop: 4 }}>
                  {v.note}
                </p>
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

            <Link href="/about/steveoking" className="kr8-card" style={{ textDecoration: 'none' }}>
              <div className="kr8-card__num">CO-FOUNDER · MOTIONVERSE</div>
              <h3 className="kr8-card__title">Steveoking (Stevenson)</h3>
              <p className="kr8-card__body">
                Professional graphic designer, brand designer, Founder of Motionverse, and Co-Founder of KR8
                DIGITALS.
              </p>
              <div className="kr8-card__foot">
                <span className="btn-link">
                  Read About Stevenson <Icon name="arrow" size={14} />
                </span>
              </div>
            </Link>
          </div>

          <div className="kr8-cta-banner reveal up" style={{ marginTop: 34 }}>
            <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.45} mobOpacity={0.55} flare />
            <div>
              <span className="kr8-pill">Work With Creative Expression &amp; Chigoma</span>
              <h2 className="section-title" style={{ marginTop: 14 }}>
                Have raw footage or an upcoming campaign that needs sharp video editing?
              </h2>
              <p className="section-lede" style={{ marginTop: 10 }}>
                Send us your brief — we deliver paced, captioned, color-graded cuts built for real viewer
                retention.
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/contact?service=video-editing" className="btn-primary">
                Start a Video Project <Icon name="arrow" size={17} />
              </Link>
              <Link href="/services/video-editing" className="btn-ghost">
                Video Editing Service
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
