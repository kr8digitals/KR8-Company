import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import site from '../../../data/site.json';

export const metadata: Metadata = {
  title: 'Terms of service',
  description: 'The terms that govern KR8 Digitals client work, referrals, training and use of this site.',
  alternates: { canonical: '/terms' },
};

const SECTIONS = [
  { h: '1. Who these terms are between', p: ['These terms govern your use of this website and any work KR8 Digitals does for you. Where a written quote or contract says something different, that document wins over this page for that engagement.'] },
  { h: '2. Quotes and scope', p: [
    'A quote states a scope, a fixed figure and a delivery window. Work outside that scope is quoted separately before it starts — never added to an invoice after the fact.',
    'A quote is valid for thirty days. Prices are shown in US dollars and may be paid in NGN at the rate quoted on the day of invoice.',
    'Where a public price list is displayed, it is indicative and applies to standard scopes. Custom work is quoted individually.',
  ]},
  { h: '3. Payment', p: [
    'Unless agreed otherwise: fifty percent to schedule the work, fifty percent before launch or handover. Training, retainers and placements are invoiced monthly in advance.',
    'Payment is by bank transfer. We do not process card details. A receipt is issued for every payment.',
    'Late payment beyond fourteen days pauses work and the delivery date moves by the same number of days.',
  ]},
  { h: '4. Your side of the bargain', p: [
    'You provide the content, access and approvals needed to do the work, and you confirm you have the right to use anything you send us.',
    'Feedback rounds are defined in the quote. Additional rounds are charged at the rate stated there.',
  ]},
  { h: '5. What you own', p: [
    'On final payment you own the delivered work: the source files, the design files, the code, and the domain registration if we bought it on your behalf.',
    'We keep the right to show the finished work in our portfolio and to describe it factually, unless you ask us in writing not to.',
    'Third-party components keep their own licences — fonts, stock and plugins are listed at handover where they apply.',
  ]},
  { h: '6. Training and the Academy', p: [
    'Academy tuition is free. No fee is charged to enrol, to attend or to graduate, and a certificate is issued at no cost.',
    'Enrolment in the team route is subject to a published fee and terms. No fee is charged before those terms are published on this site.',
    'We may remove a participant who is disruptive or who misrepresents their work. Certificates are issued on completion, not on attendance.',
  ]},
  { h: '7. Referrals', p: [
    'Commission is earned only when KR8 confirms the client has paid in full, and only on introductions tracked through your personal link.',
    'Self-referrals, duplicate accounts and referrals of clients already in our pipeline are void. We will say which and why.',
    'Rates, minimums and withdrawal rules are published on the referrals page and apply equally to every referrer.',
  ]},
  { h: '8. Liability', p: [
    'We deliver the scope we agreed. We are not liable for indirect losses, lost profit, or losses caused by third-party platforms changing their terms or availability.',
    'Our total liability for any engagement is capped at the amount you paid us for that engagement.',
  ]},
  { h: '9. Disputes', p: ['Talk to us first — write to ' + site.company.email + ' and we will try to resolve it within fourteen days. These terms are governed by the laws of the Federal Republic of Nigeria.'] },
];

export default function Terms() {
  return (
    <>
      <PageHero eyebrow="Legal" title={<>Terms of service</>} lede="Plain terms: a fixed scope, a fixed price, and you own what you paid for." />
      <section className="section" style={{ paddingTop: 10 }}>
        <div className="wrap" style={{ maxWidth: 860 }}>
          <p className="meta-row" style={{ marginBottom: 40 }}><span><b>Last updated</b> 2 November 2026</span><span><b>Contact</b> {site.company.email}</span></p>
          {SECTIONS.map((s) => (
            <div key={s.h} style={{ marginBottom: 34 }}>
              <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>{s.h}</h2>
              <div className="prose-lg" style={{ marginTop: 10, fontSize: 16 }}>
                {s.p.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
              </div>
            </div>
          ))}
          <div className="panel" style={{ padding: 26 }}>
            <p style={{ fontSize: 14, color: 'var(--t-muted)', lineHeight: 1.7 }}>
              See also <Link href="/privacy" style={{ color: 'var(--magenta)' }}>the privacy notice</Link> and{' '}
              <Link href="/accessibility" style={{ color: 'var(--magenta)' }}>the accessibility statement</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
