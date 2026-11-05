import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'KR8 Digitals — whoever you are, whatever you do, we exist because of you';

export default async function OG() {
  const [display, body, markFile] = await Promise.all([
    readFile(path.join(process.cwd(), 'public/fonts/montserrat-800.ttf')),
    readFile(path.join(process.cwd(), 'public/fonts/sora-600.ttf')),
    readFile(path.join(process.cwd(), 'public/img/brand/kr8-mark.png')),
  ]);
  const mark = `data:image/png;base64,${markFile.toString('base64')}`;

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mark} width={72} height={72} alt="" />
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            <div style={{ display: 'flex' }}>KR8</div>
            <div style={{ display: 'flex', color: '#ff6ab8', marginLeft: 10 }}>Digitals</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 26, letterSpacing: 6, textTransform: 'uppercase', color: '#c6b4f2', fontWeight: 600 }}>
            Websites · brand · film · AI · SEO
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Montserrat', fontSize: 62, lineHeight: 1.06, fontWeight: 800, color: '#d9d2ec', letterSpacing: '-0.03em', marginTop: 22, maxWidth: 1000 }}>
            <div style={{ display: 'flex' }}>Whoever you are, whatever you do,</div>
            <div style={{ display: 'flex', color: '#ff5cab', fontSize: 78, marginTop: 8 }}>we exist because of you.</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: 24, color: '#b9aece' }}>
22 sites deployed · 6 client flyers · 4 films · 1,200+ trained
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
