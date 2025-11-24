import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.onda.app',
  appName: 'ONDA',
  webDir: 'dist',
  server: {
    // Allow cleartext traffic for local development
    cleartext: true
  },
  ios: {
    contentInset: 'always',
    // iOS-specific configuration
    backgroundColor: '#111827',
    allowsLinkPreview: false
  },
  plugins: {
    // HealthKit plugin configuration
    CapacitorHealth: {
      // iOS HealthKit permissions
      permissions: {
        read: ['READ_HEART_RATE', 'READ_WORKOUTS', 'READ_STEPS', 'READ_MINDFULNESS']
      }
    }
  }
};

export default config;
