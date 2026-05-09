/**
 * Topic hubs — pillar pages that consolidate article + glossary content
 * by semantic cluster, each optimised for one primary search keyword.
 *
 * A hub appears in sitemap.xml + hreflang clusters + JSON-LD CollectionPage
 * ONLY when its `pillar` markdown is set. Hubs without pillar text render
 * with <meta name="robots" content="noindex"> so half-finished placeholders
 * never enter Google's index.
 *
 * Adding a slug to articleSlugs/glossarySlugs is purely declarative — the
 * TopicPage component renders the linked items in declared order, and the
 * SEO machinery (sitemap, JSON-LD ItemList) follows the same array.
 */
export interface Topic {
  /** URL slug, lower-kebab. Becomes /topics/<slug>. */
  slug: string
  /** Display name shown in <h1> and breadcrumbs. */
  name: string
  /** One-line tagline shown under <h1> on the hub page. */
  tagline: string
  /** Primary search keyword the hub ranks for. */
  primaryKeyword: string
  /** Secondary keywords woven into pillar text. */
  secondaryKeywords: readonly string[]
  /** 140-160 char meta description for SERPs and social cards. */
  shortDescription: string
  /**
   * Long-form pillar markdown. Undefined = hub is in placeholder state and
   * its page renders noindex. As soon as pillar is set + reviewed the hub
   * goes live (sitemap + JSON-LD + hreflang).
   */
  pillar?: string
  /** Member article slugs in declared order. */
  articleSlugs: readonly string[]
  /** Member glossary term slugs in declared order. */
  glossarySlugs: readonly string[]
  /** Optional canonical entry-point article for the cluster. */
  startHere?: string
  /** Tailwind accent class fragment ('green' | 'cyan' | 'amber' | …). */
  accent?: 'green' | 'cyan' | 'amber' | 'emerald' | 'purple'
}

const HRV_PILLAR = `**ID:** hrv_pillar_01
**STATUS:** OPERATIONAL
**TAGS:** HRV · Vagal Tone · Biometrics · System_Resilience · ONDA_Hardware

## 1. The Logic: rhythm as a flexibility indicator

Heart Rate Variability (HRV) is your nervous system's signal-to-noise ratio.

Every heartbeat arrives microseconds early or late, governed by a continuous dialogue between sympathetic activation (PUSH / gas) and parasympathetic recovery (PULL / brake). The amount of variability is the direct readout of how flexibly the autonomic system switches between modes — and how much energy buffer it has left.

**Healthy Biocomputer:** wide HRV. The pulse is irregular by design. Inhale accelerates the system, exhale slows it — the vagus nerve writing its digital signature on each cardiac cycle.

**Degraded System:** narrow HRV. Fixed pacing, zero slack, zero recovery margin.

> **ONDA_ALERT:** a monitor reading LOW_HRV three days in a row is the earliest detectable signal of overload — sleep debt, overtraining, infection. It surfaces days before symptoms become physical.

## 2. The ONDA Protocol: control hierarchy

The stack progresses from real-time intervention to long-term reserve building.

**[ START_HERE ]**
**Vagus Nerve: Master Key.** Central node in the architecture. The vagus carries roughly 80% of parasympathetic traffic and gates every HRV-relevant signal. Read this first; everything else builds on its anatomy.

**[ DEEP_DIVES ]**
- **Resonant Frequency Breathing** — the single most efficient way to drive HRV up in real time. 5.5s inhale / 5.5s exhale. Daily calibration that aligns cardiac rhythm with the baroreflex loop.
- **0.1 Hz Baroreflex Hack** — the neurochemical mechanism behind coherent breathing. An ancient pressure-sensor loop entrained to amplify parasympathetic gain.
- **Nervous System Ping Latency** — measuring switching *speed*, not just variability. HRV shows resting flexibility; latency shows mode-shift time under load.
- **Fault-Tolerant Human** — building HRV reserve so the system absorbs shocks without breaking baseline.
- **HRV Training & Biofeedback** — the closed-loop protocol. 10-minute coherence sessions training both vagal tone and conscious parasympathetic access.
- **Biological Latency Optimization** — the operating model that ties latency, HRV and recovery into one frame.

## 3. Hardware Validation: telemetry capture

**Devices:** Polar H10 (reference), Whoop, Oura, Garmin Fenix — any sensor with native rMSSD reporting.

**Protocol:** track a 30-day rolling baseline. Never draw conclusions from a single morning reading.

**Context:** alcohol, sleep, training load matter more than the raw number. One bad day is noise. Three in a row is a STOP signal.

> **ONDA_STATEMENT:** «Your HRV is the reserve of your freedom. The wider the gap between heartbeats, the more room you have to maneuver before the system fails.»
`

const CIRCADIAN_PILLAR = `**ID:** circadian_pillar_02
**STATUS:** OPERATIONAL
**TAGS:** Circadian · Sleep · Light · Glymphatic · ONDA_Hardware

## 1. The Logic: a 24-hour clock anchored by photons

The biocomputer runs a master 24-hour clock — the suprachiasmatic nucleus — driven primarily by photic signal. Light at 6500 K hitting retinal ganglion cells before 9 a.m. resets the clock. Light below 50 lux at 2700 K from sunset onward locks in the night phase.

When the photic signal degrades — indoor lighting at noon, blue light at 11 p.m., shifted dawn — the clock drifts. Drift is the silent driver of insomnia, brain fog, low energy, and metabolic dysregulation. It sits upstream of nearly every other system.

**Healthy Biocomputer:** clock locked to local solar time. Cortisol peaks at 7 a.m., melatonin at 11 p.m. Sleep latency under 15 minutes; deep sleep within 90 minutes of onset.

**Degraded System:** flat cortisol curve. Random sleep timing. Glymphatic clearance impaired.

> **ONDA_ALERT:** low REM and N3 deep sleep on the wearable for a week is the brain's bin-overflow notification — neural cache is not being flushed. Cognitive degradation follows in 10–14 days.

## 2. The ONDA Protocol: photic resync

The stack works in two parallel layers — input (light/dark scheduling) and output (sleep architecture and clearance).

**[ START_HERE ]**
**Circadian Reset: Mastering Light.** The canonical light protocol. 10K lux morning exposure, sunset photic bracket, 0.1 lux dark window.

**[ DEEP_DIVES ]**
- **Circadian Lighting & Dark Therapy** — practical home setup. Bulb specs, time blocks, blackout discipline.
- **Ancestral Sync: Circadian Anchors** — three zeitgebers (light, food, temperature) and how to lock all three.
- **Protocol: Circadian Hard Reset** — 72-hour reflash for severe drift (jetlag, shiftwork, sleep collapse).
- **Nightly Flush: Glymphatic Neural Cache** — what happens during N3. Why side-sleeping matters. Why alcohol kills clearance.
- **Glymphatic Flush: Clearing Neural Cache** — the engineering model. CSF as bus, aquaporin-4 as sluice gate.
- **Phase-Locked Acoustic Sleep** — pink noise and delta-wave entrainment for N3 amplification.
- **Neural Hydraulics: CSF Flow** — vascular tensegrity and cervical fascia as drainage gate.

## 3. Hardware Validation: telemetry capture

**Devices:** Oura or Whoop for sleep stages. Lumie or HappyLight for morning bright light. Welsh Light Meter app for indoor lux audit.

**Protocol:** track sleep onset latency, time in N3, and morning wakefulness (subjective 1–10 at minute 30). Capture lux exposure across 7 days.

**Context:** alcohol within 4 hours of sleep, late caffeine, and a warm bedroom (>22 °C) are bigger latency killers than any single bulb.

> **ONDA_STATEMENT:** «The brain washes itself only when the lights tell it to. Skip the photonic protocol and the cache fills with junk you cannot debug from inside.»
`

const DOPAMINE_PILLAR = `**ID:** dopamine_pillar_03
**STATUS:** OPERATIONAL
**TAGS:** Dopamine · Motivation · Reward_Circuit · VTA · ONDA_Software

## 1. The Logic: prediction error as drive

Dopamine is not the pleasure molecule. It is the prediction-error signal — the gap between what the brain expected and what arrived. Drive, motivation, focus, addiction: same chemical machinery responding to surprise.

The reactor is the ventral tegmental area (VTA), projecting through the mesolimbic pathway into the nucleus accumbens (motivation hub) and prefrontal cortex (working memory, focus). Postsynaptic receptor density is finite. Hit it too often with high-frequency low-grade stimuli — notifications, refined sugar, scrolling — and receptors downregulate. Baseline drops. You need exponentially more input for the same drive.

**Healthy Biocomputer:** clean baseline. Boredom is tolerable. Long deep-work cycles produce earned rewards. Subtle pleasures register.

**Degraded System:** flat baseline, jittery peaks. Apathy in absence of stimulus. Compulsive seeking. Anhedonia.

> **ONDA_ALERT:** if morning motivation requires caffeine + sugar + scroll within 30 minutes of waking, the receptor curve is downregulated. Acute intervention required before the cascade goes deeper.

## 2. The ONDA Protocol: reactor calibration

The stack restores baseline first, then optimizes the signal.

**[ START_HERE ]**
**Dopamine Architecture: Mastering Desire.** Maps the prediction-error model, the four dopaminergic pathways, and the difference between drive and pleasure.

**[ DEEP_DIVES ]**
- **Dopamine Stacking & Circuit Overload** — preventing receptor downregulation. The neurochemistry of "the stack" and why it backfires. Glutamate excitotoxicity in chronic over-stimulation.
- **Ventral Tegmental Core: Motivational Salience** — the reactor itself. How VTA encodes value, what salience-vs-valence means, why trauma narrows the input filter.
- **Digital Dementia: Attentional Control** — the modern threat model. How sub-threshold notifications and infinite scroll wreck the focus circuit.

## 3. Hardware Validation: telemetry capture

**Devices:** subjective scale (1–10) tracked daily for morning drive, focus duration before first distraction, response to common triggers (food, social media, exercise).

**Protocol:** 14-day baseline before intervention. Tag any extreme day (alcohol, illness, conflict) so it does not pollute the signal.

**Context:** sleep debt collapses dopamine baseline harder than any single behavioral protocol. Fix sleep first, then focus on dopamine.

> **ONDA_STATEMENT:** «Dopamine is the engine of pursuit, not the prize. Optimize the gap, not the peak.»
`

const METABOLIC_PILLAR = `**ID:** metabolic_pillar_04
**STATUS:** OPERATIONAL
**TAGS:** Metabolic_Flexibility · Mitochondria · Dual_Fuel · GLP1 · ONDA_Hardware

## 1. The Logic: dual-fuel architecture

The biocomputer runs on two fuel types — glucose (fast, abundant, dirty) and ketones / fatty acids (slow, dense, clean). A flexible system switches between them on demand. A locked-in system runs only on glucose, crashes when glucose runs low, and accumulates damage from constant insulin spikes.

The reactor core is the mitochondrion. Mitochondrial mass, membrane integrity, and DNA quality together set the maximum power output of every cell. Modern lifestyle starves mitochondria of stimulus (no fasting, no cold, no zone-2) — they shrink in number and quality. Output drops. Fatigue follows.

**Healthy Biocomputer:** dual-fuel access. Stable energy across 6-hour fasting windows. Ketones detectable on a strip on the morning of day-2 fast.

**Degraded System:** glucose-locked. Hypoglycemic symptoms after missing one meal. No measurable ketosis even after a 48-hour fast.

> **ONDA_ALERT:** if missing breakfast triggers irritability, brain fog, or shaking by hour 14, mitochondrial flexibility is compromised. The system has lost dual-fuel access.

## 2. The ONDA Protocol: power-grid calibration

The stack rebuilds mitochondrial mass, restores fuel switching, and optimizes the substrate.

**[ START_HERE ]**
**Metabolic Flexibility: Dual-Fuel System.** Defines flexibility, maps the metabolic switch, walks the diagnostic protocol.

**[ DEEP_DIVES ]**
- **Metabolic Redundancy: Hybrid Power Architecture** — the engineering case for redundancy. Why two fuels beat one even when glucose is abundant.
- **Mitochondrial Biogenesis: Cellular Power Grid** — how to grow more mitochondria. Zone-2, cold, hypoxia, polyphenol stack.
- **Mitochondrial DNA: Red Light Photobiomodulation** — 660/850 nm targeting cytochrome-c oxidase. Dosing and stack timing.
- **GLP-1 Biology: Muscle Preservation** — what semaglutide actually does. Why muscle preservation requires resistance training even on the drug.
- **Muscle: Metabolic Marker** — skeletal muscle as the largest glucose sink. Lean mass as the single best longevity predictor.

## 3. Hardware Validation: telemetry capture

**Devices:** ketone meter (Keto-Mojo blood preferred), CGM for 14-day audit, lactate meter for zone-2 verification, body composition (DEXA if available, BIA otherwise).

**Protocol:** measure fasting glucose, fasting insulin (HOMA-IR), and fasting ketones same morning. Track 30-day baseline before intervention.

**Context:** stress, poor sleep, and infection all spike fasting glucose independent of diet. Don't intervene on isolated readings.

> **ONDA_STATEMENT:** «A locked metabolism is a single point of failure. Build dual access; the body composes its own protocol.»
`

const BREATHWORK_PILLAR = `**ID:** breathwork_pillar_05
**STATUS:** OPERATIONAL
**TAGS:** Breathwork · CO2_Tolerance · Bohr_Effect · Vagal_Activation · ONDA_Software

## 1. The Logic: the autonomic CLI

Breath is the only autonomic process under voluntary control. Heart rate is regulated by the brainstem, insulin by the pancreas, cortisol by the HPA axis. Breath alone has a direct command-line interface to the autonomic state.

That makes breath the master entry point for autonomic-state programming. A long exhale activates the vagus and shifts the system parasympathetic. A breath hold raises CO2, expands the Bohr effect, releases more O2 to tissue. A box pattern stabilizes the entire autonomic arc.

**Healthy Biocomputer:** nasal breathing at rest, 6 breaths/minute resting rate, 30+ second exhale-hold (BOLT score). High CO2 tolerance.

**Degraded System:** mouth breathing at rest, 14+ breaths/minute, BOLT under 20s. Hyperventilation under mild stress; chronic mild alkalosis.

> **ONDA_ALERT:** BOLT score under 20 seconds means the system is chronically over-breathing. Energy yield per breath drops; HRV narrows; sleep apnea risk rises.

## 2. The ONDA Protocol: breath programming

The stack starts with awareness, moves to volume control, ends with CO2 tolerance.

**[ START_HERE ]**
**Breathwork: Command-Line Interface.** Maps the four CLI commands — slow, deep, hold, retain — and what each writes to the autonomic state.

**[ DEEP_DIVES ]**
- **CO2 Tolerance: Expanding the Oxygen Limit** — counterintuitive truth: O2 delivery depends on CO2, not on how much air you move. Protocol for raising the CO2 setpoint.
- **Bohr Effect: Oxygen Telemetry** — the biochemical mechanism. Why hemoglobin releases O2 only when CO2 is present. The acid-base math behind every breath protocol.

## 3. Hardware Validation: telemetry capture

**Devices:** pulse oximeter for SpO2, simple stopwatch for BOLT, optional CO2 monitor for inspired air (Aranet4).

**Protocol:** measure BOLT first thing in the morning. Track resting respiratory rate weekly. Re-baseline after 30-day intervention.

**Context:** caffeine, anxiety, and altitude all spike respiratory rate. Don't compare across context shifts.

> **ONDA_STATEMENT:** «The breath is the only system you can debug from outside the kernel. Use it.»
`

const NEUROPLASTICITY_PILLAR = `**ID:** neuroplasticity_pillar_06
**STATUS:** OPERATIONAL
**TAGS:** Neuroplasticity · Flow_State · Alpha_Rhythm · BDNF · ONDA_Software

## 1. The Logic: the cortex rewriting itself

The brain is not fixed hardware. Synapses strengthen with use, weaken with disuse, and the cortex re-allocates territory under load. Plasticity is the substrate of every skill, every recovery, every behavior change.

Plasticity has a precondition: the right neurochemical state. Beta dominance (high arousal, narrow focus) blocks rewriting. Alpha–theta dominance (low arousal, wide attention, present-tense) unlocks it. Flow is the engineered version — a controlled merge of alpha + theta with norepinephrine and dopamine modulation that triples learning rate.

**Healthy Biocomputer:** can shift between beta (work mode) and alpha (rest / integration) at will. Daily flow access available with appropriate task. New skill acquisition fast.

**Degraded System:** stuck in beta. Cannot wind down. Sleep onset insomnia. Skills refuse to consolidate; memory weak.

> **ONDA_ALERT:** if you cannot remember anything you read yesterday, the consolidation pathway is broken. Flow access is both the diagnostic and the protocol.

## 2. The ONDA Protocol: plasticity unlock

The stack starts with state engineering, moves to flow access, ends with plasticity reserve.

**[ START_HERE ]**
**Neuroplasticity & Flow Overclocking.** Maps BDNF cascades, the four pillars of plasticity, and the flow-state diagnostic.

**[ DEEP_DIVES ]**
- **Physiological Concentration: Flow State Hardwired** — concentration as a physiological state, not a willpower act. Vagal pre-conditioning + breath bracketing.
- **Neural Bridge: Alpha-Flow Gateway** — the alpha–theta crossover. Why insight emerges only at the edge.
- **Neural Entrainment: Meditation Practice** — driving brainwave dominance via audio, movement and breath. The training protocol.
- **Idle State: Alpha Rhythms** — the default-mode network. Why doing nothing is the most productive thing you can do.
- **Quiet Mode: Alpha-Cortisol Buffer** — using alpha to absorb stress instead of accumulating it. The everyday protocol.
- **Anti-Entropy: Neural Architecture** — preventing neural drift in midlife. The maintenance protocol.

## 3. Hardware Validation: telemetry capture

**Devices:** Muse or Mendi for at-home EEG, HRV monitor for vagal pre-condition check, simple time-tracker for flow duration.

**Protocol:** track number of flow sessions per week and total flow minutes. Baseline 30 days. Tag context — sleep score, exercise, diet.

**Context:** caffeine over 200 mg blocks alpha access. So does scrolling within 30 minutes of work. The single biggest plasticity destroyer is sleep debt.

> **ONDA_STATEMENT:** «The cortex rewrites only when the system gives it permission. Flow is the permission.»
`

const COGNITIVE_PILLAR = `**ID:** cognitive_pillar_07
**STATUS:** OPERATIONAL
**TAGS:** Cognitive_Control · ACC · Acetylcholine · Attention · ONDA_Software

## 1. The Logic: the Acetylcholine Lens

Attention is not effort. It is a pattern of acetylcholine release that sharpens cortical signal-to-noise — the Acetylcholine Lens. Wide and unfocused, the lens scans for novelty. Narrow and locked, the lens carves a single signal out of noise.

The arbiter is the anterior cingulate cortex (ACC). It monitors goal-vs-stimulus conflict, raises the cognitive cost when attention drifts, and triggers focal lock or release. ACC integrity = control bandwidth. Damaged or under-trained ACC = monkey-mind. Trained ACC = sustained deep work.

**Healthy Biocomputer:** holds a single task for 90 minutes without involuntary attention drift. Recovers focal lock within 5 seconds of distraction. Working memory holds 4–7 items.

**Degraded System:** task-switches every 90 seconds. Cannot read a paragraph without re-reading. Working memory overflows on a grocery list.

> **ONDA_ALERT:** if you cannot read a long-form article without 3+ tab switches, the ACC is in degraded mode. Acetylcholine signaling weak; default-mode network bleeding into work mode.

## 2. The ONDA Protocol: lens calibration

The stack starts with ACC training, moves through neurochemical support, ends with throughput optimization.

**[ START_HERE ]**
**Acetylcholine Lens: Neuro-Mechanics.** Maps the cholinergic pathways, defines the focal-lock loop, walks through the daily lens drill.

**[ DEEP_DIVES ]**
- **ACC Calibration Protocol: Cognitive Control Training** — the monotasking drill. The 25-minute uninterrupted work block.
- **Anterior Cingulate Core: Coherence Monitoring** — the arbiter mechanism. How to read ACC fatigue and when to rest.
- **Cognitive Architecture: Neural Throughput** — the bandwidth model. Working-memory ladder, chunking discipline, attention reservoir.
- **Cognitive Architecture: Nootropic Stacks** — pharmacology that supports the lens, never substitutes for training. The minimal stack.
- **Neural Signal-to-Noise: Cleaning the System Channel** — environmental and digital noise budget. The pre-flight checklist.

## 3. Hardware Validation: telemetry capture

**Devices:** simple timer (Pomodoro), sustained-attention task (PVT app), optional EEG focus monitor (Mendi).

**Protocol:** track daily count of completed 25-minute focused blocks. Track interruption count per block. Re-baseline weekly.

**Context:** sleep debt and unprocessed emotional load are the two biggest ACC destroyers. Don't try to outwork either.

> **ONDA_STATEMENT:** «Focus is not willpower. It is the cholinergic pattern your nervous system can sustain. Train the pattern.»
`

const SPINAL_PILLAR = `**ID:** spinal_pillar_08
**STATUS:** OPERATIONAL
**TAGS:** CPG · Spinal_Cord · Motor_Autopilot · Rhythmic_Entrainment · ONDA_Hardware

## 1. The Logic: decentralised motor compute

The spinal cord is not a cable. It is an autonomous compute node. Central pattern generators (CPGs) — neural circuits in the lumbar and cervical cord — run rhythmic motor scripts (walking, breathing, swimming) without cortical command.

This is edge computing made of wet tissue. The cortex hands off the loop, CPGs execute, sensors return correction. The cortex is freed for higher-order tasks. When CPGs degrade — chronic immobility, neurological damage, disrupted proprioception — the cortex must micromanage every step. Cognitive bandwidth collapses; movement quality drops.

**Healthy Biocomputer:** smooth gait without conscious command. Cervical–respiratory coupling intact. Locomotor rhythm modulates HRV positively.

**Degraded System:** cognitive load on every step. Asymmetric gait. Breath-step decoupled.

> **ONDA_ALERT:** if walking requires conscious attention to balance or step rhythm, the CPG is being micromanaged. The cortex is doing the spinal cord's job.

## 2. The ONDA Protocol: edge-compute restoration

The stack starts with awareness, moves to entrainment, ends with rhythm-locked patterns.

**[ START_HERE ]**
**CPG: Neural Autopilot.** Maps the spinal motor architecture, defines CPG activity, walks through the daily activation sequence.

**[ DEEP_DIVES ]**
- **Spinal Harddrive: CPG Autonomous Scripts** — the script library. How walking, breathing, and posture run as separate threads.
- **Spinal Intelligence: Decentralized Control** — the engineering analogy. Edge compute vs. cloud; why decentralisation is faster and more resilient.
- **Rhythmic Entrainment: System Frequencies** — synchronizing breath, gait, and heart rhythm. The 0.1 Hz master clock.

## 3. Hardware Validation: telemetry capture

**Devices:** wearable with cadence (any running watch), HRV monitor for breath-coupling check, video capture for gait asymmetry analysis.

**Protocol:** measure cadence, asymmetry index, and breath-step lock-in (steps per breath at walking pace).

**Context:** fatigue, footwear, and surface all change gait pattern. Compare like-to-like across days.

> **ONDA_STATEMENT:** «The cortex is the strategist. The spinal cord is the executor. Keep them on separate threads.»
`

const HORMONES_PILLAR = `**ID:** hormones_pillar_09
**STATUS:** OPERATIONAL
**TAGS:** Endocrine · HPA_Axis · Cortisol · Sex_Hormones · ONDA_Software

## 1. The Logic: the slow protocol clock

The endocrine system runs the slow protocol clock. Where neural signaling moves at milliseconds, hormones run at minutes-to-hours. Each hormone is a peptide or steroid message broadcast through the bloodstream — addressed to every cell with the matching receptor.

The system is not flat. There is hierarchy: hypothalamus → pituitary → end gland → tissue. There are loops: cortisol feeds back on its own release, testosterone on LH, leptin on hypothalamic energy sensing. The loops are how the body adapts to load. Break the loops — chronic stress, sleep debt, exogenous hormones without monitoring — and the system goes into compensation. Compensation that holds for years. Until it doesn't.

**Healthy Biocomputer:** diurnal cortisol curve intact. Sex hormones cyclic and age-appropriate. Leptin sensitivity preserved. TSH in optimal range, not just "lab normal".

**Degraded System:** flat cortisol. Sex hormones suppressed. Leptin resistance. Subclinical hypothyroidism missed by standard panels.

> **ONDA_ALERT:** if morning energy requires stimulants and evening relaxation requires alcohol, the HPA axis is in late-stage compensation. The system is hiding the dysfunction; it will not stay hidden.

## 2. The ONDA Protocol: endocrine routing

The stack starts with monitoring, moves through the major axes, ends with cyclical architecture for those with cycles.

**[ START_HERE ]**
**Continuous Hormone Monitoring (CHM).** Maps the four major axes (HPA, HPG, HPT, leptin), defines testing cadence, walks through interpretation.

**[ DEEP_DIVES ]**
- **Endocrine Social Drive: Oxytocin & Testosterone** — the affiliation/aggression balance. Social hormones as a control system.
- **HPA Axis Control: Cortisol & Aggression** — the stress axis. Acute vs. chronic, dysfunction states, recovery protocol.
- **Adrenal Governor: Thermal Runaway** — the engineering metaphor. How to detect adrenal cascade before it shows on labs.
- **System Stability: Serotonin** — the gut–brain serotonin loop. Why 90% of serotonin is gut-side and what that means for mood.
- **Energy Sensor: Leptin** — the satiety signal. Leptin resistance as the metabolic-syndrome upstream marker.
- **Energy Governor: TSH** — the metabolic rate setter. Optimal vs. lab-normal; why subclinical hypothyroidism is missed.
- **Neural Optimizer: Estrogen** — estrogen as cognitive enhancer. The neuroprotective mechanism.
- **FemTech: Cyclical Architecture** — protocol design for cycling bodies. How to map performance windows to cycle phase.

## 3. Hardware Validation: telemetry capture

**Devices:** quarterly DUTCH or saliva panel for HPA mapping, monthly venous lab for sex hormones (women: track to cycle phase), CGM for glucose-cortisol coupling.

**Protocol:** four data points per year minimum. Always tag the panel with sleep score, stress events, training load.

**Context:** acute stress 24 hours before testing skews the entire panel. Don't draw conclusions from one bad timing.

> **ONDA_STATEMENT:** «Hormones are the slow protocol. Compensation is silent. Monitor or you will not see it coming.»
`

const LONGEVITY_PILLAR = `**ID:** longevity_pillar_10
**STATUS:** OPERATIONAL
**TAGS:** Longevity · Autophagy · Senolytics · Stem_Cells · ONDA_Hardware

## 1. The Logic: hardware maintenance, not magic

Longevity is not a supplement stack. It is hardware maintenance — clearing damaged cells, refreshing the cellular substrate, repairing the DNA copy machinery. The body has every mechanism it needs (autophagy, apoptosis, stem-cell mobilization, senolysis). They are simply under-stimulated in a modern lifestyle.

The damage is cumulative. Senescent cells (zombie cells that won't die but don't function) accumulate from middle age. They secrete inflammatory signals that age neighboring cells. DNA copy errors accumulate from oxidative load. Stem-cell pools deplete from chronic adrenal load. Each of these is reversible — slowly, with the right protocol, with the right substrate.

**Healthy Biocomputer:** biological age tracks calendar age within ±5 years. Recovery from injury fast. Sleep restorative. Skin elasticity preserved.

**Degraded System:** biological age >10 years above calendar. Slow recovery. Cumulative inflammation. Visible accelerated aging.

> **ONDA_ALERT:** if biological age (DNA methylation panel) is more than 5 years above calendar age, the cleanup pathways are under-stimulated. Intervention is possible but the longer the gap, the longer the protocol.

## 2. The ONDA Protocol: cellular refresh

The stack starts with autophagy, moves through senolysis, ends with regenerative substrate.

**[ START_HERE ]**
**Longevity Hardware: Cellular Cleanup.** Maps the four cleanup pathways (autophagy, mitophagy, apoptosis, senolysis), defines the daily / weekly stimulus, walks through the biological age diagnostic.

**[ DEEP_DIVES ]**
- **Longevity Protocol: Biological Clock Reset** — the deep-cleanup protocol. Fasting, NAD+ stack, polyphenol pulse.
- **Senolytic High-Dosing** — the targeted clearance protocol. Quercetin, fisetin, dasatinib (medical supervision required for dasatinib).
- **Cacao & Stem Cells** — the regenerative substrate. Non-stimulant cacao as a stem-cell mobilization signal. Capillary repair sequence.

## 3. Hardware Validation: telemetry capture

**Devices:** TruDiagnostic or MyDNAge for biological age (annual), inflammatory marker panel (CRP, IL-6) quarterly, body composition for muscle preservation.

**Protocol:** baseline biological age before intervention. Re-test 12 months after protocol start.

**Context:** acute illness, vaccination, or recent surgery distort biological age readings for 6+ weeks. Time the testing.

> **ONDA_STATEMENT:** «The body knows how to repair itself. Your job is to give it the right stimulus, the right substrate, and enough time.»
`

export const TOPICS: readonly Topic[] = [
  {
    slug: 'hrv',
    name: 'HRV — Heart Rate Variability',
    tagline: 'The master telemetry channel for autonomic state.',
    primaryKeyword: 'HRV training biohacking',
    secondaryKeywords: [
      'heart rate variability protocol',
      'vagal tone training',
      'resonant frequency breathing',
      'autonomic balance',
      'baroreflex training',
    ],
    shortDescription:
      'HRV is your nervous system signal-to-noise ratio. Six protocols + foundational glossary for measuring vagal tone, baroreflex training, and resilience reserve.',
    pillar: HRV_PILLAR,
    articleSlugs: [
      'vagus-nerve-master-key',
      'resonant-frequency-system-coherence',
      'baroreflex-01hz-shift',
      'nervous-system-ping-latency',
      'fault-tolerant-human-hrv-buffer',
      'hrv-training-nervous-system-latency',
      'biological-latency-optimizing-system-ping',
    ],
    glossarySlugs: [
      'heart-rate-variability',
      'vagus-nerve',
      'vagal-tone',
      'polyvagal-theory',
      'autonomic-nervous-system',
      'parasympathetic-nervous-system',
      'sympathetic-nervous-system',
      'coherence',
    ],
    startHere: 'vagus-nerve-master-key',
    accent: 'cyan',
  },
  {
    slug: 'circadian',
    name: 'Circadian — Sleep, Light, and the Master Clock',
    tagline: 'Reset the biological clock with light and rhythm.',
    primaryKeyword: 'circadian rhythm reset protocol',
    secondaryKeywords: [
      'morning light exposure protocol',
      'sleep optimization biohacking',
      'glymphatic flush',
      'melatonin biology',
      'chronotype calibration',
    ],
    shortDescription:
      'The biocomputer runs on a 24-hour clock anchored by light. Eight protocols for circadian reset, sleep architecture, and glymphatic clearance.',
    pillar: CIRCADIAN_PILLAR,
    articleSlugs: [
      'circadian-reset-mastering-light',
      'circadian-lighting-dark-therapy',
      'ancestral-sync-circadian-anchors',
      'protocol-circadian-hard-reset',
      'nightly-flush-glymphatic-neural-cache',
      'glymphatic-flush-clearing-neural-cache',
      'phase-locked-acoustic-sleep',
      'neural-hydraulics-csf-flow',
    ],
    glossarySlugs: ['circadian-rhythm', 'melatonin', 'glymphatic-system'],
    accent: 'amber',
  },
  {
    slug: 'dopamine',
    name: 'Dopamine — Drive and Reward Architecture',
    tagline: 'Calibrate the motivation reactor.',
    primaryKeyword: 'dopamine optimization protocol',
    secondaryKeywords: [
      'dopamine baseline reset',
      'dopamine fasting',
      'motivation biohacking',
      'reward circuit recovery',
    ],
    shortDescription:
      'Dopamine is the prediction-error signal that powers drive. Four protocols for restoring a clean baseline, preventing receptor downregulation, and reading the VTA.',
    pillar: DOPAMINE_PILLAR,
    articleSlugs: [
      'dopamine-architecture-mastering-desire',
      'dopamine-stacking-preventing-circuit-overload',
      'ventral-tegmental-core-motivational-salience',
      'digital-dementia-attentional-control',
    ],
    glossarySlugs: ['dopamine'],
    accent: 'purple',
  },
  {
    slug: 'metabolic',
    name: 'Metabolic — Dual-Fuel Architecture',
    tagline: 'Switch between glucose and ketones at will.',
    primaryKeyword: 'metabolic flexibility biohacking',
    secondaryKeywords: [
      'mitochondrial biogenesis',
      'glucose ketone switching',
      'fasting protocols',
      'metabolic adaptation',
    ],
    shortDescription:
      'Metabolic flexibility is dual-fuel access without lock-in. Six protocols for mitochondrial biogenesis, fuel switching, and adaptation hacking.',
    pillar: METABOLIC_PILLAR,
    articleSlugs: [
      'metabolic-flexibility-dual-fuel-system',
      'metabolic-redundancy-hybrid-power-architecture',
      'mitochondrial-biogenesis-cellular-power-grid',
      'mitochondrial-dna-red-light',
      'glp1-biology-muscle-preservation',
      'muscle-metabolic-marker',
    ],
    glossarySlugs: [],
    accent: 'green',
  },
  {
    slug: 'breathwork',
    name: 'Breathwork — The Command-Line Interface to Autonomic State',
    tagline: 'Direct CLI access to nervous-system mode.',
    primaryKeyword: 'breathwork protocols biohacking',
    secondaryKeywords: [
      'CO2 tolerance training',
      'Bohr effect oxygen',
      'box breathing',
      'breath retention',
    ],
    shortDescription:
      'Breath is the only autonomic signal under voluntary control. Three protocols for CO2 tolerance, the Bohr effect, and CLI-style breath programming.',
    pillar: BREATHWORK_PILLAR,
    articleSlugs: [
      'breathwork-command-line-interface',
      'co2-tolerance-expanding-oxygen-limit',
      'bohr-effect-oxygen-telemetry',
    ],
    glossarySlugs: [],
    accent: 'cyan',
  },
  {
    slug: 'neuroplasticity',
    name: 'Neuroplasticity — Flow State and Brain Rewriting',
    tagline: 'Overclock the cortex; access flow on demand.',
    primaryKeyword: 'neuroplasticity flow state protocol',
    secondaryKeywords: [
      'flow state biohacking',
      'alpha brainwave training',
      'neural entrainment',
      'BDNF optimization',
    ],
    shortDescription:
      'The cortex rewrites itself when the right alpha-theta state is engaged. Seven protocols for flow access, neural entrainment, and plasticity reserve.',
    pillar: NEUROPLASTICITY_PILLAR,
    articleSlugs: [
      'neuroplasticity-flow-overclocking',
      'physiological-concentration-flow-state-hardwired',
      'neural-bridge-alpha-flow-gateway',
      'neural-entrainment-meditation-2',
      'idle-state-alpha-rhythms',
      'quiet-mode-alpha-cortisol-buffer',
      'anti-entropy-neural-architecture',
    ],
    glossarySlugs: [],
    accent: 'emerald',
  },
  {
    slug: 'cognitive',
    name: 'Cognitive Control — The Acetylcholine Lens',
    tagline: 'Sharpen attention; clear the signal-to-noise ratio.',
    primaryKeyword: 'cognitive control training',
    secondaryKeywords: [
      'attention training',
      'ACC calibration',
      'acetylcholine biohacking',
      'nootropic stack',
    ],
    shortDescription:
      'Cognitive control is the ACC arbitrating between focus and conflict. Six protocols for attention sharpening, nootropic stacking, and signal-to-noise calibration.',
    pillar: COGNITIVE_PILLAR,
    articleSlugs: [
      'acc-calibration-protocol-cognitive-control',
      'anterior-cingulate-core-coherence-monitoring',
      'cognitive-architecture-neural-throughput',
      'cognitive-architecture-nootropic-stacks',
      'acetylcholine-lens-neuro-mechanics',
      'neural-signal-to-noise-cleaning-system-channel',
    ],
    glossarySlugs: [],
    accent: 'cyan',
  },
  {
    slug: 'spinal',
    name: 'Spinal Hardware — The Decentralised Motor Core',
    tagline: 'Edge-compute the body; offload the cortex.',
    primaryKeyword: 'central pattern generator training',
    secondaryKeywords: [
      'spinal CPG protocol',
      'rhythmic entrainment',
      'motor autonomy',
      'autonomic gait',
    ],
    shortDescription:
      'The spinal cord runs autonomous motor scripts via central pattern generators. Four protocols for engaging spinal CPGs and rhythmic entrainment.',
    pillar: SPINAL_PILLAR,
    articleSlugs: [
      'cpg-neural-autopilot',
      'spinal-harddrive-cpg-autonomous-scripts',
      'spinal-intelligence-decentralized-control',
      'rhythmic-entrainment-system-frequencies',
    ],
    glossarySlugs: [],
    accent: 'green',
  },
  {
    slug: 'hormones',
    name: 'Hormones — Endocrine Signal Routing',
    tagline: 'Tune the slow-clock peptide messages.',
    primaryKeyword: 'hormone optimization biohacking',
    secondaryKeywords: [
      'cortisol management',
      'testosterone protocol',
      'oxytocin biology',
      'female hormone cycle biohacking',
    ],
    shortDescription:
      'The endocrine system runs the slow protocol clock. Nine protocols across HPA axis, sex hormones, leptin, TSH, and cyclical architecture.',
    pillar: HORMONES_PILLAR,
    articleSlugs: [
      'chm-continuous-hormone-monitoring',
      'endocrine-social-drive-oxytocin-testosterone',
      'hpa-axis-control-cortisol-aggression',
      'adrenal-governor-thermal-runaway',
      'system-stability-serotonin',
      'energy-sensor-leptin',
      'energy-governor-tsh',
      'neural-optimizer-estrogen',
      'femtech-cyclical-architecture',
    ],
    glossarySlugs: [],
    accent: 'amber',
  },
  {
    slug: 'longevity',
    name: 'Longevity — Hardware Maintenance and Cellular Cleanup',
    tagline: 'Prevent decay; reverse the biological clock.',
    primaryKeyword: 'longevity biohacking protocol',
    secondaryKeywords: [
      'autophagy protocol',
      'senolytic dosing',
      'biological clock reset',
      'cellular regeneration',
    ],
    shortDescription:
      'Longevity is hardware maintenance, not magic. Four protocols for autophagy, senolytic dosing, biological clock reset, and stem-cell mobilization.',
    pillar: LONGEVITY_PILLAR,
    articleSlugs: [
      'longevity-hardware-cellular-cleanup',
      'longevity-protocol-biological-clock-reset',
      'senolytic-high-dosing-longevity',
      'cacao-stem-cells',
    ],
    glossarySlugs: [],
    accent: 'emerald',
  },
] as const

export const TOPIC_SLUGS: readonly string[] = TOPICS.map((t) => t.slug)
const TOPIC_BY_SLUG = new Map<string, Topic>(TOPICS.map((t) => [t.slug, t]))

export function getTopicBySlug(slug: string): Topic | undefined {
  return TOPIC_BY_SLUG.get(slug)
}

/** Slugs whose pillar is set — these go into sitemap.xml and ARE indexable. */
export const INDEXED_TOPIC_SLUGS: readonly string[] = TOPICS.filter((t) => !!t.pillar).map((t) => t.slug)
