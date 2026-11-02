import Link from 'next/link';
import { Icon } from './ui';

/**
 * The alternating section.
 *
 * Text on one side, real imagery on the other, and the columns swap on every
 * successive instance so no two sections in a row read the same way. Two
 * images stack for depth on desktop and collapse to one on a phone.
 */
export default function Duo({
  eyebrow,
  title,
  body,
  bullets,
  media,
  flip = false,
  cta,
  secondary,
  tone,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  bullets?: string[];
  media: { src: string; alt: string; caption?: string }[];
  flip?: boolean;
  cta?: { label: string; href: string; out?: boolean };
  secondary?: { label: string; href: string; out?: boolean };
  tone?: 'plain' | 'band';
}) {
  const [a, b] = media;
  return (
    <section className={`duo-wrap section ${tone === 'band' ? 'duo-wrap--band' : ''}`}>
      <div className="wrap">
        <div className={`duo ${flip ? 'duo--flip' : ''} reveal up`}>
          <div className="duo__text">
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            <h2 className="section-title">{title}</h2>
            {body && <div className="duo__body">{body}</div>}
            {bullets && (
              <ul className="duo__bullets">
                {bullets.map((b) => (
                  <li key={b}><Icon name="check" size={15} /><span>{b}</span></li>
                ))}
              </ul>
            )}
            {(cta || secondary) && (
              <div className="actions" style={{ marginTop: 26 }}>
                {cta && (cta.out
                  ? <a href={cta.href} target="_blank" rel="noopener noreferrer" className="btn-primary">{cta.label} <span aria-hidden>↗</span></a>
                  : <Link href={cta.href} className="btn-primary">{cta.label} <Icon name="arrow" size={16} /></Link>)}
                {secondary && (secondary.out
                  ? <a href={secondary.href} target="_blank" rel="noopener noreferrer" className="btn-ghost">{secondary.label} <span aria-hidden>↗</span></a>
                  : <Link href={secondary.href} className="btn-ghost">{secondary.label}</Link>)}
              </div>
            )}
          </div>

          <div className="duo__media">
            <figure className="duo__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.src} alt={a.alt} loading="lazy" decoding="async" />
              {a.caption && <figcaption>{a.caption}</figcaption>}
            </figure>
            {b && (
              <figure className="duo__frame duo__frame--b">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.src} alt={b.alt} loading="lazy" decoding="async" />
              </figure>
            )}
            <span className="duo__glow" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
