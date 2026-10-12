/* Message house tabs and the seven-stage awareness ladder. */
(function () {
  'use strict';
  const { $, $$, ic, esc } = window.NSU;
  const NS = window.NS || {};

  /* generic tabs: any .seg[role=tablist] next to [data-panel] siblings */
  $$('[role="tablist"]').forEach((list) => {
    const scope = list.parentElement;
    const panels = $$(':scope > [data-panel]', scope);
    if (!panels.length) return;
    list.addEventListener('click', (e) => {
      const b = e.target.closest('[data-tab]'); if (!b) return;
      $$('[data-tab]', list).forEach((x) => x.setAttribute('aria-selected', String(x === b)));
      panels.forEach((p) => { p.hidden = p.dataset.panel !== b.dataset.tab; });
    });
  });

  /* ladder */
  const steps = $('#ladderSteps'), panel = $('#ladderPanel');
  if (!steps || !panel || !NS.ladder) return;
  let cur = 1;
  steps.innerHTML = NS.ladder.map((s) => `<button type="button" role="tab" style="--n:${s.n}" data-n="${s.n}" aria-selected="${s.n === cur}"><b>${s.n}</b><span>${esc(s.stage)}<i>${esc(s.mind.replace(/"/g, ''))}</i></span></button>`).join('');
  const row = (icon, label, text) => `<div><dt>${ic(icon)}${label}</dt><dd>${esc(text)}</dd></div>`;
  function show(n) {
    cur = n;
    const s = NS.ladder.find((x) => x.n === n);
    $$('button', steps).forEach((b) => b.setAttribute('aria-selected', String(+b.dataset.n === n)));
    panel.innerHTML = `
      <div class="lp-top"><span class="tag tag--ink">Stage ${s.n} of 7</span><h3>${esc(s.stage)}</h3></div>
      <p class="lp-mind">They are thinking: ${esc(s.mind)}</p>
      <p class="lp-msg">${esc(s.message)}</p>
      <dl class="lp-grid">
        ${row('pen-tool', 'Creative angle', s.angle)}
        ${row('video', 'Format', s.format)}
        ${row('mouse-pointer-click', 'Call to action', s.cta)}
        ${row('megaphone', 'Channel', s.channel)}
        ${row('user-check', 'Behavior we want', s.behavior)}
        ${row('chart-column', 'How we measure it', s.metric)}
      </dl>
      <p class="lp-sport">${ic('trophy')}<span>${esc(s.sport)}</span></p>`;
  }
  steps.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) show(+b.dataset.n); });
  steps.addEventListener('keydown', (e) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    const dir = e.key === 'ArrowUp' || e.key === 'ArrowRight' ? 1 : -1;
    const n = Math.min(7, Math.max(1, cur + dir));
    show(n);
    const b = $(`button[data-n="${n}"]`, steps); if (b) b.focus();
  });
  show(cur);
})();
