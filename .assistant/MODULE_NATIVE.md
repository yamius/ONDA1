# MODULE_NATIVE — Архитектура нативных приложений ONDA

## iOS (Capacitor)

### Структура
```
ios/
├── App/
│   ├── App/
│   │   ├── AppDelegate.swift
│   │   ├── ViewController.swift
│   │   ├── OndaWatchPlugin.swift    # Capacitor плагин для Watch
│   │   └── Info.plist
│   └── App.xcodeproj
├── OndaWatch Watch App/              # Apple Watch приложение
│   ├── OndaWatchApp.swift            # Точка входа
│   ├── ContentView.swift             # UI часов
│   ├── WorkoutManager.swift          # Тренировка + HR + Extended Session
│   └── NotificationManager.swift     # Локальные уведомления
└── Podfile
```

### Ключевые компоненты

| Компонент | Назначение |
|-----------|------------|
| `OndaWatchPlugin.swift` | Capacitor плагин для связи с Watch |
| `WorkoutManager.swift` | HKWorkoutSession + WCSession + Extended Runtime |
| `NotificationManager.swift` | Локальные уведомления для пробуждения app |
| `ContentView.swift` | UI часов с кнопкой разрешения HealthKit |

### Поток данных HR (Apple Watch → React)
1. Watch: `WorkoutManager` запускает HKWorkoutSession
2. Watch: Получает HR через `HKLiveWorkoutBuilder`
3. Watch: Отправляет через `WCSession.sendMessage(["heartRate": hr])`
4. iPhone: `OndaWatchPlugin` получает в `session(_:didReceiveMessage:)`
5. iPhone: Эмитит событие `heartRate` в JavaScript
6. React: `useWatchHeartRate` получает через listener

### Система пробуждения Watch App

```
iPhone открывает ONDA
    ↓
OndaWatch.startRealtime() → transferUserInfo(["type": "start"])
    ↓
Watch получает команду в handleCommand()
    ↓
Проверка WKApplication.applicationState:
    ├── .active → startWorkout() сразу
    └── иначе → NotificationManager.showOpenAppNotification()
                    ↓
              Вибрация + уведомление "Откройте для медитации"
                    ↓
              Пользователь нажимает → app открывается → workout стартует
```

### Extended Runtime Session
- `WKExtendedRuntimeSession` предотвращает засыпание часов
- Тип: mindfulness (до 1 часа активности)
- Автоматический перезапуск при истечении

### Деплой
- GitHub Actions: `.github/workflows/ios-deploy.yml`
- Fastlane: `ios/fastlane/Fastfile`
- TestFlight: автоматическая загрузка после сборки

---

## Android (WebView)

### Структура
```
android-webview/
├── app/
│   ├── src/main/
│   │   ├── java/.../
│   │   │   ├── MainActivity.kt         # WebView + JS Bridge
│   │   │   └── HealthConnectManager.kt # Health Connect API
│   │   ├── res/
│   │   └── AndroidManifest.xml
│   └── build.gradle
└── build.gradle
```

### JavaScript Bridge

Методы доступны через `window.Android`:

```typescript
interface AndroidBridge {
  openExternalBrowser(url: string): void;
  requestHealthConnectPermissions(): void;
  getHealthConnectData(): string;
  isHealthConnectAvailable(): boolean;
  setImmersiveMode(enabled: boolean): void;
}
```

### События от Android
- `hc-update` — новые данные Health Connect
- `hc-permissions-denied` — отказ в разрешениях
- `oauth-success` — успешная OAuth авторизация

### Health Connect
Читаемые типы данных:
- Steps, Distance, Calories
- Heart Rate, Resting Heart Rate, HRV
- Blood Pressure, Blood Oxygen, Body Temperature
- Sleep, Weight, Height, Body Fat
- Respiratory Rate, Hydration
