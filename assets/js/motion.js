/* Formaskills Travel — scroll and pointer motion, shared by every page.
   - Reveal on scroll (fade and rise, staggered inside grids) for content below the fold
   - Self-drawing timeline ([data-timeline])
   - Video story cards: load when near, play only while visible, poster for reduced motion / data saver
   - Sticky "Enquire" button after the hero
   - Desktop only (hover + fine pointer, no reduced motion): cursor glow, magnetic buttons, card tilt
   Transforms and opacity only; scroll/pointer work is batched into one rAF. */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection?.saveData === true;

  // ---------- Reveal on scroll ----------
  // Only content that starts below the fold is hidden, so nothing visible ever blinks out.
  if (!reduce && 'IntersectionObserver' in window) {
    const SKIP = '.flight, .mapx__map, [hidden], .sr-only, script, style, .wave';
    const io = new IntersectionObserver((es) => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in'); io.unobserve(e.target);
    }), { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    const fold = innerHeight;
    const tag = (el, i = 0) => {
      if (el.matches(SKIP) || el.getBoundingClientRect().top < fold) return;
      el.classList.add('rv'); el.style.setProperty('--rd', Math.min(i, 6)); io.observe(el);
    };
    $$('main .sec > .wrap > *, .after-flight .sec > .wrap > *, .cta-band__in > *').forEach(el => {
      const kids = [...el.children].filter(k => !k.matches(SKIP));
      const d = getComputedStyle(el).display;
      // grids and rows of cards: stagger the items instead of moving the whole block
      if ((d === 'grid' || d === 'flex') && kids.length >= 2 && kids.length <= 9 && el.tagName !== 'FORM') kids.forEach(tag);
      else tag(el);
    });
  }

  // ---------- Map: outline draws in and markers pop in once it is on screen ----------
  $$('.mapx__map').forEach(m => {
    if (reduce || !('IntersectionObserver' in window)) { m.classList.add('is-in'); return; }
    const mo = new IntersectionObserver(([e]) => { if (e.isIntersecting) { m.classList.add('is-in'); mo.disconnect(); } }, { threshold: .3 });
    mo.observe(m);
  });

  // ---------- Timeline that draws itself ----------
  const lines = $$('[data-timeline]');
  const runTimeline = () => {
    for (const ol of lines) {
      const r = ol.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const p = Math.min(1, Math.max(0, (innerHeight * .78 - r.top) / (r.height || 1)));
      ol.style.setProperty('--tp', p.toFixed(3));
      const items = ol.children;
      for (let i = 0; i < items.length; i++) items[i].classList.toggle('is-lit', p >= i / Math.max(1, items.length - 1) - .02);
    }
  };
  if (reduce) lines.forEach(ol => { ol.style.setProperty('--tp', 1); [...ol.children].forEach(li => li.classList.add('is-lit')); });

  // ---------- Video story cards ----------
  const stories = $$('[data-story]');
  const motionOk = !reduce && !saveData;
  // Posters (and, when motion is allowed, the clips) are fetched only as the cards approach.
  const load = (v) => {
    if (v.dataset.poster && !v.poster) v.poster = v.dataset.poster;
    if (!motionOk || v.dataset.loaded) return; v.dataset.loaded = '1';
    $$('source[data-src]', v).forEach(s => { s.src = s.dataset.src; });
    v.load();
  };
  if (!('IntersectionObserver' in window)) stories.forEach(s => load($('video', s)));
  else if (stories.length) {
    const near = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { load($('video', e.target)); near.unobserve(e.target); } }), { rootMargin: '400px 0px' });
    stories.forEach(s => near.observe(s));
    if (motionOk) {   // play only while at least ~half visible
      const vis = new IntersectionObserver((es) => es.forEach(e => {
        const v = $('video', e.target);
        if (e.isIntersecting) { load(v); v.play().then(() => e.target.classList.add('is-playing')).catch(() => {}); }
        else v.pause();
      }), { threshold: .45 });
      stories.forEach(s => vis.observe(s));
      document.addEventListener('visibilitychange', () => { if (document.hidden) stories.forEach(s => $('video', s).pause()); });
    }
  }

  // ---------- Landing film (called by flight.js as the plane lands) ----------
  // The France film loads on first landing only, plays at 0.6x, and pauses whenever the landing is off
  // screen or the tab is hidden. Never loaded with data saver; the Sète aerial photo stays underneath.
  const reel = $('[data-reel]'), film = reel && $('.fl-reel__film', reel), FILM_RATE = .6;
  if (reel && film) {
    let on = false;
    const run = () => {
      if (!motionOk) return;
      if (!on || document.hidden) { film.pause(); return; }
      if (!film.src) {
        film.defaultPlaybackRate = FILM_RATE; film.src = film.dataset.src;
        film.addEventListener('loadedmetadata', () => { film.playbackRate = FILM_RATE; });
        film.addEventListener('playing', () => film.classList.add('is-playing'));
      }
      film.playbackRate = FILM_RATE; film.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', run);
    window.FSReel = (v) => { if (v === on) return; on = v; reel.classList.toggle('is-on', on); run(); };
  }

  // ---------- Chatbot launcher: greeting bubble once per visit, halo until first opened ----------
  const ai = $('[data-ai]'), hello = $('[data-ai-hello]');
  if (ai && hello) {
    let seen = false; try { seen = sessionStorage.getItem('fs-ai-hi') === '1'; } catch (e) {}
    const hide = () => { hello.classList.remove('is-on'); try { sessionStorage.setItem('fs-ai-hi', '1'); } catch (e) {} };
    $$('[data-ai-toggle]', ai).forEach(b => b.addEventListener('click', () => { hide(); ai.classList.add('was-opened'); }));
    if (!seen) {
      const show = () => { if (!ai.classList.contains('is-open')) { hello.classList.add('is-on'); setTimeout(hide, 7000); } };
      // after a moment on the page (on the home page: only once the plane has landed)
      const wait = () => (!document.body.classList.contains('is-home') || ai.classList.contains('is-ready')) ? setTimeout(show, 2200) : setTimeout(wait, 600);
      wait();
    }
  }

  // ---------- Sticky Enquire ----------
  const stick = $('[data-stick-enq]');
  const flight = $('[data-flight]');
  // hidden while the closing call to action or the footer is on screen (they have their own buttons)
  const endsOn = new Set();
  if (stick && 'IntersectionObserver' in window) {
    const eo = new IntersectionObserver((es) => { es.forEach(e => e.isIntersecting ? endsOn.add(e.target) : endsOn.delete(e.target)); runStick(); });
    $$('.cta-band, .ftr').forEach(el => eo.observe(el));
  }
  // measured lazily (first scroll) so page start-up never forces a layout
  let start = -1;
  const measureStick = () => { start = flight ? flight.offsetTop + flight.offsetHeight - innerHeight * .5 : innerHeight * .8; };
  addEventListener('resize', () => { start = -1; });
  function runStick() {
    if (!stick) return;
    if (start < 0) measureStick();
    const show = scrollY > start && !endsOn.size && document.documentElement.style.overflow !== 'hidden';
    stick.classList.toggle('is-on', show);
  }

  // one rAF for scroll-driven work
  let ticking = false;
  const onScroll = () => { ticking = false; runTimeline(); runStick(); };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  requestAnimationFrame(onScroll);   // first measurement in a frame, not during start-up

  // ---------- Desktop pointer effects ----------
  if (reduce || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.documentElement.classList.add('has-pointer');
  const glow = $('[data-cursor-glow]'), cur = $('[data-cursor]'), dot = cur && $('.cursor__dot', cur);
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 }, g = { x: mouse.x, y: mouse.y };
  const HOT = 'a, button, [role="tab"], label, summary, [data-reel-p], .story, .path';
  const DARK = '.sec--map, .ftr, .cta-band, .flight, .ai__head, .story, .dest__fig, .srail, video';
  let glowOn = false, raf = 0;
  const QUIET = 'input, textarea, select, video, iframe, .mapx__map, [contenteditable]';
  const mags = new Set();   // magnetic elements currently being moved
  const frame = () => {
    raf = 0; let busy = false;
    if (cur) {
      dot.style.transform = `translate3d(${mouse.x.toFixed(1)}px, ${mouse.y.toFixed(1)}px, 0)`;
    }
    if (glow) {
      g.x += (mouse.x - g.x) * .16; g.y += (mouse.y - g.y) * .16;
      glow.style.transform = `translate3d(${(g.x - 210).toFixed(1)}px, ${(g.y - 210).toFixed(1)}px, 0)`;
      if (Math.abs(mouse.x - g.x) + Math.abs(mouse.y - g.y) > .3) busy = true;
    }
    for (const m of mags) {
      m.cx += (m.tx - m.cx) * .2; m.cy += (m.ty - m.cy) * .2;
      m.el.style.translate = `${m.cx.toFixed(2)}px ${m.cy.toFixed(2)}px`;
      if (Math.abs(m.tx - m.cx) + Math.abs(m.ty - m.cy) > .05) busy = true;
      else if (!m.tx && !m.ty) { m.el.style.translate = ''; mags.delete(m); }
    }
    if (busy) raf = requestAnimationFrame(frame);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  addEventListener('pointermove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    const quiet = e.target.closest?.(QUIET);
    const on = !quiet;
    if (on !== glowOn) { glowOn = on; glow?.classList.toggle('is-on', on); cur?.classList.toggle('is-on', on); }
    if (cur) {
      const hot = !!e.target.closest?.(HOT), dark = !!e.target.closest?.(DARK);
      if (hot !== cur.classList.contains('is-hot')) cur.classList.toggle('is-hot', hot);
      if (dark !== cur.classList.contains('is-dark')) cur.classList.toggle('is-dark', dark);
    }
    kick();
  }, { passive: true });
  document.addEventListener('pointerleave', () => { glowOn = false; glow?.classList.remove('is-on'); cur?.classList.remove('is-on'); });
  addEventListener('pointerdown', () => cur?.classList.add('is-down'));
  addEventListener('pointerup', () => cur?.classList.remove('is-down'));

  // magnetic: primary buttons and calls to action ease towards the pointer (max ~8px) and back
  $$('.btn:not(form .btn), [data-magnetic]').forEach(el => {
    const st = { el, tx: 0, ty: 0, cx: 0, cy: 0 };
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      st.tx = Math.max(-8, Math.min(8, (e.clientX - (r.left + r.width / 2)) * .22));
      st.ty = Math.max(-6, Math.min(6, (e.clientY - (r.top + r.height / 2)) * .3));
      mags.add(st); kick();
    });
    el.addEventListener('pointerleave', () => { st.tx = 0; st.ty = 0; mags.add(st); kick(); });
  });

  // gentle 3D tilt on cards
  $$('.path, .story:not(.story--page)').forEach(el => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--rx', `${(((e.clientY - r.top) / r.height) - .5) * -5}deg`);
      el.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width) - .5) * 6}deg`);
    });
    el.addEventListener('pointerleave', () => { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); });
  });
})();
