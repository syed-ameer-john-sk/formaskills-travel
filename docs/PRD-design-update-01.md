# PRD — Client Design Update 01

Source: `Design Update_01.docx` (12 annotated screenshots, client, 23 Nov 2026).
Owner: web team · Status: implemented, pending client review · Branch: `claude/client-request-animation-5b25ed`

Reusable format: copy this file for the next client round, keep the ID scheme (`DU<round>-<n>`),
and tick the checkboxes as each item ships. Every item has a measurable **Done when**.

## Principles (apply to every item)

- **Motion budget:** transform/opacity only, ≤ 60 fps, no layout thrash; one rAF loop per feature.
- **Respect users:** everything decorative is off under `prefers-reduced-motion` and Save-Data;
  videos never autoplay with sound and never load before they are near the viewport.
- **A11y:** WCAG 2.2 AA contrast for text over media; all new controls keyboard-operable with
  visible focus; ARIA state kept in sync (`aria-expanded`, `aria-current`).
- **No regressions:** `npm run build` clean, i18n keys present for new strings, QA script passes.

## Task list

| ID | Client note | Page / area | Change | Done when |
|----|-------------|-------------|--------|-----------|
| DU1-0 | "Does it possible cloud moves" | Home intro | Clouds drift continuously (slow Ken Burns drift + parallax wisps) during the intro | Intro clouds visibly move without scroll; static under reduced motion |
| DU1-1 | Text more visible and bigger; cursor effect more visible | Home window scene, global cursor | Larger window copy with a legibility scrim; stronger cursor (ring + dot + glow, grows on links) | Window H1 ≥ 1.25× old size and contrast ≥ 4.5:1; cursor clearly visible on light and dark |
| DU1-2a | Hero like videos of French cities | Home landing scene | After landing, the hero plays the city clips (Sète → Montpellier → Paris → Nice) with crossfade and a city label | Landing shows live video, cycles cities, falls back to posters |
| DU1-2b | Header letters highlighted and visible | Header over media | Nav links get a glass pill backdrop and text shadow while the header overlays media | Nav text contrast ≥ 4.5:1 over the brightest frame |
| DU1-3 | Highlight the chatbot on the right with animation | Global "Ask" AI launcher | Pulsing halo, gradient sheen and a one-time greeting bubble | Launcher draws attention on load; stops once opened; static under reduced motion |
| DU1-4 | Social icons on the left, through the whole site | Global | Fixed vertical social rail (Instagram, LinkedIn, Facebook, TikTok) | Rail visible on every page ≥ 900px wide; hidden on small screens (footer keeps icons) |
| DU1-5 | Trendy buttons that pop colour on hover ("Explore for me") | Home path cards | Pill CTAs with colour fill sweep, arrow nudge and per-card accent | Hover/focus floods the pill with colour; keyboard focus shows the same state |
| DU1-6 | Keep the city clips; use video instead of images on Destinations | Destinations page | Destination cards use the city video (poster fallback) in place of the still | Each destination card plays its clip when in view |
| DU1-7a | Improve the design here | Home map section, offer detail cards | Refined map panel (glass, motion on switch) and offer cards (header band, two-column facts) | Visual review sign-off |
| DU1-7b | Remove this ("In development" badge) | Offers | Hide "In development" status badges | No "In development" badge renders |
| DU1-8 | Remove this from the page | Destinations page map section | Remove the map explorer from /destinations/ | /destinations/ has no map section |
| DU1-9 | Improve Become a partner and About | /partners/, /about/ | Stronger hierarchy, image-led hero, card hover states, staggered reveals | Visual review sign-off |
| DU1-10 | Drop-down icon on each FAQ title | /contact/ FAQ | Category titles become accordions with a chevron that reveal their questions | Each category expands/collapses with keyboard and mouse; `aria-expanded` correct |
| DU1-11 | Blue line disappears while scrolling | Header scroll progress | Progress bar stays visible and spans full width through the whole page | Bar visible at every scroll position on every page |
| DU1-12 | Remove "Where we work" on About | /about/ | Delete section | Section absent |

## Open questions / assumptions

- **Facebook URL** is not in the content. The rail shows Facebook only once `SITE.socials` has its URL (see `CONTENT_GAPS.md`).
- DU1-7b: we hide only the "In development" badges and keep "Available".
- DU1-8: the screenshot with the short card (period only) is from /destinations/, so the map stays on Home.

## Verification checklist

- [x] `npm run build` passes
- [x] Home: intro clouds move; window text legible; landing plays city videos; header readable
- [x] Cursor visible; AI launcher animated; social rail on all pages
- [x] Path card buttons pop colour
- [x] Destinations: video cards, no map
- [x] Offers: no "In development"; refined cards
- [x] Partners & About refreshed; About without "Where we work"
- [x] Contact FAQ accordions
- [x] Header progress bar visible through the whole scroll
- [x] Reduced motion: all of the above degrade to static

## Tooling: rtk (token-efficient CLI output)

rtk v1.2.1 is installed at `%USERPROFILE%\.localintk.exe` (official release, SHA-256 verified).
To route Claude Code's shell commands through it, run once in a normal terminal:

```powershell
rtk init -g
```

Then use `rtk git status`, `rtk ls`, `rtk grep …` directly. If Windows reports "Access is denied",
the unsigned binary is being blocked or scanned by Windows security; allow it there, then retry.
