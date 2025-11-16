import React, { useState } from 'react';
import { X, Save, User as UserIcon, Bluetooth, Heart, Wind, Activity, Zap, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../lib/supabase';
import { HealthConnectCompactPanel } from './HealthConnectCompactPanel';

interface SettingsModalProps {
  user: any;
  profile: UserProfile | null;
  onClose: () => void;
  onProfileUpdate: (profile: UserProfile) => void;
  isLightTheme: boolean;
  vitalsData: {
    connected: boolean;
    connect: () => void;
    hr: number | null;
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
  };
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  user,
  profile,
  onClose,
  onProfileUpdate,
  isLightTheme,
  vitalsData,
}) => {
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { connected, connect, hr, br, stress, energy, hrv, csi, recoveryRate, hrTrendSlope, hrAcceleration, arousal, calm, focus, excitement, fatigue, flow } = vitalsData;

  const handleHealthConnectClick = () => {
    console.log("[HC] Connect button clicked");

    if ((window as any).Android?.requestHealthConnectPermissions) {
      (window as any).Android.requestHealthConnectPermissions();
      return;
    }

    if ((window as any).onHealthConnectUpdate) {
      (window as any).onHealthConnectUpdate({
        ts: new Date().toISOString(),
        source: "debug",
        activity: {
          activeCaloriesBurned: 320,
          vo2Max: 42
        },
        vitals: {
          heartRate: 78,
          restingHeartRate: 60,
          hrv: 55,
          bloodPressureSys: 120,
          bloodPressureDia: 78,
          bloodGlucose: 4.8,
          spo2: 97,
          respiratoryRate: 14,
          bodyTemperature: 36.8,
          skinTemperature: 33.2
        },
        sleep: {
          main: {
            date: new Date().toISOString().split('T')[0],
            sleepStart: "23:40",
            wakeTime: "07:05",
            durationMin: 445
          }
        },
        wellness: {
          mindfulnessMinutes: 15,
          mindfulnessSessions: 2,
          sexualActivityEvents: 0
        },
        body: {
          weightKg: 72.5,
          heightCm: 178,
          bodyFatPct: 16,
          bodyWaterMassKg: 40,
          boneMassKg: 3,
          leanBodyMassKg: 61,
          basalMetabolicRate: 1700
        },
        nutrition: {
          calories: 2300,
          proteinGrams: 120,
          fatGrams: 70,
          carbsGrams: 260,
          hydrationLiters: 2.1
        },
        femaleHealth: {
          menstruationFlow: "medium",
          basalBodyTemperature: 36.6,
          cervicalMucus: "egg_white",
          ovulationTestPositive: true,
          intermenstrualBleeding: false
        }
      });
      console.log('[HC] Test data package sent - check Rhythm, Vitals, and Health Connect panel');
    } else {
      console.warn("onHealthConnectUpdate is not defined");
      alert('Health Connect bridge is not initialized');
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (!displayName.trim()) {
      setError(t('settings.name_required'));
      return;
    }

    if (displayName.length > 30) {
      setError(t('settings.name_too_long'));
      return;
    }

    setError('');
    setIsSaving(true);

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ display_name: displayName.trim() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        onProfileUpdate(data);
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || t('settings.save_error'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className={`max-w-md w-full min-h-[55vh] max-h-[80vh] rounded-2xl border p-6 sm:p-8 relative overflow-y-auto scrollbar-hide ${
          isLightTheme
            ? 'bg-white border-gray-300'
            : 'bg-gradient-to-br from-gray-900 to-black border-purple-500/30'
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
            isLightTheme ? 'hover:bg-gray-200' : 'hover:bg-white/10'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-light mb-2">{t('auth.settings')}</h2>
          <p className={`text-xs sm:text-sm ${isLightTheme ? 'text-gray-600' : 'text-white/70'}`}>
            {t('settings.customize_profile')}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label
              className={`block text-sm mb-2 ${
                isLightTheme ? 'text-gray-700' : 'text-white/80'
              }`}
            >
              {t('settings.your_name')}
            </label>
            <div className="relative">
              <UserIcon
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isLightTheme ? 'text-gray-400' : 'text-white/40'
                }`}
              />
              <input
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setError('');
                  setSuccess(false);
                }}
                maxLength={30}
                placeholder={t('settings.enter_name')}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                  isLightTheme
                    ? 'bg-gray-100 border-gray-300 focus:ring-gray-400 text-gray-900'
                    : 'bg-white/10 border-white/20 focus:ring-purple-500/50 text-white placeholder-white/40'
                }`}
              />
            </div>
            <p
              className={`text-xs mt-1 ${
                isLightTheme ? 'text-gray-500' : 'text-white/50'
              }`}
            >
              {displayName.length}/30 {t('settings.characters')}
            </p>
          </div>

          {error && (
            <div
              className={`text-sm p-3 rounded-lg ${
                isLightTheme
                  ? 'bg-red-100 text-red-700'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className={`text-sm p-3 rounded-lg ${
                isLightTheme
                  ? 'bg-green-100 text-green-700'
                  : 'bg-green-500/20 text-green-400'
              }`}
            >
              {t('settings.name_updated')}
            </div>
          )}

          <div>
            <button
              onClick={handleSave}
              disabled={isSaving || !displayName.trim()}
              className={`w-full py-3 sm:py-4 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-3 text-sm sm:text-base ${
                isLightTheme
                  ? 'bg-gray-900 hover:bg-gray-800 text-white disabled:bg-gray-400'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50'
              } ${isSaving || !displayName.trim() ? 'cursor-not-allowed' : ''}`}
            >
              <Save className="w-5 h-5" />
              {isSaving ? `${t('settings.saving')}...` : t('settings.save')}
            </button>

            <div
              className={`mt-3 p-4 rounded-lg ${
                isLightTheme ? 'bg-gray-100' : 'bg-white/5'
              }`}
            >
              <p
                className={`text-xs ${
                  isLightTheme ? 'text-gray-600' : 'text-white/60'
                }`}
              >
                {t('settings.name_info')}
              </p>
            </div>
          </div>

          <div>
            <button
              onClick={handleHealthConnectClick}
              className={`w-full py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-3 mb-3 ${
                isLightTheme
                  ? 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                  : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400'
              }`}
            >
              <Moon className="w-5 h-5" />
              {t('settings.connect_health_connect', 'Connect Google Health Connect')}
            </button>

            <HealthConnectCompactPanel isLightTheme={isLightTheme} />

            <button
              onClick={connect}
              disabled={connected}
              className={`w-full py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-3 ${
                connected
                  ? isLightTheme
                    ? 'bg-green-100 text-green-700'
                    : 'bg-green-500/20 text-green-400'
                  : isLightTheme
                  ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                  : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
              } ${connected ? 'cursor-default' : ''}`}
            >
              <Bluetooth className="w-5 h-5" />
              {connected ? t('settings.tracker_connected') : t('settings.tracker_connect')}
            </button>

            {connected && (
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
                      <div className="text-lg font-semibold">{hr ?? '--'} bpm</div>
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
                      <div className="text-lg font-semibold">{br ? `${br.toFixed(1)}` : '--'} /min</div>
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
                      <div className="text-lg font-semibold">{stress ?? '--'}%</div>
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
                      <div className="text-lg font-semibold">{energy ?? '--'}%</div>
                    </div>
                  </div>
                </div>

                {/* Заголовок расширенных показателей */}
                <h4 className={`text-sm font-semibold mt-4 mb-2 text-center ${
                  isLightTheme ? 'text-gray-700' : 'text-white/70'
                }`}>
                  {t('settings.advanced_metrics')}
                </h4>

                <div className="space-y-3">
                  {/* HRV surrogate */}
                  <div className={`flex justify-between items-center p-2 rounded-lg ${
                    isLightTheme ? 'bg-white' : 'bg-white/5'
                  }`}>
                    <div className="flex-1">
                      <div className={`text-xs font-medium ${
                        isLightTheme ? 'text-gray-700' : 'text-white/80'
                      }`}>HRV surrogate</div>
                      <div className={`text-[10px] ${
                        isLightTheme ? 'text-gray-500' : 'text-white/50'
                      }`}>{t('settings.hrv_desc')}</div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      isLightTheme ? 'text-gray-900' : 'text-white'
                    }`}>
                      {hrv ?? '--'}
                    </div>
                  </div>

                  {/* Cardiac Stability Index */}
                  <div className={`flex justify-between items-center p-2 rounded-lg ${
                    isLightTheme ? 'bg-white' : 'bg-white/5'
                  }`}>
                    <div className="flex-1">
                      <div className={`text-xs font-medium ${
                        isLightTheme ? 'text-gray-700' : 'text-white/80'
                      }`}>Cardiac Stability Index</div>
                      <div className={`text-[10px] ${
                        isLightTheme ? 'text-gray-500' : 'text-white/50'
                      }`}>{t('settings.csi_desc')}</div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      isLightTheme ? 'text-gray-900' : 'text-white'
                    }`}>
                      {csi ?? '--'}
                    </div>
                  </div>

                  {/* Recovery Rate */}
                  <div className={`flex justify-between items-center p-2 rounded-lg ${
                    isLightTheme ? 'bg-white' : 'bg-white/5'
                  }`}>
                    <div className="flex-1">
                      <div className={`text-xs font-medium ${
                        isLightTheme ? 'text-gray-700' : 'text-white/80'
                      }`}>Recovery Rate</div>
                      <div className={`text-[10px] ${
                        isLightTheme ? 'text-gray-500' : 'text-white/50'
                      }`}>{t('settings.recovery_rate_desc')}</div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      isLightTheme ? 'text-gray-900' : 'text-white'
                    }`}>
                      {recoveryRate ?? '--'}
                    </div>
                  </div>

                  {/* HR trend slope */}
                  <div className={`flex justify-between items-center p-2 rounded-lg ${
                    isLightTheme ? 'bg-white' : 'bg-white/5'
                  }`}>
                    <div className="flex-1">
                      <div className={`text-xs font-medium ${
                        isLightTheme ? 'text-gray-700' : 'text-white/80'
                      }`}>HR trend slope</div>
                      <div className={`text-[10px] ${
                        isLightTheme ? 'text-gray-500' : 'text-white/50'
                      }`}>{t('settings.hr_trend_desc')}</div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      isLightTheme ? 'text-gray-900' : 'text-white'
                    }`}>
                      {hrTrendSlope ?? '--'}
                    </div>
                  </div>

                  {/* HR Acceleration */}
                  <div className={`flex justify-between items-center p-2 rounded-lg ${
                    isLightTheme ? 'bg-white' : 'bg-white/5'
                  }`}>
                    <div className="flex-1">
                      <div className={`text-xs font-medium ${
                        isLightTheme ? 'text-gray-700' : 'text-white/80'
                      }`}>HR Acceleration</div>
                      <div className={`text-[10px] ${
                        isLightTheme ? 'text-gray-500' : 'text-white/50'
                      }`}>{t('settings.hr_acceleration_desc')}</div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      isLightTheme ? 'text-gray-900' : 'text-white'
                    }`}>
                      {hrAcceleration ?? '--'}
                    </div>
                  </div>
                </div>

                {/* Заголовок эмоциональных состояний */}
                <h4 className={`text-sm font-semibold mt-4 mb-2 text-center ${
                  isLightTheme ? 'text-gray-700' : 'text-white/70'
                }`}>
                  {t('settings.emotional_metrics')}
                </h4>

                <div className="space-y-3">
                  {/* Alarm/Arousal Index */}
                  <div className={`flex justify-between items-center p-2 rounded-lg ${
                    isLightTheme ? 'bg-white' : 'bg-white/5'
                  }`}>
                    <div className="flex-1">
                      <div className={`text-xs font-medium ${
                        isLightTheme ? 'text-gray-700' : 'text-white/80'
                      }`}>Alarm / {t('emotional_states.anxiety')}</div>
                      <div className={`text-[10px] ${
                        isLightTheme ? 'text-gray-500' : 'text-white/50'
                      }`}>{t('settings.arousal_desc')}</div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      isLightTheme ? 'text-gray-900' : 'text-white'
                    }`}>
                      {arousal ?? '--'}
                    </div>
                  </div>

                  {/* Relaxation/Calmness */}
                  <div className={`flex justify-between items-center p-2 rounded-lg ${
                    isLightTheme ? 'bg-white' : 'bg-white/5'
                  }`}>
                    <div className="flex-1">
                      <div className={`text-xs font-medium ${
                        isLightTheme ? 'text-gray-700' : 'text-white/80'
                      }`}>Relaxation / Calmness</div>
                      <div className={`text-[10px] ${
                        isLightTheme ? 'text-gray-500' : 'text-white/50'
                      }`}>{t('settings.calm_desc')}</div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      isLightTheme ? 'text-gray-900' : 'text-white'
                    }`}>
                      {calm ?? '--'}
                    </div>
                  </div>

                  {/* Focus/Concentration */}
                  <div className={`flex justify-between items-center p-2 rounded-lg ${
                    isLightTheme ? 'bg-white' : 'bg-white/5'
                  }`}>
                    <div className="flex-1">
                      <div className={`text-xs font-medium ${
                        isLightTheme ? 'text-gray-700' : 'text-white/80'
                      }`}>Focus / Concentration</div>
                      <div className={`text-[10px] ${
                        isLightTheme ? 'text-gray-500' : 'text-white/50'
                      }`}>{t('settings.focus_desc')}</div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      isLightTheme ? 'text-gray-900' : 'text-white'
                    }`}>
                      {focus ?? '--'}
                    </div>
                  </div>

                  {/* Excitement */}
                  <div className={`flex justify-between items-center p-2 rounded-lg ${
                    isLightTheme ? 'bg-white' : 'bg-white/5'
                  }`}>
                    <div className="flex-1">
                      <div className={`text-xs font-medium ${
                        isLightTheme ? 'text-gray-700' : 'text-white/80'
                      }`}>Excitement</div>
                      <div className={`text-[10px] ${
                        isLightTheme ? 'text-gray-500' : 'text-white/50'
                      }`}>{t('settings.excitement_desc')}</div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      isLightTheme ? 'text-gray-900' : 'text-white'
                    }`}>
                      {excitement ?? '--'}
                    </div>
                  </div>

                  {/* Fatigue/Усталость */}
                  <div className={`flex justify-between items-center p-2 rounded-lg ${
                    isLightTheme ? 'bg-white' : 'bg-white/5'
                  }`}>
                    <div className="flex-1">
                      <div className={`text-xs font-medium ${
                        isLightTheme ? 'text-gray-700' : 'text-white/80'
                      }`}>Fatigue / {t('emotional_states.fatigue')}</div>
                      <div className={`text-[10px] ${
                        isLightTheme ? 'text-gray-500' : 'text-white/50'
                      }`}>{t('settings.fatigue_desc')}</div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      isLightTheme ? 'text-gray-900' : 'text-white'
                    }`}>
                      {fatigue ?? '--'}
                    </div>
                  </div>

                  {/* Flow/Оптимальное состояние */}
                  <div className={`flex justify-between items-center p-2 rounded-lg ${
                    isLightTheme ? 'bg-white' : 'bg-white/5'
                  }`}>
                    <div className="flex-1">
                      <div className={`text-xs font-medium ${
                        isLightTheme ? 'text-gray-700' : 'text-white/80'
                      }`}>Flow</div>
                      <div className={`text-[10px] ${
                        isLightTheme ? 'text-gray-500' : 'text-white/50'
                      }`}>{t('settings.flow_desc')}</div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      isLightTheme ? 'text-gray-900' : 'text-white'
                    }`}>
                      {flow ?? '--'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!connected && (
              <div className={`mt-3 p-4 rounded-lg ${
                isLightTheme ? 'bg-blue-50' : 'bg-blue-500/10'
              }`}>
                <p className={`text-xs font-medium mb-2 ${
                  isLightTheme ? 'text-blue-900' : 'text-blue-300'
                }`}>
                  {t('settings.connection_instructions')}
                </p>
                <ol className={`text-xs space-y-1 list-decimal list-inside ${
                  isLightTheme ? 'text-blue-800' : 'text-blue-200'
                }`}>
                  <li>{t('settings.instruction_1')}</li>
                  <li>{t('settings.instruction_2')}</li>
                </ol>
              </div>
            )}

            {connected && (
              <p
                className={`text-xs mt-2 text-center ${
                  isLightTheme ? 'text-gray-500' : 'text-white/50'
                }`}
              >
                {t('settings.realtime_metrics')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
