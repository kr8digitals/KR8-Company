import Link from 'next/link';
import type { Metadata } from 'next';
import site from '../../../data/site.json';
import { SectionAtmosphere } from '@/components/MobileExperience';

export const metadata: Metadata = {
  title: 'Privacy Policy | KR8 DIGITALS',
  description: 'How KR8 DIGITALS collects, uses, safeguards, and respects personal information across our website, programs, and services.',
  alternates: { canonical: '/privacy' },
};

const SECTIONS = [
  {
    num: '01 · SCOPE & CONTROLLER',
    title: 'Who We Are',
    body: `KR8 DIGITALS operates this website, commercial inquiry channels, partnership portals, and referrer tools. For any privacy question, data access request, or deletion request, contact ${site.company.email}.`,
  },
  {
    num: '02 · INFORMATION WE COLLECT',
    title: 'Only What You Share With Purpose',
    body: 'When you submit a project brief, partnership proposal, team application, community registration, referral signup, or chat with our intelligent digital representative RIYA, we store the contact details and project context you voluntarily provide — alongside basic privacy-safe route analytics (with no third-party advertising trackers).',
  },
  {
    num: '03 · HOW INFORMATION IS USED',
    title: 'Responding, Delivering & Attribution',
    body: 'Your information is used strictly to respond to your inquiry, scope or deliver commissioned services, review partnership or career applications, coordinate program invitations, and credit verified referral commissions. We never sell or rent personal information to third parties.',
  },
  {
    num: '04 · RETENTION & YOUR RIGHTS',
    title: 'Access, Correction & Deletion',
    body: `Active assistant conversations can be cleared directly inside the chat panel at any time. To inspect, update, or permanently erase any submission or referral record associated with your email or phone number, write to ${site.company.email} and our team will process your request promptly.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="kr8-subhero" style={{ paddingBottom: 38 }}>
        <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.28} mobOpacity={0.38} flare />
        <div className="wrap">
          <span className="kr8-pill">Legal &amp; Trust · KR8 DIGITALS</span>
          <h1 className="kr8-subhero__title">Privacy Policy</h1>
          <p className="kr8-subhero__lede">
            Clear, plain-English commitments on how KR8 DIGITALS handles inquiry data, partnership proposals,
            referral records, and digital assistant conversations.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 44 }}>
        <div className="wrap">
          <div className="kr8-grid-2">
            {SECTIONS.map((s) => (
              <article className="kr8-card" key={s.num}>
                <div className="kr8-card__num">{s.num}</div>
                <h2 className="kr8-card__title">{s.title}</h2>
                <p className="kr8-card__body">{s.body}</p>
              </article>
            ))}
          </div>

          <div style={{ marginTop: 32, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            <Link href="/terms" className="btn-ghost btn-sm">
              Terms of Service
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
