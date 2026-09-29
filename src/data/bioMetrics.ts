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

// Texts describe the app's OWN formulas in src/hooks/useVitals.ts (heart-rate
// samples from Apple Watch / HealthKit or a Bluetooth strap, ~45 s window,
// recomputed every 2 s). They intentionally differ from the website's
// in-browser camera tool, which uses different math.

const SOURCE_NOTE =
  'Everything on this screen is calculated from heart-rate samples (beats per minute), roughly one per second, from your Apple Watch / Apple Health or a Bluetooth heart-rate strap. The app does not receive beat-to-beat (RR) intervals, so it works with the ups and downs of your heart rate over the last ~45 seconds.'

const HEALTH_NOTE =
  'This is a wellness tool, not a medical device. If you notice an irregular pulse, unusual palpitations, or a heart rate that is often very high or very low at rest, talk to a doctor.'

const HEURISTIC_NOTE =
  'This is an experimental heuristic score, not a validated scientific measure, and it does not detect emotions. It only combines how your current heart rate and estimated breathing compare with your own recent values. "Breathing steadiness" means how little your estimated breathing rate has varied over the last ~30 seconds (its spread relative to its average). Use it as a rough direction signal and compare it with how you actually feel.'

export const METRIC_DETAILS: Record<string, MetricDetail> = {
  flow: {
    key: 'flow',
    title: 'Flow (experimental)',
    shortTitle: '🌊 Flow',
    sections: [
      {
        heading: 'What this number shows',
        body: 'A 0–100 score that is higher when your heart rate sits slightly above your usual level (not too low, not too high), your estimated breathing is steady, and the Stress score is low. It is a guess at a "calm but engaged" state, not a measurement of the psychological flow state.',
      },
      {
        heading: 'How the app calculates it',
        body: 'The app places your current heart rate on a 0–1 scale relative to your running personal average. Half of the score rewards being close to the middle-upper part of that scale (a peak around 0.55); 30% comes from breathing steadiness; 20% comes from a low Stress score. The result is scaled to 0–100 and updated every 2 seconds.',
      },
      {
        heading: 'How to read it',
        bullets: [
          { label: 'Higher', text: 'Moderate heart rate, steady breathing, low Stress — conditions that often go with calm, focused work.' },
          { label: 'Lower', text: 'Heart rate clearly above or below your usual level, or a high Stress score.' },
        ],
      },
      {
        heading: 'Limits',
        body: HEURISTIC_NOTE + ' Because it rewards a "middle" heart rate, very relaxed states and very active states both score lower.',
      },
      {
        highlight: 'Treat Flow as a hint, not a verdict. If the score and your experience disagree, trust your experience.',
      },
    ],
  },
  fatigue: {
    key: 'fatigue',
    title: 'Fatigue (experimental)',
    shortTitle: '🪫 Fatigue',
    sections: [
      {
        heading: 'What this number shows',
        body: 'A 0–100 score that rises when your heart rate and estimated breathing rate are above your usual level and the Energy score is low. It does not measure tiredness, sleep debt, or recovery directly.',
      },
      {
        heading: 'How the app calculates it',
        body: '50% from how high your current heart rate is compared with your running personal average, 20% from how high your estimated breathing rate is compared with its average, and 30% from a low Energy score. Scaled to 0–100, updated every 2 seconds.',
      },
      {
        heading: 'How to read it',
        bullets: [
          { label: 'Higher', text: 'Heart rate and breathing above your usual level with low Energy. This can come from tiredness, but also from caffeine, heat, standing up, talking, or recent movement.' },
          { label: 'Lower', text: 'Heart rate and breathing at or below your usual level.' },
        ],
      },
      {
        heading: 'Limits',
        body: HEURISTIC_NOTE + ' Real fatigue is better judged over days — sleep, how you feel, and trends like resting heart rate in Apple Health.',
      },
      {
        highlight: 'If you feel worn out, rest is a good idea whatever this number says.',
      },
    ],
  },
  excitement: {
    key: 'excitement',
    title: 'Excitement (experimental)',
    shortTitle: '✨ Excitement',
    sections: [
      {
        heading: 'What this number shows',
        body: 'A 0–100 score that mostly reacts to your heart rate rising right now. It tells you that your pulse is climbing, not whether that feels like excitement, anxiety, or just walking up stairs.',
      },
      {
        heading: 'How the app calculates it',
        body: '60% from how fast your heart rate is currently rising (a smoothed change over the last few samples; a rise of about 0.5 bpm per second or more counts as full), 30% from how high your heart rate is versus your personal average, and 10% from how high your estimated breathing rate is. Scaled to 0–100, updated every 2 seconds.',
      },
      {
        heading: 'How to read it',
        bullets: [
          { label: 'Higher', text: 'Your heart rate is going up and is above your usual level.' },
          { label: 'Near zero', text: 'Your heart rate is steady or falling.' },
        ],
      },
      {
        heading: 'Limits',
        body: HEURISTIC_NOTE + ' Any movement, talking, or standing up will push it up.',
      },
      {
        highlight: 'The body looks similar in excitement and anxiety. Only you can tell which one it is.',
      },
    ],
  },
  focus: {
    key: 'focus',
    title: 'Focus / Concentration (experimental)',
    shortTitle: '🎯 Focus / Concentration',
    sections: [
      {
        heading: 'What this number shows',
        body: 'A 0–100 score that is higher when your heart rate is moderately above your usual level, heart rate is not swinging much, and breathing looks steady. It is a guess based on heart rate only — it cannot measure attention.',
      },
      {
        heading: 'How the app calculates it',
        body: '50% rewards a heart rate near the middle-upper part of your personal range (peak around 0.55 on a 0–1 scale built from your running average); 30% rewards a small spread of heart rate in the current window (the lower the "HRV (estimate)" number, the more points; about 6 bpm or more gives none); 20% comes from breathing steadiness. Scaled to 0–100, updated every 2 seconds.',
      },
      {
        heading: 'How to read it',
        bullets: [
          { label: 'Higher', text: 'Moderate, steady heart rate — a pattern that can go with calm, focused activity.' },
          { label: 'Lower', text: 'Heart rate well above or below your usual level, or swinging a lot.' },
        ],
      },
      {
        heading: 'Limits',
        body: HEURISTIC_NOTE,
      },
      {
        highlight: 'Use it to notice patterns over time, not to grade a single moment.',
      },
    ],
  },
  relaxation: {
    key: 'relaxation',
    title: 'Relaxation / Calmness (experimental)',
    shortTitle: '🌿 Relaxation / Calmness',
    sections: [
      {
        heading: 'What this number shows',
        body: 'A 0–100 score that is higher when your heart rate is below your usual level, breathing looks steady, and the Stress score is low.',
      },
      {
        heading: 'How the app calculates it',
        body: '50% from how low your current heart rate is compared with your running personal average, 30% from breathing steadiness, and 20% from a low Stress score. Scaled to 0–100, updated every 2 seconds.',
      },
      {
        heading: 'How to read it',
        bullets: [
          { label: 'Rising', text: 'Your heart rate is settling below your recent average — common during slow, relaxed breathing or sitting still.' },
          { label: 'Falling', text: 'Your heart rate is climbing above your recent average.' },
        ],
      },
      {
        heading: 'What affects it',
        body: 'Posture, movement, talking, caffeine, temperature, and how long you have been still. A few minutes of quiet sitting and slow, comfortable breathing often raise it.',
      },
      {
        heading: 'Limits',
        body: HEURISTIC_NOTE,
      },
      {
        highlight: 'Watch the direction during a practice: a score that climbs as you breathe slowly is the useful signal.',
      },
    ],
  },
  alarm: {
    key: 'alarm',
    title: 'Alarm / Arousal (experimental)',
    shortTitle: '🚨 Alarm / Anxiety',
    sections: [
      {
        heading: 'What this number shows',
        body: 'A 0–100 activation score: higher when your heart rate and estimated breathing rate are above your usual level and heart rate is rising. It shows physical arousal, not anxiety. It cannot tell fear from exercise, coffee, or a lively conversation.',
      },
      {
        heading: 'How the app calculates it',
        body: '50% from how high your current heart rate is compared with your running personal average, 30% from how high your estimated breathing rate is compared with its average, and 20% from how fast your heart rate is rising right now. Scaled to 0–100, updated every 2 seconds.',
      },
      {
        heading: 'How to read it',
        bullets: [
          { label: 'Higher', text: 'Your body is more activated than usual.' },
          { label: 'Lower', text: 'Heart rate and breathing are at or below your usual level.' },
        ],
      },
      {
        heading: 'Limits',
        body: HEURISTIC_NOTE,
      },
      {
        highlight: 'If the number is high and you also feel tense, a few slow breaths with a longer exhale is a simple thing to try.',
      },
    ],
  },
  acceleration: {
    key: 'acceleration',
    title: 'HR Acceleration',
    shortTitle: '⚡ HR Acceleration',
    sections: [
      {
        heading: 'What this number shows',
        body: 'Whether your heart-rate change is speeding up or slowing down at this moment. Positive means the rise is getting steeper (or the fall is easing); negative means the rise is easing (or the fall is getting steeper). Near 0 means the change is steady.',
      },
      {
        heading: 'How the app calculates it',
        body: 'It takes the last three heart-rate samples and computes a second difference: (newest − 2 × middle + oldest) divided by the square of the time step. The unit is beats per minute per second squared. Samples arrive about once per second, so typical values are small, mostly between about −2 and +2, shown with two decimals.',
      },
      {
        heading: 'Limits',
        body: 'Because it uses only three samples, it is very jumpy and reacts to every small wobble or a single noisy reading. It is best seen as a live "twitchiness" indicator, not something to track over time. ' + SOURCE_NOTE,
      },
      {
        highlight: 'Look at HR Trend Slope for the overall direction; Acceleration only shows momentary changes.',
      },
    ],
  },
  slope: {
    key: 'slope',
    title: 'HR Trend Slope',
    shortTitle: '📈 HR Trend Slope',
    sections: [
      {
        heading: 'What this number shows',
        body: 'Which way your heart rate is heading over the last ~45 seconds. Negative = trending down, positive = trending up, around 0 = steady.',
      },
      {
        heading: 'How the app calculates it',
        body: 'The app splits the ~45-second window into two halves, takes the average heart rate of the second half minus the average of the first half, and divides that difference by half the number of samples. With about one sample per second, the result is roughly the change in bpm per second. Typical values are small, for example −0.10 to +0.10, shown with two decimals.',
      },
      {
        heading: 'How to read it',
        bullets: [
          { label: 'Negative', text: 'Your heart rate is drifting down — common when you sit still or during slow, relaxed breathing.' },
          { label: 'Positive', text: 'Your heart rate is drifting up — movement, talking, standing up, or a stressful thought.' },
          { label: 'Near 0', text: 'Your heart rate is stable.' },
        ],
      },
      {
        heading: 'Limits',
        body: 'It is a simple two-halves comparison, not a full regression, so a single movement can tilt it. ' + SOURCE_NOTE,
      },
      {
        highlight: 'During a calming practice, a slope that turns negative and stays there is a good sign that your heart rate is settling.',
      },
    ],
  },
  recovery: {
    key: 'recovery',
    title: 'Recovery Rate',
    shortTitle: '🔄 Recovery Rate',
    sections: [
      {
        heading: 'What this number shows',
        body: 'How fast your heart rate is changing right now, over the last ~10 seconds. Negative means your heart rate is coming down; positive means it is going up. It is not a percentage of recovery and not the clinical "heart-rate recovery" after exercise.',
      },
      {
        heading: 'How the app calculates it',
        body: 'It takes the last 10 heart-rate samples, subtracts the oldest from the newest, and divides by the time between them — giving beats per minute per second (for example −0.3 means your heart rate dropped about 0.3 bpm each second). The screen shows it with a sign, for example −0.3 bpm/s; at rest it usually stays within about ±1 bpm/s.',
      },
      {
        heading: 'How to read it',
        bullets: [
          { label: 'Negative', text: 'Heart rate is falling — for example after you stop moving or during a slow exhale phase.' },
          { label: 'Positive', text: 'Heart rate is rising.' },
          { label: 'Around 0%', text: 'Heart rate is steady.' },
        ],
      },
      {
        heading: 'Limits',
        body: 'Ten seconds is short, so the number swings with every breath (heart rate naturally rises on the inhale and falls on the exhale). ' + SOURCE_NOTE,
      },
      {
        highlight: 'After effort, watch for a clearly negative value — that shows your heart rate coming back down.',
      },
    ],
  },
  csi: {
    key: 'csi',
    title: 'CSI: Cardiac Stability Index',
    shortTitle: '🎯 Cardiac Stability Index (CSI)',
    sections: [
      {
        heading: 'What this number shows',
        body: 'How steady your heart rate has been over the last ~45 seconds, relative to its average. Higher = steadier. You will usually see values between about 0.90 and 1.00.',
      },
      {
        heading: 'How the app calculates it',
        body: 'CSI = 1 − (standard deviation of heart rate ÷ average heart rate) over the window, shown with two decimals. For example, an average of 70 bpm with a spread of 2.1 bpm gives 1 − 0.03 = 0.97.',
      },
      {
        heading: 'How to read it',
        bullets: [
          { label: 'Close to 1.00', text: 'Heart rate barely moved during the window.' },
          { label: 'Lower (e.g. 0.90 or below)', text: 'Heart rate moved a lot — usually from movement, talking, a posture change, or a noisy reading.' },
        ],
      },
      {
        heading: 'What affects it',
        body: 'Movement and changes in activity lower it. Slow, deep breathing can also lower it slightly, because it makes heart rate rise and fall more with each breath — so a lower CSI is not automatically "bad".',
      },
      {
        heading: 'Limits',
        body: 'CSI is an ONDA-specific number, not a standard clinical measure. ' + SOURCE_NOTE,
      },
      {
        highlight: HEALTH_NOTE,
      },
    ],
  },
  hrv: {
    key: 'hrv',
    title: 'HRV (estimate): Heart-Rate Spread',
    shortTitle: '📊 HRV (estimate)',
    sections: [
      {
        heading: 'What this number shows',
        body: 'How much your heart rate moved up and down over the last ~45 seconds, in beats per minute. For example, 2.3 means your heart rate typically varied about 2.3 bpm around its average. Values of roughly 1–5 are common at rest; movement pushes it higher.',
      },
      {
        heading: 'How the app calculates it',
        body: 'It is the standard deviation of your heart-rate samples (bpm) in the window, shown with one decimal. It is a rough stand-in for heart rate variability, which is why the tile says "estimate".',
      },
      {
        heading: 'How it differs from clinical HRV',
        body: 'Clinical HRV measures such as RMSSD and SDNN are calculated from the exact time between individual heartbeats and are reported in milliseconds. This app does not get beat-to-beat intervals here, so this number is not RMSSD or SDNN and cannot be compared with ms values from other apps or studies. The 7-day HRV chart on the Home screen is different: it uses Apple Health\'s HRV (SDNN, in ms) recorded by your Apple Watch.',
      },
      {
        heading: 'How to read it',
        bullets: [
          { label: 'Higher', text: 'More heart-rate movement. Slow, deep breathing often raises it because heart rate rises on each inhale and falls on each exhale. Movement or talking also raise it.' },
          { label: 'Lower', text: 'Heart rate stayed flat. That can mean you are very still, or breathing fast and shallow.' },
        ],
      },
      {
        heading: 'Limits',
        body: 'It mixes breathing-related changes with any other changes (movement, noise), so compare it only under similar conditions — same posture, same time of day. ' + SOURCE_NOTE,
      },
      {
        highlight: 'For day-to-day HRV trends, use the Home screen chart from Apple Health. Use this number to see how your heart rate responds while you breathe.',
      },
    ],
  },
  energy: {
    key: 'energy',
    title: 'Energy % (experimental)',
    shortTitle: '🔋 Energy %',
    sections: [
      {
        heading: 'What this number shows',
        body: 'A 0–100% score that is higher when your heart rate and activity are at or below your usual level and the heart-rate breathing rhythm is clear. It is roughly the mirror image of Stress %. It does not measure calories, fitness, or a "battery".',
      },
      {
        heading: 'How the app calculates it',
        body: '60% from how far your current heart rate is below your running personal average (a smooth S-curve, so near-average gives about half), 30% from how low your current activity is versus its average, and 10% from how clear the breathing rhythm is in your heart rate. Updated every 2 seconds.',
      },
      {
        heading: 'How to read it',
        bullets: [
          { label: 'Higher', text: 'Heart rate and activity at or below your usual level.' },
          { label: 'Lower', text: 'Heart rate and activity above your usual level — for example after moving, coffee, or during tension.' },
        ],
      },
      {
        heading: 'Limits',
        body: HEURISTIC_NOTE + ' Your "usual level" is learned while the app runs, so the first minutes after opening are less reliable.',
      },
      {
        highlight: 'Energy % reflects this moment, not your whole day. How you slept and how you feel matter more.',
      },
    ],
  },
  stress: {
    key: 'stress',
    title: 'Stress % (experimental)',
    shortTitle: '⚡ Stress %',
    sections: [
      {
        heading: 'What this number shows',
        body: 'A 0–100% score that is higher when your heart rate and activity are above your usual level and the heart-rate breathing rhythm is weak. It reflects physical activation, not psychological stress.',
      },
      {
        heading: 'How the app calculates it',
        body: '60% from how far your current heart rate is above your running personal average (a smooth S-curve, so near-average gives about half), 30% from how high your current activity is versus its average, and 10% from how weak the breathing rhythm in your heart rate is. Updated every 2 seconds.',
      },
      {
        heading: 'How to read it',
        bullets: [
          { label: 'Higher', text: 'Heart rate and activity above your usual level. Could be stress — or walking, talking, caffeine, or heat.' },
          { label: 'Lower', text: 'Heart rate and activity at or below your usual level.' },
        ],
      },
      {
        heading: 'What affects it',
        body: 'Anything that raises heart rate: movement, posture, caffeine, alcohol, illness, temperature, and emotions. Sitting still and slow, comfortable breathing usually bring it down.',
      },
      {
        heading: 'Limits',
        body: HEURISTIC_NOTE + ' Your "usual level" is learned while the app runs, so the first minutes after opening are less reliable.',
      },
      {
        highlight: 'Watch the direction during a practice rather than the exact number.',
      },
    ],
  },
  br: {
    key: 'br',
    title: 'Breathing Rate (estimate)',
    shortTitle: '🌬️ /min — Breathing Rate',
    sections: [
      {
        heading: 'What this number shows',
        body: 'An estimate of how many breaths you take per minute, shown with one decimal (for example 12.4 /min). The app shows values between 6 and 30 breaths per minute.',
      },
      {
        heading: 'How the app calculates it',
        body: 'Your heart rate naturally speeds up a little when you inhale and slows when you exhale (respiratory sinus arrhythmia). The app looks at the last ~45 seconds of heart rate and finds the strongest rhythm between 6 and 30 cycles per minute; that rhythm is taken as your breathing rate. The displayed value is smoothed over roughly 10 seconds so it does not flicker. No microphone or chest sensor is used.',
      },
      {
        heading: 'How to read it',
        bullets: [
          { label: 'Typical at rest', text: 'Adults usually breathe about 12–20 times per minute at rest.' },
          { label: 'Slow breathing', text: 'During slow breathing practice the estimate should move down, often toward 6–10 /min.' },
        ],
      },
      {
        heading: 'Limits',
        body: 'Because it is inferred from heart rate, it needs you to be fairly still, takes some seconds to catch up after you change your pace, and can be off when the breathing effect on your heart rate is weak (fast shallow breathing, movement, or sparse heart-rate samples). ' + SOURCE_NOTE,
      },
      {
        highlight: 'Breathing is the one part of this system you can change on purpose. Slow it down and watch the other numbers respond.',
      },
    ],
  },
  bpm: {
    key: 'bpm',
    title: 'BPM: Heart Rate',
    shortTitle: '❤️ BPM — Heart Rate',
    sections: [
      {
        heading: 'What this number shows',
        body: 'Your current heart rate in beats per minute, as the latest reading from your Apple Watch / Apple Health or a connected Bluetooth heart-rate strap.',
      },
      {
        heading: 'How the app gets it',
        body: 'The app does not calculate heart rate itself — it shows the most recent value from your device and records it about once per second. All other numbers on this screen are calculated from these readings.',
      },
      {
        heading: 'How to read it',
        bullets: [
          { label: 'At rest', text: 'For most adults a resting heart rate between about 60 and 100 bpm is considered normal; fit people are often lower.' },
          { label: 'Changes', text: 'Heart rate rises with movement, standing up, talking, caffeine, heat, and stress, and falls when you sit still and breathe slowly.' },
        ],
      },
      {
        heading: 'Limits',
        body: 'Accuracy depends on the device and fit — a loose watch band or movement can produce wrong readings. Apple Watch may update less often when no workout or practice is running.',
      },
      {
        highlight: HEALTH_NOTE,
      },
    ],
  },
}
