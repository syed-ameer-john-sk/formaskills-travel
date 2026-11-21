/* Formaskills Travel — "France begins before you land." scroll-driven flight.
   Sequence (progress 0 → 1 over a sticky stage):
   logo → logo flies to the header → cabin window frames the sky → headline in the window →
   push through the window → descend through clouds ("France begins before you land.") →
   clouds part over Sète → birds and the coast come closer → page continues. */
(() => {
  const root = document.querySelector('[data-flight]');
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const hdr = document.querySelector('[data-hdr]');
  const slot = hdr && hdr.querySelector('[data-logo-slot]');
  const stage = $('[data-stage]');
  const el = {
    cabin: $('[data-cabin]'), svg: $('[data-cabin-svg]'), clouds: $('[data-clouds]'), france: $('[data-france]'),
    franceImg: $('[data-france-img]'), haze: $('[data-haze]'), layer: $('[data-cloudlayer]'), flock: $('[data-flock]'),
    gull: $('[data-gull]'), intro: $('[data-intro]'), introLogo: $('[data-intro-logo]'), c1: $('[data-copy1]'),
    c2: $('[data-copy2]'), c3: $('[data-copy3]'), alt: $('[data-alt]'), bar: $('[data-bar]'), cue: $('[data-cue]'),
    glare: $('[data-glare]'), skip: $('[data-skip]'),
  };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ai = document.querySelector('[data-ai]');

  // ---------- helpers ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;
  const eio = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const eout = (t) => 1 - Math.pow(1 - t, 3);
  const ein = (t) => t * t * t;
  const fade = (p, a, b, c, d) => Math.min(seg(p, a, b), 1 - seg(p, c, d)); // in a→b, out c→d

  let W = 0, H = 0, win = { w: 0, h: 0, cx: 0, cy: 0 }, S0 = 5, flip = { dx: 0, dy: 0, s: 1 };

  // ---------- cabin wall with window (SVG, built to the viewport) ----------
  const rr = (cx, cy, w, h, r) => {
    const x = cx - w / 2, y = cy - h / 2; r = Math.min(r, w / 2, h / 2);
    return `M${x + r},${y}H${x + w - r}A${r},${r} 0 0 1 ${x + w},${y + r}V${y + h - r}A${r},${r} 0 0 1 ${x + w - r},${y + h}H${x + r}A${r},${r} 0 0 1 ${x},${y + h - r}V${y + r}A${r},${r} 0 0 1 ${x + r},${y}Z`;
  };
  function buildCabin() {
    W = stage.clientWidth; H = stage.clientHeight;
    const portrait = W < H;
    let h = Math.min(H * (portrait ? .62 : .74), 780), w = h * (portrait ? .74 : .7);
    if (w > W * (portrait ? .8 : .7)) { w = W * (portrait ? .8 : .7); h = w / (portrait ? .74 : .7); }
    const cx = W / 2, cy = H * .52, r = w * .46, f = w * .16;
    win = { w, h, cx, cy };
    root.style.setProperty('--win-w', `${Math.round(w)}px`);
    S0 = Math.max(W / (w * .82), H / (h * .82)) * 1.2;
    const wall = `M0,0H${W}V${H}H0Z`;
    el.svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    el.svg.innerHTML = `
      <defs>
        <linearGradient id="cw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b2545"/><stop offset=".55" stop-color="#43304f"/><stop offset="1" stop-color="#1e1a35"/></linearGradient>
        <radialGradient id="cg" cx="${cx}" cy="${cy}" r="${Math.max(W, H) * .55}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f4a76a" stop-opacity=".55"/><stop offset=".35" stop-color="#b8687a" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
        <linearGradient id="cf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1d2c2"/><stop offset=".4" stop-color="#b98fa0"/><stop offset="1" stop-color="#4a3553"/></linearGradient>
        <linearGradient id="ci" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a44"/><stop offset="1" stop-color="#7a5468"/></linearGradient>
        <linearGradient id="cs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9ddd6"/><stop offset="1" stop-color="#cbb5b5"/></linearGradient>
        <clipPath id="cwin"><path d="${rr(cx, cy, w, h, r)}"/></clipPath>
        <filter id="cb" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${f * .18}"/></filter>
      </defs>
      <path fill="url(#cw)" fill-rule="evenodd" d="${wall}${rr(cx, cy, w + f * 2, h + f * 2, r + f)}"/>
      <path fill="url(#cg)" fill-rule="evenodd" d="${wall}${rr(cx, cy, w + f * 2, h + f * 2, r + f)}"/>
      <path fill="url(#cf)" fill-rule="evenodd" d="${rr(cx, cy, w + f * 2, h + f * 2, r + f)}${rr(cx, cy, w + f * .9, h + f * .9, r + f * .45)}"/>
      <path fill="url(#ci)" fill-rule="evenodd" d="${rr(cx, cy, w + f * .9, h + f * .9, r + f * .45)}${rr(cx, cy, w, h, r)}"/>
      <path fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5" d="${rr(cx, cy, w + f * 2 - 2, h + f * 2 - 2, r + f)}"/>
      <g clip-path="url(#cwin)">
        <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h * .085}" fill="url(#cs)"/>
        <rect x="${cx - w / 2}" y="${cy - h / 2 + h * .085}" width="${w}" height="3" fill="#000" opacity=".18"/>
        <path fill="none" stroke="#000" stroke-opacity=".35" stroke-width="${f * .5}" filter="url(#cb)" d="${rr(cx, cy, w + f * .25, h + f * .25, r)}"/>
      </g>`;
    el.cabin.style.transformOrigin = `${cx}px ${cy}px`;
    measureFlip();
  }
  function measureFlip() {
    if (!slot || !el.introLogo) return;
    const prev = el.introLogo.style.transform;
    el.introLogo.style.transform = 'none';
    const a = el.introLogo.getBoundingClientRect(), st = stage.getBoundingClientRect();
    const b = slot.getBoundingClientRect(), hr = hdr.getBoundingClientRect();
    el.introLogo.style.transform = prev;
    flip = { dx: (b.left - hr.left) - (a.left - st.left), dy: (b.top - hr.top) - (a.top - st.top), s: b.width / a.width };
  }

  // ---------- procedural cloud sprites ----------
  const sprites = [];
  function makeSprite(seed) {
    const c = document.createElement('canvas'); const s = 320; c.width = s; c.height = s * .62;
    const g = c.getContext('2d'); let r = seed;
    const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < 26; i++) {
      const x = s * (.18 + rnd() * .64), y = c.height * (.38 + rnd() * .32), rad = s * (.08 + rnd() * .16);
      const gr = g.createRadialGradient(x, y - rad * .3, rad * .1, x, y, rad);
      gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(.55, 'rgba(255,246,240,.55)'); gr.addColorStop(1, 'rgba(255,236,226,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
    }
    g.globalCompositeOperation = 'source-atop';
    const sh = g.createLinearGradient(0, 0, 0, c.height); sh.addColorStop(.45, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(214,170,170,.45)');
    g.fillStyle = sh; g.fillRect(0, 0, s, c.height);
    return c;
  }
  const puffs = [];
  function initClouds() {
    for (let i = 0; i < 4; i++) sprites.push(makeSprite(17 + i * 101));
    let r = 7; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < 34; i++) puffs.push({ x: (rnd() - .5) * 2.6, y: (rnd() - .5) * 2.2, z: .25 + rnd() * 1.8, sp: sprites[i % 4], d: rnd() });
  }
  const lctx = el.layer.getContext('2d');
  let dpr = Math.min(1.5, devicePixelRatio || 1);
  function sizeCanvas(c) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0); }
  function drawClouds(p, t) {
    const vis = fade(p, .44, .5, .66, .76);
    el.layer.style.opacity = vis.toFixed(3);
    if (vis <= 0) return;
    lctx.clearRect(0, 0, W, H);
    const travel = seg(p, .44, .76) * 1.9, part = eio(seg(p, .62, .76));
    const fov = Math.max(W, H) * .42;
    const list = puffs.map(o => {
      let z = o.z - travel; z = ((z - .05) % 2 + 2) % 2 + .05;
      return { o, z };
    }).sort((a, b) => b.z - a.z);
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

  // ---------- birds ----------
  const fctx = el.flock.getContext('2d');
  const flockBirds = Array.from({ length: 11 }, (_, i) => ({ ox: (i % 4) * .055 + Math.random() * .03, oy: Math.floor(i / 4) * .05 + (i % 2) * .02, s: .7 + Math.random() * .6, ph: Math.random() * 6.28, sp: 6 + Math.random() * 2 }));
  function drawFlock(p, t) {
    const vis = fade(p, .66, .72, .94, 1);
    el.flock.style.opacity = vis.toFixed(3);
    if (vis <= 0) return;
    fctx.clearRect(0, 0, W, H);
    const k = seg(p, .66, 1), base = Math.min(W, H);
    const fx = lerp(1.05, -.35, k) * W, fy = lerp(.42, .18, k) * H;
    fctx.strokeStyle = 'rgba(28,34,70,.78)'; fctx.lineCap = 'round';
    for (const b of flockBirds) {
      const x = fx + b.ox * W + Math.sin(t * .0007 + b.ph) * 6, y = fy + b.oy * H + Math.cos(t * .0009 + b.ph) * 5;
      const size = base * .018 * b.s * (1 + k * .9), flap = Math.sin(t * .001 * b.sp + b.ph);
      fctx.lineWidth = Math.max(1.2, size * .16);
      window.FSBirds?.draw(fctx, x, y, size, flap);
    }
  }

  // ---------- render ----------
  let target = 0, cur = 0, lastP = -1, raf = 0, visible = true;
  const progressFromScroll = () => {
    const r = root.getBoundingClientRect();
    const total = root.offsetHeight - stage.offsetHeight;
    return total > 0 ? clamp(-r.top / total) : 0;
  };
  const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  function render(p, t) {
    // 1. Intro logo flies to the header
    const lp = eio(seg(p, .035, .16));
    el.introLogo.style.transform = `translate3d(${flip.dx * lp}px, ${flip.dy * lp}px, 0) scale(${lerp(1, flip.s, lp)})`;
    el.introLogo.style.opacity = p > .158 ? 0 : 1;
    el.intro.querySelector('.fl-intro__tag').style.opacity = 1 - seg(p, .015, .07);
    hdr?.classList.toggle('logo-landed', p > .155);
    hdr?.classList.toggle('nav-in', p > .13);
    el.intro.style.visibility = p > .17 ? 'hidden' : 'visible';

    // 2. Cabin: pull back into the cabin, then push through the window
    const pull = eout(seg(p, .05, .25)), push = ein(seg(p, .4, .53));
    const cs = p < .4 ? lerp(S0, 1, pull) : lerp(1, S0 * 1.6, push);
    el.cabin.style.transform = `scale(${cs})`;
    el.cabin.style.opacity = (1 - seg(p, .5, .54)).toFixed(3);
    el.cabin.style.visibility = p > .545 ? 'hidden' : 'visible';
    el.glare.style.opacity = (fade(p, .1, .25, .4, .5) * .9).toFixed(3);

    // 3. Sky through the window: drift, then tilt down and dive
    const dive = eio(seg(p, .4, .6));
    const drift = Math.sin(t * .00008) * 1.2;
    el.clouds.style.transform = `translate3d(${drift}%, ${-dive * 14}%, 0) scale(${1.06 + dive * .7})`;
    el.clouds.style.opacity = (1 - seg(p, .56, .64)).toFixed(3);
    el.clouds.style.filter = `brightness(${1 + dive * .25}) saturate(${1 - dive * .2})`;

    // 4. Copy
    const o1 = fade(p, .2, .26, .35, .41);
    el.c1.style.opacity = o1.toFixed(3);
    el.c1.style.transform = `translate3d(0, ${(1 - seg(p, .2, .26)) * 24 - seg(p, .35, .41) * 30}px, 0)`;
    el.c1.style.pointerEvents = o1 > .5 ? 'auto' : 'none';
    el.c1.style.visibility = o1 > 0 ? 'visible' : 'hidden';
    const o2 = fade(p, .5, .56, .69, .75);
    el.c2.style.opacity = o2.toFixed(3);
    el.c2.style.transform = `translate3d(0, ${(1 - seg(p, .5, .62)) * 60 - seg(p, .69, .75) * 40}px, 0) scale(${lerp(.94, 1.04, seg(p, .5, .75))})`;
    el.c2.style.visibility = o2 > 0 ? 'visible' : 'hidden';
    const o3 = seg(p, .82, .9);
    el.c3.style.opacity = o3.toFixed(3);
    el.c3.style.transform = `translate3d(0, ${(1 - eout(o3)) * 40}px, 0)`;
    el.c3.style.visibility = o3 > 0 ? 'visible' : 'hidden';

    // 5. France below: revealed as clouds part, then we come closer
    const fr = seg(p, .58, .7), near = eio(seg(p, .6, 1));
    el.france.style.opacity = fr.toFixed(3);
    el.france.style.transform = `scale(${lerp(1.02, 1.5, near)}) translate3d(0, ${near * 3}%, 0)`;
    el.franceImg.style.filter = `blur(${((1 - seg(p, .6, .78)) * 6).toFixed(2)}px)`;
    el.haze.style.opacity = (1 - seg(p, .62, .86) * .9).toFixed(3);

    // 6. Seagull passes close by
    const g = seg(p, .7, .97);
    if (g > 0 && g < 1) {
      const gx = lerp(W * 1.05, -W * .45, g), gy = lerp(H * .62, H * .1, eout(g)) + Math.sin(t * .002) * 6;
      el.gull.style.opacity = Math.min(1, g * 6, (1 - g) * 6).toFixed(3);
      el.gull.style.transform = `translate3d(${gx}px, ${gy}px, 0) scale(${lerp(.55, 1.5, g)}) rotate(${lerp(-8, 6, g)}deg)`;
    } else el.gull.style.opacity = 0;

    // 7. HUD
    el.alt.textContent = fmt(10670 * (1 - eio(seg(p, .05, .97))));
    el.bar.style.transform = `scaleX(${p.toFixed(4)})`;
    el.cue.style.opacity = (1 - seg(p, .02, .06)).toFixed(3);
    const light = p > .5 && p < .7;
    hdr?.classList.toggle('on-light', light);
    root.classList.toggle('on-light', light);
    root.classList.toggle('is-done', p > .97);
    ai?.classList.toggle('is-ready', p > .9);
  }

  function frame(t) {
    raf = 0;
    target = progressFromScroll();
    cur += (target - cur) * (Math.abs(target - cur) < .0005 ? 1 : .16);
    if (cur !== lastP || visible) {
      render(cur, t);
      drawClouds(cur, t);
      drawFlock(cur, t);
      lastP = cur;
    }
    if (visible) raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

  // ---------- boot ----------
  function setStatic() {
    root.classList.add('is-static');
    hdr?.classList.add('logo-landed', 'nav-in');
    ai?.classList.add('is-ready');
    buildCabin();
  }
  if (reduce) { setStatic(); return; }

  root.classList.add('is-live');
  initClouds();
  const resize = () => { buildCabin(); sizeCanvas(el.layer); sizeCanvas(el.flock); lastP = -1; kick(); };
  let rw = innerWidth;
  addEventListener('resize', () => { if (Math.abs(innerWidth - rw) > 40 || !matchMedia('(pointer: coarse)').matches) { rw = innerWidth; resize(); } else measureFlip(); });
  resize();
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); else { hdr?.classList.add('logo-landed', 'nav-in'); ai?.classList.add('is-ready'); } }).observe(root);
  addEventListener('scroll', kick, { passive: true });
  document.fonts?.ready.then(() => { measureFlip(); kick(); });

  el.skip.addEventListener('click', () => {
    const y = root.offsetTop + root.offsetHeight - stage.offsetHeight * .02;
    window.FSScrollTo ? window.FSScrollTo(y) : scrollTo({ top: y, behavior: 'smooth' });
  });
})();
