import { useEffect, useRef, useState } from 'react';
import {
  FaceLandmarker,
  FilesetResolver,
  type FaceLandmarkerResult,
} from '@mediapipe/tasks-vision';

// Отладочный экран-спайк: проверяет связку getUserMedia + MediaPipe Face
// Landmarker в вебвью. Не часть продукта, доступен по роуту /eye-scan.
// Кадры нигде не сохраняются — только отображаются и измеряются.

const MP_VERSION = '0.10.35';
const WASM_PATH = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/wasm`;
const MODEL_PATH =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

// Индексы лэндмарков радужки в модели на 478 точек: левая 468–472, правая 473–477.
const IRIS_INDICES = [468, 469, 470, 471, 472, 473, 474, 475, 476, 477];

interface Metrics {
  faceFound: boolean;
  landmarkCount: number;
  blinkLeft: number;
  blinkRight: number;
  fps: number;
}

const INITIAL_METRICS: Metrics = {
  faceFound: false,
  landmarkCount: 0,
  blinkLeft: 0,
  blinkRight: 0,
  fps: 0,
};

export default function EyeScanSpike() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState('Инициализация…');
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics>(INITIAL_METRICS);

  useEffect(() => {
    let landmarker: FaceLandmarker | null = null;
    let stream: MediaStream | null = null;
    let rafId = 0;
    let cancelled = false;
    let lastVideoTime = -1;
    let lastFrameTs = performance.now();
    let lastMetricsTs = 0;
    let fpsAvg = 0;

    function draw(result: FaceLandmarkerResult, video: HTMLVideoElement, canvas: HTMLCanvasElement) {
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const face = result.faceLandmarks[0];
      if (!face) return;

      ctx.fillStyle = 'rgba(90,200,255,0.45)';
      for (const p of face) {
        ctx.fillRect(p.x * canvas.width - 1, p.y * canvas.height - 1, 2, 2);
      }
      ctx.fillStyle = '#ff3b6b';
      for (const idx of IRIS_INDICES) {
        const p = face[idx];
        if (!p) continue;
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function publishMetrics(result: FaceLandmarkerResult, fps: number) {
      const face = result.faceLandmarks[0];
      const shapes = result.faceBlendshapes[0]?.categories ?? [];
      const score = (name: string) =>
        shapes.find((c) => c.categoryName === name)?.score ?? 0;
      setMetrics({
        faceFound: Boolean(face),
        landmarkCount: face?.length ?? 0,
        blinkLeft: score('eyeBlinkLeft'),
        blinkRight: score('eyeBlinkRight'),
        fps,
      });
    }

    function loop() {
      if (cancelled) return;
      rafId = requestAnimationFrame(loop);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !landmarker || video.readyState < 2) return;

      const now = performance.now();
      const dt = now - lastFrameTs;
      lastFrameTs = now;
      if (dt > 0) {
        fpsAvg = fpsAvg === 0 ? 1000 / dt : fpsAvg * 0.9 + (1000 / dt) * 0.1;
      }

      // detectForVideo требует растущий timestamp и новый кадр.
      if (video.currentTime === lastVideoTime) return;
      lastVideoTime = video.currentTime;

      const result = landmarker.detectForVideo(video, now);
      draw(result, video, canvas);

      if (now - lastMetricsTs > 200) {
        lastMetricsTs = now;
        publishMetrics(result, fpsAvg);
      }
    }

    async function init() {
      try {
        setStatus('Загрузка модели MediaPipe…');
        const fileset = await FilesetResolver.forVisionTasks(WASM_PATH);
        try {
          landmarker = await FaceLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: MODEL_PATH, delegate: 'GPU' },
            runningMode: 'VIDEO',
            numFaces: 1,
            outputFaceBlendshapes: true,
          });
        } catch {
          // GPU-делегат доступен не везде — откатываемся на CPU.
          landmarker = await FaceLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: MODEL_PATH, delegate: 'CPU' },
            runningMode: 'VIDEO',
            numFaces: 1,
            outputFaceBlendshapes: true,
          });
        }
        if (cancelled) return;

        setStatus('Запрос доступа к камере…');
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (cancelled) return;

        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();
        setStatus('Работает');
        rafId = requestAnimationFrame(loop);
      } catch (e) {
        setError(e instanceof Error ? `${e.name}: ${e.message}` : String(e));
        setStatus('Ошибка');
      }
    }

    init();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      stream?.getTracks().forEach((t) => t.stop());
      landmarker?.close();
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Видео и оверлей зеркалим вместе — координаты лэндмарков совпадают. */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 640, transform: 'scaleX(-1)' }}>
        <video ref={videoRef} playsInline muted autoPlay style={{ width: '100%', display: 'block' }} />
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          padding: '10px 14px',
          background: 'rgba(0,0,0,0.6)',
          borderRadius: 10,
          fontSize: 13,
          lineHeight: 1.6,
          minWidth: 210,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 4 }}>Eye-scan спайк</div>
        <div>Статус: {status}</div>
        {error && <div style={{ color: '#ff6b6b' }}>Ошибка: {error}</div>}
        <div>Лицо: {metrics.faceFound ? 'найдено' : '—'}</div>
        <div>Лэндмарков: {metrics.landmarkCount}</div>
        <div>FPS: {metrics.fps.toFixed(1)}</div>
        <div>Моргание L: {metrics.blinkLeft.toFixed(2)}</div>
        <div>Моргание R: {metrics.blinkRight.toFixed(2)}</div>
      </div>

      <button
        onClick={() => {
          window.location.href = '/';
        }}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          padding: '8px 14px',
          background: 'rgba(255,255,255,0.15)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 8,
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        ← В приложение
      </button>
    </div>
  );
}
