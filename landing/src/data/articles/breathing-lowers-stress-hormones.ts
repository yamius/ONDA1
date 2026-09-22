import type { Article } from './types'

/**
 * Direct-evidence angle: beyond HRV, Japanese studies measured actual stress hormones (urinary/
 * salivary cortisol, adrenaline, noradrenaline) dropping after slow abdominal breathing — stronger
 * than HRV inference. Grounded: healthy-women study + Tanaka et al. older-adults; baroreflex→
 * hypothalamus mechanism. AEO reference, FAQ in ARTICLE_FAQ. Honest: hormones attributed to studies;
 * ONDA tie-in stays to pulse (camera) / HRV (watch), can't measure hormones at home.
 */
const article: Article = {
  slug: 'breathing-lowers-stress-hormones',
  title: 'Breathing Lowers Your Stress Hormones — Japanese Research on Cortisol',
  seoTitle: 'Breathing Lowers Cortisol: The Hormone Evidence | ONDA Life',
  description:
    'Beyond HRV, Japanese studies measured actual stress hormones: slow abdominal breathing significantly lowered cortisol, adrenaline and noradrenaline. The direct evidence and what it means.',
  category: 'Biological Software',
  relatedSlugs: ['how-to-lower-cortisol', 'coherent-breathing-guide', 'how-to-raise-hrv-naturally', 'box-breathing-how-it-works', 'breathing-exercises-older-adults'],
  introStyle: 'emerald',
  neuralSuggestion: {
    text: 'You can’t watch your cortisol fall — but you can watch the autonomic shift the hormone studies confirm underneath.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
Most breathing research measures heart rate variability (HRV) as a proxy for calm. Japanese studies went further and measured the actual stress hormones in the body — and found that slow, conscious abdominal breathing significantly lowered [cortisol](/glossary/cortisol), adrenaline and noradrenaline. In one study of healthy women, urinary levels of all three stress hormones dropped significantly after abdominal breathing, while the parasympathetic "rest and digest" system became dominant. This is stronger evidence than HRV alone: it's not just that your heart rhythm looks calmer — the chemistry of stress in your body measurably falls. And it works without being a strain on the body itself.

## Beyond HRV: measuring the hormones directly

HRV is an excellent, non-invasive window into your nervous system, but it's an indirect measure — it infers autonomic balance from your heartbeat. Stress hormones are the more direct readout: cortisol, adrenaline (epinephrine) and noradrenaline (norepinephrine) are what your body actually releases under stress. Measuring them requires blood, saliva or urine samples, which is why most consumer breathing content relies on HRV instead.

Japanese physiology research took the harder path. By collecting saliva and urine before and after breathing sessions, these studies could confirm not just that the heart rhythm shifted, but that the underlying stress chemistry changed too. That closes an important gap: it shows the calm is real at the hormonal level, not only in the beat-to-beat pattern.

## What the studies found

Two Japanese studies stand out, both using conscious abdominal (diaphragmatic) breathing:

- **Healthy women (11 participants).** During abdominal breathing, frequency analysis of the heartbeat showed the parasympathetic system became dominant. In urine samples, **noradrenaline, adrenaline and cortisol all dropped significantly** after abdominal breathing. Serotonin, linked to alertness, did not change. The conclusion: abdominal breathing is not a stressor on the body — it reliably maintains a relaxed state.
- **Healthy older adults (14 participants, Tanaka et al.).** During conscious abdominal breathing, heart rate fell, both systolic and diastolic blood pressure dropped, and the parasympathetic index rose. Stress hormones decreased significantly, and the breathing was not a burden for older participants — it kept them relaxed rather than taxing them (more in [breathing exercises for older adults](/articles/breathing-exercises-older-adults)).

Together these show a consistent picture across ages and sexes: slow abdominal breathing shifts you toward parasympathetic dominance *and* lowers the measurable hormones of stress.

## Why abdominal breathing does this

The mechanism ties back to the [vagus nerve](/glossary/vagus-nerve) and the baroreflex. Slow, deep abdominal breathing — roughly six breaths per minute — brings the heart-rate and blood-pressure rhythms into resonance, strongly activating the baroreflex (the blood-pressure regulating loop in your arteries). Japanese HRV-biofeedback research proposes that this baroreflex activation projects to the hypothalamus, influencing the body's broader autonomic and hormonal homeostasis — including the stress-hormone axis.

In plain terms: by breathing slowly and low into the belly, you trigger a reflex cascade that not only calms your heart but reaches the control centers that govern cortisol and adrenaline release. That's why the effect shows up in hormones, not just heartbeats.

## What this means for you

This research raises the confidence behind every slow-breathing practice. When you do [coherent breathing](/articles/coherent-breathing-guide), [box breathing](/articles/box-breathing-how-it-works), or simple abdominal breathing, you're not just nudging a number on a screen — you're measurably lowering the stress chemistry in your body. Two practical takeaways:

- **Breathe low and slow.** The benefit comes from diaphragmatic (belly) breathing at a slow pace, not shallow chest breathing. Aim for a long, easy exhale.
- **It's gentle by design.** These studies specifically found the breathing was not a stressor — even for older adults — so it's a safe daily practice, not something to brace against.

For the hormonal picture from the other side — why "cortisol detox" is a myth — see [how to lower cortisol](/articles/how-to-lower-cortisol).

## See your own calm

Hormone levels aren't something you can check at home — but their downstream effect on your heart is. ONDA reads your pulse from your phone camera, or your HRV from your Apple Watch, and shows your heart rate settle as you breathe slowly, in real time. While you can't watch your cortisol fall, you can watch the autonomic shift that the Japanese hormone studies confirm is happening underneath.
`,
  howToSteps: [
    {
      name: 'Breathe low into the belly, not the chest',
      text: 'Use diaphragmatic (abdominal) breathing — the belly rises on the inhale. Shallow chest breathing does not produce the same hormonal shift.',
      protocolId: 'bsh-belly',
    },
    {
      name: 'Slow the pace with a long exhale',
      text: 'Aim for roughly six breaths per minute with a long, easy exhale. This brings heart and blood-pressure rhythms into resonance and activates the baroreflex.',
      protocolId: 'bsh-slow',
    },
    {
      name: 'Keep it gentle and brief',
      text: 'A few minutes of calm, focused abdominal breathing is the target. The research effect came from a relaxed session, not effortful or prolonged breathing.',
      protocolId: 'bsh-gentle',
    },
  ],
}

export default [article]
