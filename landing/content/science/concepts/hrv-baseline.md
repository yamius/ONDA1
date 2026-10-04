---
kind: concepts
slug: hrv-baseline
title: "HRV Baseline: Why Your Own Normal Matters More Than Any Norm"
metaTitle: "HRV Baseline: Your Own Normal, Not Any Norm"
metaDescription: "Your HRV baseline is your own typical range, not a population average. Why it beats age norms, how ONDA builds it, and what a shift can and cannot mean."
shortAnswer: >
  An HRV baseline is your personal typical level of heart rate variability and
  its normal spread, built from many readings taken under comparable conditions.
  It matters more than population tables because people differ widely, and
  devices, metrics and recording conditions are not interchangeable. A single
  reading outside your range is usually noise; a sustained shift over days or
  weeks is the informative signal. A baseline is not a diagnosis — it is a
  reference for noticing change.
keyPoints:
  - "An HRV baseline is your own typical HRV level and its normal spread, built from many readings — never from one."
  - "People of the same age differ so widely, and devices and metrics vary so much, that comparing your HRV with someone else's is close to meaningless."
  - "ONDA builds the baseline from a multi-night window of your own readings and compares each night with your personal corridor."
  - "One reading outside your corridor is usually noise; a sustained shift over days or weeks is what deserves attention."
  - "Unstable measurement conditions, illness, a training change, a new device or a different metric can move readings or break the baseline."
  - "Leaving the corridor does not mean you are stressed or ill, and staying inside it does not guarantee health."
  - "A baseline is a reference for noticing change, not a diagnosis or a medical assessment."
image: "/images/science/concepts-hrv-baseline.png"
imageAlt: "A row of nightly dots running along a narrow teal corridor inside a wider grey band, with a single dot dropping just outside — readings compared with your own normal range."
imagePrompt: "Minimal scientific illustration on a clean white background: a horizontal corridor formed by two thin teal lines with a soft cyan glow, small teal dots scattered along it as nightly readings, one faint dot drifting just below the corridor, a subtle arrow suggesting the passage of time, lots of empty space, thin lines only, no text, no numbers, no people, no devices, light and calm, landscape."
editor: "Yakiv Bilenko"
reviewer: null
lastReviewed: null
related:
  glossary: [heart-rate-variability]
  articles: [your-baseline-knows-first, normal-hrv-by-age, how-to-measure-hrv-consistently]
  science: [concepts/heart-rate-variability, concepts/rmssd, concepts/sdnn, measurements/heart-rate-variability]
relatedPlanned: [concepts/interpreting-hrv, mechanisms/hrv-day-to-day]
sources:
  - id: S1
    cite: "Task Force of the ESC and NASPE (1996)"
    title: "Heart rate variability: standards of measurement, physiological interpretation and clinical use"
    journal: "Circulation"
    year: 1996
    doi: "10.1161/01.CIR.93.5.1043"
    type: guideline
  - id: S2
    cite: "Voss et al. (2015)"
    title: "Short-term heart rate variability — influence of gender and age in healthy subjects"
    journal: "PLOS ONE"
    year: 2015
    doi: "10.1371/journal.pone.0118308"
    type: observational
  - id: S3
    cite: "Nunan, Sandercock & Brodie (2010)"
    title: "A quantitative systematic review of normal values for short-term heart rate variability in healthy adults"
    journal: "Pacing Clin Electrophysiol"
    year: 2010
    doi: "10.1111/j.1540-8159.2010.02841.x"
    pmid: 20663071
    type: systematic-review
  - id: S4
    cite: "Laborde, Mosley & Thayer (2017)"
    title: "Heart rate variability and cardiac vagal tone in psychophysiological research — recommendations for experiment planning, data analysis, and data reporting"
    journal: "Frontiers in Psychology"
    year: 2017
    doi: "10.3389/fpsyg.2017.00213"
    pmid: 28265249
    type: review
  - id: S5
    cite: "Shaffer & Ginsberg (2017)"
    title: "An overview of heart rate variability metrics and norms"
    journal: "Frontiers in Public Health"
    year: 2017
    doi: "10.3389/fpubh.2017.00258"
    type: review
  - id: S6
    cite: "Carter et al. (2026)"
    title: "Guidelines for rigor and reproducibility of heart rate variability within human cardiovascular research"
    journal: "Am J Physiol Heart Circ Physiol"
    year: 2026
    doi: "10.1152/ajpheart.00041.2026"
    pmid: 42495990
    type: guideline
  - id: S7
    cite: "Xu et al. (2026)"
    title: "Accuracy of photoplethysmography-derived pulse rate variability compared with electrocardiography-derived heart rate variability: a systematic review and meta-analysis"
    journal: "Sensors"
    year: 2026
    doi: "10.3390/s26165192"
    pmid: 42655500
    type: meta-analysis
  - id: S8
    cite: "Zuern et al. (2026)"
    title: "Validation of photoplethysmography-derived short-term heart rate variability using a wearable device"
    journal: "Scientific Reports"
    year: 2026
    doi: "10.1038/s41598-026-52700-7"
    pmid: 42151374
    type: observational
  - id: S9
    cite: "ONDA — product documentation: What ONDA measures"
    title: "What ONDA measures and how it reads your signals"
    url: "https://onda-life.com/measurements"
    type: product-documentation
  - id: S10
    cite: "Esco, Fields, Mohammadnabi & Kliszczewicz (2026)"
    title: "Monitoring training adaptation and recovery status in athletes using heart rate variability via mobile devices: a narrative review"
    journal: "Sensors"
    year: 2026
    doi: "10.3390/s26010003"
    pmid: 41516438
    type: review
  - id: S11
    cite: "Kristiansen, Olsen, Skotte & Garde (2009)"
    title: "Reproducibility and seasonal variation of ambulatory short-term heart rate variability in healthy subjects during a self-selected rest period and during sleep"
    journal: "Scand J Clin Lab Invest"
    year: 2009
    doi: "10.3109/00365510902946984"
    pmid: 19424916
    type: observational
evidenceMap:
  - claim: "A personal baseline needs many readings; isolated recordings do not establish one."
    sources: [S10]
    class: established
    claimType: measurement
    quote: "isolated recordings do not account for baseline HRV, which requires frequent measurements over at least a week to establish"
    limitation: "Narrative review of athlete monitoring; the principle is general, but the specific protocols target sport practice."
  - claim: "Monitoring practice summarizes repeated readings as rolling weekly means together with a measure of spread such as the coefficient of variation."
    sources: [S10]
    class: context-dependent
    claimType: measurement
    quote: "Thus, tracking HRV trends, particularly through weekly mean values and the coefficient of variation (CV), provides insight into both adaptation and recovery"
    limitation: "Practice from sports monitoring; window lengths and metrics vary between protocols."
  - claim: "Reading your own HRV against your own baseline is more informative than comparing yourself with other people."
    sources: [S10]
    class: context-dependent
    claimType: other
    quote: "a lower HRV compared to a peer does not necessarily indicate poorer physiological status"
    limitation: "Narrative review in athletic populations; not a clinical guideline."
  - claim: "Even within one age band, healthy adults differ enormously in HRV."
    sources: [S3, S2]
    class: established
    claimType: measurement
    quote: "A number of studies demonstrate large interindividual variations (up to 260,000%), particularly for spectral measures."
    limitation: "Reported for short-term daytime protocols and spectral measures; night-time wearable values are a different context."
  - claim: "There are currently no agreed normative values for short-term HRV."
    sources: [S3]
    class: established
    claimType: other
    quote: "There are currently no normative data for short-term measures of HRV."
    limitation: "Review of short-term measures; age-band tables published since remain pooled group data, not personal norms."
  - claim: "On average HRV falls with age, while individuals vary widely at every age (fact hrv.age.trend)."
    sources: [S2]
    class: established
    claimType: physiology
    quote: "These findings, as expected, reveal a considerably diminished HRV in the older age groups regardless of female or male gender."
    limitation: "Cross-sectional group averages from short-term daytime ECG; not individual predictions."
  - claim: "Values from different devices, metrics or recording conditions are not interchangeable."
    sources: [S6, S7]
    class: established
    claimType: measurement
    quote: "the HRV input signal (e.g., electrocardiography vs. photoplethysmography), length of recording, location of recordings (i.e., laboratory vs. field), respiratory rate and depth, and analytical approaches (i.e., time vs. frequency domain) can all impact rigor, reliability, and study interpretations"
    limitation: "Methodological guideline and pooled PPG evidence; agreement depends on metric, device and condition."
  - claim: "RMSSD and SDNN summarize different aspects of the heart's rhythm, so a baseline built on one metric does not transfer to the other."
    sources: [S5]
    class: context-dependent
    claimType: definition
    quote: "The RMSSD is more influenced by the PNS than SDNN."
    limitation: "Metric properties, not a baseline study; the practical rule follows from non-interchangeability."
  - claim: "Recording length changes HRV values, so values from recordings of different lengths cannot be compared directly."
    sources: [S5]
    class: established
    claimType: measurement
    quote: "Since longer recordings are associated with increased HRV, it is inappropriate to compare metrics like SDNN when they are calculated from epochs of different length."
    limitation: "General property of HRV metrics; applies across devices and settings."
  - claim: "Wrist-based PPG can track ECG-derived HRV under controlled resting conditions."
    sources: [S8]
    class: context-dependent
    claimType: measurement
    quote: "Under controlled resting conditions, wrist-based PPG provides reliable HRV indices compared with ECG-derived HRV."
    limitation: "Validation of one wearable under controlled conditions; agreement weakens with movement and poor signal."
  - claim: "Pooled PPG-versus-ECG estimates should not be generalized beyond the resting, controlled conditions they were measured in."
    sources: [S7]
    class: context-dependent
    claimType: measurement
    quote: "Because the quantitative synthesis included only 10 studies and was based predominantly on selected resting or controlled conditions, the pooled estimates should not be generalized to sleep, exercise, stress, or free-living settings or interpreted as evidence of interchangeability."
    limitation: "Small pooled evidence base; estimates are bound to the conditions they were measured in."
  - claim: "Numerous experimental, demographic and environmental factors influence HRV assessment and its reliability."
    sources: [S6]
    class: established
    claimType: measurement
    quote: "Numerous experimental, demographic, and environmental factors influence HRV assessment, interpretation, and reliability."
    limitation: "Research-rigour guideline; the direction and size of personal shifts vary by person and factor."
  - claim: "A weak seasonal variation has been reported in some short-term HRV measures of healthy subjects; it did not affect within-subject variability."
    sources: [S11]
    class: context-dependent
    claimType: measurement
    quote: "A weak, but significant, seasonal variation was found for ln (TP) (p = 0.05), ln (LFP) (p<0.05) and the respiratory frequency (p<0.01), but the seasonal variation did not affect the within-subject CV."
    limitation: "One study in healthy adults with ambulatory short-term recordings; effects were small and partly in spectral measures."
  - claim: "HRV findings are easy to over-interpret without methodological context."
    sources: [S4]
    class: context-dependent
    claimType: other
    quote: "This ease of access should not obscure the difficulty of interpretation of HRV findings that can be easily misconstrued"
    limitation: "Methods review addressed to researchers; its caution applies equally to self-tracking."
  - claim: "HRV is a research risk-stratification tool, not a specific marker of sympathetic outflow or sympathovagal balance."
    sources: [S1]
    class: established
    claimType: other
    quote: "HRV has some utility as a cardiovascular risk stratification tool but is not appropriate to employ as a specific marker of cardiac sympathetic outflow or sympathovagal balance."
    limitation: "Classic guideline statement about population research use, not personal diagnosis."
  - claim: "ONDA builds the personal baseline from the user's own HRV readings aggregated over days and weeks (facts baseline.window, baseline.minNights)."
    sources: [S9]
    class: context-dependent
    claimType: device
    quote: "Your own HRV readings aggregated over days and weeks"
    limitation: "Product documentation; describes what the app does, not clinical validity."
  - claim: "The long-term signal ONDA reports is the personal baseline and its direction over time (fact baseline.corridor context)."
    sources: [S9]
    class: context-dependent
    claimType: device
    quote: "Your personal baseline and its direction over time — the long-term signal ONDA is designed to move."
    limitation: "Product documentation about the app's readout, not a clinical measure."
  - claim: "ONDA reads heart-rate variability (SDNN) from Apple Health, written there by an Apple Watch or another device that syncs heart data."
    sources: [S9]
    class: context-dependent
    claimType: device
    quote: "ONDA measures heart rate via an Apple Watch, Apple Health or the iPhone camera (PPG) at rest, and reads heart-rate variability (HRV, SDNN) from Apple Health — written there by an Apple Watch or by another device that syncs heart data to Apple Health."
    limitation: "Product documentation; scoped to Apple Health as the data source."
  - claim: "ONDA's signals are descriptive comparisons with the personal baseline — not measurements of stress and not a medical assessment."
    sources: [S9]
    class: context-dependent
    claimType: device
    quote: "ONDA’s signals are descriptive comparisons with your own baseline — interpretations to guide practice, not measurements of stress and not a medical assessment."
    limitation: "Product documentation scope statement; descriptive comparisons only."
---

## What is an HRV baseline?

An HRV baseline is your personal typical level of [heart rate variability](/glossary/heart-rate-variability) — the average your own readings settle around — together with the natural spread around that average. It is built from many readings taken under comparable conditions, never from one. A baseline answers a single question: what is normal *for you*, so that every new reading can be compared with your own corridor rather than with a stranger's number.

The contrast with population tables is the whole point. A systematic review of published normal values concluded there are currently no agreed normative data for short-term HRV, and reported large interindividual variations between studies and people [S3]. Age narrows the picture only slightly: {{fact:hrv.age.trend}} [S2] — and individuals vary widely at every age. The age tables ONDA publishes answer "where do people my age sit", never "what should my number be"; they live in the [normal HRV by age](/articles/normal-hrv-by-age) article and the [HRV calculator](/tools/hrv) tool.

## How does it work?

The logic is smoothing. Any single reading carries noise from everything that happened that night — position, sleep stage boundaries, a late meal, signal quality. Averaging many readings flattens that noise, and the spread of those readings tells you how wide your personal corridor is. This is why research monitoring practice treats frequent recordings, summarized as rolling means with a measure of spread, as more informative than isolated assessments [S10]. A baseline needs frequent measurements over a period of at least a week; isolated recordings cannot substitute for one [S10].

Noise and change look different. One reading outside the corridor is usually noise: the corridor itself was built from readings that scattered. A sustained shift — the average of recent readings moving clearly and staying moved over days or weeks — is the pattern that deserves attention. Comparing yourself with other people is the weakest of the three comparisons: in athletic monitoring, a lower value than a peer's does not necessarily indicate a poorer physiological state [S10]. What a single low or high reading means on its own is a separate, practical question, planned as its own concept page and covered in practical terms in [what to do after a low HRV reading](/articles/what-to-do-after-low-hrv-reading); here the corridor, not the single value, carries the meaning.

## How is it measured?

What feeds a baseline matters as much as the arithmetic. The readings should come from the same device, the same metric, and comparable conditions — the practical routine for that is described in [how to measure HRV consistently](/articles/how-to-measure-hrv-consistently). The measurement context is part of the data: the input signal, the length of the recording, the setting, breathing, and the analysis method all shape the value, which is why values from different devices, metrics or conditions are not interchangeable [S6, S7].

The metric must stay fixed. RMSSD and SDNN summarize different aspects of the heart's rhythm — see the [RMSSD](/science/concepts/rmssd) and [SDNN](/science/concepts/sdnn) concept pages — so a corridor built on one metric does not transfer to the other [S5]. Recording length matters too: longer recordings are associated with larger values, so readings from recordings of different lengths cannot be compared directly [S5]. Wearables can earn their place in a baseline: under controlled resting conditions, wrist-based PPG has been shown to provide reliable HRV indices compared with ECG-derived HRV [S8] — but pooled estimates should not be generalized beyond the conditions they were measured in [S7].

## What affects it?

- **Unstable measurement conditions.** Posture, time of day, breathing, and signal quality all shape a reading; numerous experimental, demographic and environmental factors influence assessment and reliability [S6].
- **Everyday life.** Many ordinary factors can move single nights and with them the recent average; numerous factors influence how a reading comes out, and only context separates a meaningful shift from an ordinary one [S6].
- **A change in training.** In sports monitoring, acute changes are read against the athlete's individual baseline precisely because the baseline, not the calendar, defines what counts as unusual [S10].
- **Season.** One study reported a weak seasonal variation in some short-term HRV measures of healthy subjects, which did not affect how much each person's readings varied [S11] — a small effect, not something that moves a baseline on its own, and not a reason to ignore a real shift.
- **A new device, metric or routine.** Any lasting change of device, metric, or measurement routine breaks comparability [S5, S7]. When one of these changes, the baseline should be rebuilt from the new data rather than mixed with the old.

## What does the evidence show?

**Established.** Healthy adults differ enormously in HRV, and no agreed normative values exist for short-term measures [S3]. On average the value falls with age, while individuals vary widely at every age [S2]. Values from different devices, metrics and recording conditions are not interchangeable [S6, S7], and recordings of different lengths cannot be compared directly [S5]. A personal baseline needs many readings; isolated recordings do not establish one [S10].

**Context-dependent.** The specific monitoring practice of rolling weekly means with the coefficient of variation comes from sports science, where a lower value than a peer's does not necessarily indicate a poorer physiological state [S10]. Wrist PPG tracks ECG-derived values under controlled resting conditions [S8]. Seasonal variation, where reported, is weak [S11]. And because HRV findings are easy to over-interpret, methodology reviews warn against reading too much into them [S4].

**Not settled.** The exact window a baseline should use is a practical choice, not a scientific constant: research protocols differ from app logic. ONDA's windows are app logic — documented below, defined once, and not a consensus of the field [S9].

## What it does not tell you

A baseline is a reference for noticing change, not a verdict. Leaving the corridor does not mean you are stressed or unwell: {{fact:claim.hrvNotStress}} [S1]. An exit may be connected with a short night, a fever, a heavy session or a measurement quirk — and only context tells them apart. The reverse holds too: staying inside the corridor guarantees nothing about health, because HRV is a research risk-stratification tool, not a specific marker of sympathetic outflow or sympathovagal balance [S1].

Interpretation is genuinely hard — a methods review warns that the ease of access to HRV data should not obscure how easily findings can be misconstrued [S4]. ONDA's signals are built with that boundary in mind: they are descriptive comparisons with your own baseline, not measurements of stress and not a medical assessment [S9]. What to do about a specific low reading is covered in [what to do after a low HRV reading](/articles/what-to-do-after-low-hrv-reading). Persistent symptoms — chest pain, breathlessness, fainting — belong with a doctor, not with a corridor.

## In ONDA

ONDA builds the baseline exactly as this page describes, and the windows are defined once, here:

- **The baseline window.** The personal baseline for HRV, resting heart rate and breathing rate is built over {{fact:baseline.window}} of your own readings.
- **The minimum.** At least {{fact:baseline.minNights}} with valid data must be there before any signal is read at all.
- **The comparison.** {{fact:baseline.compare}}.
- **The corridor window.** The traffic-light corridor is computed over {{fact:baseline.corridor}}.
- **The metric.** The baseline reads the HRV values stored in Apple Health — from Apple Watch or another device that syncs heart data there [S9] — and {{fact:applewatch.hrv.healthkit}}.

The app does not diagnose, treat or monitor any medical condition and is not a substitute for medical care [S9]. The stories live in the articles — [your baseline knows first](/articles/your-baseline-knows-first) and [what your Apple Watch records](/articles/what-your-apple-watch-records) — and the counting lives in the [baseline tool](/tools/baseline) and the [HRV calculator](/tools/hrv).

> Educational information, not a diagnosis or medical treatment.