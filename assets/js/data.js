/* Data behind the NeuroStrip 90-day plan page: glossary, budget, call math,
   the buying group, objections, persona tests and the campaign.
   Edit here, then run node tools/build.mjs. */
window.NS = {
  /* ------------------------------------------------------------------ */
  /* Plain-word definitions shown on hover or tap                        */
  /* ------------------------------------------------------------------ */
  glossary: {
    abm: { term: 'Account-based ads', def: 'Ads shown only to people at a named list of practices, instead of to anyone who fits a profile.' },
    intent: { term: 'Intent data', def: 'A sign that people at a practice are reading more than usual about a topic, such as billing software. It shows which practices are actively researching. It does not name the people.' },
    researching: { term: 'Researching now', def: 'A practice whose staff are reading more than usual about topics close to NeuroStrip, according to Bombora intent data, in the last few weeks.' },
    npi: { term: 'National Provider Identifier (NPI)', def: 'The 10-digit ID every American healthcare provider and practice uses for billing. It lets us find physical therapy practices in a provider database.' },
    pipeline: { term: 'Pipeline', def: 'All the open sales conversations that could become paying customers, and what they could be worth.' },
    cpqc: { term: 'Cost per qualified call', def: 'Marketing spend in a period divided by the qualified calls it produced. The plan keeps it under about $930, the most a call can cost and still pay back in year one.' },
    holdout: { term: 'Holdout group', def: 'Half of the target list that gets no ads, only email. Comparing it with the half that sees ads shows what the ads add.' },
    qcall: { term: 'Qualified call', def: 'A first sales call that actually happens, with someone who passes the five-point checklist in the sales section.' },
    salesready: { term: 'Sales-ready lead', def: 'A person who passes the first three checks in the sales section (target group, buying role, asked for something) and is ready for a sales call.' },
    pilot: { term: 'Pilot', def: 'A 30-day trial of NeuroStrip at one clinic, with success measures the clinic writes before it starts.' },
    biofeedback: { term: 'Biofeedback', def: 'Showing patients a live signal from their own body, here how hard a muscle is working, so they can learn to control it.' },
    planofcare: { term: 'Plan of care', def: 'The set of visits and exercises a therapist prescribes for a patient.' },
    buyinggroup: { term: 'Buying group', def: 'Everyone at a practice who has a say in the purchase: who signs, who approves it clinically, who runs the pilot and who can slow it down.' },
    retargeting: { term: 'Retargeting', def: 'Ads shown only to people who already visited the site or watched the video.' },
    geofence: { term: 'Geofence', def: 'An ad shown on phones inside a set area, such as a convention center, on set dates. Anyone inside the area can see it.' },
    semg: { term: 'Surface electromyography (sEMG)', def: 'Measuring the electrical activity of muscles through sensors on the skin. NeuroStrip is a wireless sEMG sensor.' },
    firstyear: { term: 'First-year value', def: 'What a new customer pays in its first 12 months. The plan uses $7,500 as a planning figure until real contract values replace it.' },
    cluster: { term: 'Buyer cluster', def: 'Roles grouped for testing so each test reaches enough people: executive, operations and clinical.' },
    abtest: { term: 'A/B test', def: 'Two versions of a message sent to similar people at the same time, to see which one gets more replies.' },
    emr: { term: 'Electronic medical record (EMR)', def: 'The software a clinic uses for patient notes, scheduling and billing.' },
    salesforce: { term: 'Salesforce', def: 'The system the sales team uses to track every contact, call and deal. It is where we see where each lead came from.' }
  },

  /* ------------------------------------------------------------------ */
  /* Budget. pct is the share of the 90-day total. m is the share of    */
  /* the total spent on that line in months 1, 2 and 3.                 */
  /* ------------------------------------------------------------------ */
  budget: {
    scenarios: [
      { id: 'lean', name: 'Lean', v: 45000, read: 'Proves the system on a small scale. After Propensity\'s listed fee, about $2,250 is left for ads, so the account-based test is thin and its Day 60 result may not be clear.' },
      { id: 'base', name: 'Base', v: 90000, read: 'This is the budget we recommend. After Propensity\'s fee it leaves about $13,500 for ads, enough to compare the half that sees ads fairly with the holdout half. It also holds 8% back to move to whatever is working at Day 30 and Day 60.' },
      { id: 'aggr', name: 'Aggressive', v: 150000, read: 'Adds about 3 qualified calls a week over Base. Worth it only if the Day 30 match check passes and sales can hold more than 20 calls a week.' }
    ],
    min: 30000, max: 200000, step: 5000, def: 90000,
    groups: [['channel', 'Ads and email'], ['build', 'Content and setup'], ['reserve', 'Reserve']],
    lines: [
      { id: 'abm',    name: 'Account-based ads (Propensity test)', pct: 25, m: [3, 9, 13],    group: 'channel',
        note: 'Propensity\'s listed fee of $3,000 a month, plus ads to the test half of the list. In month three, spend moves to practices that are researching now.' },
      { id: 'search', name: 'Google Search',                       pct: 11, m: [2.5, 4, 4.5], group: 'channel',
        note: 'Ads on category, competitor, problem and brand searches, live from week two.' },
      { id: 'email',  name: 'Email, first contact and follow-up',  pct: 6,  m: [2, 2, 2],     group: 'channel',
        note: 'Sending tools, separate sending domains and sequences. The outbound partner\'s retainer is separate.' },
      { id: 'rt',     name: 'Retargeting',                         pct: 5,  m: [0.5, 2, 2.5], group: 'channel',
        note: 'Meta ads to site visitors and video viewers.' },
      { id: 'tests',  name: 'Small tests',                         pct: 8,  m: [2, 3, 3],     group: 'channel',
        note: 'Newsletter sponsorships, the APTA CSM booth build and the direct mail boxes for owners at practices researching now. Each one capped and tracked.' },
      { id: 'assets', name: 'Video, customer stories and landing pages', pct: 25, m: [14, 8, 3], group: 'build',
        note: 'The 15-second and 90-second videos, two filmed customer stories once cleared, the clinical primer, the economics worksheet, a pilot guide and the landing pages.' },
      { id: 'data',   name: 'List, research data and Salesforce setup', pct: 12, m: [6, 3, 3],     group: 'build',
        note: 'The practitioner list, Bombora intent data, scheduling and routing tools, and a fixed-scope Salesforce build if needed. List and intent prices are quotes in week one.' },
      { id: 'res',    name: 'Reserve',                             pct: 8,  m: [0, 2, 6],     group: 'reserve',
        note: 'Held until the Day 30 and Day 60 reviews, then given to whatever is working.' }
    ],
    propensityMonthly: 3000
  },

  /* ------------------------------------------------------------------ */
  /* Qualified calls a week at the Day 90 run rate, by source            */
  /*   rate:      a contacts a week, b calls per 100 contacts            */
  /*   cost:      month-three spend on budget line `line`, b per call     */
  /*   monthly:   a registrants a month, b% book a call                  */
  /*   quarterly: a conversations a quarter, b% book a call              */
  /*   direct:    a calls a week                                         */
  /* ------------------------------------------------------------------ */
  pipeline: {
    target: 20,
    capacity: 20,
    sources: [
      { name: 'Calls that already come in today (estimate)', kind: 'direct', a: 3.8, why: 'Site inquiries, referrals and sport. Replaced by the real count from the last eight weeks in week one.' },
      { name: 'Google Search', kind: 'cost', line: 'search', b: 330, why: 'Planned at $330 per qualified call, from published 2026 search benchmarks for health and fitness.' },
      { name: 'Email to the purchased list', kind: 'rate', a: 300, b: 0.9, why: '300 contacts a week. 1.5% reply positively and 60% of those hold a call, so 0.9 calls per 100 contacts.' },
      { name: 'Conference follow-up (APTA CSM, February)', kind: 'quarterly', a: 150, b: 20, why: '150 good conversations at the show, and 20% of them book a call over the quarter.' },
      { name: 'Weekly live demo', kind: 'monthly', a: 60, b: 15, why: '60 people from target practices register each month and 15% book a call.' },
      { name: 'Account-based ads (Propensity test)', kind: 'cost', line: 'abm', b: 2000, why: 'Planned at $2,000 per qualified call until the test produces its own number.' }
    ],
    /* percentages: calls to opportunities, opportunities to pilots, pilots to paid; first-year contract value */
    funnel: { opp: 55, pilot: 45, paid: 50, acv: 7500 }
  },

  /* ------------------------------------------------------------------ */
  /* Persona tests, weeks 5 to 8                                         */
  /* ------------------------------------------------------------------ */
  personaTests: {
    perSide: 150,
    maxWeeks: 6,
    winGap: 30,
    minReplies: 10,
    clusters: [
      { id: 'executive', name: 'Executive', roles: ['owner', 'ceo'] },
      { id: 'operations', name: 'Operations', roles: ['coo', 'admin'] },
      { id: 'clinical', name: 'Clinical', roles: ['cco', 'rehab', 'director'] }
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Short first-layer copy for the buying group section. The full text  */
  /* lives in the playbook data below and in docs/PERSONAS.md.          */
  /* ------------------------------------------------------------------ */
  site: {
    ab: {
      owner: ['Patients who can see their progress have a reason to finish their plan of care.', 'A return-to-sport program the clinic down the street does not have.'],
      ceo: ['A program you can roll out to every clinic and measure.', 'Objective muscle data to show referring physicians and partners.'],
      coo: ['Each sensor goes on in seconds and shows live on an iPad.', 'One standard return-to-sport test in every clinic.'],
      cco: ['Strength tests can miss muscles covering for an injured one.', 'A documented return-to-sport protocol.'],
      rehab: ['A live target line on screen shows patients how hard to work the muscle.', 'One tool for joint, sports and nerve-injury patients.'],
      admin: ['Clear annual pricing and what it includes.', 'A monthly report on plan-of-care completion at the pilot clinic.'],
      director: ['Show patients their progress at every visit.', 'Be the first clinic in the group to run it.']
    },
    bySize: [
      { size: '5 to 10 clinics', who: 'The owner is often also the CEO and still treats patients. Each clinic has a director. A separate COO or chief clinical officer is rare.', first: 'The owner and one clinic director.' },
      { size: '11 to 14 clinics', who: 'An owner or CEO, a rehab director who leads clinical work, clinic directors and a practice administrator. A COO sometimes appears.', first: 'The owner or CEO and the rehab director.' },
      { size: '15 to 25 clinics', who: 'A CEO, a COO, a chief clinical officer, clinic directors and a practice administrator, each a separate person.', first: 'The chief clinical officer and the CEO. The COO joins once a pilot is scoped.' }
    ],
    objections: [
      { q: 'We already test strength with force plates and hop tests.', who: 'Chief clinical officer, rehab director, clinic director, owner', a: 'Keep them. Force plates and hop tests show how much force a leg makes, and NeuroStrip adds which muscles are making it, in the same session.', proof: '90-second video', next: 'When a patient passes your strength test, how do you check the injured muscle is doing its share?' },
      { q: 'My therapists do not have time.', who: 'Clinic director, COO, rehab director', a: 'Each sensor goes on like a bandage and shows on an iPad during the visit. The pilot measures the minutes it adds, so you see the real cost before any rollout.', proof: 'Live demo', next: 'How many minutes could a return-to-sport visit give to this today?' },
      { q: 'It costs more than a $499 biofeedback unit.', who: 'Owner, practice administrator, COO', a: 'A single-channel unit reads one muscle. NeuroStrip reads up to four at once, wirelessly, and saves a record of each session.', proof: 'Economics worksheet', next: 'What would one more finished plan of care a month be worth to a clinic?', w1: 'How a session record gets into the patient\'s electronic medical record (EMR)' },
      { q: 'Can we bill for it?', who: 'Owner, practice administrator, CEO, COO', a: 'Your billing team decides that, and we make no billing promises. Control Bionics will confirm what current customers do.', proof: 'Pricing and questions page', next: 'Who on your team should hear how current customers handle it?', w1: 'What current customers do about billing' },
      { q: 'Is surface electromyography (EMG) reliable, and where is the evidence?', who: 'Chief clinical officer, rehab director, clinic director', a: 'We share the specification sheet and a summary of published research, including a 2022 review of eight trials of muscle-sensor biofeedback after knee surgery. The pilot lets your clinicians judge the readings on their own patients.', proof: 'Specification sheet and evidence summary', next: 'What would your team need to see in a pilot to trust the readings?' },
      { q: 'We bought tech before and it sat in a drawer.', who: 'Owner, CEO, COO, rehab director', a: 'The pilot names one clinic director to run it, and you write the success measures, including how often it gets used. If it is not used, it does not roll out.', proof: 'Pilot guide', next: 'What made the last tool stop being used?', w1: 'Standard pilot terms' },
      { q: 'Not this budget cycle.', who: 'Owner, CEO, COO, practice administrator', a: 'A 30-day pilot at one clinic can start now and give you your own numbers for the next budget.', proof: 'Pilot guide and rollout plan', next: 'When does your next budget get set, and who sets it?', w1: 'Pilot terms and cost' },
      { q: 'Does it work with our electronic medical record (EMR)?', who: 'COO, practice administrator, clinic director, chief clinical officer', a: 'We confirm which record systems it works with in week one, and say only what is confirmed in writing.', proof: 'Pricing and questions page', next: 'Which system do you use, and are you changing it this year?', w1: 'Which EMR systems it works with today' },
      { q: 'Where does patient data go?', who: 'Practice administrator, COO, chief clinical officer, CEO', a: 'We give you, in writing, where session data is stored and who can see it. Your administrator reviews it before the pilot starts.', proof: 'Pilot agreement', next: 'Who signs off on new software that stores patient data?', w1: 'Where session data is stored and who can see it' },
      { q: 'Who else like us uses it?', who: 'Owner, CEO, chief clinical officer, COO', a: 'We share customer stories and references once those customers clear them. Until then, the pilot gives you your own result to judge.', proof: 'A customer story, once cleared', next: 'Would a call with a similar group help, once we can set one up?', w1: 'Which customers we may name' }
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Filled from the buyer playbook and campaign drafts                  */
  /* ------------------------------------------------------------------ */
  roles: /*@roles*/[
 {
  "id": "owner",
  "title": "Clinic Owner",
  "cluster": "executive",
  "buying_role": "Signs",
  "one_line": "The owner signs the contract and wants to know two things: whether patients who see their progress finish more of their visits, and whether a return-to-sport service sets the group apart from nearby clinics.",
  "role_in_decision": "Signs the pilot and the group contract. In groups of 5 to 10 locations the owner is often also the chief executive officer and still treats patients (a planning assumption, checked against the list in week one), so the owner hears the clinical case and the business case at the same time. Before saying yes, the owner usually asks a trusted clinic director or rehab director to try it and checks the cost with the practice administrator.",
  "exists_when": "Every group has one. At 5 to 10 locations the owner usually runs the business and still sees patients. At 15 or more locations the owner may be a founding partner or an investor group that has handed day-to-day running to a chief executive officer, who then signs. Planning assumption, checked against the list in week one.",
  "also_called": [
   "Owner",
   "Co-Owner",
   "Founder",
   "Managing Partner",
   "President",
   "Principal",
   "Owner and Physical Therapist",
   "Managing Member"
  ],
  "measured_on": [
   "Profit",
   "Growth in new patients and visits",
   "Referral relationships with local physicians and coaches",
   "Keeping good therapists on staff"
  ],
  "worries": [
   "Thin margins on each visit",
   "Patients who stop coming before they finish their plan of care, the set of visits their therapist prescribed",
   "Equipment that ends up in a drawer after the first month",
   "Paying for a program the team does not use"
  ],
  "ready_signals": [
   "Watched at least half of the 90-second video, or visited the pilot page twice in one week",
   "Opened the economics worksheet and entered the group's own visit numbers",
   "Bombora data shows people at the group reading more than usual about patient retention, practice marketing, biofeedback or return-to-sport testing. Bombora reports by company and does not name people, and the topic names are checked against Bombora's topic list in week one",
   "Replied to outbound email, even with a question about price",
   "A clinic director or rehab director at the same group registered for the weekly live demo",
   "The group posted therapist jobs or announced a new clinic",
   "Asked for a meeting at the American Physical Therapy Association's Combined Sections Meeting in Philadelphia, February 4 to 6, 2027"
  ],
  "bombora_topics": [
   "Patient retention",
   "Physical therapy practice marketing",
   "Biofeedback",
   "Return-to-sport testing",
   "Sports medicine services"
  ],
  "message_a": "Patients who can see their progress at each visit have a reason to keep coming back. NeuroStrip shows each patient's muscle activation live on an iPad, and the pilot tests whether that shows up in plan-of-care completion at one clinic, measured against that clinic's own numbers from before the pilot.",
  "message_b": "Start a return-to-sport service at one clinic, measure it for 30 days, then add it to your other clinics. NeuroStrip shows activation on up to four muscles at once next to the strength and hop tests your therapists already run, and keeps a record your clinics can show patients and referring physicians.",
  "offer": "A short economics worksheet that uses the group's own visit numbers to show what each extra completed visit is worth, with no new billing assumed, then a 20-minute pilot scoping call. Owners in the test half whose groups Bombora shows researching now also get one direct mail box, priced in week one.",
  "landing_page": "The pilot page. One call to action: book a 20-minute pilot scoping call. The economics worksheet sits on the page with no form in front of it.",
  "sequence": [
   {
    "week": 1,
    "channel": "Outbound email and account-based ads through Propensity",
    "touch": "Plain-text email from the sales rep on message A or B, whichever this contact was assigned at random, offering the economics worksheet or a 20-minute call. Ads with the 90-second video start now and run all six weeks for groups in the test half. The holdout half gets the same emails and calls without ads."
   },
   {
    "week": 2,
    "channel": "Rep call and LinkedIn connection",
    "touch": "The rep calls the main line, asks for the owner, and sends a LinkedIn connection request with a one-line note about the worksheet."
   },
   {
    "week": 3,
    "channel": "Outbound email",
    "touch": "Second email on the same assigned message, adding the one-athlete hamstring example and a link to the 90-second video."
   },
   {
    "week": 4,
    "channel": "Direct mail box",
    "touch": "If the group is in the test half and Bombora shows it researching now, the owner gets the direct mail box with a code to book the pilot scoping call. Other owners get a short email with the economics worksheet."
   },
   {
    "week": 5,
    "channel": "Rep call",
    "touch": "The rep follows up on the box or the worksheet and invites the owner to send a clinic director to the weekly live demo."
   },
   {
    "week": 6,
    "channel": "Outbound email",
    "touch": "Last outbound email, asking whether to close the file or to send a customer story, once cleared. No reply moves the owner to the executive nurture track."
   }
  ],
  "objections": [
   {
    "objection": "We bought tech before and it sat in a drawer.",
    "answer": "That is why the pilot runs at one clinic for 30 days with a named clinic director and usage measures you choose, so you see whether therapists reach for it before it goes anywhere else. Training and support during the pilot are pilot terms we confirm in week one."
   },
   {
    "objection": "Can we bill for it?",
    "answer": "Your billing team decides that, and we make no billing promises. Control Bionics will confirm what current customers do, and the economics worksheet assumes no new billing."
   },
   {
    "objection": "It costs more than a $499 biofeedback unit.",
    "answer": "A single-channel unit, which lists from $499 at mTrigger, reads one muscle at a time. NeuroStrip reads up to four at once and records them with a synchronized motion sensor and video, and if one muscle at a time covers your caseload, we will tell you the cheaper unit may be enough."
   },
   {
    "objection": "Not this budget cycle.",
    "answer": "If a 30-day pilot at one clinic can run before the next budget is set, your own numbers will be ready when it is. Pilot cost and terms, including that timing, are something we confirm in week one."
   }
  ],
  "proof": [
   "Economics worksheet built on the group's own visit numbers",
   "90-second video",
   "One athlete's example from Control Bionics: three weeks after a hamstring injury, force plates showed a 7% gap between legs and NeuroStrip on both hamstrings showed a 37% gap in muscle activation",
   "Pilot guide",
   "A customer story, once cleared"
  ],
  "discovery_questions": [
   "Of the patients who start a plan of care with you, how many finish it, and how do you track that today?",
   "Which referral sources matter most to the group, and what do they ask to see from your clinics?",
   "If we ran a 30-day pilot at one clinic, which clinic and clinic director would you pick, and what result would make you add more clinics?"
  ],
  "yes_looks_like": "The owner books the pilot scoping call, names the pilot clinic and its clinic director, and agrees on two or three success measures in writing, such as plan-of-care completion and how many times a week therapists use it.",
  "stop_when": "Stop outbound after six weeks with no reply, a clear no or a request to stop, and move the owner to the executive nurture track. Take the group out of ads and mail if it turns out to have fewer than 5 locations, is already a customer or in a trial, or the owner has left."
 },
 {
  "id": "ceo",
  "title": "Chief Executive Officer (CEO)",
  "cluster": "executive",
  "buying_role": "Signs",
  "one_line": "The CEO signs in larger groups and wants a program that can roll out to every clinic and be measured the same way at each one.",
  "role_in_decision": "Signs the contract where the owner has stepped back or investors hold the group. Sets what the pilot must show, then hands the rollout question to the chief operating officer and the clinical question to the chief clinical officer. Rarely signs a group contract until both of them agree.",
  "exists_when": "As a separate person, mostly in groups of 15 to 25 locations and in investor-backed groups. In groups of 5 to 10 locations the owner is usually also the CEO. Planning assumption, checked against the list in week one.",
  "also_called": [
   "President",
   "President and CEO",
   "Founder and CEO",
   "Owner and CEO",
   "Managing Director",
   "Executive Director",
   "Chief Executive"
  ],
  "measured_on": [
   "Visit growth at existing clinics",
   "Profit before interest, taxes, depreciation and amortization (EBITDA)",
   "How fast new clinics reach their target number of visits",
   "Referral volume from physicians and partners",
   "Consistent results across clinics"
  ],
  "worries": [
   "A pilot that works at one clinic and then stalls at the rest",
   "Spending that the board or investors cannot see paying off in the numbers",
   "Pulling managers away while new clinics are opening",
   "Outcome claims the group cannot back up with its own data"
  ],
  "ready_signals": [
   "Visited the pilot page or opened the rollout plan more than once",
   "Watched the 90-second video to the end",
   "Bombora data shows people at the group reading more than usual about patient retention, outcomes reporting or rehab equipment. Topic names are checked against Bombora's topic list in week one",
   "The group announced new clinics, an acquisition or a new investor",
   "The chief clinical officer or a clinic director at the same group replied to outbound email or attended the live demo",
   "Asked for meeting time at the American Physical Therapy Association's Combined Sections Meeting in Philadelphia, February 4 to 6, 2027"
  ],
  "bombora_topics": [
   "Patient retention",
   "Outcomes reporting in physical therapy",
   "Rehab equipment",
   "Practice expansion and new clinic openings",
   "Value-based care, where payment is tied to patient outcomes"
  ],
  "message_a": "Plan-of-care completion is a number you can track the same way in every clinic. NeuroStrip shows patients their muscle activation live at each visit, and a 30-day pilot at one clinic measures completion against that clinic's own numbers before you add more clinics.",
  "message_b": "Run one program you can roll out to every clinic and measure. Start with a 30-day pilot at one clinic, judged on success measures you set, then add clinics one at a time with the same report at each, including records your clinics can share with referring physicians.",
  "offer": "A one-clinic, 30-day pilot with success measures the CEO sets, plus a clinic-by-clinic rollout plan that shows which clinics come next and what each one needs. Pilot cost and terms: confirm in week one.",
  "landing_page": "The pilot page, executive version. One call to action: book a 20-minute pilot scoping call.",
  "sequence": [
   {
    "week": 1,
    "channel": "Outbound email and account-based ads through Propensity",
    "touch": "Plain-text email from the sales rep on message A or B, whichever this contact was assigned at random, asking for 20 minutes to scope a one-clinic pilot. Ads with the 90-second video run all six weeks for groups in the test half. The holdout half gets the same emails and calls without ads."
   },
   {
    "week": 2,
    "channel": "LinkedIn connection from the rep",
    "touch": "The rep sends a connection request and, once connected, shares the one-page rollout plan."
   },
   {
    "week": 3,
    "channel": "Outbound email",
    "touch": "Second email on the same assigned message, with the 90-second video and one question: which clinic would go first?"
   },
   {
    "week": 4,
    "channel": "Rep call",
    "touch": "The rep calls the CEO's assistant or the main line to ask for a pilot scoping call, and mentions any clinical contact at the group who has already engaged."
   },
   {
    "week": 5,
    "channel": "Outbound email",
    "touch": "Email with the clinic-by-clinic rollout plan and an invitation to send the chief clinical officer or a clinic director to the weekly live demo."
   },
   {
    "week": 6,
    "channel": "Outbound email",
    "touch": "Last outbound email, asking whether to come back before the next budget is set. No reply moves the CEO to the executive nurture track."
   }
  ],
  "objections": [
   {
    "objection": "We bought tech before and it sat in a drawer.",
    "answer": "The pilot runs at one clinic for 30 days with usage measures you set, and the rollout plan adds clinics only after a clinic meets them. Training and support for each new clinic are terms we confirm in week one."
   },
   {
    "objection": "Who else like us uses it?",
    "answer": "We will share a customer story from a group like yours, once cleared, and a reference call when a current customer agrees to one. Until then, a 30-day pilot at one of your clinics lets your own team judge it on your own numbers."
   },
   {
    "objection": "Not this budget cycle.",
    "answer": "If the pilot can run before the budget is set, the result will be ready when it is. Pilot cost and terms, including that timing, are what we confirm in week one."
   },
   {
    "objection": "Can we bill for it?",
    "answer": "Your billing team decides that, and Control Bionics will confirm what current customers do. The economics worksheet is built on your visit numbers and assumes no new billing."
   }
  ],
  "proof": [
   "Rollout plan",
   "Pilot guide",
   "Economics worksheet",
   "Evidence summary",
   "A customer story, once cleared"
  ],
  "discovery_questions": [
   "What would a pilot clinic need to show in 30 days for you to approve the next three clinics?",
   "Which numbers do you report to your board or investors each month, and where would plan-of-care completion fit?",
   "Who else has to agree before a group-wide program goes ahead, and who could stop it?"
  ],
  "yes_looks_like": "The CEO agrees to a one-clinic pilot, approves the success measures, names the chief operating officer or practice administrator who will handle the paperwork, and sets a decision date at the end of the 30 days.",
  "stop_when": "Stop outbound after six weeks with no reply, a clear no or a request to stop, and move the CEO to the executive nurture track. Pause executive outreach if a clinical contact at the group is mid-conversation and asks us to wait."
 },
 {
  "id": "coo",
  "title": "Chief Operating Officer (COO)",
  "cluster": "operations",
  "buying_role": "Decides rollout and payment",
  "one_line": "The COO decides whether NeuroStrip is easy to roll out across clinics and can stop it if it adds minutes, training or lost equipment.",
  "role_in_decision": "Judges whether the pilot can scale: minutes per visit, training time, scheduling and where kits are kept. Often owns the budget line the contract is paid from. Can block a rollout after the clinical team says yes, so the COO should hear from us before the pilot ends.",
  "exists_when": "As a separate person, usually only in groups of about 15 or more locations. In smaller groups the same work falls to a director of operations, the practice administrator or the owner. Planning assumption, checked against the list in week one.",
  "also_called": [
   "Vice President of Operations",
   "Director of Operations",
   "Regional Director of Operations",
   "Vice President of Clinical Operations",
   "Regional Manager",
   "Operations Director"
  ],
  "measured_on": [
   "Visits per therapist hour",
   "Cancellations and no-shows",
   "Consistency across clinics",
   "Cost per visit",
   "Time to bring a new clinic up to speed"
  ],
  "worries": [
   "Added minutes per visit",
   "Training time that pulls therapists off the schedule",
   "Lost or damaged devices",
   "One more system for clinic staff to manage",
   "What support and replacements look like, which we confirm in week one"
  ],
  "ready_signals": [
   "Bombora data shows people at the group reading more than usual about electronic medical record (EMR) migration, physical therapy billing software or practice management software. Topic names are checked against Bombora's topic list in week one",
   "Viewed the rollout plan or the pricing questions page",
   "Watched the 90-second video to the end",
   "A clinic director or rehab director at the group asked about a pilot",
   "The group announced new clinics or a regional expansion",
   "Replied to outbound email with an operations question, such as training time or how devices are tracked"
  ],
  "bombora_topics": [
   "Electronic medical record (EMR) migration",
   "Physical therapy billing software",
   "Practice management software",
   "Patient scheduling and no-shows",
   "Clinic staffing and productivity"
  ],
  "message_a": "The sensor goes on like an adhesive bandage and shows readings live on an iPad, so therapists use it during exercises they already run. The pilot times setup at one of your clinics, so you see the real minutes before you decide.",
  "message_b": "One annual price, with everything it includes listed on one page, and a rollout plan that shows what each new clinic needs, from kits to training to the same test steps, before it starts.",
  "offer": "A 20-minute operations walkthrough of setup, charging, storage and training, plus a one-page rollout plan that shows which clinics go first, who gets trained and where kits are kept. Support, training and replacement terms: confirm in week one.",
  "landing_page": "The pilot page, operations version, with the rollout plan on it. One call to action: book a 20-minute operations walkthrough.",
  "sequence": [
   {
    "week": 1,
    "channel": "Outbound email and account-based ads through Propensity",
    "touch": "Plain-text email from the sales rep on message A or B, whichever this contact was assigned at random, offering the one-page rollout plan. Ads with the 90-second video run all six weeks for groups in the test half. The holdout half gets the same emails and calls without ads."
   },
   {
    "week": 2,
    "channel": "Rep call",
    "touch": "The rep calls to offer the operations walkthrough and asks which electronic medical record (EMR) system the clinics use, noting that how NeuroStrip fits that system is something we confirm in week one."
   },
   {
    "week": 3,
    "channel": "Outbound email",
    "touch": "Second email on the same assigned message, with the rollout plan attached and a link to the pricing questions page."
   },
   {
    "week": 4,
    "channel": "Weekly live demo",
    "touch": "Invitation to the weekly live demo, which shows setup from start to finish."
   },
   {
    "week": 5,
    "channel": "LinkedIn connection from the rep",
    "touch": "The rep sends a connection request, and if a clinical contact at the group is engaged, says so in the note."
   },
   {
    "week": 6,
    "channel": "Outbound email",
    "touch": "Last outbound email, with the pilot guide. No reply moves the COO to the operations nurture track."
   }
  ],
  "objections": [
   {
    "objection": "My therapists don't have time.",
    "answer": "The sensor goes on like an adhesive bandage and the readings show live on an iPad during exercises the therapist already runs. The pilot times setup at one clinic, so the decision rests on your own minutes."
   },
   {
    "objection": "Does it work with our electronic medical record (EMR)?",
    "answer": "We confirm in week one how NeuroStrip records fit into an electronic medical record (EMR) and which systems current customers use, and we will not promise an integration before that. The pilot clinic then checks the documentation steps on real visits."
   },
   {
    "objection": "What happens when a sensor gets lost or breaks?",
    "answer": "Replacement and support terms are something we confirm in week one, and the answer goes on the pricing questions page. The rollout plan names where kits are kept at each clinic and who checks them back in."
   },
   {
    "objection": "Training will pull therapists off the schedule.",
    "answer": "Your team can see the full setup at the weekly live demo before anyone commits, and the training format and support for the pilot are what we confirm in week one. The rollout plan schedules training around clinic hours."
   }
  ],
  "proof": [
   "Rollout plan",
   "Live demo",
   "90-second video",
   "Pilot guide",
   "Pricing questions page"
  ],
  "discovery_questions": [
   "When a clinic adds new equipment, who trains the staff, and how long does it usually take?",
   "How do you track shared equipment across clinics today?",
   "What would make you stop a rollout halfway, and what would the pilot clinic need to show to rule that out?"
  ],
  "yes_looks_like": "The COO reviews the rollout plan, agrees where kits are kept and who trains staff, and tells the chief executive officer or owner that the pilot can go ahead at the chosen clinic.",
  "stop_when": "Stop outbound after six weeks with no reply, a clear no or a request to stop. If the group is in the middle of an electronic medical record (EMR) migration and asks us to come back once the switch is done, pause and set a reminder for that date."
 },
 {
  "id": "cco",
  "title": "Chief Clinical Officer",
  "cluster": "clinical",
  "buying_role": "Approves clinically",
  "one_line": "The chief clinical officer decides whether NeuroStrip is sound enough to put in front of patients and into the group's protocols.",
  "role_in_decision": "Gives or withholds clinical approval. Reads the specs and the evidence, writes the pilot criteria, and decides whether a return-to-sport protocol that uses NeuroStrip becomes the group standard. A no here usually ends the deal, even when the owner is eager.",
  "exists_when": "As a separate person, usually in groups of about 15 or more locations. In smaller groups a rehab director, a director of clinical services or the owner does this job. Planning assumption, checked against the list in week one.",
  "also_called": [
   "Vice President of Clinical Services",
   "Vice President of Clinical Excellence",
   "Director of Clinical Services",
   "Director of Clinical Excellence",
   "Clinical Director",
   "Director of Clinical Education",
   "Chief Clinical Director"
  ],
  "measured_on": [
   "Patient outcomes across clinics",
   "Protocol consistency from clinic to clinic",
   "Clinician development and mentoring",
   "Plan-of-care completion",
   "The evidence behind the group's protocols"
  ],
  "worries": [
   "Whether the evidence is strong enough",
   "Signal quality, and whether readings repeat from session to session",
   "Therapists reading more into a number than it can show",
   "A tool that pulls therapists away from the group's protocols"
  ],
  "ready_signals": [
   "Viewed the spec sheet, the clinical primer or the evidence summary",
   "Bombora data shows people at the group reading more than usual about biofeedback, return-to-sport testing or rehab equipment. Topic names are checked against Bombora's topic list in week one",
   "Attended the weekly live demo or sent a senior therapist to it",
   "Came in from a search on surface electromyography or biofeedback terms and read the comparison page",
   "Replied to outbound email with a question about specs or research",
   "Booked a meeting or the 60-second muscle test at our booth at the American Physical Therapy Association's Combined Sections Meeting, February 4 to 6, 2027"
  ],
  "bombora_topics": [
   "Biofeedback",
   "Return-to-sport testing",
   "Rehab equipment",
   "Surface electromyography",
   "Anterior cruciate ligament rehabilitation",
   "Clinical outcomes measurement"
  ],
  "message_a": "Strength tests can miss compensation: a patient can pass a strength or hop test while other muscles cover for the injured one. NeuroStrip shows activation on up to four muscles at once, so your therapists can see it during the test.",
  "message_b": "Build a documented return-to-sport protocol for the group, with the same sensor placement, the same tests and a recorded activation reading at each step, alongside the strength and hop tests you already use.",
  "offer": "The clinical primer, the spec sheet and a one-page evidence summary, then a 20-minute clinical review where the chief clinical officer writes the pilot criteria.",
  "landing_page": "The return-to-play page, with the primer, spec sheet and evidence summary open to read without a form. One call to action: book a 20-minute clinical review to set the pilot criteria.",
  "sequence": [
   {
    "week": 1,
    "channel": "Outbound email and account-based ads through Propensity",
    "touch": "Plain-text email from the sales rep on message A or B, whichever this contact was assigned at random. It cites Forelli and colleagues (2025, Journal of Clinical Medicine), who write that traditional functional tests alone may not reveal arthrogenic muscle inhibition, where the thigh muscle does not fully switch on after anterior cruciate ligament reconstruction, and it offers the evidence summary. Ads with the 90-second video run all six weeks for groups in the test half. The holdout half gets the same emails and calls without ads."
   },
   {
    "week": 2,
    "channel": "LinkedIn connection from the rep",
    "touch": "The rep sends a connection request with the spec sheet."
   },
   {
    "week": 3,
    "channel": "Outbound email",
    "touch": "Second email on the same assigned message, linking to the clinical primer."
   },
   {
    "week": 4,
    "channel": "Weekly live demo",
    "touch": "Invitation to the weekly live demo for the chief clinical officer and one or two senior therapists, plus an offer to meet at the American Physical Therapy Association's Combined Sections Meeting in Philadelphia, February 4 to 6, 2027."
   },
   {
    "week": 5,
    "channel": "Rep call",
    "touch": "The rep calls to offer the 20-minute clinical review and asks what the pilot criteria should be."
   },
   {
    "week": 6,
    "channel": "Outbound email",
    "touch": "Last outbound email, with the evidence summary. No reply moves the contact to the clinical nurture track."
   }
  ],
  "objections": [
   {
    "objection": "Is surface electromyography (sEMG) reliable, and where is the evidence?",
    "answer": "The spec sheet lists 100 decibels of common mode rejection, which is how well it ignores electrical noise from nearby equipment, internal noise of 0.2 microvolts root mean square, which is the sensor's own background signal, and a 0.1 to 1000 hertz bandwidth, the range of signal frequencies it records. Your team can check the signal at the live demo. A 2022 systematic review of 8 randomized trials by Karaborklu Argut and colleagues in Disability and Rehabilitation found electromyography (EMG) biofeedback beat comparison rehab for quadriceps strength in most of them, and the authors say high-quality evidence is limited, which is why your team writes the pilot criteria."
   },
   {
    "objection": "We already test strength with force plates and hop tests.",
    "answer": "Keep them. Force plates and hop tests show what the limb can do, and NeuroStrip shows which muscles are doing the work, which is the kind of gap Forelli and colleagues (2025, Journal of Clinical Medicine) say functional tests alone may not reveal after anterior cruciate ligament reconstruction."
   },
   {
    "objection": "Is it cleared by the Food and Drug Administration (FDA)?",
    "answer": "NeuroStrip is registered and listed with the Food and Drug Administration (FDA) as a non-diagnostic measurement and biofeedback tool, and registration is a different step from clearance. It measures and shows muscle activity, and your clinicians make the clinical calls."
   },
   {
    "objection": "Where does patient data go?",
    "answer": "We confirm in week one where NeuroStrip stores data, who can see it and what agreements Control Bionics signs with clinics. You get that in writing before the pilot starts."
   }
  ],
  "proof": [
   "Clinical primer",
   "Spec sheet: 100 decibels common mode rejection, 0.2 microvolts root mean square internal noise, 0.1 to 1000 hertz bandwidth, up to four sensors with a synchronized accelerometer (motion sensor) and video",
   "Evidence summary covering Karaborklu Argut and colleagues (2022, Disability and Rehabilitation) and Forelli and colleagues (2025, Journal of Clinical Medicine)",
   "More than 500 athletes profiled at Ohio University, from Control Bionics' research page (confirm in week one that it may be used in outreach)",
   "Live demo"
  ],
  "discovery_questions": [
   "How do your therapists decide a patient is ready to return to sport today, and where do they disagree with each other?",
   "What would the readings need to show in a 30-day pilot for you to add NeuroStrip to a protocol?",
   "Which patient group would you start with, such as knee surgery or hamstring injuries, and why?"
  ],
  "yes_looks_like": "The chief clinical officer writes the pilot criteria, picks the patient group and the pilot clinic, and tells the chief executive officer or owner that the pilot has clinical approval.",
  "stop_when": "Stop outbound after six weeks with no reply, a clear no or a request to stop. If the answer is that the evidence is too thin for now, move the contact to the clinical nurture track and send each update to the evidence summary."
 },
 {
  "id": "rehab",
  "title": "Rehab Director",
  "cluster": "clinical",
  "buying_role": "Approves clinically",
  "one_line": "The rehab director controls equipment spend and how new tools reach the therapists, so this person decides whether NeuroStrip gets used every week.",
  "role_in_decision": "Approves the tool for clinical use in groups without a chief clinical officer, and recommends it to the chief clinical officer in larger groups. Usually controls the equipment budget and the training calendar, and picks which therapists try it first.",
  "exists_when": "Common at every size from 5 to 25 locations. In smaller groups this person is often the senior clinician on the leadership team and still treats patients. Planning assumption, checked against the list in week one.",
  "also_called": [
   "Director of Rehabilitation",
   "Director of Rehab Services",
   "Rehabilitation Manager",
   "Director of Physical Therapy",
   "Therapy Director",
   "Director of Sports Medicine",
   "Clinical Manager"
  ],
  "measured_on": [
   "Equipment spend against budget",
   "How many therapists actually use new tools and protocols",
   "Patient outcomes in the caseloads they oversee",
   "Therapist productivity",
   "Staff training and retention"
  ],
  "worries": [
   "Buying equipment the staff don't use",
   "Training time across several clinics",
   "Whether one tool fits orthopedic, sports and neurological patients",
   "Signal quality on real patients outside a lab"
  ],
  "ready_signals": [
   "Registered for or attended the weekly live demo",
   "Bombora data shows people at the group reading more than usual about rehab equipment, biofeedback or return-to-sport testing. Topic names are checked against Bombora's topic list in week one",
   "Watched the 90-second video more than once, or a second person at the same group watched it",
   "Viewed the comparison page or the spec sheet",
   "Asked what a pilot kit includes",
   "Booked the 60-second muscle test at our booth at the American Physical Therapy Association's Combined Sections Meeting"
  ],
  "bombora_topics": [
   "Rehab equipment",
   "Biofeedback",
   "Return-to-sport testing",
   "Physical therapy equipment purchasing",
   "Neurological rehabilitation"
  ],
  "message_a": "A patient can pass a strength test while other muscles cover for the injured one. NeuroStrip shows up to four muscles at once, live on an iPad, so your therapists see it during the exercise and can use the screen to coach the patient's next rep.",
  "message_b": "Give every therapist in the group the same return-to-sport steps, with the same sensor placement, the same tests and a recorded activation reading at each step, so new therapists learn one method and you can review the same record from every clinic.",
  "offer": "A live demo for the rehab director's team, then a pilot kit for one clinic. Kit contents and pilot terms: confirm in week one.",
  "landing_page": "The demo page. One call to action: save seats for your team at the weekly live demo.",
  "sequence": [
   {
    "week": 1,
    "channel": "Outbound email and account-based ads through Propensity",
    "touch": "Plain-text email from the sales rep on message A or B, whichever this contact was assigned at random, with the 90-second video and an invitation to bring the team to the weekly live demo. Ads run all six weeks for groups in the test half. The holdout half gets the same emails and calls without ads."
   },
   {
    "week": 2,
    "channel": "Rep call",
    "touch": "The rep calls to offer a private live demo for the team and asks which caseloads they would try first."
   },
   {
    "week": 3,
    "channel": "Outbound email",
    "touch": "Second email on the same assigned message, with the spec sheet."
   },
   {
    "week": 4,
    "channel": "Weekly live demo",
    "touch": "Reminder for the weekly live demo, plus an offer of a time for the 60-second muscle test at our booth at the Combined Sections Meeting in Philadelphia, February 4 to 6, 2027."
   },
   {
    "week": 5,
    "channel": "LinkedIn connection from the rep",
    "touch": "The rep sends a connection request with a short note on what a pilot kit includes, with kit terms to confirm in week one."
   },
   {
    "week": 6,
    "channel": "Outbound email",
    "touch": "Last outbound email, with the pilot guide. No reply moves the contact to the clinical nurture track."
   }
  ],
  "objections": [
   {
    "objection": "It costs more than a $499 biofeedback unit.",
    "answer": "A single-channel unit, which lists from $499 at mTrigger, reads one muscle at a time. NeuroStrip reads up to four at once, so your therapists can compare both sides or two muscle groups in one exercise, and if one muscle covers your caseload, the cheaper unit may be enough."
   },
   {
    "objection": "We bought tech before and it sat in a drawer.",
    "answer": "The pilot runs at one clinic for 30 days with therapists you pick and a weekly usage count, so you see whether they use it before anyone buys more. Training and support during the pilot are terms we confirm in week one."
   },
   {
    "objection": "Is surface electromyography (sEMG) reliable on real patients?",
    "answer": "The spec sheet lists 100 decibels of common mode rejection, which is how well it ignores electrical noise from nearby equipment, plus internal noise of 0.2 microvolts root mean square, the sensor's own background signal. Your therapists can try it on each other at the live demo, and the pilot then shows how it reads on your own patients."
   },
   {
    "objection": "Training will pull therapists off the schedule.",
    "answer": "Your team sees the full setup at the weekly live demo first, and the training format and support for the pilot are what we confirm in week one. You choose which therapists start, so the rest of the schedule stays as it is."
   }
  ],
  "proof": [
   "Live demo",
   "90-second video",
   "Spec sheet",
   "Pilot guide",
   "Evidence summary"
  ],
  "discovery_questions": [
   "What equipment have you bought in the last two years that your therapists still use every week, and why did it stick?",
   "Which caseload would you try this on first, and which therapists would run it?",
   "Who signs off on equipment spend above your own limit?"
  ],
  "yes_looks_like": "The rehab director brings the team to a live demo, asks for a pilot kit, names the pilot therapists, and takes the pilot guide to the owner or chief clinical officer.",
  "stop_when": "Stop outbound after six weeks with no reply, a clear no or a request to stop, and move the contact to the clinical nurture track. If the reply is that the equipment budget is spent, set a reminder for the next budget cycle."
 },
 {
  "id": "admin",
  "title": "Practice Administrator",
  "cluster": "operations",
  "buying_role": "Decides rollout and payment",
  "one_line": "The practice administrator handles the paperwork and checks the costs for rollout and payment. This person rarely makes the final call but can stall the deal if questions go unanswered.",
  "role_in_decision": "Handles contracts, vendor setup and price checks, and asks about billing, hidden costs and data security. On billing, the clinic's billing team decides and Control Bionics will confirm what current customers do. Data security and support answers are ones we confirm in week one. Rarely the buyer, but often the person who moves the pilot agreement forward or lets it sit.",
  "exists_when": "In almost every group from 5 to 25 locations, under one of several titles. In groups of 5 to 10 locations this person often runs billing and the front office too. Planning assumption, checked against the list in week one.",
  "also_called": [
   "Practice Manager",
   "Office Manager",
   "Business Manager",
   "Business Office Manager",
   "Billing Manager",
   "Revenue Cycle Manager",
   "Administrator",
   "Operations Manager"
  ],
  "measured_on": [
   "Insurance claims paid the first time they are sent, and collections",
   "Front-office time",
   "Vendor costs against budget",
   "Compliance with healthcare rules",
   "Smooth setup of new vendors"
  ],
  "worries": [
   "Billing problems if a visit is coded wrong",
   "Hidden costs beyond the annual price",
   "Office time to set up and track another vendor",
   "Where patient data goes and how it is protected, which we confirm in week one"
  ],
  "ready_signals": [
   "Bombora data shows people at the group reading more than usual about physical therapy billing software or electronic medical record (EMR) migration. Topic names are checked against Bombora's topic list in week one",
   "Viewed the pricing questions page",
   "Asked for the pilot agreement or a price sheet",
   "Was copied on an email by the owner, the chief executive officer or a clinic director",
   "Sent a billing or compliance question by email"
  ],
  "bombora_topics": [
   "Physical therapy billing software",
   "Electronic medical record (EMR) migration",
   "Revenue cycle management, meaning billing and collections",
   "Healthcare compliance",
   "Practice management software"
  ],
  "message_a": "Most of the work happens in the treatment room, where therapists put the sensors on and read them on an iPad. The pilot guide lists each step your office handles, from vendor setup to where kits are kept, so you can see the office time before anyone signs.",
  "message_b": "One annual price, with everything it includes listed on one page, so you know the full cost before anyone signs.",
  "offer": "A pricing questions page that lists what the annual price includes, says the clinic's billing team decides on billing, and answers data security and support questions in writing once we confirm them in week one. Also the pilot agreement to review early, with pilot terms to confirm in week one.",
  "landing_page": "The pricing questions page. One call to action: request the pilot agreement, whose terms we confirm in week one.",
  "sequence": [
   {
    "week": 1,
    "channel": "Outbound email and account-based ads through Propensity",
    "touch": "Plain-text email from the sales rep on message A or B, whichever this contact was assigned at random, sent once an executive or clinical contact at the group has engaged, with a link to the pricing questions page. Ads run all six weeks for groups in the test half. The holdout half gets the same emails and calls without ads."
   },
   {
    "week": 2,
    "channel": "Rep call",
    "touch": "The rep calls to ask what the office needs to process a pilot and who handles vendor setup."
   },
   {
    "week": 3,
    "channel": "Outbound email",
    "touch": "Second email on the same assigned message, with the pilot guide."
   },
   {
    "week": 4,
    "channel": "Nurture email",
    "touch": "Nurture email on billing and data. It says the clinic's billing team decides on billing and that Control Bionics will confirm what current customers do, and it lists the data security and support answers we confirm in week one."
   },
   {
    "week": 5,
    "channel": "Outbound email",
    "touch": "Email with the pilot agreement for early review, with pilot terms to confirm in week one."
   },
   {
    "week": 6,
    "channel": "Rep call",
    "touch": "The rep calls to walk through the pilot agreement, with the terms we confirm in week one, and to agree who signs. No reply keeps the contact on nurture email."
   }
  ],
  "objections": [
   {
    "objection": "Can we bill for it?",
    "answer": "Your billing team decides that, and we make no billing promises. Control Bionics will confirm what current customers do and send it to your billing team."
   },
   {
    "objection": "Where does patient data go?",
    "answer": "We confirm in week one where NeuroStrip stores data, who can see it and what agreements Control Bionics signs with clinics. You get those answers in writing before the pilot agreement is signed."
   },
   {
    "objection": "What does the pilot cost, and what are we signing?",
    "answer": "The pilot agreement sets the clinic, the 30-day length and the success measures your team chooses. Cost and the remaining pilot terms are what we confirm in week one, and you get them before anyone signs."
   },
   {
    "objection": "Are there costs beyond the annual price?",
    "answer": "The pricing questions page lists what the annual price includes. Replacement sensors and support are terms we confirm in week one, and they go on that page once settled."
   }
  ],
  "proof": [
   "Pricing questions page",
   "Pilot agreement, with terms we confirm in week one",
   "Economics worksheet",
   "Rollout plan"
  ],
  "discovery_questions": [
   "What does your office need from a new vendor before a pilot can start?",
   "Who on your billing team should get the summary of what current customers do once Control Bionics confirms it?",
   "How long does a vendor agreement usually take to sign here, and who signs it?"
  ],
  "yes_looks_like": "The practice administrator has the pricing questions page, gets written answers on data security and support once we confirm them in week one, sends the pilot agreement for signature and sets up Control Bionics as a vendor.",
  "stop_when": "Pause direct outreach if no executive or clinical contact at the group is active, or after six weeks with no reply, and keep the contact on nurture email. Stop at once on a request to stop."
 },
 {
  "id": "director",
  "title": "Clinic Director",
  "cluster": "clinical",
  "buying_role": "Runs the pilot",
  "one_line": "The clinic director runs one clinic and the pilot inside it, and is often the first person in a group to push for NeuroStrip.",
  "role_in_decision": "Runs the 30-day pilot at their clinic: picks patients, trains therapists, logs use and reports results. Takes the case to the owner, rehab director or chief clinical officer, and needs help getting the group's leadership to agree.",
  "exists_when": "At almost every clinic, in groups of every size. In groups of 5 to 10 locations a clinic director may also sit on the leadership team. Planning assumption, checked against the list in week one.",
  "also_called": [
   "Site Director",
   "Center Manager",
   "Clinic Manager",
   "Center Director",
   "Facility Director",
   "Site Manager",
   "Lead Physical Therapist",
   "Clinic Lead"
  ],
  "measured_on": [
   "Visits and plan-of-care completion at their clinic",
   "Therapist productivity and a full schedule",
   "Patient satisfaction",
   "Keeping their therapists",
   "New referrals into their clinic"
  ],
  "worries": [
   "Time taken from patients",
   "Getting the group's leadership to agree",
   "Owning a pilot that falls flat",
   "Learning a new tool while running a full schedule"
  ],
  "ready_signals": [
   "Watched the 90-second video to the end",
   "Registered for the weekly live demo",
   "Bombora data shows people at the group reading more than usual about biofeedback or return-to-sport testing. Topic names are checked against Bombora's topic list in week one",
   "Replied to outbound email about a return-to-sport patient",
   "Asked for the leadership kit",
   "Did the 60-second muscle test at our booth at the American Physical Therapy Association's Combined Sections Meeting, February 4 to 6, 2027"
  ],
  "bombora_topics": [
   "Biofeedback",
   "Return-to-sport testing",
   "Patient engagement in physical therapy",
   "Sports physical therapy"
  ],
  "message_a": "A patient can pass a hop test while other muscles cover for the injured one. NeuroStrip puts up to four muscles on an iPad during the test, so you and the patient see which muscles are doing the work.",
  "message_b": "Run the group's first documented return-to-sport protocol at your clinic, with the same sensor placement, the same tests and a recorded reading at each step. You get a 30-day pilot plan and a leadership kit, so the case is ready when you ask.",
  "offer": "The 90-second video, a seat at the weekly live demo, and a leadership kit with the pilot guide, the economics worksheet and the evidence summary to bring to the owner, rehab director or chief clinical officer.",
  "landing_page": "The demo page, with the 90-second video at the top and no form to watch it. One call to action: save a seat at the weekly live demo.",
  "sequence": [
   {
    "week": 1,
    "channel": "Outbound email and account-based ads through Propensity",
    "touch": "Plain-text email from the sales rep on message A or B, whichever this contact was assigned at random, with the one-athlete hamstring example and the 90-second video. Ads run all six weeks for groups in the test half. The holdout half gets the same emails and calls without ads."
   },
   {
    "week": 2,
    "channel": "Weekly live demo",
    "touch": "Invitation to the weekly live demo, which shows setup from start to finish on a real leg."
   },
   {
    "week": 3,
    "channel": "Outbound email",
    "touch": "Second email on the same assigned message, with the leadership kit."
   },
   {
    "week": 4,
    "channel": "Rep call",
    "touch": "The rep calls the clinic to ask what leadership would need to approve a pilot, and offers to join a call with the owner or rehab director."
   },
   {
    "week": 5,
    "channel": "LinkedIn connection from the rep",
    "touch": "The rep sends a connection request and offers a time for the 60-second muscle test at our booth at the Combined Sections Meeting in Philadelphia, February 4 to 6, 2027."
   },
   {
    "week": 6,
    "channel": "Outbound email",
    "touch": "Last outbound email, with the pilot guide. No reply moves the contact to the clinical nurture track."
   }
  ],
  "objections": [
   {
    "objection": "My therapists don't have time.",
    "answer": "It goes on like an adhesive bandage and shows live on an iPad during exercises your therapists already run. In the pilot you pick which therapists use it, and the clinic times setup so leadership sees real minutes."
   },
   {
    "objection": "Corporate won't approve another tool.",
    "answer": "The leadership kit puts the pilot guide, the economics worksheet and the evidence summary in one place, and the rep can join your call with the owner or rehab director. The ask is one clinic for 30 days, with success measures leadership sets."
   },
   {
    "objection": "We already test strength with force plates and hop tests.",
    "answer": "Keep them. Those tests show what the limb can do, and NeuroStrip shows which muscles are doing the work, live, during the same visit."
   },
   {
    "objection": "Does it work with our electronic medical record (EMR)?",
    "answer": "How NeuroStrip records fit into your electronic medical record (EMR) is something we confirm in week one. During the pilot your clinic checks the documentation steps on real visits."
   }
  ],
  "proof": [
   "90-second video",
   "Live demo",
   "Pilot guide",
   "Leadership kit with the pilot guide, economics worksheet and evidence summary",
   "A customer story, once cleared"
  ],
  "discovery_questions": [
   "How many of your current patients are working toward a return to sport or a big activity goal?",
   "When you want something new for your clinic, who do you have to convince, and what do they ask for?",
   "If you ran a 30-day pilot, which therapists would use it and on which patients?"
  ],
  "yes_looks_like": "The clinic director attends a live demo, asks for the leadership kit, and gets the owner, rehab director or chief clinical officer onto a pilot scoping call with their clinic named as the pilot site.",
  "stop_when": "Stop outbound after six weeks with no reply, a clear no or a request to stop, and move the contact to the clinical nurture track. If the director is eager but leadership says no, keep the director on nurture and try again before the next budget cycle."
 }
]/*roles@*/,
  bySize: /*@bySize*/[
 {
  "size": "5 to 10 locations",
  "who_exists": "An owner who is often also the chief executive officer and still treats patients, a clinic director at each clinic, a practice administrator or office manager, and often a rehab director who is also a senior clinician. A separate chief operating officer or chief clinical officer is unusual at this size. Planning assumption, checked against the list in week one.",
  "contact_first": "The owner as the executive and one clinic director as the clinical contact. In weeks 5 to 8 of the plan these groups are split at random, so half start with the owner and half start with the clinic director, and the second contact hears from us a week later. The practice administrator comes in once either one engages.",
  "why": "The owner signs and often treats patients, so a clinical message can land with the person who pays. The clinic director runs the pilot and can vouch for it from the clinic floor, and every group still hears from one executive and one clinical contact."
 },
 {
  "size": "11 to 14 locations",
  "who_exists": "An owner or chief executive officer, a rehab director who leads clinical work, a clinic director at each clinic, and a practice administrator or director of operations. A separate chief operating officer sometimes appears at this size. Planning assumption, checked against the list in week one.",
  "contact_first": "The owner or chief executive officer as the executive and the rehab director as the clinical contact, with the starting order split at random by group in weeks 5 to 8 of the plan to compare starting with the clinical contact against starting with the executive. The practice administrator or director of operations hears from us before the pilot agreement goes out.",
  "why": "At this size the rehab director usually controls equipment spend and whether therapists take up new tools, while the owner or chief executive officer still signs. Operations can slow the paperwork or the rollout, so they get the rollout plan early, and every group still hears from one executive and one clinical contact."
 },
 {
  "size": "15 to 25 locations",
  "who_exists": "A separate chief executive officer, chief operating officer and chief clinical officer become likely, often with an owner or investor group above them, plus rehab directors, practice administrators and a clinic director at each clinic. Planning assumption, checked against the list in week one.",
  "contact_first": "The chief clinical officer as the clinical contact and the chief executive officer as the executive, with the starting order split at random by group in weeks 5 to 8 of the plan to compare starting with the clinical contact against starting with the executive. The chief operating officer gets the rollout plan as soon as either one engages, and a clinic director is named as pilot lead.",
  "why": "Clinical approval, rollout and the signature sit with three different people at this size. The chief clinical officer sets protocol, the chief operating officer can stop a rollout and the chief executive officer signs, so each one needs their own message before the pilot ends."
 }
]/*bySize@*/,
  objections: /*@objections*/[
 {
  "objection": "We already test strength with force plates and hop tests.",
  "raised_by": [
   "cco",
   "rehab",
   "director",
   "owner"
  ],
  "answer": "Keep them, because NeuroStrip adds to them. Force plates and hop tests show what the limb can do and NeuroStrip shows which muscles are doing the work, as in one athlete's example from Control Bionics: three weeks after a hamstring injury, force plates showed a 7% gap between legs and NeuroStrip on both hamstrings showed a 37% gap in muscle activation.",
  "proof_asset": "90-second video",
  "follow_up": "When a patient passes your strength test, how do your therapists see whether the injured muscle is doing its share?",
  "week_one": false,
  "week_one_item": ""
 },
 {
  "objection": "My therapists don't have time.",
  "raised_by": [
   "director",
   "coo",
   "rehab",
   "owner"
  ],
  "answer": "The sensor goes on like an adhesive bandage and shows live on an iPad during exercises the therapist already runs. The pilot times setup at one clinic, so the decision rests on your own minutes.",
  "proof_asset": "Live demo",
  "follow_up": "Where in a typical visit would one more step hurt the most?",
  "week_one": false,
  "week_one_item": ""
 },
 {
  "objection": "It costs more than a $499 biofeedback unit.",
  "raised_by": [
   "owner",
   "admin",
   "rehab",
   "coo"
  ],
  "answer": "A single-channel unit, which lists from $499 at mTrigger, reads one muscle at a time. NeuroStrip reads up to four at once with a synchronized motion sensor and video, and if one muscle at a time covers your caseload we will say the cheaper unit may be enough.",
  "proof_asset": "Comparison page",
  "follow_up": "How often do your therapists need to compare both legs, or two muscles, in the same exercise?",
  "week_one": false,
  "week_one_item": ""
 },
 {
  "objection": "Can we bill for it?",
  "raised_by": [
   "owner",
   "admin",
   "ceo",
   "coo"
  ],
  "answer": "Your billing team decides that, and we make no billing promises. Control Bionics will confirm what current customers do, and the economics worksheet assumes no new billing.",
  "proof_asset": "Economics worksheet",
  "follow_up": "Who on your billing team should get the summary of what current customers do?",
  "week_one": true,
  "week_one_item": "What current customers do about billing, gathered by Control Bionics and checked by compliance, with no coding advice in it."
 },
 {
  "objection": "Is surface electromyography (sEMG) reliable, and where is the evidence?",
  "raised_by": [
   "cco",
   "rehab",
   "director"
  ],
  "answer": "The spec sheet lists 100 decibels of common mode rejection (how well it ignores electrical noise from nearby equipment), 0.2 microvolts root mean square of internal noise and a 0.1 to 1000 hertz bandwidth, and your team can check the signal at the live demo. A 2022 systematic review of 8 randomized trials by Karaborklu Argut and colleagues found electromyography (EMG) biofeedback beat comparison rehab for quadriceps strength in most of them, and the authors say high-quality evidence is limited, so your team writes the pilot criteria.",
  "proof_asset": "Spec sheet and evidence summary",
  "follow_up": "What would the readings need to show in a 30-day pilot for your team to trust them?",
  "week_one": false,
  "week_one_item": ""
 },
 {
  "objection": "We bought tech before and it sat in a drawer.",
  "raised_by": [
   "owner",
   "ceo",
   "coo",
   "rehab"
  ],
  "answer": "The pilot runs at one clinic for 30 days with a named clinic director and usage measures you choose, so you see whether therapists reach for it before it goes further. Training and support during the pilot are terms we confirm in week one.",
  "proof_asset": "Pilot guide",
  "follow_up": "What went wrong with the last tool that ended up in a drawer?",
  "week_one": true,
  "week_one_item": "Training and support offered during the 30-day pilot and after rollout."
 },
 {
  "objection": "Not this budget cycle.",
  "raised_by": [
   "owner",
   "ceo",
   "coo",
   "admin"
  ],
  "answer": "If a 30-day pilot at one clinic can run before the next budget is set, your own numbers will be ready when it is. Pilot cost and terms, including that timing, are what we confirm in week one.",
  "proof_asset": "Pilot guide",
  "follow_up": "When is your next budget set, and what would you need in hand by then?",
  "week_one": true,
  "week_one_item": "Pilot cost and terms, including whether a pilot can start before a budget is approved."
 },
 {
  "objection": "Does it work with our electronic medical record (EMR)?",
  "raised_by": [
   "coo",
   "admin",
   "director",
   "cco"
  ],
  "answer": "We confirm in week one how NeuroStrip records fit into an electronic medical record (EMR) and which systems current customers use, and we will not promise an integration before then. During the pilot your clinic director checks the documentation steps on real visits.",
  "proof_asset": "Pricing questions page",
  "follow_up": "Which electronic medical record (EMR) system do your clinics use, and is a switch to a new one planned this year?",
  "week_one": true,
  "week_one_item": "Whether NeuroStrip connects to or exports into the main physical therapy electronic medical record (EMR) systems, and how current customers record it in the patient's chart."
 },
 {
  "objection": "Where does patient data go?",
  "raised_by": [
   "admin",
   "coo",
   "cco",
   "ceo"
  ],
  "answer": "We confirm in week one where NeuroStrip stores data, who can see it and what agreements Control Bionics signs with clinics. Your practice administrator gets those answers in writing before the pilot agreement is signed.",
  "proof_asset": "Pilot agreement",
  "follow_up": "Who signs off on data security for a new vendor, and what should our written answers, confirmed in week one, cover?",
  "week_one": true,
  "week_one_item": "Where data is stored, who can access it, and whether Control Bionics signs a business associate agreement, the patient privacy contract that clinics ask vendors to sign under the Health Insurance Portability and Accountability Act (HIPAA)."
 },
 {
  "objection": "Who else like us uses it?",
  "raised_by": [
   "owner",
   "ceo",
   "cco",
   "coo"
  ],
  "answer": "We will share a customer story from a group like yours, once cleared, and a reference call when a current customer agrees to one. Until then, a 30-day pilot at one of your clinics lets your own team judge it.",
  "proof_asset": "A customer story, once cleared",
  "follow_up": "Would a call with a group your size be useful once a customer agrees to it?",
  "week_one": true,
  "week_one_item": "Which customers Control Bionics has cleared to name, and which will take a reference call."
 },
 {
  "objection": "Is it cleared by the Food and Drug Administration (FDA)?",
  "raised_by": [
   "cco",
   "admin",
   "ceo"
  ],
  "answer": "NeuroStrip is registered and listed with the Food and Drug Administration (FDA) as a non-diagnostic measurement and biofeedback tool, and registration is a different step from clearance. It measures and shows muscle activity, and your clinicians make the clinical calls.",
  "proof_asset": "Spec sheet",
  "follow_up": "Does your compliance lead need the registration details in writing?",
  "week_one": false,
  "week_one_item": ""
 },
 {
  "objection": "Most of our patients are older adults and post-surgical cases, and we see few athletes.",
  "raised_by": [
   "owner",
   "rehab",
   "director",
   "ceo"
  ],
  "answer": "The 2022 systematic review by Karaborklu Argut and colleagues looked at electromyography (EMG) biofeedback after orthopedic knee surgeries, and the pilot can run on whichever post-surgical caseload you choose. Your billing team decides on billing for every patient, and Control Bionics will confirm what current customers do.",
  "proof_asset": "Clinical primer and evidence summary",
  "follow_up": "Which post-surgical patients take the most visits to get their strength back?",
  "week_one": true,
  "week_one_item": "What current customers do about billing, confirmed by Control Bionics, with no coding advice in it."
 },
 {
  "objection": "What happens when a sensor gets lost or breaks?",
  "raised_by": [
   "coo",
   "admin",
   "rehab"
  ],
  "answer": "Replacement and support terms are something we confirm in week one, and the answer goes on the pricing questions page. The rollout plan names where kits are kept at each clinic and who checks them back in.",
  "proof_asset": "Rollout plan",
  "follow_up": "How do your clinics track shared equipment today?",
  "week_one": true,
  "week_one_item": "Replacement policy and cost for lost or damaged sensors, and support hours."
 },
 {
  "objection": "Training will pull therapists off the schedule.",
  "raised_by": [
   "coo",
   "director",
   "rehab"
  ],
  "answer": "Your team can see the whole setup at the weekly live demo before anyone commits, and the training format and support for the pilot are what we confirm in week one. You choose which therapists start, so the rest of the schedule stays as it is.",
  "proof_asset": "Live demo",
  "follow_up": "When in the week could two or three therapists spare time to learn it?",
  "week_one": true,
  "week_one_item": "Training format, length and who delivers it, during the pilot and at each new clinic."
 },
 {
  "objection": "What does the pilot cost, and what are we signing?",
  "raised_by": [
   "admin",
   "owner",
   "coo",
   "ceo"
  ],
  "answer": "The pilot agreement sets the clinic, the 30-day length and the success measures your team chooses. Cost and the remaining terms are what we confirm in week one, and you get them before anyone signs.",
  "proof_asset": "Pilot agreement",
  "follow_up": "Who reviews vendor agreements on your side, and how long does that usually take?",
  "week_one": true,
  "week_one_item": "Pilot cost, number of kits, return terms and what happens at day 30."
 },
 {
  "objection": "Are there costs beyond the annual price?",
  "raised_by": [
   "admin",
   "owner",
   "coo"
  ],
  "answer": "The pricing questions page lists what the annual price includes. Replacement sensors and support are terms we confirm in week one, and they go on that page once settled.",
  "proof_asset": "Pricing questions page",
  "follow_up": "Which costs have surprised you with other vendors after signing?",
  "week_one": true,
  "week_one_item": "What the annual price includes, and the cost of replacement sensors and support."
 },
 {
  "objection": "Corporate won't approve another tool.",
  "raised_by": [
   "director",
   "rehab"
  ],
  "answer": "The pilot guide and the economics worksheet give leadership the case in one place, and the rep can join your call with the owner or rehab director. The ask is one clinic for 30 days, with success measures leadership sets.",
  "proof_asset": "Pilot guide and economics worksheet",
  "follow_up": "Who would you need to convince, and what would they want to see first?",
  "week_one": false,
  "week_one_item": ""
 },
 {
  "objection": "We're in the middle of an electronic medical record (EMR) migration.",
  "raised_by": [
   "coo",
   "admin"
  ],
  "answer": "The pilot can run at a clinic that has already switched, or at one that switches later, so it stays out of the way of the switch-over. How NeuroStrip records fit your new electronic medical record (EMR) is something we confirm in week one.",
  "proof_asset": "Rollout plan",
  "follow_up": "Which clinics finish the switch first, and when?",
  "week_one": true,
  "week_one_item": "How NeuroStrip records fit the main physical therapy electronic medical record (EMR) systems."
 }
]/*objections@*/,
  campaign: /*@campaign*/{
 "idea": "Strength tests tell a clinic how much force a limb produces, and NeuroStrip shows which muscles are producing it, live on an iPad or tablet, in the same session. Every piece of the campaign puts those two views side by side and then asks each buyer to see it in their own group with a 30-day pilot at one clinic.",
 "line": "See the muscle behind the number.",
 "clusters": [
  {
   "cluster": "executive",
   "headline": "Let patients see their progress, in every clinic you run.",
   "message_a": "Patients who can see their progress have one more reason to finish their plan of care, which is the full set of visits their therapist prescribes. NeuroStrip puts muscle activation on an iPad at each visit, so the patient watches the muscle they are rebuilding at work. The pilot then tracks visits per plan of care against the clinic's own baseline.",
   "message_b": "The group starts with a 30-day pilot at one clinic, with success measures its own team chooses. If the clinic meets them, other locations can join on the same contract and track the same measures, so leadership can compare clinics side by side. Pilot and contract terms: confirm in week one."
  },
  {
   "cluster": "operations",
   "headline": "On in seconds, live on an iPad, at one clear annual price.",
   "message_a": "Each 4-gram sensor goes on like an adhesive bandage and shows muscle activation live on an iPad or tablet, with up to four sensors at once. There are no wires to manage and no lab to book, so it fits inside a normal treatment session.",
   "message_b": "Annual pricing, what it includes and answers to common questions sit on one pricing questions page. Support, data security and electronic medical record (EMR) integration go on that page once each is confirmed in week one. Billing questions go to the clinic's billing team, and Control Bionics will confirm what current customers do."
  },
  {
   "cluster": "clinical",
   "headline": "See when other muscles cover for an injured one, and document it.",
   "message_a": "A patient can pass a strength test while other muscles cover for the injured one. Clinicians call this compensation. NeuroStrip shows activation on up to four muscles at once, on both sides and live, so the clinician can see what a force number can miss. In one athlete's example, three weeks after a hamstring injury, force plates showed a 7% gap between legs and NeuroStrip on both hamstrings showed a 37% gap in activation.",
   "message_b": "NeuroStrip adds an activation measure to each stage of a written return-to-sport protocol, recorded with synced video, so each decision has a documented record behind it. The clinician still makes every call, and the patient can see the same screen."
  }
 ],
 "storyboard": {
  "cluster": "clinical",
  "frames": [
   {
    "time": "0 to 2 s",
    "visual": "A bright outpatient clinic. An athlete in shorts stands with one foot on each of two force plates while a clinician watches a laptop beside them.",
    "on_screen": "One athlete, three weeks after a hamstring injury",
    "voiceover": "Three weeks after a hamstring injury,"
   },
   {
    "time": "2 to 5 s",
    "visual": "Close-up of the laptop. Two force bars for the left and right legs sit almost level, with a small label showing the 7% difference.",
    "on_screen": "Force plates: 7% gap between legs",
    "voiceover": "force plates showed a 7% gap."
   },
   {
    "time": "5 to 8 s",
    "visual": "The clinician presses a NeuroStrip sensor onto the back of each thigh like an adhesive bandage, then lifts an iPad. Two live activation traces start moving, one clearly lower than the other.",
    "on_screen": "NeuroStrip on both hamstrings: 37% gap in activation",
    "voiceover": "NeuroStrip showed a 37% gap in activation."
   },
   {
    "time": "8 to 10 s",
    "visual": "Split screen. On the left, the nearly level force bars. On the right, the uneven activation traces, with the injured side lower.",
    "on_screen": "Strength tests can miss which muscle is doing the work",
    "voiceover": "Strength tests can miss it."
   },
   {
    "time": "10 to 13 s",
    "visual": "The clinician taps save on the iPad. The saved session opens with its synced video clip beside the traces, and the athlete leans in to look at the same screen.",
    "on_screen": "Add activation to each stage of your return-to-sport protocol",
    "voiceover": "See it live and document every stage."
   },
   {
    "time": "13 to 15 s",
    "visual": "End card on a dark background. The two traces fade into the NeuroStrip logo and the Control Bionics wordmark.",
    "on_screen": "See the muscle behind the number. Read the clinical primer. Small print: One athlete's example, re-enacted by an actor. NeuroStrip is a non-diagnostic measurement and biofeedback tool.",
    "voiceover": "NeuroStrip. See the muscle behind the number."
   }
  ],
  "cta": "Read the clinical primer"
 },
 "display": {
  "frames": [
   {
    "name": "The gap",
    "long": "One athlete's force plates showed a 7% gap between legs",
    "short": "One athlete's force gap: 7%"
   },
   {
    "name": "The trace",
    "long": "NeuroStrip on the same hamstrings showed a 37% gap",
    "short": "Same athlete's muscle gap: 37%"
   },
   {
    "name": "The pilot offer",
    "long": "See the muscle behind the number. Pilot it at one clinic.",
    "short": "Pilot it at one clinic"
   }
  ],
  "cta": "Book a pilot call"
 },
 "carousel": {
  "intro": "For owners of physical therapy groups with 5 to 25 clinics: how NeuroStrip puts patient progress on screen, and how to test it at one clinic first.",
  "cards": [
   {
    "headline": "Progress your patients can see",
    "sub": "NeuroStrip shows muscle activation live on an iPad at every visit."
   },
   {
    "headline": "A reason to finish the plan of care",
    "sub": "Patients watch the muscle they are rebuilding, visit after visit."
   },
   {
    "headline": "Start with one clinic for 30 days",
    "sub": "Your team picks the measures, such as visits per plan of care."
   },
   {
    "headline": "Then add your other clinics",
    "sub": "Each new clinic tracks the same measures, so you can compare them."
   },
   {
    "headline": "Run the numbers on your own visits",
    "sub": "The economics worksheet starts from your visits and revenue."
   }
  ],
  "cta": "Get the economics worksheet"
 },
 "native": {
  "headline": "What a strength test can miss after a hamstring injury",
  "body": "In one athlete's example, force plates showed a 7% gap and muscle activation a 37% gap. Watch the 90-second video.",
  "context": "Runs in the Propensity ad test aimed at the target groups, placed next to articles on physical therapy industry sites about return-to-sport testing, knee and hamstring rehab, and outcome measures. Clinic directors and rehab directors read these articles."
 },
 "mail": {
  "box_front": "See the muscle behind the number. Inside for {first name}: a sample strip at actual size and an estimate for {practice} that your team can redo with its own numbers.",
  "letter_headline": "{first name}, here is what one clinic would need to show at {practice}",
  "letter_body": [
   "Patients who can see their progress have one more reason to finish their plan of care. NeuroStrip is a 4-gram wireless sensor that shows muscle activation live on an iPad or tablet, so at each visit a patient can watch the muscle they are rebuilding do its work.",
   "Your clinicians already measure strength. NeuroStrip adds a view of which muscles produce that strength, on up to four muscles at once. In one athlete's example, three weeks after a hamstring injury, force plates showed a 7% gap between legs and NeuroStrip on both hamstrings showed a 37% gap in muscle activation.",
   "The enclosed estimate starts from {practice}'s {clinic count} clinics. Its visit and revenue figures are planning assumptions, each one labeled, and your team can replace them with its own numbers. It shows what one extra visit per plan of care is worth to the group, and how many extra visits a year would cover the cost of one clinic. It assumes no change from NeuroStrip at all. Finding out whether there is one is the job of the pilot.",
   "The estimate also leaves billing out. How sessions are billed is for your billing team to decide, and we will confirm what current customers do.",
   "We suggest a 30-day pilot at one of your clinics, with success measures your team chooses, such as visits per plan of care against your own baseline. If the clinic meets them, your other locations can join on the same contract. [Pilot and contract terms: confirm in week one.]",
   "Scan the code to book a 20-minute pilot scoping call with me.",
   "{rep name}, Control Bionics"
  ],
  "estimate_rows": [
   {
    "label": "Clinics in the group",
    "value": "{clinic count}"
   },
   {
    "label": "Patient visits a week across the group (planning assumption until your team gives its own)",
    "value": "{weekly visits}"
   },
   {
    "label": "Average visits per plan of care (planning assumption until your team gives its own)",
    "value": "{visits per plan of care}"
   },
   {
    "label": "Average net revenue per visit (planning assumption until your team gives its own)",
    "value": "{net revenue per visit}"
   },
   {
    "label": "Patient visits a year (50 working weeks is a planning assumption)",
    "value": "{weekly visits} × 50"
   },
   {
    "label": "Plans of care a year",
    "value": "Patient visits a year ÷ {visits per plan of care}"
   },
   {
    "label": "Value of one extra visit per plan of care, across a year",
    "value": "Plans of care a year × {net revenue per visit}"
   },
   {
    "label": "Annual NeuroStrip price for one clinic",
    "value": "{annual price per clinic}"
   },
   {
    "label": "Extra visits a year that would cover one clinic",
    "value": "{annual price per clinic} ÷ {net revenue per visit}"
   },
   {
    "label": "Extra visits a week at that clinic to cover it",
    "value": "Extra visits a year that would cover one clinic ÷ 50 working weeks (planning assumption)"
   },
   {
    "label": "What the pilot measures",
    "value": "Visits per plan of care at the pilot clinic against {baseline visits per plan of care}"
   }
  ],
  "card_front": "Actual size. The real NeuroStrip sensor weighs 4 grams and goes on like an adhesive bandage.",
  "card_back": "Peel the sample strip off this card and press it onto your forearm. A real sensor in that spot sends muscle activation live to an iPad or tablet, and a clinician can run up to four at once with synced video and motion data. NeuroStrip is registered as a non-diagnostic measurement and biofeedback tool.",
  "qr_cta": "Scan to book a 20-minute pilot scoping call for one of your clinics."
 },
 "geofence": {
  "headline": "See your own muscles work, live",
  "body": "Put a sensor on each leg and watch both sides live on an iPad. Booth {booth number}.",
  "cta": "Book a demo slot"
 },
 "rsa": [
  {
   "cluster": "category",
   "keywords": [
    "wireless electromyography sensor",
    "surface electromyography biofeedback",
    "electromyography for physical therapy",
    "electromyography biofeedback device",
    "wearable muscle sensor",
    "muscle activation sensor",
    "biofeedback equipment physical therapy"
   ],
   "headlines": [
    "Wireless Muscle Sensor",
    "The Muscle Behind the Number",
    "Live on an iPad or Tablet",
    "Up to Four Muscles at Once",
    "Weighs 4 Grams, No Wires",
    "Applies Like a Bandage",
    "Surface Electromyography",
    "Biofeedback for Clinics",
    "Synced Video and Motion Data",
    "Track Activation Each Visit",
    "Watch the 90-Second Video",
    "Pilot It at One Clinic",
    "Book a Live Demo",
    "Annual Pricing, Spelled Out",
    "Control Bionics NeuroStrip"
   ],
   "descriptions": [
    "NeuroStrip is a 4-gram wireless sensor that shows muscle activation live on a tablet.",
    "Run up to four sensors at once, with synced video and motion data in one session.",
    "A non-diagnostic measurement and biofeedback tool. Watch the 90-second video.",
    "Scope a 30-day pilot at one clinic, with success measures your team chooses."
   ],
   "path": "controlbionics.com/neurostrip/clinic",
   "landing": {
    "headline": "See muscle activation live, on up to four muscles at once",
    "sub": "NeuroStrip is a 4-gram wireless surface electromyography sensor that applies like an adhesive bandage and shows muscle activation live on an iPad or tablet, with synced video and motion data. It is registered as a non-diagnostic measurement and biofeedback tool.",
    "cta": "Watch the 90-second video"
   }
  },
  {
   "cluster": "competitor",
   "keywords": [
    "mtrigger",
    "mtrigger alternative",
    "mtrigger price",
    "noraxon",
    "delsys trigno",
    "kinvent k-myo",
    "myotrac infiniti"
   ],
   "headlines": [
    "Compare Muscle Sensors",
    "Four Muscles at Once",
    "When One Channel Is Enough",
    "Live on an iPad or Tablet",
    "4 Grams, On Like a Bandage",
    "Synced Video and Motion Data",
    "See the Comparison",
    "Annual Pricing, Spelled Out",
    "Pricing in One Place",
    "Book a Live Demo",
    "The Muscle Behind the Number",
    "Pilot It at One Clinic",
    "Wireless Muscle Sensor"
   ],
   "descriptions": [
    "Compare single-channel biofeedback units with a wireless sensor for up to four muscles.",
    "See which tool fits which job, including when a single-channel unit is enough.",
    "NeuroStrip shows up to four muscles live on a tablet, with synced video and motion data.",
    "Read annual pricing and answers to common questions, then book a live demo."
   ],
   "path": "controlbionics.com/neurostrip/compare",
   "landing": {
    "headline": "Which muscle sensor fits which job in your clinic",
    "sub": "A plain comparison of single-channel biofeedback units, lab electromyography systems and NeuroStrip, including the cases where a single-channel unit is enough. Single-channel units list from $499 on one maker's published price list.",
    "cta": "See pricing and common questions"
   }
  },
  {
   "cluster": "problem",
   "keywords": [
    "arthrogenic muscle inhibition",
    "quadriceps activation after knee surgery",
    "quadriceps inhibition after knee surgery",
    "hamstring return to sport test",
    "return to sport testing physical therapy",
    "muscle compensation after injury",
    "limb symmetry testing"
   ],
   "headlines": [
    "See Which Muscle Is Working",
    "When Strength Tests Look Even",
    "Compare Both Sides Live",
    "Quadriceps Activation, Live",
    "Hamstring Activation, Live",
    "For Return-to-Sport Protocols",
    "Document Each Stage of Rehab",
    "Read the Clinical Primer",
    "Watch the 90-Second Video",
    "The Muscle Behind the Number",
    "4-Gram Wireless Sensor",
    "Up to Four Muscles at Once",
    "Live on an iPad or Tablet"
   ],
   "descriptions": [
    "Strength tests show how much force a limb makes. See which muscles are making it.",
    "One athlete's example: force plates showed a 7% gap, muscle activation a 37% gap.",
    "Add a muscle activation measure to each stage of your return-to-sport protocol.",
    "Read the clinical primer on activation after knee surgery, with the research cited."
   ],
   "path": "controlbionics.com/neurostrip/return-to-sport",
   "landing": {
    "headline": "See which muscles produce the force your strength tests measure",
    "sub": "The clinical primer covers arthrogenic muscle inhibition, a reflex that can keep the thigh muscle from fully switching on after anterior cruciate ligament surgery on the knee. It also covers what a 2022 systematic review of 8 randomized trials found on electromyography biofeedback, and how to add an activation measure to a return-to-sport protocol.",
    "cta": "Read the clinical primer"
   }
  }
 ],
 "emails": [
  {
   "cluster": "executive",
   "steps": [
    {
     "day": 1,
     "subject": "Progress your patients can see",
     "body": "Hi {first name},\n\nPatients who can see their progress have one more reason to finish their plan of care. NeuroStrip is a 4-gram wireless sensor that shows muscle activation live on an iPad, so at each visit the patient sees the muscle they are rebuilding at work.\n\nThe way to test this at {practice} is a 30-day pilot at one clinic, with success measures your team chooses, such as visits per plan of care against your own baseline. [Pilot terms: confirm in week one.]\n\nWould a 20-minute call to scope it be useful?\n\n{rep name}"
    },
    {
     "day": 4,
     "subject": "What one clinic would need to show",
     "body": "Hi {first name},\n\nBefore anyone at {practice} gives time to a pilot, it helps to know what the pilot would have to show. Our economics worksheet starts from your own numbers: weekly visits, visits per plan of care and net revenue per visit. It shows what one extra visit per plan of care is worth across the group, and how many extra visits a year would cover one clinic.\n\nIt makes no assumption about what NeuroStrip changes. The pilot measures that.\n\nShall I send you the worksheet?\n\n{rep name}"
    },
    {
     "day": 9,
     "subject": "After the first clinic",
     "body": "Hi {first name},\n\nIf a pilot clinic meets the measures your team set, the next question is rollout. Other clinics at {practice} can join on the same contract, and each one tracks the same measures, so you can compare clinics side by side.\n\n[Add a customer story, once cleared. Rollout and contract terms: confirm in week one.]\n\nI can walk you through what a group rollout looks like on a 20-minute pilot scoping call. Would next week suit you?\n\n{rep name}"
    },
    {
     "day": 16,
     "subject": "Closing the loop",
     "body": "Hi {first name},\n\nI have not heard back, so I will assume the timing is wrong for {practice} and stop here.\n\nIf patient retention or plan-of-care completion comes up at your next leadership meeting, the 90-second video shows what a patient sees on screen. It is the quickest way to judge whether a pilot is worth a call.\n\nThank you for reading.\n\n{rep name}"
    }
   ],
   "emr_variant": {
    "subject": "",
    "body": ""
   }
  },
  {
   "cluster": "operations",
   "steps": [
    {
     "day": 1,
     "subject": "On in seconds, live on an iPad",
     "body": "Hi {first name},\n\nWhen a clinic adds new equipment, operations carries the setup, the training and the cost. NeuroStrip keeps the setup small. Each sensor weighs 4 grams, goes on like an adhesive bandage and shows muscle activation live on an iPad or tablet. Clinicians can run up to four at once, with synced video and motion data.\n\nA 20-minute live demo would let you time the setup yourself before anyone at {practice} asks you about it.\n\nWorth a look?\n\n{rep name}"
    },
    {
     "day": 4,
     "subject": "Annual pricing and what it includes",
     "body": "Hi {first name},\n\nPrice is usually the next question. NeuroStrip is sold on an annual contract, and our pricing questions page sets out the annual pricing, what it includes and answers to common questions. [Support terms: confirm in week one.]\n\nIf someone at {practice} has priced a single-channel biofeedback unit, one maker lists them from $499. NeuroStrip covers up to four muscles at once, wirelessly, with video in the same session. The page sets both out so you can judge the difference.\n\nHere is the link: {pricing link}\n\n{rep name}"
    },
    {
     "day": 9,
     "subject": "Billing and pilot logistics",
     "body": "Hi {first name},\n\nTwo questions tend to follow price, so here is where each one stands.\n\nBilling: your billing team decides how sessions are billed and coded. We make no billing promises, and Control Bionics will confirm what current customers do.\n\nPilot logistics: one clinic for 30 days, with measures your team picks. [Kits, setup help, support and data security: confirm in week one.]\n\nIf either question is holding things up at {practice}, a 20-minute live demo with your clinic director is the quickest way through it.\n\n{rep name}"
    },
    {
     "day": 16,
     "subject": "Should I close the file?",
     "body": "Hi {first name},\n\nI will stop here so I do not crowd your inbox.\n\nIf NeuroStrip comes up at {practice} later, the pricing questions page answers the operations questions in one place, and a live demo shows the setup in about 20 minutes.\n\nThank you for your time.\n\n{rep name}"
    }
   ],
   "emr_variant": {
    "subject": "Tools that feed the patient chart",
    "body": "Hi {first name},\n\nWhen a group reviews its electronic medical record (EMR) system, it is a good moment to check every tool that feeds the patient chart. If that review is on your list at {practice}, here is one to add.\n\nNeuroStrip is a 4-gram wireless sensor that shows muscle activation live on an iPad or tablet and keeps a record of each session over time. I will confirm how those session records reach your EMR before we speak. [EMR integration and data security: confirm in week one.]\n\nWould a 20-minute live demo help while your team compares systems?\n\n{rep name}"
   }
  },
  {
   "cluster": "clinical",
   "steps": [
    {
     "day": 1,
     "subject": "One athlete: 7% on force, 37% in the muscle",
     "body": "Hi {first name},\n\nOne athlete's example: three weeks after a hamstring injury, force plates showed a 7% gap between legs. With NeuroStrip on both hamstrings, the gap in muscle activation was 37%.\n\nStrength tests show how much force a limb produces. A patient can pass one while other muscles cover for the injured one. NeuroStrip is a 4-gram wireless sensor that shows activation live on an iPad, on up to four muscles at once.\n\nWould the 90-second video be useful for the clinicians at {practice}?\n\n{rep name}"
    },
    {
     "day": 4,
     "subject": "What the research says about activation",
     "body": "Hi {first name},\n\nTwo papers your team may know. Forelli and colleagues (Journal of Clinical Medicine, 2025) write that traditional functional assessments alone may miss arthrogenic muscle inhibition, a reflex that can stop the quadriceps from fully switching on after anterior cruciate ligament surgery on the knee. A 2022 systematic review in Disability and Rehabilitation by Karaborklu Argut and colleagues looked at 8 randomized trials. In most, electromyography biofeedback beat the comparison rehab for quadriceps strength. The authors note that high-quality evidence is limited.\n\nOur clinical primer covers both papers and how to use activation in daily care. Shall I send a copy for {practice}?\n\n{rep name}"
    },
    {
     "day": 9,
     "subject": "Activation in your return-to-sport protocol",
     "body": "Hi {first name},\n\nIf your clinicians follow a written return-to-sport protocol, NeuroStrip can add one more measure to each stage: muscle activation on both sides, recorded with synced video. The clinician still makes every call. What changes is that each call has a documented record behind it, and the patient can see it too.\n\nWe run a live clinic demo each week and walk through this step by step. Can I save a seat for someone from {practice}?\n\n{rep name}"
    },
    {
     "day": 16,
     "subject": "Last note from me",
     "body": "Hi {first name},\n\nI will leave it here. If activation comes up at {practice} later, two things may help. The 90-second video shows the sensors going on and the live view on an iPad. The clinical primer covers the research on activation after knee surgery, with every source cited.\n\n{One cleared customer example, once Control Bionics approves it in week one.}\n\nThank you for reading.\n\n{rep name}"
    }
   ],
   "emr_variant": {
    "subject": "",
    "body": ""
   }
  }
 ],
 "sub": "Most pieces show force and muscle activation side by side. Each asks for one next step: a call to plan a pilot, a live demo or a read of the clinical primer."
}/*campaign@*/
};
