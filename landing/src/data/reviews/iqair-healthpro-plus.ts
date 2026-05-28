import type { ToolReview } from './types'

const iqairHealthPro: ToolReview = {
  slug: 'iqair-healthpro-plus',
  name: 'IQAir HealthPro Plus',
  brand: 'IQAir',
  category: 'air-purifier',
  productType: 'Clinical-grade HyperHEPA H14 air purifier',
  description:
    'ONDA review of the IQAir HealthPro Plus — Swiss-engineered HyperHEPA H14 air purifier with the deepest medical-grade filtration in consumer category. Scored on filtration, CADR, build and value.',
  verdict:
    'The clinical reference — HyperHEPA H14 filtration captures 99.5% of particles at 0.003 microns, multi-decade brand pedigree, used in COVID-19 hospital deployments.',
  summary:
    'IQAir HealthPro Plus is the medical-grade reference — Swiss-engineered HyperHEPA H14 filter capturing 99.5% of particles down to 0.003 microns (vs True HEPA H13 at 0.3 microns), heavy V5-Cell activated-carbon module for VOC capture, multi-stage 1125 sq ft coverage. Used in hospital deployments and clinical contexts. Premium pricing reflects clinical-tier filtration; nothing else in consumer category matches the spec.',
  overallScore: 8.8,
  scores: [
    { criterionId: 'filtration-technology', score: 9.8, note: 'HyperHEPA H14 — captures 99.5% at 0.003 microns (vs True HEPA H13 at 99.97% at 0.3 microns). Deepest consumer filtration spec. V5-Cell carbon module for VOC.' },
    { criterionId: 'cadr-coverage', score: 8.5, note: 'AHAM-verified CADR. 1125 sq ft coverage at 2 ACH; ~450 sq ft at 5 ACH. Conservative manufacturer stating.' },
    { criterionId: 'build-noise', score: 8.5, note: 'Premium Swiss build, multi-decade reliability. Quiet on low (~30 dB); louder on high (~65 dB) — fan size compromise.' },
    { criterionId: 'smart-features', score: 6.5, note: 'No app, no built-in sensors. The notable spec gap vs Dyson / Molekule premium-app competitors.' },
    { criterionId: 'maintenance-cost', score: 8.5, note: 'Filter cartridges 2-4 year lifespan. ~$200-300/year filter cost. Long-term ownership economics favorable.' },
    { criterionId: 'value', score: 7.0, note: '$1,099 — premium pricing. Justified by clinical-grade filtration; expensive vs Dyson / Coway alternatives with smart features.' },
  ],
  pros: [
    'HyperHEPA H14 — deepest filtration in consumer category',
    'Used in hospital / clinical deployments',
    'Multi-decade Swiss brand pedigree',
    '2-4 year filter cartridge lifespan',
  ],
  cons: [
    'Premium pricing ($1,099)',
    'No app, no sensors, no smart features',
    'Loud on high speed (~65 dB)',
    'Manual control only — no auto mode',
  ],
  bestFor: 'Best for users wanting clinical-grade HEPA filtration with multi-decade Swiss pedigree — accept lack of smart features.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from IQAir product documentation, AHAM certification, and 2026 air-quality / consumer reviews. Not hands-on tested by ONDA.',
  price: { usd: 1099, note: 'HealthPro Plus standalone', asOf: '2026-05-28' },
  link: 'https://www.iqair.com/',
  linkType: 'official',
  content: `## Where it leads

IQAir HealthPro Plus is the clinical-grade air-purifier reference — HyperHEPA H14 captures particles down to 0.003 microns, multi-decade Swiss brand pedigree, used in hospital and clinical deployments. Nothing else in consumer category matches the filtration spec.

## Where it falls short

Smart features and high-speed noise. No app, no sensors, no auto mode — IQAir is a pure mechanical filter device. Fan noise on high speed (~65 dB) is loud. For users wanting smart integration, Dyson or Molekule better fit.

## Who it is for

Choose IQAir HealthPro Plus for clinical-grade HEPA filtration — accept lack of smart features. For premium smart features, Dyson Big+Quiet. For PECO premium, Molekule Air Pro. For mid-premium smart, Coway Airmega 400.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
- [Nightly flush: the glymphatic system](/articles/nightly-flush-glymphatic-neural-cache)
`,
  references: [
    { label: 'IQAir — official site', url: 'https://www.iqair.com/' },
  ],
  relatedSlugs: ['molekule-air-pro', 'dyson-purifier-big-quiet', 'coway-airmega-400'],
  publishOn: '2026-07-27',
  datePublished: '2026-07-27',
  dateModified: '2026-07-27',
}

export default iqairHealthPro
