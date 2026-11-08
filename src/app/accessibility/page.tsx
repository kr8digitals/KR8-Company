import Link from 'next/link';
import type { Metadata } from 'next';
import site from '../../../data/site.json';
import { SectionAtmosphere } from '@/components/MobileExperience';

export const metadata: Metadata = {
  title: 'Accessibility Statement | KR8 DIGITALS',
  description: 'Accessibility engineering standards and feedback channel for the KR8 DIGITALS website.',
  alternates: { canonical: '/accessibility' },
};

const STANDARDS = [
  {
    num: '01 · SEMANTIC NAVIGATION & KEYBOARD',
    title: 'Keyboard-Operable Controls & Skip Links',
    body: 'Every interactive drawer, lightbox, tab list, and form control on this platform is engineered for full keyboard navigation, visible focus states, Escape-to-dismiss behavior, and a top-of-page Skip to Content link.',
  },
  {
    num: '02 · CONTRAST & TYPOGRAPHY',
    title: 'High-Contrast Legibility Across Devices',
    body: 'Display headlines, body copy, and interactive buttons are paired against deep obsidian surfaces to maintain strong visual contrast on indoor and outdoor mobile screens, with scalable fluid typography up to 200% zoom.',
  },
  {
    num: '03 · MOTION & MEDIA RESPECT',
    title: 'Reduced-Motion Support & Captioned Cuts',
    body: 'System prefers-reduced-motion settings are respected across transitions, hero cinema plates include pause controls, and vertical video stories incorporate burned-in captions so narratives remain legible without audio.',
  },
  {
    num: '04 · CONTINUOUS FEEDBACK',
    title: 'Report Any Barrier Directly',
    body: `If any page, media element, or form creates a barrier with your screen reader or assistive device, email ${site.company.email} with the page URL and our engineering team will remediate it promptly.`,
  },
];

export default function AccessibilityPage() {
  return (
    <>
      <section className="kr8-subhero" style={{ paddingBottom: 38 }}>
        <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.28} mobOpacity={0.38} flare />
        <div className="wrap">
          <span className="kr8-pill">Inclusive Engineering · KR8 DIGITALS</span>
          <h1 className="kr8-subhero__title">Accessibility Statement</h1>
          <p className="kr8-subhero__lede">
            Our commitment to keeping KR8 DIGITALS usable, legible, and fast across assistive technologies,
            screen sizes, and network conditions.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 44 }}>
        <div className="wrap">
          <div className="kr8-grid-2">
            {STANDARDS.map((s) => (
              <article className="kr8-card" key={s.num}>
                <div className="kr8-card__num">{s.num}</div>
                <h2 className="kr8-card__title">{s.title}</h2>
                <p className="kr8-card__body">{s.body}</p>
              </article>
            ))}
          </div>

          <div style={{ marginTop: 32, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            <Link href="/privacy" className="btn-ghost btn-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="btn-ghost btn-sm">
              Terms of Service
            </Link>
            <Link href="/contact" className="btn-ghost btn-sm">
              Report an Issue
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
