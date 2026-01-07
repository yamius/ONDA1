# ONDA Life Documentation

Welcome to the ONDA Life documentation. This guide will help you navigate through our documentation structure.

## Documentation Structure

| Section | Description | Audience |
|---------|-------------|----------|
| [Getting Started](./getting-started/) | Setup guides and quickstart tutorials | New developers |
| [Architecture](./architecture/) | System design and technical solutions | Core developers |
| [Guides](./guides/) | Step-by-step technical guides | All developers |
| [Archive](./archive/) | Historical notes and legacy docs | Reference only |

---

## Getting Started

Start here if you're new to the project.

- **[Setup iOS](./getting-started/setup-ios.md)** — iOS development environment setup
- **[Build APK](./getting-started/build-apk.md)** — Android APK build guide
- **[Build APK (Android 45)](./getting-started/build-apk-android.md)** — Android API 45 specific build
- **[CI/CD Quickstart](./getting-started/ci-cd-quickstart.md)** — Quick CI/CD setup
- **[Audio CDN Quickstart](./getting-started/audio-cdn-quickstart.md)** — Audio hosting setup

---

## Architecture

Technical decisions and system design documentation.

- **[Architecture Overview](./architecture/overview.md)** — High-level system diagram and data flows
- **[Heart Rate Integration](./architecture/heart-rate-integration.md)** — How heart rate monitoring works
- **[HealthKit Solution](./architecture/healthkit-solution.md)** — iOS HealthKit integration architecture
- **[Permissions Solution](./architecture/permissions-solution.md)** — Unified permissions system design
- **[Emotional Check Fix](./architecture/emotional-check-fix.md)** — Base64 encoding solution for emotion analysis

---

## Guides

Detailed technical guides for specific tasks.

### Apple Watch
- **[Apple Watch Autonomy](./guides/apple-watch-autonomy.md)** — Watch app autonomous operation
- **[Watch Autonomy Summary](./guides/watch-autonomy-summary.md)** — Summary of watch autonomy features
- **[Watch Autonomy Fix](./guides/watch-autonomy-fix.md)** — Fixing watch connection issues
- **[Watch Testing](./guides/watch-testing.md)** — Testing guide for watchOS app

### Android & Health Connect
- **[Android Health Connect](./guides/android-health-connect.md)** — Health Connect integration
- **[Smoke Test Android](./guides/smoke-test-android.md)** — Android smoke testing checklist

### Xiaomi & Bluetooth
- **[Xiaomi Health Connect](./guides/xiaomi-health-connect.md)** — Xiaomi band setup with Health Connect
- **[Xiaomi Realtime HR](./guides/xiaomi-realtime-hr.md)** — Real-time heart rate from Xiaomi devices
- **[Xiaomi Data Analysis](./guides/xiaomi-data-analysis.md)** — Data interception analysis (RU)
- **[Bluetooth Tracker](./guides/bluetooth-tracker.md)** — Bluetooth tracker integration guide

### CI/CD & Infrastructure
- **[CI/CD Setup](./guides/ci-cd-setup.md)** — Full CI/CD configuration
- **[GitHub Actions](./guides/github-actions.md)** — GitHub Actions workflow setup
- **[Audio CDN Setup](./guides/audio-cdn-setup.md)** — Audio CDN infrastructure
- **[Upload Large Files](./guides/upload-large-files.md)** — Handling large file uploads
- **[Keystore Regeneration](./guides/keystore-regeneration.md)** — Android keystore management

---

## Archive

Legacy documentation kept for reference.

- [Google OAuth Branding (RU)](./archive/google-oauth-branding-ru.md)
- [Watch Autonomy Done (RU)](./archive/watch-autonomy-done-ru.md)
- [Read Me First (RU)](./archive/read-me-first-ru.md)
- [Replit Config](./archive/replit.md)

---

## Quick Links

| Need to... | Go to |
|------------|-------|
| Set up development environment | [Getting Started](./getting-started/) |
| Understand system architecture | [Architecture](./architecture/) |
| Build and deploy | [CI/CD Setup](./guides/ci-cd-setup.md) |
| Work with Apple Watch | [Watch Guides](./guides/apple-watch-autonomy.md) |
| Integrate health data | [Health Connect](./guides/android-health-connect.md) |
