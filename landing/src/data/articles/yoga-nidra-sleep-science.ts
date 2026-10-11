import type { Article } from './types'

/**
 * Yoga Nidra ("yogic sleep"): guided lying-down relaxation held at the hypnagogic threshold. Evidence
 * framed modestly: EEG = awake state with some local slow waves (not sleep); vagally mediated HRV / arousal
 * effects of slow breathing; sleep meta-analysis (Singh 2026) = five studies, very low certainty.
 * Insomnia often involves arousal; CBT-I is first-line. ONDA: resting HR + HRV trend via Apple Health (Apple Watch or another tracker) (no overnight sleep-staging claim).
 */
const article: Article = {
  slug: 'yoga-nidra-sleep-science',
  title: "Yoga Nidra for Sleep: The Science of 'Yogic Sleep'",
  seoTitle: 'Yoga Nidra for Sleep: What the Science Shows | ONDA Life',
  description:
    "Yoga Nidra — 'yogic sleep' — is guided deep relaxation used for sleep. What research on this Indian practice shows (small studies, very low certainty), and how to do it.",
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
Yoga Nidra — literally "yogic sleep" — is a guided practice of deep relaxation done lying down, and small studies suggest it may help sleep quality, though the most recent meta-analysis found only five studies, no significant pooled effect in the randomised trials and very low certainty. In EEG recordings practitioners stay awake, with some local slow-wave activity, so it is deep rest rather than sleep. Unlike ordinary seated meditation, Yoga Nidra deliberately walks you towards the edge of sleep. Related relaxation and slow-breathing practices are linked to higher [HRV](/science/concepts/heart-rate-variability) and a calmer [autonomic nervous system](/science/concepts/autonomic-nervous-system). For people who lie awake with a racing mind, it is a gentle, structured practice to try — see [what the evidence on yoga nidra and NSDR shows](/science/evidence/yoga-nidra-nsdr).

## What is Yoga Nidra?

Yoga Nidra is not sleep and not quite meditation — it's a systematic guided relaxation, usually 20 to 45 minutes, done lying on your back while a voice leads you through stages: settling the body, following the breath, a body scan rotating awareness through each part, and gentle imagery. You stay just barely awake, aware but deeply relaxed. The goal is the hypnagogic state — the drowsy threshold between waking and sleep — sustained on purpose rather than passed through in seconds.

The practice is built around that quiet, low-arousal threshold, which is why it is used for sleep and stress — although the direct evidence for both is still modest.

## What does research show about Yoga Nidra?

Research on Yoga Nidra and related yogic practices looks at two things — the brain and the autonomic nervous system — and the findings are modest.

**The brain stays awake.** EEG studies of Yoga Nidra show an awake state with some local slow-wave activity and no sleep hallmarks such as sleep spindles: relaxed and drifting, but not asleep.

**The nervous system may calm.** During a session heart rate tends to fall and some HRV measures change, as in other relaxing activities; direct data on Yoga Nidra itself come from small studies. [Slow breathing](/science/evidence/slow-breathing) in general — including techniques such as Nadi Shodhana, Ujjayi and Bhramari, which are separate pranayama practices rather than part of Yoga Nidra — is associated with higher vagally mediated HRV. Studies of comprehensive yoga programs (postures, breathing, relaxation, meditation) report lower anxiety and better sleep-quality scores, but those programs are not Yoga Nidra alone.

For sleep specifically, a 2026 meta-analysis found only five studies; pooled effects in the randomised trials were not significant, and the certainty of evidence was very low. So treat Yoga Nidra as a reasonable thing to try, not a proven sleep treatment. It may help not by forcing sleep, but by lowering arousal so that sleep has a chance to follow.

## Why it works for a racing mind

Insomnia is often a problem of arousal, not tiredness — the body is exhausted but the nervous system won't switch off, and the mind loops. Yoga Nidra aims at that arousal, although trials have not shown that it reliably lowers it. The body scan pulls attention out of anxious thought and into neutral physical sensation; slow breathing is associated with higher vagally mediated HRV; the guided structure gives the busy mind a track to follow instead of its worries. It's the opposite of "trying" to sleep — which, as anyone with insomnia knows, only makes it worse.

## How to practice Yoga Nidra for sleep

- **Lie on your back**, comfortable and warm, in a dark quiet space — in bed is fine if sleep is the goal.
- **Use a guided recording.** Yoga Nidra is almost always led by a voice; a 20–40 minute audio is the easiest way in.
- **Don't try to stay awake or to sleep.** Just follow the guidance. If you drift off, that's fine when the aim is sleep.
- **Follow the body scan and breath** rather than your thoughts. When the mind wanders, return to the voice.
- **Practice regularly.** Like any nervous-system skill, it deepens with repetition.

Use it as a daytime reset or as an on-ramp to sleep — ideally alongside a consistent schedule (irregular timing undermines sleep on its own; see [social jet lag](/articles/social-jet-lag-irregular-sleep)) and enough total sleep ([how much you really need](/articles/how-much-sleep-do-you-need)). For a shorter option, try [breathing to wind down before bed](/articles/wind-down-before-sleep-breathing).

## See your body settle

The calming behind Yoga Nidra shows up in your heart rhythm. ONDA shows your live pulse through the phone camera or an Apple Watch and reads resting heart rate and HRV from Apple Health (Apple Watch or another tracker that syncs there), so you can see how a session settles your pulse and track whether [your baseline](/science/concepts/hrv-baseline) improves as the practice becomes a habit.

*ONDA is a breathing and HRV biofeedback app, not a medical device. This article draws on neurophysiological research on Yoga Nidra, OM chanting and pranayama, and on sleep-quality outcomes of yoga programs. Persistent insomnia deserves a conversation with a clinician; cognitive behavioural therapy for insomnia (CBT-I) is the recommended first-line approach.*
`,
}

export default [article]
