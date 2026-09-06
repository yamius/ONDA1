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
    a: 'ONDA directly measures heart rate and heart-rate variability (HRV, as RMSSD/SDNN) from beat-to-beat intervals — via Apple Watch or Apple Health, or the iPhone camera (PPG) at rest. From those it derives a live coherence score and your resting-HRV trend, and estimates contextual "stress" and "energy". It does not measure blood biomarkers, brain activity or sleep stages.',
  },
  {
    q: 'Is ONDA’s coherence score a medical or clinical measurement?',
    a: 'No. Coherence is a derived synchronization metric — how rhythmically your heart rhythm oscillates with your breathing during a session. It is real-time biofeedback, not a clinical biomarker or diagnosis.',
  },
  {
    q: 'Does ONDA’s stress score mean I am clinically stressed?',
    a: 'No. The stress and energy scores are ONDA’s estimates from your HR and HRV patterns — interpretations to guide practice, not measurements of stress and not a medical assessment.',
  },
  {
    q: 'Can ONDA measure HRV without an Apple Watch?',
    a: 'Yes — the iPhone camera measures your pulse (PPG) at rest, which ONDA uses to compute HRV. An Apple Watch adds continuous heart data and live feedback, but is not required for a resting HRV reading.',
  },
  {
    q: 'Is ONDA a medical device?',
    a: 'No. ONDA is an HRV biofeedback and guided-breathing app for training and self-regulation. It does not diagnose, treat or monitor any medical condition and is not a substitute for medical care.',
  },
]
