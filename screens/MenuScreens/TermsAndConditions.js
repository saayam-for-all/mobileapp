import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function TermsAndConditions() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms and Conditions</Text>

      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.text}>
        Welcome to our application. By accessing or using our app, you agree to be bound by these terms and conditions. Please read them carefully.
      </Text>

      <Text style={styles.sectionTitle}>2. Intellectual Property Rights</Text>
      <Text style={styles.text}>
        Unless otherwise stated, we or our licensors own the intellectual property rights in the app and material on the app. All these intellectual property rights are reserved.
      </Text>

      <Text style={styles.sectionTitle}>3. License to Use the App</Text>
      <Text style={styles.text}>
        You may view, download for caching purposes only, and print pages from the app for your own personal use, subject to the restrictions set out below and elsewhere in these terms and conditions.
      </Text>

      <Text style={styles.sectionTitle}>4. Acceptable Use</Text>
      <Text style={styles.text}>
        You must not use our app in any way that causes, or may cause, damage to the app or impairment of the availability or accessibility of the app.
      </Text>
      <Text style={styles.text}>
        You must not use our app in any way which is unlawful, illegal, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.
      </Text>

      <Text style={styles.sectionTitle}>5. Limitations of Liability</Text>
      <Text style={styles.text}>
        We will not be liable to you in relation to the contents of, or use of, or otherwise in connection with, this app for any direct, indirect, or consequential losses.
      </Text>

      <Text style={styles.sectionTitle}>6. Variation</Text>
      <Text style={styles.text}>
        We may revise these terms and conditions from time to time. The revised terms and conditions will apply to the use of our app from the date of the publication of the revised terms and conditions on this app.
      </Text>

      <Text style={styles.sectionTitle}>7. Entire Agreement</Text>
      <Text style={styles.text}>
        These terms and conditions constitute the entire agreement between you and us in relation to your use of our app and supersede all previous agreements in respect of your use of this app.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    lineHeight: 24,
  },
});
