# ONDA Science — authoring guide (for Mistral / Le Chat)

You write pages for the ONDA Science section at `https://onda-life.com/science/…`. This file is your contract. Read it fully before every writing session. The page plan and overlap rules are in [`science-audit.md`](./science-audit.md). The writing standard is spec 002 (*ONDA Science Content Specification — Master Instructions*), summarised below.

## 1. Where you work

- **Branch:** `science-content` only. Never push to `main`.
- **Files you may create or edit — nothing else:**
  `landing/content/science/{concepts,measurements,mechanisms,evidence}/<slug>.md`
- **Do not touch** code, `src/data/science/facts.ts`, the template, the glossary, articles, translations, config, or anything outside that folder. A check fails the branch if you do. If you need a new fact, a new link target or a code change, write it in your hand-off note — Claude Code adds it on `main`.
- **Language:** English only.

## 2. The 13 MVP pages (one file each)

| File | Notes |
|---|---|
| `concepts/heart-rate-variability.md` | Central entity: what HRV is, the main metrics, what HRV does *not* tell you. |
| `concepts/rmssd.md` | Definition, what it reflects, how wearables report it. |
| `concepts/sdnn.md` | Definition; Apple Health records HRV as SDNN (`{{fact:applewatch.hrv.healthkit}}`). |
| `concepts/hrv-baseline.md` | Personal baseline: `{{fact:baseline.window}}`, `{{fact:baseline.compare}}`. |
| `concepts/autonomic-nervous-system.md` | One page covering both branches. No separate sympathetic/parasympathetic pages. |
| `concepts/vagus-nerve.md` | Anatomy and function; `{{fact:claim.vagalTone}}`. No practices. |
| `concepts/respiratory-sinus-arrhythmia.md` | The core link between breathing and heart rate. |
| `measurements/heart-rate-variability.md` | **Flagship 1** — “Can You Trust HRV From a Smartwatch or Ring?” (spec 003). |
| `measurements/resting-heart-rate.md` | Method and conventions: `{{fact:rhr.adult.normal}}` plus `{{fact:rhr.adult.normal.caveat}}`. |
| `mechanisms/breathing-and-hrv.md` | RSA, baroreflex around 0.1 Hz, resonance; evidence classes. |
| `evidence/hrv-biofeedback.md` | Synthesis of evidence for HRV biofeedback. |
| `evidence/slow-breathing.md` | Synthesis of evidence for slow breathing (covers the “slow breathing” concept). |
| `evidence/transcutaneous-vagus-nerve-stimulation.md` | **Flagship 2** — “Does Vagus Nerve Stimulation Really Work?” (spec 005). |

**Not in scope:**
- no `/questions/` pages;
- no `/research/` pages;
- no device rankings;
- no practice guides — those belong to articles.

## 3. File format

Copy [`landing/content/science/_TEMPLATE.md`](../content/science/_TEMPLATE.md). Every field is required unless marked optional.

- **Frontmatter:**
  - `kind`, `slug` — `slug` must equal the file name.
  - `title` — ≤70 characters.
  - `metaTitle` — ≤52 characters.
  - `metaDescription` — 110–155 characters.
  - `shortAnswer` — 40–80 words.
  - `keyPoints` — 3–7 items.
  - `editor: "Yakiv Bilenko"`, `reviewer: null`, `lastReviewed: null`.
  - `related`, `sources`, `evidenceMap`.
- **`reviewer` and `lastReviewed` are set by Yakiv, never by you.** “Valentin Zhigulin” goes there only if he actually read the page.
- **Body sections** (spec 002 §9), as `##` headings:
  1. What is X?
  2. How does it work?
  3. How is it measured?
  4. What affects it?
  5. What does the evidence show?
  6. What it does not tell you
  7. In ONDA

  Then the medical line. Skip a section only if it truly does not apply.

## 4. Evidence rules

1. **Every factual claim has a row in `evidenceMap`** with: claim, sources, class and limitation. Classes are `established`, `context-dependent`, `emerging`, `debated` and `unknown`. There are no numeric grades and no invented grades.
2. **Every source has a real DOI or PMID.** The check looks each one up in Crossref and PubMed; a fabricated identifier fails the branch.
   - Prefer systematic reviews, meta-analyses and guidelines.
   - Name the study type correctly.
   - The flagships use the sources in specs 003 and 005; their DOIs have been verified.
3. **Cite inline** as `[S1]` or `[S1, S3]`. Every cited id must be in `sources`.
4. **Never invent numbers.** That includes study counts, participants, effect sizes and percentages.
   - If a study figure matters, ask in your hand-off note for a fact to be added.
   - Study facts such as “43 studies” or “SMD −0.57” go into `facts.ts` with the source, then you reference them.
5. **Say what is not known.** Every page has “What it does not tell you” plus limitations in the evidence map.
6. **Implanted-device evidence** (VNS) must never support claims about non-invasive devices.
7. **Apple Watch.** Only the official facts may be used:
   - `applewatch.hrv.healthkit`
   - `applewatch.hrv.variants2026`
   - `applewatch.hrv.rmssdType`

   Do **not** write that Recovery HRV is RMSSD: Apple has not stated it.

## 5. Numbers: only through facts

Every number in the body comes from `{{fact:<id>}}`. The build replaces the reference with the approved value, and an unknown or unapproved id fails the build.

- **The list of ids** is in `landing/src/data/science/facts.ts`. Use only entries with `status: 'approved'`.
- **Table facts** are generated from the norm tables:
  - `hrv.rmssd.median.40-49` and `hrv.rmssd.typical.40-49`
  - `hrv.sdnn.median.35-44`
  - `rhr.male.median.18-39` and `rhr.female.typical.40-59`

  Age labels in ids use `18-29`, `30-39` … `70plus`.
- **Allowed without facts:**
  - age labels in prose (“aged 40–49”);
  - years in citations — “(Voss 2015)”, “Voss (2015)”;
  - source markers `[S1]`;
  - link URLs.
- **Title, metaTitle, metaDescription, shortAnswer and keyPoints contain no digits at all** — write in words.
- **Missing fact:** write `{{fact:NEW: description}}` in your draft and list it in the hand-off note. Claude Code adds and approves facts on `main` before merging.

## 6. Banned wording (spec 002 §6–7)

| Don’t write | Write instead |
|---|---|
| HRV measures vagal tone / X trains your vagal tone | `{{fact:claim.vagalTone}}` |
| a long exhale stimulates / activates the vagus nerve | `{{fact:claim.slowExhale}}` |
| LF/HF is the sympathetic–parasympathetic balance | LF/HF is debated and does not measure sympathovagal balance |
| higher HRV is always better | higher HRV is generally associated with better recovery, with exceptions |
| low HRV means you are stressed | `{{fact:claim.hrvNotStress}}` |
| reset your nervous system, hack your biology | — |
| cures, treats (anxiety/depression/insomnia), clinically proven | describe the evidence with its class |
| Recovery HRV = RMSSD | not officially stated by Apple |

**Other rules:**
- Tone is plain, calm and exact. Use short sentences.
- Define a term the first time you use it.
- No hype, no fear, no promotion.
- The “In ONDA” section is factual: check [`onda-facts-source-of-truth.md`](./onda-facts-source-of-truth.md). For example, ONDA has no numeric breathing pacer, coherence needs Apple Watch, and the camera gives pulse but not HRV.
- The page must remain useful if “In ONDA” is removed.
- ONDA-specific terms are labelled as ONDA terms.

## 7. Links (`related` and inline)

- **Each page gets 3–6 high-value links**, chosen from:
  - existing articles (`/articles/<slug>`);
  - glossary terms (`/glossary/<slug>`);
  - tools (`/tools/<slug>`);
  - other science pages (`/science/<kind>/<slug>`).
- **Check overlaps** in the audit table (§2 of `science-audit.md`). Link to the article that owns the practical angle; never rewrite it.
- **Links must point to pages that exist**, or to science pages in this branch. The check verifies this.

## 8. Automatic checks (they run on every push to `science-content`)

`npx tsx scripts/check-science-content.ts --diff` (from `landing/`), plus a full site build with `validate-seo`. The checks cover:

1. **Frontmatter:** fields present, lengths, `kind` and `slug` match the path, editor and reviewer rules.
2. **Sources:** each DOI or PMID exists in Crossref or PubMed.
3. **Evidence map:** valid classes, limitations present, every `[Sx]` defined.
4. **Numbers:** none outside `{{fact:}}`; every fact id exists and is approved.
5. **Banned wording.**
6. **Links:** `related` and inline links point to pages that exist.
7. **Files:** nothing changed outside `landing/content/science/<kind>/<slug>.md`.
8. **Build:** the site builds, and `validate-seo` passes (JSON-LD, canonical, structure).

Run the first check locally before pushing. Use `--offline` to skip the source lookups.

## 9. Hand-off note (put it in the commit message or the PR description)

- the pages added or changed;
- new facts needed, as `id`, value, scope and source DOI;
- new link targets needed;
- open questions, and anything you were unsure about.

---

## Manual review checklist (Claude Code, before merging `science-content` → `main`)

- [ ] **Automatic checks are green** on the branch: content gate and build with `validate-seo`.
- [ ] **Diff contains only** `landing/content/science/<kind>/<slug>.md`.
- [ ] **Overlap:** the page does what its row in `science-audit.md` §2 says. It does not repeat the article that owns the practical or “why are my numbers different” angle, and it does not cannibalise the glossary term.
- [ ] **Sources:** for every source, the title, authors and year in the file match Crossref and PubMed (the check proves existence, not the match). I opened the abstract and confirmed it supports the claim in the evidence-map row.
- [ ] **Study numbers** cited in prose are facts with a source (no invented counts, effect sizes or percentages).
- [ ] **Claim classes are honest.** Nothing “established” rests on a single small trial, and no implanted-VNS evidence is used for non-invasive claims.
- [ ] **No medical advice and no diagnosis.** The safety line is present where relevant, and red-flag symptoms point to a doctor or emergency care.
- [ ] **“In ONDA”** matches `onda-facts-source-of-truth.md`: no pacer claim, coherence only with Apple Watch, camera gives pulse but not HRV. No promotion.
- [ ] **Apple Watch** wording uses only the official facts (no “Recovery HRV = RMSSD”).
- [ ] **Readability:** answer first, short sentences, terms defined, nothing written to game search.
- [ ] **Metadata:** `metaTitle` and `metaDescription` are unique and do not duplicate an existing page’s title.
- [ ] **New facts** requested in the hand-off note are added to `facts.ts` on `main` and approved by Yakiv; the page then uses them.
- [ ] **Reviewer and date:** `reviewer` stays `null` unless Valentin Zhigulin really read the page; Yakiv sets `lastReviewed`.
- [ ] **After merging:** the build on `main` is green, the page renders at `/science/<kind>/<slug>`, and the links from the glossary, tools and articles are added as planned (§5 of the audit).
