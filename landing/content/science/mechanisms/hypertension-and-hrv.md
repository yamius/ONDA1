---
kind: mechanisms
slug: hypertension-and-hrv
title: "High Blood Pressure and HRV: What Studies Show and What Exercise Does"
metaTitle: "High Blood Pressure and HRV"
metaDescription: "Why heart rate variability is often lower in high blood pressure, what exercise training does to it, and why HRV cannot replace a blood pressure cuff."
shortAnswer: >
  In a large population study, heart rate variability was lower in men and
  women with high blood pressure, and among men with normal blood pressure,
  lower HRV went with a higher chance of developing it. Young adults with a
  family history of high blood pressure also had lower HRV. In people with
  high blood pressure, exercise training raised vagal HRV measures and
  lowered resting blood pressure, most clearly aerobic training. HRV cannot
  measure blood pressure; only a cuff can.
keyPoints:
  - "In the Framingham Heart Study, HRV was lower in men and women with high blood pressure."
  - "Among men with normal blood pressure, lower HRV was linked with a greater risk of developing high blood pressure later; this was not seen in women."
  - "Young adults with a family history of high blood pressure had higher blood pressure and lower HRV than those without."
  - "A meta-analysis of randomized trials found that exercise training raised RMSSD and high-frequency HRV and lowered resting systolic blood pressure and heart rate in people with high blood pressure."
  - "Aerobic training improved more HRV measures than resistance training, and the authors favour supervised aerobic exercise."
  - "Better HRV numbers are a surrogate, not proof of fewer heart attacks or strokes."
  - "HRV does not measure blood pressure; ONDA reads HRV against your own baseline and does not assess blood pressure."
image: /images/science/mechanisms-hypertension-and-hrv.jpg
imageAlt: "A thin teal heart-rhythm line running through a soft, slightly tightened arc like a pressure curve, then easing back into gentle waves, on a white background."
imagePrompt: "Minimal scientific illustration on a clean white background: a thin teal heart-rhythm line running through a soft, slightly tightened arc like a pressure curve, then easing back into gentle waves, soft cyan glow, lots of empty space, no text, no numbers, no people, no devices, light and calm, landscape."
editor: "Yakiv Bilenko"
reviewer: null
lastReviewed: null
related:
  glossary: [heart-rate-variability]
  articles: []
  tools: [baseline]
  science: [mechanisms/exercise-and-hrv, mechanisms/hrv-and-age, concepts/autonomic-nervous-system, concepts/baroreflex]
sources:
  - id: S1
    cite: "Singh et al. (1998), Framingham Heart Study"
    title: "Reduced heart rate variability and new-onset hypertension: insights into pathogenesis of hypertension: the Framingham Heart Study"
    journal: "Hypertension"
    year: 1998
    doi: "10.1161/01.hyp.32.2.293"
    pmid: 9719057
    type: observational
  - id: S2
    cite: "Queiroz et al. (2022)"
    title: "Influence of family history of hypertension on blood pressure and heart rate variability in young adults: a meta-analysis"
    journal: "Blood Pressure Monitoring"
    year: 2022
    doi: "10.1097/mbp.0000000000000599"
    pmid: 35438084
    type: meta-analysis
  - id: S3
    cite: "Deng et al. (2024)"
    title: "The effect of exercise training on heart rate variability in patients with hypertension: A systematic review and meta-analysis"
    journal: "Journal of Sports Sciences"
    year: 2024
    doi: "10.1080/02640414.2024.2388984"
    pmid: 39115012
    type: meta-analysis
  - id: S4
    cite: "Carter et al. (2026)"
    title: "Guidelines for rigor and reproducibility of heart rate variability within human cardiovascular research"
    journal: "Am J Physiol Heart Circ Physiol"
    year: 2026
    doi: "10.1152/ajpheart.00041.2026"
    pmid: 42495990
    type: guideline
  - id: S5
    cite: "ONDA — product documentation: How ONDA works"
    title: "How ONDA works"
    url: "https://onda-life.com/how-it-works"
    type: product-documentation
evidenceMap:
  - claim: "In the Framingham Heart Study, HRV was lower in men and women with high blood pressure than in those with normal blood pressure."
    sources: [S1]
    class: context-dependent
    claimType: physiology
    quote: "HRV is reduced in men and women with systemic hypertension."
    limitation: "One large cohort; cross-sectional comparison; ambulatory ECG from the late nineteen-nineties."
  - claim: "Among men with normal blood pressure, lower HRV was associated with a greater risk of developing high blood pressure; this was not found in women."
    sources: [S1]
    class: emerging
    claimType: physiology
    quote: "Among normotensive men, lower HRV was associated with greater risk for developing hypertension."
    limitation: "Only one frequency measure predicted it, only in men, over a few years of follow-up."
  - claim: "The authors interpret this as autonomic dysregulation being present in the early stage of high blood pressure."
    sources: [S1]
    class: emerging
    claimType: physiology
    quote: "These findings are consistent with the hypothesis that autonomic dysregulation is present in the early stage of hypertension."
    limitation: "A hypothesis consistent with the data, not a proven cause."
  - claim: "A meta-analysis of observational studies found that young adults with a family history of high blood pressure had higher blood pressure and lower HRV."
    sources: [S2]
    class: emerging
    claimType: physiology
    quote: "FHH + negatively impacts BP and HRV in young adults."
    limitation: "Observational studies; association, not cause; family history cannot be changed."
  - claim: "A meta-analysis of randomized trials found that exercise training raised RMSSD and high-frequency HRV and lowered the LF/HF ratio, resting systolic blood pressure and heart rate in people with high blood pressure."
    sources: [S3]
    class: context-dependent
    claimType: efficacy
    quote: "Twelve RCTs were included, and the main results demonstrated exercise produced improvement in root mean square of successive RR-intervals differences (RMSSD) and high frequency (HF), and reductions in LF/HF, resting systolic blood pressure (SBP), and HR."
    limitation: "Compared with no exercise; HRV is a surrogate; the LF/HF ratio is not a clean measure of sympathetic activity."
  - claim: "Aerobic training improved more HRV measures than resistance training, and the authors recommend supervised aerobic exercise."
    sources: [S3]
    class: context-dependent
    claimType: efficacy
    quote: "Considering our results and the hypertension practice guidelines, we tend to recommend patients choose supervised AE."
    limitation: "Subgroup comparisons across few trials."
  - claim: "Recording length, setting, breathing and analysis method all affect HRV values, so studies using different methods are hard to compare."
    sources: [S4]
    class: guideline
    claimType: measurement
    quote: "the HRV input signal (e.g., electrocardiography vs. photoplethysmography), length of recording, location of recordings (i.e., laboratory vs. field), respiratory rate and depth, and analytical approaches (i.e., time vs. frequency domain) can all impact rigor, reliability, and study interpretations"
    limitation: "Methodological guideline (expert consensus) for research recordings."
  - claim: "ONDA builds a personal baseline from values in Apple Health and compares new values with the user's own corridor (facts baseline.window, baseline.compare)."
    sources: [S5]
    class: established
    claimType: device
    quote: "From values in Apple Health — HRV, resting heart rate and breathing rate — ONDA builds your personal baseline"
    limitation: "Describes how the app works only; not evidence for any health claim."
---

## How are high blood pressure and HRV connected?

Blood pressure and heart rate are both adjusted moment to moment by the autonomic nervous system. [Heart rate variability](/glossary/heart-rate-variability) (HRV), the natural variation in time between heartbeats, reflects part of that control. In short: HRV is often lower in people with high blood pressure, it may already be lower before blood pressure rises, and exercise training can improve HRV measures, but HRV cannot measure blood pressure itself [S1, S3].

This page explains what studies have found. It is not medical advice and does not replace blood pressure checks or treatment.

## How does it work?

The [autonomic nervous system](/science/concepts/autonomic-nervous-system) speeds up and slows down the heart and tightens and relaxes blood vessels. Pressure sensors in the arteries, the [baroreflex](/science/concepts/baroreflex), help keep blood pressure steady from beat to beat. In high blood pressure, this balance shifts towards the sympathetic side. In the Framingham Heart Study, HRV was lower in men and women with high blood pressure, and the authors read their results as a sign that autonomic dysregulation is present early in the condition [S1].

## How is it measured?

Studies compare HRV from ECG recordings between people with and without high blood pressure, or measure HRV before and after weeks of training [S1, S3]. Blood pressure itself is measured with a cuff in the clinic or at home. Recording length, setting, breathing and analysis all affect HRV values, so results from different methods are hard to compare [S4]. The ratio of low to high frequency power is often presented as a sympathetic balance, but it is not a clean measure of it [S4].

## What affects it?

Family history matters: young adults with a parent who has high blood pressure had higher blood pressure and lower HRV than those without, in a meta-analysis of observational studies [S2]. Age lowers HRV and raises blood pressure at the same time, which makes the two hard to separate, as covered in [HRV and age](/science/mechanisms/hrv-and-age). Physical activity can move both, as covered in [Exercise and HRV](/science/mechanisms/exercise-and-hrv).

## What does the evidence show?

**Lower HRV in high blood pressure: context-dependent.** In a large population study, HRV was lower in men and women with high blood pressure [S1]. This is one cohort and a cross-sectional comparison.

**Lower HRV before high blood pressure: emerging.** Among men with normal blood pressure, lower HRV was linked with a greater risk of developing high blood pressure over the following years; this was not seen in women [S1]. Young adults with a family history of high blood pressure also had lower HRV [S2].

**Exercise training: context-dependent.** HRV here is a surrogate measure: better HRV numbers have not been shown to mean fewer heart attacks or strokes. With that in mind, a meta-analysis of randomized trials found that exercise training raised RMSSD and high-frequency HRV and lowered resting systolic blood pressure and heart rate compared with no exercise [S3]. Aerobic training improved more HRV measures than resistance training, longer programmes did better, and the authors favour supervised aerobic exercise [S3].

**Unknown.** Whether HRV adds anything to blood pressure readings for predicting heart disease in one person, and how blood pressure medicines change HRV.

## What it does not tell you

- **Not a blood pressure reading.** HRV cannot replace a cuff in the clinic or at home.
- **Not a cause.** Lower HRV in high blood pressure is an association, not proof that one causes the other [S1, S2].
- **Not a forecast for you.** The link with developing high blood pressure was seen in men only and in one study [S1].
- **Not proof of fewer complications.** Better HRV after training is a surrogate result [S3].
- **When to get help.** A severe headache, chest pain, shortness of breath, vision changes or weakness on one side need urgent care; high readings at home need a doctor's review.

## In ONDA

ONDA builds a personal baseline from the values stored in Apple Health [S5]. The window is {{fact:baseline.window}}, and {{fact:baseline.compare}}. ONDA does not measure or assess blood pressure. A value outside your corridor describes a change in your own data, not its cause; keep measuring blood pressure with a cuff and discuss it with your doctor.

> Educational information, not a diagnosis or medical treatment.
