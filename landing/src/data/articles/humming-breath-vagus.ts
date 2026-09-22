import type { Article } from './types'

/**
 * Humming breath / Bhramari (bee breath). AEO reference article. Distinctive mechanism: vibration
 * in the larynx mechanically stimulates vagal fibers (direct route), on top of the long-exhale
 * effect — same reason chanting/singing raise vagal tone. FAQ in ARTICLE_FAQ. Practice, not treatment.
 */
const article: Article = {
  slug: 'humming-breath-vagus',
  title: 'Humming Breath (Bhramari): The Simplest Way to Stimulate Your Vagus Nerve',
  seoTitle: 'Humming Breath (Bhramari): Stimulate the Vagus Nerve | ONDA Life',
  description:
    'Humming breath, or Bhramari, stimulates the vagus nerve through vibration in the larynx. How to do bee breath, why humming raises vagal tone, and when to use it for calm.',
  category: 'ONDA Protocol',
  relatedSlugs: ['vagus-nerve-exercises', 'coherent-breathing-guide', 'physiological-sigh', 'how-to-raise-hrv-naturally', 'cold-exposure-vagus-nerve'],
  introStyle: 'gold',
  neuralSuggestion: {
    text: 'Humming gives the vagus nerve a direct, mechanical nudge. Watch your heart rate settle as you hum.',
    link: '/tools',
    linkText: 'See it live →',
  },
  content: `
Humming breath — Bhramari, or "bee breath" in yoga — is a technique where you exhale while making a steady humming sound. The vibration stimulates the vagus nerve directly through the larynx, and the long, controlled exhale shifts you toward the parasympathetic "rest and digest" state. It's one of the few breathing methods with a physical, mechanical link to the vagus nerve, which is why humming, chanting and singing all raise vagal tone. A few minutes lowers heart rate and eases tension — useful when you want calm plus a simple sensory anchor to keep your mind from wandering.

## How to do humming breath

You can do this anywhere you won't mind making a soft sound:

1. **Sit comfortably** with a straight spine and relax your shoulders.
2. **Inhale slowly** through your nose, filling your lungs comfortably.
3. **Exhale through your nose while humming** — a steady, low "mmmm" sound, like a bee — for the whole length of the exhale.
4. **Keep the exhale long and even**, letting the hum vibrate in your throat, chest and head.

Repeat for five to ten breaths, or a few minutes. Some people gently rest their fingertips on their ears or closed eyes to feel the vibration more, but that's optional. The essentials are a long, humming exhale and an unhurried pace.

## Why humming stimulates the vagus nerve

Most breathing techniques reach the vagus nerve indirectly, through the pace of the breath. Humming adds a second, direct route: the vagus nerve has fibers running through the larynx and the muscles of the throat and soft palate. When you hum, chant or sing, the vibration mechanically stimulates those fibers, raising vagal tone on top of the effect of the long exhale.

Indian clinical research supports this: randomized trials of Bhramari (the traditional name for humming breath) in hypertensive patients found significant reductions in blood pressure and heart rate, and studies in healthy adults found Bhramari improved parasympathetic tone both immediately and after a few weeks of daily practice — meaning the benefit isn't only in the moment, it accumulates.

That's why humming shows up alongside slow breathing and cold-water exposure on nearly every list of evidence-based ways to activate the vagus nerve. You get both effects at once: the extended exhale tips you toward "rest and digest," and the vibration gives the vagus nerve a direct nudge. The result is a measurable calming shift — heart rate down, heart rate variability (HRV) up — often within a few breaths. For the full menu of methods, see [vagus nerve exercises](/articles/vagus-nerve-exercises).

## When to use humming breath

Bhramari suits moments when you want calm and a focal point:

- **Winding down** in the evening, especially if your mind is busy.
- **Before a stressful task**, to settle your nervous system with something to focus on.
- **When silent breathing feels boring** — the sound and vibration keep you engaged.
- **As a short daily vagal-tone practice**, alongside slow breathing.

For a sudden panic spike where you can't make noise, a silent [physiological sigh](/articles/physiological-sigh) is more practical. Humming is best where you have a minute and a little privacy.

## Humming vs other vagus-nerve techniques

| Technique | How it hits the vagus | Best for |
|---|---|---|
| **Humming (Bhramari)** | Vibration in larynx + long exhale | Calm with a sensory anchor |
| **Slow / coherent breathing** | Long exhales, ~5–6 breaths/min | Sustained calm, raising HRV |
| **Cold water on the face** | Dive reflex | A fast, sharp vagal reset |

Humming is unique in giving you a *mechanical* route to the vagus nerve, not just a paced one — which is why it feels distinctly soothing to many people.

## See it work

Because humming produces a genuine autonomic shift, you can watch it. ONDA reads your pulse from your phone camera or Apple Watch and shows your heart rate settle as you hum through long exhales. Seeing your own HRV climb confirms the vibration and the slow exhale are doing their job — and helps you find the exhale length and pitch that calm *you* most.
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
