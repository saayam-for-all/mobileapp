import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity,Alert} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native'; // To check platform type (iOS/Android)


const EditProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [zone, setZone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false); // To control date picker visibility
  const API_URL = 'http://10.0.2.2:3000/users'; // For Android Emulator

  // Fetch the user's data when the component mounts
 useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await axios.get(API_URL); // Fetch data from API
      console.log('API Response:', response.data); // Log the API response

      const users = response.data || []; // Use the response directly as an array

      if (users.length === 0) {
        throw new Error('No users found');
      }

      const user = users.find((u) => u.id === "5"); // Use string comparison for 'id'

      if (!user) {
        throw new Error('User not found');
      }

      // Set form fields with fetched data
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhoneNumber(user.phone);
      setZone(user.zone);
      setDob(user.dob);
      setGender(user.gender);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      Alert.alert('Error', error.message); // Display the error message
    }
  };

  fetchUserData(); // Call the function on component mount
}, []);

  
  
  



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


        // If all validations pass
    return true;
  };

  const handleUpdateProfile = () => {
    if (validateForm()) {
      Alert.alert('Success', 'Profile updated successfully.');
      // Proceed with the profile update logic here
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Hide the date picker after selection

    if (selectedDate) {
      // Format the date as DD/MM/YY
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear().toString().slice(-2);
      setDob(`${day}/${month}/${year}`); // Update DOB state with the selected date
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
       {/* DOB Input - Opens Date Picker */}
       <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="DOB (DD/MM/YY)"
          value={dob}
          editable={false} // Prevent manual editing
        />
      </TouchableOpacity>

      {/* Show Date Picker if state is true */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>
      
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
});

export default EditProfile;
