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

  /* sharper photos on high-density screens, skipped in the offline copy where images are embedded */
  U.hd = (root) => $$('img[data-hd]', root).forEach((img) => {
    const src = img.getAttribute('src');
    if (!src || src.startsWith('data:') || img.srcset) return;
    img.srcset = `${src} 1x, ${img.dataset.hd} 2x`;
  });

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

  /* ---------------- force and activation traces, styled after the NeuroStrip app (synthetic, drawn to the 7% and 37% example) ---------------- */
  const SIDE = { ok: '#F26B1D', hurt: '#1E9BF0' };
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const smooth = (a, b, t) => { const x = Math.min(1, Math.max(0, (t - a) / (b - a))); return x * x * (3 - 2 * x); };
  const REPS = 4;
  /* one contraction per rep: fast rise, a held effort, fast release */
  const rep = (t, sharp) => { const k = (t * REPS) % 1; const e = sharp ? 0.03 : 0.07; return smooth(0.14, 0.14 + e, k) * (1 - smooth(0.7 - e, 0.7, k)); };
  function forceSeries(amp, seed, n) { const r = rng(seed), v = []; for (let i = 0; i <= n; i++) { const t = i / n, k = (t * REPS) % 1; const g = rep(t, false); v.push(g * amp * (0.86 + 0.04 * Math.sin(k * Math.PI)) + g * (r() - 0.5) * 0.012 + (r() - 0.5) * 0.004); } return v; }
  function emgSeries(amp, seed, n) {
    const r = rng(seed), v = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, k = (t * REPS) % 1, g = rep(t, true);
      const shape = 0.72 + 0.28 * Math.sin(Math.min(1, Math.max(0, (k - 0.14) / 0.56)) * Math.PI);
      const burst = g * amp * shape * (0.5 + 0.5 * Math.pow(r(), 1.6));
      const spike = g && r() > 0.9 ? g * amp * 0.28 * r() : 0;
      v.push(Math.min(1, 0.04 + r() * 0.025 + burst + spike));
    }
    return v;
  }
  U.drawTraces = (root) => $$('svg[data-trace]', root).forEach((svg) => {
    const mini = !!svg.closest('.mini-trace');
    const emg = svg.dataset.trace !== 'force';
    const W = 560, H = mini ? 130 : 232;
    const L = mini ? 6 : 40, R = 8, T = mini ? 8 : 24, B = mini ? 8 : 40;
    const pw = W - L - R, ph = H - T - B;
    const n = emg ? (mini ? 200 : 300) : 160;
    const okV = emg ? emgSeries(0.8, 5, n) : forceSeries(1, 3, n);
    const hurtV = emg ? emgSeries(0.8 * 0.58, 17, n) : forceSeries(0.93, 11, n);
    const X = (i) => (L + (i / n) * pw).toFixed(1), Y = (v) => (T + (1 - v) * ph).toFixed(1);
    const path = (vals) => vals.map((v, i) => (i ? 'L' : 'M') + X(i) + ' ' + Y(v)).join('');
    const gridC = 'rgba(148,163,184,.14)', textC = '#8391a7';
    const yTicks = [0, 0.25, 0.5, 0.75, 1], yLab = emg ? ['0', '200', '400', '600', '800'] : ['0', '250', '500', '750', '1000'];
    let g = `<rect x="0" y="0" width="${W}" height="${H}" fill="none"/>`;
    g += `<g stroke="${gridC}" stroke-width="1">${yTicks.map((f) => `<path d="M${L} ${Y(f)}H${W - R}"/>`).join('')}${mini ? '' : [0, 2, 4, 6, 8, 10].map((s) => `<path d="M${(L + (s / 10) * pw).toFixed(1)} ${T}V${T + ph}"/>`).join('')}</g>`;
    if (!mini) {
      g += `<g fill="${textC}" font-size="10" font-family="var(--font)">${yTicks.map((f, i) => `<text x="${L - 6}" y="${(+Y(f) + 3.5).toFixed(1)}" text-anchor="end">${yLab[i]}</text>`).join('')}${[0, 2, 4, 6, 8, 10].map((s) => `<text x="${(L + (s / 10) * pw).toFixed(1)}" y="${T + ph + 14}" text-anchor="middle">${s}</text>`).join('')}<text x="${L - 6}" y="12" text-anchor="end" font-size="9">${emg ? 'μV' : 'N'}</text></g>`;
    }
    if (emg) {
      /* dashed lines at each side's average peak make the gap readable at a glance */
      const peak = (vals) => { const top = vals.filter((v) => v > 0.2).sort((a, b) => b - a); const k = top.slice(0, Math.max(1, Math.round(top.length * 0.4))); return k.reduce((a, b) => a + b, 0) / k.length; };
      [[okV, SIDE.ok], [hurtV, SIDE.hurt]].forEach(([vals, c]) => { g += `<path d="M${L} ${Y(peak(vals))}H${W - R}" stroke="${c}" stroke-width="${mini ? 1.4 : 1.6}" stroke-dasharray="7 5" opacity=".9"/>`; });
    }
    const sw = emg ? (mini ? 1.2 : 1.4) : (mini ? 2 : 2.4);
    g += `<path d="${path(okV)}" fill="none" stroke="${SIDE.ok}" stroke-width="${sw}" stroke-linejoin="round"/><path d="${path(hurtV)}" fill="none" stroke="${SIDE.hurt}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    if (!mini) {
      const ly = H - 8, cx = L + pw / 2;
      g += `<g font-size="11" font-family="var(--font)" fill="#c9d3e3"><circle cx="${cx - 118}" cy="${ly - 4}" r="4" fill="${SIDE.ok}"/><text x="${cx - 108}" y="${ly}">Uninjured side</text><circle cx="${cx + 10}" cy="${ly - 4}" r="4" fill="${SIDE.hurt}"/><text x="${cx + 20}" y="${ly}">Injured side</text></g>`;
    }
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', mini ? 'none' : 'xMidYMid meet');
    svg.innerHTML = g;
  });

  /* ---------------- boot: after every module has rendered ---------------- */
  function boot() {
    secs = $$('main > section[id]');
    U.drawTraces(d);
    U.initTerms(d);
    $$('[data-carousel]').forEach((c) => { if (!c.dataset.manual) c.carouselApi = U.carousel(c); });
    U.hd(d);
    U.reveal(d);
    mark();
    parallax();
  }
  if (d.readyState === 'complete') setTimeout(boot, 0); else d.addEventListener('DOMContentLoaded', boot);
})();
