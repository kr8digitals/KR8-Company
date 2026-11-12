'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import LeadForm from './LeadForm';
import { resolveServiceIntake } from '@/lib/service-intake';

type V = 'quote' | 'partner' | 'team' | 'contact';

const TABS: { id: V; label: string; sub: string }[] = [
  { id: 'quote', label: 'A project', sub: 'Website, brand, video, AI, search' },
  { id: 'partner', label: 'A partnership', sub: 'Teach, fund, hire or host' },
  { id: 'team', label: 'A job application', sub: 'Portfolio first, then live work' },
  { id: 'contact', label: 'Something else', sub: 'Anything not covered above' },
];

export default function ContactRouter() {
  const params = useSearchParams();
  const [tab, setTab] = useState<V>('quote');
  const [ref, setRef] = useState('');
  const [service, setService] = useState('');
  const [partnerType, setPartnerType] = useState('');
  const [siteId, setSiteId] = useState('');

  useEffect(() => {
    const q = params.get('type');
    const validType = q === 'partner' || q === 'team' || q === 'quote' || q === 'contact';
    const s = params.get('service') || '';
    setService(s);
    setSiteId(params.get('site') || '');
    const partner = params.get('partner') || '';
    const partnerTypes: Record<string, string> = {
      teach: 'Teaching & skills', fund: 'Funding & sponsors', hire: 'Placement & employers',
      host: 'Schools, hubs & NGOs', tools: 'Tools & platforms',
    };
    setPartnerType(partnerTypes[partner] || partner);
    setTab(partner ? 'partner' : validType ? q : 'quote');
    let r = params.get('ref') || '';
    if (!r) { try { r = localStorage.getItem('kr8.ref') || ''; } catch { /* noop */ } }
    setRef(r);
  }, [params]);

  return (
    <div id="form">
      <div className="tabs" role="tablist" aria-label="What is this about?">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`tab${tab === t.id ? ' is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <b>{t.label}</b>
            <span>{t.sub}</span>
          </button>
        ))}
      </div>

      {ref && (
        <div className="form-status ok" style={{ marginTop: 18 }}>
          Referral <b>{ref}</b> attached — the person who sent you here will be credited when this is paid.
        </div>
      )}

      <div style={{ marginTop: 26 }}>
        {tab === 'quote' && <LeadForm key={`q-${service}`} variant="quote" siteId={siteId || service || 'contact'} defaultService={service} intake={resolveServiceIntake(service)} />}
        {tab === 'partner' && <LeadForm key={`p-${partnerType}`} variant="partner" siteId="contact-partner" defaultPartnerType={partnerType} />}
        {tab === 'team' && <LeadForm key="t" variant="team" siteId="contact-team" />}
        {tab === 'contact' && <LeadForm key="c" variant="contact" siteId="contact-general" />}
      </div>
    </div>
  );
}
