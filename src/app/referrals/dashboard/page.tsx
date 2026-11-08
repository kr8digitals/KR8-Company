import Link from 'next/link';
import type { Metadata } from 'next';
import ReferralDashboard from '@/components/ReferralDashboard';
import { Icon } from '@/components/ui';
import { SectionAtmosphere } from '@/components/MobileExperience';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Referrer Ledger & Payout Portal | KR8 DIGITALS',
  robots: { index: false, follow: false },
};

export default async function ReferrerDashboardPage() {
  return (
    <section className="kr8-subhero" style={{ minHeight: '78vh' }}>
      <SectionAtmosphere name="referrals-network-cinema" deskOpacity={0.16} mobOpacity={0.28} flare />
      <div className="wrap">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 24,
          }}
        >
          <div>
            <span className="kr8-pill">
              <i className="kr8-pill__dot" /> Referrer Portal · KR8 DIGITALS
            </span>
            <h1 className="kr8-subhero__title" style={{ fontSize: 'clamp(26px, 3.6vw, 46px)' }}>
              Your Referral Ledger &amp; Payouts
            </h1>
          </div>
          <Link href="/referrals" className="btn-ghost btn-sm">
            Program Overview <Icon name="arrow" size={14} />
          </Link>
        </div>

        <ReferralDashboard />
      </div>
    </section>
  );
}
