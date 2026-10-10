---
kind: mechanisms
slug: altitude-and-hrv
title: "Altitude and HRV: What Changes and What It Cannot Predict"
metaTitle: "Altitude and HRV: What Studies Show"
metaDescription: "How high altitude changes heart rate variability, whether HRV can predict altitude sickness, and why symptoms, not a watch, decide when to descend."
shortAnswer: >
  In the first days at high altitude, heart rate variability usually falls, a
  pooled finding in healthy adults. Overall variability falls further higher
  up, while the breathing-linked component drops early and then levels off.
  Whether heart rate variability predicts altitude sickness is contested:
  studies disagree, and none shows that a watch can warn you. Symptoms, not
  the watch, decide when to descend and seek medical help.
keyPoints:
  - "A meta-analysis of healthy adults found lower heart rate variability in the first days at high altitude than at sea level, in trained and untrained people alike."
  - "Higher up, overall variability (SDNN) fell further, while the breathing-linked component (RMSSD) did not differ significantly between the lower- and higher-altitude studies."
  - "Whether heart rate variability predicts acute mountain sickness is contested: a meta-analysis found modest associations, a field study found a signal at one altitude, and another study found no prediction."
  - "In one small study at very high altitude, the breathing-linked share of the heart rhythm had not returned to its sea-level pattern after a long stay."
  - "A finger pulse sensor recorded heart rate variability even at extreme altitude, but its fast, breathing-linked components diverged from the ECG."
  - "Heart rate variability and watches do not replace checking for symptoms of altitude sickness; with symptoms, descend and seek medical help."
  - "With an Apple Watch or Apple Health heart data, ONDA compares your nights with your own baseline; it does not assess or warn of altitude sickness."
image: "/images/science/mechanisms-altitude-and-hrv.jpg"
imageAlt: "A thin teal heart-rhythm line on a dark navy background climbs a mountain-shaped slope, its beats tightening near the summit among faint dots, then settles into calm beats."
imagePrompt: "Minimal scientific line illustration on a dark navy background, 16:9 landscape: a single thin teal heart-rhythm trace running left to right along a soft blue mountain-slope outline; as the slope rises the beats come closer together, with a short warm beige section, and near the summit the trace becomes a tight burst of fast oscillations among faint scattered dots suggesting thin air; past the summit it settles into calm, evenly spaced teal beats on a level plateau; lots of empty space, no text, no numbers, no people, no devices."
editor: "Yakiv Bilenko"
reviewer: null
lastReviewed: null
related:
  glossary: [heart-rate-variability]
  articles: [breathing-altitude-acclimatization, what-to-do-after-low-hrv-reading]
  tools: [baseline]
  science: [mechanisms/hrv-day-to-day, concepts/interpreting-hrv, mechanisms/sleep-and-hrv, mechanisms/illness-and-hrv, measurements/heart-rate-variability, measurements/resting-heart-rate]
sources:
  - id: S1
    cite: "Li et al. (2025)"
    title: "Effects of acute high-altitude exposure on heart rate variability: a systematic review and meta-analysis"
    journal: "Frontiers in Physiology"
    year: 2025
    doi: "10.3389/fphys.2025.1696346"
    pmid: 41561154
    type: meta-analysis
    note: "Volume year 2025, published online in 2026; observational before/after studies at real altitude, mostly young men; funded by a provincial natural science foundation in China; authors declare no conflicts of interest"
  - id: S2
    cite: "Tsai et al. (2025)"
    title: "The role of heart rate variability in acute mountain sickness: A meta-analysis"
    journal: "Medicine (Baltimore)"
    year: 2025
    doi: "10.1097/MD.0000000000042692"
    pmid: 40527833
    type: meta-analysis
    note: "The pooled estimates rest on two or three studies each; includes the Karinen field study; publicly funded (National Science and Technology Council, Taiwan); authors declare no conflicts of interest"
  - id: S3
    cite: "Karinen et al. (2012)"
    title: "Heart rate variability changes at 2400 m altitude predicts acute mountain sickness on further ascent at 3000–4300 m altitudes"
    journal: "Frontiers in Physiology"
    year: 2012
    doi: "10.3389/fphys.2012.00336"
    pmid: 22969727
    type: observational
    note: "Single field study; cut-offs set in the same sample and not validated in new people; authors declare no conflicts of interest"
  - id: S4
    cite: "Boos et al. (2018)"
    title: "High Altitude Affects Nocturnal Non-linear Heart Rate Variability: PATCH-HA Study"
    journal: "Frontiers in Physiology"
    year: 2018
    doi: "10.3389/fphys.2018.00390"
    pmid: 29713290
    type: observational
    note: "Single field study in servicemen; funded by the UK Surgeon General's Department; the patch maker supplied and paid for the patches and gave intellectual input, and two co-authors were affiliated with it; the authors declare no conflict of interest"
  - id: S5
    cite: "Perini et al. (1996)"
    title: "Effects of high altitude acclimatization on heart rate variability in resting humans"
    journal: "European Journal of Applied Physiology and Occupational Physiology"
    year: 1996
    doi: "10.1007/BF00357674"
    pmid: 8817122
    type: observational
    note: "Single small study at one altitude, spectral measures only; COI not checked: no open full text"
  - id: S6
    cite: "Castiglioni et al. (2022)"
    title: "Heart Rate Variability from Wearable Photoplethysmography Systems: Implications in Sleep Studies at High Altitude"
    journal: "Sensors"
    year: 2022
    doi: "10.3390/s22082891"
    pmid: 35458875
    type: other
    note: "Method comparison with a research finger sensor, not a consumer wrist device; funded by the Italian Ministry of Health; authors declare no conflict of interest"
evidenceMap:
  - claim: "In a meta-analysis of healthy adults in their first days at high altitude (facts altitude.li.studies, altitude.li.scope), SDNN, RMSSD, high-frequency power and related HRV measures were lower than at sea level."
    sources: [S1]
    class: context-dependent
    claimType: physiology
    quote: "Meta-analysis revealed that after acute high-altitude exposure, SDNN, RMSSD, pNN50, HF, and LF were all significantly (all p < 0.001) reduced compared with sea-level values"
    limitation: "Observational before/after studies of healthy lowland adults, mostly young men, in the first days at altitude; short clinical ECG recordings, not wearables."
  - claim: "The authors interpret the shift as vagal withdrawal with relative sympathetic predominance."
    sources: [S1]
    class: debated
    claimType: physiology
    quote: "indicating an autonomic response characterized by \"reduced variability, vagal withdrawal, and relative sympathetic predominance.\""
    limitation: "Authors' interpretation of HRV measures; part of it rests on the LF/HF ratio, which is debated."
  - claim: "The authors themselves note that the rise in the LF/HF ratio mainly reflects a redistribution of the remaining spectral power rather than a direct measure of sympathetic tone."
    sources: [S1]
    class: debated
    claimType: measurement
    quote: "the ratio more accurately reflects the redistributed relative spectral composition under conditions of reduced total power, rather than a direct quantitative measure of sympathetic tone"
    limitation: "Discussion section of the meta-analysis; the interpretation of LF/HF is debated across the field."
  - claim: "The authors relate part of the fall in high-frequency power to faster breathing at altitude."
    sources: [S1]
    class: context-dependent
    claimType: measurement
    quote: "In addition, the decrease in HF is also related to increased respiratory rate—acute hypoxia induces hyperventilation and accelerates respiratory rhythm"
    limitation: "Authors' discussion; breathing rate was not analysed in the pooled studies."
  - claim: "HRV fell in trained people as well as in other healthy adults."
    sources: [S1]
    class: context-dependent
    claimType: physiology
    quote: "Both trained and healthy adults experience vagal inhibition; however, trained show better preservation of low-frequency oscillations and stronger sympathetic regulatory capacity."
    limitation: "Subgroup analysis with few studies per subgroup."
  - claim: "The pooled evidence has limited data for women, older adults and less fit people, and the pooled studies reached only a limited altitude (fact altitude.li.maxAltitude)."
    sources: [S1]
    class: context-dependent
    claimType: other
    quote: "The limited data available for women, older adults, and individuals with lower fitness"
    limitation: "The maximum altitude is taken from Table 1 of the full text; no sentence states it."
  - claim: "In the higher-altitude subgroup (fact altitude.li.threshold), SDNN fell further than at lower altitude."
    sources: [S1]
    class: context-dependent
    claimType: physiology
    quote: "Altitude subgroup analysis indicated that at ≥3500 m, SDNN decreased more"
    limitation: "Subgroup comparison between studies, not within people; Egger's test was significant for SDNN."
  - claim: "RMSSD and high-frequency power did not differ between the lower and higher altitude subgroups."
    sources: [S1]
    class: context-dependent
    claimType: physiology
    quote: "while no significant between-group differences were found for RMSSD, pNN50, HF, or LF (all p > 0.05)"
    limitation: "Subgroup comparison between studies; few studies per subgroup."
  - claim: "The authors describe the fall in vagally linked measures as an early-onset and early-plateauing response."
    sources: [S1]
    class: context-dependent
    claimType: physiology
    quote: "indicating that vagal withdrawal may be an “early-onset and early-plateauing” response"
    limitation: "Authors' interpretation of the subgroup results."
  - claim: "Results of individual studies of HRV as a predictor of acute mountain sickness have been inconsistent."
    sources: [S2]
    class: debated
    claimType: other
    quote: "Heart rate variability (HRV) has been proposed as a potential predictor of AMS, but results from individual studies have been inconsistent."
    limitation: "Background statement of the review."
  - claim: "The only meta-analysis of HRV and acute mountain sickness included the studies and altitudes in facts altitude.tsai.studies and altitude.tsai.altitudes."
    sources: [S2]
    class: emerging
    claimType: other
    quote: "Seven studies met the inclusion criteria, comprising a total of 329 participants."
    limitation: "Search only to August 2023; real and simulated altitude mixed; per-study sizes in Table 2 add up to fewer participants than stated."
  - claim: "Before the ascent, people who later developed acute mountain sickness had a higher pNN50 (fact altitude.tsai.prePnn50), pooled from two studies of men (fact altitude.tsai.prePnn50Base)."
    sources: [S2]
    class: emerging
    claimType: physiology
    quote: "Before ascent, individuals who developed AMS showed significantly higher percentage of successive R-R intervals that differ by more than 50 ms compared with those who did not develop AMS (standardized mean difference = 0.40, 95% confidence interval: [0.11 to 0.69])."
    limitation: "Two male-only studies; a higher, not lower, vagally linked value; modest effect."
  - claim: "After the ascent, people with acute mountain sickness had a lower SDNN (fact altitude.tsai.postSdnn), pooled from three studies (fact altitude.tsai.postSdnnBase)."
    sources: [S2]
    class: emerging
    claimType: physiology
    quote: "After ascent, the AMS group exhibited significantly lower standard deviation of normal-to-normal R-R intervals (standardized mean difference = -0.41, 95% confidence interval: [-0.69 to -0.13])."
    limitation: "Three studies; association measured after the illness may have begun, not a prediction."
  - claim: "Low- and high-frequency power showed no significant difference between people with and without acute mountain sickness."
    sources: [S2]
    class: emerging
    claimType: physiology
    quote: "Other HRV parameters, including low-frequency and high-frequency power, showed trends toward lower values in the AMS group but did not reach statistical significance."
    limitation: "Few studies per measure."
  - claim: "The review's authors conclude that further research is needed before clinical guidelines can be set."
    sources: [S2]
    class: debated
    claimType: other
    quote: "further research is needed to establish definitive clinical guidelines"
    limitation: "Author conclusion."
  - claim: "In a field study of climbers (fact altitude.karinen.design), RMSSD and high-frequency power at the first measurement altitude were lower in those who went on to develop acute mountain sickness lower down on the mountain (fact altitude.karinen.lowerHrv)."
    sources: [S3]
    class: emerging
    claimType: physiology
    quote: "After an ascent to 2400 m, root mean square successive differences, high-frequency power (HF(2 min)) of HRV were 17-51% and Ex-SpO(2) was 3% lower in those climbers who suffered from AMS at 3000 to 4300 m than in those only developing AMS later (≥5000 m) or not at all (all p < 0.01)."
    limitation: "Single study; 2-minute chest-strap recordings lying down each morning; one measurement altitude."
  - claim: "The climbers were grouped afterwards by when they developed acute mountain sickness (fact altitude.karinen.groups)."
    sources: [S3]
    class: emerging
    claimType: other
    quote: "At 2400 m altitude, RMSSD2 min and HF2 min were lower among those climbers who got AMS at lower altitudes (3000–4300 m) (n = 12) than in those who got AMS 3–7 days later at higher altitude (≥5000 m) (n = 12) or not at all (n = 12) (Table 2)."
    limitation: "Retrospective grouping; small groups."
  - claim: "An RMSSD cut-off and, separately, an oxygen-saturation cut-off each had high sensitivity for early acute mountain sickness (fact altitude.karinen.sensitivity)."
    sources: [S3]
    class: emerging
    claimType: measurement
    quote: "At the altitude of 2400 m RMSSD(2 min) ≤ 30 ms and Ex-SpO(2) ≤ 91% both had 92% sensitivity for AMS if ascent continued without extra acclimatization days."
    limitation: "Each cut-off separately, no combined rule tested; cut-offs set in the same sample and not validated."
  - claim: "Both cut-offs had low specificity (fact altitude.karinen.specificity, Table 3)."
    sources: [S3]
    class: emerging
    claimType: measurement
    quote: "Sensitivity and specificity of chosen parameters at 2400 m altitude for AMS at 3000–4300 m."
    limitation: "Table 3 caption; the specificity values are table cells, not prose."
  - claim: "Average RMSSD at the first measurement altitude was low only in the climbers who got acute mountain sickness early, not in those who got it higher up (fact altitude.karinen.rmssdGroups, Table 2)."
    sources: [S3]
    class: emerging
    claimType: physiology
    quote: "At 2400 m altitude, RMSSD2 min and HF2 min were lower among those climbers who got AMS at lower altitudes (3000–4300 m)"
    limitation: "Group means from Table 2; small groups."
  - claim: "The authors call the correlations between HRV and acute mountain sickness rather weak."
    sources: [S3]
    class: emerging
    claimType: other
    quote: "The correlations between HRV parameters and AMS are rather weak."
    limitation: "Author statement about their own data."
  - claim: "In the climbers who stayed well, RMSSD and high-frequency power first rose in the first days of the ascent; above a certain altitude (fact altitude.karinen.threshold) all HRV measures fell while heart rate rose."
    sources: [S3]
    class: emerging
    claimType: physiology
    quote: "In the no-AMS group, RMSSD2 min, LF2 min and HF2 min increased in the first few days of the ascent. Above 3500 m all HRV parameters decreased while HR increased."
    limitation: "Single study; morning chest-strap recordings."
  - claim: "In a field study of servicemen with a chest patch (facts altitude.boos.design, altitude.boos.ams), HRV failed to predict acute mountain sickness."
    sources: [S4]
    class: emerging
    claimType: physiology
    quote: "AMS occurred in 7/16 subjects (43.8%) and was very mild in 85.7% of cases. HRV failed to predict AMS."
    limitation: "Single small study; few, mostly very mild cases; the patch maker supplied and funded the patches and two co-authors were affiliated with it."
  - claim: "The authors cannot be certain their findings hold at higher altitudes or with more severe illness."
    sources: [S4]
    class: emerging
    claimType: other
    quote: "The altitude studied was modest and the majority of AMS cases were mild, hence we cannot be certain whether our findings would be reproducible at higher altitudes and with worsening AMS severity."
    limitation: "Author statement about their own study."
  - claim: "In the same study, none of the time-domain HRV measures changed significantly during sleep (fact altitude.boos.window)."
    sources: [S4]
    class: emerging
    claimType: physiology
    quote: "There were no significant changes in the ECG-derived respiratory rate or in any of the time domain measures of HRV during sleep."
    limitation: "Moderate altitude; one hour per night; only half of the group slept at the highest altitude (fact altitude.boos.highestNights); baseline at 800 m rather than sea level."
  - claim: "Night-time HRV at altitude was influenced by perceived exertion at the end of the previous day."
    sources: [S4]
    class: emerging
    claimType: physiology
    quote: "HA leads to a compensatory decrease in nocturnal HRV and complexity, which is influenced by the RPE measured at the end of the previous day."
    limitation: "Single small study; correlation, not cause."
  - claim: "In a long stay at very high altitude (fact altitude.perini.design), the share of high-frequency power lying down fell (fact altitude.perini.hfShare)."
    sources: [S5]
    class: emerging
    claimType: physiology
    quote: "At altitude compared to sea level in the supine position, percentage HF decreased from 25% to 10.9 (SEM 1.0)% (P < 0.05)"
    limitation: "Single small study at one altitude; spectral measures only, no RMSSD."
  - claim: "Sitting, no change was seen at altitude, while at sea level sitting up already lowered the high-frequency share."
    sources: [S5]
    class: emerging
    claimType: physiology
    quote: "No changes occurred at altitude in the sitting position either in the peak powers or in the LF:HF ratio"
    limitation: "Single small study; the sea-level posture effect is reported in the same abstract (At sea level the change from a supine to a sitting position yielded a decrease in percentage HF)."
  - claim: "The authors conclude that the acclimatisation period (fact altitude.perini.acclimatization) did not change the pattern."
    sources: [S5]
    class: emerging
    claimType: physiology
    quote: "An acclimatization period of 10 days higher than 2850 m asl and 1 month at 5050 m asl did not modify the interactions of the autonomic systems."
    limitation: "Tests the resting heart-rhythm pattern only, not acclimatisation as a whole; the conclusion rests partly on LF/HF."
  - claim: "Sherpas, who live at altitude, showed comparable results."
    sources: [S5]
    class: emerging
    claimType: physiology
    quote: "In the Sherpas comparable results to the Caucasians were found in both body positions."
    limitation: "Six Sherpas, measured at altitude only."
  - claim: "A finger pulse sensor gave HRV measures at very high altitude but diverged from the ECG in the faster spectral components (fact altitude.castiglioni.design)."
    sources: [S6]
    class: emerging
    claimType: measurement
    quote: "wearable PPG devices provide HRV measures even at extremely high altitudes. However, the comparison between PPG tachograms and RRI showed discrepancies in the faster spectral components and at the shorter scales of self-similarity and entropy."
    limitation: "Single study; research finger clip, not a wrist device; small samples at the highest camps."
  - claim: "Only some of the guides were recorded at the highest camp (fact altitude.castiglioni.highestCamp)."
    sources: [S6]
    class: emerging
    claimType: other
    quote: "Due to adverse weather conditions, only four of the five mountaineers reached Camp 2 at 6800 m a.s.l."
    limitation: "Very small sample."
  - claim: "The average beat interval from the pulse sensor was close to the ECG (fact altitude.castiglioni.meanInterval)."
    sources: [S6]
    class: emerging
    claimType: measurement
    quote: "Even if the difference was a few milliseconds only (e.g., 813 vs. 815 ms for the Mt. Rosa group) without clinical relevance, the PPG cardiac interval was always greater."
    limitation: "Hand-picked, cleaned sleep segments."
  - claim: "The closest pulse-timing method still read high-frequency power higher than the ECG (fact altitude.castiglioni.hfBest)."
    sources: [S6]
    class: emerging
    claimType: measurement
    quote: "SSI appears to provide the estimates closer to the reference with median power amplification in the HF band not greater than +32%."
    limitation: "Volunteers at one altitude; finger sensor."
  - claim: "The least accurate pulse-timing method read high-frequency power at more than twice the ECG (fact altitude.castiglioni.hfWorst)."
    sources: [S6]
    class: emerging
    claimType: measurement
    quote: "The largest discrepancies regard DDI, whose spectrum is greater than the reference at all of the frequencies and particularly in the HF band, where it is more than twice the reference power."
    limitation: "Volunteers at one altitude; finger sensor."
  - claim: "More of the pulse signal than of the ECG was discarded as artefact (fact altitude.castiglioni.dataLoss)."
    sources: [S6]
    class: emerging
    claimType: measurement
    quote: "The percentage of discarded PPG was slightly but significantly (p < 0.01) greater, ranging between 0.1% and 5.5%."
    limitation: "After manual cleaning; consumer devices clean automatically."
  - claim: "In the guides, the pulse sensor showed a significant rise in the LF/HF ratio that the ECG did not show."
    sources: [S6]
    class: emerging
    claimType: measurement
    quote: "However, the SSI, dP1, and dP2 tachograms quantified a significant increase in the LF/HF powers ratio not revealed by RRI."
    limitation: "Five guides; very small sample."
  - claim: "The authors explain the discrepancies by modulations of pulse wave velocity."
    sources: [S6]
    class: emerging
    claimType: measurement
    quote: "Discrepancies may be explained by modulations of pulse wave velocity and should be considered to interpret correctly autonomic alterations during sleep from HRV analysis."
    limitation: "Authors' explanation."
  - claim: "Results may differ for pulse sensors at other sites, such as the wrist."
    sources: [S6]
    class: emerging
    claimType: measurement
    quote: "different results may characterize PPG signals measured at other sites than the finger, such as the more proximal earlobe [34] or distal toe, or reflectance PPG measures in the ear canal, on the wrist, or temple."
    limitation: "Author caveat; wrist sensors were not tested."
  - claim: "The researchers selected stable stretches of sleep by eye."
    sources: [S6]
    class: emerging
    claimType: measurement
    quote: "A segment of at least one-hour duration during sleep was visually selected looking for stable periods of the triaxial accelerometers in lying position."
    limitation: "Best-case recordings; automatic processing may do worse."
---

## What happens to HRV at altitude?

At high altitude each breath brings in less oxygen. Heart rate variability (HRV) is the beat-to-beat variation in the interval between heartbeats, and in the first days at altitude it usually falls. The most reliable evidence is a meta-analysis of {{fact:altitude.li.studies}}: {{fact:altitude.li.scope}} [S1]. Compared with sea level, SDNN, RMSSD, high-frequency power and related HRV measures were all lower [S1].

The authors interpret the pattern as vagal withdrawal with relative sympathetic predominance [S1]. The framing matters. {{fact:claim.vagalTone}}, so this is a reading of measured HRV, not a direct measurement of nerve activity. Part of that reading rests on a rise in the ratio of low- to high-frequency power (LF/HF). In their own discussion, the authors add that this ratio mainly reflects how the remaining, smaller spectral power is redistributed, rather than a direct measure of sympathetic tone [S1]. Why this ratio is debated is explained on [the autonomic nervous system](/science/concepts/autonomic-nervous-system).

Part of the drop may be mechanical. Low oxygen speeds up breathing, and the authors relate part of the fall in high-frequency power to that faster breathing [S1]. So the change reflects how you breathe as well as how the heart is regulated.

Being fit did not prevent the drop: HRV fell in trained people as well as in other healthy adults [S1]. The pooled studies have clear limits. The highest altitude among them was {{fact:altitude.li.maxAltitude}}, recordings were short clinical ECGs rather than wearables, most participants were young men, and the authors note limited data for women, older adults and less fit people [S1].

## Is the drop stronger higher up?

Only for some measures. The meta-analysis split the studies at {{fact:altitude.li.threshold}} [S1]. In the higher group, SDNN, a measure of overall variability, fell further [S1]. RMSSD and high-frequency power, the measures most closely tied to breathing-linked, vagally mediated changes, did not differ significantly between the lower- and higher-altitude studies [S1]. The authors interpret this part of the response as early-onset and early-plateauing [S1]. Because this compares different studies rather than the same people at different altitudes, it does not show that RMSSD stops falling higher up; it only shows no significant difference between the two groups of studies. RMSSD itself is explained on [RMSSD](/science/concepts/rmssd).

## Can HRV predict altitude sickness?

Acute mountain sickness (AMS) is the common form of altitude sickness. Whether HRV can predict it is contested: the reviewers themselves note that results from individual studies have been inconsistent [S2]. Both sides are set out below; the evidence does not support a verdict either way.

**A meta-analysis that found modest associations.** The only meta-analysis on the question included {{fact:altitude.tsai.studies}}, at altitudes {{fact:altitude.tsai.altitudes}} [S2]. People who later developed AMS had {{fact:altitude.tsai.prePnn50}} [S2]. That is a higher vagally linked value, not a lower one. Those who had AMS showed {{fact:altitude.tsai.postSdnn}} [S2]. Each association rests on only part of the review: the first on {{fact:altitude.tsai.prePnn50Base}}, the second on {{fact:altitude.tsai.postSdnnBase}}. Low- and high-frequency power showed no significant difference [S2]. The authors conclude that further research is needed to establish definitive clinical guidelines [S2].

**A field study that found a signal at one altitude.** In a study of {{fact:altitude.karinen.design}}, RMSSD and high-frequency power, from a short chest-strap recording taken lying down, were {{fact:altitude.karinen.lowerHrv}} [S3]. The climbers were grouped afterwards into {{fact:altitude.karinen.groups}} [S3]. In this study, {{fact:altitude.karinen.sensitivity}} [S3]. No combined rule was tested. The same cut-offs also flagged many climbers who stayed well, with a specificity of {{fact:altitude.karinen.specificity}} [S3]. The early signal also missed later illness: average RMSSD at the first measurement altitude was {{fact:altitude.karinen.rmssdGroups}} [S3]. The cut-offs were set in the same small sample and never tested in new people, the ascents were faster than generally recommended, and the authors call the correlations between HRV and AMS rather weak [S3]. This is a single study, and it is also one of the studies in the meta-analysis above [S2], so the two are not independent confirmations.

**A study that found no prediction.** In a study of {{fact:altitude.boos.design}}, AMS occurred in {{fact:altitude.boos.ams}} [S4]. The authors report: "HRV failed to predict AMS." [S4] With few and mostly very mild cases, this single study had little room to detect a prediction, and the authors cannot be certain the finding holds at higher altitudes or with more severe illness [S4]. The company that made the patch supplied and paid for the patches, and two of the authors worked for it.

**Where this leaves the question.** The studies point in different directions, and none tested whether a reading can warn an individual. None of these studies shows that HRV, from a watch or any other device, can warn an individual of altitude sickness.

## Does HRV return to normal once you acclimatise?

A common belief is that you acclimatise to altitude in a couple of days. None of the studies on this page tests acclimatisation as a whole, with breathing, oxygen levels and symptoms, so for that belief the answer here is: not shown. What one small study did test is narrower: whether the resting heart-rhythm pattern returns to its sea-level form during a long stay at very high altitude.

In a study of {{fact:altitude.perini.design}}, the share of high-frequency, breathing-linked power measured lying down fell {{fact:altitude.perini.hfShare}} [S5]. Sitting, no change was seen at altitude; at sea level, sitting up had already lowered that share [S5]. The authors conclude that {{fact:altitude.perini.acclimatization}} did not change this pattern [S5]. The Sherpas, who live at altitude, showed comparable results [S5].

So, in this one study at very high altitude, the breathing-linked share of the heart rhythm had not returned to its sea-level pattern after the long stay. It is a single small study from 1996 at one altitude, using spectral measures only. It reports no RMSSD, says nothing about moderate altitudes or about symptoms, and its full text could not be checked for conflicts of interest.

## Can a wearable measure HRV at altitude?

It can record HRV, but the fast, breathing-linked details are less reliable than an ECG. A method study compared a finger pulse sensor, which reads the pulse optically (photoplethysmography, PPG), with an ECG during sleep in {{fact:altitude.castiglioni.design}} [S6]; {{fact:altitude.castiglioni.highestCamp}} were recorded at the highest camp [S6]. The pulse sensor gave usable HRV even there [S6].

The average interval between beats from the pulse sensor was {{fact:altitude.castiglioni.meanInterval}} [S6]. The faster, breathing-linked components were not: even the closest pulse-timing method read high-frequency power {{fact:altitude.castiglioni.hfBest}}, and the least accurate one read it at {{fact:altitude.castiglioni.hfWorst}} [S6]. More pulse data had to be discarded as artefact, {{fact:altitude.castiglioni.dataLoss}} [S6]. In the guides, the pulse sensor showed a significant rise in the LF/HF ratio that the ECG did not show [S6]. A pulse sensor can therefore exaggerate or hide exactly the kind of shift this page describes. The authors explain the gap by changes in how fast the pulse wave travels [S6].

The limits are important. The sensor was a finger clip connected to a research ECG vest, not a watch or a ring, and the authors note that sensors at other sites, such as the wrist, may give different results [S6]. The researchers chose stable stretches of sleep by eye and cleaned artefacts by hand [S6], which consumer devices do not do, and the results at the highest camps rest on very few people. This single study is used here only for how well the sensors agree, not for the direction of the altitude effect. How wearable HRV is measured is covered on [heart rate variability](/science/measurements/heart-rate-variability).

## What can you expect from your own numbers at altitude?

In the first days at altitude, lower HRV is common: in pooled short ECG recordings, HRV was lower than at sea level [S1]. The path is not always straight. In the field study of climbers, RMSSD in those who stayed well first rose in the first days of the ascent; above {{fact:altitude.karinen.threshold}} all HRV measures fell while heart rate rose [S3]. How resting pulse is measured and what moves it is covered on [resting heart rate](/science/measurements/resting-heart-rate).

A drop is common, but it does not always show. In the servicemen's study, HRV was analysed for {{fact:altitude.boos.window}}. None of the time-domain measures, such as RMSSD, changed significantly during sleep [S4], but the altitude was moderate, and {{fact:altitude.boos.highestNights}}. In the same study, how hard the previous day had felt was linked with the next night's HRV [S4], so the day's effort moves the night's numbers too ([exercise and HRV](/science/mechanisms/exercise-and-hrv)).

Comparing these nights with your usual baseline from home says little. A gap is expected, and it does not tell you whether you are adjusting well or becoming ill. More useful is the trend over several days at the same altitude, read together with how you feel. {{fact:claim.hrvNotStress}}. Short sleep, alcohol, hard effort and infection also move these numbers ([why HRV changes from day to day](/science/mechanisms/hrv-day-to-day); [sleep and HRV](/science/mechanisms/sleep-and-hrv); [illness and HRV](/science/mechanisms/illness-and-hrv); [interpreting HRV](/science/concepts/interpreting-hrv)).

## What does the evidence show?

**By evidence class.**

- **Context-dependent.** In healthy adults in their first days at altitude, HRV is lower than at sea level, in trained and untrained people alike [S1]. Higher up, SDNN falls further, while RMSSD and high-frequency power do not differ significantly between lower- and higher-altitude studies [S1]. Part of the high-frequency fall may reflect faster breathing [S1].
- **Emerging.** A finger pulse sensor records HRV at very high altitude but diverges from the ECG on the fast components [S6]. In one small study at very high altitude, the breathing-linked share of the heart rhythm stayed low after a long stay [S5]. Night-time time-domain HRV did not change significantly at moderate altitude in one study [S4].
- **Debated.** Whether HRV predicts acute mountain sickness: modest associations in a meta-analysis [S2] and a signal at one altitude in a field study [S3], against no prediction in another study [S4]. The reading of the shift as sympathetic predominance, which rests partly on LF/HF [S1].
- **Unknown or not shown.** That HRV from a watch can warn an individual of altitude sickness; that you acclimatise in a couple of days; how wrist sensors perform at altitude.

## Safety

This is the most important part of the page. HRV and watches do not replace checking for symptoms of altitude sickness.

- **Symptoms decide, not the watch.** Headache, nausea, breathlessness at rest, confusion, unusual drowsiness or unsteadiness at altitude are reasons to stop going higher, to descend and to seek medical help.
- **Confusion, severe breathlessness, chest pain or fainting need emergency help.**
- **A normal-looking reading does not rule out altitude sickness.** In the studies above, HRV did not reliably identify who became ill: one missed those who got sick higher up [S3] and another found no prediction [S4].
- **Do not delay descent to wait for a better reading.**
- This page gives no advice on ascent plans, acclimatisation schedules or medicines.

## What it does not tell you

- **HRV is not a test for altitude sickness.** The studies disagree, and none shows that a reading can warn an individual [S2] [S3] [S4].
- **A drop at altitude is expected, not damage.** It is the usual response in the first days [S1].
- **Your baseline from home is the wrong yardstick in the first days.** The gap is expected and does not show how well you are adjusting.
- **Most of the evidence comes from young, fit men.** Data for women, older adults and less fit people are limited [S1].
- **The LF/HF ratio is debated.** Even the authors who report its rise add that it is not a direct measure of sympathetic tone [S1].
- **No medical conclusions.** None of these studies diagnoses a condition or gives an ascent plan.

## In ONDA

ONDA is built around practice rather than tracking: it offers guided breathing practices with spoken and visual guidance, and {{fact:onda.practice.livePulse}}. With an Apple Watch, or a device that syncs heart data to Apple Health, it compares your HRV, resting heart rate and breathing rate with your own baseline over {{fact:baseline.window}}. {{fact:applewatch.hrv.healthkit}}, so ONDA's HRV trend is an SDNN trend. In the first days after you travel to altitude, that baseline still reflects your nights at home, so a signal then says that your nights differ from home, which is expected at altitude, not that you are getting altitude sickness. Because the {{fact:baseline.window}} baseline is rolling, it gradually takes in the altitude nights, so what it compares against changes during the stay. ONDA does not assess or warn of altitude sickness, does not diagnose any condition and does not replace a doctor; the studies on this page did not test ONDA. See [what ONDA measures](/measurements).

> Educational information, not a diagnosis or medical treatment.
