# MODULE_NATIVE — Архитектура нативных приложений ONDA

## iOS (Capacitor)

### Структура
```
ios/
├── App/
│   ├── App/
│   │   ├── AppDelegate.swift
│   │   ├── ViewController.swift
│   │   └── Info.plist
│   └── App.xcodeproj
├── OndaWatch Watch App/       # Apple Watch приложение
│   ├── ContentView.swift
│   ├── WorkoutManager.swift   # Тренировка + HR streaming
│   └── PhoneConnector.swift   # WCSession связь с iPhone
└── Podfile
```

### Ключевые компоненты

| Компонент | Назначение |
|-----------|------------|
| `ViewController.swift` | WKWebView + WCSession делегат |
| `WorkoutManager.swift` | Запуск тренировки, получение HR с часов |
| `PhoneConnector.swift` | Отправка HR на iPhone через WCSession |

### Поток данных HR (Apple Watch → React)
1. Watch: `WorkoutManager` получает HR через HKWorkoutSession
2. Watch: `PhoneConnector` отправляет через `WCSession.sendMessage()`
3. iPhone: `OndaWatchPlugin` получает, вызывает `notifyListeners("heartRate")`
4. React: `useWatchHeartRate` ловит событие

### Практики на Apple Watch
1. Watch: пользователь выбирает часть (1-12) и практику
2. Watch → iPhone: `requestPractices` запрашивает данные
3. iPhone → Watch: `sendPractices()` отправляет список практик с guidingTexts
4. Watch: `PracticeSessionView` показывает текст (меняется каждые 15 сек)
5. Watch → iPhone: `startPractice` / `endPractice` события
6. iPhone: `useWatchPracticeAudio` запускает/останавливает аудио

**Ключевые файлы:**
- `ios/App/App/OndaWatchPlugin.swift` — plugin + практики Part 1
- `ios/App/watchkitapp Watch App/ContentView.swift` — UI часов
- `src/hooks/useWatchPracticeAudio.ts` — воспроизведение аудио
- `.assistant/PRACTICES_AUDIO.md` — полная документация практик

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
