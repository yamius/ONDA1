#!/bin/bash

# 🔧 Скрипт для быстрой пересборки и установки Watch приложения

set -e  # Остановка при ошибке

echo "=================================="
echo "🔧 Пересборка ONDA Watch App"
echo "=================================="
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Синхронизация
echo "📦 1/3 Синхронизация изменений..."
npx cap sync ios
echo -e "${GREEN}✅ Синхронизация завершена${NC}"
echo ""

# 2. Информация о сборке
echo "🔨 2/3 Теперь нужно собрать в Xcode"
echo ""
echo -e "${YELLOW}ВАЖНО: Выполните следующие шаги в Xcode:${NC}"
echo ""
echo "  1. Откройте проект:"
echo "     npx cap open ios"
echo ""
echo "  2. Выберите схему: OndaWatch Watch App"
echo "     (верхний левый угол Xcode)"
echo ""
echo "  3. Выберите Destination: Ваши Apple Watch"
echo "     (рядом со схемой)"
echo ""
echo "  4. Нажмите: Product → Run (⌘R)"
echo "     Или кнопку ▶️ Play"
echo ""
echo "  5. Подождите установки (1-2 минуты)"
echo ""
echo -e "${GREEN}После установки приложение на часах запустится автоматически${NC}"
echo ""

# 3. Открываем Xcode
echo "🚀 3/3 Открываю Xcode..."
npx cap open ios

echo ""
echo "=================================="
echo "✅ Готово!"
echo "=================================="
echo ""
echo "📋 Следующие шаги:"
echo "  1. Подождите пока Xcode откроется"
echo "  2. Выберите схему: OndaWatch Watch App"
echo "  3. Выберите устройство: Ваши Apple Watch"
echo "  4. Нажмите Run (▶️)"
echo ""
echo "🧪 После установки проверьте:"
echo "  1. Удалите разрешения: localStorage.clear() в консоли"
echo "  2. Перезапустите приложение на iPhone"
echo "  3. Выдайте разрешения на iPhone"
echo "  4. Откройте ONDA на часах"
echo "  5. ДОЛЖЕН ПОЯВИТЬСЯ ДИАЛОГ РАЗРЕШЕНИЙ! ✅"
echo ""
