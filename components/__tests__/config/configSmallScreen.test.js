import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

// Mock del config antes de importarlo
jest.mock('../../config', () => ({
  __esModule: true,
  default: {
    deviceWidth: 320,
    deviceHeight: 568,
  },
}));

import config from '../../config'

describe('responsive tests with config', () => {
  it('small screen', () => {
    const { getByText } = render(<Text>Hello World</Text>);

    expect(getByText('Hello World')).toBeTruthy();
    expect(config.deviceWidth).toBe(320);
    expect(config.deviceHeight).toBe(568);
  });

  
});
