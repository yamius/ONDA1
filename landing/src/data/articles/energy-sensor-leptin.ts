import type { Article } from './types'

/**
 * Leptin investigation — "fullness hormone", leptin resistance, diet-induced
 * leptin drop / weight-loss plateau, and short sleep → lower leptin / higher
 * ghrelin. Myth-check: fasting and cold do NOT "reset" leptin (fasting lowers
 * it). Grounded in verified literature (Zhang 1994; Considine 1996; Kolaczynski
 * 1996; Montague 1997; Farooqi 1999; Spiegel 2004; Taheri 2004; Myers 2010;
 * Rosenbaum & Leibel 2010; Izquierdo 2019). Honest firewall: ONDA does not
 * measure leptin, hunger, glucose or metabolism — only sleep regularity and
 * duration (Life Rhythm, Apple Watch) as the trackable lever.
 */
const article: Article = {
  slug: 'energy-sensor-leptin',
  title: 'The Hunger Signal: Why Leptin Stops Working — and Why a Short Night Makes You Hungrier',
  subtitle:
    'What the "fullness hormone" really does, why dieting turns it down, and the one everyday lever that reliably moves it: sleep.',
  seoTitle: 'Leptin: Fullness Hormone, Resistance & Sleep | ONDA Life',
  description:
    'Leptin tells your brain how much fat you store. Why high leptin does not stop hunger, why dieting lowers it, how short sleep cuts it, and what actually helps.',
  category: 'Biological Software',
  relatedSlugs: [
    'metabolism',
    'metabolic-flexibility',
    'hypothalamus',
    'insulin-sensitivity',
    'glucose-spikes',
    'autophagy',
  ],
  introStyle: 'amber',
  image: '/images/articles/energy-sensor-leptin.webp',
  imageAlt:
    'Illustration of leptin signaling: fat tissue releasing the hormone leptin, which travels to the hypothalamus in the brain to report how much energy the body has stored.',
  imageTitle: 'Leptin: the signal from fat tissue to the brain',
  imageCaption:
    'Leptin reports long-term energy stores from fat tissue to the hypothalamus. Dieting lowers it, short sleep lowers it, and high levels in obesity do not reliably curb hunger.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Short sleep lowers leptin and raises hunger. Metabolic flexibility is the next piece of the energy picture.',
    link: '/articles/metabolic-flexibility-dual-fuel-system',
    linkText: 'Metabolic Flexibility',
  },
  howToSteps: [
    {
      name: 'Protect sleep duration first',
      text: 'Aim for a consistent 7–9 hours. In controlled studies, cutting sleep lowered leptin, raised ghrelin and increased hunger, especially for calorie-dense foods.',
      protocolId: 'leptin-sleep-duration',
    },
    {
      name: 'Lose weight slowly and plan for the plateau',
      text: 'Leptin falls as food intake and fat drop, which pushes hunger up and energy use down. Expect it, favor a modest deficit, and treat weight maintenance as its own phase.',
      protocolId: 'leptin-steady-loss',
    },
    {
      name: 'Build meals that keep you full',
      text: 'Choose protein, fiber-rich plants and minimally processed foods to manage appetite. This helps with hunger in general, not because it "resets" leptin, which no test can confirm.',
      protocolId: 'leptin-satiating-meals',
    },
  ],
  content: `
## [ CASE FILE: THE HUNGER THAT DOESN'T ADD UP ]

> "Two weeks into a diet, the scale has moved and the hunger has gotten louder, not quieter. Then a week of late nights and early alarms, and the cravings for bread and sweets are suddenly hard to ignore. Meanwhile, a friend who carries far more body fat says they feel hungry all the time too.

> If fat tissue tells the brain 'we have enough,' why doesn't more fat mean less hunger — and why do both dieting and a short night turn the volume up? The answer runs through one hormone, **leptin**, and through what it is really built to do."

---

## Section 1: What does leptin actually do?

Leptin is a hormone made mainly by fat cells that tells the brain, roughly, how much energy the body has stored. The more body fat you carry, the more leptin circulates.

It was discovered in 1994, when researchers identified the gene behind a strain of severely obese mice and found its human counterpart (Zhang 1994). Two years later, a study of 136 normal-weight and 139 obese adults found that blood leptin tracked body fat closely, with a correlation of 0.85 with body-fat percentage (Considine 1996).

Leptin acts largely on the hypothalamus, the brain region that balances appetite and energy use. When leptin is missing entirely, the effect is dramatic: children born unable to make leptin develop severe obesity early in life (Montague 1997), and leptin injections given to one such child reduced her appetite and body fat (Farooqi 1999). So leptin clearly matters. The question is why it seems to do so little in everyday weight gain.

---

## Section 2: Why doesn't more leptin mean less hunger — and can you test for leptin resistance?

Because in most people with obesity, the brain does not respond to leptin the way the "fullness hormone" label suggests. Leptin levels are high, yet appetite is not turned down.

The 1996 study that linked leptin to body fat drew exactly that conclusion: most obese people appear to be insensitive to their own leptin (Considine 1996). Early hopes of treating common obesity with leptin injections faded for the same reason — people who already had plenty of leptin got little from more (Izquierdo 2019). This is what "leptin resistance" means.

Two honest caveats:

- **It is not one thing.** Researchers point out that the term covers several different mechanisms, and that obesity itself can dampen leptin signaling, so it is hard to tell whether resistance causes weight gain or follows from it (Myers 2010).
- **There is no clinical test for it.** A leptin blood test exists, but a high result mostly reflects how much body fat you have. No routine lab test shows that your brain is "resistant," and symptom quizzes that claim to diagnose it are not validated.

---

## Section 3: Why does leptin fall when you diet — and why do weight-loss plateaus happen?

Leptin drops quickly when you eat less, well before you lose much fat, and that drop is one of the signals the body uses to defend its energy stores.

In a short-term fasting study, leptin began a steady decline after about 12 hours without food, reached its low point around 36 hours, and returned to baseline within a day of normal eating (Kolaczynski 1996). Over longer weight loss, leptin falls along with fat mass (Considine 1996).

The brain reads falling leptin as a shortage. Researchers who have studied weight-reduced people for decades describe a coordinated response — more hunger, lower energy expenditure, hormonal and nervous-system shifts — that makes keeping weight off much harder than losing it, and they identify leptin as a major driver (Rosenbaum & Leibel 2010).

That is a large part of why plateaus and regain are so common. It is physiology, not a failure of willpower.

---

## Section 4: How does short sleep change leptin and hunger?

Short sleep lowers leptin, raises ghrelin (a hormone that stimulates hunger), and makes people hungrier. This is one of the better-documented links in the field.

- **A controlled experiment.** In a 2004 crossover study, 12 healthy young men spent two nights with restricted sleep and two with extended sleep while food intake and activity were controlled. After sleep restriction, leptin was about 18% lower, ghrelin about 28% higher and hunger about 24% higher, with the biggest jump in appetite for calorie-dense, carbohydrate-rich foods (Spiegel 2004).
- **A real-world population.** The same year, an analysis of 1,024 adults in the Wisconsin Sleep Cohort found that habitual 5-hour sleepers had a predicted 15.5% lower leptin than 8-hour sleepers, plus higher ghrelin, independent of body mass index (Taheri 2004).

Both have limits: the experiment was small and short, and the cohort shows an association, not proof of cause. But they point the same way — a short night shifts your hunger signals against you.

---

## Section 5: Do fasting, cold exposure or special diets "reset" leptin?

No, not in any way that has been shown in people. Several popular claims run opposite to the evidence.

- **Fasting.** Fasting *lowers* leptin (Kolaczynski 1996). There is no human evidence that a 14–16 hour fasting window "restores leptin sensitivity." Time-restricted eating can help some people eat less overall, but that is a different claim.
- **Cold exposure.** We found no human trial showing that cold showers or plunges improve leptin signaling. Cold is a stressor with its own effects; a "leptin reset" is not one that has been demonstrated.
- **A "leptin breakfast."** The idea that a high-protein breakfast stabilizes leptin for the whole day is not supported by controlled studies. Protein does help many people feel full, which is useful on its own terms.

And since no test can measure leptin resistance, a program promising to "fix" it has no way to show you that it did.

---

## Section 6: What actually helps — and what can you see yourself?

The levers with real evidence are ordinary ones: enough sleep, a realistic pace of weight loss, and meals that keep you full.

- **Sleep enough, consistently.** The sleep studies above are the clearest everyday lever on leptin and ghrelin.
- **Expect the body to push back.** A modest deficit plus a planned maintenance phase works with the leptin drop instead of pretending it isn't there.
- **Eat for fullness.** Protein, fiber-rich plants and fewer ultra-processed foods help with appetite in general.
- **Get medical help for obesity when needed.** Modern obesity medicines act on appetite pathways directly; that is a conversation for a doctor.

What you can track: ONDA does **not** measure leptin, hunger, blood sugar or metabolism. If you wear an Apple Watch, ONDA's Life Rhythm view shows your sleep duration and how regular your bedtimes and wake times are — the one piece of this picture you can follow day to day. If your shortest nights keep landing before your hungriest days, that pattern is worth noticing.

---

## Section 7: When should you see a doctor?

See a doctor if your appetite or weight changes sharply without a clear reason. In particular:

- Rapid, unexplained weight gain or weight loss.
- Constant, intense hunger that is new for you, or severe obesity that began in early childhood. Rare genetic causes, including congenital leptin deficiency, can be diagnosed, and some are treatable (Farooqi 1999).
- Loud snoring, gasping at night or heavy daytime sleepiness, which can point to sleep apnea.
- Hunger together with strong thirst, frequent urination or unusual fatigue, which can point to diabetes or a thyroid problem.

Leptin is a real and important signal. It just isn't a dial you can turn with a trick — and the most reliable thing you can do for it tonight is get to bed on time.
`,
}

export default [article]
