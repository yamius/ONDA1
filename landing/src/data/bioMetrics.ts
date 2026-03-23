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
  recovery: {
    key: 'recovery',
    title: 'Recovery Rate: The Index of Returning to Self',
    shortTitle: '🔄 Recovery Rate %',
    sections: [
      {
        heading: 'The Art of the Finish',
        body: 'Recovery Rate is a measure of how effectively your heart can "downshift" after exertion. At ONDA, we calculate how quickly your heart rate returns from its peak during the current session to your baseline average. It is a measurement of your ability to exit a state of arousal and return to your center of gravity.',
      },
      {
        heading: 'Why Does It Matter?',
        body: 'In the wild, survival belongs not to the one who runs the fastest, but to the one who calms down the quickest after the chase. In the modern world, it works the same way:',
        bullets: [
          {
            label: '0% · Stuck',
            text: 'Your heart rate is frozen at its peak. Your body continues to "fight shadows" even after the external trigger is gone. This is a sign of nervous system rigidity and accumulated fatigue.',
          },
          {
            label: '100% · Full Calm',
            text: 'Your heart has completely returned to its baseline or even lower. This is the gold standard of biological flexibility.',
          },
        ],
      },
      {
        heading: 'The Biological Echo',
        body: 'Your recovery speed depends directly on the tone of your Vagus Nerve. A high Recovery Rate means your "parasympathetic brake" is functioning perfectly. This allows you to switch between tasks without carrying the stress of the previous moment into the next.',
      },
      {
        highlight: "It's not the height of the peak that matters, but the speed of the descent. True power lies in the ability to quickly return to a state of equilibrium.",
      },
    ],
  },
  csi: {
    key: 'csi',
    title: 'CSI: Cardiac Stability Index',
    shortTitle: '🎯 Cardiac Stability Index (CSI)',
    sections: [
      {
        heading: 'The Architecture of Rhythm',
        body: 'CSI (Cardiac Stability Index) is a unique coefficient that allows ONDA to look deeper than a regular pulse. We take the standard deviation of your heart cycles and divide it by the mean heart rate. This allows us to measure the pure consistency of your heart, independent of how fast it happens to be beating at the moment.',
      },
      {
        heading: 'Stability vs. Chaos',
        body: 'CSI is the detector of "biological noise" within your system:',
        bullets: [
          {
            label: '0.03 – 0.10 · Diamond Stability',
            text: 'Your heart is operating with the precision of a Swiss watch. This is a state of deep physiological confidence. The system wastes no resources on unnecessary fluctuations, operating in a mode of maximum economy and focus.',
          },
          {
            label: '0.11 – 0.24 · Dynamic Balance',
            text: 'The natural rhythm of a living organism. Your heart fluidly adjusts to external stimuli while maintaining its overall structural integrity.',
          },
          {
            label: '0.25+ · Biological Noise',
            text: 'A signal of instability. High CSI often indicates "glitches" in nerve impulse transmission, extreme fatigue, or measurement noise. This is a state where the system is losing control over its rhythm.',
          },
        ],
      },
      {
        heading: 'Why Does It Matter for ONDA?',
        body: 'CSI is the foundation upon which your Stress % is built. While HRV tells us about your flexibility, CSI informs us about your structural reliability. A low CSI is a sign that your internal "operating system" is running without errors in the code.',
      },
      {
        highlight: 'True power lies in stability. The less noise in your rhythm, the more clarity in your mind.',
      },
    ],
  },
  hrv: {
    key: 'hrv',
    title: 'HRV: The Index of Your Biological Agility',
    shortTitle: '📊 HRV (RMSSD)',
    sections: [
      {
        heading: 'The Internal Microscope',
        body: 'HRV (Heart Rate Variability) is the most sophisticated and informative metric in the ONDA arsenal. Unlike heart rate, which simply counts beats, HRV measures the microscopic fluctuations in time between those beats in milliseconds. We use the RMSSD algorithm to assess how fluidly your heart responds to every movement, thought, or breath.',
      },
      {
        heading: 'A Mirror of the Vagus Nerve',
        body: 'HRV is a direct status report on your Vagus Nerve activity:',
        bullets: [
          {
            label: 'High HRV (40–70 ms and above)',
            text: 'Your heart adapts instantly to changes. This is a sign of a powerful parasympathetic response. You are in a state of high biological resilience: calm, focused, and ready for action.',
          },
          {
            label: 'Low HRV (below 20–25 ms)',
            text: 'Your autonomic nervous system is "locked." Your heart is beating too metrically, like a robot. This is a signal that your recovery resources are drained, and the system is operating at the edge of its adaptive capacity.',
          },
        ],
      },
      {
        heading: 'Why It Matters More Than Pulse',
        body: 'Two people can have the exact same heart rate, but entirely different health profiles. The difference lies in HRV. High variability means your "internal OS" is constantly scanning the environment and micro-adjusting your rhythm. Low variability is a sign of biological fragility.',
      },
      {
        heading: 'Training with ONDA',
        body: 'HRV is dynamic. It drops due to alcohol, lack of sleep, or overtraining, but it can be "strengthened." By using the breathing protocols in ONDA, you are essentially exercising your Vagus Nerve, raising your baseline HRV and, consequently, your resilience to life\'s storms.',
      },
      {
        highlight: 'High HRV is your ability to bend without breaking. It is the measure of your life force, expressed in milliseconds.',
      },
    ],
  },
  energy: {
    key: 'energy',
    title: 'Energy %: Your Biological Power Reserve',
    shortTitle: '🔋 Energy %',
    sections: [
      {
        heading: 'Your Internal Battery',
        body: 'At ONDA, Energy % is not a subjective feeling of alertness; it is an objective measurement of your cardiovascular reserve. It is a mathematical ratio of how far your heart rate is from its elevated ceiling and how stable your cardiac rhythm is at this very second. The higher the score, the more physiological capacity your body has to handle new tasks.',
      },
      {
        heading: 'The Anatomy of Depletion',
        body: 'Your Energy score inevitably drops under the influence of three factors:',
        bullets: [
          {
            label: 'Accumulated Fatigue',
            text: 'When the system fails to recover sufficiently during sleep.',
          },
          {
            label: 'High BPM',
            text: 'Running at "high RPMs" quickly burns through available fuel.',
          },
          {
            label: 'Prolonged Stress',
            text: 'Constant turbulence in your rhythm (low stability) forces the heart to spend more resources just to maintain basic functions.',
          },
        ],
      },
      {
        heading: 'What the Numbers Tell You',
        body: '',
        bullets: [
          {
            label: '80–100% · Full Charge',
            text: 'Your system is in a state of abundance. You are ready for intense cognitive loads, demanding workouts, and strategic decision-making.',
          },
          {
            label: '40–70% · Operating Range',
            text: 'Reserves are beginning to dwindle. It\'s time to pace yourself. Your efficiency is still high, but the "price" of each subsequent effort is rising.',
          },
          {
            label: 'Below 30% · Critical Low',
            text: 'You are operating "on credit." In this state, your body perceives any new event as a threat. The brain enters a strict power-saving mode, dialing down creativity and empathy.',
          },
        ],
      },
      {
        heading: 'The Art of Recharging',
        body: 'Energy % is our most dynamic metric. It can plummet after a difficult conversation and surge after 10 minutes of deep meditation or a short walk. ONDA helps you see these fluctuations in real-time, turning energy management from guesswork into an exact science.',
      },
      {
        highlight: "Don't wait for the tank to hit empty. A high Energy Score is your insurance against mistakes. If the score is in the red zone, any work will be counterproductive. Charge the system first, then act.",
      },
    ],
  },
  stress: {
    key: 'stress',
    title: 'Stress %: The Biological Turbulence Index',
    shortTitle: '⚡ Stress %',
    sections: [
      {
        heading: 'Beyond Emotions',
        body: 'At ONDA, Stress % is not a psychological state; it is a mathematical measurement of chaos within your system. This score is derived from the Cardiac Stability Index. We don\'t just analyze your pulse; we examine the micro-deviations in the rhythm of every single beat. The higher the irregularity and "noise" in these intervals, the higher your biological stress score.',
      },
      {
        heading: 'What Does Your Score Mean?',
        body: 'Stress is the "spending" of your life force. We\'ve categorized it into three zones:',
        bullets: [
          {
            label: '0 – 30% · The Flow Zone',
            text: 'Your system is in a state of coherence. Your heart is working rhythmically and efficiently. This is the ideal time for complex decision-making and deep work.',
          },
          {
            label: '30 – 60% · The Adaptive Zone',
            text: 'You are under a load. This is a normal state during an active day, but if you remain here for too long, your cognitive resources begin to drain.',
          },
          {
            label: '60%+ · The Burnout Zone',
            text: 'Acute physiological stress. Your nervous system is overwhelmed. In this state, the brain dials down the prefrontal cortex (logic) and shifts control to the amygdala (fear and impulsivity).',
          },
        ],
      },
      {
        heading: 'Why Does It Matter?',
        body: 'The most dangerous stress is the kind you don\'t feel. You might be sitting in silence, yet your Stress % shows 70%. This means an invisible struggle is happening inside: lack of sleep, hidden inflammation, or information overload. ONDA makes the invisible visible, allowing you to hit pause before exhaustion sets in.',
      },
      {
        highlight: 'Stress isn\'t what happens to you; it\'s how your body spends its resources in response. A high percentage is a signal to re-evaluate your priorities in this very moment.',
      },
    ],
  },
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
