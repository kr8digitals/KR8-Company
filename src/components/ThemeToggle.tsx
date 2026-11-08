'use client';

import { useCallback, useEffect, useState } from 'react';
import { track } from '@/lib/track';

export type Kr8Theme = 'light' | 'dark';
export type Kr8ThemePref = 'auto' | 'light' | 'dark';

const PREF_KEY = 'kr8_theme_pref';
const RESOLVED_KEY = 'kr8_theme';
const EVENT_NAME = 'kr8-theme-change';

type ThemeStateDetail = {
  theme: Kr8Theme;
  pref: Kr8ThemePref;
};

/**
 * Resolves the visitor's default theme from their local timezone clock:
 * - Daytime (06:00 – 17:59 local time) -> 'light'
 * - Nighttime (18:00 – 05:59 local time) -> 'dark'
 */
export function resolveTimezoneTheme(now: Date = new Date()): Kr8Theme {
  const hour = now.getHours();
  return hour >= 6 && hour < 18 ? 'light' : 'dark';
}

export function getVisitorTimezoneLabel(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return 'Local time';
    const city = tz.split('/').pop()?.replace(/_/g, ' ');
    return city || tz;
  } catch {
    return 'Local time';
  }
}

export function readThemeState(): ThemeStateDetail {
  if (typeof document === 'undefined') {
    return { theme: 'light', pref: 'auto' };
  }
  let pref: Kr8ThemePref = 'auto';
  try {
    const stored = localStorage.getItem(PREF_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'auto') {
      pref = stored;
    }
  } catch {
    /* ignore storage errors */
  }

  const theme: Kr8Theme = pref === 'auto' ? resolveTimezoneTheme() : pref;
  return { theme, pref };
}

export function applyKr8ThemePreference(pref: Kr8ThemePref, animate = true): ThemeStateDetail {
  const theme: Kr8Theme = pref === 'auto' ? resolveTimezoneTheme() : pref;

  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    if (animate) {
      root.classList.add('theme-transitioning');
      window.setTimeout(() => root.classList.remove('theme-transitioning'), 300);
    }
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-theme-mode', pref);
    root.style.colorScheme = theme;

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'light' ? '#f6f2fb' : '#0a0614');
    }

    try {
      localStorage.setItem(PREF_KEY, pref);
      localStorage.setItem(RESOLVED_KEY, theme);
    } catch {
      /* ignore */
    }

    window.dispatchEvent(
      new CustomEvent<ThemeStateDetail>(EVENT_NAME, { detail: { theme, pref } })
    );
  }

  return { theme, pref };
}

export default function ThemeToggle({
  variant = 'pill',
  className = '',
}: {
  variant?: 'pill' | 'icon' | 'segmented';
  className?: string;
}) {
  const [state, setState] = useState<ThemeStateDetail>({ theme: 'light', pref: 'auto' });
  const [tzLabel, setTzLabel] = useState<string>('Local time');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = readThemeState();
    // Ensure DOM matches resolved preference immediately
    document.documentElement.setAttribute('data-theme', current.theme);
    document.documentElement.setAttribute('data-theme-mode', current.pref);
    document.documentElement.style.colorScheme = current.theme;
    setState(current);
    setTzLabel(getVisitorTimezoneLabel());
    setMounted(true);

    const onSync = (e: Event) => {
      const custom = e as CustomEvent<ThemeStateDetail>;
      if (custom.detail && (custom.detail.theme === 'light' || custom.detail.theme === 'dark')) {
        setState(custom.detail);
      } else {
        setState(readThemeState());
      }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === PREF_KEY) {
        const nextPref: Kr8ThemePref =
          e.newValue === 'light' || e.newValue === 'dark' ? e.newValue : 'auto';
        const applied = applyKr8ThemePreference(nextPref, false);
        setState(applied);
      }
    };

    // Automatic dawn (06:00) / dusk (18:00) transition when visitor is in 'auto' mode
    const checkDayNight = () => {
      const latest = readThemeState();
      if (latest.pref === 'auto') {
        const domTheme = document.documentElement.getAttribute('data-theme');
        if (domTheme !== latest.theme) {
          const applied = applyKr8ThemePreference('auto', true);
          setState(applied);
        }
      }
    };

    const timer = window.setInterval(checkDayNight, 60_000);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') checkDayNight();
    };

    window.addEventListener(EVENT_NAME, onSync);
    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener(EVENT_NAME, onSync);
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const choose = useCallback((nextPref: Kr8ThemePref) => {
    const applied = applyKr8ThemePreference(nextPref, true);
    setState(applied);
    track('theme_switch', { pref: nextPref, resolved: applied.theme });
  }, []);

  // Quick 1-tap toggle for mobile header icon: switches opposite visual theme & saves personal choice
  const quickToggle = useCallback(() => {
    const next: Kr8ThemePref = state.theme === 'light' ? 'dark' : 'light';
    choose(next);
  }, [state.theme, choose]);

  const activeTheme = mounted ? state.theme : 'light';
  const activePref = mounted ? state.pref : 'auto';
  const isLight = activeTheme === 'light';
  const autoHint = `Auto (${isLight ? 'Day' : 'Night'} · ${tzLabel}): Light 6 AM–6 PM, Dark 6 PM–6 AM`;

  if (variant === 'segmented') {
    return (
      <div
        className={`kr8-theme-seg ${className}`.trim()}
        role="group"
        aria-label="Appearance preference"
      >
        <button
          type="button"
          className={`kr8-theme-seg__btn${activePref === 'light' ? ' is-active' : ''}`}
          aria-pressed={activePref === 'light'}
          onClick={() => choose('light')}
          title="Always use Light theme"
        >
          <SunIcon />
          <span>Light</span>
        </button>
        <button
          type="button"
          className={`kr8-theme-seg__btn${activePref === 'dark' ? ' is-active' : ''}`}
          aria-pressed={activePref === 'dark'}
          onClick={() => choose('dark')}
          title="Always use Dark theme"
        >
          <MoonIcon />
          <span>Dark</span>
        </button>
        <button
          type="button"
          className={`kr8-theme-seg__btn${activePref === 'auto' ? ' is-active' : ''}`}
          aria-pressed={activePref === 'auto'}
          onClick={() => choose('auto')}
          title={autoHint}
        >
          <AutoIcon />
          <span>Auto</span>
        </button>
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={quickToggle}
        className={`kr8-theme-btn kr8-theme-btn--icon ${className}`.trim()}
        aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
        title={
          activePref === 'auto'
            ? `${autoHint} — tap to lock ${isLight ? 'Dark' : 'Light'}`
            : `Theme locked to ${isLight ? 'Light' : 'Dark'} — tap to switch`
        }
      >
        <span className="kr8-theme-btn__glyph" aria-hidden>
          {isLight ? <SunIcon /> : <MoonIcon />}
        </span>
        {activePref === 'auto' && <span className="kr8-theme-btn__auto-dot" aria-hidden />}
      </button>
    );
  }

  return (
    <div
      className={`kr8-theme-capsule ${className}`.trim()}
      role="group"
      aria-label="Theme preference"
    >
      <button
        type="button"
        className={`kr8-theme-capsule__btn${activePref === 'light' || (activePref === 'auto' && isLight) ? ' is-visual' : ''}${activePref === 'light' ? ' is-locked' : ''}`}
        aria-pressed={activePref === 'light'}
        aria-label="Always Light theme"
        title="Always Light theme"
        onClick={() => choose('light')}
      >
        <SunIcon />
      </button>
      <button
        type="button"
        className={`kr8-theme-capsule__btn${activePref === 'dark' || (activePref === 'auto' && !isLight) ? ' is-visual' : ''}${activePref === 'dark' ? ' is-locked' : ''}`}
        aria-pressed={activePref === 'dark'}
        aria-label="Always Dark theme"
        title="Always Dark theme"
        onClick={() => choose('dark')}
      >
        <MoonIcon />
      </button>
      <button
        type="button"
        className={`kr8-theme-capsule__btn kr8-theme-capsule__btn--auto${activePref === 'auto' ? ' is-locked' : ''}`}
        aria-pressed={activePref === 'auto'}
        aria-label="Automatic day and night theme by timezone"
        title={autoHint}
        onClick={() => choose('auto')}
      >
        <span>Auto</span>
      </button>
    </div>
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

function AutoIcon() {
  return (
    <svg width="13.5" height="13.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18" />
      <path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" fillOpacity="0.28" />
    </svg>
  );
}
