## Instructions

Clone and checkout to the branch

To install libraries
`npm install`

Works with Expo go 52

### Important Notice

Since amplify v6 doesn't support Expo Go, we need Build for this branch.

To configure Build:

```
# Android (npm run build:android)
npx expo run:android
# iOS (npm run build:ios)
npx expo run:ios
```

If everything is successful, will be able to see options for Expo.

### Debugging

Roll back `package.json` to remove updated/installed modules, then run `npm install`, and redo the build

Clean prebuilds by `rm -rf android ios`

If it shows ```› Using Expo Go › Press s │ switch to development build```, press ```s``` to switch to Expo Build, then ```a``` to start android emulator.

#### Android

If build still fails, remove previous builds by `adb uninstall {package_name}` with the emulator turned on

#### iOS

If build still fails, remove previous builds by

```
rm -rf \~/Library/Developer/Xcode/DerivedData/\*
xcrun simctl uninstall booted {package_name}
```
