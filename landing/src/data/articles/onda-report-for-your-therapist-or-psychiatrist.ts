import type { Article } from './types'

/**
 * Series "Doctors and Your Data" (task 601): therapist vs psychiatrist. Honest framing: body data is a
 * mirror, not a diagnosis; HRV-emotion link is population-level only; Morita over-tracking caveat;
 * crisis line. ONDA report = on-device PDF shared only by the user. Not a medical device.
 */
const article: Article = {
  slug: 'onda-report-for-your-therapist-or-psychiatrist',
  title: "Bringing Your Body Data to Therapy: How a Therapist or Psychiatrist Can Use It",
  seoTitle: "Bringing Your Body Data to Therapy | ONDA Life",
  description:
    "Stress and emotion leave traces in your heart rate, HRV, breathing and sleep. Here's how a psychotherapist or psychiatrist can use that history \u2014 to spot triggers, build body awareness, track progress and watch medication effects.",
  category: 'Guide',
  relatedSlugs: ["doctors-and-your-data", "onda-report-for-your-gp", "morita-therapy-tracking-paradox", "anxiety-panic-breathing-hrv", "name-it-to-tame-it-affect-labeling"],
  introStyle: 'purple',
  neuralSuggestion: {
    text: "A mirror, not a verdict: bring the moments that mattered, share only what you choose.",
    link: '/articles/doctors-and-your-data',
    linkText: "Which doctor for what →",
  },
  content: `
Emotions don't stay in your head. A difficult conversation, a stressful week or a low stretch often shows up in your body first — a resting heart rate that won't settle, lower HRV, faster breathing, shorter sleep. A psychotherapist or psychiatrist can use that history in a way other doctors don't: not to diagnose, but to **connect what your body did with what was happening in your life**. It can help you notice triggers you'd missed, build awareness of your own body's signals, see progress in therapy, and — with a psychiatrist — keep an eye on how medication affects you. Used well, it's a mirror, not a verdict.

*Part of our series [Doctors and Your Data](/articles/doctors-and-your-data).*

## Therapist or psychiatrist: two different roles

They're often confused, and they'll use your data differently.

**A psychotherapist** (psychologist, counselor or therapist) works through conversation and practice: understanding patterns, emotions, relationships and habits. They don't prescribe medication. For them, your data is material for insight and a way to track change.

**A psychiatrist** is a medical doctor. They diagnose mental health conditions and can prescribe and adjust medication. For them, your data is also useful for noticing side effects and changes in sleep and arousal over time.

## Why body data belongs in therapy

As a Gestalt-trained therapist, I've long seen that people often know what their body is doing before they can put it into words. Research points the same way. Heart rate variability is linked to how flexibly the nervous system regulates emotion: on average, people with higher resting HRV tend to show better emotional regulation, and lower HRV is more common in groups experiencing anxiety or depression. That doesn't mean a number tells you your mental state — it varies hugely between people. But it means the body carries real, relevant information that talk alone can miss.

## How a therapist can use your report

**Spot triggers you didn't see.** Your timeline marks the days your resting heart rate, HRV or breathing left your usual range. Next to your notes, patterns appear: the Sunday evenings before work, the week of a family visit, the nights after a particular kind of argument. These become concrete starting points for the session.

**Build body awareness.** Many people under chronic stress lose touch with their body's signals. Seeing that "the day I felt fine, my body was clearly on edge" can be an important moment. A therapist can help you learn to notice those signals earlier — without the numbers, over time.

**Name and understand what you felt.** Putting a word to an emotion helps regulate it. Your notes and signals give a therapist a precise moment to explore: what happened, what you felt, what your body did.

**See progress that's hard to feel.** Change in therapy is often gradual and easy to doubt. A slow return toward your baseline, fewer out-of-range days, or a quicker recovery after stressful events can be encouraging, visible evidence that the work is doing something.

**Support breathing and regulation skills.** If your therapist teaches regulation techniques, slow breathing practice gives an immediate, observable response — your heart settling — which some people find more convincing than being told to "calm down." HRV biofeedback has been studied as a supportive tool for stress and anxiety, alongside therapy rather than instead of it.

## How a psychiatrist can use your report

**Watch medication effects.** Some psychiatric medications can change heart rate or sleep. A dated trend shows whether a change began when a medication started or its dose changed — useful information to discuss, never a reason to adjust medication yourself.

**Notice changes in sleep and arousal.** Sleep and arousal often shift with mood. Research is exploring whether changes in sleep and physiological patterns can act as early signals of mood changes for some people. A psychiatrist can decide whether your trends are relevant to your care.

**Add context between appointments.** Psychiatric appointments can be short and weeks apart. Your timeline and notes fill in what happened in between.

## What it can't and shouldn't do

- **It doesn't diagnose.** No heart-rate or HRV pattern diagnoses anxiety, depression or any other condition.
- **It isn't treatment.** Breathing practice can support therapy and treatment; it doesn't replace them.
- **It can feed anxiety.** For some people — especially with health anxiety — watching body data closely makes things worse. Japanese Morita therapy described this loop a century ago: fixing attention on a sensation intensifies it. If tracking makes you more anxious, tell your therapist and look less often.
- **You decide what to share.** Your notes are personal. Share the parts you choose; a good therapist will respect that.

If you're in crisis or thinking about harming yourself, contact your local emergency number or a crisis line now. Don't wait for an appointment, and don't look to an app for help in that moment.

## How to bring it into a session

- **Choose a period that matters** — a hard month, or the weeks since you started therapy.
- **Mark two or three moments** you'd like to talk about, with dates.
- **Share the one-page report**, or just the parts you're comfortable with.
- **Start with the experience, not the numbers:** "That week felt heavy, and my body shows it."
- **Ask how your therapist wants to use it** — some will build it into sessions, others prefer to focus on conversation.

## Your body's story, on one page

ONDA builds your personal baseline for resting heart rate, HRV and breathing from your Apple Watch, marks the days you left your usual range, and lets you write a note when something happens. You can export any period as a PDF — generated on your device and shared only by you — so you can bring your body's side of the story into the room, on your terms.

*ONDA is a breathing and HRV biofeedback app, not a medical device, and does not diagnose or treat mental health conditions. This article is general information, not medical advice. If you're in crisis, contact your local emergency number or a crisis line.*
`,
}

export default [article]
