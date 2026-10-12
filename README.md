# NeuroStrip 90-day demand generation plan

A one-page marketing plan for Control Bionics' NeuroStrip, prepared by Kellen Levy for the Control Bionics leadership team in October 2026. It reads in about ten minutes.

It is an independent candidate proposal. It is not a Control Bionics publication and is not endorsed by Control Bionics.

## View it

| How | Where |
|---|---|
| Hosted | https://kellenlevynow.github.io/NeuroStrip/ |
| Offline, one file | Open `standalone.html` in any browser. Fonts, styles, scripts and data are all inside it. |
| Text only | [`docs/STRATEGY.md`](docs/STRATEGY.md) |

The page asks search engines not to index it, sets no cookies and runs no analytics.

GitHub Pages serves the `main` branch from the repository root. There is no build step on GitHub: `index.html` is committed ready to serve.

## What is in it

| # | Section | What it covers |
|---|---|---|
| 1 | Summary | The goal of 20 qualified discovery calls a week, a one-sentence answer to each of the five interview questions, the base budget and the Day 90 result |
| 2 | Who we target first | PT groups with 5 to 25 locations, sport through business development, everyone else inbound only (70, 20, 10) |
| 3 | What we say and offer | The positioning line, a message and offer for three buyers, and example creative: an account-based video or display ad, a search ad, the first outbound email and a direct mail postcard |
| 4 | Channels | The 90-day account-based test (purchased practitioner list, Bombora intent data, Propensity ads, a random test and holdout split with Day 30 and Day 60 rules), and a table covering paid search, paid social, email, landing pages and audience segmentation |
| 5 | Budget | Lean, Base and Aggressive, a slider, line items, the monthly split, and the calls, pilots, customers and revenue each budget returns |
| 6 | The first 90 days | Three 30-day phases by week, with checkpoints at Day 30, 60 and 90 |
| 7 | Handing leads to sales | The five-point qualified-lead checklist, response times, Salesforce in month one and the five weekly numbers |
| 8 | Team, asks and risks | In-house and partner work, including the data and ABM vendors, what is needed from Control Bionics in week one, and the six biggest risks |

## Presenting it

- The top nav jumps to each section and highlights the one on screen.
- `n` and `p` move to the next and previous section.
- The budget buttons and slider update every number in the Budget section.

## Changing it

```
src/shell.html        page frame, top nav, footer
src/sections/*.html   one file per section, in filename order
src/css/*.css         styles, concatenated in filename order
src/js/*.js           behavior, concatenated in filename order
assets/js/data.js     budget lines and the pipeline math behind the Budget section
tools/build.mjs       assembles index.html and standalone.html
```

After any edit:

```
node tools/build.mjs
```

Node 18 or newer. No packages to install. Never edit `index.html`, `standalone.html`, `assets/css/site.css` or `assets/js/app.js` by hand: the build writes them.

### How the Budget section works out the numbers

Each source of qualified calls has a weekly rate at Day 90, set in `assets/js/data.js`:

- Outbound email: 300 contacts a week at 0.9 calls per 100.
- Google Search and the account-based test: month-three spend on their budget line, divided by a planned cost per call of $330 and $2,000. The $2,000 is the figure first planned for LinkedIn, kept until the test produces its own. These two are the only sources that change with the budget.
- Weekly live demo: 60 registrants a month, 15% book a call.
- APTA CSM follow-up: 150 conversations a quarter, 20% book a call.
- Existing inbound and referrals: an estimate of 3.8 calls a week, to be replaced by the real count in week one.

At $90,000 that adds up to about 15 qualified calls a week. Then 55% of calls become opportunities, 45% of those start a pilot, and 50% of pilots convert at $7,500 in first-year value.

## Credits

- Typefaces: Inter and Lora, under the SIL Open Font License. See [`assets/fonts/LICENSES.md`](assets/fonts/LICENSES.md).
- Icons: Lucide, ISC License.
- NeuroStrip is a name used by Control Bionics. Other names belong to their owners.
