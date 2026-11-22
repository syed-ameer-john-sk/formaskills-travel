/* Formaskills Travel — Plan my project (guided enquiry → email) */
(() => {
  const host = document.querySelector('[data-planner]');
  if (!host) return;
  const EMAIL = 'contact.skillstravel@gmail.com';
  const T = window.FST || ((x) => x), LANG = window.FS_LANG || 'en', BASE = window.FS_BASE || '';
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ic = { arrow: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    users: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="9" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M15.5 6.3a3 3 0 0 1 0 5.6M17.5 14.3A5.5 5.5 0 0 1 20.5 19"/></svg>',
    building: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 20.5V5.5l7-2v17M12 8.5h7v12M3.5 20.5h17"/></svg>',
    hand: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3.5 11 4-4 4 2 2-1.5 3 .5 4 4M7.5 7l-4 4 6 6a1.5 1.5 0 0 0 2.1 0l5.9-5.9"/></svg>' };

  const params = new URLSearchParams(location.search);
  let D, aud = null, A = {}, idx = 0, mode = 'who', editing = false, contact = {};
  const SKEY = 'fs-planner';
  const save = () => { try { sessionStorage.setItem(SKEY, JSON.stringify({ aud, A, idx, mode, contact })); } catch {} };

  const label = (gid, key) => D.opt[gid]?.[key] ?? D.gen[key] ?? key;
  const has = (gid, v) => { const a = A[gid]; return Array.isArray(a) ? a.includes(v) : a === v; };
  const topic = params.get('topic');
  if (topic) A.topic = topic;

  function visibleSteps() {
    return (D.steps[aud] || []).filter(s => {
      if (s.if && !s.if.some(([g, v]) => has(g, v))) return false;
      if (s.hide_if_only) { const [g, v] = s.hide_if_only; const a = A[g]; if (Array.isArray(a) && a.length === 1 && a[0] === v) return false; }
      if (s.branch && !A[s.branch]) return false;
      return true;
    });
  }
  const groupsOf = (s) => s.branch ? (s.branches[A[s.branch]] || []) : s.groups;

  // ---------- rendering ----------
  function render() {
    save();
    if (mode === 'who') return renderWho();
    const steps = visibleSteps();
    if (mode === 'step') { if (idx >= steps.length) { mode = 'review'; return render(); } return renderStep(steps, idx); }
    if (mode === 'review') return renderReview(steps);
    if (mode === 'contact') return renderContact();
    if (mode === 'done') return renderDone();
  }
  const focusH = () => requestAnimationFrame(() => { const h = host.querySelector('[data-focus]'); h?.focus({ preventScroll: true }); const top = host.getBoundingClientRect().top + scrollY - 110; if (Math.abs(scrollY - top) > 200 || host.getBoundingClientRect().top < 60) window.FSScrollTo ? window.FSScrollTo(top) : scrollTo({ top }); });

  function renderWho() {
    host.innerHTML = `<div class="pl-step"><h2 tabindex="-1" data-focus>${esc(D.ui.whoH)}</h2>
      <div class="pl-who">${[['me', D.ui.me, ic.users], ['org', D.ui.org, ic.building], ['partner', D.ui.partner, ic.hand]].map(([k, l, i]) => `<button type="button" data-aud="${k}">${i}<span>${esc(l)}</span></button>`).join('')}</div>
      <p class="notice"><span>Sending an enquiry is not a booking. Nothing is reserved or charged. Our team reads your enquiry and replies personally.</span></p></div>`;
    host.querySelectorAll('[data-aud]').forEach(b => b.addEventListener('click', () => { aud = b.dataset.aud; idx = 0; mode = 'step'; render(); focusH(); }));
  }

  function topicLine() {
    const t = A.topic && D.topics[A.topic];
    return t ? `<p class="pl-topic">${esc(D.ui.topic)}: <b>${esc(t.l)}</b></p>` : '';
  }

  function groupHTML(g) {
    const v = A[g.id];
    const hint = g.hint ? `<p class="hint">${esc(g.hint)}</p>` : '';
    const name = `pl-${g.id}`;
    if (g.type === 'multi' || g.type === 'single') {
      const type = g.type === 'multi' ? 'checkbox' : 'radio';
      return `<fieldset class="pl-group" data-g="${g.id}"><legend>${esc(g.q)}</legend>${hint}<div class="pl-opts">${g.options.map(o => `<label class="pl-opt"><input type="${type}" name="${name}" value="${o}" ${(Array.isArray(v) ? v.includes(o) : v === o) ? 'checked' : ''}><span>${esc(label(g.id, o))}</span></label>`).join('')}</div></fieldset>`;
    }
    if (g.type === 'fieldlist') {
      const rows = (Array.isArray(v) && v.length ? v : [{ f: '', n: '' }]);
      return `<fieldset class="pl-group" data-g="${g.id}"><legend>${esc(g.q)}</legend>${hint}<div class="pl-fields">${rows.map((r, i) => `<div class="pl-fieldrow"><label class="sr-only" for="${name}-f${i}">${esc(D.ui.pick)}</label><select class="pl-input" id="${name}-f${i}" data-ff><option value="">${esc(D.ui.pick)}</option>${g.options.map(o => `<option value="${o}" ${r.f === o ? 'selected' : ''}>${esc(label(g.id, o))}</option>`).join('')}</select><label class="sr-only" for="${name}-n${i}">${esc(D.ui.fnum)}</label><input class="pl-input" id="${name}-n${i}" type="number" min="1" inputmode="numeric" placeholder="${esc(D.ui.fnum)}" value="${esc(r.n)}" data-fn>${i ? `<button type="button" class="btn btn--ghost btn--sm" data-rm="${i}">${esc(D.ui.remove)}</button>` : '<span></span>'}</div>`).join('')}</div><button type="button" class="btn btn--ghost btn--sm" data-add>+ ${esc(D.ui.addField)}</button></fieldset>`;
    }
    const id = `${name}-i`;
    if (g.type === 'text') return `<div class="pl-group" data-g="${g.id}"><label for="${id}">${esc(g.q)} <span class="muted">(${esc(D.ui.optional)})</span></label>${hint}<textarea class="pl-input" id="${id}" rows="4">${esc(v || '')}</textarea></div>`;
    return `<div class="pl-group" data-g="${g.id}"><label for="${id}">${esc(g.q)}</label>${hint}<input class="pl-input" id="${id}" type="${g.type === 'number' ? 'number' : 'text'}" ${g.type === 'number' ? 'min="1" inputmode="numeric"' : ''} value="${esc(v || '')}"></div>`;
  }

  function readStep(s) {
    for (const g of groupsOf(s)) {
      const box = host.querySelector(`[data-g="${g.id}"]`); if (!box) continue;
      if (g.type === 'multi') A[g.id] = [...box.querySelectorAll('input:checked')].map(i => i.value);
      else if (g.type === 'single') A[g.id] = box.querySelector('input:checked')?.value || '';
      else if (g.type === 'fieldlist') A[g.id] = [...box.querySelectorAll('.pl-fieldrow')].map(r => ({ f: r.querySelector('[data-ff]').value, n: r.querySelector('[data-fn]').value })).filter(r => r.f || r.n);
      else A[g.id] = box.querySelector('input,textarea').value.trim();
    }
  }

  function renderStep(steps, i) {
    const s = steps[i];
    const groups = groupsOf(s);
    const total = steps.length;
    const vis = (g) => !g.show_if || has(g.show_if[0], g.show_if[1]);
    host.innerHTML = `<div class="pl-step">
      ${topicLine()}
      <div class="pl-top"><span>${esc(D.ui.progress.replace('{n}', i + 1).replace('{total}', total))}</span><span>${esc(D.ui.optional)}</span></div>
      <div class="pl-bar" role="progressbar" aria-label="${esc(D.ui.progressLabel)}" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${i + 1}"><i style="width:${((i + 1) / (total + 2)) * 100}%"></i></div>
      ${editing ? `<p class="hint">${esc(D.ui.editing)}</p>` : ''}
      <h2 tabindex="-1" data-focus>${esc(s.title)}</h2>
      <form data-stepform>${groups.map(g => `<div ${vis(g) ? '' : 'hidden'} data-wrap="${g.id}">${groupHTML(g)}</div>`).join('')}
      <div class="pl-nav">
        <button type="button" class="btn btn--ghost" data-back>${esc(D.ui.back)}</button>
        <button type="submit" class="btn btn--primary"><span>${esc(D.ui.cont)}</span>${ic.arrow}</button>
        <button type="button" class="btn btn--ghost pl-skip" data-skip>${esc(D.ui.skip)}</button>
      </div></form></div>`;
    const form = host.querySelector('[data-stepform]');
    form.addEventListener('change', () => {
      readStep(s);
      groups.forEach(g => { if (g.show_if) host.querySelector(`[data-wrap="${g.id}"]`).hidden = !vis(g); });
    });
    form.addEventListener('click', (e) => {
      if (e.target.closest('[data-add]')) { readStep(s); const g = groups.find(x => x.type === 'fieldlist'); A[g.id] = [...(A[g.id] || [{ f: '', n: '' }]), { f: '', n: '' }]; if (A[g.id].length < 2) A[g.id].push({ f: '', n: '' }); renderStep(steps, i); }
      const rm = e.target.closest('[data-rm]'); if (rm) { readStep(s); const g = groups.find(x => x.type === 'fieldlist'); A[g.id].splice(+rm.dataset.rm, 1); renderStep(steps, i); }
    });
    const next = () => { if (editing) { editing = false; mode = 'review'; } else idx = i + 1; render(); focusH(); };
    form.addEventListener('submit', (e) => { e.preventDefault(); readStep(s); next(); });
    host.querySelector('[data-skip]').addEventListener('click', () => { groups.forEach(g => delete A[g.id]); next(); });
    host.querySelector('[data-back]').addEventListener('click', () => {
      readStep(s);
      if (editing) { editing = false; mode = 'review'; }
      else if (i === 0) { if (params.get('for')) { history.back(); return; } mode = 'who'; }
      else idx = i - 1;
      render(); focusH();
    });
  }

  const answerText = (g) => {
    const v = A[g.id];
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) return null;
    if (g.type === 'fieldlist') return v.map(r => `${r.f ? label(g.id, r.f) : '—'}${r.n ? ` (${r.n} ${D.ui.countUnit})` : ''}`).join(', ');
    if (Array.isArray(v)) return v.map(k => label(g.id, k)).join(', ');
    if (g.type === 'single') return label(g.id, v);
    return v;
  };

  function means() {
    const s = new Set();
    const p = A.purpose || [];
    if (aud === 'me') {
      if (p.includes('learn')) s.add('courses');
      if (p.includes('culture') || p.includes('discover')) { s.add('tourism'); s.add('immersions'); }
      if (p.includes('aupair') || p.includes('hostfamily')) s.add('aupair');
      if ((A.help || []).some(h => h === 'accommodation' || h === 'transport')) s.add('logistics');
    }
    if (aud === 'org') {
      if (A.orgtype === 'erasmus') s.add('erasmus');
      if (A.orgtype === 'group') s.add('groups');
      if (has('activity', 'js') || has('need', 'shadowing') || A.topic === 'jobshadow') s.add('professional');
      if (has('need', 'language') || has('goal', 'language') || has('goal', 'both')) s.add('courses');
      if (has('need', 'culture') || has('goal', 'culture')) s.add('tourism');
    }
    if (aud === 'partner') s.add('partners');
    if ((A.places || []).some(x => x !== 'notsure')) s.add('cities');
    return [...s];
  }

  function renderReview(steps) {
    const rows = steps.map((s, i) => {
      const parts = groupsOf(s).map(g => { const t = answerText(g); return t ? `${groupsOf(s).length > 1 ? `${g.q}: ` : ''}${t}` : null; }).filter(Boolean);
      return `<div><dt>${esc(s.review)}</dt><dd>${parts.length ? parts.map(esc).join('<br>') : `<i>${esc(D.ui.skipped)}</i>`}</dd><button type="button" data-edit="${i}">${esc(D.ui.edit)}<span class="sr-only"> ${esc(s.review)}</span></button></div>`;
    }).join('');
    const m = means();
    host.innerHTML = `<div class="pl-step">${topicLine()}
      <div class="pl-bar"><i style="width:${(steps.length + 1) / (steps.length + 2) * 100}%"></i></div>
      <h2 tabindex="-1" data-focus>${esc(D.ui.reviewH)}</h2><p>${esc(D.ui.reviewP)}</p>
      <dl class="pl-review">${rows}</dl>
      ${m.length ? `<div class="pl-means"><h3>${esc(D.ui.meansH)}</h3><ul>${m.map(k => `<li><b>${esc(D.svc[k])}</b>: ${esc(D.statusLabel[D.status[k]])}</li>`).join('')}</ul><p class="fine">${esc(T('Services marked “In development” are not yet available to book. You can register your interest.'))}</p></div>` : ''}
      <div class="pl-nav"><button type="button" class="btn btn--ghost" data-back>${esc(D.ui.back)}</button><button type="button" class="btn btn--primary" data-next><span>${esc(D.ui.cont)}</span>${ic.arrow}</button></div></div>`;
    host.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => { idx = +b.dataset.edit; editing = true; mode = 'step'; render(); focusH(); }));
    host.querySelector('[data-back]').addEventListener('click', () => { idx = Math.max(0, steps.length - 1); mode = 'step'; render(); focusH(); });
    host.querySelector('[data-next]').addEventListener('click', () => { mode = 'contact'; render(); focusH(); });
  }

  const CONTACT = {
    me: [['name', 'name', 'text', true, 'name'], ['email', 'email', 'email', true, 'email'], ['country', 'country', 'text', true, 'country-name'], ['city', 'city', 'text', true, 'address-level2'], ['phone', 'phone', 'tel', false, 'tel'], ['replyLang', 'replyLang', 'text', false, '']],
    org: [['orgName', 'orgName', 'text', true, 'organization'], ['person', 'person', 'text', true, 'name'], ['email', 'email', 'email', true, 'email'], ['orgCountry', 'orgCountry', 'text', true, 'country-name'], ['phone', 'phone', 'tel', false, 'tel'], ['replyLang', 'replyLang', 'text', false, '']],
    partner: [['orgName', 'orgName', 'text', true, 'organization'], ['person', 'person', 'text', true, 'name'], ['email', 'email', 'email', true, 'email'], ['phone', 'phone', 'tel', false, 'tel'], ['replyLang', 'replyLang', 'text', false, '']],
  };
  const ERR = { name: 'errName', person: 'errName', orgName: 'errOrg', email: 'errEmail', country: 'errCountry', city: 'errCity', orgCountry: 'errCountry' };

  function renderContact() {
    const f = CONTACT[aud];
    host.innerHTML = `<div class="pl-step"><h2 tabindex="-1" data-focus>${esc(D.ui.contactH)}</h2>
      <form class="form" data-cform novalidate>
        ${f.map(([k, lk, type, req, ac]) => `<div class="field"><label for="pc-${k}">${esc(D.ui[lk])}</label><input id="pc-${k}" name="${k}" type="${type}" ${req ? 'required' : ''} ${ac ? `autocomplete="${ac}"` : ''} value="${esc(contact[k] || '')}"><p class="pl-err" data-err="${k}" hidden></p></div>`).join('')}
        <label class="check check--consent"><input type="checkbox" name="consent" ${contact.consent ? 'checked' : ''}><span>${esc(D.ui.consent)} <a href="${BASE}/legal/privacy/">${esc(D.ui.privacyLink)}</a></span></label><p class="pl-err" data-err="consent" hidden></p>
        <label class="check check--consent"><input type="checkbox" name="accurate" ${contact.accurate ? 'checked' : ''}><span>${esc(aud === 'partner' ? D.ui.accuratePartner : D.ui.accurate)}</span></label><p class="pl-err" data-err="accurate" hidden></p>
        <label class="check check--consent"><input type="checkbox" name="news" ${contact.news ? 'checked' : ''}><span>${esc(D.ui.news)}</span></label>
        <p class="fine">${esc(D.ui.useNote)}</p>
        <div class="pl-nav"><button type="button" class="btn btn--ghost" data-back>${esc(D.ui.back)}</button><button type="submit" class="btn btn--primary"><span>${esc(D.ui.send)}</span>${ic.arrow}</button></div>
        <p class="fine">${esc(D.ui.finalNote)}</p>
      </form></div>`;
    const form = host.querySelector('[data-cform]');
    const read = () => { f.forEach(([k]) => { contact[k] = form.elements[k].value.trim(); }); ['consent', 'accurate', 'news'].forEach(k => { contact[k] = form.elements[k].checked; }); save(); };
    form.addEventListener('input', read);
    host.querySelector('[data-back]').addEventListener('click', () => { read(); mode = 'review'; render(); focusH(); });
    form.addEventListener('submit', (e) => {
      e.preventDefault(); read();
      let first = null;
      const err = (k, msg) => { const p = form.querySelector(`[data-err="${k}"]`); p.textContent = msg || ''; p.hidden = !msg; const inp = form.elements[k]; inp?.setAttribute('aria-invalid', String(!!msg)); if (msg && !first) first = inp; };
      f.forEach(([k, , type, req]) => err(k, req && (!contact[k] || (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact[k]))) ? D.ui[ERR[k]] : ''));
      err('consent', contact.consent ? '' : D.ui.errConsent);
      err('accurate', contact.accurate ? '' : D.ui.errAccurate);
      if (first) { first.focus(); return; }
      mode = 'done'; render(); focusH(); openMail();
    });
  }

  function summary() {
    const steps = visibleSteps();
    const L = [];
    const audL = { me: D.ui.me, org: D.ui.org, partner: D.ui.partner }[aud];
    L.push(`${D.ui.whoH} ${audL}`);
    if (A.topic && D.topics[A.topic]) L.push(`${D.ui.topic}: ${D.topics[A.topic].l}`);
    L.push('');
    steps.forEach(s => groupsOf(s).forEach(g => { const t = answerText(g); if (t) L.push(`${g.q}\n  ${t}`); }));
    const m = means(); if (m.length) { L.push('', `${D.ui.meansH}:`); m.forEach(k => L.push(`  - ${D.svc[k]}: ${D.statusLabel[D.status[k]]}`)); }
    L.push('', `${D.ui.contactH}`);
    CONTACT[aud].forEach(([k, lk]) => { if (contact[k]) L.push(`  ${D.ui[lk]}: ${contact[k]}`); });
    L.push(`  ${D.ui.consent} ${contact.consent ? '✓' : '—'}`);
    L.push(`  ${D.ui.news} ${contact.news ? '✓' : '—'}`);
    L.push('', T('Sending an enquiry is not a booking. Nothing is reserved or charged.'));
    return L.join('\n');
  }
  const subject = () => {
    const who = aud === 'me' ? contact.name : contact.orgName;
    const t = A.topic && D.topics[A.topic] ? ` – ${D.topics[A.topic].l}` : '';
    return `${T('Enquiry')} (${{ me: D.ui.me, org: D.ui.org, partner: D.ui.partner }[aud]})${t}${who ? ` – ${who}` : ''}`;
  };
  function openMail() { location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject())}&body=${encodeURIComponent(summary())}`; }

  function renderDone() {
    const text = summary();
    host.innerHTML = `<div class="pl-step pl-done"><h2 tabindex="-1" data-focus>${esc(D.ui.afterH)}</h2><p>${esc(D.ui.afterP)}</p>
      <pre class="pl-summary">${esc(text)}</pre>
      <div class="actions">
        <button type="button" class="btn btn--primary" data-mail><span>${esc(D.ui.emailUs)}</span>${ic.arrow}</button>
        <button type="button" class="btn btn--ghost" data-copy>${esc(D.ui.copy)}</button>
        <button type="button" class="btn btn--ghost" data-dl>${esc(D.ui.download)}</button>
        <button type="button" class="btn btn--ghost" data-restart>${esc(D.ui.startOver)}</button>
      </div>
      <p class="fine">${esc(D.ui.emailNote)} <a href="mailto:${EMAIL}">${EMAIL}</a></p></div>`;
    host.querySelector('[data-mail]').addEventListener('click', openMail);
    host.querySelector('[data-copy]').addEventListener('click', () => window.FSCopy?.(`${T('To')}: ${EMAIL}\n${T('Subject')}: ${subject()}\n\n${text}`, D.ui.copied));
    host.querySelector('[data-dl]').addEventListener('click', () => {
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([`${T('To')}: ${EMAIL}\n${T('Subject')}: ${subject()}\n\n${text}`], { type: 'text/plain' }));
      a.download = 'formaskills-enquiry.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
    host.querySelector('[data-restart]').addEventListener('click', () => { A = topic ? { topic } : {}; contact = {}; idx = 0; mode = 'who'; try { sessionStorage.removeItem(SKEY); } catch {} render(); focusH(); });
  }

  // ---------- boot ----------
  fetch(`/assets/data/planner-${LANG}.json`).then(r => r.json()).then(d => {
    D = d;
    let restored = null; try { restored = JSON.parse(sessionStorage.getItem(SKEY) || 'null'); } catch {}
    const f = params.get('for');
    if (restored && restored.aud && (!f || f === restored.aud) && !params.get('purpose') && !params.get('city')) ({ aud, A, idx, mode, contact } = restored);
    else if (f && D.steps[f]) {
      aud = f; mode = 'step';
      const purpose = params.get('purpose'), city = params.get('city'), type = params.get('type');
      if (purpose) A.purpose = [purpose];
      if (city) A.places = [city];
      if (type && aud === 'org') A.orgtype = type;
      if (A.topic === 'jobshadow' && aud === 'org' && !A.orgtype) A.orgtype = 'training';
      // Start on the first question that is not already answered
      const steps = visibleSteps(); idx = 0;
      while (idx < steps.length - 1 && steps[idx].groups && steps[idx].groups.length === 1 && A[steps[idx].groups[0].id]) idx++;
    }
    render();
  }).catch(() => { host.innerHTML = `<p>${esc(T('The project planner could not load. You can email us instead:'))} <a href="mailto:${EMAIL}">${EMAIL}</a></p>`; });
})();
