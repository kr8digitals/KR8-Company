'use client';

import { useEffect } from 'react';

type CapturedCta = {
  ctaId: string;
  sourcePath: string;
  destination: string;
  label: string;
  capturedAt: string;
};

export default function CtaAttribution() {
  useEffect(() => {
    function capture(event: MouseEvent) {
      const element = (event.target as Element | null)?.closest('a,button');
      if (!(element instanceof HTMLElement)) return;
      const href = element instanceof HTMLAnchorElement ? element.getAttribute('href') || '' : '';
      const destination = href.split('?')[0];
      const isFormDestination =
        /^\/contact(?:\/|$)/.test(destination) ||
        /^\/partners(?:\/|$)/.test(destination) ||
        /^\/referrals(?:\/|$)/.test(destination) ||
        /^\/tribe(?:\/|$)/.test(destination) ||
        /^\/programs\/mindset-shift\/invite/.test(destination) ||
        /^\/about\/join-the-team/.test(destination) ||
        /^\/order\//.test(destination) ||
        ['#register', '#join-tribe', '#apply', '#propose', '#join'].includes(href);
      if (!isFormDestination) return;

      const label = (element.getAttribute('aria-label') || element.textContent || 'action')
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 100);
      const section = element.closest('section');
      const scope = section?.id ? `#${section.id}` : '';
      const siblingActions = section ? Array.from(section.querySelectorAll('a,button')) : [];
      const position = Math.max(0, siblingActions.indexOf(element));
      const labelSlug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'action';
      const ctaId = element.dataset.ctaId || `${window.location.pathname}${scope}:${labelSlug}:${position}`;
      const payload: CapturedCta = {
        ctaId,
        sourcePath: window.location.pathname,
        destination: href,
        label,
        capturedAt: new Date().toISOString(),
      };
      try { sessionStorage.setItem('kr8.lastCta', JSON.stringify(payload)); } catch { /* storage may be disabled */ }
    }

    document.addEventListener('click', capture, true);
    return () => document.removeEventListener('click', capture, true);
  }, []);

  return null;
}
