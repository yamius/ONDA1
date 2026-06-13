# Firebase Analytics - Activation Guide

## ⚠️ Текущий статус

Firebase Analytics **подготовлен**, но **отключен** до добавления конфигурационных файлов.

**Почему отключен?**
- `google-services.json` (Android) должен быть скачан из Firebase Console
- `GoogleService-Info.plist` (iOS) должен быть скачан из Firebase Console
- Эти файлы содержат ваши уникальные API ключи и не могут быть сгенерированы автоматически

## 🚀 Как активировать (5 минут)

### Шаг 1: Firebase Console

1. Откройте https://console.firebase.google.com/
2. Создайте проект **ONDA** (включите Google Analytics)
3. Добавьте **iOS приложение**:
   - Bundle ID: `com.onda-life.ios`
   - Скачайте `GoogleService-Info.plist`
4. Добавьте **Android приложение**:
   - Package name: `com.onda.app`
   - Скачайте `google-services.json`

### Шаг 2: Добавьте файлы в проект

```bash
# iOS
cp ~/Downloads/GoogleService-Info.plist ios/App/App/

# Android
cp ~/Downloads/google-services.json android-webview/app/
```

### Шаг 3: Раскомментируйте Firebase код

#### Android: `android-webview/app/build.gradle`

**Найдите:**
```gradle
// Firebase: Uncomment after adding google-services.json from Firebase Console
// id 'com.google.gms.google-services'
```

**Замените на:**
```gradle
id 'com.google.gms.google-services'
```

**И найдите:**
```gradle
// Firebase Analytics (uncomment after adding google-services.json)
// implementation platform('com.google.firebase:firebase-bom:32.7.0')
// implementation 'com.google.firebase:firebase-analytics-ktx'
```

**Замените на:**
```gradle
// Firebase Analytics
implementation platform('com.google.firebase:firebase-bom:32.7.0')
implementation 'com.google.firebase:firebase-analytics-ktx'
```

#### Android: `MainActivity.kt`

**Найдите все блоки с комментарием:**
```kotlin
// Firebase Analytics (uncomment after adding google-services.json)
```

**И раскомментируйте код внутри.**

**Пример:**
```kotlin
// Было:
// import com.google.firebase.analytics.FirebaseAnalytics

// Стало:
import com.google.firebase.analytics.FirebaseAnalytics
```

### Шаг 4: Коммит и push

```bash
git add ios/App/App/GoogleService-Info.plist
git add android-webview/app/google-services.json
git add android-webview/app/build.gradle
git add android-webview/app/src/main/java/com/onda/app/MainActivity.kt
git commit -m "Activate Firebase Analytics with config files"
git push
```

### Шаг 5: Проверка

GitHub Actions автоматически соберёт приложения с Firebase Analytics.

## 📊 Что будет работать после активации

- ✅ Трекинг событий в Firebase Analytics
- ✅ Автоматическая интеграция с Google Ads
- ✅ Атрибуция рекламного трафика
- ✅ Firebase DebugView для тестирования
- ✅ Двойной трекинг: Supabase + Firebase

## 🔍 Проверка работы

1. Установите приложение из TestFlight/APK
2. Откройте приложение
3. Через 1-2 минуты проверьте **Firebase Console → Analytics → Events**
4. Должны появиться события: `first_open`, `app_open`

## 📚 Документация

- `FIREBASE_QUICK_START.md` - Полная инструкция
- `docs/FIREBASE_ANALYTICS_SETUP.md` - Детальная документация
- `docs/ANDROID_DEBUG_BUILD.md` - Debug сборка для тестирования

---

**Статус:** ⏸️ Ожидает добавления конфигурационных файлов из Firebase Console
