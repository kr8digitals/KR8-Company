import CmsSections from '@/components/CmsSections';
import { getEditableDocument } from '@/lib/editable-content';
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
  const editableContent = await getEditableDocument("app:[...slug]:page");

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
          {editableContent.texts.text_b09c10bf9c}</div>
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
      <CmsSections sections={page.sections || []} />
    </>
  );
}
