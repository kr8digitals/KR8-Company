'use client';

import dynamic from 'next/dynamic';

const Hero3D = dynamic(() => import('./Hero3D'), {
  ssr: false,
  loading: () => (
    <div className="stage-wrap">
      <div className="stage-glow" aria-hidden />
      <div className="stage-fallback">
        <div className="skel" style={{ width: 240, height: 240, borderRadius: '50%' }} />
      </div>
    </div>
  ),
});

export default function HeroStage(props: { initial?: number }) {
  return <Hero3D {...props} />;
}
