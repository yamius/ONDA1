import React from 'react';
import { X, Bluetooth, Moon, Heart, Wind, Activity, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HealthConnectCompactPanel } from './HealthConnectCompactPanel';
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
          <h2 className="text-2xl sm:text-3xl font-light mb-2">Connection</h2>
          <p className={`text-xs sm:text-sm ${isLightTheme ? 'text-gray-600' : 'text-white/70'}`}>
            {t('connection.subtitle', 'Connect your health devices and trackers')}
          </p>
        </div>

        <div className="space-y-6">
          {/* Health Connect Section */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${
              isLightTheme ? 'text-gray-700' : 'text-white/80'
            }`}>
              {t('connection.health_connect', 'Health Connect')}
            </h3>
            <p className={`text-xs mb-3 ${
              isLightTheme ? 'text-gray-600' : 'text-white/60'
            }`}>
              {t('connection.health_connect_desc', 'Read health data from Google Health Connect (Android) or Apple HealthKit (iOS)')}
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
