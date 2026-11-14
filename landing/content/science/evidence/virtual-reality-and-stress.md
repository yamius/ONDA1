---
kind: evidence
slug: virtual-reality-and-stress
title: "Virtual Reality for Stress: What the Evidence Shows"
metaTitle: "VR and Stress: Evidence"
metaDescription: "What research shows about virtual reality for stress: lower perceived stress in trials, weaker evidence on HRV and body markers, and why quality matters."
shortAnswer: >
  Virtual reality relaxation, most often a virtual nature scene, lowered
  perceived stress in a meta-analysis of randomized trials in the general
  population. That is a questionnaire outcome, not a heart measure. A
  separate review of body markers, including heart rate variability, found
  that most studies reported less stress, but most were small, single
  laboratory sessions of low quality, and HRV results were not pooled. VR
  may help where real nature or other relaxation is hard to reach.
keyPoints:
  - "A meta-analysis of randomized trials found that VR interventions lowered perceived stress in the general population, mostly with virtual nature scenes."
  - "Results varied widely between trials, and more sessions were linked to larger effects."
  - "The authors call VR a promising alternative where real nature or usual relaxation methods are hard to access."
  - "In a review of body markers, most studies reported less stress, but methodological inconsistencies limited the findings."
  - "Many of those studies were small, used a single laboratory session and were of low quality."
  - "HRV was measured with different metrics and timepoints, so there is no pooled HRV effect."
  - "Long-term effects and use outside the laboratory are largely unstudied."
image: /images/science/evidence-virtual-reality-and-stress.jpg
imageAlt: "A thin teal heart-rhythm line flowing through a soft outline of a headset and fading into calm, gentle waves, on a white background."
imagePrompt: "Minimal scientific illustration on a clean white background: a thin teal heart-rhythm line flowing through a soft outline of a virtual reality headset and fading into calm gentle waves, soft cyan glow, lots of empty space, no text, no numbers, no people, light and calm, landscape."
editor: "Yakiv Bilenko"
reviewer: null
lastReviewed: null
related:
  glossary: [heart-rate-variability]
  articles: []
  tools: [baseline]
  science: [mechanisms/acute-stress-and-hrv, evidence/meditation-autonomic-nervous-system, evidence/slow-breathing, concepts/rmssd]
sources:
  - id: S1
    cite: "Strauch et al. (2026)"
    title: "Virtual Reality Interventions for Stress Reduction in the General Population: Systematic Review and Meta-Analysis of Randomized Controlled Trials"
    journal: "Journal of Medical Internet Research"
    year: 2026
    doi: "10.2196/78212"
    pmid: 42184377
    type: meta-analysis
  - id: S2
    cite: "Robbemond et al. (2026)"
    title: "Physiological Responses to Virtual Reality-Based Stress Regulation and Relaxation Interventions: A Systematic Review"
    journal: "Stress and Health"
    year: 2026
    doi: "10.1002/smi.70164"
    pmid: 41830413
    type: systematic-review
  - id: S3
    cite: "Carter et al. (2026)"
    title: "Guidelines for rigor and reproducibility of heart rate variability within human cardiovascular research"
    journal: "Am J Physiol Heart Circ Physiol"
    year: 2026
    doi: "10.1152/ajpheart.00041.2026"
    pmid: 42495990
    type: guideline
  - id: S4
    cite: "ONDA — product documentation: How ONDA works"
    title: "How ONDA works"
    url: "https://onda-life.com/how-it-works"
    type: product-documentation
evidenceMap:
  - claim: "A meta-analysis of randomized trials in the general population found that VR interventions lowered perceived stress compared with neutral controls."
    sources: [S1]
    class: context-dependent
    claimType: efficacy
    quote: "On average, VR interventions significantly reduced perceived stress level"
    limitation: "Questionnaire outcome, not HRV; results varied widely between trials, and the prediction interval included no effect."
  - claim: "In the same review, more sessions predicted larger stress reduction."
    sources: [S1]
    class: emerging
    claimType: efficacy
    quote: "Univariate linear regression analyses identified multiple sessions"
    limitation: "Comparison across trials (meta-regression), not a test of dose within one trial."
  - claim: "The authors describe VR as a promising alternative where access to real nature or usual relaxation methods is limited."
    sources: [S1]
    class: context-dependent
    claimType: other
    quote: "VR represents a promising alternative, particularly in contexts where access to real-life nature or conventional relaxation methods is limited or resource-intensive."
    limitation: "Authors' conclusion; no direct comparison with real nature in this review."
  - claim: "The meta-analysis also found a small decrease in systolic blood pressure."
    sources: [S1]
    class: emerging
    claimType: physiology
    quote: "the decrease in systolic blood pressure was significant"
    limitation: "Small effect; not a treatment for high blood pressure."
  - claim: "In a systematic review of body markers, most studies reported that VR interventions reduced stress, but methodological inconsistencies limited the findings."
    sources: [S2]
    class: emerging
    claimType: physiology
    quote: "Fifty-six studies found that VR interventions reduced stress as measured by physiological markers. However, methodological inconsistencies limited their findings."
    limitation: "Narrative synthesis without pooling; mostly low-quality studies."
  - claim: "Many of the included studies were small, used a single laboratory session and were of low quality."
    sources: [S2]
    class: emerging
    claimType: measurement
    quote: "Many studies lacked theoretical grounding, had small sample sizes, conducted only a single VR session in a laboratory setting, and had low quality."
    limitation: "Quality rating by the review authors with one appraisal tool."
  - claim: "Markers and timepoints varied widely, with heart rate, several HRV measures and blood pressure used most often, so HRV results cannot be pooled."
    sources: [S2]
    class: emerging
    claimType: measurement
    quote: "Physiological markers and timepoints varied widely, with heart rate (HR), HRV (RMSSD, SDNN, LF, HF), and blood pressure being the most common."
    limitation: "No HRV effect size is available."
  - claim: "Recording length, setting, breathing and analysis method all affect HRV values, so studies using different methods are hard to compare."
    sources: [S3]
    class: guideline
    claimType: measurement
    quote: "the HRV input signal (e.g., electrocardiography vs. photoplethysmography), length of recording, location of recordings (i.e., laboratory vs. field), respiratory rate and depth, and analytical approaches (i.e., time vs. frequency domain) can all impact rigor, reliability, and study interpretations"
    limitation: "Methodological guideline (expert consensus) for research recordings."
  - claim: "ONDA builds a personal baseline from values in Apple Health and compares new values with the user's own corridor (facts baseline.window, baseline.compare)."
    sources: [S4]
    class: established
    claimType: device
    quote: "From values in Apple Health — HRV, resting heart rate and breathing rate — ONDA builds your personal baseline"
    limitation: "Describes how the app works only; not evidence for any health claim."
---

## What is VR for stress, and why study it with HRV?

Virtual reality (VR) relaxation uses a headset to place you in a calming scene, most often a virtual forest, beach or garden, sometimes with guided meditation or simple tasks. Researchers ask whether it lowers stress, both in how people feel and in body signals such as [heart rate variability](/glossary/heart-rate-variability) (HRV), the natural variation in time between heartbeats. In short: VR lowered perceived stress in trials, but the evidence for HRV and other body markers is weaker [S1, S2].

This page describes what studies have found. It is not a medical treatment.

## How does it work?

The main idea is that calming scenes, especially nature, help attention and stress recover; most studies build on this idea [S2]. VR also takes you away from your surroundings for a while, and many programs include slower breathing or meditation, which can change heart rate and HRV on their own. More on stress responses is in [Acute stress and HRV](/science/mechanisms/acute-stress-and-hrv).

## How is it measured?

Trials usually compare a VR session with a neutral control, often after a stress task in a laboratory. Perceived stress is measured with questionnaires [S1]. Body markers include heart rate, HRV measures such as [RMSSD](/science/concepts/rmssd), and blood pressure, measured at very different timepoints [S2]. Recording length, setting, breathing and analysis all affect HRV values [S3].

## What affects it?

The type of program differs between studies: virtual nature, calming architecture, guided meditation or interactive tasks [S1]. The number of sessions mattered, with more sessions linked to larger effects [S1]. Most studies used one session in a laboratory, so results outside the laboratory are unclear [S2].

## What does the evidence show?

**Perceived stress: context-dependent.** A meta-analysis of randomized trials in the general population found that VR lowered perceived stress compared with neutral controls [S1]. Results varied widely between trials, and more sessions were linked to larger effects. The same analysis found a small decrease in systolic blood pressure [S1].

**Body markers, including HRV: emerging.** Most studies in this area were small, used one laboratory session and were of low quality [S2]. In a systematic review, most studies reported that VR reduced stress as measured by body markers, but methodological inconsistencies limited the findings [S2]. HRV was measured in different ways and at different times, so there is no pooled HRV effect.

**Where it fits.** The authors describe VR as a promising alternative where real nature or usual relaxation methods are hard to reach [S1]. That is not the same as saying it equals time in real nature.

**Unknown.** Long-term effects, effects in daily life outside the laboratory, and how much HRV changes.

## What it does not tell you

- **Not an HRV result.** The main benefit is on a stress questionnaire, not on HRV [S1].
- **Not strong evidence on the body.** The studies of body markers are mostly small and low quality [S2].
- **Not a replacement for real nature.** No direct comparison is shown here [S1].
- **Not long-term evidence.** Most studies tested one session [S2].
- **Not about one reading.** HRV measured during or right after a session reflects that moment and your breathing at the time [S3].

## In ONDA

ONDA builds a personal baseline from the values stored in Apple Health [S4]. The window is {{fact:baseline.window}}, and {{fact:baseline.compare}}. A value outside your corridor describes a change in your own data, not its cause. Readings taken during or right after a VR session are not comparable with resting values.

> Educational information, not a diagnosis or medical treatment.
