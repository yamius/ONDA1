# 1. Quality standard

Condensed from spec 002 (*ONDA Science Content Specification — Master Instructions*). Where this file and spec 002 differ, this file wins.

**Golden rule: evidence first, prose second.** Every page is a durable knowledge entity:

definition → mechanism → measurement → evidence → limitations → related entities.

It is not a blog post, not a practice guide, not an ad.

## 1.1 Evidence-first workflow (before writing prose)

1. **Claim inventory** — list every scientific claim the page will make.
2. **Classify** each claim (§1.3).
3. **Attach evidence** — every factual claim gets a source from [04-sources.md](04-sources.md), or a new source with a verifiable DOI/PMID.
4. **Population** — does the evidence apply to:
   - healthy adults, athletes or older adults;
   - children;
   - patients or specific diseases;
   - lab participants;
   - real-world wearable users?

   Say who.
5. **Measurement context** — ECG or PPG, recording length, posture, breathing, time of day, activity, device, artefact correction.
6. **Causality** — never turn an association into a cause without evidence for causality.
7. **Individual interpretation** — never turn a population finding into a personal diagnosis.
8. **Semantic validity** — ask: *does this metric actually measure what the sentence says it measures?*

If a claim cannot be sourced, remove or qualify it. If scientific uncertainty is unresolved, **stop** and flag it in the hand-off note. Do not manufacture certainty.

## 1.2 Source hierarchy

**Prefer, in this order:**
1. Professional guidelines and consensus statements.
2. Systematic reviews and meta-analyses.
3. High-quality peer-reviewed reviews.
4. Strong primary studies.
5. Authoritative medical or scientific organisations.
6. Foundational papers, when historically necessary.

**Never use as evidence:**
- wellness blogs;
- SEO articles;
- influencer content;
- product pages (except official regulatory or manufacturer specs, for a device fact);
- supplement marketing;
- unsourced biohacking claims;
- AI-generated summaries.

**Name the study type correctly.** A single crossover trial is not a meta-analysis.

## 1.3 Evidence classes

Every row of `evidenceMap` has exactly one class. There are no numeric grades and no invented grades.

| Class | Use when |
|---|---|
| `established` | Guidelines, consensus or consistent meta-analytic evidence. Never for a single small trial. |
| `context-dependent` | Supported, but only in a stated population, condition or measurement setting. |
| `emerging` | Early or small studies point one way; the evidence is not yet consistent. |
| `debated` | Credible sources disagree. |
| `unknown` | Not studied enough to say. Say so plainly. |

**Evidence-map row:** claim → sources → class → limitation.
- The limitation is required.
- Do not invent study counts, effect sizes, percentages or “scientifically proven” labels.
- A study number that matters becomes a fact (see [03-facts.md](03-facts.md)).

## 1.4 Scientific writing rules

**Tone.** Precise, calm, readable, technically literate. No hype, no fear, no promotion.

**Style.**
- Short sentences.
- Answer first.
- Define each term the first time you use it.

**Hedges, used when warranted:**
- “is associated with”;
- “may reflect”;
- “evidence suggests”;
- “in controlled studies”;
- “in this population”;
- “under these measurement conditions”;
- “does not by itself establish”.

**Terminology.** Keep established science terms (HRV, RMSSD, SDNN, RSA, ANS) apart from ONDA terms (ONDA Level, ONDA states, practice names, Simple mode). Label ONDA terms as ONDA terms. Never present an ONDA construct as an established scientific one.

**Numbers.** Numbers appear only through `{{fact:…}}`. Title, metaTitle, metaDescription, shortAnswer and keyPoints contain no digits at all; write numbers there in words.

**Wording.** Banned wording is listed in [05-banned-wording.md](05-banned-wording.md).

## 1.5 HRV-specific limits

- HRV is **not** a direct measure of sympathetic or parasympathetic activity, and not a measure of “vagal tone” (`{{fact:claim.vagalTone}}`).
- LF/HF is **not** a sympathetic–parasympathetic balance score. It is debated.
- A single wearable HRV value is **not** a diagnosis (`{{fact:claim.hrvNotStress}}`).
- Higher HRV is **not** universally better. It is generally associated with better recovery, with exceptions such as arrhythmia and some medical conditions.
- Interpretation depends on:
  - recording method (ECG vs PPG);
  - duration;
  - breathing;
  - posture;
  - time of day (night vs short daytime readings);
  - analysis method;
  - the person.

  State the context of every number.
- Trends against your own baseline are usually more informative than a single value.
- **Apple Watch: use only the official facts** `applewatch.hrv.healthkit`, `applewatch.hrv.variants2026` and `applewatch.hrv.rmssdType`. Apple has not stated that Recovery HRV is RMSSD — do not write it.

## 1.6 Medical safety

Science pages are educational. **Never:**
- diagnose or prescribe;
- imply a wearable metric confirms a disease;
- imply ONDA replaces clinical care;
- tell anyone to ignore symptoms;
- turn population statistics into an individual verdict.

When symptoms come up, separate physiology education from diagnosis. Point red-flag symptoms to a doctor, or to emergency care. Red-flag symptoms include chest pain, fainting, severe breathlessness and palpitations with dizziness.

Every page ends with the line:

> Educational information, not a diagnosis or medical treatment.

## 1.7 Page structure

The frontmatter is defined in [02-template.md](02-template.md). The body uses these `##` headings, in this order:

1. **What is X?** — plain-language definition.
2. **How does it work?** — mechanism.
3. **How is it measured?** — methods, conditions, what the metric actually measures.
4. **What affects it?** — important modifiers.
5. **What does the evidence show?** — synthesis by evidence class: what is established, what depends on context, what is emerging or debated, what is unknown.
6. **What it does not tell you** — limitations and misconceptions. **Required on every page.**
7. **In ONDA** — one short factual paragraph. It covers:
   - why ONDA cares about this;
   - where it appears in ONDA;
   - which ONDA tool or practice relates to it;
   - what ONDA does not diagnose.

   Check `docs/onda-facts-source-of-truth.md`. For example:
   - coherence needs Apple Watch;
   - the camera gives pulse, not HRV;
   - there is no numeric breathing pacer in the app.

   No promotion. The page must stay useful if this section is removed.

Then the medical line. Skip a section only if it truly does not apply, and say why in the hand-off note.

The site builds these parts from the frontmatter, so do not write them in the body:
- breadcrumbs;
- the related-links blocks (from `related`);
- the sources list (from `sources`);
- the byline;
- the JSON-LD.

## 1.8 Blocks for AI answers (GEO)

AI assistants must be able to quote the page without losing the caveats.

- **`shortAnswer`** (40–80 words) follows the pattern: *“[Entity] is [definition]. It is used to [function]. It is influenced by [major factors]. It does not by itself establish [important limitation].”*
- **`keyPoints`** has 3–7 one-sentence points. Each one is self-contained and true out of context.
- **Headings are questions.** Definitions are explicit, so the reader never has to infer them from the introduction.
- **Evidence statements carry their class** (“established”, “emerging”…). Uncertainty is written out (“What remains uncertain: …”).
- **No marketing in the first screen.**

## 1.9 Duplication check (before writing any page)

Answer these for the page’s intent. The audit’s answers are in [06-mvp-pages.md](06-mvp-pages.md).

1. Is there a glossary term?
2. Is there an article with the same intent?
3. Is there research content (`/research`)?
4. Is there a tool?
5. Is there a topic hub?
6. Which page is the **canonical owner** of this intent?

Then:
- **Practical, “how to”, “why are my numbers different” and age-norm intents belong to articles and tools.** Link to them; do not rewrite them.
- **The glossary stays a short definition.** The science page is the full entity.
- **No page exists because a keyword exists.** Every page has a distinct intent.

## 1.10 Links

Each page gets **3–6 high-value links** in `related`, plus inline links where they help. Choose them from:
- articles (`/articles/<slug>`);
- glossary terms (`/glossary/<slug>`);
- tools (`/tools/<slug>`);
- other science pages (`/science/<kind>/<slug>`).

Every link must point to a page that exists, or to another MVP science page.
