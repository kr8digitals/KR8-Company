'use client';

import { useEffect, useRef, useState } from 'react';
import sitesData from '../../data/sites.json';

/**
 * The hero stage.
 *
 * A ring built from the real work. It is driven by a mode passed down from
 * HeroShow: the sites group, the brand group, the founders, or idle while a
 * title card is on screen. Every panel is a shipped piece — a deployed site or
 * a client flyer. Nothing abstract is rendered here.
 *
 *   sites  — every site we have deployed, grouped into one ring.
 *   brand  — the flyers and identity work, grouped into their own ring.
 *   people — the ring recedes and the three founders come forward.
 *   idle   — everything fades back while a title card holds the stage.
 *
 * The ring keeps its own turn, you can throw it with a drag, the camera tilts
 * per mode so the group fills the frame instead of floating in dead space.
 *
 * Performance: lazy canvas, DPR capped at 1.75, paused when offscreen or when
 * the tab is hidden, one frozen frame under prefers-reduced-motion, and a real
 * screenshot fallback when WebGL is unavailable.
 */

export type HeroMode = 'sites' | 'brand' | 'people' | 'idle';

/** Sites are ordered so the strongest client work shows first. */
const SITE_ORDER = [
  'afristem', 'mcgettrick', 'rapha', 'cirenes', 'monabliss', 'salt-lake',
  'tastia', 'vegas', 'xenia', 'adig-suites', 'house-ten', 'galaxy-lapalm',
  'kamojama', 'afristem-school', 'prime-stem', 'consistency-drill',
];

function sitePanels() {
  const byslug = new Map(sitesData.sites.map((s) => [s.slug, s]));
  const out: { src: string; name: string }[] = [];
  for (const slug of SITE_ORDER) {
    const s = byslug.get(slug);
    if (s?.card) out.push({ src: s.card, name: s.name });
  }
  // anything not in the curated order still deserves a panel
  for (const s of sitesData.sites) {
    if (!SITE_ORDER.includes(s.slug) && s.card) out.push({ src: s.card, name: s.name });
  }
  return out.slice(0, 18);
}

const BRAND = sitesData.flyers.map((f) => ({ src: f.card, name: f.title }));

const PEOPLE = [
  { src: '/img/team/founder-timfire.jpg', name: 'Timfire' },
  { src: '/img/team/stevenson.jpg', name: 'Stevenson' },
  { src: '/img/team/daniel.jpg', name: 'Daniel' },
];

export default function Hero3D({ mode }: { mode: HeroMode }) {
  const holder = useRef<HTMLDivElement>(null);
  const modeRef = useRef<HeroMode>(mode);
  const [failed, setFailed] = useState(false);

  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    let disposed = false;
    let raf = 0;
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
      r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      r.setSize(W(), H());
      r.domElement.style.display = 'block';
      host.appendChild(r.domElement);

      const scene3 = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, W() / H(), 0.1, 100);
      camera.position.set(0, 0.15, 8.9);

      const group = new THREE.Group();
      scene3.add(group);

      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');

      const ease = (t: number) => 1 - Math.pow(1 - t, 3);

      type Panel = {
        mesh: import('three').Mesh;
        mat: import('three').MeshBasicMaterial;
        frameMat: import('three').MeshBasicMaterial;
        pos: import('three').Vector3;
        phase: number;
        group: 'sites' | 'brand';
        index: number;
      };
      const panels: Panel[] = [];

      const geo = new THREE.PlaneGeometry(1.62, 2.03, 1, 1);
      const frameGeo = new THREE.PlaneGeometry(1.72, 2.13, 1, 1);

      const build = (list: { src: string }[], which: 'sites' | 'brand') => {
        list.forEach((item, i) => {
          const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide });
          const mesh = new THREE.Mesh(geo, mat);
          const frameMat = new THREE.MeshBasicMaterial({ color: 0x1c0f38, transparent: true, opacity: 0, side: THREE.DoubleSide });
          const frame = new THREE.Mesh(frameGeo, frameMat);
          frame.position.z = -0.012;
          mesh.add(frame);

          loader.load(item.src, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.minFilter = THREE.LinearFilter;
            mat.map = tex;
            mat.needsUpdate = true;
          });

          panels.push({ mesh, mat, frameMat, pos: new THREE.Vector3(), phase: 0, group: which, index: i });
          group.add(mesh);
        });
      };

      build(sitePanels(), 'sites');
      build(BRAND, 'brand');

      const counts = { sites: 0, brand: 0 };
      panels.forEach((p) => { counts[p.group] += 1; });
      panels.forEach((p) => { p.phase = (p.index / counts[p.group]) * Math.PI * 2; });

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
      let vel = 0.0024;
      let drag = false;
      let lastX = 0;
      let hover = 0;
      let hoverTarget = 0;
      let time = 0;
      let visible = true;

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
        camera.aspect = W() / H();
        camera.updateProjectionMatrix();
        r.setSize(W(), H());
      };
      window.addEventListener('resize', onResize);

      let frameFrozen = false;
      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        if (!visible || document.hidden) return;
        if (reduce && frameFrozen) return;

        time += 0.016;
        const mode = modeRef.current;
        hover += (hoverTarget - hover) * 0.06;

        if (!drag) vel += (0.0024 - vel) * 0.02;
        rot += vel;
        group.rotation.y = rot;

        // per-mode camera + tilt so the group fills the frame
        const tilt = mode === 'sites' ? -0.6 : mode === 'brand' ? -0.45 : mode === 'people' ? 0 : -0.16;
        const camZ = mode === 'sites' ? 7.0 : mode === 'brand' ? 6.35 : mode === 'people' ? 9.2 : 9.6;
        const camY = mode === 'sites' ? 1.05 : mode === 'brand' ? 0.68 : 0.15;
        group.rotation.x += (tilt - group.rotation.x) * 0.05;
        camera.position.z += (camZ - camera.position.z) * 0.04;
        camera.position.y += (camY - camera.position.y) * 0.05;
        camera.lookAt(0, mode === 'sites' ? 0.15 : 0, 0);

        panels.forEach((p) => {
          const showing = mode === p.group;
          const a = p.phase + (p.group === 'brand' ? Math.PI / 6 : 0);
          const radius = p.group === 'sites' ? 3.62 : 2.95;
          const breathe = Math.sin(time * 0.8 + p.index) * (showing ? 0.1 : 0.35);
          const targetY = showing ? Math.sin(p.phase * 3 + time * 0.5) * 0.14 : 0;
          const z = Math.cos(a) * (radius + breathe);
          const x = Math.sin(a) * (radius + breathe);

          p.pos.set(x, targetY, z);
          p.mesh.position.lerp(p.pos, showing ? 0.075 : 0.05);
          p.mesh.rotation.y += (a - p.mesh.rotation.y) * 0.07;
          p.mesh.rotation.z = showing ? Math.sin(a) * -0.04 : 0;

          const target = showing ? 0.96 : 0;
          p.mat.opacity += (target - p.mat.opacity) * (showing ? 0.06 : 0.16);
          p.frameMat.opacity = p.mat.opacity * 0.85;
          const s = showing ? (p.group === 'brand' ? 1.02 : 0.9) : 0.6;
          p.mesh.scale.setScalar(p.mesh.scale.x + (s - p.mesh.scale.x) * 0.06);
        });

        people.forEach((p, i) => {
          const on = mode === 'people';
          const drift = Math.sin(time * 0.7 + i) * 0.06;
          p.mesh.position.set(p.base.x, p.base.y + drift, p.base.z + (on ? 1.2 : -1.6));
          p.mesh.rotation.y += ((on ? 0 : 0.6) - p.mesh.rotation.y) * 0.06;
          p.mat.opacity += ((on ? 0.97 : 0) - p.mat.opacity) * 0.07;
        });

        renderer_render();
        if (reduce && !frameFrozen) frameFrozen = true;
      };
      const renderer_render = () => r.render(scene3, camera);
      raf = requestAnimationFrame(tick);

      cleanup = () => {
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

  if (failed) {
    return (
      <div className="stage-wrap">
        <div className="stage-glow" aria-hidden />
        <div className="stage-fallback">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/sites/cirenes-card.webp" alt="A live site built by KR8 Digitals" style={{ width: '78%', borderRadius: 16, border: '1px solid var(--hair)' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="stage-wrap">
      <div className="stage-glow" aria-hidden />
      <div
        className="stage"
        ref={holder}
        role="img"
        aria-label="A rotating ring of live sites and client flyers built by KR8 Digitals. Drag to spin."
      />
    </div>
  );
}
