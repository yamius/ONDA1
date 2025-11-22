# Overview

ONDA is a mindfulness and wellness mobile application that combines gamification with biometric tracking. It guides users through consciousness development practices organized into progressive "circuits," rewarding completion with virtual currency (OND). The app integrates real-time health data from Google Health Connect and Bluetooth heart rate monitors to provide adaptive, personalized meditation and breathing exercises.

The application is a React-based Progressive Web App (PWA) with native Android WebView wrapper support, featuring multilingual support (English, Spanish, Russian, Ukrainian, Chinese) and both light/dark themes. The business vision is to provide an engaging and effective platform for personal growth, leveraging technology to make wellness practices accessible and motivating, with strong market potential in the digital health and self-improvement sectors.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

## Edge-to-Edge Fullscreen Mode with Transparent Blurred System Bars (November 22, 2025) ✅

**Feature:** Telegram-style immersive fullscreen with semi-transparent blurred system bars.

**Implementation:**
- Status bar (top) and navigation bar (bottom) use **80% transparent** dark background (#CC111827)
- Light icons/text on system bars for dark theme
- Edge-to-edge mode enabled - app draws behind system bars
- Content padding automatically adjusted for status bar height using WindowInsets API
- **Frosted glass blur effect** behind system bars (like Telegram)

**Technical Details:**
1. **themes.xml** - Transparent system bars in app theme

2. **MainActivity.kt** - Edge-to-edge setup with transparent blurred bars:
   - `WindowCompat.setDecorFitsSystemWindows(window, false)` - Enable edge-to-edge
   - System bars colored **#CC111827** (80% opacity for blur effect)
   - `window.isStatusBarContrastEnforced = false` - Disable contrast enforcement (Android 11+)
   - `window.isNavigationBarContrastEnforced = false` - Cleaner transparency
   - Light content mode for status/navigation bars (light icons on dark background)
   - **WindowInsets handling via ViewCompat.setOnApplyWindowInsetsListener**:
     - Reads system bar heights from WindowInsetsCompat.Type.systemBars()
     - Saves values to class variables (statusBarHeight, navBarHeight)
     - **Injects CSS variables in WebViewClient.onPageFinished()** (ensures DOM is loaded)
     - **Important:** CSS `env(safe-area-inset-*)` does NOT work in Android WebView without display cutouts

3. **index.css** - CSS padding and transparent background:
   ```css
   #root {
     padding-top: var(--safe-area-inset-top, 0px);
     padding-bottom: var(--safe-area-inset-bottom, 0px);
     background: transparent; /* Prevents white background showing through */
   }
   ```

4. **onda-level1-demo_27.tsx** - Main container uses `h-full` instead of `min-h-screen`:
   ```tsx
   <div className="h-full text-white overflow-x-hidden ...">
     <div className="bg-black/20 backdrop-blur-sm border-b ...">
       {/* Upper navigation with blur effect */}
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
4. **Use #CC prefix for 80% opacity** in hex colors (#CCRRGGBB)
5. **Disable contrast enforcement** for cleaner transparency on Android 11+

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