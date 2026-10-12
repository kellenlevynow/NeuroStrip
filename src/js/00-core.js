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
