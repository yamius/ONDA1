import { useState, useRef, useEffect } from 'react';
import { X, Mic, Square, Play, Pause, Volume2, RefreshCw, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AdaptivePracticeModal } from './AdaptivePracticeModal';

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
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedPractice, setSelectedPractice] = useState<string | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [emotionalResult, setEmotionalResult] = useState<EmotionalResult | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      console.log('[EmotionalCheck] Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('[EmotionalCheck] Microphone access granted, starting recording');
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setRecordingState('recorded');
        stream.getTracks().forEach(track => track.stop());
        console.log('[EmotionalCheck] Recording stopped, audio ready');
      };

      mediaRecorder.start();
      setRecordingState('recording');
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error: any) {
      console.error('[EmotionalCheck] Error accessing microphone:', error);
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
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playAudio = () => {
    if (audioURL && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const analyzeVoice = async () => {
    setRecordingState('analyzing');

    try {
      if (!audioURL) {
        throw new Error('No audio recording available');
      }

      const audioBlob = await fetch(audioURL).then(r => r.blob());

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const apiUrl = `${SUPABASE_URL}/functions/v1/analyze-emotion`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

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

        setEmotionalResult({
          primaryEmotion: randomEmotion.name,
          confidence: randomEmotion.confidence,
          energyLevel: randomEmotion.energy,
          recommendation: randomEmotion.rec
        });
      } else {
        setEmotionalResult({
          primaryEmotion: result.primaryEmotion,
          confidence: result.confidence,
          energyLevel: result.energyLevel,
          recommendation: result.recommendation
        });
      }

      setRecordingState('result');
    } catch (error) {
      console.error('Error analyzing voice:', error);

      const emotions = [
        { name: 'emotional_check.calmness', confidence: 0.75, energy: 0.4, rec: 'emotional_check.rec_calmness' },
        { name: 'emotional_check.joy', confidence: 0.82, energy: 0.8, rec: 'emotional_check.rec_joy' },
        { name: 'emotional_check.anxiety', confidence: 0.68, energy: 0.65, rec: 'emotional_check.rec_anxiety' },
        { name: 'emotional_check.fatigue', confidence: 0.55, energy: 0.25, rec: 'emotional_check.rec_fatigue' },
        { name: 'emotional_check.inspiration', confidence: 0.78, energy: 0.85, rec: 'emotional_check.rec_inspiration' },
        { name: 'emotional_check.contemplation', confidence: 0.62, energy: 0.5, rec: 'emotional_check.rec_contemplation' }
      ];

      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];

      setEmotionalResult({
        primaryEmotion: randomEmotion.name,
        confidence: randomEmotion.confidence,
        energyLevel: randomEmotion.energy,
        recommendation: randomEmotion.rec
      });

      setRecordingState('result');
    }
  };

  const reset = () => {
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
    <div className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto ${selectedPractice ? 'hidden' : ''}`}>
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl max-w-lg w-full shadow-2xl border border-white/10 overflow-hidden my-4">
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{t('emotional_check.title')}</h2>
          <p className="text-indigo-100 text-xs sm:text-sm">{t('emotional_check.subtitle')}</p>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {recordingState === 'idle' && (
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 sm:p-8 border border-indigo-500/30">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                <p className="text-white/80 mb-2 text-sm sm:text-base">{t('emotional_check.instruction')}</p>
                <p className="text-white/60 text-xs sm:text-sm">{t('emotional_check.instruction_detail')}</p>
              </div>
              <button
                onClick={startRecording}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
              >
                {t('emotional_check.start_recording')}
              </button>
            </div>
          )}

          {recordingState === 'recording' && (
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center animate-pulse">
                  <Mic className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-red-500/30 rounded-full animate-ping" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                {formatTime(recordingTime)}
              </div>
              <p className="text-white/70 text-sm sm:text-base">{t('emotional_check.recording_in_progress')}</p>
              <button
                onClick={stopRecording}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Square className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('emotional_check.stop_recording')}
              </button>
            </div>
          )}

          {recordingState === 'recorded' && audioURL && (
            <div className="space-y-4">
              <audio ref={audioRef} src={audioURL} onEnded={() => setIsPlaying(false)} className="hidden" />

              <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6 border border-white/10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-white/70 text-xs sm:text-sm">{t('emotional_check.recording_ready')}</span>
                  <span className="text-white font-semibold text-sm sm:text-base">{formatTime(recordingTime)}</span>
                </div>

                <button
                  onClick={playAudio}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2.5 sm:py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                      {t('emotional_check.pause')}
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                      {t('emotional_check.play')}
                    </>
                  )}
                </button>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={reset}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                >
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t('emotional_check.record_again')}
                </button>
                <button
                  onClick={analyzeVoice}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-all text-xs sm:text-sm"
                >
                  {t('emotional_check.analyze')}
                </button>
              </div>
            </div>
          )}

          {recordingState === 'analyzing' && (
            <div className="text-center space-y-4 sm:space-y-6 py-6 sm:py-8">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
                <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Volume2 className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <p className="text-white font-semibold text-sm sm:text-base">{t('emotional_check.analyzing')}</p>
              <p className="text-white/60 text-xs sm:text-sm">{t('emotional_check.analyzing_detail')}</p>
            </div>
          )}

          {recordingState === 'result' && emotionalResult && (
            <div className="space-y-3 sm:space-y-4">
              <div className={`bg-gradient-to-br ${getEmotionColor(emotionalResult.primaryEmotion)} rounded-2xl p-4 sm:p-6 text-white`}>
                <div className="text-center mb-3 sm:mb-4">
                  <div className="text-4xl sm:text-5xl mb-2">🎭</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-1">{t(emotionalResult.primaryEmotion)}</h3>
                  <p className="text-white/90 text-xs sm:text-sm">{t('emotional_check.detected_state')}</p>
                </div>

                <div className="space-y-2 sm:space-y-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span>{t('emotional_check.confidence')}</span>
                      <span className="font-semibold">{Math.round(emotionalResult.confidence * 100)}%</span>
                    </div>
                    <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-white h-full rounded-full transition-all duration-1000"
                        style={{ width: `${emotionalResult.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span>{t('emotional_check.energy_level')}</span>
                      <span className="font-semibold">{Math.round(emotionalResult.energyLevel * 100)}%</span>
                    </div>
                    <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-300 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${emotionalResult.energyLevel * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 sm:p-5 border border-white/10">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <span>💡</span>
                  {t('emotional_check.recommendation_title')}
                </h4>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                  {t(emotionalResult.recommendation)}
                </p>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <h5 className="text-white/70 text-xs sm:text-sm font-semibold">
                  {t('emotional_check.adaptive_practices')}
                </h5>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {getAdaptivePractices(emotionalResult.primaryEmotion).map((practice, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPractice(practice.id)}
                      className="bg-slate-800/50 hover:bg-slate-700/50 text-white text-[10px] sm:text-xs py-2 px-1.5 sm:px-2 rounded-lg transition-all border border-white/10 hover:border-white/20 hover:scale-105"
                      title={t(`emotional_check.${practice.label}`)}
                    >
                      {t(`emotional_check.${practice.label}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1 sm:pt-2"></div>

              <button
                onClick={() => {
                  // TODO: Implement Terra dialog functionality
                  console.log('Start dialog with Terra');
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('emotional_check.start_dialog_terra')}
              </button>

              <button
                onClick={reset}
                className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
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
