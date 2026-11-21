/* Formaskills Travel — site-wide interactions */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const EMAIL = 'contact.skillstravel@gmail.com';
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };

  // ---------- Bird drawing (shared with the flight) ----------
  window.FSBirds = {
    draw(ctx, x, y, s, flap) {
      const tip = y - s * (.12 + .5 * flap), mid = y - s * (.32 + .22 * flap);
      ctx.beginPath();
      ctx.moveTo(x - s, tip);
      ctx.quadraticCurveTo(x - s * .45, mid, x, y);
      ctx.quadraticCurveTo(x + s * .45, mid, x + s, tip);
      ctx.stroke();
    },
  };

  // ---------- Smooth scroll (desktop pointers only) ----------
  const hdr = $('[data-hdr]');
  const hdrH = () => (hdr ? hdr.offsetHeight : 0);
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
  const copy = async (text, msg = 'Copied') => {
    try { await navigator.clipboard.writeText(text); toast(msg); }
    catch { const t = document.createElement('textarea'); t.value = text; document.body.append(t); t.select(); document.execCommand('copy'); t.remove(); toast(msg); }
  };
  window.FSCopy = copy; window.FSToast = toast;
  $$('[data-copy-text]').forEach(b => b.addEventListener('click', () => copy(b.dataset.copyText, 'Address copied')));

  // ---------- Header: progress, hide on scroll, solid after the flight ----------
  const bar = $('.hdr__progress i');
  const flight = $('[data-flight]');
  let lastY = scrollY, ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? (y / max).toFixed(4) : 0})`;
    if (!hdr) return;
    const flightEnd = flight ? flight.offsetTop + flight.offsetHeight - innerHeight * .9 : -1;
    if (hdr.classList.contains('hdr--overlay')) hdr.classList.toggle('is-solid', y > flightEnd);
    const inFlight = flight && y < flightEnd;
    const openPanel = document.querySelector('[data-panel].is-open');
    if (!inFlight && !openPanel && y > 400 && y > lastY + 6) hdr.classList.add('is-hidden');
    else if (y < lastY - 6 || y < 400 || inFlight) hdr.classList.remove('is-hidden');
    lastY = y;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
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
    const plan = $('[data-enq-link="plan"]'), write = $('[data-enq-link="write"]');
    if (plan) plan.href = `/plan-your-stay/?for=${w}`;
    if (write) write.href = w === 'partner' ? '/partners/#enquiry' : '/contact/#write';
  };
  who.forEach(b => {
    b.addEventListener('click', () => setWho(b.dataset.who));
    b.addEventListener('keydown', (e) => {
      if (!/Arrow(Left|Right|Up|Down)/.test(e.key)) return; e.preventDefault();
      const i = who.indexOf(b), n = who[(i + (/Right|Down/.test(e.key) ? 1 : who.length - 1)) % who.length];
      setWho(n.dataset.who); n.focus();
    });
  });
  if (location.pathname.startsWith('/partners')) setWho('partner');
  else if (location.pathname.startsWith('/for-organisations')) setWho('org');

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
    const show = (slug) => {
      pins.forEach(p => p.classList.toggle('is-on', p.dataset.dest === slug));
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
  const px = $$('[data-parallax], [data-parallax-hero]');
  if (px.length && !reduce) {
    const run = () => {
      for (const el of px) {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue;
        const k = el.hasAttribute('data-parallax-hero') ? (-r.top) * .25 : ((r.top + r.height / 2) - innerHeight / 2) * -.06;
        el.style.transform = `translate3d(0, ${k.toFixed(1)}px, 0)`;
      }
    };
    addEventListener('scroll', () => requestAnimationFrame(run), { passive: true }); run();
  }

  // ---------- CTA band birds ----------
  $$('[data-birds]').forEach(c => {
    if (reduce) return;
    const n = +c.dataset.birds || 6, ctx = c.getContext('2d');
    const birds = Array.from({ length: n }, (_, i) => ({ x: Math.random(), y: .15 + Math.random() * .35, s: 6 + Math.random() * 7, sp: .00003 + Math.random() * .00003, ph: Math.random() * 6.28, f: 5 + Math.random() * 2 }));
    let on = false, W = 0, H = 0, last = 0;
    const size = () => { const d = Math.min(2, devicePixelRatio || 1); W = c.clientWidth; H = c.clientHeight; c.width = W * d; c.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    const tick = (t) => {
      if (!on) return;
      const dt = Math.min(50, t - (last || t)); last = t;
      ctx.clearRect(0, 0, W, H); ctx.strokeStyle = 'rgba(28,34,70,.55)'; ctx.lineCap = 'round';
      for (const b of birds) {
        b.x -= b.sp * dt * (W > 700 ? 1 : 1.4); if (b.x < -.05) { b.x = 1.05; b.y = .15 + Math.random() * .35; }
        ctx.lineWidth = Math.max(1.2, b.s * .16);
        window.FSBirds.draw(ctx, b.x * W, b.y * H + Math.sin(t * .0008 + b.ph) * 4, b.s, Math.sin(t * .001 * b.f + b.ph));
      }
      requestAnimationFrame(tick);
    };
    new IntersectionObserver(([e]) => { const was = on; on = e.isIntersecting; if (on && !was) { size(); last = 0; requestAnimationFrame(tick); } }).observe(c);
    addEventListener('resize', () => on && size());
  });

  // ---------- Mail forms (contact + partner) ----------
  const TOPICS = { orgfr: 'French language and immersion programmes', orgstay: 'Accommodation and transport', orgcult: 'Cultural and educational experiences, activities and excursions', orgcoord: 'Local coordination and support in France', groups: 'Individual and group programmes', groupmob: 'Plan group mobility', erasmus: 'Erasmus+ reception', jobshadow: 'Job shadowing' };
  const topic = new URLSearchParams(location.search).get('topic');
  const subj = $('[data-subject]');
  if (subj && topic && TOPICS[topic]) subj.value = `Enquiry: ${TOPICS[topic]}`;
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  $$('[data-mailform]').forEach(form => {
    const kind = form.dataset.mailform, err = $('[data-form-err]', form);
    const compose = () => {
      const lines = [];
      const fd = new FormData(form); const seen = {};
      for (const [k, v] of fd.entries()) { if (!v) continue; (seen[k] ||= []).push(v); }
      let subject = kind === 'partner' ? 'Partnership enquiry' : 'Enquiry';
      for (const [k, vs] of Object.entries(seen)) {
        if (k === 'Subject') { subject = vs[0]; continue; }
        lines.push(vs.length > 1 ? `${k}:\n- ${vs.join('\n- ')}` : `${k}: ${vs[0]}`);
      }
      if (kind === 'partner' && seen['Organisation']) subject = `Partnership enquiry: ${seen['Organisation'][0]}`;
      return { subject, body: lines.join('\n\n') + `\n\n—\nSent from formaskills-travel.fr. ${'Sending an enquiry is not a booking. Nothing is reserved or charged.'}` };
    };
    const validate = () => {
      const bad = [];
      $$('[required]', form).forEach(i => {
        const ok = i.type === 'checkbox' ? i.checked : i.type === 'email' ? emailOk(i.value.trim()) : i.value.trim() !== '';
        i.setAttribute('aria-invalid', String(!ok)); if (!ok) bad.push(i);
      });
      if (bad.length) {
        const f = bad[0];
        err.textContent = f.type === 'checkbox' ? 'Tick the box to continue.' : f.type === 'email' ? 'Enter a valid email address.' : `Fill in “${form.querySelector(`label[for="${f.id}"]`)?.textContent || 'this field'}”.`;
        f.focus(); return false;
      }
      err.textContent = ''; return true;
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault(); if (!validate()) return;
      const { subject, body } = compose();
      location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      toast('Your email app should open with the message ready');
    });
    $('[data-copy-form]', form)?.addEventListener('click', () => { const { subject, body } = compose(); copy(`To: ${EMAIL}\nSubject: ${subject}\n\n${body}`, 'Message copied'); });
    form.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') e.target.setAttribute('aria-invalid', 'false'); });
  });
  // Partner category helper
  const cat = $('[data-pf-cat]'), hint = $('[data-pf-hint]');
  const MAP = ['School / university / training organisation', 'Company / employer / professional organisation', 'Accommodation provider', 'Cultural activity / guide / experience provider', 'Travel agency / educational travel partner', 'Restaurant / catering provider', 'Other business or organisation'];
  const syncHint = () => { if (hint) hint.hidden = cat.value !== 'Company / employer / professional organisation'; };
  cat?.addEventListener('change', syncHint);
  $$('[data-partner-cat]').forEach(a => a.addEventListener('click', () => { if (cat) { cat.value = MAP[+a.dataset.partnerCat]; syncHint(); setTimeout(() => $('#pf-org')?.focus({ preventScroll: true }), 900); } }));
  const multi = $('.multi');
  if (multi) { const sum = $('summary', multi); const upd = () => { const n = $$('input:checked', multi).length; sum.firstChild.textContent = n ? `${n} selected` : 'Choose…'; }; multi.addEventListener('change', upd); }

  // ---------- Google map (only after consent) ----------
  const gm = $('[data-gmap]');
  if (gm) {
    const consent = gm.innerHTML;
    const showMap = () => {
      gm.innerHTML = `<iframe title="Map of the contact address" src="${gm.dataset.gmap}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
      const hide = document.createElement('button'); hide.type = 'button'; hide.className = 'btn btn--ghost btn--sm'; hide.textContent = 'Hide map and withdraw this choice';
      hide.addEventListener('click', () => { store.set('fs-map', '0'); gm.innerHTML = consent; bind(); hide.remove(); });
      gm.after(hide); store.set('fs-map', '1');
    };
    const bind = () => $('[data-gmap-show]', gm)?.addEventListener('click', showMap);
    bind(); if (store.get('fs-map') === '1') showMap();
  }

  // ---------- Checklist ----------
  const cl = $('[data-checklist]');
  if (cl) {
    const boxes = $$('[data-check]', cl), cnt = $('[data-check-count]', cl), b = $('[data-check-bar]', cl);
    const upd = () => { const n = boxes.filter(x => x.checked).length; cnt.textContent = n; b.style.width = `${(n / boxes.length) * 100}%`; };
    cl.addEventListener('change', upd); upd();
  }

  // ---------- FAQ category scroll-spy ----------
  const fc = $('[data-faqcat]');
  if (fc) {
    const links = $$('.faqcat__nav a', fc);
    const spy = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) links.forEach(l => l.setAttribute('aria-current', String(l.getAttribute('href') === `#${e.target.id}`))); }), { rootMargin: '-35% 0px -60% 0px' });
    $$('.faqcat__sec', fc).forEach(s => spy.observe(s));
  }

  // ---------- Search ----------
  let IDX = null;
  const ensureIndex = () => IDX ? Promise.resolve(IDX) : fetch('/assets/data/search.json').then(r => r.json()).then(d => (IDX = d)).catch(() => (IDX = []));
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
      out.innerHTML = res.length ? res.join('') : `<li class="search__empty">No results for “${escH(q)}”. Try another word, or <a href="/contact/#write">write to us</a>.</li>`;
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
        if (k) say(`<p>${escH(k.a)}</p><p><a href="${k.u}">Read more on this page</a></p>`);
        else say(`<p>I could not find that on this website. Our team replies personally: <a href="/contact/#write">write to us</a>, call <a href="tel:+33975462281">+33 9 75 46 22 81</a>, or <a href="/plan-your-stay/">plan your project</a>.</p>`);
      }, 260);
    };
    const toggle = (open) => {
      ai.classList.toggle('is-open', open); panel.hidden = !open;
      $('.ai__launch', ai).setAttribute('aria-expanded', String(open));
      if (open) {
        (KB ? Promise.resolve() : fetch('/assets/data/kb.json').then(r => r.json()).then(d => { KB = d; }).catch(() => { KB = []; })).then(() => {
          if (!greeted) {
            greeted = true;
            say('<p>Hello! Ask me about French courses, Erasmus+, destinations, au pair stays or how an enquiry works.</p>');
            chips.innerHTML = ['Why are prices not displayed?', 'Do you accept complete beginners?', 'What is job shadowing?', 'Who books my flight?', 'Best period for Nice?'].map(c => `<button type="button">${c}</button>`).join('');
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
