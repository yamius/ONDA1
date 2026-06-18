import { useCallback, useEffect, useRef, useState } from 'react';
import {
  estimateHr,
  isGoodContact,
  adaptiveSmooth,
  PPG,
  type PpgSample,
} from '../lib/ppgCore';

/**
 * useCameraPpg (WEB / landing variant) — live camera pulse for the Emoton page.
 *
 * This is the app's useCameraPpg with the heartRateStore coupling removed: the
 * landing site has no watch-HR fusion / useVitals pipeline, so this hook is a
 * SELF-CONTAINED PRODUCER — it owns the rear-camera <video>, reads the red-channel
 * mean of a central ROI every frame, feeds the shared ppgCore, and exposes
 * { bpm, confidence, fingerOn, torchOn, status } via local React state only.
 *
 * Keep behaviourally in sync with the app's src/hooks/useCameraPpg.ts (the source
 * of truth); the ONLY intended difference is the dropped heartRateStore writes.
 *
 * Honesty: HEART RATE ONLY. ppgCore commits a bpm only when its two independent
 * estimators agree and the SQI passes — otherwise null ("blank, don't bluff").
 * No HRV / coherence from the camera (those stay watch/app).
 */

export type CameraPpgStatus =
  | 'idle'
  | 'requesting'
  | 'denied'
  | 'searching'
  | 'reading'
  | 'error';

export interface CameraPpgState {
  bpm: number | null;
  confidence: number;
  fingerOn: boolean;
  torchOn: boolean;
  status: CameraPpgStatus;
  error: string | null;
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

const BUFFER_SEC = PPG.WINDOW_SEC + 3;
const ESTIMATE_EVERY_MS = 1000;
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
  const torchActiveRef = useRef(false); // when false (e.g. laptop, no flash) → relaxed finger gate

  const patch = useCallback((p: Partial<CameraPpgState>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  const teardown = useCallback(() => {
    runningRef.current = false;
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
    videoTrackRef.current = null;
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((t) => {
        try {
          (t as MediaStreamTrack).applyConstraints?.({ advanced: [{ torch: false }] as unknown as MediaTrackConstraintSet[] }).catch(() => {});
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
    torchActiveRef.current = false;
  }, []);

  // Pull one frame's red/green/blue means + clip fraction over a central ROI.
  const sampleFrame = useCallback((tMs: number) => {
    const video = videoRef.current;
    const ctx = ctxRef.current;
    if (!video || !ctx || video.readyState < 2) return;
    ctx.drawImage(video, 0, 0, CANVAS_W, CANVAS_H);
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

    const fingerNow = isGoodContact({ rMean, gMean, bMean, clipFrac }, !torchActiveRef.current);
    if (fingerNow) {
      fingerFramesRef.current++;
      noFingerFramesRef.current = 0;
      if (fingerFramesRef.current >= 5) bufferRef.current.push({ t: tMs, v: rMean });
    } else {
      noFingerFramesRef.current++;
      fingerFramesRef.current = 0;
      if (noFingerFramesRef.current >= 30) {
        bufferRef.current = [];
        smoothedBpmRef.current = 0;
      }
    }

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
      return;
    }
    // No commit this tick. Blank ("don't bluff") when the finger is clearly off
    // OR we've had no good reading for a few seconds — never show a stale pulse.
    const fingerOff = noFingerFramesRef.current >= 15;
    const staleMs = now - lastCommitAtRef.current;
    if (fingerOff || staleMs > 3500) {
      smoothedBpmRef.current = 0;
      setState((s) => ({ ...s, bpm: null, confidence: est.confidence, status: 'searching', debug: lastFrameStatsRef.current }));
    } else {
      setState((s) => ({ ...s, confidence: est.confidence, debug: lastFrameStatsRef.current }));
    }
  }, []);

  const start = useCallback(async () => {
    if (runningRef.current) return;
    patch({ status: 'requesting', error: null });
    try {
      // Prefer the rear camera (phone); fall back to ANY camera so a laptop /
      // desktop webcam (no environment-facing camera) still opens.
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', frameRate: { ideal: 30 } },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
      streamRef.current = stream;

      // Torch is enabled below, AFTER the capture pipeline is live — Android
      // WebView frequently reports `getCapabilities().torch` only once frames
      // start flowing, so a single attempt right after getUserMedia (as iOS
      // tolerates) silently no-ops there. See the retry block further down.
      const track = stream.getVideoTracks()[0];
      videoTrackRef.current = track;

      const video = document.createElement('video');
      video.setAttribute('playsinline', '');
      video.muted = true;
      video.playsInline = true;
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
      patch({ status: 'searching', torchOn: false });

      const vAny = video as HTMLVideoElement & {
        requestVideoFrameCallback?: (cb: (now: number) => void) => number;
      };
      const useRvfc = typeof vAny.requestVideoFrameCallback === 'function';
      const onFrame = () => {
        if (!runningRef.current) return;
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
          await track.applyConstraints({ advanced: [{ torch: true }] as unknown as MediaTrackConstraintSet[] });
          return true;
        } catch {
          return false;
        }
      };
      void (async () => {
        let torchOn = false;
        for (let i = 0; i < 6 && runningRef.current && !torchOn; i++) {
          torchOn = await applyTorch();
          if (!torchOn) await new Promise((r) => setTimeout(r, 400));
        }
        if (!runningRef.current) return;
        const finalCaps = (track.getCapabilities?.() ?? {}) as MediaTrackCapabilities & { torch?: boolean };
        console.log(`[useCameraPpg] torch on=${torchOn} capable=${Boolean(finalCaps.torch)}`);
        torchActiveRef.current = torchOn;
        if (torchOn) {
          patch({ torchOn: true });
          torchKeepAliveRef.current = setInterval(() => {
            track.applyConstraints({ advanced: [{ torch: true }] as unknown as MediaTrackConstraintSet[] }).catch(() => {});
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

  // Free the camera + torch if the page is backgrounded mid-read.
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
