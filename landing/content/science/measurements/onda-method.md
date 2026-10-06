---
kind: measurements
slug: onda-method
title: "How ONDA Measures and Interprets Your Body's Signals"
metaTitle: "How ONDA Measures and Reads Your Body Signals"
metaDescription: "Where ONDA gets its data, how it builds your personal baseline and signals, what stays on your phone, and the limits of every number it shows."
shortAnswer: >
  ONDA reads heart rate variability, resting heart rate and breathing rate from
  Apple Health, and can take a fingertip pulse with the iPhone camera. It builds
  a personal corridor from your own nights and points out nights that fall well
  outside it. These are descriptive comparisons, not a diagnosis. ONDA has run
  no accuracy or efficacy study of its own, and its numbers are only as good as
  the device that recorded them.
keyPoints:
  - "ONDA reads heart rate variability as SDNN, resting heart rate and breathing rate from Apple Health, written by Apple Watch or another device that syncs there; it only reads, never writes."
  - "The iPhone camera gives a pulse reading and a breathing estimate, not heart rate variability, and the live coherence score does not work on the camera."
  - "Your baseline and signals compare you with your own recent nights, never with a population norm, and they stay silent until enough nights exist."
  - "A signal needs a large change measured in your own spread and a minimum absolute or relative change, so small wobbles are ignored."
  - "The baseline, signals and reports are calculated on your phone. Starting with version 1.9.3, practice progress stays on the device without an account and syncs only after you sign in, and the diary is device-only."
  - "ONDA is not a medical device, has no published study of its own on accuracy or benefit, and does not diagnose anything."
imageAlt: "Three input lines, a wave, a row of ticks and a row of dots, merge inside a rounded frame into one line in a pale green band with marked points, leading to a small square."
imagePrompt: "Minimal scientific illustration on a clean white background with a faint light grid: three thin dark input lines on the left (a gentle wave, a row of short vertical ticks, a row of dots) enter a large rounded rectangle and merge into one horizontal line running through a soft pale green band with a few small dots and one brighter green dot, then leave as a dashed line to a small empty square; generous empty space, abstract and schematic, no text, no numbers, no people, no devices, light and calm, wide."
image: "/images/science/measurements-onda-method.png"
editor: "Yakiv Bilenko"
reviewer: null
lastReviewed: null
related:
  tools: [hrv]
  science: [measurements/heart-rate-variability, measurements/resting-heart-rate, measurements/respiratory-rate, concepts/hrv-baseline, concepts/interpreting-hrv, mechanisms/hrv-day-to-day]
sources:
  - id: S1
    cite: "ONDA — What ONDA measures"
    title: "What ONDA measures"
    url: "https://onda-life.com/measurements"
    type: product-documentation
  - id: S2
    cite: "Xu et al. (2026)"
    title: "Accuracy of Photoplethysmography-Derived Pulse Rate Variability Compared with Electrocardiography-Derived Heart Rate Variability: A Systematic Review and Meta-Analysis"
    journal: "Sensors"
    year: 2026
    doi: "10.3390/s26165192"
    pmid: 42655500
    type: meta-analysis
  - id: S3
    cite: "Charlton et al. (2018)"
    title: "Breathing Rate Estimation From the Electrocardiogram and Photoplethysmogram: A Review"
    journal: "IEEE Reviews in Biomedical Engineering"
    year: 2018
    doi: "10.1109/RBME.2017.2763681"
    pmid: 29990026
    type: review
  - id: S4
    cite: "ONDA — How ONDA works"
    title: "How ONDA works"
    url: "https://onda-life.com/how-it-works"
    type: product-documentation
    note: "Product documentation, aligned with the app code on 2026-10-06."
evidenceMap:
  - claim: "ONDA reads heart rate variability (SDNN) from Apple Health, written by Apple Watch or another device that syncs heart data there."
    sources: [S1]
    class: established
    claimType: device
    quote: "reads heart-rate variability (HRV, SDNN) from Apple Health — written there by an Apple Watch or by another device that syncs heart data to Apple Health"
    limitation: "Describes app behaviour only; ONDA does not compute SDNN itself and cannot check how the recording device did."
  - claim: "The iPhone camera gives a resting pulse and a breathing estimate; heart rate variability appears only with a watch or another tracker writing it to Apple Health."
    sources: [S1]
    class: established
    claimType: device
    quote: "the iPhone camera measures your resting pulse and a breathing estimate; HRV appears once an Apple Watch (or another tracker writing HRV to Apple Health) is connected"
    limitation: "Describes app behaviour only; not a validation of the camera reading."
  - claim: "ONDA builds a personal baseline (fact baseline.window), compares nights with a personal corridor (fact baseline.compare), waits for enough nights (fact baseline.minNights), and requires minimum changes (fact baseline.floors); the traffic light uses a longer corridor (fact baseline.corridor)."
    sources: [S1]
    class: established
    claimType: device
    quote: "ONDA’s signals are descriptive comparisons with your own baseline — interpretations to guide practice, not measurements of stress and not a medical assessment."
    limitation: "Product documentation; the thresholds are ONDA design choices, not clinically validated cut-offs."
  - claim: "ONDA is not a medical device and does not diagnose or monitor any condition."
    sources: [S1]
    class: established
    claimType: regulatory
    quote: "It does not diagnose, treat or monitor any medical condition and is not a substitute for medical care."
    limitation: "Positioning statement; not a regulatory classification by any authority."
  - claim: "Pulse-signal (PPG) variability agrees with ECG mainly at rest and in controlled conditions, and should not be treated as interchangeable with ECG."
    sources: [S2]
    class: context-dependent
    claimType: measurement
    quote: "the pooled estimates should not be generalized to sleep, exercise, stress, or free-living settings or interpreted as evidence of interchangeability"
    limitation: "Ten studies in the quantitative synthesis, healthy adults, mostly at rest; not specific to the iPhone camera."
  - claim: "Breathing rate can be estimated from the ECG or the pulse signal by many different algorithms."
    sources: [S3]
    class: established
    claimType: measurement
    quote: "A plethora of algorithms have been proposed to estimate BR from the electrocardiogram (ECG) and pulse oximetry (photoplethysmogram, PPG) signals."
    limitation: "A methods review; it does not validate any consumer device or ONDA's estimate."
  - claim: "ONDA limits deviation signals (fact onda.signal.cadence) and sends calm check-ins on a fixed cadence (facts onda.checkin.steadyCadence, onda.checkin.dailyCap, onda.checkin.noWatchCadence)."
    sources: [S1]
    class: established
    claimType: device
    quote: "ONDA’s signals are descriptive comparisons with your own baseline"
    limitation: "Product documentation; the cadence values are ONDA design choices, not clinical recommendations."
---

## What is ONDA's method?

ONDA is a breathing and biofeedback app. It reads signals that other devices have already recorded, compares them with your own history and shows you where a night stands. This page describes that method as it is written in the app, including where it stops. It is a description of a product, not a scientific finding, and every rule below is a design choice rather than a validated clinical threshold.

## Where does the data come from?

**Apple Health.** With your permission, ONDA reads heart rate variability, resting heart rate and breathing rate from Apple Health. Heart rate variability arrives as SDNN, the form Apple Health stores it in, and ONDA does not recompute it from beat intervals. The values are written by Apple Watch or by another device whose app syncs heart data to Apple Health [S1]. ONDA only reads; it never writes anything to Apple Health. It also reads sleep timing for its sleep-regularity view and a few single values around the baseline, such as walking heart rate and an estimated aerobic fitness value, when Health holds them.

**The iPhone camera.** With a fingertip over the rear camera, ONDA estimates your pulse from the colour changes in the skin, and a breathing estimate from the rhythm of that pulse. The camera gives a pulse, not heart rate variability: until a watch or another tracker writes heart rate variability to Apple Health, that part of the baseline stays empty [S1]. The live coherence score is also unavailable on the camera; it appears only with an Apple Watch.

**What ONDA does not measure.** It does not record an ECG, blood pressure, blood oxygen, temperature, brain activity, hormones or blood markers, and it does not score sleep stages or give a single readiness number. See [what ONDA measures](/measurements) for the full register.

## How is your baseline built?

The baseline is the range your own body usually sits in. ONDA builds it over {{fact:baseline.window}} from nightly values in Apple Health [S1, S4]. Starting with version 1.9.3, the heart rate variability chart shows that whole window as soon as Apple Health access is granted, instead of filling in night by night. Nights with too few samples are dropped before any calculation, and heart rate variability is taken only from overnight samples.

For signals, {{fact:baseline.compare}} [S1]. ONDA stays silent until it has at least {{fact:baseline.minNights}}, so early weeks show a baseline that is still building rather than a judgement. The minimum changes it requires are: {{fact:baseline.floors}}.

In Simple mode the same rule drives a traffic light. Its corridor uses {{fact:baseline.corridor}} of nights, so that a few unusual nights barely move it. Green means every signal is inside your corridor; yellow means one night outside; red means two or more nights in a row outside. These colours describe distance from your own history. They do not grade your health. For how to read such comparisons, see [your HRV baseline](/science/concepts/hrv-baseline) and [interpreting HRV](/science/concepts/interpreting-hrv).

## When does ONDA show a signal?

A signal appears when last night's resting heart rate rose, heart rate variability fell, or breathing rate rose past both the spread gate and the minimum change described above. If several signals moved, ONDA shows only the largest one. Signals are limited to {{fact:onda.signal.cadence}}, and the notification carries no numbers; the numbers are in the app.

When your nights stay inside the corridor, ONDA sends a calm check-in instead, {{fact:onda.checkin.steadyCadence}}, with {{fact:onda.checkin.dailyCap}}. Without watch data, check-ins come {{fact:onda.checkin.noWatchCadence}}. Calm check-ins can be turned off in Settings.

Nightly values move for ordinary reasons such as alcohol, a late meal, training, travel or a short night, which is why one night is never read as a verdict. See [why HRV changes from day to day](/science/mechanisms/hrv-day-to-day).

## What do you see during a practice?

{{fact:onda.practice.livePulse}}. With a watch, ONDA also shows a coherence score: how strongly your heart rate rises and falls with your breathing over a rolling window. It is a feedback metric for the practice, not a clinical biomarker, and it is not comparable between people. The live breathing value is an estimate from the pulse rhythm. The live waveform is not heart rate variability in the RMSSD or SDNN sense.

## What is stored, and where?

The baseline, the signals, the traffic light and the check-ins are calculated on your phone. The camera frames used for pulse are processed in memory and are not saved or sent. Starting with version 1.9.3, your practice progress is kept on the device even without an account; if you sign in, it is also synced to your account so it survives a reinstall. Starting with version 1.9.3, the diary, including voice notes and camera pulse checks saved to it, is device-only and is not synced. A PDF or HTML report is generated on the phone and leaves it only if you share it yourself.

## What it does not tell you

ONDA has not published a study of its own on the accuracy of its readings or on whether its practices change health outcomes. What ONDA knows about accuracy comes from studies of the underlying technologies, not of ONDA.

Accuracy depends on the device that recorded the data and on the conditions. Pulse-based variability agrees with ECG mainly at rest and in controlled conditions, and the evidence does not support treating the two as interchangeable [S2]. Breathing rate can be estimated from the pulse signal, but by many different algorithms with different performance [S3]. A fingertip camera reading is more sensitive to movement, pressure and light than a chest ECG, so treat it as an estimate. For device differences, see [heart rate variability as a measurement](/science/measurements/heart-rate-variability), [resting heart rate](/science/measurements/resting-heart-rate) and [respiratory rate](/science/measurements/respiratory-rate).

The baseline and signals are statistical comparisons with your own past. They are not a diagnosis, and ONDA is not a medical device: it does not diagnose, treat or monitor any condition [S1]. A green light does not mean you are well, and a red one does not mean you are ill. If you feel unwell, have chest pain, fainting or severe breathlessness, seek medical care whatever the app shows.

## How does ONDA treat evidence?

The [ONDA Science](/science) section explains the physiology behind these signals. Its pages cite sources that have been checked against PubMed or Crossref, use approved wording for numbers and for claims about ONDA, and separate established findings from emerging or debated ones. Pages are edited by [Yakiv Bilenko](/people/yakiv-bilenko).

> Educational information, not a diagnosis or medical treatment.
