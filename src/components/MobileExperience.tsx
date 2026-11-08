'use client';

import React, { useState } from 'react';

export type CinemaAssetName =
  | 'hero-mobile-stage'
  | 'services-atmosphere'
  | 'website-engineering-cinema'
  | 'academy-cohort-cinema'
  | 'tribe-creative-room'
  | 'mindset-shift-stage'
  | 'join-team-builders'
  | 'partners-alliance-cinema'
  | 'nextgen-scholars-cinema'
  | 'referrals-network-cinema'
  | 'cta-horizon-flare'
  | 'founder-craft-web'
  | 'founder-craft-design'
  | 'founder-craft-film';

/**
 * Renders the approved Desktop content untouched on >=769px while serving
 * concise, conversion-oriented mobile copy on <=768px.
 */
export function ResponsiveCopy({
  desktop,
  mobile,
  as: Tag = 'div',
  className = '',
}: {
  desktop: React.ReactNode;
  mobile: React.ReactNode;
  as?: 'div' | 'span' | 'p';
  className?: string;
}) {
  return (
    <>
      <Tag className={`kr8-desk-only ${className}`.trim()}>{desktop}</Tag>
      <Tag className={`kr8-mob-only ${className}`.trim()}>{mobile}</Tag>
    </>
  );
}

/**
 * Tactile Progressive Disclosure Drawer for Mobile:
 * Keeps full supporting details 100% accessible on mobile without burying
 * scrolling visitors under long walls of text. On desktop, renders inline
 * seamlessly when `desktopInline` is true.
 */
export function MobileDisclosure({
  label = 'Read full details',
  closeLabel = 'Show less',
  children,
  desktopInline = false,
  defaultOpenMobile = false,
}: {
  label?: string;
  closeLabel?: string;
  children: React.ReactNode;
  desktopInline?: boolean;
  defaultOpenMobile?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpenMobile);

  return (
    <div className={`kr8-disclosure${desktopInline ? ' kr8-disclosure--desk-inline' : ''}`}>
      {desktopInline && <div className="kr8-desk-only">{children}</div>}
      <div className={desktopInline ? 'kr8-mob-only' : undefined}>
        <button
          type="button"
          className={`kr8-disclosure__btn${open ? ' is-open' : ''}`}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{open ? closeLabel : label}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            className="kr8-disclosure__chev"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {open && <div className="kr8-disclosure__panel">{children}</div>}
      </div>
    </div>
  );
}

/**
 * Art-Directed Responsive Cinema Visual Plate:
 * Serves a dedicated focal-cropped 780w WebP on mobile and crisp 1440w WebP
 * on desktop, accented with controlled anamorphic specular light & optional badge.
 */
export function CinemaVisual({
  name,
  alt,
  badge,
  caption,
  aspect = '16 / 10',
  mobileAspect = '16 / 10.5',
  priority = false,
  flare = true,
  className = '',
}: {
  name: CinemaAssetName;
  alt: string;
  badge?: string;
  caption?: string;
  aspect?: string;
  mobileAspect?: string;
  priority?: boolean;
  flare?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={`kr8-cinema-frame${flare ? ' has-flare' : ''} ${className}`.trim()}
      style={
        {
          '--cinema-aspect': aspect,
          '--cinema-mob-aspect': mobileAspect,
        } as React.CSSProperties
      }
    >
      <picture>
        <source media="(max-width: 768px)" srcSet={`/img/cinema/${name}-mob.webp`} type="image/webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/img/cinema/${name}-desk.webp`}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </picture>
      <span className="kr8-cinema-frame__vignette" aria-hidden />
      {flare && <span className="kr8-cinema-frame__streak" aria-hidden />}
      {badge && (
        <span className="kr8-cinema-frame__badge">
          <i aria-hidden /> {badge}
        </span>
      )}
      {caption && <figcaption className="kr8-cinema-frame__cap">{caption}</figcaption>}
    </figure>
  );
}

/**
 * Subtle Section Atmospheric Backdrop:
 * Adds rich dimensional lighting & background imagery behind sections that
 * previously sat on flat dark purple/obsidian backgrounds — calibrated separately
 * for desktop (subtle depth, preserving approved desktop design) and mobile.
 */
export function SectionAtmosphere({
  name,
  deskOpacity = 0.16,
  mobOpacity = 0.26,
  flare = false,
  position = 'center center',
  mobPosition = 'center center',
}: {
  name: CinemaAssetName;
  deskOpacity?: number;
  mobOpacity?: number;
  flare?: boolean;
  position?: string;
  mobPosition?: string;
}) {
  return (
    <div
      className={`kr8-sec-atmo${flare ? ' has-flare' : ''}`}
      aria-hidden="true"
      style={
        {
          '--atmo-desk-op': deskOpacity,
          '--atmo-mob-op': mobOpacity,
          '--atmo-pos': position,
          '--atmo-mob-pos': mobPosition,
        } as React.CSSProperties
      }
    >
      <picture>
        <source media="(max-width: 768px)" srcSet={`/img/cinema/${name}-mob.webp`} type="image/webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/img/cinema/${name}-desk.webp`} alt="" loading="lazy" decoding="async" />
      </picture>
      <div className="kr8-sec-atmo__mask" />
      {flare && <div className="kr8-sec-atmo__flare" />}
    </div>
  );
}
