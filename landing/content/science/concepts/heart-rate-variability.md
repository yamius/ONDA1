---
kind: concepts
slug: heart-rate-variability
title: "Heart Rate Variability: What It Is, What It Reflects, What It Isn't"
metaTitle: "Heart Rate Variability: Definition and Evidence"
metaDescription: "Heart rate variability is the natural beat-to-beat variation of the heart's rhythm. What shapes it, what it reflects, and what it does not tell you."
shortAnswer: >
  Heart rate variability (HRV) is the natural variation in the time between
  consecutive heartbeats. The autonomic nervous system continuously modulates
  the heart's rhythm, and breathing writes a visible wave into it. It is
  influenced by age, breathing, recording method and length, recording
  conditions and time of day. It does not by itself establish stress, health
  status or vagal tone, and a personal trend recorded consistently is more
  informative than a single number.
keyPoints:
  - "Heart rate variability is the beat-to-beat variation in the intervals between normal heartbeats, rather than the heart rate itself."
  - "Both branches of the autonomic nervous system, together with breathing, continuously modulate the heart's rhythm; HRV is the visible trace of that modulation."
  - "The main time-domain metrics, RMSSD and SDNN, summarize different properties of a recording, and their numbers are not interchangeable."
  - "Values depend on recording method, length, conditions, breathing and age, which is why numbers from different apps and regimes cannot be compared directly."
  - "HRV does not measure stress, vagal tone or health status, and a single low or high reading establishes nothing by itself."
  - "On average HRV falls with age while individuals vary widely; population averages are not personal targets."
  - "Your own trend, recorded consistently with the same method, is usually more informative than any single absolute value."
image: "/images/science/concepts-heart-rate-variability.png"
imageAlt: "A slow breathing wave above a row of heartbeats whose spacing tightens and widens along with it — the breath-linked rhythm behind heart rate variability."
imagePrompt: "Minimal scientific illustration on a clean white background: a single thin teal ECG-like heart-rhythm line running horizontally across the middle of the frame, the spacing between beats visibly uneven and the amplitude gently rising and falling along a slow, breathing-like wave so that the rhythm's variability itself is the one visual idea; thin strokes in a single teal accent with a soft cyan glow, at most a hint of one muted desaturated teal for depth, no axes, no frame, no grid, generous empty space above and below, abstract, schematic, precise, medically neutral, no text, no numbers, no labels, no logos, no people, no faces, no hands, no devices, no watches, no rings, no phones, no dark background, no neon, no heavy gradients, no decorative particles, light and calm, 4:3."
editor: "Yakiv Bilenko"
reviewer: null
lastReviewed: null
related:
  glossary: [heart-rate-variability]
  articles: [normal-hrv-by-age, hrv-questions-answered]
  tools: [hrv]
  science: [concepts/rmssd, concepts/sdnn, measurements/heart-rate-variability]
relatedPlanned: [concepts/autonomic-nervous-system, concepts/vagus-nerve, concepts/respiratory-sinus-arrhythmia, concepts/hrv-baseline, mechanisms/breathing-and-hrv, evidence/hrv-biofeedback]
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
    cite: "Zuern et al. (2026)"
    title: "Validation of photoplethysmography-derived short-term heart rate variability using a wearable device"
    journal: "Scientific Reports"
    year: 2026
    doi: "10.1038/s41598-026-52700-7"
    pmid: 42151374
    type: observational
  - id: S4
    cite: "Carter et al. (2026)"
    title: "Guidelines for rigor and reproducibility of heart rate variability within human cardiovascular research"
    journal: "Am J Physiol Heart Circ Physiol"
    year: 2026
    doi: "10.1152/ajpheart.00041.2026"
    pmid: 42495990
    type: guideline
  - id: S5
    cite: "Voss et al. (2015)"
    title: "Short-term heart rate variability — influence of gender and age in healthy subjects"
    journal: "PLOS ONE"
    year: 2015
    doi: "10.1371/journal.pone.0118308"
    type: observational
  - id: S6
    cite: "Apple Inc. — HealthKit documentation"
    title: "heartRateVariabilitySDNN"
    url: "https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/heartratevariabilitysdnn"
    type: official
evidenceMap:
  - claim: "HRV consists of the changes in the time intervals between consecutive heartbeats — the interbeat intervals (fact used on this page as the core definition)."
    sources: [S1, S2]
    class: established
    claimType: definition
    quote: "Heart rate variability (HRV) consists of changes in the time intervals between consecutive heartbeats called interbeat intervals (IBIs)."
    limitation: "A descriptive definition of the signal; it says nothing about health status."
  - claim: "A healthy heart is not a metronome: the rhythm's oscillations are complex and constantly changing, and the variability itself is signal, not noise."
    sources: [S2]
    class: established
    claimType: physiology
    quote: "A healthy heart is not a metronome."
    limitation: "A framing observation from a methods review; complexity is not a health verdict in either direction."
  - claim: "One generator of short-term variation is the complex, dynamic relationship between the sympathetic and parasympathetic branches of the autonomic nervous system."
    sources: [S2]
    class: established
    claimType: physiology
    quote: "The first source is a complex and dynamic relationship between the sympathetic and parasympathetic branches."
    limitation: "A population-level mechanism description; the balance between the branches is not itself read out of any single HRV number."
  - claim: "Alongside the interplay of the two autonomic branches, short-term HRV is shaped by regulatory mechanisms: respiratory sinus arrhythmia, the baroreceptor reflex and rhythmic changes in vascular tone."
    sources: [S2]
    class: established
    claimType: physiology
    quote: "The second source includes the regulatory mechanisms that control HR via respiratory sinus arrhythmia (RSA), the baroreceptor reflex (negative-feedback control of BP), and rhythmic changes in vascular tone."
    limitation: "Population-level mechanism description; the mix of contributions shifts with conditions and recording length."
  - claim: "Respiratory sinus arrhythmia is the respiration-driven speeding and slowing of the heart."
    sources: [S2]
    class: established
    claimType: physiology
    quote: "RSA refers to the respiration-driven speeding and slowing of the heart via the vagus nerve"
    limitation: "A mechanism definition, not an outcome claim; the size of the effect depends on breathing rate and depth."
  - claim: "In short resting recordings, breathing-linked RSA is the primary source of the variation, which is why breathing rate and depth visibly move the reading."
    sources: [S2]
    class: established
    claimType: physiology
    quote: "In short-term resting recordings, the primary source of the variation is parasympathetically-mediated RSA, especially with slow, paced breathing (PB) protocols."
    limitation: "Applies to the recording window; it is a measurement observation, not evidence of a lasting change."
  - claim: "RMSSD is computed from the successive differences between adjacent normal heartbeats (fact hrv.rmssd.definition)."
    sources: [S1, S2]
    class: established
    claimType: definition
    quote: "The root mean square of successive differences between normal heartbeats (RMSSD) is obtained by first calculating each successive time difference between heartbeats in ms."
    limitation: "A definitional statement; which metric an app reports is a product choice."
  - claim: "RMSSD leans more on parasympathetic modulation than SDNN, one reason the two metrics can move differently."
    sources: [S2]
    class: established
    claimType: physiology
    quote: "The RMSSD is more influenced by the PNS than SDNN."
    limitation: "A relative statement between metrics, not a measure of parasympathetic activity in either."
  - claim: "SDNN is the standard deviation of the intervals between normal heartbeats across the recording window (fact hrv.sdnn.definition)."
    sources: [S1, S2]
    class: established
    claimType: definition
    quote: "The standard deviation of the IBI of normal sinus beats (SDNN) is measured in ms."
    limitation: "A definitional statement; says nothing about health outcomes by itself."
  - claim: "Values depend on the length of the recording: longer recordings accumulate slower rhythms and larger values, so numbers from different windows are not comparable."
    sources: [S1, S2]
    class: established
    claimType: measurement
    quote: "Since longer recordings are associated with increased HRV, it is inappropriate to compare metrics like SDNN when they are calculated from epochs of different length."
    limitation: "A methodological property of the metrics; it affects every comparison across apps, studies and protocols."
  - claim: "Published norms for all-day, short-term and ultra-short-term recordings are not interchangeable."
    sources: [S2]
    class: established
    claimType: measurement
    quote: "They caution that 24 h, short-term, and ultra-short-term normative values are not interchangeable."
    limitation: "About normative values in healthy and clinical populations; consumer night-time values are a further, different context."
  - claim: "Measurement context — recording period length, age and sex — shapes baseline values."
    sources: [S2]
    class: established
    claimType: measurement
    quote: "They stress the importance of measurement context, including recording period length, subject age, and sex, on baseline HRV values."
    limitation: "A population-level observation; it motivates consistent personal measurement, not any single correction factor."
  - claim: "Longer recordings absorb slower influences — changing workloads, conditioned responses, circadian processes — each adding to the value."
    sources: [S2]
    class: established
    claimType: measurement
    quote: "extended measurement periods can index the heart's response to changing workloads, anticipatory central nervous activity involving classical conditioning, and circadian processes, including sleep-wake cycles"
    limitation: "Explains why window and time of day matter, not what any single window says about a person."
  - claim: "The ECG is the reference method for interval measurement, while consumer wearables estimate the same quantities from the optical pulse signal."
    sources: [S3]
    class: established
    claimType: measurement
    quote: "While electrocardiography (ECG) remains the gold standard for HRV assessment, photoplethysmography (PPG)-based wearables offer an alternative for monitoring."
    limitation: "A statement about methods, not about any device's accuracy; the agreement evidence is the measurements page's question."
  - claim: "The input signal, the length of the recording, the setting, breathing and the analytical approach all affect the rigor, reliability and interpretation of an HRV measurement."
    sources: [S4]
    class: guideline
    claimType: measurement
    quote: "the HRV input signal (e.g., electrocardiography vs. photoplethysmography), length of recording, location of recordings (i.e., laboratory vs. field), respiratory rate and depth, and analytical approaches (i.e., time vs. frequency domain) can all impact rigor, reliability, and study interpretations"
    limitation: "Expert consensus about methods; the size of each effect is condition- and person-specific."
  - claim: "HRV findings — including those from wearables — should be interpreted and contextualized within the method's limitations."
    sources: [S4]
    class: guideline
    claimType: measurement
    quote: "Finally, with respect to the rapid advancements of HRV assessment using wearable technology, investigators should interpret and contextualize findings within the limitations outlined in this guideline review."
    limitation: "Interpretation guidance, not outcome data; the practical extension is comparing like with like."
  - claim: "HRV is not a direct readout of vagal tone or of sympathetic–parasympathetic balance (fact claim.vagalTone)."
    sources: [S1, S4]
    class: established
    claimType: physiology
    quote: "caution is necessary to avoid overinterpretation, particularly with respect to the concept of \"vagal tone.\""
    limitation: "Methodological caution from the standards and guideline literature; HRV reflects vagally mediated changes in heart rate, not the nerve's activity."
  - claim: "A single low or high value does not by itself establish stress, illness or health status (fact claim.hrvNotStress)."
    sources: [S1, S4]
    class: established
    claimType: other
    quote: "HRV has some utility as a cardiovascular risk stratification tool but is not appropriate to employ as a specific marker of cardiac sympathetic outflow or sympathovagal balance."
    limitation: "About interpretation, not measurement accuracy; persistent changes with concerning symptoms belong with a clinician."
  - claim: "Abnormal beats and noise can masquerade as variability and inflate the value — one reason higher is not automatically better."
    sources: [S2]
    class: established
    claimType: measurement
    quote: "Abnormal beats may reflect cardiac dysfunction or noise that masquerades as HRV."
    limitation: "A data-quality caution; artefact handling differs between devices and algorithms."
  - claim: "On average, heart-rate variability diminishes with age in healthy adults, while individuals vary widely (fact hrv.age.trend)."
    sources: [S5]
    class: established
    claimType: other
    quote: "autonomic activities diminish with age in both genders"
    limitation: "Cross-sectional population averages; wide individual variation at every age; this page carries no age tables."
  - claim: "In clinical cardiology, HRV computed from all-day ECG recordings is a risk-stratification measure in patient populations — a measurement regime consumer readings do not reproduce."
    sources: [S2]
    class: established
    claimType: other
    quote: "The SDNN is the \"gold standard\" for medical stratification of cardiac risk when recorded over a 24 h period."
    limitation: "Clinical populations with continuous hospital ECG; does not transfer to consumer watch values."
  - claim: "Apple Health records HRV as SDNN, computed as the standard deviation of the inter-beat intervals between normal heartbeats and recorded automatically by Apple Watch (fact applewatch.hrv.healthkit)."
    sources: [S6]
    class: established
    claimType: device
    quote: "While there are multiple ways of computing HRV, HealthKit uses SDNN heart rate variability, which uses the standard deviation of the inter-beat (RR) intervals between normal heartbeats (typically measured in milliseconds). The system automatically records samples on Apple Watch."
    limitation: "Official documentation; describes what the system records, not what the values mean for health; scoped to Apple's ecosystem."
---

## What is HRV?

Heart rate variability is the natural variation in the time between consecutive heartbeats. A healthy heart is not a metronome: the interval between one beat and the next is never exactly the same, and those small differences — the interbeat intervals — are what the term refers to [S1, S2]. It is a property of the heart's rhythm, not a heart rate: two people can share an average pulse and have completely different variability.

This page is the canonical definition the rest of the science section builds on. The two main metrics have their own pages — [RMSSD](/science/concepts/rmssd) and [SDNN](/science/concepts/sdnn); how closely smartwatches and rings can reproduce the ECG measurement is the question of [Can you trust HRV from a smartwatch or ring?](/science/measurements/heart-rate-variability); where your numbers sit by age belongs to the [normal HRV by age](/articles/normal-hrv-by-age) article and the [HRV calculator](/tools/hrv); and the everyday questions — what a low reading means, what to do about it — live in [HRV Questions, Answered](/articles/hrv-questions-answered). None of that is repeated here.

## How does HRV work?

Every heartbeat is triggered by the heart's own pacemaker, and the autonomic nervous system continuously adjusts the pace from beat to beat. Two overlapping processes generate the short-term variation: the dynamic relationship between the sympathetic and parasympathetic branches, and regulatory mechanisms that include the breathing-linked rhythm and the baroreflex [S2]. HRV is often described as a window onto autonomic regulation; the honest version is narrower — it is the visible trace of that regulation in the heart's rhythm, and the trace is not the machinery.

The most visible contributor in a short resting recording is respiratory sinus arrhythmia (RSA): the respiration-driven speeding and slowing of the heart, with each breath in briefly speeding the rhythm and each breath out slowing it [S2]. In brief resting recordings RSA is the primary source of the variation [S2] — which is why breathing rate and depth visibly move the number. The breathing-and-HRV mechanism has a dedicated page planned; the practical side of slow breathing lives in [how to raise HRV naturally](/articles/how-to-raise-hrv-naturally) and is not repeated here.

## How is HRV measured?

HRV is computed from a series of interbeat intervals, so everything starts with how those intervals are obtained. The reference method is an ECG, which times the heart's electrical activity directly; consumer wearables instead estimate the timing from the optical pulse signal at the skin [S3]. How closely that estimate tracks the ECG — where it agrees, where it degrades — is a measurement question in its own right, and it belongs to [the wearable HRV measurement page](/science/measurements/heart-rate-variability) rather than to this one.

The two metrics you will meet most often are time-domain statistics computed from those intervals. The beat-to-beat one is {{fact:hrv.rmssd.definition}} [S1]; it isolates the changes between adjacent heartbeats, leans more on the fast parasympathetic pathway [S2], and is the value most sleep and recovery apps report. Its usual companion, {{fact:hrv.sdnn.definition}} [S1], summarizes the overall spread across the recording window. Each has its own concept page — [RMSSD](/science/concepts/rmssd) and [SDNN](/science/concepts/sdnn) — with the definitions, the Apple Health specifics and the recording-length story. This page does not repeat them.

The window is part of the meaning. A brief lab recording, an all-day hospital ECG and a watch's overnight samples are different measurement regimes: values grow with recording length, and numbers across regimes are not interchangeable [S1, S2]. Published norms treat all-day, short-term and ultra-short-term values as separate worlds for the same reason [S2]. For keeping your own readings comparable, the practical guide is [how to measure HRV consistently](/articles/how-to-measure-hrv-consistently).

## What affects HRV?

- **Breathing.** Breathing rate and depth during the window write themselves into the value through the breathing-linked rhythm [S2], and current guidelines list respiration among the technical factors that shape rigor and reliability [S4].
- **Age.** On average, {{fact:hrv.age.trend}} [S5]; individuals vary widely, and population averages are not personal targets. Where your numbers sit by age is the [normal HRV by age](/articles/normal-hrv-by-age) article's question.
- **Recording length and time of day.** Longer recordings absorb slower rhythms and circadian processes, each adding to the value [S2]; a morning spot check and an overnight average describe different worlds.
- **Recording method.** An ECG and an optical pulse sensor are different measurement chains [S3]; numbers from the two are not automatically comparable.
- **Recording conditions.** The setting, body position, breathing and the analysis method all shape the value and the rigor of any comparison [S4].
- **Everyday conditions.** As with other HRV metrics, a single reading can deviate for ordinary reasons; treat such shifts as observations, not verdicts.

## What does the evidence show?

**Established.** The definition and the physiological origin of the signal come from the field's measurement standards [S1] and methodological reviews [S2]: HRV is generated by the interplay of the two autonomic branches with regulatory mechanisms, and RSA is the dominant source in short resting windows [S2]. The metric properties are equally settled — RMSSD and SDNN summarize different aspects of a recording, and values depend on recording length [S1, S2]. On average, values decline with age in healthy adults, with wide individual variation [S5]. In clinical cardiology, HRV computed from all-day ECG in patient populations is an established risk-stratification measure — a measurement regime a consumer watch does not reproduce [S2].

**Methodological guidance.** Current guidelines name the input signal, recording length, setting, breathing and analytical approach as factors that determine rigor and reliability [S4], and call for findings — including those from wearables — to be interpreted and contextualized within these limitations [S4]. That is expert consensus about how to measure and interpret, not direct experimental data about HRV itself.

**Context-dependent.** Consumer estimates from the pulse signal are a different measurement chain from the ECG reference [S3]; the agreement evidence, its conditions and its limits are covered on [the measurement page](/science/measurements/heart-rate-variability) rather than repeated here.

**Unknown.** What a specific absolute value means for a specific healthy person; how overnight consumer values map onto the clinical evidence base, which was built on continuous ECG in patients; and how much of a day-to-day shift reflects physiology versus measurement noise. These are open questions — reasons for measurement literacy, not for discarding the data.

## What HRV does not tell you

- **It is not heart rate.** The average pulse and the beat-to-beat variation are different properties of the same rhythm; a slower pulse does not by itself mean more variability [S1, S2].
- **It is not vagal tone.** The framing matters. {{fact:claim.vagalTone}} [S1, S4].
- **It is not a stress or health verdict.** {{fact:claim.hrvNotStress}} [S1, S4] — and the same caution bounds unusually high values.
- **Higher is not automatically better.** Abnormal beats and noise can masquerade as variability and inflate the number [S2]; higher values are generally associated with better recovery, with exceptions.
- **It is not one universal number.** Metrics, windows and methods differ; a value without its method, metric and window is incomplete information [S2, S3].
- **A single value says little.** Methodological guidance calls for cautious, contextualized interpretation [S4]; your own recent readings under comparable conditions are the more informative comparison.

## In ONDA

ONDA's nightly baseline is built on the HRV values written to Apple Health — from Apple Watch or any tracker whose app syncs heart data there. {{fact:applewatch.hrv.healthkit}} [S6], so that baseline signal is SDNN-based rather than RMSSD-based, and the app's night-by-night comparisons run against your own corridor rather than population targets. The live reading shown during a practice is a surrogate computed from the standard deviation of heart rate, not RMSSD or SDNN, and the phone camera gives pulse, not HRV. ONDA's use of the signal is biofeedback — observing what happens to your physiological signal while you practise — and the [HRV calculator](/tools/hrv) puts Apple Watch numbers in context. ONDA describes and compares your own numbers; it does not diagnose anything. See [what ONDA measures](/measurements).

> Educational information, not a diagnosis or medical treatment.