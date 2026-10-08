---
kind: measurements
slug: heart-rate-variability
title: "Can You Trust HRV From a Smartwatch or Ring?"
metaTitle: "Wearable HRV: Can You Trust a Watch or Ring?"
metaDescription: "Smartwatch and ring HRV is an estimate from the pulse signal, not an ECG reading. Where the two agree, where they diverge, and how to read your numbers."
shortAnswer: >
  Wearable HRV can be useful, but it is not automatically the measurement an
  ECG would give. Most smartwatches and rings estimate beat-to-beat variability
  from an optical pulse signal. Evidence shows good agreement with ECG for
  some measures under controlled resting conditions, and clear limits under
  movement, across metrics and across devices. The soundest use is a consistent
  personal trend, not a universally interchangeable number.
keyPoints:
  - "ECG and PPG measure different signals: ECG records the heart's electrical activity, while PPG estimates beat timing from pulse waves at the skin."
  - "PPG-derived pulse rate variability can agree well with ECG-derived HRV for selected metrics under controlled resting conditions — the agreement is conditional, not universal."
  - "Motion, sensor contact, peripheral perfusion, recording window, metric choice and proprietary processing all shape a wearable's HRV numbers."
  - "Two devices can legitimately report different HRV values without either being wrong; they may not be reporting the same metric from comparable windows."
  - "RMSSD and SDNN summarize different properties of a recording, and their numbers are not interchangeable."
  - "Your own trend, measured consistently with the same device and method, is usually more informative than comparing absolute values across devices."
  - "HRV is a physiological measurement, not a diagnosis; a single low or high reading establishes nothing by itself."
image: "/images/science/measurements-heart-rate-variability.png"
imageAlt: "An ECG trace above a smoother pulse wave, with dashed lines matching each heartbeat; a blurred, noisy stretch of the pulse wave shows where the optical estimate loses track."
imagePrompt: "Minimal scientific illustration on a clean white background: two thin teal waveform lines running horizontally in parallel across the middle third of the frame — the upper trace an ECG-like rhythm with sharp, evenly spaced peaks, the lower trace a smoother pulse-like wave with softer rounded peaks that follows the same rhythm with a slight delay and slightly different peak heights, the two traces clearly related yet visibly not identical; thin strokes in a single teal accent with a soft cyan glow, at most a hint of one muted desaturated teal for depth, no axes, no frame, no grid, generous empty space above and below, abstract, schematic, precise, medically neutral, no text, no numbers, no labels, no logos, no people, no faces, no hands, no devices, no watches, no rings, no phones, no dark background, no neon, no heavy gradients, no decorative particles, light and calm, 4:3."
editor: "Yakiv Bilenko"
reviewer: null
lastReviewed: null
related:
  glossary: [heart-rate-variability]
  articles: [hrv-different-every-device, apple-watch-recovery-hrv-vs-overall-hrv, how-to-measure-hrv-consistently]
  tools: [hrv]
  science: [concepts/rmssd, concepts/sdnn, mechanisms/exercise-and-hrv]
relatedPlanned: [concepts/heart-rate-variability, concepts/hrv-baseline, measurements/resting-heart-rate, mechanisms/breathing-and-hrv, evidence/hrv-biofeedback]
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
    cite: "Xu et al. (2026)"
    title: "Accuracy of photoplethysmography-derived pulse rate variability compared with electrocardiography-derived heart rate variability: a systematic review and meta-analysis"
    journal: "Sensors"
    year: 2026
    doi: "10.3390/s26165192"
    pmid: 42655500
    type: meta-analysis
  - id: S4
    cite: "Zuern et al. (2026)"
    title: "Validation of photoplethysmography-derived short-term heart rate variability using a wearable device"
    journal: "Scientific Reports"
    year: 2026
    doi: "10.1038/s41598-026-52700-7"
    pmid: 42151374
    type: observational
  - id: S5
    cite: "Carter et al. (2026)"
    title: "Guidelines for rigor and reproducibility of heart rate variability within human cardiovascular research"
    journal: "Am J Physiol Heart Circ Physiol"
    year: 2026
    doi: "10.1152/ajpheart.00041.2026"
    pmid: 42495990
    type: guideline
  - id: S6
    cite: "Apple Inc. — HealthKit documentation"
    title: "heartRateVariabilitySDNN"
    url: "https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/heartratevariabilitysdnn"
    type: official
  - id: S7
    cite: "Apple Newsroom (2026)"
    title: "Apple advances health and fitness capabilities using Apple Intelligence"
    url: "https://www.apple.com/newsroom/2026/09/apple-advances-health-and-fitness-capabilities-using-apple-intelligence/"
    year: 2026
    type: official
  - id: S8
    cite: "Apple Inc. — HealthKit documentation"
    title: "heartRateVariabilityRMSSD (iOS/watchOS 27)"
    url: "https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/heartratevariabilityrmssd"
    type: official
  - id: S9
    cite: "Dial et al. (2025)"
    title: "Validation of nocturnal resting heart rate and heart rate variability in consumer wearables"
    journal: "Physiological Reports"
    year: 2025
    doi: "10.14814/phy2.70527"
    pmid: 40834291
    type: observational
  - id: S10
    cite: "Dial et al. (2025), letter"
    title: "Contextual equivalence for accurate comparison of wearables requires transparency"
    journal: "Physiological Reports"
    year: 2025
    doi: "10.14814/phy2.70706"
    pmid: 41399178
    type: other
  - id: S11
    cite: "Blalock et al. (2026)"
    title: "Validity of the Polar H10 for heart rate variability and cardiac autonomic reflex tests"
    journal: "Autonomic Neuroscience"
    year: 2026
    doi: "10.1016/j.autneu.2026.103447"
    pmid: 42275859
    type: observational
  - id: S12
    cite: "Lambe et al. (2026)"
    title: "The accuracy of Apple Watch measurements: a living systematic review and meta-analysis"
    journal: "npj Digital Medicine"
    year: 2026
    doi: "10.1038/s41746-025-02238-1"
    pmid: 41513748
    type: meta-analysis
  - id: S13
    cite: "O'Grady et al. (2024)"
    title: "The Validity of Apple Watch Series 9 and Ultra 2 for Serial Measurements of Heart Rate Variability and Resting Heart Rate"
    journal: "Sensors"
    year: 2024
    doi: "10.3390/s24196220"
    pmid: 39409260
    type: observational
  - id: S14
    cite: "Ungaro et al. (2026)"
    title: "Disconnection Between Self-Reported Wellbeing and Heart Rate Variability from Wearables"
    journal: "Sensors"
    year: 2026
    doi: "10.3390/s26041325"
    pmid: 41755264
    type: observational
evidenceMap:
  - claim: "The reference method for HRV interval measurement is the ECG, which times the heart's electrical R peaks."
    sources: [S1, S4]
    class: established
    claimType: measurement
    quote: "While electrocardiography (ECG) remains the gold standard for HRV assessment, photoplethysmography (PPG)-based wearables offer an alternative for monitoring."
    limitation: "A methodological convention for interval measurement; it does not mean everyday tracking requires a clinical ECG."
  - claim: "Wearables estimate beat-to-beat variability from the peripheral pulse signal: PPG infers the timing of pulses at the skin from changes in blood volume, rather than recording the heart's electrical activity."
    sources: [S3]
    class: established
    claimType: measurement
    quote: "Photoplethysmography (PPG) provides one such approach by estimating beat-to-beat variability from peripheral pulse wave signals."
    limitation: "Describes the signal chain shared by wrist and ring sensors; it says nothing about the accuracy of any product."
  - claim: "ECG-derived HRV and PPG-derived PRV are related but not physiologically identical: pulse transit time, vascular tone, peripheral circulation, motion artifacts, sensor contact, skin optical properties and processing algorithms can all move a pulse-based value away from its electrical counterpart."
    sources: [S3]
    class: established
    claimType: measurement
    quote: "ECG-derived HRV is based on cardiac electrical R-R intervals, whereas PPG-derived PRV is derived from pulse wave intervals and may be influenced by pulse transit time, vascular tone, peripheral circulation, motion artifacts, sensor contact, skin optical properties, and signal-processing algorithms"
    limitation: "A physiological and methodological distinction; the size of the gap depends on the person, the measurement site and the conditions."
  - claim: "A systematic review and meta-analysis compared PPG-derived PRV with ECG-derived HRV in healthy or apparently healthy non-clinical populations, focusing on RMSSD and SDNN (facts study.xu2026.studiesQualitative and study.xu2026.studiesPooled)."
    sources: [S3]
    class: established
    claimType: other
    quote: "evaluated the accuracy of PPG-derived PRV compared with ECG-derived HRV in healthy or apparently healthy non-clinical populations, focusing on the root mean square of successive differences (RMSSD) and the standard deviation of normal-to-normal intervals (SDNN)"
    limitation: "Defines the scope of the pooled evidence: non-clinical populations; clinical populations sit outside it."
  - claim: "Where the data could be pooled, the meta-analysis found relatively small standardized errors for both RMSSD and SDNN."
    sources: [S3]
    class: context-dependent
    claimType: measurement
    quote: "The pooled absolute standardized error was 0.188 (95% CI: 0.066 to 0.309; I2 = 11.69%) for RMSSD and 0.134 (95% CI: 0.014 to 0.255; I2 = 0%) for SDNN."
    limitation: "A statistical agreement measure, not an accuracy percentage for any product; the pooled data came mostly from resting or controlled conditions."
  - claim: "The robustness of the pooled findings differed by metric: sensitivity analyses supported the RMSSD findings, while the SDNN estimates were directionally stable but less statistically robust."
    sources: [S3]
    class: context-dependent
    claimType: measurement
    quote: "Sensitivity analyses supported the robustness of RMSSD findings, whereas SDNN estimates were directionally stable but less robust in statistical significance."
    limitation: "About pooled estimates, not individual devices; few studies contributed to each metric's pool."
  - claim: "Pooled agreement estimates rest on a small quantitative base drawn mostly from resting or controlled conditions, and should not be generalized to sleep, exercise, stress or free-living settings, or read as evidence of interchangeability."
    sources: [S3]
    class: context-dependent
    claimType: measurement
    quote: "Because the quantitative synthesis included only 10 studies and was based predominantly on selected resting or controlled conditions, the pooled estimates should not be generalized to sleep, exercise, stress, or free-living settings or interpreted as evidence of interchangeability."
    limitation: "A boundary drawn by the review's authors about pooled estimates; it does not rule out good performance by a specific device in a specific setting."
  - claim: "Under controlled resting conditions, wrist-based PPG reproduced ECG-derived HRV indices closely enough for the authors to support selected parameters for short-term assessment (fact study.zuern2026.participants)."
    sources: [S4]
    class: context-dependent
    claimType: measurement
    quote: "Under controlled resting conditions, wrist-based PPG provides reliable HRV indices compared with ECG-derived HRV. These findings support the use of selected PPG-derived HRV parameters for short-term assessment in clinical settings."
    limitation: "One wrist-worn device in resting adults in sinus rhythm; three of the twelve co-authors are affiliated with the device manufacturer (the paper declares no competing interests); the authors themselves call for further real-world validation."
  - claim: "Agreement with ECG is metric-specific: in the controlled validation, short-term variability and entropy metrics agreed less well than interval-standard measures."
    sources: [S4]
    class: context-dependent
    claimType: measurement
    quote: "Weaker agreement appeared for short-term variability and entropy metrics."
    limitation: "Single study, single device; which metrics agree best is device- and condition-specific."
  - claim: "Signal quality gates the measurement: in the controlled validation, recording pairs with poor ECG or PPG quality — low perfusion or motion artifacts — were excluded from analysis."
    sources: [S4]
    class: context-dependent
    claimType: measurement
    quote: "Recording pairs with poor ECG or PPG signal quality were excluded from analysis, primarily due to low PPG perfusion or to the presence of motion artifacts."
    limitation: "Validation-grade filtering; consumer devices apply their own, mostly undocumented quality gates during everyday use."
  - claim: "The input signal, the length of the recording, the setting, breathing and the analytical approach all affect the rigor, reliability and interpretation of an HRV measurement."
    sources: [S5]
    class: guideline
    claimType: measurement
    quote: "the HRV input signal (e.g., electrocardiography vs. photoplethysmography), length of recording, location of recordings (i.e., laboratory vs. field), respiratory rate and depth, and analytical approaches (i.e., time vs. frequency domain) can all impact rigor, reliability, and study interpretations"
    limitation: "Expert consensus about methods; the size of each effect is condition- and person-specific."
  - claim: "Findings from wearable HRV — including in research — should be interpreted and contextualized within the method's limitations."
    sources: [S5]
    class: guideline
    claimType: measurement
    quote: "Finally, with respect to the rapid advancements of HRV assessment using wearable technology, investigators should interpret and contextualize findings within the limitations outlined in this guideline review."
    limitation: "Interpretation guidance, not outcome data; the everyday extension is comparing like with like — same device, same metric, similar conditions."
  - claim: "Numerous experimental, demographic and environmental factors influence HRV assessment, interpretation and reliability, which is one reason a cross-device difference is not automatically an error."
    sources: [S5]
    class: guideline
    claimType: measurement
    quote: "Numerous experimental, demographic, and environmental factors influence HRV assessment, interpretation, and reliability."
    limitation: "Expert consensus about the many moving parts of a measurement; the specific mix of causes differs for every pair of devices and conditions."
  - claim: "RMSSD and SDNN summarize different properties of a recording — beat-to-beat changes versus overall spread — and RMSSD leans more on parasympathetic modulation than SDNN (facts hrv.rmssd.definition and hrv.sdnn.definition)."
    sources: [S2]
    class: established
    claimType: measurement
    quote: "The RMSSD is more influenced by the PNS than SDNN."
    limitation: "A relative statement between the two metrics; recording length adds a further reason their values diverge."
  - claim: "Recording length changes what a value means: longer recordings accumulate slower rhythms and larger SDNN-type values, so values from different windows are not comparable."
    sources: [S2]
    class: established
    claimType: measurement
    quote: "Since longer recordings are associated with increased HRV, it is inappropriate to compare metrics like SDNN when they are calculated from epochs of different length."
    limitation: "A property of the metric; it applies to comparisons between apps, studies and nightly routines alike."
  - claim: "Apple Health records HRV as SDNN, computed as the standard deviation of the inter-beat intervals between normal heartbeats and recorded automatically by Apple Watch (fact applewatch.hrv.healthkit)."
    sources: [S6]
    class: established
    claimType: device
    quote: "While there are multiple ways of computing HRV, HealthKit uses SDNN heart rate variability, which uses the standard deviation of the inter-beat (RR) intervals between normal heartbeats (typically measured in milliseconds). The system automatically records samples on Apple Watch."
    limitation: "Official documentation; describes what the system records, not what the values mean for health; scoped to Apple's ecosystem."
  - claim: "Recent Apple Watch models on watchOS show two HRV variants — Recovery HRV and Overall HRV — and measure HRV as often as every five minutes (fact applewatch.hrv.variants2026)."
    sources: [S7]
    class: context-dependent
    claimType: device
    quote: "Apple Watch provides two separate variants of HRV for better understanding of a user's health status. Recovery HRV is best to identify daily signals of stress and recovery, while overall HRV is best for insights on a user's broader health, including cardiovascular health."
    limitation: "Manufacturer announcement scoped to specific hardware and OS versions; Apple has not stated how Recovery HRV is computed."
  - claim: "iOS and watchOS add an RMSSD data type to Apple Health (fact applewatch.hrv.rmssdType)."
    sources: [S8]
    class: context-dependent
    claimType: device
    quote: "iOS 27.0+iPadOS 27.0+Mac Catalyst 27.0+macOS 27.0+visionOS 27.0+watchOS 27.0+ (platform availability)"
    limitation: "Official documentation; availability is scoped to specific OS versions, and what apps record via this type depends on each app."
  - claim: "HRV is not a direct readout of vagal tone or of sympathetic–parasympathetic balance (fact claim.vagalTone)."
    sources: [S1, S5]
    class: established
    claimType: physiology
    quote: "caution is necessary to avoid overinterpretation, particularly with respect to the concept of \"vagal tone.\""
    limitation: "Methodological caution from the standards and guideline literature; HRV reflects vagally mediated changes in heart rate, not the nerve's activity itself."
  - claim: "A single low or high value does not by itself establish stress, illness or health status (fact claim.hrvNotStress)."
    sources: [S1, S5]
    class: established
    claimType: other
    quote: "HRV has some utility as a cardiovascular risk stratification tool but is not appropriate to employ as a specific marker of cardiac sympathetic outflow or sympathovagal balance."
    limitation: "About interpretation, not about measurement accuracy; persistent changes with concerning symptoms belong with a clinician."
  - claim: "A chest strap that senses the heart's electrical activity gave time-domain HRV values effectively interchangeable with a laboratory ECG in healthy young adults (single validation study)."
    sources: [S11]
    class: context-dependent
    claimType: measurement
    quote: "The H10 provides measurements effectively interchangeable with laboratory ECG for time-domain HRV and standard cardiovagal reflex tests in healthy young adults."
    limitation: "One chest-strap model, healthy young adults, a short supine, paced-breathing and standing protocol; it says nothing about wrist or ring optical sensors."
  - claim: "In one study of night-time values, agreement with an ECG reference differed between consumer wearables: Oura rings agreed closely, WHOOP acceptably, and Garmin Fenix and Polar less closely."
    sources: [S9]
    class: context-dependent
    claimType: measurement
    quote: "Oura devices showed the highest agreement for RHR and HRV, and WHOOP showed acceptable agreement, whereas Garmin Fenix and Polar demonstrated lower concordance, highlighting the importance of continuous validation and providing valuable benchmarks for clinicians, researchers, and consumers."
    limitation: "Single small study of healthy adults, sleep only, specific device generations; each vendor computes nightly HRV over its own windows with non-standardized methods; not a ranking of brands. Funded by the US Air Force Research Laboratory; the authors declare no competing interests."
  - claim: "Without published algorithmic details, users and independent researchers cannot tell how a wearable's nightly HRV is calculated or weighted."
    sources: [S10]
    class: context-dependent
    claimType: measurement
    quote: "Without explicit manufacturer transparency, end users–or independent researchers–cannot discern how metrics are calculated or weighted."
    limitation: "The study authors' reply in a letter exchange (WHOOP's team commented on the study); an argument about transparency, not new measurement data."
  - claim: "Across validation studies, Apple Watch showed a small mean underestimation of heart rate with moderate variability of individual readings, and accuracy varied by metric, conditions and individual physiology."
    sources: [S12]
    class: context-dependent
    claimType: measurement
    quote: "Bland-Altman meta-analysis showed a small underestimation of heart rate, although limits of agreement (LoA) indicated moderate measurement variability"
    limitation: "Pooled heart-rate result; the abstract reports no pooled HRV result, and results are not broken out by watch generation."
  - claim: "In one validation study of serial readings in healthy adults, two recent Apple Watch models tended to underestimate HRV compared with a chest-strap reference and did not meet the authors' pre-set equivalence margin."
    sources: [S13]
    class: context-dependent
    claimType: measurement
    quote: "Equivalence testing indicated that the HRV measurements from Apple Watch did not fall within the pre-specified equivalence margin of ±10 ms."
    limitation: "Single study, healthy adults, two watch models, a chest strap with analysis software as reference; it does not describe Recovery HRV or newer watch models."
  - claim: "In one observational study, how people felt did not consistently match overnight HRV from an activity tracker."
    sources: [S14]
    class: emerging
    claimType: measurement
    quote: "Subjective feelings of readiness may not correspond to activity tracker biometrics and should be taken into consideration when calculating readiness scores and providing personalized recommendations based on HRV."
    limitation: "Small observational study with a single commercial tracker; all authors are employed by PepsiCo R&D (Gatorade Sports Science Institute), which funded the study; needs independent replication."
---

## What is wearable HRV?

When a smartwatch or ring shows an HRV number, it is showing an estimate of [heart rate variability](/glossary/heart-rate-variability) — the natural variation in the time between consecutive heartbeats. The estimate is usually built from an optical pulse signal rather than from the heart's electrical activity, and that single fact is behind most of the confusion, most of the marketing and most of the honest questions about what the number means.

This page answers the method question that sits underneath the everyday ones. Why two devices disagree is a practical story told in [why your HRV is different on every device](/articles/hrv-different-every-device); what Apple's two watch variants are is covered in [Recovery HRV vs Overall HRV on Apple Watch](/articles/apple-watch-recovery-hrv-vs-overall-hrv); what to do about a low reading belongs to [why is my Apple Watch HRV low](/articles/why-is-my-apple-watch-hrv-low); and keeping your own readings comparable is the job of [how to measure HRV consistently](/articles/how-to-measure-hrv-consistently). Here the question is: how closely can a sensor on the wrist or finger reproduce what a clinical ECG would measure — and what does the answer imply for how you read your numbers?

Three terms have to stay separate on this page, because collapsing them is where most overclaiming begins. An ECG-derived HRV value, a PPG-derived pulse rate variability value and a proprietary wearable score computed from HRV and other signals are related measurements — not one measurement [S3]. They may track each other closely, but the signal, the processing and the meaning differ at each step.

The short answer: wearable HRV can be useful, but its usefulness is conditional — on the metric, on the conditions and on what you compare it with.

## How does wearable HRV work?

Two measurement chains start from two different signals.

The reference chain is electrical. An ECG records the heart's electrical activity, and the sharp R peak of each heartbeat gives a precise timing reference; the intervals between successive normal beats are what HRV is computed from [S1, S4]. The wearable chain is optical. A photoplethysmography (PPG) sensor shines light into the skin and tracks the small changes in blood volume that each beat sends through the peripheral circulation; software finds the repeating pulse peaks and estimates the timing between them [S3]. The variability computed from those pulse intervals is usually called pulse rate variability (PRV).

In short: ECG → electrical peaks → beat-to-beat intervals → HRV. And: PPG → pulse peaks at the skin → pulse-to-pulse intervals → PRV.

![An electrical ECG trace with sharp spikes above a smoother optical pulse wave, next to the outline of a wristband.](/images/science/measurements-hrv-ppg-vs-ecg.jpg)

Each heartbeat does ultimately produce a pulse wave, so the two chains are closely related. But the pulse has to travel to the measurement site, and what happens along the way — pulse transit time, vascular tone, peripheral circulation — together with motion artifacts, sensor contact, skin optical properties and the device's signal processing can all move a pulse-based value away from its electrical counterpart [S3]. A wrist or ring sensor is therefore not a smaller ECG electrode. It observes a related signal and estimates from it, and the quality of the estimate depends on the conditions.

This is also why the question "is this sensor accurate?" is incomplete. The evidence-based version asks: accurate for which metric, in which person, under which conditions, with which processing? The sections below take those pieces one at a time.

## How is wearable HRV measured?

Every wearable HRV value is the end product of a chain of choices, and two numbers are comparable only to the extent that the choices match. Five questions decode any HRV number you see:

- **What signal was measured?** A clinical ECG, a chest strap that senses electrical activity, or an optical PPG sensor at the wrist or finger — the signal determines what the value is an estimate of [S1, S4].
- **Which metric was calculated?** One device may report {{fact:hrv.rmssd.definition}} [S1]; another leans on {{fact:hrv.sdnn.definition}} [S1]. The two summarize different properties of the same recording — RMSSD isolates the changes between adjacent beats, SDNN the overall spread — and they lean differently on parasympathetic modulation, so their numbers are not interchangeable [S2]. Some apps go further and show a proprietary recovery or readiness score derived from HRV and other signals; a score is not a metric, and its computation is usually not published. The [RMSSD](/science/concepts/rmssd) and [SDNN](/science/concepts/sdnn) concept pages take each metric apart.
- **When and how was it measured?** A brief spot check, a controlled rest recording and an overnight window are different measurement regimes — and recording length even changes what a value means, because longer windows accumulate slower rhythms and larger SDNN-type values [S2].
- **How good was the signal?** Movement, loose fit and weak peripheral perfusion degrade an optical estimate first, and validation-grade studies filter such recordings out before computing anything [S4].
- **Are you looking at a trend or reacting to one number?** A single value is an observation; a sequence of values collected the same way is a signal [S5].

A chest strap that senses the heart's electrical activity sits closer to the reference than an optical sensor does. In a single validation study in healthy young adults (Blalock et al., 2026), a Polar chest strap and a laboratory ECG recorded beat-to-beat intervals at the same time, and the strap's time-domain HRV values were effectively interchangeable with the ECG's [S11]. That is why such straps often serve as the practical reference in wearable studies. The finding is limited to healthy young adults in a short rest, paced-breathing and standing protocol; it does not transfer to wrist or ring optical sensors.

Apple's ecosystem is a live example of the metric question. {{fact:applewatch.hrv.healthkit}} [S6] — so the HRV values in Apple Health have always been SDNN-type, recorded automatically by Apple Watch. On recent models, {{fact:applewatch.hrv.variants2026}} [S7]; Apple has not stated how Recovery HRV is computed. Separately, {{fact:applewatch.hrv.rmssdType}} [S8] — a platform change that lets apps write an RMSSD-type value to Apple Health, which matters whenever an Apple Watch number is compared with a ring that reports RMSSD.

A compact way to hold all of this:

| Situation | How to read it |
|---|---|
| One device, one metric, similar conditions each time | A sound setup for a personal trend |
| Two devices, two different metrics or windows | The numbers are not automatically comparable |
| A reading taken during movement | Expect the estimate to degrade; treat it with caution |
| One unusually low or high value | An observation, not a verdict |
| A persistent shift alongside concerning symptoms | A picture to discuss with a clinician |

The practical rule follows from the table: same device, same metric, similar conditions, repeated measurements — before comparing absolute numbers across devices. Where your numbers sit relative to population age bands is a separate question, answered by the [HRV calculator](/tools/hrv) and the [normal HRV by age](/articles/normal-hrv-by-age) article rather than repeated here.

## What affects wearable HRV?

- **Movement and exercise.** Motion distorts the optical signal, and exercise changes the physiology and the measurement environment at once; controlled-rest studies therefore look cleaner than free-living data [S4].
- **Sensor fit and perfusion.** A loose band or cold, poorly perfused skin weakens the pulse signal the algorithm depends on [S4].
- **Recording window and time of day.** A brief daytime sample and an overnight average describe different regimes; values across them are not interchangeable [S2, S5].
- **Metric and processing.** RMSSD and SDNN answer different questions about the same recording [S2], and each manufacturer's filtering, interpolation and artifact handling shapes the final number [S3].
- **Breathing and posture.** Respiratory rate and depth during the window write themselves into the value [S5].
- **Changing devices.** Moving from one device to another can move the baseline too — a change of measurement regime rather than of physiology [S3].

## What does the evidence show?

**Established.** The ECG is the reference method for beat-to-beat interval measurement [S1, S4], and the signal chains are well understood: PPG estimates beat timing from peripheral pulse waves [S3], and PRV is related to — but not physiologically identical with — ECG-derived HRV [S3]. The properties of the metrics themselves are equally settled: RMSSD and SDNN summarize different aspects of a recording [S2], and recording length changes what a value means [S2].

**Context-dependent.** The newest evidence addresses the consumer question directly. A systematic review and meta-analysis (Xu et al., 2026) compared PPG-derived PRV with ECG-derived HRV in healthy or apparently healthy, non-clinical populations [S3]. Its qualitative synthesis covered {{fact:study.xu2026.studiesQualitative}}, but only {{fact:study.xu2026.studiesPooled}} provided enough comparable data for quantitative pooling. Where the data could be pooled, the standardized errors for RMSSD and SDNN were relatively small, though sensitivity analyses supported the RMSSD findings more strongly than the SDNN estimates [S3]. The authors' own boundary matters more than the pooled numbers: the quantitative synthesis rested on few studies, drawn mostly from resting or controlled conditions, and the pooled estimates should not be generalized to sleep, exercise, stress or free-living settings, or read as evidence of interchangeability [S3].

A controlled validation study (Zuern et al., 2026) recorded {{fact:study.zuern2026.participants}} in sinus rhythm, with a clinical ECG and a wrist PPG sensor running simultaneously [S4]. Under controlled resting conditions, wrist-based PPG reproduced ECG-derived indices closely enough for the authors to support selected parameters for short-term assessment — while calling for further real-world validation [S4]. Agreement was metric-specific, with weaker agreement for short-term variability and entropy metrics than for interval-standard measures [S4], and recordings with poor signal quality — low perfusion, motion artifacts — were excluded before analysis [S4]. The same filtering is exactly what everyday use cannot rely on.

Night-time values add a second layer: devices compute them differently. In one study of nocturnal values (Dial et al., 2025), {{fact:study.dial2025.participants}} wore an ECG reference and several consumer wearables at the same time during sleep, over {{fact:study.dial2025.nights}} in total [S9]. In this study, agreement with the reference differed between devices: the Oura rings agreed closely with it, WHOOP acceptably, and the Garmin Fenix and Polar watches less closely [S9]. The result describes these device versions in this small group of healthy adults during sleep — not a ranking of brands. Each vendor computes its nightly HRV over its own windows with methods that are not standardized, and the study's authors note that without manufacturer transparency neither users nor independent researchers can tell how such metrics are calculated or weighted [S10].

For Apple Watch, a living systematic review and meta-analysis (Lambe et al., 2026) found a small mean underestimation of heart rate against criterion methods, with moderate variability in individual readings, and accuracy that varied by metric, conditions and individual physiology [S12]; its abstract reports no pooled HRV result. A single validation study by the same group (O'Grady et al., 2024) compared repeated HRV readings from two recent Apple Watch models in healthy adults with a chest-strap reference: the watch tended to underestimate HRV and did not meet the authors' pre-set equivalence margin [S13]. That study predates Apple's Recovery and Overall HRV variants and says nothing about how they perform.

Apple's ecosystem facts belong here as device facts: Apple Health stores HRV as SDNN [S6], recent watch models expose two HRV variants [S7], and the platform now also accepts an RMSSD-type value [S8] — scoped statements about what is recorded, not about health.

**Methodological guidance.** Current guidelines state that the input signal, recording length, setting, breathing and analytical approach all affect rigor and reliability [S5], and that findings from wearable HRV — including in research — should be interpreted and contextualized within these limitations [S5]. The everyday extension is comparing like with like.

**Unknown.** How well these methods generalize across the variety of consumer devices and proprietary algorithms; how they perform during unrestricted daily movement and across overnight windows that devices define differently; how they behave in people with arrhythmias or specific conditions; and when a change a wearable detects becomes clinically meaningful. None of this is settled — which is a reason for measurement literacy, not for discarding the data.

## What wearable HRV does not tell you

- **It is not an ECG reading.** A PPG-based value is an estimate from a related signal, and pooled agreement does not extend to every setting or count as interchangeability [S3].
- **It is not one universal number.** RMSSD, SDNN and proprietary scores describe different things; a value without its metric and window is incomplete information [S2, S3].
- **It is not a diagnosis or a stress verdict.** {{fact:claim.hrvNotStress}} [S1, S5] — and the same caution bounds unusually high values.
- **It is not a readout of how you feel.** In one observational study, how people felt did not consistently match their tracker's overnight HRV; all of its authors work for PepsiCo R&D (Gatorade Sports Science Institute), which funded it [S14].
- **It is not vagal tone.** The framing matters. {{fact:claim.vagalTone}} [S1, S5].
- **It is not a device ranking.** Agreement depends on the metric, conditions, signal quality and processing [S3, S4]; which device suits you is a question for product reviews, and this page deliberately names no "most accurate" tracker.
- **A single value says little.** Methodological guidance calls for contextualized interpretation [S5]; your own recent readings under comparable conditions are the more informative comparison.

## In ONDA

ONDA sits on the consumer side of this evidence, and its documentation is plain about where each number comes from. The nightly baseline is built on the HRV values written into Apple Health — by Apple Watch or by any tracker whose app syncs heart data there — and those values are SDNN-type: {{fact:applewatch.hrv.healthkit}} [S6]. The live reading shown during a practice is a surrogate computed from the standard deviation of heart rate, not RMSSD or SDNN; the phone camera gives pulse, not HRV; and the coherence score available with Apple Watch is a proprietary feedback score, not a clinical HRV measurement. ONDA's use of the signal is biofeedback: the question is not only what the number is, but what happens to it while you practise. It compares each night with your own recent corridor and does not diagnose anything. See [what ONDA measures](/measurements).

> Educational information, not a diagnosis or medical treatment.