'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import sitesData from '../../data/sites.json';
import { Icon, Price, useCurrency, CurrencyPicker } from './ui';
import BuySite from './BuySite';

type Mode = 'sites' | 'flyers' | 'videos' | 'ai' | 'seo';

type Site = (typeof sitesData.sites)[number];
type Flyer = (typeof sitesData.flyers)[number];
type Video = (typeof sitesData.videos)[number];

type Open =
  | { kind: 'site'; item: Site }
  | { kind: 'flyer'; item: Flyer }
  | { kind: 'video'; item: Video }
  | null;

const WHATSAPP = '2348125687509';

export default function Showcase({
  mode,
  limit,
  filters = true,
  showPrices = false,
  heading,
}: {
  mode: Mode;
  limit?: number;
  filters?: boolean;
  showPrices?: boolean;
  heading?: string;
}) {
  const [open, setOpen] = useState<Open>(null);
  const [cat, setCat] = useState('All');
  const [status, setStatus] = useState<'all' | 'for-sale' | 'live'>('all');
  const { code, rates, setCode, ready } = useCurrency();
  const closeRef = useRef<HTMLButtonElement>(null);

  const cats = useMemo(() => {
    if (mode === 'sites') return ['All', ...sitesData.categories];
    if (mode === 'flyers') return ['All', 'Event flyers', 'Product flyers', 'Retail', 'Social templates'];
    return [];
  }, [mode]);

  const sites = useMemo(() => {
    let list = sitesData.sites;
    if (cat !== 'All') list = list.filter((s) => s.category === cat);
    if (status !== 'all') list = list.filter((s) => s.status === status);
    return limit ? list.slice(0, limit) : list;
  }, [cat, status, limit]);

  const flyers = useMemo(() => {
    const list = cat === 'All' ? sitesData.flyers : sitesData.flyers.filter((f) => f.kind === cat);
    return limit ? list.slice(0, limit) : list;
  }, [cat, limit]);

  const videos = useMemo(() => (limit ? sitesData.videos.slice(0, limit) : sitesData.videos), [limit]);

  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, close]);

  const waQuote = (name: string) =>
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi KR8 Digitals — I'd like to talk about ${name}.`)}`;

  return (
    <div className="gal">
      {(filters && (cats.length > 1 || mode === 'sites')) && (
        <div className="gal__bar">
          <div className="gal__filters" role="group" aria-label={`Filter ${mode}`}>
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}>{c}</button>
            ))}
          </div>
          {mode === 'sites' && (
            <div className="gal__filters gal__filters--status" role="group" aria-label="Filter by availability">
              <button onClick={() => setStatus('all')} aria-pressed={status === 'all'}>Everything</button>
              <button onClick={() => setStatus('live')} aria-pressed={status === 'live'}>Live for clients</button>
              <button onClick={() => setStatus('for-sale')} aria-pressed={status === 'for-sale'}>For sale</button>
            </div>
          )}
          {(mode === 'sites' || mode === 'flyers') && ready && (
            <CurrencyPicker code={code} setCode={setCode} />
          )}
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
                  aria-label={`Open ${s.name} in a new tab`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.card} alt={`${s.name} website, as deployed`} width={880} height={611} loading="lazy" decoding="async" />
                  <span className="gal-card__open">Open site <span aria-hidden>↗</span></span>
                </a>
                <div className="gal-card__body">
                  <div className="gal-card__top">
                    <span className={`badge-status ${s.status === 'live' ? 'paid' : 'pending'}`}>
                      {s.status === 'live' ? 'Live for client' : 'For sale'}
                    </span>
                    <span className="tag">{s.kind}</span>
                  </div>
                  <h3>{s.name}</h3>
                  <p>{s.note}</p>
                  <div className="gal-card__foot">
                    {s.status === 'for-sale' && s.priceUsd != null && (
                      <span className="gal-card__price">
                        {showPrices && ready ? <Price usd={s.priceUsd} code={code} rates={rates} /> : <b>Price on approval</b>}
                      </span>
                    )}
                    <button className="btn-link" onClick={() => setOpen({ kind: 'site', item: s })}>
                      {s.status === 'for-sale' ? 'Buy this site' : 'Details'} <Icon name="arrow" size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="gal__note">
            Every screenshot above was taken from the live deployment, not a design file. Click a card and it
            opens in a new tab. Prices show once the team approves publishing them — until then, ask and you
            will get a number the same day.
          </p>
        </>
      )}

      {/* ------------------------------------------------------------ FLYERS */}
      {mode === 'flyers' && (
        <>
          <div className="gal__grid gal__grid--brand">
            {flyers.map((f) => (
              <article className="gal-card gal-card--poster" key={f.slug}>
                <button className="gal-card__shot" onClick={() => setOpen({ kind: 'flyer', item: f })} aria-label={`View ${f.title} full size`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.card} alt={`${f.title} — flyer designed by KR8 Digitals in association with Motion Verse`} loading="lazy" decoding="async" />
                  <span className="gal-card__open">View full size</span>
                </button>
                <div className="gal-card__body">
                  <div className="gal-card__top">
                    <span className="tag">{f.kind}</span>
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.note}</p>
                  <div className="gal-card__credit">KR8 Digitals in association with Motion Verse</div>
                </div>
              </article>
            ))}
          </div>
          <p className="gal__note">
            Client artwork, published with permission. Every piece was designed in association with Motion
            Verse, which is credited on the work itself.
          </p>
        </>
      )}

      {/* ------------------------------------------------------------ VIDEOS */}
      {mode === 'videos' && (
        <>
          <div className="gal__grid gal__grid--video">
            {videos.map((v) => (
              <article className="gal-card gal-card--poster" key={v.slug}>
                <button className="gal-card__shot gal-card__shot--video" onClick={() => setOpen({ kind: 'video', item: v })} aria-label={`Play ${v.title} — ${v.duration}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.poster} alt={`Poster frame from ${v.title}`} loading="lazy" decoding="async" />
                  <span className="gal-card__play" aria-hidden>
                    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>
                  </span>
                  <span className="gal-card__dur">{v.duration}</span>
                </button>
                <div className="gal-card__body">
                  <div className="gal-card__top"><span className="tag">{v.kind}</span></div>
                  <h3>{v.title}</h3>
                  <p>{v.note}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="gal__note">
            Real cuts, streamed from this site — press play and it plays here. CHIGOMA&apos;s video work gets
            its own place in this gallery once the files are supplied.
          </p>
        </>
      )}

      {/* ---------------------------------------------------------------- AI */}
      {mode === 'ai' && (
        <div className="gal__grid gal__grid--duo">
          <article className="gal-card">
            <Link className="gal-card__shot" href="/#host" aria-label="Open the assistant">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/sites/academy-card.webp" alt="The KR8 Digitals assistant in use" loading="lazy" />
              <span className="gal-card__open">Try it live</span>
            </Link>
            <div className="gal-card__body">
              <div className="gal-card__top"><span className="badge-status earned">Running now</span><span className="tag">Assistant</span></div>
              <h3>Ada — the assistant on this site</h3>
              <p>Answers questions, qualifies a visitor and hands the conversation to a human with the transcript attached. It is running in the corner of every page.</p>
            </div>
          </article>
          <article className="gal-card">
            <a className="gal-card__shot" href="https://jev-and-ai-sdk-zeta-seven.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="Open the Jev form router in a new tab">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/sites/jev-card.webp" alt="The Jev form router deciding where a message belongs" loading="lazy" />
              <span className="gal-card__open">Open site <span aria-hidden>↗</span></span>
            </a>
            <div className="gal-card__body">
              <div className="gal-card__top"><span className="badge-status earned">Live</span><span className="tag">Routing</span></div>
              <h3>Jev form router</h3>
              <p>One form decides whether a message is a lead, a contact request or an issue report, then routes it — no human triage.</p>
            </div>
          </article>
        </div>
      )}

      {/* --------------------------------------------------------------- SEO */}
      {mode === 'seo' && (
        <div className="seo-visual">
          <div className="seo-visual__steps">
            {[
              ['01', 'Crawl', 'Every page fetched and checked for what search cannot read.'],
              ['02', 'Fix the floor', 'Titles, descriptions, structured data, sitemap, speed, mobile.'],
              ['03', 'Structure', 'A page per service, per programme, per place.'],
              ['04', 'Report', 'What changed this month, and what the numbers did.'],
            ].map(([n, t, d]) => (
              <div className="seo-step" key={n}>
                <span className="seo-step__n">{n}</span>
                <b>{t}</b>
                <p>{d}</p>
              </div>
            ))}
          </div>
          <div className="seo-visual__panel panel">
            <div className="eyebrow eyebrow--lilac">This site</div>
            <h3 style={{ marginTop: 10 }}>We run the process on ourselves first.</h3>
            <ul className="price-list">
              <li><Icon name="check" size={16} /> A real title and description on every route</li>
              <li><Icon name="check" size={16} /> Open Graph and Twitter cards that render</li>
              <li><Icon name="check" size={16} /> Sitemap and robots generated from the routes</li>
              <li><Icon name="check" size={16} /> One H1 per page, structured headings below it</li>
              <li><Icon name="check" size={16} /> Core Web Vitals measured on every deploy</li>
            </ul>
            <Link href="/contact?service=seo" className="btn-primary" style={{ marginTop: 8 }}>Ask for an audit <Icon name="arrow" size={16} /></Link>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- LIGHTBOX */}
      {open && (
        <div className="lb" role="dialog" aria-modal="true" aria-label="Preview" onClick={close}>
          <div className="lb__panel" onClick={(e) => e.stopPropagation()}>
            <button className="lb__close" onClick={close} ref={closeRef} aria-label="Close preview">✕</button>

            {open.kind === 'site' && (
              <>
                <div className="lb__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={open.item.full} alt={`${open.item.name} — full screenshot`} />
                </div>
                <div className="lb__body">
                  <div className="gal-card__top">
                    <span className={`badge-status ${open.item.status === 'live' ? 'paid' : 'pending'}`}>
                      {open.item.status === 'live' ? 'Live for client' : 'For sale'}
                    </span>
                    <span className="tag">{open.item.kind}</span>
                  </div>
                  <h3>{open.item.name}</h3>
                  <p>{open.item.note}</p>
                  <div className="actions" style={{ marginTop: 18 }}>
                    <a href={open.item.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                      Open the live site <span aria-hidden>↗</span>
                    </a>
                    {open.item.status === 'for-sale' && (
                      <>
                        <a href={waQuote(open.item.name)} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                          <Icon name="wa" size={16} /> Ask about this site
                        </a>
                        <Link href={`/contact?service=website-design&site=${open.item.slug}`} className="btn-ghost">
                          Request a custom quote
                        </Link>
                      </>
                    )}
                  </div>
                  {open.item.status === 'for-sale' && open.item.priceUsd != null && (
                    <div className="lb__buy">
                      <div className="split" style={{ alignItems: 'baseline', gap: 8 }}>
                        <div>
                          <div className="eyebrow">Buy this build</div>
                          <div className="lb__price">
                            {showPrices && ready
                              ? <Price usd={open.item.priceUsd} code={code} rates={rates} />
                              : <><b>Price on approval</b><div className="price-local">Shown publicly once the team approves the price list.</div></>}
                          </div>
                        </div>
                      </div>
                      <BuySite siteId={open.item.slug} name={open.item.name} priceUsd={open.item.priceUsd} approved={showPrices && ready} />
                      <p className="form-note" style={{ marginTop: 10 }}>
                        You get the site, its code and its deployment, rebranded with your name and moved to
                        your domain. Payment is by bank transfer or Paystack — both are handled on the next
                        screen.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {open.kind === 'flyer' && (
              <>
                <div className="lb__media lb__media--poster">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={open.item.full} alt={`${open.item.title} — full-size flyer`} />
                </div>
                <div className="lb__body">
                  <div className="gal-card__top"><span className="tag">{open.item.kind}</span></div>
                  <h3>{open.item.title}</h3>
                  <p>{open.item.note}</p>
                  <div className="gal-card__credit">KR8 Digitals in association with Motion Verse · client: {open.item.client}</div>
                  <div className="actions" style={{ marginTop: 18 }}>
                    <a href={open.item.full} target="_blank" rel="noopener noreferrer" className="btn-ghost">Open the file</a>
                    <Link href="/contact?service=brand-graphic-design" className="btn-primary">Brief us on something like this <Icon name="arrow" size={16} /></Link>
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
                    preload="none"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
                  />
                </div>
                <div className="lb__body">
                  <div className="gal-card__top"><span className="tag">{open.item.kind}</span><span className="tag">{open.item.duration}</span></div>
                  <h3>{open.item.title}</h3>
                  <p>{open.item.note}</p>
                  <div className="actions" style={{ marginTop: 18 }}>
                    <Link href="/contact?service=video-editing" className="btn-primary">Start a video project <Icon name="arrow" size={16} /></Link>
                    <a href={open.item.src} download className="btn-ghost">Download the file</a>
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
