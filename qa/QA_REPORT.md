# QA report

Date: 22 November 2026 · Build: commit after `1cefb51` · Tools: Playwright (Chromium), Lighthouse 12 (Edge headless),
axe-core. Local server with gzip (as on the Vercel CDN).

## Automated checks (`node tools/qa.mjs` → `qa/checks.json`)

| Check | Scope | Result |
|---|---|---|
| Horizontal scroll | 10 key pages × 7 languages at 360 px and 1440 px | **None** |
| Script errors | All 7 homepages × 5 breakpoints | **None** |
| Hero title inside the airplane window | 7 languages × 360 / 390 / 768 / 1024 / 1440 px | **Passes everywhere** (Chinese wraps per character) |
| Reduced motion | Home page | No hidden reveals, videos stay on posters, hero is the still view |
| Translations (`node tools/i18n-check.mjs`) | 1,020 strings × 6 languages + built pages | **All translated**, no English sentences left on translated pages |

Screenshots: `qa/screens/<lang>-<width>-hero.jpg` and `-sections.jpg` (70 images: 7 languages × 5 breakpoints × 2).

## Lighthouse — mobile (simulated 4G, 4× CPU slowdown)

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| `/en/` (home) | 51 | 100 | 100 | 100 | 6.2 s | 1,690 ms | 0 |
| `/fr/` (home) | 46 | 100 | 100 | 100 | 8.5 s | 2,480 ms | 0 |
| `/zh/` (home) | 49 | 100 | 100 | 100 | 6.3 s | 1,930 ms | 0 |
| `/en/contact/` | 100 | 100 | 100 | 100 | 1.7 s | 0 ms | 0.005 |
| `/de/destinations/sete/` | 99 | 100 | 100 | 100 | 2.0 s | 0 ms | 0.001 |
| `/fr/what-we-offer/` | 95 | 100 | 100 | 100 | 1.7 s | 250 ms | 0 |
| `/pl/for-organisations/` | 94 | 100* | 100 | 100 | 2.5 s | 0 ms | 0 |
| `/it/learn-french/` | 100 | 100 | 100 | 100 | 1.6 s | 10 ms | 0 |

\* Scored 95 in the first run (a link inside the tab list, and two buttons whose spoken name did not include their
visible text — present in all languages). Fixed and re-measured at 100.

Baseline before this work (live site, home page): Performance 58, LCP 4.6 s, TBT 790 ms (measured on the CDN, so
not directly comparable to local runs; home-page scores vary by ±5 between runs).

### Against the PRD targets (Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95, LCP < 2.5 s)

- **Every inner page meets all targets.**
- **Accessibility and SEO meet the targets on every page, including the home page.**
- **The home page does not meet the performance target.** The cost is the animated flight hero itself: WebGL cloud
  puffs, canvas birds, the canvas cabin window and 2,000 px photographs, all running from the first second on a
  simulated low-end phone. Today's work removed what it could without changing the hero: the photo sharpening no
  longer runs at start-up (skipped on phones, idle on desktop), video posters no longer load with the page, the fonts
  no longer block rendering and the new scripts do not force layout at start-up.
- Reaching 85 on the home page would need a decision from the owner, for example: on phones, show the hero as a
  still image with the title and start the animation only on the first scroll; or drop the WebGL cloud layer on
  phones. Both change how the opening looks, so they were not done without approval.

## Manual checks (in-app browser)

- Language switcher opens, keyboard and click; choice persists; `/` redirects to the saved language.
- Old unprefixed URLs (`/about/`, `/contact/`, `/destinations/sete/`) redirect permanently to `/en/…`.
- Video story cards load WebM in Chromium, play only while visible, link to the destination pages.
- Map: outline draws in, markers pop in, hatched highlight follows the selection, details panel announced.
- Enquiry form: validation messages, honeypot drops bot submissions, "Who" pre-fill from the dialog and from offer
  pages, composed email content.
- Desktop cursor glow follows the pointer; buttons are pulled towards it and ease back.

## Not tested here

- Real iOS Safari / Android Chrome devices, desktop Safari and Firefox (no access from this environment). Playwright
  covered Chromium with mobile emulation. Recommended before launch: one pass on a real iPhone (muted autoplay,
  safe-area insets, hero scrolling) and on Firefox.
- Screen-reader walkthrough (NVDA / VoiceOver).
