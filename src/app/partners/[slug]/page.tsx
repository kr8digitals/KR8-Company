import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import partners from '../../../../data/partners.json';
import PageHero, { ClosingCTA } from '@/components/PageHero';
import { Icon } from '@/components/ui';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return partners.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = partners.find((x) => x.slug === slug);
  if (!p) return { title: 'Partner not found' };
  return {
    title: `${p.name} — partner record`,
    description: p.blurb,
    alternates: { canonical: `/partners/${p.slug}` },
  };
}

export default async function PartnerPage({ params }: Params) {
  const { slug } = await params;
  const p = partners.find((x) => x.slug === slug);
  if (!p) notFound();
  const others = partners.filter((x) => x.slug !== p.slug);

  return (
    <>
      <PageHero
        eyebrow={p.type}
        title={<>{p.name}</>}
        lede={p.blurb}
       
        aside={
          p.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.logo} alt={`${p.name} logo`} style={{ width: 140, height: 140, objectFit: 'contain', borderRadius: 20, background: 'rgba(255,255,255,.05)' }} />
          ) : (
            <div className="partner-mark" style={{ width: 140, height: 140, fontSize: 40 }}>{p.mark}</div>
          )
        }
      />

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="wrap">
          <div className="story">
            <div className="reveal up">
              <div className="eyebrow">Who they are</div>
              <h2 className="section-title" style={{ fontSize: 34 }}>{p.person || p.name}</h2>
              <p style={{ marginTop: 10, fontSize: 14, color: 'var(--lilac)' }}>{p.role}</p>
              <div className="panel" style={{ marginTop: 26, padding: 24 }}>
                <div className="tag" style={{ color: 'var(--magenta)' }}>Contribution</div>
                <p style={{ marginTop: 8, fontSize: 15, color: '#fff', lineHeight: 1.6 }}>{p.contribution}</p>
                {p.teaches && (
                  <>
                    <div className="tag" style={{ color: 'var(--magenta)', marginTop: 18 }}>Teaches</div>
                    <p style={{ marginTop: 8, fontSize: 15, color: '#fff' }}>{p.teaches}</p>
                  </>
                )}
              </div>
            </div>
            <div className="prose-lg reveal up" data-delay="60">
              <p>{p.long}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="reveal up">
            <div className="eyebrow">The record</div>
            <h2 className="section-title" style={{ fontSize: 34 }}>What has actually been delivered</h2>
          </div>
          <div className="tbl-wrap reveal up" style={{ marginTop: 28 }}>
            <div className="panel" style={{ padding: 24 }}>
              <p style={{ fontSize: 15, color: '#fff', lineHeight: 1.65 }}>{p.record || 'No record documented yet.'}</p>
              <p style={{ marginTop: 12, fontSize: 13, color: 'var(--t-faint)' }}>
                A partner&rsquo;s record is written down or it is not a record. Where it has not been documented,
                this page says so rather than inventing a list of projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <div className="sec-head">
            <div><div className="eyebrow">Other partners</div><h2 className="section-title" style={{ fontSize: 32 }}>The rest of the network</h2></div>
            <Link href="/partners" className="btn-link">All partners <Icon name="arrow" size={15} /></Link>
          </div>
          <div className="grid g3" style={{ marginTop: 32 }}>
            {others.map((o) => (
              <Link key={o.slug} href={o.href} className="card card--hover">
                <div className="tag">{o.type}</div>
                <h3 style={{ fontSize: 18, marginTop: 10 }}>{o.name}</h3>
                <p style={{ fontSize: 13, marginTop: 6 }}>{o.contribution}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA
        title={`Partner with ${p.name} and the network.`}
        copy="If you teach a craft, fund a cohort, hire graduates or can host a room, the door is the same one."
        cta="Start a partnership"
        href="/contact?type=partner"
      />
    </>
  );
}
