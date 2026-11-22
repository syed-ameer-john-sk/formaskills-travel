import { SITE, NAV, FOOTER_COLS, NOTICE, DESTINATIONS } from './content.mjs';

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- Icons (1.6px line set) ----------
const P = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  scale: '<path d="M12 4v16M6 20h12M5 8h14M7 8l-3 6a3 3 0 0 0 6 0zM17 8l-3 6a3 3 0 0 0 6 0z"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z"/><circle cx="12" cy="10" r="2.3"/>',
  chat: '<path d="M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-4 3.5v-3.5h0a1.5 1.5 0 0 1-1.5-1.5z"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
  phone: '<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
  copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5v-2a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  plane: '<path d="M21 15.5 13.5 11V5.5a1.5 1.5 0 0 0-3 0V11L3 15.5v2l7.5-2.5v4L8.5 20.5V22l3.5-1 3.5 1v-1.5l-2-1.5v-4l7.5 2.5z"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  external: '<path d="M14 4.5h5.5V10M19.5 4.5 11 13M18 14v4.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1H10"/>',
  spark: '<path d="M12 3.5 13.8 10l6.7 2-6.7 2L12 20.5 10.2 14 3.5 12l6.7-2z"/>',
  download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14"/>',
  instagram: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.8" cy="7.2" r=".6" fill="currentColor"/>',
  tiktok: '<path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.4 2.5 2.2 4.2 5 4.5"/>',
  linkedin: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M8.5 10.5v5.5M8.5 7.8v.1M12 16v-5.5M12 13c0-1.6 1-2.6 2.3-2.6s2.2.8 2.2 2.6V16"/>',
  leaf: '<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14zM5 19l7-7"/>',
  users: '<circle cx="9" cy="9" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M15.5 6.3a3 3 0 0 1 0 5.6M17.5 14.3A5.5 5.5 0 0 1 20.5 19"/>',
  building: '<path d="M5 20.5V5.5l7-2v17M12 8.5h7v12M3.5 20.5h17M8 8v.1M8 11.5v.1M8 15v.1M15.5 12v.1M15.5 15.5v.1"/>',
  handshake: '<path d="m3.5 11 4-4 4 2 2-1.5 3 .5 4 4M7.5 7l-4 4 6 6a1.5 1.5 0 0 0 2.1 0l5.9-5.9M11 13.5l2 2M13 11.5l2 2"/>',
};
export const icon = (name, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;

// ---------- Small building blocks ----------
export const btn = (href, label, kind = 'primary', extra = '') => `<a class="btn btn--${kind}" href="${href}" ${extra}><span>${label}</span>${kind === 'primary' || kind === 'light' ? icon('arrow') : ''}</a>`;
export const notice = (cls = '') => `<p class="notice ${cls}">${icon('check')}<span>${NOTICE}</span></p>`;
export const crumbs = (items) => `<nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li>${items.map(([href, l], i) => i === items.length - 1 ? `<li><span aria-current="page">${l}</span></li>` : `<li><a href="${href}">${l}</a></li>`).join('')}</ol></nav>`;

let faqSeq = 0;
export const faqList = (items, cls = '') => `<div class="faq ${cls}">${items.map(([q, a]) => {
  const id = `fq${++faqSeq}`;
  const body = a.trim().startsWith('<') ? a : `<p>${a}</p>`;
  return `<div class="faq__item"><h3 class="faq__q"><button type="button" aria-expanded="false" aria-controls="${id}" id="${id}b"><span>${q}</span><i class="faq__pm" aria-hidden="true"></i></button></h3><div class="faq__a" id="${id}" role="region" aria-labelledby="${id}b" hidden><div class="faq__inner">${body}</div></div></div>`;
}).join('')}</div>`;

export const picture = (base, alt, sizes = '(min-width: 900px) 50vw, 100vw', cls = '', eager = false) =>
  `<img class="${cls}" src="${base}-md.jpg" srcset="${base}-sm.jpg 560w, ${base}-md.jpg 820w, ${base}.jpg 1280w" sizes="${sizes}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;

// ---------- France map (projected from lon/lat) ----------
const OUTLINE = [[2.37,51.05],[1.85,50.95],[1.6,50.7],[1.6,50.2],[1.08,49.93],[0.1,49.5],[-0.3,49.33],[-1.2,49.4],[-1.6,49.65],[-1.9,49.7],[-1.6,48.8],[-1.5,48.64],[-2.0,48.65],[-3.0,48.8],[-4.0,48.7],[-4.75,48.4],[-4.5,48.1],[-4.73,48.03],[-4.1,47.8],[-3.4,47.7],[-2.8,47.5],[-2.2,47.27],[-2.0,46.95],[-1.8,46.5],[-1.15,46.15],[-1.2,45.7],[-1.05,45.5],[-1.2,44.6],[-1.45,43.9],[-1.6,43.4],[-1.78,43.36],[-1.4,43.05],[-0.7,42.85],[0.0,42.7],[0.7,42.85],[1.4,42.6],[2.0,42.45],[2.7,42.4],[3.17,42.44],[3.05,42.75],[3.05,42.9],[3.15,43.15],[3.45,43.28],[3.7,43.4],[3.93,43.53],[4.25,43.45],[4.6,43.35],[4.9,43.4],[5.35,43.28],[5.6,43.18],[5.93,43.1],[6.2,43.08],[6.65,43.25],[6.9,43.45],[7.0,43.55],[7.27,43.7],[7.5,43.78],[7.65,44.15],[6.95,44.3],[6.85,44.85],[7.05,45.2],[6.8,45.75],[7.0,45.9],[6.15,46.15],[6.1,46.4],[6.45,46.95],[6.95,47.3],[7.55,47.58],[7.6,48.0],[7.8,48.6],[8.23,48.97],[7.0,49.15],[6.6,49.45],[6.1,49.5],[5.5,49.5],[4.85,49.8],[4.8,50.15],[4.2,50.0],[3.7,50.3],[3.2,50.7],[2.6,50.85]];
const CORSICA = [[9.4,43.0],[9.55,42.6],[9.5,42.1],[9.3,41.6],[9.2,41.37],[8.8,41.5],[8.6,41.9],[8.6,42.3],[8.8,42.6],[9.3,42.75]];
export const proj = ([lon, lat]) => [Math.round((lon + 5.5) * 42 * 10) / 10, Math.round((51.6 - lat) * 60.9 * 10) / 10];
const smooth = (pts) => {
  const p = pts.map(proj);
  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 0; i < p.length; i++) {
    const p0 = p[(i - 1 + p.length) % p.length], p1 = p[i], p2 = p[(i + 1) % p.length], p3 = p[(i + 2) % p.length];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d + 'Z';
};
export const FRANCE_PATH = smooth(OUTLINE);
export const CORSICA_PATH = smooth(CORSICA);

export const franceMap = (interactive = true) => {
  const pins = DESTINATIONS.map((d, i) => {
    const [x, y] = proj([d.map.lon, d.map.lat]);
    const labelLeft = d.slug === 'sete';
    const lx = labelLeft ? x - 14 : x + 14, ly = d.slug === 'montpellier' ? y - 10 : y + 5;
    return `<g class="map__pin" data-dest="${d.slug}" transform="translate(${x} ${y})">
      <circle class="map__pulse" r="14"/><circle class="map__dot" r="6.5"/>
      <text x="${lx - x}" y="${ly - y}" text-anchor="${labelLeft ? 'end' : 'start'}">${d.name}</text></g>`;
  }).join('');
  return `<svg class="map__svg" viewBox="-20 -10 700 640" role="img" aria-label="Map of France showing Sète, Montpellier, Paris and Nice">
    <defs><pattern id="mapdots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.1"/></pattern></defs>
    <path class="map__land" d="${FRANCE_PATH}"/><path class="map__land map__land--dots" d="${FRANCE_PATH}"/>
    <path class="map__land" d="${CORSICA_PATH}"/><path class="map__land map__land--dots" d="${CORSICA_PATH}"/>
    <path class="map__route" d="" />
    ${pins}</svg>`;
};

// ---------- Logo ----------
export const logo = (cls = '') => `<img class="logo ${cls}" src="/assets/img/logo.png" width="2000" height="467" alt="Formaskills Travel">`;

// ---------- Head ----------
export const head = ({ title, desc, path, bodyClass = '', ld = '' }) => {
  const full = path === '/' ? `${title}` : `${title} | Formaskills Travel`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(full)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE.url}${path}">
<!--HREFLANG-->
<meta name="theme-color" content="#1c2246">
<meta property="og:type" content="website"><meta property="og:site_name" content="Formaskills Travel">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE.url}${path}"><meta property="og:image" content="${SITE.url}/assets/img/og.jpg"><meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap">
<link rel="stylesheet" href="/assets/css/site.css?v=__V__">
<script>document.documentElement.classList.add('js');</script>
<!--I18N-HEAD-->
${ld}
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to main content</a>`;
};

// ---------- Header ----------
export const header = (path, { overlay = false } = {}) => `
<header class="hdr ${overlay ? 'hdr--overlay' : ''}" data-hdr>
  <div class="hdr__in">
    <a class="hdr__brand" href="/" aria-label="Formaskills Travel, home" data-logo-slot>${logo()}<img class="logo logo--white" src="/assets/img/logo.png" width="2000" height="467" alt="" aria-hidden="true"></a>
    <nav class="hdr__nav" aria-label="Main">
      <ul>${NAV.map(n => `<li><a href="${n.href}" ${isActive(path, n.href) ? 'aria-current="page"' : ''}>${n.label}</a></li>`).join('')}</ul>
    </nav>
    <div class="hdr__tools">
      <!--LANG-SWITCH-->
      <button class="iconbtn" type="button" data-open="search" aria-label="Search">${icon('search')}</button>
      <button class="btn btn--primary btn--sm hdr__cta" type="button" data-open="enquire"><span>Enquire</span></button>
      <button class="iconbtn hdr__menu" type="button" data-open="menu" aria-label="Menu" aria-expanded="false" aria-controls="menu">${icon('menu')}</button>
    </div>
  </div>
  <div class="hdr__progress" aria-hidden="true"><i></i></div>
</header>
<div class="drawer" id="menu" data-panel="menu" hidden>
  <div class="drawer__scrim" data-close></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="drawer__top">${logo('logo--sm')}<button class="iconbtn" type="button" data-close aria-label="Close menu">${icon('close')}</button></div>
    <nav aria-label="Mobile"><ul class="drawer__nav">${NAV.map((n, i) => `<li style="--i:${i}"><a href="${n.href}" ${isActive(path, n.href) ? 'aria-current="page"' : ''}>${n.label}</a></li>`).join('')}</ul></nav>
    <div class="drawer__more">
      ${FOOTER_COLS.slice(0, 2).map(c => `<div><p class="drawer__h">${c.title}</p><ul>${c.links.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ul></div>`).join('')}
    </div>
    <!--LANG-LIST-->
    <div class="drawer__foot">
      <button class="btn btn--primary" type="button" data-open="enquire"><span>Enquire</span>${icon('arrow')}</button>
      <a class="drawer__contact" href="mailto:${SITE.email}">${icon('mail')}${SITE.email}</a>
      <a class="drawer__contact" href="tel:${SITE.tel}">${icon('phone')}${SITE.phone}</a>
    </div>
  </div>
</div>`;

const isActive = (path, href) => href === '/' ? path === '/' : path.startsWith(href);

// ---------- Footer & global overlays ----------
export const footer = (scripts = []) => `
<footer class="ftr">
  <div class="ftr__horizon" aria-hidden="true"></div>
  <div class="wrap ftr__in">
    <div class="ftr__brand">
      ${logo('logo--light')}
      <p class="ftr__tag">${SITE.tagline}</p>
      <ul class="ftr__contact">
        <li>${icon('mail')}<span><span class="sr-only">Email: </span><a href="mailto:${SITE.email}">${SITE.email}</a></span></li>
        <li>${icon('phone')}<span><span class="sr-only">Phone: </span><a href="tel:${SITE.tel}">${SITE.phone}</a></span></li>
        <li>${icon('clock')}<span>${SITE.hours}</span></li>
      </ul>
      <!--LANG-FOOTER-->
      <ul class="ftr__social">${SITE.socials.map(s => `<li><a href="${s.href}" target="_blank" rel="noopener" aria-label="${s.name} (opens in a new tab)">${icon(s.name.toLowerCase())}</a></li>`).join('')}</ul>
    </div>
    <nav class="ftr__cols" aria-label="Pages">
      ${FOOTER_COLS.map(c => `<div><h2 class="ftr__h">${c.title}</h2><ul>${c.links.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ul></div>`).join('')}
    </nav>
  </div>
  <div class="wrap ftr__base"><p>${SITE.company}</p><p>${NOTICE}</p></div>
</footer>

<div class="modal" data-panel="enquire" hidden>
  <div class="modal__scrim" data-close></div>
  <div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="enq-title">
    <button class="iconbtn modal__x" type="button" data-close aria-label="Close">${icon('close')}</button>
    <h2 id="enq-title" class="modal__title">Enquire</h2>
    <p class="modal__lead">Who is this enquiry for?</p>
    <div class="enq__who" role="radiogroup" aria-label="Who is this enquiry for?">
      <button type="button" role="radio" aria-checked="true" data-who="me">${icon('users')}<span>For me</span></button>
      <button type="button" role="radio" aria-checked="false" data-who="org">${icon('building')}<span>For my organisation</span></button>
      <button type="button" role="radio" aria-checked="false" data-who="partner">${icon('handshake')}<span>Become a partner</span></button>
    </div>
    <div class="enq__ways">
      <a class="enq__way" data-enq-link="plan" href="/plan-your-stay/?for=me">${icon('compass')}<span><b>Plan my project and prepare my enquiry</b><small>A few optional questions, then we prepare your email.</small></span></a>
      <a class="enq__way" data-enq-link="write" href="/contact/#write">${icon('mail')}<span><b>Write an email</b><small>Describe your project in your own words.</small></span></a>
    </div>
    <div class="enq__other">
      <p class="enq__h">Other ways to reach us</p>
      <p><span class="sr-only">Email: </span><a href="mailto:${SITE.email}">${SITE.email}</a> · <span class="sr-only">Phone: </span><a href="tel:${SITE.tel}">${SITE.phone}</a></p>
      <p class="muted">${SITE.hours}</p>
    </div>
    <p class="fine">${NOTICE} We use your details only to reply to your enquiry. <a href="/legal/privacy/">Privacy notice</a></p>
  </div>
</div>

<div class="modal modal--search" data-panel="search" hidden>
  <div class="modal__scrim" data-close></div>
  <div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="find-title">
    <button class="iconbtn modal__x" type="button" data-close aria-label="Close">${icon('close')}</button>
    <h2 id="find-title" class="modal__title">What are you looking for?</h2>
    <form class="search__form" action="/search/" role="search" data-search-form>
      <label class="sr-only" for="q-global">Search</label>
      ${icon('search')}<input id="q-global" name="q" type="search" autocomplete="off" placeholder="For example: Sète, Erasmus+, au pair, courses" data-search-input>
    </form>
    <ol class="search__results" data-search-results aria-live="polite"></ol>
  </div>
</div>

<div class="ai" data-ai>
  <button class="ai__launch" type="button" data-ai-toggle aria-expanded="false" aria-controls="ai-panel" aria-label="Open Formaskills AI, the assistant">${icon('spark')}<span>Ask</span></button>
  <section class="ai__panel" id="ai-panel" aria-labelledby="ai-title" hidden>
    <header class="ai__head"><h2 id="ai-title">Formaskills AI</h2><button class="iconbtn" type="button" data-ai-toggle aria-label="Close assistant">${icon('close')}</button></header>
    <p class="ai__note">Answers come from the information on this website. For anything specific to your project, our team replies personally.</p>
    <div class="ai__log" data-ai-log aria-live="polite"></div>
    <div class="ai__chips" data-ai-chips></div>
    <form class="ai__form" data-ai-form><label class="sr-only" for="ai-q">Your question</label><input id="ai-q" autocomplete="off" placeholder="Ask about courses, Erasmus+, destinations…"><button class="iconbtn" aria-label="Send">${icon('arrow')}</button></form>
  </section>
</div>
<div class="toast" role="status" aria-live="polite" data-toast></div>

<script src="/assets/vendor/lenis.min.js" defer></script>
<script src="/assets/js/birds.js?v=__V__" defer></script>
<script src="/assets/js/site.js?v=__V__" defer></script>
${scripts.map(s => `<script src="${s}?v=__V__" defer></script>`).join('\n')}
</body>
</html>`;

// ---------- Page shell helpers ----------
export const pageHero = ({ crumb, title, lead = [], actions = '', media = '', cls = '' }) => `
<section class="phero ${cls}">
  <div class="wrap phero__grid">
    <div class="phero__text">
      ${crumb ? crumbs(crumb) : ''}
      <h1 class="phero__title" data-split>${title}</h1>
      ${lead.map(p => `<p class="lead">${p}</p>`).join('')}
      ${actions ? `<div class="actions">${actions}</div>` : ''}
    </div>
    ${media ? `<div class="phero__media">${media}</div>` : ''}
  </div>
</section>`;

export const ctaBand = ({ title = 'What if your next chapter started here?', text = 'A goal, a wish or just an idea: let us shape a programme around you.', actions } = {}) => `
<section class="cta-band" data-cta-band>
  <div class="cta-band__sky" aria-hidden="true"><div class="cta-band__sun"></div><canvas class="cta-band__birds" data-birds="6"></canvas></div>
  <div class="wrap cta-band__in">
    <h2 class="cta-band__title">${title}</h2>
    <p class="cta-band__text">${text}</p>
    <div class="actions">${actions || `${btn('/plan-your-stay/', 'Plan your project', 'light')}${btn('/contact/', 'Contact us', 'ghost-light')}`}</div>
    ${notice('notice--light')}
  </div>
</section>`;
