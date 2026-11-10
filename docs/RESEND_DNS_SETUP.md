# Resend email DNS setup (manual — no DNS write access in this toolset)

Domain: `kr8digitals.com`, hosted on Vercel nameservers. Add these records in
**Vercel → Domains → kr8digitals.com → DNS Records** (or your DNS provider),
then press **Verify** in Resend → Domains → kr8digitals.com.

| Type | Name/Host | Value | Priority | Notes |
| --- | --- | --- | --- | --- |
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDZiDaG2ObA15IMYeib4B9/tlglqXxIYhTzdsGW5OWJT8nd5kS1vvQZQ4udgGHx5APSTZrh2LhALyU7wxQvqpmbyLCweTK2muHbyd5faQCasMGcYSYGqrAtV4XaNUpxiNOJKaTys1YUVsY1sjbRmp/CjyV6Kfrt9xagyj1nG1SoFwIDAQAB` | — | DKIM signing key (single TXT value). |
| CNAME | `rsend` | `rsend-euw1.forge.rmta.net` | — | Resend bounce/return-path host. |
| CNAME | `send` | `send.forge.rmta.net` | — | Resend sending host. |
| TXT | `_dmarc` | `v=DMARC1; p=none;` | — | Optional; skip if a DMARC record already exists. |
| MX | `@` | `receive-euw1.forge.rmta.net` | 10 | **Inbound only.** Do not add this if the domain already receives mail elsewhere — it would hijack that mailbox. Ask Resend/your mail provider if unsure. |

Rules:

- Keep TTL on Auto/3600.
- Do not substitute generic Amazon SES or `_spf` records; use exactly the values above.
- Do not create a second record with the same name/type — merge instead.
- DNS propagation can take minutes to a few hours. Vercel's nameservers are already
  active for the domain, so records added in the Vercel dashboard apply immediately.

After verification, sending uses `RESEND_FROM` (already set to
`KR8 Digitals <hello@kr8digitals.com>`) and `RESEND_API_KEY` (already stored as a
sensitive production variable). Until verification completes, form submissions still
save; email notification is reported as skipped, not silently lost.
