# Firebase Analytics Setup Guide

Пошаговая инструкция по настройке Firebase Analytics для iOS и Android приложений ONDA.

## 📋 Обзор

Firebase Analytics интегрирован в проект для:
- **Отслеживания конверсий** для Google Ads и Meta Ads
- **Атрибуции рекламного трафика** (откуда пришли пользователи)
- **Анализа поведения пользователей** (дополняет Supabase аналитику)

## 🎯 Архитектура

```
┌─────────────────────────────────────────────────────────┐
│                     React App (Web)                      │
│                                                          │
│  src/services/analytics.ts - Универсальный сервис        │
│                                                          │
├──────────────────────┬──────────────────────────────────┤
│                      │                                   │
│   iOS (Capacitor)    │      Android (Native Bridge)     │
│                      │                                   │
│  @capacitor-firebase │   window.Android.trackEvent()    │
│  /analytics plugin   │   MainActivity.kt                │
│                      │                                   │
└──────────────────────┴──────────────────────────────────┘
                       │
                       ▼
              Firebase Analytics
                       │
                       ▼
        ┌──────────────┴──────────────┐
        │                             │
   Google Ads                    Meta Ads
   (автоматически)          (через Conversions API)
```

## 🔧 Шаг 1: Создание проекта в Firebase Console

### 1.1 Создайте проект

1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Нажмите **"Add project"** или **"Создать проект"**
3. Введите название: **ONDA**
4. Включите **Google Analytics** (обязательно!)
5. Выберите или создайте **Google Analytics account**

### 1.2 Добавьте iOS приложение

1. В Firebase Console выберите проект **ONDA**
2. Нажмите на иконку **iOS** (⚙️ → Project settings → Your apps)
3. Заполните форму:
   - **iOS bundle ID**: `com.onda-life.ios` (из `capacitor.config.ts`)
   - **App nickname**: ONDA iOS
   - **App Store ID**: (оставьте пустым, если ещё не опубликовано)
4. Нажмите **"Register app"**
5. **Скачайте `GoogleService-Info.plist`**

### 1.3 Добавьте Android приложение

1. В Firebase Console выберите проект **ONDA**
2. Нажмите на иконку **Android**
3. Заполните форму:
   - **Android package name**: `com.onda.app` (из `android-webview/app/build.gradle`)
   - **App nickname**: ONDA Android
   - **Debug signing certificate SHA-1**: (необязательно для Analytics)
4. Нажмите **"Register app"**
5. **Скачайте `google-services.json`**

## 📁 Шаг 2: Добавление конфигурационных файлов

### 2.1 iOS: Добавьте `GoogleService-Info.plist`

```bash
# Скопируйте скачанный файл в папку iOS приложения
cp ~/Downloads/GoogleService-Info.plist ios/App/App/GoogleService-Info.plist
```

**Важно:** Файл должен быть в папке `ios/App/App/`, рядом с `Info.plist`.

### 2.2 Android: Добавьте `google-services.json`

```bash
# Скопируйте скачанный файл в папку Android приложения
cp ~/Downloads/google-services.json android-webview/app/google-services.json
```

**Важно:** Файл должен быть в папке `android-webview/app/`, рядом с `build.gradle`.

### 2.3 Коммит файлов в Git

```bash
git add ios/App/App/GoogleService-Info.plist
git add android-webview/app/google-services.json
git commit -m "Add Firebase configuration files for iOS and Android"
git push
```

**Примечание:** Эти файлы содержат только публичные API ключи, безопасно коммитить в Git.

## 📦 Шаг 3: Установка зависимостей

### 3.1 Установите npm пакеты

```bash
npm install
```

Это установит `@capacitor-firebase/analytics` (уже добавлен в `package.json`).

### 3.2 iOS: Установите CocoaPods

```bash
cd ios/App
pod install
cd ../..
```

Это установит Firebase SDK для iOS через CocoaPods.

### 3.3 Android: Синхронизация Gradle

Android зависимости установятся автоматически при следующей сборке через GitHub Actions.

Если собираете локально:
```bash
cd android-webview
./gradlew build
cd ..
```

## 🚀 Шаг 4: Деплой через GitHub Actions

### 4.1 Push изменений

```bash
git push origin main
```

### 4.2 GitHub Actions автоматически:

**iOS:**
- Установит CocoaPods зависимости
- Соберёт приложение с Firebase SDK
- Загрузит в TestFlight

**Android:**
- Установит Gradle зависимости
- Соберёт APK/AAB с Firebase SDK
- (Опционально) Загрузит в Google Play Console

### 4.3 Проверка сборки

Откройте [GitHub Actions](https://github.com/YOUR_USERNAME/ONDA1/actions) и убедитесь, что сборка прошла успешно.

## ✅ Шаг 5: Проверка работы аналитики

### 5.1 Установите приложение

- **iOS**: Скачайте из TestFlight
- **Android**: Установите APK из GitHub Actions artifacts

### 5.2 Откройте приложение

При первом запуске должны автоматически отправиться события:
- `first_open` (автоматически от Firebase)
- `app_open` (ваш код)

### 5.3 Проверьте Firebase Console

1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Выберите проект **ONDA**
3. Перейдите в **Analytics → Events**
4. Через 1-2 минуты должны появиться события

**Примечание:** Firebase Analytics работает в режиме реального времени с задержкой ~1-2 минуты.

### 5.4 Проверьте DebugView (опционально)

Для мгновенной проверки событий:

**iOS:**
```bash
# В Xcode, добавьте launch argument: -FIRDebugEnabled
```

**Android:**
```bash
adb shell setprop debug.firebase.analytics.app com.onda.app
```

Затем откройте **Analytics → DebugView** в Firebase Console.

## 📊 Шаг 6: Настройка конверсий для рекламы

### 6.1 Google Ads (автоматически)

Firebase Analytics автоматически интегрируется с Google Ads:

1. В Firebase Console перейдите в **Project settings → Integrations**
2. Найдите **Google Ads** и нажмите **Link**
3. Выберите ваш Google Ads аккаунт
4. Нажмите **Link**

Теперь все события из Firebase будут доступны в Google Ads для создания конверсий.

### 6.2 Meta Ads (требует дополнительной настройки)

Для Meta Ads (Facebook/Instagram) нужно настроить **Conversions API**:

1. Создайте **Facebook App** в [Facebook Developers](https://developers.facebook.com/)
2. Добавьте **Facebook SDK** или используйте **Conversions API**
3. Настройте серверные события через Supabase Edge Function

**Примечание:** Для Meta Ads рекомендуется использовать серверные события (Conversions API), так как iOS ATT (App Tracking Transparency) блокирует клиентский Facebook SDK.

## 🎯 Шаг 7: Создание ключевых конверсий

### 7.1 В Firebase Console

1. Перейдите в **Analytics → Events**
2. Найдите событие (например, `practice_complete`)
3. Нажмите **"Mark as conversion"**

Рекомендуемые конверсии:
- ✅ `sign_up` - Регистрация
- ✅ `login` - Вход
- ✅ `practice_complete` - Завершение практики
- ✅ `purchase` - Покупка подписки

### 7.2 В Google Ads

1. Откройте Google Ads
2. Перейдите в **Tools → Conversions**
3. Нажмите **"+"** → **Import** → **Firebase**
4. Выберите конверсии из списка

## 📈 Использование в коде

### Базовое использование

```typescript
import { 
  initializeAnalytics, 
  trackEvent,
  setAnalyticsUserId,
  trackPracticeComplete,
  trackUserRegistration,
} from './services/analytics';

// При старте приложения
await initializeAnalytics();

// Трекинг событий
await trackEvent('button_click', { button_name: 'start_meditation' });

// Установка user ID после авторизации
await setAnalyticsUserId(user.id);

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

### Deep Links и атрибуция

```typescript
import { trackAttribution, parseUTMParams } from './services/analytics';

// При открытии deep link
const url = 'myapp://open?utm_source=facebook&utm_campaign=spring2024';
const utmParams = parseUTMParams(url);

if (utmParams) {
  await trackAttribution(utmParams);
}
```

## 🔍 Отладка

### Проверка событий в консоли браузера (Web)

```javascript
// Откройте DevTools → Console
window.localStorage.getItem('analytics_session'); // Проверка session ID
```

### Проверка событий на Android

```bash
# Откройте Logcat
adb logcat | grep "WebViewConsole"

# Фильтр только Analytics
adb logcat | grep "\[Analytics\]"
```

### Проверка событий на iOS

Используйте Xcode Console или Safari Web Inspector (если доступен).

## 🚨 Частые проблемы

### iOS: "GoogleService-Info.plist not found"

**Решение:** Убедитесь, что файл находится в `ios/App/App/` и добавлен в Xcode проект.

### Android: "google-services.json not found"

**Решение:** Убедитесь, что файл находится в `android-webview/app/` (не в `android-webview/`).

### События не появляются в Firebase Console

**Причины:**
1. Задержка 1-2 минуты (это нормально)
2. Неправильный Bundle ID / Package Name
3. Файлы конфигурации не добавлены
4. Приложение не пересобрано после добавления Firebase

**Решение:** Пересоберите приложение и подождите 2-3 минуты.

### Android: "FirebaseApp initialization unsuccessful"

**Причина:** `google-services.json` не найден или неправильный.

**Решение:**
1. Проверьте путь: `android-webview/app/google-services.json`
2. Проверьте `package_name` в JSON совпадает с `applicationId` в `build.gradle`
3. Пересоберите: `./gradlew clean build`

## 📚 Дополнительные ресурсы

- [Firebase Analytics Documentation](https://firebase.google.com/docs/analytics)
- [Capacitor Firebase Analytics](https://github.com/capawesome-team/capacitor-firebase/tree/main/packages/analytics)
- [Google Ads Conversion Tracking](https://support.google.com/google-ads/answer/6331304)
- [Meta Conversions API](https://developers.facebook.com/docs/marketing-api/conversions-api)

## ✅ Чеклист

- [ ] Создан проект в Firebase Console
- [ ] Добавлены iOS и Android приложения
- [ ] Скачаны `GoogleService-Info.plist` и `google-services.json`
- [ ] Файлы добавлены в правильные папки
- [ ] Файлы закоммичены в Git
- [ ] Установлены npm зависимости (`npm install`)
- [ ] iOS: Установлены CocoaPods (`pod install`)
- [ ] Изменения запушены в GitHub
- [ ] GitHub Actions успешно собрал приложения
- [ ] Приложение установлено на устройство
- [ ] События появляются в Firebase Console
- [ ] Firebase связан с Google Ads (опционально)
- [ ] Настроены ключевые конверсии

---

**Готово!** 🎉 Firebase Analytics настроен для обеих платформ.
