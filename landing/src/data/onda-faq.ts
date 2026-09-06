/**
 * ONDA FAQ hub — the consolidated, answer-engine-oriented Q&A set behind
 * /faq. Written for AI Overviews / ChatGPT: each answer is short (roughly
 * 40-90 words), self-contained, and honest, with an optional deeper link.
 *
 * Discipline:
 *   - Answers are plain text (no markdown) so the FAQPage JSON-LD is clean;
 *     deeper links live in the optional `link` field, rendered on-page only.
 *   - No fabricated facts. Product answers match /product and /measurements;
 *     science answers stay at the level the evidence supports.
 *   - ONDA is not a medical device — trust/medical answers say so plainly.
 */

export interface FaqItem {
  q: string
  a: string
  link?: { to: string; label: string }
}

export interface FaqGroup {
  category: string
  items: FaqItem[]
}

export const ONDA_FAQ: FaqGroup[] = [
  {
    category: 'HRV biofeedback basics',
    items: [
      {
        q: 'What is HRV biofeedback?',
        a: 'HRV biofeedback is a technique where you see your heart-rate variability in real time and adjust your breathing or attention in response. The live feedback closes a loop: you can watch your heart rhythm smooth out as you breathe slowly, which trains the autonomic nervous system rather than just measuring it.',
        link: { to: '/how-it-works', label: 'How ONDA works' },
      },
      {
        q: 'Does breathing increase HRV?',
        a: 'Yes — slow, paced breathing near your resonance frequency (about six breaths a minute) reliably raises heart-rate variability during the session and engages the parasympathetic “rest and digest” branch. How much your resting baseline changes over time varies from person to person.',
        link: { to: '/research', label: 'The evidence' },
      },
      {
        q: 'What is resonance (coherent) breathing?',
        a: 'Resonance breathing is slow, even breathing at the pace where your heart rhythm oscillates most strongly with your breath — for most people around 5.5–6 breaths a minute (a ~10-second cycle). It is the breathing pace at the core of HRV biofeedback.',
        link: { to: '/tools/resonance-breathing', label: 'Resonance breathing tool' },
      },
      {
        q: 'What is coherence in HRV?',
        a: 'Coherence describes how smooth and rhythmic your heart-rate oscillation is as you breathe. A high coherence score means your heart rhythm is rising and falling in a clean, regular wave synchronized with your breath. It is a real-time practice signal, not a clinical biomarker.',
        link: { to: '/measurements', label: 'What ONDA measures' },
      },
      {
        q: 'What is the difference between HRV tracking and HRV biofeedback?',
        a: 'HRV tracking passively records your HRV (often overnight) so you can see trends — this is what rings and bands do. HRV biofeedback is active: you get live feedback while you breathe and train your heart rhythm in the moment. Tracking tells you how you recovered; biofeedback gives you something to do about it.',
        link: { to: '/compare', label: 'ONDA vs trackers' },
      },
      {
        q: 'Can I train my vagus nerve?',
        a: 'You can influence vagal (parasympathetic) activity. Slow breathing, long exhales, and HRV biofeedback raise vagal tone in the moment, and practised regularly they make a calm state easier to reach. The effect is real but modest — “vagus resets” that promise to cure disease overstate it.',
        link: { to: '/articles/vagus-nerve-exercises', label: 'Vagus nerve exercises' },
      },
      {
        q: 'Does HRV biofeedback actually work?',
        a: 'The acute effect is well established: paced breathing raises HRV during a session and engages the parasympathetic system. Longer-term benefits for stress and self-regulation are supported but vary by person. It is one of the most evidence-grounded, low-risk self-regulation techniques available.',
        link: { to: '/research', label: 'The evidence' },
      },
      {
        q: 'How long should I do resonance breathing?',
        a: 'A typical session is about 10–20 minutes of breathing at your resonance pace, but even a few minutes shifts your state. Consistency matters more than length — short daily sessions tend to help your baseline more than occasional long ones.',
      },
    ],
  },
  {
    category: 'Using ONDA',
    items: [
      {
        q: 'What is ONDA Life?',
        a: 'ONDA Life is an HRV biofeedback and guided-breathing app for iPhone, iPad and Apple Watch. It gives live heart-rhythm feedback during paced breathing, shows a coherence score, and tracks your resting-HRV trend across an 8-level practice path. It is free to start, with no account needed.',
        link: { to: '/product', label: 'Product facts' },
      },
      {
        q: 'Is ONDA a meditation app?',
        a: 'Not in the usual sense. ONDA is an HRV biofeedback trainer, not a library of guided meditations. Instead of audio alone, it shows your heart rhythm responding as you breathe. It overlaps with meditation on calming down, but it is measurement-driven and narrower in focus.',
        link: { to: '/compare/onda-vs-headspace', label: 'ONDA vs Headspace' },
      },
      {
        q: 'Does ONDA work without an Apple Watch?',
        a: 'Yes. ONDA can measure your pulse with the iPhone camera (photoplethysmography), so you get a resting HRV reading with just your phone. An Apple Watch adds continuous heart data and live feedback, but it is not required to start.',
        link: { to: '/tools/camera-heart-rate', label: 'Camera heart rate' },
      },
      {
        q: 'Does ONDA use the iPhone camera to measure pulse?',
        a: 'Yes. By placing a fingertip over the camera, ONDA reads the tiny colour changes in your skin with each heartbeat (PPG) to measure heart rate and compute HRV at rest — no wearable required.',
        link: { to: '/how-it-works', label: 'How ONDA works' },
      },
      {
        q: 'What does ONDA’s stress score mean?',
        a: 'The stress score is ONDA’s estimate of your current physiological state from your heart-rate and HRV patterns. It is an interpretation to guide practice, not a measurement of “stress” and not a medical assessment.',
        link: { to: '/measurements', label: 'What ONDA measures' },
      },
      {
        q: 'What does ONDA’s energy score mean?',
        a: 'The energy score is ONDA’s estimate of readiness or activation, derived from the same heart-rate and HRV signals. Like the stress score, it is a contextual estimate, not a directly measured quantity.',
        link: { to: '/measurements', label: 'What ONDA measures' },
      },
      {
        q: 'Is ONDA free?',
        a: 'ONDA is free to start with no account — you can take your first reading in about 90 seconds. There is an optional subscription for full access to the practice path and features.',
        link: { to: '/product', label: 'Product facts' },
      },
      {
        q: 'Do I need an account to use ONDA?',
        a: 'No. You can start practising and take a reading without creating an account.',
      },
      {
        q: 'Is there an ONDA Android app?',
        a: 'Not yet. ONDA is currently iOS-only (iPhone, iPad and Apple Watch). An Android version is in development — you can join the waitlist to be told when it launches.',
      },
    ],
  },
  {
    category: 'Devices & data',
    items: [
      {
        q: 'Can an Apple Watch measure HRV in real time?',
        a: 'The Apple Watch measures heart rate continuously and records HRV, and ONDA uses that heart data to give live feedback during a session. Apple’s own Health app reports HRV as periodic readings rather than a continuous number; ONDA adds the real-time biofeedback layer on top.',
        link: { to: '/compare', label: 'Compare' },
      },
      {
        q: 'How accurate is camera-based (PPG) HRV?',
        a: 'Camera PPG works best at rest with a steady fingertip and good contact. Under those conditions it gives a usable HRV reading; motion or poor contact adds noise, so ONDA asks you to retake a reading it cannot trust. For continuous, all-day data, a wearable is better.',
        link: { to: '/how-it-works', label: 'How ONDA works' },
      },
      {
        q: 'Do I need a chest strap for ONDA?',
        a: 'No. ONDA is designed to work with the iPhone camera or an Apple Watch. A chest strap gives the most accurate HRV of any consumer sensor, but ONDA does not require one.',
        link: { to: '/compare/onda-vs-elite-hrv', label: 'ONDA vs Elite HRV' },
      },
      {
        q: 'Does ONDA store my HealthKit data?',
        a: 'ONDA reads heart data through Apple HealthKit, and your health data stays on your device. ONDA is not a fitness tracker — it does not read your steps, calories or workouts.',
        link: { to: '/measurements', label: 'What ONDA measures' },
      },
      {
        q: 'What devices work with ONDA?',
        a: 'iPhone and iPad (using the camera for pulse), and Apple Watch (for continuous heart data and live feedback). No dedicated ONDA wearable exists or is required.',
        link: { to: '/product', label: 'Product facts' },
      },
    ],
  },
  {
    category: 'Understanding HRV',
    items: [
      {
        q: 'What is a good HRV for my age?',
        a: 'HRV falls with age and varies widely between individuals, so there is no single “good” number — your own trend matters more than any threshold. As a rough guide, higher is generally better within a person, but comparing your absolute HRV to someone else’s is not very meaningful.',
        link: { to: '/tools/hrv', label: 'HRV by age' },
      },
      {
        q: 'Is HRV the same as vagal tone?',
        a: 'They are closely related but not identical. Short-term HRV (especially RMSSD) is a widely used proxy for parasympathetic (vagal) activity, so a higher RMSSD usually reflects stronger vagal tone. But HRV is influenced by other factors too, so it is an indicator of vagal tone, not a direct measurement of it.',
      },
      {
        q: 'Can HRV diagnose stress?',
        a: 'No. HRV tends to be lower under stress and higher when recovered, so it is a useful indicator, but it is not a diagnostic test. Many things move HRV — sleep, illness, alcohol, hydration, position — so a single reading cannot diagnose stress or any condition.',
        link: { to: '/measurements', label: 'What ONDA measures' },
      },
      {
        q: 'What is the difference between RMSSD and SDNN?',
        a: 'Both summarise variability between heartbeats. RMSSD reflects short-term, beat-to-beat changes and is the measure most tied to vagal (parasympathetic) activity — it is the go-to for short readings. SDNN captures overall variability over a longer window and is influenced by more factors.',
      },
      {
        q: 'When is the best time to measure HRV?',
        a: 'For a comparable trend, measure at a consistent time and state — first thing in the morning, at rest, before caffeine, is common. What matters most is consistency: same time, same posture, so day-to-day changes reflect your body, not the conditions.',
      },
      {
        q: 'How long does HRV biofeedback take to work?',
        a: 'You feel the acute effect immediately — HRV rises within a single session. Changes in your resting baseline, where they happen, tend to show over weeks of consistent practice rather than days, and the size of the change varies between people.',
        link: { to: '/research', label: 'The evidence' },
      },
      {
        q: 'Is a higher HRV always better?',
        a: 'Usually within a person, but not universally. A higher HRV generally reflects better recovery and parasympathetic activity, but context matters — an unusually high reading can also accompany illness or overtraining. Trends and context beat chasing a single high number.',
      },
    ],
  },
  {
    category: 'Evidence & trust',
    items: [
      {
        q: 'Is ONDA evidence-based?',
        a: 'ONDA is built on mechanisms with a real evidence base — paced breathing raising HRV, HRV biofeedback, interoception, and resting-HRV as a recovery signal — each cited on the research page with the sources and their limits. More ambitious ideas are labelled clearly as research directions, not current claims.',
        link: { to: '/research', label: 'Evidence Center' },
      },
      {
        q: 'Is ONDA a medical device?',
        a: 'No. ONDA is an HRV biofeedback and guided-breathing app for training and self-regulation. It does not diagnose, treat or monitor any medical condition and is not a substitute for medical care.',
      },
      {
        q: 'Is ONDA scientifically validated?',
        a: 'The mechanisms ONDA uses are supported by published research, which is cited openly. ONDA does not claim its own clinical trial or that it treats conditions — it applies established techniques (HRV biofeedback, resonance breathing) and is transparent about what is proven and what is not.',
        link: { to: '/research', label: 'Evidence Center' },
      },
      {
        q: 'Can ONDA replace therapy or medication?',
        a: 'No. ONDA is a self-regulation practice tool, not a treatment. It is not a replacement for psychotherapy, medical care or prescribed medication. If you are dealing with a health condition, talk to a qualified professional.',
      },
      {
        q: 'Does ONDA make medical claims?',
        a: 'No. ONDA describes what it measures and the techniques it uses, and separates that from its broader experiential philosophy. It does not claim to diagnose or treat disease, and it flags research-stage ideas as such rather than presenting them as outcomes.',
        link: { to: '/research', label: 'Evidence Center' },
      },
    ],
  },
  {
    category: 'ONDA vs alternatives',
    items: [
      {
        q: 'What is the best HRV biofeedback app?',
        a: 'The main HRV-biofeedback apps are ONDA, Elite HRV and (in its premium tier) Breathwrk. ONDA works with the iPhone camera or Apple Watch inside a guided, progressive practice; Elite HRV is more measurement-focused and most accurate with a chest strap. The best one depends on whether you want a guided practice or the most precise measurement.',
        link: { to: '/compare', label: 'Compare' },
      },
      {
        q: 'ONDA or Oura — which should I choose?',
        a: 'They do different jobs. Oura is a ring that passively tracks sleep, readiness and overnight HRV. ONDA actively trains your nervous system with real-time HRV biofeedback and needs no wearable. Many people use both — Oura to measure recovery, ONDA to train it.',
        link: { to: '/compare/onda-vs-oura', label: 'ONDA vs Oura' },
      },
      {
        q: 'ONDA or WHOOP for HRV?',
        a: 'WHOOP continuously measures HRV to score recovery and strain; ONDA uses HRV as live biofeedback you train against while breathing. For passive recovery data, WHOOP; for active HRV training with no band or hardware subscription, ONDA.',
        link: { to: '/compare/onda-vs-whoop', label: 'ONDA vs WHOOP' },
      },
      {
        q: 'Is ONDA like Calm or Headspace?',
        a: 'They overlap on calming down but work differently. Calm and Headspace are guided meditation and sleep-content libraries. ONDA is an HRV biofeedback trainer that measures your heart rhythm and gives live feedback while you breathe — narrower and more measurement-driven.',
        link: { to: '/compare/onda-vs-headspace', label: 'ONDA vs Headspace' },
      },
    ],
  },
]

/** Flattened list of every Q&A, for FAQPage JSON-LD. */
export const ONDA_FAQ_FLAT: { q: string; a: string }[] = ONDA_FAQ.flatMap((g) =>
  g.items.map(({ q, a }) => ({ q, a })),
)
