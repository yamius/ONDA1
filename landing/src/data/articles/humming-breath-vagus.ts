import type { Article } from './types'

/**
 * Humming breath / Bhramari (bee breath). AEO reference article. Mechanism shown so far: slower
 * breathing with a long exhale. Laryngeal vibration reaching vagal fibers is only a PROPOSED route
 * (not shown beyond slow breathing; Ghati 2021 RCT: no BP advantage vs slow breathing). Aligned with
 * /science/evidence/humming-and-chanting. FAQ in ARTICLE_FAQ. Practice, not treatment.
 */
const article: Article = {
  slug: 'humming-breath-vagus',
  title: 'Humming Breath (Bhramari) and the Vagus Nerve: What the Evidence Shows',
  seoTitle: 'Humming Breath (Bhramari) and the Vagus Nerve | ONDA Life',
  description:
    'Humming breath, or Bhramari, pairs a long exhale with vibration in the larynx. How to do bee breath, how it relates to the vagus nerve and HRV, and when to use it for calm.',
  category: 'ONDA Protocol',
  relatedSlugs: ['vagus-nerve-exercises', 'coherent-breathing-guide', 'physiological-sigh', 'how-to-raise-hrv-naturally', 'cold-exposure-vagus-nerve'],
  introStyle: 'gold',
  image: '/images/articles/humming-breath-vagus.jpg',
  imageAlt:
    'Humming Breath and the Vagus Nerve — illustration: concentric vibration rings radiating from the throat of a silhouette, a glowing nerve path running down from the throat to the heart.',
  imageTitle: 'Humming Breath and the Vagus Nerve',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Humming slows your breathing and lengthens the exhale. Watch your heart rate settle as you hum.',
    link: '/tools',
    linkText: 'See it live →',
  },
  content: `
Humming breath — Bhramari, or "bee breath" in yoga — is a technique where you exhale while making a steady humming sound. Researchers propose the vibration reaches the [vagus nerve](/science/concepts/vagus-nerve) through the larynx, and the long, controlled exhale shifts you toward the parasympathetic "rest and digest" state. It's one of the few breathing methods with a proposed physical, mechanical link to the vagus nerve, which is why humming, chanting and singing are often grouped together. A few minutes lowers heart rate and eases tension — useful when you want calm plus a simple sensory anchor to keep your mind from wandering.

## How to do humming breath

You can do this anywhere you won't mind making a soft sound:

1. **Sit comfortably** with a straight spine and relax your shoulders.
2. **Inhale slowly** through your nose, filling your lungs comfortably.
3. **Exhale through your nose while humming** — a steady, low "mmmm" sound, like a bee — for the whole length of the exhale.
4. **Keep the exhale long and even**, letting the hum vibrate in your throat, chest and head.

Repeat for five to ten breaths, or a few minutes. Some people gently rest their fingertips on their ears or closed eyes to feel the vibration more, but that's optional. The essentials are a long, humming exhale and an unhurried pace.

## How is humming linked to the vagus nerve?

The anatomy is real: the vagus nerve supplies the larynx and the muscles of the throat and soft palate. Some researchers propose that when you hum, chant or sing, the vibration stimulates those fibers mechanically, on top of the long exhale. That is a hypothesis: no study has shown that the hum itself stimulates the vagus nerve beyond what slow breathing does. What humming clearly does is slow your breathing and lengthen the exhale. {{fact:claim.slowExhale}}.

The clinical evidence on Bhramari (the traditional name for humming breath) is thin. A systematic review found only a few early studies, none of them randomized, and rated their quality as very low. The one randomized trial we found, in people with high blood pressure, compared a single short session of Bhramari with slow breathing: humming did not lower blood pressure more than slow breathing did. A rise in vagally mediated [HRV](/science/concepts/heart-rate-variability) during humming is expected from the slower breathing alone; an added effect of the sound or vibration has not been shown. The full review is in [humming, chanting and Om: what the evidence shows](/science/evidence/humming-and-chanting).

That's why humming shows up alongside [slow breathing](/science/evidence/slow-breathing) and cold-water exposure on nearly every list of vagus-nerve exercises. The extended exhale slows your breathing, and the hum gives you a sound and a vibration to focus on; whether the vibration adds anything for the vagus nerve is unproven. The usual result is a calming shift during the practice — heart rate down, heart rate variability (HRV) up. For the full menu of methods, see [vagus nerve exercises](/articles/vagus-nerve-exercises). Chanting OM uses the same hum-plus-long-exhale pattern, and a small brain-imaging study has looked at it — see [OM chanting and the brain](/articles/om-chanting-brain-vagus).

## When should you use humming breath?

Bhramari suits moments when you want calm and a focal point:

- **Winding down** in the evening, especially if your mind is busy.
- **Before a stressful task**, to settle your nervous system with something to focus on.
- **When silent breathing feels boring** — the sound and vibration keep you engaged.
- **As a short daily calming practice**, alongside slow breathing.

For a sudden panic spike where you can't make noise, a silent [physiological sigh](/articles/physiological-sigh) is more practical. Humming is best where you have a minute and a little privacy.

## Humming vs other vagus-nerve techniques

| Technique | How it works | Best for |
|---|---|---|
| **Humming (Bhramari)** | Slow breathing with a long exhale; a vibration route to the vagus is proposed | Calm with a sensory anchor |
| **Slow / coherent breathing** | Long exhales, ~5–6 breaths/min | Sustained calm, raising HRV |
| **Cold water on the face** | Dive reflex | A fast circuit-breaker when you're spiked |

What sets humming apart is the sound and the vibration you can feel, which many people find soothing and easy to focus on. A separate *mechanical* route to the vagus nerve has been proposed but not shown.

## See it work

Because humming slows your breathing, you can watch how your body responds. ONDA reads your pulse from your phone camera or Apple Watch and shows your heart rate as you hum through long exhales; with an Apple Watch you also see your HRV. Your own numbers show how you respond to the slower breathing — and help you find the exhale length and pitch that calm *you* most.
`,
  howToSteps: [
    {
      name: 'Sit comfortably and relax your shoulders',
      text: 'Sit with a straight spine and let your shoulders drop.',
      protocolId: 'hum-sit',
    },
    {
      name: 'Inhale slowly through the nose',
      text: 'Breathe in slowly through your nose, filling your lungs comfortably.',
      protocolId: 'hum-inhale',
    },
    {
      name: 'Exhale with a steady hum',
      text: 'Exhale through your nose while making a steady, low "mmmm" sound like a bee, for the whole length of the exhale. Keep the exhale long and even so the hum vibrates in your throat and head.',
      protocolId: 'hum-exhale',
    },
    {
      name: 'Repeat for five to ten breaths',
      text: 'Continue for five to ten humming breaths, or a few minutes, at an unhurried pace.',
      protocolId: 'hum-repeat',
    },
  ],
}

export default [article]
