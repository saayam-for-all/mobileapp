import React from 'react'
import {render,fireEvent} from '@testing-library/react-native'
import Button from '../Button'
import { Linking } from 'react-native'
describe('test button ', () =>{

      it('calls onPress when pressed', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <Button onPress={mockPress}>Donar</Button>
    );

    const button = getByText('Donar');
    fireEvent.press(button);
    expect(mockPress).toHaveBeenCalled();
  });

   it('applies backgroundColor correctly', () => {
    const { UNSAFE_getByType } = render(
      <Button backgroundColor="#2a6bcc">Donar</Button>
    );

    const touchable = UNSAFE_getByType(require('react-native').TouchableHighlight);
    const style = Array.isArray(touchable.props.style)
      ? Object.assign({}, ...touchable.props.style)
      : touchable.props.style;

    expect(style.backgroundColor).toBe('#2a6bcc');
  });
  it('opens a url onPress', () =>{
     const openURLMock = jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve());

    onPress = () => Linking.openURL('https://www.paypal.com/donate/?hosted_button_id=4KLWNM5JWKJ4S')
    const { getByText } = render(
      <Button onPress={onPress}>Donar</Button>
    );
    button = getByText('Donar')
    fireEvent.press(button);
    expect(openURLMock).toHaveBeenCalledWith('https://www.paypal.com/donate/?hosted_button_id=4KLWNM5JWKJ4S')
    openURLMock.mockRestore();
})
     

})