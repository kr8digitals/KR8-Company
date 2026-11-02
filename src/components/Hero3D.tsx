'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The hero stage.
 *
 * One asset — a ring of 64 shards — that rearranges itself into four meaningful
 * formations. Nothing here is decorative: each formation carries the section's
 * single idea and its call to action, and the visitor can drive it directly.
 *
 *   0 · The mark      — KR8 assembled
 *   1 · Partnership   — two interlocking rings: KR8 and its partners
 *   2 · Learning      — a rising stair: cohorts building on each other
 *   3 · The team      — three orbits: one team, three crafts
 *
 * Performance contract (Section 5 / 19): lazy-loaded, DPR capped, paused when
 * offscreen or backgrounded, frozen to a single frame under reduced-motion,
 * and a static SVG fallback if WebGL is unavailable.
 */

export type Scene = { key: string; title: string; sub: string; href: string; cta: string; outbound?: boolean };

export const SCENES: Scene[] = [
  { key: 'mark', title: 'One institution, built on one mark.', sub: 'KR8 Digitals · Lagos & Global Remote', href: '/about', cta: 'What we are' },
  { key: 'partner', title: 'We do not build alone.', sub: 'Partners teach, fund, hire and host with us', href: '/partners', cta: 'See the partners' },
  { key: 'learn', title: 'Every cohort raises the next one.', sub: 'Tuition-free · seven tracks · eight weeks', href: 'https://academy.kr8digitals.com/apply', cta: 'Learn free', outbound: true },
  { key: 'team', title: 'One team. Three crafts. Real client work.', sub: 'Design, video and engineering, under one roof', href: '/about/join-the-team', cta: 'Join the team' },
];

const COUNT = 64;

export default function Hero3D({ initial = 0 }: { initial?: number }) {
  const holder = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState(initial);
  const [failed, setFailed] = useState(false);
  const sceneRef = useRef(initial);
  const setSceneRef = useRef<((i: number) => void) | null>(null);

  useEffect(() => { sceneRef.current = scene; setSceneRef.current?.(scene); }, [scene]);

  useEffect(() => {
    let disposed = false;
    let raf = 0;
    let renderer: import('three').WebGLRenderer | null = null;
    let cleanup = () => {};

    (async () => {
      const THREE = await import('three');
      if (disposed || !holder.current) return;

      const el = holder.current;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let r: import('three').WebGLRenderer;
      try {
        r = new THREE.WebGLRenderer({ alpha: true, antialias: window.devicePixelRatio < 2, powerPreference: 'high-performance' });
      } catch {
        setFailed(true);
        return;
      }
      renderer = r;
      r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      r.setSize(el.clientWidth, el.clientHeight, false);
      r.setClearColor(0x000000, 0);
      el.appendChild(r.domElement);

      const scene3 = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 6.4);

      const group = new THREE.Group();
      scene3.add(group);

      // ---- light -------------------------------------------------------
      scene3.add(new THREE.AmbientLight(0xffffff, 0.55));
      const key = new THREE.DirectionalLight(0xfff0fa, 1.5);
      key.position.set(3, 4, 5);
      scene3.add(key);
      const pMag = new THREE.PointLight(0xff2d9b, 26, 18, 2);
      pMag.position.set(-3.2, 1.8, 2.6);
      scene3.add(pMag);
      const pPur = new THREE.PointLight(0x7c3aed, 30, 20, 2);
      pPur.position.set(3.4, -1.6, 1.8);
      scene3.add(pPur);

      // ---- shards ------------------------------------------------------
      const geo = new THREE.BoxGeometry(0.3, 0.3, 0.07);
      const mat = new THREE.MeshStandardMaterial({
        metalness: 0.42, roughness: 0.26, envMapIntensity: 0.6,
        emissive: 0x2a0b3d, emissiveIntensity: 0.5,
      });
      const mesh = new THREE.InstancedMesh(geo, mat, COUNT);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

      const cA = new THREE.Color(0xff2d9b);
      const cB = new THREE.Color(0x7c3aed);
      const cC = new THREE.Color(0xc6b4f2);
      for (let i = 0; i < COUNT; i++) {
        const t = i / (COUNT - 1);
        const c = t < 0.5 ? cA.clone().lerp(cC, t * 2) : cC.clone().lerp(cB, (t - 0.5) * 2);
        mesh.setColorAt(i, c);
      }
      group.add(mesh);

      // ---- formations --------------------------------------------------
      type V = { p: import('three').Vector3; r: import('three').Euler; s: number };
      const formations: V[][] = [];
      const build = (fn: (i: number, n: number) => V) => {
        const arr: V[] = [];
        for (let i = 0; i < COUNT; i++) arr.push(fn(i, COUNT));
        return arr;
      };

      // 0 — the ring mark
      formations.push(build((i, n) => {
        const a = (i / n) * Math.PI * 2;
        const R = 1.72, rr = 0.135;
        const twist = Math.sin(a * 3) * 0.5;
        return {
          p: new THREE.Vector3(Math.cos(a) * R + Math.cos(a) * Math.cos(i) * rr, Math.sin(a) * R, Math.sin(a) * 0.22),
          r: new THREE.Euler(0, -a + Math.PI / 2, twist * 0.34),
          s: 1,
        };
      }));

      // 1 — two interlocking rings (partnership)
      formations.push(build((i, n) => {
        const half = n / 2;
        const first = i < half;
        const k = first ? i : i - half;
        const a = (k / half) * Math.PI * 2;
        const R = 1.12;
        const ox = first ? -0.62 : 0.62;
        return {
          p: new THREE.Vector3(Math.cos(a) * R + ox, Math.sin(a) * R, first ? 0.18 : -0.18),
          r: new THREE.Euler(0, 0, a),
          s: 0.94,
        };
      }));

      // 2 — a rising stair of cohorts
      formations.push(build((i, n) => {
        const cols = 8, rows = Math.ceil(n / cols);
        const c = i % cols, rw = Math.floor(i / cols);
        const h = (rw / rows) * 2.1;
        return {
          p: new THREE.Vector3((c - (cols - 1) / 2) * 0.42, -1.15 + h, ((rw % 2) - 0.5) * 0.5),
          r: new THREE.Euler(0, 0, 0),
          s: 0.86 + (rw / rows) * 0.3,
        };
      }));

      // 3 — three orbits (the team)
      formations.push(build((i, n) => {
        const third = Math.floor(n / 3);
        const ring = i % 3;
        const k = Math.floor(i / 3);
        const a = (k / third) * Math.PI * 2 + ring * 0.6;
        const R = 1.5 - ring * 0.34;
        const tilt = ring * 0.55;
        return {
          p: new THREE.Vector3(Math.cos(a) * R, Math.sin(a) * R * Math.cos(tilt), Math.sin(a) * R * Math.sin(tilt)),
          r: new THREE.Euler(a, tilt, 0),
          s: 0.8,
        };
      }));

      // ---- animation state --------------------------------------------
      const cur = formations[0].map((v) => ({
        p: v.p.clone(), r: new THREE.Euler(v.r.x, v.r.y, v.r.z), s: v.s,
      }));
      let from = formations[0];
      let to = formations[0];
      let morph = 1;
      let active = 0;

      const m4 = new THREE.Matrix4();
      const q = new THREE.Quaternion();
      const pos = new THREE.Vector3();
      const scl = new THREE.Vector3();

      function writeFrame() {
        for (let i = 0; i < COUNT; i++) {
          const c = cur[i];
          scl.setScalar(c.s);
          q.setFromEuler(c.r);
          m4.compose(c.p, q, scl);
          mesh.setMatrixAt(i, m4);
        }
        mesh.instanceMatrix.needsUpdate = true;
      }

      function go(n: number) {
        if (n === active) return;
        active = n;
        from = cur.map((c) => ({ p: c.p.clone(), r: new THREE.Euler(c.r.x, c.r.y, c.r.z), s: c.s }));
        to = formations[n];
        morph = 0;
      }
      setSceneRef.current = go;

      // ---- interaction -------------------------------------------------
      let tx = 0, ty = 0, px = 0, py = 0;
      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      let visible = true;
      const io = new IntersectionObserver((ents) => { visible = ents[0].isIntersecting; }, { threshold: 0.01 });
      io.observe(el);

      const clock = new THREE.Clock();
      let elapsed = 0;
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

      function loop() {
        raf = requestAnimationFrame(loop);
        if (!visible || document.hidden) return;

        const dt = Math.min(clock.getDelta(), 0.05);
        elapsed += dt;

        if (morph < 1) {
          morph = Math.min(1, morph + dt / 1.15);
          const e = easeOut(morph);
          for (let i = 0; i < COUNT; i++) {
            const stagger = Math.min(1, Math.max(0, e * 1.5 - (i / COUNT) * 0.5));
            const t = easeOut(stagger);
            const a = from[i], b = to[i];
            cur[i].p.lerpVectors(a.p, b.p, t);
            cur[i].r.set(
              a.r.x + (b.r.x - a.r.x) * t,
              a.r.y + (b.r.y - a.r.y) * t,
              a.r.z + (b.r.z - a.r.z) * t
            );
            cur[i].s = a.s + (b.s - a.s) * t;
          }
        } else {
          // idle: gentle breathing so the stage is never frozen
          for (let i = 0; i < COUNT; i++) {
            const b = to[i], c = cur[i];
            const phase = elapsed * 0.9 + i * 0.18;
            c.p.copy(b.p).multiplyScalar(1 + Math.sin(phase) * 0.008);
            c.r.set(b.r.x + Math.sin(phase * 0.8) * 0.09, b.r.y + Math.cos(phase * 0.7) * 0.12, b.r.z);
          }
        }
        writeFrame();

        px += (tx * 0.22 - px) * 0.045;
        py += (ty * 0.16 - py) * 0.045;
        group.rotation.y = px + Math.sin(elapsed * 0.16) * 0.12;
        group.rotation.x = py + Math.cos(elapsed * 0.2) * 0.06;
        camera.position.z = 6.4 + Math.sin(elapsed * 0.24) * 0.12;

        r.render(scene3, camera);
      }

      const onResize = () => {
        if (!holder.current) return;
        const w = holder.current.clientWidth, h = holder.current.clientHeight;
        r.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', onResize);

      writeFrame();
      r.render(scene3, camera);

      if (reduce) {
        // One static frame, no loop. The stage is still fully formed.
        cleanup = () => {};
      } else {
        loop();
        cleanup = () => {
          cancelAnimationFrame(raf);
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('resize', onResize);
          io.disconnect();
          geo.dispose();
          mat.dispose();
          r.dispose();
        };
      }
    })().catch(() => setFailed(true));

    return () => {
      disposed = true;
      cleanup();
      renderer?.domElement?.remove();
    };
  }, []);

  const s = SCENES[scene];

  return (
    <>
      <div className="stage-wrap">
        <div className="stage-glow" aria-hidden />
        <div className="stage" ref={holder} aria-hidden="true" />
        {failed && <FallbackMark />}
        <div className="stage-caption">
          <div className="t">{s.title}</div>
          <div className="s">{s.sub}</div>
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
      <div className="sr-only" aria-live="polite">
        {s.title}. {s.cta}: {s.href}
      </div>
    </>
  );
}

function FallbackMark() {
  return (
    <div className="stage-fallback">
      <svg width="260" height="260" viewBox="0 0 260 260" aria-hidden>
        <defs>
          <linearGradient id="kr8g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff2d9b" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <circle cx="130" cy="130" r="92" fill="none" stroke="url(#kr8g)" strokeWidth="14" strokeDasharray="3 7" strokeLinecap="round" />
        <circle cx="130" cy="130" r="56" fill="none" stroke="url(#kr8g)" strokeWidth="2" opacity="0.5" />
        <text x="130" y="146" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontSize="46" fontWeight="800" fill="url(#kr8g)">KR8</text>
      </svg>
    </div>
  );
}
