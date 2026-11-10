import CmsSections from '@/components/CmsSections';
import { getEditableDocument } from '@/lib/editable-content';
import { getPublicContent } from '@/lib/public-content';
import Link from 'next/link';
import type { Metadata } from 'next';
import programmesSeed from '../../../data/programmes.json';
import { getCmsPageBySlug, getCmsPrograms, getCmsSeoForRoute } from '@/lib/cms';
import { Icon } from '@/components/ui';
import {
  MobileDisclosure,
  ResponsiveCopy,
  SectionAtmosphere,
} from '@/components/MobileExperience';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const publicData = await getPublicContent();
  const programmesSeed = publicData.programmes;

  const seo = await getCmsSeoForRoute('/programs');
  return {
    title:
      seo?.metaTitle ||
      'Programs — Free Digital Training, KR8 DIGITALS TRIBE, Mindset Shift & Studio Pathway',
    description:
      seo?.metaDescription ||
      'Explore KR8 DIGITALS ecosystem programs: 100% tuition-free digital skills and academic training, KR8 DIGITALS TRIBE community, Mindset Shift leadership forum, and Join the Team.',
    alternates: { canonical: '/programs' },
    robots: seo?.noindex ? { index: false, follow: false } : undefined,
  };
}

const AUDIENCE_FIT = [
  {
    slug: 'free-training',
    who: 'Aspiring Designers, Developers, Editors & Secondary Students',
    gain: 'Structured practical mentorship across 7 digital tracks via KR8 Academy or WAEC/JAMB academic excellence via Next Gen Scholars — 100% tuition-free.',
  },
  {
    slug: 'tribe',
    who: 'Working Creatives, Academy Alumni & Self-Taught Builders',
    gain: 'Honest work-in-progress critique, interdisciplinary sprint teams, peer accountability, and shared creative opportunities.',
  },
  {
    slug: 'mindset-shift',
    who: 'Young Founders, Freelancers, Students & Ambitious Professionals',
    gain: 'Candid practitioner conversations on career longevity, discipline, ethical value creation, and execution habits.',
  },
  {
    slug: 'join-the-team',
    who: 'Proven Engineers, Designers, Video Editors & SEO Specialists',
    gain: 'Merit-based onboarding onto real commercial client deliveries inside the KR8 DIGITALS studio.',
  },
];

export default async function ProgramsPage() {
  const editableContent = await getEditableDocument("app:programs:page");
  const AUDIENCE_FIT = editableContent.blocks.AUDIENCE_FIT as EditableBlockTypes["AUDIENCE_FIT"];

  const publicData = await getPublicContent();
  const programmesSeed = publicData.programmes;

  const [cmsPrograms, pageDoc] = await Promise.all([
    getCmsPrograms(),
    getCmsPageBySlug('programs'),
  ]);
  const programmes = {
    ...programmesSeed,
    programmes: cmsPrograms,
  };
  return (
    <>
      {/* ============================================================ HERO */}
      <section className="kr8-subhero">
        <SectionAtmosphere name="academy-cohort-cinema" deskOpacity={0.18} mobOpacity={0.3} flare />
        <div className="wrap">
          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill">
                <i className="kr8-pill__dot" /> {pageDoc?.eyebrow || programmes.intro.eyebrow}
              </span>
              <h1 className="kr8-subhero__title">
                {pageDoc?.heroTitle || editableContent.texts.copy_a0ae5e075a}{' '}
                <em>{pageDoc?.heroHighlight || editableContent.texts.copy_fc281bf831}</em>
              </h1>
              <ResponsiveCopy
                as="p"
                className="kr8-subhero__lede"
                desktop={pageDoc?.heroLede || programmes.intro.lede}
                mobile={editableContent.texts.field_cd82b8cefc}
              />
              <div className="kr8-subhero__actions">
                <a
                  href={editableContent.texts.field_fd6b7397b2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  {editableContent.texts.text_9968032c97}<Icon name="external" size={16} />
                </a>
                <a href={editableContent.texts.field_9373c53d9b} className="btn-ghost">
                  {editableContent.texts.text_7eb3bade98}</a>
              </div>
            </div>

            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={programmes.intro.image} alt={programmes.intro.imageAlt} />
              <div className="kr8-subhero__badge">
                <div>
                  <span>{editableContent.texts.text_53c4eaa67f}</span>
                  <strong>{editableContent.texts.text_327eed8eec}</strong>
                </div>
                <Link href={editableContent.texts.field_3df0ed1318} className="btn-link" style={{ whiteSpace: 'nowrap' }}>
                  {editableContent.texts.text_d6d8889112}<Icon name="arrow" size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================== COMMERCIAL SERVICES VS ECOSYSTEM PROGRAMS */}
      <section className="section" style={{ paddingBottom: 24 }}>
        <div className="wrap">
          <div className="kr8-grid-2">
            <div className="kr8-card kr8-card--accent">
              <div className="kr8-card__num">{editableContent.texts.text_904b50db44}</div>
              <h2 className="kr8-card__title">{editableContent.texts.text_8b77b2d0d0}</h2>
              <ResponsiveCopy
                as="p"
                className="kr8-card__body"
                desktop={editableContent.texts.field_3e251053da}
                mobile={editableContent.texts.field_b482eb3fed}
              />
            </div>
            <div className="kr8-card">
              <div className="kr8-card__num">{editableContent.texts.text_3c6c122724}</div>
              <h2 className="kr8-card__title">{editableContent.texts.text_db0c93c2b6}</h2>
              <ResponsiveCopy
                as="p"
                className="kr8-card__body"
                desktop={editableContent.texts.field_7241b2f904}
                mobile={editableContent.texts.field_39d4015790}
              />
              <div className="kr8-card__foot">
                <Link href={editableContent.texts.field_3b1aeccb74} className="btn-link">
                  {editableContent.texts.text_b5324b7b23}<Icon name="arrow" size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= ALL 4 PROGRAMS IN DEPTH */}
      <section className="section" id="program-lineup">
        <SectionAtmosphere name="nextgen-scholars-cinema" deskOpacity={0.11} mobOpacity={0.2} flare />
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{editableContent.texts.text_808eecfbbe}</div>
              <h2 className="section-title">
                {editableContent.texts.text_bb2531317a}<span className="text-grad">{editableContent.texts.text_fa025140af}</span>
              </h2>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 26, marginTop: 28 }}>
            {programmes.programmes.map((p: any, idx: number) => {
              const fit = AUDIENCE_FIT.find((a) => a.slug === p.slug);
              const pillClass =
                p.status === 'open' || p.status === 'active'
                  ? "kr8-pill kr8-pill--green"
                  : "kr8-pill kr8-pill--amber";

              return (
                <article
                  className="kr8-card reveal up"
                  id={p.slug}
                  key={p.slug}
                  style={{ scrollMarginTop: 96, padding: 'clamp(20px, 3.2vw, 40px)' }}
                >
                  <div className="kr8-grid-2 prog-split-grid" style={{ alignItems: 'center', gap: 28 }}>
                    <div className={idx % 2 === 1 ? 'prog-col-text--alt' : 'prog-col-text'}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                        <span className="kr8-card__num" style={{ marginBottom: 0 }}>
                          {editableContent.texts.text_2e1e603e41}{String(idx + 1).padStart(2, '0')} · {p.type}
                        </span>
                        <span className={pillClass}>
                          <i className="kr8-pill__dot" /> {p.statusLabel}
                        </span>
                      </div>

                      <h3
                        className="kr8-card__title"
                        style={{ fontSize: 'clamp(21px, 2.6vw, 34px)', marginTop: 12 }}
                      >
                        {p.name}
                      </h3>
                      <p
                        style={{
                          marginTop: 8,
                          fontSize: 15,
                          fontWeight: 500,
                          color: 'var(--t-strong)',
                          lineHeight: 1.52,
                        }}
                      >
                        {p.lede}
                      </p>

                      {/* Desktop full program detail; Mobile progressive disclosure */}
                      <div className="kr8-desk-only">
                        <p className="kr8-card__body" style={{ marginTop: 12 }}>
                          {p.body}
                        </p>
                        {fit && (
                          <div
                            style={{
                              marginTop: 18,
                              padding: '14px 18px',
                              borderRadius: 14,
                              background: 'var(--surface-subtle)',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            <div
                              style={{
                                fontFamily: 'var(--f-mono)',
                                fontSize: 11,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                color: 'var(--magenta)',
                              }}
                            >
                              {editableContent.texts.text_8a3e07456b}{fit.who}
                            </div>
                            <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6, color: 'var(--t-body)' }}>
                              {fit.gain}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="kr8-mob-only">
                        <MobileDisclosure label={`Program details & who ${p.name} is for`}>
                          <p>{p.body}</p>
                          {fit && (
                            <p>
                              <strong>{editableContent.texts.text_c91fcbcecc}{fit.who}:</strong> {fit.gain}
                            </p>
                          )}
                        </MobileDisclosure>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                        {p.tracks.map((t: string) => (
                          <span className="tag" key={t}>
                            {t}
                          </span>
                        ))}
                      </div>

                      {'editionsNote' in p && p.editionsNote && (
                        <p
                          style={{
                            marginTop: 12,
                            fontSize: 12.5,
                            color: 'var(--t-sub)',
                            fontStyle: 'italic',
                          }}
                        >
                          {p.editionsNote}
                        </p>
                      )}

                      <div className="kr8-subhero__actions" style={{ marginTop: 18 }}>
                        {p.action.outbound ? (
                          <a
                            href={p.action.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                          >
                            {p.action.label} <Icon name="external" size={16} />
                          </a>
                        ) : (
                          <Link href={p.action.href} className="btn-primary">
                            {p.action.label} <Icon name="arrow" size={16} />
                          </Link>
                        )}
                        <span style={{ fontSize: 12.5, color: 'var(--t-sub)' }}>{p.commitment}</span>
                      </div>
                    </div>

                    <div className={idx % 2 === 1 ? 'prog-col-media--alt' : 'prog-col-media'}>
                      <div className="kr8-subhero__frame">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.imageAlt} loading="lazy" />
                      </div>

                      {p.doors && p.doors.length > 0 && (
                        <div className="kr8-grid-2" style={{ marginTop: 14, gap: 12 }}>
                          {p.doors.map((d: any) => (
                            <div
                              key={d.name}
                              style={{
                                padding: 15,
                                borderRadius: 14,
                                background: 'var(--surface-subtle)',
                                border: '1px solid var(--border-subtle)',
                              }}
                            >
                              <div className="kr8-card__num" style={{ marginBottom: 4 }}>
                                {d.partner}
                              </div>
                              <strong style={{ display: 'block', fontSize: 14.5, color: 'var(--t-strong)' }}>{d.name}</strong>
                              <p style={{ fontSize: 12.8, lineHeight: 1.5, color: 'var(--t-sub)', marginTop: 5 }}>
                                {d.line}
                              </p>
                              <div style={{ marginTop: 10 }}>
                                {d.outbound ? (
                                  <a
                                    href={d.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-link"
                                  >
                                    {d.cta} <Icon name="external" size={13} />
                                  </a>
                                ) : (
                                  <Link href={d.href} className="btn-link">
                                    {d.cta} <Icon name="arrow" size={13} />
                                  </Link>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================= ECOSYSTEM PRINCIPLES */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{editableContent.texts.text_b2faf8eae9}</div>
              <h2 className="section-title">{editableContent.texts.text_f0625cf8fa}</h2>
            </div>
          </div>

          <div className="kr8-grid-3" style={{ marginTop: 26 }}>
            {programmes.principles.map((pr, i) => (
              <article className="kr8-card reveal up" key={pr.t}>
                <div className="kr8-card__num">{editableContent.texts.text_af695005a0}{i + 1}</div>
                <h3 className="kr8-card__title">{pr.t}</h3>
                <p className="kr8-card__body">{pr.d}</p>
              </article>
            ))}
          </div>

          <div className="kr8-cta-banner reveal up" style={{ marginTop: 36 }}>
            <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.45} mobOpacity={0.55} flare />
            <div>
              <span className="kr8-pill">{editableContent.texts.text_45eb688745}</span>
              <h2 className="section-title" style={{ marginTop: 14 }}>
                {editableContent.texts.text_caec91ba1c}</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop={editableContent.texts.field_1f325b89c1}
                mobile={editableContent.texts.field_bacd01e85f}
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href={editableContent.texts.field_e97169a86c} className="btn-primary">
                {editableContent.texts.text_1c8ed1d77f}<Icon name="arrow" size={17} />
              </Link>
              <Link href={editableContent.texts.field_4eb9506365} className="btn-ghost">
                {editableContent.texts.text_59d01e78d7}</Link>
            </div>
          </div>
        </div>
      </section>
      <CmsSections sections={pageDoc?.sections || []} />
    </>
  );
}

type EditableBlockTypes = { AUDIENCE_FIT: typeof AUDIENCE_FIT };
