import Link from 'next/link';
import { Icon } from './ui';

export default function PageHero({
  eyebrow, title, lede, crumbs, aside, accent,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  crumbs?: { label: string; href?: string }[];
  aside?: React.ReactNode;
  accent?: string;
}) {
  return (
    <section className="page-hero">
      <div className="hero-bg" aria-hidden>
        <div className="blob-1" style={{ opacity: 0.55 }} /><div className="blob-2" style={{ opacity: 0.5 }} />
        <div className="vignette" />
      </div>
      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        {crumbs && (
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
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
            {lede && <p className="lede">{lede}</p>}
            {accent && <p style={{ marginTop: 22, fontSize: 14, color: 'var(--lilac)', maxWidth: 620 }}>{accent}</p>}
          </div>
          {aside && <div>{aside}</div>}
        </div>
      </div>
    </section>
  );
}

export function ClosingCTA({
  title = 'Tell us what you need built.',
  copy = 'One form. A real reply within a working day. If you would rather talk, WhatsApp is on the right.',
  href = '/contact',
  cta = 'Start a project',
  secondary,
}: { title?: string; copy?: string; href?: string; cta?: string; secondary?: { label: string; href: string; out?: boolean } }) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="cta-band reveal up">
          <div className="eyebrow eyebrow--lilac">Next step</div>
          <h2>{title}</h2>
          <p>{copy}</p>
          <div className="actions" style={{ marginTop: 28 }}>
            <Link href={href} className="btn-primary">{cta} <Icon name="arrow" size={17} /></Link>
            {secondary && (secondary.out
              ? <a href={secondary.href} target="_blank" rel="noopener noreferrer" className="btn-ghost">{secondary.label} <span className="arrow-out">↗</span></a>
              : <Link href={secondary.href} className="btn-ghost">{secondary.label}</Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
