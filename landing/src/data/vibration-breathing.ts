/**
 * Vibration Breathing tool (task 104) — /tools/vibration-breathing, EN only.
 *
 * Paces breathing by touch: finger on the screen → the phone vibrates in a
 * rhythm (dense short pulses on the inhale, long sparse pulses on the exhale).
 * No breath holds. Where the Vibration API is missing (iOS Safari, desktop) the main
 * channel is a Web Audio breath wave (src/lib/breathSound.ts) plus visual pulses.
 *
 * Copy rules: no medical claims (no "reduces stress/anxiety", no "calms the
 * nervous system"); no claim that the ONDA app has a numeric pacer or haptic
 * guidance (facts doc). No science facts are asserted here, so no sources.
 */

export type BreathMode = 'relax' | 'wake'

export interface ModeSpec {
  label: string
  inhaleMs: number
  exhaleMs: number
  /** RGB of the rings */
  rgb: [number, number, number]
}

export const MODES: Record<BreathMode, ModeSpec> = {
  relax: { label: 'Relax', inhaleMs: 4000, exhaleMs: 6000, rgb: [255, 190, 80] },
  wake: { label: 'Wake up', inhaleMs: 3000, exhaleMs: 2000, rgb: [120, 92, 255] },
}

/** Continuous finger-on-screen time before the "Continue?" pause. */
export const MAX_CONTINUOUS_MS = 20 * 60 * 1000
/** Fade-in / fade-out of the vibration "gain" (expressed through pulse density/length). */
export const FADE_IN_MS = 2500
export const FADE_OUT_MS = 1800

/**
 * One vibration pulse for the current moment.
 *  - inhale: short pulses whose gap shrinks across the inhale (a rising, denser series)
 *  - exhale: long, sparse pulses
 *  - gain g∈[0,1] (fade on touch / release): lower g → shorter pulses, longer gaps
 * Returns [pulseMs, gapMs].
 */
export function nextPulse(phase: 'in' | 'out', progress: number, g: number): [number, number] {
  const k = Math.max(0, Math.min(1, g))
  if (phase === 'in') {
    const pulse = Math.round(12 + 18 * k) // 12–30 ms
    const gap = Math.round((260 - 170 * progress) * (1 + 2.2 * (1 - k))) // 260→90 ms at full gain
    return [pulse, gap]
  }
  const pulse = Math.round(60 + 160 * k) // 60–220 ms
  const gap = Math.round(480 + 700 * (1 - k)) // 480 ms at full gain
  return [pulse, gap]
}

export const VIBRATION_FAQ: { q: string; a: string }[] = [
  {
    q: 'How does Vibration Breathing work?',
    a: 'Pick Relax or Wake up, then rest a finger on the screen. Your phone vibrates in a rhythm: a quickening series of short taps while you breathe in, and long, slow pulses while you breathe out. Lift your finger and the vibration fades out; the session keeps going until you press Finish.',
  },
  {
    q: 'What rhythm does each mode use?',
    a: 'Relax: breathe in for 4 seconds and out for 6 seconds. Wake up: breathe in for 3 seconds and out for 2 seconds. There are no breath holds in either mode.',
  },
  {
    q: 'Why don’t I feel any vibration on my iPhone?',
    a: 'Safari on iPhone and desktop browsers do not support web vibration. On those devices the rhythm comes as a soft sound wave that swells as you breathe in and fades as you breathe out, plus light on screen. Turn your sound on or use headphones; there is a mute button.',
  },
  {
    q: 'Can I use it without touching the screen?',
    a: 'Yes. On a computer, hold down the mouse button or the space bar instead of a finger. The visual rhythm also works on its own, with or without sound.',
  },
  {
    q: 'Is this a medical tool?',
    a: 'No. It is a simple breathing-rhythm guide for everyday use, not a treatment or a medical device. Nothing is measured, recorded or uploaded.',
  },
]
