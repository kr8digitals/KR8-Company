import Link from 'next/link';
import { Icon } from './ui';
import BuySite from './BuySite';
import portfolio from '../../data/portfolio.json';

export default function ForSale() {
  const items = portfolio.filter((p) => p.forSale);
  if (!items.length) return null;
  return (
    <section className="section section--tight" id="for-sale" style={{ background: 'linear-gradient(180deg, rgba(255,45,155,.06), transparent)' }}>
      <div className="wrap">
        <div className="split" style={{ alignItems: 'end', marginBottom: 34 }}>
          <div>
            <div className="eyebrow">Ready-built, not used</div>
            <h2 className="section-title">Sites that already exist, waiting for an owner</h2>
            <p className="section-lede">
              We build ahead of demand. These builds are finished and unclaimed — you take the site, we
              rebrand it with your name, colours and content, then move it to your domain. No template, no
              licence, no monthly fee.
            </p>
          </div>
          <Link href="/contact?service=website-design" className="btn-primary">Request this build <Icon name="arrow" size={16} /></Link>
        </div>

        {items.map((p) => (
          <div key={p.id} className="panel" style={{ padding: 34 }}>
            <div className="split" style={{ alignItems: 'start', gap: 44 }}>
              <div style={{ maxWidth: 560 }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <span className="pill">Available now</span>
                  <span className="pill">Rebrand included</span>
                  <span className="pill">One owner only</span>
                </div>
                <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 30, fontWeight: 800, letterSpacing: '-.02em', marginTop: 18 }}>
                  {p.name}
                </h3>
                <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.7, color: 'var(--t-body)', maxWidth: 520 }}>
                  {p.detail}
                </p>
                <div className="meta-row" style={{ marginTop: 22 }}>
                  {p.metrics.map((m: { k: string; v: string }) => (
                    <span key={m.k}><b>{m.v}</b> {m.k.toLowerCase()}</span>
                  ))}
                  <span><b>Built</b> {p.year}</span>
                </div>
              </div>

              <div style={{ minWidth: 250 }}>
                <div style={{ fontSize: 12.5, color: 'var(--t-faint)' }}>Asking price</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
                  <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 44, fontWeight: 800, letterSpacing: '-.03em' }}>
                    ${p.priceUsd}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--t-muted)' }}>USD</span>
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--t-muted)', lineHeight: 1.6, marginTop: 6 }}>
                  Paid once. Includes rebranding, your content, and deployment to your domain. Payable in
                  NGN at the day&apos;s rate.
                </p>
                <p style={{ fontSize: 11.5, color: 'var(--t-faint)', lineHeight: 1.55, marginTop: 10 }}>
                  Draft price pending Timfire&apos;s approval of the public price list.
                </p>
                <div style={{ marginTop: 20 }}>
                  <BuySite siteId={p.id} name={p.name} priceUsd={p.priceUsd ?? 0} />
                </div>
                <Link href={`/contact?service=website-design&site=${p.id}`} className="btn-link" style={{ marginTop: 12, display: 'inline-flex' }}>
                  Ask about this build first <Icon name="arrow" size={13} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
