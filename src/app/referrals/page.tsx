import Link from 'next/link';
import type { Metadata } from 'next';
import site from '../../../data/site.json';
import { getSettings } from '@/lib/settings';
import ReferralCalc from '@/components/ReferralCalc';
import ReferralSignup from '@/components/ReferralSignup';
import { Icon } from '@/components/ui';
import {
  CinemaVisual,
  MobileDisclosure,
  ResponsiveCopy,
  SectionAtmosphere,
} from '@/components/MobileExperience';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Referral Program — Introduce a Client, Earn Commission | KR8 DIGITALS',
  description:
    'Introduce an organisation to KR8 DIGITALS for Website Design, Branding, Graphic Design, Video Editing, SEO, or AI Automation — and earn transparent commission when the invoice is paid.',
  alternates: { canonical: '/referrals' },
};

export default async function ReferralsPage() {
  const settings = await getSettings();
  const r = settings.referralRates;
  const ex = site.referrals.workedExample;

  return (
    <>
      {/* ============================================================ HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name="referrals-network-cinema" deskOpacity={0.2} mobOpacity={0.34} flare />
        <div className="wrap">
          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill kr8-pill--green">
                <i className="kr8-pill__dot" /> KR8 DIGITALS Referral Network
              </span>
              <h1 className="kr8-subhero__title">
                You may not build the code.{' '}
                <em>You know the decision-maker.</em>
              </h1>
              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={site.referrals.lede}
                mobile="Introduce a school, clinic, hotel, retailer, or founder to KR8 DIGITALS and earn 8%–12% commission once their project invoice clears."
              />
              <div className="kr8-subhero__actions">
                <a href="#signup" className="btn-primary">
                  Generate Your Referral Link <Icon name="arrow" size={17} />
                </a>
                <Link href="/referrals/dashboard" className="btn-ghost">
                  Open Referrer Ledger
                </Link>
              </div>
            </div>

            <div className="kr8-card kr8-card--accent" style={{ padding: 'clamp(20px, 2.8vw, 34px)' }}>
              <div className="kr8-card-photo" style={{ marginBottom: 16 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/cinema/referrals-network-cinema-desk.webp"
                  alt="KR8 DIGITALS Referral Network partner connecting a decision-maker from smartphone"
                />
                <span className="kr8-card-photo__tag">Open to Everyone · $0 Fee</span>
              </div>
              <div className="kr8-card__num">WORKED COMMISSION EXAMPLE</div>
              <h2 className="kr8-card__title" style={{ fontSize: 22 }}>
                {ex.project}
              </h2>
              <p className="kr8-card__body">
                When you refer a client whose confirmed website scope closes at{' '}
                <strong>${ex.projectUsd.toLocaleString('en-US')}</strong>, your{' '}
                <strong>{r.website}%</strong> commission credits{' '}
                <strong style={{ color: 'var(--t-accent-soft)' }}>
                  ${Math.round((ex.projectUsd * r.website) / 100).toLocaleString('en-US')}
                </strong>{' '}
                (paid in NGN at settlement) directly to your ledger once the invoice clears.
              </p>
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 14,
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: 8,
                }}
              >
                <div>
                  <div style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 800, color: 'var(--t-strong)' }}>{r.website}%</div>
                  <div style={{ fontSize: 11.5, color: 'var(--t-sub)' }}>Websites &amp; AI</div>
                </div>
                <div>
                  <div style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 800, color: 'var(--t-strong)' }}>{r.design}%</div>
                  <div style={{ fontSize: 11.5, color: 'var(--t-sub)' }}>Brand, Design &amp; Film</div>
                </div>
                <div>
                  <div style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 800, color: 'var(--t-accent-soft)' }}>{r.bonus}%</div>
                  <div style={{ fontSize: 11.5, color: 'var(--t-sub)' }}>
                    After {r.bonusAfterPaidReferrals} Deals
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================== HOW IT WORKS + CALCULATOR */}
      <section className="section">
        <div className="wrap">
          <div className="kr8-grid-3" style={{ marginBottom: 28 }}>
            {[
              {
                n: '01',
                t: 'Create Your Unique Link',
                img: '/img/referrals/referral-ledger-desk.webp',
                alt: 'KR8 DIGITALS commission earnings ledger and referral link portal on laptop and smartphone',
                tag: '30-Second Setup',
                d: 'Register in thirty seconds below — no fee, no paperwork. Receive your personal tracking URL and private dashboard token.',
                m: 'Register free in 30 seconds and get your personal tracking URL + private ledger key.',
              },
              {
                n: '02',
                t: 'Share With Decision-Makers',
                img: '/img/referrals/referral-lounge-share.webp',
                alt: 'Sharing a warm business introduction to KR8 DIGITALS',
                tag: '60-Day Attribution',
                d: 'Introduce a school, hotel, clinic, retailer, or founder who needs a website, brand identity, campaign design, video edit, SEO, or AI system.',
                m: 'Share your link with any business, school, clinic, or founder hiring digital work.',
              },
              {
                n: '03',
                t: 'Get Paid When They Pay',
                img: '/img/referrals/referral-payout-celebrate.webp',
                alt: 'Referrer celebrating a paid client invoice commission notification',
                tag: '8% – 12% Commission',
                d: 'Every inquiry using your link attributes automatically for 60 days. Once the client invoice clears, request bank payout straight from your ledger.',
                m: 'Tracked automatically for 60 days. Withdraw straight to your bank once their invoice clears.',
              },
            ].map((s) => (
              <article className="kr8-card reveal up" key={s.n}>
                <div className="kr8-card-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.alt} loading="lazy" />
                  <span className="kr8-card-photo__tag">{s.tag}</span>
                </div>
                <div className="kr8-card__num">STEP {s.n}</div>
                <h3 className="kr8-card__title">{s.t}</h3>
                <ResponsiveCopy as="p" className="kr8-card__body" desktop={s.d} mobile={s.m} />
              </article>
            ))}
          </div>

          <ReferralCalc />
        </div>
      </section>

      {/* ===================================== SIGNUP + CLEAR RULES */}
      <section
        className="section"
        id="signup"
        style={{ borderTop: '1px solid var(--hair-soft)', scrollMarginTop: 92 }}
      >
        <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.28} mobOpacity={0.4} flare />
        <div className="wrap">
          <div className="kr8-grid-2" style={{ alignItems: 'start', gap: 32 }}>
            <div>
              <div className="eyebrow">Transparent Program Rules</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                Get your personal link <span className="text-grad">in 30 seconds.</span>
              </h2>

              <div className="kr8-desk-only">
                <ul className="kr8-check-list" style={{ marginTop: 20 }}>
                  {site.referrals.terms.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className="kr8-mob-only" style={{ marginTop: 12 }}>
                <p className="kr8-card__body">
                  10% on Websites/AI · 8% on Brand/Design/Film/SEO · 12% loyalty bonus after 3 paid deals · $20 minimum payout.
                </p>
                <MobileDisclosure label="Read full referral terms & payout rules">
                  <ul className="kr8-check-list">
                    {site.referrals.terms.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </MobileDisclosure>
              </div>

              <p style={{ marginTop: 18 }}>
                <Link href="/referrals/dashboard" className="btn-link">
                  Already registered? Open your Referrer Ledger <Icon name="arrow" size={14} />
                </Link>
              </p>
            </div>

            <ReferralSignup />
          </div>
        </div>
      </section>
    </>
  );
}
