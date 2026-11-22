# Map effect — investigation and feasibility (PRD §6)

## What the reference site does

Inspected in a browser at https://skillstravelscontent.netlify.app/en/ ("Explore our destinations on the map").

| Aspect | Finding |
|---|---|
| Technique | One inline **SVG** (`viewBox 0 0 493 469`), no map library (no Leaflet, Mapbox, D3 or GSAP), no canvas. |
| Outline | France and Corsica as `<path>`s; the outline **draws itself** on first view (`stroke-dasharray` / `stroke-dashoffset` animation). |
| Regions | Three hand-drawn region shapes (Occitanie, Île-de-France, Provence-Alpes-Côte d'Azur) filled with a **diagonal hatch** `<pattern>`, clipped to the France outline. The selected city's region is highlighted. |
| Markers | Per city: invisible large hit circle, a ring and a dot; markers appear one after another (staggered `transition-delay`). The selected marker turns orange with its ring visible. |
| Details | A card beside the map (photo, region, description, highlights, recommended period, link) slides in on change. |
| Code | Plain CSS and a small vanilla script in the site's `main.js`. |

## Feasibility

- **Technically:** straightforward — it is standard SVG, CSS and a few lines of JavaScript; it works on any static site,
  on touch screens and with a keyboard, and costs almost nothing in performance.
- **Legally / assets:** the reference is the owner's own site, but we did **not** copy its files, paths or code. The
  effect was rebuilt from our existing map (our own France outline projected from longitude/latitude). Nothing is
  hotlinked. Owner action: confirm the reference site's code and drawings belong to the business if they ever want the
  exact region shapes reused.
- **Region shapes:** our map has no administrative region data. Instead of hand-drawing regions, the hatched highlight
  is a soft circular area centred on the selected city, clipped to France. It gives the same visual cue and works for
  any destination added later without drawing new shapes.

## What was built (home page and destinations page)

- Outline draws itself when the map scrolls into view; markers then pop in one after another.
- Hatched area (brand amber) glides to the selected city; the existing curved route from Sète and the pulsing marker
  are kept.
- A larger invisible hit area around each marker (about four times the dot's size) for touch.
- The destination tabs above the map are the keyboard and list-style fallback: arrow keys, Home/End, and they work
  without the map. Markers stay mouse/touch targets (`tabindex="-1"`) so keyboard users do not meet every destination
  twice.
- The details panel container has `aria-live="polite"`, so the newly selected destination is announced.
- Reduced motion: no drawing or pop-in; the final map is shown.
- **Data-driven:** pins, tabs, panels and video cards are generated from `DESTINATIONS` in `build/content.mjs`
  (name, longitude/latitude, texts, photo). Adding an entry there adds the destination everywhere.
