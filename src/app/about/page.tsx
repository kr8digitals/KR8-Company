import Link from 'next/link';
import type { Metadata } from 'next';
import site from '../../../data/site.json';
import { getCmsPageBySlug, getCmsPartners, getCmsSeoForRoute, getCmsTeam } from '@/lib/cms';
import { Counter, Icon } from '@/components/ui';
import Duo from '@/components/Duo';
import { ResponsiveCopy, SectionAtmosphere } from '@/components/MobileExperience';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getCmsSeoForRoute('/about');
  return {
    title: seo?.metaTitle || 'About KR8 DIGITALS — Our Story, Founders, Mission & Ecosystem',
    description:
      seo?.metaDescription ||
      'Discover KR8 DIGITALS: a multi-disciplinary creative technology company building websites, brands, graphics, video, SEO, and AI automation while empowering talent through tuition-free digital training.',
    alternates: { canonical: '/about' },
    robots: seo?.noindex ? { index: false, follow: false } : undefined,
  };
}

const PILLARS_DUAL = [
  {
    num: 'ENGINE 01 · COMMERCIAL CRAFT',
    title: 'Executive Digital Delivery for Ambitious Organisations',
    body: 'Businesses, schools, hospitality brands, clinics, and founders commission KR8 DIGITALS when generic templates and fragmented freelancers fall short. Under one coordinated roof, we engineer fast web platforms, distinctive brand identities, scroll-stopping campaign graphics, retention-cut video reels, search engine authority, and grounded AI workflows.',
    mobileBody:
      'One accountable roof for businesses, schools, clinics, and founders — uniting custom websites, brand identity, campaign design, video reels, SEO, and AI workflows.',
    points: [
      'Website Design & Full-Stack Development',
      'Brand Strategy & Visual Identity Systems',
      'Commercial Graphic Design & Campaign Key Art',
      'Video Editing & Narrative Post-Production',
      'Technical & Local SEO Optimization',
      'Custom AI Agents & Workflow Automation',
    ],
    ctaLabel: 'Explore Commercial Services',
    ctaHref: '/services',
  },
  {
    num: 'ENGINE 02 · HUMAN CAPACITY',
    title: 'Tuition-Free Training, Community & Talent Pathways',
    body: 'We believe world-class digital capability should never be locked behind financial gatekeeping. Alongside client delivery, KR8 DIGITALS runs tuition-free digital skills cohorts via KR8 Academy, academic preparation with Next Gen Scholars, peer mentorship inside KR8 DIGITALS TRIBE, Mindset Shift leadership conversations, and a merit-based studio recruitment pipeline.',
    mobileBody:
      'Zero financial gatekeeping: 100% free digital skills at KR8 Academy, WAEC/JAMB prep with Next Gen Scholars, our 3,000+ creator Tribe, Mindset Shift, and merit-based studio roles.',
    points: [
      '100% Tuition-Free Digital Skills Training (KR8 Academy)',
      'Sciences, Arts, WAEC & JAMB Prep (Next Gen Scholars)',
      'KR8 DIGITALS TRIBE Peer Critique & Builder Network',
      'Mindset Shift Career & Perspective Forum',
      'Merit-Based Studio Pathway (Join the Team)',
    ],
    ctaLabel: 'Explore Ecosystem Programs',
    ctaHref: '/programs',
  },
];

const JOURNEY = [
  {
    step: '01',
    phase: 'Commercial Foundation',
    title: 'Built around shipped client outcomes',
    desc: 'KR8 DIGITALS began as an execution-first creative and engineering studio — judged strictly by websites that load fast, visuals that convert attention, and systems real customers use daily.',
    mobileDesc: 'Started as an execution-first studio judged strictly by fast sites, high-converting visuals, and real results.',
  },
  {
    step: '02',
    phase: 'The Umbrella Model',
    title: 'Three specialist practices, one unified standard',
    desc: 'Timfire united web & AI engineering with Steveoking (Motionverse) in brand & graphic design and Creative Expression (Chigoma) in film editing — preserving each creative voice under one accountable company.',
    mobileDesc: 'Timfire united web & AI with Steveoking (Motionverse) and Creative Expression (Chigoma) under one company.',
  },
  {
    step: '03',
    phase: 'KR8 Academy & Next Gen',
    title: 'Opening the craft at zero tuition cost',
    desc: 'Rather than gatekeep practical knowledge, the practitioners shipping paid client work opened structured, tuition-free digital tracks — joined by Next Gen Scholars for secondary and pre-university academics.',
    mobileDesc: 'Our working studio leads opened 7 free digital skill tracks plus free WAEC/JAMB prep via Next Gen Scholars.',
  },
  {
    step: '04',
    phase: 'Tribe & Ecosystem',
    title: 'A self-reinforcing creative institution',
    desc: 'Graduates and independent builders gather in KR8 DIGITALS TRIBE and Mindset Shift to sharpen standards, collaborate on briefs, and grow into the next generation of studio leaders.',
    mobileDesc: '3,000+ builders connect in KR8 Tribe and Mindset Shift to critique work, collaborate, and lead.',
  },
];

export default async function AboutPage() {
  const [team, partners, pageDoc] = await Promise.all([
    getCmsTeam(),
    getCmsPartners(),
    getCmsPageBySlug('about'),
  ]);
  return (
    <>
      {/* ============================================================ HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name="hero-mobile-stage" deskOpacity={0.16} mobOpacity={0.28} flare />
        <div className="wrap">
          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill">
                <i className="kr8-pill__dot" /> {pageDoc?.eyebrow || 'About KR8 DIGITALS'}
              </span>
              <h1 className="kr8-subhero__title">
                {pageDoc?.heroTitle || 'We are writing a story,'}{' '}
                <em>{pageDoc?.heroHighlight || 'and you can be a big part of it.'}</em>
              </h1>
              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={
                  pageDoc?.heroLede ||
                  'KR8 DIGITALS is a home for builders, dreamers, and organisations shaping what comes next. Whether you come to solve an important business challenge, master a digital craft for free, collaborate inside our creative community, or partner for lasting impact — there is a meaningful place for you in what we are building together.'
                }
                mobile="Whether you're launching a business project, learning a digital skill for free, joining our 3,000+ creator community, or partnering for impact — there is a place for you here."
              />
              <div className="kr8-subhero__actions">
                <Link href="/contact" className="btn-primary">
                  Work With Us <Icon name="arrow" size={17} />
                </Link>
                <Link href="/services" className="btn-ghost">
                  Explore Services
                </Link>
                <Link href="#founders" className="btn-link">
                  Meet the Founders <Icon name="arrow" size={14} />
                </Link>
              </div>
            </div>

            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/about/kr8-ecosystem-studio.webp"
                alt="Engineers, brand designers, and video editors collaborating inside the KR8 DIGITALS studio ecosystem"
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>Unified Studio &amp; Academy</span>
                  <strong>Engineering · Design · Film · Capacity</strong>
                </div>
                <Link href="/programs" className="btn-link" style={{ whiteSpace: 'nowrap' }}>
                  Our Programs <Icon name="arrow" size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== PROOF BAR */}
      <section className="proof" aria-label="KR8 DIGITALS verified company metrics">
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

      {/* ================================================== OUR STORY */}
      <Duo
        eyebrow="Our Story · Problem Solvers by Design"
        title="We are problem solvers — uniting distinct minds to solve what no one can solve alone."
        mobileSummary={
          <>
            <p>
              Real breakthroughs happen when distinct minds gather around one table. Under one roof,{' '}
              <strong>Timfire</strong> (Web &amp; AI), <strong>Steveoking</strong> (<strong>Motionverse</strong>),{' '}
              <strong>Creative Expression</strong> (<strong>Chigoma</strong>), and <strong>Next Gen Scholars</strong>{' '}
              turn tough challenges into working solutions — and pass those skills on tuition-free.
            </p>
            <p
              style={{
                marginTop: 10,
                padding: '11px 14px',
                borderRadius: 12,
                background: 'rgba(168, 85, 247, 0.1)',
                borderLeft: '3px solid var(--magenta)',
                color: 'var(--t-strong)',
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              <strong>Our Philosophy:</strong> Listen first, diagnose the real bottleneck, and build until solved.
            </p>
          </>
        }
        mobileExpandLabel="Read our full founding story"
        body={
          <>
            <p>
              Meaningful challenges rarely fit neatly inside a single skill. When people encounter problems too
              complex to solve in isolation, real breakthroughs happen the moment distinct minds, disciplines, and
              lived experiences come together around one table.
            </p>
            <p>
              That conviction is why <strong>KR8 DIGITALS</strong> exists. Under one accountable roof, web and AI
              engineering led by <strong>Timfire</strong> unites with <strong>Steveoking</strong> (
              <strong>Motionverse</strong>) in brand and graphic design, <strong>Creative Expression</strong> (
              <strong>Chigoma</strong>) in narrative video, and <strong>Next Gen Scholars</strong> in academics —
              turning tough organisational and human challenges into working solutions, while passing those same
              skills on tuition-free.
            </p>
            <p
              style={{
                marginTop: 6,
                padding: '14px 18px',
                borderRadius: 14,
                background: 'rgba(168, 85, 247, 0.09)',
                borderLeft: '3px solid var(--magenta)',
                color: 'var(--t-strong)',
                fontWeight: 500,
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              <strong>Our Philosophy:</strong> Listen first, diagnose the real bottleneck, bring the right
              capabilities together, and build until the problem is genuinely solved.
            </p>
          </>
        }
        media={[
          {
            src: '/img/about/our-story-roundtable.webp',
            alt: 'Engineers, brand designers, and filmmakers collaborating around one studio table at KR8 DIGITALS',
            caption: 'Distinct Minds · One Accountable Studio',
          },
          {
            src: '/img/services/brand-identity.webp',
            alt: 'Brand identity playbook and visual systems crafted inside KR8 DIGITALS',
          },
        ]}
        cta={{ label: 'See How We Solve Problems', href: '/services' }}
      />

      {/* ===================================== PURPOSE, MISSION & VISION */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <SectionAtmosphere name="services-atmosphere" deskOpacity={0.12} mobOpacity={0.2} flare />
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Direction &amp; Conviction</div>
              <h2 className="section-title">
                Purpose, Mission &amp; <span className="text-grad">Long-Term Vision.</span>
              </h2>
              <p className="section-lede">
                Every commercial build we ship and every free cohort we host is anchored to three clear
                commitments.
              </p>
            </div>
          </div>

          <div className="kr8-grid-3" style={{ marginTop: 30 }}>
            <article className="kr8-card kr8-card--accent reveal up">
              <div className="kr8-card__num">01 · OUR PURPOSE</div>
              <h3 className="kr8-card__title">Why KR8 DIGITALS Exists</h3>
              <p className="kr8-card__body">{site.company.purpose}</p>
            </article>

            <article className="kr8-card reveal up">
              <div className="kr8-card__num">02 · OUR MISSION</div>
              <h3 className="kr8-card__title">What We Execute Every Week</h3>
              <p className="kr8-card__body">{site.company.mission}</p>
            </article>

            <article className="kr8-card reveal up">
              <div className="kr8-card__num">03 · OUR VISION</div>
              <h3 className="kr8-card__title">The Institution We Are Building</h3>
              <p className="kr8-card__body">{site.company.vision}</p>
            </article>
          </div>
        </div>
      </section>

      {/* =========================== DUAL MODEL: COMMERCIAL + EMPOWERMENT */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <SectionAtmosphere name="join-team-builders" deskOpacity={0.12} mobOpacity={0.2} flare />
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">How the Ecosystem Works</div>
              <h2 className="section-title">
                Two engines that <span className="text-grad">strengthen each other.</span>
              </h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop="Commercial excellence funds and sharpens our curriculum; rigorous training cultivates disciplined talent capable of meeting real client standards."
                mobile="Paid commercial delivery funds our free training; rigorous cohorts raise the next wave of studio builders."
              />
            </div>
          </div>

          <div className="kr8-grid-2" style={{ marginTop: 30 }}>
            {PILLARS_DUAL.map((item, idx) => (
              <article
                key={item.num}
                className={`kr8-card ${idx === 0 ? 'kr8-card--accent' : ''} reveal up`}
              >
                <div className="kr8-card__num">{item.num}</div>
                <h3 className="kr8-card__title">{item.title}</h3>
                <ResponsiveCopy
                  as="p"
                  className="kr8-card__body"
                  desktop={item.body}
                  mobile={item.mobileBody}
                />
                <ul className="kr8-check-list">
                  {item.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                <div className="kr8-card__foot">
                  <Link href={item.ctaHref} className="btn-link">
                    {item.ctaLabel} <Icon name="arrow" size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Journey / Evolution Strip */}
          <div className="kr8-grid-4" style={{ marginTop: 22 }}>
            {JOURNEY.map((j) => (
              <div className="kr8-card reveal up" key={j.step} style={{ padding: '22px 24px' }}>
                <div className="kr8-card__num">
                  STEP {j.step} · {j.phase}
                </div>
                <h3 className="kr8-card__title" style={{ fontSize: 18 }}>
                  {j.title}
                </h3>
                <ResponsiveCopy
                  as="p"
                  className="kr8-card__body"
                  desktop={j.desc}
                  mobile={j.mobileDesc}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= FLAGSHIP TRAINING & TRIBE HIGHLIGHT */}
      <Duo
        flip
        cinemaBg="academy-cohort-cinema"
        eyebrow="Empowerment & Community"
        title="Free Digital Skills Training & the KR8 DIGITALS TRIBE."
        mobileSummary={
          <p>
            <strong>Zero tuition ($0 / ₦0)</strong> across 7 digital skill tracks at <strong>KR8 Academy</strong>{' '}
            plus WAEC &amp; JAMB prep via <strong>Next Gen Scholars</strong> — backed by lifelong critique and gig
            flow inside <strong>KR8 DIGITALS TRIBE</strong>.
          </p>
        }
        mobileExpandLabel="See how Academy & Tribe connect"
        body={
          <>
            <p>
              Our flagship social commitment is simple and uncompromising: <strong>zero tuition</strong> for
              earnest learners ready to do the work. Through <strong>KR8 Academy</strong>, students train across
              Website Development, Front-End Engineering, Graphic Design, Video Editing, Content Creation, Social
              Media Management, and Digital Marketing — while <strong>Next Gen Scholars</strong> equips secondary
              learners across Sciences and Arts for WAEC and JAMB.
            </p>
            <p>
              When a cohort concludes, growth continues inside <strong>KR8 DIGITALS TRIBE</strong> — our builder
              community dedicated to honest work-in-progress critique, interdisciplinary sprints, peer
              accountability, and shared creative momentum.
            </p>
          </>
        }
        bullets={[
          '100% Tuition-Free Digital & Academic Tracks',
          'Taught Directly by Working Studio Practitioners',
          'Ongoing Peer Critique & Community Inside KR8 DIGITALS TRIBE',
        ]}
        media={[
          {
            src: '/img/programs/free-training-academy.webp',
            alt: 'KR8 Academy tuition-free digital skills mentorship session',
            caption: 'KR8 Academy · Free Digital Training',
          },
          {
            src: '/img/programs/tribe-community.webp',
            alt: 'KR8 DIGITALS TRIBE creative community collaboration',
          },
        ]}
        cta={{ label: 'Explore Free Training & Tribe', href: '/programs' }}
      />

      {/* ====================================================== FOUNDERS */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }} id="founders">
        <SectionAtmosphere name="founder-craft-design" deskOpacity={0.28} mobOpacity={0.38} flare />
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Founding Leadership</div>
              <h2 className="section-title">
                Three founders. Three crafts. <span className="text-grad">One company.</span>
              </h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop="Meet the practitioners who lead engineering, brand & graphic design, and video production at KR8 DIGITALS. Explore each founder's dedicated profile page for their full story and body of work."
                mobile="Meet the three practicing founders leading Web & AI, Brand Design, and Video Production at KR8 DIGITALS."
              />
            </div>
          </div>

          <div className="kr8-founder-grid" style={{ marginTop: 32 }}>
            {team.founders.map((f) => (
              <article className="kr8-founder-card reveal up" key={f.slug} id={f.slug}>
                <Link href={f.readAbout} className="kr8-founder-card__photo" aria-label={f.linkText}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.photo} alt={`${f.name} (${f.fullName}) — ${f.role} at KR8 DIGITALS`} />
                </Link>
                <div className="kr8-founder-card__body">
                  <div className="kr8-founder-card__role">{f.role}</div>
                  <h3 className="kr8-founder-card__name" style={{ marginTop: 6 }}>
                    {f.name}
                  </h3>
                  <div className="kr8-founder-card__full">{f.fullName}</div>
                  <p className="kr8-founder-card__bio">{f.bio}</p>
                  <div className="kr8-card__foot">
                    <Link href={f.readAbout} className="btn-link">
                      {f.linkText} <Icon name="arrow" size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================= CORE TEAM */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }} id="team">
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Operations &amp; Execution</div>
              <h2 className="section-title">Core Leadership Team.</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop="The operational leaders stewarding financial strategy, project milestones, general management, and accountability across KR8 DIGITALS."
                mobile="Stewarding finance, project milestones, studio operations, and accountability across every delivery."
              />
            </div>
            <Link href="/about/join-the-team" className="btn-link">
              Apply to Join the Team <Icon name="arrow" size={15} />
            </Link>
          </div>

          <div className="kr8-grid-4 kr8-grid-4--exec" style={{ marginTop: 28 }}>
            {team.team.map((p) => (
              <article className="kr8-founder-card reveal up" key={p.name}>
                <div className="kr8-founder-card__photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.photo} alt={`${p.name} — ${p.role} at KR8 DIGITALS`} loading="lazy" />
                </div>
                <div className="kr8-founder-card__body" style={{ padding: '20px 22px 24px' }}>
                  <div className="kr8-founder-card__role">{p.role}</div>
                  <h3
                    className="kr8-founder-card__name"
                    style={{ fontSize: 19, whiteSpace: 'normal', lineHeight: 1.25, marginTop: 6 }}
                  >
                    {p.name}
                  </h3>
                  <p className="kr8-founder-card__bio" style={{ fontSize: 13.8, marginTop: 10 }}>
                    {p.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================ PARTNERSHIPS */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <SectionAtmosphere name="partners-alliance-cinema" deskOpacity={0.14} mobOpacity={0.24} flare />
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Co-Founding &amp; Academic Partners</div>
              <h2 className="section-title">
                Organisations building <span className="text-grad">under the same roof.</span>
              </h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop="Partner studios and educational institutions collaborate directly inside KR8 DIGITALS — retaining their distinct identity while multiplying impact across client work and free education."
                mobile="Co-founding studios and academic partners multiplying impact across client work and free cohorts."
              />
            </div>
            <Link href="/partners" className="btn-link">
              Partner With KR8 DIGITALS <Icon name="arrow" size={15} />
            </Link>
          </div>

          <div className="kr8-grid-3" style={{ marginTop: 28 }}>
            {partners.map((p) => {
              const partnerPhotos: Record<string, string> = {
                motionverse: '/img/services/motionverse-studio.webp',
                chigoma: '/img/services/video-editing-suite.webp',
                'next-gen-scholars': '/img/partners/track-schools.webp',
              };
              const pImg = partnerPhotos[p.slug] || '/img/partners/partnership-collaboration.webp';
              return (
                <article className="kr8-card reveal up" key={p.slug}>
                  <div className="kr8-card-photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pImg} alt={`${p.name} — ${p.type} inside KR8 DIGITALS`} loading="lazy" />
                    <span className="kr8-card-photo__tag">{p.mark} · {p.type}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                    <div className="partner-tile__mark" aria-hidden="true">
                      <span>{p.mark}</span>
                    </div>
                    <div>
                      <div className="kr8-card__num" style={{ marginBottom: 3 }}>
                        {p.type}
                      </div>
                      <h3 className="kr8-card__title" style={{ fontSize: 22 }}>
                        {p.name}
                      </h3>
                    </div>
                  </div>
                  <p className="kr8-card__body">{p.blurb}</p>
                  <div className="kr8-card__foot">
                    <Link href={p.href} className="btn-link">
                      Read Partner Profile <Icon name="arrow" size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================= CLOSING CTA */}
      <section className="section" style={{ paddingTop: 12 }}>
        <div className="wrap">
          <div className="kr8-cta-banner reveal up">
            <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.45} mobOpacity={0.55} flare />
            <div>
              <span className="kr8-pill">Next Step</span>
              <h2 className="section-title" style={{ marginTop: 14 }}>
                Ready to build with KR8 DIGITALS — or grow inside our ecosystem?
              </h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop="Commission a commercial project with a clear written scope, propose an institutional partnership, or step into our tuition-free training programs today."
                mobile="Start a custom project brief, propose a partnership, or join a 100% free cohort today."
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/contact" className="btn-primary">
                Start a Project <Icon name="arrow" size={17} />
              </Link>
              <Link href="/partners" className="btn-ghost">
                Partner With Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
