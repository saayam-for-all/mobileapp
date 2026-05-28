import React from 'react';
import { Text, StyleSheet, ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { colors, borderRadius, fontSize } from '../styles/theme';
import { layout } from '../styles/common';

const styles = StyleSheet.create({
  buttonStyle: {
    padding: 10,
    backgroundColor: colors.primaryDark,
    borderColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  textStyle: {
    fontSize: fontSize.xl,
    color: colors.white,
  },
});

const Button = ({
  onPress,
  children,
  backgroundColor = colors.primary,
  style = {},
  loading = false,
}) => {
  const btnStyle = backgroundColor
    ? { ...styles.buttonStyle, ...style, backgroundColor }
    : { ...styles.buttonStyle, ...style };

  return (
    <TouchableOpacity
      onPress={loading ? null : onPress}
      style={btnStyle}
      disabled={loading}
      activeOpacity={0.7}
    >
      <View style={layout.row}>
        <Text style={styles.textStyle}>
          {children}
        </Text>
        {loading && <ActivityIndicator color={colors.white} size="small" />}
      </View>
    </TouchableOpacity>
  );
};

export default Button;
