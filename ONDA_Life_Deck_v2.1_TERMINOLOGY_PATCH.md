# ONDA Life Deck v2.0 → v2.1 — Final Terminology Patch

> **Supersedes** the earlier `ONDA_Life_Deck_v2.0_PATCHES.md`. Same four
> structural fixes, plus a clean separation of terminology so the two
> frameworks no longer compete for the word "Level":
>
> - **Part 1 (Product) → 8 LEVELS** *(unchanged — already in the app UI)*
> - **Part 2 (Scientific Framework) → 24 STEPS** *(was: 24 Levels)*
>
> Total estimated work: ~20 minutes (one new slide + find-replace across
> Part 2 + four text edits).

---

## PATCH 0 — Global find-and-replace in Part 2 only

**Scope:** Every reference to "level / levels" in Part 2 (slides 17–22)
becomes "step / steps". Part 1 (slides 1–15) is **not** touched —
those 8 Levels keep their name.

### Find-and-replace pairs (case-sensitive where shown)

| FIND | REPLACE | Occurs on |
|---|---|---|
| `24-Level` | `24-Step` | Cover, Slide 16 (bridge), Part 2 title slide |
| `24 Levels` | `24 Steps` | Bridge slide, Part 2 intro |
| `24-level framework` | `24-step framework` | Slide 2 (Ecosystem banner), bridge slide |
| `The 24-Level Physiological Progression` | `The 24-Step Physiological Progression` | Part 2 intro title |
| `Levels 1-6` | `Steps 1–6` | Block 1 cards |
| `Levels 1-3: Physiological Baseline` | `Steps 1–3: Physiological Baseline` | Block 1 detail slide |
| `Levels 4-6: Environmental Interaction` | `Steps 4–6: Environmental Interaction` | Block 1 detail slide |
| `Levels 7-12` | `Steps 7–12` | Block 2 cards |
| `Levels 7-9: Executive Control` | `Steps 7–9: Executive Control` | Block 2 detail slide |
| `Levels 10-12: Social Intelligence` | `Steps 10–12: Social Intelligence` | Block 2 detail slide |
| `Levels 13-18` | `Steps 13–18` | Block 3 cards |
| `Levels 13-15: Visceral Integration` | `Steps 13–15: Visceral Integration` | Block 3 detail slide |
| `Levels 16-18: Network Coherence` | `Steps 16–18: Network Coherence` | Block 3 detail slide |
| `Levels 19-21` | `Steps 19–21` | Block 4 cards |
| `Levels 19-20: Allostatic Load Downregulation` | `Steps 19–20: Allostatic Load Downregulation` | Block 4 detail slide |
| `Level 21: Structural-Functional Synergism` | `Step 21: Structural-Functional Synergism` | Block 4 detail slide |
| `Levels 22-24` | `Steps 22–24` | Block 5 cards |
| `Levels 22-23: Global Phase Coherence` | `Steps 22–23: Global Phase Coherence` | Block 5 detail slide |
| `Level 24: Transient Hypofrontality` | `Step 24: Transient Hypofrontality` | Block 5 detail slide |
| `validating the 24-level neuro-physiological framework` | `validating the 24-step neuro-physiological framework` | Closing "Join the ONDA Research Network" slide |

*(Em-dash "–" preferred over hyphen "-" in published range labels for
typographic polish; this is optional.)*

---

## PATCH 1 — NEW SLIDE 16 — *Bridge between Part 1 and Part 2*

**Position:** Immediately after Slide 15 (Roadmap), before the Part 2
title slide.

### Slide title

> **From Product to Framework: 8 Levels of the App, 24 Steps of the Framework**

### Slide body — left column (paragraph)

> The ONDA mobile app currently ships an **8-level curriculum** — a
> user-validated entry path that spans every block of the scientific
> framework. The **24-step model** detailed in Part 2 is the underlying
> neuro-physiological backbone: a complete map from autonomic stability
> to peak-state coherence. Each shipped Level corresponds to one or more
> Steps. Future releases progressively unlock the remaining Steps as
> longitudinal biomarker data supports each phase.

### Slide body — right column (mapping table)

> | Block of the 24-Step Framework | Steps | Currently shipping in MVP |
> |---|---|---|
> | **1. Autonomic Homeostasis** | 1–6 | Levels 1, 2, 3, 4, 5 |
> | **2. Executive Function & Social Intelligence** | 7–12 | Level 6 |
> | **3. Network Integration & Interoceptive Accuracy** | 13–18 | *roadmap — Eye-Scan v2 dependency* |
> | **4. Structural Neuroplasticity** | 19–21 | Level 7 (primer) |
> | **5. Peak States & Transient Hypofrontality** | 22–24 | Level 8 (gateway) |

### Slide footer caption

> *MVP coverage spans 4 of 5 blocks. Block 3 (Network Integration) ships
> after the longitudinal Eye-Scan v2 baseline lands — that biomarker is
> the natural prerequisite for measuring large-scale network coherence.*

---

## PATCH 2 — Slide 1 (Cover) — Updated subtitle

### BEFORE

> **ONDA LIFE**
> *Technical Architecture & Product Ecosystem*
> PROJECT OVERVIEW • ENGINEERING DOCUMENTATION • 2026

### AFTER (replace verbatim)

> **ONDA LIFE**
> *Technical Architecture, Product Ecosystem & the 24-Step
> Neuro-Physiological Framework*
> ENGINEERING & CLINICAL RESEARCH DOCUMENTATION • 2026

---

## PATCH 3 — Slide 4 (Core Practice Engine) — Disambiguate L3 and L7

**Reason:** Two MVP Level names reuse phrases that label entire Blocks
of the 24-Step framework. Renaming removes the term clash even before
the reader gets to Part 2.

### Level 3 card

| | |
|---|---|
| **BEFORE** | **LEVEL 3 — Network Coherence** · Coherence training, biofeedback-driven sessions. |
| **AFTER** | **LEVEL 3 — Cardiac Coherence** · Heart-rate-variability biofeedback and resonant-frequency entrainment. |

### Level 7 card

| | |
|---|---|
| **BEFORE** | **LEVEL 7 — Structural Neuroplasticity** · Epigenetic regulation and targeted remodeling of neural pathways. |
| **AFTER** | **LEVEL 7 — Neuroplasticity Primer** · Foundational BDNF induction and synaptic-rewiring protocols (gateway to Block 4: Structural Neuroplasticity, Steps 19–21). |

---

## PATCH 4 — Slide 2 (Ecosystem) — Research Layer banner

### BEFORE — bottom banner

> *Unified Ecosystem: Shared Supabase backend, common brand identity,
> and seamless cross-platform user profiles.*

### AFTER (replace verbatim — two-banner layout)

> *Unified Ecosystem: Shared Supabase backend, common brand identity,
> seamless cross-platform user profiles.*
>
> *Research Layer: A 24-step neuro-physiological framework with
> biomarker validation roadmap (HRV, PFC/DMN dynamics, plasma BDNF, EEG
> coherence, Cortisol Awakening Response) — detailed in Part 2.*

---

## SUMMARY — Designer worklist

| # | Slide(s) | Action | Effort |
|---|----------|--------|--------|
| **0** 🔴 | All Part 2 slides (17–22) | Find-and-replace "Level → Step" per table above | 5 min |
| **1** 🔴 | **NEW slide 16** | Insert bridge slide (title + paragraph + 5-row table + caption) | 8 min |
| **2** 🟡 | Slide 1 (Cover) | Update subtitle | 1 min |
| **3** 🟢 | Slide 4 (8 Levels) | Rename L3 and L7 | 2 min |
| **4** 🟢 | Slide 2 (Ecosystem) | Add Research Layer line | 2 min |

**Total estimated work:** ~20 minutes.

---

## VERIFICATION CHECKLIST POST-PATCH

▸ **Rule 1 — Terminology is clean.** Word "Level" appears only in Part 1
  (8 of them). Word "Step" appears only in Part 2 (24 of them). No slide
  mixes the two terms in the same context.

▸ **Rule 2 — Mapping is explicit.** Slide 16 (new) shows which MVP
  Levels correspond to which Framework Blocks/Steps; no reviewer should
  have to guess.

▸ **Rule 3 — No term collisions.** MVP L3 ("Cardiac Coherence") and L7
  ("Neuroplasticity Primer") no longer reuse Block 3 or Block 4 names.

▸ **Rule 4 — Research Layer is forecast on Slide 2.** A reviewer who
  reads only the first three pages already knows that a 24-step
  scientific framework follows.

▸ **Rule 5 — Cover signals both halves.** Slide 1 subtitle mentions the
  24-Step Framework explicitly.

When all five pass — deck is structurally complete for Eurostar.

---

## TONE & LANGUAGE NOTES

The terminology choice "Step" (vs alternatives "Stage" or "Phase"):

- **Step** is the recommended primary term: short, sequential, grant-
  friendly, no semantic baggage in neuroscience literature.
- **Stage** is acceptable if the deck owner wants a slightly more
  clinical register, but introduces a small ambiguity (developmental
  stages vs procedural stages).
- **Phase** is the most clinical but reads heavier in tables and titles.

The deck currently uses informal-to-clinical hybrid tone (e.g. "biological-
void visual language" alongside "Cortisol Awakening Response"). **Step**
matches that register exactly — it is technical without being academic.

If, after submission, peer-reviewed publication of the framework is
planned, the formal manuscript should use "Stages" or "Phases" (per
journal convention). For Eurostar grant submission, **Steps** is the
right call.

---

*Patch sheet generated 2026-05-20. Supersedes
`ONDA_Life_Deck_v2.0_PATCHES.md` — apply this one instead.*
