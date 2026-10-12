# Filling the pipeline

A 90-day demand generation plan for Control Bionics' NeuroStrip, built as an interactive strategy site instead of a slide deck.

Prepared by Kellen Levy as an independent candidate proposal. It is not a Control Bionics publication and is not endorsed by Control Bionics.

## View it

| How | Where |
|---|---|
| Hosted | `https://kellenlevynow.github.io/NeuroStrip/` once GitHub Pages is switched on (steps below) |
| Offline, one file | Open `standalone.html` in any browser. Fonts, styles, scripts and data are all inside it. |
| Text only | [`docs/STRATEGY.md`](docs/STRATEGY.md) |

The page asks search engines not to index it, sets no cookies and runs no analytics.

### Turning on the hosted page

1. On GitHub, open **Settings**, then **Pages**, for this repository.
2. Under "Build and deployment", set **Source** to "Deploy from a branch".
3. Choose the `main` branch and the `/ (root)` folder, then **Save**.
4. Give it about a minute, then open `https://kellenlevynow.github.io/NeuroStrip/`.

The repository is public, so its files can already be read on GitHub. Pages adds the hosted address. There is no build step on GitHub: `index.html` is committed ready to serve.

## What is in it

| # | Chapter | Interview question it answers |
|---|---|---|
| 01 | Five answers | All five, on one screen |
| 02 | The idea | |
| 03 | Ground truth: what is publicly verifiable, plus a nine-point site audit | |
| 04 | Audience: adjustable nine-segment matrix, tie-breakers, tiers | Q1 |
| 05 | Positioning, message house, claims guardrail, awareness ladder | |
| 06 | The system: seven stations, three feedback loops, flywheel | |
| 07 | Channels, budget tool, pipeline model | Q2 |
| 08 | Creative engine: territories, test tree, example ads, landing journeys | |
| 09 | Qualification: lifecycle, fit and intent router, PILOT, SLA | Q4 |
| 10 | Salesforce month one: sprint plan, data model, UTM builder, dashboards | Q5 |
| 11 | Agency and in-house | Q3 |
| 12 | Measurement: hierarchy, cost-per-lead trap, dashboard concept | |
| 13 | Roadmap with a movable start date | |
| 14 | Experiments: decision rules and a ranked backlog | |
| 15 | Risks and week-one confirmations | |
| 16 | Day 91 onward | |
| 17 | Evidence ledger | |

## Reading the evidence labels

Every claim carries a marker. Select one to see where it came from.

| Marker | Meaning |
|---|---|
| Verified | Stated in a public source, linked in the ledger |
| Shared | From the first conversation, or my own observation |
| Assumption | A planning input, with the step that validates it |
| Hypothesis | Something the plan is built to test |

Turn on the evidence lens (the button in the side rail, or press `e`) to expand every marker at once.

## Presenting it

- `n` and `p` move to the next and previous chapter.
- `e` toggles the evidence lens.
- The numbered buttons at the top of the rail jump straight to each interview question.
- Every model responds live: audience weights, budget, pipeline inputs, the lead router, the UTM builder and the roadmap start date.

## Changing it

All numbers and most copy for the interactive modules live in one file: [`assets/js/data.js`](assets/js/data.js). Sources, assumptions and hypotheses are registered there too, and the ledger is generated from them.

```
src/shell.html        page frame, navigation, footer
src/sections/*.html   one file per chapter
src/css/*.css         styles, concatenated in filename order
src/js/*.js           behavior, concatenated in filename order
assets/js/data.js     strategy data
tools/build.mjs       assembles index.html and standalone.html
```

After any edit:

```
node tools/build.mjs
```

Node 18 or newer. No packages to install. The build stops if a section references an icon or evidence id that does not exist.

## Adding Control Bionics photography

The site ships with original concept illustrations. Photo slots look for a local file first, then try the public image on controlbionics.com, and otherwise keep the illustration. To pin real photos into the repo, see [`assets/img/cb/README.md`](assets/img/cb/README.md).

## Credits

- Typefaces: Inter and Lora, under the SIL Open Font License. See [`assets/fonts/LICENSES.md`](assets/fonts/LICENSES.md).
- Icons: Lucide, ISC License.
- NeuroStrip, NeuroNode and NeuroBounce are names used by Control Bionics. Other names belong to their owners.
