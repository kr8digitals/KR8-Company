import { getEditableDocument } from '@/lib/editable-content';
import { getPublicContent } from '@/lib/public-content';
import Link from 'next/link';
import type { Metadata } from 'next';
import sitesData from '../../../../data/sites.json';
import { Icon } from '@/components/ui';
import {
  MobileDisclosure,
  ResponsiveCopy,
  SectionAtmosphere,
} from '@/components/MobileExperience';

export async function generateMetadata(): Promise<Metadata> {
  return (await getEditableDocument("app:about:creative-expression:page")).blocks.metadata as Metadata;
}

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

export default async function CreativeExpressionProfilePage() {
  const editableContent = await getEditableDocument("app:about:creative-expression:page");
  const FILM_PILLARS = editableContent.blocks.FILM_PILLARS as EditableBlockTypes["FILM_PILLARS"];

  const publicData = await getPublicContent();
  const sitesData = publicData.catalog;

  const videos = sitesData.videos;

  return (
    <>
      {/* =================================================== PROFILE HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name="founder-craft-film" deskOpacity={0.32} mobOpacity={0.42} flare />
        <div className="wrap">
          <nav className="kr8-breadcrumb" aria-label={editableContent.texts.field_2bd873d6c7}>
            <Link href="/">{editableContent.texts.text_3a78695388}</Link>
            <span>/</span>
            <Link href={editableContent.texts.field_979bddc4a8}>{editableContent.texts.text_4efca0d10c}</Link>
            <span>/</span>
            <span style={{ color: 'var(--t-strong)' }}>{editableContent.texts.text_ebb49eeed8}</span>
          </nav>

          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill">
                <i className="kr8-pill__dot" /> {editableContent.texts.text_134217c4bc}</span>
              <h1 className="kr8-subhero__title">{editableContent.texts.text_ebb49eeed8}</h1>
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
                {editableContent.texts.text_1baca3f7ac}</p>

              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={
                  <>
                    <strong>{editableContent.texts.text_ebb49eeed8}</strong> {editableContent.texts.text_78b3f28cc3}<strong>{editableContent.texts.text_b24de82168}</strong>{editableContent.texts.text_1dafab9f6e}<strong>{editableContent.texts.text_0bbfb207b2}</strong>{editableContent.texts.text_d69c50e919}</>
                }
                mobile={
                  <>
                    <strong>{editableContent.texts.text_ebb49eeed8}</strong> {editableContent.texts.text_78b3f28cc3}<strong>{editableContent.texts.text_b24de82168}</strong>{editableContent.texts.text_1dafab9f6e}<strong>{editableContent.texts.text_0bbfb207b2}</strong>.
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
                {editableContent.texts.text_45d6c33c70}</blockquote>

              <div className="kr8-subhero__actions">
                <Link href={editableContent.texts.field_877fc4ac7b} className="btn-primary">
                  {editableContent.texts.text_20d9dda017}<Icon name="arrow" size={17} />
                </Link>
                <Link href={editableContent.texts.field_35435b9b43} className="btn-ghost">
                  {editableContent.texts.text_f15047b9c5}</Link>
              </div>
            </div>

            <div className="kr8-subhero__frame kr8-subhero__frame--portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={editableContent.texts.field_154028babb}
                alt={editableContent.texts.field_6a413ff1ac}
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>{editableContent.texts.text_bd2d484b0a}</span>
                  <strong>{editableContent.texts.text_2c5ec94b78}</strong>
                </div>
                <span style={{ color: 'var(--t-lilac-strong)' }}>{editableContent.texts.text_b24de82168}</span>
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
              <div className="eyebrow">{editableContent.texts.text_69c49613e7}</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                {editableContent.texts.text_b6f7fe6828}<span className="text-grad">{editableContent.texts.text_7fb0222cb2}</span>
              </h2>

              <div className="prose-lg kr8-desk-only" style={{ marginTop: 18, display: 'grid', gap: 16 }}>
                <p>
                  {editableContent.texts.text_f6e7fb4976}<strong>{editableContent.texts.text_ebb49eeed8}</strong> {editableContent.texts.text_61d8ee2d14}{' '}
                  <strong>{editableContent.texts.text_b24de82168}</strong>{editableContent.texts.text_7f64505efc}<strong>{editableContent.texts.text_0bbfb207b2}</strong> {editableContent.texts.text_23f5f47337}</p>
                <p>
                  {editableContent.texts.text_db5b201ecf}</p>
                <p>
                  {editableContent.texts.text_8379295e03}<strong>{editableContent.texts.text_ca538eaf54}</strong>{editableContent.texts.text_efe8930e10}</p>
              </div>

              <div className="kr8-mob-only" style={{ marginTop: 12 }}>
                <p className="kr8-card__body">
                  {editableContent.texts.text_f64e02d51d}<strong>{editableContent.texts.text_b24de82168}</strong> {editableContent.texts.text_b646bd6843}<strong>{editableContent.texts.text_0bbfb207b2}</strong>,{' '}
                  <strong>{editableContent.texts.text_ebb49eeed8}</strong> {editableContent.texts.text_8df98b3e62}{' '}
                  <strong>{editableContent.texts.text_ca538eaf54}</strong>.
                </p>
                <MobileDisclosure label="Read Creative Expression's full story">
                  <p>
                    {editableContent.texts.text_aca1ca10e4}</p>
                  <p>
                    {editableContent.texts.text_7a8e094253}</p>
                </MobileDisclosure>
              </div>
            </div>

            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={editableContent.texts.field_fcee33f6ef}
                alt={editableContent.texts.field_8386ca2f6a}
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>{editableContent.texts.text_75adce0e26}</span>
                  <strong>{editableContent.texts.text_18af9ec313}</strong>
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
              <div className="eyebrow">{editableContent.texts.text_00b370dd5f}</div>
              <h2 className="section-title">
                {editableContent.texts.text_05359d3e4a}<span className="text-grad">{editableContent.texts.text_13b7efeb17}</span>
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
              <div className="eyebrow">{editableContent.texts.text_7f993faa62}</div>
              <h2 className="section-title">{editableContent.texts.text_b6dd9344df}</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop={editableContent.texts.field_a09c273be6}
                mobile={editableContent.texts.field_67bc2c31a7}
              />
            </div>
            <Link href={editableContent.texts.field_be2f7496d9} className="btn-link">
              {editableContent.texts.text_15072e4e09}<Icon name="arrow" size={15} />
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
              <div className="eyebrow">{editableContent.texts.text_65612a9656}</div>
              <h2 className="section-title">{editableContent.texts.text_c7f2918bb5}</h2>
            </div>
            <Link href={editableContent.texts.field_6cbb86594e} className="btn-link">
              {editableContent.texts.text_b1dbcb4a65}<Icon name="arrow" size={15} />
            </Link>
          </div>

          <div className="kr8-grid-2" style={{ marginTop: 24 }}>
            <Link href={editableContent.texts.field_9fa8f30927} className="kr8-card" style={{ textDecoration: 'none' }}>
              <div className="kr8-card__num">{editableContent.texts.text_049fc61799}</div>
              <h3 className="kr8-card__title">{editableContent.texts.text_0ce53ad94a}</h3>
              <p className="kr8-card__body">
                {editableContent.texts.text_025bca27c5}</p>
              <div className="kr8-card__foot">
                <span className="btn-link">
                  {editableContent.texts.text_c2976959e0}<Icon name="arrow" size={14} />
                </span>
              </div>
            </Link>

            <Link href={editableContent.texts.field_a3b5a1f01c} className="kr8-card" style={{ textDecoration: 'none' }}>
              <div className="kr8-card__num">{editableContent.texts.text_df01a8efa8}</div>
              <h3 className="kr8-card__title">{editableContent.texts.text_cf3cd9881e}</h3>
              <p className="kr8-card__body">
                {editableContent.texts.text_446b653f17}</p>
              <div className="kr8-card__foot">
                <span className="btn-link">
                  {editableContent.texts.text_0fb5cd0e3f}<Icon name="arrow" size={14} />
                </span>
              </div>
            </Link>
          </div>

          <div className="kr8-cta-banner reveal up" style={{ marginTop: 34 }}>
            <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.45} mobOpacity={0.55} flare />
            <div>
              <span className="kr8-pill">{editableContent.texts.text_a481cbf2d2}</span>
              <h2 className="section-title" style={{ marginTop: 14 }}>
                {editableContent.texts.text_2be0596b37}</h2>
              <p className="section-lede" style={{ marginTop: 10 }}>
                {editableContent.texts.text_78cf3bc458}</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href={editableContent.texts.field_877fc4ac7b} className="btn-primary">
                {editableContent.texts.text_6ecf039e1f}<Icon name="arrow" size={17} />
              </Link>
              <Link href={editableContent.texts.field_be2f7496d9} className="btn-ghost">
                {editableContent.texts.text_9d451e807a}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

type EditableBlockTypes = { FILM_PILLARS: typeof FILM_PILLARS };
