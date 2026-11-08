'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from './ui';

type ActId = 'solutions' | 'academy' | 'tribe';

type ActConfig = {
  id: ActId;
  tab: string;
  footerText: string;
  footerCta: string;
  footerHref: string;
  external?: boolean;
  ms: number;
};

const ACTS: ActConfig[] = [
  {
    id: 'solutions',
    tab: 'Problem Solvers',
    footerText: 'Websites · Brand · Video · AI · SEO',
    footerCta: 'Explore',
    footerHref: '/services',
    ms: 5100,
  },
  {
    id: 'academy',
    tab: 'Free Academy',
    footerText: 'Skills + Academics · 100% Free ($0)',
    footerCta: 'Join Free',
    footerHref: 'https://academy.kr8digitals.com',
    external: true,
    ms: 5100,
  },
  {
    id: 'tribe',
    tab: 'The Tribe',
    footerText: '3,000+ Builders, Creatives & Scholars',
    footerCta: 'Enter Tribe',
    footerHref: '/tribe',
    ms: 5100,
  },
];

const SOLUTION_CARDS = [
  {
    key: 'web-ai',
    tag: 'Web & AI Systems',
    domain: 'afristem.org',
    stat: 'Live Build',
    img: '/img/sites/afristem-card.webp',
    alt: 'Live KR8 web and AI platform engineered for AfriSTEM',
  },
  {
    key: 'brand',
    tag: 'Brand & Design',
    domain: 'Motionverse × KR8',
    stat: 'Identity',
    img: '/img/brand/zoey-perfume-card.webp',
    alt: 'KR8 brand identity and campaign visual design',
  },
  {
    key: 'growth',
    tag: 'Video & Search',
    domain: 'Chigoma × KR8',
    stat: '4K & SEO',
    img: '/img/sites/cirenes-card.webp',
    alt: 'KR8 commercial digital experience and storytelling',
  },
];

const SKILL_ITEMS = ['Web & AI Systems', 'Brand & UI Design', 'Video & Motion'];
const ACADEMIC_ITEMS = ['STEM Mastery', 'Arts & Writing', 'Exam Excellence'];

const TRIBE_NODES = [
  { id: 'nw', role: 'Builders', sub: 'Web & AI', pos: 'nw' },
  { id: 'ne', role: 'Designers', sub: 'Brand & Art', pos: 'ne' },
  { id: 'sw', role: 'Creators', sub: 'Film & Story', pos: 'sw' },
  { id: 'se', role: 'Scholars', sub: 'STEM & Peer', pos: 'se' },
] as const;

export default function MobileHero({
  primaryHref,
  primaryLabel,
  secondaryHref,
}: {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
}) {
  const [actIdx, setActIdx] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const activeAct = ACTS[actIdx];

  const selectAct = useCallback((next: number) => {
    const normalized = ((next % ACTS.length) + ACTS.length) % ACTS.length;
    setActIdx(normalized);
    setSubStep(0);
  }, []);

  /* Advance across the 3 core acts */
  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => selectAct(actIdx + 1), activeAct.ms);
    return () => clearTimeout(timer);
  }, [actIdx, paused, activeAct.ms, selectAct]);

  /* Internal micro-choreography within each act (every 1.65s) */
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setSubStep((s) => (s + 1) % 12);
    }, 1650);
    return () => clearInterval(interval);
  }, [actIdx, paused]);

  const activeCardIdx = subStep % SOLUTION_CARDS.length;
  const activeTrackRow = subStep % 3;
  const activeNodeIdx = subStep % TRIBE_NODES.length;

  return (
    <div className="mhero mhero-v3">
      {/* 1. Pure, Uncluttered Manifesto Headline (Zero Badge, Zero Description) */}
      <div className="mhero-v3__intro">
        <h1 className="mhero-v3__title">
          <span className="mhero-v3__title-top">We exist</span>
          <span className="mhero-v3__title-accent">because of you.</span>
        </h1>
      </div>

      {/* 2. Purpose-Built Mobile Interactive Stage (Engineered Natively for Portrait) */}
      <div
        className={`mhero-v3__stage mhero-v3__stage--${activeAct.id}`}
        onTouchStart={(e) => {
          setPaused(true);
          setTouchStartX(e.touches[0]?.clientX ?? null);
        }}
        onTouchEnd={(e) => {
          setPaused(false);
          if (touchStartX === null) return;
          const endX = e.changedTouches[0]?.clientX ?? touchStartX;
          const dx = endX - touchStartX;
          if (Math.abs(dx) > 28) {
            selectAct(dx < 0 ? actIdx + 1 : actIdx - 1);
          }
          setTouchStartX(null);
        }}
      >
        <div className="mhero-v3__specular" aria-hidden />

        {/* Clean 3-Act Segmented Rail with Integrated Live Progress */}
        <div className="mhero-v3__rail" role="tablist" aria-label="How KR8 serves you">
          {ACTS.map((act, i) => {
            const isActive = i === actIdx;
            return (
              <button
                key={act.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`mhero-v3__tab${isActive ? ' is-active' : ''}`}
                onClick={() => selectAct(i)}
              >
                <span className="mhero-v3__tab-label">{act.tab}</span>
                {isActive && (
                  <span
                    key={`${act.id}-${actIdx}`}
                    className="mhero-v3__tab-progress"
                    style={{
                      animationDuration: `${act.ms}ms`,
                      animationPlayState: paused ? 'paused' : 'running',
                    }}
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Native Portrait Motion Canvas */}
        <div className="mhero-v3__canvas">
          {/* Ambient Studio Backdrop Layers */}
          <div className="mhero-v3__atmo" aria-hidden>
            <div className="mhero-v3__atmo-grid" />
            <div className="mhero-v3__atmo-orb mhero-v3__atmo-orb--a" />
            <div className="mhero-v3__atmo-orb mhero-v3__atmo-orb--b" />
          </div>

          {/* ACT 1: PROBLEM SOLVERS — 3D Fanning Live Deliverables Deck */}
          {activeAct.id === 'solutions' && (
            <div className="mhero-v3__scene mhero-v3__scene--solutions" key="solutions">
              <div className="mhero-v3__deck">
                {SOLUTION_CARDS.map((card, i) => {
                  const total = SOLUTION_CARDS.length;
                  const diff = (i - activeCardIdx + total) % total;
                  const slot = diff === 0 ? 'center' : diff === 1 ? 'right' : 'left';
                  return (
                    <button
                      key={card.key}
                      type="button"
                      className={`mhero-v3__sol-card is-${slot}`}
                      onClick={() => setSubStep(i)}
                      aria-label={card.tag}
                    >
                      <div className="mhero-v3__sol-bar">
                        <span className="mhero-v3__sol-dots" aria-hidden>
                          <i />
                          <i />
                          <i />
                        </span>
                        <span className="mhero-v3__sol-domain">{card.domain}</span>
                        <span className="mhero-v3__sol-live">{card.stat}</span>
                      </div>
                      <div className="mhero-v3__sol-media">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={card.img}
                          alt={card.alt}
                          loading={i === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                        <span className="mhero-v3__sol-chip">
                          <i aria-hidden /> {card.tag}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ACT 2: FREE ACADEMY — Synchronized Skills × Academics Dual Engine */}
          {activeAct.id === 'academy' && (
            <div className="mhero-v3__scene mhero-v3__scene--academy" key="academy">
              <div className="mhero-v3__free-crown">
                <span className="mhero-v3__free-dot" aria-hidden />
                <span>$0 · ₦0 Tuition — Open to Everyone</span>
              </div>

              <div className="mhero-v3__acad-grid">
                <div className="mhero-v3__acad-wing">
                  <div className="mhero-v3__acad-head">
                    <span className="mhero-v3__acad-kicker">KR8 Academy</span>
                    <strong>Digital Skills</strong>
                  </div>
                  <ul className="mhero-v3__acad-list">
                    {SKILL_ITEMS.map((item, idx) => (
                      <li key={item} className={activeTrackRow === idx ? 'is-lit' : undefined}>
                        <i aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mhero-v3__acad-bridge" aria-hidden>
                  <span className="mhero-v3__acad-plus">+</span>
                </div>

                <div className="mhero-v3__acad-wing">
                  <div className="mhero-v3__acad-head">
                    <span className="mhero-v3__acad-kicker">NextGen</span>
                    <strong>Academics</strong>
                  </div>
                  <ul className="mhero-v3__acad-list">
                    {ACADEMIC_ITEMS.map((item, idx) => (
                      <li key={item} className={activeTrackRow === idx ? 'is-lit' : undefined}>
                        <i aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ACT 3: THE TRIBE — Living Community Signal Constellation */}
          {activeAct.id === 'tribe' && (
            <div className="mhero-v3__scene mhero-v3__scene--tribe" key="tribe">
              <div className="mhero-v3__constellation">
                <svg
                  className="mhero-v3__constellation-svg"
                  viewBox="0 0 320 172"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <line x1="66" y1="36" x2="160" y2="86" className="mhero-v3__beam" />
                  <line x1="254" y1="36" x2="160" y2="86" className="mhero-v3__beam mhero-v3__beam--d1" />
                  <line x1="66" y1="136" x2="160" y2="86" className="mhero-v3__beam mhero-v3__beam--d2" />
                  <line x1="254" y1="136" x2="160" y2="86" className="mhero-v3__beam mhero-v3__beam--d3" />
                </svg>

                {/* Central KR8 Community Core */}
                <div className="mhero-v3__hub">
                  <span className="mhero-v3__hub-ring mhero-v3__hub-ring--outer" aria-hidden />
                  <span className="mhero-v3__hub-ring mhero-v3__hub-ring--inner" aria-hidden />
                  <div className="mhero-v3__hub-core">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/img/brand/kr8-mark-256.webp" alt="KR8 Tribe Core" width={36} height={36} />
                  </div>
                </div>

                {/* 4 Living Discipline Nodes */}
                {TRIBE_NODES.map((node, i) => (
                  <div
                    key={node.id}
                    className={`mhero-v3__node mhero-v3__node--${node.pos}${activeNodeIdx === i ? ' is-lit' : ''}`}
                  >
                    <strong>{node.role}</strong>
                    <span>{node.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compact Single-Line Stage Footer (Zero Clutter) */}
          <div className="mhero-v3__foot">
            <span className="mhero-v3__foot-text">{activeAct.footerText}</span>
            {activeAct.external ? (
              <a
                href={activeAct.footerHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mhero-v3__foot-link"
              >
                {activeAct.footerCta} ↗
              </a>
            ) : (
              <Link href={activeAct.footerHref} className="mhero-v3__foot-link">
                {activeAct.footerCta} →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 3. Immediate Above-The-Fold CTA Row (Zero Useless Details Below) */}
      <div className="mhero-v3__ctas">
        <Link href={primaryHref} className="btn-primary mhero-v3__cta-main">
          {primaryLabel} <Icon name="arrow" size={16} />
        </Link>
        <a
          href={secondaryHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost mhero-v3__cta-sec"
        >
          Free Academy <span aria-hidden>↗</span>
        </a>
      </div>
    </div>
  );
}
