import type { ToolReview } from './types'

const breatheToRelax: ToolReview = {
  slug: 'breathe-to-relax',
  name: 'Breathe2Relax',
  brand: 'US National Center for Telehealth & Technology',
  category: 'breathwork-app',
  productType: 'Free DoD-built diaphragmatic-breathing app for stress and PTSD',
  description:
    'ONDA review of Breathe2Relax — free US Department of Defense / Telehealth-built diaphragmatic-breathing app originally developed for veteran PTSD and stress management. Scored on library, evidence, app experience and value.',
  verdict:
    'Best evidence-backed free breathwork app — built by US military telehealth for PTSD and stress; clinical credibility no other free app matches.',
  summary:
    'Breathe2Relax is the US Department of Defense / National Center for Telehealth & Technology free diaphragmatic-breathing app, originally developed for veteran PTSD and combat-stress management. Clinical-credibility framing no other free app matches — published validation studies on PTSD and stress outcomes. Library is narrow (diaphragmatic / paced breathing focused), UX is dated, but the evidence base is unmatched at zero cost.',
  overallScore: 5.5,
  scores: [
    { criterionId: 'session-library', score: 4.5, note: 'Narrow library — focused on diaphragmatic and paced breathing for stress / PTSD context. Not a content platform.' },
    { criterionId: 'technique-coverage', score: 4.5, note: 'Diaphragmatic and paced breathing only. No Wim Hof, holotropic or broader technique coverage.' },
    { criterionId: 'evidence-grounding', score: 8.5, note: 'Built by US National Center for Telehealth & Technology with published validation studies on PTSD and stress outcomes. Best evidence base of any free breathwork app.' },
    { criterionId: 'app-experience', score: 5.0, note: 'Dated UI from original government-build era. Functional but lacks 2026-tier polish.' },
    { criterionId: 'biofeedback', score: 4.0, note: 'No HRV. Basic session tracking.' },
    { criterionId: 'value', score: 9.5, note: 'Completely free with no premium tier. Unbeatable value for the evidence base.' },
  ],
  pros: [
    'Best evidence base of any free breathwork app — published PTSD / stress validation',
    'Completely free with no subscription or ads',
    'Built by US Department of Defense / National Center for Telehealth',
    'Clinical credibility no consumer app matches at zero cost',
  ],
  cons: [
    'Dated UI from original government-build era',
    'Narrow technique scope — diaphragmatic / paced breathing only',
    'No HRV or modern biofeedback',
    'No content library or ongoing development',
  ],
  bestFor: 'Best for users wanting evidence-backed diaphragmatic breathing at zero cost — especially in clinical / PTSD / stress-management contexts.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Breathe2Relax App Store / Play Store listings, US National Center for Telehealth & Technology documentation, and published validation studies. Not hands-on tested by ONDA.',
  price: { usd: 0, note: 'completely free; no premium tier', asOf: '2026-05-28' },
  link: 'https://www.t2health.dcoe.mil/apps/breathe2relax',
  linkType: 'official',
  content: `## Where it leads

Breathe2Relax is the evidence-backed free breathwork reference — built by the US National Center for Telehealth & Technology with published validation studies on PTSD and combat-stress outcomes. Clinical credibility no consumer-built free app matches.

## Where it falls short

UX and scope. Breathe2Relax is built for a specific clinical purpose (diaphragmatic breathing for stress and PTSD); the UI is dated, the library is narrow, and the app is no longer actively iterated. It's a free tool with a clinical thesis, not a 2026 content platform.

## Who it is for

Choose Breathe2Relax if you want evidence-backed free diaphragmatic breathing — especially in clinical, PTSD or stress-management contexts. For curated library, Breathwrk. For modern free UI, iBreathe. For Android customisation, Prana Breath.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing) — diaphragmatic breathing and vagal tone
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
`,
  references: [
    { label: 'Breathe2Relax — US National Center for Telehealth & Technology', url: 'https://www.t2health.dcoe.mil/apps/breathe2relax' },
  ],
  relatedSlugs: ['ibreathe', 'prana-breath', 'breathwrk'],
  publishOn: '2026-06-29',
  datePublished: '2026-06-29',
  dateModified: '2026-06-29',
}

export default breatheToRelax
