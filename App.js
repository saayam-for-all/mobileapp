import './i18n/i18n'
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-get-random-values';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigation from './navigation';
import config from './aws-exports';
import Amplify from '@aws-amplify/core';
import 'react-native-get-random-values' //Added for warning about insecure random no generator
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './i18n/i18n';

Amplify.configure(config);

const LANGUAGE_KEY = "appLanguage";

export default function App() {
  useEffect(() => {
    // Load saved language preference on app startup
    (async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLanguage) {
          await i18n.changeLanguage(savedLanguage);
          console.log("App started with language:", savedLanguage);
        }
      } catch (e) {
        console.log("Error loading saved language on app startup:", e);
      }
    })();
  }, []);

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
