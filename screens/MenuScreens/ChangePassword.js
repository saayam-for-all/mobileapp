import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import Auth from '@aws-amplify/auth';
import useAuthUser from '../../hooks/useAuthUser';

export default function ChangePassword() {
  const [secureEntry, setSecureEntry] = useState([true, true, true]);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const [logPasswordValid, setLogPasswordValid] = useState([false, false]);

  const navigation = useNavigation();
  const user = useAuthUser(navigation);

  const toggleSecureEntry = (index) => {
    setSecureEntry((prev) =>
      prev.map((item, i) => (i === index ? !item : item))
    );
  };

  function logError(error, errorMessage) {
    if (error) {
      Alert.alert("Error", errorMessage, [{ text: "OK" }]);
    } else {
      Alert.alert(
        "Password Updated Successfully",
        "",
        [{ text: 'OK', onPress: () => navigation.navigate('Profile') }]
      );
    }
  }

  async function changePassword() {
    let errorMessage = '';
    let error = false;

    if (!passwordValid || !confirmPasswordValid) {
      error = true;
      errorMessage = "Please make sure all inputs satisfy the requirements.";
    } else {
      await Auth.changePassword(user, oldPassword, password)
        .then(() => console.log("Password updated successfully"))
        .catch((err) => {
          error = true;
          errorMessage = String(err);
        });
    }
    logError(error, errorMessage);
  }

  const handleCancel = () => {
    setOldPassword('');
    setPassword('');
    setConfirmPassword('');
    setPasswordValid(false);
    setConfirmPasswordValid(false);
    setLogPasswordValid([false, false]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Change Password</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry={secureEntry[0]}
          value={oldPassword}
          onChangeText={setOldPassword}
          accessibilityLabel="Current Password Input"
        />
        <TouchableOpacity onPress={() => toggleSecureEntry(0)}>
          <FontAwesome name={secureEntry[0] ? 'eye-slash' : 'eye'} size={20} color="#777" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={secureEntry[1]}
          value={password}
          onChangeText={(text) => {
            setLogPasswordValid([true, logPasswordValid[1]]);
            const valid = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/;
            const isValid = valid.test(text);
            setPasswordValid(isValid);
            setConfirmPasswordValid(text === confirmPassword);
            setPassword(text);
          }}
          accessibilityLabel="New Password Input"
        />
        <TouchableOpacity onPress={() => toggleSecureEntry(1)}>
          <FontAwesome name={secureEntry[1] ? 'eye-slash' : 'eye'} size={20} color="#777" />
        </TouchableOpacity>
      </View>
      {!passwordValid && logPasswordValid[0] && (
        <Text style={styles.alertText}>
          Password must have 8+ characters, including uppercase, lowercase, digit, and special character.
        </Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={secureEntry[2]}
          value={confirmPassword}
          onChangeText={(text) => {
            setLogPasswordValid([logPasswordValid[0], true]);
            setConfirmPasswordValid(text === password);
            setConfirmPassword(text);
          }}
          accessibilityLabel="Confirm Password Input"
        />
        <TouchableOpacity onPress={() => toggleSecureEntry(2)}>
          <FontAwesome name={secureEntry[2] ? 'eye-slash' : 'eye'} size={20} color="#777" />
        </TouchableOpacity>
      </View>
      {!confirmPasswordValid && logPasswordValid[1] && (
        <Text style={styles.alertText}>Confirm password must match the new password.</Text>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={changePassword}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 25,
    textAlign: 'center',
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
  alertText: {
    color: 'red',
    marginHorizontal: '3%',
    width: '94%',
    marginBottom: 10,
    marginLeft: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#3B82F6', 
  },
  cancelButton: {
    backgroundColor: '#6B7280', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});
