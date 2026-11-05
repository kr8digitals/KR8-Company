import Link from 'next/link';
import type { Metadata } from 'next';
import partners from '../../../data/partners.json';
import PageHero, { ClosingCTA } from '@/components/PageHero';
import { Icon } from '@/components/ui';
import Duo from '@/components/Duo';
import WaysToPartner from '@/components/WaysToPartner';

export const metadata: Metadata = {
  title: 'Partners — we do not build alone',
  description:
    'Motionverse and CHIGOMA are two separate brands, both partners of KR8 Digitals. Next Gen Scholars runs the academic door. Four ways to partner: teach, fund, hire or host.',
  alternates: { canonical: '/partners' },
};

export default function Partners() {
  const coFounders = partners.filter((p) => p.group === 'co-founder');
  const rest = partners.filter((p) => p.group !== 'co-founder');

  return (
    <>
      <PageHero
        eyebrow="Partners"
        title={<>We do not<br /><span className="text-grad">build alone.</span></>}
        lede="Every partner on this page is named, their contribution is stated, and the record of it exists in the work. Every line on it is a record of people who did something specific."
        aside={
          <div className="grid" style={{ gap: 12 }}>
            {coFounders.map((p) => (
              <div className="logo-slot" key={p.slug}>
                <span className="logo-slot__mark">{p.mark}</span>
                <b>{p.name}</b>
                <small>Co-founder</small>
              </div>
            ))}
            {rest.map((p) => (
              <div className="logo-slot" key={p.slug}>
                <span className="logo-slot__mark">{p.mark}</span>
                <b>{p.name}</b>
                <small>{p.role}</small>
              </div>
            ))}
          </div>
        }
      />

      {/* ------------------------------------------------------------- RECORD */}
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <div className="reveal up" style={{ maxWidth: 880 }}>
            <div className="eyebrow">How a partnership is recorded here</div>
            <p className="prose-lg" style={{ marginTop: 14 }}>
              A partner is a named person with a stated contribution and a record you can check. Not a logo.
              Motionverse and CHIGOMA are two separate brands and both are partners here. Next Gen Scholars
              runs the academic door. If a partner&rsquo;s contribution is not documented
              yet, this page says so instead of inventing one.
            </p>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- CO-FOUNDERS */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Partners</div>
              <h2 className="section-title">Motionverse and CHIGOMA</h2>
              <p className="section-lede">
                Two different brands partnering with KR8 Digitals — one for design, one for video. Each is
                credited on its own work and each teaches its own craft inside the free training.
              </p>
            </div>
          </div>

          <div className="grid g2 grid--loose" style={{ marginTop: 40 }}>
            {coFounders.map((p) => (
              <article className="gal-card" key={p.slug}>
                <div className="gal-card__shot" style={{ display: 'grid', placeItems: 'center', background: 'radial-gradient(120% 120% at 20% 0%, rgba(255,45,155,.18), transparent 60%), #140b29' }}>
                  <span className="logo-slot__mark" style={{ fontSize: 46 }}>{p.mark}</span>
                </div>
                <div className="gal-card__body">
                  <div className="gal-card__top">
                    <span className="pill">{p.type}</span>
                    <span className="tag">{p.teaches || p.role}</span>
                  </div>
                  <h3 style={{ fontSize: 22 }}>{p.name}</h3>
                  <div style={{ fontSize: 12.5, color: 'var(--lilac)', letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600 }}>{p.person}</div>
                  <p style={{ marginTop: 6 }}>{p.blurb}</p>
                  <div className="gal-card__credit">Record: {p.record}</div>
                  <div className="gal-card__foot">
                    <Link href={p.href} className="btn-link">Read the chapter <Icon name="arrow" size={14} /></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="notice notice--neutral reveal up" style={{ marginTop: 22 }}>
            <b>Logo files pending.</b> The slots above hold the mark until the partner supplies artwork — the
            page does not fake a logo it does not have.
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ OTHER PARTNERS */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Other partners</div>
              <h2 className="section-title">Next, and next.</h2>
              <p className="section-lede">
                Named people, stated contributions. Where the contribution has not been documented, the card
                says so.
              </p>
            </div>
            <Link href="/contact?partner=1" className="btn-link">Become a partner <Icon name="arrow" size={15} /></Link>
          </div>

          <div className="gal__grid gal__grid--brand" style={{ marginTop: 40 }}>
            {rest.map((p) => (
              <article className="gal-card" key={p.slug}>
                <div className="gal-card__shot" style={{ display: 'grid', placeItems: 'center', background: '#140b29' }}>
                  <span className="logo-slot__mark" style={{ fontSize: 30 }}>{p.mark}</span>
                </div>
                <div className="gal-card__body">
                  <div className="gal-card__top"><span className="tag">{p.role}</span></div>
                  <h3>{p.name}</h3>
                  <p>{p.blurb}</p>
                  <div className="gal-card__foot">
                    <Link href={p.href} className="btn-link">Read more <Icon name="arrow" size={14} /></Link>
                  </div>
                </div>
              </article>
            ))}
            <div className="logo-slot" style={{ minHeight: 240 }}>
              <span className="logo-slot__mark">+</span>
              <b>Your name here</b>
              <small>Four ways in below</small>
            </div>
            <div className="logo-slot" style={{ minHeight: 240, borderStyle: 'dotted' }}>
              <span className="logo-slot__mark">?</span>
              <b>More to be documented</b>
              <small>Partners awaiting a written chapter</small>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- WAYS */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }} id="ways">
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Four ways to partner</div>
              <h2 className="section-title">Teach, fund, hire or host.</h2>
              <p className="section-lede">
                Pick the one that is actually you. Each comes with a specific list of what you would give and
                what we would do with it.
              </p>
            </div>
          </div>
          <div style={{ marginTop: 40 }}>
            <WaysToPartner />
          </div>
        </div>
      </section>

      <Duo
        eyebrow="Tell us what you can bring"
        title="Partnership starts with a sentence, not a deck."
        body={
          <>
            <p>
              Tell us what you have — a craft, a budget, a room, a vacancy — and what you would want out of it.
              We will tell you honestly whether it is useful, and if it is, who will own it.
            </p>
            <p>
              Partners who teach are held to the same standard as the work: if the students cannot do the thing
              at the end, the partnership is not working.
            </p>
          </>
        }
        media={[
          { src: '/img/brand/presco-trip-full.webp', alt: 'Event artwork made in association with Motionverse', caption: 'Event work · Motionverse' },
          { src: '/img/sites/prime-stem-full.webp', alt: 'Prime STEM Nigeria — a partner programme site' },
        ]}
        cta={{ label: 'Tell us what you can bring', href: '/contact?partner=1' }}
        secondary={{ label: 'See all programmes', href: '/programs' }}
        flip
      />

      <ClosingCTA
        title="We do not build alone."
        copy="One form, one reply. If you would rather talk, WhatsApp is on the right."
        cta="Talk to us"
        secondary={{ label: 'Read the referral terms', href: '/referrals' }}
      />
    </>
  );
}
