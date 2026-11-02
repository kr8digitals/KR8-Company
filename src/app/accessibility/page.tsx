import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import site from '../../../data/site.json';

export const metadata: Metadata = {
  title: 'Accessibility statement',
  description: 'How this site is built for keyboard, screen reader and low-data use — and what is still imperfect.',
  alternates: { canonical: '/accessibility' },
};

export default function Accessibility() {
  return (
    <>
      <PageHero
        eyebrow="Accessibility"
        title={<>Built to be used by everyone who arrives</>}
        lede="We train people who have never owned a laptop on a phone with a slow connection. It would be strange to build a site they cannot use."
        crumbs={[{ label: 'Accessibility' }]}
      />
      <section className="section" style={{ paddingTop: 10 }}>
        <div className="wrap" style={{ maxWidth: 860 }}>
          <div className="prose-lg">
            <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 24, fontWeight: 800 }}>What we have done</h2>
            <ul className="price-list" style={{ marginTop: 16 }}>
              {[
                'Every interactive element is reachable and operable by keyboard, with a visible focus ring.',
                'A skip link jumps straight to the main content, before the navigation.',
                'The mobile menu is a real dialog with Escape to close and focus returned to the button that opened it.',
                'Colour contrast meets WCAG 2.1 AA on body text; the gradient is never the only signal that something is a link or a state.',
                'Motion respects prefers-reduced-motion: the 3D stage renders one static frame and all reveal animations resolve instantly.',
                'Images that carry meaning have descriptive alt text; decorative layers are hidden from assistive technology.',
                'Forms have real labels, not placeholder-only fields, and errors are announced in text rather than colour alone.',
                'The Host chat supports typing as well as voice. Voice output is off until you switch it on, and it can be switched off again at any time.',
              ].map((l) => <li key={l}>{l}</li>)}
            </ul>

            <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 24, fontWeight: 800, marginTop: 40 }}>What is not perfect yet</h2>
            <p>
              The 3D hero is decorative and adds no information; it is skipped entirely under reduced motion
              and on browsers without WebGL, but on a very old Android device it still costs battery. If that
              matters to you, the fallback mark is all you will see and nothing is lost.
            </p>
            <p>
              The Host&apos;s generated speech uses the voice installed on your device, so quality varies by
              phone. Voice input is only offered where the browser supports it; otherwise the microphone
              button does not appear.
            </p>

            <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 24, fontWeight: 800, marginTop: 40 }}>Tell us what we missed</h2>
            <p>
              If something here blocks you, write to <b style={{ color: '#fff' }}>{site.company.email}</b> with the
              page and what happened. Accessibility reports get answered like client work, not like feedback.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
