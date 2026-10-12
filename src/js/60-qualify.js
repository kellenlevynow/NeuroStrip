/* Fit and intent lead router, UTM builder, CPL comparison. */
(function () {
  'use strict';
  const { $, $$, ic, esc, money, fill } = window.NSU;

  /* ------------------------------------------------------------------ */
  /* Fit x intent                                                        */
  /* ------------------------------------------------------------------ */
  (function fitIntent() {
    const root = $('#fi'); if (!root) return;
    const g = (id) => $('#' + id);
    const grid = g('fiGrid'), res = g('fiRes');
    const ROUTE = {
      A3: ['Calendar now', 'The thank-you page shows the calendar for a pilot scoping call. If they do not book, a call inside 15 business minutes.', 'MQL, fast lane'],
      A2: ['Personal follow-up', 'Sales reaches out within one business day with the pilot blueprint and an invitation to scope a pilot.', 'MQL'],
      A1: ['Work the account', 'Not ready for sales. The account goes into the coordinated outbound sequence and keeps seeing the trace.', 'Engaged lead'],
      B3: ['Group demo first', 'Offered Thursday\'s live demo straight away. A 1:1 follows if they attend or ask again.', 'MQL, group lane'],
      B2: ['Nurture plus invite', 'Persona nurture track, with a standing invitation to the live demo.', 'Engaged lead'],
      B1: ['Nurture', 'Persona nurture track. Re-scored on new behavior.', 'Lead'],
      C3: ['Self-serve reply', 'An immediate, useful answer: the demo recording, pricing guidance and the group demo link. No 1:1 by default.', 'Lead'],
      C2: ['Nurture', 'Content only. If the person belongs to a Tier A account, their activity counts toward that account.', 'Lead'],
      C1: ['Nurture', 'Content only.', 'Lead'],
      D3: ['Polite close', 'A helpful reply and a link to public resources. Suppressed from routing and audiences.', 'Disqualified'],
      D2: ['Suppress', 'Removed from routing and paid audiences.', 'Disqualified'],
      D1: ['Suppress', 'Removed from routing and paid audiences.', 'Disqualified']
    };
    function fit(seg, size, role, region) {
      let f, why;
      if (seg === 'other') { f = 'D'; why = 'Not a buyer or a user.'; }
      else if (seg === 'pt') {
        if (size === '5') { f = role === 'prac' ? 'C' : 'A'; why = role === 'prac' ? 'Right account, no buying authority. A champion: matched to the account.' : role === 'lead' ? 'The beachhead: a 5 to 25 location group, and the clinical lead who would run a pilot.' : 'The beachhead: a 5 to 25 location group and a person who can say yes.'; }
        else if (size === '2' || size === '26') { f = role === 'prac' ? 'C' : 'B'; why = 'Close to the band. Smaller contract or a longer path to yes.'; }
        else if (size === '51') { f = role === 'prac' ? 'C' : 'B'; why = 'Enterprise. Flagged to business development as a named account.'; }
        else { f = 'C'; why = 'A single clinic. Small contract, price-sensitive.'; }
      } else if (seg === 'sport') { f = role === 'prac' ? 'C' : 'A'; why = role === 'prac' ? 'A user without sign-off. A champion for the program.' : 'Proof lane: a program lead who can run a trial.'; }
      else if (seg === 'perf') { f = role === 'prac' ? 'C' : 'B'; why = 'Owner-led and quick, with a modest contract.'; }
      else if (seg === 'neuro') { f = role === 'prac' ? 'C' : 'B'; why = 'A real use case outside the first beachhead.'; }
      else { f = role === 'prac' ? 'C' : 'B'; why = 'Research buyer. Specification-led, funding-dependent.'; }
      if (region === 'row' && f !== 'D') { f = 'D'; why = 'Outside the regions the team serves today. Logged, not worked.'; }
      return [f, why];
    }
    function render() {
      const seg = g('fiSeg').value, size = g('fiSize').value, role = g('fiRole').value, intent = g('fiIntent').value, region = g('fiRegion').value;
      g('fiSizeWrap').style.display = seg === 'pt' ? '' : 'none';
      const [f, why] = fit(seg, size, role, region);
      const key = f + intent;
      grid.innerHTML = '<span class="fi-h fi-h--fit">Fit</span><span class="fi-h">Intent 1<i>Looked</i></span><span class="fi-h">Intent 2<i>Leaned in</i></span><span class="fi-h">Intent 3<i>Raised a hand</i></span>' +
        ['A', 'B', 'C', 'D'].map((F) => `<span class="fi-f fi-f--${F}">${F}</span>` + ['1', '2', '3'].map((I) => `<span class="fi-c fi-c--${F}${F + I === key ? ' is-on' : ''}">${esc(ROUTE[F + I][0])}</span>`).join('')).join('');
      const r = ROUTE[key];
      const note = region === 'au' ? 'Routed to the Australian team.' : region === 'eu' ? 'Routed to the regional team or distributor.' : '';
      res.innerHTML = `
        <p class="fi-badge"><b class="fi-f fi-f--${f}">${f}</b><span>Fit ${f}, intent ${intent}</span><em class="tag tag--ink">${esc(r[2])}</em></p>
        <h4>${esc(r[0])}</h4>
        <p>${esc(r[1])} ${esc(note)}</p>
        <p class="fi-why">${ic('info')}<span>${esc(why)}</span></p>`;
    }
    root.addEventListener('change', render);
    render();
  })();

  /* ------------------------------------------------------------------ */
  /* UTM builder                                                         */
  /* ------------------------------------------------------------------ */
  (function utm() {
    const root = $('#utm'); if (!root) return;
    const parts = $('#utmParts'), url = $('#utmUrl'), copy = $('#utmCopy');
    const v = (k) => $(`[data-u="${k}"]`, root).value;
    const TERM = { 'pt-group-exec': 'tier-a', 'pt-group-clinical': 'tier-a', 'sport-pro': 'proof-lane', 'sport-college': 'proof-lane', 'inbound-other': 'open' };
    function render() {
      const [source, medium] = v('channel').split('|');
      const campaign = [v('period'), v('aud'), v('terr'), v('offer')].join('_');
      const p = { utm_source: source, utm_medium: medium, utm_campaign: campaign, utm_content: v('fmt'), utm_term: TERM[v('aud')] };
      const HELP = { utm_source: 'Platform', utm_medium: 'Paid or owned type', utm_campaign: 'Period, audience, message, offer', utm_content: 'Format and version', utm_term: 'Tier or keyword' };
      parts.innerHTML = Object.entries(p).map(([k, val]) => `<div><dt>${k}<i>${HELP[k]}</i></dt><dd>${esc(val)}</dd></div>`).join('');
      const full = 'https://controlbionics.com/neurostrip/pilot?' + Object.entries(p).map(([k, val]) => k + '=' + encodeURIComponent(val)).join('&');
      url.textContent = full;
      url.dataset.full = full;
    }
    root.addEventListener('change', render);
    copy.addEventListener('click', () => {
      const t = url.dataset.full || '';
      const done = () => { const s = $('span', copy); s.textContent = 'Copied'; setTimeout(() => { s.textContent = 'Copy'; }, 1400); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, () => {});
      else { const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) { /* no clipboard */ } ta.remove(); }
    });
    render();
  })();

  /* ------------------------------------------------------------------ */
  /* CPL trap                                                            */
  /* ------------------------------------------------------------------ */
  (function trap() {
    const root = $('#trap'); if (!root) return;
    const side = (k) => {
      const cpl = +$(`[data-t="${k}-cpl"]`, root).value, rate = +$(`[data-t="${k}-rate"]`, root).value;
      $(`[data-to="${k}-cpl"]`, root).textContent = money(cpl);
      $(`[data-to="${k}-rate"]`, root).textContent = rate + '%';
      const per = cpl / (rate / 100);
      $(`[data-tr="${k}"]`, root).textContent = money(per);
      return per;
    };
    function render() {
      const a = side('a'), b = side('b');
      $('[data-card="a"]', root).classList.toggle('is-win', a < b);
      $('[data-card="b"]', root).classList.toggle('is-win', b < a);
      const cplA = +$('[data-t="a-cpl"]', root).value, cplB = +$('[data-t="b-cpl"]', root).value;
      const cheapLead = cplA < cplB ? 'A' : 'B', cheapCall = a < b ? 'A' : 'B';
      $('#trapRead').innerHTML = cheapLead !== cheapCall
        ? `Campaign ${cheapLead} has the cheaper lead. Campaign ${cheapCall} has the cheaper <b>sales-accepted call</b>, by ${money(Math.abs(a - b))}. A dashboard that only shows cost per lead would have scaled the wrong one.`
        : `Here the cheaper lead is also the cheaper sales-accepted call. That happens. The point is that only the second number can tell you.`;
    }
    $$('input[type=range]', root).forEach(fill);
    root.addEventListener('input', render);
    render();
  })();
})();
