import type { ToolReviewInput } from './types'

const breatheToRelax: ToolReviewInput = {
  slug: 'breathe-to-relax',
  name: 'Breathe2Relax',
  brand: 'US National Center for Telehealth & Technology',
  category: 'breathwork-app',
  productType: 'Free DoD-built diaphragmatic-breathing app for stress and PTSD',
  description:
    'Breathe2Relax review: the most credible free breathwork app — built by US military telehealth for PTSD and stress. Dated UX, clinical pedigree unmatched for $0.',
  verdict:
    'Best evidence-backed free breathwork app — built by US military telehealth for PTSD and stress; it teaches well-documented diaphragmatic breathing at zero cost.',
  summary:
    'Breathe2Relax is the US Department of Defense / National Center for Telehealth & Technology free diaphragmatic-breathing app, originally developed for veteran PTSD and combat-stress management. Published research on the app itself is limited to small pilot studies; the diaphragmatic-breathing technique it teaches is well documented. Library is narrow (diaphragmatic / paced breathing focused), UX is dated, but the evidence base is unmatched at zero cost.',
  scores: [
    { criterionId: 'session-library', score: 4.5, note: 'Narrow library — focused on diaphragmatic and paced breathing for stress / PTSD context. Not a content platform.' },
    { criterionId: 'technique-coverage', score: 4.5, note: 'Diaphragmatic and paced breathing only. No Wim Hof, holotropic or broader technique coverage.' },
    { criterionId: 'evidence-grounding', score: 7.0, note: 'Built by the US National Center for Telehealth & Technology, which also ran its validation studies — research by the developer\'s own organisation does not count as evidence in ONDA scores. The techniques it teaches are well documented.' },
    { criterionId: 'app-experience', score: 5.0, note: 'Dated UI from original government-build era. Functional but lacks 2026-tier polish.' },
    { criterionId: 'biofeedback', score: 4.0, note: 'No HRV. Basic session tracking.' },
    { criterionId: 'value', score: 9.5, note: 'Completely free with no premium tier. Unbeatable value for the evidence base.' },
  ],
  pros: [
    'Best evidence base of any free breathwork app — published PTSD / stress validation',
    'Completely free with no subscription or ads',
    'Built by US Department of Defense / National Center for Telehealth',
    'Teaches a well-documented breathing technique at zero cost',
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

Breathe2Relax is the free breathwork app from a public source — developed by the US Department of Defense’s National Center for Telehealth & Technology for PTSD and combat-stress care. Published research on the app itself is limited to small pilot studies; the diaphragmatic breathing it teaches is well documented.

## What are the downsides of Breathe2Relax?

Its main downsides are UX and scope. Breathe2Relax is built for a specific clinical purpose (diaphragmatic breathing for stress and PTSD); the UI is dated, the library is narrow, and the app is no longer actively iterated. It's a free tool with a clinical thesis, not a 2026 content platform.

## Who should buy Breathe2Relax?

Choose Breathe2Relax if you want evidence-backed free diaphragmatic breathing — especially in clinical, PTSD or stress-management contexts. For curated library, Breathwrk. For modern free UI, iBreathe. For Android customisation, Prana Breath.

---

## Background reading

- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation) — diaphragmatic breathing and vagal tone
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
`,
  references: [
    { label: 'Breathe2Relax — US National Center for Telehealth & Technology', url: 'https://www.t2health.dcoe.mil/apps/breathe2relax' },
  ],
  relatedSlugs: ['ibreathe', 'prana-breath', 'breathwrk'],
  publishOn: '2026-06-29',
  faq: [
    { q: "Does Breathe2Relax actually work?", a: "Breathe2Relax has the best evidence base of any free breathwork app, with published validation studies on PTSD and stress outcomes. It was built by the US National Center for Telehealth & Technology for veteran PTSD and combat-stress management, earning 8.5/10 on evidence grounding, though its overall ONDA score is 5.5/10." },
    { q: "How much does Breathe2Relax cost?", a: "Breathe2Relax is completely free with no premium tier, subscription or ads. It scores 9.5/10 on value in ONDA's assessment, an unbeatable price for its clinical evidence base. The trade-off is a dated UI and a narrow scope limited to diaphragmatic and paced breathing." },
    { q: "Who is Breathe2Relax best for?", a: "Breathe2Relax is best for users who want evidence-backed diaphragmatic breathing at zero cost, especially in clinical, PTSD or stress-management contexts. It is narrow by design, covering only diaphragmatic and paced breathing with no HRV biofeedback, no content library, and no ongoing development." },
  ],

  datePublished: '2026-06-29',
  dateModified: '2026-10-10',
}

export default breatheToRelax
