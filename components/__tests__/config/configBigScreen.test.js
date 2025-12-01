import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

// Mock del config antes de importarlo
jest.mock('../../config', () => ({
  __esModule: true,
  default: {
    deviceWidth: 768,
    deviceHeight: 1024,
  },
}));

import config from '../../config'

describe('responsive tests with config', () => {
  
  it('large screen', () => {
    // cambiar el mock dinámicamente
    jest.mock('../../config', () => ({
      __esModule: true,
      default: {
        deviceWidth: 768,
        deviceHeight: 1024,
      },
    }));

    const { getByText } = render(<Text>Hello World</Text>);

    expect(getByText('Hello World')).toBeTruthy();
    expect(config.deviceWidth).toBe(768);
    expect(config.deviceHeight).toBe(1024);
  });
});
