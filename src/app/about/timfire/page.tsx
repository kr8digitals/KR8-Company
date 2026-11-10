import { formatEditableText } from '@/lib/content-format';
import { getEditableDocument } from '@/lib/editable-content';
import { getPublicContent } from '@/lib/public-content';
import Link from 'next/link';
import type { Metadata } from 'next';
import sitesData from '../../../../data/sites.json';
import { Icon } from '@/components/ui';
import {
  MobileDisclosure,
  ResponsiveCopy,
  SectionAtmosphere,
} from '@/components/MobileExperience';

export async function generateMetadata(): Promise<Metadata> {
  return (await getEditableDocument("app:about:timfire:page")).blocks.metadata as Metadata;
}

const SPECIALISMS = [
  {
    num: 'CRAFT 01 · FULL-STACK WEB ARCHITECTURE',
    title: 'Conversion-Engineered Websites & Web Platforms',
    body: 'Timfire architects and builds custom web platforms from the ground up — focusing on sub-second mobile performance, clear information hierarchy, and measurable customer action across hospitality, education, healthcare, corporate, and institutional sectors.',
    mobileBody: 'Custom Next.js web platforms engineered for sub-second mobile speed, clear UX, and measurable conversions.',
    tags: ['Next.js & Modern Web', 'Mobile-First UI/UX', 'Technical SEO Architecture', 'Conversion Systems'],
  },
  {
    num: 'CRAFT 02 · APPLIED AI & AUTOMATION',
    title: 'Domain-Grounded AI Agents & Business Workflows',
    body: 'Moving past fragile hype demos, Timfire builds reliable operational AI assistants, intelligent inquiry routers, and automated lead pipelines bounded by verified company knowledge and human-in-the-loop escalation.',
    mobileBody: 'Reliable operational AI agents (including RIYA), WhatsApp/CRM lead routing, and automated business workflows.',
    tags: ['Custom AI Assistants', 'Lead Triage & Routing', 'Operational Automation', 'Human-in-the-Loop Guardrails'],
  },
  {
    num: 'CRAFT 03 · ECOSYSTEM LEADERSHIP',
    title: 'Executive Stewardship, KR8 Academy & Mindset Shift',
    body: 'As Founder and Chief Executive, Timfire leads company strategy across KR8 DIGITALS, oversees tuition-free engineering tracks inside KR8 Academy, and convenes Mindset Shift to equip emerging builders with disciplined career vision.',
    mobileBody: 'Leads KR8 DIGITALS strategy, oversees free engineering tracks at KR8 Academy, and hosts Mindset Shift.',
    tags: ['Company Strategy', 'KR8 Academy Mentorship', 'Mindset Shift Host', 'Partner Ecosystem'],
  },
];

export default async function TimfireProfilePage() {
  const editableContent = await getEditableDocument("app:about:timfire:page");
  const SPECIALISMS = editableContent.blocks.SPECIALISMS as EditableBlockTypes["SPECIALISMS"];

  const publicData = await getPublicContent();
  const sitesData = publicData.catalog;

  const featuredSites = sitesData.sites.slice(0, 4);

  return (
    <>
      {/* =================================================== PROFILE HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name="founder-craft-web" deskOpacity={0.32} mobOpacity={0.42} flare />
        <div className="wrap">
          <nav className="kr8-breadcrumb" aria-label={editableContent.texts.field_2bd873d6c7}>
            <Link href="/">{editableContent.texts.text_3a78695388}</Link>
            <span>/</span>
            <Link href={editableContent.texts.field_979bddc4a8}>{editableContent.texts.text_4efca0d10c}</Link>
            <span>/</span>
            <span style={{ color: 'var(--t-strong)' }}>{editableContent.texts.text_e490bfa3fb}</span>
          </nav>

          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill">
                <i className="kr8-pill__dot" /> {editableContent.texts.text_5c744eff69}</span>
              <h1
                className="kr8-subhero__title"
                style={{ wordBreak: 'keep-all', overflowWrap: 'normal', hyphens: 'none' }}
              >
                {editableContent.texts.text_e490bfa3fb}</h1>
              <p
                style={{
                  marginTop: 8,
                  fontFamily: 'var(--f-mono)',
                  fontSize: 12.5,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--magenta)',
                }}
              >
                {editableContent.texts.text_707298ce1b}</p>

              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={
                  <>
                    <strong>{editableContent.texts.text_e490bfa3fb}</strong> {editableContent.texts.text_2f152c15af}<strong>{editableContent.texts.text_0bbfb207b2}</strong>{editableContent.texts.text_a3f242aebd}</>
                }
                mobile={
                  <>
                    <strong>{editableContent.texts.text_e490bfa3fb}</strong> {editableContent.texts.text_74acb166cb}<strong>{editableContent.texts.text_0bbfb207b2}</strong> {editableContent.texts.text_7f1bb1a28f}</>
                }
              />

              <blockquote
                style={{
                  margin: '18px 0 0',
                  padding: '13px 16px',
                  borderLeft: '3px solid var(--magenta)',
                  background: 'rgba(168, 85, 247, 0.08)',
                  borderRadius: '0 14px 14px 0',
                  fontSize: 14,
                  lineHeight: 1.58,
                  color: 'var(--t-body)',
                }}
              >
                {editableContent.texts.text_41d70c143e}</blockquote>

              <div className="kr8-subhero__actions">
                <Link href={editableContent.texts.field_1e9e316dc1} className="btn-primary">
                  {editableContent.texts.text_de535da04f}<Icon name="arrow" size={17} />
                </Link>
                <Link href={editableContent.texts.field_2034d21436} className="btn-ghost">
                  {editableContent.texts.text_fec9d9f085}</Link>
              </div>
            </div>

            <div className="kr8-subhero__frame kr8-subhero__frame--portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={editableContent.texts.field_d5d4d89245}
                alt={editableContent.texts.field_0e61784195}
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>{editableContent.texts.text_5921278204}</span>
                  <strong>{editableContent.texts.text_dec628808e}</strong>
                </div>
                <span style={{ color: 'var(--t-lilac-strong)' }}>{editableContent.texts.text_0bbfb207b2}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= BIOGRAPHY & PHILOSOPHY */}
      <section className="section">
        <div className="wrap">
          <div className="kr8-grid-2" style={{ alignItems: 'center', gap: 36 }}>
            <div>
              <div className="eyebrow">{editableContent.texts.text_c20793eb42}</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                {editableContent.texts.text_7f701882a4}<span className="text-grad">{editableContent.texts.text_5b11226239}</span>
              </h2>

              {/* Desktop full 3-paragraph biography preserved 100% */}
              <div className="prose-lg kr8-desk-only" style={{ marginTop: 18, display: 'grid', gap: 16 }}>
                <p>
                  {editableContent.texts.text_631a36079d}<strong>{editableContent.texts.text_0bbfb207b2}</strong> {editableContent.texts.text_c54370a6ef}</p>
                <p>
                  {editableContent.texts.text_3c3fe34ff5}</p>
                <p>
                  {editableContent.texts.text_d2eeb5491c}<strong>{editableContent.texts.text_d5b3fef0ee}</strong> {editableContent.texts.text_ffddb0edae}{' '}
                  <strong>{editableContent.texts.text_ebb49eeed8}</strong> {editableContent.texts.text_7da937fd35}</p>
              </div>

              {/* Mobile concise summary + expandable full biography */}
              <div className="kr8-mob-only" style={{ marginTop: 12 }}>
                <p className="kr8-card__body">
                  {editableContent.texts.text_631a36079d}<strong>{editableContent.texts.text_0bbfb207b2}</strong> {editableContent.texts.text_ec00c1ea49}<strong>{editableContent.texts.text_d5b3fef0ee}</strong>{' '}
                  {editableContent.texts.text_dde45afe9a}<strong>{editableContent.texts.text_ebb49eeed8}</strong> {editableContent.texts.text_d951693d26}</p>
                <MobileDisclosure label="Read Timfire's full executive biography">
                  <p>
                    {editableContent.texts.text_aa60e1f22e}</p>
                  <p>
                    {editableContent.texts.text_c9ac6b1fc3}</p>
                </MobileDisclosure>
              </div>
            </div>

            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={editableContent.texts.field_6533fc0951}
                alt={editableContent.texts.field_fbbfed4f1f}
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>{editableContent.texts.text_d8164c070c}</span>
                  <strong>{editableContent.texts.text_574e921477}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================== SPECIALISMS & RESPONSIBILITIES */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <SectionAtmosphere name="website-engineering-cinema" deskOpacity={0.12} mobOpacity={0.22} flare />
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{editableContent.texts.text_31fa1a286c}</div>
              <h2 className="section-title">
                {editableContent.texts.text_56ee2726cd}<span className="text-grad">{editableContent.texts.text_fe25094921}</span>
              </h2>
            </div>
          </div>

          <div className="kr8-grid-3" style={{ marginTop: 28 }}>
            {SPECIALISMS.map((s, idx) => (
              <article
                className={`kr8-card ${idx === 0 ? 'kr8-card--accent' : ''} reveal up`}
                key={s.num}
              >
                <div className="kr8-card__num">{s.num}</div>
                <h3 className="kr8-card__title">{s.title}</h3>
                <ResponsiveCopy
                  as="p"
                  className="kr8-card__body"
                  desktop={s.body}
                  mobile={s.mobileBody}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                  {s.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================== SELECTED ENGINEERING PROOF */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{editableContent.texts.text_b1094e57e7}</div>
              <h2 className="section-title">{editableContent.texts.text_bae3c6a984}</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop={editableContent.texts.field_e5932ae109}
                mobile={editableContent.texts.field_29ac9fe830}
              />
            </div>
            <Link href={editableContent.texts.field_8b058c1ad9} className="btn-link">
              {editableContent.texts.text_724b162f1a}<Icon name="arrow" size={15} />
            </Link>
          </div>

          <div className="kr8-grid-2" style={{ marginTop: 28 }}>
            {featuredSites.map((s) => (
              <article className="kr8-card reveal up" key={s.slug}>
                <div className="kr8-card__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.card} alt={formatEditableText(editableContent.texts.copy_ac6c120ee6, [s.name])} loading="lazy" />
                </div>
                <div className="kr8-card__num">{s.category} · {s.kind}</div>
                <h3 className="kr8-card__title">{s.name}</h3>
                <p className="kr8-card__body">{s.note}</p>
                <div className="kr8-card__foot">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-link"
                  >
                    {editableContent.texts.text_331dc21cbb}<Icon name="external" size={14} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ CO-FOUNDER NAVIGATION & CTA */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{editableContent.texts.text_239be78fc2}</div>
              <h2 className="section-title">{editableContent.texts.text_a603fe441f}</h2>
            </div>
            <Link href={editableContent.texts.field_6cbb86594e} className="btn-link">
              {editableContent.texts.text_b1dbcb4a65}<Icon name="arrow" size={15} />
            </Link>
          </div>

          <div className="kr8-grid-2" style={{ marginTop: 24 }}>
            <Link href={editableContent.texts.field_a3b5a1f01c} className="kr8-card" style={{ textDecoration: 'none' }}>
              <div className="kr8-card__num">{editableContent.texts.text_df01a8efa8}</div>
              <h3 className="kr8-card__title">{editableContent.texts.text_cf3cd9881e}</h3>
              <p className="kr8-card__body">
                {editableContent.texts.text_446b653f17}</p>
              <div className="kr8-card__foot">
                <span className="btn-link">
                  {editableContent.texts.text_0fb5cd0e3f}<Icon name="arrow" size={14} />
                </span>
              </div>
            </Link>

            <Link href={editableContent.texts.field_57d47ac737} className="kr8-card" style={{ textDecoration: 'none' }}>
              <div className="kr8-card__num">{editableContent.texts.text_33e8c46c0f}</div>
              <h3 className="kr8-card__title">{editableContent.texts.text_18b315253e}</h3>
              <p className="kr8-card__body">
                {editableContent.texts.text_427e6b35e8}</p>
              <div className="kr8-card__foot">
                <span className="btn-link">
                  {editableContent.texts.text_51ed52c16e}<Icon name="arrow" size={14} />
                </span>
              </div>
            </Link>
          </div>

          <div className="kr8-cta-banner reveal up" style={{ marginTop: 34 }}>
            <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.45} mobOpacity={0.55} flare />
            <div>
              <span className="kr8-pill">{editableContent.texts.text_d0d26a179f}</span>
              <h2 className="section-title" style={{ marginTop: 14 }}>
                {editableContent.texts.text_ca8117bf42}</h2>
              <p className="section-lede" style={{ marginTop: 10 }}>
                {editableContent.texts.text_ebbf29f4ec}</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href={editableContent.texts.field_4eb9506365} className="btn-primary">
                {editableContent.texts.text_8db0ef5f0e}<Icon name="arrow" size={17} />
              </Link>
              <Link href={editableContent.texts.field_3b1aeccb74} className="btn-ghost">
                {editableContent.texts.text_7a8b4ce4cd}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

type EditableBlockTypes = { SPECIALISMS: typeof SPECIALISMS };
