/** One canonical production origin shared by metadata, robots.txt, and sitemap.xml. */
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (configuredUrl || 'https://kr8digitals.com').replace(/\/+$/, '');

export function absoluteUrl(path = '/') {
  return new URL(path.replace(/^\/+/, ''), `${SITE_URL}/`).toString();
}
