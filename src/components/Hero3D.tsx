'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/**
 * The hero stage.
 *
 * A ring built from the actual work: sixteen surfaces carrying screenshots of
 * sites we have deployed, flyers made in association with Motion Verse and
 * frames from real films. Nothing abstract is rendered here — every panel is a
 * piece of shipped work.
 *
 *   Ring      — the work orbiting. It turns on its own; drag it and it follows.
 *   Disassembly — the ring breaks apart into a drifting filmstrip, then reforms.
 *   People    — the panels fall away and the three founders come forward.
 *
 * Performance: lazy canvas, DPR capped at 1.75, paused when offscreen or when
 * the tab is hidden, one frozen frame under prefers-reduced-motion, and a
 * static image fallback when WebGL is unavailable.
 */

export type Scene = { key: string; title: string; sub: string; href: string; cta: string; outbound?: boolean };

export const SCENES: Scene[] = [
  { key: 'ring', title: 'Twenty-two sites. Every one live.', sub: 'Tap any panel — the work opens in a new tab', href: '/services/website-design#portfolio', cta: 'See the portfolio' },
  { key: 'break', title: 'Built to be opened, not admired.', sub: 'Sites, flyers and films we shipped this year', href: '/services', cta: 'What we build' },
  { key: 'people', title: 'Built by people you can name.', sub: 'Three founders. One company.', href: '/about', cta: 'Meet KR8 Digitals' },
];

const PANELS = [
  '/img/sites/cirenes-card.webp',
  '/img/brand/zoey-perfume-card.webp',
  '/img/sites/monabliss-card.webp',
  '/img/sites/afristem-card.webp',
  '/img/brand/city-fashion-stores-card.webp',
  '/img/sites/vegas-card.webp',
  '/img/sites/salt-lake-card.webp',
  '/video/story-02-poster.webp',
  '/img/sites/tastia-card.webp',
  '/img/brand/ridwan-footwear-card.webp',
  '/img/sites/rapha-card.webp',
  '/img/sites/galaxy-lapalm-card.webp',
  '/img/brand/presco-trip-card.webp',
  '/img/sites/mcgettrick-card.webp',
  '/video/story-03-poster.webp',
  '/img/sites/adig-suites-card.webp',
];

const PEOPLE = [
  { src: '/img/team/founder-timfire.jpg', name: 'Timfire' },
  { src: '/img/team/stevenson.jpg', name: 'Stevenson' },
  { src: '/img/team/daniel.jpg', name: 'Daniel' },
];

export default function Hero3D({ initial = 0 }: { initial?: number }) {
  const holder = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState(initial);
  const [failed, setFailed] = useState(false);
  const sceneRef = useRef(initial);

  useEffect(() => { sceneRef.current = scene; }, [scene]);

  useEffect(() => {
    let disposed = false;
    let raf = 0;
    let renderer: import('three').WebGLRenderer | null = null;
    let cleanup: (() => void) | null = null;
    const host = holder.current;
    if (!host) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    (async () => {
      let THREE: typeof import('three');
      try { THREE = await import('three'); } catch { setFailed(true); return; }
      if (disposed || !holder.current) return;

      const W = () => holder.current?.clientWidth || 560;
      const H = () => holder.current?.clientHeight || 560;

      let r: import('three').WebGLRenderer;
      try {
        r = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      } catch { setFailed(true); return; }
      renderer = r;
      r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      r.setSize(W(), H());
      r.domElement.style.display = 'block';
      host.appendChild(r.domElement);

      const scene3 = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, W() / H(), 0.1, 100);
      camera.position.set(0, 0.2, 9.4);

      const group = new THREE.Group();
      scene3.add(group);

      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');

      const ease = (t: number) => 1 - Math.pow(1 - t, 3);

      // ---- panels ------------------------------------------------------------
      const COUNT = PANELS.length;
      type Panel = {
        mesh: import('three').Mesh;
        pos: import('three').Vector3;
        rot: import('three').Euler;
        phase: number;
      };
      const panels: Panel[] = [];
      const geo = new THREE.PlaneGeometry(1.62, 2.03, 1, 1);

      PANELS.forEach((src, i) => {
        const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geo, mat);
        // rounded-ish frame behind the image
        const frameGeo = new THREE.PlaneGeometry(1.72, 2.13, 1, 1);
        const frameMat = new THREE.MeshBasicMaterial({ color: 0x1c0f38, transparent: true, opacity: 0, side: THREE.DoubleSide });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.z = -0.012;
        mesh.add(frame);

        loader.load(src, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearFilter;
          mat.map = tex;
          mat.needsUpdate = true;
        });

        const phase = (i / COUNT) * Math.PI * 2;
        panels.push({ mesh, pos: new THREE.Vector3(), rot: new THREE.Euler(), phase });
        group.add(mesh);
      });

      // ---- people ------------------------------------------------------------
      const people: { mesh: import('three').Mesh; mat: import('three').MeshBasicMaterial; base: import('three').Vector3 }[] = [];
      const pGeo = new THREE.PlaneGeometry(1.9, 2.38);
      PEOPLE.forEach((p, i) => {
        const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(pGeo, mat);
        loader.load(p.src, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearFilter;
          mat.map = tex;
          mat.needsUpdate = true;
        });
        const base = new THREE.Vector3((i - 1) * 2.25, i === 1 ? 0.24 : -0.12, i === 1 ? 0.9 : 0);
        people.push({ mesh, mat, base });
        scene3.add(mesh);
      });

      // ---- state -------------------------------------------------------------
      let rot = 0;
      let vel = 0.0022;
      let drag = false;
      let lastX = 0;
      let hover = 0;
      let hoverTarget = 0;
      let time = 0;
      let visible = true;
      let introStart = performance.now();
      const clocks = panels.map((_, i) => i * 0.37);

      const pointerDown = (e: PointerEvent) => { drag = true; lastX = e.clientX; host.setPointerCapture?.(e.pointerId); };
      const pointerUp = () => { drag = false; };
      const pointerMove = (e: PointerEvent) => {
        if (!drag) return;
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        vel += dx * 0.00055;
      };
      const enter = () => { hoverTarget = 1; };
      const leave = () => { hoverTarget = 0; drag = false; };

      r.domElement.addEventListener('pointerdown', pointerDown);
      window.addEventListener('pointerup', pointerUp);
      window.addEventListener('pointermove', pointerMove);
      host.addEventListener('pointerenter', enter);
      host.addEventListener('pointerleave', leave);

      const io = new IntersectionObserver((ents) => { visible = ents[0].isIntersecting; }, { threshold: 0.05 });
      io.observe(host);
      const onVis = () => { visible = !document.hidden && visible; };
      document.addEventListener('visibilitychange', onVis);

      const onResize = () => {
        if (!renderer) return;
        camera.aspect = W() / H();
        camera.updateProjectionMatrix();
        renderer.setSize(W(), H());
      };
      window.addEventListener('resize', onResize);

      let frameFrozen = false;
      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        if (!visible || document.hidden) return;
        if (reduce && frameFrozen) return;

        time += 0.016;
        const s = sceneRef.current;
        hover += (hoverTarget - hover) * 0.06;

        const intro = Math.min(1, (now - introStart) / 1400);

        // rotation: self-driven, user can throw it
        if (!drag) vel += (0.0022 - vel) * 0.02;
        rot += vel;
        group.rotation.y = rot;

        panels.forEach((p, i) => {
          const m = p.mesh;
          const mat = m.material as import('three').MeshBasicMaterial;
          const frameMat = (m.children[0] as import('three').Mesh).material as import('three').MeshBasicMaterial;
          const clock = clocks[i] + time;

          if (s === 0) {
            // RING — a cylinder of work, gently breathing
            const a = p.phase;
            const radius = 3.95 + Math.sin(clock * 0.8) * 0.12;
            const y = Math.sin(p.phase * 3 + time * 0.5) * 0.16;
            p.pos.set(Math.sin(a) * radius, y, Math.cos(a) * radius);
            p.rot.set(0, a, 0);
            m.rotation.set(p.rot.x, p.rot.y, p.rot.z);
            m.position.copy(p.pos);
            mat.opacity += (ease(intro) * 0.96 - mat.opacity) * 0.08;
            frameMat.opacity = mat.opacity * 0.85;
            m.scale.setScalar(0.86 + ease(intro) * 0.14);
          } else if (s === 1) {
            // DISASSEMBLY — the ring breaks into a drifting filmstrip
            const n = (i - (COUNT - 1) / 2) / COUNT;
            const x = n * 12.6;
            const y = Math.sin(clock * 1.1) * 0.34 + (i % 2 ? 0.12 : -0.12);
            const z = 1.6 - Math.abs(n) * 8.4 + Math.sin(clock * 0.7) * 0.22;
            p.pos.set(x, y, z);
            p.rot.set(0, -n * 1.15 + Math.sin(clock * 0.5) * 0.06, -n * 0.06);
            m.position.lerp(p.pos, 0.06);
            m.rotation.x += (p.rot.x - m.rotation.x) * 0.07;
            m.rotation.y += (p.rot.y - m.rotation.y) * 0.07;
            m.rotation.z += (p.rot.z - m.rotation.z) * 0.07;
            mat.opacity += (0.95 - mat.opacity) * 0.06;
            frameMat.opacity = mat.opacity * 0.85;
            m.scale.setScalar(0.92);
          } else {
            // PEOPLE — work recedes, founders come forward
            const a = p.phase;
            p.pos.set(Math.sin(a) * 7.2, Math.cos(a) * 1.4, Math.cos(a) * 4.2 - 2.4);
            p.rot.set(0, a, 0);
            m.position.lerp(p.pos, 0.05);
            m.rotation.y += (p.rot.y - m.rotation.y) * 0.05;
            mat.opacity += (0.1 - mat.opacity) * 0.07;
            frameMat.opacity = mat.opacity * 0.85;
            m.scale.setScalar(0.82);
          }
        });

        people.forEach((p, i) => {
          const on = s === 2;
          const drift = Math.sin(time * 0.7 + i) * 0.06;
          p.mesh.position.set(p.base.x, p.base.y + drift, p.base.z + (on ? 1.2 : -1.6));
          p.mesh.rotation.y += ((on ? 0 : 0.6) - p.mesh.rotation.y) * 0.06;
          p.mat.opacity += ((on ? 0.97 : 0) - p.mat.opacity) * 0.07;
        });

        group.rotation.x += ((hover * -0.1) - group.rotation.x) * 0.04;
        camera.position.z += ((s === 1 ? 7.6 : 9.4) - camera.position.z) * 0.03;

        renderer!.render(scene3, camera);
        if (reduce && !frameFrozen) frameFrozen = true;
      };
      raf = requestAnimationFrame(tick);

      cleanup = () => {
        cancelAnimationFrame(raf);
        cancelAnimationFrame(raf);
        r.domElement.removeEventListener('pointerdown', pointerDown);
        window.removeEventListener('pointerup', pointerUp);
        window.removeEventListener('pointermove', pointerMove);
        host.removeEventListener('pointerenter', enter);
        host.removeEventListener('pointerleave', leave);
        document.removeEventListener('visibilitychange', onVis);
        window.removeEventListener('resize', onResize);
        io.disconnect();
        scene3.traverse((o) => {
          const m = o as import('three').Mesh;
          if (m.geometry) m.geometry.dispose();
          const mats = Array.isArray(m.material) ? m.material : [m.material];
          mats.forEach((mm) => { if (mm) { const t = (mm as import('three').MeshBasicMaterial).map; t?.dispose(); mm.dispose(); } });
        });
        r.dispose();
        if (r.domElement.parentNode === host) host.removeChild(r.domElement);
      };
    })();

    return () => { disposed = true; cleanup?.(); };
  }, []);

  const s = SCENES[scene];

  return (
    <div className="stage-wrap">
      <div className="stage-glow" aria-hidden />
      {failed ? (
        <div className="stage-fallback">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/sites/cirenes-card.webp" alt="A live site built by KR8 Digitals" style={{ width: '78%', borderRadius: 16, border: '1px solid var(--hair)' }} />
        </div>
      ) : (
        <div className="stage" ref={holder} role="img" aria-label="A rotating ring of live sites, flyers and films built by KR8 Digitals. Drag to spin." />
      )}

      <div className="stage-caption">
        <div className="t">{s.title}</div>
        <div className="s">{s.sub}</div>
        <Link href={s.href} className="btn-link" style={{ marginTop: 8, display: 'inline-flex' }}>
          {s.cta} <span aria-hidden style={{ marginLeft: 6 }}>→</span>
        </Link>
        <div className="stage-scenes" role="tablist" aria-label="Hero scenes">
          {SCENES.map((sc, i) => (
            <button
              key={sc.key}
              role="tab"
              aria-selected={i === scene}
              aria-label={sc.title}
              onClick={() => setScene(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
