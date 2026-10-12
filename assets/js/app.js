/* 00-core.js */
(function () {
  'use strict';
  const NS = window.NS || {};
  const d = document;
  const $ = (s, r) => (r || d).querySelector(s);
  const $$ = (s, r) => Array.from((r || d).querySelectorAll(s));
  d.documentElement.classList.add('js');

  const U = (window.NSU = {
    $, $$,
    ic: (n, cls) => `<svg class="ic${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#i-${n}"/></svg>`,
    money: (v) => '$' + Math.round(v).toLocaleString('en-US'),
    moneyK: (v) => (v >= 1000 ? '$' + (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1) + 'K' : '$' + Math.round(v)),
    clamp: (v, a, b) => Math.min(b, Math.max(a, v)),
    esc: (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])),
    fill: (input) => {
      const min = +input.min || 0, max = +input.max || 100;
      input.style.setProperty('--fill', ((+input.value - min) / (max - min)) * 100 + '%');
    },
    ev: (type, ids) => {
      const label = { v: 'Verified', s: 'Shared', a: 'Assumption', h: 'Hypothesis' }[type];
      return `<button type="button" class="ev ev-${type}" data-ev="${type}" data-ids="${ids || ''}" aria-label="${label}. Show source"><span class="ev-dot" aria-hidden="true"></span><span class="ev-t">${label}</span></button>`;
    },
    store: {
      get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
      set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
    }
  });

  /* ---------------- range fills ---------------- */
  d.addEventListener('input', (e) => { if (e.target.matches('input[type=range]')) U.fill(e.target); });
  const fillAll = () => $$('input[type=range]').forEach(U.fill);

  /* ---------------- reveal ---------------- */
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.06 })
    : null;
  U.reveal = (root) => $$('.rv:not(.is-in)', root).forEach((n) => (io ? io.observe(n) : n.classList.add('is-in')));

  /* ---------------- navigation ---------------- */
  const rail = $('#rail'), scrim = $('#scrim'), menuBtn = $('#menuBtn'), here = $('#topbarHere');
  const links = $$('#railNav a');
  const byId = Object.fromEntries(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const setOpen = (open) => {
    rail.classList.toggle('is-open', open);
    scrim.hidden = !open;
    if (menuBtn) menuBtn.setAttribute('aria-expanded', String(open));
    d.body.style.overflow = open ? 'hidden' : '';
  };
  if (menuBtn) menuBtn.addEventListener('click', () => setOpen(!rail.classList.contains('is-open')));
  scrim.addEventListener('click', () => setOpen(false));
  rail.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  d.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setOpen(false); closePop(); } });

  const secs = $$('main > section[id]');
  let current = '';
  const mark = (id) => {
    if (id === current) return;
    current = id;
    links.forEach((a) => a.classList.remove('is-on'));
    const a = byId[id];
    if (a) {
      a.classList.add('is-on');
      if (here) here.textContent = a.textContent.replace(/^\d+/, '').trim();
      if (rail.scrollHeight > rail.clientHeight && window.innerWidth >= 1180) {
        const r = a.getBoundingClientRect();
        if (r.top < 80 || r.bottom > window.innerHeight - 80) a.scrollIntoView({ block: 'center' });
      }
    } else if (here) here.textContent = '';
  };
  const bar = $('#progressBar');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY, h = d.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      const probe = y + window.innerHeight * 0.32;
      let id = '';
      for (const s of secs) { if (s.offsetTop <= probe) id = s.id; else break; }
      mark(id);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  d.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(e.target.tagName)) return;
    const k = e.key.toLowerCase();
    if (k === 'n' || k === 'p') {
      const i = secs.findIndex((s) => s.id === current);
      const next = secs[U.clamp(i + (k === 'n' ? 1 : -1), 0, secs.length - 1)];
      if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (k === 'e') d.body.classList.contains('lens-on') ? setLens(false) : setLens(true);
  });

  /* ---------------- evidence lens ---------------- */
  const lensBtns = $$('[data-lens]');
  const setLens = (on) => {
    d.body.classList.toggle('lens-on', on);
    lensBtns.forEach((b) => { b.setAttribute('aria-pressed', String(on)); const em = $('em', b); if (em) em.textContent = on ? 'on' : 'off'; });
    U.store.set('ns-lens', on ? '1' : '0');
  };
  lensBtns.forEach((b) => b.addEventListener('click', () => setLens(!d.body.classList.contains('lens-on'))));
  if (U.store.get('ns-lens') === '1') setLens(true);

  /* ---------------- evidence popover ---------------- */
  const pop = $('#pop');
  const KIND = { v: ['Verified', 'pop-v', 'Public source'], s: ['Shared', 'pop-s', 'From our conversation or my own observation'], a: ['Assumption', 'pop-a', 'Planning input, to be validated'], h: ['Hypothesis', 'pop-h', 'The plan is built to test this'] };
  let openChip = null;
  function closePop() { if (!pop.hidden) { pop.hidden = true; if (openChip) openChip.classList.remove('is-open'); openChip = null; } }
  function showPop(chip) {
    const type = chip.dataset.ev, ids = (chip.dataset.ids || '').split(',').filter(Boolean);
    const k = KIND[type];
    let html = `<div class="pop-k ${k[1]}"><i></i>${k[0]} <span style="font-weight:500;letter-spacing:.02em;text-transform:none;color:var(--mute-d)">${k[2]}</span></div>`;
    ids.forEach((id) => {
      const s = (NS.sources || {})[id], a = (NS.assumptions || {})[id], h = (NS.hypotheses || {})[id];
      if (s) {
        html += `<div class="pop-item"><b>${U.esc(s.t)}</b><span>${U.esc(s.p)}${s.d ? ' · ' + U.esc(s.d) : ''}</span>${s.u ? `<a href="${U.esc(s.u)}" target="_blank" rel="noopener noreferrer">Open source ${U.ic('external-link')}</a>` : ''}</div>`;
      } else if (a) {
        html += `<div class="pop-item"><b>${U.esc(a.t)}</b><p class="pop-how"><em>How it gets validated:</em> ${U.esc(a.v)}</p></div>`;
      } else if (h) {
        html += `<div class="pop-item"><b>${U.esc(h.t)}</b><p class="pop-how"><em>How it gets tested:</em> ${U.esc(h.v)}</p></div>`;
      }
    });
    if (!ids.length) html += `<div class="pop-item"><span>See the evidence ledger at the end for the full list.</span></div>`;
    pop.innerHTML = html;
    pop.hidden = false;
    const r = chip.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
    let left = r.left + window.scrollX + r.width / 2 - pw / 2;
    left = U.clamp(left, window.scrollX + 12, window.scrollX + d.documentElement.clientWidth - pw - 12);
    let top = r.bottom + window.scrollY + 10;
    if (r.bottom + ph + 20 > window.innerHeight && r.top - ph - 10 > 0) top = r.top + window.scrollY - ph - 10;
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    if (openChip) openChip.classList.remove('is-open');
    openChip = chip;
    chip.classList.add('is-open');
  }
  d.addEventListener('click', (e) => {
    const chip = e.target.closest('.ev[data-ev]');
    if (chip) { e.preventDefault(); if (openChip === chip) closePop(); else showPop(chip); return; }
    if (!e.target.closest('#pop')) closePop();
  });
  window.addEventListener('resize', closePop);

  /* ---------------- photo slots: local file, then remote, else keep the illustration ---------------- */
  U.photos = () => $$('[data-photo]').forEach((fig) => {
    const holder = $('.product-art, .photo-art', fig) || fig;
    const tryLoad = (srcs) => {
      if (!srcs.length) return;
      const img = new Image();
      img.alt = fig.dataset.alt || '';
      img.className = 'photo-img';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.onload = () => { if (img.naturalWidth > 40) { holder.appendChild(img); fig.classList.add('has-img'); const c = $('.photo-credit', fig); if (c) c.hidden = false; const gal = fig.closest('[data-gallery]'); if (gal) gal.classList.add('has-any'); } else tryLoad(srcs.slice(1)); };
      img.onerror = () => tryLoad(srcs.slice(1));
      img.src = srcs[0];
    };
    tryLoad([fig.dataset.local, fig.dataset.remote].filter(Boolean));
  });

  /* ---------------- boot ---------------- */
  U.ready = (fn) => (d.readyState === 'loading' ? d.addEventListener('DOMContentLoaded', fn) : fn());
  U.ready(() => { U.reveal(d); fillAll(); onScroll(); U.photos(); });
  window.addEventListener('load', () => { fillAll(); onScroll(); });
})();

/* 10-hero.js */
/* Hero: the force versus activation traces. Curves are synthetic, drawn to match the 7% and 37% gaps. */
(function () {
  'use strict';
  const { $ } = window.NSU;
  const W = 560, H = 130, BASE = 118, TOP = 14;

  function rng(seed) {
    let a = seed >>> 0;
    return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const smooth = (a, b, t) => { const x = Math.min(1, Math.max(0, (t - a) / (b - a))); return x * x * (3 - 2 * x); };
  const gate = (t) => smooth(0.1, 0.26, t) * (1 - smooth(0.74, 0.9, t));

  function forcePts(amp, seed) {
    const r = rng(seed), pts = [];
    for (let i = 0; i <= 140; i++) {
      const t = i / 140;
      const g = gate(t) * (1 - 0.06 * smooth(0.3, 0.74, t)) + 0.012 * Math.sin(t * 46 + seed) * gate(t) + (r() - 0.5) * 0.006;
      pts.push([t * W, BASE - g * amp * (BASE - TOP)]);
    }
    return pts;
  }
  function emgPts(amp, seed) {
    const r = rng(seed), raw = [], env = [];
    for (let i = 0; i <= 280; i++) {
      const t = i / 280;
      const g = gate(t) * (0.82 + 0.18 * Math.sin(t * 19 + seed * 0.7));
      const spike = g * amp * (0.35 + r() * 0.75) + r() * 0.02;
      raw.push([t * W, BASE - spike * (BASE - TOP)]);
      if (i % 4 === 0) env.push([t * W, BASE - (g * amp * 0.86 + (r() - 0.5) * 0.03 * g) * (BASE - TOP)]);
    }
    return { raw, env };
  }
  const line = (pts) => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
  const area = (pts) => line(pts) + `L${W} ${BASE}L0 ${BASE}Z`;
  const grid = () => `<g stroke="rgba(255,255,255,.07)" stroke-width="1">${[0.25, 0.5, 0.75].map((f) => `<path d="M0 ${(TOP + (BASE - TOP) * f).toFixed(1)}H${W}"/>`).join('')}<path d="M0 ${BASE}H${W}" stroke="rgba(255,255,255,.18)"/></g>`;

  function drawForce(svg) {
    const a = forcePts(1, 3), b = forcePts(0.93, 11);
    svg.innerHTML = grid() +
      `<path d="${area(a)}" fill="rgba(108,155,255,.10)"/>` +
      `<path class="tr-line" d="${line(a)}" fill="none" stroke="#6C9BFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>` +
      `<path class="tr-line" style="--dl:.25s" d="${line(b)}" fill="none" stroke="#FF6B4A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>`;
  }
  function drawEmg(svg) {
    const a = emgPts(1, 5), b = emgPts(0.63, 17);
    svg.innerHTML = grid() +
      `<path class="tr-fade" d="${area(a.raw)}" fill="rgba(108,155,255,.20)"/>` +
      `<path class="tr-fade" style="--dl:.2s" d="${area(b.raw)}" fill="rgba(255,107,74,.30)"/>` +
      `<path class="tr-line" d="${line(a.env)}" fill="none" stroke="#6C9BFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>` +
      `<path class="tr-line" style="--dl:.25s" d="${line(b.env)}" fill="none" stroke="#FF6B4A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>`;
  }
  window.NSU.traces = { drawForce, drawEmg };
  window.NSU.ready(() => {
    const f = $('#traceForce'), e = $('#traceEmg');
    if (f) drawForce(f);
    if (e) drawEmg(e);
  });
})();

/* 20-audience.js */
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

/* 30-message.js */
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

/* 40-channels.js */
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

/* 50-creative.js */
/* Creative territories, parked list and the clinic economics calculator. */
(function () {
  'use strict';
  const { $, esc, money, fill } = window.NSU;
  const NS = window.NS || {};

  const terr = $('#terr');
  if (terr && NS.territories) {
    terr.innerHTML = NS.territories.map((t) => `
      <article class="terr-card">
        <div class="terr-top"><span class="terr-n">${t.n}</span><span class="tag">${esc(t.kind)}</span><span class="terr-str" role="img" aria-label="Strength ${t.strength} of 5">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= t.strength ? 'on' : ''}"></i>`).join('')}</span></div>
        <h4>${esc(t.name)}</h4>
        <p class="terr-line">${esc(t.line)}</p>
        ${t.by ? `<p class="terr-by">${esc(t.by)}</p>` : ''}
        <p class="terr-why">${esc(t.why)}</p>
        <p class="terr-fit">${esc(t.fit)}</p>
      </article>`).join('');
  }
  const parked = $('#parkedList');
  if (parked && NS.parked) parked.innerHTML = NS.parked.map((p) => `<li><b>${esc(p.name)}</b><span>${esc(p.why)}</span></li>`).join('');

  /* clinic economics model */
  const root = $('#econ');
  if (root) {
    const g = (id) => $('#' + id);
    const calc = () => {
      const clinics = +g('ec1').value, pts = +g('ec2').value, rev = +g('ec3').value, add = +g('ec4').value, share = +g('ec5').value;
      g('ecO1').textContent = clinics;
      g('ecO2').textContent = pts;
      g('ecO3').textContent = '$' + rev;
      g('ecO4').textContent = add.toFixed(1);
      g('ecO5').textContent = share + '%';
      const total = clinics * pts * 12 * (share / 100) * add * rev;
      g('ecTotal').textContent = money(Math.round(total / 1000) * 1000);
      g('ecSub').textContent = `${clinics} ${clinics === 1 ? 'clinic' : 'clinics'} × ${pts} new patients × 12 months × ${share}% of them × ${add.toFixed(1)} visits × $${rev}. About ${money(Math.round(total / clinics / 100) * 100)} per clinic.`;
    };
    root.addEventListener('input', calc);
    ['ec1', 'ec2', 'ec3', 'ec4', 'ec5'].forEach((id) => fill(g(id)));
    calc();
  }
})();

/* 60-qualify.js */
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

/* 70-measure.js */
/* Dashboard concept: stacked weekly bars. All values are illustrative. */
(function () {
  'use strict';
  const { $ } = window.NSU;
  const g = $('#boardBars'); if (!g) return;
  const COLORS = ['#101827', '#2C5BDB', '#0A8A64', '#F5B83D', '#CEC7B6'];
  // outbound, search, live demo, LinkedIn, other
  const WEEKS = [[1, 0, 0, 0, 2], [1, 1, 0, 0, 2], [2, 1, 1, 0, 1], [2, 2, 1, 0, 1], [2, 2, 2, 1, 1], [3, 2, 2, 1, 1], [3, 2, 3, 1, 1], [2, 2, 3, 1, 2], [3, 2, 5, 2, 1]];
  const X0 = 52, W = 36, GAP = 14, BASE = 200, UNIT = 9;
  let out = '';
  WEEKS.forEach((wk, i) => {
    let y = BASE;
    const x = X0 + i * (W + GAP);
    wk.forEach((v, j) => { if (!v) return; const h = v * UNIT; y -= h; out += `<rect x="${x}" y="${y}" width="${W}" height="${h - 1.5}" rx="2.5" fill="${COLORS[j]}"/>`; });
    const sum = wk.reduce((a, b) => a + b, 0);
    out += `<text x="${x + W / 2}" y="${y - 6}" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#101827">${sum}</text>`;
    out += `<text x="${x + W / 2}" y="214" text-anchor="middle" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="9.5" fill="#8791A3">W${i + 1}</text>`;
  });
  g.innerHTML = out;
})();

/* 80-plan.js */
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

/* 90-ledger.js */
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
