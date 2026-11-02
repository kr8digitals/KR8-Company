'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from './ui';

type Way = {
  id: string;
  label: string;
  line: string;
  body: string;
  gives: string[];
  cta: { label: string; href: string };
  image: string;
  imageAlt: string;
};

const WAYS: Way[] = [
  {
    id: 'teach',
    label: 'Teach',
    line: 'Bring a craft into the free training.',
    body: 'If you do the work, you can teach it. A partner who teaches supplies a track, a practitioner to run it and a standard for the work — we supply the students, the structure and the logistics. Motion Verse teaches graphic design; CHIGOMA teaches video editing; Next Gen Scholars teaches the academic door.',
    gives: ['A track in the free training', 'A named practitioner teaching it', 'A brief the students build against'],
    cta: { label: 'Offer to teach', href: '/contact?partner=teach' },
    image: '/img/brand/zoey-perfume-full.webp',
    imageAlt: 'Design work by Motion Verse, a co-founding partner',
  },
  {
    id: 'fund',
    label: 'Fund',
    line: 'Pay for the thing that has no invoice.',
    body: 'Training is free, which means somebody pays for the room, the data, the equipment and the people teaching. Funding is named and it is specific: a cohort, a track, a set of laptops, a Mindset Shift edition. You get the record of what it paid for.',
    gives: ['A named cohort or track', 'Equipment or data bundles', 'A Mindset Shift edition'],
    cta: { label: 'Talk about funding', href: '/contact?partner=fund' },
    image: '/img/sites/afristem-school-full.webp',
    imageAlt: 'A learner-facing programme site built by KR8 Digitals',
  },
  {
    id: 'hire',
    label: 'Hire',
    line: 'Take our people on when they are ready.',
    body: 'The most useful thing a partner can do is hire. We will tell you who is ready, show you their work and their verification record, and you interview them like anyone else. No placement fee. The point is that the training ends in work.',
    gives: ['Screened candidates with a portfolio', 'A verification record per person', 'No placement fee'],
    cta: { label: 'Hire from KR8', href: '/contact?partner=hire' },
    image: '/video/story-02-poster.webp',
    imageAlt: 'A member of the KR8 community',
  },
  {
    id: 'host',
    label: 'Host',
    line: 'Give the room a room.',
    body: 'A hall for a cohort, a venue for Mindset Shift, a site for a shoot, connectivity for a class. If you have a space that sits empty when it could be full of people learning, that is a partnership.',
    gives: ['A venue for an edition', 'A classroom for a cohort', 'A location or production space for a shoot'],
    cta: { label: 'Offer a space', href: '/contact?partner=host' },
    image: '/img/sites/mcgettrick-full.webp',
    imageAlt: 'The McGettrick Pastoral Centre site — a venue booking build',
  },
];

export default function WaysToPartner() {
  const [active, setActive] = useState(0);
  const w = WAYS[active];

  return (
    <div>
      <div className="ways ways--4" role="tablist" aria-label="Four ways to partner">
        {WAYS.map((x, i) => (
          <button
            key={x.id}
            className="way"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
          >
            <b>{x.label}</b>
            <span>{x.line}</span>
          </button>
        ))}
      </div>

      <div className="panel way__panel reveal is-in" key={w.id} role="tabpanel" aria-label={w.label}>
        <div className="duo" style={{ gap: 30 }}>
          <div>
            <div className="eyebrow">{w.label} with KR8 Digitals</div>
            <h3 style={{ marginTop: 10, fontFamily: 'Montserrat, sans-serif', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
              {w.line}
            </h3>
            <p style={{ marginTop: 12, fontSize: 14.5, color: 'var(--t-muted)', lineHeight: 1.65 }}>{w.body}</p>
            <ul className="price-list" style={{ marginTop: 16 }}>
              {w.gives.map((g) => (
                <li key={g}><Icon name="check" size={15} /> {g}</li>
              ))}
            </ul>
            <Link href={w.cta.href} className="btn-primary btn-sm" style={{ marginTop: 20 }}>
              {w.cta.label} <Icon name="arrow" size={15} />
            </Link>
          </div>
          <div className="duo__media">
            <div className="duo__frame" style={{ aspectRatio: '16 / 11' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={w.image} alt={w.imageAlt} loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
