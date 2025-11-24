# iOS Deployment Setup Guide for ONDA

This guide provides step-by-step instructions for deploying the ONDA iOS app to TestFlight using **GitHub Actions** for automated cloud builds. No local Mac required!

## 📋 Prerequisites

### 1. Apple Developer Account
- Enrolled in **Apple Developer Program** ($99/year)
- Account must be active and in good standing

### 2. Create App in App Store Connect
1. Visit [App Store Connect](https://appstoreconnect.apple.com)
2. Go to "My Apps" → Click "+"
3. Select "New App"
4. Fill in details:
   - **Platform**: iOS
   - **Name**: ONDA
   - **Primary Language**: English (US)
   - **Bundle ID**: Create new → `com.onda.app`
   - **SKU**: `com.onda.app`
   - **User Access**: Full Access

### 3. Create App Store Connect API Key
1. Visit [App Store Connect → Users and Access → Keys](https://appstoreconnect.apple.com/access/api)
2. Click "+" to generate new API key
3. Fill in details:
   - **Name**: GitHub Actions ONDA
   - **Access**: App Manager
4. Click "Generate"
5. **DOWNLOAD** the `.p8` file (you can only do this once!)
6. Note down:
   - **Key ID** (e.g., `2X9R4HXF34`)
   - **Issuer ID** (e.g., `57246542-96fe-1a63-e053-0824d011072a`)

### 4. Create Certificates Repository
1. Create a **private** GitHub repository (e.g., `onda-certificates`)
2. This will store code signing certificates
3. Generate a Personal Access Token:
   - GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Scopes: Select `repo` (full control of private repositories)
   - Copy the token (you won't see it again!)

### 5. Get Team IDs
1. Visit [Apple Developer → Membership](https://developer.apple.com/account/#/membership/)
2. Note down **Team ID** (e.g., `XXXXXXXXXX`)
3. Visit [App Store Connect → Users and Access](https://appstoreconnect.apple.com/access/users)
4. Click on your name
5. Note down **Team ID** under "Provider" section

## 🔐 Configure GitHub Secrets

In your **main repository** (not certificates repo), go to:
**Settings → Secrets and variables → Actions → New repository secret**

Add the following secrets:

### Required Secrets

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `FASTLANE_USER` | Your Apple ID email | `your-email@example.com` |
| `FASTLANE_TEAM_ID` | Apple Developer Team ID | `XXXXXXXXXX` |
| `FASTLANE_ITC_TEAM_ID` | App Store Connect Team ID | `123456789` |
| `APP_STORE_CONNECT_API_KEY_ID` | API Key ID from step 3 | `2X9R4HXF34` |
| `APP_STORE_CONNECT_ISSUER_ID` | Issuer ID from step 3 | `57246542-96fe-1a63-e053-0824d011072a` |
| `APP_STORE_CONNECT_API_KEY_CONTENT` | Full content of `.p8` file | `-----BEGIN PRIVATE KEY-----\nMIGT...` |
| `MATCH_GIT_URL` | Certificates repo URL | `https://github.com/username/onda-certificates` |
| `MATCH_PASSWORD` | Password for encrypting certificates | Any strong password |
| `MATCH_GIT_BASIC_AUTHORIZATION` | GitHub PAT in base64 | See below |
| `FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD` | App-specific password | See below |

### How to get specific values:

#### `APP_STORE_CONNECT_API_KEY_CONTENT`
```bash
cat AuthKey_2X9R4HXF34.p8
```
Copy the **entire output** including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

#### `MATCH_GIT_BASIC_AUTHORIZATION`
Encode your GitHub Personal Access Token:
```bash
echo -n "your-github-username:your-github-token" | base64
```

#### `FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD`
1. Visit [appleid.apple.com](https://appleid.apple.com)
2. Sign in → Security → App-Specific Passwords
3. Click "+" to generate new password
4. Label: "GitHub Actions Fastlane"
5. Copy the generated password (format: `xxxx-xxxx-xxxx-xxxx`)

## 🚀 First-Time Setup: Initialize Certificates

Before the automated workflow can run, you need to initialize Match certificates:

### Option A: Using GitHub Actions (Recommended)

1. Create a one-time setup workflow `.github/workflows/setup-match.yml`:

```yaml
name: Setup Match Certificates (One-time)

on:
  workflow_dispatch:

jobs:
  setup:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
      
      - name: Install Fastlane
        run: gem install fastlane
      
      - name: Setup Match
        run: cd fastlane && fastlane ios setup_match
        env:
          FASTLANE_USER: ${{ secrets.FASTLANE_USER }}
          FASTLANE_TEAM_ID: ${{ secrets.FASTLANE_TEAM_ID }}
          MATCH_GIT_URL: ${{ secrets.MATCH_GIT_URL }}
          MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
          MATCH_GIT_BASIC_AUTHORIZATION: ${{ secrets.MATCH_GIT_BASIC_AUTHORIZATION }}
```

2. Push this file to GitHub
3. Go to **Actions** tab → **Setup Match Certificates** → **Run workflow**
4. Approve certificate creation in browser when prompted
5. **Delete this workflow file after successful run**

### Option B: Using Replit Shell

```bash
cd fastlane
FASTLANE_USER="your-apple-id@example.com" \
FASTLANE_TEAM_ID="XXXXXXXXXX" \
MATCH_GIT_URL="https://github.com/username/onda-certificates" \
MATCH_PASSWORD="your-match-password" \
fastlane ios setup_match
```

## 🔄 Automated Deployment

Once setup is complete, every push to `main` branch will:

1. ✅ Build React app (`npm run build`)
2. ✅ Sync Capacitor (`npx cap sync ios`)
3. ✅ Build iOS app with Xcode
4. ✅ Sign with certificates from Match
5. ✅ Upload to TestFlight automatically

### Manual Deployment

You can also trigger deployment manually:

1. Go to **Actions** tab in GitHub
2. Select **iOS - Build and Deploy to TestFlight**
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow**

Build takes ~10-15 minutes on GitHub's macOS runners.

## 📱 Testing on TestFlight

After successful deployment:

1. Open [App Store Connect → TestFlight](https://appstoreconnect.apple.com)
2. Select "ONDA" app
3. Go to **Internal Testing**
4. Add yourself as internal tester (if not already)
5. You'll receive email with TestFlight invitation
6. Install **TestFlight** app from App Store
7. Open invitation link → Install ONDA

## 🔍 Troubleshooting

### Build fails with "No signing identity found"

**Solution**: Re-run Match setup (see Option A or B above)

### Build fails with "Invalid API Key"

**Solution**: Check that `APP_STORE_CONNECT_API_KEY_CONTENT` contains the **full** `.p8` file content including headers

### Build succeeds but doesn't appear in TestFlight

**Solution**: Check App Store Connect → TestFlight → Builds. It may be processing (takes 5-15 minutes after upload)

### Match certificate rotation error

**Solution**: Certificates expire yearly. When you see this error:
```bash
cd fastlane
fastlane match nuke distribution
fastlane ios setup_match
```

## 📊 Build Minutes Tracking

GitHub Actions provides:
- **Public repos**: ~200 macOS minutes/month (~20 builds)
- **Private repos**: Depends on plan

Each iOS build uses ~10 minutes of macOS time (counted 10x).

## 🔄 Updating the App

To release a new version:

1. Update version in `ios/App/App.xcodeproj/project.pbxproj`:
   ```
   MARKETING_VERSION = 1.0.1;
   CURRENT_PROJECT_VERSION = 2;
   ```

2. Commit and push to `main`

3. GitHub Actions will automatically:
   - Build new version
   - Upload to TestFlight
   - Increment build number

## 📚 Additional Resources

- [Fastlane Documentation](https://docs.fastlane.tools/)
- [App Store Connect Guide](https://developer.apple.com/app-store-connect/)
- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [GitHub Actions for iOS](https://docs.github.com/en/actions/deployment/deploying-xcode-applications)

## 🆘 Support

For issues specific to:
- **iOS deployment**: Check GitHub Actions logs
- **TestFlight**: Contact Apple Developer Support
- **ONDA app**: Open issue in this repository
