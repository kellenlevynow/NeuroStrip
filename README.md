# NeuroStrip 90-day demand generation plan

A one-page marketing plan for Control Bionics' NeuroStrip, prepared by Kellen Levy for the Control Bionics leadership team in October 2026, with a buyer playbook for the sales team.

It is an independent candidate proposal. It is not a Control Bionics publication and is not endorsed by Control Bionics. The page borrows the general layout ideas of a modern product page, with no Apple logos, product names, imagery or text.

## View it

| How | Where |
|---|---|
| Hosted | https://kellenlevynow.github.io/NeuroStrip/ |
| Offline, one file | Open `standalone.html` in any browser. Fonts, styles, scripts and data are all inside it. |
| Text only | [`docs/STRATEGY.md`](docs/STRATEGY.md) |
| Buyer playbook | [`docs/PERSONAS.md`](docs/PERSONAS.md) |

The page asks search engines not to index it, sets no cookies and runs no analytics.

GitHub Pages serves the `main` branch from the repository root. There is no build step on GitHub: `index.html` is committed ready to serve.

## Two readers, one page

Every section is written in two layers:

- **The first layer** states the answer in a plain headline, one or two short sentences and one large number or image. Every number says what it means for Control Bionics.
- **Learn more** opens in place and holds the math, assumptions, test design, decision rules, unit economics against the $930 limit per qualified call, the Lean, Base and Aggressive trade-offs and the risks.

Words like account-based ads, intent data, NPI, pipeline, cost per qualified call and holdout group have a tap or hover definition the first time they appear.

## What is in it

| # | Section | What it covers |
|---|---|---|
| | Hero | The goal: 20 qualified sales calls a week |
| 1 | Follow one clinic | One 12-clinic physical therapy group, from the list to a rollout, with the cost of each step and the $4,100 cost per customer |
| 2 | The plan at a glance | Six numbers, each with what it means, and a short answer to each of the five interview questions |
| 3 | Who we target first | Physical therapy groups with 5 to 25 clinics (70%), pro and college sport (20%), everyone else inbound (10%) |
| 4 | The buying group | Who signs, approves, runs the pilot and decides rollout; who to contact first by size; a tab for each of seven roles; the ten most common objections; the message tests by cluster |
| 5 | What we say | One idea, said three ways for the executive, operations and clinical clusters, and what we can and cannot claim |
| 6 | The campaign | "See the muscle behind the number": a video storyboard, an animated display set, a carousel, a native ad, a direct mail box, a geofenced mobile ad, three responsive search ads and three email sequences, each labeled with where it runs, limits, audience, message tested, call to action, landing page and the number we read |
| 7 | Channels | The 90-day account-based ad test with a holdout half, plus search, email, retargeting and small tests, with keep and cut rules |
| 8 | Budget | Lean, Base and Aggressive side by side. Choosing a column updates the month-by-month spend and where the calls come from |
| 9 | The first 90 days | Three phases with a pinned phase name, a checkpoint and a decision at Day 30, 60 and 90, and an owner for every week |
| 10 | Handing leads to sales | The five-point checklist, reply times, discovery questions by role, five weekly numbers and the Salesforce build |
| 11 | Team, asks and risks | In-house and partner work, the week-one asks for Control Bionics, and the risks with owners |

## The buyer playbook

[`docs/PERSONAS.md`](docs/PERSONAS.md) covers the seven titles in the buying group (clinic owner, CEO, COO, chief clinical officer, rehab director, practice administrator and clinic director). For each role it gives the role in the decision, other titles, what they are measured on, worries, signs they are ready to talk with Bombora research topics, two test messages, the offer and landing page, a six-week sequence, the top four objections, proof, three discovery questions, what a yes looks like and when to stop. It also has all 18 objections, the Salesforce picklists and the weekly and monthly review.

The playbook is generated from the same data as the page. After changing role or objection data, run:

```
node docs/tools/personas.cjs
```

## Product photography

The page is built for Control Bionics' own NeuroStrip photography, but none of the 14 image files could be downloaded when the site was rebuilt, because the build environment's network blocked controlbionics.com. The page uses drawn SVG illustrations in their place and says so in each caption. [`assets/img/cb/README.md`](assets/img/cb/README.md) lists every missing file, where it goes and how to add it.

## Presenting it

- The sticky bar under the top bar jumps to each section and highlights the one on screen. "See the budget" is always one click away.
- `n` and `p` move to the next and previous section.
- Role tabs and the campaign carousel work with arrow keys, swipe, the arrows and the dots. The campaign can be filtered by cluster and channel.
- Motion is turned off for anyone who has reduced motion set on their device.

## Changing it

```
src/shell.html          page frame, top bar, local nav, footer
src/sections/*.html     one file per section, in filename order
src/css/00-base.css     type, color, layout, nav, tiles, Learn more, carousels
src/css/10-sections.css section layouts
src/css/20-ads.css      the ad mockups
src/js/00-core.js       nav, reveals, definitions, carousels, chart traces
src/js/10-budget.js     the budget comparison and its math
src/js/20-buyers.js     the buying group: sizes, role tabs, objections, message tests
src/js/30-campaign.js   the campaign mockups, filters and search-ad length check
assets/js/data.js       glossary, budget, call math, persona tests, roles, objections, campaign copy
docs/tools/personas.cjs writes docs/PERSONAS.md from assets/js/data.js
tools/build.mjs         assembles index.html and standalone.html
```

After any edit:

```
node tools/build.mjs
```

Node 18 or newer. No packages to install. Never edit `index.html`, `standalone.html`, `assets/css/site.css` or `assets/js/app.js` by hand: the build writes them.

The campaign module checks every responsive search ad in code: headlines must be 30 characters or fewer and descriptions 90 or fewer, and anything longer is flagged in the browser console.

### How the Budget section works out the numbers

Each source of qualified calls has a weekly rate at Day 90, set in `assets/js/data.js`:

- Outbound email: 300 contacts a week. 1.5% reply with interest and 60% of those hold a call, so 0.9 calls per 100 contacts.
- Google Search and the account-based test: month-three spend on their budget line, divided by a planned cost per call of $330 and $2,000. These two are the only sources that change with the budget.
- Weekly live demo: 60 registrants a month, 15% book a call.
- APTA Combined Sections Meeting follow-up: 150 conversations a quarter, 20% book a call.
- Calls that already come in today: an estimate of 3.8 a week, replaced by the real count in week one.

At $90,000 that adds up to about 15 qualified calls a week. Then 55% of calls become opportunities, 45% of those start a pilot, and 50% of pilots sign at $7,500 in first-year value. So about 12.4% of calls become customers, and a call can cost up to about $930 and still pay back in the first year.

## Credits

- Typeface: Inter, under the SIL Open Font License, used after the system font. See [`assets/fonts/LICENSES.md`](assets/fonts/LICENSES.md). The Lora and InterDisplay files in `assets/fonts` are no longer used by the page.
- Icons: Lucide, ISC License.
- NeuroStrip is a name used by Control Bionics. Other names belong to their owners.
