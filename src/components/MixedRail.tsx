'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import sitesData from '../../data/sites.json';

type Item =
  | { kind: 'site'; name: string; cat: string; shot: string; url: string; note: string }
  | { kind: 'flyer'; name: string; cat: string; shot: string; full: string; note: string }
  | { kind: 'video'; name: string; cat: string; shot: string; src: string; note: string };

export default function MixedRail() {
  const [open, setOpen] = useState<Item | null>(null);

  const items: Item[] = useMemo(() => {
    const s = sitesData.sites;
    const pick = (slug: string) => s.find((x) => x.slug === slug)!;
    const f = sitesData.flyers;
    const v = sitesData.videos;
    return [
      { kind: 'site', name: pick('cirenes').name, cat: 'Website', shot: pick('cirenes').card, url: pick('cirenes').url, note: 'Live site · open in a new tab' },
      { kind: 'flyer', name: f[0].title, cat: 'Flyer', shot: f[0].card, full: f[0].full, note: 'View full size' },
      { kind: 'site', name: pick('afristem').name, cat: 'Website', shot: pick('afristem').card, url: pick('afristem').url, note: 'Live client site · new tab' },
      { kind: 'video', name: 'Student story', cat: 'Video', shot: v[0].poster, src: v[0].src, note: 'Plays here' },
      { kind: 'site', name: pick('salt-lake').name, cat: 'Website', shot: pick('salt-lake').card, url: pick('salt-lake').url, note: 'Live site · open in a new tab' },
      { kind: 'flyer', name: f[1].title, cat: 'Flyer', shot: f[1].card, full: f[1].full, note: 'View full size' },
      { kind: 'site', name: pick('vegas').name, cat: 'Website', shot: pick('vegas').card, url: pick('vegas').url, note: 'For sale · open in a new tab' },
      { kind: 'video', name: 'Student story', cat: 'Video', shot: v[2].poster, src: v[2].src, note: 'Plays here' },
      { kind: 'site', name: pick('mcgettrick').name, cat: 'Website', shot: pick('mcgettrick').card, url: pick('mcgettrick').url, note: 'Live client site · new tab' },
      { kind: 'flyer', name: f[2].title, cat: 'Flyer', shot: f[2].card, full: f[2].full, note: 'View full size' },
    ];
  }, []);

  const closeRef = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open]);

  const card = (it: Item, key: string) => {
    const inner = (
      <>
        <div className={`mrail__shot ${it.kind !== 'site' ? 'mrail__shot--portrait' : ''}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={it.shot} alt={it.kind === 'site' ? `${it.name} website` : `${it.name} — ${it.cat.toLowerCase()}`} loading="lazy" decoding="async" />
        </div>
        <div className="mrail__body">
          <span className="mrail__kind">{it.cat}</span>
          <b>{it.name}</b>
          <span>{it.note}</span>
        </div>
      </>
    );

    if (it.kind === 'site') {
      return (
        <div className="mrail__item" key={key}>
          <a className="mrail__card" href={it.url} target="_blank" rel="noopener noreferrer">{inner}</a>
        </div>
      );
    }
    return (
      <div className="mrail__item" key={key}>
        <button className="mrail__card" onClick={() => setOpen(it)}>{inner}</button>
      </div>
    );
  };

  return (
    <div className="mrail">
      <div className="mrail__track">
        {items.map((it, i) => card(it, `a${i}`))}
        {items.map((it, i) => card(it, `b${i}`))}
      </div>

      {open && (
        <div className="lb" role="dialog" aria-modal="true" aria-label="Preview" onClick={close}>
          <div className="lb__panel" onClick={(e) => e.stopPropagation()}>
            <button className="lb__close" onClick={close} ref={closeRef} aria-label="Close preview">✕</button>
            <div className={`lb__media ${open.kind === 'flyer' ? 'lb__media--poster' : open.kind === 'video' ? 'lb__media--video' : ''}`}>
              {open.kind === 'flyer' && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={open.full} alt={`${open.name} — full size`} />
              )}
              {open.kind === 'video' && (
                <video src={open.src} controls playsInline preload="none" poster={open.shot} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }} />
              )}
            </div>
            <div className="lb__body">
              <div className="gal-card__top"><span className="tag">{open.cat}</span></div>
              <h3>{open.name}</h3>
              <p>{open.note}</p>
              {open.kind === 'flyer' && <div className="gal-card__credit">KR8 Digitals in association with Motionverse</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
