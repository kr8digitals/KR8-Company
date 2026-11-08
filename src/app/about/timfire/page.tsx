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
  title: 'Timfire (Kenneth Timothy Iziogo) — Founder & Chief Executive | KR8 DIGITALS',
  description:
    'Profile of Timfire (Kenneth Timothy Iziogo) — Website Developer, AI Agent Developer, and Founder & Chief Executive of KR8 DIGITALS.',
  alternates: { canonical: '/about/timfire' },
};

const SPECIALISMS = [
  {
    num: 'CRAFT 01 · FULL-STACK WEB ARCHITECTURE',
    title: 'Conversion-Engineered Websites & Web Platforms',
    body: 'Timfire architects and builds custom web platforms from the ground up — focusing on sub-second mobile performance, clear information hierarchy, and measurable customer action across hospitality, education, healthcare, corporate, and institutional sectors.',
    mobileBody: 'Custom Next.js web platforms engineered for sub-second mobile speed, clear UX, and measurable conversions.',
    tags: ['Next.js & Modern Web', 'Mobile-First UI/UX', 'Technical SEO Architecture', 'Conversion Systems'],
  },
  {
    num: 'CRAFT 02 · APPLIED AI & AUTOMATION',
    title: 'Domain-Grounded AI Agents & Business Workflows',
    body: 'Moving past fragile hype demos, Timfire builds reliable operational AI assistants, intelligent inquiry routers, and automated lead pipelines bounded by verified company knowledge and human-in-the-loop escalation.',
    mobileBody: 'Reliable operational AI agents (including RIYA), WhatsApp/CRM lead routing, and automated business workflows.',
    tags: ['Custom AI Assistants', 'Lead Triage & Routing', 'Operational Automation', 'Human-in-the-Loop Guardrails'],
  },
  {
    num: 'CRAFT 03 · ECOSYSTEM LEADERSHIP',
    title: 'Executive Stewardship, KR8 Academy & Mindset Shift',
    body: 'As Founder and Chief Executive, Timfire leads company strategy across KR8 DIGITALS, oversees tuition-free engineering tracks inside KR8 Academy, and convenes Mindset Shift to equip emerging builders with disciplined career vision.',
    mobileBody: 'Leads KR8 DIGITALS strategy, oversees free engineering tracks at KR8 Academy, and hosts Mindset Shift.',
    tags: ['Company Strategy', 'KR8 Academy Mentorship', 'Mindset Shift Host', 'Partner Ecosystem'],
  },
];

export default function TimfireProfilePage() {
  const featuredSites = sitesData.sites.slice(0, 4);

  return (
    <>
      {/* =================================================== PROFILE HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name="founder-craft-web" deskOpacity={0.32} mobOpacity={0.42} flare />
        <div className="wrap">
          <nav className="kr8-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/about">About</Link>
            <span>/</span>
            <span style={{ color: 'var(--t-strong)' }}>Timfire</span>
          </nav>

          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill">
                <i className="kr8-pill__dot" /> Founder &amp; Chief Executive · KR8 DIGITALS
              </span>
              <h1
                className="kr8-subhero__title"
                style={{ wordBreak: 'keep-all', overflowWrap: 'normal', hyphens: 'none' }}
              >
                Timfire
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
                Kenneth Timothy Iziogo · Website Developer &amp; AI Agent Developer
              </p>

              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={
                  <>
                    <strong>Timfire</strong> (Kenneth Timothy Iziogo) is a website developer, AI agent developer, and
                    the Founder &amp; Chief Executive of <strong>KR8 DIGITALS</strong>. He leads technical
                    architecture, product engineering, and overall company direction — uniting commercial software
                    delivery with KR8 DIGITALS&apos; tuition-free training and builder ecosystem.
                  </>
                }
                mobile={
                  <>
                    <strong>Timfire</strong> (Kenneth Timothy Iziogo) is a website developer, AI agent developer, and
                    Founder &amp; Chief Executive of <strong>KR8 DIGITALS</strong> — leading custom web &amp; AI
                    engineering alongside our free training ecosystem.
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
                  color: 'var(--t-body)',
                }}
              >
                &ldquo;Whoever you are, whatever you do, we exist because of you — to build digital
                infrastructure worthy of your ambition, and to keep the door open for the next builder.&rdquo;
              </blockquote>

              <div className="kr8-subhero__actions">
                <Link href="/contact?service=website-design" className="btn-primary">
                  Commission a Web or AI Build <Icon name="arrow" size={17} />
                </Link>
                <Link href="/services/ai-automation" className="btn-ghost">
                  Explore AI Automation
                </Link>
              </div>
            </div>

            <div className="kr8-subhero__frame kr8-subhero__frame--portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/team/founder-timfire.jpg"
                alt="Timfire (Kenneth Timothy Iziogo), Founder and Chief Executive of KR8 DIGITALS"
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>Founder 01 · Executive &amp; Engineering</span>
                  <strong>Timfire · Kenneth Timothy Iziogo</strong>
                </div>
                <span style={{ color: 'var(--t-lilac-strong)' }}>KR8 DIGITALS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= BIOGRAPHY & PHILOSOPHY */}
      <section className="section">
        <div className="wrap">
          <div className="kr8-grid-2" style={{ alignItems: 'center', gap: 36 }}>
            <div>
              <div className="eyebrow">Executive Biography &amp; Approach</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                Engineering systems that work on Monday morning — <span className="text-grad">not just in demos.</span>
              </h2>

              {/* Desktop full 3-paragraph biography preserved 100% */}
              <div className="prose-lg kr8-desk-only" style={{ marginTop: 18, display: 'grid', gap: 16 }}>
                <p>
                  Timfire founded <strong>KR8 DIGITALS</strong> around a practical observation: businesses and
                  institutions across Africa and beyond rarely fail for lack of vision — they lose momentum when
                  their websites load slowly, bury the customer&apos;s next step, or leave enquiries unanswered in
                  fragmented inboxes.
                </p>
                <p>
                  As a hands-on website developer and AI agent engineer, he approaches every engagement from the
                  outcome backward. Whether architecting a multi-page institutional platform, engineering a custom
                  search-ready storefront, or deploying a domain-grounded AI agent like RIYA on this website,
                  every line of code is measured by speed, clarity, and commercial utility.
                </p>
                <p>
                  Recognizing that sustainable companies require continuous human capacity, Timfire brought
                  specialist co-founders <strong>Steveoking</strong> (Motionverse) and{' '}
                  <strong>Creative Expression</strong> (Chigoma) together under one umbrella — building KR8
                  Academy, KR8 DIGITALS TRIBE, and Mindset Shift so emerging talent can master real digital crafts
                  without tuition barriers.
                </p>
              </div>

              {/* Mobile concise summary + expandable full biography */}
              <div className="kr8-mob-only" style={{ marginTop: 12 }}>
                <p className="kr8-card__body">
                  Timfire founded <strong>KR8 DIGITALS</strong> to engineer fast, outcome-driven websites and
                  domain-grounded AI agents (including RIYA) — uniting co-founders <strong>Steveoking</strong>{' '}
                  (Motionverse) and <strong>Creative Expression</strong> (Chigoma) under one studio and opening
                  KR8 Academy at zero tuition.
                </p>
                <MobileDisclosure label="Read Timfire's full executive biography">
                  <p>
                    Businesses and institutions rarely fail for lack of vision — they lose momentum when their
                    websites load slowly, bury the customer&apos;s next step, or leave enquiries unanswered in
                    fragmented inboxes.
                  </p>
                  <p>
                    Whether architecting a multi-page institutional platform, engineering a search-ready
                    storefront, or deploying an operational AI agent, every line of code is measured by speed,
                    clarity, and commercial utility — while KR8 Academy, KR8 DIGITALS TRIBE, and Mindset Shift
                    equip the next generation free of tuition.
                  </p>
                </MobileDisclosure>
              </div>
            </div>

            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/team/founder-timfire-wide.jpg"
                alt="Timfire working on web architecture and engineering systems at KR8 DIGITALS"
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>Hands-On Technical Leadership</span>
                  <strong>Web Platforms · AI Agents · Architecture</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================== SPECIALISMS & RESPONSIBILITIES */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <SectionAtmosphere name="website-engineering-cinema" deskOpacity={0.12} mobOpacity={0.22} flare />
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Core Responsibilities</div>
              <h2 className="section-title">
                What Timfire leads <span className="text-grad">inside KR8 DIGITALS.</span>
              </h2>
            </div>
          </div>

          <div className="kr8-grid-3" style={{ marginTop: 28 }}>
            {SPECIALISMS.map((s, idx) => (
              <article
                className={`kr8-card ${idx === 0 ? 'kr8-card--accent' : ''} reveal up`}
                key={s.num}
              >
                <div className="kr8-card__num">{s.num}</div>
                <h3 className="kr8-card__title">{s.title}</h3>
                <ResponsiveCopy
                  as="p"
                  className="kr8-card__body"
                  desktop={s.body}
                  mobile={s.mobileBody}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                  {s.tags.map((tag) => (
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

      {/* ===================================== SELECTED ENGINEERING PROOF */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Shipped Web Architecture</div>
              <h2 className="section-title">Live web builds from the KR8 studio.</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop="Every platform below is deployed and live on the public web — open any project to experience its speed, structure, and responsiveness firsthand."
                mobile="Live, publicly deployed web platforms engineered at KR8 DIGITALS — tap any build to test live."
              />
            </div>
            <Link href="/services/website-design" className="btn-link">
              View All Web Builds <Icon name="arrow" size={15} />
            </Link>
          </div>

          <div className="kr8-grid-2" style={{ marginTop: 28 }}>
            {featuredSites.map((s) => (
              <article className="kr8-card reveal up" key={s.slug}>
                <div className="kr8-card__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.card} alt={`${s.name} website engineered by KR8 DIGITALS`} loading="lazy" />
                </div>
                <div className="kr8-card__num">{s.category} · {s.kind}</div>
                <h3 className="kr8-card__title">{s.name}</h3>
                <p className="kr8-card__body">{s.note}</p>
                <div className="kr8-card__foot">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-link"
                  >
                    Visit Live Deployment <Icon name="external" size={14} />
                  </a>
                </div>
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
              <div className="eyebrow">Meet the Co-Founders</div>
              <h2 className="section-title">Explore the rest of the founding leadership.</h2>
            </div>
            <Link href="/about#founders" className="btn-link">
              Back to About KR8 DIGITALS <Icon name="arrow" size={15} />
            </Link>
          </div>

          <div className="kr8-grid-2" style={{ marginTop: 24 }}>
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
              <span className="kr8-pill">Work With Timfire &amp; KR8 Engineering</span>
              <h2 className="section-title" style={{ marginTop: 14 }}>
                Need a custom website, web application, or intelligent AI workflow?
              </h2>
              <p className="section-lede" style={{ marginTop: 10 }}>
                Share your goals and timeline — our team will respond with a clear technical scope and fixed
                figure.
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/contact" className="btn-primary">
                Start a Conversation <Icon name="arrow" size={17} />
              </Link>
              <Link href="/services" className="btn-ghost">
                All Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
