import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { colors, borderRadius } from '../styles/theme';

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: '3%',
    marginVertical: '2%',
    padding: 10,
    width: '94%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.white,
  },
});

const Input = ({ value, onChange, ...props }) => (
  <TextInput
    style={styles.input}
    onChangeText={onChange}
    value={value}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
);

export default Input;
