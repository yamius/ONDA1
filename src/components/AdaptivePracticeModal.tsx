import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Activity, Zap, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import { RemoteAudioPlayer } from './RemoteAudioPlayer';
import { useVitals } from '../hooks/useVitals';
import { useSubscription } from '../hooks/useSubscription';
import { useAnalytics } from '../hooks/useAnalytics';
import { heartRateStore } from '../hooks/heartRateStore';
import { supabase } from '../lib/supabase';
import { calculatePracticeOnd } from '../utils/ondCalculator';
import { trackTenjinPractice, trackTenjinFirstPracticeComplete } from '../lib/tenjin';
import { useTheme } from '../theme/ThemeProvider';

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
  audioSrc?: string | string[];
}

const adaptivePractices: Record<string, AdaptivePractice> = {
  'body_cocoon': {
    id: 'body_cocoon',
    element: 'TERRA',
    visual: '🛡',
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
    audioSrc: [
      'Anxiety/adaptive-body_cocoon/adaptive-body_cocoon-1.mp3',
      'Anxiety/adaptive-body_cocoon/adaptive-body_cocoon-2.mp3',
      'Anxiety/adaptive-body_cocoon/adaptive-body_cocoon-3.mp3',
      'Anxiety/adaptive-body_cocoon/adaptive-body_cocoon-4.mp3'
    ]
  },
  'light_inhale': {
    id: 'light_inhale',
    element: 'TERRA',
    visual: '☀️',
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
    audioSrc: [
      'Joy/adaptive-light_inhale/adaptive-light_inhale-1.mp3',
      'Joy/adaptive-light_inhale/adaptive-light_inhale-2.mp3',
      'Joy/adaptive-light_inhale/adaptive-light_inhale-3.mp3',
      'Joy/adaptive-light_inhale/adaptive-light_inhale-4.mp3'
    ]
  },
  'inner_spark': {
    id: 'inner_spark',
    element: 'TERRA',
    visual: '✨',
    name: 'adaptive_practices.inner_spark.name',
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
    audioSrc: [
      'Inspiration/adaptive-inner_spark/adaptive-inner_spark-1.mp3',
      'Inspiration/adaptive-inner_spark/adaptive-inner_spark-2.mp3',
      'Inspiration/adaptive-inner_spark/adaptive-inner_spark-3.mp3',
      'Inspiration/adaptive-inner_spark/adaptive-inner_spark-4.mp3'
    ]
  },
  'slow_glow': {
    id: 'slow_glow',
    element: 'TERRA',
    visual: '🌙',
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
    audioSrc: [
      'Fatigue/adaptive-slow_glow/adaptive-slow_glow-1.mp3',
      'Fatigue/adaptive-slow_glow/adaptive-slow_glow-2.mp3',
      'Fatigue/adaptive-slow_glow/adaptive-slow_glow-3.mp3',
      'Fatigue/adaptive-slow_glow/adaptive-slow_glow-4.mp3'
    ]
  },
  'earth_breath': {
    id: 'earth_breath',
    element: 'TERRA',
    visual: '🌍',
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
    audioSrc: [
      'Calmness/adaptive-earth_breath/adaptive-earth_breath-1.mp3',
      'Calmness/adaptive-earth_breath/adaptive-earth_breath-2.mp3',
      'Calmness/adaptive-earth_breath/adaptive-earth_breath-3.mp3'
    ]
  },
  'wave_pulse': {
    id: 'wave_pulse',
    element: 'TERRA',
    visual: '🌊',
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
    audioSrc: [
      'Calmness/adaptive-wave_pulse/adaptive-wave_pulse-1.mp3',
      'Calmness/adaptive-wave_pulse/adaptive-wave_pulse-2.mp3',
      'Calmness/adaptive-wave_pulse/adaptive-wave_pulse-3.mp3',
      'Calmness/adaptive-wave_pulse/adaptive-wave_pulse-4.mp3'
    ]
  },
  'sphere_breath': {
    id: 'sphere_breath',
    element: 'TERRA',
    visual: '🔮',
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
    audioSrc: [
      'Contemplation/adaptive-sphere_breath/adaptive-sphere_breath-1.mp3',
      'Contemplation/adaptive-sphere_breath/adaptive-sphere_breath-2.mp3',
      'Contemplation/adaptive-sphere_breath/adaptive-sphere_breath-3.mp3'
    ]
  },
  'light_flow': {
    id: 'light_flow',
    element: 'TERRA',
    visual: '🌟',
    name: 'adaptive_practices.light_flow.name',
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
    audioSrc: [
      'Inspiration/adaptive-light_flow/adaptive-light_flow-1.mp3',
      'Inspiration/adaptive-light_flow/adaptive-light_flow-2.mp3',
      'Inspiration/adaptive-light_flow/adaptive-light_flow-3.mp3'
    ]
  },
  'roots_breath': {
    id: 'roots_breath',
    element: 'TERRA',
    visual: '🌱',
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
    audioSrc: [
      'Anxiety/adaptive-roots_breath/adaptive-roots_breath-1.mp3',
      'Anxiety/adaptive-roots_breath/adaptive-roots_breath-2.mp3',
      'Anxiety/adaptive-roots_breath/adaptive-roots_breath-3.mp3',
      'Anxiety/adaptive-roots_breath/adaptive-roots_breath-4.mp3',
      'Anxiety/adaptive-roots_breath/adaptive-roots_breath-5.mp3',
      'Anxiety/adaptive-roots_breath/adaptive-roots_breath-6.mp3'
    ]
  },
  'earth_pulse': {
    id: 'earth_pulse',
    element: 'TERRA',
    visual: '💓',
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
    audioSrc: [
      'Anxiety/adaptive-earth_pulse/adaptive-earth_pulse-1.mp3',
      'Anxiety/adaptive-earth_pulse/adaptive-earth_pulse-2.mp3',
      'Anxiety/adaptive-earth_pulse/adaptive-earth_pulse-3.mp3',
      'Anxiety/adaptive-earth_pulse/adaptive-earth_pulse-4.mp3'
    ]
  },
  'breath_possibility': {
    id: 'breath_possibility',
    element: 'TERRA',
    visual: '🔥',
    name: 'adaptive_practices.breath_possibility.name',
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
    audioSrc: [
      'Inspiration/adaptive-breath_possibility/adaptive-breath_possibility-1.mp3',
      'Inspiration/adaptive-breath_possibility/adaptive-breath_possibility-2.mp3'
    ]
  },
  'inner_smile': {
    id: 'inner_smile',
    element: 'TERRA',
    visual: '😊',
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
    audioSrc: [
      'Joy/adaptive-inner_smile/adaptive-inner_smile-1.mp3',
      'Joy/adaptive-inner_smile/adaptive-inner_smile-2.mp3',
      'Joy/adaptive-inner_smile/adaptive-inner_smile-3.mp3'
    ]
  },
  'amoeba_dance': {
    id: 'amoeba_dance',
    element: 'TERRA',
    visual: '💫',
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
    audioSrc: [
      'Joy/adaptive-amoeba_dance/adaptive-amoeba_dance-1.mp3',
      'Joy/adaptive-amoeba_dance/adaptive-amoeba_dance-2.mp3',
      'Joy/adaptive-amoeba_dance/adaptive-amoeba_dance-3.mp3',
      'Joy/adaptive-amoeba_dance/adaptive-amoeba_dance-4.mp3'
    ]
  },
  'silence_point': {
    id: 'silence_point',
    element: 'TERRA',
    visual: '⚫',
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
    audioSrc: [
      'Contemplation/adaptive-silence_point/adaptive-silence_point-1.mp3',
      'Contemplation/adaptive-silence_point/adaptive-silence_point-2.mp3',
      'Contemplation/adaptive-silence_point/adaptive-silence_point-3.mp3',
      'Contemplation/adaptive-silence_point/adaptive-silence_point-4.mp3'
    ]
  },
  'listen_space': {
    id: 'listen_space',
    element: 'TERRA',
    visual: '🌌',
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
    audioSrc: [
      'Contemplation/adaptive-listen_space/adaptive-listen_space-1.mp3',
      'Contemplation/adaptive-listen_space/adaptive-listen_space-2.mp3',
      'Contemplation/adaptive-listen_space/adaptive-listen_space-3.mp3',
      'Contemplation/adaptive-listen_space/adaptive-listen_space-4.mp3'
    ]
  },
  'still_form': {
    id: 'still_form',
    element: 'TERRA',
    visual: '🕊',
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
    audioSrc: [
      'Calmness/adaptive-still_form/adaptive-still_form-1.mp3',
      'Calmness/adaptive-still_form/adaptive-still_form-2.mp3',
      'Calmness/adaptive-still_form/adaptive-still_form-3.mp3'
    ]
  },
  'rest_breath': {
    id: 'rest_breath',
    element: 'TERRA',
    visual: '😴',
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
    audioSrc: [
      'Fatigue/adaptive-rest_breath/adaptive-rest_breath-1.mp3',
      'Fatigue/adaptive-rest_breath/adaptive-rest_breath-2.mp3',
      'Fatigue/adaptive-rest_breath/adaptive-rest_breath-3.mp3',
      'Fatigue/adaptive-rest_breath/adaptive-rest_breath-4.mp3'
    ]
  },
  'warm_sphere': {
    id: 'warm_sphere',
    element: 'TERRA',
    visual: '☀️',
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
    audioSrc: [
      'Fatigue/adaptive-warm_sphere/adaptive-warm_sphere-1.mp3',
      'Fatigue/adaptive-warm_sphere/adaptive-warm_sphere-2.mp3',
      'Fatigue/adaptive-warm_sphere/adaptive-warm_sphere-3.mp3',
      'Fatigue/adaptive-warm_sphere/adaptive-warm_sphere-4.mp3'
    ]
  }
};

type PracticeState = 'intro' | 'practice' | 'complete';

export function AdaptivePracticeModal({ isOpen, onClose, practiceId, onOndEarned }: AdaptivePracticeModalProps) {
  const { t } = useTranslation();
  const isLight = useTheme().resolved === 'light';
  const vitalsData = useVitals();
  const { isPremium, isLoading: isSubLoading } = useSubscription();
  const { track } = useAnalytics();
  const platform = Capacitor.getPlatform();
  const [practiceState, setPracticeState] = useState<PracticeState>('intro');
  const [isPaused, setIsPaused] = useState(false);
  const [practiceTime, setPracticeTime] = useState(0);
  const [currentGuidingTextIndex, setCurrentGuidingTextIndex] = useState(0);
  const [isTextTransitioning, setIsTextTransitioning] = useState(false);
  const [audioResetKey, setAudioResetKey] = useState(0);
  const [qualityScore, setQualityScore] = useState(0);
  const [maxQualityScore, setMaxQualityScore] = useState(0); // Quality only goes up, never down
  const [currentTrack, setCurrentTrack] = useState(1);
  const [totalTracks, setTotalTracks] = useState(1);
  const [initialMetrics, setInitialMetrics] = useState<{ stress: number | null; energy: number | null }>({ stress: null, energy: null });
  const [bestMetrics, setBestMetrics] = useState<{ stress: number | null; energy: number | null }>({ stress: null, energy: null });
  const [earnedOnd, setEarnedOnd] = useState(0);
  const [simulatedVitals, setSimulatedVitals] = useState({ stress: 50, energy: 50 });
  const [practiceRating, setPracticeRating] = useState(0);
  const timerRef = useRef<number | null>(null);
  const prevIsOpenRef = useRef(false);
  const modalOpenedAtRef = useRef<number | null>(null);
  const [canClose, setCanClose] = useState(true);
  
  // Ref to store CURRENT vitals - updated every render, accessible in async functions
  const vitalsRef = useRef(vitalsData);
  vitalsRef.current = vitalsData;

  const practice = adaptivePractices[practiceId];

  // Airbridge: fire "View Practice" once each time the intro screen opens.
  useEffect(() => {
    if (!isOpen || !practice) return;
    trackTenjinPractice('View', t(practice.name), { surface: 'adaptive', practiceId: practice.id });
  }, [isOpen, practice?.id]);

  useEffect(() => {
    console.log('AdaptivePracticeModal vitalsData:', {
      stress: vitalsData.stress,
      energy: vitalsData.energy,
      hasVitalsData: vitalsData.hasVitalsData,
      hrSource: vitalsData.hrSource
    });

    if (practiceState === 'practice' && vitalsData.stress !== null && vitalsData.energy !== null) {
      setBestMetrics(best => ({
        stress: Math.min(best.stress, vitalsData.stress!),
        energy: Math.max(best.energy, vitalsData.energy!)
      }));
    }
  }, [vitalsData.stress, vitalsData.energy, vitalsData.hasVitalsData, vitalsData.hrSource, practiceState]);

  // Auto-start iOS monitoring when modal opens
  useEffect(() => {
    const isIOS = typeof window !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent);
    
    if (isOpen && isIOS) {
      console.log('[AdaptivePractice] Modal opened on iOS, starting health monitoring...');
      
      // Start Watch monitoring if connected
      if (vitalsData.watchHR.isConnected && !vitalsData.watchHR.isMonitoring) {
        vitalsData.watchHR.startRealtime().then(() => {
          console.log('[AdaptivePractice] Watch auto-started on modal open');
        }).catch(err => {
          console.error('[AdaptivePractice] Watch auto-start error:', err);
        });
      }
    }
    
    // ❌ НЕ ОСТАНАВЛИВАЕМ мониторинг при закрытии модалки
    // Мониторинг должен продолжаться в фоне для других практик
  }, [isOpen, vitalsData.watchHR.isConnected]);

  useEffect(() => {
    // Reset state when modal OPENS (transition from closed to open)
    const wasOpen = prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;
    
    if (isOpen && !wasOpen) {
      // Modal just opened - reset everything to initial state
      modalOpenedAtRef.current = Date.now();
      setCanClose(false);
      setTimeout(() => setCanClose(true), 1800);
      console.log('[AdaptivePractice] Modal opened - resetting state to intro');
      setPracticeState('intro');
      setPracticeTime(0);
      setIsPaused(false);
      setCurrentGuidingTextIndex(0);
      setAudioResetKey(prev => prev + 1);
      setQualityScore(0);
      setMaxQualityScore(0);
      setPracticeRating(0);
      setCurrentTrack(1);
      setTotalTracks(1);
      setInitialMetrics({ stress: null, energy: null });
      setBestMetrics({ stress: null, energy: null });
      setEarnedOnd(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    // Clean up timer when modal closes
    if (!isOpen && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
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

        if (!vitalsData.hasVitalsData) {
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

        // Use vitalsRef for fresh values
        const freshVitals = vitalsRef.current;
        if (freshVitals.hasVitalsData && freshVitals.stress !== null && freshVitals.energy !== null) {
          setBestMetrics(best => {
            const updated = {
              stress: Math.min(best.stress ?? 100, freshVitals.stress!),
              energy: Math.max(best.energy ?? 0, freshVitals.energy!)
            };
            console.log('Best metrics updated:', { previous: best, current: { stress: freshVitals.stress, energy: freshVitals.energy }, updated });
            return updated;
          });
        }
        
        // Update maxQualityScore - quality only goes up, never down
        setMaxQualityScore(prev => {
          const current = calculateCurrentQuality();
          return Math.max(prev, current);
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [practiceState, isPaused, practice, currentGuidingTextIndex]);

  const startPractice = async () => {
    // Start iOS monitoring if available but not already running
    const isIOS = typeof window !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent);
    if (isIOS) {
      console.log('[AdaptivePractice] iOS detected, starting health monitoring...');
      
      // Try Watch first (real-time), then HealthKit
      if (vitalsData.watchHR.isConnected && !vitalsData.watchHR.isMonitoring) {
        try {
          await vitalsData.watchHR.startRealtime();
          console.log('[AdaptivePractice] Watch monitoring started');
        } catch (err) {
          console.error('[AdaptivePractice] Watch start error:', err);
        }
      }
      
      
      // Check if vitals are already available (displayed on screen)
      const alreadyHasVitals = vitalsRef.current.hasVitalsData;
      console.log('[AdaptivePractice] iOS check: hasVitalsData=' + alreadyHasVitals + 
        ', stress=' + vitalsRef.current.stress + ', energy=' + vitalsRef.current.energy);
      
      // Практику не блокируем ожиданием пульса (раньше — зависание до 10 с
      // без Apple Watch). Мониторинг запущен выше, метрики подтянутся в фоне.
    }

    // Use vitalsRef.current for FRESH values after any async wait
    const freshVitals = vitalsRef.current;
    const hasRealMetrics = freshVitals.hasVitalsData;
    const currentStress = hasRealMetrics && freshVitals.stress !== null ? freshVitals.stress : 50;
    const currentEnergy = hasRealMetrics && freshVitals.energy !== null ? freshVitals.energy : 50;

    console.log('Starting practice with initial metrics:', { 
      hasRealMetrics, 
      currentStress, 
      currentEnergy, 
      hrSource: freshVitals.hrSource,
      stressReady: freshVitals.stressReady,
      energyReady: freshVitals.energyReady,
      rawStress: freshVitals.stress,
      rawEnergy: freshVitals.energy
    });

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
    setMaxQualityScore(0);
    if (practice) trackTenjinPractice('Start', t(practice.name), { surface: 'adaptive', practiceId: practice.id });
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
    if (!practice) return maxQualityScore;

    const completionProgress = Math.min(practiceTime / practice.targetTime, 1);
    const completionScore = completionProgress * 15;

    // Use BEST metrics (lowest stress, highest energy achieved) instead of current
    // This ensures quality never drops even if metrics temporarily worsen
    const bestStress = bestMetrics.stress ?? (vitalsData.hasVitalsData ? vitalsData.stress : simulatedVitals.stress);
    const bestEnergy = bestMetrics.energy ?? (vitalsData.hasVitalsData ? vitalsData.energy : simulatedVitals.energy);

    const stressChange = ((initialMetrics.stress! - bestStress!) / initialMetrics.stress!) * 100;
    const stressTarget = 10;
    const stressScore = Math.min(Math.max(stressChange / stressTarget, 0), 1);
    const stressPerformanceScore = stressScore * 40;

    const energyChange = ((bestEnergy! - initialMetrics.energy!) / initialMetrics.energy!) * 100;
    const energyTarget = 10;
    const energyScore = Math.min(Math.max(energyChange / energyTarget, 0), 1);
    const energyPerformanceScore = energyScore * 45;

    const calculatedQuality = completionScore + stressPerformanceScore + energyPerformanceScore;
    
    // Return the maximum quality ever achieved (never goes down)
    return Math.max(calculatedQuality, maxQualityScore);
  };

  const completePractice = async () => {
    console.log('[AdaptivePractice] completePractice() called');
    if (!practice) {
      console.log('[AdaptivePractice] No practice found, returning');
      return;
    }

    // Completion threshold: user must have spent at least 80% of target time.
    // Mirrors the `timePercent >= 0.8` rule used for basic practices' isValidForArtifact.
    // If the user hits Complete earlier — it's a Stop, not a Finish.
    const isValidForCompletion = practiceTime >= practice.targetTime * 0.8;

    // Use vitalsRef.current for FRESH values (not stale closure)
    const freshVitals = vitalsRef.current;
    const currentStress = freshVitals.hasVitalsData && freshVitals.stress !== null ? freshVitals.stress : simulatedVitals.stress;
    const currentEnergy = freshVitals.hasVitalsData && freshVitals.energy !== null ? freshVitals.energy : simulatedVitals.energy;

    // Use BEST metrics for OND calculation (lowest stress, highest energy achieved)
    // This ensures users don't lose progress if metrics temporarily worsen
    const finalStress = Math.min(bestMetrics.stress ?? currentStress, currentStress);
    const finalEnergy = Math.max(bestMetrics.energy ?? currentEnergy, currentEnergy);

    // hasRealMetrics = TRUE only if BOTH initial and final used real data
    const hasRealMetrics = freshVitals.hasVitalsData && initialMetrics.stress !== 50;

    console.log('Practice completion metrics:', {
      hasRealMetrics,
      hrSource: freshVitals.hrSource,
      usingSimulation: !freshVitals.hasVitalsData,
      initialStress: initialMetrics.stress,
      currentStress,
      bestStress: bestMetrics.stress,
      finalStress,
      initialEnergy: initialMetrics.energy,
      currentEnergy,
      bestEnergy: bestMetrics.energy,
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
      console.log('[AdaptivePractice] Getting current user...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('[AdaptivePractice] No user found, skipping save');
        setPracticeState('complete');
        trackTenjinPractice(
          isValidForCompletion ? 'Finish' : 'Stop',
          t(practice.name),
          {
            surface: 'adaptive',
            practiceId: practice.id,
            extra: isValidForCompletion
              ? {
                  duration_seconds: practiceTime,
                  stress_before: initialMetrics.stress,
                  stress_after: Math.round(finalStress),
                  energy_before: initialMetrics.energy,
                  energy_after: Math.round(finalEnergy),
                  has_real_metrics: hasRealMetrics,
                  ond_earned: ondReward.totalOnd,
                }
              : undefined,
          }
        );
        if (isValidForCompletion) {
          trackTenjinFirstPracticeComplete(t(practice.name), { surface: 'adaptive' });
        }
        return;
      }
      console.log('[AdaptivePractice] User found:', user.id);

      console.log('[AdaptivePractice] Saving practice reward with BEST metrics...');
      const insertResult = await supabase.from('practice_rewards').insert({
        user_id: user.id,
        practice_id: practice.id,
        practice_duration_seconds: practiceTime,
        expected_duration_seconds: practice.targetTime,
        stress_before: initialMetrics.stress,
        stress_after: finalStress, // Best (lowest) stress achieved
        energy_before: initialMetrics.energy,
        energy_after: finalEnergy, // Best (highest) energy achieved
        completion_ond: ondReward.completionOnd,
        performance_ond: ondReward.performanceOnd,
        total_ond_earned: ondReward.totalOnd
      });
      console.log('[AdaptivePractice] Practice reward insert result:', insertResult);

      console.log('[AdaptivePractice] Fetching current progress...');
      const { data: currentProgress } = await supabase
        .from('user_progress')
        .select('total_ond')
        .eq('user_id', user.id)
        .maybeSingle();
      console.log('[AdaptivePractice] Current progress:', currentProgress);

      const newTotal = (currentProgress?.total_ond || 0) + ondReward.totalOnd;
      console.log('[AdaptivePractice] New total OND:', newTotal);

      console.log('[AdaptivePractice] Upserting user progress...');
      const upsertResult = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          total_ond: newTotal,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      console.log('[AdaptivePractice] User progress upsert result:', upsertResult);

      if (onOndEarned) {
        console.log('[AdaptivePractice] Calling onOndEarned callback...');
        onOndEarned(ondReward.totalOnd);
      }

      console.log('[AdaptivePractice] All database operations completed successfully');
    } catch (error) {
      console.error('[AdaptivePractice] Error saving practice reward:', error);
      console.error('[AdaptivePractice] Error details:', JSON.stringify(error));
    }

    console.log('[AdaptivePractice] Setting practice state to complete...');
    setPracticeState('complete');
    console.log('[AdaptivePractice] Practice state set to complete');
    trackTenjinPractice(
      isValidForCompletion ? 'Finish' : 'Stop',
      t(practice.name),
      {
        surface: 'adaptive',
        practiceId: practice.id,
        extra: isValidForCompletion
          ? {
              duration_seconds: practiceTime,
              stress_before: initialMetrics.stress,
              stress_after: Math.round(finalStress),
              energy_before: initialMetrics.energy,
              energy_after: Math.round(finalEnergy),
              has_real_metrics: hasRealMetrics,
              ond_earned: ondReward.totalOnd,
            }
          : undefined,
      }
    );
    if (isValidForCompletion) {
      trackTenjinFirstPracticeComplete(t(practice.name), { surface: 'adaptive' });
    }
  };

  const handleClose = async (eventOrReason?: React.MouseEvent | string) => {
    const msSinceOpen = modalOpenedAtRef.current ? Date.now() - modalOpenedAtRef.current : null;
    const callerStack = new Error().stack?.split('\n').slice(1, 6).join(' | ') ?? 'no-stack';

    let eventInfo: Record<string, unknown> = {};
    if (eventOrReason && typeof eventOrReason === 'object' && 'nativeEvent' in eventOrReason) {
      const e = eventOrReason as React.MouseEvent;
      const ne = e.nativeEvent as MouseEvent & { pointerType?: string };
      eventInfo = {
        evt_isTrusted: ne?.isTrusted ?? null,
        evt_type: ne?.type ?? null,
        evt_detail: ne?.detail ?? null,
        evt_x: ne?.clientX ?? null,
        evt_y: ne?.clientY ?? null,
        evt_pointerType: ne?.pointerType ?? null,
        evt_targetTag: (e.target as HTMLElement)?.tagName ?? null,
      };
    }
    const reasonTag = typeof eventOrReason === 'string' ? eventOrReason : 'x_button_click';

    const debugSnapshot = {
      surface: 'adaptive',
      reason: reasonTag,
      msSinceOpen,
      practiceState,
      practiceId,
      practiceResolved: !!practice,
      practiceTime,
      isPremium,
      isSubLoading,
      platform,
      callerStack,
      ...eventInfo,
    };
    console.warn('[DEBUG handleClose] called', debugSnapshot);
    track('practice_intro_closed_debug', debugSnapshot);

    // Ghost-tap guard: ignore close attempts in the first 1800ms after modal opened.
    if (msSinceOpen !== null && msSinceOpen < 1800 && practiceState === 'intro' && practiceTime === 0) {
      console.warn('[DEBUG handleClose] BLOCKED by 1800ms guard', { msSinceOpen });
      return;
    }

    // Tenjin practice lifecycle on close:
    //   - mid-practice (practiceState === 'practice') → Stop
    //   - intro screen, user never started → Close
    //   - 'complete' result screen → no-op (Finish/Stop already fired)
    if (practice) {
      if (practiceState === 'practice') {
        trackTenjinPractice('Stop', t(practice.name), { surface: 'adaptive', practiceId: practice.id });
      } else if (practiceState !== 'complete') {
        trackTenjinPractice('Close', t(practice.name), { surface: 'adaptive', practiceId: practice.id });
      }
    }

    if (practiceRating > 0 && practiceTime > 0 && practice) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('practice_ratings').insert({
            user_id: user.id,
            practice_id: practice.id,
            practice_name: t(practice.name),
            rating: practiceRating,
            duration_seconds: practiceTime
          });
          console.log('[AdaptivePractice] Rating saved:', { practiceId: practice.id, rating: practiceRating });
        }
      } catch (error) {
        console.error('[AdaptivePractice] Error saving practice rating:', error);
      }
    }
    
    setPracticeState('intro');
    setPracticeTime(0);
    setIsPaused(false);
    setCurrentGuidingTextIndex(0);
    setAudioResetKey(prev => prev + 1);
    setQualityScore(0);
    setMaxQualityScore(0);
    setPracticeRating(0);
    setCurrentTrack(1);
    setTotalTracks(1);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onClose();
  };

  if (isOpen && !practice) {
    console.warn('[DEBUG AdaptivePractice] Rendering null because practice is missing', {
      practiceId,
      availableKeys: Object.keys(adaptivePractices),
      msSinceOpen: modalOpenedAtRef.current ? Date.now() - modalOpenedAtRef.current : null,
    });
    track('practice_intro_closed_debug', {
      surface: 'adaptive',
      reason: 'null_render_missing_practice',
      practiceId,
      msSinceOpen: modalOpenedAtRef.current ? Date.now() - modalOpenedAtRef.current : null,
    });
  }
  if (!isOpen || !practice) return null;

  const progress = practice.targetTime > 0 ? (practiceTime / practice.targetTime) * 100 : 0;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Светлый экран завершения только в светлой теме; в остальном — космический.
  const completeLight = practiceState === 'complete' && isLight;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-6 transition-colors duration-1000 ${completeLight ? 'bg-gradient-to-br from-indigo-50 via-white to-violet-100 text-slate-800' : 'bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white'}`}>
      {!completeLight && (
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.3) 100%)'
      }} />
      )}

      <button
        onClick={handleClose}
        disabled={!canClose}
        style={!canClose ? { pointerEvents: 'none', opacity: 0.5 } : undefined}
        className={`absolute top-[72px] right-6 z-50 p-3 rounded-full transition-all hover:scale-110 backdrop-blur-2xl ${completeLight ? 'bg-white/60 hover:bg-white/80 border border-violet-200 text-slate-600' : 'bg-white/10 hover:bg-white/20 border border-white/25'}`}
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
            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 sm:p-8 mb-3 sm:mb-6 border border-white/25 shadow-2xl">
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
              <span className="bg-white/10 border border-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-xl text-xs sm:text-base min-w-[100px] sm:min-w-[120px] text-center">
                {formatTime(practice.targetTime)}
              </span>
              <span className="text-gray-400">•</span>
              <span className="bg-white/10 border border-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-xl text-xs sm:text-base min-w-[100px] sm:min-w-[120px] text-center">
                {t('practices.up_to')} {practice.maxOnd} OND
              </span>
            </div>
            <button
              onClick={() => {
                // Адаптивные практики бесплатны (FREE-бейджи на «Эмоциональной
                // сверке» и «Взгляд на себя») — без пэйвола.
                startPractice();
              }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-2xl px-6 sm:px-8 py-3 sm:py-5 rounded-full text-sm sm:text-base font-semibold transition-all transform hover:scale-110 shadow-2xl border border-white/25"
            >
              {t('practices.start')}
            </button>
          </div>
        )}

        {practiceState === 'practice' && (
          <div className="flex flex-col items-center justify-center min-h-screen">
            {/* Компактный круг с эмодзи и таймером */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-4 sm:mb-6 mx-auto mt-1 sm:mt-3">
              {/* Круговой прогресс */}
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
              
              {/* Эмодзи и таймер в центре круга */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Эмодзи в маленьком круге с размытием к краям */}
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-2 sm:mb-3 transform -translate-y-3 sm:-translate-y-5" style={{
                  animation: 'pulse 2s ease-in-out infinite',
                  filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.6))'
                }}>
                  {/* Размытый фон с градиентом к краям (в 2 раза прозрачнее) */}
                  <div className="absolute inset-0 rounded-full" style={{
                    background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(59,130,246,0.15) 50%, transparent 100%)',
                    filter: 'blur(8px)'
                  }} />
                  <div className="relative text-3xl sm:text-4xl">
                    {practice.visual}
                  </div>
                </div>
                
                {/* Таймер */}
                <div className="text-4xl sm:text-6xl font-mono tracking-wider drop-shadow-2xl transform -translate-y-4 sm:-translate-y-6" style={{
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
                  className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-300 transition-all duration-[12500ms] relative"
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
                <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 sm:p-6 border border-white/25 shadow-xl h-24 sm:h-28 flex items-center justify-center overflow-hidden">
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
              <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-3 sm:p-6 text-center border border-white/25 shadow-xl">
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-red-400" />
                <div className="text-2xl sm:text-4xl font-bold mb-1">{vitalsData.stress !== null ? Math.round(vitalsData.stress) : '--'}%</div>
                <div className="text-xs sm:text-sm text-gray-300">{t('labels.stress')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-3 sm:p-6 text-center border border-white/25 shadow-xl">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-blue-400" />
                <div className="text-2xl sm:text-4xl font-bold mb-1">{vitalsData.energy !== null ? Math.round(vitalsData.energy) : '--'}%</div>
                <div className="text-xs sm:text-sm text-gray-300">{t('labels.energy')}</div>
              </div>
            </div>
            
            <div className="flex gap-3 sm:gap-6">
              <button
                onClick={togglePause}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-2xl p-3 sm:p-5 rounded-full transition-all hover:scale-110 shadow-xl border border-white/25"
              >
                {isPaused ? <Play className="w-6 h-6 sm:w-8 sm:h-8" /> : <Pause className="w-6 h-6 sm:w-8 sm:h-8" />}
              </button>
              <button
                onClick={() => {
                  console.log('[AdaptivePractice] Complete button clicked!');
                  completePractice();
                }}
                className="bg-emerald-500/25 hover:bg-emerald-500/40 backdrop-blur-2xl px-6 sm:px-8 py-3 sm:py-5 rounded-full text-sm sm:text-base font-semibold transition-all hover:scale-110 shadow-xl border border-emerald-400/50"
                data-testid="button-complete-practice"
              >
                {t('adaptive_practices.complete')}
              </button>
            </div>
          </div>
        )}

        {practiceState === 'complete' && (
          <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6">
            <div className="max-w-2xl w-full text-center space-y-4 sm:space-y-8">
              <div className="text-6xl sm:text-8xl md:text-9xl mb-4 sm:mb-8 animate-bounce" style={{ animationDuration: '1s' }}>✨</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">{t('practices.completed')}</h2>

              {practice.finalPhrase && (
                <div className={`rounded-2xl p-4 sm:p-6 border shadow-xl mb-4 sm:mb-6 ${completeLight ? 'bg-white/55 backdrop-blur-xl border-violet-200 shadow-indigo-100/60' : 'bg-white/10 backdrop-blur-2xl border-white/25'}`}>
                  <p className={`text-base sm:text-lg md:text-xl italic leading-relaxed whitespace-pre-line ${completeLight ? 'text-slate-700' : 'text-white/90'}`}>
                    {t(practice.finalPhrase)}
                  </p>
                </div>
              )}

              <div className={`rounded-2xl p-6 sm:p-8 md:p-10 space-y-4 border shadow-2xl ${completeLight ? 'bg-white/55 backdrop-blur-xl border-violet-200 shadow-indigo-100/60' : 'bg-white/10 backdrop-blur-2xl border-white/25'}`}>
                {/* Row 1: OND Amount */}
                <div className={`text-4xl sm:text-5xl md:text-7xl font-mono animate-pulse ${completeLight ? 'text-amber-500' : 'text-yellow-400 drop-shadow-2xl'}`}>
                  +{earnedOnd} OND
                </div>

                {/* Row 2: Quality + Time - symmetric: numbers in center */}
                <div className="flex justify-center items-center text-sm sm:text-base">
                  <div className="flex items-center justify-end gap-2 w-[140px]">
                    <span className={completeLight ? 'text-slate-500' : 'text-gray-300'}>{t('practices.quality')}</span>
                    <span className={`font-bold text-lg sm:text-xl ${completeLight ? 'text-emerald-500' : 'text-emerald-400'}`}>{qualityScore}%</span>
                  </div>
                  <div className={`w-px h-6 mx-3 ${completeLight ? 'bg-slate-300' : 'bg-white/30'}`} />
                  <div className="flex items-center justify-start gap-2 w-[140px]">
                    <span className={`font-bold text-lg sm:text-xl ${completeLight ? 'text-slate-700' : 'text-white'}`}>{formatTime(practiceTime)}</span>
                    <span className={completeLight ? 'text-slate-500' : 'text-gray-300'}>{t('practices.time')}</span>
                  </div>
                </div>

                {/* Row 3: Stress + Energy - symmetric: numbers in center */}
                <div className="flex justify-center items-start text-sm sm:text-base">
                  <div className="flex flex-col items-end w-[140px]">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <span className={completeLight ? 'text-slate-500' : 'text-gray-300'}>{t('labels.stress')}</span>
                      <span className={`font-bold ${completeLight ? 'text-red-500' : 'text-red-400'}`}>{vitalsData.stress !== null ? Math.round(vitalsData.stress) : '--'}%</span>
                    </div>
                    <Activity className={`w-4 h-4 mt-1 ${completeLight ? 'text-red-500' : 'text-red-400'}`} />
                  </div>
                  <div className={`w-px h-10 mx-3 ${completeLight ? 'bg-slate-300' : 'bg-white/30'}`} />
                  <div className="flex flex-col items-start w-[140px]">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <span className={`font-bold ${completeLight ? 'text-blue-500' : 'text-blue-400'}`}>{vitalsData.energy !== null ? Math.round(vitalsData.energy) : '--'}%</span>
                      <span className={completeLight ? 'text-slate-500' : 'text-gray-300'}>{t('labels.energy')}</span>
                    </div>
                    <Zap className={`w-4 h-4 mt-1 ${completeLight ? 'text-blue-500' : 'text-blue-400'}`} />
                  </div>
                </div>

                {/* Row 4: Star Rating */}
                <div className="pt-2">
                  <p className={`text-sm mb-2 ${completeLight ? 'text-slate-500' : 'text-gray-400'}`}>{t('practices.rate_practice') || 'Rate this practice'}</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setPracticeRating(star)}
                        className="transition-all hover:scale-110"
                        data-testid={`button-adaptive-star-${star}`}
                      >
                        <Star
                          className={`w-8 h-8 sm:w-10 sm:h-10 ${
                            star <= practiceRating
                              ? 'text-yellow-400 fill-yellow-400'
                              : completeLight ? 'text-slate-300' : 'text-gray-500'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={() => {
                    setPracticeState('intro');
                    setPracticeTime(0);
                    setQualityScore(0);
                    setMaxQualityScore(0);
                    setPracticeRating(0);
                    setIsPaused(false);
                    setCurrentGuidingTextIndex(0);
                    setAudioResetKey(prev => prev + 1);
                    setCurrentTrack(1);
                    setTotalTracks(1);
                  }}
                  className={`backdrop-blur-xl px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all border ${completeLight ? 'bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 text-slate-800' : 'bg-white/10 hover:bg-white/20 border-white/25 text-white'}`}
                >
                  {t('practices.try_again')}
                </button>
                <button
                  onClick={handleClose}
                  className={`backdrop-blur-xl px-8 sm:px-10 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-bold transition-all border ${completeLight ? 'bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 text-slate-800' : 'bg-white/10 hover:bg-white/20 border-white/25 text-white'}`}
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
