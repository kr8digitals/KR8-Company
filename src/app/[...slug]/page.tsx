import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { getCmsPageBySlug } from '@/lib/cms';
import { COOKIE, verifyToken } from '@/lib/auth';
import { Icon } from '@/components/ui';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ preview?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const pathSlug = slug.join('/');
  const jar = await cookies();
  const canPreview = sp.preview === '1' && verifyToken(jar.get(COOKIE)?.value);
  const page = await getCmsPageBySlug(pathSlug, { preview: canPreview });
  if (!page || page.isSystem) return { title: 'Page Not Found | KR8 DIGITALS' };

  return {
    title: page.metaTitle || `${page.title} | KR8 DIGITALS`,
    description: page.metaDescription || page.heroLede,
    alternates: { canonical: `/${page.slug}` },
    robots: page.noindex ? { index: false, follow: false } : { index: true, follow: true },
    ...(page.ogImage ? { openGraph: { images: [{ url: page.ogImage }] } } : {}),
  };
}

export default async function DynamicCmsPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const pathSlug = slug.join('/');

  const jar = await cookies();
  const canPreview = sp.preview === '1' && verifyToken(jar.get(COOKIE)?.value);
  const page = await getCmsPageBySlug(pathSlug, { preview: canPreview });

  if (!page || page.isSystem) notFound();

  return (
    <>
      {page.status === 'draft' && (
        <div
          style={{
            position: 'sticky',
            top: 74,
            zIndex: 40,
            padding: '10px 20px',
            background: 'rgba(245, 158, 11, 0.92)',
            color: '#090512',
            fontWeight: 700,
            fontSize: 13,
            textAlign: 'center',
          }}
        >
          DRAFT PREVIEW MODE — Only visible to signed-in administrators. Publish inside /admin to make public.
        </div>
      )}

      {/* ============================================================ HERO */}
      <section className="kr8-subhero">
        <div className="wrap">
          <div className={page.heroImage ? 'kr8-subhero__grid' : undefined}>
            <div style={!page.heroImage ? { maxWidth: 780 } : undefined}>
              {page.eyebrow && (
                <span className="kr8-pill">
                  <i className="kr8-pill__dot" /> {page.eyebrow}
                </span>
              )}
              <h1 className="kr8-subhero__title">
                {page.heroTitle || page.title}{' '}
                {page.heroHighlight && <em>{page.heroHighlight}</em>}
              </h1>
              {page.heroLede && <p className="kr8-subhero__lede">{page.heroLede}</p>}
              {(page.primaryCtaLabel || page.secondaryCtaLabel) && (
                <div className="kr8-subhero__actions">
                  {page.primaryCtaLabel && page.primaryCtaHref && (
                    <Link href={page.primaryCtaHref} className="btn-primary">
                      {page.primaryCtaLabel} <Icon name="arrow" size={17} />
                    </Link>
                  )}
                  {page.secondaryCtaLabel && page.secondaryCtaHref && (
                    <Link href={page.secondaryCtaHref} className="btn-ghost">
                      {page.secondaryCtaLabel}
                    </Link>
                  )}
                </div>
              )}
            </div>

            {page.heroImage && (
              <div className="kr8-subhero__frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={page.heroImage} alt={page.heroImageAlt || page.title} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================================== CUSTOM SECTIONS */}
      {(page.sections || []).map((sec) => (
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
    </>
  );
}
