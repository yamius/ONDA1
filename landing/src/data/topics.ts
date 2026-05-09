/**
 * Topic hubs — pillar pages that consolidate article + glossary content
 * by semantic cluster, each optimised for one primary search keyword.
 *
 * Pillar markdown follows the canonical ONDA voice:
 *   - Punchline at top (one or two sentences, italic intent)
 *   - Bare ID / STATUS / TAGS lines (no bold wrapping, plain text)
 *   - Numbered sections (## 1. The Logic / ## 2. The ONDA Protocol /
 *     ## 3. Hardware Validation) with inline bold labels for the
 *     scannable sub-points
 *   - [ START_HERE ] block, then [ DEEP_DIVES ] with each article as its
 *     own bold-titled paragraph (no bullet dashes)
 *   - ONDA_ALERT and ONDA_STATEMENT brand markers anchor the boundaries
 *
 * Setting `pillar` flips a hub from noindex placeholder to live + indexable
 * (sitemap.xml + JSON-LD CollectionPage + hreflang). Set to undefined to
 * pull a hub back into placeholder mode without losing the data.
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

const HRV_PILLAR = `Your HRV is the reserve of your freedom. The wider the gap between heartbeats, the more room you have to maneuver before the system fails.

ID: hrv_pillar_01

STATUS: OPERATIONAL

TAGS: HRV, Vagal_Tone, Biometrics, System_Resilience, ONDA_Hardware

## 1. The Logic: Rhythm as a Flexibility Indicator

Heart Rate Variability (HRV) is your nervous system's signal-to-noise ratio.

Every heartbeat arrives microseconds early or late, governed by a continuous dialogue between sympathetic activation (PUSH / gas) and parasympathetic recovery (PULL / brake). The amount of variability is the direct readout of how flexibly the autonomic system switches between modes — and how much energy buffer it has left.

**The Signature:** Inhale accelerates the system; exhale slows it. The vagus nerve writes its digital signature on each cardiac cycle.

**The Collapse:** Chronic load shrinks the variability window. Fixed pacing, zero slack, zero recovery margin.

**Healthy Biocomputer:** Wide HRV. Pulse irregular by design. The system absorbs perturbation without losing baseline.

**Degraded System:** Narrow HRV. Compressed range. Any small disturbance shows up as a full-day baseline drop.

> **ONDA_ALERT:** A monitor reading LOW_HRV three days in a row is the earliest detectable signal of overload — sleep debt, overtraining, or hidden infection. It surfaces days before symptoms become physical.

## 2. The ONDA Protocol: Control Hierarchy

The stack progresses from real-time intervention to long-term reserve building.

**[ START_HERE ]**

**Vagus Nerve: Master Key.** The central node in the architecture. The vagus carries roughly 80% of parasympathetic traffic and gates every HRV-relevant signal. Read this first; the rest of the cluster builds on its anatomy.

**[ DEEP_DIVES ]**

**Resonant Frequency Breathing.** The single most efficient way to drive HRV up in real time. 5.5 s inhale / 5.5 s exhale. Daily calibration that aligns cardiac rhythm with the baroreflex loop.

**0.1 Hz Baroreflex Hack.** The neurochemical mechanism behind coherent breathing. An ancient pressure-sensor loop entrained to amplify parasympathetic gain.

**Nervous System Ping Latency.** Measuring switching speed, not just variability. HRV shows resting flexibility; latency shows mode-shift time under load.

**Fault-Tolerant Human.** Building HRV reserve so the system absorbs shocks without breaking baseline.

**HRV Training & Biofeedback.** The closed-loop protocol. 10-minute coherence sessions training both vagal tone and conscious parasympathetic access.

**Biological Latency Optimization.** The operating model that ties latency, HRV, and recovery into one frame.

## 3. Hardware Validation: Telemetry Capture

**Devices:** Polar H10 (reference standard). Whoop, Oura, Garmin Fenix. Any sensor with native rMSSD reporting.

**Metrics:** rMSSD (preferred) or the device's own HRV score. Track a 30-day rolling baseline before drawing conclusions.

**Context:** Alcohol, sleep, and training load matter more than the raw number. One bad day is noise. Three in a row is a STOP signal.

> **ONDA_STATEMENT:** «Your HRV is the reserve of your freedom. The wider the gap between heartbeats, the more room you have to maneuver before the system fails.»
`

const CIRCADIAN_PILLAR = `The brain washes itself only when the lights tell it to. Skip the photonic protocol, and the cache fills with junk you cannot debug from inside the system.

ID: circadian_pillar_02

STATUS: OPERATIONAL

TAGS: Circadian, Light, Glymphatic, Neural_Cache, ONDA_Hardware

## 1. The Logic: A 24-Hour Clock Anchored by Photons

Your biocomputer runs on a master clock — the Suprachiasmatic Nucleus (SCN) — driven primarily by photonic signaling.

**Clock Reset:** Light at a color temperature of 6500 K hitting retinal ganglion cells before 9:00 AM resets the system timer.

**Night Lock:** Light levels below 50 lux (2700 K) from sunset onward lock in the night phase.

When the photonic signal degrades — dim indoor lighting at noon, blue light from screens at 11:00 PM — the clock "drifts." This drift is the silent driver of insomnia, brain fog, and metabolic chaos.

**Healthy Biocomputer:** Clock locked to local solar time. Cortisol peaks at 7:00 AM; melatonin peaks at 11:00 PM. Sleep latency under 15 minutes.

**Degraded System:** Flat cortisol curve. Random sleep timing. Impaired glymphatic system (brain washing).

> **ONDA_ALERT:** Low REM and N3 (deep sleep) scores on your wearable for a week is a system bin-overflow notification. The neural cache is not being flushed. Cognitive degradation will follow within 10–14 days.

## 2. The ONDA Protocol: Photic Resync

The stack operates in two parallel layers — Input (light/dark scheduling) and Output (sleep architecture and clearance).

**[ START_HERE ]**

**Circadian Reset: Mastering Light.** The canonical protocol. 10,000 lux morning exposure, a photonic bracket at sunset, and a "0.1 lux" (total darkness) window for sleep.

**[ DEEP_DIVES ]**

**Circadian Lighting & Dark Therapy.** Home environment optimization. Bulb specs, time blocks, and blackout discipline.

**Ancestral Sync (Circadian Anchors).** The three primary zeitgebers — light, food, temperature — and the method for hard-locking them.

**Circadian Hard Reset.** A 72-hour system reflash for severe drift (jetlag, shift work, or total sleep collapse).

**Nightly Flush: Glymphatic Neural Cache.** What happens during the N3 phase. Why side-sleeping is an engineering necessity. How alcohol blocks the sluice gates.

**Neural Hydraulics: CSF Flow.** The role of cerebrospinal fluid. Vascular tensegrity and the cervical fascia as the drainage gate.

**Phase-Locked Acoustic Sleep.** Pink noise and delta-wave entrainment for N3 amplification.

## 3. Hardware Validation: Telemetry Capture

**Devices:** Oura or Whoop for sleep stages. Light panels (Lumie / HappyLight) for the morning reset. "Lux Meter" apps for indoor lighting audits.

**Metrics:** Sleep onset latency, time in N3 phase, and morning wakefulness (subjective 1–10 scale at minute 30 post-waking).

**Context:** Alcohol within 4 hours of sleep, late caffeine, and bedroom temperatures above 22 °C kill system efficiency faster than any incorrect bulb choice.

> **ONDA_STATEMENT:** «The brain washes itself only when the lights tell it to. Skip the photonic protocol, and the cache fills with junk you cannot debug from inside the system.»
`

const DOPAMINE_PILLAR = `Dopamine is the engine of pursuit, not the prize. Optimize the gap, not the peak.

ID: dopamine_pillar_03

STATUS: OPERATIONAL

TAGS: Dopamine, Motivation, Reward_Circuit, VTA, ONDA_Software

## 1. The Logic: Prediction Error as Drive

Dopamine is not the "pleasure molecule." It is the Prediction-Error Signal — the delta between what the brain expected and what actually arrived. Drive, motivation, and focus are all outputs of the same chemical machinery responding to surprise and anticipation.

The central reactor is the Ventral Tegmental Area (VTA). It projects through the Mesolimbic Pathway into the Nucleus Accumbens (motivation hub) and the Mesocortical Pathway into the Prefrontal Cortex (working memory, focus).

**The Bottleneck:** Postsynaptic receptor density is finite. High-frequency, low-grade stimuli (notifications, refined sugar, infinite scroll) cause receptors to downregulate.

**The Result:** Your baseline drops. You require exponentially more input just to maintain the same level of drive.

**Healthy Biocomputer:** Clean baseline. Boredom is a functional state of "standby." Long deep-work cycles produce earned rewards. Subtle pleasures register with high resolution.

**Degraded System:** Flat baseline with jittery, unstable peaks. Apathy in the absence of exogenous stimulus. Compulsive seeking behavior. Anhedonia.

> **ONDA_ALERT:** If morning motivation requires a "stack" of caffeine + sugar + scroll within 30 minutes of waking, your receptor curve is severely downregulated. Acute intervention is required before the motivational cascade collapses into clinical apathy.

## 2. The ONDA Protocol: Reactor Calibration

The stack is designed to restore the baseline first, then optimize the signal-to-noise ratio of the reactor.

**[ START_HERE ]**

**Dopamine Architecture: Mastering Desire.** The canonical foundation. Maps the prediction-error model, the four dopaminergic pathways, and the critical distinction between Drive (Wanting) and Pleasure (Liking).

**[ DEEP_DIVES ]**

**Ventral Tegmental Core: Motivational Salience.** A deep dive into the reactor itself. How the VTA encodes value, the difference between salience and valence, and why chronic stress narrows the input filter.

**Dopamine Stacking & Circuit Overload.** Preventing receptor burnout. The neurochemistry of "stacking" stimulants and why it leads to glutamate excitotoxicity.

**Digital Fasting: Attentional Restoration.** The modern threat model. Protocols for neutralizing sub-threshold notifications and infinite scroll to repair the focus circuit.

**Earned vs. Unearned Rewards.** The engineering difference between active pursuit (high-effort dopamine) and passive consumption (low-effort dopamine) on system stability.

## 3. Hardware Validation: Telemetry Capture

**Metrics:** Subjective scale (1–10) tracked daily for Morning Drive, Focus Duration (time before the first task-switch), and Recovery Latency after a high-dopamine event.

**Protocol:** Establish a 14-day baseline. Tag any outliers (alcohol, sleep debt, illness) to prevent signal pollution.

**Context:** Sleep debt is a catastrophic "multiplier" that collapses the dopamine baseline faster than any behavioral protocol. Fix sleep first; the VTA cannot calibrate in a state of exhaustion.

> **ONDA_STATEMENT:** «Dopamine is the currency of effort. If you spend it all on the 'cheap' market, you will have nothing left to fund your Core Vector.»
`

const METABOLIC_PILLAR = `A locked metabolism is a single point of failure. Build dual access; the body composes its own protocol.

ID: metabolic_pillar_04

STATUS: OPERATIONAL

TAGS: Metabolic_Flexibility, Mitochondria, Dual_Fuel, GLP1, ONDA_Hardware

## 1. The Logic: Dual-Fuel Power Grid

The biocomputer operates on two primary fuel types: Glucose (fast, high-latency, high-residue) and Ketones / Fatty Acids (stable, high-density, clean-burning). A high-performance system switches between them on demand. A degraded system is "glucose-locked," suffering from energy crashes and oxidative stress from constant insulin spikes.

The core of the power grid is the Mitochondrion. Mitochondrial mass, membrane integrity, and respiratory chain efficiency determine the maximum power output of every neural and somatic cell.

**The Problem:** Modern lifestyle starves mitochondria of corrective stress (fasting, cold, Zone-2). They shrink in number and quality. Total system output drops; chronic fatigue emerges as the default state.

**Healthy Biocomputer:** Dual-fuel access. Stable cognitive output across 6-hour fasting windows. Endogenous ketosis detected within 24–36 hours of caloric restriction.

**Degraded System:** Glucose-locked. Acute hypoglycemic symptoms (brain fog, irritability) after missing a single meal. Inability to access fat stores even in a caloric deficit.

> **ONDA_ALERT:** If missing breakfast triggers "hanger," cognitive jitter, or a drop in focus by hour 14, your Mitochondrial Flexibility is compromised. The system has lost its ability to switch power sources under load.

## 2. The ONDA Protocol: Power-Grid Calibration

The stack rebuilds mitochondrial density, restores the metabolic switch, and optimizes the substrate for the brain.

**[ START_HERE ]**

**Metabolic Flexibility: The Dual-Fuel Switch.** Defines the biochemistry of the switch, maps the insulin-glucagon axis, and provides the initial diagnostic protocol.

**[ DEEP_DIVES ]**

**Mitochondrial Biogenesis: Cellular Power Grid.** Scaling the hardware. The protocol for growing new mitochondria using Zone-2 cardio, cold exposure, and controlled hypoxia.

**NIR & Mitochondrial DNA: Photobiomodulation.** Targeting Cytochrome-c Oxidase with 660 / 850 nm light. Using photons to boost ATP production and repair mitochondrial membranes.

**GLP-1 Biology: Signaling and Muscle Integrity.** Understanding the GLP-1 pathway. Why protecting skeletal muscle via resistance training is a mandatory requirement for metabolic longevity.

**Skeletal Muscle: The Primary Glucose Sink.** Treating muscle as an endocrine organ and the single most important predictor of system resilience.

**Metabolic Redundancy: Hybrid Power Architecture.** Why having two fuel sources is an engineering necessity, even when glucose is abundant.

## 3. Hardware Validation: Telemetry Capture

**Devices:** Blood Ketone Meter (Keto-Mojo), Continuous Glucose Monitor (CGM) for a 14-day audit, and Lactate Meter for Zone-2 threshold verification.

**Protocol:** Measure Fasting Glucose, Insulin (to calculate HOMA-IR), and Ketones. Establish a 30-day baseline before implementing major dietary shifts.

**Context:** High cortisol (stress), sleep deprivation, and hidden infections will spike glucose independent of food intake. Do not calibrate the metabolism based on isolated "noisy" readings.

> **ONDA_STATEMENT:** «Metabolic flexibility is the ultimate insurance policy. If your reactor can only burn one type of fuel, you are always one missed meal away from a system crash.»
`

const BREATHWORK_PILLAR = `The breath is the only system you can debug from outside the kernel. Use it.

ID: breathwork_pillar_05

STATUS: OPERATIONAL

TAGS: Breathwork, CO2_Tolerance, Bohr_Effect, Vagal_Activation, ONDA_Software

## 1. The Logic: The Autonomic CLI

Breath is the only autonomic process under voluntary control. Heart rate is regulated by the brainstem; insulin by the pancreas; cortisol by the HPA axis. Breath alone has a direct command-line interface to the autonomic state.

**The Long Exhale:** Activates the vagus nerve and shifts the system to parasympathetic.

**The Breath Hold:** Raises CO2, expands the Bohr effect, releases more O2 to tissue.

**The Box Pattern:** Stabilizes the entire autonomic arc.

**Healthy Biocomputer:** Nasal breathing at rest. 6 breaths/minute resting rate. 30+ second exhale-hold (BOLT score). High CO2 tolerance.

**Degraded System:** Mouth breathing at rest. 14+ breaths/minute. BOLT under 20 s. Hyperventilation under mild stress; chronic mild alkalosis.

> **ONDA_ALERT:** A BOLT score under 20 seconds means the system is chronically over-breathing. Energy yield per breath drops; HRV narrows; sleep apnea risk rises.

## 2. The ONDA Protocol: Breath Programming

The stack starts with awareness, moves to volume control, ends with CO2 tolerance.

**[ START_HERE ]**

**Breathwork: Command-Line Interface.** Maps the four CLI commands — slow, deep, hold, retain — and what each writes to the autonomic state.

**[ DEEP_DIVES ]**

**CO2 Tolerance: Expanding the Oxygen Limit.** Counterintuitive truth: O2 delivery depends on CO2, not on how much air you move. Protocol for raising the CO2 setpoint.

**Bohr Effect: Oxygen Telemetry.** The biochemical mechanism. Why hemoglobin releases O2 only when CO2 is present. The acid-base math behind every breath protocol.

## 3. Hardware Validation: Telemetry Capture

**Devices:** Pulse oximeter for SpO2. Simple stopwatch for BOLT. Optional CO2 monitor (Aranet4) for inspired-air audit.

**Metrics:** Morning BOLT score. Resting respiratory rate (weekly). Re-baseline after every 30-day intervention.

**Context:** Caffeine, anxiety, and altitude all spike respiratory rate. Don't compare across context shifts.

> **ONDA_STATEMENT:** «The breath is the only system you can debug from outside the kernel. Use it.»
`

const NEUROPLASTICITY_PILLAR = `The cortex rewrites only when the system gives it permission. Flow is the permission.

ID: neuroplasticity_pillar_06

STATUS: OPERATIONAL

TAGS: Neuroplasticity, Flow_State, Alpha_Rhythm, BDNF, ONDA_Software

## 1. The Logic: The Cortex Rewriting Itself

The brain is not fixed hardware. Synapses strengthen with use, weaken with disuse, and the cortex re-allocates territory under load. Plasticity is the substrate of every skill, every recovery, every behavior change.

**The Precondition:** Plasticity requires the right neurochemical state. Beta dominance (high arousal, narrow focus) blocks rewriting. Alpha–theta dominance (low arousal, wide attention, present-tense) unlocks it.

**The Engineered State:** Flow is a controlled merge of alpha + theta with norepinephrine and dopamine modulation that triples learning rate.

**Healthy Biocomputer:** Can shift between beta (work mode) and alpha (rest / integration) at will. Daily flow access available with appropriate task. New skill acquisition fast.

**Degraded System:** Stuck in beta. Cannot wind down. Sleep onset insomnia. Skills refuse to consolidate; memory weak.

> **ONDA_ALERT:** If you cannot remember what you read yesterday, the consolidation pathway is broken. Flow access is both the diagnostic and the protocol.

## 2. The ONDA Protocol: Plasticity Unlock

The stack starts with state engineering, moves to flow access, ends with plasticity reserve.

**[ START_HERE ]**

**Neuroplasticity & Flow Overclocking.** Maps BDNF cascades, the four pillars of plasticity, and the flow-state diagnostic.

**[ DEEP_DIVES ]**

**Physiological Concentration: Flow State Hardwired.** Concentration as a physiological state, not a willpower act. Vagal pre-conditioning + breath bracketing.

**Neural Bridge: Alpha-Flow Gateway.** The alpha–theta crossover. Why insight emerges only at the edge.

**Neural Entrainment: Meditation Practice.** Driving brainwave dominance via audio, movement, and breath. The training protocol.

**Idle State: Alpha Rhythms.** The default-mode network. Why doing nothing is the most productive thing you can do.

**Quiet Mode: Alpha-Cortisol Buffer.** Using alpha to absorb stress instead of accumulating it. The everyday protocol.

**Anti-Entropy: Neural Architecture.** Preventing neural drift in midlife. The maintenance protocol.

## 3. Hardware Validation: Telemetry Capture

**Devices:** Muse or Mendi for at-home EEG. HRV monitor for vagal pre-condition check. Simple time-tracker for flow duration.

**Metrics:** Number of flow sessions per week and total flow minutes. 30-day baseline. Tag context — sleep score, exercise, diet.

**Context:** Caffeine over 200 mg blocks alpha access. So does scrolling within 30 minutes of work. The single biggest plasticity destroyer is sleep debt.

> **ONDA_STATEMENT:** «The cortex rewrites only when the system gives it permission. Flow is the permission.»
`

const COGNITIVE_PILLAR = `Focus is not willpower. It is the cholinergic pattern your nervous system can sustain. Train the pattern.

ID: cognitive_pillar_07

STATUS: OPERATIONAL

TAGS: Cognitive_Control, ACC, Acetylcholine, Attention, ONDA_Software

## 1. The Logic: The Acetylcholine Lens

Attention is not effort. It is a pattern of acetylcholine release that sharpens cortical signal-to-noise — the Acetylcholine Lens.

**Wide Mode:** The lens scans for novelty. Fast switching. Low resolution.

**Narrow Mode:** The lens carves a single signal out of noise. Slow switching. High resolution.

**The Arbiter:** The anterior cingulate cortex (ACC) monitors goal-vs-stimulus conflict, raises the cognitive cost when attention drifts, and triggers focal lock or release. ACC integrity = control bandwidth.

**Healthy Biocomputer:** Holds a single task for 90 minutes without involuntary drift. Recovers focal lock within 5 seconds of distraction. Working memory holds 4–7 items.

**Degraded System:** Task-switches every 90 seconds. Cannot read a paragraph without re-reading. Working memory overflows on a grocery list.

> **ONDA_ALERT:** If you cannot read a long-form article without 3+ tab switches, the ACC is in degraded mode. Acetylcholine signaling weak; default-mode network bleeding into work mode.

## 2. The ONDA Protocol: Lens Calibration

The stack starts with ACC training, moves through neurochemical support, ends with throughput optimization.

**[ START_HERE ]**

**Acetylcholine Lens: Neuro-Mechanics.** Maps the cholinergic pathways, defines the focal-lock loop, walks through the daily lens drill.

**[ DEEP_DIVES ]**

**ACC Calibration Protocol: Cognitive Control Training.** The monotasking drill. The 25-minute uninterrupted work block.

**Anterior Cingulate Core: Coherence Monitoring.** The arbiter mechanism. How to read ACC fatigue and when to rest.

**Cognitive Architecture: Neural Throughput.** The bandwidth model. Working-memory ladder, chunking discipline, attention reservoir.

**Cognitive Architecture: Nootropic Stacks.** Pharmacology that supports the lens, never substitutes for training. The minimal stack.

**Neural Signal-to-Noise: Cleaning the System Channel.** Environmental and digital noise budget. The pre-flight checklist.

## 3. Hardware Validation: Telemetry Capture

**Devices:** Simple timer (Pomodoro). Sustained-attention task (PVT app). Optional EEG focus monitor (Mendi).

**Metrics:** Daily count of completed 25-minute focused blocks. Interruption count per block. Re-baseline weekly.

**Context:** Sleep debt and unprocessed emotional load are the two biggest ACC destroyers. Don't try to outwork either.

> **ONDA_STATEMENT:** «Focus is not willpower. It is the cholinergic pattern your nervous system can sustain. Train the pattern.»
`

const SPINAL_PILLAR = `The cortex is the strategist. The spinal cord is the executor. Keep them on separate threads.

ID: spinal_pillar_08

STATUS: OPERATIONAL

TAGS: CPG, Spinal_Cord, Motor_Autopilot, Rhythmic_Entrainment, ONDA_Hardware

## 1. The Logic: Decentralised Motor Compute

The spinal cord is not a cable. It is an autonomous compute node. Central pattern generators (CPGs) — neural circuits in the lumbar and cervical cord — run rhythmic motor scripts (walking, breathing, swimming) without cortical command.

**The Edge Compute:** The cortex hands off the loop. CPGs execute. Sensors return correction. The cortex is freed for higher-order tasks.

**The Collapse:** When CPGs degrade — chronic immobility, neurological damage, disrupted proprioception — the cortex must micromanage every step. Cognitive bandwidth collapses; movement quality drops.

**Healthy Biocomputer:** Smooth gait without conscious command. Cervical–respiratory coupling intact. Locomotor rhythm modulates HRV positively.

**Degraded System:** Cognitive load on every step. Asymmetric gait. Breath–step decoupled.

> **ONDA_ALERT:** If walking requires conscious attention to balance or step rhythm, the CPG is being micromanaged. The cortex is doing the spinal cord's job.

## 2. The ONDA Protocol: Edge-Compute Restoration

The stack starts with awareness, moves to entrainment, ends with rhythm-locked patterns.

**[ START_HERE ]**

**CPG: Neural Autopilot.** Maps the spinal motor architecture, defines CPG activity, walks through the daily activation sequence.

**[ DEEP_DIVES ]**

**Spinal Harddrive: CPG Autonomous Scripts.** The script library. How walking, breathing, and posture run as separate threads.

**Spinal Intelligence: Decentralized Control.** The engineering analogy. Edge compute vs. cloud; why decentralisation is faster and more resilient.

**Rhythmic Entrainment: System Frequencies.** Synchronizing breath, gait, and heart rhythm. The 0.1 Hz master clock.

## 3. Hardware Validation: Telemetry Capture

**Devices:** Wearable with cadence (any running watch). HRV monitor for breath-coupling check. Video capture for gait asymmetry analysis.

**Metrics:** Cadence, asymmetry index, and breath-step lock-in (steps per breath at walking pace).

**Context:** Fatigue, footwear, and surface all change gait pattern. Compare like-to-like across days.

> **ONDA_STATEMENT:** «The cortex is the strategist. The spinal cord is the executor. Keep them on separate threads.»
`

const HORMONES_PILLAR = `Hormones are the slow protocol. Compensation is silent. Monitor, or you will not see the crash coming.

ID: hormones_pillar_09

STATUS: OPERATIONAL

TAGS: Endocrine, HPA_Axis, Cortisol, Sex_Hormones, ONDA_Software

## 1. The Logic: The Slow Protocol Clock

The endocrine system operates as the Slow Protocol Clock of the biocomputer. While neural signaling (Focus / Attention) operates in milliseconds, hormones move in minutes, hours, and days. Each hormone is a biochemical broadcast addressed to every cell equipped with the corresponding receptor.

**The Hierarchy:** The system is strictly tiered: Hypothalamus → Pituitary → Peripheral Gland → Target Tissue.

**The Feedback Loops:** Stability is maintained through recursive loops (e.g., cortisol inhibits its own release).

**The Failure Mode:** Chronic stress, sleep debt, and unmonitored exogenous inputs break these loops. The system enters Late-Stage Compensation — a state that can hold for years, masking deep dysfunction until the "governor" fails.

**Healthy Biocomputer:** Dynamic diurnal cortisol curve. Sex hormones aligned with physiological age and cycles. High leptin and insulin sensitivity. Thyroid (TSH / T3 / T4) in the "Optimal Performance Range," not just "Lab Normal."

**Degraded System:** Flat cortisol curve (no morning peak). Suppressed sex hormones. Leptin resistance. Subclinical hypothyroidism.

> **ONDA_ALERT:** If morning energy is stimulant-dependent and evening relaxation is alcohol-dependent, the HPA Axis is in late-stage compensation. The system is cannibalizing its future reserves to maintain current output; the "bill" is inevitable.

## 2. The ONDA Protocol: Endocrine Routing

The stack prioritizes long-term stability by mapping and recalibrating the four major axes.

**[ START_HERE ]**

**Endocrine Architecture: The Four Axes.** A master map of the HPA (Stress), HPG (Sex), HPT (Thyroid), and Leptin (Energy) axes. Defines the testing cadence and the logic of interpretation.

**[ DEEP_DIVES ]**

**HPA Axis Control: Cortisol & Thermal Runaway.** The stress axis. Identifying the "Adrenal Governor" failure before it shows on standard labs.

**Endocrine Social Drive: Oxytocin & Testosterone.** The affiliation/aggression balance. Understanding how social hormones function as a behavioral control system.

**Energy Sensor: Leptin & Metabolic Satiety.** Leptin resistance as the primary upstream marker for metabolic syndrome and cognitive fog.

**Energy Governor: Thyroid Optimal Range.** Why "Lab Normal" TSH often hides subclinical hypothyroidism and metabolic stagnation.

**Neural Optimizer: Estrogen & Neuroprotection.** Estrogen as a cognitive enhancer and its role in maintaining neural plasticity and structural integrity.

**Cyclical Architecture: Performance Mapping.** Protocol design for cycling bodies. Aligning deep-work windows and physical load with the hormonal phases of the menstrual cycle.

**System Stability: The Gut-Brain Serotonin Loop.** Why 90% of serotonin is produced in the gut and its impact on the system's baseline mood and stability.

## 3. Hardware Validation: Telemetry Capture

**Devices:** Quarterly DUTCH (dried urine) or saliva panels for HPA mapping; venous blood panels for sex hormones and thyroid; CGM for tracking glucose-cortisol coupling.

**Protocol:** Minimum of 4 data points per year. Every panel must be tagged with metadata: sleep score, subjective stress levels, and training load for the preceding 7 days.

**Context:** Acute stress or high-intensity exercise within 24 hours of testing will skew the results. Do not calibrate the system based on a single "noisy" data point.

> **ONDA_STATEMENT:** «Hormonal health is the foundation of the long game. Neural speed is useless if the underlying chemical bus is failing. Respect the slow protocol.»
`

const LONGEVITY_PILLAR = `The body knows how to repair itself. Your job is to give it the right stimulus, the right substrate, and enough time.

ID: longevity_pillar_10

STATUS: OPERATIONAL

TAGS: Longevity, Autophagy, Senolytics, Stem_Cells, ONDA_Hardware

## 1. The Logic: Hardware Maintenance, Not Magic

Longevity in the ONDA ecosystem is not a "supplement stack." It is Hardware Maintenance: the systematic clearing of damaged cells, refreshing the cellular substrate, and repairing the DNA replication machinery. The biocomputer possesses all necessary onboard subroutines (Autophagy, Apoptosis, Senolysis); they are simply under-stimulated in the modern environment.

**The Damage Profile:**

**Senescent Cells:** "Zombie cells" that refuse to undergo apoptosis, instead secreting inflammatory signals that degrade neighboring tissue.

**Oxidative Load:** Cumulative DNA copy errors that destabilize the system's "source code."

**Stem-Cell Depletion:** Exhaustion of the regenerative pool due to chronic adrenal load and high systemic impedance.

**Healthy Biocomputer:** Biological age tracks within ±5 years of calendar age. Rapid injury recovery. High structural elasticity.

**Degraded System:** Biological age >10 years above calendar. Chronic low-grade inflammation. Accelerated visible and functional decay.

> **ONDA_ALERT:** If your biological age (via DNA methylation panel) exceeds your calendar age by more than 5 years, your Cleanup Subroutines are dormant. The system is accumulating "technical debt" that will eventually lead to a hardware crash.

## 2. The ONDA Protocol: Cellular Refresh

The stack is designed to activate deep-cleaning protocols first, followed by substrate replenishment and regenerative signaling.

**[ START_HERE ]**

**Longevity Hardware: Cellular Cleanup.** The foundational manual. Maps the four primary pathways (Autophagy, Mitophagy, Apoptosis, Senolysis). Defines the required stimulus (thermal, nutrient-sensing, and mechanical) to trigger hardware refresh.

**[ DEEP_DIVES ]**

**Biological Clock Reset: The Deep Cleanup.** Utilizing fasting-mimicking cycles, the NAD+ stack, and polyphenol pulses to recalibrate the sirtuin pathways and reset the epigenetic clock.

**Senolytic High-Dosing: Targeted Clearance.** The protocol for identifying and eliminating senescent cells. Strategic use of Quercetin, Fisetin, and medically-supervised senolytics to lower the system's "inflammatory noise."

**Cacao & Stem Cells: Regenerative Substrate.** Using non-stimulant high-flavanol cacao and specific nutrient timing as a signal for stem-cell mobilization and capillary repair.

**Telomere Integrity & DNA Repair.** Protocols for minimizing oxidative "cross-talk" and supporting the enzymes responsible for genomic stability.

## 3. Hardware Validation: Telemetry Capture

**Devices:** DNA Methylation panels (TruDiagnostic / MyDNAge) for annual biological age auditing; quarterly blood panels for inflammatory markers (hs-CRP, IL-6).

**Protocol:** Establish a hard baseline of biological age before any major longevity intervention. Re-test at 12-month intervals to measure protocol efficacy.

**Context:** Acute illness, vaccinations, or recent trauma/surgery will distort biological age readings for up to 6–8 weeks. Wait for system homeostasis before capturing telemetry.

> **ONDA_STATEMENT:** «Aging is the accumulation of unhandled errors. Longevity is the discipline of continuous debugging. Refresh the substrate before the errors become structural.»
`

export const TOPICS: readonly Topic[] = [
  {
    slug: 'hrv',
    name: 'HRV — Signal/Noise of Your Biocomputer',
    tagline: 'Rhythm as the flexibility indicator of the autonomic system.',
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
    name: 'Circadian — Photonic Protocol and Cache Flush',
    tagline: 'Reset the clock; flush the neural cache.',
    primaryKeyword: 'circadian rhythm reset protocol',
    secondaryKeywords: [
      'morning light exposure protocol',
      'sleep optimization biohacking',
      'glymphatic flush',
      'melatonin biology',
      'chronotype calibration',
    ],
    shortDescription:
      'A 24-hour clock anchored by photons. Six protocols for circadian reset, sleep architecture, and glymphatic clearance.',
    pillar: CIRCADIAN_PILLAR,
    articleSlugs: [
      'circadian-reset-mastering-light',
      'circadian-lighting-dark-therapy',
      'ancestral-sync-circadian-anchors',
      'protocol-circadian-hard-reset',
      'nightly-flush-glymphatic-neural-cache',
      'neural-hydraulics-csf-flow',
      'phase-locked-acoustic-sleep',
    ],
    glossarySlugs: ['circadian-rhythm', 'melatonin', 'glymphatic-system'],
    accent: 'amber',
  },
  {
    slug: 'dopamine',
    name: 'Dopamine — Reactor Calibration and Salience Drive',
    tagline: 'The engine of pursuit, not the prize.',
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
      'ventral-tegmental-core-motivational-salience',
      'dopamine-stacking-preventing-circuit-overload',
      'digital-dementia-attentional-control',
    ],
    glossarySlugs: ['dopamine'],
    accent: 'purple',
  },
  {
    slug: 'metabolic',
    name: 'Metabolic — Dual-Fuel Power Grid',
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
    name: 'Breathwork — Autonomic CLI',
    tagline: 'Direct command-line access to nervous-system mode.',
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
    name: 'Neuroplasticity — Cortex Rewriting and Flow Permission',
    tagline: 'The cortex rewrites only when the system gives permission.',
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
    name: 'Cognitive — The Acetylcholine Lens',
    tagline: 'Sharpen attention; carve signal from noise.',
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
      'acetylcholine-lens-neuro-mechanics',
      'acc-calibration-protocol-cognitive-control',
      'anterior-cingulate-core-coherence-monitoring',
      'cognitive-architecture-neural-throughput',
      'cognitive-architecture-nootropic-stacks',
      'neural-signal-to-noise-cleaning-system-channel',
    ],
    glossarySlugs: [],
    accent: 'cyan',
  },
  {
    slug: 'spinal',
    name: 'Spinal — Decentralized Motor Compute',
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
    name: 'Hormones — The Slow Protocol Clock',
    tagline: 'Compensation is silent. Monitor, or you will not see it coming.',
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
    name: 'Longevity — Hardware Maintenance Protocol',
    tagline: 'Stimulate the cleanup pathways; rebuild the substrate.',
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
