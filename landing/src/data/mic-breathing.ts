/**
 * Microphone breathing-rate tool (acoustic respiration).
 *
 * Estimates your breathing rate from sound: the phone mic picks up the soft
 * rush of each breath, and the tool tracks the rhythmic rise and fall of the
 * audio envelope to count breaths per minute — then helps you slow toward the
 * ~6 breaths/min "resonance" zone that maximises HRV and calm (Lehrer & Gevirtz
 * 2014; Zaccaro 2018).
 *
 * It's a rough biofeedback aid, not a medical spirometer — it needs audible
 * breathing in a quiet room. All audio is processed live on-device; nothing is
 * recorded or uploaded.
 */

import type { ScienceSource } from './sources'

export const TARGET_BPM = 6

export const MIC_SOURCES: ScienceSource[] = [
  {
    authors: 'Lehrer PM, Gevirtz R',
    year: 2014,
    title: 'Heart rate variability biofeedback: how and why does it work?',
    journal: 'Frontiers in Psychology, 5:756',
    contributes: 'Why ~6 breaths/min (resonance frequency) maximises HRV and engages the baroreflex — the target this tool nudges you toward.',
    url: 'https://doi.org/10.3389/fpsyg.2014.00756',
  },
  {
    authors: 'Zaccaro A, Piarulli A, Laurino M, et al.',
    year: 2018,
    title: 'How breath-control can change your life: a systematic review on psycho-physiological correlates of slow breathing',
    journal: 'Frontiers in Human Neuroscience, 12:353',
    contributes: 'Systematic review linking slow breathing to higher HRV, parasympathetic shift and reduced arousal.',
    url: 'https://doi.org/10.3389/fnhum.2018.00353',
  },
  {
    authors: 'Balban MY, Neri E, Kogon MM, et al.',
    year: 2023,
    title: 'Brief structured respiration practices enhance mood and reduce physiological arousal',
    journal: 'Cell Reports Medicine, 4(1):100895',
    contributes: 'RCT showing a few minutes a day of slow, exhale-emphasised breathing improves mood and lowers arousal.',
    url: 'https://doi.org/10.1016/j.xcrm.2022.100895',
  },
]

export const MIC_METHODOLOGY =
  'Each breath makes a soft rush of sound as air moves; the microphone hears it, and this tool measures the loudness (the audio envelope) many times a second, smooths it, and finds the rhythm of the rise-and-fall to estimate your breaths per minute. It works best when you breathe audibly — ideally exhaling through the mouth — in a quiet room, and it is a rough biofeedback aid, not a clinical respiration monitor. The real value is the feedback loop: seeing your rate lets you consciously slow it toward about six breaths per minute, the "resonance" pace that maximises heart-rate variability and parasympathetic tone (Lehrer & Gevirtz 2014; Zaccaro 2018), and even a few minutes there measurably calms arousal (Balban 2023). All audio is processed live on your device and is never recorded or uploaded.'

export const MIC_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What is a normal breathing rate?',
    a: 'For a healthy adult at rest, about 12–20 breaths per minute is typical. Slow, relaxed breathing tends to sit lower, and deliberately slowing to roughly 6 breaths per minute is the sweet spot for raising heart-rate variability and calming the nervous system. This tool shows your current rate so you can guide it down.',
  },
  {
    q: 'How does a microphone measure breathing?',
    a: 'Air moving in and out makes a faint rushing sound. The mic captures it and the tool tracks the loudness over time — that signal rises and falls with each breath, and the rhythm of those rises gives your breaths per minute. It’s acoustic, so it needs audible breathing in a quiet room; it’s a biofeedback estimate, not a medical spirometer.',
  },
  {
    q: 'Why aim for about 6 breaths per minute?',
    a: 'Around six breaths a minute is the cardiovascular "resonance frequency", where your heart rate, breathing and blood-pressure rhythms sync up and HRV is maximised (Lehrer & Gevirtz 2014). Breathing there shifts you toward the parasympathetic "rest-and-digest" state. It’s the basis of HRV biofeedback and coherent breathing.',
  },
  {
    q: 'Is my microphone audio private?',
    a: 'Yes. Everything is processed in your browser, on your device, in real time. No audio is recorded, saved or uploaded — the sound is analysed for its loudness rhythm and immediately discarded, and the mic turns off when you stop.',
  },
  {
    q: 'It’s not detecting my breathing — what helps?',
    a: 'Find a quiet room, hold the phone fairly close, and breathe audibly — exhaling through the mouth with a soft "haaa" works best. Background noise, fans or music will confuse it. If it still struggles, the on-screen Breathing Pacer is a reliable alternative that paces you without needing the mic.',
  },
]
