import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import LeadForm from '@/components/LeadForm';
import programmes from '../../../../../data/programmes.json';
import { Icon } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Mindset Shift — request an invitation',
  description:
    'Mindset Shift is the KR8 Digitals evening that changes what a young creative believes is possible. Request an invitation to the next edition.',
  alternates: { canonical: '/programs/mindset-shift/invite' },
};

export default function InvitePage() {
  const m = programmes.programmes.find((p) => p.slug === 'mindset-shift')!;
  return (
    <>
      <PageHero
        eyebrow="Mindset Shift"
        title={<>Request an invitation</>}
        lede="An evening, every two weeks, in person in Abakaliki and streamed. No ticket price. The room sets the only limit on numbers."
        crumbs={[{ label: 'Programs', href: '/programs' }, { label: 'Mindset Shift', href: '/programs#mindset-shift' }, { label: 'Invitation' }]}
      />
      <section className="section" style={{ paddingTop: 10 }}>
        <div className="wrap">
          <div className="split" style={{ alignItems: 'start' }}>
            <div className="reveal up" style={{ maxWidth: 420 }}>
              <div className="eyebrow">What happens in the room</div>
              <ul className="price-list" style={{ marginTop: 18 }}>
                {m.details.map((d) => <li key={d}><Icon name="check" size={15} /> {d}</li>)}
              </ul>
              <p style={{ marginTop: 24, fontSize: 14, lineHeight: 1.7, color: 'var(--t-muted)' }}>
                {m.body}
              </p>
            </div>
            <div className="reveal up" data-delay="60">
              <LeadForm variant="mindshift" siteId="mindset-shift" compact />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
