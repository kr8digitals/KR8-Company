import { getEditableDocument } from '@/lib/editable-content';
import { getPublicContent } from '@/lib/public-content';
import Link from 'next/link';
import type { Metadata } from 'next';
import LeadForm from '@/components/LeadForm';
import { Icon } from '@/components/ui';
import team from '../../../../data/team.json';
import {
  CinemaVisual,
  ResponsiveCopy,
  SectionAtmosphere,
} from '@/components/MobileExperience';

export async function generateMetadata(): Promise<Metadata> {
  return (await getEditableDocument("app:about:join-the-team:page")).blocks.metadata as Metadata;
}

const DISCIPLINES = [
  {
    num: 'TRACK 01 · ENGINEERING & AI',
    title: 'Web Developers & AI Workflow Builders',
    desc: 'Full-stack Next.js/React engineers, UI craftsmen, and applied AI builders who care deeply about mobile performance, accessibility, and clean architecture.',
    mobileDesc: 'Next.js/React engineers, mobile UI specialists, and applied AI workflow builders.',
  },
  {
    num: 'TRACK 02 · BRAND & GRAPHIC DESIGN',
    title: 'Brand Identity & Campaign Designers',
    desc: 'Designers with sharp typographic instinct, composition discipline, and commercial clarity — collaborating alongside Steveoking and Motionverse.',
    mobileDesc: 'Identity & campaign designers collaborating directly with Steveoking and Motionverse.',
  },
  {
    num: 'TRACK 03 · VIDEO POST-PRODUCTION',
    title: 'Narrative & Commercial Video Editors',
    desc: 'Editors who understand retention hooks, sound design, dialogue clarity, and color grading — collaborating alongside Creative Expression and Chigoma.',
    mobileDesc: 'Retention-focused commercial & documentary editors collaborating with Creative Expression and Chigoma.',
  },
  {
    num: 'TRACK 04 · SEARCH & OPERATIONS',
    title: 'SEO Specialists & Project Coordinators',
    desc: 'Technical SEO practitioners, content strategists, and organized project operators who keep scopes moving smoothly on schedule.',
    mobileDesc: 'Technical SEO practitioners, content strategists, and disciplined project coordinators.',
  },
];

const EVALUATION_STEPS = [
  {
    n: '01',
    t: 'Portfolio & Work Review',
    d: 'Send links to real things you have built, designed, or cut — shipped work speaks louder than CVs.',
  },
  {
    n: '02',
    t: 'Craft Conversation',
    d: 'Walk our leads through how you made a piece, the constraints you faced, and what you would refine.',
  },
  {
    n: '03',
    t: 'Scoped Trial Collaboration',
    d: 'Collaborate on a bounded, real studio brief under senior review to test communication and quality.',
  },
  {
    n: '04',
    t: 'Studio Onboarding',
    d: 'Join active client deliveries and ecosystem projects as part of the KR8 DIGITALS delivery roster.',
  },
];

export default async function JoinTheTeamPage() {
  const editableContent = await getEditableDocument("app:about:join-the-team:page");
  const DISCIPLINES = editableContent.blocks.DISCIPLINES as EditableBlockTypes["DISCIPLINES"];
  const EVALUATION_STEPS = editableContent.blocks.EVALUATION_STEPS as EditableBlockTypes["EVALUATION_STEPS"];

  const publicData = await getPublicContent();
  const team = publicData.team;

  return (
    <>
      {/* ============================================================ HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name="join-team-builders" deskOpacity={0.2} mobOpacity={0.34} flare />
        <div className="wrap">
          <nav className="kr8-breadcrumb" aria-label={editableContent.texts.field_2bd873d6c7}>
            <Link href="/">{editableContent.texts.text_3a78695388}</Link>
            <span>/</span>
            <Link href={editableContent.texts.field_979bddc4a8}>{editableContent.texts.text_4efca0d10c}</Link>
            <span>/</span>
            <span style={{ color: 'var(--t-strong)' }}>{editableContent.texts.text_a24ec95fbf}</span>
          </nav>

          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill kr8-pill--amber">
                <i className="kr8-pill__dot" /> {editableContent.texts.text_913c1b2333}</span>
              <h1 className="kr8-subhero__title">
                {editableContent.texts.text_fcf6b28753}{' '}
                <em>{editableContent.texts.text_9812c37074}</em>
              </h1>
              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={
                  <>
                    <strong>{editableContent.texts.text_0bbfb207b2}</strong> {editableContent.texts.text_c6be933abc}<strong>{editableContent.texts.text_ca538eaf54}</strong> {editableContent.texts.text_a56e611a56}</>
                }
                mobile={
                  <>
                    <strong>{editableContent.texts.text_0bbfb207b2}</strong> {editableContent.texts.text_448f71d2b7}</>
                }
              />
              <div className="kr8-subhero__actions">
                <a href={editableContent.texts.field_b131d571c5} className="btn-primary">
                  {editableContent.texts.text_30fef3bdff}<Icon name="arrow" size={17} />
                </a>
                <Link href={editableContent.texts.field_70ea9c52a0} className="btn-ghost">
                  {editableContent.texts.text_bb7d9e25d8}</Link>
              </div>
            </div>

            <CinemaVisual
              name="join-team-builders"
              alt={editableContent.texts.field_f1d292931a}
              badge="Merit-Based Studio Pathway"
              caption="Engineering · Brand · Design · Film · SEO"
              aspect="16 / 10"
              mobileAspect="16 / 10"
            />
          </div>
        </div>
      </section>

      {/* ===================================== 4 CRAFT TRACKS */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{editableContent.texts.text_ee379e8df8}</div>
              <h2 className="section-title">
                {editableContent.texts.text_ae94534749}<span className="text-grad">{editableContent.texts.text_6dc5d75ad9}</span>
              </h2>
            </div>
          </div>

          <div className="kr8-grid-2" style={{ marginTop: 28 }}>
            {DISCIPLINES.map((d, idx) => (
              <article
                className={`kr8-card ${idx === 0 ? 'kr8-card--accent' : ''} reveal up`}
                key={d.num}
              >
                <div className="kr8-card__num">{d.num}</div>
                <h3 className="kr8-card__title">{d.title}</h3>
                <ResponsiveCopy
                  as="p"
                  className="kr8-card__body"
                  desktop={d.desc}
                  mobile={d.mobileDesc}
                />
              </article>
            ))}
          </div>

          <div className="kr8-grid-4" style={{ marginTop: 24 }}>
            {EVALUATION_STEPS.map((st) => (
              <div className="kr8-card reveal up" key={st.n} style={{ padding: '22px 24px' }}>
                <div className="kr8-card__num">{editableContent.texts.text_b0e57d2d9f}{st.n}</div>
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

      {/* ===================================== APPLICATION FORM */}
      <section
        className="section"
        id="apply"
        style={{ borderTop: '1px solid var(--hair-soft)', scrollMarginTop: 92 }}
      >
        <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.28} mobOpacity={0.4} flare />
        <div className="wrap">
          <div className="kr8-grid-2" style={{ alignItems: 'start', gap: 32 }}>
            <div>
              <div className="eyebrow">{editableContent.texts.text_d74da55156}</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                {editableContent.texts.text_663ee987e7}<span className="text-grad">{editableContent.texts.text_96505d4586}</span>
              </h2>
              <ResponsiveCopy
                as="p"
                className="prose-lg"
                desktop={editableContent.texts.field_a34fbea4a5}
                mobile={editableContent.texts.field_710d6d7b97}
              />

              <div className="kr8-card" style={{ marginTop: 22, padding: '20px 22px' }}>
                <div className="kr8-card__num">{editableContent.texts.text_c20434d850}</div>
                <ul className="kr8-check-list" style={{ marginTop: 8 }}>
                  {team.founders.map((f) => (
                    <li key={f.slug}>
                      <strong>{f.name}</strong> ({f.fullName}) — {f.role}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="panel" style={{ padding: 'clamp(18px, 3vw, 36px)' }}>
              <LeadForm
                variant="team"
                roles={[
                  'Website & Full-Stack Engineering',
                  'Branding & Visual Identity',
                  'Commercial Graphic Design',
                  'Video Editing & Motion',
                  'SEO & Content Strategy',
                  'AI Agents & Workflow Automation',
                  'Project Operations',
                ]}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

type EditableBlockTypes = { DISCIPLINES: typeof DISCIPLINES; EVALUATION_STEPS: typeof EVALUATION_STEPS };
