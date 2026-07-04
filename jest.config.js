module.exports = {
  preset: 'jest-expo',


  moduleNameMapper: {
  '^aws-amplify/auth$': '<rootDir>/components/__mocks__/awsAmplifyMock.js',
},

  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo(nent)?|@expo|expo-modules-core|expo-file-system|react-native-country-codes-picker|@react-navigation|aws-amplify|@aws-amplify)/)',
  ],
};