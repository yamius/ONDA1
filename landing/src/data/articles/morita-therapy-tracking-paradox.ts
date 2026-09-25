import type { Article } from './types'

/**
 * Morita therapy (Masatake Morita, ~1919): psychic interaction (attention amplifies a sensation),
 * hakarai (fighting a feeling feeds it), arugamama (accept + redirect to action). Applied honestly to
 * health tracking: anxious checking can create the loop. Sibling of naikan-japanese-reflection.
 * ONDA claim kept modest (baseline + trend view). Educational, not treatment advice.
 */
const article: Article = {
  slug: 'morita-therapy-tracking-paradox',
  title: 'The Paradox of Watching Your Body: What Japanese Morita Therapy Teaches',
  seoTitle: 'Morita Therapy & the Health-Tracking Paradox | ONDA Life',
  description:
    "Focusing too hard on a symptom can make it worse — a vicious cycle Japanese Morita therapy named a century ago. What it teaches about anxiety, health tracking, and the wiser 'arugamama' approach.",
  category: 'ONDA Protocol',
  relatedSlugs: ['naikan-japanese-reflection', 'hrv-breathing-cold-honest-limits', 'normal-hrv-by-age', 'how-to-raise-hrv-naturally'],
  introStyle: 'gold',
  image: '/images/articles/morita-therapy-tracking-paradox.jpg',
  imageAlt:
    'The Paradox of Watching Your Body — illustration: a person looking at a phone with a heart line, surrounded by a looping spiral of attention; beside it the same person calmly setting the phone down.',
  imageTitle: 'The Paradox of Watching Your Body',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Informed, not fixated. Glance at the trend, then act — breathe, rest, move — and let the number follow.',
    link: '/articles/normal-hrv-by-age',
    linkText: 'What a normal HRV looks like →',
  },
  content: `
Focusing too intensely on a bodily sensation can make it worse — and Japanese psychiatry named this trap over a century ago. In Morita therapy, developed by Dr. Masatake Morita around 1919, it's called *psychic interaction* (精神交互作用): when you fix attention on a sensation, the sensation intensifies, which draws more attention, which intensifies it further — a vicious cycle of attention and feeling. A tired, anxious person notices their heartbeat, worries something's wrong, and that worry tightens the nervous system so the heart beats harder — pulling in still more attention. Morita's remedy, *arugamama* ("accepting things as they are"), is directly relevant to anyone who tracks their own body: sometimes watching a number too closely is the problem, not the solution.

## The vicious cycle Morita described

Morita developed his approach treating anxiety and what were then called neuroses — panic, obsessive, and social-anxiety conditions. He noticed a common thread: people prone to them tend to be introspective, sensitive, perfectionistic, and self-monitoring.

*Psychic interaction* is the mechanism. Fix your attention hard on a sensation — a skipped heartbeat, a tight chest, a flush of warmth — and it sharpens and locks in. The heightened sensation grabs more attention; the attention amplifies the sensation. What might have been a passing flicker becomes a loud, fixed symptom, purely through the loop of watching it. Modern psychology describes similar attention-feedback effects; Morita mapped it a hundred years ago.

## Why fighting a symptom backfires

Morita's second key idea is that trying to *control* or *eliminate* a feeling usually makes it stronger. He called this counterproductive struggle *hakarai* — the effort to force an unwanted feeling away. The harder you push against anxiety, the more you feed the cycle: the effort itself is attention on the thing you're trying to escape.

This is why "just calm down" fails. Feelings arise on their own and can't be suppressed on command. The struggle is the trap.

## Arugamama: accepting things as they are

Morita's remedy is *arugamama*. Rather than battling anxiety or a symptom, you let it be present without trying to erase it, and redirect your energy — what Morita called the "desire for life" (生の欲望) — into constructive action. It is often described as a Japanese precursor to modern acceptance-based approaches, predating them by decades.

The shift is subtle but powerful: stop trying to make the feeling go away, stop monitoring it for change, and turn toward what you actually want to do. The symptom, no longer fed by attention and struggle, tends to loosen on its own. Its Japanese sibling, [Naikan](/articles/naikan-japanese-reflection), works on a different axis — your relationships and your past — but by the same principle of reorganizing attention rather than suppressing thought.

## What this means for tracking your body

Here's the honest application for anyone using an HRV app, a wearable, or any health tracker — including this one. If you check your numbers anxiously, refresh them repeatedly, and let a reading dictate your mood, you can create exactly the loop Morita described: watching your heart rate makes you anxious, which raises your heart rate, which you then watch more closely.

The wiser use is *arugamama* applied to data:

- **Look at trends, not every reading.** A single number isn't a verdict. Glance at the pattern, then get on with your life — HRV varies a lot from day to day (see [what's normal for your age](/articles/normal-hrv-by-age)).
- **Don't chase or fight a number.** A low HRV day is information, not a failure to correct through worry. Accept it, and act constructively.
- **Notice when tracking increases anxiety.** If checking your metrics makes you feel worse, that's the loop. Step back.
- **Redirect toward action.** Instead of monitoring the number, do the thing that helps — a slow breathing session, a walk, sleep — and let the number follow (see [how to raise HRV naturally](/articles/how-to-raise-hrv-naturally)).

It also helps to know what the numbers can't tell you — the [honest limits of HRV](/articles/hrv-breathing-cold-honest-limits) are a good antidote to over-reading them.

## A healthier relationship with your data

ONDA shows your readings against your own baseline and trend, rather than asking you to chase a perfect daily score. The goal is *arugamama* with your own body: aware of your patterns, not captured by them — using the data to act, then letting it go.

*ONDA is a breathing and HRV biofeedback app, not a medical device. This article is educational and draws on Japanese Morita therapy; it is not treatment advice. For an anxiety disorder, consult a qualified professional.*
`,
}

export default [article]
