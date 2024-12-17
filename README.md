# Build Instructions

## Prerequisites

1. Install the following software:
   - [Node.js](https://nodejs.org/) (LTS version recommended)
   - [Android Studio](https://developer.android.com/studio)
   - [JDK 11](https://adoptium.net/) or newer

## Environment Setup

1. Set up Android development environment:
   - Open Android Studio
   - Install Android SDK (via Tools → SDK Manager)
   - Set ANDROID_HOME environment variable to your Android SDK location
     - Windows: `set ANDROID_HOME=C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk`
     - macOS/Linux: `export ANDROID_HOME=$HOME/Library/Android/sdk`

## Build Steps

1. Install project dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Start Metro bundler:
   ```bash
   npm start
   # or
   yarn start
   ```

3. Build and run the Android app:
   ```bash
   # In a new terminal window
   npm run android
   # or
   yarn android
   ```

## Troubleshooting

If you encounter build issues:

1. Clean the project:
   ```bash
   cd android
   ./gradlew clean
   ```

   If `gradlew` is missing:
   ```bash
   # Navigate to android directory
   cd android
   
   # Generate gradlew file (Windows)
   gradle wrapper
   
   # On macOS/Linux, also make gradlew executable
   chmod +x gradlew
   
   # Now you can use gradlew
   ./gradlew clean
   ```

2. Clear Metro bundler cache:
   ```bash
   npm start -- --reset-cache
   ```

3. Make sure all dependencies are properly installed:
   ```bash
   npm install
   ```

## Build Release Version

To create a release build:

1. Navigate to android directory:
   ```bash
   cd android
   ```

2. Create release build:
   ```bash
   ./gradlew assembleRelease
   ```

   If `gradlew` is missing:
   ```bash
   # Generate gradlew file (Windows)
   gradle wrapper
   
   # On macOS/Linux, make gradlew executable
   chmod +x gradlew
   
   # Then create release build
   ./gradlew assembleRelease
   ```

The release APK will be available at: `android/app/build/outputs/apk/release/app-release.apk`

> Note: If `gradle` command is not found, you need to install Gradle first:
> - Windows: `choco install gradle` (using Chocolatey)
> - macOS: `brew install gradle` (using Homebrew)
> - Linux: `sudo apt install gradle` (Ubuntu/Debian) or use your distribution's package manager

## Building Release APK Online

### Using Expo EAS (Expo Application Services)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to your Expo account:
```bash
eas login
```

3. Configure your project:
```bash
eas build:configure
```

4. Start the build:
```bash
eas build --platform android
```

The APK will be available for download from your Expo dashboard.