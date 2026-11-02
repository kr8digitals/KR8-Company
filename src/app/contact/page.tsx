import type { Metadata } from 'next';
import { Suspense } from 'react';
import site from '../../../data/site.json';
import PageHero, { ClosingCTA } from '@/components/PageHero';
import ContactRouter from '@/components/ContactRouter';
import { Icon } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Contact — work with us, partner with us, or join',
  description:
    'Start a project, propose a partnership or apply to join the team. One form, a real reply, and a price in writing before you commit to anything.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Let&rsquo;s start with<br /><span className="text-grad">what you are trying to make happen.</span></>}
        lede="You do not need a brief or a deck. Tell us the situation in a sentence and we will tell you what it takes, who would build it and what it costs — in writing."
        aside={
          <figure style={{ margin: 0 }}>
            <div className="duo__frame" style={{ aspectRatio: '4 / 3' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/team/founder-timfire-wide.jpg" alt="A KR8 Digitals founder at work" />
            </div>
            <figcaption style={{ marginTop: 10, fontSize: 11.5, color: 'var(--t-faint)' }}>
              Every enquiry is read by a person on the team.
            </figcaption>
          </figure>
        }
      />

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="grid g2 grid--loose" style={{ gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)' }}>
            <div>
              <Suspense fallback={<div className="panel"><span className="spinner" /></div>}>
                <ContactRouter />
              </Suspense>
            </div>

            <aside>
              <div className="panel reveal up" style={{ padding: 26 }}>
                <div className="eyebrow">Rather talk?</div>
                <a
                  href={`https://wa.me/${site.company.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ marginTop: 16, justifyContent: 'center' }}
                >
                  <Icon name="wa" size={17} /> WhatsApp the team
                </a>
                <div style={{ marginTop: 20, display: 'grid', gap: 10, fontSize: 13.5, color: 'var(--t-muted)' }}>
                  <span><b style={{ color: '#fff' }}>{site.company.phone}</b><br />Calls and WhatsApp</span>
                  <span><b style={{ color: '#fff' }}>{site.company.email}</b><br />Email</span>
                </div>
                <p style={{ marginTop: 18, fontSize: 12.5, color: 'var(--t-faint)', lineHeight: 1.65 }}>
                  The team works round the clock across time zones, so a message sent at an odd hour is not
                  wasted. We answer in the order messages arrive.
                </p>
              </div>

              <div className="panel reveal up" style={{ padding: 26, marginTop: 16 }}>
                <div className="eyebrow">What happens next</div>
                <div className="timeline" style={{ marginTop: 12 }}>
                  <div className="timeline__row" style={{ padding: '14px 0' }}>
                    <div className="timeline__when">Day 0</div>
                    <div className="timeline__what"><b>You send it</b><p>It lands in our inbox and on the dashboard.</p></div>
                  </div>
                  <div className="timeline__row" style={{ padding: '14px 0' }}>
                    <div className="timeline__when">Reply</div>
                    <div className="timeline__what"><b>A person answers</b><p>Not an autoresponder. Questions, or a scope.</p></div>
                  </div>
                  <div className="timeline__row" style={{ padding: '14px 0' }}>
                    <div className="timeline__when">Scope</div>
                    <div className="timeline__what"><b>Price and date, in writing</b><p>Fixed figure. You hold us to it.</p></div>
                  </div>
                </div>
              </div>

              <div className="panel reveal up" style={{ padding: 26, marginTop: 16 }}>
                <div className="eyebrow">Other addresses</div>
                <div style={{ display: 'grid', gap: 10, marginTop: 14, fontSize: 13.5 }}>
                  <a href="https://academy.kr8digitals.com" target="_blank" rel="noopener noreferrer" className="btn-link">
                    Free training <span aria-hidden>↗</span>
                  </a>
                  <a href="/tribe" className="btn-link">
                    The Tribe <Icon name="arrow" size={14} />
                  </a>
                  <a href="/referrals" className="btn-link">Referrals &amp; commission</a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <ClosingCTA
        title="If you run a school, a business, or a brand, we should talk."
        copy="One form. A real reply. A price you can hold us to."
        cta="Start at the top"
        href="#form"
        secondary={{ label: 'See the work first', href: '/services/website-design#portfolio' }}
      />
    </>
  );
}
