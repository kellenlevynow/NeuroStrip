/* Budget section: scenario buttons, slider, line items, monthly split and expected results. */
(function () {
  'use strict';
  const { $, $$, esc, money, fill } = window.NSU;
  const NS = window.NS || {};
  const B = NS.budget, P = NS.pipeline;
  const root = $('#bud');
  if (!root || !B || !P) return;

  const WEEKS_PER_MONTH = 4.33, WEEKS_PER_QUARTER = 13;
  const range = $('#budRange'), totalEl = $('#budTotal'), scen = $('#budScen'), outEl = $('#budOut'), costEl = $('#budCost'),
    linesEl = $('#budLines'), monthsEl = $('#budMonths'), srcEl = $('#budSrc');
  let total = B.def;

  const month3 = (id) => { const l = B.lines.find((x) => x.id === id); return l ? l.m[2] : 0; };

  /* Qualified calls a week from one source at the Day 90 run rate. Paid sources use month-three spend. */
  function calls(s, T) {
    if (s.kind === 'rate') return s.a * s.b / 100;
    if (s.kind === 'cost') return T * month3(s.line) / 100 / s.b / WEEKS_PER_MONTH;
    if (s.kind === 'monthly') return s.a * (s.b / 100) / WEEKS_PER_MONTH;
    if (s.kind === 'quarterly') return s.a * (s.b / 100) / WEEKS_PER_QUARTER;
    return s.a;
  }

  range.min = B.min; range.max = B.max; range.step = B.step; range.value = total;
  scen.innerHTML = B.scenarios.map((s) => `<button type="button" data-v="${s.v}">${esc(s.name)} <em class="num">$${s.v / 1000}K</em></button>`).join('');

  function render() {
    const T = total;
    totalEl.textContent = money(T);
    $$('button', scen).forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.v === T)));
    fill(range);

    /* expected results */
    const bySource = P.sources.map((s) => [s, calls(s, T)]);
    const perWeek = bySource.reduce((a, [, v]) => a + v, 0);
    const f = P.funnel;
    const pilotsPerWeek = perWeek * (f.opp / 100) * (f.pilot / 100);
    const customers = Math.round(pilotsPerWeek * (f.paid / 100) * WEEKS_PER_QUARTER);
    const tile = (v, label) => `<li><b class="num">${v}</b><span>${label}</span></li>`;
    outEl.innerHTML =
      tile(Math.round(perWeek), `qualified calls a week by Day 90, against a goal of ${P.target}`) +
      tile(Math.round(pilotsPerWeek * WEEKS_PER_MONTH), 'pilots started a month') +
      tile(customers, 'new customers a quarter, once those pilots finish') +
      tile(money(customers * f.acv), 'first-year revenue from them each quarter');
    const monthThree = T * B.lines.reduce((a, l) => a + l.m[2], 0) / 100;
    const perCall = monthThree / (perWeek * WEEKS_PER_MONTH);
    const limit = f.acv * (f.opp / 100) * (f.pilot / 100) * (f.paid / 100);
    costEl.innerHTML = `Month-three cost per qualified call: <b class="num">${money(perCall)}</b>, against a limit of about <b class="num">${money(Math.round(limit / 10) * 10)}</b>.`;

    /* line items */
    linesEl.innerHTML = '<thead><tr><th>Line</th><th>Share</th><th>Amount</th></tr></thead><tbody>' +
      B.groups.map(([g, label]) => {
        const ls = B.lines.filter((l) => l.group === g);
        const sum = ls.reduce((a, l) => a + l.pct, 0);
        const row = (l, cls) => `<tr${cls ? ` class="${cls}"` : ''}><td><span class="bud-name"><i class="sw ${l.color}"></i>${esc(l.name)}</span><small>${esc(l.note)}</small></td><td class="num">${l.pct}%</td><td class="num">${money(T * l.pct / 100)}</td></tr>`;
        /* a group with a single line needs no header row of its own */
        if (ls.length === 1) return row(ls[0], 'bud-solo');
        return `<tr class="bud-g"><td>${esc(label)}</td><td class="num">${sum}%</td><td class="num">${money(T * sum / 100)}</td></tr>` + ls.map((l) => row(l)).join('');
      }).join('') + '</tbody>';

    /* spend by month */
    const monthTotals = [0, 1, 2].map((i) => B.lines.reduce((a, l) => a + l.m[i], 0));
    const maxM = Math.max(...monthTotals);
    monthsEl.innerHTML = monthTotals.map((tot, i) => {
      const media = B.lines.filter((l) => l.group !== 'build').reduce((a, l) => a + l.m[i], 0);
      return `<div class="bm"><p><b>Month ${i + 1}</b><span class="num">${money(T * tot / 100)}</span><em class="num">${Math.round(media / tot * 100)}% media</em></p>
        <div class="bm-bar" style="width:${(tot / maxM * 100).toFixed(1)}%">${B.lines.filter((l) => l.m[i] > 0).map((l) => `<i class="bg-${l.color}" style="flex:${l.m[i]}" title="${esc(l.name)}: ${money(T * l.m[i] / 100)}"></i>`).join('')}</div></div>`;
    }).join('');

    /* where the calls come from */
    const maxS = Math.max(...bySource.map(([, v]) => v));
    srcEl.innerHTML = bySource.map(([s, v]) => `<li><span>${esc(s.name)}</span><b class="num">${v.toFixed(1)}</b><i style="width:${(v / maxS * 100).toFixed(1)}%"></i></li>`).join('');
  }

  range.addEventListener('input', () => { total = +range.value; render(); });
  scen.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    total = +b.dataset.v;
    range.value = total;
    render();
  });
  render();
})();
