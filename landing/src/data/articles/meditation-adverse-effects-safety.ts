import type { Article } from './types'

/**
 * Spoke of the meditation-with-measurable-progress cluster — the HONESTY anchor. Meditation's adverse
 * effects: a US survey of 953 regular meditators (>10% with significant negative impact); 40-year
 * review (Farias et al.) — anxiety/depression most common, then psychotic/delusional, dissociation,
 * fear; MYRIAD (Wellcome-funded, 8,000+ UK schoolchildren) — no wellbeing benefit, possible harm in
 * at-risk youth. Risk ↑ with intensity, trauma, no guidance. Safe-practice guidance. Exact MYRIAD
 * budget omitted (unverified). AEO + howToSteps + FAQ. camera=pulse, watch=HRV. Links up to pillar.
 */
const article: Article = {
  slug: 'meditation-adverse-effects-safety',
  title: 'The Side Effects of Meditation No One Talks About',
  seoTitle: 'Meditation Side Effects: The Honest Risks | ONDA Life',
  description:
    'Meditation isn’t purely beneficial — research shows a meaningful minority experience adverse effects like anxiety or dissociation. An honest look at meditation’s dark side, who’s at risk, and how to practice safely.',
  category: 'ONDA Protocol',
  relatedSlugs: ['meditation-with-measurable-progress', 'meditation-vs-breathwork', 'how-much-meditation-do-you-need', 'measuring-meditation-progress', 'how-to-regulate-emotions'],
  introStyle: 'slate',
  image: '/images/articles/meditation-adverse-effects-safety.jpg',
  imageAlt:
    'The Side Effects of Meditation — illustration: a calm dark pond with one ripple revealing slight turbulence beneath the surface, a small lantern glowing at the edge — honest, not frightening.',
  imageTitle: 'The Side Effects of Meditation',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'A practice powerful enough to change your brain is powerful enough to sometimes destabilize. Notice how you actually respond — don’t force through.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
Meditation is not purely beneficial, and honesty about that is overdue. While most people gain from it, research shows a meaningful minority experience genuine adverse effects — in one study of 953 regular meditators in the US, over 10% reported adverse effects that had a significant negative impact on their lives. A review of over 40 years of research found the most common adverse effects are anxiety and depression, followed by psychotic or delusional symptoms, dissociation or depersonalization, and fear or terror. This isn't a reason to avoid meditation — for most people it's helpful and safe — but the "meditation is only ever good for you" message is not what the science says. Knowing the real risks, who's most vulnerable, and how to practice sensibly makes meditation both safer and more honest.

*This article is part of our complete guide to [Meditation With Measurable Progress](/articles/meditation-with-measurable-progress).*

## Why this needs saying

Meditation is marketed almost universally as risk-free — pure wellness, only upside. That framing is not scientifically accurate, and the silence around adverse effects can leave people who struggle feeling confused or alone, assuming they're "doing it wrong." In reality, difficult experiences during or after meditation are documented, sometimes serious, and not vanishingly rare.

The scale of the gap is striking. One of the largest studies in meditation science — a Wellcome Trust–funded trial (MYRIAD) of over 8,000 UK schoolchildren — found that school-based mindfulness *failed* to improve wellbeing compared to usual teaching, and may even have had detrimental effects on those already at risk of mental-health problems. Findings like this rarely make headlines, because they cut against the wellness narrative. An honest guide to meditation has to include them.

## What the adverse effects can be

Drawing on the research, reported adverse effects range from mild to serious:

- **Anxiety and depression** — the most common, sometimes worsening rather than easing.
- **Dissociation and depersonalization** — feeling detached from yourself, your body, or reality.
- **Intrusive or distressing memories** — especially trauma resurfacing (relevant for people with PTSD).
- **Panic attacks** during or after practice.
- **Fear, terror, or unsettling altered states** — in more intense or prolonged practice.
- **Psychotic or delusional symptoms** — rare, but documented at the serious end.

Estimates of how common these are vary widely — some studies find around 1% affected, others report figures far higher depending on how it's measured and the intensity of practice. The honest summary: adverse effects are real, not rare enough to ignore, and more likely with intensive practice (long retreats, many hours) than with short daily sessions.

## Who is most at risk

The risk isn't evenly distributed. More vulnerable are:

- **People with trauma histories** — meditation can surface distressing memories without the support to process them.
- **People with, or at risk of, serious mental illness** — the schoolchildren study specifically found possible harm in at-risk youth.
- **Intensive practitioners** — long silent retreats and very long daily sessions carry more risk than modest daily practice.
- **Those practicing without guidance** — going deep alone, without a teacher or support, increases the chance of getting stuck in a difficult state.

For a typical person doing 10–20 minutes of gentle daily practice, the risk is low. The concerns rise with intensity, vulnerability, and lack of support — one more reason [a modest daily dose](/articles/how-much-meditation-do-you-need) beats heroic sessions.

## How to meditate safely

None of this means don't meditate — it means practice wisely:

- **Start gentle and short.** Modest daily practice carries far less risk than diving into intensive retreats.
- **Go slow with trauma.** If you have a trauma history, consider trauma-sensitive mindfulness and professional guidance rather than intense solo practice.
- **Don't force through distress.** If meditation consistently makes you more anxious, dissociated, or distressed, that's a signal to stop or change approach — not to push harder. Struggling against your inner state tends to make it worse.
- **Choose grounding over dissolving if needed.** For some people, body-based, grounding practices or gentle breathwork are safer than practices that dissolve the sense of self — see [meditation vs breathwork](/articles/meditation-vs-breathwork).
- **Get support for deep practice.** If you pursue intensive meditation, do it with a qualified teacher who understands adverse effects — clinical services for meditation-related difficulties now exist.
- **It's okay to stop.** Meditation isn't mandatory. If it's not helping you, other paths to calm (breathwork, movement, therapy) are valid.

If you experience serious or persistent distress, consult a qualified mental-health professional.

## An honest tool, honestly used

The point of naming meditation's dark side isn't to scare you off — it's respect. A practice powerful enough to change your brain is powerful enough to sometimes destabilize, and treating it as pure, consequence-free wellness does people a disservice. Used sensibly — gently, consistently, with awareness of your own vulnerabilities — meditation is safe and beneficial for most. Used naively, marketed as risk-free, it can leave the vulnerable worse off and blaming themselves.

## Practice with awareness

Part of practicing safely is noticing how you actually respond — not just assuming meditation "should" help. ONDA lets you [track how your body reacts](/articles/measuring-meditation-progress): reading your pulse from your phone camera, or your HRV from your Apple Watch, so you can see whether a practice genuinely calms you or, occasionally, agitates you. If your numbers and your felt experience both say a practice isn't settling you, that's useful, honest feedback — the opposite of forcing through.
`,
  howToSteps: [
    {
      name: 'Start gentle and short',
      text: 'Begin with modest daily sessions (10–20 minutes). Intensive retreats and very long sessions carry far more risk.',
      protocolId: 'medsafe-gentle',
    },
    {
      name: 'Go slow if you have a trauma history',
      text: 'Prefer trauma-sensitive mindfulness and professional guidance over intense solo practice, since meditation can surface distressing memories.',
      protocolId: 'medsafe-trauma',
    },
    {
      name: "Don't force through distress",
      text: 'If a practice consistently leaves you more anxious, dissociated or distressed, stop or change approach — try grounding, body-based practice or gentle breathwork instead of pushing harder.',
      protocolId: 'medsafe-noforce',
    },
    {
      name: 'Get support — and know it is okay to stop',
      text: 'Pursue deep practice only with a qualified teacher who understands adverse effects. Meditation is not mandatory; for serious or persistent distress, consult a mental-health professional.',
      protocolId: 'medsafe-support',
    },
  ],
}

export default [article]
