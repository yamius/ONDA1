/**
 * Quick modes (task 107) — free "Relax" / "Wake up" breathing above the practices list.
 *
 * Rhythm/visual logic ported from the site tool (landing/src/data/vibration-breathing.ts,
 * landing/src/pages/VibrationBreathingPage.tsx) — a SEPARATE copy, the app does not import
 * landing code. No holds, no duration: the session runs until Stop.
 *
 * Free for everyone: a quick session is NOT a practice — it never touches the paywall,
 * the free-practice counter (free_used / onda_tapped_free_practices) or OND rewards.
 * Copy rules: no medical claims.
 */

export type QuickMode = 'relax' | 'wake'

export interface QuickModeSpec {
  inhaleMs: number
  exhaleMs: number
  /** RGB of the rings: Relax gold, Wake violet/ultramarine (as on the site). */
  rgb: [number, number, number]
}

export const QUICK_MODES: Record<QuickMode, QuickModeSpec> = {
  relax: { inhaleMs: 4000, exhaleMs: 6000, rgb: [255, 190, 80] },
  wake: { inhaleMs: 3000, exhaleMs: 2000, rgb: [120, 92, 255] },
}

/** Fade of the "finger gain": finger on → rhythm stronger, release → fades. */
export const FADE_IN_MS = 2500
export const FADE_OUT_MS = 1800

export interface Phase {
  inhale: boolean
  /** 0..1 within the current phase */
  progress: number
  /** 0 = empty lungs, 1 = full (eased) */
  breath: number
}

/** Phase at `elapsedMs` since the session start. */
export function phaseAt(mode: QuickMode, elapsedMs: number): Phase {
  const { inhaleMs, exhaleMs } = QUICK_MODES[mode]
  const cycle = inhaleMs + exhaleMs
  const tc = ((elapsedMs % cycle) + cycle) % cycle
  const inhale = tc < inhaleMs
  const progress = inhale ? tc / inhaleMs : (tc - inhaleMs) / exhaleMs
  const ease = 0.5 - 0.5 * Math.cos(Math.PI * progress)
  return { inhale, progress, breath: inhale ? ease : 1 - ease }
}

/** Gain step toward the finger target (1 while touching, 0 after release). */
export function stepGain(g: number, touching: boolean, dtMs: number): number {
  return touching ? Math.min(1, g + dtMs / FADE_IN_MS) : Math.max(0, g - dtMs / FADE_OUT_MS)
}

export type HapticStyle = 'light' | 'medium' | 'heavy'

/**
 * Next haptic tap. Distinct patterns:
 *  - inhale: light taps whose gap shrinks across the inhale (a quickening series)
 *  - exhale: heavier, long-spaced taps
 * Gain g∈[0,1] (finger on/off): lower g → longer gaps, softer style. Returns null when faded out.
 */
export function nextHaptic(inhale: boolean, progress: number, g: number): { style: HapticStyle; gapMs: number } | null {
  const k = Math.max(0, Math.min(1, g))
  if (k <= 0.03) return null
  if (inhale) {
    return { style: k > 0.6 ? 'medium' : 'light', gapMs: Math.round((260 - 170 * progress) * (1 + 2.2 * (1 - k))) }
  }
  return { style: k > 0.6 ? 'heavy' : 'medium', gapMs: Math.round(700 + 700 * (1 - k)) }
}

/** Sound level for the breath wave: idle ≈ 0.4, finger → 1, × breath envelope. */
export function soundLevel(soundOn: boolean, g: number, breath: number): number {
  return soundOn ? (0.4 + 0.6 * g) * (0.3 + 0.7 * breath) : 0
}

/** Quick sessions never consume the free-practice allowance. */
export const QUICK_CONSUMES_FREE_PRACTICE = false

export function quickStartParams(mode: QuickMode, level: number, haptics: boolean) {
  return { mode, level: String(level), haptics: haptics ? 'true' : 'false' } as const
}

export function quickStopParams(mode: QuickMode, startedAt: number, now: number) {
  return { mode, seconds: String(Math.max(0, Math.round((now - startedAt) / 1000))) } as const
}
