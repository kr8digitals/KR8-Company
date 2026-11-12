'use client';

import Link from 'next/link';
import pricing from '../../data/pricing.json';
import settings from '../../data/site.json';
import { CurrencyPicker, Icon, Price, useCurrency } from './ui';
import { ResponsiveCopy } from './MobileExperience';

export default function Pricing({ slug, intakeSlug }: { slug: string; intakeSlug?: string }) {
  const { code, rates, setCode, ready } = useCurrency();
  const block = (pricing.services as any)[slug];
  const published = settings.settings.publicPriceDisplay === true;

  if (!block) return null;

  if (!published) {
    return (
      <section className="section section--tight" id="pricing">
        <div className="wrap">
          <div className="panel" style={{ padding: 34 }}>
            <div className="split" style={{ alignItems: 'flex-start', gap: 40 }}>
              <div style={{ maxWidth: 560 }}>
                <div className="eyebrow">Pricing</div>
                <h2 style={{ fontSize: 30, marginTop: 10 }}>Quoted per scope, in dollars, paid in naira</h2>
                <ResponsiveCopy
                  as="p"
                  desktop={`Every engagement is quoted as a transparent fixed figure against a written scope — ${block.unit}, never an open-ended hourly meter. Request a quote below to receive your tailored scope and fixed figure in writing.`}
                  mobile={`Transparent fixed milestone quotes (${block.unit}) — never an hourly meter. Request your written scope below in USD or NGN.`}
                />
                <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Link href={`/contact?service=${intakeSlug || slug}`} className="btn-primary btn-sm">
                    Get a fixed quote <Icon name="arrow" size={15} />
                  </Link>
                  {ready && <CurrencyPicker code={code} setCode={setCode} />}
                </div>
                <p style={{ marginTop: 12, fontSize: 12, color: 'var(--t-faint)' }}>
                  Show a currency and we will quote in it: <b style={{ color: 'var(--t-body)' }}>{code}</b>
                  {code !== 'USD' && ` · 1 USD ≈ ${Math.round(rates[code] || 1).toLocaleString('en-US')} ${code}`}
                </p>
              </div>
              <div className="panel" style={{ padding: 22, minWidth: 260, background: 'var(--surface-subtle)' }}>
                <div className="tag" style={{ color: 'var(--magenta)' }}>The bands we quote inside</div>
                <ul className="price-list" style={{ marginTop: 12 }}>
                  {block.tiers.map((t: any) => (
                    <li key={t.name} style={{ color: 'var(--t-body)' }}>
                      <Icon name="check" size={14} />{' '}
                      <span>
                        <b>{t.name}</b> — {t.includes[0].toLowerCase()}
                      </span>
                    </li>
                  ))}
                </ul>
                <p style={{ marginTop: 14, fontSize: 11.5, color: 'var(--t-faint)', lineHeight: 1.6 }}>
                  Written milestone figures delivered within 1 business day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section section--tight" id="pricing">
      <div className="wrap">
        <div className="split" style={{ alignItems: 'end', marginBottom: 30 }}>
          <div>
            <div className="eyebrow">Pricing</div>
            <h2 className="section-title" style={{ fontSize: 36 }}>Fixed figures, published</h2>
          </div>
          <CurrencyPicker code={code} setCode={setCode} />
        </div>
        <div className="grid g3">
          {block.tiers.map((t: any, i: number) => (
            <div key={t.name} className={`price-card${i === 1 ? ' price-card--feature' : ''}`}>
              <div className="tag">{t.name}</div>
              <Price usd={t.usd} code={code} rates={rates} />
              <ul className="price-list" style={{ marginTop: 16 }}>
                {t.includes.map((x: string) => (
                  <li key={x}>
                    <Icon name="check" size={14} /> {x}
                  </li>
                ))}
              </ul>
              <Link href={`/contact?service=${intakeSlug || slug}`} className="btn-primary btn-sm" style={{ marginTop: 18 }}>
                Start here <Icon name="arrow" size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
