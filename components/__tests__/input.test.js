import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Input from '../Input';

describe('Input component', () => {
  it('renders correctly with given value', () => {
    const { getByDisplayValue } = render(<Input value="Hello" onChange={() => {}} />);
    expect(getByDisplayValue('Hello')).toBeTruthy();
  });

  it('calls onChange when text changes', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(
      <Input value="" onChange={mockOnChange} testID="input-field" />
    );

    fireEvent.changeText(getByTestId('input-field'), 'New text');
    expect(mockOnChange).toHaveBeenCalledWith('New text');
  });

  it('applies custom props correctly', () => {
    const { getByTestId } = render(
      <Input
        value=""
        onChange={() => {}}
        testID="input-field"
        placeholder="Enter text..."
      />
    );

    const input = getByTestId('input-field');
    expect(input.props.placeholder).toBe('Enter text...');
  });
});
