# ONDA Science — rules pack

**This pack is the only source of rules for the ONDA Science section** (`https://onda-life.com/science/…`). It is binding for both:
- **Mistral** — writes the pages;
- **Claude Code** — checks and publishes them.

If a rule changes, this pack changes. No rule lives anywhere else.

## Process

1. **Mistral** reads the repository for context (read-only — it never pushes or opens PRs). It writes **one page as one Markdown file** that follows this pack. It then sends the file and a hand-off note to Yakiv.
2. **Yakiv** passes the file to Claude Code by hand.
3. **Claude Code**:
   - places the file at `landing/content/science/<kind>/<slug>.md`;
   - runs the automatic checks and the manual acceptance checklist;
   - fixes or returns the file;
   - publishes it to `main`.

## Read in this order

| # | File | What it is |
|---|---|---|
| 1 | [01-quality-standard.md](01-quality-standard.md) | Quality standard (spec 002 condensed): source hierarchy, evidence classes, writing rules, HRV limits, medical safety, page structure, AI-answer blocks, duplication check |
| 2 | [02-template.md](02-template.md) | Page template — copy it for every page |
| 3 | [03-facts.md](03-facts.md) | Approved facts: every `{{fact:…}}` id with value and source. **No number outside a fact.** (Generated from `src/data/science/facts.ts`) |
| 4 | [04-sources.md](04-sources.md) | Source registry with DOI/PMID; rule for adding a new source |
| 5 | [05-banned-wording.md](05-banned-wording.md) | Banned wording and what to write instead |
| 6 | [06-mvp-pages.md](06-mvp-pages.md) | The 13 MVP pages: URL, type, main intent, overlaps and how each page differs |
| 7 | [07-byline.md](07-byline.md) | Editor and reviewer rules |
| 8 | [08-handoff-checklist.md](08-handoff-checklist.md) | What Mistral checks and writes when handing in a file |
| 9 | [09-acceptance-checklist.md](09-acceptance-checklist.md) | What Claude Code checks before publishing |
| 10 | [10-image-style.md](10-image-style.md) | Hero image: light scientific style, `imageAlt` and `imagePrompt` with examples |
| 11 | [11-lessons-first-page.md](11-lessons-first-page.md) | Lessons from `concepts/rmssd` — what needed fixing and the rules that now prevent it |
| 12 | [ONDA_science_roadmap.md](ONDA_science_roadmap.md) | Page plan: done, remaining MVP order, phase 2, methodology, what we don’t do (owner’s plan, in Russian) |

**For Mistral: read one file — [`MISTRAL.md`](MISTRAL.md).** It contains this whole pack in one document (generated from the files below by `npx tsx scripts/science-pack-bundle.ts`; never edit it by hand). Published so far: `concepts/rmssd` (see [06-mvp-pages.md](06-mvp-pages.md)).

## Tools behind the pack

| Tool | What it does |
|---|---|
| `landing/src/data/science/facts.ts` | Facts module. Changed only by Claude Code, after Yakiv approves a value. |
| `npx tsx scripts/science-pack-bundle.ts` | Rebuilds `MISTRAL.md` (the single-file version for Mistral) from README + 01–09; run after ANY change to the pack or to `facts.ts`. `--check` fails if it is stale. |
| `npx tsx scripts/science-pack-facts.ts` | Regenerates `03-facts.md`. Run it after every change to `facts.ts`; `--check` fails if the doc is stale. |
| `npx tsx scripts/check-science-content.ts` | Automatic page checks: format, DOI/PMID exist, official URLs open and support only device/regulatory facts, evidence classes, numbers only via facts or proposals, banned wording, links and `relatedPlanned`. `--file <path>` checks one file anywhere (use it on a draft). `--offline` skips the lookups. `--publish` also fails on pending proposals or proposed facts — the gate before publishing. |
| `.github/workflows/science-content.yml` | Runs the publish gate (`--publish`) and the facts-doc check whenever `landing/content/science/`, the facts or the pack change on `main`. |

## Decisions log

| Date | Decision |
|---|---|
| 2026-10-04 | Process: Mistral read-only, files handed over by Yakiv, Claude Code checks and publishes. |
| 2026-10-04 | `hrv.pooled.daytime` (about 42 ms, daytime RMSSD, Nunan 2010) approved. |
| 2026-10-04 | Source type `official` (URL, no DOI) — device and regulatory facts only. |
| 2026-10-04 | Evidence class `guideline` (guideline / expert consensus) for methodological standards. |
| 2026-10-04 | `relatedPlanned` for unwritten science pages; shown automatically once published. |
| 2026-10-04 | Proposals block: missing facts/sources proposed in the file; drafts pass, publishing is blocked until Yakiv approves. |
| 2026-10-04 | Hand-off includes the real check log when Mistral can run scripts. |
| 2026-10-05 | Source type `product-documentation` (ONDA’s own pages, app behaviour only). Source year = journal volume year. Roadmap added to the pack; `relatedPlanned` may list any roadmap page. |
| 2026-10-04 | After `rmssd`: no repeats around facts (auto-checked), exact `quote` per evidence row (required), `imageAlt` + `imagePrompt` in the light scientific style (required), lessons file. |

## Facts outside the science section (since 2026-10-05)

`{{fact:<id>}}` and `{{fact:<id>|short}}` also work in articles, article FAQs, topic-hub FAQs and the glossary, in every language: EN is resolved in the data modules, translations in the chunk generator and the prerender. Translations of the hand-written facts live in `src/data/science/facts-i18n.ts` (ru/uk reviewed by Yakiv); table facts are formatted per locale automatically. A missing translation, a missing short form, an unknown or unapproved fact fails the build, and `scripts/check-no-unresolved-facts.mjs` fails the build if any placeholder reaches `dist`. Translation tooling exports the raw text with placeholders.

## Backlog

- **After the science MVP:** go through the articles and replace hand-typed numbers with facts — HRV norms, resting heart rate, breathing rate, resonance pace, baseline windows (owner request 2026-10-05).

Background (not rules): the original specs are in `D:\_ONDA\_Sciense\` (001–005), and the audit with the page decisions is [`../science-audit.md`](../science-audit.md).
