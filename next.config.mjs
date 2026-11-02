/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    // Single-hop legacy redirects from the old single-page build (Section 22).
    return [
      { source: '/agency', destination: '/services', permanent: true },
      { source: '/academy', destination: 'https://academy.kr8digitals.com', permanent: true },
      { source: '/mindset-shift', destination: '/programs#mindset-shift', permanent: true },
      { source: '/partner', destination: '/partners', permanent: true },
      { source: '/blog', destination: '/about', permanent: true },
      { source: '/gallery', destination: '/services/brand-graphic-design', permanent: true },
      { source: '/verify', destination: 'https://academy.kr8digitals.com/verify', permanent: true },
    ];
  },
};
export default nextConfig;
