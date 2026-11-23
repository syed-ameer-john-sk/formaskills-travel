// Formaskills Travel — Enterprise Modular Application Script (CSP-Safe, Zero-Idle RAF)
document.addEventListener('DOMContentLoaded', () => {
  const I18N = window.FORMASKILLS_I18N || {};

  // 1. STATE & DOM REFERENCES (Declared before refreshScrollUi to prevent TDZ errors)
  const headerEl = document.querySelector('header');
  const progressEl = document.getElementById('scroll-progress');
  const heroSectionEl = document.getElementById('hero-section');
  const destPinEl = document.getElementById('destinations-pin');
  const flightContainer = document.getElementById('flight-canvas-container');
  const announcerEl = document.getElementById('live-announcer');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  let isMobileLayout = window.innerWidth < 1024;
  let lastLayoutWidth = window.innerWidth;
  let currentDestIndex = 0;
  let currentPersona = 'learner';
  let currentLang = 'en';
  let heroVisible = true;
  let destVisible = false;
  let targetFlightProg = 0.26;
  let currentFlightProg = 0.26;
  let rafId = null;
  let autoFlyTimer = null;
  let pinScrollTrigger = null;

  // Landmark-aligned Bezier control points (normalized to viewport width & height)
  // Derived directly from the user's hand-drawn trajectories across Hero and the 3 Destination slides:
  const FLIGHT_CURVES = {
    // 1. HERO: Starts low-left (y: 0.65), arches over the headline (y: 0.48), rises over Quick Finder card (apex x: 0.68, y: 0.24), plunges to bottom-right (y: 0.84)
    hero: [
      [-0.02, 0.650], [0.120, 0.520], [0.240, 0.490], [0.380, 0.480],
      [0.480, 0.460], [0.580, 0.240], [0.680, 0.240],
      [0.780, 0.240], [0.880, 0.540], [1.020, 0.840]
    ],
    // 2. SÈTE: Starts mid-left across canal rooftops (y: 0.35), deep dive in front of the lighthouse (trough x: 0.64, y: 0.58), sweeps steeply UP into the upper sky (exit y: 0.14)
    sete: [
      [-0.02, 0.350], [0.160, 0.340], [0.280, 0.350], [0.380, 0.380],
      [0.480, 0.440], [0.560, 0.580], [0.640, 0.580],
      [0.760, 0.580], [0.900, 0.320], [1.020, 0.140]
    ],
    // 3. MONTPELLIER: Starts mid-left (y: 0.36), glides down through trees, dips through Porte du Peyrou arch promenade (trough x: 0.70, y: 0.49), curves smoothly up to the right (exit y: 0.32)
    montpellier: [
      [-0.02, 0.360], [0.160, 0.360], [0.300, 0.410], [0.440, 0.440],
      [0.560, 0.470], [0.620, 0.490], [0.700, 0.490],
      [0.820, 0.490], [0.920, 0.410], [1.020, 0.320]
    ],
    // 4. PARIS: Starts mid-left (y: 0.46), climbs across sunset sky/bridge (crest x: 0.34, y: 0.36), dips across Seine by Eiffel Tower base (trough x: 0.68, y: 0.46), curves up to the right (exit y: 0.34)
    paris: [
      [-0.02, 0.460], [0.120, 0.400], [0.220, 0.360], [0.340, 0.360],
      [0.460, 0.360], [0.560, 0.460], [0.680, 0.460],
      [0.780, 0.460], [0.900, 0.400], [1.020, 0.340]
    ]
  };

  const WAYPOINT_FRACTIONS = {
    hero: [0.28, 0.65, 0.88],
    sete: [0.30, 0.60, 0.90],
    montpellier: [0.30, 0.65, 0.88],
    paris: [0.30, 0.64, 0.88]
  };

  let targetCurveName = 'hero';
  let currentControlPoints = FLIGHT_CURVES.hero.map(p => [...p]);
  let targetControlPoints = FLIGHT_CURVES.hero.map(p => [...p]);
  let wpFractions = [...WAYPOINT_FRACTIONS.hero];
  let targetWpFractions = [...WAYPOINT_FRACTIONS.hero];
  let pathTotal = 1500;
  let needsPathUpdate = true;

  function setTargetCurve(name) {
    if (!FLIGHT_CURVES[name] || targetCurveName === name) return;
    targetCurveName = name;
    targetControlPoints = FLIGHT_CURVES[name];
    targetWpFractions = WAYPOINT_FRACTIONS[name] || WAYPOINT_FRACTIONS.hero;
    needsPathUpdate = true;
  }

  function formatPathD(pts, w, h) {
    return `M ${(pts[0][0] * w).toFixed(1)},${(pts[0][1] * h).toFixed(1)} ` +
      `C ${(pts[1][0] * w).toFixed(1)},${(pts[1][1] * h).toFixed(1)} ${(pts[2][0] * w).toFixed(1)},${(pts[2][1] * h).toFixed(1)} ${(pts[3][0] * w).toFixed(1)},${(pts[3][1] * h).toFixed(1)} ` +
      `C ${(pts[4][0] * w).toFixed(1)},${(pts[4][1] * h).toFixed(1)} ${(pts[5][0] * w).toFixed(1)},${(pts[5][1] * h).toFixed(1)} ${(pts[6][0] * w).toFixed(1)},${(pts[6][1] * h).toFixed(1)} ` +
      `C ${(pts[7][0] * w).toFixed(1)},${(pts[7][1] * h).toFixed(1)} ${(pts[8][0] * w).toFixed(1)},${(pts[8][1] * h).toFixed(1)} ${(pts[9][0] * w).toFixed(1)},${(pts[9][1] * h).toFixed(1)}`;
  }

  function announce(msg) {
    if (announcerEl) announcerEl.textContent = msg;
  }

  // 2. LENIS SMOOTH SCROLL (Desktop fine-pointer only; never hijack mobile touch)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const scroller = (() => {
    if (isFinePointer && !prefersReducedMotion && typeof Lenis !== 'undefined' && typeof gsap !== 'undefined') {
      const instance = new Lenis({ duration: 1.15, smoothWheel: true });
      instance.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => instance.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
      return instance;
    }
    return {
      scrollTo(target, opts = {}) {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        const offset = opts.offset || 0;
        const top = typeof target === 'number'
          ? target
          : (el ? el.getBoundingClientRect().top + window.scrollY + offset : 0);
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    };
  })();

  // 3. GPU-ONLY SCROLL PROGRESS & CONDENSED HEADER
  function updateSectionFlightContext() {
    if (!destPinEl) return;
    const rect = destPinEl.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.25) {
      if (typeof setTargetCurve === 'function') {
        const curveName = currentDestIndex === 0 ? 'sete' : (currentDestIndex === 1 ? 'montpellier' : 'paris');
        setTargetCurve(curveName);
      }
    } else if (rect.top > window.innerHeight * 0.45) {
      if (typeof setTargetCurve === 'function') {
        setTargetCurve('hero');
        const heroHeight = heroSectionEl ? heroSectionEl.offsetHeight : window.innerHeight;
        const heroP = Math.min(1, Math.max(0, window.scrollY / (heroHeight * 0.85)));
        targetFlightProg = 0.18 + heroP * 0.70;
      }
    }
  }

  let scrollTicking = false;
  function refreshScrollUi() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (progressEl) progressEl.style.transform = `scaleX(${p.toFixed(4)})`;
    if (headerEl) headerEl.classList.toggle('is-scrolled', window.scrollY > 28);
    updateSectionFlightContext();
    scrollTicking = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(refreshScrollUi);
      scrollTicking = true;
    }
  }, { passive: true });
  refreshScrollUi();

  // 4. ZERO-IDLE SEAGULL FLIGHT ENGINE (DESKTOP & MOBILE FLICKER-FREE)
  const flightSvg = document.getElementById('global-flight-svg');
  const flightGuide = document.getElementById('flight-guide');
  const flightRibbon = document.getElementById('flight-ribbon');
  const flightCore = document.getElementById('flight-core');
  const flightBird = document.getElementById('flight-bird');
  const flightCompanion = document.getElementById('flight-bird-companion');
  const gullNearWing = document.getElementById('gull-near-wing');
  const gullNearTip = document.getElementById('gull-near-tip');
  const gullNearHighlight = document.getElementById('gull-near-highlight');
  const gullFarWing = document.getElementById('gull-far-wing');
  const gullFarTip = document.getElementById('gull-far-tip');
  const wpNodes = [0, 1, 2].map(i => document.getElementById(`wp-node-${i}`));
  const wpLabels = [0, 1, 2].map(i => document.getElementById(`wp-label-${i}`));

  const sparkleCanvas = document.getElementById('flight-sparkle-canvas');
  const sCtx = (sparkleCanvas && isFinePointer) ? sparkleCanvas.getContext('2d') : null;
  let sparkles = [];
  let viewW = window.innerWidth;
  let viewH = window.innerHeight;

  function updateWaypointPositions() {
    if (!flightRibbon || pathTotal <= 0) return;
    wpFractions.forEach((frac, i) => {
      const pt = flightRibbon.getPointAtLength(frac * pathTotal);
      if (wpNodes[i]) wpNodes[i].setAttribute('transform', `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`);
    });
  }

  function updateFlightGeometry() {
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    if (flightSvg) flightSvg.setAttribute('viewBox', `0 0 ${viewW} ${viewH}`);

    const d = formatPathD(currentControlPoints, viewW, viewH);
    [flightGuide, flightRibbon, flightCore].forEach(el => el && el.setAttribute('d', d));
    pathTotal = flightRibbon ? (flightRibbon.getTotalLength() || viewW) : viewW;
    if (flightRibbon) flightRibbon.style.strokeDasharray = `${pathTotal}`;
    if (flightCore) flightCore.style.strokeDasharray = `${pathTotal}`;

    updateWaypointPositions();

    if (sparkleCanvas && sCtx) {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      sparkleCanvas.width = Math.round(viewW * dpr);
      sparkleCanvas.height = Math.round(viewH * dpr);
      sCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  // Ignore mobile vertical URL-bar resizes: only rebuild geometry when width changes
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (Math.abs(window.innerWidth - lastLayoutWidth) <= 2) return;
    lastLayoutWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateFlightGeometry, 120);
  }, { passive: true });
  updateFlightGeometry();

  let lastFrameTime = performance.now();
  let flapPhase = 0;
  let glideTimer = 0;
  let smoothPitch = 0;

  function animateFlight(now) {
    if ((!heroVisible && !destVisible) || document.hidden) {
      rafId = null;
      return;
    }
    rafId = requestAnimationFrame(animateFlight);

    const dt = Math.min(0.05, Math.max(0.001, (now - lastFrameTime) / 1000));
    lastFrameTime = now;

    // Organic morphing of control points toward target landmark curve
    const morphFactor = 1 - Math.exp(-6.5 * dt);
    let maxDelta = 0;
    for (let i = 0; i < 10; i++) {
      const dx = targetControlPoints[i][0] - currentControlPoints[i][0];
      const dy = targetControlPoints[i][1] - currentControlPoints[i][1];
      currentControlPoints[i][0] += dx * morphFactor;
      currentControlPoints[i][1] += dy * morphFactor;
      const d = Math.abs(dx) + Math.abs(dy);
      if (d > maxDelta) maxDelta = d;
    }
    for (let i = 0; i < 3; i++) {
      wpFractions[i] += (targetWpFractions[i] - wpFractions[i]) * morphFactor;
    }

    if (maxDelta > 0.0003 || needsPathUpdate) {
      needsPathUpdate = false;
      const d = formatPathD(currentControlPoints, viewW, viewH);
      [flightGuide, flightRibbon, flightCore].forEach(el => el && el.setAttribute('d', d));
      pathTotal = flightRibbon ? (flightRibbon.getTotalLength() || viewW) : viewW;
      if (flightRibbon) flightRibbon.style.strokeDasharray = `${pathTotal}`;
      if (flightCore) flightCore.style.strokeDasharray = `${pathTotal}`;
      updateWaypointPositions();
    }

    glideTimer += dt;
    const followEase = 1 - Math.exp(-4.8 * dt);
    const deltaProg = targetFlightProg - currentFlightProg;
    currentFlightProg += deltaProg * followEase;

    // Ambient soaring glide along the active landmark curve
    const ambientGlide = prefersReducedMotion ? 0 : (Math.sin(glideTimer * 0.75) * 0.045 + Math.sin(glideTimer * 0.3) * 0.02);
    const effectiveProg = Math.max(0.01, Math.min(0.99, currentFlightProg + ambientGlide));

    const dist = Math.max(0, Math.min(pathTotal, effectiveProg * pathTotal));
    const dashOffset = Math.max(0, pathTotal - dist);
    if (flightRibbon) flightRibbon.style.strokeDashoffset = `${dashOffset.toFixed(1)}`;
    if (flightCore) flightCore.style.strokeDashoffset = `${dashOffset.toFixed(1)}`;

    wpFractions.forEach((frac, idx) => {
      const node = wpNodes[idx];
      const label = wpLabels[idx];
      if (!node) return;
      const active = effectiveProg >= frac - 0.05;
      node.setAttribute('opacity', active ? '1' : '0.32');
      if (label) label.style.opacity = active ? '0.9' : '0';
    });

    if (flightRibbon && flightBird) {
      const pt = flightRibbon.getPointAtLength(dist);
      const ptAhead = flightRibbon.getPointAtLength(Math.min(pathTotal, dist + 20));
      const angleDeg = (Math.atan2(ptAhead.y - pt.y, ptAhead.x - pt.x) * 180) / Math.PI;

      const wingEnergy = prefersReducedMotion ? 0.1 : (0.55 + 0.35 * Math.sin(glideTimer * 0.95));
      flapPhase += dt * (prefersReducedMotion ? 1 : 4.2);

      const flapSin = Math.sin(flapPhase) * wingEnergy;
      const tipLagSin = Math.sin(flapPhase - 0.4) * wingEnergy;
      const nearRootY = -28 + flapSin * 15;
      const nearMidY = -24 + flapSin * 20;
      const nearTipY = -40 + tipLagSin * 38;

      if (gullNearWing && gullNearHighlight && gullNearTip) {
        gullNearWing.setAttribute('d', `M 8,1 C -10,${nearRootY.toFixed(1)} -42,${(nearMidY * 1.5).toFixed(1)} -96,${nearTipY.toFixed(1)} C -74,${(nearTipY * 0.56).toFixed(1)} -42,${(nearMidY * 0.42).toFixed(1)} -12,4 Z`);
        gullNearHighlight.setAttribute('d', `M 8,1 C -10,${nearRootY.toFixed(1)} -42,${(nearMidY * 1.5).toFixed(1)} -94,${nearTipY.toFixed(1)}`);
        gullNearTip.setAttribute('d', `M -72,${(nearTipY * 0.86).toFixed(1)} C -81,${(nearTipY * 0.94).toFixed(1)} -88,${(nearTipY * 0.98).toFixed(1)} -96,${nearTipY.toFixed(1)} C -87,${(nearTipY * 0.78).toFixed(1)} -76,${(nearTipY * 0.6).toFixed(1)} -65,${(nearTipY * 0.5).toFixed(1)} Z`);
      }
      if (gullFarWing && gullFarTip) {
        const farTipY = -36 + Math.sin(flapPhase - 0.3) * wingEnergy * 30;
        gullFarWing.setAttribute('d', `M -4,-3 C -18,-26 -46,-36 -84,${farTipY.toFixed(1)} C -68,${(farTipY * 0.6).toFixed(1)} -42,-12 -16,-2 Z`);
        gullFarTip.setAttribute('d', `M -64,${(farTipY * 0.88).toFixed(1)} C -72,${(farTipY * 0.94).toFixed(1)} -78,${(farTipY * 0.98).toFixed(1)} -84,${farTipY.toFixed(1)} C -77,${(farTipY * 0.8).toFixed(1)} -69,${(farTipY * 0.64).toFixed(1)} -60,${(farTipY * 0.52).toFixed(1)} Z`);
      }

      const baseScale = viewW < 480 ? 0.52 : (viewW < 1024 ? 0.72 : 0.96);
      const bob = prefersReducedMotion ? 0 : (-flapSin * 3.2 + Math.sin(glideTimer * 1.6) * 2.5) * baseScale;
      smoothPitch += (angleDeg * 0.75 - smoothPitch) * (1 - Math.exp(-7 * dt));
      flightBird.setAttribute('transform', `translate(${pt.x.toFixed(1)}, ${(pt.y + bob).toFixed(1)}) rotate(${smoothPitch.toFixed(1)}) scale(${baseScale.toFixed(2)})`);

      if (flightCompanion) {
        const cPt = flightRibbon.getPointAtLength(Math.max(0, dist - (viewW < 768 ? 44 : 96)));
        flightCompanion.setAttribute('transform', `translate(${cPt.x.toFixed(1)}, ${(cPt.y - 24).toFixed(1)}) scale(${(baseScale * 0.44).toFixed(2)})`);
      }

      if (sCtx && !prefersReducedMotion) {
        if (sparkles.length < 36 && Math.random() < 0.38) {
          sparkles.push({ x: pt.x - 24 * baseScale, y: pt.y + bob, vx: -(18 + Math.random() * 20), vy: (Math.random() - 0.5) * 14, r: 1.5 + Math.random() * 2, a: 0.7 });
        }
        sCtx.clearRect(0, 0, viewW, viewH);
        for (let i = sparkles.length - 1; i >= 0; i--) {
          const sp = sparkles[i];
          sp.x += sp.vx * dt; sp.y += sp.vy * dt; sp.a -= 0.7 * dt;
          if (sp.a <= 0.02) { sparkles.splice(i, 1); continue; }
          sCtx.fillStyle = `rgba(253, 224, 71, ${sp.a.toFixed(2)})`;
          sCtx.beginPath(); sCtx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2); sCtx.fill();
        }
      }
    }
  }

  function syncFlightLoopState() {
    const shouldRun = (heroVisible || destVisible) && !document.hidden;
    if (flightContainer) flightContainer.style.opacity = shouldRun ? '1' : '0';
    if (shouldRun && !rafId) {
      lastFrameTime = performance.now();
      rafId = requestAnimationFrame(animateFlight);
    }
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === heroSectionEl) {
          heroVisible = entry.isIntersecting;
          heroSectionEl.classList.toggle('is-offscreen', !heroVisible);
        }
        if (entry.target === destPinEl) {
          destVisible = entry.isIntersecting;
        }
      });
      syncFlightLoopState();
    }, { threshold: 0.02 });
    if (heroSectionEl) io.observe(heroSectionEl);
    if (destPinEl) io.observe(destPinEl);
  }
  document.addEventListener('visibilitychange', syncFlightLoopState);
  syncFlightLoopState();

  // 5. CHOREOGRAPHED EDITORIAL TIMELINES & RESPONSIVE DESTINATIONS
  const track = document.getElementById('destinations-track');
  const cardsTrack = document.getElementById('destinations-cards-track');
  const dots = document.querySelectorAll('.dest-dot');
  const pillBtns = document.querySelectorAll('.dest-pill-btn');
  const statusReadout = document.getElementById('flight-status-readout');
  const destNames = ['Sète (01/03)', 'Montpellier (02/03)', 'Paris (03/03)'];

  function updateActiveIndicators(idx) {
    currentDestIndex = idx;
    dots.forEach((dot, i) => {
      const span = dot.querySelector('span');
      if (!span) return;
      span.classList.toggle('bg-amber-400', i === idx);
      span.classList.toggle('scale-125', i === idx);
      span.classList.toggle('bg-white/40', i !== idx);
    });
    pillBtns.forEach((btn, i) => {
      btn.classList.toggle('text-white', i === idx);
      btn.classList.toggle('font-bold', i === idx);
      btn.classList.toggle('text-white/60', i !== idx);
    });
    document.querySelectorAll('.dest-card-slide').forEach((s, i) => s.classList.toggle('is-active', i === idx));
    if (statusReadout) statusReadout.textContent = `Flight · ${destNames[idx]}`;
    announce(`Viewing destination ${destNames[idx]}`);

    if (destVisible || (destPinEl && window.scrollY >= destPinEl.offsetTop - window.innerHeight * 0.45)) {
      const curveName = idx === 0 ? 'sete' : (idx === 1 ? 'montpellier' : 'paris');
      setTargetCurve(curveName);
    }
  }

  function flyToDestination(idx, shouldScroll = true) {
    const clamped = Math.max(0, Math.min(2, idx));
    const curveName = clamped === 0 ? 'sete' : (clamped === 1 ? 'montpellier' : 'paris');
    setTargetCurve(curveName);
    targetFlightProg = [0.58, 0.62, 0.65][clamped];
    if (!isMobileLayout && pinScrollTrigger) {
      const ratios = [0.01, 0.50, 0.96];
      scroller.scrollTo(pinScrollTrigger.start + (pinScrollTrigger.end - pinScrollTrigger.start) * ratios[clamped]);
    } else {
      if (shouldScroll && destPinEl) scroller.scrollTo(destPinEl, { offset: -72 });
      if (track) track.style.transform = `translate3d(-${clamped * 100}%, 0, 0)`;
      if (cardsTrack) cardsTrack.style.transform = `translate3d(-${clamped * 100}%, 0, 0)`;
      updateActiveIndicators(clamped);
    }
  }

  // Mobile Touch Swipe on Destinations
  let touchStartX = 0;
  let touchStartY = 0;
  if (destPinEl) {
    destPinEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    destPinEl.addEventListener('touchend', (e) => {
      if (!isMobileLayout) return;
      const dx = e.changedTouches[0].screenX - touchStartX;
      const dy = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        flyToDestination((currentDestIndex + (dx < 0 ? 1 : -1) + 3) % 3, false);
      }
    }, { passive: true });
  }

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    if (!prefersReducedMotion) {
      gsap.from('.headline-line', { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' });
      gsap.from('.hero-stagger', { y: 24, opacity: 0, duration: 0.75, stagger: 0.08, ease: 'power3.out', delay: 0.15 });

      document.querySelectorAll('.kpi-num').forEach((el) => {
        const target = Number(el.dataset.target || 0);
        const suffix = el.dataset.suffix || '';
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 1.4, ease: 'power2.out',
          onUpdate: () => { el.textContent = `${Math.round(obj.val)}${suffix}`; }
        });
      });

      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => gsap.fromTo(batch, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power3.out', clearProps: 'transform' })
      });

      const routePath = document.getElementById('corridor-route-path');
      if (routePath) {
        const len = routePath.getTotalLength();
        gsap.set(routePath, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(routePath, {
          strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut',
          scrollTrigger: { trigger: '#france-corridor-svg', start: 'top 80%', once: true }
        });
      }
    }

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      isMobileLayout = false;
      if (cardsTrack) cardsTrack.style.transform = '';
      pinScrollTrigger = ScrollTrigger.create({
        trigger: '#destinations-pin',
        start: 'top top',
        end: '+=2200',
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress;
          const mapped = Math.min(1, Math.max(0, (p - 0.02) / 0.96));
          gsap.set([track, cardsTrack], { xPercent: -mapped * 200 });
          const activeIdx = Math.min(2, Math.floor(p * 2.99));
          updateActiveIndicators(activeIdx);
          const curveName = activeIdx === 0 ? 'sete' : (activeIdx === 1 ? 'montpellier' : 'paris');
          setTargetCurve(curveName);
          const localP = (p * 3) - activeIdx;
          targetFlightProg = 0.18 + Math.min(1, Math.max(0, localP)) * 0.72;
        }
      });
      return () => { if (pinScrollTrigger) { pinScrollTrigger.kill(); pinScrollTrigger = null; } };
    });

    mm.add('(max-width: 1023px)', () => {
      isMobileLayout = true;
      updateActiveIndicators(currentDestIndex);
    });
  }

  // 6. 7-LANGUAGE I18N SWITCHER
  function applyLanguage(lang) {
    if (!I18N[lang]) lang = 'en';
    currentLang = lang;
    const dict = I18N[lang];
    document.documentElement.lang = lang;
    const codeEl = document.getElementById('currentLangCode');
    if (codeEl) codeEl.textContent = lang.toUpperCase();
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });
    try { localStorage.setItem('formaskills_lang', lang); } catch (_) { }
  }

  try {
    const saved = localStorage.getItem('formaskills_lang');
    if (saved && I18N[saved]) applyLanguage(saved);
  } catch (_) { }

  // 7. SITE-WIDE DUAL-PERSONA SWITCHER
  function setPersona(persona) {
    currentPersona = persona;
    document.querySelectorAll('.persona-btn').forEach((btn) => {
      const active = btn.dataset.persona === persona;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.classList.toggle('bg-amber-400', active);
      btn.classList.toggle('text-primary', active);
      btn.classList.toggle('font-bold', active);
      btn.classList.toggle('text-slate-200', !active);
      btn.classList.toggle('text-slate-300', !active);
    });
    const subtitle = document.getElementById('hero-persona-subtitle');
    const focusSelect = document.getElementById('quick-focus');
    if (persona === 'organisation') {
      if (subtitle) subtitle.textContent = 'Accredited Erasmus+ KA1/KA2 hosting (PIC 8991204 · Atout France IM034230008). Complete group logistics, Learning Agreements, Europass Mobility, and 24/7 Sète coordination.';
      if (focusSelect) focusSelect.value = 'Erasmus+ KA1/KA2';
    } else {
      if (subtitle) subtitle.textContent = (I18N[currentLang] && I18N[currentLang].hero_subtitle) || 'Learn French, discover its culture, and live a unique accredited educational journey in France — soaring from our Mediterranean headquarters in Sète to Montpellier and Paris.';
      if (focusSelect) focusSelect.value = 'FLE + Culture';
    }
  }

  // 8. INTERACTIVE MODULES (OFFERS, ERASMUS+, FAQ, SPOTLIGHT)
  const OFFER_DETAILS = {
    fle: { kicker: 'Pillar 01 · Certified Linguistics', title: 'French Learning (FLE)', desc: 'Morning CEFR workshops capped at 12 learners, paired with afternoon field tasks in Sète, Montpellier, and Paris.', bullets: ['15–20 hrs/week with FLE-certified native instructors', 'Pre-arrival placement test + CEFR A1–C2 certificate', 'Real-world interviews in markets, bakeries & heritage sites'], focusVal: 'FLE + Culture' },
    culture: { kicker: 'Pillar 02 · Occitanie & Paris', title: 'Cultural Experiences', desc: 'Authentic regional discovery guided by local artisans, historians, and educators.', bullets: ['Bassin de Thau oyster cooperative atelier & tasting', 'UNESCO days: Pont du Gard, Carcassonne & Montpellier', 'Paris tracks: Latin Quarter seminars, Louvre & Orsay'], focusVal: 'FLE + Culture' },
    housing: { kicker: 'Pillar 03 · 24/7 Safeguarding', title: 'Vetted Accommodation', desc: 'Every host family and residence is inspected in person by our Sète operational team.', bullets: ['Vetted French host families (half-board or full-board)', 'Seaside student residences in Sète & central hubs', 'Strict minor safeguarding & 24/7 emergency line'], focusVal: 'Host Family Homestay' }
  };

  const FAQ_ITEMS = [
    { cat: 'erasmus', q: 'Are you registered for Erasmus+ KA1 & KA2 school mobility grants?', a: 'Yes. Formaskills Travel SAS is PIC registered (8991204) and Atout France licensed (IM034230008). We prepare Learning Agreements, attendance sheets, and Europass Mobility certificates.' },
    { cat: 'fle', q: 'Which French proficiency levels (CEFR) are supported?', a: 'Complete beginners through advanced learners (CEFR A1 to C2), placed in small cohorts of 10–12 students.' },
    { cat: 'safety', q: 'How are French host families vetted and monitored?', a: 'Our Sète operational team inspects every host family in person, verifies safeguarding checks, and operates a 24/7 emergency coordinator line.' },
    { cat: 'erasmus', q: 'Do you arrange company internships or job placements?', a: 'No. Formaskills Travel exclusively organizes educational, linguistic (FLE), and cultural immersion programmes.' },
    { cat: 'safety', q: 'How fast do we receive a custom quote?', a: 'Within 48 hours at zero obligation, including a day-by-day syllabus and transparent budget breakdown.' }
  ];
  let activeFaqCat = 'all';

  function renderFaq() {
    const list = document.getElementById('faqList');
    if (!list) return;
    const items = FAQ_ITEMS.filter(i => activeFaqCat === 'all' || i.cat === activeFaqCat);
    list.innerHTML = items.map((item, idx) => `
      <div class="faq-item rounded-2xl border border-border bg-white overflow-hidden" data-open="false">
        <button type="button" data-action="toggle-faq" aria-expanded="false" aria-controls="faq-panel-${idx}"
                class="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-linen/50 transition min-h-[52px]">
          <span class="font-semibold text-sm text-primary">${item.q}</span>
          <span class="faq-chevron text-amber-700 transition-transform duration-300 shrink-0">▾</span>
        </button>
        <div id="faq-panel-${idx}" class="faq-grid">
          <div><p class="px-5 pb-4 pt-2 text-xs sm:text-sm text-slate-600 font-light leading-relaxed border-t border-border/60">${item.a}</p></div>
        </div>
      </div>
    `).join('');
  }
  renderFaq();

  const estStudents = document.getElementById('estStudents');
  const estDays = document.getElementById('estDays');
  function updateErasmusEstimator() {
    if (!estStudents || !estDays) return;
    const s = parseInt(estStudents.value, 10) || 24;
    const d = parseInt(estDays.value, 10) || 7;
    document.getElementById('estStudentsVal').textContent = `${s} students`;
    document.getElementById('estDaysVal').textContent = `${d} days`;
    estStudents.style.setProperty('--pct', `${((s - 8) / 52) * 100}%`);
    estDays.style.setProperty('--pct', `${((d - 5) / 16) * 100}%`);

    const groups = Math.max(1, Math.ceil(s / 12));
    const hours = Math.max(12, Math.round(d * 3));
    const teachers = Math.max(1, Math.ceil(s / 14));
    document.getElementById('estOutGroups').textContent = `${groups} ${groups === 1 ? 'class' : 'classes'}`;
    document.getElementById('estOutHours').textContent = `${hours} hrs`;
    document.getElementById('estOutTeachers').textContent = `${teachers} ${teachers === 1 ? 'teacher' : 'teachers'}`;
  }
  [estStudents, estDays].forEach(el => el && el.addEventListener('input', updateErasmusEstimator));
  updateErasmusEstimator();

  if (isFinePointer) {
    document.querySelectorAll('.spotlight-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  // 9. CENTRALIZED DELEGATED EVENT HANDLER (CSP-Safe)
  const drawer = document.getElementById('mobileDrawer');
  const drawerBg = document.getElementById('mobileDrawerBackdrop');
  const menuBtn = document.getElementById('mobileMenuBtn');
  const langMenu = document.getElementById('langDropdownMenu');
  const langBtn = document.getElementById('langDropdownBtn');
  const offerBd = document.getElementById('offerModalBackdrop');
  const offerCard = document.getElementById('offerModalCard');

  function setDrawerOpen(open) {
    if (!drawer || !drawerBg) return;
    drawer.classList.toggle('translate-x-full', !open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    drawerBg.classList.toggle('opacity-0', !open);
    drawerBg.classList.toggle('pointer-events-none', !open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function setOfferModalOpen(open) {
    if (!offerBd || !offerCard) return;
    offerBd.classList.toggle('opacity-0', !open);
    offerBd.classList.toggle('pointer-events-none', !open);
    offerBd.setAttribute('aria-hidden', open ? 'false' : 'true');
    offerCard.classList.toggle('scale-95', !open);
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-action]');
    if (!trigger) {
      if (langMenu && !e.target.closest('#langSwitcherWrap')) {
        langMenu.classList.add('hidden');
        if (langBtn) langBtn.setAttribute('aria-expanded', 'false');
      }
      return;
    }
    const action = trigger.dataset.action;

    if (action === 'toggle-lang' && langMenu) {
      const isHidden = langMenu.classList.toggle('hidden');
      if (langBtn) langBtn.setAttribute('aria-expanded', isHidden ? 'false' : 'true');
    } else if (action === 'set-lang') {
      applyLanguage(trigger.dataset.lang || 'en');
      if (langMenu) langMenu.classList.add('hidden');
      if (langBtn) langBtn.setAttribute('aria-expanded', 'false');
    } else if (action === 'toggle-drawer') {
      setDrawerOpen(drawer && drawer.classList.contains('translate-x-full'));
    } else if (action === 'close-drawer') {
      setDrawerOpen(false);
    } else if (action === 'set-persona') {
      setPersona(trigger.dataset.persona);
    } else if (action === 'focus-finder') {
      const card = document.getElementById('quick-finder-card');
      if (card) scroller.scrollTo(card, { offset: -96 });
      document.getElementById('quick-dest')?.focus();
    } else if (action === 'apply-quick-finder') {
      const dest = document.getElementById('quick-dest').value;
      const season = document.getElementById('quick-season').value;
      const focus = document.getElementById('quick-focus').value;
      const rates = {
        'Sète': '€890 – €1,150 / week',
        'Montpellier': '€940 – €1,220 / week',
        'Paris': '€1,290 – €1,650 / week',
        'Multi-Hub': '€1,080 – €1,380 / week'
      };
      const preview = document.getElementById('quick-rate-preview');
      const valEl = document.getElementById('quick-rate-value');
      const cohortEl = document.getElementById('quick-rate-cohort');
      if (preview && valEl) {
        valEl.textContent = currentPersona === 'organisation'
          ? `${dest} · Erasmus+ EU Unit-Cost Aligned`
          : `${dest} · ${rates[dest] || 'From €890 / week'}`;
        if (cohortEl) cohortEl.textContent = `${season} open`;
        preview.classList.remove('hidden');
      }
      document.getElementById('plan_dest').value = dest;
      document.getElementById('plan_focus').value = focus;
    } else if (action === 'open-planner' || action === 'open-planner-drawer') {
      if (action === 'open-planner-drawer') setDrawerOpen(false);
      const ctx = trigger.dataset.context || '';
      if (ctx.includes('Sète')) document.getElementById('plan_dest').value = 'Sète';
      else if (ctx.includes('Montpellier')) document.getElementById('plan_dest').value = 'Montpellier';
      else if (ctx.includes('Paris')) document.getElementById('plan_dest').value = 'Paris';
      scroller.scrollTo('#planner', { offset: -88 });
    } else if (action === 'fly-dest') {
      flyToDestination(parseInt(trigger.dataset.index, 10) || 0, true);
    } else if (action === 'step-dest') {
      const delta = parseInt(trigger.dataset.delta, 10) || 1;
      flyToDestination((currentDestIndex + delta + 3) % 3, false);
    } else if (action === 'toggle-autofly') {
      if (autoFlyTimer) {
        clearInterval(autoFlyTimer); autoFlyTimer = null;
        trigger.setAttribute('aria-pressed', 'false');
        trigger.textContent = 'Auto-Fly';
      } else {
        let step = 0;
        flyToDestination(0);
        trigger.setAttribute('aria-pressed', 'true');
        trigger.textContent = 'Stop Tour';
        autoFlyTimer = setInterval(() => {
          step = (step + 1) % 3;
          flyToDestination(step, false);
        }, 2600);
      }
    } else if (action === 'open-offer') {
      const data = OFFER_DETAILS[trigger.dataset.offer];
      if (!data) return;
      document.getElementById('offerModalKicker').textContent = data.kicker;
      document.getElementById('offerModalTitle').textContent = data.title;
      document.getElementById('offerModalDesc').textContent = data.desc;
      document.getElementById('offerModalBullets').innerHTML = data.bullets.map(b => `<li>• ${b}</li>`).join('');
      document.getElementById('offerModalCta').onclick = () => {
        setOfferModalOpen(false);
        document.getElementById('plan_focus').value = data.focusVal;
        scroller.scrollTo('#planner', { offset: -88 });
      };
      setOfferModalOpen(true);
    } else if (action === 'close-offer') {
      if (e.target === offerBd || trigger.tagName === 'BUTTON') setOfferModalOpen(false);
    } else if (action === 'apply-erasmus') {
      document.getElementById('plan_pax').value = estStudents.value;
      document.getElementById('plan_dest').value = document.getElementById('estHub').value;
      document.getElementById('plan_focus').value = 'Erasmus+ KA1/KA2';
      document.getElementById('plan_notes').value = `Erasmus+ cohort: ${estStudents.value} students for ${estDays.value} days in ${document.getElementById('estHub').value}.`;
      const orgRadio = document.querySelector('input[name="audience"][value="For my organisation"]');
      if (orgRadio) orgRadio.checked = true;
      scroller.scrollTo('#planner', { offset: -88 });
    } else if (action === 'faq-cat') {
      activeFaqCat = trigger.dataset.cat;
      document.querySelectorAll('.faq-cat-btn').forEach(b => {
        const on = b === trigger;
        b.classList.toggle('bg-primary', on);
        b.classList.toggle('text-white', on);
        b.classList.toggle('bg-white', !on);
        b.classList.toggle('text-slate-700', !on);
      });
      renderFaq();
    } else if (action === 'toggle-faq') {
      const item = trigger.closest('.faq-item');
      const open = item.dataset.open !== 'true';
      item.dataset.open = open ? 'true' : 'false';
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    } else if (action === 'copy-brief') {
      const txt = document.getElementById('englishBriefText')?.textContent || '';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(txt).then(() => {
          trigger.textContent = 'Copied!';
          setTimeout(() => { trigger.textContent = 'Copy Brief'; }, 2000);
        });
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setDrawerOpen(false);
      setOfferModalOpen(false);
      if (langMenu) langMenu.classList.add('hidden');
    }
  });

  document.getElementById('plannerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const err = document.getElementById('planner_error');
    const name = document.getElementById('contact_name').value.trim();
    const email = document.getElementById('contact_email').value.trim();
    const gdpr = document.getElementById('gdpr_consent').checked;
    if (!name || !email || !gdpr) {
      err.textContent = 'Please complete your name, valid email, and GDPR consent checkbox.';
      err.classList.remove('hidden');
      return;
    }
    err.classList.add('hidden');
    const audience = document.querySelector('input[name="audience"]:checked')?.value || 'For me';
    const brief = [
      'FORMASKILLS TRAVEL — COORDINATION BRIEF (SÈTE HQ)',
      `Language     : ${currentLang.toUpperCase()}`,
      `Audience     : ${audience}`,
      `Contact      : ${name} <${email}>`,
      `Institution  : ${document.getElementById('school_name').value.trim() || 'Independent'}`,
      `Destination  : ${document.getElementById('plan_dest').value}`,
      `Focus        : ${document.getElementById('plan_focus').value}`,
      `Participants : ${document.getElementById('plan_pax').value}`,
      `Notes        : ${document.getElementById('plan_notes').value.trim() || 'None'}`
    ].join('\n');
    document.getElementById('englishBriefText').textContent = brief;
    document.getElementById('planner_success_alert').classList.remove('hidden');
    announce('Coordination brief prepared for Sète HQ.');
  });
});
