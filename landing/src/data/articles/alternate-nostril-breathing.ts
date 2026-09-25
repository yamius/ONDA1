import type { Article } from './types'

/**
 * Alternate nostril breathing (Nadi Shodhana). AEO reference article. Honest mechanism: the calm
 * comes from the slow, even pace (5-6 bpm → vagal activation, HRV up), NOT the nostril-switching;
 * "balancing hemispheres" claim flagged as weakly supported. FAQ in ARTICLE_FAQ. Practice, not treatment.
 */
const article: Article = {
  slug: 'alternate-nostril-breathing',
  title: 'Alternate Nostril Breathing (Nadi Shodhana): Benefits and How to Do It',
  seoTitle: 'Alternate Nostril Breathing (Nadi Shodhana) | ONDA Life',
  description:
    'Alternate nostril breathing (Nadi Shodhana) calms the nervous system and can lower blood pressure and raise HRV. How to do it, why the slow pace is what works, and when to use it.',
  category: 'ONDA Protocol',
  relatedSlugs: ['coherent-breathing-guide', 'physiological-sigh', 'box-breathing-how-it-works', 'how-to-raise-hrv-naturally', 'find-your-resonance-breathing-rate'],
  introStyle: 'emerald',
  image: '/images/articles/alternate-nostril-breathing.jpg',
  imageAlt:
    'Alternate Nostril Breathing — illustration: a face-profile silhouette with two alternating streams of light, one mint and one soft blue, flowing through the nose in a balanced symmetrical pattern.',
  imageTitle: 'Alternate Nostril Breathing',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'The calm comes from the pace, not the nostrils. See your own HRV confirm which is working.',
    link: '/tools',
    linkText: 'See it live →',
  },
  content: `
Alternate nostril breathing — Nadi Shodhana in yoga — is a technique where you close one nostril, inhale, then switch nostrils and exhale, alternating throughout. It lowers heart rate, calms the nervous system, and is associated in research with reduced blood pressure and improved heart rate variability (HRV). Here's the honest mechanism: the calm comes mainly from the slow, controlled pace it forces you into — not from the nostril-switching itself. It takes about five minutes and is best for winding down or steadying a scattered mind, rather than stopping acute panic, where a [physiological sigh](/articles/physiological-sigh) works faster.

## How to do alternate nostril breathing

Sit comfortably with a straight spine. Use your right thumb and ring finger to control your nostrils:

1. **Close your right nostril** with your thumb. Inhale slowly through the left nostril.
2. **Close your left nostril** with your ring finger, release the right, and **exhale** through the right nostril.
3. **Inhale** through the right nostril.
4. **Switch** — close the right, release the left, and **exhale** through the left.

That's one full cycle. Continue for three to five minutes, keeping the breath slow, smooth and even. Don't force the length — a comfortable, unhurried pace matters more than a long one. If holding the finger position is distracting, simply imagine breathing through one side at a time; the slow rhythm is what does the work.

## Why it works — and what actually matters

Nadi Shodhana's calming effect has a straightforward explanation: it slows your breathing down and makes it even and deliberate. Slow breathing — roughly five to six breaths per minute — is one of the most robustly supported ways to activate the vagus nerve, shift toward the parasympathetic "rest and digest" state, and raise HRV in real time. The alternating nostrils give your mind a simple task to focus on, which helps you stay with the practice, but the physiological benefit comes overwhelmingly from the pace. That same pace is what a [resonance breathing rate](/articles/find-your-resonance-breathing-rate) targets directly.

Indian clinical research backs the calming effect: in a randomized trial of hypertensive patients, 20 minutes of Nadi Shodhana significantly lowered systolic and diastolic blood pressure and heart rate, and improved auditory reaction time — a marker of a calmer, more responsive nervous system. Interestingly, the same trial found the change in HRV parameters themselves was not always statistically significant — a reminder that the benefit shows up across several measures, not one number.

Traditional yoga also describes alternate nostril breathing as "balancing" the two hemispheres of the brain. The honest state of the evidence: this specific claim is weakly supported. What's well supported is that slow, controlled breathing calms the nervous system — and Nadi Shodhana is a pleasant, structured way to get there.

## When to use it

Alternate nostril breathing suits calm, deliberate moments more than emergencies:

- **Winding down** before bed or after a busy day.
- **Steadying a scattered, overstimulated mind** when you need to focus.
- **As a short daily practice** to build the habit of slow breathing.

For an acute stress spike — sudden anxiety, a jolt of bad news — it's too slow to be your first choice; reach for a physiological sigh instead. Think of Nadi Shodhana as a settling ritual, not a rescue tool.

## Alternate nostril breathing vs other techniques

| Technique | Pace | Best for |
|---|---|---|
| **Alternate nostril** | Slow, ~5 min | Settling a scattered mind, winding down |
| **Coherent breathing** | 5–6 breaths/min | Sustained calm, raising HRV |
| **Physiological sigh** | 1–3 breaths | Stopping a sudden stress spike fast |

If your goal is simply to raise HRV and calm down, [coherent breathing](/articles/coherent-breathing-guide) achieves the same physiology with less to think about. Choose Nadi Shodhana when you enjoy the ritual and the focus it provides.

## See the calm in your numbers

Because the benefit of Nadi Shodhana comes from slowing your breath, you can watch it happen. ONDA reads your pulse from your phone camera or Apple Watch and shows your heart rate settle as your breathing slows and evens out; with an Apple Watch you also see your HRV rise. Seeing it in your own numbers confirms you've found a genuinely calming pace — and helps you tell whether it's the practice working, or just the pause.
`,
  howToSteps: [
    {
      name: 'Inhale through the left nostril',
      text: 'Close your right nostril with your thumb and inhale slowly through the left nostril.',
      protocolId: 'nadi-inhale-left',
    },
    {
      name: 'Exhale through the right nostril',
      text: 'Close the left nostril with your ring finger, release the right, and exhale through the right nostril.',
      protocolId: 'nadi-exhale-right',
    },
    {
      name: 'Inhale right, then switch and exhale left',
      text: 'Inhale through the right nostril, then close the right, release the left, and exhale through the left. That completes one cycle.',
      protocolId: 'nadi-switch',
    },
    {
      name: 'Continue for three to five minutes',
      text: 'Keep the breath slow, smooth and even at a comfortable, unhurried pace. The slow rhythm — not the nostril-switching — is what calms you.',
      protocolId: 'nadi-continue',
    },
  ],
}

export default [article]
