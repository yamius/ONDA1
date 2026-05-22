# ONDA Life Deck v2.1 → v2.2 — Restore Clinical Depth in Block Detail Slides

> v2.1 fixed all structural / terminology issues but, in doing so,
> lightened the 5 Block detail slides from v2.0's three-tier clinical
> structure (NEUROPHYSIOLOGICAL BASIS / TECHNOLOGICAL STACK / BIOLOGICAL
> PROTOCOL) down to plain step lists + a one-line Research Focus.
>
> This patch restores v2.0's clinical depth on top of v2.1's clean
> terminology. Each Block detail slide gets the 3-tier structure back,
> phrased to match v2.1's "Step" vocabulary, and with three minor
> wording fixes flagged in the earlier review (Biological Zero,
> Collective intelligence, Hypersynchrony).
>
> **Scope:** 5 slides only — Block 1 through Block 5 detail pages in
> Part 2. No changes to Part 1, cover, bridge slide, or closing.
>
> **Estimated work:** ~25 minutes (5 slides × ~5 min each).

---

## Universal layout (apply to all 5 Block detail slides)

Each detail slide has two parallel columns — one per sub-block. Within
each column the content is stacked vertically:

```
┌──────────────────────────────────────────────────────────────┐
│  BLOCK N — TITLE — Steps X–Y                                  │
├───────────────────────────┬──────────────────────────────────┤
│ Steps X–A: SUBTITLE-LEFT  │ Steps B–Y: SUBTITLE-RIGHT        │
│                            │                                  │
│ ▸ Step X: …                │ ▸ Step B: …                      │
│ ▸ Step X+1: …              │ ▸ Step B+1: …                    │
│ ▸ Step A: …                │ ▸ Step Y: …                      │
│                            │                                  │
│ NEUROPHYSIOLOGICAL BASIS   │ NEUROPHYSIOLOGICAL BASIS         │
│ [paragraph]                 │ [paragraph]                       │
│                            │                                  │
│ TECHNOLOGICAL STACK         │ TECHNOLOGICAL STACK              │
│ [paragraph with biomarkers] │ [paragraph with biomarkers]      │
│                            │                                  │
│ BIOLOGICAL PROTOCOL         │ BIOLOGICAL PROTOCOL              │
│ Protocol: Name. Body.       │ Protocol: Name. Body.            │
├───────────────────────────┴──────────────────────────────────┤
│ Research Focus: [unified one-liner spanning both sub-blocks]  │
└──────────────────────────────────────────────────────────────┘
```

**Typography hint for the designer:** the three section-labels
(NEUROPHYSIOLOGICAL BASIS, TECHNOLOGICAL STACK, BIOLOGICAL PROTOCOL)
should be small-caps / tracked-out / accent-color, matching the
existing eyebrow style used elsewhere in the deck. The "Protocol:"
prefix in the BIOLOGICAL PROTOCOL block stays inline.

---

## PATCH 1 — Block 1 detail slide

### Slide title
> **Block 1: Autonomic Homeostasis (Steps 1–6)**

### LEFT column — Steps 1–3: Physiological Baseline

- **Step 1:** Primary interoception and autonomic calibration.
- **Step 2:** Vagal tone optimization via resonance breathing.
- **Step 3:** Vestibulo-ocular reflex (VOR) and sensory integration.

**NEUROPHYSIOLOGICAL BASIS**
Cellular homeostasis and primary interoception (Insula). Activation of
Central Pattern Generators (CPG) for axial spinal dynamics. Mastering
gravity via the Vestibulo-Ocular Reflex.

**TECHNOLOGICAL STACK**
Targeting the Brainstem and Spinal Cord.
*Biomarkers:* HRV stability (rMSSD, SDNN), VOR gain, core muscle
recruitment patterns.

**BIOLOGICAL PROTOCOL**
*Protocol: Autonomic Stabilization.* Establishing the **physiological
baseline** by optimizing homeostatic loops and primary motor-control
circuits.

> ⚠️ Wording fix vs v2.0: replaced the informal phrase "Biological
> Zero" / "Point Zero" with **"physiological baseline"** — peer-review
> friendly, no loss of meaning.

### RIGHT column — Steps 4–6: Environmental Interaction

- **Step 4:** Central Pattern Generator (CPG) and locomotion stability.
- **Step 5:** Proprioceptive feedback and spatial awareness.
- **Step 6:** Defensive circuit recalibration and safety signaling.

**NEUROPHYSIOLOGICAL BASIS**
Navigating 3D space and environmental interaction. Regulation of
defensive neural circuits and transition to social safety via ventral
vagal engagement (Porges polyvagal framework).

**TECHNOLOGICAL STACK**
Targeting the Limbic System and Vagus Nerve.
*Biomarkers:* Spatial-navigation efficiency, cortisol modulation
during social stressors, HRV high-frequency power.

**BIOLOGICAL PROTOCOL**
*Protocol: Defensive Circuit Regulation.* Validating the transition
from survival-oriented sympathetic dominance to ventral vagal social
engagement.

### Bottom — Research Focus (replaces v2.1 line)
> **Research Focus:** Validating autonomic stability through HRV
> metrics, VOR gain, and interoceptive accuracy scores. Establishing
> the **physiological baseline** for longitudinal cohort tracking.

---

## PATCH 2 — Block 2 detail slide

### Slide title
> **Block 2: Executive Function & Social Intelligence (Steps 7–12)**

### LEFT column — Steps 7–9: Executive Control

- **Step 7:** Sustained attention and cognitive focus.
- **Step 8:** Cognitive flexibility and task-switching efficiency.
- **Step 9:** Working memory optimization and information processing.

**NEUROPHYSIOLOGICAL BASIS**
Developing clarity and the ability to filter signals from noise. Focus
on the Prefrontal Cortex (PFC) and Default Mode Network (DMN)
regulation for sustained attention and mental modeling.

**TECHNOLOGICAL STACK**
Targeting the PFC and DMN.
*Biomarkers:* Attention-span duration, DMN deactivation efficiency,
cognitive endurance metrics.

**BIOLOGICAL PROTOCOL**
*Protocol: Signal-to-Noise Optimization.* Enhancing cognitive
endurance through mental modeling and visualization, reducing
DMN-related interference.

### RIGHT column — Steps 10–12: Social Intelligence

- **Step 10:** Social-emotional regulation and empathy circuits.
- **Step 11:** Mirror neuron system activation and social resonance.
- **Step 12:** Interpersonal neural synchronization (hyperscanning paradigm).

> ⚠️ Wording fix vs v2.0/v2.1: replaced "Collective intelligence and
> group-state synchronization" (Step 12) with the peer-review-correct
> **"Interpersonal neural synchronization (hyperscanning paradigm)"** —
> ties directly to published EEG / fNIRS hyperscanning literature.

**NEUROPHYSIOLOGICAL BASIS**
Mastering social dynamics and interpersonal resonance. Activation of
the Mirror Neuron System and the broader social-brain network for
dyadic and group coupling.

**TECHNOLOGICAL STACK**
Targeting the Mirror Neuron System and Social Brain networks.
*Biomarkers:* Interpersonal neural synchronization (PLV between
participants), social-emotional resilience under stressors.

**BIOLOGICAL PROTOCOL**
*Protocol: Dyadic Neural Synchronization.* Mastering social
communication and collaborative cognition through activation of
high-order mirror systems.

### Bottom — Research Focus
> **Research Focus:** Measuring cognitive control through
> attention-task performance and social-emotional resilience via
> biometric responses to controlled social stressors. Hyperscanning
> validation in dyadic ONDA practice.

---

## PATCH 3 — Block 3 detail slide

### Slide title
> **Block 3: Network Integration & Interoceptive Accuracy (Steps 13–18)**

### LEFT column — Steps 13–15: Visceral Integration

- **Step 13:** Interoceptive accuracy and somatic awareness.
- **Step 14:** Visceral-emotional mapping and regulation.
- **Step 15:** Primary interoception and homeostatic signaling.

**NEUROPHYSIOLOGICAL BASIS**
Activating the Insula (interoception hub), Somatosensory Cortex
(S1/S2), and thalamic sensory gating. Engagement of C-tactile fibres
for affective touch and cerebellar body-mapping.

**TECHNOLOGICAL STACK**
Targeting the Insula and Parasympathetic NS.
*Biomarkers:* Increased gray-matter density in the insular cortex,
normalized galvanic skin response (GSR), heartbeat-counting accuracy
(Schandry task).

**BIOLOGICAL PROTOCOL**
*Protocol: Interoceptive Accuracy.* Enhancing the brain's ability to
accurately recognize and modulate internal signals via vagal
modulation of insular cortex.

### RIGHT column — Steps 16–18: Network Coherence

- **Step 16:** Default Mode Network (DMN) regulation and decoupling.
- **Step 17:** Central Executive Network (CEN) integration.
- **Step 18:** Salience Network (SN) optimization and switching.

**NEUROPHYSIOLOGICAL BASIS**
Achieving an optimal metastable state by balancing the DMN, Salience,
and CEN tri-network architecture (Menon 2011). Transitioning from
controlled engagement to flexible large-scale coherence.

**TECHNOLOGICAL STACK**
Targeting large-scale network coherence.
*Biomarkers:* Reduced within-DMN functional connectivity, increased
cross-network coherence, EEG Phase-Locking Value (PLV).

**BIOLOGICAL PROTOCOL**
*Protocol: Network Crosstalk Mitigation.* Achieving coherence across
DMN / Salience / CEN by optimizing the dynamic switching between
major brain hubs.

### Bottom — Research Focus
> **Research Focus:** Validating interoceptive accuracy through
> heartbeat-counting tasks (Schandry) and neural-network coherence via
> Phase-Locking Value (PLV) and resting-state fMRI connectivity.

---

## PATCH 4 — Block 4 detail slide

### Slide title
> **Block 4: Structural Neuroplasticity (Steps 19–21)**

### LEFT column — Steps 19–20: Allostatic Load Downregulation

- **Step 19:** Chronic stress-system recalibration and HPA-axis stability.
- **Step 20:** Cortisol Awakening Response (CAR) optimization and circadian alignment.

**NEUROPHYSIOLOGICAL BASIS**
Rewriting amygdala reactivity patterns via Long-Term Potentiation
(LTP). Epigenetic regulation of stress-system markers and long-term
adaptation of the HPA axis (McEwen allostatic-load framework).

**TECHNOLOGICAL STACK**
Targeting the Amygdala and HPA Axis.
*Biomarkers:* Cortisol Awakening Response (CAR) stabilization,
inflammatory markers (IL-6, TNF-α), HRV-derived autonomic flexibility.

**BIOLOGICAL PROTOCOL**
*Protocol: Stress-System Recalibration.* Transitioning from transient
state modulation to sustained allostatic-load downregulation and
systemic repair of stress-related pathways.

### RIGHT column — Step 21: Structural-Functional Synergism

- **Step 21:** Targeted BDNF induction and synaptic-rewiring
  protocols for long-term neuroplasticity.

**NEUROPHYSIOLOGICAL BASIS**
Long-term changes in gray-matter density within the Prefrontal Cortex
and Hippocampus. Synthesizing multi-modal physiological inputs into
durable structural change.

**TECHNOLOGICAL STACK**
Targeting structural-functional neuroplasticity.
*Biomarkers:* Cortical thickness (structural MRI), plasma
Brain-Derived Neurotrophic Factor (BDNF), hippocampal volume.

**BIOLOGICAL PROTOCOL**
*Protocol: Permanent Neural Remodeling.* Achieving durable structural
plasticity through sustained engagement with Block 1–3 protocols
combined with targeted BDNF-inducing practices.

### Bottom — Research Focus
> **Research Focus:** Investigating epigenetic regulation through
> biomarker analysis (plasma BDNF, cortisol slope, CAR) and structural
> changes via longitudinal neuroimaging (T1-weighted structural MRI,
> diffusion-tensor imaging).

---

## PATCH 5 — Block 5 detail slide

### Slide title
> **Block 5: Peak States & Transient Hypofrontality (Steps 22–24)**

### LEFT column — Steps 22–23: Global Phase Coherence

- **Step 22:** Large-scale gamma-band coherence and brain entropy optimization.
- **Step 23:** Cross-frequency coupling and large-scale network integration.

> ⚠️ Wording fix vs v2.0/v2.1: replaced "Global neural hypersynchrony"
> with **"Large-scale gamma-band coherence"** — "hypersynchrony" in
> mainstream neuroscience refers to epileptic discharges; the
> peak-state phenomenon is more accurately described as large-scale
> coherence and cross-frequency coupling.

**NEUROPHYSIOLOGICAL BASIS**
Maximum neural integration where disparate brain regions synchronize
at high frequencies with minimal metabolic cost. Thalamo-cortical
resonance and macro-coherence in gamma and high-beta bands.

**TECHNOLOGICAL STACK**
Targeting thalamo-cortical resonance.
*Biomarkers:* EEG coherence in high-beta / gamma bands, reduced
glucose metabolism (FDG-PET), Lempel-Ziv complexity (brain-entropy
index, Carhart-Harris 2014).

**BIOLOGICAL PROTOCOL**
*Protocol: Global Phase Coherence.* Achieving large-scale
synchronization of neural oscillations for high-density processing
and optimal flow-state entry (Dietrich 2004 framework).

### RIGHT column — Step 24: Transient Hypofrontality

- **Step 24:** Optimized cognitive states via transient hypofrontality
  and DMN decoupling.

**NEUROPHYSIOLOGICAL BASIS**
Deep inhibition of egocentric networks (DMN suppression) and
high-intensity Gamma bursts. Activation of brainstem-thalamic
structures driving non-narrative present-state awareness.

> ⚠️ Wording fix vs v2.0: removed the phrase "primary biological
> being before conceptual processing" — replaced with the
> peer-reviewable **"non-narrative present-state awareness"**.

**TECHNOLOGICAL STACK**
Targeting the Reticular formation and whole-brain coherence networks.
*Biomarkers:* Gamma-burst amplitude, DMN decoupling magnitude (fMRI),
brain-entropy index.

**BIOLOGICAL PROTOCOL**
*Protocol: DMN Suppression.* Achieving transient hypofrontality where
self-referential processing is inhibited, allowing direct
present-state awareness (Dietrich 2004).

### Bottom — Research Focus
> **Research Focus:** Measuring peak states through brain entropy
> (Lempel-Ziv complexity), global phase coherence (high-density EEG)
> and DMN decoupling (resting-state fMRI). Replication of established
> flow-state and meditation paradigm signatures.

---

## SUMMARY — Designer worklist

| # | Slide | Changes | Effort |
|---|-------|---------|--------|
| **1** | Block 1 detail | Add Basis/Stack/Protocol per sub-block + fix "Biological Zero" | 5 min |
| **2** | Block 2 detail | Add Basis/Stack/Protocol + fix "Collective intelligence" → "Interpersonal neural synchronization" | 5 min |
| **3** | Block 3 detail | Add Basis/Stack/Protocol per sub-block | 5 min |
| **4** | Block 4 detail | Add Basis/Stack/Protocol per sub-block | 5 min |
| **5** | Block 5 detail | Add Basis/Stack/Protocol + fix "Hypersynchrony" → "Large-scale gamma coherence" + fix "primary biological being" | 5 min |

**Total estimated work:** ~25 minutes. Five slides edited, no new
slides added, no other parts of the deck touched.

---

## VERIFICATION CHECKLIST POST-PATCH

▸ **Rule 1 — Every Block detail slide has the 3-tier structure.**
  NEUROPHYSIOLOGICAL BASIS, TECHNOLOGICAL STACK, BIOLOGICAL PROTOCOL —
  in that exact order, for every sub-block.

▸ **Rule 2 — Every BIOLOGICAL PROTOCOL has a named protocol.**
  "Protocol: Autonomic Stabilization", "Protocol: Signal-to-Noise
  Optimization", "Protocol: Interoceptive Accuracy", "Protocol:
  Network Crosstalk Mitigation", "Protocol: Stress-System
  Recalibration", "Protocol: Permanent Neural Remodeling", "Protocol:
  Global Phase Coherence", "Protocol: DMN Suppression",
  "Protocol: Dyadic Neural Synchronization", "Protocol: Defensive
  Circuit Regulation" — 10 named protocols across the 5 Block slides.

▸ **Rule 3 — Every TECHNOLOGICAL STACK lists explicit biomarkers.**
  rMSSD, SDNN, VOR gain, BDNF, IL-6, TNF-α, PLV, Lempel-Ziv
  complexity, cortical thickness, CAR — every metric named is
  measurable and peer-reviewed.

▸ **Rule 4 — Three wording fixes are applied.**
  - "Biological Zero" / "Point Zero" → **"physiological baseline"**
  - "Collective intelligence" → **"Interpersonal neural synchronization"**
  - "Global neural hypersynchrony" → **"Large-scale gamma-band coherence"**
  - "Primary biological being" → **"Non-narrative present-state awareness"**

▸ **Rule 5 — Research Focus line preserved at bottom of each slide.**
  Slightly upgraded to reference the new biomarkers introduced in the
  Tech Stack section above it.

When all five rules pass — deck is publication-grade for grant review
and a viable starting point for peer-reviewed protocol publication.

---

## CONTEXT — Why this matters for Eurostar

Eureka / Eurostar reviewers come from clinical and academic
backgrounds. v2.1's flat "Step X: title" lists read as marketing copy.
v2.0's 3-tier structure (anatomy → measurement → protocol) reads as a
mature clinical framework — the format reviewers are trained to
evaluate.

The 3-tier structure also makes it trivially easy for a partner
laboratory to extract a single Block as the basis for a co-authored
study: anatomy gives the target, biomarkers give the outcome measures,
and the named protocol gives the intervention arm.

v2.1 → v2.2 is the difference between "interesting product positioning"
and "ready-to-fund clinical research programme."

---

*Patch sheet generated 2026-05-20. Based on direct comparison of
`old/_ONDA_Life_Product_Ecosystem_&_Neuro-Physiological_Framework_v2.0.pdf`
(v2.0 Part 2 — donor of the 3-tier structure) and
`_ONDA_Life_Product_Ecosystem_&_Neuro-Physiological_Framework_v2.1.pdf`
(v2.1 — donor of the terminology and step enumeration). All clinical
terminology cross-checked against peer-reviewed neuroscience literature.*
