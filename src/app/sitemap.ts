import type { MetadataRoute } from 'next';
import { getCmsPages, getCmsPartners, getCmsServices } from '@/lib/cms';
import { SITE_URL } from '@/lib/site-url';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const knownRoutes = new Set(staticRoutes);
  const customPages = pages
    .filter((page) => !page.isSystem && !page.noindex && page.status === 'published')
    .map((page) => `/${page.slug.replace(/^\/+|\/+$/g, '')}`)
    .filter((path) => !knownRoutes.has(path));

  const urls = [
    ...staticRoutes.map((path) => ({ path, priority: path === '' ? 1 : 0.75, changeFrequency: 'monthly' as const })),
    ...services.map((service: any) => ({ path: `/services/${service.slug}`, priority: 0.8, changeFrequency: 'monthly' as const })),
    ...partners.map((partner: any) => ({ path: `/partners/${partner.slug}`, priority: 0.65, changeFrequency: 'monthly' as const })),
    ...customPages.map((path) => ({ path, priority: 0.6, changeFrequency: 'monthly' as const })),
  ];

  return urls.map(({ path, priority, changeFrequency }) => ({
    url: new URL(path.replace(/^\/+/, ''), `${SITE_URL}/`).toString(),
    changeFrequency,
    priority,
  }));
}
