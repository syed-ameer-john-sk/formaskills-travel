/* Formaskills Travel — sculpted coastal bird renderer (canvas 2D, no dependencies).
   Mediterranean swift / gull hybrid: tapered fuselage with a fine beak tip and forked tail,
   cambered inner wing (arm) and swept, tapered outer primaries (hand). Clean two-tone
   shading — crisp light upper wing, muted slate / brand-blue underwing — with no glow,
   no shadowBlur, no filters and no additive blending.
   Flight: asymmetric wingbeat (crisp downstroke, softer upstroke) with calm glides; the
   caller supplies banking roll and drift. Orthographic projection with yaw, roll, nose pitch
   and camera pitch so the wings foreshorten as they beat. */
(() => {
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

  // Natural, cool palette: white plumage, atmospheric slate, brand blue (#315fc4) in the shade.
  const PAL = {
    upper: ['#f7f9fc', '#dde3ee'],        // light upper wing (root → hand)
    upperTip: '#7c889f',                  // slate primaries seen from above
    under: ['#56658a', '#3f5486'],        // muted slate → brand-blue underwing
    underTip: '#2c3a5e',
    bodyTop: '#f4f6fa', bodyBelly: '#b9c3d6',
    beak: '#5a6176', eye: '#1b2133',
  };

  // ---------- wing geometry in bird space (x forward, y up, z span) ----------
  function wing(side, pose) {
    const { a1, a2, fold, sweep } = pose;
    const S = [.06, 0, .055 * side];                              // shoulder
    const arm = .36, hand = .62 * (1 - fold * .3);
    const d1 = [.04 - sweep * .06, Math.sin(a1), Math.cos(a1) * side];
    const E = add(S, mul(d1, arm));                               // wrist
    const a = a1 + a2;
    const d2 = [-.3 - sweep * .4 - fold * .25, Math.sin(a), Math.cos(a) * side]; // swept hand
    const T = add(E, mul(d2, hand / Math.hypot(...d2)));          // pointed tip
    // cambered leading edge (arm bulges forward), tapering trailing edge
    const camber = [.045, .012, 0];
    const lead = [S, add(mix(S, E, .45), camber), E, add(mix(E, T, .45), [.015, 0, 0]), T];
    const trail = [
      add(mix(E, T, .78), [-.05, 0, 0]),
      add(mix(E, T, .45), [-.13, 0, 0]),
      add(E, [-.23, 0, 0]),
      add(mix(S, E, .55), [-.27, -.006, 0]),
      add(S, [-.25, 0, 0]),
    ];
    return { S, E, T, side, outline: [...lead, ...trail], nArm: [0, Math.cos(a1), -Math.sin(a1) * side] };
  }

  function poseFor(b) {
    // asymmetric cycle: phase warp spends less time in the downstroke
    const w = b.phase + .42 * Math.sin(b.phase);
    const amp = b.amp;
    const a1 = lerp(.16, .08, amp) + amp * .6 * Math.sin(w);
    const a2 = lerp(-.22, -.04, amp) + amp * .52 * Math.sin(w - 1.1);
    const up = Math.max(0, Math.cos(w));
    return { a1, a2, fold: amp * up * .85, sweep: amp * up * .55 + (1 - amp) * .2, bob: -amp * .035 * Math.sin(w + .4) };
  }

  function makeXf(o) {
    const cy = Math.cos(o.yaw), sy = Math.sin(o.yaw);
    const cr = Math.cos(o.roll || 0), sr = Math.sin(o.roll || 0);
    const cn = Math.cos(o.pitch || 0), sn = Math.sin(o.pitch || 0);
    const cp = Math.cos(o.cam ?? .35), sp = Math.sin(o.cam ?? .35);
    const rot = (p) => {
      let [x, y, z] = p;
      [x, y] = [x * cn - y * sn, x * sn + y * cn];
      [y, z] = [y * cr - z * sr, y * sr + z * cr];
      [x, z] = [x * cy + z * sy, -x * sy + z * cy];
      [y, z] = [y * cp - z * sp, y * sp + z * cp];
      return [x, y, z];
    };
    return { rot, P: (p) => { const r = rot(p); return [o.x + r[0] * o.size, o.y - r[1] * o.size, r[2]]; } };
  }

  const smoothPath = (ctx, pts) => {
    const n = pts.length; ctx.beginPath();
    const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const s = m(pts[n - 1], pts[0]); ctx.moveTo(s[0], s[1]);
    for (let i = 0; i < n; i++) { const c = pts[i], e = m(c, pts[(i + 1) % n]); ctx.quadraticCurveTo(c[0], c[1], e[0], e[1]); }
    ctx.closePath();
  };
  const poly = (ctx, pts) => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); };

  function drawBird(ctx, b, o) {
    const pose = poseFor(b);
    const { P, rot } = makeXf(o);
    const s = o.size;
    const detail = o.mode !== 'sil';
    const Pb = (p) => P([p[0], p[1] + pose.bob, p[2]]);

    const wings = [wing(1, pose), wing(-1, pose)].map(w => ({ w, pts: w.outline.map(Pb), depth: Pb(mix(w.S, w.T, .5))[2], top: rot(w.nArm)[2] > 0 }))
      .sort((a, c) => a.depth - c.depth);

    // fuselage: tapered spindle along the spine, fine beak tip, forked tail
    const nose = Pb([.44, .015, 0]), head = Pb([.33, .03, 0]), chest = Pb([.12, 0, 0]), belly = Pb([-.08, -.01, 0]), rump = Pb([-.26, 0, 0]);
    const spine = [rump, belly, chest, head], radii = [.035, .07, .072, .045];
    const L = [], R = [];
    for (let i = 0; i < spine.length; i++) {
      const a = spine[Math.max(0, i - 1)], c = spine[Math.min(spine.length - 1, i + 1)];
      let dx = c[0] - a[0], dy = c[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
      const r = radii[i] * s;
      L.push([spine[i][0] - dy * r, spine[i][1] + dx * r]); R.push([spine[i][0] + dy * r, spine[i][1] - dx * r]);
    }
    const body = [...L, nose, ...[...R].reverse()];
    const tail = [Pb([-.24, 0, .035]), Pb([-.5, -.004, .085]), Pb([-.4, -.004, 0]), Pb([-.5, -.004, -.085]), Pb([-.24, 0, -.035])];

    const bodyDepth = Pb([0, 0, 0])[2];
    ctx.save();
    ctx.globalAlpha = o.alpha ?? 1;
    ctx.lineJoin = 'round';

    const fillWing = (g) => {
      if (!detail) { ctx.fillStyle = o.color; smoothPath(ctx, g.pts); ctx.fill(); return; }
      const root = Pb(g.w.S), tip = Pb(g.w.T);
      const gr = ctx.createLinearGradient(root[0], root[1], tip[0], tip[1]);
      if (g.top) { gr.addColorStop(0, PAL.upper[0]); gr.addColorStop(.55, PAL.upper[1]); gr.addColorStop(.82, PAL.upperTip); gr.addColorStop(1, PAL.upperTip); }
      else { gr.addColorStop(0, PAL.under[0]); gr.addColorStop(.6, PAL.under[1]); gr.addColorStop(1, PAL.underTip); }
      ctx.fillStyle = gr; smoothPath(ctx, g.pts); ctx.fill();
      // crisp leading-edge line gives the wing a sculpted, cambered read
      if (s > 28) {
        ctx.strokeStyle = g.top ? 'rgba(255,255,255,.9)' : 'rgba(150,170,210,.55)';
        ctx.lineWidth = Math.max(.7, s * .008);
        ctx.beginPath(); ctx.moveTo(g.pts[0][0], g.pts[0][1]);
        ctx.quadraticCurveTo(g.pts[1][0], g.pts[1][1], g.pts[2][0], g.pts[2][1]);
        ctx.quadraticCurveTo(g.pts[3][0], g.pts[3][1], g.pts[4][0], g.pts[4][1]);
        ctx.stroke();
      }
    };
    const fillBody = () => {
      if (!detail) {
        ctx.fillStyle = o.color; poly(ctx, tail); ctx.fill(); smoothPath(ctx, body); ctx.fill(); return;
      }
      const top = Pb([0, .1, 0]), bot = Pb([0, -.1, 0]);
      const gr = ctx.createLinearGradient(top[0], top[1], bot[0], bot[1]);
      gr.addColorStop(0, PAL.bodyTop); gr.addColorStop(.55, PAL.bodyTop); gr.addColorStop(1, PAL.bodyBelly);
      ctx.fillStyle = gr; poly(ctx, tail); ctx.fill(); smoothPath(ctx, body); ctx.fill();
      // beak tip and eye
      const bk = [Pb([.4, .026, 0]), Pb([.5, .012, 0]), Pb([.4, .004, 0])];
      ctx.fillStyle = PAL.beak; poly(ctx, bk); ctx.fill();
      if (s > 40) {
        const e1 = Pb([.35, .045, .03]), e2 = Pb([.35, .045, -.03]), e = e1[2] > e2[2] ? e1 : e2;
        ctx.fillStyle = PAL.eye; ctx.beginPath(); ctx.arc(e[0], e[1], s * .0075, 0, TAU); ctx.fill();
      }
    };

    if (wings[0].depth < bodyDepth) fillWing(wings[0]);
    fillBody();
    if (wings[0].depth >= bodyDepth) fillWing(wings[0]);
    fillWing(wings[1]);
    ctx.restore();
  }

  // ---------- behaviour ----------
  let seedN = 1;
  const rnd = (s) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  function create(opts = {}) {
    const k = opts.seed ?? seedN++;
    return {
      seed: k, phase: rnd(k) * TAU, amp: rnd(k + 1) > .4 ? 1 : 0,
      freq: opts.freq ?? (2.2 + rnd(k + 2) * .7),                 // wingbeats per second
      glideBias: opts.glideBias ?? (.15 + rnd(k + 3) * .35),
      rhythm: .35 + rnd(k + 4) * .3, off: rnd(k + 5) * 100,
    };
  }
  function step(b, dt, t) {
    dt = Math.min(.033, Math.max(0, dt));
    const s = Math.sin(t * b.rhythm + b.off) + Math.sin(t * b.rhythm * 2.3 + b.off * 1.7) * .5;
    const target = s > b.glideBias * 2 - .6 ? 1 : 0;                // flap bursts between calm glides
    b.amp += (target - b.amp) * clamp(dt * (target ? 3 : 1.6), 0, 1);
    b.phase = (b.phase + dt * TAU * b.freq * (.2 + .8 * Math.min(1, b.amp * 1.6))) % (TAU * 1000);
  }

  window.FSBirds = { create, step, draw: drawBird };
})();
