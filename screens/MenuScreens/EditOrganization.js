import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity,Alert, ScrollView} from 'react-native';

const EditOrganization = () => {
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [URL, setURL] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [streetAddress2, setStreetAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');


  const validateForm = () => {
    // Organization Name should contain text only (no numbers or special characters)
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(organizationName)) {
      Alert.alert('Invalid Input', 'Organization Name should contain only letters.');
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

    // If all validations pass
    return true;
  };

  const handleUpdateProfile = () => {
    if (validateForm()) {
      Alert.alert('Success', 'Organization details updated successfully.');
      // Proceed with the profile update logic here
    }
  };

  return (
    <ScrollView>
        <View style={styles.container}>
            <Text style={styles.header}>Edit Organization Details</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Organization Name"
                value={organizationName}
                onChangeText={setOrganizationName}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Organization Type"
                value={organizationType}
                onChangeText={setOrganizationType}
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
                placeholder="URL"
                value={URL}
                onChangeText={setURL}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Street Address"
                value={streetAddress}
                onChangeText={setStreetAddress}
            />
            <TextInput
                style={styles.input}
                placeholder="Street Address 2"
                value={streetAddress2}
                onChangeText={setStreetAddress2}
            />
            <TextInput
                style={styles.input}
                placeholder="City"
                value={city}
                onChangeText={setCity}
            />
            <View style={styles.horizontalContainer}>
                <TextInput
                    style={{...styles.input,flexGrow:1}}
                    placeholder="State"
                    value={state}
                    onChangeText={setState}
                />
                <TextInput
                    style={{...styles.input,flexGrow:1}}
                    placeholder="Zip Code"
                    value={zipCode}
                    onChangeText={setZipCode}
                />
            </View>
            
            
            <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
                <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
    
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
  horizontalContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap:10
  }
});

export default EditOrganization;
