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
  return (await getEditableDocument("app:about:steveoking:page")).blocks.metadata as Metadata;
}

const DESIGN_PILLARS = [
  {
    num: 'DISCIPLINE 01 · BRAND STRATEGY & IDENTITY',
    title: 'Visual Identity Systems That Command Category Authority',
    body: 'Steveoking crafts complete brand architectures — primary and secondary logomarks, typographic pairings, color systems, and comprehensive Brand Guidelines designed to keep growing organisations unmistakable across every physical and digital touchpoint.',
    mobileBody: 'Complete logo suites, typography, color systems, and Brand Playbooks engineered for unmistakable authority.',
    tags: ['Logo Architecture', 'Brand Guidelines', 'Typography & Color', 'Visual Positioning'],
  },
  {
    num: 'DISCIPLINE 02 · COMMERCIAL GRAPHIC DESIGN',
    title: 'Campaign Key Art & Promotional Flyers Built to Convert',
    body: 'Through Motionverse and KR8 DIGITALS, Steveoking directs campaign artwork engineered for the critical first half-second on mobile feeds and print — giving product launches, retail brands, and events immediate visual gravity.',
    mobileBody: 'Scroll-stopping campaign flyers, product key art, and event visual suites across mobile feeds and print.',
    tags: ['Campaign Key Art', 'Product & Retail Flyers', 'Event Visual Suites', 'Print & Social Formats'],
  },
  {
    num: 'DISCIPLINE 03 · MOTIONVERSE & ACADEMY MENTORSHIP',
    title: 'Leading Motionverse & Teaching the Next Generation',
    body: 'As Founder of Motionverse and Co-Founder of KR8 DIGITALS, Steveoking bridges active studio art direction with hands-on Graphic Design instruction inside KR8 Academy — holding learners to real commercial composition standards.',
    mobileBody: 'Leads Motionverse art direction and mentors emerging designers inside KR8 Academy’s free Graphic Design track.',
    tags: ['Motionverse Founder', 'KR8 Co-Founder', 'Graphic Design Instructor', 'Creative Critique'],
  },
];

export default async function SteveokingProfilePage() {
  const editableContent = await getEditableDocument("app:about:steveoking:page");
  const DESIGN_PILLARS = editableContent.blocks.DESIGN_PILLARS as EditableBlockTypes["DESIGN_PILLARS"];

  const publicData = await getPublicContent();
  const sitesData = publicData.catalog;

  const featuredFlyers = sitesData.flyers.slice(0, 4);

  return (
    <>
      {/* =================================================== PROFILE HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name="founder-craft-design" deskOpacity={0.32} mobOpacity={0.42} flare />
        <div className="wrap">
          <nav className="kr8-breadcrumb" aria-label={editableContent.texts.field_2bd873d6c7}>
            <Link href="/">{editableContent.texts.text_3a78695388}</Link>
            <span>/</span>
            <Link href={editableContent.texts.field_979bddc4a8}>{editableContent.texts.text_4efca0d10c}</Link>
            <span>/</span>
            <span style={{ color: 'var(--t-strong)' }}>{editableContent.texts.text_d5b3fef0ee}</span>
          </nav>

          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill">
                <i className="kr8-pill__dot" /> {editableContent.texts.text_2b7945630c}</span>
              <h1
                className="kr8-subhero__title"
                style={{ wordBreak: 'keep-all', overflowWrap: 'normal', hyphens: 'none' }}
              >
                {editableContent.texts.text_d5b3fef0ee}</h1>
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
                {editableContent.texts.text_25f2800360}</p>

              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={
                  <>
                    <strong>{editableContent.texts.text_d5b3fef0ee}</strong> {editableContent.texts.text_bc2d2b1ccc}<strong>{editableContent.texts.text_6271b13e79}</strong>{editableContent.texts.text_1dafab9f6e}<strong>{editableContent.texts.text_0bbfb207b2}</strong>{editableContent.texts.text_b009af0544}</>
                }
                mobile={
                  <>
                    <strong>{editableContent.texts.text_d5b3fef0ee}</strong> {editableContent.texts.text_bc2d2b1ccc}<strong>{editableContent.texts.text_6271b13e79}</strong>{editableContent.texts.text_1dafab9f6e}<strong>{editableContent.texts.text_0bbfb207b2}</strong>.
                  </>
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
                {editableContent.texts.text_292400fe7e}</blockquote>

              <div className="kr8-subhero__actions">
                <Link href={editableContent.texts.field_0c3072e476} className="btn-primary">
                  {editableContent.texts.text_a3d6660096}<Icon name="arrow" size={17} />
                </Link>
                <Link href={editableContent.texts.field_fbac472c84} className="btn-ghost">
                  {editableContent.texts.text_2aa0a2d608}</Link>
              </div>
            </div>

            <div className="kr8-subhero__frame kr8-subhero__frame--portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={editableContent.texts.field_2eb65709d3}
                alt={editableContent.texts.field_7a183be09e}
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>{editableContent.texts.text_86daeda098}</span>
                  <strong>{editableContent.texts.text_3f99034bd9}</strong>
                </div>
                <span style={{ color: 'var(--t-lilac-strong)' }}>{editableContent.texts.text_6271b13e79}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= BIOGRAPHY & DESIGN ETHOS */}
      <section className="section">
        <div className="wrap">
          <div className="kr8-grid-2" style={{ alignItems: 'center', gap: 36 }}>
            <div>
              <div className="eyebrow">{editableContent.texts.text_ee4cbe9d8b}</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                {editableContent.texts.text_79460fe499}<span className="text-grad">{editableContent.texts.text_9e42d18224}</span>
              </h2>

              <div className="prose-lg kr8-desk-only" style={{ marginTop: 18, display: 'grid', gap: 16 }}>
                <p>
                  {editableContent.texts.text_8d74ad8cf1}<strong>{editableContent.texts.text_6271b13e79}</strong> {editableContent.texts.text_790ffcfe92}<strong>{editableContent.texts.text_0bbfb207b2}</strong>,{' '}
                  <strong>{editableContent.texts.text_d5b3fef0ee}</strong> {editableContent.texts.text_8000730ddd}</p>
                <p>
                  {editableContent.texts.text_8ebc5592c9}{' '}
                  <strong>{editableContent.texts.text_d417aa16da}</strong> {editableContent.texts.text_7d364e6691}<strong>{editableContent.texts.text_b5fe7b887a}</strong> {editableContent.texts.text_0678934fb7}</p>
                <p>
                  {editableContent.texts.text_ed58cdcec8}<strong>{editableContent.texts.text_ca538eaf54}</strong> {editableContent.texts.text_3b10a37c76}</p>
              </div>

              <div className="kr8-mob-only" style={{ marginTop: 12 }}>
                <p className="kr8-card__body">
                  {editableContent.texts.text_ba242f3314}<strong>{editableContent.texts.text_6271b13e79}</strong> {editableContent.texts.text_427a379ae3}<strong>{editableContent.texts.text_0bbfb207b2}</strong>,{' '}
                  <strong>{editableContent.texts.text_d5b3fef0ee}</strong> {editableContent.texts.text_1cd8949058}{' '}
                  <strong>{editableContent.texts.text_ca538eaf54}</strong>.
                </p>
                <MobileDisclosure label="Read Steveoking's full creative story">
                  <p>
                    {editableContent.texts.text_413f39b9fe}</p>
                  <p>
                    {editableContent.texts.text_ffecfe0344}</p>
                </MobileDisclosure>
              </div>
            </div>

            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={editableContent.texts.field_8fd0572178}
                alt={editableContent.texts.field_450626bd27}
              />
              <div className="kr8-subhero__badge">
                <div>
                  <span>{editableContent.texts.text_d6251b5319}</span>
                  <strong>{editableContent.texts.text_f7d786396b}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================== THREE DISCIPLINES */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <SectionAtmosphere name="services-atmosphere" deskOpacity={0.12} mobOpacity={0.22} flare />
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{editableContent.texts.text_98f9ceccf3}</div>
              <h2 className="section-title">
                {editableContent.texts.text_86d02fb445}<span className="text-grad">{editableContent.texts.text_13b7efeb17}</span>
              </h2>
            </div>
          </div>

          <div className="kr8-grid-3" style={{ marginTop: 28 }}>
            {DESIGN_PILLARS.map((d, idx) => (
              <article
                className={`kr8-card ${idx === 0 ? 'kr8-card--accent' : ''} reveal up`}
                key={d.num}
              >
                <div className="kr8-card__num">{d.num}</div>
                <h3 className="kr8-card__title">{d.title}</h3>
                <ResponsiveCopy
                  as="p"
                  className="kr8-card__body"
                  desktop={d.body}
                  mobile={d.mobileBody}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                  {d.tags.map((tag) => (
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

      {/* ===================================== PUBLISHED DESIGN SHOWCASE */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{editableContent.texts.text_2a6e3cf015}</div>
              <h2 className="section-title">{editableContent.texts.text_32a25737b9}</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop={editableContent.texts.field_dadbb4749c}
                mobile={editableContent.texts.field_97baea890c}
              />
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href={editableContent.texts.field_71996fae4a} className="btn-link">
                {editableContent.texts.text_2139850c3b}<Icon name="arrow" size={14} />
              </Link>
              <Link href={editableContent.texts.field_14a852f28e} className="btn-link">
                {editableContent.texts.text_9f6f9d7cf5}<Icon name="arrow" size={14} />
              </Link>
            </div>
          </div>

          <div className="kr8-grid-4" style={{ marginTop: 28 }}>
            {featuredFlyers.map((f) => (
              <article className="kr8-card reveal up" key={f.slug} style={{ padding: 14 }}>
                <div
                  className="kr8-card__media kr8-card__media--tall"
                  style={{ margin: '0 0 12px', aspectRatio: '4 / 5' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.card} alt={formatEditableText(editableContent.texts.copy_21e0d9b8b6, [f.title, f.client])} loading="lazy" />
                </div>
                <div className="kr8-card__num" style={{ marginBottom: 4 }}>
                  {f.kind}
                </div>
                <h3 className="kr8-card__title" style={{ fontSize: 16 }}>
                  {f.title}
                </h3>
                {f.client && (
                  <p className="kr8-card__body" style={{ fontSize: 12.5, marginTop: 4 }}>
                    {editableContent.texts.text_407b45ec2d}{f.client}
                  </p>
                )}
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
              <div className="eyebrow">{editableContent.texts.text_65612a9656}</div>
              <h2 className="section-title">{editableContent.texts.text_c7f2918bb5}</h2>
            </div>
            <Link href={editableContent.texts.field_6cbb86594e} className="btn-link">
              {editableContent.texts.text_b1dbcb4a65}<Icon name="arrow" size={15} />
            </Link>
          </div>

          <div className="kr8-grid-2" style={{ marginTop: 24 }}>
            <Link href={editableContent.texts.field_9fa8f30927} className="kr8-card" style={{ textDecoration: 'none' }}>
              <div className="kr8-card__num">{editableContent.texts.text_049fc61799}</div>
              <h3 className="kr8-card__title">{editableContent.texts.text_0ce53ad94a}</h3>
              <p className="kr8-card__body">
                {editableContent.texts.text_025bca27c5}</p>
              <div className="kr8-card__foot">
                <span className="btn-link">
                  {editableContent.texts.text_c2976959e0}<Icon name="arrow" size={14} />
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
              <span className="kr8-pill">{editableContent.texts.text_47f0102e02}</span>
              <h2 className="section-title" style={{ marginTop: 14 }}>
                {editableContent.texts.text_0081a82a3a}</h2>
              <p className="section-lede" style={{ marginTop: 10 }}>
                {editableContent.texts.text_a465f466d7}</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href={editableContent.texts.field_0c3072e476} className="btn-primary">
                {editableContent.texts.text_8d4170f695}<Icon name="arrow" size={17} />
              </Link>
              <Link href={editableContent.texts.field_14a852f28e} className="btn-ghost">
                {editableContent.texts.text_b5fe7b887a}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

type EditableBlockTypes = { DESIGN_PILLARS: typeof DESIGN_PILLARS };
