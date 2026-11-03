import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'KR8 Digitals — the Academy teaches, the Tribe holds, Services deliver';

export default async function OG() {
  const [display, body] = await Promise.all([
    readFile(path.join(process.cwd(), 'public/fonts/montserrat-800.ttf')),
    readFile(path.join(process.cwd(), 'public/fonts/sora-600.ttf')),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          background: 'linear-gradient(140deg,#0a0614 0%,#1c0f38 55%,#2a0f4d 100%)', padding: 72,
          fontFamily: 'Sora',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 54, height: 54, borderRadius: 16, background: 'linear-gradient(135deg,#ff2d9b,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff' }}><div style={{ display: 'flex' }}>K8</div></div>
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            <div style={{ display: 'flex' }}>KR8</div>
            <div style={{ display: 'flex', color: '#ff6ab8' }}>Digitals</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 26, letterSpacing: 6, textTransform: 'uppercase', color: '#c6b4f2', fontWeight: 600 }}>
            Websites · brand · film · AI · SEO
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Montserrat', fontSize: 84, lineHeight: 1.02, fontWeight: 800, color: '#fff', letterSpacing: '-0.035em', marginTop: 22, maxWidth: 950 }}>
            <div style={{ display: 'flex' }}>Raw talent is everywhere.</div>
            <div style={{ display: 'flex', color: '#ff5cab' }}>Access was not.</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: 24, color: '#b9aece' }}>
            1,200+ trained · 22 sites shipped · 7 tracks
          </div>
          <div style={{ fontSize: 24, color: '#b9aece' }}>kr8digitals.com</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Montserrat', data: display, weight: 800 as const, style: 'normal' as const },
        { name: 'Sora', data: body, weight: 600 as const, style: 'normal' as const },
      ],
    }
  );
}
