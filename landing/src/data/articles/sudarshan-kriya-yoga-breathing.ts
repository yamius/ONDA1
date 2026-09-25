import type { Article } from './types'

/**
 * Sudarshan Kriya Yoga (SKY): Ujjayi + Bhastrika + cyclical kriya + Om. Evidence kept to what is
 * checkable: NIMHANS trial vs ECT/imipramine (Janakiramaiah et al., 2000, J Affect Disord), tsunami-
 * survivor PTSD trial, small RCT in US veterans with 1-year follow-up (Seppälä et al., 2014), cortisol
 * reductions in alcohol-dependent patients. Unverifiable draft specifics (2024 n=129 physicians, 2025
 * pilot, single-session BDNF 4h) dropped. HONEST: mixed-quality evidence, taught not self-learned.
 * camera=pulse, watch=HRV.
 */
const article: Article = {
  slug: 'sudarshan-kriya-yoga-breathing',
  title: 'Sudarshan Kriya Yoga: The Breathing Practice Studied Against Antidepressants',
  seoTitle: 'Sudarshan Kriya Yoga (SKY): Evidence & Caveats | ONDA Life',
  description:
    "Sudarshan Kriya Yoga (SKY) is a structured breathing practice studied for depression, PTSD and stress — in one trial comparable to an antidepressant. The evidence, the mechanism, and the honest caveats.",
  category: 'ONDA Protocol',
  relatedSlugs: ['fast-vs-slow-pranayama', 'bhastrika-pranayama-brain-anxiety', 'coherent-breathing-guide', 'how-to-lower-cortisol'],
  introStyle: 'gold',
  image: '/images/articles/sudarshan-kriya-yoga-breathing.jpg',
  imageAlt:
    'Sudarshan Kriya Yoga — illustration: rhythmic breath waves in slow, medium and fast cycles spiraling around a small group of seated silhouettes.',
  imageTitle: 'Sudarshan Kriya Yoga',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Promising, unusually serious evidence — but learn the full kriya from a teacher, and never use it instead of treatment.',
    link: '/articles/coherent-breathing-guide',
    linkText: 'Start with slow breathing →',
  },
  content: `
Sudarshan Kriya Yoga (SKY) is a structured breathing practice that has been studied more seriously than almost any other — including trials for depression, PTSD, and stress. In a landmark Indian study at NIMHANS, SKY was compared head-to-head with electroconvulsive therapy (ECT) and the antidepressant imipramine in patients with melancholic depression: its remission rate was lower than ECT but comparable to the antidepressant. Other trials report lower cortisol and reduced PTSD symptoms, including in military veterans. It's a striking body of evidence for a breathing technique — though, as we'll cover honestly, the overall quality is mixed and larger trials are still needed.

## What Sudarshan Kriya is

SKY is not a single breath but a structured sequence, taught over several days and then practiced regularly. It integrates several elements in a set order:

- **Ujjayi** ("victorious breath") — very slow breathing with a slight constriction of the throat that adds airway resistance and lengthens each phase of the breath.
- **Bhastrika** — the fast, forceful "bellows breath" that energizes (see [Bhastrika and the brain](/articles/bhastrika-pranayama-brain-anxiety)).
- **The Sudarshan Kriya itself** — cyclical breathing in slow, medium, and fast rhythms.
- **Om chanting** and guided attention.

The combination is deliberate: slow breathing to calm, fast breathing to activate, and rhythmic cycling between them — both families described in [fast vs slow pranayama](/articles/fast-vs-slow-pranayama). It was popularized worldwide by the Art of Living organization.

## The clinical evidence

The research on SKY is unusually ambitious for a breathing technique:

**Depression, compared to standard treatments.** In the NIMHANS trial (Janakiramaiah et al., 2000), SKY was compared with ECT and imipramine in melancholic depression. Remission was lower than with ECT but comparable to the antidepressant — a remarkable benchmark for a breathing practice. Smaller studies reported reduced depression scores, with hormonal changes, in alcohol-dependent patients.

**PTSD.** A trial among survivors of the 2004 Indian Ocean tsunami reported reductions in PTSD and depression. A small randomized study of US veterans of Iraq and Afghanistan found reduced PTSD symptoms and a lower respiration rate, with effects still present at one-year follow-up.

**Stress hormones.** Several studies report lower cortisol after SKY training, alongside reduced self-reported stress — consistent with the practice's calming slow-breathing core.

## The honest caveats

This record deserves an honest frame. Systematic reviews conclude that while several trials report positive effects on mood and stress, the overall evidence is of **mixed quality**, and larger, well-controlled randomized trials are needed before firm conclusions. Many studies are small; some lack rigorous controls; some were run by researchers connected to the organization that teaches it. The NIMHANS comparison is striking but is one study, decades old. So the fair statement is: promising and unusually serious for breathwork, but not definitive. SKY is a supportive practice, not a replacement for treatment of depression or PTSD — anyone with those conditions should work with a professional.

## Why it might work

Several mechanisms are proposed. The slow Ujjayi component shifts the body toward parasympathetic dominance, amplifying the normal breath-linked rise and fall of heart rate (respiratory sinus arrhythmia) — the same lever as [coherent breathing](/articles/coherent-breathing-guide). The rhythmic, high-ventilation cycling adds a strong activating contrast. And the reported drop in cortisol points to a genuine shift in stress chemistry, not just a feeling of relaxation (see [how to lower cortisol](/articles/how-to-lower-cortisol)).

## Practicing SKY

SKY is unusual among the techniques on this site in that it's **taught, not self-learned.** The full Sudarshan Kriya is traditionally learned in a structured course with a trained instructor, because it combines forceful and slow techniques in a specific sequence that's hard to reproduce from text. If you're drawn to it, the appropriate path is a proper course, then regular home practice. The gentler component — slow Ujjayi-style breathing — you can practice on your own. The fast parts carry the same cautions as Bhastrika: seated only, never in water or while driving, and not without medical advice if you have heart or lung conditions, uncontrolled blood pressure, or are pregnant.

## See your body respond

The slow-breathing core of SKY is measurable. ONDA reads your pulse from your phone camera or Apple Watch, and your HRV from Apple Watch, so you can watch how slow Ujjayi-style breathing settles your heart and track whether your baseline shifts with regular practice.

*Sources include Janakiramaiah et al., 2000 (Journal of Affective Disorders) and Seppälä et al., 2014 (Journal of Traumatic Stress). ONDA is a breathing and HRV biofeedback app, not a medical device. SKY is not a replacement for professional treatment of depression or PTSD.*
`,
}

export default [article]
