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

No dependencies: Node 20+ is enough.

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
| `legacy/` | The previous single-page build, kept for reference (includes its uncommitted edits). |
| `docs/source-snapshot/` | Saved copies of source pages used for content extraction. |

## Behaviour notes

- Enquiries open the visitor’s email app; nothing is sent or stored by the website (matches the privacy notice).
- “Formaskills AI” answers from the site’s own FAQ and content, offline. Connecting a real AI service would need the
  processor named in the privacy notice first.
- Reduced-motion users get a still window view instead of the flight; “Skip intro” is always available.
- Google Maps on the contact page loads only after the visitor chooses to show it.

## Deploy

Vercel: `vercel.json` runs `node build/build.mjs` and serves `site/`. Netlify: build command `npm run build`,
publish directory `site` (`_headers` is copied).

## Before launch

- Legal notices still contain the source site’s placeholders (share capital, publication manager, host).
- Privacy notice placeholders (AI provider, processors, retention) need the client’s answers.
- `robots.txt` points to `formaskillstravel.com` while canonical URLs use `formaskills-travel.fr` — confirm the domain.
