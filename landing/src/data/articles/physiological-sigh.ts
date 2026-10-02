import type { Article } from './types'

/**
 * Physiological sigh — double-inhale + long exhale, the fastest acute down-regulation.
 * AEO reference article (answer capsule first, comparison table, FAQ in ARTICLE_FAQ).
 * Grounded: Balban/Huberman 2023 (Cell Reports Medicine) cyclic sighing > box/mindfulness for
 * mood + respiratory-rate drop; long-exhale → vagal activation. Honest: technique, not treatment.
 */
const article: Article = {
  slug: 'physiological-sigh',
  title: 'Physiological Sigh: A Quick Way to Calm Your Nervous System',
  seoTitle: 'Physiological Sigh: How to Calm Down Quickly | ONDA Life',
  description:
    'The physiological sigh — two inhales and one long exhale — is a fast way to ease acute stress. What the 2023 Stanford study found, how to do it, safety, and how it compares to box breathing and 4-7-8.',
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
The physiological sigh is a breathing pattern of two inhales through the nose — a full breath, then a short second "top-up" — followed by one long, slow exhale through the mouth. It is one of the quickest ways to take the edge off acute stress, and many people feel calmer within one to three breaths. In a randomized Stanford study (Balban et al., 2023, *Cell Reports Medicine*), five minutes a day of "cyclic sighing" for a month improved mood more than mindfulness meditation and lowered resting breathing rate — though the differences between the breathing techniques themselves were small.

## How do you do a physiological sigh?

You inhale twice through the nose and then exhale slowly and fully through the mouth; one round takes about ten seconds.

1. **Inhale through your nose** — a normal, full breath until your lungs feel mostly full.
2. **Inhale again** — a second, shorter sip of air on top of the first. This is the part most people skip.
3. **Exhale slowly through your mouth** — one long, extended breath, noticeably longer than the inhale.
4. **Repeat one to five times** for a quick reset, or keep cycling for up to five minutes as in the Stanford protocol.

No equipment, counting, or special posture is needed — you can do it at a desk, in a meeting, or lying in bed.

## Why does the physiological sigh work?

The most likely explanation is the long exhale: breathing out slowly engages the parasympathetic ("rest and digest") branch of the nervous system, which slows the heart. Your heart rate naturally dips on every exhale (respiratory sinus arrhythmia), so a long exhale stretches that slowing phase.

The double inhale is thought to help re-open small air sacs (alveoli) that partly collapse during shallow breathing — spontaneous sighs serve this role in normal breathing — and a fuller exhale may help offload carbon dioxide. These mechanisms are physiologically plausible, but the Balban study measured mood, anxiety, breathing rate, and heart rate, not alveoli or vagal activity directly, and it did not find a meaningful change in heart rate variability (HRV). Treat the mechanism as a well-grounded explanation, not a proven one.

## What did the Stanford cyclic sighing study find?

It found that brief daily breathwork improved mood at least as well as mindfulness meditation, with cyclic sighing showing the largest benefit.

| Detail | Balban et al., 2023 |
|---|---|
| Design | Remote randomized controlled trial, one month |
| Participants | About 110 healthy adults |
| Daily dose | 5 minutes |
| Groups | Cyclic sighing, box breathing, cyclic hyperventilation, mindfulness meditation |
| Main finding | Breathwork improved positive mood more than mindfulness; cyclic sighing had the largest daily gain |
| Physiology | Cyclic sighing lowered resting respiratory rate the most; no meaningful HRV effect |

The study has limits: one month, healthy volunteers, self-reported mood, and differences among the three breathing techniques that were not all statistically significant. It is promising evidence for a simple daily habit, not proof that the sigh treats anxiety.

## Is the physiological sigh better than box breathing or 4-7-8?

Not clearly better — it is faster and simpler, while the others suit different situations. The sigh is handy for acute moments; [box breathing](/articles/box-breathing-how-it-works) suits sustained steadiness; [4-7-8 breathing](/articles/4-7-8-breathing) is usually used to wind down before sleep.

| Technique | Pattern | Typical use | Evidence |
|---|---|---|---|
| **Physiological sigh** | 2 inhales + 1 long exhale | Sudden stress, quick reset | One RCT on mood (Balban 2023) |
| **Box breathing** | 4 in · 4 hold · 4 out · 4 hold | Steady focus under pressure | Same RCT; similar mood benefit |
| **4-7-8 breathing** | 4 in · 7 hold · 8 out | Winding down for sleep | Small studies only |

## When should you use the physiological sigh?

Use it whenever stress spikes and you have seconds, not minutes:

- Right before a call or presentation, after bad news, or mid-argument.
- When you notice yourself holding your breath at a screen.
- Between tasks, to reset instead of carrying tension forward.
- In bed when your mind won't slow down.

For longer stretches of stress, pair it with slower practices such as [coherent breathing](/articles/coherent-breathing-guide) at around five to six breaths per minute. The sigh helps with the spike; regular slow breathing builds steadiness.

## Safety: when should you stop?

Stop and return to normal breathing if you feel dizzy, light-headed, tingly, or more anxious. Don't force the second inhale or overfill your lungs, and avoid rapid repeated rounds, which can tip into over-breathing. If you have asthma, COPD, a heart condition, are pregnant, or experience panic attacks, keep it gentle and ask your clinician if unsure. Breathing techniques support well-being; they are not a treatment for anxiety disorders or any medical condition.

## See it work on your own body

You usually can't see a breathing technique working — you just trust that something shifted. ONDA closes that gap: rest a fingertip on your iPhone camera, or wear your Apple Watch, and watch your pulse and estimated breathing rate respond live as you sigh. With an Apple Watch, ONDA also shows a live coherence reading. It's feedback during the practice, not a score after.
`,
  howToSteps: [
    {
      name: 'Inhale a full breath through your nose',
      text: 'Breathe in through your nose until your lungs feel mostly full — a normal, complete inhale.',
      protocolId: 'sigh-inhale-1',
    },
    {
      name: 'Add a second short inhale on top',
      text: 'Take a second, shorter sip of air on top of the first inhale. This double inhale is thought to re-open partly collapsed air sacs and is the part most people skip.',
      protocolId: 'sigh-inhale-2',
    },
    {
      name: 'Exhale slowly through your mouth',
      text: 'Let everything go in one long, extended exhale through the mouth, slower than the inhale. The long exhale engages the calming parasympathetic system and slows your heart rate.',
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
