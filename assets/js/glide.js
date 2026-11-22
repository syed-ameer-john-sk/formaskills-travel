/* Formaskills Travel — "Golden hour glide": a photographed white-tailed tropicbird crossing a
   sea of clouds as the page scrolls.
   Scroll progress over a sticky stage drives the flight path, distance (scale), climb angle and a
   gentle 3D turn; time adds the small lifts and rolls a soaring bird makes in moving air.
   Per frame only transform / opacity are written (compositor-only, no layout reads in scroll). */
(() => {
  const root = document.querySelector('[data-glide]');
  if (!root) return;
  const bird = root.querySelector('[data-glide-bird]');
  const clouds = root.querySelector('[data-glide-clouds]');
  const sun = root.querySelector('[data-glide-sun]');
  const copy = root.querySelector('[data-glide-copy]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => t * t * (3 - 2 * t);

  // Keyframes: x / y in viewport fractions, s = scale, z = climb angle (deg, negative = nose up),
  // ry = turn towards (+) or away from (-) the viewer.
  const KEYS = [
    { p: 0, x: -.32, y: .86, s: .55, z: -10, ry: 22 },
    { p: .28, x: .22, y: .66, s: .8, z: -6, ry: 12 },
    { p: .52, x: .57, y: .58, s: 1, z: -3, ry: 0 },
    { p: .78, x: .8, y: .33, s: .82, z: -8, ry: -12 },
    { p: 1, x: 1.32, y: .1, s: .62, z: -14, ry: -22 },
  ];
  const at = (p) => {
    let i = 0; while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
    const a = KEYS[i], c = KEYS[i + 1], k = ease(clamp((p - a.p) / (c.p - a.p)));
    return { x: lerp(a.x, c.x, k), y: lerp(a.y, c.y, k), s: lerp(a.s, c.s, k), z: lerp(a.z, c.z, k), ry: lerp(a.ry, c.ry, k) };
  };

  let W = innerWidth, H = innerHeight, top0 = 0, run = 1;
  const measure = () => {
    W = innerWidth; H = innerHeight;
    top0 = root.getBoundingClientRect().top + scrollY;
    run = Math.max(1, root.offsetHeight - H);
  };

  let cur = reduce ? .52 : 0, target = cur, visible = false, running = false;
  const readTarget = () => { target = reduce ? .52 : clamp((scrollY - top0) / run); };

  function frame(now) {
    running = false;
    const t = now / 1000;
    cur = lerp(cur, target, .09);
    const k = at(cur);
    const calm = reduce ? 0 : 1;
    // air: slow lift and settle, a little roll, a faint flex as the wings take the load
    const lift = Math.sin(t * 1.1) * H * .008 + Math.sin(t * .47 + 1) * H * .006;
    const roll = Math.sin(t * .8 + .6) * 1.4;
    const flex = 1 + Math.sin(t * 1.1 - .9) * .012;
    bird.style.transform =
      `translate3d(${(k.x * W).toFixed(1)}px,${(k.y * H + lift * calm).toFixed(1)}px,0) translate(-50%,-50%) ` +
      `perspective(1400px) rotateY(${k.ry.toFixed(2)}deg) rotateX(${(roll * .6 * calm).toFixed(2)}deg) ` +
      `rotate(${(k.z + roll * calm).toFixed(2)}deg) scale(${k.s.toFixed(4)},${(k.s * (calm ? flex : 1)).toFixed(4)})`;
    bird.style.opacity = clamp(Math.min((cur + .03) * 10, (1.03 - cur) * 10)).toFixed(3);

    clouds.style.transform = `translate3d(0,${(cur * 9).toFixed(2)}%,0) scale(${(1.08 + cur * .1).toFixed(4)})`;
    sun.style.transform = `translate3d(${(cur * 4).toFixed(2)}vw,${(cur * 10).toFixed(2)}vh,0)`;
    const c = reduce ? 1 : clamp((cur - .1) / .14) * clamp((.9 - cur) / .14);
    copy.style.opacity = c.toFixed(3);
    copy.style.transform = `translate3d(0,${((1 - c) * 18).toFixed(1)}px,0)`;

    if (visible && !reduce) tick();
  }
  const tick = () => { if (!running) { running = true; requestAnimationFrame(frame); } };

  measure(); readTarget(); cur = target;
  addEventListener('scroll', () => { readTarget(); tick(); }, { passive: true });
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { measure(); readTarget(); tick(); }, 150); });
  addEventListener('load', () => { measure(); readTarget(); tick(); });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) tick(); }, { rootMargin: '10% 0px' }).observe(root);
  tick();
})();
