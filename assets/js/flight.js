/* Formaskills Travel — "France begins before you land." scroll-driven flight.
   Sequence (progress 0 → 1 over a sticky stage):
   logo → logo flies to the header → cabin window frames the sky → headline in the window →
   push through the window → descend through clouds ("France begins before you land.") →
   clouds part over Sète → birds and the coast come closer → page continues.

   Performance contract
   - Per frame only transform (translate3d / scale3d) and opacity are written, plus canvas draws.
   - No layout reads in scroll: runway and viewport metrics are cached on load and in a debounced
     resize; the scroll listener only schedules one requestAnimationFrame tick.
   - Smooth lerp (0.14) towards the scroll target; canvases skip work when hidden or transparent;
     dt is clamped to 33 ms; canvas DPR capped at 1.5 on mobile, 2 on desktop. */
(() => {
  const root = document.querySelector('[data-flight]');
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const hdr = document.querySelector('[data-hdr]');
  const slot = hdr && hdr.querySelector('[data-logo-slot]');
  const stage = $('[data-stage]');
  const el = {
    cabin: $('[data-cabin]'), cabinCanvas: $('[data-cabin-canvas]'), clouds: $('[data-clouds]'), france: $('[data-france]'),
    franceImg: $('[data-france-img]'), haze: $('[data-haze]'), layer: $('[data-cloudlayer]'), flock: $('[data-flock]'),
    intro: $('[data-intro]'), introLogo: $('[data-intro-logo]'), introTag: $('.fl-intro__tag'), introWhite: $('[data-intro-white]'), c1: $('[data-copy1]'),
    c2: $('[data-copy2]'), c3: $('[data-copy3]'), alt: $('[data-alt]'), bar: $('[data-bar]'), cue: $('[data-cue]'),
    skip: $('[data-skip]'),
  };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const ai = document.querySelector('[data-ai]');

  // ---------- helpers ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;
  const eio = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const eout = (t) => 1 - Math.pow(1 - t, 3);
  const ein = (t) => t * t * t;
  const fade = (p, a, b, c, d) => Math.min(seg(p, a, b), 1 - seg(p, c, d));
  const f3 = (n) => Math.round(n * 1000) / 1000;
  // write a style only when it changes (avoids redundant style invalidation)
  const set = (node, prop, v) => { const k = `_fs_${prop}`; if (node[k] !== v) { node[k] = v; node.style[prop] = v; } };
  const tx = (x, y, s = 1) => `translate3d(${f3(x)}px, ${f3(y)}px, 0) scale3d(${f3(s)}, ${f3(s)}, 1)`;

  // ---------- cached metrics (refreshed on load + debounced resize only) ----------
  const M = { W: 0, H: 0, top: 0, runway: 1, portrait: false };
  let S0 = 5, flip = { dx: 0, dy: 0, s: 1 };
  let dpr = 1;

  function measure() {
    M.W = stage.clientWidth; M.H = stage.clientHeight; M.portrait = M.W < M.H;
    let y = 0, n = root; while (n) { y += n.offsetTop; n = n.offsetParent; }
    M.top = y; M.runway = Math.max(1, root.offsetHeight - M.H);
    dpr = Math.min(coarse || M.W < 768 ? 1.5 : 2, devicePixelRatio || 1);
  }

  // ---------- cabin wall with window ----------
  // Drawn on a screen-sized canvas at the current zoom (only when the zoom changes). Scaling a
  // full-screen vector layer up to ~5x made the browser show it in half-rasterised tiles while
  // scrolling; a viewport-sized canvas never has more pixels than the screen.
  const cctx = el.cabinCanvas.getContext('2d');
  let win = { cx: 0, cy: 0, w: 0, h: 0, r: 0, f: 0 }, cdpr = 1, lastCs = -1, grads = null;
  const rrPath = (g, cx, cy, w, h, r) => {
    w = Math.max(0, w); h = Math.max(0, h);
    const x = cx - w / 2, y = cy - h / 2; r = Math.max(0, Math.min(r, w / 2, h / 2));
    g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.arcTo(x + w, y, x + w, y + r, r);
    g.lineTo(x + w, y + h - r); g.arcTo(x + w, y + h, x + w - r, y + h, r);
    g.lineTo(x + r, y + h); g.arcTo(x, y + h, x, y + h - r, r);
    g.lineTo(x, y + r); g.arcTo(x, y, x + r, y, r); g.closePath();
  };
  const lin = (g, x0, y0, x1, y1, stops) => { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; };
  function buildCabin() {
    const { W, H, portrait } = M;
    // portrait screens get a taller, narrower window (closer to a real cabin window and roomier for text)
    const ratio = portrait ? .62 : .7;
    let h = Math.min(H * (portrait ? .66 : .74), 780), w = h * ratio;
    if (w > W * (portrait ? .84 : .7)) { w = W * (portrait ? .84 : .7); h = w / ratio; }
    const cx = W / 2, cy = H * .52, r = w * .46, f = w * .16;
    win = { cx, cy, w, h, r, f };
    // the window copy is positioned on exactly this glass area and sized from it (container units)
    root.style.setProperty('--win-w', `${Math.round(w)}px`);
    root.style.setProperty('--win-h', `${Math.round(h)}px`);
    root.style.setProperty('--win-x', `${Math.round(cx - w / 2)}px`);
    root.style.setProperty('--win-y', `${Math.round(cy - h / 2)}px`);
    S0 = Math.max(W / (w * .82), H / (h * .82)) * 1.2;
    cdpr = dpr;
    el.cabinCanvas.width = Math.round(W * cdpr); el.cabinCanvas.height = Math.round(H * cdpr);
    // cool, natural cabin: slate wall, pale frame, no glow
    const g = cctx, X = cx - w / 2 - f, Y = cy - h / 2 - f;
    grads = {
      wall: lin(g, 0, 0, W, H, [[0, '#1c2438'], [.55, '#263149'], [1, '#151b2c']]),
      frame: lin(g, X, Y, X + w + f * 2, Y + h + f * 2, [[0, '#eef1f6'], [.45, '#b9c2d2'], [1, '#4a5670']]),
      inner: lin(g, 0, Y, 0, Y + h + f * 2, [[0, '#3b4660'], [1, '#6b7892']]),
      shade: lin(g, 0, cy - h / 2, 0, cy - h / 2 + h * .085, [[0, '#f1f3f7'], [1, '#d3d9e3']]),
    };
    lastCs = -1;
  }
  function drawCabin(cs) {
    if (Math.abs(cs - lastCs) < .0005 || M.W < 10 || M.H < 10) return;   // nothing to draw before layout
    lastCs = cs;
    const g = cctx, { W, H } = M, { cx, cy, w, h, r, f } = win;
    g.setTransform(cdpr, 0, 0, cdpr, 0, 0);
    g.clearRect(0, 0, W, H);
    g.translate(cx, cy); g.scale(cs, cs); g.translate(-cx, -cy);
    // wall: everything outside the outer frame (the rectangle always covers the screen)
    const B = Math.max(W, H) / Math.min(cs, 1) + Math.max(W, H);
    g.beginPath(); g.rect(cx - B, cy - B, B * 2, B * 2); rrPath(g, cx, cy, w + f * 2, h + f * 2, r + f);
    g.fillStyle = grads.wall; g.fill('evenodd');
    g.beginPath(); rrPath(g, cx, cy, w + f * 2, h + f * 2, r + f); rrPath(g, cx, cy, w + f * .9, h + f * .9, r + f * .45);
    g.fillStyle = grads.frame; g.fill('evenodd');
    g.beginPath(); rrPath(g, cx, cy, w + f * .9, h + f * .9, r + f * .45); rrPath(g, cx, cy, w, h, r);
    g.fillStyle = grads.inner; g.fill('evenodd');
    g.beginPath(); rrPath(g, cx, cy, w + f * 2 - 2, h + f * 2 - 2, r + f);
    g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 1.5; g.stroke();
    // window shade and inner edge, clipped to the glass
    g.save(); g.beginPath(); rrPath(g, cx, cy, w, h, r); g.clip();
    g.fillStyle = grads.shade; g.fillRect(cx - w / 2, cy - h / 2, w, h * .085);
    g.fillStyle = 'rgba(13,20,36,.22)'; g.fillRect(cx - w / 2, cy - h / 2 + h * .085, w, 2);
    g.beginPath(); rrPath(g, cx, cy, w - f * .07, h - f * .07, r);
    g.strokeStyle = 'rgba(13,20,36,.28)'; g.lineWidth = f * .14; g.stroke();
    g.restore();
  }
  function measureFlip() {
    if (!slot || !el.introLogo) return;
    const prev = el.introLogo.style.transform;
    el.introLogo.style.transform = 'none';
    const a = el.introLogo.getBoundingClientRect(), st = stage.getBoundingClientRect();
    const b = slot.getBoundingClientRect(), hr = hdr.getBoundingClientRect();
    el.introLogo.style.transform = prev; el.introLogo._fs_transform = prev;
    flip = { dx: (b.left - hr.left) - (a.left - st.left), dy: (b.top - hr.top) - (a.top - st.top), s: b.width / a.width };
  }

  // ---------- one-time cool grade of the photographs (no per-frame filters) ----------
  // Optionally upscales once to the screen's real pixel size (high-quality smoothing + light
  // unsharp mask) so the browser never has to stretch a small photo during the zoom.
  function grade(img, { k = 0, desat = 0, cool = 0, targetW = 0, sharpen = 0, quality = .9, onlyIfUpscale = false }) {
    const run = () => {
      try {
        const nw = img.naturalWidth, nh = img.naturalHeight; if (!nw) return reveal();
        const want = typeof targetW === 'function' ? targetW(nw, nh) : targetW;
        // high-resolution sources need no processing on most screens
        if (onlyIfUpscale && want <= nw * 1.05) return reveal();
        const w = Math.max(nw, Math.min(2880, Math.round(want))), h = Math.round(nh * w / nw);
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        const g = c.getContext('2d', { willReadFrequently: true });
        g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
        g.drawImage(img, 0, 0, w, h);
        const d = g.getImageData(0, 0, w, h), a = d.data;
        if (sharpen > 0) {
          // unsharp mask with a 3x3 Gaussian: out = px + amount * (px - blur)
          const s = new Uint8ClampedArray(a), row = w * 4;
          for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
              const i = y * row + x * 4;
              for (let ch = 0; ch < 3; ch++) {
                const j = i + ch;
                const blur = (s[j - row - 4] + 2 * s[j - row] + s[j - row + 4] + 2 * s[j - 4] + 4 * s[j] + 2 * s[j + 4] + s[j + row - 4] + 2 * s[j + row] + s[j + row + 4]) / 16;
                a[j] = s[j] + sharpen * (s[j] - blur);
              }
            }
          }
        }
        if (k || desat || cool) for (let i = 0; i < a.length; i += 4) {
          let r = a[i], gg = a[i + 1], b = a[i + 2];
          const Y = (.299 * r + .587 * gg + .114 * b) / 255;
          r = lerp(r, Y * 255, desat) * (1 - cool * .09); gg = lerp(gg, Y * 255, desat) * (1 - cool * .02); b = Math.min(255, lerp(b, Y * 255, desat) * (1 + cool * .07));
          const t = clamp((Y - .06) / .86); const tt = t * t * (3 - 2 * t);
          a[i] = lerp(r, lerp(54, 250, tt), k); a[i + 1] = lerp(gg, lerp(68, 252, tt), k); a[i + 2] = lerp(b, lerp(98, 255, tt), k);
        }
        g.putImageData(d, 0, 0);
        c.toBlob((blob) => {
          if (!blob) return reveal();
          const orig = img.currentSrc || img.src;
          // if the graded copy is ever blocked (e.g. by a CSP), fall back to the original photo
          img.addEventListener('error', () => { img.src = orig; reveal(); }, { once: true });
          img.src = URL.createObjectURL(blob);
          img.decode?.().then(reveal, () => {}) ?? reveal();
        }, 'image/jpeg', quality);
      } catch { reveal(); }
    };
    const reveal = () => img.classList.add('is-graded');
    if (img.complete && img.naturalWidth) run(); else img.addEventListener('load', run, { once: true });
  }
  const FRANCE_MAX_ZOOM = 1.12;
  function gradePhotos() {
    // high-resolution, naturally lit sources: the clouds are shown as they are
    el.clouds.classList.add('is-graded');
    // the landing photo is full-bleed and zoomed: upscale + lightly sharpen only on screens
    // that need more pixels than the source has (e.g. high-DPI displays)
    const realDpr = Math.min(2, devicePixelRatio || 1);
    grade(el.franceImg, {
      targetW: (nw, nh) => Math.max(M.W, M.H * nw / nh) * FRANCE_MAX_ZOOM * realDpr,
      sharpen: .35, quality: .95, onlyIfUpscale: true,
    });
  }

  // ---------- procedural cloud sprites (cool white, slate underside) ----------
  const sprites = [];
  function makeSprite(seed) {
    const c = document.createElement('canvas'); const s = 320; c.width = s; c.height = s * .62;
    const g = c.getContext('2d'); let r = seed;
    const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < 26; i++) {
      const x = s * (.18 + rnd() * .64), y = c.height * (.38 + rnd() * .32), rad = s * (.08 + rnd() * .16);
      const gr = g.createRadialGradient(x, y - rad * .3, rad * .1, x, y, rad);
      gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(.55, 'rgba(244,247,251,.55)'); gr.addColorStop(1, 'rgba(236,241,247,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
    }
    g.globalCompositeOperation = 'source-atop';
    const sh = g.createLinearGradient(0, 0, 0, c.height); sh.addColorStop(.45, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(150,164,190,.4)');
    g.fillStyle = sh; g.fillRect(0, 0, s, c.height);
    return c;
  }
  const puffs = [];
  function initClouds() {
    // detailed GPU-generated puffs (sharp at any size); fall back to the 2D sprites without WebGL
    const gen = window.FSSky?.puffs(4, 640, 400);
    window.FSSky?.release();
    if (gen && gen.length === 4) sprites.push(...gen);
    else for (let i = 0; i < 4; i++) sprites.push(makeSprite(17 + i * 101));
    let r = 7; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < 34; i++) puffs.push({ x: (rnd() - .5) * 2.6, y: (rnd() - .5) * 2.2, z: .25 + rnd() * 1.8, sp: sprites[i % 4], d: rnd() });
  }
  const lctx = el.layer.getContext('2d');
  const fctx = el.flock.getContext('2d');
  // soft clouds render at 1x (no visible loss); birds use the capped DPR for crisp edges
  function sizeCanvases() {
    el.layer.width = Math.round(M.W); el.layer.height = Math.round(M.H); lctx.setTransform(1, 0, 0, 1, 0, 0);
    el.flock.width = Math.round(M.W * dpr); el.flock.height = Math.round(M.H * dpr); fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  let cloudsDrawn = true;
  function drawClouds(p, t) {
    const vis = fade(p, .44, .5, .66, .76);
    set(el.layer, 'opacity', String(f3(vis)));
    if (vis < .01) { if (cloudsDrawn) { lctx.clearRect(0, 0, M.W, M.H); cloudsDrawn = false; } return; }
    cloudsDrawn = true;
    const { W, H } = M;
    lctx.clearRect(0, 0, W, H);
    const travel = seg(p, .44, .76) * 1.9, part = eio(seg(p, .62, .76));
    const fov = Math.max(W, H) * .42;
    const list = puffs.map(o => { let z = o.z - travel; z = ((z - .05) % 2 + 2) % 2 + .05; return { o, z }; }).sort((a, b) => b.z - a.z);
    for (const { o, z } of list) {
      const spread = 1 + part * 2.4;
      const x = W / 2 + (o.x * spread + Math.sin(t * .00012 + o.d * 6) * .04) * fov / z;
      const y = H / 2 + (o.y * spread) * fov / z;
      const sw = (fov * 1.9) / z, sh = sw * .62;
      const a = clamp(Math.min((2.05 - z) * 1.2, z * 3)) * (1 - part * .9);
      if (a <= .01 || sw > W * 6) continue;
      lctx.globalAlpha = a;
      lctx.drawImage(o.sp, x - sw / 2, y - sh / 2, sw, sh);
    }
    lctx.globalAlpha = 1;
  }

  // ---------- birds: three parallax depth planes (far, mid, near) ----------
  const B = window.FSBirds;
  const PLANES = [
    { scale: .42, speed: .45, alpha: .55, band: [.1, .28], mode: 'sil', color: '#6d7d9c' },   // far: atmospheric slate
    { scale: .7, speed: .78, alpha: .85, band: [.18, .42], mode: 'detail' },                   // mid
    { scale: 1.3, speed: 1.2, alpha: 1, band: [.3, .62], mode: 'detail' },                     // near
  ];
  let flock = [];
  function buildFlock() {
    const counts = M.portrait && M.W < 700 ? [2, 2, 1] : [3, 3, 2];  // 5 on phones, 8 on desktop
    const total = counts.reduce((a, b) => a + b, 0);
    if (flock.length === total || !B) return;
    flock = [];
    counts.forEach((n, pi) => { for (let i = 0; i < n; i++) flock.push({ bird: B.create({ seed: 11 + pi * 31 + i * 7 }), plane: PLANES[pi], u: (i + .3 + pi * .37) / n % 1, v: (i * .61 + pi * .23) % 1, seed: pi * 3.1 + i * 1.7 }); });
  }
  let lastT = 0, flockDrawn = true;
  function drawFlock(p, t) {
    const vis = fade(p, .66, .72, .96, 1);
    set(el.flock, 'opacity', String(f3(vis)));
    const dt = Math.min(.033, Math.max(0, (t - (lastT || t)) / 1000)); lastT = t;
    if (vis < .01 || !B) { if (flockDrawn) { fctx.clearRect(0, 0, M.W, M.H); flockDrawn = false; } return; }
    flockDrawn = true;
    const { W, H, portrait } = M, ts = t / 1000;
    fctx.clearRect(0, 0, W, H);
    const k = seg(p, .66, 1);
    const unit = Math.min(W, H) * (portrait ? .085 : .06) * (1 + k * .35);
    for (const f of flock) {
      const pl = f.plane;
      B.step(f.bird, dt, ts + f.seed);
      // airspeed per plane (parallax): scroll-driven travel + gentle cruising
      const travel = k * 1.25 * pl.speed + ts * .012 * pl.speed;
      const x = ((((f.u - travel) % 1.4) + 1.4) % 1.4 - .2) * W;
      // thermal drift: slow lift and sink, which also drives banking
      const th = Math.sin(ts * .32 + f.seed), th2 = Math.sin(ts * .11 + f.seed * 2);
      const y = lerp(pl.band[0], pl.band[1], f.v) * H - k * .08 * H * pl.speed + th * unit * .45 * pl.scale + th2 * unit * .7 * pl.scale;
      B.draw(fctx, f.bird, {
        x, y, size: unit * pl.scale, yaw: Math.PI + .7 + Math.sin(ts * .2 + f.seed) * .06,
        roll: .05 + Math.cos(ts * .32 + f.seed) * .22, pitch: -Math.cos(ts * .32 + f.seed) * .05, cam: .5,
        mode: pl.mode, color: pl.color, alpha: pl.alpha,
      });
    }
  }

  // ---------- render ----------
  let target = 0, cur = 0, raf = 0, visible = true, lastAlt = '', scrolled = false;
  const fmt = (n) => String(Math.round(n / 10) * 10).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  function render(p, t) {
    // 1. Intro logo flies to the header
    const lp = eio(seg(p, .035, .16));
    set(el.introLogo, 'transform', tx(flip.dx * lp, flip.dy * lp, lerp(1, flip.s, lp)));
    set(el.introLogo, 'opacity', p > .158 ? '0' : '1');
    set(el.introTag, 'opacity', String(f3(1 - seg(p, .015, .07))));
    // dark logo over bright clouds → white logo once the dark cabin wall surrounds it
    if (el.introWhite) set(el.introWhite, 'opacity', String(f3(seg(p, .065, .11))));
    set(el.intro, 'visibility', p > .17 ? 'hidden' : 'visible');
    hdr?.classList.toggle('logo-landed', p > .155);
    hdr?.classList.toggle('nav-in', p > .13);

    // 2. Cabin: pull back into the cabin, then push through the window
    const pull = eout(seg(p, .05, .25)), push = ein(seg(p, .4, .53));
    const cs = p < .4 ? lerp(S0, 1, pull) : lerp(1, S0 * 1.6, push);
    if (p < .545) drawCabin(cs);
    set(el.cabin, 'opacity', String(f3(1 - seg(p, .5, .54))));
    set(el.cabin, 'visibility', p > .545 ? 'hidden' : 'visible');

    // 3. Sky through the window: drift, then tilt down and dive
    const dive = eio(seg(p, .4, .6));
    set(el.clouds, 'transform', `translate3d(${f3(Math.sin(t * .00008) * 1.2)}%, ${f3(-dive * 12)}%, 0) scale3d(${f3(1.06 + dive * .42)}, ${f3(1.06 + dive * .42)}, 1)`);
    set(el.clouds, 'opacity', String(f3(1 - seg(p, .56, .64))));

    // 4. Copy
    const o1 = fade(p, .2, .26, .35, .41);
    set(el.c1, 'opacity', String(f3(o1)));
    set(el.c1, 'transform', tx(0, (1 - seg(p, .2, .26)) * 24 - seg(p, .35, .41) * 30));
    set(el.c1, 'pointerEvents', o1 > .5 ? 'auto' : 'none');
    set(el.c1, 'visibility', o1 > 0 ? 'visible' : 'hidden');
    const o2 = fade(p, .5, .56, .69, .75);
    set(el.c2, 'opacity', String(f3(o2)));
    set(el.c2, 'transform', tx(0, (1 - seg(p, .5, .62)) * 60 - seg(p, .69, .75) * 40, lerp(.94, 1.04, seg(p, .5, .75))));
    set(el.c2, 'visibility', o2 > 0 ? 'visible' : 'hidden');
    const o3 = seg(p, .82, .9);
    set(el.c3, 'opacity', String(f3(o3)));
    set(el.c3, 'transform', tx(0, (1 - eout(o3)) * 40));
    set(el.c3, 'visibility', o3 > 0 ? 'visible' : 'hidden');

    // 5. France below: revealed as clouds part (mist instead of blur), then we come closer
    const fr = seg(p, .58, .7), near = eio(seg(p, .6, 1));
    set(el.france, 'opacity', String(f3(fr)));
    const fz = lerp(1, FRANCE_MAX_ZOOM, near);
    set(el.france, 'transform', `translate3d(0, ${f3(near * 1.5)}%, 0) scale3d(${f3(fz)}, ${f3(fz)}, 1)`);
    set(el.haze, 'opacity', String(f3(1 - seg(p, .6, .86) * .92)));

    // 6. HUD (altitude text changes in steps of 10 m inside a size-contained box)
    const alt = fmt(10670 * (1 - eio(seg(p, .05, .97))));
    if (alt !== lastAlt) { el.alt.textContent = alt; lastAlt = alt; }
    set(el.bar, 'transform', `scale3d(${f3(p)}, 1, 1)`);
    // scroll prompt: leaves as soon as the visitor starts the descent
    const hint = 1 - seg(p, .004, .035);
    set(el.cue, 'opacity', String(f3(hint)));
    set(el.cue, 'visibility', hint > 0 ? 'visible' : 'hidden');
    if (p > .004 && !scrolled) { scrolled = true; root.classList.remove('hint-nudge'); }
    // dark header, HUD and prompt while the background is bright: the opening clouds and the fog
    const light = p < .075 || (p > .5 && p < .7);
    hdr?.classList.toggle('on-light', light);
    root.classList.toggle('on-light', light);
    root.classList.toggle('is-done', p > .97);
    ai?.classList.toggle('is-ready', p > .9);
  }

  function frame(t) {
    raf = 0;
    target = clamp((scrollY - M.top) / M.runway);
    const gap = Math.abs(target - cur);
    cur = gap < .0005 || gap > .12 ? target : cur + (target - cur) * .14;   // snap only after reloads / jumps
    render(cur, t);
    drawClouds(cur, t);
    drawFlock(cur, t);
    // keep ticking while visible (birds and clouds breathe); idle otherwise
    if (visible) raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

  // ---------- boot ----------
  measure();
  gradePhotos();
  if (reduce) {
    root.classList.add('is-static');
    hdr?.classList.add('logo-landed', 'nav-in');
    ai?.classList.add('is-ready');
    buildCabin(); drawCabin(1);
    return;
  }

  root.classList.add('is-live');
  initClouds();
  const relayout = () => { measure(); buildCabin(); measureFlip(); sizeCanvases(); buildFlock(); kick(); };
  let rT = 0, rw = innerWidth;
  addEventListener('resize', () => {
    clearTimeout(rT);
    rT = setTimeout(() => {
      // ignore mobile URL-bar height changes; rebuild on real width changes
      if (coarse && Math.abs(innerWidth - rw) < 40) { measure(); return; }
      rw = innerWidth; relayout();
    }, 150);
  });
  relayout();
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) { lastT = 0; kick(); } else { hdr?.classList.add('logo-landed', 'nav-in'); ai?.classList.add('is-ready'); }
  }).observe(root);
  addEventListener('scroll', kick, { passive: true });
  document.fonts?.ready.then(() => { measure(); measureFlip(); kick(); });
  addEventListener('load', () => { measure(); kick(); }, { once: true });

  // scroll prompt: touch wording on phones; a stronger nudge if nobody has scrolled after a few seconds
  const cueLabel = $('[data-cue-label]');
  const T = window.FST || ((x) => x);
  if (cueLabel && coarse) cueLabel.textContent = T('Swipe up to begin your journey');
  setTimeout(() => { if (!scrolled && cur < .004) root.classList.add('hint-nudge'); }, 4000);

  el.skip.addEventListener('click', () => {
    const y = M.top + M.runway + M.H * .02;
    window.FSScrollTo ? window.FSScrollTo(y) : scrollTo({ top: y, behavior: 'smooth' });
  });
})();
