'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/track';

/**
 * Reveals: IntersectionObserver + a requestAnimationFrame safety sweep so that
 * content can never get stuck invisible (the failure mode of the previous build).
 * Also restores the page position and fires a page view on route change.
 */
export default function RevealProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.remove('no-js');
    const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (reduce || typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const delay = Number(el.dataset.delay || 0);
            if (delay) el.style.transitionDelay = `${delay}ms`;
            el.classList.add('is-in');
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => io.observe(el));

    // Safety net: anything already in or above the viewport after two frames is shown.
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const vh = window.innerHeight;
        els.forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.top < vh * 0.96 && r.bottom > -80) el.classList.add('is-in');
        });
      });
    });

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  useEffect(() => {
    track('page_view', { path: pathname });
  }, [pathname]);

  return <>{children}</>;
}
