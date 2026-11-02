import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero, { ClosingCTA } from '@/components/PageHero';
import Duo from '@/components/Duo';
import { Icon } from '@/components/ui';
import site from '../../../data/site.json';
import programmes from '../../../data/programmes.json';

export const metadata: Metadata = {
  title: 'The Tribe — the KR8 Digitals community',
  description:
    'The Tribe is where people who train with KR8 Digitals keep working together: critique, leads and company. Its own site is in preparation — this page explains what it is.',
  alternates: { canonical: '/tribe' },
};

type Prog = {
  name: string;
  lede: string;
  body: string;
  image: string;
  imageAlt: string;
  tracks: string[];
  commitment: string;
};
const tribe = (programmes.programmes as unknown as Prog[]).find((p) => (p as unknown as { slug: string }).slug === 'tribe')!;

export default function TribePage() {
  return (
    <>
      <PageHero
        eyebrow="The Tribe · the KR8 community"
        title={<>A craft dies in isolation.<br /><span className="text-grad">The Tribe is the room.</span></>}
        lede={tribe.lede}
        aside={
          <figure style={{ margin: 0 }}>
            <div className="duo__frame" style={{ aspectRatio: '4 / 3' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tribe.image} alt={tribe.imageAlt} />
            </div>
            <figcaption style={{ marginTop: 10, fontSize: 11.5, color: 'var(--t-faint)' }}>{tribe.imageAlt}</figcaption>
          </figure>
        }
      />

      <section className="section" style={{ paddingTop: 50 }}>
        <div className="wrap">
          <div className="grid g3">
            {tribe.tracks.map((t, i) => (
              <div className="card reveal up" key={t} data-delay={i * 70}>
                <div className="tag" style={{ color: 'var(--magenta)' }}>0{i + 1}</div>
                <h3 style={{ marginTop: 10 }}>{t}</h3>
                <p style={{ marginTop: 8 }}>
                  {i === 0 && 'Work gets looked at by people who will tell you the truth rather than the kind thing.'}
                  {i === 1 && 'When a job comes in and somebody in the room can do it, it goes to the room first.'}
                  {i === 2 && 'You are not building alone. The people around you are on the same road, at the same stage.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Duo
        eyebrow="Where it lives"
        title="Its own address, not a group chat."
        body={
          <>
            <p>{tribe.body}</p>
            <p>
              <strong>tribe.kr8digitals.com is in preparation.</strong> The address exists but the site is not
              live yet, so we are not going to send you to a dead page. This page is the front door until it
              opens — and the programmes page explains how the Tribe fits with training.
            </p>
          </>
        }
        bullets={[tribe.commitment, 'No form on this page', 'Entry through training or invitation']}
        media={[
          { src: '/img/work/p-grant.jpg', alt: 'A member of the KR8 community photographed for their story', caption: 'Community · real faces' },
          { src: '/img/work/p-chinenye.jpg', alt: 'Another member of the KR8 community' },
        ]}
        cta={{ label: 'How the Tribe fits', href: '/programs#tribe' }}
        secondary={{ label: 'Start with free training', href: '/programs#free-training' }}
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="panel reveal up" style={{ padding: 30 }}>
            <div className="split" style={{ alignItems: 'center', gap: 24 }}>
              <div>
                <div className="eyebrow">Ask about the Tribe</div>
                <h3 style={{ marginTop: 10, fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 700 }}>
                  Want an introduction?
                </h3>
                <p style={{ marginTop: 8, fontSize: 14, color: 'var(--t-muted)' }}>
                  Message the team and somebody will tell you honestly whether the Tribe is the right room for
                  where you are right now.
                </p>
              </div>
              <div className="actions">
                <a href={`https://wa.me/${site.company.whatsapp}?text=${encodeURIComponent('Hi KR8 Digitals — I would like to ask about the Tribe.')}`} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <Icon name="wa" size={16} /> WhatsApp
                </a>
                <Link href="/contact?type=contact" className="btn-ghost">Message the team</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ClosingCTA
        title="The Tribe is where people keep going."
        copy="If you want in, the honest first step is training — and that is free."
        cta="See the free training"
        href="/programs#free-training"
        secondary={{ label: 'Back to programmes', href: '/programs' }}
      />
    </>
  );
}
