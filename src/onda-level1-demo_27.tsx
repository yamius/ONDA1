import { useState, useEffect, useRef, useMemo } from 'react';
import { Heart, Droplets, Wind, Mountain, Star, Lock, CheckCircle, Circle, X, Play, Pause, User, Settings, Activity, Zap, Menu, Languages, RotateCcw, DollarSign, Watch, Waves } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from './lib/supabase';
import { AuthModal } from './components/AuthModal';
import { UserProfile } from './components/UserProfile';
import { SettingsModal } from './components/SettingsModal';
import { ConnectionModal } from './components/ConnectionModal';
import LanguageModal from './components/LanguageModal';
import { OndShopModal } from './components/OndShopModal';
import { RemoteAudioPlayer } from './components/RemoteAudioPlayer';
import { EmotionalCheckModal } from './components/EmotionalCheckModal';
import { InfoModal } from './components/InfoModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { PermissionWarningBanner } from './components/PermissionWarningBanner';
import { PermissionSetupModal } from './components/PermissionSetupModal';
import { WatchConnectionPrompt } from './components/WatchConnectionPrompt';
import { DebugMonitor } from './components/DebugMonitor';
import type { UserProfile as UserProfileType } from './lib/supabase';
import { useVitals } from './hooks/useVitals';
import { useHealthConnect } from './hooks/useHealthConnect';
import { useHealthKitData } from './hooks/useHealthKitData';
import { useHealthKitHeartRate } from './hooks/useHealthKitHeartRate';
import { useKeepAwake } from './hooks/useKeepAwake';
import { useWatchHeartRate } from './hooks/useWatchHeartRate';
import { usePermissions } from './hooks/usePermissions';
import { Capacitor } from '@capacitor/core';
import { rhythmStore } from './sleep/rhythm';
import { calculatePracticeOnd } from './utils/ondCalculator';
import OndaWatch from './plugins/ondaWatch';
import { useAnalytics } from './hooks/useAnalytics';

const OndaLevel1 = () => {
  const { t, i18n } = useTranslation();
  const vitalsData = useVitals();
  
  // Ref to store CURRENT vitals - updated every render, accessible in async functions
  const vitalsRef = useRef(vitalsData);
  vitalsRef.current = vitalsData;
  
  const healthConnectData = useHealthConnect();
  const healthKitData = useHealthKitData();
  const healthKitHeartRate = useHealthKitHeartRate({ pollingInterval: 1500 });
  const watchHeartRate = useWatchHeartRate();
  const permissions = usePermissions();
  const { track, trackPractice } = useAnalytics();
  const platform = Capacitor.getPlatform();
  
  useKeepAwake(true);
  
  // Track app open on mount
  useEffect(() => {
    track('app_open', { platform });
  }, []);

  // Track first heart rate from watch (successful connection)
  const hasTrackedWatchConnection = useRef(false);
  useEffect(() => {
    if (watchHeartRate.heartRate && !hasTrackedWatchConnection.current) {
      hasTrackedWatchConnection.current = true;
      track('watch_connection_success', {
        heart_rate: watchHeartRate.heartRate,
        is_connected: watchHeartRate.isConnected,
      });
    }
  }, [watchHeartRate.heartRate]);
  
  // Автозапуск HR мониторинга на втором и последующих запусках (когда разрешения уже есть)
  useEffect(() => {
    const autoStartMonitoring = async () => {
      // Если разрешения УЖЕ есть → запускаем стрим сразу при старте app
      if (!permissions.needsSetup && platform === 'ios') {
        console.log('[OndaLevel1] Разрешения уже есть → запускаем HR мониторинг автоматически');
        
        const isPluginAvailable = Capacitor.isPluginAvailable('OndaWatch');
        console.log('[OndaLevel1] 🔍 OndaWatch plugin check:', {
          isPluginAvailable,
          platform
        });

        if (isPluginAvailable) {
          try {
            await OndaWatch.startRealtime();
            console.log('[OndaLevel1] ✅ HR мониторинг запущен (канал настроен)');
          } catch (error) {
            console.error('[OndaLevel1] Ошибка запуска мониторинга:', error);
          }
        } else {
          console.error('[OndaLevel1] ❌ OndaWatch plugin NOT AVAILABLE or not registered!');
        }
      }
    };
    
    autoStartMonitoring();
  }, [permissions.needsSetup, platform]);
  
  useEffect(() => {
    if (platform === 'ios' && healthKitData.isAvailable && healthKitData.isAuthorized) {
      healthKitData.startAutoRefresh(30000);
      return () => healthKitData.stopAutoRefresh();
    }
  }, [platform, healthKitData.isAvailable, healthKitData.isAuthorized]);
  
  const displayHeartRate = watchHeartRate.heartRate ?? vitalsData.hr ?? null;

  const safeToFixed = (value: any, digits: number = 0): string => {
    if (value === null || value === undefined) return '--';
    const num = Number(value);
    return isNaN(num) ? '--' : num.toFixed(digits);
  };

  const [activeCircuit, setActiveCircuit] = useState(1);
  const [qnt, setQnt] = useState(0);
  const [artifacts, setArtifacts] = useState([]);
  const [debugInfo, setDebugInfo] = useState<string>('Loading...');
  const [completedPractices, setCompletedPractices] = useState({});
  const [practiceHistory, setPracticeHistory] = useState([]);
  const [activePractice, setActivePractice] = useState(null);
  const [practiceState, setPracticeState] = useState('intro');
  const [practiceTime, setPracticeTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [qualityScore, setQualityScore] = useState(0);
  const [practiceRating, setPracticeRating] = useState(0);
  const [showJournal, setShowJournal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [expandedPractice, setExpandedPractice] = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showEmotionalCheck, setShowEmotionalCheck] = useState(false);
  const [emotionalState, setEmotionalState] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingMode, setRecordingMode] = useState('voice');
  const [audioLevel, setAudioLevel] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language?.split('-')[0]?.toUpperCase() || 'EN');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [showChapterDropdown, setShowChapterDropdown] = useState(false);
   const [sleepTracking, setSleepTracking] = useState<{ day: number; lastCheck: string | null }>({ day: 0, lastCheck: null });
  const [rhythmProgress, setRhythmProgress] = useState(rhythmStore.progress());
  const [rhythmLog, setRhythmLog] = useState(rhythmStore.getLog());
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [practiceStats, setPracticeStats] = useState<Array<{
    practice_id: string;
    practice_name: string;
    avg_duration: number;
    avg_rating: number;
    total_sessions: number;
  }>>([]);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [gameProgress, setGameProgress] = useState<UserGameProgress | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showWatchPrompt, setShowWatchPrompt] = useState(false);
  const [showQntShop, setShowQntShop] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [infoModalMessage, setInfoModalMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return !localStorage.getItem('onda_onboarding_completed');
    }
    return true;
  });
  const [onboardingScreen, setOnboardingScreen] = useState(1);

  const [bioMetrics, setBioMetrics] = useState({
    heartRate: 72,
    hrv: 45,
    spo2: 98,
    temp: 36.6,
    stability: 100
  });
  const [currentGuidingTextIndex, setCurrentGuidingTextIndex] = useState(0);
  const [isTextTransitioning, setIsTextTransitioning] = useState(false);
  const [audioResetKey, setAudioResetKey] = useState(0);
  const [initialVitals, setInitialVitals] = useState({ stress: 50, energy: 50 });
  const [currentTrack, setCurrentTrack] = useState(1);
  const [totalTracks, setTotalTracks] = useState(1);
  const [simulatedVitals, setSimulatedVitals] = useState({ stress: 50, energy: 50 });
  const [bestMetrics, setBestMetrics] = useState({ stress: 50, energy: 50 }); // Best metrics achieved during practice
  const [meetsArtifactRequirements, setMeetsArtifactRequirements] = useState(false); // Real-time validation for artifact
  const maxQualityRef = useRef(0);
  const practiceRefs = useRef({});


  const currentPlayerName = userProfile?.display_name || t('you');

  const leaderboardData = [
    { name: 'Alexander', qnt: 2847.5, avgQuality: 94, totalTime: 1245 },
    { name: 'Emily', qnt: 2654.2, avgQuality: 92, totalTime: 1180 },
    { name: 'Michael', qnt: 2431.8, avgQuality: 89, totalTime: 1095 },
    { name: 'Sarah', qnt: 2289.3, avgQuality: 91, totalTime: 1020 },
    { name: currentPlayerName, qnt: Number(qnt) || 0, avgQuality: practiceHistory.length > 0 ? (practiceHistory.reduce((sum, p) => sum + (p.quality || 0), 0) / practiceHistory.length) : 0, totalTime: practiceHistory.reduce((sum, p) => sum + (p.duration || 0), 0) },
    { name: 'James', qnt: 1987.6, avgQuality: 87, totalTime: 895 },
    { name: 'Jessica', qnt: 1845.9, avgQuality: 88, totalTime: 840 },
    { name: 'David', qnt: 1723.4, avgQuality: 85, totalTime: 780 },
  ];

  const sortedByQnt = [...leaderboardData].sort((a, b) => b.qnt - a.qnt);
  const sortedByQuality = [...leaderboardData].sort((a, b) => b.avgQuality - a.avgQuality);
  const sortedByTime = [...leaderboardData].sort((a, b) => b.totalTime - a.totalTime);

  // Автосинхронизация ритма жизни при старте и периодическое обновление
  useEffect(() => {
    // Синхронизация из HealthKit при старте (только на iOS)
    const syncRhythm = async () => {
      try {
        await rhythmStore.syncFromHealthKit();
        setRhythmProgress(rhythmStore.progress());
        setRhythmLog(rhythmStore.getLog());
        console.log('[App] Life Rhythm synced from HealthKit');
      } catch (e) {
        console.log('[App] Life Rhythm sync skipped:', e);
      }
    };
    
    syncRhythm();

    // Периодическое обновление UI и синхронизация (каждые 30 секунд)
    const id = setInterval(() => {
      // Пересинхронизируем из HealthKit периодически
      rhythmStore.syncFromHealthKit().catch(() => {});
      setRhythmProgress(rhythmStore.progress());
      setRhythmLog(rhythmStore.getLog());
    }, 30000); // Обновляем раз в 30 секунд
    return () => clearInterval(id);
  }, []);

  // Добавляем артефакт "Ритм Жизни" при достижении 7 дней (постоянный, не удаляется)
  const LIFE_RHYTHM_ARTIFACT_ID = 'life-rhythm';
  useEffect(() => {
    const hasLifeRhythmArtifact = artifacts.some(a => a.id === LIFE_RHYTHM_ARTIFACT_ID);
    
    if (rhythmProgress >= 7 && !hasLifeRhythmArtifact) {
      // Добавляем артефакт "Ритм Жизни" - он остаётся навсегда
      console.log('[App] Life Rhythm artifact unlocked! +100% OND bonus (permanent)');
      setArtifacts(prev => [...prev, {
        id: LIFE_RHYTHM_ARTIFACT_ID,
        name: 'Ритм Жизни',
        bonus: 100,
        isLifeRhythm: true
      }]);
    }
    // Артефакт НЕ удаляется при падении streak - он постоянный
  }, [rhythmProgress, artifacts]);

  // Добавляем артефакт "Ясная Воля" за 3 практики с качеством 100%
  const CLEAR_WILL_ARTIFACT_ID = 'clear-will';
  useEffect(() => {
    const hasClearWillArtifact = artifacts.some(a => a.id === CLEAR_WILL_ARTIFACT_ID);
    const perfectPractices = practiceHistory.filter(p => p.quality >= 100).length;
    
    if (perfectPractices >= 3 && !hasClearWillArtifact) {
      console.log('[App] Clear Will artifact unlocked! +30% OND bonus');
      setArtifacts(prev => [...prev, {
        id: CLEAR_WILL_ARTIFACT_ID,
        name: t('artifacts.clear_will'),
        bonus: 30,
        isClearWill: true
      }]);
    }
  }, [practiceHistory, artifacts]);

  // Добавляем артефакт "Внутренняя Волна" за 6 практик части 2 с качеством 100%
  const INNER_WAVE_ARTIFACT_ID = 'inner-wave';
  useEffect(() => {
    const hasInnerWaveArtifact = artifacts.some(a => a.id === INNER_WAVE_ARTIFACT_ID);
    // Считаем практики части 2 (p2-*) с качеством 100%
    const part2PerfectPractices = practiceHistory.filter(p => 
      p.practiceId?.startsWith('p2-') && p.quality >= 100
    ).length;
    
    if (part2PerfectPractices >= 6 && !hasInnerWaveArtifact) {
      console.log('[App] Inner Wave artifact unlocked! +30% OND bonus');
      setArtifacts(prev => [...prev, {
        id: INNER_WAVE_ARTIFACT_ID,
        name: t('artifacts.inner_wave'),
        bonus: 30,
        isInnerWave: true
      }]);
    }
  }, [practiceHistory, artifacts]);

  // Добавляем артефакт "Пульс Трансформации" за 9 практик части 3 с качеством 100%
  const TRANSFORMATION_PULSE_ARTIFACT_ID = 'transformation-pulse';
  useEffect(() => {
    const hasTransformationPulseArtifact = artifacts.some(a => a.id === TRANSFORMATION_PULSE_ARTIFACT_ID);
    // Считаем практики части 3 (p3-*) с качеством 100%
    const part3PerfectPractices = practiceHistory.filter(p => 
      p.practiceId?.startsWith('p3-') && p.quality >= 100
    ).length;
    
    if (part3PerfectPractices >= 9 && !hasTransformationPulseArtifact) {
      console.log('[App] Transformation Pulse artifact unlocked! +30% OND bonus');
      setArtifacts(prev => [...prev, {
        id: TRANSFORMATION_PULSE_ARTIFACT_ID,
        name: t('artifacts.transformation_pulse'),
        bonus: 30,
        isTransformationPulse: true
      }]);
    }
  }, [practiceHistory, artifacts]);

  // Добавляем артефакт "Эхо Радости" за 3 практики части 4 с качеством 100%
  const ECHO_OF_JOY_ARTIFACT_ID = 'echo-of-joy';
  useEffect(() => {
    const hasEchoOfJoyArtifact = artifacts.some(a => a.id === ECHO_OF_JOY_ARTIFACT_ID);
    // Считаем практики части 4 (p4-*) с качеством 100%
    const part4PerfectPractices = practiceHistory.filter(p => 
      p.practiceId?.startsWith('p4-') && p.quality >= 100
    ).length;
    
    if (part4PerfectPractices >= 3 && !hasEchoOfJoyArtifact) {
      console.log('[App] Echo of Joy artifact unlocked! +50% OND bonus');
      setArtifacts(prev => [...prev, {
        id: ECHO_OF_JOY_ARTIFACT_ID,
        name: t('artifacts.echo_of_joy'),
        bonus: 50,
        isEchoOfJoy: true
      }]);
    }
  }, [practiceHistory, artifacts]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log('[ONDA Debug] Loading user data...');
        setDebugInfo('Загрузка...');
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        console.log('[ONDA Debug] User:', user ? { id: user.id, email: user.email } : 'Not authenticated');

        if (!user) {
          setDebugInfo('❌ Не авторизован');
          return;
        }

        setDebugInfo(`✓ User: ${user.email?.slice(0, 15)}...`);

        const [profileRes, progressRes] = await Promise.all([
          supabase.from('user_profiles').select('*').eq('id', user.id).maybeSingle(),
          supabase.from('user_game_progress').select('*').eq('user_id', user.id).maybeSingle()
        ]);
        console.log('[ONDA Debug] Fetch results:', {
          profile: profileRes.data ? 'found' : 'null',
          profileError: profileRes.error?.message,
          gameProgress: progressRes.data ? 'found' : 'null',
          gameProgressError: progressRes.error?.message
        });

        // Log any fetch errors
        if (profileRes.error) console.error('Error fetching profile:', profileRes.error);
        if (progressRes.error) console.error('Error fetching game progress:', progressRes.error);

        let profile = profileRes.data;
        if (!profile) {
          // INSERT only if no record exists - DO NOT overwrite existing data!
          const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Player-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          const { data: newProfile, error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: user.id,
              display_name: displayName,
              avatar_url: user.user_metadata?.avatar_url
            })
            .select()
            .single();
          
          // If duplicate key error (23505), try to fetch existing record
          if (profileError?.code === '23505') {
            console.log('[ONDA Debug] Profile already exists, fetching...');
            const { data: existingProfile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', user.id)
              .single();
            profile = existingProfile;
          } else if (profileError) {
            console.error('Error creating profile:', profileError);
          } else {
            profile = newProfile;
          }
        }
        setUserProfile(profile);

        let progress = progressRes.data;
        if (!progress) {
          // INSERT only if no record exists - DO NOT overwrite existing data!
          const { data: newProgress, error: progressError } = await supabase
            .from('user_game_progress')
            .insert({
              user_id: user.id,
              ond: 0,
              active_circuit: 1,
              completed_practices: {},
              practice_history: [],
              artifacts: [],
              unlocked_achievements: [],
              bio_metrics: { heartRate: 72, hrv: 45, spo2: 98, temp: 36.6, stability: 100 },
              sleep_tracking: { day: 0, lastCheck: null },
              selected_language: 'EN',
              selected_level: 1,
              selected_chapter: 1,
              is_light_theme: false
            })
            .select()
            .single();
          
          // If duplicate key error (23505), try to fetch existing record
          if (progressError?.code === '23505') {
            console.log('[ONDA Debug] Record already exists, fetching...');
            const { data: existingProgress } = await supabase
              .from('user_game_progress')
              .select('*')
              .eq('user_id', user.id)
              .single();
            progress = existingProgress;
          } else if (progressError) {
            console.error('Error creating game progress:', progressError);
          } else {
            progress = newProgress;
          }
        }

        if (progress) {
          const finalOnd = progress.ond || 0;
          const practiceCount = Object.keys(progress.completed_practices || {}).length;
          
          // Debug logging to diagnose data loading issues
          console.log('[ONDA Debug] Loaded user progress:', {
            user_id: user.id,
            ond: progress.ond,
            completed_practices: Object.keys(progress.completed_practices || {}),
            practice_history_count: (progress.practice_history || []).length,
            artifacts: progress.artifacts
          });

          // Update visible debug info
          setDebugInfo(`✅ OND: ${finalOnd} | Практик: ${practiceCount}`);

          setGameProgress(progress);
          setQnt(finalOnd);
          setActiveCircuit(progress.active_circuit || 1);
          setCompletedPractices(progress.completed_practices || {});
          setPracticeHistory(progress.practice_history || []);
          setArtifacts(progress.artifacts || []);
          setUnlockedAchievements(progress.unlocked_achievements || []);
          setBioMetrics(progress.bio_metrics || {
            heartRate: 72,
            hrv: 45,
            spo2: 98,
            temp: 36.6,
            stability: 100
          });
          setSleepTracking(progress.sleep_tracking || { day: 0, lastCheck: null });
          setSelectedLanguage('EN');
          i18n.changeLanguage('en');
          setSelectedLevel(progress.selected_level || 1);
          setSelectedChapter(progress.selected_chapter || 1);
          setIsLightTheme(progress.is_light_theme || false);
        } else {
          console.warn('[ONDA Debug] No progress data loaded for user:', user.id);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadUserData();
      } else {
        setUser(null);
        setUserProfile(null);
        setGameProgress(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Load practice statistics for rating modal
  useEffect(() => {
    const loadPracticeStats = async () => {
      try {
        const { data, error } = await supabase
          .from('practice_ratings')
          .select('practice_id, practice_name, rating, duration_seconds');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Group by practice_id and calculate averages
          const statsMap = new Map<string, { 
            practice_name: string; 
            ratings: number[]; 
            durations: number[]; 
          }>();
          
          data.forEach((row) => {
            const existing = statsMap.get(row.practice_id);
            if (existing) {
              existing.ratings.push(row.rating);
              existing.durations.push(row.duration_seconds);
            } else {
              statsMap.set(row.practice_id, {
                practice_name: row.practice_name,
                ratings: [row.rating],
                durations: [row.duration_seconds]
              });
            }
          });
          
          const stats = Array.from(statsMap.entries()).map(([practice_id, data]) => ({
            practice_id,
            practice_name: data.practice_name,
            avg_duration: data.durations.reduce((a, b) => a + b, 0) / data.durations.length,
            avg_rating: data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length,
            total_sessions: data.ratings.length
          }));
          
          // Sort by average rating descending
          stats.sort((a, b) => b.avg_rating - a.avg_rating);
          setPracticeStats(stats);
        }
      } catch (error) {
        console.error('Error loading practice stats:', error);
      }
    };
    
    if (showRatingModal) {
      loadPracticeStats();
    }
  }, [showRatingModal]);

  useEffect(() => {
    if (user && showAuthModal) {
      console.log('[Auth] User logged in, closing auth modal');
      setShowAuthModal(false);
    }
  }, [user, showAuthModal]);

  useEffect(() => {
    const saveGameProgress = async () => {
      if (!user || isLoadingUser) return;

      try {
        const { error } = await supabase.from('user_game_progress').update({
          ond: qnt,
          active_circuit: activeCircuit,
          completed_practices: completedPractices,
          practice_history: practiceHistory,
          artifacts,
          unlocked_achievements: unlockedAchievements,
          bio_metrics: bioMetrics,
          sleep_tracking: sleepTracking,
          selected_language: selectedLanguage,
          selected_level: selectedLevel,
          selected_chapter: selectedChapter,
          is_light_theme: isLightTheme,
          updated_at: new Date().toISOString()
        }).eq('user_id', user.id);
        
        if (error) {
          console.error('Error saving game progress:', error.message, error.details, error.hint);
        }
      } catch (error) {
        console.error('Error saving game progress (exception):', error);
      }
    };

    const debounceTimer = setTimeout(saveGameProgress, 1000);
    return () => clearTimeout(debounceTimer);
  }, [
    user,
    isLoadingUser,
    qnt,
    activeCircuit,
    completedPractices,
    practiceHistory,
    artifacts,
    unlockedAchievements,
    bioMetrics,
    sleepTracking,
    selectedLanguage,
    selectedLevel,
    selectedChapter,
    isLightTheme
  ]);

  useEffect(() => {
    setActiveCircuit(selectedLevel);
  }, [selectedLevel]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setShowLevelDropdown(false);
        setShowChapterDropdown(false);
      }
      if (!target.closest('.menu-container')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBioMetrics(prev => {
        const newHR = prev.heartRate + (Math.random() - 0.5) * 2;
        const variance = Math.abs(newHR - 72);
        const stability = Math.max(0, 100 - variance * 2);

        return {
          heartRate: newHR,
          hrv: prev.hrv + (Math.random() - 0.5) * 3,
          spo2: Math.min(100, prev.spo2 + (Math.random() - 0.3)),
          temp: prev.temp + (Math.random() - 0.5) * 0.1,
          stability
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkSleepPattern = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const todayKey = now.toDateString();

      if (sleepTracking.lastCheck !== todayKey) {
        if ((currentHour >= 22 && currentHour <= 23) || (currentHour >= 6 && currentHour <= 8)) {
          const isConsistent = bioMetrics.stability > 80 && bioMetrics.heartRate < 75;
          if (isConsistent) {
            setSleepTracking(prev => ({
              day: Math.min(7, prev.day + 1),
              lastCheck: todayKey
            }));
          }
        }
      }
    }, 60000);

    return () => clearInterval(checkSleepPattern);
  }, [sleepTracking.lastCheck, bioMetrics.stability, bioMetrics.heartRate]);

  useEffect(() => {
    if (practiceState === 'active' && !isPaused && activePractice) {
      const interval = setInterval(() => {
        setPracticeTime(prev => prev + 1);

        const targetTime = activePractice.targetTime;
        const currentTime = practiceTime + 1;
        const timeProgress = (currentTime / targetTime) * 100; // Can exceed 100% for no-tracker mode

        // Simulate gradual improvement during practice if no real sensors connected
        if (!vitalsData.connected) {
          setSimulatedVitals(prev => {
            const progressFactor = currentTime / targetTime;
            const maxStressReduction = initialVitals.stress * 0.03; // up to 3% stress reduction
            const maxEnergyIncrease = initialVitals.energy * 0.03; // up to 3% energy increase

            const newStress = Math.max(0, initialVitals.stress - (maxStressReduction * progressFactor) + (Math.random() - 0.5) * 0.5);
            const newEnergy = Math.min(100, initialVitals.energy + (maxEnergyIncrease * progressFactor) + (Math.random() - 0.5) * 0.5);

            return {
              stress: Math.round(newStress),
              energy: Math.round(newEnergy)
            };
          });
        }

        // Use vitalsRef for fresh values (like AdaptivePracticeModal)
        const freshVitals = vitalsRef.current;
        
        // Calculate performance based on improvement from initial vitals
        // Use REAL vitals data if available, otherwise use simulation
        const currentStress = freshVitals.hasVitalsData && freshVitals.stress !== null 
          ? freshVitals.stress 
          : simulatedVitals.stress;
        const currentEnergy = freshVitals.hasVitalsData && freshVitals.energy !== null 
          ? freshVitals.energy 
          : simulatedVitals.energy;

        // Track BEST metrics (lowest stress, highest energy) - so progress never drops
        setBestMetrics(prev => {
          const updated = {
            stress: Math.min(prev.stress, currentStress),
            energy: Math.max(prev.energy, currentEnergy)
          };
          console.log('Basic practice best metrics:', { previous: prev, current: { stress: currentStress, energy: currentEnergy }, updated, hasRealVitals: freshVitals.hasVitalsData });
          return updated;
        });

        // Stress reduction (10% = good, more is better)
        const stressReduction = initialVitals.stress - currentStress;
        const stressScore = Math.min(Math.max(stressReduction / (initialVitals.stress * 0.1), 0), 1) * 100;

        // Energy increase (10% = good, more is better)
        const energyIncrease = currentEnergy - initialVitals.energy;
        const energyScore = Math.min(Math.max(energyIncrease / (initialVitals.energy * 0.1), 0), 1) * 100;

        // Combined performance score (40% stress + 45% energy)
        const performanceScore = (stressScore * 0.40 + energyScore * 0.45);

        let rawQuality;
        if (freshVitals.hasVitalsData) {
          // WITH tracker: 15% time + 85% performance (capped at 100% time)
          if (currentTime >= targetTime) {
            rawQuality = 15 + (performanceScore * 0.85);
          } else {
            rawQuality = (timeProgress * 0.15 + performanceScore * 0.85);
          }
        } else {
          // WITHOUT tracker: pure time-based, linear growth
          // 20% quality per 100% time, so 100% quality = 500% time
          rawQuality = timeProgress * 0.2;
        }

        // Smooth quality changes
        const currentQuality = qualityScore;
        let newQuality;

        if (!freshVitals.hasVitalsData) {
          // Without tracker: direct linear growth, no smoothing
          newQuality = rawQuality;
        } else if (rawQuality > maxQualityRef.current) {
          // New peak - grow slowly (2x smoother)
          maxQualityRef.current = rawQuality;
          const diff = rawQuality - currentQuality;
          newQuality = currentQuality + (diff * 0.5);
        } else {
          // Below peak - stay at current value (don't drop)
          newQuality = Math.max(currentQuality, rawQuality);
        }

        setQualityScore(Math.min(100, newQuality));

        // Check if artifact requirements are met (real-time validation)
        const timePercent = currentTime / targetTime;
        const minQuality = freshVitals.hasVitalsData ? 70 : 33; // 70% with tracker, 33% without
        const meetsRequirements = timePercent >= 0.8 && newQuality >= minQuality;
        setMeetsArtifactRequirements(meetsRequirements);

        // Update guiding text every 15 seconds with 2s transition (cycling through all texts)
        if (activePractice.guidingTexts && activePractice.guidingTexts.length > 0) {
          const textInterval = 15;
          const newIndex = Math.floor(currentTime / textInterval) % activePractice.guidingTexts.length;

          if (newIndex !== currentGuidingTextIndex) {
            setIsTextTransitioning(true);
            setTimeout(() => {
              setCurrentGuidingTextIndex(newIndex);
              setTimeout(() => setIsTextTransitioning(false), 50);
            }, 1000);
          }
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [practiceState, isPaused, practiceTime, activePractice, vitalsData.connected, vitalsData.stress, vitalsData.energy, initialVitals, simulatedVitals, currentGuidingTextIndex]);

  const practiceSpaces = useMemo(() => ({
    'p1-1': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.breath_message'),
      ambientSound: t('elements.breath'),
      visual: '⭕',
      targetTime: 180,
      guidingTexts: t('guiding_texts.p1_1', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p1_1')
    },
    'p1-2': {
      colors: 'from-indigo-900 via-purple-800 to-pink-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.being_message'),
      ambientSound: t('elements.silence'),
      visual: '🌊',
      targetTime: 180,
      guidingTexts: t('guiding_texts.p1_2', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p1_2')
    },
    'p1-3': {
      colors: 'from-amber-900 via-orange-800 to-red-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.pulse_message'),
      ambientSound: t('elements.pulse'),
      visual: '💓',
      targetTime: 180,
      guidingTexts: t('guiding_texts.p1_3', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p1_3')
    },
    'p1-4': {
      colors: 'from-gray-900 via-slate-800 to-zinc-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.still_message'),
      ambientSound: t('elements.waves'),
      visual: '〰️',
      targetTime: 180,
      guidingTexts: t('guiding_texts.p1_4', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p1_4')
    },
    'p1-5': {
      colors: 'from-purple-900 via-violet-800 to-indigo-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.listening_message'),
      ambientSound: t('elements.inner_sounds'),
      visual: '⚪',
      targetTime: 180,
      guidingTexts: t('guiding_texts.p1_5', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p1_5')
    },
    'p1-6': {
      colors: 'from-yellow-900 via-amber-800 to-orange-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.light_message'),
      ambientSound: t('elements.glow'),
      visual: '☀️',
      targetTime: 180,
      guidingTexts: t('guiding_texts.p1_6', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p1_6')
    },
    'p1-7': {
      colors: 'from-cyan-900 via-blue-800 to-teal-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.liquid_message'),
      ambientSound: t('elements.waves'),
      visual: '💧',
      targetTime: 180,
      guidingTexts: t('guiding_texts.p1_7', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p1_7')
    },
    'p1-8': {
      colors: 'from-green-900 via-emerald-800 to-teal-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.count_message'),
      ambientSound: t('elements.count'),
      visual: '1️⃣',
      targetTime: 180,
      guidingTexts: t('guiding_texts.p1_8', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p1_8')
    },
    'p1-9': {
      colors: 'from-yellow-900 via-gold-800 to-amber-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.stillness_message'),
      ambientSound: t('elements.center'),
      visual: '🟡',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p1_9', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p1_9')
    },
    'p1-10': {
      colors: 'from-slate-900 via-gray-800 to-zinc-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.silence_message'),
      ambientSound: t('elements.silence'),
      visual: '⚫',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p1_10', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p1_10')
    },
    'p1-11': {
      colors: 'from-amber-900 via-yellow-800 to-orange-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.ground_message'),
      ambientSound: t('elements.earth_breathes'),
      visual: '🌳',
      targetTime: 720,
      guidingTexts: t('guiding_texts.p1_11', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p1_11')
    },
    'p1-12': {
      colors: 'from-green-900 via-emerald-800 to-teal-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.root_message'),
      ambientSound: t('elements.hz_40'),
      visual: '🪵',
      targetTime: 720,
      guidingTexts: t('guiding_texts.p1_12', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p1_12')
    },
    'p3-1': {
      colors: 'from-slate-900 via-blue-900 to-teal-900',
      element: 'TERRA',
      elementMessage: t('practice_messages.breath_of_transition_message'),
      ambientSound: t('elements.breath'),
      visual: '🌬️',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p3_1', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p3_1')
    },
    'p3-2': {
      colors: 'from-stone-900 via-slate-800 to-zinc-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.balance_point_message'),
      ambientSound: t('elements.center'),
      visual: '⚖️',
      targetTime: 480,
      guidingTexts: t('guiding_texts.p3_2', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p3_2')
    },
    'p3-3': {
      colors: 'from-amber-900 via-orange-800 to-stone-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.adaptive_flow_message'),
      ambientSound: t('elements.waves'),
      visual: '🧬',
      targetTime: 600,
      guidingTexts: t('guiding_texts.p3_3', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p3_3')
    },
    'p3-4': {
      colors: 'from-sky-900 via-stone-800 to-slate-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.ground_air_breath_message'),
      ambientSound: t('elements.breath'),
      visual: '🌬️',
      targetTime: 540,
      guidingTexts: t('guiding_texts.p3_4', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p3_4')
    },
    'p3-5': {
      colors: 'from-green-900 via-emerald-800 to-teal-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.step_of_stability_message'),
      ambientSound: t('elements.earth'),
      visual: '🪶',
      targetTime: 720,
      guidingTexts: t('guiding_texts.p3_5', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p3_5')
    },
    'p3-6': {
      colors: 'from-blue-900 via-teal-800 to-green-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.wave_of_breath_message'),
      ambientSound: t('elements.waves'),
      visual: '🌊',
      targetTime: 660,
      guidingTexts: t('guiding_texts.p3_6', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p3_6')
    },
    'p3-7': {
      colors: 'from-cyan-900 via-blue-800 to-green-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.breath_bridge_message'),
      ambientSound: t('elements.breath'),
      visual: '🌉',
      targetTime: 600,
      guidingTexts: t('guiding_texts.p3_7', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p3_7')
    },
    'p3-8': {
      colors: 'from-stone-900 via-amber-800 to-yellow-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.center_of_gravity_message'),
      ambientSound: t('elements.earth'),
      visual: '🎯',
      targetTime: 540,
      guidingTexts: t('guiding_texts.p3_8', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p3_8')
    },
    'p3-9': {
      colors: 'from-emerald-900 via-teal-800 to-cyan-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.shape_shift_message'),
      ambientSound: t('elements.earth'),
      visual: '🌀',
      targetTime: 660,
      guidingTexts: t('guiding_texts.p3_9', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p3_9')
    },
    'p3-10': {
      colors: 'from-slate-900 via-gray-800 to-stone-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.resonant_stillness_message'),
      ambientSound: t('elements.silence'),
      visual: '🪷',
      targetTime: 720,
      guidingTexts: t('guiding_texts.p3_10', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p3_10')
    },
    'p3-11': {
      colors: 'from-amber-900 via-orange-800 to-red-900',
      element: 'TERRA',
      elementMessage: t('practice_messages.pulse_of_earth_message'),
      ambientSound: t('elements.earth'),
      visual: '🌍',
      targetTime: 600,
      guidingTexts: t('guiding_texts.p3_11', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p3_11')
    },
    'p3-12': {
      colors: 'from-indigo-900 via-purple-800 to-violet-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.breath_of_adaptation_message'),
      ambientSound: t('elements.earth'),
      visual: '🌗',
      targetTime: 660,
      guidingTexts: t('guiding_texts.p3_12', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p3_12')
    },
    'p2-1': {
      colors: 'from-cyan-900 via-blue-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.flow_rhythm_message'),
      ambientSound: t('elements.waves'),
      visual: '🌊',
      targetTime: 1800,
      guidingTexts: t('guiding_texts.p2_1', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p2_1')
    },
    'p2-2': {
      colors: 'from-amber-900 via-yellow-800 to-orange-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.directional_sense_message'),
      ambientSound: t('elements.waves'),
      visual: '🧭',
      targetTime: 900,
      guidingTexts: t('guiding_texts.p2_2', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p2_2')
    },
    'p2-3': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.rhythm_movement_message'),
      ambientSound: t('elements.waves'),
      visual: '🎼',
      targetTime: 900,
      guidingTexts: t('guiding_texts.p2_3', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p2_3')
    },
    'p2-4': {
      colors: 'from-cyan-900 via-teal-800 to-blue-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.water_balance_message'),
      ambientSound: t('elements.waves'),
      visual: '🌊',
      targetTime: 1200,
      guidingTexts: t('guiding_texts.p2_4', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p2_4')
    },
    'p2-5': {
      colors: 'from-blue-900 via-indigo-800 to-cyan-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.fluid_motion_message'),
      ambientSound: t('elements.waves'),
      visual: '🫧',
      targetTime: 600,
      guidingTexts: t('guiding_texts.p2_5', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p2_5')
    },
    'p2-6': {
      colors: 'from-cyan-900 via-blue-800 to-teal-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.wave_breath_message'),
      ambientSound: t('elements.waves'),
      visual: '🌊',
      targetTime: 900,
      guidingTexts: t('guiding_texts.p2_6', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p2_6')
    },
    'p2-7': {
      colors: 'from-teal-900 via-cyan-800 to-blue-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.sense_of_flow_message'),
      ambientSound: t('elements.waves'),
      visual: '🌫️',
      targetTime: 720,
      guidingTexts: t('guiding_texts.p2_7', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p2_7')
    },
    'p2-8': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.flow_focus_message'),
      ambientSound: t('elements.waves'),
      visual: '🎯',
      targetTime: 660,
      guidingTexts: t('guiding_texts.p2_8', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p2_8')
    },
    'p2-9': {
      colors: 'from-cyan-900 via-teal-800 to-blue-700',
      element: 'TERRA',
      elementMessage: t('practice_messages.flow_adapt_message'),
      ambientSound: t('elements.waves'),
      visual: '🔀',
      targetTime: 720,
      guidingTexts: t('guiding_texts.p2_9', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p2_9')
    },
    'p2-10': {
      colors: 'from-blue-950 via-slate-800 to-cyan-900',
      element: 'TERRA',
      elementMessage: t('practice_messages.still_water_message'),
      ambientSound: t('elements.waves'),
      visual: '🫖',
      targetTime: 600,
      guidingTexts: t('guiding_texts.p2_10', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p2_10')
    },
    'p2-11': {
      colors: 'from-indigo-950 via-blue-900 to-cyan-800',
      element: 'TERRA',
      elementMessage: t('practice_messages.deep_current_message'),
      ambientSound: t('elements.waves'),
      visual: '🌊',
      targetTime: 780,
      guidingTexts: t('guiding_texts.p2_11', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p2_11')
    },
    'p2-12': {
      colors: 'from-cyan-950 via-blue-900 to-indigo-800',
      element: 'TERRA',
      elementMessage: t('practice_messages.echo_ocean_message'),
      ambientSound: t('elements.waves'),
      visual: '🌊',
      targetTime: 660,
      guidingTexts: t('guiding_texts.p2_12', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p2_12')
    },
    'p4-1': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.soft_gaze_message'),
      ambientSound: t('elements.silence'),
      visual: '😌',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p4_1', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p4_1'),
      scienceInfo: t('science_info.p4_1', { returnObjects: true }) as string[]
    },
    'p4-2': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.orienting_inhale_message'),
      ambientSound: t('elements.breath'),
      visual: '👃',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p4_2', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p4_2'),
      scienceInfo: t('science_info.p4_2', { returnObjects: true }) as string[]
    }
  }), [i18n.language]);

  const circuits = useMemo(() => [
    {
      id: 1,
      name: t('circuits.circuit_1_name'),
      subtitle: t('circuits.circuit_1_subtitle'),
      element: 'TERRA',
      color: 'from-amber-900 to-yellow-800',
      icon: Droplets,
      practices: [
        { id: 'p1-1', name: t('practice_items.micro_breath'), duration: t('practice_items.duration_3min'), maxQnt: 10, desc: t('practice_items.micro_breath_desc') },
        { id: 'p1-2', name: t('practice_items.sense_of_being'), duration: t('practice_items.duration_3min'), maxQnt: 10, desc: t('practice_items.sense_of_being_desc') },
        { id: 'p1-3', name: t('practice_items.warm_pulse'), duration: t('practice_items.duration_3min'), maxQnt: 15, desc: t('practice_items.warm_pulse_desc') },
        { id: 'p1-4', name: t('practice_items.still_wave'), duration: t('practice_items.duration_3min'), maxQnt: 10, desc: t('practice_items.still_wave_desc') },
        { id: 'p1-5', name: t('practice_items.inner_listening'), duration: t('practice_items.duration_3min'), maxQnt: 20, desc: t('practice_items.inner_listening_desc') },
        { id: 'p1-6', name: t('practice_items.first_light'), duration: t('practice_items.duration_3min'), maxQnt: 15, desc: t('practice_items.first_light_desc') },
        { id: 'p1-7', name: t('practice_items.liquid_presence'), duration: t('practice_items.duration_3min'), maxQnt: 20, desc: t('practice_items.liquid_presence_desc') },
        { id: 'p1-8', name: t('practice_items.breath_count'), duration: t('practice_items.duration_3min'), maxQnt: 20, desc: t('practice_items.breath_count_desc') },
        { id: 'p1-9', name: t('practice_items.point_of_stillness'), duration: t('practice_items.duration_6min'), maxQnt: 15, desc: t('practice_items.point_of_stillness_desc') },
        { id: 'p1-10', name: t('practice_items.i_am_silence'), duration: t('practice_items.duration_6min'), maxQnt: 20, desc: t('practice_items.i_am_silence_desc') },
        { id: 'p1-11', name: t('practice_items.ground_flow'), duration: t('practice_items.duration_12min'), maxQnt: 30, desc: t('practice_items.ground_flow_desc') },
        { id: 'p1-12', name: t('practice_items.body_root'), duration: t('practice_items.duration_12min'), maxQnt: 20, desc: t('practice_items.body_root_desc') }
      ],
      artifact: {
        name: t('artifacts.roots_of_being'),
        bonus: 20,
        requirement: t('artifacts.requirement_part', { part: 1 })
      }
    },
    {
      id: 2,
      name: t('circuits.circuit_2_name'),
      subtitle: t('circuits.circuit_2_subtitle'),
      element: 'AQUA',
      color: 'from-cyan-900 to-blue-800',
      icon: Wind,
      practices: [
        { id: 'p2-1', name: t('practice_items.flow_rhythm'), duration: t('practice_items.duration_30min'), maxQnt: 80, desc: t('practice_items.flow_rhythm_desc') },
        { id: 'p2-2', name: t('practice_items.directional_sense'), duration: t('practice_items.duration_15min'), maxQnt: 60, desc: t('practice_items.directional_sense_desc') },
        { id: 'p2-3', name: t('practice_items.rhythm_movement'), duration: t('practice_items.duration_15min'), maxQnt: 65, desc: t('practice_items.rhythm_movement_desc') },
        { id: 'p2-4', name: t('practice_items.water_balance'), duration: t('practice_items.duration_20min'), maxQnt: 70, desc: t('practice_items.water_balance_desc') },
        { id: 'p2-5', name: t('practice_items.fluid_motion'), duration: t('practice_items.duration_10min'), maxQnt: 55, desc: t('practice_items.fluid_motion_desc') },
        { id: 'p2-6', name: t('practice_items.wave_breath'), duration: t('practice_items.duration_15min'), maxQnt: 60, desc: t('practice_items.wave_breath_desc') },
        { id: 'p2-7', name: t('practice_items.sense_of_flow'), duration: t('practice_items.duration_12min'), maxQnt: 65, desc: t('practice_items.sense_of_flow_desc') },
        { id: 'p2-8', name: t('practice_items.flow_focus'), duration: t('practice_items.duration_11min'), maxQnt: 60, desc: t('practice_items.flow_focus_desc') },
        { id: 'p2-9', name: t('practice_items.flow_adapt'), duration: t('practice_items.duration_12min'), maxQnt: 70, desc: t('practice_items.flow_adapt_desc') },
        { id: 'p2-10', name: t('practice_items.still_water'), duration: t('practice_items.duration_10min'), maxQnt: 55, desc: t('practice_items.still_water_desc') },
        { id: 'p2-11', name: t('practice_items.deep_current'), duration: t('practice_items.duration_12min'), maxQnt: 75, desc: t('practice_items.deep_current_desc') },
        { id: 'p2-12', name: t('practice_items.echo_ocean'), duration: t('practice_items.duration_11min'), maxQnt: 60, desc: t('practice_items.echo_ocean_desc') }
      ],
      artifact: {
        name: t('artifacts.pearl_of_flow'),
        bonus: 35,
        requirement: t('artifacts.requirement_part', { part: 2 })
      }
    },
    {
      id: 3,
      name: t('circuits.circuit_3_name'),
      subtitle: t('circuits.circuit_3_subtitle'),
      element: 'TERRA',
      color: 'from-green-900 to-emerald-800',
      icon: Mountain,
      practices: [
        { id: 'p3-1', name: t('practice_items.breath_of_transition'), duration: t('practice_items.duration_6min'), maxQnt: 90, desc: t('practice_items.breath_of_transition_desc') },
        { id: 'p3-2', name: t('practice_items.balance_point'), duration: t('practice_items.duration_8min'), maxQnt: 75, desc: t('practice_items.balance_point_desc') },
        { id: 'p3-3', name: t('practice_items.adaptive_flow'), duration: t('practice_items.duration_10min'), maxQnt: 60, desc: t('practice_items.adaptive_flow_desc') },
        { id: 'p3-4', name: t('practice_items.ground_air_breath'), duration: t('practice_items.duration_9min'), maxQnt: 65, desc: t('practice_items.ground_air_breath_desc') },
        { id: 'p3-5', name: t('practice_items.step_of_stability'), duration: t('practice_items.duration_12min'), maxQnt: 85, desc: t('practice_items.step_of_stability_desc') },
        { id: 'p3-6', name: t('practice_items.wave_of_breath'), duration: t('practice_items.duration_11min'), maxQnt: 70, desc: t('practice_items.wave_of_breath_desc') },
        { id: 'p3-7', name: t('practice_items.breath_bridge'), duration: t('practice_items.duration_10min'), maxQnt: 75, desc: t('practice_items.breath_bridge_desc') },
        { id: 'p3-8', name: t('practice_items.center_of_gravity'), duration: t('practice_items.duration_9min'), maxQnt: 80, desc: t('practice_items.center_of_gravity_desc') },
        { id: 'p3-9', name: t('practice_items.shape_shift'), duration: t('practice_items.duration_11min'), maxQnt: 65, desc: t('practice_items.shape_shift_desc') },
        { id: 'p3-10', name: t('practice_items.resonant_stillness'), duration: t('practice_items.duration_12min'), maxQnt: 70, desc: t('practice_items.resonant_stillness_desc') },
        { id: 'p3-11', name: t('practice_items.pulse_of_earth'), duration: t('practice_items.duration_10min'), maxQnt: 75, desc: t('practice_items.pulse_of_earth_desc') },
        { id: 'p3-12', name: t('practice_items.breath_of_adaptation'), duration: t('practice_items.duration_11min'), maxQnt: 80, desc: t('practice_items.breath_of_adaptation_desc') }
      ],
      artifact: {
        name: t('artifacts.crystal_of_grounding'),
        bonus: 50,
        requirement: t('artifacts.requirement_part', { part: 3 })
      }
    },
    {
      id: 4,
      name: t('circuits.circuit_4_name'),
      subtitle: t('circuits.circuit_4_subtitle'),
      element: 'AQUA',
      color: 'from-blue-900 to-cyan-800',
      icon: Waves,
      practices: [
        { id: 'p4-1', name: t('practice_items.soft_gaze'), duration: t('practice_items.duration_6min'), maxQnt: 50, desc: t('practice_items.soft_gaze_desc') },
        { id: 'p4-2', name: t('practice_items.orienting_inhale'), duration: t('practice_items.duration_6min'), maxQnt: 55, desc: t('practice_items.orienting_inhale_desc') }
      ],
      artifact: {
        name: t('artifacts.listen_heart'),
        bonus: 20,
        requirement: t('artifacts.requirement_part', { part: 4 })
      }
    }
  ], [i18n.language]);

  const calculateBonus = () => {
    return artifacts.reduce((sum, a) => sum + a.bonus, 0);
  };

  const completePractice = (practiceId, baseQnt) => {
    const space = practiceSpaces[practiceId];
    if (space) {
      setActivePractice({ ...space, id: practiceId, maxQnt: baseQnt });
      setPracticeState('intro');
      setPracticeTime(0);
      setQualityScore(0);
      setIsPaused(false);

      // Track practice view
      trackPractice('view', practiceId, {
        practice_name: space.name,
        target_duration: space.duration,
        base_ond: baseQnt,
      });

      // Scroll to practice after a short delay
      setTimeout(() => {
        practiceRefs.current[practiceId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      const bonus = calculateBonus();
      const earnedQnt = Math.floor(baseQnt * (1 + bonus / 100));
      
      setQnt(prev => prev + earnedQnt);
      setCompletedPractices(prev => ({
        ...prev,
        [practiceId]: true
      }));

      const circuit = circuits.find(c => c.practices.some(p => p.id === practiceId));
      const allCompleted = circuit.practices.every(p => completedPractices[p.id] || p.id === practiceId);
      
      if (allCompleted && !artifacts.some(a => a.circuitId === circuit.id)) {
        setTimeout(() => {
          setArtifacts(prev => [...prev, {
            circuitId: circuit.id,
            bonus: circuit.artifact.bonus
          }]);
        }, 500);
      }
    }
  };

  const beginPractice = () => {
    // Use vitalsRef for FRESH values (like AdaptivePracticeModal)
    const freshVitals = vitalsRef.current;
    const hasRealMetrics = freshVitals.hasVitalsData;
    const initialStress = hasRealMetrics && freshVitals.stress !== null ? freshVitals.stress : 50;
    const initialEnergy = hasRealMetrics && freshVitals.energy !== null ? freshVitals.energy : 50;

    // Track practice start
    if (activePractice) {
      trackPractice('start', activePractice.id, {
        practice_name: activePractice.name,
        target_duration: activePractice.duration,
        has_biometrics: hasRealMetrics,
        initial_stress: initialStress,
        initial_energy: initialEnergy,
      });
    }

    console.log('Starting basic practice with initial metrics:', { 
      hasRealMetrics, 
      initialStress, 
      initialEnergy, 
      hrSource: freshVitals.hrSource,
      stressReady: freshVitals.stressReady,
      energyReady: freshVitals.energyReady
    });

    setInitialVitals({
      stress: initialStress,
      energy: initialEnergy
    });
    setSimulatedVitals({
      stress: initialStress,
      energy: initialEnergy
    });
    setBestMetrics({
      stress: initialStress,
      energy: initialEnergy
    });
    maxQualityRef.current = 0;
    setMeetsArtifactRequirements(false); // Reset artifact validation
    setPracticeState('active');
    setCurrentGuidingTextIndex(0);
    setIsTextTransitioning(false);
    setAudioResetKey(prev => prev + 1);
  };

  const finishPractice = async () => {
    const bonus = calculateBonus();
    const baseEarned = Math.floor((activePractice.maxQnt * qualityScore) / 100);
    const earnedQnt = Math.floor(baseEarned * (1 + bonus / 100));

    const existingPractice = completedPractices[activePractice.id];
    const shouldUpdate = !existingPractice || qualityScore > existingPractice.quality;

    // Use vitalsRef for fresh values
    const freshVitalsForSession = vitalsRef.current;

    // Calculate isValidForArtifact at finish time
    const timePercent = practiceTime / (activePractice.targetTime || 720);
    const hasRealMetricsAtFinish = freshVitalsForSession.hasVitalsData;
    const minQualityRequired = hasRealMetricsAtFinish ? 70 : 33;
    const isValidForArtifact = timePercent >= 0.8 && qualityScore >= minQualityRequired;

    // Track practice completion
    trackPractice('complete', activePractice.id, {
      practice_name: activePractice.name,
      duration_seconds: practiceTime,
      target_duration: activePractice.targetTime || 720,
      quality_score: qualityScore,
      ond_earned: earnedQnt,
      has_biometrics: hasRealMetricsAtFinish,
      is_valid_for_artifact: isValidForArtifact,
      is_new_record: shouldUpdate && !!existingPractice,
      final_stress: freshVitalsForSession.stress,
      final_energy: freshVitalsForSession.energy,
    });

    const session = {
      id: Date.now(),
      practiceId: activePractice.id,
      practiceName: circuits.flatMap(c => c.practices).find(p => p.id === activePractice.id)?.name,
      date: new Date().toISOString(),
      duration: practiceTime,
      quality: qualityScore,
      qnt: earnedQnt,
      stress: freshVitalsForSession.stress,
      energy: freshVitalsForSession.energy,
      isNewRecord: shouldUpdate && existingPractice
    };

    setPracticeHistory(prev => [session, ...prev]);

    if (shouldUpdate) {
      const qntDiff = existingPractice ? earnedQnt - existingPractice.qnt : earnedQnt;
      setQnt(prev => prev + qntDiff);

      setCompletedPractices(prev => ({
        ...prev,
        [activePractice.id]: {
          quality: qualityScore,
          qnt: earnedQnt,
          sessions: [...(prev[activePractice.id]?.sessions || []), session.id],
          // Keep validated status if already validated, or set new validation result
          isValidForArtifact: prev[activePractice.id]?.isValidForArtifact || isValidForArtifact
        }
      }));

      if (user) {
        try {
          // Use vitalsRef.current for FRESH values (not stale closure) - like AdaptivePracticeModal
          const freshVitals = vitalsRef.current;
          const currentStress = freshVitals.hasVitalsData && freshVitals.stress !== null 
            ? freshVitals.stress 
            : simulatedVitals.stress;
          const currentEnergy = freshVitals.hasVitalsData && freshVitals.energy !== null 
            ? freshVitals.energy 
            : simulatedVitals.energy;

          // Use BEST metrics for OND calculation (lowest stress, highest energy achieved)
          // This ensures users don't lose progress if metrics temporarily worsen
          const finalStress = Math.min(bestMetrics.stress, currentStress);
          const finalEnergy = Math.max(bestMetrics.energy, currentEnergy);

          // hasRealMetrics = TRUE only if BOTH initial and final used real data
          const hasRealMetrics = freshVitals.hasVitalsData && initialVitals.stress !== 50;

          console.log('Basic practice completion metrics:', {
            hasRealMetrics,
            hrSource: freshVitals.hrSource,
            usingSimulation: !freshVitals.hasVitalsData,
            initialStress: initialVitals.stress,
            currentStress,
            bestStress: bestMetrics.stress,
            finalStress,
            initialEnergy: initialVitals.energy,
            currentEnergy,
            bestEnergy: bestMetrics.energy,
            finalEnergy,
            practiceTime,
            targetTime: activePractice.targetTime || 720
          });

          const ondReward = calculatePracticeOnd({
            actualDurationSeconds: practiceTime,
            expectedDurationSeconds: activePractice.targetTime || 720,
            stressBefore: initialVitals.stress,
            stressAfter: finalStress, // Best (lowest) stress achieved
            energyBefore: initialVitals.energy,
            energyAfter: finalEnergy, // Best (highest) energy achieved
            baseOndReward: activePractice.maxQnt,
            hasRealMetrics
          });

          // Apply artifact bonuses to OND
          const artifactBonus = calculateBonus();
          const bonusMultiplier = 1 + artifactBonus / 100;
          const totalOndWithBonus = Math.round(ondReward.totalOnd * bonusMultiplier * 100) / 100;

          console.log('OND reward calculation:', {
            ...ondReward,
            artifactBonus,
            bonusMultiplier,
            totalOndWithBonus
          });

          const { error: rewardError } = await supabase.from('practice_rewards').insert({
            user_id: user.id,
            practice_id: activePractice.id,
            practice_duration_seconds: practiceTime,
            expected_duration_seconds: activePractice.targetTime || 720,
            stress_before: initialVitals.stress,
            stress_after: finalStress, // Best (lowest) stress achieved
            energy_before: initialVitals.energy,
            energy_after: finalEnergy, // Best (highest) energy achieved
            completion_ond: ondReward.completionOnd,
            performance_ond: ondReward.performanceOnd,
            total_ond_earned: totalOndWithBonus // With artifact bonuses applied
          });
          if (rewardError) {
            console.error('Error inserting practice_rewards:', rewardError.message, rewardError.details, rewardError.hint);
          }
          // OND сохраняется автоматически в user_game_progress через saveGameProgress effect
        } catch (error) {
          console.error('Error saving practice reward:', error);
        }
      }
    } else {
      // Even if quality didn't improve, we might have validated the practice this time
      setCompletedPractices(prev => ({
        ...prev,
        [activePractice.id]: {
          ...prev[activePractice.id],
          sessions: [...(prev[activePractice.id]?.sessions || []), session.id],
          // Keep validated status if already validated, or set new validation result
          isValidForArtifact: prev[activePractice.id]?.isValidForArtifact || isValidForArtifact
        }
      }));
    }

    setPracticeState('complete');

    const circuit = circuits.find(c => c.practices.some(p => p.id === activePractice.id));
    
    // For artifact: ALL practices must be validated (isValidForArtifact = true)
    const allValidated = circuit.practices.every(p => {
      if (p.id === activePractice.id) {
        // Current practice - use just calculated value
        return isValidForArtifact || completedPractices[p.id]?.isValidForArtifact;
      }
      // Other practices - check stored validation
      return completedPractices[p.id]?.isValidForArtifact;
    });

    if (allValidated && !artifacts.some(a => a.circuitId === circuit.id)) {
      setTimeout(() => {
        setArtifacts(prev => [...prev, {
          ...circuit.artifact,
          circuitId: circuit.id
        }]);
      }, 1000);
    }
  };

  const exitPractice = async () => {
    const practiceId = activePractice?.id;
    const practiceName = circuits.flatMap(c => c.practices).find(p => p.id === activePractice?.id)?.name || '';
    
    // Save rating if user rated the practice
    if (practiceRating > 0 && user && practiceTime > 0) {
      try {
        await supabase.from('practice_ratings').insert({
          user_id: user.id,
          practice_id: practiceId,
          practice_name: practiceName,
          rating: practiceRating,
          duration_seconds: practiceTime
        });
        console.log('Practice rating saved:', { practiceId, rating: practiceRating, duration: practiceTime });
      } catch (error) {
        console.error('Error saving practice rating:', error);
      }
    }
    
    setActivePractice(null);
    setPracticeState('intro');
    setPracticeTime(0);
    setQualityScore(0);
    setPracticeRating(0);
    setIsPaused(false);
    setCurrentGuidingTextIndex(0);
    setIsTextTransitioning(false);
    setCurrentTrack(1);

    // Scroll to practice after exit
    if (practiceId) {
      setTimeout(() => {
        practiceRefs.current[practiceId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPracticeName = (practiceId: string) => {
    const mapping = {
      'p1-1': 'practice_items.micro_breath',
      'p1-2': 'practice_items.sense_of_being',
      'p1-3': 'practice_items.warm_pulse',
      'p1-4': 'practice_items.still_wave',
      'p1-5': 'practice_items.inner_listening',
      'p1-6': 'practice_items.first_light',
      'p1-7': 'practice_items.liquid_presence',
      'p1-8': 'practice_items.breath_count',
      'p1-9': 'practice_items.point_of_stillness',
      'p1-10': 'practice_items.i_am_silence',
      'p1-11': 'practice_items.ground_flow',
      'p1-12': 'practice_items.body_root',
      'p2-1': 'practice_items.flow_rhythm',
      'p2-2': 'practice_items.directional_sense',
      'p2-3': 'practice_items.rhythm_movement',
      'p2-4': 'practice_items.water_balance',
      'p2-5': 'practice_items.fluid_motion',
      'p2-6': 'practice_items.wave_breath',
      'p2-7': 'practice_items.sense_of_flow',
      'p2-8': 'practice_items.flow_focus',
      'p2-9': 'practice_items.flow_adapt',
      'p2-10': 'practice_items.still_water',
      'p2-11': 'practice_items.deep_current',
      'p2-12': 'practice_items.echo_ocean',
      'p3-1': 'practice_items.breath_of_transition',
      'p3-2': 'practice_items.balance_point',
      'p3-3': 'practice_items.adaptive_flow',
      'p3-4': 'practice_items.ground_air_breath',
      'p3-5': 'practice_items.step_of_stability',
      'p3-6': 'practice_items.wave_of_breath',
      'p3-7': 'practice_items.breath_bridge',
      'p3-8': 'practice_items.center_of_gravity',
      'p3-9': 'practice_items.shape_shift',
      'p3-10': 'practice_items.resonant_stillness',
      'p3-11': 'practice_items.pulse_of_earth',
      'p3-12': 'practice_items.breath_of_adaptation',
      'p4-1': 'practice_items.soft_gaze',
      'p4-2': 'practice_items.orienting_inhale'
    };
    return t(mapping[practiceId] || practiceId);
  };

  const getPracticeDesc = (practiceId: string) => {
    const mapping = {
      'p1-1': 'practice_items.micro_breath_desc',
      'p1-2': 'practice_items.sense_of_being_desc',
      'p1-3': 'practice_items.warm_pulse_desc',
      'p1-4': 'practice_items.still_wave_desc',
      'p1-5': 'practice_items.inner_listening_desc',
      'p1-6': 'practice_items.first_light_desc',
      'p1-7': 'practice_items.liquid_presence_desc',
      'p1-8': 'practice_items.breath_count_desc',
      'p1-9': 'practice_items.point_of_stillness_desc',
      'p1-10': 'practice_items.i_am_silence_desc',
      'p1-11': 'practice_items.ground_flow_desc',
      'p1-12': 'practice_items.body_root_desc',
      'p2-1': 'practice_items.flow_rhythm_desc',
      'p2-2': 'practice_items.directional_sense_desc',
      'p2-3': 'practice_items.rhythm_movement_desc',
      'p2-4': 'practice_items.water_balance_desc',
      'p2-5': 'practice_items.fluid_motion_desc',
      'p2-6': 'practice_items.wave_breath_desc',
      'p2-7': 'practice_items.sense_of_flow_desc',
      'p3-1': 'practice_items.breath_of_transition_desc',
      'p3-2': 'practice_items.balance_point_desc',
      'p3-3': 'practice_items.adaptive_flow_desc',
      'p3-4': 'practice_items.ground_air_breath_desc',
      'p3-5': 'practice_items.step_of_stability_desc',
      'p3-6': 'practice_items.wave_of_breath_desc',
      'p3-7': 'practice_items.breath_bridge_desc',
      'p3-8': 'practice_items.center_of_gravity_desc',
      'p3-9': 'practice_items.shape_shift_desc',
      'p3-10': 'practice_items.resonant_stillness_desc',
      'p3-11': 'practice_items.pulse_of_earth_desc',
      'p3-12': 'practice_items.breath_of_adaptation_desc',
      'p2-8': 'practice_items.flow_focus_desc',
      'p2-9': 'practice_items.flow_adapt_desc',
      'p2-10': 'practice_items.still_water_desc',
      'p2-11': 'practice_items.deep_current_desc',
      'p2-12': 'practice_items.echo_ocean_desc',
      'p4-1': 'practice_items.soft_gaze_desc',
      'p4-2': 'practice_items.orienting_inhale_desc'
    };
    return t(mapping[practiceId] || practiceId);
  };

  const getPracticeMessage = (practiceId: string) => {
    const mapping = {
      'p1-1': 'practice_messages.breath_message',
      'p1-2': 'practice_messages.being_message',
      'p1-3': 'practice_messages.pulse_message',
      'p1-4': 'practice_messages.still_message',
      'p1-5': 'practice_messages.listening_message',
      'p1-6': 'practice_messages.light_message',
      'p1-7': 'practice_messages.liquid_message',
      'p1-8': 'practice_messages.count_message',
      'p1-9': 'practice_messages.stillness_message',
      'p1-10': 'practice_messages.silence_message',
      'p1-11': 'practice_messages.ground_message',
      'p1-12': 'practice_messages.root_message',
      'p2-1': 'practice_messages.flow_rhythm_message',
      'p2-2': 'practice_messages.directional_sense_message',
      'p2-3': 'practice_messages.rhythm_movement_message',
      'p2-4': 'practice_messages.water_balance_message',
      'p2-5': 'practice_messages.fluid_motion_message',
      'p2-6': 'practice_messages.wave_breath_message',
      'p2-7': 'practice_messages.sense_of_flow_message',
      'p3-1': 'practice_messages.breath_of_transition_message',
      'p3-2': 'practice_messages.balance_point_message',
      'p3-3': 'practice_messages.adaptive_flow_message',
      'p3-4': 'practice_messages.ground_air_breath_message',
      'p3-5': 'practice_messages.step_of_stability_message',
      'p3-6': 'practice_messages.wave_of_breath_message',
      'p3-7': 'practice_messages.breath_bridge_message',
      'p3-8': 'practice_messages.center_of_gravity_message',
      'p3-9': 'practice_messages.shape_shift_message',
      'p3-10': 'practice_messages.resonant_stillness_message',
      'p3-11': 'practice_messages.pulse_of_earth_message',
      'p3-12': 'practice_messages.breath_of_adaptation_message',
      'p2-8': 'practice_messages.flow_focus_message',
      'p2-9': 'practice_messages.flow_adapt_message',
      'p2-10': 'practice_messages.still_water_message',
      'p2-11': 'practice_messages.deep_current_message',
      'p2-12': 'practice_messages.echo_ocean_message',
      'p4-1': 'practice_messages.soft_gaze_message',
      'p4-2': 'practice_messages.orienting_inhale_message'
    };
    return t(mapping[practiceId] || '');
  };

  const getAmbientSound = (practiceId: string) => {
    const mapping = {
      'p1-1': 'elements.breath',
      'p1-2': 'elements.silence',
      'p1-3': 'elements.pulse',
      'p1-4': 'elements.hz_1',
      'p1-5': 'elements.inner_sounds',
      'p1-6': 'elements.glow',
      'p1-7': 'elements.waves',
      'p1-8': 'elements.count',
      'p1-9': 'elements.center',
      'p1-10': 'elements.silence',
      'p1-11': 'elements.earth_breathes',
      'p1-12': 'elements.hz_40'
    };
    return t(mapping[practiceId] || '');
  };

  const getAchievementName = (achievementId: string) => {
    const mapping = {
      'first_step': 'achievements.first_step',
      'perfectionist': 'achievements.perfectionist',
      'streak_3': 'achievements.streak_3',
      'circuit_1': 'achievements.conqueror',
      'marathoner': 'achievements.marathoner',
      'quality_master': 'achievements.quality_master',
      'time_master': 'achievements.meditation_master',
      'collector': 'achievements.collector',
      'early_bird': 'achievements.early_bird',
      'night_owl': 'achievements.night_guard',
      'stability_master': 'achievements.crystal_stability',
      'all_circuits': 'achievements.evolution_master'
    };
    return t(mapping[achievementId] || achievementId);
  };

  const getAchievementDesc = (achievementId: string) => {
    const mapping = {
      'first_step': 'achievements.first_step_desc',
      'perfectionist': 'achievements.perfectionist_desc',
      'streak_3': 'achievements.streak_3_desc',
      'circuit_1': 'achievements.conqueror_desc',
      'marathoner': 'achievements.marathoner_desc',
      'quality_master': 'achievements.quality_master_desc',
      'time_master': 'achievements.meditation_master_desc',
      'collector': 'achievements.collector_desc',
      'early_bird': 'achievements.early_bird_desc',
      'night_owl': 'achievements.night_guard_desc',
      'stability_master': 'achievements.crystal_stability_desc',
      'all_circuits': 'achievements.evolution_master_desc'
    };
    return t(mapping[achievementId] || achievementId);
  };

  const getPlayerRank = () => {
    const totalPractices = practiceHistory.length;
    const totalHours = getTotalTime() / 3600;

    if (totalPractices >= 200 || totalHours >= 100) return { name: t('ranks.guru'), color: 'from-purple-500 to-pink-500', icon: '🌟' };
    if (totalPractices >= 100 || totalHours >= 50) return { name: t('ranks.master'), color: 'from-blue-500 to-cyan-500', icon: '💎' };
    if (totalPractices >= 50 || totalHours >= 25) return { name: t('ranks.practitioner'), color: 'from-green-500 to-emerald-500', icon: '⚡' };
    if (totalPractices >= 20 || totalHours >= 10) return { name: t('ranks.student'), color: 'from-yellow-500 to-orange-500', icon: '🔥' };
    return { name: t('ranks.novice'), color: 'from-gray-500 to-gray-400', icon: '🌱' };
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return t('time.just_now');
    if (diffMins < 60) return `${diffMins} ${t('time.min_ago')}`;
    if (diffHours < 24) return `${diffHours} ${t('time.hours_ago')}`;
    if (diffDays === 1) return t('time.yesterday');
    if (diffDays < 7) return `${diffDays} ${t('time.days_ago')}`;

    return date.toLocaleDateString(i18n.language === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short' });
  };

  const getPracticeSessions = (practiceId) => {
    return practiceHistory.filter(s => s.practiceId === practiceId);
  };

  const achievements = [
    {
      id: 'first_step',
      name: t('achievements.first_step.name'),
      desc: t('achievements.first_step.desc'),
      icon: '🌱',
      check: () => practiceHistory.length >= 1
    },
    {
      id: 'perfectionist',
      name: t('achievements.perfectionist.name'),
      desc: t('achievements.perfectionist.desc'),
      icon: '💯',
      check: () => practiceHistory.some(s => s.quality >= 100),
      progress: () => {
        const best = practiceHistory.length > 0
          ? Math.max(0, ...practiceHistory.map(s => s.quality || 0))
          : 0;
        return { current: best, total: 100 };
      }
    },
    {
      id: 'streak_3',
      name: t('achievements.streak_3.name'),
      desc: t('achievements.streak_3.desc'),
      icon: '🔥',
      check: () => getStreak() >= 3,
      progress: () => ({ current: Math.min(getStreak(), 3), total: 3 })
    },
    {
      id: 'circuit_1',
      name: t('achievements.circuit_1.name'),
      desc: t('achievements.circuit_1.desc'),
      icon: '🌊',
      check: () => circuits[0].practices.every(p => completedPractices[p.id])
    },
    {
      id: 'marathoner',
      name: t('achievements.marathoner.name'),
      desc: t('achievements.marathoner.desc'),
      icon: '⚡',
      check: () => practiceHistory.length >= 50,
      progress: () => ({ current: practiceHistory.length, total: 50 })
    },
    {
      id: 'quality_master',
      name: t('achievements.quality_master.name'),
      desc: t('achievements.quality_master.desc'),
      icon: '🎯',
      check: () => practiceHistory.filter(s => s.quality > 90).length >= 10,
      progress: () => ({
        current: practiceHistory.filter(s => s.quality > 90).length,
        total: 10
      })
    },
    {
      id: 'time_master',
      name: t('achievements.time_master.name'),
      desc: t('achievements.time_master.desc'),
      icon: '🧘',
      check: () => getTotalTime() >= 36000,
      progress: () => ({
        current: Math.floor(getTotalTime() / 3600),
        total: 10
      })
    },
    {
      id: 'collector',
      name: t('achievements.collector.name'),
      desc: t('achievements.collector.desc'),
      icon: '🌟',
      check: () => artifacts.length >= 3,
      progress: () => ({ current: artifacts.length, total: 3 })
    },
    {
      id: 'early_bird',
      name: t('achievements.early_bird.name'),
      desc: t('achievements.early_bird.desc'),
      icon: '🌅',
      check: () => practiceHistory.some(s => new Date(s.date).getHours() < 6)
    },
    {
      id: 'night_owl',
      name: t('achievements.night_owl.name'),
      desc: t('achievements.night_owl.desc'),
      icon: '🌙',
      check: () => practiceHistory.some(s => new Date(s.date).getHours() >= 22)
    },
    {
      id: 'stability_master',
      name: t('achievements.stability_master.name'),
      desc: t('achievements.stability_master.desc'),
      icon: '💎',
      check: () => practiceHistory.some(s => s.stability > 95),
      progress: () => {
        const best = practiceHistory.length > 0
          ? Math.max(0, ...practiceHistory.map(s => s.stability || 0))
          : 0;
        return { current: safeToFixed(best, 0), total: 95 };
      }
    },
    {
      id: 'all_circuits',
      name: t('achievements.all_circuits.name'),
      desc: t('achievements.all_circuits.desc'),
      icon: '👑',
      check: () => circuits.every(c => c.practices.every(p => completedPractices[p.id])),
      progress: () => {
        const completed = circuits.filter(c => 
          c.practices.every(p => completedPractices[p.id])
        ).length;
        return { current: completed, total: circuits.length };
      }
    }
  ];

  const getStreak = () => {
    if (practiceHistory.length === 0) return 0;

    const uniqueDates = [...new Set(practiceHistory.map(s => {
      const date = new Date(s.date);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    }))].sort((a, b) => b - a);

    if (uniqueDates.length === 0) return 0;

    const today = new Date();
    const todayTimestamp = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const yesterdayTimestamp = todayTimestamp - 86400000;

    if (uniqueDates[0] !== todayTimestamp && uniqueDates[0] !== yesterdayTimestamp) {
      return 0;
    }

    let streak = 1;
    const startDate = uniqueDates[0];

    for (let i = 1; i < uniqueDates.length; i++) {
      const expectedTimestamp = startDate - (i * 86400000);
      if (uniqueDates[i] === expectedTimestamp) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const getTotalTime = () => {
    return practiceHistory.reduce((sum, s) => sum + (s.duration || 0), 0);
  };

  const getAverageQuality = () => {
    if (practiceHistory.length === 0) return 0;
    return practiceHistory.reduce((sum, s) => sum + (s.quality || 0), 0) / practiceHistory.length;
  };

  const checkAchievements = () => {
    achievements.forEach(achievement => {
      const isUnlocked = unlockedAchievements.includes(achievement.id);
      const shouldUnlock = achievement.check();
      
      if (!isUnlocked && shouldUnlock) {
        setUnlockedAchievements(prev => [...prev, achievement.id]);
      }
    });
  };

  useEffect(() => {
    checkAchievements();
  }, [practiceHistory, completedPractices, artifacts]);

  const startEmotionalCheck = async () => {
    setShowEmotionalCheck(true);
    setEmotionalState(null);
  };

  const startRecording = async (mode) => {
    setRecordingMode(mode);
    setIsRecording(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateLevel = () => {
        if (!isRecording) return;
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average);
        requestAnimationFrame(updateLevel);
      };
      updateLevel();
      
      setTimeout(() => {
        stopRecording(stream, audioContext);
      }, mode === 'voice' ? 5000 : 3000);
      
    } catch (error) {
      console.error('Microphone access error:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = (stream, audioContext) => {
    setIsRecording(false);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (audioContext) {
      audioContext.close();
    }
    
    analyzeEmotion();
  };

  const analyzeEmotion = () => {
    const emotions = [
      {
        name: t('emotional_states.calmness'),
        icon: '😌',
        color: 'from-blue-500 to-cyan-500',
        desc: t('emotional_states.calmness_desc'),
        practices: ['p1-1', 'p1-2', 'p1-5']
      },
      {
        name: t('emotional_states.joy'),
        icon: '😊',
        color: 'from-yellow-500 to-orange-500',
        desc: t('emotional_states.joy_desc'),
        practices: ['p2-4', 'p3-2']
      },
      {
        name: t('emotional_states.anxiety'),
        icon: '😰',
        color: 'from-purple-500 to-pink-500',
        desc: t('emotional_states.anxiety_desc'),
        practices: ['p1-2', 'p1-4', 'p2-2']
      },
      {
        name: t('emotional_states.fatigue'),
        icon: '😔',
        color: 'from-slate-500 to-gray-500',
        desc: t('emotional_states.fatigue_desc'),
        practices: ['p1-1', 'p3-1', 'p3-2']
      },
      {
        name: t('emotional_states.inspiration'),
        icon: '✨',
        color: 'from-emerald-500 to-teal-500',
        desc: t('emotional_states.inspiration_desc'),
        practices: ['p2-1', 'p2-3', 'p2-5']
      },
      {
        name: t('emotional_states.contemplation'),
        icon: '🤔',
        color: 'from-indigo-500 to-purple-500',
        desc: t('emotional_states.contemplation_desc'),
        practices: ['p1-3', 'p1-5', 'p2-3']
      }
    ];
    
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    setEmotionalState(randomEmotion);
  };

  const currentCircuit = circuits[activeCircuit - 1];
  const totalPractices = currentCircuit.practices.length;
  const completedCount = currentCircuit.practices.filter(p => completedPractices[p.id]?.isValidForArtifact).length;
  const progress = (completedCount / totalPractices) * 100;

  if (activePractice) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${activePractice.colors} text-white relative overflow-hidden transition-all duration-1000`}>
        {/* Debug Monitor - also during practice */}
        <DebugMonitor
          buildNumber={import.meta.env.VITE_BUILD_NUMBER}
          commitHash={import.meta.env.VITE_COMMIT_HASH}
          branchName={import.meta.env.VITE_BRANCH_NAME}
        />
        
        {activePractice.id === 'p1-1' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-1_Breath of Life/p1-1_Breath of Life-1.mp3"
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p1-2' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-2_Sense of Being/p1-2_Sense of Being-1.mp3"
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p1-3' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-3_Warm Pulse/p1-3_Warm Pulse-1.mp3"
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p1-4' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-4_Still Wave/p1-4_Still Wave-1.mp3"
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p1-5' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-5_Inner Listening/p1-5_Inner Listening-1.mp3"
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p1-6' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-6_First Light/p1-6_First Light-1.mp3"
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p1-7' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-7_Liquid Presence/p1-7_Liquid Presence-1.mp3"
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p1-8' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p1/p1-8_Breath Count/p1-8_Breath Count-1.mp3",
              "p1/p1-8_Breath Count/p1-8_Breath Count-2.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p1-9' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-9_Point of Stillness/p1-9_Point of Stillness-1.mp3"
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p1-10' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p1/p1-10_I Am Silence/p1-10_I Am Silence-1.mp3",
              "p1/p1-10_I Am Silence/p1-10_I Am Silence-2.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p1-11' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-11_Ground Flow/p1-11_Ground Flow-1.mp3"
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p1-12' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-12_Body Root/p1-12_Body Root-1.mp3"
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {/* Part 2 Audio Players */}
        {activePractice.id === 'p2-1' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-1_Flow Rhythm/p2-1_Flow Rhythm-1.mp3",
              "p2/p2-1_Flow Rhythm/p2-1_Flow Rhythm-2.mp3",
              "p2/p2-1_Flow Rhythm/p2-1_Flow Rhythm-3.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p2-2' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-2_Sense of Direction/p2-2_Sense of Direction-1.mp3",
              "p2/p2-2_Sense of Direction/p2-2_Sense of Direction-2.mp3",
              "p2/p2-2_Sense of Direction/p2-2_Sense of Direction-3.mp3",
              "p2/p2-2_Sense of Direction/p2-2_Sense of Direction-4.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p2-3' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-3_Rhythm of Movement/p2-3_Rhythm of Movement-1.mp3",
              "p2/p2-3_Rhythm of Movement/p2-3_Rhythm of Movement-2.mp3",
              "p2/p2-3_Rhythm of Movement/p2-3_Rhythm of Movement-3.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p2-4' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-4_Water Balance/p2-4_Water Balance-1.mp3",
              "p2/p2-4_Water Balance/p2-4_Water Balance-2.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p2-5' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-5_Fluid Form/p2-5_Fluid Form-1.mp3",
              "p2/p2-5_Fluid Form/p2-5_Fluid Form-2.mp3",
              "p2/p2-5_Fluid Form/p2-5_Fluid Form-3.mp3",
              "p2/p2-5_Fluid Form/p2-5_Fluid Form-4.mp3",
              "p2/p2-5_Fluid Form/p2-5_Fluid Form-5.mp3",
              "p2/p2-5_Fluid Form/p2-5_Fluid Form-6.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p2-6' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-6_Wave Breath/p2-6_Wave Breath-1.mp3",
              "p2/p2-6_Wave Breath/p2-6_Wave Breath-2.mp3",
              "p2/p2-6_Wave Breath/p2-6_Wave Breath-3.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p2-7' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-7_Intuition of Flow/p2-7_Intuition of Flow-1.mp3",
              "p2/p2-7_Intuition of Flow/p2-7_Intuition of Flow-2.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p2-8' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-8_Focus in Motion/p2-8_Focus in Motion-1.mp3",
              "p2/p2-8_Focus in Motion/p2-8_Focus in Motion-2.mp3",
              "p2/p2-8_Focus in Motion/p2-8_Focus in Motion-3.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p2-9' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-9_Flexible Response/p2-9_Flexible Response-1.mp3",
              "p2/p2-9_Flexible Response/p2-9_Flexible Response-2.mp3",
              "p2/p2-9_Flexible Response/p2-9_Flexible Response-3.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p2-10' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-10_Still Water/p2-10_Still Water-1.mp3",
              "p2/p2-10_Still Water/p2-10_Still Water-2.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p2-11' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-11_Deep Current/p2-11_Deep Current-1.mp3",
              "p2/p2-11_Deep Current/p2-11_Deep Current-2.mp3",
              "p2/p2-11_Deep Current/p2-11_Deep Current-3.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p2-12' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-12_Echo of Ocean/p2-12_Echo of Ocean-1.mp3",
              "p2/p2-12_Echo of Ocean/p2-12_Echo of Ocean-2.mp3",
              "p2/p2-12_Echo of Ocean/p2-12_Echo of Ocean-3.mp3",
              "p2/p2-12_Echo of Ocean/p2-12_Echo of Ocean-4.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p3-1' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-1_Breath of Transition/p3-1_Breath of Transition-1.mp3",
              "p3/p3-1_Breath of Transition/p3-1_Breath of Transition-2.mp3",
              "p3/p3-1_Breath of Transition/p3-1_Breath of Transition-3.mp3",
              "p3/p3-1_Breath of Transition/p3-1_Breath of Transition-4.mp3",
              "p3/p3-1_Breath of Transition/p3-1_Breath of Transition-5.mp3",
              "p3/p3-1_Breath of Transition/p3-1_Breath of Transition-6.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p3-2' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-2_Point of Stability/p3-2_Point of Stability-1.mp3",
              "p3/p3-2_Point of Stability/p3-2_Point of Stability-2.mp3",
              "p3/p3-2_Point of Stability/p3-2_Point of Stability-3.mp3",
              "p3/p3-2_Point of Stability/p3-2_Point of Stability-4.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p3-3' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-3_Form Plasticity/p3-3_Form Plasticity-1.mp3",
              "p3/p3-3_Form Plasticity/p3-3_Form Plasticity-2.mp3",
              "p3/p3-3_Form Plasticity/p3-3_Form Plasticity-3.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p3-4' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-4_Earth and Air Breath/p3-4_Earth and Air Breath-1.mp3",
              "p3/p3-4_Earth and Air Breath/p3-4_Earth and Air Breath-2.mp3",
              "p3/p3-4_Earth and Air Breath/p3-4_Earth and Air Breath-3.mp3",
              "p3/p3-4_Earth and Air Breath/p3-4_Earth and Air Breath-4.mp3",
              "p3/p3-4_Earth and Air Breath/p3-4_Earth and Air Breath-5.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p3-5' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-5_First Step of Stability/p3-5_First Step of Stability-1.mp3",
              "p3/p3-5_First Step of Stability/p3-5_First Step of Stability-2.mp3",
              "p3/p3-5_First Step of Stability/p3-5_First Step of Stability-3.mp3",
              "p3/p3-5_First Step of Stability/p3-5_First Step of Stability-4.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p3-6' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-6_Wave of Breath/p3-6_Wave of Breath-1.mp3",
              "p3/p3-6_Wave of Breath/p3-6_Wave of Breath-2.mp3",
              "p3/p3-6_Wave of Breath/p3-6_Wave of Breath-3.mp3",
              "p3/p3-6_Wave of Breath/p3-6_Wave of Breath-4.mp3",
              "p3/p3-6_Wave of Breath/p3-6_Wave of Breath-5.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p3-7' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-7_Breath Bridge/p3-7_Breath Bridge-1.mp3",
              "p3/p3-7_Breath Bridge/p3-7_Breath Bridge-2.mp3",
              "p3/p3-7_Breath Bridge/p3-7_Breath Bridge-3.mp3",
              "p3/p3-7_Breath Bridge/p3-7_Breath Bridge-4.mp3",
              "p3/p3-7_Breath Bridge/p3-7_Breath Bridge-5.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p3-8' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-8_Center of Gravity/p3-8_Center of Gravity-1.mp3",
              "p3/p3-8_Center of Gravity/p3-8_Center of Gravity-2.mp3",
              "p3/p3-8_Center of Gravity/p3-8_Center of Gravity-3.mp3",
              "p3/p3-8_Center of Gravity/p3-8_Center of Gravity-4.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p3-9' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-9_Shape Shift/p3-9_Shape Shift-1.mp3",
              "p3/p3-9_Shape Shift/p3-9_Shape Shift-2.mp3",
              "p3/p3-9_Shape Shift/p3-9_Shape Shift-3.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p3-10' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-10_Resonant Stillness/p3-10_Resonant Stillness-1.mp3",
              "p3/p3-10_Resonant Stillness/p3-10_Resonant Stillness-2.mp3",
              "p3/p3-10_Resonant Stillness/p3-10_Resonant Stillness-3.mp3",
              "p3/p3-10_Resonant Stillness/p3-10_Resonant Stillness-4.mp3",
              "p3/p3-10_Resonant Stillness/p3-10_Resonant Stillness-5.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p3-11' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-11_Pulse of Earth/p3-11_Pulse of Earth-1.mp3",
              "p3/p3-11_Pulse of Earth/p3-11_Pulse of Earth-2.mp3",
              "p3/p3-11_Pulse of Earth/p3-11_Pulse of Earth-3.mp3",
              "p3/p3-11_Pulse of Earth/p3-11_Pulse of Earth-4.mp3",
              "p3/p3-11_Pulse of Earth/p3-11_Pulse of Earth-5.mp3",
              "p3/p3-11_Pulse of Earth/p3-11_Pulse of Earth-6.mp3",
              "p3/p3-11_Pulse of Earth/p3-11_Pulse of Earth-7.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {activePractice.id === 'p3-12' && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-12_Breath of Adaptation/p3-12_Breath of Adaptation-1.mp3",
              "p3/p3-12_Breath of Adaptation/p3-12_Breath of Adaptation-2.mp3",
              "p3/p3-12_Breath of Adaptation/p3-12_Breath of Adaptation-3.mp3",
              "p3/p3-12_Breath of Adaptation/p3-12_Breath of Adaptation-4.mp3",
              "p3/p3-12_Breath of Adaptation/p3-12_Breath of Adaptation-5.mp3"
            ]}
            fadeInDuration={3000}
            fadeOutDuration={3000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '3s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.75s', animationDuration: '4s' }} />
        </div>

        <div className="absolute inset-0 bg-black/10" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.3) 100%)'
        }} />

        <button
          onClick={exitPractice}
          className="absolute top-[72px] right-6 z-50 bg-black/40 hover:bg-black/60 backdrop-blur-sm p-3 rounded-full transition-all hover:scale-110"
        >
          <X className="w-6 h-6" />
        </button>

        {practiceState === 'intro' && (
          <div className="relative z-10 flex items-center justify-center min-h-screen p-3 sm:p-6">
            <div className="max-w-2xl text-center space-y-4 sm:space-y-8">
              <div className="text-5xl sm:text-9xl mb-4 sm:mb-8 animate-bounce" style={{ animationDuration: '2s' }}>
                {activePractice.visual}
              </div>
              <h1 className="text-xl sm:text-6xl font-bold mb-2 sm:mb-4 drop-shadow-2xl leading-tight px-2">
                {getPracticeName(activePractice.id)}
              </h1>
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 sm:p-8 mb-3 sm:mb-6 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <p className="text-sm text-purple-200 font-semibold tracking-wide">
                    {activePractice.element}
                  </p>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                </div>
                <p className="text-sm sm:text-2xl leading-relaxed italic font-light">
                  "{getPracticeMessage(activePractice.id)}"
                </p>
              </div>
              {activePractice.scienceInfo && activePractice.scienceInfo.length > 0 && (
                <div className="text-sm sm:text-base text-gray-200 space-y-2 mb-4 sm:mb-6 px-4 max-w-lg text-justify">
                  {activePractice.scienceInfo.map((info: string, idx: number) => {
                    const colonIndex = info.indexOf(':');
                    if (colonIndex > -1) {
                      const label = info.substring(0, colonIndex + 1);
                      const value = info.substring(colonIndex + 1);
                      return (
                        <p key={idx} className="leading-tight">
                          <span className="font-bold">{label}</span>{value}
                        </p>
                      );
                    }
                    return <p key={idx} className="leading-tight">{info}</p>;
                  })}
                </div>
              )}
              <div className="flex items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-200">
                <span className="bg-black/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm text-xs sm:text-base min-w-[100px] sm:min-w-[120px] text-center">
                  {activePractice.targetTime ? `${Math.floor(activePractice.targetTime / 60)} ${t('practice_items.duration_min')}` : activePractice.duration}
                </span>
                <span className="text-gray-400">•</span>
                <span className="bg-black/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm text-xs sm:text-base min-w-[100px] sm:min-w-[120px] text-center">
                  {t('practices.up_to')} {activePractice.maxQnt} OND
                </span>
              </div>
              <button
                onClick={beginPractice}
                className="bg-white/30 hover:bg-white/40 backdrop-blur-md px-6 sm:px-8 py-3 sm:py-5 rounded-full text-sm sm:text-base font-semibold transition-all transform hover:scale-110 shadow-2xl border border-white/30"
              >
                {t('practices.start')}
              </button>
            </div>
          </div>
        )}

        {practiceState === 'active' && (
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-3 sm:p-6">
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
                  strokeDashoffset={`${2 * Math.PI * 110 * (1 - (practiceTime / activePractice.targetTime))}`}
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
                    {activePractice.visual}
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
                <span className="font-bold text-xl sm:text-2xl">{safeToFixed(qualityScore, 0)}%</span>
              </div>
              <div className="w-full h-5 sm:h-6 bg-black/40 rounded-full overflow-hidden backdrop-blur-sm border border-white/20 shadow-inner">
                <div
                  className={`h-full transition-all duration-[12500ms] relative ${
                    qualityScore >= 100
                      ? 'bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600'
                      : meetsArtifactRequirements 
                        ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-300' 
                        : 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-300'
                  }`}
                  style={{ width: `${qualityScore}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse" />
                </div>
              </div>
              <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-300 flex justify-between">
                <span>{t('labels.time_label')}: {safeToFixed((practiceTime / activePractice.targetTime) * 100, 0)}%</span>
                <span>{t('labels.energy')}: {safeToFixed(vitalsData.energy, 0)}%</span>
              </div>
            </div>

            {activePractice.guidingTexts && activePractice.guidingTexts.length > 0 && (
              <div className="w-full max-w-md mb-6 sm:mb-8 px-3 sm:px-0">
                <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl h-24 sm:h-28 flex items-center justify-center overflow-hidden">
                  <p
                    className={`text-sm sm:text-base text-center italic leading-snug text-white/90 whitespace-pre-line transition-all duration-1000 ${
                      isTextTransitioning ? 'opacity-0 translate-y-[-20px]' : 'opacity-100 translate-y-0'
                    }`}
                  >
                    {activePractice.guidingTexts[currentGuidingTextIndex]}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-12 px-3 sm:px-0 w-full max-w-md">
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 sm:p-6 text-center border border-red-400/30 shadow-xl">
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-red-400" />
                <div className="text-2xl sm:text-4xl font-bold mb-1">{safeToFixed(vitalsData.stress, 0)}%</div>
                <div className="text-xs sm:text-sm text-gray-300">{t('labels.stress')}</div>
              </div>
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 sm:p-6 text-center border border-blue-400/30 shadow-xl">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-blue-400" />
                <div className="text-2xl sm:text-4xl font-bold mb-1">{safeToFixed(vitalsData.energy, 0)}%</div>
                <div className="text-xs sm:text-sm text-gray-300">{t('labels.energy')}</div>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-6">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="bg-white/30 hover:bg-white/40 backdrop-blur-md p-3 sm:p-5 rounded-full transition-all hover:scale-110 shadow-xl border border-white/30"
              >
                {isPaused ? <Play className="w-6 h-6 sm:w-8 sm:h-8" /> : <Pause className="w-6 h-6 sm:w-8 sm:h-8" />}
              </button>
              <button
                onClick={finishPractice}
                className="bg-emerald-500/40 hover:bg-emerald-500/60 backdrop-blur-md px-6 py-3 sm:px-10 sm:py-5 rounded-full font-bold text-sm sm:text-lg transition-all hover:scale-105 shadow-xl border border-emerald-400/50"
              >
                {t('practices.end_practice')}
              </button>
            </div>
          </div>
        )}

        {practiceState === 'complete' && (
          <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6">
            <div className="max-w-2xl w-full text-center space-y-4 sm:space-y-8">
              <div className="text-6xl sm:text-8xl md:text-9xl mb-4 sm:mb-8 animate-bounce" style={{ animationDuration: '1s' }}>✨</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">{t('practices.completed')}</h2>

              {activePractice.finalPhrase && (
                <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/30 shadow-xl mb-4 sm:mb-6">
                  <p className="text-base sm:text-lg md:text-xl italic leading-relaxed text-white/90 whitespace-pre-line">
                    {activePractice.finalPhrase}
                  </p>
                </div>
              )}

              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-10 space-y-4 border border-white/20 shadow-2xl">
                {/* Row 1: OND Amount */}
                <div className="text-4xl sm:text-5xl md:text-7xl font-mono text-yellow-400 drop-shadow-2xl animate-pulse">
                  +{Math.floor((activePractice.maxQnt * qualityScore) / 100)} OND
                </div>
                
                {/* Row 2: Quality + Time - symmetric: numbers in center */}
                <div className="flex justify-center items-center text-sm sm:text-base">
                  <div className="flex items-center justify-end gap-2 w-[140px]">
                    <span className="text-gray-300">{t('practices.quality')}</span>
                    <span className="font-bold text-lg sm:text-xl text-emerald-400">{safeToFixed(qualityScore, 0)}%</span>
                  </div>
                  <div className="w-px h-6 bg-white/30 mx-3" />
                  <div className="flex items-center justify-start gap-2 w-[140px]">
                    <span className="font-bold text-lg sm:text-xl text-white">{formatTime(practiceTime)}</span>
                    <span className="text-gray-300">{t('practices.time')}</span>
                  </div>
                </div>
                
                {/* Row 3: Stress + Energy - symmetric: numbers in center */}
                <div className="flex justify-center items-start text-sm sm:text-base">
                  <div className="flex flex-col items-end w-[140px]">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <span className="text-gray-300">{t('labels.stress')}</span>
                      <span className="font-bold text-red-400">{safeToFixed(vitalsData.stress, 0)}%</span>
                    </div>
                    <Activity className="w-4 h-4 text-red-400 mt-1" />
                  </div>
                  <div className="w-px h-10 bg-white/30 mx-3" />
                  <div className="flex flex-col items-start w-[140px]">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <span className="font-bold text-blue-400">{safeToFixed(vitalsData.energy, 0)}%</span>
                      <span className="text-gray-300">{t('labels.energy')}</span>
                    </div>
                    <Zap className="w-4 h-4 text-blue-400 mt-1" />
                  </div>
                </div>
                
                {/* Row 4: Star Rating */}
                <div className="pt-2">
                  <p className="text-sm text-gray-400 mb-2">{t('practices.rate_practice') || 'Rate this practice'}</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setPracticeRating(star)}
                        className="transition-all hover:scale-110"
                        data-testid={`button-star-${star}`}
                      >
                        <Star 
                          className={`w-8 h-8 sm:w-10 sm:h-10 ${
                            star <= practiceRating 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-500'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                {completedPractices[activePractice.id] && completedPractices[activePractice.id].quality < qualityScore && (
                  <div className="bg-emerald-500/20 border border-emerald-400/50 rounded-lg p-3 sm:p-4 text-sm sm:text-base text-emerald-200">
                    {t('practices.new_record')}: {safeToFixed(completedPractices[activePractice.id]?.quality, 0)}%
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={() => {
                    setPracticeState('intro');
                    setPracticeTime(0);
                    setQualityScore(0);
                    setPracticeRating(0);
                    setIsPaused(false);
                    setAudioResetKey(prev => prev + 1);
                  }}
                  className="bg-purple-500/30 hover:bg-purple-500/50 backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all border border-purple-400/50"
                >
                  {t('practices.try_again')}
                </button>
                <button
                  onClick={exitPractice}
                  className="bg-white/30 hover:bg-white/40 backdrop-blur-md px-8 sm:px-10 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-bold transition-all border border-white/30"
                >
                  {t('practices.back_to_practices')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (showOnboarding) {
    const handleOnboardingNext = () => {
      if (onboardingScreen < 3) {
        setOnboardingScreen(onboardingScreen + 1);
      } else {
        localStorage.setItem('onda_onboarding_completed', 'true');
        setShowOnboarding(false);
        setShowAuthModal(true);
      }
    };

    const handleOnboardingPrev = () => {
      if (onboardingScreen > 1) {
        setOnboardingScreen(onboardingScreen - 1);
      }
    };

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: React.TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      touchEndX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Свайп влево - следующий экран
          if (onboardingScreen < 3) {
            setOnboardingScreen(onboardingScreen + 1);
          }
        } else {
          // Свайп вправо - предыдущий экран
          if (onboardingScreen > 1) {
            setOnboardingScreen(onboardingScreen - 1);
          }
        }
      }
    };

    return (
      <div className="h-full text-white overflow-x-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950">
        <div 
          className="min-h-screen flex flex-col justify-between px-6 py-8 max-w-2xl mx-auto"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex justify-center gap-3 pt-4">
            {[1, 2, 3].map((dot) => (
              <button
                key={dot}
                onClick={() => setOnboardingScreen(dot)}
                className={`w-3 h-3 rounded-full transition-all ${
                  onboardingScreen === dot
                    ? 'bg-violet-400 scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                data-testid={`onboarding-dot-${dot}`}
              />
            ))}
          </div>

          <div className="flex-1 flex flex-col justify-center py-8">
            {onboardingScreen === 1 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="text-center mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold">{t('onboarding.screen1_title')}</h1>
                </div>
                <p className="text-white/90 leading-relaxed text-lg">{t('onboarding.screen1_text1')}</p>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start gap-3">
                    <span className="text-violet-400 mt-1">•</span>
                    <span>{t('onboarding.screen1_list1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-violet-400 mt-1">•</span>
                    <span>{t('onboarding.screen1_list2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-violet-400 mt-1">•</span>
                    <span>{t('onboarding.screen1_list3')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-violet-400 mt-1">•</span>
                    <span>{t('onboarding.screen1_list4')}</span>
                  </li>
                </ul>
                <p className="text-violet-300 italic text-lg text-center pt-4">{t('onboarding.screen1_conclusion')}</p>
              </div>
            )}

            {onboardingScreen === 2 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="text-center mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold">{t('onboarding.screen2_title')}</h1>
                </div>
                <p className="text-white/90 leading-relaxed text-lg">{t('onboarding.screen2_text1')}</p>
                <p className="text-white/80 font-medium">{t('onboarding.screen2_text2')}</p>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>{t('onboarding.screen2_list1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>{t('onboarding.screen2_list2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>{t('onboarding.screen2_list3')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>{t('onboarding.screen2_list4')}</span>
                  </li>
                </ul>
                <p className="text-cyan-300 italic text-lg text-center pt-4">{t('onboarding.screen2_conclusion')}</p>
              </div>
            )}

            {onboardingScreen === 3 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="text-center mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold">{t('onboarding.screen3_title')}</h1>
                </div>
                <p className="text-white/90 leading-relaxed text-lg">{t('onboarding.screen3_text1')}</p>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>{t('onboarding.screen3_list1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>{t('onboarding.screen3_list2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>{t('onboarding.screen3_list3')}</span>
                  </li>
                </ul>
                <p className="text-yellow-300 italic text-lg text-center pt-4">{t('onboarding.screen3_conclusion')}</p>
              </div>
            )}
          </div>

          <div 
            className="pb-8"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 32px)' }}
          >
            <button
              onClick={handleOnboardingNext}
              className={`w-full py-4 rounded-full text-lg font-semibold transition-all ${
                onboardingScreen === 3
                  ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/30'
                  : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
              }`}
              data-testid="button-onboarding-next"
            >
              {onboardingScreen === 3 ? t('onboarding.start_journey') : t('onboarding.continue')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      data-main-container
      className={`h-full text-white overflow-x-hidden pb-6 pt-8 transition-all duration-1000 ${
      activeCircuit === 2
        ? 'bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900'
        : activeCircuit === 3
        ? 'bg-gradient-to-br from-amber-950 via-orange-900 to-amber-950'
        : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
    }`}>
      {/* Debug Monitor - ПЕРВЫМ для захвата всех логов */}
      <DebugMonitor
        buildNumber={import.meta.env.VITE_BUILD_NUMBER}
        commitHash={import.meta.env.VITE_COMMIT_HASH}
        branchName={import.meta.env.VITE_BRANCH_NAME}
      />

      {/* TEMPORARY: Visible Debug Banner - DELETE AFTER DEBUGGING */}
      <div className="fixed top-0 left-0 right-0 z-[200] bg-black/90 text-white text-xs px-3 py-2 text-center font-mono">
        🔧 DEBUG: {debugInfo}
      </div>

      {/* Плавающая кнопка гамбургер меню */}
      {!showJournalModal && !showStatsModal && !showRatingModal && !showAuthModal && 
       !showProfileModal && !showSettingsModal && !showConnectionModal && !showLanguageModal &&
       !showQntShop && !showEmotionalCheck && !showInfoModal && (
        <button
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className={`menu-container fixed top-12 z-[100] text-white transition-all px-3 py-3 rounded-xl shadow-2xl backdrop-blur-md ${
            activeCircuit === 2
              ? 'bg-cyan-600/40 hover:bg-cyan-600/60 border border-cyan-400/30'
              : activeCircuit === 3
              ? 'bg-amber-700/40 hover:bg-amber-700/60 border border-amber-500/30'
              : 'bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/30'
          }`}
          style={{ 
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            left: 'max(28px, calc(50% - 256px + 16px))'
          }}
          data-testid="button-menu"
        >
          {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      )}

      {/* Кнопка подписки */}
      {!showJournalModal && !showStatsModal && !showRatingModal && !showAuthModal && 
       !showProfileModal && !showSettingsModal && !showConnectionModal && !showLanguageModal &&
       !showQntShop && !showEmotionalCheck && !showInfoModal && !showMenu && !showSubscriptionModal && (
        <button
          onClick={() => setShowSubscriptionModal(true)}
          className={`fixed top-12 z-[100] text-white transition-all w-10 h-10 rounded-full shadow-2xl backdrop-blur-md flex items-center justify-center ${
            activeCircuit === 2
              ? 'bg-cyan-600/40 hover:bg-cyan-600/60 border border-cyan-400/30'
              : activeCircuit === 3
              ? 'bg-amber-700/40 hover:bg-amber-700/60 border border-amber-500/30'
              : 'bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/30'
          }`}
          style={{ 
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            right: 'max(44px, calc(50% - 256px + 16px))'
          }}
          title={t('subscription.title', 'Subscription')}
          data-testid="button-subscription"
        >
          <DollarSign className="w-5 h-5" />
        </button>
      )}

      {/* Верхняя навигация */}
      <div className="hidden">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="text-white/80 hover:text-white text-xs sm:text-sm transition-all px-2 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/30 hover:bg-black/50"
              >
                {selectedLanguage}
              </button>
              {showLanguageDropdown && (
                <div className="absolute top-full mt-2 left-0 bg-black/90 backdrop-blur-md rounded-lg border border-purple-500/30 overflow-hidden z-50">
                  {[
                    { code: 'EN', label: 'EN', i18nCode: 'en' },
                    { code: 'ES', label: 'ES', i18nCode: 'es' },
                    { code: 'UK', label: 'UK', i18nCode: 'uk' },
                    { code: 'RU', label: 'RU', i18nCode: 'ru' },
                    { code: 'ZH', label: '中文', i18nCode: 'zh' }
                  ].map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.code);
                        i18n.changeLanguage(lang.i18nCode);
                        setShowLanguageDropdown(false);
                      }}
                      className="block w-full px-6 py-2 text-left hover:bg-purple-500/20 transition-all"
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="text-white/80 hover:text-white text-xs sm:text-sm transition-all px-2 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/30 hover:bg-black/50 flex items-center gap-1.5"
            >
              <Settings className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              <span className="hidden sm:inline">{t('auth.settings')}</span>
            </button>
            {user ? (
              <button
                onClick={() => setShowProfileModal(true)}
                className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm transition-all px-2 sm:px-4 py-1.5 sm:py-2 rounded-full ${
                  isLightTheme
                    ? 'text-amber-900 hover:text-amber-950 bg-amber-300 hover:bg-amber-400'
                    : 'text-white/80 hover:text-white bg-black/30 hover:bg-black/50'
                }`}
              >
                <User className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                <span className="hidden sm:inline">{userProfile?.display_name || t('auth.profile')}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className={`text-xs sm:text-sm transition-all px-2 sm:px-4 py-1.5 sm:py-2 rounded-full ${
                  isLightTheme
                    ? 'text-amber-900 hover:text-amber-950 bg-amber-300 hover:bg-amber-400'
                    : 'text-white/80 hover:text-white bg-black/30 hover:bg-black/50'
                }`}
              >
                {t('nav.login')}
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setShowQntShop(true)}
              className={`text-xs sm:text-sm transition-all px-2 sm:px-4 py-1.5 sm:py-2 rounded-full ${
                isLightTheme
                  ? 'text-amber-900 hover:text-amber-950 bg-amber-300 hover:bg-amber-400'
                  : 'text-white/80 hover:text-white bg-black/30 hover:bg-black/50'
              }`}
              title="Click to open OND Shop"
            >
              {safeToFixed(qnt, 1)} OND
            </button>
            <button
              onClick={() => setShowRatingModal(true)}
              className={`text-xs sm:text-sm transition-all px-2 sm:px-4 py-1.5 sm:py-2 rounded-full ${
                isLightTheme
                  ? 'text-amber-900 hover:text-amber-950 bg-amber-300 hover:bg-amber-400'
                  : 'text-white/80 hover:text-white bg-black/30 hover:bg-black/50'
              }`}
            >
              {t('nav.rating')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 pb-4 sm:pb-8 pt-[28px]">
        {/* Центральный заголовок */}
        <div className="text-center mb-6 sm:mb-12 pt-0">
          {/* Логотип по центру */}
          <div className="flex items-center justify-center gap-2 text-white/80 mb-8 sm:mb-10">
            <span className="text-lg sm:text-xl font-light">ONDA</span>
            <span className="text-sm sm:text-base font-light">~</span>
            <span className="text-lg sm:text-xl font-light">LIFE</span>
          </div>

          <div className="w-full max-w-lg mx-auto px-4">
            {/* Строка с Уровень | Тело */}
            <div className="flex items-center justify-center mb-2 sm:mb-2">
              <div className="relative dropdown-container w-full">
                <button
                  onClick={() => { setShowChapterDropdown(!showChapterDropdown); setShowLevelDropdown(false); }}
                  className={`backdrop-blur-sm text-xl sm:text-2xl font-light px-4 sm:px-6 py-3 sm:py-4 rounded-full transition-all border w-full ${
                    activeCircuit === 2
                      ? 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-400/40'
                      : activeCircuit === 3
                      ? 'bg-amber-600/10 hover:bg-amber-600/20 border-amber-500/40'
                      : 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-400/40'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <span className="flex-1 text-right pr-3 sm:pr-4">{t('chapter')} {selectedChapter}</span>
                    <span className="text-white/30">|</span>
                    <span className="flex-1 text-left pl-3 sm:pl-4">{t(`chapters.chapter_${selectedChapter}`)}</span>
                  </div>
                </button>
                {showChapterDropdown && (
                  <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 backdrop-blur-md rounded-2xl border z-50 overflow-hidden w-full ${
                    activeCircuit === 2
                      ? 'bg-cyan-500/20 border-cyan-400/50'
                      : activeCircuit === 3
                      ? 'bg-amber-600/20 border-amber-500/50'
                      : 'bg-indigo-500/20 border-indigo-400/50'
                  }`}>
                    {Array.from({length: 4}, (_, i) => i + 1).map(chapter => {
                      const isAvailable = chapter <= 2; // Уровни 1 и 2 доступны
                      return (
                        <button
                          key={chapter}
                          onClick={() => { 
                            if (isAvailable) { 
                              setSelectedChapter(chapter); 
                              // При выборе Chapter → переключаем на первую часть этого уровня
                              const firstLevelOfChapter = (chapter - 1) * 3 + 1;
                              setSelectedLevel(firstLevelOfChapter);
                              setActiveCircuit(firstLevelOfChapter);
                              setShowChapterDropdown(false); 
                            } 
                          }}
                          className={`block w-full px-4 py-3 transition-all text-lg ${
                            !isAvailable
                              ? 'text-white/40 cursor-not-allowed'
                              : activeCircuit === 2
                              ? selectedChapter === chapter ? 'bg-cyan-500/40 text-white' : 'hover:bg-cyan-500/30'
                              : activeCircuit === 3
                              ? selectedChapter === chapter ? 'bg-amber-600/40 text-white' : 'hover:bg-amber-600/30'
                              : selectedChapter === chapter ? 'bg-indigo-500/40 text-white' : 'hover:bg-indigo-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <span className="flex-1 text-right pr-3 sm:pr-4">{t('chapter')} {chapter}</span>
                            <span className="text-white/30">|</span>
                            <span className="flex-1 text-left pl-3 sm:pl-4">{t(`chapters.chapter_${chapter}`)}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            {/* Строка с Часть | Я есть */}
            <div className="flex items-center justify-center mb-3">
              <div className="relative dropdown-container w-full">
                <button
                  onClick={() => { setShowLevelDropdown(!showLevelDropdown); setShowChapterDropdown(false); }}
                  className={`backdrop-blur-sm font-light px-4 sm:px-6 py-3 sm:py-4 rounded-full transition-all border w-full min-h-[56px] sm:min-h-[64px] ${
                    activeCircuit === 2
                      ? 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-400/40'
                      : activeCircuit === 3
                      ? 'bg-amber-600/10 hover:bg-amber-600/20 border-amber-500/40'
                      : 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-400/40'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <span className="flex-1 text-right pr-3 sm:pr-4 text-xl sm:text-2xl">{t('level')} {selectedLevel}</span>
                    <span className="text-white/30 text-xl sm:text-2xl">|</span>
                    <span className="flex-1 text-left pl-3 sm:pl-4">
                      <span className="text-xl sm:text-2xl">{t(`part_name_${selectedLevel}`).split(' ')[0]}</span>
                      <span className="text-base sm:text-xl"> {t(`part_name_${selectedLevel}`).split(' ').slice(1).join(' ')}</span>
                    </span>
                  </div>
                </button>
                {showLevelDropdown && (
                  <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 backdrop-blur-md rounded-2xl border z-50 overflow-hidden w-full max-h-[60vh] overflow-y-auto scrollbar-hide ${
                    activeCircuit === 2
                      ? 'bg-cyan-500/20 border-cyan-400/50'
                      : activeCircuit === 3
                      ? 'bg-amber-600/20 border-amber-500/50'
                      : activeCircuit === 4
                      ? 'bg-blue-500/20 border-blue-400/50'
                      : 'bg-indigo-500/20 border-indigo-400/50'
                  }`}>
                    {Array.from({length: 12}, (_, i) => i + 1).map(level => {
                      const isAvailable = level <= 4;
                      return (
                        <button
                          key={level}
                          onClick={() => {
                            if (isAvailable) {
                              setSelectedLevel(level);
                              setActiveCircuit(level);
                              // При выборе Level → переключаем на соответствующий Chapter
                              const chapterForLevel = Math.ceil(level / 3);
                              setSelectedChapter(chapterForLevel);
                              setShowLevelDropdown(false);
                            }
                          }}
                          className={`block w-full px-4 py-2.5 transition-all text-lg ${
                            !isAvailable
                              ? 'text-white/40 cursor-not-allowed'
                              : activeCircuit === 2
                              ? level === selectedLevel ? 'bg-cyan-500/40 text-white' : 'hover:bg-cyan-500/30'
                              : activeCircuit === 3
                              ? level === selectedLevel ? 'bg-amber-600/40 text-white' : 'hover:bg-amber-600/30'
                              : activeCircuit === 4
                              ? level === selectedLevel ? 'bg-blue-500/40 text-white' : 'hover:bg-blue-500/30'
                              : level === selectedLevel ? 'bg-indigo-500/40 text-white' : 'hover:bg-indigo-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <span className="flex-1 text-right pr-3 sm:pr-4">{t('level')} {level}</span>
                            <span className="text-white/30">|</span>
                            <span className="flex-1 text-left pl-3 sm:pl-4">
                              <span>{t(`part_name_${level}`).split(' ')[0]}</span>
                              <span className="text-sm sm:text-base"> {t(`part_name_${level}`).split(' ').slice(1).join(' ')}</span>
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center flex-1 justify-center my-4 sm:my-6">
            <div className="text-base sm:text-xl text-white/80 italic max-w-md text-center px-4 sm:px-0" dangerouslySetInnerHTML={{__html: `«${t(`quote_level_${activeCircuit}`)}»`}}>
            </div>
          </div>
        </div>

        {/* Кнопки навигации */}
        <div className="flex flex-col items-center gap-3 sm:gap-4 mb-6 sm:mb-12 w-full max-w-lg mx-auto px-4">
          {/* Эмоциональная сверка */}
          <button
            onClick={() => setShowEmotionalCheck(true)}
            className={`backdrop-blur-sm text-xl sm:text-2xl font-light px-4 sm:px-6 py-3 sm:py-4 rounded-full transition-all border w-full ${
              activeCircuit === 2
                ? 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-400/40'
                : activeCircuit === 3
                ? 'bg-amber-600/10 hover:bg-amber-600/20 border-amber-500/40'
                : 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-400/40'
            }`}
          >
            {t('nav.emotional_check')}
          </button>
        </div>

        {/* Центральный блок с описанием контура */}
        <div className="mb-12">
          <div className={`bg-black/20 backdrop-blur-sm rounded-2xl border py-4 sm:py-8 px-4 sm:px-8 transition-all duration-1000 ${
            activeCircuit === 2
              ? 'border-cyan-500/30'
              : activeCircuit === 3
              ? 'border-amber-600/30'
              : 'border-purple-500/30'
          }`}>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="text-4xl sm:text-6xl font-light tracking-wider">{t(`circuits.circuit_${activeCircuit}_title`)}</div>
              </div>
              <h3 className="text-2xl font-light mb-4">{t(`circuits.circuit_${activeCircuit}_subtitle`)}</h3>
              <p className="text-white/70 leading-relaxed" dangerouslySetInnerHTML={{__html: t(`circuits.circuit_${activeCircuit}_desc`)}}>
              </p>
            </div>
          </div>
        </div>

        {/* Permission Warning Banner */}
        {permissions.needsSetup && (
          <div className="mb-6">
            <PermissionWarningBanner
              onSetupClick={() => setShowPermissionModal(true)}
            />
          </div>
        )}

        {/* Watch Connection Prompt */}
        <WatchConnectionPrompt
          visible={showWatchPrompt}
          onConnected={() => setShowWatchPrompt(false)}
        />

        {/* Биометрика */}
        <div className="mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3 sm:p-4 text-center border border-red-500/30">
              <Heart className={`w-5 sm:w-6 h-5 sm:h-6 mb-2 mx-auto ${watchHeartRate.isConnected ? 'text-green-400' : 'text-red-400'}`} />
              <div className="text-xl sm:text-2xl font-bold">{displayHeartRate ?? '--'}</div>
              <div className="text-xs text-gray-400">BPM {watchHeartRate.isConnected && <span className="text-green-400">Watch</span>}</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3 sm:p-4 text-center border border-blue-500/30">
              <Wind className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400 mb-2 mx-auto" />
              <div className="text-xl sm:text-2xl font-bold">{vitalsData.br ? `${vitalsData.br.toFixed(1)}` : '--'}</div>
              <div className="text-xs text-gray-400">/min</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3 sm:p-4 text-center border border-orange-500/30">
              <Activity className="w-5 sm:w-6 h-5 sm:h-6 text-orange-400 mb-2 mx-auto" />
              <div className="text-xl sm:text-2xl font-bold">{vitalsData.stress ?? '--'}%</div>
              <div className="text-xs text-gray-400">Stress</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3 sm:p-4 text-center border border-yellow-500/30">
              <Zap className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-400 mb-2 mx-auto" />
              <div className="text-xl sm:text-2xl font-bold">{vitalsData.energy ?? '--'}%</div>
              <div className="text-xs text-gray-400">Energy</div>
            </div>
          </div>
        </div>

        {/* Прогресс уровня */}
        <div className="mb-8">
          <div className={`bg-black/20 backdrop-blur-sm rounded-2xl p-4 border transition-all duration-1000 ${
            activeCircuit === 2
              ? 'border-cyan-500/30'
              : activeCircuit === 3
              ? 'border-amber-600/30'
              : 'border-purple-500/30'
          }`}>
            <div className="flex justify-between mb-2 text-sm">
              <span>{t('progress.level_progress')}</span>
              <span>{completedCount}/{totalPractices} {t('progress.practices')}</span>
            </div>
            <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Философский текст */}
        <div className="mb-8 sm:mb-12">
          <div className={`backdrop-blur-sm rounded-2xl p-4 sm:p-8 border transition-all duration-1000 ${
            activeCircuit === 2
              ? 'bg-gradient-to-br from-teal-900/20 to-cyan-900/20 border-cyan-500/30'
              : activeCircuit === 3
              ? 'bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-600/30'
              : 'bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/30'
          }`}>
            <p className="text-white/90 text-sm sm:text-lg leading-relaxed text-center italic">
              {t(`philosophy.level_${activeCircuit}.text_1`)}<br/>
              {t(`philosophy.level_${activeCircuit}.text_2`)}<br/>
              {t(`philosophy.level_${activeCircuit}.text_3`)}<br/>
              {t(`philosophy.level_${activeCircuit}.text_4`)}<br/>
              {t(`philosophy.level_${activeCircuit}.text_5`)}
              {activeCircuit === 1 && <><br/>{t('philosophy.level_1.text_6')}</>}
            </p>
          </div>
        </div>

      {showStats && (
        <div className="max-w-6xl mx-auto mb-8 bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">📊 {t('stats.title')}</h2>
            <button
              onClick={() => setShowStats(false)}
              className="text-gray-400 hover:text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className={`bg-black/30 rounded-lg p-3 sm:p-4 border transition-all duration-1000 ${
              activeCircuit === 2
                ? 'border-cyan-500/20'
                : activeCircuit === 3
                ? 'border-amber-600/20'
                : 'border-purple-500/20'
            }`}>
              <p className="text-gray-400 text-sm mb-1">{t('stats.total_qnt')}</p>
              <p className="text-2xl sm:text-3xl font-bold">{practiceHistory.length}</p>
            </div>
            <div className={`bg-black/30 rounded-lg p-3 sm:p-4 border transition-all duration-1000 ${
              activeCircuit === 2
                ? 'border-cyan-500/20'
                : activeCircuit === 3
                ? 'border-amber-600/20'
                : 'border-purple-500/20'
            }`}>
              <p className="text-gray-400 text-sm mb-1">{t('stats.time_in_practices')}</p>
              <p className="text-2xl sm:text-3xl font-bold">
                {Math.floor(getTotalTime() / 3600)}{t('stats.hours_short')} {Math.floor((getTotalTime() % 3600) / 60)}{t('stats.minutes_short')}
              </p>
            </div>
            <div className={`bg-black/30 rounded-lg p-3 sm:p-4 border transition-all duration-1000 ${
              activeCircuit === 2
                ? 'border-cyan-500/20'
                : activeCircuit === 3
                ? 'border-amber-600/20'
                : 'border-purple-500/20'
            }`}>
              <p className="text-gray-400 text-sm mb-1">{t('stats.avg_quality')}</p>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400">{safeToFixed(getAverageQuality(), 0)}%</p>
            </div>
            <div className={`bg-black/30 rounded-lg p-3 sm:p-4 border transition-all duration-1000 ${
              activeCircuit === 2
                ? 'border-cyan-500/20'
                : activeCircuit === 3
                ? 'border-amber-600/20'
                : 'border-purple-500/20'
            }`}>
              <p className="text-gray-400 text-sm mb-1">{t('stats.day_streak')}</p>
              <p className="text-2xl sm:text-3xl font-bold text-orange-400">{getStreak()} 🔥</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">🏆 {t('stats.achievements')} ({unlockedAchievements.length}/{achievements.length})</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {achievements.map(achievement => {
                const isUnlocked = unlockedAchievements.includes(achievement.id);
                const hasProgress = achievement.progress && !isUnlocked;
                const progressData = hasProgress ? achievement.progress() : null;

                return (
                  <div 
                    key={achievement.id}
                    className={`rounded-lg p-4 border transition-all ${
                      isUnlocked 
                        ? 'bg-yellow-500/10 border-yellow-500/30' 
                        : 'bg-black/30 border-gray-600/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`text-4xl ${isUnlocked ? '' : 'grayscale opacity-40'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold mb-1 ${isUnlocked ? 'text-yellow-300' : 'text-gray-400'}`}>
                          {getAchievementName(achievement.id)}
                        </h4>
                        <p className="text-xs text-gray-400 mb-2">{getAchievementDesc(achievement.id)}</p>
                        {hasProgress && progressData && (
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500">{t('achievements.progress')}</span>
                              <span className="text-gray-400">{progressData.current}/{progressData.total}</span>
                            </div>
                            <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                                style={{ width: `${Math.min(100, (progressData.current / progressData.total) * 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {isUnlocked && (
                          <span className="inline-block mt-2 text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                            {t('achievements.unlocked')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showJournal && (
        <div className={`max-w-6xl mx-auto mb-8 bg-black/40 backdrop-blur-md rounded-2xl p-6 border transition-all duration-1000 ${
          activeCircuit === 2
            ? 'border-cyan-500/30'
            : activeCircuit === 3
            ? 'border-amber-600/30'
            : 'border-indigo-500/30'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">📖 {t('journal.title')}</h2>
            <button
              onClick={() => setShowJournal(false)}
              className="text-gray-400 hover:text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {practiceHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-2">{t('journal.empty')}</p>
              <p className="text-sm">{t('journal.start_practice')}</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {practiceHistory.map((session) => (
                <div 
                  key={session.id}
                  className={`bg-black/30 rounded-lg p-4 border transition-all ${
                    activeCircuit === 2
                      ? 'border-cyan-500/20 hover:border-cyan-400/40'
                      : activeCircuit === 3
                      ? 'border-gray-500/20 hover:border-gray-400/40'
                      : 'border-purple-500/20 hover:border-purple-400/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{getPracticeName(session.practiceId)}</h3>
                      <p className="text-xs text-gray-400">{formatDate(session.date)}</p>
                    </div>
                    {session.isNewRecord && (
                      <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-1 rounded-full border border-yellow-400/30">
                        🏆 Рекорд
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">{t('journal.quality')}</p>
                      <p className="font-bold text-emerald-400">{safeToFixed(session.quality, 0)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">{t('journal.time')}</p>
                      <p className="font-mono">{formatTime(session.duration)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">{t('labels.stress')}</p>
                      <p className="font-mono">{safeToFixed(session.stress, 0)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">{t('labels.energy')}</p>
                      <p className="font-mono">{safeToFixed(session.energy, 0)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">{t('journal.reward')}</p>
                      <p className="font-bold text-yellow-400">+{session.qnt} OND</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="max-w-6xl mx-auto">

        {/* Watch Debug - скрыт в production, включается через localStorage.debugMode='true' */}
        {platform === 'ios' && (!import.meta.env.PROD || localStorage.getItem('debugMode') === 'true') && (
          <div className="mb-4 px-4">
            <div className="bg-gray-800/80 border border-gray-600 rounded-lg p-3 text-xs font-mono">
              <div className="text-yellow-400 mb-1">Watch Debug:</div>
              <div className="text-gray-300">
                supported: {String(watchHeartRate.watchStatus?.supported ?? 'null')} | 
                paired: {String(watchHeartRate.watchStatus?.paired ?? 'null')} | 
                reachable: {String(watchHeartRate.watchStatus?.reachable ?? 'null')}
              </div>
              <div className="text-gray-300">
                autoManaged: {String(watchHeartRate.autoManaged)} | 
                isMonitoring: {String(watchHeartRate.isMonitoring)} | 
                HR: {watchHeartRate.heartRate ?? '--'}
              </div>
              {watchHeartRate.error && (
                <div className="text-red-400 mt-1">Error: {watchHeartRate.error}</div>
              )}
            </div>
          </div>
        )}

        {/* Подсказка для активации Watch - показываем когда мониторинг включен но HR не приходит */}
        {platform === 'ios' && watchHeartRate.watchStatus?.paired && watchHeartRate.isMonitoring && !watchHeartRate.watchStatus?.reachable && (
          <div className="mb-6 px-4">
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
                <Watch className="w-5 h-5" />
                <span className="font-medium">{t('nav.watch_activate_title')}</span>
              </div>
              <p className="text-white/70 text-sm">
                {t('nav.watch_activate_text')}
              </p>
            </div>
          </div>
        )}

        {/* Подсказка для разрешения Watch - СКРЫТА */}

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {currentCircuit.practices.map(practice => {
            const isCompleted = completedPractices[practice.id];
            const bonus = calculateBonus();
            const earnedQnt = Math.floor(practice.maxQnt * (1 + bonus / 100));
            const bestQuality = isCompleted ? (isCompleted.quality || 0) : 0;
            const sessions = getPracticeSessions(practice.id);
            const isExpanded = expandedPractice === practice.id;

            return (
              <div
                key={practice.id}
                ref={el => practiceRefs.current[practice.id] = el}
                className={`bg-black/40 backdrop-blur-sm rounded-lg p-6 border transition-all ${
                  isCompleted
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : activeCircuit === 2
                    ? 'border-cyan-500/30 hover:border-cyan-400/50'
                    : activeCircuit === 3
                    ? 'border-gray-500/30 hover:border-gray-400/50'
                    : 'border-purple-500/30 hover:border-purple-400/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{getPracticeName(practice.id)}</h3>
                    <p className="text-sm text-gray-400">{practice.duration}</p>
                  </div>
                  {isCompleted?.isValidForArtifact ? (
                    <div className="text-right">
                      <CheckCircle className="w-6 h-6 text-emerald-400 mb-1 ml-auto" />
                      <div className="text-xs text-emerald-300">{safeToFixed(bestQuality, 0)}%</div>
                    </div>
                  ) : isCompleted ? (
                    <div className="text-right">
                      <Circle className="w-6 h-6 text-emerald-400 mb-1 ml-auto" />
                      <div className="text-xs text-emerald-300">{safeToFixed(bestQuality, 0)}%</div>
                    </div>
                  ) : (
                    <Circle className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <p className="text-sm text-gray-300 mb-4">{getPracticeDesc(practice.id)}</p>
                
                {sessions.length > 0 && (
                  <div className="mb-4">
                    <button
                      onClick={() => setExpandedPractice(isExpanded ? null : practice.id)}
                      className={`text-xs flex items-center gap-1 transition-all ${
                        activeCircuit === 2
                          ? 'text-cyan-300 hover:text-cyan-200'
                          : activeCircuit === 3
                          ? 'text-gray-300 hover:text-gray-200'
                          : 'text-indigo-300 hover:text-indigo-200'
                      }`}
                    >
                      {isExpanded ? '▼' : '▶'} {t('practices.session_history')} ({sessions.length})
                    </button>
                    
                    {isExpanded && (
                      <div className="mt-3 space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                        {sessions.map((session) => (
                          <div 
                            key={session.id}
                            className={`bg-black/30 rounded p-3 border text-xs transition-all duration-1000 ${
                              activeCircuit === 2
                                ? 'border-cyan-500/20'
                                : activeCircuit === 3
                                ? 'border-amber-600/20'
                                : 'border-purple-500/20'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-gray-400">{formatDate(session.date)}</span>
                              {session.isNewRecord && (
                                <span className="text-yellow-400">🏆</span>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <p className="text-gray-500">{t('journal.quality')}</p>
                                <p className="font-bold text-emerald-400">{safeToFixed(session.quality, 0)}%</p>
                              </div>
                              <div>
                                <p className="text-gray-500">{t('journal.time')}</p>
                                <p className="font-mono">{formatTime(session.duration)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">OND</p>
                                <p className="text-yellow-400">+{session.qnt}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="text-yellow-400 font-mono">
                    <div>{t('practices.up_to')} {earnedQnt} OND</div>
                    {bonus > 0 && (
                      <div className="text-xs text-emerald-400">
                        (+{bonus}%)
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => completePractice(practice.id, practice.maxQnt)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      activeCircuit === 2
                        ? isCompleted
                          ? 'bg-cyan-600/50 hover:bg-cyan-600/70 border border-cyan-400/50'
                          : 'bg-cyan-600 hover:bg-cyan-700'
                        : activeCircuit === 3
                        ? isCompleted
                          ? 'bg-amber-600/50 hover:bg-amber-600/70 border border-amber-400/50'
                          : 'bg-amber-600 hover:bg-amber-700'
                        : isCompleted
                          ? 'bg-purple-600/50 hover:bg-purple-600/70 border border-purple-400/50'
                          : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {isCompleted ? t('practices.improve') : t('practices.start')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`backdrop-blur-md rounded-2xl p-8 border shadow-2xl transition-all duration-1000 ${
          activeCircuit === 2
            ? 'bg-gradient-to-br from-teal-900/30 via-cyan-900/20 to-blue-900/30 border-cyan-500/30'
            : activeCircuit === 3
            ? 'bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-amber-900/30 border-amber-600/30'
            : 'bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/30 border-indigo-500/30'
        }`}>
          <div className="space-y-4 text-gray-200">
            <p className="text-gray-300 leading-relaxed">{t(`level_goal.level_${activeCircuit}.intro`)}</p>
            
            <p className="text-gray-300 leading-relaxed">{t(`level_goal.level_${activeCircuit}.story_1`)}</p>
            <p className="text-gray-300 leading-relaxed">{t(`level_goal.level_${activeCircuit}.story_2`)}</p>
            <p className="text-gray-300 leading-relaxed">{t(`level_goal.level_${activeCircuit}.story_3`)}</p>
            {activeCircuit === 1 && (
              <p className="text-cyan-300 leading-relaxed italic">{t('level_goal.level_1.story_4')}</p>
            )}

            <div className="text-center py-4">
              <p className={`text-xl font-bold mb-2 ${
                activeCircuit === 2 ? 'text-cyan-300' : activeCircuit === 3 ? 'text-amber-300' : 'text-pink-300'
              }`}>{t(`level_goal.level_${activeCircuit}.identity_1`)}</p>
              <p className={`text-lg ${
                activeCircuit === 2 ? 'text-teal-300' : activeCircuit === 3 ? 'text-orange-300' : 'text-purple-300'
              }`}>{t(`level_goal.level_${activeCircuit}.identity_2`)}</p>
              <p className={`text-lg ${
                activeCircuit === 2 ? 'text-blue-300' : activeCircuit === 3 ? 'text-yellow-300' : 'text-indigo-300'
              }`}>{t(`level_goal.level_${activeCircuit}.identity_3`)}</p>
            </div>
            
            <p className="text-gray-300 leading-relaxed">{t(`level_goal.level_${activeCircuit}.wisdom_1`)}</p>
            <p className="text-gray-300 leading-relaxed">{t(`level_goal.level_${activeCircuit}.wisdom_2`)}</p>
            <p className="text-gray-300 leading-relaxed">{t(`level_goal.level_${activeCircuit}.wisdom_3`)}</p>
            <p className={`leading-relaxed italic ${
              activeCircuit === 2 ? 'text-cyan-300' : activeCircuit === 3 ? 'text-amber-300' : 'text-cyan-300'
            }`}>{t(`level_goal.level_${activeCircuit}.wisdom_4`)}</p>
          </div>
        </div>

        <div className="mt-8 p-4 sm:p-8">
          <h3 className={`text-2xl font-bold mb-6 transition-colors duration-1000 text-center ${
            activeCircuit === 2
              ? 'text-cyan-300'
              : activeCircuit === 3
              ? 'text-gray-300'
              : 'text-purple-300'
          }`}>
            {t('terra_speaks.title')}
          </h3>
          <div className="space-y-4">
            <p className="text-white/90 text-sm sm:text-lg leading-relaxed text-center italic">
              "{t(`terra_speaks.level_${activeCircuit}.quote_1`)}"
            </p>
            <p className="text-white/90 text-sm sm:text-lg leading-relaxed text-center italic">
              "{t(`terra_speaks.level_${activeCircuit}.quote_2`)}"
            </p>
            <p className="text-white/90 text-sm sm:text-lg leading-relaxed text-center italic">
              "{t(`terra_speaks.level_${activeCircuit}.quote_3`)}"
            </p>
            <p className={`text-lg leading-relaxed italic font-semibold text-center transition-colors duration-1000 ${
              activeCircuit === 2
                ? 'text-cyan-200'
                : activeCircuit === 3
                ? 'text-gray-200'
                : 'text-amber-200'
            }`}>
              "{t(`terra_speaks.level_${activeCircuit}.quote_4`)}"
            </p>
          </div>
        </div>

        {/* Заголовок секции артефактов */}
        <div className="mt-12 mb-6">
          <h2 className={`text-3xl font-bold text-center transition-colors duration-1000 ${
            activeCircuit === 2
              ? 'text-cyan-300'
              : activeCircuit === 3
              ? 'text-gray-300'
              : 'text-purple-300'
          }`}>
            {t('artifacts.level_title', { level: activeCircuit })}
          </h2>
        </div>

        {/* Все артефакты */}
        <div className="space-y-4 mb-12">
          {/* Артефакт контура (Roots of Being и т.д.) */}
          <div className={`bg-black/40 backdrop-blur-sm rounded-2xl p-6 border ${
            artifacts.some(a => a.circuitId === currentCircuit.id)
              ? 'border-yellow-500/50 bg-yellow-500/10'
              : 'border-purple-500/50 bg-purple-500/10'
          }`}>
            <div className="flex items-center gap-4">
              {artifacts.some(a => a.circuitId === currentCircuit.id) ? (
                <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
              ) : (
                <Star className="w-12 h-12 text-purple-400 fill-purple-400" />
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{currentCircuit.artifact.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{currentCircuit.artifact.requirement}</p>
                <div className="text-emerald-400">
                  {t('labels.bonus')}: +{currentCircuit.artifact.bonus}% {t('labels.to_qnt_generation')}
                </div>
              </div>
            </div>
          </div>
          {/* Артефакт - Ясная Воля (только для части 1) */}
          {activeCircuit === 1 && (() => {
            const perfectCount = practiceHistory.filter(p => p.quality >= 100).length;
            const hasClearWill = artifacts.some(a => a.id === 'clear-will');
            return (
              <div
                onClick={() => {
                  if (!hasClearWill) {
                    setInfoModalMessage(t('artifacts.clear_will_alert'));
                    setShowInfoModal(true);
                  }
                }}
                className={`bg-black/40 backdrop-blur-sm rounded-2xl p-6 border ${
                  hasClearWill
                    ? 'border-yellow-500/50 bg-yellow-500/10'
                    : 'border-purple-500/50 bg-purple-500/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  {hasClearWill ? (
                    <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
                  ) : (
                    <Star className="w-12 h-12 text-purple-400 fill-purple-400" />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{t('artifacts.clear_will')}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {t('artifacts.clear_will_desc')}
                    </p>
                    {hasClearWill ? (
                      <div className="text-emerald-400">
                        {t('labels.bonus')}: +30% {t('labels.to_qnt_generation')}
                      </div>
                    ) : (
                      <div>
                        <div className="text-gray-400 text-sm mb-1">
                          {t('artifacts.progress')}: {perfectCount}/3 {t('artifacts.practices_100')}
                        </div>
                        <div className="text-emerald-400">
                          {t('labels.bonus')}: +30% {t('labels.to_qnt_generation')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Артефакт - Внутренняя Волна (только для части 2) */}
          {activeCircuit === 2 && (() => {
            const part2PerfectCount = practiceHistory.filter(p => 
              p.practiceId?.startsWith('p2-') && p.quality >= 100
            ).length;
            const hasInnerWave = artifacts.some(a => a.id === 'inner-wave');
            return (
              <div
                onClick={() => {
                  if (!hasInnerWave) {
                    setInfoModalMessage(t('artifacts.inner_wave_alert'));
                    setShowInfoModal(true);
                  }
                }}
                className={`bg-black/40 backdrop-blur-sm rounded-2xl p-6 border ${
                  hasInnerWave
                    ? 'border-yellow-500/50 bg-yellow-500/10'
                    : 'border-purple-500/50 bg-purple-500/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  {hasInnerWave ? (
                    <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
                  ) : (
                    <Star className="w-12 h-12 text-purple-400 fill-purple-400" />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{t('artifacts.inner_wave')}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {t('artifacts.inner_wave_desc')}
                    </p>
                    {hasInnerWave ? (
                      <div className="text-emerald-400">
                        {t('labels.bonus')}: +30% {t('labels.to_qnt_generation')}
                      </div>
                    ) : (
                      <div>
                        <div className="text-gray-400 text-sm mb-1">
                          {t('artifacts.progress')}: {part2PerfectCount}/6 {t('artifacts.practices_100')}
                        </div>
                        <div className="text-emerald-400">
                          {t('labels.bonus')}: +30% {t('labels.to_qnt_generation')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Артефакт - Пульс Трансформации (только для части 3) */}
          {activeCircuit === 3 && (() => {
            const part3PerfectCount = practiceHistory.filter(p => 
              p.practiceId?.startsWith('p3-') && p.quality >= 100
            ).length;
            const hasTransformationPulse = artifacts.some(a => a.id === 'transformation-pulse');
            return (
              <div
                onClick={() => {
                  if (!hasTransformationPulse) {
                    setInfoModalMessage(t('artifacts.transformation_pulse_alert'));
                    setShowInfoModal(true);
                  }
                }}
                className={`bg-black/40 backdrop-blur-sm rounded-2xl p-6 border ${
                  hasTransformationPulse
                    ? 'border-yellow-500/50 bg-yellow-500/10'
                    : 'border-purple-500/50 bg-purple-500/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  {hasTransformationPulse ? (
                    <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
                  ) : (
                    <Star className="w-12 h-12 text-purple-400 fill-purple-400" />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{t('artifacts.transformation_pulse')}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {t('artifacts.transformation_pulse_desc')}
                    </p>
                    {hasTransformationPulse ? (
                      <div className="text-emerald-400">
                        {t('labels.bonus')}: +30% {t('labels.to_qnt_generation')}
                      </div>
                    ) : (
                      <div>
                        <div className="text-gray-400 text-sm mb-1">
                          {t('artifacts.progress')}: {part3PerfectCount}/9 {t('artifacts.practices_100')}
                        </div>
                        <div className="text-emerald-400">
                          {t('labels.bonus')}: +30% {t('labels.to_qnt_generation')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Артефакт - Эхо Радости (Part 4) */}
          {(() => {
            const part4PerfectCount = practiceHistory.filter(p => 
              p.practiceId?.startsWith('p4-') && p.quality >= 100
            ).length;
            const hasEchoOfJoy = artifacts.some(a => a.id === 'echo-of-joy');
            return (
              <div
                onClick={() => {
                  if (!hasEchoOfJoy) {
                    setInfoModalMessage(t('artifacts.echo_of_joy_alert'));
                    setShowInfoModal(true);
                  }
                }}
                className={`bg-black/40 backdrop-blur-sm rounded-2xl p-6 border ${
                  hasEchoOfJoy
                    ? 'border-yellow-500/50 bg-yellow-500/10'
                    : 'border-purple-500/50 bg-purple-500/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  {hasEchoOfJoy ? (
                    <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
                  ) : (
                    <Star className="w-12 h-12 text-purple-400 fill-purple-400" />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{t('artifacts.echo_of_joy')}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {t('artifacts.echo_of_joy_desc')}
                    </p>
                    {hasEchoOfJoy ? (
                      <div className="text-emerald-400">
                        {t('labels.bonus')}: +50% {t('labels.to_qnt_generation')}
                      </div>
                    ) : (
                      <div>
                        <div className="text-gray-400 text-sm mb-1">
                          {t('artifacts.progress')}: {part4PerfectCount}/3 {t('artifacts.practices_100')}
                        </div>
                        <div className="text-emerald-400">
                          {t('labels.bonus')}: +50% {t('labels.to_qnt_generation')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Артефакт - Ритм Жизни */}
          <div
            onClick={() => {
              if (rhythmProgress < 7) {
                setInfoModalMessage(t('artifacts.life_rhythm_alert'));
                setShowInfoModal(true);
              }
            }}
            className={`bg-black/40 backdrop-blur-sm rounded-2xl p-6 border ${
              rhythmProgress >= 7
                ? 'border-yellow-500/50 bg-yellow-500/10'
                : 'border-purple-500/50 bg-purple-500/10'
            }`}
          >
            <div className="flex items-center gap-4">
              {rhythmProgress >= 7 ? (
                <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
              ) : (
                <Star className="w-12 h-12 text-purple-400 fill-purple-400" />
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{t('artifacts.life_rhythm')}</h3>
                <p className="text-sm text-gray-400 mb-2">
                  {t('artifacts.life_rhythm_desc')}
                </p>
                {rhythmProgress >= 7 ? (
                  <div className="text-emerald-400">
                    {t('labels.bonus')}: +100% {t('labels.to_qnt_generation')}
                  </div>
                ) : (
                  <div>
                    <div className="text-gray-400 text-sm mb-1">
                      {t('artifacts.progress')}: {rhythmProgress}/7 {t('artifacts.days')}
                    </div>
                    <div className="text-emerald-400">
                      {t('labels.bonus')}: +100% {t('labels.to_qnt_generation')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 sm:p-8">
          <h3 className={`text-2xl font-bold mb-6 transition-colors duration-1000 text-center ${
            activeCircuit === 2
              ? 'text-cyan-300'
              : activeCircuit === 3
              ? 'text-gray-300'
              : 'text-purple-300'
          }`}>
            {t('terra_final.title')}
          </h3>
          <div className="space-y-4">
            <p className="text-white/90 text-sm sm:text-lg leading-relaxed text-center italic">
              {t(`terra_final.level_${activeCircuit}.line_1`)}
            </p>
            <p className="text-white/90 text-sm sm:text-lg leading-relaxed text-center italic">
              {t(`terra_final.level_${activeCircuit}.line_2`)}
            </p>
            <p className="text-white/90 text-sm sm:text-lg leading-relaxed text-center italic">
              {t(`terra_final.level_${activeCircuit}.line_3`)}
            </p>
            {activeCircuit === 2 ? (
              <>
                <p className="text-white/90 text-sm sm:text-lg leading-relaxed text-center italic">
                  {t('terra_final.level_2.line_4')}
                </p>
                <p className={`text-sm sm:text-lg leading-relaxed text-center italic font-semibold transition-colors duration-1000 text-cyan-200`}>
                  {t('terra_final.level_2.line_5')}
                </p>
              </>
            ) : (
              <p className={`text-sm sm:text-lg leading-relaxed text-center italic font-semibold transition-colors duration-1000 ${
                activeCircuit === 3
                  ? 'text-gray-200'
                  : 'text-amber-200'
              }`}>
                {t(`terra_final.level_${activeCircuit}.line_4`)}
              </p>
            )}
          </div>

          <div className="text-center mt-6">
            {activeCircuit < 4 && (
              <button
                onClick={() => { 
                  setActiveCircuit(activeCircuit + 1); 
                  setSelectedLevel(activeCircuit + 1); 
                  // Прокрутка #root контейнера (где происходит скролл в этом приложении)
                  const rootElement = document.getElementById('root');
                  if (rootElement) rootElement.scrollTop = 0;
                  // Резервные варианты
                  document.body.scrollTop = 0;
                  document.documentElement.scrollTop = 0;
                  window.scrollTo(0, 0);
                }}
                className={`mt-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg ${
                  activeCircuit + 1 === 2
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white border-2 border-cyan-300/50'
                    : activeCircuit + 1 === 3
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border-2 border-amber-300/50'
                    : activeCircuit + 1 === 4
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-2 border-cyan-300/50'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-2 border-purple-300/50'
                }`}
              >
                {t('terra_final.button')} {activeCircuit + 1}
              </button>
            )}
          </div>
        </div>

        {artifacts.length > 0 && (
          <div className="mt-8 mb-12">
            <h3 className="text-2xl font-bold mb-4">{t('artifacts.your_artifacts')}</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {artifacts.map((artifact, idx) => {
                // Определяем имя и описание артефакта
                let artifactName = '';
                let artifactDesc = '';
                if (artifact.id === 'clear-will') {
                  artifactName = t('artifacts.clear_will');
                  artifactDesc = t('artifacts.clear_will_desc');
                } else if (artifact.id === 'inner-wave') {
                  artifactName = t('artifacts.inner_wave');
                  artifactDesc = t('artifacts.inner_wave_desc');
                } else if (artifact.id === 'transformation-pulse') {
                  artifactName = t('artifacts.transformation_pulse');
                  artifactDesc = t('artifacts.transformation_pulse_desc');
                } else if (artifact.id === 'life-rhythm') {
                  artifactName = t('artifacts.life_rhythm');
                  artifactDesc = t('artifacts.life_rhythm_desc');
                } else if (artifact.id === 'echo-of-joy') {
                  artifactName = t('artifacts.echo_of_joy');
                  artifactDesc = t('artifacts.echo_of_joy_desc');
                } else {
                  const circuit = circuits.find(c => c.id === artifact.circuitId);
                  artifactName = circuit?.artifact.name || artifact.name || 'Artifact';
                  artifactDesc = circuit?.artifact.requirement || '';
                }
                return (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-2xl p-6 border border-yellow-500/50"
                  >
                    <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 mb-3" />
                    <h4 className="text-lg font-bold mb-1">{artifactName}</h4>
                    <p className="text-sm text-gray-400 mb-2">{artifactDesc}</p>
                    <div className="text-emerald-400">+{artifact.bonus}% OND</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
      </div>

      {/* Модальное окно дневника */}
      {showJournalModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto pt-[env(safe-area-inset-top)]">
          <div className="bg-gradient-to-br from-gray-900 to-black max-w-4xl w-full max-h-[90vh] rounded-2xl border border-indigo-500/30 shadow-2xl my-4 flex flex-col">
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-indigo-500/30 p-4 sm:p-6 flex items-center justify-between">
              <h2 className="text-lg sm:text-2xl font-bold">📖 {t('practices.journal_title')}</h2>
              <button
                onClick={() => setShowJournalModal(false)}
                className="text-gray-400 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto no-scrollbar flex-1">
              {practiceHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-lg mb-2">{t('practices.journal_empty')}</p>
                  <p className="text-sm">{t('practices.journal_empty_hint')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {practiceHistory.map((session) => (
                    <div
                      key={session.id}
                      className="bg-black/30 rounded-lg p-3 sm:p-4 border border-purple-500/20 hover:border-purple-400/40 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-base sm:text-lg">{getPracticeName(session.practiceId)}</h3>
                          <p className="text-xs text-gray-400">{formatDate(session.date)}</p>
                        </div>
                        {session.isNewRecord && (
                          <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-1 rounded-full border border-yellow-400/30">
                            🏆 Рекорд
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-sm">
                        <div>
                          <p className="text-gray-400 text-xs">{t('journal.quality')}</p>
                          <p className="font-bold text-emerald-400">{safeToFixed(session.quality, 0)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">{t('journal.time')}</p>
                          <p className="font-mono">{formatTime(session.duration)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">{t('labels.stress')}</p>
                          <p className="font-mono">{safeToFixed(session.stress, 0)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">{t('labels.energy')}</p>
                          <p className="font-mono">{safeToFixed(session.energy, 0)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">{t('journal.reward')}</p>
                          <p className="font-bold text-yellow-400">+{session.qnt} OND</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно статистики */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto pt-[env(safe-area-inset-top)]">
          <div className="bg-gradient-to-br from-gray-900 to-black max-w-6xl w-full max-h-[90vh] overflow-y-auto no-scrollbar rounded-2xl border border-cyan-500/30 shadow-2xl my-4">
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-cyan-500/30 p-4 sm:p-6 flex items-center justify-between">
              <h2 className="text-lg sm:text-2xl font-bold">{t('stats.title')}</h2>
              <button
                onClick={() => setShowStatsModal(false)}
                className="text-gray-400 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                  <p className="text-gray-400 text-sm mb-1">{t('stats.total_qnt')}</p>
                  <p className="text-3xl font-bold">{practiceHistory.length}</p>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                  <p className="text-gray-400 text-sm mb-1">{t('stats.time_in_practices')}</p>
                  <p className="text-3xl font-bold">
                    {Math.floor(getTotalTime() / 3600)}{t('stats.hours_short')} {Math.floor((getTotalTime() % 3600) / 60)}{t('stats.minutes_short')}
                  </p>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                  <p className="text-gray-400 text-sm mb-1">{t('stats.avg_quality')}</p>
                  <p className="text-3xl font-bold text-emerald-400">{safeToFixed(getAverageQuality(), 0)}%</p>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                  <p className="text-gray-400 text-sm mb-1">{t('stats.day_streak')}</p>
                  <p className="text-3xl font-bold text-orange-400">{getStreak()} 🔥</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">{t('stats.achievements_title', { unlocked: unlockedAchievements.length, total: achievements.length })}</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {achievements.map(achievement => {
                    const isUnlocked = unlockedAchievements.includes(achievement.id);
                    const hasProgress = achievement.progress && !isUnlocked;
                    const progressData = hasProgress ? achievement.progress() : null;

                    return (
                      <div
                        key={achievement.id}
                        className={`rounded-lg p-4 border transition-all ${
                          isUnlocked
                            ? 'bg-yellow-500/10 border-yellow-500/30'
                            : 'bg-black/30 border-gray-600/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`text-4xl ${isUnlocked ? '' : 'grayscale opacity-40'}`}>
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-semibold mb-1 ${isUnlocked ? 'text-yellow-300' : 'text-gray-400'}`}>
                              {achievement.name}
                            </h4>
                            <p className="text-xs text-gray-400 mb-2">{achievement.desc}</p>
                            {hasProgress && progressData && (
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-500">{t('achievements.progress')}</span>
                                  <span className="text-gray-400">{progressData.current}/{progressData.total}</span>
                                </div>
                                <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                                    style={{ width: `${Math.min(100, (progressData.current / progressData.total) * 100)}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            {isUnlocked && (
                              <span className="inline-block mt-2 text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                                {t('achievements.unlocked')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Награды за достижения */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">{t('stats.rewards_section')}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-lg p-4 border border-yellow-500/30">
                    <div className="text-3xl mb-2">💰</div>
                    <p className="text-sm text-gray-400 mb-1">{t('stats.bonus_qnt')}</p>
                    <p className="text-2xl font-bold text-yellow-400">+{unlockedAchievements.length * 50} OND</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-lg p-4 border border-purple-500/30">
                    <div className="text-3xl mb-2">⭐</div>
                    <p className="text-sm text-gray-400 mb-1">{t('stats.special_artifacts')}</p>
                    <p className="text-2xl font-bold text-purple-400">{artifacts.length}/{circuits.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-lg p-4 border border-blue-500/30">
                    <div className="text-3xl mb-2">🎯</div>
                    <p className="text-sm text-gray-400 mb-1">{t('stats.achievements_progress')}</p>
                    <p className="text-2xl font-bold text-cyan-400">{Math.round((unlockedAchievements.length / achievements.length) * 100)}%</p>
                  </div>
                </div>
              </div>

              {/* Звания игрока */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">🏅 {t('stats.player_title')}</h3>
                <div className="bg-black/30 rounded-lg p-6 border border-purple-500/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-6xl">{getPlayerRank().icon}</div>
                    <div>
                      <h4 className="text-3xl font-bold mb-2">{getPlayerRank().name}</h4>
                      <p className="text-white/80">{t('stats.practices_count')}: {practiceHistory.length} | {t('stats.time_short')}: {Math.floor(getTotalTime() / 3600)}{t('stats.hours_short')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { name: t('stats.rank_novice'), min: 0, icon: '🌱' },
                      { name: t('stats.rank_student'), min: 20, icon: '🔥' },
                      { name: t('stats.rank_practitioner'), min: 50, icon: '⚡' },
                      { name: t('stats.rank_master'), min: 100, icon: '💎' },
                      { name: t('stats.rank_guru'), min: 200, icon: '🌟' }
                    ].map((rank, idx) => (
                      <div key={idx} className={`text-center p-3 rounded border transition-all ${practiceHistory.length >= rank.min ? 'bg-purple-500/20 border-purple-400/50' : 'bg-black/20 border-gray-600/20 opacity-40'}`}>
                        <div className="text-2xl mb-1">{rank.icon}</div>
                        <div className="text-xs">{rank.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* График качества по времени */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">{t('stats.quality_chart')}</h3>
                <div className="bg-black/30 rounded-lg p-6 border border-purple-500/20">
                  {practiceHistory.length > 0 ? (
                    <div className="h-48 flex items-end gap-2">
                      {practiceHistory.slice(-20).map((session, idx) => {
                        const height = (session.quality / 100) * 100;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center">
                            <div
                              className="w-full bg-gradient-to-t from-emerald-500 to-green-400 rounded-t transition-all hover:opacity-80"
                              style={{ height: `${height}%` }}
                              title={`${safeToFixed(session.quality, 0)}%`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-12">Нет данных для отображения</div>
                  )}
                  <div className="mt-4 text-sm text-gray-400 text-center">{t('stats.last_20_practices')}</div>
                </div>
              </div>

              {/* Календарь активности */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">{t('stats.activity_calendar')}</h3>
                <div className="bg-black/30 rounded-lg p-6 border border-purple-500/20">
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({length: 28}, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - (27 - i));
                      const dayPractices = practiceHistory.filter(p => {
                        const pDate = new Date(p.date);
                        return pDate.toDateString() === date.toDateString();
                      }).length;

                      const dateStr = date.toLocaleDateString(i18n.language, { day: 'numeric', month: 'short' });

                      return (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div className="text-xs text-gray-500 h-4">{dateStr}</div>
                          <div
                            className={`aspect-square w-full rounded ${
                              dayPractices === 0 ? 'bg-gray-800' :
                              dayPractices === 1 ? 'bg-green-900' :
                              dayPractices === 2 ? 'bg-green-700' :
                              'bg-green-500'
                            }`}
                            title={`${dateStr}: ${dayPractices} ${t('stats.practices_tooltip')}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 text-sm text-gray-400">{t('stats.last_4_weeks')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно рейтинга */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto pt-[env(safe-area-inset-top)]">
          <div className="bg-gradient-to-br from-gray-900 to-black max-w-6xl w-full max-h-[90vh] overflow-y-auto no-scrollbar rounded-2xl border border-cyan-500/30 shadow-2xl my-4">
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-cyan-500/30 p-4 sm:p-6 flex items-center justify-between">
              <h2 className="text-lg sm:text-2xl font-bold">{t('leaderboard.title')}</h2>
              <button
                onClick={() => setShowRatingModal(false)}
                className="text-gray-400 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
              {/* Рейтинг по OND */}
              <div>
                <h3 className="text-base sm:text-xl font-bold mb-3 sm:mb-4">{t('leaderboard.by_qnt')}</h3>
                <div className="space-y-2">
                  {sortedByQnt.map((player, idx) => {
                    const isCurrentPlayer = player.name === currentPlayerName;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-all ${
                          isCurrentPlayer
                            ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                            : 'bg-black/30 border-gray-700/30 hover:border-gray-600/50'
                        }`}
                      >
                        <div className={`text-lg sm:text-2xl font-bold w-6 sm:w-8 ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm sm:text-base">{player.name}</div>
                        </div>
                        <div className="text-yellow-400 font-mono font-bold text-sm sm:text-lg">
                          {safeToFixed(player.qnt, 1)} OND
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Рейтинг по качеству */}
              <div>
                <h3 className="text-base sm:text-xl font-bold mb-3 sm:mb-4">{t('leaderboard.by_quality')}</h3>
                <div className="space-y-2">
                  {sortedByQuality.map((player, idx) => {
                    const isCurrentPlayer = player.name === currentPlayerName;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-all ${
                          isCurrentPlayer
                            ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                            : 'bg-black/30 border-gray-700/30 hover:border-gray-600/50'
                        }`}
                      >
                        <div className={`text-lg sm:text-2xl font-bold w-6 sm:w-8 ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm sm:text-base">{player.name}</div>
                        </div>
                        <div className="text-emerald-400 font-bold text-sm sm:text-lg">
                          {safeToFixed(player.avgQuality, 0)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Рейтинг по времени */}
              <div>
                <h3 className="text-base sm:text-xl font-bold mb-3 sm:mb-4">{t('leaderboard.by_time')}</h3>
                <div className="space-y-2">
                  {sortedByTime.map((player, idx) => {
                    const isCurrentPlayer = player.name === currentPlayerName;
                    const totalTime = player.totalTime || 0;
                    const hours = Math.floor(totalTime / 3600);
                    const minutes = Math.floor((totalTime % 3600) / 60);
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-all ${
                          isCurrentPlayer
                            ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                            : 'bg-black/30 border-gray-700/30 hover:border-gray-600/50'
                        }`}
                      >
                        <div className={`text-lg sm:text-2xl font-bold w-6 sm:w-8 ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm sm:text-base">{player.name}</div>
                        </div>
                        <div className="text-purple-400 font-mono font-bold text-sm sm:text-lg">
                          {hours}ч {minutes}м
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Рейтинг практик - Top 10 */}
              <div>
                <h3 className="text-base sm:text-xl font-bold mb-3 sm:mb-4">{t('leaderboard.practice_ratings')}</h3>
                <div className="space-y-2">
                  {practiceStats.length > 0 ? (
                    practiceStats.slice(0, 10).map((practice, idx) => {
                      const avgMinutes = Math.floor(practice.avg_duration / 60);
                      const avgSeconds = Math.floor(practice.avg_duration % 60);
                      return (
                        <div
                          key={practice.practice_id}
                          className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-all bg-black/30 border-gray-700/30 hover:border-gray-600/50"
                        >
                          <div className={`text-lg sm:text-2xl font-bold w-6 sm:w-8 ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm sm:text-base">{practice.practice_name}</div>
                            <div className="text-xs text-gray-400">
                              {practice.total_sessions} {t('leaderboard.sessions')}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-yellow-400">
                              <Star className="w-4 h-4 fill-yellow-400" />
                              <span className="font-bold">{practice.avg_rating.toFixed(1)}</span>
                            </div>
                            <div className="text-xs text-gray-400">
                              {avgMinutes}:{avgSeconds.toString().padStart(2, '0')}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-gray-400 py-4">
                      {t('leaderboard.no_practice_ratings')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          isLightTheme={isLightTheme}
        />
      )}

      {showProfileModal && user && (
        <UserProfile
          user={user}
          profile={userProfile}
          onClose={() => setShowProfileModal(false)}
          isLightTheme={isLightTheme}
        />
      )}

      {showSettingsModal && user && (
        <SettingsModal
          user={user}
          profile={userProfile}
          onClose={() => setShowSettingsModal(false)}
          onProfileUpdate={(updatedProfile) => {
            setUserProfile(updatedProfile);
          }}
          isLightTheme={isLightTheme}
        />
      )}

      {showPermissionModal && (
        <PermissionSetupModal
          isOpen={showPermissionModal}
          onClose={() => setShowPermissionModal(false)}
          onRequestAll={permissions.requestAllPermissions}
          currentStatus={permissions.permissionStatus}
          isRequesting={permissions.isRequesting}
          onPermissionsGranted={() => setShowWatchPrompt(true)}
        />
      )}

      {showConnectionModal && (
        <ConnectionModal
          onClose={() => setShowConnectionModal(false)}
          isLightTheme={isLightTheme}
          vitalsData={vitalsData}
          healthConnectData={healthConnectData}
          healthKitHeartRateData={healthKitHeartRate}
          healthKitDataFull={healthKitData}
        />
      )}

      <LanguageModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />

      <OndShopModal
        isOpen={showQntShop}
        onClose={() => setShowQntShop(false)}
        currentOnd={qnt}
        isLightTheme={isLightTheme}
      />

      <EmotionalCheckModal
        isOpen={showEmotionalCheck}
        onClose={() => setShowEmotionalCheck(false)}
        onOndEarned={(amount) => setQnt(prev => prev + amount)}
      />

      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        message={infoModalMessage}
      />

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        activeCircuit={activeCircuit}
      />

      {/* Боковое меню */}
      {showMenu && (
        <nav className="menu-container fixed top-[6.75rem] left-4 z-[60] flex flex-col gap-2 animate-in slide-in-from-left duration-300 max-h-[calc(100vh-7.5rem)] overflow-y-auto pr-2 scrollbar-hide min-w-[55vw]">
            {/* Home */}
            <button
              onClick={() => {
                setInfoModalMessage(t('nav.home_description'));
                setShowInfoModal(true);
                setShowMenu(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md text-white transition-all text-left ${
                activeCircuit === 2
                  ? 'bg-cyan-600/40 hover:bg-cyan-600/60 border border-cyan-400/30'
                  : activeCircuit === 3
                  ? 'bg-amber-700/40 hover:bg-amber-700/60 border border-amber-500/30'
                  : 'bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/30'
              }`}
              style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}
              data-testid="menu-item-home"
            >
              <Mountain className="w-6 h-6 text-purple-400" />
              <span className="font-medium">{t('nav.home')}</span>
            </button>

            {/* Интро */}
            <button
              onClick={() => {
                localStorage.removeItem('onda_onboarding_completed');
                setOnboardingScreen(1);
                setShowOnboarding(true);
                setShowMenu(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md text-white transition-all text-left ${
                activeCircuit === 2
                  ? 'bg-cyan-600/40 hover:bg-cyan-600/60 border border-cyan-400/30'
                  : activeCircuit === 3
                  ? 'bg-amber-700/40 hover:bg-amber-700/60 border border-amber-500/30'
                  : 'bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/30'
              }`}
              style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}
              data-testid="menu-item-intro"
            >
              <RotateCcw className="w-6 h-6 text-gray-400" />
              <span className="font-medium">{t('nav.intro') || 'Intro'}</span>
            </button>

            {/* Дневник */}
            <button
              onClick={() => {
                setShowJournalModal(true);
                setShowMenu(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md text-white transition-all text-left ${
                activeCircuit === 2
                  ? 'bg-cyan-600/40 hover:bg-cyan-600/60 border border-cyan-400/30'
                  : activeCircuit === 3
                  ? 'bg-amber-700/40 hover:bg-amber-700/60 border border-amber-500/30'
                  : 'bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/30'
              }`}
              style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}
              data-testid="menu-item-diary"
            >
              <Circle className="w-6 h-6 text-cyan-400" />
              <span className="font-medium">{t('nav.diary')}</span>
            </button>

            {/* Статистика */}
            <button
              onClick={() => {
                setShowStatsModal(true);
                setShowMenu(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md text-white transition-all text-left ${
                activeCircuit === 2
                  ? 'bg-cyan-600/40 hover:bg-cyan-600/60 border border-cyan-400/30'
                  : activeCircuit === 3
                  ? 'bg-amber-700/40 hover:bg-amber-700/60 border border-amber-500/30'
                  : 'bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/30'
              }`}
              style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}
              data-testid="menu-item-statistics"
            >
              <Activity className="w-6 h-6 text-emerald-400" />
              <span className="font-medium">{t('nav.stats')}</span>
            </button>

            {/* OND Balance */}
            <button
              onClick={() => {
                setShowQntShop(true);
                setShowMenu(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md text-white transition-all text-left ${
                activeCircuit === 2
                  ? 'bg-cyan-600/40 hover:bg-cyan-600/60 border border-cyan-400/30'
                  : activeCircuit === 3
                  ? 'bg-amber-700/40 hover:bg-amber-700/60 border border-amber-500/30'
                  : 'bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/30'
              }`}
              style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}
              data-testid="menu-item-ond-balance"
            >
              <Star className="w-6 h-6 text-yellow-400" />
              <span className="font-medium">OND</span>
              <span className="ml-auto text-sm sm:text-base text-yellow-400 font-medium">{safeToFixed(qnt, 1)}</span>
            </button>

            {/* Рейтинг */}
            <button
              onClick={() => {
                setShowRatingModal(true);
                setShowMenu(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md text-white transition-all text-left ${
                activeCircuit === 2
                  ? 'bg-cyan-600/40 hover:bg-cyan-600/60 border border-cyan-400/30'
                  : activeCircuit === 3
                  ? 'bg-amber-700/40 hover:bg-amber-700/60 border border-amber-500/30'
                  : 'bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/30'
              }`}
              style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}
              data-testid="menu-item-leaderboard"
            >
              <Zap className="w-6 h-6 text-orange-400" />
              <span className="font-medium">{t('nav.rating')}</span>
            </button>

            {/* Язык */}
            <button
              onClick={() => {
                setShowLanguageModal(true);
                setShowMenu(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md text-white transition-all text-left ${
                activeCircuit === 2
                  ? 'bg-cyan-600/40 hover:bg-cyan-600/60 border border-cyan-400/30'
                  : activeCircuit === 3
                  ? 'bg-amber-700/40 hover:bg-amber-700/60 border border-amber-500/30'
                  : 'bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/30'
              }`}
              style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}
              data-testid="menu-item-language"
            >
              <Languages className="w-6 h-6 text-indigo-400" />
              <span className="font-medium">
                {i18n.language === 'en' ? 'English' :
                 i18n.language === 'es' ? 'Español' :
                 i18n.language === 'ru' ? 'Русский' :
                 i18n.language === 'uk' ? 'Українська' :
                 i18n.language === 'zh' ? '中文' : 'Language'}
              </span>
            </button>

            {/* Настройки */}
            <button
              onClick={() => {
                if (user) {
                  setShowSettingsModal(true);
                } else {
                  setShowAuthModal(true);
                }
                setShowMenu(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md text-white transition-all text-left ${
                activeCircuit === 2
                  ? 'bg-cyan-600/40 hover:bg-cyan-600/60 border border-cyan-400/30'
                  : activeCircuit === 3
                  ? 'bg-amber-700/40 hover:bg-amber-700/60 border border-amber-500/30'
                  : 'bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/30'
              }`}
              style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}
              data-testid="menu-item-settings"
            >
              <Settings className="w-6 h-6 text-blue-400" />
              <span className="font-medium">{t('nav.settings')}</span>
            </button>

            {/* Connection */}
            <button
              onClick={() => {
                setShowConnectionModal(true);
                setShowMenu(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md text-white transition-all text-left ${
                activeCircuit === 2
                  ? 'bg-cyan-600/40 hover:bg-cyan-600/60 border border-cyan-400/30'
                  : activeCircuit === 3
                  ? 'bg-amber-700/40 hover:bg-amber-700/60 border border-amber-500/30'
                  : 'bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/30'
              }`}
              style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}
              data-testid="menu-item-connection"
            >
              <Heart className="w-6 h-6 text-pink-400" />
              <span className="font-medium">{t('nav.connection')}</span>
            </button>

            {/* Разделитель */}
            <div className="border-t border-white/10 my-1"></div>

            {/* Login (если не залогинен) */}
            {!user && (
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setShowMenu(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md text-white transition-all text-left ${
                  activeCircuit === 2
                    ? 'bg-cyan-600/40 hover:bg-cyan-600/60 border border-cyan-400/30'
                    : activeCircuit === 3
                    ? 'bg-amber-700/40 hover:bg-amber-700/60 border border-amber-500/30'
                    : 'bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/30'
                }`}
                style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}
                data-testid="menu-item-login"
              >
                <User className="w-6 h-6 text-purple-400" />
                <span className="font-medium">{t('nav.login')}</span>
              </button>
            )}

            {/* User Profile (если залогинен) */}
            {user && (
              <button
                onClick={() => {
                  setShowProfileModal(true);
                  setShowMenu(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md text-white transition-all text-left ${
                  activeCircuit === 2
                    ? 'bg-cyan-600/40 hover:bg-cyan-600/60 border border-cyan-400/30'
                    : activeCircuit === 3
                    ? 'bg-amber-700/40 hover:bg-amber-700/60 border border-amber-500/30'
                    : 'bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/30'
                }`}
                style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}
                data-testid="menu-item-profile"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{userProfile?.display_name || 'User'}</div>
                  <div className="text-xs text-white/60 truncate">{user.email}</div>
                </div>
              </button>
            )}
        </nav>
      )}

    </div>
  );
};

export default OndaLevel1;