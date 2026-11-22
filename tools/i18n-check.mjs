// Translation report.
//   node build/build.mjs && node tools/i18n-check.mjs
// 1. Every /i18n/<lang>.json must have exactly the keys of en.json, none empty.
// 2. Every built non-English page is scanned for text runs that are still identical to an
//    English string (3+ words) — i.e. English left on a translated page.
// Exits with code 1 when anything is missing, so it can run in CI.
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LANGS, tokenize, findUnits, unitHTML, plain } from '../build/i18n.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const load = async (l) => JSON.parse(await readFile(join(ROOT, 'i18n', `${l}.json`), 'utf8'));
const en = await load('en');
const enKeys = Object.keys(en);
// Strings that are legitimately the same in every language (proper nouns, codes, addresses).
const SAME = /^(Formaskills|FORMASKILLS|SIREN|Erasmus\+|\+33|contact\.|10 rue|6 rue|Sète|Montpellier|Paris|Nice|https?:)/;

async function walk(d) {
  const out = [];
  for (const e of await readdir(d, { withFileTypes: true })) {
    if (e.isDirectory()) out.push(...await walk(join(d, e.name))); else if (e.name.endsWith('.html')) out.push(join(d, e.name));
  }
  return out;
}

let problems = 0;
const enSet = new Set(enKeys.filter(k => k.split(' ').length >= 3 && !SAME.test(k)));
for (const L of LANGS.filter(l => l !== 'en')) {
  const d = await load(L);
  const missing = enKeys.filter(k => !d[k]);
  const extra = Object.keys(d).filter(k => !(k in en));
  const leftovers = new Map();
  for (const f of await walk(join(ROOT, 'site', L))) {
    const toks = tokenize(await readFile(f, 'utf8'));
    for (const u of findUnits(toks)) {
      const t = plain(unitHTML(toks, u));
      if (enSet.has(t) && d[t] && plain(d[t]) !== t) leftovers.set(t, f.slice(ROOT.length + 1));
    }
  }
  problems += missing.length + leftovers.size;
  console.log(`${L}: ${enKeys.length - missing.length}/${enKeys.length} keys translated` +
    (missing.length ? `, ${missing.length} missing` : '') + (extra.length ? `, ${extra.length} stale (not in en.json)` : '') +
    (leftovers.size ? `, ${leftovers.size} English strings on built pages` : ''));
  for (const k of missing.slice(0, 15)) console.log(`   missing: ${k.slice(0, 100)}`);
  for (const [k, f] of [...leftovers].slice(0, 15)) console.log(`   english: ${k.slice(0, 80)}  (${f})`);
}
process.exit(problems ? 1 : 0);
