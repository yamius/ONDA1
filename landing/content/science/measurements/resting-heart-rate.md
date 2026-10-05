---
kind: measurements
slug: resting-heart-rate
title: "Resting Heart Rate: What It Reflects and How It's Measured"
metaTitle: "Resting Heart Rate: Meaning and Measurement"
metaDescription: "Resting heart rate is your lowest heart rate at rest. How it is measured, what normal means, what moves it, and why your own trend beats a single number."
shortAnswer: >
  Resting heart rate is the lowest number of heartbeats per minute while you are
  awake, calm and still, or the lowest stable rate a wearable finds during sleep.
  It is used to follow fitness, recovery and general health over time. It is
  influenced by fitness, sleep, alcohol, illness, heat, medicines and pregnancy.
  It does not by itself establish a diagnosis, and readings from different
  devices are not directly comparable.
keyPoints:
  - "Resting heart rate is the lowest heart rate measured at rest; a wearable's night-time value and a daytime sitting reading are related but not the same measurement."
  - "Each device computes its own resting heart rate from its own window and algorithm, so numbers from two devices cannot be compared directly."
  - "The conventional adult range is wide, and fit people often sit below it without any problem."
  - "Regular exercise, especially endurance training, lowers resting heart rate in controlled trials."
  - "In large population studies a higher resting heart rate is associated with higher mortality; that is an association, not a verdict for one person."
  - "A sustained rise over several days, compared with your own baseline, says more than any single value."
  - "Chest pain, fainting or severe breathlessness need medical care, whatever a wearable shows."
image: "/images/science/measurements-resting-heart-rate.png"
imageAlt: "A thin dark line wanders up and down on a white grid, then settles into a flat, steady stretch on a light grey panel, underlined by a pale green band — heart rate falling to its resting level."
imagePrompt: "Minimal scientific illustration on a clean white background with a faint light grid: one thin dark line running left to right, gently uneven on the left half, then descending and settling into a long flat steady line on a light grey right half, with a pale green band under the flat stretch marking the resting level; generous empty space, abstract and schematic, medically neutral, no text, no numbers, no labels, no axes values, no people, no devices, light and calm, wide."
editor: "Yakiv Bilenko"
reviewer: null
lastReviewed: null
related:
  articles: [resting-heart-rate-by-age, overtraining-hrv-resting-heart-rate, heart-rate-recovery-fitness-marker, doctors-and-your-data]
  tools: [resting-heart-rate]
  science: [concepts/hrv-baseline, measurements/heart-rate-variability, concepts/heart-rate-variability, concepts/autonomic-nervous-system]
sources:
  - id: S1
    cite: "Henning & Krawiec (2023)"
    title: "Sinus Tachycardia"
    journal: "StatPearls [Internet], StatPearls Publishing"
    year: 2023
    pmid: 31985921
    type: review
    note: "StatPearls chapter NBK553128, Last Update 2023-03-05 (PubMed ContributionDate); continuously updated reference chapter"
  - id: S2
    cite: "Zhang, Shen & Qi (2016)"
    title: "Resting heart rate and all-cause and cardiovascular mortality in the general population: a meta-analysis"
    journal: "CMAJ"
    year: 2016
    doi: "10.1503/cmaj.150535"
    pmid: 26598376
    type: meta-analysis
  - id: S3
    cite: "Reimers, Knapp & Reimers (2018)"
    title: "Effects of Exercise on the Resting Heart Rate: A Systematic Review and Meta-Analysis of Interventional Studies"
    journal: "Journal of Clinical Medicine"
    year: 2018
    doi: "10.3390/jcm7120503"
    pmid: 30513777
    type: meta-analysis
  - id: S4
    cite: "Pietilä et al. (2018)"
    title: "Acute Effect of Alcohol Intake on Cardiovascular Autonomic Regulation During the First Hours of Sleep in a Large Real-World Sample of Finnish Employees: Observational Study"
    journal: "JMIR Mental Health"
    year: 2018
    doi: "10.2196/mental.9519"
    pmid: 29549064
    type: observational
    note: "two co-authors employed by a heart-rate-monitoring company (Firstbeat)"
  - id: S5
    cite: "Loerup et al. (2019)"
    title: "Trends of blood pressure and heart rate in normal pregnancies: a systematic review and meta-analysis"
    journal: "BMC Medicine"
    year: 2019
    doi: "10.1186/s12916-019-1399-1"
    pmid: 31506067
    type: meta-analysis
  - id: S6
    cite: "Radin et al. (2020)"
    title: "Harnessing wearable device data to improve state-level real-time surveillance of influenza-like illness in the USA: a population-based study"
    journal: "Lancet Digital Health"
    year: 2020
    doi: "10.1016/S2589-7500(19)30222-5"
    pmid: 33334565
    type: observational
  - id: S7
    cite: "Mishra et al. (2020)"
    title: "Pre-symptomatic detection of COVID-19 from smartwatch data"
    journal: "Nature Biomedical Engineering"
    year: 2020
    doi: "10.1038/s41551-020-00640-6"
    pmid: 33208926
    type: observational
  - id: S8
    cite: "ONDA — What ONDA measures"
    title: "What ONDA measures"
    url: "https://onda-life.com/measurements"
    type: product-documentation
  - id: S9
    cite: "Sidhu & Marine (2020)"
    title: "Evaluating and managing bradycardia"
    journal: "Trends in Cardiovascular Medicine"
    year: 2020
    doi: "10.1016/j.tcm.2019.07.001"
    pmid: 31311698
    type: review
  - id: S10
    cite: "Fox et al., Heart Rate Working Group (2007)"
    title: "Resting heart rate in cardiovascular disease"
    journal: "Journal of the American College of Cardiology"
    year: 2007
    doi: "10.1016/j.jacc.2007.04.079"
    pmid: 17719466
    type: review
  - id: S11
    cite: "Karjalainen & Viitasalo (1986)"
    title: "Fever and cardiac rhythm"
    journal: "Archives of Internal Medicine"
    year: 1986
    pmid: 2424378
    type: observational
  - id: S12
    cite: "Green, Kirby & Suls (1996)"
    title: "The effects of caffeine on blood pressure and heart rate: A review"
    journal: "Annals of Behavioral Medicine"
    year: 1996
    doi: "10.1007/BF02883398"
    pmid: 24203773
    type: review
  - id: S13
    cite: "D'Ambrosio et al. (2026)"
    title: "Bradycardia in Athletes: Prevalence, Mechanisms, and Risks"
    journal: "Circulation"
    year: 2026
    doi: "10.1161/CIRCULATIONAHA.125.076170"
    pmid: 41410046
    type: observational
evidenceMap:
  - claim: "By the standard clinical convention, a normal adult resting heart rate is fact rhr.adult.normal, and it varies with fitness level."
    sources: [S1]
    class: established
    claimType: measurement
    quote: "The normal resting heart rate for adults is between 60 and 100 beats per minute, which varies with fitness level and the presence of comorbidities."
    limitation: "A clinical convention from a reference chapter, not an outcome-based threshold."
  - claim: "Fit people often sit lower, and in population studies a lower resting heart rate is associated with lower long-term mortality (fact rhr.adult.normal.caveat): a slow resting rate can be a normal finding in young athletic people, and risk rises continuously with heart rate above the lower end of the conventional range."
    sources: [S9, S2, S10]
    class: established
    claimType: physiology
    quote: "bradycardia can be observed as a normal phenomenon in young athletic individuals"
    limitation: "Second supporting quote (S10): Studies have found a continuous increase in risk with HR above 60 beats/min. The mortality link is a population association (S2), not an individual prediction."
  - claim: "Well-trained people often have a resting heart rate below the conventional lower limit, and many elite endurance athletes reach a lowest daily heart rate of forty bpm or less, which was well tolerated (fact rhr.trained)."
    sources: [S9, S13]
    class: established
    claimType: physiology
    quote: "Resting bradycardia (HR ≤40 bpm) and pauses of 2 to 3 s are present in a significant proportion of endurance athletes and are well tolerated."
    limitation: "S13 measured the minimum heart rate on a Holter monitor (including sleep) in elite endurance athletes, not a daytime resting reading; S9 supports bradycardia as a normal finding in young athletic people. A low rate with symptoms is a separate question."
  - claim: "Regular exercise lowers resting heart rate; in controlled trials endurance training and yoga lowered it significantly in both sexes."
    sources: [S3]
    class: established
    claimType: efficacy
    quote: "All types of sports decreased the RHR. However, only endurance training and yoga significantly decreased the RHR in both sexes."
    limitation: "Healthy participants; the size of the drop depended on the starting rate and age."
  - claim: "Alcohol intake was associated, dose-dependently, with less cardiovascular relaxation during the first hours of sleep, including heart rate."
    sources: [S4]
    class: context-dependent
    claimType: physiology
    quote: "Alcohol intake disturbs cardiovascular relaxation during sleep in a dose-dependent manner in both genders."
    limitation: "A single observational within-person study in Finnish employees with self-reported intake; two co-authors worked for a heart-rate-monitoring company."
  - claim: "Heart rate rises over the course of a normal pregnancy (fact rhr.pregnancy.rise)."
    sources: [S5]
    class: established
    claimType: physiology
    quote: "Mean (95% CI) heart rate rose from 79.3 (75.5, 83.1) beats/min at 10 weeks to 86.9 (82.2, 91.6) beats/min at 40 weeks gestation, mean (95% CI) change 7.6 (1.8, 13.4) beats/min."
    limitation: "Pooled from studies of healthy pregnancies with high heterogeneity; not a reference range for one person."
  - claim: "In a meta-analysis of prospective cohort studies in the general population, higher resting heart rate was associated with higher all-cause and cardiovascular mortality."
    sources: [S2]
    class: established
    claimType: other
    quote: "Higher resting heart rate was independently associated with increased risks of all-cause and cardiovascular mortality."
    limitation: "Association from observational cohorts, with substantial heterogeneity and publication bias reported; it does not show that resting heart rate causes the outcome, and it is not an individual risk estimate."
  - claim: "In population studies, each ten bpm higher resting heart rate was associated with about a nine percent higher relative risk of death from any cause (fact rhr.mortality.per10); pooled RR 1.09 (95% CI 1.07-1.12) for all-cause and 1.08 (95% CI 1.06-1.10) for cardiovascular mortality."
    sources: [S2]
    class: established
    claimType: other
    quote: "The relative risk with 10 beats/min increment of resting heart rate was 1.09 (95% CI 1.07-1.12) for all-cause mortality and 1.08 (95% CI 1.06-1.10) for cardiovascular mortality."
    limitation: "Population association with substantial heterogeneity and publication bias; not causal, not an individual risk."
  - claim: "Fever raises heart rate, and in young men with an acute febrile infection it stayed high even during sleep."
    sources: [S11]
    class: context-dependent
    claimType: physiology
    quote: "During the febrile period, the heart rate remained high, even during sleep."
    limitation: "One small study of young men with uncomplicated infections, using 24-hour ECG; the size of the effect in other people may differ."
  - claim: "Beta-blockers and other heart-rate-lowering drugs lower heart rate, and that reduction is thought to be part of how they work in heart disease."
    sources: [S10]
    class: established
    claimType: physiology
    quote: "Clinical trial data suggest that HR reduction itself is an important mechanism of benefit of beta-blockers and other heart-rate lowering drugs used after acute myocardial infarction, in chronic heart failure, and in stable angina pectoris."
    limitation: "Evidence from patients with heart disease; it is not advice about taking or stopping any medicine."
  - claim: "Caffeine acutely raises blood pressure, but its effect on heart rate is less consistent across studies, and regular users develop tolerance."
    sources: [S12]
    class: debated
    claimType: physiology
    quote: "Heart rate data are less consistent, possibly due to the different ways HR is measured. Tolerance to the cardiovascular effects of caffeine has reliably been reported"
    limitation: "An older narrative review of mostly laboratory daytime studies; it does not address sleeping heart rate after late caffeine."
  - claim: "Acute infections can raise resting heart rate; population-level wearable resting heart rate and sleep data improved real-time estimates of influenza-like illness."
    sources: [S6]
    class: context-dependent
    claimType: measurement
    quote: "Acute infections can cause an individual to have an elevated resting heart rate (RHR) and change their routine daily activities due to the physiological response to the inflammatory insult."
    limitation: "One population-level surveillance study of a single brand of wearable; it tracks illness in states, not in individuals."
  - claim: "In a small smartwatch cohort, extreme rises in resting heart rate relative to the person's own baseline flagged many COVID-19 cases, some before symptoms."
    sources: [S7]
    class: emerging
    claimType: measurement
    quote: "63% of the COVID-19 cases could have been detected before symptom onset in real time via a two-tiered warning system based on the occurrence of extreme elevations in resting heart rate relative to the individual baseline."
    limitation: "A single retrospective study with few infected participants; not a validated diagnostic test, and a rise has many causes other than infection."
  - claim: "ONDA reads resting heart rate from Apple Health, compares nights with a personal corridor and does not diagnose; the window is fact baseline.window and the minimum changes are fact baseline.floors."
    sources: [S8]
    class: established
    claimType: device
    quote: "What ONDA measures"
    limitation: "Describes app behaviour only; it is not evidence for any health claim."
---

## What is resting heart rate?

Resting heart rate is the lowest number of heartbeats per minute your heart needs when you are not moving, digesting a large meal or reacting to anything. It is one of the simplest signals the body gives, and one of the oldest vital signs in medicine.

"Resting" can mean three different measurements, and they do not give the same number:

- **A daytime resting reading** — taken sitting or lying still for a few minutes while awake. This is what a clinic measures and what the classic reference ranges describe.
- **A morning reading** — taken right after waking, before getting up. It is usually lower than a daytime reading and easier to repeat under the same conditions.
- **A night-time or sleeping value** — computed by a wearable from heart rate during sleep. During sleep the heart usually runs slowest of the whole day, so this value tends to sit below a daytime reading.

When you compare numbers, compare like with like: morning with morning, night with night, one device with the same device.

## How does it work?

At rest the heart's pace is set by its own pacemaker cells and adjusted by the autonomic nervous system. Vagal (parasympathetic) influence slows the heart; sympathetic influence and circulating hormones speed it up. The [autonomic nervous system](/science/concepts/autonomic-nervous-system) page explains the two branches. Resting heart rate is the net result of these influences plus body temperature, blood volume, fitness and medicines — so it is a summary signal, not a readout of any single system.

## How is it measured?

**In the morning, before getting up.** Count the pulse for a full minute, or use a device, after waking and before standing up, coffee or exercise. Repeating it the same way each day gives a usable trend.

**During sleep, by a wearable.** Watches and rings estimate heart rate optically and report a "resting heart rate" for the night or the day. Each manufacturer decides which window counts as resting — the lowest stretch of sleep, an average over the night, or quiet periods during the day — and the method is often not published. Two devices can therefore report different resting values for the same person on the same night, and neither is wrong. Follow one device's trend rather than comparing numbers across devices.

**How accurate is the optical sensor at rest?** Heart rate is the easiest thing an optical sensor measures, and it is most reliable when you are still; motion and poor contact degrade it. The details of how optical pulse signals compare with an ECG are on [wearable HRV accuracy](/science/measurements/heart-rate-variability), and are not repeated here.

**What does "normal" mean?** By the standard clinical convention a normal adult resting heart rate is {{fact:rhr.adult.normal}} [S1]. That range is wide and old. {{fact:rhr.adult.normal.caveat}} [S9, S2, S10]. In well-trained people resting heart rate is {{fact:rhr.trained}}; a slow resting rate can be a normal finding in athletic people and was well tolerated in a large cohort of endurance athletes [S9, S13]. Age and sex tables live in [resting heart rate by age](/articles/resting-heart-rate-by-age), and you can place your own reading with the [resting heart rate by age tool](/tools/resting-heart-rate).

## What affects it?

- **Fitness.** Regular exercise lowers resting heart rate. A meta-analysis of controlled trials in healthy people found that all types of sport lowered it, and endurance training and yoga lowered it significantly in both sexes [S3] (established).
- **Alcohol.** In a large real-world study, drinking was followed by less cardiovascular relaxation in the first hours of sleep, in a dose-dependent way, including a higher sleeping heart rate [S4]. That is one observational study (context-dependent).
- **Pregnancy.** Heart rate rises over the course of a normal pregnancy — in pooled data from healthy pregnancies by {{fact:rhr.pregnancy.rise}} [S5] (established, with high heterogeneity between studies).
- **Illness and fever.** Acute infections can raise resting heart rate as part of the body's response to inflammation [S6]. Fever itself speeds the heart: in a small study of young men with an acute febrile infection, heart rate stayed high even during sleep and came down after recovery [S11] (context-dependent, one small study).
- **Caffeine.** Caffeine reliably raises blood pressure for a while, but its effect on heart rate is less consistent across studies, and regular users develop tolerance to its cardiovascular effects [S12] (debated). Whether a late cup shows up in your own night-time resting heart rate is best judged against your own baseline.
- **Medicines.** Some medicines change heart rate. Beta-blockers and other heart-rate-lowering drugs slow the heart, and that slowing is thought to be part of how they help in heart disease [S10]; other medicines can speed it up. If you take regular medication, read your numbers against your own trend and ask your doctor before drawing conclusions — never change a medicine because of a wearable reading.
- **Other everyday factors.** Short or broken sleep, dehydration, heat, psychological stress and hard training without enough recovery can all push resting heart rate up for a while. These are widely recognised, but this page does not cite a specific study for each, so treat them as general context rather than measured effects.

For how resting heart rate and HRV move together during heavy training, see [overtraining, HRV and resting heart rate](/articles/overtraining-hrv-resting-heart-rate). How fast your heart rate comes down after exercise is a different marker, covered in [heart rate recovery](/articles/heart-rate-recovery-fitness-marker).

## What does the evidence show?

**Established — resting heart rate and long-term outcomes in populations.** A meta-analysis of prospective cohort studies in the general population found that a higher resting heart rate was independently associated with higher all-cause and cardiovascular mortality [S2]. In population studies, {{fact:rhr.mortality.per10}} [S2]. The authors also reported substantial heterogeneity and publication bias. This is an **association in populations**: it does not show that resting heart rate itself causes the outcome, and it is not a risk score or a diagnosis for an individual.

**Established — exercise lowers it.** Controlled trials pooled in a meta-analysis show regular exercise lowers resting heart rate in healthy people [S3].

**Context-dependent — illness shows up in population wearable data.** In a population-based study of consumer wearable users, the share of people with an elevated resting heart rate and longer sleep improved real-time estimates of influenza-like illness at state level [S6]. This tracks illness in a population, not in a person.

**Emerging — a personal rise as an early sign of infection.** In a small retrospective smartwatch study, extreme rises in resting heart rate **relative to each person's own baseline** flagged many COVID cases, some before symptoms began [S7]. It is a single study with few infected participants, not a validated diagnostic test.

**Trend versus single value.** These studies share one pattern: the useful signal is a **sustained change against your own baseline over several days**, not a single number. A single high night can follow a late meal, a drink or a warm bedroom. How a personal baseline is built and how readings are compared with it is explained on [HRV baseline](/science/concepts/hrv-baseline) — the same logic applies to resting heart rate. A rise that persists can go with illness, poor sleep or training overload; what remains uncertain is how well any single rule separates these causes in one person.

## What it does not tell you

- **It is not a diagnosis.** A number inside or outside the conventional range does not by itself establish health or disease.
- **Population links are not personal predictions.** The mortality associations come from large groups [S2]; they do not tell you your own risk.
- **Device numbers are not interchangeable.** Different watches and rings define resting heart rate differently; a gap between them is not an error in your heart.
- **Low is not always better, and high is not always bad.** A low rate can be normal in trained people [S9]; a higher rate in pregnancy is normal [S5].
- **When to see a doctor.** As a general precaution, see a doctor if your resting heart rate stays high over weeks without an obvious reason, or if a low heart rate comes with dizziness, fainting or breathlessness. Chest pain, fainting or severe breathlessness need urgent care — do not wait for a wearable trend. If you bring your data along, [doctors and your data](/articles/doctors-and-your-data) explains what a [family doctor](/articles/onda-report-for-your-gp) or a [cardiologist](/articles/onda-report-for-your-cardiologist) can and cannot do with it.

## In ONDA

Resting heart rate is one of the three nightly signals in ONDA's baseline, together with HRV and breathing rate. ONDA reads it from Apple Health — written by Apple Watch or by any device whose app syncs heart data there — and builds your personal baseline over {{fact:baseline.window}}. It compares each night with your own corridor, never with a population norm, and it flags a change only when it also passes minimum floors: {{fact:baseline.floors}}. Without a watch, the phone camera gives a resting pulse reading, but no baseline extras. ONDA describes changes; it does not diagnose anything [S8]. See [what ONDA measures](/measurements).

> Educational information, not a diagnosis or medical treatment.
