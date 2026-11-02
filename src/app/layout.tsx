import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Host from '@/components/Host';
import RevealProvider from '@/components/RevealProvider';
import site from '../../data/site.json';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kr8digitals.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'KR8 Digitals — A creative institution in Nigeria',
    template: '%s · KR8 Digitals',
  },
  description:
    'KR8 Digitals runs a tuition-free academy, a working community, an event series and a delivery studio. The Academy teaches. The Tribe holds. Mindset Shift convenes. Our Services deliver. Our Partners extend.',
  keywords: [
    'KR8 Digitals', 'creative school Nigeria', 'free design training Nigeria',
    'website design Nigeria', 'video editing Nigeria', 'brand design Abakaliki',
    'KR8 Academy', 'The Tribe KR8',
  ],
  authors: [{ name: 'KR8 Digitals' }],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: SITE_URL,
    siteName: 'KR8 Digitals',
    title: 'KR8 Digitals — A creative institution in Nigeria',
    description:
      'A tuition-free academy, a working community, an event series and a delivery studio — run as one company.',
    images: [{ url: '/img/work-afristem.jpg', width: 1440, height: 900, alt: 'A website built by KR8 Digitals' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KR8 Digitals — A creative institution in Nigeria',
    description: 'The Academy teaches. The Tribe holds. Mindset Shift convenes. Services deliver. Partners extend.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: '#0a0614',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'KR8 Digitals',
  url: SITE_URL,
  email: site.company.email,
  telephone: site.company.phone,
  description: site.company.shortDescription,
  address: { '@type': 'PostalAddress', addressCountry: 'NG', addressLocality: 'Lagos' },
  founder: { '@type': 'Person', name: 'Kenneth Timothy Iziogo', alternateName: 'Timfire', jobTitle: 'Founder & CEO' },
  subOrganization: [
    { '@type': 'EducationalOrganization', name: 'KR8 Academy', url: 'https://academy.kr8digitals.com' },
    { '@type': 'Organization', name: 'The Tribe', url: 'https://tribe.kr8digitals.com' },
  ],
  sameAs: site.company.socials.map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <head>
        <link rel="preload" href="/fonts/montserrat.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/sora.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <RevealProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <Host />
        </RevealProvider>
      </body>
    </html>
  );
}
