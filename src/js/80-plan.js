/* Roadmap with a movable start date, experiment backlog, risk register. */
(function () {
  'use strict';
  const { $, $$, ic, esc, ev } = window.NSU;
  const NS = window.NS || {};
  const DAY = 86400000;

  /* ------------------------------------------------------------------ */
  /* Roadmap                                                             */
  /* ------------------------------------------------------------------ */
  (function roadmap() {
    const R = NS.roadmap, cols = $('#rmCols'); if (!R || !cols) return;
    const dateEl = $('#rmDate'), quick = $('#rmQuick'), strip = $('#rmStrip'), note = $('#rmNote'), streamsEl = $('#rmStreams'), eventsEl = $('#rmEvents');
    const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
    const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const add = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
    const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fmt = (d) => `${MON[d.getMonth()]} ${d.getDate()}`;
    const range = (a, b) => (a.getMonth() === b.getMonth() ? `${fmt(a)} to ${b.getDate()}` : `${fmt(a)} to ${fmt(b)}`);
    const state = { start: parse(R.defaultStart), stream: '' };
    const dayOf = (d) => Math.round((d - state.start) / DAY) + 1;
    const weekOf = (day) => Math.ceil(day / 7);

    streamsEl.innerHTML = `<button type="button" data-s="" aria-pressed="true">All</button>` + R.streams.map((s) => `<button type="button" data-s="${s.id}" aria-pressed="false"><i class="rs rs-${s.id}"></i>${esc(s.name)}</button>`).join('');
    streamsEl.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      state.stream = b.dataset.s;
      $$('button', streamsEl).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      cols.dataset.stream = state.stream;
      $$('.rm-item', cols).forEach((li) => li.classList.toggle('is-dim', !!state.stream && li.dataset.s !== state.stream));
    });

    function evInfo() {
      return R.events.map((e) => {
        const a = parse(e.start), b = parse(e.end), d0 = dayOf(a), d1 = dayOf(b);
        return Object.assign({}, e, { a, b, d0, d1, inside: d1 >= 1 && d0 <= 90, after: d0 > 90 && d0 <= 150, before: d1 < 1 });
      });
    }

    function render() {
      const S = state.start, evs = evInfo();
      dateEl.value = iso(S);
      $$('button', quick).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.d === iso(S))));
      const weekEvents = (w) => evs.filter((e) => e.inside && weekOf(Math.max(1, e.d0)) <= w && weekOf(Math.min(90, e.d1)) >= w);

      /* strip */
      const pct = (day) => ((day - 1) / 90 * 100).toFixed(2) + '%';
      const wpct = (days) => (days / 90 * 100).toFixed(2) + '%';
      const hard = evs.filter((e) => e.inside && !e.soft);
      strip.innerHTML =
        `<div class="rs-evrow">` + hard.map((e) => { const mid = (Math.max(1, e.d0) + Math.min(90, e.d1)) / 2 + 0.5; return `<span class="rs-ev${mid > 55 ? ' rs-ev--r' : mid < 30 ? ' rs-ev--l' : ''}" style="left:${pct(mid)}"><b>${esc(e.name.replace('APTA ', ''))}<i> · ${range(e.a, e.b)}</i></b></span>`; }).join('') + `</div>` +
        `<div class="rs-track">` +
          R.phases.map((p, i) => `<span class="rs-phase rs-p${p.n}" style="left:${pct(i * 30 + 1)};width:${wpct(30)}"><b>${esc(p.name)}</b><i>${esc(p.days)}</i></span>`).join('') +
          evs.filter((e) => e.inside && e.soft).map((e) => `<span class="rs-soft" style="left:${pct(Math.max(1, e.d0))};width:${wpct(Math.min(90, e.d1) - Math.max(1, e.d0) + 1)}" title="${esc(e.name)}"></span>`).join('') +
        `</div>` +
        `<div class="rs-marks">` +
          [1, 30, 60, 90].map((dn) => `<span class="rs-gate${dn === 1 ? ' rs-gate--start' : dn === 90 ? ' rs-gate--end' : ''}" style="left:${dn === 1 ? '0%' : dn === 90 ? '100%' : pct(dn + 1)}"><b>Day ${dn}</b><i>${fmt(add(S, dn - 1))}</i></span>`).join('') +
        `</div>`;

      /* note */
      const csm = evs.find((e) => e.name.includes('Combined'));
      const hol = evs.find((e) => e.soft);
      let n = `<b>Day 30</b> is ${fmt(add(S, 29))}, <b>Day 60</b> is ${fmt(add(S, 59))} and <b>Day 90</b> is ${fmt(add(S, 89))}. `;
      if (csm && csm.inside) {
        const w = weekOf(Math.max(1, csm.d0));
        n += `APTA CSM (${range(csm.a, csm.b)}) lands on Days ${Math.max(1, csm.d0)} to ${Math.min(90, csm.d1)}, in week ${w}. `;
        if (w < 9) n += 'That is before the scale phase, so the booth becomes a message test and the event work moves with it. ';
      } else if (csm && csm.before) n += 'APTA CSM has already passed by Day 1, so the event plan points at the next conference on the calendar. ';
      else if (csm) n += `APTA CSM falls on Day ${csm.d0}, after the window. `;
      if (hol && hol.inside) {
        const w0 = weekOf(Math.max(1, hol.d0)), w1 = weekOf(Math.min(90, hol.d1));
        let mon = add(hol.b, 1); while (mon.getDay() !== 1) mon = add(mon, 1);
        n += `The holiday slowdown overlaps week${w0 === w1 ? ' ' + w0 : 's ' + w0 + ' to ' + w1}, so those weeks become build time and the full launch lands Monday, ${fmt(mon)}.${ev('a', 'a13')}`;
      }
      note.innerHTML = n;

      /* columns */
      cols.innerHTML = R.phases.map((p) => {
        const gate = R.gates[p.n - 1];
        const weeks = R.weeks.filter((w) => w.w >= p.weeks[0] && w.w <= p.weeks[1]);
        return `<section class="rm-col rm-col--${p.n}">
          <header><span class="rm-pn">Phase ${p.n} · ${esc(p.days)}</span><h3>${esc(p.name)}</h3><p class="rm-days">Weeks ${p.weeks[0]} to ${p.weeks[1]} · ${range(add(S, (p.weeks[0] - 1) * 7), add(S, p.weeks[1] * 7 - 1))}</p><p>${esc(p.line)}</p></header>
          ${weeks.map((w) => {
            const a = add(S, (w.w - 1) * 7), b = add(S, w.w * 7 - 1);
            const flags = weekEvents(w.w).map((e) => `<span class="rm-flag${e.soft ? ' rm-flag--soft' : ''}">${ic(e.soft ? 'hourglass' : 'flag')}${esc(e.name.replace('APTA ', ''))}</span>`).join('');
            return `<article class="rm-week">
              <p class="rm-wh"><b>Week ${w.w}</b><span>${range(a, b)}</span></p>
              <h4>${esc(w.title)}</h4>${flags ? `<p class="rm-flags">${flags}</p>` : ''}
              <ul>${w.items.map(([s, t]) => `<li class="rm-item${state.stream && s !== state.stream ? ' is-dim' : ''}" data-s="${s}"><i class="rs rs-${s}"></i><span>${esc(t)}</span></li>`).join('')}</ul>
            </article>`;
          }).join('')}
          <article class="rm-gate">
            <p class="rm-gh">${ic('milestone')}<b>Day ${gate.day} gate</b><span>${fmt(add(S, gate.day - 1))}</span></p>
            <h4>${esc(gate.q)}</h4>
            <ul class="list-check">${gate.checks.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
            <p class="rm-decide"><b>Decide:</b> ${esc(gate.decide)}</p>
            <p class="rm-target"><span>Run rate at this gate</span><b>${esc(gate.target)}</b>${ev('a', 'a6,a8,a14')}</p>
          </article>
        </section>`;
      }).join('');

      /* events */
      const row = (e, when) => `<li><b>${esc(e.name)}</b><span>${range(e.a, e.b)} · ${esc(e.where)}</span><em>${when}</em>${e.src ? ev(e.src.startsWith('a') ? 'a' : 'v', e.src) : ''}</li>`;
      const inside = evs.filter((e) => e.inside && !e.soft), after = evs.filter((e) => !e.inside && e.d0 > 90), before = evs.filter((e) => e.before && !e.soft);
      eventsEl.innerHTML = `<p class="eyebrow">Events against this start date</p><ul>` +
        inside.map((e) => row(e, `Inside the window · week ${weekOf(Math.max(1, e.d0))}`)).join('') +
        after.map((e) => row(e, `Day ${e.d0} · ${e.after ? 'just after the window' : 'later in the year'}`)).join('') +
        before.map((e) => row(e, 'Before Day 1')).join('') + `</ul>`;
    }
    dateEl.addEventListener('change', () => { if (dateEl.value) { state.start = parse(dateEl.value); render(); } });
    quick.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; state.start = parse(b.dataset.d); render(); });
    render();
  })();

  /* ------------------------------------------------------------------ */
  /* Experiments                                                         */
  /* ------------------------------------------------------------------ */
  (function experiments() {
    const X = NS.experiments, list = $('#xpList'); if (!X || !list) return;
    const st = { phase: 0, sort: 'score' };
    const dots = (n) => [1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('');
    function render() {
      const rows = X.map((x) => Object.assign({ score: x.i * x.c * x.e }, x)).filter((x) => !st.phase || x.phase === st.phase).sort((a, b) => (st.sort === 'score' ? b.score - a.score || a.n - b.n : a.n - b.n));
      list.innerHTML = rows.map((x) => `
        <article class="xp-row">
          <span class="xp-n">${String(x.n).padStart(2, '0')}</span>
          <div class="xp-main"><h4>${esc(x.name)}</h4><p>${esc(x.h)}</p></div>
          <div class="xp-ab"><span><b>A</b>${esc(x.a)}</span><span><b>B</b>${esc(x.b)}</span></div>
          <div class="xp-metric"><span class="eyebrow">Read on</span>${esc(x.metric)}</div>
          <div class="xp-ice" title="Impact ${x.i}, confidence ${x.c}, ease ${x.e}"><span>I<u>${dots(x.i)}</u></span><span>C<u>${dots(x.c)}</u></span><span>E<u>${dots(x.e)}</u></span></div>
          <div class="xp-score"><b class="num">${x.score}</b><span class="tag">Phase ${x.phase}</span></div>
        </article>`).join('');
    }
    const bind = (id, key, attr, num) => $(id).addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      st[key] = num ? +b.dataset[attr] : b.dataset[attr];
      $$('button', $(id)).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      render();
    });
    bind('#xpPhase', 'phase', 'p', true); bind('#xpSort', 'sort', 's', false);
    render();
  })();

  /* ------------------------------------------------------------------ */
  /* Risks                                                               */
  /* ------------------------------------------------------------------ */
  (function risks() {
    const K = NS.risks, list = $('#rkList'), filter = $('#rkFilter'); if (!K || !list) return;
    const TONE = { High: 'tag--no', Medium: 'tag--hold', Low: 'tag--go' };
    let level = '';
    function render() {
      list.innerHTML = K.filter((r) => !level || r.level === level).map((r) => `
        <article class="rk-row">
          <div class="rk-h"><h4>${esc(r.name)}</h4><span class="tag ${TONE[r.level]}">${esc(r.level)}</span><span class="tag">${esc(r.kind)}</span></div>
          <p class="rk-what">${esc(r.what)}</p>
          <p class="rk-plan">${ic('shield-check')}<span>${esc(r.plan)}</span></p>
        </article>`).join('');
    }
    filter.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      level = b.dataset.l;
      $$('button', filter).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      render();
    });
    render();
  })();
})();
