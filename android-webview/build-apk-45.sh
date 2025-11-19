#!/bin/bash

# Build APK #45 with Health Connect error handling improvements
# Run this script on your local computer (not in Replit)

echo "🚀 Building ONDA APK #45..."
echo "📝 Changes in this build:"
echo "  - Fixed: SecurityException handling for each body measurement"
echo "  - Fixed: Lean Body Mass permission error no longer crashes other data"
echo "  - Added: Detailed logging for heart rate queries"
echo ""

# Set version code to 45
sed -i 's/versionCode [0-9]*/versionCode 45/' app/build.gradle.kts
sed -i 's/versionName "[^"]*"/versionName "1.0.45"/' app/build.gradle.kts

# Clean previous builds
./gradlew clean

# Build release APK
./gradlew assembleRelease

if [ -f app/build/outputs/apk/release/app-release-unsigned.apk ]; then
    # Copy to root with version number
    cp app/build/outputs/apk/release/app-release-unsigned.apk ../app-release-45.apk
    echo "✅ APK built successfully: app-release-45.apk"
    echo ""
    echo "📱 Installation instructions:"
    echo "  adb uninstall com.onda.app"
    echo "  adb install app-release-45.apk"
    echo "  adb shell am start -n com.onda.app/.MainActivity"
    echo ""
    echo "🔍 To check logs:"
    echo "  adb logcat -c"
    echo "  adb logcat | grep HealthConnectManager"
else
    echo "❌ Build failed! Check errors above."
fi
