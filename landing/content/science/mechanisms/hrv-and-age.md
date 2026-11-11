---
kind: mechanisms
slug: hrv-and-age
title: "HRV and Age: Why Your Number Drifts Down Over the Years"
metaTitle: "HRV and Age: Why It Drifts Down"
metaDescription: "Why heart rate variability falls with age, why the pattern depends on the metric, and why your own baseline matters more than an age norm."
shortAnswer: >
  Heart rate variability falls with age in every large group of healthy people
  studied, from hospital recordings to millions of wrist trackers. How fast it
  falls depends on the metric. Published reference values differ widely between
  studies, so there is no single normal number for an age. A value below the
  average for your age is not a diagnosis; changes against your own baseline
  say more.
keyPoints:
  - "HRV declines with age in healthy people across all large datasets, with a pattern that depends on the metric."
  - "Measures of fast beat-to-beat change, such as RMSSD, fall faster in early adulthood and then level off, while overall variability falls more gradually."
  - "Differences between men and women are small and fade in older age groups."
  - "Reference values differ between studies, devices and recording lengths, so there is no universal norm."
  - "Large wrist-tracker data show the same decline with age, but these benchmarks come from one manufacturer's devices."
  - "A value below the average for your age is not a disease; compare it with your own baseline over time."
imageAlt: "Thin teal heart-rhythm lines stacked on a white background, lively at the top and calmer towards the bottom, showing how heart rhythm changes with age."
imagePrompt: "Minimal scientific illustration on a clean white background: a series of thin teal heart-rhythm lines stacked from top to bottom, the upper ones with lively variation and the lower ones gradually calmer and smoother, soft cyan glow, lots of empty space, no text, no numbers, no people, no devices, light and calm, landscape."
image: /images/science/mechanisms-hrv-and-age.jpg
editor: "Yakiv Bilenko"
reviewer: null
lastReviewed: null
related:
  glossary: [heart-rate-variability]
  articles: [normal-hrv-by-age, your-baseline-knows-first]
  tools: [baseline]
  science: [concepts/interpreting-hrv, concepts/rmssd, concepts/sdnn, concepts/hrv-baseline, measurements/heart-rate-variability, mechanisms/exercise-and-hrv, questions/why-is-my-hrv-low]
sources:
  - id: S1
    cite: "Umetani et al. (1998)"
    title: "Twenty-four hour time domain heart rate variability and heart rate: relations to age and gender over nine decades"
    journal: "Journal of the American College of Cardiology"
    year: 1998
    doi: "10.1016/s0735-1097(97)00554-8"
    pmid: 9502641
    type: observational
    note: "one co-author is affiliated with the HeartMath Institute"
  - id: S2
    cite: "Nunan, Sandercock & Brodie (2010)"
    title: "A quantitative systematic review of normal values for short-term heart rate variability in healthy adults"
    journal: "Pacing and Clinical Electrophysiology"
    year: 2010
    doi: "10.1111/j.1540-8159.2010.02841.x"
    pmid: 20663071
    type: systematic-review
  - id: S3
    cite: "Voss et al. (2015)"
    title: "Short-term heart rate variability—influence of gender and age in healthy subjects"
    journal: "PLOS ONE"
    year: 2015
    doi: "10.1371/journal.pone.0118308"
    pmid: 25822720
    type: observational
  - id: S4
    cite: "Sammito & Böckelmann (2016)"
    title: "Reference values for time- and frequency-domain heart rate variability measures"
    journal: "Heart Rhythm"
    year: 2016
    doi: "10.1016/j.hrthm.2016.02.006"
    pmid: 26883166
    type: observational
  - id: S5
    cite: "van den Berg et al. (2018)"
    title: "Normal Values of Corrected Heart-Rate Variability in 10-Second Electrocardiograms for All Ages"
    journal: "Frontiers in Physiology"
    year: 2018
    doi: "10.3389/fphys.2018.00424"
    pmid: 29755366
    type: observational
  - id: S6
    cite: "Natarajan et al. (2020)"
    title: "Heart rate variability with photoplethysmography in 8 million individuals: a cross-sectional study"
    journal: "The Lancet Digital Health"
    year: 2020
    doi: "10.1016/S2589-7500(20)30246-6"
    pmid: 33328029
    type: observational
    note: "funded by the wearable's manufacturer (Fitbit)"
  - id: S7
    cite: "Carnevali et al. (2025)"
    title: "Sex and age differences in the association between heart rate variability and cardiac chronotropy: A replication-extension study"
    journal: "Physiological Reports"
    year: 2025
    doi: "10.14814/phy2.70399"
    pmid: 40495293
    type: observational
  - id: S8
    cite: "Carter et al. (2026)"
    title: "Guidelines for rigor and reproducibility of heart rate variability within human cardiovascular research"
    journal: "Am J Physiol Heart Circ Physiol"
    year: 2026
    doi: "10.1152/ajpheart.00041.2026"
    pmid: 42495990
    type: guideline
  - id: S9
    cite: "ONDA — product documentation: How ONDA works"
    title: "How ONDA works"
    url: "https://onda-life.com/how-it-works"
    type: product-documentation
evidenceMap:
  - claim: "In healthy people, HRV declines with age on every time-domain measure, with a pattern that depends on the measure."
    sources: [S1]
    class: established
    claimType: physiology
    quote: "Using all measures, HRV of healthy subjects declines with aging, with measure-dependent patterns."
    limitation: "Small sample per decade in an older Holter study; the decline itself is repeated in every large dataset."
  - claim: "RMSSD and pNN50 fall fastest and then level off by middle age, while SDNN and SDANN fall only very gradually."
    sources: [S1]
    class: context-dependent
    claimType: physiology
    quote: "Using pNN50 and rMSSD, HRV decreased most rapidly"
    limitation: "Cross-sectional comparison of age groups, not the same people followed over time."
  - claim: "Sex differences in HRV are seen in younger adults but shrink with age and disappear in older age groups."
    sources: [S1, S3]
    class: context-dependent
    claimType: physiology
    quote: "The gender differences disappeared within the last two age decades and the age dependencies disappeared in the last decade."
    limitation: "Differences vary by metric and cohort; group averages, not individual expectations."
  - claim: "Short-term HRV values reported in the literature are lower than the Task Force norms, and values vary widely between people."
    sources: [S2]
    class: established
    claimType: measurement
    quote: "Values for short-term HRV measures from the literature were lower than Task Force norms."
    limitation: "Systematic review of studies with differing methods; methodological differences explain part of the spread."
  - claim: "Reference values for day-long recordings by sex and age group differed considerably from the values published by the Task Force."
    sources: [S4]
    class: context-dependent
    claimType: measurement
    quote: "The reference values differed considerably from the values published in 1996 in the Guidelines of the Task Force"
    limitation: "Volunteer sample covering ages twenty to sixty only; Holter recordings, not wearables."
  - claim: "Before such reference values existed, HRV findings could only be compared within a group or within the same person over time."
    sources: [S4]
    class: context-dependent
    claimType: measurement
    quote: "Because there are no appropriate reference values available, HRV findings can still only be compared within a group or in individuals in longitudinal studies."
    limitation: "Authors' framing of the field; still applies to devices without validated norms."
  - claim: "In heart-rate-corrected ten-second ECG data from birth to old age, the median and lower limit of normal decreased steadily with age."
    sources: [S5]
    class: established
    claimType: physiology
    quote: "For both SDNNc and RMSSDc, the median and the lower limit of normal decreased steadily from birth until old age."
    limitation: "Very short clinical ECGs from Dutch cohorts; corrected values are not comparable with wearable readings."
  - claim: "In data from millions of wrist trackers, HRV metrics decrease with age."
    sources: [S6]
    class: established
    claimType: device
    quote: "HRV metrics decrease with age, and parasympathetic function declines faster than sympathetic function."
    limitation: "One manufacturer's devices and algorithm, funded by that manufacturer; cross-sectional; its LF and HF interpretation is the authors' own."
  - claim: "The authors of the wrist-tracker study suggest population distributions of HRV can serve as a framework for individual interpretation."
    sources: [S6]
    class: emerging
    claimType: device
    quote: "Empirical distributions of heart rate variability can potentially be used as a framework for individual-level interpretation."
    limitation: "Benchmarks apply to that device and time of day; other devices and algorithms give different values."
  - claim: "The link between vagally mediated HRV and resting heart rate depends on sex and age, and hormone replacement therapy showed no effect on it in a small subgroup."
    sources: [S7]
    class: emerging
    claimType: physiology
    quote: "no effects of hormone replacement therapy in post-menopausal women"
    limitation: "One study with a very small hormone therapy subgroup; does not apply to other health outcomes."
  - claim: "Recording length, setting, breathing and analysis method all affect HRV values, so values from different methods are not interchangeable."
    sources: [S8]
    class: guideline
    claimType: measurement
    quote: "the HRV input signal (e.g., electrocardiography vs. photoplethysmography), length of recording, location of recordings (i.e., laboratory vs. field), respiratory rate and depth, and analytical approaches (i.e., time vs. frequency domain) can all impact rigor, reliability, and study interpretations"
    limitation: "Methodological guideline (expert consensus) for research recordings."
  - claim: "A single low HRV reading does not by itself mean a person is stressed or unwell; HRV is not a specific marker of a state (fact claim.hrvNotStress)."
    sources: [S8]
    class: guideline
    claimType: other
    quote: "HRV has some utility as a cardiovascular risk stratification tool but is not appropriate to employ as a specific marker of cardiac sympathetic outflow or sympathovagal balance."
    limitation: "Methodological guideline (expert consensus), not a study of ageing."
  - claim: "ONDA builds a personal baseline from values in Apple Health and compares new values with the user's own corridor (facts baseline.window, baseline.compare)."
    sources: [S9]
    class: established
    claimType: device
    quote: "From values in Apple Health — HRV, resting heart rate and breathing rate — ONDA builds your personal baseline"
    limitation: "Describes how the app works only; not evidence for any health claim."
---

## How does HRV change with age?

[Heart rate variability](/glossary/heart-rate-variability) (HRV) is the natural variation in time between heartbeats. One of the most consistent findings in HRV research is that it falls with age. It does so in healthy people, in day-long hospital recordings, in short clinical ECGs and in data from millions of wrist trackers [S1, S5, S6]. If your HRV is lower than it was ten years ago, that alone is expected.

This page explains how age changes HRV and how to read that change. It does not give age norms; average values by age are collected in the article on [normal HRV by age](/articles/normal-hrv-by-age).

## How does it work?

HRV reflects how the autonomic nervous system adjusts the heart from beat to beat. Measures of fast beat-to-beat change, such as [RMSSD](/science/concepts/rmssd), are read as reflecting vagally mediated changes. With age, the heart and its nervous control change, and the variability shrinks.

The decline does not follow one curve. In a study covering nine decades, RMSSD and similar measures fell fastest and then levelled off by middle age, while [SDNN](/science/concepts/sdnn) fell more gradually [S1]. The relationship between HRV and resting heart rate also changes: in one study it was weaker in older adults than in younger ones, and it differed between men and women [S7]. So the same number can mean different things at different ages.

## How is it measured?

Studies of age use very different recordings: a full day with a Holter monitor [S1, S4], five minutes at rest [S3], ten seconds of a standard ECG [S5] or wrist-tracker data at a fixed hour of the morning [S6]. Each gives different values for the same person. Recording length, setting, breathing and analysis all affect HRV, which is why values from different methods are not interchangeable [S8].

That is also why a "normal" value depends on where it comes from. A review of short-term studies found values lower than the old Task Force norms and large differences between people [S2]. A study of day-long recordings reached reference values that differed considerably from the same Task Force figures [S4].

## What affects it?

Age is one factor among many. Fitness and daily activity, sleep, illness, alcohol, medication, breathing and the time of day all change HRV [S6, S8]. In the wrist-tracker data, more daily steps went with higher HRV at every age, but this was a cross-sectional comparison, not proof that activity reverses ageing [S6]. Other everyday factors are explained in [Why is my HRV low?](/science/questions/why-is-my-hrv-low)

## What does the evidence show?

**Decline with age: established.** HRV falls with age in healthy people on every time-domain measure, with a pattern that depends on the measure [S1]. Large clinical datasets from birth to old age show the median and the lower limit of normal falling steadily [S5], and data from millions of wrist trackers show the same decline [S6].

**Pattern by metric: context-dependent.** RMSSD and similar measures fall fastest and then level off, while SDNN falls more slowly [S1]. Which metric your device shows changes how steep the drop looks.

**Men and women: context-dependent.** Differences between the sexes appear in younger adults but shrink with age and disappear in older age groups [S1, S3].

**Reference values: context-dependent.** Published values differ between studies, devices and recording lengths, and several differ considerably from the older Task Force norms [S2, S4]. Without matching reference values, HRV can best be compared within the same person over time [S4].

**Wearable benchmarks: emerging.** The largest wrist-tracker study published benchmark tables by age and sex and suggests using them for individual interpretation [S6]. They come from one manufacturer's devices and algorithm, and they do not transfer to other devices.

**Hormone therapy: emerging.** In a small subgroup of post-menopausal women, hormone replacement therapy did not change how HRV related to resting heart rate [S7].

**Unknown.** How much of the decline in one person comes from ageing itself and how much from changes in fitness, sleep and health, and whether wearable values from different brands age in the same way.

## What it does not tell you

- **Not a diagnosis.** A value below the average for your age is not a disease; healthy people span a wide range [S2]. {{fact:claim.hrvNotStress}} [S8].
- **Not comparable across devices.** An age average from one device or method does not apply to readings from another [S6, S8].
- **Not a "biological age" score.** Studies describe group averages by age; they do not turn your HRV into an age.
- **Not a reason to chase a younger number.** Associations with activity and fitness are not proof that a younger HRV can be restored.

## In ONDA

ONDA builds a personal baseline from the values stored in Apple Health [S9]. The window is {{fact:baseline.window}}, and {{fact:baseline.compare}}. A value outside your corridor describes a change in your own data, not its cause. A slow drift over the years is expected with age.

> Educational information, not a diagnosis or medical treatment.
