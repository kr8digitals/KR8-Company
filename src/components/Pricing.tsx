'use client';
import { formatEditableText } from '@/lib/content-format';
import { useEditableContent } from '@/components/EditableContentProvider';
import { usePublicContent } from '@/components/PublicContentProvider';

import Link from 'next/link';
import pricing from '../../data/pricing.json';
import settings from '../../data/site.json';
import { CurrencyPicker, Icon, Price, useCurrency } from './ui';
import { ResponsiveCopy } from './MobileExperience';

export default function Pricing({ slug }: { slug: string }) {
  const editableContent = useEditableContent("components:Pricing");

  const publicData = usePublicContent();
  const pricing = publicData.pricing;
  const settings = publicData.site;

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
                <div className="eyebrow">{editableContent.texts.text_dfe95783ed}</div>
                <h2 style={{ fontSize: 30, marginTop: 10 }}>{editableContent.texts.text_18e521c932}</h2>
                <ResponsiveCopy
                  as="p"
                  desktop={formatEditableText(editableContent.texts.copy_c9981479d0, [block.unit])}
                  mobile={formatEditableText(editableContent.texts.copy_61f6a62793, [block.unit])}
                />
                <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Link href={editableContent.texts.field_4eb9506365} className="btn-primary btn-sm">
                    {editableContent.texts.text_8967f97ea7}<Icon name="arrow" size={15} />
                  </Link>
                  {ready && <CurrencyPicker code={code} setCode={setCode} />}
                </div>
                <p style={{ marginTop: 12, fontSize: 12, color: 'var(--t-faint)' }}>
                  {editableContent.texts.text_fd5740bb7b}<b style={{ color: 'var(--t-body)' }}>{code}</b>
                  {code !== 'USD' && formatEditableText(editableContent.texts.copy_7d39432b12, [Math.round(rates[code] || 1).toLocaleString('en-US'), code])}
                </p>
              </div>
              <div className="panel" style={{ padding: 22, minWidth: 260, background: 'var(--surface-subtle)' }}>
                <div className="tag" style={{ color: 'var(--magenta)' }}>{editableContent.texts.text_a40806a54b}</div>
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
                  {editableContent.texts.text_6da4553c09}</p>
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
            <div className="eyebrow">{editableContent.texts.text_dfe95783ed}</div>
            <h2 className="section-title" style={{ fontSize: 36 }}>{editableContent.texts.text_68356db78d}</h2>
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
              <Link href={editableContent.texts.field_4eb9506365} className="btn-primary btn-sm" style={{ marginTop: 18 }}>
                {editableContent.texts.text_86e8ccf0e4}<Icon name="arrow" size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
