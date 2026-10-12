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
