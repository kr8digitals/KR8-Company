# KR8 DIGITALS — RIYA v3 & About Page Upgrade Report

**Live Production URL:** `https://kr8company.vercel.app`  
**AI Representative Identity:** `RIYA` (`R-I-Y-A`)  
**Inference Engine:** **Vercel AI Gateway (`https://ai-gateway.vercel.sh/v1/chat/completions` via Vercel OIDC)** + **Page-Specific Dossier & Conversational Grounding Engine v3**

---

## 1. Executive Summary of `RIYA` v3 Upgrades

1. **Powered by Vercel AI Gateway (Zero Extra Cost via Vercel OIDC + Free Failover Chain)**:
   - Wired directly to the `kr8company` / `AFRISTEM` Vercel project's **OIDC token** (`req.headers.get("x-vercel-oidc-token")` -> `process.env.AI_GATEWAY_API_KEY` -> `process.env.VERCEL_OIDC_TOKEN`) at `src/lib/riya-ai-gateway.ts`.
   - Automatic multi-model failover across verified Vercel Free-Tier-eligible models (`openai/gpt-4.1-mini`, `google/gemini-2.5-flash-lite`, `alibaba/qwen3.7-flash`, `meta/llama-3.3-70b`, plus `$0.00` free gateway model `nvidia/nemotron-3.5-lightning-free`) backed by an instant in-process conversational synthesis fallback for 100% uptime.
   - **Optional Vercel-Connected Notion Sync (`fetchVercelNotionKnowledge`)**: Automatically detects and syncs Notion knowledge pages if `NOTION_API_KEY` / `VERCEL_NOTION_TOKEN` is connected in the Vercel project settings (`90s` live cache).

2. **Warm, Personalized, Short-Sentence Human Replies (Zero Walls of Text)**:
   - Replaced long robotic KB dumps with crisp **2–4 sentence (~45–85 word)** replies that acknowledge the visitor's exact background, profession, and intent and end with a natural follow-up question.
   - Verified nuanced handling across real visitor scenarios:
     - **Registering someone else** (*friend, child, sibling, colleague*) — explains filling out the form with the learner's own real name, email, and WhatsApp so their permanent KR8 ID & certificate match their identity.
     - **Non-tech professions & belonging** (*e.g., nurses, teachers, doctors, pastors, students*) — welcomes them warmly, highlights flexible 100% free skill tracks, 8%–12% referral cash commissions, and *Mindset Shift* sessions, and remembers their role across subsequent turns.
     - **Ways to join KR8 DIGITALS** (`"I'd love to join you guys"`) — clearly distinguishes **KR8 Academy** (learn free), **KR8 Tribe** (3,000+ creative community), and **Join the Studio Team** (`$0` application fee for portfolio creatives).
     - **Client satisfaction, revisions & redesigns** — explains milestone check-ins and structured revision rounds before advancing project stages, plus 100% client IP ownership upon full settlement.
     - **Earning through KR8 DIGITALS** — explains the `10%` / `8%` -> `12%` loyalty cash referral commissions (`$20` payout threshold) and paid creative collaboration.
     - **Strict Anti-Hallucination & Security Guardrails** — verifies dollar amounts, founder spellings (**Timfire**, **Steveoking**, **Creative Expression**), and `RIYA` identity on every generated turn while blocking prompt-injection and false visitor policy overrides.

3. **100% Reliable Popup & Chat Closing on Desktop and Mobile**:
   - Raised `.host-backdrop` (`z-index: 144`), `.host-launcher` (`145`), `.host-welcome` (`146`), and `.host-panel` (`150`) above `.nav` (`90`) and `.nav-burger` (`95`) so the mobile navigation bar never intercepts close taps.
   - Added `100dvh` mobile height bounds (`calc(100dvh - 24px - env(safe-area-inset-top))`), prominent **`Close ✕`** header pill (`.host-close-pill`), `32×32px` `.host-welcome__close` hit target, mobile tap-outside backdrop close, and `Escape` key close.
   - Decoupled scroll tracking into refs (`activeSectionRef`, `scrollRatioRef`) and persisted per-route dismissal (`dismissedPathsRef` + `sessionStorage`) so closed popups **never** re-open on scroll or form hesitation.
   - Fixed raw `&amp;` HTML entity leaks and added clean `**bold**` + `*italic*` inline rendering in `src/components/Host.tsx`.

4. **Distinct, Activity-Sensitive Page Questions & Instant Self-Learning (`Snap-Teach`)**:
   - Created `src/lib/riya-page-dossiers.ts` with deep route-by-route dossiers and unique, non-welcome proactive questions across `/`, `/about`, founder profiles, `/about/join-the-team`, `/services` + all 6 service detail pages, `/programs`, `/tribe`, `/programs/mindset-shift/invite`, `/partners`, `/partners/next-gen-scholars`, `/referrals`, `/contact`, and `/terms`.
   - Added **⚡ Snap-Teach RIYA** in `/admin` (`RiyaAdminPanel.tsx` + `/api/admin/riya`) so administrators can type any new fact, cohort date, or rule in plain English and teach RIYA in 1 click.
