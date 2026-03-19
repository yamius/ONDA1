#!/usr/bin/env bash

# 1. Установка зависимостей
echo "--- Installing npm dependencies ---"
npm install

# 2. Сборка веб-части (React/Vite)
echo "--- Building web assets ---"
npm run build

# 3. Синхронизация с Android
echo "--- Syncing Capacitor with Android project ---"
npx cap sync android
