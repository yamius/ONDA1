import type { Article } from './types'

/**
 * Series "Doctors and Your Data" (tasks 595-600). Honest framing: watch data is context, never a
 * diagnosis; pulse is not rhythm; ONDA report = on-device PDF (baseline, signals, notes), shared only by
 * the user. HRV/breathing baseline from Apple Watch. Not a medical device.
 */
const article: Article = {
  slug: 'onda-report-for-your-cardiologist',
  title: "Showing Your Heart Data to a Cardiologist: What They Can (and Can't) Do With It",
  seoTitle: "Showing Your Heart Data to a Cardiologist | ONDA Life",
  description:
    "A cardiologist reads your heart-rate trends differently from a GP. Here's what a heart specialist can take from a resting heart rate, HRV and breathing report, what tests they may use next, and where watch data stops.",
  category: 'Guide',
  relatedSlugs: ["onda-report-for-your-gp", "talk-to-your-doctor-about-wearable-data", "resting-heart-rate-by-age", "normal-hrv-by-age", "heart-rate-recovery-fitness-marker"],
  introStyle: 'rose',
  neuralSuggestion: {
    text: "Bring one page, not your phone: your baseline, what changed and when, your notes and your questions.",
    link: '/articles/talk-to-your-doctor-about-wearable-data',
    linkText: "How to talk to your doctor →",
  },
  content: `
A cardiologist is the specialist most at home with heart-rate data — but they read it differently from you, and differently from your GP. What interests them is **the pattern**: how your resting heart rate behaves over weeks, whether changes line up with symptoms like palpitations, breathlessness or dizziness, and how your body responds to treatment. Your watch data can't show the heart's electrical rhythm the way an ECG does, so it won't replace their tests. What it can do is give them a long, dated history they would otherwise never see — and help them decide which test will actually capture what's going on.

*Part of our series [Doctors and Your Data](/articles/doctors-and-your-data).*

## Why a cardiologist sees your data differently

A GP asks *is this something or nothing?* A cardiologist, usually seeing you after a referral, asks narrower questions: *is the heart involved, how, and how much?* They think in terms of rhythm, rate, structure and response to effort — and they have tools a watch doesn't: ECGs, extended rhythm monitoring, heart ultrasound and exercise testing.

That changes what's useful. Your report is most valuable to a cardiologist as a **timeline of context** — when things changed, how long they lasted, and what you felt — that helps them choose and time the right test.

## How a cardiologist can read each part of your report

**Resting heart rate baseline and trend.** Resting heart rate is a well-understood measure in cardiology. A cardiologist will note your normal range and any sustained shift: a gradual rise over weeks, an abrupt change, or a new pattern after starting medication. Because it's built from many nights rather than one clinic reading, it avoids the "white coat" effect of a single measurement taken while you're anxious in the office.

**HRV trend.** In research, heart rate variability is linked to how well the autonomic nervous system regulates the heart, and reduced HRV is associated with poorer cardiovascular outcomes in some populations. In the clinic, though, consumer-watch HRV isn't used to diagnose anything. A cardiologist may treat it as supporting context — for example, a sustained drop alongside other changes — rather than a finding in itself.

**Breathing rate at rest.** A resting respiratory rate that stays higher than your normal can be relevant context, particularly alongside breathlessness or fatigue. On its own it points to a question, not an answer.

**Signals and your notes.** The dates when a measure left your range, and what you wrote at the time, let a cardiologist line up episodes with symptoms. "Palpitations on the evenings of the 4th, 9th and 15th, resting pulse higher that week" is far more useful than "I get palpitations sometimes."

## What help a cardiologist can offer

**Choose the right rhythm test.** A watch that tracks pulse can't tell what kind of rhythm you're having. If your timeline shows symptoms coming and going, a cardiologist may use an ECG, a Holter monitor (continuous ECG over a day or more) or a longer-term event monitor to actually capture the rhythm during an episode. Your data helps them judge how often episodes happen — and therefore how long monitoring needs to be.

**Check the heart's structure and effort response.** Depending on the picture, they may consider a heart ultrasound (echocardiogram) or an exercise test, which show things no wearable can.

**Adjust and monitor treatment.** Many heart medications change heart rate. Your trend shows how your resting heart rate settled after a new medication or dose change — useful objective feedback between appointments, alongside how you feel.

**Put fitness and recovery in context.** If you're recovering from illness, returning to exercise, or in cardiac rehabilitation, a steady trend back toward your baseline is reassuring and easy to follow over time.

**Advise on lifestyle and breathing.** For people with raised blood pressure or stress-related symptoms, a cardiologist may discuss lifestyle measures; slow breathing is one that research links to modestly lower blood pressure — as a complement to treatment, never a substitute.

## Where watch data stops

This matters more with a cardiologist than anywhere else:

- **Pulse is not rhythm.** Heart-rate trends can't diagnose arrhythmias. Only an ECG-type recording can show the rhythm itself.
- **Averages can hide short events.** A brief episode may not move a nightly resting heart rate at all.
- **Camera readings are spot checks.** An iPhone-camera pulse during practice is not a clinical measurement.
- **Separate alerts from trends.** If your watch has a medically cleared feature (such as an ECG app or irregular rhythm notification) and it gave you an alert, bring that separately with its date and time — it's a different kind of data from a breathing app's trends.
- **Never replace prescribed monitoring.** If you have a known heart condition, your cardiologist's plan comes first.

If you have chest pain, fainting, a very fast or irregular heartbeat with feeling unwell, or severe breathlessness, seek emergency care. Don't check your app first.

## How to prepare for the appointment

- **Bring your one-page report**, for the period around your symptoms.
- **List episodes with dates and times**, what you felt, how long it lasted, what you were doing.
- **Bring a list of all medications**, with when each started or changed.
- **Mention any separate watch alerts** (ECG, irregular rhythm) with dates.
- **Ask which test would capture it**: "Given how often this happens, what monitoring would show it?"

## Your trends, ready for a specialist

ONDA builds your personal baseline for resting heart rate, HRV and breathing from your Apple Watch history, marks the days you left your usual range, and lets you add notes when something happens. You can export the timeline for any period as a PDF — generated on your device and shared only by you — so a cardiologist sees your history at a glance before choosing the next test.

*ONDA is a breathing and HRV biofeedback app, not a medical device, and does not detect or diagnose heart conditions. This article is general information, not medical advice. If you have urgent symptoms, seek emergency care.*
`,
}

export default [article]
