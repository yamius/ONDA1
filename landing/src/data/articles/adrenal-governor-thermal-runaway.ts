import type { Article } from './types'

/**
 * Adrenal Fatigue: What the Evidence Says
 * (slug kept from the former "Adrenal Governor" metaphor article — URL unchanged.)
 * Targets the "adrenal fatigue" search intent with an honest answer: not a recognised
 * condition (Cadegiani & Kater 2016), the real adrenal diseases (Endocrine Society
 * guidelines), why "adrenal tests" mislead, red flags, and what helps exhaustion.
 * Follows content/science/concepts/cortisol-and-stress-response.md.
 */
const article: Article = {
  slug: 'adrenal-governor-thermal-runaway',
  title: 'Adrenal Fatigue: What the Evidence Says',
  seoTitle: 'Adrenal Fatigue: Is It Real? What the Evidence Says | ONDA Life',
  description:
    'Adrenal fatigue is not a recognised medical condition. Why the tiredness is still real, which adrenal diseases do exist, and when to see a doctor.',
  category: 'Biological Software',
  relatedSlugs: ['cortisol', 'hpa-axis', 'stress', 'burnout', 'sleep', 'heart-rate-variability'],
  introStyle: 'amber',
  image: '/images/articles/adrenal-governor-thermal-runaway.webp',
  imageAlt:
    'Stylised illustration of an adrenal gland, used for an article on whether adrenal fatigue is real and what the evidence says about cortisol, exhaustion and real adrenal diseases.',
  imageTitle: 'Adrenal fatigue: what the evidence says about tiredness, cortisol and the adrenal glands.',
  imageCaption: 'Exhaustion is real; "adrenal fatigue" as a diagnosis is not supported by the evidence.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Find out if your stress load is tipping into burnout — and what to do first.',
    link: '/tools/burnout',
    linkText: 'Burnout Self-Assessment →',
  },
  content: `
Adrenal fatigue is not a recognised medical condition. The idea is that long-term stress "wears out" the adrenal glands until they can no longer make enough cortisol — but a systematic review of 58 studies found no consistent evidence that this happens, and concluded that adrenal fatigue does not exist (Cadegiani & Kater 2016). The exhaustion people describe is real, though. It deserves a proper medical look, because real adrenal diseases exist and so do many other causes of fatigue — and a label that doesn't hold up can delay finding them.

---

## What is "adrenal fatigue" supposed to be?

The theory says chronic stress makes the adrenal glands produce cortisol non-stop until they become "exhausted", leaving you tired, foggy, craving salt or sugar and dependent on caffeine. It is popular in alternative medicine and often comes with saliva-test panels, "adrenal support" supplements and staged protocols.

The problem is the core claim: that healthy adrenal glands run out of capacity under ordinary life stress. When researchers looked for it, they didn't find it.

---

## What does the evidence say?

| Question | What the research shows |
|---|---|
| Do stressed or tired people have "exhausted" adrenals? | No consistent evidence; a systematic review of 58 studies concluded adrenal fatigue does not exist (Cadegiani & Kater 2016) |
| Are there real adrenal diseases? | Yes — adrenal insufficiency and Cushing's syndrome, diagnosed with specific tests (Endocrine Society guidelines: Bornstein 2016, Nieman 2008) |
| Can one cortisol reading show adrenal "burnout"? | No — cortisol rises sharply after waking and falls towards evening, so a single value means little without the time of day (Stalder 2016) |
| Does stress affect cortisol at all? | Yes — sleep loss, for example, raises evening cortisol the next day (Leproult 1997); that is a normal response, not gland failure |

The review by Cadegiani & Kater searched the literature for studies that tested the adrenal function of people with fatigue or burnout. The results were contradictory, the methods were inconsistent, and no test reliably separated people labelled with "adrenal fatigue" from everyone else. A real disease would show a pattern; this didn't.

---

## Which adrenal conditions are real?

Two groups of adrenal disease are well established, with clear definitions and diagnostic tests set out in Endocrine Society clinical guidelines:

**Adrenal insufficiency (including Addison's disease).** The adrenal glands — or the pituitary signal that drives them — genuinely fail to make enough cortisol. It is uncommon, can be life-threatening if missed, and is diagnosed with blood tests such as a morning cortisol and an ACTH stimulation test, not with a symptom questionnaire (Bornstein 2016).

**Cushing's syndrome.** The opposite: long-term exposure to too much cortisol, most often from steroid medicines and more rarely from a tumour. Diagnosis needs specific tests such as late-night salivary cortisol, 24-hour urine cortisol or a dexamethasone suppression test, ordered and interpreted by a doctor (Nieman 2008).

Neither condition is "mild adrenal fatigue". They are distinct diseases, and the point of testing properly is to find or rule them out.

---

## Why do "adrenal fatigue" tests and supplements mislead?

[Cortisol](/glossary/cortisol) follows a daily rhythm: it peaks within the first hour after waking and falls to its lowest around bedtime (see [Cortisol and the stress response](/science/concepts/cortisol-and-stress-response)). It also shifts with sleep, illness, exercise and the exact time a sample is taken. So a single saliva or blood value — or a four-point saliva panel sold as an "adrenal stress test" — can look "low" or "high" for reasons that have nothing to do with gland failure.

That creates two risks:

- **A missed diagnosis.** Fatigue has many real causes — anaemia, thyroid disease, sleep apnoea, depression, diabetes, infections, medication side effects, and the real adrenal diseases above. Treating it as adrenal fatigue can delay finding the actual problem.
- **Unproven products.** "Adrenal support" supplements and protocols have no good evidence behind them for fatigue. Anything that contains steroid hormones is a medicine, not a supplement: taking steroids you don't need can suppress your own adrenal glands, and stopping them suddenly can be dangerous.

---

## Can a wearable or HRV show adrenal fatigue?

No. Watches and rings do not measure cortisol or adrenal function. [HRV](/science/concepts/heart-rate-variability) (heart rate variability) reflects how your heart rhythm is shaped by the [autonomic nervous system](/science/concepts/autonomic-nervous-system), and it moves with sleep, alcohol, illness, training and stress. A low morning HRV can be a useful nudge to take it easier, but it is not an "adrenal indicator" and can't diagnose — or rule out — any adrenal condition.

---

## What helps if you're exhausted?

Start with a check-up, then work on the basics that support the stress system:

- **See a doctor first** to rule out the treatable causes above, with proper blood tests rather than an "adrenal panel".
- **Protect sleep.** Sleep loss and stress hormones feed each other (Leproult 1997); a regular schedule of 7+ hours is the highest-yield lever.
- **Lower the load where you can.** Fewer always-on inputs, earlier caffeine, less evening alcohol and real recovery days.
- **Try calm practices if they help you.** Meditation lowered cortisol versus active controls in a meta-analysis of randomized trials (Pascoe 2017), and a small trial found lower salivary cortisol after 8 weeks of slow diaphragmatic breathing (Ma 2017). Evidence that breathing lowers cortisol is mixed and context-dependent, so treat it as support, not treatment. The [Breathing Pacer](/tools/breathing) is a simple way to practise.

If constant wired-and-tired is your normal, it may be closer to burnout than to anything adrenal — the [Burnout Self-Assessment](/tools/burnout) and our guide on [how to lower cortisol](/articles/how-to-lower-cortisol) are good next steps.

---

## When should you see a doctor?

See a doctor if you have persistent exhaustion that doesn't improve with rest, or any of these red flags:

- Unexplained weight loss, loss of appetite, nausea or vomiting
- Dizziness or fainting when you stand up, low blood pressure, or strong salt cravings
- Darkening of the skin, especially in creases, scars or gums
- Weight gain concentrated on the face, upper back and belly, wide purple stretch marks, easy bruising or muscle weakness
- New or hard-to-control high blood pressure or blood sugar
- Fatigue with low mood, loss of interest, or thoughts of self-harm — seek help promptly

Sudden severe weakness, vomiting, abdominal pain or confusion — especially if you take steroids or have known adrenal disease — is an emergency.

**If you take steroid medicines** (such as prednisolone or hydrocortisone tablets, or high-dose inhaled or injected steroids), don't stop or reduce them on your own — stopping suddenly can trigger a dangerous adrenal crisis. Talk to your prescriber first.

This article is educational, not medical advice.
`,
}

export default [article]
