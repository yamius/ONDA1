import type { Article } from './types'

/**
 * Series "Doctors and Your Data" (tasks 595-600). Honest framing: watch data is context, never a
 * diagnosis; pulse is not rhythm; ONDA report = on-device PDF (baseline, signals, notes), shared only by
 * the user. HRV/breathing baseline from Apple Watch. Not a medical device.
 */
const article: Article = {
  slug: 'doctors-and-your-data',
  title: "Doctors and Your Data: Which Specialist Can Use Your Heart, HRV and Sleep Trends",
  seoTitle: "Doctors and Your Data | ONDA Life",
  description:
    "Your watch records months of heart rate, HRV, breathing and sleep. This guide shows which doctor can use that data for which problem — GP, cardiologist, sleep specialist, therapist or sports doctor — and how to bring it.",
  category: 'Guide',
  relatedSlugs: ["talk-to-your-doctor-about-wearable-data", "onda-report-for-your-gp", "onda-report-for-your-cardiologist", "onda-report-for-your-sleep-specialist", "onda-report-for-your-therapist-or-psychiatrist", "onda-report-for-your-sports-doctor"],
  introStyle: 'gold',
  neuralSuggestion: {
    text: "Start with the general guide, then pick the doctor that fits your question.",
    link: '/articles/talk-to-your-doctor-about-wearable-data',
    linkText: "Start here →",
  },
  content: `
Your watch records something no doctor normally sees: weeks and months of your resting heart rate, HRV, breathing and sleep, night after night. Brought in the right form, that history helps a doctor understand what changed, when, and what else was happening — and decide what, if anything, needs checking. But different doctors use it for different things. A GP looks for everyday causes and decides on next steps; a cardiologist uses it to choose the right heart test; a sleep specialist reads your nights; a therapist connects your body with your life; a sports doctor reads your recovery. This guide shows who to see for what, and how to bring your data so it actually helps.

## Start here

Before any appointment, read the general guide: what doctors find useful, how to put your data on one page, and how to talk about it without being dismissed.

→ **[How to Talk to Your Doctor About Your Watch Data](/articles/talk-to-your-doctor-about-wearable-data)**

## Which doctor for what

| What's going on | Who to see first | Then, if needed |
|---|---|---|
| Something changed and you're not sure what it means | GP / family doctor | the right specialist |
| Resting pulse up for weeks, palpitations, breathlessness | GP | cardiologist |
| Poor sleep, waking unrefreshed, irregular schedule, snoring | GP | sleep specialist |
| Stress, anxiety, low mood showing up in your body | GP or therapist | psychiatrist (for medication) |
| Training, poor recovery, coming back after illness | sports doctor | cardiologist if symptoms during exercise |

In most healthcare systems, the GP is the right first step: they see your whole history, rule out common causes, and refer you on only when needed.

## The guides, one per doctor

**Your GP (family doctor).** The first person to see your data. Matches changes to everyday causes like infection, medication, sleep or alcohol, decides whether tests are worth doing, and refers you on.
→ **[Showing Your Heart Data to Your GP](/articles/onda-report-for-your-gp)**

**Cardiologist.** Reads your resting heart rate pattern and dated episodes to choose the right heart test and follow treatment. Clear about the limit: pulse is not rhythm.
→ **[Showing Your Heart Data to a Cardiologist](/articles/onda-report-for-your-cardiologist)**

**Sleep specialist.** Reads weeks of your nights — timing, nightly heart rate, HRV and breathing — to tell insomnia, body-clock problems and possible breathing issues apart. Plus the trap of over-tracking sleep.
→ **[Showing Your Night Data to a Sleep Specialist](/articles/onda-report-for-your-sleep-specialist)**

**Therapist or psychiatrist.** Uses your body data as a mirror: spotting triggers, building body awareness, seeing progress in therapy, and — for a psychiatrist — watching medication effects.
→ **[Bringing Your Body Data to Therapy](/articles/onda-report-for-your-therapist-or-psychiatrist)**

**Sports doctor.** Reads your recovery: overreaching versus overtraining, hidden causes when recovery stalls, and a safe return after illness.
→ **[Showing Your Recovery Data to a Sports Doctor](/articles/onda-report-for-your-sports-doctor)**

## What every doctor has in common

Whoever you see, the same rules make your data useful:

- **One page, not your phone.** Baseline, what changed and when, your notes, your questions.
- **Symptoms first, data second.** How you feel matters more than any number.
- **Trends, not single days.** One bad night means little; weeks tell a story.
- **Data is not a diagnosis.** It points to a question; examination and tests answer it.
- **Urgent symptoms come first.** Chest pain, fainting or severe breathlessness — seek care immediately, don't check an app.

## Bring your data in a form doctors can read

ONDA builds your personal baseline for resting heart rate, HRV and breathing from your Apple Watch history, marks the days you left your usual range, and lets you add notes when something happens. From the timeline you can export any period as a PDF — generated on your device and shared only by you. It's the one-page summary each of these doctors can read in a minute.

*ONDA is a breathing and HRV biofeedback app, not a medical device. This guide is general information, not medical advice. If you have urgent symptoms, seek medical care immediately.*
`,
}

export default [article]
