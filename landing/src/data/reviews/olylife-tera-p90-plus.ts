import type { ToolReview } from './types'

const olylifeTera: ToolReview = {
  slug: 'olylife-tera-p90-plus',
  name: 'OlyLife TERA P90 Plus',
  brand: 'OlyLife',
  category: 'pemf',
  productType: 'Budget PEMF + terahertz wand system',
  description:
    'ONDA review of the OlyLife TERA P90 Plus — popular budget PEMF + terahertz wand. Scored on field strength, waveform research, build and value. The terahertz claims are the editorial concern.',
  verdict:
    'Popular budget wand combining PEMF with terahertz claims — accessible price, but terahertz marketing overstates the published evidence.',
  summary:
    'OlyLife TERA P90 Plus is a popular budget PEMF + terahertz wand sold heavily via direct-marketing channels. PEMF component is real and uses documented frequencies; the terahertz wavelength claims are the editorial concern — consumer-device terahertz output and biological effect literature do not match the marketing. Accessible $400–$700 pricing keeps it in the conversation despite the caveats.',
  overallScore: 6.3,
  scores: [
    { criterionId: 'field-strength', score: 6.5, note: 'Moderate PEMF output for a budget device. Terahertz claims are the editorial concern — consumer hardware terahertz output is not well-documented.' },
    { criterionId: 'waveform-evidence', score: 5.5, note: 'PEMF frequencies documented; terahertz biological-effect claims are not well-supported in consumer-device literature. The marketing overstates the evidence.' },
    { criterionId: 'build', score: 6.5, note: 'Decent wand build for the price. Distribution channels skew MLM-style — warranty support inconsistent depending on seller.' },
    { criterionId: 'programmability', score: 6.0, note: 'Limited preset operation. No real parameter exposure.' },
    { criterionId: 'form-factor', score: 7.0, note: 'Handheld wand — portable, targeted use. No whole-body mat coverage.' },
    { criterionId: 'value', score: 7.5, note: '$400–$700 — accessible budget pricing if you accept the terahertz caveats and only value the PEMF component.' },
  ],
  pros: [
    'Accessible budget pricing ($400–$700)',
    'Portable handheld wand form factor',
    'Real PEMF component using documented frequencies',
    'Wide distribution availability',
  ],
  cons: [
    'Terahertz marketing claims overstate the published evidence',
    'MLM-style distribution — warranty inconsistent',
    'Limited parameter exposure and protocol depth',
    'No whole-body mat coverage',
  ],
  bestFor: 'Best for budget-conscious buyers who only value the PEMF component and explicitly discount the terahertz marketing — handheld portable PEMF at sub-$700.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from OlyLife product documentation and independent 2026 PEMF reviews. The terahertz marketing claims are flagged as editorial concern. Not hands-on tested by ONDA.',
  price: { usd: 550, note: 'TERA P90 Plus standalone wand', asOf: '2026-05-27' },
  link: 'https://www.olylife.com/',
  linkType: 'official',
  content: `## Where it leads

OlyLife TERA P90 Plus is the popular budget PEMF + terahertz wand — accessible pricing, portable handheld form factor, and real PEMF component using documented frequencies. Widely distributed via direct-marketing channels.

## Where it falls short

The terahertz marketing. Consumer-device terahertz output and biological-effect literature do not match the marketing claims — the PEMF component is real, the terahertz component is the editorial concern. MLM-style distribution channels also create warranty inconsistency.

## Who it is for

Choose OlyLife TERA P90 Plus only if you explicitly discount the terahertz marketing and value the budget PEMF wand component. For research-grounded budget wearable, Resona Health VIBE. For full-body mat, OMI or Healthy Wave.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Mitochondrial recovery protocols](/articles/mitochondrial-recovery-protocols)
`,
  references: [
    { label: 'OlyLife — official site', url: 'https://www.olylife.com/' },
  ],
  relatedSlugs: ['resona-health-vibe', 'omi-full-body-mat', 'higherdose-pemf-mat'],
  publishOn: '2026-06-22',
  datePublished: '2026-06-22',
  dateModified: '2026-06-22',
}

export default olylifeTera
