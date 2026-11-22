# Changelog

Design and engineering changes made against the PRD (`formaskills-website-prd.md`). Newest first.

## Motion, video, map, cursor, forms, QA (PRD §4–§10)

### Home page below the hero (§4)
- **Audience cards** ("For me / For my organisation / Become a partner") rebuilt as photo cards with an icon badge,
  hover lift, gentle 3D tilt on desktop and image zoom; the whole card is the link. On phones they become a
  swipeable row with snap points.
- **"Why Formaskills Travel?"** — icons in round badges that pop in one after another; the photo moves with a gentle
  parallax.
- **"Three simple steps"** — the dashed line becomes a timeline that draws itself as you scroll; each step lights up
  when the line reaches it (vertical on phones).
- **Wave dividers** (slowly drifting crest) into and out of the navy map section.
- **Closing call to action** now shows the Sète canal photo behind a navy overlay, with the existing birds; applied
  on every page that uses it.
- **Sticky "Enquire" button** appears after the hero, hides over the closing call to action and the footer, respects
  safe areas.
- **Reveal on scroll** site-wide: content below the fold fades and rises; groups (cards, grids) stagger. Content
  already on screen is never hidden. Off with reduced motion.
- **Testimonials** component ready but hidden (no testimonials exist — see `CONTENT_GAPS.md`).

### Destination video (§5)
- Four clips compressed (`tools/compress-video.sh`): MP4 3.0–6.3 MB and WebM 1.6–4.5 MB, 1080×1920, no audio,
  plus JPEG posters.
- Home page section "Our destinations in motion": four vertical story cards (staggered heights, swipeable on phones),
  city name and one-line description, linking to the destination page.
- Each destination page shows its clip beside "Famous for".
- Posters and clips load only as the cards approach; clips play only while visible and pause off screen or when the
  tab is hidden. Reduced motion or data saver → poster only. Screen-reader text describes each clip.

### Map (§6)
- Investigation and feasibility in `docs/MAP_REPORT.md`.
- Outline draws itself, markers pop in, hatched highlight glides to the selected destination, larger touch targets,
  `aria-live` details panel; keyboard and list fallback via the destination tabs.

### Cursor (§7)
- Desktop only (`hover: hover` and `pointer: fine`, no reduced motion): soft periwinkle glow that follows the pointer
  with smoothing (multiply blend, so text keeps its contrast; hidden over form fields, video and the map); buttons
  and calls to action are gently pulled towards the pointer (max 8 px) and ease back. One shared script
  (`assets/js/motion.js`) and stylesheet; native cursor untouched; transforms only, one rAF.

### Forms (§9)
- One enquiry form on the contact page and in the Enquire dialog: name, email, phone (optional), who it is for,
  destination (optional), message, consent with privacy link, hidden honeypot.
- Translated validation messages; the dialog's "Who is this for?" choice pre-fills the form; offer pages pre-select
  "For my organisation" and keep their subject line.
- All submissions go through `submitEnquiry(data)` — email fallback today, documented hook for an API.
- "Sending an enquiry is not a booking" kept on every form.

### Site-wide (§8)
- `FAQPage` structured data on the FAQ (contact) page, generated per language from the translated questions.
- Google Fonts load without blocking the first paint (`font-display: swap`); the Newsreader italic 500 used by the
  hero title is now actually loaded instead of being synthesised.
- Inner pages: Lighthouse mobile 99–100 in every category.
- Fixed: the "Why" photo was pointing at a file the build does not publish.

### Performance
- Hero: the one-time sharpening of the Sète aerial photo no longer runs at page start: it is skipped on phones (the
  source already covers their screens) and deferred to browser idle time on desktop.
- Video posters are no longer downloaded at page load (~430 KB saved on the home page).
- Local preview server now gzips text files like the production CDN, so local Lighthouse runs are representative.

### QA (§10)
- `tools/qa.mjs` (Playwright): screenshots of all 7 language homepages at 360/390/768/1024/1440 px in `qa/screens/`,
  plus checks for horizontal overflow on 10 key pages, script errors, hero title fit and reduced motion.
- Lighthouse reports in `qa/lighthouse/`; results in `qa/QA_REPORT.md`.

## Hero title (§3)
- "Your journey begins before you land." — bolder display weight; "before you land" in Newsreader italic with a brand
  periwinkle underline that draws in; staggered word reveal (per character in Chinese); in all 7 languages.

## Languages (§1)
- 7 languages with URL prefixes, switcher, persistence, hreflang, per-language canonical, sitemap and
  `TRANSLATION_REVIEW.md`.

## Typography (§2)
- Darker body text (#10142e), bolder headings, 14 px minimum, 44 px tap targets.
