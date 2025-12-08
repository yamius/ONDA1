import { useState, useEffect } from 'react';
import { X, Bluetooth, Moon, Heart, Wind, Activity, Zap, CheckCircle, AlertCircle, Clock, Calendar, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import { HealthConnectCompactPanel } from './HealthConnectCompactPanel';
import type { HealthConnectHook } from '../hooks/useHealthConnect';
import { useLifeRhythm } from '../hooks/useLifeRhythm';

interface HealthKitHeartRateData {
  heartRate: number | null;
  isAvailable: boolean | null;
  isAuthorized: boolean | null;
  requestPermission: () => Promise<void>;
  startMonitoring: (mode: 'direct' | 'workout' | 'realtime') => Promise<void>;
  stopMonitoring: () => void;
  error: string | null;
  isMonitoring: boolean;
  mode: 'direct' | 'workout' | 'realtime' | null;
  lastUpdated: Date | null;
}

interface HealthKitDataFull {
  data: any;
  isLoading: boolean;
  refresh: () => void;
  requestPermission: () => Promise<void>;
  startAutoRefresh: (interval: number) => void;
  stopAutoRefresh: () => void;
  isAvailable?: boolean;
  isAuthorized?: boolean;
}

interface ConnectionModalProps {
  onClose: () => void;
  isLightTheme: boolean;
  vitalsData: {
    connected: boolean;
    connect: () => void;
    disconnect: () => void;
    hr: number | null;
    hrSource?: 'ble' | 'notification' | 'healthkit' | 'watch' | null;
    br: number | null;
    stress: number | null;
    energy: number | null;
    hrv: number | null;
    csi: number | null;
    recoveryRate: number | null;
    hrTrendSlope: number | null;
    hrAcceleration: number | null;
    arousal: number | null;
    calm: number | null;
    focus: number | null;
    excitement: number | null;
    fatigue: number | null;
    flow: number | null;
    isScanning?: boolean;
    availableDevices?: Array<{ id: string; name: string }>;
    connectToDevice?: (deviceId: string) => void;
    stopScan?: () => void;
    platform?: 'android' | 'web';
  };
  healthConnectData: HealthConnectHook;
  healthKitHeartRateData: HealthKitHeartRateData;
  healthKitDataFull: HealthKitDataFull;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  onClose,
  isLightTheme,
  vitalsData,
  healthConnectData,
  healthKitHeartRateData,
  healthKitDataFull,
}) => {
  const { t } = useTranslation();
  const { 
    connected, connect, disconnect, hr, hrSource, br, stress, energy, hrv,
    csi, recoveryRate, hrTrendSlope, hrAcceleration,
    arousal, calm, focus, excitement, fatigue, flow,
    isScanning, availableDevices, connectToDevice, stopScan, platform: vitalsPlat
  } = vitalsData;
  const { connected: hcConnected, connect: hcConnect, disconnect: hcDisconnect } = healthConnectData;
  
  const capacitorPlatform = Capacitor.getPlatform();
  const isIOS = capacitorPlatform === 'ios';
  const isAndroid = capacitorPlatform === 'android';
  const showBluetooth = !isIOS;
  
  // Use HealthKit data from parent component (persists when modal closes)
  const {
    heartRate: hkHeartRate,
    isAvailable: hkIsAvailable,
    isAuthorized: hkIsAuthorized,
    requestPermission: hkRequestPermission,
    startMonitoring: hkStartMonitoring,
    stopMonitoring: hkStopMonitoring,
    error: hkError,
    isMonitoring: hkIsMonitoring,
    mode: hkMode
  } = healthKitHeartRateData;
  
  const {
    data: hkData,
    refresh: hkRefresh,
    requestPermission: hkRequestFullPermission,
    startAutoRefresh: hkStartAutoRefresh,
    stopAutoRefresh: hkStopAutoRefresh
  } = healthKitDataFull;
  
  const [hkConnecting, setHkConnecting] = useState(false);
  const [hkAttempted, setHkAttempted] = useState(false);
  
  const { metrics: lifeRhythmMetrics, syncFromHealthKit, history: sleepHistory } = useLifeRhythm();

  const handleHealthKitConnect = async (mode: 'direct' | 'workout' | 'realtime') => {
    setHkConnecting(true);
    setHkAttempted(false);
    try {
      // Request full permissions first (includes sleep, activity, etc.)
      await hkRequestFullPermission();
      // Then request HR monitoring permission
      await hkRequestPermission();
      await hkStartMonitoring(mode);
      hkStartAutoRefresh(30000);
    } catch (err) {
      console.error('[HealthKit] Connection error:', err);
    } finally {
      setHkConnecting(false);
      setHkAttempted(true);
    }
  };
  
  useEffect(() => {
    if (hkIsMonitoring && !hkData) {
      hkRefresh();
    }
  }, [hkIsMonitoring, hkData, hkRefresh]);
  
  useEffect(() => {
    if (hkData) {
      syncFromHealthKit(hkData);
    }
  }, [hkData, syncFromHealthKit]);

  const handleHealthKitDisconnect = () => {
    hkStopMonitoring();
    hkStopAutoRefresh();
    setHkAttempted(false);
  };
  
  const hkIsConnected = hkIsAuthorized === true && hkIsMonitoring;
  const hkShowSuccess = hkAttempted && hkIsConnected && !hkError;
  const hkAvailabilityChecked = hkIsAvailable !== null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
      <div
        className={`max-w-md w-full h-[calc(100vh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-3rem)] rounded-2xl border relative flex flex-col ${
          isLightTheme
            ? 'bg-white border-gray-300'
            : 'bg-gradient-to-br from-gray-900 to-black border-purple-500/30'
        }`}
      >
        <div className={`sticky top-0 z-10 pt-6 px-6 sm:pt-8 sm:px-8 pb-4 rounded-t-2xl ${
          isLightTheme
            ? 'bg-white'
            : 'bg-gradient-to-br from-gray-900 to-gray-900'
        }`}>
          <button
            onClick={onClose}
            className={`absolute right-4 p-2 rounded-full transition-all ${
              isAndroid ? 'top-8' : 'top-4'
            } ${
              isLightTheme ? 'hover:bg-gray-200' : 'hover:bg-white/10'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-light mb-2">{t('connection.title', 'Connection')}</h2>
            <p className={`text-xs sm:text-sm ${isLightTheme ? 'text-gray-600' : 'text-white/70'}`}>
              {t('connection.subtitle', 'Connect your health devices and trackers')}
            </p>
          </div>
        </div>

        <div 
          className="flex-1 overflow-y-auto px-6 pb-6 sm:px-8 sm:pb-8 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="space-y-6">
          {/* Apple HealthKit Section (iOS only) */}
          {isIOS && (
            <div>
              <h3 className={`text-sm font-semibold mb-3 ${
                isLightTheme ? 'text-gray-700' : 'text-white/80'
              }`}>
                {t('connection.healthkit', 'Apple HealthKit')}
              </h3>
              <p className={`text-xs mb-3 ${
                isLightTheme ? 'text-gray-600' : 'text-white/60'
              }`}>
                {t('connection.healthkit_desc', 'Connect Apple Watch and fitness trackers via HealthKit for heart rate monitoring')}
              </p>
              
              {!hkIsMonitoring ? (
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => handleHealthKitConnect('realtime')}
                    disabled={hkConnecting}
                    className={`flex-1 py-3 px-3 rounded-xl font-medium transition-all flex flex-col items-center justify-center gap-1 ${
                      hkConnecting
                        ? isLightTheme
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-white/10 text-white/50'
                        : isLightTheme
                        ? 'bg-green-100 hover:bg-green-200 text-green-700'
                        : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                    }`}
                    data-testid="button-connect-healthkit-realtime"
                  >
                    <Zap className="w-5 h-5" />
                    <span className="text-sm">{t('connection.healthkit_realtime', 'Real-time')}</span>
                    <span className={`text-[10px] ${isLightTheme ? 'text-green-600' : 'text-green-300'}`}>
                      instant
                    </span>
                  </button>
                  <button
                    onClick={() => handleHealthKitConnect('direct')}
                    disabled={hkConnecting}
                    className={`flex-1 py-3 px-3 rounded-xl font-medium transition-all flex flex-col items-center justify-center gap-1 ${
                      hkConnecting
                        ? isLightTheme
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-white/10 text-white/50'
                        : isLightTheme
                        ? 'bg-pink-100 hover:bg-pink-200 text-pink-700'
                        : 'bg-pink-500/20 hover:bg-pink-500/30 text-pink-400'
                    }`}
                    data-testid="button-connect-healthkit-direct"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">{t('connection.healthkit_direct', 'Direct')}</span>
                    <span className={`text-[10px] ${isLightTheme ? 'text-pink-600' : 'text-pink-300'}`}>
                      1.5s
                    </span>
                  </button>
                  <button
                    onClick={() => handleHealthKitConnect('workout')}
                    disabled={hkConnecting}
                    className={`flex-1 py-3 px-3 rounded-xl font-medium transition-all flex flex-col items-center justify-center gap-1 ${
                      hkConnecting
                        ? isLightTheme
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-white/10 text-white/50'
                        : isLightTheme
                        ? 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                        : 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400'
                    }`}
                    data-testid="button-connect-healthkit-workout"
                  >
                    <Activity className="w-5 h-5" />
                    <span className="text-sm">{t('connection.healthkit_workout', 'Workout')}</span>
                    <span className={`text-[10px] ${isLightTheme ? 'text-orange-600' : 'text-orange-300'}`}>
                      5s
                    </span>
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mb-3">
                  <div className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 ${
                    isLightTheme ? 'bg-green-100 text-green-700' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {hkMode === 'realtime' ? <Zap className="w-5 h-5" /> : 
                     hkMode === 'direct' ? <Heart className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                    <span className="font-medium">
                      {hkMode === 'realtime' ? 'Real-time' : hkMode === 'direct' ? 'Direct' : 'Workout'}
                    </span>
                  </div>
                  <button
                    onClick={handleHealthKitDisconnect}
                    className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      isLightTheme
                        ? 'bg-red-100 hover:bg-red-200 text-red-700'
                        : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                    }`}
                    data-testid="button-disconnect-healthkit"
                  >
                    <X className="w-5 h-5" />
                    {t('settings.stop', 'Stop')}
                  </button>
                </div>
              )}

              {hkError && (
                <div className={`flex items-center gap-2 p-3 rounded-lg mb-3 ${
                  isLightTheme ? 'bg-red-100 text-red-700' : 'bg-red-500/20 text-red-400'
                }`}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs">{hkError}</span>
                </div>
              )}

              {hkShowSuccess && (
                <div className={`flex items-center gap-2 p-3 rounded-lg mb-3 ${
                  isLightTheme ? 'bg-green-100 text-green-700' : 'bg-green-500/20 text-green-400'
                }`}>
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs">{t('connection.healthkit_success', 'Successfully connected to HealthKit')}</span>
                </div>
              )}

              {/* Show iOS Vitals Panel when monitoring */}
              {hkIsMonitoring && (
                <div className={`mt-4 p-4 rounded-xl ${
                  isLightTheme ? 'bg-gray-100' : 'bg-white/5'
                }`}>
                  <h4 className={`text-sm font-semibold mb-3 text-center ${
                    isLightTheme ? 'text-gray-700' : 'text-white/70'
                  }`}>
                    {t('settings.basic_metrics', 'Basic Metrics')}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${
                      isLightTheme ? 'bg-white' : 'bg-white/5'
                    }`}>
                      <Heart className={`w-5 h-5 ${hr ? 'text-red-500 animate-pulse' : 'text-red-500'}`} />
                      <div>
                        <div className={`text-xs ${isLightTheme ? 'text-gray-600' : 'text-white/60'}`}>
                          {t('settings.heart_rate', 'Heart Rate')}
                        </div>
                        <div className="text-lg font-semibold">
                          {hr ?? '--'} bpm
                        </div>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 p-3 rounded-lg ${
                      isLightTheme ? 'bg-white' : 'bg-white/5'
                    }`}>
                      <Wind className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className={`text-xs ${isLightTheme ? 'text-gray-600' : 'text-white/60'}`}>
                          {t('settings.breathing', 'Breathing')}
                        </div>
                        <div className="text-lg font-semibold">{hr && br ? `${br.toFixed(1)}` : '--'} /min</div>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 p-3 rounded-lg ${
                      isLightTheme ? 'bg-white' : 'bg-white/5'
                    }`}>
                      <Activity className="w-5 h-5 text-orange-500" />
                      <div>
                        <div className={`text-xs ${isLightTheme ? 'text-gray-600' : 'text-white/60'}`}>
                          {t('settings.stress', 'Stress')}
                        </div>
                        <div className="text-lg font-semibold">{hr && stress !== null ? `${stress}%` : '--%'}</div>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 p-3 rounded-lg ${
                      isLightTheme ? 'bg-white' : 'bg-white/5'
                    }`}>
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <div>
                        <div className={`text-xs ${isLightTheme ? 'text-gray-600' : 'text-white/60'}`}>
                          {t('settings.energy', 'Energy')}
                        </div>
                        <div className="text-lg font-semibold">{hr && energy !== null ? `${energy}%` : '--%'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Physiological Metrics for iOS */}
                  <div className="mt-6">
                    <h4 className={`text-base font-semibold mb-4 text-center ${
                      isLightTheme ? 'text-gray-800' : 'text-white'
                    }`}>
                      {t('settings.advanced_metrics', 'Advanced Physiological Metrics')}
                    </h4>
                    <div className="space-y-2">
                      <div className={`flex items-center justify-between p-4 rounded-xl ${
                        isLightTheme ? 'bg-white' : 'bg-white/5'
                      }`}>
                        <div>
                          <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                            {t('settings.hrv_surrogate', 'HRV surrogate')}
                          </div>
                        </div>
                        <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                          {hr && hrv !== null ? `${hrv}` : '--'}
                        </div>
                      </div>

                      <div className={`flex items-center justify-between p-4 rounded-xl ${
                        isLightTheme ? 'bg-white' : 'bg-white/5'
                      }`}>
                        <div>
                          <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                            {t('settings.cardiac_stability', 'Cardiac Stability Index')}
                          </div>
                        </div>
                        <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                          {hr && csi !== null ? csi.toFixed(2) : '--'}
                        </div>
                      </div>

                      <div className={`flex items-center justify-between p-4 rounded-xl ${
                        isLightTheme ? 'bg-white' : 'bg-white/5'
                      }`}>
                        <div>
                          <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                            {t('settings.recovery_rate', 'Recovery Rate')}
                          </div>
                        </div>
                        <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                          {hr && recoveryRate !== null ? `${(recoveryRate * 100).toFixed(0)}%` : '--'}
                        </div>
                      </div>

                      <div className={`flex items-center justify-between p-4 rounded-xl ${
                        isLightTheme ? 'bg-white' : 'bg-white/5'
                      }`}>
                        <div>
                          <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                            {t('settings.hr_trend_slope', 'HR trend slope')}
                          </div>
                        </div>
                        <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                          {hr && hrTrendSlope !== null ? hrTrendSlope.toFixed(2) : '--'}
                        </div>
                      </div>

                      <div className={`flex items-center justify-between p-4 rounded-xl ${
                        isLightTheme ? 'bg-white' : 'bg-white/5'
                      }`}>
                        <div>
                          <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                            {t('settings.hr_acceleration', 'HR Acceleration')}
                          </div>
                        </div>
                        <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                          {hr && hrAcceleration !== null ? hrAcceleration.toFixed(2) : '--'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Emotional State Metrics for iOS */}
                  <div className="mt-6">
                    <h4 className={`text-base font-semibold mb-4 text-center ${
                      isLightTheme ? 'text-gray-800' : 'text-white'
                    }`}>
                      {t('settings.emotional_metrics', 'Emotional State Metrics')}
                    </h4>
                    <div className="space-y-2">
                      <div className={`flex items-center justify-between p-4 rounded-xl ${
                        isLightTheme ? 'bg-white' : 'bg-white/5'
                      }`}>
                        <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                          {t('settings.alarm_anxiety', 'Alarm / Anxiety')}
                        </div>
                        <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                          {hr && arousal !== null ? `${arousal}%` : '--'}
                        </div>
                      </div>

                      <div className={`flex items-center justify-between p-4 rounded-xl ${
                        isLightTheme ? 'bg-white' : 'bg-white/5'
                      }`}>
                        <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                          {t('settings.relaxation_calmness', 'Relaxation / Calmness')}
                        </div>
                        <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                          {hr && calm !== null ? `${calm}%` : '--'}
                        </div>
                      </div>

                      <div className={`flex items-center justify-between p-4 rounded-xl ${
                        isLightTheme ? 'bg-white' : 'bg-white/5'
                      }`}>
                        <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                          {t('settings.focus_concentration', 'Focus / Concentration')}
                        </div>
                        <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                          {hr && focus !== null ? `${focus}%` : '--'}
                        </div>
                      </div>

                      <div className={`flex items-center justify-between p-4 rounded-xl ${
                        isLightTheme ? 'bg-white' : 'bg-white/5'
                      }`}>
                        <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                          {t('settings.excitement', 'Excitement')}
                        </div>
                        <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                          {hr && excitement !== null ? `${excitement}%` : '--'}
                        </div>
                      </div>

                      <div className={`flex items-center justify-between p-4 rounded-xl ${
                        isLightTheme ? 'bg-white' : 'bg-white/5'
                      }`}>
                        <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                          {t('settings.fatigue_label', 'Fatigue')}
                        </div>
                        <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                          {hr && fatigue !== null ? `${fatigue}%` : '--'}
                        </div>
                      </div>

                      <div className={`flex items-center justify-between p-4 rounded-xl ${
                        isLightTheme ? 'bg-white' : 'bg-white/5'
                      }`}>
                        <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                          {t('settings.flow_label', 'Flow')}
                        </div>
                        <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                          {hr && flow !== null ? `${flow}%` : '--'}
                        </div>
                      </div>
                    </div>

                    <div className={`mt-4 text-center text-xs ${
                      isLightTheme ? 'text-gray-500' : 'text-white/40'
                    }`}>
                      {t('settings.calibrating', 'Real-time metrics. Calibrating baseline...')}
                    </div>
                  </div>

                  {/* Life Rhythm Section */}
                  <div className="mt-6">
                    <h4 className={`text-base font-semibold mb-4 text-center ${
                      isLightTheme ? 'text-gray-800' : 'text-white'
                    }`}>
                      {t('settings.life_rhythm', 'Life Rhythm')}
                    </h4>
                    
                    {sleepHistory.length === 0 ? (
                      <div className={`p-4 rounded-xl text-center ${
                        isLightTheme ? 'bg-gray-100' : 'bg-white/5'
                      }`}>
                        <Moon className={`w-8 h-8 mx-auto mb-2 ${
                          isLightTheme ? 'text-gray-400' : 'text-white/40'
                        }`} />
                        <p className={`text-sm ${
                          isLightTheme ? 'text-gray-600' : 'text-white/60'
                        }`}>
                          {t('settings.no_sleep_data', 'No sleep data yet. Wear your Apple Watch while sleeping to track your rhythm.')}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Overall Score */}
                        <div className={`flex items-center justify-between p-4 rounded-xl ${
                          isLightTheme ? 'bg-white' : 'bg-white/5'
                        }`}>
                          <div className="flex items-center gap-3">
                            <TrendingUp className={`w-5 h-5 ${
                              (lifeRhythmMetrics?.overallScore ?? 0) >= 70 ? 'text-green-500' :
                              (lifeRhythmMetrics?.overallScore ?? 0) >= 40 ? 'text-yellow-500' : 'text-red-500'
                            }`} />
                            <span className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                              {t('settings.rhythm_score', 'Rhythm Score')}
                            </span>
                          </div>
                          <div className={`font-semibold text-lg ${
                            (lifeRhythmMetrics?.overallScore ?? 0) >= 70 ? 'text-green-500' :
                            (lifeRhythmMetrics?.overallScore ?? 0) >= 40 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                            {lifeRhythmMetrics?.overallScore ?? '--'}%
                          </div>
                        </div>

                        {/* Sleep Regularity */}
                        <div className={`flex items-center justify-between p-4 rounded-xl ${
                          isLightTheme ? 'bg-white' : 'bg-white/5'
                        }`}>
                          <div className="flex items-center gap-3">
                            <Moon className="w-5 h-5 text-indigo-500" />
                            <div>
                              <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                                {t('settings.sleep_regularity', 'Sleep Regularity')}
                              </div>
                              <div className={`text-xs ${isLightTheme ? 'text-gray-500' : 'text-white/50'}`}>
                                {t('settings.avg_bedtime', 'Avg bedtime')}: {lifeRhythmMetrics?.avgSleepTime ?? '--:--'}
                              </div>
                            </div>
                          </div>
                          <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                            {lifeRhythmMetrics?.sleepRegularity ?? '--'}%
                          </div>
                        </div>

                        {/* Wake Regularity */}
                        <div className={`flex items-center justify-between p-4 rounded-xl ${
                          isLightTheme ? 'bg-white' : 'bg-white/5'
                        }`}>
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-orange-500" />
                            <div>
                              <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                                {t('settings.wake_regularity', 'Wake Regularity')}
                              </div>
                              <div className={`text-xs ${isLightTheme ? 'text-gray-500' : 'text-white/50'}`}>
                                {t('settings.avg_wake', 'Avg wake')}: {lifeRhythmMetrics?.avgWakeTime ?? '--:--'}
                              </div>
                            </div>
                          </div>
                          <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                            {lifeRhythmMetrics?.wakeRegularity ?? '--'}%
                          </div>
                        </div>

                        {/* Duration Score */}
                        <div className={`flex items-center justify-between p-4 rounded-xl ${
                          isLightTheme ? 'bg-white' : 'bg-white/5'
                        }`}>
                          <div className="flex items-center gap-3">
                            <Activity className="w-5 h-5 text-blue-500" />
                            <div>
                              <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                                {t('settings.duration_score', 'Sleep Duration')}
                              </div>
                              <div className={`text-xs ${isLightTheme ? 'text-gray-500' : 'text-white/50'}`}>
                                {t('settings.avg_duration', 'Avg')}: {lifeRhythmMetrics?.avgDurationHours ?? '--'}h
                              </div>
                            </div>
                          </div>
                          <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                            {lifeRhythmMetrics?.durationScore ?? '--'}%
                          </div>
                        </div>

                        {/* Streak */}
                        <div className={`flex items-center justify-between p-4 rounded-xl ${
                          isLightTheme ? 'bg-white' : 'bg-white/5'
                        }`}>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-purple-500" />
                            <span className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                              {t('settings.streak', 'Streak')}
                            </span>
                          </div>
                          <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                            {lifeRhythmMetrics?.streak ?? 0} {t('settings.days', 'days')}
                          </div>
                        </div>

                        {/* Last Night Quality */}
                        {lifeRhythmMetrics?.lastNightQuality && (
                          <div className={`flex items-center justify-between p-4 rounded-xl ${
                            isLightTheme ? 'bg-white' : 'bg-white/5'
                          }`}>
                            <span className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                              {t('settings.last_night', 'Last Night')}
                            </span>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              lifeRhythmMetrics.lastNightQuality === 'excellent' ? 'bg-green-500/20 text-green-400' :
                              lifeRhythmMetrics.lastNightQuality === 'good' ? 'bg-blue-500/20 text-blue-400' :
                              lifeRhythmMetrics.lastNightQuality === 'fair' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {lifeRhythmMetrics.lastNightQuality === 'excellent' ? t('settings.excellent', 'Excellent') :
                               lifeRhythmMetrics.lastNightQuality === 'good' ? t('settings.good', 'Good') :
                               lifeRhythmMetrics.lastNightQuality === 'fair' ? t('settings.fair', 'Fair') :
                               t('settings.poor', 'Poor')}
                            </div>
                          </div>
                        )}

                        <div className={`mt-2 text-center text-xs ${
                          isLightTheme ? 'text-gray-500' : 'text-white/40'
                        }`}>
                          {t('settings.sleep_history_count', 'Based on {{count}} nights', { count: sleepHistory.length })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {hkAvailabilityChecked && hkIsAvailable === false && (
                <div className={`p-3 rounded-lg text-xs ${
                  isLightTheme ? 'bg-yellow-100 text-yellow-700' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {t('connection.healthkit_not_available', 'HealthKit is not available on this device')}
                </div>
              )}
            </div>
          )}

          {/* Health Connect Section (Android) */}
          {isAndroid && (
            <div>
              <h3 className={`text-sm font-semibold mb-3 ${
                isLightTheme ? 'text-gray-700' : 'text-white/80'
              }`}>
                {t('connection.health_connect', 'Health Connect')}
              </h3>
              <p className={`text-xs mb-3 ${
                isLightTheme ? 'text-gray-600' : 'text-white/60'
              }`}>
                {t('connection.health_connect_desc', 'Read health data from Google Health Connect')}
              </p>
              
              <div className="flex gap-3 mb-3">
                <button
                  onClick={hcConnect}
                  disabled={hcConnected}
                  className={`${hcConnected ? 'flex-1' : 'w-full'} py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-3 ${
                    hcConnected
                      ? isLightTheme
                        ? 'bg-green-100 text-green-700'
                        : 'bg-green-500/20 text-green-400'
                      : isLightTheme
                      ? 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                      : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400'
                  } ${hcConnected ? 'cursor-default' : ''}`}
                  data-testid="button-connect-health-connect"
                >
                  <Moon className="w-5 h-5" />
                  {hcConnected 
                    ? t('settings.health_connect_connected', 'Health Connect Connected') 
                    : t('settings.connect_health_connect', 'Connect Health Connect')}
                </button>
                
                {hcConnected && (
                  <button
                    onClick={hcDisconnect}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      isLightTheme
                        ? 'bg-red-100 hover:bg-red-200 text-red-700'
                        : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                    }`}
                    data-testid="button-disconnect-health-connect"
                  >
                    <X className="w-5 h-5" />
                    {t('settings.health_connect_disconnect', 'Disconnect')}
                  </button>
                )}
              </div>

              <HealthConnectCompactPanel 
                isLightTheme={isLightTheme} 
                data={healthConnectData.lastUpdate}
              />
            </div>
          )}

          {/* Bluetooth Heart Rate Monitor Section (hidden on iOS) */}
          {showBluetooth && (
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${
              isLightTheme ? 'text-gray-700' : 'text-white/80'
            }`}>
              {t('connection.bluetooth_monitor', 'Bluetooth Heart Rate Monitor')}
            </h3>
            <p className={`text-xs mb-3 ${
              isLightTheme ? 'text-gray-600' : 'text-white/60'
            }`}>
              {t('connection.bluetooth_desc', 'Connect a Bluetooth heart rate monitor for real-time biofeedback during practices')}
            </p>

            <div className="flex gap-3">
              {!isScanning && (
                <>
                  <button
                    onClick={connect}
                    disabled={connected}
                    className={`${connected ? 'flex-1' : 'w-full'} py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-3 ${
                      connected
                        ? isLightTheme
                          ? 'bg-green-100 text-green-700'
                          : 'bg-green-500/20 text-green-400'
                        : isLightTheme
                        ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                        : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                    } ${connected ? 'cursor-default' : ''}`}
                    data-testid="button-connect-tracker"
                  >
                    <Bluetooth className="w-5 h-5" />
                    {connected ? t('settings.tracker_connected') : t('settings.tracker_connect')}
                  </button>
                  
                  {connected && (
                    <button
                      onClick={disconnect}
                      className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                        isLightTheme
                          ? 'bg-red-100 hover:bg-red-200 text-red-700'
                          : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                      }`}
                      data-testid="button-disconnect-tracker"
                    >
                      <X className="w-5 h-5" />
                      {t('settings.tracker_disconnect', 'Disconnect')}
                    </button>
                  )}
                </>
              )}
              
              {isScanning && stopScan && (
                <button
                  onClick={stopScan}
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-3 ${
                    isLightTheme
                      ? 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                      : 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400'
                  }`}
                  data-testid="button-stop-scan"
                >
                  <Bluetooth className="w-5 h-5 animate-pulse" />
                  {t('settings.scanning', 'Scanning...')} - Click to Stop
                </button>
              )}
            </div>

            {/* Connection instructions */}
            <div className={`mt-3 p-3 rounded-lg ${
              isLightTheme ? 'bg-gray-100' : 'bg-white/5'
            }`}>
              <p className={`text-xs font-medium mb-2 ${
                isLightTheme ? 'text-gray-700' : 'text-white/80'
              }`}>
                {t('connection.instructions_title', 'Connection instructions:')}
              </p>
              <div className={`text-xs space-y-1 ${
                isLightTheme ? 'text-gray-600' : 'text-white/60'
              }`}>
                <p>{t('connection.instructions_phone', 'On phone: Close standard tracker app. Turn on Bluetooth')}</p>
                <p>{t('connection.instructions_tracker', 'On tracker: Settings → Share heart rate → Enable')}</p>
              </div>
            </div>
            
            {/* Show available devices after scan completes (Android only) - hide when already connected */}
            {!connected && availableDevices && availableDevices.length > 0 && connectToDevice && (
              <div className={`mt-4 p-4 rounded-xl ${
                isLightTheme ? 'bg-gray-100' : 'bg-white/5'
              }`}>
                <p className={`text-sm mb-3 ${
                  isLightTheme ? 'text-gray-700' : 'text-white/70'
                }`}>
                  {t('settings.available_devices', 'Available Devices')} {isScanning && '(Scanning...)'}:
                </p>
                <div className="space-y-2">
                  {availableDevices.map((device) => (
                    <button
                      key={device.id}
                      onClick={() => connectToDevice(device.id)}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-between gap-3 ${
                        isLightTheme
                          ? 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      }`}
                      data-testid={`button-device-${device.id}`}
                    >
                      <span className="flex items-center gap-2">
                        <Bluetooth className="w-4 h-4" />
                        {device.name}
                      </span>
                      <span className={`text-xs ${
                        isLightTheme ? 'text-gray-500' : 'text-white/50'
                      }`}>
                        Connect
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Show platform info for debugging */}
            {vitalsPlat && (
              <div className={`mt-2 text-xs text-center ${
                isLightTheme ? 'text-gray-500' : 'text-white/40'
              }`}>
                Platform: {vitalsPlat === 'android' ? 'Android WebView' : 'Web Bluetooth API'}
              </div>
            )}

            {/* Show basic metrics when connected via BLE (Android) or HealthKit/Watch (iOS) */}
            {(connected || (isIOS && hkIsMonitoring)) && (
              <div className={`mt-4 p-4 rounded-xl ${
                isLightTheme ? 'bg-gray-100' : 'bg-white/5'
              }`}>
                <h4 className={`text-sm font-semibold mb-3 text-center ${
                  isLightTheme ? 'text-gray-700' : 'text-white/70'
                }`}>
                  {t('settings.basic_metrics')}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    isLightTheme ? 'bg-white' : 'bg-white/5'
                  }`}>
                    <Heart className="w-5 h-5 text-red-500" />
                    <div>
                      <div className={`text-xs ${
                        isLightTheme ? 'text-gray-600' : 'text-white/60'
                      }`}>Heart Rate</div>
                      <div className="text-lg font-semibold">
                        {isIOS ? (hkHeartRate ?? hr ?? '--') : (hr ?? '--')} bpm
                        {isIOS && hkIsMonitoring && (
                          <span className={`ml-2 text-xs font-normal ${
                            isLightTheme ? 'text-gray-500' : 'text-white/50'
                          }`}>
                            (HealthKit)
                          </span>
                        )}
                        {!isIOS && hrSource && (
                          <span className={`ml-2 text-xs font-normal ${
                            isLightTheme ? 'text-gray-500' : 'text-white/50'
                          }`}>
                            ({hrSource === 'ble' ? 'BLE' : 'Notify'})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    isLightTheme ? 'bg-white' : 'bg-white/5'
                  }`}>
                    <Wind className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className={`text-xs ${
                        isLightTheme ? 'text-gray-600' : 'text-white/60'
                      }`}>Breathing</div>
                      <div className="text-lg font-semibold">{hr && br ? `${br.toFixed(1)}` : '--'} /min</div>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    isLightTheme ? 'bg-white' : 'bg-white/5'
                  }`}>
                    <Activity className="w-5 h-5 text-orange-500" />
                    <div>
                      <div className={`text-xs ${
                        isLightTheme ? 'text-gray-600' : 'text-white/60'
                      }`}>Stress</div>
                      <div className="text-lg font-semibold">{hr && stress !== null ? `${stress}%` : '--%'}</div>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    isLightTheme ? 'bg-white' : 'bg-white/5'
                  }`}>
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className={`text-xs ${
                        isLightTheme ? 'text-gray-600' : 'text-white/60'
                      }`}>Energy</div>
                      <div className="text-lg font-semibold">{hr && energy !== null ? `${energy}%` : '--%'}</div>
                    </div>
                  </div>
                </div>
                
                {/* Advanced Physiological Metrics - Extended Format */}
                <div className="mt-6">
                  <h4 className={`text-base font-semibold mb-4 text-center ${
                    isLightTheme ? 'text-gray-800' : 'text-white'
                  }`}>
                    {t('settings.advanced_metrics', 'Advanced Physiological Metrics')}
                  </h4>
                  <div className="space-y-2">
                    {/* HRV surrogate */}
                    <div className={`flex items-center justify-between p-4 rounded-xl ${
                      isLightTheme ? 'bg-gray-100' : 'bg-white/5'
                    }`}>
                      <div>
                        <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                          {t('settings.hrv_surrogate', 'HRV surrogate')}
                        </div>
                        <div className={`text-xs ${isLightTheme ? 'text-gray-500' : 'text-white/50'}`}>
                          {t('settings.hrv_desc', 'HR variability over time')}
                        </div>
                      </div>
                      <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                        {hr && hrv !== null ? `${hrv}` : '--'}
                      </div>
                    </div>

                    {/* Cardiac Stability Index */}
                    <div className={`flex items-center justify-between p-4 rounded-xl ${
                      isLightTheme ? 'bg-gray-100' : 'bg-white/5'
                    }`}>
                      <div>
                        <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                          {t('settings.cardiac_stability', 'Cardiac Stability Index')}
                        </div>
                        <div className={`text-xs ${isLightTheme ? 'text-gray-500' : 'text-white/50'}`}>
                          {t('settings.csi_desc', 'how evenly the heart beats')}
                        </div>
                      </div>
                      <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                        {hr && csi !== null ? csi.toFixed(2) : '--'}
                      </div>
                    </div>

                    {/* Recovery Rate */}
                    <div className={`flex items-center justify-between p-4 rounded-xl ${
                      isLightTheme ? 'bg-gray-100' : 'bg-white/5'
                    }`}>
                      <div>
                        <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                          {t('settings.recovery_rate', 'Recovery Rate')}
                        </div>
                        <div className={`text-xs ${isLightTheme ? 'text-gray-500' : 'text-white/50'}`}>
                          {t('settings.recovery_desc', 'HR normalization speed after stress')}
                        </div>
                      </div>
                      <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                        {hr && recoveryRate !== null ? `${(recoveryRate * 100).toFixed(0)}%` : '--'}
                      </div>
                    </div>

                    {/* HR trend slope */}
                    <div className={`flex items-center justify-between p-4 rounded-xl ${
                      isLightTheme ? 'bg-gray-100' : 'bg-white/5'
                    }`}>
                      <div>
                        <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                          {t('settings.hr_trend_slope', 'HR trend slope')}
                        </div>
                        <div className={`text-xs ${isLightTheme ? 'text-gray-500' : 'text-white/50'}`}>
                          {t('settings.hr_trend_desc', 'trend over 30-60s')}
                        </div>
                      </div>
                      <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                        {hr && hrTrendSlope !== null ? hrTrendSlope.toFixed(2) : '--'}
                      </div>
                    </div>

                    {/* HR Acceleration */}
                    <div className={`flex items-center justify-between p-4 rounded-xl ${
                      isLightTheme ? 'bg-gray-100' : 'bg-white/5'
                    }`}>
                      <div>
                        <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                          {t('settings.hr_acceleration', 'HR Acceleration')}
                        </div>
                        <div className={`text-xs ${isLightTheme ? 'text-gray-500' : 'text-white/50'}`}>
                          {t('settings.hr_accel_desc', 'how fast HR rises')}
                        </div>
                      </div>
                      <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                        {hr && hrAcceleration !== null ? hrAcceleration.toFixed(2) : '--'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emotional State Metrics - Extended Format */}
                <div className="mt-6">
                  <h4 className={`text-base font-semibold mb-4 text-center ${
                    isLightTheme ? 'text-gray-800' : 'text-white'
                  }`}>
                    {t('settings.emotional_metrics', 'Emotional State Metrics')}
                  </h4>
                  <div className="space-y-2">
                    {/* Alarm / Anxiety */}
                    <div className={`flex items-center justify-between p-4 rounded-xl ${
                      isLightTheme ? 'bg-gray-100' : 'bg-white/5'
                    }`}>
                      <div>
                        <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                          {t('settings.alarm_anxiety', 'Alarm / Anxiety')}
                        </div>
                        <div className={`text-xs ${isLightTheme ? 'text-gray-500' : 'text-white/50'}`}>
                          {t('settings.arousal_desc', 'HR rise + BR rise')}
                        </div>
                      </div>
                      <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                        {hr && arousal !== null ? `${arousal}%` : '--'}
                      </div>
                    </div>

                    {/* Relaxation / Calmness */}
                    <div className={`flex items-center justify-between p-4 rounded-xl ${
                      isLightTheme ? 'bg-gray-100' : 'bg-white/5'
                    }`}>
                      <div>
                        <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                          {t('settings.relaxation_calmness', 'Relaxation / Calmness')}
                        </div>
                        <div className={`text-xs ${isLightTheme ? 'text-gray-500' : 'text-white/50'}`}>
                          {t('settings.calm_desc', 'low HR + stable BR')}
                        </div>
                      </div>
                      <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                        {hr && calm !== null ? `${calm}%` : '--'}
                      </div>
                    </div>

                    {/* Focus / Concentration */}
                    <div className={`flex items-center justify-between p-4 rounded-xl ${
                      isLightTheme ? 'bg-gray-100' : 'bg-white/5'
                    }`}>
                      <div>
                        <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                          {t('settings.focus_concentration', 'Focus / Concentration')}
                        </div>
                        <div className={`text-xs ${isLightTheme ? 'text-gray-500' : 'text-white/50'}`}>
                          {t('settings.focus_desc', 'average HR + low variability')}
                        </div>
                      </div>
                      <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                        {hr && focus !== null ? `${focus}%` : '--'}
                      </div>
                    </div>

                    {/* Excitement */}
                    <div className={`flex items-center justify-between p-4 rounded-xl ${
                      isLightTheme ? 'bg-gray-100' : 'bg-white/5'
                    }`}>
                      <div>
                        <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                          {t('settings.excitement', 'Excitement')}
                        </div>
                        <div className={`text-xs ${isLightTheme ? 'text-gray-500' : 'text-white/50'}`}>
                          {t('settings.excitement_desc', 'HR sharp moment')}
                        </div>
                      </div>
                      <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                        {hr && excitement !== null ? `${excitement}%` : '--'}
                      </div>
                    </div>

                    {/* Fatigue */}
                    <div className={`flex items-center justify-between p-4 rounded-xl ${
                      isLightTheme ? 'bg-gray-100' : 'bg-white/5'
                    }`}>
                      <div>
                        <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                          {t('settings.fatigue_label', 'Fatigue / Fatigue')}
                        </div>
                        <div className={`text-xs ${isLightTheme ? 'text-gray-500' : 'text-white/50'}`}>
                          {t('settings.fatigue_desc', 'HR above baseline, BR low, energy low')}
                        </div>
                      </div>
                      <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                        {hr && fatigue !== null ? `${fatigue}%` : '--'}
                      </div>
                    </div>

                    {/* Flow */}
                    <div className={`flex items-center justify-between p-4 rounded-xl ${
                      isLightTheme ? 'bg-gray-100' : 'bg-white/5'
                    }`}>
                      <div>
                        <div className={`font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                          {t('settings.flow_label', 'Flow')}
                        </div>
                        <div className={`text-xs ${isLightTheme ? 'text-gray-500' : 'text-white/50'}`}>
                          {t('settings.flow_desc', 'HR slightly above baseline, stable BR')}
                        </div>
                      </div>
                      <div className={`font-semibold ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                        {hr && flow !== null ? `${flow}%` : '--'}
                      </div>
                    </div>
                  </div>

                  {/* Calibration notice */}
                  <div className={`mt-4 text-center text-xs ${
                    isLightTheme ? 'text-gray-500' : 'text-white/40'
                  }`}>
                    {t('settings.calibrating', 'Real-time metrics. Calibrating baseline...')}
                  </div>
                </div>
              </div>
            )}
            
            {isAndroid && healthConnectData.lastUpdate && (
              <div className="mt-4">
                <h4 className={`text-sm font-semibold mb-3 ${
                  isLightTheme ? 'text-gray-700' : 'text-white/70'
                }`}>
                  {t('settings.health_connect_data', 'Health Connect Data')}
                </h4>
                <HealthConnectCompactPanel 
                  isLightTheme={isLightTheme} 
                  data={healthConnectData.lastUpdate}
                />
              </div>
            )}
          </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};
