import { useEffect, useRef } from 'react';

interface PracticeAudioPlayerProps {
  isPlaying: boolean;
  audioSrc: string;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  volume?: number;
  resetKey?: string | number;
  onTrackChange?: (currentTrack: number, totalTracks: number) => void;
}

export const PracticeAudioPlayer: React.FC<PracticeAudioPlayerProps> = ({
  isPlaying,
  audioSrc,
  fadeInDuration = 3000,
  fadeOutDuration = 3000,
  volume = 0.7,
  resetKey,
  onTrackChange
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const fadeOutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentAudioSrcRef = useRef<string>('');
  const isFirstPlayRef = useRef<boolean>(true);
  const availableTracksRef = useRef<string[]>([]);
  const currentTrackIndexRef = useRef<number>(0);

  useEffect(() => {
    const detectAvailableTracks = async (baseSrc: string): Promise<string[]> => {
      const tracks: string[] = [];
      const maxTracks = 10;

      const basePattern = baseSrc.replace(/-1\.mp3$/, '');

      for (let i = 1; i <= maxTracks; i++) {
        const trackUrl = `${basePattern}-${i}.mp3`;
        try {
          const response = await fetch(trackUrl, {
            method: 'HEAD'
          });

          if (response.ok) {
            const contentType = response.headers.get('content-type');
            const contentLength = response.headers.get('content-length');

            if (contentType && (contentType.includes('audio') || contentType.includes('mpeg') || contentType.includes('octet-stream'))) {
              if (!contentLength || parseInt(contentLength) > 100) {
                tracks.push(trackUrl);
                console.log(`Track ${i} found:`, trackUrl);
                continue;
              }
            }
          }
          break;
        } catch (error) {
          console.log(`Track ${i} not found, stopping detection`);
          break;
        }
      }

      if (tracks.length === 0) {
        console.log('No tracks detected, using base source:', baseSrc);
        tracks.push(baseSrc);
      }

      return tracks;
    };

    const needsReset = currentAudioSrcRef.current !== audioSrc;

    if (needsReset) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      if (gainNodeRef.current && needsReset) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
      if (audioContextRef.current && needsReset) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      currentAudioSrcRef.current = audioSrc;
      isFirstPlayRef.current = true;
      currentTrackIndexRef.current = 0;

      detectAvailableTracks(audioSrc).then(tracks => {
        availableTracksRef.current = tracks;
        console.log('Detected tracks:', tracks);
        if (audioRef.current) {
          audioRef.current.loop = tracks.length === 1;
          console.log('Set loop to:', tracks.length === 1);
        }
        if (onTrackChange) {
          onTrackChange(1, tracks.length);
        }
      });
    }

    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = 0;
    }

    if (!audioRef.current) {
      const initialTrack = availableTracksRef.current.length > 0
        ? availableTracksRef.current[0]
        : audioSrc;

      audioRef.current = new Audio(initialTrack);
      audioRef.current.volume = 1;
      audioRef.current.loop = availableTracksRef.current.length === 1;

      const handleEnded = async () => {
        console.log('Audio ended event fired', {
          availableTracks: availableTracksRef.current.length,
          currentIndex: currentTrackIndexRef.current
        });

        if (availableTracksRef.current.length > 1) {
          currentTrackIndexRef.current = (currentTrackIndexRef.current + 1) % availableTracksRef.current.length;
          const nextTrack = availableTracksRef.current[currentTrackIndexRef.current];

          console.log('Switching to next track:', nextTrack);

          if (audioRef.current && gainNodeRef.current && audioContextRef.current) {
            audioRef.current.src = nextTrack;
            audioRef.current.load();

            try {
              await audioRef.current.play();
              const currentTime = audioContextRef.current.currentTime;
              gainNodeRef.current.gain.cancelScheduledValues(currentTime);
              gainNodeRef.current.gain.setValueAtTime(volume, currentTime);
            } catch (err) {
              console.error('Track change play error:', err);
            }
          }

          if (onTrackChange) {
            onTrackChange(currentTrackIndexRef.current + 1, availableTracksRef.current.length);
          }
        }
      };

      audioRef.current.addEventListener('ended', handleEnded);

      if (audioContextRef.current && gainNodeRef.current && !sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(gainNodeRef.current);
      }
    }

    const audio = audioRef.current;
    const gainNode = gainNodeRef.current;
    const audioContext = audioContextRef.current;

    if (!gainNode || !audioContext || !audio) return;

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
        console.error('Audio play error:', err);
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

    if (isPlaying) {
      fadeIn();
    } else if (!isPlaying && !audio.paused) {
      fadeOut();
    }
  }, [isPlaying, audioSrc, fadeInDuration, fadeOutDuration, volume, resetKey]);

  useEffect(() => {
    isFirstPlayRef.current = true;
  }, [resetKey]);

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

  return null;
};
