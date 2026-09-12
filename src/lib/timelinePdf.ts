/**
 * Timeline → HTML report (task 81). PURE: builds a self-contained HTML document
 * that the native side renders to a PDF ON-DEVICE (WKWebView → A4). Real text
 * (system fonts cover Cyrillic/CJK), ONDA palette, doctor-readable — a personal
 * corridor + facts, NEVER diagnoses or a medical "norm".
 */
import type { DiaryEntry, BaselineSample } from './diary';

export interface TimelinePdfData {
  samples: BaselineSample[];
  entries: DiaryEntry[];
}

/** Minimal i18n surface the report needs (passed in so the lib stays pure). */
export interface TimelinePdfCopy {
  brand: string;            // "ONDA"
  subtitle: string;         // "Таймлайн здоровья"
  privateNote: string;      // "Личные данные, сформировано на устройстве"
  period: string;           // "Период"
  baselineHeading: string;
  metric: { rhr: string; hrv: string; rr: string };
  min: string; avg: string; max: string; nights: (n: number) => string;
  timelineHeading: string;
  colDate: string;
  notesHeading: string;
  signalsHeading: string;
  voiceNote: string; photo: string;
  deviation: string;        // short mark, e.g. "↕"
  none: string;             // "—"
  empty: string;            // "Нет данных за период"
  lang: string;             // BCP-47 for date formatting
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const dayKey = (t: number) => new Date(t).toISOString().slice(0, 10);

function fmtDate(iso: string | number, lang: string): string {
  try { return new Date(iso).toLocaleDateString(lang || undefined, { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return String(iso).slice(0, 10); }
}
function stats(xs: number[]) {
  if (xs.length === 0) return null;
  const min = Math.min(...xs), max = Math.max(...xs);
  const avg = Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10;
  return { min, avg, max, n: xs.length };
}

export function buildTimelineHtml(data: TimelinePdfData, c: TimelinePdfCopy): string {
  const samples = [...data.samples].sort((a, b) => a.time - b.time);
  const entries = [...data.entries].sort((a, b) => a.event_time.localeCompare(b.event_time));

  // Period span across all data.
  const times = [...samples.map((s) => s.time), ...entries.map((e) => new Date(e.event_time).getTime())];
  const period = times.length
    ? `${fmtDate(Math.min(...times), c.lang)} — ${fmtDate(Math.max(...times), c.lang)}`
    : c.none;

  // Baseline corridors over the period.
  const rhr = stats(samples.map((s) => s.rhr).filter((v): v is number => v != null));
  const hrv = stats(samples.map((s) => s.hrv).filter((v): v is number => v != null));
  const rr = stats(samples.map((s) => s.rr).filter((v): v is number => v != null));
  const baselineRow = (label: string, s: ReturnType<typeof stats>) => s
    ? `<tr><td>${esc(label)}</td><td>${s.min}</td><td><b>${s.avg}</b></td><td>${s.max}</td><td class="muted">${esc(c.nights(s.n))}</td></tr>`
    : '';

  // Which dates carry an anomaly (for the deviation mark).
  const anomalyDates = new Set(entries.filter((e) => e.fromAnomaly).map((e) => dayKey(new Date(e.event_time).getTime())));

  // Timeline table: one row per baseline sample (a day's reading).
  const tlRows = samples.map((s) => {
    const dev = anomalyDates.has(dayKey(s.time)) ? ` <span class="dev">${esc(c.deviation)}</span>` : '';
    return `<tr><td>${esc(fmtDate(s.time, c.lang))}${dev}</td><td>${s.rhr ?? c.none}</td><td>${s.hrv ?? c.none}</td><td>${s.rr ?? c.none}</td></tr>`;
  }).join('');

  // Notes (facts) — text, or a marker for voice/photo.
  const noteBlocks = entries.map((e) => {
    const body = e.text
      ? esc(e.text)
      : (e.hasAudio ? `<i>${esc(c.voiceNote)}</i>` : e.hasPhoto ? `<i>${esc(c.photo)}</i>` : '');
    if (!body && !e.hasAudio && !e.hasPhoto) return '';
    const extra = [e.hasAudio ? '🎤' : '', e.hasPhoto ? '🖼' : ''].filter(Boolean).join(' ');
    return `<div class="note"><span class="date">${esc(fmtDate(e.event_time, c.lang))}</span> ${body} ${extra ? `<span class="muted">${extra}</span>` : ''}</div>`;
  }).join('');

  // Signals — deviations that carried through the trigger.
  const signalRows = entries.filter((e) => e.fromAnomaly).map((e) => {
    const mLabel = e.anomalyMetric ? (c.metric as Record<string, string>)[e.anomalyMetric] ?? e.anomalyMetric : c.none;
    const delta = e.anomalyDelta != null ? (e.anomalyDelta > 0 ? `+${e.anomalyDelta}` : `${e.anomalyDelta}`) : '';
    return `<tr><td>${esc(fmtDate(e.event_time, c.lang))}</td><td>${esc(mLabel)}</td><td>${esc(delta)}</td><td>${e.text ? esc(e.text) : c.none}</td></tr>`;
  }).join('');

  const isEmpty = samples.length === 0 && entries.length === 0;

  return `<!doctype html><html lang="${esc(c.lang)}"><head><meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  html, body { background: #ffffff; }
  body { font: 12px/1.5 -apple-system, "PingFang SC", "Helvetica Neue", Arial, sans-serif; color: #1e293b; margin: 0; padding: 0; }
  h1 { font-size: 20px; margin: 0; color: #4338ca; letter-spacing: .5px; }
  h2 { font-size: 13px; margin: 22px 0 8px; color: #4338ca; border-bottom: 1px solid #e0e7ff; padding-bottom: 4px; }
  .sub { color: #64748b; font-size: 11px; margin-top: 2px; }
  .head { border-bottom: 2px solid #6366f1; padding-bottom: 10px; margin-bottom: 6px; }
  table { width: 100%; border-collapse: collapse; margin-top: 4px; }
  th, td { text-align: left; padding: 4px 6px; border-bottom: 1px solid #eef2f7; font-size: 11px; }
  th { color: #64748b; font-weight: 600; border-bottom: 1px solid #cbd5e1; }
  td:not(:first-child), th:not(:first-child) { text-align: right; }
  .muted { color: #94a3b8; }
  .dev { color: #d97706; font-weight: 700; }
  .note { margin: 5px 0; font-size: 11px; }
  .note .date { color: #6366f1; font-weight: 600; margin-right: 6px; }
  .empty { color: #94a3b8; text-align: center; padding: 40px 0; }
</style></head>
<body style="padding: 8px 4px;">
  <div class="head">
    <h1>${esc(c.brand)}</h1>
    <div class="sub">${esc(c.subtitle)} · ${esc(c.period)}: ${esc(period)}</div>
    <div class="sub">${esc(c.privateNote)}</div>
  </div>
  ${isEmpty ? `<div class="empty">${esc(c.empty)}</div>` : `
  ${(rhr || hrv || rr) ? `<h2>${esc(c.baselineHeading)}</h2>
  <table><tr><th></th><th>${esc(c.min)}</th><th>${esc(c.avg)}</th><th>${esc(c.max)}</th><th></th></tr>
    ${baselineRow(c.metric.rhr, rhr)}${baselineRow(c.metric.hrv, hrv)}${baselineRow(c.metric.rr, rr)}
  </table>` : ''}
  ${samples.length ? `<h2>${esc(c.timelineHeading)}</h2>
  <table><tr><th>${esc(c.colDate)}</th><th>${esc(c.metric.rhr)}</th><th>${esc(c.metric.hrv)}</th><th>${esc(c.metric.rr)}</th></tr>
    ${tlRows}
  </table>` : ''}
  ${noteBlocks ? `<h2>${esc(c.notesHeading)}</h2>${noteBlocks}` : ''}
  ${signalRows ? `<h2>${esc(c.signalsHeading)}</h2>
  <table><tr><th>${esc(c.colDate)}</th><th></th><th></th><th></th></tr>${signalRows}</table>` : ''}
  `}
</body></html>`;
}
