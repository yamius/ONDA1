# Current Stage

## Текущие задачи (TODO)
- [ ] Подключение платёжных систем для оформления платной подписки
- [ ] Тестирование Apple Watch практик через TestFlight
- [ ] Улучшение UX практик

## Недавно сделано (DONE)
- [x] Watch практики Part 1 — полная реализация системы практик на Apple Watch
- [x] PracticeSessionView — экран практики с направляющими текстами (15-сек интервалы) без таймера/HR
- [x] WCSession синхронизация — iPhone → Watch передача практик, Watch → iPhone события start/end
- [x] 12 практик Part 1 с полными guiding texts (3мин=12 текстов, 6мин=24, 12мин=48)
- [x] useWatchPracticeAudio — автоматическое воспроизведение аудио на iPhone при запуске практики с часов
- [x] Life Rhythm сервис — автоматическое чтение времени сна из HealthKit
- [x] Метрики ритма: регулярность засыпания/пробуждения, качество сна, streak
- [x] Оптимизация структуры проекта — добавлены `.assistant/`, обновлены `replit.md` и `README.md`
- [x] Унифицированы reward mechanics — обе практики используют vitalsRef паттерн
- [x] Исправлен расчёт OND: 15% completion + 40% stress + 45% energy
- [x] bestMetrics отслеживает лучшие показатели за сессию
- [x] Добавлена папка `.assistant/` с документацией для ИИ

## Важные файлы для контекста ИИ
- `.assistant/PHILOSOPHY.md` — правила работы над проектом
- `.assistant/AI_INSTRUCTIONS.md` — быстрый старт сессии
- `.assistant/MODULE_FRONTEND.md` — архитектура React PWA
- `.assistant/MODULE_NATIVE.md` — архитектура iOS/Android + Apple Watch
- `.assistant/MODULE_SUPABASE.md` — архитектура бэкенда
- `.assistant/PRACTICES_AUDIO.md` — структура практик, ID, аудио файлы

---

# Overview

ONDA is a mindfulness and wellness mobile application that integrates gamification with biometric tracking. It guides users through progressive "Части" (Parts, formerly "circuits") of consciousness development practices, rewarding completion with virtual currency (OND). The app leverages real-time health data from Google Health Connect (Android), Apple HealthKit (iOS), Apple Watch, and Bluetooth heart rate monitors to provide adaptive, personalized meditation and breathing exercises.

The application is a React-based Progressive Web App (PWA) with native mobile support via a custom WebView wrapper for Android and Capacitor for iOS. It features multilingual support (English, Spanish, Russian, Ukrainian, Chinese) and both light/dark themes. The business vision is to provide an engaging and effective platform for personal growth, making wellness practices accessible and motivating, with strong market potential in the digital health and self-improvement sectors.

# User Preferences

Preferred communication style: Simple, everyday language.

**Development Environment Constraints:**
- User works on **MacinCloud** (remote Mac) — NO local Mac available
- **Cannot connect iPhone to Mac** for debugging (no USB access)
- **No Safari Web Inspector** access for iOS console logs
- Workflow: **Replit → GitHub → GitHub Actions → TestFlight** only
- All iOS testing done via TestFlight builds on physical device
- Russian language preferred for UI and communication

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
- `useHealthKitData` React hook for reading all HealthKit data (steps, calories, sleep, vitals, body measurements).
- `HealthKitCompactPanel` component displays all health metrics in ConnectionModal on iOS.
- Apple Watch integration via WCSession for real-time heart rate streaming during meditation.

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

**Структура прогрессии:**
- **Уровень** = 3 Части
- **Часть** (Part, бывший "контур"/circuit) = набор практик
- Всего 12 частей, 4 уровня

**Уровень 1 — Body (Тело):**
  - Часть 1: I Am (Я есть)
  - Часть 2: I Move (Я двигаюсь)
  - Часть 3: I Adapt (Я адаптируюсь)

**Уровень 2 — Emotions (Эмоции):**
  - Часть 4: I Maneuver (Я маневрирую)
  - Часть 5: I Guard Territory (Я охраняю территорию)
  - Часть 6: I Am in the Pack (Я в стае)

**Уровень 3 — Mind (Разум):**
  - Часть 7: I Distinguish (Я различаю)
  - Часть 8: I Focus (Я фокусируюсь)
  - Часть 9: I Plan (Я планирую)

**Уровень 4 — Society (Общество):**
  - Часть 10: I Speak (Я говорю)
  - Часть 11: I Exchange (Я обмениваюсь)
  - Часть 12: I Collaborate (Я сотрудничаю)

- Практики внутри каждой части
- Награды OND за выполнение практик
- Последовательная разблокировка частей и уровней

**Achievement System:**
- Artifact collection.
- Historical tracking of practice sessions.
- Sleep rhythm monitoring.

## Apple Watch Integration

**Файлы watchOS приложения:**
- `ios/App/watchkitapp Watch App/ContentView.swift` — UI экраны (MainView, PracticeSessionView)
- `ios/App/watchkitapp Watch App/WorkoutManager.swift` — HR + WCSession
- `ios/App/watchkitapp Watch App/OndaWatchApp.swift` — точка входа

**Файлы iPhone (WCSession):**
- `ios/App/App/OndaWatchPlugin.swift` — Capacitor plugin + OndaWatchManager + PracticeData

**Функционал часов:**
- Real-time HR streaming на iPhone через WCSession
- Выбор текущей Части (1-12) через NavigationLink picker
- Список практик текущей части с кнопками запуска
- Экран практики с таймером, HR, направляющими текстами (смена каждые 15 сек с fade)
- Кнопка завершения практики с уведомлением iPhone

**Коммуникация Watch ↔ iPhone:**
- Watch → iPhone: `heartRate`, `requestPractices`, `startPractice`, `endPractice`
- iPhone → Watch: `practices` (массив практик с guidingTexts)
- `sendMessage` — когда iPhone reachable
- `transferUserInfo` — надёжная доставка в фоне
- iPhone уведомляет JS через `notifyListeners("practiceStarted"/"practiceEnded")`

**Практики Part 1:**
- 12 практик с полными guiding texts (3мин=12, 6мин=24, 12мин=48 текстов)
- Данные хранятся в `part1Practices` в OndaWatchPlugin.swift
- Текст меняется каждые 15 секунд с 0.5s fade анимацией

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