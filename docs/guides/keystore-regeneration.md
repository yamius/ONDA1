# 🔑 ONDA Keystore Regeneration Guide

## Problem
The current keystore was created with OpenSSL and is incompatible with Android build tools.
Error: `Tag number over 30 is not supported`

## Solution
Create a new keystore using Java's `keytool` utility.

---

## Option 1: Generate Locally (Recommended)

### Prerequisites
- Java JDK 8+ installed on your computer
- Terminal/Command Prompt access

### Steps

1. **Open Terminal** (Mac/Linux) or **Command Prompt** (Windows)

2. **Navigate to a safe location:**
   ```bash
   cd ~/Desktop
   ```

3. **Generate the keystore:**
   ```bash
   keytool -genkeypair -v \
     -keystore onda-release.keystore \
     -alias onda \
     -keyalg RSA \
     -keysize 2048 \
     -validity 10000 \
     -storepass <KEYSTORE_PASSWORD> \
     -keypass <KEYSTORE_PASSWORD> \
     -dname "CN=ONDA, OU=MindfulTech, O=ONDA, L=Moscow, ST=Moscow, C=RU"
   ```

4. **Verify the keystore:**
   ```bash
   keytool -list -v -keystore onda-release.keystore -storepass <KEYSTORE_PASSWORD>
   ```

   You should see:
   - Keystore type: PKCS12 or JKS
   - Alias name: onda
   - Key algorithm: RSA
   - Key size: 2048

5. **Convert to Base64 for GitHub:**
   
   **Mac/Linux:**
   ```bash
   base64 -i onda-release.keystore -o keystore.base64.txt
   ```
   
   **Windows (PowerShell):**
   ```powershell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("onda-release.keystore")) | Out-File keystore.base64.txt
   ```

6. **Update GitHub Secret:**
   - Go to: https://github.com/yamius/ONDA1/settings/secrets/actions
   - Click on `KEYSTORE_BASE64`
   - Click "Update"
   - Open `keystore.base64.txt` and copy the entire contents
   - Paste into the secret value field
   - Click "Update secret"

7. **Replace local keystore:**
   ```bash
   # In Replit terminal or locally
   cp onda-release.keystore /path/to/ONDA1/android-webview/app/
   ```

8. **Commit and push:**
   ```bash
   git add android-webview/app/onda-release.keystore
   git commit -m "Replace keystore with keytool-generated version"
   git push
   ```

---

## Option 2: Generate in GitHub Actions

If you don't have Java locally, modify `.github/workflows/build-android-apk.yml`:

### Add this step BEFORE "Decode Keystore":

```yaml
- name: Generate Keystore if needed
  run: |
    cd android-webview/app
    if [ ! -f "onda-release.keystore" ] || [ "${{ github.event.head_commit.message }}" == *"regenerate keystore"* ]; then
      echo "Generating new keystore..."
      keytool -genkeypair -v \
        -keystore onda-release.keystore \
        -alias onda \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -storepass ${{ secrets.KEYSTORE_PASSWORD }} \
        -keypass ${{ secrets.KEY_PASSWORD }} \
        -dname "CN=ONDA, OU=MindfulTech, O=ONDA, L=Moscow, ST=Moscow, C=RU"
      
      # Verify
      keytool -list -v -keystore onda-release.keystore -storepass ${{ secrets.KEYSTORE_PASSWORD }}
      
      # Encode to base64 for future use
      base64 -w 0 onda-release.keystore > keystore.base64.txt
      echo "::notice::New keystore generated. Update KEYSTORE_BASE64 secret with contents of artifact."
    fi

- name: Upload Keystore Base64
  if: success()
  uses: actions/upload-artifact@v4
  with:
    name: keystore-base64
    path: android-webview/app/keystore.base64.txt
```

Then commit with message: `regenerate keystore`

---

## Verification

After updating, the build should:
1. ✅ Pass `minifyReleaseWithR8`
2. ✅ Pass `packageRelease` (no more "Tag number over 30" error)
3. ✅ Generate signed APK in Artifacts

---

## Security Notes

- **Password:** stored ONLY in CI secrets (`KEYSTORE_PASSWORD` / `KEY_PASSWORD`) — never in this repo. ⚠️ The previously-committed literal has been redacted here; if it was ever the real signing password, **rotate it** (it remains in git history).
- **Validity:** 10000 days (~27 years)
- **Algorithm:** RSA 2048-bit
- **Never commit keystore to public repository** (use GitHub Secrets)
- **Backup keystore securely** - losing it means you can't update the app in Google Play

---

## Current Status

- ✅ Gradle memory optimized (4GB heap)
- ✅ Health Connect API compatibility fixed
- ✅ Build configuration ready
- ⚠️ **Keystore needs regeneration** (this guide)

---

## Questions?

If you have Java installed locally, use **Option 1** (recommended).
Otherwise, use **Option 2** to generate in GitHub Actions.
