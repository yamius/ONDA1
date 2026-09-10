/**
 * DiaryModal — the "Таймлайн" (retention step 3).
 *
 * Two vertical rails down the middle: the LEFT rail carries baseline markers
 * (daily HRV from the existing onda.hrv_daily_v1 store — the honest history we
 * already have), the RIGHT rail carries diary notes. Time runs top→bottom,
 * NEWEST AT THE BOTTOM (DebugView-style), and the view auto-scrolls there.
 *
 * A time-scale selector sits at the top (week / month / all); a round FAB at the
 * bottom fans out into three capture actions — text, voice, photo. Notes are
 * local-first (lib/diary.ts): saved to localStorage instantly, migrated to
 * Supabase on sign-in. Voice + photo stay base64-local for now (synced later).
 */
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { X, Plus, Type, Mic, Camera, Image as ImageIcon, Play, Pause, Square, Trash2, Check, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../services/AnalyticsService';
import {
  loadDiaryEntries,
  saveDiaryEntries,
  newDiaryId,
  syncDiaryEntries,
  deleteDiaryEntryRemote,
  diarySource,
  type DiaryEntry,
} from '../lib/diary';

interface DiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  light?: boolean;
  dayRhr?: number | null;
  userId?: string | null;
}

type Scale = 'week' | 'month' | 'all';
type RecState = 'idle' | 'recording' | 'recorded';

const DAY = 86_400_000;
const PAD = 28;        // breathing room above the first marker
const FAB_CLEAR = 96;  // empty space below the last marker so the FAB never covers it

interface BaselinePt { time: number; hrv: number; date: string; }

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const startOfDay = (t: number) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };

/** Baseline rail = the daily HRV store the app already keeps (onda.hrv_daily_v1). */
function loadBaselineDaily(): BaselinePt[] {
  try {
    const raw = localStorage.getItem('onda.hrv_daily_v1');
    if (!raw) return [];
    const obj = JSON.parse(raw);
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      return Object.entries(obj)
        .filter(([, v]) => typeof v === 'number' && (v as number) > 0)
        .map(([date, v]) => ({ date, hrv: Math.round(v as number), time: new Date(`${date}T12:00:00`).getTime() }))
        .sort((a, b) => a.time - b.time);
    }
  } catch { /* noop */ }
  return [];
}

const pickMime = (): string => {
  for (const m of ['audio/webm', 'audio/mp4', 'audio/aac', 'audio/mpeg']) {
    try { if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) return m; } catch { /* noop */ }
  }
  return '';
};

export default function DiaryModal({ isOpen, onClose, light = false, dayRhr = null, userId = null }: DiaryModalProps) {
  const { t, i18n } = useTranslation();

  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [baseline, setBaseline] = useState<BaselinePt[]>([]);
  const [scale, setScale] = useState<Scale>('week');
  const [fabOpen, setFabOpen] = useState(false);

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
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const reload = useCallback(() => {
    setEntries(loadDiaryEntries());
    setBaseline(loadBaselineDaily());
  }, []);

  const stopMic = useCallback(() => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop();
    } catch { /* noop */ }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const resetEditor = useCallback(() => {
    setText('');
    setEventDate(todayStr());
    setEditingId(null);
    setPhotoBase64(undefined);
    setMicError(false);
    setRecState('idle');
    setRecTime(0);
    stopMic();
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioURL(null);
    blobRef.current = null;
    audioChunksRef.current = [];
  }, [audioURL, stopMic]);

  // Load on open + scroll the rails to the newest (bottom).
  useEffect(() => {
    if (!isOpen) return;
    reload();
    const id = window.setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 60);
    return () => clearTimeout(id);
  }, [isOpen, reload, scale]);

  // Debounced Supabase save while signed in (mirrors user_game_progress).
  useEffect(() => {
    if (!userId) return;
    if (!entries.some((e) => !e.synced)) return;
    const timer = setTimeout(async () => {
      const n = await syncDiaryEntries(userId);
      if (n > 0) setEntries(loadDiaryEntries());
    }, 1000);
    return () => clearTimeout(timer);
  }, [userId, entries]);

  useEffect(() => () => { stopMic(); if (audioURL) URL.revokeObjectURL(audioURL); }, [audioURL, stopMic]);

  // ---- time → pixel mapping ------------------------------------------------
  const geom = useMemo(() => {
    const tEnd = startOfDay(Date.now()) + DAY; // end of today
    let windowDays: number;
    let pxPerDay: number;
    if (scale === 'week') { windowDays = 7; pxPerDay = 96; }
    else if (scale === 'month') { windowDays = 30; pxPerDay = 34; }
    else {
      const earliest = Math.min(
        ...entries.map((e) => new Date(e.event_time).getTime()),
        ...baseline.map((b) => b.time),
        tEnd - 7 * DAY,
      );
      windowDays = Math.max(7, Math.ceil((tEnd - earliest) / DAY));
      pxPerDay = Math.max(10, Math.min(96, Math.round(2400 / windowDays)));
    }
    const tStart = tEnd - windowDays * DAY;
    const innerH = windowDays * pxPerDay;
    const y = (time: number) => PAD + Math.max(0, Math.min(innerH, ((time - tStart) / DAY) * pxPerDay));
    return { tStart, tEnd, windowDays, pxPerDay, innerH, totalH: innerH + PAD + FAB_CLEAR, y };
  }, [scale, entries, baseline]);

  const dayLabels = useMemo(() => {
    const step = geom.windowDays <= 8 ? 1 : geom.windowDays <= 32 ? 5 : Math.ceil(geom.windowDays / 8);
    const out: { y: number; label: string }[] = [];
    for (let d = 0; d <= geom.windowDays; d += step) {
      const t = geom.tStart + d * DAY;
      let label = '';
      try { label = new Date(t).toLocaleDateString(i18n.language || undefined, { day: 'numeric', month: 'short' }); } catch { label = ''; }
      out.push({ y: geom.y(t), label });
    }
    return out;
  }, [geom, i18n.language]);

  const visibleEntries = useMemo(
    () => entries.filter((e) => { const t = new Date(e.event_time).getTime(); return t >= geom.tStart - DAY && t <= geom.tEnd; }),
    [entries, geom],
  );
  const visibleBaseline = useMemo(
    () => baseline.filter((b) => b.time >= geom.tStart - DAY && b.time <= geom.tEnd),
    [baseline, geom],
  );

  if (!isOpen) return null;

  // ---- voice ---------------------------------------------------------------
  const startRecording = async () => {
    setMicError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const mime = pickMime();
      const mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mr.mimeType || mime || 'audio/webm' });
        blobRef.current = blob;
        if (audioURL) URL.revokeObjectURL(audioURL);
        setAudioURL(URL.createObjectURL(blob));
        setRecState('recorded');
        stream.getTracks().forEach((tr) => tr.stop());
      };
      mr.start(100);
      setRecState('recording');
      setRecTime(0);
      timerRef.current = window.setInterval(() => setRecTime((p) => p + 1), 1000);
    } catch { setMicError(true); setRecState('idle'); }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && recState === 'recording') { try { mediaRecorderRef.current.stop(); } catch { /* noop */ } }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };
  const togglePlay = () => {
    const el = audioRef.current; if (!el) return;
    if (isPlaying) { el.pause(); setIsPlaying(false); }
    else el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };
  const discardVoice = () => {
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioURL(null); blobRef.current = null; audioChunksRef.current = [];
    setRecState('idle'); setRecTime(0); setIsPlaying(false);
  };

  const toBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onloadend = () => (typeof r.result === 'string' ? resolve(r.result) : reject(new Error('read')));
      r.onerror = reject;
      r.readAsDataURL(blob);
    });

  const onPhotoPicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { setPhotoBase64(await toBase64(file)); } catch { /* ignore */ }
    e.target.value = '';
  };

  // ---- editor open / save --------------------------------------------------
  const openEditor = (mode: 'text' | 'voice' | 'photo') => {
    resetEditor();
    setEditorOpen(true);
    setFabOpen(false);
    if (mode === 'photo') setTimeout(() => photoInputRef.current?.click(), 50);
    if (mode === 'voice') setTimeout(() => startRecording(), 50);
  };

  const persist = (next: DiaryEntry[]) => { setEntries(next); saveDiaryEntries(next); };

  const canSave = text.trim().length > 0 || !!blobRef.current || !!photoBase64 || editingId != null;

  const handleSave = async () => {
    if (!canSave) return;
    stopMic();
    const backdated = eventDate !== todayStr();
    const eventTime = backdated ? new Date(`${eventDate}T12:00:00`).toISOString() : new Date().toISOString();

    let audioBase64: string | undefined;
    if (blobRef.current) { try { audioBase64 = await toBase64(blobRef.current); } catch { /* noop */ } }

    const hasText = text.trim().length > 0;

    if (editingId) {
      persist(entries.map((e) => {
        if (e.id !== editingId) return e;
        const audio = audioBase64 ?? e.audioBase64;
        const photo = photoBase64 ?? e.photoBase64;
        return {
          ...e, text: text.trim(), event_time: eventTime,
          audioBase64: audio, photoBase64: photo,
          source: diarySource(hasText, !!audio, !!photo), synced: false,
        };
      }));
    } else {
      const source = diarySource(hasText, !!audioBase64, !!photoBase64);
      const entry: DiaryEntry = {
        id: newDiaryId(), created_at: new Date().toISOString(), event_time: eventTime,
        text: text.trim(), audioBase64, photoBase64, source,
        rhr: backdated ? null : (dayRhr ?? null),
      };
      persist([entry, ...entries]);
      try { trackEvent('diary_entry_created', { type: source, backdated }); } catch { /* noop */ }
    }
    resetEditor();
    setEditorOpen(false);
    setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 60);
  };

  const handleEdit = (e: DiaryEntry) => {
    resetEditor();
    setEditingId(e.id);
    setText(e.text);
    setEventDate(e.event_time.slice(0, 10));
    setPhotoBase64(e.photoBase64);
    setEditorOpen(true);
  };
  const handleDelete = (id: string) => {
    persist(entries.filter((e) => e.id !== id));
    if (editingId === id) { resetEditor(); setEditorOpen(false); }
    if (userId) deleteDiaryEntryRemote(userId, id);
  };
  const handleClose = () => { stopMic(); resetEditor(); setEditorOpen(false); setFabOpen(false); onClose(); };

  const fmtTime = (iso: string) => {
    try { return new Date(iso).toLocaleTimeString(i18n.language || undefined, { hour: '2-digit', minute: '2-digit' }); }
    catch { return ''; }
  };

  const railColor = light ? 'rgb(196,181,253)' : 'rgba(129,140,248,0.5)';
  const scales: Scale[] = ['week', 'month', 'all'];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 pt-[env(safe-area-inset-top)]">
      <div className={`relative max-w-lg w-full h-[88vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${light ? 'bg-white text-slate-800 border-violet-200' : 'bg-gradient-to-br from-gray-900 to-black text-white border-indigo-500/30'}`}>
        {/* Header + scale selector */}
        <div className={`shrink-0 border-b p-3 sm:p-4 ${light ? 'bg-white/95 border-violet-200' : 'bg-gray-900/95 border-indigo-500/30'}`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg sm:text-xl font-bold">{t('diary.timeline', 'Таймлайн')}</h2>
            <button onClick={handleClose} data-testid="diary-close" className={`transition-all ${light ? 'text-slate-400 hover:text-slate-700' : 'text-gray-400 hover:text-white'}`}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            {scales.map((s) => (
              <button
                key={s}
                onClick={() => setScale(s)}
                data-testid={`diary-scale-${s}`}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${scale === s ? 'bg-indigo-500 text-white' : (light ? 'bg-violet-50 text-slate-500 hover:bg-violet-100' : 'bg-white/5 text-white/60 hover:bg-white/10')}`}
              >
                {t(`diary.scale_${s}`, s)}
              </button>
            ))}
          </div>
          {/* Rail headers */}
          <div className={`mt-2 flex text-[11px] font-semibold ${light ? 'text-slate-400' : 'text-white/45'}`}>
            <div className="flex-1 text-center">{t('diary.rail_baseline', 'Базлайн')}</div>
            <div className="flex-1 text-center">{t('diary.rail_diary', 'Дневник')}</div>
          </div>
        </div>

        {/* Timeline scroll area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative">
          <div className="relative mx-auto" style={{ height: `${geom.totalH}px`, width: '100%' }}>
            {/* two central rails */}
            <div className="absolute" style={{ left: '42%', top: PAD, height: geom.innerH, width: '2px', background: railColor }} />
            <div className="absolute" style={{ left: '58%', top: PAD, height: geom.innerH, width: '2px', background: railColor }} />

            {/* day/time labels down the middle */}
            {dayLabels.map((d, i) => (
              <div key={i} className={`absolute text-[10px] text-center ${light ? 'text-slate-300' : 'text-white/30'}`}
                style={{ top: d.y, left: '42%', width: '16%', transform: 'translateY(-50%)' }}>
                {d.label}
              </div>
            ))}

            {/* baseline markers (left rail) */}
            {visibleBaseline.map((b) => (
              <React.Fragment key={b.date}>
                <div className="absolute rounded-full" style={{ left: '42%', top: geom.y(b.time), width: '9px', height: '9px', transform: 'translate(-50%,-50%)', background: light ? 'rgb(99,102,241)' : 'rgb(129,140,248)' }} />
                <div className="absolute text-right pr-3" style={{ top: geom.y(b.time), left: 0, width: '42%', transform: 'translateY(-50%)' }}>
                  <span className={`text-xs font-semibold ${light ? 'text-slate-600' : 'text-white/80'}`}>{b.hrv}<span className="opacity-50"> HRV</span></span>
                </div>
              </React.Fragment>
            ))}

            {/* diary markers (right rail) */}
            {visibleEntries.map((e) => (
              <React.Fragment key={e.id}>
                <div className="absolute rounded-full" style={{ left: '58%', top: geom.y(new Date(e.event_time).getTime()), width: '9px', height: '9px', transform: 'translate(-50%,-50%)', background: light ? 'rgb(16,185,129)' : 'rgb(52,211,153)' }} />
                <div className="absolute pl-3" style={{ top: geom.y(new Date(e.event_time).getTime()), left: '58%', width: '42%', transform: 'translateY(-50%)' }}>
                  <button onClick={() => handleEdit(e)} data-testid="diary-entry" className={`block w-full text-left rounded-lg px-2 py-1.5 border transition-all ${light ? 'bg-white/80 border-violet-100 hover:border-violet-300' : 'bg-white/5 border-white/10 hover:border-white/25'}`}>
                    <div className="flex items-center gap-1.5">
                      {e.photoBase64 && <img src={e.photoBase64} alt="" className="w-8 h-8 rounded object-cover shrink-0" />}
                      <div className="min-w-0 flex-1">
                        {e.text
                          ? <p className="text-xs leading-snug line-clamp-2 break-words">{e.text}</p>
                          : <p className="text-xs opacity-60">{e.audioBase64 ? `🎤 ${t('diary.voice_note', 'Голосовая заметка')}` : e.photoBase64 ? `🖼 ${t('diary.photo', 'Фото')}` : ''}</p>}
                        <span className={`text-[10px] ${light ? 'text-slate-400' : 'text-white/40'}`}>{fmtTime(e.event_time)}{e.audioBase64 && !e.text ? '' : e.audioBase64 ? ' · 🎤' : ''}</span>
                      </div>
                    </div>
                  </button>
                </div>
              </React.Fragment>
            ))}
          </div>

          {visibleEntries.length === 0 && visibleBaseline.length === 0 && (
            <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none ${light ? 'text-slate-400' : 'text-white/40'}`}>
              <p className="text-base mb-1">{t('diary.empty', 'Пока пусто')}</p>
              <p className="text-sm px-8 text-center">{t('diary.empty_hint', 'Бросьте пометку о дне — пара слов, голос или фото')}</p>
            </div>
          )}
        </div>

        {/* FAB + fan-out actions */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          {fabOpen && (
            <div className="flex flex-col items-stretch gap-2 mb-1">
              {[
                { m: 'text' as const, icon: <Type className="w-4 h-4" />, label: t('diary.add_text', 'Текст') },
                { m: 'voice' as const, icon: <Mic className="w-4 h-4" />, label: t('diary.add_voice', 'Голос') },
                { m: 'photo' as const, icon: <Camera className="w-4 h-4" />, label: t('diary.add_photo', 'Фото') },
              ].map((a) => (
                <button
                  key={a.m}
                  onClick={() => openEditor(a.m)}
                  data-testid={`diary-add-${a.m}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-all ${light ? 'bg-white text-slate-700 border border-violet-200' : 'bg-gray-800 text-white border border-white/15'}`}
                >
                  {a.icon} {a.label}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setFabOpen((v) => !v)}
            data-testid="diary-fab"
            aria-label={t('diary.add', 'Добавить')}
            className="w-14 h-14 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center shadow-xl transition-all"
            style={{ transform: fabOpen ? 'rotate(45deg)' : 'none' }}
          >
            <Plus className="w-7 h-7" />
          </button>
        </div>

        {/* Editor overlay */}
        {editorOpen && (
          <div className={`absolute inset-0 z-20 flex flex-col ${light ? 'bg-white' : 'bg-gradient-to-br from-gray-900 to-black'}`}>
            <div className={`shrink-0 flex items-center justify-between p-3 sm:p-4 border-b ${light ? 'border-violet-200' : 'border-indigo-500/30'}`}>
              <h3 className="text-base sm:text-lg font-bold">{editingId ? t('diary.edit', 'Изменить') : t('diary.new_entry', 'Новая запись')}</h3>
              <button onClick={() => { resetEditor(); setEditorOpen(false); }} className={`${light ? 'text-slate-400 hover:text-slate-700' : 'text-gray-400 hover:text-white'}`}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('diary.text_placeholder', 'Что было? Пара слов…')}
                data-testid="diary-text"
                rows={4}
                autoFocus
                className={`w-full rounded-xl p-3 text-base resize-none outline-none transition-all ${light ? 'bg-violet-50/60 border border-violet-200 focus:border-indigo-400 text-slate-800 placeholder:text-slate-400' : 'bg-white/5 border border-white/15 focus:border-indigo-400 text-white placeholder:text-white/40'}`}
              />

              {/* photo */}
              <input ref={photoInputRef} type="file" accept="image/*" capture="environment" onChange={onPhotoPicked} className="hidden" data-testid="diary-photo-input" />
              {photoBase64 ? (
                <div className="relative inline-block">
                  <img src={photoBase64} alt="" className="max-h-40 rounded-xl" />
                  <button onClick={() => setPhotoBase64(undefined)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <button onClick={() => photoInputRef.current?.click()} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${light ? 'bg-violet-100 text-indigo-700 hover:bg-violet-200' : 'bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30'}`}>
                  <ImageIcon className="w-4 h-4" /> {t('diary.add_photo', 'Фото')}
                </button>
              )}

              {/* voice */}
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

              {/* when */}
              <div className="flex items-center gap-2">
                <label className={`text-xs ${light ? 'text-slate-500' : 'text-white/50'}`}>{t('diary.when', 'Когда')}</label>
                <input type="date" value={eventDate} max={todayStr()} onChange={(e) => setEventDate(e.target.value)} data-testid="diary-date"
                  className={`rounded-lg px-2 py-1 text-sm outline-none ${light ? 'bg-violet-50/60 border border-violet-200 text-slate-700' : 'bg-white/5 border border-white/15 text-white'}`} />
              </div>
            </div>
            <div className={`shrink-0 flex items-center gap-2 p-4 border-t ${light ? 'border-violet-200' : 'border-indigo-500/30'}`}>
              {editingId && (
                <button onClick={() => handleDelete(editingId)} className={`px-3 py-2 rounded-xl text-sm transition-all ${light ? 'text-red-500 hover:bg-red-50' : 'text-red-400 hover:bg-red-500/10'}`}>
                  {t('diary.delete', 'Удалить')}
                </button>
              )}
              <button onClick={() => { resetEditor(); setEditorOpen(false); }} className={`ml-auto px-3 py-2 rounded-xl text-sm ${light ? 'text-slate-500 hover:text-slate-700' : 'text-white/50 hover:text-white'}`}>
                {t('diary.cancel', 'Отмена')}
              </button>
              <button onClick={handleSave} disabled={!canSave} data-testid="diary-save"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${canSave ? 'bg-indigo-500 text-white hover:bg-indigo-600' : (light ? 'bg-slate-100 text-slate-300' : 'bg-white/5 text-white/30')}`}>
                <Check className="w-4 h-4" /> {t('diary.save', 'Сохранить')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
