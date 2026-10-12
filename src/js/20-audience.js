/* Audience matrix: nine segments, six weighted dimensions, live re-ranking. */
(function () {
  'use strict';
  const { $, $$, ic, esc } = window.NSU;
  const A = (window.NS || {}).audience;
  const root = $('#mx');
  if (!A || !root) return;

  const presetsEl = $('#mxPresets'), weightsEl = $('#mxWeights'), tableEl = $('#mxTable'), verdictEl = $('#mxVerdict');
  const state = { w: Object.fromEntries(A.dims.map((d) => [d.id, d.w])), open: null, preset: 'engine' };
  const TONE = { go: 'tag--go', proof: 'tag--proof', hold: 'tag--hold', later: 'tag--later', no: 'tag--no' };

  const dimVal = (seg, d) => d.crit.reduce((a, c) => a + seg.s[c], 0) / d.crit.length;
  const total = () => A.dims.reduce((a, d) => a + state.w[d.id], 0) || 1;
  const score = (seg) => {
    const t = total();
    const all0 = A.dims.every((d) => state.w[d.id] === 0);
    return A.dims.reduce((a, d) => a + dimVal(seg, d) * (all0 ? 1 / A.dims.length : state.w[d.id] / t), 0);
  };
  const heat = (v) => {
    const a = 0.06 + ((v - 1) / 4) * 0.86;
    return `background:rgba(10,138,100,${a.toFixed(3)});color:${v >= 3.6 ? '#fff' : 'var(--text)'}`;
  };

  /* presets */
  presetsEl.innerHTML = A.presets.map((p) => `<button type="button" data-p="${p.id}" aria-pressed="${p.id === state.preset}" title="${esc(p.note)}">${esc(p.name)}</button>`).join('');
  presetsEl.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const p = A.presets.find((x) => x.id === b.dataset.p);
    state.preset = p.id; state.w = Object.assign({}, p.w);
    syncWeights(); render();
  });

  /* weight sliders */
  weightsEl.innerHTML = A.dims.map((d) => `
    <label class="mx-w" title="${esc(d.help)}">
      <span class="mx-w-top"><b>${esc(d.name)}</b><output data-o="${d.id}"></output></span>
      <input type="range" min="0" max="40" step="1" value="${state.w[d.id]}" data-d="${d.id}" aria-label="Weight for ${esc(d.name)}">
      <span class="mx-w-help">${esc(d.help)}</span>
    </label>`).join('');
  weightsEl.addEventListener('input', (e) => {
    const i = e.target.closest('input'); if (!i) return;
    state.w[i.dataset.d] = +i.value; state.preset = '';
    syncWeights(); render();
  });
  function syncWeights() {
    const t = total();
    $$('input', weightsEl).forEach((i) => { i.value = state.w[i.dataset.d]; window.NSU.fill(i); });
    $$('output', weightsEl).forEach((o) => { o.textContent = Math.round((state.w[o.dataset.o] / t) * 100) + '%'; });
    $$('button', presetsEl).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.p === state.preset)));
  }

  /* table */
  const head = `<div class="mx-row mx-row--head" aria-hidden="true"><span>Audience</span>${A.dims.map((d) => `<span>${esc(d.name)}</span>`).join('')}<span>Weighted score</span><span>Lane</span></div>`;
  function detail(seg) {
    return `<div class="mx-detail">
      <p class="mx-roles"><span class="eyebrow">Role in the purchase</span>${seg.roles.map((r) => `<span class="tag">${esc(r)}</span>`).join('')}</p>
      <div class="mx-notes">${A.dims.map((d) => `
        <div><p class="mx-note-h"><b>${esc(d.name)}</b><em>${dimVal(seg, d).toFixed(1)}</em></p>
          <p>${esc(seg.n[d.id])}</p>
          <ul>${d.crit.map((c) => `<li><span>${esc(A.crit[c])}</span><i style="--v:${seg.s[c]}"></i><b>${seg.s[c]}</b></li>`).join('')}</ul>
        </div>`).join('')}</div></div>`;
  }
  function render() {
    const prev = new Map($$('.mx-row[data-id]', tableEl).map((r) => [r.dataset.id, r.getBoundingClientRect().top]));
    const rows = A.segments.map((s) => ({ s, v: score(s) })).sort((a, b) => b.v - a.v);
    tableEl.innerHTML = head + rows.map((r, i) => `
      <div class="mx-row${state.open === r.s.id ? ' is-open' : ''}${i === 0 ? ' is-top' : ''}" data-id="${r.s.id}">
        <button type="button" class="mx-seg" aria-expanded="${state.open === r.s.id}">
          <span class="mx-rank">${i + 1}</span>
          <span class="mx-name"><b>${esc(r.s.name)}</b><i>${esc(r.s.sub)}</i></span>
          ${ic('chevron-down', 'mx-chev')}
        </button>
        ${A.dims.map((d) => { const v = dimVal(r.s, d); return `<span class="mx-cell" style="${heat(v)}" data-l="${esc(d.name)}">${v.toFixed(1)}</span>`; }).join('')}
        <span class="mx-score"><b class="num">${r.v.toFixed(2)}</b><span class="mx-bar"><i style="width:${((r.v - 1) / 4 * 100).toFixed(1)}%"></i></span></span>
        <span class="mx-lane"><span class="tag ${TONE[r.s.tone] || ''}">${esc(r.s.lane)}</span></span>
        ${state.open === r.s.id ? detail(r.s) : ''}
      </div>`).join('');

    /* FLIP so rank changes are visible */
    if (prev.size && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      $$('.mx-row[data-id]', tableEl).forEach((el) => {
        const before = prev.get(el.dataset.id); if (before == null) return;
        const dy = before - el.getBoundingClientRect().top;
        if (Math.abs(dy) < 2) return;
        el.style.transform = `translateY(${dy}px)`; el.style.transition = 'none';
        requestAnimationFrame(() => { el.style.transition = 'transform .45s cubic-bezier(.2,.7,.2,1)'; el.style.transform = ''; });
      });
    }

    const [first, second] = rows;
    let tail = '';
    if (first.s.id === 'pt_regional') tail = 'Regional PT groups hold first place on anything that values scale and access.';
    else if (first.s.id.startsWith('sport')) tail = 'Sport wins when urgency and halo outweigh scale. It still cannot supply 20 calls a week, which is why it is the proof lane and not the engine.';
    else if (first.s.id === 'pt_indie' || first.s.id === 'perf_fac') tail = 'Small, owner-led buyers win on raw speed. Their contracts are the smallest and least expandable, which is why they get a group demo before any 1:1 time.';
    else tail = 'This weighting favors a segment the 90-day plan treats as later or capture-only. Worth a conversation about why.';
    verdictEl.innerHTML = `<b>${esc(first.s.name)}</b> leads at <span class="num">${first.v.toFixed(2)}</span>, ahead of ${esc(second.s.name)} at <span class="num">${second.v.toFixed(2)}</span>. ${tail}`;
  }
  tableEl.addEventListener('click', (e) => {
    const b = e.target.closest('.mx-seg'); if (!b) return;
    const id = b.closest('.mx-row').dataset.id;
    state.open = state.open === id ? null : id;
    render();
  });

  syncWeights();
  render();
})();
