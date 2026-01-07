# Architecture Overview

This document provides a high-level overview of the ONDA Life system architecture.

## System Diagram

```mermaid
flowchart TB
    subgraph Devices["User Devices"]
        subgraph iOS["iOS"]
            iPhone["iPhone App<br/>(Capacitor)"]
            Watch["Apple Watch<br/>(WatchKit)"]
        end
        subgraph Android["Android"]
            AndroidApp["Android App<br/>(WebView + Kotlin)"]
            Tracker["Bluetooth Tracker<br/>(Xiaomi/Polar)"]
        end
    end

    subgraph Frontend["React PWA (TypeScript)"]
        Components["Components<br/>Practices, Modals, UI"]
        Hooks["Hooks<br/>useWatchHeartRate<br/>useHealthKitData<br/>usePermissions"]
        Services["Services<br/>PermissionsService<br/>AudioCache"]
        Utils["Utils<br/>ondCalculator<br/>rhythm"]
    end

    subgraph Native["Native Layer"]
        OndaWatch["OndaWatchPlugin<br/>(Swift)"]
        HealthKit["HealthKit<br/>(iOS)"]
        HealthConnect["Health Connect<br/>(Android)"]
        BT["BluetoothManager<br/>(Kotlin)"]
    end

    subgraph Backend["Supabase Backend"]
        Auth["Auth"]
        DB["PostgreSQL<br/>user_profiles<br/>practice_rewards<br/>user_progress"]
        Storage["Storage<br/>Audio Files"]
        Edge["Edge Functions<br/>analyze-emotion"]
    end

    subgraph External["External Services"]
        OpenAI["OpenAI API<br/>(GPT-4 Vision)"]
    end

    %% Connections
    iPhone <--> Frontend
    AndroidApp <--> Frontend
    Watch <-->|WCSession| OndaWatch
    Tracker <-->|BLE| BT

    OndaWatch <--> Hooks
    HealthKit <--> Hooks
    HealthConnect <--> Hooks
    BT <--> Hooks

    Components <--> Hooks
    Hooks <--> Services
    Services <--> Utils

    Frontend <-->|Supabase Client| Auth
    Frontend <-->|Supabase Client| DB
    Frontend <-->|Fetch| Storage
    Frontend <-->|Invoke| Edge

    Edge -->|API Call| OpenAI
```

## Component Overview

### Frontend (React PWA)

| Component | Purpose | Key Files |
|-----------|---------|-----------|
| **Components** | UI elements, practice screens, modals | `src/components/`, `src/onda-level1-demo_27.tsx` |
| **Hooks** | State management, native bridge | `src/hooks/useWatchHeartRate.ts`, `useHealthKitData.ts` |
| **Services** | Business logic, permissions | `src/services/PermissionsService.ts` |
| **Utils** | Calculations, helpers | `src/utils/ondCalculator.ts`, `src/sleep/rhythm.ts` |

### Native Layer

| Platform | Component | Purpose |
|----------|-----------|---------|
| **iOS** | `OndaWatchPlugin.swift` | Bridge between React and Watch via WCSession |
| **iOS** | `WorkoutManager.swift` | Heart rate monitoring on Watch |
| **Android** | `HealthConnectManager.kt` | Health Connect integration |
| **Android** | `BluetoothManager.kt` | BLE tracker connection |

### Backend (Supabase)

| Service | Purpose |
|---------|---------|
| **Auth** | User authentication (email, OAuth) |
| **PostgreSQL** | User data, practice history, rewards |
| **Storage** | Audio files for practices (~500MB) |
| **Edge Functions** | Emotion analysis via OpenAI |

---

## Data Flows

### 1. Heart Rate Monitoring (Apple Watch)

```mermaid
sequenceDiagram
    participant W as Apple Watch
    participant WM as WorkoutManager
    participant WC as WCSession
    participant P as OndaWatchPlugin
    participant H as useWatchHeartRate
    participant UI as Practice UI

    W->>WM: Start workout session
    WM->>WM: Query HealthKit (HKAnchoredObjectQuery)
    loop Every heartbeat
        WM->>WC: sendMessage({heartRate: 72})
        WC->>P: session(_:didReceiveMessage:)
        P->>H: notifyListeners("heartRateUpdate")
        H->>UI: setHeartRate(72)
    end
```

### 2. Practice Execution Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Practice UI
    participant AP as RemoteAudioPlayer
    participant C as ondCalculator
    participant DB as Supabase DB

    U->>UI: Start Practice
    UI->>AP: Play audio (isPlaying=true)
    AP->>AP: Load from cache or fetch

    loop During practice
        UI->>UI: Collect HR metrics
        UI->>UI: Update progress bar
    end

    U->>UI: Complete Practice
    UI->>C: calculatePracticeOnd(metrics)
    C-->>UI: {totalOnd, breakdown}
    UI->>DB: Insert practice_rewards
    UI->>DB: Upsert user_progress
```

### 3. Emotion Analysis Flow

```mermaid
sequenceDiagram
    participant U as User
    participant M as EmotionalCheckModal
    participant EF as Edge Function
    participant AI as OpenAI GPT-4V

    U->>M: Take selfie
    M->>M: Convert to base64
    M->>EF: invoke("analyze-emotion", {image})
    EF->>AI: POST /chat/completions
    AI-->>EF: {emotions, stress, energy}
    EF-->>M: Analysis result
    M->>U: Display emotional state
```

---

## Tech Stack Summary

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | React | 18.x |
| **Language** | TypeScript | 5.x |
| **Build** | Vite | 5.x |
| **Styling** | TailwindCSS | 3.x |
| **iOS Wrapper** | Capacitor | 6.x |
| **iOS Native** | Swift | 5.x |
| **watchOS** | WatchKit + HealthKit | watchOS 9+ |
| **Android Wrapper** | WebView | - |
| **Android Native** | Kotlin | 1.9.x |
| **Backend** | Supabase | - |
| **Database** | PostgreSQL | 15.x |
| **AI** | OpenAI GPT-4 Vision | - |

---

## Key Architecture Decisions

### Why Capacitor + WebView?

- **Single codebase** for iOS and Android
- **Native access** when needed (HealthKit, Watch, Bluetooth)
- **Fast iteration** — web updates don't require app store review

### Why Supabase?

- **All-in-one** backend (auth, db, storage, functions)
- **Real-time** capabilities for future features
- **PostgreSQL** with Row Level Security

### Why Watch uses Workout Session?

- **Background execution** — keeps app alive when screen is off
- **Continuous HR** — HKAnchoredObjectQuery provides real-time data
- **Battery optimized** — Apple's recommended approach

---

## See Also

- [Heart Rate Integration](./heart-rate-integration.md) — Detailed HR implementation
- [Permissions Solution](./permissions-solution.md) — Permission handling architecture
- [HealthKit Solution](./healthkit-solution.md) — iOS health data integration
