# Content gaps

Content the site is ready for but does not have yet. Nothing below has been invented on the site.

| Gap | Where it would go | Status on the site today |
|---|---|---|
| **Testimonials** from participants or partner organisations | Home page, between "Three simple steps" and the closing call to action | Component built; hidden while `build/testimonials.json` is empty. Add `{ "quote", "name", "role" }` entries (and translations) to show it. |
| **Statistics** (groups hosted, years of experience, partner count…) | Home page "Why Formaskills Travel?" | None shown. Animated number counters can be added once real figures exist. |
| **Partner / accreditation logos** | Home page or Partners page | None shown. |
| **Reviews / ratings** | — | None shown. Do not add without a verifiable source. |
| **Credits and licences for the city video clips** | Photo credits page | The four clips appear to be AI-generated (a sparkle watermark is visible in the bottom-right corner). Confirm their origin and licence; consider removing the watermark or adding a note. The site describes them only as "short silent clips", not as filmed footage. |
| **Native-speaker review of translations** | All non-English pages | See `TRANSLATION_REVIEW.md` (French first). |
| **Legal placeholders** | Legal notices, privacy notice | Share capital, publication manager, hosting provider, AI provider and processors, retention periods — in square brackets on the pages, in every language. |
| **Form backend** | Contact form, Enquire dialog | Email fallback works today; see README "Enquiry forms" to connect an API. |
| **Facebook page URL** | Social rail, footer | The client asked for Facebook in the left social rail. Add its URL to `SITE.socials` in `build/content.mjs` (empty `href` today, so it is hidden). |
| **Social media accounts** | Footer, social rail | Links point to the accounts listed in `build/content.mjs` — confirm they are correct and active. |
| **Final domain** | Canonical URLs, sitemap, hreflang, robots.txt | Built for `formaskills-travel.fr` — confirm. |
| **Open Graph image per page** | Social sharing previews | One shared image (`assets/img/og.jpg`) is used site-wide. |
