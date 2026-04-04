import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.onda-life.ios',
  appName: 'ONDA',
  webDir: 'dist',
  server: {
    // Allow cleartext traffic for local development
    cleartext: true
  },
  ios: {
    contentInset: 'never',
    backgroundColor: '#000000',
    allowsLinkPreview: false
  },
  plugins: {
    // HealthKit plugin configuration
    CapacitorHealth: {
      // iOS HealthKit permissions
      permissions: {
        read: ['READ_HEART_RATE', 'READ_WORKOUTS', 'READ_STEPS', 'READ_MINDFULNESS']
      }
    },
    // Use native HTTP for iOS to bypass WKWebView restrictions
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
