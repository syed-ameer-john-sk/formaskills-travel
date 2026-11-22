# Formaskills Travel — website

Animation-led website for Formaskills Travel. The home page opens with a scroll-driven flight:
the logo flies to the header, the view moves into an aircraft window, then descends through the clouds
(“France begins before you land.”) towards Sète, with birds and the coast coming closer before the page continues.

All content comes from https://skillstravelscontent.netlify.app/en/ (every page and section is included).

## Run locally

```
npm start          # builds into site/ and serves http://localhost:5173
npm run build      # build only
```

The site itself has no dependencies: Node 20+ is enough. Playwright and Lighthouse are dev-only
dependencies used by the QA script (`npm install` once to use it).

## Structure

| Path | What it is |
| --- | --- |
| `build/content.mjs` | All site copy and data (destinations, services, FAQs, partners, team…). Edit text here. |
| `build/pages.mjs` | Page templates for the 27 pages. |
| `build/layout.mjs` | Header, footer, enquiry dialog, search, assistant, France map, shared blocks. |
| `build/build.mjs` | Static generator → `site/` (also writes search index, assistant knowledge base, sitemap). |
| `build/planner-data.json` | Question set for “Plan my project” (from the original site). |
| `assets/css/site.css` | Design system and all styles. |
| `assets/js/flight.js` | Home-page flight sequence (sticky stage, canvas clouds and birds, SVG cabin window). |
| `assets/js/site.js` | Navigation, dialogs, tabs, FAQ, map, forms, search, assistant, smooth scroll. |
| `assets/js/planner.js` | Guided enquiry builder → prepares an email (mailto), copy or .txt download. |
| `assets/js/motion.js` | Scroll reveals, self-drawing timeline, video story cards, sticky Enquire, desktop cursor glow and magnetic buttons. |
| `assets/video/` | City clips (`<city>.mp4`, `<city>.webm`, `<city>-poster.jpg`). |
| `build/i18n.mjs`, `i18n/` | Translation engine and the 7 language files — see `TRANSLATION_REVIEW.md`. |
| `build/testimonials.json` | Testimonials (empty: the section stays hidden until real quotes are added). |
| `tools/` | `i18n-*.mjs` (translations), `compress-video.sh` (clips), `qa.mjs` (screenshots and checks). |
| `qa/` | QA report, screenshots and Lighthouse reports. |
| `legacy/` | The previous single-page build, kept for reference (includes its uncommitted edits). |
| `docs/source-snapshot/` | Saved copies of source pages used for content extraction. |

## Behaviour notes

- Enquiries open the visitor’s email app; nothing is sent or stored by the website (matches the privacy notice).
- “Formaskills AI” answers from the site’s own FAQ and content, offline. Connecting a real AI service would need the
  processor named in the privacy notice first.
- Reduced-motion users get a still window view instead of the flight; “Skip intro” is always available.
- Google Maps on the contact page loads only after the visitor chooses to show it.

## Destination videos

One portrait clip per city is used on the home page ("Our destinations in motion") and on each destination page.
To add or replace a clip, compress it first (H.264 MP4 + VP9 WebM, no audio, 1080 px wide, plus a poster):

```
tools/compress-video.sh ~/Downloads/Sete.mp4 sete
```

which runs these ffmpeg commands (install ffmpeg first, e.g. `winget install ffmpeg`):

```
ffmpeg -i Sete.mp4 -an -vf "scale='if(gt(iw,ih),min(1920,iw),min(1080,iw))':-2,fps=30" -c:v libx264 -preset slow -crf 27 -profile:v high -pix_fmt yuv420p -movflags +faststart assets/video/sete.mp4
ffmpeg -i Sete.mp4 -an -vf "scale='if(gt(iw,ih),min(1920,iw),min(1080,iw))':-2,fps=30" -c:v libvpx-vp9 -b:v 0 -crf 46 -row-mt 1 -deadline good -cpu-used 4 assets/video/sete.webm
ffmpeg -ss 1 -i Sete.mp4 -frames:v 1 -vf "scale='if(gt(iw,ih),1280,720)':-2" -q:v 4 assets/video/sete-poster.jpg
```

Aim for under 8 MB per file (raise `-crf` to make files smaller). Clips autoplay muted and looped only while on
screen; visitors with reduced motion or data saver see the poster. To add a city, add it to `DESTINATIONS` in
`build/content.mjs` (the map pin, tab, panel and video card are generated from that list) and add its files here.
If a clip needs credits or a licence notice, add them to the photo credits page.

## Enquiry forms

The contact page and the Enquire dialog share one form (`enquiryForm()` in `build/layout.mjs`). Every enquiry goes
through `submitEnquiry(data)` in `assets/js/site.js`, which today opens the visitor's email app (mailto). To connect a
backend (Formspree, Resend, a Vercel serverless function…): set `ENQUIRY_ENDPOINT` in that function, allow the
endpoint's origin in `connect-src` of the CSP (`vercel.json` and `_headers`), and have the endpoint reject requests
whose `website` field (the honeypot) is not empty. If the request fails, the email fallback still opens.

## QA

```
npm start                       # in one terminal
node tools/qa.mjs               # screenshots of every language homepage at 360/390/768/1024/1440 + checks
node tools/i18n-check.mjs       # missing translations / English left on translated pages
```

Results and Lighthouse reports are summarised in `qa/QA_REPORT.md`.

## Deploy

Vercel: `vercel.json` runs `node build/build.mjs` and serves `site/`. Netlify: build command `npm run build`,
publish directory `site` (`_headers` is copied).

## Before launch

- Legal notices still contain the source site’s placeholders (share capital, publication manager, host).
- Privacy notice placeholders (AI provider, processors, retention) need the client’s answers.
- `robots.txt` and canonical URLs use `formaskills-travel.fr` — confirm this is the final domain.
- See `CONTENT_GAPS.md` for content the site is still waiting for.
