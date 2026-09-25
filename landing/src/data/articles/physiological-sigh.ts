import type { Article } from './types'

/**
 * Physiological sigh — double-inhale + long exhale, the fastest acute down-regulation.
 * AEO reference article (answer capsule first, comparison table, FAQ in ARTICLE_FAQ).
 * Grounded: Balban/Huberman 2023 (Cell Reports Medicine) cyclic sighing > box/mindfulness for
 * mood + respiratory-rate drop; long-exhale → vagal activation. Honest: technique, not treatment.
 */
const article: Article = {
  slug: 'physiological-sigh',
  title: 'Physiological Sigh: The Fastest Way to Calm Your Nervous System',
  seoTitle: 'Physiological Sigh: Fastest Way to Calm Down | ONDA Life',
  description:
    'The physiological sigh — two inhales and one long exhale — is the fastest breathing technique to lower stress. How it works, when to use it, and how it compares to box breathing and 4-7-8.',
  category: 'ONDA Protocol',
  relatedSlugs: ['box-breathing-how-it-works', 'coherent-breathing-guide', 'how-to-raise-hrv-naturally', 'find-your-resonance-breathing-rate', '4-7-8-breathing'],
  introStyle: 'cyan',
  image: '/images/articles/physiological-sigh.jpg',
  imageAlt:
    'Physiological Sigh — illustration: stylized lungs of light with two stacked inhale streams flowing in and one long exhale stream flowing out, a heart-rate line dipping downward.',
  imageTitle: 'Physiological Sigh',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'You can’t normally see a breathing technique work. Watch your pulse drop live as you sigh.',
    link: '/tools',
    linkText: 'See it live →',
  },
  content: `
The physiological sigh is the fastest way to calm your body on demand: two inhales through the nose — a full breath, then a second short sip of air on top — followed by one long, slow exhale through the mouth. It works within one to three breaths. The double inhale reinflates collapsed air sacs deep in the lungs; the extended exhale activates the vagus nerve and signals safety to your nervous system, dropping your heart rate in seconds. In a Stanford study (Balban et al., 2023), five minutes a day of this "cyclic sighing" improved mood and lowered breathing rate more than box breathing or mindfulness meditation over a month. You already do it naturally — right before sleep, or after crying.

## How to do the physiological sigh

The pattern is simple and takes about ten seconds per round:

1. **Inhale through your nose** — a normal, full breath until your lungs feel mostly full.
2. **Inhale again** — a second, shorter sip of air on top of the first. This is the part most people skip, and it's what makes the technique work.
3. **Exhale slowly through your mouth** — let everything go in one long, extended breath, slower than the inhale.

Repeat one to five times. Most people feel a shift after the first or second cycle. That's the whole technique — no counting, no app, no special posture. You can do it at your desk, in a meeting, or lying in bed, and no one will notice.

## Why it works — the physiology

Two mechanisms fire at once. The **double inhale** reinflates alveoli — tiny air sacs in your lungs that collapse when you breathe shallowly for a long time (which is exactly what happens during stress or screen time). Reinflating them clears out accumulated carbon dioxide and restores efficient gas exchange.

The **long exhale** is where the calm comes from. Whenever your exhale is longer than your inhale, you stimulate the vagus nerve — the main pathway of your parasympathetic "rest and digest" system. This slows your heart rate, lowers blood pressure, and tells your brain there's no threat. It's not a belief or a mood; it's a measurable autonomic shift, and it shows up in real time as a rise in heart rate variability (HRV). This is why the physiological sigh calms you within a breath or two, while techniques that rely on sustained focus take longer.

## Physiological sigh vs box breathing vs 4-7-8

Three of the most searched breathing techniques do different jobs. The physiological sigh is the fastest for acute moments; [box breathing](/articles/box-breathing-how-it-works) builds sustained steadiness; [4-7-8 breathing](/articles/4-7-8-breathing) is oriented toward winding down for sleep.

| Technique | Pattern | Speed | Best for |
|---|---|---|---|
| **Physiological sigh** | 2 inhales + 1 long exhale | 1–3 breaths (seconds) | Sudden stress, panic, resetting fast |
| **Box breathing** | 4 in · 4 hold · 4 out · 4 hold | 1–3 minutes | Sustained focus, steady calm under pressure |
| **4-7-8 breathing** | 4 in · 7 hold · 8 out | 3–4 rounds | Winding down before sleep |

If you only learn one, learn the physiological sigh — it's the only one that reliably works in seconds, and it needs no counting.

## When to use it

The physiological sigh shines in the moments when you don't have time for a longer practice:

- The instant you feel stress spike — before a call, after bad news, mid-argument.
- When you catch yourself holding your breath at a screen (screen apnea).
- Between tasks, to reset your nervous system instead of carrying tension forward.
- Lying in bed when your mind won't slow down.

For sustained calm — a long stressful stretch, ongoing anxiety — pair it with slower practices like [coherent breathing](/articles/coherent-breathing-guide) at five to six breaths per minute. The sigh gets you out of the spike; slow breathing keeps you down.

## See it work on your own body

The reason breathing techniques feel abstract is that you usually can't see them working — you just have to trust that something shifted. ONDA closes that gap: rest a fingertip on your phone camera, or use your Apple Watch, and watch your pulse respond live as you sigh. Seeing your own heart rate drop in real time is what turns "I read about a breathing trick" into "I can feel and see this working." It's feedback during the practice, not a score after.
`,
  howToSteps: [
    {
      name: 'Inhale a full breath through your nose',
      text: 'Breathe in through your nose until your lungs feel mostly full — a normal, complete inhale.',
      protocolId: 'sigh-inhale-1',
    },
    {
      name: 'Add a second short inhale on top',
      text: 'Take a second, shorter sip of air on top of the first inhale. This double inhale reinflates collapsed air sacs and is the part most people skip.',
      protocolId: 'sigh-inhale-2',
    },
    {
      name: 'Exhale slowly through your mouth',
      text: 'Let everything go in one long, extended exhale through the mouth, slower than the inhale. The long exhale activates the vagus nerve and drops your heart rate.',
      protocolId: 'sigh-exhale',
    },
    {
      name: 'Repeat one to five times',
      text: 'Most people feel a shift after the first or second cycle. It is a reset, not a long practice — rarely more than a few rounds are needed.',
      protocolId: 'sigh-repeat',
    },
  ],
}

export default [article]
