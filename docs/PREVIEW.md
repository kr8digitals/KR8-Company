# Preview deployment

| | |
|---|---|
| **Live URL** | https://kr8-company.vercel.app |
| Repository | https://github.com/kr8digitals/KR8-Company |
| Vercel project | `kr8-company` (team KR8 Digitals) |
| Deployment | `dpl_4CAcPTtnCwAN1xDBVyoC7mZzSBf8` — READY, production |
| Admin | https://kr8-company.vercel.app/admin — password `KR8-preview-2026-admin` |

## Deploy again

Any push to `main` redeploys automatically. Manual:

```bash
git push origin main          # CI deploys
```

## Environment set on the project

| Key | Value |
| --- | --- |
| `ADMIN_PASSWORD` | `KR8-preview-2026-admin` (encrypted — change it in Vercel when you hand this to Timfire) |
| `NEXT_PUBLIC_SITE_URL` | `https://kr8-company.vercel.app` (swap to `https://kr8digitals.com` at cutover) |

## What is live and what is not

Live: every page, the Host, all six forms, the referral ledger with commission
confirmation, the admin dashboard, order pages with transfer instructions,
sitemap, robots, OG image, redirects.

Not live: email notifications (needs `RESEND_API_KEY`), the real bank details
(needs `KR8_BANK_*`), public price display (blocked until Timfire approves
`data/pricing.json`).

**Data caveat, stated plainly:** this deployment uses the file store. On Vercel
that is `/tmp` — per-instance and ephemeral. Submissions and the referral ledger
work, but they reset when an instance is recycled. Add `SUPABASE_URL` +
`SUPABASE_SERVICE_KEY` to make them durable; no code change required.
