import { useState, useEffect, useRef, useMemo, useCallback, lazy, Suspense } from 'react';
import { Heart, Droplets, Wind, Mountain, Star, Lock, CheckCircle, Circle, X, Play, Pause, User, Settings, Activity, Zap, Menu, Languages, RotateCcw, DollarSign, Watch, Waves, Shield, Users, Bluetooth, Minimize2, Maximize2, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from './lib/supabase';
import { AuthModal } from './components/AuthModal';
import { UserProfile } from './components/UserProfile';
import { SettingsModal } from './components/SettingsModal';
import { ConnectionModal } from './components/ConnectionModal';
import LanguageModal from './components/LanguageModal';
import { OndShopModal } from './components/OndShopModal';
import { RemoteAudioPlayer } from './components/RemoteAudioPlayer';
import { VoiceCheckModal } from './components/VoiceCheckModal';
import { InfoModal } from './components/InfoModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { PermissionWarningBanner } from './components/PermissionWarningBanner';
import { PermissionSetupModal } from './components/PermissionSetupModal';
import { NotificationPrimerModal } from './components/NotificationPrimerModal';
import { WatchConnectionPrompt } from './components/WatchConnectionPrompt';
import { DebugMonitor } from './components/DebugMonitor';
import { MetricsWaveform } from './components/MetricsWaveform';
import { CameraPulseWindow } from './components/CameraPulseWindow';
// Home redesign 1.7.4 — new sections (Section 2 / 4 / 6).
import { HRVMiniChart } from './components/HRVMiniChart';
import { TodaysPracticeStateCard } from './components/TodaysPracticeStateCard';
import { JourneyAccordion } from './components/JourneyAccordion';
import { useHRV7Day } from './hooks/useHRV7Day';
import { usePracticesProgress } from './hooks/usePracticesProgress';
import { useTodaysPractice } from './hooks/useTodaysPractice';
import { useTheme } from './theme/ThemeProvider';
import type { UserProfile as UserProfileType } from './lib/supabase';
import { useVitals } from './hooks/useVitals';
import { useCameraPpg } from './hooks/useCameraPpg';
import { useHealthConnect } from './hooks/useHealthConnect';
import { useHealthKitData } from './hooks/useHealthKitData';
import { useHealthKitHeartRate } from './hooks/useHealthKitHeartRate';
import { useKeepAwake } from './hooks/useKeepAwake';
import { useWatchHeartRate } from './hooks/useWatchHeartRate';
import { usePermissions } from './hooks/usePermissions';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
// AppTrackingTransparency: импорт удалён в v1.7.3 — ATT-prompt отключён
// целиком. Если когда-нибудь захотим IDFA, возвращать через value-moment
// prompt после первой завершённой практики / пейволла, не на cold-start.
import OndaTenjin from './plugins/ondaTenjin';
import {
  initOneSignal,
  linkUserToOneSignal,
  unlinkUser as unlinkOneSignalUser,
  onPushOpened,
  setMarketingOptIn,
  getMarketingOptIn,
  registerOneSignalSubscription,
  registerIfAlreadyGranted,
} from './services/pushNotifications';
import { rhythmStore } from './sleep/rhythm';
import {
  reconcileStreakNudge,
  onNotificationOpened,
  getStreakEnabled,
  requestPermission as requestNotificationPermission,
} from './services/notifications';
import { calculatePracticeOnd } from './utils/ondCalculator';
import OndaWatch from './plugins/ondaWatch';
import { useAnalytics } from './hooks/useAnalytics';
import {
  trackTenjinPractice,
  trackTenjinAttResult,
  trackTenjinSignUp,
  trackTenjinSignIn,
  trackTenjinOnboardingComplete,
  trackTenjinFirstPracticeComplete,
  trackTenjinLevelUnlocked,
  trackTenjinCircuitComplete,
  trackTenjinArtifactEarned,
  initTenjinAppOpenTracking,
} from './lib/tenjin';
import { useSubscription } from './hooks/useSubscription';
import * as Sentry from '@sentry/capacitor';
// WelcomeScene is the only consumer of three.js in the codebase. It only
// mounts when the user starts a practice (`practiceState === 'active'`),
// not on cold start. Loading it lazily moves three.js + EXR loaders into
// a separate chunk that streams in when the practice begins, instead of
// sitting in the cold-start path. That's the chunk that was making the
// boot splash visible for ~6 seconds even after main-scene code-splitting.
const WelcomeScene = lazy(() => import('./components/WelcomeScene'));
// Экран eye-scan лениво — чтобы MediaPipe не попал в холодный старт.
const FaceCheckScreen = lazy(() => import('./components/FaceCheckScreen'));
import { PRACTICE_EXR, PRACTICE_JPEG_PREVIEW } from './constants/practiceAssets';

// Free-tier sampler. The first three basic practices of Part 1 are open to
// every visitor — no auth, no paywall — so the user can try the app before
// committing. Every other practice still goes through the paywall in
// `practice_gate_basic` (see the Start button below).
const FREE_PRACTICE_IDS = new Set(['p1-1', 'p1-2', 'p1-3']);

// Светлая тема «матовое свечение» (frosted glow) — прототип хаба.
// Космическая сцена по определению тёмная, прямой токен-свап невозможен,
// поэтому у каждого контура есть параллельная пастельная палитра: два
// мягких цветных блика (rgba) для люминесцентного фона + tailwind-класс
// рамки frosted-панели. Ключ — activeCircuit (2..12), иначе CIRCUIT_GLOW_DEFAULT.
const CIRCUIT_GLOW_LIGHT: Record<number, { orbA: string; orbB: string; panelBorder: string }> = {
  2:  { orbA: 'rgba(165,243,252,0.55)', orbB: 'rgba(186,230,253,0.45)', panelBorder: 'border-cyan-200/70' },
  3:  { orbA: 'rgba(253,230,138,0.55)', orbB: 'rgba(254,215,170,0.45)', panelBorder: 'border-amber-200/70' },
  4:  { orbA: 'rgba(153,246,228,0.55)', orbB: 'rgba(165,243,252,0.45)', panelBorder: 'border-teal-200/70' },
  5:  { orbA: 'rgba(254,240,138,0.55)', orbB: 'rgba(253,230,138,0.45)', panelBorder: 'border-amber-200/70' },
  6:  { orbA: 'rgba(167,243,208,0.55)', orbB: 'rgba(153,246,228,0.45)', panelBorder: 'border-emerald-200/70' },
  7:  { orbA: 'rgba(186,230,253,0.55)', orbB: 'rgba(191,219,254,0.45)', panelBorder: 'border-sky-200/70' },
  8:  { orbA: 'rgba(199,210,254,0.55)', orbB: 'rgba(221,214,254,0.45)', panelBorder: 'border-indigo-200/70' },
  9:  { orbA: 'rgba(254,240,138,0.65)', orbB: 'rgba(254,243,199,0.50)', panelBorder: 'border-yellow-300/80' },
  10: { orbA: 'rgba(254,215,170,0.55)', orbB: 'rgba(253,230,138,0.45)', panelBorder: 'border-orange-200/70' },
  11: { orbA: 'rgba(165,243,252,0.55)', orbB: 'rgba(153,246,228,0.45)', panelBorder: 'border-cyan-200/70' },
  12: { orbA: 'rgba(245,208,254,0.55)', orbB: 'rgba(251,207,232,0.45)', panelBorder: 'border-fuchsia-200/70' },
};
const CIRCUIT_GLOW_DEFAULT = { orbA: 'rgba(221,214,254,0.55)', orbB: 'rgba(199,210,254,0.45)', panelBorder: 'border-violet-200/70' };

const OndaLevel1 = () => {
  const { t, i18n } = useTranslation();
  const { resolved } = useTheme();
  const isLight = resolved === 'light';
  const vitalsData = useVitals();
  // Camera pulse — offered to no-watch users during a practice (Step 5). It
  // feeds useVitals through the shared pulse-source abstraction, so the wave +
  // bpm above light up automatically; coherence stays null for camera.
  const cameraPpg = useCameraPpg();
  const [cameraOfferDismissed, setCameraOfferDismissed] = useState(false);

  // Ref to store CURRENT vitals - updated every render, accessible in async functions
  const vitalsRef = useRef(vitalsData);
  vitalsRef.current = vitalsData;
  
  const healthConnectData = useHealthConnect();
  const healthKitData = useHealthKitData();
  const healthKitHeartRate = useHealthKitHeartRate({ pollingInterval: 1500 });
  const watchHeartRate = useWatchHeartRate();
  const permissions = usePermissions();
  const { track, trackPractice } = useAnalytics();
  const { isPremium, isLoading: isSubLoading, refresh: refreshSubscription } = useSubscription();
  const platform = Capacitor.getPlatform();
  const [pendingStartPracticeAfterSubscribe, setPendingStartPracticeAfterSubscribe] = useState(false);
  
  useKeepAwake(true);
  
  // Track app open on mount
  useEffect(() => {
    track('app_open', { platform });
    // Airbridge App Open (cold start + resume). Safe no-op on web / before SDK attaches.
    initTenjinAppOpenTracking();

    // Tenjin connect на каждом cold-start.
    //
    // ATT-prompt в v1.7.3 убран целиком: на indie-масштабе opt-in 20–30%
    // не окупает install-friction. Атрибуция идёт по SKAdNetwork (postbacks
    // приходят независимо от ATT) + AdServices для Apple Search Ads. Tenjin
    // SDK сам определит ATT.notDetermined и пойдёт по SKAN-only пути.
    // Если когда-нибудь решим вернуть IDFA — делать это надо value-moment
    // prompt'ом (после 1-й завершённой практики или пейволла), не на холодном
    // старте. Подсказка: см. историю handleOnboardingNext до v1.7.3.
    if (Capacitor.isNativePlatform()) {
      OndaTenjin.connect().catch((e) =>
        console.warn('[boot] Tenjin connect failed', e),
      );

      // OneSignal SDK bootstrap. Safe to call on every cold start —
      // init is internally idempotent. We init regardless of ATT so the
      // device gets a subscription_id; what we DON'T do is collect any
      // analytics until consent (set via setConsentGiven inside the
      // service).
      initOneSignal();

      // If iOS notification permission is ALREADY granted (2nd+ cold
      // start, or user toggled it on in Settings between sessions),
      // sync OneSignal's subscription state. This will not prompt —
      // it's gated on `display === 'granted'` inside the helper. On a
      // fresh install where permission is still 'notDetermined', this
      // no-ops and the onboarding flow owns the prompt instead.
      registerIfAlreadyGranted();

      // Wire push-open handler once. Bridge to Tenjin / Sentry breadcrumb
      // later — for now we just log for visibility.
      const offPushOpened = onPushOpened((info) => {
        console.log('[push] notification opened →', info);
      });
      return () => {
        offPushOpened();
      };
    }
  }, []);

  const prevActivePracticeIdRef = useRef<string | null>(null);
  const exitPracticeCalledRecentlyRef = useRef<number>(0);
  // Tracks which user id we've already emitted Sign Up / Sign In for this
  // session so SIGNED_IN repeats (rare edge: re-login without logout) don't
  // double-fire. Reset on SIGNED_OUT.
  const lastAuthFiredForUserRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pendingStartPracticeAfterSubscribe) return;
    if (!isPremium) return;
    console.warn('[DEBUG basic] Auto-start firing from pendingStartPracticeAfterSubscribe effect', {
      practiceId: activePractice?.id ?? null,
      practiceState,
    });
    track('practice_intro_closed_debug', {
      surface: 'basic',
      reason: 'auto_start_after_subscribe',
      practiceId: activePractice?.id ?? null,
      practiceState,
    });
    setPendingStartPracticeAfterSubscribe(false);
    beginPractice();
  }, [pendingStartPracticeAfterSubscribe, isPremium]);

  // Track first heart rate from watch (successful connection)
  const hasTrackedWatchConnection = useRef(false);
  useEffect(() => {
    if (watchHeartRate.heartRate && !hasTrackedWatchConnection.current) {
      hasTrackedWatchConnection.current = true;
      track('watch_connect_success', {
        heart_rate: watchHeartRate.heartRate,
        is_connected: watchHeartRate.isConnected,
      });
    }
  }, [watchHeartRate.heartRate]);
  
  // Когда разрешения есть → отдаём управление workout-сессией app-lifecycle
  // менеджеру (вместо безусловного старта на mount). Он держит HKWorkoutSession
  // пока приложение на переднем плане ИЛИ идёт практика, и глушит её иначе —
  // больше нет сессии-«на-весь-день» (батарея + Apple Fitness загрязнение).
  useEffect(() => {
    if (!permissions.needsSetup && platform === 'ios') {
      if (Capacitor.isPluginAvailable('OndaWatch')) {
        console.log('[OndaLevel1] Разрешения есть → включаю auto-managed workout lifecycle');
        watchHeartRate.setAutoManaged(true);
      } else {
        console.error('[OndaLevel1] ❌ OndaWatch plugin NOT AVAILABLE or not registered!');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const [practiceOpenedAtMs, setPracticeOpenedAtMs] = useState<number | null>(null);
  const [canExitPractice, setCanExitPractice] = useState(true);
  const [practiceHistory, setPracticeHistory] = useState([]);

  // ─── Home redesign 1.7.4: derived/auxiliary state for new sections ───
  // Streak + total over the user's entire practice history (Section 4).
  const practicesProgress = usePracticesProgress(practiceHistory);
  // 7-day HRV trend, client-side daily log (Section 4). Recording is wired
  // up in a useEffect further down so the value follows fresh vitalsData.
  const hrv7Day = useHRV7Day();
  // Section 2 state machine — A (no watch) / B (collecting, 30 s) / C (pick).
  const todaysPractice = useTodaysPractice({
    isWatchConnected: watchHeartRate.isConnected,
    freePracticeIds: ['p1-1', 'p1-2', 'p1-3'],
  });

  // Section 6 — "Your Journey" collapsible. Always starts closed on every
  // mount (intentional: the redesign goal is that a biohacker's first
  // impression is product, not poem). State is *not* persisted across
  // sessions. The lore blocks scattered below are each wrapped in
  // `{journeyOpen && (...)}`, and the toggle button lives just before
  // them in the page flow.
  const [journeyOpen, setJourneyOpen] = useState(false);

  // Featured (a.k.a. "Today's") practice — always picks a concrete free
  // practice so Section 2 can render an actual Start button. Selection
  // is deterministic so the picked card doesn't flicker between renders:
  //   1. First free practice that hasn't been completed yet.
  //   2. Else the most recent free practice from history (so a returning
  //      user lands on the one they last did).
  //   3. Else `p1-1` as ultimate fallback.
  const featuredPracticeId = useMemo(() => {
    const freeIds = ['p1-1', 'p1-2', 'p1-3'];
    const cp = completedPractices as Record<string, unknown>;
    const uncompleted = freeIds.find(id => !cp[id]);
    if (uncompleted) return uncompleted;
    const lastFree = (practiceHistory as any[]).find(s => freeIds.includes(s?.practiceId));
    if (lastFree) return lastFree.practiceId as string;
    return freeIds[0];
  }, [completedPractices, practiceHistory]);

  // Stream the latest HRV reading into the 7-day daily log.
  //
  // HONESTY: this log feeds HRVMiniChart, which labels its values as real
  // HRV in milliseconds ("{value} ms", aria "HRV trend"). So it must be fed
  // the REAL resting HRV — Apple Watch's own SDNN read from HealthKit
  // (HealthKitHeartRatePlugin queries .heartRateVariabilitySDNN) — NOT the
  // HR-derived surrogate from useVitals (std-dev of HR, not true HRV, not in
  // ms). Feeding the surrogate here was the same mislabel we removed on the
  // practice screen. On platforms / sessions without a real HealthKit SDNN
  // the value is undefined → recordSample no-ops → the chart shows its
  // "need more data" stub rather than a fabricated trend.
  // TODO(android): surface a real Health Connect HRV value and record it too.
  useEffect(() => {
    hrv7Day.recordSample(healthKitData.data?.vitals?.hrv);
  }, [healthKitData.data?.vitals?.hrv, hrv7Day.recordSample]);

  // Notification Primer — показываем ПОСЛЕ 6 завершённых практик, не
  // на старте и не в онбординге. Логика: пуш о напоминаниях имеет смысл,
  // когда юзер уже втянулся; ранний prompt = низкий opt-in + ощущение
  // спама. v1.7.3: онбординг и ATT-prompt убраны, primer триггерится
  // по practiceHistory.length. Порог поднят 2 → 6 — даём прочувствовать
  // ценность глубже, прежде чем просить разрешение на пуши.
  // ВАЖНО: этот useEffect должен идти ПОСЛЕ объявления practiceHistory —
  // иначе TDZ (`Cannot access 'practiceHistory' before initialization`).
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    if (practiceHistory.length < 6) return;
    if (localStorage.getItem('onda_notification_primer_shown') === 'true') return;
    setShowNotificationPrimer(true);
    localStorage.setItem('onda_notification_primer_shown', 'true');
  }, [practiceHistory.length]);
  const [activePractice, setActivePractice] = useState(null);
  const [practiceState, setPracticeState] = useState('intro');
  const [practiceTime, setPracticeTime] = useState(0);

  // Workout lifecycle ↔ практика: сообщаем watch-хуку, когда практика активна,
  // чтобы (1) HKWorkoutSession НЕ глушилась при уходе в фон во время практики
  // (autonomy — переживаем диалог микрофона / заблокированный телефон), и
  // (2) глушилась сразу, если практика закончилась пока приложение в фоне.
  // Объявлено ПОСЛЕ practiceState, чтобы избежать TDZ.
  useEffect(() => {
    watchHeartRate.setPracticeActive(practiceState === 'active');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practiceState]);

  // Monitor activePractice transitions. Catches ANY path that closes the practice,
  // including paths that bypass exitPractice (setState via closure, unmount, etc).
  // Must be declared AFTER activePractice/practiceState/practiceTime useState to avoid TDZ.
  useEffect(() => {
    const prevId = prevActivePracticeIdRef.current;
    const currId = activePractice?.id ?? null;
    prevActivePracticeIdRef.current = currId;
    if (prevId && !currId) {
      const sinceExit = Date.now() - exitPracticeCalledRecentlyRef.current;
      const viaExitPractice = sinceExit < 100;
      track('practice_intro_closed_debug', {
        surface: 'basic',
        reason: viaExitPractice ? 'monitor_after_exit' : 'monitor_unknown_source',
        msSinceOpen: practiceOpenedAtMs ? Date.now() - practiceOpenedAtMs : null,
        prevPracticeId: prevId,
        practiceState,
        practiceTime,
        sinceExit,
      });
      console.warn('[DEBUG monitor] activePractice cleared', {
        prevId,
        viaExitPractice,
        sinceExit,
      });
    }
  }, [activePractice]);
  const [isPaused, setIsPaused] = useState(false);
  const [isMinimalMode, setIsMinimalMode] = useState(false);
  const [qualityScore, setQualityScore] = useState(0);
  // Honest post-practice signal shown on the results screen (replaces the
  // gamified OND/Quality block). State A|B|C decided at finish; B carries a
  // real, sustained camera pulse drop {hrStart→hrMin}.
  const [honestResult, setHonestResult] = useState<{ state: 'A' | 'B' | 'C'; hrStart: number | null; hrMin: number | null } | null>(null);
  const [practiceRating, setPracticeRating] = useState(0);
  const [showJournal, setShowJournal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [expandedPractice, setExpandedPractice] = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showVoiceCheck, setShowVoiceCheck] = useState(false);
  const [showFaceCheck, setShowFaceCheck] = useState(false);
  const [emotionalState, setEmotionalState] = useState(null);
  // Whether the user has ever opened the Voice Check — drives the
  // one-time FREE badge on its button. Persisted so it stays hidden
  // across sessions once used.
  const [voiceCheckUsed, setVoiceCheckUsed] = useState<boolean>(
    () => typeof localStorage !== 'undefined' && localStorage.getItem('onda_emotional_check_used') === 'true',
  );
  // One-time FREE badge on the «Взгляд на себя» (eye-scan) button.
  const [faceCheckUsed, setFaceCheckUsed] = useState<boolean>(
    () => typeof localStorage !== 'undefined' && localStorage.getItem('onda_nervous_scan_used') === 'true',
  );
  // Free practices the user has already tapped Start on — drives the
  // one-time FREE badge. Persisted; the badge disappears the moment the
  // practice is opened, not when it's finished.
  const [tappedFreePractices, setTappedFreePractices] = useState<Set<string>>(() => {
    try {
      return new Set<string>(JSON.parse(localStorage.getItem('onda_tapped_free_practices') || '[]'));
    } catch {
      return new Set<string>();
    }
  });
  const markFreePracticeTapped = (id: string) => {
    if (!FREE_PRACTICE_IDS.has(id) || tappedFreePractices.has(id)) return;
    const next = new Set(tappedFreePractices);
    next.add(id);
    setTappedFreePractices(next);
    localStorage.setItem('onda_tapped_free_practices', JSON.stringify([...next]));
  };
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
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [gameProgress, setGameProgress] = useState<UserGameProgress | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showNotificationPrimer, setShowNotificationPrimer] = useState(false);
  const [showWatchPrompt, setShowWatchPrompt] = useState(false);
  const [showQntShop, setShowQntShop] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  // UX surface that opened the paywall — propagated to Airbridge as the
  // `source` field on View Paywall / Dismiss Paywall. Set right next to
  // each setShowSubscriptionModal(true) call.
  const [paywallSource, setPaywallSource] = useState<string | null>(null);
  const [infoModalMessage, setInfoModalMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [activeView, setActiveView] = useState<'main' | 'addon'>('main');
  // v1.7.3: онбординг временно скрыт — юзер сразу попадает в хаб.
  // Меню «Intro» по-прежнему может его открыть вручную (для QA / legacy).
  // Авто-показ на холодном старте отключён.
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingScreen, setOnboardingScreen] = useState(1);
  // Timestamp of the first render while onboarding is visible — used to
  // attach `duration_seconds` to the Airbridge `Complete Onboarding` event.
  const onboardingStartRef = useRef<number | null>(null);

  // Onboarding refactor: one light first-run screen, shown once to a
  // brand-new install on cold start. Its single CTA drops the user
  // straight into the featured FREE practice intro (shortest path to the
  // live "during" experience); the visible skip goes to the hub. The
  // legacy 3-screen tutorial above stays reachable via Menu → Intro.
  // Suppressed for anyone who already passed a first-run surface or has
  // already engaged with practices (upgraders must not see it).
  const [showFirstRun, setShowFirstRun] = useState<boolean>(() => {
    if (typeof localStorage === 'undefined') return false;
    if (localStorage.getItem('onda_first_run_done') === 'true') return false;
    // Graduated from the legacy 3-screen onboarding (pre-1.7.3 installs).
    if (localStorage.getItem('onda_onboarding_completed') === 'true') return false;
    // Already validly completed a practice at some point (any version).
    if (localStorage.getItem('onda_airbridge_first_practice_tracked') === '1') return false;
    try {
      // Already opened at least one free practice from the hub.
      const tapped = JSON.parse(localStorage.getItem('onda_tapped_free_practices') || '[]');
      if (Array.isArray(tapped) && tapped.length > 0) return false;
    } catch {
      // corrupted flag — treat as new install
    }
    return true;
  });
  // First view timestamp → `duration_seconds` on tutorial_complete, so the
  // old (3-screen) and new (1-screen) first-run funnels stay comparable.
  const firstRunShownAtRef = useRef<number | null>(null);
  // Armed by finishPractice on the user's first-ever valid completion;
  // consumed by exitPractice so the paywall opens AFTER the user leaves
  // the results screen — value felt first, offer second, never before.
  const postFirstExperiencePaywallArmedRef = useRef(false);
  // True only while the practice currently on screen was launched straight
  // from the first-run welcome CTA. Drives the results-screen button to read
  // "Enter ONDA" instead of "Back to Practices" — in the first run the user
  // has never seen a practices list to go "back" to; this button is their
  // first entry into the app. Reset on exitPractice.
  const [cameFromFirstRun, setCameFromFirstRun] = useState(false);

  // A/B test for the ATT rationale copy on onboarding screen 1.
  //   variant 'a' — original ("...помогаешь нам расти...")
  //   variant 'b' — "...показывать ONDA людям, которым она реально нужна..."
  // Assigned once per install, 50/50, persisted so the user always sees
  // the same copy. The att_prompt_result event carries the variant so
  // we can compare ATT opt-in rate per variant in Supabase later.
  const attCopyVariantRef = useRef<'a' | 'b'>(
    (() => {
      if (typeof localStorage === 'undefined') return 'a';
      let v = localStorage.getItem('onda_att_copy_variant');
      if (v !== 'a' && v !== 'b') {
        v = Math.random() < 0.5 ? 'a' : 'b';
        localStorage.setItem('onda_att_copy_variant', v);
      }
      return v as 'a' | 'b';
    })(),
  );
  if (showOnboarding && onboardingStartRef.current === null) {
    onboardingStartRef.current = Date.now();
  }

  // Track views of the two permission-rationale screens of onboarding.
  // Screen 1 precedes the ATT prompt, screen 2 precedes the iOS
  // notifications prompt. Combined with att_prompt_result /
  // notification_prompt_result this gives a full permission funnel:
  // screen seen → system prompt answered.
  useEffect(() => {
    if (!showOnboarding) return;
    if (onboardingScreen !== 1 && onboardingScreen !== 2) return;
    track('onboarding_permission_screen_view', {
      screen: onboardingScreen,
      permission: onboardingScreen === 1 ? 'att' : 'notifications',
      att_copy_variant: attCopyVariantRef.current,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOnboarding, onboardingScreen]);

  // Legacy 3-screen tutorial — DEMOTED to Menu → Intro; NOT shown to new
  // installs (see showFirstRun below for the live onboarding). Manual replays
  // still emit the funnel, so every event is tagged source:'menu' to keep them
  // OUT of the new-user funnel (which filters source:'first_run'). Here
  // onboarding_step is meaningful (3 screens). Tenjin/Axon get completion via
  // tutorial_complete separately.
  const onboardingStartTrackedRef = useRef(false);
  useEffect(() => {
    if (!showOnboarding) return;
    if (!onboardingStartTrackedRef.current) {
      onboardingStartTrackedRef.current = true;
      track('onboarding_start', { source: 'menu', att_copy_variant: attCopyVariantRef.current });
    }
    track('onboarding_step', {
      source: 'menu',
      step: onboardingScreen,
      total: 3,
      permission:
        onboardingScreen === 1 ? 'att' : onboardingScreen === 2 ? 'notifications' : 'none',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOnboarding, onboardingScreen]);

  // First-run welcome = the LIVE new-install onboarding (one screen). Its view
  // IS the canonical funnel start for new users → fire onboarding_start with
  // source:'first_run'. No onboarding_step: one screen has no steps. The
  // cta/skip outcome rides on onboarding_complete (completed_via) in
  // dismissFirstRun below.
  useEffect(() => {
    if (!showFirstRun) return;
    if (firstRunShownAtRef.current !== null) return;
    firstRunShownAtRef.current = Date.now();
    track('onboarding_start', { source: 'first_run', featured_practice_id: featuredPracticeId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFirstRun]);

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
  // Coherence training-signal capture for the session record: baseline at
  // start + running peak during the session → max delta (peak − baseline),
  // mirroring how best stress/energy were tracked. Refs (not displayed live).
  const initialCoherenceRef = useRef<number | null>(null);
  const peakCoherenceRef = useRef<number | null>(null);
  // Honest pulse-trend capture for the camera results signal: start HR (first
  // confident bpm, not t=0), a SUSTAINED min (EWMA-smoothed so a single low
  // outlier can't mint a flattering number), and confident-coverage counters.
  const initialHrRef = useRef<number | null>(null);
  const minHrRef = useRef<number | null>(null);
  const hrSmoothRef = useRef<number>(-1);
  const hrConfidentTicksRef = useRef<number>(0);
  const hrTotalTicksRef = useRef<number>(0);
  // Sticky session HR source — the source that actually drove the session, so
  // lifting the finger right before tapping "End" doesn't flip metrics_source
  // (and the result state) to 'simulated' at the finish instant.
  const sessionHrSourceRef = useRef<string | null>(null);
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

    // Periodic UI refresh + HealthKit re-sync.
    // Every 30 seconds was overkill — sleep data only updates once per day
    // (after the user's morning sync from Apple Watch). Pulling 14 days of
    // history twice a minute drains battery for no benefit. 10-minute
    // cadence is plenty to catch the morning sync, and an explicit foreground
    // sync still happens on app open above.
    const id = setInterval(() => {
      rhythmStore.syncFromHealthKit().catch(() => {});
      setRhythmProgress(rhythmStore.progress());
      setRhythmLog(rhythmStore.getLog());
    }, 10 * 60 * 1000); // 10 minutes
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

  // Добавляем артефакт "Спокойная Сила" за 6 практик части 5 с качеством 100%
  const CALM_POWER_ARTIFACT_ID = 'calm-power';
  useEffect(() => {
    const hasCalmPowerArtifact = artifacts.some(a => a.id === CALM_POWER_ARTIFACT_ID);
    // Считаем практики части 5 (p5-*) с качеством 100%
    const part5PerfectPractices = practiceHistory.filter(p => 
      p.practiceId?.startsWith('p5-') && p.quality >= 100
    ).length;
    
    if (part5PerfectPractices >= 6 && !hasCalmPowerArtifact) {
      console.log('[App] Calm Power artifact unlocked! +20% OND bonus');
      setArtifacts(prev => [...prev, {
        id: CALM_POWER_ARTIFACT_ID,
        name: t('artifacts.calm_power'),
        bonus: 20,
        isCalmPower: true
      }]);
    }
  }, [practiceHistory, artifacts]);

  // Добавляем артефакт "Язык Тела" за 6 практик части 6 с качеством 100%
  const BODY_LANGUAGE_ARTIFACT_ID = 'body-language';
  useEffect(() => {
    const hasBodyLanguageArtifact = artifacts.some(a => a.id === BODY_LANGUAGE_ARTIFACT_ID);
    const part6PerfectPractices = practiceHistory.filter(p => 
      p.practiceId?.startsWith('p6-') && p.quality >= 100
    ).length;
    
    if (part6PerfectPractices >= 6 && !hasBodyLanguageArtifact) {
      console.log('[App] Body Language artifact unlocked! +30% OND bonus');
      setArtifacts(prev => [...prev, {
        id: BODY_LANGUAGE_ARTIFACT_ID,
        name: t('artifacts.body_language'),
        bonus: 30,
        isBodyLanguage: true
      }]);
    }
  }, [practiceHistory, artifacts]);

  // Добавляем артефакт "Безмолвное Понимание" за 12 практик части 6 с качеством 100%
  const SILENT_UNDERSTANDING_ARTIFACT_ID = 'silent-understanding';
  useEffect(() => {
    const hasSilentUnderstandingArtifact = artifacts.some(a => a.id === SILENT_UNDERSTANDING_ARTIFACT_ID);
    const part6PerfectPractices = practiceHistory.filter(p => 
      p.practiceId?.startsWith('p6-') && p.quality >= 100
    ).length;
    
    if (part6PerfectPractices >= 12 && !hasSilentUnderstandingArtifact) {
      console.log('[App] Silent Understanding artifact unlocked! +50% OND bonus');
      setArtifacts(prev => [...prev, {
        id: SILENT_UNDERSTANDING_ARTIFACT_ID,
        name: t('artifacts.silent_understanding'),
        bonus: 50,
        isSilentUnderstanding: true
      }]);
    }
  }, [practiceHistory, artifacts]);

  // Добавляем артефакт "Эхо Власти" за 12 практик части 5 с качеством 100%
  const ECHO_OF_POWER_ARTIFACT_ID = 'echo-of-power';
  useEffect(() => {
    const hasEchoOfPowerArtifact = artifacts.some(a => a.id === ECHO_OF_POWER_ARTIFACT_ID);
    // Считаем практики части 5 (p5-*) с качеством 100%
    const part5PerfectPractices = practiceHistory.filter(p => 
      p.practiceId?.startsWith('p5-') && p.quality >= 100
    ).length;
    
    if (part5PerfectPractices >= 12 && !hasEchoOfPowerArtifact) {
      console.log('[App] Echo of Power artifact unlocked! +50% OND bonus');
      setArtifacts(prev => [...prev, {
        id: ECHO_OF_POWER_ARTIFACT_ID,
        name: t('artifacts.echo_of_power'),
        bonus: 50,
        isEchoOfPower: true
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
              selected_chapter: 1
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
          // Миграция: удаляем старый артефакт Territory Pulse (circuitId: 5) для пересоздания с новыми параметрами
          const migratedArtifacts = (progress.artifacts || []).filter((a: any) => a.circuitId !== 5);
          setArtifacts(migratedArtifacts);
          setUnlockedAchievements(progress.unlocked_achievements || []);
          setBioMetrics(progress.bio_metrics || {
            heartRate: 72,
            hrv: 45,
            spo2: 98,
            temp: 36.6,
            stability: 100
          });
          setSleepTracking(progress.sleep_tracking || { day: 0, lastCheck: null });
          // Restore the user's saved language. Earlier this branch
          // unconditionally set EN here, which was the second of two
          // force-English bugs (the first being src/i18n.ts wiping
          // localStorage on init). Now we only override if Supabase has
          // a saved choice — and we trust the language detector / user's
          // last manual pick if Supabase is empty.
          if (progress.selected_language) {
            const supaLang = String(progress.selected_language).toUpperCase();
            const i18nLang = supaLang.toLowerCase();
            const supportedUpper = ['EN', 'ES', 'RU', 'UK', 'ZH'];
            if (supportedUpper.includes(supaLang)) {
              setSelectedLanguage(supaLang);
              if (i18n.language !== i18nLang) {
                i18n.changeLanguage(i18nLang);
              }
            }
          } else {
            // No saved choice — sync the local state to whatever the
            // detector picked so the picker UI shows the right one.
            const detected = (i18n.language || 'en').slice(0, 2).toUpperCase();
            setSelectedLanguage(detected);
          }
          setSelectedLevel(progress.selected_level || 1);
          setSelectedChapter(progress.selected_chapter || 1);
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
        // Airbridge Sign Up / Sign In — fire only on actual sign-in transitions,
        // not on INITIAL_SESSION / TOKEN_REFRESHED / USER_UPDATED (those fire
        // every cold start and every hour-ish and would double-count).
        if (_event === 'SIGNED_IN') {
          try {
            const u = session.user;
            const rawMethod = (u.app_metadata?.provider as string | undefined) ?? 'email';
            const method: 'email' | 'apple' | 'google' =
              rawMethod === 'apple' ? 'apple' : rawMethod === 'google' ? 'google' : 'email';
            // New user heuristic: on first sign-in Supabase sets last_sign_in_at
            // ≈ created_at. On subsequent sign-ins last_sign_in_at > created_at
            // by the elapsed gap. 5s tolerance covers confirmation round-trip.
            const createdAt = Date.parse(u.created_at ?? '');
            const lastSignIn = Date.parse(u.last_sign_in_at ?? u.created_at ?? '');
            const isNewUser =
              Number.isFinite(createdAt) &&
              Number.isFinite(lastSignIn) &&
              Math.abs(lastSignIn - createdAt) < 5000;
            // Guard against double-fire from rapid re-entries with the same user id.
            if (lastAuthFiredForUserRef.current !== u.id) {
              lastAuthFiredForUserRef.current = u.id;
              if (isNewUser) {
                trackTenjinSignUp(method);
              } else {
                trackTenjinSignIn(method);
              }
            }
          } catch (e) {
            console.warn('[Airbridge] auth-event tracking failed:', e);
          }
        }
        setUser(session.user);
        // Link the device to this Supabase user inside OneSignal so
        // server-side pushes can target by user id (not just device).
        // Cheap and idempotent — safe to call on every auth event.
        try { linkUserToOneSignal(session.user.id); } catch {}
        loadUserData();
      } else {
        lastAuthFiredForUserRef.current = null;
        setUser(null);
        setUserProfile(null);
        setGameProgress(null);
        try { unlinkOneSignalUser(); } catch {}
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
    selectedChapter
  ]);

  useEffect(() => {
    setActiveCircuit(selectedLevel);
    setSelectedChapter(Math.ceil(selectedLevel / 3));
  }, [selectedLevel]);

  // Сбрасываем addon-вид при переключении части
  useEffect(() => {
    setActiveView('main');
  }, [activeCircuit]);

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

        // Coherence training signal: capture baseline (first valid reading)
        // and running peak → the session's max coherence delta. The honest
        // "you raised your heart–breath sync by X" metric that replaces the
        // removed stress/energy verdict.
        if (freshVitals.coherence != null) {
          if (initialCoherenceRef.current == null) initialCoherenceRef.current = freshVitals.coherence;
          peakCoherenceRef.current = Math.max(peakCoherenceRef.current ?? freshVitals.coherence, freshVitals.coherence);
        }

        // Honest pulse-trend capture (camera results signal). Start = the FIRST
        // confident bpm whenever the camera locks — NOT a fixed 10s-from-practice
        // window: the camera is started by a button mid-practice, so anchoring
        // start to t=0 left hrStart null whenever the lock happened later. The
        // camera's "don't bluff" gate already makes the first committed bpm a
        // valid baseline. min is tracked on an EWMA-smoothed HR, and only after
        // it settles (≥3 confident samples) → a single low outlier can't make a
        // pretty number. Coverage = confident ticks / total ticks.
        const liveHr = freshVitals.hr;
        if (liveHr != null && initialHrRef.current == null) initialHrRef.current = liveHr;
        // Coverage counts only AFTER the camera first locked — the pre-camera
        // dead time (before the user started it) must not dilute coverage.
        if (initialHrRef.current != null) {
          hrTotalTicksRef.current += 1;
          if (liveHr != null) {
            hrConfidentTicksRef.current += 1;
            if (freshVitals.hrSource) sessionHrSourceRef.current = freshVitals.hrSource;
            hrSmoothRef.current = hrSmoothRef.current < 0 ? liveHr : hrSmoothRef.current * 0.7 + liveHr * 0.3;
            if (hrConfidentTicksRef.current >= 3) {
              minHrRef.current = minHrRef.current == null ? hrSmoothRef.current : Math.min(minHrRef.current, hrSmoothRef.current);
            }
          }
        }

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
          // No tracker / signal dropped (e.g. camera lost the finger mid-session).
          // Progress must NEVER fall back: without a tracker rawQuality is a low
          // time-based value (~timeProgress*0.2), so a direct assign yanked the
          // bar down from the tracker value to ~20 every time the finger lifted.
          // Hold instead (floor at the current value); time-based growth can
          // still push it up, and the tracker branch resumes when signal returns.
          newQuality = Math.max(currentQuality, rawQuality);
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
    },
    'p4-3': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.audio_scan_message'),
      ambientSound: t('elements.silence'),
      visual: '👂',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p4_3', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p4_3'),
      scienceInfo: t('science_info.p4_3', { returnObjects: true }) as string[]
    },
    'p4-4': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.mammalian_neck_message'),
      ambientSound: t('elements.silence'),
      visual: '🦒',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p4_4', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p4_4'),
      scienceInfo: t('science_info.p4_4', { returnObjects: true }) as string[]
    },
    'p4-5': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.tail_reset_message'),
      ambientSound: t('elements.silence'),
      visual: '🐆',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p4_5', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p4_5'),
      scienceInfo: t('science_info.p4_5', { returnObjects: true }) as string[]
    },
    'p4-6': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.lymphatic_drift_message'),
      ambientSound: t('elements.silence'),
      visual: '💧',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p4_6', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p4_6'),
      scienceInfo: t('science_info.p4_6', { returnObjects: true }) as string[]
    },
    'p4-7': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.deep_in_quick_out_message'),
      ambientSound: t('elements.breath'),
      visual: '💨',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p4_7', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p4_7'),
      scienceInfo: t('science_info.p4_7', { returnObjects: true }) as string[]
    },
    'p4-8': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.distance_barrier_message'),
      ambientSound: t('elements.silence'),
      visual: '🛡️',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p4_8', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p4_8'),
      scienceInfo: t('science_info.p4_8', { returnObjects: true }) as string[]
    },
    'p4-9': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.trajectory_detection_message'),
      ambientSound: t('elements.silence'),
      visual: '🎯',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p4_9', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p4_9'),
      scienceInfo: t('science_info.p4_9', { returnObjects: true }) as string[]
    },
    'p4-10': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.shadow_maneuvering_message'),
      ambientSound: t('elements.silence'),
      visual: '🕺',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p4_10', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p4_10'),
      scienceInfo: t('science_info.p4_10', { returnObjects: true }) as string[]
    },
    'p4-11': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.sensory_bypass_message'),
      ambientSound: t('elements.silence'),
      visual: '🦶',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p4_11', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p4_11'),
      scienceInfo: t('science_info.p4_11', { returnObjects: true }) as string[]
    },
    'p4-12': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.tonic_fluidity_message'),
      ambientSound: t('elements.silence'),
      visual: '⚡',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p4_12', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p4_12'),
      scienceInfo: t('science_info.p4_12', { returnObjects: true }) as string[]
    },
    'p5-1': {
      colors: 'from-stone-800 via-stone-700 to-stone-600',
      element: 'TERRA',
      elementMessage: t('practice_messages.mass_center_message'),
      ambientSound: t('elements.earth_breathes'),
      visual: '⚖️',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p5_1', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p5_1'),
      scienceInfo: t('science_info.p5_1', { returnObjects: true }) as string[]
    },
    'p5-2': {
      colors: 'from-slate-800 via-slate-700 to-slate-600',
      element: 'AQUA',
      elementMessage: t('practice_messages.vagal_brake_message'),
      ambientSound: t('elements.silence'),
      visual: '🫀',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p5_2', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p5_2'),
      scienceInfo: t('science_info.p5_2', { returnObjects: true }) as string[]
    },
    'p5-3': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.lymphatic_lock_message'),
      ambientSound: t('elements.silence'),
      visual: '🫁',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p5_3', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p5_3'),
      scienceInfo: t('science_info.p5_3', { returnObjects: true }) as string[]
    },
    'p5-4': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.gravity_grounding_message'),
      ambientSound: t('elements.silence'),
      visual: '🪨',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p5_4', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p5_4'),
      scienceInfo: t('science_info.p5_4', { returnObjects: true }) as string[]
    },
    'p5-5': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.testosterone_vertical_message'),
      ambientSound: t('elements.silence'),
      visual: '🧍',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p5_5', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p5_5'),
      scienceInfo: t('science_info.p5_5', { returnObjects: true }) as string[]
    },
    'p5-6': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.protected_heart_message'),
      ambientSound: t('elements.silence'),
      visual: '🛡️',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p5_6', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p5_6'),
      scienceInfo: t('science_info.p5_6', { returnObjects: true }) as string[]
    },
    'p5-7': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.silent_roar_message'),
      ambientSound: t('elements.silence'),
      visual: '🦁',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p5_7', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p5_7'),
      scienceInfo: t('science_info.p5_7', { returnObjects: true }) as string[]
    },
    'p5-8': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.territorial_gaze_message'),
      ambientSound: t('elements.silence'),
      visual: '👁️',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p5_8', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p5_8'),
      scienceInfo: t('science_info.p5_8', { returnObjects: true }) as string[]
    },
    'p5-9': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.heart_coherence_message'),
      ambientSound: t('elements.silence'),
      visual: '💓',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p5_9', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p5_9'),
      scienceInfo: t('science_info.p5_9', { returnObjects: true }) as string[]
    },
    'p5-10': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.solid_aura_message'),
      ambientSound: t('elements.silence'),
      visual: '🔮',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p5_10', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p5_10'),
      scienceInfo: t('science_info.p5_10', { returnObjects: true }) as string[]
    },
    'p5-11': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.tigers_path_message'),
      ambientSound: t('elements.silence'),
      visual: '🐅',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p5_11', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p5_11'),
      scienceInfo: t('science_info.p5_11', { returnObjects: true }) as string[]
    },
    'p5-12': {
      colors: 'from-blue-900 via-cyan-800 to-teal-700',
      element: 'AQUA',
      elementMessage: t('practice_messages.bears_circle_message'),
      ambientSound: t('elements.silence'),
      visual: '🐻',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p5_12', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p5_12'),
      scienceInfo: t('science_info.p5_12', { returnObjects: true }) as string[]
    },
    'p6-1': {
      colors: 'from-emerald-800 via-teal-700 to-cyan-600',
      element: 'AQUA',
      elementMessage: t('practice_messages.social_breathing_message'),
      ambientSound: t('elements.silence'),
      visual: '🤝',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p6_1', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p6_1'),
      scienceInfo: t('science_info.p6_1', { returnObjects: true }) as string[]
    },
    'p6-2': {
      colors: 'from-emerald-800 via-teal-700 to-cyan-600',
      element: 'AQUA',
      elementMessage: t('practice_messages.expanded_vision_message'),
      ambientSound: t('elements.silence'),
      visual: '👀',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p6_2', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p6_2'),
      scienceInfo: t('science_info.p6_2', { returnObjects: true }) as string[]
    },
    'p6-3': {
      colors: 'from-emerald-800 via-teal-700 to-cyan-600',
      element: 'AQUA',
      elementMessage: t('practice_messages.goodwill_message'),
      ambientSound: t('elements.silence'),
      visual: '🕊️',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p6_3', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p6_3'),
      scienceInfo: t('science_info.p6_3', { returnObjects: true }) as string[]
    },
    'p6-4': {
      colors: 'from-emerald-800 via-teal-700 to-cyan-600',
      element: 'AQUA',
      elementMessage: t('practice_messages.chest_warmth_message'),
      ambientSound: t('elements.silence'),
      visual: '🔥',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p6_4', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p6_4'),
      scienceInfo: t('science_info.p6_4', { returnObjects: true }) as string[]
    },
    'p6-5': {
      colors: 'from-emerald-800 via-teal-700 to-cyan-600',
      element: 'AQUA',
      elementMessage: t('practice_messages.gesture_inclusion_message'),
      ambientSound: t('elements.silence'),
      visual: '🤲',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p6_5', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p6_5'),
      scienceInfo: t('science_info.p6_5', { returnObjects: true }) as string[]
    },
    'p6-6': {
      colors: 'from-emerald-800 via-teal-700 to-cyan-600',
      element: 'AQUA',
      elementMessage: t('practice_messages.attention_sensing_message'),
      ambientSound: t('elements.silence'),
      visual: '📡',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p6_6', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p6_6'),
      scienceInfo: t('science_info.p6_6', { returnObjects: true }) as string[]
    },
    'p6-7': {
      colors: 'from-emerald-800 via-teal-700 to-cyan-600',
      element: 'AQUA',
      elementMessage: t('practice_messages.body_listening_message'),
      ambientSound: t('elements.silence'),
      visual: '🫀',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p6_7', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p6_7'),
      scienceInfo: t('science_info.p6_7', { returnObjects: true }) as string[]
    },
    'p6-8': {
      colors: 'from-emerald-800 via-teal-700 to-cyan-600',
      element: 'AQUA',
      elementMessage: t('practice_messages.distance_balance_message'),
      ambientSound: t('elements.silence'),
      visual: '⚖️',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p6_8', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p6_8'),
      scienceInfo: t('science_info.p6_8', { returnObjects: true }) as string[]
    },
    'p6-9': {
      colors: 'from-emerald-800 via-teal-700 to-cyan-600',
      element: 'AQUA',
      elementMessage: t('practice_messages.social_exhale_message'),
      ambientSound: t('elements.silence'),
      visual: '🌊',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p6_9', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p6_9'),
      scienceInfo: t('science_info.p6_9', { returnObjects: true }) as string[]
    },
    'p6-10': {
      colors: 'from-emerald-800 via-teal-700 to-cyan-600',
      element: 'AQUA',
      elementMessage: t('practice_messages.oxytocin_wave_message'),
      ambientSound: t('elements.silence'),
      visual: '💛',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p6_10', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p6_10'),
      scienceInfo: t('science_info.p6_10', { returnObjects: true }) as string[]
    },
    'p6-11': {
      colors: 'from-emerald-800 via-teal-700 to-cyan-600',
      element: 'AQUA',
      elementMessage: t('practice_messages.somatic_containment_message'),
      ambientSound: t('elements.silence'),
      visual: '🛡️',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p6_11', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p6_11'),
      scienceInfo: t('science_info.p6_11', { returnObjects: true }) as string[]
    },
    'p6-12': {
      colors: 'from-emerald-800 via-teal-700 to-cyan-600',
      element: 'AQUA',
      elementMessage: t('practice_messages.social_spheres_message'),
      ambientSound: t('elements.silence'),
      visual: '🔵',
      targetTime: 360,
      guidingTexts: t('guiding_texts.p6_12', { returnObjects: true }) as string[],
      finalPhrase: t('final_phrases.p6_12'),
      scienceInfo: t('science_info.p6_12', { returnObjects: true }) as string[]
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
      color: 'from-teal-800 to-cyan-600',
      icon: Waves,
      practices: [
        { id: 'p4-1', name: t('practice_items.soft_gaze'), duration: t('practice_items.duration_6min'), maxQnt: 50, desc: t('practice_items.soft_gaze_desc') },
        { id: 'p4-2', name: t('practice_items.orienting_inhale'), duration: t('practice_items.duration_6min'), maxQnt: 55, desc: t('practice_items.orienting_inhale_desc') },
        { id: 'p4-3', name: t('practice_items.audio_scan'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.audio_scan_desc') },
        { id: 'p4-4', name: t('practice_items.mammalian_neck'), duration: t('practice_items.duration_6min'), maxQnt: 55, desc: t('practice_items.mammalian_neck_desc') },
        { id: 'p4-5', name: t('practice_items.tail_reset'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.tail_reset_desc') },
        { id: 'p4-6', name: t('practice_items.lymphatic_drift'), duration: t('practice_items.duration_6min'), maxQnt: 55, desc: t('practice_items.lymphatic_drift_desc') },
        { id: 'p4-7', name: t('practice_items.deep_in_quick_out'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.deep_in_quick_out_desc') },
        { id: 'p4-8', name: t('practice_items.distance_barrier'), duration: t('practice_items.duration_6min'), maxQnt: 55, desc: t('practice_items.distance_barrier_desc') },
        { id: 'p4-9', name: t('practice_items.trajectory_detection'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.trajectory_detection_desc') },
        { id: 'p4-10', name: t('practice_items.shadow_maneuvering'), duration: t('practice_items.duration_6min'), maxQnt: 55, desc: t('practice_items.shadow_maneuvering_desc') },
        { id: 'p4-11', name: t('practice_items.sensory_bypass'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.sensory_bypass_desc') },
        { id: 'p4-12', name: t('practice_items.tonic_fluidity'), duration: t('practice_items.duration_6min'), maxQnt: 65, desc: t('practice_items.tonic_fluidity_desc') }
      ],
      artifact: {
        name: t('artifacts.listen_heart'),
        bonus: 20,
        requirement: t('artifacts.requirement_part', { part: 4 })
      }
    },
    {
      id: 5,
      name: t('circuits.circuit_5_name'),
      subtitle: t('circuits.circuit_5_subtitle'),
      element: 'AQUA',
      color: 'from-yellow-800 to-yellow-700',
      icon: Shield,
      practices: [
        { id: 'p5-1', name: t('practice_items.mass_center'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.mass_center_desc') },
        { id: 'p5-2', name: t('practice_items.vagal_brake'), duration: t('practice_items.duration_6min'), maxQnt: 55, desc: t('practice_items.vagal_brake_desc') },
        { id: 'p5-3', name: t('practice_items.lymphatic_lock'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.lymphatic_lock_desc') },
        { id: 'p5-4', name: t('practice_items.gravity_grounding'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.gravity_grounding_desc') },
        { id: 'p5-5', name: t('practice_items.testosterone_vertical'), duration: t('practice_items.duration_6min'), maxQnt: 65, desc: t('practice_items.testosterone_vertical_desc') },
        { id: 'p5-6', name: t('practice_items.protected_heart'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.protected_heart_desc') },
        { id: 'p5-7', name: t('practice_items.silent_roar'), duration: t('practice_items.duration_6min'), maxQnt: 65, desc: t('practice_items.silent_roar_desc') },
        { id: 'p5-8', name: t('practice_items.territorial_gaze'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.territorial_gaze_desc') },
        { id: 'p5-9', name: t('practice_items.heart_coherence'), duration: t('practice_items.duration_6min'), maxQnt: 65, desc: t('practice_items.heart_coherence_desc') },
        { id: 'p5-10', name: t('practice_items.solid_aura'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.solid_aura_desc') },
        { id: 'p5-11', name: t('practice_items.tigers_path'), duration: t('practice_items.duration_6min'), maxQnt: 65, desc: t('practice_items.tigers_path_desc') },
        { id: 'p5-12', name: t('practice_items.bears_circle'), duration: t('practice_items.duration_6min'), maxQnt: 70, desc: t('practice_items.bears_circle_desc') }
      ],
      artifact: {
        name: t('artifacts.territorys_pulse'),
        bonus: 30,
        requirement: t('artifacts.requirement_part', { part: 5 })
      }
    },
    {
      id: 6,
      name: t('circuits.circuit_6_name'),
      subtitle: t('circuits.circuit_6_subtitle'),
      element: 'AQUA',
      color: 'from-emerald-800 to-teal-600',
      icon: Users,
      practices: [
        { id: 'p6-1', name: t('practice_items.social_breathing'), duration: t('practice_items.duration_6min'), maxQnt: 55, desc: t('practice_items.social_breathing_desc') },
        { id: 'p6-2', name: t('practice_items.expanded_vision'), duration: t('practice_items.duration_6min'), maxQnt: 55, desc: t('practice_items.expanded_vision_desc') },
        { id: 'p6-3', name: t('practice_items.goodwill'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.goodwill_desc') },
        { id: 'p6-4', name: t('practice_items.chest_warmth'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.chest_warmth_desc') },
        { id: 'p6-5', name: t('practice_items.gesture_inclusion'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.gesture_inclusion_desc') },
        { id: 'p6-6', name: t('practice_items.attention_sensing'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.attention_sensing_desc') },
        { id: 'p6-7', name: t('practice_items.body_listening'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.body_listening_desc') },
        { id: 'p6-8', name: t('practice_items.distance_balance'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.distance_balance_desc') },
        { id: 'p6-9', name: t('practice_items.social_exhale'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.social_exhale_desc') },
        { id: 'p6-10', name: t('practice_items.oxytocin_wave'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.oxytocin_wave_desc') },
        { id: 'p6-11', name: t('practice_items.somatic_containment'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.somatic_containment_desc') },
        { id: 'p6-12', name: t('practice_items.social_spheres'), duration: t('practice_items.duration_6min'), maxQnt: 60, desc: t('practice_items.social_spheres_desc') }
      ],
      artifact: {
        name: t('artifacts.voice_of_pack'),
        bonus: 20,
        requirement: t('artifacts.requirement_part', { part: 6 })
      }
    },
    {
      id: 7,
      name: t('circuits.circuit_7_name'),
      subtitle: t('circuits.circuit_7_subtitle'),
      element: 'AER',
      color: 'from-sky-800 to-blue-600',
      icon: Wind,
      practices: [],  // Ждём данные от пользователя
      artifact: null  // Ждём данные от пользователя
    },
    {
      id: 8,
      name: t('circuits.circuit_8_name'),
      subtitle: t('circuits.circuit_8_subtitle'),
      element: 'AER',
      color: 'from-indigo-800 to-violet-600',
      icon: Zap,
      practices: [],  // Ждём данные от пользователя
      artifact: null  // Ждём данные от пользователя
    },
    {
      id: 9,
      name: t('circuits.circuit_9_name'),
      subtitle: t('circuits.circuit_9_subtitle'),
      element: 'AER',
      color: 'from-amber-700 to-yellow-400',
      icon: Wind,
      practices: [],  // Ждём данные от пользователя
      artifact: null  // Ждём данные от пользователя
    },
    {
      id: 10,
      name: t('circuits.circuit_10_name'),
      subtitle: t('circuits.circuit_10_subtitle'),
      element: 'IGNIS',
      color: 'from-orange-500 to-amber-400',
      icon: Zap,
      practices: [],  // Ждём данные от пользователя
      artifact: null  // Ждём данные от пользователя
    },
    {
      id: 11,
      name: t('circuits.circuit_11_name'),
      subtitle: t('circuits.circuit_11_subtitle'),
      element: 'IGNIS',
      color: 'from-teal-600 to-cyan-400',
      icon: Zap,
      practices: [],  // Ждём данные от пользователя
      artifact: null  // Ждём данные от пользователя
    },
    {
      id: 12,
      name: t('circuits.circuit_12_name'),
      subtitle: t('circuits.circuit_12_subtitle'),
      element: 'IGNIS',
      color: 'from-fuchsia-600 to-red-500',
      icon: Zap,
      practices: [],  // Ждём данные от пользователя
      artifact: null  // Ждём данные от пользователя
    }
  ], [i18n.language]);

  // ═══════════════════════════════════════════════════════
  // Функция проверки разблокировки части
  // ═══════════════════════════════════════════════════════
  // Для разработки: установи VITE_UNLOCK_ALL_PARTS=true в .env чтобы открыть все части
  // В production: части разблокируются последовательно после прохождения всех практик предыдущей части
  const isPartUnlocked = useCallback((partNumber: number): boolean => {
    // Dev режим: если установлена переменная VITE_UNLOCK_ALL_PARTS=true - все части открыты
    const unlockAllParts = import.meta.env.VITE_UNLOCK_ALL_PARTS === 'true';
    if (unlockAllParts) {
      return true;
    }

    // Part 1 всегда доступна
    if (partNumber === 1) return true;

    // Часть N разблокирована только если все части 1..N-1, у которых есть практики, полностью пройдены
    for (let part = 1; part < partNumber; part++) {
      const circuit = circuits.find(c => c.id === part);
      if (!circuit?.practices?.length) continue; // нет практик — пропускаем
      const allValidated = circuit.practices.every(
        p => completedPractices[p.id]?.isValidForArtifact === true
      );
      if (!allValidated) return false;
    }
    return true;
  }, [circuits, completedPractices]);

  // Airbridge: fire `Level Unlocked` for every level that just became
  // available. Helper is idempotent via localStorage so repeated runs of
  // this effect (every completedPractices change) only emit once per level.
  useEffect(() => {
    for (let part = 2; part <= 12; part++) {
      if (isPartUnlocked(part)) {
        trackTenjinLevelUnlocked(part);
      }
    }
  }, [completedPractices, isPartUnlocked]);

  // Проверка доступности части после загрузки / обновления completedPractices
  useEffect(() => {
    if (!isPartUnlocked(activeCircuit)) {
      // Находим последнюю доступную часть
      let lastUnlockedPart = 1;
      for (let part = 1; part <= 12; part++) {
        if (isPartUnlocked(part)) {
          lastUnlockedPart = part;
        } else {
          break;
        }
      }
      if (lastUnlockedPart !== activeCircuit) {
        setActiveCircuit(lastUnlockedPart);
        setSelectedLevel(lastUnlockedPart);
        const chapterForLevel = Math.ceil(lastUnlockedPart / 3);
        setSelectedChapter(chapterForLevel);
      }
    }
  }, [completedPractices, isPartUnlocked, activeCircuit]);

  const calculateBonus = () => {
    return artifacts.reduce((sum, a) => sum + a.bonus, 0);
  };

  const completePractice = (practiceId, baseQnt) => {
    const space = practiceSpaces[practiceId];
    if (space) {
      setActivePractice({ ...space, id: practiceId, maxQnt: baseQnt });
      setPracticeOpenedAtMs(Date.now());
      setCanExitPractice(false);
      setTimeout(() => setCanExitPractice(true), 1800);
      setPracticeState('intro');
      setPracticeTime(0);
      setQualityScore(0);
      setIsPaused(false);

      // practice_view retired (folded into practice_start). Tenjin native 'View'
      // stays for Axon/MMP pooling.
      trackTenjinPractice('View', getPracticeName(practiceId), { practiceId });

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
      
      if (allCompleted && circuit.artifact && !artifacts.some(a => a.circuitId === circuit.id)) {
        setTimeout(() => {
          setArtifacts(prev => [...prev, {
            circuitId: circuit.id,
            bonus: circuit.artifact!.bonus
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
        practice_type: 'standard',
        practice_name: activePractice.name,
        target_duration: activePractice.duration,
        has_biometrics: hasRealMetrics,
        // Stress/energy intentionally NOT sent: they're derived from the pulse
        // (incl. the camera source) and we removed them from the product, so
        // they must not leave the device either. The honest before/after signal
        // is the coherence delta, reported on the 'complete' event below.
      });
      trackTenjinPractice('Start', getPracticeName(activePractice.id), { practiceId: activePractice.id });
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
    // Reset coherence-delta capture for this session (baseline backfills on
    // the first valid reading in the practice loop).
    initialCoherenceRef.current = freshVitals.coherence ?? null;
    peakCoherenceRef.current = freshVitals.coherence ?? null;
    // Reset honest pulse-trend capture for this session.
    initialHrRef.current = null;
    minHrRef.current = null;
    hrSmoothRef.current = -1;
    hrConfidentTicksRef.current = 0;
    hrTotalTicksRef.current = 0;
    sessionHrSourceRef.current = null;
    setHonestResult(null);
    setMeetsArtifactRequirements(false); // Reset artifact validation
    setCameraOfferDismissed(false); // re-offer camera each new practice
    setPracticeState('active');
    setCurrentGuidingTextIndex(0);
    setIsTextTransitioning(false);
    setAudioResetKey(prev => prev + 1);
  };

  const finishPractice = async () => {
    setIsMinimalMode(false);
    cameraPpg.stop(); // free camera + torch on completion (finger no longer needed)
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

    // Track practice completion — Finish only if practice passed the valid threshold
    // (≥80% of target time AND quality ≥ minQualityRequired). Otherwise user pressed
    // Complete early → Stop.
    trackTenjinPractice(
      isValidForArtifact ? 'Finish' : 'Stop',
      getPracticeName(activePractice.id),
      { practiceId: activePractice.id }
    );
    // Magic-moment activation event — helper is idempotent across sessions
    // via localStorage flag, so it's safe to call on every valid Finish.
    if (isValidForArtifact) {
      const isFirstEverCompletion = trackTenjinFirstPracticeComplete(
        getPracticeName(activePractice.id),
        { surface: 'basic' },
      );
      if (isFirstEverCompletion) {
        // Onboarding-refactor funnel anchor: the user has now FELT the
        // product once. Mirrors the MMP first_practice_complete into the
        // product-analytics funnel and arms the one-time paywall that
        // opens when they leave the results screen (after value, never
        // before / never over the results).
        track('first_practice_complete', {
          practice_type: 'standard',
          practice_id: activePractice.id,
          duration_seconds: practiceTime,
          quality_score: qualityScore,
          has_biometrics: hasRealMetricsAtFinish,
        });
        // NOTE: paywall arming was moved OFF this near-unreachable valid event
        // (≥80% time + quality≥70/33) onto practice_complete below, so the
        // offer actually shows. first_practice_complete stays as a strict
        // reference metric only.
      }
    }
    // Coherence training signal for this session: how much the user raised
    // their heart–breath sync from their own start baseline to the peak —
    // the honest achievement that replaces the removed stress/energy verdict.
    const coherenceBaseline = initialCoherenceRef.current;
    const coherencePeak = peakCoherenceRef.current;
    const coherenceDelta = (coherenceBaseline != null && coherencePeak != null)
      ? Math.max(0, coherencePeak - coherenceBaseline)
      : null;

    // Funnel instrumentation (1.8.x). Enrich practice_complete so we can later
    // plot the quality→activation→purchase curve. metrics_source distinguishes
    // watch / camera (both make has_biometrics true → the strict 70 bar) from
    // simulated (no sensor → quality caps ~20, can never clear its own 33 bar).
    const metricsSource = sessionHrSourceRef.current || freshVitalsForSession.hrSource || 'simulated';
    // First practice_complete ever? Keyed on a DEDICATED flag, not the
    // (effectively unreachable) validity threshold — this is what now arms the
    // post-first-practice paywall, so it actually shows to real users.
    const isFirstPracticeComplete = localStorage.getItem('onda_paywall_armed') !== '1';

    trackPractice('complete', activePractice.id, {
      practice_type: 'standard',
      practice_name: activePractice.name,
      duration_seconds: practiceTime,
      target_duration: activePractice.targetTime || 720,
      quality_score: qualityScore,
      time_percent: Math.round(timePercent * 100),
      metrics_source: metricsSource,
      is_first: isFirstPracticeComplete,
      ond_earned: earnedQnt,
      has_biometrics: hasRealMetricsAtFinish,
      is_valid_for_artifact: isValidForArtifact,
      is_new_record: shouldUpdate && !!existingPractice,
      // No final_stress/final_energy — pulse-derived, removed from the product,
      // kept on-device only. Coherence delta below is the honest effect signal.
      coherence_baseline: coherenceBaseline,
      coherence_peak: coherencePeak,
      coherence_delta: coherenceDelta,
    });

    // Decoupled paywall arming (replaces the old valid-first_practice_complete
    // gate, which fired for ~0 users so the paywall never showed). Arm once, on
    // the first practice_complete — value delivered, real people see the offer.
    // Idempotent via onda_paywall_armed; quality stashed so paywall_view /
    // purchase can carry first_practice_quality across components.
    if (isFirstPracticeComplete) {
      localStorage.setItem('onda_paywall_armed', '1');
      localStorage.setItem('onda_first_practice_quality', String(Math.round(qualityScore)));
      if (platform === 'ios' && !isPremium) {
        postFirstExperiencePaywallArmedRef.current = true;
      }
    }

    // Honest results-screen signal (state for the screen + the results_view
    // analytics step). result_state:
    //   A — no real sensor (simulated) → invite to connect a camera/watch.
    //   B — camera + a clean, SUSTAINED pulse drop → show "from X to Y".
    //   C — everything else (flat / rose / noisy / short) → neutral, never
    //       "rose", never a bad grade. When in doubt → C (don't bluff).
    // B requires ALL (conservative on purpose): camera source, start+min
    // captured, drop ≥ 3 bpm, confident coverage ≥ 60%, time_percent ≥ 50% AND
    // duration ≥ 45s.
    const hrStart = initialHrRef.current;
    const hrMin = minHrRef.current != null ? Math.round(minHrRef.current) : null;
    const hrCoverage = hrTotalTicksRef.current > 0 ? hrConfidentTicksRef.current / hrTotalTicksRef.current : 0;
    const cleanDrop =
      metricsSource === 'camera' &&
      hrStart != null && hrMin != null &&
      hrStart - hrMin >= 3 &&
      hrCoverage >= 0.6 &&
      timePercent >= 0.5 &&
      practiceTime >= 45;
    const resultState: 'A' | 'B' | 'C' =
      metricsSource === 'simulated' ? 'A' : cleanDrop ? 'B' : 'C';
    const resultHrStart = resultState === 'B' ? hrStart : null;
    const resultHrMin = resultState === 'B' ? hrMin : null;
    setHonestResult({ state: resultState, hrStart: resultHrStart, hrMin: resultHrMin });
    track('results_view', {
      metrics_source: metricsSource,
      time_percent: Math.round(timePercent * 100),
      result_state: resultState,
      hr_start: resultHrStart ?? undefined,
      hr_min: resultHrMin ?? undefined,
      is_first: cameFromFirstRun,
    });

    const session = {
      id: Date.now(),
      practiceId: activePractice.id,
      practiceName: circuits.flatMap(c => c.practices).find(p => p.id === activePractice.id)?.name,
      date: new Date().toISOString(),
      duration: practiceTime,
      quality: qualityScore,
      qnt: earnedQnt,
      // No stress/energy — this session record is persisted to Supabase
      // (user_game_progress.practice_history); keeping pulse-derived metrics OFF
      // it means nothing derived from the camera pulse leaves the device. The
      // coherence delta (training signal) is the honest record we keep.
      coherenceDelta,
      coherencePeak,
      isNewRecord: shouldUpdate && existingPractice
    };

    setPracticeHistory(prev => {
      const next = [session, ...prev];
      // SKStoreReviewController prompt — quality-gated to hit the genuine
      // 5-star profile. We ask ONLY when BOTH hold:
      //   1. LIVE biometrics this session (hasRealMetricsAtFinish) — the user
      //      actually felt the biofeedback, not a simulated run.
      //   2. RETURN on a later calendar day than the first session — never
      //      back-to-back in the first sitting.
      // Why not the old "2nd lifetime completion": once the camera puts
      // biometrics into the onboarding practice, the first biometric session
      // IS the first sitting (5th minute), right next to the soft paywall and
      // before any multi-day value or formed opinion. Gating on "felt
      // biometrics AND came back" selects the retained user — exactly who
      // leaves a 5. localStorage one-shot + Apple's ~3/365 cap still apply.
      //
      // Loosening lever (only if reviews accrue too slowly): relax the DAY gate
      // ONLY when BOTH hold — (a) requested:true volume is low AND (b) the App
      // Store Connect average is still healthy (≥4.6). Never loosen on request
      // volume alone: that floods the prompt to less-delighted users and sinks
      // the average — the exact outcome we're avoiding. Never go below "felt
      // biometrics", never adjacent to the paywall.
      try {
        const d = new Date();
        const todayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        let firstDay = localStorage.getItem('onda_first_session_day');
        if (!firstDay) {
          // First completion we've seen → anchor the first-sitting day so a
          // later completion can be recognised as a genuine return.
          localStorage.setItem('onda_first_session_day', todayKey);
          firstDay = todayKey;
        }
        const isReturningDay = todayKey > firstDay; // strictly later calendar day
        const alreadyPrompted = localStorage.getItem('onda_review_prompted') === '1';
        // platform==='ios' gate: SKStoreReview only exists on iOS. Without it
        // the web preview / Android would call the no-op plugin, burn the
        // one-shot flag, and emit bogus requested:false events — polluting the
        // bucket with non-iOS noise. Keep this funnel iOS-only.
        if (platform === 'ios' && hasRealMetricsAtFinish && isReturningDay && !alreadyPrompted) {
          localStorage.setItem('onda_review_prompted', '1');
          const daysSinceFirst = Math.round(
            (Date.parse(todayKey) - Date.parse(firstDay || todayKey)) / 86400000,
          );
          const lifetimeCompletions = next.length;
          const promptedPracticeId = activePractice.id;
          const biometricSource = freshVitalsForSession.hrSource ?? null;
          // Lazy import keeps the plugin out of the cold-start bundle.
          import('./plugins/ondaStoreReview').then(m => {
            m.requestAppStoreReview().then(r => {
              console.log('[OndaStoreReview] result:', r);
              // The ONLY observable signal in this funnel — requestReview is
              // fire-and-forget: Apple NEVER reports whether the dialog showed,
              // and may silently suppress it even at requested:true (its own
              // heuristic + the ~3/365 cap). So read these precisely:
              //   requested:true  = request dispatched to iOS — NOT "shown",
              //                     NOT "rated".
              //   requested:false = the plugin could not invoke (e.g. no
              //                     foreground window scene). NOT "Apple
              //                     declined to show" — that case is invisible.
              // web/Android no-ops are excluded by the platform gate above, so
              // they never reach this bucket. The real outcome (counts + average)
              // lives in App Store Connect; this event is only the top of the
              // funnel — how many requests went out.
              track('review_prompt_requested', {
                requested: r.requested,
                reason: r.reason ?? null,
                had_live_biometrics: true,
                returning_day: true,
                days_since_first: daysSinceFirst,
                lifetime_completions: lifetimeCompletions,
                biometric_source: biometricSource,
                practice_id: promptedPracticeId,
              });
            });
          });
        }
      } catch (e) {
        // localStorage in private mode etc — non-fatal.
        console.log('[OndaStoreReview] skipped:', e);
      }
      return next;
    });

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
            // stress/energy columns left null on purpose — pulse-derived,
            // computed on-device (they feed the OND reward above) but no longer
            // persisted, so nothing derived from the camera pulse leaves the
            // device. Columns are nullable; the OND amounts are the record we keep.
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
      // Airbridge progression — fired regardless of whether the circuit
      // actually carries an artifact (some Parts have artifact: null).
      // Helpers are idempotent across sessions via localStorage flags.
      trackTenjinCircuitComplete(circuit.id, {
        has_artifact: !!circuit.artifact,
        practices_count: circuit.practices.length,
      });
      if (circuit.artifact) {
        trackTenjinArtifactEarned(circuit.id, {
          bonus: circuit.artifact.bonus,
          quality_score: qualityScore,
        });
        setTimeout(() => {
          setArtifacts(prev => [...prev, {
            ...circuit.artifact,
            circuitId: circuit.id
          }]);
        }, 1000);
      }
    }
  };

  const exitPractice = async (eventOrReason?: React.MouseEvent | string) => {
    exitPracticeCalledRecentlyRef.current = Date.now();
    const msSinceOpen = practiceOpenedAtMs ? Date.now() - practiceOpenedAtMs : null;
    const callerStack = new Error().stack?.split('\n').slice(1, 6).join(' | ') ?? 'no-stack';

    // Extract event details if called from onClick (helps distinguish real tap vs synthetic)
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
        evt_currentTargetTag: (e.currentTarget as HTMLElement)?.tagName ?? null,
      };
    }
    const reasonTag = typeof eventOrReason === 'string' ? eventOrReason : 'x_button_click';

    const debugSnapshot = {
      surface: 'basic',
      reason: reasonTag,
      msSinceOpen,
      practiceState,
      practiceId: activePractice?.id ?? null,
      practiceTime,
      platform,
      callerStack,
      ...eventInfo,
    };
    console.warn('[DEBUG exitPractice] called', debugSnapshot);
    track('practice_intro_closed_debug', debugSnapshot);

    // Prevent accidental immediate close right after opening a practice (iOS click-through / ghost tap).
    // Telemetry showed closes at 1.4-1.6s, so the previous 800ms window was insufficient.
    if (practiceOpenedAtMs && Date.now() - practiceOpenedAtMs < 1800) {
      console.warn('[DEBUG exitPractice] BLOCKED by 1800ms guard', { msSinceOpen });
      return;
    }
    setIsMinimalMode(false);
    const practiceId = activePractice?.id;
    const practiceName = circuits.flatMap(c => c.practices).find(p => p.id === activePractice?.id)?.name || '';

    // Tenjin practice lifecycle. Three exit paths from the practice screen:
    //   - X during practice (practiceState === 'active') → Stop
    //   - X on intro screen, never pressed Start → Close
    //   - X on the result/complete screen → no-op (Finish/Stop already
    //     fired inside finishPractice; we'd double-count otherwise)
    if (practiceId) {
      if (practiceState === 'active') {
        // Started but left before completing — the signal for "start but don't finish".
        track('practice_abandon', { practice_type: 'standard', practice_id: practiceId, reason: 'stop' });
        trackTenjinPractice('Stop', practiceName || getPracticeName(practiceId), { practiceId });
      } else if (practiceState !== 'complete') {
        // Closed the intro without ever pressing Start.
        track('practice_abandon', { practice_type: 'standard', practice_id: practiceId, reason: 'close' });
        trackTenjinPractice('Close', practiceName || getPracticeName(practiceId), { practiceId });
      }
    }
    
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
    setPracticeOpenedAtMs(null);
    setPracticeState('intro');
    setPracticeTime(0);
    setQualityScore(0);
    setPracticeRating(0);
    setIsPaused(false);
    setCurrentGuidingTextIndex(0);
    setIsTextTransitioning(false);
    setCurrentTrack(1);

    // Onboarding refactor: first-ever completed experience → show the
    // offer once, right after the value moment, over the hub the user
    // returns to. Armed only in finishPractice (iOS, non-premium), so
    // mid-practice exits and repeat completions never trigger it.
    if (postFirstExperiencePaywallArmedRef.current) {
      postFirstExperiencePaywallArmedRef.current = false;
      track('paywall_view', {
        source: 'post_first_experience',
        practice_id: practiceId,
        // quality→purchase linkage: the quality of the practice that earned
        // this offer (stashed in finishPractice). undefined if not recorded.
        first_practice_quality: Number(localStorage.getItem('onda_first_practice_quality')) || undefined,
      });
      setPaywallSource('post_first_experience');
      setShowSubscriptionModal(true);
    }

    // The on-screen practice is gone — any further results screen belongs to a
    // hub-launched practice, so the button reverts to "Back to Practices".
    setCameFromFirstRun(false);
    cameraPpg.stop(); // free camera + torch when leaving the practice

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
      'p4-2': 'practice_items.orienting_inhale',
      'p4-3': 'practice_items.audio_scan',
      'p4-4': 'practice_items.mammalian_neck',
      'p4-5': 'practice_items.tail_reset',
      'p4-6': 'practice_items.lymphatic_drift',
      'p4-7': 'practice_items.deep_in_quick_out',
      'p4-8': 'practice_items.distance_barrier',
      'p4-9': 'practice_items.trajectory_detection',
      'p4-10': 'practice_items.shadow_maneuvering',
      'p4-11': 'practice_items.sensory_bypass',
      'p4-12': 'practice_items.tonic_fluidity',
      'p5-1': 'practice_items.mass_center',
      'p5-2': 'practice_items.vagal_brake',
      'p5-3': 'practice_items.lymphatic_lock',
      'p5-4': 'practice_items.gravity_grounding',
      'p5-5': 'practice_items.testosterone_vertical',
      'p5-6': 'practice_items.protected_heart',
      'p5-7': 'practice_items.silent_roar',
      'p5-8': 'practice_items.territorial_gaze',
      'p5-9': 'practice_items.heart_coherence',
      'p5-10': 'practice_items.solid_aura',
      'p5-11': 'practice_items.tigers_path',
      'p5-12': 'practice_items.bears_circle',
      'p6-1': 'practice_items.social_breathing',
      'p6-2': 'practice_items.expanded_vision',
      'p6-3': 'practice_items.goodwill',
      'p6-4': 'practice_items.chest_warmth',
      'p6-5': 'practice_items.gesture_inclusion',
      'p6-6': 'practice_items.attention_sensing',
      'p6-7': 'practice_items.body_listening',
      'p6-8': 'practice_items.distance_balance',
      'p6-9': 'practice_items.social_exhale',
      'p6-10': 'practice_items.oxytocin_wave',
      'p6-11': 'practice_items.somatic_containment',
      'p6-12': 'practice_items.social_spheres'
    };
    return t(mapping[practiceId] || practiceId);
  };

  // Reverse-lookup helper used by the Welcome screen to compose i18n
  // keys like `practice_items.micro_breath_pre_start`. Returns the
  // bare suffix (e.g. "micro_breath") for a given practice id, or the
  // id itself as a fallback so missing entries don't crash.
  const getPracticeKey = (practiceId: string): string => {
    const mapping: Record<string, string> = {
      'p1-1': 'micro_breath', 'p1-2': 'sense_of_being', 'p1-3': 'warm_pulse',
      'p1-4': 'still_wave', 'p1-5': 'inner_listening', 'p1-6': 'first_light',
      'p1-7': 'liquid_presence', 'p1-8': 'breath_count', 'p1-9': 'point_of_stillness',
      'p1-10': 'i_am_silence', 'p1-11': 'ground_flow', 'p1-12': 'body_root',
      'p2-1': 'flow_rhythm', 'p2-2': 'directional_sense', 'p2-3': 'rhythm_movement',
      'p2-4': 'water_balance', 'p2-5': 'fluid_motion', 'p2-6': 'wave_breath',
      'p2-7': 'sense_of_flow', 'p2-8': 'flow_focus', 'p2-9': 'flow_adapt',
      'p2-10': 'still_water', 'p2-11': 'deep_current', 'p2-12': 'echo_ocean',
      'p3-1': 'breath_of_transition', 'p3-2': 'balance_point', 'p3-3': 'adaptive_flow',
      'p3-4': 'ground_air_breath', 'p3-5': 'step_of_stability', 'p3-6': 'wave_of_breath',
      'p3-7': 'breath_bridge', 'p3-8': 'center_of_gravity', 'p3-9': 'shape_shift',
      'p3-10': 'resonant_stillness', 'p3-11': 'pulse_of_earth', 'p3-12': 'breath_of_adaptation',
    };
    return mapping[practiceId] || practiceId;
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
      'p4-2': 'practice_items.orienting_inhale_desc',
      'p4-3': 'practice_items.audio_scan_desc',
      'p4-4': 'practice_items.mammalian_neck_desc',
      'p4-5': 'practice_items.tail_reset_desc',
      'p4-6': 'practice_items.lymphatic_drift_desc',
      'p4-7': 'practice_items.deep_in_quick_out_desc',
      'p4-8': 'practice_items.distance_barrier_desc',
      'p4-9': 'practice_items.trajectory_detection_desc',
      'p4-10': 'practice_items.shadow_maneuvering_desc',
      'p4-11': 'practice_items.sensory_bypass_desc',
      'p4-12': 'practice_items.tonic_fluidity_desc',
      'p5-1': 'practice_items.mass_center_desc',
      'p5-2': 'practice_items.vagal_brake_desc',
      'p5-3': 'practice_items.lymphatic_lock_desc',
      'p5-4': 'practice_items.gravity_grounding_desc',
      'p5-5': 'practice_items.testosterone_vertical_desc',
      'p5-6': 'practice_items.protected_heart_desc',
      'p5-7': 'practice_items.silent_roar_desc',
      'p5-8': 'practice_items.territorial_gaze_desc',
      'p5-9': 'practice_items.heart_coherence_desc',
      'p5-10': 'practice_items.solid_aura_desc',
      'p5-11': 'practice_items.tigers_path_desc',
      'p5-12': 'practice_items.bears_circle_desc',
      'p6-1': 'practice_items.social_breathing_desc',
      'p6-2': 'practice_items.expanded_vision_desc',
      'p6-3': 'practice_items.goodwill_desc',
      'p6-4': 'practice_items.chest_warmth_desc',
      'p6-5': 'practice_items.gesture_inclusion_desc',
      'p6-6': 'practice_items.attention_sensing_desc',
      'p6-7': 'practice_items.body_listening_desc',
      'p6-8': 'practice_items.distance_balance_desc',
      'p6-9': 'practice_items.social_exhale_desc',
      'p6-10': 'practice_items.oxytocin_wave_desc',
      'p6-11': 'practice_items.somatic_containment_desc',
      'p6-12': 'practice_items.social_spheres_desc'
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
      'p4-2': 'practice_messages.orienting_inhale_message',
      'p4-3': 'practice_messages.audio_scan_message',
      'p4-4': 'practice_messages.mammalian_neck_message',
      'p4-5': 'practice_messages.tail_reset_message',
      'p4-6': 'practice_messages.lymphatic_drift_message',
      'p4-7': 'practice_messages.deep_in_quick_out_message',
      'p4-8': 'practice_messages.distance_barrier_message',
      'p4-9': 'practice_messages.trajectory_detection_message',
      'p4-10': 'practice_messages.shadow_maneuvering_message',
      'p4-11': 'practice_messages.sensory_bypass_message',
      'p4-12': 'practice_messages.tonic_fluidity_message',
      'p5-1': 'practice_messages.mass_center_message',
      'p5-2': 'practice_messages.vagal_brake_message',
      'p5-3': 'practice_messages.lymphatic_lock_message',
      'p5-4': 'practice_messages.gravity_grounding_message',
      'p5-5': 'practice_messages.testosterone_vertical_message',
      'p5-6': 'practice_messages.protected_heart_message',
      'p5-7': 'practice_messages.silent_roar_message',
      'p5-8': 'practice_messages.territorial_gaze_message',
      'p5-9': 'practice_messages.heart_coherence_message',
      'p5-10': 'practice_messages.solid_aura_message',
      'p5-11': 'practice_messages.tigers_path_message',
      'p5-12': 'practice_messages.bears_circle_message',
      'p6-1': 'practice_messages.social_breathing_message',
      'p6-2': 'practice_messages.expanded_vision_message',
      'p6-3': 'practice_messages.goodwill_message',
      'p6-4': 'practice_messages.chest_warmth_message',
      'p6-5': 'practice_messages.gesture_inclusion_message',
      'p6-6': 'practice_messages.attention_sensing_message',
      'p6-7': 'practice_messages.body_listening_message',
      'p6-8': 'practice_messages.distance_balance_message',
      'p6-9': 'practice_messages.social_exhale_message',
      'p6-10': 'practice_messages.oxytocin_wave_message',
      'p6-11': 'practice_messages.somatic_containment_message',
      'p6-12': 'practice_messages.social_spheres_message'
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

  // ── Local notifications (Sprint 1) ──
  // Reconcile the streak nudge on mount, on resume from background, and
  // whenever practiceHistory changes (so completing a practice cancels
  // tonight's nudge immediately, without waiting for the next app open).
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    if (!getStreakEnabled()) return;

    const reconcile = () => {
      const today = new Date();
      const todayKey = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
      const practicedToday = practiceHistory.some((p) => {
        if (!p?.date) return false;
        const d = new Date(p.date);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() === todayKey;
      });
      reconcileStreakNudge({ streak: getStreak(), practicedToday });
    };

    reconcile();

    let stateSub: { remove: () => void } | null = null;
    CapApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) reconcile();
    }).then((h) => { stateSub = h; }).catch(() => undefined);

    const offOpened = onNotificationOpened((info) => {
      // Tenjin/analytics hook-point — extend in Sprint 2.
      console.log('[notifications] opened', info);
    });

    return () => {
      stateSub?.remove();
      offOpened();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practiceHistory]);

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

  const startVoiceCheck = async () => {
    setShowVoiceCheck(true);
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
    // Светлый экран завершения только в светлой теме; в тёмной — космический.
    const completeLight = practiceState === 'complete' && isLight;
    return (
      <div className={`fixed inset-0 overflow-hidden transition-colors duration-1000 ${isLight ? 'bg-gradient-to-br from-indigo-50 via-white to-violet-100 text-slate-700' : `bg-gradient-to-br ${activePractice.colors} text-white`}`}>
        {/* Debug Monitor - also during practice */}
        <DebugMonitor
          buildNumber={import.meta.env.VITE_BUILD_NUMBER}
          commitHash={import.meta.env.VITE_COMMIT_HASH}
          branchName={import.meta.env.VITE_BRANCH_NAME}
        />
        
        {/* Lazy-mount: don't create <audio> + blob URL during intro — iOS
            WKWebView holds native mp3 decoders even after pause+removeAttribute,
            and accumulation across intro opens is the current OOM suspect. */}
        {practiceState === 'active' && (<>
        {(activePractice.id === 'p1-1' || activePractice.id === 'p4-1') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-1_Breath of Life/p1-1_Breath of Life-1.mp3"
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p1-2' || activePractice.id === 'p4-2') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-2_Sense of Being/p1-2_Sense of Being-1.mp3"
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p1-3' || activePractice.id === 'p4-3') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-3_Warm Pulse/p1-3_Warm Pulse-1.mp3"
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p1-4' || activePractice.id === 'p4-4') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-4_Still Wave/p1-4_Still Wave-1.mp3"
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p1-5' || activePractice.id === 'p4-5') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-5_Inner Listening/p1-5_Inner Listening-1.mp3"
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p1-6' || activePractice.id === 'p4-6') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-6_First Light/p1-6_First Light-1.mp3"
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p1-7' || activePractice.id === 'p4-7') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-7_Liquid Presence/p1-7_Liquid Presence-1.mp3"
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p1-8' || activePractice.id === 'p4-8') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p1/p1-8_Breath Count/p1-8_Breath Count-1.mp3",
              "p1/p1-8_Breath Count/p1-8_Breath Count-2.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p1-9' || activePractice.id === 'p4-9') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-9_Point of Stillness/p1-9_Point of Stillness-1.mp3"
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p1-10' || activePractice.id === 'p4-10') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p1/p1-10_I Am Silence/p1-10_I Am Silence-1.mp3",
              "p1/p1-10_I Am Silence/p1-10_I Am Silence-2.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p1-11' || activePractice.id === 'p4-11') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-11_Ground Flow/p1-11_Ground Flow-1.mp3"
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p1-12' || activePractice.id === 'p4-12') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath="p1/p1-12_Body Root/p1-12_Body Root-1.mp3"
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {/* Part 2 Audio Players */}
        {(activePractice.id === 'p2-1' || activePractice.id === 'p5-1') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-1_Flow Rhythm/p2-1_Flow Rhythm-1.mp3",
              "p2/p2-1_Flow Rhythm/p2-1_Flow Rhythm-2.mp3",
              "p2/p2-1_Flow Rhythm/p2-1_Flow Rhythm-3.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p2-2' || activePractice.id === 'p5-2') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-2_Sense of Direction/p2-2_Sense of Direction-1.mp3",
              "p2/p2-2_Sense of Direction/p2-2_Sense of Direction-2.mp3",
              "p2/p2-2_Sense of Direction/p2-2_Sense of Direction-3.mp3",
              "p2/p2-2_Sense of Direction/p2-2_Sense of Direction-4.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p2-3' || activePractice.id === 'p5-3') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-3_Rhythm of Movement/p2-3_Rhythm of Movement-1.mp3",
              "p2/p2-3_Rhythm of Movement/p2-3_Rhythm of Movement-2.mp3",
              "p2/p2-3_Rhythm of Movement/p2-3_Rhythm of Movement-3.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p2-4' || activePractice.id === 'p5-4') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-4_Water Balance/p2-4_Water Balance-1.mp3",
              "p2/p2-4_Water Balance/p2-4_Water Balance-2.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p2-5' || activePractice.id === 'p5-5') && (
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
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p2-6' || activePractice.id === 'p5-6') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-6_Wave Breath/p2-6_Wave Breath-1.mp3",
              "p2/p2-6_Wave Breath/p2-6_Wave Breath-2.mp3",
              "p2/p2-6_Wave Breath/p2-6_Wave Breath-3.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p2-7' || activePractice.id === 'p5-7') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-7_Intuition of Flow/p2-7_Intuition of Flow-1.mp3",
              "p2/p2-7_Intuition of Flow/p2-7_Intuition of Flow-2.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p2-8' || activePractice.id === 'p5-8') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-8_Focus in Motion/p2-8_Focus in Motion-1.mp3",
              "p2/p2-8_Focus in Motion/p2-8_Focus in Motion-2.mp3",
              "p2/p2-8_Focus in Motion/p2-8_Focus in Motion-3.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p2-9' || activePractice.id === 'p5-9') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-9_Flexible Response/p2-9_Flexible Response-1.mp3",
              "p2/p2-9_Flexible Response/p2-9_Flexible Response-2.mp3",
              "p2/p2-9_Flexible Response/p2-9_Flexible Response-3.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p2-10' || activePractice.id === 'p5-10') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-10_Still Water/p2-10_Still Water-1.mp3",
              "p2/p2-10_Still Water/p2-10_Still Water-2.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p2-11' || activePractice.id === 'p5-11') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-11_Deep Current/p2-11_Deep Current-1.mp3",
              "p2/p2-11_Deep Current/p2-11_Deep Current-2.mp3",
              "p2/p2-11_Deep Current/p2-11_Deep Current-3.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p2-12' || activePractice.id === 'p5-12') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p2/p2-12_Echo of Ocean/p2-12_Echo of Ocean-1.mp3",
              "p2/p2-12_Echo of Ocean/p2-12_Echo of Ocean-2.mp3",
              "p2/p2-12_Echo of Ocean/p2-12_Echo of Ocean-3.mp3",
              "p2/p2-12_Echo of Ocean/p2-12_Echo of Ocean-4.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p3-1' || activePractice.id === 'p6-1') && (
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
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p3-2' || activePractice.id === 'p6-2') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-2_Point of Stability/p3-2_Point of Stability-1.mp3",
              "p3/p3-2_Point of Stability/p3-2_Point of Stability-2.mp3",
              "p3/p3-2_Point of Stability/p3-2_Point of Stability-3.mp3",
              "p3/p3-2_Point of Stability/p3-2_Point of Stability-4.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p3-3' || activePractice.id === 'p6-3') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-3_Form Plasticity/p3-3_Form Plasticity-1.mp3",
              "p3/p3-3_Form Plasticity/p3-3_Form Plasticity-2.mp3",
              "p3/p3-3_Form Plasticity/p3-3_Form Plasticity-3.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p3-4' || activePractice.id === 'p6-4') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-4_Earth and Air Breath/p3-4_Earth and Air Breath-1.mp3",
              "p3/p3-4_Earth and Air Breath/p3-4_Earth and Air Breath-2.mp3",
              "p3/p3-4_Earth and Air Breath/p3-4_Earth and Air Breath-3.mp3",
              "p3/p3-4_Earth and Air Breath/p3-4_Earth and Air Breath-4.mp3",
              "p3/p3-4_Earth and Air Breath/p3-4_Earth and Air Breath-5.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p3-5' || activePractice.id === 'p6-5') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-5_First Step of Stability/p3-5_First Step of Stability-1.mp3",
              "p3/p3-5_First Step of Stability/p3-5_First Step of Stability-2.mp3",
              "p3/p3-5_First Step of Stability/p3-5_First Step of Stability-3.mp3",
              "p3/p3-5_First Step of Stability/p3-5_First Step of Stability-4.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p3-6' || activePractice.id === 'p6-6') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-6_Wave of Breath/p3-6_Wave of Breath-1.mp3",
              "p3/p3-6_Wave of Breath/p3-6_Wave of Breath-2.mp3",
              "p3/p3-6_Wave of Breath/p3-6_Wave of Breath-3.mp3",
              "p3/p3-6_Wave of Breath/p3-6_Wave of Breath-4.mp3",
              "p3/p3-6_Wave of Breath/p3-6_Wave of Breath-5.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p3-7' || activePractice.id === 'p6-7') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-7_Breath Bridge/p3-7_Breath Bridge-1.mp3",
              "p3/p3-7_Breath Bridge/p3-7_Breath Bridge-2.mp3",
              "p3/p3-7_Breath Bridge/p3-7_Breath Bridge-3.mp3",
              "p3/p3-7_Breath Bridge/p3-7_Breath Bridge-4.mp3",
              "p3/p3-7_Breath Bridge/p3-7_Breath Bridge-5.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p3-8' || activePractice.id === 'p6-8') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-8_Center of Gravity/p3-8_Center of Gravity-1.mp3",
              "p3/p3-8_Center of Gravity/p3-8_Center of Gravity-2.mp3",
              "p3/p3-8_Center of Gravity/p3-8_Center of Gravity-3.mp3",
              "p3/p3-8_Center of Gravity/p3-8_Center of Gravity-4.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p3-9' || activePractice.id === 'p6-9') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-9_Shape Shift/p3-9_Shape Shift-1.mp3",
              "p3/p3-9_Shape Shift/p3-9_Shape Shift-2.mp3",
              "p3/p3-9_Shape Shift/p3-9_Shape Shift-3.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p3-10' || activePractice.id === 'p6-10') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-10_Resonant Stillness/p3-10_Resonant Stillness-1.mp3",
              "p3/p3-10_Resonant Stillness/p3-10_Resonant Stillness-2.mp3",
              "p3/p3-10_Resonant Stillness/p3-10_Resonant Stillness-3.mp3",
              "p3/p3-10_Resonant Stillness/p3-10_Resonant Stillness-4.mp3",
              "p3/p3-10_Resonant Stillness/p3-10_Resonant Stillness-5.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p3-11' || activePractice.id === 'p6-11') && (
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
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        {(activePractice.id === 'p3-12' || activePractice.id === 'p6-12') && (
          <RemoteAudioPlayer
            isPlaying={practiceState === 'active' && !isPaused}
            audioPath={[
              "p3/p3-12_Breath of Adaptation/p3-12_Breath of Adaptation-1.mp3",
              "p3/p3-12_Breath of Adaptation/p3-12_Breath of Adaptation-2.mp3",
              "p3/p3-12_Breath of Adaptation/p3-12_Breath of Adaptation-3.mp3",
              "p3/p3-12_Breath of Adaptation/p3-12_Breath of Adaptation-4.mp3",
              "p3/p3-12_Breath of Adaptation/p3-12_Breath of Adaptation-5.mp3"
            ]}
            fadeInDuration={4000}
            fadeOutDuration={4000}
            volume={0.6}
            resetKey={audioResetKey}
            onTrackChange={(current, total) => {
              setCurrentTrack(current);
              setTotalTracks(total);
            }}
          />
        )}
        </>)}
        {/* Lazy-mount Three.js <Canvas> only when the practice is actually
            active. On intro we show the static JPEG preview instead — no
            WebGL context, no HDR decode, nothing for iOS WKWebView to pin
            in GPU memory for a user who only opens/closes the intro.
            Once practiceState flips to 'active', WelcomeScene mounts and
            dissolves from the preview into the HDR panorama via its own
            preview→full cross-fade. */}
        {practiceState === 'active' && PRACTICE_EXR[activePractice.id] ? (
          // Suspense fallback={null} — three.js chunk streams while the user
          // sees the JPEG preview WelcomeScene paints first, then the HDR
          // panorama cross-fades in on top. previewUrl is passed in BOTH themes
          // so the load reads as preview → 3D everywhere (matching the adaptive
          // practice), rather than the 3D popping in over a bare light bg.
          <Suspense fallback={null}>
            <WelcomeScene url={PRACTICE_EXR[activePractice.id]} previewUrl={PRACTICE_JPEG_PREVIEW[activePractice.id]} />
          </Suspense>
        ) : practiceState === 'intro' && PRACTICE_JPEG_PREVIEW[activePractice.id] && !isLight ? (
          <div
            className="absolute inset-0"
            style={{
              zIndex: 0,
              backgroundImage: `url(${PRACTICE_JPEG_PREVIEW[activePractice.id]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              pointerEvents: 'none',
            }}
          />
        ) : !isLight ? (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '3s' }} />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.75s', animationDuration: '4s' }} />
          </div>
        ) : null}

        {!isLight && (
        <div className="absolute inset-0 bg-black/10" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.3) 100%)'
        }} />
        )}

        {!isMinimalMode && (
          <button
            onClick={exitPractice}
            disabled={!canExitPractice}
            style={!canExitPractice ? { pointerEvents: 'none', opacity: 0.5 } : undefined}
            className={`absolute top-[72px] right-6 z-50 p-3 rounded-full transition-all hover:scale-110 border ${completeLight ? 'bg-white/60 hover:bg-white/80 backdrop-blur-md border-violet-200 text-slate-600' : 'bg-white/10 hover:bg-white/20 backdrop-blur-2xl border-white/25'}`}
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {practiceState === 'intro' && (
          <div className="relative z-10 flex items-center justify-center min-h-screen p-3 sm:p-6">
            <div className="max-w-2xl text-center space-y-4 sm:space-y-8">
              <div className="text-5xl sm:text-9xl mb-4 sm:mb-8 animate-bounce" style={{ animationDuration: '2s' }}>
                {activePractice.visual}
              </div>
              <h1 className={`text-xl sm:text-6xl font-bold mb-2 sm:mb-4 leading-tight px-2 ${isLight ? '' : 'drop-shadow-2xl'}`}>
                {getPracticeName(activePractice.id)}
              </h1>
              <div className={`rounded-2xl p-4 sm:p-8 mb-3 sm:mb-6 border shadow-2xl ${isLight ? 'bg-white/55 backdrop-blur-xl border-violet-200 shadow-indigo-100/60' : 'bg-white/10 backdrop-blur-2xl border-white/25'}`}>
                <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <p className={`text-sm font-semibold tracking-wide ${isLight ? 'text-violet-600' : 'text-purple-200'}`}>
                    {activePractice.element}
                  </p>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                </div>
                <p className="text-sm sm:text-2xl leading-relaxed italic font-light">
                  "{t(`practice_items.${getPracticeKey(activePractice.id)}_pre_start`, { defaultValue: getPracticeMessage(activePractice.id) })}"
                </p>
              </div>
              {/* Science block — Biology / Why / Effect / Bio-marker.
                  Pulls from i18n keys named `<practice_key>_<field>` per
                  practice (e.g. micro_breath_biology). Falls back to the
                  legacy `activePractice.scienceInfo` array for any
                  practice that doesn't yet have the new keys (Parts 2+
                  during the rollout). */}
              {(() => {
                const key = getPracticeKey(activePractice.id);
                const hasBio = !!t(`practice_items.${key}_biology`, { defaultValue: '' });
                if (hasBio) {
                  const rows: Array<[string, string]> = [
                    [t('practice_items.label_biology', 'Biology:'), t(`practice_items.${key}_biology`)],
                    [t('practice_items.label_why', 'Why:'), t(`practice_items.${key}_why`)],
                    [t('practice_items.label_effect', 'Effect:'), t(`practice_items.${key}_effect`)],
                    [t('practice_items.label_biomarker', 'Bio-marker:'), t(`practice_items.${key}_biomarker`)],
                  ];
                  return (
                    <div className={`text-sm sm:text-base space-y-2 mb-4 sm:mb-6 px-4 max-w-lg text-justify mx-auto ${isLight ? 'text-slate-600' : 'text-gray-200'}`}>
                      {rows.map(([label, body], idx) => (
                        <p key={idx} className="leading-tight">
                          <span className="font-bold">{label}</span> {body}
                        </p>
                      ))}
                    </div>
                  );
                }
                if (activePractice.scienceInfo && activePractice.scienceInfo.length > 0) {
                  return (
                    <div className={`text-sm sm:text-base space-y-2 mb-4 sm:mb-6 px-4 max-w-lg text-justify ${isLight ? 'text-slate-600' : 'text-gray-200'}`}>
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
                  );
                }
                return null;
              })()}
              <div className={`flex items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base ${isLight ? 'text-slate-600' : 'text-gray-200'}`}>
                <span className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-xl text-xs sm:text-base min-w-[100px] sm:min-w-[120px] text-center border ${isLight ? 'bg-white/70 border-violet-200' : 'bg-white/10 border-white/20'}`}>
                  {activePractice.targetTime ? `${Math.floor(activePractice.targetTime / 60)} ${t('practice_items.duration_min')}` : activePractice.duration}
                </span>
                <span className={isLight ? 'text-slate-400' : 'text-gray-400'}>•</span>
                <span className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-xl text-xs sm:text-base min-w-[100px] sm:min-w-[120px] text-center border ${isLight ? 'bg-white/70 border-violet-200' : 'bg-white/10 border-white/20'}`}>
                  {t('practices.up_to')} {activePractice.maxQnt} OND
                </span>
              </div>
              <button
                onClick={() => {
                  // Free-tier sampler bypass: the first three Part-1 basic
                  // practices (p1-1, p1-2, p1-3) are accessible without
                  // subscription AND without authentication. Every other
                  // practice still goes through the paywall on iOS for
                  // non-premium users.
                  const isFreePractice = activePractice?.id
                    ? FREE_PRACTICE_IDS.has(activePractice.id)
                    : false;
                  if (isFreePractice || isPremium || isSubLoading || platform !== 'ios') {
                    beginPractice();
                    return;
                  }
                  track('paywall_view', {
                    source: 'practice_intro',
                    practice_id: activePractice?.id,
                    practice_type: 'basic',
                  });
                  setPendingStartPracticeAfterSubscribe(true);
                  setPaywallSource('practice_gate_basic');
                  setShowSubscriptionModal(true);
                }}
                className={`backdrop-blur-2xl px-6 sm:px-8 py-3 sm:py-5 rounded-full text-sm sm:text-base font-semibold transition-all transform hover:scale-110 border ${isLight ? 'bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 text-slate-700 shadow-sm shadow-indigo-200/40' : 'bg-white/10 hover:bg-white/20 border-white/25 shadow-2xl'}`}
              >
                {t('practices.start')}
              </button>
            </div>
          </div>
        )}

        {practiceState === 'active' && (
          <div
            className={`relative z-10 flex flex-col items-center min-h-screen p-3 sm:p-6 transition-all duration-500 text-white ${isMinimalMode ? 'justify-end' : 'justify-center'}`}
            style={{ paddingBottom: isMinimalMode
  ? platform === 'ios'
    ? 'calc(max(env(safe-area-inset-bottom, 0px), 48px) + 10px)'
    : platform === 'android'
      ? 'calc(max(env(safe-area-inset-bottom, 0px), 48px) + 30px)'
      : 'calc(max(env(safe-area-inset-bottom, 0px), 48px) + 0px)'
  : 'calc(max(env(safe-area-inset-bottom, 0px), 48px) + 16px)' }}
          >
            {/* Компактный круг с эмодзи и таймером */}
            {!isMinimalMode && (<div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-4 sm:mb-6 mx-auto mt-1 sm:mt-3">
              {/* Круговой прогресс */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  fill="none"
                  stroke="rgba(255,255,255,0.18)"
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
            </div>)}

            {/* Live hero window — the visual centre of the active screen.
                Extracted into <CameraPulseWindow> so every practice surface
                (basic, adaptive, onboarding) renders the SAME thing. Source-
                aware: watch → Coherence hero; no watch → camera offer / Pulse.
                Coherence % is RSA peak-concentration from useVitals — NOT RMSSD
                HRV (we never get beat-to-beat RR over WCSession). */}
            {/* Kept MOUNTED across minimal mode (hidden via CSS, not unmounted)
                so MetricsWaveform's rolling buffer survives — otherwise the pulse
                line would redraw from scratch on return from the zen view. */}
            <div className={`w-full max-w-md mb-4 sm:mb-5 px-3 sm:px-0 ${isMinimalMode ? 'hidden' : ''}`}>
              <CameraPulseWindow
                hasWatch={watchHeartRate.heartRate != null}
                displayHeartRate={displayHeartRate}
                hrSource={vitalsData.hrSource}
                coherence={vitalsData.coherence}
                breathing={vitalsData.br}
                cameraPpg={cameraPpg}
                cameraOfferDismissed={cameraOfferDismissed}
                onDismissOffer={() => setCameraOfferDismissed(true)}
              />
            </div>

            {/* Progress bar (was labelled "Quality" — renamed because the bar
                grows monotonically through the practice; a low % early on read
                as "bad quality"). Underlying score calc unchanged. */}
            {!isMinimalMode && (<div className="w-full max-w-md mb-4 sm:mb-6 px-3 sm:px-0">
              <div className="flex justify-between text-sm sm:text-base mb-2 sm:mb-3">
                <span className="font-semibold">{t('practices.progress')}</span>
                <span className="font-bold text-xl sm:text-2xl">{safeToFixed(qualityScore, 0)}%</span>
              </div>
              <div className="w-full h-5 sm:h-6 rounded-full overflow-hidden backdrop-blur-sm border border-white/20 bg-black/30 shadow-inner">
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
            </div>)}

            {/* Guiding text — coaching layer. Lives UNDER the progress bar in
                the standard active view (subtle/frosted, functional during the
                practice) AND becomes the sole zen card in minimal mode (larger,
                tappable to exit minimal mode). */}
            {activePractice.guidingTexts && activePractice.guidingTexts.length > 0 && (
              <div
                className={`w-full max-w-md px-3 sm:px-0 ${isMinimalMode ? '' : 'mb-6 sm:mb-8'}`}
                onClick={isMinimalMode ? () => setIsMinimalMode(false) : undefined}
              >
                <div className={`backdrop-blur-2xl rounded-2xl border flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
                  isMinimalMode
                    ? 'bg-white/10 border-white/30 p-4 sm:p-6 h-28 sm:h-32 cursor-pointer hover:bg-white/20 active:scale-95'
                    : 'bg-white/5 border-white/15 px-4 sm:px-6 h-[78px] sm:h-[88px]'
                }`}>
                  <p
                    className={`text-center italic leading-snug whitespace-pre-line transition-all duration-1000 ${
                      isMinimalMode ? 'text-sm sm:text-base text-white/90' : 'text-xs sm:text-sm text-white/75'
                    } ${
                      isTextTransitioning ? 'opacity-0 translate-y-[-20px]' : 'opacity-100 translate-y-0'
                    }`}
                  >
                    {activePractice.guidingTexts[currentGuidingTextIndex]}
                  </p>
                </div>
              </div>
            )}

            {!isMinimalMode && (
            <div className="flex gap-3 sm:gap-6">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-2xl p-3 sm:p-5 rounded-full transition-all hover:scale-110 border border-white/25 text-white"
              >
                {isPaused ? <Play className="w-6 h-6 sm:w-8 sm:h-8" /> : <Pause className="w-6 h-6 sm:w-8 sm:h-8" />}
              </button>
              <button
                onClick={finishPractice}
                className="bg-emerald-500/25 hover:bg-emerald-500/40 backdrop-blur-2xl px-6 py-3 sm:px-10 sm:py-5 rounded-full font-bold text-sm sm:text-lg transition-all hover:scale-105 border border-emerald-400/50 text-white"
              >
                {t('practices.end_practice')}
              </button>
              <button
                onClick={() => setIsMinimalMode(!isMinimalMode)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-2xl p-3 sm:p-5 rounded-full transition-all hover:scale-110 border border-white/25 text-white"
              >
                <Minimize2 className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </div>
            )}
          </div>
        )}

        {practiceState === 'complete' && (
          <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6">
            <div className="max-w-2xl w-full text-center space-y-4 sm:space-y-8">
              <div className="text-6xl sm:text-8xl md:text-9xl mb-4 sm:mb-8 animate-bounce" style={{ animationDuration: '1s' }}>✨</div>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 ${completeLight ? 'text-slate-500' : ''}`}>{t('practices.completed')}</h2>

              {activePractice.finalPhrase && (
                <div className={`rounded-2xl p-4 sm:p-6 border shadow-xl mb-4 sm:mb-6 ${completeLight ? 'bg-white/55 backdrop-blur-xl border-violet-200 shadow-indigo-100/60' : 'bg-white/10 backdrop-blur-2xl border-white/25'}`}>
                  <p className={`text-base sm:text-lg md:text-xl italic leading-relaxed whitespace-pre-line ${completeLight ? 'text-slate-500' : 'text-white/90'}`}>
                    {activePractice.finalPhrase}
                  </p>
                </div>
              )}

              {/* Honest signal — replaces the gamified OND/Quality/stars block.
                  A = no sensor → invite; B = camera + a real, SUSTAINED pulse
                  drop → "from X to Y"; C = everything else → neutral, no
                  numbers, never "rose", never a grade. Decided in finishPractice
                  (honestResult). EN fallbacks so every locale renders honestly. */}
              <div className={`rounded-2xl p-6 sm:p-8 md:p-10 border shadow-2xl ${completeLight ? 'bg-white/55 backdrop-blur-xl border-violet-200 shadow-indigo-100/60' : 'bg-white/10 backdrop-blur-2xl border-white/25'}`}>
                <p className={`text-base sm:text-lg md:text-xl leading-relaxed whitespace-pre-line ${completeLight ? 'text-slate-600' : 'text-white/90'}`}>
                  {honestResult?.state === 'A'
                    ? t('practices.result_a', "You've completed your first practice. Connect the camera or a watch to see what to do with it.")
                    : honestResult?.state === 'B'
                      ? t('practices.result_b', 'Your pulse dropped from {{start}} to {{min}} during the practice — your body is responding to the breath.\nWith a watch, next practices show more: how heart and breath sync up.', { start: honestResult?.hrStart, min: honestResult?.hrMin })
                      : t('practices.result_c', 'You breathed, and your body tracked it. With a watch, next practices show more — how heart and breath sync up.')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                {/* Try again — hidden on the onboarding first run (cameFromFirstRun):
                    a replay over a list the new user hasn't seen yet only delays
                    "Enter ONDA". Kept for normal hub-launched practices. */}
                {!cameFromFirstRun && (
                <button
                  onClick={() => {
                    setPracticeState('intro');
                    setPracticeTime(0);
                    setQualityScore(0);
                    setPracticeRating(0);
                    setIsPaused(false);
                    setAudioResetKey(prev => prev + 1);
                  }}
                  className={`flex-1 sm:flex-none sm:min-w-[15rem] backdrop-blur-xl px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all border ${completeLight ? 'bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 text-slate-600' : 'bg-white/10 hover:bg-white/20 border-white/25 text-white'}`}
                >
                  {t('practices.try_again')}
                </button>
                )}
                <button
                  onClick={exitPractice}
                  className={`flex-1 sm:flex-none sm:min-w-[15rem] backdrop-blur-xl px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all border ${completeLight ? 'bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 text-slate-600' : 'bg-white/10 hover:bg-white/20 border-white/25 text-white'}`}
                  data-testid="button-exit-practice"
                >
                  {cameFromFirstRun ? t('practices.enter_onda') : t('practices.back_to_practices')}
                </button>
              </div>
            </div>
          </div>
        )}

        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          activeCircuit={activeCircuit}
          source={paywallSource ?? undefined}
          onSubscribed={async () => {
            await refreshSubscription();
          }}
        />
      </div>
    );
  }

  if (showOnboarding) {
    const handleOnboardingNext = async () => {
      // v1.7.3: онбординг теперь — чистые info-экраны. ATT-prompt убран
      // (SKAN-only атрибуция через Tenjin). Notifications-prompt отложен
      // до Notification Primer'а после 2 завершённых практик.

      if (onboardingScreen < 3) {
        setOnboardingScreen(onboardingScreen + 1);
      } else {
        localStorage.setItem('onda_onboarding_completed', 'true');
        const durationSeconds = onboardingStartRef.current
          ? Math.round((Date.now() - onboardingStartRef.current) / 1000)
          : undefined;
        track('onboarding_complete', { source: 'menu', duration_seconds: durationSeconds });
        trackTenjinOnboardingComplete(durationSeconds);
        setShowOnboarding(false);
        // Intentionally NOT opening the Auth modal here. The free-tier
        // sampler (p1-1, p1-2, p1-3) runs without an account, so the
        // shortest path from onboarding → first practice should have
        // zero friction. Sign-up is still mandatory later, at the
        // subscription paywall — that's where we ask, in context.
        // Users who want to sign in early can still do so via the menu.
      }
    };

    return (
      <div className={`h-full overflow-x-hidden ${isLight ? 'text-slate-800 bg-gradient-to-br from-indigo-50 via-white to-violet-100' : 'text-white bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950'}`}>
        <div
          className="min-h-screen flex flex-col justify-between px-6 py-8 max-w-2xl mx-auto"
        >
          {/* Forward-only flow: dots are now a non-interactive progress
              indicator. We can't re-prompt for permissions if the user
              taps a previous dot, so back-navigation in this flow is
              functionally broken — better to remove it entirely. */}
          <div className="flex justify-center gap-3 pt-4">
            {[1, 2, 3].map((dot) => (
              <div
                key={dot}
                className={`w-3 h-3 rounded-full transition-all ${
                  onboardingScreen === dot
                    ? 'bg-violet-400 scale-125'
                    : isLight ? 'bg-slate-300' : 'bg-white/30'
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
                <p className={`leading-relaxed text-lg ${isLight ? 'text-slate-700' : 'text-white/90'}`}>{t('onboarding.screen1_text1')}</p>
                <ul className={`space-y-3 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
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

                {/* Bridge to the iOS ATT prompt that fires after Continue */}
                <div className="mt-6 rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 flex items-start gap-3">
                  <span aria-hidden className="mt-0.5 text-violet-300 text-base">ℹ️</span>
                  <p className={`text-sm italic leading-relaxed ${isLight ? 'text-violet-700' : 'text-violet-100/90'}`}>
                    {attCopyVariantRef.current === 'b'
                      ? t('onboarding.screen1_bridge_b')
                      : t('onboarding.screen1_bridge')}
                  </p>
                </div>
              </div>
            )}

            {onboardingScreen === 2 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="text-center mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold">{t('onboarding.screen2_title')}</h1>
                </div>
                <p className={`leading-relaxed text-lg ${isLight ? 'text-slate-700' : 'text-white/90'}`}>{t('onboarding.screen2_text1')}</p>
                <p className={`font-medium ${isLight ? 'text-slate-600' : 'text-white/80'}`}>{t('onboarding.screen2_text2')}</p>
                <ul className={`space-y-3 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
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

                {/* Bridge to the iOS notifications prompt that fires after Continue */}
                <div className="mt-6 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 flex items-start gap-3">
                  <span aria-hidden className="mt-0.5 text-cyan-300 text-base">🔔</span>
                  <p className={`text-sm italic leading-relaxed ${isLight ? 'text-cyan-700' : 'text-cyan-100/90'}`}>
                    {t('onboarding.screen2_bridge')}
                  </p>
                </div>
              </div>
            )}

            {onboardingScreen === 3 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="text-center mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold">{t('onboarding.screen3_title')}</h1>
                </div>
                <p className={`leading-relaxed text-lg ${isLight ? 'text-slate-700' : 'text-white/90'}`}>{t('onboarding.screen3_text1')}</p>
                <ul className={`space-y-3 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">•</span>
                    <span>{t('onboarding.screen3_list1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">•</span>
                    <span>{t('onboarding.screen3_list2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">•</span>
                    <span>{t('onboarding.screen3_list3')}</span>
                  </li>
                </ul>
                <p className="text-amber-300 italic text-lg text-center pt-4">{t('onboarding.screen3_conclusion')}</p>
              </div>
            )}
          </div>

          <div 
            className="pb-8"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 32px)' }}
          >
            <button
              onClick={handleOnboardingNext}
              className={`grid mx-auto px-8 py-4 rounded-xl text-lg font-semibold transition-all border bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 ${isLight ? 'text-slate-800' : 'text-white'}`}
              data-testid="button-onboarding-next"
            >
              {/* Невидимый дублёр самой длинной надписи задаёт фикс. ширину —
                  кнопка не «прыгает» по ширине между экранами онбординга. */}
              <span className="col-start-1 row-start-1 text-center">
                {onboardingScreen === 3 ? t('onboarding.start_journey') : t('onboarding.continue')}
              </span>
              <span className="col-start-1 row-start-1 invisible h-0 overflow-hidden" aria-hidden="true">
                {t('onboarding.start_journey')}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // FIRST-RUN WELCOME — onboarding refactor. One screen, two choices.
  // Rendered after the practice early-return above, so the CTA (which
  // opens the featured free practice) lands on the practice intro on
  // the very next render. See the showFirstRun state for display rules.
  // ═══════════════════════════════════════════════════════
  if (showFirstRun) {
    const dismissFirstRun = (via: 'cta' | 'skip') => {
      localStorage.setItem('onda_first_run_done', 'true');
      const durationSeconds = firstRunShownAtRef.current
        ? Math.round((Date.now() - firstRunShownAtRef.current) / 1000)
        : undefined;
      // Live new-user funnel close. completed_via folds the old
      // first_run_welcome_cta/skip split into a param (one event, variety in
      // params). Tenjin/Axon still get completion via tutorial_complete.
      track('onboarding_complete', {
        source: 'first_run',
        completed_via: via,
        featured_practice_id: featuredPracticeId,
        duration_seconds: durationSeconds,
      });
      trackTenjinOnboardingComplete(durationSeconds);
      setShowFirstRun(false);
      if (via === 'cta') {
        const featured = circuits
          .flatMap(c => c.practices)
          .find(p => p.id === featuredPracticeId);
        if (featured) {
          // Mark this as the first-run session so the results screen offers
          // "Enter ONDA" (their first entry into the app) rather than the
          // "Back to Practices" label, which would point at a list they have
          // never seen.
          setCameFromFirstRun(true);
          // Same entry point the hub cards use — opens the practice intro
          // where the existing free-tier Start button leads straight into the
          // live session (practice_start fires when the session begins).
          completePractice(featured.id, featured.maxQnt);
        }
      }
    };
    const featuredMinutes = Math.max(
      1,
      Math.round((practiceSpaces[featuredPracticeId]?.targetTime ?? 180) / 60),
    );

    return (
      <div className={`h-full overflow-x-hidden ${isLight ? 'text-slate-800 bg-gradient-to-br from-indigo-50 via-white to-violet-100' : 'text-white bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950'}`}>
        <div
          className="min-h-screen flex flex-col justify-center px-6 py-8 max-w-2xl mx-auto text-center"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 32px)' }}
        >
          <div className={`text-base sm:text-lg font-light tracking-[0.35em] mb-8 ${isLight ? 'text-slate-500' : 'text-white/70'}`}>
            ONDA
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-6">
            {t('first_run.title')}
          </h1>
          <p className={`text-lg leading-relaxed mb-10 ${isLight ? 'text-slate-600' : 'text-white/85'}`}>
            {t('first_run.body', { minutes: featuredMinutes })}
          </p>
          <button
            onClick={() => dismissFirstRun('cta')}
            className={`mx-auto px-8 py-4 rounded-xl text-lg font-semibold transition-all border bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 ${isLight ? 'text-slate-800' : 'text-white'}`}
            data-testid="button-first-run-start"
          >
            {t('first_run.cta', { minutes: featuredMinutes })}
          </button>
          <button
            onClick={() => dismissFirstRun('skip')}
            className={`mx-auto mt-6 px-4 py-2 text-sm underline underline-offset-4 transition-colors ${isLight ? 'text-slate-500 hover:text-slate-700' : 'text-white/60 hover:text-white/80'}`}
            data-testid="button-first-run-skip"
          >
            {t('first_run.skip')}
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // ADDON VIEW — полноэкранная страница расширенной информации о части
  // ═══════════════════════════════════════════════════════
  if (activeView === 'addon') {
    const accentColor = activeCircuit === 2 ? 'cyan' : activeCircuit === 3 ? 'amber' : activeCircuit === 4 ? 'teal' : activeCircuit === 5 ? 'yellow' : activeCircuit === 6 ? 'emerald' : activeCircuit === 7 ? 'sky' : activeCircuit === 8 ? 'indigo' : activeCircuit === 9 ? 'amber' : activeCircuit === 10 ? 'orange' : activeCircuit === 11 ? 'cyan' : activeCircuit === 12 ? 'fuchsia' : 'purple';
    const glowA = CIRCUIT_GLOW_LIGHT[activeCircuit] ?? CIRCUIT_GLOW_DEFAULT;

    return (
      <div
        className={`h-full overflow-x-hidden pb-6 pt-8 transition-all duration-1000 ${isLight ? 'text-slate-800' : 'text-white'} ${
        isLight
          ? ''
          : activeCircuit === 2
          ? 'bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900'
          : activeCircuit === 3
          ? 'bg-gradient-to-br from-amber-950 via-orange-900 to-amber-950'
          : activeCircuit === 4
          ? 'bg-gradient-to-br from-teal-950 via-cyan-900 to-teal-950'
          : activeCircuit === 5
          ? 'bg-gradient-to-br from-yellow-900 via-yellow-800 to-yellow-900'
          : activeCircuit === 6
          ? 'bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-950'
          : activeCircuit === 7
          ? 'bg-gradient-to-br from-sky-950 via-blue-900 to-sky-950'
          : activeCircuit === 8
          ? 'bg-gradient-to-br from-indigo-950 via-violet-900 to-indigo-950'
          : activeCircuit === 9
          ? 'bg-gradient-to-br from-amber-800 via-yellow-600 to-amber-800 shadow-[inset_0_0_180px_rgba(253,224,71,0.7)]'
          : activeCircuit === 10
          ? 'bg-gradient-to-br from-orange-950 via-amber-900 to-orange-950'
          : activeCircuit === 11
          ? 'bg-gradient-to-br from-teal-900 via-cyan-800 to-teal-900'
          : activeCircuit === 12
          ? 'bg-gradient-to-br from-fuchsia-950 via-red-900 to-fuchsia-950'
          : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
      }`}
        style={isLight ? {
          background: `radial-gradient(900px circle at 12% 18%, ${glowA.orbA}, transparent 60%), radial-gradient(820px circle at 88% 82%, ${glowA.orbB}, transparent 58%), linear-gradient(135deg, #eef2ff 0%, #ffffff 52%, #f5f3ff 100%)`,
        } : undefined}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6">

          {/* Кнопка возврата к основной странице части */}
          <button
            onClick={() => {
              setActiveView('main');
              const rootEl = document.getElementById('root');
              if (rootEl) rootEl.scrollTop = 0;
              window.scrollTo(0, 0);
            }}
            className={`mb-6 mt-2 mx-auto flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all backdrop-blur-md ${
              isLight
                ? `bg-white/60 ${glowA.panelBorder} border text-slate-600 hover:bg-white/80 shadow-lg shadow-indigo-100/60`
                : activeCircuit === 2
                ? 'bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-800/50'
                : activeCircuit === 3
                ? 'bg-amber-900/40 border border-amber-600/30 text-amber-300 hover:bg-amber-800/50'
                : activeCircuit === 4
                ? 'bg-teal-900/40 border border-teal-500/30 text-teal-300 hover:bg-teal-800/50'
                : activeCircuit === 5
                ? 'bg-yellow-800/40 border border-yellow-600/30 text-yellow-200 hover:bg-yellow-700/50'
                : activeCircuit === 6
                ? 'bg-emerald-800/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-700/50'
                : activeCircuit === 7
                ? 'bg-sky-800/40 border border-sky-500/30 text-sky-300 hover:bg-sky-700/50'
                : activeCircuit === 8
                ? 'bg-indigo-800/40 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-700/50'
                : activeCircuit === 9
                ? 'bg-amber-800/40 border border-yellow-300/70 text-yellow-100 hover:bg-amber-700/50 shadow-[0_0_18px_rgba(253,224,71,0.35)]'
                : activeCircuit === 10
                ? 'bg-orange-800/40 border border-orange-500/30 text-orange-300 hover:bg-orange-700/50'
                : activeCircuit === 11
                ? 'bg-teal-800/40 border border-cyan-500/30 text-cyan-200 hover:bg-teal-700/50'
                : activeCircuit === 12
                ? 'bg-fuchsia-800/40 border border-fuchsia-500/30 text-fuchsia-300 hover:bg-fuchsia-700/50'
                : 'bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-800/50'
            }`}
          >
            <span>{t('part_info.back_to_part', { part: activeCircuit }).replace(/←/g, '').trim()}</span>
          </button>

          {/* Заголовок и протокол */}
          <div className={`backdrop-blur-md rounded-2xl p-8 border shadow-2xl mb-6 transition-all duration-500 ${
            isLight
            ? `bg-white/55 backdrop-blur-xl shadow-lg shadow-indigo-100/60 ${glowA.panelBorder}`
            : activeCircuit === 2
              ? 'bg-gradient-to-br from-teal-900/30 via-cyan-900/20 to-blue-900/30 border-cyan-500/30'
              : activeCircuit === 3
              ? 'bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-amber-900/30 border-amber-600/30'
              : activeCircuit === 4
              ? 'bg-gradient-to-br from-teal-900/30 via-cyan-900/20 to-teal-900/30 border-teal-500/30'
              : activeCircuit === 5
              ? 'bg-gradient-to-br from-yellow-800/40 via-yellow-700/30 to-yellow-800/40 border-amber-600/40'
              : activeCircuit === 6
              ? 'bg-gradient-to-br from-emerald-800/40 via-teal-700/30 to-emerald-800/40 border-emerald-500/40'
              : activeCircuit === 7
              ? 'bg-gradient-to-br from-sky-800/40 via-blue-700/30 to-sky-800/40 border-sky-500/40'
              : activeCircuit === 8
              ? 'bg-gradient-to-br from-indigo-800/40 via-violet-700/30 to-indigo-800/40 border-indigo-500/40'
              : activeCircuit === 9
              ? 'bg-gradient-to-br from-amber-800/40 via-yellow-600/30 to-amber-800/40 border-yellow-300/60 ring-1 ring-yellow-300/40 shadow-[0_0_30px_rgba(253,224,71,0.45)]'
              : activeCircuit === 10
              ? 'bg-gradient-to-br from-orange-800/40 via-amber-700/30 to-orange-800/40 border-orange-500/40'
              : activeCircuit === 11
              ? 'bg-gradient-to-br from-teal-800/40 via-cyan-700/30 to-teal-800/40 border-cyan-500/40'
              : activeCircuit === 12
              ? 'bg-gradient-to-br from-fuchsia-800/40 via-red-700/30 to-fuchsia-800/40 border-fuchsia-500/40'
              : 'bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/30 border-indigo-500/30'
          }`}>
            <div className="text-center mb-6">
              <h1 className={`text-2xl font-bold mb-3 ${
                activeCircuit === 2 ? 'text-cyan-300' : activeCircuit === 3 ? 'text-amber-300' : activeCircuit === 4 ? 'text-teal-300' : activeCircuit === 5 ? 'text-yellow-200' : activeCircuit === 6 ? 'text-emerald-300' : activeCircuit === 7 ? 'text-sky-300' : activeCircuit === 8 ? 'text-indigo-300' : activeCircuit === 9 ? 'text-yellow-300' : activeCircuit === 10 ? 'text-orange-300' : activeCircuit === 11 ? 'text-cyan-300' : activeCircuit === 12 ? 'text-fuchsia-300' : 'text-pink-300'
              }`}>{t(`part_info.level_${activeCircuit}.title`)}</h1>
              <p className={`text-base italic ${
                activeCircuit === 2 ? 'text-teal-300/80' : activeCircuit === 3 ? 'text-orange-300/80' : activeCircuit === 4 ? 'text-cyan-300/80' : activeCircuit === 5 ? 'text-yellow-300/80' : activeCircuit === 6 ? 'text-teal-300/80' : activeCircuit === 7 ? 'text-blue-300/80' : activeCircuit === 8 ? 'text-violet-300/80' : activeCircuit === 9 ? 'text-amber-300/80' : activeCircuit === 10 ? 'text-amber-300/80' : activeCircuit === 11 ? 'text-teal-300/80' : activeCircuit === 12 ? 'text-red-300/80' : 'text-purple-300/80'
              }`}>{t(`part_info.level_${activeCircuit}.protocol`)}</p>
            </div>

            {/* Введение */}
            <div className="space-y-4 mb-2">
              <p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-200'}`}>{t(`part_info.level_${activeCircuit}.intro`)}</p>
              <p className={`leading-relaxed ${isLight ? 'text-slate-500' : 'text-gray-300'}`}>{t(`part_info.level_${activeCircuit}.basis`)}</p>
            </div>
          </div>

          {/* Архитектура Протокола */}
          {t(`part_info.level_${activeCircuit}.architecture_title`, { defaultValue: '' }) && (
            <div className={`backdrop-blur-md rounded-2xl p-8 border shadow-2xl mb-6 ${
              isLight
              ? `bg-white/55 backdrop-blur-xl shadow-lg shadow-indigo-100/60 ${glowA.panelBorder}`
              : activeCircuit === 2
                ? 'bg-gradient-to-br from-teal-900/20 via-cyan-900/10 to-blue-900/20 border-cyan-500/20'
                : activeCircuit === 3
                ? 'bg-gradient-to-br from-amber-900/20 via-orange-900/10 to-amber-900/20 border-amber-600/20'
                : activeCircuit === 4
                ? 'bg-gradient-to-br from-teal-900/20 via-cyan-900/10 to-teal-900/20 border-teal-500/20'
                : activeCircuit === 5
                ? 'bg-gradient-to-br from-yellow-800/30 via-yellow-700/20 to-yellow-800/30 border-amber-600/30'
                : activeCircuit === 6
                ? 'bg-gradient-to-br from-emerald-800/30 via-teal-700/20 to-emerald-800/30 border-emerald-500/30'
                : activeCircuit === 7
                ? 'bg-gradient-to-br from-sky-800/30 via-blue-700/20 to-sky-800/30 border-sky-500/30'
                : activeCircuit === 8
                ? 'bg-gradient-to-br from-indigo-800/30 via-violet-700/20 to-indigo-800/30 border-indigo-500/30'
                : activeCircuit === 9
                ? 'bg-gradient-to-br from-amber-800/30 via-yellow-600/20 to-amber-800/30 border-yellow-300/50 ring-1 ring-yellow-300/30 shadow-[0_0_22px_rgba(253,224,71,0.35)]'
                : activeCircuit === 10
                ? 'bg-gradient-to-br from-orange-800/30 via-amber-700/20 to-orange-800/30 border-orange-500/30'
                : activeCircuit === 11
                ? 'bg-gradient-to-br from-teal-800/30 via-cyan-700/20 to-teal-800/30 border-cyan-500/30'
                : activeCircuit === 12
                ? 'bg-gradient-to-br from-fuchsia-800/30 via-red-700/20 to-fuchsia-800/30 border-fuchsia-500/30'
                : 'bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-pink-900/20 border-indigo-500/20'
            }`}>
              <h2 className={`text-xl font-bold mb-3 ${
                activeCircuit === 2 ? 'text-cyan-300' : activeCircuit === 3 ? 'text-amber-300' : activeCircuit === 4 ? 'text-teal-300' : activeCircuit === 5 ? 'text-yellow-200' : activeCircuit === 6 ? 'text-emerald-300' : activeCircuit === 7 ? 'text-sky-300' : activeCircuit === 8 ? 'text-indigo-300' : activeCircuit === 9 ? 'text-yellow-300' : activeCircuit === 10 ? 'text-orange-300' : activeCircuit === 11 ? 'text-cyan-300' : activeCircuit === 12 ? 'text-fuchsia-300' : 'text-pink-300'
              }`}>{t(`part_info.level_${activeCircuit}.architecture_title`)}</h2>
              <p className="text-gray-400 mb-5">{t(`part_info.level_${activeCircuit}.architecture_intro`)}</p>

              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => {
                  const pillarTitle = t(`part_info.level_${activeCircuit}.pillar_${i}_title`, { defaultValue: '' });
                  if (!pillarTitle) return null;
                  return (
                    <div key={i} className={`${isLight ? 'bg-white/60' : 'bg-black/25'} rounded-xl p-5 border ${
                      activeCircuit === 2 ? 'border-cyan-500/20' : activeCircuit === 3 ? 'border-amber-600/20' : activeCircuit === 4 ? 'border-teal-500/20' : activeCircuit === 5 ? 'border-yellow-600/20' : activeCircuit === 6 ? 'border-emerald-500/20' : activeCircuit === 7 ? 'border-sky-500/20' : activeCircuit === 8 ? 'border-indigo-500/20' : activeCircuit === 9 ? 'border-yellow-500/30' : activeCircuit === 10 ? 'border-orange-500/20' : activeCircuit === 11 ? 'border-cyan-500/20' : activeCircuit === 12 ? 'border-fuchsia-500/20' : 'border-purple-500/20'
                    }`}>
                      <h3 className={`font-semibold mb-2 ${
                        activeCircuit === 2 ? 'text-cyan-400' : activeCircuit === 3 ? 'text-amber-400' : activeCircuit === 4 ? 'text-teal-400' : activeCircuit === 5 ? 'text-yellow-300' : activeCircuit === 6 ? 'text-emerald-400' : activeCircuit === 7 ? 'text-sky-400' : activeCircuit === 8 ? 'text-indigo-400' : activeCircuit === 9 ? 'text-yellow-400' : activeCircuit === 10 ? 'text-orange-400' : activeCircuit === 11 ? 'text-cyan-400' : activeCircuit === 12 ? 'text-fuchsia-400' : 'text-purple-400'
                      }`}>{i}. {pillarTitle}</h3>
                      <p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>{t(`part_info.level_${activeCircuit}.pillar_${i}_text`)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Биологический фокус */}
          {t(`part_info.level_${activeCircuit}.bio_focus_title`, { defaultValue: '' }) && (
            <div className={`backdrop-blur-md rounded-2xl p-8 border shadow-2xl mb-6 ${
              isLight
              ? `bg-white/55 backdrop-blur-xl shadow-lg shadow-indigo-100/60 ${glowA.panelBorder}`
              : activeCircuit === 2
                ? 'bg-gradient-to-br from-teal-900/20 via-cyan-900/10 to-blue-900/20 border-cyan-500/20'
                : activeCircuit === 3
                ? 'bg-gradient-to-br from-amber-900/20 via-orange-900/10 to-amber-900/20 border-amber-600/20'
                : activeCircuit === 4
                ? 'bg-gradient-to-br from-teal-900/20 via-cyan-900/10 to-teal-900/20 border-teal-500/20'
                : activeCircuit === 5
                ? 'bg-gradient-to-br from-yellow-800/30 via-yellow-700/20 to-yellow-800/30 border-amber-600/30'
                : activeCircuit === 6
                ? 'bg-gradient-to-br from-emerald-800/30 via-teal-700/20 to-emerald-800/30 border-emerald-500/30'
                : activeCircuit === 7
                ? 'bg-gradient-to-br from-sky-800/30 via-blue-700/20 to-sky-800/30 border-sky-500/30'
                : activeCircuit === 8
                ? 'bg-gradient-to-br from-indigo-800/30 via-violet-700/20 to-indigo-800/30 border-indigo-500/30'
                : activeCircuit === 9
                ? 'bg-gradient-to-br from-amber-800/30 via-yellow-600/20 to-amber-800/30 border-yellow-300/50 ring-1 ring-yellow-300/30 shadow-[0_0_22px_rgba(253,224,71,0.35)]'
                : activeCircuit === 10
                ? 'bg-gradient-to-br from-orange-800/30 via-amber-700/20 to-orange-800/30 border-orange-500/30'
                : activeCircuit === 11
                ? 'bg-gradient-to-br from-teal-800/30 via-cyan-700/20 to-teal-800/30 border-cyan-500/30'
                : activeCircuit === 12
                ? 'bg-gradient-to-br from-fuchsia-800/30 via-red-700/20 to-fuchsia-800/30 border-fuchsia-500/30'
                : 'bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-pink-900/20 border-indigo-500/20'
            }`}>
              <h2 className={`text-xl font-bold mb-3 ${
                activeCircuit === 2 ? 'text-cyan-300' : activeCircuit === 3 ? 'text-amber-300' : activeCircuit === 4 ? 'text-teal-300' : activeCircuit === 5 ? 'text-yellow-200' : activeCircuit === 6 ? 'text-emerald-300' : activeCircuit === 7 ? 'text-sky-300' : activeCircuit === 8 ? 'text-indigo-300' : activeCircuit === 9 ? 'text-yellow-300' : activeCircuit === 10 ? 'text-orange-300' : activeCircuit === 11 ? 'text-cyan-300' : activeCircuit === 12 ? 'text-fuchsia-300' : 'text-pink-300'
              }`}>{t(`part_info.level_${activeCircuit}.bio_focus_title`)}</h2>
              <p className="text-gray-400 mb-4">{t(`part_info.level_${activeCircuit}.bio_focus_intro`)}</p>
              <ul className="space-y-3">
                {[1, 2, 3].map(i => {
                  const item = t(`part_info.level_${activeCircuit}.bio_focus_${i}`, { defaultValue: '' });
                  if (!item) return null;
                  return (
                    <li key={i} className={`flex items-start gap-3 ${isLight ? 'text-slate-700' : 'text-gray-200'}`}>
                      <span className={`mt-2 w-2 h-2 rounded-full flex-shrink-0 ${
                        activeCircuit === 2 ? 'bg-cyan-400' : activeCircuit === 3 ? 'bg-amber-400' : activeCircuit === 4 ? 'bg-teal-400' : activeCircuit === 5 ? 'bg-yellow-600' : activeCircuit === 6 ? 'bg-emerald-400' : activeCircuit === 7 ? 'bg-sky-400' : activeCircuit === 8 ? 'bg-indigo-400' : activeCircuit === 9 ? 'bg-yellow-400' : activeCircuit === 10 ? 'bg-orange-400' : activeCircuit === 11 ? 'bg-cyan-400' : activeCircuit === 12 ? 'bg-fuchsia-400' : 'bg-purple-400'
                      }`} />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Что это даёт? */}
          {t(`part_info.level_${activeCircuit}.result_title`, { defaultValue: '' }) && (
            <div className={`backdrop-blur-md rounded-2xl p-8 border shadow-2xl mb-6 ${
              isLight
              ? `bg-white/55 backdrop-blur-xl shadow-lg shadow-indigo-100/60 ${glowA.panelBorder}`
              : activeCircuit === 2
                ? 'bg-gradient-to-br from-teal-900/30 via-cyan-900/20 to-blue-900/30 border-cyan-500/30'
                : activeCircuit === 3
                ? 'bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-amber-900/30 border-amber-600/30'
                : activeCircuit === 4
                ? 'bg-gradient-to-br from-teal-900/30 via-cyan-900/20 to-teal-900/30 border-teal-500/30'
                : activeCircuit === 5
                ? 'bg-gradient-to-br from-yellow-800/40 via-yellow-700/30 to-yellow-800/40 border-amber-600/40'
                : activeCircuit === 6
                ? 'bg-gradient-to-br from-emerald-800/40 via-teal-700/30 to-emerald-800/40 border-emerald-500/40'
                : activeCircuit === 7
                ? 'bg-gradient-to-br from-sky-800/40 via-blue-700/30 to-sky-800/40 border-sky-500/40'
                : activeCircuit === 8
                ? 'bg-gradient-to-br from-indigo-800/40 via-violet-700/30 to-indigo-800/40 border-indigo-500/40'
                : activeCircuit === 9
                ? 'bg-gradient-to-br from-amber-800/40 via-yellow-600/30 to-amber-800/40 border-yellow-300/60 ring-1 ring-yellow-300/40 shadow-[0_0_30px_rgba(253,224,71,0.45)]'
                : activeCircuit === 10
                ? 'bg-gradient-to-br from-orange-800/40 via-amber-700/30 to-orange-800/40 border-orange-500/40'
                : activeCircuit === 11
                ? 'bg-gradient-to-br from-teal-800/40 via-cyan-700/30 to-teal-800/40 border-cyan-500/40'
                : activeCircuit === 12
                ? 'bg-gradient-to-br from-fuchsia-800/40 via-red-700/30 to-fuchsia-800/40 border-fuchsia-500/40'
                : 'bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/30 border-indigo-500/30'
            }`}>
              <h2 className={`text-xl font-bold mb-3 ${
                activeCircuit === 2 ? 'text-cyan-300' : activeCircuit === 3 ? 'text-amber-300' : activeCircuit === 4 ? 'text-teal-300' : activeCircuit === 5 ? 'text-yellow-200' : activeCircuit === 6 ? 'text-emerald-300' : activeCircuit === 7 ? 'text-sky-300' : activeCircuit === 8 ? 'text-indigo-300' : activeCircuit === 9 ? 'text-yellow-300' : activeCircuit === 10 ? 'text-orange-300' : activeCircuit === 11 ? 'text-cyan-300' : activeCircuit === 12 ? 'text-fuchsia-300' : 'text-pink-300'
              }`}>{t(`part_info.level_${activeCircuit}.result_title`)}</h2>
              <p className="text-gray-400 mb-4">{t(`part_info.level_${activeCircuit}.result_intro`)}</p>
              <ul className="space-y-3 mb-5">
                {[1, 2, 3].map(i => {
                  const item = t(`part_info.level_${activeCircuit}.result_${i}`, { defaultValue: '' });
                  if (!item) return null;
                  return (
                    <li key={i} className={`flex items-start gap-3 ${isLight ? 'text-slate-700' : 'text-gray-200'}`}>
                      <span className={`mt-2 w-2 h-2 rounded-full flex-shrink-0 ${
                        activeCircuit === 2 ? 'bg-cyan-400' : activeCircuit === 3 ? 'bg-amber-400' : activeCircuit === 4 ? 'bg-teal-400' : activeCircuit === 5 ? 'bg-yellow-600' : activeCircuit === 6 ? 'bg-emerald-400' : activeCircuit === 7 ? 'bg-sky-400' : activeCircuit === 8 ? 'bg-indigo-400' : activeCircuit === 9 ? 'bg-yellow-400' : activeCircuit === 10 ? 'bg-orange-400' : activeCircuit === 11 ? 'bg-cyan-400' : activeCircuit === 12 ? 'bg-fuchsia-400' : 'bg-purple-400'
                      }`} />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  );
                })}
              </ul>
              <p className={`leading-relaxed italic border-l-2 pl-4 ${
                isLight ? 'text-slate-600 border-violet-300' :
                activeCircuit === 2 ? 'text-cyan-200/80 border-cyan-500/40' : activeCircuit === 3 ? 'text-amber-200/80 border-amber-500/40' : activeCircuit === 4 ? 'text-teal-200/80 border-teal-500/40' : activeCircuit === 5 ? 'text-yellow-200/80 border-yellow-600/40' : activeCircuit === 6 ? 'text-emerald-200/80 border-emerald-500/40' : activeCircuit === 7 ? 'text-sky-200/80 border-sky-500/40' : activeCircuit === 8 ? 'text-indigo-200/80 border-indigo-500/40' : activeCircuit === 9 ? 'text-yellow-200/80 border-yellow-500/50' : activeCircuit === 10 ? 'text-orange-200/80 border-orange-500/40' : activeCircuit === 11 ? 'text-cyan-200/80 border-cyan-500/40' : activeCircuit === 12 ? 'text-fuchsia-200/80 border-fuchsia-500/40' : 'text-purple-200/80 border-purple-500/40'
              }`}>{t(`part_info.level_${activeCircuit}.result_outro`)}</p>

              {activeCircuit >= 1 && activeCircuit <= 12 && (() => {
                // Map circuit → YouTube video ID. iOS 26's WKWebView tightened
                // cross-origin iframe rules and YouTube's embed gate now
                // returns error 153 when the iframe is loaded from
                // capacitor://localhost — the scheme isn't on YouTube's
                // allow-list and no `?origin=` param can fix that. Older
                // iOS releases were lenient about this; that's why the
                // iframe approach worked in the 1.0.2 build.
                //
                // Workaround: render a clickable YouTube-style thumbnail
                // and open the real video in SFSafariViewController via
                // @capacitor/browser. Native player, full quality, picture-
                // in-picture, no embed gate. Apple endorses this pattern.
                const videoId =
                  activeCircuit >= 10 && activeCircuit <= 12 ? 'qsDhvNptrZA' :
                  activeCircuit >= 7  && activeCircuit <= 9  ? 'TtqoMQoS4WQ' :
                  activeCircuit >= 4  && activeCircuit <= 6  ? '3HCOCpWwC9Y' :
                  'fZjKE81nIJ0';
                const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
                // hqdefault is the most reliably-served public thumbnail.
                const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                return (
                  <button
                    type="button"
                    aria-label={t('part_info.watch_on_youtube', 'Watch on YouTube')}
                    className="mt-6 rounded-xl overflow-hidden block w-full text-left"
                    // Order matters: `padding: 0` is the user-agent button
                    // padding reset and MUST come before `paddingBottom`,
                    // otherwise the shorthand wipes out the 56.25% aspect-
                    // ratio padding and the button collapses to 0 height —
                    // which is what made the entire video block disappear
                    // in the previous attempt.
                    style={{ background: '#000', border: 'none', padding: 0, cursor: 'pointer', position: 'relative', paddingBottom: '56.25%', height: 0 }}
                    onClick={async () => {
                      try {
                        const { Browser } = await import('@capacitor/browser');
                        await Browser.open({ url: watchUrl });
                      } catch {
                        // Web fallback — desktop preview, etc.
                        window.open(watchUrl, '_blank', 'noopener');
                      }
                    }}
                  >
                    <img
                      src={thumb}
                      alt=""
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.75rem' }}
                    />
                    {/* Play-button overlay so the thumbnail reads as a video. */}
                    <div
                      style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.18)',
                        borderRadius: '0.75rem',
                      }}
                    >
                      <div
                        style={{
                          width: 68, height: 48,
                          background: 'rgba(0,0,0,0.7)',
                          borderRadius: 12,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </button>
                );
              })()}
            </div>
          )}

          {/* Кнопка возврата внизу */}
          <button
            onClick={() => {
              setActiveView('main');
              const rootEl = document.getElementById('root');
              if (rootEl) rootEl.scrollTop = 0;
              window.scrollTo(0, 0);
            }}
            className={`mx-auto py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center backdrop-blur-md mb-8 ${
              isLight
                ? `bg-white/60 ${glowA.panelBorder} border text-slate-600 hover:bg-white/80 shadow-lg shadow-indigo-100/60`
                : activeCircuit === 2
                ? 'bg-cyan-900/40 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-800/50'
                : activeCircuit === 3
                ? 'bg-amber-900/40 border border-amber-600/40 text-amber-300 hover:bg-amber-800/50'
                : activeCircuit === 4
                ? 'bg-teal-900/40 border border-teal-500/40 text-teal-300 hover:bg-teal-800/50'
                : activeCircuit === 5
                ? 'bg-yellow-700/40 border border-amber-600/40 text-amber-200 hover:bg-yellow-600/50'
                : activeCircuit === 6
                ? 'bg-emerald-800/40 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-700/50'
                : activeCircuit === 7
                ? 'bg-sky-800/40 border border-sky-500/40 text-sky-300 hover:bg-sky-700/50'
                : activeCircuit === 8
                ? 'bg-indigo-800/40 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-700/50'
                : activeCircuit === 9
                ? 'bg-amber-800/40 border border-yellow-300/70 text-yellow-100 hover:bg-amber-700/50 shadow-[0_0_18px_rgba(253,224,71,0.35)]'
                : activeCircuit === 10
                ? 'bg-orange-800/40 border border-orange-500/40 text-orange-300 hover:bg-orange-700/50'
                : activeCircuit === 11
                ? 'bg-teal-800/40 border border-cyan-500/40 text-cyan-200 hover:bg-teal-700/50'
                : activeCircuit === 12
                ? 'bg-fuchsia-800/40 border border-fuchsia-500/40 text-fuchsia-300 hover:bg-fuchsia-700/50'
                : 'bg-indigo-900/40 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-800/50'
            }`}
          >
            <span>{t('part_info.back_to_part', { part: activeCircuit }).replace(/←/g, '').trim()}</span>
          </button>

        </div>
      </div>
    );
  }

  const glow = CIRCUIT_GLOW_LIGHT[activeCircuit] ?? CIRCUIT_GLOW_DEFAULT;
  // Палитра кнопки эмоциональной сверки — translucent-тинт контура.
  const emoTint = activeCircuit === 2
    ? 'bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40'
    : activeCircuit === 3
    ? 'bg-amber-600/10 hover:bg-amber-600/20 border border-amber-500/40'
    : activeCircuit === 4
    ? 'bg-teal-500/10 hover:bg-teal-500/20 border border-teal-400/40'
    : activeCircuit === 5
    ? 'bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/40'
    : activeCircuit === 6
    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/40'
    : activeCircuit === 7
    ? 'bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/40'
    : activeCircuit === 8
    ? 'bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-400/40'
    : activeCircuit === 9
    ? 'bg-yellow-300/20 hover:bg-yellow-300/30 border-2 border-yellow-200/90 shadow-[0_0_28px_rgba(253,224,71,0.55)]'
    : activeCircuit === 10
    ? 'bg-orange-500/10 hover:bg-orange-500/20 border border-orange-400/40'
    : activeCircuit === 11
    ? 'bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40'
    : activeCircuit === 12
    ? 'bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border border-fuchsia-400/40'
    : 'bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-400/40';
  // Пастельный цвет «в тон контура» — для мелких акцентов в светлой теме.
  const partTint = activeCircuit === 2 ? 'text-cyan-300'
    : activeCircuit === 3 ? 'text-amber-300'
    : activeCircuit === 4 ? 'text-teal-300'
    : activeCircuit === 5 ? 'text-yellow-400'
    : activeCircuit === 6 ? 'text-emerald-300'
    : activeCircuit === 7 ? 'text-sky-300'
    : activeCircuit === 8 ? 'text-indigo-300'
    : activeCircuit === 9 ? 'text-yellow-400'
    : activeCircuit === 10 ? 'text-orange-300'
    : activeCircuit === 11 ? 'text-cyan-300'
    : activeCircuit === 12 ? 'text-fuchsia-300'
    : 'text-violet-300';
  // Читаемые акцентные тексты «в тон контура» для светлой темы:
  // partTextMid — средний тон, partTextStrong — насыщеннее (заголовки).
  const partTextMid = activeCircuit === 2 ? 'text-cyan-600'
    : activeCircuit === 3 ? 'text-amber-600'
    : activeCircuit === 4 ? 'text-teal-600'
    : activeCircuit === 5 ? 'text-yellow-600'
    : activeCircuit === 6 ? 'text-emerald-600'
    : activeCircuit === 7 ? 'text-sky-600'
    : activeCircuit === 8 ? 'text-indigo-600'
    : activeCircuit === 9 ? 'text-amber-600'
    : activeCircuit === 10 ? 'text-orange-600'
    : activeCircuit === 11 ? 'text-cyan-600'
    : activeCircuit === 12 ? 'text-fuchsia-600'
    : 'text-violet-600';
  const partTextStrong = activeCircuit === 2 ? 'text-cyan-700'
    : activeCircuit === 3 ? 'text-amber-700'
    : activeCircuit === 4 ? 'text-teal-700'
    : activeCircuit === 5 ? 'text-yellow-700'
    : activeCircuit === 6 ? 'text-emerald-700'
    : activeCircuit === 7 ? 'text-sky-700'
    : activeCircuit === 8 ? 'text-indigo-700'
    : activeCircuit === 9 ? 'text-amber-700'
    : activeCircuit === 10 ? 'text-orange-700'
    : activeCircuit === 11 ? 'text-cyan-700'
    : activeCircuit === 12 ? 'text-fuchsia-700'
    : 'text-indigo-800';

  // Practice card renderer — extracted so Section 2 (Today's Practice
  // hero) can show the same card markup that the Section 5 grid uses,
  // without duplicating 160+ lines of JSX. All closures (state setters,
  // theme tokens, t, etc.) are captured from the component scope.
  const renderPracticeCard = (practice: any, isFeatured: boolean = false) => {
    const sessions = getPracticeSessions(practice.id);
    const completedData = completedPractices[practice.id];
    // Лучшее качество из сессий или из completedData
    const bestQuality = sessions.length > 0
      ? Math.max(...sessions.map(s => s.quality || 0), completedData?.quality || 0)
      : (completedData?.quality || 0);
    // Практика считается начатой только если есть хотя бы одна сессия
    const isCompleted = sessions.length > 0 ? { ...completedData, quality: bestQuality } : null;
    const bonus = calculateBonus();
    const earnedQnt = Math.floor(practice.maxQnt * (1 + bonus / 100));
    const isExpanded = expandedPractice === practice.id;

    return (
      <div
        key={practice.id}
        ref={el => practiceRefs.current[practice.id] = el}
        className={`relative rounded-lg p-6 border transition-all flex flex-col ${
          isLight ? 'bg-white/55 backdrop-blur-xl shadow-lg shadow-indigo-100/60' : 'bg-black/40 backdrop-blur-sm'
        } ${
          isCompleted
            ? isLight ? 'border-emerald-300 bg-emerald-50/70' : 'border-emerald-500/50 bg-emerald-500/10'
            : isLight
            ? glow.panelBorder
            : activeCircuit === 2
            ? 'border-cyan-500/30 hover:border-cyan-400/50'
            : activeCircuit === 3
            ? 'border-gray-500/30 hover:border-gray-400/50'
            : activeCircuit === 4
            ? 'border-teal-500/30 hover:border-teal-400/50'
            : activeCircuit === 5
            ? 'border-amber-600/40 hover:border-amber-500/60'
            : activeCircuit === 6
            ? 'border-emerald-500/40 hover:border-emerald-400/60'
            : activeCircuit === 7
            ? 'border-sky-500/40 hover:border-sky-400/60'
            : activeCircuit === 8
            ? 'border-indigo-500/40 hover:border-indigo-400/60'
            : activeCircuit === 9
            ? 'border-yellow-500/50 hover:border-yellow-400/70'
            : activeCircuit === 10
            ? 'border-orange-500/40 hover:border-orange-400/60'
            : activeCircuit === 11
            ? 'border-cyan-500/40 hover:border-cyan-400/60'
            : activeCircuit === 12
            ? 'border-fuchsia-500/40 hover:border-fuchsia-400/60'
            : 'border-purple-500/30 hover:border-purple-400/50'
        } ${isFeatured ? 'ring-2 ring-indigo-400/70 shadow-[0_0_24px_rgba(99,102,241,0.25)]' : ''}`}
      >
        {isFeatured && (
          <span
            className="absolute -top-2 left-3 px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] leading-none font-semibold uppercase tracking-wide shadow"
            data-testid="featured-badge"
          >
            ✨ {t('home.featured.recommended', 'Recommended')}
          </span>
        )}
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
            <Circle className={`w-6 h-6 ${isLight ? partTint : 'text-gray-600'}`} />
          )}
        </div>
        {(() => {
          // Subtitle priority: if we have functional copy for this
          // practice, it stands alone (title already carries the
          // semi-poetic vibe; doubling it with the poetic desc was
          // redundant). For practices that don't yet have functional
          // copy (Parts 2–6 during rollout) we fall back to the poetic
          // desc so the card still has a subtitle line.
          const fnKey = `practice_items.${getPracticeKey(practice.id)}_functional`;
          const fn = t(fnKey, { defaultValue: '' });
          const subtitle = fn || getPracticeDesc(practice.id);
          return (
            <p
              className={`text-sm mb-4 ${isLight ? 'text-slate-500' : 'text-gray-300'}`}
              data-testid={`practice-subtitle-${practice.id}`}
            >
              {subtitle}
            </p>
          );
        })()}

        {sessions.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setExpandedPractice(isExpanded ? null : practice.id)}
              className={`text-xs flex items-center gap-1 transition-all ${
                activeCircuit === 2
                  ? 'text-cyan-300 hover:text-cyan-200'
                  : activeCircuit === 3
                  ? 'text-amber-200 hover:text-amber-100'
                  : activeCircuit === 4
                  ? 'text-teal-300 hover:text-teal-200'
                  : activeCircuit === 5
                  ? 'text-amber-200 hover:text-amber-100'
                  : activeCircuit === 6
                  ? 'text-emerald-300 hover:text-emerald-200'
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
                    className={`rounded p-3 border text-xs transition-all duration-1000 ${
                      isLight ? 'bg-slate-100/80' : 'bg-black/30'
                    } ${
                      isLight
                      ? 'border-slate-200'
                      : activeCircuit === 2
                        ? 'border-cyan-500/20'
                        : activeCircuit === 3
                        ? 'border-amber-600/20'
                        : activeCircuit === 4
                        ? 'border-teal-500/20'
                        : activeCircuit === 5
                        ? 'border-amber-500/20'
                        : activeCircuit === 6
                        ? 'border-emerald-500/20'
                        : 'border-purple-500/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-gray-400">{formatDate(session.date)}</span>
                      {session.isNewRecord && (
                        <span className="text-amber-400">🏆</span>
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
                        <p className="text-amber-400">+{session.qnt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="text-amber-400 font-mono">
            <div>{t('practices.up_to')} {earnedQnt} OND</div>
            {bonus > 0 && (
              <div className="text-xs text-emerald-400">
                (+{bonus}%)
              </div>
            )}
          </div>
          <button
            onClick={() => {
              markFreePracticeTapped(practice.id);
              completePractice(practice.id, practice.maxQnt);
            }}
            className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all backdrop-blur-sm ${emoTint}`}
          >
            {isCompleted ? t('practices.improve') : t('practices.start')}
            {FREE_PRACTICE_IDS.has(practice.id) && !tappedFreePractices.has(practice.id) && (
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] leading-none font-semibold uppercase tracking-wide shadow">
                {t('labels.free')}
              </span>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      data-main-container
      className={`h-full overflow-x-hidden pb-6 pt-8 transition-all duration-1000 ${isLight ? 'text-slate-800' : 'text-white'} ${
      isLight
        ? ''
        : activeCircuit === 2
        ? 'bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900'
        : activeCircuit === 3
        ? 'bg-gradient-to-br from-amber-950 via-orange-900 to-amber-950'
        : activeCircuit === 4
        ? 'bg-gradient-to-br from-teal-950 via-cyan-900 to-teal-950'
        : activeCircuit === 5
        ? 'bg-gradient-to-br from-yellow-900 via-yellow-800 to-yellow-900'
        : activeCircuit === 6
        ? 'bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-950'
        : activeCircuit === 7
        ? 'bg-gradient-to-br from-sky-950 via-blue-900 to-sky-950'
        : activeCircuit === 8
        ? 'bg-gradient-to-br from-indigo-950 via-violet-900 to-indigo-950'
        : activeCircuit === 9
        ? 'bg-gradient-to-br from-amber-800 via-yellow-600 to-amber-800 shadow-[inset_0_0_180px_rgba(253,224,71,0.7)]'
        : activeCircuit === 10
        ? 'bg-gradient-to-br from-orange-950 via-amber-900 to-orange-950'
        : activeCircuit === 11
        ? 'bg-gradient-to-br from-teal-900 via-cyan-800 to-teal-900'
        : activeCircuit === 12
        ? 'bg-gradient-to-br from-fuchsia-950 via-red-900 to-fuchsia-950'
        : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
    }`}
      style={isLight ? {
        background: `radial-gradient(900px circle at 12% 18%, ${glow.orbA}, transparent 60%), radial-gradient(820px circle at 88% 82%, ${glow.orbB}, transparent 58%), linear-gradient(135deg, #eef2ff 0%, #ffffff 52%, #f5f3ff 100%)`,
      } : undefined}
    >
      {/* Debug Monitor - ПЕРВЫМ для захвата всех логов */}
      <DebugMonitor
        buildNumber={import.meta.env.VITE_BUILD_NUMBER}
        commitHash={import.meta.env.VITE_COMMIT_HASH}
        branchName={import.meta.env.VITE_BRANCH_NAME}
      />

      {/* DEBUG: Visible Debug Banner — скрыт, включить через localStorage.debugMode='true' */}
      {localStorage.getItem('debugMode') === 'true' && (
        <div className="fixed top-0 left-0 right-0 z-[200] bg-black/90 text-white text-xs px-3 py-2 text-center font-mono">
          🔧 DEBUG: {debugInfo}
          <button
            onClick={() => { Sentry.captureException(new Error('My first Sentry error!')); alert('Sentry error sent!'); }}
            className="ml-3 px-2 py-0.5 bg-red-600 rounded text-white text-xs font-bold"
          >
            Test Sentry
          </button>
        </div>
      )}

      {/* Sticky burger button — only the circle. ONDA / LIFE labels live
          in the document flow at the top of the home content (below) so
          they scroll away with the page; the burger stays anchored. */}
      {!showJournalModal && !showStatsModal && !showRatingModal && !showAuthModal &&
       !showProfileModal && !showSettingsModal && !showConnectionModal && !showLanguageModal &&
       !showQntShop && !showVoiceCheck && !showFaceCheck && !showInfoModal && (
        <button
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className={`menu-container fixed left-1/2 -translate-x-1/2 z-[100] w-14 h-14 sm:w-16 sm:h-16 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${isLight ? 'text-slate-700' : 'text-white'} ${emoTint}`}
          style={{
            top: 'max(env(safe-area-inset-top, 0px) + 0.75rem, 3rem)',
            boxShadow: isLight ? '0 10px 28px rgba(99,102,241,0.18)' : '0 10px 36px rgba(0,0,0,0.45)',
          }}
          data-testid="button-menu"
          aria-label={showMenu ? 'Close menu' : 'Open menu'}
        >
          {showMenu ? (
            <X className="w-6 h-6" />
          ) : (
            /* One bold sine wave, indigo→violet gradient. Hand-rolled
               SVG so we control amplitude (Lucide's Waves is ~3 stacked
               low-amplitude curves and reads timid in a 56–64 px well). */
            <svg
              viewBox="0 0 32 32"
              width="32"
              height="32"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="onda-wave-grad" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="50%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
              </defs>
              <path
                d="M 3 16 C 8 10, 12 10, 16 16 S 24 22, 29 16"
                stroke="url(#onda-wave-grad)"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      )}

      {/* Paywall $ button removed in home redesign 1.7.4 (dead code: was
          already gated behind {false && ...}). Paywall now triggers only
          from (a) tapping a locked practice, (b) after 3 free practices,
          (c) Settings → Premium. */}

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
                  'text-white/80 hover:text-white bg-black/30 hover:bg-black/50'
                }`}
              >
                <User className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                <span className="hidden sm:inline">{userProfile?.display_name || t('auth.profile')}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className={`text-xs sm:text-sm transition-all px-2 sm:px-4 py-1.5 sm:py-2 rounded-full ${
                  'text-white/80 hover:text-white bg-black/30 hover:bg-black/50'
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
                'text-white/80 hover:text-white bg-black/30 hover:bg-black/50'
              }`}
              title="Click to open OND Shop"
            >
              {safeToFixed(qnt, 1)} OND
            </button>
            <button
              onClick={() => setShowRatingModal(true)}
              className={`text-xs sm:text-sm transition-all px-2 sm:px-4 py-1.5 sm:py-2 rounded-full ${
                'text-white/80 hover:text-white bg-black/30 hover:bg-black/50'
              }`}
            >
              {t('nav.rating')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 pb-4 sm:pb-8 pt-[28px]">
        {/* ──────────────────────────────────────────────────────────── *
         * Home redesign 1.7.4 — top of flow.                              *
         * Sections 1 (Biometric Hero), 2 (Today's Practice), 2.5 (Part   *
         * Progress) and 4 (Your Progress) are surfaced here so the first *
         * fold is product, not poem. The lore blocks below are moved     *
         * inside <JourneyAccordion> in a separate follow-up commit.      *
         * ──────────────────────────────────────────────────────────── */}

        {/* Brand header — ONDA · [burger spacer] · LIFE. The burger
            button itself is `position:fixed` (above), so this row holds
            an invisible spacer the same width as the button. Each label
            sits in a fixed-width column (text-right on the left side,
            text-left on the right side) so optical spacing is equal —
            ONDA's chars are visually wider than LIFE's, so a plain
            `gap-3` flexbox made the right side look further away. */}
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <span
            className={`text-base sm:text-lg font-light tracking-wider w-20 text-right pr-4 ${isLight ? 'text-slate-500' : 'text-white/80'}`}
            aria-hidden="true"
          >
            ONDA
          </span>
          <span
            className="inline-block w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0"
            aria-hidden="true"
          />
          <span
            className={`text-base sm:text-lg font-light tracking-wider w-20 text-left pl-4 ${isLight ? 'text-slate-500' : 'text-white/80'}`}
            style={{
              display: 'inline-block',
              transform: 'scaleX(1.2)',
              transformOrigin: 'left center',
            }}
            aria-hidden="true"
          >
            LIFE
          </span>
        </div>

        {/* Section 1 — Biometric block. Honest + calm: two tiles
            (Pulse — measured · Breathing — an RSA estimate) → Coherence
            hero (heart–breath rhythm, the live training signal). The old
            Stress/Energy tiles were removed: they were ONE pulse-formula
            shown twice (stress + energy ≈ 100), and a resting "Stress %"
            verdict is exactly the anxiety score this audience came to ONDA
            to escape. One calm HR-RSA curve now lives inside the coherence
            hero; the busy 3-line dashboard is gone. */}
        <div className="mb-6">
          {/* Pulse | Breathing — ALWAYS shown. Each tile hides only its value
              line when the metric is null (no tracker yet), collapsing to
              icon + label so the row reads as "setup pending", not missing. */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Pulse — measured (Watch or camera). Fixed 2-line layout: icon,
                then value + unit on ONE line, the big number ALWAYS rendered
                (-- when absent) so the tile never grows a third line / jumps in
                height when a pulse first appears. Taller value line on purpose —
                the number is bigger than the unit. No source ("Watch") label. */}
            <div className={`${emoTint} backdrop-blur-sm rounded-2xl p-3 sm:p-4 text-center`}>
              <Heart className={`w-5 sm:w-6 h-5 sm:h-6 mb-2 mx-auto ${displayHeartRate != null ? 'text-green-400' : 'text-red-400'}`} />
              <div className="flex items-baseline justify-center gap-1 leading-none">
                <span className={`text-2xl sm:text-3xl font-bold tabular-nums ${displayHeartRate == null ? (isLight ? 'text-slate-300' : 'text-white/40') : (isLight ? 'text-slate-400' : '')}`}>
                  {displayHeartRate != null ? displayHeartRate : '--'}
                </span>
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{t('settings.bpm', 'BPM')}</span>
              </div>
            </div>
            {/* Breathing — RSA-derived ESTIMATE (leading ≈ so it never reads as a
                precise, independent measurement). Same fixed 2-line layout. */}
            <div className={`${emoTint} backdrop-blur-sm rounded-2xl p-3 sm:p-4 text-center`}>
              <Wind className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400 mb-2 mx-auto" />
              <div className="flex items-baseline justify-center gap-1 leading-none">
                <span className={`text-2xl sm:text-3xl font-bold tabular-nums ${vitalsData.br == null ? (isLight ? 'text-slate-300' : 'text-white/40') : (isLight ? 'text-slate-400' : '')}`}>
                  {vitalsData.br != null ? (<><span className="text-base font-normal opacity-60 mr-0.5">≈</span>{Math.round(vitalsData.br)}</>) : '--'}
                </span>
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{t('settings.br_unit', '/min')}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 sm:mt-4">
            {cameraPpg.status !== 'idle' ? (
              /* CAMERA ACTIVE → one STABLE-height Pulse window (bpm or --) the
                 whole time, so a brief finger-lift / reconnect doesn't make the
                 panel jump. Always shows the wave + a status line + a Stop button. */
              <div className={`rounded-2xl p-4 sm:p-5 ${
                isLight
                  ? `bg-white/55 backdrop-blur-xl shadow-lg shadow-indigo-100/60 ${glow.panelBorder}`
                  : 'bg-black/20 backdrop-blur-sm border border-white/10'
              }`}>
                <div className="flex items-baseline justify-between">
                  <div className="text-left">
                    <div className={`text-sm font-semibold ${isLight ? 'text-slate-600' : 'text-white/90'}`}>{t('labels.pulse')}</div>
                    <div className={`text-xs ${isLight ? 'text-slate-400' : 'text-white/50'}`}>{t('camera.source_label', 'Camera · quick')}</div>
                  </div>
                  <div className={`font-bold leading-none ${isLight ? 'text-slate-500' : 'text-white'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {displayHeartRate != null ? (
                      <span className="text-3xl sm:text-4xl">{displayHeartRate}<span className="text-base sm:text-lg font-semibold"> bpm</span></span>
                    ) : (
                      <span className={`text-2xl sm:text-3xl ${isLight ? 'text-slate-300' : 'text-white/40'}`}>--</span>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <MetricsWaveform heartRate={displayHeartRate} stress={null} energy={null} hrOnly smoothHr pulseTone heightPx={120} />
                </div>
                <div className="mt-2 flex items-center justify-center gap-2 text-xs">
                  <span className={`w-2 h-2 rounded-full ${cameraPpg.status === 'reading' ? 'bg-emerald-400 animate-pulse' : cameraPpg.fingerOn ? 'bg-amber-400 animate-pulse' : isLight ? 'bg-slate-300' : 'bg-white/40'}`} />
                  <span className={isLight ? 'text-slate-600' : 'text-white/85'}>
                    {cameraPpg.status === 'reading'
                      ? t('camera.live', 'Live — your pulse is responding')
                      : cameraPpg.status === 'requesting'
                        ? t('camera.opening', 'Opening camera…')
                        : cameraPpg.status === 'denied' || cameraPpg.status === 'error'
                          ? t('camera.denied', 'Camera unavailable — continuing without it.')
                          : cameraPpg.fingerOn
                            ? t('camera.reading', 'Got your finger — hold still, reading your pulse…')
                            : t('camera.place_finger', 'Rest a fingertip on the rear camera')}
                  </span>
                </div>
                {!cameraPpg.torchOn && (cameraPpg.status === 'searching' || cameraPpg.status === 'reading') && (
                  <p className={`mt-1 text-[11px] text-center ${isLight ? 'text-amber-600' : 'text-amber-300/80'}`}>{t('camera.no_torch', "Couldn't turn on the flash — try in good light.")}</p>
                )}
                <div className="mt-2 flex items-center justify-center gap-3">
                  <span className={`text-[11px] ${isLight ? 'text-slate-400' : 'text-white/45'}`}>{t('camera.coherence_locked', 'Coherence unlocks with an Apple Watch.')}</span>
                  <button
                    type="button"
                    onClick={() => cameraPpg.stop()}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${emoTint}`}
                    data-testid="camera-stop"
                  >
                    {t('camera.stop', 'Stop')}
                  </button>
                </div>
              </div>
            ) : displayHeartRate != null ? (
              /* WATCH → Coherence hero (heart–breath synchrony; never medical). */
              <div className={`rounded-2xl p-4 sm:p-5 ${
                isLight
                  ? `bg-white/55 backdrop-blur-xl shadow-lg shadow-indigo-100/60 ${glow.panelBorder}`
                  : 'bg-black/20 backdrop-blur-sm border border-white/10'
              }`}>
                <div className="flex items-baseline justify-between">
                  <div className="text-left">
                    <div className={`text-sm font-semibold ${isLight ? 'text-slate-600' : 'text-white/90'}`}>{t('practices.coherence')}</div>
                    <div className={`text-xs ${isLight ? 'text-slate-400' : 'text-white/50'}`}>{t('home.coherence.caption', 'heart–breath rhythm')}</div>
                  </div>
                  <div className={`font-bold leading-none ${isLight ? 'text-slate-500' : 'text-white'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {vitalsData.coherence != null ? (
                      <span className="text-3xl sm:text-4xl">{vitalsData.coherence}<span className="text-lg sm:text-xl font-semibold">%</span></span>
                    ) : (
                      <span className={`text-2xl sm:text-3xl ${isLight ? 'text-slate-300' : 'text-white/40'}`}>--</span>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <MetricsWaveform heartRate={displayHeartRate} stress={null} energy={null} hrOnly heightPx={120} />
                </div>
              </div>
            ) : (
              <div
                className={`rounded-2xl p-4 sm:p-5 text-center ${
                  isLight
                    ? `bg-white/55 backdrop-blur-xl shadow-lg shadow-indigo-100/60 ${glow.panelBorder}`
                    : 'bg-black/20 backdrop-blur-sm border border-white/10'
                }`}
                data-testid="biometric-connect-cta"
              >
                <p className={`text-xs sm:text-sm mb-3 ${isLight ? 'text-slate-600' : 'text-white/75'}`}>
                  {t('home.biometric.connect_body', 'Connect and see your heart rhythm in real time during breathing practices.')}
                </p>
                <div className="flex gap-2 sm:gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => setShowPermissionModal(true)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${emoTint}`}
                    data-testid="biometric-connect-watch"
                  >
                    <Watch className="w-4 h-4" />
                    {t('home.biometric.connect_watch', 'Apple Watch')}
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraPpg.start()}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${emoTint}`}
                    data-testid="biometric-connect-camera"
                  >
                    <Camera className="w-4 h-4" />
                    {t('home.biometric.connect_camera', 'Camera')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Practices list — single block. The featured (recommended)
            practice is hoisted to the first position and rendered with
            an indigo accent ring + ✨ Recommended badge so it reads as
            "start here" without duplicating the card above (Option 3
            from the UX review). The Connect-Watch CTA already lives at
            the top of the biometric block — no inline hint here. */}
        <div className="grid md:grid-cols-2 gap-4 mb-8" data-onda-practices-grid>
          {[
            ...currentCircuit.practices.filter(p => p.id === featuredPracticeId),
            ...currentCircuit.practices.filter(p => p.id !== featuredPracticeId),
          ].map((practice, idx) => renderPracticeCard(practice, idx === 0))}
        </div>

        {/* Section 2.5 — Part Progress bar. Hidden while the user has
            not started this level (0/12 with an empty bar reads as
            "nothing here" and crowds the first viewport for free). */}
        {completedCount > 0 && (
        <div className="mb-8">
          <div className={`rounded-2xl p-4 border transition-all duration-1000 ${
            isLight
              ? `bg-white/55 backdrop-blur-xl shadow-lg shadow-indigo-100/60 ${glow.panelBorder}`
              : `bg-black/20 backdrop-blur-sm ${
            activeCircuit === 2
              ? 'border-cyan-500/30'
              : activeCircuit === 3
              ? 'border-amber-600/30'
              : activeCircuit === 4
              ? 'border-teal-500/30'
              : activeCircuit === 5
              ? 'border-amber-600/40'
              : activeCircuit === 6
              ? 'border-emerald-500/40'
              : activeCircuit === 7
              ? 'border-sky-500/40'
              : activeCircuit === 8
              ? 'border-indigo-500/40'
              : activeCircuit === 9
              ? 'border-yellow-500/50'
              : activeCircuit === 10
              ? 'border-orange-500/40'
              : activeCircuit === 11
              ? 'border-cyan-500/40'
              : activeCircuit === 12
              ? 'border-fuchsia-500/40'
              : 'border-purple-500/30'
          }`
          }`}>
            <div className="flex justify-between mb-2 text-sm">
              <span>{t('progress.level_progress')}</span>
              <span>{completedCount}/{totalPractices} {t('progress.practices')}</span>
            </div>
            <div className={`w-full h-3 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-black/50'}`}>
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        )}

        {/* Section 4 — Your Progress (lifetime: 7-day HRV + streak + total).
            Placed ABOVE Quick Mood Scan: the real recovery metric (HRV trend)
            is the stronger above-the-fold signal for the biohacker audience,
            so it leads; the Voice/Face Check actions follow. */}
        <div className="mb-8">
          {/* Light highlight — a soft indigo ring + gentle halo lifts the
              Your Progress (HRV) card above the surrounding blocks without
              shouting. */}
          <div className={`rounded-2xl p-4 border ring-1 ${isLight ? `bg-white/65 backdrop-blur-xl ring-indigo-300/70 shadow-[0_4px_24px_rgba(99,102,241,0.18)] ${glow.panelBorder}` : 'bg-indigo-500/10 backdrop-blur-sm border-indigo-400/25 ring-indigo-400/30 shadow-[0_0_24px_rgba(99,102,241,0.20)]'}`}>
            <div className="text-sm font-medium mb-3" style={{ opacity: 0.75 }}>
              {t('home.progress.title')}
            </div>
            <HRVMiniChart
              samples={hrv7Day.samples}
              hasEnoughData={hrv7Day.hasEnoughData}
            />
            <div className="mt-3 text-sm" style={{ opacity: 0.85 }}>
              {practicesProgress.total === 0
                ? t('home.progress.streak_empty')
                : (
                  <span>
                    🔥 {t('home.progress.streak_label', { count: practicesProgress.streak })}
                    {' · '}
                    {t('home.progress.total_label', { count: practicesProgress.total })}
                  </span>
                )}
            </div>
          </div>
        </div>

        {/* Section 3 — Quick Mood Scan (Voice Check + Face Check) */}
        <div className="mb-8 w-full max-w-lg mx-auto px-4">
          <div className="text-sm font-medium mb-3 text-center" style={{ opacity: 0.75 }}>
            {t('home.quick_mood.title')}
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => {
                setShowVoiceCheck(true);
                if (!voiceCheckUsed) {
                  setVoiceCheckUsed(true);
                  localStorage.setItem('onda_emotional_check_used', 'true');
                }
              }}
              className={`relative backdrop-blur-sm text-xl sm:text-2xl font-light px-4 sm:px-6 py-3 sm:py-4 rounded-full transition-all w-full ${emoTint}`}
              data-testid="quick-mood-voice-check"
            >
              {t('nav.voice_check')}
              {!voiceCheckUsed && (
                <span className="absolute -top-2 right-8 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] leading-none font-semibold uppercase tracking-wide shadow">
                  {t('labels.free')}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setShowFaceCheck(true);
                if (!faceCheckUsed) {
                  setFaceCheckUsed(true);
                  localStorage.setItem('onda_nervous_scan_used', 'true');
                }
              }}
              className={`relative backdrop-blur-sm text-xl sm:text-2xl font-light px-4 sm:px-6 py-3 sm:py-4 rounded-full transition-all w-full ${emoTint}`}
              data-testid="quick-mood-face-check"
            >
              {t('face_check.nav_button')}
              {!faceCheckUsed && (
                <span className="absolute -top-2 right-8 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] leading-none font-semibold uppercase tracking-wide shadow">
                  {t('labels.free')}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* End of home redesign top-of-flow block. The "Your Journey"
            toggle (moved below the practices grid per 1.7.4 spec rev 2)
            opens the lore blocks below. The non-lore blocks in between
            (Permission banner, Connection panel, Watch prompt) stay
            visible regardless of journey state. */}

        {/* Центральный заголовок (logo + chapter+level chips + quote)
            relocated to the Your Journey section below the practices
            grid. See `journeyBlock1` insertion just after the toggle. */}
        {false && (
        <div className="text-center mb-6 sm:mb-12 pt-0">
          {/* Логотип по центру */}
          <div className={`flex items-center justify-center gap-2 mb-8 sm:mb-10 ${isLight ? 'text-slate-400' : 'text-white/80'}`}>
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
                    emoTint
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <span className="flex-1 text-right pr-3 sm:pr-4">{t('chapter')} {selectedChapter}</span>
                    <span className={isLight ? 'text-slate-400' : 'text-white/30'}>|</span>
                    <span className="flex-1 text-left pl-3 sm:pl-4">{t(`chapters.chapter_${selectedChapter}`)}</span>
                  </div>
                </button>
                {showChapterDropdown && (
                  <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 backdrop-blur-md rounded-2xl border z-50 overflow-hidden w-full ${
                    activeCircuit === 2
                      ? 'bg-cyan-500/20 border-cyan-400/50'
                      : activeCircuit === 3
                      ? 'bg-amber-600/20 border-amber-500/50'
                      : activeCircuit === 4
                      ? 'bg-teal-500/20 border-teal-400/50'
                      : activeCircuit === 5
                      ? 'bg-yellow-700/30 border-yellow-600/60'
                      : activeCircuit === 6
                      ? 'bg-emerald-500/30 border-emerald-400/60'
                      : activeCircuit === 7
                      ? 'bg-sky-500/30 border-sky-400/60'
                      : activeCircuit === 8
                      ? 'bg-indigo-500/30 border-indigo-400/60'
                      : activeCircuit === 9
                      ? 'bg-yellow-500/30 border-yellow-400/60'
                      : activeCircuit === 10
                      ? 'bg-orange-500/30 border-amber-400/60'
                      : activeCircuit === 11
                      ? 'bg-cyan-500/30 border-cyan-400/60'
                      : activeCircuit === 12
                      ? 'bg-fuchsia-500/30 border-red-400/60'
                      : 'bg-indigo-500/20 border-indigo-400/50'
                  }`}>
                    {Array.from({length: 4}, (_, i) => i + 1).map(chapter => {
                      // При выборе Chapter → переключаем на первую часть этого уровня
                      const firstLevelOfChapter = (chapter - 1) * 3 + 1;
                      const isAvailable = isPartUnlocked(firstLevelOfChapter);
                      return (
                        <button
                          key={chapter}
                          onClick={() => { 
                            if (isAvailable) { 
                              setSelectedChapter(chapter); 
                              setSelectedLevel(firstLevelOfChapter);
                              setActiveCircuit(firstLevelOfChapter);
                              setShowChapterDropdown(false); 
                            } 
                          }}
                          className={`block w-full px-4 py-3 transition-all text-lg ${
                            // Light theme: hard-coded white text was unreadable on the
                            // pale dropdown surface — use slate ramp for locked /
                            // available / selected. Dark theme keeps the existing
                            // per-circuit accent ladder unchanged.
                            isLight
                              ? !isAvailable
                                ? 'text-slate-400 cursor-not-allowed'
                                : selectedChapter === chapter
                                  ? 'bg-indigo-500/25 text-slate-900 font-medium'
                                  : 'text-slate-700 hover:bg-indigo-500/10'
                              : !isAvailable
                              ? 'text-white/40 cursor-not-allowed'
                              : activeCircuit === 2
                              ? selectedChapter === chapter ? 'bg-cyan-500/40 text-white' : 'hover:bg-cyan-500/30'
                              : activeCircuit === 3
                              ? selectedChapter === chapter ? 'bg-amber-600/40 text-white' : 'hover:bg-amber-600/30'
                              : activeCircuit === 4
                              ? selectedChapter === chapter ? 'bg-teal-500/40 text-white' : 'hover:bg-teal-500/30'
                              : activeCircuit === 5
                              ? selectedChapter === chapter ? 'bg-yellow-600/50 text-white' : 'hover:bg-yellow-600/40'
                              : activeCircuit === 6
                              ? selectedChapter === chapter ? 'bg-emerald-500/50 text-white' : 'hover:bg-emerald-500/40'
                              : activeCircuit === 7
                              ? selectedChapter === chapter ? 'bg-sky-500/50 text-white' : 'hover:bg-sky-500/40'
                              : activeCircuit === 8
                              ? selectedChapter === chapter ? 'bg-indigo-500/50 text-white' : 'hover:bg-indigo-500/40'
                              : activeCircuit === 9
                              ? selectedChapter === chapter ? 'bg-yellow-500/50 text-white' : 'hover:bg-yellow-500/40'
                              : activeCircuit === 10
                              ? selectedChapter === chapter ? 'bg-orange-500/50 text-white' : 'hover:bg-orange-500/40'
                              : activeCircuit === 11
                              ? selectedChapter === chapter ? 'bg-cyan-500/50 text-white' : 'hover:bg-cyan-500/40'
                              : activeCircuit === 12
                              ? selectedChapter === chapter ? 'bg-fuchsia-500/50 text-white' : 'hover:bg-fuchsia-500/40'
                              : selectedChapter === chapter ? 'bg-indigo-500/40 text-white' : 'hover:bg-indigo-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <span className="flex-1 text-right pr-3 sm:pr-4">{t('chapter')} {chapter}</span>
                            <span className={isLight ? 'text-slate-400' : 'text-white/30'}>|</span>
                            <span className="flex-1 text-left pl-3 sm:pl-4">
                              {t(`chapters.chapter_${chapter}`)}
                            </span>
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
                  className={`backdrop-blur-sm font-light px-4 sm:px-6 py-3 sm:py-4 rounded-full transition-all border w-full ${
                    emoTint
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <span className="flex-1 text-right pr-3 sm:pr-4 text-xl sm:text-2xl">{t('level')} {selectedLevel}</span>
                    <span className={`text-xl sm:text-2xl ${isLight ? 'text-slate-400' : 'text-white/30'}`}>|</span>
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
                      ? 'bg-teal-500/20 border-teal-400/50'
                      : activeCircuit === 5
                      ? 'bg-yellow-700/30 border-yellow-600/60'
                      : activeCircuit === 6
                      ? 'bg-emerald-500/30 border-emerald-400/60'
                      : activeCircuit === 7
                      ? 'bg-sky-500/30 border-sky-400/60'
                      : activeCircuit === 8
                      ? 'bg-indigo-500/30 border-indigo-400/60'
                      : activeCircuit === 9
                      ? 'bg-yellow-500/30 border-yellow-400/60'
                      : activeCircuit === 10
                      ? 'bg-orange-500/30 border-amber-400/60'
                      : activeCircuit === 11
                      ? 'bg-cyan-500/30 border-cyan-400/60'
                      : activeCircuit === 12
                      ? 'bg-fuchsia-500/30 border-red-400/60'
                      : 'bg-indigo-500/20 border-indigo-400/50'
                  }`}>
                    {Array.from({length: 12}, (_, i) => i + 1).map(level => {
                      const isAvailable = isPartUnlocked(level);
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
                            // Light theme: hard-coded white text was unreadable on the
                            // pale dropdown surface — use slate ramp for locked /
                            // available / selected. Dark theme keeps the existing
                            // per-circuit accent ladder unchanged.
                            isLight
                              ? !isAvailable
                                ? 'text-slate-400 cursor-not-allowed'
                                : level === selectedLevel
                                  ? 'bg-indigo-500/25 text-slate-900 font-medium'
                                  : 'text-slate-700 hover:bg-indigo-500/10'
                              : !isAvailable
                              ? 'text-white/40 cursor-not-allowed'
                              : activeCircuit === 2
                              ? level === selectedLevel ? 'bg-cyan-500/40 text-white' : 'hover:bg-cyan-500/30'
                              : activeCircuit === 3
                              ? level === selectedLevel ? 'bg-amber-600/40 text-white' : 'hover:bg-amber-600/30'
                              : activeCircuit === 4
                              ? level === selectedLevel ? 'bg-teal-500/40 text-white' : 'hover:bg-teal-500/30'
                              : activeCircuit === 5
                              ? level === selectedLevel ? 'bg-yellow-600/50 text-white' : 'hover:bg-yellow-600/40'
                              : activeCircuit === 6
                              ? level === selectedLevel ? 'bg-emerald-500/50 text-white' : 'hover:bg-emerald-500/40'
                              : activeCircuit === 7
                              ? level === selectedLevel ? 'bg-sky-500/50 text-white' : 'hover:bg-sky-500/40'
                              : activeCircuit === 8
                              ? level === selectedLevel ? 'bg-indigo-500/50 text-white' : 'hover:bg-indigo-500/40'
                              : activeCircuit === 9
                              ? level === selectedLevel ? 'bg-yellow-500/50 text-white' : 'hover:bg-yellow-500/40'
                              : activeCircuit === 10
                              ? level === selectedLevel ? 'bg-orange-500/50 text-white' : 'hover:bg-orange-500/40'
                              : activeCircuit === 11
                              ? level === selectedLevel ? 'bg-cyan-500/50 text-white' : 'hover:bg-cyan-500/40'
                              : activeCircuit === 12
                              ? level === selectedLevel ? 'bg-fuchsia-500/50 text-white' : 'hover:bg-fuchsia-500/40'
                              : level === selectedLevel ? 'bg-indigo-500/40 text-white' : 'hover:bg-indigo-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <span className="flex-1 text-right pr-3 sm:pr-4">{t('level')} {level}</span>
                            <span className={isLight ? 'text-slate-400' : 'text-white/30'}>|</span>
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
            <div className={`text-base sm:text-xl italic max-w-md text-center px-4 sm:px-0 ${isLight ? 'text-slate-500' : 'text-white/80'}`} dangerouslySetInnerHTML={{__html: `«${t(`quote_level_${activeCircuit}`)}»`}}>
            </div>
          </div>
        </div>
        )}

        {/* Quick Mood Scan buttons moved up into Section 3 of the home
            redesign (1.7.4). The two existing actions
            (`setShowVoiceCheck` → Voice Check, `setShowFaceCheck` → Face
            Check) are unchanged — only the page slot and the EN labels
            changed. */}

        {/* Центральный блок с описанием контура relocated to Your
            Journey section below the practices grid. */}
        {false && (
        <div className="mb-12">
          <div className={`rounded-2xl border py-4 sm:py-8 px-4 sm:px-8 transition-all duration-1000 ${
            isLight
              ? `bg-white/55 backdrop-blur-xl shadow-xl shadow-indigo-200/40 ${glow.panelBorder}`
              : `backdrop-blur-sm ${activeCircuit === 9 ? 'bg-black/35' : 'bg-black/20'} ${
            activeCircuit === 2
              ? 'border-cyan-500/30'
              : activeCircuit === 3
              ? 'border-amber-600/30'
              : activeCircuit === 4
              ? 'border-teal-500/30'
              : activeCircuit === 5
              ? 'border-amber-600/40'
              : activeCircuit === 6
              ? 'border-emerald-500/40'
              : activeCircuit === 7
              ? 'border-sky-500/40'
              : activeCircuit === 8
              ? 'border-indigo-500/40'
              : activeCircuit === 9
              ? 'border-2 border-yellow-200/95 shadow-[0_0_38px_rgba(253,224,71,0.55)]'
              : activeCircuit === 10
              ? 'border-orange-500/40'
              : activeCircuit === 11
              ? 'border-cyan-500/40'
              : activeCircuit === 12
              ? 'border-fuchsia-500/40'
              : 'border-purple-500/30'
          }`
          }`}>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="text-4xl sm:text-6xl font-light tracking-wider">{t(`circuits.circuit_${activeCircuit}_title`)}</div>
              </div>
              <h3 className="text-2xl font-light mb-4">{t(`circuits.circuit_${activeCircuit}_subtitle`)}</h3>
              <p className={`leading-relaxed ${isLight ? 'text-slate-500' : 'text-white/70'}`} dangerouslySetInnerHTML={{__html: t(`circuits.circuit_${activeCircuit}_desc`)}}>
              </p>
            </div>
          </div>
        </div>
        )}

        {/* PermissionWarningBanner removed — the same "Set Up Now"
            trigger now lives inside the Biometric Hero (replaces the
            decorative sine wave when there's no live HR data). Avoids
            duplicate CTA on the home screen. */}

        {/* Watch Connection Prompt */}
        <WatchConnectionPrompt
          visible={showWatchPrompt}
          onConnected={() => setShowWatchPrompt(false)}
        />

        {/* BLE Connect Tracker — Android only, shown above biometrics grid */}
        {platform !== 'ios' && !vitalsData.connected && (
          <div className={`mb-4 rounded-2xl p-4 max-w-lg mx-auto w-full ${isLight ? 'bg-white/55 backdrop-blur-xl shadow-lg shadow-indigo-100/60 border border-sky-200' : 'bg-black/30 backdrop-blur-sm border border-blue-500/20'}`}>
            <p className={`text-base font-semibold mb-1 ${isLight ? 'text-sky-800' : 'text-white/70'}`}>{t('settings.bluetooth_monitor', 'Bluetooth Heart Rate Monitor')}</p>
            <p className={`text-sm mb-3 ${isLight ? 'text-sky-700' : 'text-white/50'}`}>
              {t('settings.bluetooth_desc', 'Connect a Bluetooth heart rate monitor for real-time biofeedback during practices')}
            </p>
            <div className="flex flex-col gap-2">
              {!vitalsData.isScanning && (
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={vitalsData.connect}
                    disabled={vitalsData.connected}
                    data-testid="button-connect-tracker-home"
                    className={`py-2.5 px-5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      vitalsData.connected
                        ? 'bg-green-500/20 text-green-400 cursor-default'
                        : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                    }`}
                  >
                    <Bluetooth className="w-4 h-4" />
                    {vitalsData.connected ? t('settings.tracker_connected', 'Connected') : t('settings.tracker_connect', 'Connect Tracker')}
                  </button>
                  {vitalsData.connected && (
                    <button
                      onClick={vitalsData.disconnect}
                      data-testid="button-disconnect-tracker-home"
                      className="py-2.5 px-5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400"
                    >
                      <X className="w-4 h-4" />
                      {t('settings.tracker_disconnect', 'Disconnect')}
                    </button>
                  )}
                </div>
              )}
              {vitalsData.isScanning && (
                <div className="flex gap-2">
                  <div className="flex-1 py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 bg-blue-500/10 text-blue-300">
                    <Bluetooth className="w-4 h-4 animate-pulse" />
                    Scanning...
                  </div>
                  {vitalsData.stopScan && (
                    <button
                      onClick={vitalsData.stopScan}
                      data-testid="button-stop-scan-home"
                      className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-500' : 'bg-white/10 hover:bg-white/20 text-white/70'}`}
                    >
                      {t('settings.scan_stop', 'Stop')}
                    </button>
                  )}
                </div>
              )}
              {/* Available devices after scan */}
              {!vitalsData.isScanning && vitalsData.availableDevices && vitalsData.availableDevices.length > 0 && vitalsData.connectToDevice && (
                <div className={`p-3 rounded-xl ${isLight ? 'bg-slate-100/80 border border-slate-200' : 'bg-white/5 border border-white/10'}`}>
                  <p className={`text-sm mb-2 ${isLight ? 'text-sky-700' : 'text-white/60'}`}>{t('settings.available_devices', 'Available Devices')}:</p>
                  <div className="space-y-1.5">
                    {vitalsData.availableDevices.map((device) => (
                      <button
                        key={device.id}
                        onClick={() => vitalsData.connectToDevice!(device.id)}
                        data-testid={`button-device-home-${device.id}`}
                        className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between gap-2 ${isLight ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm' : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'}`}
                      >
                        <span className="flex items-center gap-2">
                          <Bluetooth className="w-3.5 h-3.5" />
                          {device.name}
                        </span>
                        <span className={`text-xs ${isLight ? 'text-slate-400' : 'text-white/50'}`}>{t('settings.device_connect', 'Connect')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Connection instructions */}
              <div className={`mt-1 p-3 rounded-xl ${isLight ? 'bg-slate-100/80 border border-slate-200' : 'bg-white/5 border border-white/10'}`}>
                <p className={`text-sm font-medium mb-1.5 ${isLight ? 'text-sky-800' : 'text-white/70'}`}>{t('settings.connection_instructions', 'Connection instructions:')}</p>
                <div className={`text-sm space-y-1 ${isLight ? 'text-sky-700' : 'text-white/50'}`}>
                  <p>{t('settings.instruction_1', 'On phone: Close standard tracker app. Turn on Bluetooth')}</p>
                  <p>{t('settings.instruction_2', 'On tracker: Settings → Share heart rate → Enable')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Биометрика и Прогресс уровня перенесены наверх в шапку
            (Sections 1 и 2.5 home redesign 1.7.4). */}

        {/* Философский текст relocated to Your Journey section below
            the practices grid. */}
        {false && (
        <div className="mb-8 sm:mb-12">
          <div className={`backdrop-blur-sm rounded-2xl p-4 sm:p-8 border transition-all duration-1000 ${
            isLight
              ? `bg-white/55 backdrop-blur-xl shadow-lg shadow-indigo-100/60 ${glow.panelBorder}`
              : activeCircuit === 2
              ? 'bg-gradient-to-br from-teal-900/20 to-cyan-900/20 border-cyan-500/30'
              : activeCircuit === 3
              ? 'bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-600/30'
              : activeCircuit === 4
              ? 'bg-gradient-to-br from-teal-900/20 to-cyan-900/20 border-teal-500/30'
              : activeCircuit === 5
              ? 'bg-gradient-to-br from-yellow-800/30 to-yellow-700/30 border-amber-600/40'
              : activeCircuit === 6
              ? 'bg-gradient-to-br from-emerald-800/30 to-teal-700/30 border-emerald-500/40'
              : activeCircuit === 7
              ? 'bg-gradient-to-br from-sky-800/30 to-blue-700/30 border-sky-500/40'
              : activeCircuit === 8
              ? 'bg-gradient-to-br from-indigo-800/30 to-violet-700/30 border-indigo-500/40'
              : activeCircuit === 9
              ? 'bg-gradient-to-br from-amber-800/30 to-yellow-600/30 border-yellow-500/50'
              : activeCircuit === 10
              ? 'bg-gradient-to-br from-orange-800/30 to-amber-700/30 border-orange-500/40'
              : activeCircuit === 11
              ? 'bg-gradient-to-br from-teal-800/30 to-cyan-700/30 border-cyan-500/40'
              : activeCircuit === 12
              ? 'bg-gradient-to-br from-fuchsia-800/30 to-red-700/30 border-fuchsia-500/40'
              : 'bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/30'
          }`}>
            <p className={`text-sm sm:text-lg leading-relaxed text-center italic ${isLight ? 'text-slate-600' : 'text-white/90'}`}>
              {t(`philosophy.level_${activeCircuit}.text_1`)}<br/>
              {t(`philosophy.level_${activeCircuit}.text_2`)}<br/>
              {t(`philosophy.level_${activeCircuit}.text_3`)}<br/>
              {t(`philosophy.level_${activeCircuit}.text_4`)}<br/>
              {t(`philosophy.level_${activeCircuit}.text_5`)}
              {activeCircuit === 1 && <><br/>{t('philosophy.level_1.text_6')}</>}
            </p>
          </div>
        </div>
        )}

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
                : activeCircuit === 4
                ? 'border-teal-500/20'
                : activeCircuit === 5
                ? 'border-amber-600/30'
                : activeCircuit === 6
                ? 'border-emerald-500/30'
                : activeCircuit === 7
                ? 'border-sky-500/30'
                : activeCircuit === 8
                ? 'border-indigo-500/30'
                : activeCircuit === 9
                ? 'border-yellow-500/40'
                : activeCircuit === 10
                ? 'border-orange-500/30'
                : activeCircuit === 11
                ? 'border-cyan-500/30'
                : activeCircuit === 12
                ? 'border-fuchsia-500/30'
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
                : activeCircuit === 4
                ? 'border-teal-500/20'
                : activeCircuit === 5
                ? 'border-amber-600/30'
                : activeCircuit === 6
                ? 'border-emerald-500/30'
                : activeCircuit === 7
                ? 'border-sky-500/30'
                : activeCircuit === 8
                ? 'border-indigo-500/30'
                : activeCircuit === 9
                ? 'border-yellow-500/40'
                : activeCircuit === 10
                ? 'border-orange-500/30'
                : activeCircuit === 11
                ? 'border-cyan-500/30'
                : activeCircuit === 12
                ? 'border-fuchsia-500/30'
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
                : activeCircuit === 4
                ? 'border-teal-500/20'
                : activeCircuit === 5
                ? 'border-amber-600/30'
                : activeCircuit === 6
                ? 'border-emerald-500/30'
                : activeCircuit === 7
                ? 'border-sky-500/30'
                : activeCircuit === 8
                ? 'border-indigo-500/30'
                : activeCircuit === 9
                ? 'border-yellow-500/40'
                : activeCircuit === 10
                ? 'border-orange-500/30'
                : activeCircuit === 11
                ? 'border-cyan-500/30'
                : activeCircuit === 12
                ? 'border-fuchsia-500/30'
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
                : activeCircuit === 4
                ? 'border-teal-500/20'
                : activeCircuit === 5
                ? 'border-amber-600/30'
                : activeCircuit === 6
                ? 'border-emerald-500/30'
                : activeCircuit === 7
                ? 'border-sky-500/30'
                : activeCircuit === 8
                ? 'border-indigo-500/30'
                : activeCircuit === 9
                ? 'border-yellow-500/40'
                : activeCircuit === 10
                ? 'border-orange-500/30'
                : activeCircuit === 11
                ? 'border-cyan-500/30'
                : activeCircuit === 12
                ? 'border-fuchsia-500/30'
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
                        ? 'bg-yellow-500/10 border-amber-600/30' 
                        : 'bg-black/30 border-gray-600/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`text-4xl ${isUnlocked ? '' : 'grayscale opacity-40'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold mb-1 ${isUnlocked ? 'text-amber-300' : 'text-gray-400'}`}>
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
                          <span className="inline-block mt-2 text-xs bg-yellow-500/20 text-amber-300 px-2 py-1 rounded-full">
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
                      <span className="bg-yellow-500/20 text-amber-300 text-xs px-2 py-1 rounded-full border border-amber-500/30">
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
                      <p className="text-gray-400 text-xs">{t('practices.coherence')}</p>
                      <p className="font-bold text-cyan-400">{session.coherenceDelta != null ? `+${Math.round(session.coherenceDelta)}%` : '—'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">{t('journal.reward')}</p>
                      <p className="font-bold text-amber-400">+{session.qnt} OND</p>
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
              <div className="text-amber-400 mb-1">Watch Debug:</div>
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
            <div className={`rounded-2xl p-4 text-center ${isLight ? 'bg-white/55 backdrop-blur-xl shadow-lg shadow-indigo-100/60 border border-cyan-200' : 'bg-cyan-500/10 border border-cyan-500/30'}`}>
              <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
                <Watch className="w-5 h-5" />
                <span className="font-medium">{t('nav.watch_activate_title')}</span>
              </div>
              <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-white/70'}`}>
                {t('nav.watch_activate_text')}
              </p>
            </div>
          </div>
        )}

        {/* Подсказка для разрешения Watch - СКРЫТА */}

        {/* The 12-practice grid moved up under Section 2 (Today's
            Practice) so the first viewport for new users contains real
            practice cards, not setup chrome. Its data-testid anchor
            (`data-onda-practices-grid`) still exists at the new site. */}

        {/* Section 6 — Your Journey toggle. When opened, the lore
            blocks reveal directly below in the page flow (not at their
            original positions further up). The three "upper" lore
            blocks (header / circuit description / philosophy) are
            mirrored here; the original sites are kept dead-gated
            ({false && (...)}) for now to limit diff size — a future
            cleanup can delete the dead JSX entirely. */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setJourneyOpen(v => !v)}
            aria-expanded={journeyOpen}
            data-testid="journey-toggle"
            className={`w-full flex items-center justify-between rounded-2xl px-4 sm:px-5 py-3 sm:py-4 transition-all ${emoTint}`}
          >
            <span className="text-base sm:text-lg font-medium">{t('home.journey.title')}</span>
            <span
              aria-hidden="true"
              className="text-sm opacity-70"
              style={{
                display: 'inline-block',
                transition: 'transform 180ms ease',
                transform: journeyOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >▾</span>
          </button>
        </div>

        {/* ─── Your Journey lore — upper blocks (1: header, 2: circuit
             description, 3: philosophy text) relocated under the
             toggle so that expanding reveals content right here. ─── */}

        {/* Block 1 — logo + chapter/level chips + level quote */}
        {journeyOpen && (
        <div className="text-center mb-6 sm:mb-12 pt-0">
          <div className={`flex items-center justify-center gap-2 mb-8 sm:mb-10 ${isLight ? 'text-slate-400' : 'text-white/80'}`}>
            <span className="text-lg sm:text-xl font-light">ONDA</span>
            <span className="text-sm sm:text-base font-light">~</span>
            <span className="text-lg sm:text-xl font-light">LIFE</span>
          </div>

          <div className="w-full max-w-lg mx-auto px-4">
            {/* Chapter | Title */}
            <div className="flex items-center justify-center mb-2 sm:mb-2">
              <div className="relative dropdown-container w-full">
                <button
                  onClick={() => { setShowChapterDropdown(!showChapterDropdown); setShowLevelDropdown(false); }}
                  className={`backdrop-blur-sm text-xl sm:text-2xl font-light px-4 sm:px-6 py-3 sm:py-4 rounded-full transition-all border w-full ${emoTint}`}
                >
                  <div className="flex items-center justify-center">
                    <span className="flex-1 text-right pr-3 sm:pr-4">{t('chapter')} {selectedChapter}</span>
                    <span className={isLight ? 'text-slate-400' : 'text-white/30'}>|</span>
                    <span className="flex-1 text-left pl-3 sm:pl-4">{t(`chapters.chapter_${selectedChapter}`)}</span>
                  </div>
                </button>
                {showChapterDropdown && (
                  <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 backdrop-blur-md rounded-2xl border z-50 overflow-hidden w-full bg-indigo-500/20 border-indigo-400/50`}>
                    {Array.from({length: 4}, (_, i) => i + 1).map(chapter => {
                      const firstLevelOfChapter = (chapter - 1) * 3 + 1;
                      const isAvailable = isPartUnlocked(firstLevelOfChapter);
                      return (
                        <button
                          key={chapter}
                          onClick={() => {
                            if (isAvailable) {
                              setSelectedChapter(chapter);
                              setSelectedLevel(firstLevelOfChapter);
                              setActiveCircuit(firstLevelOfChapter);
                              setShowChapterDropdown(false);
                            }
                          }}
                          className={`block w-full px-4 py-3 transition-all text-lg ${
                            isLight
                              ? !isAvailable
                                ? 'text-slate-400 cursor-not-allowed'
                                : selectedChapter === chapter
                                  ? 'bg-indigo-500/25 text-slate-900 font-medium'
                                  : 'text-slate-700 hover:bg-indigo-500/10'
                              : !isAvailable
                              ? 'text-white/40 cursor-not-allowed'
                              : selectedChapter === chapter ? 'bg-indigo-500/40 text-white' : 'hover:bg-indigo-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <span className="flex-1 text-right pr-3 sm:pr-4">{t('chapter')} {chapter}</span>
                            <span className={isLight ? 'text-slate-400' : 'text-white/30'}>|</span>
                            <span className="flex-1 text-left pl-3 sm:pl-4">{t(`chapters.chapter_${chapter}`)}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            {/* Level | Part name */}
            <div className="flex items-center justify-center mb-3">
              <div className="relative dropdown-container w-full">
                <button
                  onClick={() => { setShowLevelDropdown(!showLevelDropdown); setShowChapterDropdown(false); }}
                  className={`backdrop-blur-sm font-light px-4 sm:px-6 py-3 sm:py-4 rounded-full transition-all border w-full ${emoTint}`}
                >
                  <div className="flex items-center justify-center">
                    <span className="flex-1 text-right pr-3 sm:pr-4 text-xl sm:text-2xl">{t('level')} {selectedLevel}</span>
                    <span className={`text-xl sm:text-2xl ${isLight ? 'text-slate-400' : 'text-white/30'}`}>|</span>
                    <span className="flex-1 text-left pl-3 sm:pl-4">
                      <span className="text-xl sm:text-2xl">{t(`part_name_${selectedLevel}`).split(' ')[0]}</span>
                      <span className="text-base sm:text-xl"> {t(`part_name_${selectedLevel}`).split(' ').slice(1).join(' ')}</span>
                    </span>
                  </div>
                </button>
                {showLevelDropdown && (
                  <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 backdrop-blur-md rounded-2xl border z-50 overflow-hidden w-full max-h-[60vh] overflow-y-auto scrollbar-hide bg-indigo-500/20 border-indigo-400/50`}>
                    {Array.from({length: 12}, (_, i) => i + 1).map(level => {
                      const isAvailable = isPartUnlocked(level);
                      return (
                        <button
                          key={level}
                          onClick={() => {
                            if (isAvailable) {
                              setSelectedLevel(level);
                              setActiveCircuit(level);
                              const chapterForLevel = Math.ceil(level / 3);
                              setSelectedChapter(chapterForLevel);
                              setShowLevelDropdown(false);
                            }
                          }}
                          className={`block w-full px-4 py-2.5 transition-all text-lg ${
                            isLight
                              ? !isAvailable
                                ? 'text-slate-400 cursor-not-allowed'
                                : level === selectedLevel
                                  ? 'bg-indigo-500/25 text-slate-900 font-medium'
                                  : 'text-slate-700 hover:bg-indigo-500/10'
                              : !isAvailable
                              ? 'text-white/40 cursor-not-allowed'
                              : level === selectedLevel ? 'bg-indigo-500/40 text-white' : 'hover:bg-indigo-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <span className="flex-1 text-right pr-3 sm:pr-4">{t('level')} {level}</span>
                            <span className={isLight ? 'text-slate-400' : 'text-white/30'}>|</span>
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
            <div className={`text-base sm:text-xl italic max-w-md text-center px-4 sm:px-0 ${isLight ? 'text-slate-500' : 'text-white/80'}`} dangerouslySetInnerHTML={{__html: `«${t(`quote_level_${activeCircuit}`)}»`}}>
            </div>
          </div>
        </div>
        )}

        {/* Block 2 — circuit description card */}
        {journeyOpen && (
        <div className="mb-12">
          <div className={`rounded-2xl border py-4 sm:py-8 px-4 sm:px-8 transition-all duration-1000 ${
            isLight
              ? `bg-white/55 backdrop-blur-xl shadow-xl shadow-indigo-200/40 ${glow.panelBorder}`
              : 'backdrop-blur-sm bg-black/20 border-purple-500/30'
          }`}>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="text-4xl sm:text-6xl font-light tracking-wider">{t(`circuits.circuit_${activeCircuit}_title`)}</div>
              </div>
              <h3 className="text-2xl font-light mb-4">{t(`circuits.circuit_${activeCircuit}_subtitle`)}</h3>
              <p className={`leading-relaxed ${isLight ? 'text-slate-500' : 'text-white/70'}`} dangerouslySetInnerHTML={{__html: t(`circuits.circuit_${activeCircuit}_desc`)}}>
              </p>
            </div>
          </div>
        </div>
        )}

        {/* Block 3 — philosophy text */}
        {journeyOpen && (
        <div className="mb-8 sm:mb-12">
          <div className={`backdrop-blur-sm rounded-2xl p-4 sm:p-8 border transition-all duration-1000 ${
            isLight
              ? `bg-white/55 backdrop-blur-xl shadow-lg shadow-indigo-100/60 ${glow.panelBorder}`
              : 'bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/30'
          }`}>
            <p className={`text-sm sm:text-lg leading-relaxed text-center italic ${isLight ? 'text-slate-600' : 'text-white/90'}`}>
              {t(`philosophy.level_${activeCircuit}.text_1`)}<br/>
              {t(`philosophy.level_${activeCircuit}.text_2`)}<br/>
              {t(`philosophy.level_${activeCircuit}.text_3`)}<br/>
              {t(`philosophy.level_${activeCircuit}.text_4`)}<br/>
              {t(`philosophy.level_${activeCircuit}.text_5`)}
              {activeCircuit === 1 && <><br/>{t('philosophy.level_1.text_6')}</>}
            </p>
          </div>
        </div>
        )}

        {/* Кнопка Part's info — inside Your Journey */}
        {journeyOpen && t(`part_info.level_${activeCircuit}.title`, { defaultValue: '' }) && (
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => {
                setActiveView('addon');
                const rootEl = document.getElementById('root');
                if (rootEl) rootEl.scrollTop = 0;
                window.scrollTo(0, 0);
              }}
              className={`py-3.5 px-8 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md ${emoTint}`}
            >
              <span>{t('part_info.button')}</span>
            </button>
          </div>
        )}

        {/* Level goal storytelling + Terra speaks — inside Your Journey */}
        {journeyOpen && (
        <>

        <div className={`backdrop-blur-md rounded-2xl p-8 border shadow-2xl transition-all duration-1000 ${
          isLight
            ? `bg-white/55 backdrop-blur-xl shadow-xl shadow-indigo-100/50 ${glow.panelBorder}`
            : activeCircuit === 2
            ? 'bg-gradient-to-br from-teal-900/30 via-cyan-900/20 to-blue-900/30 border-cyan-500/30'
            : activeCircuit === 3
            ? 'bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-amber-900/30 border-amber-600/30'
            : activeCircuit === 4
            ? 'bg-gradient-to-br from-teal-900/30 via-cyan-900/20 to-teal-900/30 border-teal-500/30'
            : activeCircuit === 5
            ? 'bg-gradient-to-br from-yellow-800/40 via-yellow-700/30 to-yellow-800/40 border-amber-600/40'
            : activeCircuit === 6
            ? 'bg-gradient-to-br from-emerald-800/40 via-teal-700/30 to-emerald-800/40 border-emerald-500/40'
            : activeCircuit === 7
            ? 'bg-gradient-to-br from-sky-800/40 via-blue-700/30 to-sky-800/40 border-sky-500/40'
            : activeCircuit === 8
            ? 'bg-gradient-to-br from-indigo-800/40 via-violet-700/30 to-indigo-800/40 border-indigo-500/40'
            : activeCircuit === 9
            ? 'bg-gradient-to-br from-amber-800/40 via-yellow-600/30 to-amber-800/40 border-yellow-300/60 ring-1 ring-yellow-300/40 shadow-[0_0_30px_rgba(253,224,71,0.45)]'
            : activeCircuit === 10
            ? 'bg-gradient-to-br from-orange-800/40 via-amber-700/30 to-orange-800/40 border-orange-500/40'
            : activeCircuit === 11
            ? 'bg-gradient-to-br from-teal-800/40 via-cyan-700/30 to-teal-800/40 border-cyan-500/40'
            : activeCircuit === 12
            ? 'bg-gradient-to-br from-fuchsia-800/40 via-red-700/30 to-fuchsia-800/40 border-fuchsia-500/40'
            : 'bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/30 border-indigo-500/30'
        }`}>
          <div className={`space-y-4 ${isLight ? '[&_p.story]:text-slate-600' : 'text-gray-200'}`}>
            <p className={`leading-relaxed story ${isLight ? '' : 'text-gray-300'}`}>{t(`level_goal.level_${activeCircuit}.intro`)}</p>

            <p className={`leading-relaxed story ${isLight ? '' : 'text-gray-300'}`}>{t(`level_goal.level_${activeCircuit}.story_1`)}</p>
            <p className={`leading-relaxed story ${isLight ? '' : 'text-gray-300'}`}>{t(`level_goal.level_${activeCircuit}.story_2`)}</p>
            <p className={`leading-relaxed story ${isLight ? '' : 'text-gray-300'}`}>{t(`level_goal.level_${activeCircuit}.story_3`)}</p>
            {activeCircuit === 1 && (
              <p className={`leading-relaxed italic ${isLight ? partTextMid : 'text-cyan-300'}`}>{t('level_goal.level_1.story_4')}</p>
            )}

            <div className="text-center py-4">
              <p className={`text-xl font-bold mb-2 ${
                isLight ? partTextStrong :
                activeCircuit === 2 ? 'text-cyan-300' : activeCircuit === 3 ? 'text-amber-300' : activeCircuit === 4 ? 'text-teal-300' : activeCircuit === 5 ? 'text-yellow-200' : activeCircuit === 6 ? 'text-emerald-300' : activeCircuit === 7 ? 'text-sky-300' : activeCircuit === 8 ? 'text-indigo-300' : activeCircuit === 9 ? 'text-yellow-300' : activeCircuit === 10 ? 'text-orange-300' : activeCircuit === 11 ? 'text-cyan-300' : activeCircuit === 12 ? 'text-fuchsia-300' : 'text-pink-300'
              }`}>{t(`level_goal.level_${activeCircuit}.identity_1`)}</p>
              <p className={`text-lg ${
                isLight ? partTextMid :
                activeCircuit === 2 ? 'text-teal-300' : activeCircuit === 3 ? 'text-orange-300' : activeCircuit === 4 ? 'text-cyan-300' : activeCircuit === 5 ? 'text-yellow-200' : activeCircuit === 6 ? 'text-teal-300' : activeCircuit === 7 ? 'text-blue-300' : activeCircuit === 8 ? 'text-violet-300' : activeCircuit === 9 ? 'text-amber-300' : activeCircuit === 10 ? 'text-amber-300' : activeCircuit === 11 ? 'text-pink-300' : activeCircuit === 12 ? 'text-red-300' : 'text-purple-300'
              }`}>{t(`level_goal.level_${activeCircuit}.identity_2`)}</p>
              <p className={`text-lg ${
                isLight ? partTextMid :
                activeCircuit === 2 ? 'text-blue-300' : activeCircuit === 3 ? 'text-amber-300' : activeCircuit === 4 ? 'text-teal-200' : activeCircuit === 5 ? 'text-yellow-200' : activeCircuit === 6 ? 'text-emerald-200' : activeCircuit === 7 ? 'text-sky-200' : activeCircuit === 8 ? 'text-indigo-200' : activeCircuit === 9 ? 'text-yellow-200' : activeCircuit === 10 ? 'text-amber-200' : activeCircuit === 11 ? 'text-cyan-200' : activeCircuit === 12 ? 'text-red-200' : 'text-indigo-300'
              }`}>{t(`level_goal.level_${activeCircuit}.identity_3`)}</p>
            </div>
            
            <p className={`leading-relaxed story ${isLight ? '' : 'text-gray-300'}`}>{t(`level_goal.level_${activeCircuit}.wisdom_1`)}</p>
            <p className={`leading-relaxed story ${isLight ? '' : 'text-gray-300'}`}>{t(`level_goal.level_${activeCircuit}.wisdom_2`)}</p>
            <p className={`leading-relaxed story ${isLight ? '' : 'text-gray-300'}`}>{t(`level_goal.level_${activeCircuit}.wisdom_3`)}</p>
            <p className={`leading-relaxed italic ${
              isLight ? partTextMid :
              activeCircuit === 2 ? 'text-cyan-300' : activeCircuit === 3 ? 'text-amber-300' : 'text-cyan-300'
            }`}>{t(`level_goal.level_${activeCircuit}.wisdom_4`)}</p>
          </div>
        </div>

        <div className="mt-8 p-4 sm:p-8">
          <h3 className={`text-2xl font-bold mb-6 transition-colors duration-1000 text-center ${
            isLight
              ? partTextStrong
              : activeCircuit === 2
              ? 'text-cyan-300'
              : activeCircuit === 3
              ? 'text-gray-300'
              : activeCircuit === 4
              ? 'text-teal-300'
              : activeCircuit === 5
              ? 'text-slate-300'
              : activeCircuit === 6
              ? 'text-rose-300'
              : 'text-purple-300'
          }`}>
            {t('terra_speaks.title')}
          </h3>
          <div className="space-y-4">
            <p className={`text-sm sm:text-lg leading-relaxed text-center italic ${isLight ? 'text-slate-600' : 'text-white/90'}`}>
              "{t(`terra_speaks.level_${activeCircuit}.quote_1`)}"
            </p>
            <p className={`text-sm sm:text-lg leading-relaxed text-center italic ${isLight ? 'text-slate-600' : 'text-white/90'}`}>
              "{t(`terra_speaks.level_${activeCircuit}.quote_2`)}"
            </p>
            <p className={`text-sm sm:text-lg leading-relaxed text-center italic ${isLight ? 'text-slate-600' : 'text-white/90'}`}>
              "{t(`terra_speaks.level_${activeCircuit}.quote_3`)}"
            </p>
            <p className={`text-lg leading-relaxed italic font-semibold text-center transition-colors duration-1000 ${
              isLight
                ? partTextMid
                : activeCircuit === 2
                ? 'text-cyan-200'
                : activeCircuit === 3
                ? 'text-gray-200'
                : activeCircuit === 4
                ? 'text-teal-200'
                : activeCircuit === 5
                ? 'text-slate-200'
                : activeCircuit === 6
                ? 'text-rose-200'
                : 'text-amber-200'
            }`}>
              "{t(`terra_speaks.level_${activeCircuit}.quote_4`)}"
            </p>
          </div>
        </div>
        </>
        )}

        {/* Заголовок секции артефактов + all artifact panels — inside Your Journey */}
        {journeyOpen && (
        <>
        <div className="mt-12 mb-6">
          <h2 className={`text-3xl font-bold text-center transition-colors duration-1000 ${
            isLight
              ? partTextStrong
              : activeCircuit === 2
              ? 'text-cyan-300'
              : activeCircuit === 3
              ? 'text-gray-300'
              : activeCircuit === 4
              ? 'text-teal-300'
              : activeCircuit === 5
              ? 'text-slate-300'
              : activeCircuit === 6
              ? 'text-rose-300'
              : 'text-purple-300'
          }`}>
            {t('artifacts.level_title', { level: activeCircuit })}
          </h2>
        </div>

        {/* Все артефакты */}
        <div className="space-y-4 mb-12">
          {/* Артефакт контура (Roots of Being и т.д.) */}
          {currentCircuit.artifact && (
          <div className={`rounded-2xl p-6 border ${isLight ? 'backdrop-blur-xl shadow-lg shadow-indigo-100/60' : 'bg-black/40 backdrop-blur-sm'} ${
            artifacts.some(a => a.circuitId === currentCircuit.id)
              ? isLight ? 'border-amber-300 bg-white/55' : 'border-amber-600/50 bg-yellow-500/10'
              : isLight ? 'border-violet-300 bg-white/55' : 'border-purple-500/50 bg-purple-500/10'
          }`}>
            <div className="flex items-center gap-4">
              {artifacts.some(a => a.circuitId === currentCircuit.id) ? (
                <Star className="w-12 h-12 text-amber-400 fill-yellow-400" />
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
          )}
          {/* Артефакт - Ясная Воля (только для части 1) */}
          {activeCircuit === 1 && (() => {
            const perfectCount = practiceHistory.filter(p => p.quality >= 100).length;
            const hasClearWill = artifacts.some(a => a.id === 'clear-will');
            return (
              <div
                className={`rounded-2xl p-6 border ${isLight ? 'backdrop-blur-xl shadow-lg shadow-indigo-100/60' : 'bg-black/40 backdrop-blur-sm'} ${
                  hasClearWill
                    ? isLight ? 'border-amber-300 bg-white/55' : 'border-amber-600/50 bg-yellow-500/10'
                    : isLight ? 'border-violet-300 bg-white/55' : 'border-purple-500/50 bg-purple-500/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  {hasClearWill ? (
                    <Star className="w-12 h-12 text-amber-400 fill-yellow-400" />
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
                className={`rounded-2xl p-6 border ${isLight ? 'backdrop-blur-xl shadow-lg shadow-indigo-100/60' : 'bg-black/40 backdrop-blur-sm'} ${
                  hasInnerWave
                    ? isLight ? 'border-amber-300 bg-white/55' : 'border-amber-600/50 bg-yellow-500/10'
                    : isLight ? 'border-violet-300 bg-white/55' : 'border-purple-500/50 bg-purple-500/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  {hasInnerWave ? (
                    <Star className="w-12 h-12 text-amber-400 fill-yellow-400" />
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
                className={`rounded-2xl p-6 border ${isLight ? 'backdrop-blur-xl shadow-lg shadow-indigo-100/60' : 'bg-black/40 backdrop-blur-sm'} ${
                  hasTransformationPulse
                    ? isLight ? 'border-amber-300 bg-white/55' : 'border-amber-600/50 bg-yellow-500/10'
                    : isLight ? 'border-violet-300 bg-white/55' : 'border-purple-500/50 bg-purple-500/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  {hasTransformationPulse ? (
                    <Star className="w-12 h-12 text-amber-400 fill-yellow-400" />
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

          {/* Артефакт - Эхо Радости (только Part 4, пока не взят) */}
          {activeCircuit === 4 && !artifacts.some(a => a.id === 'echo-of-joy') && (() => {
            const part4PerfectCount = practiceHistory.filter(p => 
              p.practiceId?.startsWith('p4-') && p.quality >= 100
            ).length;
            return (
              <div
                className={`rounded-2xl p-6 border ${isLight ? 'backdrop-blur-xl shadow-lg shadow-indigo-100/60 border-violet-300 bg-white/55' : 'bg-black/40 backdrop-blur-sm border-purple-500/50 bg-purple-500/10'}`}
              >
                <div className="flex items-center gap-4">
                  <Star className="w-12 h-12 text-purple-400 fill-purple-400" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{t('artifacts.echo_of_joy')}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {t('artifacts.echo_of_joy_desc')}
                    </p>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">
                        {t('artifacts.progress')}: {part4PerfectCount}/3 {t('artifacts.practices_100')}
                      </div>
                      <div className="text-emerald-400">
                        {t('labels.bonus')}: +50% {t('labels.to_qnt_generation')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Артефакт - Спокойная Сила (только Part 5, пока не взят) */}
          {activeCircuit === 5 && !artifacts.some(a => a.id === 'calm-power') && (() => {
            const part5PerfectCount = practiceHistory.filter(p => 
              p.practiceId?.startsWith('p5-') && p.quality >= 100
            ).length;
            return (
              <div
                className={`rounded-2xl p-6 border ${isLight ? 'backdrop-blur-xl shadow-lg shadow-indigo-100/60 border-violet-300 bg-white/55' : 'bg-black/40 backdrop-blur-sm border-purple-500/50 bg-purple-500/10'}`}
              >
                <div className="flex items-center gap-4">
                  <Star className="w-12 h-12 text-purple-400 fill-purple-400" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{t('artifacts.calm_power')}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {t('artifacts.calm_power_desc')}
                    </p>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">
                        {t('artifacts.progress')}: {part5PerfectCount}/6 {t('artifacts.practices_100')}
                      </div>
                      <div className="text-emerald-400">
                        {t('labels.bonus')}: +20% {t('labels.to_qnt_generation')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Артефакт - Эхо Власти (только Part 5, пока не взят) */}
          {activeCircuit === 5 && !artifacts.some(a => a.id === 'echo-of-power') && (() => {
            const part5PerfectCount = practiceHistory.filter(p => 
              p.practiceId?.startsWith('p5-') && p.quality >= 100
            ).length;
            return (
              <div
                className={`rounded-2xl p-6 border ${isLight ? 'backdrop-blur-xl shadow-lg shadow-indigo-100/60 border-violet-300 bg-white/55' : 'bg-black/40 backdrop-blur-sm border-purple-500/50 bg-purple-500/10'}`}
              >
                <div className="flex items-center gap-4">
                  <Star className="w-12 h-12 text-purple-400 fill-purple-400" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{t('artifacts.echo_of_power')}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {t('artifacts.echo_of_power_desc')}
                    </p>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">
                        {t('artifacts.progress')}: {part5PerfectCount}/12 {t('artifacts.practices_100')}
                      </div>
                      <div className="text-emerald-400">
                        {t('labels.bonus')}: +50% {t('labels.to_qnt_generation')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Артефакт - Язык Тела (только Part 6, пока не взят) */}
          {activeCircuit === 6 && !artifacts.some(a => a.id === 'body-language') && (() => {
            const part6PerfectCount = practiceHistory.filter(p => 
              p.practiceId?.startsWith('p6-') && p.quality >= 100
            ).length;
            return (
              <div
                className={`rounded-2xl p-6 border ${isLight ? 'backdrop-blur-xl shadow-lg shadow-indigo-100/60 border-violet-300 bg-white/55' : 'bg-black/40 backdrop-blur-sm border-purple-500/50 bg-purple-500/10'}`}
              >
                <div className="flex items-center gap-4">
                  <Star className="w-12 h-12 text-purple-400 fill-purple-400" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{t('artifacts.body_language')}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {t('artifacts.body_language_desc')}
                    </p>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">
                        {t('artifacts.progress')}: {part6PerfectCount}/6 {t('artifacts.practices_100')}
                      </div>
                      <div className="text-emerald-400">
                        {t('labels.bonus')}: +30% {t('labels.to_qnt_generation')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Артефакт - Безмолвное Понимание (только Part 6, пока не взят) */}
          {activeCircuit === 6 && !artifacts.some(a => a.id === 'silent-understanding') && (() => {
            const part6PerfectCount = practiceHistory.filter(p => 
              p.practiceId?.startsWith('p6-') && p.quality >= 100
            ).length;
            return (
              <div
                className={`rounded-2xl p-6 border ${isLight ? 'backdrop-blur-xl shadow-lg shadow-indigo-100/60 border-violet-300 bg-white/55' : 'bg-black/40 backdrop-blur-sm border-purple-500/50 bg-purple-500/10'}`}
              >
                <div className="flex items-center gap-4">
                  <Star className="w-12 h-12 text-purple-400 fill-purple-400" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{t('artifacts.silent_understanding')}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {t('artifacts.silent_understanding_desc')}
                    </p>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">
                        {t('artifacts.progress')}: {part6PerfectCount}/12 {t('artifacts.practices_100')}
                      </div>
                      <div className="text-emerald-400">
                        {t('labels.bonus')}: +50% {t('labels.to_qnt_generation')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Артефакт - Ритм Жизни (только Parts 1-3, пока не взят) */}
          {activeCircuit <= 3 && rhythmProgress < 7 && (
            <div
              onClick={() => {
                setInfoModalMessage(t('artifacts.life_rhythm_alert'));
                setShowInfoModal(true);
              }}
              className={`rounded-2xl p-6 border ${isLight ? 'backdrop-blur-xl shadow-lg shadow-indigo-100/60 border-violet-300 bg-white/55' : 'bg-black/40 backdrop-blur-sm border-purple-500/50 bg-purple-500/10'}`}
            >
              <div className="flex items-center gap-4">
                <Star className="w-12 h-12 text-purple-400 fill-purple-400" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{t('artifacts.life_rhythm')}</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {t('artifacts.life_rhythm_desc')}
                  </p>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">
                      {t('artifacts.progress')}: {rhythmProgress}/7 {t('artifacts.days')}
                    </div>
                    <div className="text-emerald-400">
                      {t('labels.bonus')}: +100% {t('labels.to_qnt_generation')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 sm:p-8">
          <h3 className={`text-2xl font-bold mb-6 transition-colors duration-1000 text-center ${
            isLight
              ? partTextStrong
              : activeCircuit === 2
              ? 'text-cyan-300'
              : activeCircuit === 3
              ? 'text-gray-300'
              : activeCircuit === 4
              ? 'text-teal-300'
              : activeCircuit === 5
              ? 'text-slate-300'
              : activeCircuit === 6
              ? 'text-rose-300'
              : 'text-purple-300'
          }`}>
            {t('terra_final.title')}
          </h3>
          <div className="space-y-4">
            <p className={`text-sm sm:text-lg leading-relaxed text-center italic ${isLight ? 'text-slate-600' : 'text-white/90'}`}>
              {t(`terra_final.level_${activeCircuit}.line_1`)}
            </p>
            <p className={`text-sm sm:text-lg leading-relaxed text-center italic ${isLight ? 'text-slate-600' : 'text-white/90'}`}>
              {t(`terra_final.level_${activeCircuit}.line_2`)}
            </p>
            <p className={`text-sm sm:text-lg leading-relaxed text-center italic ${isLight ? 'text-slate-600' : 'text-white/90'}`}>
              {t(`terra_final.level_${activeCircuit}.line_3`)}
            </p>
            {activeCircuit === 2 ? (
              <>
                <p className={`text-sm sm:text-lg leading-relaxed text-center italic ${isLight ? 'text-slate-600' : 'text-white/90'}`}>
                  {t('terra_final.level_2.line_4')}
                </p>
                <p className={`text-sm sm:text-lg leading-relaxed text-center italic font-semibold transition-colors duration-1000 ${isLight ? partTextMid : 'text-cyan-200'}`}>
                  {t('terra_final.level_2.line_5')}
                </p>
              </>
            ) : (activeCircuit === 1 || activeCircuit === 3) ? (
              <p className={`text-sm sm:text-lg leading-relaxed text-center italic font-semibold transition-colors duration-1000 ${
                isLight
                  ? partTextMid
                  : activeCircuit === 3
                  ? 'text-gray-200'
                  : 'text-amber-200'
              }`}>
                {t(`terra_final.level_${activeCircuit}.line_4`)}
              </p>
            ) : null}
          </div>

          {/* Next-level button moved out of the lore block to the very
              bottom of the home flow (always visible, not inside the
              Your Journey toggle). See its new home below. */}
        </div>

        {artifacts.length > 0 && (
          <div className="mt-8 mb-12">
            <h3 className="text-2xl font-bold mb-4">{t('artifacts.your_artifacts')}</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {artifacts
                .filter(artifact => {
                  // Скрыть артефакты для частей где circuit.artifact === null
                  if (artifact.circuitId) {
                    const circuit = circuits.find(c => c.id === artifact.circuitId);
                    if (!circuit?.artifact) return false;
                  }
                  return true;
                })
                .map((artifact, idx) => {
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
                } else if (artifact.id === 'calm-power') {
                  artifactName = t('artifacts.calm_power');
                  artifactDesc = t('artifacts.calm_power_desc');
                } else if (artifact.id === 'echo-of-power') {
                  artifactName = t('artifacts.echo_of_power');
                  artifactDesc = t('artifacts.echo_of_power_desc');
                } else if (artifact.id === 'body-language') {
                  artifactName = t('artifacts.body_language');
                  artifactDesc = t('artifacts.body_language_desc');
                } else if (artifact.id === 'silent-understanding') {
                  artifactName = t('artifacts.silent_understanding');
                  artifactDesc = t('artifacts.silent_understanding_desc');
                } else {
                  const circuit = circuits.find(c => c.id === artifact.circuitId);
                  artifactName = circuit?.artifact?.name || artifact.name || 'Artifact';
                  artifactDesc = circuit?.artifact?.requirement || '';
                }
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl p-6 border ${isLight ? 'bg-white/55 backdrop-blur-xl shadow-lg shadow-indigo-100/60 border-amber-300' : 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-amber-600/50'}`}
                  >
                    <Star className="w-8 h-8 text-amber-400 fill-yellow-400 mb-3" />
                    <h4 className="text-lg font-bold mb-1">{artifactName}</h4>
                    <p className="text-sm text-gray-400 mb-2">{artifactDesc}</p>
                    <div className="text-emerald-400">+{artifact.bonus}% OND</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* End of artifacts — close the Your Journey conditional */}
        </>
        )}

        {/* Next-level CTA — always visible at the very bottom of the
            home flow. Was previously inside the lore section (hidden
            when Journey was collapsed); promoted out in spec rev 2 so
            level progression is always one tap away. */}
        {activeCircuit < 12 && (
          <div className="text-center mt-8 mb-4">
            <button
              onClick={() => {
                const nextPart = activeCircuit + 1;
                if (isPartUnlocked(nextPart)) {
                  setActiveCircuit(nextPart);
                  setSelectedLevel(nextPart);
                  const rootElement = document.getElementById('root');
                  if (rootElement) rootElement.scrollTop = 0;
                  document.body.scrollTop = 0;
                  document.documentElement.scrollTop = 0;
                  window.scrollTo(0, 0);
                } else {
                  setInfoModalMessage(t('terra_final.lock_alert'));
                  setShowInfoModal(true);
                }
              }}
              className={`mt-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg backdrop-blur-md ${
                isPartUnlocked(activeCircuit + 1)
                  ? `hover:scale-105 active:scale-95 ${emoTint}`
                  // Locked state: in dark theme keep the original solid grey
                  // pill; in light theme match the outlined "pill" look used
                  // by Voice Check / Face Check / dropdown triggers, just
                  // with a white fill and muted slate text so the disabled
                  // affordance still reads.
                  : isLight
                  ? 'bg-white/85 text-slate-400 border border-slate-300 cursor-not-allowed'
                  : 'bg-gray-600/60 text-gray-400 border-2 border-gray-500/50 cursor-not-allowed'
              }`}
              data-testid="next-level-cta"
            >
              {t('terra_final.button')} {activeCircuit + 1}
            </button>
          </div>
        )}

      </div>
      </div>

      {/* Модальное окно дневника */}
      {showJournalModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto pt-[env(safe-area-inset-top)]">
          <div className={`max-w-4xl w-full max-h-[90vh] rounded-2xl border shadow-2xl my-4 flex flex-col overflow-hidden ${isLight ? 'bg-white text-slate-800 border-violet-200' : 'bg-gradient-to-br from-gray-900 to-black text-white border-indigo-500/30'}`}>
            <div className={`sticky top-0 backdrop-blur-sm border-b p-4 sm:p-6 flex items-center justify-between ${isLight ? 'bg-white/95 border-violet-200' : 'bg-gray-900/95 border-indigo-500/30'}`}>
              <h2 className="text-lg sm:text-2xl font-bold">📖 {t('practices.journal_title')}</h2>
              <button
                onClick={() => setShowJournalModal(false)}
                className={`transition-all ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-gray-400 hover:text-white'}`}
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
                      className={`rounded-lg p-3 sm:p-4 border transition-all ${isLight ? 'bg-white/70 border-violet-200 hover:border-violet-300' : 'bg-black/30 border-purple-500/20 hover:border-purple-400/40'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-base sm:text-lg">{getPracticeName(session.practiceId)}</h3>
                          <p className="text-xs text-gray-400">{formatDate(session.date)}</p>
                        </div>
                        {session.isNewRecord && (
                          <span className="bg-yellow-500/20 text-amber-300 text-xs px-2 py-1 rounded-full border border-amber-500/30">
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
                          <p className="text-gray-400 text-xs">{t('practices.coherence')}</p>
                          <p className="font-bold text-cyan-400">{session.coherenceDelta != null ? `+${Math.round(session.coherenceDelta)}%` : '—'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">{t('journal.reward')}</p>
                          <p className="font-bold text-amber-400">+{session.qnt} OND</p>
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
          <div className={`max-w-6xl w-full max-h-[90vh] overflow-y-auto no-scrollbar rounded-2xl border shadow-2xl my-4 ${isLight ? 'bg-white text-slate-800 border-violet-200' : 'bg-gradient-to-br from-gray-900 to-black text-white border-cyan-500/30'}`}>
            <div className={`sticky top-0 backdrop-blur-sm border-b p-4 sm:p-6 flex items-center justify-between ${isLight ? 'bg-white/95 border-violet-200' : 'bg-gray-900/95 border-cyan-500/30'}`}>
              <h2 className="text-lg sm:text-2xl font-bold">{t('stats.title')}</h2>
              <button
                onClick={() => setShowStatsModal(false)}
                className={`transition-all ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-gray-400 hover:text-white'}`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className={`rounded-lg p-4 border ${isLight ? 'bg-white/70 border-violet-200' : 'bg-black/30 border-purple-500/20'}`}>
                  <p className="text-gray-400 text-sm mb-1">{t('stats.total_qnt')}</p>
                  <p className="text-3xl font-bold">{practiceHistory.length}</p>
                </div>
                <div className={`rounded-lg p-4 border ${isLight ? 'bg-white/70 border-violet-200' : 'bg-black/30 border-purple-500/20'}`}>
                  <p className="text-gray-400 text-sm mb-1">{t('stats.time_in_practices')}</p>
                  <p className="text-3xl font-bold">
                    {Math.floor(getTotalTime() / 3600)}{t('stats.hours_short')} {Math.floor((getTotalTime() % 3600) / 60)}{t('stats.minutes_short')}
                  </p>
                </div>
                <div className={`rounded-lg p-4 border ${isLight ? 'bg-white/70 border-violet-200' : 'bg-black/30 border-purple-500/20'}`}>
                  <p className="text-gray-400 text-sm mb-1">{t('stats.avg_quality')}</p>
                  <p className="text-3xl font-bold text-emerald-400">{safeToFixed(getAverageQuality(), 0)}%</p>
                </div>
                <div className={`rounded-lg p-4 border ${isLight ? 'bg-white/70 border-violet-200' : 'bg-black/30 border-purple-500/20'}`}>
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
                            ? isLight ? 'bg-amber-50 border-amber-300' : 'bg-yellow-500/10 border-amber-600/30'
                            : isLight ? 'bg-white/70 border-slate-200' : 'bg-black/30 border-gray-600/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`text-4xl ${isUnlocked ? '' : 'grayscale opacity-40'}`}>
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-semibold mb-1 ${isUnlocked ? 'text-amber-300' : 'text-gray-400'}`}>
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
                              <span className="inline-block mt-2 text-xs bg-yellow-500/20 text-amber-300 px-2 py-1 rounded-full">
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
                  <div className={`rounded-lg p-4 border ${isLight ? 'bg-indigo-500/15 border-indigo-400/40' : 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-amber-600/30'}`}>
                    <div className="text-3xl mb-2">💰</div>
                    <p className="text-sm text-gray-400 mb-1">{t('stats.bonus_qnt')}</p>
                    <p className="text-2xl font-bold text-amber-400">+{unlockedAchievements.length * 50} OND</p>
                  </div>
                  <div className={`rounded-lg p-4 border ${isLight ? 'bg-indigo-500/15 border-indigo-400/40' : 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30'}`}>
                    <div className="text-3xl mb-2">⭐</div>
                    <p className="text-sm text-gray-400 mb-1">{t('stats.special_artifacts')}</p>
                    <p className="text-2xl font-bold text-purple-400">{artifacts.length}/{circuits.length}</p>
                  </div>
                  <div className={`rounded-lg p-4 border ${isLight ? 'bg-indigo-500/15 border-indigo-400/40' : 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30'}`}>
                    <div className="text-3xl mb-2">🎯</div>
                    <p className="text-sm text-gray-400 mb-1">{t('stats.achievements_progress')}</p>
                    <p className="text-2xl font-bold text-cyan-400">{Math.round((unlockedAchievements.length / achievements.length) * 100)}%</p>
                  </div>
                </div>
              </div>

              {/* Звания игрока */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">🏅 {t('stats.player_title')}</h3>
                <div className={`rounded-lg p-6 border ${isLight ? 'bg-white/70 border-violet-200' : 'bg-black/30 border-purple-500/20'}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-6xl">{getPlayerRank().icon}</div>
                    <div>
                      <h4 className="text-3xl font-bold mb-2">{getPlayerRank().name}</h4>
                      <p className={isLight ? 'text-slate-500' : 'text-white/80'}>{t('stats.practices_count')}: {practiceHistory.length} | {t('stats.time_short')}: {Math.floor(getTotalTime() / 3600)}{t('stats.hours_short')}</p>
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
                      <div key={idx} className={`text-center p-3 rounded border transition-all ${practiceHistory.length >= rank.min ? 'bg-indigo-500/15 border-indigo-400/40' : isLight ? 'bg-slate-100 border-slate-200 opacity-50' : 'bg-black/20 border-gray-600/20 opacity-40'}`}>
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
                <div className={`rounded-lg p-6 border ${isLight ? 'bg-white/70 border-violet-200' : 'bg-black/30 border-purple-500/20'}`}>
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
                <div className={`rounded-lg p-6 border ${isLight ? 'bg-white/70 border-violet-200' : 'bg-black/30 border-purple-500/20'}`}>
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
                              dayPractices === 0 ? (isLight ? 'bg-slate-200' : 'bg-gray-800') :
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
          <div className={`max-w-6xl w-full max-h-[90vh] overflow-y-auto no-scrollbar rounded-2xl border shadow-2xl my-4 ${isLight ? 'bg-white text-slate-800 border-violet-200' : 'bg-gradient-to-br from-gray-900 to-black text-white border-cyan-500/30'}`}>
            <div className={`sticky top-0 backdrop-blur-sm border-b p-4 sm:p-6 flex items-center justify-between ${isLight ? 'bg-white/95 border-violet-200' : 'bg-gray-900/95 border-cyan-500/30'}`}>
              <h2 className="text-lg sm:text-2xl font-bold">{t('leaderboard.title')}</h2>
              <button
                onClick={() => setShowRatingModal(false)}
                className={`transition-all ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-gray-400 hover:text-white'}`}
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
                            ? 'bg-indigo-500/15 border-indigo-400/50 shadow-lg shadow-indigo-500/20'
                            : isLight ? 'bg-white/70 border-slate-200 hover:border-slate-300' : 'bg-black/30 border-gray-700/30 hover:border-gray-600/50'
                        }`}
                      >
                        <div className={`text-lg sm:text-2xl font-bold w-6 sm:w-8 ${idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm sm:text-base">{player.name}</div>
                        </div>
                        <div className="text-amber-400 font-mono font-bold text-sm sm:text-lg">
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
                            ? 'bg-indigo-500/15 border-indigo-400/50 shadow-lg shadow-indigo-500/20'
                            : isLight ? 'bg-white/70 border-slate-200 hover:border-slate-300' : 'bg-black/30 border-gray-700/30 hover:border-gray-600/50'
                        }`}
                      >
                        <div className={`text-lg sm:text-2xl font-bold w-6 sm:w-8 ${idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
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
                            ? 'bg-indigo-500/15 border-indigo-400/50 shadow-lg shadow-indigo-500/20'
                            : isLight ? 'bg-white/70 border-slate-200 hover:border-slate-300' : 'bg-black/30 border-gray-700/30 hover:border-gray-600/50'
                        }`}
                      >
                        <div className={`text-lg sm:text-2xl font-bold w-6 sm:w-8 ${idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
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
                          className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-all ${isLight ? 'bg-white/70 border-slate-200 hover:border-slate-300' : 'bg-black/30 border-gray-700/30 hover:border-gray-600/50'}`}
                        >
                          <div className={`text-lg sm:text-2xl font-bold w-6 sm:w-8 ${idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm sm:text-base">{practice.practice_name}</div>
                            <div className="text-xs text-gray-400">
                              {practice.total_sessions} {t('leaderboard.sessions')}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-amber-400">
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
        />
      )}

      {showProfileModal && user && (
        <UserProfile
          user={user}
          profile={userProfile}
          onClose={() => setShowProfileModal(false)}
          onProfileUpdate={(updatedProfile) => {
            setUserProfile(updatedProfile);
          }}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
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

      {showNotificationPrimer && (
        <NotificationPrimerModal
          isOpen={showNotificationPrimer}
          onClose={() => setShowNotificationPrimer(false)}
        />
      )}

      {showConnectionModal && (
        <ConnectionModal
          onClose={() => setShowConnectionModal(false)}
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
      />

      <VoiceCheckModal
        isOpen={showVoiceCheck}
        onClose={() => setShowVoiceCheck(false)}
        onOndEarned={(amount) => setQnt(prev => prev + amount)}
      />

      {showFaceCheck && (
        <Suspense fallback={null}>
          <FaceCheckScreen
            onClose={() => setShowFaceCheck(false)}
            onOndEarned={(amount) => setQnt(prev => prev + amount)}
          />
        </Suspense>
      )}

      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        message={infoModalMessage}
      />

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        activeCircuit={activeCircuit}
        source={paywallSource ?? undefined}
        onSubscribed={async () => {
          await refreshSubscription();
        }}
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
              className={`flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-full backdrop-blur-md transition-all text-left border w-full bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 ${isLight ? 'text-slate-800' : 'text-white'}`}
              style={{ boxShadow: isLight ? '0 8px 24px rgba(99,102,241,0.12)' : '0 8px 32px rgba(0,0,0,0.4)' }}
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
              className={`flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-full backdrop-blur-md transition-all text-left border w-full bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 ${isLight ? 'text-slate-800' : 'text-white'}`}
              style={{ boxShadow: isLight ? '0 8px 24px rgba(99,102,241,0.12)' : '0 8px 32px rgba(0,0,0,0.4)' }}
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
              className={`flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-full backdrop-blur-md transition-all text-left border w-full bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 ${isLight ? 'text-slate-800' : 'text-white'}`}
              style={{ boxShadow: isLight ? '0 8px 24px rgba(99,102,241,0.12)' : '0 8px 32px rgba(0,0,0,0.4)' }}
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
              className={`flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-full backdrop-blur-md transition-all text-left border w-full bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 ${isLight ? 'text-slate-800' : 'text-white'}`}
              style={{ boxShadow: isLight ? '0 8px 24px rgba(99,102,241,0.12)' : '0 8px 32px rgba(0,0,0,0.4)' }}
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
              className={`flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-full backdrop-blur-md transition-all text-left border w-full bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 ${isLight ? 'text-slate-800' : 'text-white'}`}
              style={{ boxShadow: isLight ? '0 8px 24px rgba(99,102,241,0.12)' : '0 8px 32px rgba(0,0,0,0.4)' }}
              data-testid="menu-item-ond-balance"
            >
              <Star className="w-6 h-6 text-amber-400" />
              <span className="font-medium">OND</span>
              <span className="ml-auto text-sm sm:text-base text-amber-400 font-medium">{safeToFixed(qnt, 1)}</span>
            </button>

            {/* Рейтинг */}
            <button
              onClick={() => {
                setShowRatingModal(true);
                setShowMenu(false);
              }}
              className={`flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-full backdrop-blur-md transition-all text-left border w-full bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 ${isLight ? 'text-slate-800' : 'text-white'}`}
              style={{ boxShadow: isLight ? '0 8px 24px rgba(99,102,241,0.12)' : '0 8px 32px rgba(0,0,0,0.4)' }}
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
              className={`flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-full backdrop-blur-md transition-all text-left border w-full bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 ${isLight ? 'text-slate-800' : 'text-white'}`}
              style={{ boxShadow: isLight ? '0 8px 24px rgba(99,102,241,0.12)' : '0 8px 32px rgba(0,0,0,0.4)' }}
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
                // Settings is reachable without an account so anonymous
                // free-tier users can still configure local notifications
                // (Reminders section). Profile-section gracefully degrades
                // when user is null.
                setShowSettingsModal(true);
                setShowMenu(false);
              }}
              className={`flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-full backdrop-blur-md transition-all text-left border w-full bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 ${isLight ? 'text-slate-800' : 'text-white'}`}
              style={{ boxShadow: isLight ? '0 8px 24px rgba(99,102,241,0.12)' : '0 8px 32px rgba(0,0,0,0.4)' }}
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
              className={`flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-full backdrop-blur-md transition-all text-left border w-full bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 ${isLight ? 'text-slate-800' : 'text-white'}`}
              style={{ boxShadow: isLight ? '0 8px 24px rgba(99,102,241,0.12)' : '0 8px 32px rgba(0,0,0,0.4)' }}
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
                className={`flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-full backdrop-blur-md transition-all text-left border w-full bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 ${isLight ? 'text-slate-800' : 'text-white'}`}
                style={{ boxShadow: isLight ? '0 8px 24px rgba(99,102,241,0.12)' : '0 8px 32px rgba(0,0,0,0.4)' }}
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
                className={`flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-full backdrop-blur-md transition-all text-left border w-full bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 ${isLight ? 'text-slate-800' : 'text-white'}`}
                style={{ boxShadow: isLight ? '0 8px 24px rgba(99,102,241,0.12)' : '0 8px 32px rgba(0,0,0,0.4)' }}
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