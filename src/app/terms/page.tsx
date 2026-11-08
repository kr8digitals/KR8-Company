import Link from 'next/link';
import type { Metadata } from 'next';
import site from '../../../data/site.json';
import { SectionAtmosphere } from '@/components/MobileExperience';

export const metadata: Metadata = {
  title: 'Terms of Service | KR8 DIGITALS',
  description: 'Commercial engagement, program participation, referral attribution, and website usage terms for KR8 DIGITALS.',
  alternates: { canonical: '/terms' },
};

const CLAUSES = [
  {
    num: '01 · COMMERCIAL ENGAGEMENTS',
    title: 'Written Scopes & Fixed Milestones',
    body: 'Information on this website introduces KR8 DIGITALS capabilities and portfolio proof, and does not constitute a binding price commitment until a written project scope, milestone schedule, and invoice are mutually confirmed between KR8 DIGITALS and the commissioning client.',
  },
  {
    num: '02 · INTELLECTUAL PROPERTY & OWNERSHIP',
    title: 'Client Ownership Upon Settlement',
    body: 'Upon full settlement of agreed project invoices, clients receive ownership of their custom deliverables, domain registrations, and final assets as specified in their written scope. Portfolio screenshots and co-founding studio credits (including Motionverse and Chigoma) remain protected intellectual property.',
  },
  {
    num: '03 · ECOSYSTEM PROGRAMS',
    title: 'Tuition-Free Training & Community Conduct',
    body: 'KR8 Academy digital tracks, Next Gen Scholars academic pathways, KR8 DIGITALS TRIBE, and Mindset Shift operate on mutual respect, honest effort, and zero harassment. KR8 DIGITALS reserves the right to revoke community or cohort access for conduct that undermines fellow learners.',
  },
  {
    num: '04 · REFERRAL NETWORK',
    title: 'Commission Eligibility & Settlement',
    body: `Referral commissions accrue strictly on net client invoices confirmed paid in full, excluding self-referrals or pre-existing active client negotiations. Questions regarding commercial scopes or terms may be directed to ${site.company.email}.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <section className="kr8-subhero" style={{ paddingBottom: 38 }}>
        <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.28} mobOpacity={0.38} flare />
        <div className="wrap">
          <span className="kr8-pill">Legal &amp; Governance · KR8 DIGITALS</span>
          <h1 className="kr8-subhero__title">Terms of Service</h1>
          <p className="kr8-subhero__lede">
            Straightforward operating terms governing commercial projects, intellectual property handover,
            ecosystem programs, and the KR8 DIGITALS referral network.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 44 }}>
        <div className="wrap">
          <div className="kr8-grid-2">
            {CLAUSES.map((c) => (
              <article className="kr8-card" key={c.num}>
                <div className="kr8-card__num">{c.num}</div>
                <h2 className="kr8-card__title">{c.title}</h2>
                <p className="kr8-card__body">{c.body}</p>
              </article>
            ))}
          </div>

          <div style={{ marginTop: 32, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            <Link href="/privacy" className="btn-ghost btn-sm">
              Privacy Policy
            </Link>
            <Link href="/accessibility" className="btn-ghost btn-sm">
              Accessibility Statement
            </Link>
            <Link href="/contact" className="btn-ghost btn-sm">
              Contact KR8 DIGITALS
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
