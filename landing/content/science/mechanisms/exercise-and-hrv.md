---
kind: mechanisms
slug: exercise-and-hrv
title: "Exercise and HRV: What Training Does and What HRV Guidance Shows"
metaTitle: "Exercise and HRV: HRV-Guided Training Evidence"
metaDescription: "Why HRV dips after hard training and recovers, how long that takes, and what trials of HRV-guided training show compared with a fixed training plan."
shortAnswer: >
  After exercise, heart rate variability falls and then recovers over hours to
  days; the harder the session, the longer recovery usually takes. HRV-guided
  training adjusts daily sessions to morning readings. In a meta-analysis it
  helped submaximal measures modestly and left fewer non-responders, but it did
  not clearly improve performance or peak oxygen uptake. It does not by itself
  establish that HRV guidance beats a well-designed fixed plan.
keyPoints:
  - "Heart rate variability drops after a training session and recovers over time, more slowly after high-intensity than after low-intensity aerobic exercise."
  - "A lower morning heart rate variability after a hard day is an expected response to training, not by itself a sign of a problem."
  - "Fitter people tend to recover their pre-exercise heart rhythm faster after the same kind of session."
  - "In a meta-analysis of small trials, training adjusted to daily heart rate variability modestly improved submaximal measures and left fewer non-responders than a fixed plan."
  - "The same meta-analysis found no clear advantage for performance or peak oxygen uptake."
  - "In a small randomized trial in heart patients, guided and standard training improved peak oxygen uptake equally."
  - "Whether heart rate variability guidance helps recreational exercisers over the long term, and which decision rule works best, has not been shown."
image: /images/science/mechanisms-exercise-and-hrv.jpg
imageAlt: "The outline of a runner over a heart trace: regular beats before exercise, a long slow dip while running, and steady beats returning afterwards."
imagePrompt: "Minimal scientific illustration, 16:9: the thin outline of a runner in mid-stride over a faint grid, with a single glowing heart-rate wave running left to right behind the figure — regular beats, then a long smooth dip while running, then levelling out into steady beats again; calm, schematic, no text, no numbers, no labels."
editor: "Yakiv Bilenko"
reviewer: null
lastReviewed: null
related:
  glossary: [heart-rate-variability]
  articles: [overtraining-hrv-resting-heart-rate, zone-2-training-aerobic-base]
  tools: [baseline]
  science: [mechanisms/hrv-day-to-day, concepts/hrv-baseline, concepts/interpreting-hrv, mechanisms/sleep-and-hrv, measurements/heart-rate-variability]
sources:
  - id: S1
    cite: "Stanley, Peake & Buchheit (2013)"
    title: "Cardiac parasympathetic reactivation following exercise: implications for training prescription"
    journal: "Sports Medicine"
    year: 2013
    doi: "10.1007/s40279-013-0083-4"
    pmid: 23912805
    type: review
    note: "Review with a quantitative analysis of aerobic-exercise studies in athletes and healthy people; data on strength training limited; no conflict-of-interest statement in the PubMed record"
  - id: S2
    cite: "Düking et al. (2021)"
    title: "Monitoring and adapting endurance training on the basis of heart rate variability monitored by wearable technologies: A systematic review with meta-analysis"
    journal: "Journal of Science and Medicine in Sport"
    year: 2021
    doi: "10.1016/j.jsams.2021.04.012"
    pmid: 34489178
    type: meta-analysis
    note: "Small pooled sample and heterogeneous protocols (fixed-effects model); no conflict-of-interest statement in the PubMed record"
  - id: S3
    cite: "Besnier et al. (2026)"
    title: "Heart Rate Variability-Guided Exercise Training Compared With Standard Exercise Training in Patients With Coronary Artery Disease: A Randomized Clinical Trial"
    journal: "Journal of Cardiopulmonary Rehabilitation and Prevention"
    year: 2026
    doi: "10.1097/hcr.0000000000001017"
    pmid: 41627302
    type: randomized-trial
    note: "Single small trial in a cardiac rehabilitation population; the authors declare no conflicts of interest; funded by a university research chair"
  - id: S4
    cite: "Carter et al. (2026)"
    title: "Guidelines for rigor and reproducibility of heart rate variability within human cardiovascular research"
    journal: "American Journal of Physiology. Heart and Circulatory Physiology"
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
  - claim: "Full cardiac autonomic recovery after one aerobic session takes longer as intensity rises (fact training.recovery.time)."
    sources: [S1]
    class: context-dependent
    claimType: physiology
    quote: "the time required for complete cardiac autonomic recovery after a single aerobic-based training session is up to 24 h following low-intensity exercise, 24-48 h following threshold-intensity exercise and at least 48 h following high-intensity exercise"
    limitation: "Pooled from aerobic-exercise studies in athletes and healthy people; individual kinetics vary and strength training is poorly covered."
  - claim: "Cardiac parasympathetic reactivation after a training session is highly individual."
    sources: [S1]
    class: context-dependent
    claimType: physiology
    quote: "As a marker of cardiovascular recovery, cardiac parasympathetic reactivation following a training session is highly individualized."
    limitation: "Review synthesis; the mechanisms are not completely understood."
  - claim: "Metaboreflex stimulation likely drives the short-term reactivation and baroreflex stimulation the intermediate-term reactivation."
    sources: [S1]
    class: emerging
    claimType: physiology
    quote: "Metaboreflex stimulation (e.g. muscle and blood acidosis) is likely a key determinant of parasympathetic reactivation in the short term (0-90 min post-exercise), whereas baroreflex stimulation (e.g. exercise-induced changes in plasma volume) probably mediates parasympathetic reactivation in the intermediate term (1-48 h post-exercise)."
    limitation: "The authors state that the mechanisms are not completely understood; hedged wording (likely, probably)."
  - claim: "Cardiac autonomic recovery does not coincide with the recovery of every physiological system."
    sources: [S1]
    class: context-dependent
    claimType: physiology
    quote: "Cardiac parasympathetic reactivation does not appear to coincide with the recovery of all physiological systems (e.g. energy stores or the neuromuscular system)."
    limitation: "Limited data, especially for strength and resistance exercise."
  - claim: "Cardiac autonomic recovery occurs more rapidly in people with greater aerobic fitness."
    sources: [S1]
    class: context-dependent
    claimType: physiology
    quote: "Cardiac autonomic recovery occurs more rapidly in individuals with greater aerobic fitness."
    limitation: "Review synthesis; individual kinetics vary."
  - claim: "Exercise duration is unlikely to be the main determinant of post-exercise reactivation."
    sources: [S1]
    class: emerging
    claimType: physiology
    quote: "Based on limited data, exercise duration is unlikely to be the greatest determinant of cardiac parasympathetic reactivation."
    limitation: "The authors describe the data as limited."
  - claim: "A meta-analysis of HRV-guided versus predefined endurance training included a small number of studies (fact study.duking2021.studies)."
    sources: [S2]
    class: emerging
    claimType: efficacy
    quote: "A total of 8 studies (198 participants) were identified comprising 9 interventions involving a variety of approaches."
    limitation: "Small pooled sample; the interventions used different approaches."
  - claim: "Most HRV-guided interventions included fewer moderate- or high-intensity sessions than the predefined plans."
    sources: [S2]
    class: emerging
    claimType: other
    quote: "Compared to predefined training, most HRV-guided interventions included fewer moderate- and/or high-intensity training sessions."
    limitation: "Describes the trial protocols, not an outcome."
  - claim: "HRV-guided training had a medium-sized positive effect on submaximal physiological parameters (fact study.duking2021.submaximal), but small, non-significant effects on performance and peak oxygen uptake."
    sources: [S2]
    class: emerging
    claimType: efficacy
    quote: "HRV-guided endurance training had a medium-sized effect on submaximal physiological parameters, but only a small and non-significant influence on performance and V̇O2peak."
    limitation: "Fixed-effects meta-analysis of small, heterogeneous trials; the confidence interval for the submaximal effect is wide."
  - claim: "For performance, HRV-guided training was associated with fewer non-responders and more positive responders."
    sources: [S2]
    class: emerging
    claimType: efficacy
    quote: "Moreover, with regards to performance, HRV-guided training was associated with fewer non-responders and more positive responders."
    limitation: "Responder counts from small trials; association, not a demonstrated cause."
  - claim: "In patients with coronary artery disease, peak oxygen uptake improved similarly with HRV-guided and standard training (facts study.besnier2026.design, study.besnier2026.vo2peak)."
    sources: [S3]
    class: emerging
    claimType: efficacy
    quote: "HRV-G exercise training led to similar V̇O₂ peak improvements and prevalence of responders"
    limitation: "Single small trial in a cardiac rehabilitation population; not generalisable to healthy or athletic people."
  - claim: "In the same trial, the HRV-guided group showed a larger improvement at the first ventilatory threshold, with a lower training load."
    sources: [S3]
    class: emerging
    claimType: efficacy
    quote: "a larger improvement in V̇O 2 at the first ventilatory threshold adjusted for lean body mass compared with SET, despite a lower training load"
    limitation: "Secondary outcome in a small trial; cannot carry the conclusion when the primary outcome showed no difference."
  - claim: "Many experimental, demographic and environmental factors influence HRV assessment, so readings should be compared under comparable conditions."
    sources: [S4]
    class: guideline
    claimType: measurement
    quote: "Numerous experimental, demographic, and environmental factors influence HRV assessment, interpretation, and reliability."
    limitation: "Research-rigour guideline; expert consensus, not direct evidence about training decisions."
  - claim: "ONDA builds its baseline from nightly Apple Health values and compares each night with the user's own corridor (facts baseline.window, baseline.compare)."
    sources: [S5]
    class: established
    claimType: device
    quote: "From nightly Apple Health values — HRV, resting heart rate and breathing rate — ONDA builds your personal baseline"
    limitation: "Describes app behaviour only; not evidence for any health or training claim."
---

## What does exercise do to HRV?

Heart rate variability (HRV) is the beat-to-beat variation in the interval between heartbeats. During and right after exercise it falls, because the heart is driven faster and the parasympathetic (vagal) brake on the heart is withdrawn. After the session ends, that brake returns gradually. Researchers call this cardiac parasympathetic reactivation, and it is used as one marker of cardiovascular recovery [S1].

The return takes time, and the time depends on how hard the session was. A review that pooled aerobic-exercise studies in athletes and healthy people found that complete cardiac autonomic recovery after a single session takes {{fact:training.recovery.time}} [S1]. So a lower HRV the morning after a hard day is an expected response to the training itself, not by itself a sign that something is wrong. How training fits among the other everyday causes of a lower reading — sleep, alcohol, illness, stress — is set out on [why HRV changes from day to day](/science/mechanisms/hrv-day-to-day) and is not repeated here.

## How does recovery after exercise work?

The mechanisms are not completely understood [S1]. The review's working model has two phases. In the short term after a session, signals from working muscles — for example, acidity in muscle and blood — are likely the main factor holding the vagal brake back (the metaboreflex). In the intermediate term, over the following hours and days, changes in blood volume after exercise probably act through the baroreflex, the pressure-sensing loop that adjusts heart rate [S1]. Both parts of this model are hedged by the authors themselves.

Two further points shape how a reading after training should be understood. First, the speed of reactivation is highly individual [S1]. Second, the heart's autonomic recovery does not appear to coincide with the recovery of every system: energy stores and the neuromuscular system may follow their own timelines [S1]. A heart rhythm that is back to normal does not by itself mean the muscles have recovered, and the reverse also holds.

## How is HRV around training measured?

In training studies, HRV is usually recorded in the morning on waking, often for a few minutes lying or sitting still, or taken from the night by a wearable. A reading taken during or right after a session is a different measurement and is not compared with a resting baseline. Many experimental, demographic and environmental factors influence how HRV is measured and how reliable it is, so readings should be compared only with readings taken the same way (expert consensus, not direct experimental data) [S4]. Why the night is the steadiest window is covered on [HRV and heart rate during sleep](/science/mechanisms/sleep-and-hrv).

## What affects recovery time?

- **Intensity.** The clearest factor. Recovery is shortest after low-intensity and longest after high-intensity aerobic sessions [S1].
- **Fitness.** Cardiac autonomic recovery occurs more rapidly in people with greater aerobic fitness [S1].
- **Duration.** Based on limited data, how long a session lasts is unlikely to be the main factor [S1].
- **Type of exercise.** Most of the data come from aerobic exercise; strength and resistance training are covered too thinly to state the same time course [S1].

Over weeks, regular training that improves fitness tends to move resting HRV the other way; that longer-term picture and the signs of overreaching belong to [why HRV changes from day to day](/science/mechanisms/hrv-day-to-day) and [overtraining, HRV and resting heart rate](/articles/overtraining-hrv-resting-heart-rate).

## What does the evidence show for HRV-guided training?

**The idea.** In HRV-guided training, the plan for each day depends on a morning reading: if HRV is close to the person's own baseline, a hard session goes ahead; if it has dropped well below (or, in some protocols, risen well above), an easier session replaces it. A predefined plan schedules the same sessions regardless of the reading.

**HRV-guided versus a fixed plan.** A systematic review with meta-analysis pooled {{fact:study.duking2021.studies}} comparing HRV-guided with predefined endurance training [S2]. Most HRV-guided programmes ended up with fewer moderate- or high-intensity sessions than the fixed plans [S2]. The pooled effect on submaximal physiological parameters — measures taken below maximal effort, such as values at the ventilatory threshold — was positive and medium-sized: {{fact:study.duking2021.submaximal}} [S2]. The effects on performance and on peak oxygen uptake (VO₂peak) were small and not statistically significant [S2]. For performance, HRV-guided training was associated with fewer non-responders and more positive responders [S2]. The trials were small and used different decision rules, so this is emerging evidence.

**The honest boundary.** A randomized trial compared HRV-guided and standard exercise training in a cardiac rehabilitation setting: {{fact:study.besnier2026.design}} [S3]. On the primary outcome, peak oxygen uptake in these cardiac rehabilitation patients rose in both groups — {{fact:study.besnier2026.vo2peak}} [S3]. The authors report a larger improvement in the HRV-guided group at the first ventilatory threshold, with a lower training load, and a responder share that did not differ significantly [S3]. Those are secondary findings of one small study in patients with coronary artery disease; they do not carry the conclusion when the main outcome showed no difference, and they do not transfer to healthy or athletic people.

**By evidence class.**

- **Context-dependent.** HRV falls after a session and recovers over a time course that lengthens with intensity, shortens with fitness and varies between people [S1].
- **Guideline.** Compare HRV readings only under comparable recording conditions (expert consensus) [S4].
- **Emerging.** HRV-guided endurance training modestly improves submaximal measures and leaves fewer non-responders than a predefined plan, without a shown advantage for performance or peak oxygen uptake [S2]. In one small trial in heart patients, guided and standard training improved peak oxygen uptake equally [S3]. The metaboreflex and baroreflex model of recovery is a working explanation [S1].
- **Unknown.** Whether HRV guidance helps recreational exercisers over the long term, and which decision rule works best, have not been shown.

## How should HRV around training be read?

Look at the trend against your own [baseline](/science/concepts/hrv-baseline), not at one morning. A dip on the day after a hard session fits the expected recovery pattern above; a reading that stays low for several days, especially with poor sleep, illness or unusual fatigue, is worth a closer look at everything else going on. Record the context — what training you did, how you slept, whether you are unwell — so that a change can be matched with its likely cause. What a single reading can and cannot say is set out on [interpreting HRV](/science/concepts/interpreting-hrv).

This page gives no training-load advice. Planning sessions is a matter for you and, where relevant, a coach. If you have a heart condition, follow the exercise plan agreed with your doctor or cardiac rehabilitation team. Chest pain, fainting, severe breathlessness or palpitations with dizziness during or after exercise need urgent medical care, whatever any wearable shows.

## What it does not tell you

- **A low morning HRV after training is not a verdict.** It is the expected response to a hard session and says nothing on its own about overtraining or illness [S1].
- **A recovered heart rhythm is not full recovery.** Muscles and energy stores can follow other timelines [S1].
- **HRV guidance has not been shown to beat a good fixed plan** on performance or peak oxygen uptake [S2], and in one small trial in heart patients the primary outcome did not differ [S3].
- **The best decision rule is unknown.** The trials used different thresholds and protocols [S2], and the long-term benefit for recreational exercisers has not been shown.
- **Most data are aerobic.** Strength training is covered too thinly to apply the same time course [S1].

## In ONDA

ONDA builds a personal baseline from nightly values stored in Apple Health — from Apple Watch or another device that syncs heart data there [S5]. The window is {{fact:baseline.window}}, and {{fact:baseline.compare}}. {{fact:applewatch.hrv.healthkit}}, so ONDA's HRV trend is an SDNN trend. ONDA shows how your nights compare with your own range; it does not plan or adjust training, does not tell you when to train hard and does not diagnose any condition.

> Educational information, not a diagnosis or medical treatment.
