import Link from 'next/link';
import type { Metadata } from 'next';
import partners from '../../../data/partners.json';
import PageHero, { ClosingCTA } from '@/components/PageHero';
import { Icon } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Partners — teach, fund, hire and host with us',
  description:
    'Motion Verse, Chigoma, Next Gen Scholars and HIS Battle Axe. Four partners with named people, defined contributions and a written record of what has been delivered.',
  alternates: { canonical: '/partners' },
};

const ROUTES = [
  { t: 'Teach', d: 'Bring a craft you already sell into a track. You keep your studio; we keep the standard.', who: 'Studios and senior practitioners' },
  { t: 'Fund', d: 'Sponsor a cohort, a track, or a single student through hardware and data.', who: 'Brands, foundations, individuals' },
  { t: 'Hire', d: 'Take graduates on placement or straight into a role. You get people already delivering live work.', who: 'Employers and agencies' },
  { t: 'Host', d: 'Give the room. Schools and hubs across Ebonyi, Enugu and Lagos host Mindset Shift and cohort meetups.', who: 'Schools, hubs, churches, NGOs' },
];

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Partners"
        title={<>We do not build alone.<br /><span className="text-grad">And we do not do logo walls.</span></>}
        lede="A partner here has a named person, a stated contribution, and a record of what has actually been delivered. If we cannot write that down, the partnership is not real yet."
        crumbs={[{ label: 'Partners' }]}
      />

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="wrap">
          <div className="grid g2 grid--loose">
            {partners.map((p, i) => (
              <article key={p.slug} className="card card--hover reveal up" data-delay={i * 60}>
                <div className="partner-hero" style={{ marginBottom: 22 }}>
                  {p.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.logo} alt={`${p.name} logo`} style={{ width: 96, height: 96, objectFit: 'contain', borderRadius: 16, background: 'rgba(255,255,255,.04)' }} />
                  ) : (
                    <div className="partner-mark">{p.mark}</div>
                  )}
                  <div>
                    <div className="tag">{p.type}</div>
                    <h3 style={{ fontSize: 24, marginTop: 6 }}>{p.name}</h3>
                    <div style={{ fontSize: 13, color: 'var(--lilac)', marginTop: 4 }}>{p.person} · since {p.partnershipSince}</div>
                  </div>
                </div>
                <p>{p.blurb}</p>
                <div className="meta-row" style={{ marginTop: 18 }}>
                  <span><b>Contributes</b> {p.contribution}</span>
                  {p.teaches && <span><b>Teaches</b> {p.teaches}</span>}
                </div>
                <Link href={p.href} className="btn-link" style={{ marginTop: 20, display: 'inline-flex' }}>
                  Read the record <Icon name="arrow" size={14} />
                </Link>
                {p.logoNeeded && (
                  <p style={{ marginTop: 14, fontSize: 11.5, color: 'var(--t-faint)' }}>
                    Wordmark shown while the partner supplies a vector logo.
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="reveal up" style={{ maxWidth: 720 }}>
            <div className="eyebrow">Four ways to partner</div>
            <h2 className="section-title">What extending access actually looks like</h2>
          </div>
          <div className="grid g4" style={{ marginTop: 44 }}>
            {ROUTES.map((r, i) => (
              <article className="card reveal up" data-delay={i * 50} key={r.t}>
                <div className="door__verb text-grad" style={{ fontSize: 15 }}>{r.t}</div>
                <p style={{ marginTop: 10 }}>{r.d}</p>
                <div className="tag" style={{ marginTop: 14, color: 'var(--t-faint)' }}>{r.who}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA
        title="Tell us what you can bring."
        copy="Teaching, funding, placement or a room. One form, read by a person, answered within a working day."
        cta="Start a partnership"
        href="/contact?type=partner"
        secondary={{ label: 'See the team', href: '/about' }}
      />
    </>
  );
}
