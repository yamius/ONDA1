/**
 * Quick modes (task 107): "What do you want?" → Relax / Wake up.
 * Free for everyone — no paywall, no free-practice counter, no OND, no feedback screen.
 * Full-screen session runs until Stop. Finger on screen → stronger rhythm; release → fades.
 * Rhythm/visual/sound ported from the site tool /tools/vibration-breathing (separate copies:
 * src/lib/quickModes.ts, src/lib/quickBreathSound.ts).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { QUICK_MODES, phaseAt, stepGain, nextHaptic, soundLevel, quickStartParams, quickStopParams, type QuickMode, type HapticStyle } from '../lib/quickModes';
import { BreathSound, unlockAudioSession, releaseAudioSession } from '../lib/quickBreathSound';

type TrackFn = (name: 'quick_start' | 'quick_stop', params: Record<string, string>) => unknown;

function hapticsAvailable(): boolean {
  if (Capacitor.isNativePlatform()) return Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'android';
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

const STYLE: Record<HapticStyle, ImpactStyle> = { light: ImpactStyle.Light, medium: ImpactStyle.Medium, heavy: ImpactStyle.Heavy };

function tap(style: HapticStyle) {
  void Haptics.impact({ style: STYLE[style] }).catch(() => { /* no haptics */ });
}

export function QuickModes({ level, track, light = false }: { level: number; track: TrackFn; light?: boolean }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<QuickMode | null>(null);
  const [inhale, setInhale] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchingRef = useRef(false);
  const posRef = useRef<{ x: number; y: number } | null>(null);
  const drawPosRef = useRef<{ x: number; y: number } | null>(null);
  const gainRef = useRef(0);
  const startRef = useRef(0);
  const startWallRef = useRef(0);
  const nextTapRef = useRef(0);
  const lastRef = useRef(0);
  const soundRef = useRef(true);
  const audioRef = useRef<BreathSound | null>(null);
  const inhaleRef = useRef(true);
  const hapticsRef = useRef(false);
  const modeRef = useRef<QuickMode | null>(null);

  useEffect(() => { soundRef.current = soundOn; audioRef.current?.setMuted(!soundOn); }, [soundOn]);

  const start = (m: QuickMode) => {
    // iOS: audio must be unlocked + resumed synchronously inside the tap.
    unlockAudioSession();
    try {
      audioRef.current?.close();
      audioRef.current = new BreathSound(m);
      audioRef.current.resume();
      audioRef.current.setMuted(!soundRef.current);
    } catch { audioRef.current = null; }
    hapticsRef.current = hapticsAvailable();
    startRef.current = performance.now();
    startWallRef.current = Date.now();
    gainRef.current = 0;
    lastRef.current = 0;
    modeRef.current = m;
    setMode(m);
    track('quick_start', quickStartParams(m, level, hapticsRef.current));
  };

  const stop = useCallback(() => {
    const m = modeRef.current;
    if (m) track('quick_stop', quickStopParams(m, startWallRef.current, Date.now()));
    modeRef.current = null;
    setMode(null);
    touchingRef.current = false;
    audioRef.current?.close(); audioRef.current = null;
    releaseAudioSession();
  }, [track]);

  // Main loop: phase clock, finger gain, haptics, sound, canvas.
  useEffect(() => {
    if (!mode) return;
    let raf = 0;
    const reduced = (() => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } })();
    const spec = QUICK_MODES[mode];
    const frame = (now: number) => {
      const dt = lastRef.current ? Math.min(100, now - lastRef.current) : 16;
      lastRef.current = now;
      const g = gainRef.current = stepGain(gainRef.current, touchingRef.current, dt);
      const ph = phaseAt(mode, now - startRef.current);
      if (ph.inhale !== inhaleRef.current) { inhaleRef.current = ph.inhale; setInhale(ph.inhale); }
      if (hapticsRef.current && now >= nextTapRef.current) {
        const h = nextHaptic(ph.inhale, ph.progress, g);
        if (h) { tap(h.style); nextTapRef.current = now + h.gapMs; }
      }
      audioRef.current?.update(soundLevel(soundRef.current, g, ph.breath), ph.breath);
      const c = canvasRef.current;
      if (c) draw(c, spec.rgb, ph.inhale, ph.progress, ph.breath, g, reduced, spec.inhaleMs, spec.exhaleMs);
      raf = requestAnimationFrame(frame);
    };
    const draw = (c: HTMLCanvasElement, rgb: [number, number, number], inh: boolean, progress: number, breath: number, g: number, red: boolean, inMs: number, exMs: number) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = c.clientWidth, h = c.clientHeight;
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const want = touchingRef.current && posRef.current ? posRef.current : { x: w / 2, y: h * 0.48 };
      const cur = drawPosRef.current ?? want;
      const lerp = red ? 1 : 0.18;
      drawPosRef.current = { x: cur.x + (want.x - cur.x) * lerp, y: cur.y + (want.y - cur.y) * lerp };
      const { x, y } = drawPosRef.current;
      const [r, gg, b] = rgb;
      const intensity = (inh ? 0.95 : 0.6) * (0.45 + 0.55 * g);
      const maxR = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
      const glow = ctx.createRadialGradient(x, y, 0, x, y, maxR * 0.7);
      glow.addColorStop(0, `rgba(${r},${gg},${b},${0.10 + 0.12 * breath * intensity})`);
      glow.addColorStop(1, `rgba(${r},${gg},${b},0)`);
      ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
      // Inhale → rings CONVERGE on the point; exhale → they SPREAD out.
      const cycle = inMs + exMs;
      const cycleP = inh ? (progress * inMs) / cycle : (inMs + progress * exMs) / cycle;
      const edge = Math.min(1, progress / 0.12, (1 - progress) / 0.12);
      const N = 3;
      for (let k = 0; k < N; k++) {
        const f = red ? (k + 0.5) / N : (progress + k / N) % 1;
        const rad = Math.max(2, maxR * 0.85 * (red ? 1 - f : inh ? 1 - f : f));
        const born = Math.max(0, cycleP - (f * (inh ? inMs : exMs)) / cycle);
        const haloP = born < 0.85 ? born / 0.85 : (1 - born) / 0.15;
        const a = red ? (0.12 + 0.5 * breath) * intensity * (0.4 + 0.6 * f) : Math.sin(Math.PI * f) * intensity * 0.6 * edge;
        ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r},${gg},${b},${a.toFixed(3)})`;
        ctx.lineWidth = 2 + 2 * haloP;
        ctx.shadowColor = `rgba(${r},${gg},${b},0.85)`;
        ctx.shadowBlur = red ? 12 : 6 + 26 * haloP;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      const dotR = red ? 16 : 10 + 22 * breath;
      const core = ctx.createRadialGradient(x, y, 0, x, y, dotR * 1.8);
      core.addColorStop(0, `rgba(255,255,255,${0.55 + 0.3 * g})`);
      core.addColorStop(0.35, `rgba(${r},${gg},${b},${0.55 + 0.35 * breath})`);
      core.addColorStop(1, `rgba(${r},${gg},${b},0)`);
      ctx.fillStyle = core; ctx.beginPath(); ctx.arc(x, y, dotR * 1.8, 0, Math.PI * 2); ctx.fill();
    };
    raf = requestAnimationFrame(frame);
    const onVis = () => { if (document.hidden) { touchingRef.current = false; audioRef.current?.suspend(); } else audioRef.current?.resume(); };
    document.addEventListener('visibilitychange', onVis);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', onVis); document.body.style.overflow = prevOverflow; };
  }, [mode]);

  useEffect(() => () => { audioRef.current?.close(); audioRef.current = null; }, []);

  const onDown = (e: React.PointerEvent) => { posRef.current = { x: e.clientX, y: e.clientY }; touchingRef.current = true; };
  const onMove = (e: React.PointerEvent) => { if (touchingRef.current) posRef.current = { x: e.clientX, y: e.clientY }; };
  const onUp = () => { touchingRef.current = false; };

  return (
    <div className="mb-4" data-onda-quick-modes>
      <p className={`text-center text-base font-semibold mb-3 ${light ? 'text-slate-600' : 'text-white/90'}`}>{t('quick_question')}</p>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => start('relax')}
          className="rounded-xl bg-amber-500 px-4 py-4 text-lg font-bold text-white shadow-md transition-all hover:bg-amber-600">
          {t('quick_relax')}
        </button>
        <button type="button" onClick={() => start('wake')}
          className="rounded-xl bg-violet-600 px-4 py-4 text-lg font-bold text-white shadow-md transition-all hover:bg-violet-700">
          {t('quick_wake')}
        </button>
      </div>
      {mode && createPortal(
        <div className="fixed inset-0 z-[9999] bg-[#05060d] select-none" style={{ touchAction: 'none' }}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onPointerLeave={onUp}
          data-onda-quick-session={mode}>
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          <div className="pointer-events-none absolute top-[max(3rem,env(safe-area-inset-top))] inset-x-0 text-center">
            <div className="text-3xl font-light text-white/90">{t(inhale ? 'quick_inhale' : 'quick_exhale')}</div>
            <div className="mt-2 text-sm text-white/50">{t('quick_hint')}</div>
          </div>
          <button type="button" aria-pressed={soundOn} aria-label={t(soundOn ? 'quick_sound_off' : 'quick_sound_on')}
            onPointerDown={(e) => e.stopPropagation()} onClick={() => setSoundOn((s) => !s)}
            className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-4 z-10 flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/60 text-2xl text-white">
            {soundOn ? '🔊' : '🔇'}
          </button>
          <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={stop}
            className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-10 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white">
            {t('quick_stop')}
          </button>
        </div>,
        document.body,
      )}
    </div>
  );
}
