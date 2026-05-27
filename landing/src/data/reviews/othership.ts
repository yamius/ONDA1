import type { ToolReview } from './types'

const othership: ToolReview = {
  slug: 'othership',
  name: 'Othership',
  brand: 'Othership',
  category: 'breathwork-app',
  productType: 'Premium music-driven breathwork app with live community sessions',
  description:
    'ONDA review of Othership — Toronto-built premium breathwork app with music-driven journeys and live community sessions. Scored on library, technique coverage, evidence and value.',
  verdict:
    'Best premium breathwork experience — music-driven cinematic sessions, live community classes, polished UX. Highest sub price in the category, justified by production value.',
  summary:
    'Othership is the premium breathwork brand crossover from physical sauna/cold-plunge spaces in Toronto. The app delivers cinematic music-driven journeys (down-regulation, up-regulation, ceremony) with live community classes scheduled daily. Production value is the highest in the category — voiceovers, soundscapes and session arcs feel curated, not generated. $150/year is the highest sub price; the music + community thesis justifies it for the right user.',
  overallScore: 8.3,
  scores: [
    { criterionId: 'session-library', score: 8.5, note: 'Curated library organised around down-regulate (calm/sleep), up-regulate (energy/focus), ceremony (longer 30–60 min journeys). Smaller than Breathwrk in raw count but higher production value per session.' },
    { criterionId: 'technique-coverage', score: 7.5, note: 'Full breathwork modalities — box, Wim Hof, holotropic, cyclic sighing — but leans into rhythmic-music breathwork. Less Buteyko / clinical-research focus than Breathwrk.' },
    { criterionId: 'evidence-grounding', score: 7.5, note: 'Cites Stanford cyclic-sighing and polyvagal work but leans more on lived-experience and ceremony framing than peer-reviewed citations.' },
    { criterionId: 'app-experience', score: 9.0, note: 'Best UX in category — cinematic visuals, immersive audio, low session-start friction. Live class layer is unique in breathwork apps.' },
    { criterionId: 'biofeedback', score: 6.0, note: 'Apple Health integration; no HRV-driven adaptation. Community / live classes substitute for measurement-driven feedback.' },
    { criterionId: 'value', score: 7.0, note: '$150/year — highest premium-tier price in breathwork apps. Justified for users who value production and community; expensive for users who only want guided technique.' },
  ],
  pros: [
    'Best production value in the category — cinematic music-driven sessions',
    'Live community classes scheduled daily — unique in breathwork apps',
    'Premium UX with polished visuals and immersive audio',
    'Brand crossover from physical Toronto sauna / cold-plunge spaces',
  ],
  cons: [
    '$150/year — highest premium subscription in breathwork apps',
    'Less peer-reviewed evidence citation than Breathwrk',
    'Smaller raw session count than Breathwrk',
    'Less Buteyko / clinical-research focus',
  ],
  bestFor: 'Best for users buying breathwork as an experience — music-driven, cinematic, with live community — and willing to absorb the premium subscription.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Othership app documentation, App Store reviews and 2026 user reports. Not hands-on tested by ONDA.',
  price: { usd: 150, note: 'annual subscription; free trial available', asOf: '2026-05-28' },
  link: 'https://www.othership.us/',
  linkType: 'official',
  content: `## Where it leads

Othership is the premium production-value reference in breathwork apps — cinematic music-driven sessions, live community classes, and the highest-polish UX in the category. The Toronto-based brand crossover from physical sauna and cold-plunge spaces gives the app a community layer no other breathwork app matches.

## Where it falls short

Price and evidence depth. At $150/year Othership is the most expensive breathwork sub by ~2x; the production justifies it for the right user but it's a premium ask. Evidence citations lean on lived experience and ceremony framing rather than peer-reviewed depth — Breathwrk's science-grounded copy is more rigorous.

## Who it is for

Choose Othership if you want breathwork as cinematic experience with music and live community. For largest structured library at lower price, Breathwrk. For rhythmic music breathwork with certifications, SOMA Breath. For free entry, iBreathe or Breathe2Relax.

---

## Background reading

- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep) — why music + breath pair for nervous-system regulation
- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing) — vagal tone and parasympathetic activation
- [Ancestral sync — circadian anchors](/articles/ancestral-sync-circadian-anchors) — why community ritual pairs with circadian alignment
`,
  references: [
    { label: 'Othership — official site', url: 'https://www.othership.us/' },
  ],
  relatedSlugs: ['breathwrk', 'soma-breath', 'open-app'],
  publishOn: '2026-06-29',
  datePublished: '2026-06-29',
  dateModified: '2026-06-29',
}

export default othership
