// Fill /i18n/<lang>.json from the owner's published translations.
//
//   node build/build.mjs --en-only                    (generates English pages in site/en/)
//   node tools/i18n-sync.mjs <dir-with-source-pages>  (dir/<lang>/<page>.html, as downloaded)
//
// 1. Collects every translatable string from the generated English pages → i18n/en.json.
// 2. Aligns each source page in English with the same page in every other language (sequence
//    alignment on block structure + link targets), producing English → translation pairs.
// 3. For every key in en.json that has no hand-written translation yet, fills it from the pairs,
//    re-applying our own inline markup (links, bold…) to the translated text.
// Keys that remain untranslated are listed by `node tools/i18n-check.mjs`.
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LANGS, tokenize, findUnits, unitHTML, plain, retag, inlineTags, tagAttrs, collect, norm } from '../build/i18n.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.argv[2];
if (!SRC) { console.error('usage: node tools/i18n-sync.mjs <source-dir>'); process.exit(1); }

async function walk(d) {
  const out = [];
  for (const e of await readdir(d, { withFileTypes: true })) {
    if (e.isDirectory()) out.push(...await walk(join(d, e.name))); else out.push(join(d, e.name));
  }
  return out;
}
const deprefix = (h) => h.replace(/href="\/(?:en|fr|es|de|it|zh|pl)\//g, 'href="/');

// ---------- 1. our English strings ----------
const en = new Map();
for (const f of (await walk(join(ROOT, 'site', 'en'))).filter(f => f.endsWith('.html')).sort()) collect(await readFile(f, 'utf8'), en);
// strings used by the scripts: T('…') calls
for (const f of (await readdir(join(ROOT, 'assets/js'))).filter(f => f.endsWith('.js'))) {
  const src = await readFile(join(ROOT, 'assets/js', f), 'utf8');
  for (const m of src.matchAll(/\bT\(\s*'((?:[^'\\]|\\.)*)'/g)) { const k = m[1].replace(/\\'/g, "'"); if (!en.has(plain(k))) en.set(plain(k), k); }
}
const enObj = Object.fromEntries([...en.entries()].sort((a, b) => a[0].localeCompare(b[0])));
await mkdir(join(ROOT, 'i18n'), { recursive: true });
await writeFile(join(ROOT, 'i18n/en.json'), JSON.stringify(enObj, null, 1) + '\n');
console.log(`en.json: ${en.size} strings`);

// ---------- 2. alignment ----------
const units = (html) => {
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  const tokens = tokenize(body);
  return findUnits(tokens).map(u => {
    const h = deprefix(unitHTML(tokens, u));
    const hrefs = (h.match(/href="[^"]*"/g) || []).join(',');
    const t = plain(h);
    // language-neutral fingerprint: question marks, colons, brackets and digits survive translation
    const w = t.replace(/[？]/g, '?').replace(/[：]/g, ':').replace(/[（]/g, '(');
    const fp = `${(w.match(/\?/g) || []).length}${(w.match(/:/g) || []).length}${(w.match(/\(/g) || []).length}${(w.match(/\d+/g) || []).join('-')}`;
    return { h, t, sig: `${u.sec}|${u.parent}|${hrefs}|${inlineTags(h).map(x => x.match(/^<\/?([a-z0-9]+)/i)?.[1]).join('.')}|${fp}` };
  }).filter(x => x.t);
};
const attrs = (html) => {
  const out = [];
  for (const k of tokenize(html.replace(/<script[\s\S]*?<\/script>/gi, ''))) if (k.t === 'tag' && !k.close) for (const { a, v } of tagAttrs(k.raw)) out.push({ sig: `${k.name}.${a}`, t: plain(v) });
  for (const m of html.matchAll(/<meta (?:name|property)="(description|og:title|og:description)" content="([^"]*)">/g)) out.push({ sig: `meta.${m[1]}`, t: plain(m[2]) });
  return out;
};
// LCS over signatures (pages are a few hundred units, so O(n·m) is fine)
function align(A, B) {
  const n = A.length, m = B.length, dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = A[i].sig === B[j].sig ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const pairs = []; let i = 0, j = 0;
  while (i < n && j < m) { if (A[i].sig === B[j].sig) { pairs.push([A[i], B[j], i, j]); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; }
  // Reject pairs inside a run of identical signatures whose length differs between the two
  // languages: inside such a run the alignment cannot know which item is the extra one.
  const runLen = (X, k) => { let a = k, b = k; while (a > 0 && X[a - 1].sig === X[k].sig) a--; while (b < X.length - 1 && X[b + 1].sig === X[k].sig) b++; return b - a + 1; };
  return pairs.filter(([x, y, a, b]) => runLen(A, a) === runLen(B, b)).map(([x, y]) => [x, y]);
}
const segs = (h) => h.split(/<[^>]+>/).map(norm);

const pages = (await readdir(join(SRC, 'en'))).filter(f => f.endsWith('.html'));
for (const L of LANGS.filter(l => l !== 'en')) {
  const unitPairs = new Map(), fragPairs = new Map(), conflicts = new Set(), fragConflicts = new Set();
  for (const p of pages) {
    let a, b; try { a = await readFile(join(SRC, 'en', p), 'utf8'); b = await readFile(join(SRC, L, p), 'utf8'); } catch { continue; }
    // plausible length ratio for this language (Chinese is far more compact)
    const [lo, hi] = L === 'zh' ? [.12, 1.1] : [.55, 2.1];
    for (const [x, y] of align(units(a), units(b))) {
      const r = y.t.length / Math.max(1, x.t.length);
      if (x.t.length > 24 && (r < lo || r > hi)) continue;
      if (x.t === y.t && x.t.split(' ').length >= 3) continue;          // left in English on the source site
      if (unitPairs.has(x.t) && plain(unitPairs.get(x.t)) !== y.t) { conflicts.add(x.t); continue; }
      if (!unitPairs.has(x.t)) unitPairs.set(x.t, y.h);
      const sx = segs(x.h), sy = segs(y.h);
      if (sx.length === sy.length) sx.forEach((s, i) => {
        const k = plain(s); if (!k || !/[A-Za-z]/.test(k) || !sy[i]) return;
        if (fragPairs.has(k) && plain(fragPairs.get(k)) !== plain(sy[i])) { fragConflicts.add(k); return; }
        fragPairs.set(k, sy[i]);
      });
    }
    for (const [x, y] of align(attrs(a), attrs(b))) if (!fragPairs.has(x.t) && x.t) fragPairs.set(x.t, y.t);
  }

  for (const k of conflicts) unitPairs.delete(k);
  for (const k of fragConflicts) fragPairs.delete(k);
  for (const [k, v] of fragPairs) if (plain(v) === k && k.split(' ').length >= 3) fragPairs.delete(k);

  // ---------- 3. fill ----------
  const file = join(ROOT, 'i18n', `${L}.json`);
  let cur = {}; try { cur = JSON.parse(await readFile(file, 'utf8')); } catch {}
  const out = {}; let filled = 0, kept = 0, miss = 0;
  for (const [key, enHTML] of en) {
    if (cur[key] != null && cur[key] !== '') { out[key] = cur[key]; kept++; continue; }
    let v = null;
    const src = unitPairs.get(key);
    const hasTags = inlineTags(enHTML).length > 0;
    if (src != null) v = hasTags ? retag(src, enHTML) : plain(src);
    if (v == null && !hasTags && fragPairs.has(key)) v = fragPairs.get(key);
    if (v == null && hasTags) {
      // translate each text segment between our own tags
      const parts = enHTML.split(/(<[^>]+>)/);
      const tr = parts.map(s => s.startsWith('<') || !plain(s) || !/[A-Za-z]/.test(plain(s)) ? s : (fragPairs.get(plain(s)) ?? (unitPairs.has(plain(s)) ? plain(unitPairs.get(plain(s))) : null)));
      if (tr.every(x => x != null)) v = tr.join('').replace(/(\S)(<)/g, '$1$2');
    }
    if (v != null) { out[key] = v; filled++; } else { out[key] = ''; miss++; }
  }
  await writeFile(file, JSON.stringify(out, null, 1) + '\n');
  console.log(`${L}.json: ${filled} filled from source, ${kept} kept, ${miss} still empty`);
}
