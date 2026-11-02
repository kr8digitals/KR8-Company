import Link from 'next/link';
import type { Metadata } from 'next';
import site from '../../../data/site.json';
import partners from '../../../data/partners.json';
import PageHero, { ClosingCTA } from '@/components/PageHero';
import People from '@/components/People';
import { Icon } from '@/components/ui';

export const metadata: Metadata = {
  title: 'About — a creative institution, not an agency',
  description:
    'KR8 Digitals exists to remove the paywall between raw African talent and a paid creative career. The Academy teaches, the Tribe holds, Mindset Shift convenes, Services deliver, and Partners extend.',
  alternates: { canonical: '/about' },
};

const PRINCIPLES = [
  { t: 'Free at the point of entry', d: 'Training costs nothing, and nothing is charged to graduate. If we ever have to charge, it will be stated in public before it is charged — not after.' },
  { t: 'Taught by people who sell the work', d: 'Every track is led by a practitioner currently delivering client contracts. Not a facilitator reading a deck.' },
  { t: 'Proof over promises', d: 'We show live sites, real names and dated records. If a number cannot be verified, it does not go on the site.' },
  { t: 'One institution, not four brands', d: 'The Academy, the Tribe, Mindset Shift and the studio are one company with one standard. Nobody gets handed to a different business.' },
  { t: 'Community is the product', d: 'Isolation kills a craft. The Tribe exists so a young designer in Abakaliki has the same answers available as one in Lagos.' },
  { t: 'You own what you pay for', d: 'Source files, domains, accounts. Nothing we build for a client is held hostage behind us.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={<>Raw African talent is everywhere.<br /><span className="text-grad">Access is not.</span></>}
        lede={site.company.mission}
        crumbs={[{ label: 'About' }]}
      />

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="story">
            <div className="reveal up">
              <div className="eyebrow">Why we exist</div>
              <h2 className="section-title" style={{ fontSize: 40 }}>The gate was never talent. It was money.</h2>
            </div>
            <div className="prose-lg reveal up" data-delay="60">
              <p>
                Nigeria does not have a shortage of young people who can design, edit, code or sell. It has
                a shortage of places where they can learn it without paying a fee they will never recover,
                and without a laptop they do not own.
              </p>
              <p>
                The usual answer is a bootcamp with a deposit, or a YouTube playlist with nobody to answer
                a question. Both leave the same person behind — the one with the talent and the phone.
              </p>
              <p>
                <strong>KR8 Digitals was built to be the third option.</strong> A school that charges nothing.
                A community that answers. A studio that pays graduates to make real work for real clients.
                One company, so nobody is handed between four brands that do not talk to each other.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* the five doors ------------------------------------------------------ */}
      <section className="section section--tight" style={{ borderTop: '1px solid var(--hair-soft)', borderBottom: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="reveal up" style={{ maxWidth: 780 }}>
            <div className="eyebrow">How it is structured</div>
            <h2 className="section-title">One institution, five doors</h2>
            <p className="section-lede">
              {site.company.positioning}
            </p>
          </div>
          <div className="doors reveal up" style={{ marginTop: 44 }} data-delay="60">
            {site.doors.map((d) => (
              <Link key={d.verb} href={d.href} className="door">
                <span className="door__verb text-grad">{d.verb}</span>
                <span className="door__name">{d.name}</span>
                <span className="door__desc">{d.desc}</span>
                <span className="door__go">Open <Icon name="arrow" size={13} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* the numbers -------------------------------------------------------- */}
      <section className="section">
        <div className="wrap">
          <div className="split" style={{ alignItems: 'end' }}>
            <div className="reveal up">
              <div className="eyebrow">The record so far</div>
              <h2 className="section-title">What has actually happened</h2>
            </div>
            <p className="reveal up" style={{ fontSize: 13, color: 'var(--t-faint)', maxWidth: 340 }}>
              Every figure below comes from our own records or a public page you can open. We publish the
              source next to the number.
            </p>
          </div>
          <div className="proof-grid reveal up" style={{ marginTop: 40 }}>
            {site.stats.map((s) => (
              <div className="proof-cell" key={s.id}>
                <div className="proof-num text-grad">{s.value.toLocaleString('en-US')}{s.suffix}</div>
                <div className="proof-label">{s.label}</div>
                <div className="proof-src">{s.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* principles --------------------------------------------------------- */}
      <section className="section section--tight" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="reveal up" style={{ maxWidth: 720 }}>
            <div className="eyebrow">What we hold to</div>
            <h2 className="section-title">Six rules we do not bend</h2>
          </div>
          <div className="grid g3" style={{ marginTop: 44 }}>
            {PRINCIPLES.map((p, i) => (
              <article className="card reveal up" data-delay={i * 50} key={p.t}>
                <h3 style={{ fontSize: 18 }}>{p.t}</h3>
                <p style={{ marginTop: 10 }}>{p.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <People />

      {/* partners ----------------------------------------------------------- */}
      <section className="section section--tight" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">The people who extend us</div>
              <h2 className="section-title">Our partners are not logos</h2>
              <p className="section-lede">
                Each one has a named person, a defined contribution and a written record of what has been
                delivered. That is a higher bar than most partnership pages set.
              </p>
            </div>
            <Link href="/partners" className="btn-link">Read the record <Icon name="arrow" size={15} /></Link>
          </div>
          <div className="grid g4" style={{ marginTop: 44 }}>
            {partners.map((p) => (
              <Link key={p.slug} href={p.href} className="card card--hover">
                <div className="tag">{p.type}</div>
                <h3 style={{ fontSize: 19, marginTop: 12 }}>{p.name}</h3>
                <p style={{ fontSize: 13, marginTop: 8 }}>{p.contribution}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA
        title="If you run a school, a business or a studio, we should talk."
        copy="We work with clients, teach with practitioners, and partner with anyone who can extend access. All three start with the same form."
        cta="Start a conversation"
        href="/contact"
        secondary={{ label: 'Join the team', href: '/about/join-the-team' }}
      />
    </>
  );
}
