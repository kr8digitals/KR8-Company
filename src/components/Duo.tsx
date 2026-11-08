import Link from 'next/link';
import { Icon } from './ui';
import { MobileDisclosure, SectionAtmosphere, type CinemaAssetName } from './MobileExperience';

export default function Duo({
  eyebrow,
  title,
  body,
  mobileSummary,
  mobileExpandLabel = 'Read full story',
  bullets,
  media,
  flip = false,
  cta,
  secondary,
  tone,
  cinemaBg,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  mobileSummary?: React.ReactNode;
  mobileExpandLabel?: string;
  bullets?: string[];
  media: { src: string; alt: string; caption?: string }[];
  flip?: boolean;
  cta?: { label: string; href: string; out?: boolean };
  secondary?: { label: string; href: string; out?: boolean };
  tone?: 'plain' | 'band';
  cinemaBg?: CinemaAssetName;
}) {
  const [a, b] = media;
  return (
    <section className={`duo-wrap section ${tone === 'band' ? 'duo-wrap--band' : ''}`}>
      {cinemaBg && <SectionAtmosphere name={cinemaBg} deskOpacity={0.13} mobOpacity={0.22} flare />}
      <div className="wrap">
        <div className={`duo ${flip ? 'duo--flip' : ''} reveal up`}>
          <div className="duo__text">
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            <h2 className="section-title">{title}</h2>

            {body && !mobileSummary && <div className="duo__body">{body}</div>}
            {body && mobileSummary && (
              <>
                <div className="duo__body kr8-desk-only">{body}</div>
                <div className="duo__body kr8-mob-only">
                  {mobileSummary}
                  <MobileDisclosure label={mobileExpandLabel}>{body}</MobileDisclosure>
                </div>
              </>
            )}

            {bullets && (
              <ul className="duo__bullets">
                {bullets.map((bl) => (
                  <li key={bl}>
                    <Icon name="check" size={15} />
                    <span>{bl}</span>
                  </li>
                ))}
              </ul>
            )}
            {(cta || secondary) && (
              <div className="actions" style={{ marginTop: 22 }}>
                {cta &&
                  (cta.out ? (
                    <a href={cta.href} target="_blank" rel="noopener noreferrer" className="btn-primary">
                      {cta.label} <span aria-hidden>↗</span>
                    </a>
                  ) : (
                    <Link href={cta.href} className="btn-primary">
                      {cta.label} <Icon name="arrow" size={16} />
                    </Link>
                  ))}
                {secondary &&
                  (secondary.out ? (
                    <a href={secondary.href} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                      {secondary.label} <span aria-hidden>↗</span>
                    </a>
                  ) : (
                    <Link href={secondary.href} className="btn-ghost">
                      {secondary.label}
                    </Link>
                  ))}
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
