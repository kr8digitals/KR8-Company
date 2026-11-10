import { getEditableDocument } from '@/lib/editable-content';
import { getPublicContent } from '@/lib/public-content';
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

export async function generateMetadata(): Promise<Metadata> {
  return (await getEditableDocument("app:referrals:page")).blocks.metadata as Metadata;
}

export default async function ReferralsPage() {
  const editableContent = await getEditableDocument("app:referrals:page");

  const publicData = await getPublicContent();
  const site = publicData.site;

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
                <i className="kr8-pill__dot" /> {editableContent.texts.text_8290f4eb2b}</span>
              <h1 className="kr8-subhero__title">
                {editableContent.texts.text_7b9839e90b}{' '}
                <em>{editableContent.texts.text_7a62989119}</em>
              </h1>
              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={site.referrals.lede}
                mobile={editableContent.texts.field_0f493a4eca}
              />
              <div className="kr8-subhero__actions">
                <a href={editableContent.texts.field_1cb17dd17e} className="btn-primary">
                  {editableContent.texts.text_3e1438e80c}<Icon name="arrow" size={17} />
                </a>
                <Link href={editableContent.texts.field_ca3bd633b6} className="btn-ghost">
                  {editableContent.texts.text_1f7542748b}</Link>
              </div>
            </div>

            <div className="kr8-card kr8-card--accent" style={{ padding: 'clamp(20px, 2.8vw, 34px)' }}>
              <div className="kr8-card-photo" style={{ marginBottom: 16 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editableContent.texts.field_a0c40a426c}
                  alt={editableContent.texts.field_9c549b5607}
                />
                <span className="kr8-card-photo__tag">{editableContent.texts.text_72762eb15d}</span>
              </div>
              <div className="kr8-card__num">{editableContent.texts.text_ef26d616af}</div>
              <h2 className="kr8-card__title" style={{ fontSize: 22 }}>
                {ex.project}
              </h2>
              <p className="kr8-card__body">
                {editableContent.texts.text_dcc035b32e}{' '}
                <strong>${ex.projectUsd.toLocaleString('en-US')}</strong>{editableContent.texts.text_c1aa3908a4}{' '}
                <strong>{r.website}%</strong> {editableContent.texts.text_510e9d5ee7}{' '}
                <strong style={{ color: 'var(--t-accent-soft)' }}>
                  ${Math.round((ex.projectUsd * r.website) / 100).toLocaleString('en-US')}
                </strong>{' '}
                {editableContent.texts.text_b5bf0e2570}</p>
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
                  <div style={{ fontSize: 11.5, color: 'var(--t-sub)' }}>{editableContent.texts.text_98064a0414}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 800, color: 'var(--t-strong)' }}>{r.design}%</div>
                  <div style={{ fontSize: 11.5, color: 'var(--t-sub)' }}>{editableContent.texts.text_fd51565eb8}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 800, color: 'var(--t-accent-soft)' }}>{r.bonus}%</div>
                  <div style={{ fontSize: 11.5, color: 'var(--t-sub)' }}>
                    {editableContent.texts.text_3029db7d50}{r.bonusAfterPaidReferrals} {editableContent.texts.text_145603eb8a}</div>
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
                <div className="kr8-card__num">{editableContent.texts.text_94bccdb1d5}{s.n}</div>
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
              <div className="eyebrow">{editableContent.texts.text_2a49527316}</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                {editableContent.texts.text_6a4cc3d516}<span className="text-grad">{editableContent.texts.text_d8452b6751}</span>
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
                  {editableContent.texts.text_0e8e9a5dcf}</p>
                <MobileDisclosure label="Read full referral terms & payout rules">
                  <ul className="kr8-check-list">
                    {site.referrals.terms.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </MobileDisclosure>
              </div>

              <p style={{ marginTop: 18 }}>
                <Link href={editableContent.texts.field_ca3bd633b6} className="btn-link">
                  {editableContent.texts.text_b6086ea7e7}<Icon name="arrow" size={14} />
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
