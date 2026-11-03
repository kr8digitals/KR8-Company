'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import services from '../../data/services.json';
import programmes from '../../data/programmes.json';
import type { HeroMode } from './Hero3D';

const Hero3D = dynamic(() => import('./Hero3D'), {
  ssr: false,
  loading: () => (
    <div className="stage-wrap">
      <div className="stage-glow" aria-hidden />
      <div className="stage-fallback">
        <div className="skel" style={{ width: 240, height: 240, borderRadius: '50%' }} />
      </div>
    </div>
  ),
});

/* ------------------------------------------------------------------ beats ---
 * The hero runs itself. Each beat owns the stage for a set number of seconds,
 * then hands over. Nothing waits to be clicked, and the chapter dots below let
 * anyone jump — the sequence pauses while a pointer or a keyboard is on it.
 */
type Beat = {
  id: string;
  kind: 'text' | 'logo' | 'sites' | 'brand' | 'services' | 'people';
  mode: HeroMode;
  ms: number;
  title: string;
  sub: string;
  href: string;
  cta: string;
};

const BEATS: Beat[] = [
  { id: 'welcome', kind: 'text', mode: 'idle', ms: 3000,
    title: 'Welcome to KR8 Digitals', sub: '', href: '/about', cta: 'Who we are' },
  { id: 'mark', kind: 'logo', mode: 'idle', ms: 2800,
    title: '', sub: '', href: '/about', cta: 'Who we are' },
  { id: 'built', kind: 'text', mode: 'idle', ms: 3000,
    title: "See what we've built for clients", sub: '', href: '/services', cta: 'All the work' },
  { id: 'sites', kind: 'sites', mode: 'sites', ms: 11000,
    title: 'Sites we designed, built and deployed', sub: 'Every one of them is live — this is the work, not a mock-up', href: '/services/website-design#portfolio', cta: 'See the portfolio' },
  { id: 'brand', kind: 'brand', mode: 'brand', ms: 8000,
    title: 'Flyers, identity and design for named clients', sub: 'KR8 Digitals in association with Motion Verse', href: '/services/brand-graphic-design', cta: 'See the design work' },
  { id: 'services', kind: 'services', mode: 'idle', ms: 14400,
    title: 'What should we do for you?', sub: 'Services one at a time, then the programmes', href: '/services', cta: 'All services' },
  { id: 'founders', kind: 'people', mode: 'people', ms: 8000,
    title: 'Meet the founders', sub: 'Three practitioners. One company.', href: '/about', cta: 'Read about them' },
];

const OFFERS = [
  ...services.map((s) => ({ kind: 'Service', name: s.name, line: s.tagline, href: `/services/${s.slug}` })),
  ...programmes.programmes.map((p: { slug: string; name: string; lede?: string }) => ({
    kind: 'Programme', name: p.name, line: p.lede || '', href: '/programs',
  })),
];

const OFFER_MS = 1600;

export default function HeroShow() {
  const [beat, setBeat] = useState(0);
  const [paused, setPaused] = useState(false);
  const [offer, setOffer] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const offerTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = BEATS[beat];

  const go = useCallback((i: number) => {
    setBeat(((i % BEATS.length) + BEATS.length) % BEATS.length);
  }, []);

  // the beat clock
  useEffect(() => {
    if (paused) return;
    timer.current = setTimeout(() => go(beat + 1), current.ms);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [beat, paused, current.ms, go]);

  // offers tick one at a time inside the services beat
  useEffect(() => {
    if (current.kind !== 'services') { setOffer(0); return; }
    if (paused) return;
    const start = Date.now();
    offerTimer.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setOffer(Math.floor(elapsed / OFFER_MS) % OFFERS.length);
    }, 200);
    return () => { if (offerTimer.current) clearInterval(offerTimer.current); };
  }, [current.kind, paused, beat]);

  // keep short phrases together so a line never breaks in the middle of a name
  const words = useMemo(() => {
    const t = current.title;
    if (t.startsWith('Welcome')) return ['Welcome', 'to', 'KR8\u00A0Digitals'];
    if (t.startsWith('See what')) return ['See', 'what', "we've", 'built', 'for', 'clients'];
    return t.split(' ');
  }, [current.title]);
  const o = OFFERS[offer];

  return (
    <div
      className={`hero-show hero-show--${current.kind}`}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="hero-show__stage">
        <Hero3D mode={current.mode} />

        {/* ---- title cards ------------------------------------------------- */}
        {(current.kind === 'text' || current.kind === 'logo') && (
          <div className="hs-card" aria-hidden>
            {current.kind === 'logo' ? (
              <div className="hs-mark">
                <span className="hs-mark__halo" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/brand/kr8-mark.webp" alt="" width={220} height={220} className="hs-mark__img" />
                <span className="hs-mark__word">KR8<span>Digitals</span></span>
              </div>
            ) : (
              <div className="hs-words">
                {words.map((w, i) => (
                  <span key={`${current.id}-${i}`} style={{ animationDelay: `${i * 90}ms` }}>{w}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---- services + programmes, one at a time ------------------------ */}
        {current.kind === 'services' && (
          <div className="hs-offers" aria-hidden>
            <div className="hs-offers__rail">
              {OFFERS.map((x, i) => (
                <Link
                  key={x.kind + x.name}
                  href={x.href}
                  tabIndex={-1}
                  aria-hidden={i !== offer}
                  className={`hs-offer${i === offer ? ' is-on' : ''}${Math.abs(i - offer) > 1 ? ' is-far' : ''}`}
                  style={{ transform: `translateY(${(i - offer) * 52}px)` }}
                >
                  <span className="hs-offer__kind">{x.kind}</span>
                  <span className="hs-offer__name">{x.name}</span>
                  <span className="hs-offer__line">{x.line}</span>
                </Link>
              ))}
            </div>
            <div className="hs-offers__now">
              <span className="hs-offers__count">{String(offer + 1).padStart(2, '0')}<i>/</i>{String(OFFERS.length).padStart(2, '0')}</span>
            </div>
          </div>
        )}

        {/* ---- founders ---------------------------------------------------- */}
        {current.kind === 'people' && (
          <div className="hs-names" aria-hidden>
            {['Timfire', 'Stevenson', 'Daniel'].map((n, i) => (
              <span key={n} style={{ animationDelay: `${300 + i * 160}ms` }}>{n}</span>
            ))}
          </div>
        )}
      </div>

      {/* ---- caption: the same furniture the hero always had -------------- */}
      <div className="hero-show__cap">
        <div className="hero-show__text">
          <div className="hero-show__title">{current.kind === 'logo' ? 'KR8 Digitals' : current.title || o?.name}</div>
          <div className="hero-show__sub">
            {current.kind === 'logo' ? 'A creative company' : current.kind === 'services' ? `${o?.kind} · ${o?.line}` : current.sub}
          </div>
        </div>
        <Link href={current.kind === 'services' ? o?.href || '/services' : current.href} className="btn-link hero-show__cta">
          {current.kind === 'services' ? `Open ${o?.name}` : current.cta} <span aria-hidden style={{ marginLeft: 6 }}>→</span>
        </Link>
      </div>

      <div className="stage-scenes" role="tablist" aria-label="Hero chapters">
        {BEATS.map((b, i) => (
          <button
            key={b.id}
            role="tab"
            aria-selected={i === beat}
            aria-label={b.title || 'The KR8 mark'}
            onClick={() => go(i)}
            className="stage-scenes__btn"
          >
            <span className="stage-scenes__fill" style={{ animationDuration: `${b.ms}ms`, animationPlayState: i === beat && !paused ? 'running' : 'paused' }} />
          </button>
        ))}
      </div>
    </div>
  );
}
