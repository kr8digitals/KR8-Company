# Production readiness audit and launch plan

Audited: 2026-11-10. Repository: `kr8digitals/KR8-Company`.
Baseline commit: `f4a35a6efafc19b62db2c4aafe02c3c47414b13f`.

## Status

Historical initial audit. See `IMPLEMENTATION_STATUS.md` for subsequent changes.

The repository is already checked out; no duplicate clone was needed. Dependencies were installed with `npm ci`. Both `npm run lint` (TypeScript, not ESLint) and `npm run build` passed. `npm audit` reported three vulnerable dependencies: two high and one critical. Severity is the package audit classification, not proof that every advisory is exploitable in this app.

No remote database was provisioned, no deployment was created, no domain was changed, and no Resend domain was verified during this audit. Vercel and Supabase connections are required. Resend credentials must be entered in a secure deployment environment, never committed or posted in chat. This sandbox's outbound host restrictions also prevent direct calls to Vercel, Supabase, Resend, and public DNS APIs; use supported connected tools or user-assisted dashboard steps.

## Architecture and actual scope

- Next.js 15.5.9 App Router, React 19.2.0, TypeScript, plain CSS, Three.js.
- Public company site: services, team, programmes, partners, forms, referrals, orders, and legal pages.
- Admin: leads, commissions, orders, settings, CMS entities/revisions/media, RIYA knowledge and conversation management.
- Storage: `src/lib/store.ts`, local JSON by default; Supabase PostgREST when URL and server service key are supplied.
- Email: existing Resend HTTP integration in `src/lib/notify.ts`; optional webhook forwarding for WhatsApp.
- Content: JSON seed files plus database CMS overrides. Static content still exists outside CMS; provisioning tables alone does not make every page editable.
- RIYA: embedded retrieval/NLP engines plus optional AI Gateway, Notion integration and self-hosted inference. The README's description as a purely deterministic host is outdated. Gateway activation on Vercel and assertions of free/available models require independent verification; deployment does not establish free inference or reachability.
- Payments: bank-transfer flow; Paystack adapter advertises automatic confirmation but has no checkout initialization or payment webhook implementation. Keep Paystack disabled until implemented and tested.

## Database inventory: all 27 existing collections

| Group | Collections |
| --- | --- |
| Commercial | `leads`, `referrals`, `commissions`, `payouts`, `orders`, `applications`, `partner_proposals` |
| Conversations and analytics | `host_sessions`, `host_messages`, `events` |
| Configuration | `settings` |
| CMS | `cms_pages`, `cms_services`, `cms_programs`, `cms_team`, `cms_partners`, `cms_media`, `cms_navigation`, `cms_seo`, `cms_revisions` |
| RIYA operations | `riya_kb_custom`, `riya_knowledge_gaps`, `riya_learned_patterns`, `riya_submissions`, `riya_sync_log`, `riya_feedback_ratings`, `riya_security_events` |

Every current document has a text `id`, `createdAt`, `updatedAt` and entity-specific properties. No schema/migration files exist. A generic table with only a JSON `data` column will NOT work with the current driver: it sends flat documents to PostgREST and expects flat records back.

### Recommended implementation design (not yet applied)

Use Supabase PostgreSQL with checked-in versioned migrations. Choose either explicit relational columns plus JSONB for nested fields, or a deliberate JSONB document storage adapter that preserves the existing application-facing interface. Do not try to map arbitrary current properties directly into an incomplete SQL schema.

- Unique keys: referral code and normalized email; order reference; CMS slugs/routes where applicable.
- Index timestamps, lead/order statuses, referral code, visitor/session IDs, CMS publication state and RIYA queue state according to query paths.
- Represent money with fixed precision or integer minor units; enforce legal status transitions.
- Use foreign keys for financial relationships and SQL transactions/locking for commission confirmation and payout. Derive balances from an authoritative ledger, not independently incremented counters.
- Add dedicated tables for email delivery/outbox, webhook deduplication, admin audit entries and shared rate limiting as needed. These are proposed additions, not existing collections.
- Enable RLS on all private tables; deny anonymous/authenticated browser access by default. Keep the service-role key server-only and restrict server routes independently: service-role access bypasses RLS.
- Store media in object storage, not base64 database documents. Use upload validation, size limits and signed upload flows where appropriate.
- Explicit, idempotent CMS seed process separate from web requests; distinguish an intentionally empty collection from one never initialized.
- Plan data retention/deletion for IP addresses, contact data, conversations and analytics; configure backups and test restoration.

## Launch blockers and evidence

1. **Ephemeral production storage** (`store.ts`): Vercel defaults to `/tmp`; data is neither durable nor shared. Local writes silently fall back to memory and truncate collections to 4,000 records. Production must fail closed if durable storage is missing.
2. **Incomplete Supabase driver** (`store.ts`): `replaceAll` does not write anything remotely, breaking persistent CMS seeding. Reads swallow remote errors and return empty arrays; update/delete also suppress errors. Reads fetch an unfiltered endpoint before local filtering, so PostgREST's response cap can hide matching records. Implement server-side predicates, ordering, pagination, error propagation and real persistence semantics.
3. **Referral key exposure** (`api/referrals/route.ts`): submitting an existing email returns that account's private key without verifying email ownership. Replace with verified recovery/magic-link flow and generic signup responses.
4. **Referral authorization bypass** (same route): omitted admin query argument equals an unset admin password, granting admin ledger access in an unconfigured environment. Use the existing signed admin session, not passwords in query strings. Private keys in URLs also need removal/redaction to prevent logging leaks.
5. **Financial consistency** (`api/admin/action/route.ts`): repeating commission confirmation/payment increments counters again. Updates across documents are nontransactional. Require idempotent database transitions and concurrency tests before relying on balances.
6. **Client-controlled order prices** (`api/orders/route.ts`): API trusts `amountUsd` from the browser. Resolve approved prices or authorized quotes server-side before payment functionality is treated as authoritative.
7. **Order signing fallback** (`lib/order-token.ts`): hardcoded secret when environment values are absent. Use a dedicated strong secret and fail closed in production. Signed payloads include customer data: signatures do not encrypt URL content.
8. **Abuse protection**: process-local maps in login/referral/forms do not enforce global serverless rate limits. Add shared enforcement, body limits, input validation, origin/CSRF review and anti-spam controls.
9. **Media safety and scale** (`api/admin/media`, `api/media/[id]`): base64 uploads can exceed function request limits; active SVG is served from the site's origin. Reject or sanitize SVG, validate actual bytes, and use isolated object storage. Cache/archival behavior needs review.
10. **Dependency security**: resolve audit advisories with compatible patched versions and retest. Do not run an unreviewed forced major upgrade.
11. **Notification durability** (`notify.ts`): email failures return a boolean but have no durable retry/outbox. Add retry/delivery visibility, idempotency and signed webhook processing if delivery tracking is required.
12. **Documentation drift**: README collections, CMS description, host architecture and route/test claims are not a reliable current specification. Browser accessibility/performance claims were not revalidated in this audit.

## Deployment and DNS sequence

1. Connect Vercel and Supabase in Arena; identify owner/team, existing projects, database region and any existing production data. Confirm costs before creating paid resources.
2. Repair blockers, implement and test migrations/adapter, seed a staging database. Keep preview and production data isolated.
3. Create/import Vercel project from this repository and explicitly target the intended branch for deployments. Session work stays on `arena/ef02ac12-kr8-company`; do not silently deploy stale `main`.
4. Configure server-only database URL/key, strong admin password, dedicated order secret, Resend variables and canonical `NEXT_PUBLIC_SITE_URL=https://kr8digitals.com`. Use Node's supported LTS runtime. Do not expose service credentials through `NEXT_PUBLIC_*`.
5. Deploy staging and test forms, auth denial/allowance, durable reads across instances, CMS edits, conversation history, referral recovery and transactional commission replay/concurrency behavior. Confirm errors are not reported as success.
6. Export the current DNS zone BEFORE delegation: A/AAAA/CNAME, MX, TXT/SPF/DKIM/DMARC, CAA, SRV, verification records and academy/other subdomains. Preserve email and external services. Check DNSSEC/DS requirements with the registrar and DNS provider.
7. Add `kr8digitals.com` and `www.kr8digitals.com` to the actual Vercel project; configure one canonical host/redirect. If using Vercel authoritative DNS, obtain and verify its exact current nameservers from the account/domain configuration before handing them to the owner. No nameserver values were verified in this audit; do not change the registrar based on guessed values.
8. Recreate required DNS records in the destination zone before the owner switches nameservers. Confirm delegation, HTTPS, redirects, website endpoints, academy and existing mail. Keep a rollback record of the old nameservers and zone.
9. Verify Resend DNS and send test notifications from the real deployed environment. Complete production smoke tests before announcing launch.

## Resend setup plan

- Confirm the owner-controlled Resend account, intended sender and recipient inboxes.
- Prefer a dedicated transactional sending subdomain such as `notifications.kr8digitals.com` to isolate reputation and avoid replacing existing mailbox MX records. Final choice belongs to the owner.
- Add that domain in Resend. Copy the exact generated verification, DKIM and SPF/MX records into the authoritative zone. Do not invent DNS values or create competing SPF records at the same hostname.
- Configure an appropriate DMARC policy after checking existing mail senders.
- Set `RESEND_API_KEY`, `RESEND_FROM` and `KR8_ADMIN_EMAILS` securely in Vercel. The From address must belong to the verified sending domain. Resend is outbound transactional email, not a replacement inbox provider.
- Test form submission -> durable database row -> admin notification, customer-directed commission email, reply-to handling, delivery failure and retry behavior. Add webhook signature verification before recording delivery/bounce/complaint events.

## Owner input required

- Vercel and Supabase connections; which existing team/project to use, if any.
- Current DNS zone export (no secret API keys), registrar/provider name, existing mailbox provider and subdomains that must remain online.
- Preferred transactional sender and admin recipient inboxes.
- Whether current production submissions/orders/referrals need migration, and whether paid resources are authorized.

No production cutover should occur until the access flaws, persistent storage and financial correctness blockers are resolved.
