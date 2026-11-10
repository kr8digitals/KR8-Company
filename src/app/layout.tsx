import type { Metadata, Viewport } from 'next';
import './globals.css';
import './mobile-experience.css';
import './light-theme.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Host from '@/components/Host';
import ChromeGuard from '@/components/ChromeGuard';
import CtaAttribution from '@/components/CtaAttribution';
import RevealProvider from '@/components/RevealProvider';
import { getCmsNavigation } from '@/lib/cms';
import { SITE_URL } from '@/lib/site-url';
import site from '../../data/site.json';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'KR8 Digitals | Digital Studio, Web Design & Free Skills Training in Nigeria',
    template: '%s · KR8 Digitals',
  },
  description: site.company.positioning,
  authors: [{ name: 'KR8 Digitals' }],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: SITE_URL,
    siteName: 'KR8 Digitals',
    title: 'KR8 Digitals — Digital Studio, Skills Training & Creator Community',
    description: site.company.shortDescription,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'KR8 Digitals' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KR8 Digitals | Web, Brand, Film, AI & Skills Training',
    description: site.company.shortDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#f6f2fb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const siteSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'KR8 Digitals',
      alternateName: ['KR8 DIGITALS', 'KR8 Digitals Nigeria'],
      legalName: site.company.legalName,
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
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'KR8 Digitals',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-NG',
    },
  ],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema).replace(/</g, '\\u003c') }} />
      </head>
      <body>
        <CtaAttribution />
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
