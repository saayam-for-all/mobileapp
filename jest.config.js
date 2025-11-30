module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest.setup.js' // <-- AÑADE ESTO
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|@testing-library)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  moduleNameMapper: {
    "^expo$": "<rootDir>/components/__mocks__/expo.js",
    "^expo-asset$": "<rootDir>/components/__mocks__/expo-asset.js",
  },
};
