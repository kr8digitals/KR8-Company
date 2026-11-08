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
          <nav className="kr8-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/partners">Partners</Link>
            <span>/</span>
            <span style={{ color: 'var(--t-strong)' }}>{partner.name}</span>
          </nav>

          <div className="kr8-subhero__grid">
            <div>
              <span className="kr8-pill">
                <i className="kr8-pill__dot" /> {partner.type} · KR8 DIGITALS Network
              </span>
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
                Led by {partner.person} · {partner.role}
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
                <Link href="/partners#propose" className="btn-ghost">
                  Partner Like {partner.name}
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
                    <strong>{partner.name} × KR8 DIGITALS</strong>
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
              <div className="kr8-card__num">ROLE INSIDE THE UMBRELLA</div>
              <h2 className="kr8-card__title">How {partner.name} Collaborates With KR8 DIGITALS</h2>
              <ul className="kr8-check-list" style={{ marginTop: 14 }}>
                {meta.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </article>

            <div style={{ display: 'grid', gap: 16 }}>
              <article className="kr8-card" style={{ padding: '24px 28px' }}>
                <div className="kr8-card__num">COMMERCIAL &amp; STRATEGIC CONTRIBUTION</div>
                <h3 className="kr8-card__title" style={{ fontSize: 20 }}>
                  Studio &amp; Ecosystem Scope
                </h3>
                <p className="kr8-card__body">{partner.contribution}</p>
              </article>

              <article className="kr8-card" style={{ padding: '24px 28px' }}>
                <div className="kr8-card__num">EDUCATION &amp; MENTORSHIP TRACK</div>
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
                <div className="eyebrow">KR8 DIGITALS × Motionverse</div>
                <h2 className="section-title">Published design &amp; campaign work.</h2>
              </div>
              <Link href="/contact?service=graphic-design" className="btn-primary">
                Commission Design <Icon name="arrow" size={16} />
              </Link>
            </div>
            <div style={{ marginTop: 26 }}>
              <Showcase mode="flyers" />
            </div>
          </div>
        </section>
      )}

      {partner.slug === 'chigoma' && (
        <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
          <div className="wrap">
            <div className="sec-head reveal up">
              <div>
                <div className="eyebrow">KR8 DIGITALS × Chigoma</div>
                <h2 className="section-title">Published film &amp; documentary cuts.</h2>
              </div>
              <Link href="/contact?service=video-editing" className="btn-primary">
                Commission Video Editing <Icon name="arrow" size={16} />
              </Link>
            </div>
            <div style={{ marginTop: 26 }}>
              <Showcase mode="videos" />
            </div>
          </div>
        </section>
      )}

      {/* ===================================== OTHER PARTNERS & CTA */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            Other Active Partners
          </div>
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
                    Read {op.name} Chapter <Icon name="arrow" size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="kr8-cta-banner reveal up" style={{ marginTop: 34 }}>
            <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.45} mobOpacity={0.55} flare />
            <div>
              <span className="kr8-pill">Open Partner Applications</span>
              <h2 className="section-title" style={{ marginTop: 14 }}>
                Interested in building an alliance with KR8 DIGITALS?
              </h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop="Submit a partnership proposal directly to our leadership team and explore how our organisations can create and teach together."
                mobile="Submit a proposal directly to our founding team to build and teach together."
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/partners#propose" className="btn-primary">
                Propose a Partnership <Icon name="arrow" size={17} />
              </Link>
              <Link href="/partners" className="btn-ghost">
                All Partners
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
