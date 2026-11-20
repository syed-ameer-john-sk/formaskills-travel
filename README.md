# Formaskills Travel · Web Application & Architecture Package

**Entity:** FORMASKILLS TRAVEL SAS (SIREN `990 746 430` · RCS Montpellier)  
**Operational Hub:** 6 rue Voltaire, 34200 Sète, France  
**Licensing:** Atout France `IM034230008` · Erasmus+ PIC `8991204`  
**Contact Desk:** `contact.skillstravel@gmail.com` · `+33 9 75 46 22 81`  
**Production URL:** [https://formaskills-website-package.vercel.app](https://formaskills-website-package.vercel.app)

---

## 1. Package Contents & Directory Structure

```text
formaskills-website-package/
├── index.html                      # Production standalone responsive web experience (7-language i18n, flight engine, booking modals)
├── 404.html                        # Branded editorial 404 fallback page
├── sitemap.xml                     # Multilingual XML sitemap for search indexing
├── robots.txt                      # Search engine crawler directives
├── _headers                        # Hardened HTTP security headers (CSP, HSTS, X-Frame-Options)
├── vercel.json                     # Vercel deployment configuration
├── README.md                       # Architecture & deployment documentation
├── docs/                           # Product specifications & confirmed client knowledge base
│   ├── Formaskills_Travel_PRD.md
│   └── CLIENT_CONFIRMED_KNOWLEDGE_BASE.md
└── assets/
    └── img/                        # High-resolution destination & brand source photography
```

---

## 2. Key Architecture Features

1. **Articulated Flight Engine & ScrollTrigger Synchronization**:
   - Dynamic Mediterranean seagull flight animation with dynamic wing flexion and golden horizon contrail.
   - Smoothly guides the visitor from the Hero header through **Section 2 (Places: Sète $\rightarrow$ Montpellier $\rightarrow$ Paris)**.
   - Fully optimized for both desktop widescreen viewports and mobile smartphones (390px - 480px) without obstruction of interactive controls.

2. **Full 7-Language Dynamic Internationalization (i18n)**:
   - Instant zero-reload language switching across **English (`en`)**, **Français (`fr`)**, **Español (`es`)**, **Deutsch (`de`)**, **Italiano (`it`)**, **Polski (`pl`)**, and **Simplified Chinese (`zh`)**.
   - Translates all headers, CTAs, destination highlights, pricing cards, and interactive forms.

3. **Schema.org Rich Semantic Data**:
   - Structured JSON-LD microdata for `TravelAgency`, `EducationalOrganization`, `LocalBusiness`, and `FAQPage` for search engine rich snippets.

---

## 3. Running & Deploying Locally or in Production

### Option A: Local Preview
Run any static HTTP server from the package root:
```bash
python -m http.server 8080
```
Then visit `http://localhost:8080` in any modern browser.

### Option B: Production Deployment (Vercel)
```bash
vercel --prod
```
The included `_headers` and `vercel.json` automatically apply security policies, clean URLs, and caching.
