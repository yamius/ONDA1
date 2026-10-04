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
- [ ] Every number in the body is a `{{fact:…}}` with status `approved` in [03-facts.md](03-facts.md). Missing values are written as `{{fact:NEW: …}}`.
- [ ] Every factual claim has an `evidenceMap` row with sources, class and limitation.
- [ ] Every source has a DOI or PMID. Sources from [04-sources.md](04-sources.md) are used first.
- [ ] Every `[Sx]` in the text is defined in `sources`, and every source is cited.
- [ ] The study type is named correctly. No “established” class rests on a single small trial.
- [ ] Nothing from [05-banned-wording.md](05-banned-wording.md) appears.
- [ ] Body sections in the order of [01-quality-standard.md](01-quality-standard.md) §1.7, including “What it does not tell you” and the medical line.
- [ ] “In ONDA” is factual, checked against `docs/onda-facts-source-of-truth.md`, and has no promotion.

**Links**
- [ ] 3–6 links in `related`. Every link points to an existing page or an MVP science page.
- [ ] The page does not repeat what the overlapping articles own.

## Hand-off note (send with the file)

```
Page: <kind>/<slug>
Intent in one sentence:
New facts needed:   id | value | scope | source DOI/PMID      (or “none”)
New sources:        authors | title | journal | year | DOI/PMID | type | cited for   (or “none”)
New link targets:   (pages that don’t exist yet, or “none”)
Sections skipped:   (which and why, or “none”)
Open questions / unsure about:
```
