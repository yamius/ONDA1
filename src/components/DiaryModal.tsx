/**
 * DiaryModal — the "Таймлайн" (retention step 3).
 *
 * Two vertical rails: LEFT = baseline markers (daily HRV / resting-pulse /
 * breathing, each toggleable), RIGHT = diary notes (text / voice / photo, each
 * filterable). Time runs top→bottom, NEWEST AT THE BOTTOM, auto-scrolls there.
 *
 * Zoom is by pinch (two fingers) — no scale buttons. The header carries a jump-
 * to-today and a date picker. A round FAB fans out into text/voice/photo capture;
 * flanking it, half-size round toggles (left = which baseline metrics show,
 * right = which diary types show). Local-first (lib/diary.ts).
 */
import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { X, Plus, Type, Mic, Camera, Image as ImageIcon, Play, Pause, Square, Trash2, Check, Calendar, Heart, Wind, Activity, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import HealthKitHeartRate from '../plugins/healthKitHeartRate';
import { buildTimelineHtml, type TimelinePdfCopy } from '../lib/timelinePdf';
import { trackEvent } from '../services/AnalyticsService';
import {
  loadDiaryEntries, saveDiaryEntries, newDiaryId, syncDiaryEntries,
  deleteDiaryEntryRemote, diarySource, loadBaselineSamples,
  putMedia, getMedia, delMedia, mediaKey,
  type DiaryEntry, type BaselineSample,
} from '../lib/diary';

interface DiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  light?: boolean;
  dayRhr?: number | null;
  userId?: string | null;
  /** When opened from an anomaly trigger — stamps the new note's provenance (§4). */
  anomaly?: { metric: string; delta: number } | null;
  /** Anchor an anomaly note to a specific time (the night's sync point, §9). */
  eventTime?: string | null;
  /** Fired after a note is saved in anomaly mode (so the card flips to state 2). */
  onAnomalySaved?: () => void;
}

type RecState = 'idle' | 'recording' | 'recorded';
type MetricKey = 'hrv' | 'rhr' | 'rr';
type DiaryType = 'text' | 'voice' | 'photo';

const DAY = 86_400_000;
const PAD = 28;
const FAB_CLEAR = 128;   // room below the last marker for the FAB + side clusters
const MIN_PX = 4;      // zoom far out (months in view)
const MAX_PX = 6000;   // zoom deep in — minutes-level within a day

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const startOfDay = (t: number) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };

/** Spread overlapping items so each gets `gap` px, but keep each cluster CENTRED
 *  on its members (spreads up AND down, not only down). Input Ys sorted ascending. */
function declutter(ys: number[], gap: number): number[] {
  const n = ys.length;
  if (n === 0) return [];
  const laid = [...ys];
  for (let i = 1; i < n; i++) if (laid[i] < laid[i - 1] + gap) laid[i] = laid[i - 1] + gap; // down-pass
  let i = 0;
  while (i < n) {
    let j = i;
    while (j + 1 < n && Math.abs(laid[j + 1] - (laid[j] + gap)) < 0.5) j++; // gap-locked run i..j
    if (j > i) {
      const realMid = (ys[i] + ys[j]) / 2;
      const laidMid = (laid[i] + laid[j]) / 2;
      let shift = realMid - laidMid;                       // usually negative → move the run up
      if (i > 0) shift = Math.max(shift, (laid[i - 1] + gap) - laid[i]); // don't collide with the run above
      for (let k = i; k <= j; k++) laid[k] += shift;
    }
    i = j + 1;
  }
  return laid;
}

const pickMime = (): string => {
  for (const m of ['audio/webm', 'audio/mp4', 'audio/aac', 'audio/mpeg']) {
    try { if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) return m; } catch { /* noop */ }
  }
  return '';
};

interface ViewPrefs { metrics: Record<MetricKey, boolean>; types: Record<DiaryType, boolean>; }
const DEFAULT_PREFS: ViewPrefs = { metrics: { hrv: true, rhr: true, rr: true }, types: { text: true, voice: true, photo: true } };
function loadPrefs(): ViewPrefs {
  try { const raw = localStorage.getItem('onda_diary_view'); if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) }; } catch { /* noop */ }
  return DEFAULT_PREFS;
}

export default function DiaryModal({ isOpen, onClose, light = false, dayRhr = null, userId = null, anomaly = null, eventTime = null, onAnomalySaved }: DiaryModalProps) {
  const { t, i18n } = useTranslation();

  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [media, setMedia] = useState<Record<string, { audio?: string; photo?: string }>>({});
  const [samples, setSamples] = useState<BaselineSample[]>([]);
  const [prefs, setPrefs] = useState<ViewPrefs>(loadPrefs);
  const [pxPerDay, setPxPerDay] = useState(64);
  const [fabOpen, setFabOpen] = useState(false);
  const [viewPhoto, setViewPhoto] = useState<string | null>(null); // fullscreen photo

  // Editor
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [eventDate, setEventDate] = useState<string>(todayStr());
  const [photoBase64, setPhotoBase64] = useState<string | undefined>();
  const [micError, setMicError] = useState(false);

  // Voice
  const [recState, setRecState] = useState<RecState>('idle');
  const [recTime, setRecTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const editAudioRef = useRef<string | null>(null); // existing audio (data URL) while editing
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const pxRef = useRef(pxPerDay);
  pxRef.current = pxPerDay;
  // Kept current for the pinch focal math (which runs in native listeners).
  const geomRef = useRef<{ tStart: number } | null>(null);
  const pinchRef = useRef<{ time: number; offset: number } | null>(null);

  const reload = useCallback(() => {
    const es = loadDiaryEntries();
    setEntries(es);
    setSamples(loadBaselineSamples());
    // Load media (voice/photo) for entries that carry it, from IndexedDB.
    (async () => {
      const map: Record<string, { audio?: string; photo?: string }> = {};
      for (const e of es) {
        if (e.hasPhoto) { const p = await getMedia(mediaKey(e.id, 'photo')); if (p) (map[e.id] = map[e.id] || {}).photo = p; }
        if (e.hasAudio) { const a = await getMedia(mediaKey(e.id, 'audio')); if (a) (map[e.id] = map[e.id] || {}).audio = a; }
      }
      setMedia(map);
    })();
  }, []);

  const savePrefs = (updater: (p: ViewPrefs) => ViewPrefs) => setPrefs((prev) => {
    const next = updater(prev);
    try { localStorage.setItem('onda_diary_view', JSON.stringify(next)); } catch { /* noop */ }
    return next;
  });
  const toggleMetric = (k: MetricKey) => savePrefs((p) => ({ ...p, metrics: { ...p.metrics, [k]: !p.metrics[k] } }));
  const toggleType = (k: DiaryType) => savePrefs((p) => ({ ...p, types: { ...p.types, [k]: !p.types[k] } }));

  const stopMic = useCallback(() => {
    try { if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop(); } catch { /* noop */ }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const resetEditor = useCallback(() => {
    setText(''); setEventDate(todayStr()); setEditingId(null); setPhotoBase64(undefined);
    setMicError(false); setRecState('idle'); setRecTime(0); stopMic();
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioURL(null); blobRef.current = null; editAudioRef.current = null; audioChunksRef.current = [];
  }, [audioURL, stopMic]);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, []);

  // Load + lock the background scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    reload();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Hard lock: swallow any touch-move that isn't inside the timeline scroller,
    // so the home screen behind the window never scrolls (iOS WKWebView leaks
    // scroll through a fixed overlay otherwise).
    const overlay = overlayRef.current;
    const onTouchMove = (e: TouchEvent) => {
      const sc = scrollRef.current;
      if (!sc || !sc.contains(e.target as Node)) e.preventDefault();
    };
    overlay?.addEventListener('touchmove', onTouchMove, { passive: false });
    const id = window.setTimeout(scrollToBottom, 60);
    return () => { document.body.style.overflow = prevOverflow; overlay?.removeEventListener('touchmove', onTouchMove as EventListener); clearTimeout(id); };
  }, [isOpen, reload, scrollToBottom]);

  // Opened from an anomaly trigger → drop straight into a fresh note.
  useEffect(() => {
    if (isOpen && anomaly) { resetEditor(); setEditorOpen(true); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, anomaly]);

  // Pinch-to-zoom (two fingers) on the timeline — native listeners so we can
  // preventDefault (React's onTouchMove is passive).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isOpen) return;
    let startDist = 0, startPx = pxRef.current, pinching = false;
    const dist = (ts: TouchList) => Math.hypot(ts[0].clientX - ts[1].clientX, ts[0].clientY - ts[1].clientY);
    const onStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinching = true; startDist = dist(e.touches); startPx = pxRef.current;
        // Anchor: the timeline TIME under the midpoint between the two fingers.
        const rect = el.getBoundingClientRect();
        const focalClientY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const offset = focalClientY - rect.top;
        const contentY = el.scrollTop + offset;
        const g = geomRef.current;
        pinchRef.current = { time: g ? g.tStart + ((contentY - PAD) / startPx) * DAY : 0, offset };
      }
    };
    const onMove = (e: TouchEvent) => {
      if (pinching && e.touches.length === 2) {
        e.preventDefault();
        const r = dist(e.touches) / (startDist || 1);
        setPxPerDay(Math.max(MIN_PX, Math.min(MAX_PX, startPx * r)));
      }
    };
    const onEnd = (e: TouchEvent) => { if (e.touches.length < 2) { pinching = false; pinchRef.current = null; } };
    el.addEventListener('touchstart', onStart, { passive: false });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd);
    return () => { el.removeEventListener('touchstart', onStart); el.removeEventListener('touchmove', onMove as EventListener); el.removeEventListener('touchend', onEnd); };
  }, [isOpen]);

  // Debounced Supabase save while signed in.
  useEffect(() => {
    if (!userId) return;
    if (!entries.some((e) => !e.synced)) return;
    const timer = setTimeout(async () => { const n = await syncDiaryEntries(userId); if (n > 0) setEntries(loadDiaryEntries()); }, 1000);
    return () => clearTimeout(timer);
  }, [userId, entries]);

  useEffect(() => () => { stopMic(); if (audioURL) URL.revokeObjectURL(audioURL); }, [audioURL, stopMic]);

  // ---- time → pixel mapping (span = earliest..today; density from pinch) ----
  const geom = useMemo(() => {
    const tEnd = startOfDay(Date.now()) + DAY;
    const times = [
      ...entries.map((e) => new Date(e.event_time).getTime()),
      ...samples.map((s) => s.time),
      tEnd - 7 * DAY,
    ];
    const tStart = startOfDay(Math.min(...times));
    const windowDays = Math.max(7, Math.ceil((tEnd - tStart) / DAY));
    const innerH = windowDays * pxPerDay;
    const y = (time: number) => PAD + Math.max(0, Math.min(innerH, ((time - tStart) / DAY) * pxPerDay));
    return { tStart, tEnd, windowDays, innerH, totalH: innerH + PAD + FAB_CLEAR, y };
  }, [entries, samples, pxPerDay]);
  geomRef.current = { tStart: geom.tStart };

  // Keep the pinch focal point (midpoint between the fingers) fixed on screen
  // while zooming: after pxPerDay changes, re-anchor scrollTop to that time.
  useLayoutEffect(() => {
    const p = pinchRef.current; const el = scrollRef.current; const g = geomRef.current;
    if (!p || !el || !g) return;
    const contentY = PAD + ((p.time - g.tStart) / DAY) * pxPerDay;
    el.scrollTop = contentY - p.offset;
  }, [pxPerDay]);

  // Adaptive scale: day labels when zoomed out; add hour ticks when zoomed in.
  const timeLabels = useMemo(() => {
    const lang = i18n.language || undefined;
    const pxPerHour = pxPerDay / 24;
    const out: { y: number; label: string; major: boolean }[] = [];
    if (pxPerHour * 12 >= 40) {
      const stepH = ([1, 2, 3, 6, 12] as const).find((s) => s * pxPerHour >= 40) ?? 12;
      for (let h = 0; h <= geom.windowDays * 24; h += stepH) {
        const t = geom.tStart + h * 3_600_000;
        const d = new Date(t);
        const dayStart = d.getHours() === 0;
        let label = '';
        try { label = dayStart ? d.toLocaleDateString(lang, { day: 'numeric', month: 'short' }) : d.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' }); } catch { /* noop */ }
        out.push({ y: geom.y(t), label, major: dayStart });
      }
    } else {
      const stepD = pxPerDay >= 60 ? 1 : pxPerDay >= 28 ? 2 : Math.max(1, Math.ceil(30 / pxPerDay));
      for (let d = 0; d <= geom.windowDays; d += stepD) {
        const t = geom.tStart + d * DAY;
        let label = '';
        try { label = new Date(t).toLocaleDateString(lang, { day: 'numeric', month: 'short' }); } catch { /* noop */ }
        out.push({ y: geom.y(t), label, major: true });
      }
    }
    return out;
  }, [geom, pxPerDay, i18n.language]);

  const visibleEntries = useMemo(() => entries.filter((e) => (
    (prefs.types.text && !!e.text) || (prefs.types.voice && !!e.hasAudio) || (prefs.types.photo && !!e.hasPhoto)
  )), [entries, prefs.types]);

  // Each baseline SAMPLE is one point on the left rail (only the enabled metrics
  // it carries are shown).
  const baselinePts = useMemo(() => samples
    .map((s) => ({
      time: s.time,
      vals: (['hrv', 'rhr', 'rr'] as MetricKey[])
        .filter((k) => prefs.metrics[k] && s[k] != null)
        .map((k) => ({ key: k, value: s[k]! })),
    }))
    .filter((p) => p.vals.length > 0)
    .sort((a, b) => a.time - b.time), [samples, prefs.metrics]);

  // The sample nearest a note's time — its baseline values shown inside the note.
  const nearestSample = (t: number): BaselineSample | null => {
    let best: BaselineSample | null = null; let bestD = Infinity;
    for (const s of samples) { const d = Math.abs(s.time - t); if (d < bestD) { bestD = d; best = s; } }
    return best;
  };

  // Lay out each rail's markers: dot stays at its real time (dotY); the label/
  // bubble is pushed down when it would overlap the previous one (labelY), and a
  // leader line links the two.
  const baselineLaid = useMemo(() => {
    const items = baselinePts.map((d) => ({ d, dotY: geom.y(d.time) }));
    const laid = declutter(items.map((i) => i.dotY), 22);
    return items.map((it, i) => ({ ...it, labelY: laid[i] }));
  }, [baselinePts, geom]);

  const diaryLaid = useMemo(() => {
    const items = [...visibleEntries]
      .sort((a, b) => a.event_time.localeCompare(b.event_time))
      .map((e) => ({ e, dotY: geom.y(new Date(e.event_time).getTime()) }));
    const laid = declutter(items.map((i) => i.dotY), 46);
    return items.map((it, i) => ({ ...it, labelY: laid[i] }));
  }, [visibleEntries, geom]);

  const scrollToTime = (time: number) => {
    if (!scrollRef.current) return;
    const y = geom.y(time);
    scrollRef.current.scrollTop = y - scrollRef.current.clientHeight / 2;
  };

  if (!isOpen) return null;

  // ---- voice ---------------------------------------------------------------
  const startRecording = async () => {
    setMicError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const mime = pickMime();
      const mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      mediaRecorderRef.current = mr; audioChunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mr.mimeType || mime || 'audio/webm' });
        blobRef.current = blob;
        if (audioURL) URL.revokeObjectURL(audioURL);
        setAudioURL(URL.createObjectURL(blob)); setRecState('recorded');
        stream.getTracks().forEach((tr) => tr.stop());
      };
      mr.start(100); setRecState('recording'); setRecTime(0);
      timerRef.current = window.setInterval(() => setRecTime((p) => p + 1), 1000);
    } catch { setMicError(true); setRecState('idle'); }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && recState === 'recording') { try { mediaRecorderRef.current.stop(); } catch { /* noop */ } }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };
  const togglePlay = () => {
    const el = audioRef.current; if (!el) return;
    if (isPlaying) { el.pause(); setIsPlaying(false); } else el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };
  const discardVoice = () => {
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioURL(null); blobRef.current = null; editAudioRef.current = null; audioChunksRef.current = [];
    setRecState('idle'); setRecTime(0); setIsPlaying(false);
  };
  const toBase64 = (blob: Blob): Promise<string> => new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onloadend = () => (typeof r.result === 'string' ? resolve(r.result) : reject(new Error('read')));
    r.onerror = reject; r.readAsDataURL(blob);
  });
  const onPhotoPicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { setPhotoBase64(await toBase64(file)); } catch { /* noop */ }
    e.target.value = '';
  };

  const openEditor = (mode: DiaryType) => {
    resetEditor(); setEditorOpen(true); setFabOpen(false);
    if (mode === 'photo') setTimeout(() => photoInputRef.current?.click(), 50);
    if (mode === 'voice') setTimeout(() => startRecording(), 50);
  };
  const persist = (next: DiaryEntry[]) => { setEntries(next); saveDiaryEntries(next); };
  const canSave = text.trim().length > 0 || !!blobRef.current || !!editAudioRef.current || !!photoBase64;

  const handleSave = async () => {
    if (!canSave) return;
    stopMic();
    const backdated = eventDate !== todayStr();
    // Anomaly notes anchor to the night's sync point (§9); otherwise now, or noon
    // of a back-dated day.
    const noteTime = (anomaly && eventTime)
      ? eventTime
      : (backdated ? new Date(`${eventDate}T12:00:00`).toISOString() : new Date().toISOString());
    // New recording overrides the existing clip; photoBase64 holds current photo.
    const audioData = blobRef.current ? await toBase64(blobRef.current) : editAudioRef.current;
    const hasText = text.trim().length > 0;
    const hasAudio = !!audioData; const hasPhoto = !!photoBase64;
    const source = diarySource(hasText, hasAudio, hasPhoto);
    const id = editingId ?? newDiaryId();

    // Media → IndexedDB (never localStorage — it's too big and silently overflows).
    if (hasAudio) await putMedia(mediaKey(id, 'audio'), audioData!); else await delMedia([mediaKey(id, 'audio')]);
    if (hasPhoto) await putMedia(mediaKey(id, 'photo'), photoBase64!); else await delMedia([mediaKey(id, 'photo')]);
    setMedia((m) => ({ ...m, [id]: { audio: hasAudio ? audioData! : undefined, photo: hasPhoto ? photoBase64 : undefined } }));

    if (editingId) {
      persist(entries.map((e) => (e.id === editingId
        ? { ...e, text: text.trim(), event_time: noteTime, hasAudio, hasPhoto, source, synced: false }
        : e)));
    } else {
      persist([{
        id, created_at: new Date().toISOString(), event_time: noteTime, text: text.trim(), hasAudio, hasPhoto, source,
        rhr: backdated ? null : (dayRhr ?? null),
        ...(anomaly ? { fromAnomaly: true, anomalyMetric: anomaly.metric, anomalyDelta: anomaly.delta } : {}),
      }, ...entries]);
      try {
        trackEvent('diary_entry_created', { type: source, backdated, from_anomaly: !!anomaly });
        if (anomaly) trackEvent('anomaly_prompt_answered', { metric: anomaly.metric });
      } catch { /* noop */ }
    }
    resetEditor(); setEditorOpen(false);
    setTimeout(scrollToBottom, 60);
    if (anomaly && !editingId) { try { onAnomalySaved?.(); } catch { /* noop */ } }
  };
  const handleEdit = (e: DiaryEntry) => {
    resetEditor();
    setEditingId(e.id); setText(e.text); setEventDate(e.event_time.slice(0, 10));
    const m = media[e.id];
    setPhotoBase64(m?.photo);
    if (m?.audio) { editAudioRef.current = m.audio; setAudioURL(m.audio); setRecState('recorded'); }
    setEditorOpen(true);
  };
  const handleDelete = (id: string) => {
    persist(entries.filter((e) => e.id !== id));
    setMedia((m) => { const n = { ...m }; delete n[id]; return n; });
    delMedia([mediaKey(id, 'audio'), mediaKey(id, 'photo')]);
    if (editingId === id) { resetEditor(); setEditorOpen(false); }
    if (userId) deleteDiaryEntryRemote(userId, id);
  };
  const handleClose = () => { stopMic(); resetEditor(); setEditorOpen(false); setFabOpen(false); onClose(); };

  const railColor = light ? 'rgb(196,181,253)' : 'rgba(129,140,248,0.5)';
  const METRICS: { key: MetricKey; icon: React.ReactNode; color: string; label: string }[] = [
    { key: 'hrv', icon: <Activity className="w-3.5 h-3.5" />, color: light ? 'rgb(99,102,241)' : 'rgb(129,140,248)', label: t('diary.metric_hrv', 'HRV') },
    { key: 'rhr', icon: <Heart className="w-3.5 h-3.5" />, color: light ? 'rgb(225,29,72)' : 'rgb(251,113,133)', label: t('diary.metric_pulse', 'Пульс') },
    { key: 'rr', icon: <Wind className="w-3.5 h-3.5" />, color: light ? 'rgb(2,132,199)' : 'rgb(56,189,248)', label: t('diary.metric_breath', 'Дых') },
  ];
  const metricColor = (k: MetricKey) => METRICS.find((m) => m.key === k)?.color ?? railColor;
  const metricLabel = (k: MetricKey) => METRICS.find((m) => m.key === k)?.label ?? k;
  const TYPES: { key: DiaryType; icon: React.ReactNode }[] = [
    { key: 'text', icon: <Type className="w-3.5 h-3.5" /> },
    { key: 'voice', icon: <Mic className="w-3.5 h-3.5" /> },
    { key: 'photo', icon: <Camera className="w-3.5 h-3.5" /> },
  ];
  // Half-size (28px) round toggle beside the 56px FAB.
  const sideBtn = (active: boolean, activeColor: string, onClick: () => void, icon: React.ReactNode, key: string, testid: string) => (
    <button key={key} onClick={onClick} data-testid={testid}
      className="w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all"
      style={{ background: active ? activeColor : (light ? '#fff' : '#1f2937'), color: active ? '#fff' : (light ? '#94a3b8' : 'rgba(255,255,255,0.5)'), border: `1px solid ${active ? activeColor : (light ? '#e9d5ff' : 'rgba(255,255,255,0.15)')}` }}
    >{icon}</button>
  );

  // Export the timeline to a PDF ON-DEVICE and open the native share sheet (task
  // 81). Health data never leaves the phone; no email, no server. iOS-only.
  const exportPdf = async () => {
    if (Capacitor.getPlatform() !== 'ios') return;
    try { trackEvent('timeline_export_tapped', {}); } catch { /* noop */ }
    const copy: TimelinePdfCopy = {
      brand: 'ONDA',
      subtitle: t('pdf.subtitle', 'Таймлайн здоровья'),
      privateNote: t('pdf.private_note', 'Личные данные, сформировано на устройстве'),
      period: t('pdf.period', 'Период'),
      baselineHeading: t('pdf.baseline_heading', 'Базлайн за период'),
      metric: { rhr: t('anomaly.metric_rhr', 'пульс покоя'), hrv: t('anomaly.metric_hrv', 'вариабельность'), rr: t('anomaly.metric_rr', 'дыхание') },
      min: t('pdf.min', 'мин'), avg: t('pdf.avg', 'средн.'), max: t('pdf.max', 'макс'),
      nights: (n: number) => t('pdf.nights', '{{count}} ноч.', { count: n }),
      timelineHeading: t('pdf.timeline_heading', 'Таймлайн по дням'),
      colDate: t('pdf.col_date', 'Дата'),
      notesHeading: t('pdf.notes_heading', 'Записи'),
      signalsHeading: t('pdf.signals_heading', 'Сигналы за период'),
      voiceNote: t('diary.voice_note', 'Голосовая заметка'),
      photo: t('diary.photo', 'Фото'),
      deviation: '↕',
      none: '—',
      empty: t('pdf.empty', 'Нет данных за период'),
      lang: i18n.language || 'en',
    };
    const html = buildTimelineHtml({ samples, entries }, copy);
    try {
      await HealthKitHeartRate.exportPdf({ html, fileName: `ONDA-${todayStr()}.pdf` });
      try { trackEvent('timeline_export_completed', {}); } catch { /* noop */ }
    } catch (e) { console.warn('[pdf] export failed', e); }
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 bg-black/85 z-50">
      <div
        className={`absolute inset-x-2 sm:inset-x-4 bottom-2 mx-auto max-w-lg rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${light ? 'bg-white text-slate-800 border-violet-200' : 'bg-gradient-to-br from-gray-900 to-black text-white border-indigo-500/30'}`}
        style={{ top: 'calc(env(safe-area-inset-top) + 6px)' }}
      >
        {/* Header */}
        <div className={`shrink-0 border-b p-3 sm:p-4 ${light ? 'bg-white/95 border-violet-200' : 'bg-gray-900/95 border-indigo-500/30'}`}>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold flex-1">{t('diary.timeline', 'Таймлайн')}</h2>
            {/* Share/export → on-device PDF (left of the calendar). */}
            <button onClick={exportPdf} data-testid="diary-export" aria-label={t('pdf.export', 'Поделиться')} className={`mr-1 p-1.5 rounded-full transition-all ${light ? 'text-slate-500 hover:bg-violet-100' : 'text-white/70 hover:bg-white/10'}`}>
              <Share2 className="w-5 h-5" />
            </button>
            {/* Native date input UNDER a calendar icon — tapping opens the real
                picker (programmatic showPicker() is unreliable in WKWebView). */}
            <label data-testid="diary-jump-date" aria-label={t('diary.pick_date', 'Обрати дату')} className={`relative mr-2 p-1.5 rounded-full cursor-pointer transition-all ${light ? 'text-slate-500 hover:bg-violet-100' : 'text-white/70 hover:bg-white/10'}`}>
              <Calendar className="w-5 h-5" />
              <input type="date" max={todayStr()} onChange={(e) => { if (e.target.value) scrollToTime(new Date(`${e.target.value}T12:00:00`).getTime()); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </label>
            <button onClick={handleClose} data-testid="diary-close" className={`transition-all ${light ? 'text-slate-400 hover:text-slate-700' : 'text-gray-400 hover:text-white'}`}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className={`mt-2 flex text-[11px] font-semibold ${light ? 'text-slate-400' : 'text-white/45'}`}>
            <div className="flex-1 text-center">{t('diary.rail_baseline', 'Базлайн')}</div>
            <div className="flex-1 text-center">{t('diary.rail_diary', 'Дневник')}</div>
          </div>
        </div>

        {/* Timeline scroll area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative" style={{ overscrollBehavior: 'contain', touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' as any }}>
          {visibleEntries.length === 0 && baselinePts.length === 0 ? (
            /* Empty (first run): short rails on top, hint sitting just above the
               FAB — no overlap with the day labels. */
            <div className="min-h-full flex flex-col">
              <div className="relative flex-1" style={{ minHeight: '120px' }}>
                <div className="absolute" style={{ left: '42%', top: PAD, bottom: 0, width: '2px', background: railColor }} />
                <div className="absolute" style={{ left: '58%', top: PAD, bottom: 0, width: '2px', background: railColor }} />
              </div>
              <div className={`px-8 pb-28 text-center ${light ? 'text-slate-400' : 'text-white/40'}`}>
                <p className="text-base mb-1">{t('diary.empty', 'Пока пусто')}</p>
                <p className="text-sm">{t('diary.empty_hint', 'Бросьте пометку о дне — пара слов, голос или фото')}</p>
              </div>
            </div>
          ) : (
          <div className="relative mx-auto" style={{ height: `${geom.totalH}px`, width: '100%' }}>
            <div className="absolute" style={{ left: '42%', top: PAD, height: geom.innerH, width: '2px', background: railColor }} />
            <div className="absolute" style={{ left: '58%', top: PAD, height: geom.innerH, width: '2px', background: railColor }} />

            {/* time scale — centred chips between the two rails; day labels bold,
                hour ticks lighter/smaller. */}
            {timeLabels.map((d, i) => (
              <div key={i} className={`absolute px-1 rounded whitespace-nowrap ${light ? 'bg-white' : 'bg-gray-900'} ${d.major ? `text-xs font-semibold ${light ? 'text-slate-600' : 'text-white/75'}` : `text-[10px] ${light ? 'text-slate-400' : 'text-white/35'}`}`} style={{ top: d.y, left: '50%', transform: 'translate(-50%,-50%)' }}>{d.label}</div>
            ))}

            {/* leader lines: link each dot (real time) to its decluttered label */}
            <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: geom.totalH }}>
              {baselineLaid.filter((x) => Math.abs(x.labelY - x.dotY) > 1).map((x) => (
                <line key={`bl${x.d.time}`} x1="42%" y1={x.dotY} x2="40%" y2={x.labelY} stroke={railColor} strokeWidth="1" />
              ))}
              {diaryLaid.filter((x) => Math.abs(x.labelY - x.dotY) > 1).map((x) => (
                <line key={`d${x.e.id}`} x1="58%" y1={x.dotY} x2="60%" y2={x.labelY} stroke={railColor} strokeWidth="1" />
              ))}
            </svg>

            {/* baseline markers (left rail) — one compact row per day, values
                colour-coded by metric (colour ↔ the toggle buttons below). */}
            {baselineLaid.map(({ d, dotY, labelY }) => (
              <React.Fragment key={d.time}>
                <div className="absolute rounded-full" style={{ left: '42%', top: dotY, width: '8px', height: '8px', transform: 'translate(-50%,-50%)', background: railColor }} />
                <div className="absolute flex justify-end items-center gap-1.5 pr-3" style={{ top: labelY, left: 0, width: '42%', transform: 'translateY(-50%)' }}>
                  {d.vals.map((v) => (
                    <span key={v.key} className="text-xs font-semibold whitespace-nowrap" style={{ color: metricColor(v.key) }}>
                      <span className="inline-block w-1.5 h-1.5 rounded-full mr-0.5 align-middle" style={{ background: metricColor(v.key) }} />{v.value}
                    </span>
                  ))}
                </div>
              </React.Fragment>
            ))}

            {/* diary markers (right rail) */}
            {diaryLaid.map(({ e, dotY, labelY }) => (
              <React.Fragment key={e.id}>
                <div className="absolute rounded-full" style={{ left: '58%', top: dotY, width: '9px', height: '9px', transform: 'translate(-50%,-50%)', background: light ? 'rgb(16,185,129)' : 'rgb(52,211,153)' }} />
                <div className="absolute pl-3" style={{ top: labelY, left: '58%', width: '42%', transform: 'translateY(-50%)' }}>
                  <button onClick={() => handleEdit(e)} data-testid="diary-entry" className={`block w-full text-left rounded-lg px-2 py-1.5 border transition-all ${light ? 'bg-white/80 border-violet-100 hover:border-violet-300' : 'bg-white/5 border-white/10 hover:border-white/25'}`}>
                    <div className="flex items-center gap-1.5">
                      {e.hasPhoto && media[e.id]?.photo && <img src={media[e.id]!.photo} alt="" onClick={(ev) => { ev.stopPropagation(); setViewPhoto(media[e.id]!.photo!); }} className="w-8 h-8 rounded object-cover shrink-0 cursor-pointer" />}
                      {e.text
                        ? <p className="min-w-0 flex-1 text-xs leading-snug line-clamp-2 break-words">{e.text}</p>
                        : (!e.hasPhoto && <p className="min-w-0 flex-1 text-xs opacity-60">{e.hasAudio ? `🎤 ${t('diary.voice_note', 'Голосовая заметка')}` : ''}</p>)}
                    </div>
                  </button>
                </div>
              </React.Fragment>
            ))}
          </div>
          )}
        </div>

        {/* Bottom bar: [metric toggles]  ( + FAB )  [type filters] */}
        <div className="absolute bottom-4 inset-x-0 px-4 flex items-end justify-between z-10 pointer-events-none">
          <div className="flex gap-1.5 pointer-events-auto">
            {METRICS.map((m) => sideBtn(prefs.metrics[m.key], m.color, () => toggleMetric(m.key), m.icon, m.key, `diary-metric-${m.key}`))}
          </div>
          <div className="relative flex flex-col items-center pointer-events-auto">
            {fabOpen && (
              <div className="flex flex-col items-stretch gap-2 mb-2">
                {[{ m: 'text' as const, icon: <Type className="w-4 h-4" />, label: t('diary.add_text', 'Текст') },
                  { m: 'voice' as const, icon: <Mic className="w-4 h-4" />, label: t('diary.add_voice', 'Голос') },
                  { m: 'photo' as const, icon: <Camera className="w-4 h-4" />, label: t('diary.add_photo', 'Фото') }].map((a) => (
                  <button key={a.m} onClick={() => openEditor(a.m)} data-testid={`diary-add-${a.m}`} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-all ${light ? 'bg-white text-slate-700 border border-violet-200' : 'bg-gray-800 text-white border border-white/15'}`}>{a.icon} {a.label}</button>
                ))}
              </div>
            )}
            <button onClick={() => setFabOpen((v) => !v)} data-testid="diary-fab" aria-label={t('diary.add', 'Добавить')} className="w-14 h-14 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center shadow-xl transition-all" style={{ transform: fabOpen ? 'rotate(45deg)' : 'none' }}>
              <Plus className="w-7 h-7" />
            </button>
          </div>
          <div className="flex gap-1.5 pointer-events-auto">
            {TYPES.map((ty) => sideBtn(prefs.types[ty.key], light ? 'rgb(16,185,129)' : 'rgb(52,211,153)', () => toggleType(ty.key), ty.icon, ty.key, `diary-filter-${ty.key}`))}
          </div>
        </div>

        {/* Editor overlay */}
        {editorOpen && (
          <div className={`absolute inset-0 z-20 flex flex-col ${light ? 'bg-white' : 'bg-gradient-to-br from-gray-900 to-black'}`}>
            <div className={`shrink-0 flex items-center justify-between p-3 sm:p-4 border-b ${light ? 'border-violet-200' : 'border-indigo-500/30'}`}>
              <h3 className="text-base sm:text-lg font-bold">{editingId ? t('diary.edit', 'Изменить') : t('diary.new_entry', 'Новая запись')}</h3>
              <button onClick={() => { resetEditor(); setEditorOpen(false); }} className={`${light ? 'text-slate-400 hover:text-slate-700' : 'text-gray-400 hover:text-white'}`}><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t('diary.text_placeholder', 'Что было? Пара слов…')} data-testid="diary-text" rows={4}
                className={`w-full rounded-xl p-3 text-base resize-none outline-none transition-all ${light ? 'bg-violet-50/60 border border-violet-200 focus:border-indigo-400 text-slate-800 placeholder:text-slate-400' : 'bg-white/5 border border-white/15 focus:border-indigo-400 text-white placeholder:text-white/40'}`} />
              <input ref={photoInputRef} type="file" accept="image/*" capture="environment" onChange={onPhotoPicked} className="hidden" data-testid="diary-photo-input" />
              {photoBase64 ? (
                <div className="relative inline-block">
                  <img src={photoBase64} alt="" onClick={() => setViewPhoto(photoBase64)} className="max-h-40 rounded-xl cursor-pointer" data-testid="diary-photo-preview" />
                  <button onClick={() => setPhotoBase64(undefined)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <button onClick={() => photoInputRef.current?.click()} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${light ? 'bg-violet-100 text-indigo-700 hover:bg-violet-200' : 'bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30'}`}>
                  <ImageIcon className="w-4 h-4" /> {t('diary.add_photo', 'Фото')}
                </button>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                {recState !== 'recording' && !audioURL && (
                  <button onClick={startRecording} data-testid="diary-record" className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${light ? 'bg-violet-100 text-indigo-700 hover:bg-violet-200' : 'bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30'}`}>
                    <Mic className="w-4 h-4" /> {t('diary.voice', 'Голос')}
                  </button>
                )}
                {recState === 'recording' && (
                  <button onClick={stopRecording} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all">
                    <Square className="w-4 h-4 fill-current" /> {t('diary.recording', 'Запись')} · {recTime}s
                  </button>
                )}
                {audioURL && recState === 'recorded' && (
                  <>
                    <button onClick={togglePlay} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${light ? 'bg-violet-100 text-indigo-700' : 'bg-indigo-500/20 text-indigo-200'}`}>
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {t('diary.voice_note', 'Голосовая заметка')}
                    </button>
                    <button onClick={discardVoice} className={`p-2 rounded-xl ${light ? 'text-slate-400 hover:text-red-500' : 'text-white/40 hover:text-red-400'}`}><Trash2 className="w-4 h-4" /></button>
                    <audio ref={audioRef} src={audioURL} onEnded={() => setIsPlaying(false)} className="hidden" />
                  </>
                )}
              </div>
              {micError && <p className={`text-xs ${light ? 'text-amber-600' : 'text-amber-300/80'}`}>{t('diary.mic_denied', 'Микрофон недоступен — можно записать текстом.')}</p>}
              {/* This note: time + the nearest baseline reading, spelled out. */}
              {editingId && (() => {
                const ent = entries.find((e) => e.id === editingId);
                if (!ent) return null;
                const s = nearestSample(new Date(ent.event_time).getTime());
                const keys = (['hrv', 'rhr', 'rr'] as MetricKey[]).filter((k) => s && s[k] != null);
                let when = ''; try { when = new Date(ent.event_time).toLocaleString(i18n.language || undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch { /* noop */ }
                return (
                  <div className={`flex items-center gap-3 flex-wrap text-xs ${light ? 'text-slate-500' : 'text-white/50'}`}>
                    <span>{when}</span>
                    {keys.map((k) => (
                      <span key={k} className="font-semibold inline-flex items-center gap-1" style={{ color: metricColor(k) }}>
                        <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: metricColor(k) }} />{metricLabel(k)} {s![k]}
                      </span>
                    ))}
                  </div>
                );
              })()}
              <div className="flex items-center gap-2">
                <label className={`text-xs ${light ? 'text-slate-500' : 'text-white/50'}`}>{t('diary.when', 'Когда')}</label>
                <input type="date" value={eventDate} max={todayStr()} onChange={(e) => setEventDate(e.target.value)} data-testid="diary-date"
                  className={`rounded-lg px-2 py-1 text-sm outline-none ${light ? 'bg-violet-50/60 border border-violet-200 text-slate-700' : 'bg-white/5 border border-white/15 text-white'}`} />
              </div>
            </div>
            <div className={`shrink-0 flex items-center gap-2 p-4 border-t ${light ? 'border-violet-200' : 'border-indigo-500/30'}`}>
              {editingId && <button onClick={() => handleDelete(editingId)} className={`px-3 py-2 rounded-xl text-sm transition-all ${light ? 'text-red-500 hover:bg-red-50' : 'text-red-400 hover:bg-red-500/10'}`}>{t('diary.delete', 'Удалить')}</button>}
              <button onClick={() => { resetEditor(); setEditorOpen(false); }} className={`ml-auto px-3 py-2 rounded-xl text-sm ${light ? 'text-slate-500 hover:text-slate-700' : 'text-white/50 hover:text-white'}`}>{t('diary.cancel', 'Отмена')}</button>
              <button onClick={handleSave} disabled={!canSave} data-testid="diary-save" className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${canSave ? 'bg-indigo-500 text-white hover:bg-indigo-600' : (light ? 'bg-slate-100 text-slate-300' : 'bg-white/5 text-white/30')}`}>
                <Check className="w-4 h-4" /> {t('diary.save', 'Сохранить')}
              </button>
            </div>
          </div>
        )}

        {/* Fullscreen photo viewer */}
        {viewPhoto && (
          <div className="absolute inset-0 z-40 bg-black/95 flex items-center justify-center" onClick={() => setViewPhoto(null)} data-testid="diary-lightbox">
            <img src={viewPhoto} alt="" className="max-w-full max-h-full object-contain" />
            <button onClick={() => setViewPhoto(null)} className="absolute top-3 right-3 text-white/90"><X className="w-7 h-7" /></button>
          </div>
        )}
      </div>
    </div>
  );
}
