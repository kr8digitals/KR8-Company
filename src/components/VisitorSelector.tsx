'use client';

import Link from 'next/link';
import { track } from '@/lib/track';
import { Icon } from './ui';

type Opt = { id: string; label: string; sub: string; href: string; out?: boolean; icon: string };

const OPTS: Opt[] = [
  {
    id: 'business',
    label: 'I run a business or organisation',
    sub: 'See what we build, then ask for a quote.',
    href: '/services',
    icon: 'monitor',
  },
  {
    id: 'learner',
    label: 'I want to learn a skill',
    sub: 'Free training in digital skills and academics.',
    href: '/programs',
    icon: 'palette',
  },
  {
    id: 'work',
    label: 'I am looking for work',
    sub: 'The route from training into the team.',
    href: '/about/join-the-team',
    icon: 'check',
  },
  {
    id: 'community',
    label: 'I am looking for community',
    sub: 'The Tribe: people building the same thing you are.',
    href: '/programs#tribe',
    icon: 'film',
  },
  {
    id: 'exploring',
    label: 'I am just exploring',
    sub: 'Start with who we are and who is behind it.',
    href: '/about',
    icon: 'search',
  },
];

export default function VisitorSelector() {
  return (
    <section className="section" id="start" style={{ borderTop: '1px solid var(--hair-soft)' }}>
      <div className="wrap">
        <div className="reveal up" style={{ maxWidth: 760 }}>
          <div className="eyebrow">Pick a door</div>
          <h2 className="section-title">How can we help you?</h2>
          <p className="section-lede">
            Five ways in. Each one goes straight to the page that answers it — no menu hunting.
          </p>
        </div>

        <div className="ways" style={{ marginTop: 36 }}>
          {OPTS.map((o) => (
            <Link
              key={o.id}
              href={o.href}
              className="way"
              onClick={() => track('visitor_selector', { choice: o.id })}
              style={{ display: 'block', textDecoration: 'none' }}
            >
              <span style={{ display: 'inline-flex', color: 'var(--magenta)', marginBottom: 10 }}>
                <Icon name={o.icon} size={20} />
              </span>
              <b>{o.label}</b>
              <span>{o.sub}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 12, fontWeight: 600, color: 'var(--lilac)' }}>
                Take me there <Icon name="arrow" size={13} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
