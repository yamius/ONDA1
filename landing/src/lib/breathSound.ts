/**
 * Breath sound for /tools/vibration-breathing (task 104, rounds 3–4).
 *
 * One continuous, click-free "breath wave": a tone (fundamental + harmonics) and band-passed
 * noise into a master gain. Every change goes through setTargetAtTime ramps, so no clicks.
 * Per frame the page calls update(level, brightness):
 *   level      0..1 — idle ≈ 0.4 (sounds right after the mode tap), finger → 1; × breath
 *                     envelope (swells on the inhale, ebbs on the exhale)
 *   brightness 0..1 — opens the filter on the inhale
 * Pitched for phone/laptop speakers (they reproduce little below ~200 Hz):
 *   Relax  = warm: 220 Hz sine + 330 Hz fifth + soft 440, noise band 500→1600 Hz
 *   Wake up = bright: 440 Hz triangle + 880 + 1320 Hz, noise band 1200→4000 Hz
 * Master level targets a peak around −12…−6 dBFS at full level (measured via the analyser).
 *
 * iOS: must be created + resumed synchronously inside the tap (no await before it). To play
 * with the side Silent switch on: navigator.audioSession.type = 'playback' (Safari 16.4+), and,
 * as a fallback, a looping silent <audio> started in the same tap switches the session to playback.
 */
import type { BreathMode } from '../data/vibration-breathing'

const MASTER = 0.7

// 1 s of 8 kHz 8-bit mono silence as a WAV data URI (for the iOS audio-session fallback).
function silentWavUri(): string {
  const n = 8000
  const buf = new Uint8Array(44 + n)
  const dv = new DataView(buf.buffer)
  const w = (o: number, s: string) => { for (let i = 0; i < s.length; i++) buf[o + i] = s.charCodeAt(i) }
  w(0, 'RIFF'); dv.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt ')
  dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true)
  dv.setUint32(24, 8000, true); dv.setUint32(28, 8000, true); dv.setUint16(32, 1, true); dv.setUint16(34, 8, true)
  w(36, 'data'); dv.setUint32(40, n, true)
  buf.fill(128, 44)
  let bin = ''
  for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i])
  return `data:audio/wav;base64,${btoa(bin)}`
}

let silentEl: HTMLAudioElement | null = null

/** Call synchronously at the top of the click handler, BEFORE creating the context. */
export function unlockAudioSession(): void {
  try {
    const nav = navigator as unknown as { audioSession?: { type: string } }
    if (nav.audioSession) nav.audioSession.type = 'playback'
  } catch { /* not supported */ }
  try {
    if (!silentEl) {
      silentEl = new Audio(silentWavUri())
      silentEl.loop = true
      silentEl.setAttribute('playsinline', '')
    }
    void silentEl.play().catch(() => { /* blocked — Web Audio may still work */ })
  } catch { /* no <audio> */ }
}

export function releaseAudioSession(): void {
  try { silentEl?.pause() } catch { /* noop */ }
}

export class BreathSound {
  readonly ctx: AudioContext
  readonly analyser: AnalyserNode
  private master: GainNode
  private wave: GainNode
  private filter: BiquadFilterNode
  private noise: AudioBufferSourceNode
  private oscs: OscillatorNode[] = []
  private mode: BreathMode
  muted = false

  constructor(mode: BreathMode) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    this.ctx = new AC()
    this.mode = mode
    const c = this.ctx
    this.master = c.createGain(); this.master.gain.value = MASTER
    this.wave = c.createGain(); this.wave.gain.value = 0.0001
    this.analyser = c.createAnalyser(); this.analyser.fftSize = 2048

    const tones: [OscillatorType, number, number][] = mode === 'relax'
      ? [['sine', 220, 0.34], ['sine', 330, 0.16], ['sine', 440, 0.07]]
      : [['triangle', 440, 0.26], ['sine', 880, 0.12], ['sine', 1320, 0.06]]
    for (const [type, f, g] of tones) {
      const o = c.createOscillator(); o.type = type; o.frequency.value = f
      const og = c.createGain(); og.gain.value = g
      o.connect(og).connect(this.wave)
      this.oscs.push(o)
    }

    this.filter = c.createBiquadFilter(); this.filter.type = 'bandpass'; this.filter.Q.value = 0.8
    const len = c.sampleRate * 3
    const buf = c.createBuffer(1, len, c.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    this.noise = c.createBufferSource(); this.noise.buffer = buf; this.noise.loop = true
    const ng = c.createGain(); ng.gain.value = mode === 'relax' ? 0.5 : 0.4
    this.noise.connect(this.filter).connect(ng).connect(this.wave)

    this.wave.connect(this.master).connect(this.analyser).connect(c.destination)
    this.noise.start(); this.oscs.forEach((o) => o.start())
  }

  /** Synchronously inside the user gesture — required on iOS. */
  resume(): void {
    try { void this.ctx.resume() } catch { /* noop */ }
    const env = (import.meta as unknown as { env?: { DEV?: boolean } }).env
    if (env?.DEV) console.info('[breathSound] ctx.state', this.ctx.state)
  }
  suspend(): void { try { void this.ctx.suspend() } catch { /* noop */ } }

  setMuted(m: boolean): void {
    this.muted = m
    this.master.gain.setTargetAtTime(m ? 0.0001 : MASTER, this.ctx.currentTime, 0.08)
  }

  update(level: number, brightness: number): void {
    const t = this.ctx.currentTime
    const lv = Math.max(0.0001, Math.min(1, level))
    this.wave.gain.setTargetAtTime(lv, t, 0.12)
    const [lo, hi] = this.mode === 'relax' ? [500, 1600] : [1200, 4000]
    this.filter.frequency.setTargetAtTime(lo + (hi - lo) * brightness, t, 0.15)
  }

  /** Peak and RMS of the current output in dBFS (for checks). */
  levels(): { peakDb: number; rmsDb: number } {
    const a = new Float32Array(this.analyser.fftSize)
    this.analyser.getFloatTimeDomainData(a)
    let pk = 0, s = 0
    for (const v of a) { pk = Math.max(pk, Math.abs(v)); s += v * v }
    const db = (x: number) => (x > 0 ? 20 * Math.log10(x) : -Infinity)
    return { peakDb: db(pk), rmsDb: db(Math.sqrt(s / a.length)) }
  }

  close(): void {
    try { this.wave.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.05) } catch { /* noop */ }
    const c = this.ctx
    setTimeout(() => { try { this.noise.stop(); this.oscs.forEach((o) => o.stop()); void c.close() } catch { /* noop */ } }, 250)
  }
}
