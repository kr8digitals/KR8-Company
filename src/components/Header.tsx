'use client';
import { formatEditableText } from '@/lib/content-format';
import { useEditableContent } from '@/components/EditableContentProvider';
import { usePublicContent } from '@/components/PublicContentProvider';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import nav from '../../data/site.json';
import { track } from '@/lib/track';
import type { CmsNavConfig } from '@/lib/cms';
import ThemeToggle from './ThemeToggle';

const eco = nav.ecosystem;

export default function Header({ navConfig }: { navConfig?: CmsNavConfig }) {
  const editableContent = useEditableContent("components:Header");


  const publicData = usePublicContent();
  const nav = publicData.site;
  const eco = nav.ecosystem;

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
        <nav className="nav" aria-label={editableContent.texts.field_efe10c80ec}>
          <Link href="/" className="logo">
            <span className="logo__type">
              {editableContent.texts.text_be3b4e8ce7}<span className="g" style={{ marginLeft: 7 }}>{editableContent.texts.text_0381a64b55}</span>
            </span>
            <span className="sr-only"> {editableContent.texts.text_7dc3a67c4a}</span>
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
                {editableContent.texts.text_784aec5812}<svg width="10" height="7" viewBox="0 0 10 7" aria-hidden>
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
                    <b>{editableContent.texts.text_a2c7490db5}</b>
                    <span>{editableContent.texts.text_c29ebcdd4b}</span>
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
                    <b>{editableContent.texts.text_ca538eaf54}</b>
                    <span>{editableContent.texts.text_8fa3d0488a}</span>
                  </span>
                  <span className="eco__tag">{editableContent.texts.text_05bed7c2df}</span>
                </a>
                <Link
                  className="eco__item"
                  href={editableContent.texts.field_3df0ed1318}
                  role="menuitem"
                  onClick={() => track('outbound_click', { href: 'tribe', label: 'eco_switcher' })}
                >
                  <span>
                    <b>{editableContent.texts.text_5c09b75136}</b>
                    <span>{editableContent.texts.text_d1c8f5f1b7}</span>
                  </span>
                  <span className="eco__tag">{editableContent.texts.text_cad1f8a29b}</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="nav-right">
            <ThemeToggle variant="pill" />
            <Link
              href={ctaHref}
              className="btn-nav"
              onClick={() => track('cta_click', { label: 'get_a_quote', where: 'header' })}
            >
              {ctaLabel}
            </Link>
          </div>

          <div className="nav-mob-actions">
            <ThemeToggle variant="icon" />
            <button
              className={`burger${open ? ' is-open' : ''}`}
              aria-label={open ? editableContent.texts.copy_6ccd5c7856 : editableContent.texts.copy_b40b3713b4}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="burger-lines">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
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
          <div className="sheet__eco-lbl">{editableContent.texts.text_8925a79f6c}</div>
          <div className="sheet__quick-grid">
            <a
              href={eco.academy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="sheet__quick-tile"
              tabIndex={open ? 0 : -1}
            >
              <b>{editableContent.texts.text_2e3c6f63d0}</b>
              <span>{editableContent.texts.text_3719a15571}</span>
            </a>
            <Link href={editableContent.texts.field_3df0ed1318} className="sheet__quick-tile" tabIndex={open ? 0 : -1}>
              <b>{editableContent.texts.text_50b2c9d800}</b>
              <span>{editableContent.texts.text_9ee465e241}</span>
            </Link>
            <Link href={editableContent.texts.field_83281429bb} className="sheet__quick-tile" tabIndex={open ? 0 : -1}>
              <b>{editableContent.texts.text_bef7597d8d}</b>
              <span>{editableContent.texts.text_8a5a1c71f2}</span>
            </Link>
            <Link href={editableContent.texts.field_78c2a55cd4} className="sheet__quick-tile" tabIndex={open ? 0 : -1}>
              <b>{editableContent.texts.text_c52693fc51}</b>
              <span>{editableContent.texts.text_5f1984bef9}</span>
            </Link>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            padding: '10px 12px',
            borderRadius: 12,
            border: '1px solid var(--border-subtle)',
            background: 'var(--surface-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t-strong)' }}>{editableContent.texts.text_3907fa7f80}</div>
            <div style={{ fontSize: 10.5, color: 'var(--t-sub)', marginTop: 1 }}>
              {editableContent.texts.text_874a64168b}</div>
          </div>
          <ThemeToggle variant="segmented" />
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
            href={formatEditableText("https://wa.me/{0}", [nav.company.whatsapp])}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ justifyContent: 'center' }}
            tabIndex={open ? 0 : -1}
          >
            {editableContent.texts.text_4206ac3f16}</a>
        </div>
      </div>
    </>
  );
}
