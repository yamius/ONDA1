# Overview

ONDA is a mindfulness and wellness mobile application that combines gamification with biometric tracking. It guides users through consciousness development practices organized into progressive "circuits," rewarding completion with virtual currency (OND). The app integrates real-time health data from Google Health Connect (Android) and Apple HealthKit (iOS), plus Bluetooth heart rate monitors to provide adaptive, personalized meditation and breathing exercises.

The application is a React-based Progressive Web App (PWA) with native mobile support: Android via custom WebView wrapper and iOS via Capacitor framework. Features multilingual support (English, Spanish, Russian, Ukrainian, Chinese) and both light/dark themes. iOS deployment is fully automated via GitHub Actions and Fastlane for TestFlight distribution. The business vision is to provide an engaging and effective platform for personal growth, leveraging technology to make wellness practices accessible and motivating, with strong market potential in the digital health and self-improvement sectors.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

## iOS Deployment Infrastructure via Capacitor (November 24, 2025) ✅

**Feature:** Complete iOS app deployment setup with automated cloud builds via GitHub Actions.

**Implementation:**
- Installed Capacitor framework (`@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`)
- Installed `capacitor-health` plugin for unified HealthKit (iOS) + Health Connect (Android) support
- Created `useHealthKitHeartRate` React hook for iOS heart rate monitoring
- Configured Fastlane automation (Fastfile, Appfile, Matchfile) for TestFlight deployment
- Created GitHub Actions workflow (`ios-deploy.yml`) for automated iOS builds on macOS runners
- Updated `capacitor.config.ts` with iOS-specific settings and HealthKit plugin configuration
- Added HealthKit permissions to `ios/App/App/Info.plist`:
  - `NSHealthShareUsageDescription` - Permission to read heart rate data
  - `NSHealthUpdateUsageDescription` - Permission to write workout data
  - `UIBackgroundModes` - Background fetch capability

**Technical Details:**
1. **capacitor-health@7.0.0** - Cross-platform health data plugin:
   - iOS: Reads from Apple HealthKit (heart rate, workouts, steps, mindfulness)
   - Android: Reads from Google Health Connect (maintains existing implementation)
   - Unified API across both platforms

2. **useHealthKitHeartRate.ts** - React hook for iOS heart rate:
   - Platform detection via `Capacitor.getPlatform()`
   - Permission request: `Health.requestHealthPermissions()`
   - Heart rate polling from workouts: `Health.queryWorkouts()`
   - 10-second polling interval during meditation practices
   - Graceful fallback on web/Android (returns null, isAvailable=false)

3. **Fastlane Configuration:**
   - `Fastfile`: Automated build lanes (build, beta, release, setup_match)
   - `Appfile`: Apple Developer account configuration via env vars
   - `Matchfile`: Code signing certificates management with git storage
   - Uses App Store Connect API for authentication (no 2FA required)

4. **GitHub Actions Workflow (`ios-deploy.yml`):**
   - Triggers on push to `main` or manual dispatch
   - Runs on `macos-latest` runners (~10-15 min build time)
   - Steps: Checkout → Install deps → Build React → Sync Capacitor → Setup Xcode → Build & sign → Upload to TestFlight
   - Secrets managed via GitHub repository secrets (see SETUP_IOS.md)
   - Automatic artifact upload (IPA file + test reports)

5. **Deployment Strategy:**
   - **Direct Replit ↔ GitHub workflow** - No local Mac required!
   - Code push to GitHub → Automatic cloud build → TestFlight in 10-15 minutes
   - Free tier: ~200 macOS minutes/month (20 builds for public repos)
   - Match stores certificates in private GitHub repo

**Files Created:**
- `src/hooks/useHealthKitHeartRate.ts` - iOS HealthKit integration hook
- `fastlane/Fastfile` - Fastlane build automation
- `fastlane/Appfile` - Apple Developer configuration
- `fastlane/Matchfile` - Code signing setup
- `.github/workflows/ios-deploy.yml` - GitHub Actions workflow
- `SETUP_IOS.md` - Complete iOS deployment guide
- `capacitor.config.ts` - Updated with iOS config

**Files Modified:**
- `ios/App/App/Info.plist` - Added HealthKit permissions
- `replit.md` - Updated with iOS deployment info

**Key Learnings:**
1. **capacitor-health** provides unified API for both iOS HealthKit and Android Health Connect
2. GitHub Actions provides free macOS runners for iOS builds (no local Mac needed)
3. Fastlane Match stores certificates in git repo (encrypted with password)
4. App Store Connect API keys eliminate 2FA prompts in CI/CD
5. iOS requires privacy descriptions for all health data access
6. HealthKit permissions are all-or-nothing per data type (can't request specific workouts)

**Pending Setup (requires Apple Developer Account):**
- Apple Developer Program enrollment ($99/year)
- App registration in App Store Connect
- App Store Connect API key generation
- Certificates repository creation
- GitHub Secrets configuration
- First-time Match initialization (see SETUP_IOS.md)

---

# Recent Changes

## Edge-to-Edge Fullscreen Mode with Transparent Blurred System Bars (November 22, 2025) ✅

**Feature:** Telegram-style immersive fullscreen with semi-transparent blurred system bars.

**Implementation:**
- Status bar (top) and navigation bar (bottom) use **50% transparent** dark background (#80111827)
- Light icons/text on system bars for dark theme
- Edge-to-edge mode enabled - app draws behind system bars
- Content padding automatically adjusted for status bar height using WindowInsets API
- **Maximum frosted glass blur effect** behind system bars (like Telegram)
- Upper navigation uses `bg-black/10 backdrop-blur-xl` for extra blur/transparency

**Technical Details:**
1. **themes.xml** - Transparent system bars in app theme

2. **MainActivity.kt** - Edge-to-edge setup with transparent blurred bars:
   - `WindowCompat.setDecorFitsSystemWindows(window, false)` - Enable edge-to-edge
   - System bars colored **#80111827** (50% opacity for MAXIMUM blur effect)
   - `window.isStatusBarContrastEnforced = false` - Disable contrast enforcement (Android 11+)
   - `window.isNavigationBarContrastEnforced = false` - Cleaner transparency
   - Light content mode for status/navigation bars (light icons on dark background)
   - **WindowInsets handling via ViewCompat.setOnApplyWindowInsetsListener**:
     - Reads system bar heights from WindowInsetsCompat.Type.systemBars()
     - Saves values to class variables (statusBarHeight, navBarHeight)
     - **Injects CSS variables + applies padding directly to #root** in onPageFinished()
     - Direct padding fallback ensures white bar is eliminated
     - **Important:** CSS `env(safe-area-inset-*)` does NOT work in Android WebView without display cutouts

3. **index.css** - CSS padding and transparent background:
   ```css
   #root {
     padding-top: var(--safe-area-inset-top, 0px);
     padding-bottom: var(--safe-area-inset-bottom, 0px);
     background: transparent; /* Prevents white background showing through */
   }
   ```

4. **onda-level1-demo_27.tsx** - Main container and navigation with maximum blur:
   ```tsx
   <div className="h-full text-white overflow-x-hidden ...">
     <div className="bg-black/10 backdrop-blur-xl border-b border-purple-500/20 ...">
       {/* Upper navigation with EXTRA blur/transparency */}
     </div>
   </div>
   ```

**Files Modified:**
- `android-webview/app/src/main/res/values/themes.xml`
- `android-webview/app/src/main/java/com/onda/app/MainActivity.kt`
- `src/index.css`
- `src/onda-level1-demo_27.tsx`

**Key Learnings:**
1. CSS `env(safe-area-inset-*)` is iOS-specific and does NOT work in Android WebView
2. Must use WindowInsets API to inject CSS variables via JavaScript
3. **CSS injection must happen in onPageFinished()** to ensure DOM is loaded
4. **Apply padding directly to #root** as fallback if CSS vars don't work
5. **Use #80 for 50% opacity** in hex colors (#80RRGGBB) for maximum frosted glass
6. **Lower opacity = more blur visible** (50% better than 80% for Telegram effect)
7. **Disable contrast enforcement** for cleaner transparency on Android 11+
8. **CRITICAL:** Must set `webView.setBackgroundColor(Color.TRANSPARENT)` + `webView.isOpaque = false` BEFORE setContentView - CSS cannot change WebView's native background
9. **Set window.setBackgroundDrawable(null)** to prevent white background before WebView renders

---

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
- Web Bluetooth API for heart rate monitor connectivity
- Device motion API for activity detection
- Immersive fullscreen experience with system bars matching app background color.

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