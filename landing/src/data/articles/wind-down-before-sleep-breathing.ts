import type { Article } from './types'

/**
 * Cluster 7 gap — "how to relax before sleep", "lower evening physiological arousal", "body still
 * on at night" (Q76, Q77, Q78). Honest: self-regulation, not insomnia treatment; breathing wind-down;
 * ONDA feedback. Cross-links chronic-stress + coherent breathing + sleep articles.
 */
const article: Article = {
  slug: 'wind-down-before-sleep-breathing',
  title: 'The Evening Wind-Down: Breathing Your Body Out of Work Mode',
  seoTitle: 'How to Relax Before Sleep (Breathing Wind-Down) | ONDA Life',
  description:
    'You’re in bed, but your body is still at work — heart up, mind looping. Why evening arousal wrecks sleep onset, and a simple breathing wind-down that signals your system it’s safe to power down.',
  category: 'OS States',
  relatedSlugs: ['chronic-stress-nervous-system-never-off', 'coherent-breathing-guide', 'cognitive-shuffling', 'how-much-sleep-do-you-need', 'calm-your-nervous-system-down'],
  introStyle: 'indigo',
  image: '/images/articles/wind-down-before-sleep-breathing.webp',
  imageAlt:
    "An evening figure with an arousal curve descending toward sleep as slow exhale-led breathing engages the vagal system, a soft crescent moon.",
  imageTitle: "The evening wind-down — breathing your body out of work mode",
  imageCaption:
    "An evening breathing wind-down that lowers pre-sleep arousal — engaging the vagal system so your body believes the day is over and sleep onset comes.",
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Sleep doesn’t start at lights-out — it starts when your body believes the day is actually over.',
    link: '/hrv-biofeedback',
    linkText: 'HRV biofeedback →',
  },
  content: `
## [ CASE FILE: STILL ON THE CLOCK ]

> "You did everything right. Lights low, phone down, in bed on time. And you're lying there wide awake, heart a little too quick, mind replaying the day — your body still clocked in hours after your calendar clocked out.

> Falling asleep isn't a switch you flip; it's a *descent* your body has to be willing to make. If your [sympathetic](/glossary/sympathetic-nervous-system) 'go' system is still running the evening, that descent won't start — no matter how tired you are. The wind-down is how you tell the system it's safe to power down."

---

## Section 1: Why your body won't clock out

Sleep onset requires a handover — from the day's activated, alert state to the [parasympathetic](/glossary/parasympathetic-nervous-system) 'settle' state that lets you drift off. Your heart rate needs to fall, your arousal needs to drop, your nervous system needs to believe the threats of the day are done.

Modern evenings fight that handover. Work bleeds late, screens keep the system stimulated, and stress that never switched off holds you in mild activation into the night — the [nervous system that never clocks out](/articles/chronic-stress-nervous-system-never-off). So you arrive at bedtime physiologically still on the clock, and then lie there frustrated that "being tired" isn't enough. It isn't — you have to actively signal the descent.

---

## Section 2: The most reliable off-ramp — slow breathing

The fastest, most direct way to signal "day's over" to your nervous system is a slow, exhale-led breath. A long out-breath stimulates the vagus nerve, hands tone to the parasympathetic branch, and starts your heart rate falling — exactly the shift sleep onset needs. You're not forcing sleep (you can't); you're producing the *state* that lets sleep happen.

This is why a few minutes of [coherent breathing](/articles/coherent-breathing-guide) in bed works better than lying there willing yourself to drop off. Willpower can't lower your arousal. The breath can.

---

## Section 3: Building a wind-down that works

A wind-down is a runway, not a cliff. Give the descent room:

- **Start before bed, not in bed.** Dim the lights and slow down 30–60 minutes out, so you arrive at the pillow already descending.
- **Do a few minutes of slow, exhale-led breathing** as the anchor — in bed is fine. Longer out-breaths, low in the belly, soft not forced.
- **If the mind won't stop looping**, give it a low-stakes task instead of fighting it — [cognitive shuffling](/articles/cognitive-shuffling) (drifting through random unrelated words) crowds out the rumination that keeps you up. For a longer guided version, try [Yoga Nidra](/articles/yoga-nidra-sleep-science).
- **Keep it consistent.** A repeated wind-down becomes a cue: your body learns that this sequence means sleep is coming, and starts the descent on its own.

---

## Section 4: Seeing the descent (and training it)

You can't feel your arousal drop precisely — which is why a low-grade "am I even relaxing?" doubt keeps some people tense. Feedback removes it. An [HRV biofeedback](/hrv-biofeedback) app reads your pulse (iPhone camera or Apple Watch) and shows your heart rhythm settle as you breathe, so you can *see* the descent begin instead of wondering. Done as an evening practice, it also trains the parasympathetic return, so the wind-down works faster over time — see [what it measures](/measurements). Honest note: the live coherence score needs an Apple Watch; the camera still shows live pulse and a breathing estimate.

The firewall, plainly: this is a self-regulation and relaxation practice, **not a treatment for insomnia** or any sleep disorder, and ONDA is not a medical device. If sleeplessness is chronic and disruptive, that's a conversation for a doctor — breathing tools sit alongside real sleep care, not instead of it.

---

## Section 5: Making it a habit

Anchor the wind-down to bedtime the way you'd anchor any habit, and protect the sequence more than any single night's result. Let the aim be the *descent*, not sleep itself — chasing sleep creates the arousal that prevents it, while calmly producing the settle-state lets sleep arrive on its own. And remember the wider picture: no wind-down fixes a nervous system that's wired every evening from chronic load, so protect your [sleep need](/articles/how-much-sleep-do-you-need) and rebuild the off-switch with the same breathing practised by day, too.

> **The Hack:** Stop trying to fall asleep — start the descent instead. A few minutes of slow, longer-exhale breathing in bed signals your nervous system that the day is over and drops your arousal, which is the state sleep actually needs. Do it every night and your body learns the cue, and the handover gets easier.

> [ SYSTEM_STATUS ]
> PROBLEM: body still in "go" at bedtime — tired isn't enough
> OFF_RAMP: slow exhale-led breathing → vagal shift → arousal falls → sleep can start
> RUNWAY: wind down 30–60 min out; keep it consistent so it becomes a cue
> STATUS: relaxation practice, NOT a treatment for insomnia
`,
  howToSteps: [
    {
      name: 'Start the wind-down before bed',
      text: 'Sleep onset needs a descent from activated to calm. Dim the lights and slow down 30–60 minutes before bed so you arrive at the pillow already descending, rather than expecting a switch to flip at lights-out.',
      protocolId: 'wind-early',
    },
    {
      name: 'Anchor it with slow, exhale-led breathing',
      text: 'A few minutes of slow breathing with longer out-breaths, low in the belly, stimulates the vagus nerve and starts your heart rate falling — the exact state sleep needs. You’re producing the descent, not forcing sleep.',
      protocolId: 'wind-breathe',
    },
    {
      name: 'Give a looping mind a low-stakes task',
      text: 'If rumination keeps you up, don’t fight it — occupy it. Cognitive shuffling (drifting through random unrelated words) crowds out the looping thoughts that block the descent.',
      protocolId: 'wind-shuffle',
    },
    {
      name: 'Keep it consistent — and know the limit',
      text: 'A repeated wind-down becomes a cue your body learns, so protect the sequence over any single night. It’s a relaxation practice, not a treatment for insomnia — chronic, disruptive sleeplessness belongs with a doctor.',
      protocolId: 'wind-consistent',
    },
  ],
}

export default [article]
