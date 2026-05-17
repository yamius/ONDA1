import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useEyeScan, type EyeScanResult, SCAN_DURATION_MS } from '../hooks/useEyeScan';
import { recommendedPractices } from '../utils/eyeScanMetrics';
import { AdaptivePracticeModal } from './AdaptivePracticeModal';

// Экран «Сканирование нервной системы» — гид-UX поверх контроллера useEyeScan.
// Названия метрик — плейсхолдеры MVP, финальные задаст бренд.
const METRICS: { key: 'calm' | 'focus' | 'fatigue'; label: string }[] = [
  { key: 'calm', label: 'Спокойствие НС' },
  { key: 'focus', label: 'Фокус' },
  { key: 'fatigue', label: 'Усталость' },
];

const PANEL_BG = 'rgba(0,0,0,0.82)';
const ACCENT = '#5ac8ff';
const SCAN_SEC = Math.round(SCAN_DURATION_MS / 1000);

export default function NervousSystemScan({
  onClose,
  onOndEarned,
}: {
  onClose?: () => void;
  onOndEarned?: (amount: number) => void;
}) {
  const scan = useEyeScan();
  const status = scan.status;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        zIndex: 9999,
      }}
    >
      {/* Камера всегда в DOM, чтобы videoRef был готов к моменту start(). */}
      <video
        ref={scan.videoRef}
        playsInline
        muted
        autoPlay
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scaleX(-1)',
          opacity: status === 'scanning' ? 1 : 0,
        }}
      />

      {status === 'idle' && (
        <Centered>
          <h1 style={{ fontSize: 22, marginBottom: 12 }}>Сканирование нервной системы</h1>
          <p style={{ fontSize: 15, lineHeight: 1.5, opacity: 0.8, maxWidth: 320, marginBottom: 24 }}>
            Посмотри в камеру и держись спокойно около {SCAN_SEC} секунд. Камера
            оценит моргание, взгляд и микродвижения. Кадры никуда не сохраняются.
          </p>
          <PrimaryButton onClick={scan.start}>Начать скан</PrimaryButton>
        </Centered>
      )}

      {status === 'preparing' && (
        <Centered>
          <p style={{ fontSize: 16, opacity: 0.85 }}>Подготовка камеры…</p>
        </Centered>
      )}

      {status === 'scanning' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              padding: 20,
              textAlign: 'center',
              fontSize: 15,
              background: 'linear-gradient(rgba(0,0,0,0.6), transparent)',
            }}
          >
            Смотри в камеру и держись спокойно
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 24,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            }}
          >
            <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 4 }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.round(scan.progress * 100)}%`,
                  background: ACCENT,
                  borderRadius: 4,
                  transition: 'width 0.2s linear',
                }}
              />
            </div>
            <div style={{ textAlign: 'center', fontSize: 13, opacity: 0.8, marginTop: 8 }}>
              Осталось ~{Math.max(0, Math.ceil(SCAN_SEC * (1 - scan.progress)))} с
            </div>
          </div>
        </>
      )}

      {status === 'done' && scan.result && (
        <ResultView result={scan.result} onAgain={scan.reset} onOndEarned={onOndEarned} />
      )}

      {status === 'error' && (
        <Centered>
          <p
            style={{
              fontSize: 15,
              color: '#ff8080',
              maxWidth: 320,
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            Не удалось выполнить скан: {scan.error}
          </p>
          <PrimaryButton onClick={scan.start}>Повторить</PrimaryButton>
        </Centered>
      )}

      <button
        onClick={onClose ?? (() => { window.location.href = '/'; })}
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

function ResultView({
  result,
  onAgain,
  onOndEarned,
}: {
  result: EyeScanResult;
  onAgain: () => void;
  onOndEarned?: (amount: number) => void;
}) {
  const { t } = useTranslation();
  const [practiceId, setPracticeId] = useState<string | null>(null);
  const practices = recommendedPractices(result.scores);

  return (
    <Centered>
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>Результат скана</h1>
      <div style={{ width: 300, maxWidth: '80vw' }}>
        {METRICS.map((m) => (
          <ScoreRow key={m.key} label={m.label} value={result.scores[m.key]} />
        ))}
      </div>
      <p style={{ fontSize: 12, opacity: 0.55, marginTop: 8, marginBottom: 20 }}>
        Достоверность скана: {result.scores.quality}%
      </p>

      <p style={{ fontSize: 14, opacity: 0.85, marginBottom: 10 }}>Рекомендуем практику</p>
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 300, maxWidth: '80vw' }}
      >
        {practices.map((p) => (
          <button
            key={p.id}
            onClick={() => setPracticeId(p.id)}
            style={{
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 12,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            {t(p.labelKey)}
          </button>
        ))}
      </div>

      <p
        style={{
          fontSize: 12,
          opacity: 0.55,
          maxWidth: 300,
          textAlign: 'center',
          marginTop: 16,
          marginBottom: 24,
        }}
      >
        Это wellness-оценка, не медицинская диагностика.
      </p>
      <PrimaryButton onClick={onAgain}>Сканировать снова</PrimaryButton>

      <AdaptivePracticeModal
        isOpen={practiceId !== null}
        onClose={() => setPracticeId(null)}
        practiceId={practiceId ?? ''}
        onOndEarned={onOndEarned}
      />
    </Centered>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 15,
          marginBottom: 4,
        }}
      >
        <span>{label}</span>
        <span style={{ fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3 }}>
        <div
          style={{ height: '100%', width: `${value}%`, background: ACCENT, borderRadius: 3 }}
        />
      </div>
    </div>
  );
}

function Centered({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: PANEL_BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 24,
        overflowY: 'auto',
      }}
    >
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 28px',
        background: ACCENT,
        color: '#001018',
        border: 'none',
        borderRadius: 24,
        fontSize: 16,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
