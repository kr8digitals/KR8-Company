import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import ReferralDashboard from '@/components/ReferralDashboard';

export const metadata: Metadata = {
  title: 'Referral dashboard',
  description: 'Your introductions, their status and what they are worth.',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <>
      <PageHero
        eyebrow="Referrals"
        title={<>Your ledger</>}
        lede="Every introduction you have made, what stage it is at, and what it is worth. Nothing hidden behind a support ticket."
        crumbs={[{ label: 'Referrals', href: '/referrals' }, { label: 'Dashboard' }]}
      />
      <section className="section" style={{ paddingTop: 10 }}>
        <div className="wrap">
          <ReferralDashboard />
        </div>
      </section>
    </>
  );
}
