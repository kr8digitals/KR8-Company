// Privacy-respecting, first-party event tracking. No third-party script, no cookies
// for analytics, no fingerprinting. Events are batched to /api/track which writes
// to the dashboard's own store. (Section 22.)
export type TrackEvent = {
  name: string;
  path?: string;
  props?: Record<string, string | number | boolean>;
};

let queue: TrackEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

function flush() {
  if (queue.length === 0) return;
  const batch = queue.splice(0, queue.length);
  try {
    const body = JSON.stringify({ events: batch });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
    } else {
      fetch('/api/track', { method: 'POST', body, headers: { 'content-type': 'application/json' }, keepalive: true });
    }
  } catch {
    /* analytics must never break the page */
  }
}

export function track(name: string, props?: TrackEvent['props']) {
  if (typeof window === 'undefined') return;
  queue.push({ name, path: window.location.pathname, props });
  if (timer) clearTimeout(timer);
  timer = setTimeout(flush, 700);
  if (queue.length > 12) flush();
}

export function trackOutbound(href: string, label: string) {
  track('outbound_click', { href, label });
}
