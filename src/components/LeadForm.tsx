'use client';

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
          Reference <b style={{ color: '#fff' }}>{siteId || variant}</b> — quote it if you follow up on WhatsApp
          and the team will find your submission immediately.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
          <a className="btn-ghost btn-sm" href={`https://wa.me/${site.company.whatsapp}`} target="_blank" rel="noopener noreferrer">
            <Icon name="wa" size={16} /> WhatsApp the team
          </a>
          <button className="btn-ghost btn-sm" onClick={() => { setStatus('idle'); setMsg(''); }}>Send another</button>
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
          <label htmlFor={`n-${variant}`}>Your name <span className="req">*</span></label>
          <input id={`n-${variant}`} name="name" className="input" required autoComplete="name" placeholder="Chidinma Okeke" />
        </div>
        <div className="field">
          <label htmlFor={`e-${variant}`}>Email</label>
          <input id={`e-${variant}`} name="email" type="email" className="input" autoComplete="email" placeholder="you@company.com" />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor={`p-${variant}`}>WhatsApp / phone</label>
          <input id={`p-${variant}`} name="phone" className="input" inputMode="tel" autoComplete="tel" placeholder="+234 800 000 0000" />
        </div>
        <div className="field">
          <label htmlFor={`o-${variant}`}>{variant === 'partner' ? 'Organisation' : 'Business / organisation'}</label>
          <input id={`o-${variant}`} name="organisation" className="input" autoComplete="organization" placeholder="Optional" />
        </div>
      </div>

      {(variant === 'quote' || variant === 'contact') && (
        <div className="form-row">
          <div className="field">
            <label htmlFor={`s-${variant}`}>What do you need?</label>
            <select id={`s-${variant}`} name="service" className="select" defaultValue={defaultService || ''}>
              <option value="">Not sure yet</option>
              {services.map((s) => <option key={s.slug} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor={`b-${variant}`}>Budget</label>
            <select id={`b-${variant}`} name="budget" className="select">
              <option value="">Prefer not to say</option>
              <option value="Under $500">Under $500</option>
              <option value="$500 – $2,000">$500 – $2,000</option>
              <option value="$2,000 – $5,000">$2,000 – $5,000</option>
              <option value="Above $5,000">Above $5,000</option>
            </select>
          </div>
        </div>
      )}

      {variant === 'team' && (
        <>
          <div className="field">
            <label htmlFor="role">Which role? <span className="req">*</span></label>
            <select id="role" name="role" className="select" required defaultValue="">
              <option value="">Choose a role</option>
              {(roles || [
                'General Manager', 'Tribe (Community) Manager', 'Social Media Manager',
                'Video Editor', 'Graphic Designer', 'Website Designer / Developer', 'Something else',
              ]).map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="portfolio">Portfolio link</label>
            <input id="portfolio" name="portfolio" className="input" placeholder="behance.net/yourname · drive folder · website" />
          </div>
        </>
      )}

      {variant === 'partner' && (
        <div className="field">
          <label htmlFor="ptype">How would you like to work together?</label>
          <select id="ptype" name="partnerType" className="select">
            <option value="">Not decided yet</option>
            <option value="Teaching & skills">Teaching and skills</option>
            <option value="Funding & sponsors">Funding and sponsorship</option>
            <option value="Placement & employers">Placement and hiring</option>
            <option value="Schools, hubs & NGOs">School, hub or NGO</option>
            <option value="Tools & platforms">Tools and platforms</option>
          </select>
        </div>
      )}

      {variant === 'buy-site' && siteId && <input type="hidden" name="siteId" value={siteId} />}

      <div className="field">
        <label htmlFor={`m-${variant}`}>
          {variant === 'quote' ? 'What are you trying to make happen?' : variant === 'team' ? 'Why you, and what you want to build' : 'Message'}
          {variant === 'quote' && <span className="req"> *</span>}
        </label>
        <textarea id={`m-${variant}`} name="message" className="textarea" rows={compact ? 3 : 5}
          placeholder={variant === 'quote'
            ? 'We run a school in Enugu with about 400 students. Our site is five years old and takes forever to load on a phone. Parents cannot find our fees page.'
            : 'A short paragraph is plenty.'} />
      </div>

      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>
          I agree that KR8 Digitals may store this and contact me about it. See the{' '}
          <a href="/privacy">privacy notice</a>. We do not sell data and you can ask for deletion at any time.
        </span>
      </label>
      <input type="text" name="_hp" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden />

      {status === 'err' && <div className="form-status err">{msg}</div>}

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button type="submit" className="btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? <><span className="spinner" /> Sending…</> : <>{copy.cta} <Icon name="arrow" size={17} /></>}
        </button>
        <a className="btn-ghost btn-sm" href={`https://wa.me/${site.company.whatsapp}?text=${encodeURIComponent(copy.wa)}`}
           target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click', { variant })}>
          <Icon name="wa" size={16} /> Chat on WhatsApp
        </a>
      </div>
      <p className="form-note">
        Replies come from a real person at KR8 Digitals — usually within a working day. Your details stay with us.
      </p>
    </form>
  );
}
