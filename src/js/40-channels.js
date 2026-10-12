/* Channel cards, budget tool and the pipeline model. */
(function () {
  'use strict';
  const { $, $$, ic, esc, money, fill } = window.NSU;
  const NS = window.NS || {};
  const d = document;

  /* ------------------------------------------------------------------ */
  /* Channel tabs                                                        */
  /* ------------------------------------------------------------------ */
  (function channels() {
    const tabs = $('#chanTabs'), panel = $('#chanPanel');
    if (!tabs || !panel || !NS.channels) return;
    let cur = NS.channels[0].id;
    tabs.innerHTML = NS.channels.map((c) => `<button type="button" role="tab" data-c="${c.id}" aria-selected="${c.id === cur}">${ic(c.icon)}<span>${esc(c.name)}</span><em>${esc(c.tag)}</em></button>`).join('');
    const fact = (k, v) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`;
    function show(id) {
      cur = id;
      const c = NS.channels.find((x) => x.id === id);
      $$('button', tabs).forEach((b) => b.setAttribute('aria-selected', String(b.dataset.c === id)));
      panel.innerHTML = `
        <header class="cp-head">
          <span class="cp-ic">${ic(c.icon)}</span>
          <div><p class="eyebrow">${esc(c.tag)}</p><h3>${esc(c.name)}</h3></div>
          <p class="cp-share"><b class="num">${c.share}%</b><span>of channel budget</span></p>
        </header>
        <p class="cp-job">${esc(c.job)}</p>
        <div class="cp-grid">
          <dl class="cp-facts">
            ${fact('Why it belongs in the first 90 days', c.why)}
            ${fact('Audience', c.audience)}
            ${fact('Funnel stage', c.stage)}
            ${fact('Creative required', c.creative)}
            ${fact('Offer and call to action', c.offer)}
            ${fact('What we expect to learn', c.learn)}
          </dl>
          <div class="cp-side">
            <div class="cp-box"><p class="eyebrow">${ic('activity')}Leading indicators</p><ul class="list-dot">${c.leading.map((l) => `<li>${esc(l)}</li>`).join('')}</ul></div>
            <div class="cp-box cp-kill"><p class="eyebrow">${ic('circle-x')}Kill criteria</p><p>${esc(c.kill)}</p></div>
            <div class="cp-box cp-scale"><p class="eyebrow">${ic('trending-up')}Scale criteria</p><p>${esc(c.scale)}</p></div>
          </div>
        </div>`;
    }
    tabs.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) show(b.dataset.c); });
    show(cur);
  })();

  /* ------------------------------------------------------------------ */
  /* Budget tool                                                         */
  /* ------------------------------------------------------------------ */
  const B = NS.budget;
  const budState = { total: B ? B.def : 90000 };
  (function budget() {
    const root = $('#bud'); if (!root || !B) return;
    const range = $('#budRange'), totalEl = $('#budTotal'), scen = $('#budScen'), linesEl = $('#budLines'), donut = $('#budDonut'), cap = $('#budDonutCap'), months = $('#budMonths');
    range.min = B.min; range.max = B.max; range.step = B.step; range.value = budState.total;
    scen.innerHTML = B.scenarios.map((s) => `<button type="button" data-v="${s.v}" aria-pressed="${s.v === budState.total}">${esc(s.name)} <em class="num">${'$' + s.v / 1000 + 'K'}</em></button>`).join('');
    const GROUPS = [['channel', 'Media and channel costs'], ['build', 'Proof and plumbing'], ['reserve', 'Held back']];

    function arc(cx, cy, r, a0, a1) {
      const p = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
      const [x0, y0] = p(a0), [x1, y1] = p(a1);
      return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
    }
    function render() {
      const T = budState.total;
      totalEl.textContent = money(T);
      $$('button', scen).forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.v === T)));
      fill(range);

      linesEl.innerHTML = GROUPS.map(([g, label]) => {
        const ls = B.lines.filter((l) => l.group === g);
        const sum = ls.reduce((a, l) => a + l.pct, 0);
        return `<div class="bud-group"><p class="bud-gh"><span>${label}</span><b class="num">${sum}%</b><b class="num">${money(T * sum / 100)}</b></p>` +
          ls.map((l) => `<div class="bud-line" title="${esc(B.notes[l.id])}">
              <i class="sw ${l.color}"></i><span class="bud-name">${esc(l.name)}<small>${esc(B.notes[l.id])}</small></span>
              <b class="num bud-pct">${l.pct}%</b><b class="num bud-amt">${money(T * l.pct / 100)}</b>
            </div>`).join('') + '</div>';
      }).join('');

      /* donut */
      let a = -Math.PI / 2, out = '';
      const gap = 0.022;
      B.lines.forEach((l) => {
        const span = (l.pct / 100) * Math.PI * 2;
        out += `<path class="st-${l.color}" d="${arc(110, 110, 84, a + gap / 2, a + span - gap / 2)}" fill="none" stroke-width="26" stroke-linecap="butt"><title>${esc(l.name)}: ${l.pct}%</title></path>`;
        a += span;
      });
      const media = B.lines.filter((l) => l.group === 'channel').reduce((s, l) => s + l.pct, 0);
      out += `<text x="110" y="100" text-anchor="middle" class="dn-k">Media and channels</text><text x="110" y="132" text-anchor="middle" class="dn-v">${media}%</text><text x="110" y="151" text-anchor="middle" class="dn-k">${money(T * media / 100)}</text>`;
      donut.innerHTML = out;
      cap.textContent = 'Proof and measurement take 37%. The reserve is 8%.';

      /* months */
      const maxM = Math.max(...[0, 1, 2].map((i) => B.lines.reduce((s, l) => s + l.m[i], 0)));
      months.innerHTML = [0, 1, 2].map((i) => {
        const tot = B.lines.reduce((s, l) => s + l.m[i], 0);
        const med = B.lines.filter((l) => l.group !== 'build').reduce((s, l) => s + l.m[i], 0);
        return `<div class="bm"><p><b>Month ${i + 1}</b><span class="num">${money(T * tot / 100)}</span><em class="num">${Math.round(med / tot * 100)}% media</em></p>
          <div class="bm-bar" style="width:${(tot / maxM * 100).toFixed(1)}%">${B.lines.filter((l) => l.m[i] > 0).map((l) => `<i class="bg-${l.color}" style="flex:${l.m[i]}" title="${esc(l.name)}: ${money(T * l.m[i] / 100)}"></i>`).join('')}</div></div>`;
      }).join('');

      d.dispatchEvent(new CustomEvent('ns:budget', { detail: { total: T } }));
    }
    range.addEventListener('input', () => { budState.total = +range.value; render(); });
    scen.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; budState.total = +b.dataset.v; range.value = budState.total; render(); });
    render();
  })();

  /* ------------------------------------------------------------------ */
  /* Pipeline model                                                      */
  /* ------------------------------------------------------------------ */
  (function pipeline() {
    const P = NS.pipeline, root = $('#pm'); if (!P || !root) return;
    const rowsEl = $('#pmRows'), totalEl = $('#pmTotal'), gauge = $('#pmGauge'), read = $('#pmRead'), presets = $('#pmPresets'), fctl = $('#pmFunnelCtl'), out = $('#pmOut');
    const st = { v: {}, f: Object.assign({}, P.funnel), touched: {}, preset: 'def' };
    const monthThreePct = (id) => { const l = B.lines.find((x) => x.id === id); return l ? l.m[2] : 0; };
    const linked = (s, key) => (s.a.link && st.preset && !st.touched[s.id] ? Math.round(budState.total * monthThreePct(s.a.link) / 100 / s.a.step) * s.a.step : s.a[key]);
    function load(key) {
      st.preset = key; st.touched = {};
      P.sources.forEach((s) => { st.v[s.id] = { a: linked(s, key), b: s.b ? s.b[key] : null }; });
    }
    const calls = (s) => {
      const { a, b } = st.v[s.id];
      if (s.kind === 'rate') return a * b / 100;
      if (s.kind === 'cost') return b > 0 ? a / b / 4.33 : 0;
      if (s.kind === 'monthly') return a * (b / 100) / 4.33;
      if (s.kind === 'quarterly') return a * (b / 100) / 13;
      return a;
    };
    const fmt = (c, v) => (c.money ? money(v) : c.pct ? v + '%' : (Math.round(v * 10) / 10).toLocaleString('en-US'));
    const slider = (s, k) => {
      const c = s[k]; if (!c) return '<span></span>';
      return `<label class="pm-s"><span>${esc(c.label)}<output data-o="${s.id}-${k}">${fmt(c, st.v[s.id][k])}</output></span><input type="range" min="${c.min}" max="${c.max}" step="${c.step}" value="${st.v[s.id][k]}" data-s="${s.id}" data-k="${k}" aria-label="${esc(s.name)}: ${esc(c.label)}"></label>`;
    };
    function build() {
      rowsEl.innerHTML = P.sources.map((s) => `
        <div class="pm-row" data-id="${s.id}">
          <p class="pm-name">${esc(s.name)}</p>
          ${slider(s, 'a')}${slider(s, 'b')}
          <p class="pm-val"><b class="num" data-c="${s.id}"></b><span>calls a week</span><i class="pm-bar"><u data-b="${s.id}"></u></i></p>
        </div>`).join('');
      const F = [['sql', 'Held calls that become SQLs', 10, 90, 1, true], ['pilot', 'SQLs that start a pilot', 10, 90, 1, true], ['paid', 'Pilots that convert to paid', 10, 90, 1, true], ['acv', 'First-year contract value', 3500, 20000, 500, false]];
      fctl.innerHTML = '<p class="eyebrow">Downstream assumptions</p>' + F.map(([k, label, min, max, step, pct]) => `<label class="pm-s"><span>${label}<output data-fo="${k}"></output></span><input type="range" min="${min}" max="${max}" step="${step}" value="${st.f[k]}" data-f="${k}" aria-label="${label}"></label>`).join('');
      $$('input[type=range]', root).forEach(fill);
    }
    function render() {
      const vals = P.sources.map((s) => [s, calls(s)]);
      const total = vals.reduce((a, [, v]) => a + v, 0);
      const max = Math.max(6, ...vals.map(([, v]) => v));
      vals.forEach(([s, v]) => {
        $(`[data-c="${s.id}"]`, rowsEl).textContent = v.toFixed(1);
        $(`[data-b="${s.id}"]`, rowsEl).style.width = (v / max * 100).toFixed(1) + '%';
        ['a', 'b'].forEach((k) => { const o = $(`[data-o="${s.id}-${k}"]`, rowsEl); if (o) o.textContent = fmt(s[k], st.v[s.id][k]); });
      });
      totalEl.textContent = total.toFixed(1);
      gauge.style.width = Math.min(100, total / (P.target * 1.25) * 100).toFixed(1) + '%';
      gauge.classList.toggle('is-full', total >= P.target);
      const gap = P.target - total;
      read.innerHTML = gap > 0.05
        ? `<b>${gap.toFixed(1)} short of the target.</b> The three levers under this model are where the gap closes.`
        : `<b>The calendar is full.</b> The next constraint is sales capacity and the pilot pool, not marketing.`;
      $$('button', presets).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.k === st.preset)));

      const f = st.f;
      ['sql', 'pilot', 'paid'].forEach((k) => { $(`[data-fo="${k}"]`, fctl).textContent = f[k] + '%'; });
      $('[data-fo="acv"]', fctl).textContent = money(f.acv);
      const rate = (f.sql / 100) * (f.pilot / 100) * (f.paid / 100);
      const sql = total * f.sql / 100, pilots = sql * f.pilot / 100, cust = pilots * f.paid / 100;
      const monthSpend = budState.total * B.lines.reduce((a, l) => a + l.m[2], 0) / 100;
      const perCall = total > 0 ? monthSpend / (total * 4.33) : 0;
      const allow = f.acv * rate;
      const ok = perCall <= allow;
      const cell = (label, value, sub) => `<div><span>${label}</span><b class="num">${value}</b>${sub ? `<em>${sub}</em>` : ''}</div>`;
      out.innerHTML =
        cell('SQLs a week', sql.toFixed(1)) +
        cell('Pilot starts a month', (pilots * 4.33).toFixed(0), `about ${Math.round(pilots * 4.33)} kits in the field at once`) +
        cell('New customers a quarter', (cust * 13).toFixed(0), 'at steady state, one pilot length later') +
        cell('First-year value a quarter', money(Math.round(cust * 13) * f.acv)) +
        `<div class="pm-cmp ${ok ? 'is-ok' : 'is-over'}"><span>Program cost per held call</span><b class="num">${money(perCall)}</b><em>${ok ? 'under' : 'over'} the allowable ${money(allow)} · month-three spend of ${money(monthSpend)}</em></div>`;
      const set = (id, v) => { const n = $(id); if (n) n.textContent = money(v * rate); };
      set('#allowLow', 3500); set('#allowMid', 7500); set('#allowHigh', 20000);
    }
    root.addEventListener('input', (e) => {
      const i = e.target; if (!i.matches('input[type=range]')) return;
      if (i.dataset.s) { st.v[i.dataset.s][i.dataset.k] = +i.value; st.touched[i.dataset.s] = true; st.preset = ''; }
      else if (i.dataset.f) st.f[i.dataset.f] = +i.value;
      render();
    });
    presets.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      load(b.dataset.k);
      $$('input[data-s]', rowsEl).forEach((i) => { i.value = st.v[i.dataset.s][i.dataset.k]; fill(i); });
      render();
    });
    d.addEventListener('ns:budget', () => {
      P.sources.forEach((s) => {
        if (!s.a.link || st.touched[s.id]) return;
        st.v[s.id].a = Math.round(budState.total * monthThreePct(s.a.link) / 100 / s.a.step) * s.a.step;
        const i = $(`input[data-s="${s.id}"][data-k="a"]`, rowsEl); if (i) { i.value = st.v[s.id].a; fill(i); }
      });
      if (rowsEl.children.length) render();
    });
    load('def'); build(); render();
  })();
})();
