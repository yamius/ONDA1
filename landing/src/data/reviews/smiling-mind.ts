import type { ToolReview } from './types'

const smilingMind: ToolReview = {
  slug: 'smiling-mind',
  name: 'Smiling Mind',
  brand: 'Smiling Mind',
  category: 'meditation-app',
  productType: 'Meditation app',
  description:
    'ONDA review of Smiling Mind — a completely free, nonprofit meditation app with age-specific programs. Scored on library, teaching, free tier and value.',
  verdict:
    'A completely free, nonprofit app with age-specific programs — the standout choice for families and schools.',
  summary:
    'Smiling Mind is a completely free app from an Australian nonprofit, built with psychologists and educators. Its distinctive strength is age-specific programs — for children, teens, families and the workplace — which makes it the natural pick for families and classrooms.',
  overallScore: 7.6,
  scores: [
    { criterionId: 'content-library', score: 7.0, note: 'A solid library with a distinctive spread of age-specific programs — children, teens, families, workplace.' },
    { criterionId: 'teaching', score: 7.5, note: 'Developed with psychologists and educators — sound, age-appropriate teaching.' },
    { criterionId: 'personalization', score: 6.5, note: 'Programs are grouped by age and setting rather than adaptively tailored.' },
    { criterionId: 'app-experience', score: 7.0, note: 'Simple and clean, if less polished than the big paid apps.' },
    { criterionId: 'free-tier', score: 10.0, note: 'Completely free — a nonprofit with no subscription and no paywall.' },
    { criterionId: 'value', score: 9.5, note: 'Free and nonprofit-run — exceptional value, especially for a whole family.' },
    { criterionId: 'evidence', score: 7.5, note: 'Built with psychologists and educators and widely used in schools and research.' },
  ],
  pros: [
    'Completely free, from a nonprofit',
    'Age-specific programs — children to adults',
    'Built with psychologists and educators',
    'Excellent for families and classrooms',
  ],
  cons: [
    'Less polished than the big paid apps',
    'Grouped by age rather than adaptively personalised',
    'Smaller library than the giants',
    'Light on advanced practice',
  ],
  bestFor: 'Best for families and schools — free, age-specific programs for children, teens and adults.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — from public information, app-store data and independent 2026 reviews. Not based on a long hands-on trial by ONDA.',
  price: { usd: 0, note: 'completely free; Australian nonprofit', asOf: '2026-05-15' },
  link: 'https://www.smilingmind.com.au',
  linkType: 'official',
  content: `## Where it leads

Smiling Mind is a completely free app from an Australian nonprofit, and its distinctive strength is breadth of audience rather than breadth of catalogue. It was built with psychologists and educators, and it offers age-specific programs — for children, teens, families, the workplace and healthcare workers. For a parent who wants one app the whole household can use, or for a classroom, nothing else here is as well suited.

## Where it falls short

It is plainer than the big paid apps — production and interface are simple, the library is smaller than the giants, and content is grouped by age and setting rather than adaptively tailored to you. For a solo adult chasing advanced practice, the depth runs out sooner than in Waking Up or Insight Timer.

## Who it is for

Choose Smiling Mind if you want a free, credible app for a family or a school — age-appropriate programs, no cost, no paywall. A solo practitioner who wants depth or a vast library will be better served elsewhere.

---

## Background reading

The science of what meditation actually does at the nervous-system level.

- [Neural bridge: the alpha-to-flow gateway](/articles/neural-bridge-alpha-flow-gateway) — the EEG transition from idle to engaged focus
- [Neural entrainment through meditation](/articles/neural-entrainment-meditation-2) — why structured practice rewires baseline cortical states
- [Quiet-mode alpha and the cortisol buffer](/articles/quiet-mode-alpha-cortisol-buffer) — the stress-regulation mechanism meditation engages
`,
  references: [
    { label: 'Smiling Mind — official site', url: 'https://www.smilingmind.com.au' },
    { label: 'Meditation app clinical research (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=meditation+app+randomized+controlled+trial' },
  ],
  relatedSlugs: ['healthy-minds-program', 'medito', 'headspace'],
  datePublished: '2026-05-15',
  dateModified: '2026-05-15',
}

export default smilingMind
