# Life Rhythm Artifact (Ритм Жизни)

The Life Rhythm artifact rewards users for maintaining a consistent sleep schedule over 7 consecutive days.

## Overview

| Property | Value |
|----------|-------|
| **Artifact ID** | `life-rhythm` |
| **Unlock Condition** | 7 consecutive days of regular sleep |
| **Bonus** | +100% OND |
| **Type** | Permanent (once unlocked, never removed) |

## Architecture

```mermaid
flowchart TB
    subgraph Watch["Apple Watch"]
        Sleep["Sleep App"]
    end
    
    subgraph iOS["iOS Device"]
        HK["HealthKit"]
        Plugin["HealthKitHeartRatePlugin.swift"]
    end
    
    subgraph App["React App"]
        RhythmStore["rhythmStore<br/>(sleep/rhythm.ts)"]
        Artifacts["artifacts[]<br/>state"]
        Bonus["calculateBonus()"]
        OND["OND Calculation"]
    end
    
    subgraph Backend["Supabase"]
        DB["user_game_progress<br/>artifacts[]"]
    end
    
    Sleep -->|Records sleep| HK
    HK -->|sleepAnalysis| Plugin
    Plugin -->|queryAllHealthData()| RhythmStore
    RhythmStore -->|progress >= 7| Artifacts
    Artifacts -->|bonus: 100| Bonus
    Bonus -->|multiplier| OND
    Artifacts -->|persist| DB
```

## Data Flow

### 1. Sleep Data Collection

```
Apple Watch → Health App → HealthKit → App
```

**HealthKit Query** (`HealthKitHeartRatePlugin.swift`):
```swift
private func querySleep(from: Date, to: Date, completion: ...) {
    let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis)
    // Returns: durationMin, sleepStart (HH:MM), wakeTime (HH:MM)
}
```

### 2. Rhythm Store (`src/sleep/rhythm.ts`)

Stores and analyzes sleep data:

```typescript
type DaySleep = {
  date: string;      // "2026-01-07"
  sleepStart: string; // "23:30"
  wakeTime: string;   // "07:15"
  durationMin: number; // 465
};
```

**Storage:** `localStorage` key `onda_rhythm_unified_v2`

### 3. Progress Calculation

A day is considered "good" if:
- Sleep time deviation ≤ 30 minutes from average
- Wake time deviation ≤ 30 minutes from average
- Duration ≥ 6 hours (360 minutes)

```typescript
const MAX_DEVIATION_MIN = 30;
const MIN_DURATION_MIN = 360;

// Streak counts consecutive good days from today backwards
progress(): number {
  // Returns 0-7 (capped at 7)
}
```

### 4. Artifact Activation

When `rhythmProgress >= 7`:

```typescript
// onda-level1-demo_27.tsx
useEffect(() => {
  if (rhythmProgress >= 7 && !hasLifeRhythmArtifact) {
    setArtifacts(prev => [...prev, {
      id: 'life-rhythm',
      name: 'Ритм Жизни',
      bonus: 100,
      isLifeRhythm: true
    }]);
  }
  // Artifact is PERMANENT - never removed
}, [rhythmProgress, artifacts]);
```

### 5. Bonus Application

All artifact bonuses are summed and applied to OND:

```typescript
const calculateBonus = () => {
  return artifacts.reduce((sum, a) => sum + a.bonus, 0);
};

// In finishPractice():
const artifactBonus = calculateBonus(); // e.g., 100
const bonusMultiplier = 1 + artifactBonus / 100; // 2.0
const totalOndWithBonus = ondReward.totalOnd * bonusMultiplier;
```

## Sync Schedule

| Event | Action |
|-------|--------|
| App start | `syncFromHealthKit()` |
| Every 30 seconds | `syncFromHealthKit()` + UI update |

## Metrics Available

```typescript
type LifeRhythmMetrics = {
  progress: number;           // 0-7 days streak
  avgSleepTime: string;       // "23:15"
  avgWakeTime: string;        // "07:30"
  avgDurationHours: number;   // 7.5
  sleepRegularity: number;    // 0-100%
  wakeRegularity: number;     // 0-100%
  overallScore: number;       // 0-100
  lastNightQuality: 'excellent' | 'good' | 'fair' | 'poor' | null;
};

// Usage:
const metrics = rhythmStore.getMetrics();
```

## UI Components

### Progress Display (before unlock)

```
🔒 Ритм Жизни
   Maintain consistent sleep for 7 days
   Progress: 4/7 days
   Bonus: +100% OND
```

### Unlocked Display

```
⭐ Ритм Жизни
   Bonus: +100% OND (active)
```

## Database Schema

Artifact is stored in `user_game_progress.artifacts` as JSON:

```json
{
  "artifacts": [
    {
      "id": "life-rhythm",
      "name": "Ритм Жизни",
      "bonus": 100,
      "isLifeRhythm": true
    }
  ]
}
```

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| No sleep data in HealthKit | Progress stays at 0 |
| Gap in sleep tracking | Streak resets to 0 |
| Sleep time varies > 30 min | Day not counted as "good" |
| Artifact already unlocked | Not added again (checked by ID) |
| User loses streak after unlock | **Artifact stays** (permanent) |

## Testing

### Manual Testing

1. Use Health app to add 7 days of consistent sleep data
2. Open ONDA app
3. Check Debug Monitor for `[App] Life Rhythm artifact unlocked!`
4. Verify +100% bonus in OND calculation logs

### Simulating Sleep Data

In Xcode Health app simulator or real device:
1. Open Health → Sleep → Add Data
2. Add entries for past 7 days with consistent times (e.g., 23:00 - 07:00)

## Related Files

| File | Purpose |
|------|---------|
| `src/sleep/rhythm.ts` | Sleep data storage and analysis |
| `src/onda-level1-demo_27.tsx` | Artifact activation logic |
| `ios/App/App/HealthKitHeartRatePlugin.swift` | HealthKit sleep query |
| `src/plugins/healthKitHeartRate.ts` | TypeScript plugin interface |

## See Also

- [Architecture Overview](./overview.md)
- [Heart Rate Integration](./heart-rate-integration.md)
