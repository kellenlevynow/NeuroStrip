/* Strategy data for the NeuroStrip 90-day demand plan.
   Edit here, not in the markup: the interactive modules render from this file. */
window.NS = {
  /* ------------------------------------------------------------------ */
  /* Evidence registry                                                   */
  /* ------------------------------------------------------------------ */
  sources: {
    s1:  { t: 'NeuroStrip product page', p: 'Control Bionics', d: 'viewed Oct 11, 2026', u: 'https://controlbionics.com/neurostrip/', k: 'Company' },
    s2:  { t: 'Sports Performance and Return to Play', p: 'Control Bionics', d: 'viewed Oct 11, 2026', u: 'https://controlbionics.com/sports-performance/', k: 'Company' },
    s3:  { t: 'Rehabilitation', p: 'Control Bionics', d: 'viewed Oct 11, 2026', u: 'https://controlbionics.com/rehabilitation/', k: 'Company' },
    s4:  { t: 'Research and Data', p: 'Control Bionics', d: 'viewed Oct 11, 2026', u: 'https://controlbionics.com/research-data/', k: 'Company' },
    s5:  { t: 'Contact page and embedded form', p: 'Control Bionics', d: 'viewed Oct 11, 2026', u: 'https://controlbionics.com/contact-us/', k: 'Company' },
    s7:  { t: 'Advancing Human Performance: Control Bionics Showcases NeuroStrip at PEAK 2026', p: 'Control Bionics', d: 'May 6, 2026', u: 'https://controlbionics.com/advancing-human-performance-control-bionics-showcases-neurostrip-at-peak-2026/', k: 'Company' },
    s8:  { t: 'NeuroStrip CE Marked for Sale Across Europe', p: 'ASX announcement, Control Bionics', d: 'Oct 5, 2026', u: 'https://announcements.asx.com.au/asxpdf/20261005/pdf/074y03t5vby29q.pdf', k: 'Filing' },
    s9:  { t: 'Commercial Momentum and Pipeline Progress', p: 'ASX announcement, Control Bionics', d: 'June 4, 2026', u: 'https://announcements.asx.com.au/asxpdf/20260604/pdf/0709b7ps5nk305.pdf', k: 'Filing' },
    s10: { t: '2026 Annual Report', p: 'Control Bionics, via Listcorp', d: 'Aug 2026', u: 'https://www.listcorp.com/asx/cbl/control-bionics-limited/news/2026-annual-report-3397413.html', k: 'Filing' },
    s11: { t: "Dr Boreham's Crucible: Control Bionics", p: 'Biotech Daily', d: 'Aug 28, 2026', u: 'https://www.biotechdaily.com.au/wp/wp-content/uploads/2026/08/CBL-Aug-28-2026.pdf', k: 'Press' },
    s12: { t: 'Control Bionics secures FDA registration for NeuroStrip wearable platform', p: 'Small Caps', d: 'Aug 4, 2026', u: 'https://smallcaps.com.au/article/control-bionics-secures-fda-registration-for-neurostrip-wearable-platform', k: 'Press' },
    s13: { t: 'Control Bionics targets commercial expansion with new capital raising', p: 'Kalkine', d: 'June 25, 2026', u: 'https://kalkine.com.au/news/healthcare/control-bionics-asxcbl-targets-commercial-expansion-with-new-capital-raising', k: 'Press' },
    s14: { t: 'Demand Generation Manager job posting', p: 'Control Bionics, via Indeed', d: 'viewed Oct 7, 2026', u: 'https://www.indeed.com/viewjob?jk=a1e86aff9a1eecaa', k: 'Company' },
    s15: { t: 'First conversation with James Rowe', p: 'Not public', d: 'Sept 23, 2026', u: '', k: 'Conversation' },
    s16: { t: "Hamstring injury rates have increased during recent seasons and now constitute 24% of all injuries in men's professional football", p: 'Ekstrand et al., British Journal of Sports Medicine 57(5):292', d: '2023', u: 'https://bjsm.bmj.com/content/57/5/292', k: 'Research' },
    s17: { t: 'Risk of Secondary Injury in Younger Athletes After Anterior Cruciate Ligament Reconstruction', p: 'Wiggins et al., American Journal of Sports Medicine 44(7):1861-1876', d: '2016', u: 'https://doi.org/10.1177/0363546515621554', k: 'Research' },
    s18: { t: 'Rethinking the Assessment of Arthrogenic Muscle Inhibition After ACL Reconstruction', p: 'Forelli et al., Journal of Clinical Medicine 14(8):2633', d: '2025', u: 'https://doi.org/10.3390/jcm14082633', k: 'Research' },
    s19: { t: 'Effectiveness of therapeutic electromyographic biofeedback after orthopedic knee surgeries: a systematic review', p: 'Karaborklu Argut et al., Disability and Rehabilitation 44(14):3364-3372', d: '2022', u: 'https://doi.org/10.1080/09638288.2020.1867904', k: 'Research' },
    s20: { t: 'Expectation vs. Reality: Why Patients Really Drop Out of Therapy', p: 'WebPT', d: 'Aug 29, 2017', u: 'https://www.webpt.com/blog/expectation-vs-reality-why-patients-really-drop-out-of-therapy', k: 'Market' },
    s21: { t: 'Physical Therapy Market Overview', p: 'Stifel', d: 'July 2025', u: 'https://www.stifel.com/Newsletters/InvestmentBanking/BAL/Marketing/Healthcare/PhysicalTherapy/2025/PT_MarketOverview072025.pdf', k: 'Market' },
    s22: { t: 'US outpatient PT market, mapped', p: 'Orbital', d: 'June 2026', u: 'https://www.withorbital.com/data/largest-physical-therapy-chains-in-the-us/', k: 'Market' },
    s23: { t: 'USPH Reports Second Quarter 2026 Results', p: 'U.S. Physical Therapy, via Business Wire', d: 'Aug 5, 2026', u: 'https://www.businesswire.com/news/home/20260805033144/en/', k: 'Market' },
    s24: { t: 'Occupational Outlook Handbook: Physical Therapists', p: 'U.S. Bureau of Labor Statistics', d: '2025 data', u: 'https://www.bls.gov/ooh/healthcare/physical-therapists.htm', k: 'Market' },
    s25: { t: 'Occupational Outlook Handbook: Athletic Trainers', p: 'U.S. Bureau of Labor Statistics', d: '2025 data', u: 'https://www.bls.gov/ooh/healthcare/athletic-trainers.htm', k: 'Market' },
    s26: { t: 'Combined Sections Meeting: future dates', p: 'American Physical Therapy Association', d: 'viewed Oct 11, 2026', u: 'https://csm.apta.org/future-dates', k: 'Market' },
    s27: { t: 'Best Physical Therapy Conferences in the US (2026-2027 Guide)', p: 'Physitrack', d: 'Aug 30, 2026', u: 'https://www.physitrack.com/en-ca/insights/best-physical-therapy-conferences-us', k: 'Market' },
    s28: { t: 'NFL moves start of Scouting Combine to March in 2027', p: 'Buccaneers.com', d: 'July 7, 2026', u: 'https://www.buccaneers.com/news/nfl-moves-start-of-scouting-combine-to-march-in-2027', k: 'Market' },
    s29: { t: 'B2B LinkedIn Ads Benchmarks 2026', p: '42 Agency (87 B2B accounts, Campaign Manager exports)', d: 'June 13, 2026', u: 'https://intel.42agency.com/b2b-benchmarks/linkedin-ads-benchmarks/', k: 'Benchmark' },
    s30: { t: '2026 Google Ads Benchmarks', p: 'WordStream by LocaliQ (13,474 US search campaigns)', d: 'updated May 19, 2026', u: 'https://www.wordstream.com/blog/2026-google-ads-benchmarks', k: 'Benchmark' },
    s31: { t: 'Email Sequence Benchmarks 2026', p: 'Instantly (vendor data)', d: 'Mar 30, 2026', u: 'https://instantly.ai/blog/email-sequence-benchmarks-2026-whats-a-good-open-rate-reply-rate-and-cost-per-meeting/', k: 'Benchmark' },
    s32: { t: 'Biofeedback devices and bundles (list prices)', p: 'mTrigger', d: 'viewed Oct 11, 2026', u: 'https://mtrigger.com/collections/biofeedback-devices-bundles', k: 'Market' },
    s33: { t: 'Kinvent K-Myo Duo Pack (list price)', p: 'Lafayette Evaluation', d: 'viewed Oct 11, 2026', u: 'https://lafayetteevaluation.com/products/kinvent-k-myo-duo-pack', k: 'Market' },
    s34: { t: 'EMG system price comparison', p: 'easyEMG (vendor guide)', d: 'Sept 2026', u: 'https://easyemg.de/en/emg-price-comparison/', k: 'Market' },
    s35: { t: 'National Coverage Determination 30.1: Biofeedback Therapy', p: 'Centers for Medicare and Medicaid Services', d: 'current', u: 'https://www.cms.gov/medicare-coverage-database/view/ncd.aspx?ncdid=41', k: 'Market' },
    s36: { t: "Men's European Football Injury Index 2024/25", p: 'Howden', d: 'Jan 19, 2026', u: 'https://www.howdengroup.com/au-en/reports/mens-european-football-injury-index-202425', k: 'Market' },
    s37: { t: 'The 95:5 rule: why B2B growth starts long before the purchase', p: 'Ehrenberg-Bass Institute', d: 'viewed Oct 11, 2026', u: 'https://marketingscience.info/the-955-rule-why-b2b-growth-starts-long-before-the-purchase', k: 'Benchmark' },
    s38: { t: "Software innovator VALD's elite sports technology making inroads in health sector", p: 'Business News Australia', d: '2022', u: 'https://direct.businessnewsaustralia.com/articles/software-innovator-vald-s-elite-sports-technology-making-inroads-in-health-sector.html', k: 'Market' },
    s39: { t: 'The Short Life of Online Sales Leads', p: 'Oldroyd, McElheran and Elkington, Harvard Business Review', d: 'March 2011', u: 'https://hbr.org/2011/03/the-short-life-of-online-sales-leads', k: 'Benchmark' },
    s40: { t: 'How to set up a Salesforce integration', p: 'Google Ads Help', d: 'viewed Oct 11, 2026', u: 'https://support.google.com/google-ads/answer/13548778', k: 'Platform' },
    s45: { t: 'Ad library check: no active Meta or Google ads found', p: 'Kellen Levy, observation', d: 'Sept 2026, re-check before presenting', u: '', k: 'Observation' },
    s46: { t: 'Automated crawl of controlbionics.com', p: 'Kellen Levy, observation', d: 'Oct 11, 2026, confirm in a browser before acting', u: '', k: 'Observation' },
    s47: { t: 'NSCA national conferences', p: 'National Strength and Conditioning Association', d: 'viewed Oct 11, 2026', u: 'https://dxpprod.nsca.com/events/national-conferences', k: 'Market' }
  },

  assumptions: {
    a1:  { t: 'Day 1 is around December 1, 2026.', v: 'Confirm at offer. The roadmap date overlay recalculates for any start date.' },
    a2:  { t: 'A 90-day program budget between $45K and $150K, with $90K as the base case. It excludes salaries, event costs and the existing outbound retainer.', v: 'Confirm in week one. The percentage allocation holds at any level and the model rescales.' },
    a3:  { t: 'Roughly 1,000 PT groups sit in the 5 to 25 location band. About 10,000 clinics at 6 to 15 locations each gives 700 to 1,700 groups.', v: 'Build and count the account list in weeks 1 and 2 from a clinic database plus website checks.' },
    a4:  { t: 'One inside-sales rep can hold 20 to 25 discovery calls a week alongside follow-up.', v: 'Confirm with sales in week one, then watch held calls and follow-up load weekly.' },
    a5:  { t: 'A structured 30-day pilot at one clinic can replace open-ended three to four month trials for most PT groups.', v: 'Walk the pilot blueprint through sales and three trial customers in weeks 1 and 2.' },
    a6:  { t: 'Planning rates: 55% of held calls become SQLs, 45% of SQLs start a pilot, 50% of pilots convert to paid.', v: 'Replace with actuals from the 12-month trial backfill by Day 30.' },
    a7:  { t: 'Planning first-year contract value of $7,500, inside the published $3,500 to $20,000+ range.', v: 'Pull first-year values from closed trials during the backfill.' },
    a8:  { t: 'Channel costs start from published 2026 benchmarks, not Control Bionics data. LinkedIn: $276 a lead on average, $400 to $600 in healthcare technology. Search: $5.42 a click and 8.2% click-to-lead across industries, $6.17 and 6.9% in health and fitness.', v: 'Replaced by live account data within two weeks of launch.' },
    a9:  { t: 'Fewer than 200 top-flight US professional teams across the major leagues, and roughly 1,100 NCAA member schools, of which about 350 compete in Division I.', v: 'Count from league and NCAA directories when the sports list is built.' },
    a10: { t: 'Sales Cloud and Account Engagement are both licensed and connected.', v: 'Week-one audit of editions, connector status and admin access.' },
    a11: { t: 'The existing outbound program continues and can be re-briefed.', v: 'Working session with the outbound partner in week one.' },
    a12: { t: 'Event costs (booth, travel, sponsorship) sit in a separate budget.', v: 'Confirm with James in week one.' },
    a13: { t: 'Clinic executives are hard to reach from about December 21 to January 1.', v: 'Planning convention. Watch reply and booking rates by week.' },
    a14: { t: 'Outbound yields about 0.9 held calls per 100 contacts sequenced (1.5% positive reply, 60% of those hold). The published average for all replies is 3.4%.', v: 'Measured per sequence from week five.' },
    a15: { t: 'Independent and small-group clinics outside the 5 to 25 band number roughly 22,000 (about 32,000 under 25 clinics, less the 10,000 in the band).', v: 'Derived from two sources that were not built to be combined. Recount from the clinic database.' },
    a16: { t: 'About four held calls a week already arrive without paid media, through site inquiries, referrals and the sports lane. This is a placeholder for the current run rate.', v: 'Count held calls by source for the last eight weeks during the week-one audit.' }
  },

  hypotheses: {
    h1:  { t: 'The barrier is not awareness of NeuroStrip. Buyers believe their output tests already answer the readiness question.', v: 'Week-one customer interviews, search volume on category terms, and engagement on reframing creative versus product-led creative.' },
    h2:  { t: 'Tier A accounts already invested in objective testing convert faster than those that are not.', v: 'Tag the signal on every account and compare sales-accepted and pilot rates at Day 90.' },
    h3:  { t: 'Entering an account through both the clinical champion and the executive produces more pilots than the executive alone.', v: 'Experiment 2.' },
    h4:  { t: 'LinkedIn air cover lifts outbound positive-reply rate by 20% or more in warmed accounts.', v: 'Account-level holdout, experiment 4.' },
    h5:  { t: 'The split-screen trace beats every other creative territory on engagement from Tier A accounts.', v: 'Experiments 1 and 7.' },
    h6:  { t: 'A 60-second asymmetry test at the booth turns visitors into booked calls at a higher rate than a badge scan.', v: 'At CSM, compare booked-call rate for tested contacts against scanned-only contacts.' },
    h7:  { t: 'A structured 30-day pilot converts to paid at 50% or better.', v: 'Pilot board. First read when the first pilot cohort completes.' },
    h8:  { t: 'Educator and newsletter placements reach clinical champions at a lower cost per sales-accepted call than paid social.', v: 'Experiment 11.' },
    h9:  { t: 'Elite-sport proof helps PT buyers instead of making the product feel out of reach.', v: 'Experiment 9.' },
    h10: { t: 'Visible biofeedback improves plan-of-care completion enough to anchor the executive business case.', v: 'Pilot success criteria: visits per case for pilot patients against the clinic baseline.' },
    h11: { t: 'PT owners are most open to a retention conversation in January, when new deductibles soften visit volume.', v: 'Compare reply and booking rates by week through the first quarter.' },
    h12: { t: 'Qualified-stage feedback to the ad platforms lowers cost per sales-accepted call within 30 days of switching it on.', v: 'Before and after comparison from week 12, same budgets.' }
  },

  /* ------------------------------------------------------------------ */
  /* Audience matrix                                                     */
  /* ------------------------------------------------------------------ */
  audience: {
    dims: [
      { id: 'scale',    name: 'Scale',    w: 25, crit: ['size', 'ltv'],                 help: 'How many accounts and how much each can grow.' },
      { id: 'access',   name: 'Access',   w: 20, crit: ['authority', 'reach', 'cac'],  help: 'Can we reach someone who can say yes, at a sane cost.' },
      { id: 'velocity', name: 'Velocity', w: 20, crit: ['cycle', 'speed', 'demo'],     help: 'How fast a first touch becomes pipeline.' },
      { id: 'urgency',  name: 'Urgency',  w: 15, crit: ['pain', 'aware'],              help: 'How much it hurts and whether they know why.' },
      { id: 'leverage', name: 'Leverage', w: 10, crit: ['referral'],                   help: 'Referral and halo value beyond the deal itself.' },
      { id: 'friction', name: 'Low friction', w: 10, crit: ['compete', 'cred', 'comply'], help: 'Competition, proof burden and compliance. Higher is easier.' }
    ],
    crit: {
      size: 'Market attractiveness', ltv: 'Potential LTV', pain: 'Pain intensity', aware: 'Awareness level',
      authority: 'Buying authority', reach: 'Digital accessibility', cac: 'Potential CAC', cycle: 'Sales-cycle speed',
      speed: 'Speed to pipeline', demo: 'Ease of demonstrating value', referral: 'Referral potential',
      compete: 'Competitive environment', cred: 'Credibility burden', comply: 'Regulatory and compliance'
    },
    presets: [
      { id: 'engine', name: 'Demand engine', note: 'What a repeatable 20-call week needs.', w: { scale: 25, access: 20, velocity: 20, urgency: 15, leverage: 10, friction: 10 } },
      { id: 'halo',   name: 'Halo and urgency', note: 'If logos matter more than volume.', w: { scale: 10, access: 10, velocity: 20, urgency: 30, leverage: 25, friction: 5 } },
      { id: 'speed',  name: 'Speed above all', note: 'If the only goal is the fastest first deals.', w: { scale: 10, access: 25, velocity: 40, urgency: 10, leverage: 5, friction: 10 } }
    ],
    segments: [
      { id: 'pt_regional', name: 'Regional PT groups', sub: '5 to 25 locations, sports and ortho mix', roles: ['Buyer', 'User'], lane: 'Volume engine', share: 70, tone: 'go',
        s: { size: 4, ltv: 5, pain: 3, aware: 2, authority: 4, reach: 4, cac: 3, cycle: 3, speed: 4, demo: 4, referral: 4, compete: 3, cred: 3, comply: 3 },
        n: { scale: 'About 10,000 clinics in the band. One site can become 25 on the same contract.', access: 'A clinician sits on the leadership team. Titles and company lists are targetable.', velocity: 'Live biofeedback lands in minutes. The economics need a 30-day pilot.', urgency: 'Drop-off and thin margins are a chronic ache. Few know the activation gap exists.', leverage: 'Owners trade notes in peer groups. Clinicians carry tools between clinics.', friction: 'Cheaper biofeedback boxes exist. Billing language needs care.' } },
      { id: 'sport_elite', name: 'Elite and pro sport', sub: 'Teams, leagues, national bodies', roles: ['Buyer', 'User', 'Referral source'], lane: 'Proof lane', share: 20, tone: 'proof',
        s: { size: 2, ltv: 3, pain: 5, aware: 4, authority: 4, reach: 2, cac: 3, cycle: 3, speed: 3, demo: 5, referral: 5, compete: 3, cred: 3, comply: 4 },
        n: { scale: 'A few hundred organizations worldwide. Small unit counts per team.', access: 'Performance leads can buy, but the audience is tiny and relationship-driven. Ads cannot find it at scale.', velocity: 'The trace sells itself in one meeting. Trials have run three to four months.', urgency: 'Return-to-play is a weekly, high-stakes call and staff already know EMG.', leverage: 'The strongest halo there is. Staff move between clubs and take tools with them.', friction: 'Crowded tech stacks and tech fatigue. No billing claims to manage.' } },
      { id: 'sport_college', name: 'College athletics', sub: 'Sports medicine and performance departments', roles: ['Buyer', 'User'], lane: 'Proof lane', share: 0, tone: 'proof',
        s: { size: 3, ltv: 4, pain: 4, aware: 3, authority: 3, reach: 3, cac: 3, cycle: 2, speed: 3, demo: 5, referral: 4, compete: 3, cred: 3, comply: 3 },
        n: { scale: 'About 1,100 NCAA schools. One department can run dozens of devices across teams.', access: 'Head athletic trainers are findable. Money moves through athletics budgets.', velocity: 'Great demo. Purchases bunch around the July fiscal year.', urgency: 'Rosters are large and return-to-play calls are constant.', leverage: 'Conference peers copy each other. Staff feed the pro ranks.', friction: 'Student-athlete data and research approvals where studies are involved.' } },
      { id: 'pt_indie', name: 'Independent clinics', sub: '1 to 4 locations, owner-operators', roles: ['Buyer', 'User'], lane: 'Capture', share: 0, tone: 'hold',
        s: { size: 5, ltv: 2, pain: 3, aware: 2, authority: 5, reach: 3, cac: 2, cycle: 5, speed: 5, demo: 4, referral: 3, compete: 2, cred: 3, comply: 3 },
        n: { scale: 'The largest count of clinics, the smallest contract and little room to expand.', access: 'The owner decides alone. Hard to isolate on LinkedIn, and a small deal cannot carry a big acquisition cost.', velocity: 'Can say yes on the first call.', urgency: 'Same pressures as larger groups, less time to act on them.', leverage: 'Local word of mouth.', friction: 'The most price-sensitive buyer. A $499 biofeedback unit is the default comparison.' } },
      { id: 'perf_fac', name: 'Performance facilities', sub: 'Private training centers and club programs', roles: ['Buyer', 'User'], lane: 'Capture', share: 0, tone: 'hold',
        s: { size: 4, ltv: 2, pain: 3, aware: 2, authority: 5, reach: 4, cac: 3, cycle: 4, speed: 4, demo: 4, referral: 3, compete: 3, cred: 3, comply: 3 },
        n: { scale: 'Thousands of facilities, modest contract sizes.', access: 'Owner-led and easy to reach on Meta and Instagram.', velocity: 'Quick decisions when a program can be sold to parents.', urgency: 'They need a differentiated program more than a measurement tool.', leverage: 'Local reputation and club networks.', friction: 'Performance-gain claims and work with minors need careful substantiation.' } },
      { id: 'pt_enterprise', name: 'Enterprise and health-system rehab', sub: '50+ locations, hospital outpatient', roles: ['Committee buyer'], lane: 'Later', share: 0, tone: 'later',
        s: { size: 5, ltv: 5, pain: 3, aware: 2, authority: 1, reach: 3, cac: 2, cycle: 1, speed: 1, demo: 3, referral: 4, compete: 3, cred: 2, comply: 2 },
        n: { scale: 'The largest contracts in the market.', access: 'Committees, procurement and security reviews stand between a champion and a signature.', velocity: 'Adoption is measured in quarters.', urgency: 'Same clinical pain, diffused across layers.', leverage: 'A flagship logo moves the regional groups.', friction: 'Value-analysis committees, data agreements and evidence thresholds.' } },
      { id: 'neuro_research', name: 'Neuro rehab and research', sub: 'Stroke and spinal programs, university labs', roles: ['Buyer', 'Influencer'], lane: 'Capture', share: 0, tone: 'hold',
        s: { size: 2, ltv: 3, pain: 3, aware: 4, authority: 3, reach: 3, cac: 4, cycle: 2, speed: 2, demo: 3, referral: 3, compete: 2, cred: 2, comply: 3 },
        n: { scale: 'Small in count, steady in spend.', access: 'They search by specification, so paid search finds them cheaply.', velocity: 'Grant and study timelines set the pace.', urgency: 'They know EMG well and know what they dislike about lab rigs.', leverage: 'Publications become evidence for every other segment.', friction: 'Incumbent research systems are entrenched and specs are scrutinized.' } },
      { id: 'physicians', name: 'Referring physicians', sub: 'Orthopedic and sports medicine', roles: ['Influencer', 'Referral source'], lane: 'Later', share: 0, tone: 'later',
        s: { size: 3, ltv: 2, pain: 3, aware: 2, authority: 2, reach: 2, cac: 2, cycle: 2, speed: 2, demo: 3, referral: 5, compete: 3, cred: 1, comply: 2 },
        n: { scale: 'Not a buyer in most cases.', access: 'Hard to reach and rarely the purchaser.', velocity: 'Slow, evidence-led.', urgency: 'They want objective progress reports from the clinics they refer to.', leverage: 'They decide which clinic gets the patient. That is the prize.', friction: 'The highest evidence bar of any audience.' } },
      { id: 'patients', name: 'Patients, athletes and families', sub: 'People recovering from injury, parents, caregivers', roles: ['End user', 'Influencer'], lane: 'No spend', share: 0, tone: 'no',
        s: { size: 5, ltv: 1, pain: 5, aware: 1, authority: 1, reach: 5, cac: 1, cycle: 1, speed: 1, demo: 2, referral: 2, compete: 3, cred: 2, comply: 1 },
        n: { scale: 'Millions of people, none of whom can buy a clinic system.', access: 'Cheap to reach, impossible to convert without a clinic in the middle.', velocity: 'No direct path to revenue.', urgency: 'The pain is theirs. The purchase is not.', leverage: 'Later, as pull-through: "ask whether your clinic measures activation."', friction: 'Consumer health claims carry the heaviest regulatory exposure.' } }
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Awareness ladder                                                    */
  /* ------------------------------------------------------------------ */
  ladder: [
    { n: 1, stage: 'Unaware', mind: '"We test strength. We\'re fine."',
      message: 'Strength tests measure output. Compensation hides in the output.',
      angle: 'Pattern interrupt. Two graphs side by side: the limbs look even on force and uneven on activation.',
      format: '20-second silent-captioned video, a two-graph still, a clinician-voiced post.',
      cta: 'See the trace. Ungated, no form.',
      channel: 'LinkedIn to named accounts. Meta and Instagram to uploaded clinician contact lists.',
      behavior: 'Watches past the halfway point. Clicks through to the explainer.',
      metric: 'Share of Tier A accounts reached three or more times. Cost per engaged account.',
      sport: 'Sport version: "Cleared on force. Not cleared on activation."' },
    { n: 2, stage: 'Problem aware', mind: '"Patients plateau, re-injure or stop coming."',
      message: 'The deficit you cannot see is the one that comes back.',
      angle: 'Evidence-led. Recurrence and re-injury data, then one anonymized case.',
      format: 'Field guide as a document ad, a four-minute article, nurture email one.',
      cta: 'Read the field guide.',
      channel: 'LinkedIn document ads, email, search on problem terms.',
      behavior: 'Reads past page three. Returns to the site within a week.',
      metric: 'Engaged accounts, read depth, growth of the retargeting pool.',
      sport: 'Sport version leads with the two-month window after return to play.' },
    { n: 3, stage: 'Solution aware', mind: '"Maybe we should measure activation."',
      message: 'Surface EMG shows activation live. It used to need a lab.',
      angle: 'Old way and new way. Straps, wires and a specialist, next to a 4-gram strip and an iPad.',
      format: '90-second demo, a 12-minute clinical primer.',
      cta: 'Watch the 90-second demo.',
      channel: 'Search, YouTube and Meta retargeting, LinkedIn video.',
      behavior: 'Finishes the demo. Registers for the primer.',
      metric: 'Demo completions from Tier A accounts. Registrations by tier.',
      sport: 'Sport version shows field use across a full session.' },
    { n: 4, stage: 'Category aware', mind: '"Which sEMG option fits us?"',
      message: 'Four muscles at once, no wires, a record you can document.',
      angle: 'Which tool for which job. Plain comparison, including where a cheaper box is enough.',
      format: 'Comparison page, buyer\'s guide, spec sheet.',
      cta: 'Get the buyer\'s guide.',
      channel: 'Search on category and competitor terms, retargeting.',
      behavior: 'Views comparison and pricing guidance. Downloads the guide.',
      metric: 'High-intent page views from Tier A accounts. Search lead to sales-accepted rate.',
      sport: 'Sport version compares against lab EMG and force-only testing.' },
    { n: 5, stage: 'NeuroStrip aware', mind: '"Would it work in a clinic like ours?"',
      message: 'Here is what happened in a clinic like yours.',
      angle: 'Peer proof. A therapist with 30 years in practice, a regional group mid-rollout.',
      format: 'Two-minute customer story, one-page case, weekly live group demo.',
      cta: 'Join Thursday\'s live clinic demo.',
      channel: 'Nurture email, LinkedIn retargeting, peer-referenced outbound.',
      behavior: 'Attends the live demo. Replies to outbound.',
      metric: 'Live-demo attendance from Tier A. MQL to sales-accepted rate.',
      sport: 'Sport version: one department\'s baseline-to-return workflow.' },
    { n: 6, stage: 'Evaluation intent', mind: '"What would a trial take, and what does it cost?"',
      message: 'Prove it in 30 days at one clinic, with success criteria you set.',
      angle: 'Risk removal. The pilot blueprint, the economics with their own numbers, the workflow fit.',
      format: 'Clinic economics model, pilot blueprint, discovery call.',
      cta: 'Book a 20-minute pilot scoping call.',
      channel: 'High-intent site pages, email, inside sales, conversation ads to engaged accounts only.',
      behavior: 'Books and shows. Forwards the model to a partner.',
      metric: 'Booked to held. Sales-accepted rate. Time to first touch.',
      sport: 'Sport version scopes a pre-season or in-season trial block.' },
    { n: 7, stage: 'Purchase intent', mind: '"I need my partners to say yes."',
      message: 'Everything leadership needs to approve it.',
      angle: 'Arm the champion. One-page case, ROI summary, rollout plan, data FAQ, a reference call.',
      format: 'Champion kit, pilot agreement, reference conversation.',
      cta: 'Start the pilot.',
      channel: 'Sales-led, with stage-triggered email and proof retargeting to the buying group.',
      behavior: 'Signs the pilot. Names the operator.',
      metric: 'Pilot starts. Pilot to paid. Cycle time. First-year value.',
      sport: 'Sport version: medical and performance sign-off pack.' }
  ],

  /* ------------------------------------------------------------------ */
  /* Channels                                                            */
  /* ------------------------------------------------------------------ */
  channels: [
    { id: 'linkedin', name: 'LinkedIn', tag: 'Create demand', icon: 'users-round', share: 45,
      job: 'Put one idea in front of every decision maker and clinical lead inside the named accounts, and warm those accounts for outbound.',
      why: 'It is the only paid platform that can target a roughly 1,000-account universe by company list and job title. The audience is small enough that a modest budget saturates it.',
      audience: 'Tier A PT groups: owners, CEOs, COOs, VPs of clinical operations, clinic directors, sports residency leads. Sports lane: head athletic trainers, directors of sports medicine and performance.',
      stage: 'Stages 1 to 5, plus retargeting at stage 6.',
      creative: 'Split-screen trace video, field-guide document ads, thought-leader ads from clinicians, conversation ads to engaged accounts only.',
      offer: 'Ungated proof first. Then the buyer\'s guide, the live demo and the pilot scoping call.',
      learn: 'Which persona engages, which territory wins, and whether warmed accounts reply to outbound more often.',
      leading: ['Share of Tier A accounts reached 3+ times', 'Click-through against the 0.65% benchmark', 'Lead form completion of 10% or better', 'Engaged-account count week over week'],
      kill: 'Any ad set at $3,000 or three weeks with click-through under 0.35% and no Tier A leads is cut. If by Day 60 direct cost per call is above twice the allowable figure and the holdout lift is under 20%, prospecting drops to retargeting only.',
      scale: 'Holdout lift of 20% or more, or direct cost per sales-accepted call at or under allowable: raise 25% a week until 30-day frequency passes six.' },
    { id: 'search', name: 'Google Search', tag: 'Capture demand', icon: 'search', share: 20,
      job: 'Be the answer when someone is already looking for an EMG or biofeedback option, a competitor, or a fix for a return-to-sport problem.',
      why: 'It is the cheapest source of high-intent conversations, it can be live in week two, and the search terms report teaches us the market\'s own vocabulary.',
      audience: 'Clinicians, performance staff and researchers in an active search. Brand, category, competitor and problem clusters.',
      stage: 'Stages 3 to 6.',
      creative: 'Responsive search ads matched to four landing pages: clinic, return to play, comparison, research specs.',
      offer: 'The 90-second demo and pricing guidance, then a 20-minute walkthrough.',
      learn: 'How much real search demand exists, which intents become sales-accepted calls, and whether competitor terms are worth paying for.',
      leading: ['Impression share of 80% or better on core terms', 'Click-to-lead against the 7 to 8% benchmark', 'Tier A or B share of leads at 40% or better'],
      kill: 'Any keyword cluster past $400 with no Tier A or B lead is paused. Broad match stays off until a term has produced an SQL. Needle-test and patient queries are negated daily for the first three weeks.',
      scale: 'Sales-accepted rate of 35% or better with impression share under 80%: raise budget, then mirror the winners to Microsoft Ads.' },
    { id: 'email', name: 'Email: outbound and nurture', tag: 'Convert', icon: 'mail', share: 10,
      job: 'Turn attention into booked calls. Coordinated outbound opens the door at named accounts. Nurture moves every inbound lead one stage at a time.',
      why: 'An outbound program is already running. Re-briefed around tiers, signals and Salesforce logging, it becomes the lowest-cost route to a meeting and the control arm for the LinkedIn test.',
      audience: 'Named contacts at Tier A accounts. Every inbound lead, by persona and stage.',
      stage: 'Stages 5 to 7 for outbound. All stages for nurture.',
      creative: 'Plain text, clinician to clinician, one idea per email, four touches. Triggered by account signals such as a demo view.',
      offer: 'The pilot scoping call. The live group demo for those not ready.',
      learn: 'Reply and meeting rates by persona and message, and the lift from LinkedIn warm-up.',
      leading: ['Positive reply rate', 'Meetings booked per 100 accounts', 'Bounce rate under 2%', 'Spam complaints under 0.1%'],
      kill: 'A sequence under 1% positive reply after 300 sends is rewritten. Sending pauses on any domain past the bounce or complaint line.',
      scale: 'Positive reply of 2.5% or better with half of meetings sales-accepted: widen the outbound footprint.' }
  ],
  support: [
    { name: 'Retargeting layer', share: 10, icon: 'repeat', text: 'Meta and YouTube against site visitors, video viewers and uploaded contact lists. Cheap frequency that keeps the idea in memory between touches. Not a prospecting test until creative has proven itself.' },
    { name: 'Asymmetric bets', share: 15, icon: 'sparkles', text: 'Educator and newsletter placements that already have the trust of sports clinicians, partner co-marketing with complementary testing vendors, and the booth activation. Small, capped, each with its own tracking.' }
  ],

  /* ------------------------------------------------------------------ */
  /* Budget                                                              */
  /* ------------------------------------------------------------------ */
  budget: {
    scenarios: [{ id: 'lean', name: 'Lean', v: 45000 }, { id: 'base', name: 'Base', v: 90000 }, { id: 'aggr', name: 'Aggressive', v: 150000 }],
    min: 30000, max: 200000, step: 5000, def: 90000,
    lines: [
      { id: 'li',     name: 'LinkedIn',                         pct: 25, m: [3, 9, 13],     group: 'channel', color: 'c1' },
      { id: 'search', name: 'Google Search',                    pct: 11, m: [2.5, 4, 4.5],  group: 'channel', color: 'c2' },
      { id: 'email',  name: 'Email and outbound orchestration', pct: 6,  m: [2, 2, 2],      group: 'channel', color: 'c3' },
      { id: 'rt',     name: 'Retargeting layer',                pct: 5,  m: [0.5, 2, 2.5],  group: 'channel', color: 'c4' },
      { id: 'bets',   name: 'Asymmetric bets',                  pct: 8,  m: [2, 3, 3],      group: 'channel', color: 'c5' },
      { id: 'proof',  name: 'Proof assets and creative',        pct: 25, m: [14, 8, 3],     group: 'build',   color: 'c6' },
      { id: 'data',   name: 'Data, tooling and measurement',    pct: 12, m: [6, 3, 3],      group: 'build',   color: 'c7' },
      { id: 'res',    name: 'Reserve, released at gates',       pct: 8,  m: [0, 2, 6],      group: 'reserve', color: 'c8' }
    ],
    notes: {
      li: 'Sponsored content, document and video ads to matched company lists. Starts small in month one.',
      search: 'Brand, category, competitor and problem clusters. Live in week two.',
      email: 'Contact data for Tier A accounts, sending infrastructure, sequencing seats. The outbound retainer is assumed separate.',
      rt: 'Meta and YouTube frequency against known visitors and uploaded lists.',
      bets: 'Educator and newsletter sponsorships, partner co-marketing, booth activation build.',
      proof: 'Trace explainer, two customer stories shot on site, field guide, economics model, pilot blueprint, landing pages.',
      data: 'Account list and enrichment, scheduling and routing, analytics, a fixed-scope Salesforce sprint if needed.',
      res: 'Unallocated until the Day 30 and Day 60 reviews. Goes to whatever is winning.'
    }
  },

  /* ------------------------------------------------------------------ */
  /* Pipeline model                                                      */
  /* ------------------------------------------------------------------ */
  pipeline: {
    target: 20,
    sources: [
      { id: 'out', name: 'Coordinated outbound', kind: 'rate', a: { label: 'Contacts sequenced per week', min: 50, max: 800, step: 25, def: 300, stretch: 450 }, b: { label: 'Held calls per 100 contacts', min: 0.2, max: 3, step: 0.1, def: 0.9, stretch: 1.2 } },
      { id: 'search', name: 'Google Search', kind: 'cost', a: { label: 'Monthly spend', min: 0, max: 12000, step: 50, def: 4050, stretch: 4050, money: true, link: 'search' }, b: { label: 'Cost per held call', min: 100, max: 1500, step: 10, def: 330, stretch: 300, money: true } },
      { id: 'li', name: 'LinkedIn, direct response', kind: 'cost', a: { label: 'Monthly spend', min: 0, max: 30000, step: 100, def: 11700, stretch: 11700, money: true, link: 'li' }, b: { label: 'Cost per held call', min: 300, max: 4000, step: 50, def: 2000, stretch: 1600, money: true } },
      { id: 'demo', name: 'Live demos and primers', kind: 'monthly', a: { label: 'Tier A and B registrants per month', min: 0, max: 250, step: 5, def: 60, stretch: 90 }, b: { label: 'Share who book a call', min: 2, max: 40, step: 1, def: 15, stretch: 18, pct: true } },
      { id: 'event', name: 'Events', kind: 'quarterly', a: { label: 'Qualified conversations per quarter', min: 0, max: 500, step: 10, def: 150, stretch: 200 }, b: { label: 'Share who book a call', min: 2, max: 50, step: 1, def: 20, stretch: 22, pct: true } },
      { id: 'other', name: 'Baseline: inbound, referrals, sports lane', kind: 'direct', a: { label: 'Held calls per week', min: 0, max: 12, step: 0.1, def: 3.8, stretch: 4.5 } }
    ],
    funnel: { sql: 55, pilot: 45, paid: 50, acv: 7500 }
  },

  /* ------------------------------------------------------------------ */
  /* Creative territories and experiments                                */
  /* ------------------------------------------------------------------ */
  territories: [
    { n: 1, name: 'The trace', kind: 'Demonstration', line: 'Two graphs. One looks even. One does not.', why: 'The product\'s "aha" is visual and lands in five seconds. It needs no vocabulary and no trust in us.', fit: 'Stages 1 to 3, every audience', strength: 5 },
    { n: 2, name: 'Output is not activation', kind: 'Reframe', line: 'Passed the strength test. Still compensating.', why: 'It attacks the belief that blocks the sale: "we already test for this."', fit: 'Stages 1 to 2, clinicians', strength: 5 },
    { n: 3, name: 'A clinic like yours', kind: 'Peer proof', line: '"The most impactful advancement I\'ve seen in 30 years."', why: 'Clinicians trust clinicians. Owners trust owners. Nobody trusts a vendor.', fit: 'Stages 4 to 6, both threads', strength: 4 },
    { n: 4, name: 'EMG left the basement', kind: 'Old way, new way', line: 'The lab rig, and the 4-gram strip.', why: 'It answers "why now" and clears up what surface EMG is.', fit: 'Stage 3, search and video', strength: 4 },
    { n: 5, name: 'Visible progress', kind: 'Economics', line: 'Patients don\'t quit therapy. They quit when they can\'t see progress.', why: 'It turns a clinical tool into a retention and revenue conversation for the person who signs.', fit: 'Stages 2 to 6, executives', strength: 4 },
    { n: 6, name: 'Proven at the top', kind: 'Elite halo', line: 'Used where a wrong call costs a season.', why: 'Borrowed authority. A supporting line for PT, never the lead.', fit: 'Stage 5, as a proof line', strength: 3 }
  ],
  parked: [
    { name: 'Independence and human story', why: 'It belongs to the assistive communication brand. Moving, and off-strategy for NeuroStrip demand.' },
    { name: 'Headline performance gains', why: 'Percent-improvement claims need tighter substantiation and fit a narrower program audience.' },
    { name: 'Patient testimonials', why: 'Privacy and consumer health-claim exposure, aimed at someone who cannot buy.' },
    { name: 'Fear of injury', why: 'Prevention and prediction claims sit outside what a non-diagnostic tool should say.' },
    { name: 'Neurotech futurism', why: 'A strong investor story. Not what a clinic director is buying.' }
  ],
  experiments: [
    { n: 1,  name: 'Lead message for PT executives', h: 'Hidden deficit earns more booked calls from Tier A than visible progress.', a: 'Hidden deficit', b: 'Visible progress', metric: 'Booked calls from Tier A accounts', phase: 2, i: 5, c: 3, e: 4 },
    { n: 2,  name: 'Who we enter through', h: 'Clinician-first entry produces more pilots than executive-first.', a: 'Executive first', b: 'Clinical champion first', metric: 'Pilot starts per 100 accounts', phase: 2, i: 5, c: 3, e: 3 },
    { n: 3,  name: 'Primary offer', h: 'A 20-minute pilot scoping call beats softer offers on qualified volume.', a: 'Pilot scoping call', b: 'Live group demo or economics model', metric: 'Sales-accepted calls per 1,000 visits', phase: 2, i: 4, c: 3, e: 4 },
    { n: 4,  name: 'LinkedIn air cover holdout', h: 'Warmed accounts reply to outbound 20% more often.', a: 'Outbound only', b: 'Outbound plus LinkedIn', metric: 'Positive reply rate by account', phase: 2, i: 5, c: 3, e: 3 },
    { n: 5,  name: 'Gate or no gate', h: 'An ungated field guide with retargeting yields more sales-accepted calls than a lead form.', a: 'Lead form', b: 'Ungated plus retargeting', metric: 'Sales-accepted calls per $1,000', phase: 2, i: 3, c: 3, e: 5 },
    { n: 6,  name: 'Search landing page', h: 'A comparison page converts competitor searches better than the product page.', a: 'Product page', b: 'Comparison page', metric: 'Lead to sales-accepted rate', phase: 2, i: 3, c: 4, e: 4 },
    { n: 7,  name: 'Format', h: 'The split-screen trace beats a talking-head clinician and a static image.', a: 'Trace video', b: 'Clinician video, static', metric: 'Cost per engaged Tier A account', phase: 1, i: 4, c: 4, e: 4 },
    { n: 8,  name: 'Who is speaking', h: 'Thought-leader ads from a clinician beat the company page.', a: 'Company page', b: 'Clinician voice', metric: 'Click-through and engaged accounts', phase: 2, i: 3, c: 4, e: 4 },
    { n: 9,  name: 'Elite proof line', h: 'Sport proof lifts response from PT buyers.', a: 'No sport proof', b: 'Sport proof line', metric: 'Booked calls from Tier A', phase: 3, i: 3, c: 2, e: 5 },
    { n: 10, name: 'Form length', h: 'Four fields and an instant scheduler beat a seven-field qualifying form.', a: 'Seven fields', b: 'Four fields plus scheduler', metric: 'Held calls per 100 form starts', phase: 1, i: 4, c: 4, e: 5 },
    { n: 11, name: 'Borrowed trust', h: 'An educator or newsletter placement beats paid social on cost per sales-accepted call.', a: 'LinkedIn', b: 'Educator placement', metric: 'Cost per sales-accepted call', phase: 3, i: 4, c: 2, e: 3 },
    { n: 12, name: 'Cheaper air cover', h: 'Meta against uploaded contacts engages the same accounts for less.', a: 'LinkedIn retargeting', b: 'Meta custom audiences', metric: 'Cost per engaged Tier A account', phase: 3, i: 3, c: 3, e: 4 }
  ],

  /* ------------------------------------------------------------------ */
  /* Roadmap                                                             */
  /* ------------------------------------------------------------------ */
  roadmap: {
    defaultStart: '2026-12-01',
    streams: [
      { id: 'data',    name: 'Data and Salesforce' },
      { id: 'insight', name: 'Insight and message' },
      { id: 'proof',   name: 'Proof and creative' },
      { id: 'chan',    name: 'Channels' },
      { id: 'conv',    name: 'Conversion path' },
      { id: 'sales',   name: 'Sales and events' }
    ],
    phases: [
      { n: 1, name: 'Instrument', days: 'Days 1 to 30', weeks: [1, 4], line: 'Wire the system, set baselines, get first signals live.' },
      { n: 2, name: 'Learn', days: 'Days 31 to 60', weeks: [5, 8], line: 'Run the tests, cut the losers, find the message and offer.' },
      { n: 3, name: 'Scale', days: 'Days 61 to 90', weeks: [9, 13], line: 'Put money behind what works and make it repeatable.' }
    ],
    weeks: [
      { w: 1, title: 'Listen and audit', items: [
        ['insight', 'Listen to ten sales calls. Interview eight to ten trial customers: won, stalled and lost.'],
        ['data', 'Audit Sales Cloud, Account Engagement, the site and tracking. Write the one-page data dictionary.'],
        ['sales', 'Agree lead definitions, tiers and the response SLA with James and Tanner.'],
        ['insight', 'Draft the claims matrix with regulatory.']
      ] },
      { w: 2, title: 'Wire the path', items: [
        ['data', 'Record types, lifecycle stages with timestamps, source and UTM capture, routing, scheduler.'],
        ['conv', 'Fix the site conversion path. Ship one pilot page and one demo page.'],
        ['chan', 'Search live: brand, category, competitor, problem.'],
        ['proof', 'Brief production. Book two customer shoots.']
      ] },
      { w: 3, title: 'Proof sprint', items: [
        ['proof', 'Trace explainer, two customer stories, field guide, economics model, pilot blueprint.'],
        ['data', 'Backfill twelve months of trials with segment, source, outcome and reason.'],
        ['chan', 'Upload Tier A account lists. Re-brief outbound with new sequences and the holdout design.']
      ] },
      { w: 4, title: 'Soft launch and gate', items: [
        ['chan', 'LinkedIn to Tier A at low spend. Retargeting pools start filling.'],
        ['conv', 'First live group demo on the calendar.'],
        ['data', 'Five dashboards live. End-to-end test of every lead path.'],
        ['sales', 'Day 30 review.']
      ], gate: 1 },
      { w: 5, title: 'Full launch', items: [
        ['chan', 'Two territories against two personas. Outbound sequences live with the holdout.'],
        ['conv', 'Weekly live demo begins. Persona nurture tracks switch on.']
      ] },
      { w: 6, title: 'First read', items: [
        ['chan', 'First kill, continue or scale call on creative. Search terms mined for negatives and new pages.'],
        ['sales', 'Event meeting-booking campaign opens to Tier A accounts.']
      ] },
      { w: 7, title: 'Offer test', items: [
        ['conv', 'Pilot scoping call against live demo against economics model.'],
        ['proof', 'First customer story published. Champion kit drafted.']
      ] },
      { w: 8, title: 'Cut and commit', items: [
        ['chan', 'Bottom half of creative and audiences cut. Winning territory and offer chosen.'],
        ['proof', 'Sports lane assets finished for business development.'],
        ['sales', 'Day 60 review. Reserve released.']
      ], gate: 2 },
      { w: 9, title: 'Scale the winners', items: [
        ['chan', 'Winners up 25% a week inside frequency caps. Meta custom-audience test starts.'],
        ['chan', 'Outbound widens its footprint if the reply line is met.']
      ] },
      { w: 10, title: 'Event week', items: [
        ['sales', 'Booth activation built around a 60-second asymmetry test. Pre-booked meetings. Scans straight to Salesforce.'],
        ['conv', '48-hour follow-up rule on every conversation.']
      ] },
      { w: 11, title: 'Follow-up sprint', items: [
        ['sales', 'Event follow-up sequences. Second customer story.'],
        ['chan', 'First educator or newsletter placement live.']
      ] },
      { w: 12, title: 'Close the loop', items: [
        ['data', 'Qualified-stage events flowing back to LinkedIn and Google.'],
        ['sales', 'First pilot conversions read against success criteria.'],
        ['insight', 'Playbook written: what works, for whom, at what cost.']
      ] },
      { w: 13, title: 'Day 90 review', items: [
        ['data', 'Unit economics by source, audience and message.'],
        ['sales', 'Decisions: next-quarter budget, second inside-sales seat, second segment.']
      ], gate: 3 }
    ],
    gates: [
      { n: 1, day: 30, q: 'Is the machine wired?', checks: ['A test lead travels from ad to opportunity with its source intact', '95% of new leads carry source and segment', 'Trial backfill complete, baselines published', 'First campaigns have at least ten days of data'], decide: 'Confirm tiers. Choose the two territories to test. Approve month-two spend.', target: '6 to 8 held calls a week' },
      { n: 2, day: 60, q: 'What is working?', checks: ['Half of Tier A accounts reached three or more times', 'A winning territory and a winning offer, by the pre-set rules', 'Sales-accepted rate at 50% or better', 'Event meetings pre-booked'], decide: 'Kill the bottom half. Release the reserve to the winners. Decide on the Meta test.', target: '10 to 12 held calls a week' },
      { n: 3, day: 90, q: 'Is it repeatable?', checks: ['Cost per held call at or under allowable in at least two channels', '130 or more held calls to date, 30 or more pilots started or scheduled', 'First paid conversions from the first pilot cohort', 'Playbook documented'], decide: 'Set next-quarter budget. Trigger or defer the second inside-sales seat. Pick the second segment.', target: '15 to 20 held calls a week' }
    ],
    events: [
      { name: 'APTA Private Practice annual conference', start: '2026-11-11', end: '2026-11-14', where: 'Colorado Springs', src: 's27' },
      { name: 'Holiday slowdown', start: '2026-12-21', end: '2027-01-01', where: 'Planning convention', src: 'a13', soft: true },
      { name: 'APTA Combined Sections Meeting', start: '2027-02-04', end: '2027-02-06', where: 'Philadelphia', src: 's26' },
      { name: 'NFL Scouting Combine', start: '2027-03-01', end: '2027-03-08', where: 'Indianapolis', src: 's28' },
      { name: 'NSCA National Conference', start: '2027-07-07', end: '2027-07-10', where: 'Las Vegas', src: 's47' }
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Risks                                                               */
  /* ------------------------------------------------------------------ */
  risks: [
    { name: 'Claims drift', level: 'High', kind: 'Compliance', what: 'Copy slides toward diagnose, prevent or predict, beyond what a non-diagnostic measurement and biofeedback tool should claim.', plan: 'A claims matrix approved with regulatory before launch. Every outcome number tied to a named, consented source.' },
    { name: 'Thin public proof for PT', level: 'High', kind: 'Proof', what: 'Few named clinic stories exist in public, so early ads lean on logic more than evidence.', plan: 'A month-one proof sprint with two customers on camera. The trial base becomes the story pipeline.' },
    { name: 'One calendar, finite pilot kits', level: 'High', kind: 'Capacity', what: 'Marketing can outrun inside sales and the pilot pool, and slow follow-up wastes the spend.', plan: 'Tiered routing, a weekly group demo for Tier B, a kit-pool view on the pilot board, written triggers for a second seat.' },
    { name: 'Audience fatigue', level: 'Medium', kind: 'Market', what: 'A 1,000-account universe sees the same ad too often, too fast.', plan: 'Frequency caps, monthly creative refresh, deliberate expansion to Tier B and a wider outbound footprint.' },
    { name: 'Attribution blind spots', level: 'Medium', kind: 'Measurement', what: 'Long cycles and word of mouth hide what really caused a deal.', plan: 'Three lenses read together: click data, a self-reported source field, account-level holdouts.' },
    { name: 'Category confusion', level: 'Medium', kind: 'Message', what: '"EMG" is heard as a needle test or an old biofeedback box.', plan: 'Education before product. The primer and comparison page do this work before any demo ask.' },
    { name: 'Price gap', level: 'Medium', kind: 'Market', what: 'Entry-level biofeedback costs a few hundred dollars once. NeuroStrip is an annual contract.', plan: 'Sell four muscles at once, no wires, documented records and program economics. Never lead on price.' },
    { name: 'Outbound domain health', level: 'Medium', kind: 'Channel', what: 'Volume sending damages deliverability for the whole company.', plan: 'Separate sending domains, warm-up, bounce and complaint thresholds that pause sending automatically.' },
    { name: 'Patient data near marketing data', level: 'Medium', kind: 'Compliance', what: 'Assistive communication patient records may sit in the same CRM.', plan: 'Record-type separation and hard audience exclusions from week one.' },
    { name: 'Reimbursement language', level: 'Medium', kind: 'Compliance', what: 'Billing-code claims are easy to overstate and vary by payer.', plan: 'No reimbursement copy without compliance sign-off. Program economics shown with the clinic\'s own numbers.' },
    { name: 'December start', level: 'Low', kind: 'Timing', what: 'The first 30 days overlap the quietest weeks of the year.', plan: 'Use them to build. Full launch moves to the first week of January.' },
    { name: 'Single point of knowledge', level: 'Low', kind: 'Capacity', what: 'One person holds the system design.', plan: 'Data dictionary, naming conventions and the playbook are written as the work is done.' }
  ]
};
