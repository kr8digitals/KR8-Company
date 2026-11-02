import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import site from '../../../data/site.json';

export const metadata: Metadata = {
  title: 'Privacy notice',
  description: 'What KR8 Digitals collects, why, how long it is kept, and how to have it deleted.',
  alternates: { canonical: '/privacy' },
};

const SECTIONS = [
  { h: 'What we collect', p: [
    'When you submit a form we store the name, email, phone number, organisation and message you chose to give us, plus the page you sent it from and the referral code if one was used.',
    'The Host chat stores the messages you type and the conversation state, linked to a random visitor id kept in your browser. It is not linked to your name unless you give it.',
    'Analytics are first-party and cookieless: an event name, the page path, and a coarse country from the network request. No tracking pixels, no third-party advertising tags, no fingerprinting.',
    'If you create a referral account we also store the private key used to open your ledger, and the record of introductions and commissions.',
  ]},
  { h: 'Why we collect it', p: [
    'To answer your enquiry, quote the work, deliver it, and keep the accounting straight if a referral commission is involved.',
    'To tell you about a cohort or an edition you asked to be told about. Nothing else is sent without a new, specific request from you.',
  ]},
  { h: 'Who can see it', p: [
    'The KR8 Digitals team, on a need-to-know basis. Payments are reconciled manually by bank transfer, so no card data ever reaches our servers — we do not process cards at all.',
    'Email notifications are sent through a transactional email provider; hosted data is stored with our hosting and database providers. Both are processors, not owners, of the data.',
    'We do not sell data, and we do not share your enquiry with a partner unless the work itself requires it — and we will say so first.',
  ]},
  { h: 'How long we keep it', p: [
    'Enquiries: twenty-four months, then deleted unless they became a client, in which case the accounting record is kept as long as tax law requires.',
    'Host conversations: twelve months. You can delete a conversation from the panel at any time, which removes it from your device immediately and from our records within thirty days.',
    'Analytics: ninety days for raw events, then aggregate counts only.',
  ]},
  { h: 'Your rights', p: [
    'Ask for a copy of everything we hold about you, ask for a correction, or ask for deletion. Write to ' + site.company.email + ' from the address you used and we will respond within thirty days.',
    'Under the Nigeria Data Protection Act 2023 you may also complain to the Nigeria Data Protection Commission.',
  ]},
  { h: 'Cookies', p: [
    'The site sets no advertising or analytics cookies. Two browser storage keys are used and both are functional: your display currency, and the Host conversation so it survives a page change.',
    'The admin dashboard uses one http-only session cookie after a password sign-in. That cookie is not present for ordinary visitors.',
  ]},
  { h: 'Children', p: [
    'Some Academy applicants are under eighteen. Applications from minors require a parent or guardian to confirm consent, and we do not collect more information from a minor than the application requires.',
  ]},
  { h: 'Changes', p: [
    'If this notice changes materially, the date below changes and a note is added. We will not quietly widen what we do with data you gave us under an older version.',
  ]},
];

export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Legal" title={<>Privacy notice</>} lede="The short version: we collect what a conversation needs, we do not sell it, and you can ask us to delete it." crumbs={[{ label: 'Privacy' }]} />
      <section className="section" style={{ paddingTop: 10 }}>
        <div className="wrap" style={{ maxWidth: 860 }}>
          <p className="meta-row" style={{ marginBottom: 40 }}><span><b>Last updated</b> 2 November 2026</span><span><b>Controller</b> KR8 Digitals</span><span><b>Contact</b> {site.company.email}</span></p>
          {SECTIONS.map((s) => (
            <div key={s.h} style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 24, fontWeight: 800, letterSpacing: '-.02em' }}>{s.h}</h2>
              <div className="prose-lg" style={{ marginTop: 12 }}>
                {s.p.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
              </div>
            </div>
          ))}
          <div className="panel" style={{ padding: 26 }}>
            <p style={{ fontSize: 14, color: 'var(--t-muted)', lineHeight: 1.7 }}>
              Questions about this notice go to <b style={{ color: '#fff' }}>{site.company.email}</b>. For the
              terms that govern work we do for you, see <Link href="/terms" style={{ color: 'var(--magenta)' }}>terms</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
