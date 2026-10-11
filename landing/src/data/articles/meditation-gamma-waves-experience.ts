import type { Article } from './types'

/**
 * Gamma brainwaves as a progress-linked signature of meditation experience. Grounded: cross-tradition
 * EEG (Braboszcz et al. — Vipassana/Himalayan Yoga/Isha Shoonya) → higher parieto-occipital gamma
 * (60-110 Hz), correlated with practice experience, artifact-controlled; ML classifiers distinguish
 * meditative states ~91% across 4 traditions, better in advanced practitioners. Wedge: gamma isn't
 * home-measurable → HRV is the accessible at-home proxy. AEO + FAQ. camera=pulse, watch=HRV.
 */
const article: Article = {
  slug: 'meditation-gamma-waves-experience',
  title: 'Gamma Brainwaves: The Measurable Signature of Meditation Experience',
  seoTitle: 'Gamma Brainwaves & Meditation Experience | ONDA Life',
  description:
    'Experienced meditators show higher gamma brainwaves, and in one study gamma was higher in people with more practice. What this cross-sectional research does and does not show about meditation as a trainable skill.',
  category: 'Biological Software',
  relatedSlugs: ['meditation-with-measurable-progress', 'meditation-brain-changes-how-fast', 'measuring-meditation-progress', 'how-much-meditation-do-you-need', 'how-to-raise-hrv-naturally', 'rajyoga-open-eye-meditation'],
  introStyle: 'indigo',
  image: '/images/articles/meditation-gamma-waves-experience.jpg',
  imageAlt:
    'Gamma Brainwaves and Meditation Experience — illustration: a brain radiating fast, fine high-frequency light waves, with bright layers accumulating around it like tree rings of experience.',
  imageTitle: 'Gamma Brainwaves and Meditation Experience',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Experienced meditators show more gamma — a difference between groups, not proof that it grows in you. You can’t feel it, but you can watch how your pulse and breathing respond to practice.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
Experienced meditators have a distinctive brain signature — elevated gamma brainwaves — and in one study the amount of gamma was higher in people with more practice. Comparing practitioners of three meditation traditions (Vipassana, Himalayan Yoga, and Isha Shoonya) with non-meditators, researchers found that all the meditators showed higher parieto-occipital gamma amplitude (60–110 Hz) than controls, and gamma power was positively correlated with each person's meditation experience. This compares different people at one point in time, so it cannot show that practice caused the difference: people who keep meditating for years may differ from the start. Still, it fits the idea that meditation is a [trainable skill](/articles/meditation-brain-changes-how-fast), not just a subjective state you either "get" or don't.

*This article is part of our complete guide to [Meditation With Measurable Progress](/articles/meditation-with-measurable-progress).*

## What are gamma brain waves?

Gamma waves are the brain's fastest electrical rhythms, above roughly 30 Hz — at the opposite end from the slow delta waves of deep sleep. Gamma activity is associated with heightened awareness, focused attention, and the binding together of information across the brain into unified conscious experience. It's the signature of a brain that is intensely, coherently engaged.

What makes gamma interesting for meditation is that it appears both *during* practice and, in experienced practitioners, as a lasting *trait* — a change in how the brain works even at rest. That distinction matters: a state effect fades when you stop; a trait effect means the practice has changed you.

## Does meditation experience increase gamma waves?

Possibly, but the evidence cannot show it yet. In that study gamma amplitude was **positively correlated with meditation experience**: people with more practice tended to have more gamma. That is a correlation across different people, not a measurement of gamma rising in the same person over time. Long-term meditators may differ from the start in health, temperament or habits, so the finding is suggestive rather than proof that practice builds gamma.

The pattern held across three different traditions, which suggests a shared feature of long-term practice rather than a quirk of one technique. The researchers also checked for eye- and muscle-movement artefacts, a known problem for scalp gamma recordings, and concluded that the signal was brain activity. Even so, gamma recordings are easily contaminated, and the finding comes from a single cross-sectional study.

## Do different meditation traditions change the brain in the same way?

They appear to share some features: beyond gamma, high-density EEG research across four Indian-rooted traditions — Vipassana, Brahma Kumaris Raja Yoga, Heartfulness, and Isha Yoga — found that machine-learning classifiers could tell meditative from non-meditative brain states with high accuracy. Classification worked *better* in advanced meditators than in beginners, which is consistent with a more distinct brain state in experienced practitioners, though again these are different groups of people.

Taken together, these studies suggest that deep meditation produces a recognizable brain state across traditions, and that it is more distinct in experienced practitioners. They do not show whether, or how quickly, that state develops in someone who starts practising. (One of those traditions, [open-eyed Rajyoga](/articles/rajyoga-open-eye-meditation), has its own distinct EEG signature.)

## Why measurable progress changes everything

Here's why this matters beyond the lab. A common reason people abandon meditation is the feeling that nothing is changing. The gamma research shows that experienced practitioners differ in measurable ways, but you can't feel your gamma waves, and these studies can't tell you whether your own practice is changing them.

This is the case for [meditation with measurable feedback](/articles/measuring-meditation-progress). You won't hook yourself up to an EEG daily, but you can watch accessible signals such as your pulse, breathing and [heart rate variability](/science/concepts/heart-rate-variability) (HRV). HRV often rises during slow, calm practice, while lasting changes in resting HRV after a meditation course have not been shown consistently ([meditation and the autonomic nervous system](/science/evidence/meditation-autonomic-nervous-system)). Treat these numbers as feedback on how your body responds to a session, not as a readout of brain change.

## Track the progress you can measure

You can't record your gamma waves at home, but you can see how your body responds to practice. ONDA reads your [resting heart rate](/science/measurements/resting-heart-rate) and HRV from Apple Health (Apple Watch or another tracker that syncs there), or your pulse from your phone camera and shows how they respond during sessions and trend over weeks. A lasting rise in resting HRV from meditation is not guaranteed, and other habits that [can raise HRV](/articles/how-to-raise-hrv-naturally) matter too, so read the trend as feedback, not as proof of brain change.
`,
}

export default [article]
