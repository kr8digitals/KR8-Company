# KR8 DIGITALS — 14-Stage Homepage Overhaul Progress Checklist

Strict execution protocol: implement, render, visually inspect (Desktop + Mobile via Playwright), and verify **one stage at a time in exact order** before moving to the next stage.

- [x] **Stage 1 — Hero Section Redesign & Refinement (Desktop View)**
  - [x] 1.1 Fix cramped/short left-hand `"Whoever you are, whatever you do, we exist because of you."` area & awkward middle negative space; balance vertical alignment, spacing, typography, and proportions with right-hand animation.
  - [x] 1.2 Remove ALL texts below the right-hand hero animations (`cine__foot` + any beat text under `cine__frame`), keeping the animations themselves (`cine__frame` + chapter bars) completely unchanged in appearance and behavior.
- [x] **Stage 2 — Hero Section Redesign for Mobile View**
  - [x] 2.1 Purpose-design a mobile-native hero animation, cohesive arrangement of animation + introductory message + supporting content, and immediate compelling CTA (not a resized desktop hero).
- [x] **Stage 3 — Services Section ("What We Build for Clients")**
  - [x] 3.1 Rewrite section description persuasively around client value and capability.
  - [x] 3.2 Compare available website builds (`AFRISTEM Global`, `Prime STEM Nigeria`, `30 Days Consistency Drill`, etc.) and replace Cirenes preview with the single most visually impressive showcase (`AfriSTEM Global`).
  - [x] 3.3 Split `Graphic Design & Branding` into two independent cards: `Graphic Design` and `Branding` (with accurate KR8 Branding details).
  - [x] 3.4 Replace `SEO Optimization` preview with a newly generated SEO visual (no website screenshot).
  - [x] 3.5 Refine or generate a stronger, clearer `AI Agent and Automation` visual.
  - [x] 3.6 Replace `Video Editing` preview with a completely new video or motion/editing showcase (`kr8-editing-reel.webm` + `video-editing-suite.webp`).
- [x] **Stage 4 — Replace "Our Work" Section with Free Digital Skills Training**
  - [x] 4.1 Completely remove `"22 sites deployed. 18 of them are still for sale."` (no stats, wording, or presentation retained) and build KR8's flagship Free Digital Skills Training section.
- [x] **Stage 5 — Add KR8 DIGITALS TRIBE Section**
  - [x] 5.1 Introduce a visually distinct KR8 DIGITALS' TRIBE community section immediately after Free Digital Skills Training, showcasing purpose, community-driven craft, and member benefits.
- [x] **Stage 6 — Add "OTHER THINGS WE DO" Section**
  - [x] 6.1 Introduce `OTHER THINGS WE DO` immediately after Tribe, showcasing `Mindset Shift` and `Join the Team` as distinct ecosystem initiatives.
- [x] **Stage 7 — Partners Section Revision**
  - [x] 7.1 Rewrite description around collaboration & shared value; remove `HIS Battle Axe` completely; display 3 main partners (`Motionverse`, `CHIGOMA`, `Next Gen Scholars`) + 4th card `"Your Logo Here — Tell Us What You Can Bring"` linked to `/partners`.
- [x] **Stage 8 — Founders Section Description & Website-Wide Image Cropping**
  - [x] 8.1 Rewrite `"Three Founders, One Company."` description around collaboration, shared vision, and collective effort.
  - [x] 8.2 Crop all photos of Timfire, Stephen Saint, and Daniel consistently to slightly above waist level across the ENTIRE website without altering faces/features.
- [x] **Stage 9 — Founders' Profiles & Naming Adjustments**
  - [x] 9.1 Update cards & homepage references: `Tim Faya` (`Founder and Chief Executive`, `Kenneth Timothy Iziogo`, `Read About Tim Faya`); `S T E V E O K I N G` / `Stevie O King` (`Co-Founder` only, `Steven Saint`, `Read About Steven Saint`); `Creative Expression` (`Co-Founder`, `Daniel Akachukwu Augustine`, `Read About Creative Expression`).
- [x] **Stage 10 — "Join the Team" Section Description Rewrite**
  - [x] 10.1 Keep `"Join the Team — If You Can Build, We Want to Meet You."` structure/design and completely rewrite description underneath.
- [x] **Stage 11 — "How Can We Help You?" Section Review**
  - [x] 11.1 Evaluated and removed completely (Option A) as all five pathways now have dedicated flagship sections above, sharpening bottom-of-page conversion focus.
- [x] **Stage 12 — Final Call-to-Action Section Cleanup**
  - [x] 12.1 Keep `"If You Run a School, a Business or a Brand, We Should Talk."` section and completely remove the description underneath without replacing it.
- [x] **Stage 13 — Website-Wide Founder Image Consistency Audit**
  - [x] 13.1 Inspect every founder photo across `/`, `/about`, `/about/join-the-team`, `/services/[slug]`, `/programs`, `/contact`, etc., ensuring consistent waist-level framing everywhere.
- [x] **Stage 14 — Final Quality Assurance & Production Deployment**
  - [x] 14.1 Full Desktop + Mobile + Link/Media/Console QA, `npm run lint && npm run build`, deploy to `https://kr8company.vercel.app`, and verify live `200 OK` across all routes and assets.
