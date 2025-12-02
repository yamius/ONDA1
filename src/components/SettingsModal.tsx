import React, { useState } from 'react';
import { X, Save, User as UserIcon, Bluetooth, Heart, Wind, Activity, Zap, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../lib/supabase';
import { HealthConnectCompactPanel } from './HealthConnectCompactPanel';
// import { HealthConnectDebugPanel } from './HealthConnectDebugPanel'; // DEBUG: Hidden in production
import type { HealthConnectHook } from '../hooks/useHealthConnect';

interface SettingsModalProps {
  user: any;
  profile: UserProfile | null;
  onClose: () => void;
  onProfileUpdate: (profile: UserProfile) => void;
  isLightTheme: boolean;
  vitalsData: {
    connected: boolean;
    connect: () => void;
    disconnect: () => void;
    hr: number | null;
    hrSource?: 'ble' | 'notification' | null;
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
    // Android-specific fields
    isScanning?: boolean;
    availableDevices?: Array<{ id: string; name: string }>;
    connectToDevice?: (deviceId: string) => void;
    stopScan?: () => void;
    platform?: 'android' | 'web';
    // Notification HR fields
    notificationHR?: {
      hr: number | null;
      lastUpdate: number | null;
      source: string | null;
      isEnabled: boolean;
      requestPermission: () => void;
    };
  };
  healthConnectData: HealthConnectHook;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  user,
  profile,
  onClose,
  onProfileUpdate,
  isLightTheme,
  vitalsData,
  healthConnectData,
}) => {
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { 
    connected, connect, disconnect, hr, hrSource, br, stress, energy, hrv, csi, recoveryRate, 
    hrTrendSlope, hrAcceleration, arousal, calm, focus, excitement, fatigue, flow,
    isScanning, availableDevices, connectToDevice, stopScan, platform
  } = vitalsData;
  const { connected: hcConnected, connect: hcConnect, disconnect: hcDisconnect } = healthConnectData;

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
        .upsert({ 
          id: user.id,
          display_name: displayName.trim()
        })
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

            {/* DEBUG: HealthConnect Debug Panel hidden in production */}
            {/* <div className="mt-4">
              <HealthConnectDebugPanel />
            </div> */}

            {/* Notification Heart Rate Section (Android only) - HIDDEN UNTIL WORKING */}
            {/* {notificationHR && (
              <div className="mt-4">
                <button
                  onClick={notificationHR.requestPermission}
                  disabled={notificationHR.isEnabled}
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-3 ${
                    notificationHR.isEnabled
                      ? isLightTheme
                        ? 'bg-green-100 text-green-700'
                        : 'bg-green-500/20 text-green-400'
                      : isLightTheme
                      ? 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                      : 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400'
                  } ${notificationHR.isEnabled ? 'cursor-default' : ''}`}
                  data-testid="button-enable-notification-hr"
                >
                  <Bell className="w-5 h-5" />
                  {notificationHR.isEnabled 
                    ? t('settings.notification_hr_enabled', 'Notification HR Enabled') 
                    : t('settings.notification_hr_enable', 'Enable Notification Heart Rate')}
                </button>

                {notificationHR.isEnabled && (
                  <div 
                    className={`mt-3 p-4 rounded-xl ${
                      isLightTheme ? 'bg-gray-100' : 'bg-white/5'
                    }`}
                    data-testid="notification-hr-status"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className={`text-2xl font-bold ${
                              notificationHR.hr ? 'text-red-500' : (isLightTheme ? 'text-gray-400' : 'text-white/40')
                            }`}>
                              {notificationHR.hr ?? '--'}
                            </span>
                            <span className={`text-sm ${
                              isLightTheme ? 'text-gray-500' : 'text-white/50'
                            }`}>bpm</span>
                          </div>
                          <p className={`text-xs mt-1 ${
                            isLightTheme ? 'text-gray-500' : 'text-white/50'
                          }`}>
                            {notificationHR.lastUpdate 
                              ? (() => {
                                  const secondsAgo = Math.floor((Date.now() - notificationHR.lastUpdate) / 1000);
                                  if (secondsAgo < 60) return t('settings.notification_hr_seconds_ago', '{{count}}s ago', { count: secondsAgo });
                                  const minutesAgo = Math.floor(secondsAgo / 60);
                                  if (minutesAgo < 60) return t('settings.notification_hr_minutes_ago', '{{count}}m ago', { count: minutesAgo });
                                  const hoursAgo = Math.floor(minutesAgo / 60);
                                  return t('settings.notification_hr_hours_ago', '{{count}}h ago', { count: hoursAgo });
                                })()
                              : t('settings.notification_hr_waiting', 'Waiting for updates...')}
                          </p>
                        </div>
                        <Heart className={`w-6 h-6 ${
                          notificationHR.hr ? 'text-red-500 animate-pulse' : 'text-gray-400'
                        }`} />
                      </div>
                      
                      {notificationHR.source && (
                        <div className={`flex items-center gap-2 text-xs ${
                          isLightTheme ? 'text-gray-600' : 'text-white/60'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            notificationHR.hr ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                          <span data-testid="text-notification-hr-source">
                            {notificationHR.source.includes('mi.health') ? 'Mi Fitness' : 
                             notificationHR.source.includes('fitbit') ? 'Fitbit' :
                             notificationHR.source.includes('samsung') ? 'Samsung Health' :
                             notificationHR.source.includes('google') ? 'Google Fit' :
                             notificationHR.source.includes('garmin') ? 'Garmin Connect' :
                             t('settings.notification_hr_fitness_app', 'Fitness App')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!notificationHR.isEnabled && (
                  <div 
                    className={`mt-3 p-3 rounded-lg text-xs ${
                      isLightTheme ? 'bg-gray-100 text-gray-600' : 'bg-white/5 text-white/60'
                    }`}
                    data-testid="notification-hr-info"
                  >
                    {t('settings.notification_hr_info', 'Get periodic heart rate updates from your fitness tracker app (Mi Fitness, Fitbit, Samsung Health, etc.)')}
                  </div>
                )}
              </div>
            )} */}

            <div className="flex gap-3 mt-4">
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
            
            {/* Show available devices after scan completes (Android only) */}
            {availableDevices && availableDevices.length > 0 && connectToDevice && (
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
            {platform && (
              <div className={`mt-2 text-xs text-center ${
                isLightTheme ? 'text-gray-500' : 'text-white/40'
              }`}>
                Platform: {platform === 'android' ? 'Android WebView' : 'Web Bluetooth API'}
              </div>
            )}

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
                      <div className="text-lg font-semibold">
                        {hr ?? '--'} bpm
                        {hrSource && (
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
