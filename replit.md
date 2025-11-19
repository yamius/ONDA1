# Overview

ONDA is a mindfulness and wellness mobile application that combines gamification with biometric tracking. The app guides users through consciousness development practices organized into progressive "circuits" (levels), rewarding completion with virtual currency (OND). It integrates real-time health data from Google Health Connect and Bluetooth heart rate monitors to provide adaptive, personalized meditation and breathing exercises.

The application is built as a React-based Progressive Web App (PWA) with native Android WebView wrapper support, featuring multilingual support (English, Spanish, Russian, Ukrainian, Chinese) and both light/dark themes.

# Recent Changes

## UI Cleanup (November 19, 2025)

**Production UI Cleanup:**
- Hidden debug UI elements for cleaner production interface:
  - Audio Test button (🎵 Тест Аудио) - hidden in main app
  - HC Debug Monitor panel - hidden in Settings modal
- Debug components remain in codebase but commented out for easy re-enabling during development
- AudioTest page still accessible via direct URL `/audio-test` or `?test=audio` if needed

**Files Changed:**
- `src/App.tsx` - commented out Audio Test button
- `src/components/SettingsModal.tsx` - commented out HealthConnectDebugPanel

## Build #46 (November 19, 2025)

**Data Source Logging:**
- Added metadata logging to show which app provides Health Connect data
- Now logs package names for: Steps, Calories, Sleep, Heart Rate
- Helps diagnose data source conflicts (e.g., Mi Fit vs Google Fit vs Zepp Life)
- Example log output: `Steps sources: com.xiaomi.hm.health` or `com.google.android.apps.fitness`

**Xiaomi Smart Band Integration Issue Identified:**
- **Mi Fit does NOT export data to Health Connect** - this is why user sees different numbers
- Mi Fit: 79 BPM heart rate, 8:32h sleep ✅
- ONDA: 0 BPM heart rate, 0:24h old sleep ❌ (data from different source)
- Health Connect receives data from Google Fit instead of Mi Fit
- Solution: Use **Zepp Life** app which supports Health Connect sync

**Files Changed:**
- `android-webview/app/src/main/java/com/onda/app/HealthConnectManager.kt` - added data source logging
- Added `XIAOMI_HEALTH_CONNECT_SETUP.md` - complete guide for Xiaomi Band users

## Build #45 (November 19, 2025)

**Health Connect Error Handling Improvements:**
- Fixed SecurityException handling for body measurements (Weight, Height, Body Fat, Lean Body Mass)
- Each measurement now wrapped in separate try/catch to prevent one missing permission from breaking others
- Changed SecurityException logging from ERROR to WARNING for expected missing permissions (e.g., Lean Body Mass)
- Added detailed logging for heart rate queries (time range, record count, values)
- Added vitals completion logging to help diagnose missing data

**Bug Fix:**
- Build #43-44 showed `Error reading body measurements` with 50+ line stack trace when Lean Body Mass permission denied
- Now shows clean `WARNING: No permission for Lean Body Mass (expected - user denied)`
- Other body measurements (Weight, Height, Body Fat) continue to work even if one permission missing

**Diagnosis Results:**
- Steps, Active Calories, and Sleep data working correctly (6426 steps, 762 kcal, sleep sessions)
- Heart Rate showing 0 records: **Not a bug** - device has no heart rate data in Health Connect for last 24 hours
- Solution: Add heart rate data via Google Fit, Samsung Health, or fitness tracker

**Files Changed:**
- `android-webview/app/src/main/java/com/onda/app/HealthConnectManager.kt` - improved error handling and logging
- Added `BUILD_APK_45.md` - comprehensive build and testing instructions
- Added `android-webview/build-apk-45.sh` - automated build script
- Added `HOW_TO_ADD_HEART_RATE.md` - guide for adding test heart rate data

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- TailwindCSS for utility-first styling
- i18next for internationalization with browser language detection

**Component Structure:**
- Main app entry point renders a single `OndaLevel1` component
- Modal-based UI pattern for overlays (Auth, Settings, Profile, Practice, Shop, etc.)
- Custom hooks for data management and side effects
- Separation between presentation components and business logic

**State Management:**
- Local React state for UI interactions
- Custom stores (heartRateStore, rhythmStore) for cross-component data
- Supabase integration for persistent user data
- LocalStorage for client-side data persistence

**Rationale:** This architecture provides a simple, maintainable structure suitable for a single-page application. The modal-based UI reduces routing complexity while maintaining clean navigation. Custom hooks centralize complex logic like biometric data processing and Health Connect integration.

## Native Bridge Integration

**WebView Communication:**
- JavaScript bridge pattern for Android native features (`window.Android`)
- Custom events (`hc-update`, `oauth-success`, `hc-permissions-denied`) for data flow
- Bridge methods exposed via `@JavascriptInterface` in MainActivity.kt
- TypeScript type definitions in `src/types/android.d.ts`

**Health Connect Integration (November 2025):**
- Complete Google Health Connect SDK 1.1.0-alpha07 integration
- **Android Layer:** `HealthConnectManager.kt` handles all Health Connect operations:
  - Reads 19 data types: heart rate, HRV, sleep, steps, nutrition, etc.
  - Permission management with Android permission launcher
  - JSON serialization for WebView communication
- **Bridge Layer:** Three methods exposed to JavaScript:
  - `isHealthConnectAvailable()` - check device support
  - `requestHealthConnectPermissions()` - trigger permission flow
  - `readHealthConnectData()` - fetch all health metrics
- **Web Layer:** `useHealthConnect` hook + display components
  - Listens for `hc-update` CustomEvent with health data payload
  - Automatic localStorage persistence of last update
  - Debug mode with mock data for development
- **Data Flow:** Android → JSON → evaluateJavascript → CustomEvent → React State

**Other Native Features:**
- External browser launch for OAuth flows (deep link callback)
- Bluetooth Web API for heart rate monitor connectivity
- Device motion API for activity detection

**Rationale:** The bridge pattern allows the web app to access native device capabilities while maintaining a single codebase. Health Connect integration provides comprehensive biometric tracking without requiring users to manually input data, enabling adaptive practice recommendations based on real health metrics.

## Data Processing Pipeline

**Biometric Analysis:**
- Real-time heart rate variability (HRV) calculation
- Stress and energy level estimation using custom algorithms
- Respiratory rate detection via Goertzel algorithm
- Exponentially weighted moving averages (EWMA) for signal smoothing

**Practice Adaptation:**
- Dynamic OND reward calculation based on actual vs. expected practice duration
- Performance scoring using stress/energy delta measurements
- Quality metrics derived from biometric data during practice sessions

**Rationale:** Custom DSP algorithms provide immediate feedback without backend dependencies, enabling offline functionality. The reward system incentivizes both completion and quality engagement.

## Authentication & User Management

**Supabase Auth:**
- Email/password authentication
- OAuth integration with Google
- Session management with automatic token refresh
- Email confirmation workflow for new registrations

**User Profile System:**
- User profiles table storing display names and avatars
- Game progress table tracking OND balance, completed practices, and achievements
- Automatic profile creation on first authentication

**Rationale:** Supabase provides a complete authentication solution with minimal backend code. Row-level security policies ensure data isolation between users.

## Gamification System

**Circuit-Based Progression:**
- Four consciousness circuits mapped to developmental stages
- Sequential unlocking based on completion criteria
- Practice-based advancement with OND currency rewards

**Achievement System:**
- Artifact collection tied to practice completion
- Historical tracking of all practice sessions
- Sleep rhythm monitoring with progress calculations

**Rationale:** The gamification layer provides motivation through clear progression paths and tangible rewards, making wellness practices more engaging.

## Audio System

**Audio CDN Infrastructure (November 2025):**
- Supabase Storage CDN for ~245MB of audio files
- Dual-layer caching: IndexedDB (fast) + Cache API (reliable)
- Progressive loading with retry logic (3 attempts with backoff)
- AbortController for proper cleanup and memory management
- Reduces APK size from 250MB to ~5MB

**Practice Audio Player:**
- Multi-track audio support with automatic track progression
- Fade in/out transitions for smooth audio experiences
- Volume control and playback state management
- Ambient sound mixing for meditation practices
- `RemoteAudioPlayer` for CDN-based audio loading
- `PracticeAudioPlayer` for local audio files (backward compatibility)

**Rationale:** Audio is central to guided meditation. The CDN-based system drastically reduces app size while maintaining offline capability through caching. Multi-track system allows for progressive sessions without manual intervention.

## Internationalization

**i18next Implementation:**
- Five language support (EN, ES, RU, UK, ZH)
- Browser language detection with fallback
- HTTP backend for dynamic translation loading
- Structured JSON translation files by locale

**Rationale:** Multi-language support expands the potential user base. The HTTP backend allows for translation updates without app redeployment.

## Mobile Optimization

**Responsive Design:**
- Mobile-first CSS with viewport-fit support
- Touch interaction optimizations (tap highlight removal, callout prevention)
- Scroll behavior management for PWA shell
- Safe area insets for notched displays

**Performance:**
- Vite's optimized build process with code splitting
- Lazy loading of translation files
- Lucide-react excluded from optimization for bundle size

**Rationale:** The app targets mobile devices primarily. These optimizations ensure smooth performance and proper display across device types.

# External Dependencies

## Backend Services

**Supabase (Primary Backend):**
- PostgreSQL database for user data, profiles, and game progress
- Authentication service with OAuth providers
- Real-time subscriptions (currently unused but available)
- Edge Functions for serverless operations

**Database Schema:**
- `user_profiles`: User display information
- `user_game_progress`: OND balance, completed practices, achievements, circuit progress

## Third-Party APIs

**Hume AI Emotion Analysis:**
- Voice-based emotional state detection (via Supabase Edge Function)
- Audio file analysis for practice recommendations
- Fallback to mock data when API unavailable

**Google Analytics & Meta Pixel:**
- User behavior tracking via gtag.js
- Facebook pixel for conversion tracking
- Conditional loading (disabled on localhost)

**Google AdSense:**
- Monetization through display ads
- Production-only loading with ads.txt verification

## Native Device APIs

**Google Health Connect:**
- Activity data (calories, VO2 max, steps)
- Vital signs (heart rate, blood pressure, SpO2, temperature)
- Sleep tracking (sessions, stages, duration)
- Body composition (weight, body fat, lean mass)
- Wellness data (mindfulness minutes, nutrition, hydration)

**Web Bluetooth:**
- Heart rate monitor connectivity
- Real-time BPM data streaming
- Device management (connect/disconnect)

**Device Motion API:**
- Accelerometer data for activity detection
- Movement-based metrics for practice quality

## Development Tools

**Build & Development:**
- Vite for fast HMR and optimized production builds
- TypeScript for type safety
- ESLint with React-specific rules
- PostCSS with Tailwind and Autoprefixer

**Testing & Quality:**
- TypeScript strict mode enabled
- No unused locals/parameters enforcement
- Type checking without emit for CI/CD