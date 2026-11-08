'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import sitesData from '../../data/sites.json';
import { Icon } from './ui';

export type ShowcaseMode = 'sites' | 'branding' | 'flyers' | 'videos' | 'ai' | 'seo';

type Site = (typeof sitesData.sites)[number];
type Flyer = (typeof sitesData.flyers)[number];
type Video = (typeof sitesData.videos)[number];

type Open =
  | { kind: 'site'; item: Site }
  | { kind: 'flyer'; item: Flyer }
  | { kind: 'video'; item: Video }
  | null;

const WHATSAPP = '2348125687509';

const BRAND_SYSTEM_DELIVERABLES = [
  {
    num: '01 · POSITIONING & VOICE',
    title: 'Category Definition & Brand Messaging',
    desc: 'Clarifying who you serve, how your organisation speaks, and why discerning buyers choose you over generic alternatives.',
  },
  {
    num: '02 · MARK ARCHITECTURE',
    title: 'Primary, Secondary & Submark Logos',
    desc: 'Precision vector marks engineered for razor-sharp legibility across a 24px mobile avatar, document letterhead, or physical signage.',
  },
  {
    num: '03 · VISUAL LANGUAGE',
    title: 'Typography, Color Psychology & Grid Systems',
    desc: 'Structured font pairings, accessible contrast palettes, and compositional rules built for instant brand recognition.',
  },
  {
    num: '04 · BRAND PLAYBOOK',
    title: 'Comprehensive Brand Guidelines Book',
    desc: 'A practical digital and print-ready Brand Book empowering internal teams and vendors to ship consistent work every time.',
  },
];

export default function Showcase({
  mode,
  limit,
  filters = true,
}: {
  mode: ShowcaseMode;
  limit?: number;
  filters?: boolean;
  showPrices?: boolean;
  heading?: string;
}) {
  const [open, setOpen] = useState<Open>(null);
  const [cat, setCat] = useState('All');
  const closeRef = useRef<HTMLButtonElement>(null);

  const cats = useMemo(() => {
    if (mode === 'sites') return ['All', ...sitesData.categories];
    if (mode === 'flyers') return ['All', 'Event flyers', 'Product flyers', 'Retail', 'Social templates'];
    return [];
  }, [mode]);

  const sites = useMemo(() => {
    let list = sitesData.sites;
    if (cat !== 'All') list = list.filter((s) => s.category === cat);
    return limit ? list.slice(0, limit) : list;
  }, [cat, limit]);

  const flyers = useMemo(() => {
    const list = cat === 'All' ? sitesData.flyers : sitesData.flyers.filter((f) => f.kind === cat);
    return limit ? list.slice(0, limit) : list;
  }, [cat, limit]);

  const videos = useMemo(
    () => (limit ? sitesData.videos.slice(0, limit) : sitesData.videos),
    [limit]
  );

  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  const waQuote = (name: string) =>
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
      `Hello KR8 DIGITALS — I would like to discuss a project inspired by ${name}.`
    )}`;

  return (
    <div className="gal">
      {filters && cats.length > 1 && (
        <div className="gal__bar">
          <div className="gal__filters" role="group" aria-label={`Filter ${mode}`}>
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- SITES */}
      {mode === 'sites' && (
        <>
          <div className="gal__grid">
            {sites.map((s) => (
              <article className="gal-card" key={s.slug}>
                <a
                  className="gal-card__shot"
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${s.name} live deployment in a new tab`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.card}
                    alt={`${s.name} website engineered and deployed by KR8 DIGITALS`}
                    width={880}
                    height={611}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="gal-card__open">
                    Open live site <span aria-hidden>↗</span>
                  </span>
                </a>
                <div className="gal-card__body">
                  <div className="gal-card__top">
                    <span className="badge-status paid">Live Deployment</span>
                    <span className="tag">{s.kind}</span>
                  </div>
                  <h3>{s.name}</h3>
                  <p>{s.note}</p>
                  <div className="gal-card__foot">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-link"
                    >
                      Visit Live <Icon name="external" size={13} />
                    </a>
                    <button
                      className="btn-link"
                      onClick={() => setOpen({ kind: 'site', item: s })}
                    >
                      Inspect Build <Icon name="arrow" size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="gal__note">
            Every platform above is a real, deployed web build engineered by KR8 DIGITALS — click any preview to
            test speed and responsiveness live in your browser.
          </p>
        </>
      )}

      {/* ---------------------------------------------------------- BRANDING */}
      {mode === 'branding' && (
        <div style={{ display: 'grid', gap: 28 }}>
          <div className="kr8-grid-2" style={{ alignItems: 'center' }}>
            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/services/brand-identity.webp"
                alt="KR8 DIGITALS × Motionverse Brand Identity Architecture and Guidelines"
              />
            </div>
            <div className="kr8-card kr8-card--accent">
              <div className="kr8-card__num">KR8 DIGITALS × MOTIONVERSE</div>
              <h3 className="kr8-card__title">
                Complete Brand Architecture — Built Beyond Just a Logo
              </h3>
              <p className="kr8-card__body">
                Directed with Co-Founder <strong>Steveoking</strong> (Stevenson) of{' '}
                <strong>Motionverse</strong>, every branding engagement delivers strategic market positioning,
                scalable vector mark suites, typographic rules, and practical brand guidelines so your entire
                organisation presents one unmistakable face.
              </p>
              <div className="kr8-card__foot">
                <Link href="/contact?service=branding" className="btn-primary">
                  Request a Brand Identity Scope <Icon name="arrow" size={16} />
                </Link>
              </div>
            </div>
          </div>

          <div className="kr8-grid-4">
            {BRAND_SYSTEM_DELIVERABLES.map((b) => (
              <article className="kr8-card" key={b.num} style={{ padding: '22px 24px' }}>
                <div className="kr8-card__num">{b.num}</div>
                <h4 className="kr8-card__title" style={{ fontSize: 18 }}>
                  {b.title}
                </h4>
                <p className="kr8-card__body" style={{ fontSize: 13.8 }}>
                  {b.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------ FLYERS */}
      {mode === 'flyers' && (
        <>
          <div className="gal__grid gal__grid--brand">
            {flyers.map((f) => (
              <article className="gal-card gal-card--poster" key={f.slug}>
                <button
                  className="gal-card__shot"
                  onClick={() => setOpen({ kind: 'flyer', item: f })}
                  aria-label={`View ${f.title} full size`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.card}
                    alt={`${f.title} — commercial design by KR8 DIGITALS in association with Motionverse`}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="gal-card__open">Inspect full artwork</span>
                </button>
                <div className="gal-card__body">
                  <div className="gal-card__top">
                    <span className="tag">{f.kind}</span>
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.note}</p>
                  <div className="gal-card__credit">KR8 DIGITALS × Motionverse</div>
                </div>
              </article>
            ))}
          </div>
          <p className="gal__note">
            Commissioned client campaign artwork designed by KR8 DIGITALS in association with co-founding design
            partner Motionverse.
          </p>
        </>
      )}

      {/* ------------------------------------------------------------ VIDEOS */}
      {mode === 'videos' && (
        <>
          <div className="gal__grid gal__grid--video">
            {videos.map((v) => (
              <article className="gal-card gal-card--poster" key={v.slug}>
                <button
                  className="gal-card__shot gal-card__shot--video"
                  onClick={() => setOpen({ kind: 'video', item: v })}
                  aria-label={`Play ${v.title} — ${v.duration}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.poster}
                    alt={`Poster frame from ${v.title}`}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="gal-card__play" aria-hidden>
                    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                      <path d="M8 5.5v13l11-6.5z" />
                    </svg>
                  </span>
                  <span className="gal-card__dur">{v.duration}</span>
                </button>
                <div className="gal-card__body">
                  <div className="gal-card__top">
                    <span className="tag">{v.kind}</span>
                  </div>
                  <h3>{v.title}</h3>
                  <p>{v.note}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="gal__note">
            Streamed directly in browser — select any cut above to play pacing, captions, and sound design in
            place. Directed with Chigoma.
          </p>
        </>
      )}

      {/* ---------------------------------------------------------------- AI */}
      {mode === 'ai' && (
        <div className="gal__grid gal__grid--duo">
          <article className="gal-card">
            <Link className="gal-card__shot" href="/contact?service=ai-automation" aria-label="Commission an AI agent">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/services/ai-automation.webp"
                alt="Custom AI Agent and operational automation architecture by KR8 DIGITALS"
                loading="lazy"
              />
              <span className="gal-card__open">Scope an AI Agent</span>
            </Link>
            <div className="gal-card__body">
              <div className="gal-card__top">
                <span className="badge-status earned">Live In Production</span>
                <span className="tag">Grounded Assistant</span>
              </div>
              <h3>RIYA — KR8 DIGITALS Intelligent AI Representative</h3>
              <p>
                Running live across every page of this website: understands visitor intent, retrieves verified
                organizational knowledge, captures feedback, and routes conversations directly to our team.
              </p>
            </div>
          </article>
          <article className="gal-card">
            <a
              className="gal-card__shot"
              href="https://jev-and-ai-sdk-zeta-seven.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the Jev AI form router in a new tab"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/sites/jev-card.webp"
                alt="Jev intelligent intake router engineered by KR8 DIGITALS"
                loading="lazy"
              />
              <span className="gal-card__open">
                Open live build <span aria-hidden>↗</span>
              </span>
            </a>
            <div className="gal-card__body">
              <div className="gal-card__top">
                <span className="badge-status earned">Live Deployment</span>
                <span className="tag">Workflow Triage</span>
              </div>
              <h3>Jev Intelligent Intake Router</h3>
              <p>
                Classifies incoming submissions automatically across sales leads, general inquiries, and support
                escalations — routing each to the exact right desk without manual sorting.
              </p>
            </div>
          </article>
        </div>
      )}

      {/* --------------------------------------------------------------- SEO */}
      {mode === 'seo' && (
        <div className="seo-visual">
          <div className="seo-visual__steps">
            {[
              ['01', 'Technical Crawl', 'Comprehensive audit of indexing, sitemaps, speed, and schema health.'],
              ['02', 'Infrastructure Fix', 'Metadata, OpenGraph, Core Web Vitals, and mobile usability remediation.'],
              ['03', 'Intent Pages', 'Dedicated high-conversion landing routes for every service and market.'],
              ['04', 'Monthly Proof', 'Transparent Search Console reporting tracking impressions, clicks, and queries.'],
            ].map(([n, t, d]) => (
              <div className="seo-step" key={n}>
                <span className="seo-step__n">{n}</span>
                <b>{t}</b>
                <p>{d}</p>
              </div>
            ))}
          </div>
          <div className="seo-visual__panel panel">
            <div className="eyebrow eyebrow--lilac">Search Architecture Standard</div>
            <h3 style={{ marginTop: 10 }}>Built into our own platform first.</h3>
            <ul className="price-list">
              <li>
                <Icon name="check" size={16} /> Distinct canonical titles &amp; descriptions on every route
              </li>
              <li>
                <Icon name="check" size={16} /> Verified OpenGraph &amp; social preview cards
              </li>
              <li>
                <Icon name="check" size={16} /> Automated XML sitemap &amp; clean robots directives
              </li>
              <li>
                <Icon name="check" size={16} /> Semantic heading hierarchy &amp; JSON-LD Organization schema
              </li>
              <li>
                <Icon name="check" size={16} /> Mobile-first rendering &amp; compressed WebP media delivery
              </li>
            </ul>
            <Link href="/contact?service=seo" className="btn-primary" style={{ marginTop: 8 }}>
              Request an SEO Audit <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- LIGHTBOX */}
      {open && (
        <div className="lb" role="dialog" aria-modal="true" aria-label="Portfolio Preview" onClick={close}>
          <div className="lb__panel" onClick={(e) => e.stopPropagation()}>
            <button className="lb__close" onClick={close} ref={closeRef} aria-label="Close preview">
              ✕
            </button>

            {open.kind === 'site' && (
              <>
                <div className="lb__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={open.item.full} alt={`${open.item.name} — full deployment preview`} />
                </div>
                <div className="lb__body">
                  <div className="gal-card__top">
                    <span className="badge-status paid">Live Deployment</span>
                    <span className="tag">{open.item.kind}</span>
                  </div>
                  <h3>{open.item.name}</h3>
                  <p>{open.item.note}</p>
                  <div className="actions" style={{ marginTop: 18 }}>
                    <a
                      href={open.item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      Open Live Website <span aria-hidden>↗</span>
                    </a>
                    <Link
                      href={`/contact?service=website-design&ref=${open.item.slug}`}
                      className="btn-ghost"
                    >
                      Request a Similar Build
                    </Link>
                    <a
                      href={waQuote(open.item.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost"
                    >
                      <Icon name="wa" size={16} /> Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </>
            )}

            {open.kind === 'flyer' && (
              <>
                <div className="lb__media lb__media--poster">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={open.item.full} alt={`${open.item.title} — full-size campaign design`} />
                </div>
                <div className="lb__body">
                  <div className="gal-card__top">
                    <span className="tag">{open.item.kind}</span>
                  </div>
                  <h3>{open.item.title}</h3>
                  <p>{open.item.note}</p>
                  <div className="gal-card__credit">
                    KR8 DIGITALS × Motionverse{open.item.client ? ` · Client: ${open.item.client}` : ''}
                  </div>
                  <div className="actions" style={{ marginTop: 18 }}>
                    <Link href="/contact?service=graphic-design" className="btn-primary">
                      Commission Similar Design <Icon name="arrow" size={16} />
                    </Link>
                    <a href={open.item.full} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                      View Full Resolution
                    </a>
                  </div>
                </div>
              </>
            )}

            {open.kind === 'video' && (
              <>
                <div className="lb__media lb__media--video">
                  <video
                    src={open.item.src}
                    poster={open.item.poster}
                    controls
                    playsInline
                    preload="metadata"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
                  />
                </div>
                <div className="lb__body">
                  <div className="gal-card__top">
                    <span className="tag">{open.item.kind}</span>
                    <span className="tag">{open.item.duration}</span>
                  </div>
                  <h3>{open.item.title}</h3>
                  <p>{open.item.note}</p>
                  <div className="actions" style={{ marginTop: 18 }}>
                    <Link href="/contact?service=video-editing" className="btn-primary">
                      Start a Video Project <Icon name="arrow" size={16} />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
