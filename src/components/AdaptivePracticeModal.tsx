import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Activity, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RemoteAudioPlayer } from './RemoteAudioPlayer';
import { useVitals } from '../hooks/useVitals';
import { supabase } from '../lib/supabase';
import { calculatePracticeOnd } from '../utils/ondCalculator';

interface AdaptivePracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  practiceId: string;
  onOndEarned?: (amount: number) => void;
}

interface AdaptivePractice {
  id: string;
  element: string;
  visual: React.ReactNode;
  name: string;
  shortPhrase: string;
  guidingTexts: string[];
  finalPhrase: string;
  targetTime: number;
  maxOnd: number;
  ambientSound: string;
  audioSrc?: string;
}

const OrangeCircle = () => (
  <svg viewBox="0 0 120 120" className="w-16 h-16 sm:w-20 sm:h-20 inline-block">
    <circle cx="60" cy="60" r="50" fill="none" stroke="#FF5722" strokeWidth="8" />
  </svg>
);

const adaptivePractices: Record<string, AdaptivePractice> = {
  'body_cocoon': {
    id: 'body_cocoon',
    element: 'TERRA',
    visual: <OrangeCircle />,
    name: 'adaptive_practices.body_cocoon.name',
    shortPhrase: 'adaptive_practices.body_cocoon.short_phrase',
    guidingTexts: [
      'adaptive_practices.body_cocoon.guiding_1',
      'adaptive_practices.body_cocoon.guiding_2',
      'adaptive_practices.body_cocoon.guiding_3',
      'adaptive_practices.body_cocoon.guiding_4',
      'adaptive_practices.body_cocoon.guiding_5',
      'adaptive_practices.body_cocoon.guiding_6',
      'adaptive_practices.body_cocoon.guiding_7',
      'adaptive_practices.body_cocoon.guiding_8',
      'adaptive_practices.body_cocoon.guiding_9'
    ],
    finalPhrase: 'adaptive_practices.body_cocoon.final_phrase',
    targetTime: 360,
    maxOnd: 50,
    ambientSound: 'elements.breath',
    audioSrc: 'Anxiety/adaptive-body_cocoon/adaptive-body_cocoon-1.mp3'
  },
  'light_inhale': {
    id: 'light_inhale',
    element: 'TERRA',
    visual: <OrangeCircle />,
    name: 'adaptive_practices.light_inhale.name',
    shortPhrase: 'adaptive_practices.light_inhale.short_phrase',
    guidingTexts: [
      'adaptive_practices.light_inhale.guiding_1',
      'adaptive_practices.light_inhale.guiding_2',
      'adaptive_practices.light_inhale.guiding_3',
      'adaptive_practices.light_inhale.guiding_4',
      'adaptive_practices.light_inhale.guiding_5',
      'adaptive_practices.light_inhale.guiding_6',
      'adaptive_practices.light_inhale.guiding_7',
      'adaptive_practices.light_inhale.guiding_8'
    ],
    finalPhrase: 'adaptive_practices.light_inhale.final_phrase',
    targetTime: 360,
    maxOnd: 50,
    ambientSound: 'elements.breath',
    audioSrc: 'Joy/adaptive-light_inhale/adaptive-light_inhale-1.mp3'
  },
  'inner_spark': {
    id: 'inner_spark',
    element: 'TERRA',
    visual: <OrangeCircle />,
    name: 'emotional_check.inner_spark',
    shortPhrase: 'adaptive_practices.inner_spark.short_phrase',
    guidingTexts: [
      'adaptive_practices.inner_spark.guiding_1',
      'adaptive_practices.inner_spark.guiding_2',
      'adaptive_practices.inner_spark.guiding_3',
      'adaptive_practices.inner_spark.guiding_4',
      'adaptive_practices.inner_spark.guiding_5',
      'adaptive_practices.inner_spark.guiding_6'
    ],
    finalPhrase: 'adaptive_practices.inner_spark.final_phrase',
    targetTime: 360,
    maxOnd: 50,
    ambientSound: 'elements.breath',
    audioSrc: 'Inspiration/adaptive-inner_spark/adaptive-inner_spark-1.mp3'
  },
  'slow_glow': {
    id: 'slow_glow',
    element: 'TERRA',
    visual: <OrangeCircle />,
    name: 'adaptive_practices.slow_glow.name',
    shortPhrase: 'adaptive_practices.slow_glow.short_phrase',
    guidingTexts: [
      'adaptive_practices.slow_glow.guiding_1',
      'adaptive_practices.slow_glow.guiding_2',
      'adaptive_practices.slow_glow.guiding_3',
      'adaptive_practices.slow_glow.guiding_4',
      'adaptive_practices.slow_glow.guiding_5',
      'adaptive_practices.slow_glow.guiding_6',
      'adaptive_practices.slow_glow.guiding_7',
      'adaptive_practices.slow_glow.guiding_8'
    ],
    finalPhrase: 'adaptive_practices.slow_glow.final_phrase',
    targetTime: 360,
    maxOnd: 50,
    ambientSound: 'elements.breath',
    audioSrc: 'Fatigue/adaptive-slow_glow/adaptive-slow_glow-1.mp3'
  },
  'earth_breath': {
    id: 'earth_breath',
    element: 'TERRA',
    visual: <OrangeCircle />,
    name: 'adaptive_practices.earth_breath.name',
    shortPhrase: 'adaptive_practices.earth_breath.short_phrase',
    guidingTexts: [
      'adaptive_practices.earth_breath.guiding_1',
      'adaptive_practices.earth_breath.guiding_2',
      'adaptive_practices.earth_breath.guiding_3',
      'adaptive_practices.earth_breath.guiding_4',
      'adaptive_practices.earth_breath.guiding_5',
      'adaptive_practices.earth_breath.guiding_6',
      'adaptive_practices.earth_breath.guiding_7'
    ],
    finalPhrase: 'adaptive_practices.earth_breath.final_phrase',
    targetTime: 360,
    maxOnd: 50,
    ambientSound: 'elements.breath',
    audioSrc: 'Calmness/adaptive-earth_breath/adaptive-earth_breath-1.mp3'
  },
  'wave_pulse': {
    id: 'wave_pulse',
    element: 'TERRA',
    visual: <OrangeCircle />,
    name: 'adaptive_practices.wave_pulse.name',
    shortPhrase: 'adaptive_practices.wave_pulse.short_phrase',
    guidingTexts: [
      'adaptive_practices.wave_pulse.guiding_1',
      'adaptive_practices.wave_pulse.guiding_2',
      'adaptive_practices.wave_pulse.guiding_3',
      'adaptive_practices.wave_pulse.guiding_4',
      'adaptive_practices.wave_pulse.guiding_5',
      'adaptive_practices.wave_pulse.guiding_6',
      'adaptive_practices.wave_pulse.guiding_7',
      'adaptive_practices.wave_pulse.guiding_8',
      'adaptive_practices.wave_pulse.guiding_9',
      'adaptive_practices.wave_pulse.guiding_10'
    ],
    finalPhrase: 'adaptive_practices.wave_pulse.final_phrase',
    targetTime: 360,
    maxOnd: 50,
    ambientSound: 'elements.breath',
    audioSrc: 'Calmness/adaptive-wave_pulse/adaptive-wave_pulse-1.mp3'
  },
  'sphere_breath': {
    id: 'sphere_breath',
    element: 'TERRA',
    visual: <OrangeCircle />,
    name: 'adaptive_practices.sphere_breath.name',
    shortPhrase: 'adaptive_practices.sphere_breath.short_phrase',
    guidingTexts: [
      'adaptive_practices.sphere_breath.guiding_1',
      'adaptive_practices.sphere_breath.guiding_2',
      'adaptive_practices.sphere_breath.guiding_3',
      'adaptive_practices.sphere_breath.guiding_4',
      'adaptive_practices.sphere_breath.guiding_5',
      'adaptive_practices.sphere_breath.guiding_6',
      'adaptive_practices.sphere_breath.guiding_7',
      'adaptive_practices.sphere_breath.guiding_8',
      'adaptive_practices.sphere_breath.guiding_9'
    ],
    finalPhrase: 'adaptive_practices.sphere_breath.final_phrase',
    targetTime: 360,
    maxOnd: 50,
    ambientSound: 'elements.breath',
    audioSrc: 'Contemplation/adaptive-sphere_breath/adaptive-sphere_breath-1.mp3'
  },
  'light_flow': {
    id: 'light_flow',
    element: 'TERRA',
    visual: <OrangeCircle />,
    name: 'emotional_check.light_flow',
    shortPhrase: 'adaptive_practices.light_flow.short_phrase',
    guidingTexts: [
      'adaptive_practices.light_flow.guiding_1',
      'adaptive_practices.light_flow.guiding_2',
      'adaptive_practices.light_flow.guiding_3',
      'adaptive_practices.light_flow.guiding_4',
      'adaptive_practices.light_flow.guiding_5',
      'adaptive_practices.light_flow.guiding_6',
      'adaptive_practices.light_flow.guiding_7'
    ],
    finalPhrase: 'adaptive_practices.light_flow.final_phrase',
    targetTime: 360,
    maxOnd: 50,
    ambientSound: 'elements.breath',
    audioSrc: 'Inspiration/adaptive-light_flow/adaptive-light_flow-1.mp3'
  },
  'roots_breath': {
    id: 'roots_breath',
    element: 'TERRA',
    visual: <OrangeCircle />,
    name: 'adaptive_practices.roots_breath.name',
    shortPhrase: 'adaptive_practices.roots_breath.short_phrase',
    guidingTexts: [
      'adaptive_practices.roots_breath.guiding_1',
      'adaptive_practices.roots_breath.guiding_2',
      'adaptive_practices.roots_breath.guiding_3',
      'adaptive_practices.roots_breath.guiding_4',
      'adaptive_practices.roots_breath.guiding_5',
      'adaptive_practices.roots_breath.guiding_6',
      'adaptive_practices.roots_breath.guiding_7',
      'adaptive_practices.roots_breath.guiding_8',
      'adaptive_practices.roots_breath.guiding_9'
    ],
    finalPhrase: 'adaptive_practices.roots_breath.final_phrase',
    targetTime: 360,
    maxOnd: 50,
    ambientSound: 'elements.breath',
    audioSrc: 'Anxiety/adaptive-roots_breath/adaptive-roots_breath-1.mp3'
  },
  'earth_pulse': {
    id: 'earth_pulse',
    element: 'TERRA',
    visual: <OrangeCircle />,
    name: 'adaptive_practices.earth_pulse.name',
    shortPhrase: 'adaptive_practices.earth_pulse.short_phrase',
    guidingTexts: [
      'adaptive_practices.earth_pulse.guiding_1',
      'adaptive_practices.earth_pulse.guiding_2',
      'adaptive_practices.earth_pulse.guiding_3',
      'adaptive_practices.earth_pulse.guiding_4',
      'adaptive_practices.earth_pulse.guiding_5',
      'adaptive_practices.earth_pulse.guiding_6',
      'adaptive_practices.earth_pulse.guiding_7',
      'adaptive_practices.earth_pulse.guiding_8',
      'adaptive_practices.earth_pulse.guiding_9'
    ],
    finalPhrase: 'adaptive_practices.earth_pulse.final_phrase',
    targetTime: 360,
    maxOnd: 50,
    ambientSound: 'elements.breath',
    audioSrc: 'Anxiety/adaptive-earth_pulse/adaptive-earth_pulse-1.mp3'
  },
  'breath_possibility': {
    id: 'breath_possibility',
    element: 'TERRA',
    visual: <OrangeCircle />,
    name: 'emotional_check.breath_possibility',
    shortPhrase: 'adaptive_practices.breath_possibility.short_phrase',
    guidingTexts: [
      'adaptive_practices.breath_possibility.guiding_1',
      'adaptive_practices.breath_possibility.guiding_2',
      'adaptive_practices.breath_possibility.guiding_3',
      'adaptive_practices.breath_possibility.guiding_4',
      'adaptive_practices.breath_possibility.guiding_5',
      'adaptive_practices.breath_possibility.guiding_6'
    ],
    finalPhrase: 'adaptive_practices.breath_possibility.final_phrase',
    targetTime: 360,
    maxOnd: 50,
    ambientSound: 'elements.breath',
    audioSrc: 'Inspiration/adaptive-breath_possibility/adaptive-breath_possibility-1.mp3'
  },
  'inner_smile': {
    id: 'inner_smile',
    element: 'TERRA',
    visual: <OrangeCircle />,
    name: 'adaptive_practices.inner_smile.name',
    shortPhrase: 'adaptive_practices.inner_smile.short_phrase',
    guidingTexts: [
      'adaptive_practices.inner_smile.guiding_1',
      'adaptive_practices.inner_smile.guiding_2',
      'adaptive_practices.inner_smile.guiding_3',
      'adaptive_practices.inner_smile.guiding_4',
      'adaptive_practices.inner_smile.guiding_5',
      'adaptive_practices.inner_smile.guiding_6',
      'adaptive_practices.inner_smile.guiding_7',
      'adaptive_practices.inner_smile.guiding_8'
    ],
    finalPhrase: 'adaptive_practices.inner_smile.final_phrase',
    targetTime: 360,
    maxOnd: 50,
    ambientSound: 'elements.breath',
    audioSrc: 'Joy/adaptive-inner_smile/adaptive-inner_smile-1.mp3'
  },
  'amoeba_dance': {
    id: 'amoeba_dance',
    element: 'TERRA',
    visual: <OrangeCircle />,
    name: 'adaptive_practices.amoeba_dance.name',
    shortPhrase: 'adaptive_practices.amoeba_dance.short_phrase',
    guidingTexts: [
      'adaptive_practices.amoeba_dance.guiding_1',
      'adaptive_practices.amoeba_dance.guiding_2',
      'adaptive_practices.amoeba_dance.guiding_3',
      'adaptive_practices.amoeba_dance.guiding_4',
      'adaptive_practices.amoeba_dance.guiding_5',
      'adaptive_practices.amoeba_dance.guiding_6',
      'adaptive_practices.amoeba_dance.guiding_7',
      'adaptive_practices.amoeba_dance.guiding_8'
    ],
    finalPhrase: 'adaptive_practices.amoeba_dance.final_phrase',
    targetTime: 360,
    maxOnd: 50,
    ambientSound: 'elements.breath',
    audioSrc: 'Joy/adaptive-amoeba_dance/adaptive-amoeba_dance-1.mp3'
  },
  'silence_point': {
    id: 'silence_point',
    element: 'TERRA',
    visual: <OrangeCircle />,
    name: 'adaptive_practices.silence_point.name',
    shortPhrase: 'adaptive_practices.silence_point.short_phrase',
    guidingTexts: [
      'adaptive_practices.silence_point.guiding_1',
      'adaptive_practices.silence_point.guiding_2',
      'adaptive_practices.silence_point.guiding_3',
      'adaptive_practices.silence_point.guiding_4',
      'adaptive_practices.silence_point.guiding_5',
      'adaptive_practices.silence_point.guiding_6',
      'adaptive_practices.silence_point.guiding_7',
      'adaptive_practices.silence_point.guiding_8'
    ],
    finalPhrase: 'adaptive_practices.silence_point.final_phrase',
    targetTime: 360,
    maxOnd: 50,
    ambientSound: 'elements.breath',
    audioSrc: 'Contemplation/adaptive-silence_point/adaptive-silence_point-1.mp3'
  },
  'listen_space': {
    id: 'listen_space',
    element: 'TERRA',
    visual: <OrangeCircle />,
    name: 'adaptive_practices.listen_space.name',
    shortPhrase: 'adaptive_practices.listen_space.short_phrase',
    guidingTexts: [
      'adaptive_practices.listen_space.guiding_1',
      'adaptive_practices.listen_space.guiding_2',
      'adaptive_practices.listen_space.guiding_3',
      'adaptive_practices.listen_space.guiding_4',
      'adaptive_practices.listen_space.guiding_5',
      'adaptive_practices.listen_space.guiding_6',
      'adaptive_practices.listen_space.guiding_7',
      'adaptive_practices.listen_space.guiding_8'
    ],
    finalPhrase: 'adaptive_practices.listen_space.final_phrase',
    targetTime: 360,
    maxOnd: 50,
    ambientSound: 'elements.breath',
    audioSrc: 'Contemplation/adaptive-listen_space/adaptive-listen_space-1.mp3'
  },
  'still_form': {
    id: 'still_form',
    element: 'TERRA',
    visual: <OrangeCircle />,
    name: 'adaptive_practices.still_form.name',
    shortPhrase: 'adaptive_practices.still_form.short_phrase',
    guidingTexts: [
      'adaptive_practices.still_form.guiding_1',
      'adaptive_practices.still_form.guiding_2',
      'adaptive_practices.still_form.guiding_3',
      'adaptive_practices.still_form.guiding_4',
      'adaptive_practices.still_form.guiding_5',
      'adaptive_practices.still_form.guiding_6',
      'adaptive_practices.still_form.guiding_7',
      'adaptive_practices.still_form.guiding_8',
      'adaptive_practices.still_form.guiding_9',
      'adaptive_practices.still_form.guiding_10',
      'adaptive_practices.still_form.guiding_11',
      'adaptive_practices.still_form.guiding_12'
    ],
    finalPhrase: 'adaptive_practices.still_form.final_phrase',
    targetTime: 360,
    maxOnd: 50,
    ambientSound: 'elements.breath',
    audioSrc: 'Calmness/adaptive-still_form/adaptive-still_form-1.mp3'
  },
  'rest_breath': {
    id: 'rest_breath',
    element: 'TERRA',
    visual: <OrangeCircle />,
    name: 'adaptive_practices.rest_breath.name',
    shortPhrase: 'adaptive_practices.rest_breath.short_phrase',
    guidingTexts: [
      'adaptive_practices.rest_breath.guiding_1',
      'adaptive_practices.rest_breath.guiding_2',
      'adaptive_practices.rest_breath.guiding_3',
      'adaptive_practices.rest_breath.guiding_4',
      'adaptive_practices.rest_breath.guiding_5',
      'adaptive_practices.rest_breath.guiding_6',
      'adaptive_practices.rest_breath.guiding_7'
    ],
    finalPhrase: 'adaptive_practices.rest_breath.final_phrase',
    targetTime: 360,
    maxOnd: 50,
    ambientSound: 'elements.breath',
    audioSrc: 'Fatigue/adaptive-rest_breath/adaptive-rest_breath-1.mp3'
  },
  'warm_sphere': {
    id: 'warm_sphere',
    element: 'TERRA',
    visual: <OrangeCircle />,
    name: 'adaptive_practices.warm_sphere.name',
    shortPhrase: 'adaptive_practices.warm_sphere.short_phrase',
    guidingTexts: [
      'adaptive_practices.warm_sphere.guiding_1',
      'adaptive_practices.warm_sphere.guiding_2',
      'adaptive_practices.warm_sphere.guiding_3',
      'adaptive_practices.warm_sphere.guiding_4',
      'adaptive_practices.warm_sphere.guiding_5',
      'adaptive_practices.warm_sphere.guiding_6',
      'adaptive_practices.warm_sphere.guiding_7'
    ],
    finalPhrase: 'adaptive_practices.warm_sphere.final_phrase',
    targetTime: 360,
    maxOnd: 50,
    ambientSound: 'elements.breath',
    audioSrc: 'Fatigue/adaptive-warm_sphere/adaptive-warm_sphere-1.mp3'
  }
};

type PracticeState = 'intro' | 'practice' | 'complete';

export function AdaptivePracticeModal({ isOpen, onClose, practiceId, onOndEarned }: AdaptivePracticeModalProps) {
  const { t } = useTranslation();
  const vitalsData = useVitals();
  const [practiceState, setPracticeState] = useState<PracticeState>('intro');
  const [isPaused, setIsPaused] = useState(false);
  const [practiceTime, setPracticeTime] = useState(0);
  const [currentGuidingTextIndex, setCurrentGuidingTextIndex] = useState(0);
  const [isTextTransitioning, setIsTextTransitioning] = useState(false);
  const [audioResetKey, setAudioResetKey] = useState(0);
  const [qualityScore, setQualityScore] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(1);
  const [totalTracks, setTotalTracks] = useState(1);
  const [initialMetrics, setInitialMetrics] = useState<{ stress: number | null; energy: number | null }>({ stress: null, energy: null });
  const [bestMetrics, setBestMetrics] = useState<{ stress: number | null; energy: number | null }>({ stress: null, energy: null });
  const [earnedOnd, setEarnedOnd] = useState(0);
  const [simulatedVitals, setSimulatedVitals] = useState({ stress: 50, energy: 50 });
  const timerRef = useRef<number | null>(null);

  const practice = adaptivePractices[practiceId];

  useEffect(() => {
    console.log('AdaptivePracticeModal vitalsData:', {
      stress: vitalsData.stress,
      energy: vitalsData.energy,
      connected: vitalsData.connected
    });

    if (practiceState === 'practice' && vitalsData.stress !== null && vitalsData.energy !== null) {
      setBestMetrics(best => ({
        stress: Math.min(best.stress, vitalsData.stress!),
        energy: Math.max(best.energy, vitalsData.energy!)
      }));
    }
  }, [vitalsData.stress, vitalsData.energy, vitalsData.connected, practiceState]);

  useEffect(() => {
    if (!isOpen) {
      setPracticeState('intro');
      setPracticeTime(0);
      setIsPaused(false);
      setCurrentGuidingTextIndex(0);
      setAudioResetKey(prev => prev + 1);
      setQualityScore(0);
      setCurrentTrack(1);
      setTotalTracks(1);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (practiceState === 'practice' && !isPaused && practice) {
      timerRef.current = window.setInterval(() => {
        setPracticeTime(prev => {
          const newTime = prev + 1;

          if (practice.guidingTexts && practice.guidingTexts.length > 0) {
            const textInterval = 15;
            const newIndex = Math.floor(newTime / textInterval) % practice.guidingTexts.length;

            if (newIndex !== currentGuidingTextIndex) {
              setIsTextTransitioning(true);
              setTimeout(() => {
                setCurrentGuidingTextIndex(newIndex);
                setTimeout(() => setIsTextTransitioning(false), 50);
              }, 1000);
            }
          }

          return newTime;
        });

        if (!vitalsData.connected) {
          setSimulatedVitals(prev => {
            const progressFactor = practiceTime / practice.targetTime;
            const maxStressReduction = initialMetrics.stress! * 0.03;
            const maxEnergyIncrease = initialMetrics.energy! * 0.03;

            return {
              stress: Math.max(0, initialMetrics.stress! - (maxStressReduction * progressFactor)),
              energy: Math.min(100, initialMetrics.energy! + (maxEnergyIncrease * progressFactor))
            };
          });
        }

        if (vitalsData.connected && vitalsData.stress !== null && vitalsData.energy !== null) {
          setBestMetrics(best => {
            const updated = {
              stress: Math.min(best.stress, vitalsData.stress!),
              energy: Math.max(best.energy, vitalsData.energy!)
            };
            console.log('Best metrics updated:', { previous: best, current: { stress: vitalsData.stress, energy: vitalsData.energy }, updated });
            return updated;
          });
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [practiceState, isPaused, practice, currentGuidingTextIndex]);

  const startPractice = () => {
    const hasRealMetrics = vitalsData.connected && vitalsData.stress !== null && vitalsData.energy !== null;
    const currentStress = hasRealMetrics ? vitalsData.stress : 50;
    const currentEnergy = hasRealMetrics ? vitalsData.energy : 50;

    console.log('Starting practice with initial metrics:', { hasRealMetrics, currentStress, currentEnergy });

    setInitialMetrics({
      stress: currentStress,
      energy: currentEnergy
    });
    setBestMetrics({
      stress: currentStress,
      energy: currentEnergy
    });
    setSimulatedVitals({
      stress: currentStress,
      energy: currentEnergy
    });
    setPracticeState('practice');
    setPracticeTime(0);
    setCurrentGuidingTextIndex(0);
    setIsPaused(false);
    setQualityScore(0);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateCurrentQuality = () => {
    if (!practice) return 0;

    const completionProgress = Math.min(practiceTime / practice.targetTime, 1);
    const completionScore = completionProgress * 15;

    const currentStress = vitalsData.connected && vitalsData.stress !== null ? vitalsData.stress : simulatedVitals.stress;
    const currentEnergy = vitalsData.connected && vitalsData.energy !== null ? vitalsData.energy : simulatedVitals.energy;

    const stressChange = ((initialMetrics.stress! - currentStress) / initialMetrics.stress!) * 100;
    const stressTarget = 10;
    const stressScore = Math.min(Math.max(stressChange / stressTarget, 0), 1);
    const stressPerformanceScore = stressScore * 40;

    const energyChange = ((currentEnergy - initialMetrics.energy!) / initialMetrics.energy!) * 100;
    const energyTarget = 10;
    const energyScore = Math.min(Math.max(energyChange / energyTarget, 0), 1);
    const energyPerformanceScore = energyScore * 45;

    return completionScore + stressPerformanceScore + energyPerformanceScore;
  };

  const completePractice = async () => {
    console.log('[AdaptivePractice] completePractice() called');
    if (!practice) {
      console.log('[AdaptivePractice] No practice found, returning');
      return;
    }

    const finalStress = vitalsData.connected && vitalsData.stress !== null ? vitalsData.stress : simulatedVitals.stress;
    const finalEnergy = vitalsData.connected && vitalsData.energy !== null ? vitalsData.energy : simulatedVitals.energy;

    const hasRealMetrics = true;

    console.log('Practice completion metrics:', {
      hasRealMetrics,
      connected: vitalsData.connected,
      usingSimulation: !vitalsData.connected,
      initialStress: initialMetrics.stress,
      finalStress,
      initialEnergy: initialMetrics.energy,
      finalEnergy,
      practiceTime,
      targetTime: practice.targetTime
    });

    const ondReward = calculatePracticeOnd({
      actualDurationSeconds: practiceTime,
      expectedDurationSeconds: practice.targetTime,
      stressBefore: initialMetrics.stress!,
      stressAfter: finalStress,
      energyBefore: initialMetrics.energy!,
      energyAfter: finalEnergy,
      baseOndReward: practice.maxOnd,
      hasRealMetrics
    });

    console.log('OND reward calculation:', ondReward);

    setEarnedOnd(ondReward.totalOnd);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('practice_rewards').insert({
        user_id: user.id,
        practice_id: practice.id,
        practice_duration_seconds: practiceTime,
        expected_duration_seconds: practice.targetTime,
        stress_before: initialMetrics.stress,
        stress_after: finalStress,
        energy_before: initialMetrics.energy,
        energy_after: finalEnergy,
        completion_ond: ondReward.completionOnd,
        performance_ond: ondReward.performanceOnd,
        total_ond_earned: ondReward.totalOnd
      });

      const { data: currentProgress } = await supabase
        .from('user_progress')
        .select('total_ond')
        .eq('user_id', user.id)
        .maybeSingle();

      const newTotal = (currentProgress?.total_ond || 0) + ondReward.totalOnd;

      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          total_ond: newTotal,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (onOndEarned) {
        onOndEarned(ondReward.totalOnd);
      }

    } catch (error) {
      console.error('Error saving practice reward:', error);
    }

    setPracticeState('complete');
  };

  const handleClose = () => {
    setPracticeState('intro');
    setPracticeTime(0);
    setIsPaused(false);
    setCurrentGuidingTextIndex(0);
    setAudioResetKey(prev => prev + 1);
    setQualityScore(0);
    setCurrentTrack(1);
    setTotalTracks(1);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onClose();
  };

  if (!isOpen || !practice) return null;

  const progress = practice.targetTime > 0 ? (practiceTime / practice.targetTime) * 100 : 0;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center z-50 p-3 sm:p-6">
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.3) 100%)'
      }} />

      <button
        onClick={handleClose}
        className="absolute top-6 right-6 z-50 bg-black/40 hover:bg-black/60 backdrop-blur-sm p-3 rounded-full transition-all hover:scale-110"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative z-10 w-full max-w-2xl">
        {practiceState === 'intro' && (
          <div className="text-center space-y-4 sm:space-y-8">
            <div className="text-4xl sm:text-6xl mb-4 sm:mb-8 animate-bounce" style={{ animationDuration: '2s' }}>
              {practice.visual}
            </div>
            <h1 className="text-3xl sm:text-6xl font-bold mb-2 sm:mb-4 drop-shadow-2xl">
              {t(practice.name)}
            </h1>
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 sm:p-8 mb-3 sm:mb-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <p className="text-sm text-purple-200 font-semibold tracking-wide">
                  {practice.element}
                </p>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              </div>
              <p className="text-base sm:text-2xl leading-relaxed italic font-light">
                "{t(practice.shortPhrase)}"
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-200">
              <span className="bg-black/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm text-xs sm:text-base min-w-[100px] sm:min-w-[120px] text-center">
                {formatTime(practice.targetTime)}
              </span>
              <span className="text-gray-400">•</span>
              <span className="bg-black/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm text-xs sm:text-base min-w-[100px] sm:min-w-[120px] text-center">
                {t('practices.up_to')} {practice.maxOnd} OND
              </span>
            </div>
            <button
              onClick={startPractice}
              className="bg-white/30 hover:bg-white/40 backdrop-blur-md px-6 sm:px-8 py-3 sm:py-5 rounded-full text-sm sm:text-base font-semibold transition-all transform hover:scale-110 shadow-2xl border border-white/30"
            >
              {t('practices.start')}
            </button>
          </div>
        )}

        {practiceState === 'practice' && (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="text-4xl sm:text-6xl mb-6 sm:mb-16 flex justify-center transition-all duration-1000" style={{
              animation: 'pulse 2s ease-in-out infinite',
              filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.5))'
            }}>
              {practice.visual}
            </div>

            <div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-6 sm:mb-12 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  fill="none"
                  stroke="url(#timeGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 110}`}
                  strokeDashoffset={`${2 * Math.PI * 110 * (1 - (practiceTime / practice.targetTime))}`}
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="timeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl sm:text-6xl font-mono tracking-wider drop-shadow-2xl" style={{
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {formatTime(practiceTime)}
                </div>
              </div>
            </div>

            <div className="w-full max-w-md mb-6 sm:mb-12 px-3 sm:px-0">
              <div className="flex justify-between text-sm sm:text-base mb-2 sm:mb-3">
                <span className="font-semibold">{t('practices.quality')}</span>
                <span className="font-bold text-xl sm:text-2xl">{Math.round(calculateCurrentQuality())}%</span>
              </div>
              <div className="w-full h-5 sm:h-6 bg-black/40 rounded-full overflow-hidden backdrop-blur-sm border border-white/20 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-300 transition-all duration-500 relative"
                  style={{ width: `${calculateCurrentQuality()}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse" />
                </div>
              </div>
              <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-300 flex justify-between">
                <span>{t('labels.time_label')}: {Math.round((practiceTime / practice.targetTime) * 100)}%</span>
                <span>{t('labels.energy')}: {vitalsData.energy !== null ? Math.round(vitalsData.energy) : '--'}%</span>
              </div>
            </div>

            {practice.guidingTexts && practice.guidingTexts.length > 0 && (
              <div className="w-full max-w-md mb-6 sm:mb-8 px-3 sm:px-0">
                <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl h-24 sm:h-28 flex items-center justify-center overflow-hidden">
                  <p
                    className={`text-sm sm:text-base text-center italic leading-snug text-white/90 whitespace-pre-line transition-all duration-1000 ${
                      isTextTransitioning ? 'opacity-0 translate-y-[-20px]' : 'opacity-100 translate-y-0'
                    }`}
                  >
                    {t(practice.guidingTexts[currentGuidingTextIndex])}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-12 px-3 sm:px-0 w-full max-w-md">
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 sm:p-6 text-center border border-red-400/30 shadow-xl">
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-red-400" />
                <div className="text-2xl sm:text-4xl font-bold mb-1">{vitalsData.stress !== null ? Math.round(vitalsData.stress) : '--'}%</div>
                <div className="text-xs sm:text-sm text-gray-300">{t('labels.stress')}</div>
              </div>
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 sm:p-6 text-center border border-blue-400/30 shadow-xl">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-blue-400" />
                <div className="text-2xl sm:text-4xl font-bold mb-1">{vitalsData.energy !== null ? Math.round(vitalsData.energy) : '--'}%</div>
                <div className="text-xs sm:text-sm text-gray-300">{t('labels.energy')}</div>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-6">
              <button
                onClick={togglePause}
                className="bg-white/30 hover:bg-white/40 backdrop-blur-md p-3 sm:p-5 rounded-full transition-all hover:scale-110 shadow-xl border border-white/30"
              >
                {isPaused ? <Play className="w-6 h-6 sm:w-8 sm:h-8" /> : <Pause className="w-6 h-6 sm:w-8 sm:h-8" />}
              </button>
              <button
                onClick={() => {
                  console.log('[AdaptivePractice] Complete button clicked!');
                  completePractice();
                }}
                className="bg-emerald-500/30 hover:bg-emerald-500/50 backdrop-blur-md px-6 sm:px-8 py-3 sm:py-5 rounded-full text-sm sm:text-base font-semibold transition-all hover:scale-110 shadow-xl border border-emerald-400/50"
                data-testid="button-complete-practice"
              >
                {t('practices.complete')}
              </button>
            </div>
          </div>
        )}

        {practiceState === 'complete' && (
          <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
            <div className="max-w-2xl w-full text-center space-y-4 sm:space-y-8">
              <div className="text-6xl sm:text-8xl md:text-9xl mb-4 sm:mb-8 animate-bounce" style={{ animationDuration: '1s' }}>✨</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">{t('practices.completed')}</h2>

              {practice.finalPhrase && (
                <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/30 shadow-xl mb-4 sm:mb-6">
                  <p className="text-base sm:text-lg md:text-xl italic leading-relaxed text-white/90 whitespace-pre-line">
                    {t(practice.finalPhrase)}
                  </p>
                </div>
              )}

              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-10 space-y-4 sm:space-y-6 border border-white/20 shadow-2xl">
                <div className="text-4xl sm:text-5xl md:text-7xl font-mono text-yellow-400 drop-shadow-2xl animate-pulse">
                  +{earnedOnd} OND
                </div>
                <div className="text-sm sm:text-base text-gray-300 space-y-2">
                  <p>{t('practices.time')}: {formatTime(practiceTime)} / {formatTime(practice.targetTime)}</p>
                  <p>{t('labels.stress')}: {initialMetrics.stress}% → {vitalsData.stress !== null ? Math.round(vitalsData.stress) : '--'}%</p>
                  <p>{t('labels.energy')}: {initialMetrics.energy}% → {vitalsData.energy !== null ? Math.round(vitalsData.energy) : '--'}%</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={() => {
                    setPracticeState('intro');
                    setPracticeTime(0);
                    setQualityScore(0);
                    setIsPaused(false);
                    setCurrentGuidingTextIndex(0);
                    setAudioResetKey(prev => prev + 1);
                    setCurrentTrack(1);
                    setTotalTracks(1);
                  }}
                  className="bg-purple-500/30 hover:bg-purple-500/50 backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all border border-purple-400/50"
                >
                  {t('practices.try_again')}
                </button>
                <button
                  onClick={handleClose}
                  className="bg-white/30 hover:bg-white/40 backdrop-blur-md px-8 sm:px-10 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-bold transition-all border border-white/30"
                >
                  {t('practices.back_to_practices')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {practice.audioSrc && (
        <RemoteAudioPlayer
          isPlaying={practiceState === 'practice' && !isPaused}
          audioPath={practice.audioSrc}
          resetKey={audioResetKey}
          onTrackChange={(track, total) => {
            setCurrentTrack(track);
            setTotalTracks(total);
          }}
        />
      )}
    </div>
  );
}
