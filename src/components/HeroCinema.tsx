'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import sitesData from '../../data/sites.json';
import services from '../../data/services.json';
import programmes from '../../data/programmes.json';
import './plates-motion.css';

/* ----------------------------------------------------------------------------
 * The hero is the hook.
 *
 * It runs itself, in seven cinematic beats, and every beat is legible: one big
 * object on screen at a time, lit, moving, captioned. Nothing is scattered and
 * nothing waits to be clicked.
 *
 *   1  Welcome to KR8 Digitals      volumetric light plate
 *   2  the real mark                glass plate, counter-rotating halo
 *   3  See what we've built         light tunnel plate
 *   4  the work: websites           a readable carousel — one site held big,
 *                                   the next and previous peeking, auto-advance
 *   5  the work: design             the same carousel, portrait flyers
 *   6  what should we do for you    services, then programmes, full frame
 *   7  meet the founders            three portraits, three names
 * ------------------------------------------------------------------------- */

type Kind = 'welcome' | 'mark' | 'built' | 'sites' | 'design' | 'offers' | 'founders';

type Beat = { id: Kind; ms: number; plate: string; title: string; sub: string; href: string; cta: string };

const BEATS: Beat[] = [
  { id: 'welcome', ms: 3400, plate: 'rays',
    title: 'Welcome to KR8 Digitals', sub: 'A creative company', href: '/about', cta: 'Who we are' },
  { id: 'mark', ms: 3000, plate: 'glass',
    title: 'KR8 Digitals', sub: 'A creative company', href: '/about', cta: 'Who we are' },
  { id: 'built', ms: 3200, plate: 'tunnel',
    title: "See what we've built for clients", sub: 'Real work, running right now', href: '/services', cta: 'All the work' },
  { id: 'sites', ms: 16800, plate: 'rays',
    title: '22 sites, live on their own domains', sub: 'Every one open — this is the work, not a mock-up', href: '/services#websites', cta: 'See the portfolio' },
  { id: 'design', ms: 12600, plate: 'bokeh',
    title: 'Flyers and identity for named clients', sub: 'KR8 Digitals in association with Motionverse', href: '/services#graphic-design', cta: 'See the design work' },
  { id: 'offers', ms: 16200, plate: 'tunnel',
    title: 'What should we do for you?', sub: 'Five services, then three programmes', href: '/services', cta: 'All services' },
  { id: 'founders', ms: 8400, plate: 'glass',
    title: 'Meet the founders', sub: 'Three practitioners. One company.', href: '/about', cta: 'Read about them' },
];

/** Sites in the order they deserve to be shown: client work first. */
const HERO_SITES = ['afristem', 'cirenes', 'mcgettrick', 'rapha', 'monabliss', 'tastia', 'salt-lake', 'vegas', 'xenia', 'adig-suites'];

function siteItems() {
  const by = new Map(sitesData.sites.map((s) => [s.slug, s] as const));
  const picked = HERO_SITES.map((slug) => by.get(slug)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  return picked.map((s) => ({
    img: s.full || s.card,
    thumb: s.card,
    name: s.name,
    meta: s.status === 'live' ? 'Live client site' : 'Built and ready — for sale',
    href: s.url || '/services#websites',
    external: Boolean(s.url),
    kind: 'site' as const,
  }));
}

function flyerItems() {
  return sitesData.flyers.map((f) => ({
    img: f.full || f.card,
    thumb: f.card,
    name: f.title,
    meta: f.client ? `Client work · ${f.client}` : 'Client flyer',
    href: f.full || f.card,
    external: false,
    kind: 'flyer' as const,
  }));
}

const FOUNDERS = [
  { name: 'Timfire', full: 'Kenneth Timothy Iziogo', role: 'Founder & Chief Executive', img: '/img/team/founder-timfire.jpg' },
  { name: 'Steveoking', full: 'Stevenson', role: 'Co-Founder', img: '/img/team/stevenson.jpg' },
  { name: 'Creative Expression', full: 'Daniel Akachukwu Augustine', role: 'Co-Founder', img: '/img/team/daniel.jpg' },
];

const OFFERS = [
  ...services.map((s) => ({ kind: 'Service', n: s.order, name: s.group || s.name, line: s.tagline, href: `/services#${s.anchor || s.slug}` })),
  ...programmes.programmes.slice(0, 3).map((p: { slug: string; name: string; lede?: string }) => ({
    kind: 'Programme', n: null as number | null, name: p.name, line: p.lede || '', href: '/programs',
  })),
];

const OFFER_MS = 1900;

export default function HeroCinema() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [beat, setBeat] = useState(0);
  const [paused, setPaused] = useState(false);
  const [slide, setSlide] = useState(0);
  const [offer, setOffer] = useState(0);
  const current = BEATS[beat];

  const sites = useMemo(siteItems, []);
  const flyers = useMemo(flyerItems, []);

  const go = useCallback((i: number) => setBeat(((i % BEATS.length) + BEATS.length) % BEATS.length), []);

  useEffect(() => {
    const media = typeof window.matchMedia === 'function' ? window.matchMedia('(min-width: 1024px)') : null;
    const update = () => setIsDesktop(media?.matches ?? window.innerWidth >= 1024);
    update();
    media?.addEventListener?.('change', update);
    return () => media?.removeEventListener?.('change', update);
  }, []);

  /* beat clock: the desktop show should not run in the hidden mobile layout. */
  useEffect(() => {
    if (paused || !isDesktop) return;
    const t = setTimeout(() => go(beat + 1), current.ms);
    return () => clearTimeout(t);
  }, [beat, paused, isDesktop, current.ms, go]);

  /* reset the slide whenever the beat changes */
  useEffect(() => { setSlide(0); setOffer(0); }, [beat]);

  /* carousel advance */
  useEffect(() => {
    if (paused || !isDesktop) return;
    if (current.id !== 'sites' && current.id !== 'design') return;
    const len = current.id === 'sites' ? sites.length : flyers.length;
    if (!len) return;
    const step = current.id === 'sites' ? 2600 : 2400;
    const t = setInterval(() => setSlide((s) => (s + 1) % len), step);
    return () => clearInterval(t);
  }, [current.id, paused, isDesktop, sites.length, flyers.length]);

  /* offers advance */
  useEffect(() => {
    if (paused || !isDesktop || current.id !== 'offers') return;
    const start = Date.now();
    const t = setInterval(() => setOffer(Math.floor((Date.now() - start) / OFFER_MS) % OFFERS.length), 150);
    return () => clearInterval(t);
  }, [current.id, paused, isDesktop]);

  const words = current.id === 'welcome'
    ? ['Welcome', 'to', 'KR8\u00A0Digitals']
    : current.id === 'built'
      ? ['See', 'what', "we've", 'built', 'for', 'clients']
      : current.title.split(' ');

  const isCarousel = current.id === 'sites' || current.id === 'design';
  const items = current.id === 'sites' ? sites : flyers;
  const active = items[slide] || items[0];

  return (
    <div
      className={`cine cine--${current.id}`}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="cine__frame">
        {/* ---- background plates -------------------------------------------- */}
        {['rays', 'glass', 'tunnel', 'bokeh'].map((p) => (
          <div
            key={p}
            className={`cine__plate cine__plate--${p}${current.plate === p ? ' is-on' : ''}`}
            aria-hidden
          >
            {/* three layers, each moved for what the plate is made of:
                base (the room), depth (haze / shards / bokeh / travel),
                and fx (rim glow, flares, caustics, dust). */}
            <span className="pl pl--base" style={{ backgroundImage: `url(/img/hero/plate-${p}.webp)` }} />
            <span className="pl pl--depth" style={{ backgroundImage: `url(/img/hero/plate-${p}.webp)` }} />
            <span className="pl pl--fx" />
          </div>
        ))}
        <div className="cine__sweep" aria-hidden />
        <div className="cine__grain" aria-hidden />
        <div className="cine__vig" aria-hidden />

        {/* ---- beat 1-3: title cards --------------------------------------- */}
        {(current.id === 'welcome' || current.id === 'built') && (
          <div className="cine__words" key={current.id}>
            {words.map((w, i) => (
              <span key={i} style={{ animationDelay: `${i * 80}ms` }}>{w}</span>
            ))}
          </div>
        )}

        {/* ---- beat 2: the real mark --------------------------------------- */}
        {current.id === 'mark' && (
          <div className="cine__mark" aria-hidden>
            <span className="cine__mark-ring" />
            <span className="cine__mark-ring cine__mark-ring--2" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/brand/kr8-mark.webp" alt="" width={260} height={260} />
            <span className="cine__mark-word">KR8<span>Digitals</span></span>
          </div>
        )}

        {/* ---- beats 4-5: the work, held up to be seen --------------------- */}
        {isCarousel && active && (
          <div className={`cine__carousel cine__carousel--${current.id}`}>
            <div className="cine__stack">
              {items.map((it, i) => {
                const off = i - slide;
                const n = items.length;
                const rel = ((off + n) % n) > n / 2 ? ((off + n) % n) - n : ((off + n) % n);
                const isActive = rel === 0;
                if (Math.abs(rel) > 1) return null;
                return (
                  <Link
                    key={it.name + i}
                    href={it.href}
                    target={it.external ? '_blank' : undefined}
                    rel={it.external ? 'noopener noreferrer' : undefined}
                    className={`cine__slide${isActive ? ' is-active' : ''}`}
                    style={{ transform: `translateX(${rel * 78}%) scale(${1 - Math.abs(rel) * 0.14}) rotateY(${rel * -22}deg)`, opacity: Math.abs(rel) > 2 ? 0 : 1 - Math.abs(rel) * 0.34, zIndex: 10 - Math.abs(rel), pointerEvents: isActive ? 'auto' : 'none' }}
                    tabIndex={isActive ? 0 : -1}
                    aria-hidden={!isActive}
                  >
                    <div className="cine__chrome">
                      <span className="cine__dot" /><span className="cine__dot" /><span className="cine__dot" />
                      <span className="cine__url">{it.kind === 'site' ? (it.href || '').replace(/^https?:\/\//, '').replace(/\/$/, '') : 'client artwork'}</span>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={isActive ? it.img : it.thumb} alt={it.name} loading={isActive ? 'eager' : 'lazy'} decoding="async" fetchPriority={isActive ? 'high' : 'low'} />
                  </Link>
                );
              })}
            </div>

            <div className="cine__caption" key={`${current.id}-${slide}`}>
              <div className="cine__caption-name">{active.name}</div>
              <div className="cine__caption-meta">{active.meta}</div>
            </div>

            <div className="cine__pips" aria-hidden>
              {items.map((_, i) => <i key={i} className={i === slide ? 'is-on' : ''} />)}
            </div>
          </div>
        )}

        {/* ---- beat 6: services, then programmes --------------------------- */}
        {current.id === 'offers' && (
          <div className="cine__offers" aria-hidden>
            <div className="cine__offer" key={offer}>
              <div className="cine__offer-kind">{OFFERS[offer].kind}</div>
              <div className="cine__offer-name">{OFFERS[offer].name}</div>
              <div className="cine__offer-line">{OFFERS[offer].line}</div>
            </div>
            <div className="cine__offer-count">
              <b>{String(offer + 1).padStart(2, '0')}</b><span>/</span>{String(OFFERS.length).padStart(2, '0')}
            </div>
          </div>
        )}

        {/* ---- beat 7: the founders ---------------------------------------- */}
        {current.id === 'founders' && (
          <div className="cine__founders">
            {FOUNDERS.map((f, i) => (
              <div className="cine__founder" key={f.name} style={{ animationDelay: `${i * 130}ms` }}>
                <div className="cine__founder-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.img} alt={`${f.name} — ${f.role}`} loading="lazy" decoding="async" />
                </div>
                <b>{f.name}</b>
                <small>{f.role}</small>
              </div>
            ))}
          </div>
        )}

        {/* ---- film furniture ---------------------------------------------- */}
        <div className="cine__bar cine__bar--top" aria-hidden />
        <div className="cine__bar cine__bar--bot" aria-hidden />
      </div>

      <div className="stage-scenes" role="tablist" aria-label="Hero chapters">
        {BEATS.map((b, i) => (
          <button
            key={b.id}
            role="tab"
            aria-selected={i === beat}
            aria-label={b.title}
            className="stage-scenes__btn"
            onClick={() => go(i)}
          >
            <span
              className="stage-scenes__fill"
              style={{ animationDuration: `${b.ms}ms`, animationPlayState: i === beat && !paused ? 'running' : 'paused' }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
