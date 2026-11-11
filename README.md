# Formaskills Travel · Web Application & Architecture Package

**Entity:** FORMASKILLS TRAVEL SAS (SIREN `990 746 430` · RCS Montpellier)  
**Operational Hub:** 6 rue Voltaire, 34200 Sète, France  
**Contact Desk:** `contact.skillstravel@gmail.com` · `+33 9 75 46 22 81`  

---

## 1. Package Contents & Directory Structure

```text
formaskills-website-package/
├── index.html                      # Production modular HTML entry point (links external CSS, JS, and images)
├── index.standalone.html           # Self-contained single-file bundle (all images base64-inlined + scripts embedded)
├── 404.html                        # Custom fallback 404 error page
├── _headers                        # Security & caching HTTP headers (CSP, HSTS, X-Frame-Options)
├── robots.txt                      # Search crawler directives
├── README.md                       # Deployment & architecture documentation
├── docs/
│   └── Formaskills_Travel_PRD.md   # Complete Product Requirements Document (PRD)
└── assets/
    ├── css/
    │   └── styles.css              # Custom luxury travel styles, glassmorphism & map pin animations
    ├── js/
    │   └── app.js                  # Complete application logic + 7-language i18n engine + Experience Builder
    ├── img/                        # Optimized destination photography & brand assets
    │   ├── logo.png
    │   ├── hero.jpg
    │   ├── sete.jpg
    │   ├── montpellier.jpg
    │   ├── paris.jpg
    │   ├── nice.jpg
    │   ├── favicon.svg
    │   └── og.jpg
    └── kb/                         # Static localized knowledge bases for offline search & AI grounding
        ├── en.json
        ├── fr.json
        ├── es.json
        ├── de.json
        ├── it.json
        ├── pl.json
        └── zh.json
```

---

## 2. Key Features Included

1. **Full 7-Language Dynamic Internationalization (i18n)**:
   - Instant, zero-reload language switching across **English (`en`)**, **Français (`fr`)**, **Español (`es`)**, **Deutsch (`de`)**, **Italiano (`it`)**, **Polski (`pl`)**, and **Simplified Chinese (`zh`)**.
   - Translates all navigation links, hero headlines, smart search filters, destination cards, SVG map pins, program verticals, the 12-sector Erasmus+ Job Shadowing matrix, Experience Builder steps, input placeholders, toast notifications, FAQ accordions, and AI Concierge responses.
2. **Interactive 4-Step Experience Builder ("Plan Your Project")**:
   - Captures target persona (*For Myself/Family*, *For My Organisation*, *Become a Partner*), participant headcount, destination choices, travel timeframe, duration, and required coordination modules.
   - Automatically normalizes selections into a standardized English proposal brief for the Sète coordination team, with one-click **Copy Brief**, **Download `.txt`**, and **Email to Team (`mailto:`)** actions.
3. **Interactive SVG France Map & Destination Showcase**:
   - Clickable city pins and filter tabs for **Sète (Operational HQ)**, **Montpellier**, **Paris**, and **Nice**, synchronized with destination cards.
4. **Formaskills AI Concierge Drawer**:
   - Slide-over conversational assistant with quick-prompt chips, privacy disclaimers, and localized responses for Sète activities, Erasmus+ Key Action 1 hosting, 12-sector job shadowing, and flight policies.

---

## 3. Running & Deploying Locally or in Production

### Option A: Local Development Server
Run any static HTTP server from the root of this folder:
```bash
python3 -m http.server 8080
```
Then open `http://localhost:8080` in your browser.

### Option B: Zero-Server Single File (`index.standalone.html`)
If you want to share or preview the entire site as a single portable file without hosting a folder structure, open `index.standalone.html` directly in any modern browser.

### Option C: Static Cloud Hosting (Cloudflare Pages, Netlify, Vercel)
Upload the folder directly to your static host. The included `_headers` file automatically configures strict Content-Security-Policy (CSP) and 1-year immutable caching for `/assets/*`.
