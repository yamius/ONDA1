# ONDA - Mindfulness & Wellness Mobile App

> **Лендинг:** https://onda-life.com — основной домен.  
> **Деплой:** push → хостинг (Replit / Vercel / др.) подтягивает изменения и пересобирает. См. `README.md` и `.assistant/MODULE_LANDING.md`.

## Overview

ONDA is a mobile application for mindfulness and wellness that combines meditation practices with real-time biometric tracking and gamification. The app guides users through progressive "circuits" of consciousness development practices, rewarding completion with virtual currency (OND). It uses real-time health data from Apple Watch, Bluetooth heart rate monitors, and platform health APIs to create adaptive meditation experiences.

**Core Features:**
- Guided meditation and breathing practices with audio
- Real-time heart rate monitoring via Apple Watch, Bluetooth HRM, HealthKit, and Health Connect
- Stress and energy calculation from heart rate variability (HRV)
- Gamification with rewards, achievements, and virtual currency
- Multi-language support (EN, ES, RU, UK, ZH)
- Dark and light themes

## User Preferences

Preferred communication style: Simple, everyday language.

**Development Environment Constraints:**
- User does NOT have a Mac - all iOS builds happen via GitHub Actions + Fastlane → TestFlight
- All UI text and communications should be in Russian
- Code changes should be small and incremental
- Always explain where to insert code and how to verify changes

**Critical Files (do not modify without explicit approval):**
- `src/onda-level1-demo_27.tsx` - Main component (4000+ lines)
- `src/hooks/useVitals.ts` - Vitals calculation from HR
- `src/utils/ondCalculator.ts` - OND reward calculation
- `ios/App/` - Native iOS code
- `supabase/functions/` - Edge Functions

## System Architecture

### Frontend (React PWA)
| Technology | Purpose |
|------------|---------|
| React 18 + TypeScript | UI framework |
| Vite | Build tool and dev server |
| TailwindCSS | Styling |
| i18next | Internationalization (5 languages) |
| Capacitor | Bridge to native iOS APIs |

**Key Directories:**
- `src/components/` - UI components (modals, diagnostics, etc.)
- `src/hooks/` - React hooks for vitals, health data, watch HR
- `src/utils/` - Calculations (biometrics, OND rewards)
- `src/plugins/` - Capacitor plugin wrappers

### iOS Native (Capacitor + Swift)
| Component | Purpose |
|-----------|---------|
| `ios/App/App/` | iPhone app with WKWebView |
| `ios/App/OndaWatch Watch App/` | Apple Watch companion app |
| `OndaWatchPlugin.swift` | Capacitor plugin bridging JS ↔ Swift |
| `WorkoutManager.swift` | HKWorkoutSession for real-time HR streaming |

**Heart Rate Data Flow (Apple Watch → React):**
1. Watch: `WorkoutManager` captures HR via HKWorkoutSession
2. Watch: Sends via WCSession (multi-level: sendMessage → transferUserInfo → queue)
3. iPhone: `OndaWatchPlugin` receives and calls JS via WebView
4. React: `useWatchHeartRate` hook processes the data

**Autonomous Watch Session Features:**
- Three-level data delivery (real-time, background, queued)
- Auto-recovery of HKWorkoutSession on failures
- Extended Runtime Session with auto-restart
- Connection monitoring every 2 seconds
- HR validation (30-220 bpm range)

### Android (WebView)
| Component | Purpose |
|-----------|---------|
| `android-webview/` | Native Android WebView wrapper |
| `MainActivity.kt` | WebView + native bridges |
| Health Connect integration | Android health data API |
| Bluetooth HRM support | Direct BLE heart rate monitors |

### Backend (Supabase)
| Service | Usage |
|---------|-------|
| Auth | Email/password, Google OAuth, Apple Sign-In |
| Database | PostgreSQL - user profiles, progress, practice history |
| Storage | CDN for audio files |
| Edge Functions | Server-side logic (Hume AI integration, etc.) |

**Database Tables:**
- `user_profiles` - Display name, avatar, creation date
- `user_game_progress` - OND balance, completed practices, achievements
- `practice_sessions` - Practice history with biometric data

### CI/CD Pipeline
- **iOS:** GitHub Actions → Fastlane → TestFlight (automatic on push to main)
- **Android:** Manual APK builds via Android Studio or `npm run prepare:android`

## External Dependencies

### Third-Party Services
| Service | Purpose |
|---------|---------|
| Supabase | Backend-as-a-Service (Auth, DB, Storage, Functions) |
| RevenueCat | Subscription management |
| Google Analytics | Usage analytics |
| Meta Pixel | Marketing analytics |
| Google AdSense | Monetization (production only) |

### Native SDKs & APIs
| Platform | Integration |
|----------|-------------|
| iOS | HealthKit, WatchConnectivity, Apple Sign-In |
| Android | Health Connect, Bluetooth LE |
| Watch | HKWorkoutSession, HKLiveWorkoutBuilder |

### Key NPM Packages
- `@capacitor/core`, `@capacitor/ios` - Native bridge
- `@supabase/supabase-js` - Supabase client
- `@revenuecat/purchases-capacitor` - In-app purchases
- `capacitor-health` - HealthKit integration
- `i18next`, `react-i18next` - Translations
- `lucide-react` - Icons

### Audio Content
- Practice audio files hosted on Supabase Storage CDN
- Large files uploaded via TUS protocol (`scripts/upload-large-audio-tus.ts`)