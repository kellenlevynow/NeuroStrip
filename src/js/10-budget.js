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
    h += row(`<span>Each extra call over the next smaller budget <span class="cmp-means">About twice the limit. Additional spend buys calls slowly, so it goes only to channels that beat $930.</span></span>`, (o, s) => { const i = S.indexOf(s); return i ? `<span class="num over">${money(Math.round(marginal(O[S[i - 1].id], o) / 10) * 10)}</span>` : '<span class="muted">None smaller</span>'; });
    h += row(`<span>Media budget remaining after Propensity\'s $9,000 fee <span class="cmp-means">At Lean, too little for a clear Day 60 result.</span></span>`, (o) => `<span class="num">${money(o.adsLeft)}</span>`);
    h += `<div class="cmp-sec">Budget allocation</div>`;
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
