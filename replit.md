# Overview

ONDA is a mindfulness and wellness mobile application that combines gamification with biometric tracking. It guides users through consciousness development practices organized into progressive "circuits," rewarding completion with virtual currency (OND). The app integrates real-time health data from Google Health Connect and Bluetooth heart rate monitors to provide adaptive, personalized meditation and breathing exercises.

The application is a React-based Progressive Web App (PWA) with native Android WebView wrapper support, featuring multilingual support (English, Spanish, Russian, Ukrainian, Chinese) and both light/dark themes. The business vision is to provide an engaging and effective platform for personal growth, leveraging technology to make wellness practices accessible and motivating, with strong market potential in the digital health and self-improvement sectors.

# Recent Changes

## App Branding Update - "ONDA Life" (November 20, 2025)

**User Request:** Display "ONDA Life" instead of Supabase URL on Google OAuth screen

**Changes Made:**
1. **index.html** - Updated title and added meta tags:
   ```html
   <title>ONDA Life - Практики осознанности</title>
   <meta name="application-name" content="ONDA Life" />
   <meta property="og:title" content="ONDA Life" />
   <meta property="og:site_name" content="ONDA Life" />
   ```

2. **AuthModal.tsx** - Updated heading from "ONDA" to "ONDA Life"

3. **strings.xml (Android)** - Updated app name:
   ```xml
   <string name="app_name">ONDA Life</string>
   ```

**Google Cloud Console Setup Required:**
- See `GOOGLE_OAUTH_BRANDING_RU.md` for complete instructions
- Update "Application name" in OAuth consent screen to "ONDA Life"
- This controls what users see on Google sign-in screen

---

## Bluetooth UX Improvements (November 20, 2025)

### Device List Auto-Hide on Selection ✅

**User Request:** "При выборе трекера список других устройств должен скрываться"

**Implemented:**
When user selects a device from the list, the device list automatically hides. List reappears only on next scan.

**Change in `src/hooks/useHeartRate.ts`:**
```typescript
const connectToDevice = useCallback((deviceId: string) => {
  window.Android.connectBluetoothDevice(deviceId);
  
  // Hide device list after selecting a device
  setAvailableDevices([]);
  setIsScanning(false);
}, []);
```

**User Flow:**
1. User clicks "Connect Tracker" → Scan starts → Device list appears
2. User selects device → **List hides** (cleaner UI) → Connection attempt
3. User clicks "Connect Tracker" again → New scan → Device list appears again

---

### Bluetooth Data Flow Bug Fix - useVitals Not Propagating Android Fields ✅

**CRITICAL BUG FIXED:** Device list state not propagating from `useHeartRate` to UI

**Root Cause:** `useVitals()` didn't pass through Android Bluetooth fields from `useHeartRate()`:
```typescript
// ❌ BEFORE: Missing Android fields
const { hr, connected, connect, disconnect, seriesRef } = useHeartRate();
return { connected, connect, disconnect, hr, br, stress, ... };

// ✅ AFTER: All fields included
const { hr, connected, connect, disconnect, seriesRef, 
        isScanning, availableDevices, connectToDevice, stopScan, platform } = useHeartRate();
return { connected, connect, disconnect, hr, br, stress, ..., 
         isScanning, availableDevices, connectToDevice, stopScan, platform };
```

**Files Changed:**
- `src/hooks/useVitals.ts` - Pass through Android Bluetooth fields
- `src/hooks/useHeartRate.ts` - Auto-hide device list on selection + debug logging
- `src/components/SettingsModal.tsx` - Debug logging for prop tracking

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