import Link from 'next/link';
import type { Metadata } from 'next';
import site from '../../../data/site.json';
import PageHero from '@/components/PageHero';
import Duo from '@/components/Duo';
import ReferralSignup from '@/components/ReferralSignup';
import ReferralCalc from '@/components/ReferralCalc';
import { Icon } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Referrals — get paid for the introductions you already make',
  description:
    'Introduce a business to KR8 Digitals and earn 10% on websites, 8% on creative work, 10% on small jobs, rising to 12% after three paid referrals. Real ledger, real payouts.',
  alternates: { canonical: '/referrals' },
};

const S = site.settings.referralRates;

export default function ReferralsPage() {
  const rows = [
    { what: 'Websites and builds', rate: S.website, note: 'Anything scoped as a site, web app or rebuild.' },
    { what: 'Design, video and search', rate: S.design, note: 'Creative retainers and one-off production.' },
    { what: 'Small jobs', rate: S.small, note: `Minimum $${S.smallMinimumUsd} per paid job, however small the job.` },
    { what: 'Bonus after three paid referrals', rate: S.bonus, note: 'Applies to every referral from the fourth onwards.' },
  ];

  return (
    <>
      <PageHero
        eyebrow="Referrals"
        title={<>You may not have the skill.<br /><span className="text-grad">You have the people.</span></>}
        lede={site.referrals.lede}
       
        aside={
          <div>
            <figure style={{ margin: 0 }}>
              <div className="duo__frame" style={{ aspectRatio: '4 / 3' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/sites/vegas-card.webp" alt="A live site KR8 Digitals built — the kind of work a referral brings in" />
              </div>
              <figcaption style={{ marginTop: 10, fontSize: 11.5, color: 'var(--t-faint)' }}>
                A referral is usually a business with a site like this one to fix.
              </figcaption>
            </figure>
            <div className="panel" style={{ marginTop: 14, padding: 22 }}>
              <div className="tag" style={{ color: 'var(--magenta)' }}>Open to everyone</div>
              <p style={{ fontSize: 13.5, color: 'var(--t-body)', marginTop: 10, lineHeight: 1.6 }}>
                Students, drivers, teachers, ex-clients, strangers. No follower count, no application review,
                no fee.
              </p>
              <a href="#join" className="btn-primary btn-sm" style={{ marginTop: 14 }}>Create my link <Icon name="arrow" size={15} /></a>
            </div>
          </div>
        }
      />

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="wrap">
          <div className="split" style={{ alignItems: 'start', gap: 56 }}>
            <div className="reveal up">
              <div className="eyebrow">How it works</div>
              <h2 className="section-title" style={{ fontSize: 40 }}>Three steps, no fine print beyond the four terms below</h2>
              <div className="steps" style={{ marginTop: 40 }}>
                {[
                  { n: '01', t: 'Create the account', d: 'Name and email. You get a personal link immediately — no approval queue.' },
                  { n: '02', t: 'Introduce someone', d: 'Send them your link. When they enquire or request a quote, the introduction is attached to you, permanently.' },
                  { n: '03', t: 'Get paid when they pay', d: 'Commission is credited the moment the client settles their invoice, and paid out by bank transfer.' },
                ].map((s) => (
                  <div className="step" key={s.n}>
                    <div className="step-num">{s.n}</div>
                    <div className="step-title">{s.t}</div>
                    <p>{s.d}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal up" data-delay="60"><ReferralCalc /></div>
          </div>
        </div>
      </section>

      <section className="section section--tight" style={{ borderTop: '1px solid var(--hair-soft)', borderBottom: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="reveal up" style={{ maxWidth: 700 }}>
            <div className="eyebrow">The rates</div>
            <h2 className="section-title">Published, not negotiated</h2>
            <p className="section-lede">
              The same table applies to everybody. There is no tier you have to unlock by begging, and no
              rate that quietly drops when the invoice is large.
            </p>
          </div>
          <div className="tbl-wrap reveal up" style={{ marginTop: 36 }}>
            <table className="tbl">
              <thead><tr><th>What was bought</th><th className="num">Commission</th><th>Note</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.what}>
                    <td><b>{r.what}</b></td>
                    <td className="num"><b style={{ fontSize: 16 }}>{r.rate}%</b></td>
                    <td style={{ color: 'var(--t-muted)' }}>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 16, fontSize: 12.5, color: 'var(--t-faint)' }}>
            Worked example: a {site.referrals.workedExample.project.toLowerCase()} at $
            {site.referrals.workedExample.projectUsd.toLocaleString('en-US')} pays $
            {site.referrals.workedExample.commissionUsd} at {site.referrals.workedExample.ratePct}%.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="split" style={{ alignItems: 'start', gap: 56 }}>
            <div className="reveal up">
              <div className="eyebrow">The four terms</div>
              <h2 className="section-title" style={{ fontSize: 36 }}>The whole agreement</h2>
              <ol className="price-list" style={{ marginTop: 24 }}>
                {site.referrals.terms.map((t) => <li key={t} style={{ alignItems: 'flex-start' }}><Icon name="check" size={16} /> <span>{t}</span></li>)}
              </ol>
              <div className="meta-row" style={{ marginTop: 28 }}>
                <span><b>Minimum withdrawal</b> ${S.minimumWithdrawalUsd}</span>
                <span><b>Payout</b> bank transfer, manual, verified</span>
                <span><b>Ledger</b> visible in your dashboard</span>
              </div>
              <p style={{ marginTop: 22, fontSize: 13.5, color: 'var(--t-muted)' }}>
                Already signed up? <Link href="/referrals/dashboard" style={{ color: 'var(--magenta)', fontWeight: 600 }}>Open your dashboard</Link>.
              </p>
            </div>
            <div className="reveal up" data-delay="60"><ReferralSignup /></div>
          </div>
        </div>
      </section>

      <Duo
        eyebrow="Who to introduce"
        title="The person whose website you would be embarrassed to share."
        body={
          <>
            <p>
              Every referral we have paid came from somebody noticing the same thing you notice: a good
              business being let down by the thing that represents it online. You do not need to sell
              anything. You need one sentence and a link.
            </p>
            <p>
              And you do not need the skill. That is the entire point of this page.
            </p>
          </>
        }
        media={[
          { src: '/img/sites/tastia-card.webp', alt: 'A restaurant site built by KR8 Digitals', caption: 'The kind of work a referral pays for' },
          { src: '/img/sites/rapha-card.webp', alt: 'A hospital site built by KR8 Digitals' },
        ]}
        cta={{ label: 'See what we build', href: '/services' }}
        secondary={{ label: 'Open the referral dashboard', href: '/referrals/dashboard' }}
        flip
      />

      <section className="section section--tight">
        <div className="wrap">
          <div className="panel reveal up" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: 22 }}>Not sure who to introduce?</h3>
              <p style={{ marginTop: 8, maxWidth: 560 }}>
                Start with the person whose website you would be embarrassed to share. That is almost always
                a paying client waiting for someone to say it out loud.
              </p>
            </div>
            <Link href="/services" className="btn-ghost">See what we build</Link>
          </div>
        </div>
      </section>
    </>
  );
}
