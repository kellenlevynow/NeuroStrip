/* Hero: the force versus activation traces. Curves are synthetic, drawn to match the 7% and 37% gaps. */
(function () {
  'use strict';
  const { $ } = window.NSU;
  const W = 560, H = 130, BASE = 118, TOP = 14;

  function rng(seed) {
    let a = seed >>> 0;
    return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const smooth = (a, b, t) => { const x = Math.min(1, Math.max(0, (t - a) / (b - a))); return x * x * (3 - 2 * x); };
  const gate = (t) => smooth(0.1, 0.26, t) * (1 - smooth(0.74, 0.9, t));

  function forcePts(amp, seed) {
    const r = rng(seed), pts = [];
    for (let i = 0; i <= 140; i++) {
      const t = i / 140;
      const g = gate(t) * (1 - 0.06 * smooth(0.3, 0.74, t)) + 0.012 * Math.sin(t * 46 + seed) * gate(t) + (r() - 0.5) * 0.006;
      pts.push([t * W, BASE - g * amp * (BASE - TOP)]);
    }
    return pts;
  }
  function emgPts(amp, seed) {
    const r = rng(seed), raw = [], env = [];
    for (let i = 0; i <= 280; i++) {
      const t = i / 280;
      const g = gate(t) * (0.82 + 0.18 * Math.sin(t * 19 + seed * 0.7));
      const spike = g * amp * (0.35 + r() * 0.75) + r() * 0.02;
      raw.push([t * W, BASE - spike * (BASE - TOP)]);
      if (i % 4 === 0) env.push([t * W, BASE - (g * amp * 0.86 + (r() - 0.5) * 0.03 * g) * (BASE - TOP)]);
    }
    return { raw, env };
  }
  const line = (pts) => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
  const area = (pts) => line(pts) + `L${W} ${BASE}L0 ${BASE}Z`;
  const grid = () => `<g stroke="rgba(255,255,255,.07)" stroke-width="1">${[0.25, 0.5, 0.75].map((f) => `<path d="M0 ${(TOP + (BASE - TOP) * f).toFixed(1)}H${W}"/>`).join('')}<path d="M0 ${BASE}H${W}" stroke="rgba(255,255,255,.18)"/></g>`;

  function drawForce(svg) {
    const a = forcePts(1, 3), b = forcePts(0.93, 11);
    svg.innerHTML = grid() +
      `<path d="${area(a)}" fill="rgba(108,155,255,.10)"/>` +
      `<path class="tr-line" d="${line(a)}" fill="none" stroke="#6C9BFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>` +
      `<path class="tr-line" style="--dl:.25s" d="${line(b)}" fill="none" stroke="#FF6B4A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>`;
  }
  function drawEmg(svg) {
    const a = emgPts(1, 5), b = emgPts(0.63, 17);
    svg.innerHTML = grid() +
      `<path class="tr-fade" d="${area(a.raw)}" fill="rgba(108,155,255,.20)"/>` +
      `<path class="tr-fade" style="--dl:.2s" d="${area(b.raw)}" fill="rgba(255,107,74,.30)"/>` +
      `<path class="tr-line" d="${line(a.env)}" fill="none" stroke="#6C9BFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>` +
      `<path class="tr-line" style="--dl:.25s" d="${line(b.env)}" fill="none" stroke="#FF6B4A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>`;
  }
  window.NSU.traces = { drawForce, drawEmg };
  window.NSU.ready(() => {
    const f = $('#traceForce'), e = $('#traceEmg');
    if (f) drawForce(f);
    if (e) drawEmg(e);
  });
})();
