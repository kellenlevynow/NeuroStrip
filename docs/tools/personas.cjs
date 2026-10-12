// Generates docs/PERSONAS.md from assets/js/data.js so the site and the playbook use the same words.
const fs = require('fs'), path = require('path');
const root = process.argv[2] || path.resolve(__dirname, "../..");
global.window = {};
require(path.join(root, 'assets/js/data.js'));
const N = window.NS, R = N.roles, T = N.personaTests, AB = N.site.ab;
const byId = Object.fromEntries(R.map((r) => [r.id, r]));
const SHORT = { owner: 'Clinic owner', ceo: 'CEO', coo: 'COO', cco: 'Chief clinical officer', rehab: 'Rehab director', admin: 'Practice administrator', director: 'Clinic director' };
const CL = { executive: 'Executive', operations: 'Operations', clinical: 'Clinical' };
const cell = (x) => String(x || '').replace(/\|/g, '\\|').replace(/\n+/g, ' ');
const ul = (a) => (a || []).map((x) => `- ${x}`).join('\n');
const slug = (s) => s.toLowerCase().replace(/[()]/g, '').replace(/[^a-z0-9 -]/g, '').trim().replace(/\s+/g, '-');
const out = [];
const w = (...l) => out.push(...l);

w('# NeuroStrip buyer playbook',
'',
'For the Control Bionics sales and marketing team. Prepared by Kellen Levy, October 2026, as part of the [90-day plan](STRATEGY.md). This is an independent proposal. Control Bionics did not publish it.',
'',
'The plan targets physical therapy (PT) groups with 5 to 25 clinics. Inside each group, four kinds of yes are needed before a pilot turns into a rollout. This playbook says who gives each one, what they care about, what we say to them, and when we stop.',
'',
'## Contents',
'',
'1. [Words used in this playbook](#words-used-in-this-playbook)',
'2. [Rules for every conversation](#rules-for-every-conversation)',
'3. [The buying group](#the-buying-group)',
'4. [Who is there at each size, and who to contact first](#who-is-there-at-each-size-and-who-to-contact-first)',
'5. [How we test messages](#how-we-test-messages)',
'6. [The seven roles](#the-seven-roles)',
'7. [Objections](#objections)',
'8. [What sales records in Salesforce](#what-sales-records-in-salesforce)',
'9. [Confirm in week one](#confirm-in-week-one)',
'',
'## Words used in this playbook',
'',
'| Word | What it means here |',
'|---|---|');
for (const k of ['buyinggroup', 'cluster', 'abtest', 'pilot', 'qcall', 'salesready', 'intent', 'researching', 'abm', 'holdout', 'npi', 'semg', 'emr', 'salesforce']) {
  const g = N.glossary[k]; if (g) w(`| ${cell(g.term)} | ${cell(g.def)} |`);
}
w('',
'Job titles are spelled out once and then shortened: chief executive officer (CEO) and chief operating officer (COO). Bombora is the company that sells the "researching now" data, and Propensity is the account-based ad platform in the plan.',
'',
'## Rules for every conversation',
'',
'- NeuroStrip is registered as a measurement and biofeedback tool that does not diagnose. Every claim stays inside that. Clinicians make the clinical calls.',
'- We make no billing or coding promises. The clinic\'s billing team decides, and Control Bionics will confirm what current customers do.',
'- Anything about electronic medical record (EMR) integration, data security, support or pilot terms is marked "confirm in week one" until Control Bionics confirms it in writing. The list is at the end of this playbook.',
'- The hamstring case (force plates showed a 7% gap between legs, NeuroStrip showed a 37% gap in muscle activation) is one athlete\'s example and is always presented that way.',
'- Customer names, logos, stories and results are used only after Control Bionics has cleared them. No quotes are written for anyone.',
'- Size patterns and role descriptions below are planning assumptions. Sales corrects them from real calls, and the playbook is updated monthly.',
'',
'## The buying group',
'',
'| Part of the decision | Who usually holds it | What they need before saying yes |',
'|---|---|---|',
'| Signs | Clinic owner, or the CEO in larger and investor-backed groups | A clear business case, a pilot with measures they agreed, and a yes from the clinical and operations leads |',
'| Approves clinically | Chief clinical officer, or the rehab director where there is no chief clinical officer | Confidence the readings are sound, the evidence summary, and a protocol their clinicians accept |',
'| Runs the pilot | A clinic director | A tool that fits into a normal visit, training, and a simple way to report results |',
'| Decides rollout and payment, and can block it | COO and practice administrator | Annual price, what it includes, how it fits workflow and records, and written answers on patient data |',
'',
'Every group hears from at least one contact in the executive or operations cluster (owner, CEO, COO or practice administrator) and one in the clinical cluster (chief clinical officer, rehab director or clinic director).',
'',
'## Who is there at each size, and who to contact first',
'');
for (const z of N.bySize) {
  w(`### ${z.size}`, '', `**Who is usually there.** ${z.who_exists}`, '', `**Contact first.** ${z.contact_first}`, '', `**Why.** ${z.why}`, '');
}
w('### The contact-order test',
'',
'From week 5, the demand generation lead splits groups in each size band at random. Half start with a clinical contact and half start with an executive. The second contact hears from us a week later. At Day 90 we compare qualified calls per 100 groups in each half. If one order is at least 30% ahead, it becomes the default for next quarter\'s new groups. If not, both orders stay, and we read pilots started per 100 groups at Day 180.',
'',
'## How we test messages',
'',
`The seven roles fall into three clusters, so each test reaches enough people. Each cluster tests message A against message B from January 4, read in week 8 and closed by February 15, through the Propensity ad audiences and the outbound email sequences.`,
'',
'| Cluster | Roles | Message A | Message B |',
'|---|---|---|---|');
const pairs = { executive: ['owner', 'ceo'], operations: ['coo', 'admin'], clinical: ['cco', 'rehab', 'director'] };
for (const c of T.clusters) {
  const ids = c.roles;
  w(`| ${c.name} | ${ids.map((i) => byId[i].title).join(', ')} | ${ids.map((i) => `${SHORT[i]}: ${cell(AB[i][0])}`).join('<br>')} | ${ids.map((i) => `${SHORT[i]}: ${cell(AB[i][1])}`).join('<br>')} |`);
}
w('',
'Each role hears its own wording of the cluster\'s message A or B, so the test compares the two ideas while the copy still fits the reader. The full copy for each role is in its section below.',
'',
'**Rules**',
'',
`- Contacts inside each cluster are split at random between A and B.`,
`- Each test is read in week 8, once about ${T.perSide} contacts a side have had each message. If neither message is ${T.winGap}% ahead, it runs to ${T.maxWeeks} weeks, about 300 a side, and closes by the end of week 10.`,
'- We read two numbers: positive reply rate (people who reply with interest) and meetings booked.',
`- A message wins only if its positive reply rate is ${T.winGap}% or more above the other and meetings booked do not point the other way. Below that it is a tie: we keep the simpler message and test a new one against it.`,
`- Volumes are small. Outbound reaches 300 contacts a week, which is 50 a week in each of the six test cells. At the planned 1.5% positive reply rate, ${T.perSide} contacts give about 2 replies a side and six weeks give about 4 or 5. A firm win needs about ${T.minReplies} interested replies a side, about 670 people a message, which this quarter cannot reach. So every win is used for now and tested again in month four with fresh contacts, and a gap of one reply counts as a tie.`,
'- Owner: the demand generation lead runs the tests. Week 8 reads them with sales. Remaining tests close by the end of week 10.',
'',
'## The seven roles',
'',
'Each role follows the same order: role in the decision, other titles, what they are measured on, what worries them, signs they are ready to talk, the two messages, the offer and landing page, the six-week sequence, the top four objections, proof, discovery questions, what a yes looks like, and when to stop.',
'');
for (const r of R) w(`- [${r.title}](#${slug(r.title)})`);
w('');
for (const r of R) {
  w(`### ${r.title}`, '',
    `**${r.buying_role}.** ${CL[r.cluster]} cluster. ${r.one_line}`, '',
    '**Role in the decision.** ' + r.role_in_decision, '',
    '**Other titles.** ' + (r.also_called || []).join(', ') + '.', '',
    '**When this is a separate person.** ' + r.exists_when, '',
    '**Measured on**', '', ul(r.measured_on), '',
    '**What worries them**', '', ul(r.worries), '',
    '**Signs they are ready to talk**', '', ul(r.ready_signals), '',
    '**Bombora research topics to check.** ' + (r.bombora_topics || []).join(', ') + '. Bombora reports at the company level and does not name people. Topic names are checked against Bombora\'s list in week one.', '',
    '**Message A.** ' + r.message_a, '',
    '**Message B.** ' + r.message_b, '',
    '**Offer.** ' + r.offer, '',
    '**Landing page.** ' + r.landing_page, '',
    '**Six-week sequence**', '',
    '| Week | Channel | Touch |', '|---|---|---|',
    ...(r.sequence || []).map((s) => `| ${s.week} | ${cell(s.channel)} | ${cell(s.touch)} |`), '',
    '**Top four objections**', '',
    '| Objection | Answer |', '|---|---|',
    ...(r.objections || []).map((o) => `| ${cell(o.objection)} | ${cell(o.answer)} |`), '',
    '**Proof they need**', '', ul(r.proof), '',
    '**Three questions for the discovery call**', '', (r.discovery_questions || []).map((q, i) => `${i + 1}. ${q}`).join('\n'), '',
    '**What a yes looks like.** ' + r.yes_looks_like, '',
    '**When to stop.** ' + r.stop_when, '',
    '[Back to the roles](#the-seven-roles)', '');
}
w('## Objections',
'',
`All ${N.objections.length} objections we expect, in rough order of how often we think they will come up. The first ten appear on the plan page in shorter form. Answers marked "confirm in week one" are not used until Control Bionics confirms them in writing.`,
'',
'| # | Objection | Who raises it | Answer | Proof to send | Follow-up question |',
'|---|---|---|---|---|---|');
N.objections.forEach((o, i) => {
  const ans = cell(o.answer) + (o.week_one ? `<br>**Confirm in week one:** ${cell(o.week_one_item)}` : '');
  w(`| ${i + 1} | ${cell(o.objection)} | ${o.raised_by.map((x) => SHORT[x] || x).join(', ')} | ${ans} | ${cell(o.proof_asset)} | ${cell(o.follow_up)} |`);
});
w('',
'## What sales records in Salesforce',
'',
'Four pick lists make the tests readable. Persona and buying role are added in Salesforce week 1, and message variant and objection heard in week 3. Sales picks from the list on every call, and "Other" needs a note.',
'',
'| Field | Values |',
'|---|---|',
`| Persona | ${R.map((r) => r.title).join(', ')}, Other |`,
'| Buying role | Signs, Approves clinically, Runs the pilot, Decides rollout and payment |',
'| Message variant | Executive A, Executive B, Operations A, Operations B, Clinical A, Clinical B, Operations email with the record-system opener |',
`| Objection heard | ${N.objections.map((o, i) => `${i + 1}. ${cell(o.objection).replace(/^"|"$/g, '')}`).join('<br>')}<br>Other |`,
'',
'**Every Monday.** The demand generation lead and the sales lead review last week\'s objection-heard counts, persona test results and lost reasons. Any objection heard three or more times without a good answer gets a draft answer that week.',
'',
'**First Monday of each month.** Answers and proof assets are updated from what sales heard, and this playbook is updated to match. Anything that changes a claim goes to Control Bionics for sign-off first.',
'',
'## Confirm in week one',
'',
'These answers depend on facts only Control Bionics can confirm. They are part of the fourteen week-one asks in the plan, and Control Bionics names one person to answer each by December 7. Until then, every answer that depends on one stays marked confirm in week one.',
'',
'- Billing: what current customers do, with no coding advice.',
'- Pilot cost and terms, including kits on loan.',
'- Training and support for a new clinic.',
'- Electronic medical record (EMR): whether and how NeuroStrip records can get into each system.',
'- Patient data: where session data is stored, who can see it, and whether Control Bionics signs a business associate agreement under the Health Insurance Portability and Accountability Act (HIPAA).',
'- Cleared customers: which names, logos and results may be used, and where.',
'- Price: the annual price for one clinic, each extra clinic, what it includes and replacement sensors.',
'- Bombora: which research topics match the ones named in this playbook.',
'- Size patterns: which hold for the purchased list, checked against the first 100 groups.',
'');
let md = out.join('\n').replace(/\n{3,}/g, '\n\n');
if (/[\u2013\u2014]/.test(md)) { console.error('dash found'); process.exit(1); }
fs.writeFileSync(path.join(root, 'docs/PERSONAS.md'), md);
console.log('wrote', md.length, 'chars');
