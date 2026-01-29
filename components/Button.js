import React from 'react';
import { Text, StyleSheet, ActivityIndicator, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  buttonStyle: {
    padding: 10,
    backgroundColor: '#2a6bcc',
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
  },
  contentStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  textStyle: {
    fontSize: 18,
    color: 'white',
  },
});

const Button = ({ 
  onPress, 
  children, 
  backgroundColor = 'rgb(72, 140, 255)', 
  style={}, 
  loading = false 
}) => {
  const btnStyle = backgroundColor ? {...styles.buttonStyle, ...style, backgroundColor } : {...styles.buttonStyle,...style};
  
  return (
    <TouchableOpacity
      onPress={loading ? null : onPress}
      style={btnStyle}
      disabled={loading}
      activeOpacity={0.7}
    >
      <View style={styles.contentStyle}>
        <Text style={styles.textStyle}>
          {children}
        </Text>
        {loading && <ActivityIndicator color="white" size="small" />}
      </View>
    </TouchableOpacity>
  );
};

export default Button;