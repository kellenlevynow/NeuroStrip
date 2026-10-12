/* Shared helpers, the top nav and keyboard paging. */
(function () {
  'use strict';
  const d = document;
  const $ = (s, r) => (r || d).querySelector(s);
  const $$ = (s, r) => Array.from((r || d).querySelectorAll(s));

  window.NSU = {
    $, $$,
    money: (v) => '$' + Math.round(v).toLocaleString('en-US'),
    esc: (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])),
    fill: (input) => {
      const min = +input.min || 0, max = +input.max || 100;
      input.style.setProperty('--fill', ((+input.value - min) / (max - min)) * 100 + '%');
    }
  };

  /* Highlight the section in view and keep its link visible in the nav strip. */
  const strip = $('#navLinks');
  const links = $$('a', strip);
  const secs = $$('main > section[id]');
  let current = '';
  function mark() {
    const probe = window.scrollY + window.innerHeight * 0.3;
    let id = '';
    for (const s of secs) { if (s.offsetTop <= probe) id = s.id; else break; }
    if (id === current) return;
    current = id;
    links.forEach((a) => {
      const on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-on', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      if (on && strip.scrollWidth > strip.clientWidth) {
        strip.scrollTo({ left: a.offsetLeft - (strip.clientWidth - a.offsetWidth) / 2, behavior: 'smooth' });
      }
    });
  }
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { mark(); ticking = false; });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  mark();

  /* n and p step through the sections when presenting. */
  d.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(e.target.tagName)) return;
    const k = e.key.toLowerCase();
    if (k !== 'n' && k !== 'p') return;
    const i = secs.findIndex((s) => s.id === current);
    const next = secs[Math.min(secs.length - 1, Math.max(0, i + (k === 'n' ? 1 : -1)))];
    if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
