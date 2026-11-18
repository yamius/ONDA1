---
kind: evidence
slug: afib-watch-notifications
title: "Smartwatch AFib Alerts: What an Irregular Rhythm Notification Means"
metaTitle: "Smartwatch AFib Alerts: Evidence"
metaDescription: "What a smartwatch irregular rhythm alert means for atrial fibrillation: why guidelines require an ECG, what large studies found, and what HRV cannot tell."
shortAnswer: >
  A smartwatch irregular rhythm notification is a prompt to get an ECG, not a
  diagnosis of atrial fibrillation. European and American guidelines say that
  pulse-sensor (PPG) wearables are not reliable enough to diagnose it on their
  own. In large studies, notifications were rare, and AF was later confirmed
  in only some people. Whether such screening prevents strokes is not known.
  HRV readings cannot detect AF.
keyPoints:
  - "The European guideline requires ECG documentation before AF is diagnosed or treated, and this excludes non-ECG wearables."
  - "The American guideline says a pulse-sensor alert may prompt an ECG but is not reliable enough to diagnose AF."
  - "In large studies of Apple and Fitbit watches, few people received a notification."
  - "When a notification came while an ECG patch was worn, it usually matched AF on the ECG; on a patch worn later, AF was found in about a third of people."
  - "Watch ECG recordings are a separate tool and were accurate in pooled studies, especially when read by trained staff."
  - "Whether watch screening prevents strokes has not been shown."
  - "HRV, RMSSD and SDNN do not detect AF, and ONDA does not screen for it."
image: /images/science/evidence-afib-watch-notifications.jpg
imageAlt: "A thin teal pulse line on a white background that turns briefly uneven and then passes through a small ECG grid, suggesting a check before any conclusion."
imagePrompt: "Minimal scientific illustration on a clean white background: a thin teal pulse line that becomes briefly uneven and then passes through a small faint ECG grid, soft cyan glow, lots of empty space, no text, no numbers, no people, light and calm, landscape."
editor: "Yakiv Bilenko"
reviewer: null
lastReviewed: null
related:
  glossary: [heart-rate-variability]
  articles: []
  tools: [baseline]
  science: [concepts/rmssd, measurements/how-we-evaluate-research, measurements/onda-method]
sources:
  - id: S1
    cite: "Van Gelder et al. (2024)"
    title: "2024 ESC Guidelines for the management of atrial fibrillation developed in collaboration with the European Association for Cardio-Thoracic Surgery (EACTS)"
    journal: "European Heart Journal"
    year: 2024
    doi: "10.1093/eurheartj/ehae176"
    pmid: 39210723
    type: guideline
  - id: S2
    cite: "Joglar et al. (2024)"
    title: "2023 ACC/AHA/ACCP/HRS Guideline for the Diagnosis and Management of Atrial Fibrillation: A Report of the American College of Cardiology/American Heart Association Joint Committee on Clinical Practice Guidelines"
    journal: "Circulation"
    year: 2024
    doi: "10.1161/CIR.0000000000001193"
    pmid: 38033089
    type: guideline
  - id: S3
    cite: "Perez et al. (2019)"
    title: "Large-Scale Assessment of a Smartwatch to Identify Atrial Fibrillation"
    journal: "New England Journal of Medicine"
    year: 2019
    doi: "10.1056/NEJMoa1901183"
    pmid: 31722151
    type: observational
  - id: S4
    cite: "Lubitz et al. (2022)"
    title: "Detection of Atrial Fibrillation in a Large Population Using Wearable Devices: The Fitbit Heart Study"
    journal: "Circulation"
    year: 2022
    doi: "10.1161/CIRCULATIONAHA.122.060291"
    pmid: 36148649
    type: observational
  - id: S5
    cite: "Bin Rashid et al. (2026)"
    title: "Wearable devices for atrial fibrillation: diagnostic and screening roles of ECG and PPG-A systematic review"
    journal: "Future Cardiology"
    year: 2026
    doi: "10.1080/14796678.2026.2689050"
    pmid: 42332956
    type: systematic-review
  - id: S6
    cite: "Iqhrammullah et al. (2025)"
    title: "Accuracy and interpretability of smartwatch electrocardiogram for early detection of atrial fibrillation: A systematic review and meta-analysis"
    journal: "Journal of Arrhythmia"
    year: 2025
    doi: "10.1002/joa3.70087"
    pmid: 40406413
    type: meta-analysis
  - id: S7
    cite: "Barrera et al. (2025)"
    title: "Accuracy of Smartwatches in the Detection of Atrial Fibrillation: A Systematic Review and Diagnostic Meta-Analysis"
    journal: "JACC: Advances"
    year: 2025
    doi: "10.1016/j.jacadv.2025.102133"
    pmid: 41182224
    type: meta-analysis
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
  - claim: "The European guideline requires ECG documentation to start AF risk assessment and management."
    sources: [S1]
    class: guideline
    claimType: regulatory
    quote: "To guard against inappropriate diagnosis of AF, this task force continues to recommend that ECG documentation is required to initiate risk stratification and AF management."
    limitation: "Guideline recommendation (expert consensus)."
  - claim: "The European guideline states that this ECG documentation does not include non-ECG wearables such as pulse-sensor (PPG) devices."
    sources: [S1]
    class: guideline
    claimType: device
    quote: "This does not include non-ECG wearables and other devices that typically use photoplethysmography."
    limitation: "Guideline recommendation (expert consensus)."
  - claim: "The American guideline says pulse-sensor alerts may prompt an ECG but are not reliable enough to diagnose AF."
    sources: [S2]
    class: guideline
    claimType: device
    quote: "Although photoplethysmography monitors may alert individuals to obtain an electrocardiographic tracing, it is not sufficiently reliable to establish an AF diagnosis."
    limitation: "Guideline recommendation (expert consensus)."
  - claim: "In a large study of an Apple Watch irregular pulse notification, few participants received a notification."
    sources: [S3]
    class: context-dependent
    claimType: device
    quote: "Over a median of 117 days of monitoring, 2161 participants (0.52%) received notifications of irregular pulse."
    limitation: "Single manufacturer-supported study in self-selected users of one device and algorithm."
  - claim: "In the Apple study, AF was found on an ECG patch worn after the notification in about a third of notified participants."
    sources: [S3]
    class: context-dependent
    claimType: device
    quote: "Among participants who received notification of an irregular pulse, 34% had atrial fibrillation on subsequent ECG patch readings"
    limitation: "Only a minority of notified participants returned a patch, applied on average about two weeks later; AF that comes and goes may be missed."
  - claim: "In the Apple study, notifications that occurred while the ECG patch was worn usually matched AF on the ECG."
    sources: [S3]
    class: context-dependent
    claimType: device
    quote: "84% of notifications were concordant"
    limitation: "Agreement during simultaneous recording; not the same as the share of notified people who have AF."
  - claim: "In the Fitbit Heart Study, AF was present on a later ECG patch in about a third of notified participants with analyzable patches."
    sources: [S4]
    class: context-dependent
    claimType: device
    quote: "Among 1057 participants with an IHRD notification and subsequent analyzable ECG patch monitor, AF was present in 340 (32.2%)."
    limitation: "Single manufacturer-supported study of one algorithm; only part of notified participants had analyzable patches."
  - claim: "In the Fitbit Heart Study, a detection that occurred during ECG patch monitoring almost always matched AF on the ECG."
    sources: [S4]
    class: context-dependent
    claimType: device
    quote: "Of the 225 participants with another IHRD during ECG patch monitoring, 221 had concurrent AF on the ECG and 4 did not"
    limitation: "Simultaneous agreement in a subgroup; not a population screening yield."
  - claim: "A systematic review concludes that pulse-sensor devices are best used for screening, with ECG confirmation per guidelines."
    sources: [S5]
    class: context-dependent
    claimType: device
    quote: "PPG-based devices are best used for screening, with subsequent ECG confirmation according to international AF management guidelines."
    limitation: "Systematic review without a pooled estimate for screening outcomes."
  - claim: "The same review lists motion artifacts, false positives and limited evidence for stroke prevention among the limitations."
    sources: [S5]
    class: unknown
    claimType: efficacy
    quote: "Limitations included motion artifacts, false positives, adherence issues, clinician data burden, and limited evidence for stroke prevention."
    limitation: "Whether watch screening prevents strokes is not established by the studies reviewed."
  - claim: "In a meta-analysis, smartwatch single-lead ECG recordings detected AF with high accuracy, especially when read manually by trained staff."
    sources: [S6]
    class: context-dependent
    claimType: device
    quote: "This study shows that smartwatch ECG is able to detect AFib with high accuracy, especially through manual reading by trained medical personnel."
    limitation: "Diagnostic accuracy studies, often in selected patients; some recordings could not be read."
  - claim: "A diagnostic meta-analysis found that accuracy varied between devices, with very high heterogeneity, so it does not allow a fair device ranking."
    sources: [S7]
    class: emerging
    claimType: device
    quote: "Device performance varied"
    limitation: "Very high heterogeneity between studies; the article has a published correction; its numbers are not used here."
  - claim: "HRV values depend on the input signal, recording length, breathing and analysis method."
    sources: [S8]
    class: guideline
    claimType: measurement
    quote: "the HRV input signal (e.g., electrocardiography vs. photoplethysmography), length of recording, location of recordings (i.e., laboratory vs. field), respiratory rate and depth, and analytical approaches (i.e., time vs. frequency domain) can all impact rigor, reliability, and study interpretations"
    limitation: "Methodological guideline (expert consensus) for research recordings."
  - claim: "ONDA builds a personal baseline from values in Apple Health."
    sources: [S9]
    class: established
    claimType: device
    quote: "From values in Apple Health — HRV, resting heart rate and breathing rate — ONDA builds your personal baseline"
    limitation: "Describes how the app works only; not evidence for any health claim."
---

## What is an irregular rhythm notification?

Many smartwatches use an optical pulse sensor (photoplethysmography, PPG) to check the timing of your pulse in the background. If the timing looks irregular several times in a row, the watch may show an irregular rhythm notification suggesting possible atrial fibrillation (AF), a common heart rhythm disorder. In short: the notification is a reason to get an ECG, not a diagnosis [S1, S2].

This page describes what studies and guidelines say. It is not medical advice. If you have symptoms such as chest pain, fainting or severe shortness of breath, seek urgent care.

## Why do guidelines require an ECG?

The European guideline requires ECG documentation before AF risk is assessed or treatment starts, to avoid wrong diagnoses [S1]. It states that this does not include non-ECG wearables that use PPG [S1]. The American guideline agrees: a PPG alert may prompt you to get an ECG, but it is not reliable enough to diagnose AF [S2].

## What did large studies find?

**Notifications were rare.** In a large study of an Apple Watch notification, few participants received one over months of monitoring [S3]. The Fitbit Heart Study reported a similar picture [S4].

**Two different numbers.** When a notification came while an ECG patch was being worn, it usually matched AF on that ECG [S3, S4]. But when people wore a patch after the notification, AF was found in only about a third of them [S3, S4]. Both are true: the alert is often right about that moment, but AF can come and go, and not everyone notified had AF on a later recording. Both studies were supported by the device makers and each tested one device.

**Screening, not diagnosis.** A systematic review concludes that PPG devices are best used for screening, followed by ECG confirmation according to guidelines [S5]. It lists motion artifacts and false positives among the limits [S5].

## How is a watch ECG different?

Some watches can also record a single-lead ECG when you hold a finger on the crown or frame. That is a separate tool from the background pulse notification. In a meta-analysis, smartwatch ECG recordings detected AF with high accuracy, especially when trained staff read them, though some recordings could not be read [S6]. Another meta-analysis found that accuracy varied between devices and studies, so a fair ranking of watch brands is not possible from it [S7].

## What does the evidence show?

**Guideline: a PPG alert is not a diagnosis.** Both major guidelines require an ECG [S1, S2].

**Context-dependent: notifications in large studies.** Few people are notified; a later ECG confirms AF in only some of them; alerts during simultaneous ECG usually match [S3, S4].

**Context-dependent: watch ECG.** Accurate in pooled studies, best with expert reading [S6].

**Unknown: strokes and outcomes.** Whether screening with a watch prevents strokes or other harms has not been shown [S5].

## What it does not tell you

- **Not a diagnosis.** Only an ECG can establish AF [S1, S2].
- **Not reassurance.** No notification does not rule out AF; the feature checks only at some moments.
- **Not proof of benefit.** Stroke prevention through watch screening is unproven [S5].
- **Not about HRV.** HRV, [RMSSD](/science/concepts/rmssd) and SDNN describe variation between beats and depend heavily on how they are recorded [S8]. They are not a test for AF.

## In ONDA

ONDA builds a personal baseline from HRV, resting heart rate and breathing rate stored in Apple Health [S9]. ONDA does not detect, screen for or diagnose AF and is not a medical device. If your watch shows an irregular rhythm notification, talk to a doctor about getting an ECG. How ONDA measures your signals is explained in [How ONDA measures and interprets your signals](/science/measurements/onda-method).

> Educational information, not a diagnosis or medical treatment.
