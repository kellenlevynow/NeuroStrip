/* 00-core.js */
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

/* 10-budget.js */
/* Budget: three budgets side by side, the selected one's detail, and a custom amount. */
(function () {
  'use strict';
  const { $, $$, esc, money } = window.NSU;
  const NS = window.NS || {};
  const B = NS.budget, P = NS.pipeline;
  const root = $('#cmp');
  if (!root || !B || !P) return;

  const WEEKS_PER_MONTH = 4.33, WEEKS_PER_QUARTER = 13;
  const f = P.funnel;
  const toCustomer = (f.opp / 100) * (f.pilot / 100) * (f.paid / 100);
  const limit = f.acv * toCustomer;
  const month3 = (id) => { const l = B.lines.find((x) => x.id === id); return l ? l.m[2] : 0; };

  /* Qualified calls a week from one source at the Day 90 run rate. Paid sources use month-three spend. */
  function calls(s, T) {
    if (s.kind === 'rate') return s.a * s.b / 100;
    if (s.kind === 'cost') return T * month3(s.line) / 100 / s.b / WEEKS_PER_MONTH;
    if (s.kind === 'monthly') return s.a * (s.b / 100) / WEEKS_PER_MONTH;
    if (s.kind === 'quarterly') return s.a * (s.b / 100) / WEEKS_PER_QUARTER;
    return s.a;
  }
  function outcome(T) {
    const bySource = P.sources.map((s) => [s, calls(s, T)]);
    const perWeek = bySource.reduce((a, [, v]) => a + v, 0);
    const pilotsPerWeek = perWeek * (f.opp / 100) * (f.pilot / 100);
    const customers = Math.round(pilotsPerWeek * (f.paid / 100) * WEEKS_PER_QUARTER);
    const monthThree = T * B.lines.reduce((a, l) => a + l.m[2], 0) / 100;
    /* calls this budget pays for: everything except calls that already come in and the conference, which has its own budget */
    const paidPerWeek = bySource.filter(([s]) => s.paid !== false).reduce((a, [, v]) => a + v, 0);
    const perPaidCall = monthThree / (paidPerWeek * WEEKS_PER_MONTH);
    return {
      T, bySource, perWeek, paidPerWeek, perPaidCall, monthThree,
      perCustomer: perPaidCall / toCustomer,
      pilotsMonth: Math.round(pilotsPerWeek * WEEKS_PER_MONTH),
      customers, revenue: customers * f.acv,
      perCall: monthThree / (perWeek * WEEKS_PER_MONTH),
      fill: Math.round(perWeek / P.capacity * 100),
      adsLeft: Math.max(0, T * 0.25 - B.propensityMonthly * 3),
    };
  }
  NS.planMath = { outcome, limit, toCustomer };
  /* cost of each extra call over the next smaller budget, month three */
  const marginal = (a, b) => (b.monthThree - a.monthThree) / ((b.perWeek - a.perWeek) * WEEKS_PER_MONTH);

  const S = B.scenarios;
  const O = Object.fromEntries(S.map((s) => [s.id, outcome(s.v)]));
  let sel = 'base';

  const cell = (col, html, cls) => `<div class="cmp-cell${cls ? ' ' + cls : ''}" data-col="${col}">${html}</div>`;
  const lab = (html) => `<div class="cmp-cell cmp-lab">${html}</div>`;
  const row = (label, fn) => lab(label) + S.map((s) => cell(s.id, fn(O[s.id], s))).join('');

  function renderGrid() {
    let h = `<div class="cmp-phone"><div class="seg" role="group" aria-label="Choose a budget">${S.map((s) => `<button type="button" data-pick="${s.id}" aria-pressed="${s.id === sel}">${esc(s.name)}</button>`).join('')}</div></div>`;
    h += '<div class="cmp-grid">';
    h += '<div class="cmp-cell cmp-lab cmp-hide-h"></div>' + S.map((s) => `<div class="cmp-col-h" data-col="${s.id}"><p class="cmp-name">${esc(s.name)}</p><span class="cmp-price num">${money(s.v)}</span><button type="button" data-pick="${s.id}" aria-pressed="${s.id === sel}">${s.id === sel ? 'Selected' : 'Choose ' + esc(s.name)}</button></div>`).join('');
    h += `<div class="cmp-sec">Pace at Day 90, and what it gives over the next quarter</div>`;
    h += row(`<span>Qualified calls a week <span class="cmp-means">Only search and the account-based ads grow with the budget. About 11 a week come from sources that stay the same.</span></span>`, (o) => `<span><span class="cmp-big num">${Math.round(o.perWeek)}</span><span class="cmp-means">${o.fill}% of the 20-call goal</span></span>`);
    h += row(`<span>Pilots started a month <span class="cmp-means">Each pilot needs a kit on loan. Kit numbers: confirm in week one.</span></span>`, (o) => `<span class="num">${o.pilotsMonth}</span>`);
    h += row(`<span>New customers a quarter <span class="cmp-means">Groups signing their first clinic. Half of pilots sign.</span></span>`, (o) => `<span class="num">${o.customers}</span>`);
    h += row(`<span>What new customers pay in their first year, a quarter <span class="cmp-means">At the planned $7,500 a clinic, before any group adds clinics.</span></span>`, (o) => `<span class="num">${money(o.revenue)}</span>`);
    h += row(`<span>Cost per qualified call the budget pays for, month three <span class="cmp-means">Leaves out about 4 calls a week that come in today and about 2 from the February conference, which has its own budget. The limit is about $930.</span></span>`, (o) => `<span class="num ${o.perPaidCall <= limit ? 'ok' : 'over'}">${money(Math.round(o.perPaidCall / 10) * 10)}</span>`);
    h += row(`<span>Cost per qualified call, every call counted <span class="cmp-means">Includes the calls that cost this budget nothing, so it flatters every budget.</span></span>`, (o) => `<span class="num">${money(Math.round(o.perCall / 10) * 10)}</span>`);
    h += row(`<span>Each extra call over the next smaller budget <span class="cmp-means">About twice the limit. More money buys calls slowly, so it goes only to channels that beat $930.</span></span>`, (o, s) => { const i = S.indexOf(s); return i ? `<span class="num over">${money(Math.round(marginal(O[S[i - 1].id], o) / 10) * 10)}</span>` : '<span class="muted">None smaller</span>'; });
    h += row(`<span>Ad money left after Propensity\'s $9,000 fee <span class="cmp-means">At Lean, too little for a clear Day 60 result.</span></span>`, (o) => `<span class="num">${money(o.adsLeft)}</span>`);
    h += `<div class="cmp-sec">Where the money goes</div>`;
    B.groups.forEach(([g, gl]) => {
      const ls = B.lines.filter((l) => l.group === g);
      const pct = ls.reduce((a, l) => a + l.pct, 0);
      h += row(`<span>${esc(gl)} <span class="cmp-means">${pct}% of the total</span></span>`, (o) => `<b class="num">${money(o.T * pct / 100)}</b>`);
      if (ls.length > 1) ls.forEach((l) => { h += row(`<span style="font-weight:400">${esc(l.name)}</span>`, (o) => `<span class="num">${money(o.T * l.pct / 100)}</span>`); });
    });
    h += '</div>';
    root.innerHTML = h;
    markSel();
  }
  function markSel() {
    $$('[data-col]', root).forEach((c) => c.classList.toggle('cmp-on', c.dataset.col === sel));
    $$('[data-pick]', root).forEach((b) => {
      const on = b.dataset.pick === sel;
      b.setAttribute('aria-pressed', String(on));
      if (b.closest('.cmp-col-h')) b.textContent = on ? 'Selected' : 'Choose ' + S.find((s) => s.id === b.dataset.pick).name;
    });
  }

  const det = $('#cmpDetail'), srcT = $('#srcTable');
  function renderDetail() {
    const s = S.find((x) => x.id === sel), o = O[sel];
    const tot = [0, 1, 2].map((i) => B.lines.reduce((a, l) => a + l.m[i], 0));
    const max = Math.max(...tot);
    const months = [0, 1, 2].map((i) => {
      const g = (grp) => B.lines.filter((l) => l.group === grp).reduce((a, l) => a + l.m[i], 0);
      const media = g('channel'), resv = g('reserve');
      return `<li><span><b>Month ${i + 1}</b> · ${Math.round(media / tot[i] * 100)}% ads and email${resv ? `, ${Math.round(resv / tot[i] * 100)}% reserve` : ''}</span><b class="num">${money(o.T * tot[i] / 100)}</b><span class="mbar" style="width:${(tot[i] / max * 100).toFixed(1)}%"><i style="flex:${g('channel')};background:var(--green)"></i><i style="flex:${g('build')};background:#6e6e73"></i><i style="flex:${g('reserve') || 0.0001};background:#d2d2d7"></i></span></li>`;
    }).join('');
    const maxS = Math.max(...o.bySource.map(([, v]) => v));
    const srcs = o.bySource.map(([x, v]) => `<li><span>${esc(x.name)}</span><b class="num">${v.toFixed(1)}</b><i style="width:${(v / maxS * 100).toFixed(1)}%"></i></li>`).join('');
    det.innerHTML =
      `<div class="cmp-panel"><h3>Spend by month</h3><p class="means">${esc(s.name)} budget. Green is ads and email, dark gray is content and setup, light gray is the reserve.</p><ul class="bars">${months}</ul><p class="means" style="margin-top:12px">Month one mostly builds. Ads about double in month two. In month three the reserve goes to whatever is working.</p></div>` +
      `<div class="cmp-panel"><h3>Where the calls come from</h3><p class="means">Qualified calls a week at Day 90, ${esc(s.name)} budget.</p><ul class="bars">${srcs}</ul><p class="means" style="margin-top:12px">About 4 a week already come in without this plan. Account-based ads book the fewest calls directly, at a planned $2,000 a call, so they stay funded only as a test of whether they lift replies in the half that sees them.</p></div>` +
      `<div class="cmp-read"><p class="tile-k">What ${esc(s.name)} means for Control Bionics</p><p class="lead" style="margin-top:6px">${esc(s.read)}</p></div>`;
    if (srcT) srcT.innerHTML = '<thead><tr><th>Source</th><th>Calls a week</th><th>How it is worked out</th></tr></thead><tbody>' +
      o.bySource.map(([x, v]) => `<tr><td>${esc(x.name)}</td><td data-l="Calls a week" class="num">${v.toFixed(1)}</td><td data-l="How it is worked out">${esc(x.why)}</td></tr>`).join('') +
      `<tr><td>Total</td><td data-l="Calls a week" class="num">${o.perWeek.toFixed(1)}</td><td data-l="How it is worked out">${esc(s.name)} budget of ${money(o.T)}</td></tr></tbody>`;
  }

  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-pick]');
    if (!b) return;
    sel = b.dataset.pick;
    markSel();
    renderDetail();
  });

  /* custom amount */
  const range = $('#cmpRange'), out = $('#cmpRangeOut'), cust = $('#cmpCustom');
  if (range) {
    range.min = B.min; range.max = B.max; range.step = B.step; range.value = B.def;
    const upd = () => {
      const o = outcome(+range.value);
      out.textContent = money(o.T);
      cust.innerHTML = `<p class="small">About <b class="num">${o.perWeek.toFixed(1)}</b> qualified calls a week by Day 90, <b class="num">${o.pilotsMonth}</b> pilots a month, <b class="num">${o.customers}</b> new customers a quarter worth <b class="num">${money(o.revenue)}</b>, at <b class="num">${money(o.perCall)}</b> per qualified call in month three against the ${money(Math.round(limit / 10) * 10)} limit.</p>`;
    };
    range.addEventListener('input', upd);
    upd();
  }

  renderGrid();
  renderDetail();
})();

/* 20-buyers.js */
/* The buying group: who exists at each size, one tab per role, the objection table and the persona tests. */
(function () {
  'use strict';
  const { $, $$, esc } = window.NSU;
  const NS = window.NS || {};
  const R = NS.roles || [], T = NS.personaTests, SITE = NS.site || {};
  const O = SITE.objections || [], Z = SITE.bySize || [], AB = SITE.ab || {};
  const list = (a) => `<ul class="dots">${(a || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  const CL = { executive: 'Executive', operations: 'Operations', clinical: 'Clinical' };
  const TAB = { owner: 'Owner', ceo: 'CEO', coo: 'COO', cco: 'Chief clinical officer', rehab: 'Rehab director', admin: 'Practice administrator', director: 'Clinic director' };
  const PLAYBOOK = 'https://github.com/kellenlevynow/NeuroStrip/blob/main/docs/PERSONAS.md';

  /* who exists at each size */
  const bs = $('#bySize');
  if (bs && Z.length) {
    bs.innerHTML = Z.map((z) => `<div class="tile"><p class="tile-k">${esc(z.size)}</p><p class="tile-l">Contact first: ${esc(z.first)}</p><p>${esc(z.who)}</p></div>`).join('');
  }

  /* one tab per role, in a snap-scrolling strip */
  const host = $('#roles');
  if (host && R.length) {
    host.innerHTML =
      `<div class="roles-strip" role="tablist" aria-label="Roles">${R.map((r, i) => `<button type="button" class="role-tab" role="tab" id="rt-${r.id}" aria-controls="rp" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><b>${esc(TAB[r.id] || r.title)}</b><span>${esc(r.buying_role)}</span></button>`).join('')}</div>` +
      `<div class="roles-ctl"><button class="hl-arrow" type="button" data-step="-1" aria-label="Previous role"><svg viewBox="0 0 10 16" aria-hidden="true"><path d="M8 1L2 8l6 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="hl-dots" aria-hidden="true">${R.map(() => '<button type="button" tabindex="-1"></button>').join('')}</div><button class="hl-arrow" type="button" data-step="1" aria-label="Next role"><svg viewBox="0 0 10 16" aria-hidden="true"><path d="M2 1l6 7-6 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>` +
      `<div class="role-panel" id="rp" role="tabpanel" tabindex="0"></div>`;
    const tabs = $$('.role-tab', host), panel = $('#rp', host), strip = $('.roles-strip', host), dots = $$('.hl-dots button', host);
    let cur = 0;
    function show(i, focus) {
      cur = (i + R.length) % R.length;
      const r = R[cur], ab = AB[r.id] || [r.message_a, r.message_b];
      tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(j === cur)); t.tabIndex = j === cur ? 0 : -1; });
      dots.forEach((d, j) => d.setAttribute('aria-current', String(j === cur)));
      panel.setAttribute('aria-labelledby', 'rt-' + r.id);
      const t = tabs[cur];
      strip.scrollTo({ left: t.offsetLeft - strip.offsetLeft - 2, behavior: window.NSU.reduce ? 'auto' : 'smooth' });
      if (focus) t.focus({ preventScroll: true });
      panel.innerHTML = `
        <div class="role-head"><h4>${esc(r.title)}</h4><span class="tag">${esc(r.buying_role)}</span><span class="muted small">${CL[r.cluster]} cluster</span></div>
        <p class="lead">${esc(r.one_line)}</p>
        <div class="role-ab"><div><span>Message A</span><p>${esc(ab[0])}</p></div><div><span>Message B</span><p>${esc(ab[1])}</p></div></div>
        <details class="more"><summary>Learn more about selling to this role</summary><div class="more-c">
          <div class="role-grid" style="margin-top:0">
            <div><h5>Role in the decision</h5><p>${esc(r.role_in_decision)}</p></div>
            <div><h5>Other titles</h5><p>${esc((r.also_called || []).join(', '))}</p><p class="means">${esc(r.exists_when)}</p></div>
            <div><h5>Measured on</h5>${list(r.measured_on)}</div>
            <div><h5>What worries them</h5>${list(r.worries)}</div>
            <div><h5>Signs they are ready to talk</h5>${list(r.ready_signals)}<p class="means">Research topics to check with Bombora: ${esc((r.bombora_topics || []).join(', '))}</p></div>
            <div><h5>The two messages in full</h5><p><b>A.</b> ${esc(r.message_a)}</p><p><b>B.</b> ${esc(r.message_b)}</p></div>
            <div><h5>Offer</h5><p>${esc(r.offer)}</p></div>
            <div><h5>Landing page</h5><p>${esc(r.landing_page)}</p></div>
          </div>
          <h4>Six-week sequence</h4>
          <p class="small muted">Sequence week 1 is the week this contact gets the first email, from plan week 5 on.</p>
          <table class="tbl tbl--stack seq"><thead><tr><th>Sequence week</th><th>Channel</th><th>Touch</th></tr></thead><tbody>${(r.sequence || []).map((s) => `<tr><td>Sequence week ${esc(s.week)}</td><td data-l="Channel">${esc(s.channel)}</td><td data-l="Touch">${esc(s.touch)}</td></tr>`).join('')}</tbody></table>
          <h4>Top four objections</h4>
          <table class="tbl tbl--stack"><thead><tr><th>Objection</th><th>Answer</th></tr></thead><tbody>${(r.objections || []).map((o) => `<tr><td>${esc(o.objection)}</td><td data-l="Answer">${esc(o.answer)}</td></tr>`).join('')}</tbody></table>
          <div class="role-grid">
            <div><h5>Proof they need</h5>${list(r.proof)}</div>
            <div><h5>Three questions for the discovery call</h5>${list(r.discovery_questions)}</div>
            <div><h5>What a yes looks like</h5><p>${esc(r.yes_looks_like)}</p></div>
            <div><h5>When to stop</h5><p>${esc(r.stop_when)}</p></div>
          </div>
        </div></details>`;
      if (window.NSU.initTerms) window.NSU.initTerms(panel);
    }
    tabs.forEach((t, i) => t.addEventListener('click', () => show(i)));
    strip.addEventListener('keydown', (e) => {
      const k = e.key;
      if (k === 'ArrowRight' || k === 'ArrowLeft') { e.preventDefault(); show(cur + (k === 'ArrowRight' ? 1 : -1), true); }
      if (k === 'Home') { e.preventDefault(); show(0, true); }
      if (k === 'End') { e.preventDefault(); show(R.length - 1, true); }
    });
    $$('[data-step]', host).forEach((b) => b.addEventListener('click', () => show(cur + +b.dataset.step)));
    show(0);
  }

  /* cross-role objection table: three up front, seven behind Learn more, the rest in the playbook */
  const SITE_MAX = 10, FIRST = 3;
  const head = '<thead><tr><th>The objection</th><th>Who raises it</th><th>The answer</th><th>Proof to send</th><th>Follow-up question</th></tr></thead><tbody>';
  const rows = (a) => head + a.map((o) => `<tr><td>"${esc(o.q)}"</td><td data-l="Who raises it">${esc(o.who)}</td><td data-l="The answer">${esc(o.a)}${o.w1 ? `<span class="wk1">Confirm in week one: ${esc(o.w1)}</span>` : ''}</td><td data-l="Proof to send">${esc(o.proof)}</td><td data-l="Follow-up question">${esc(o.next)}</td></tr>`).join('') + '</tbody>';
  const ot = $('#objTable'), ot2 = $('#objTable2');
  if (ot && O.length) {
    ot.innerHTML = rows(O.slice(0, FIRST));
    if (ot2) ot2.innerHTML = rows(O.slice(FIRST, SITE_MAX));
    const all = (NS.objections || []).length;
    if (all > SITE_MAX) (ot2 || ot).insertAdjacentHTML('afterend', `<p class="center small muted" style="margin-top:14px">${all - SITE_MAX} more objections, with answers, are in the <a href="${PLAYBOOK}#objections">buyer playbook</a>.</p>`);
  }

  /* persona test groups: one A/B pair each */
  const pc = $('#ptClusters');
  if (pc && T) {
    const byId = Object.fromEntries(R.map((r) => [r.id, r]));
    pc.innerHTML = T.clusters.map((c) => {
      const rs = c.roles.map((id) => byId[id]).filter(Boolean);
      return `<div class="tile pt-tile"><p class="tile-k">${esc(c.name)} cluster</p>${rs.map((r) => { const ab = AB[r.id] || []; return `<p class="tile-l">${esc(TAB[r.id] || r.title)}</p><p class="small">A: ${esc(ab[0] || '')}<br>B: ${esc(ab[1] || '')}</p>`; }).join('')}</div>`;
    }).join('');
  }
})();

/* 30-campaign.js */
/* The campaign: ad mockups at true size, labeled in plain words, filtered by cluster and channel.
   Search ads are checked here: headlines 30 characters or fewer, descriptions 90 or fewer. */
(function () {
  'use strict';
  const { $, $$, esc } = window.NSU;
  const C = (window.NS || {}).campaign;
  const track = $('#adsTrack');
  if (!C || !track) return;

  const LIMITS = { headline: 30, description: 90 };
  const CL = { executive: 'Executive', operations: 'Operations', clinical: 'Clinical' };
  const ROLES = { executive: 'Owners and chief executives', operations: 'Chief operating officers and practice administrators', clinical: 'Chief clinical officers, rehab directors and clinic directors' };
  const clusterOf = (id) => (C.clusters || []).find((c) => c.cluster === id) || {};
  const AB = {
    executive: 'A against B in each role\'s wording. Owner: patients who can see their progress at each visit have a reason to keep coming back, against a return-to-sport service you can start at one clinic, measure, then add to the rest',
    operations: 'A against B in each role\'s wording. COO: each sensor goes on like a bandage and the pilot times setup at one clinic, against one page with the annual price and a rollout plan for each new clinic',
    clinical: 'A against B in each role\'s wording. Chief clinical officer: strength tests can miss muscles covering for an injured one, against a documented return-to-sport protocol for the whole group',
  };

  /* ---------- small illustrations that stand in for Control Bionics photography ---------- */
  const art = {
    leg: (h) => `<svg viewBox="0 0 400 ${h || 300}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="${h || 300}" fill="#111"/><path d="M-10 ${(h || 300) * .78}C80 ${(h || 300) * .62} 150 ${(h || 300) * .3} 220 ${(h || 300) * .28}s140 30 200 10v${h || 300}H-10z" fill="#2a2a2e"/><g transform="rotate(-9 200 ${(h || 300) * .48})"><rect x="150" y="${(h || 300) * .48 - 22}" width="100" height="44" rx="17" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.3)"/><rect x="164" y="${(h || 300) * .48 - 12}" width="72" height="24" rx="9" fill="#f5f5f7"/><circle cx="180" cy="${(h || 300) * .48}" r="3.6" fill="#111"/><circle cx="200" cy="${(h || 300) * .48}" r="3.6" fill="#111"/><circle cx="220" cy="${(h || 300) * .48}" r="3.6" fill="#111"/><circle cx="231" cy="${(h || 300) * .48 - 7}" r="1.8" fill="#2EE6A6"/></g><g fill="none" stroke="#2EE6A6" stroke-linecap="round" stroke-width="1.8" opacity=".5"><path d="M134 ${(h || 300) * .38}a46 46 0 0 0 0 ${(h || 300) * .2}"/><path d="M266 ${(h || 300) * .38}a46 46 0 0 1 0 ${(h || 300) * .2}"/></g></svg>`,
    kit: () => `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="300" fill="#f5f5f7"/><rect x="70" y="60" width="260" height="180" rx="22" fill="#fff" stroke="#d2d2d7"/>${[0, 1, 2, 3].map((i) => `<g transform="translate(${104 + (i % 2) * 104} ${92 + Math.floor(i / 2) * 72})"><rect width="88" height="40" rx="15" fill="#f5f5f7" stroke="#c7c7cc"/><circle cx="24" cy="20" r="4" fill="#1d1d1f"/><circle cx="44" cy="20" r="4" fill="#1d1d1f"/><circle cx="64" cy="20" r="4" fill="#1d1d1f"/></g>`).join('')}</svg>`,
    trace: (theme) => `<div class="mini-trace${theme === 'light' ? ' is-light' : ''}"><svg data-trace="force" data-theme="${theme || 'dark'}" aria-hidden="true"></svg><svg data-trace="emg" data-theme="${theme || 'dark'}" aria-hidden="true"></svg></div>`,
  };

  /* ---------- labels shown under every piece ---------- */
  const labels = (L) => `<dl class="ad-labels">${[
    ['Where it runs', L.where], ['Size or limits', L.size], ['Who sees it', L.who], ['Message tested', L.message], ['Call to action', L.cta], ['Landing page', L.landing], ['Number we read', L.metric],
  ].map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;

  const item = (o) => `<article class="hl-item ad-item${o.wide ? ' hl-item--wide' : ''}" data-cl="${o.cl.join(' ')}" data-ch="${o.ch}"><header class="ad-h"><p class="ad-ch">${esc(o.chName)}</p><h3>${esc(o.title)}</h3></header><div class="ad-stage">${o.mock}</div>${labels(o.labels)}</article>`;

  const scale = (inner, w, h) => `<div class="ad-scale" data-w="${w}" data-h="${h}" style="--w:${w}px;--h:${h}px"><div class="ad-scale-in">${inner}</div></div>`;

  const items = [];

  /* 1. 15-second video storyboard, clinical cluster */
  if (C.storyboard) {
    const sb = C.storyboard;
    const frameArt = (i) => (i === 1 || i === 2 || i === 3 ? art.trace() : art.leg(220));
    items.push({
      wide: true, cl: ['clinical'], ch: 'video', chName: 'Video', title: '15-second video, six frames',
      mock: `<ol class="sb">${sb.frames.map((f, i) => `<li><div class="sb-art">${frameArt(i)}<p class="sb-os">${esc(f.on_screen.split(/\s*Small print:\s*/)[0])}${/Small print:/.test(f.on_screen) ? `<small>${esc(f.on_screen.split(/\s*Small print:\s*/)[1])}</small>` : ''}</p></div><p class="sb-t">${esc(f.time)}</p><p class="sb-v"><b>Picture:</b> ${esc(f.visual)}</p><p class="sb-v"><b>Voice:</b> ${esc(f.voiceover)}</p></li>`).join('')}</ol>`,
      labels: { where: 'LinkedIn and Meta video placements bought through Propensity, shown only to the half of the list that gets ads', size: '15 seconds, square and vertical, captions always on', who: ROLES.clinical, message: AB.clinical, cta: sb.cta, landing: 'Clinical primer page with the 90-second video', metric: 'Interested replies and meetings per 100 clinical contacts, the half that sees ads against the holdout half' },
    });
  }

  /* 2. animated display set at four sizes */
  if (C.display) {
    const D = C.display;
    const unit = (w, h, kind) => {
      const fr = D.frames.map((f, i) => {
        const txt = kind === 'banner' ? f.short : f.long;
        const vis = i === 0 ? `<div class="dsp-v">${art.leg(Math.round(h * 0.6))}</div>` : i === 1 ? `<div class="dsp-v">${art.trace()}</div>` : '';
        return `<div class="dsp-f dsp-f${i + 1}">${kind === 'banner' ? '' : vis}<p class="dsp-t">${esc(txt)}</p>${i === 2 ? `<span class="dsp-b">${esc(D.cta)}</span>` : ''}<span class="dsp-brand">NeuroStrip</span></div>`;
      }).join('');
      return `<figure class="dsp"><div class="dsp-u dsp-${kind}" style="width:${w}px;height:${h}px" role="img" aria-label="${w} by ${h} display ad, three frames: ${esc(D.frames.map((f) => (kind === 'banner' ? f.short : f.long)).join('; '))}">${fr}</div><figcaption>${w} × ${h}</figcaption></figure>`;
    };
    items.push({
      wide: true, cl: ['executive', 'operations', 'clinical'], ch: 'display', chName: 'Website banners', title: 'Animated banner set, three frames',
      mock: `<div class="dsp-set">${scale(`<div class="dsp-grid">${unit(300, 250, 'rect')}${unit(160, 600, 'sky')}<div class="dsp-col">${unit(728, 90, 'leader')}${unit(320, 50, 'banner')}</div></div>`, 1240, 640)}</div>`,
      labels: { where: 'Banner spaces on Propensity\'s network of websites, shown only to the half of the list that gets ads', size: '300 × 250, 728 × 90, 160 × 600 and 320 × 50. Three frames over 15 seconds', who: 'All seven roles at groups in the half that gets ads', message: 'No A and B split. The read is what the banners add, the half that sees ads against the holdout half', cta: D.cta, landing: 'Pilot page with the scheduler', metric: 'Booked pilot calls per 100 groups, the half that sees ads against the holdout half' },
    });
  }

  /* 3. five-card carousel, executive cluster */
  if (C.carousel) {
    const K = C.carousel;
    items.push({
      wide: true, cl: ['executive'], ch: 'social', chName: 'LinkedIn and Meta', title: 'Five-card carousel',
      mock: scale(`<div class="sp"><div class="sp-h"><span class="sp-av">CB</span><div><b>Control Bionics</b><i>Sponsored</i></div></div><p class="sp-x">${esc(K.intro)}</p><div class="sp-cards">${K.cards.map((c, i) => `<div class="sp-card"><div class="sp-img">${i === 1 ? art.trace() : i === 3 ? art.kit() : art.leg(300)}</div><div class="sp-f"><b>${esc(c.headline)}</b><span>${esc(c.sub)}</span></div></div>`).join('')}</div><div class="sp-cta"><span>controlbionics.com</span><span class="sp-btn">${esc(K.cta)}</span></div></div>`, 1060, 560),
      labels: { where: 'LinkedIn and Meta carousel placements bought through Propensity, shown only to the half of the list that gets ads', size: 'Five square cards. LinkedIn shows only a headline on each card, up to 45 characters, so each subline moves into the card image. Meta cuts long headlines, so each card is checked in its preview before launch', who: ROLES.executive, message: AB.executive, cta: K.cta, landing: 'Economics worksheet built from their own visit numbers', metric: 'Worksheets started and meetings booked per 100 executives in the half that sees ads' },
    });
  }

  /* 4. native ad on a physical therapy industry site */
  if (C.native) {
    const N = C.native;
    items.push({
      cl: ['clinical', 'executive'], ch: 'native', chName: 'Sponsored articles', title: 'Sponsored article ad on an industry site',
      mock: scale(`<div class="nat"><div class="nat-site"><span></span><span></span><span></span></div><p class="nat-ctx">${esc(N.context)}</p><div class="nat-ad"><div class="nat-img">${art.leg(200)}</div><div><p class="nat-sp">Sponsored · Control Bionics</p><p class="nat-hd">${esc(N.headline)}</p><p class="nat-bd">${esc(N.body)}</p></div></div><div class="nat-lines"><i></i><i></i><i></i></div></div>`, 340, 470),
      labels: { where: 'Native and contextual ads bought through Propensity, shown next to articles on return-to-sport and rehab topics. Which physical therapy sites carry them: confirm with Propensity in week one', size: 'Headline up to 55 characters, body up to 120', who: 'Readers of articles on return to sport and outcomes', message: 'Strength tests can miss muscles covering for an injured one', cta: 'Read the clinical primer', landing: 'Clinical primer page', metric: 'Primer reads from target groups, and replies that follow' },
    });
  }

  /* 5. dimensional direct mail box for owners at groups researching now */
  if (C.mail) {
    const M = C.mail;
    items.push({
      wide: true, cl: ['executive'], ch: 'mail', chName: 'Mailed box', title: 'Box for owners at groups researching now',
      mock: `<div class="dm"><figure class="dm-v"><div class="dm-box"><p class="dm-k">NeuroStrip</p><p class="dm-front">${esc(M.box_front)}</p></div><figcaption>Front of the box</figcaption></figure><figure class="dm-v"><div class="dm-in"><p class="dm-lh">${esc(M.letter_headline)}</p>${M.letter_body.map((p) => `<p>${esc(p)}</p>`).join('')}<table class="dm-est">${M.estimate_rows.map((r) => `<tr><td>${esc(r.label)}</td><td>${esc(r.value)}</td></tr>`).join('')}</table><div class="dm-qr"><span class="qr" aria-hidden="true"></span><span>${esc(M.qr_cta)}</span></div></div><figcaption>Inside: the one-page estimate</figcaption></figure><figure class="dm-v"><div class="dm-card"><div class="dm-card-f"><div class="dm-strip"><i></i><i></i><i></i></div><p>${esc(M.card_front)}</p></div><div class="dm-card-b"><p>${esc(M.card_back)}</p></div></div><figcaption>Sample strip card, front and back</figcaption></figure></div>`,
      labels: { where: 'Direct mail through Propensity, sent only after a group starts researching', size: 'A small box with a letter-size estimate and a card holding a sample strip', who: 'Owners at groups that are researching now, capped at 100 boxes so they stay inside the $7,200 small-tests line once the price is quoted in week one', message: 'Patients who can see their progress at each visit have a reason to keep coming back', cta: M.qr_cta, landing: 'Pilot call booking page that shows the group\'s estimate', metric: 'Code scans and booked calls per 100 boxes. Each box is priced in week one' },
    });
  }

  /* 6. geofenced mobile ad at the Combined Sections Meeting */
  if (C.geofence) {
    const G = C.geofence;
    items.push({
      cl: ['clinical', 'executive', 'operations'], ch: 'mobile', chName: 'Conference phone ad', title: 'Phone ad at the Combined Sections Meeting',
      mock: scale(`<div class="geo"><div class="geo-img">${art.leg(260)}</div><div class="geo-c"><p class="geo-k">APTA CSM · Philadelphia · February 4 to 6</p><p class="geo-h">${esc(G.headline)}</p><p class="geo-b">${esc(G.body)}</p><span class="geo-btn">${esc(G.cta)}</span></div></div>`, 320, 480),
      labels: { where: 'Phones inside a geofence, an ad area drawn around the Philadelphia convention center, during the American Physical Therapy Association Combined Sections Meeting (APTA CSM), February 4 to 6, 2027, through Propensity', size: '320 × 480, with a 320 × 50 version', who: 'Anyone inside the geofence. Most are physical therapists attending the meeting', message: 'A 60-second activation test at the booth', cta: G.cta, landing: 'Booth booking page', metric: 'Booth tests and meetings booked during the show' },
    });
  }

  /* 7. responsive search ads, one per keyword cluster, with landing page */
  const rsaWarn = [];
  (C.rsa || []).forEach((r) => {
    const hs = r.headlines.map((h) => ({ t: h, n: h.length, over: h.length > LIMITS.headline }));
    const ds = r.descriptions.map((h) => ({ t: h, n: h.length, over: h.length > LIMITS.description }));
    hs.concat(ds).filter((x) => x.over).forEach((x) => rsaWarn.push(`${r.cluster}: "${x.t}" is ${x.n} characters`));
    const name = { category: 'Category search', competitor: 'Competitor search', problem: 'Problem search' }[r.cluster] || r.cluster;
    items.push({
      wide: true, cl: ['executive', 'operations', 'clinical'], ch: 'search', chName: 'Google Search', title: `${name} ad and landing page`,
      mock: `<div class="rsa"><div class="rsa-res"><p class="rsa-q">${esc(r.keywords[0])}</p><p class="rsa-sp">Sponsored</p><p class="rsa-url">${esc(r.path)}</p><p class="rsa-hd">${esc(hs.slice(0, 3).map((h) => h.t).join(' | '))}</p><p class="rsa-ds">${esc(ds[0] ? ds[0].t : '')} ${esc(ds[1] ? ds[1].t : '')}</p></div><div class="rsa-lp"><p class="rsa-lp-k">Landing page</p><p class="rsa-lp-h">${esc(r.landing.headline)}</p><p class="rsa-lp-s">${esc(r.landing.sub)}</p><div class="rsa-form"><span>Name</span><span>Work email</span><span>Practice</span><span>Number of clinics</span></div><span class="rsa-btn">${esc(r.landing.cta)}</span></div><details class="rsa-all"><summary>All ${hs.length} headlines and ${ds.length} descriptions, with character counts</summary><ul>${hs.map((h) => `<li class="${h.over ? 'over' : ''}"><span>${esc(h.t)}</span><b>${h.n}/${LIMITS.headline}</b></li>`).join('')}</ul><ul>${ds.map((h) => `<li class="${h.over ? 'over' : ''}"><span>${esc(h.t)}</span><b>${h.n}/${LIMITS.description}</b></li>`).join('')}</ul><p class="rsa-kw">Keywords: ${esc(r.keywords.join(', '))}</p></details></div>`,
      labels: { where: `Google Search, ${name.toLowerCase()} keywords`, size: 'Headlines up to 30 characters, descriptions up to 90', who: 'People searching these terms, most of them clinicians and owners', message: r.cluster === 'competitor' ? 'Four muscles at once, wireless, with a record you can document' : r.cluster === 'problem' ? 'Strength tests can miss compensation' : 'Wireless muscle sensing for the clinic', cta: r.landing.cta, landing: r.landing.headline, metric: '35% or more of search leads accepted by sales' },
    });
  });
  if (rsaWarn.length) console.warn('Search ads over the character limit:', rsaWarn);
  window.NSU.rsaCheck = { ok: rsaWarn.length === 0, issues: rsaWarn };

  /* 8. four-email sequence per cluster */
  (C.emails || []).forEach((e) => {
    const bv = (e.b_variant || []).length ? `<div class="em-alt"><p class="em-alt-k">Contacts assigned message B get these as emails 1 and 2 instead:</p>${e.b_variant.map((s, i) => `<p class="em-d">Email ${i + 1} · message B version</p><p class="em-s">${esc(s.subject)}</p><p class="em-b">${esc(s.body)}</p>`).join('')}</div>` : '';
    const emr = e.emr_variant && e.emr_variant.subject ? `<div class="em-alt"><p class="em-alt-k">If Bombora shows the group researching a move to a new electronic medical record (EMR) system, email 1 becomes, for either version:</p><p class="em-s">${esc(e.emr_variant.subject)}</p><p class="em-b">${esc(e.emr_variant.body)}</p></div>` : '';
    items.push({
      wide: true, cl: [e.cluster], ch: 'email', chName: 'Email', title: `${CL[e.cluster]} email sequence`,
      mock: `<div class="em">${e.steps.map((s, i) => `<div class="em-m"><p class="em-d">Email ${i + 1} · sequence week ${s.week}${i < 2 ? ' · message A version' : ' · same for everyone'}</p><p class="em-s">${esc(s.subject)}</p><p class="em-b">${esc(s.body)}</p></div>`).join('')}${bv}${emr}</div>`,
      labels: { where: 'Outbound email from the rep, both halves of the list', size: 'Four plain-text emails, each under 110 words, in sequence weeks 1, 3, 4 and 6. Each contact gets one assigned message in emails 1 and 2',  who: ROLES[e.cluster], message: AB[e.cluster], cta: 'Reply, or book a time on the calendar', landing: 'None. Replies go to the rep, and the calendar link books a call', metric: 'Interested replies from 1.5% or more of contacts, the rate the plan counts on, and meetings booked' },
    });
  });

  track.innerHTML = items.map(item).join('');

  /* ---------- line, clusters and the learn-more text ---------- */
  const line = $('#campaignLine');
  if (line) line.textContent = C.sub || C.line;
  const cc = $('#campaignClusters');
  if (cc) cc.innerHTML = (C.clusters || []).map((c) => `<div class="tile"><p class="tile-k">${CL[c.cluster]} cluster</p><p class="tile-l">${esc(c.headline)}</p></div>`).join('');
  const more = $('#campaignMore');
  if (more) more.innerHTML = `<h4>The idea</h4><p>${esc(C.idea)}</p><h4>What each cluster is tested on</h4><table class="tbl tbl--stack"><thead><tr><th>Cluster</th><th>Message A</th><th>Message B</th></tr></thead><tbody>${(C.clusters || []).map((c) => `<tr><td>${CL[c.cluster]}</td><td data-l="Message A">${esc(c.message_a)}</td><td data-l="Message B">${esc(c.message_b)}</td></tr>`).join('')}</tbody></table><h4>Rules every piece follows</h4><ul class="dots"><li>Every claim stays inside NeuroStrip's registration as a non-diagnostic measurement and biofeedback tool.</li><li>The 7% and 37% case appears only as one athlete's example.</li><li>No testimonials, quotes, customer names or logos until Control Bionics clears them.</li><li>Search ads never put a competitor's brand name in the ad text.</li><li>Every link carries tracking tags, so Salesforce records where each lead came from.</li></ul>`;

  /* ---------- filters ---------- */
  const clusters = [['all', 'All buyers'], ['executive', 'Executive'], ['operations', 'Operations'], ['clinical', 'Clinical']];
  const chans = [['all', 'All channels']].concat([...new Map(items.map((o) => [o.ch, o.chName])).entries()]);
  const fc = $('#cfCluster'), fh = $('#cfChannel'), count = $('#adsCount');
  let fC = 'all', fH = 'all';
  fc.innerHTML = clusters.map(([k, v]) => `<button type="button" data-k="${k}" aria-pressed="${k === fC}">${v}</button>`).join('');
  fh.innerHTML = chans.map(([k, v]) => `<button type="button" data-k="${k}" aria-pressed="${k === fH}">${v}</button>`).join('');
  let api = null;
  function apply() {
    let n = 0;
    $$('.ad-item', track).forEach((el) => {
      const show = (fC === 'all' || el.dataset.cl.split(' ').includes(fC)) && (fH === 'all' || el.dataset.ch === fH);
      el.hidden = !show;
      if (show) n++;
    });
    count.textContent = `Showing ${n} of ${items.length} pieces.`;
    if (api) api.rebuild();
    fit();
  }
  fc.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; fC = b.dataset.k; $$('button', fc).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); apply(); });
  fh.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; fH = b.dataset.k; $$('button', fh).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); apply(); });

  /* ---------- scale true-size mockups down to fit small screens ---------- */
  function fit() {
    $$('.ad-scale', track).forEach((s) => {
      const host = s.parentElement;
      const w = +s.dataset.w, h = +s.dataset.h;
      const avail = host.clientWidth || w;
      const k = Math.min(1, avail / w);
      s.style.setProperty('--k', k.toFixed(4));
      s.style.height = Math.ceil(h * k) + 'px';
    });
  }
  window.addEventListener('resize', fit);

  window.NSU.ready(() => {
    const root = $('#ads');
    api = window.NSU.carousel(root);
    apply();
  });
})();
