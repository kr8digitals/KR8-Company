'use client';

import { useCallback, useEffect, useState } from 'react';
import { track } from '@/lib/track';

export type Kr8Theme = 'dark' | 'light';

const STORAGE_KEY = 'kr8_theme';
const EVENT_NAME = 'kr8-theme-change';

export function readCurrentTheme(): Kr8Theme {
  if (typeof document === 'undefined') return 'dark';
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') return attr;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light') return 'light';
  } catch {
    /* ignore */
  }
  return 'dark';
}

export function applyKr8Theme(next: Kr8Theme, animate = true) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (animate) {
    root.classList.add('theme-transitioning');
    window.setTimeout(() => root.classList.remove('theme-transitioning'), 300);
  }
  root.setAttribute('data-theme', next);
  root.style.colorScheme = next;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', next === 'light' ? '#faf8fc' : '#0a0614');
  }

  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }

  window.dispatchEvent(new CustomEvent<Kr8Theme>(EVENT_NAME, { detail: next }));
}

export default function ThemeToggle({
  variant = 'pill',
  className = '',
}: {
  variant?: 'pill' | 'icon' | 'segmented';
  className?: string;
}) {
  const [theme, setTheme] = useState<Kr8Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(readCurrentTheme());
    setMounted(true);

    const onSync = (e: Event) => {
      const custom = e as CustomEvent<Kr8Theme>;
      if (custom.detail === 'light' || custom.detail === 'dark') {
        setTheme(custom.detail);
      } else {
        setTheme(readCurrentTheme());
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const next: Kr8Theme = e.newValue === 'light' ? 'light' : 'dark';
        applyKr8Theme(next, false);
        setTheme(next);
      }
    };

    window.addEventListener(EVENT_NAME, onSync);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(EVENT_NAME, onSync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const choose = useCallback((next: Kr8Theme) => {
    setTheme(next);
    applyKr8Theme(next, true);
    track('theme_switch', { theme: next });
  }, []);

  const toggle = useCallback(() => {
    choose(theme === 'dark' ? 'light' : 'dark');
  }, [theme, choose]);

  const isLight = mounted && theme === 'light';

  if (variant === 'segmented') {
    return (
      <div
        className={`kr8-theme-seg ${className}`.trim()}
        role="group"
        aria-label="Color theme"
      >
        <button
          type="button"
          className={`kr8-theme-seg__btn${!isLight ? ' is-active' : ''}`}
          aria-pressed={!isLight}
          onClick={() => choose('dark')}
        >
          <MoonIcon />
          <span>Dark</span>
        </button>
        <button
          type="button"
          className={`kr8-theme-seg__btn${isLight ? ' is-active' : ''}`}
          aria-pressed={isLight}
          onClick={() => choose('light')}
        >
          <SunIcon />
          <span>Light</span>
        </button>
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggle}
        className={`kr8-theme-btn kr8-theme-btn--icon ${className}`.trim()}
        aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
        title={isLight ? 'Switch to Dark mode' : 'Switch to Light mode'}
      >
        <span className="kr8-theme-btn__glyph" aria-hidden>
          {isLight ? <MoonIcon /> : <SunIcon />}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`kr8-theme-btn ${className}`.trim()}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      title={isLight ? 'Switch to Dark mode' : 'Switch to Light mode'}
    >
      <span className="kr8-theme-btn__track" aria-hidden>
        <span className={`kr8-theme-btn__thumb${isLight ? ' is-light' : ''}`}>
          {isLight ? <SunIcon /> : <MoonIcon />}
        </span>
      </span>
      <span className="kr8-theme-btn__label">{isLight ? 'Light' : 'Dark'}</span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2.4M12 19.6V22M4.93 4.93l1.7 1.7M17.37 17.37l1.7 1.7M2 12h2.4M19.6 12H22M4.93 19.07l1.7-1.7M17.37 6.63l1.7-1.7" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="13.5" height="13.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7.1 7.1 0 0 0 9.8 9.8z" />
    </svg>
  );
}
