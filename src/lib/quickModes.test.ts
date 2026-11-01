import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { QUICK_MODES, phaseAt, stepGain, nextHaptic, soundLevel, quickStartParams, quickStopParams, QUICK_CONSUMES_FREE_PRACTICE, FADE_IN_MS, FADE_OUT_MS } from './quickModes'

describe('quick modes rhythm', () => {
  it('Relax = 4 s in / 6 s out, Wake = 3 s in / 2 s out, no holds', () => {
    expect(QUICK_MODES.relax).toMatchObject({ inhaleMs: 4000, exhaleMs: 6000 })
    expect(QUICK_MODES.wake).toMatchObject({ inhaleMs: 3000, exhaleMs: 2000 })
  })
  it('phase boundaries (Relax)', () => {
    expect(phaseAt('relax', 0).inhale).toBe(true)
    expect(phaseAt('relax', 3999).inhale).toBe(true)
    expect(phaseAt('relax', 4000)).toMatchObject({ inhale: false, progress: 0 })
    expect(phaseAt('relax', 9999).inhale).toBe(false)
    expect(phaseAt('relax', 10000)).toMatchObject({ inhale: true, progress: 0 })
  })
  it('phase boundaries (Wake) and it never ends', () => {
    expect(phaseAt('wake', 2999).inhale).toBe(true)
    expect(phaseAt('wake', 3000).inhale).toBe(false)
    expect(phaseAt('wake', 5000).inhale).toBe(true)
    expect(phaseAt('wake', 3_600_000 + 1000).inhale).toBe(true)
  })
  it('breath envelope: empty at inhale start, full at inhale end', () => {
    expect(phaseAt('relax', 0).breath).toBeCloseTo(0)
    expect(phaseAt('relax', 2000).breath).toBeCloseTo(0.5)
    expect(phaseAt('relax', 4000).breath).toBeCloseTo(1)
    expect(phaseAt('relax', 7000).breath).toBeCloseTo(0.5)
  })
  it('finger gain fades in on touch and out on release', () => {
    expect(stepGain(0, true, FADE_IN_MS / 2)).toBeCloseTo(0.5)
    expect(stepGain(0.9, true, FADE_IN_MS)).toBe(1)
    expect(stepGain(1, false, FADE_OUT_MS / 2)).toBeCloseTo(0.5)
    expect(stepGain(0.1, false, FADE_OUT_MS)).toBe(0)
  })
  it('haptics: distinct inhale/exhale patterns, stronger with finger, off when faded', () => {
    expect(nextHaptic(true, 0.5, 0)).toBeNull()
    const inStart = nextHaptic(true, 0, 1)!, inEnd = nextHaptic(true, 1, 1)!
    expect(inEnd.gapMs).toBeLessThan(inStart.gapMs) // quickening inhale
    const out = nextHaptic(false, 0.5, 1)!
    expect(out.style).toBe('heavy')
    expect(inStart.style).toBe('medium')
    expect(out.gapMs).toBeGreaterThan(inStart.gapMs)
    expect(nextHaptic(true, 0, 0.3)!.gapMs).toBeGreaterThan(inStart.gapMs) // weaker without finger
    expect(nextHaptic(true, 0, 0.3)!.style).toBe('light')
  })
  it('sound: muted → 0, finger → louder', () => {
    expect(soundLevel(false, 1, 1)).toBe(0)
    expect(soundLevel(true, 1, 1)).toBeGreaterThan(soundLevel(true, 0, 1))
  })
  it('analytics params are strings, no health data', () => {
    expect(quickStartParams('relax', 3, true)).toEqual({ mode: 'relax', level: '3', haptics: 'true' })
    expect(quickStartParams('wake', 1, false)).toEqual({ mode: 'wake', level: '1', haptics: 'false' })
    expect(quickStopParams('wake', 1000, 63_400)).toEqual({ mode: 'wake', seconds: '62' })
  })
})

describe('quick modes do not consume free_used', () => {
  beforeEach(() => localStorage.clear())
  it('flag is false', () => expect(QUICK_CONSUMES_FREE_PRACTICE).toBe(false))
  it('quick-mode code never touches the free-practice counter, paywall or OND', () => {
    for (const f of ['src/lib/quickModes.ts', 'src/components/QuickModes.tsx']) {
      const src = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
      expect(src).not.toMatch(/onda_tapped_free_practices|markFreePracticeTapped|free_used|localStorage|Paywall|Subscription|ond_earned/i)
    }
  })
})
