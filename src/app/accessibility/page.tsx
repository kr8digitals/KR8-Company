import { getEditableDocument } from '@/lib/editable-content';
import { getPublicContent } from '@/lib/public-content';
import Link from 'next/link';
import type { Metadata } from 'next';
import site from '../../../data/site.json';
import { SectionAtmosphere } from '@/components/MobileExperience';

export async function generateMetadata(): Promise<Metadata> {
  return (await getEditableDocument("app:accessibility:page")).blocks.metadata as Metadata;
}

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

export default async function AccessibilityPage() {
  const editableContent = await getEditableDocument("app:accessibility:page");
  const STANDARDS = editableContent.blocks.STANDARDS as EditableBlockTypes["STANDARDS"];

  const publicData = await getPublicContent();
  const site = publicData.site;

  return (
    <>
      <section className="kr8-subhero" style={{ paddingBottom: 38 }}>
        <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.28} mobOpacity={0.38} flare />
        <div className="wrap">
          <span className="kr8-pill">{editableContent.texts.text_bcf1d5a078}</span>
          <h1 className="kr8-subhero__title">{editableContent.texts.text_78d4fc94c0}</h1>
          <p className="kr8-subhero__lede">
            {editableContent.texts.text_d45e60e75a}</p>
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
            <Link href={editableContent.texts.field_0ece7f7c30} className="btn-ghost btn-sm">
              {editableContent.texts.text_506ff39462}</Link>
            <Link href={editableContent.texts.field_2dda5c6b8e} className="btn-ghost btn-sm">
              {editableContent.texts.text_4afa55bf7a}</Link>
            <Link href={editableContent.texts.field_4eb9506365} className="btn-ghost btn-sm">
              {editableContent.texts.text_f6a30a10bc}</Link>
          </div>
        </div>
      </section>
    </>
  );
}

type EditableBlockTypes = { STANDARDS: typeof STANDARDS };
