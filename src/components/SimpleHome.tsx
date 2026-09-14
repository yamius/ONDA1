import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Wind, Watch, Camera } from 'lucide-react';
import type { TrafficState } from '../lib/anomaly';

/**
 * Simple mode home (task 83) — a traffic light instead of analytics, for the
 * majority who don't want to read numbers. Shows one 🟢/🟡/🔴 hero (a
 * VISUALIZATION of the same corridor engine), the two familiar tiles (pulse ·
 * breathing, kept as-is), and one practice recommendation by state. No baseline
 * corridors, no coherence, no diary — those live in the detailed mode.
 *
 * Red is a FACT from the person's own data ("outside your usual rhythm N days"),
 * NEVER a medical verdict; muted colour, no alarm, an optional report to show a
 * specialist if THEY choose.
 */
export interface SimpleHomeProps {
  light: boolean;
  traffic: TrafficState;
  heartRate: number | null;
  breathing: number | null;
  connected: boolean;      // watch or camera giving live numbers
  onConnectWatch: () => void;
  onStartCamera: () => void;
  onStartPractice: (metric: 'rhr' | 'hrv' | 'rr' | null) => void;
  onOpenReport: () => void;
}

export function SimpleHome({
  light, traffic, heartRate, breathing, connected,
  onConnectWatch, onStartCamera, onStartPractice, onOpenReport,
}: SimpleHomeProps) {
  const { t } = useTranslation();
  const metric = traffic.metric ?? null;
  const metricName = metric ? t(`anomaly.metric_${metric}`) : '';

  // Palette per state. Red is a MUTED terracotta (attention, not alarm).
  const P = {
    green: { ring: '#10b981', glow: 'rgba(16,185,129,0.22)', chip: light ? 'bg-emerald-500 text-white' : 'bg-emerald-500 text-white' },
    yellow: { ring: '#f59e0b', glow: 'rgba(245,158,11,0.22)', chip: light ? 'bg-amber-500 text-white' : 'bg-amber-500 text-white' },
    red: { ring: '#b45309', glow: 'rgba(180,83,9,0.20)', chip: light ? 'bg-[#b45309] text-white' : 'bg-[#b45309] text-white' },
  }[traffic.light];

  const title = traffic.light === 'green'
    ? t('simple.green_title', 'В твоём ритме')
    : traffic.light === 'yellow'
      ? t('simple.yellow_title', 'Что-то сдвинулось')
      : t('simple.red_title', 'Тело держится вне ритма');

  const body = traffic.light === 'green'
    ? t('simple.green_body', 'Ты в ритме — практика поддержит его.')
    : traffic.light === 'yellow'
      ? t('simple.yellow_body', '{{metric}} вышла за твой обычный ритм.', { metric: metricName })
      : t('simple.red_body', 'Твоё тело держится вне обычного ритма уже {{days}} дн. Часто простой отдых возвращает его в норму. А если решишь разобраться — аналитика в Таймлайне готова показать специалисту.', { days: traffic.redDays ?? 4 });

  const cta = traffic.light === 'green'
    ? t('simple.green_cta', 'Подышать')
    : traffic.light === 'yellow'
      ? t('simple.yellow_cta', 'Начать')
      : t('simple.red_cta', 'Начать практику');

  const tile = (label: string, value: number | null, unit: string, Icon: React.ComponentType<{ className?: string }>) => (
    <div className={`flex-1 rounded-2xl p-4 ${light ? 'bg-white/60 backdrop-blur-xl border border-violet-100 shadow-sm' : 'bg-white/5 backdrop-blur-sm border border-white/10'}`}>
      <div className={`flex items-center gap-1.5 mb-1 ${light ? 'text-slate-500' : 'text-white/60'}`}>
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className={`font-bold leading-none ${light ? 'text-slate-700' : 'text-white'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
        {value != null
          ? <span className="text-3xl">{value}<span className="text-sm font-semibold"> {unit}</span></span>
          : <span className={`text-2xl ${light ? 'text-slate-300' : 'text-white/40'}`}>--</span>}
      </div>
    </div>
  );

  return (
    <div className="mb-6" data-testid="simple-home" data-traffic={traffic.light}>
      {/* Traffic-light hero */}
      <div className={`rounded-3xl p-6 text-center mb-4 ${light ? 'bg-white/60 backdrop-blur-xl border border-violet-100 shadow-lg shadow-indigo-100/50' : 'bg-black/20 backdrop-blur-sm border border-white/10'}`}>
        <div
          className="mx-auto mb-4 rounded-full"
          style={{ width: 96, height: 96, background: P.ring, boxShadow: `0 0 0 10px ${P.glow}` }}
          aria-hidden="true"
        />
        <h2 className={`text-2xl font-bold mb-2 ${light ? 'text-slate-800' : 'text-white'}`}>{title}</h2>
        <p className={`text-sm leading-relaxed max-w-[300px] mx-auto ${light ? 'text-slate-600' : 'text-white/70'}`}>{body}</p>
        <button
          type="button"
          onClick={() => onStartPractice(traffic.light === 'green' ? null : metric)}
          data-testid="simple-cta"
          className={`mt-5 w-full max-w-[280px] mx-auto rounded-xl py-3 font-bold transition-all ${P.chip} hover:opacity-90`}
        >
          {cta}
        </button>
        {traffic.light === 'red' && (
          <button
            type="button"
            onClick={onOpenReport}
            data-testid="simple-report"
            className={`mt-2 text-xs underline underline-offset-2 ${light ? 'text-slate-500' : 'text-white/50'}`}
          >
            {t('simple.red_report', 'Аналитика и отчёт для специалиста')}
          </button>
        )}
      </div>

      {/* Familiar tiles — pulse · breathing (kept as-is; the "watch is connected"
          sign + numbers everyone knows). Or a connect row when nothing is live. */}
      {connected ? (
        <div className="flex gap-3">
          {tile(t('labels.pulse', 'Пульс'), heartRate, t('units.bpm', 'bpm'), Heart)}
          {tile(t('labels.breathing', 'Дыхание'), breathing, t('units.rpm', '/мин'), Wind)}
        </div>
      ) : (
        <div className={`rounded-2xl p-4 text-center ${light ? 'bg-white/60 backdrop-blur-xl border border-violet-100' : 'bg-white/5 backdrop-blur-sm border border-white/10'}`}>
          <p className={`text-xs sm:text-sm mb-3 ${light ? 'text-slate-600' : 'text-white/70'}`}>
            {t('home.biometric.connect_body', 'Подключи, чтобы видеть свой ритм.')}
          </p>
          <div className="flex gap-2 justify-center">
            <button type="button" onClick={onConnectWatch} data-testid="simple-connect-watch" className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${light ? 'bg-violet-100 text-violet-700 hover:bg-violet-200' : 'bg-white/10 text-white hover:bg-white/15'}`}>
              <Watch className="w-4 h-4" />{t('home.biometric.connect_watch', 'Apple Watch')}
            </button>
            <button type="button" onClick={onStartCamera} data-testid="simple-connect-camera" className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${light ? 'bg-violet-100 text-violet-700 hover:bg-violet-200' : 'bg-white/10 text-white hover:bg-white/15'}`}>
              <Camera className="w-4 h-4" />{t('home.biometric.connect_camera', 'Camera')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
