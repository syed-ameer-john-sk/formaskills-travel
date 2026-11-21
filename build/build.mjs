// Static site generator for Formaskills Travel. No dependencies: `node build/build.mjs`
import { mkdir, writeFile, readFile, cp, rm, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES } from './pages.mjs';
import { head, header, footer } from './layout.mjs';
import * as C from './content.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'site');
const V = Date.now().toString(36);

const strip = (html) => html.replace(/<script[\s\S]*?<\/script>|<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();

const orgLd = JSON.stringify({
  '@context': 'https://schema.org', '@type': 'Organization', name: 'Formaskills Travel', legalName: 'FORMASKILLS TRAVEL SAS',
  url: C.SITE.url, logo: `${C.SITE.url}/assets/img/logo.png`, email: C.SITE.email, telephone: C.SITE.phone,
  address: { '@type': 'PostalAddress', streetAddress: '6 rue Voltaire', postalCode: '34200', addressLocality: 'Sète', addressCountry: 'FR' },
  sameAs: C.SITE.socials.map(s => s.href),
});

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const index = [];
for (const p of PAGES) {
  const body = p.body();
  const html = head({ title: p.title, desc: p.desc, path: p.path, bodyClass: p.home ? 'is-home' : '', ld: p.home ? `<script type="application/ld+json">${orgLd}</script>` : '' })
    .replace('<meta name="description"', p.noindex ? '<meta name="robots" content="noindex"><meta name="description"' : '<meta name="description"')
    + header(p.path, { overlay: !!p.home })
    + `<main id="main" tabindex="-1">${body}</main>`
    + footer(p.scripts || []);
  const file = p.file ? join(OUT, p.file) : join(OUT, p.path, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html.replaceAll('__V__', V));
  if (!p.noindex) {
    const heads = [...body.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/g)].map(m => strip(m[1])).filter(Boolean);
    index.push({ u: p.path, t: p.title.replace(' | Formaskills Travel', ''), h: [...new Set(heads)].slice(0, 40), x: strip(body).slice(0, 6000) });
  }
}

// Assistant knowledge base: every Q&A on the site + key facts.
const kb = [];
const add = (q, a, u) => kb.push({ q, a: strip(a), u });
C.FAQ_CONTACT.forEach(c => c.items.forEach(([q, a]) => add(q, a, `/contact/#${c.id}`)));
C.FAQ_ME.forEach(([q, a]) => add(q, a, '/for-me/'));
C.ORG_SERVICES.forEach(s => { s.faq.forEach(([q, a]) => add(q, a, `/for-organisations/#${s.id}`)); add(s.t, `${s.intro[0]} Who it suits: ${s.suits} ${s.good}`, `/for-organisations/#${s.id}`); });
C.PARTNER_FAQ.forEach(([q, a]) => add(q, a, '/partners/'));
C.DESTINATIONS.forEach(d => add(`${d.name} — ${d.tag}`, `${d.summary} Recommended period: ${d.period}. ${d.best}`, `/destinations/${d.slug}/`));
C.ME_OFFERS.forEach(o => add(o.t, `${o.short} ${o.details.map(([k, v]) => `${k}: ${v}`).join(' ')}`, `/what-we-offer/#me`));
add('How do I contact you? Phone, email, hours, address', `Email ${C.SITE.email}. Phone ${C.SITE.phone}. ${C.SITE.hours} Address: ${C.SITE.address}. Please arrange your visit with the team.`, '/contact/');
add('Au pair and host families', 'Our au pair and host-family network is in development. You can register your interest as an au pair or as a host family. Registration does not guarantee a match or a placement.', '/au-pair-and-host-families/');
add('Do you offer internships or work placements?', 'Formaskills Travel organises job shadowing and professional observation for staff. Partner companies can express interest in hosting trainees; every project is discussed individually.', '/partners/#host');

// Assets & root files
await cp(join(ROOT, 'assets'), join(OUT, 'assets'), { recursive: true, filter: (s) => !/\.(webp)$/.test(s) || /hero_clouds|dest_/.test(s) });
await mkdir(join(OUT, 'assets/data'), { recursive: true });
await writeFile(join(OUT, 'assets/data/search.json'), JSON.stringify(index));
await writeFile(join(OUT, 'assets/data/kb.json'), JSON.stringify(kb));
{
  const P = JSON.parse(await readFile(join(ROOT, 'build/planner-data.json'), 'utf8'));
  const { steps, opt, gen, ui, topics, svc, status, statusLabel } = P;
  await writeFile(join(OUT, 'assets/data/planner.json'), JSON.stringify({ steps, opt, gen, ui, topics, svc, status, statusLabel }));
}
for (const f of ['robots.txt', '_headers']) await cp(join(ROOT, f), join(OUT, f)).catch(() => {});
const today = new Date().toISOString().slice(0, 10);
await writeFile(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGES.filter(p => !p.noindex).map(p => `  <url><loc>${C.SITE.url}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);

const count = (await readdir(OUT, { recursive: true })).filter(f => f.endsWith('.html')).length;
console.log(`Built ${count} pages → site/  (search entries: ${index.length}, assistant entries: ${kb.length})`);
