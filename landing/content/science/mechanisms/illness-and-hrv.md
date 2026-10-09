---
kind: mechanisms
slug: illness-and-hrv
title: "Illness and HRV: What a Wearable Can and Cannot See"
metaTitle: "Illness and HRV: Early Signal, Not a Diagnosis"
metaDescription: "How inflammation and infection move HRV and resting heart rate, what wearable alerts actually mean, and why they cannot tell you that you are ill."
shortAnswer: >
  Inflammation and infection tend to lower heart rate variability and raise
  resting heart rate, but the link is still a research finding, not a test. The
  best-studied early warnings of infection came from a rise in resting heart
  rate, together with changes in steps and sleep, rather than from heart rate
  variability. The same alerts also appear after stress, alcohol and travel. At
  most, such a change is a non-specific early signal that the body is under
  strain.
keyPoints:
  - "In wearable studies, lower heart rate variability, especially SDNN, went together with higher levels of the inflammation marker CRP, and the reviewers call wearable HRV an exploratory biomarker, not a diagnostic tool."
  - "The best-studied early warnings of infection relied on resting heart rate against a person's own baseline, together with steps and sleep, not on heart rate variability."
  - "In a prospective smartwatch study, alerts appeared before symptoms in most infected participants, but stress, alcohol and travel triggered alerts too."
  - "After vaccination, short changes in heart rate variability recovered within a few days in the studies reviewed, with larger changes in women and younger people."
  - "After an infection, heart rate data added only a little to symptoms for recognising Long COVID in one research study."
  - "A review of the field says that the ability of wearables to detect viral infections in everyday life has yet to be proven."
  - "A wearable alert is a non-specific sign of strain; ONDA shows your trend against your own baseline and does not identify illness."
image: "/images/science/mechanisms-illness-and-hrv.jpg"
imageAlt: "A thin teal heart-rhythm line on a dark background turns into a glowing orange wave next to a faint thermometer outline, then returns to calm beats."
imagePrompt: "Minimal scientific line illustration on a dark navy background, 16:9 landscape: a single thin teal heart-rhythm trace running horizontally; in the middle it flattens and then becomes a short burst of tight, warm orange-coral oscillations with a soft glow, next to a faint thin outline of a thermometer; on the right the trace returns to calm teal beats; lots of empty space, no text, no numbers, no people, no devices."
editor: "Yakiv Bilenko"
reviewer: null
lastReviewed: null
related:
  glossary: [heart-rate-variability]
  articles: [what-to-do-after-low-hrv-reading, dysautonomia-long-covid-breathing]
  tools: [baseline]
  science: [mechanisms/hrv-day-to-day, concepts/interpreting-hrv, mechanisms/sleep-and-hrv, mechanisms/alcohol-and-hrv, measurements/resting-heart-rate, measurements/respiratory-rate, concepts/hrv-baseline]
sources:
  - id: S1
    cite: "Siswishanto et al. (2026)"
    title: "Clinical Evidence of Wearable-Derived Heart Rate Variability for Detecting Systemic Inflammation: A Systematic Review"
    journal: "Diagnostics"
    year: 2026
    doi: "10.3390/diagnostics16040538"
    pmid: 41750686
    type: systematic-review
    note: "Synthesis without meta-analysis (vote counting); no diagnostic accuracy data in the included studies; part of the first author's doctoral thesis; no industry ties declared"
  - id: S2
    cite: "Mishra et al. (2020)"
    title: "Pre-symptomatic detection of COVID-19 from smartwatch data"
    journal: "Nature Biomedical Engineering"
    year: 2020
    doi: "10.1038/s41551-020-00640-6"
    pmid: 33208926
    type: observational
    note: "Retrospective analysis, Stanford (Snyder lab); Fitbit promoted the study and donated devices, Google covered cloud costs; the senior author co-founded and advises several health-technology companies (Personalis, Qbio, January, SensOmics, Protos, Mirvie, Oralome)"
  - id: S3
    cite: "Alavi et al. (2022)"
    title: "Real-time alerting system for COVID-19 and other stress events using wearable data"
    journal: "Nature Medicine"
    year: 2022
    doi: "10.1038/s41591-021-01593-2"
    pmid: 34845389
    type: observational
    note: "Prospective cohort, same Stanford group as Mishra 2020; funded by NIH grants, gifts and cloud credits (Amazon Web Services, Google); the senior author co-founded and advises several health-technology companies"
  - id: S4
    cite: "Uwakwe et al. (2025)"
    title: "Longitudinal wearable sensor data enhance precision of Long COVID detection"
    journal: "PLOS Digital Health"
    year: 2025
    doi: "10.1371/journal.pdig.0001093"
    pmid: 41264615
    type: observational
    note: "Machine-learning modelling in one cohort without external validation; same Stanford group; the senior author co-founded and advises several health-technology companies, the other authors declare none"
  - id: S5
    cite: "Kwon & Lee (2022)"
    title: "Impact of COVID-19 Vaccination on Heart Rate Variability: A Systematic Review"
    journal: "Vaccines"
    year: 2022
    doi: "10.3390/vaccines10122095"
    pmid: 36560505
    type: systematic-review
    note: "Small evidence base of observational studies of limited quality; authors declare no conflict of interest"
  - id: S6
    cite: "Goergen et al. (2022)"
    title: "Detection and Monitoring of Viral Infections via Wearable Devices and Biometric Data"
    journal: "Annual Review of Biomedical Engineering"
    year: 2022
    doi: "10.1146/annurev-bioeng-103020-040136"
    pmid: 34932906
    type: review
    note: "Narrative review; three of the seven authors were employees of physIQ, a company that analyses wearable data, and one also consulted for Tempus and received research funding from Janssen"
  - id: S7
    cite: "ONDA — product documentation: How ONDA works"
    title: "How ONDA works"
    url: "https://onda-life.com/how-it-works"
    type: product-documentation
evidenceMap:
  - claim: "Across wearable studies, SDNN was mostly lower when the inflammation marker CRP was raised (facts illness.inflammation.studies, illness.inflammation.sdnnCrp)."
    sources: [S1]
    class: emerging
    claimType: physiology
    quote: "SDNN showed a predominantly inverse association with CRP, with 83% of comparisons indicating reduced SDNN in the presence of elevated CRP (sign test p = 0.031)."
    limitation: "Vote counting across heterogeneous observational studies; no pooled effect; associations, not cause."
  - claim: "Associations between RMSSD and inflammatory cytokines were inconsistent."
    sources: [S1]
    class: emerging
    claimType: physiology
    quote: "In contrast, associations between RMSSD and inflammatory cytokines were heterogeneous and largely non-significant."
    limitation: "Few cytokine studies; different devices and recording lengths."
  - claim: "The reviewers consider wearable HRV an exploratory or adjunctive biomarker of inflammation, not a diagnostic tool."
    sources: [S1]
    class: emerging
    claimType: physiology
    quote: "At present, wearable HRV should be considered an exploratory or adjunctive biomarker, pending validation in standardized longitudinal studies with formal diagnostic performance assessment."
    limitation: "Author conclusion; no study reported diagnostic accuracy."
  - claim: "In a retrospective smartwatch analysis, most people with COVID showed changes in heart rate, steps or sleep, and an alert system based on a rise in resting heart rate against the personal baseline could have flagged many cases before symptoms (facts illness.mishra.cohort, illness.mishra.realtime)."
    sources: [S2]
    class: emerging
    claimType: physiology
    quote: "Using retrospective smartwatch data, we show that 63% of the COVID-19 cases could have been detected before symptom onset in real time via a two-tiered warning system based on the occurrence of extreme elevations in resting heart rate relative to the individual baseline."
    limitation: "Single study with few infected people; retrospective simulation; detection used resting heart rate, steps and sleep, not HRV."
  - claim: "In a prospective study, a real-time smartwatch alert system based on heart rate and steps flagged most infections, typically a few days before symptoms (facts illness.alavi.cohort, illness.alavi.alerts, illness.alavi.lead)."
    sources: [S3]
    class: emerging
    claimType: physiology
    quote: "this system generated alerts for pre-symptomatic and asymptomatic SARS-CoV-2 infection in 67 (80%) of the infected individuals"
    limitation: "Single cohort from the same group as the retrospective study; infection confirmed by tests, not by the device; heart rate and steps, not HRV."
  - claim: "Stress, alcohol, travel and other respiratory infections also triggered alerts, less often than COVID did (fact illness.alavi.otherEvents)."
    sources: [S3]
    class: emerging
    claimType: physiology
    quote: "other respiratory infections as well as events not associated with infection, such as stress, alcohol consumption and travel, could also trigger alerts, albeit at a much lower mean frequency"
    limitation: "Event causes self-reported in surveys; alert frequency depends on the algorithm and its thresholds."
  - claim: "After COVID vaccination, HRV, mostly RMSSD, changed for a short time and recovered within a few days (facts vaccine.kwon.studies, vaccine.kwon.recovery)."
    sources: [S5]
    class: emerging
    claimType: physiology
    quote: "These studies reported short-term changes and rapid recovery in HRV parameters within up to 3 days after COVID-19 vaccination."
    limitation: "Few observational studies of limited quality; long-term HRV not reported."
  - claim: "In some of the studies, the change in RMSSD after vaccination was larger in women than in men and in younger than in older people."
    sources: [S5]
    class: emerging
    claimType: physiology
    quote: "Some studies showed that the impact of COVID-19 vaccinations on RMSSD was greater in women than men, and in the younger group than in the older group."
    limitation: "Reported by only some of the studies; small samples."
  - claim: "In one cohort, adding heart rate features from a wearable to symptoms improved a machine-learning model for recognising Long COVID only modestly (facts longcovid.uwakwe.cohort, longcovid.uwakwe.gain)."
    sources: [S4]
    class: emerging
    claimType: physiology
    quote: "These values represent a significant improvement of approximately 5% in both the ROC-AUC and PR-AUC over the symptoms-only model."
    limitation: "Single cohort; no external validation; machine-learning results tend to look better than they turn out in new data; research tool, not a clinical test."
  - claim: "A review of the field states that viral infections can change heart rate, breathing rate, HRV, temperature, activity and sleep before symptoms."
    sources: [S6]
    class: emerging
    claimType: physiology
    quote: "viral infections can lead to detectable changes in an individual's normal physiologic and behavioral metrics, including heart and respiration rates, heart rate variability, temperature, activity, and sleep prior to symptom onset"
    limitation: "Narrative review; mostly pandemic-era studies; some authors employed by a wearable-analytics company."
  - claim: "The same review states that the ability of wearables to detect viral infections in a real-world setting has not been proven."
    sources: [S6]
    class: unknown
    claimType: physiology
    quote: "the ability of wearable devices to detect viral infections in a real-world setting has yet to be proven"
    limitation: "Written before the prospective study above was published in its final form; that study does not test everyday use outside a research cohort."
  - claim: "ONDA builds its baseline from nightly Apple Health values and compares each night with the user's own corridor (facts baseline.window, baseline.compare, baseline.floors, onda.signal.cadence)."
    sources: [S7]
    class: established
    claimType: device
    quote: "From nightly Apple Health values — HRV, resting heart rate and breathing rate — ONDA builds your personal baseline"
    limitation: "Describes app behaviour only; not evidence for any health claim."
---

## Why can illness move HRV?

Heart rate variability (HRV) is the beat-to-beat variation in the interval between heartbeats. Inflammation, the body's response to infection or injury, is thought to shift the balance of the autonomic nervous system: less vagal activity and more sympathetic activity. That is why researchers ask whether HRV from a wearable can reflect inflammation.

The only systematic review of this question pooled the direction of findings from {{fact:illness.inflammation.studies}} [S1]. When the inflammation marker CRP (C-reactive protein) was raised, SDNN was lower in {{fact:illness.inflammation.sdnnCrp}} [S1]. For RMSSD and inflammatory cytokines the results were mixed and mostly not significant [S1]. Devices that recorded an ECG gave more consistent results than optical pulse sensors [S1].

The reviewers draw a careful conclusion. At present, wearable HRV should be considered "an exploratory or adjunctive biomarker" [S1]. None of the included studies tested how accurately HRV can recognise inflammation [S1]. So the link is real at the level of groups, but it is a research finding, not a test.

## What has picked up infection early?

This is the key point of this page: the best-studied early warnings of infection did not run on HRV. They ran on resting heart rate compared with the person's own baseline, together with daily steps and sleep ([resting heart rate](/science/measurements/resting-heart-rate)).

A retrospective analysis from Stanford looked at smartwatch data from {{fact:illness.mishra.cohort}} [S2]. Most of them had changes in heart rate, daily steps or time asleep around the illness [S2]. An alert system based on a sharp rise in resting heart rate against the personal baseline could have flagged {{fact:illness.mishra.realtime}} before symptoms began [S2]. This is a single study with few infected people, and the alerts were simulated afterwards, not sent in real time.

The same group then tested real-time alerts in a prospective study of {{fact:illness.alavi.cohort}} [S3]. The system used heart rate and steps from smartwatches [S3]. It sent alerts before or without symptoms in {{fact:illness.alavi.alerts}}, and the first signals came {{fact:illness.alavi.lead}} [S3]. Infection was confirmed by tests, not by the watch.

These are three studies from one research group, so they are not independent confirmations of each other. In the first study, Fitbit promoted the study and donated devices, and the senior author of all three studies co-founded and advises several health-technology companies [S2] [S3] [S4]. Wearable studies of breathing rate during COVID point in a similar direction ([breathing rate](/science/measurements/respiratory-rate)).

## What does an alert actually mean?

<!-- myth-debunk -->
A common belief is that a drop in HRV or a device alert means you are getting sick. The prospective study shows why this does not follow. Other respiratory infections, and also events with no infection at all, such as stress, alcohol and travel, triggered alerts too [S3]. They did so less often: {{fact:illness.alavi.otherEvents}} [S3]. An alert says that something deviates from your usual pattern, not what caused it.

A night after drinking is a typical example: HRV falls and resting heart rate rises, with no illness involved ([alcohol and HRV](/science/mechanisms/alcohol-and-hrv)). Short sleep, a late meal, hard training and travel move the same numbers ([why HRV changes from day to day](/science/mechanisms/hrv-day-to-day); [HRV and heart rate during sleep](/science/mechanisms/sleep-and-hrv)). {{fact:claim.hrvNotStress}}.

## What about vaccination?

A vaccine is a planned challenge to the immune system, so it shows what a short immune reaction does to HRV. A systematic review found {{fact:vaccine.kwon.studies}} that measured HRV after COVID vaccination [S5]. HRV, mostly RMSSD, changed for a short time and recovered {{fact:vaccine.kwon.recovery}} after vaccination [S5]. In some of the studies the change was larger in women than in men, and in younger than in older people [S5]. The studies were few and their quality was limited, and long-term HRV was not reported [S5]. A short dip in the days after a vaccination fits this pattern. The review does not evaluate vaccination itself, and neither does this page.

## What about the time after an illness?

Some people have symptoms for months after an infection, which is called Long COVID. The Stanford group built machine-learning models from heart rate data of {{fact:longcovid.uwakwe.cohort}} [S4]. Adding heart rate features to symptoms gave {{fact:longcovid.uwakwe.gain}} [S4]. The authors see a possible objective biomarker in this [S4]. It is a single cohort without testing in new people, so the result is a research direction, not a way to recognise Long COVID with a watch.

## What does the evidence show?

**What we don't know.** A review of the field, written by researchers who work with wearable data, says that viral infections can change heart rate, breathing rate, HRV, temperature, activity and sleep before symptoms [S6]. It also says that "the ability of wearable devices to detect viral infections in a real-world setting has yet to be proven" [S6]. Three of its authors were employees of physIQ, a company that analyses wearable data [S6].

**By evidence class.**

- **Emerging.** Wearable SDNN tends to be lower when CRP is raised [S1]. A rise in resting heart rate against the personal baseline preceded symptoms in many infections in research cohorts [S2] [S3]. Stress, alcohol and travel trigger the same alerts [S3]. HRV changes after vaccination are short and recover within days [S5]. Heart rate data added little to symptoms for Long COVID in one study [S4].
- **Unknown.** Whether a consumer wearable can reliably detect a viral infection in everyday life [S6].

## What it does not tell you

- **A wearable does not diagnose an infection.** The reviewers call wearable HRV an exploratory biomarker [S1], and real-world detection has not been proven [S6].
- **An alert does not tell you the cause.** Infection, stress, alcohol and travel can produce the same change [S3].
- **HRV was not the main early signal.** The best-studied early warnings relied on resting heart rate, steps and sleep [S2] [S3].
- **A normal number does not rule out illness.** Many infected people in the studies had no alert [S3].
- **It gives no advice on tests, treatment or vaccination.**
- **Population data are not a prediction for you.** The studies describe groups of people; your own pattern may differ.

## What can you do with a sharp dip?

If your HRV is clearly below your usual range and your resting heart rate is higher for several days in a row, treat it as a non-specific early signal that the body is under strain. It is a reason to rest and to watch how you feel. If you have symptoms, see a doctor rather than relying on your watch. A single low night is usually not a cause for concern ([interpreting HRV](/science/concepts/interpreting-hrv)).

## In ONDA

ONDA builds a personal baseline from nightly values stored in Apple Health — from Apple Watch or another device that syncs heart data there [S7]. The window is {{fact:baseline.window}}, and {{fact:baseline.compare}}: {{fact:baseline.floors}}, with {{fact:onda.signal.cadence}}. {{fact:applewatch.hrv.healthkit}}, so ONDA's HRV trend is an SDNN trend ([your HRV baseline](/science/concepts/hrv-baseline)). Such a signal is descriptive: it says that a night is outside your own corridor, not why. An infection, a short night, alcohol or travel can all produce it. ONDA does not identify illness, does not diagnose any condition and does not replace a doctor.

> Educational information, not a diagnosis or medical treatment.
