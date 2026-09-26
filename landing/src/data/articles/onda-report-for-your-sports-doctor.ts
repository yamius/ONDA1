import type { Article } from './types'

/**
 * Series "Doctors and Your Data" (tasks 595-600). Honest framing: watch data is context, never a
 * diagnosis; pulse is not rhythm; ONDA report = on-device PDF (baseline, signals, notes), shared only by
 * the user. HRV/breathing baseline from Apple Watch. Not a medical device.
 */
const article: Article = {
  slug: 'onda-report-for-your-sports-doctor',
  title: "Showing Your Recovery Data to a Sports Doctor: Training, Overtraining and Coming Back Safely",
  seoTitle: "Showing Your Recovery Data to a Sports Doctor | ONDA Life",
  description:
    "Resting heart rate and HRV trends show how your body handles training. Here's how a sports medicine doctor can use them — to spot overreaching, find hidden causes of poor recovery, and guide a safe return after illness.",
  category: 'Guide',
  relatedSlugs: ["onda-report-for-your-gp", "onda-report-for-your-cardiologist", "overtraining-hrv-resting-heart-rate", "heart-rate-recovery-fitness-marker", "zone-2-training-aerobic-base"],
  introStyle: 'emerald',
  neuralSuggestion: {
    text: "Bring one page, not your phone: your baseline, what changed and when, your notes and your questions.",
    link: '/articles/talk-to-your-doctor-about-wearable-data',
    linkText: "How to talk to your doctor →",
  },
  content: `
For anyone who trains, resting heart rate and HRV are some of the most practical numbers a watch collects — because they show how your body is *absorbing* the training, not just how hard you trained. A sports medicine doctor can read those trends in context: telling normal hard-training fatigue apart from overreaching, looking for hidden causes when recovery stalls, and guiding a safe return after illness or injury. What they bring that your watch can't is the examination, the tests and the judgment about when a pattern is a training problem — and when it's a medical one.

*Part of our series [Doctors and Your Data](/articles/doctors-and-your-data).*

## What a sports doctor is looking at

A sports medicine doctor sits between training and health. The questions they usually bring are:

- Is your body **adapting** to training, or falling behind it?
- If recovery is poor, is it the **training plan** — or something medical, like illness, low energy intake or a deficiency?
- Is it **safe** to train now, or to come back after being unwell?
- Do any symptoms during exercise need a **heart check**?

Your data helps them answer the first two faster, and flags when the last two matter.

## How a sports doctor can read your report

**Resting heart rate trend.** In general, as aerobic fitness improves, resting heart rate tends to drift down over weeks. A resting heart rate that climbs and stays above your normal for several days — without an obvious reason — often means your body is under more load than it's handling: accumulated fatigue, poor sleep, illness coming on, or not eating enough.

**HRV trend.** Many athletes use morning or overnight HRV as a recovery signal. A sustained drop below your usual range, especially together with rising resting heart rate and tiredness, fits a picture of insufficient recovery. A sports doctor will look at the **trend over days and weeks**, not single readings, which fluctuate with sleep, alcohol and stress.

**Breathing rate at rest.** A resting breathing rate above your normal, together with other changes, can be one more hint that the body isn't recovering — or that an illness is developing.

**Signals and notes.** Dates when measures left your range, alongside your notes on training blocks, races, travel, illness and sleep, let a sports doctor line up the numbers with what you actually did.

## What help a sports doctor can offer

**Tell overreaching from overtraining.** Short-term overreaching — a planned hard block with temporary fatigue — is normal and recovers with rest. Overtraining syndrome is a longer-lasting, harder-to-fix state. Weeks of trends make the difference easier to see, and a sports doctor can help adjust the plan before a hard block turns into months lost.

**Look for hidden causes of poor recovery.** When recovery stalls despite sensible training, a sports doctor may consider medical causes — for example iron deficiency, thyroid problems, or low energy availability (not eating enough for the training you do, sometimes called RED-S). These need examination and tests, not more data.

**Guide a return after illness.** After a viral illness, resting heart rate is often elevated for a while. A trend returning to your normal range is one reassuring sign when planning a gradual comeback — together with feeling well and the doctor's own assessment. Returning too early is a common way to prolong illness.

**Shape the training plan.** Some athletes adjust daily intensity using HRV trends; research on HRV-guided training suggests it can be a useful way to individualize load. A sports doctor or coach can help decide whether that suits you.

**Refer when symptoms point to the heart.** Chest pain, unusual breathlessness, palpitations or dizziness during exercise need a heart check, not a training tweak. A sports doctor will refer you to a cardiologist when that's warranted.

## Where watch data stops

- **Wrist heart rate is less reliable during hard exercise**, especially intervals and strength work. Resting and overnight values are more trustworthy than mid-workout readings.
- **Single days are noise.** One low HRV morning usually means a bad night or a glass of wine, not overtraining.
- **Scores aren't diagnoses.** Readiness or recovery scores can't identify iron deficiency, thyroid problems or RED-S — only examination and tests can.
- **Don't train through illness because your numbers look fine.** How you feel, fever and symptoms come first.

Stop exercising and seek care immediately if you have chest pain, faint or nearly faint, or have a very fast or irregular heartbeat with feeling unwell during exercise.

## How to prepare for the appointment

- **Bring 6–12 weeks** of your report, covering normal training and the period that worries you.
- **Include your training log** — volume, intensity, races — or a short summary.
- **Note sleep, food and weight changes**, illness, travel and stress in that period.
- **Describe symptoms during exercise** precisely: what, when, how long.
- **Ask:** "Is this a training problem or should we check something medical?"

## Your recovery, on one page

ONDA builds your personal baseline for resting heart rate, HRV and breathing from your Apple Watch history, marks the days you left your usual range, and lets you add notes about training, illness and sleep. You can export any period as a PDF — generated on your device and shared only by you — so a sports doctor sees how your body actually handled your training.

*ONDA is a breathing and HRV biofeedback app, not a medical device. This article is general information, not medical advice. If you have chest pain, fainting or an irregular heartbeat during exercise, stop and seek care immediately.*
`,
}

export default [article]
