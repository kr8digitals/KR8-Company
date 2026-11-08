'use client';

import { useMemo, useState } from 'react';
import { formatMoney } from '@/lib/rates';
import { Icon } from './ui';
import settings from '../../data/site.json';

const S = settings.settings.referralRates;

export default function ReferralCalc() {
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
      <div className="eyebrow">Worked example</div>
      <h3 style={{ fontSize: 22, marginTop: 8 }}>What one introduction is worth</h3>

      <div className="field" style={{ marginTop: 22 }}>
        <label htmlFor="rc-kind">What is being bought?</label>
        <select id="rc-kind" className="select" value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
          <option value="project">A website or a build — {S.website}%</option>
          <option value="creative">Design, video or search — {S.design}%</option>
          <option value="small">A small job — {S.small}%, ${S.smallMinimumUsd} minimum</option>
        </select>
      </div>

      <div className="field" style={{ marginTop: 16 }}>
        <label htmlFor="rc-val">Project value · <b style={{ color: 'var(--t-strong)' }}>${formatMoney(value)}</b></label>
        <input
          id="rc-val" type="range" min={200} max={10000} step={100} value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--magenta)' }}
        />
      </div>

      <div className="field" style={{ marginTop: 8 }}>
        <label htmlFor="rc-count">Paid referrals you have already made · <b style={{ color: 'var(--t-strong)' }}>{count}</b></label>
        <input
          id="rc-count" type="range" min={0} max={8} step={1} value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--magenta)' }}
        />
      </div>

      <div style={{ marginTop: 22, padding: '20px 22px', borderRadius: 16, background: 'linear-gradient(120deg, rgba(255,45,155,.16), rgba(124,58,237,.16))', border: '1px solid var(--hair)' }}>
        <div className="tag" style={{ color: 'var(--lilac)' }}>You earn</div>
        <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 42, letterSpacing: '-.03em', marginTop: 4 }}>
          ${formatMoney(commission)}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--t-muted)', marginTop: 4 }}>
          {effective}% of ${formatMoney(value)}
          {bonus ? ` · bonus rate unlocked after ${S.bonusAfterPaidReferrals} paid referrals` : ''}
        </div>
      </div>

      <p style={{ marginTop: 16, fontSize: 12.5, color: 'var(--t-faint)', lineHeight: 1.6 }}>
        Paid once the client has paid in full. Rates and minimums are set by KR8 Digitals and shown here
        before you sign up.
      </p>
      <a href="#join" className="btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
        Get my link <Icon name="arrow" size={16} />
      </a>
    </div>
  );
}
