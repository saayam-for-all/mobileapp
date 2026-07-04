module.exports = {
  preset: 'react-native',

  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo(nent)?|@expo|expo-file-system|react-native-country-codes-picker|@react-navigation)/)',
  ],

  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
  ],
};