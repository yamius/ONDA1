import { useEffect, useRef, useState } from 'react';
import { useAudioCache, useAudioPreloader } from '../hooks/useAudioCache';
import { Loader2 } from 'lucide-react';

interface RemoteAudioPlayerProps {
  isPlaying: boolean;
  audioPath: string;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  volume?: number;
  resetKey?: string | number;
  onTrackChange?: (currentTrack: number, totalTracks: number) => void;
  onLoadingChange?: (loading: boolean, progress: number) => void;
  showLoadingIndicator?: boolean;
}

export const RemoteAudioPlayer: React.FC<RemoteAudioPlayerProps> = ({
  isPlaying,
  audioPath,
  fadeInDuration = 3000,
  fadeOutDuration = 3000,
  volume = 0.7,
  resetKey,
  onTrackChange,
  onLoadingChange,
  showLoadingIndicator = false,
}) => {
  const [availableTracks, setAvailableTracks] = useState<string[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrackPath = availableTracks[currentTrackIndex] || audioPath;

  const { url, loading, progress, error } = useAudioCache(currentTrackPath);
  const preloader = useAudioPreloader();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const fadeOutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstPlayRef = useRef<boolean>(true);

  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(loading, progress);
    }
  }, [loading, progress, onLoadingChange]);

  useEffect(() => {
    const detectMultiTrackFiles = () => {
      const tracks: string[] = [];
      const basePattern = audioPath.replace(/-1\.mp3$/, '');

      for (let i = 1; i <= 10; i++) {
        tracks.push(`${basePattern}-${i}.mp3`);
      }

      setAvailableTracks(tracks);

      if (onTrackChange) {
        onTrackChange(1, tracks.length);
      }

      if (tracks.length > 1) {
        preloader.preload(tracks.slice(1, 3));
      }
    };

    detectMultiTrackFiles();
  }, [audioPath, onTrackChange]);

  useEffect(() => {
    isFirstPlayRef.current = true;
    setCurrentTrackIndex(0);
  }, [resetKey]);

  useEffect(() => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = 0;
    }

    if (!url || error) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.volume = 1;
      audioRef.current.loop = availableTracks.length === 1;

      const handleEnded = () => {
        console.log('[RemoteAudioPlayer] Track ended', {
          currentIndex: currentTrackIndex,
          totalTracks: availableTracks.length,
        });

        if (availableTracks.length > 1 && currentTrackIndex < availableTracks.length - 1) {
          const nextIndex = currentTrackIndex + 1;
          setCurrentTrackIndex(nextIndex);

          if (onTrackChange) {
            onTrackChange(nextIndex + 1, availableTracks.length);
          }

          if (nextIndex + 2 < availableTracks.length) {
            preloader.preload([availableTracks[nextIndex + 2]]);
          }
        } else if (availableTracks.length > 1) {
          setCurrentTrackIndex(0);
          if (onTrackChange) {
            onTrackChange(1, availableTracks.length);
          }
        }
      };

      audioRef.current.addEventListener('ended', handleEnded);

      if (audioContextRef.current && gainNodeRef.current && !sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(gainNodeRef.current);
      }
    } else if (audioRef.current.src !== url) {
      audioRef.current.src = url;
      audioRef.current.load();
    }
  }, [url, error, availableTracks.length, currentTrackIndex, onTrackChange]);

  useEffect(() => {
    const audio = audioRef.current;
    const gainNode = gainNodeRef.current;
    const audioContext = audioContextRef.current;

    if (!gainNode || !audioContext || !audio || !url) return;

    const fadeIn = async () => {
      if (fadeOutTimerRef.current) {
        clearTimeout(fadeOutTimerRef.current);
        fadeOutTimerRef.current = null;
      }

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      if (isFirstPlayRef.current) {
        audio.currentTime = 0;
        isFirstPlayRef.current = false;
      }

      try {
        await audio.play();
        const currentTime = audioContext.currentTime;
        gainNode.gain.cancelScheduledValues(currentTime);
        gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, currentTime + fadeInDuration / 1000);
      } catch (err) {
        console.error('[RemoteAudioPlayer] Play error:', err);
      }
    };

    const fadeOut = () => {
      const currentTime = audioContext.currentTime;
      gainNode.gain.cancelScheduledValues(currentTime);
      gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.001, currentTime + fadeOutDuration / 1000);

      if (fadeOutTimerRef.current) {
        clearTimeout(fadeOutTimerRef.current);
      }

      fadeOutTimerRef.current = setTimeout(() => {
        audio.pause();
        fadeOutTimerRef.current = null;
      }, fadeOutDuration);
    };

    if (isPlaying && !loading) {
      fadeIn();
    } else if (!isPlaying && !audio.paused) {
      fadeOut();
    }
  }, [isPlaying, url, loading, fadeInDuration, fadeOutDuration, volume]);

  useEffect(() => {
    return () => {
      if (fadeOutTimerRef.current) {
        clearTimeout(fadeOutTimerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  if (showLoadingIndicator && loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="audio-loading">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Загрузка аудио... {progress}%</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive" data-testid="audio-error">
        Ошибка загрузки: {error}
      </div>
    );
  }

  return null;
};
