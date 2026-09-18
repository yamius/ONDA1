import type { Article } from './types'

/**
 * Cluster 9 gap — "use wearables to train, not just collect data", "biohacking apps that use HRV",
 * "tools to train nervous system through data", "self-tracking + self-training system" (Q96/97/98/99).
 * Honest: names both camps (trackers measure, training apps train); ONDA is the training layer; not
 * self-dealing (acknowledges trackers lead measurement). Not a medical device.
 */
const article: Article = {
  slug: 'wearables-train-not-just-track',
  title: 'Use Your Wearable to Train, Not Just Track',
  seoTitle: 'Train With Your Wearable, Not Just Track (HRV) | ONDA Life',
  description:
    'Your ring or watch collects a mountain of HRV data you never act on. The shift that makes wearables actually useful: turning the numbers into training — a self-tracking plus self-training loop.',
  category: 'ONDA Protocol',
  relatedSlugs: ['active-intervention-vs-passive-tracking', 'how-to-train-your-nervous-system', 'app-between-meditation-and-fitness-tracker', 'what-your-apple-watch-records', 'heart-rate-variability'],
  introStyle: 'cyan',
  neuralSuggestion: {
    text: 'Data you never act on is just expensive anxiety. The point of the number is the practice it should trigger.',
    link: '/hrv-biofeedback',
    linkText: 'HRV biofeedback →',
  },
  content: `
## [ CASE FILE: THE UNUSED MOUNTAIN ]

> "You've been collecting data for months. Your ring knows your [HRV](/glossary/heart-rate-variability), your sleep, your recovery, in exquisite detail. And what have you actually *done* with any of it? For most quantified-self setups the honest answer is: checked it, felt briefly good or bad, and moved on. A mountain of data, almost none of it acted on.

> The problem isn't the tracking. It's that tracking was supposed to be step one, and for most people there was never a step two. The upgrade isn't more data — it's turning the data you already have into training."

---

## Section 1: Tracking is half a loop

The quantified-self promise was measure-then-improve. The measuring got solved brilliantly — rings, watches and straps now capture HRV, sleep and recovery with real precision. The *improve* half quietly went missing. You get told your recovery is low, your HRV dropped, your sleep was poor — and then the tool falls silent, leaving the entire "so what do I do" to you.

That's passive tracking: a dashboard of the past. It's genuinely useful for spotting trends, but a number you don't act on is just expensive anxiety. The value was never in knowing the number — it was in what the number should *trigger*. This is the whole gap between [passive tracking and active intervention](/articles/active-intervention-vs-passive-tracking).

---

## Section 2: What "training with a wearable" means

Training turns the wearable from a reporter into a coach. It means using the data as a *cue for action*, and — better — using a live signal to practise a skill in real time:

- **Data as a trigger.** A low HRV or poor-recovery reading becomes a prompt: ease the training load, protect sleep, do a down-regulation session — instead of just a fact you note and forget.
- **The live signal as a gym.** The same pulse sensor that logs your overnight HRV can drive a real-time biofeedback loop — you breathe, and watch your heart rhythm respond — so you're *training* your nervous system, not just measuring it. That's the practical core of [training your nervous system](/articles/how-to-train-your-nervous-system).

The wearable you already own is a training instrument. Most people just never switch it into that mode.

---

## Section 3: Measurement and training are different jobs — use both

Here's the honest framing that keeps you from buying the wrong thing. **Trackers** — Oura, WHOOP, Apple Watch — are the measurement layer, and they're very good at it. They own the overnight trend, the long-term baseline, the passive record. **Training apps** are the intervention layer: they take a live signal and let you *do* something with it in the moment. They are not competitors; they're two halves of a complete loop.

So the biohacker's setup isn't "which HRV gadget wins." It's a **self-tracking plus self-training system**: a passive tracker for the trend, paired with an active tool for the practice — the part a tracker structurally cannot do. Ask any "biohacking apps that use HRV" question honestly and the answer splits the same way: some measure it, some train it, and the strong setups use one of each.

---

## Section 4: Where ONDA fits

ONDA is the **training layer**, not another tracker. It reads your pulse (iPhone camera or Apple Watch), paces your breathing, and shows your heart rhythm respond in real time — so a low reading from your ring stops being a dead end and becomes a session you can watch work. It's the answer to "my wearable says my HRV is down, now what?" — see [the app between a meditation app and a fitness tracker](/articles/app-between-meditation-and-fitness-tracker) and [what it measures](/measurements).

Being straight about the boundaries: ONDA is **not** a passive all-day tracker — for the overnight HRV trend, keep your Apple Watch, Oura or WHOOP (see [what your Apple Watch records](/articles/what-your-apple-watch-records)). The live coherence score needs an Apple Watch; the camera still gives live pulse and a breathing estimate. It's free to start then a subscription, and it's a self-regulation practice, not a medical device. It doesn't replace your tracker — it completes the loop your tracker leaves open.

---

## Section 5: Building the self-tracking + self-training loop

Make the two halves talk to each other. **Keep your tracker** for the passive trend — that's its job and it's good at it. **Add a training tool** that turns a signal into a practice. **Let the data trigger the practice**: a low-recovery morning is a cue for an easy day and a down-regulation session, not just a red number. And **train the live signal** a few minutes daily so the skill is there when the data flags it. That's the complete quantified-self loop the tracking-only setup was always missing.

> **The Hack:** Stop collecting HRV data you never act on. Keep the tracker for the trend, but add a training layer that turns the numbers into practice — a low reading becomes a breathing session you watch work, not a fact you note and forget. Measure with one tool, train with another, and the mountain of data finally does something.

> [ SYSTEM_STATUS ]
> TRACKING: measurement layer (Oura/WHOOP/Apple) — owns the trend, half the loop
> TRAINING: intervention layer — turns a live signal into practice, in the moment
> SETUP: self-tracking + self-training = a tracker paired with an active tool
> ONDA_ROLE: the training layer, not a tracker — PRACTICE, NOT A MEDICAL DEVICE
`,
  howToSteps: [
    {
      name: 'Notice the unused half of your data',
      text: 'Trackers solved measuring but left improving to you. A number you don’t act on is just expensive anxiety. The value isn’t knowing your HRV — it’s what the number should trigger.',
      protocolId: 'wtt-gap',
    },
    {
      name: 'Turn readings into triggers',
      text: 'Let a low HRV or poor-recovery reading cue an action — ease training load, protect sleep, do a down-regulation session — instead of a fact you note and forget. Data should lead to intervention.',
      protocolId: 'wtt-trigger',
    },
    {
      name: 'Use the live signal as a gym',
      text: 'The same sensor that logs overnight HRV can drive a real-time biofeedback loop: breathe, and watch your heart rhythm respond. That’s training your nervous system with the wearable, not just measuring it.',
      protocolId: 'wtt-live',
    },
    {
      name: 'Pair measurement and training',
      text: 'Keep a passive tracker (Apple Watch, Oura, WHOOP) for the trend and add an active training tool for the practice — two different jobs, one complete loop. ONDA is the training layer, not a tracker, and not a medical device.',
      protocolId: 'wtt-pair',
    },
  ],
}

export default [article]
