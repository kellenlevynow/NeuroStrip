/* The buying group: who exists at each size, one tab per role, the objection table and the persona tests. */
(function () {
  'use strict';
  const { $, $$, esc } = window.NSU;
  const NS = window.NS || {};
  const R = NS.roles || [], T = NS.personaTests, SITE = NS.site || {};
  const O = SITE.objections || [], Z = SITE.bySize || [], AB = SITE.ab || {};
  const list = (a) => `<ul class="dots">${(a || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  const CL = { executive: 'Executive', operations: 'Operations', clinical: 'Clinical' };
  const TAB = { owner: 'Owner', ceo: 'CEO', coo: 'COO', cco: 'Chief clinical officer', rehab: 'Clinical director', admin: 'Practice administrator', director: 'Clinic director' };
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
