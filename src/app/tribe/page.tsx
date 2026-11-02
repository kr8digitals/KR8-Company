import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import TribeWaitlist from '@/components/TribeWaitlist';
import programmes from '../../../data/programmes.json';
import site from '../../../data/site.json';
import { Icon } from '@/components/ui';

export const metadata: Metadata = {
  title: 'The Tribe — the KR8 Digitals community',
  description:
    'The Tribe is where KR8 students, graduates and working creatives share leads, critique work and find jobs. The site opens soon — this is the first way in.',
  alternates: { canonical: '/tribe' },
};

export default function TribePage() {
  const tribe = programmes.programmes.find((p) => p.slug === 'the-tribe')!;
  return (
    <>
      <PageHero
        eyebrow="The Tribe · the KR8 network"
        title={<>A craft dies in isolation.<br /><span className="text-grad">The Tribe is the antidote.</span></>}
        lede="The Tribe is the community that holds KR8 together after the eight weeks are over — 2,480 creatives who answer each other's questions, critique each other's work and pass each other leads."
        crumbs={[{ label: 'The Tribe' }]}
        aside={
          <div className="panel" style={{ minWidth: 290 }}>
            <div className="tag" style={{ color: 'var(--magenta)' }}>Opening soon</div>
            <p style={{ fontSize: 14, color: 'var(--t-body)', marginTop: 10, lineHeight: 1.6 }}>
              The Tribe&apos;s own site is in build. Until it opens, this page is the front door and the
              waitlist is the only route in.
            </p>
            <a href="#join" className="btn-primary btn-sm" style={{ marginTop: 16 }}>Join the first wave <Icon name="arrow" size={15} /></a>
          </div>
        }
      />

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="wrap">
          <div className="story">
            <div className="reveal up">
              <div className="eyebrow">What it is</div>
              <h2 className="section-title" style={{ fontSize: 38 }}>The room after the classroom</h2>
              <p className="section-lede">{tribe.lede}</p>
            </div>
            <div className="prose-lg reveal up" data-delay="60">
              <p>{tribe.body}</p>
              <ul className="price-list" style={{ marginTop: 22 }}>
                {tribe.details.map((d) => <li key={d}><Icon name="check" size={15} /> {d}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight" id="join" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="split" style={{ alignItems: 'start', gap: 56 }}>
            <div className="reveal up" style={{ maxWidth: 460 }}>
              <div className="eyebrow">Get in first</div>
              <h2 className="section-title" style={{ fontSize: 36 }}>The waitlist is the door</h2>
              <p className="section-lede">
                When the Tribe site opens, the list is invited first — before it is posted on any social
                account. No fee, now or later.
              </p>
              <div className="meta-row" style={{ marginTop: 22 }}>
                <span><b>Cost</b> nothing</span>
                <span><b>Open to</b> anyone, trained or not</span>
                <span><b>Where</b> online, Nigeria and diaspora</span>
              </div>
              <p style={{ marginTop: 24, fontSize: 13.5, color: 'var(--t-muted)' }}>
                Already a student? <a href={site.ecosystem.academy.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--magenta)' }}>Your Academy dashboard ↗</a> already
                includes the Tribe channels.
              </p>
            </div>
            <div className="reveal up" data-delay="60"><TribeWaitlist /></div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <div className="panel reveal up" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: 22 }}>Want the training first?</h3>
              <p style={{ marginTop: 8, maxWidth: 560 }}>
                Most Tribe members came through the Academy. Seven tracks, eight weeks, no tuition — and the
                community comes with it.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/programs#free-training" className="btn-ghost">See the tracks</Link>
              <a href={site.ecosystem.academy.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Apply free <span className="arrow-out">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
