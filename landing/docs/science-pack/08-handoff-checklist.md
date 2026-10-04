# 8. Hand-off checklist (Mistral)

Before sending a page, check every item. Then send **the file plus the hand-off note** below.

## Checks

**File**
- [ ] One page = one file named `<slug>.md`, for the intended path `landing/content/science/<kind>/<slug>.md`, built from [02-template.md](02-template.md).
- [ ] The page is one of the 13 in [06-mvp-pages.md](06-mvp-pages.md), and it does what its row says.

**Frontmatter**
- [ ] `kind` is the folder and `slug` is the file name.
- [ ] Length limits:
  - title ≤ 70 characters;
  - metaTitle ≤ 52;
  - metaDescription 110–155;
  - shortAnswer 40–80 words;
  - keyPoints 3–7.
- [ ] No digits in title, metaTitle, metaDescription, shortAnswer or keyPoints.
- [ ] `editor: "Yakiv Bilenko"`, `reviewer: null`, `lastReviewed: null`.

**Content**
- [ ] Every number in the body is a `{{fact:…}}` from [03-facts.md](03-facts.md), or a `{{proposed:P…}}` declared in `proposals` with value, scope, DOI/PMID and quote or location ([01-quality-standard.md](01-quality-standard.md) §1.11).
- [ ] Every factual claim has an `evidenceMap` row with sources, class and limitation. Methodological recommendations use class `guideline` and cite a guideline source.
- [ ] Every source has a DOI or PMID, except official documentation: type `official`, a URL, and only rows with `claimType: device` or `regulatory`. Sources from [04-sources.md](04-sources.md) are used first.
- [ ] Every `[Sx]` in the text is defined in `sources`, and every source is cited.
- [ ] The study type is named correctly. No “established” class rests on a single small trial.
- [ ] Nothing from [05-banned-wording.md](05-banned-wording.md) appears.
- [ ] Body sections in the order of [01-quality-standard.md](01-quality-standard.md) §1.7, including “What it does not tell you” and the medical line.
- [ ] “In ONDA” is factual, checked against `docs/onda-facts-source-of-truth.md`, and has no promotion.

**Links**
- [ ] 3–6 links in `related`, all to pages that exist. Unwritten MVP science pages go in `relatedPlanned`, not in `related` or inline links.
- [ ] The page does not repeat what the overlapping articles own.

## Check log

If you can run scripts, run the real check on your file and attach the full output to the hand-off:

```
cd landing
npx tsx scripts/check-science-content.ts --file <path/to/your-file.md>
```

- **`OK`** — the file passes.
- **`OK … draft OK, not publishable yet`** with a PENDING list — the file passes, and the pending items are your proposals. That is expected.
- **Any `problem(s)`** — fix them before handing in.

Do not paraphrase the log; paste it as printed. If you cannot run scripts, say so in the hand-off note.

## Hand-off note (send with the file)

```
Page: <kind>/<slug>
Intent in one sentence:
Proposals:          P1 … — one line each: kind | value | scope | DOI/PMID/URL | quote or location   (or “none”)
Check log:          attached / could not run scripts
New link targets:   (pages that don’t exist yet, or “none”)
Sections skipped:   (which and why, or “none”)
Open questions / unsure about:
```
