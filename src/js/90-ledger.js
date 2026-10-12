/* Evidence ledger: sources, assumptions and hypotheses, with citation counts taken from the page itself. */
(function () {
  'use strict';
  const { $, $$, ic, esc } = window.NSU;
  const NS = window.NS || {};
  window.NSU.ready(() => {
    const src = $('#ledSrc'); if (!src) return;
    const counts = {};
    $$('.ev[data-ids]').forEach((c) => (c.dataset.ids || '').split(',').filter(Boolean).forEach((id) => { counts[id] = (counts[id] || 0) + 1; }));
    const cited = (id) => (counts[id] ? `<em>Cited ${counts[id]}×</em>` : '');

    const ORDER = ['Company', 'Filing', 'Press', 'Research', 'Market', 'Benchmark', 'Platform', 'Conversation', 'Observation'];
    const LABEL = { Company: 'Control Bionics, own pages', Filing: 'Company filings', Press: 'Press coverage', Research: 'Peer-reviewed research', Market: 'Market and event data', Benchmark: 'Channel benchmarks and marketing science', Platform: 'Platform documentation', Conversation: 'Shared in conversation', Observation: 'My own observation' };
    const entries = Object.entries(NS.sources || {});
    src.innerHTML = ORDER.map((k) => {
      const items = entries.filter(([, s]) => s.k === k);
      if (!items.length) return '';
      const shared = k === 'Conversation' || k === 'Observation';
      return `<div class="led-group"><p class="led-gh"><span class="ev ev-${shared ? 's' : 'v'}"><span class="ev-dot"></span></span>${LABEL[k]}<i>${items.length}</i></p><ul>` +
        items.map(([id, s]) => `<li id="src-${id}"><span class="led-id">${id}</span><div>${s.u ? `<a href="${esc(s.u)}" target="_blank" rel="noopener noreferrer">${esc(s.t)}${ic('external-link')}</a>` : `<b>${esc(s.t)}</b>`}<span>${esc(s.p)}${s.d ? ' · ' + esc(s.d) : ''}</span></div>${cited(id)}</li>`).join('') + '</ul></div>';
    }).join('');

    const table = (obj, type, how) => `<ul class="led-rows">` + Object.entries(obj || {}).map(([id, a]) => `<li id="${type}-${id}"><span class="led-id">${id}</span><div><b>${esc(a.t)}</b><span><i>${how}</i> ${esc(a.v)}</span></div>${cited(id)}</li>`).join('') + '</ul>';
    $('#ledAsm').innerHTML = table(NS.assumptions, 'asm', 'Validated by:');
    $('#ledHyp').innerHTML = table(NS.hypotheses, 'hyp', 'Tested by:');

    const pub = entries.filter(([, s]) => s.k !== 'Conversation' && s.k !== 'Observation').length;
    const tagged = (t) => $$(`.ev[data-ev="${t}"]`).length;
    $('#evSum').innerHTML = [
      ['v', pub, 'public sources', `${tagged('v')} claims tagged verified`],
      ['s', entries.length - pub, 'shared or observed', `${tagged('s')} claims tagged shared`],
      ['a', Object.keys(NS.assumptions || {}).length, 'planning assumptions', 'each with a validation step'],
      ['h', Object.keys(NS.hypotheses || {}).length, 'hypotheses', 'each with a test attached']
    ].map(([t, n, label, sub]) => `<li class="es-${t}"><b class="num">${n}</b><span>${label}</span><i>${sub}</i></li>`).join('');
  });
})();
