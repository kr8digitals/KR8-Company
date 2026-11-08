import type { Metadata, Viewport } from 'next';
import './globals.css';
import './mobile-experience.css';
import './light-theme.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Host from '@/components/Host';
import ChromeGuard from '@/components/ChromeGuard';
import RevealProvider from '@/components/RevealProvider';
import { getCmsNavigation } from '@/lib/cms';
import site from '../../data/site.json';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kr8company.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'KR8 Digitals — websites, brands, films, AI and SEO',
    template: '%s · KR8 Digitals',
  },
  description: site.company.positioning,
  keywords: [
    'KR8 Digitals',
    'KR8 DIGITALS',
    'Timfire',
    'Steveoking',
    'Creative Expression',
    'website design',
    'branding',
    'graphic design',
    'video editing',
    'AI automation',
    'SEO optimisation',
    'KR8 Academy',
    'KR8 DIGITALS TRIBE',
  ],
  authors: [{ name: 'KR8 Digitals' }],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: SITE_URL,
    siteName: 'KR8 Digitals',
    title: 'KR8 Digitals — Whoever you are, whatever you do, we exist because of you.',
    description: site.company.shortDescription,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'KR8 Digitals' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KR8 Digitals — websites, brands, films, AI and SEO',
    description: 'Whoever you are, whatever you do, we exist because of you.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: '#f6f2fb',
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
  areaServed: 'Worldwide',
  founder: [
    { '@type': 'Person', name: 'Kenneth Timothy Iziogo', alternateName: 'Timfire', jobTitle: 'Founder & Chief Executive' },
    { '@type': 'Person', name: 'Stevenson', alternateName: 'Steveoking', jobTitle: 'Co-Founder' },
    { '@type': 'Person', name: 'Daniel Akachukwu Augustine', alternateName: 'Creative Expression', jobTitle: 'Co-Founder' },
  ],
  subOrganization: [
    { '@type': 'EducationalOrganization', name: 'KR8 Academy', url: 'https://academy.kr8digitals.com' },
    { '@type': 'Organization', name: 'KR8 DIGITALS TRIBE', url: `${SITE_URL}/tribe` },
  ],
  sameAs: site.company.socials.map((s) => s.href).filter(Boolean),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const navConfig = await getCmsNavigation();

  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var p=localStorage.getItem('kr8_theme_pref');var m;if(p==='light'||p==='dark'){m=p;}else{p='auto';var h=new Date().getHours();m=(h>=6&&h<18)?'light':'dark';}document.documentElement.setAttribute('data-theme',m);document.documentElement.setAttribute('data-theme-mode',p);document.documentElement.style.colorScheme=m;var tc=document.querySelector('meta[name="theme-color"]');if(tc)tc.setAttribute('content',m==='light'?'#f6f2fb':'#0a0614');}catch(e){}`,
          }}
        />
        <link rel="preload" href="/fonts/montserrat.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/sora.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <RevealProvider>
          <ChromeGuard
            header={<Header navConfig={navConfig} />}
            footer={<Footer />}
            host={<Host />}
          >
            {children}
          </ChromeGuard>
        </RevealProvider>
      </body>
    </html>
  );
}
