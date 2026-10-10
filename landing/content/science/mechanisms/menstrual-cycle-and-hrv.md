---
kind: mechanisms
slug: menstrual-cycle-and-hrv
title: "Menstrual Cycle and HRV: Why Your Baseline Moves"
metaTitle: "Menstrual Cycle and HRV: What Changes and Why"
metaDescription: "How heart rate variability shifts across the menstrual cycle, why each woman has her own pattern, and what hormonal contraception and menopause change."
shortAnswer: >
  On average, heart rate variability is a little higher at the start of the
  menstrual cycle and a little lower toward the end, and the difference is
  small. When cycles are aligned precisely to ovulation, there is no single
  rhythm shared by all women: each woman has her own pattern, and sleep and
  day-to-day well-being move it too. Hormonal contraception is linked to lower
  heart rate variability. Compare yourself with your own earlier cycles, not
  with averages from other women.
keyPoints:
  - "Across wearable studies, heart rate variability tends to be higher at the start of the menstrual cycle and lower toward the end, and the difference is small."
  - "A dip before a period and a rise after it were seen both in women with and in women without premenstrual disorders."
  - "When cycles were aligned precisely to ovulation in one small study, the shared population rhythm was flat and each woman had her own pattern."
  - "In a large real-world dataset, how much the numbers moved across a cycle depended on cycle length, and less sleep raised resting heart rate in every phase."
  - "Users of hormonal contraception had lower heart rate variability, especially late in the cycle."
  - "After menopause, lower resting heart rate variability was largely explained by age and body weight in one small laboratory study."
  - "Predicting ovulation or the cycle phase of one woman from heart rate variability has not been shown; ONDA does not do it."
image: "/images/science/mechanisms-menstrual-cycle-and-hrv.jpg"
imageAlt: "A glowing heart trace drawn as a circle, shifting from teal to warm amber, with a small crescent moon inside it on a dark background."
imagePrompt: "Minimal scientific line illustration on a dark navy background, 16:9 landscape: a single thin heart-rate trace drawn as a closed circle in the centre, its colour shifting gradually from teal to warm amber and soft coral around the ring, with bursts of beat-to-beat variation at a few points of the circle and calm stretches between them; a small warm crescent moon inside the ring; soft glow, lots of empty space, no text, no numbers, no people, no devices."
editor: "Yakiv Bilenko"
reviewer: null
lastReviewed: null
related:
  glossary: [heart-rate-variability]
  articles: [onda-report-for-your-gynecologist]
  tools: [baseline]
  science: [concepts/hrv-baseline, mechanisms/hrv-day-to-day, concepts/interpreting-hrv, mechanisms/sleep-and-hrv, measurements/heart-rate-variability]
sources:
  - id: S1
    cite: "de Jager et al. (2026)"
    title: "Wearable-Derived Heart Rate Variability Across the Menstrual Cycle, Hormonal Contraceptive Use, and Reproductive Life Stages in Females: A Living Systematic Review"
    journal: "Sports Medicine"
    year: 2026
    doi: "10.1007/s40279-025-02388-y"
    pmid: 41545627
    type: systematic-review
    note: "Living systematic review registered on OSF; wearable and mobile HRV only; no pooled meta-analysis because phase definitions differed; internal university funding, authors declare no financial or proprietary interests"
  - id: S2
    cite: "Pan et al. (2026)"
    title: "Wearable-measured heart rate variability and premenstrual disorder symptoms across menstrual cycle"
    journal: "Archives of Women's Mental Health"
    year: 2026
    doi: "10.1007/s00737-026-01740-z"
    pmid: 42412242
    type: observational
    note: "Prospective cohort, one consumer tracker brand (Huawei), one to two cycles per participant; publicly funded (National Natural Science Foundation of China); authors declare no competing interests"
  - id: S3
    cite: "Gonzalez et al. (2026)"
    title: "The menstrual cycle through the lens of a wearable device: insights into physiology, sleep, and cycle variability"
    journal: "npj Digital Medicine"
    year: 2026
    doi: "10.1038/s41746-026-02799-9"
    pmid: 42185632
    type: observational
    note: "Retrospective data from WHOOP users; three of eight authors were WHOOP employees and hold company shares; funded by the Wu Tsai Human Performance Alliance at Stanford University and the Joe and Clara Tsai Foundation; cycles self-logged"
  - id: S4
    cite: "Hamidovic et al. (2023)"
    title: "Periovulatory Subphase of the Menstrual Cycle Is Marked by a Significant Decrease in Heart Rate Variability"
    journal: "Biology"
    year: 2023
    doi: "10.3390/biology12060785"
    pmid: 37372070
    type: observational
    note: "Small longitudinal laboratory study with ovulation timed by the blood LH surge; funded by the US National Institute of Mental Health; authors declare no conflict of interest; likely part of the evidence base of de Jager 2026"
  - id: S5
    cite: "Ramesh et al. (2022)"
    title: "Heart rate variability as a function of menopausal status, menstrual cycle phase, and estradiol level"
    journal: "Physiological Reports"
    year: 2022
    doi: "10.14814/phy2.15298"
    pmid: 35608101
    type: observational
    note: "Small laboratory study with an angiotensin II infusion challenge; supported by the Canadian Institutes of Health Research; no conflict-of-interest statement found in the open full text"
  - id: S6
    cite: "Schaffarczyk et al. (2026)"
    title: "Cardiac autonomic regulation across the menstrual cycle is highly individual: evidence from phase-aligned cyclic generalized additive mixed models"
    journal: "American Journal of Physiology — Regulatory, Integrative and Comparative Physiology"
    year: 2026
    doi: "10.1152/ajpregu.00028.2026"
    pmid: 42012497
    type: observational
    note: "Small longitudinal study with daily smartphone-camera HRV; academic authors (Würzburg, Hamburg); COI not checked: no open full text"
  - id: S7
    cite: "Schmalenberger et al. (2019)"
    title: "A Systematic Review and Meta-Analysis of Within-Person Changes in Cardiac Vagal Activity across the Menstrual Cycle: Implications for Female Health and Future Studies"
    journal: "Journal of Clinical Medicine"
    year: 2019
    doi: "10.3390/jcm8111946"
    pmid: 31726666
    type: meta-analysis
  - id: S8
    cite: "ONDA — product documentation: How ONDA works"
    title: "How ONDA works"
    url: "https://onda-life.com/how-it-works"
    type: product-documentation
evidenceMap:
  - claim: "Across wearable studies in naturally menstruating women, HRV was higher at the beginning of the cycle and lower toward the end, with small differences in time-domain HRV (facts cycle.sr.studies, cycle.sr.range)."
    sources: [S1]
    class: context-dependent
    claimType: physiology
    quote: "In naturally menstruating females, HRV was higher at the beginning of the cycle and lower toward the end, with differences in time-domain HRV ranging from 3 to 9%."
    limitation: "Observational wearable studies with different phase definitions; no pooled estimate; does not separate the cycle from sleep, stress or alcohol that may also change across it."
  - claim: "An earlier meta-analysis of within-person laboratory studies found lower vagally mediated HRV in the luteal than in the follicular phase."
    sources: [S7]
    class: context-dependent
    claimType: physiology
    quote: "A broad meta-analysis (nstudies = 37; nindividuals = 1,004) revealed a significant CVA decrease from the follicular to luteal phase (d = -0.39, 95% CI (-0.67, -0.11))."
    limitation: "Observational studies with heterogeneous phase definitions; group-level, individual patterns vary."
  - claim: "In a cohort followed with a consumer tracker, SDNN, RMSSD and high-frequency power decreased before menses and increased afterwards, both in women with and in women without premenstrual disorders (fact cycle.pmd.cohort)."
    sources: [S2]
    class: emerging
    claimType: physiology
    quote: "In both women with and without PMDs, SDNN, rMSSD, and HF decreased before menses and increased afterwards; the increase trends were more pronounced in women without PMDs."
    limitation: "Single cohort; one tracker brand; one to two cycles per woman; associations only."
  - claim: "Lower HRV went together with stronger symptoms only in the women with premenstrual disorders."
    sources: [S2]
    class: emerging
    claimType: physiology
    quote: "levels of these HRV metrics were inversely associated with PMDs symptoms among women with PMDs"
    limitation: "Research-grade screening, not a diagnosis; association, not cause; a wearable cannot diagnose a premenstrual disorder."
  - claim: "In a laboratory study with ovulation timed by the LH surge in blood, high-frequency HRV dropped around ovulation (fact cycle.periovulatory.design)."
    sources: [S4]
    class: emerging
    claimType: physiology
    quote: "The present study shows a significant drop in HF-HRV in the anticipation of ovulation."
    limitation: "Single small study; clinic measurements of one spectral index; likely included in the systematic review above, so not an independent confirmation."
  - claim: "When daily HRV was aligned precisely to ovulation, the population-level rhythm across the cycle was flat, while each woman's own cyclic pattern was significant (fact cycle.individual.design)."
    sources: [S6]
    class: emerging
    claimType: physiology
    quote: "For ln(RMSSD), the population-level cyclic trajectory was flat and nonsignificant, whereas participant-specific cyclic deviations were significant, indicating pronounced interindividual heterogeneity despite a stable average pattern."
    limitation: "Single small study; smartphone-camera HRV; ovulation estimated rather than confirmed by blood tests."
  - claim: "In the same study, poorer sleep, higher stress and greater fatigue on a given day went with lower HRV in that woman."
    sources: [S6]
    class: emerging
    claimType: physiology
    quote: "vagally mediated HRV shows no consistent population-level rhythm but marked individual-specific dynamics, strongly modulated by day-to-day well-being"
    limitation: "Self-reported well-being; within-person associations in a small sample."
  - claim: "In a large real-world wearable dataset, cycle length was strongly associated with how much heart and breathing measures varied across the cycle (fact cycle.realworld.cohort)."
    sources: [S3]
    class: context-dependent
    claimType: physiology
    quote: "cycle length is strongly associated with how much cardiorespiratory metrics vary across the cycle"
    limitation: "Retrospective data from one company's users; cycles self-logged; three authors were company employees with shares."
  - claim: "Within the same people, less sleep raised resting heart rate regardless of cycle phase (fact cycle.sleep.rhr)."
    sources: [S3]
    class: context-dependent
    claimType: physiology
    quote: "RHR increased 1.2% with a 10% decrease in weekly sleep duration"
    limitation: "Natural experiment within one company dataset; resting heart rate, not HRV; no health outcomes."
  - claim: "Users of hormonal contraception had lower wearable HRV, particularly in the late cycle."
    sources: [S1]
    class: context-dependent
    claimType: physiology
    quote: "Hormonal contraceptive users exhibited lower HRV, particularly in the late cycle."
    limitation: "Observational studies; different products and regimens; says nothing about which method to choose."
  - claim: "In a small laboratory study, lower baseline HRV after menopause was no longer significant after adjusting for age and body mass index (fact menopause.ramesh.design)."
    sources: [S5]
    class: emerging
    claimType: physiology
    quote: "Compared to premenopausal women in the low estradiol phase, postmenopausal women demonstrated lower baseline LF (p = 0.01) and HF (p < 0.001) measures, which were not significant after adjustment for age and BMI."
    limitation: "Single small study; spectral measures; no women on hormone therapy studied."
  - claim: "In the same study, postmenopausal women showed a fall in high-frequency HRV in response to an angiotensin II infusion."
    sources: [S5]
    class: emerging
    claimType: physiology
    quote: "In response to AngII, a decrease in cardioprotective HRV (ΔHF = -0.43 ± 0.46 ln ms2 , p = 0.005 vs. baseline) was observed in postmenopausal women versus premenopausal women."
    limitation: "A drug challenge in a laboratory, not everyday stress; single small study."
  - claim: "Baseline HRV did not differ by menstrual phase in the premenopausal women of the same study."
    sources: [S5]
    class: emerging
    claimType: physiology
    quote: "Baseline HRV parameters did not differ by menstrual phase in premenopausal women."
    limitation: "Two phases compared in eleven women; short laboratory recordings."
  - claim: "The review authors say cycle-related differences should be taken into account when HRV is shown to women."
    sources: [S1]
    class: context-dependent
    claimType: physiology
    quote: "This should be considered when presenting HRV metrics to female users."
    limitation: "Author recommendation, not a tested method."
  - claim: "ONDA builds its baseline from nightly Apple Health values and compares each night with the user's own corridor (facts baseline.window, baseline.compare)."
    sources: [S8]
    class: established
    claimType: device
    quote: "From nightly Apple Health values — HRV, resting heart rate and breathing rate — ONDA builds your personal baseline"
    limitation: "Describes app behaviour only; not evidence for any health claim."
---

## Does HRV change across the menstrual cycle?

Heart rate variability (HRV) is the beat-to-beat variation in the interval between heartbeats. It shifts from night to night for many reasons, and the menstrual cycle is one of them ([why HRV changes from day to day](/science/mechanisms/hrv-day-to-day)).

On average, the shift is small. A living systematic review of {{fact:cycle.sr.studies}} looked at HRV from wearables and phones [S1]. In naturally menstruating women, HRV was higher at the beginning of the cycle and lower toward the end, with {{fact:cycle.sr.range}} [S1]. The studies defined cycle phases differently, so the authors could not pool them into one estimate [S1]. An earlier meta-analysis of laboratory studies pointed the same way: vagally mediated HRV was lower in the luteal phase, the second half of the cycle after ovulation, than in the follicular phase, the first half [S7].

A study that followed {{fact:cycle.pmd.cohort}} with a consumer fitness tracker saw the same shape in daily data: SDNN, RMSSD and high-frequency power fell before a period and rose after it [S2]. This happened both in women with and in women without premenstrual disorders [S2]. Only in the women with premenstrual disorders did lower HRV go together with stronger symptoms [S2]. This is a single cohort that used one tracker brand.

One timing detail comes from a laboratory study of {{fact:cycle.periovulatory.design}} [S4]. High-frequency HRV dropped around ovulation [S4]. This is a single small study, and it is probably one of the studies inside the review above, so it is not an independent confirmation.

## Does every woman follow the same curve?

<!-- myth-debunk -->
A common picture is that every woman's HRV follows the same textbook curve: higher in the first half of the cycle, lower in the second. A recent study tested this with daily measurements in {{fact:cycle.individual.design}} [S6]. The researchers aligned each cycle precisely to its ovulation, so that cycles of different lengths could be compared [S6]. On this scale the population-level rhythm of RMSSD was flat and not significant, while each woman's own cyclic pattern was significant [S6]. In other words, there was no single shared rhythm, and individual patterns differed [S6]. Poorer sleep, higher stress and greater fatigue on a given day went with lower HRV in that woman [S6]. This is a single small study using a smartphone camera, but its result runs against the idea of one curve for everyone.

The average from many women and the pattern of one woman are different things. The average can show a small fall toward the end of the cycle while your own cycle shows a larger fall, a smaller one or none ([interpreting HRV](/science/concepts/interpreting-hrv)).

## What else moves the numbers?

The largest dataset comes from wearable users. A retrospective study analysed {{fact:cycle.realworld.cohort}}; the women wore a WHOOP band [S3]. Cycle length was strongly associated with how much heart rate, HRV and breathing rate varied across the cycle [S3]. Variation across the cycle was greater in people who slept less [S3]. Within the same people, less sleep raised resting heart rate regardless of the cycle phase: resting heart rate rose by {{fact:cycle.sleep.rhr}} [S3]. Three of the authors were WHOOP employees who hold company shares [S3].

Daily behaviour can therefore matter as much as the phase itself. Sleep shapes night-time HRV in any phase ([HRV and heart rate during sleep](/science/mechanisms/sleep-and-hrv)).

## What about hormonal contraception?

In the living systematic review, users of hormonal contraception had lower HRV than naturally menstruating women, particularly in the late cycle [S1]. This comes from observational studies of different products and regimens. This page does not compare contraceptive methods and gives no advice on choosing one; that is a conversation with a doctor.

## What about menopause?

In the same review, HRV tended to decline after menopause with increasing age [S1]. A small laboratory study of {{fact:menopause.ramesh.design}} looked closer [S5]. Women after menopause had lower resting HRV, but the difference was no longer significant after adjusting for age and body mass index [S5]. What differed was the response to a drug that raises blood pressure (angiotensin II): high-frequency HRV fell in the women after menopause [S5]. In the women before menopause, resting HRV did not differ between the two cycle phases studied [S5]. This is a single small study with a laboratory drug challenge, not everyday stress, and it does not support any conclusion about treatment.

## What does the evidence show?

**What we don't know.** Predicting the cycle phase or ovulation of one woman from her HRV has not been shown in the studies on this page. The average shift across the cycle is small compared with the night-to-night noise of wearable HRV, and individual patterns differ [S1] [S6].

**By evidence class.**

- **Context-dependent.** On average, wearable HRV is higher early in the cycle and lower toward the end, and the difference is small [S1] [S7]. Hormonal contraception is associated with lower HRV, especially late in the cycle [S1]. In real-world data, cycle length and sleep affect how much the numbers move [S3].
- **Emerging.** A dip before a period occurs in women with and without premenstrual disorders [S2]; high-frequency HRV dropped around ovulation in one laboratory study [S4]; after alignment to ovulation the shared rhythm was flat and individual patterns dominated [S6]; lower resting HRV after menopause was largely explained by age and body mass index [S5].
- **Unknown.** Whether HRV can tell one woman which phase she is in or when she ovulates.

## What it does not tell you

- **HRV is not a fertility or contraception tool.** Nothing here shows that HRV can tell when you are fertile, and it must not be used for contraception.
- **It does not diagnose anything.** A dip before your period is part of the average pattern, not a sign of a premenstrual disorder or any other condition [S2]. Painful, very irregular or heavy periods, or symptoms that disrupt daily life, need a doctor, whatever a wearable shows.
- **It gives no advice on contraception or menopause treatment.**
- **Population data are not a prediction for you.** The averages come from many women; your own cycle may show a larger shift, a smaller one or none [S6].
- **Company data carry a caveat.** The largest dataset was co-written by employees of the device maker [S3].
- **One study inside a review is not two confirmations.** The ovulation study is probably part of the review's evidence base [S1] [S4].

For other causes of a low reading, see [why is my HRV low?](/science/questions/why-is-my-hrv-low).

## In ONDA

ONDA builds a personal baseline from nightly values stored in Apple Health — from Apple Watch or another device that syncs heart data there [S8]. The window is {{fact:baseline.window}}, and {{fact:baseline.compare}}. {{fact:applewatch.hrv.healthkit}}, so ONDA's HRV trend is an SDNN trend. ONDA does not track the menstrual cycle, so the baseline does not adjust for cycle day. A lower HRV in the days before a period may be an ordinary cycle fluctuation rather than a warning. If you want to see your own pattern, note the cycle day yourself and compare the same days across several cycles, rather than comparing yourself with phase averages from other women ([your HRV baseline](/science/concepts/hrv-baseline); [how HRV is measured](/science/measurements/heart-rate-variability)). ONDA does not determine fertility, ovulation or contraception from HRV, and it does not diagnose any condition.

> Educational information, not a diagnosis or medical treatment.
