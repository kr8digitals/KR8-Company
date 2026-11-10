'use client';
import { formatEditableText } from '@/lib/content-format';
import { useEditableContent } from '@/components/EditableContentProvider';
import { usePublicContent } from '@/components/PublicContentProvider';

import { useMemo, useState } from 'react';
import { formatMoney } from '@/lib/rates';
import { Icon } from './ui';
import settings from '../../data/site.json';

const S = settings.settings.referralRates;

export default function ReferralCalc() {
  const editableContent = useEditableContent("components:ReferralCalc");


  const publicData = usePublicContent();
  const settings = publicData.site;
  const S = settings.settings.referralRates;

  const [value, setValue] = useState(2000);
  const [kind, setKind] = useState<'project' | 'creative' | 'small'>('project');
  const [count, setCount] = useState(0);

  const rate = kind === 'project' ? S.website : kind === 'creative' ? S.design : S.small;
  const bonus = count >= S.bonusAfterPaidReferrals ? S.bonus : null;
  const effective = bonus && bonus > rate ? bonus : rate;

  const commission = useMemo(() => {
    let v = Math.round((value * effective) / 100);
    if (kind === 'small' && v < S.smallMinimumUsd) v = S.smallMinimumUsd;
    return v;
  }, [value, effective, kind]);

  return (
    <div className="panel" style={{ padding: 30 }}>
      <div className="eyebrow">{editableContent.texts.text_4c27274474}</div>
      <h3 style={{ fontSize: 22, marginTop: 8 }}>{editableContent.texts.text_a8e3312d86}</h3>

      <div className="field" style={{ marginTop: 22 }}>
        <label htmlFor="rc-kind">{editableContent.texts.text_43be73e204}</label>
        <select id="rc-kind" className="select" value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
          <option value="project">{editableContent.texts.text_17b9024b7f}{S.website}%</option>
          <option value="creative">{editableContent.texts.text_495cfed6a8}{S.design}%</option>
          <option value="small">{editableContent.texts.text_dd12c31a80}{S.small}%, ${S.smallMinimumUsd} {editableContent.texts.text_692e4e5dec}</option>
        </select>
      </div>

      <div className="field" style={{ marginTop: 16 }}>
        <label htmlFor="rc-val">{editableContent.texts.text_5c113981b2}<b style={{ color: 'var(--t-strong)' }}>${formatMoney(value)}</b></label>
        <input
          id="rc-val" type="range" min={200} max={10000} step={100} value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--magenta)' }}
        />
      </div>

      <div className="field" style={{ marginTop: 8 }}>
        <label htmlFor="rc-count">{editableContent.texts.text_66ab05f970}<b style={{ color: 'var(--t-strong)' }}>{count}</b></label>
        <input
          id="rc-count" type="range" min={0} max={8} step={1} value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--magenta)' }}
        />
      </div>

      <div style={{ marginTop: 22, padding: '20px 22px', borderRadius: 16, background: 'linear-gradient(120deg, rgba(255,45,155,.16), rgba(124,58,237,.16))', border: '1px solid var(--hair)' }}>
        <div className="tag" style={{ color: 'var(--lilac)' }}>{editableContent.texts.text_3bf8bf1d12}</div>
        <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 42, letterSpacing: '-.03em', marginTop: 4 }}>
          ${formatMoney(commission)}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--t-muted)', marginTop: 4 }}>
          {effective}{editableContent.texts.text_8a519b8f2d}{formatMoney(value)}
          {bonus ? formatEditableText(editableContent.texts.copy_04b4b73352, [S.bonusAfterPaidReferrals]) : ''}
        </div>
      </div>

      <p style={{ marginTop: 16, fontSize: 12.5, color: 'var(--t-faint)', lineHeight: 1.6 }}>
        {editableContent.texts.text_6a040335ef}</p>
      <a href={editableContent.texts.field_d2cb032fb3} className="btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
        {editableContent.texts.text_7e046f0696}<Icon name="arrow" size={16} />
      </a>
    </div>
  );
}
