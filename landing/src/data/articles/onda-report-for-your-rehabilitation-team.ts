import type { Article } from './types'

/**
 * Series "Doctors and Your Data" (tasks 602-607). Honest framing: watch data is context, never a
 * diagnosis; ONDA report = on-device PDF (baseline, signals, notes), shared only by the user. HRV and
 * breathing baseline from Apple Watch. Not a medical device.
 */
const article: Article = {
  slug: 'onda-report-for-your-rehabilitation-team',
  title: "Recovery Isn't a Straight Line: What a Rehabilitation Doctor or Physiotherapist Can Do With Your Data",
  seoTitle: "Recovery Isn't Linear: Data for Your Rehab Team | ONDA Life",
  description:
    "After illness, surgery or a heart event, recovery comes in steps, setbacks and plateaus. Here's how a rehabilitation team can use your resting heart rate, HRV and breathing history to pace your comeback — and why the day after an effort tells more than the day of.",
  category: 'Guide',
  relatedSlugs: ["doctors-and-your-data", "onda-report-for-your-cardiologist", "onda-report-for-your-pulmonologist", "onda-report-for-your-neurologist", "onda-report-for-your-sports-doctor"],
  introStyle: 'emerald',
  neuralSuggestion: {
    text: "Bring one page, not your phone: your baseline, what changed and when, your notes and your questions.",
    link: '/articles/doctors-and-your-data',
    linkText: "Which doctor for what →",
  },
  content: `
Recovery after a serious illness, surgery, a heart event or a long bout of COVID rarely goes in a straight line. It moves in steps: a few good days, a setback, a plateau, then another step up. From the inside, that's hard to judge — a bad week can feel like going backwards when you're actually on track. Your resting heart rate, HRV and breathing, tracked over weeks, show the real shape of your recovery. A rehabilitation team — rehabilitation doctors, physiotherapists and cardiac or pulmonary rehab staff — can use that shape to pace your comeback: how fast to increase activity, when to hold back, and when a setback needs a closer look.

*Part of our series [Doctors and Your Data](/articles/doctors-and-your-data).*

## Who's on a rehabilitation team

Rehabilitation brings together several professionals. A **rehabilitation doctor** (physiatrist) leads medical planning. **Physiotherapists** design and progress exercise. Structured programmes exist for specific situations: **cardiac rehabilitation** after a heart attack, heart surgery or heart failure; **pulmonary rehabilitation** for lung conditions; and post-illness programmes such as those for long COVID. Cardiac and pulmonary rehabilitation are among the best-established rehabilitation programmes in medicine.

What they all share is a single question: *how much can this body do today, and how do we safely build from here?*

## The day after tells more than the day of

Here's the most useful idea for anyone recovering: **how your body responds the next day often says more than how the effort felt at the time.**

A walk that felt fine can be followed by a night of elevated heart rate, low HRV and poor sleep — a sign the load was more than your body could absorb yet. For some conditions, particularly after viral illness and in people prone to post-exertional crashes, symptoms can appear 24 to 48 hours after an activity. That delay is exactly why feelings alone are an unreliable guide, and why a trend across days is so useful to a rehabilitation team.

## How a rehabilitation team can read your report

**Resting heart rate trend.** As recovery progresses, resting heart rate often settles back toward your pre-illness normal. A steady downward drift is encouraging; a jump after increasing activity suggests the step was too big.

**HRV trend.** A gradual rise often accompanies improving recovery and fitness. A sharp dip the day after a session is useful feedback on load.

**Breathing rate.** For lung and post-COVID rehab especially, a stable night-time breathing rate is reassuring; a rising one alongside symptoms is worth flagging.

**Your notes — as a training diary.** What you did each day (walk length, sessions, stairs), how you felt during and after, sleep, and symptoms. Together with the numbers, this lets a physiotherapist see cause and effect.

## What help a rehabilitation team can offer

**Set safe starting points and intensities.** In cardiac rehab, exercise intensity is usually set from clinical testing and supervised, often using perceived effort as well as heart rate — especially because some heart medications, like beta blockers, blunt heart rate. Targets should come from your team, not from a general chart.

**Progress activity at the right pace.** Physiotherapists increase load gradually and adjust based on how you respond. Your next-day trends make each adjustment more informed.

**Pace to avoid crashes.** For people with post-exertional symptoms, rehab may focus on pacing — staying within limits to avoid setbacks — rather than pushing. Some clinicians use heart rate to help with this, as they advise.

**Include breathing work.** Pulmonary and post-COVID programmes often include breathing retraining; slow, controlled breathing can also help people stay calm and steady during recovery.

**Spot when a setback needs more than rest.** A trend that worsens and doesn't recover, or new symptoms, may prompt a review by your doctor, cardiologist, pulmonologist or neurologist.

**Show progress you can't feel.** Months of slow change are easy to doubt. A baseline returning to normal is concrete evidence that the work is paying off — and good for motivation.

## Where watch data stops

- **Follow your team's targets, not general ones.** After a heart event especially, use the heart rate zones and limits your clinicians set.
- **Wrist heart rate is less reliable during exercise** than at rest; resting and overnight trends are more trustworthy.
- **Don't push through warning signs** because your numbers look fine. Symptoms come first.
- **Data supports supervision; it doesn't replace it.**

Stop and seek urgent care for chest pain, fainting, severe breathlessness, a very fast or irregular heartbeat with feeling unwell, or new neurological symptoms.

## How to prepare for the appointment

- **Bring your report from before the illness if you have it** — it shows your true baseline to return to.
- **Keep a simple daily log** in your notes: activity, how you felt during and the next day, sleep.
- **Mark setbacks and what preceded them.**
- **List medications**, especially any that affect heart rate.
- **Ask:** "What should I watch for the day after a session, and when should I hold back?"

## Your recovery, on one page

ONDA builds your personal baseline for resting heart rate, HRV and breathing from your Apple Watch history, marks the days you left your usual range, and lets you log activity and symptoms. You can export any period as a PDF, generated on your device and shared only by you, so your rehabilitation team sees the real shape of your recovery.

*ONDA is a breathing and HRV biofeedback app, not a medical device. This article is general information, not medical advice. Follow the targets set by your clinicians, and seek urgent care for chest pain, fainting or severe breathlessness.*
`,
}

export default [article]
