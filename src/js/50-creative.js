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
