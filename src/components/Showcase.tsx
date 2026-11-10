'use client';
import { formatEditableText } from '@/lib/content-format';
import { useEditableContent } from '@/components/EditableContentProvider';
import { usePublicContent } from '@/components/PublicContentProvider';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import sitesSeed from '../../data/sites.json';
import { Icon } from './ui';

export type ShowcaseMode = 'sites' | 'branding' | 'flyers' | 'videos' | 'ai' | 'seo';

type Site = (typeof sitesSeed.sites)[number];
type Flyer = (typeof sitesSeed.flyers)[number];
type Video = (typeof sitesSeed.videos)[number];

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
  catalog,
}: {
  catalog?: typeof sitesSeed;
  mode: ShowcaseMode;
  limit?: number;
  filters?: boolean;
  showPrices?: boolean;
  heading?: string;
}) {
  const editableContent = useEditableContent("components:Showcase");
  const BRAND_SYSTEM_DELIVERABLES = editableContent.blocks.BRAND_SYSTEM_DELIVERABLES as EditableBlockTypes["BRAND_SYSTEM_DELIVERABLES"];

  const publicData = usePublicContent();
  const sitesSeed = publicData.catalog;

  const sitesData = catalog || publicData.catalog;
  const WHATSAPP = publicData.site.company.whatsapp;
  const [open, setOpen] = useState<Open>(null);
  const [cat, setCat] = useState('All');
  const closeRef = useRef<HTMLButtonElement>(null);

  const cats = useMemo(() => {
    if (mode === 'sites') return ['All', ...sitesData.categories];
    if (mode === 'flyers') return ['All', 'Event flyers', 'Product flyers', 'Retail', 'Social templates'];
    return [];
  }, [mode, sitesData]);

  const sites = useMemo(() => {
    let list = sitesData.sites;
    if (cat !== 'All') list = list.filter((s) => s.category === cat);
    return limit ? list.slice(0, limit) : list;
  }, [cat, limit, sitesData]);

  const flyers = useMemo(() => {
    const list = cat === 'All' ? sitesData.flyers : sitesData.flyers.filter((f) => f.kind === cat);
    return limit ? list.slice(0, limit) : list;
  }, [cat, limit, sitesData]);

  const videos = useMemo(
    () => (limit ? sitesData.videos.slice(0, limit) : sitesData.videos),
    [limit, sitesData]
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
          <div className="gal__filters" role="group" aria-label={formatEditableText(editableContent.texts.copy_50ee55cd30, [mode])}>
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
                  aria-label={formatEditableText(editableContent.texts.copy_1d801b3762, [s.name])}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.card}
                    alt={formatEditableText(editableContent.texts.copy_356038a262, [s.name])}
                    width={880}
                    height={611}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="gal-card__open">
                    {editableContent.texts.text_8f15e78aac}<span aria-hidden>↗</span>
                  </span>
                </a>
                <div className="gal-card__body">
                  <div className="gal-card__top">
                    <span className="badge-status paid">{editableContent.texts.text_934e792141}</span>
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
                      {editableContent.texts.text_1bfd3e5c78}<Icon name="external" size={13} />
                    </a>
                    <button
                      className="btn-link"
                      onClick={() => setOpen({ kind: 'site', item: s })}
                    >
                      {editableContent.texts.text_0a748c3040}<Icon name="arrow" size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="gal__note">
            {editableContent.texts.text_470225fab3}</p>
        </>
      )}

      {/* ---------------------------------------------------------- BRANDING */}
      {mode === 'branding' && (
        <div style={{ display: 'grid', gap: 28 }}>
          <div className="kr8-grid-2" style={{ alignItems: 'center' }}>
            <div className="kr8-subhero__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={editableContent.texts.field_8fd0572178}
                alt={editableContent.texts.field_7a938f6c5d}
              />
            </div>
            <div className="kr8-card kr8-card--accent">
              <div className="kr8-card__num">{editableContent.texts.text_d1b746c2ea}</div>
              <h3 className="kr8-card__title">
                {editableContent.texts.text_a1885e0fa5}</h3>
              <p className="kr8-card__body">
                {editableContent.texts.text_e609efabe0}<strong>{editableContent.texts.text_d5b3fef0ee}</strong> {editableContent.texts.text_45d3aedae1}{' '}
                <strong>{editableContent.texts.text_6271b13e79}</strong>{editableContent.texts.text_77951e7d33}</p>
              <div className="kr8-card__foot">
                <Link href={editableContent.texts.field_0c3072e476} className="btn-primary">
                  {editableContent.texts.text_2d9bdf1793}<Icon name="arrow" size={16} />
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
                  aria-label={formatEditableText(editableContent.texts.copy_86e97c04fc, [f.title])}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.card}
                    alt={formatEditableText(editableContent.texts.copy_69ffb345a1, [f.title])}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="gal-card__open">{editableContent.texts.text_3fce40924f}</span>
                </button>
                <div className="gal-card__body">
                  <div className="gal-card__top">
                    <span className="tag">{f.kind}</span>
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.note}</p>
                  <div className="gal-card__credit">{editableContent.texts.text_d6251b5319}</div>
                </div>
              </article>
            ))}
          </div>
          <p className="gal__note">
            {editableContent.texts.text_9740256464}</p>
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
                  aria-label={formatEditableText(editableContent.texts.copy_55952a001e, [v.title, v.duration])}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.poster}
                    alt={formatEditableText(editableContent.texts.copy_43e45be6f6, [v.title])}
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
            {editableContent.texts.text_0ae6e514f6}</p>
        </>
      )}

      {/* ---------------------------------------------------------------- AI */}
      {mode === 'ai' && (
        <div className="gal__grid gal__grid--duo">
          <article className="gal-card">
            <Link className="gal-card__shot" href={editableContent.texts.field_b9cdf20824} aria-label={editableContent.texts.field_8579b271bc}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={editableContent.texts.field_d9e4a9647c}
                alt={editableContent.texts.field_f38a16fd6f}
                loading="lazy"
              />
              <span className="gal-card__open">{editableContent.texts.text_5fca73acb6}</span>
            </Link>
            <div className="gal-card__body">
              <div className="gal-card__top">
                <span className="badge-status earned">{editableContent.texts.text_6808ff36fa}</span>
                <span className="tag">{editableContent.texts.text_7f1b0406c6}</span>
              </div>
              <h3>{editableContent.texts.text_0f7db721cf}</h3>
              <p>
                {editableContent.texts.text_2c028acf04}</p>
            </div>
          </article>
          <article className="gal-card">
            <a
              className="gal-card__shot"
              href={editableContent.texts.field_f5c9198e2e}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={editableContent.texts.field_2806b7d135}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={editableContent.texts.field_a6844162c7}
                alt={editableContent.texts.field_50da402b14}
                loading="lazy"
              />
              <span className="gal-card__open">
                {editableContent.texts.text_c4e90039f8}<span aria-hidden>↗</span>
              </span>
            </a>
            <div className="gal-card__body">
              <div className="gal-card__top">
                <span className="badge-status earned">{editableContent.texts.text_934e792141}</span>
                <span className="tag">{editableContent.texts.text_64de1152ed}</span>
              </div>
              <h3>{editableContent.texts.text_634c2656a5}</h3>
              <p>
                {editableContent.texts.text_84fbe2182d}</p>
            </div>
          </article>
        </div>
      )}

      {/* --------------------------------------------------------------- SEO */}
      {mode === 'seo' && (
        <div className="seo-visual">
          <div className="seo-visual__steps">
            {[
              ['01', editableContent.texts.copy_5624a80b66, editableContent.texts.copy_c03d6ea035],
              ['02', editableContent.texts.copy_d0f769e6c4, editableContent.texts.copy_a1cece819a],
              ['03', editableContent.texts.copy_3a86b6b5cf, editableContent.texts.copy_3ea144db3a],
              ['04', editableContent.texts.copy_e5682c9018, editableContent.texts.copy_9ba966d517],
            ].map(([n, t, d]) => (
              <div className="seo-step" key={n}>
                <span className="seo-step__n">{n}</span>
                <b>{t}</b>
                <p>{d}</p>
              </div>
            ))}
          </div>
          <div className="seo-visual__panel panel">
            <div className="eyebrow eyebrow--lilac">{editableContent.texts.text_58f471fb85}</div>
            <h3 style={{ marginTop: 10 }}>{editableContent.texts.text_84eee32be9}</h3>
            <ul className="price-list">
              <li>
                <Icon name="check" size={16} /> {editableContent.texts.text_dca792a95c}</li>
              <li>
                <Icon name="check" size={16} /> {editableContent.texts.text_c1cdb153c9}</li>
              <li>
                <Icon name="check" size={16} /> {editableContent.texts.text_8bf5c41ebd}</li>
              <li>
                <Icon name="check" size={16} /> {editableContent.texts.text_f3fb779d9a}</li>
              <li>
                <Icon name="check" size={16} /> {editableContent.texts.text_88f9a66efc}</li>
            </ul>
            <Link href={editableContent.texts.field_7ec5152c33} className="btn-primary" style={{ marginTop: 8 }}>
              {editableContent.texts.text_0f2695fa8b}<Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- LIGHTBOX */}
      {open && (
        <div className="lb" role="dialog" aria-modal="true" aria-label={editableContent.texts.field_f5e76408ee} onClick={close}>
          <div className="lb__panel" onClick={(e) => e.stopPropagation()}>
            <button className="lb__close" onClick={close} ref={closeRef} aria-label={editableContent.texts.field_7d8ab36821}>
              ✕
            </button>

            {open.kind === 'site' && (
              <>
                <div className="lb__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={open.item.full} alt={formatEditableText(editableContent.texts.copy_856b50b6c8, [open.item.name])} />
                </div>
                <div className="lb__body">
                  <div className="gal-card__top">
                    <span className="badge-status paid">{editableContent.texts.text_934e792141}</span>
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
                      {editableContent.texts.text_d269621cdb}<span aria-hidden>↗</span>
                    </a>
                    <Link
                      href={formatEditableText("/contact?service=website-design&ref={0}", [open.item.slug])}
                      className="btn-ghost"
                    >
                      {editableContent.texts.text_19fd78774d}</Link>
                    <a
                      href={waQuote(open.item.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost"
                    >
                      <Icon name="wa" size={16} /> {editableContent.texts.text_80f6ac1699}</a>
                  </div>
                </div>
              </>
            )}

            {open.kind === 'flyer' && (
              <>
                <div className="lb__media lb__media--poster">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={open.item.full} alt={formatEditableText(editableContent.texts.copy_f7d546f65f, [open.item.title])} />
                </div>
                <div className="lb__body">
                  <div className="gal-card__top">
                    <span className="tag">{open.item.kind}</span>
                  </div>
                  <h3>{open.item.title}</h3>
                  <p>{open.item.note}</p>
                  <div className="gal-card__credit">
                    {editableContent.texts.text_d6251b5319}{open.item.client ? formatEditableText(editableContent.texts.copy_0cf33ff228, [open.item.client]) : ''}
                  </div>
                  <div className="actions" style={{ marginTop: 18 }}>
                    <Link href={editableContent.texts.field_8bffa0643a} className="btn-primary">
                      {editableContent.texts.text_16888e1b41}<Icon name="arrow" size={16} />
                    </Link>
                    <a href={open.item.full} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                      {editableContent.texts.text_4e76b5306a}</a>
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
                    <Link href={editableContent.texts.field_877fc4ac7b} className="btn-primary">
                      {editableContent.texts.text_6ecf039e1f}<Icon name="arrow" size={16} />
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

type EditableBlockTypes = { BRAND_SYSTEM_DELIVERABLES: typeof BRAND_SYSTEM_DELIVERABLES };
