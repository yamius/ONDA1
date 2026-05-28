import type { ToolReview } from './types'

const molekuleAirPro: ToolReview = {
  slug: 'molekule-air-pro',
  name: 'Molekule Air Pro',
  brand: 'Molekule',
  category: 'air-purifier',
  productType: 'Premium PECO + HEPA hybrid air purifier',
  description:
    'ONDA review of the Molekule Air Pro — premium air purifier with PECO photocatalytic oxidation technology + True HEPA at $1,199. Scored on filtration, CADR, build and value.',
  verdict:
    'Best PECO technology premium — destroys VOCs and pathogens at molecular level, polished consumer UX. PECO efficacy claims debated; backed by Molekule patents.',
  summary:
    'Molekule Air Pro is the PECO-technology premium — photocatalytic oxidation (PECO) layer destroys VOCs, mold and pathogens at molecular level via UV-activated catalyst, combined with True HEPA H13. Polished consumer UX with app integration and PM2.5 / VOC sensors. Premium pricing. PECO efficacy beyond HEPA claims have been debated in independent reviews; Molekule patents and FTC settlements clarify the boundaries.',
  overallScore: 8.0,
  scores: [
    { criterionId: 'filtration-technology', score: 8.5, note: 'PECO photocatalytic oxidation + True HEPA H13 combination. PECO destroys VOCs / pathogens at molecular level. Multi-layer approach unique in category.' },
    { criterionId: 'cadr-coverage', score: 7.5, note: '1000 sq ft coverage. CADR figures less independently verified than IQAir / Coway.' },
    { criterionId: 'build-noise', score: 8.0, note: 'Premium consumer build. Quiet on low (~32 dB), louder on high (~62 dB). Cylindrical form factor distinctive.' },
    { criterionId: 'smart-features', score: 9.0, note: 'Full app integration with PM2.5 / VOC sensors, auto mode, Apple HomeKit / Google Home. Premium smart-feature execution.' },
    { criterionId: 'maintenance-cost', score: 6.5, note: 'PECO filter 6-month replacement, HEPA pre-filter 6-month. ~$200-300/year filter cost. Higher than IQAir long-term.' },
    { criterionId: 'value', score: 6.5, note: '$1,199 — premium pricing. Justified by PECO + smart features; expensive vs IQAir clinical reference or Coway / Dyson alternatives.' },
  ],
  pros: [
    'PECO photocatalytic technology — destroys VOCs at molecular level',
    'Best smart-feature integration in premium category',
    'Polished consumer UX with PM2.5 / VOC sensors',
    'Apple HomeKit / Google Home integration',
  ],
  cons: [
    'Premium pricing ($1,199)',
    'PECO efficacy claims debated in independent reviews',
    'Higher filter replacement cost vs IQAir',
    '6-month filter cycle vs IQAir 2-4 year',
  ],
  bestFor: 'Best for users wanting PECO VOC-destruction + premium smart features — accept higher long-term filter cost.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Molekule product documentation, FTC settlement context and 2026 consumer reviews. PECO efficacy claims flagged as editorial concern. Not hands-on tested by ONDA.',
  price: { usd: 1199, note: 'Air Pro standalone', asOf: '2026-05-28' },
  link: 'https://www.molekule.com/',
  linkType: 'official',
  content: `## Where it leads

Molekule Air Pro is the premium PECO-technology entry — photocatalytic oxidation destroys VOCs and pathogens at molecular level beyond what HEPA filters catch, combined with True HEPA H13 layer. Polished consumer UX with full smart-feature integration.

## Where it falls short

PECO efficacy beyond HEPA claims have been debated in independent reviews; Molekule reached FTC settlements clarifying the marketing boundaries. Higher long-term filter cost than IQAir.

## Who it is for

Choose Molekule Air Pro for PECO technology + premium smart features. For clinical-grade HEPA without smart features, IQAir HealthPro Plus. For consumer-polished smart features at lower price, Dyson Big+Quiet or Coway Airmega 400.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
`,
  references: [
    { label: 'Molekule — official site', url: 'https://www.molekule.com/' },
  ],
  relatedSlugs: ['iqair-healthpro-plus', 'dyson-purifier-big-quiet', 'coway-airmega-400'],
  publishOn: '2026-07-27',
  datePublished: '2026-07-27',
  dateModified: '2026-07-27',
}

export default molekuleAirPro
