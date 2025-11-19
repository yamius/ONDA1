#!/bin/bash

# Build APK #46 with data source logging
# Run this script on your local computer (not in Replit)

echo "🚀 Building ONDA APK #46..."
echo "📝 Changes in this build:"
echo "  - Added: Data source logging (see which app provides HC data)"
echo "  - Shows: Steps/Calories/Sleep/HR sources (Mi Fit vs Google Fit vs Zepp Life)"
echo "  - Helps: Diagnose why Xiaomi Band data doesn't match ONDA"
echo ""

# Set version code to 46
sed -i 's/versionCode [0-9]*/versionCode 46/' app/build.gradle.kts
sed -i 's/versionName "[^"]*"/versionName "1.0.46"/' app/build.gradle.kts

# Clean previous builds
./gradlew clean

# Build release APK
./gradlew assembleRelease

if [ -f app/build/outputs/apk/release/app-release-unsigned.apk ]; then
    # Copy to root with version number
    cp app/build/outputs/apk/release/app-release-unsigned.apk ../app-release-46.apk
    echo "✅ APK built successfully: app-release-46.apk"
    echo ""
    echo "📱 Installation instructions:"
    echo "  adb uninstall com.onda.app"
    echo "  adb install app-release-46.apk"
    echo "  adb shell am start -n com.onda.app/.MainActivity"
    echo ""
    echo "🔍 To check data sources:"
    echo "  adb logcat -c"
    echo "  adb logcat | grep 'sources:'"
    echo ""
    echo "You should see which app provides data:"
    echo "  Steps sources: com.xiaomi.hm.health (Zepp Life)"
    echo "  or"
    echo "  Steps sources: com.google.android.apps.fitness (Google Fit)"
else
    echo "❌ Build failed! Check errors above."
fi
