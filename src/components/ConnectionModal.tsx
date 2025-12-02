import { useState } from 'react';
import { X, Bluetooth, Moon, Heart, Wind, Activity, Zap, Watch, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import { HealthConnectCompactPanel } from './HealthConnectCompactPanel';
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
  vitalsData,
  healthConnectData,
}) => {
  const { t } = useTranslation();
  const { 
    connected, connect, disconnect, hr, hrSource, br, stress, energy,
    isScanning, availableDevices, connectToDevice, stopScan, platform
  } = vitalsData;
  const { connected: hcConnected, connect: hcConnect, disconnect: hcDisconnect } = healthConnectData;
  
  const isIOS = Capacitor.getPlatform() === 'ios' && Capacitor.isNativePlatform();
  const isAndroid = Capacitor.getPlatform() === 'android';
  
  const {
    heartRate: hkHeartRate,
    isAvailable: hkIsAvailable,
    isAuthorized: hkIsAuthorized,
    requestPermission: hkRequestPermission,
    startMonitoring: hkStartMonitoring,
    error: hkError
  } = useHealthKitHeartRate();
  
  const [hkConnecting, setHkConnecting] = useState(false);
  const [hkAttempted, setHkAttempted] = useState(false);

  const handleHealthKitConnect = async () => {
    setHkConnecting(true);
    setHkAttempted(false);
    try {
      await hkRequestPermission();
      await hkStartMonitoring();
    } catch (err) {
      console.error('[HealthKit] Connection error:', err);
    } finally {
      setHkConnecting(false);
      setHkAttempted(true);
    }
  };
  
  const hkIsConnected = hkIsAuthorized === true;
  const hkShowSuccess = hkAttempted && hkIsConnected && !hkError;
  const hkAvailabilityChecked = hkIsAvailable !== null;

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
          <h2 className="text-2xl sm:text-3xl font-light mb-2">{t('connection.title', 'Connection')}</h2>
          <p className={`text-xs sm:text-sm ${isLightTheme ? 'text-gray-600' : 'text-white/70'}`}>
            {t('connection.subtitle', 'Connect your health devices and trackers')}
          </p>
        </div>

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
              
              <div className="flex gap-3 mb-3">
                <button
                  onClick={handleHealthKitConnect}
                  disabled={hkConnecting || hkIsConnected}
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-3 ${
                    hkIsConnected
                      ? isLightTheme
                        ? 'bg-green-100 text-green-700'
                        : 'bg-green-500/20 text-green-400'
                      : hkConnecting
                      ? isLightTheme
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-white/10 text-white/50'
                      : isLightTheme
                      ? 'bg-pink-100 hover:bg-pink-200 text-pink-700'
                      : 'bg-pink-500/20 hover:bg-pink-500/30 text-pink-400'
                  } ${(hkConnecting || hkIsConnected) ? 'cursor-default' : ''}`}
                  data-testid="button-connect-healthkit"
                >
                  <Watch className="w-5 h-5" />
                  {hkConnecting 
                    ? t('connection.healthkit_connecting', 'Connecting...')
                    : hkIsConnected
                    ? t('connection.healthkit_connected', 'HealthKit Connected')
                    : t('connection.healthkit_connect', 'Connect HealthKit')}
                </button>
              </div>

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

              {hkIsConnected && (
                <div className={`p-4 rounded-xl ${
                  isLightTheme ? 'bg-gray-100' : 'bg-white/5'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Heart className={`w-6 h-6 ${hkHeartRate ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
                      <div>
                        <div className={`text-xs ${isLightTheme ? 'text-gray-600' : 'text-white/60'}`}>
                          {t('connection.healthkit_hr', 'Heart Rate from HealthKit')}
                        </div>
                        <div className="text-xl font-semibold">
                          {hkHeartRate ?? '--'} <span className="text-sm font-normal">bpm</span>
                        </div>
                      </div>
                    </div>
                    <Watch className={`w-5 h-5 ${isLightTheme ? 'text-gray-400' : 'text-white/40'}`} />
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

          {/* Bluetooth Heart Rate Monitor Section */}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
