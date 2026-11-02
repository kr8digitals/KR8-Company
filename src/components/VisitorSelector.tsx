'use client';

import { useState } from 'react';
import Link from 'next/link';
import { track } from '@/lib/track';
import { Icon } from './ui';

type Opt = { id: string; label: string; sub: string; href: string; out?: boolean; say: string };

const OPTS: Opt[] = [
  {
    id: 'business', label: 'I run a business', sub: 'You need a site, a brand or a system that earns.',
    href: '/services', say: 'Start with what you need built. Five services, fixed prices, real examples.',
  },
  {
    id: 'learner', label: 'I want to learn a skill', sub: 'Free, eight weeks, taught by working practitioners.',
    href: 'https://academy.kr8digitals.com/apply', out: true, say: 'Applications for the fifth cohort are open now. Seven tracks, no tuition.',
  },
  {
    id: 'work', label: 'I am looking for work', sub: 'A paid team, trained on real client contracts.',
    href: '/about/join-the-team', say: 'Sixty days of training, then paid monthly. The terms are published in full.',
  },
  {
    id: 'community', label: 'I want community', sub: 'The Tribe: critique, leads and company.',
    href: '/programs#tribe', say: 'Open to everyone, including people who have not made anything yet.',
  },
  {
    id: 'exploring', label: 'Just exploring', sub: 'See the work and decide from there.',
    href: '/services/website-design#work', say: 'The portfolio is the fastest way to understand what we actually do.',
  },
];

export default function VisitorSelector() {
  const [picked, setPicked] = useState<string | null>(null);
  const active = OPTS.find((o) => o.id === picked);

  return (
    <section className="section" id="start" style={{ borderTop: '1px solid var(--hair-soft)' }}>
      <div className="wrap">
        <div className="reveal up" style={{ maxWidth: 760 }}>
          <div className="eyebrow">One last question</div>
          <h2 className="section-title">Which one is you?</h2>
          <p className="section-lede">
            Every answer leads to a real place to go next. Nobody leaves this site the way they came.
          </p>
        </div>

        <div className="reveal up" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 36 }}>
          {OPTS.map((o) => (
            <button
              key={o.id}
              className="pill"
              aria-pressed={picked === o.id}
              onClick={() => { setPicked(o.id); track('visitor_selector', { choice: o.id }); }}
              style={{
                padding: '13px 20px', fontSize: 14, letterSpacing: 0, textTransform: 'none',
                background: picked === o.id ? 'var(--grad)' : 'transparent',
                borderColor: picked === o.id ? 'transparent' : 'var(--hair)',
                color: '#fff', fontWeight: 600,
              }}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 26, minHeight: 108 }}>
          {active ? (
            <div className="card reveal up" style={{ maxWidth: 620 }}>
              <div className="tag" style={{ color: 'var(--magenta)' }}>Your next step</div>
              <p style={{ marginTop: 8, color: '#fff', fontSize: 16, lineHeight: 1.65 }}>{active.say}</p>
              {active.out ? (
                <a href={active.href} target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm" style={{ marginTop: 18 }}>
                  {active.label} <span className="arrow-out">↗</span>
                </a>
              ) : (
                <Link href={active.href} className="btn-primary btn-sm" style={{ marginTop: 18 }}>
                  Take me there <Icon name="arrow" size={16} />
                </Link>
              )}
            </div>
          ) : (
            <p style={{ fontSize: 13.5, color: 'var(--t-faint)' }}>
              Choose one above and we will point you at the exact page — no menu hunting.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
