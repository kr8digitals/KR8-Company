'use client';
import { formatEditableText } from '@/lib/content-format';
import { useEditableContent } from '@/components/EditableContentProvider';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { track } from '@/lib/track';
import { SectionAtmosphere } from './MobileExperience';

export default function RefCapture({ code }: { code: string }) {
  const editableContent = useEditableContent("components:RefCapture");

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
      <SectionAtmosphere name="referrals-network-cinema" deskOpacity={0.18} mobOpacity={0.3} flare />
      <div className="wrap" style={{ textAlign: 'center', maxWidth: 560 }}>
        <div className="badge"><span className="badge-dot" /> {editableContent.texts.text_739fb47cf2}</div>
        <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 'clamp(26px, 6vw, 38px)', fontWeight: 800, letterSpacing: '-.03em', marginTop: 18 }}>
          {editableContent.texts.text_e463460eac}</h1>
        <p style={{ marginTop: 14, color: 'var(--t-body)', fontSize: 15 }}>
          {editableContent.texts.text_417eee96eb}<b style={{ color: 'var(--t-strong)' }}>{code}</b>{editableContent.texts.text_6367ce27d9}</p>
        <noscript>
          <p style={{ marginTop: 16 }}><a href={formatEditableText("/contact?ref={0}", [code])} style={{ color: '#ff2d9b' }}>{editableContent.texts.text_97bb80dea2}</a></p>
        </noscript>
        <div style={{ marginTop: 24 }}>{!ready && <span className="spinner" />}</div>
      </div>
    </section>
  );
}
