/**
 * Breath sound for /tools/vibration-breathing (task 104, round 3).
 *
 * One continuous, click-free "breath wave": looped noise → low-pass filter, plus a soft
 * tone, into a master gain. Every change goes through setTargetAtTime ramps (never a hard
 * step), so there are no clicks. Per frame the page calls update(level, brightness):
 *   level      0..1 — touch fade (finger on/off) × breath envelope (rises on the inhale,
 *                     falls on the exhale)
 *   brightness 0..1 — opens the filter on the inhale
 * Timbres: Relax = warm (brown-ish noise, low cutoff, 110 Hz sine);
 *          Wake up = brighter (white noise, high cutoff, 220 Hz triangle).
 * The AudioContext MUST be created/resumed inside a user gesture (the mode button).
 */
import type { BreathMode } from '../data/vibration-breathing'

const VOLUME = 0.35 // moderate default master level

export class BreathSound {
  private ctx: AudioContext
  private master: GainNode
  private wave: GainNode
  private filter: BiquadFilterNode
  private noise: AudioBufferSourceNode
  private osc: OscillatorNode
  private oscGain: GainNode
  private mode: BreathMode
  muted = false

  constructor(mode: BreathMode) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    this.ctx = new AC()
    this.mode = mode
    const c = this.ctx
    this.master = c.createGain(); this.master.gain.value = VOLUME
    this.wave = c.createGain(); this.wave.gain.value = 0.0001
    this.filter = c.createBiquadFilter(); this.filter.type = 'lowpass'; this.filter.Q.value = 0.7

    // 4 s looped noise buffer (brown-ish for relax, white-ish for wake)
    const len = c.sampleRate * 4
    const buf = c.createBuffer(1, len, c.sampleRate)
    const d = buf.getChannelData(0)
    let last = 0
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1
      if (mode === 'relax') { last = (last + 0.04 * w) / 1.04; d[i] = last * 3.2 } else d[i] = w * 0.35
    }
    this.noise = c.createBufferSource(); this.noise.buffer = buf; this.noise.loop = true

    this.osc = c.createOscillator()
    this.osc.type = mode === 'relax' ? 'sine' : 'triangle'
    this.osc.frequency.value = mode === 'relax' ? 110 : 220
    this.oscGain = c.createGain(); this.oscGain.gain.value = mode === 'relax' ? 0.18 : 0.08

    this.noise.connect(this.filter)
    this.osc.connect(this.oscGain).connect(this.filter)
    this.filter.connect(this.wave).connect(this.master).connect(c.destination)
    this.noise.start(); this.osc.start()
  }

  /** Call from the click handler (user gesture) — required on iOS. */
  resume(): void { try { void this.ctx.resume() } catch { /* noop */ } }
  suspend(): void { try { void this.ctx.suspend() } catch { /* noop */ } }

  setMuted(m: boolean): void {
    this.muted = m
    this.master.gain.setTargetAtTime(m ? 0.0001 : VOLUME, this.ctx.currentTime, 0.08)
  }

  update(level: number, brightness: number): void {
    const t = this.ctx.currentTime
    const lv = Math.max(0.0001, Math.min(1, level))
    this.wave.gain.setTargetAtTime(lv, t, 0.12)
    const [lo, hi] = this.mode === 'relax' ? [280, 950] : [700, 2600]
    this.filter.frequency.setTargetAtTime(lo + (hi - lo) * brightness, t, 0.15)
  }

  close(): void {
    try { this.wave.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.05) } catch { /* noop */ }
    const c = this.ctx
    setTimeout(() => { try { this.noise.stop(); this.osc.stop(); void c.close() } catch { /* noop */ } }, 250)
  }
}
