import { useEffect, useState } from 'react';
import { Eye, X, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEyeScan, type EyeScanResult, SCAN_DURATION_MS } from '../hooks/useEyeScan';
import { recommendedPractices } from '../utils/eyeScanMetrics';
import { AdaptivePracticeModal } from './AdaptivePracticeModal';
import { useTheme } from '../theme/ThemeProvider';

// Экран «Сканирование нервной системы». Оформление — в стиле EmotionalCheckModal.
const METRICS: { key: 'calm' | 'focus' | 'fatigue'; labelKey: string }[] = [
  { key: 'calm', labelKey: 'eye_scan.metric_calm' },
  { key: 'focus', labelKey: 'eye_scan.metric_focus' },
  { key: 'fatigue', labelKey: 'eye_scan.metric_fatigue' },
];

const SCAN_SEC = Math.round(SCAN_DURATION_MS / 1000);

export default function NervousSystemScan({
  onClose,
  onOndEarned,
}: {
  onClose?: () => void;
  onOndEarned?: (amount: number) => void;
}) {
  const { t } = useTranslation();
  const isLight = useTheme().resolved === 'light';
  const scan = useEyeScan();
  const status = scan.status;
  const [practiceId, setPracticeId] = useState<string | null>(null);
  const [videoVisible, setVideoVisible] = useState(false);
  const close = onClose ?? (() => { window.location.href = '/'; });

  // Плавное появление камеры: после входа в 'scanning' даём кадру
  // устаканиться, затем запускаем fade-in (opacity 0 → 100).
  useEffect(() => {
    if (status !== 'scanning') {
      setVideoVisible(false);
      return;
    }
    const id = window.setTimeout(() => setVideoVisible(true), 350);
    return () => window.clearTimeout(id);
  }, [status]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto ${
          practiceId ? 'hidden' : ''
        }`}
        style={{
          paddingTop: 'max(20px, env(safe-area-inset-top))',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        }}
      >
        <div className="bg-gradient-to-br from-bg to-surface rounded-3xl max-w-lg w-full shadow-2xl border border-border/10 overflow-hidden max-h-full flex flex-col my-auto">
          {/* Шапка */}
          <div className={`relative p-4 flex-shrink-0 ${isLight ? 'bg-gradient-to-r from-indigo-100 to-violet-100' : 'bg-gradient-to-r from-accent to-accent-2'}`}>
            <button
              onClick={close}
              className={`absolute top-4 right-4 transition-colors ${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-white/80 hover:text-white'}`}
              aria-label={t('eye_scan.back')}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className={`text-2xl sm:text-3xl font-bold text-center mb-0.5 ${isLight ? 'text-slate-800' : 'text-white'}`}>
              {t('eye_scan.title')}
            </h2>
            <p className={`text-sm text-center ${isLight ? 'text-slate-500' : 'text-indigo-100'}`}>{t('eye_scan.subtitle')}</p>
          </div>

          {/* Тело */}
          <div
            className="p-4 space-y-4 overflow-y-auto flex-1"
            style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
          >
            {/*
              Камера всегда в DOM ради videoRef. Видна только в 'scanning':
              в 'preparing' поток уже крутится скрыто и успевает пройти
              авто-фокус/авто-кроп фронталки iPhone, поэтому к моменту показа
              картинка стабильна — без скачка зума.
            */}
            <video
              ref={scan.videoRef}
              playsInline
              muted
              autoPlay
              style={{ transform: 'scaleX(-1)' }}
              className={
                status === 'scanning'
                  ? `w-full aspect-[4/3] object-cover rounded-2xl border border-border/10 transition-opacity duration-700 ${
                      videoVisible ? 'opacity-100' : 'opacity-0'
                    }`
                  : 'hidden'
              }
            />

            {status === 'idle' && (
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-2xl p-6 border border-accent/30">
                  <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-accent to-accent-2 rounded-full flex items-center justify-center">
                    <Eye className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-text-primary/80 text-base">{t('eye_scan.intro', { sec: SCAN_SEC })}</p>
                </div>
                <button
                  onClick={scan.start}
                  className={`w-full font-semibold py-3.5 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg text-base ${isLight ? 'bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/40 text-slate-800' : 'bg-gradient-to-r from-accent to-accent-2 hover:opacity-90 text-white'}`}
                >
                  {t('eye_scan.start')}
                </button>
              </div>
            )}

            {status === 'preparing' && (
              <p className="text-text-primary/80 text-sm text-center">{t('eye_scan.preparing')}</p>
            )}

            {status === 'scanning' && (
              <div className="space-y-3">
                <p className="text-text-primary/80 text-sm text-center">{t('eye_scan.hold_still')}</p>
                <div className="bg-border/15 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-accent to-accent-2 h-full rounded-full transition-all duration-200"
                    style={{ width: `${Math.round(scan.progress * 100)}%` }}
                  />
                </div>
                <p className="text-text-muted text-sm text-center">
                  {t('eye_scan.remaining', {
                    sec: Math.max(0, Math.ceil(SCAN_SEC * (1 - scan.progress))),
                  })}
                </p>
              </div>
            )}

            {status === 'done' && scan.result && (
              <ResultView result={scan.result} onAgain={scan.reset} onPick={setPracticeId} />
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="bg-red-500/15 rounded-xl p-4 border border-red-500/30">
                  <p className="text-red-400 text-sm">
                    {t('eye_scan.error', { error: scan.error ?? '' })}
                  </p>
                </div>
                <button
                  onClick={scan.start}
                  className={`w-full font-semibold py-3.5 px-6 rounded-xl transition-all text-base ${isLight ? 'bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/40 text-slate-800' : 'bg-gradient-to-r from-accent to-accent-2 hover:opacity-90 text-white'}`}
                >
                  {t('eye_scan.retry')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AdaptivePracticeModal
        isOpen={practiceId !== null}
        onClose={() => setPracticeId(null)}
        practiceId={practiceId ?? ''}
        onOndEarned={onOndEarned}
      />
    </>
  );
}

function ResultView({
  result,
  onAgain,
  onPick,
}: {
  result: EyeScanResult;
  onAgain: () => void;
  onPick: (id: string) => void;
}) {
  const { t } = useTranslation();
  const practices = recommendedPractices(result.scores);

  return (
    <div className="space-y-3">
      {/* Карточка результата */}
      <div className="bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-2xl p-5 border border-accent/30">
        <h3 className="text-xl font-bold text-text-primary text-center mb-3">
          {t('eye_scan.result_title')}
        </h3>
        <div className="space-y-3 bg-border/10 backdrop-blur-sm rounded-xl p-4">
          {METRICS.map((m) => (
            <ScoreRow key={m.key} label={t(m.labelKey)} value={result.scores[m.key]} />
          ))}
        </div>
        <p className="text-text-muted text-xs text-center mt-3">
          {t('eye_scan.quality', { value: result.scores.quality })}
        </p>
      </div>

      {/* Рекомендованные практики */}
      <div className="space-y-2">
        <h5 className="text-text-secondary text-sm font-semibold text-center">
          {t('eye_scan.recommend')}
        </h5>
        <div className="grid grid-cols-3 gap-2">
          {practices.map((p) => (
            <button
              key={p.id}
              onClick={() => onPick(p.id)}
              className={`text-sm py-2.5 px-3 rounded-lg transition-all border hover:scale-105 ${isLight ? 'bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 text-slate-800' : 'bg-surface-2/50 hover:bg-surface-2/80 text-text-primary border-border/10 hover:border-border/20'}`}
            >
              {t(p.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <p className="text-text-muted text-xs text-center leading-relaxed">
        {t('eye_scan.disclaimer')}
      </p>

      <button
        onClick={onAgain}
        className="w-full bg-surface-2 hover:opacity-90 text-text-primary font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-base"
      >
        <RefreshCw className="w-5 h-5" />
        {t('eye_scan.again')}
      </button>
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1 gap-2 text-text-primary">
        <span>{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="bg-border/15 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-accent h-full rounded-full transition-all duration-1000"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
