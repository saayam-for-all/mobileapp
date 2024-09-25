import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PersonalInfo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Information</Text>
      {/* Form components for personal info go here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});