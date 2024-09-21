import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons'; // Using vector icons

export default function ChangePassword() {
  const [secureEntry, setSecureEntry] = useState(true);

  const toggleSecureEntry = () => setSecureEntry(!secureEntry);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry={secureEntry}
          accessibilityLabel="Current Password Input"
        />
        <TouchableOpacity onPress={toggleSecureEntry}>
          <FontAwesome name={secureEntry ? 'eye-slash' : 'eye'} size={20} color="#777" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={secureEntry}
          accessibilityLabel="New Password Input"
        />
        <TouchableOpacity onPress={toggleSecureEntry}>
          <FontAwesome name={secureEntry ? 'eye-slash' : 'eye'} size={20} color="#777" />
        </TouchableOpacity>
      </View>
      <Text style={styles.passwordHint}>must contain 8 char.</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={secureEntry}
          accessibilityLabel="Confirm Password Input"
        />
        <TouchableOpacity onPress={toggleSecureEntry}>
          <FontAwesome name={secureEntry ? 'eye-slash' : 'eye'} size={20} color="#777" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  passwordHint: {
    color: '#777',
    marginBottom: 20,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
