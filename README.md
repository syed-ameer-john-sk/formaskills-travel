# Formaskills Travel — Enterprise Web Package

## Project Structure
- `index.html` — Semantic, accessible, CSP-ready landing page with JSON-LD & hreflang SEO
- `css/styles.css` — Disciplined surface tokens, GPU-only scroll progress, flicker-free `100svh` flight layer, `content-visibility: auto`, and CSS Grid FAQ accordions
- `js/i18n.js` — Full 7-language dictionary (`EN`, `FR`, `ES`, `DE`, `IT`, `PL`, `ZH`) extracted from the original build
- `js/app.js` — Zero-idle seagull flight engine (`IntersectionObserver` + `visibilitychange`), desktop-only Lenis smooth scroll, GSAP `matchMedia` choreography, and centralized `data-action` delegation
- `assets/` — 5 extracted external WebP photographs (`hero-clouds.webp`, `sete-harbour.webp`, `montpellier-peyrou.webp`, `paris-seine.webp`, `sete-students.webp`)
- `robots.txt` & `sitemap.xml` — Production SEO configuration

## Local Preview
Unzip the archive and open `index.html` directly in any browser (or serve via `npx serve .`).

## Production Deployment Checklist
1. Compile Tailwind CSS statically via Vite/PostCSS and remove the `cdn.tailwindcss.com` script tag.
2. Add Subresource Integrity (`integrity="..."`) hashes or self-host GSAP and Lenis.
3. Connect `#plannerForm` to your backend API with Cloudflare Turnstile and CRM routing.
4. Publish dedicated `/mentions-legales`, `/cgv`, and `/privacy` pages linked from the footer.
