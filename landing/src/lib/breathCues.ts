import { useEffect, useRef } from 'react'
import type { PhaseKind } from '../data/breathing'

/** Soft audio cue per phase: rising tone for inhale, falling for exhale, short tick for hold. */
export function useBreathCues() {
  const ctxRef = useRef<AudioContext | null>(null)
  const ensure = () => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AC) ctxRef.current = new AC()
    }
    if (ctxRef.current?.state === 'suspended') void ctxRef.current.resume()
    return ctxRef.current
  }
  const play = (kind: PhaseKind) => {
    const ctx = ctxRef.current
    if (!ctx) return
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    const [f0, f1, dur] =
      kind === 'in' ? [330, 440, 0.45] : kind === 'topup' ? [440, 523, 0.25] : kind === 'out' ? [440, 294, 0.6] : [392, 392, 0.12]
    osc.frequency.setValueAtTime(f0, t)
    osc.frequency.linearRampToValueAtTime(f1, t + dur)
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.12, t + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + dur + 0.05)
  }
  useEffect(() => () => void ctxRef.current?.close(), [])
  return { ensure, play }
}
