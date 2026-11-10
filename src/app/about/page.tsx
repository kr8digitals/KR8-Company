import CmsSections from '@/components/CmsSections';
import { formatEditableText } from '@/lib/content-format';
import { getEditableDocument } from '@/lib/editable-content';
import { getPublicContent } from '@/lib/public-content';
import Link from 'next/link';
import type { Metadata } from 'next';
import site from '../../../data/site.json';
import { getCmsPageBySlug, getCmsPartners, getCmsSeoForRoute, getCmsTeam } from '@/lib/cms';
import { Counter, Icon } from '@/components/ui';
import Duo from '@/components/Duo';
import { ResponsiveCopy, SectionAtmosphere } from '@/components/MobileExperience';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const publicData = await getPublicContent();
  const site = publicData.site;

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
  const editableContent = await getEditableDocument("app:about:page");
  const PILLARS_DUAL = editableContent.blocks.PILLARS_DUAL as EditableBlockTypes["PILLARS_DUAL"];
  const JOURNEY = editableContent.blocks.JOURNEY as EditableBlockTypes["JOURNEY"];

  const publicData = await getPublicContent();
  const site = publicData.site;

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
                <i className="kr8-pill__dot" /> {pageDoc?.eyebrow || editableContent.texts.copy_feb5329249}
              </span>
              <h1 className="kr8-subhero__title">
                {pageDoc?.heroTitle || editableContent.texts.copy_41a6197fd7}{' '}
                <em>{pageDoc?.heroHighlight || editableContent.texts.copy_8fd8f4006f}</em>
              </h1>
              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={
                  pageDoc?.heroLede ||
                  editableContent.texts.copy_a676c4ca21
                }
                mobile={editableContent.texts.field_c66614f871}
              />
              <div className="kr8-subhero__actions">
                <Link href={editableContent.texts.field_4eb9506365} className="btn-primary">
                  {editableContent.texts.text_2bc200c6f4}<Icon name="arrow" size={17} />
                </Link>
                <Link href={editableContent.texts.field_3b1aeccb74} className="btn-ghost">
                  {editableContent.texts.text_2093ef4e36}</Link>
                <Link href={editableContent.texts.field_4620b98e6c} className="btn-link">
                  {editableContent.texts.text_f2ef0affcf}<Icon name="arrow" size={14} />
                </Link>
              </div>
            </div>

            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={editableContent.texts.field_3c3d42a4a6}
                alt={editableContent.texts.field_3464a9fbc6}
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>{editableContent.texts.text_e1435609d5}</span>
                  <strong>{editableContent.texts.text_92ab0272d7}</strong>
                </div>
                <Link href={editableContent.texts.field_271bdd2473} className="btn-link" style={{ whiteSpace: 'nowrap' }}>
                  {editableContent.texts.text_42ca95b409}<Icon name="arrow" size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== PROOF BAR */}
      <section className="proof" aria-label={editableContent.texts.field_46ac130f46}>
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
        title={editableContent.texts.field_49f14a3b2b}
        mobileSummary={
          <>
            <p>
              {editableContent.texts.text_8629d49c83}{' '}
              <strong>{editableContent.texts.text_e490bfa3fb}</strong> {editableContent.texts.text_7c5df38c8d}<strong>{editableContent.texts.text_d5b3fef0ee}</strong> (<strong>{editableContent.texts.text_6271b13e79}</strong>),{' '}
              <strong>{editableContent.texts.text_ebb49eeed8}</strong> (<strong>{editableContent.texts.text_b24de82168}</strong>{editableContent.texts.text_a5009f2d99}<strong>{editableContent.texts.text_391f14ed70}</strong>{' '}
              {editableContent.texts.text_43eddb7804}</p>
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
              <strong>{editableContent.texts.text_f2d2bcaca2}</strong> {editableContent.texts.text_3ab6aeb82c}</p>
          </>
        }
        mobileExpandLabel="Read our full founding story"
        body={
          <>
            <p>
              {editableContent.texts.text_9f8b2acd25}</p>
            <p>
              {editableContent.texts.text_1e8bc927f3}<strong>{editableContent.texts.text_0bbfb207b2}</strong> {editableContent.texts.text_3659ad43b2}<strong>{editableContent.texts.text_e490bfa3fb}</strong> {editableContent.texts.text_a16509f23a}<strong>{editableContent.texts.text_d5b3fef0ee}</strong> (
              <strong>{editableContent.texts.text_6271b13e79}</strong>{editableContent.texts.text_783ffbcaf6}<strong>{editableContent.texts.text_ebb49eeed8}</strong> (
              <strong>{editableContent.texts.text_b24de82168}</strong>{editableContent.texts.text_7bb9fc415e}<strong>{editableContent.texts.text_391f14ed70}</strong> {editableContent.texts.text_383d62a807}</p>
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
              <strong>{editableContent.texts.text_f2d2bcaca2}</strong> {editableContent.texts.text_3f74c6ddee}</p>
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
              <div className="eyebrow">{editableContent.texts.text_2675e10e64}</div>
              <h2 className="section-title">
                {editableContent.texts.text_f935b3f2e0}<span className="text-grad">{editableContent.texts.text_4226a13ecc}</span>
              </h2>
              <p className="section-lede">
                {editableContent.texts.text_6919fabfdc}</p>
            </div>
          </div>

          <div className="kr8-grid-3" style={{ marginTop: 30 }}>
            <article className="kr8-card kr8-card--accent reveal up">
              <div className="kr8-card__num">{editableContent.texts.text_523120e30e}</div>
              <h3 className="kr8-card__title">{editableContent.texts.text_d5f71bfd27}</h3>
              <p className="kr8-card__body">{site.company.purpose}</p>
            </article>

            <article className="kr8-card reveal up">
              <div className="kr8-card__num">{editableContent.texts.text_053769c0a2}</div>
              <h3 className="kr8-card__title">{editableContent.texts.text_e714e766d1}</h3>
              <p className="kr8-card__body">{site.company.mission}</p>
            </article>

            <article className="kr8-card reveal up">
              <div className="kr8-card__num">{editableContent.texts.text_a3d625b71e}</div>
              <h3 className="kr8-card__title">{editableContent.texts.text_92fb8cd5b3}</h3>
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
              <div className="eyebrow">{editableContent.texts.text_ca42ea49a8}</div>
              <h2 className="section-title">
                {editableContent.texts.text_4b5d669661}<span className="text-grad">{editableContent.texts.text_878f06e42c}</span>
              </h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop={editableContent.texts.field_2665c6681b}
                mobile={editableContent.texts.field_8b710757dc}
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
                  {editableContent.texts.text_94bccdb1d5}{j.step} · {j.phase}
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
        title={editableContent.texts.field_9694e5df2f}
        mobileSummary={
          <p>
            <strong>{editableContent.texts.text_3780833d6b}</strong> {editableContent.texts.text_5890ad8827}<strong>{editableContent.texts.text_ca538eaf54}</strong>{' '}
            {editableContent.texts.text_c708108e37}<strong>{editableContent.texts.text_391f14ed70}</strong> {editableContent.texts.text_4f06b25bb7}<strong>{editableContent.texts.text_5c09b75136}</strong>.
          </p>
        }
        mobileExpandLabel="See how Academy & Tribe connect"
        body={
          <>
            <p>
              {editableContent.texts.text_b8bc0d84df}<strong>{editableContent.texts.text_c7c9c2cfd4}</strong> {editableContent.texts.text_1e20c52145}<strong>{editableContent.texts.text_ca538eaf54}</strong>{editableContent.texts.text_fa308387fc}<strong>{editableContent.texts.text_391f14ed70}</strong> {editableContent.texts.text_6378672aee}</p>
            <p>
              {editableContent.texts.text_34c185c823}<strong>{editableContent.texts.text_5c09b75136}</strong> {editableContent.texts.text_ea325e3794}</p>
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
              <div className="eyebrow">{editableContent.texts.text_65612a9656}</div>
              <h2 className="section-title">
                {editableContent.texts.text_c9eb0dea63}<span className="text-grad">{editableContent.texts.text_de7ef46b88}</span>
              </h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop={editableContent.texts.field_f487f968ae}
                mobile={editableContent.texts.field_3ac1bd7ecb}
              />
            </div>
          </div>

          <div className="kr8-founder-grid" style={{ marginTop: 32 }}>
            {team.founders.map((f) => (
              <article className="kr8-founder-card reveal up" key={f.slug} id={f.slug}>
                <Link href={f.readAbout} className="kr8-founder-card__photo" aria-label={f.linkText}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.photo} alt={formatEditableText(editableContent.texts.copy_206af0bed4, [f.name, f.fullName, f.role])} />
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
              <div className="eyebrow">{editableContent.texts.text_45687ec36d}</div>
              <h2 className="section-title">{editableContent.texts.text_bdc53a7fe0}</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop={editableContent.texts.field_6d80e637b0}
                mobile={editableContent.texts.field_41abd9d0fb}
              />
            </div>
            <Link href={editableContent.texts.field_78c2a55cd4} className="btn-link">
              {editableContent.texts.text_d4592b3403}<Icon name="arrow" size={15} />
            </Link>
          </div>

          <div className="kr8-grid-4 kr8-grid-4--exec" style={{ marginTop: 28 }}>
            {team.team.map((p) => (
              <article className="kr8-founder-card reveal up" key={p.name}>
                <div className="kr8-founder-card__photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.photo} alt={formatEditableText(editableContent.texts.copy_6aec40e429, [p.name, p.role])} loading="lazy" />
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
              <div className="eyebrow">{editableContent.texts.text_0b5031a111}</div>
              <h2 className="section-title">
                {editableContent.texts.text_eb45439861}<span className="text-grad">{editableContent.texts.text_1c5d3210dc}</span>
              </h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop={editableContent.texts.field_eec5100683}
                mobile={editableContent.texts.field_c314851add}
              />
            </div>
            <Link href={editableContent.texts.field_6d0f8c425c} className="btn-link">
              {editableContent.texts.text_098985f8c7}<Icon name="arrow" size={15} />
            </Link>
          </div>

          <div className="kr8-grid-3" style={{ marginTop: 28 }}>
            {partners.map((p) => {
              const partnerPhotos: Record<string, string> = {
                motionverse: '/img/services/motionverse-studio.webp',
                chigoma: '/img/services/video-editing-suite.webp',
                'next-gen-scholars': '/img/partners/track-schools.webp',
              };
              const pImg = partnerPhotos[p.slug] || editableContent.texts.copy_f1d162b5a5;
              return (
                <article className="kr8-card reveal up" key={p.slug}>
                  <div className="kr8-card-photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pImg} alt={formatEditableText(editableContent.texts.copy_11f2b02015, [p.name, p.type])} loading="lazy" />
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
                      {editableContent.texts.text_53e261e321}<Icon name="arrow" size={14} />
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
              <span className="kr8-pill">{editableContent.texts.text_226366c330}</span>
              <h2 className="section-title" style={{ marginTop: 14 }}>
                {editableContent.texts.text_4e342a0849}</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop={editableContent.texts.field_3eba2734ec}
                mobile={editableContent.texts.field_54b3692f77}
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href={editableContent.texts.field_4eb9506365} className="btn-primary">
                {editableContent.texts.text_4655aa144a}<Icon name="arrow" size={17} />
              </Link>
              <Link href={editableContent.texts.field_6d0f8c425c} className="btn-ghost">
                {editableContent.texts.text_be3dde060b}</Link>
            </div>
          </div>
        </div>
      </section>
      <CmsSections sections={pageDoc?.sections || []} />
    </>
  );
}

type EditableBlockTypes = { PILLARS_DUAL: typeof PILLARS_DUAL; JOURNEY: typeof JOURNEY };
