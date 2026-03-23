export interface DetailSection {
  heading?: string
  body?: string
  bullets?: { label: string; text: string }[]
  highlight?: string
}

export interface MetricDetail {
  key: string
  title: string
  shortTitle: string
  sections: DetailSection[]
}

export const METRIC_DETAILS: Record<string, MetricDetail> = {
  bpm: {
    key: 'bpm',
    title: 'BPM: The Rhythm of Your Internal Operating System',
    shortTitle: '❤️ BPM — Heart Rate',
    sections: [
      {
        heading: 'The Biological Metronome',
        body: 'BPM (Beats Per Minute) is more than just the speed at which your heart pumps blood. Within the ONDA ecosystem, we view the pulse as the primary interface of your Autonomic Nervous System. It is a live graph of how your body allocates resources in response to the challenges of the outside world.',
      },
      {
        heading: 'A Symphony of Two States',
        body: 'Your heart is constantly balancing between two "conductors":',
        bullets: [
          {
            label: 'Sympathetic Drive',
            text: 'When your pulse rises, your body enters a high-performance or defensive mode. This is mobilization — essential for a sprint, but toxic when sustained.',
          },
          {
            label: 'Parasympathetic Calm',
            text: 'A low heart rate is a signal of safety. In this state, the body initiates tissue regeneration, memory consolidation, and deep recovery.',
          },
        ],
      },
      {
        heading: 'Why Do We Track the Numbers?',
        body: 'Your resting heart rate is your baseline biological cost of living.',
        bullets: [
          {
            label: 'High BPM while seated',
            text: 'You are wasting energy. Your body is "running a marathon" while you are simply answering emails. This is a direct path to cognitive burnout.',
          },
          {
            label: 'Optimal BPM',
            text: 'This is the "silent cruise" mode — where the system operates at maximum efficiency, leaving a massive reserve for unexpected tasks.',
          },
        ],
      },
      {
        heading: 'A Tool for Calibration',
        body: "BPM in the ONDA app is a mirror. By noticing an abnormal spike in your pulse, you gain the opportunity to intervene consciously. We don't just measure beats; we teach you to master them. A short breathing session or a shift in focus can instantly \"drop\" your pulse, switching your brain from survival mode to creative flow.",
      },
      {
        highlight: 'A high pulse is expensive. A low pulse is intentional. Manage the rhythm to manage your life.',
      },
    ],
  },
}
