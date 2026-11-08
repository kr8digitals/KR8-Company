'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import nav from '../../data/site.json';
import { track } from '@/lib/track';
import type { CmsNavConfig } from '@/lib/cms';

const eco = nav.ecosystem;

export default function Header({ navConfig }: { navConfig?: CmsNavConfig }) {
  const pathname = usePathname() || '/';
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [ecoOpen, setEcoOpen] = useState(false);
  const ecoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const links = navConfig?.headerLinks
    ? [...navConfig.headerLinks]
        .filter((l) => l.visible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    : nav.nav;

  const ctaLabel = navConfig?.ctaLabel || 'Work with us';
  const ctaHref = navConfig?.ctaHref || '/contact';

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
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ecoRef.current && !ecoRef.current.contains(e.target as Node)) setEcoOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEcoOpen(false);
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="scroll-progress" ref={barRef} aria-hidden />
        <nav className="nav" aria-label="Primary">
          <Link href="/" className="logo">
            <span className="logo__type">
              KR8<span className="g" style={{ marginLeft: 7 }}>Digitals</span>
            </span>
            <span className="sr-only"> — home</span>
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
                onClick={() => {
                  setEcoOpen((v) => !v);
                  if (!ecoOpen) track('eco_switcher_open');
                }}
              >
                KR8 network
                <svg width="10" height="7" viewBox="0 0 10 7" aria-hidden>
                  <path
                    d="M1 1l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <div className={`eco__menu${ecoOpen ? ' is-open' : ''}`} role="menu">
                <Link className="eco__item eco__item--parent" href="/" role="menuitem">
                  <span>
                    <b>KR8 Digitals</b>
                    <span>The company · you are here</span>
                  </span>
                </Link>
                <div className="eco__sep" />
                <a
                  className="eco__item"
                  href={eco.academy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={() => track('outbound_click', { href: 'academy', label: 'eco_switcher' })}
                >
                  <span>
                    <b>KR8 Academy</b>
                    <span>the school of KR8 Digitals</span>
                  </span>
                  <span className="eco__tag">Live ↗</span>
                </a>
                <Link
                  className="eco__item"
                  href="/tribe"
                  role="menuitem"
                  onClick={() => track('outbound_click', { href: 'tribe', label: 'eco_switcher' })}
                >
                  <span>
                    <b>KR8 DIGITALS TRIBE</b>
                    <span>the creative &amp; builder community</span>
                  </span>
                  <span className="eco__tag">Join →</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="nav-right">
            <Link
              href={ctaHref}
              className="btn-nav"
              onClick={() => track('cta_click', { label: 'get_a_quote', where: 'header' })}
            >
              {ctaLabel}
            </Link>
          </div>

          <button
            className={`burger${open ? ' is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="burger-lines">
              <span />
              <span />
              <span />
            </span>
          </button>
        </nav>
      </header>

      <div className={`sheet${open ? ' is-open' : ''}`} aria-hidden={!open}>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="sheet__link"
            aria-current={isActive(l.href) ? 'page' : undefined}
            tabIndex={open ? 0 : -1}
          >
            <span>{l.label}</span>
            <span style={{ opacity: 0.45, fontSize: 13 }}>→</span>
          </Link>
        ))}

        <div className="sheet__eco" style={{ marginTop: 14 }}>
          <div className="sheet__eco-lbl">KR8 Ecosystem &amp; Free Opportunities</div>
          <div className="sheet__quick-grid">
            <a
              href={eco.academy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="sheet__quick-tile"
              tabIndex={open ? 0 : -1}
            >
              <b>KR8 Academy ↗</b>
              <span>7 Free Skill Tracks</span>
            </a>
            <Link href="/tribe" className="sheet__quick-tile" tabIndex={open ? 0 : -1}>
              <b>KR8 Tribe →</b>
              <span>3,000+ Creators</span>
            </Link>
            <Link href="/programs/mindset-shift/invite" className="sheet__quick-tile" tabIndex={open ? 0 : -1}>
              <b>Mindset Shift →</b>
              <span>Free Live Forum</span>
            </Link>
            <Link href="/about/join-the-team" className="sheet__quick-tile" tabIndex={open ? 0 : -1}>
              <b>Join the Team →</b>
              <span>Merit Studio Path</span>
            </Link>
          </div>
        </div>

        <div className="sheet__cta-row">
          <Link
            href={ctaHref}
            className="btn-primary"
            style={{ justifyContent: 'center' }}
            tabIndex={open ? 0 : -1}
          >
            {ctaLabel}
          </Link>
          <a
            href={`https://wa.me/${nav.company.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ justifyContent: 'center' }}
            tabIndex={open ? 0 : -1}
          >
            WhatsApp ↗
          </a>
        </div>
      </div>
    </>
  );
}
