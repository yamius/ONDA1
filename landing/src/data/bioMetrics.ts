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
  flow: {
    key: 'flow',
    title: 'Flow: The State of Biological Resonance',
    shortTitle: '🌊 Flow',
    sections: [
      {
        heading: 'The Point of Optimum',
        body: 'Flow is the holy grail of performance. At ONDA, we estimate a flow-like pattern when the signal suggests synchronization: steady attention alongside internal calm. It points to the moment when you are absorbed in a task without your body paying an excessive price for it — an inference from your rhythm, not a direct read of your mind.',
      },
      {
        heading: 'What the Values Mean',
        bullets: [
          {
            label: '0–25% · Disconnected',
            text: 'The conditions for flow are absent — either the Alarm index is elevated, energy is low, or focus is scattered. Attempting deep work here is fighting the biology.',
          },
          {
            label: '25–50% · Approaching',
            text: 'The system is warming up toward coherence. Focus is beginning to establish itself, stress is declining. A short breathing exercise or a clear intention can push you into the zone.',
          },
          {
            label: '50–75% · In the Zone',
            text: 'Your signal looks consistent with a flow-like pattern: moderate HR, stable rhythm, low alarm. Conditions tend to favour sustained, high-quality work with minimal cognitive friction.',
          },
          {
            label: '75–100% · Deep Resonance',
            text: 'Rare and optimal. All three conditions are perfectly aligned — activation, stability, silence. This is the state where hours feel like minutes and output far exceeds effort. Protect it.',
          },
        ],
      },
      {
        heading: 'The Formula of Flow',
        body: 'Unlike an ordinary working state, Flow in ONDA has a distinct biometric signature:',
        bullets: [
          {
            label: 'Moderate Activation',
            text: 'Your heart rate is slightly above your resting baseline. This provides the brain with the necessary drive and resources without crossing into the alarm stage.',
          },
          {
            label: 'Rhythmic Stability',
            text: 'Your heart operates like a finely tuned machine — without jerks or chaos. This allows you to hold focus for hours without feeling mental friction.',
          },
          {
            label: 'Absence of Noise',
            text: 'The Alarm index is at zero. You are engaged but not overwhelmed. You aren\'t fighting the task; you are merging with it.',
          },
        ],
      },
      {
        heading: 'Why is it in ONDA?',
        body: 'The Flow state is the most efficient form of existence. Here, you produce maximum results with minimum attrition. ONDA helps you do more than just "stumble" into this state; it helps you understand which conditions (breathing, time of day, prep level) lead to it. We teach you to find your "zone," where the challenge perfectly meets your skill.',
      },
      {
        highlight: 'Flow is not luck; it is a biophysical skill. Tune your rhythm, remove the excess noise, and the world around you will vanish, leaving only you and your craft.',
      },
    ],
  },
  fatigue: {
    key: 'fatigue',
    title: 'Fatigue: The Physiological Tax on Effort',
    shortTitle: '🪫 Fatigue',
    sections: [
      {
        heading: 'The Cost of Movement',
        body: 'Fatigue in ONDA is more than just a desire to sleep. It is a rough estimate of the "biological cost" of your recent efforts. This estimate rises when your energy reserves look depleted and your stress signal stays elevated. It is a hint that your system may have shifted from efficient operation toward attrition.',
      },
      {
        heading: 'What the Values Mean',
        bullets: [
          {
            label: '0–20% · Recovered',
            text: 'Energy reserves are intact, stress is low, HRV is healthy. Your system is operating from a position of abundance — ready for high demands.',
          },
          {
            label: '20–45% · Accumulated Load',
            text: 'Normal end-of-day wear. Manageable with standard recovery: sleep, nutrition, a pause. Performance is slightly reduced but not yet compromised.',
          },
          {
            label: '45–70% · Depletion Zone',
            text: 'Energy deficit is significant. HRV is dropping, resting HR is creeping up, recovery after micro-stressors is slow. Continuing to push here increases error rate and burnout risk.',
          },
          {
            label: '70–100% · Biological Red Alert',
            text: 'The system is in attrition mode. Any attempt to "push through" yields diminishing returns at an accelerating cost. The only productive action is structured rest — sleep, stillness, or deep parasympathetic recovery.',
          },
        ],
      },
      {
        heading: 'The Anatomy of Depletion',
        body: 'Your body reports fatigue through three distinct biometric markers:',
        bullets: [
          {
            label: 'Reduced HRV',
            text: 'The heart loses its adaptability and fluidity, becoming "rigid" and monotonic.',
          },
          {
            label: 'Elevated Resting HR',
            text: 'Even while seated, your heart beats faster than usual, struggling to compensate for the deficit in internal resources.',
          },
          {
            label: 'Slow Recovery',
            text: 'Your ability to return to baseline after any micro-stressor (even a simple phone call) drops significantly.',
          },
        ],
      },
      {
        heading: 'Why is it in ONDA?',
        body: 'Fatigue is insidious because we often get used to it and stop noticing its weight. ONDA makes this invisible burden visible. A high Fatigue index is not a failure; it is a command to shift gears. This is the time when any attempt to "push through" will yield diminishing returns, increasing the risk of burnout and errors.',
      },
      {
        highlight: "Fatigue is your body's way of protecting its assets. Respect this signal. Sometimes, the most productive thing you can do is get a full night's sleep or an hour of silence.",
      },
    ],
  },
  excitement: {
    key: 'excitement',
    title: 'Excitement: The Energy of Anticipation',
    shortTitle: '✨ Excitement',
    sections: [
      {
        heading: 'Positive Drive',
        body: 'Excitement is the state of "bright" mobilization within your system. Much like anxiety, it involves a rise in heart rate and breathing frequency, but with a critical distinction: in ONDA, this index only climbs when your stress scores remain within a healthy range. We read this pattern as readiness for play, creativity, or a significant event rather than a threat response.',
      },
      {
        heading: 'What the Values Mean',
        bullets: [
          {
            label: '0–20% · Neutral',
            text: 'No positive arousal detected. The system is in a resting or low-activation state. Useful for recovery, but not for performance or creative output.',
          },
          {
            label: '20–50% · Mild Charge',
            text: 'A gentle energizing — the body is warming up with motivation and light anticipation. Ideal for starting tasks that require sustained engagement.',
          },
          {
            label: '50–75% · Drive',
            text: 'Clear positive mobilization with stable rhythm. HR is elevated but stress is contained. This is the optimal zone for high-performance work, sport, or creative flow.',
          },
          {
            label: '75–100% · Full Surge',
            text: 'Peak eustress. The system is fully primed. This state is rare and time-limited — use it strategically. It transitions into anxiety if stress scores begin to rise alongside.',
          },
        ],
      },
      {
        heading: 'The Biology of Joy',
        body: 'In a state of Excitement, your body prepares for action, but it does so efficiently:',
        bullets: [
          {
            label: 'Productive Surge',
            text: 'Your heart beats faster to saturate your muscles and brain with oxygen, yet the rhythm remains stable and confident.',
          },
          {
            label: 'Eustress',
            text: 'This is "positive stress" — the kind that doesn\'t drain your reserves but instead makes you feel alive and engaged.',
          },
          {
            label: 'Lack of Constraint',
            text: 'Unlike anxiety, there is no "tunnel vision" here. You maintain a broad perspective and a high capacity for creativity.',
          },
        ],
      },
      {
        heading: 'Why is it in ONDA?',
        body: 'We help you recalibrate your internal signals. Often, people mistake excitement for anxiety and try to suppress it. ONDA can hint at the difference: your heart rate is high, but your rhythm looks stable — a sign you may be charged rather than afraid. This insight allows you to use the energy of excitement as fuel for achievement rather than a reason for worry.',
      },
      {
        highlight: 'Excitement is energy directed outward. Embrace the surge; it is a sign that your system is primed for greatness.',
      },
    ],
  },
  focus: {
    key: 'focus',
    title: 'Focus / Concentration: The Physiology of Immersion',
    shortTitle: '🎯 Focus / Concentration',
    sections: [
      {
        heading: 'The Flow State',
        body: 'Focus / Concentration is not an act of will, but a result of harmony within your system. At ONDA, this index is calculated as the balance between your energy levels and the absence of internal noise (stress). It is our proxy for a focus-like state — when your energy is sufficient and internal noise (stress) stays low, so attention comes more easily.',
      },
      {
        heading: 'What the Values Mean',
        bullets: [
          {
            label: '0–25% · Scattered',
            text: 'High internal noise or low energy. Sustained attention is biologically inaccessible in this state. Tasks will demand disproportionate effort with poor output quality.',
          },
          {
            label: '25–50% · Warming Up',
            text: 'The system is partially available for focus. Surface-level tasks are possible, but deep cognitive work will be fragmented. A short breathing reset can shift you into the next zone.',
          },
          {
            label: '50–75% · Engaged',
            text: 'Energy is sufficient, stress is moderate. You are capable of sustained concentration. This is the standard working zone for most productive individuals.',
          },
          {
            label: '75–100% · Deep Focus',
            text: 'Optimal state. Prefrontal cortex is fully in control, amygdala is quiet, rhythm is stable. This pattern often accompanies flow — where effort fades and performance feels easy.',
          },
        ],
      },
      {
        heading: 'The Architecture of Attention',
        body: 'In ONDA, peak concentration occurs when three conditions are met:',
        bullets: [
          {
            label: 'Moderate Heart Rate',
            text: 'Your heart isn\'t racing, but it isn\'t "sleeping" either. This is the zone of optimal activation, where the brain receives just enough resources for complex tasks.',
          },
          {
            label: 'Stable Rhythm',
            text: 'The absence of sharp spikes (low CSI) means your nervous system isn\'t being distracted by internal interference.',
          },
          {
            label: 'Low Stress',
            text: 'Your amygdala is calm, allowing the prefrontal cortex to maintain total control over your attentional focus.',
          },
        ],
      },
      {
        heading: 'Why Does It Matter for ONDA?',
        body: 'We often mistake "busyness" for "productivity." The Focus index reveals the difference. You may be very busy, but if your concentration score is low, you are spending three times more energy on the same task. ONDA helps you notice moments that look like "Restful Alertness" — attentive yet physiologically calm.',
      },
      {
        highlight: "Focus isn't about what you do; it's about the state you're in. Create silence within your rhythm, and attention will follow naturally.",
      },
    ],
  },
  relaxation: {
    key: 'relaxation',
    title: 'Relaxation / Calmness: The State of Deep Stillness',
    shortTitle: '🌿 Relaxation / Calmness',
    sections: [
      {
        heading: 'The Art of Presence',
        body: 'Relaxation / Calmness is not merely the absence of stress; it is an active state of physiological wellbeing. At ONDA, this index is calculated as the inverse of chaos (CSI) combined with your energy reserve. It estimates how settled your rhythm looks — low cardiac noise alongside energy reserve — a proxy for readiness for high-quality rest or deep creativity.',
      },
      {
        heading: 'What the Values Mean',
        bullets: [
          {
            label: '0–25% · Surface Tension',
            text: 'The system is still carrying biological noise — elevated CSI, shallow breathing, or low energy reserve. True rest is not yet accessible. Intervention (slow breathing, stillness) is needed.',
          },
          {
            label: '25–50% · Settling',
            text: 'The nervous system is beginning to downshift. Rhythm is stabilizing. This is the transitional zone — the body is on its way to calm but has not arrived yet.',
          },
          {
            label: '50–75% · Active Calm',
            text: 'Low biological noise, steady breath, sufficient energy headroom. You are in Restful Alertness — fully present and open, without the undertone of vigilance.',
          },
          {
            label: '75–100% · Deep Stillness',
            text: 'Optimal state for regeneration, creativity, and deep focus. Tissue repair accelerates, immune activity peaks, and the brain shifts into consolidation and insight mode.',
          },
        ],
      },
      {
        heading: 'The Signature of "Restful Alertness"',
        body: 'A high Calmness score is the result of three synchronized factors:',
        bullets: [
          {
            label: 'Rhythmic Purity',
            text: 'Your heart beats with minimal unjustified fluctuations (low CSI).',
          },
          {
            label: 'Stable Breathing',
            text: 'A slow, steady rhythm of inhales and exhales that nourishes the brain without overtaxing the system.',
          },
          {
            label: 'Biological Headroom',
            text: 'Your heart has ample "cardiovascular headroom" (Energy Reserve), allowing you to remain relaxed even as your environment shifts.',
          },
        ],
      },
      {
        heading: 'Why Does It Matter for ONDA?',
        body: 'The Calmness state is the mode where your body shifts from survival to thriving. It is in this zone that maximum tissue regeneration, immune strengthening, and neural "rewiring" occur. We track this metric so you can learn not just to relax, but to achieve Restful Alertness — a state where you are profoundly calm yet entirely present and attentive.',
      },
      {
        highlight: 'Relaxation is not weakness; it is the ultimate form of efficiency. The higher your Calmness index, the less effort it takes to remain yourself.',
      },
    ],
  },
  alarm: {
    key: 'alarm',
    title: 'Alarm / Anxiety: Your System\'s Code Red',
    shortTitle: '🚨 Alarm / Anxiety',
    sections: [
      {
        heading: 'The Invisible Threat Detector',
        body: 'Alarm / Anxiety is a composite index within ONDA that analyzes the synergy between your heart rate and your breathing. We look for a specific pattern: a simultaneous rise in HR and an increased respiratory rate. This is a pattern often linked to the "Fight-or-Flight" response. The index flags when that pattern appears — a cue to check in with yourself, not a diagnosis.',
      },
      {
        heading: 'What the Values Mean',
        bullets: [
          {
            label: '0–20% · Baseline Calm',
            text: 'No alarm signals detected. HR and breathing are in a balanced, low-arousal state. Your nervous system is fully in parasympathetic mode.',
          },
          {
            label: '20–50% · Mild Activation',
            text: 'Low-level arousal — normal during focused work or light activity. The body is alert but not mobilized. Manageable without intervention.',
          },
          {
            label: '50–75% · Elevated Alarm',
            text: 'Clear fight-or-flight pattern emerging. HR is rising alongside breathing rate. This is the zone of unnoticed chronic stress — you may feel "fine," but your biology disagrees.',
          },
          {
            label: '75–100% · Acute Mobilization',
            text: 'Full sympathetic surge. The amygdala has taken control. Cortisol and adrenaline are spiking. Immediate intervention — a deep exhale, a pause, breath-hold reset — is highly effective here.',
          },
        ],
      },
      {
        heading: 'The Psychosomatic Echo',
        body: 'High values in this index indicate that your body is in a state of acute mobilization:',
        bullets: [
          {
            label: 'Biological Level',
            text: 'Blood shifts from digestive organs to muscles, the brain receives a signal of external danger, and cortisol levels spike.',
          },
          {
            label: 'Mental Level',
            text: 'The prefrontal cortex (responsible for logic) gives way to the amygdala. You begin to experience restlessness, tunnel vision, or cognitive "tightness."',
          },
        ],
      },
      {
        heading: 'Why is it in ONDA?',
        body: 'Anxiety often masks itself as ordinary fatigue or high productivity. The Alarm index can hint at this: you might just be drinking coffee, yet your rhythm looks like the body is bracing for a threat. ONDA gives you the chance to spot this pattern early and use conscious breathing to "cancel" the alarm signal before it turns into a panic attack or total burnout.',
      },
      {
        highlight: 'Your body cannot lie. If the Alarm index is rising, it\'s not a reason to panic — it\'s a reason for a deep exhale. Reclaim control through your body when your mind feels powerless.',
      },
    ],
  },
  acceleration: {
    key: 'acceleration',
    title: 'HR Acceleration: The Intensity of Biological Response',
    shortTitle: '⚡ HR Acceleration',
    sections: [
      {
        heading: 'Dynamics Beyond Speed',
        body: 'HR Acceleration is the second derivative of your heart rhythm. While the Trend Slope shows the direction of your movement, Acceleration measures the intensity with which that movement gains momentum. It is a gauge of how sharply your system "hits the gas" or, conversely, how smoothly it begins to apply the brakes.',
      },
      {
        heading: 'Reading the Impulse',
        body: 'Acceleration reveals the hidden dynamics of your adaptation:',
        bullets: [
          {
            label: 'Positive Acceleration · The Surge',
            text: 'Your heart rate is beginning to speed up faster than it was a second ago. This is a sign of an "acute" reaction—such as a sudden startle, a sharp thought about a deadline, or a physical burst. Your sympathetic system is firing at full capacity, mobilizing resources right here and right now.',
          },
          {
            label: 'Negative Acceleration · The Deceleration',
            text: 'The rate of change in your heart rate is falling. Even if your heart is still beating fast, it has stopped accelerating. This is the first sign that the peak has passed and the system is beginning to stabilize. You are regaining control over the stress.',
          },
        ],
      },
      {
        heading: 'Why is it in ONDA?',
        body: 'HR Acceleration is a detector of your reactivity. Excessively sharp spikes in acceleration can indicate high anxiety or a low stress-tolerance threshold. ONDA tracks these "jerks," helping you develop biological smoothness—the ability to enter high-performance states without the jarring and exhausting surges that drain your system.',
      },
      {
        highlight: 'Power is not in the surge, but in the smoothness of the transition. The fewer sharp accelerations in your rhythm, the more carefully you preserve your vital energy.',
      },
    ],
  },
  slope: {
    key: 'slope',
    title: 'HR Trend Slope: The Vector of Biological Direction',
    shortTitle: '📈 HR Trend Slope',
    sections: [
      {
        heading: 'The Direction of Flow',
        body: 'HR Trend Slope is a mathematical indicator of where your system is headed right now. We use linear regression to understand the overall trajectory of your heart rate throughout the measurement window. It\'s not just a number; it\'s a compass needle pointing toward your immediate physiological future.',
      },
      {
        heading: 'Reading the Vector',
        body: 'The direction of the slope speaks to the dynamics of your adaptation:',
        bullets: [
          {
            label: 'Negative Slope · Descending',
            text: 'Your heart rate is gradually slowing down. This is the classic "relaxation response." Your nervous system is successfully dampening arousal and shifting into recovery mode. This is the ideal scenario for meditation or winding down after work.',
          },
          {
            label: 'Positive Slope · Ascending',
            text: 'Your heart rate is accelerating. This signals rising emotional or physical arousal. Your body is preparing for action or reacting to a stressor that emerged during the session.',
          },
          {
            label: 'Zero Slope · Plateau',
            text: 'A steady state. Your system is in equilibrium, maintaining its current level of activation without sharp fluctuations.',
          },
        ],
      },
      {
        heading: 'Why is it in ONDA?',
        body: 'Trend Slope allows you to see the inertia of your nervous system. If you are trying to relax but the trend remains positive, it means your "braking system" hasn\'t kicked in yet. This metric helps you understand how effectively your chosen practice (breathing, music, a pause) is actually shifting your biological course.',
      },
      {
        highlight: "It's not about where you are, but which way you're moving. A negative trend is your ticket to a state of deep restoration.",
      },
    ],
  },
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
        body: 'At ONDA, Energy % is less a subjective feeling of alertness and more a rough estimate of your cardiovascular reserve. It is a mathematical ratio of how far your heart rate is from its elevated ceiling and how stable your cardiac rhythm is at this very second. The higher the score, the more physiological headroom your body likely has to handle new tasks.',
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
        body: 'At ONDA, Stress % is less a psychological state and more a rough index of irregularity in your cardiac rhythm. This score is derived from the Cardiac Stability Index: instead of just your pulse, it looks at the micro-deviations between beats. The more irregularity and "noise" in these intervals, the higher the estimated stress score — a directional signal, not a clinical stress measurement.',
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
        body: 'The most dangerous stress is the kind you don\'t feel. You might be sitting in silence, yet your Stress % reads high. That can reflect things like poor sleep, illness, or information overload — though the score alone can\'t tell you which. Treat it as a prompt to check in with yourself and pause before exhaustion sets in, not as a diagnosis.',
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
