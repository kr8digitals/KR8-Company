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

export const metadata: Metadata = {
  title: 'Join the Team — Studio Talent Pathway | KR8 DIGITALS',
  description:
    'Apply to join the KR8 DIGITALS studio delivery team across web engineering, brand & graphic design, video post-production, SEO, and AI automation.',
  alternates: { canonical: '/about/join-the-team' },
};

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

export default function JoinTheTeamPage() {
  return (
    <>
      {/* ============================================================ HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name="join-team-builders" deskOpacity={0.2} mobOpacity={0.34} flare />
        <div className="wrap">
          <nav className="kr8-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/about">About</Link>
            <span>/</span>
            <span style={{ color: 'var(--t-strong)' }}>Join the Team</span>
          </nav>

          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill kr8-pill--amber">
                <i className="kr8-pill__dot" /> Rolling Talent Review · $0 Application Fee
              </span>
              <h1 className="kr8-subhero__title">
                Show us what you build.{' '}
                <em>Ship real work with us.</em>
              </h1>
              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={
                  <>
                    <strong>KR8 DIGITALS</strong> grows from proven craft rather than paper credentials. Whether you
                    sharpened your skill inside <strong>KR8 Academy</strong> or built an independent body of work,
                    exceptional builders are invited to submit portfolios for our studio delivery roster.
                  </>
                }
                mobile={
                  <>
                    <strong>KR8 DIGITALS</strong> hires by proven craft — zero application fee ($0). Academy alumni
                    and independent engineers, designers, and editors can submit work below.
                  </>
                }
              />
              <div className="kr8-subhero__actions">
                <a href="#apply" className="btn-primary">
                  Submit Your Portfolio <Icon name="arrow" size={17} />
                </a>
                <Link href="/programs#free-training" className="btn-ghost">
                  Still Learning? Train Free First
                </Link>
              </div>
            </div>

            <CinemaVisual
              name="join-team-builders"
              alt="Designers, developers, and video editors collaborating inside KR8 DIGITALS"
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
              <div className="eyebrow">Disciplines We Review</div>
              <h2 className="section-title">
                Where builders plug into <span className="text-grad">KR8 DIGITALS.</span>
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
                <div className="kr8-card__num">STAGE {st.n}</div>
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
              <div className="eyebrow">Talent Application</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                Send us two or three pieces <span className="text-grad">you are proud of.</span>
              </h2>
              <ResponsiveCopy
                as="p"
                className="prose-lg"
                desktop="Include links to live websites, GitHub repositories, Figma/Behance boards, Google Drive reels, or published client work. Every submission routes directly into our studio talent inbox and is reviewed by the discipline lead."
                mobile="Share links to live websites, GitHub repos, Figma/Behance boards, or video reels — reviewed directly by our founding craft leads."
              />

              <div className="kr8-card" style={{ marginTop: 22, padding: '20px 22px' }}>
                <div className="kr8-card__num">LEADERSHIP REVIEWING YOUR CRAFT</div>
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
