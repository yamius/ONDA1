import type { ToolReview } from './types'

const hypervoltGo2: ToolReview = {
  slug: 'hypervolt-go-2',
  name: 'Hyperice Hypervolt Go 2',
  brand: 'Hyperice',
  category: 'massage-gun',
  productType: 'Premium travel / mini massage gun',
  description:
    'ONDA review of the Hyperice Hypervolt Go 2 — premium travel-sized massage gun with 30 lbs stall force, 12 mm amplitude and Hyperice ecosystem at $129. Scored on stall force, build, battery and value.',
  verdict:
    'Best premium-brand travel mini — Hypervolt ecosystem in pocket form factor. Reduced stall force is the trade for portability.',
  summary:
    'Hypervolt Go 2 is the premium travel mini — pocket-sized form factor with 30 lbs stall force, 12 mm amplitude, brushless motor, 2 attachments, Hyperice app integration, $129. Stall force is meaningfully reduced vs Hypervolt 2 Pro (60 lbs); the trade is portability and premium-brand ecosystem at sub-budget pricing. Best fit for users wanting Hyperice quality in travel form.',
  overallScore: 7.0,
  scores: [
    { criterionId: 'stall-force-amplitude', score: 6.5, note: '30 lbs stall force — half of Hypervolt 2 Pro. 12 mm amplitude. Reduced percussion dose by design.' },
    { criterionId: 'build-attachments', score: 7.5, note: 'Brushless motor, 2 attachments only, 1-year warranty. Premium Hyperice build at mini scale.' },
    { criterionId: 'battery-noise', score: 8.0, note: 'Brushless motor at 50 dB. ~2.5 hours per charge. Quietest travel mini in category.' },
    { criterionId: 'app-smart-features', score: 7.5, note: 'Hyperice app integration — same ecosystem as Hypervolt 2 Pro. Smart features in travel form.' },
    { criterionId: 'ergonomics-portability', score: 9.5, note: 'Best portability in premium category. ~1.5 lbs, pocket form factor, travel-friendly. Single-hand single-grip optimal for the size.' },
    { criterionId: 'value', score: 7.0, note: '$129 — premium-brand travel mini at accessible pricing. More expensive than budget Bob and Brad Q2 Mini ($99) but with Hyperice ecosystem.' },
  ],
  pros: [
    'Premium Hyperice brand and app at travel-mini form factor',
    'Best portability in premium category',
    'Quietest travel mini (50 dB)',
    'Brushless motor build',
  ],
  cons: [
    'Half the stall force of Hypervolt 2 Pro (30 lbs vs 60)',
    'Only 2 attachments included',
    '$30 more than budget Bob and Brad Q2 Mini',
    '1-year warranty',
  ],
  bestFor: 'Best for users wanting premium-brand travel mini with Hyperice app — accept reduced stall force as the portability trade.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Hyperice product documentation and 2026 travel-mini reviews. Not hands-on tested by ONDA.',
  price: { usd: 129, note: 'Hypervolt Go 2 with 2 attachments', asOf: '2026-05-28' },
  link: 'https://hyperice.com/',
  linkType: 'official',
  content: `## Where it leads

Hypervolt Go 2 is the premium travel mini — Hyperice brand and app ecosystem in pocket form factor. Best portability in premium category with quiet brushless motor.

## Where it falls short

Stall force and attachment count. 30 lbs stall force is half the Hypervolt 2 Pro spec; only 2 attachments included. For users wanting full premium percussion, Hypervolt 2 Pro or Theragun Elite.

## Who it is for

Choose Hypervolt Go 2 for premium-brand travel mini. For Hyperice full-size premium, Hypervolt 2 Pro. For budget travel mini, Bob and Brad Q2 Mini.

---

## Background reading

- [Mitochondrial recovery protocols](/articles/mitochondrial-recovery-protocols)
- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
`,
  references: [
    { label: 'Hyperice — official site', url: 'https://hyperice.com/' },
  ],
  relatedSlugs: ['hypervolt-2-pro', 'bob-and-brad-q2-mini', 'theragun-elite'],
  publishOn: '2026-07-20',
  datePublished: '2026-07-20',
  dateModified: '2026-07-20',
}

export default hypervoltGo2
