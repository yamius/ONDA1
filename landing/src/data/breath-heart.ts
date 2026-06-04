/**
 * Breath–Heart biofeedback combo (camera PPG + paced breathing).
 *
 * The "tap-test": breathe with the on-screen pacer while the phone camera reads
 * your pulse from a fingertip. Your heart rate speeds up on the inhale and slows
 * on the exhale — respiratory sinus arrhythmia (RSA), a direct readout of vagal
 * (parasympathetic) activity (Yasuma & Hayano 2004). Slow breathing at ~6/min
 * exaggerates it and is the basis of HRV biofeedback (Lehrer & Gevirtz 2014).
 *
 * This is a live demonstration of ONDA's core mechanic — not a medical device.
 * Camera beat-detection is noisy (Coppetti 2017), so the heart-rate trace is a
 * rough, real-time estimate. All processing is on-device; nothing is uploaded.
 */

import type { ScienceSource } from './sources'

export const BH_RATES = [5, 5.5, 6] as const

export const BH_SOURCES: ScienceSource[] = [
  {
    authors: 'Yasuma F, Hayano J',
    year: 2004,
    title: 'Respiratory sinus arrhythmia: why does the heartbeat synchronize with respiratory rhythm?',
    journal: 'Chest, 125(2):683–690',
    contributes: 'The phenomenon this tool shows — heart rate rises on inspiration and falls on expiration (RSA), an index of vagal tone.',
    url: 'https://doi.org/10.1378/chest.125.2.683',
  },
  {
    authors: 'Lehrer PM, Gevirtz R',
    year: 2014,
    title: 'Heart rate variability biofeedback: how and why does it work?',
    journal: 'Frontiers in Psychology, 5:756',
    contributes: 'Why slow breathing at ~6/min maximises this heart-rate oscillation (resonance) — the core of HRV biofeedback.',
    url: 'https://doi.org/10.3389/fpsyg.2014.00756',
  },
  {
    authors: 'Coppetti T, Brauchlin A, Müggler S, et al.',
    year: 2017,
    title: 'Accuracy of smartphone apps for heart rate measurement',
    journal: 'European Journal of Preventive Cardiology, 24(12):1287–1293',
    contributes: 'Why the camera heart-rate trace is a rough estimate, not a measurement — smartphone PPG accuracy varies widely.',
    url: 'https://doi.org/10.1177/2047487317702044',
  },
]

export const BH_METHODOLOGY =
  'This combines two of our other tools into the single demonstration that best captures what ONDA does. The phone camera reads your pulse from a fingertip over the rear camera and flash (contact PPG), detecting each beat in real time to plot your instantaneous heart rate. At the same time, the pacer guides your breathing — and as you breathe, you should see your heart rate climb on the inhale and drop on the exhale. That oscillation is respiratory sinus arrhythmia (RSA): a real, direct window on your vagus nerve, strongest when you breathe slowly at around six breaths a minute (Yasuma & Hayano 2004; Lehrer & Gevirtz 2014). It is a live biofeedback demo, not a medical device — camera beat-detection is noisy and the trace will jitter (Coppetti 2017), and the RSA pattern shows up most clearly with a still finger, a good signal and slow breathing. Everything runs on your device; no video is recorded or uploaded.'

export const BH_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What am I supposed to see?',
    a: 'Your heart rate rising as you breathe in and falling as you breathe out — the green heart-rate line oscillating in time with the breathing wave. That’s respiratory sinus arrhythmia (RSA): your vagus nerve modulating your heartbeat with each breath. It’s most obvious when you breathe slowly (~6/min) with a steady finger on the camera.',
  },
  {
    q: 'Why does my heart rate go up when I inhale?',
    a: 'On the inhale, vagal "braking" on the heart eases off and the heart speeds up slightly; on the exhale, vagal tone returns and it slows. This rhythmic change — RSA — is a normal, healthy sign of an active parasympathetic nervous system (Yasuma & Hayano 2004), and bigger swings generally mean better vagal tone.',
  },
  {
    q: 'Why slow breathing at about 6 a minute?',
    a: 'Around six breaths per minute is the cardiovascular resonance frequency, where the heart-rate oscillation driven by breathing is largest and HRV peaks (Lehrer & Gevirtz 2014). It’s the rate used in HRV biofeedback. Faster breathing produces smaller, harder-to-see swings.',
  },
  {
    q: 'How accurate is the heart-rate trace?',
    a: 'It’s a rough, real-time estimate from your phone camera, and it will jitter — smartphone PPG accuracy varies a lot (Coppetti 2017), and detecting individual beats from a camera is harder than averaging heart rate. Treat this as a biofeedback demo to feel the breath–heart connection, not as precise medical data.',
  },
  {
    q: 'Is my camera feed private?',
    a: 'Yes. All processing happens live in your browser on your device. No image or video is recorded, saved or uploaded — frames are analysed for the pulse signal and immediately discarded, and the camera turns off when you stop.',
  },
]
