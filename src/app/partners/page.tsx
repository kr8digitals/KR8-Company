import Link from 'next/link';
import type { Metadata } from 'next';
import { getCmsPageBySlug, getCmsPartners, getCmsSeoForRoute } from '@/lib/cms';
import { Icon } from '@/components/ui';
import PartnerProposalForm from '@/components/PartnerProposalForm';
import {
  MobileDisclosure,
  ResponsiveCopy,
  SectionAtmosphere,
} from '@/components/MobileExperience';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getCmsSeoForRoute('/partners');
  return {
    title:
      seo?.metaTitle ||
      'Partner With KR8 DIGITALS — Strategic Alliances, Studio & Academic Partnerships',
    description:
      seo?.metaDescription ||
      'Why partner with KR8 DIGITALS? Discover mutual benefits, collaboration tracks, existing partners (Motionverse, Chigoma, Next Gen Scholars), and submit a partnership proposal.',
    alternates: { canonical: '/partners' },
    robots: seo?.noindex ? { index: false, follow: false } : undefined,
  };
}

const WHY_PARTNER = [
  {
    num: 'ADVANTAGE 01 · FULL-STACK EXECUTION POWER',
    title: 'Plug Directly Into Engineering, Brand, Design & Film',
    body: 'Instead of building isolated creative or technical teams from scratch, partners gain immediate collaboration with working full-stack developers, brand strategists, graphic designers, video editors, and AI engineers.',
    mobileBody: 'Collaborate immediately with working web & AI engineers, brand strategists, graphic designers, and film editors.',
  },
  {
    num: 'ADVANTAGE 02 · PRESERVED BRAND IDENTITY & CREDIT',
    title: 'Grow Under One Roof Without Losing Your Own Name',
    body: 'KR8 DIGITALS operates as a transparent creative umbrella — never erasing partner studios. Practices like Motionverse and Chigoma retain full public credit and distinct brand equity on every joint deliverable.',
    mobileBody: 'A transparent umbrella — partners like Motionverse and Chigoma keep full public credit and brand equity on every joint build.',
  },
  {
    num: 'ADVANTAGE 03 · VERIFIED HUMAN CAPACITY & REACH',
    title: 'Access Motivated Learners, Builders & Youth Impact',
    body: 'Educational institutions, sponsors, and NGOs connect directly with an active ecosystem of disciplined learners inside KR8 Academy, peer builders in KR8 DIGITALS TRIBE, and engaged audiences at Mindset Shift.',
    mobileBody: 'Connect directly with disciplined learners in KR8 Academy, 3,000+ builders in KR8 Tribe, and Mindset Shift audiences.',
  },
];

const COLLABORATION_TRACKS = [
  {
    tag: 'TRACK 01 · SPECIALIST STUDIOS',
    title: 'Creative & Technical Practice Partners',
    image: '/img/partners/track-studios.webp',
    imageAlt: 'Creative director crafting brand and campaign work inside a specialist partner studio',
    badge: 'Studios & Agencies',
    who: 'Design studios, production houses, copywriters, photographers, PR teams, and software specialists.',
    value: [
      'Co-deliver larger multi-disciplinary commercial scopes under one unified client proposal',
      'Retain public credit on portfolio pieces and partner chapters on the KR8 DIGITALS platform',
      'Mentor future collaborators directly through specialist masterclasses and Academy tracks',
    ],
  },
  {
    tag: 'TRACK 02 · EDUCATION & SCHOOLS',
    title: 'Academic & Institutional Partners',
    image: '/img/partners/track-schools.webp',
    imageAlt: 'Students collaborating with digital tablets and textbooks inside an academic partner institution',
    badge: 'Schools & STEM',
    who: 'Secondary schools, tutorial colleges, universities, STEM initiatives, and educational bodies.',
    value: [
      'Pair academic excellence (like Next Gen Scholars) with practical digital literacy for students',
      'Co-host digital bootcamps, career readiness workshops, and verified certification cohorts',
      'Modernize your institution’s own web platform, admissions visibility, and digital infrastructure',
    ],
  },
  {
    tag: 'TRACK 03 · SPONSORS & FOUNDATIONS',
    title: 'Training Cohort & Social Impact Sponsors',
    image: '/img/partners/track-sponsors.webp',
    imageAlt: 'Speaker addressing young African builders and scholars during a sponsored capacity forum',
    badge: 'CSR & Foundations',
    who: 'Corporate CSR programs, youth foundations, tech companies, diaspora donors, and civic leaders.',
    value: [
      'Sponsor data stipends, learning equipment, or dedicated tuition-free seats inside KR8 Academy',
      'Co-convene Mindset Shift editions reaching ambitious young builders and entrepreneurs',
      'Receive transparent impact reporting grounded in shipped student portfolios — not vanity metrics',
    ],
  },
  {
    tag: 'TRACK 04 · AGENCIES & ENTERPRISES',
    title: 'Commercial Delivery & White-Label Allies',
    image: '/img/partners/track-enterprise.webp',
    imageAlt: 'Executive leads reviewing a multi-milestone commercial delivery roadmap in a sunlit boardroom',
    badge: 'Enterprise & White-Label',
    who: 'Consultancies, marketing agencies, venture studios, and enterprise teams.',
    value: [
      'Reliable technical & creative execution partner for web builds, brand systems, SEO, and AI workflows',
      'Predictable written scopes, clear milestone handoffs, and disciplined engineering standards',
      'Flexible co-branded or white-label delivery structured around your client relationships',
    ],
  },
];

const PROCESS_STEPS = [
  {
    n: '01',
    t: 'Submit Your Proposal',
    d: 'Share your organisation, partnership track, and collaboration goals using the form below.',
  },
  {
    n: '02',
    t: 'Executive Alignment Call',
    d: 'Meet directly with KR8 DIGITALS leadership to explore strategic fit, standards, and shared upside.',
  },
  {
    n: '03',
    t: 'Written Charter & Roles',
    d: 'We document clear responsibilities, brand attribution rules, and measurable milestones in writing.',
  },
  {
    n: '04',
    t: 'Co-Branded Execution',
    d: 'Launch joint client deliveries, academic cohorts, or community initiatives under one shared standard.',
  },
];

export default async function PartnersPage() {
  const [partners, pageDoc] = await Promise.all([
    getCmsPartners(),
    getCmsPageBySlug('partners'),
  ]);
  return (
    <>
      {/* ============================================================ HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name="partners-alliance-cinema" deskOpacity={0.18} mobOpacity={0.32} flare />
        <div className="wrap">
          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill">
                <i className="kr8-pill__dot" /> {pageDoc?.eyebrow || 'Strategic Alliances · KR8 DIGITALS'}
              </span>
              <h1 className="kr8-subhero__title">
                {pageDoc?.heroTitle || 'Why partner with'}{' '}
                <em>{pageDoc?.heroHighlight || 'KR8 DIGITALS?'}</em>
              </h1>
              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={
                  pageDoc?.heroLede ||
                  'Ambitious outcomes move faster when complementary strengths share one roof. Whether you lead a specialist creative studio, an academic institution, a corporate impact initiative, or a growing company — partnering with KR8 DIGITALS connects your mission to full-stack digital execution and an active talent ecosystem.'
                }
                mobile="Whether you lead a specialist studio, school, foundation, or agency — partner with KR8 DIGITALS for full-stack execution and youth talent impact."
              />
              <div className="kr8-subhero__actions">
                <a href="#propose" className="btn-primary">
                  Propose a Partnership <Icon name="arrow" size={17} />
                </a>
                <a href="#existing-partners" className="btn-ghost">
                  Meet Active Partners
                </a>
              </div>
            </div>

            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/partners/partnership-collaboration.webp"
                alt="Strategic partnership alignment session with KR8 DIGITALS leadership"
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>Active Partner Network</span>
                  <strong>Motionverse · Chigoma · Next Gen Scholars</strong>
                </div>
                <a href="#propose" className="btn-link" style={{ whiteSpace: 'nowrap' }}>
                  Apply Now <Icon name="arrow" size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================== WHY PARTNER WITH US */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">The Strategic Case</div>
              <h2 className="section-title">
                Built for <span className="text-grad">mutual leverage — never one-sided logos.</span>
              </h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop="We do not collect decorative partner badges. Every organisation inside our network builds real commercial deliverables, teaches real learners, or expands real opportunity."
                mobile="Zero decorative badges. Every partner builds real work, mentors learners, or expands real opportunity."
              />
            </div>
          </div>

          <div className="kr8-grid-3" style={{ marginTop: 28 }}>
            {WHY_PARTNER.map((w, idx) => (
              <article
                className={`kr8-card ${idx === 0 ? 'kr8-card--accent' : ''} reveal up`}
                key={w.num}
              >
                <div className="kr8-card__num">{w.num}</div>
                <h3 className="kr8-card__title">{w.title}</h3>
                <ResponsiveCopy
                  as="p"
                  className="kr8-card__body"
                  desktop={w.body}
                  mobile={w.mobileBody}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================== 4 PARTNERSHIP TRACKS */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <SectionAtmosphere name="services-atmosphere" deskOpacity={0.11} mobOpacity={0.2} flare />
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Ways We Collaborate</div>
              <h2 className="section-title">
                Four structured <span className="text-grad">partnership pathways.</span>
              </h2>
            </div>
          </div>

          <div className="kr8-grid-2" style={{ marginTop: 28 }}>
            {COLLABORATION_TRACKS.map((t, idx) => (
              <article className="kr8-card reveal up" key={t.tag}>
                <div className="kr8-card-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.image} alt={t.imageAlt} loading="lazy" />
                  <span className="kr8-card-photo__tag">{t.badge}</span>
                </div>
                <div className="kr8-card__num">{t.tag}</div>
                <h3 className="kr8-card__title">{t.title}</h3>
                <p className="kr8-card__body" style={{ fontWeight: 500, color: '#e9d5ff' }}>
                  Ideal for: {t.who}
                </p>
                <div className="kr8-desk-only">
                  <ul className="kr8-check-list">
                    {t.value.map((v) => (
                      <li key={v}>{v}</li>
                    ))}
                  </ul>
                </div>
                <div className="kr8-mob-only">
                  <MobileDisclosure label="See partnership benefits" defaultOpenMobile={idx === 0}>
                    <ul className="kr8-check-list">
                      {t.value.map((v) => (
                        <li key={v}>{v}</li>
                      ))}
                    </ul>
                  </MobileDisclosure>
                </div>
                <div className="kr8-card__foot">
                  <a href="#propose" className="btn-link">
                    Propose This Track <Icon name="arrow" size={14} />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* 4-Step Process Strip */}
          <div className="kr8-grid-4" style={{ marginTop: 24 }}>
            {PROCESS_STEPS.map((st) => (
              <div className="kr8-card reveal up" key={st.n} style={{ padding: '22px 24px' }}>
                <div className="kr8-card__num">STEP {st.n}</div>
                <h3 className="kr8-card__title" style={{ fontSize: 18.5 }}>
                  {st.t}
                </h3>
                <p className="kr8-card__body" style={{ fontSize: 13.8 }}>
                  {st.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================== EXISTING PARTNERS PROOF */}
      <section
        className="section"
        id="existing-partners"
        style={{ borderTop: '1px solid var(--hair-soft)', scrollMarginTop: 92 }}
      >
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Proof of the Umbrella in Action</div>
              <h2 className="section-title">
                Active organisations partnering <span className="text-grad">inside KR8 DIGITALS.</span>
              </h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop="Explore how our co-founding studios and academic partner collaborate across commercial delivery and tuition-free education."
                mobile="See how Motionverse, Chigoma, and Next Gen Scholars build and teach inside the umbrella."
              />
            </div>
          </div>

          <div className="kr8-grid-3" style={{ marginTop: 28 }}>
            {partners.map((p: any) => {
              const partnerCardPhotos: Record<string, string> = {
                motionverse: '/img/services/motionverse-studio.webp',
                chigoma: '/img/services/video-editing-suite.webp',
                'next-gen-scholars': '/img/partners/track-schools.webp',
              };
              const cardImg = partnerCardPhotos[p.slug] || '/img/partners/partnership-collaboration.webp';
              return (
                <article className="kr8-card reveal up" key={p.slug}>
                  <div className="kr8-card-photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cardImg} alt={`${p.name} — ${p.type} inside KR8 DIGITALS`} loading="lazy" />
                    <span className="kr8-card-photo__tag">{p.mark} · {p.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                    <div className="partner-tile__mark" aria-hidden="true">
                      <span>{p.mark}</span>
                    </div>
                    <div>
                      <div className="kr8-card__num" style={{ marginBottom: 3 }}>
                        {p.type}
                      </div>
                      <h3 className="kr8-card__title" style={{ fontSize: 23 }}>
                        {p.name}
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: 13.5, color: '#f5d0fe', fontWeight: 600 }}>Lead: {p.person}</p>
                  <ResponsiveCopy
                    as="p"
                    className="kr8-card__body"
                    desktop={p.long}
                    mobile={p.blurb || p.long}
                  />

                  <div
                    style={{
                      marginTop: 14,
                      padding: '11px 13px',
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.035)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      fontSize: 12.8,
                      color: 'rgba(226,218,242,0.85)',
                    }}
                  >
                    <strong style={{ color: '#fff' }}>Academy Role:</strong> {p.teaches}
                  </div>

                  <div className="kr8-card__foot">
                    <Link href={p.href} className="btn-link">
                      Read {p.name} Chapter <Icon name="arrow" size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================== WORKING PROPOSAL FORM */}
      <section
        className="section"
        id="propose"
        style={{ borderTop: '1px solid var(--hair-soft)', scrollMarginTop: 92 }}
      >
        <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.26} mobOpacity={0.38} flare />
        <div className="wrap">
          <div className="kr8-grid-2" style={{ alignItems: 'start', gap: 32 }}>
            <div>
              <div className="eyebrow">Start a Strategic Conversation</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                Let&apos;s build something neither of us could build <span className="text-grad">alone.</span>
              </h2>
              <ResponsiveCopy
                as="p"
                className="prose-lg"
                desktop="Whether you represent a creative studio ready to collaborate on larger commercial mandates, a school seeking digital & academic empowerment for students, or an organisation ready to sponsor tuition-free cohorts — we welcome thoughtful proposals."
                mobile="Submit your proposal below — founding leadership reviews every studio, school, and sponsorship request directly."
              />

              <div className="kr8-card" style={{ marginTop: 22, padding: '20px 22px' }}>
                <div className="kr8-card__num">WHAT HAPPENS AFTER YOU SUBMIT</div>
                <ul className="kr8-check-list" style={{ marginTop: 8 }}>
                  <li>Your proposal is logged immediately in the KR8 DIGITALS Partnerships Dashboard.</li>
                  <li>Founding leadership reviews alignment across commercial, educational, and brand standards.</li>
                  <li>We reply directly via email or WhatsApp to schedule an executive discovery call.</li>
                </ul>
              </div>
            </div>

            <PartnerProposalForm />
          </div>
        </div>
      </section>
    </>
  );
}
