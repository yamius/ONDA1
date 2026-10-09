import type { ToolReviewInput } from './types'

const sleepio: ToolReviewInput = {
  slug: 'sleepio',
  name: 'Sleepio',
  brand: 'Big Health',
  category: 'sleep-app',
  productType: 'Digital CBT-I program',
  description:
    'ONDA review of Sleepio — a clinically validated digital CBT-I program that treats insomnia rather than just tracking sleep. Scored on sleep science and outcomes.',
  verdict:
    'The most clinically serious app here — a validated CBT-I course that treats insomnia, not a tracker or a sound library; the strongest pick if you have a real sleep problem.',
  summary:
    'Sleepio is not a tracker or a soundscape app — it is a digital course of cognitive behavioural therapy for insomnia (CBT-I), the first-line clinical treatment. It is delivered over weekly sessions, is backed by published trials, and is the one app here built to actually treat a sleep disorder.',
  scores: [
    { criterionId: 'tracking-accuracy', score: 6.0, note: 'A sleep diary rather than sensor tracking — the data that drives the CBT-I program.' },
    { criterionId: 'wind-down-content', score: 5.0, note: 'Some relaxation tools, but content is not the point — the therapy course is.' },
    { criterionId: 'sleep-science', score: 9.5, note: 'A genuine CBT-I program — the first-line clinical treatment for insomnia — with published trial evidence.' },
    { criterionId: 'insights', score: 7.5, note: 'Progress tracked against the course; diary-driven, focused on the treatment.' },
    { criterionId: 'app-experience', score: 7.0, note: 'A structured, week-by-week course — it asks for commitment, not browsing.' },
    { criterionId: 'free-tier', score: 4.5, note: 'No real free tier — but in some regions it is available free through a health service.' },
    { criterionId: 'value', score: 7.0, note: 'Costly direct, but free via some employers and health systems — and it treats a disorder.' },
  ],
  pros: [
    'A genuine, clinically validated CBT-I program',
    'Treats insomnia rather than just measuring it',
    'Strong published trial evidence',
    'Free in some regions via health services or employers',
  ],
  cons: [
    'Not a tracker or a sound library',
    'Asks for real commitment over several weeks',
    'No meaningful free tier if you pay directly',
    'Overkill if you sleep fine and just want stats',
  ],
  bestFor: 'Best for anyone with genuine insomnia who wants treatment, not tracking.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — from public information, published trials and independent 2026 reviews. Not based on a long hands-on trial by ONDA.',
  price: { usd: 400, note: 'varies; free in some regions via health services or employers', asOf: '2026-05-16' },
  link: 'https://www.sleepio.com',
  linkType: 'official',
  content: `## Where it leads

Sleepio is the only app here that sets out to treat a sleep disorder rather than measure or soothe one. It delivers cognitive behavioural therapy for insomnia (CBT-I) — the first-line clinical treatment — as a structured, week-by-week course, driven by a sleep diary. It is backed by published randomised trials, and in some regions it is offered free through a health service or employer. If you have genuine insomnia, this is the clinically serious choice.

## What are the downsides of Sleepio?

It is not a tracker and not a sound library — if you want nightly stats or soundscapes, it is the wrong app. The course asks for real commitment over several weeks, and paid directly it is expensive. For someone who sleeps fine and just wants data, it is overkill.

## Who should buy Sleepio?

Choose Sleepio if you have a real, persistent sleep problem and want evidence-based treatment. If you sleep adequately and want measurement or relaxation, a tracker like Sleep Cycle or a library like BetterSleep is the better fit.

---

## Background reading

The sleep biology behind what these apps measure and the protocols they support.

- [Circadian reset: mastering light](/articles/circadian-reset-mastering-light) — why light timing dominates sleep quality more than anything else
- [Circadian lighting and dark therapy](/articles/circadian-lighting-dark-therapy) — the protocol layer that compounds with tracking
- [Ancestral sync and circadian anchors](/articles/ancestral-sync-circadian-anchors) — the inputs that keep circadian timing stable across travel and shift work
`,
  references: [
    { label: 'Sleepio — official site', url: 'https://www.sleepio.com' },
    { label: 'Digital CBT-I clinical trials (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=digital+CBT-I+insomnia' },
  ],
  relatedSlugs: ['sleep-cycle', 'rise', 'bettersleep'],
  faq: [
    { q: "Is Sleepio worth it?", a: "Sleepio is worth it if you have genuine insomnia and want treatment rather than tracking. It is a clinically validated CBT-I program with strong published trial evidence. It asks for real commitment over several weeks, and it is overkill if you sleep fine and just want stats." },
    { q: "How much does Sleepio cost?", a: "Sleepio costs around $400, though pricing varies. It is free in some regions through health services or employers, so check that route first. If you pay directly, there is no meaningful free tier to try before committing." },
    { q: "What are the downsides of Sleepio?", a: "Sleepio is not a tracker or a sound library, and it requires real commitment over several weeks. If you pay directly, there is no meaningful free tier. It is also overkill for people who sleep fine and only want sleep statistics." },
  ],
  datePublished: '2026-05-16',
  dateModified: '2026-10-10',
}

export default sleepio
