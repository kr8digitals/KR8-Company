'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { track } from '@/lib/track';

export default function RefCapture({ code }: { code: string }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('kr8.ref', code); } catch { /* noop */ }
    track('referral_visit', { code });
    setReady(true);
    const t = setTimeout(() => router.replace(`/contact?ref=${encodeURIComponent(code)}`), 700);
    return () => clearTimeout(t);
  }, [code, router]);

  return (
    <section className="section" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>
      <div className="wrap" style={{ textAlign: 'center', maxWidth: 560 }}>
        <div className="badge"><span className="badge-dot" /> Introduction received</div>
        <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 38, fontWeight: 800, letterSpacing: '-.03em', marginTop: 18 }}>
          Someone sent you here.
        </h1>
        <p style={{ marginTop: 14, color: 'var(--t-body)', fontSize: 16 }}>
          Your introduction is recorded under <b style={{ color: '#fff' }}>{code}</b>. Taking you to the
          form now.
        </p>
        <noscript>
          <p style={{ marginTop: 16 }}><a href={`/contact?ref=${code}`} style={{ color: '#ff2d9b' }}>Continue to the contact form →</a></p>
        </noscript>
        <div style={{ marginTop: 24 }}>{!ready && <span className="spinner" />}</div>
      </div>
    </section>
  );
}
