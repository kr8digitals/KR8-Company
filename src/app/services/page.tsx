import Link from 'next/link';
import type { Metadata } from 'next';
import services from '../../../data/services.json';
import portfolio from '../../../data/portfolio.json';
import site from '../../../data/site.json';
import PageHero, { ClosingCTA } from '@/components/PageHero';
import { Icon } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Services — websites, brand, video, AI and search',
  description:
    'Five services from one studio: website design and development, brand and graphic design, video editing and motion, AI automation, and search visibility. Built by the people who teach them.',
  alternates: { canonical: '/services' },
};

const QUESTIONS = [
  { q: 'Nobody can find us online.', a: 'Search visibility', href: '/services/seo' },
  { q: 'Our website is slow and embarrassing.', a: 'Website design', href: '/services/website-design' },
  { q: 'We look like every other business.', a: 'Brand & design', href: '/services/brand-graphic-design' },
  { q: 'Our video gets no engagement.', a: 'Video & motion', href: '/services/video-editing' },
  { q: 'We reply to the same questions all day.', a: 'AI automation', href: '/services/ai-automation' },
];

export default function ServicesIndex() {
  const live = portfolio.filter((p) => p.live && p.url);
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={<>Five things we build.<br /><span className="text-grad">One studio that builds them.</span></>}
        lede="Most agencies sell you a package. We would rather sell you the outcome you actually described. Each service below states what it is for, what it costs in effort, and what it produces."
        crumbs={[{ label: 'Services' }]}
        aside={
          <div className="panel" style={{ minWidth: 280 }}>
            <div className="tag" style={{ color: 'var(--magenta)' }}>Start with the symptom</div>
            <p style={{ fontSize: 14, color: 'var(--t-body)', marginTop: 10, lineHeight: 1.6 }}>
              {live.length} live builds · {site.proof.clients} clients worked with
            </p>
            <Link href="/contact" className="btn-primary btn-sm" style={{ marginTop: 18 }}>Get a quote <Icon name="arrow" size={15} /></Link>
          </div>
        }
      />

      <section className="section" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <div className="eyebrow reveal up">Find your problem</div>
          <div className="grid g3 reveal up" style={{ marginTop: 22, gap: 14 }}>
            {QUESTIONS.map((q) => (
              <Link key={q.q} href={q.href} className="panel panel--row">
                <span style={{ color: 'var(--t-muted)', fontSize: 14.5 }}>&ldquo;{q.q}&rdquo;</span>
                <span className="tag" style={{ color: '#fff', fontWeight: 700 }}>{q.a} <Icon name="arrow" size={13} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="grid g2 grid--loose">
            {services.map((s, i) => (
              <article key={s.slug} className="card card--hover reveal up" data-delay={i * 60}>
                <div className="card-top">
                  <div className="icon-box"><Icon name={s.icon} /></div>
                  <span className="tag">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 style={{ fontSize: 26 }}>{s.name}</h3>
                <p style={{ marginTop: 6, color: 'var(--lilac)', fontSize: 14.5 }}>{s.tagline}</p>
                <p style={{ marginTop: 14 }}>{s.summary}</p>
                <ul className="price-list" style={{ marginTop: 18 }}>
                  {s.outcomes.slice(0, 3).map((o) => (
                    <li key={o}><Icon name="check" size={15} /> {o}</li>
                  ))}
                </ul>
                <div style={{ marginTop: 22, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                  <Link href={`/services/${s.slug}`} className="btn-link">Full detail <Icon name="arrow" size={14} /></Link>
                  <Link href={`/contact?service=${s.slug}`} className="btn-link" style={{ color: 'var(--t-muted)' }}>Get a quote</Link>
                </div>
                {s.credit && <p style={{ marginTop: 18, fontSize: 12, color: 'var(--t-faint)' }}>{s.credit}</p>}
              </article>
            ))}
            <article className="card reveal up" data-delay="320" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(160deg, rgba(255,45,155,.14), rgba(124,58,237,.14))' }}>
              <h3 style={{ fontSize: 26 }}>Not sure which one?</h3>
              <p style={{ marginTop: 12 }}>
                Describe the problem in plain words. We will tell you what it actually is — even when the
                answer is &ldquo;you do not need any of these yet&rdquo;.
              </p>
              <div style={{ marginTop: 22, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link href="/contact" className="btn-primary btn-sm">Describe it <Icon name="arrow" size={15} /></Link>
                <button className="btn-ghost btn-sm" data-host-open="1">Ask Ada</button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--tight" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">How every engagement runs</div>
              <h2 className="section-title">The same four steps, whatever you buy</h2>
            </div>
          </div>
          <div className="steps steps--row reveal up">
            {[
              { n: '01', t: 'Diagnostic', d: 'We look at what you have, what it is costing you, and what would have to be true for this to work.' },
              { n: '02', t: 'Scope & price', d: 'A written scope, a fixed figure, a date. No hourly drift and no surprise invoice.' },
              { n: '03', t: 'Build', d: 'You get a preview link you can open on your own phone from day one, and a weekly update.' },
              { n: '04', t: 'Handover', d: 'Files, access, documentation and a walkthrough. You own what you paid for.' },
            ].map((s) => (
              <div className="step" key={s.n}>
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.t}</div>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA
        title="Tell us what you need built."
        copy="Send one paragraph. You get a scope, a fixed figure and a date — or an honest no with a better direction."
        cta="Start a project"
        secondary={{ label: 'See the work', href: '/services/website-design#work' }}
      />
    </>
  );
}
