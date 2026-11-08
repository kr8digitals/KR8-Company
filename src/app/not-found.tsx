import Link from 'next/link';
import { Icon } from '@/components/ui';
import { SectionAtmosphere } from '@/components/MobileExperience';

export default function NotFound() {
  return (
    <section className="kr8-subhero" style={{ minHeight: '76vh', display: 'flex', alignItems: 'center' }}>
      <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.32} mobOpacity={0.44} flare />
      <div className="wrap">
        <div style={{ maxWidth: 680 }}>
          <span className="kr8-pill">404 · Page Not Found</span>
          <h1 className="kr8-subhero__title">
            That address isn&apos;t here —{' '}
            <em>let&apos;s get you to the right room.</em>
          </h1>
          <p className="kr8-subhero__lede">
            The link you followed may have moved or been mistyped. Jump straight to any core destination across
            KR8 DIGITALS below.
          </p>
          <div className="kr8-subhero__actions">
            <Link href="/" className="btn-primary">
              Back to Homepage <Icon name="arrow" size={17} />
            </Link>
            <Link href="/services" className="btn-ghost">
              Explore Services
            </Link>
            <Link href="/programs" className="btn-ghost">
              Free Programs
            </Link>
            <Link href="/partners" className="btn-ghost">
              Partners
            </Link>
            <Link href="/contact" className="btn-ghost">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
