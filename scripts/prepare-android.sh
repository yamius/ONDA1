#!/bin/bash

# ONDA Android APK Preparation Script
# Подготовка веб-приложения для включения в Android APK

set -e  # Exit on error

echo "🚀 ONDA: Подготовка Android APK"
echo "================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Paths
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$PROJECT_ROOT/dist"
ASSETS_DIR="$PROJECT_ROOT/android-webview/app/src/main/assets"
AUDIO_DIR_P1="$PROJECT_ROOT/public/practices p1"
AUDIO_DIR_ADAPTIVE="$PROJECT_ROOT/public/adaptive-practices"

echo -e "${YELLOW}📂 Корневая директория:${NC} $PROJECT_ROOT"

# Step 1: Verify dist/ exists (should be pre-built with env vars)
echo ""
echo -e "${YELLOW}📦 Шаг 1: Проверка сборки веб-приложения${NC}"

if [ ! -d "$DIST_DIR" ] || [ -z "$(ls -A "$DIST_DIR" 2>/dev/null)" ]; then
    echo -e "${RED}❌ Ошибка: dist/ не найдена или пуста${NC}"
    echo -e "${YELLOW}💡 Сначала соберите проект с правильными env переменными:${NC}"
    echo "   VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... npm run build"
    exit 1
fi

echo -e "${GREEN}✅ Используется существующая сборка из dist/${NC}"

# Step 2: Create assets directory
echo ""
echo -e "${YELLOW}📁 Шаг 2: Создание assets директории${NC}"

if [ -d "$ASSETS_DIR" ]; then
    echo "   Очистка старых файлов..."
    rm -rf "$ASSETS_DIR"/*
else
    echo "   Создание новой директории..."
    mkdir -p "$ASSETS_DIR"
fi

echo -e "${GREEN}✅ Assets директория готова${NC}"

# Step 3: Copy web application files (WITHOUT audio)
echo ""
echo -e "${YELLOW}📋 Шаг 3: Копирование веб-файлов (БЕЗ аудио)${NC}"
echo "   Источник: $DIST_DIR"
echo "   Назначение: $ASSETS_DIR"

# Copy everything from dist/ first
cp -r "$DIST_DIR"/* "$ASSETS_DIR"/

# Remove audio directories (they will be loaded from CDN)
echo ""
echo -e "${YELLOW}🗑️  Удаление аудио файлов (используется CDN)${NC}"

if [ -d "$ASSETS_DIR/practices p1" ]; then
    rm -rf "$ASSETS_DIR/practices p1"
    echo "   ✓ Удалено: practices p1/"
fi

if [ -d "$ASSETS_DIR/adaptive-practices" ]; then
    rm -rf "$ASSETS_DIR/adaptive-practices"
    echo "   ✓ Удалено: adaptive-practices/"
fi

echo -e "${GREEN}✅ Аудио файлы исключены (будут загружаться из CDN)${NC}"

# Step 4: Verify assets
echo ""
echo -e "${YELLOW}🔍 Шаг 4: Проверка скопированных файлов${NC}"

REQUIRED_FILES=(
    "index.html"
    "assets"
    "locales"
)

MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ -e "$ASSETS_DIR/$file" ]; then
        echo -e "   ${GREEN}✓${NC} $file"
    else
        echo -e "   ${RED}✗${NC} $file ${RED}(отсутствует!)${NC}"
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -ne 0 ]; then
    echo -e "${RED}❌ Ошибка: Отсутствуют необходимые файлы${NC}"
    exit 1
fi

# Calculate size
ASSETS_SIZE=$(du -sh "$ASSETS_DIR" | cut -f1)
echo ""
echo -e "${GREEN}📊 Размер assets: $ASSETS_SIZE${NC}"

# Step 5: Summary
echo ""
echo "================================"
echo -e "${GREEN}✅ Подготовка завершена!${NC}"
echo ""
echo "📱 Следующие шаги:"
echo "   1. Откройте Android Studio"
echo "   2. Откройте проект: android-webview/"
echo "   3. Соберите APK: Build → Generate Signed Bundle/APK"
echo ""
echo "💡 Подробная инструкция:"
echo "   docs/BUILD_APK.md"
echo ""
