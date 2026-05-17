import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import {
  FaceLandmarker,
  FilesetResolver,
  type FaceLandmarkerResult,
} from '@mediapipe/tasks-vision';
import {
  aggregateSamples,
  computeScores,
  type ScanSample,
  type ScanAggregate,
  type NervousSystemScores,
} from '../utils/eyeScanMetrics';

// MediaPipe-ассеты пока с CDN. MVP-B позже забандлит их локально (офлайн).
const MP_VERSION = '0.10.35';
const WASM_PATH = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/wasm`;
const MODEL_PATH =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

export const SCAN_DURATION_MS = 30_000;

export type EyeScanStatus = 'idle' | 'preparing' | 'scanning' | 'done' | 'error';

export interface EyeScanResult {
  aggregate: ScanAggregate;
  scores: NervousSystemScores;
}

export interface UseEyeScan {
  /** Привязать к <video> на экране скана. */
  videoRef: RefObject<HTMLVideoElement>;
  status: EyeScanStatus;
  /** Прогресс скана 0..1. */
  progress: number;
  result: EyeScanResult | null;
  error: string | null;
  start: () => void;
  reset: () => void;
}

function blendshape(result: FaceLandmarkerResult, name: string): number {
  const cats = result.faceBlendshapes[0]?.categories ?? [];
  return cats.find((c) => c.categoryName === name)?.score ?? 0;
}

/** Извлекает один кадр-сэмпл из результата MediaPipe. */
function extractSample(result: FaceLandmarkerResult, t: number): ScanSample {
  const face = result.faceLandmarks[0];
  if (!face) {
    return { t, faceFound: false, blink: 0, gazeX: 0, gazeY: 0, eyeOpenness: 0, headX: 0, headY: 0 };
  }
  const bs = (n: string) => blendshape(result, n);
  const blinkL = bs('eyeBlinkLeft');
  const blinkR = bs('eyeBlinkRight');
  const nose = face[1]; // опорная точка головы — кончик носа
  return {
    t,
    faceFound: true,
    blink: Math.max(blinkL, blinkR),
    gazeX:
      (bs('eyeLookOutLeft') - bs('eyeLookInLeft') + bs('eyeLookInRight') - bs('eyeLookOutRight')) /
      2,
    gazeY:
      (bs('eyeLookUpLeft') - bs('eyeLookDownLeft') + bs('eyeLookUpRight') - bs('eyeLookDownRight')) /
      2,
    eyeOpenness: 1 - (blinkL + blinkR) / 2,
    headX: nose?.x ?? 0,
    headY: nose?.y ?? 0,
  };
}

/**
 * Контроллер eye-scan: открывает камеру + MediaPipe, ведёт 45-секундную
 * сессию, собирает кадры и считает wellness-баллы. UI-агностичен — экран
 * привязывает videoRef к своему <video> и вызывает start().
 */
export function useEyeScan(): UseEyeScan {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<EyeScanStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<EyeScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Состояние сессии вне реактивности React.
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef(0);
  const samplesRef = useRef<ScanSample[]>([]);
  const startTsRef = useRef(0);
  const lastVideoTimeRef = useRef(-1);
  const lastProgressTsRef = useRef(0);

  const stopStream = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const finish = useCallback(() => {
    stopStream();
    const aggregate = aggregateSamples(samplesRef.current);
    setResult({ aggregate, scores: computeScores(aggregate) });
    setProgress(1);
    setStatus('done');
  }, [stopStream]);

  const loop = useCallback(() => {
    rafRef.current = requestAnimationFrame(loop);
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;
    if (!video || !landmarker || video.readyState < 2) return;

    const now = performance.now();
    const elapsed = now - startTsRef.current;
    if (elapsed >= SCAN_DURATION_MS) {
      finish();
      return;
    }
    if (now - lastProgressTsRef.current > 200) {
      lastProgressTsRef.current = now;
      setProgress(Math.min(elapsed / SCAN_DURATION_MS, 1));
    }

    // detectForVideo требует растущий timestamp и новый кадр.
    if (video.currentTime === lastVideoTimeRef.current) return;
    lastVideoTimeRef.current = video.currentTime;
    samplesRef.current.push(extractSample(landmarker.detectForVideo(video, now), now));
  }, [finish]);

  const start = useCallback(async () => {
    stopStream();
    setError(null);
    setResult(null);
    setProgress(0);
    samplesRef.current = [];
    lastVideoTimeRef.current = -1;
    lastProgressTsRef.current = 0;
    setStatus('preparing');
    try {
      if (!landmarkerRef.current) {
        const fileset = await FilesetResolver.forVisionTasks(WASM_PATH);
        try {
          landmarkerRef.current = await FaceLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: MODEL_PATH, delegate: 'GPU' },
            runningMode: 'VIDEO',
            numFaces: 1,
            outputFaceBlendshapes: true,
          });
        } catch {
          // GPU-делегат доступен не везде — откатываемся на CPU.
          landmarkerRef.current = await FaceLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: MODEL_PATH, delegate: 'CPU' },
            runningMode: 'VIDEO',
            numFaces: 1,
            outputFaceBlendshapes: true,
          });
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) throw new Error('Видео-элемент не привязан к videoRef');
      video.srcObject = stream;
      await video.play();

      startTsRef.current = performance.now();
      setStatus('scanning');
      rafRef.current = requestAnimationFrame(loop);
    } catch (e) {
      stopStream();
      setError(e instanceof Error ? `${e.name}: ${e.message}` : String(e));
      setStatus('error');
    }
  }, [loop, stopStream]);

  const reset = useCallback(() => {
    stopStream();
    samplesRef.current = [];
    setResult(null);
    setError(null);
    setProgress(0);
    setStatus('idle');
  }, [stopStream]);

  // Очистка при размонтировании.
  useEffect(() => {
    return () => {
      stopStream();
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, [stopStream]);

  return { videoRef, status, progress, result, error, start, reset };
}
