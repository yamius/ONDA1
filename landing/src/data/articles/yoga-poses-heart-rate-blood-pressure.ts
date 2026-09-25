import type { Article } from './types'

/**
 * Yoga poses ≠ uniformly calming: relaxation/forward folds lower HR/BP; backbends, standing poses and
 * sun salutations activate; inversions need caution in hypertension. Indian comparative asana studies
 * in healthy volunteers; single-session acute BP dip that fades within about an hour (draft's exact
 * "8 mmHg" figure dropped — unverified). Regular practice → HRV/baroreflex. camera=pulse, watch=HRV.
 */
const article: Article = {
  slug: 'yoga-poses-heart-rate-blood-pressure',
  title: 'How Different Yoga Poses Affect Your Heart Rate and Blood Pressure',
  seoTitle: 'Yoga Poses, Heart Rate & Blood Pressure | ONDA Life',
  description:
    'Not all yoga poses affect your heart the same way — inversions, backbends and relaxation poses each shift heart rate and blood pressure differently. What research measured, and how to use poses deliberately.',
  category: 'ONDA Protocol',
  relatedSlugs: ['high-blood-pressure-slow-breathing', 'yoga-breathing-diabetes-blood-sugar', 'resting-heart-rate-by-age', 'how-to-raise-hrv-naturally'],
  introStyle: 'gold',
  image: '/images/articles/yoga-poses-heart-rate-blood-pressure.jpg',
  imageAlt:
    'How Yoga Poses Affect Your Heart — illustration: three yoga pose silhouettes — forward fold, standing pose, backbend — each with a heart-rate line of a different intensity above it.',
  imageTitle: 'How Yoga Poses Affect Your Heart',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Calming poses to wind down, activating poses to wake up — and always end in savasana.',
    link: '/articles/high-blood-pressure-slow-breathing',
    linkText: 'Slow breathing & blood pressure →',
  },
  content: `
Not all yoga poses calm you equally — different postures shift your heart rate and blood pressure in different directions, and researchers, many of them in India, have measured the differences. Relaxation and forward-folding poses tend to lower heart rate and blood pressure by shifting you toward "rest and digest," while inversions, backbends, and standing poses can transiently raise them. Knowing which is which lets you use yoga deliberately: calming poses to wind down, and the understanding that a vigorous sequence is activating, not sedating, in the moment. Even a single session can produce a short-lived dip in blood pressure afterward; lasting change comes from regular practice.

## Poses are not all the same

The popular image of yoga as uniformly relaxing is misleading. A pose's effect on your cardiovascular system depends on its physical demand and body position:

- **Forward bends and relaxation poses** (child's pose, seated forward fold, corpse pose) quiet the nervous system, lowering heart rate and blood pressure.
- **Backbends and standing poses** are more activating, raising heart rate and often blood pressure during the pose.
- **Inversions** (head-down positions) shift blood flow and pressure in complex ways, which is why they're approached with caution by people with high blood pressure.

Indian comparative studies measured heart rate and blood pressure across different asanas in healthy volunteers and found distinct cardiovascular responses by body position and effort. The calm of yoga is real — but it comes mostly from the gentle, relaxation-oriented parts of a practice.

## What the research measured

**A single session lowers pressure briefly.** Crossover trials of a single flowing yoga session found systolic pressure lower shortly afterward than after sitting — but back to baseline within about an hour. A session gives a real, immediate dip; lasting change needs regular practice.

**Different poses, different responses.** Comparative studies of asanas in healthy young volunteers found that relaxing poses and pranayama produced the most favorable responses (lower heart rate and pressure), distinct from more effortful postures. Relaxation poses paired with slow breathing gave the clearest calming effect.

**Regular practice shifts the baseline.** Beyond acute effects, structured yoga over weeks is associated with better HRV, baroreflex sensitivity, and resting cardiovascular measures — the adaptation that comes from consistency. Yoga programs have shown similar benefits in people with [type 2 diabetes](/articles/yoga-breathing-diabetes-blood-sugar).

## How to use poses deliberately

**To calm down and lower pressure:**
- Forward folds, gentle seated poses, legs-up-the-wall (a gentle inversion), and corpse pose (savasana).
- Pair them with slow breathing at about six breaths per minute for the strongest parasympathetic shift — the same lever described in [slow breathing for blood pressure](/articles/high-blood-pressure-slow-breathing).
- End any practice with several minutes of savasana — or a longer guided [Yoga Nidra](/articles/yoga-nidra-sleep-science).

**To energize:**
- Sun salutations, standing poses, and backbends raise heart rate and alertness. Use them earlier in the day, not to wind down.

**If you have high blood pressure:**
- Favor gentle, relaxation-oriented practice and slow breathing.
- Approach full inversions and intense holds with caution, and get guidance from a qualified teacher and your doctor. Keep taking any prescribed medication.

## See how each pose shifts you

Because different poses move your heart rate in different directions, you can watch it happen. ONDA reads your pulse from your phone camera or Apple Watch, and your HRV from Apple Watch, so you can see how a relaxation pose settles your heart versus how a vigorous sequence raises it — and track whether your [resting heart rate](/articles/resting-heart-rate-by-age) and HRV improve over weeks of practice.

*ONDA is a breathing and HRV biofeedback app, not a medical device. This article draws on comparative research on yoga asanas and trials of single yoga sessions on blood pressure. It is not a substitute for medical care.*
`,
}

export default [article]
