// Measurements FAQ — single source for the on-page FAQ (/measurements) and
// the FAQPage JSON-LD injected at build (scripts/meta-inject.ts). Keep in sync
// by importing from here in both places — never duplicate the Q/A text.

export interface MeasurementsFaqItem {
  q: string
  a: string
}

export const MEASUREMENTS_FAQ: MeasurementsFaqItem[] = [
  {
    q: 'What does ONDA actually measure?',
    a: 'ONDA measures heart rate via an Apple Watch, Apple Health or the iPhone camera (PPG) at rest, and reads heart-rate variability (HRV, SDNN) from Apple Health when an Apple Watch is connected. From those it derives your resting-HRV trend and, with an Apple Watch, a live coherence score. It does not measure blood biomarkers, brain activity or sleep stages.',
  },
  {
    q: 'Is ONDA’s coherence score a medical or clinical measurement?',
    a: 'No. Coherence is a derived synchronization metric — how rhythmically your heart rhythm oscillates with your breathing during a session. It is real-time biofeedback, not a clinical biomarker or diagnosis.',
  },
  {
    q: 'Do ONDA’s signals mean something is medically wrong?',
    a: 'No. ONDA’s signals are descriptive comparisons with your own baseline — interpretations to guide practice, not measurements of stress and not a medical assessment.',
  },
  {
    q: 'Can ONDA measure HRV without an Apple Watch?',
    a: 'Not yet — the iPhone camera measures your resting pulse and a breathing estimate; HRV appears once an Apple Watch (or another tracker writing HRV to Apple Health) is connected.',
  },
  {
    q: 'Is ONDA a medical device?',
    a: 'No. ONDA is an HRV biofeedback and guided-breathing app for training and self-regulation. It does not diagnose, treat or monitor any medical condition and is not a substitute for medical care.',
  },
]
