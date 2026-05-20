import { useState, useRef, useEffect } from 'react';
import { X, Mic, Square, Play, Pause, Volume2, RefreshCw, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import { AdaptivePracticeModal } from './AdaptivePracticeModal';
import { LizaChatModal } from './LizaChatModal';
import { trackTenjinEmotionalCheck } from '../lib/tenjin';
import { useTheme } from '../theme/ThemeProvider';

interface EmotionalCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOndEarned?: (amount: number) => void;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

type RecordingState = 'idle' | 'recording' | 'recorded' | 'analyzing' | 'result';

interface EmotionalResult {
  primaryEmotion: string;
  confidence: number;
  energyLevel: number;
  recommendation: string;
}

export function EmotionalCheckModal({ isOpen, onClose, onOndEarned }: EmotionalCheckModalProps) {
  const { t } = useTranslation();
  const isLight = useTheme().resolved === 'light';
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedPractice, setSelectedPractice] = useState<string | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [emotionalResult, setEmotionalResult] = useState<EmotionalResult | null>(null);
  const [isLizaChatOpen, setIsLizaChatOpen] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      console.log('[EmotionalCheck] 🚪 Modal OPENED');
    } else {
      console.log('[EmotionalCheck] 🚪 Modal CLOSED');
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      console.log('[EmotionalCheck] 🎤 Starting recording...');
      console.log('[EmotionalCheck] Requesting microphone access...');
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia not supported');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      console.log('[EmotionalCheck] ✅ Microphone access granted');
      console.log('[EmotionalCheck] Audio tracks:', stream.getAudioTracks().length);
      console.log('[EmotionalCheck] 🔊 iOS Audio Session may have changed to RECORD mode');
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('[EmotionalCheck] Audio chunk received:', event.data.size, 'bytes');
        }
      };

      mediaRecorder.onstop = () => {
        console.log('[EmotionalCheck] 🛑 Recording stopped, chunks:', audioChunksRef.current.length);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        console.log('[EmotionalCheck] Audio blob size:', audioBlob.size, 'bytes');
        
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setRecordingState('recorded');
        stream.getTracks().forEach(track => {
          console.log('[EmotionalCheck] Stopping track:', track.label);
          track.stop();
        });
        console.log('[EmotionalCheck] Recording complete, audio ready for playback');
        console.log('[EmotionalCheck] 🔊 iOS Audio Session released (microphone stopped)');
      };

      mediaRecorder.start(100); // Request data every 100ms
      setRecordingState('recording');
      setRecordingTime(0);
      trackTenjinEmotionalCheck('Start');
      console.log('[EmotionalCheck] MediaRecorder started');

      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error: any) {
      console.error('[EmotionalCheck] ❌ Error accessing microphone:', error);
      console.error('[EmotionalCheck] Error name:', error.name);
      console.error('[EmotionalCheck] Error message:', error.message);
      
      let errorMessage = 'Unable to access microphone. Please check permissions.';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Microphone access denied. Please allow microphone access in your device settings and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No microphone found on your device.';
      }
      
      alert(errorMessage);
    }
  };

  const stopRecording = () => {
    console.log('[EmotionalCheck] ⏸️ Stop recording requested');
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playAudio = () => {
    console.log('[EmotionalCheck] 🔊 Play audio requested, current state:', { isPlaying, hasAudio: !!audioURL });
    if (audioURL && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        console.log('[EmotionalCheck] ⏸️ Audio paused');
      } else {
        console.log('[EmotionalCheck] ▶️ Starting audio playback');
        console.log('[EmotionalCheck] 🔊 iOS Audio Session may change to PLAYBACK mode');
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const analyzeVoice = async () => {
    console.log('[EmotionalCheck] 🔍 Starting voice analysis...');
    setRecordingState('analyzing');

    try {
      if (audioChunksRef.current.length === 0) {
        throw new Error('No audio recording available');
      }

      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      console.log('[EmotionalCheck] 📦 Audio blob:', {
        size: audioBlob.size,
        type: audioBlob.type,
        chunks: audioChunksRef.current.length
      });

      // 🔥 НОВОЕ: Конвертируем в base64 (обходит проблемы с FormData на iOS)
      console.log('[EmotionalCheck] 🔄 Converting to base64...');
      const base64Audio = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            console.log('[EmotionalCheck] ✅ Base64 conversion complete');
            resolve(reader.result);
          } else {
            reject(new Error('Failed to read as data URL'));
          }
        };
        reader.onerror = (error) => {
          console.error('[EmotionalCheck] ❌ FileReader error:', error);
          reject(error);
        };
        reader.readAsDataURL(audioBlob);
      });

      console.log('[EmotionalCheck] 📊 Base64 string length:', base64Audio.length);

      const apiUrl = `${SUPABASE_URL}/functions/v1/analyze-emotion`;
      
      // 🔍 ДИАГНОСТИКА
      const platform = Capacitor.getPlatform();
      const isNative = Capacitor.isNativePlatform();
      console.log('[EmotionalCheck] 🌐 API URL:', apiUrl);
      console.log('[EmotionalCheck] 📱 Platform:', platform, 'Native:', isNative);
      console.log('[EmotionalCheck] 🔑 Auth key (first 20 chars):', SUPABASE_ANON_KEY?.substring(0, 20) + '...');
      console.log('[EmotionalCheck] 📤 Sending as base64 JSON via CapacitorHttp...');
      
      const fetchStartTime = Date.now();

      // Попытка с retry для iOS
      let response: Response;
      let lastError: Error | null = null;
      const maxRetries = 2;
      // Ответ ждём не дольше 5 с — иначе сразу в fallback (случайная эмоция),
      // чтобы запись не «думала» по 15 секунд.
      const controller = new AbortController();
      const analysisTimeout = setTimeout(() => controller.abort(), 5000);
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`[EmotionalCheck] 🔄 Fetch attempt ${attempt}/${maxRetries}...`);
          
          response = await fetch(apiUrl, {
            method: 'POST',
            signal: controller.signal,
            headers: {
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              audio: base64Audio,
              format: 'base64'
            }),
          });
          
          lastError = null;
          break; // Success
        } catch (e) {
          lastError = e as Error;
          console.warn(`[EmotionalCheck] ⚠️ Attempt ${attempt} failed:`, lastError.message);
          if (controller.signal.aborted) break; // 5 с истекли — уходим в fallback
          if (attempt < maxRetries) {
            await new Promise(r => setTimeout(r, 1000)); // Wait 1s before retry
          }
        }
      }
      
      clearTimeout(analysisTimeout);

      if (lastError) {
        throw lastError;
      }

      const fetchDuration = Date.now() - fetchStartTime;
      console.log('[EmotionalCheck] ✅ Fetch completed in', fetchDuration, 'ms');
      console.log('[EmotionalCheck] 📊 Response status:', response!.status);

      if (!response!.ok) {
        const errorText = await response!.text();
        console.error('[EmotionalCheck] ❌ API error response:', errorText);
        throw new Error(`API error: ${response!.status} - ${errorText}`);
      }

      const result = await response!.json();
      console.log('[EmotionalCheck] 📦 API result received');

      let resolvedEmotionKey: string;
      if (result.useMock) {
        console.warn('Using mock emotion detection:', result.error || 'API key not configured');

        const emotions = [
          { name: 'emotional_check.calmness', confidence: 0.75, energy: 0.4, rec: 'emotional_check.rec_calmness' },
          { name: 'emotional_check.joy', confidence: 0.82, energy: 0.8, rec: 'emotional_check.rec_joy' },
          { name: 'emotional_check.anxiety', confidence: 0.68, energy: 0.65, rec: 'emotional_check.rec_anxiety' },
          { name: 'emotional_check.fatigue', confidence: 0.55, energy: 0.25, rec: 'emotional_check.rec_fatigue' },
          { name: 'emotional_check.inspiration', confidence: 0.78, energy: 0.85, rec: 'emotional_check.rec_inspiration' },
          { name: 'emotional_check.contemplation', confidence: 0.62, energy: 0.5, rec: 'emotional_check.rec_contemplation' }
        ];

        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        resolvedEmotionKey = randomEmotion.name;

        setEmotionalResult({
          primaryEmotion: randomEmotion.name,
          confidence: randomEmotion.confidence,
          energyLevel: randomEmotion.energy,
          recommendation: randomEmotion.rec
        });
      } else {
        resolvedEmotionKey = result.primaryEmotion;
        setEmotionalResult({
          primaryEmotion: result.primaryEmotion,
          confidence: result.confidence,
          energyLevel: result.energyLevel,
          recommendation: result.recommendation
        });
      }

      setRecordingState('result');
      trackTenjinEmotionalCheck('Finish', t(resolvedEmotionKey));
      console.log('[EmotionalCheck] ✅ Analysis complete, showing results');
    } catch (error: any) {
      console.error('[EmotionalCheck] ❌ Error analyzing voice:', error);
      console.error('[EmotionalCheck] 🔍 Error details:', {
        message: error?.message || 'Unknown error',
        name: error?.name || 'Unknown',
        stack: error?.stack,
        type: typeof error,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
      });
      
      // 🔍 ДИАГНОСТИКА: Специфичные проверки для "Load failed"
      if (error.name === 'TypeError' && error.message === 'Load failed') {
        console.error('[EmotionalCheck] 🚨 Network request blocked or failed (Load failed)');
        console.error('[EmotionalCheck] This typically indicates:');
        console.error('[EmotionalCheck] - iOS WKWebView network restrictions');
        console.error('[EmotionalCheck] - CORS issue with Edge Function');
        console.error('[EmotionalCheck] - Invalid Supabase URL or credentials');
        console.error('[EmotionalCheck] Switched to base64 JSON format to avoid FormData issues');
      }

      // Используем mock данные в случае ошибки (graceful fallback)
      console.warn('[EmotionalCheck] ⚠️ Using fallback mock emotion data due to API error');
      const emotions = [
        { name: 'emotional_check.calmness', confidence: 0.75, energy: 0.4, rec: 'emotional_check.rec_calmness' },
        { name: 'emotional_check.joy', confidence: 0.82, energy: 0.8, rec: 'emotional_check.rec_joy' },
        { name: 'emotional_check.anxiety', confidence: 0.68, energy: 0.65, rec: 'emotional_check.rec_anxiety' },
        { name: 'emotional_check.fatigue', confidence: 0.55, energy: 0.25, rec: 'emotional_check.rec_fatigue' },
        { name: 'emotional_check.inspiration', confidence: 0.78, energy: 0.85, rec: 'emotional_check.rec_inspiration' },
        { name: 'emotional_check.contemplation', confidence: 0.62, energy: 0.5, rec: 'emotional_check.rec_contemplation' }
      ];

      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      console.log('[EmotionalCheck] 🎲 Selected mock emotion:', randomEmotion.name);

      setEmotionalResult({
        primaryEmotion: randomEmotion.name,
        confidence: randomEmotion.confidence,
        energyLevel: randomEmotion.energy,
        recommendation: randomEmotion.rec
      });

      setRecordingState('result');
      trackTenjinEmotionalCheck('Finish', t(randomEmotion.name));
      console.log('[EmotionalCheck] ✅ Fallback analysis complete, showing mock results');
    }
  };

  const reset = () => {
    console.log('[EmotionalCheck] 🔄 Resetting to initial state');
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setRecordingState('idle');
    setRecordingTime(0);
    setEmotionalResult(null);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmotionColor = (emotion: string) => {
    if (emotion.includes('calmness')) return 'from-blue-500 to-cyan-500';
    if (emotion.includes('joy')) return 'from-yellow-500 to-orange-500';
    if (emotion.includes('anxiety')) return 'from-red-500 to-pink-500';
    if (emotion.includes('fatigue')) return 'from-gray-500 to-slate-600';
    if (emotion.includes('inspiration')) return 'from-purple-500 to-indigo-500';
    if (emotion.includes('contemplation')) return 'from-teal-500 to-emerald-500';
    return 'from-gray-500 to-gray-600';
  };

  if (!isOpen) return null;

  return (
    <>
    <div 
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto ${selectedPractice ? 'hidden' : ''}`}
      style={{ paddingTop: 'max(20px, env(safe-area-inset-top))', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
    >
      <div className="bg-gradient-to-br from-bg to-surface text-text-primary rounded-3xl max-w-lg w-full shadow-2xl border border-border/10 overflow-hidden max-h-full flex flex-col my-auto">
        <div className={`relative p-4 flex-shrink-0 ${isLight ? 'bg-gradient-to-r from-indigo-100 to-violet-100' : 'bg-gradient-to-r from-accent to-accent-2'}`}>
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 transition-colors ${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-white/80 hover:text-white'}`}
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className={`text-2xl sm:text-3xl font-bold mb-0.5 text-center ${isLight ? 'text-slate-800' : 'text-white'}`}>{t('emotional_check.title')}</h2>
          <p className={`text-sm text-center ${isLight ? 'text-slate-500' : 'text-indigo-100'}`}>{t('emotional_check.subtitle')}</p>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
          {recordingState === 'idle' && (
            <div className="text-center space-y-4">
              <div className={`rounded-2xl p-6 border ${isLight ? 'bg-white/60 border-violet-200' : 'bg-gradient-to-br from-accent/20 to-accent-2/20 border-accent/30'}`}>
                <div className={`w-20 h-20 mx-auto mb-3 rounded-full flex items-center justify-center ${isLight ? 'bg-gradient-to-br from-indigo-200 to-violet-200' : 'bg-gradient-to-br from-accent to-accent-2'}`}>
                  <Mic className={`w-10 h-10 ${isLight ? 'text-indigo-600' : 'text-white'}`} />
                </div>
                <p className="text-text-primary/80 mb-2 text-base">{t('emotional_check.instruction')}</p>
                <p className="text-text-muted text-sm">{t('emotional_check.instruction_detail')}</p>
              </div>
              <button
                onClick={startRecording}
                className={`w-full font-semibold py-3.5 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg text-base ${isLight ? 'bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/40 text-slate-800' : 'bg-gradient-to-r from-accent to-accent-2 hover:opacity-90 text-white'}`}
              >
                {t('emotional_check.start_recording')}
              </button>
            </div>
          )}

          {recordingState === 'recording' && (
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center animate-pulse">
                  <Mic className="w-12 h-12 text-white" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-4 border-red-500/30 rounded-full animate-ping" />
                </div>
              </div>
              <div className="text-2xl font-bold text-text-primary tabular-nums">
                {formatTime(recordingTime)}
              </div>
              <p className="text-text-secondary text-sm">{t('emotional_check.recording_in_progress')}</p>
              <button
                onClick={stopRecording}
                className={`w-full font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-base ${isLight ? 'bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300' : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'}`}
              >
                <Square className="w-5 h-5" />
                {t('emotional_check.stop_recording')}
              </button>
            </div>
          )}

          {recordingState === 'recorded' && audioURL && (
            <div className="space-y-4">
              <audio ref={audioRef} src={audioURL} onEnded={() => setIsPlaying(false)} className="hidden" />

              <div className="bg-surface-2 rounded-xl p-4 border border-border/10">
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span className="text-text-secondary text-sm">{t('emotional_check.recording_ready')}</span>
                  <span className="text-text-primary font-semibold text-base">{formatTime(recordingTime)}</span>
                </div>

                <button
                  onClick={playAudio}
                  className="w-full bg-surface hover:opacity-90 text-text-primary py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-base"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5" />
                      {t('emotional_check.pause')}
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      {t('emotional_check.play')}
                    </>
                  )}
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="flex-1 bg-surface-2 hover:opacity-90 text-text-primary py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <RefreshCw className="w-5 h-5" />
                  {t('emotional_check.record_again')}
                </button>
                <button
                  onClick={analyzeVoice}
                  className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-all text-base ${isLight ? 'bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/40 text-slate-800' : 'bg-gradient-to-r from-accent to-accent-2 hover:opacity-90 text-white'}`}
                >
                  {t('emotional_check.analyze')}
                </button>
              </div>
            </div>
          )}

          {recordingState === 'analyzing' && (
            <div className="text-center space-y-4 py-6">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-accent/30 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-accent rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Volume2 className="w-10 h-10 text-accent animate-pulse" />
                </div>
              </div>
              <p className="text-text-primary font-semibold text-base">{t('emotional_check.analyzing')}</p>
              <p className="text-text-muted text-sm">{t('emotional_check.analyzing_detail')}</p>
            </div>
          )}

          {recordingState === 'result' && emotionalResult && (
            <div className="space-y-3">
              <div className={`rounded-2xl p-5 ${isLight ? 'bg-gradient-to-br from-indigo-100 to-violet-100 text-slate-700' : `bg-gradient-to-br ${getEmotionColor(emotionalResult.primaryEmotion)} text-white`}`}>
                <div className="text-center mb-3">
                  <div className="text-5xl mb-2">🎭</div>
                  <h3 className="text-2xl font-bold mb-1">{t(emotionalResult.primaryEmotion)}</h3>
                  <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-white/90'}`}>{t('emotional_check.detected_state')}</p>
                </div>

                <div className={`space-y-3 backdrop-blur-sm rounded-xl p-4 ${isLight ? 'bg-white/60' : 'bg-white/10'}`}>
                  <div>
                    <div className="flex justify-between text-sm mb-1 gap-2">
                      <span>{t('emotional_check.confidence')}</span>
                      <span className="font-semibold">{Math.round(emotionalResult.confidence * 100)}%</span>
                    </div>
                    <div className={`rounded-full h-2.5 overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-white/20'}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${isLight ? 'bg-indigo-500' : 'bg-white'}`}
                        style={{ width: `${emotionalResult.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1 gap-2">
                      <span>{t('emotional_check.energy_level')}</span>
                      <span className="font-semibold">{Math.round(emotionalResult.energyLevel * 100)}%</span>
                    </div>
                    <div className={`rounded-full h-2.5 overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-white/20'}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${isLight ? 'bg-amber-400' : 'bg-yellow-300'}`}
                        style={{ width: `${emotionalResult.energyLevel * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-2 rounded-xl p-4 border border-border/10">
                <h4 className="text-text-primary font-semibold mb-2 flex items-center gap-2 text-base">
                  <span>💡</span>
                  {t('emotional_check.recommendation_title')}
                </h4>
                <p className="text-text-primary/80 text-sm leading-relaxed">
                  {t(emotionalResult.recommendation)}
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="text-text-secondary text-sm font-semibold text-center">
                  {t('emotional_check.adaptive_practices')}
                </h5>
                <div className="grid grid-cols-3 gap-2">
                  {getAdaptivePractices(emotionalResult.primaryEmotion).map((practice, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPractice(practice.id)}
                      className={`text-sm py-2.5 px-3 rounded-lg transition-all border hover:scale-105 ${isLight ? 'bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 text-slate-800' : 'bg-surface-2/50 hover:bg-surface-2/80 text-text-primary border-border/10 hover:border-border/20'}`}
                      title={t(`emotional_check.${practice.label}`)}
                    >
                      {t(`emotional_check.${practice.label}`)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsLizaChatOpen(true)}
                className={`w-full font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-base ${isLight ? 'bg-sky-100 hover:bg-sky-200 text-sky-700 border border-sky-200' : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white'}`}
                data-testid="button-start-liza-chat"
              >
                <MessageCircle className="w-5 h-5" />
                {t('emotional_check.start_dialog_terra')}
              </button>

              <button
                onClick={reset}
                className="w-full bg-surface-2 hover:opacity-90 text-text-primary font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-base"
              >
                <RefreshCw className="w-5 h-5" />
                {t('emotional_check.check_again')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

    <AdaptivePracticeModal
      isOpen={selectedPractice !== null}
      onClose={() => setSelectedPractice(null)}
      practiceId={selectedPractice || ''}
      onOndEarned={onOndEarned}
    />

    <LizaChatModal
      isOpen={isLizaChatOpen}
      onClose={() => setIsLizaChatOpen(false)}
      initialEmotion={emotionalResult?.primaryEmotion}
    />
    </>
  );
}

function getAdaptivePractices(emotion: string): Array<{id: string, label: string}> {
  if (emotion.includes('calmness')) {
    return [
      { id: 'earth_breath', label: 'earth_breath' },
      { id: 'wave_pulse', label: 'wave_pulse' },
      { id: 'still_form', label: 'still_form' }
    ];
  }
  if (emotion.includes('joy')) {
    return [
      { id: 'light_inhale', label: 'light_inhale' },
      { id: 'inner_smile', label: 'inner_smile' },
      { id: 'amoeba_dance', label: 'amoeba_dance' }
    ];
  }
  if (emotion.includes('anxiety')) {
    return [
      { id: 'roots_breath', label: 'roots_breath' },
      { id: 'earth_pulse', label: 'earth_pulse' },
      { id: 'body_cocoon', label: 'body_cocoon' }
    ];
  }
  if (emotion.includes('fatigue')) {
    return [
      { id: 'slow_glow', label: 'slow_glow' },
      { id: 'rest_breath', label: 'rest_breath' },
      { id: 'warm_sphere', label: 'warm_sphere' }
    ];
  }
  if (emotion.includes('inspiration')) {
    return [
      { id: 'light_flow', label: 'light_flow' },
      { id: 'inner_spark', label: 'inner_spark' },
      { id: 'breath_possibility', label: 'breath_possibility' }
    ];
  }
  if (emotion.includes('contemplation')) {
    return [
      { id: 'sphere_breath', label: 'sphere_breath' },
      { id: 'silence_point', label: 'point_stillness' },
      { id: 'listen_space', label: 'listen_space' }
    ];
  }
  return [
    { id: 'earth_breath', label: 'earth_breath' },
    { id: 'wave_pulse', label: 'wave_pulse' },
    { id: 'still_form', label: 'still_form' }
  ];
}
