/* The campaign: ad mockups at true size, labeled in plain words, filtered by cluster and channel.
   Search ads are checked here: headlines 30 characters or fewer, descriptions 90 or fewer. */
(function () {
  'use strict';
  const { $, $$, esc } = window.NSU;
  const C = (window.NS || {}).campaign;
  const track = $('#adsTrack');
  if (!C || !track) return;

  const LIMITS = { headline: 30, description: 90 };
  const CL = { executive: 'Executive', operations: 'Operations', clinical: 'Clinical' };
  const ROLES = { executive: 'Owners and chief executives', operations: 'Chief operating officers and practice administrators', clinical: 'Chief clinical officers, clinical directors and clinic directors' };
  const clusterOf = (id) => (C.clusters || []).find((c) => c.cluster === id) || {};
  const AB = {
    executive: 'A against B in each role\'s wording. Owner: patients who can see their progress at each visit have a reason to keep coming back, against a return-to-sport service you can start at one clinic, measure, then add to the rest',
    operations: 'A against B in each role\'s wording. COO: each sensor goes on like a bandage and the pilot times setup at one clinic, against one page with the annual price and a rollout plan for each new clinic',
    clinical: 'A against B in each role\'s wording. Chief clinical officer: strength tests can miss compensation, against a documented return-to-sport protocol for the whole group',
  };

  /* ---------- Control Bionics product photography (literal paths so the build can embed them offline) ---------- */
  const PH = {
    calves: ['src="assets/img/cb/calves-1x.webp"', 'NeuroStrip sensors on both calves of a standing athlete'],
    profiling: ['src="assets/img/cb/profiling-1x.webp" data-hd="assets/img/cb/profiling-2x.webp"', 'A clinician shows an athlete with a sensor on the thigh the readings on an iPad'],
    platform05: ['src="assets/img/cb/platform-05-1x.webp" data-hd="assets/img/cb/platform-05-2x.webp"', 'Live activation traces in the NeuroStrip app on a laptop'],
    homepage: ['src="assets/img/cb/homepage-1x.webp" data-hd="assets/img/cb/homepage-2x.webp"', 'A NeuroStrip sensor on the skin of an upper arm'],
    box: ['src="assets/img/cb/box-1x.webp" data-hd="assets/img/cb/box-2x.webp"', 'The NeuroStrip kit: charging case, sensors and adhesive strips'],
    arm: ['src="assets/img/cb/arm-1x.webp" data-hd="assets/img/cb/arm-2x.webp"', 'A NeuroStrip sensor being pressed onto the skin of an arm'],
    lifestyle: ['src="assets/img/cb/lifestyle-1x.webp" data-hd="assets/img/cb/lifestyle-2x.webp"', 'A NeuroStrip sensor being placed on the back of an athlete\'s thigh'],
  };
  const photo = (k, pos) => `<img class="cbimg" ${PH[k][0]} alt="${PH[k][1]}" loading="lazy" decoding="async"${pos ? ` style="object-position:${pos}"` : ''}>`;

  /* ---------- small illustrations, used where no photograph fits ---------- */
  const art = {
    leg: (h) => `<svg viewBox="0 0 400 ${h || 300}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="${h || 300}" fill="#111"/><path d="M-10 ${(h || 300) * .78}C80 ${(h || 300) * .62} 150 ${(h || 300) * .3} 220 ${(h || 300) * .28}s140 30 200 10v${h || 300}H-10z" fill="#2a2a2e"/><g transform="rotate(-9 200 ${(h || 300) * .48})"><rect x="150" y="${(h || 300) * .48 - 22}" width="100" height="44" rx="17" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.3)"/><rect x="164" y="${(h || 300) * .48 - 12}" width="72" height="24" rx="9" fill="#f5f5f7"/><circle cx="180" cy="${(h || 300) * .48}" r="3.6" fill="#111"/><circle cx="200" cy="${(h || 300) * .48}" r="3.6" fill="#111"/><circle cx="220" cy="${(h || 300) * .48}" r="3.6" fill="#111"/><circle cx="231" cy="${(h || 300) * .48 - 7}" r="1.8" fill="#2EE6A6"/></g><g fill="none" stroke="#2EE6A6" stroke-linecap="round" stroke-width="1.8" opacity=".5"><path d="M134 ${(h || 300) * .38}a46 46 0 0 0 0 ${(h || 300) * .2}"/><path d="M266 ${(h || 300) * .38}a46 46 0 0 1 0 ${(h || 300) * .2}"/></g></svg>`,
    kit: () => `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="300" fill="#f5f5f7"/><rect x="70" y="60" width="260" height="180" rx="22" fill="#fff" stroke="#d2d2d7"/>${[0, 1, 2, 3].map((i) => `<g transform="translate(${104 + (i % 2) * 104} ${92 + Math.floor(i / 2) * 72})"><rect width="88" height="40" rx="15" fill="#f5f5f7" stroke="#c7c7cc"/><circle cx="24" cy="20" r="4" fill="#1d1d1f"/><circle cx="44" cy="20" r="4" fill="#1d1d1f"/><circle cx="64" cy="20" r="4" fill="#1d1d1f"/></g>`).join('')}</svg>`,
    trace: (theme) => `<div class="mini-trace${theme === 'light' ? ' is-light' : ''}"><svg data-trace="force" data-theme="${theme || 'dark'}" aria-hidden="true"></svg><svg data-trace="emg" data-theme="${theme || 'dark'}" aria-hidden="true"></svg></div>`,
  };

  /* ---------- labels shown under every piece ---------- */
  const labels = (L) => `<dl class="ad-labels">${[
    ['Where it runs', L.where], ['Size or limits', L.size], ['Who sees it', L.who], ['Message tested', L.message], ['Call to action', L.cta], ['Landing page', L.landing], ['Number we read', L.metric],
  ].map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;

  const item = (o) => `<article class="hl-item ad-item${o.wide ? ' hl-item--wide' : ''}" data-cl="${o.cl.join(' ')}" data-ch="${o.ch}"><header class="ad-h"><p class="ad-ch">${esc(o.chName)}</p><h3>${esc(o.title)}</h3></header><div class="ad-stage">${o.mock}</div>${labels(o.labels)}</article>`;

  const scale = (inner, w, h) => `<div class="ad-scale" data-w="${w}" data-h="${h}" style="--w:${w}px;--h:${h}px"><div class="ad-scale-in">${inner}</div></div>`;

  const items = [];

  /* 1. 15-second video storyboard, clinical cluster */
  if (C.storyboard) {
    const sb = C.storyboard;
    const frameArt = (i) => (i === 0 ? photo('profiling', 'center 30%') : i === 4 ? photo('platform05') : i === 5 ? art.leg(220) : art.trace());
    items.push({
      wide: true, cl: ['clinical'], ch: 'video', chName: 'Video', title: '15-second video, six frames',
      mock: `<ol class="sb">${sb.frames.map((f, i) => `<li><div class="sb-art">${frameArt(i)}<p class="sb-os">${esc(f.on_screen.split(/\s*Small print:\s*/)[0])}${/Small print:/.test(f.on_screen) ? `<small>${esc(f.on_screen.split(/\s*Small print:\s*/)[1])}</small>` : ''}</p></div><p class="sb-t">${esc(f.time)}</p><p class="sb-v"><b>Picture:</b> ${esc(f.visual)}</p><p class="sb-v"><b>Voice:</b> ${esc(f.voiceover)}</p></li>`).join('')}</ol>`,
      labels: { where: 'LinkedIn and Meta video placements bought through Propensity, shown only to the half of the list that gets ads', size: '15 seconds, square and vertical, captions always on', who: ROLES.clinical, message: AB.clinical, cta: sb.cta, landing: 'Clinical primer page with the 90-second video', metric: 'Interested replies and meetings per 100 clinical contacts, the half that sees ads against the holdout half' },
    });
  }

  /* 2. animated display set at four sizes */
  if (C.display) {
    const D = C.display;
    const unit = (w, h, kind) => {
      const fr = D.frames.map((f, i) => {
        const txt = kind === 'banner' ? f.short : f.long;
        const vis = i === 0 ? `<div class="dsp-v">${photo('calves', 'center 35%')}</div>` : i === 1 ? `<div class="dsp-v">${art.trace()}</div>` : '';
        return `<div class="dsp-f dsp-f${i + 1}">${kind === 'banner' ? '' : vis}<p class="dsp-t">${esc(txt)}</p>${i === 2 ? `<span class="dsp-b">${esc(D.cta)}</span>` : ''}<span class="dsp-brand">NeuroStrip</span></div>`;
      }).join('');
      return `<figure class="dsp"><div class="dsp-u dsp-${kind}" style="width:${w}px;height:${h}px" role="img" aria-label="${w} by ${h} display ad, three frames: ${esc(D.frames.map((f) => (kind === 'banner' ? f.short : f.long)).join('; '))}">${fr}</div><figcaption>${w} × ${h}</figcaption></figure>`;
    };
    items.push({
      wide: true, cl: ['executive', 'operations', 'clinical'], ch: 'display', chName: 'Website banners', title: 'Animated banner set, three frames',
      mock: `<div class="dsp-set">${scale(`<div class="dsp-grid">${unit(300, 250, 'rect')}${unit(160, 600, 'sky')}<div class="dsp-col">${unit(728, 90, 'leader')}${unit(320, 50, 'banner')}</div></div>`, 1240, 640)}</div>`,
      labels: { where: 'Banner spaces on Propensity\'s network of websites, shown only to the half of the list that gets ads', size: '300 × 250, 728 × 90, 160 × 600 and 320 × 50. Three frames over 15 seconds', who: 'All seven roles at groups in the half that gets ads', message: 'No A and B split. The read is what the banners add, the half that sees ads against the holdout half', cta: D.cta, landing: 'Pilot page with the scheduler', metric: 'Booked pilot calls per 100 groups, the half that sees ads against the holdout half' },
    });
  }

  /* 3. five-card carousel, executive cluster */
  if (C.carousel) {
    const K = C.carousel;
    items.push({
      wide: true, cl: ['executive'], ch: 'social', chName: 'LinkedIn and Meta', title: 'Five-card carousel',
      mock: scale(`<div class="sp"><div class="sp-h"><span class="sp-av">CB</span><div><b>Control Bionics</b><i>Sponsored</i></div></div><p class="sp-x">${esc(K.intro)}</p><div class="sp-cards">${K.cards.map((c, i) => `<div class="sp-card"><div class="sp-img">${i === 0 ? photo('homepage') : i === 1 ? art.trace() : i === 2 ? photo('profiling', 'center 30%') : i === 3 ? photo('box') : photo('platform05')}</div><div class="sp-f"><b>${esc(c.headline)}</b><span>${esc(c.sub)}</span></div></div>`).join('')}</div><div class="sp-cta"><span>controlbionics.com</span><span class="sp-btn">${esc(K.cta)}</span></div></div>`, 1060, 560),
      labels: { where: 'LinkedIn and Meta carousel placements bought through Propensity, shown only to the half of the list that gets ads', size: 'Five square cards. LinkedIn shows only a headline on each card, up to 45 characters, so each subline moves into the card image. Meta cuts long headlines, so each card is checked in its preview before launch', who: ROLES.executive, message: AB.executive, cta: K.cta, landing: 'Economics worksheet built from their own visit numbers', metric: 'Worksheets started and meetings booked per 100 executives in the half that sees ads' },
    });
  }

  /* 4. native ad on a physical therapy industry site */
  if (C.native) {
    const N = C.native;
    items.push({
      cl: ['clinical', 'executive'], ch: 'native', chName: 'Sponsored articles', title: 'Sponsored article ad on an industry site',
      mock: scale(`<div class="nat"><div class="nat-site"><span></span><span></span><span></span></div><p class="nat-ctx">${esc(N.context)}</p><div class="nat-ad"><div class="nat-img">${photo('arm')}</div><div><p class="nat-sp">Sponsored · Control Bionics</p><p class="nat-hd">${esc(N.headline)}</p><p class="nat-bd">${esc(N.body)}</p></div></div><div class="nat-lines"><i></i><i></i><i></i></div></div>`, 340, 470),
      labels: { where: 'Native and contextual ads bought through Propensity, shown next to articles on return-to-sport and rehab topics. Which physical therapy sites carry them: confirm with Propensity in week one', size: 'Headline up to 55 characters, body up to 120', who: 'Readers of articles on return to sport and outcomes', message: 'Strength tests can miss compensation', cta: 'Read the clinical primer', landing: 'Clinical primer page', metric: 'Primer reads from target groups, and replies that follow' },
    });
  }

  /* 5. dimensional direct mail box for owners at groups researching now */
  if (C.mail) {
    const M = C.mail;
    items.push({
      wide: true, cl: ['executive'], ch: 'mail', chName: 'Mailed box', title: 'Box for owners at groups researching now',
      mock: `<div class="dm"><figure class="dm-v"><div class="dm-box"><p class="dm-k">NeuroStrip</p><p class="dm-front">${esc(M.box_front)}</p></div><figcaption>Front of the box</figcaption></figure><figure class="dm-v"><div class="dm-in"><p class="dm-lh">${esc(M.letter_headline)}</p>${M.letter_body.map((p) => `<p>${esc(p)}</p>`).join('')}<table class="dm-est">${M.estimate_rows.map((r) => `<tr><td>${esc(r.label)}</td><td>${esc(r.value)}</td></tr>`).join('')}</table><div class="dm-qr"><span class="qr" aria-hidden="true"></span><span>${esc(M.qr_cta)}</span></div></div><figcaption>Inside: the one-page estimate</figcaption></figure><figure class="dm-v"><div class="dm-card"><div class="dm-card-f"><div class="dm-strip"><i></i><i></i><i></i></div><p>${esc(M.card_front)}</p></div><div class="dm-card-b"><p>${esc(M.card_back)}</p></div></div><figcaption>Sample strip card, front and back</figcaption></figure></div>`,
      labels: { where: 'Direct mail through Propensity, sent only after a group starts researching', size: 'A small box with a letter-size estimate and a card holding a sample strip', who: 'Owners at groups that are researching now, capped at 100 boxes so they stay inside the $7,200 small-tests line once the price is quoted in week one', message: 'Patients who can see their progress at each visit have a reason to keep coming back', cta: M.qr_cta, landing: 'Pilot call booking page that shows the group\'s estimate', metric: 'Code scans and booked calls per 100 boxes. Each box is priced in week one' },
    });
  }

  /* 6. geofenced mobile ad at the Combined Sections Meeting */
  if (C.geofence) {
    const G = C.geofence;
    items.push({
      cl: ['clinical', 'executive', 'operations'], ch: 'mobile', chName: 'Conference phone ad', title: 'Phone ad at the Combined Sections Meeting',
      mock: scale(`<div class="geo"><div class="geo-img">${photo('lifestyle', 'center 40%')}</div><div class="geo-c"><p class="geo-k">APTA CSM · Philadelphia · February 4 to 6</p><p class="geo-h">${esc(G.headline)}</p><p class="geo-b">${esc(G.body)}</p><span class="geo-btn">${esc(G.cta)}</span></div></div>`, 320, 480),
      labels: { where: 'Phones inside a geofence, an ad area drawn around the Philadelphia convention center, during the American Physical Therapy Association Combined Sections Meeting (APTA CSM), February 4 to 6, 2027, through Propensity', size: '320 × 480, with a 320 × 50 version', who: 'Anyone inside the geofence. Most are physical therapists attending the meeting', message: 'A 60-second activation test at the booth', cta: G.cta, landing: 'Booth booking page', metric: 'Booth tests and meetings booked during the show' },
    });
  }

  /* 7. responsive search ads, one per keyword cluster, with landing page */
  const rsaWarn = [];
  (C.rsa || []).forEach((r) => {
    const hs = r.headlines.map((h) => ({ t: h, n: h.length, over: h.length > LIMITS.headline }));
    const ds = r.descriptions.map((h) => ({ t: h, n: h.length, over: h.length > LIMITS.description }));
    hs.concat(ds).filter((x) => x.over).forEach((x) => rsaWarn.push(`${r.cluster}: "${x.t}" is ${x.n} characters`));
    const name = { category: 'Category search', competitor: 'Competitor search', problem: 'Problem search' }[r.cluster] || r.cluster;
    items.push({
      wide: true, cl: ['executive', 'operations', 'clinical'], ch: 'search', chName: 'Google Search', title: `${name} ad and landing page`,
      mock: `<div class="rsa"><div class="rsa-res"><p class="rsa-q">${esc(r.keywords[0])}</p><p class="rsa-sp">Sponsored</p><p class="rsa-url">${esc(r.path)}</p><p class="rsa-hd">${esc(hs.slice(0, 3).map((h) => h.t).join(' | '))}</p><p class="rsa-ds">${esc(ds[0] ? ds[0].t : '')} ${esc(ds[1] ? ds[1].t : '')}</p></div><div class="rsa-lp"><p class="rsa-lp-k">Landing page</p><p class="rsa-lp-h">${esc(r.landing.headline)}</p><p class="rsa-lp-s">${esc(r.landing.sub)}</p><div class="rsa-form"><span>Name</span><span>Work email</span><span>Practice</span><span>Number of clinics</span></div><span class="rsa-btn">${esc(r.landing.cta)}</span></div><details class="rsa-all"><summary>All ${hs.length} headlines and ${ds.length} descriptions, with character counts</summary><ul>${hs.map((h) => `<li class="${h.over ? 'over' : ''}"><span>${esc(h.t)}</span><b>${h.n}/${LIMITS.headline}</b></li>`).join('')}</ul><ul>${ds.map((h) => `<li class="${h.over ? 'over' : ''}"><span>${esc(h.t)}</span><b>${h.n}/${LIMITS.description}</b></li>`).join('')}</ul><p class="rsa-kw">Keywords: ${esc(r.keywords.join(', '))}</p></details></div>`,
      labels: { where: `Google Search, ${name.toLowerCase()} keywords`, size: 'Headlines up to 30 characters, descriptions up to 90', who: 'People searching these terms, most of them clinicians and owners', message: r.cluster === 'competitor' ? 'Four muscles at once, wireless, with a record you can document' : r.cluster === 'problem' ? 'Strength tests can miss compensation' : 'Wireless muscle sensing for the clinic', cta: r.landing.cta, landing: r.landing.headline, metric: '35% or more of search leads accepted by sales' },
    });
  });
  if (rsaWarn.length) console.warn('Search ads over the character limit:', rsaWarn);
  window.NSU.rsaCheck = { ok: rsaWarn.length === 0, issues: rsaWarn };

  /* 8. four-email sequence per cluster */
  (C.emails || []).forEach((e) => {
    const bv = (e.b_variant || []).length ? `<div class="em-alt"><p class="em-alt-k">Contacts assigned message B get these as emails 1 and 2 instead:</p>${e.b_variant.map((s, i) => `<p class="em-d">Email ${i + 1} · message B version</p><p class="em-s">${esc(s.subject)}</p><p class="em-b">${esc(s.body)}</p>`).join('')}</div>` : '';
    const emr = e.emr_variant && e.emr_variant.subject ? `<div class="em-alt"><p class="em-alt-k">If Bombora shows the group researching a move to a new electronic medical record (EMR) system, email 1 becomes, for either version:</p><p class="em-s">${esc(e.emr_variant.subject)}</p><p class="em-b">${esc(e.emr_variant.body)}</p></div>` : '';
    items.push({
      wide: true, cl: [e.cluster], ch: 'email', chName: 'Email', title: `${CL[e.cluster]} email sequence`,
      mock: `<div class="em">${e.steps.map((s, i) => `<div class="em-m"><p class="em-d">Email ${i + 1} · sequence week ${s.week}${i < 2 ? ' · message A version' : ' · same for everyone'}</p><p class="em-s">${esc(s.subject)}</p><p class="em-b">${esc(s.body)}</p></div>`).join('')}${bv}${emr}</div>`,
      labels: { where: 'Outbound email from the rep, both halves of the list', size: 'Four plain-text emails, each under 110 words, in sequence weeks 1, 3, 4 and 6. Each contact gets one assigned message in emails 1 and 2',  who: ROLES[e.cluster], message: AB[e.cluster], cta: 'Reply, or book a time on the calendar', landing: 'None. Replies go to the rep, and the calendar link books a call', metric: 'Interested replies from 1.5% or more of contacts, the rate the plan counts on, and meetings booked' },
    });
  });

  track.innerHTML = items.map(item).join('');

  /* photos sit in scaled frames inside a scroller, where native lazy loading never fires: load them as the section comes near */
  const wake = () => $$('img[loading="lazy"]', track).forEach((img) => { img.loading = 'eager'; });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { wake(); io.disconnect(); } }, { rootMargin: '800px 0px' });
    io.observe(track);
  } else wake();

  /* ---------- line, clusters and the learn-more text ---------- */
  const line = $('#campaignLine');
  if (line) line.textContent = C.sub || C.line;
  const cc = $('#campaignClusters');
  if (cc) cc.innerHTML = (C.clusters || []).map((c) => `<div class="tile"><p class="tile-k">${CL[c.cluster]} cluster</p><p class="tile-l">${esc(c.headline)}</p></div>`).join('');
  const more = $('#campaignMore');
  if (more) more.innerHTML = `<h4>The idea</h4><p>${esc(C.idea)}</p><h4>What each cluster is tested on</h4><table class="tbl tbl--stack"><thead><tr><th>Cluster</th><th>Message A</th><th>Message B</th></tr></thead><tbody>${(C.clusters || []).map((c) => `<tr><td>${CL[c.cluster]}</td><td data-l="Message A">${esc(c.message_a)}</td><td data-l="Message B">${esc(c.message_b)}</td></tr>`).join('')}</tbody></table><h4>Rules every piece follows</h4><ul class="dots"><li>Every claim stays inside NeuroStrip's registration as a non-diagnostic measurement and biofeedback tool.</li><li>The 7% and 37% case appears only as one athlete's example.</li><li>No testimonials, quotes, customer names or logos until Control Bionics clears them.</li><li>Search ads never put a competitor's brand name in the ad text.</li><li>Every link carries tracking tags, so Salesforce records where each lead came from.</li></ul>`;

  /* ---------- filters ---------- */
  const clusters = [['all', 'All buyers'], ['executive', 'Executive'], ['operations', 'Operations'], ['clinical', 'Clinical']];
  const chans = [['all', 'All channels']].concat([...new Map(items.map((o) => [o.ch, o.chName])).entries()]);
  const fc = $('#cfCluster'), fh = $('#cfChannel'), count = $('#adsCount');
  let fC = 'all', fH = 'all';
  fc.innerHTML = clusters.map(([k, v]) => `<button type="button" data-k="${k}" aria-pressed="${k === fC}">${v}</button>`).join('');
  fh.innerHTML = chans.map(([k, v]) => `<button type="button" data-k="${k}" aria-pressed="${k === fH}">${v}</button>`).join('');
  let api = null;
  function apply() {
    let n = 0;
    $$('.ad-item', track).forEach((el) => {
      const show = (fC === 'all' || el.dataset.cl.split(' ').includes(fC)) && (fH === 'all' || el.dataset.ch === fH);
      el.hidden = !show;
      if (show) n++;
    });
    count.textContent = `Showing ${n} of ${items.length} pieces.`;
    if (api) api.rebuild();
    fit();
  }
  fc.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; fC = b.dataset.k; $$('button', fc).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); apply(); });
  fh.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; fH = b.dataset.k; $$('button', fh).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); apply(); });

  /* ---------- scale true-size mockups down to fit small screens ---------- */
  function fit() {
    $$('.ad-scale', track).forEach((s) => {
      const host = s.parentElement;
      const w = +s.dataset.w, h = +s.dataset.h;
      const avail = host.clientWidth || w;
      const k = Math.min(1, avail / w);
      s.style.setProperty('--k', k.toFixed(4));
      s.style.height = Math.ceil(h * k) + 'px';
    });
  }
  window.addEventListener('resize', fit);

  window.NSU.ready(() => {
    const root = $('#ads');
    api = window.NSU.carousel(root);
    apply();
  });
})();
