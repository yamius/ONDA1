import type { Article } from './types'

/**
 * How to Lower Cortisol — wedge companion guide.
 * Targets the hot "lower cortisol / cortisol detox / cortisol face" queries with
 * an honest debunk + what actually works, funnelling to breathing/NS/sleep tools.
 */
const article: Article = {
  slug: 'how-to-lower-cortisol',
  title: 'How to Lower Cortisol: What Actually Works',
  seoTitle: 'How to Lower Cortisol (and the Detox Myth) | ONDA Life',
  description:
    'You can’t "detox" cortisol — but you can lower chronically high levels. The evidence-based levers: sleep, slow breathing, movement and stress load. Here’s how.',
  category: 'ONDA Protocol',
  relatedSlugs: ['cortisol', 'circadian-rhythm', 'homeostasis', 'sympathetic-nervous-system', 'parasympathetic-nervous-system'],
  introStyle: 'amber',
  image: '/images/tools/burnout.png',
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
    { name: 'Fix sleep first', text: 'Protect 7–9 hours on a consistent schedule; poor sleep dysregulates the HPA axis and keeps cortisol elevated.', protocolId: 'cortisol-sleep' },
    { name: 'Breathe slowly, daily', text: 'A few minutes of slow, long-exhale breathing shifts you toward parasympathetic dominance and lowers measured cortisol.', protocolId: 'cortisol-breath' },
    { name: 'Move — but don’t overtrain', text: 'Regular moderate exercise lowers baseline stress reactivity; chronic over-training does the opposite.', protocolId: 'cortisol-move' },
    { name: 'Cut the inputs that spike it', text: 'Late caffeine, alcohol, doomscrolling and chronic overload all push cortisol up — trim them before chasing supplements.', protocolId: 'cortisol-inputs' },
  ],
  content: `
## [ ANALYZING THE STRESS HORMONE ]

> "Cortisol is having a moment online — blamed for belly fat, 'cortisol face', poor sleep and general malaise, with a 'cortisol detox' sold as the fix. Let's be clear up front: cortisol is not a toxin, you can't 'detox' it, and it's not the villain. It's your primary stress and wake-up hormone — it gets you out of bed, mobilises energy and dampens inflammation. The real problem isn't cortisol; it's *chronically elevated* cortisol from a system that never gets the signal to stand down. You don't cleanse it. You regulate it."

---

## Section 1: What cortisol actually does

[Cortisol](/glossary/cortisol) follows a daily [circadian](/glossary/circadian-rhythm) curve: it peaks in the first hour after waking (the cortisol awakening response) and tapers to a low at night so you can sleep. That rhythm is healthy and necessary. Trouble starts when chronic stress, poor sleep or constant stimulation flatten or elevate the curve — keeping the [sympathetic](/glossary/sympathetic-nervous-system) "fight-or-flight" system switched on when it should be off.

So the goal is not "low cortisol." It's a *well-shaped* cortisol rhythm — high in the morning, low at night — which is really a question of restoring [homeostasis](/glossary/homeostasis), not detoxing.

---

## Section 2: The "cortisol detox" myth

There is no diet, supplement or juice that "flushes" cortisol. The viral "cortisol detox" and "cortisol face" content vastly overstates what food can do and invents a mechanism that doesn't exist — major clinical sources are blunt that lifestyle, not a detox, is what moves cortisol. Genuinely high cortisol from a medical cause (Cushing's syndrome) is rare and needs a doctor, not a smoothie. For everyday stress-driven elevation, the levers below are the real ones.

---

## Section 3: What actually lowers it

### PROTOCOL 1: Sleep Is the Master Lever

> **The Hack:** Protect 7–9 hours on a consistent schedule; treat sleep as non-negotiable.

**The Science:** Sleep and the stress axis are tightly coupled — sleep loss dysregulates the HPA axis and pushes cortisol up, which in turn wrecks sleep, a self-feeding loop (Hirotsu 2015). Fixing sleep is the highest-yield move. Time your last [caffeine](/tools/caffeine) early and wind down with [a cycle-aligned bedtime](/tools/sleep-cycle).

### PROTOCOL 2: Slow Breathing and Meditation

> **The Hack:** A few minutes a day of slow, long-exhale breathing or meditation.

**The Science:** A meta-analysis of 45 studies found meditation measurably reduces cortisol along with blood pressure and resting heart rate (Pascoe 2017). The [Breathing Pacer](/tools/breathing) and the [Nervous System State quiz](/tools/nervous-system) put this into practice.

### PROTOCOL 3: Move Without Overtraining

> **The Hack:** Regular moderate exercise (Zone 2, walking, strength) — but don't bury yourself in chronic high intensity.

**The Logic:** Moderate activity lowers stress reactivity over time; relentless over-training is itself a chronic stressor that keeps cortisol elevated. Balance load with recovery.

### PROTOCOL 4: Trim the Cortisol-Spiking Inputs

> **The Hack:** Cut late caffeine and alcohol, doomscrolling and always-on work before reaching for adaptogens.

**The Logic:** The basics outperform supplements. Remove the chronic inputs keeping the system switched on, and the rhythm largely self-corrects.

> [ HARDWARE_VALIDATION ]
> VALIDATION_DEVICE: Sleep + HRV tracker / how you feel on waking
> METRIC: Steadier energy, better sleep, calmer baseline over weeks
> STATUS: HPA_AXIS_REREGULATED

---

If chronically wired-and-tired is your normal, it may be tipping toward burnout — the [Burnout Self-Assessment](/tools/burnout) is a good next check. And persistent symptoms (unexplained weight changes, very high blood pressure, severe fatigue) deserve a doctor, not a detox. This is educational, not medical advice.
`,
}

export default [article]
