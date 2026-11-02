import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kr8digitals.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/referrals/dashboard', '/r/'] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
