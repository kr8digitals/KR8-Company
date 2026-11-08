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
  title: 'Mindset Shift — Leadership & Perspective Forum | KR8 DIGITALS',
  description:
    'Register interest for Mindset Shift by KR8 DIGITALS — candid practitioner conversations challenging limiting beliefs around career, craft, value creation, and leadership.',
  alternates: { canonical: '/programs/mindset-shift/invite' },
};

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

export default function MindsetShiftInvitePage() {
  return (
    <>
      {/* ============================================================ HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name="mindset-shift-stage" deskOpacity={0.2} mobOpacity={0.34} flare />
        <div className="wrap">
          <nav className="kr8-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/programs">Programs</Link>
            <span>/</span>
            <span style={{ color: 'var(--t-strong)' }}>Mindset Shift</span>
          </nav>

          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill kr8-pill--amber">
                <i className="kr8-pill__dot" /> Free Twice-Monthly Forum · 1st &amp; 3rd Sundays at 9PM
              </span>
              <h1 className="kr8-subhero__title">
                Mindset Shift:{' '}
                <em>rethinking what you believe is possible.</em>
              </h1>
              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={
                  <>
                    Skill is rarely the only barrier holding talented young people back. Convened by{' '}
                    <strong>Timfire</strong> and guest practitioners inside the <strong>KR8 DIGITALS</strong>{' '}
                    ecosystem, Mindset Shift brings builders, students, and founders together for candid conversations
                    on discipline, career architecture, and value creation.
                  </>
                }
                mobile={
                  <>
                    Hosted by <strong>Timfire</strong> and guest leaders on the <strong>1st &amp; 3rd Sundays at 9PM</strong> —
                    candid conversations on discipline, career longevity, and ethical wealth. Open to any profession.
                  </>
                }
              />
              <div className="kr8-subhero__actions">
                <a href="#register" className="btn-primary">
                  Join the Invitation List <Icon name="arrow" size={17} />
                </a>
                <Link href="/programs" className="btn-ghost">
                  All Ecosystem Programs
                </Link>
              </div>
            </div>

            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/programs/mindset-shift-forum.webp"
                alt="Mindset Shift leadership and career perspective forum hosted by KR8 DIGITALS"
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>Hosted by Timfire &amp; Guest Practitioners</span>
                  <strong>Leadership · Craft · Value Creation</strong>
                </div>
                <a href="#register" className="btn-link" style={{ whiteSpace: 'nowrap' }}>
                  Register <Icon name="arrow" size={13} />
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
              <div className="eyebrow">Inside the Room</div>
              <h2 className="section-title">
                Conversations built around <span className="text-grad">honest execution.</span>
              </h2>
            </div>
          </div>

          <div className="kr8-mob-only" style={{ marginTop: 16 }}>
            <CinemaVisual
              name="mindset-shift-stage"
              alt="Mindset Shift evening leadership stage with warm bokeh stage lighting"
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
              <div className="eyebrow">Direct Edition Notifications</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                Be first in the room when the <span className="text-grad">next edition is confirmed.</span>
              </h2>
              <ResponsiveCopy
                as="p"
                className="prose-lg"
                desktop="We publish Mindset Shift dates, guest speakers, and venue/livestream access details strictly once each edition is formally locked in. Register your email or WhatsApp below so your invitation arrives first."
                mobile="Register your email or WhatsApp below to receive speaker lineups and direct livestream access before each session."
              />

              <div className="kr8-card" style={{ marginTop: 22, padding: '20px 22px' }}>
                <div className="kr8-card__num">SPEAKERS &amp; SPONSORS</div>
                <p className="kr8-card__body" style={{ marginTop: 4 }}>
                  Want to co-sponsor an edition of Mindset Shift or propose an experienced practitioner speaker?{' '}
                  <Link href="/partners#propose" style={{ color: 'var(--t-accent-soft)', fontWeight: 600 }}>
                    Submit a Partnership Proposal →
                  </Link>
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
