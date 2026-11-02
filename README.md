# KR8 Digitals — company website

The full company site: home, five services, about, programmes, partners, referrals,
contact, the Host, an admin dashboard, and the legal set. Next.js 15 App Router,
plain CSS, TypeScript strict. No component library, no page builder.

---

## Run it locally

```bash
npm install
cp .env.example .env.local     # then set ADMIN_PASSWORD
npm run dev                    # http://localhost:3000
```

```bash
npm run build && npm start     # production build
npm run lint                   # = tsc --noEmit
```

Node 20+.

---

## Environment

| Variable | Required | What it does |
| --- | --- | --- |
| `ADMIN_PASSWORD` | **yes** (8+ chars) | Unlocks `/admin`. There is no default — the dashboard stays locked and says so until this is set. |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical origin used in metadata, `sitemap.xml` and `robots.txt`. |
| `KR8_DATA_DIR` | no | Where the file store writes. Defaults to `.data/` locally and `/tmp/kr8-data` on Vercel. |
| `RESEND_API_KEY` + `RESEND_FROM` | no | Turns on email notifications for every form. Without it submissions still save; the API reports `emailed:false`. |
| `KR8_ADMIN_EMAILS` | no | Comma-separated recipients. Defaults to the company address in `data/site.json`. |
| `KR8_WHATSAPP_WEBHOOK` | no | Any webhook URL — submissions are forwarded as JSON so WhatsApp alerts can be wired in later. |
| `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` | no | Flips the datastore from files to Postgres through the same interface. |
| `PAYMENT_PROVIDER` | no | `bank_transfer` (default) or `paystack` once `PAYSTACK_SECRET_KEY` exists. |
| `KR8_BANK_NAME` / `KR8_BANK_ACCOUNT_NAME` / `KR8_BANK_ACCOUNT` | no | The transfer details printed on an order page. |
| `KR8_RATE_OVERRIDES` | no | JSON, e.g. `{"NGN":1600}` — pins a currency rate over the live one. |

---

## Content, and where it lives

All copy and data is in `data/*.json`, imported directly and typed by usage. There is
no hidden CMS layer and no markdown pipeline — change the JSON, rebuild, done.

```
data/site.json         identity, ecosystem, nav, stats, proof, doors, referral settings, host config
data/services.json     the five services, their process, outcomes, FAQs
data/portfolio.json    ten real projects, with live URLs
data/partners.json     four partners with named people and delivery records
data/programmes.json   four tiers + four programmes
data/pricing.json      draft USD price structure (hidden while publicPriceDisplay is false)
```

Two flags in `data/site.json → settings` gate money on the public site:

- `pricesApproved` — the price list has been signed off.
- `publicPriceDisplay` — actually show amounts. While false, `/services/*` shows the
  tier names and a quote CTA, never a number.

---

## Storage

One narrow interface (`src/lib/store.ts`) with two drivers:

- **file** — JSON in `.data/` (or `/tmp` on serverless). Zero config, used in local dev
  and on the preview deployment.
- **supabase** — activates automatically when `SUPABASE_URL` and
  `SUPABASE_SERVICE_KEY` are present. Same calls, no component changes.

Collections: `leads`, `referrals`, `commissions`, `orders`, `host_sessions`,
`host_messages`, `events`, `settings`.

> **On Vercel without a database, the file driver is ephemeral.** Writes land in
> `/tmp`, survive the life of the instance, and are not shared between instances.
> Forms, orders and the referral ledger therefore need Supabase (or any Postgres)
> before they are relied on in production. Nothing in the UI pretends otherwise.

---

## The Host

`src/lib/host-brain.ts` is a deterministic rules engine, not a model call. It answers
only from KR8's own knowledge, so it cannot invent a price or a statistic, it costs
nothing per message, and it still works when every external service is down. Anything
it does not recognise is handed to a human and an email goes out.

It never calls itself "AI". It states that it is not a person. Voice output is off by
default and remembered. Conversations persist in `localStorage` and can be deleted
from the panel in one click.

---

## Referrals

1. Referrer creates an account at `/referrals` → gets `/r/<code>` plus a private key.
2. A visitor arriving on that link has the code stored and attached to any form they send.
3. Admin confirms the client's payment → commission is computed at the published rate
   (10% build · 8% creative · 10% small with a $20 floor · 12% after three paid).
4. Marking it paid updates the referrer's balance. They see the same numbers in
   `/referrals/dashboard`.

The ledger API requires the private key issued at signup (`/api/referrals?code=&key=`),
so a code alone does not expose somebody's earnings.

---

## Checks that pass

- `tsc --noEmit` clean, `next build` clean, 37 prerendered routes.
- 25 routes at 1440 px: no horizontal overflow, exactly one `h1` each, zero console errors.
- 12 routes at 390 px: no horizontal overflow, zero console errors.
- axe-core (WCAG 2.1 A + AA): **0 violations** on 17 pages, including the 3D hero page.
- Mobile LCP under 1 s on throttled 4G (1.6 Mbps, 150 ms RTT, 4× CPU) with CLS at 0.

---

## Deploy

Any Node host. On Vercel: import the repo, add `ADMIN_PASSWORD` and
`NEXT_PUBLIC_SITE_URL`, deploy. Build command `next build`, no other settings.

Nothing here writes to `kr8digitals.com`. Cutover is a DNS decision, not a code one.
