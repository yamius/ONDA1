import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Wind } from 'lucide-react';
import type { TrafficState } from '../lib/anomaly';

/**
 * Simple (compact) mode pieces (task 83 + 84). Compact = the DETAILED home with
 * only the TOP swapped: the traffic-light hero replaces the baseline card, and
 * the coherence hero becomes plain pulse/breathing tiles. Everything from the
 * Timeline button down (connect, timeline, unified Recommendations, full practice
 * list) is IDENTICAL to detailed — so the practice action lives in the shared
 * Recommendations block, and this hero is STATUS ONLY (no CTA).
 *
 * Red is a FACT from the person's own data ("outside your usual rhythm N days"),
 * never a medical verdict; muted terracotta, no alarm.
 */

/** The 🟢/🟡/🔴 hero that replaces the baseline card at the top of compact mode. */
export function SimpleHero({ light, traffic }: { light: boolean; traffic: TrafficState }) {
  const { t } = useTranslation();

  const P = {
    green: { ring: '#10b981', glow: 'rgba(16,185,129,0.22)' },
    yellow: { ring: '#f59e0b', glow: 'rgba(245,158,11,0.22)' },
    red: { ring: '#b45309', glow: 'rgba(180,83,9,0.20)' },
  }[traffic.light];

  // Hero = STATE only (no practice talk — that's the Recommendations block's job).
  const title = traffic.light === 'green'
    ? t('simple.green_title', 'В своём ритме')
    : traffic.light === 'yellow'
      ? t('simple.yellow_title', 'Выход из Базлайна')
      : t('simple.red_title', 'Вне ритма уже {{days}} дней', { days: traffic.redDays ?? 4 });

  // Yellow lists the metric(s) that left the corridor — it describes the state best.
  const outMetrics = (traffic.metrics ?? (traffic.metric ? [traffic.metric] : []))
    .map((m) => t(`anomaly.metric_${m}`)).join(', ');
  const body = traffic.light === 'green'
    ? t('simple.green_body', 'Тело в своём базовом коридоре показателей')
    : traffic.light === 'yellow'
      ? t('simple.yellow_body', 'Вне обычного ритма: {{metrics}}.', { metrics: outMetrics })
      : t('simple.red_body', 'Тело давно вне спокойного ритма');

  return (
    <div className="mb-6 flex flex-col items-center" data-testid="simple-hero" data-traffic={traffic.light}>
      <div className={`w-full max-w-[360px] rounded-3xl p-6 text-center ${light ? 'bg-white/60 backdrop-blur-xl border border-violet-100 shadow-lg shadow-indigo-100/50' : 'bg-black/20 backdrop-blur-sm border border-white/10'}`}>
        <div className="mx-auto mb-4 rounded-full" style={{ width: 96, height: 96, background: P.ring, boxShadow: `0 0 0 10px ${P.glow}` }} aria-hidden="true" />
        <h2 className={`text-2xl font-bold mb-2 ${light ? 'text-slate-800' : 'text-white'}`}>{title}</h2>
        <p className={`text-sm leading-relaxed max-w-[300px] mx-auto ${light ? 'text-slate-600' : 'text-white/70'}`}>{body}</p>
      </div>
    </div>
  );
}

/** Pulse · breathing tiles — the compact stand-in for the coherence hero. */
export function PulseBreathTiles({ light, heartRate, breathing }: { light: boolean; heartRate: number | null; breathing: number | null }) {
  const { t } = useTranslation();
  const tile = (label: string, value: number | null, unit: string, Icon: React.ComponentType<{ className?: string }>) => (
    <div className={`flex-1 rounded-2xl p-4 ${light ? 'bg-white/60 backdrop-blur-xl border border-violet-100 shadow-sm' : 'bg-white/5 backdrop-blur-sm border border-white/10'}`}>
      <div className={`flex items-center gap-1.5 mb-1 ${light ? 'text-slate-500' : 'text-white/60'}`}>
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className={`font-bold leading-none ${light ? 'text-slate-700' : 'text-white'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
        {value != null
          ? <span className="text-3xl">{Math.round(value)}<span className="text-sm font-semibold"> {unit}</span></span>
          : <span className={`text-2xl ${light ? 'text-slate-300' : 'text-white/40'}`}>--</span>}
      </div>
    </div>
  );
  return (
    <div className="flex gap-3" data-testid="simple-tiles">
      {tile(t('labels.pulse', 'Пульс'), heartRate, t('units.bpm', 'bpm'), Heart)}
      {tile(t('labels.breathing', 'Дыхание'), breathing, t('units.rpm', '/мин'), Wind)}
    </div>
  );
}
