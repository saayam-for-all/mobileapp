// jest.setup.js
import '@testing-library/jest-native/extend-expect';

// Mock de expo-font
jest.mock('expo-font', () => ({
  __esModule: true,
  default: {
    loadAsync: jest.fn().mockResolvedValue(true),
    isLoaded: jest.fn().mockReturnValue(true),
  },
}));

// Mock de react-native-reanimated (evita errores de Animated y apply)
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock global de Animated para que no intente usar NativeAnimatedHelper
import { Animated } from 'react-native';
Animated.timing = () => ({
  start: jest.fn(),
  stop: jest.fn(),
});


// 1. Fake timers
jest.useFakeTimers();

// 2. Mock Animated helper (rutas compatibles con Expo)
jest.mock('react-native/Libraries/Animated/NativeAnimatedModule', () => ({
  default: {},
  nativeEventEmitter: {
    addListener: jest.fn(),
    removeListener: jest.fn(),
  },
}));


// 3. Mock reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});



jest.mock('@expo/vector-icons', () => ({
    
  AntDesign: 'AntDesign',
  Ionicons: 'Ionicons',
  Octicons: 'Octicons',
}));

