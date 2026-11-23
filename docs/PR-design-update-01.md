## Summary

Implements the client's **Design Update 01** feedback (12 annotated screenshots). The task list, assumptions and acceptance criteria are in `docs/PRD-design-update-01.md` (IDs DU1-0 … DU1-12).

### What changed
- **Home intro (DU1-0, DU1-1):** clouds drift and breathe on their own. The window copy is larger and bolder, on a darker scrim. A new cursor (dot plus trailing ring, inverted against the background) replaces the faint glow-only effect.
- **Landing reel (DU1-2a):** after the descent, the hero plays the Sète, Montpellier, Paris and Nice clips side by side. The active city widens every 5 s or on hover, and the location pill updates. On phones one city fills the screen and they crossfade. Clips load only on first landing and pause when off screen.
- **Header (DU1-2b, DU1-11):** bolder links with an animated underline and a glass pill over media. The scroll progress bar is thicker and stays visible while the header is hidden (it used to disappear because it moved up with the header).
- **Chatbot (DU1-3):** animated launcher (halo, sheen, one-time greeting bubble); the halo stops once it is opened.
- **Social rail (DU1-4):** fixed on the left of every page at ≥1100 px.
- **Home cards (DU1-5):** "Explore for…" pills fill with each card's colour on hover or focus.
- **Destinations (DU1-6, DU1-8):** cards play the city clip instead of a photo; the map section is removed from that page.
- **Map and offers (DU1-7):** refined home map section and offer cards; "In development" badges removed.
- **Partners and About (DU1-9, DU1-12):** card layouts with hover states; "Where we work" removed from About.
- **FAQ (DU1-10):** each category title is a drop-down with a chevron; deep links (`#faq-2`) open their category.

### For reviewers
- **Facebook:** the client asked for it in the social rail, but there is no URL yet. It is hidden until `SITE.socials` in `build/content.mjs` gets one (listed in `CONTENT_GAPS.md`).
- **Map removal:** the map is removed from /destinations/ only and kept on Home (based on which screenshot showed the short card).
- **Badges:** only the "In development" badges are hidden; "Available" stays.
- **Reduced motion:** all new animation is off under `prefers-reduced-motion`, and videos respect Save-Data.
- **Translations:** the 2 new strings are translated into all 6 languages. `I18N_MISSING=1 npm run build` lists any untranslated strings.

## Testing
- `npm run build`: 184 pages, 0 untranslated strings; `tools/i18n-check.mjs` passes.
- Checked in the browser at 1440×860 and 375×812: intro drift, landing reel (desktop and mobile), cursor, rail, chatbot bubble, pill hover, destination videos, FAQ drop-downs, progress bar while the header is hidden, About/Partners/Offers. No console errors.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
