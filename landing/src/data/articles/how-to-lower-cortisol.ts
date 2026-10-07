import type { Article } from './types'

/**
 * How to Lower Cortisol — wedge companion guide.
 * Targets the hot "lower cortisol / cortisol detox / cortisol face" queries with
 * an honest debunk + what actually works, funnelling to breathing/NS/sleep tools.
 * 2026-10 upgrade: answer-first, evidence table, Pascoe 2017 described accurately (45 RCTs vs active
 * control), Ma 2017 added for breathing, unsourced exercise/caffeine-cortisol claims softened,
 * Cushing’s/Addison’s signs + don’t-stop-steroids note.
 */
const article: Article = {
  slug: 'how-to-lower-cortisol',
  title: 'How to Lower Cortisol: What Actually Works',
  seoTitle: 'How to Lower Cortisol (and the Detox Myth) | ONDA Life',
  description:
    'You can’t "detox" cortisol. Sleep, meditation, slow breathing and less stress load lower stress-driven cortisol. What works and when to see a doctor.',
  category: 'ONDA Protocol',
  relatedSlugs: ['cortisol', 'circadian-rhythm', 'homeostasis', 'sympathetic-nervous-system', 'parasympathetic-nervous-system'],
  introStyle: 'amber',
  image: '/images/how-to-lower-cortisol.png',
  imageAlt:
    'How to lower cortisol: evidence-based ways to reduce chronically high stress-hormone levels — sleep, slow breathing, movement — and why cortisol detox is a myth.',
  imageTitle: '[STRESS_HORMONE_REGULATION]: Lowering chronically elevated cortisol the way that actually works.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Find out if your stress load is tipping into burnout — and what to do first.',
    link: '/tools/burnout',
    linkText: 'Burnout Self-Assessment →',
  },
  howToSteps: [
    { name: 'Fix sleep first', text: 'Aim for at least 7 hours on a consistent schedule; sleep loss and the stress axis feed each other, so sleep is the highest-yield lever.', protocolId: 'cortisol-sleep' },
    { name: 'Meditate or breathe slowly, daily', text: 'Meditation lowered cortisol versus active controls in a meta-analysis of randomized trials, and an 8-week slow diaphragmatic breathing program lowered salivary cortisol in a small trial.', protocolId: 'cortisol-breath' },
    { name: 'Move — and recover', text: 'Regular moderate activity supports sleep and stress resilience; balance hard training with rest days.', protocolId: 'cortisol-move' },
    { name: 'Trim the inputs that keep you switched on', text: 'Late caffeine, evening alcohol, late-night screens and constant overload disturb sleep and keep stress high — trim them before buying supplements.', protocolId: 'cortisol-inputs' },
  ],
  content: `
You can’t "detox" cortisol, and you don’t need to: cortisol is a normal hormone that should rise in the morning and fall at night. What you can change is stress-driven cortisol that stays high — and the best-supported levers are sleep, regular meditation or slow-breathing practice, sensible exercise and a lighter stress load. A meta-analysis of 45 randomized trials found that meditation reduced cortisol, blood pressure and heart rate compared with active control activities (Pascoe 2017), while no diet, supplement or "cortisol detox" has comparable evidence.

---

## What does cortisol actually do?

[Cortisol](/glossary/cortisol) is your main stress and wake-up hormone: it mobilises energy, helps regulate blood pressure and dampens inflammation. It follows a daily [circadian](/glossary/circadian-rhythm) curve — a sharp rise in the first hour after waking (the cortisol awakening response), then a gradual fall to its lowest around bedtime so you can sleep. Problems start when chronic stress or poor sleep keep it elevated or flatten that curve, keeping the [sympathetic](/glossary/sympathetic-nervous-system) "fight-or-flight" system switched on when it should be off.

So the goal isn’t "low cortisol". It’s a well-shaped rhythm — higher in the morning, low at night — which is really about restoring [homeostasis](/glossary/homeostasis).

---

## Does a "cortisol detox" work?

No — there is no diet, juice or supplement shown to "flush" cortisol, and cortisol isn’t a toxin to be cleansed. Viral "cortisol detox" and "cortisol face" content overstates what food can do. Genuinely high cortisol from a medical cause, such as Cushing’s syndrome, is uncommon and needs a doctor and proper tests, not a smoothie. For everyday stress-driven elevation, the levers below are the real ones.

---

## What actually lowers cortisol?

The levers with the best support are sleep, meditation or [slow breathing](/science/evidence/slow-breathing), balanced exercise and fewer chronic stressors.

| Lever | What to do | Evidence |
|---|---|---|
| **Sleep** | 7+ hours on a consistent schedule | Sleep loss and stress-axis activity reinforce each other (Hirotsu 2015, review) |
| **Meditation** | Daily focused-attention practice | Lowered cortisol vs active controls across RCTs (Pascoe 2017, meta-analysis) |
| **Slow breathing** | Regular diaphragmatic breathing practice | Lower salivary cortisol after 8 weeks in one small RCT (Ma 2017) |
| **Movement** | Moderate activity, with recovery days | Supports sleep and general health; little direct cortisol evidence |
| **Fewer inputs** | Earlier caffeine, less evening alcohol, fewer late screens | Mainly works by protecting sleep |

### Is sleep the most important lever?

Sleep is the best place to start because sleep and the stress axis are tightly linked: sleep loss is associated with HPA-axis disruption and higher cortisol, which in turn makes sleep worse — a self-reinforcing loop (Hirotsu 2015). Time your last [caffeine](/tools/caffeine) early and wind down with [a cycle-aligned bedtime](/tools/sleep-cycle).

### Do meditation and slow breathing lower cortisol?

Yes, the evidence is reasonable. Pascoe 2017 pooled 45 randomized trials that compared meditation with an active control: focused-attention meditation reduced cortisol, and meditation overall reduced cortisol, blood pressure, heart rate and some inflammation markers. For breathing specifically, a small randomized trial of 40 adults found that 20 sessions of slow diaphragmatic breathing over 8 weeks lowered salivary cortisol, while the control group didn’t change (Ma 2017). The [Breathing Pacer](/tools/breathing) and the [Nervous System State quiz](/tools/nervous-system) put this into practice.

### Does exercise help or hurt?

Regular moderate activity — walking, Zone 2, strength work — generally supports sleep and stress resilience. Hard exercise briefly raises cortisol, which is a normal response; the problem is relentless hard training without recovery. Balance load with rest days.

### What should you cut first?

Cut the inputs that keep you switched on before reaching for adaptogens: late caffeine, evening alcohol, doomscrolling in bed and always-on work. Most of these act by eroding sleep, the master lever.

> [ HARDWARE_VALIDATION ]
> EXAMPLE_DEVICE: Sleep + HRV tracker / how you feel on waking
> METRIC: Steadier energy, better sleep, calmer baseline over weeks
> STATUS: HPA_AXIS_REREGULATED

---

## When should you see a doctor about cortisol?

See a doctor if you have signs that could point to a hormonal condition rather than everyday stress. Possible signs of too much cortisol (Cushing’s syndrome) include weight gain concentrated on the face, upper back and belly, wide purple stretch marks, easy bruising, muscle weakness, and new or hard-to-control high blood pressure or blood sugar. Possible signs of too little (Addison’s disease or other adrenal insufficiency) include persistent fatigue, weight loss, dizziness on standing, salt cravings, nausea and darkening skin; sudden severe weakness, vomiting or confusion is an emergency.

**If you take steroid medicines** (such as prednisolone or hydrocortisone tablets, or high-dose inhaled or injected steroids), don’t stop or reduce them to "lower cortisol" — stopping suddenly can trigger a dangerous adrenal crisis. Talk to your prescriber first.

If chronically wired-and-tired is your normal, it may be tipping toward burnout — the [Burnout Self-Assessment](/tools/burnout) is a good next check. This is educational, not medical advice.
`,
}

export default [article]
