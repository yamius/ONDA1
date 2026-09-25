import type { Article } from './types'

/**
 * 4-7-8 breathing — inhale 4 / hold 7 / exhale 8, popular for sleep. AEO reference article.
 * Honest framing: it lowers arousal (makes sleep more likely) but can't force sleep; ratio > exact
 * count; long exhale + mild CO2 rise → vagal downshift. FAQ in ARTICLE_FAQ. Technique, not treatment.
 */
const article: Article = {
  slug: '4-7-8-breathing',
  title: '4-7-8 Breathing: How It Works, and When It Doesn’t',
  seoTitle: '4-7-8 Breathing for Sleep: How It Works | ONDA Life',
  description:
    'The 4-7-8 breathing technique — inhale 4, hold 7, exhale 8 — is popular for falling asleep. The science of why the long exhale calms you, how to do it, and how it compares to box breathing.',
  category: 'ONDA Protocol',
  relatedSlugs: ['box-breathing-how-it-works', 'physiological-sigh', 'coherent-breathing-guide', 'wind-down-before-sleep-breathing', 'find-your-resonance-breathing-rate'],
  introStyle: 'indigo',
  image: '/images/articles/4-7-8-breathing.jpg',
  imageAlt:
    '4-7-8 Breathing — illustration: three glowing arcs of increasing length curving over a dark bedroom with a crescent moon in the window, suggesting a slow breath before sleep.',
  imageTitle: '4-7-8 Breathing',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Counting seconds and hoping? Watch your pulse actually slow as your exhales lengthen.',
    link: '/tools',
    linkText: 'See it live →',
  },
  content: `
The 4-7-8 breathing technique is a paced pattern: inhale quietly through the nose for 4 seconds, hold your breath for 7, then exhale audibly through the mouth for 8. The long exhale and the breath hold slow your heart rate and shift your nervous system toward rest, which is why it's most popular for falling asleep. Developed by Dr. Andrew Weil from yogic pranayama, it works for one concrete reason: any exhale longer than the inhale activates the vagus nerve and downshifts your body. It's not instant and it's not magic — most people feel calmer after three or four rounds, not one.

## How to do 4-7-8 breathing

The technique is meant to be done sitting or lying down, especially when you're using it for sleep:

1. **Exhale completely** through your mouth first, emptying your lungs.
2. **Inhale through your nose for 4 seconds**, quietly.
3. **Hold your breath for 7 seconds.**
4. **Exhale through your mouth for 8 seconds**, slowly and with a soft sound.

That's one round. Repeat for four rounds to start. Weil's original guidance is to do no more than four cycles at first, building up with practice. The exact seconds matter less than the ratio: the exhale should be clearly longer than the inhale, with a hold in between. If holding for 7 feels uncomfortable, shorten everything while keeping the 4-7-8 proportion — the principle, not the stopwatch, is what works.

## Why the long exhale calms you

Your breathing is directly wired to your autonomic nervous system. When you inhale, your heart rate speeds up slightly; when you exhale, it slows. Make the exhale longer than the inhale and you tip the balance toward the parasympathetic "rest and digest" branch, stimulating the vagus nerve, lowering heart rate and blood pressure, and signalling safety to the brain.

The 7-second hold adds a second effect: a brief, gentle rise in carbon dioxide, which at low levels has a calming, vasodilating influence and helps interrupt the fast, shallow breathing of a stressed state. Together, the hold and the extended exhale are what make 4-7-8 a wind-down tool rather than an energizing one. This is measurable — as you settle into the pattern, heart rate variability (HRV) rises, reflecting the shift toward calm.

## Does 4-7-8 actually help you sleep?

Partly, and honestly. 4-7-8 doesn't sedate you the way a sleeping pill does — it can't force sleep. What it does is lower the physiological arousal that keeps you awake: racing heart, shallow breath, an active stress response. By downshifting your nervous system, it makes the *conditions* for sleep more likely. For many people that's enough to fall asleep faster; for others with real insomnia, it's a helpful piece but not a cure. Give it three to four rounds and a few minutes — if you're bolt awake and forcing the counts, that tension works against you. The goal is to relax into it, not to perform it. For a fuller routine, see [winding down before sleep](/articles/wind-down-before-sleep-breathing).

## 4-7-8 vs box breathing vs physiological sigh

These three techniques are often confused but do different jobs. Match the tool to the moment:

| Technique | Pattern | Best for |
|---|---|---|
| **4-7-8** | 4 in · 7 hold · 8 out | Winding down for sleep |
| **Box breathing** | 4 in · 4 hold · 4 out · 4 hold | Staying steady and focused under pressure |
| **Physiological sigh** | 2 inhales · 1 long exhale | Calming a sudden stress spike in seconds |

For sleep, 4-7-8 is the classic choice. For a stressful meeting, [box breathing](/articles/box-breathing-how-it-works) keeps you level. For a sudden jolt of anxiety, nothing beats the [physiological sigh](/articles/physiological-sigh) for speed.

## Common mistakes

- **Forcing the hold.** If 7 seconds makes you gasp, you've made it too long. Shrink the whole pattern and keep the ratio.
- **Doing too many rounds early.** Four is plenty at first; more can make you lightheaded.
- **Trying too hard.** Straining to hit exact counts creates the very tension you're trying to release. Approximate is fine.
- **Expecting instant sleep.** It lowers arousal; it doesn't knock you out. Let it work over a few rounds.

## See your body respond

The reason paced breathing feels like a leap of faith is that you can't normally see it working. ONDA shows you: rest a fingertip on your phone camera or use your Apple Watch, and watch your pulse slow as your exhales lengthen. Seeing your own heart rate drop turns "I'm counting seconds and hoping" into visible, real-time feedback — which also makes it easier to find the exhale length that calms *you* fastest.
`,
  howToSteps: [
    {
      name: 'Exhale completely first',
      text: 'Empty your lungs with a full exhale through the mouth before you begin the pattern.',
      protocolId: '478-empty',
    },
    {
      name: 'Inhale through the nose for 4 seconds',
      text: 'Breathe in quietly through your nose for a count of four.',
      protocolId: '478-inhale',
    },
    {
      name: 'Hold for 7 seconds',
      text: 'Hold your breath for a count of seven. If seven feels uncomfortable, shorten the whole pattern while keeping the 4-7-8 ratio.',
      protocolId: '478-hold',
    },
    {
      name: 'Exhale through the mouth for 8 seconds',
      text: 'Exhale slowly through the mouth for a count of eight, with a soft sound. Repeat for four rounds to start.',
      protocolId: '478-exhale',
    },
  ],
}

export default [article]
