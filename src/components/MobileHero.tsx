'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from './ui';

type ShowcaseSlide = {
  id: 'websites' | 'branding' | 'video' | 'ai-seo' | 'academy';
  shortLabel: string;
  eyebrow: string;
  headline: string;
  proofStat: string;
  proofSub: string;
  photo: string;
  photoAlt: string;
  thumb?: string;
  href: string;
  ctaText: string;
  external?: boolean;
  ms: number;
};

const SLIDES: ShowcaseSlide[] = [
  {
    id: 'websites',
    shortLabel: 'Web',
    eyebrow: '01 · Web & App Engineering',
    headline: 'Fast custom websites & 18 ready-built launch platforms',
    proofStat: 'From $450',
    proofSub: '22+ Live Client Sites',
    photo: '/img/hero-mobile/flagship-websites.webp',
    photoAlt: 'KR8 Digitals web engineers reviewing responsive client websites in a sunlit studio',
    thumb: '/img/sites/afristem-card.webp',
    href: '/services/website-design',
    ctaText: 'See Builds',
    ms: 4600,
  },
  {
    id: 'branding',
    shortLabel: 'Brand',
    eyebrow: '02 · Motionverse × KR8',
    headline: 'Unmistakable brand identities & scroll-stopping key art',
    proofStat: 'Full Systems',
    proofSub: 'Logos · Playbooks · Flyers',
    photo: '/img/hero-mobile/flagship-branding.webp',
    photoAlt: 'Art director crafting vibrant brand identity boards and campaign graphics in warm daylight',
    thumb: '/img/brand/zoey-perfume-card.webp',
    href: '/services/branding',
    ctaText: 'See Brand',
    ms: 4400,
  },
  {
    id: 'video',
    shortLabel: 'Video',
    eyebrow: '03 · Chigoma × KR8 Film',
    headline: 'Retention-engineered reels, commercials & brand stories',
    proofStat: '9:16 & 4K',
    proofSub: 'Color · Sound · Captions',
    photo: '/img/hero-mobile/flagship-video.webp',
    photoAlt: 'Film director color-grading documentary footage in a bright post-production studio',
    href: '/services/video-editing',
    ctaText: 'Watch Cuts',
    ms: 4400,
  },
  {
    id: 'ai-seo',
    shortLabel: 'AI & SEO',
    eyebrow: '04 · Growth & Automation',
    headline: '24/7 grounded AI agents & #1 organic search rankings',
    proofStat: '24/7 Live',
    proofSub: 'AI Agents · Search Rank',
    photo: '/img/hero-mobile/flagship-ai.webp',
    photoAlt: 'Software engineers collaborating over a bright AI workflow automation screen',
    href: '/services/ai-automation',
    ctaText: 'Explore AI',
    ms: 4400,
  },
  {
    id: 'academy',
    shortLabel: 'Academy',
    eyebrow: '05 · KR8 Academy & NextGen',
    headline: '7 practical digital skill tracks — 100% tuition-free',
    proofStat: '$0 · ₦0',
    proofSub: '7 Free Tracks · Mentors',
    photo: '/img/hero-mobile/flagship-academy.webp',
    photoAlt: 'Young builders learning digital skills together in a warm KR8 Academy cohort',
    href: 'https://academy.kr8digitals.com',
    ctaText: 'Apply Free',
    external: true,
    ms: 4600,
  },
];

export default function MobileHero({
  primaryHref,
  primaryLabel,
  secondaryHref,
}: {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
}) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const slide = SLIDES[idx];

  const go = useCallback((next: number) => {
    setIdx(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => go(idx + 1), slide.ms);
    return () => clearTimeout(timer);
  }, [idx, paused, slide.ms, go]);

  return (
    <div className="mhero mhero-v2">
      {/* 1. Editorial Identity & Manifesto Headline */}
      <div className="mhero-v2__top">
        <div className="mhero-v2__eyebrow-row">
          <span className="mhero-v2__badge">
            <span className="badge-dot" /> KR8 Digitals
          </span>
          <span className="mhero-v2__live-pill">200+ Shipped Works</span>
        </div>

        <h1 className="mhero-v2__title">
          <span className="mhero-v2__kicker">Whoever you are, whatever you do,</span>
          <span className="mhero-v2__main text-grad">we exist because of you.</span>
        </h1>

        <p className="mhero-v2__lead">
          Websites, brand identity, video, SEO &amp; AI built to make you chosen — plus{' '}
          <strong>100% free</strong> digital skills training.
        </p>
      </div>

      {/* 2. Luminous Full-Color Editorial Studio Reel */}
      <div
        className="mhero-v2__reel"
        onTouchStart={(e) => {
          setPaused(true);
          setTouchStartX(e.touches[0]?.clientX ?? null);
        }}
        onTouchEnd={(e) => {
          setPaused(false);
          if (touchStartX === null) return;
          const endX = e.changedTouches[0]?.clientX ?? touchStartX;
          const dx = endX - touchStartX;
          if (Math.abs(dx) > 30) {
            go(dx < 0 ? idx + 1 : idx - 1);
          }
          setTouchStartX(null);
        }}
      >
        <div className="mhero-v2__flare" aria-hidden />

        {/* Story Progress Bars + Interactive Discipline Tabs */}
        <div className="mhero-v2__chrome">
          <div className="mhero-v2__bars" aria-hidden>
            {SLIDES.map((s, i) => (
              <span
                key={s.id}
                className={`mhero-v2__bar${i < idx ? ' is-done' : ''}${i === idx ? ' is-active' : ''}`}
              >
                <i
                  className="mhero-v2__bar-fill"
                  style={{
                    animationDuration: `${s.ms}ms`,
                    animationPlayState: i === idx && !paused ? 'running' : 'paused',
                  }}
                />
              </span>
            ))}
          </div>

          <div className="mhero-v2__tabs" role="tablist" aria-label="KR8 capabilities">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === idx}
                className={`mhero-v2__tab${i === idx ? ' is-active' : ''}`}
                onClick={() => go(i)}
              >
                {s.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Full-Clarity Sunlit Studio Frame */}
        <div className="mhero-v2__viewport" key={slide.id}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.photo}
            alt={slide.photoAlt}
            className="mhero-v2__photo"
            loading={idx === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
          <div className="mhero-v2__scrim" aria-hidden />

          {/* Floating Proof Card inside the Stage */}
          <div className="mhero-v2__overlay">
            <div className="mhero-v2__eyebrow">{slide.eyebrow}</div>
            <div className="mhero-v2__slide-title">{slide.headline}</div>

            <div className="mhero-v2__dock">
              <div className="mhero-v2__proof">
                {slide.thumb && (
                  <span className="mhero-v2__thumb" aria-hidden>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slide.thumb} alt="" decoding="async" />
                  </span>
                )}
                <div className="mhero-v2__proof-copy">
                  <strong>{slide.proofStat}</strong>
                  <span>{slide.proofSub}</span>
                </div>
              </div>

              {slide.external ? (
                <a
                  href={slide.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mhero-v2__chip-cta"
                >
                  {slide.ctaText} ↗
                </a>
              ) : (
                <Link href={slide.href} className="mhero-v2__chip-cta">
                  {slide.ctaText} →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Thumb-Ergonomic Primary Action Bar */}
      <div className="mhero-v2__actions">
        <Link href={primaryHref} className="btn-primary mhero-v2__btn-primary">
          {primaryLabel} <Icon name="arrow" size={17} />
        </Link>
        <div className="mhero-v2__btn-pair">
          <a
            href={secondaryHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost mhero-v2__btn-secondary"
          >
            Learn Free <span>↗</span>
          </a>
          <Link href="/services" className="btn-ghost mhero-v2__btn-secondary">
            6 Services
          </Link>
        </div>
      </div>

      {/* 4. Instant Credibility Strip */}
      <div className="mhero-v2__trust" aria-label="KR8 key proof">
        <div className="mhero-v2__trust-item">
          <b>200+</b>
          <span>Works</span>
        </div>
        <i aria-hidden />
        <div className="mhero-v2__trust-item">
          <b>100+</b>
          <span>Clients</span>
        </div>
        <i aria-hidden />
        <div className="mhero-v2__trust-item">
          <b>$0</b>
          <span>Academy</span>
        </div>
        <i aria-hidden />
        <div className="mhero-v2__trust-item">
          <b>3K+</b>
          <span>Tribe</span>
        </div>
      </div>
    </div>
  );
}
