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
  return (await getEditableDocument("app:tribe:page")).blocks.metadata as Metadata;
}

const TRIBE_PILLARS = [
  {
    num: 'PILLAR 01 · CRITIQUE OVER CLOUT',
    title: 'Honest Work-in-Progress Reviews',
    body: 'Share wireframes, brand sketches, rough cuts, and staging URLs in a constructive room where senior practitioners point out how to elevate typography, pacing, and code before a client sees it.',
    mobileBody: 'Share wireframes, logos, rough cuts, and staging links for constructive senior feedback before client review.',
  },
  {
    num: 'PILLAR 02 · INTERDISCIPLINARY SPRINTS',
    title: 'Designers + Developers + Editors on One Brief',
    body: 'Great projects rarely belong to one skill alone. Inside the Tribe, web engineers team up with graphic designers and video editors to ship complete, portfolio-defining collaborations.',
    mobileBody: 'Web engineers, graphic designers, and video editors team up on real portfolio-defining sprint briefs.',
  },
  {
    num: 'PILLAR 03 · ACCOUNTABILITY & CONSISTENCY',
    title: 'Keep Momentum After the Cohort Ends',
    body: 'Most learners stall in isolation once classes finish. Structured challenges, consistency drills, and peer check-ins keep your output sharp month after month.',
    mobileBody: 'Structured creative challenges and peer check-ins keep your momentum sharp long after classes end.',
  },
  {
    num: 'PILLAR 04 · SHARED OPPORTUNITY FLOW',
    title: 'Client Referrals & Overflow Collaborations',
    body: 'When members outgrow their calendar or spot a brief outside their specialty, opportunities circulate inside a trusted circle of vetted builders.',
    mobileBody: 'Overflow gigs and cross-discipline referrals circulate directly inside our vetted 3,000+ builder circle.',
  },
];

export default async function TribePage() {
  const editableContent = await getEditableDocument("app:tribe:page");
  const TRIBE_PILLARS = editableContent.blocks.TRIBE_PILLARS as EditableBlockTypes["TRIBE_PILLARS"];

  return (
    <>
      {/* ============================================================ HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name="tribe-creative-room" deskOpacity={0.2} mobOpacity={0.34} flare />
        <div className="wrap">
          <nav className="kr8-breadcrumb" aria-label={editableContent.texts.field_2bd873d6c7}>
            <Link href="/">{editableContent.texts.text_3a78695388}</Link>
            <span>/</span>
            <Link href={editableContent.texts.field_271bdd2473}>{editableContent.texts.text_b6747064b2}</Link>
            <span>/</span>
            <span style={{ color: 'var(--t-strong)' }}>{editableContent.texts.text_5c09b75136}</span>
          </nav>

          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill kr8-pill--green">
                <i className="kr8-pill__dot" /> {editableContent.texts.text_fa97e8b2c9}</span>
              <h1 className="kr8-subhero__title">
                {editableContent.texts.text_87c8e303ca}{' '}
                <em>{editableContent.texts.text_7345b95ce2}</em>
              </h1>
              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={
                  <>
                    <strong>{editableContent.texts.text_5c09b75136}</strong> {editableContent.texts.text_d8e5e1ffdb}</>
                }
                mobile={
                  <>
                    {editableContent.texts.text_bb23428b65}<strong>3,000+</strong> {editableContent.texts.text_d3f013528b}</>
                }
              />
              <div className="kr8-subhero__actions">
                <a href={editableContent.texts.field_8262341aae} className="btn-primary">
                  {editableContent.texts.text_7db6e5513a}<Icon name="arrow" size={17} />
                </a>
                <a
                  href={editableContent.texts.field_fd6b7397b2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  {editableContent.texts.text_cedabd18c9}<Icon name="external" size={15} />
                </a>
              </div>
            </div>

            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={editableContent.texts.field_7c5e8e588a}
                alt={editableContent.texts.field_479e660c52}
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>{editableContent.texts.text_1a4e186fc9}</span>
                  <strong>{editableContent.texts.text_66e59bae7b}</strong>
                </div>
                <a href={editableContent.texts.field_8262341aae} className="btn-link" style={{ whiteSpace: 'nowrap' }}>
                  {editableContent.texts.text_f9a7f378c5}<Icon name="arrow" size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================== FOUR PILLARS */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{editableContent.texts.text_8ec006881b}</div>
              <h2 className="section-title">
                {editableContent.texts.text_09106d9c5a}<span className="text-grad">{editableContent.texts.text_f22ccae13a}</span>
              </h2>
            </div>
          </div>

          <div className="kr8-mob-only" style={{ marginTop: 16 }}>
            <CinemaVisual
              name="tribe-creative-room"
              alt={editableContent.texts.field_08185259cb}
              badge="3,000+ Active Creators"
              caption="Honest critique, weekly sprints, and shared opportunity flow."
              mobileAspect="16 / 9"
            />
          </div>

          <div className="kr8-grid-2" style={{ marginTop: 26 }}>
            {TRIBE_PILLARS.map((p, idx) => (
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
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================== JOIN FORM */}
      <section
        className="section"
        id="join-tribe"
        style={{ borderTop: '1px solid var(--hair-soft)', scrollMarginTop: 92 }}
      >
        <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.28} mobOpacity={0.4} flare />
        <div className="wrap">
          <div className="kr8-grid-2" style={{ alignItems: 'start', gap: 32 }}>
            <div>
              <div className="eyebrow">{editableContent.texts.text_050cedb55c}</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                {editableContent.texts.text_c8a5057bf1}<span className="text-grad">{editableContent.texts.text_696038739f}</span>
              </h2>
              <ResponsiveCopy
                as="p"
                className="prose-lg"
                desktop={editableContent.texts.field_9e2ffab333}
                mobile={editableContent.texts.field_56db656c74}
              />

              <ul className="kr8-check-list" style={{ marginTop: 18 }}>
                <li>{editableContent.texts.text_7271df4e6b}</li>
                <li>{editableContent.texts.text_947a0fa50a}</li>
                <li>{editableContent.texts.text_1110ebcade}</li>
              </ul>
            </div>

            <div className="panel" style={{ padding: 'clamp(18px, 3vw, 36px)' }}>
              <LeadForm variant="tribe" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

type EditableBlockTypes = { TRIBE_PILLARS: typeof TRIBE_PILLARS };
