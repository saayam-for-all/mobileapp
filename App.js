import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigation from './navigation';
import { amplifyConfig } from './amplifyconfiguration';
import {Amplify} from 'aws-amplify';

Amplify.configure(amplifyConfig)
//const currentConfig = Amplify.getConfig();
//console.log('Current amplify config', currentConfig)

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
