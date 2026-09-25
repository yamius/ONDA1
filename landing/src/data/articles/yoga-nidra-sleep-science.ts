import type { Article } from './types'

/**
 * Yoga Nidra ("yogic sleep"): guided lying-down relaxation held at the hypnagogic threshold. Evidence
 * framed modestly: theta/alpha shifts in yogic relaxation practices, vagal-tone / arousal effects of the
 * slow breathing, PSQI improvements in broader yoga programs (esp. older adults). Insomnia = arousal
 * problem. ONDA: resting HR + HRV trend via Apple Watch (no overnight sleep-staging claim).
 */
const article: Article = {
  slug: 'yoga-nidra-sleep-science',
  title: "Yoga Nidra for Sleep: The Science of 'Yogic Sleep'",
  seoTitle: 'Yoga Nidra for Sleep: What the Science Shows | ONDA Life',
  description:
    "Yoga Nidra — 'yogic sleep' — may improve sleep by shifting the brain toward slower waves and calming the nervous system. What research on this Indian practice shows, and how to do it.",
  category: 'ONDA Protocol',
  relatedSlugs: ['wind-down-before-sleep-breathing', 'how-much-sleep-do-you-need', 'social-jet-lag-irregular-sleep', 'coherent-breathing-guide'],
  introStyle: 'gold',
  image: '/images/articles/yoga-nidra-sleep-science.jpg',
  imageAlt:
    'Yoga Nidra for Sleep — illustration: a person lying on their back in deep relaxation, soft slow waves floating above, the sky half dusk half night.',
  imageTitle: 'Yoga Nidra for Sleep',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: "Don't try to sleep — follow the voice. Falling arousal is what lets sleep arrive.",
    link: '/articles/wind-down-before-sleep-breathing',
    linkText: 'Wind-down breathing →',
  },
  content: `
Yoga Nidra — literally "yogic sleep" — is a guided practice of deep relaxation done lying down, and research suggests it can improve sleep quality by shifting the brain toward slower, sleep-like brainwaves while calming the autonomic nervous system. Unlike ordinary seated meditation, Yoga Nidra deliberately walks you to the edge of sleep and holds you there, in a state between waking and sleeping. Studies of this Indian practice and related techniques like OM chanting and slow pranayama link them to stronger vagal (parasympathetic) tone, lower arousal, and better scores on standard sleep measures. For people who lie awake with a racing mind, it's a structured, low-risk way to let the nervous system down.

## What Yoga Nidra is

Yoga Nidra is not sleep and not quite meditation — it's a systematic guided relaxation, usually 20 to 45 minutes, done lying on your back while a voice leads you through stages: settling the body, following the breath, a body scan rotating awareness through each part, and gentle imagery. You stay just barely awake, aware but deeply relaxed. The goal is the hypnagogic state — the drowsy threshold between waking and sleep — sustained on purpose rather than passed through in seconds.

That threshold is exactly where the nervous system downshifts, which is why the practice acts so directly on sleep and stress.

## What the research shows

Research on Yoga Nidra and related yogic practices points to two converging effects — one in the brain, one in the autonomic nervous system.

**Brainwaves shift toward sleep.** Neurophysiological studies of practices including Yoga Nidra, OM chanting, and slow pranayama find more slow-wave activity — theta and alpha — associated with relaxed, drifting states, mirroring the transition your brain makes as you fall asleep naturally.

**The nervous system calms.** The slow breathing woven into Yoga Nidra — like related techniques such as Nadi Shodhana, Ujjayi, and Bhramari — is linked to stronger vagal tone and reduced sympathetic arousal. Broader clinical work on comprehensive yoga programs (postures, breathing, relaxation, meditation) shows lower anxiety and depressive symptoms and better standardized sleep-quality scores (Pittsburgh Sleep Quality Index), especially in older adults.

Much of this research is small, and Yoga Nidra is often studied as part of a larger yoga program rather than alone — so treat it as promising, not proven. Together, though, the findings suggest it helps not by forcing sleep, but by guiding brain and body into the state from which sleep naturally follows.

## Why it works for a racing mind

Insomnia is often a problem of arousal, not tiredness — the body is exhausted but the nervous system won't switch off, and the mind loops. Yoga Nidra targets arousal directly. The body scan pulls attention out of anxious thought and into neutral physical sensation; the slow breathing engages the vagus nerve; the guided structure gives the busy mind a track to follow instead of its worries. It's the opposite of "trying" to sleep — which, as anyone with insomnia knows, only makes it worse.

## How to practice Yoga Nidra for sleep

- **Lie on your back**, comfortable and warm, in a dark quiet space — in bed is fine if sleep is the goal.
- **Use a guided recording.** Yoga Nidra is almost always led by a voice; a 20–40 minute audio is the easiest way in.
- **Don't try to stay awake or to sleep.** Just follow the guidance. If you drift off, that's fine when the aim is sleep.
- **Follow the body scan and breath** rather than your thoughts. When the mind wanders, return to the voice.
- **Practice regularly.** Like any nervous-system skill, it deepens with repetition.

Use it as a daytime reset or as an on-ramp to sleep — ideally alongside a consistent schedule (irregular timing undermines sleep on its own; see [social jet lag](/articles/social-jet-lag-irregular-sleep)) and enough total sleep ([how much you really need](/articles/how-much-sleep-do-you-need)). For a shorter option, try [breathing to wind down before bed](/articles/wind-down-before-sleep-breathing).

## See your body settle

The calming behind Yoga Nidra shows up in your heart rhythm. ONDA reads your resting heart rate and HRV from your Apple Watch, so you can see how a session settles your pulse and track whether your baseline improves as the practice becomes a habit.

*ONDA is a breathing and HRV biofeedback app, not a medical device. This article draws on neurophysiological research on Yoga Nidra, OM chanting and pranayama, and on sleep-quality outcomes of yoga programs. Persistent insomnia deserves a conversation with a clinician.*
`,
}

export default [article]
