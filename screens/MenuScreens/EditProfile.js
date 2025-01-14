import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity,Alert} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const EditProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [zone, setZone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');

  const validateForm = () => {
    // First Name and Last Name should contain text only (no numbers or special characters)
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(firstName)) {
      Alert.alert('Invalid Input', 'First Name should contain only letters.');
      return false;
    }
    if (!nameRegex.test(lastName)) {
      Alert.alert('Invalid Input', 'Last Name should contain only letters.');
      return false;
    }

    // Email should contain @ and follow general email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }

    // Phone number should start with '+' and contain digits only
    const phoneRegex = /^\+[0-9]{1,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Phone number should start with "+" followed by digits.');
      return false;
    }

    // Time Zone should be in uppercase
    if (zone !== zone.toUpperCase()) {
      Alert.alert('Invalid Time Zone', 'Time Zone should be in uppercase.');
      return false;
    }

    // DOB should match the DD/MM/YY format
    const dobRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{2}$/;
    if (!dobRegex.test(dob)) {
      Alert.alert('Invalid Date of Birth', 'DOB should be in the format DD/MM/YY.');
      return false;
    }

        // If all validations pass
    return true;
  };

  const handleUpdateProfile = () => {
    if (validateForm()) {
      Alert.alert('Success', 'Profile updated successfully.');
      // Proceed with the profile update logic here
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>
      
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Zone"
        value={zone}
        onChangeText={setZone}
      />
      
      <TextInput
        style={styles.input}
        placeholder="DOB (DD/MM/YY)"
        value={dob}
        onChangeText={setDob}
      />
      
      <RNPickerSelect
          onValueChange={(value) => setGender(value)}
          items={[
            { label: 'Select', value: '' },
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ]}
          value={gender}
          style={{
            inputIOS: styles.inputIOS,
            inputAndroid: styles.inputAndroid,
          }}
        />
      
      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    color: '#374151',
    paddingRight: 30,
    backgroundColor: '#f9fafb',
    marginBottom: 16,

  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    color: '#374151',
    paddingRight: 30,
    backgroundColor: '#f9fafb',
    marginBottom: 16,
  },
});

export default EditProfile;
