# Database and deployment implementation status

Updated 2026-11-10. This document supersedes the initial audit's implementation status; that audit remains a historical snapshot.

## External resources actually changed

- Existing Supabase project: `bqxxieesjgacjqrzivcm` (`kr8 digitals company`, eu-west-1).
- Installed two PostgreSQL migrations: document storage and commission transition notification flags.
- Created a dedicated server API key named `kr8_website_server`. The connector masks its value, including on retrieval. A masked prefix is NOT a usable credential and has not been placed in Vercel.
- Created Vercel project `kr8digitals`, ID `prj_IkEVlIrVAaZ7oUtYkU5Xg8AKLuhD`, in team `kr8digitals02-8705`.
- Set canonical site URL, production Supabase URL and durable-storage requirement in Vercel. Preview deliberately has no production database credentials: configure a separate database before preview deployments.
- Domain `kr8digitals.com` is owned/verified in that Vercel account with Vercel nameservers. It is not yet assigned to this undeployed project. Domain config currently reports `misconfigured: true` with no A/CNAME values. No DNS edits were performed.
- No website deployment, Git repository migration, Git integration, Resend verification, production data import or domain cutover has been completed.
- No credentials posted in chat were stored in files, git remotes or repository history.

## Database implementation

The 27 existing logical collections (the initial audit incorrectly counted 28) are supported by:

- `kr8_collections`: initialization markers with an allowlist of collection names.
- `kr8_documents`: PostgreSQL JSONB documents, composite primary keys and separate immutable identity/timestamps.
- GIN containment index plus recency/visitor/referrer indexes; unique referral email/code, order reference, CMS slug and SEO route constraints.
- RLS on both tables; no direct browser/anonymous read or write privileges. Only the server role can use storage RPCs.
- Atomic seeding, atomic JSON patches and transactional replacement. Seeding cannot overwrite admin changes or resurrect a deliberately emptied collection.
- Server-side query predicates, sorting and pagination; database failures are no longer presented as empty successful reads.
- Production/Vercel storage fails closed without database credentials, instead of silently writing to `/tmp`.
- Financial confirmation/payout uses a transaction and advisory lock. Replays are no-ops; referrer totals are recomputed from commissions in the same transaction. Notification flags prevent repeated confirmation requests from emailing again, but durable delivery retries are not implemented.

Local JSON remains available for development only; it uses atomic file replacement and no longer truncates at 4,000 documents. Browser localStorage is still used for preferences and some visitor/client credentials. It is not the authoritative operational database. Existing browser-only content cannot be recovered centrally without a specific migration design and visitor participation.

No real customer documents have been imported. SQL tests used a rolled-back transaction and left zero documents. CMS defaults are initialized on first application use after credentials are configured.

## Application changes

- Removed existing-email signup responses that exposed referral private keys.
- Referral ledger authorization uses signed admin cookies or a private key in the Authorization header, not admin passwords/keys in query strings. The unset-password authorization bypass is removed.
- Hardened cookie matching and token comparisons; order signing requires a strong environment secret and strips customer contact details from URL tokens.
- Orders resolve prices from the server-side site catalogue, validate buyer contact fields, and require an authoritative stored order row. Admin order displays now use actual persisted fields and include payment confirmation.
- Disabled the incomplete Paystack adapter. Bank transfer remains manual.
- Restricted media uploads/serving to raster image MIME types, reduced request size and blocked active SVG delivery. Binary signature validation and object storage remain work to do.
- Added a global JSON content editor on the admin Overview: desktop/mobile homepage hero, homepage site data and site catalogue. Catalogue edits drive service/partner galleries and server-side order prices. These content changes have revision entries/restoration support.
- Fixed notification settings saving and consumption, added notification network timeouts, and enabled request-time rendering so connected CMS content is not frozen into a build.
- Updated Next.js, React and transitive vulnerable packages. Audit currently reports zero vulnerabilities; this is not a guarantee against all security defects.
- Added a repeatable, non-overwriting JSON-to-database import script.

## CMS coverage: explicitly incomplete

Existing editors for pages, services, programs, team, partners, media, navigation, SEO and RIYA now have working database persistence. Custom pages already support a limited section builder.

This is NOT yet a WordPress-equivalent universal editor:

- Much of the public route/component prose, homepage service-card copy, mobile interactive stage copy, legal content, footer/ecosystem copy, profile details, pricing tables, motion/visual assets and RIYA seed knowledge still has hardcoded or JSON-imported sources.
- Editing a site data field does not necessarily affect every place that imports the shipped seed. The global editor describes its scope.
- Core page section overrides and all publication-state behavior need route-by-route review.
- The section builder supports existing section types; it cannot securely create arbitrary new server code or database schemas from the dashboard.
- New software features and schema changes require reviewed code, migrations, tests and deployment. New custom content pages do not require a schema change because the PostgreSQL JSONB model stores their nested sections.
- Automated account recovery/verified referral email ownership, shared serverless rate limiting, request/origin hardening, transactional lead/referral linking, comprehensive content validation, object storage, audit completeness, retention/backups and durable email outbox remain launch work.

Do not describe this phase as a complete launch or as error-free.

## Verification completed

- `npm run lint`: passes (TypeScript).
- `npm run build`: passes after dependency/storage/CMS changes; rerun after any further modifications.
- `npm test`: seven suites pass, covering local CRUD/seeding, JSONB mapping, production fail-closed behavior, database predicate/pagination/error paths, admin tokens/cookies and order signing/privacy.
- `npm audit`: zero reported vulnerabilities.
- Added GitHub Actions checks for installation, TypeScript, tests, build and high-severity dependency audit (not yet run on GitHub).
- Local production-server HTTP checks: 10 public/admin pages returned 200; protected admin editor save reached the public homepage and was restored; referral repeat signup did not expose a key; anonymous ledger read was denied and valid Authorization header accepted; invalid catalogue orders were rejected; authenticated dashboard seeded/read CMS data. These checks used isolated local JSON, not Supabase or the production domain.
- Live SQL: seeding does not overwrite an edit, patches preserve IDs, repeated commission confirm/pay preserves totals. Test transaction rolled back.
- Live privilege query: both tables have RLS; anonymous/browser table reads and anonymous patch RPC execution are false; service-role inserts are true.
- Production HTTP, Resend delivery, DNS resolution/certificates, real cross-instance persistence and concurrent financial requests remain unverified. Sequential replay tests do not substitute for concurrency/load tests.

## Owner actions required

1. Revoke the GitHub token and rotate the Resend key posted in chat. Use secure account connections/environment settings going forward.
2. Provide the destination GitHub username and reconnect GitHub to that account. Secure `gh` is currently signed in as `kr8digitals`; no repository was created in an assumed account. The session branch must remain `arena/ef02ac12-kr8-company`.
3. In Vercel project Settings → Environment Variables, add server-only production credentials directly:
   - `SUPABASE_SERVICE_KEY`: usable Supabase secret/service-role key; not the anonymous/publishable key or a masked prefix.
   - `ADMIN_PASSWORD`: strong unique password.
   - `ORDER_SECRET`: at least 32 cryptographically random characters, separate from the password.
   - `RESEND_API_KEY`: rotated key.
   - `RESEND_FROM`: sender on the verified domain.
   - `KR8_ADMIN_EMAILS`: actual destination inbox(es).
   - Bank details if manual settlement instructions should display an account.
4. Supply the exact DNS records from Resend's domain page (record name, type, value, MX priority). These are DNS records, not API secrets. Available Vercel tools do not expose DNS record CRUD; an owner must add them in Vercel DNS. Do not guess DKIM/SPF values or overwrite mailbox MX records. No extra SPF record at the same hostname if one already exists; merge per provider instructions.
5. Confirm any customer-data exports requiring import, and preserve academy/other subdomain and existing mailbox records.
6. Finish remaining CMS/security scope, then connect the destination repository through Vercel's GitHub App. A GitHub PAT does not grant Vercel's separate installation access. Configure intended production branch and separate preview data; verify that a commit triggers a deployment.
7. The Vercel deployment connector cannot supply the first-deployment `projectSettings` controls if the API requests them. In that case, complete the first import/deployment in the Vercel dashboard. Never bypass the API's confirmation requirement through invented git_source parameters.
8. Only after production smoke tests should `kr8digitals.com` be assigned to the deployment.

## Local import

Node 22+ recommended for the env-file flag. Put credentials only in ignored `.env.local`, then:

```sh
npm run db:import                  # dry run: counts only
npm run db:import -- --apply       # inserts missing IDs; never overwrites existing IDs
```

Set `KR8_IMPORT_DIR` to an exported data folder if it is not `.data`. Resolve uniqueness conflicts rather than discarding them. Browser localStorage exports require separate conversion. Do not commit customer exports.
