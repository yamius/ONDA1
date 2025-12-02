# Onda Android WebView App

WebView wrapper для приложения Onda с интеграцией Health Connect и Bluetooth.

## Структура проекта

```
android-webview/
├── app/
│   ├── src/main/
│   │   ├── java/com/onda/app/
│   │   │   └── MainActivity.kt          # Главная активность с WebView и нативными мостами
│   │   ├── res/
│   │   │   ├── values/
│   │   │   │   ├── strings.xml         # Строковые ресурсы
│   │   │   │   └── themes.xml          # Темы приложения
│   │   │   └── xml/
│   │   │       └── network_security_config.xml  # Настройки безопасности сети
│   │   ├── assets/                      # СЮДА скопировать dist/
│   │   └── AndroidManifest.xml          # Манифест с permissions
│   ├── build.gradle                     # Конфигурация модуля
│   └── proguard-rules.pro              # Правила ProGuard
├── build.gradle                         # Главный gradle файл
└── settings.gradle                      # Настройки проекта
```

## ⚡ Быстрый старт

### Подготовка веб-приложения (автоматически):

```bash
# Из корня  проект а
npm run prepare:android
```

**Этот скрипт:**
- ✅ Собирает React приложение
- ✅ Копирует файлы в Android assets
- ✅ **Исключает аудио** (загружается из CDN)
- ✅ Проверяет корректность

### Полная инструкция:

📖 **[docs/BUILD_APK.md](../docs/BUILD_APK.md)** - подробное руководство по сборке APK

---

## Шаги для создания APK

### 1. Установка Android Studio

Скачайте и установите [Android Studio](https://developer.android.com/studio)

### 2. Подготовка проекта

```bash
# Из корня проекта
npm run prepare:android
```

### 3. Импорт в Android Studio

1. Откройте Android Studio
2. **File → Open** → выберите папку `android-webview/`
3. Дождитесь синхронизации Gradle (~2-5 мин)

### 4. Настройка подписи приложения

#### Создание keystore (один раз):

```bash
cd android-webview/app
keytool -genkey -v -keystore onda-release.keystore -alias onda -keyalg RSA -keysize 2048 -validity 10000
```

Введите данные:
- Password для keystore
- Имя, организация, город, страна
- Password для alias (можно тот же)

#### Добавьте в `app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('onda-release.keystore')
            storePassword 'your_keystore_password'
            keyAlias 'onda'
            keyPassword 'your_key_password'
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

### 5. Сборка APK

#### Через Android Studio:
1. **Build → Generate Signed Bundle / APK**
2. Выберите **APK**
3. Выберите keystore файл
4. Введите пароли
5. Выберите **release** build variant
6. **Finish**

APK будет в: `app/build/outputs/apk/release/app-release.apk`

#### Через командную строку:

```bash
cd android-webview

# Debug APK (для тестирования)
./gradlew assembleDebug
# APK: app/build/outputs/apk/debug/app-debug.apk

# Release APK (для публикации)
./gradlew assembleRelease
# APK: app/build/outputs/apk/release/app-release.apk
```

### 6. Установка на устройство

```bash
# Через adb
adb install app/build/outputs/apk/release/app-release.apk

# Или скопируйте APK на телефон и установите вручную
```

## Возможности приложения

### ✅ Реализованные функции:

1. **WebView с полной поддержкой**
   - JavaScript enabled
   - LocalStorage/SessionStorage
   - Медиа файлы (аудио практик)
   - File access для assets

2. **Health Connect интеграция**
   - Чтение всех витальных показателей
   - Автоматическая отправка данных в веб-приложение
   - Запрос permissions через JavaScript

3. **Bluetooth поддержка**
   - Permissions для Bluetooth LE
   - Проверка доступности Bluetooth

4. **Оптимизация**
   - ProGuard для уменьшения размера
   - Network security config
   - Обработка back button

### 🔧 JavaScript мосты:

```javascript
// В веб-приложении доступны:

// Запрос Health Connect permissions
window.Android.requestHealthConnectPermissions()

// Запрос Bluetooth permissions
window.Android.requestBluetoothPermissions()

// Проверка Bluetooth (возвращает true если Bluetooth есть И включён)
window.Android.isBluetoothAvailable() // returns boolean

// Открыть настройки для включения Bluetooth
window.Android.enableBluetooth()

// Получение данных Health Connect
window.addEventListener('hc-update', (event) => {
  const data = event.detail
  console.log('Health data:', data)
})

// Событие готовности нативного моста
window.addEventListener('native-ready', () => {
  console.log('Native bridge is ready')
})
```

## Требования

- **Minimum SDK**: Android 8.0 (API 26)
- **Target SDK**: Android 14 (API 34)
- **Java**: 1.8
- **Kotlin**: 1.9.20
- **Health Connect**: Требуется установленное приложение Health Connect на устройстве

## Permissions

Приложение запрашивает:
- ✅ Internet (для Supabase API)
- ✅ Health Connect (все витальные показатели)
- ✅ Bluetooth (для трекеров)
- ✅ Wake Lock (для практик)
- ✅ Vibrate (для обратной связи)

## Тестирование

### Debug сборка:
```bash
./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### Логи:
```bash
# WebView console.log
adb logcat | grep "WebView Console"

# Kotlin logs
adb logcat | grep "MainActivity"
```

## Troubleshooting

### Проблема: Белый экран
- Проверьте что `dist/` скопирован в `assets/`
- Проверьте logcat на JavaScript ошибки

### Проблема: Health Connect не работает
- Убедитесь что Health Connect установлен на устройстве
- Проверьте что permissions предоставлены
- Проверьте API level (минимум 26)

### Проблема: Аудио не воспроизводится
- Проверьте что все `.mp3` файлы скопированы
- Проверьте `mediaPlaybackRequiresUserGesture = false` в WebView settings

## Публикация в Google Play

1. Создайте release APK с подписью
2. Заполните Google Play Console
3. Загрузите APK
4. Добавьте скриншоты и описание
5. Опубликуйте

## Поддержка

При возникновении проблем проверьте:
1. Logcat для ошибок
2. WebView console logs
3. Health Connect permissions в настройках устройства
