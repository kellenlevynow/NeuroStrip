/* Numbers behind the budget section of the NeuroStrip 90-day plan.
   Edit here, then run node tools/build.mjs. */
window.NS = {
  /* ------------------------------------------------------------------ */
  /* Budget                                                              */
  /* pct is the share of the 90-day total. m is the share of the total  */
  /* spent on that line in months 1, 2 and 3.                           */
  /* ------------------------------------------------------------------ */
  budget: {
    scenarios: [{ name: 'Lean', v: 45000 }, { name: 'Base', v: 90000 }, { name: 'Aggressive', v: 150000 }],
    min: 30000, max: 200000, step: 5000, def: 90000,
    groups: [['channel', 'Media and channels'], ['build', 'Content and setup'], ['reserve', 'Reserve']],
    lines: [
      { id: 'li',     name: 'LinkedIn',                              pct: 25, m: [3, 9, 13],    group: 'channel', color: 'c1',
        note: 'Video and document ads to the named account list. Spend starts small in month one.' },
      { id: 'search', name: 'Google Search',                         pct: 11, m: [2.5, 4, 4.5], group: 'channel', color: 'c2',
        note: 'Ads on brand, category, competitor and problem searches, live from week two.' },
      { id: 'email',  name: 'Outbound and nurture email',            pct: 6,  m: [2, 2, 2],     group: 'channel', color: 'c3',
        note: 'Contact data for target accounts, sending tools and sequences. The outbound partner\'s retainer is separate.' },
      { id: 'rt',     name: 'Retargeting',                           pct: 5,  m: [0.5, 2, 2.5], group: 'channel', color: 'c4',
        note: 'Meta and YouTube ads to site visitors, video viewers and our contact lists.' },
      { id: 'tests',  name: 'Small tests',                           pct: 8,  m: [2, 3, 3],     group: 'channel', color: 'c5',
        note: 'Newsletter sponsorships, co-marketing with testing vendors and the CSM booth build, each capped and tracked on its own.' },
      { id: 'assets', name: 'Video, customer stories and landing pages', pct: 25, m: [14, 8, 3], group: 'build', color: 'c6',
        note: 'The 90-second demo video, two filmed customer stories, a pilot guide and landing pages.' },
      { id: 'data',   name: 'Data and Salesforce setup',             pct: 12, m: [6, 3, 3],     group: 'build',   color: 'c7',
        note: 'Account list and contact data, scheduling and routing tools, analytics, and a fixed-scope Salesforce build if needed.' },
      { id: 'res',    name: 'Reserve',                               pct: 8,  m: [0, 2, 6],     group: 'reserve', color: 'c8',
        note: 'Held until the Day 30 and Day 60 reviews, then given to whatever is working.' }
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Qualified calls a week at the Day 90 run rate, by source            */
  /*   rate:      a contacts a week, b calls per 100 contacts            */
  /*   cost:      month-three spend on budget line `line`, b per call    */
  /*   monthly:   a registrants a month, b% book a call                  */
  /*   quarterly: a conversations a quarter, b% book a call              */
  /*   direct:    a calls a week                                         */
  /* ------------------------------------------------------------------ */
  pipeline: {
    target: 20,
    sources: [
      { name: 'Existing inbound and referrals (estimate)', kind: 'direct', a: 3.8 },
      { name: 'Google Search', kind: 'cost', line: 'search', b: 330 },
      { name: 'Outbound email', kind: 'rate', a: 300, b: 0.9 },
      { name: 'APTA CSM follow-up', kind: 'quarterly', a: 150, b: 20 },
      { name: 'Weekly live demo', kind: 'monthly', a: 60, b: 15 },
      { name: 'LinkedIn', kind: 'cost', line: 'li', b: 2000 }
    ],
    /* percentages: calls to opportunities, opportunities to pilots, pilots to paid; first-year contract value */
    funnel: { opp: 55, pilot: 45, paid: 50, acv: 7500 }
  }
};
