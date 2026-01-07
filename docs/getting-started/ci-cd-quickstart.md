# 🚀 Быстрый старт: GitHub Actions CI/CD

Настройте автоматическую сборку APK за 5 минут!

---

## ✅ Что получите:

- **Автоматическая сборка** APK при каждом push
- **Готовый APK** через ~5-10 минут
- **Автоматические релизы** с прикреплённым APK
- **Размер APK**: ~5-10MB (аудио загружается из CDN)

---

## 📋 Шаги настройки

### 1️⃣ Создайте keystore (один раз)

```bash
cd android-webview/app

keytool -genkey -v \
  -keystore onda-release.keystore \
  -alias onda \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Введите данные и запомните пароли!**

---

### 2️⃣ Конвертируйте keystore в Base64

```bash
# macOS/Linux
base64 -i android-webview/app/onda-release.keystore | pbcopy

# Windows PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("android-webview\app\onda-release.keystore")) | Set-Clipboard
```

**Результат скопирован в буфер обмена.**

---

### 3️⃣ Добавьте GitHub Secrets

1. Откройте ваш репозиторий → **Settings → Secrets and variables → Actions**
2. Нажмите **New repository secret**
3. Добавьте **5 secrets:**

| Name | Value | Описание |
|------|-------|----------|
| `KEYSTORE_BASE64` | *Base64 из буфера* | Keystore файл |
| `KEYSTORE_PASSWORD` | *ваш пароль* | Пароль keystore |
| `KEY_PASSWORD` | *ваш пароль* | Пароль ключа |
| `VITE_SUPABASE_URL` | `https://qwtdppugdcguyeaumymc.supabase.co` | Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | *ваш ключ* | Supabase anon key |

---

### 4️⃣ Push в GitHub

```bash
git add .
git commit -m "Setup CI/CD"
git push origin main
```

**Готово!** 🎉

---

## 📥 Скачать APK

### После push:

1. Откройте **Actions** в GitHub
2. Выберите последний запуск
3. Скролльте вниз → **Artifacts**
4. Скачайте **onda-release-XXX.zip**
5. Распакуйте → установите `app-release.apk`

### Из Releases:

1. Откройте **Releases** в GitHub
2. Выберите последний релиз
3. Скачайте `app-release.apk` напрямую

---

## 🎯 Готово!

Теперь каждый push в `main` или `develop` автоматически собирает APK.

**Нужно больше деталей?** → [docs/GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)
