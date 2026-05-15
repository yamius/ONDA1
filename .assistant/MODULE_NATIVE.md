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
3. iPhone: `ViewController` получает в `session(_:didReceiveMessage:)`
4. iPhone: Вызывает JS: `webView.evaluateJavaScript("window.receiveWatchHeartRate(\(hr))")`
5. React: `useWatchHeartRate` ловит через `window.receiveWatchHeartRate`

### Деплой
- GitHub Actions: `.github/workflows/ios-deploy.yml`
- Fastlane: `ios/fastlane/Fastfile`
- TestFlight: автоматическая загрузка после сборки

### Атрибуция: Tenjin + ATT + AppLovin Axon (рабочая комбинация)

**Зачем:** Tenjin — наш MMP. Через него install-постбэки уходят в AppLovin
Axon / Google Ads / Meta. Axon — основной платный канал, у него адекватный CPI.
Точная (детерминированная) атрибуция требует IDFA, а доступ к IDFA даёт
только ATT-разрешение.

**Как настроено сейчас (НЕ ломать):**

1. **`AppDelegate.swift` → `didFinishLaunching`** — только `TenjinSDK.getInstance(<key>)`.
   Это инициализация singleton, без сетевых вызовов. `connect()` здесь НЕ зовём.
2. **ATT-prompt** запрашивается из JS, на онбординг-экране 1 (тап Continue),
   через плагин `capacitor-plugin-app-tracking-transparency`
   (`AppTrackingTransparency.requestPermission()`).
3. **После ответа на ATT** (любого) JS зовёт `OndaTenjin.connect()` —
   нативный метод в `OndaTenjinPlugin.swift`, который делает `TenjinSDK.connect()`.
   Это и есть install-постбэк. Guard'ится статическим флагом — один раз за процесс.
4. **2-й+ холодный старт** (онбординг уже пройден): на маунте главного
   компонента читаем `AppTrackingTransparency.getStatus()`; если статус
   `!= notDetermined` — зовём `OndaTenjin.connect()` (плагин идемпотентен).
5. **`Info.plist`** обязан содержать `NSUserTrackingUsageDescription`.

**⚠️ Почему ATT нельзя «просто выключить»:**

ATT — это НЕ runtime-фича, которую можно отключить флагом. Apple проверяет
**бинарь**: если в собранном `.ipa` есть ссылка на `ASIdentifierManager`
(IDFA) или линкуется `AppTrackingTransparency.framework` — Apple **ОБЯЗЫВАЕТ**
показывать ATT-prompt. Билд 1.0.3 был зареджектен именно за это: фреймворк
залинкован, prompt не показан → reject.

Tenjin SDK линкует IDFA/ATT-фреймворки на уровне пода. Поэтому:

- ❌ Убрать вызов `requestPermission()` но оставить плагин/Tenjin = бинарь
  всё равно ссылается на IDFA → reject на следующем ревью.
- ❌ «Отключить функционал» без удаления подов — невозможно. Apple смотрит
  бинарь, не runtime-поведение.
- ✅ Единственный легальный путь без ATT — убрать ВСЕ поды, которые линкуют
  IDFA (Tenjin SDK + ATT-плагин), и убрать `NSUserTrackingUsageDescription`.
  Это убивает детерминированную атрибуцию — остаётся только SKAdNetwork.

**Вывод:** пока Tenjin в стеке — ATT-prompt обязателен. Выбор бинарный:
либо Tenjin + ATT, либо ни того ни другого.

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
