'use client';

import { useEffect, useRef, useState } from 'react';
import { track } from '@/lib/track';
import { CURRENCY_META, convert, formatMoney, type Rates } from '@/lib/rates';

/* ------------------------------------------------------------------ ICONS --- */
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
export function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true as const };
  switch (name) {
    case 'monitor': return <svg {...p} {...S}><rect x="2.5" y="4" width="19" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg>;
    case 'palette': return <svg {...p} {...S}><path d="M12 3a9 9 0 100 18h1.5a2 2 0 001.7-3l-.4-.7a1.6 1.6 0 011.3-2.4H19a3 3 0 003-3A9 9 0 0012 3z" /><circle cx="7.5" cy="10.5" r="1" fill="currentColor" /><circle cx="12" cy="7.5" r="1" fill="currentColor" /><circle cx="16.5" cy="10" r="1" fill="currentColor" /></svg>;
    case 'film': return <svg {...p} {...S}><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="M7 4.5v15M17 4.5v15M2.5 9.5h4.5M2.5 14.5h4.5M17 9.5h4.5M17 14.5h4.5" /></svg>;
    case 'cpu': return <svg {...p} {...S}><rect x="6.5" y="6.5" width="11" height="11" rx="2" /><rect x="10" y="10" width="4" height="4" rx=".6" /><path d="M10 3v3.5M14 3v3.5M10 17.5V21M14 17.5V21M3 10h3.5M3 14h3.5M17.5 10H21M17.5 14H21" /></svg>;
    case 'search': return <svg {...p} {...S}><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>;
    case 'layers': return <svg {...p} {...S}><path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z" /><path d="M3 12l9 4.5 9-4.5" /><path d="M3 16.5L12 21l9-4.5" /></svg>;
    case 'spark': return <svg {...p} {...S}><path d="M12 2.5l2.2 6.3 6.3 2.2-6.3 2.2L12 19.5l-2.2-6.3-6.3-2.2 6.3-2.2L12 2.5z" /><path d="M19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16z" /></svg>;
    case 'users': return <svg {...p} {...S}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 19.5a6.5 6.5 0 0113 0" /><circle cx="17" cy="9" r="2.5" /><path d="M16.5 14.2a5 5 0 015 5.3" /></svg>;
    case 'award': return <svg {...p} {...S}><circle cx="12" cy="9" r="5.5" /><path d="M8.8 13.5L7.5 21l4.5-2.4L16.5 21l-1.3-7.5" /></svg>;
    case 'compass': return <svg {...p} {...S}><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" /></svg>;
    case 'check': return <svg {...p} {...S} strokeWidth={2}><path d="M4 12.5l5 5L20 6.5" /></svg>;
    case 'arrow': return <svg {...p} {...S}><path d="M4 12h15M13 6l6 6-6 6" /></svg>;
    case 'wa': return <svg {...p} viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm0 1.9a8.1 8.1 0 11-4.2 15l-.5-.3-3 .8.8-2.9-.3-.5A8.1 8.1 0 0112 3.9zm-3.1 4c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 3 4.5 4.1 2.2.9 2.7.7 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 01-3.3-2.9c-.1-.2 0-.3.1-.5l.5-.6c.1-.2.2-.3.3-.5v-.5l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.4z" /></svg>;
    default: return null;
  }
}

/* ---------------------------------------------------------------- COUNTER --- */
export function Counter({ value, suffix = '', duration = 1500 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') { setN(value); return; }
    const io = new IntersectionObserver((ents) => {
      if (!ents[0].isIntersecting || done.current) return;
      done.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setN(Math.round(value * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{formatMoney(n)}{suffix}</span>;
}

/* --------------------------------------------------------------- CURRENCY --- */
type Cur = { code: string; rates: Rates; setCode: (c: string) => void; ready: boolean };

let ratesPromise: Promise<{ rates: Rates; suggested: string }> | null = null;
function loadRates() {
  if (!ratesPromise) {
    ratesPromise = fetch('/api/rates')
      .then((r) => r.json())
      .catch(() => ({ rates: { USD: 1, NGN: 1550 } as Rates, suggested: 'USD' }));
  }
  return ratesPromise;
}

export function useCurrency(): Cur {
  const [code, setCode] = useState('USD');
  const [rates, setRates] = useState<Rates>({ USD: 1 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    loadRates().then((d) => {
      if (!alive) return;
      setRates(d.rates || { USD: 1 });
      let saved: string | null = null;
      try { saved = localStorage.getItem('kr8.currency'); } catch { /* noop */ }
      const initial = saved && d.rates?.[saved] ? saved : d.suggested && d.rates?.[d.suggested] ? d.suggested : 'USD';
      setCode(initial);
      setReady(true);
    });
    return () => { alive = false; };
  }, []);

  const chooser = (c: string) => {
    setCode(c);
    try { localStorage.setItem('kr8.currency', c); } catch { /* noop */ }
    track('currency_change', { to: c });
  };

  return { code, rates, setCode: chooser, ready };
}

export function CurrencyPicker({ code, setCode }: { code: string; setCode: (c: string) => void }) {
  return (
    <span className="pill" style={{ cursor: 'pointer', padding: 0, border: '1px solid var(--hair)' }} title="Show prices in your currency">
      <select
        aria-label={`Display currency: ${code}`}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ background: 'transparent', border: 0, padding: '8px 12px', fontSize: 12, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'inherit', cursor: 'pointer' }}
      >
        {Object.keys(CURRENCY_META).map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </span>
  );
}

export function Price({ usd, code, rates, showUsd = true }: { usd: number; code: string; rates: Rates; showUsd?: boolean }) {
  const local = convert(usd, code, rates);
  const isUsd = code === 'USD';
  return (
    <div>
      <div className="price-amount">
        {local.symbol}{formatMoney(local.value)}
        {!isUsd && <small style={{ marginLeft: 8 }}>{code}</small>}
      </div>
      {!isUsd && showUsd && (
        <div className="price-local">≈ ${formatMoney(usd)} USD · rate updates automatically</div>
      )}
      {isUsd && <div className="price-local" aria-hidden>&nbsp;</div>}
    </div>
  );
}

/* -------------------------------------------------------------- WORK RAIL --- */
export function WorkRail({ items }: { items: { name: string; category: string; shot: string; href?: string; meta?: string }[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="work-rail">
      <div className="work-track">
        {doubled.map((w, i) => (
          <a
            key={`${w.name}-${i}`}
            className="work-card"
            href={w.href || '#'}
            target={w.href ? '_blank' : undefined}
            rel={w.href ? 'noopener noreferrer' : undefined}
            onClick={() => w.href && track('work_preview_click', { name: w.name })}
            tabIndex={i < items.length ? 0 : -1}
            aria-hidden={i >= items.length}
          >
            <div className="work-card__shot">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={w.shot} alt={`${w.name} — a site built by KR8 Digitals`} loading="lazy" decoding="async" />
            </div>
            <div className="work-card__body">
              <div className="work-card__cat">{w.category}</div>
              <div className="work-card__name">{w.name}</div>
              {w.meta && <div className="work-card__meta">{w.meta}</div>}
            </div>
          </a>
        ))}
      </div>
      <div className="fade-l" aria-hidden /><div className="fade-r" aria-hidden />
    </div>
  );
}

/* ------------------------------------------------------------------ MISC --- */
export function WhatsAppLink({ number, text, label = 'Chat on WhatsApp' }: { number: string; text: string; label?: string }) {
  return (
    <a
      className="wa-alt"
      href={`https://wa.me/${number}?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('whatsapp_click', { text })}
    >
      <Icon name="wa" size={17} />
      {label}
    </a>
  );
}
