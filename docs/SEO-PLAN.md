# KR8 Digitals SEO implementation and page intent

## The important correction

Do **not** publish two million keywords per page, hidden keyword blocks, misspelling lists, or millions of thin landing pages. That is keyword stuffing / scaled low-value content, not a visibility strategy, and can make pages harder to crawl and trust. Search engines already correct many spelling variants. Build clear pages for real services and audiences, use the brand consistently, and fix actual old URLs with redirects where KR8 controls them.

The screenshot shows a brand-entity problem as well as a content problem: a search for “kr8” mixes unrelated brands and tools, while the KR8 Digitals result is strongly associated with free training and an old external registration page. KR8 cannot claim generic “K” or “KR” searches, nor control Google's result removal for a third-party Lovable hostname from this repository.

## Changes made in this pass

- `NEXT_PUBLIC_SITE_URL` (default `https://kr8digitals.com`) is now the single origin for canonical metadata, `robots.txt`, the sitemap, and company structured data. This removes the prior mismatch where the root metadata and sitemap could name different sites.
- Removed the global `keywords` meta tag. It is not a useful ranking lever; page titles, useful copy, crawlability, and authoritative links matter more.
- Sharpened the site-wide title around the actual brand and two primary entities: the digital studio and free skills training in Nigeria. Added Organization + WebSite JSON-LD with the known brand variants; no fabricated review, address, or ranking claims.
- Added Service and BreadcrumbList structured data to the individual service pages.
- The sitemap now includes only published CMS pages, omits noindex/system pages and duplicate CMS paths, and retains the real public service, partner, and content routes.
- `robots.txt` now blocks only admin/API paths. Noindex pages remain crawlable so crawlers can see their `noindex` directive rather than being blocked from it.

## Page-by-page intent map

Use a small, distinct primary topic for each useful page; support it naturally in its title, H1, opening paragraph, internal links, and page-specific metadata. Add further sections only where they answer actual visitor questions.

| Page | Distinct intent and example query language | On-page focus |
| --- | --- | --- |
| `/` | “KR8 Digitals”; “KR8 Digitals Nigeria”; “digital studio in Nigeria”; “website and branding company Nigeria” | Lead with the exact company entity and its commercial studio. Treat the Academy as a separate secondary offer. |
| `/about` | “about KR8 Digitals”; “KR8 Digitals founders”; “what does KR8 Digitals do” | Clarify the studio, free learning initiatives, and community as related but distinct. |
| `/about/timfire` | “Timfire KR8 Digitals”; “Kenneth Timothy Iziogo” | Keep name, founder role, and links to real work consistent. |
| `/about/steveoking` | “Steveoking KR8 Digitals”; “Stevenson brand designer” | Explain the public name/real-name relationship accurately. |
| `/about/creative-expression` | “Creative Expression KR8 Digitals”; “Daniel Akachukwu Augustine video editor” | Keep identity and Chigoma relationship consistent. `/about/daniel` redirects here and stays out of the sitemap. |
| `/about/join-the-team` | “creative jobs Nigeria”; “work with KR8 Digitals”; “video editor / designer opportunities” | Describe the real application process; don't imply guaranteed jobs. |
| `/services` | “digital agency Nigeria”; “creative agency services Nigeria”; “web design branding video agency” | Summarize the six disciplines and link to each dedicated service page. |
| `/services/website-design` | “website design Nigeria”; “business website developer Nigeria”; “custom web development for businesses” | Emphasize actual deliverables, audiences, process, and shipped portfolio. |
| `/services/branding` | “brand identity design Nigeria”; “branding agency for small business” | Keep brand strategy distinct from ongoing campaign graphic design. |
| `/services/graphic-design` | “commercial graphic design Nigeria”; “social media and campaign graphics” | Show real examples and formats actually delivered. |
| `/services/video-editing` | “commercial video editing Nigeria”; “Instagram Reels editing service”; “brand video post-production” | Distinguish client services from free video-editing training. |
| `/services/seo` | “technical SEO services Nigeria”; “SEO audit and website optimization”; “local search optimization” | Explain the work and avoid ranking guarantees or keyword-count claims. |
| `/services/ai-automation` | “AI automation for businesses Nigeria”; “custom AI customer support agent”; “business workflow automation” | Explain actual guardrails, handoff, and use cases. |
| `/programs` | “free digital skills training Nigeria”; “KR8 Academy”; “tuition-free online creative training” | Make this the durable, indexable company-owned overview; link to the verified current Academy application destination. |
| `/programs/mindset-shift/invite` | “Mindset Shift KR8”; “leadership and career forum Nigeria” | Keep dates and registration instructions current; remove expired event claims promptly. |
| `/tribe` | “KR8 Digitals Tribe”; “African creator community”; “creative community Nigeria” | State eligibility, activities, and current join/waitlist route clearly. |
| `/partners` and `/partners/[slug]` | “partner with KR8 Digitals”; named partner and collaboration queries | Keep only real, approved partner profiles indexable and substantive. |
| `/contact` | “contact KR8 Digitals”; “request a website quote Nigeria” | Show consistent official contact methods and response expectations. |
| `/referrals` | “KR8 Digitals referral program”; “refer a client to KR8” | Public program explainer; don't index individual referral codes or private ledgers. |
| `/privacy`, `/terms`, `/accessibility` | Policy and accessibility support queries | Keep accurate and accessible; these aren't keyword-targeting pages. |
| `/admin`, `/order/[ref]`, `/r/[code]`, `/referrals/dashboard` | Private utility flows | Keep `noindex`; never add to the sitemap or expose private order/account information in metadata. |
| Published CMS pages | One individually useful topic per page | Require a unique title/description, useful original content, stable slug, and deliberate index/noindex decision before publication. |

These are **topic hypotheses**, not search-volume claims. Refine them using Search Console queries, qualified leads, and actual service geography; do not add every spelling or phrase as a visible/hidden keyword list.

## Old Lovable registration result

The result shown (`kr8digitalsreg.lovable.app`) is on a hostname this repository does not own. A code change here cannot issue a redirect or remove that result. To retire it cleanly:

1. Replace every KR8-owned link to it with the current official Academy application URL (the site currently uses `academy.kr8digitals.com/apply`). Verify that destination and registration flow are live before promoting it.
2. If KR8 still controls the Lovable project, publish a permanent redirect from the old registration URL to the current application URL, or take the old page down and return a 410. Remove it from any sitemap and linked profiles.
3. In Google Search Console, verify the relevant property and request temporary removal of the obsolete URL after the redirect/removal is live. Keep the redirect/410 in place; a removal request alone is temporary. Also inspect Search Console's indexed URL and canonical reports.
4. Update Bing Webmaster Tools and official social/video descriptions that still link to the old URL. Search snippets refresh on the search engine's schedule; no code change guarantees immediate replacement.

## Next measurement-led work

- Verify domain ownership in Google Search Console and Bing Webmaster Tools; submit `https://kr8digitals.com/sitemap.xml` and inspect representative URLs.
- Check the deployed pages for one descriptive title, one useful meta description, one H1, a self-referencing canonical, and the intended index directive. Confirm the canonical host resolves directly and all HTTP/HTTPS and `www` variants redirect to it.
- Review query and landing-page data after indexing; create or expand pages only for real search intents evidenced by Search Console, customer questions, or actual service capability.
- Earn accurate third-party mentions and links (clients, partners, directories, YouTube/social profiles). These help disambiguate “KR8” far more than stuffing variants into page source.
