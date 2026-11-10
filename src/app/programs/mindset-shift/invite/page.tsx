import { getEditableDocument } from '@/lib/editable-content';
import Link from 'next/link';
import type { Metadata } from 'next';
import LeadForm from '@/components/LeadForm';
import { Icon } from '@/components/ui';
import {
  CinemaVisual,
  ResponsiveCopy,
  SectionAtmosphere,
} from '@/components/MobileExperience';

export async function generateMetadata(): Promise<Metadata> {
  return (await getEditableDocument("app:programs:mindset-shift:invite:page")).blocks.metadata as Metadata;
}

const THEMES = [
  {
    num: 'THEME 01 · CRAFT & EXCELLENCE',
    title: 'Moving From Amateur Effort to Commercial Standards',
    body: 'Why technical tutorials alone rarely create a career — and how reliability, communication, and taste separate trusted professionals.',
    mobileBody: 'Why tutorials alone aren’t enough — and how reliability, taste, and execution separate trusted pros.',
  },
  {
    num: 'THEME 02 · VALUE & ECONOMICS',
    title: 'Ethical Wealth Building & Pricing Real Solutions',
    body: 'Understanding how businesses measure return on investment so young creatives and engineers build sustainable livelihoods.',
    mobileBody: 'Understanding business ROI so young professionals price real value and build lasting wealth.',
  },
  {
    num: 'THEME 03 · LONG-TERM VISION',
    title: 'Compounding Reputation, Discipline & Leadership',
    body: 'Real stories from founders and operators who started with limited resources and stayed consistent long enough to build enduring work.',
    mobileBody: 'Candid stories from founders who started lean and compounded discipline into enduring institutions.',
  },
];

export default async function MindsetShiftInvitePage() {
  const editableContent = await getEditableDocument("app:programs:mindset-shift:invite:page");
  const THEMES = editableContent.blocks.THEMES as EditableBlockTypes["THEMES"];

  return (
    <>
      {/* ============================================================ HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name="mindset-shift-stage" deskOpacity={0.2} mobOpacity={0.34} flare />
        <div className="wrap">
          <nav className="kr8-breadcrumb" aria-label={editableContent.texts.field_2bd873d6c7}>
            <Link href="/">{editableContent.texts.text_3a78695388}</Link>
            <span>/</span>
            <Link href={editableContent.texts.field_271bdd2473}>{editableContent.texts.text_b6747064b2}</Link>
            <span>/</span>
            <span style={{ color: 'var(--t-strong)' }}>{editableContent.texts.text_7e4dd262de}</span>
          </nav>

          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill kr8-pill--amber">
                <i className="kr8-pill__dot" /> {editableContent.texts.text_9abfa4cbae}</span>
              <h1 className="kr8-subhero__title">
                {editableContent.texts.text_79b1d41c3e}{' '}
                <em>{editableContent.texts.text_446e0ab530}</em>
              </h1>
              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={
                  <>
                    {editableContent.texts.text_cac0f8ae64}{' '}
                    <strong>{editableContent.texts.text_e490bfa3fb}</strong> {editableContent.texts.text_9060608fbb}<strong>{editableContent.texts.text_0bbfb207b2}</strong>{' '}
                    {editableContent.texts.text_aa0bbe25a1}</>
                }
                mobile={
                  <>
                    {editableContent.texts.text_d04444a24a}<strong>{editableContent.texts.text_e490bfa3fb}</strong> {editableContent.texts.text_a853697c91}<strong>{editableContent.texts.text_2bfe5b550d}</strong> {editableContent.texts.text_72728bfc67}</>
                }
              />
              <div className="kr8-subhero__actions">
                <a href={editableContent.texts.field_b6331134d3} className="btn-primary">
                  {editableContent.texts.text_e738102f13}<Icon name="arrow" size={17} />
                </a>
                <Link href={editableContent.texts.field_271bdd2473} className="btn-ghost">
                  {editableContent.texts.text_98361cccee}</Link>
              </div>
            </div>

            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={editableContent.texts.field_d70d13ab09}
                alt={editableContent.texts.field_109d91dab8}
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>{editableContent.texts.text_a85e446990}</span>
                  <strong>{editableContent.texts.text_16ef89c1d1}</strong>
                </div>
                <a href={editableContent.texts.field_b6331134d3} className="btn-link" style={{ whiteSpace: 'nowrap' }}>
                  {editableContent.texts.text_4f9d559aa2}<Icon name="arrow" size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================== CORE THEMES */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{editableContent.texts.text_a42a2ae92b}</div>
              <h2 className="section-title">
                {editableContent.texts.text_b47e126cc5}<span className="text-grad">{editableContent.texts.text_a972334027}</span>
              </h2>
            </div>
          </div>

          <div className="kr8-mob-only" style={{ marginTop: 16 }}>
            <CinemaVisual
              name="mindset-shift-stage"
              alt={editableContent.texts.field_a223f3c8e2}
              badge="1st & 3rd Sundays · 9PM"
              caption="Open to builders, students, and professionals from every field."
              mobileAspect="16 / 9"
            />
          </div>

          <div className="kr8-grid-3" style={{ marginTop: 26 }}>
            {THEMES.map((t, idx) => (
              <article
                className={`kr8-card ${idx === 0 ? 'kr8-card--accent' : ''} reveal up`}
                key={t.num}
              >
                <div className="kr8-card__num">{t.num}</div>
                <h3 className="kr8-card__title">{t.title}</h3>
                <ResponsiveCopy
                  as="p"
                  className="kr8-card__body"
                  desktop={t.body}
                  mobile={t.mobileBody}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================== INVITATION SIGNUP */}
      <section
        className="section"
        id="register"
        style={{ borderTop: '1px solid var(--hair-soft)', scrollMarginTop: 92 }}
      >
        <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.28} mobOpacity={0.4} flare />
        <div className="wrap">
          <div className="kr8-grid-2" style={{ alignItems: 'start', gap: 32 }}>
            <div>
              <div className="eyebrow">{editableContent.texts.text_12ff3ffa08}</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                {editableContent.texts.text_354174b916}<span className="text-grad">{editableContent.texts.text_bc7e1aab45}</span>
              </h2>
              <ResponsiveCopy
                as="p"
                className="prose-lg"
                desktop={editableContent.texts.field_2b5f32c671}
                mobile={editableContent.texts.field_812d2d4d6f}
              />

              <div className="kr8-card" style={{ marginTop: 22, padding: '20px 22px' }}>
                <div className="kr8-card__num">{editableContent.texts.text_be5222812f}</div>
                <p className="kr8-card__body" style={{ marginTop: 4 }}>
                  {editableContent.texts.text_d9d3808a8d}{' '}
                  <Link href={editableContent.texts.field_e97169a86c} style={{ color: 'var(--t-accent-soft)', fontWeight: 600 }}>
                    {editableContent.texts.text_d0c4037c00}</Link>
                </p>
              </div>
            </div>

            <div className="panel" style={{ padding: 'clamp(18px, 3vw, 36px)' }}>
              <LeadForm variant="mindshift" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

type EditableBlockTypes = { THEMES: typeof THEMES };
