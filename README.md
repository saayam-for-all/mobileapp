## Instructions

Clone and checkout to the branch

To install libraries
`npm install`

Works with Expo go 52

### Important Notice

Since amplify v6 doesn't support Expo Go, we need Expo Build for this branch.

To configure Expo Build:

```
npm install -g eas-cli

eas build --platform android --profile development

npm start
```

If each of there step is successful, will be able to see options for Expo

If it shows ```› Using Expo Go › Press s │ switch to development build```, press ```s``` to switch to Expo Build, then ```a``` to start android emulator.
