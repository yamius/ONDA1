import type { Article } from './types'

/**
 * Screen / email apnea — shallow or held breath while locked into a screen; a real, low-medical
 * phenomenon that ONDA can honestly touch because it reads breathing rate live (even on camera).
 * Grounded: Linda Stone (2007, "email apnea"), ~80% exhibit it; the ~20% who don't had breath
 * training; NPR/Body Electric coverage. Firewall: not a disorder, not sleep apnea; a habit +
 * a measurable breath you can reset. Funnels to /hrv-biofeedback + live breathing.
 */
const article: Article = {
  slug: 'screen-apnea-breathing',
  title: 'Screen Apnea: You Stop Breathing at Your Desk',
  seoTitle: 'Screen Apnea (Email Apnea): The Breath You Hold | ONDA Life',
  description:
    'Screen apnea — shallow or suspended breathing while locked into a screen — affects most people and they never notice. What it does to your stress and focus, and how a measured breath breaks the freeze in a minute.',
  category: 'OS States',
  relatedSlugs: ['coherent-breathing-guide', 'box-breathing-how-it-works', 'heart-rate-variability', 'digital-dementia-attentional-control', 'vagus-nerve'],
  introStyle: 'blue',
  neuralSuggestion: {
    text: 'The freeze is invisible until something shows you your own breath. Then it’s impossible to unsee.',
    link: '/hrv-biofeedback',
    linkText: 'See your breath live →',
  },
  content: `
## [ CASE FILE: THE HELD BREATH ]

> "You've been answering email for forty minutes. When did you last take a full breath? You genuinely don't know — and that's the whole phenomenon.

> It has a name. In 2007 a former tech executive named Linda Stone noticed that when people opened their inbox, their breathing went shallow or stopped entirely. She called it **email apnea** — later broadened to **screen apnea** — and when she looked closer, roughly **80% of people did it.** The other 20%? Musicians, athletes, people who'd been trained to breathe. The freeze is nearly universal, and almost nobody feels it happen."

---

## Section 1: What screen apnea is (and isn't)

Screen apnea is the unconscious tendency to hold or shorten your breath while concentrating on a device — email, a spreadsheet, an endless feed. It is a *habit of attention*, triggered by low-grade stress and the forward-leaning posture of screen focus. It is **not** sleep apnea, and it is **not** a medical disorder — don't let anyone tell you it is. It's a behavioural pattern, and that's good news, because behavioural patterns respond to attention and practice.

What makes it sneaky is that it's silent and invisible from the inside. You don't notice a breath you didn't take.

---

## Section 2: Why a held breath ripples outward

Breathing isn't just gas exchange — it's a lever on your whole autonomic state. When you unconsciously freeze the breath, a few things follow. CO₂ drifts, the body reads the shallow, stalled pattern as mild threat, and [sympathetic](/glossary/sympathetic-nervous-system) tone edges up. Do that for hours a day and you're marinating in a low, self-inflicted stress signal — which is exactly why screen apnea is linked to more tension, more fatigue and worse concentration over a working day.

The irony is sharp: the shallow breathing you fall into *while* focusing quietly undermines the focus you're trying to protect.

---

## Section 3: The breath is the fix — because it's the one you can control

Here's the leverage. Breathing is the only autonomic function with a manual override, and it back-propagates to the rest of the system. You can't consciously lower a stress-tightened pulse — but you can take one slow, full, longer-on-the-exhale breath, and the [parasympathetic](/glossary/parasympathetic-nervous-system) branch responds within seconds via the [vagus nerve](/glossary/vagus-nerve). A single deliberate minute resets the pattern the screen imposed.

That's why the 20% who *don't* get screen apnea are the trained breathers. They're not more disciplined about email. They've built a breathing default that holds even under focus — and that default is trainable.

---

## Section 4: Making the invisible breath visible

You can't fix a breath you can't feel — so the first move is to *see* it. ONDA reads your breathing rate live during a practice, even from the phone camera, and (with an Apple Watch) shows your heart rhythm organising into [coherence](/glossary/coherence) as you slow down. Watch your own [breathing](/measurements) on screen and the freeze becomes undeniable — and so does the recovery, in real time, in [HRV biofeedback](/hrv-biofeedback). A minute of measured breathing between tasks isn't a wellness nicety; it's a reset for a pattern you'd otherwise repeat all day without noticing.

Honest framing: this is a self-regulation practice, not a treatment for any breathing disorder, and ONDA is not a medical device. If you have real concerns about your breathing — especially during sleep — that's a conversation for a clinician.

---

## Section 5: Building a breath that holds under focus

The goal isn't to breathe consciously all day — it's to raise your unconscious default so the freeze stops happening. Anchor short, deliberate breaths to your screen habits: one full breath before you open the inbox, a slow minute between meetings, a [coherent-breathing](/articles/coherent-breathing-guide) or [box-breathing](/articles/box-breathing-how-it-works) reset when you catch the tension climbing. Do it enough and the trained default starts carrying itself into the deep-focus stretches where you used to hold your breath. For the attention side of the same screen problem, see [digital dementia and attentional control](/articles/digital-dementia-attentional-control).

> **The Hack:** Set one trigger — before you open email, take a single slow breath with a longer exhale than inhale. It's the smallest possible intervention against the most common screen habit, and repeated daily it retrains the unconscious default that made you freeze in the first place.

> [ SYSTEM_STATUS ]
> PHENOMENON: shallow/held breath while screen-focused (~80% of people)
> COST: rising sympathetic tone → tension, fatigue, worse focus
> OVERRIDE: one slow exhale-led breath → vagal reset in seconds
> FIX: see it live, retrain the default — PRACTICE, NOT TREATMENT
`,
  howToSteps: [
    {
      name: 'Notice the freeze exists',
      text: 'Screen apnea — shallow or suspended breathing while focused on a device — affects most people and is invisible from the inside. It’s a habit of attention, not a disorder; naming it is the first step.',
      protocolId: 'screen-notice',
    },
    {
      name: 'Anchor a breath to a screen trigger',
      text: 'Attach one deliberate breath to a recurring cue — before opening email, between meetings. A single slow breath with a longer exhale resets the pattern the screen imposed.',
      protocolId: 'screen-anchor',
    },
    {
      name: 'See your own breath to make it real',
      text: 'You can’t fix a breath you can’t feel. Watch your breathing rate live during a practice so the freeze — and the recovery — become undeniable, which is what makes the habit stick.',
      protocolId: 'screen-see',
    },
    {
      name: 'Retrain the unconscious default',
      text: 'The goal isn’t to breathe consciously all day but to raise your baseline breathing so the freeze stops happening. Short daily coherent- or box-breathing sessions build a default that holds under focus.',
      protocolId: 'screen-retrain',
    },
  ],
}

export default [article]
