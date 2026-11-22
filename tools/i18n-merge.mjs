// Merge hand-written translations into /i18n/<lang>.json.
//   node tools/i18n-merge.mjs list <lang> <out.json>     → writes the untranslated English keys (array, index = id)
//   node tools/i18n-merge.mjs apply <lang> <list.json> <translations.tsv> [--fill]   (--fill: only empty keys)
// translations.tsv: one "id|translation" per line (translation may contain the same inline tags as the English).
import { readFile, writeFile } from 'node:fs/promises';
const fill = process.argv.includes('--fill');
const [, , cmd, lang, a, b] = process.argv.filter(x => x !== '--fill');
const file = new URL(`../i18n/${lang}.json`, import.meta.url);
const dict = JSON.parse(await readFile(file, 'utf8'));
if (cmd === 'list') {
  const keys = Object.keys(dict).filter(k => !dict[k]);
  await writeFile(a, JSON.stringify(keys, null, 1));
  console.log(`${keys.length} untranslated keys → ${a}`);
} else if (cmd === 'apply') {
  const keys = JSON.parse(await readFile(a, 'utf8'));
  let n = 0;
  for (const line of (await readFile(b, 'utf8')).split(/\r?\n/)) {
    const m = line.match(/^(\d+)\|(.*)$/); if (!m) continue;
    const k = keys[+m[1]]; if (k == null) { console.warn('unknown id', m[1]); continue; }
    if (fill && dict[k]) continue; // --fill: keep translations that already exist
    if (!(k in dict)) continue;
    dict[k] = m[2].trim(); n++;
  }
  await writeFile(file, JSON.stringify(dict, null, 1) + '\n');
  console.log(`${lang}: ${n} translations applied, ${Object.values(dict).filter(v => !v).length} still empty`);
}
