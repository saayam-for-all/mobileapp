## Instructions

Clone and checkout to the branch

To install libraries
`npm install`

Works with Expo go 52

### Important Notice

Since amplify v6 doesn't support Expo Go, we need Build for this branch.

To configure Build:

```
# Android
npx expo run:android
# iOS
npx expo run:ios
```

If everything is successful, will be able to see options for Expo.

### Debugging

Roll back `package.json` to remove updated/installed modules, then run `npm install`, and redo the build

If it shows ```› Using Expo Go › Press s │ switch to development build```, press ```s``` to switch to Expo Build, then ```a``` to start android emulator.
