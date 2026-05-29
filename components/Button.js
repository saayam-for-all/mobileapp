import React from 'react';
import { Text, StyleSheet, ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { colors, borderRadius, fontSize } from '../styles/theme';

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: "600",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    marginLeft: 8,
  },
});

const Button = ({
  onPress,
  children,
  backgroundColor,
  style = {},
  loading = false,
}) => {
  const btnStyle = {
    ...styles.buttonStyle,
    ...(backgroundColor ? { backgroundColor } : {}),
    ...style,
  };

  return (
    <TouchableOpacity
      onPress={loading ? null : onPress}
      style={btnStyle}
      disabled={loading}
      activeOpacity={0.7}
    >
      <View style={styles.contentRow}>
        <Text style={styles.textStyle}>
          {children}
        </Text>
        {loading && <ActivityIndicator color={colors.white} size="small" style={styles.loader} />}
      </View>
    </TouchableOpacity>
  );
};

export default Button;
