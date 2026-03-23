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
  br: {
    key: 'br',
    title: 'Breathing Rate: The Bridge Between Worlds',
    shortTitle: '🌬️ /min — Breathing Rate',
    sections: [
      {
        heading: 'The Only Manual Override',
        body: 'Breathing Rate is a unique biometric parameter. Unlike your heartbeat or digestion, breathing is the only function of the Autonomic Nervous System that you can control directly. It is your "remote control" for your internal state.',
      },
      {
        heading: 'The Rhythm of Calm vs. The Rhythm of Survival',
        body: 'Your breathing frequency is a live broadcast of how your brain perceives its environment:',
        bullets: [
          {
            label: 'Shallow and Fast Breathing',
            text: 'An alarm signal. When you breathe from the upper chest more than 16–20 times per minute, you are telling your body: "We are in danger." This sustains high cortisol levels and keeps the brain in a state of constant vigilance.',
          },
          {
            label: 'Deep and Slow Breathing',
            text: 'A safety signal. Reducing your frequency to 6–10 cycles per minute activates the Vagus Nerve. This instantly shifts the system into a mode of deep focus and emotional stability.',
          },
        ],
      },
      {
        heading: 'Biological Feedback',
        body: 'At ONDA, we track your breathing rate to identify moments of "Screen Apnea"—when you unconsciously hold your breath or breathe erratically while checking emails or performing complex tasks. These micro-pauses trigger a cascade of stress responses that you might not even notice.',
      },
      {
        heading: 'The Art of Slowing Down',
        body: 'Optimal breathing at rest is a rhythm that is almost invisible. The fewer cycles you need to saturate your blood with oxygen, the more efficiently your metabolic system is functioning. We teach you to "under-breathe"—making each breath rarer but higher in quality, turning every cycle into an act of restoration.',
      },
      {
        highlight: 'Breathing is the only way to speak to your heart in its own language. By slowing the inhale, you dictate peace to your mind.',
      },
    ],
  },
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
