import { useEffect, useState } from 'react';
import { X, Heart, Apple } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import { useHealthKitHeartRate } from '../hooks/useHealthKitHeartRate';
import type { HealthConnectHook } from '../hooks/useHealthConnect';

interface ConnectionModalProps {
  onClose: () => void;
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
    isScanning?: boolean;
    availableDevices?: Array<{ id: string; name: string }>;
    connectToDevice?: (deviceId: string) => void;
    stopScan?: () => void;
    platform?: 'android' | 'web';
  };
  healthConnectData: HealthConnectHook;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  onClose,
  isLightTheme,
  vitalsData: _vitalsData,
  healthConnectData: _healthConnectData,
}) => {
  const { t } = useTranslation();
  const [isIOS, setIsIOS] = useState(false);
  
  const healthKit = useHealthKitHeartRate();
  
  useEffect(() => {
    const platform = Capacitor.getPlatform();
    setIsIOS(platform === 'ios');
  }, []);

  const handleHealthKitConnect = async () => {
    try {
      await healthKit.requestPermission();
      if (healthKit.isAuthorized) {
        await healthKit.startMonitoring();
      }
    } catch (err) {
      console.error('HealthKit connection error:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className={`max-w-md w-full min-h-[40vh] max-h-[70vh] rounded-2xl border p-6 sm:p-8 relative overflow-y-auto scrollbar-hide ${
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
          data-testid="button-close-connection"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-light mb-2">
            {t('connection.title', 'Connection')}
          </h2>
          <p className={`text-xs sm:text-sm ${isLightTheme ? 'text-gray-600' : 'text-white/70'}`}>
            {t('connection.subtitle', 'Connect your health devices and trackers')}
          </p>
        </div>

        <div className="space-y-6">
          {isIOS ? (
            <div>
              <h3 className={`text-sm font-semibold mb-3 ${
                isLightTheme ? 'text-gray-700' : 'text-white/80'
              }`}>
                {t('connection.healthkit', 'Apple HealthKit')}
              </h3>
              <p className={`text-xs mb-3 ${
                isLightTheme ? 'text-gray-600' : 'text-white/60'
              }`}>
                {t('connection.healthkit_desc', 'Read heart rate and health data from Apple HealthKit')}
              </p>
              
              <div className="flex gap-3 mb-3">
                <button
                  onClick={handleHealthKitConnect}
                  disabled={healthKit.isAuthorized === true}
                  className={`${healthKit.isAuthorized ? 'flex-1' : 'w-full'} py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-3 ${
                    healthKit.isAuthorized
                      ? isLightTheme
                        ? 'bg-green-100 text-green-700'
                        : 'bg-green-500/20 text-green-400'
                      : isLightTheme
                      ? 'bg-pink-100 hover:bg-pink-200 text-pink-700'
                      : 'bg-pink-500/20 hover:bg-pink-500/30 text-pink-400'
                  } ${healthKit.isAuthorized ? 'cursor-default' : ''}`}
                  data-testid="button-connect-healthkit"
                >
                  <Apple className="w-5 h-5" />
                  {healthKit.isAuthorized 
                    ? t('connection.healthkit_connected', 'HealthKit Connected') 
                    : t('connection.connect_healthkit', 'Connect HealthKit')}
                </button>
                
                {healthKit.isAuthorized && (
                  <button
                    onClick={healthKit.stopMonitoring}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      isLightTheme
                        ? 'bg-red-100 hover:bg-red-200 text-red-700'
                        : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                    }`}
                    data-testid="button-disconnect-healthkit"
                  >
                    <X className="w-5 h-5" />
                    {t('connection.disconnect', 'Disconnect')}
                  </button>
                )}
              </div>

              {healthKit.error && (
                <div className={`p-3 rounded-lg text-sm mb-3 ${
                  isLightTheme ? 'bg-red-100 text-red-700' : 'bg-red-500/20 text-red-400'
                }`}>
                  {healthKit.error}
                </div>
              )}

              {healthKit.isAuthorized && (
                <div className={`p-4 rounded-xl ${
                  isLightTheme ? 'bg-gray-100' : 'bg-white/5'
                }`}>
                  <h4 className={`text-sm font-semibold mb-3 text-center ${
                    isLightTheme ? 'text-gray-700' : 'text-white/70'
                  }`}>
                    {t('connection.health_data', 'Health Data')}
                  </h4>
                  <div className="flex items-center justify-center gap-3">
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${
                      isLightTheme ? 'bg-white' : 'bg-white/5'
                    }`}>
                      <Heart className="w-5 h-5 text-red-500" />
                      <div>
                        <div className={`text-xs ${
                          isLightTheme ? 'text-gray-600' : 'text-white/60'
                        }`}>{t('connection.heart_rate', 'Heart Rate')}</div>
                        <div className="text-lg font-semibold">
                          {healthKit.heartRate ?? '--'} bpm
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!healthKit.isAvailable && (
                <div className={`p-3 rounded-lg text-xs ${
                  isLightTheme ? 'bg-gray-100 text-gray-600' : 'bg-white/5 text-white/60'
                }`}>
                  {t('connection.healthkit_unavailable', 'HealthKit is not available on this device')}
                </div>
              )}
            </div>
          ) : (
            <div className={`p-4 rounded-xl text-center ${
              isLightTheme ? 'bg-gray-100' : 'bg-white/5'
            }`}>
              <p className={`text-sm ${
                isLightTheme ? 'text-gray-600' : 'text-white/60'
              }`}>
                {t('connection.android_info', 'Health connections are available in the Android version of the app.')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
