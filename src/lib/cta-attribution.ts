export type CtaAttribution = {
  ctaId: string;
  sourcePath: string;
  destination: string;
  label: string;
  capturedAt: string;
};

export function getCtaAttribution(fallbackId: string): CtaAttribution {
  const currentPath = typeof window === 'undefined' ? '/' : window.location.pathname;
  const fallback: CtaAttribution = {
    ctaId: fallbackId,
    sourcePath: currentPath,
    destination: currentPath,
    label: fallbackId,
    capturedAt: new Date().toISOString(),
  };
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = sessionStorage.getItem('kr8.lastCta');
    if (!raw) return fallback;
    const saved = JSON.parse(raw) as CtaAttribution;
    const age = Date.now() - new Date(saved.capturedAt).getTime();
    const destinationPath = String(saved.destination || '').split('?')[0].split('#')[0];
    const relevant = saved.sourcePath === currentPath || destinationPath === currentPath;
    if (!relevant || age < 0 || age > 30 * 60 * 1000 || !saved.ctaId) return fallback;
    return saved;
  } catch {
    return fallback;
  }
}
