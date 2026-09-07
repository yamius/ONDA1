import type { ToolReview } from './types'

const circularRing2: ToolReview = {
  slug: 'circular-ring-2',
  name: 'Circular Ring 2',
  brand: 'Circular',
  category: 'hrv-wearable',
  productType: 'Smart ring',
  description:
    'ONDA review of the Circular Ring 2 — the first smart ring with on-finger ECG and AFib detection, plus a subscription-free AI coach — held back by unfinished, buggy software.',
  verdict:
    'The most ambitious smart ring on paper — on-finger ECG, AFib detection and an AI coach, all subscription-free — but the software is unfinished, and the headline health features didn’t reliably work in independent testing.',
  summary:
    'The Circular Ring 2 is the boldest hardware pitch in the category: the first smart ring with an on-finger ECG sensor and atrial-fibrillation (AFib) detection, paired with "Kira," a subscription-free AI coach that reads 140+ biometric markers after a 14-day calibration. On paper it combines ECG + AFib + proactive AI + zero subscription in a way no other ring does. In practice, independent 2026 reviews found the software got in the way — the ECG and AFib monitoring never fully worked during testing, and promised blood-pressure and glucose features had not arrived. Battery is about six days. It’s a genuinely innovative ring whose ambition currently outruns its execution.',
  overallScore: 6.5,
  scores: [
    { criterionId: 'hrv-accuracy', score: 6.5, note: 'HRV tracking is present, but overall data reliability was uneven in independent testing.' },
    { criterionId: 'sensor', score: 7.5, note: 'The most ambitious sensor array in a ring — on-finger ECG and AFib detection. The hardware is real; the problem is the software driving it.' },
    { criterionId: 'sleep-accuracy', score: 6.5, note: 'Standard sleep tracking, undercut by the app’s overall roughness.' },
    { criterionId: 'data-access', score: 6.0, note: 'Data lives in the Circular app with the Kira AI layer; no truly open API.' },
    { criterionId: 'wearability', score: 6.5, note: 'About six days of battery (eight claimed); comfortable to wear, in multiple finishes.' },
    { criterionId: 'app-ux', score: 5.5, note: 'The weak point. Independent reviewers found the software buggy and unfinished — the ECG/AFib features didn’t reliably work, and promised blood-pressure and glucose tracking hadn’t shipped.' },
    { criterionId: 'value', score: 6.0, note: 'From $349 (higher finishes cost more), subscription-free. Fair only if you’re buying the potential — the marquee features don’t yet fully deliver.' },
  ],
  pros: [
    'First smart ring with on-finger ECG and AFib detection',
    'Subscription-free, including the Kira AI coach',
    'Genuinely innovative hardware ambition',
    'Multiple finishes; ~6-day battery',
  ],
  cons: [
    'ECG/AFib monitoring did not reliably work in independent testing',
    'Buggy, unfinished software',
    'Promised blood-pressure and glucose features not yet shipped',
    'Data reliability uneven; no open API',
  ],
  bestFor: 'Best for early adopters excited by on-ring ECG/AFib and AI coaching who accept that the software is unfinished. Everyone else should wait for it to mature.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Circular specifications and independent 2026 reviews, which flagged significant software problems. Not hands-on tested by ONDA.',
  price: { usd: 349, note: 'Obsidian Black; Silver $449, Gold/Rose Gold $549; subscription-free', asOf: '2026-09-06' },
  link: 'https://www.circular.xyz/',
  linkType: 'official',
  content: `## Where it leads

No other smart ring is this ambitious. The Circular Ring 2 puts an ECG sensor on your finger with atrial-fibrillation detection — a first for the category — and pairs it with "Kira," a subscription-free AI coach that reads 140+ biometric markers and personalises after a 14-day calibration. The combination of ECG, AFib, a proactive AI and no subscription genuinely doesn’t exist elsewhere.

## Where it falls short

Execution. Independent 2026 reviews were clear: the software got in the way. The headline ECG and AFib monitoring never fully worked during testing, and promised blood-pressure and glucose features had not arrived. For a ring whose entire pitch is advanced heart-rhythm sensing, features that don’t reliably work are a serious problem, not a footnote.

## Who it is for

Choose the Circular Ring 2 only if you’re an early adopter who wants on-ring ECG/AFib and AI coaching and accepts buying the potential rather than a finished product. If you want features that work today, the [RingConn Gen 3](/reviews/ringconn-gen-3) (subscription-free, with vascular and sleep-apnea insights that ship) or [Oura Ring 5](/reviews/oura-ring-5) are safer.

---

## Background reading

- [Resonant-frequency system coherence](/articles/resonant-frequency-system-coherence) — why 5.5–6 breaths per minute is the HRV-training sweet spot
`,
  references: [
    { label: 'Circular — official site', url: 'https://www.circular.xyz/' },
  ],
  relatedSlugs: ['ringconn-gen-3', 'oura-ring-5', 'ultrahuman-ring-pro', 'samsung-galaxy-ring'],
  publishOn: '2026-09-06',
  datePublished: '2026-09-06',
  dateModified: '2026-09-06',
}

export default circularRing2
