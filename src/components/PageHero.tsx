import { getEditableDocument } from '@/lib/editable-content';
import Link from 'next/link';
import { Icon } from './ui';
import { SectionAtmosphere, type CinemaAssetName } from './MobileExperience';

export default async function PageHero({
  eyebrow,
  title,
  lede,
  mobileLede,
  crumbs,
  aside,
  accent,
  cinemaBg,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  mobileLede?: string;
  crumbs?: { label: string; href?: string }[];
  aside?: React.ReactNode;
  accent?: string;
  cinemaBg?: CinemaAssetName;
}) {
  const editableContent = await getEditableDocument("components:PageHero");

  return (
    <section className="page-hero">
      <div className="hero-bg" aria-hidden>
        <div className="blob-1" style={{ opacity: 0.52 }} />
        <div className="blob-2" style={{ opacity: 0.46 }} />
        <div className="vignette" />
      </div>
      {cinemaBg && <SectionAtmosphere name={cinemaBg} deskOpacity={0.18} mobOpacity={0.3} flare />}

      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        {crumbs && (
          <nav className="breadcrumb" aria-label={editableContent.texts.field_2bd873d6c7}>
            <Link href="/">{editableContent.texts.text_3a78695388}</Link>
            {crumbs.map((c) => (
              <span key={c.label}>
                <span aria-hidden>/</span>
                {c.href ? <Link href={c.href}>{c.label}</Link> : <b aria-current="page">{c.label}</b>}
              </span>
            ))}
          </nav>
        )}
        <div className={aside ? 'split' : undefined} style={aside ? { alignItems: 'end', gap: 48 } : undefined}>
          <div>
            <div className="eyebrow">{eyebrow}</div>
            <h1>{title}</h1>
            {lede && !mobileLede && <p className="lede">{lede}</p>}
            {lede && mobileLede && (
              <>
                <p className="lede kr8-desk-only">{lede}</p>
                <p className="lede kr8-mob-only">{mobileLede}</p>
              </>
            )}
            {accent && (
              <p style={{ marginTop: 18, fontSize: 13.5, color: 'var(--lilac)', maxWidth: 620 }}>{accent}</p>
            )}
          </div>
          {aside && <div>{aside}</div>}
        </div>
      </div>
    </section>
  );
}

export async function ClosingCTA({
  title = 'Tell us what you need built.',
  copy = 'One form. A real reply within a working day. If you would rather talk, WhatsApp is on the right.',
  mobileCopy,
  href = '/contact',
  cta = 'Start a project',
  secondary,
}: {
  title?: string;
  copy?: string;
  mobileCopy?: string;
  href?: string;
  cta?: string;
  secondary?: { label: string; href: string; out?: boolean };
}) {
  const editableContent = await getEditableDocument("components:PageHero");

  return (
    <section className="section">
      <div className="wrap">
        <div className="cta-band cta-band--cinema reveal up">
          <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.52} mobOpacity={0.62} flare />
          <div className="eyebrow eyebrow--lilac">{editableContent.texts.text_298a9207a7}</div>
          <h2>{title}</h2>
          {mobileCopy ? (
            <>
              <p className="kr8-desk-only">{copy}</p>
              <p className="kr8-mob-only">{mobileCopy}</p>
            </>
          ) : (
            <p>{copy}</p>
          )}
          <div className="actions" style={{ marginTop: 24 }}>
            <Link href={href} className="btn-primary">
              {cta} <Icon name="arrow" size={17} />
            </Link>
            {secondary &&
              (secondary.out ? (
                <a href={secondary.href} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  {secondary.label} <span className="arrow-out">↗</span>
                </a>
              ) : (
                <Link href={secondary.href} className="btn-ghost">
                  {secondary.label}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
