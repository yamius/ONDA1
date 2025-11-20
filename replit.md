# Overview

ONDA is a mindfulness and wellness mobile application that combines gamification with biometric tracking. It guides users through consciousness development practices organized into progressive "circuits," rewarding completion with virtual currency (OND). The app integrates real-time health data from Google Health Connect and Bluetooth heart rate monitors to provide adaptive, personalized meditation and breathing exercises.

The application is a React-based Progressive Web App (PWA) with native Android WebView wrapper support, featuring multilingual support (English, Spanish, Russian, Ukrainian, Chinese) and both light/dark themes. The business vision is to provide an engaging and effective platform for personal growth, leveraging technology to make wellness practices accessible and motivating, with strong market potential in the digital health and self-improvement sectors.

# Recent Changes

## Bluetooth Data Flow Bug Fix - useVitals Not Propagating Android Fields (November 20, 2025)

**CRITICAL BUG FIXED:** Device list state not propagating from `useHeartRate` to UI ✅

**User Issue:** Devices found and added to state, but `SettingsModal` receives `undefined` for all Bluetooth fields

**Root Cause Analysis:**
1. `useHeartRate()` correctly returns Android-specific fields:
   ```typescript
   return { hr, connected, connect, disconnect, seriesRef, 
            isScanning, availableDevices, connectToDevice, stopScan, platform };
   ```

2. **BUT** `useVitals()` only destructured basic fields:
   ```typescript
   const { hr, connected, connect, disconnect, seriesRef } = useHeartRate();  // ❌ Missing Android fields!
   ```

3. And only returned basic fields:
   ```typescript
   return { connected, connect, disconnect, hr, br, stress, ... };  // ❌ Missing Android fields!
   ```

4. Result: `SettingsModal` received `availableDevices = undefined`, `isScanning = undefined`, etc.

**Fix in `src/hooks/useVitals.ts`:**
```typescript
// Destructure ALL fields from useHeartRate
const { hr, connected, connect, disconnect, seriesRef, 
        isScanning, availableDevices, connectToDevice, stopScan, platform } = useHeartRate();

// Return ALL fields including Android-specific ones
return {
  connected, connect, disconnect, hr, br, stress, energy, hrv, csi, recoveryRate, 
  hrTrendSlope, hrAcceleration, arousal, calm, focus, excitement, fatigue, flow,
  isScanning, availableDevices, connectToDevice, stopScan, platform  // ✅ NOW INCLUDED
};
```

**Evidence from Debugging Logs:**
- Before fix: `[SettingsModal] availableDevices updated: undefined` ❌
- After fix: Full device list should propagate to UI ✅

**Files Changed:**
- `src/hooks/useVitals.ts` - Added Android Bluetooth fields to destructuring and return statement
- `src/hooks/useHeartRate.ts` - Added debug logging for device count tracking
- `src/components/SettingsModal.tsx` - Added useEffect logging to track prop updates

## Previous: Bluetooth UI Rendering Fix (November 19, 2025)

**Fixed:** Removed `isScanning &&` condition from device list rendering in `SettingsModal.tsx`
- Devices now remain visible after 10-second scan auto-stop

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite for build and development
- TailwindCSS for styling
- i18next for internationalization

**Component Structure:**
- Single `OndaLevel1` component as main entry point
- Modal-based UI pattern for overlays (Auth, Settings, Practice, Shop)
- Custom hooks for data and side effects
- Separation of presentation and business logic

**State Management:**
- Local React state
- Custom stores (heartRateStore, rhythmStore)
- Supabase integration for persistent user data
- LocalStorage for client-side persistence

## Native Bridge Integration

**WebView Communication:**
- JavaScript bridge pattern for Android native features (`window.Android`)
- Custom events for data flow (`hc-update`, `oauth-success`, `hc-permissions-denied`)
- Bridge methods exposed via `@JavascriptInterface` in `MainActivity.kt`
- TypeScript type definitions in `src/types/android.d.ts`

**Health Connect Integration:**
- Google Health Connect SDK 1.1.0-alpha07 for reading 19 data types
- `HealthConnectManager.kt` handles all Health Connect operations and permission management
- Exposed methods to JavaScript: `isHealthConnectAvailable()`, `requestHealthConnectPermissions()`, `readHealthConnectData()`
- `useHealthConnect` hook handles data reception and persistence

**Other Native Features:**
- External browser launch for OAuth
- Web Bluetooth API for heart rate monitor connectivity (production-ready)
- Device motion API for activity detection

## Data Processing Pipeline

**Biometric Analysis:**
- Real-time Heart Rate Variability (HRV) calculation
- Stress and energy level estimation
- Respiratory rate detection via Goertzel algorithm
- Exponentially Weighted Moving Averages (EWMA) for signal smoothing

**Practice Adaptation:**
- Dynamic OND reward calculation based on practice duration
- Performance scoring using stress/energy deltas
- Quality metrics derived from biometric data during practices

## Authentication & User Management

**Supabase Auth:**
- Email/password and Google OAuth
- Session management with token refresh
- Email confirmation

**User Profile System:**
- `user_profiles` table for display names and avatars
- `user_game_progress` table for OND balance, completed practices, and achievements

## Gamification System

**Circuit-Based Progression:**
- Four consciousness circuits with sequential unlocking
- Practice-based advancement and OND currency rewards

**Achievement System:**
- Artifact collection
- Historical tracking of practice sessions
- Sleep rhythm monitoring

## Audio System

**Audio CDN Infrastructure:**
- Supabase Storage CDN for audio files (~245MB)
- Dual-layer caching (IndexedDB and Cache API)
- Progressive loading with retry logic
- Reduces APK size significantly (from 250MB to ~5MB)

**Practice Audio Player:**
- Multi-track audio support with auto progression
- Fade in/out transitions
- Volume control and playback state management
- Ambient sound mixing
- `RemoteAudioPlayer` for CDN, `PracticeAudioPlayer` for local files

## Internationalization

**i18next Implementation:**
- Five language support (EN, ES, RU, UK, ZH)
- Browser language detection with fallback
- HTTP backend for dynamic translation loading
- Structured JSON translation files

## Mobile Optimization

**Responsive Design:**
- Mobile-first CSS with viewport-fit
- Touch interaction optimizations
- Safe area insets for notched displays

**Performance:**
- Vite's optimized build with code splitting
- Lazy loading of translation files

# External Dependencies

## Backend Services

**Supabase (Primary Backend):**
- PostgreSQL database
- Authentication service
- Edge Functions

## Third-Party APIs

**Hume AI Emotion Analysis:**
- Voice-based emotional state detection (via Supabase Edge Function)

**Google Analytics & Meta Pixel:**
- User behavior tracking (gtag.js and Facebook pixel)

**Google AdSense:**
- Monetization through display ads

## Native Device APIs

**Google Health Connect:**
- Reads 19 data types including activity, vital signs, sleep, body composition, and wellness data.

**Web Bluetooth:**
- Heart rate monitor connectivity for real-time BPM data streaming.

**Device Motion API:**
- Accelerometer data for activity detection.