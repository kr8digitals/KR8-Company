import Link from 'next/link';
import { Icon } from '@/components/ui';

export const metadata = { title: 'Page not found' };

const WAYS = [
  { t: 'The services', d: 'Websites, brand, video, AI and search.', href: '/services' },
  { t: 'The programmes', d: 'Free training, the Tribe, Mindset Shift.', href: '/programs' },
  { t: 'The work', d: 'Live sites we have built and deployed.', href: '/services/website-design#work' },
  { t: 'Talk to someone', d: 'One form, a real reply within a day.', href: '/contact' },
];

export default function NotFound() {
  return (
    <section className="section" style={{ paddingTop: 160, minHeight: '78vh' }}>
      <div className="wrap" style={{ maxWidth: 880 }}>
        <div className="eyebrow">404</div>
        <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 58, lineHeight: 1.02, fontWeight: 800, letterSpacing: '-.035em', marginTop: 12 }}>
          This page moved,<br /><span className="text-grad">or never existed.</span>
        </h1>
        <p style={{ marginTop: 18, fontSize: 17, color: 'var(--t-body)', maxWidth: 560 }}>
          The old KR8 site had ten pages and no structure. This one has more, so a handful of old links
          point at nothing. Four ways to land somewhere real:
        </p>
        <div className="grid g2" style={{ marginTop: 34, maxWidth: 720 }}>
          {WAYS.map((w) => (
            <Link key={w.t} href={w.href} className="card card--hover">
              <h3 style={{ fontSize: 18 }}>{w.t}</h3>
              <p style={{ fontSize: 13, marginTop: 6 }}>{w.d}</p>
              <span className="btn-link" style={{ marginTop: 12, display: 'inline-flex' }}>Open <Icon name="arrow" size={13} /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
