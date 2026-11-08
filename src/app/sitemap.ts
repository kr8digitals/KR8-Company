import type { MetadataRoute } from 'next';
import { getCmsPages, getCmsPartners, getCmsServices } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://kr8company.vercel.app';
  const now = new Date();

  const [services, partners, pages] = await Promise.all([
    getCmsServices(),
    getCmsPartners(),
    getCmsPages(),
  ]);

  const staticRoutes = [
    '',
    '/about',
    '/about/timfire',
    '/about/steveoking',
    '/about/creative-expression',
    '/about/join-the-team',
    '/services',
    '/programs',
    '/programs/mindset-shift/invite',
    '/tribe',
    '/partners',
    '/referrals',
    '/contact',
    '/privacy',
    '/terms',
    '/accessibility',
  ];

  const customPages = pages
    .filter((p) => !p.isSystem && !p.noindex)
    .map((p) => `/${p.slug.replace(/^\/+/, '')}`);

  return [
    ...staticRoutes.map((p) => ({
      url: `${base}${p}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: p === '' ? 1 : 0.85,
    })),
    ...services.map((s: any) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...partners.map((p: any) => ({
      url: `${base}/partners/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...customPages.map((p) => ({
      url: `${base}${p}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })),
  ];
}
