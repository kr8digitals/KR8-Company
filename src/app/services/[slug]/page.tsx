import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import services from '../../../../data/services.json';
import portfolio from '../../../../data/portfolio.json';
import site from '../../../../data/site.json';
import PageHero, { ClosingCTA } from '@/components/PageHero';
import { Icon, WorkRail } from '@/components/ui';
import LeadForm from '@/components/LeadForm';
import ForSale from '@/components/ForSale';
import Pricing from '@/components/Pricing';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) return { title: 'Service not found' };
  return {
    title: `${s.name} — ${s.tagline}`,
    description: s.summary,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: `${s.name} · KR8 Digitals`, description: s.summary },
  };
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();

  const related = portfolio.filter((p) => p.live && p.shot && (p.services || []).includes(s.name)).slice(0, 6);
  const others = services.filter((x) => x.slug !== s.slug);
  const index = services.findIndex((x) => x.slug === s.slug);
  const next = services[(index + 1) % services.length];

  return (
    <>
      <PageHero
        eyebrow={s.short}
        title={<>{s.tagline}</>}
        lede={s.summary}
        crumbs={[{ label: 'Services', href: '/services' }, { label: s.short }]}
        accent={s.credit ? `${s.credit}.` : undefined}
        aside={
          <div className="panel" style={{ minWidth: 290 }}>
            <div className="tag" style={{ color: 'var(--magenta)' }}>Who this is for</div>
            <p style={{ fontSize: 14.5, color: 'var(--t-body)', marginTop: 10, lineHeight: 1.65 }}>{s.forWhom}</p>
            <Link href={`/contact?service=${s.slug}`} className="btn-primary btn-sm" style={{ marginTop: 20 }}>
              Get a quote <Icon name="arrow" size={15} />
            </Link>
          </div>
        }
      />

      {/* problem ------------------------------------------------------------ */}
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="story">
            <div className="reveal up">
              <div className="eyebrow">The problem</div>
              <h2 className="section-title" style={{ fontSize: 42, marginTop: 12 }}>What is actually going wrong</h2>
            </div>
            <div className="prose-lg reveal up" data-delay="60">
              <p>{s.problem}</p>
            </div>
          </div>
        </div>
      </section>

      {/* approach / outcomes ------------------------------------------------ */}
      <section className="section section--tight" style={{ borderTop: '1px solid var(--hair-soft)', borderBottom: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="grid g2 grid--loose">
            <div className="reveal up">
              <div className="eyebrow">How we work</div>
              <h2 className="section-title" style={{ fontSize: 34, marginTop: 12, marginBottom: 26 }}>Our approach, in plain terms</h2>
              <ol style={{ display: 'grid', gap: 20 }}>
                {s.approach.map((a, i) => (
                  <li key={a} style={{ display: 'flex', gap: 16 }}>
                    <span className="step-num" style={{ flex: 'none' }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--t-body)' }}>{a}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="reveal up" data-delay="80">
              <div className="eyebrow">What you get</div>
              <h2 className="section-title" style={{ fontSize: 34, marginTop: 12, marginBottom: 26 }}>Outcomes and deliverables</h2>
              <ul className="price-list">
                {s.outcomes.map((o) => <li key={o}><Icon name="check" size={16} /> {o}</li>)}
              </ul>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 26 }}>
                {s.deliverables.map((d) => <span className="pill" key={d}>{d}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* process ------------------------------------------------------------ */}
      <section className="section">
        <div className="wrap">
          <div className="reveal up">
            <div className="eyebrow">The process</div>
            <h2 className="section-title">Four steps, no mystery</h2>
          </div>
          <div className="steps steps--row reveal up">
            {s.process.map((p) => (
              <div className="step" key={p.n}>
                <div className="step-num">{p.n}</div>
                <div className="step-title">{p.t}</div>
                <p>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* work ---------------------------------------------------------------- */}
      {related.length > 0 && (
        <section className="section section--tight" id="work" style={{ borderTop: '1px solid var(--hair-soft)' }}>
          <div className="wrap">
            <div className="sec-head reveal up">
              <div>
                <div className="eyebrow">Proof</div>
                <h2 className="section-title">This service, already delivered</h2>
              </div>
            </div>
          </div>
          <WorkRail
            items={related.map((w) => ({
              name: w.name, category: w.category, shot: w.shot, href: w.url || undefined, meta: `${w.kind} · ${w.year}`,
            }))}
          />
        </section>
      )}

      <Pricing slug={s.slug} />

      {/* for sale ------------------------------------------------------------ */}
      {(s.slug === 'website-design') && <ForSale />}

      {/* faqs ---------------------------------------------------------------- */}
      <section className="section">
        <div className="wrap" style={{ maxWidth: 900 }}>
          <div className="reveal up">
            <div className="eyebrow">Questions we actually get asked</div>
            <h2 className="section-title" style={{ marginBottom: 32 }}>Before you ask</h2>
          </div>
          <div className="reveal up">
            {s.faqs.map((f) => (
              <details className="faq" key={f.q}>
                <summary>{f.q}<span aria-hidden>+</span></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* quote -------------------------------------------------------------- */}
      <section className="section" id="quote" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="split">
            <div className="reveal up" style={{ maxWidth: 420 }}>
              <div className="eyebrow">Get a figure</div>
              <h2 className="section-title" style={{ fontSize: 40 }}>
                Tell us what {s.short.toLowerCase()} has to achieve
              </h2>
              <p className="section-lede">
                One paragraph on what is failing now is enough. You will get a scope, a fixed figure and a
                date — or an honest answer that this is not the right service for you.
              </p>
              <div className="meta-row" style={{ marginTop: 26 }}>
                <span><b>Reply time</b> within one working day</span>
                <span><b>Call</b> {site.company.phone}</span>
              </div>
            </div>
            <div className="reveal up" data-delay="60">
              <LeadForm variant="quote" defaultService={s.name} siteId={`svc-${s.slug}`} compact />
            </div>
          </div>
        </div>
      </section>

      {/* next service -------------------------------------------------------- */}
      <section className="section section--tight" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="eyebrow">Also from the studio</div>
              <h2 className="section-title" style={{ fontSize: 34 }}>Other services</h2>
            </div>
            <Link href={`/services/${next.slug}`} className="btn-link">Next: {next.short} <Icon name="arrow" size={15} /></Link>
          </div>
          <div className="grid g4" style={{ marginTop: 34 }}>
            {others.map((o) => (
              <Link key={o.slug} href={`/services/${o.slug}`} className="card card--hover">
                <div className="icon-box" style={{ width: 40, height: 40 }}><Icon name={o.icon} size={18} /></div>
                <h3 style={{ fontSize: 17, marginTop: 14 }}>{o.short}</h3>
                <p style={{ fontSize: 13, marginTop: 6 }}>{o.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
