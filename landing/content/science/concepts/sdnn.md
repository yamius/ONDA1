---
kind: concepts
slug: sdnn
title: "SDNN — What This HRV Metric Measures, and What It Doesn't"
metaTitle: "SDNN: Definition, Meaning and the Apple Angle"
metaDescription: "SDNN is the HRV metric Apple Health stores. What it measures, how it differs from RMSSD, and why the two numbers cannot be compared."
shortAnswer: >
  SDNN is a heart rate variability metric: the standard deviation of the
  intervals between normal heartbeats. It is used to summarize the overall
  spread of the heart's rhythm across a recording, and it grows with
  recording length, so values from different devices, apps and recording
  regimes are not directly comparable. It is the metric Apple Health stores.
  It does not by itself establish stress, health status or autonomic balance.
keyPoints:
  - "SDNN summarizes the overall spread of the intervals between normal heartbeats within a recording."
  - "It reflects total variability: both branches of the autonomic nervous system and slower rhythms contribute to it."
  - "SDNN depends on recording length, so short lab readings, all-day Holter values and night-time watch numbers are not interchangeable."
  - "Apple Health stores HRV as SDNN, which is why Apple Watch numbers cannot be compared directly with RMSSD numbers from other wearables."
  - "Wearables estimate SDNN from the pulse signal, and their agreement with ECG depends on the device and the conditions."
  - "A single SDNN value is not a diagnosis or a stress reading; your own comparable-condition trend is more informative."
image: "/images/science/sdnn.png"
imageAlt: "A row of heartbeat intervals of varying length above a dot distribution of those intervals, with a teal bracket marking their spread around the average — the idea SDNN summarizes."
imagePrompt: "Minimal scientific illustration on a clean white background: a wide band of overlapping teal heart-rhythm lines, tight in places and spreading wider in others, thin strokes with a soft cyan glow, lots of empty space, no text, no numbers, no people, no devices, light and calm, 4:3."
editor: "Yakiv Bilenko"
reviewer: null
lastReviewed: null
related:
  glossary: [heart-rate-variability]
  articles: [hrv-different-every-device, apple-watch-recovery-hrv-vs-overall-hrv, normal-hrv-by-age]
  tools: [hrv]
  science: [concepts/rmssd]
relatedPlanned: [concepts/heart-rate-variability, concepts/hrv-baseline, measurements/heart-rate-variability, mechanisms/breathing-and-hrv]
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
    cite: "Xu et al. (2026)"
    title: "Accuracy of photoplethysmography-derived pulse rate variability compared with electrocardiography-derived heart rate variability: a systematic review and meta-analysis"
    journal: "Sensors"
    year: 2026
    doi: "10.3390/s26165192"
    pmid: 42655500
    type: meta-analysis
  - id: S6
    cite: "Zuern et al. (2026)"
    title: "Validation of photoplethysmography-derived short-term heart rate variability using a wearable device"
    journal: "Scientific Reports"
    year: 2026
    doi: "10.1038/s41598-026-52700-7"
    pmid: 42151374
    type: observational
  - id: S7
    cite: "Carter et al. (2026)"
    title: "Guidelines for rigor and reproducibility of heart rate variability within human cardiovascular research"
    journal: "Am J Physiol Heart Circ Physiol"
    year: 2026
    doi: "10.1152/ajpheart.00041.2026"
    pmid: 42495990
    type: guideline
  - id: S8
    cite: "Apple Inc. — HealthKit documentation"
    title: "heartRateVariabilitySDNN"
    url: "https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/heartratevariabilitysdnn"
    type: official
  - id: S9
    cite: "Apple Newsroom (2026)"
    title: "Apple advances health and fitness capabilities using Apple Intelligence"
    url: "https://www.apple.com/newsroom/2026/09/apple-advances-health-and-fitness-capabilities-using-apple-intelligence/"
    year: 2026
    type: official
  - id: S10
    cite: "Apple Inc. — HealthKit documentation"
    title: "heartRateVariabilityRMSSD (iOS/watchOS 27)"
    url: "https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/heartratevariabilityrmssd"
    type: official
evidenceMap:
  - claim: "SDNN is the standard deviation of the intervals between normal heartbeats over a recording (fact hrv.sdnn.definition)."
    sources: [S1, S2]
    class: established
    claimType: definition
    quote: "The standard deviation of the IBI of normal sinus beats (SDNN) is measured in ms."
    limitation: "A definitional and methodological standard; says nothing by itself about health status."
  - claim: "Normal means abnormal and ectopic beats are removed before the statistic is computed."
    sources: [S2]
    class: established
    claimType: definition
    quote: '"Normal" means that abnormal beats, like ectopic beats (heartbeats that originate outside the right atrium’s sinoatrial node), have been removed.'
    limitation: "Describes data cleaning; how strictly beats are filtered differs between algorithms and devices."
  - claim: "SDNN reflects all the cyclic components responsible for variability during the recording; it summarizes total variability rather than one branch of the autonomic nervous system."
    sources: [S2, S3]
    class: established
    claimType: measurement
    quote: "In the time-domain, the standard deviation of all R–R intervals (SDNN) reflects all the cyclic components responsible for variability in the period of recording."
    limitation: "A property of the statistic; the mix of rhythms shifts with recording length and conditions."
  - claim: "SDNN depends on the length of the recording: longer recordings admit slower rhythms and produce larger values, so SDNN values from recordings of different lengths cannot be compared."
    sources: [S1, S2]
    class: established
    claimType: measurement
    quote: "Since longer recordings are associated with increased HRV, it is inappropriate to compare metrics like SDNN when they are calculated from epochs of different length."
    limitation: "A methodological property of the metric; it affects every comparison across apps, studies and protocols."
  - claim: "All-day, short-term and ultra-short-term HRV normative values are not interchangeable."
    sources: [S2]
    class: established
    claimType: measurement
    quote: "They caution that 24 h, short-term, and ultra-short-term normative values are not interchangeable."
    limitation: "About normative values in healthy and clinical populations; consumer night-time values are a further, different context."
  - claim: "Both branches of the autonomic nervous system contribute to SDNN, and it is strongly related to slower frequency bands and total power."
    sources: [S2]
    class: established
    claimType: physiology
    quote: "Both SNS and PNS activity contribute to SDNN and it is highly correlated with ULF, VLF and LF band power, and total power."
    limitation: "Population-level physiological reasoning; the balance of contributions shifts with recording conditions."
  - claim: "Longer recordings admit slower rhythms — changing workloads, conditioning and circadian processes — each adding to the spread."
    sources: [S2]
    class: established
    claimType: measurement
    quote: "extended measurement periods can index the heart's reactions to changing workloads, anticipatory central nervous activity involving classical conditioning, and circadian processes, including sleep-wake cycles"
    limitation: "Explains why window length matters, not what any single window says about a person."
  - claim: "RMSSD is more influenced by the parasympathetic branch than SDNN, which is why the two metrics can move differently."
    sources: [S2]
    class: established
    claimType: physiology
    quote: "The RMSSD is more influenced by the PNS than SDNN."
    limitation: "A relative statement between metrics, not a measure of parasympathetic activity in either."
  - claim: "Vagal tone cannot be measured directly, and HRV is not a specific marker of sympathetic outflow or sympathovagal balance (fact claim.vagalTone)."
    sources: [S2, S7]
    class: established
    claimType: physiology
    quote: "HRV has some utility as a cardiovascular risk stratification tool, but is not appropriate to employ as a specific marker of cardiac sympathetic outflow or sympathovagal balance."
    limitation: "A methodological caution from guidelines and reviews; SDNN values do not translate into autonomic readouts."
  - claim: "In clinical cardiology, SDNN computed from all-day ECG recordings is a risk-stratification measure in patient populations."
    sources: [S2]
    class: established
    claimType: other
    quote: 'The SDNN is the "gold standard" for medical stratification of cardiac risk when recorded over a 24 h period.'
    limitation: "Clinical populations with continuous hospital ECG; does not transfer to consumer watch values."
  - claim: "In brief resting recordings, the dominant source of SDNN variation is the breathing-linked oscillation in heart rate."
    sources: [S2]
    class: established
    claimType: physiology
    quote: "In short-term resting recordings, the primary source of the variation is parasympathetically-mediated RSA, especially with slow, paced breathing (PB) protocols."
    limitation: "Applies to the recording window; it is a measurement observation, not evidence of a lasting change."
  - claim: "Wearable PPG-based estimates of HRV agree with ECG-derived values under some conditions and diverge under others; pooled estimates are not evidence of interchangeability."
    sources: [S5, S6]
    class: context-dependent
    claimType: measurement
    quote: "the pooled estimates should not be generalized to sleep, exercise, stress, or free-living settings or interpreted as evidence of interchangeability"
    limitation: "Agreement is metric-, device- and condition-specific; no accuracy numbers are given on this page."
  - claim: "Under controlled resting conditions, wrist PPG can reproduce ECG-derived HRV indices closely, while real-world validation remains limited."
    sources: [S6]
    class: context-dependent
    claimType: measurement
    quote: "Under controlled resting conditions, wrist-based PPG provides reliable HRV indices compared with ECG-derived HRV. These findings support the use of selected PPG-derived HRV parameters for short-term assessment in clinical settings."
    limitation: "Single-device validation in resting adults in sinus rhythm; not a general accuracy claim for consumer watches."
  - claim: "Apple Health records HRV as SDNN — computed as the standard deviation of the inter-beat intervals between normal heartbeats and recorded automatically by Apple Watch (fact applewatch.hrv.healthkit)."
    sources: [S8]
    class: established
    claimType: device
    quote: "While there are multiple ways of computing HRV, HealthKit uses SDNN heart rate variability, which uses the standard deviation of the inter-beat (RR) intervals between normal heartbeats (typically measured in milliseconds). The system automatically records samples on Apple Watch."
    limitation: "Official documentation; describes what the system records, not what the values mean for health; scoped to Apple's ecosystem."
  - claim: "Recent Apple Watch models on watchOS show two HRV variants — Recovery HRV and Overall HRV — and measure HRV as often as every five minutes (fact applewatch.hrv.variants2026)."
    sources: [S9]
    class: context-dependent
    claimType: device
    quote: "Apple Watch provides two separate variants of HRV for better understanding of a user's health status. Recovery HRV is best to identify daily signals of stress and recovery, while overall HRV is best for insights on a user's broader health, including cardiovascular health."
    limitation: "Manufacturer announcement; scoped to specific hardware and OS versions; Apple has not stated how Recovery HRV is computed."
  - claim: "iOS and watchOS add an RMSSD data type to Apple Health (fact applewatch.hrv.rmssdType)."
    sources: [S10]
    class: context-dependent
    claimType: device
    quote: "iOS 27.0+iPadOS 27.0+Mac Catalyst 27.0+macOS 27.0+visionOS 27.0+watchOS 27.0+ (platform availability)"
    limitation: "Official documentation; availability scoped to specific OS versions; what apps record via this type depends on each app."
  - claim: "On average, heart-rate variability diminishes with age in healthy adults, while individuals vary widely."
    sources: [S4]
    class: established
    claimType: other
    quote: "autonomic activities diminish with age in both genders"
    limitation: "Cross-sectional population averages; wide individual variation at every age; no age tables on this page."
  - claim: "The length of the recording, the setting, breathing and the analysis method all shape the value and the rigor of its interpretation."
    sources: [S7]
    class: guideline
    claimType: measurement
    quote: "length of recording, location of recordings (i.e., laboratory vs. field), respiratory rate and depth, and analytical approaches (i.e., time vs. frequency domain) can all impact rigor, reliability, and study interpretations"
    limitation: "Expert consensus about methods; the size of each effect is condition- and person-specific."
  - claim: "Single readings require cautious, contextualized interpretation rather than being read in isolation."
    sources: [S7]
    class: guideline
    claimType: measurement
    quote: "investigators should interpret and contextualize findings within the limitations outlined in this guideline review."
    limitation: "Expert consensus about interpretation practice, not direct experimental data; comparing with your own comparable-condition trend is the practical extension."
  - claim: "Abnormal beats and noise can masquerade as variability and inflate the value."
    sources: [S2]
    class: established
    claimType: measurement
    quote: "Abnormal beats may reflect cardiac dysfunction or noise that masquerades as HRV."
    limitation: "A data-quality caution; artefact handling differs between devices and algorithms."
---

## What is SDNN?

SDNN is one of the standard measures of [heart rate variability](/glossary/heart-rate-variability) (HRV) — the natural variation in the time between consecutive heartbeats. In the field's measurement standards it is defined precisely: {{fact:hrv.sdnn.definition}} [S1]. The "NN" in the name means normal-to-normal: only intervals between normal heartbeats count, and abnormal beats are removed before the statistic is computed [S2].

In plain language: collect every interval between adjacent normal heartbeats in a recording, see how spread out they are around their average, and express that spread as a single value in milliseconds. A larger value means the rhythm varied more overall within that window.

It is most often compared with a second time-domain metric — {{fact:hrv.rmssd.definition}} [S1]. The two answer different questions: RMSSD isolates the changes between adjacent beats, while SDNN summarizes the spread of the whole recording. That difference is the reason SDNN and RMSSD numbers cannot be compared directly — and the reason both metrics exist. The [RMSSD page](/science/concepts/rmssd) covers the beat-to-beat side of the pair; this page is about the spread.

## How does SDNN work?

SDNN is a window statistic: whatever moves the heart's rhythm during the recording contributes to it. In a brief resting recording, the dominant contribution is the breathing-linked rise and fall of heart rate — respiratory sinus arrhythmia — so slow, calm breathing during a measurement visibly raises the value [S2]. In longer recordings, slower rhythms join in: changing workloads, conditioned responses and the sleep-wake cycle each add their own contribution to the spread [S2].

Because so many influences pool into one number, SDNN does not separate the two branches of the autonomic nervous system — both contribute [S2]. That is also why it cannot be read as a direct readout of either branch. The framing matters. {{fact:claim.vagalTone}} [S2, S7]. RMSSD, being built from differences between adjacent beats, leans more on the fast parasympathetic pathway than SDNN does [S2] — one reason the two metrics can tell different stories about the same recording.

The long version of the metric has a clinical history: computed over all-day hospital ECG recordings in cardiology patients, SDNN is a risk-stratification measure [S2]. That evidence belongs to a measurement regime — continuous clinical ECG in patient populations — that a consumer watch does not reproduce, so it should not be projected onto a nightly watch value.

## How is SDNN measured?

The computation is simple: take the intervals between normal heartbeats within the recording window and compute their standard deviation [S1, S2]. Everything SDNN knows comes from the accuracy of those intervals — which is why the recording method matters more than the arithmetic.

The reference method is an ECG, which detects the electrical signature of each heartbeat. Wearables instead estimate the intervals from the pulse signal at the skin (photoplethysmography, PPG); the result is often called pulse rate variability. Agreement between the two is metric-dependent and condition-dependent — generally closer at rest with a good signal, weaker with movement or poor contact [S5, S6] — and the pooled evidence so far does not extend to sleep or free-living settings [S5].

The length of the recording is part of the meaning of the value. A brief lab recording, an all-day Holter ECG and a watch's stored samples are three different measurement regimes: SDNN grows with recording length, and values across such regimes are not interchangeable [S2]. Published norms for all-day, short-term and ultra-short-term recordings are treated as separate worlds for the same reason [S2].

This is where Apple enters the picture. One practical consequence for Apple Watch users: {{fact:applewatch.hrv.healthkit}} [S8]. The choice is a design decision, not a scientific verdict about which metric is better: SDNN is the computation HealthKit has always used, described in the documentation as the standard deviation of the inter-beat intervals between normal heartbeats, recorded automatically by the watch [S8]. On recent hardware, {{fact:applewatch.hrv.variants2026}} [S9]. Apple has not stated how Recovery HRV is computed. Separately, {{fact:applewatch.hrv.rmssdType}} [S10], which lets apps read an RMSSD-type value from Apple Health instead — a step toward cleaner cross-device comparison, though the values already collected remain SDNN.

For practical placement: the [HRV calculator](/tools/hrv) has an SDNN mode built for numbers that come from Apple Watch; the everyday story of why devices disagree lives in [why your HRV is different on every device](/articles/hrv-different-every-device); and for keeping your own readings comparable, see [how to measure HRV consistently](/articles/how-to-measure-hrv-consistently).

## What affects SDNN?

- Recording length. The defining factor for this metric: longer windows accumulate slower rhythms and larger values, so a short reading and an all-day recording describe different worlds [S2].
- Recording conditions. The length of the recording, the setting — laboratory or real life — breathing and the analysis method all shape the value and the rigor of any comparison [S7].
- Age. On average, heart-rate variability diminishes with age in healthy adults [S4]; individuals vary widely, and population averages are not personal targets. Age-band tables live in the [HRV calculator](/tools/hrv) for Apple Watch SDNN values and in the [normal HRV by age](/articles/normal-hrv-by-age) article for night-time RMSSD.
- Breathing. Breathing rate and depth during the recording change the value, through the breathing-linked oscillation they write into the rhythm [S2].
- Signal quality. Missed or false beats distort the value, and abnormal beats can masquerade as variability [S2].
- Everyday conditions. As with other HRV metrics, a single reading can deviate for ordinary reasons; treat such shifts as observations, not verdicts.

## What does the evidence show?

Established. The definition, computation and overall-variability role of SDNN come from the field's measurement standards [S1] and methodological reviews [S2, S3]. Its dependence on recording length is a core methodological property, not a nuance [S2]. In clinical cardiology, all-day SDNN from continuous ECG is an established risk-stratification measure in patient populations [S2]. On average, values decline with age in healthy adults, with wide individual variation [S4].

Context-dependent. Wearable estimates: PPG-derived values can track ECG-derived HRV closely under controlled resting conditions, but agreement weakens with movement and poor signal, and pooled estimates do not generalize to sleep or free-living settings [S5, S6]. Apple's ecosystem stores HRV as SDNN — a device fact with its own scope, not a health claim [S8, S9, S10].

Methodological guidance. Current guidelines recommend consistent recording conditions and cautious, contextualized interpretation of single values, including from wearables [S7]. That is expert consensus about how to measure and interpret — not direct experimental data about SDNN itself.

What remains uncertain: how closely consumer night-time SDNN-type values track ECG-derived SDNN across everyday conditions — movement, skin tone, sensor fit, sleep stages — is still being mapped [S5, S6]. And how much of the clinical all-day evidence, built on continuous ECG in patients, transfers to overnight watch values in healthy users is an open question [S7].

## What SDNN does not tell you

- It is not interchangeable with RMSSD. The two metrics summarize different properties of the same recording, and their values belong to different recording regimes; a watch SDNN and a ring RMSSD are not two dialects of one number [S2, S5].
- It is not a vagal-tone meter. {{fact:claim.vagalTone}} [S2, S7]. SDNN leans even less on the fast parasympathetic pathway than RMSSD does [S2].
- It is not a diagnosis or a stress reading. {{fact:claim.hrvNotStress}} [S1].
- Higher is not automatically better. A larger spread can come from a stronger rhythm — or from abnormal beats and noise, which masquerade as variability and inflate the number [S2].
- Values are not interchangeable across devices, apps and measurement regimes [S5, S7].
- A single value says little. Methodological guidance treats single readings as context-dependent and recommends cautious, contextualized interpretation [S7]; your own recent readings under comparable conditions are the more informative comparison.

## In ONDA

ONDA's age-based HRV tables are night-time RMSSD tables, but the [HRV calculator](/tools/hrv) has a separate SDNN mode for numbers that come from Apple Watch, with bands from short resting ECG studies in healthy adults. The app's own nightly baseline is built on the HRV values stored in Apple Health — from Apple Watch or from another device that syncs heart data there. The documentation is plain about this: {{fact:applewatch.hrv.healthkit}} [S8] — so that baseline signal is SDNN-based rather than RMSSD-based. The live reading shown during a practice is a surrogate computed from the standard deviation of heart rate, not SDNN or RMSSD, and the phone camera gives pulse, not HRV. ONDA describes and compares your own numbers; it does not diagnose anything. See [what ONDA measures](/measurements).

> Educational information, not a diagnosis or medical treatment.