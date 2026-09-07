/**
 * ONDA "top X" round-ups — ONDA Life's OWN ranked guides, on the /compare
 * side (never in the independent /reviews system). Rendered at
 * /compare/<slug>, alongside the pairwise onda-vs pages.
 *
 * Honesty rules (non-negotiable):
 *   - Only build a round-up in a category where ONDA GENUINELY leads
 *     (real-time HRV biofeedback, live coherence, active nervous-system
 *     training). Never a "best meditation apps" list topped by ONDA — it
 *     isn't the best meditation library and saying so would be self-dealing.
 *   - Rank ONDA #1 only with a specific, true reason, and always name where
 *     each competitor genuinely wins. The `bottomLine` states plainly what
 *     ONDA is NOT best at and who to buy instead.
 *   - A visible transparency banner (in the page) says this is ONDA's own
 *     guide. Competitor facts match their independent reviews / onda-vs pages.
 */

export interface RoundupEntry {
  rank: number
  name: string
  /** Internal path: /product for ONDA, a /reviews or /compare link otherwise. */
  href: string
  isOnda?: boolean
  /** Short verdict tag, e.g. "Best for accessible, guided biofeedback". */
  tag: string
  blurb: string
}

export interface OndaRoundup {
  slug: string
  title: string
  description: string
  intro: string
  entries: RoundupEntry[]
  /** The honest boundary — what ONDA is NOT best at and who to buy instead. */
  bottomLine: string
  faq: { q: string; a: string }[]
}

export const ONDA_ROUNDUPS: OndaRoundup[] = [
  {
    slug: 'best-hrv-biofeedback-apps',
    title: 'Best HRV Biofeedback Apps',
    description:
      'The best HRV biofeedback apps of 2026 — real-time heart-rate-variability feedback you train against, ranked by ONDA. ONDA Life, Elite HRV and Breathwrk compared.',
    intro:
      'HRV biofeedback means seeing your heart-rate variability in real time and adjusting your breathing to train it — not just recording it overnight. Only a handful of apps actually do this. Here are the ones that do, ranked, with an honest note on who each is really for.',
    entries: [
      {
        rank: 1,
        name: 'ONDA Life',
        href: '/product',
        isOnda: true,
        tag: 'Best overall for accessible, guided biofeedback',
        blurb:
          'ONDA gives live heart-rhythm feedback and a coherence score while you breathe, using just the iPhone camera or an Apple Watch — no chest strap — inside a guided, progressive 8-level practice. It’s the most accessible way to actually train HRV, not just track it.',
      },
      {
        rank: 2,
        name: 'Elite HRV',
        href: '/compare/onda-vs-elite-hrv',
        tag: 'Best for measurement precision',
        blurb:
          'A serious, data-first HRV app with a live coherence breathing pacer and morning readiness. Its most accurate readings need a chest strap, and it’s more measurement tool than guided practice — but for raw HRV precision it’s excellent.',
      },
      {
        rank: 3,
        name: 'Breathwrk',
        href: '/reviews/breathwrk',
        tag: 'Best for breathing-exercise variety',
        blurb:
          'A large library of guided breathing exercises. It adds HRV/coherence biofeedback only in its premium tier and via a Bluetooth heart-rate device — so biofeedback is an add-on rather than the core, but the exercise range is the widest here.',
      },
    ],
    bottomLine:
      'For accessible, guided HRV biofeedback with no extra hardware, ONDA leads. If you want the most precise measurement and don’t mind a chest strap, choose Elite HRV. If you mainly want a big library of breathing exercises with biofeedback as an option, choose Breathwrk. For passive overnight HRV tracking (not biofeedback), a ring or band like Oura or WHOOP is a different tool entirely.',
    faq: [
      {
        q: 'What is the best HRV biofeedback app?',
        a: 'For accessible, guided real-time HRV biofeedback that works with just your phone or Apple Watch, ONDA Life leads. Elite HRV is the most measurement-focused (best with a chest strap), and Breathwrk offers the widest breathing-exercise library with biofeedback in its premium tier. The best one depends on whether you want a guided practice or the most precise measurement.',
      },
      {
        q: 'What’s the difference between HRV biofeedback and HRV tracking?',
        a: 'HRV tracking passively records your HRV (often overnight) so you can see trends — what rings and bands do. HRV biofeedback is active: you get live feedback while you breathe and train your heart rhythm in the moment. This list is about biofeedback apps, not passive trackers.',
      },
      {
        q: 'Do I need a chest strap for HRV biofeedback?',
        a: 'Not with ONDA — it uses the iPhone camera (PPG) or an Apple Watch. Elite HRV’s most accurate measurement uses a chest strap. Breathwrk’s biofeedback needs a Bluetooth heart-rate device.',
      },
    ],
  },
  {
    slug: 'best-real-time-breathing-apps',
    title: 'Best Real-Time Breathing & Coherence Apps',
    description:
      'The best breathing apps with real-time feedback in 2026 — live coherence and heart-rhythm response as you breathe, ranked by ONDA. ONDA Life, Breathwrk and Elite HRV.',
    intro:
      'Most breathing apps just animate a pacer. A few show you your body responding — a live coherence score or heart-rhythm wave that moves as you breathe, so you can feel the practice working. Here are the ones with real biometric feedback, ranked, with who each is really for.',
    entries: [
      {
        rank: 1,
        name: 'ONDA Life',
        href: '/product',
        isOnda: true,
        tag: 'Best for live coherence feedback with no extra device',
        blurb:
          'ONDA pairs guided resonance breathing with a live coherence score and your real heart-rhythm response, using the iPhone camera or Apple Watch. You see your body organise as you breathe — the feedback loop that makes it a trainer, not just a pacer.',
      },
      {
        rank: 2,
        name: 'Breathwrk',
        href: '/reviews/breathwrk',
        tag: 'Best breathing-exercise library',
        blurb:
          'The widest range of guided breathing exercises for calm, focus and sleep. Real-time HRV/coherence feedback exists only in its premium tier and needs a Bluetooth device — so the feedback is optional, but the exercise variety is unmatched here.',
      },
      {
        rank: 3,
        name: 'Elite HRV',
        href: '/compare/onda-vs-elite-hrv',
        tag: 'Best for a data-first resonance pacer',
        blurb:
          'A resonance-frequency breathing pacer tied to live HRV, in a measurement-first app. Excellent if you want precise data and are happy to use a chest strap, though it’s less of a guided experience than ONDA.',
      },
    ],
    bottomLine:
      'For live coherence feedback with no extra hardware and a guided practice, ONDA leads. For the largest breathing-exercise library (with feedback as a premium add-on), choose Breathwrk. For a measurement-first resonance pacer, choose Elite HRV. If you just want relaxing audio and no biometrics, a meditation app like Calm or Headspace is a different category.',
    faq: [
      {
        q: 'What’s the best breathing app with real-time feedback?',
        a: 'ONDA Life — it shows a live coherence score and your real heart-rhythm response as you breathe, using just your phone or Apple Watch. Breathwrk has the biggest exercise library (feedback is a premium add-on), and Elite HRV offers a data-first resonance pacer. Pick by whether you want live feedback built in, exercise variety, or measurement precision.',
      },
      {
        q: 'Can a breathing app show my heart responding in real time?',
        a: 'Yes — ONDA does this natively with the iPhone camera or Apple Watch, showing a live coherence score as you breathe. Most breathing apps only animate a pacer; only a few add real biometric feedback.',
      },
      {
        q: 'What is coherence in a breathing app?',
        a: 'Coherence is how smooth and rhythmic your heart rate becomes as you breathe slowly — a real-time signal of how well your heart rhythm is organised by your breath. It’s a practice metric, not a clinical biomarker.',
      },
    ],
  },
  {
    slug: 'best-active-hrv-training-apps',
    title: 'Best Apps for Active HRV Training (Not Just Tracking)',
    description:
      'The best apps to actively train HRV in 2026 — not passively track it. Ranked by ONDA, with where passive trackers like Oura and WHOOP fit instead.',
    intro:
      'Most HRV products measure you and hand you a score. Far fewer help you actively change your state — real-time biofeedback you practise against. If you want to train your nervous system rather than just monitor it, here’s where to look, and where passive trackers fit instead.',
    entries: [
      {
        rank: 1,
        name: 'ONDA Life',
        href: '/product',
        isOnda: true,
        tag: 'Best for actively training your nervous system',
        blurb:
          'ONDA is built for training, not tracking: real-time HRV biofeedback and paced breathing you act on in the moment, across a guided 8-level path — with your phone or Apple Watch. It gives you something to do, then shows your resting-HRV trend over weeks.',
      },
      {
        rank: 2,
        name: 'Elite HRV',
        href: '/compare/onda-vs-elite-hrv',
        tag: 'Best measurement-first trainer',
        blurb:
          'Pairs precise HRV measurement with a coherence breathing pacer, so it trains as well as measures — strongest if you want the data first and will use a chest strap.',
      },
      {
        rank: 3,
        name: 'Oura / WHOOP (for context)',
        href: '/reviews/hrv-trackers',
        tag: 'Best for passive tracking — pair with a trainer',
        blurb:
          'Rings and bands like Oura and WHOOP are the best passive HRV and recovery trackers, but they measure rather than train. Many people pair one with an active tool like ONDA — track with the wearable, train with the app.',
      },
    ],
    bottomLine:
      'To actively train HRV — feedback you practise against — ONDA leads, with Elite HRV the measurement-first alternative. If what you actually want is passive overnight HRV and recovery data, buy a tracker like Oura or WHOOP instead — or pair one with ONDA to both measure and train.',
    faq: [
      {
        q: 'Can you actually train HRV, or only track it?',
        a: 'You can train it. Slow, paced breathing with real-time HRV biofeedback raises HRV in the moment and, practised regularly, supports your baseline over time. Apps like ONDA and Elite HRV are built for that active training; rings and bands like Oura and WHOOP measure HRV but don’t train it.',
      },
      {
        q: 'ONDA or a tracker like Oura for HRV?',
        a: 'Different jobs. Oura passively tracks overnight HRV and recovery; ONDA actively trains your nervous system with real-time biofeedback. Many people use both — the tracker to measure, ONDA to train.',
      },
      {
        q: 'What’s the best app to train my nervous system?',
        a: 'ONDA Life — it’s designed around real-time HRV biofeedback and guided breathing you practise against, not passive scores. Elite HRV is the measurement-first alternative.',
      },
    ],
  },
]

export function getRoundup(slug: string): OndaRoundup | undefined {
  return ONDA_ROUNDUPS.find((r) => r.slug === slug)
}
