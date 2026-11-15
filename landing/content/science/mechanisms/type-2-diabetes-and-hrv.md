---
kind: mechanisms
slug: type-2-diabetes-and-hrv
title: "Type 2 Diabetes and HRV: Why It Drops and What Exercise Does"
metaTitle: "Type 2 Diabetes and HRV"
metaDescription: "Why heart rate variability is often lower in type 2 diabetes, what exercise does to it, and why HRV cannot measure blood sugar or diagnose nerve damage."
shortAnswer: >
  Diabetes can damage the nerves that control the heart. Early on, this
  cardiac autonomic neuropathy may cause no symptoms and show up only as
  lower heart rate variability, and guidelines link it to a higher risk of
  death and heart disease. Abnormal HRV is also more common in people with
  raised blood sugar who do not yet have diabetes. In type 2 diabetes,
  exercise training improved most HRV measures, most clearly endurance
  training. HRV cannot replace blood sugar tests.
keyPoints:
  - "In diabetes, early cardiac autonomic neuropathy may cause no symptoms and be detected only by lower HRV during deep breathing."
  - "Guidelines describe this neuropathy as a risk marker for death and heart disease, more common the longer diabetes lasts."
  - "In a population study of older adults, abnormal HRV was more common not only in diabetes but also in raised blood sugar below the diabetes range."
  - "A meta-analysis found that exercise training improved most HRV measures in type 2 diabetes, with the strongest evidence for endurance training."
  - "Better HRV numbers are not proof of fewer complications; most of the exercise studies were not randomized."
  - "Estimating blood sugar from HRV is not accurate enough for clinical use."
  - "ONDA does not measure blood sugar or assess neuropathy; read your HRV only against your own baseline."
image: /images/science/mechanisms-type-2-diabetes-and-hrv.jpg
imageAlt: "A thin teal heart-rhythm line that gently flattens in the middle and then recovers its soft waves, on a white background."
imagePrompt: "Minimal scientific illustration on a clean white background: a thin teal heart-rhythm line that gently flattens in the middle and then recovers its soft waves, soft cyan glow, lots of empty space, no text, no numbers, no people, no devices, light and calm, landscape."
editor: "Yakiv Bilenko"
reviewer: null
lastReviewed: null
related:
  glossary: [heart-rate-variability]
  articles: []
  tools: [baseline]
  science: [mechanisms/exercise-and-hrv, concepts/autonomic-nervous-system, concepts/hrv-baseline, concepts/interpreting-hrv]
sources:
  - id: S1
    cite: "Pop-Busui et al. (2017), American Diabetes Association"
    title: "Diabetic Neuropathy: A Position Statement by the American Diabetes Association"
    journal: "Diabetes Care"
    year: 2017
    doi: "10.2337/dc16-2042"
    pmid: 27999003
    type: guideline
  - id: S2
    cite: "Spallone et al. (2011), Toronto Consensus Panel on Diabetic Neuropathy"
    title: "Cardiovascular autonomic neuropathy in diabetes: clinical impact, assessment, diagnosis, and management"
    journal: "Diabetes/Metabolism Research and Reviews"
    year: 2011
    doi: "10.1002/dmrr.1239"
    pmid: 21695768
    type: guideline
  - id: S3
    cite: "Ziegler et al. (2015), KORA S4"
    title: "Increased prevalence of cardiac autonomic dysfunction at different degrees of glucose intolerance in the general population: the KORA S4 survey"
    journal: "Diabetologia"
    year: 2015
    doi: "10.1007/s00125-015-3534-7"
    pmid: 25724570
    type: observational
  - id: S4
    cite: "Picard et al. (2021)"
    title: "Effect of exercise training on heart rate variability in type 2 diabetes mellitus patients: A systematic review and meta-analysis"
    journal: "PLoS One"
    year: 2021
    doi: "10.1371/journal.pone.0251863"
    pmid: 33999947
    type: meta-analysis
  - id: S5
    cite: "Azam & Singh (2026)"
    title: "Re-evaluating heart rate variability biomarkers for glucose sensing: the impact of age normalisation and subject-independent validation"
    journal: "BMC Medical Informatics and Decision Making"
    year: 2026
    doi: "10.1186/s12911-026-03455-8"
    pmid: 41923229
    type: observational
  - id: S6
    cite: "Carter et al. (2026)"
    title: "Guidelines for rigor and reproducibility of heart rate variability within human cardiovascular research"
    journal: "Am J Physiol Heart Circ Physiol"
    year: 2026
    doi: "10.1152/ajpheart.00041.2026"
    pmid: 42495990
    type: guideline
  - id: S7
    cite: "ONDA — product documentation: How ONDA works"
    title: "How ONDA works"
    url: "https://onda-life.com/how-it-works"
    type: product-documentation
evidenceMap:
  - claim: "In diabetes, early cardiac autonomic neuropathy may cause no symptoms and be detected only by decreased HRV during deep breathing."
    sources: [S1]
    class: guideline
    claimType: physiology
    quote: "In its early stages, CAN may be completely asymptomatic and detected only by decreased heart rate variability (HRV) with deep breathing"
    limitation: "Diagnosis relies on standard clinical reflex tests, not on wearable HRV readings."
  - claim: "In type 2 diabetes, cardiac autonomic neuropathy becomes more common the longer diabetes lasts."
    sources: [S1]
    class: guideline
    claimType: physiology
    quote: "In type 2 diabetes, the prevalence of CAN also increases with diabetes duration"
    limitation: "Prevalence depends on the tests and criteria used."
  - claim: "Cardiac autonomic neuropathy is a risk marker for death and cardiovascular disease."
    sources: [S2, S1]
    class: guideline
    claimType: physiology
    quote: "CAN is a risk marker of mortality and cardiovascular morbidity"
    limitation: "A marker of risk, not proof that changing HRV changes that risk."
  - claim: "The guideline states that cardiac autonomic neuropathy is also present in impaired glucose tolerance, insulin resistance and metabolic syndrome."
    sources: [S1]
    class: guideline
    claimType: physiology
    quote: "CAN is present in patients with impaired glucose tolerance, insulin resistance, or metabolic syndrome"
    limitation: "Presence is not the same as how often or how early it appears."
  - claim: "In a population study of adults aged fifty-five to seventy-four, abnormal HRV measures were more common in diabetes and in raised blood sugar below the diabetes range than in normal glucose tolerance."
    sources: [S3]
    class: context-dependent
    claimType: physiology
    quote: "Three HRV measures were more frequently abnormal in those with k-DM, n-DM, IFG-IGT and i-IFG than in those with NGT"
    limitation: "Cross-sectional: shows how common it is, not how HRV changes in one person over time; older adults in one region."
  - claim: "In the same study, reduced HRV was associated with mortality and with modifiable cardiovascular risk factors."
    sources: [S3]
    class: context-dependent
    claimType: physiology
    quote: "It is associated with mortality and modifiable cardiovascular risk factors"
    limitation: "Association in one cohort, not a cause."
  - claim: "A meta-analysis found that exercise training improved HRV measures in type 2 diabetes."
    sources: [S4]
    class: context-dependent
    claimType: efficacy
    quote: "Exercise training improved HRV parameters in T2DM patients which may reflect an improvement in the activity of the autonomic nervous system."
    limitation: "HRV is a surrogate; most included studies were not randomized; the high-frequency measure's interval included no effect."
  - claim: "The evidence was strongest for endurance training, and supervised training seemed beneficial."
    sources: [S4]
    class: context-dependent
    claimType: efficacy
    quote: "The level of proof is the highest for endurance training."
    limitation: "Few studies of resistance and interval training."
  - claim: "Training duration and frequency did not change the HRV benefit."
    sources: [S4]
    class: emerging
    claimType: efficacy
    quote: "Duration and frequency of training did not influence the benefits on HRV."
    limitation: "Comparison across studies, not a test of dose within one trial."
  - claim: "Estimating blood sugar from HRV showed a real but weak link that is not accurate enough for standalone clinical use."
    sources: [S5]
    class: emerging
    claimType: measurement
    quote: "performance remained insufficient for standalone clinical use"
    limitation: "Small group of men with type 2 diabetes; ECG-derived features, not consumer wearables."
  - claim: "Recording length, setting, breathing and analysis method all affect HRV values, so studies using different methods are hard to compare."
    sources: [S6]
    class: guideline
    claimType: measurement
    quote: "the HRV input signal (e.g., electrocardiography vs. photoplethysmography), length of recording, location of recordings (i.e., laboratory vs. field), respiratory rate and depth, and analytical approaches (i.e., time vs. frequency domain) can all impact rigor, reliability, and study interpretations"
    limitation: "Methodological guideline (expert consensus) for research recordings."
  - claim: "ONDA builds a personal baseline from values in Apple Health and compares new values with the user's own corridor (facts baseline.window, baseline.compare)."
    sources: [S7]
    class: established
    claimType: device
    quote: "From values in Apple Health — HRV, resting heart rate and breathing rate — ONDA builds your personal baseline"
    limitation: "Describes how the app works only; not evidence for any health claim."
---

## Why is HRV lower in diabetes?

High blood sugar over years can damage nerves, including the autonomic nerves that adjust heart rate. Doctors call this cardiac autonomic neuropathy. [Heart rate variability](/glossary/heart-rate-variability) (HRV), the natural variation in time between heartbeats, depends on these nerves, so it often falls. In short: early neuropathy may cause no symptoms and show up only as lower HRV, it is a recognised risk marker, and exercise training can improve HRV measures [S1, S2, S4].

This page explains what guidelines and studies say. It is not medical advice and does not replace diabetes care.

## How does it work?

The [autonomic nervous system](/science/concepts/autonomic-nervous-system) speeds the heart up and slows it down from moment to moment. When its nerves are damaged, heart rate becomes more fixed and HRV drops. The American Diabetes Association notes that early neuropathy may be completely silent and detected only by lower HRV during deep breathing [S1]. In type 2 diabetes it becomes more common the longer diabetes lasts [S1].

## How is it measured?

Doctors diagnose this neuropathy with standard reflex tests: heart rate changes during deep breathing, on standing and during straining, recorded on an ECG [S1, S2]. Population studies use short resting ECG recordings [S3]. A watch reading at night is not the same test. Recording length, setting, breathing and analysis all affect HRV values [S6].

## What affects it?

Blood sugar matters before diabetes is diagnosed. The guideline states that the neuropathy is also present in impaired glucose tolerance, insulin resistance and metabolic syndrome [S1]. In a population study of older adults, abnormal HRV measures were more common not only in diabetes but also in raised blood sugar below the diabetes range [S3]. Age, blood pressure, weight and blood fats are linked to it too [S2, S3]. Physical activity is one factor that can move HRV, as covered in [Exercise and HRV](/science/mechanisms/exercise-and-hrv).

## What does the evidence show?

**Neuropathy and HRV: guideline.** Guidelines describe cardiac autonomic neuropathy as common in diabetes, detectable by lower HRV, and a risk marker for death and heart disease [S1, S2].

**Raised blood sugar before diabetes: context-dependent.** In a population study, abnormal HRV was more common in raised blood sugar below the diabetes range, and reduced HRV was associated with mortality and with modifiable cardiovascular risk factors [S3]. This was one cross-sectional study, so it shows how common it is, not how it develops in one person.

**Exercise training: context-dependent.** HRV here is a surrogate measure: better HRV numbers have not been shown to mean fewer complications. With that in mind, a meta-analysis found that exercise training improved most HRV measures in type 2 diabetes, and there were no changes in the control groups [S4]. The evidence was strongest for endurance training, supervised training seemed beneficial, and training duration and frequency did not change the benefit [S4]. Most included studies were not randomized.

**Blood sugar from HRV: emerging.** A study estimating blood sugar from ECG-derived HRV found a real but weak link that was not accurate enough for standalone clinical use [S5].

**Unknown.** Whether improving HRV through training lowers the risk of complications, and how well consumer wearables detect early neuropathy.

## What it does not tell you

- **Not a diagnosis of neuropathy.** That needs standard clinical tests [S1, S2].
- **Not a blood sugar test.** HRV cannot replace a glucose meter or lab tests [S5].
- **Not proof of fewer complications.** Better HRV after training is a surrogate result [S4].
- **Not a timeline.** The population data show how common abnormal HRV is, not how it changes in one person [S3].
- **When to get help.** Dizziness on standing, a fast resting heart rate, numbness or pain in the feet, or frequent low blood sugar need a doctor's attention.

## In ONDA

ONDA builds a personal baseline from the values stored in Apple Health [S7]. The window is {{fact:baseline.window}}, and {{fact:baseline.compare}}. ONDA does not measure blood sugar and does not assess neuropathy. A value outside your corridor describes a change in your own data, not its cause; if your HRV trend falls and you have symptoms, talk to your doctor.

> Educational information, not a diagnosis or medical treatment.
