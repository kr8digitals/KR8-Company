import { getEditableDocument } from '@/lib/editable-content';
import { getSiteCatalog } from '@/lib/site-content';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getCmsPartners } from '@/lib/cms';
import { Icon } from '@/components/ui';
import Showcase from '@/components/Showcase';
import {
  CinemaVisual,
  ResponsiveCopy,
  SectionAtmosphere,
  type CinemaAssetName,
} from '@/components/MobileExperience';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === 'his-battle-axe') return { title: 'Partners | KR8 DIGITALS' };
  const partners = await getCmsPartners();
  const p = partners.find((x: any) => x.slug === slug);
  if (!p) return { title: 'Partner Not Found | KR8 DIGITALS' };
  return {
    title: `${p.name} — ${p.role} | KR8 DIGITALS Partner`,
    description: p.blurb,
    alternates: { canonical: `/partners/${p.slug}` },
  };
}

const PARTNER_META: Record<
  string,
  {
    heroImg: string;
    heroAlt: string;
    atmo: CinemaAssetName;
    founderHref?: string;
    founderBtn?: string;
    highlights: string[];
  }
> = {
  motionverse: {
    heroImg: '/img/services/motionverse-studio.webp',
    heroAlt: 'Motionverse × KR8 DIGITALS sunlit brand and graphic design studio',
    atmo: 'founder-craft-design',
    founderHref: '/about/steveoking',
    founderBtn: 'Read About Stevenson',
    highlights: [
      'Co-Founding Brand & Visual Design Practice led by Steveoking (Stevenson)',
      'Directs commercial brand identity systems, retail key art, and campaign flyers',
      'Leads hands-on Graphic Design instruction inside KR8 Academy tuition-free cohorts',
      'Publicly credited across joint KR8 DIGITALS × Motionverse client deliverables',
    ],
  },
  chigoma: {
    heroImg: '/img/services/video-editing-suite.webp',
    heroAlt: 'Video editing and post-production studio Chigoma at KR8 DIGITALS',
    atmo: 'founder-craft-film',
    founderHref: '/about/creative-expression',
    founderBtn: 'Read About Creative Expression',
    highlights: [
      'Co-Founding Video & Post-Production Practice led by Creative Expression (Daniel Akachukwu Augustine)',
      'Produces retention-cut commercial reels, documentary stories, and social video campaigns',
      'Leads Video Editing & Motion Storytelling mentorship inside KR8 Academy',
      'Delivers multi-aspect masters with clean dialogue audio, captions, and color grading',
    ],
  },
  'next-gen-scholars': {
    heroImg: '/img/programs/free-training-academy.webp',
    heroAlt: 'Next Gen Scholars academic mentorship pathway with KR8 DIGITALS',
    atmo: 'nextgen-scholars-cinema',
    founderHref: '/programs#free-training',
    founderBtn: 'Explore Free Training Doors',
    highlights: [
      'Official Academic Partner powering the academic arm of KR8 DIGITALS’ free training ecosystem',
      'Equips secondary and pre-university students across Sciences and Arts',
      'Focused WAEC and JAMB examination readiness taught with structured weekly accountability',
      'Bridges strong academic foundations with KR8 Academy’s practical digital skill tracks',
    ],
  },
};

export default async function PartnerChapterPage({ params }: Props) {
  const editableContent = await getEditableDocument("app:partners:[slug]:page");
  const PARTNER_META = editableContent.blocks.PARTNER_META as EditableBlockTypes["PARTNER_META"];

  const { slug } = await params;

  if (slug === 'his-battle-axe') {
    redirect('/partners');
  }

  const partners = await getCmsPartners();
  const partner = partners.find((x: any) => x.slug === slug);
  if (!partner) notFound();

  const meta = PARTNER_META[partner.slug] || {
    heroImg: '/img/partners/partnership-collaboration.webp',
    heroAlt: `${partner.name} partnership with KR8 DIGITALS`,
    atmo: 'partners-alliance-cinema' as CinemaAssetName,
    highlights: [partner.contribution, partner.teaches, partner.record].filter(Boolean),
  };

  const otherPartners = partners.filter((x: any) => x.slug !== partner.slug);

  return (
    <>
      {/* ============================================================ HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name={meta.atmo} deskOpacity={0.2} mobOpacity={0.32} flare />
        <div className="wrap">
          <nav className="kr8-breadcrumb" aria-label={editableContent.texts.field_2bd873d6c7}>
            <Link href="/">{editableContent.texts.text_3a78695388}</Link>
            <span>/</span>
            <Link href={editableContent.texts.field_6d0f8c425c}>{editableContent.texts.text_5dab502bfb}</Link>
            <span>/</span>
            <span style={{ color: 'var(--t-strong)' }}>{partner.name}</span>
          </nav>

          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill">
                <i className="kr8-pill__dot" /> {partner.type} {editableContent.texts.text_e13b187903}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
                <div className="partner-tile__mark" aria-hidden="true">
                  <span>{partner.mark}</span>
                </div>
                <h1 className="kr8-subhero__title" style={{ marginTop: 0 }}>
                  {partner.name}
                </h1>
              </div>

              <p
                style={{
                  marginTop: 10,
                  fontFamily: 'var(--f-mono)',
                  fontSize: 12,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: 'var(--magenta)',
                }}
              >
                {editableContent.texts.text_3f7d52ef9f}{partner.person} · {partner.role}
              </p>

              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={partner.long}
                mobile={partner.blurb || partner.long}
              />

              <div className="kr8-subhero__actions">
                {meta.founderHref && meta.founderBtn && (
                  <Link href={meta.founderHref} className="btn-primary">
                    {meta.founderBtn} <Icon name="arrow" size={17} />
                  </Link>
                )}
                <Link href={editableContent.texts.field_e97169a86c} className="btn-ghost">
                  {editableContent.texts.text_24b4135735}{partner.name}
                </Link>
              </div>
            </div>

            {partner.slug === 'next-gen-scholars' ? (
              <CinemaVisual
                name="nextgen-scholars-cinema"
                alt={meta.heroAlt}
                badge={partner.type}
                caption={`${partner.name} × KR8 DIGITALS — Sciences, Arts, WAEC & JAMB`}
                aspect="16 / 10"
                mobileAspect="16 / 10"
              />
            ) : (
              <div className="kr8-subhero__frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={meta.heroImg} alt={meta.heroAlt} />
                <div className="kr8-subhero__badge">
                  <div>
                    <span>{partner.type}</span>
                    <strong>{partner.name} {editableContent.texts.text_78d7580d32}</strong>
                  </div>
                  <span style={{ color: 'var(--t-lilac-strong)' }}>{partner.mark}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================================== CONTRIBUTION MATRIX */}
      <section className="section">
        <div className="wrap">
          <div className="kr8-grid-2" style={{ gap: 22 }}>
            <article className="kr8-card kr8-card--accent">
              <div className="kr8-card__num">{editableContent.texts.text_773212890a}</div>
              <h2 className="kr8-card__title">{editableContent.texts.text_08418a26fc}{partner.name} {editableContent.texts.text_f2b4a37ab6}</h2>
              <ul className="kr8-check-list" style={{ marginTop: 14 }}>
                {meta.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </article>

            <div style={{ display: 'grid', gap: 16 }}>
              <article className="kr8-card" style={{ padding: '24px 28px' }}>
                <div className="kr8-card__num">{editableContent.texts.text_9ba9a80c89}</div>
                <h3 className="kr8-card__title" style={{ fontSize: 20 }}>
                  {editableContent.texts.text_d64fe61394}</h3>
                <p className="kr8-card__body">{partner.contribution}</p>
              </article>

              <article className="kr8-card" style={{ padding: '24px 28px' }}>
                <div className="kr8-card__num">{editableContent.texts.text_e82c31fa36}</div>
                <h3 className="kr8-card__title" style={{ fontSize: 20 }}>
                  {partner.teaches}
                </h3>
                <p className="kr8-card__body">{partner.record}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================== LIVE PARTNER WORK */}
      {partner.slug === 'motionverse' && (
        <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
          <div className="wrap">
            <div className="sec-head reveal up">
              <div>
                <div className="eyebrow">{editableContent.texts.text_d6251b5319}</div>
                <h2 className="section-title">{editableContent.texts.text_2b52115757}</h2>
              </div>
              <Link href={editableContent.texts.field_8bffa0643a} className="btn-primary">
                {editableContent.texts.text_20e08d19a1}<Icon name="arrow" size={16} />
              </Link>
            </div>
            <div style={{ marginTop: 26 }}>
              <Showcase catalog={await getSiteCatalog()} mode="flyers" />
            </div>
          </div>
        </section>
      )}

      {partner.slug === 'chigoma' && (
        <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
          <div className="wrap">
            <div className="sec-head reveal up">
              <div>
                <div className="eyebrow">{editableContent.texts.text_75adce0e26}</div>
                <h2 className="section-title">{editableContent.texts.text_dbb6f5cc6c}</h2>
              </div>
              <Link href={editableContent.texts.field_877fc4ac7b} className="btn-primary">
                {editableContent.texts.text_97cb8b7eed}<Icon name="arrow" size={16} />
              </Link>
            </div>
            <div style={{ marginTop: 26 }}>
              <Showcase catalog={await getSiteCatalog()} mode="videos" />
            </div>
          </div>
        </section>
      )}

      {/* ===================================== OTHER PARTNERS & CTA */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            {editableContent.texts.text_d953222b38}</div>
          <div className="kr8-grid-2">
            {otherPartners.map((op: any) => (
              <Link
                href={op.href}
                key={op.slug}
                className="kr8-card"
                style={{ textDecoration: 'none', padding: '24px 28px' }}
              >
                <div className="kr8-card__num">{op.type}</div>
                <h3 className="kr8-card__title">{op.name}</h3>
                <p className="kr8-card__body">{op.blurb}</p>
                <div className="kr8-card__foot">
                  <span className="btn-link">
                    {editableContent.texts.text_1902cdc703}{op.name} {editableContent.texts.text_855d5a5345}<Icon name="arrow" size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="kr8-cta-banner reveal up" style={{ marginTop: 34 }}>
            <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.45} mobOpacity={0.55} flare />
            <div>
              <span className="kr8-pill">{editableContent.texts.text_efe8b8f800}</span>
              <h2 className="section-title" style={{ marginTop: 14 }}>
                {editableContent.texts.text_ba01b7f137}</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop={editableContent.texts.field_16b8a57c71}
                mobile={editableContent.texts.field_abc8bb9e8f}
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href={editableContent.texts.field_e97169a86c} className="btn-primary">
                {editableContent.texts.text_1c8ed1d77f}<Icon name="arrow" size={17} />
              </Link>
              <Link href={editableContent.texts.field_6d0f8c425c} className="btn-ghost">
                {editableContent.texts.text_7894eddc23}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

type EditableBlockTypes = { PARTNER_META: typeof PARTNER_META };
