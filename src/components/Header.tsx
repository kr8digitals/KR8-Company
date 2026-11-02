'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import nav from '../../data/site.json';
import { track } from '@/lib/track';

const links = nav.nav;
const eco = nav.ecosystem;

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [ecoOpen, setEcoOpen] = useState(false);
  const ecoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, window.scrollY / h) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setEcoOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ecoRef.current && !ecoRef.current.contains(e.target as Node)) setEcoOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setEcoOpen(false); setOpen(false); }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="scroll-progress" ref={barRef} aria-hidden />
        <nav className="nav" aria-label="Primary">
          <Link href="/" className="logo">
            KR8<span className="g">Digitals</span><span className="sr-only"> — home</span>
          </Link>

          <div className="nav-links">
            {links.map((l) => (
              <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? 'page' : undefined}>
                {l.label}
              </Link>
            ))}
            <div className="eco" ref={ecoRef}>
              <button
                className="eco__btn"
                aria-expanded={ecoOpen}
                aria-haspopup="true"
                onClick={() => { setEcoOpen((v) => !v); if (!ecoOpen) track('eco_switcher_open'); }}
              >
                KR8 network
                <svg width="10" height="7" viewBox="0 0 10 7" aria-hidden><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
              </button>
              <div className={`eco__menu${ecoOpen ? ' is-open' : ''}`} role="menu">
                <Link className="eco__item eco__item--parent" href="/" role="menuitem">
                  <span><b>KR8 Digitals</b><span>The company · you are here</span></span>
                </Link>
                <div className="eco__sep" />
                <a className="eco__item" href={eco.academy.url} target="_blank" rel="noopener noreferrer" role="menuitem"
                   onClick={() => track('outbound_click', { href: 'academy', label: 'eco_switcher' })}>
                  <span><b>KR8 Academy</b><span>a KR8 Digitals school</span></span>
                  <span className="eco__tag">Live ↗</span>
                </a>
                <a className="eco__item" href={eco.tribe.status === 'live' ? eco.tribe.url : '/tribe'}
                   target={eco.tribe.status === 'live' ? '_blank' : undefined}
                   rel={eco.tribe.status === 'live' ? 'noopener noreferrer' : undefined} role="menuitem"
                   onClick={() => track('outbound_click', { href: 'tribe', label: 'eco_switcher' })}>
                  <span><b>The Tribe</b><span>{eco.tribe.status === 'live' ? 'the KR8 Digitals community' : 'opening soon — join the list'}</span></span>
                  <span className="eco__tag">{eco.tribe.status === 'live' ? 'Live ↗' : 'Soon'}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="nav-right">
            <Link href="/contact" className="btn-nav" onClick={() => track('cta_click', { label: 'get_a_quote', where: 'header' })}>
              Get a quote
            </Link>
          </div>

          <button
            className={`burger${open ? ' is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="burger-lines"><span /><span /><span /></span>
          </button>
        </nav>
      </header>

      <div className={`sheet${open ? ' is-open' : ''}`} aria-hidden={!open}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="sheet__link" tabIndex={open ? 0 : -1}>
            {l.label}
          </Link>
        ))}
        <div className="sheet__eco">
          <div className="sheet__eco-lbl">KR8 network</div>
          <a href={eco.academy.url} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
            <span>KR8 Academy <span style={{ opacity: 0.55, fontSize: 12 }}>· a KR8 Digitals school</span></span>
            <span className="eco__tag">Live ↗</span>
          </a>
          <a href={eco.tribe.status === 'live' ? eco.tribe.url : '/tribe'} tabIndex={open ? 0 : -1}>
            <span>The Tribe</span>
            <span className="eco__tag">{eco.tribe.status === 'live' ? 'Live ↗' : 'Soon'}</span>
          </a>
        </div>
        <Link href="/contact" className="btn-primary" style={{ marginTop: 22, justifyContent: 'center' }} tabIndex={open ? 0 : -1}>
          Get a quote
        </Link>
      </div>
    </>
  );
}
