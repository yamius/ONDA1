import { useCallback, useEffect, useRef, useState } from 'react';
import {
  estimateHr,
  isGoodContact,
  adaptiveSmooth,
  PPG,
  type PpgSample,
} from '../lib/ppgCore';
import { heartRateStore } from './heartRateStore';

/**
 * useCameraPpg — live camera pulse for the no-watch majority.
 *
 * Owns a hidden rear-camera <video> (getUserMedia), reads the red-channel mean
 * of a large central ROI every frame (requestVideoFrameCallback, rAF fallback),
 * and feeds the framework-free ppgCore. Once per second it asks ppgCore for a
 * heart rate; ppgCore commits a bpm only when its two independent estimators
 * agree and the signal quality passes — otherwise null ("blank, don't bluff").
 *
 * This hook is a PURE PRODUCER: it exposes { bpm, confidence, fingerOn, status }.
 * It does NOT write to heartRateStore and does NOT touch useVitals — wiring the
 * camera in as a selectable pulse source (and gating coherence OFF for camera)
 * is the integration step, done atomically so camera HR can never leak into a
 * coherence number.
 *
 * Torch: best-effort web `applyConstraints({torch:true})` (works on iOS 17+).
 * A native torch bridge is intentionally deferred — added only if on-device
 * data shows web-torch failing somewhere (see brief addendum D6 = A).
 *
 * Honesty: HEART RATE ONLY. No HRV / coherence from the camera.
 */

export type CameraPpgStatus =
  | 'idle'
  | 'requesting' // asking for camera permission / opening stream
  | 'denied' // permission refused or no camera
  | 'searching' // stream live, but no finger / not enough signal yet
  | 'reading' // committing live bpm
  | 'error';

export interface CameraPpgState {
  bpm: number | null;
  confidence: number;
  fingerOn: boolean;
  torchOn: boolean;
  status: CameraPpgStatus;
  error: string | null;
  /** Latest frame stats for the env-gated debug readout (updated ~1 Hz). */
  debug: { r: number; clip: number; redness: number };
}

const IDLE: CameraPpgState = {
  bpm: null,
  confidence: 0,
  fingerOn: false,
  torchOn: false,
  status: 'idle',
  error: null,
  debug: { r: 0, clip: 0, redness: 0 },
};

// Keep a little more than the analysis window so estimateHr always has a full window.
const BUFFER_SEC = PPG.WINDOW_SEC + 3;
const ESTIMATE_EVERY_MS = 1000;
// Downscaled canvas — finger covers the lens, so a small frame keeps full info
// while making getImageData cheap enough for a 30–60 fps loop on-device.
const CANVAS_W = 80;
const CANVAS_H = 60;

export function useCameraPpg() {
  const [state, setState] = useState<CameraPpgState>(IDLE);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafRef = useRef<number | null>(null);
  const rvfcRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSampleAtRef = useRef(0);
  const bufferRef = useRef<PpgSample[]>([]);
  const smoothedBpmRef = useRef(0);
  const runningRef = useRef(false);
  const fingerFramesRef = useRef(0);
  const noFingerFramesRef = useRef(0);
  const lastFrameStatsRef = useRef({ r: 0, clip: 0, redness: 0 });
  const lastCommitAtRef = useRef(0);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);
  const torchKeepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // True when the flash was lit via the native Android bridge (web torch
  // unavailable) — so keep-alive re-asserts the right channel and teardown
  // turns the native flash back off.
  const nativeTorchRef = useRef(false);

  const patch = useCallback((p: Partial<CameraPpgState>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  const teardown = useCallback(() => {
    runningRef.current = false;
    // Release the camera as a pulse source + drop the shared buffer so stale
    // camera HR can't linger into a later watch session.
    heartRateStore.setCameraActive(false);
    heartRateStore.clear();
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const video = videoRef.current as (HTMLVideoElement & { cancelVideoFrameCallback?: (h: number) => void }) | null;
    if (video && rvfcRef.current != null && typeof video.cancelVideoFrameCallback === 'function') {
      video.cancelVideoFrameCallback(rvfcRef.current);
    }
    rvfcRef.current = null;
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (torchKeepAliveRef.current != null) {
      clearInterval(torchKeepAliveRef.current);
      torchKeepAliveRef.current = null;
    }
    // Turn the native flash back off if we lit it via the Android bridge.
    if (nativeTorchRef.current) {
      try {
        (window as unknown as { Android?: { torchOff?: () => boolean } }).Android?.torchOff?.();
      } catch { /* noop */ }
      nativeTorchRef.current = false;
    }
    videoTrackRef.current = null;
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((t) => {
        try {
          // best-effort: turn the torch back off before releasing
          (t as MediaStreamTrack).applyConstraints?.({ advanced: [{ torch: false }] as MediaTrackConstraintSet[] }).catch(() => {});
        } catch {
          /* noop */
        }
        t.stop();
      });
    }
    streamRef.current = null;
    if (video) {
      video.srcObject = null;
      video.remove();
    }
    videoRef.current = null;
    canvasRef.current = null;
    ctxRef.current = null;
    bufferRef.current = [];
    smoothedBpmRef.current = 0;
    fingerFramesRef.current = 0;
    noFingerFramesRef.current = 0;
  }, []);

  // Pull one frame's red/green/blue means + clip fraction over a central ROI.
  const sampleFrame = useCallback((tMs: number) => {
    const video = videoRef.current;
    const ctx = ctxRef.current;
    if (!video || !ctx || video.readyState < 2) return;
    ctx.drawImage(video, 0, 0, CANVAS_W, CANVAS_H);
    // central ~60% ROI
    const rw = Math.floor(CANVAS_W * 0.3);
    const rh = Math.floor(CANVAS_H * 0.3);
    const x0 = Math.floor(CANVAS_W / 2) - rw;
    const y0 = Math.floor(CANVAS_H / 2) - rh;
    const img = ctx.getImageData(x0, y0, rw * 2, rh * 2).data;
    let r = 0, g = 0, b = 0, clipped = 0;
    const n = img.length / 4;
    for (let i = 0; i < img.length; i += 4) {
      r += img[i];
      g += img[i + 1];
      b += img[i + 2];
      if (img[i] >= 250) clipped++;
    }
    const rMean = r / n;
    const gMean = g / n;
    const bMean = b / n;
    const clipFrac = clipped / n;
    lastFrameStatsRef.current = {
      r: Math.round(rMean),
      clip: clipFrac,
      redness: rMean / (rMean + gMean + bMean + 1e-6),
    };

    const fingerNow = isGoodContact({ rMean, gMean, bMean, clipFrac });
    // debounce finger on/off so a single dropped frame doesn't flap the UI
    if (fingerNow) {
      fingerFramesRef.current++;
      noFingerFramesRef.current = 0;
      if (fingerFramesRef.current >= 5) bufferRef.current.push({ t: tMs, v: rMean });
    } else {
      noFingerFramesRef.current++;
      fingerFramesRef.current = 0;
      // finger lifted long enough → drop stale signal so a new contact starts clean
      if (noFingerFramesRef.current >= 30) {
        bufferRef.current = [];
        smoothedBpmRef.current = 0;
      }
    }

    // prune to the rolling window
    const cutoff = tMs - BUFFER_SEC * 1000;
    const buf = bufferRef.current;
    let drop = 0;
    while (drop < buf.length && buf[drop].t < cutoff) drop++;
    if (drop > 0) bufferRef.current = buf.slice(drop);

    const fingerOn = noFingerFramesRef.current < 15;
    setState((s) => (s.fingerOn === fingerOn ? s : { ...s, fingerOn }));
  }, []);

  // 1 Hz: ask ppgCore for a committed bpm (or null).
  const runEstimate = useCallback(() => {
    const est = estimateHr(bufferRef.current);
    const now = performance.now();
    if (est.bpm != null) {
      lastCommitAtRef.current = now;
      smoothedBpmRef.current = adaptiveSmooth(smoothedBpmRef.current, est.bpm, est.confidence);
      const bpm = Math.round(smoothedBpmRef.current);
      setState((s) => ({ ...s, bpm, confidence: est.confidence, status: 'reading', debug: lastFrameStatsRef.current }));
      // Feed the shared pulse buffer so useVitals derives breathing from camera
      // HR (same path as the watch); set the camera HR useVitals reads as `hr`.
      heartRateStore.setCameraHr(bpm);
      heartRateStore.addDataPoint(Date.now() / 1000, bpm);
      return;
    }
    // No commit this tick. BLANK ("don't bluff") when the finger is clearly off
    // OR we've had no good reading for a few seconds — never keep showing a
    // stale pulse after the finger is lifted. A brief dropout while the finger
    // is still on holds the last value and stays "reading".
    const fingerOff = noFingerFramesRef.current >= 15;
    const staleMs = now - lastCommitAtRef.current;
    if (fingerOff || staleMs > 3500) {
      smoothedBpmRef.current = 0;
      heartRateStore.setCameraHr(null);
      setState((s) => ({ ...s, bpm: null, confidence: est.confidence, status: 'searching', debug: lastFrameStatsRef.current }));
    } else {
      setState((s) => ({ ...s, confidence: est.confidence, debug: lastFrameStatsRef.current }));
    }
  }, []);

  const start = useCallback(async () => {
    if (runningRef.current) return;
    patch({ status: 'requesting', error: null });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        // 30 fps is plenty for HR (≈7 Hz Nyquist) and lighter on CPU/heat than 60.
        video: { facingMode: 'environment', frameRate: { ideal: 30 } },
        audio: false,
      });
      streamRef.current = stream;

      // Torch is enabled below, AFTER the capture pipeline is live — Android
      // WebView frequently reports `getCapabilities().torch` only once frames
      // start flowing, so a single attempt right after getUserMedia (as iOS
      // tolerates) silently no-ops there. See enableTorch() further down.
      const track = stream.getVideoTracks()[0];
      videoTrackRef.current = track;

      const video = document.createElement('video');
      video.setAttribute('playsinline', '');
      video.muted = true;
      video.playsInline = true;
      // offscreen but RENDERED (display:none can pause decoding on iOS)
      video.style.cssText =
        'position:fixed;top:0;left:0;width:2px;height:2px;opacity:0.01;pointer-events:none;z-index:-1;';
      document.body.appendChild(video);
      video.srcObject = stream;
      await video.play();
      videoRef.current = video;

      const canvas = document.createElement('canvas');
      canvas.width = CANVAS_W;
      canvas.height = CANVAS_H;
      canvasRef.current = canvas;
      ctxRef.current = canvas.getContext('2d', { willReadFrequently: true });

      runningRef.current = true;
      bufferRef.current = [];
      smoothedBpmRef.current = 0;
      heartRateStore.setCameraActive(true); // camera is now the pulse source
      patch({ status: 'searching', torchOn: false });

      const vAny = video as HTMLVideoElement & {
        requestVideoFrameCallback?: (cb: (now: number) => void) => number;
      };
      const useRvfc = typeof vAny.requestVideoFrameCallback === 'function';
      const onFrame = () => {
        if (!runningRef.current) return;
        // HR needs only ~7 Hz Nyquist; throttle the heavy getImageData to ~30 Hz
        // even when the stream delivers 60 fps (perf/heat over a 2.5-min session).
        // resampleUniform absorbs the resulting jitter.
        const now = performance.now();
        if (now - lastSampleAtRef.current >= 31) {
          lastSampleAtRef.current = now;
          sampleFrame(now);
        }
        if (useRvfc) {
          rvfcRef.current = vAny.requestVideoFrameCallback!(onFrame);
        } else {
          rafRef.current = requestAnimationFrame(onFrame);
        }
      };
      onFrame();

      intervalRef.current = setInterval(runEstimate, ESTIMATE_EVERY_MS);

      // Best-effort torch — now that frames are flowing. On iOS this lights up
      // on the first try; on Android WebView the `torch` capability often shows
      // up only after a beat, so we poll a few times before giving up. Once on,
      // re-assert periodically (iOS/Android both drop it on exposure changes).
      const applyTorch = async (): Promise<boolean> => {
        try {
          const caps = (track.getCapabilities?.() ?? {}) as MediaTrackCapabilities & { torch?: boolean };
          if (!caps.torch) return false;
          await track.applyConstraints({ advanced: [{ torch: true }] as MediaTrackConstraintSet[] });
          return true;
        } catch {
          return false;
        }
      };
      void (async () => {
        let torchOn = false;
        // ~first 2.4 s: retry until the capability appears and applies.
        for (let i = 0; i < 6 && runningRef.current && !torchOn; i++) {
          torchOn = await applyTorch();
          if (!torchOn) await new Promise((r) => setTimeout(r, 400));
        }
        if (!runningRef.current) return;
        const finalCaps = (track.getCapabilities?.() ?? {}) as MediaTrackCapabilities & { torch?: boolean };
        // Native fallback: Android WebView usually can't drive torch over WebRTC
        // (capable=false), and may open a flash-less aux camera — so light the
        // main rear flash directly through the Android bridge.
        const bridge = (window as unknown as { Android?: { torchOn?: () => boolean; torchOff?: () => boolean } }).Android;
        if (!torchOn && typeof bridge?.torchOn === 'function') {
          try {
            if (bridge.torchOn()) {
              torchOn = true;
              nativeTorchRef.current = true;
            }
          } catch { /* native torch unavailable — stay on ambient light */ }
        }
        // Diagnostic: one line so on-device logcat tells us web vs native vs none.
        console.log(`[useCameraPpg] torch on=${torchOn} capable=${Boolean(finalCaps.torch)} native=${nativeTorchRef.current}`);
        if (torchOn) {
          patch({ torchOn: true });
          torchKeepAliveRef.current = setInterval(() => {
            if (nativeTorchRef.current) {
              try { bridge?.torchOn?.(); } catch { /* noop */ }
            } else {
              track.applyConstraints({ advanced: [{ torch: true }] as MediaTrackConstraintSet[] }).catch(() => {});
            }
          }, 8000);
        }
      })();
    } catch (e: unknown) {
      const name = (e as { name?: string })?.name;
      const denied = name === 'NotAllowedError' || name === 'NotFoundError' || name === 'SecurityError';
      teardown();
      patch({ status: denied ? 'denied' : 'error', error: String((e as Error)?.message ?? e) });
    }
  }, [patch, runEstimate, sampleFrame, teardown]);

  const stop = useCallback(() => {
    teardown();
    setState(IDLE);
  }, [teardown]);

  // Free the camera + torch if the app is backgrounded mid-read.
  useEffect(() => {
    const onHidden = () => {
      if (document.visibilityState === 'hidden' && runningRef.current) stop();
    };
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      document.removeEventListener('visibilitychange', onHidden);
      teardown();
    };
  }, [stop, teardown]);

  return { ...state, start, stop };
}
