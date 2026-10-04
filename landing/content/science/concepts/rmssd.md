---
kind: concepts
slug: rmssd
title: "RMSSD — What This HRV Metric Reflects, and What It Doesn't"
metaTitle: "RMSSD: Definition, Meaning and Measurement"
metaDescription: "RMSSD is an HRV metric that reflects vagally mediated changes in heart rate. What it measures, how wearables estimate it, and what it cannot tell you."
shortAnswer: >
  RMSSD is a heart rate variability metric: the root mean square of the
  differences between successive heartbeats. It is used to summarize
  beat-to-beat variation in short recordings, and it reflects vagally
  mediated changes in heart rate. It is influenced by age, breathing,
  posture, time of day and the recording method. It does not by itself
  establish stress, health status or vagal tone.
keyPoints:
  - "RMSSD summarizes how much the interval between heartbeats changes from one beat to the next."
  - "It reflects vagally mediated changes in heart rate, which makes it a standard short-term metric in HRV research."
  - "Vagal tone cannot be measured directly; RMSSD is an indirect proxy, and products that claim otherwise are simplifying."
  - "Wearables estimate RMSSD from the pulse signal, and their agreement with ECG depends on the device and the conditions."
  - "Values depend on context: recording method, duration, posture, breathing and time of day all matter."
  - "A single RMSSD value is not a diagnosis or a stress reading; trends against your own baseline are usually more informative."
editor: "Yakiv Bilenko"
reviewer: null
lastReviewed: null
related:
  glossary: [heart-rate-variability]
  articles: [normal-hrv-by-age, how-to-measure-hrv-consistently, apple-watch-recovery-hrv-vs-overall-hrv]
  tools: [hrv]
  science: []
relatedPlanned: [concepts/heart-rate-variability, concepts/sdnn, concepts/hrv-baseline, measurements/heart-rate-variability, mechanisms/breathing-and-hrv]
sources:
  - id: S1
    cite: "Task Force of the ESC and NASPE (1996)"
    title: "Heart rate variability: standards of measurement, physiological interpretation and clinical use"
    journal: "Circulation"
    year: 1996
    doi: "10.1161/01.CIR.93.5.1043"
    type: guideline
  - id: S2
    cite: "Shaffer & Ginsberg (2017)"
    title: "An overview of heart rate variability metrics and norms"
    journal: "Frontiers in Public Health"
    year: 2017
    doi: "10.3389/fpubh.2017.00258"
    type: review
  - id: S3
    cite: "Laborde, Mosley & Thayer (2017)"
    title: "Heart rate variability and cardiac vagal tone in psychophysiological research — recommendations for experiment planning, data analysis, and data reporting"
    journal: "Frontiers in Psychology"
    year: 2017
    doi: "10.3389/fpsyg.2017.00213"
    type: review
  - id: S4
    cite: "Voss et al. (2015)"
    title: "Short-term heart rate variability — influence of gender and age in healthy subjects"
    journal: "PLOS ONE"
    year: 2015
    doi: "10.1371/journal.pone.0118308"
    type: observational
  - id: S5
    cite: "Nunan, Sandercock & Brodie (2010)"
    title: "A quantitative systematic review of normal values for short-term heart rate variability in healthy adults"
    journal: "Pacing Clin Electrophysiol"
    year: 2010
    doi: "10.1111/j.1540-8159.2010.02841.x"
    type: systematic-review
  - id: S6
    cite: "Xu et al. (2026)"
    title: "Accuracy of photoplethysmography-derived pulse rate variability compared with electrocardiography-derived heart rate variability: a systematic review and meta-analysis"
    journal: "Sensors"
    year: 2026
    doi: "10.3390/s26165192"
    pmid: 42655500
    type: meta-analysis
  - id: S7
    cite: "Zuern et al. (2026)"
    title: "Validation of photoplethysmography-derived short-term heart rate variability using a wearable device"
    journal: "Scientific Reports"
    year: 2026
    doi: "10.1038/s41598-026-52700-7"
    type: observational
  - id: S8
    cite: "Carter et al. (2026)"
    title: "Guidelines for rigor and reproducibility of heart rate variability within human cardiovascular research"
    journal: "Am J Physiol Heart Circ Physiol"
    year: 2026
    doi: "10.1152/ajpheart.00041.2026"
    type: guideline
  - id: S9
    cite: "Apple Inc. — HealthKit documentation"
    title: "heartRateVariabilitySDNN"
    url: "https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/heartratevariabilitysdnn"
    type: official
  - id: S10
    cite: "Apple Newsroom (2026)"
    title: "Apple advances health and fitness capabilities using Apple Intelligence"
    url: "https://www.apple.com/newsroom/2026/09/apple-advances-health-and-fitness-capabilities-using-apple-intelligence/"
    year: 2026
    type: official
  - id: S11
    cite: "Apple Inc. — HealthKit documentation"
    title: "heartRateVariabilityRMSSD (iOS/watchOS 27)"
    url: "https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/heartratevariabilityrmssd"
    type: official
evidenceMap:
  - claim: "RMSSD is the root mean square of successive differences between adjacent heartbeats; it is the preferred metric for short recordings."
    sources: [S1, S2]
    class: established
    limitation: "A definitional and methodological standard; says nothing by itself about health status."
  - claim: "SDNN describes the overall spread of the intervals in a recording, while RMSSD isolates the differences between adjacent beats."
    sources: [S1, S2]
    class: established
    limitation: "Definitions; comparability requires matching recording length and conditions."
  - claim: "RMSSD reflects vagally mediated changes in heart rate; vagal tone cannot be measured directly."
    sources: [S2, S3]
    class: established
    limitation: "An indirect proxy under the measurement conditions, not a direct measure of parasympathetic activity."
  - claim: "Breathing is written into the beat-to-beat intervals through respiratory sinus arrhythmia, so breathing rate and depth during the recording strongly shape RMSSD."
    sources: [S2, S3]
    class: established
    limitation: "The effect is present during the recording; sustained changes after practice are a separate question."
  - claim: "RMSSD depends on the measurement context: recording method, duration, posture, breathing and time of day."
    sources: [S5, S8]
    class: established
    limitation: "The size and direction of context effects vary by metric, condition and person; supported by pooled normal-value data and methodological guidance."
  - claim: "Most published reference values come from short daytime recordings, while consumer wearables mostly report night-time values."
    sources: [S5]
    class: context-dependent
    limitation: "Reference populations and protocols differ between studies; not a personal norm."
  - claim: "Pooled resting RMSSD from short daytime recordings (fact hrv.pooled.daytime) is a pooled daytime average, not a night-time value and not an age norm."
    sources: [S5]
    class: context-dependent
    limitation: "Pooled from heterogeneous short-term protocols in healthy adults; wide individual variation."
  - claim: "Wearable PPG-based estimates of HRV agree with ECG-derived values under some conditions and diverge under others."
    sources: [S6, S7]
    class: context-dependent
    limitation: "Agreement is metric-, device- and condition-specific; no accuracy numbers are given on this page."
  - claim: "On average, RMSSD declines with age in healthy adults, while individuals vary widely."
    sources: [S4, S5]
    class: established
    limitation: "Cross-sectional population averages; wide individual variation at every age."
  - claim: "RMSSD differs between women and men, with the direction and size of the difference depending on age and population."
    sources: [S4]
    class: context-dependent
    limitation: "Observational data in healthy samples; group averages, not individual expectations."
  - claim: "Everyday factors such as a late workout, an evening drink or illness can shift a single night's reading."
    sources: [S2, S8]
    class: context-dependent
    limitation: "Individual responses vary; effect sizes are person- and dose-dependent and are not quantified here."
  - claim: "Higher RMSSD is generally associated with better recovery, but not universally; some rhythm disturbances change the beat-to-beat pattern itself."
    sources: [S2]
    class: context-dependent
    limitation: "Population-level associations; not a personal verdict."
  - claim: "Trends against a person's own baseline, measured under comparable conditions, are more informative than a single reading."
    sources: [S8]
    class: guideline
    limitation: "Methodological guidance (expert consensus), not direct experimental data; a recommendation about interpretation practice, not a clinical finding."
  - claim: "Apple Health records HRV as SDNN — the long-standing HealthKit type recorded automatically by Apple Watch."
    sources: [S9]
    class: context-dependent
    claimType: device
    limitation: "Official documentation; describes what the device records, not what the values mean for health; scoped to Apple's ecosystem."
  - claim: "Recent Apple Watch models on watchOS show two HRV variants — Recovery HRV and Overall HRV — and measure HRV as often as every five minutes (fact applewatch.hrv.variants2026)."
    sources: [S10]
    class: context-dependent
    claimType: device
    limitation: "Manufacturer announcement; scoped to specific hardware and OS versions; Apple has not stated how Recovery HRV is computed."
  - claim: "iOS and watchOS add an RMSSD data type to Apple Health (fact applewatch.hrv.rmssdType)."
    sources: [S11]
    class: context-dependent
    claimType: device
    limitation: "Official documentation; availability scoped to specific OS versions; what apps record via this type depends on each app."
---

## What is RMSSD?

RMSSD is one of the standard measures of [heart rate variability](/glossary/heart-rate-variability) (HRV) — the natural variation in the time between consecutive heartbeats. The name is short for the root mean square of successive differences, and the standard definition is {{fact:hrv.rmssd.definition}} [S1].

In plain language: take the intervals between adjacent heartbeats, see how much each one differs from the next, and summarize those differences as a single value in milliseconds. A larger value means the rhythm changes more from beat to beat.

RMSSD is usually paired with SDNN, whose standard definition is {{fact:hrv.sdnn.definition}} [S1]. The two answer different questions: SDNN describes the overall spread of the intervals in a recording, while RMSSD isolates the beat-to-beat changes. Because of that focus, RMSSD is the preferred metric when the recording is short [S1, S2].

## How does RMSSD work?

The heart is not a metronome. The interval between two beats is constantly adjusted by the autonomic nervous system, and the fastest of these adjustments — the vagal (parasympathetic) influence on the heart — acts from one beat to the next [S2, S3]. RMSSD captures exactly this timescale: how much the rhythm changes between adjacent beats.

Because of this, RMSSD is read as a window on vagally mediated changes in heart rate. The framing matters. {{fact:claim.vagalTone}} [S2, S3].

Breathing leaves a strong signature in the same window. With each inhale the heart speeds up slightly; with each exhale it slows — a phenomenon called respiratory sinus arrhythmia (RSA) [S2, S3]. Slow, calm breathing deepens this wave, and a reading taken during such practice is typically higher than one taken at a fast breathing rate. That is a measurement observation about what the value responds to — not evidence that anything permanent has been trained.

## How is RMSSD measured?

The computation is simple. From a series of beat-to-beat intervals: take the difference between each pair of adjacent intervals, square the differences, average them, and take the square root [S1]. Everything RMSSD knows comes from the accuracy of those intervals — which is why the recording method matters more than the arithmetic.

The reference method is an ECG, which detects the electrical signature of each heartbeat. Wearables instead estimate the intervals from the pulse signal at the skin (photoplethysmography, PPG); the result is often called pulse rate variability. Agreement between the two is metric-dependent and condition-dependent — generally closer at rest with a good signal, weaker with movement or poor contact [S6, S7]. One practical detail for Apple Watch users: {{fact:applewatch.hrv.healthkit}} [S9]. On recent hardware, {{fact:applewatch.hrv.variants2026}} [S10]. Apple has not stated how Recovery HRV is computed. Separately, {{fact:applewatch.hrv.rmssdType}} [S11], which lets apps read an RMSSD-type value from Apple Health.

The context is part of the measurement. RMSSD depends on posture, breathing, time of day, and the length of the recording [S5, S8]. Most published reference values were collected from short daytime recordings under controlled conditions [S5], while consumer wearables mostly report night-time averages — different contexts, whose values are not directly interchangeable. For scale, pooled resting RMSSD from short daytime recordings is {{fact:hrv.pooled.daytime}} [S5] — a pooled daytime average, not a night-time value and not an age norm. The age-band tables ONDA publishes are night-time RMSSD tables and live in the [normal HRV by age](/articles/normal-hrv-by-age) article. For a consistent personal measurement routine, the practical side belongs to the [how to measure HRV consistently](/articles/how-to-measure-hrv-consistently) guide.

## What affects RMSSD?

- Age. {{fact:hrv.age.trend}} [S4, S5]. Individuals vary widely at every age; population medians are not personal targets. The full tables live in the [normal HRV by age](/articles/normal-hrv-by-age) article.
- Sex. Studies report differences between women and men, with the direction and size depending on age and population [S4].
- Breathing. The dominant short-term driver, through respiratory sinus arrhythmia: breathing rate and depth during the recording change the value [S2, S3].
- Conditions. Posture, time of day, and sleep versus waking all change what the same heart does during the measurement [S5, S8].
- Everyday factors. A late workout, an evening drink, caffeine late in the day, or illness can shift a single night's reading [S2, S8].

## What does the evidence show?

Established. The definition, computation and role of RMSSD as a short-term HRV metric come from the measurement standards of the field [S1]. Its reading as a reflection of vagally mediated changes in heart rate — with vagal tone itself not directly measurable — is the standard interpretation across methodological reviews [S2, S3]. Measurement context is a first-class factor, not a footnote: method, duration, posture, breathing and time of day all shape the value [S5, S8]. On average, RMSSD declines with age in healthy adults [S4, S5].

Context-dependent. Wearable estimates: PPG-derived values can track ECG-derived HRV under favourable conditions, and the two diverge under movement, poor contact or a weak signal [S6, S7]. Reference values: most classic ranges come from short daytime recordings, not the night-time values consumer devices report [S5].

Methodological guidance. Current guidelines for rigorous HRV research recommend standardized, repeatable recording conditions and cautious interpretation of single values [S8]. That is expert consensus about how to measure and interpret — not direct experimental data about RMSSD itself.

What remains uncertain: how closely consumer-device RMSSD-type values track ECG-derived RMSSD across everyday conditions — movement, skin tone, sensor fit, sleep stages — is still being mapped [S6, S7]. And how much of the long-term research picture, built mostly on ECG in controlled settings, transfers to consumer night-time values in healthy users is an open question [S8].

## What RMSSD does not tell you

- It is not a vagal-tone meter. {{fact:claim.vagalTone}} [S2, S3].
- It is not a diagnosis or a stress reading. {{fact:claim.hrvNotStress}} [S1].
- Higher is not automatically better. Higher RMSSD is generally associated with better recovery, but some rhythm disturbances change the beat-to-beat pattern itself, and a high value in that situation carries a different meaning [S2].
- Values are not interchangeable across devices, apps and measurement conditions [S6, S8].
- A single value says little. Methodological guidance recommends comparing readings against your own baseline, measured under comparable conditions, rather than reading meaning into any one value [S8].

## In ONDA

ONDA uses night-time RMSSD as the reference metric in its HRV norm tables and the [HRV calculator](/tools/hrv). The app's own nightly baseline, however, reads the HRV values stored by Apple Health, and {{fact:applewatch.hrv.healthkit}} [S9] — so that baseline signal is SDNN-based rather than RMSSD-based. The live reading shown during a practice is a surrogate computed from the standard deviation of heart rate, not RMSSD or SDNN, and the phone camera gives pulse, not HRV. ONDA describes and compares your own numbers; it does not diagnose anything. See [what ONDA measures](/measurements).

> Educational information, not a diagnosis or medical treatment.