import Link from 'next/link';
import type { Metadata } from 'next';
import LeadForm from '@/components/LeadForm';
import { Icon } from '@/components/ui';
import {
  CinemaVisual,
  ResponsiveCopy,
  SectionAtmosphere,
} from '@/components/MobileExperience';

export const metadata: Metadata = {
  title: 'KR8 DIGITALS TRIBE — The Creative & Builder Community',
  description:
    'KR8 DIGITALS TRIBE is the judgment-free creative family where designers, developers, video editors, and founders critique work, team up on sprints, and grow together.',
  alternates: { canonical: '/tribe' },
};

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

export default function TribePage() {
  return (
    <>
      {/* ============================================================ HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name="tribe-creative-room" deskOpacity={0.2} mobOpacity={0.34} flare />
        <div className="wrap">
          <nav className="kr8-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/programs">Programs</Link>
            <span>/</span>
            <span style={{ color: 'var(--t-strong)' }}>KR8 DIGITALS TRIBE</span>
          </nav>

          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill kr8-pill--green">
                <i className="kr8-pill__dot" /> KR8 DIGITALS TRIBE · Active Builder Community
              </span>
              <h1 className="kr8-subhero__title">
                No builder grows to mastery{' '}
                <em>in isolation.</em>
              </h1>
              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={
                  <>
                    <strong>KR8 DIGITALS TRIBE</strong> is the creative family keeping the studio room open for KR8
                    Academy alumni and disciplined African designers, developers, video editors, and founders — built
                    around honest critique, collaborative sprints, and shared momentum.
                  </>
                }
                mobile={
                  <>
                    Join <strong>3,000+</strong> African designers, developers, video editors, and founders for
                    honest critique, sprint collaborations, and shared gig flow — 100% free.
                  </>
                }
              />
              <div className="kr8-subhero__actions">
                <a href="#join-tribe" className="btn-primary">
                  Request Tribe Access <Icon name="arrow" size={17} />
                </a>
                <a
                  href="https://academy.kr8digitals.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  Start With KR8 Academy <Icon name="external" size={15} />
                </a>
              </div>
            </div>

            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/programs/tribe-community.webp"
                alt="Designers, developers, and editors collaborating inside KR8 DIGITALS TRIBE"
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>100% Free Community · 3,000+ Members</span>
                  <strong>Critique · Sprints · Accountability</strong>
                </div>
                <a href="#join-tribe" className="btn-link" style={{ whiteSpace: 'nowrap' }}>
                  Join List <Icon name="arrow" size={13} />
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
              <div className="eyebrow">How the Room Works</div>
              <h2 className="section-title">
                Four pillars of <span className="text-grad">KR8 DIGITALS TRIBE.</span>
              </h2>
            </div>
          </div>

          <div className="kr8-mob-only" style={{ marginTop: 16 }}>
            <CinemaVisual
              name="tribe-creative-room"
              alt="Designers, developers, and editors reviewing live creative work inside KR8 DIGITALS TRIBE"
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
              <div className="eyebrow">Join the Community</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                Step into the room with builders <span className="text-grad">who take craft seriously.</span>
              </h2>
              <ResponsiveCopy
                as="p"
                className="prose-lg"
                desktop="Whether you graduated from a KR8 Academy cohort or have been sharpening your design, code, or editing skills independently, register below to receive your onboarding invitation into KR8 DIGITALS TRIBE."
                mobile="Academy alumni and self-taught designers, developers, and editors are welcome. Register below for your free onboarding invite."
              />

              <ul className="kr8-check-list" style={{ marginTop: 18 }}>
                <li>Zero membership fees — earned through active participation and respect for craft</li>
                <li>Open across Web Development, Brand/Graphic Design, Video Editing, Content &amp; Marketing</li>
                <li>Direct pathway to Mindset Shift sessions and studio talent consideration</li>
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
