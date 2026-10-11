// Local-coordinate stroke definitions for the named Ashwick presets.
window.ASHWICK_PRESETS = (() => {
  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);
  const ring = (r = 1, n = 72, a0 = 0, a1 = TAU, cx = 0, cy = 0) =>
    Array.from({ length: n + 1 }, (_, i) => {
      const a = a0 + (a1 - a0) * i / n;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    });
  const poly = (n, rot = -Math.PI / 2, r = 1) =>
    Array.from({ length: n }, (_, i) => {
      const a = rot + i * TAU / n;
      return [Math.cos(a) * r, Math.sin(a) * r];
    });
  const ray = (a, r0, r1) => [[Math.cos(a) * r0, Math.sin(a) * r0], [Math.cos(a) * r1, Math.sin(a) * r1]];
  const seg = ([x0, y0], [x1, y1], e = .09) => [[x0 - (x1 - x0) * e, y0 - (y1 - y0) * e], [x1 + (x1 - x0) * e, y1 + (y1 - y0) * e]];
  const brk = (r, k, gap, rot) => Array.from({ length: k }, (_, i) => ring(r, 24, rot + i * TAU / k + gap / 2, rot + (i + 1) * TAU / k - gap / 2));
  const dots = (r, n) => Array.from({ length: n }, (_, i) => {
    const a = i / n * TAU + .2, x = Math.cos(a) * r, y = Math.sin(a) * r;
    return [[x, y], [x + .012, y]];
  });
  const spark = (x, y, z) => [[[x - z, y], [x + z, y]], [[x, y - z], [x, y + z]]];
  const tri = rot => {
    const p = poly(3, rot, .86);
    return [seg(p[0], p[1]), seg(p[1], p[2]), seg(p[2], p[0])];
  };

  return {
    Earth: () => [...brk(1, 3, .5, .6), [[-.8, .5], [-.45, -.2], [-.25, .1], [0, -.7], [.25, .05], [.5, -.3], [.8, .5]], seg([-.9, .5], [.9, .5]), [[-.5, .55], [-.4, .72], [-.5, .88]], [[.2, .55], [.3, .72], [.2, .92]], ...dots(.9, 8)],
    Wind: () => {
      const sp = (a0, t0) => Array.from({ length: 50 }, (_, i) => {
        const t = i / 49, a = a0 + t * t0 * TAU, r = .1 + t * .85;
        return [Math.cos(a) * r, Math.sin(a) * r];
      });
      return [...brk(1, 3, .7, .5), sp(0, 1.5), sp(TAU / 2, 1.5), [[.55, -.6], [.8, -.62]], [[-.6, .62], [-.85, .6]], ...dots(.93, 6)];
    },
    Void: () => [...brk(1, 4, .4, .3), ring(.9, 48).map(([x, y]) => [x, y * .3]).map(([x, y]) => [x * Math.cos(-.35) - y * Math.sin(-.35), x * Math.sin(-.35) + y * Math.cos(-.35)]), ring(.2, 20), ...[0, 2.1, 4.2].map(a0 => Array.from({ length: 30 }, (_, i) => {
      const t = i / 29, a = a0 + t * 2.2, r = .7 - t * .5;
      return [Math.cos(a) * r, Math.sin(a) * r];
    })), ...dots(.93, 8)],
    Ward: () => [...brk(1, 5, .22, rand(0, 6)), ring(.86, 60), ...tri(-Math.PI / 2), ...tri(Math.PI / 2), ring(.13, 16), ...dots(.93, 14)],
    Flame: () => [...brk(1, 3, .5, .4), [[0, -.95], [.12, -.6], [.3, -.35], [.18, -.2], [.5, -.05], [.46, .3], [.3, .6], [0, .72], [-.3, .6], [-.48, .3], [-.44, -.05], [-.22, -.15], [-.3, -.45], [-.1, -.55], [0, -.95]], [[0, .12], [.14, .38], [.06, .58], [-.06, .58], [-.14, .38], [0, .12]], [[.7, -.5], [.8, -.64]], [[-.72, -.3], [-.82, -.44]], [[.62, .5], [.72, .6]], ...dots(.9, 8)],
    Moon: () => {
      const A = ring(.8, 60, .35, TAU - .35).filter(p => Math.hypot(p[0] - .34, p[1] + .04) > .68);
      const B = ring(.68, 60, Math.PI / 2 - .7, Math.PI * 1.5 + .7, .34, -.04).filter(p => Math.hypot(p[0], p[1]) < .8);
      return [...brk(1, 4, .35, .2), A, B, ...spark(.5, -.3, .1), ...spark(.62, .12, .06), ...spark(.36, .42, .12), ...dots(.92, 10)];
    },
    Eye: () => {
      const u = [], l = [], lash = [];
      for (let i = 0; i <= 30; i++) {
        const x = -.9 + 1.8 * i / 30, y = .5 * (1 - (x / .9) ** 2);
        u.push([x, -y]); l.push([x, y]);
      }
      for (let i = 0; i < 8; i++) {
        const x = -.8 + i * .23, y = -.5 * (1 - (x / .9) ** 2);
        lash.push([[x, y], [x * 1.1, y - .12 - .08 * Math.abs(Math.sin(i * 3.1))]]);
      }
      return [...brk(1, 4, .3, .7), u, l, ...lash, ring(.26, 24), ring(.09, 12), ...Array.from({ length: 10 }, (_, i) => ray(i / 10 * TAU, .12, .24)), ...dots(.85, 10)];
    },
    Random: () => {
      const n = 5 + (Math.random() * 5 | 0), k = ([3, 2].find(k => n % k && k < n / 2) || 1), V = poly(n, rand(0, TAU), rand(.7, .95));
      return [...brk(1, 3 + (Math.random() * 3 | 0), .3, rand(0, 6)), ring(rand(.4, .7), 60), ...V.map((p, i) => seg(p, V[(i + k) % n])), ...dots(.97, n * 2)];
    }
  };
})();
