// Static site generator for Formaskills Travel. No dependencies: `node build/build.mjs`
//
// Every page is generated once in English from the templates, then for each of the 7 languages:
// translated through /i18n/<lang>.json (see build/i18n.mjs), localised (lang, canonical, hreflang,
// og:locale, language-prefixed links) and written to site/<lang>/…
// `--en-only` builds just the English pages (used by tools/i18n-sync.mjs to collect strings).
import { mkdir, writeFile, readFile, cp, rm, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES } from './pages.mjs';
import { head, header, footer, icon } from './layout.mjs';
import * as C from './content.mjs';
import { LANGS, LANG_NAMES, LOCALES, HTML_LANG, translatePage, plain } from './i18n.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'site');
const V = Date.now().toString(36);
const EN_ONLY = process.argv.includes('--en-only');
const BUILD_LANGS = EN_ONLY ? ['en'] : LANGS;

const strip = (html) => html.replace(/<script[\s\S]*?<\/script>|<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();

// ---------- dictionaries ----------
const dicts = {};
for (const L of LANGS) {
  if (L === 'en') continue;
  try { dicts[L] = JSON.parse(await readFile(join(ROOT, 'i18n', `${L}.json`), 'utf8')); } catch { dicts[L] = {}; }
}
const tr = (L, s) => { if (L === 'en') return s; const v = dicts[L]?.[plain(s)]; return v ? plain(v) : s; };

// strings used inside the JavaScript (T('…') calls) → shipped per language as window.FS_T
const jsKeys = new Set();
for (const f of await readdir(join(ROOT, 'assets/js'))) {
  if (!f.endsWith('.js')) continue;
  const src = await readFile(join(ROOT, 'assets/js', f), 'utf8');
  for (const m of src.matchAll(/\bT\(\s*'((?:[^'\\]|\\.)*)'/g)) jsKeys.add(m[1].replace(/\\'/g, "'"));
}

// ---------- language UI (switcher, mobile list, footer list, hreflang) ----------
const pageUrl = (L, path) => `/${L}${path}`;
const langSwitch = (L, path) => `
      <div class="lang" data-lang>
        <button class="lang__btn" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="lang-menu" aria-label="Change language"><span class="lang__code" translate="no" aria-hidden="true">${L.toUpperCase()}</span>${icon('chevron')}</button>
        <ul class="lang__menu" id="lang-menu" role="list" hidden>
          ${LANGS.map(l => `<li><a href="${pageUrl(l, path)}" hreflang="${l}" lang="${HTML_LANG[l]}" translate="no" data-lang-code="${l}" ${l === L ? 'aria-current="true"' : ''}><b>${l.toUpperCase()}</b><span>${LANG_NAMES[l]}</span></a></li>`).join('')}
        </ul>
      </div>`;
const langList = (L, path, cls) => `<ul class="${cls}" role="list">${LANGS.map(l => `<li><a href="${pageUrl(l, path)}" hreflang="${l}" lang="${HTML_LANG[l]}" translate="no" data-lang-code="${l}" ${l === L ? 'aria-current="true"' : ''}>${LANG_NAMES[l]}</a></li>`).join('')}</ul>`;
const hreflang = (path) => LANGS.map(l => `<link rel="alternate" hreflang="${HTML_LANG[l]}" href="${C.SITE.url}${pageUrl(l, path)}">`).join('\n')
  + `\n<link rel="alternate" hreflang="x-default" href="${C.SITE.url}${pageUrl('en', path)}">`;
const i18nHead = (L) => {
  const T = {};
  if (L !== 'en') for (const k of jsKeys) { const v = dicts[L]?.[plain(k)]; if (v) T[k] = v; }
  const zh = L === 'zh' ? '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap">\n' : '';
  return `${zh}<script>window.FS_LANG=${JSON.stringify(L)};window.FS_BASE=${JSON.stringify('/' + L)};window.FS_T=${JSON.stringify(T)};try{localStorage.setItem('fs-lang',${JSON.stringify(L)})}catch(e){}</script>`;
};

// ---------- localise a generated page ----------
function localise(html, L, path) {
  html = html
    .replace('<!--HREFLANG-->', hreflang(path))
    .replace('<!--I18N-HEAD-->', i18nHead(L))
    .replace('<!--LANG-SWITCH-->', langSwitch(L, path))
    .replace('<!--LANG-LIST-->', `<div class="drawer__langs"><p class="drawer__h">Language</p>${langList(L, path, 'drawer__langlist')}</div>`)
    .replace('<!--LANG-FOOTER-->', `<div class="ftr__langs"><p class="ftr__lang">Write to us in your language.</p>${langList(L, path, 'ftr__langlist')}</div>`);
  return html;
}
function finalise(html, L, path) {
  return html
    .replace('<html lang="en">', `<html lang="${HTML_LANG[L]}">`)
    .replace('<meta property="og:locale" content="en_GB">', `<meta property="og:locale" content="${LOCALES[L]}">${LANGS.filter(l => l !== L).map(l => `<meta property="og:locale:alternate" content="${LOCALES[l]}">`).join('')}`)
    .replace(`<link rel="canonical" href="${C.SITE.url}${path}">`, `<link rel="canonical" href="${C.SITE.url}${pageUrl(L, path)}">`)
    .replace(`<meta property="og:url" content="${C.SITE.url}${path}">`, `<meta property="og:url" content="${C.SITE.url}${pageUrl(L, path)}">`)
    // internal links → this language (assets, already-prefixed and protocol-relative links untouched)
    .replace(/(\s(?:href|action)=")\/(?!\/|assets\/|(?:en|fr|es|de|it|zh|pl)\/)([^"]*)"/g, `$1/${L}/$2"`)
    .replaceAll('__V__', V);
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const orgLd = (L) => JSON.stringify({
  '@context': 'https://schema.org', '@type': ['Organization', 'TravelAgency'], name: 'Formaskills Travel', legalName: 'FORMASKILLS TRAVEL SAS',
  url: `${C.SITE.url}/${L}/`, logo: `${C.SITE.url}/assets/img/logo.png`, email: C.SITE.email, telephone: C.SITE.phone, inLanguage: HTML_LANG[L],
  address: { '@type': 'PostalAddress', streetAddress: '6 rue Voltaire', postalCode: '34200', addressLocality: 'Sète', addressCountry: 'FR' },
  sameAs: C.SITE.socials.map(s => s.href),
});

const missing = Object.fromEntries(LANGS.map(l => [l, new Set()]));
const index = Object.fromEntries(LANGS.map(l => [l, []]));
for (const p of PAGES) {
  const body = p.body();
  const en = head({ title: p.title, desc: p.desc, path: p.path, bodyClass: p.home ? 'is-home' : '', ld: p.home ? '<!--LD-->' : '' })
    .replace('<meta name="description"', p.noindex ? '<meta name="robots" content="noindex"><meta name="description"' : '<meta name="description"')
    + header(p.path, { overlay: !!p.home })
    + `<main id="main" tabindex="-1">${body}</main>`
    + footer(p.scripts || []);
  for (const L of BUILD_LANGS) {
    if (p.file && L !== 'en') continue;                      // a single 404 page at the root
    let html = localise(en, L, p.file ? '/en/' : p.path);
    if (L !== 'en') html = translatePage(html, dicts[L], missing[L]);
    html = html.replace('<!--LD-->', `<script type="application/ld+json">${orgLd(L)}</script>`);
    html = p.file ? html.replaceAll('__V__', V) : finalise(html, L, p.path);
    const file = p.file ? join(OUT, p.file) : join(OUT, L, p.path, 'index.html');
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);
    if (!p.noindex) {
      const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
      const heads = [...main.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/g)].map(m => strip(m[1])).filter(Boolean);
      const title = strip((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '').replace(/ \| Formaskills Travel$/, '');
      index[L].push({ u: pageUrl(L, p.path), t: title, h: [...new Set(heads)].slice(0, 40), x: strip(main).slice(0, 6000) });
    }
  }
}

// ---------- assistant knowledge base, per language ----------
function kbFor(L) {
  const t = (s) => tr(L, s);
  const kb = [];
  const add = (q, a, u) => kb.push({ q, a: strip(a), u: pageUrl(L, u) });
  C.FAQ_CONTACT.forEach(c => c.items.forEach(([q, a]) => add(t(q), t(a), `/contact/#${c.id}`)));
  C.FAQ_ME.forEach(([q, a]) => add(t(q), t(a), '/for-me/'));
  C.ORG_SERVICES.forEach(s => { s.faq.forEach(([q, a]) => add(t(q), t(a), `/for-organisations/#${s.id}`)); add(t(s.t), `${t(s.intro[0])} ${t('Who it suits')}: ${t(s.suits)} ${t(s.good)}`, `/for-organisations/#${s.id}`); });
  C.PARTNER_FAQ.forEach(([q, a]) => add(t(q), t(a), '/partners/'));
  C.DESTINATIONS.forEach(d => add(`${d.name} — ${t(d.tag)}`, `${t(d.summary)} ${t(`Recommended period ${d.period}`)}. ${t(d.best)}`, `/destinations/${d.slug}/`));
  C.ME_OFFERS.forEach(o => add(t(o.t), `${t(o.short)} ${o.details.map(([k, v]) => `${t(k)}: ${t(v)}`).join(' ')}`, '/what-we-offer/#me'));
  add(t('Other ways to reach us'), `${C.SITE.email} · ${C.SITE.phone}. ${t(C.SITE.hours)} ${C.SITE.address}. ${t('Please arrange your visit with the team. Classes and activities do not always take place at this address.')}`, '/contact/');
  add(t('Au pair and host-family stays'), t('Our au pair and host-family network is in development. Registration does not guarantee a match or a placement.'), '/au-pair-and-host-families/');
  add(t('Host international trainees & professionals'), t('Every project is discussed individually. Profile, objectives, tasks, duration, working conditions, supervision and documents are agreed before a placement is confirmed.'), '/partners/#host');
  return kb;
}

// ---------- assets, data, root files ----------
await cp(join(ROOT, 'assets'), join(OUT, 'assets'), { recursive: true, filter: (s) => !/\.(webp)$/.test(s) || /hero_clouds|dest_|-hq.webp$/.test(s) });
await mkdir(join(OUT, 'assets/data'), { recursive: true });
let kbCount = 0;
for (const L of BUILD_LANGS) {
  await writeFile(join(OUT, `assets/data/search-${L}.json`), JSON.stringify(index[L]));
  const kb = kbFor(L); kbCount = kb.length;
  await writeFile(join(OUT, `assets/data/kb-${L}.json`), JSON.stringify(kb));
  const P = JSON.parse(await readFile(join(ROOT, 'i18n/planner', `${L}.json`), 'utf8'));
  await writeFile(join(OUT, `assets/data/planner-${L}.json`), JSON.stringify(P));
}
for (const f of ['robots.txt', '_headers']) await cp(join(ROOT, f), join(OUT, f)).catch(() => {});

// root: send visitors to their saved language, else their browser language, else English
await writeFile(join(OUT, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Formaskills Travel</title>
<link rel="canonical" href="${C.SITE.url}/en/">${'\n' + hreflang('/')}
<script>(function(){var L=${JSON.stringify(LANGS)},s=null;try{s=localStorage.getItem('fs-lang')}catch(e){}
if(L.indexOf(s)<0){s='en';var n=navigator.languages||[navigator.language||'en'];for(var i=0;i<n.length;i++){var c=String(n[i]).slice(0,2).toLowerCase();if(L.indexOf(c)>=0){s=c;break}}}
location.replace('/'+s+'/'+location.search+location.hash)})();</script>
<noscript><meta http-equiv="refresh" content="0;url=/en/"></noscript>
</head><body><p><a href="/en/">Formaskills Travel</a></p></body></html>`);

const today = new Date().toISOString().slice(0, 10);
const urls = PAGES.filter(p => !p.noindex).flatMap(p => BUILD_LANGS.map(L => `  <url><loc>${C.SITE.url}${pageUrl(L, p.path)}</loc><lastmod>${today}</lastmod>${LANGS.map(l => `<xhtml:link rel="alternate" hreflang="${HTML_LANG[l]}" href="${C.SITE.url}${pageUrl(l, p.path)}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${C.SITE.url}${pageUrl('en', p.path)}"/></url>`));
await writeFile(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);

const count = (await readdir(OUT, { recursive: true })).filter(f => f.endsWith('.html')).length;
const miss = BUILD_LANGS.filter(l => l !== 'en').map(l => `${l}:${missing[l].size}`).join(' ');
console.log(`Built ${count} pages in ${BUILD_LANGS.length} language(s) → site/  (assistant entries: ${kbCount}, JS strings: ${jsKeys.size})${miss ? `  untranslated strings → ${miss}` : ''}`);
