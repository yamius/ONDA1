# Overview

ONDA is a mindfulness and wellness mobile application that combines gamification with biometric tracking. The app guides users through consciousness development practices organized into progressive "circuits" (levels), rewarding completion with virtual currency (OND). It integrates real-time health data from Google Health Connect and Bluetooth heart rate monitors to provide adaptive, personalized meditation and breathing exercises.

The application is built as a React-based Progressive Web App (PWA) with native Android WebView wrapper support, featuring multilingual support (English, Spanish, Russian, Ukrainian, Chinese) and both light/dark themes.

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
- JavaScript bridge pattern for Android native features
- Custom events (`hc-update`) for Health Connect data updates
- Window-attached methods (`window.Android.*`) for native API calls

**Health Data Integration:**
- Google Health Connect SDK integration via Android WebView
- Bluetooth Web API for heart rate monitor connectivity
- Real-time biometric data processing with DSP algorithms

**Rationale:** The bridge pattern allows the web app to access native device capabilities while maintaining a single codebase. This hybrid approach balances development speed with native feature access.

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

**Practice Audio Player:**
- Multi-track audio support with automatic track progression
- Fade in/out transitions for smooth audio experiences
- Volume control and playback state management
- Ambient sound mixing for meditation practices

**Rationale:** Audio is central to guided meditation. The multi-track system allows for progressive sessions without manual intervention.

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