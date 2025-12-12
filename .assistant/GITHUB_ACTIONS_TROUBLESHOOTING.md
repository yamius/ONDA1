# GitHub Actions iOS Deployment Troubleshooting Guide

## Дата последнего обновления: December 2024

Этот документ содержит решения проблем, возникших при настройке GitHub Actions для iOS/watchOS сборки с Capacitor и CocoaPods.

---

## КРИТИЧЕСКАЯ ПРОБЛЕМА #1: Xcode 16 + CocoaPods Incompatibility

### Симптомы
```
[Xcodeproj] Unable to find compatibility version string for object version `70`
ArgumentError - [Xcodeproj] Unable to find compatibility version string for object version `70`
```

### Причина
Xcode 16 создает проекты с `objectVersion = 70` в `project.pbxproj`. CocoaPods использует `xcodeproj` gem, который не поддерживает этот формат.

### Решение
**Перед запуском CocoaPods** добавить sed для downgrade objectVersion:

```yaml
- name: Setup CocoaPods
  run: |
    # Fix Xcode 16 project format for CocoaPods compatibility
    sed -i '' 's/objectVersion = 70/objectVersion = 56/' ios/App/App.xcodeproj/project.pbxproj || true
    gem install xcodeproj --no-document
    gem install cocoapods --no-document
```

### Важно
- Это НЕ ломает сборку в Xcode — Xcode 16 понимает оба формата
- `|| true` предотвращает ошибку если файл уже имеет objectVersion 56
- Делать ДО `npx cap sync ios` или `pod install`

---

## КРИТИЧЕСКАЯ ПРОБЛЕМА #2: macOS Runner + Xcode Version Selection

### Симптомы
```
error: The operation couldn't be completed.
Unable to locate a working simulator runtime
```
или
```
xcodebuild: error: SDK "iphoneos" cannot be located.
```

### Причина
Несовместимость между версией runner (macos-14/15) и версией Xcode.

### Рабочая конфигурация (December 2024)

```yaml
runs-on: macos-15

- name: Setup Xcode
  uses: maxim-lobanov/setup-xcode@v1
  with:
    xcode-version: '16.1'
```

### Таблица совместимости

| Runner | Xcode | SDKs | Статус |
|--------|-------|------|--------|
| macos-15 | 16.1 | iOS 18.1, watchOS 11.1 | РАБОТАЕТ |
| macos-15 | 16.0 | iOS 18.0 | Проблемы с симуляторами |
| macos-15 | 16.2 | - | Не предустановлен |
| macos-14 | 15.x | iOS 17.x | Несовместим с Xcode 16 проектами |

### Важно
- **НЕ использовать** `xcode-version: 'latest'` — непредсказуемо
- **НЕ использовать** macos-14 для Xcode 16 проектов
- Версии Xcode на runners меняются — проверять [GitHub Actions Runner Images](https://github.com/actions/runner-images)

---

## КРИТИЧЕСКАЯ ПРОБЛЕМА #3: iOS 18.1 Platform Not Installed (Xcode 16+ on macos-15)

### Симптомы
```
xcodebuild: error: Unable to find a destination matching the provided destination specifier:
{ generic:1, platform:iOS }
Ineligible destinations for the "App" scheme:
{ platform:iOS, id:dvtdevice-DVTiPhonePlaceholder-iphoneos:placeholder, name:Any iOS Device, 
  error:iOS 18.1 is not installed. To use with Xcode, first download and install the platform }
```

### Причина
GitHub macos-15 runners с Xcode 16.1 **НЕ включают iOS SDK по умолчанию**. Это экономит место на диске runner-а, но требует явной установки платформы перед сборкой.

Проблема документирована: https://github.com/actions/runner-images/issues/10286

### Решение
**КРИТИЧЕСКИ ВАЖНО:**
1. Использовать `sudo` для downloadPlatform
2. НЕ маскировать ошибки с `|| true` — сборка должна падать если платформа не установилась
3. Проверить наличие директории платформы после установки

```yaml
- name: Install iOS/watchOS Platforms
  run: |
    echo "=== Running first launch setup ==="
    sudo xcodebuild -runFirstLaunch
    
    echo "=== Downloading iOS platform (required for Xcode 16+ on macos-15) ==="
    # CRITICAL: Must use sudo and must not mask failures
    sudo xcodebuild -downloadPlatform iOS
    
    echo "=== Downloading watchOS platform ==="
    sudo xcodebuild -downloadPlatform watchOS
    
    echo "=== Verifying platform installation ==="
    PLATFORM_DIR="/Applications/Xcode_16.1.app/Contents/Developer/Platforms/iPhoneOS.platform"
    if [ -d "$PLATFORM_DIR" ]; then
      echo "iOS platform installed successfully"
    else
      echo "ERROR: iOS platform not found"
      exit 1
    fi
    
    xcodebuild -showsdks
    xcrun --sdk iphoneos --show-sdk-path
```

### Альтернатива: Использовать Xcode 15.4 на macos-14
Если загрузка платформы продолжает падать из-за проблем Apple CDN:
```yaml
runs-on: macos-14
# ...
- uses: maxim-lobanov/setup-xcode@v1
  with:
    xcode-version: '15.4'  # Включает iOS SDK по умолчанию
```

### Важно
- Платформы **обычно уже предустановлены** на GitHub runners
- `xcodebuild -showsdks` покажет что доступно
- `-runFirstLaunch` активирует Xcode

---

## ПРОБЛЕМА #4: SSL Certificate Errors

### Симптомы
```
SSL_connect returned=1 errno=0 peeraddr=140.82.116.6:443 state=error: certificate verify failed
```

### Причина
Временные проблемы сети GitHub/Apple или устаревшие CA сертификаты.

### Решение
Обычно достаточно перезапустить workflow. Если повторяется:
1. Проверить [GitHub Status](https://www.githubstatus.com/)
2. Проверить [Apple Developer Status](https://developer.apple.com/system-status/)

---

## ПРОБЛЕМА #5: Fastlane Match Timeout

### Симптомы
```
Fastlane::XCODEBUILD_SETTINGS_TIMEOUT
```

### Решение
Увеличить timeout в env:

```yaml
env:
  FASTLANE_XCODEBUILD_SETTINGS_TIMEOUT: "120"
  FASTLANE_XCODEBUILD_SETTINGS_RETRIES: "6"
```

---

## ПРОБЛЕМА #6: Keychain Access

### Симптомы
```
security: SecKeychainAddInternetPassword: The specified item already exists in the keychain.
```

### Решение
Создать отдельный keychain для CI:

```yaml
- name: Unlock Keychain for codesigning
  run: |
    security create-keychain -p "" build.keychain
    security default-keychain -s build.keychain
    security unlock-keychain -p "" build.keychain
    security set-keychain-settings -t 3600 -u build.keychain
    security list-keychains -d user -s build.keychain
```

---

## Полная рабочая конфигурация workflow (December 2024)

```yaml
name: iOS - Build and Deploy to TestFlight

on:
  workflow_dispatch:

jobs:
  build-ios:
    name: Build and Deploy iOS App
    runs-on: macos-15
    timeout-minutes: 90
    
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'

      - run: gem install fastlane

      - uses: maxim-lobanov/setup-xcode@v1
        with:
          xcode-version: '16.1'

      - name: Install iOS/watchOS Platforms
        continue-on-error: true
        run: |
          sudo xcodebuild -runFirstLaunch || true
          sudo xcodebuild -downloadPlatform iOS || echo "skipped"
          sudo xcodebuild -downloadPlatform watchOS || echo "skipped"
          xcodebuild -showsdks

      - name: Setup CocoaPods
        run: |
          # CRITICAL: Fix Xcode 16 objectVersion for CocoaPods
          sed -i '' 's/objectVersion = 70/objectVersion = 56/' ios/App/App.xcodeproj/project.pbxproj || true
          gem install xcodeproj --no-document
          gem install cocoapods --no-document

      - run: npx cap sync ios

      # ... остальные шаги
```

---

## Чеклист перед отладкой

1. [ ] Проверить версию runner (macos-15 для Xcode 16)
2. [ ] Проверить версию Xcode (16.1 стабильна)
3. [ ] Убедиться что sed для objectVersion выполняется ДО CocoaPods
4. [ ] Проверить что platform install использует continue-on-error
5. [ ] Проверить GitHub/Apple status pages при SSL ошибках

---

## История решенных проблем

| Дата | Проблема | Решение |
|------|----------|---------|
| Dec 2024 | objectVersion 70 incompatible | sed downgrade to 56 |
| Dec 2024 | Platform download exit code 70 | continue-on-error + || true |
| Dec 2024 | SDK not found | macos-15 + Xcode 16.1 |
| Dec 2024 | SSL certificate verify failed | Retry workflow |

---

## Ссылки

- [GitHub Actions macOS Runners](https://github.com/actions/runner-images/blob/main/images/macos/macos-15-arm64-Readme.md)
- [Xcode Release Notes](https://developer.apple.com/documentation/xcode-release-notes)
- [CocoaPods Issues](https://github.com/CocoaPods/CocoaPods/issues)
- [Xcodeproj gem](https://github.com/CocoaPods/Xcodeproj)
