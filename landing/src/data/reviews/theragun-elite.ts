import type { ToolReview } from './types'

const theragunElite: ToolReview = {
  slug: 'theragun-elite',
  name: 'Theragun Elite',
  brand: 'Therabody',
  category: 'massage-gun',
  productType: 'Mid-tier premium massage gun',
  description:
    'ONDA review of the Theragun Elite — mid-tier Therabody flagship with 40 lbs stall force, 16 mm amplitude and the same Therabody app at lower price. Scored on stall force, build, battery and value.',
  verdict:
    'Best Therabody value — 16 mm amplitude with 40 lbs stall force at $200 less than PRO Plus. The rational Therabody purchase for most users.',
  summary:
    'Theragun Elite is the rational Therabody buy — same 16 mm amplitude as the flagship PRO Plus, 40 lbs stall force (vs 60 lbs PRO Plus), same Therabody app, same multi-grip handle, $200 less. For 90% of users the spec difference vs PRO Plus is not material. Therabody pedigree and app at meaningfully accessible price.',
  overallScore: 8.2,
  scores: [
    { criterionId: 'stall-force-amplitude', score: 8.5, note: '40 lbs stall force + 16 mm amplitude — same depth as PRO Plus, lower stall. Sufficient for non-elite-athlete use cases.' },
    { criterionId: 'build-attachments', score: 8.5, note: 'Premium brushless motor build, 5 attachments, 2-year warranty. Same Therabody pedigree as PRO Plus.' },
    { criterionId: 'battery-noise', score: 8.5, note: 'Brushless motor at 50–55 dB. ~2 hours per charge.' },
    { criterionId: 'app-smart-features', score: 9.0, note: 'Same Therabody app as PRO Plus — guided routines, pressure sensor, Bluetooth. App parity is the key value proposition.' },
    { criterionId: 'ergonomics-portability', score: 8.0, note: 'Multi-grip handle. Lighter than PRO Plus (~2.2 lbs). Better single-hand session ergonomics than the flagship.' },
    { criterionId: 'value', score: 8.5, note: '$399 — same price as Hypervolt 2 Pro with Therabody app + 2-year warranty. Best Therabody value proposition.' },
  ],
  pros: [
    'Same 16 mm amplitude as Theragun PRO Plus',
    'Same Therabody app and ecosystem at $200 less',
    'Lighter than PRO Plus (~2.2 lbs)',
    'Same 2-year warranty as PRO Plus',
  ],
  cons: [
    '40 lbs stall force vs PRO Plus 60 lbs',
    'No OLED display (PRO Plus exclusive)',
    'Same $399 as Hypervolt 2 Pro but with lower stall force',
    '5 attachments vs PRO Plus 6',
  ],
  bestFor: 'Best for most premium-tier buyers — rational Therabody choice with full app ecosystem and 16 mm amplitude at $200 less than PRO Plus.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Therabody product documentation and 2026 athletic / fitness reviews. Not hands-on tested by ONDA.',
  price: { usd: 399, note: 'Theragun Elite with 5 attachments', asOf: '2026-05-28' },
  link: 'https://www.therabody.com/',
  linkType: 'official',
  content: `## Where it leads

Theragun Elite is the rational Therabody value — same 16 mm amplitude as PRO Plus flagship, same Therabody app and 2-year warranty, $200 less. For 90% of users the spec gap to PRO Plus is not material.

## Where it falls short

Stall force vs Hypervolt 2 Pro. At the same $399 price point, Hypervolt 2 Pro delivers 60 lbs stall force vs Theragun Elite\'s 40 lbs. Trade Therabody ecosystem for higher Hyperice stall force.

## Who it is for

Choose Theragun Elite for rational Therabody value — same app, same amplitude, lower price than PRO Plus. For higher stall force at same price, Hypervolt 2 Pro. For spec ceiling, Theragun PRO Plus.

---

## Background reading

- [Mitochondrial recovery protocols](/articles/mitochondrial-recovery-protocols)
- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
`,
  references: [
    { label: 'Therabody — official site', url: 'https://www.therabody.com/' },
  ],
  relatedSlugs: ['theragun-pro-plus', 'hypervolt-2-pro', 'achedaway-pro'],
  publishOn: '2026-07-20',
  datePublished: '2026-07-20',
  dateModified: '2026-07-20',
}

export default theragunElite
