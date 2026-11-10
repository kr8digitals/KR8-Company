'use client';
import { formatEditableText } from '@/lib/content-format';
import { useEditableContent } from '@/components/EditableContentProvider';
import { usePublicContent } from '@/components/PublicContentProvider';

import { useEffect, useState } from 'react';
import { track } from '@/lib/track';
import site from '../../data/site.json';
import services from '../../data/services.json';
import { Icon } from './ui';

type Variant = 'quote' | 'buy-site' | 'partner' | 'team' | 'contact' | 'mindshift' | 'tribe';

const COPY: Record<Variant, { title: string; blurb: string; cta: string; wa: string }> = {
  quote: {
    title: 'What are you trying to make happen?',
    blurb: 'A sentence is enough to start. You will get a scope, a fixed figure and a date — from the person who would build it.',
    cta: 'Send the brief',
    wa: 'Hi KR8 Digitals — I would like a quote for a project.',
  },
  'buy-site': {
    title: 'Take this site',
    blurb: 'Tell us which build you want and we will confirm availability, then rebrand it with your name, colours and content before it goes live.',
    cta: 'Request this site',
    wa: 'Hi KR8 Digitals — I want to buy one of your ready-built sites.',
  },
  partner: {
    title: 'Start a partnership',
    blurb: 'Tell us what you can bring — a craft, a budget, a room, a vacancy — and what you would want out of it.',
    cta: 'Send the enquiry',
    wa: 'Hi KR8 Digitals — I would like to explore a partnership.',
  },
  team: {
    title: 'Apply to join the team',
    blurb: 'We read every application, and you will hear back either way — even if the answer is not yet.',
    cta: 'Submit application',
    wa: 'Hi KR8 Digitals — I would like to apply to join the team.',
  },
  contact: {
    title: 'Message the team',
    blurb: 'Say what is going on and we will come back to you — by email, or on WhatsApp if you leave a number.',
    cta: 'Send message',
    wa: 'Hi KR8 Digitals — I have a question.',
  },
  mindshift: {
    title: 'Register interest',
    blurb: 'Leave your details and you will get the date, venue, speakers and joining details as soon as the next edition is confirmed.',
    cta: 'Request invitation',
    wa: 'Hi KR8 Digitals — I would like an invitation to Mindset Shift.',
  },
  tribe: {
    title: 'Ask about the Tribe',
    blurb: 'The Tribe lives at its own address. Leave your details if you would like an introduction.',
    cta: 'Add me to the list',
    wa: 'Hi KR8 Digitals — I would like to join the Tribe.',
  },
};

export default function LeadForm({
  variant,
  siteId,
  roles,
  defaultService,
  compact,
}: {
  variant: Variant;
  siteId?: string;
  roles?: string[];
  defaultService?: string;
  compact?: boolean;
}) {
  const editableContent = useEditableContent("components:LeadForm");
  const COPY = editableContent.blocks.COPY as EditableBlockTypes["COPY"];

  const publicData = usePublicContent();
  const site = publicData.site;
  const services = publicData.services;

  const copy = COPY[variant];
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const [msg, setMsg] = useState('');
  const [ref, setRef] = useState('');

  useEffect(() => {
    try {
      const r = localStorage.getItem('kr8.ref') || '';
      if (r) setRef(r);
    } catch { /* noop */ }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = { type: variant, consent: true, ref, siteId };
    fd.forEach((v, k) => {
      if (k === 'consent' || k === '_hp') return;
      if (v !== '') payload[k] = String(v);
    });
    setStatus('sending');
    setMsg('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus('err');
        setMsg(data.error || 'Something went wrong. Try WhatsApp instead.');
        return;
      }
      setStatus('ok');
      setMsg(data.message || 'Sent.');
      track('form_submit', { variant, ok: true });
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus('err');
      setMsg('The network dropped. Nothing was lost — try again, or use WhatsApp.');
      track('form_submit', { variant, ok: false });
    }
  }

  if (status === 'ok') {
    return (
      <div className="admin-card">
        <div className="form-status ok" style={{ marginBottom: 14 }}>{msg}</div>
        <p style={{ fontSize: 14, color: 'var(--t-muted)', lineHeight: 1.65 }}>
          {editableContent.texts.text_ab0cedb8fb}<b style={{ color: 'var(--t-strong)' }}>{siteId || variant}</b> {editableContent.texts.text_de3d7d2792}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
          <a className="btn-ghost btn-sm" href={formatEditableText("https://wa.me/{0}", [site.company.whatsapp])} target="_blank" rel="noopener noreferrer">
            <Icon name="wa" size={16} /> {editableContent.texts.text_21bcf56070}</a>
          <button className="btn-ghost btn-sm" onClick={() => { setStatus('idle'); setMsg(''); }}>{editableContent.texts.text_1d75e315ce}</button>
        </div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div>
        <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>{copy.title}</h3>
        <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6, color: 'var(--t-muted)', maxWidth: 520 }}>{copy.blurb}</p>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor={`n-${variant}`}>{editableContent.texts.text_8a980f9035}<span className="req">*</span></label>
          <input id={`n-${variant}`} name="name" className="input" required autoComplete="name" placeholder={editableContent.texts.field_f50170ddd4} />
        </div>
        <div className="field">
          <label htmlFor={`e-${variant}`}>{editableContent.texts.text_969ccbd3cf}</label>
          <input id={`e-${variant}`} name="email" type="email" className="input" autoComplete="email" placeholder={editableContent.texts.field_652740e1be} />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor={`p-${variant}`}>{editableContent.texts.text_b7cff7b013}</label>
          <input id={`p-${variant}`} name="phone" className="input" inputMode="tel" autoComplete="tel" placeholder="+234 800 000 0000" />
        </div>
        <div className="field">
          <label htmlFor={`o-${variant}`}>{variant === 'partner' ? editableContent.texts.copy_350be3643c : editableContent.texts.copy_72fd11bdfa}</label>
          <input id={`o-${variant}`} name="organisation" className="input" autoComplete="organization" placeholder={editableContent.texts.field_59be71333c} />
        </div>
      </div>

      {(variant === 'quote' || variant === 'contact') && (
        <div className="form-row">
          <div className="field">
            <label htmlFor={`s-${variant}`}>{editableContent.texts.text_52c6a4f683}</label>
            <select id={`s-${variant}`} name="service" className="select" defaultValue={defaultService || ''}>
              <option value="">{editableContent.texts.text_42ebd6c8ac}</option>
              {services.map((s) => <option key={s.slug} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor={`b-${variant}`}>{editableContent.texts.text_1c6225ec70}</label>
            <select id={`b-${variant}`} name="budget" className="select">
              <option value="">{editableContent.texts.text_51fcc57e9b}</option>
              <option value="Under $500">{editableContent.texts.text_e9bb68009e}</option>
              <option value="$500 – $2,000">$500 – $2,000</option>
              <option value="$2,000 – $5,000">$2,000 – $5,000</option>
              <option value="Above $5,000">{editableContent.texts.text_e3f8f5ebc0}</option>
            </select>
          </div>
        </div>
      )}

      {variant === 'team' && (
        <>
          <div className="field">
            <label htmlFor="role">{editableContent.texts.text_7c255a36c7}<span className="req">*</span></label>
            <select id="role" name="role" className="select" required defaultValue="">
              <option value="">{editableContent.texts.text_a49c49b04c}</option>
              {(roles || [
                editableContent.texts.copy_ce8b7dc6dc, editableContent.texts.copy_d46bb6b05b, editableContent.texts.copy_13d5c8f436,
                editableContent.texts.copy_d93937650f, editableContent.texts.copy_7a092931c3, editableContent.texts.copy_44d736bb91, editableContent.texts.copy_cc72843144,
              ]).map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="portfolio">{editableContent.texts.text_e28a236e6f}</label>
            <input id="portfolio" name="portfolio" className="input" placeholder={editableContent.texts.field_7f8c22fdb2} />
          </div>
        </>
      )}

      {variant === 'partner' && (
        <div className="field">
          <label htmlFor="ptype">{editableContent.texts.text_e032b2f46f}</label>
          <select id="ptype" name="partnerType" className="select">
            <option value="">{editableContent.texts.text_6056d7ff0d}</option>
            <option value="Teaching & skills">{editableContent.texts.text_446d7f8c3a}</option>
            <option value="Funding & sponsors">{editableContent.texts.text_dc06c800c8}</option>
            <option value="Placement & employers">{editableContent.texts.text_c2970426eb}</option>
            <option value="Schools, hubs & NGOs">{editableContent.texts.text_c54e35f698}</option>
            <option value="Tools & platforms">{editableContent.texts.text_8009f9a731}</option>
          </select>
        </div>
      )}

      {variant === 'buy-site' && siteId && <input type="hidden" name="siteId" value={siteId} />}

      <div className="field">
        <label htmlFor={`m-${variant}`}>
          {variant === 'quote' ? editableContent.texts.copy_a6ae479e31 : variant === 'team' ? editableContent.texts.copy_d88b8a737e : editableContent.texts.copy_2f77668a9d}
          {variant === 'quote' && <span className="req"> *</span>}
        </label>
        <textarea id={`m-${variant}`} name="message" className="textarea" rows={compact ? 3 : 5}
          placeholder={variant === 'quote'
            ? editableContent.texts.copy_2ce339c014
            : editableContent.texts.copy_9fdeba8d3a} />
      </div>

      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>
          {editableContent.texts.text_502b2e9e0f}{' '}
          <a href={editableContent.texts.field_0ece7f7c30}>{editableContent.texts.text_f18dccf66b}</a>{editableContent.texts.text_568a700918}</span>
      </label>
      <input type="text" name="_hp" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden />

      {status === 'err' && <div className="form-status err">{msg}</div>}

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button type="submit" className="btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? <><span className="spinner" /> {editableContent.texts.text_b8ed5279e8}</> : <>{copy.cta} <Icon name="arrow" size={17} /></>}
        </button>
        <a className="btn-ghost btn-sm" href={formatEditableText("https://wa.me/{0}?text={1}", [site.company.whatsapp, encodeURIComponent(copy.wa)])}
           target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click', { variant })}>
          <Icon name="wa" size={16} /> {editableContent.texts.text_80f6ac1699}</a>
      </div>
      <p className="form-note">
        {editableContent.texts.text_5d6f8b62f0}</p>
    </form>
  );
}

type EditableBlockTypes = { COPY: typeof COPY };
