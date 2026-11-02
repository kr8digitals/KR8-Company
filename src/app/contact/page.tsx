import type { Metadata } from 'next';
import { Suspense } from 'react';
import site from '../../../data/site.json';
import PageHero from '@/components/PageHero';
import ContactRouter from '@/components/ContactRouter';
import { Icon } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Contact — start a project, partner or apply',
  description:
    'One form, routed to whoever can actually answer it. Quotes, partnerships, applications and general questions for KR8 Digitals.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Tell us what you need.</>}
        lede="One form, routed to whoever can actually answer it. Quotes are scoped by the person who will build the thing, not a salesperson reading a script."
        crumbs={[{ label: 'Contact' }]}
        aside={
          <div className="panel" style={{ minWidth: 300 }}>
            <div className="tag" style={{ color: 'var(--magenta)' }}>Prefer to talk?</div>
            <a href={`https://wa.me/${site.company.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm" style={{ marginTop: 14 }}>
              <Icon name="wa" size={16} /> WhatsApp
            </a>
            <div style={{ marginTop: 18, display: 'grid', gap: 8, fontSize: 13.5, color: 'var(--t-muted)' }}>
              <span><b style={{ color: '#fff' }}>{site.company.phone}</b> — calls and WhatsApp</span>
              <span><b style={{ color: '#fff' }}>{site.company.email}</b></span>
              <span>{site.company.locations.join(' · ')}</span>
            </div>
            <p style={{ marginTop: 16, fontSize: 12, color: 'var(--t-faint)', lineHeight: 1.6 }}>
              Hours: Monday to Saturday, 9am–7pm WAT. Messages sent outside those hours are answered the
              next working morning.
            </p>
          </div>
        }
      />

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="wrap">
          <Suspense fallback={<div className="panel"><span className="spinner" /></div>}>
            <ContactRouter />
          </Suspense>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <div className="grid g3">
            {[
              { t: 'For a project', d: 'A website, a brand, a video, an automation. Expect a scope and a fixed figure, not a range.', href: '#form', label: 'Quote form' },
              { t: 'For a partnership', d: 'Teaching, funding, placement or a venue. Read the four routes first if you want the detail.', href: '/partners', label: 'Partnership routes' },
              { t: 'For a job', d: 'Sixty days, then paid. The terms and the roles are published in full before you apply.', href: '/about/join-the-team', label: 'Open roles' },
            ].map((c) => (
              <article className="card" key={c.t}>
                <h3 style={{ fontSize: 19 }}>{c.t}</h3>
                <p style={{ marginTop: 8 }}>{c.d}</p>
                <a href={c.href} className="btn-link" style={{ marginTop: 14, display: 'inline-flex' }}>{c.label} <Icon name="arrow" size={14} /></a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
