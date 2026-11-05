import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero, { ClosingCTA } from '@/components/PageHero';
import LeadForm from '@/components/LeadForm';
import { Icon } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Mindset Shift — register interest',
  description:
    'Register interest in the next edition of Mindset Shift, the KR8 Digitals gathering. Dates, venue and speakers are confirmed per edition and sent to this list first.',
  alternates: { canonical: '/programs/mindset-shift/invite' },
};

export default function InvitePage() {
  return (
    <>
      <PageHero
        eyebrow="Mindset Shift"
        title={<>Register interest</>}
        lede="Leave your details and you will be told the date, the venue and the speakers as soon as the next edition is confirmed — before it is announced anywhere else."
        aside={
          <figure style={{ margin: 0 }}>
            <div className="duo__frame" style={{ aspectRatio: '4 / 3' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/brand/presco-trip-full.webp" alt="Event artwork in the KR8 design language" />
            </div>
            <figcaption style={{ marginTop: 10, fontSize: 11.5, color: 'var(--t-faint)' }}>
              Event artwork · KR8 Digitals in association with Motionverse
            </figcaption>
          </figure>
        }
      />

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="grid g2 grid--loose" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.1fr)' }}>
            <div className="reveal up" style={{ maxWidth: 440 }}>
              <div className="eyebrow">What happens in the room</div>
              <ul className="price-list" style={{ marginTop: 18 }}>
                <li><Icon name="check" size={15} /> Speakers who built something, not people who talk about building</li>
                <li><Icon name="check" size={15} /> A room of people deciding to start, in the same place at the same time</li>
                <li><Icon name="check" size={15} /> Time to ask the questions you would not ask publicly</li>
              </ul>
              <p style={{ marginTop: 24, fontSize: 14, lineHeight: 1.7, color: 'var(--t-muted)' }}>
                The first edition is being planned. This page is the honest state of it: no date has been
                published, so nobody here will pretend to have one.
              </p>
              <div style={{ marginTop: 22, display: 'grid', gap: 10 }}>
                <div className="meta-row"><span>Date</span><span className="pending-tag">To confirm</span></div>
                <div className="meta-row"><span>Venue</span><span className="pending-tag">To confirm</span></div>
                <div className="meta-row"><span>Speakers</span><span className="pending-tag">To confirm</span></div>
              </div>
              <Link href="/programs#mindset-shift" className="btn-link" style={{ marginTop: 22 }}>
                Back to Mindset Shift <Icon name="arrow" size={14} />
              </Link>
            </div>
            <div className="reveal up" data-delay="60">
              <LeadForm variant="mindshift" siteId="mindset-shift" compact />
            </div>
          </div>
        </div>
      </section>

      <ClosingCTA
        title="Bring the room to you."
        copy="If you can host an edition — a hall, a school, a space that sits empty — that is the fastest way to make one happen."
        cta="Offer a space"
        href="/contact?partner=host"
        secondary={{ label: 'All programmes', href: '/programs' }}
      />
    </>
  );
}
