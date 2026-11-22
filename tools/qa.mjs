// Cross-device QA: screenshots of every language homepage at each breakpoint, plus automated checks.
//   npm start            (serves site/ on http://localhost:5173)   — or pass another base URL
//   node tools/qa.mjs [baseUrl]
// Writes qa/screens/<lang>-<width>-hero.jpg and -sections.jpg, and qa/checks.json.
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = process.argv[2] || 'http://localhost:5173';
const LANGS = ['en', 'fr', 'es', 'de', 'it', 'zh', 'pl'];
const SIZES = [[360, 780], [390, 844], [768, 1024], [1024, 768], [1440, 900]];
const PAGES = ['', 'what-we-offer/', 'for-organisations/', 'destinations/', 'destinations/sete/', 'contact/', 'learn-french/', 'partners/', 'plan-your-stay/', 'legal/privacy/'];
await mkdir('qa/screens', { recursive: true });

const browser = await chromium.launch();
const checks = { overflow: [], consoleErrors: [], reducedMotion: {}, heroTitleInWindow: [] };

for (const L of LANGS) {
  for (const [w, h] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: w < 768, isMobile: w < 768 });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => checks.consoleErrors.push(`${L}/${w}: ${e.message}`));
    await page.goto(`${BASE}/${L}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `qa/screens/${L}-${w}-hero.jpg`, type: 'jpeg', quality: 70 });
    // the title inside the airplane window, once it is shown
    const inWin = await page.evaluate(async () => {
      const F = document.querySelector('.flight'); if (!F) return true;
      scrollTo(0, F.offsetTop + (F.offsetHeight - innerHeight) * .3);
      await new Promise(r => setTimeout(r, 2500));
      const a = document.querySelector('#flight-h1').getBoundingClientRect(), b = document.querySelector('[data-copy1]').getBoundingClientRect();
      return a.left >= b.left - 1 && a.right <= b.right + 1 && a.top >= b.top - 1;
    });
    if (!inWin) checks.heroTitleInWindow.push(`${L}/${w}`);
    // sections below the hero: scroll through so reveals run, then capture
    await page.evaluate(async () => {
      const ex = document.querySelector('#explore'); if (!ex) return;
      for (let y = ex.offsetTop; y < document.body.scrollHeight; y += innerHeight * .6) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
      await new Promise(r => setTimeout(r, 900));
    });
    await page.locator('#explore').screenshot({ path: `qa/screens/${L}-${w}-sections.jpg`, type: 'jpeg', quality: 60 });
    // no horizontal scroll on the main pages
    for (const p of (w === 360 || w === 1440) ? PAGES : []) {
      await page.goto(`${BASE}/${L}/${p}`, { waitUntil: 'domcontentloaded' });
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (over > 1) checks.overflow.push(`${L}/${p} @${w}px: ${over}px`);
    }
    await ctx.close();
  }
}

// reduced motion: no hidden reveals, videos stay on their posters
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/en/`, { waitUntil: 'networkidle' });
  checks.reducedMotion = await page.evaluate(() => ({
    hiddenReveals: document.querySelectorAll('.rv:not(.is-in)').length,
    videosWithSource: [...document.querySelectorAll('[data-story] source')].filter(s => s.getAttribute('src')).length,
    flightStatic: document.querySelector('.flight')?.classList.contains('is-static') ?? null,
  }));
  await ctx.close();
}
await browser.close();
await writeFile('qa/checks.json', JSON.stringify(checks, null, 2));
console.log(JSON.stringify(checks, null, 2));
