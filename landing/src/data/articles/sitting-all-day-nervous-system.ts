import type { Article } from './types'

/**
 * Prolonged sitting / sedentary time → reduced HRV, sympathetic shift, blunted autonomic tone;
 * micro-movement and breath breaks blunt it. Ties to ONDA baseline (HRV/RHR) + practice breaks +
 * screen-apnea. Honest: measured effect, no "sitting = smoking" hype. Grounded, no fabricated stats.
 */
const article: Article = {
  slug: 'sitting-all-day-nervous-system',
  title: 'The Chair Tax: What a Day of Sitting Does to Your Nervous System',
  seoTitle: 'Sitting All Day, HRV & Autonomic Tone | ONDA Life',
  description:
    'Long, unbroken sitting doesn’t just stiffen your back — it nudges your autonomic balance toward sympathetic and flattens HRV. Why the problem is the uninterrupted stillness, and how small breaks pay it back.',
  category: 'ONDA Protocol',
  relatedSlugs: ['heart-rate-variability', 'screen-apnea-breathing', 'chronic-stress-nervous-system-never-off', 'zone-2-training-aerobic-base', 'coherent-breathing-guide'],
  introStyle: 'slate',
  image: '/images/articles/sitting-all-day-nervous-system.webp',
  imageAlt:
    "Seated holographic figure against an unbroken-hour clock, autonomic balance tilted toward sympathetic and a flat, low HRV trace.",
  imageTitle: "The chair tax — unbroken sitting tilts autonomic balance and flattens HRV",
  imageCaption:
    "The chair tax — why unbroken hours of sitting tilt autonomic balance toward sympathetic and flatten HRV, and how small frequent breaks pay it back.",
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'It isn’t that sitting is poison. It’s that unbroken stillness is a signal — and the fix is small and frequent.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
## [ CASE FILE: THE UNBROKEN HOUR ]

> "You sat down at nine. It's now one, and apart from a coffee refill you haven't really moved. Your back knows. What you can't feel is that your autonomic nervous system has been quietly drifting the whole time — balance tilting, variability flattening, the system settling into a low idle it wasn't built to hold for hours.

> The problem isn't the chair. It's the *uninterrupted* part."

---

## Section 1: Sitting is a signal, not just a posture

Let's kill the hype first: sitting isn't poison, and "sitting is the new smoking" is an overstatement. But prolonged, unbroken sedentary time does register in your physiology, and one of the places it shows is autonomic balance. Long stretches without movement are associated with **reduced [heart-rate variability](/glossary/heart-rate-variability)** and a shift toward [sympathetic](/glossary/sympathetic-nervous-system) dominance — the same low-grade activation pattern you'd rather not be marinating in for eight hours a day.

The key word is *unbroken*. Your body reads continuous stillness differently from the same amount of sitting broken up by movement. The dose that matters is the length of the uninterrupted block.

---

## Section 2: Why stillness tilts the balance

Movement is a constant input to your autonomic and vascular systems — muscle contractions pump blood, load the baroreflex, and keep [parasympathetic](/glossary/parasympathetic-nervous-system) and sympathetic tone in healthy dialogue. Remove that input for hours and the conversation goes quiet: blood flow slows, vascular function dips, and autonomic regulation drifts toward the sympathetic side without the rhythmic movement that normally keeps it balanced.

Stack a screen on top and it compounds — long focused sitting is also where [screen apnea](/articles/screen-apnea-breathing) creeps in, shallow breathing layering onto the stillness. Two small stressors, both invisible, both running for hours.

---

## Section 3: The fix is small and frequent, not big and occasional

Here's the encouraging part: the antidote to unbroken sitting isn't a marathon at the gym — it's *breaking the block.* Short, frequent interruptions — standing, a two-minute walk, a set of movements every half hour or so — blunt most of the autonomic cost, because they restore the movement input your system is missing. Frequency beats intensity here. A gym session at 6pm is great for other reasons, but it doesn't undo eight hours of uninterrupted stillness the way a movement break every half hour does.

The same is true for the breath: a slow, deliberate minute resets the shallow breathing that builds while you're locked to the screen.

---

## Section 4: Seeing your own idle

You can't feel your HRV flattening over a sedentary afternoon — it's below perception, which is why it needs measuring. ONDA holds your [HRV](/glossary/heart-rate-variability) and resting heart rate against your **personal baseline**, so a pattern of low daytime variability, or an evening that never recovers, becomes visible rather than a vague afternoon sluggishness — [your own data](/measurements). Pair the numbers with the habit: if your down-signals cluster on your most sedentary days, that's the chair tax showing up in the ledger.

Firewall: this is descriptive, not medical. ONDA doesn't diagnose anything — it shows how a day's pattern moved your own signals.

---

## Section 5: Building movement back into the day

Anchor movement to triggers you already have: stand every time you take a call, walk during one meeting a day, break every focus block with two minutes on your feet. Add a slow [breath reset](/articles/coherent-breathing-guide) when you catch yourself hunched and shallow. And build the underlying resilience with an aerobic base — consistent [zone-2 training](/articles/zone-2-training-aerobic-base) raises the parasympathetic tone that makes your system more robust to the stillness in the first place. Small, frequent, boring — and it works.

> **The Hack:** Don't try to out-train a sedentary day; interrupt it. A two-minute movement break every half hour restores the input your autonomic system is missing and blunts most of the cost of sitting. Frequency beats intensity — the fix is small and often, not big and later.

> [ SYSTEM_STATUS ]
> PROBLEM: unbroken sitting → lower HRV, sympathetic drift
> KEY: the uninterrupted block is the dose, not sitting itself
> COMPOUND: screen sitting adds shallow breathing on top
> FIX: short frequent movement + breath breaks — DESCRIPTIVE, NOT MEDICAL
`,
  howToSteps: [
    {
      name: 'Break the block, don’t fear the chair',
      text: 'The autonomic cost comes from unbroken stillness, not sitting per se. The uninterrupted block is the dose — so the fix is to interrupt it, not to never sit.',
      protocolId: 'sit-break',
    },
    {
      name: 'Move small and often',
      text: 'A two-minute walk or stand every half hour restores the movement input your system is missing and blunts most of the cost. Frequency beats a single big workout for this specific problem.',
      protocolId: 'sit-frequent',
    },
    {
      name: 'Reset the breath too',
      text: 'Long focused sitting breeds shallow, held breathing on top of the stillness. A slow, deliberate minute of breathing resets it — address movement and breath together.',
      protocolId: 'sit-breath',
    },
    {
      name: 'Build the aerobic base underneath',
      text: 'Consistent zone-2 training raises the parasympathetic tone that makes your system more resilient to sedentary stretches. Anchor movement breaks to triggers you already have — calls, meetings, focus blocks.',
      protocolId: 'sit-base',
    },
  ],
}

export default [article]
