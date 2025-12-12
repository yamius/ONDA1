import { useEffect, useRef, useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import OndaWatch, { PracticeStartedEvent, PracticeEndedEvent } from '../plugins/ondaWatch';
import type { PluginListenerHandle } from '@capacitor/core';

const SUPABASE_AUDIO_BASE = 'https://ilckshuxgvrbmibmfpaq.supabase.co/storage/v1/object/public/audio-practices';

const practiceAudioMap: Record<string, string[]> = {
  'p1-1': ['p1-1_Breath of Life/p1-1_Breath of Life-1.mp3', 'p1-1_Breath of Life/p1-1_Breath of Life-2.mp3'],
  'p1-2': ['p1-2_Sense of Being/p1-2_Sense of Being-1.mp3', 'p1-2_Sense of Being/p1-2_Sense of Being-2.mp3'],
  'p1-3': ['p1-3_Warm Pulse/p1-3_Warm Pulse-1.mp3', 'p1-3_Warm Pulse/p1-3_Warm Pulse-2.mp3'],
  'p1-4': ['p1-4_Still Wave/p1-4_Still Wave-1.mp3', 'p1-4_Still Wave/p1-4_Still Wave-2.mp3'],
  'p1-5': ['p1-5_Inner Listening/p1-5_Inner Listening-1.mp3', 'p1-5_Inner Listening/p1-5_Inner Listening-2.mp3'],
  'p1-6': ['p1-6_First Light/p1-6_First Light-1.mp3', 'p1-6_First Light/p1-6_First Light-2.mp3'],
  'p1-7': ['p1-7_Liquid Presence/p1-7_Liquid Presence-1.mp3', 'p1-7_Liquid Presence/p1-7_Liquid Presence-2.mp3'],
  'p1-8': ['p1-8_Breath Counting/p1-8_Breath Counting-1.mp3', 'p1-8_Breath Counting/p1-8_Breath Counting-2.mp3'],
  'p1-9': ['p1-9_Point of Stillness/p1-9_Point of Stillness-1.mp3', 'p1-9_Point of Stillness/p1-9_Point of Stillness-2.mp3', 'p1-9_Point of Stillness/p1-9_Point of Stillness-3.mp3'],
  'p1-10': ['p1-10_I Am Stillness/p1-10_I Am Stillness-1.mp3', 'p1-10_I Am Stillness/p1-10_I Am Stillness-2.mp3', 'p1-10_I Am Stillness/p1-10_I Am Stillness-3.mp3'],
  'p1-11': ['p1-11_Earth Flow/p1-11_Earth Flow-1.mp3', 'p1-11_Earth Flow/p1-11_Earth Flow-2.mp3', 'p1-11_Earth Flow/p1-11_Earth Flow-3.mp3', 'p1-11_Earth Flow/p1-11_Earth Flow-4.mp3'],
  'p1-12': ['p1-12_Body Root/p1-12_Body Root-1.mp3', 'p1-12_Body Root/p1-12_Body Root-2.mp3', 'p1-12_Body Root/p1-12_Body Root-3.mp3', 'p1-12_Body Root/p1-12_Body Root-4.mp3'],
};

interface UseWatchPracticeAudioReturn {
  isPlaying: boolean;
  currentPracticeId: string | null;
  currentTrack: number;
  totalTracks: number;
}

export function useWatchPracticeAudio(): UseWatchPracticeAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPracticeId, setCurrentPracticeId] = useState<string | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [tracks, setTracks] = useState<string[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    setIsPlaying(false);
    setCurrentPracticeId(null);
    setCurrentTrackIndex(0);
    setTracks([]);
    console.log('[WatchAudio] Stopped');
  }, []);

  const playNextTrack = useCallback(() => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
    } else {
      setCurrentTrackIndex(0);
    }
  }, [currentTrackIndex, tracks.length]);

  const startAudio = useCallback((practiceId: string) => {
    const audioPaths = practiceAudioMap[practiceId];
    if (!audioPaths || audioPaths.length === 0) {
      console.log('[WatchAudio] No audio for practice:', practiceId);
      return;
    }

    stopAudio();
    
    setCurrentPracticeId(practiceId);
    setTracks(audioPaths);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
    
    console.log('[WatchAudio] Starting practice:', practiceId, 'tracks:', audioPaths.length);
  }, [stopAudio]);

  useEffect(() => {
    if (!isPlaying || tracks.length === 0) return;

    const trackPath = tracks[currentTrackIndex];
    const fullUrl = `${SUPABASE_AUDIO_BASE}/${encodeURIComponent(trackPath)}`;
    
    console.log('[WatchAudio] Playing track:', currentTrackIndex + 1, 'of', tracks.length);

    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }

    const audio = new Audio(fullUrl);
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    audio.addEventListener('ended', () => {
      console.log('[WatchAudio] Track ended');
      playNextTrack();
    });

    audio.addEventListener('canplaythrough', () => {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      if (!sourceRef.current && audioRef.current) {
        try {
          sourceRef.current = audioContextRef.current!.createMediaElementSource(audioRef.current);
          sourceRef.current.connect(gainNodeRef.current!);
        } catch (e) {
          console.log('[WatchAudio] Source already connected');
        }
      }

      gainNodeRef.current!.gain.setValueAtTime(0, audioContextRef.current!.currentTime);
      gainNodeRef.current!.gain.linearRampToValueAtTime(0.7, audioContextRef.current!.currentTime + 2);
      
      audio.play().catch(err => {
        console.error('[WatchAudio] Play error:', err);
      });
    });

    audio.addEventListener('error', (e) => {
      console.error('[WatchAudio] Audio error:', e);
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [isPlaying, tracks, currentTrackIndex, playNextTrack]);

  useEffect(() => {
    const platform = Capacitor.getPlatform();
    if (platform !== 'ios') return;

    const isPluginAvailable = Capacitor.isPluginAvailable('OndaWatch');
    if (!isPluginAvailable) return;

    let startedListener: PluginListenerHandle | null = null;
    let endedListener: PluginListenerHandle | null = null;

    const setupListeners = async () => {
      try {
        startedListener = await OndaWatch.addListener(
          'practiceStarted',
          (event: PracticeStartedEvent) => {
            console.log('[WatchAudio] Practice started from watch:', event.practiceId);
            startAudio(event.practiceId);
          }
        );

        endedListener = await OndaWatch.addListener(
          'practiceEnded',
          (event: PracticeEndedEvent) => {
            console.log('[WatchAudio] Practice ended from watch:', event.practiceId, 'duration:', event.duration);
            stopAudio();
          }
        );

        console.log('[WatchAudio] Listeners setup OK');
      } catch (err) {
        console.error('[WatchAudio] Listener setup error:', err);
      }
    };

    setupListeners();

    return () => {
      startedListener?.remove();
      endedListener?.remove();
      stopAudio();
    };
  }, [startAudio, stopAudio]);

  return {
    isPlaying,
    currentPracticeId,
    currentTrack: currentTrackIndex + 1,
    totalTracks: tracks.length,
  };
}
