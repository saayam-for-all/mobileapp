## Instructions

### Prerequisites

#### Android Emulator Setup

1. Install [Android Studio](https://developer.android.com/studio)
2. Open Android Studio → **More Actions** → **Virtual Device Manager**
3. Click **Create Device** → choose a device (e.g. Pixel 8) → select a system image (API 33+ recommended) → Finish
4. Start the emulator by clicking the ▶ play button
5. Verify it's running: `adb devices` should list an emulator

> Make sure **ANDROID_HOME** is set in your environment:
> ```bash
> # ~/.zshrc or ~/.bashrc
> export ANDROID_HOME=$HOME/Library/Android/sdk
> export PATH=$PATH:$ANDROID_HOME/emulator
> export PATH=$PATH:$ANDROID_HOME/platform-tools
> ```

---

#### iOS Simulator Setup (macOS only)

1. Install [Xcode](https://apps.apple.com/us/app/xcode/id497799835) from the Mac App Store
2. Open Xcode → **Settings** → **Platforms** → download the latest iOS simulator runtime
3. Launch a simulator: **Xcode** → **Open Developer Tool** → **Simulator**
4. Verify with: `xcrun simctl list devices | grep Booted`

---

### Project Setup

Clone and checkout to the branch, then install dependencies:
```bash
npm install
```

Works with Expo Go 52.

---

### Important Notice

Since Amplify v6 doesn't support Expo Go, a **development build** is required for this branch.

To configure and run the build:
```bash
# Android
npx expo run:android    # or: npm run build:android

# iOS
npx expo run:ios        # or: npm run build:ios
```

If successful, you'll see device/emulator options from Expo.

> If you see `› Using Expo Go › Press s │ switch to development build`, press `s` to switch to Expo Build, then `a` for Android or `i` for iOS.

---

### Debugging

- Roll back `package.json` to remove updated/installed modules, then:
```bash
  npm install
```
  Then redo the build.

- Clean prebuilds:
```bash
  rm -rf android ios
```

#### Android

If the build still fails, uninstall the previous build (with emulator running):
```bash
adb uninstall {package_name}
```

#### iOS

If the build still fails, remove previous builds:
```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/*
xcrun simctl uninstall booted {package_name}
```
