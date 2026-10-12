/* Shared helpers, navigation, reveals, term definitions and the highlights carousel. */
(function () {
  'use strict';
  const d = document;
  const $ = (s, r) => (r || d).querySelector(s);
  const $$ = (s, r) => Array.from((r || d).querySelectorAll(s));
  d.documentElement.classList.add('js');
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const U = (window.NSU = {
    $, $$, reduce,
    money: (v) => '$' + Math.round(v).toLocaleString('en-US'),
    esc: (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])),
    ready: (fn) => (d.readyState === 'loading' ? d.addEventListener('DOMContentLoaded', fn) : fn()),
  });

  /* ---------------- local nav: menu on small screens, current section ---------------- */
  const lnav = $('#lnav'), toggle = $('#lnavToggle'), links = $$('#lnavLinks a');
  const setOpen = (open) => { lnav.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open)); };
  toggle.addEventListener('click', () => setOpen(!lnav.classList.contains('is-open')));
  links.forEach((a) => a.addEventListener('click', () => setOpen(false)));
  d.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setOpen(false); hidePop(); } });

  let secs = [];
  let current = '';
  function mark() {
    const probe = window.scrollY + window.innerHeight * 0.3;
    let id = '';
    for (const s of secs) { if (s.offsetTop <= probe) id = s.id; else break; }
    if (id === current) return;
    current = id;
    links.forEach((a) => {
      const on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-on', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }

  /* ---------------- hero parallax, only on hero images ---------------- */
  const par = $$('[data-parallax]');
  function parallax() {
    if (reduce) return;
    par.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      el.style.transform = `translate3d(0, ${(-r.top * 0.12).toFixed(1)}px, 0)`;
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { mark(); parallax(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', () => { mark(); });

  /* ---------------- n and p step through sections when presenting ---------------- */
  d.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || /^(INPUT|SELECT|TEXTAREA|BUTTON|SUMMARY)$/.test(e.target.tagName) || e.target.closest('[role="tablist"],.hl-track')) return;
    const k = e.key.toLowerCase();
    if (k !== 'n' && k !== 'p') return;
    const i = secs.findIndex((s) => s.id === current);
    const next = secs[Math.min(secs.length - 1, Math.max(0, i + (k === 'n' ? 1 : -1)))];
    if (next) next.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---------------- reveal: fade and rise ---------------- */
  const io = !reduce && 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    : null;
  U.reveal = (root) => $$('.rv:not(.is-in)', root).forEach((n) => (io ? io.observe(n) : n.classList.add('is-in')));

  /* ---------------- term definitions: hover, focus or tap ---------------- */
  const pop = $('#pop');
  let popFor = null;
  function showPop(el) {
    const g = (window.NS && window.NS.glossary) || {};
    const t = g[el.dataset.term];
    if (!t) return;
    pop.innerHTML = `<b>${U.esc(t.term)}</b>${U.esc(t.def)}`;
    pop.hidden = false;
    const r = el.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
    let left = r.left + window.scrollX + r.width / 2 - pw / 2;
    left = Math.max(window.scrollX + 12, Math.min(left, window.scrollX + d.documentElement.clientWidth - pw - 12));
    let top = r.bottom + window.scrollY + 10;
    if (r.bottom + ph + 20 > window.innerHeight && r.top - ph - 10 > 0) top = r.top + window.scrollY - ph - 10;
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    popFor = el;
    el.setAttribute('aria-expanded', 'true');
  }
  function hidePop() { if (!pop || pop.hidden) return; pop.hidden = true; if (popFor) popFor.setAttribute('aria-expanded', 'false'); popFor = null; }
  U.initTerms = (root) => $$('.term', root).forEach((el) => {
    if (el.dataset.bound) return;
    el.dataset.bound = '1';
    el.setAttribute('aria-expanded', 'false');
    el.setAttribute('aria-describedby', 'pop');
    el.addEventListener('mouseenter', () => showPop(el));
    el.addEventListener('mouseleave', () => { if (popFor === el && d.activeElement !== el) hidePop(); });
    el.addEventListener('focus', () => showPop(el));
    el.addEventListener('blur', () => { if (popFor === el) hidePop(); });
    el.addEventListener('click', (e) => { e.preventDefault(); if (popFor === el && !pop.hidden) hidePop(); else showPop(el); });
  });
  d.addEventListener('click', (e) => { if (!e.target.closest('.term') && !e.target.closest('#pop')) hidePop(); });
  window.addEventListener('resize', hidePop);

  /* ---------------- highlights carousel: swipe, arrows, dots, keys ---------------- */
  const chev = (dir) => `<svg viewBox="0 0 10 16" aria-hidden="true"><path d="${dir < 0 ? 'M8 1L2 8l6 7' : 'M2 1l6 7-6 7'}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  U.carousel = (root) => {
    const track = $('.hl-track', root);
    let ctl = $('.hl-ctl', root);
    if (!ctl) { ctl = d.createElement('div'); ctl.className = 'hl-ctl'; root.appendChild(ctl); }
    const label = root.getAttribute('aria-label') || 'Items';
    ctl.innerHTML = `<button class="hl-arrow" type="button" data-dir="-1" aria-label="Previous">${chev(-1)}</button><div class="hl-dots" role="group" aria-label="${U.esc(label)}: choose an item"></div><button class="hl-arrow" type="button" data-dir="1" aria-label="Next">${chev(1)}</button>`;
    const dotsEl = $('.hl-dots', ctl), prev = $('[data-dir="-1"]', ctl), next = $('[data-dir="1"]', ctl);
    const items = () => $$('.hl-item', track).filter((x) => !x.hidden);
    function build() {
      const its = items();
      dotsEl.innerHTML = its.map((_, i) => `<button type="button" aria-label="Item ${i + 1} of ${its.length}"></button>`).join('');
      $$('button', dotsEl).forEach((b, i) => b.addEventListener('click', () => go(i)));
      sync();
    }
    function idx() {
      const its = items(), x = track.scrollLeft;
      let best = 0, bd = Infinity;
      its.forEach((it, i) => { const dd = Math.abs(it.offsetLeft - track.offsetLeft - x - parseFloat(getComputedStyle(track).paddingLeft)); if (dd < bd) { bd = dd; best = i; } });
      return best;
    }
    function go(i) {
      const its = items(); if (!its.length) return;
      const t = its[Math.max(0, Math.min(its.length - 1, i))];
      track.scrollTo({ left: t.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft), behavior: reduce ? 'auto' : 'smooth' });
    }
    function sync() {
      const i = idx(), n = items().length;
      $$('button', dotsEl).forEach((b, j) => b.setAttribute('aria-current', String(i === j)));
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2 || n < 2;
    }
    prev.addEventListener('click', () => go(idx() - 1));
    next.addEventListener('click', () => go(idx() + 1));
    let t = null;
    track.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(sync, 60); }, { passive: true });
    track.setAttribute('tabindex', '0');
    track.setAttribute('role', 'region');
    track.setAttribute('aria-label', label);
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(idx() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx() - 1); }
    });
    window.addEventListener('resize', sync);
    build();
    return { rebuild: () => { track.scrollLeft = 0; build(); } };
  };

  /* ---------------- force and activation traces (synthetic, drawn to the 7% and 37% example) ---------------- */
  const W = 560, H = 130, BASE = 118, TOP = 14;
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const smooth = (a, b, t) => { const x = Math.min(1, Math.max(0, (t - a) / (b - a))); return x * x * (3 - 2 * x); };
  const gate = (t) => smooth(0.1, 0.26, t) * (1 - smooth(0.74, 0.9, t));
  const line = (pts) => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
  const area = (pts) => line(pts) + `L${W} ${BASE}L0 ${BASE}Z`;
  function forcePts(amp, seed) { const r = rng(seed), pts = []; for (let i = 0; i <= 140; i++) { const t = i / 140; const g = gate(t) * (1 - 0.06 * smooth(0.3, 0.74, t)) + 0.012 * Math.sin(t * 46 + seed) * gate(t) + (r() - 0.5) * 0.006; pts.push([t * W, BASE - g * amp * (BASE - TOP)]); } return pts; }
  function emgPts(amp, seed) { const r = rng(seed), raw = [], env = []; for (let i = 0; i <= 280; i++) { const t = i / 280; const g = gate(t) * (0.82 + 0.18 * Math.sin(t * 19 + seed * 0.7)); raw.push([t * W, BASE - (g * amp * (0.35 + r() * 0.75) + r() * 0.02) * (BASE - TOP)]); if (i % 4 === 0) env.push([t * W, BASE - (g * amp * 0.86 + (r() - 0.5) * 0.03 * g) * (BASE - TOP)]); } return { raw, env }; }
  U.drawTraces = (root) => $$('svg[data-trace]', root).forEach((svg) => {
    const dark = svg.dataset.theme !== 'light';
    const ok = dark ? '#a1a1a6' : '#86868b', hurt = dark ? '#2EE6A6' : '#0A8A64';
    const grid = `<g stroke="${dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)'}" stroke-width="1">${[0.25, 0.5, 0.75].map((f) => `<path d="M0 ${(TOP + (BASE - TOP) * f).toFixed(1)}H${W}"/>`).join('')}<path d="M0 ${BASE}H${W}" stroke="${dark ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'}"/></g>`;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    if (svg.dataset.trace === 'force') {
      const a = forcePts(1, 3), b = forcePts(0.93, 11);
      svg.innerHTML = grid + `<path d="${line(a)}" fill="none" stroke="${ok}" stroke-width="2.4" stroke-linecap="round"/><path d="${line(b)}" fill="none" stroke="${hurt}" stroke-width="2.4" stroke-linecap="round"/>`;
    } else {
      const a = emgPts(1, 5), b = emgPts(0.63, 17);
      svg.innerHTML = grid + `<path d="${area(a.raw)}" fill="${ok}" fill-opacity=".22"/><path d="${area(b.raw)}" fill="${hurt}" fill-opacity=".28"/><path d="${line(a.env)}" fill="none" stroke="${ok}" stroke-width="2.4" stroke-linecap="round"/><path d="${line(b.env)}" fill="none" stroke="${hurt}" stroke-width="2.4" stroke-linecap="round"/>`;
    }
  });

  /* ---------------- boot: after every module has rendered ---------------- */
  function boot() {
    secs = $$('main > section[id]');
    U.drawTraces(d);
    U.initTerms(d);
    $$('[data-carousel]').forEach((c) => { if (!c.dataset.manual) c.carouselApi = U.carousel(c); });
    U.reveal(d);
    mark();
    parallax();
  }
  if (d.readyState === 'complete') setTimeout(boot, 0); else d.addEventListener('DOMContentLoaded', boot);
})();
