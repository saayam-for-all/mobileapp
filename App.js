import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-get-random-values';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigation from './navigation';
import config from './aws-exports';
import Amplify from '@aws-amplify/core';
import 'react-native-get-random-values' //Added for warning about insecure random no generator

Amplify.configure(config);

export default function App() {
  return (
    <View style={styles.container}>          
      <AppNavigation />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
