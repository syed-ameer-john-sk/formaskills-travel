// Formaskills Travel — i18n engine (no dependencies).
// Pages are generated once in English from the templates, then each language is produced by
// translating "units" of the generated HTML through /i18n/<lang>.json.
//
// A unit is a run of text plus inline markup (a, b, strong, em, span, small, br, mark…) inside a
// block element (h1–h6, p, li, button, label, dt, dd, summary, option…). Keys are the unit's plain
// English text (whitespace-normalised), so every language file has identical keys; values are the
// translated inner HTML using the same inline tags as the English source.

export const LANGS = ['en', 'fr', 'es', 'de', 'it', 'zh', 'pl'];
export const LANG_NAMES = { en: 'English', fr: 'Français', es: 'Español', de: 'Deutsch', it: 'Italiano', zh: '中文', pl: 'Polski' };
export const LOCALES = { en: 'en_GB', fr: 'fr_FR', es: 'es_ES', de: 'de_DE', it: 'it_IT', zh: 'zh_CN', pl: 'pl_PL' };
export const HTML_LANG = { en: 'en', fr: 'fr', es: 'es', de: 'de', it: 'it', zh: 'zh-Hans', pl: 'pl' };

const BLOCK = new Set(['html', 'head', 'body', 'main', 'header', 'footer', 'nav', 'section', 'article', 'aside', 'div', 'form', 'fieldset',
  'details', 'figure', 'ul', 'ol', 'dl', 'table', 'thead', 'tbody', 'tr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'dt', 'dd', 'summary',
  'label', 'legend', 'option', 'button', 'figcaption', 'th', 'td', 'blockquote', 'pre', 'select', 'textarea', 'title', 'noscript']);
const SKIP = new Set(['script', 'style', 'svg', 'template', 'textarea', 'code']);
const VOID = new Set(['br', 'img', 'input', 'meta', 'link', 'hr', 'source', 'wbr', 'path', 'circle', 'rect', 'stop', 'use']);
const ATTRS = ['alt', 'aria-label', 'placeholder', 'title'];

export const norm = (s) => s.replace(/\s+/g, ' ').replace(/[‘’]/g, '’').trim();
export const plain = (html) => norm(html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/ +([.,;:!?)])/g, '$1').replace(/\( +/g, '('));

/** Split HTML into tag and text tokens. */
export function tokenize(html) {
  const out = [];
  const re = /<!--[\s\S]*?-->|<!doctype[^>]*>|<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  let last = 0, m;
  while ((m = re.exec(html))) {
    if (m.index > last) out.push({ t: 'text', raw: html.slice(last, m.index) });
    const raw = m[0];
    if (!m[1]) out.push({ t: 'other', raw });
    else out.push({ t: 'tag', raw, name: m[1].toLowerCase(), close: raw[1] === '/', self: /\/>$/.test(raw) || VOID.has(m[1].toLowerCase()) });
    last = re.lastIndex;
    // raw-text elements: copy their contents verbatim
    if (m[1] && !raw.startsWith('</') && /^(script|style|textarea)$/i.test(m[1])) {
      const end = html.toLowerCase().indexOf(`</${m[1].toLowerCase()}`, last);
      if (end > last) { out.push({ t: 'raw', raw: html.slice(last, end) }); last = end; re.lastIndex = end; }
    }
  }
  if (last < html.length) out.push({ t: 'text', raw: html.slice(last) });
  return out;
}

/** Find translatable runs: [{ s, e, parent }] token ranges (inclusive start, exclusive end). */
export function findUnits(tokens) {
  const units = [];
  const stack = [];          // block frames
  let skip = 0, notr = 0;    // inside <svg>/<script>…, inside translate="no"
  const skipStack = [], inl = [], inlDepth = [];
  let run = null;
  const flush = () => {
    if (run && run.text.trim() && !notr) {
      // trim leading/trailing whitespace-only text tokens from the range
      let s = run.s, e = run.e;
      while (s < e && tokens[s].t === 'text' && !tokens[s].raw.trim()) s++;
      while (e > s && tokens[e - 1].t === 'text' && !tokens[e - 1].raw.trim()) e--;
      units.push({ s, e, parent: stack.at(-1)?.name || '', sec: [...stack].reverse().find(f => f.id)?.id || '' });
    }
    run = null;
  };
  for (let i = 0; i < tokens.length; i++) {
    const k = tokens[i];
    if (k.t === 'tag' && SKIP.has(k.name)) {
      if (!k.close && !k.self) { skip++; skipStack.push(k.name); } else if (k.close && skip) { skip--; skipStack.pop(); }
      // an icon inside a run is kept verbatim as part of the run's range
      if (run) run.e = i + 1;
      continue;
    }
    if (skip) { if (run) run.e = i + 1; continue; }
    if (k.t === 'tag' && BLOCK.has(k.name)) {
      flush();
      if (!k.close) {
        const no = /\btranslate="no"/.test(k.raw);
        if (!k.self) stack.push({ name: k.name, no, id: (k.raw.match(/\sid="([^"]+)"/) || [])[1] });
        if (no) notr++;
      } else {
        const f = stack.pop(); if (f?.no) notr--;
      }
      continue;
    }
    if (k.t === 'text' || (k.t === 'tag')) {
      if (!run) run = { s: i, e: i + 1, text: '' };
      run.e = i + 1;
      // inline translate="no" (language names, codes): kept in the run but its text doesn't count
      if (k.t === 'tag' && !k.self) {
        if (!k.close && /\btranslate="no"/.test(k.raw)) inl.push(k.name);
        else if (k.close && inl.length && inl.at(-1) === k.name && inlDepth.at(-1) === undefined) inl.pop();
      }
      if (k.t === 'text' && !inl.length) run.text += k.raw;
    }
  }
  flush();
  return units;
}

/** Inner HTML of a unit with icons (svg) removed, for keys and alignment. */
export const unitHTML = (tokens, u) => {
  let out = '', skip = 0;
  for (let i = u.s; i < u.e; i++) {
    const k = tokens[i];
    if (k.t === 'tag' && k.name === 'svg') { if (!k.close && !k.self) skip++; else if (k.close) skip--; continue; }
    if (skip) continue;
    out += k.raw;
  }
  return norm(out);
};

/** Inline tags of a unit (svg excluded), in order. */
export const inlineTags = (html) => (html.match(/<\/?[a-zA-Z][^>]*>/g) || []);

/** Substitute the tags of `target` (positionally) with the tags of `model`. Returns null if they differ in shape. */
export function retag(targetHTML, modelHTML) {
  const tt = inlineTags(targetHTML), mt = inlineTags(modelHTML);
  if (tt.length !== mt.length) return null;
  for (let i = 0; i < tt.length; i++) {
    const a = tt[i].match(/^<(\/?)([a-zA-Z0-9]+)/), b = mt[i].match(/^<(\/?)([a-zA-Z0-9]+)/);
    if (!a || !b || a[1] !== b[1] || a[2].toLowerCase() !== b[2].toLowerCase()) return null;
  }
  let i = 0;
  return targetHTML.replace(/<\/?[a-zA-Z][^>]*>/g, () => mt[i++]);
}

/** Fit a stored translation to the markup of this occurrence of the English text.
    Same tag shape → use this page's own tags (hrefs, classes); translation has tags but this
    occurrence has none → plain text; this occurrence is wrapped (e.g. <a>…</a>) → wrap the text. */
export function fitMarkup(tr, enHTML) {
  const tTags = inlineTags(tr), eTags = inlineTags(enHTML);
  if (!eTags.length) return tTags.length ? plain(tr) : tr;
  const same = retag(tr, enHTML);
  if (same != null) return same;
  // wrapper-only markup on the English side: <x><y>text</y></x> (+ optional trailing icon)
  const m = enHTML.match(/^((?:<[a-zA-Z][^>]*>)+)([^<]*)((?:<\/[a-zA-Z]+>)+)(.*)$/);
  if (m) return m[1] + plain(tr).replace(/&/g, '&amp;').replace(/</g, '&lt;') + m[3] + m[4];
  return plain(tr).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

/** Attribute values worth translating on a tag token. */
export function tagAttrs(raw) {
  const out = [];
  for (const a of ATTRS) {
    const m = raw.match(new RegExp(`\\s${a}="([^"]*)"`));
    if (m && m[1].trim() && !/^\{|^https?:/.test(m[1])) out.push({ a, v: m[1] });
  }
  return out;
}

/** Collect every translatable string (unit text → English inner HTML) from a page. */
export function collect(html, into = new Map()) {
  const tokens = tokenize(html);
  for (const u of findUnits(tokens)) {
    const h = unitHTML(tokens, u), key = plain(h);
    if (key && /[A-Za-zÀ-ÿ]/.test(key) && !into.has(key)) into.set(key, h);
  }
  for (const k of tokens) if (k.t === 'tag' && !k.close) for (const { v } of tagAttrs(k.raw)) {
    const key = plain(v); if (key && /[A-Za-z]/.test(key) && !into.has(key)) into.set(key, key);
  }
  // meta descriptions / titles
  for (const m of html.matchAll(/<meta (?:name|property)="(?:description|og:title|og:description|twitter:title|twitter:description)" content="([^"]*)">/g)) {
    const key = plain(m[1]); if (key && !into.has(key)) into.set(key, key);
  }
  return into;
}

const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const unescape = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

/** Translate a whole generated page. `dict` maps English plain text → translated inner HTML. */
export function translatePage(html, dict, missing) {
  if (!dict) return html;
  const tokens = tokenize(html);
  const units = findUnits(tokens);
  const repl = new Map();
  for (const u of units) {
    const h = unitHTML(tokens, u), key = plain(h);
    if (!key || !/[A-Za-zÀ-ÿ]/.test(key)) continue;
    let tr = dict[key];
    if (tr == null || tr === '') { missing?.add(key); continue; }
    tr = fitMarkup(tr, h);
    // keep leading icons (svg) that sat before the text inside the run
    let prefix = '', i = u.s, skip = 0;
    for (; i < u.e; i++) {
      const k = tokens[i];
      if (k.t === 'tag' && k.name === 'svg') { prefix += k.raw; if (!k.close && !k.self) skip++; else if (k.close) skip--; continue; }
      if (skip) { prefix += k.raw; continue; }
      break;
    }
    let suffix = '', j = u.e - 1; skip = 0;
    for (; j >= i; j--) {
      const k = tokens[j];
      if (k.t === 'tag' && k.name === 'svg') { suffix = k.raw + suffix; if (k.close) skip++; else if (!k.self) skip--; continue; }
      if (skip) { suffix = k.raw + suffix; continue; }
      break;
    }
    repl.set(u.s, { e: u.e, html: prefix + tr + suffix });
  }
  let out = '';
  for (let i = 0; i < tokens.length; i++) {
    const r = repl.get(i);
    if (r) { out += r.html; i = r.e - 1; continue; }
    const k = tokens[i];
    if (k.t === 'tag' && !k.close) {
      let raw = k.raw;
      for (const { a, v } of tagAttrs(raw)) {
        const tr = dict[plain(unescape(v))];
        if (tr != null) raw = raw.replace(`${a}="${v}"`, `${a}="${escAttr(plain(tr))}"`);
        else missing?.add(plain(unescape(v)));
      }
      out += raw;
    } else out += k.raw;
  }
  // meta descriptions and social titles
  out = out.replace(/(<meta (?:name|property)="(?:description|og:title|og:description|twitter:title|twitter:description)" content=")([^"]*)(">)/g, (m, a, v, b) => {
    const tr = dict[plain(unescape(v))]; if (tr == null) { missing?.add(plain(unescape(v))); return m; }
    return a + escAttr(plain(tr)) + b;
  });
  return out;
}
