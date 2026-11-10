import { formatEditableText } from '@/lib/content-format';
import type { Metadata } from 'next';
import { getEditableDocument } from '@/lib/editable-content';
import { getPublicContent } from '@/lib/public-content';
import Link from 'next/link';
import { getSiteContent, getHomeContent } from '@/lib/site-content';
import team from '../../data/team.json';
import { Counter, Icon } from '@/components/ui';
import HeroCinema from '@/components/HeroCinema';
import MobileHero from '@/components/MobileHero';
import ServiceCards from '@/components/ServiceCards';
import Duo from '@/components/Duo';
import {
  CinemaVisual,
  MobileDisclosure,
  ResponsiveCopy,
  SectionAtmosphere,
} from '@/components/MobileExperience';

const mainPartners = [
  {
    slug: 'motionverse',
    mark: 'MV',
    name: 'Motionverse',
    role: 'Co-Founding Partner · Brand & Design',
    href: '/partners/motionverse',
  },
  {
    slug: 'chigoma',
    mark: 'CH',
    name: 'Chigoma',
    role: 'Co-Founding Partner · Video & Motion',
    href: '/partners/chigoma',
  },
  {
    slug: 'next-gen-scholars',
    mark: 'NG',
    name: 'NextGen',
    role: 'Academic Partner · STEM, Arts & Exams',
    href: '/partners/next-gen-scholars',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return (await getEditableDocument("app:page")).blocks.metadata as Metadata;
}

export default async function Home() {
  const editableContent = await getEditableDocument("app:page");
  const mainPartners = editableContent.blocks.mainPartners as EditableBlockTypes["mainPartners"];

  const publicData = await getPublicContent();
  const team = publicData.team;

  const site = publicData.site;
  const hero = await getHomeContent();
  const eco = site.ecosystem;
  return (
    <>
      {/* ------------------------------------------------------------ HERO */}
      <section className="hero">
        <div className="hero-bg" aria-hidden>
          <div className="blob-1" />
          <div className="blob-2" />
          <div className="vignette" />
        </div>
        <div className="wrap">
          <div className="hero-grid hero-grid--desktop">
            <div className="hero-copy-col">
              <span className="badge">
                <span className="badge-dot" /> {hero.badge}
              </span>
              <h1 className="hero-title">
                <span className="line line--small">{hero.title}</span>
                <span className="line line--big text-grad">{hero.highlight}</span>
              </h1>
              <p className="hero-copy">
                {hero.description}
              </p>
              <div className="hero-actions">
                <Link href={site.hero.primary.href} className="btn-primary">
                  {site.hero.primary.label} <Icon name="arrow" size={18} />
                </Link>
                <a href={site.hero.secondary.href} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  {site.hero.secondary.label} <span className="arrow-out">↗</span>
                </a>
              </div>
              <div className="hero-pillars" aria-label={editableContent.texts.field_3152e8ca94}>
                <span>{editableContent.texts.text_a6e88f5444}</span>
                <i aria-hidden />
                <span>{editableContent.texts.text_4f6a7fb8cb}</span>
                <i aria-hidden />
                <span>{editableContent.texts.text_c2b1ecea59}</span>
                <i aria-hidden />
                <span>{editableContent.texts.text_9c9985381d}</span>
              </div>
            </div>
            <div className="hero-stage-col">
              <HeroCinema />
            </div>
          </div>

          <MobileHero
            title={hero.mobileTitle}
            highlight={hero.mobileHighlight}
            primaryHref={site.hero.primary.href}
            primaryLabel={site.hero.primary.label}
            secondaryHref={site.hero.secondary.href}
          />
        </div>
      </section>

      {/* --------------------------------------------------------- MARQUEE */}
      <div className="marquee" aria-hidden>
        <div className="marquee-track">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="marquee-item" style={{ display: 'flex' }}>
              {[editableContent.texts.copy_bec8768fab, editableContent.texts.copy_090ed4316f, editableContent.texts.copy_d534be829e, editableContent.texts.copy_11fb682be0, editableContent.texts.copy_6bc4718fbb, editableContent.texts.copy_36a798e3f3, editableContent.texts.copy_bb501d7877, editableContent.texts.copy_b61dd8f401].map((w) => (
                <span key={w} className="marquee-item">
                  <span className="marquee-text">{w}</span>
                  <span className="diamond" />
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="fade-l" />
        <div className="fade-r" />
      </div>

      {/* ------------------------------------------------------ 3 · PROOF STRIP */}
      <section className="proof" aria-label={editableContent.texts.field_049a550384}>
        <div className="wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div className="proof-grid">
            {site.stats.map((s, i) => (
              <div className="proof-cell reveal up" data-delay={i * 60} key={s.id}>
                <div className="proof-num text-grad">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="proof-label">{s.label}</div>
                <div className="proof-src">{s.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- 4 · SERVICES */}
      <section className="section" id="services">
        <SectionAtmosphere name="services-atmosphere" deskOpacity={0.14} mobOpacity={0.24} flare />
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{editableContent.texts.text_604dce445e}</div>
              <h2 className="section-title">{editableContent.texts.text_0df52fe9e4}</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop={editableContent.texts.field_c174fff9c4}
                mobile={editableContent.texts.field_0c77371319}
              />
            </div>
            <Link href={editableContent.texts.field_3b1aeccb74} className="btn-link">
              {editableContent.texts.text_9bf9122d26}<Icon name="arrow" size={15} />
            </Link>
          </div>
          <ServiceCards />
        </div>
      </section>

      {/* ----------------------------------------- 5 · FREE DIGITAL SKILLS TRAINING */}
      <section className="section ft-section" id="free-training">
        <SectionAtmosphere name="academy-cohort-cinema" deskOpacity={0.14} mobOpacity={0.24} flare />
        <div className="wrap">
          <div className="ft-grid reveal up">
            <div className="ft-copy">
              <div className="eyebrow">{editableContent.texts.text_79c796457f}</div>
              <h2 className="section-title">
                {editableContent.texts.text_1aaed248b3}<span className="text-grad">{editableContent.texts.text_4818331d9f}</span> {editableContent.texts.text_8d5bcbf7f5}</h2>

              <p className="section-lede kr8-desk-only">
                {editableContent.texts.text_efde5601b3}{' '}
                <strong style={{ color: 'var(--t-strong)' }}>{editableContent.texts.text_ca538eaf54}</strong>{editableContent.texts.text_d2ad679b2e}</p>

              <div className="kr8-mob-only" style={{ marginTop: 12 }}>
                <p className="section-lede" style={{ marginTop: 0 }}>
                  {editableContent.texts.text_41e944bfbc}<strong style={{ color: 'var(--t-strong)' }}>{editableContent.texts.text_4e85762786}</strong>{' '}
                  {editableContent.texts.text_737d26e744}<strong style={{ color: 'var(--t-strong)' }}>{editableContent.texts.text_ca538eaf54}</strong>.
                </p>
                <div style={{ marginTop: 14 }}>
                  <CinemaVisual
                    name="academy-cohort-cinema"
                    alt={editableContent.texts.field_0a4fc54588}
                    badge="KR8 Academy · $0 Tuition"
                    caption="8-week practical cohorts · Live mentorship · Verifiable KR8 ID"
                  />
                </div>
              </div>

              <div className="ft-pillars">
                <div className="ft-pillar">
                  <span className="ft-pillar__icon">
                    <Icon name="spark" size={18} />
                  </span>
                  <div>
                    <b>{editableContent.texts.text_699fad4db3}</b>
                    <p>{editableContent.texts.text_83428cef08}</p>
                  </div>
                </div>
                <div className="ft-pillar">
                  <span className="ft-pillar__icon">
                    <Icon name="layers" size={18} />
                  </span>
                  <div>
                    <b>{editableContent.texts.text_3174cb5754}</b>
                    <p>{editableContent.texts.text_e1c59ffe33}</p>
                  </div>
                </div>
                <div className="ft-pillar">
                  <span className="ft-pillar__icon">
                    <Icon name="award" size={18} />
                  </span>
                  <div>
                    <b>{editableContent.texts.text_345fbe4831}</b>
                    <p>{editableContent.texts.text_21bb4e4d21}</p>
                  </div>
                </div>
              </div>

              <div className="actions" style={{ marginTop: 24 }}>
                <a href={eco.academy.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  {editableContent.texts.text_327bf5133a}<span className="arrow-out">↗</span>
                </a>
                <Link href={editableContent.texts.field_70ea9c52a0} className="btn-ghost">
                  {editableContent.texts.text_4efa546c5d}</Link>
              </div>
            </div>

            <div className="ft-visual">
              <div className="ft-frame">
                <div className="ft-frame__bar">
                  <span className="ft-dot ft-dot--pink" />
                  <span className="ft-dot" />
                  <span className="ft-dot" />
                  <span className="ft-url">{editableContent.texts.text_75a1d5d506}</span>
                  <span className="ft-free-pill">{editableContent.texts.text_4092d8aee4}</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editableContent.texts.field_c62179466b}
                  alt={editableContent.texts.field_8d99949e39}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="ft-tracks-card" aria-label={editableContent.texts.field_5817074902}>
                <span className="ft-tracks__label">{editableContent.texts.text_b14b16f65b}</span>
                <div className="ft-tracks__list">
                  {[
                    editableContent.texts.copy_6837aab9ca,
                    editableContent.texts.copy_a95b7a5655,
                    editableContent.texts.copy_b5fe7b887a,
                    editableContent.texts.copy_e36b227a5e,
                    editableContent.texts.copy_2ca313baf1,
                    editableContent.texts.copy_1b286e778e,
                    editableContent.texts.copy_29ff60a8ca,
                  ].map((track) => (
                    <span key={track} className="ft-track-chip">
                      {track}
                    </span>
                  ))}
                </div>
              </div>

              <div className="ft-proof-card">
                <div className="ft-avatars" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editableContent.texts.field_541ec58199} alt="" loading="lazy" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editableContent.texts.field_acc7bb7dda} alt="" loading="lazy" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editableContent.texts.field_ed0e204bb9} alt="" loading="lazy" />
                </div>
                <div className="ft-proof-card__text">
                  <b>{editableContent.texts.text_d3d782baaa}</b>
                  <span>{editableContent.texts.text_420b8c673a}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------- 6 · KR8 DIGITALS TRIBE */}
      <section className="section tribe-section" id="tribe">
        <SectionAtmosphere name="tribe-creative-room" deskOpacity={0.14} mobOpacity={0.22} flare />
        <div className="wrap">
          <div className="tribe-shell reveal up">
            <div className="tribe-head">
              <div className="tribe-head__copy">
                <div className="eyebrow">{editableContent.texts.text_35461b7dd0}</div>
                <h2 className="section-title">
                  {editableContent.texts.text_ba58126a6c}<br />
                  <span className="text-grad">{editableContent.texts.text_c368f061a7}</span>
                </h2>

                <p className="section-lede kr8-desk-only">
                  {editableContent.texts.text_2a0c7c293b}{' '}
                  <strong style={{ color: 'var(--t-strong)' }}>{editableContent.texts.text_485bc59846}</strong> {editableContent.texts.text_b5d9798753}</p>

                <div className="kr8-mob-only" style={{ marginTop: 10 }}>
                  <p className="section-lede" style={{ marginTop: 0 }}>
                    {editableContent.texts.text_bb23428b65}<strong style={{ color: 'var(--t-strong)' }}>{editableContent.texts.text_3524e3ed1f}</strong>{' '}
                    {editableContent.texts.text_b9e527495b}</p>
                  <MobileDisclosure label="Why we built the Tribe">
                    {editableContent.texts.text_8f814023a9}</MobileDisclosure>
                </div>
              </div>

              <div className="tribe-cluster">
                <div style={{ marginBottom: 12 }}>
                  <CinemaVisual
                    name="tribe-creative-room"
                    alt={editableContent.texts.field_a1be62c2b9}
                    badge="3,000+ Active Creators"
                    aspect="16 / 9.5"
                    mobileAspect="16 / 10"
                  />
                </div>
                <div className="tribe-cluster__faces" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editableContent.texts.field_541ec58199} alt="" loading="lazy" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editableContent.texts.field_ed0e204bb9} alt="" loading="lazy" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editableContent.texts.field_27e3b280f8} alt="" loading="lazy" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editableContent.texts.field_acc7bb7dda} alt="" loading="lazy" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editableContent.texts.field_a22d62850b} alt="" loading="lazy" />
                </div>
                <p className="tribe-cluster__note">
                  {editableContent.texts.text_2d295c4906}</p>
              </div>
            </div>

            <div className="tribe-grid">
              <article className="tribe-card">
                <div className="tribe-card__top">
                  <span className="tribe-card__num">01</span>
                  <span className="tribe-card__icon">
                    <Icon name="palette" size={18} />
                  </span>
                </div>
                <h3>{editableContent.texts.text_64fb287699}</h3>
                <ResponsiveCopy
                  as="p"
                  desktop={editableContent.texts.field_c7550534d9}
                  mobile={editableContent.texts.field_0ca73a115a}
                />
              </article>

              <article className="tribe-card">
                <div className="tribe-card__top">
                  <span className="tribe-card__num">02</span>
                  <span className="tribe-card__icon">
                    <Icon name="users" size={18} />
                  </span>
                </div>
                <h3>{editableContent.texts.text_b33ab11dbd}</h3>
                <ResponsiveCopy
                  as="p"
                  desktop={editableContent.texts.field_0942f94263}
                  mobile={editableContent.texts.field_4799b27751}
                />
              </article>

              <article className="tribe-card">
                <div className="tribe-card__top">
                  <span className="tribe-card__num">03</span>
                  <span className="tribe-card__icon">
                    <Icon name="layers" size={18} />
                  </span>
                </div>
                <h3>{editableContent.texts.text_c0ac1e82e3}</h3>
                <ResponsiveCopy
                  as="p"
                  desktop={editableContent.texts.field_387943cdd7}
                  mobile={editableContent.texts.field_47f62ae097}
                />
              </article>

              <article className="tribe-card">
                <div className="tribe-card__top">
                  <span className="tribe-card__num">04</span>
                  <span className="tribe-card__icon">
                    <Icon name="compass" size={18} />
                  </span>
                </div>
                <h3>{editableContent.texts.text_207c07104b}</h3>
                <ResponsiveCopy
                  as="p"
                  desktop={editableContent.texts.field_773fc4dfcc}
                  mobile={editableContent.texts.field_460a216cd0}
                />
              </article>
            </div>

            <div className="tribe-foot">
              <div className="tribe-rules">
                <span>
                  <Icon name="check" size={14} /> {editableContent.texts.text_61a630abdc}</span>
                <span>
                  <Icon name="check" size={14} /> {editableContent.texts.text_bd0b3c2183}</span>
                <span>
                  <Icon name="check" size={14} /> {editableContent.texts.text_e99fce7902}</span>
                <span>
                  <Icon name="check" size={14} /> {editableContent.texts.text_895eb68748}</span>
              </div>
              <div className="actions">
                <Link href={editableContent.texts.field_3df0ed1318} className="btn-primary">
                  {editableContent.texts.text_49c100eb0d}<Icon name="arrow" size={17} />
                </Link>
                <Link href={editableContent.texts.field_0e277ad2ae} className="btn-ghost">
                  {editableContent.texts.text_212a0743cf}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------- 7 · OTHER THINGS WE DO */}
      <section className="section otwd-section" id="other-things-we-do">
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{editableContent.texts.text_9fb4826482}</div>
              <h2 className="section-title">{editableContent.texts.text_b5e3326dea}</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop={editableContent.texts.field_afcdf0372e}
                mobile={editableContent.texts.field_4467fb5b88}
              />
            </div>
            <Link href={editableContent.texts.field_271bdd2473} className="btn-link">
              {editableContent.texts.text_f51743fdd1}<Icon name="arrow" size={15} />
            </Link>
          </div>

          <div className="otwd-grid">
            {/* 1. Mindset Shift */}
            <article className="otwd-card reveal up">
              <div className="otwd-card__glow otwd-card__glow--a" aria-hidden />
              <div style={{ marginBottom: 14 }}>
                <CinemaVisual
                  name="mindset-shift-stage"
                  alt={editableContent.texts.field_71788b48fc}
                  badge="1st & 3rd Sundays · 9 PM"
                  aspect="16 / 8.8"
                  mobileAspect="16 / 9.5"
                />
              </div>
              <div className="otwd-card__head">
                <span className="otwd-badge">
                  <Icon name="spark" size={15} /> {editableContent.texts.text_a94d9f0206}</span>
                <span className="pill pill--live">{editableContent.texts.text_bb75ca0622}</span>
              </div>

              <h3 className="otwd-card__title">{editableContent.texts.text_7e4dd262de}</h3>
              <ResponsiveCopy
                as="p"
                className="otwd-card__desc"
                desktop={editableContent.texts.field_827ad6e7b5}
                mobile={editableContent.texts.field_80188903d1}
              />

              <ul className="otwd-list">
                <li>
                  <Icon name="check" size={15} />
                  <span>{editableContent.texts.text_d2836e02c3}</span>
                </li>
                <li>
                  <Icon name="check" size={15} />
                  <span>{editableContent.texts.text_9a8dcfe86e}</span>
                </li>
                <li>
                  <Icon name="check" size={15} />
                  <span>{editableContent.texts.text_217ef94413}</span>
                </li>
              </ul>

              <div className="otwd-card__foot">
                <Link href={editableContent.texts.field_83281429bb} className="btn-primary btn-sm">
                  {editableContent.texts.text_da872d2840}<Icon name="arrow" size={15} />
                </Link>
                <Link href={editableContent.texts.field_5be18a86f0} className="btn-link">
                  {editableContent.texts.text_219c5d7f0b}<Icon name="arrow" size={14} />
                </Link>
              </div>
            </article>

            {/* 2. Join the Team */}
            <article className="otwd-card reveal up" data-delay={90}>
              <div className="otwd-card__glow otwd-card__glow--b" aria-hidden />
              <div style={{ marginBottom: 14 }}>
                <CinemaVisual
                  name="join-team-builders"
                  alt={editableContent.texts.field_53e8618567}
                  badge="Portfolio-First · $0 Fee"
                  aspect="16 / 8.8"
                  mobileAspect="16 / 9.5"
                />
              </div>
              <div className="otwd-card__head">
                <span className="otwd-badge">
                  <Icon name="users" size={15} /> {editableContent.texts.text_da12783d9a}</span>
                <span className="pill">{editableContent.texts.text_f8f28e372c}</span>
              </div>

              <h3 className="otwd-card__title">{editableContent.texts.text_a24ec95fbf}</h3>
              <ResponsiveCopy
                as="p"
                className="otwd-card__desc"
                desktop={editableContent.texts.field_53ef234e55}
                mobile={editableContent.texts.field_c019939eca}
              />

              <ul className="otwd-list">
                <li>
                  <Icon name="check" size={15} />
                  <span>{editableContent.texts.text_befb1fe07f}</span>
                </li>
                <li>
                  <Icon name="check" size={15} />
                  <span>{editableContent.texts.text_0f904fb6de}</span>
                </li>
                <li>
                  <Icon name="check" size={15} />
                  <span>{editableContent.texts.text_43971b964b}</span>
                </li>
              </ul>

              <div className="otwd-card__foot">
                <Link href={editableContent.texts.field_78c2a55cd4} className="btn-primary btn-sm">
                  {editableContent.texts.text_f0b70c974b}<Icon name="arrow" size={15} />
                </Link>
                <Link href={editableContent.texts.field_8527bfb1db} className="btn-link">
                  {editableContent.texts.text_c45236aa8c}<Icon name="arrow" size={14} />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- 8 · PARTNERS */}
      <section className="section section--tight" id="partners" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <SectionAtmosphere name="partners-alliance-cinema" deskOpacity={0.14} mobOpacity={0.24} flare />
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{editableContent.texts.text_5dab502bfb}</div>
              <h2 className="section-title">{editableContent.texts.text_f7d3f95f34}</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop={editableContent.texts.field_a0f237f79c}
                mobile={editableContent.texts.field_994cbf0dcb}
              />
            </div>
            <Link href={editableContent.texts.field_6d0f8c425c} className="btn-link">
              {editableContent.texts.text_29f63c45e7}<Icon name="arrow" size={15} />
            </Link>
          </div>

          <div className="gal__grid gal__grid--partners" style={{ marginTop: 32 }}>
            {mainPartners.map((p) => (
              <Link href={p.href} className="logo-slot" key={p.slug}>
                <span className="logo-slot__mark">{p.mark}</span>
                <b>{p.name}</b>
                <small>{p.role}</small>
              </Link>
            ))}
            <Link href={editableContent.texts.field_6d0f8c425c} className="logo-slot logo-slot--invite">
              <span className="logo-slot__mark">+</span>
              <b>{editableContent.texts.text_0601c766cb}</b>
              <small>{editableContent.texts.text_e22e76fe15}</small>
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- 9 · TEAM */}
      <section className="section" id="team">
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{editableContent.texts.text_012a283b46}</div>
              <h2 className="section-title">{editableContent.texts.text_f2ee5d751c}</h2>
              <ResponsiveCopy
                as="p"
                className="section-lede"
                desktop={editableContent.texts.field_b97090f040}
                mobile={editableContent.texts.field_f3fa3308e8}
              />
            </div>
            <Link href={editableContent.texts.field_979bddc4a8} className="btn-link">
              {editableContent.texts.text_08dd5bc5aa}<Icon name="arrow" size={15} />
            </Link>
          </div>

          <div className="founders" style={{ marginTop: 32 }}>
            {team.founders.map((f) => (
              <article className="founder" key={f.slug}>
                <div className="founder__img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.photo} alt={`${f.name} (${f.fullName}), ${f.role}`} loading="lazy" decoding="async" />
                </div>
                <div className="founder__body">
                  <h3 className="founder__name">{f.name}</h3>
                  <div className="founder__role">{f.role}</div>
                  <div className="founder__full">{f.fullName}</div>
                  <Link href={f.readAbout} className="founder__link">
                    {f.linkText} <Icon name="arrow" size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- 10 · JOIN TEAM */}
      <div id="join-team">
        <Duo
          eyebrow="Join the team"
          title={editableContent.texts.field_0f27e4e55e}
          mobileSummary={
            <p>
              {editableContent.texts.text_0a25d217c4}</p>
          }
          mobileExpandLabel="How our portfolio review works"
          body={
            <>
              <p>
                {editableContent.texts.text_e7e463b687}</p>
              <p>
                {editableContent.texts.text_2f723c555c}</p>
            </>
          }
          bullets={[
            'Portfolio-first review — judged on real execution, never credentials alone',
            'Paid collaboration on live websites, brand systems, films, and AI builds',
            'Open doors year-round for standout graduates and independent specialists',
          ]}
          media={[
            {
              src: '/img/programs/join-team-studio.webp',
              alt: 'Engineers, designers, and video editors reviewing portfolios together at KR8 Digitals',
              caption: 'Studio Portfolio Review · KR8 Digitals',
            },
            {
              src: '/img/services/motionverse-studio.webp',
              alt: 'Creative art direction and campaign craft inside the KR8 Digitals ecosystem',
            },
          ]}
          cta={{ label: 'How to join', href: '/about/join-the-team' }}
          secondary={{ label: 'See open roles', href: '/about/join-the-team#roles' }}
          flip
        />
      </div>

      {/* -------------------------------------------------------- 11 · REFERRALS */}
      <section className="section">
        <div className="wrap">
          <div className="cta-band cta-band--cinema reveal up">
            <SectionAtmosphere
              name="referrals-network-cinema"
              deskOpacity={0.22}
              mobOpacity={0.32}
              mobPosition="center 25%"
              flare
            />
            <div className="eyebrow eyebrow--lilac">{editableContent.texts.text_76ffc344c6}</div>
            <h2>
              {editableContent.texts.text_d4fd252886}<br />
              <span className="text-grad">{editableContent.texts.text_f82c24a51b}</span>
            </h2>
            <ResponsiveCopy
              as="p"
              desktop={editableContent.texts.field_efd7ceaccb}
              mobile={editableContent.texts.field_5d73369d45}
            />
            <div className="actions" style={{ marginTop: 24 }}>
              <Link href={editableContent.texts.field_5c28ab56d1} className="btn-primary" data-track="become_referrer">
                {editableContent.texts.text_172b9b4d08}<Icon name="arrow" size={17} />
              </Link>
              <span style={{ fontSize: 13, color: 'var(--t-muted)' }}>
                {editableContent.texts.text_d4b55ad7cc}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- 12 · PRE-FOOTER */}
      <section className="section section--tight" id="closing-cta" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.32} mobOpacity={0.44} flare />
        <div className="wrap">
          <div className="split reveal up" style={{ alignItems: 'center', gap: 24 }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                {editableContent.texts.text_4dd022e291}</h2>
            </div>
            <div className="actions">
              <Link href={editableContent.texts.field_4eb9506365} className="btn-primary">
                {editableContent.texts.text_c6a53ce263}<Icon name="arrow" size={17} />
              </Link>
              <a
                href={formatEditableText("https://wa.me/{0}", [site.company.whatsapp])}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <Icon name="wa" size={16} /> {editableContent.texts.text_6a40edf1fc}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

type EditableBlockTypes = { mainPartners: typeof mainPartners };
