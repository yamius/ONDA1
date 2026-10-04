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

**First page to write:** `concepts/rmssd` (see [06-mvp-pages.md](06-mvp-pages.md)).

## Tools behind the pack

| Tool | What it does |
|---|---|
| `landing/src/data/science/facts.ts` | Facts module. Changed only by Claude Code, after Yakiv approves a value. |
| `npx tsx scripts/science-pack-facts.ts` | Regenerates `03-facts.md`. Run it after every change to `facts.ts`; `--check` fails if the doc is stale. |
| `npx tsx scripts/check-science-content.ts` | Automatic page checks: format, DOI/PMID exist, numbers only via facts, banned wording, links. `--offline` skips the source lookups. |
| `.github/workflows/science-content.yml` | Runs both checks and the full build whenever `landing/content/science/` or the facts change on `main`. |

Background (not rules): the original specs are in `D:\_ONDA\_Sciense\` (001–005), and the audit with the page decisions is [`../science-audit.md`](../science-audit.md).
