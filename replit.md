# Overview

ONDA is a mindfulness and wellness mobile application that integrates gamification with biometric tracking. It guides users through progressive "circuits" of consciousness development practices, rewarding completion with virtual currency (OND). The app leverages real-time health data from Google Health Connect (Android), Apple HealthKit (iOS), and Bluetooth heart rate monitors to provide adaptive, personalized meditation and breathing exercises.

The application is a React-based Progressive Web App (PWA) with native mobile support via a custom WebView wrapper for Android and Capacitor for iOS. It features multilingual support (English, Spanish, Russian, Ukrainian, Chinese) and both light/dark themes. The business vision is to provide an engaging and effective platform for personal growth, making wellness practices accessible and motivating, with strong market potential in the digital health and self-improvement sectors.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite for build
- TailwindCSS for styling
- i18next for internationalization

**Component Structure:**
- Single `OndaLevel1` component as main entry point
- Modal-based UI pattern for overlays
- Custom hooks for data and side effects
- Separation of presentation and business logic

**State Management:**
- Local React state
- Custom stores (heartRateStore, rhythmStore)
- Supabase integration for persistent user data
- LocalStorage for client-side persistence

**UI/UX Decisions:**
- Floating hamburger menu with animated burger-to-X transition and full navigation.
- Telegram-style immersive fullscreen with semi-transparent, blurred system bars.
- Custom menu component to avoid click-through issues found with Radix Sheet.

## Native Bridge Integration

**WebView Communication:**
- JavaScript bridge pattern for Android native features (`window.Android`).
- Custom events for data flow (`hc-update`, `oauth-success`, `hc-permissions-denied`).
- Bridge methods exposed via `@JavascriptInterface` in `MainActivity.kt`.
- TypeScript type definitions in `src/types/android.d.ts`.

**Health Integration:**
- `HealthConnectManager.kt` handles Health Connect operations on Android.
- `capacitor-health` plugin for unified HealthKit (iOS) + Health Connect (Android) support.
- `useHealthKitHeartRate` React hook for iOS heart rate monitoring.

**Other Native Features:**
- External browser launch for OAuth.
- Web Bluetooth API for heart rate monitor connectivity.
- Device motion API for activity detection.
- Immersive fullscreen experience with system bars matching app background color.

## Data Processing Pipeline

**Biometric Analysis:**
- Real-time Heart Rate Variability (HRV) calculation.
- Stress and energy level estimation.
- Respiratory rate detection via Goertzel algorithm.
- Exponentially Weighted Moving Averages (EWMA) for signal smoothing.

**Practice Adaptation:**
- Dynamic OND reward calculation based on practice duration.
- Performance scoring using stress/energy deltas.
- Quality metrics derived from biometric data during practices.

## Authentication & User Management

**Supabase Auth:**
- Email/password and Google OAuth.
- Session management with token refresh.
- Email confirmation.

**User Profile System:**
- `user_profiles` table for display names and avatars.
- `user_game_progress` table for OND balance, completed practices, and achievements.

## Gamification System

**Circuit-Based Progression:**
- Four consciousness circuits with sequential unlocking.
- Practice-based advancement and OND currency rewards.

**Achievement System:**
- Artifact collection.
- Historical tracking of practice sessions.
- Sleep rhythm monitoring.

## Audio System

**Audio CDN Infrastructure:**
- Supabase Storage CDN for audio files.
- Dual-layer caching (IndexedDB and Cache API).
- Progressive loading with retry logic.

**Practice Audio Player:**
- Multi-track audio support with auto progression.
- Fade in/out transitions.
- Volume control and playback state management.
- Ambient sound mixing.

## Internationalization

**i18next Implementation:**
- Five language support (EN, ES, RU, UK, ZH).
- Browser language detection with fallback.
- HTTP backend for dynamic translation loading.
- Structured JSON translation files.

## Mobile Optimization

**Responsive Design:**
- Mobile-first CSS with viewport-fit.
- Touch interaction optimizations.
- Safe area insets for notched displays.

**Performance:**
- Vite's optimized build with code splitting.
- Lazy loading of translation files.

## iOS Deployment
- Automated deployment via GitHub Actions and Fastlane for TestFlight distribution.
- Capacitor framework integration for iOS.

# External Dependencies

## Backend Services

**Supabase:**
- PostgreSQL database.
- Authentication service.
- Edge Functions.
- Storage CDN for audio files.

## Third-Party APIs

**Hume AI:**
- Emotion analysis (via Supabase Edge Function).

**Google Analytics & Meta Pixel:**
- User behavior tracking.

**Google AdSense:**
- Monetization through display ads.

## Native Device APIs

**Google Health Connect:**
- Reads 19 data types including activity, vital signs, sleep, body composition, and wellness data.

**Apple HealthKit:**
- Integrated via `capacitor-health` plugin for iOS health data access.

**Web Bluetooth:**
- Heart rate monitor connectivity for real-time BPM data streaming.

**Device Motion API:**
- Accelerometer data for activity detection.