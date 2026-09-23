import type { Article } from './types'

/**
 * Chronotherapy — light/dark/sleep-timing as clinical treatment for mood & sleep (German-speaking
 * psychiatry): bright light therapy (first-line for SAD), wake therapy (single supervised night →
 * rapid antidepressant, fragile → "triple chronotherapy"), dark therapy (mania/rapid cycling), sleep-
 * phase + social-rhythm. MEDICAL topic — heavily caveated: educational, clinical-only, NOT treatment
 * advice, see a professional. Everyday scaled-down habits are the takeaway. ONDA tie-in = rhythm data only.
 */
const article: Article = {
  slug: 'chronotherapy-light-dark-timing',
  title: 'Chronotherapy: Treating Mood and Sleep with Light, Dark, and Timing',
  seoTitle: 'Chronotherapy: Light, Dark & Sleep Timing | ONDA Life',
  description:
    'Chronotherapy uses light, darkness, and the timing of sleep to reset the body clock and treat mood and sleep disorders. The German clinical tradition behind it — including wake therapy.',
  category: 'Biological Software',
  relatedSlugs: ['circadian-lighting-dark-therapy', 'social-jet-lag-irregular-sleep', 'circadian-reset-mastering-light', 'hrv-harmony-of-rhythms', 'wind-down-before-sleep-breathing'],
  introStyle: 'indigo',
  neuralSuggestion: {
    text: 'The everyday version of chronotherapy: bright morning light, dim evenings, a regular sleep clock. See your own rhythm respond.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
Chronotherapy is a set of treatments that use light, darkness, and the timing of sleep — rather than medication — to reset the body clock and improve mood and sleep. Well established in German-speaking psychiatry, it rests on a simple insight: because your circadian rhythm shapes mood, sleep, and even heart rate, deliberately manipulating that rhythm can produce fast clinical improvements. The best-known form is bright light therapy, the first-choice treatment for winter depression. But the field is broader and more surprising than most people realize — it includes *wake therapy* (a single night of controlled sleep deprivation that can lift depression rapidly) and *dark therapy* (extended darkness used to calm mania). These are clinical tools, not casual life hacks — but the principle behind them explains why your own daily light and sleep timing matters so much.

## The core idea: your body clock as a lever

Your circadian rhythm — the roughly 24-hour internal clock set mainly by light — governs far more than when you feel sleepy. It shapes your mood, hormone cycles (like cortisol and melatonin), body temperature, and [heart rate variability, which is itself substantially driven by the circadian clock](/articles/hrv-harmony-of-rhythms). In many mood disorders, this clock is disturbed: sleep timing drifts, rhythms desynchronize, and the disruption feeds back into the illness, especially in the dark months.

Chronotherapy turns that relationship into treatment. If a disturbed clock worsens mood, then *correcting the clock* — with precisely timed light, dark, or sleep changes — can improve it. German and Swiss chronobiology has developed this into structured clinical protocols with good antidepressant and mood-stabilizing effects.

## Light therapy — the well-known one

Bright light therapy is the first-choice treatment for seasonal affective disorder (SAD, or winter depression), and it also helps some non-seasonal depression and sleep disorders. The mechanism is direct: bright light in the morning, hitting specialized light-sensitive cells in the eye, advances and stabilizes the body clock and suppresses melatonin, producing an activating, mood-lifting effect. Timing is everything — the same light at the wrong circadian moment can shift the clock the wrong way, which is why clinicians calculate exposure relative to a person's own rhythm. The everyday, non-clinical version is simply [getting bright morning light and dimming the evening](/articles/circadian-lighting-dark-therapy).

## Wake therapy — the surprising one

Here's the counterintuitive part. *Wake therapy* — deliberately staying awake for a night under clinical supervision — can produce a rapid antidepressant effect, sometimes within hours, in people with depression. It sounds backwards: sleep deprivation usually harms mood. But in depression, a single controlled night without sleep can reset something in the disturbed circadian and sleep-homeostatic system, lifting mood quickly. The effect is often fragile — a night of recovery sleep can undo it — which is why it's combined with light therapy and a sleep-phase advance into "triple chronotherapy" to make the improvement stick. **This is strictly a clinical intervention, done under supervision — not something to attempt on your own** — but it's a vivid demonstration of how powerfully sleep timing influences mood.

## Dark therapy and timing

The mirror image of light therapy is *dark therapy*: extended darkness (or blocking blue light) used to calm mania and help stop "rapid cycling" — rapid switching between depression and mania in bipolar disorder. And beyond light and dark, chronotherapy includes shifting the sleep phase (moving bedtime and wake time to realign the clock) and interpersonal social rhythm therapy, which stabilizes daily social timekeepers — regular meals, activity, and sleep — to prevent mood episodes. The common thread is that *when* things happen, not just what, is treated as medicine.

## What this means for you

You're not going to do clinical chronotherapy on your own — but the same principles scale down into everyday habits that support your body clock:

- **Get bright light early.** Morning light is the strongest signal to anchor and advance your clock — the everyday version of light therapy.
- **Dim light in the evening.** Reducing bright and blue light at night is a gentle form of dark therapy that protects melatonin and sleep, and pairs well with a [slow wind-down before bed](/articles/wind-down-before-sleep-breathing).
- **Keep sleep timing regular.** Stabilizing your bedtime and wake time is the accessible version of sleep-phase and social-rhythm work — and the single most protective habit for mood and rhythm. It's also the antidote to [social jet lag](/articles/social-jet-lag-irregular-sleep).
- **Respect the timing, not just the amount.** When you sleep and see light matters as much as how much — the core lesson of chronotherapy.

Clinical chronotherapy is a medical treatment: this article is educational, not treatment advice. For a mood or sleep disorder, work with a qualified professional — the everyday light-and-timing habits above sit alongside proper care, never in place of it.

## See your own rhythm

Your circadian health shows up in your body's data — resting heart rate, HRV, and sleep timing all follow the clock. ONDA reads these from your Apple Watch and builds your personal baseline, so a drifting rhythm or a run of poorly timed nights shows up as a real shift in your numbers. Seeing it makes the abstract idea of "body clock" concrete and trackable — a mirror on your own rhythm, not a diagnosis.
`,
}

export default [article]
