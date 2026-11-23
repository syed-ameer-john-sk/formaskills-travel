/* Formaskills Travel — site-wide interactions */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const EMAIL = 'contact.skillstravel@gmail.com';
  // i18n: strings come from window.FS_T (injected per language at build time), English as fallback
  const LANG = window.FS_LANG || 'en', BASE = window.FS_BASE || '';
  const T = (s, vars) => { let v = (window.FS_T && window.FS_T[s]) || s; if (vars) for (const k in vars) v = v.split(`{${k}}`).join(vars[k]); return v; };
  const localHref = (html) => html.replace(/href="\/(?!\/|assets\/)/g, `href="${BASE}/`);
  window.FST = T;
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };

  // ---------- Smooth scroll (desktop pointers only) ----------
  const hdr = $('[data-hdr]');
  const hdrH = () => (hdr ? hdr.offsetHeight : 0); // used only on clicks, never in scroll
  let lenis = null;
  if (!reduce && !coarse && window.Lenis) {
    lenis = new window.Lenis({ lerp: .09, wheelMultiplier: .95 });
    const loop = (t) => { lenis.raf(t); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
  window.FSScrollTo = (y) => lenis ? lenis.scrollTo(y, { duration: 1.6 }) : scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  const scrollToEl = (elm) => window.FSScrollTo(elm.getBoundingClientRect().top + scrollY - hdrH() - 16);

  // ---------- Toast & clipboard ----------
  const toastEl = $('[data-toast]');
  let toastT;
  const toast = (msg) => { if (!toastEl) return; toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2600); };
  const copy = async (text, msg = T('Copied')) => {
    try { await navigator.clipboard.writeText(text); toast(msg); }
    catch { const t = document.createElement('textarea'); t.value = text; document.body.append(t); t.select(); document.execCommand('copy'); t.remove(); toast(msg); }
  };
  window.FSCopy = copy; window.FSToast = toast;
  $$('[data-copy-text]').forEach(b => b.addEventListener('click', () => copy(b.dataset.copyText, T('Address copied'))));

  // ---------- Header: progress, hide on scroll, solid after the flight ----------
  const bar = $('.hdr__progress i');
  const flight = $('[data-flight]');
  const overlay = hdr?.classList.contains('hdr--overlay');
  // Layout metrics are cached here and refreshed only on load / debounced resize / content resize —
  // never read inside the scroll path.
  const MET = { max: 1, flightEnd: -1, hdrH: 0 };
  let measureParallax = null, runParallax = null;   // set by the parallax module below
  const measureSite = () => {
    MET.max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    MET.flightEnd = flight ? flight.offsetTop + flight.offsetHeight - innerHeight * .9 : -1;
    MET.hdrH = hdr ? hdr.offsetHeight : 0;
    measureParallax?.();
  };
  window.FSMeasure = measureSite;
  let lastY = scrollY, ticking = false, lastBar = '';
  const onScroll = () => {
    ticking = false;
    const y = scrollY;
    const b = `scale3d(${Math.min(1, y / MET.max).toFixed(4)}, 1, 1)`;
    if (bar && b !== lastBar) { bar.style.transform = b; lastBar = b; }
    runParallax?.(y);
    if (!hdr) return;
    if (overlay) hdr.classList.toggle('is-solid', y > MET.flightEnd);
    const inFlight = flight && y < MET.flightEnd;
    const panelOpen = document.documentElement.style.overflow === 'hidden';
    if (!inFlight && !panelOpen && y > 400 && y > lastY + 6) hdr.classList.add('is-hidden');
    else if (y < lastY - 6 || y < 400 || inFlight) hdr.classList.remove('is-hidden');
    lastY = y;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  let rsT = 0;
  const remeasure = () => { clearTimeout(rsT); rsT = setTimeout(() => { measureSite(); onScroll(); }, 150); };
  addEventListener('resize', remeasure);
  addEventListener('load', remeasure, { once: true });
  if ('ResizeObserver' in window) new ResizeObserver(remeasure).observe(document.body);
  measureSite();
  onScroll();
  if (!flight) hdr?.classList.add('logo-landed', 'nav-in');

  // ---------- Panels: menu drawer, enquire modal, search modal ----------
  let lastFocus = null, openEl = null;
  const focusables = (c) => $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', c).filter(e => e.offsetParent !== null);
  function openPanel(name, trigger) {
    const p = $(`[data-panel="${name}"]`); if (!p) return;
    if (openEl) closePanel(true);
    lastFocus = trigger || document.activeElement; openEl = p;
    p.hidden = false; requestAnimationFrame(() => p.classList.add('is-open'));
    document.documentElement.style.overflow = 'hidden'; lenis?.stop();
    $$(`[data-open="${name}"][aria-expanded]`).forEach(b => b.setAttribute('aria-expanded', 'true'));
    setTimeout(() => (p.querySelector('[data-search-input]') || p.querySelector('[aria-checked="true"]') || focusables(p)[0])?.focus(), 60);
    if (name === 'search') ensureIndex();
  }
  function closePanel(silent) {
    const p = openEl; if (!p) return;
    p.classList.remove('is-open'); openEl = null;
    $$('[data-open][aria-expanded]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    setTimeout(() => { p.hidden = true; }, 380);
    document.documentElement.style.overflow = ''; lenis?.start();
    if (!silent) lastFocus?.focus?.();
  }
  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-open]'); if (o) { e.preventDefault(); openPanel(o.dataset.open, o); return; }
    if (e.target.closest('[data-close]')) { closePanel(); return; }
    const a = e.target.closest('a[href]');
    if (a && openEl && openEl.contains(a)) closePanel(true);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openEl) closePanel();
    if (e.key === 'Tab' && openEl) {
      const f = focusables(openEl); if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    }
    if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); openPanel('search'); }
  });

  // Enquire: who is this for?
  const who = $$('[data-who]');
  const setWho = (w) => {
    who.forEach(b => b.setAttribute('aria-checked', String(b.dataset.who === w)));
    const sel = $('#mf-who'); if (sel) sel.value = w;
    const plan = $('[data-enq-link="plan"]'), write = $('[data-enq-link="write"]');
    if (plan) plan.href = `${BASE}/plan-your-stay/?for=${w}`;
    if (write) write.href = w === 'partner' ? `${BASE}/partners/#enquiry` : `${BASE}/contact/#write`;
  };
  who.forEach(b => {
    b.addEventListener('click', () => setWho(b.dataset.who));
    b.addEventListener('keydown', (e) => {
      if (!/Arrow(Left|Right|Up|Down)/.test(e.key)) return; e.preventDefault();
      const i = who.indexOf(b), n = who[(i + (/Right|Down/.test(e.key) ? 1 : who.length - 1)) % who.length];
      setWho(n.dataset.who); n.focus();
    });
  });
  const pagePath = location.pathname.slice(BASE.length) || '/';
  if (pagePath.startsWith('/partners')) setWho('partner');
  else if (pagePath.startsWith('/for-organisations')) setWho('org');

  // ---------- Language switcher (header dropdown; the choice is remembered) ----------
  $$('[data-lang-code]').forEach(a => a.addEventListener('click', () => store.set('fs-lang', a.dataset.langCode)));
  const lang = $('[data-lang]');
  if (lang) {
    const btn = $('.lang__btn', lang), menu = $('.lang__menu', lang), items = () => $$('a', menu);
    const setOpen = (open, focus) => {
      menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); lang.classList.toggle('is-open', open);
      if (open && focus) (menu.querySelector('[aria-current="true"]') || items()[0])?.focus();
    };
    btn.addEventListener('click', () => setOpen(menu.hidden, true));
    btn.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true, true); } });
    menu.addEventListener('keydown', (e) => {
      const list = items(), i = list.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
      if (e.key === 'Escape') { setOpen(false); btn.focus(); }
      if (e.key === 'Tab') setOpen(false);
    });
    document.addEventListener('click', (e) => { if (!lang.contains(e.target)) setOpen(false); });
  }

  // ---------- In-page anchors with smooth scroll ----------
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]'); if (!a || e.defaultPrevented) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash === '#') return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1))); if (!target) return;
    e.preventDefault();
    if (activateHash(url.hash)) { history.replaceState(null, '', url.hash); return; }
    history.replaceState(null, '', url.hash);
    scrollToEl(target);
    target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true });
  });

  // ---------- FAQ accordions ----------
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.faq__q button'); if (!b) return;
    const panel = document.getElementById(b.getAttribute('aria-controls'));
    const open = b.getAttribute('aria-expanded') === 'true';
    b.setAttribute('aria-expanded', String(!open));
    if (reduce) { panel.hidden = open; return; }
    if (!open) {
      panel.hidden = false; const h = panel.scrollHeight;
      panel.animate([{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.2,.7,.1,1)' });
    } else {
      const h = panel.scrollHeight;
      panel.animate([{ height: `${h}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 300, easing: 'cubic-bezier(.2,.7,.1,1)' }).onfinish = () => { panel.hidden = true; };
    }
  });

  // ---------- Tabs (generic role=tablist) ----------
  function selectTab(btn, { focus = false, scroll = false } = {}) {
    const list = btn.closest('[role="tablist"]');
    const tabs = $$('[role="tab"]', list);
    tabs.forEach(t => {
      const on = t === btn;
      t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) { panel.hidden = !on; if (on) { panel.classList.remove('is-entering'); void panel.offsetWidth; panel.classList.add('is-entering'); } }
    });
    if (focus) btn.focus();
    if (scroll) scrollToEl(list);
    btn.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    list.dispatchEvent(new CustomEvent('tabchange', { detail: btn }));
  }
  $$('[role="tablist"]').forEach(list => {
    const tabs = $$('[role="tab"]', list);
    tabs.forEach((t, i) => {
      t.tabIndex = t.getAttribute('aria-selected') === 'true' ? 0 : -1;
      t.addEventListener('click', () => selectTab(t));
      t.addEventListener('keydown', (e) => {
        let n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs.at(-1);
        if (n) { e.preventDefault(); selectTab(n, { focus: true }); }
      });
    });
  });
  // Hash deep links into tabs (e.g. /for-organisations/#job-shadowing, /what-we-offer/#org)
  function activateHash(hash) {
    const id = decodeURIComponent((hash || '').slice(1)); if (!id) return false;
    const panel = document.getElementById(id);
    if (!panel || panel.getAttribute('role') !== 'tabpanel') {
      if (panel && panel.closest('[role="tabpanel"][hidden]')) {
        const outer = panel.closest('[role="tabpanel"]');
        const ob = $(`[role="tab"][aria-controls="${outer.id}"]`); if (ob) selectTab(ob);
        setTimeout(() => scrollToEl(panel), 60); return true;
      }
      return false;
    }
    const outer = panel.parentElement.closest('[role="tabpanel"]');
    if (outer) { const ob = $(`[role="tab"][aria-controls="${outer.id}"]`); if (ob) selectTab(ob); }
    const b = $(`[role="tab"][aria-controls="${id}"]`); if (b) selectTab(b);
    setTimeout(() => scrollToEl(b ? b.closest('[role="tablist"]') : panel), 60);
    return true;
  }
  if (location.hash) setTimeout(() => { if (!activateHash(location.hash)) { const t = document.getElementById(location.hash.slice(1)); if (t) scrollToEl(t); } }, 120);
  addEventListener('hashchange', () => activateHash(location.hash));

  // ---------- Destination map ----------
  $$('[data-map]').forEach(map => {
    const svg = $('.map__svg', map), route = $('.map__route', map);
    const pins = $$('.map__pin', map);
    const pos = (slug) => { const g = $(`.map__pin[data-dest="${slug}"]`, map); const m = /translate\(([\d.]+) ([\d.]+)\)/.exec(g.getAttribute('transform')); return [+m[1], +m[2]]; };
    const area = $('.map__area', map);
    const show = (slug) => {
      pins.forEach(p => p.classList.toggle('is-on', p.dataset.dest === slug));
      if (area) { const [ax, ay] = pos(slug); area.style.transform = `translate(${ax}px, ${ay}px)`; }
      $$('[data-dest-panel]', map).forEach(p => { const on = p.dataset.destPanel === slug; if (on && p.hidden) { p.hidden = false; p.classList.remove('is-entering'); void p.offsetWidth; p.classList.add('is-entering'); } else if (!on) p.hidden = true; });
      if (route) {
        if (slug === 'sete') { route.setAttribute('d', ''); return; }
        const [x1, y1] = pos('sete'), [x2, y2] = pos(slug);
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, k = .28;
        const d = `M${x1},${y1} Q${mx - dy * k},${my + dx * k} ${x2},${y2}`;
        route.setAttribute('d', d);
        if (!reduce) { const L = route.getTotalLength(); route.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 900, easing: 'cubic-bezier(.2,.7,.1,1)' }); }
      }
    };
    const tabs = $$('[data-dest-tab]', map);
    const list = tabs[0]?.closest('[role="tablist"]');
    list?.addEventListener('tabchange', (e) => show(e.detail.dataset.destTab));
    pins.forEach(p => {
      p.setAttribute('tabindex', '-1');
      p.addEventListener('click', () => { const t = tabs.find(t => t.dataset.destTab === p.dataset.dest); if (t) selectTab(t, { focus: true }); });
    });
    show(tabs.find(t => t.getAttribute('aria-selected') === 'true')?.dataset.destTab || 'sete');
    if (!svg) return;
  });

  // ---------- Bubbles ----------
  const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: .3 });
  $$('.bubbles').forEach(b => io.observe(b));

  // ---------- Parallax (destination photos) ----------
  // Positions are cached (document offsets) and refreshed with the site metrics; the scroll
  // tick (shared with the header, one rAF) only computes transforms from scrollY.
  const px = $$('[data-parallax], [data-parallax-hero]').map(el => ({ el, hero: el.hasAttribute('data-parallax-hero'), top: 0, h: 0, last: '' }));
  if (px.length && !reduce) {
    measureParallax = () => {
      for (const p of px) {
        let y = 0, n = p.el.parentElement; while (n) { y += n.offsetTop; n = n.offsetParent; }
        p.top = y; p.h = p.el.parentElement.offsetHeight;
      }
    };
    runParallax = (sy) => {
      const vh = innerHeight;
      for (const p of px) {
        const t = p.top - sy;
        if (t + p.h < 0 || t > vh) continue;
        const k = p.hero ? -t * .25 : ((t + p.h / 2) - vh / 2) * -.06;
        const v = `translate3d(0, ${k.toFixed(1)}px, 0)`;
        if (v !== p.last) { p.el.style.transform = v; p.last = v; }
      }
    };
    measureParallax(); runParallax(scrollY);
  }

  // ---------- CTA band: coastal birds in three parallax depth planes (birds.js) ----------
  // Far: small, slow, faded mist silhouettes. Mid / near: two-tone sculpted birds, faster and larger.
  const BAND_PLANES = [
    { scale: .5, speed: .012, alpha: .45, band: [.06, .16], mode: 'sil', color: '#9fb2d4' },
    { scale: .78, speed: .02, alpha: .75, band: [.08, .22], mode: 'detail' },
    { scale: 1.15, speed: .03, alpha: .95, band: [.1, .26], mode: 'detail' },
  ];
  $$('[data-birds]').forEach(c => {
    const B = window.FSBirds;
    if (reduce || !B) return;
    const ctx = c.getContext('2d');
    let on = false, W = 0, H = 0, last = 0, birds = [];
    const build = () => {
      const counts = W < 700 ? [2, 2, 1] : [3, 2, 2];
      birds = [];
      counts.forEach((n, pi) => { for (let i = 0; i < n; i++) birds.push({ bird: B.create({ seed: 40 + pi * 17 + i * 13 }), pl: BAND_PLANES[pi], x: (i + .4) / n + pi * .21, v: (i * .57 + pi * .31) % 1, wob: pi * 2.3 + i * 1.9 }); });
    };
    const size = () => {
      const d = Math.min(coarse || innerWidth < 768 ? 1.5 : 2, devicePixelRatio || 1);
      W = c.clientWidth; H = c.clientHeight; c.width = Math.round(W * d); c.height = Math.round(H * d); ctx.setTransform(d, 0, 0, d, 0, 0);
      if (!birds.length || (W < 700) !== (birds.length === 5)) build();
    };
    const tick = (t) => {
      if (!on) return;
      const dt = Math.min(.033, Math.max(0, (t - (last || t)) / 1000)); last = t; const ts = t / 1000;
      ctx.clearRect(0, 0, W, H);
      const unit = Math.max(22, Math.min(W, 1400) * .03);
      for (const b of birds) {
        const pl = b.pl;
        B.step(b.bird, dt, ts + b.wob);
        b.x -= pl.speed * dt * (W > 700 ? 1 : 1.5);
        if (b.x < -.1) { b.x = 1.1; b.v = Math.random(); }
        const th = Math.sin(ts * .4 + b.wob);
        B.draw(ctx, b.bird, {
          x: b.x * W, y: lerpN(pl.band[0], pl.band[1], b.v) * H + th * unit * .5 * pl.scale, size: unit * pl.scale,
          yaw: Math.PI + .62, roll: .04 + Math.cos(ts * .4 + b.wob) * .18, pitch: Math.cos(ts * .4 + b.wob) * -.05, cam: -.32,
          mode: pl.mode, color: pl.color, alpha: pl.alpha,
        });
      }
      requestAnimationFrame(tick);
    };
    new IntersectionObserver(([e]) => { const was = on; on = e.isIntersecting; if (on && !was) { size(); last = 0; requestAnimationFrame(tick); } }).observe(c);
    let rT = 0;
    addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => on && size(), 150); });
  });
  function lerpN(a, b, t) { return a + (b - a) * t; }

  // ---------- Mail forms (contact + partner) ----------
  const TOPICS = { orgfr: 'French language and immersion programmes', orgstay: 'Accommodation and transport', orgcult: 'Cultural and educational experiences, activities and excursions', orgcoord: 'Local coordination and support in France', groups: 'Individual and group programmes', groupmob: 'Plan group mobility', erasmus: 'Erasmus+ reception', jobshadow: 'Job shadowing' };
  const topic = new URLSearchParams(location.search).get('topic');
  const subj = $('[data-subject]');
  const topicSubject = topic && TOPICS[topic] ? T('Enquiry: {topic}', { topic: T(TOPICS[topic]) }) : '';
  if (subj && topicSubject) subj.value = topicSubject;
  if (topicSubject) $$('#write [data-enq-who]').forEach(s => { s.value = 'org'; });   // offer pages are for organisations

  // ---------- Enquiry submission ----------
  // The ONE place enquiries leave the site. Today there is no backend, so it opens a prefilled
  // email (mailto:). To connect an API later (Formspree, Resend, a Vercel function…):
  //   1. set ENQUIRY_ENDPOINT below, e.g. '/api/enquiry' or 'https://formspree.io/f/xxxx';
  //   2. allow that origin in the CSP `connect-src` (vercel.json and _headers);
  //   3. the endpoint receives JSON { kind, lang, subject, body, fields, website } — `website` is the
  //      honeypot value and must be empty; reject the request otherwise.
  // On any network error the visitor still gets the email fallback, so no enquiry is lost.
  const ENQUIRY_ENDPOINT = '';
  async function submitEnquiry(data) {
    if (ENQUIRY_ENDPOINT) {
      try {
        const r = await fetch(ENQUIRY_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, lang: LANG }) });
        if (r.ok) return { sent: true };
      } catch { /* fall through to email */ }
    }
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.body)}`;
    return { sent: false, mailto: true };
  }
  window.FSSubmitEnquiry = submitEnquiry;
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  // Label shown on the page for a field (already in the page's language)
  const fieldLabel = (form, el) => {
    if (el.type === 'checkbox' || el.type === 'radio') return (el.closest('fieldset')?.querySelector('legend')?.textContent || '').trim();
    return (form.querySelector(`label[for="${el.id}"]`)?.firstChild?.textContent || el.name || '').trim();   // first text node: skips "(optional)"
  };
  const fieldValue = (el) => {
    if (el.tagName === 'SELECT') return el.value ? el.selectedOptions[0].textContent.trim() : '';
    if (el.type === 'checkbox' || el.type === 'radio') return el.checked ? (el.closest('label')?.textContent || el.value).trim() : '';
    return el.value.trim();
  };
  $$('[data-mailform]').forEach(form => {
    const kind = form.dataset.mailform, err = $('[data-form-err]', form);
    // Builds the email in the page's language from the labels and values visitors actually see.
    const compose = () => {
      const groups = new Map();
      for (const el of form.querySelectorAll('input[name], select[name], textarea[name]')) {
        if (el.dataset.consent != null || el.name === 'company_website') continue;   // consent box and honeypot
        const v = fieldValue(el); if (!v) continue;
        const k = fieldLabel(form, el);
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k).push(v);
      }
      let subject = kind === 'partner' ? T('Partnership enquiry') : (topicSubject || T('Enquiry'));
      const lines = [];
      for (const [k, vs] of groups) {
        const el = form.querySelector('[data-subject]');
        if (el && k === fieldLabel(form, el)) { subject = vs[0]; continue; }
        lines.push(vs.length > 1 ? `${k}:\n- ${vs.join('\n- ')}` : `${k}: ${vs[0]}`);
      }
      const org = form.querySelector('#pf-org')?.value.trim();
      if (kind === 'partner' && org) subject = `${T('Partnership enquiry')}: ${org}`;
      const fields = Object.fromEntries([...groups].map(([k, vs]) => [k, vs.join(', ')]));
      return { kind, subject, fields, body: `${lines.join('\n\n')}\n\n—\n${T('Sent from the Formaskills Travel website.')} ${T('Sending an enquiry is not a booking. Nothing is reserved or charged.')}` };
    };
    const validate = () => {
      const bad = [];
      $$('[required]', form).forEach(i => {
        const ok = i.type === 'checkbox' ? i.checked : i.type === 'email' ? emailOk(i.value.trim()) : i.value.trim() !== '';
        i.setAttribute('aria-invalid', String(!ok)); if (!ok) bad.push(i);
      });
      if (bad.length) {
        const f = bad[0];
        err.textContent = f.type === 'checkbox' ? T('Tick the box to continue.') : f.type === 'email' ? T('Enter a valid email address.') : T('Fill in “{field}”.', { field: fieldLabel(form, f) || T('this field') });
        f.focus(); return false;
      }
      err.textContent = ''; return true;
    };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const hp = form.querySelector('[name="company_website"]');
      if (hp && hp.value) return;                          // honeypot filled: a bot, drop silently
      if (!validate()) return;
      const res = await submitEnquiry({ ...compose(), website: '' });
      toast(res.sent ? T('Thank you. Your enquiry has been sent.') : T('Your email app should open with the message ready'));
      if (res.sent) form.reset();
    });
    $('[data-copy-form]', form)?.addEventListener('click', () => { const { subject, body } = compose(); copy(`${T('To')}: ${EMAIL}\n${T('Subject')}: ${subject}\n\n${body}`, T('Message copied')); });
    form.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') e.target.setAttribute('aria-invalid', 'false'); });
  });
  // Partner category helper
  const cat = $('[data-pf-cat]'), hint = $('[data-pf-hint]');
  // option values are stable English identifiers; the visible text is translated
  const MAP = ['School / university / training organisation', 'Company / employer / professional organisation', 'Accommodation provider', 'Cultural activity / guide / experience provider', 'Travel agency / educational travel partner', 'Restaurant / catering provider', 'Other business or organisation'];
  const syncHint = () => { if (hint) hint.hidden = cat.value !== 'Company / employer / professional organisation'; };
  cat?.addEventListener('change', syncHint);
  $$('[data-partner-cat]').forEach(a => a.addEventListener('click', () => { if (cat) { cat.value = MAP[+a.dataset.partnerCat]; syncHint(); setTimeout(() => $('#pf-org')?.focus({ preventScroll: true }), 900); } }));
  const multi = $('.multi');
  if (multi) { const sum = $('summary', multi); const upd = () => { const n = $$('input:checked', multi).length; sum.firstChild.textContent = n ? T('{n} selected', { n }) : T('Choose…'); }; multi.addEventListener('change', upd); }

  // ---------- Checklist ----------
  const cl = $('[data-checklist]');
  if (cl) {
    const boxes = $$('[data-check]', cl), cnt = $('[data-check-count]', cl), b = $('[data-check-bar]', cl);
    const upd = () => { const n = boxes.filter(x => x.checked).length; cnt.textContent = n; b.style.width = `${(n / boxes.length) * 100}%`; };
    cl.addEventListener('change', upd); upd();
  }

  // ---------- FAQ categories: each title is a drop-down that shows its questions ----------
  const fc = $('[data-faqcat]');
  if (fc) {
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const setCat = (sec, open) => {
      const b = $('[data-faqcat-toggle]', sec), q = $('.faqcat__q', sec);
      b.setAttribute('aria-expanded', String(open)); sec.classList.toggle('is-open', open);
      q.hidden = !open;
      if (open && !calm) q.animate?.([{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.2,.7,.1,1)' });
      window.FSMeasure?.();
    };
    fc.addEventListener('click', (e) => {
      const b = e.target.closest('[data-faqcat-toggle]');
      if (b) { setCat(b.closest('.faqcat__sec'), b.getAttribute('aria-expanded') !== 'true'); return; }
      // side links open their category before scrolling to it
      const a = e.target.closest('.faqcat__nav a');
      const sec = a && fc.querySelector(a.getAttribute('href'));
      if (sec && !sec.classList.contains('is-open')) setCat(sec, true);
    });
    // deep links (#faq-2 or a question id) open the category that holds them
    const target = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    const hashSec = target && target.closest('.faqcat__sec');
    if (hashSec) setCat(hashSec, true);
    const links = $$('.faqcat__nav a', fc);
    const spy = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) links.forEach(l => l.setAttribute('aria-current', String(l.getAttribute('href') === `#${e.target.id}`))); }), { rootMargin: '-35% 0px -60% 0px' });
    $$('.faqcat__sec', fc).forEach(s => spy.observe(s));
  }

  // ---------- Search ----------
  let IDX = null;
  const ensureIndex = () => IDX ? Promise.resolve(IDX) : fetch(`/assets/data/search-${LANG}.json`).then(r => r.json()).then(d => (IDX = d)).catch(() => (IDX = []));
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const escH = (s) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function search(q) {
    const terms = norm(q).split(/[^a-z0-9+]+/).filter(t => t.length > 1);
    if (!terms.length) return [];
    return IDX.map(p => {
      const t = norm(p.t), h = norm(p.h.join(' ')), x = norm(p.x);
      let s = 0, all = true;
      for (const term of terms) {
        const hit = (t.includes(term) ? 12 : 0) + (h.includes(term) ? 5 : 0) + Math.min(6, x.split(term).length - 1);
        if (!hit) all = false; s += hit;
      }
      return { p, s: all ? s * 1.5 : s * .4 };
    }).filter(r => r.s > 0).sort((a, b) => b.s - a.s).slice(0, 8).map(({ p }) => {
      const x = norm(p.x); const i = Math.max(0, x.indexOf(terms[0]) - 70);
      let snip = p.x.slice(i, i + 190); if (i > 0) snip = '…' + snip; snip += '…';
      let html = escH(snip);
      terms.forEach(term => { html = html.replace(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>'); });
      return `<li><a href="${p.u}"><b>${escH(p.t)}</b><small>${html}</small></a></li>`;
    });
  }
  $$('[data-search-form]').forEach(f => {
    const input = $('[data-search-input]', f), out = f.parentElement.querySelector('[data-search-results]');
    const run = () => ensureIndex().then(() => {
      const q = input.value.trim();
      if (!q) { out.innerHTML = ''; return; }
      const res = search(q);
      out.innerHTML = res.length ? res.join('') : `<li class="search__empty">${localHref(T('No results for “{q}”. Try another word, or <a href="/contact/#write">write to us</a>.', { q: escH(q) }))}</li>`;
    });
    input.addEventListener('input', run);
    f.addEventListener('submit', (e) => { if (!input.hasAttribute('data-search-page')) return; e.preventDefault(); history.replaceState(null, '', `?q=${encodeURIComponent(input.value)}`); run(); });
    if (input.hasAttribute('data-search-page')) { const q = new URLSearchParams(location.search).get('q'); if (q) { input.value = q; run(); } }
  });

  // ---------- Assistant (answers from the site's own content) ----------
  const ai = $('[data-ai]');
  if (ai) {
    if (!flight) ai.classList.add('is-ready');
    const panel = $('.ai__panel', ai), log = $('[data-ai-log]', ai), chips = $('[data-ai-chips]', ai), form = $('[data-ai-form]', ai), input = $('input', form);
    let KB = null, greeted = false;
    const STOP = new Set('a an the to of for and or in on at is are do does can i we you our your my me it be with from what how who when where which about this that there if not any will would should could have has'.split(' '));
    const SYN = { price: 'prices proposal budget', cost: 'prices proposal budget', book: 'booking enquiry', booking: 'enquiry booking', visa: 'visa passport documents', erasmus: 'erasmus+', course: 'french courses classes', courses: 'french classes', lessons: 'french classes', host: 'host family au pair', internship: 'work placements trainees', insurance: 'insurance ehic', flight: 'flights book', hours: 'phone contact hours', phone: 'contact phone hours', email: 'contact email', address: 'address contact', level: 'french level beginners' };
    const tok = (s) => norm(s).split(/[^a-z0-9+]+/).filter(w => w.length > 1 && !STOP.has(w));
    const say = (html, who = 'bot') => { const d = document.createElement('div'); d.className = `ai__msg ai__msg--${who}`; d.innerHTML = html; log.append(d); log.scrollTop = log.scrollHeight; };
    const answer = (q) => {
      let qs = tok(q); qs = qs.concat(...qs.map(w => SYN[w] ? SYN[w].split(' ') : []));
      if (!qs.length) return null;
      let best = null, bs = 0;
      for (const k of KB) {
        const kq = norm(k.q), ka = norm(k.a); let s = 0;
        for (const w of qs) { if (kq.includes(w)) s += 3; if (ka.includes(w)) s += 1; }
        s = s / Math.sqrt(kq.length / 40 + 1);
        if (s > bs) { bs = s; best = k; }
      }
      return bs >= 2.5 ? best : null;
    };
    const ask = (q) => {
      say(escH(q), 'me');
      const k = answer(q);
      setTimeout(() => {
        if (k) say(`<p>${escH(k.a)}</p><p><a href="${k.u}">${T('Read more on this page')}</a></p>`);
        else say(`<p>${localHref(T('I could not find that on this website. Our team replies personally: <a href="/contact/#write">write to us</a>, call <a href="tel:+33975462281">+33 9 75 46 22 81</a>, or <a href="/plan-your-stay/">plan your project</a>.'))}</p>`);
      }, 260);
    };
    const toggle = (open) => {
      ai.classList.toggle('is-open', open); panel.hidden = !open;
      $('.ai__launch', ai).setAttribute('aria-expanded', String(open));
      if (open) {
        (KB ? Promise.resolve() : fetch(`/assets/data/kb-${LANG}.json`).then(r => r.json()).then(d => { KB = d; }).catch(() => { KB = []; })).then(() => {
          if (!greeted) {
            greeted = true;
            say(`<p>${escH(T('Hello! Ask me about French courses, Erasmus+, destinations, au pair stays or how an enquiry works.'))}</p>`);
            chips.innerHTML = [T('Why are prices not displayed?'), T('Do you accept complete beginners?'), T('What is job shadowing?'), T('Who books my flight?'), T('Best period for Nice?')].map(c => `<button type="button">${escH(c)}</button>`).join('');
          }
          input.focus();
        });
      } else $('.ai__launch', ai).focus();
    };
    $$('[data-ai-toggle]', ai).forEach(b => b.addEventListener('click', () => toggle(panel.hidden)));
    chips.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b && KB) ask(b.textContent); });
    form.addEventListener('submit', (e) => { e.preventDefault(); const q = input.value.trim(); if (!q || !KB) return; input.value = ''; ask(q); });
    panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });
  }
})();
