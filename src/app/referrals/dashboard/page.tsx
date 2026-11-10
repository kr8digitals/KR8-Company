import { getEditableDocument } from '@/lib/editable-content';
import Link from 'next/link';
import type { Metadata } from 'next';
import ReferralDashboard from '@/components/ReferralDashboard';
import { Icon } from '@/components/ui';
import { SectionAtmosphere } from '@/components/MobileExperience';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return (await getEditableDocument("app:referrals:dashboard:page")).blocks.metadata as Metadata;
}

export default async function ReferrerDashboardPage() {
  const editableContent = await getEditableDocument("app:referrals:dashboard:page");

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
              <i className="kr8-pill__dot" /> {editableContent.texts.text_47c24c6488}</span>
            <h1 className="kr8-subhero__title" style={{ fontSize: 'clamp(26px, 3.6vw, 46px)' }}>
              {editableContent.texts.text_b3bde9b2bf}</h1>
          </div>
          <Link href={editableContent.texts.field_5c28ab56d1} className="btn-ghost btn-sm">
            {editableContent.texts.text_56b1b215b8}<Icon name="arrow" size={14} />
          </Link>
        </div>

        <ReferralDashboard />
      </div>
    </section>
  );
}
