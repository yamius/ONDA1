---
kind: mechanisms
slug: long-covid-pots-and-hrv
title: "Long COVID, POTS and HRV: What the Evidence Shows"
metaTitle: "Long COVID, POTS and HRV"
metaDescription: "How long COVID and POTS relate to heart rate variability, why pooled results are uncertain, what wearables found, and why HRV cannot diagnose long COVID."
shortAnswer: >
  Pooled studies show only a trend towards lower heart rate variability in
  people with long COVID, and most of those studies have a high risk of bias.
  Some single studies find lower HRV at rest or in daily life, but long COVID
  groups differ, and people with POTS show a different pattern from people
  with other symptoms. In one small wearable study, day-to-day HRV did not
  follow symptoms. HRV cannot diagnose long COVID or POTS.
keyPoints:
  - "A meta-analysis found only a trend towards lower HRV in long COVID, with high heterogeneity and a high risk of bias in most studies."
  - "In one study, resting HRV was lower in long COVID, but the response to standing up was normal, so results depend on the test."
  - "Long COVID subgroups, including people with POTS, do not share one pattern of autonomic changes."
  - "In a wearable study, HRV was lower in long COVID in daily life and sleep and stayed lower for a day after harder exercise."
  - "In a small wearable study, nightly HRV did not track day-to-day symptoms, but it differed between people with more and fewer symptoms."
  - "Models that use wearable heart data to detect long COVID are research tools, not diagnostic tests."
imageAlt: "A thin teal heart-rhythm line rising in a short steep step and then settling, beside a faint upright arrow, on a white background."
imagePrompt: "Minimal scientific illustration on a clean white background: a thin teal heart-rhythm line rising in a short steep step and then settling, next to a faint outline of a person-free upright arrow suggesting standing up, soft cyan glow, lots of empty space, no text, no numbers, no people, no devices, light and calm, landscape."
image: /images/science/mechanisms-long-covid-pots-and-hrv.jpg
editor: "Yakiv Bilenko"
reviewer: null
lastReviewed: null
related:
  glossary: [heart-rate-variability]
  articles: [what-to-do-after-low-hrv-reading]
  tools: [baseline]
  science: [mechanisms/illness-and-hrv, concepts/autonomic-nervous-system, concepts/baroreflex, concepts/rmssd, measurements/heart-rate-variability, questions/why-is-my-hrv-low]
sources:
  - id: S1
    cite: "Schoene et al. (2026)"
    title: "Neurocardiac Autonomic Dysfunction in Patients With Post-COVID-19 Condition: A Systematic Review and Meta-Analysis"
    journal: "European Journal of Neurology"
    year: 2026
    doi: "10.1111/ene.70561"
    pmid: 41814525
    type: meta-analysis
  - id: S2
    cite: "González-Hermosillo González et al. (2025)"
    title: "Long COVID Patients with Orthostatic Intolerance Have Reduced Heart Rate Variability and Preserved Physiological Response to Active Standing"
    journal: "Biology"
    year: 2025
    doi: "10.3390/biology15010001"
    pmid: 41514842
    type: observational
  - id: S3
    cite: "Hira et al. (2025)"
    title: "Attenuated cardiac autonomic function in patients with long-COVID with impaired orthostatic hemodynamics"
    journal: "Clinical Autonomic Research"
    year: 2025
    doi: "10.1007/s10286-025-01107-x"
    pmid: 39841332
    type: observational
  - id: S4
    cite: "Ruijgt et al. (2026)"
    title: "Wearable Heart Rate Variability Monitoring, Autonomic Dysfunction and Post-exertional Malaise in Long COVID: An Observational Study"
    journal: "Sports Medicine"
    year: 2026
    doi: "10.1007/s40279-026-02487-4"
    pmid: 42501245
    type: observational
  - id: S5
    cite: "Aboagye et al. (2026)"
    title: "Bidirectional Associations Between Autonomic Function, Sleep Quality, and Daily Fatigue and Energy Symptoms in Long COVID: Longitudinal Digital Health Study"
    journal: "JMIR Cardio"
    year: 2026
    doi: "10.2196/99630"
    pmid: 42735381
    type: observational
  - id: S6
    cite: "Uwakwe et al. (2025)"
    title: "Longitudinal wearable sensor data enhance precision of Long COVID detection"
    journal: "PLOS Digital Health"
    year: 2025
    doi: "10.1371/journal.pdig.0001093"
    pmid: 41264615
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
    cite: "ONDA — product documentation: How ONDA works"
    title: "How ONDA works"
    url: "https://onda-life.com/how-it-works"
    type: product-documentation
evidenceMap:
  - claim: "Across studies, people with post-COVID condition showed only a trend towards lower HRV than controls."
    sources: [S1]
    class: context-dependent
    claimType: physiology
    quote: "We observed a trend toward lower HRV in post-COVID patients compared to controls"
    limitation: "Pooled differences were not statistically significant; high heterogeneity; most included studies had a high risk of bias."
  - claim: "In long COVID with orthostatic symptoms, resting HRV was lower than in controls, but the HRV response to active standing was similar."
    sources: [S2]
    class: context-dependent
    claimType: physiology
    quote: "an active orthostatic test was not able to exhibit an autonomic dysregulation in these patients with long COVID"
    limitation: "Small cross-sectional study, long after infection; results depend on whether HRV is measured lying down or standing."
  - claim: "Long COVID subgroups, such as people with initial orthostatic hypotension, POTS or no orthostatic abnormality, showed different autonomic patterns."
    sources: [S3]
    class: context-dependent
    claimType: physiology
    quote: "Long-COVID subgroups do not present with homogeneous pathophysiology, necessitating targeted treatment strategies."
    limitation: "One cross-sectional study with small subgroups; mostly women; indirect autonomic measures."
  - claim: "In a wearable study, HRV was lower in long COVID than in controls during daily activities and sleep, and stayed lower for a day after exercise around and above the first ventilatory threshold."
    sources: [S4]
    class: emerging
    claimType: physiology
    quote: "HRV was lower in patients with long COVID compared with healthy controls during various daily activities and sleep"
    limitation: "Observational; small control group; the authors' link to post-exertional malaise is an interpretation, not a tested rule."
  - claim: "In a small wearable study, nightly HRV showed no significant within-person day-to-day associations with symptoms, though it differed between people with higher and lower symptom burden."
    sources: [S5]
    class: emerging
    claimType: device
    quote: "HRV metrics showed no significant within-person day-to-day associations with symptoms"
    limitation: "Fourteen people; exploratory; one consumer device."
  - claim: "A machine-learning model that added wearable heart rate features to symptoms improved long COVID detection compared with symptoms alone in a research dataset."
    sources: [S6]
    class: context-dependent
    claimType: device
    quote: "These values represent a significant improvement of approximately 5% in both the ROC-AUC and PR-AUC over the symptoms-only model."
    limitation: "Research model on one dataset; uses heart rate features, not a validated diagnostic; real-world use not shown."
  - claim: "Recording length, setting, breathing and analysis method all affect HRV values, so studies using different methods are hard to compare."
    sources: [S7]
    class: guideline
    claimType: measurement
    quote: "the HRV input signal (e.g., electrocardiography vs. photoplethysmography), length of recording, location of recordings (i.e., laboratory vs. field), respiratory rate and depth, and analytical approaches (i.e., time vs. frequency domain) can all impact rigor, reliability, and study interpretations"
    limitation: "Methodological guideline (expert consensus) for research recordings."
  - claim: "A single low HRV reading does not by itself mean a person is stressed or unwell; HRV is not a specific marker of a state (fact claim.hrvNotStress)."
    sources: [S7]
    class: guideline
    claimType: other
    quote: "HRV has some utility as a cardiovascular risk stratification tool but is not appropriate to employ as a specific marker of cardiac sympathetic outflow or sympathovagal balance."
    limitation: "Methodological guideline (expert consensus), not a study of long COVID."
  - claim: "ONDA builds a personal baseline from values in Apple Health and compares new values with the user's own corridor (facts baseline.window, baseline.compare)."
    sources: [S8]
    class: established
    claimType: device
    quote: "From values in Apple Health — HRV, resting heart rate and breathing rate — ONDA builds your personal baseline"
    limitation: "Describes how the app works only; not evidence for any health claim."
---

## How are long COVID and POTS related to HRV?

[Heart rate variability](/glossary/heart-rate-variability) (HRV) is the natural variation in time between heartbeats. Long COVID means symptoms that last months after a coronavirus infection, often fatigue, brain fog and trouble standing up. POTS (postural orthostatic tachycardia syndrome) is one pattern seen in some people: the heart rate rises steeply on standing. Because these problems involve the autonomic nervous system, researchers have looked at HRV. In short: pooled results show only a trend towards lower HRV, and studies disagree on details [S1].

This page describes what studies have found. It is not a diagnosis or treatment guide, and it does not give advice on pacing or exercise.

## How does it work?

The autonomic nervous system adjusts heart rate and blood vessels from moment to moment, for example when you stand up. HRV measures such as [RMSSD](/science/concepts/rmssd) are read as reflecting vagally mediated changes in heart rate. If an infection disturbs this control, HRV might change.

The picture is mixed. In one study, people with long COVID and dizziness on standing had lower HRV lying down, but their HRV response to standing up was normal [S2]. Another study found that long COVID subgroups differ: people with POTS, people whose blood pressure drops on standing, and people with no such problem showed different autonomic patterns [S3]. So "long COVID" is not one autonomic condition.

## How is it measured?

Some studies record HRV in a clinic, lying down and then standing [S2, S3]. Others use wearables over days or weeks in daily life and sleep [S4, S5]. These measure different things, and results depend on the test. Recording length, setting, breathing and analysis all affect HRV values, which makes the studies hard to compare [S7].

## What affects it?

Fatigue, poor sleep, reduced activity, fitness lost during illness, medication and breathing all change HRV, and all of them are common in long COVID [S4, S5, S7]. That makes it hard to say how much of a lower HRV comes from the condition itself. Changes during and after infection are covered in [Illness and HRV](/science/mechanisms/illness-and-hrv).

## What does the evidence show?

**Pooled studies: context-dependent, only a trend.** A meta-analysis of studies comparing people with post-COVID condition and healthy controls found a trend towards lower HRV that was not statistically significant, with high heterogeneity and a high risk of bias in most studies [S1]. The authors describe a possible association.

**Single studies: context-dependent.** Resting HRV was lower in one long COVID group, but the response to standing was normal [S2]. In another study, long COVID subgroups, including people with POTS, showed different patterns [S3].

**Daily life and exercise: emerging.** In a wearable study, HRV was lower in long COVID than in controls during daily activities and sleep, and it stayed lower for a day after exercise around and above the first ventilatory threshold, the intensity where breathing starts to rise faster [S4]. The authors link this to post-exertional malaise, but this is their interpretation.

**Day-to-day tracking: emerging.** In a small wearable study, nightly HRV did not follow day-to-day symptoms within the same person; it mainly differed between people with higher and lower symptom burden [S5].

**Detection models: research stage.** A machine-learning model that added wearable heart rate features to symptoms detected long COVID better than symptoms alone in one research dataset [S6]. This is not a validated diagnostic test.

**Unknown.** Whether HRV can diagnose long COVID or POTS, guide treatment, or predict who recovers.

## What it does not tell you

- **Not a diagnosis.** No HRV value shows whether someone has long COVID or POTS; POTS is diagnosed by a clinician with a standing test [S1, S3].
- **Not a daily symptom meter.** In a small study, nightly HRV did not track day-to-day symptoms [S5].
- **Not an exercise prescription.** The findings about HRV after harder exercise are observational and are not a tested rule for pacing [S4].
- **Not about one night.** {{fact:claim.hrvNotStress}} [S7].
- **When to seek help.** If symptoms last for weeks after an infection, or you feel faint, have chest pain or a racing heart on standing, see a doctor.

## In ONDA

ONDA builds a personal baseline from the values stored in Apple Health [S8]. The window is {{fact:baseline.window}}, and {{fact:baseline.compare}}. A value outside your corridor describes a change in your own data, not its cause. ONDA does not diagnose long COVID or POTS and does not replace a doctor.

> Educational information, not a diagnosis or medical treatment.
