import type { MetadataRoute } from 'next';
import services from '../../data/services.json';
import partners from '../../data/partners.json';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kr8digitals.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly') => ({
    url: `${BASE}${path}`, lastModified: now, changeFrequency, priority,
  });

  return [
    page('/', 1, 'weekly'),
    page('/services', 0.9),
    ...services.map((s) => page(`/services/${s.slug}`, 0.8)),
    page('/about', 0.7),
    page('/about/join-the-team', 0.7),
    page('/programs', 0.9, 'weekly'),
    page('/tribe', 0.7, 'weekly'),
    page('/programs/mindset-shift/invite', 0.6),
    page('/partners', 0.6),
    ...partners.map((p) => page(`/partners/${p.slug}`, 0.5)),
    page('/referrals', 0.8),
    page('/contact', 0.9),
    page('/privacy', 0.2, 'yearly'),
    page('/terms', 0.2, 'yearly'),
    page('/accessibility', 0.3, 'yearly'),
  ];
}
