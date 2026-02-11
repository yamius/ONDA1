# Firebase Analytics - Быстрый старт

## ⚠️ Текущий статус

Firebase Analytics **подготовлен**, но **отключен** до добавления конфигурационных файлов.

См. `FIREBASE_ACTIVATION.md` для активации.

## 🎯 Что нужно сделать

### 1️⃣ Firebase Console (5 минут)

1. Откройте https://console.firebase.google.com/
2. Создайте проект **ONDA** (включите Google Analytics)
3. Добавьте **iOS приложение**:
   - Bundle ID: `com.onda-life.ios`
   - Скачайте **`GoogleService-Info.plist`**
4. Добавьте **Android приложение**:
   - Package name: `com.onda.app`
   - Скачайте **`google-services.json`**

### 2️⃣ Добавьте файлы в проект

```bash
# iOS
cp ~/Downloads/GoogleService-Info.plist ios/App/App/

# Android
cp ~/Downloads/google-services.json android-webview/app/
```

### 3️⃣ Установите зависимости

```bash
# Установка npm пакетов
npm install

# iOS: Установка CocoaPods
cd ios/App && pod install && cd ../..
```

**Примечание:** Используется `@capacitor-community/firebase-analytics` v7.0.0 для совместимости с Capacitor 7.

### 4️⃣ Коммит и push

```bash
git add ios/App/App/GoogleService-Info.plist
git add android-webview/app/google-services.json
git commit -m "Add Firebase Analytics configuration"
git push
```

### 5️⃣ Деплой

GitHub Actions автоматически:
- ✅ Соберёт iOS с Firebase → TestFlight
- ✅ Соберёт Android с Firebase → APK

### 6️⃣ Проверка

#### Быстрая проверка (Debug APK + DebugView)

1. Соберите **Debug APK** через GitHub Actions:
   - Actions → Build Android APK → Run workflow
   - **Build type:** `debug` ⬅️ Важно!
2. Установите `app-debug.apk` на устройство
3. Включите DebugView:
   ```bash
   adb shell setprop debug.firebase.analytics.app com.onda.life
   ```
4. Откройте приложение
5. Проверьте **Firebase Console → Analytics → DebugView**
6. События появляются **мгновенно** ⚡

#### Обычная проверка (Release APK)

1. Установите приложение из TestFlight/APK
2. Откройте приложение
3. Через 1-2 минуты проверьте **Firebase Console → Analytics → Events**
4. Должны появиться события: `first_open`, `app_open`

**Подробнее:** См. `docs/ANDROID_DEBUG_BUILD.md`

## 📊 Использование в коде

```typescript
import { 
  initializeAnalytics, 
  trackEvent,
  trackPracticeComplete,
  trackUserRegistration,
} from './services/analytics';

// При старте приложения
await initializeAnalytics();

// Трекинг событий
await trackEvent('meditation_start', { duration: 600 });

// Трекинг завершения практики
await trackPracticeComplete({
  practiceType: 'meditation',
  duration: 600,
  ondReward: 50,
  stressDelta: -15,
  energyDelta: 20,
  completionRate: 100,
});

// Трекинг регистрации
await trackUserRegistration('email');
```

## 🔗 Связь с рекламой

### Google Ads (автоматически)
1. Firebase Console → **Project settings → Integrations**
2. Найдите **Google Ads** → **Link**
3. Выберите аккаунт → **Link**

### Meta Ads (требует Conversions API)
Используйте серверные события через Supabase Edge Function.

## 📚 Полная документация

См. `docs/FIREBASE_ANALYTICS_SETUP.md`

---

**Готово!** 🚀 Firebase Analytics работает на обеих платформах.
