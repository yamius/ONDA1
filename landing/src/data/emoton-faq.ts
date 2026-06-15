// Emoton FAQ — source for the FAQPage JSON-LD injected at build (meta-inject.ts).
// Mirrors the VISIBLE FAQ rendered on /emoton (locales/en/emoton.json → seo.faq).
// Keep the two in sync if either changes (EN is the schema language).
export const EMOTON_FAQ: { q: string; a: string }[] = [
  {
    q: 'What is a feelings wheel?',
    a: 'A circular map of emotions you pick from to find the word closest to what you feel.',
  },
  {
    q: "How do I know what I'm feeling?",
    a: "Start broad: choose the area that's loudest right now, then the shade nearest. It doesn't have to be exact.",
  },
  {
    q: 'Is it free?',
    a: 'Yes — no account, no sign-up, nothing is saved.',
  },
  {
    q: 'Does it analyse or diagnose my emotions?',
    a: 'No. Emoton never reads, scores, or labels you. You name what you feel; it just holds the space.',
  },
  {
    q: 'What does "be with it" mean?',
    a: "Instead of fixing or pushing a feeling away, you let it be here a moment. Often that's what it was waiting for.",
  },
  {
    q: 'Do I have to turn on my camera?',
    a: 'Only if you choose a practice, and it reads pulse only, on your device.',
  },
]
