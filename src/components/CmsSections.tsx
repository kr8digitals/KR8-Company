import Link from 'next/link';
import { Icon } from './ui';
import type { CmsPageSection } from '@/lib/cms';

export default function CmsSections({ sections }: { sections: CmsPageSection[] }) {
  return <>
      {sections.map((sec) => (
        <section
          className="section"
          key={sec.id}
          style={{ borderTop: '1px solid var(--hair-soft)' }}
        >
          <div className="wrap">
            {sec.type === 'text' && (
              <div style={{ maxWidth: 780 }}>
                {sec.eyebrow && <div className="eyebrow">{sec.eyebrow}</div>}
                <h2 className="section-title" style={{ marginTop: 10 }}>
                  {sec.title}
                </h2>
                {sec.body && (
                  <div
                    className="prose-lg"
                    style={{ marginTop: 16, whiteSpace: 'pre-line' }}
                  >
                    {sec.body}
                  </div>
                )}
              </div>
            )}

            {sec.type === 'split' && (
              <div className="kr8-grid-2" style={{ alignItems: 'center', gap: 40 }}>
                <div>
                  {sec.eyebrow && <div className="eyebrow">{sec.eyebrow}</div>}
                  <h2 className="section-title" style={{ marginTop: 10 }}>
                    {sec.title}
                  </h2>
                  {sec.body && (
                    <p className="prose-lg" style={{ marginTop: 16, whiteSpace: 'pre-line' }}>
                      {sec.body}
                    </p>
                  )}
                  {sec.ctaLabel && sec.ctaHref && (
                    <div style={{ marginTop: 22 }}>
                      <Link href={sec.ctaHref} className="btn-primary">
                        {sec.ctaLabel} <Icon name="arrow" size={16} />
                      </Link>
                    </div>
                  )}
                </div>
                {sec.image && (
                  <div className="kr8-subhero__frame">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sec.image} alt={sec.imageAlt || sec.title} loading="lazy" />
                  </div>
                )}
              </div>
            )}

            {(sec.type === 'cards' || sec.type === 'faq') && (
              <>
                <div className="sec-head">
                  <div>
                    {sec.eyebrow && <div className="eyebrow">{sec.eyebrow}</div>}
                    <h2 className="section-title">{sec.title}</h2>
                    {sec.body && <p className="section-lede">{sec.body}</p>}
                  </div>
                </div>
                <div className="kr8-grid-3" style={{ marginTop: 32 }}>
                  {(sec.items || []).map((it, idx) => (
                    <article className="kr8-card" key={`${sec.id}-${idx}`}>
                      {it.tag && <div className="kr8-card__num">{it.tag}</div>}
                      <h3 className="kr8-card__title" style={{ fontSize: 20 }}>
                        {it.title}
                      </h3>
                      <p className="kr8-card__body">{it.body}</p>
                    </article>
                  ))}
                </div>
              </>
            )}

            {sec.type === 'cta' && (
              <div className="kr8-cta-banner">
                <div>
                  {sec.eyebrow && <span className="kr8-pill">{sec.eyebrow}</span>}
                  <h2 className="section-title" style={{ marginTop: 12 }}>
                    {sec.title}
                  </h2>
                  {sec.body && (
                    <p className="section-lede" style={{ marginTop: 10 }}>
                      {sec.body}
                    </p>
                  )}
                </div>
                {sec.ctaLabel && sec.ctaHref && (
                  <div>
                    <Link href={sec.ctaHref} className="btn-primary">
                      {sec.ctaLabel} <Icon name="arrow" size={17} />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      ))}
  </>;
}
