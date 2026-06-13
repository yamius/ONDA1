# ONDA Life Deck v2.0 → v2.1 — Designer Patch Sheet

> Drop-in fixes for the structural inconsistency between Part 1 (8-level
> product) and Part 2 (24-level scientific framework), plus 3 minor
> consistency improvements. Apply to
> `_ONDA_Life_Product_Ecosystem_&_Neuro-Physiological_Framework_v2.0.pdf`.
>
> Total estimated work: ~15 minutes (one new slide + three text edits).

---

## PATCH 1 — NEW SLIDE between Part 1 and Part 2 — 🔴 CRITICAL

**Reason:** Reviewer reads "Core Practice Engine: 8 Levels" on Slide 4,
then 10 slides later sees "A 24-Level Neuro-Physiological Framework"
without explanation. The bridge slide closes the gap: the 8 levels are
the *shipping product*, the 24 levels are the *scientific framework and
research roadmap*. Position immediately **after** Slide 15 (Roadmap),
**before** the Part 2 title slide ("A 24-Level Neuro-Physiological
Framework").

### Slide title

> **From Product to Framework: The 8-Level MVP and the 24-Level Map**

### Slide body — left column (paragraph)

> The ONDA mobile app currently ships an **8-level curriculum** — a
> user-validated entry path that spans every block of the full
> neuro-physiological framework. The 24-level model on the following
> pages is the **scientific backbone**: a complete map from autonomic
> stability to peak-state coherence. Each shipped level corresponds to
> one or more blocks of the full framework. Future releases progressively
> unlock the remaining levels as longitudinal data supports each phase.

### Slide body — right column (mapping table)

> | Block of the 24-Level Framework | Levels | Currently shipping in MVP |
> |---|---|---|
> | **1. Autonomic Homeostasis** | 1–6 | L1, L2, L3, L4, L5 |
> | **2. Executive Function & Social Intelligence** | 7–12 | L6 |
> | **3. Network Integration & Interoceptive Accuracy** | 13–18 | *roadmap — Eye-Scan v2 dependency* |
> | **4. Structural Neuroplasticity** | 19–21 | L7 (primer) |
> | **5. Peak States & Transient Hypofrontality** | 22–24 | L8 (gateway) |

### Slide footer (optional caption)

> *MVP coverage spans 4 of 5 blocks. Block 3 (Network Integration) ships
> after the longitudinal Eye-Scan v2 baseline lands — that biomarker is
> the natural prerequisite for measuring large-scale network coherence.*

---

## PATCH 2 — Cover Slide 1 — Title update

**Reason:** Current title "Technical Architecture & Product Ecosystem"
does not signal the Part 2 content (24-level neuro-physiological
framework). Reviewer expects technical + clinical scope from the cover.

### BEFORE

> **ONDA LIFE**
> *Technical Architecture & Product Ecosystem*
> PROJECT OVERVIEW • ENGINEERING DOCUMENTATION • 2026

### AFTER (replace verbatim)

> **ONDA LIFE**
> *Technical Architecture, Product Ecosystem & the 24-Level
> Neuro-Physiological Framework*
> ENGINEERING & CLINICAL RESEARCH DOCUMENTATION • 2026

---

## PATCH 3 — Slide 4 (Core Practice Engine) — Disambiguate L3 and L7

**Reason:** Two of the 8 MVP level names accidentally reuse terms that
in the 24-level framework refer to *different* blocks. A
neuroscience-literate reviewer will spot the collision.

### Conflict A — Level 3

> Current MVP L3 is **"Network Coherence"** — but in the 24-level
> framework that exact phrase labels **Block 3 (Levels 13–18: Network
> Integration & Interoceptive Accuracy)**. The MVP L3 is actually about
> HRV-based cardiac coherence training, not large-scale neural network
> coherence.

### BEFORE — Level 3 card

> **LEVEL 3 — Network Coherence**
> Coherence training, biofeedback-driven sessions.

### AFTER — Level 3 card (replace verbatim)

> **LEVEL 3 — Cardiac Coherence**
> Heart-rate-variability biofeedback and resonant-frequency entrainment.

### Conflict B — Level 7

> Current MVP L7 is **"Structural Neuroplasticity"** — Block 4 of the
> 24-level framework is **"Structural Neuroplasticity & Epigenetic
> Regulation (Levels 19–21)"**. Renaming L7 to a primer-tier label keeps
> the term reserved for its proper place in the full framework.

### BEFORE — Level 7 card

> **LEVEL 7 — Structural Neuroplasticity**
> Epigenetic regulation and targeted remodeling of neural pathways.

### AFTER — Level 7 card (replace verbatim)

> **LEVEL 7 — Neuroplasticity Primer**
> Foundational BDNF induction and synaptic-rewiring protocols (gateway
> to Block 4: Structural Neuroplasticity).

---

## PATCH 4 — Slide 2 (Ecosystem) — Optional Research Layer mention

**Reason:** Three-product ecosystem (App, Web, Watch) is clean, but the
24-level framework that follows in Part 2 has no representation here.
Adding a Research Layer banner under the three columns signals to the
reviewer that there is a **fourth dimension** to the platform — the
scientific backbone — before they get to it on Page 16+.

### CHANGE — Add a single banner below the three product columns

Replace (or extend) the existing footer banner:

### BEFORE — bottom banner

> *Unified Ecosystem: Shared Supabase backend, common brand identity,
> and seamless cross-platform user profiles.*

### AFTER (replace verbatim)

> *Unified Ecosystem: Shared Supabase backend, common brand identity,
> seamless cross-platform user profiles.*
>
> *Research Layer: A 24-level neuro-physiological framework with
> biomarker validation roadmap (HRV, PFC/DMN dynamics, plasma BDNF, EEG
> coherence, Cortisol Awakening Response) — detailed in Part 2.*

*(If the deck owner prefers one tight line, an alternative:* "Unified
Ecosystem: Shared Supabase backend + common brand identity + a 24-level
neuro-physiological framework underpinning the curriculum." *)*

---

## SUMMARY — Designer worklist

| # | Slide | Action | Effort |
|---|-------|--------|--------|
| **1** 🔴 | **NEW slide 16** between Part 1 Roadmap and Part 2 title | Insert bridge slide (title + paragraph + 5-row table + caption) | 8 min |
| **2** 🟡 | Slide 1 (Cover) | Update subtitle text | 1 min |
| **3** 🟢 | Slide 4 (8 Levels) | Rename L3 and L7 cards | 2 min |
| **4** 🟢 | Slide 2 (Ecosystem) | Add Research Layer line to bottom banner | 2 min |

**Total estimated work:** ~15 minutes. One new slide, three text edits.
No layout changes, no new graphics.

---

## VERIFICATION CHECKLIST POST-PATCH

After applying, the deck should pass these consistency rules:

▸ **Rule 1 — 8 vs 24 levels is explained.** Slide 16 (new) shows the
  mapping; reviewer never wonders "is the app 8 or 24 levels?"

▸ **Rule 2 — No term collisions between Part 1 and Part 2.** L3
  ("Cardiac Coherence") and L7 ("Neuroplasticity Primer") no longer
  reuse Block 3 or Block 4 names of the full framework.

▸ **Rule 3 — Research Layer is visible early.** Slide 2 (Ecosystem)
  forecasts the 24-level framework so it does not appear as an
  unexpected bolt-on on page 16.

▸ **Rule 4 — Cover signals both halves.** Slide 1 title mentions the
  24-level framework so a reviewer who reads only the cover knows
  what the document contains.

When all four pass — the deck is structurally aligned for Eurostar
submission.

---

## CONTEXT (FOR REFERENCE)

The MVP-to-framework mapping used in Patch 1 is grounded in the actual
content of Part 2:

- **MVP L1 "Autonomic Homeostasis"** = direct match to Block 1's lead label.
- **MVP L2 "Parasympathetic Activation"** = Block 1, Levels 4-6 (ventral
  vagal engagement).
- **MVP L3 "Cardiac Coherence" (renamed)** = Block 1, HRV-coherence
  training rail.
- **MVP L4 "HPA-Axis Regulation"** = bridging Block 1 → Block 4 (stress
  architecture).
- **MVP L5 "Limbic System Integration"** = Block 1, Levels 4-6 ("Limbic
  System and Vagus Nerve").
- **MVP L6 "Executive Function"** = Block 2's lead label.
- **MVP L7 "Neuroplasticity Primer" (renamed)** = primer for Block 4
  ("Structural Neuroplasticity & Epigenetic Regulation").
- **MVP L8 "Peak State Optimization"** = gateway to Block 5 ("Peak
  States & Transient Hypofrontality").

Block 3 ("Network Integration & Interoceptive Accuracy", Levels 13-18)
has no MVP representative — this is acknowledged in the new Slide 16
footer as a deliberate roadmap dependency on Eye-Scan v2's longitudinal
baseline (the natural biomarker for measuring large-scale network
coherence).

---

*Patch sheet generated 2026-05-20. Based on text extraction of
`_ONDA_Life_Product_Ecosystem_&_Neuro-Physiological_Framework_v2.0.pdf`
(12 pages, 1.2 MB). All Part 2 references (Block 1-5, biomarkers, level
ranges) cross-checked against the source PDF.*
