import Link from 'next/link';
import site from '../../data/site.json';
import team from '../../data/team.json';
import { Counter, Icon } from '@/components/ui';
import HeroCinema from '@/components/HeroCinema';
import MobileHero from '@/components/MobileHero';
import ServiceCards from '@/components/ServiceCards';
import Duo from '@/components/Duo';
import {
  CinemaVisual,
  MobileDisclosure,
  ResponsiveCopy,
  SectionAtmosphere,
} from '@/components/MobileExperience';

const eco = site.ecosystem;
const mainPartners = [
  {
    slug: 'motionverse',
    mark: 'MV',
    name: 'Motionverse',
    role: 'Co-Founding Partner · Brand & Design',
    href: '/partners/motionverse',
  },
  {
    slug: 'chigoma',
    mark: 'CH',
    name: 'Chigoma',
    role: 'Co-Founding Partner · Video & Motion',
    href: '/partners/chigoma',
  },
  {
    slug: 'next-gen-scholars',
    mark: 'NG',
    name: 'NextGen',
    role: 'Academic Partner · STEM, Arts & Exams',
    href: '/partners/next-gen-scholars',
  },
];

export const metadata = {
  title: 'KR8 Digitals — Whoever you are, whatever you do, we exist because of you.',
  description:
    'KR8 Digitals designs and builds websites, brands, films, AI systems and SEO optimisation for organisations that need to be found, trusted and chosen.',
};

export default function Home() {
  return (
    <>
      {/* ------------------------------------------------------------ HERO */}
      <section className="hero">
        <div className="hero-bg" aria-hidden>
          <div className="blob-1" />
          <div className="blob-2" />
          <div className="vignette" />
        </div>
        <div className="wrap">
          <div className="hero-grid hero-grid--desktop">
            <div className="hero-copy-col">
              <span className="badge">
                <span className="badge-dot" /> A creative company
              </span>
              <h1 className="hero-title">
                <span className="line line--small">Whoever you are, whatever you do,</span>
                <span className="line line--big text-grad">we exist because of you.</span>
              </h1>
              <p className="hero-copy">
                We design and engineer fast websites, unmistakable brand identities, scroll-stopping video,
                AI systems, and search authority for organisations ready to lead — while training the next
                generation of digital builders for free.
              </p>
              <div className="hero-actions">
                <Link href={site.hero.primary.href} className="btn-primary">
                  {site.hero.primary.label} <Icon name="arrow" size={18} />
                </Link>
                <a href={site.hero.secondary.href} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  {site.hero.secondary.label} <span className="arrow-out">↗</span>
                </a>
              </div>
              <div className="hero-pillars" aria-label="Core capabilities">
                <span>Websites &amp; Apps</span>
                <i aria-hidden />
                <span>Branding &amp; Design</span>
                <i aria-hidden />
                <span>Video &amp; AI</span>
                <i aria-hidden />
                <span>Free Academy</span>
              </div>
            </div>
            <div className="hero-stage-col">
              <HeroCinema />
            </div>
          </div>

          <MobileHero
            primaryHref={site.hero.primary.href}
            primaryLabel={site.hero.primary.label}
            secondaryHref={site.hero.secondary.href}
          />
        </div>
      </section>

      {/* --------------------------------------------------------- MARQUEE */}
      <div className="marquee" aria-hidden>
        <div className="marquee-track">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="marquee-item" style={{ display: 'flex' }}>
              {['Websites', 'Brand', 'Video', 'AI', 'SEO', 'Training', 'Community', 'Partnership'].map((w) => (
                <span key={w} className="marquee-item">
                  <span className="marquee-text">{w}</span>
                  <span className="diamond" />
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="fade-l" />
        <div className="fade-r" />
      </div>

      {/* ------------------------------------------------------ 3 · PROOF STRIP */}
      <section className="proof" aria-label="KR8 Digitals in numbers">
        <div className="wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div className="proof-grid">
            {site.stats.map((s, i) => (
              <div className="proof-cell reveal up" data-delay={i * 60} key={s.id}>
                <div className="proof-num text-grad">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="proof-label">{s.label}</div>
                <div className="proof-src">{s.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- 4 · SERVICES */}
      <section className="section" id="services">
        <SectionAtmosphere name="services-atmosphere" deskOpacity={0.14} mobOpacity={0.24} flare />
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Services</div>
              <h2 className="section-title">What we build for clients</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop="Great organisations lose opportunities quietly when their digital presence feels slow, generic, or disconnected. We engineer every layer of how the market finds, perceives, and buys from you — custom websites, category-defining brand identity, campaign design, high-retention video, search visibility, and intelligent automation under one roof."
                mobile="Six integrated studio capabilities engineered to get your brand found, trusted, and chosen on sight."
              />
            </div>
            <Link href="/services" className="btn-link">
              All services <Icon name="arrow" size={15} />
            </Link>
          </div>
          <ServiceCards />
        </div>
      </section>

      {/* ----------------------------------------- 5 · FREE DIGITAL SKILLS TRAINING */}
      <section className="section ft-section" id="free-training">
        <SectionAtmosphere name="academy-cohort-cinema" deskOpacity={0.14} mobOpacity={0.24} flare />
        <div className="wrap">
          <div className="ft-grid reveal up">
            <div className="ft-copy">
              <div className="eyebrow">Flagship Initiative · Free Digital Skills Training</div>
              <h2 className="section-title">
                Empowering people to become <span className="text-grad">creators of opportunities</span> — at zero cost.
              </h2>

              <p className="section-lede kr8-desk-only">
                Talent is everywhere, yet expensive bootcamps lock millions out of the digital economy. Through{' '}
                <strong style={{ color: 'var(--t-strong)' }}>KR8 Academy</strong>, we teach practical, high-income digital
                crafts completely free — equipping learners to build products, launch studios, win clients, and
                create opportunities rather than wait in line as job seekers.
              </p>

              <div className="kr8-mob-only" style={{ marginTop: 12 }}>
                <p className="section-lede" style={{ marginTop: 0 }}>
                  Learn high-income digital skills <strong style={{ color: 'var(--t-strong)' }}>100% tuition-free ($0 / ₦0)</strong>{' '}
                  through 8-week live cohorts at <strong style={{ color: 'var(--t-strong)' }}>KR8 Academy</strong>.
                </p>
                <div style={{ marginTop: 14 }}>
                  <CinemaVisual
                    name="academy-cohort-cinema"
                    alt="KR8 Academy learners collaborating during a free hands-on digital skills cohort"
                    badge="KR8 Academy · $0 Tuition"
                    caption="8-week practical cohorts · Live mentorship · Verifiable KR8 ID"
                  />
                </div>
              </div>

              <div className="ft-pillars">
                <div className="ft-pillar">
                  <span className="ft-pillar__icon">
                    <Icon name="spark" size={18} />
                  </span>
                  <div>
                    <b>100% Tuition-Free Access</b>
                    <p>Zero tuition, zero hidden charges, and zero graduation fees across every cohort.</p>
                  </div>
                </div>
                <div className="ft-pillar">
                  <span className="ft-pillar__icon">
                    <Icon name="layers" size={18} />
                  </span>
                  <div>
                    <b>Practical Craft Over Theory</b>
                    <p>8-week intensive cohorts led by practicing builders — you graduate with shipped work, not slides.</p>
                  </div>
                </div>
                <div className="ft-pillar">
                  <span className="ft-pillar__icon">
                    <Icon name="award" size={18} />
                  </span>
                  <div>
                    <b>Verifiable KR8 Graduate Identity</b>
                    <p>Earn an official verifiable KR8 ID, portfolio review, and pathways into real client projects.</p>
                  </div>
                </div>
              </div>

              <div className="actions" style={{ marginTop: 24 }}>
                <a href={eco.academy.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Start Learning Free <span className="arrow-out">↗</span>
                </a>
                <Link href="/programs#free-training" className="btn-ghost">
                  Explore 7 Tracks
                </Link>
              </div>
            </div>

            <div className="ft-visual">
              <div className="ft-frame">
                <div className="ft-frame__bar">
                  <span className="ft-dot ft-dot--pink" />
                  <span className="ft-dot" />
                  <span className="ft-dot" />
                  <span className="ft-url">academy.kr8digitals.com</span>
                  <span className="ft-free-pill">₦0 · $0 TUITION</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/academy-home.jpg"
                  alt="KR8 Academy — tuition-free digital skills training platform by KR8 Digitals"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="ft-tracks-card" aria-label="Available free training tracks">
                <span className="ft-tracks__label">7 Practical Skill Tracks · Zero Tuition</span>
                <div className="ft-tracks__list">
                  {[
                    'Website Development',
                    'Front-End Engineering',
                    'Graphic Design',
                    'Video Editing & Motion',
                    'Content Creation',
                    'Social Media Management',
                    'Digital Marketing',
                  ].map((track) => (
                    <span key={track} className="ft-track-chip">
                      {track}
                    </span>
                  ))}
                </div>
              </div>

              <div className="ft-proof-card">
                <div className="ft-avatars" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/work/p-grant.jpg" alt="" loading="lazy" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/work/p-elizabeth.jpg" alt="" loading="lazy" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/work/p-chinenye.jpg" alt="" loading="lazy" />
                </div>
                <div className="ft-proof-card__text">
                  <b>From Curious Learners to Working Creators</b>
                  <span>8-week hands-on cohorts · Senior mentorship · Plus WAEC &amp; JAMB support via Next Gen Scholars</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------- 6 · KR8 DIGITALS TRIBE */}
      <section className="section tribe-section" id="tribe">
        <SectionAtmosphere name="tribe-creative-room" deskOpacity={0.14} mobOpacity={0.22} flare />
        <div className="wrap">
          <div className="tribe-shell reveal up">
            <div className="tribe-head">
              <div className="tribe-head__copy">
                <div className="eyebrow">KR8 Digitals&apos; Tribe · The Creative Community</div>
                <h2 className="section-title">
                  Isolation kills craft.
                  <br />
                  <span className="text-grad">Never build alone again.</span>
                </h2>

                <p className="section-lede kr8-desk-only">
                  Most learners finish a course and lose the room — left staring at Figma, Premiere, or VS Code
                  alone with nobody to review their work or point them toward real opportunities.{' '}
                  <strong style={{ color: 'var(--t-strong)' }}>KR8 Digitals&apos; Tribe</strong> is our unbroken creative
                  community where designers, web developers, video directors, and digital builders stay connected
                  to sharpen their craft, collaborate across disciplines, and grow into financially independent
                  creators together.
                </p>

                <div className="kr8-mob-only" style={{ marginTop: 10 }}>
                  <p className="section-lede" style={{ marginTop: 0 }}>
                    Join <strong style={{ color: 'var(--t-strong)' }}>3,000+ designers, developers, and filmmakers</strong>{' '}
                    sharing honest critiques, cross-skill collaborations, and paid client gig flow — free.
                  </p>
                  <MobileDisclosure label="Why we built the Tribe">
                    Most learners finish a course and lose the room — left staring at Figma, Premiere, or VS Code
                    alone. KR8 Digitals&apos; Tribe keeps creators connected with senior reviews, cross-discipline
                    team-ups, and real client overflow opportunities.
                  </MobileDisclosure>
                </div>
              </div>

              <div className="tribe-cluster">
                <div style={{ marginBottom: 12 }}>
                  <CinemaVisual
                    name="tribe-creative-room"
                    alt="KR8 Digitals Tribe members reviewing creative work together in studio"
                    badge="3,000+ Active Creators"
                    aspect="16 / 9.5"
                    mobileAspect="16 / 10"
                  />
                </div>
                <div className="tribe-cluster__faces" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/work/p-grant.jpg" alt="" loading="lazy" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/work/p-chinenye.jpg" alt="" loading="lazy" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/work/p-peter.jpg" alt="" loading="lazy" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/work/p-elizabeth.jpg" alt="" loading="lazy" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/work/p-maduka.jpg" alt="" loading="lazy" />
                </div>
                <p className="tribe-cluster__note">
                  Designers · Developers · Video Editors · Strategists · Founders building side by side.
                </p>
              </div>
            </div>

            <div className="tribe-grid">
              <article className="tribe-card">
                <div className="tribe-card__top">
                  <span className="tribe-card__num">01</span>
                  <span className="tribe-card__icon">
                    <Icon name="palette" size={18} />
                  </span>
                </div>
                <h3>Critique Over Clout</h3>
                <ResponsiveCopy
                  as="p"
                  desktop="Share messy work-in-progress drafts and receive honest, specific technical feedback from senior practitioners who care about raising your standard — without ego or judgment."
                  mobile="Honest, ego-free technical feedback on your drafts from senior practitioners."
                />
              </article>

              <article className="tribe-card">
                <div className="tribe-card__top">
                  <span className="tribe-card__num">02</span>
                  <span className="tribe-card__icon">
                    <Icon name="users" size={18} />
                  </span>
                </div>
                <h3>Internal Gig &amp; Lead Flow</h3>
                <ResponsiveCopy
                  as="p"
                  desktop="When client projects expand or retainers overflow, opportunities go to trusted builders inside the Tribe room first — turning proven skill into real paid work."
                  mobile="Overflow studio projects and client leads shared with trusted builders first."
                />
              </article>

              <article className="tribe-card">
                <div className="tribe-card__top">
                  <span className="tribe-card__num">03</span>
                  <span className="tribe-card__icon">
                    <Icon name="layers" size={18} />
                  </span>
                </div>
                <h3>Cross-Skill Collaboration</h3>
                <ResponsiveCopy
                  as="p"
                  desktop="Web developers partner with brand designers, motion artists, and writers to pitch, execute, and deliver complete client solutions none of them could ship alone."
                  mobile="Devs, designers, and editors team up to ship full client projects together."
                />
              </article>

              <article className="tribe-card">
                <div className="tribe-card__top">
                  <span className="tribe-card__num">04</span>
                  <span className="tribe-card__icon">
                    <Icon name="compass" size={18} />
                  </span>
                </div>
                <h3>Accountability &amp; Growth</h3>
                <ResponsiveCopy
                  as="p"
                  desktop="Live teardowns on freelancing, client psychology, pricing, and staying consistent alongside ambitious peers walking the exact same road."
                  mobile="Live teardowns on pricing, client psychology, and consistent career growth."
                />
              </article>
            </div>

            <div className="tribe-foot">
              <div className="tribe-rules">
                <span>
                  <Icon name="check" size={14} /> Zero spam or guru hype
                </span>
                <span>
                  <Icon name="check" size={14} /> Actionable senior feedback
                </span>
                <span>
                  <Icon name="check" size={14} /> Shared leads &amp; gigs
                </span>
                <span>
                  <Icon name="check" size={14} /> Lift as you climb
                </span>
              </div>
              <div className="actions">
                <Link href="/tribe" className="btn-primary">
                  Step Into the Tribe <Icon name="arrow" size={17} />
                </Link>
                <Link href="/programs#tribe" className="btn-ghost">
                  How the Tribe Fits
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------- 7 · OTHER THINGS WE DO */}
      <section className="section otwd-section" id="other-things-we-do">
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Beyond Client Services · Ecosystem Initiatives</div>
              <h2 className="section-title">Other things we do</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop="Alongside client delivery, tuition-free training, and the Tribe, we run two focused ecosystem initiatives — one designed to rewire how ambitious people think about growth and opportunity, and another opening a merit-based path onto our production team."
                mobile="Two focused pathways: live conversations on wealth & clarity, and merit-based entry onto our studio team."
              />
            </div>
            <Link href="/programs" className="btn-link">
              All initiatives <Icon name="arrow" size={15} />
            </Link>
          </div>

          <div className="otwd-grid">
            {/* 1. Mindset Shift */}
            <article className="otwd-card reveal up">
              <div className="otwd-card__glow otwd-card__glow--a" aria-hidden />
              <div style={{ marginBottom: 14 }}>
                <CinemaVisual
                  name="mindset-shift-stage"
                  alt="Mindset Shift — KR8 Digitals twice-monthly live conversation forum"
                  badge="1st & 3rd Sundays · 9 PM"
                  aspect="16 / 8.8"
                  mobileAspect="16 / 9.5"
                />
              </div>
              <div className="otwd-card__head">
                <span className="otwd-badge">
                  <Icon name="spark" size={15} /> Initiative 01 · Live Gathering Series
                </span>
                <span className="pill pill--live">Free Entry</span>
              </div>

              <h3 className="otwd-card__title">Mindset Shift</h3>
              <ResponsiveCopy
                as="p"
                className="otwd-card__desc"
                desktop="Technical skill is rarely the only gap — belief is. Mindset Shift is our recurring live conversation series bringing accomplished founders, authors, and strategists into the room to challenge limiting assumptions around money, career ceiling, business, and personal agency — so capable people stop holding themselves back."
                mobile="Twice-monthly live conversations with founders and strategists on money, career leverage, and business clarity — free for every profession."
              />

              <ul className="otwd-list">
                <li>
                  <Icon name="check" size={15} />
                  <span>Candid, zero-hype conversations on wealth, business, and clarity</span>
                </li>
                <li>
                  <Icon name="check" size={15} />
                  <span>Hosted live twice monthly with guest thinkers and practitioners</span>
                </li>
                <li>
                  <Icon name="check" size={15} />
                  <span>Actionable takeaways you can apply the very same week</span>
                </li>
              </ul>

              <div className="otwd-card__foot">
                <Link href="/programs/mindset-shift/invite" className="btn-primary btn-sm">
                  Register Interest <Icon name="arrow" size={15} />
                </Link>
                <Link href="/programs#mindset-shift" className="btn-link">
                  About Mindset Shift <Icon name="arrow" size={14} />
                </Link>
              </div>
            </article>

            {/* 2. Join the Team */}
            <article className="otwd-card reveal up" data-delay={90}>
              <div className="otwd-card__glow otwd-card__glow--b" aria-hidden />
              <div style={{ marginBottom: 14 }}>
                <CinemaVisual
                  name="join-team-builders"
                  alt="KR8 Digitals commercial production suite for web, design, and film specialists"
                  badge="Portfolio-First · $0 Fee"
                  aspect="16 / 8.8"
                  mobileAspect="16 / 9.5"
                />
              </div>
              <div className="otwd-card__head">
                <span className="otwd-badge">
                  <Icon name="users" size={15} /> Initiative 02 · Professional Studio Pathway
                </span>
                <span className="pill">Merit-Based</span>
              </div>

              <h3 className="otwd-card__title">Join the Team</h3>
              <ResponsiveCopy
                as="p"
                className="otwd-card__desc"
                desktop="KR8 Digitals is built by practitioners who prove their craft through real output. Join the Team is our structured bridge from independent builder or standout Academy graduate into our core delivery team — collaborating on live client websites, brand systems, films, and AI builds held to commercial standards."
                mobile="Our merit-based bridge into the paid KR8 production studio — judged on shipped portfolio work, never paper degrees."
              />

              <ul className="otwd-list">
                <li>
                  <Icon name="check" size={15} />
                  <span>Portfolio-first evaluation — judged by shipped work, not paper</span>
                </li>
                <li>
                  <Icon name="check" size={15} />
                  <span>Hands-on collaboration with senior leads on real paid client briefs</span>
                </li>
                <li>
                  <Icon name="check" size={15} />
                  <span>Open to standout KR8 graduates and disciplined external builders</span>
                </li>
              </ul>

              <div className="otwd-card__foot">
                <Link href="/about/join-the-team" className="btn-primary btn-sm">
                  How to Join <Icon name="arrow" size={15} />
                </Link>
                <Link href="/about/join-the-team#roles" className="btn-link">
                  See Open Roles <Icon name="arrow" size={14} />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- 8 · PARTNERS */}
      <section className="section section--tight" id="partners" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <SectionAtmosphere name="partners-alliance-cinema" deskOpacity={0.14} mobOpacity={0.24} flare />
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Partners</div>
              <h2 className="section-title">We do not build alone</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop="Enduring impact is built through shared standards and complementary strengths. Our partner organisations co-create commercial design and film alongside KR8 Digitals, lead specialised instruction across our free training cohorts, and expand what every client and learner gains from our ecosystem."
                mobile="Allied studios and academic partners co-producing commercial work and powering our free cohorts."
              />
            </div>
            <Link href="/partners" className="btn-link">
              See all partners <Icon name="arrow" size={15} />
            </Link>
          </div>

          <div className="gal__grid gal__grid--partners" style={{ marginTop: 32 }}>
            {mainPartners.map((p) => (
              <Link href={p.href} className="logo-slot" key={p.slug}>
                <span className="logo-slot__mark">{p.mark}</span>
                <b>{p.name}</b>
                <small>{p.role}</small>
              </Link>
            ))}
            <Link href="/partners" className="logo-slot logo-slot--invite">
              <span className="logo-slot__mark">+</span>
              <b>Your Logo Here</b>
              <small>Tell Us What You Can Bring →</small>
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- 9 · TEAM */}
      <section className="section" id="team">
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">The team</div>
              <h2 className="section-title">Three founders. One company.</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop="Three complementary crafts united under one shared standard. Rather than working in isolated silos, our founders bring engineering, brand design, and film production onto the same table — collaborating directly across client engagements, free training cohorts, and the community we build together."
                mobile="Engineering, brand design, and film production united under one roof by three practicing founders."
              />
            </div>
            <Link href="/about" className="btn-link">
              About KR8 <Icon name="arrow" size={15} />
            </Link>
          </div>

          <div className="founders" style={{ marginTop: 32 }}>
            {team.founders.map((f) => (
              <article className="founder" key={f.slug}>
                <div className="founder__img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.photo} alt={`${f.name} (${f.fullName}), ${f.role}`} loading="lazy" decoding="async" />
                </div>
                <div className="founder__body">
                  <h3 className="founder__name">{f.name}</h3>
                  <div className="founder__role">{f.role}</div>
                  <div className="founder__full">{f.fullName}</div>
                  <Link href={f.readAbout} className="founder__link">
                    {f.linkText} <Icon name="arrow" size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- 10 · JOIN TEAM */}
      <div id="join-team">
        <Duo
          eyebrow="Join the team"
          title="If you can build, we want to meet you."
          mobileSummary={
            <p>
              Whether you trained inside KR8 Academy or built your track record independently across web,
              design, video, SEO, or AI — we judge by shipped work, never résumé theatre.
            </p>
          }
          mobileExpandLabel="How our portfolio review works"
          body={
            <>
              <p>
                Exceptional client work comes from practitioners who care deeply about the craft behind every
                pixel, frame, and line of code. Whether you sharpened your skills inside KR8 Academy or built
                your track record independently across web engineering, brand design, video production, SEO, or
                AI automation, there is a seat here for builders whose work speaks for itself.
              </p>
              <p>
                We skip résumé theatre entirely. Show us what you have shipped, walk us through how you solve
                real problems, and collaborate directly with our founders and senior leads on paid commercial
                projects. Even when no role is publicly listed, strong portfolios always get read.
              </p>
            </>
          }
          bullets={[
            'Portfolio-first review — judged on real execution, never credentials alone',
            'Paid collaboration on live websites, brand systems, films, and AI builds',
            'Open doors year-round for standout graduates and independent specialists',
          ]}
          media={[
            {
              src: '/img/programs/join-team-studio.webp',
              alt: 'Engineers, designers, and video editors reviewing portfolios together at KR8 Digitals',
              caption: 'Studio Portfolio Review · KR8 Digitals',
            },
            {
              src: '/img/services/motionverse-studio.webp',
              alt: 'Creative art direction and campaign craft inside the KR8 Digitals ecosystem',
            },
          ]}
          cta={{ label: 'How to join', href: '/about/join-the-team' }}
          secondary={{ label: 'See open roles', href: '/about/join-the-team#roles' }}
          flip
        />
      </div>

      {/* -------------------------------------------------------- 11 · REFERRALS */}
      <section className="section">
        <div className="wrap">
          <div className="cta-band cta-band--cinema reveal up">
            <SectionAtmosphere
              name="referrals-network-cinema"
              deskOpacity={0.22}
              mobOpacity={0.32}
              mobPosition="center 25%"
              flare
            />
            <div className="eyebrow eyebrow--lilac">Referrals</div>
            <h2>
              You may not have the skill.
              <br />
              <span className="text-grad">You have the people.</span>
            </h2>
            <ResponsiveCopy
              as="p"
              desktop="You know a school that needs a website. A bakery that needs a brand. A founder nobody can find on Google. Introduce them. When the work is paid, you are paid."
              mobile="Know a clinic, hotel, school, or founder needing digital work? Introduce them — earn 8% to 12% cash once paid."
            />
            <div className="actions" style={{ marginTop: 24 }}>
              <Link href="/referrals" className="btn-primary" data-track="become_referrer">
                Become a referrer <Icon name="arrow" size={17} />
              </Link>
              <span style={{ fontSize: 13, color: 'var(--t-muted)' }}>
                10% on projects · 8% on creative · 12% after three
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- 12 · PRE-FOOTER */}
      <section className="section section--tight" id="closing-cta" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.32} mobOpacity={0.44} flare />
        <div className="wrap">
          <div className="split reveal up" style={{ alignItems: 'center', gap: 24 }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                If you run a school, a business, or a brand, we should talk.
              </h2>
            </div>
            <div className="actions">
              <Link href="/contact" className="btn-primary">
                Work with us <Icon name="arrow" size={17} />
              </Link>
              <a
                href={`https://wa.me/${site.company.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <Icon name="wa" size={16} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
