import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity,Alert} from 'react-native';
import Auth from '@aws-amplify/auth';
import useAuthUser from '../../hooks/useAuthUser';

const EditProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [primaryEmail, setPrimaryEmail] = useState('');
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [primaryPhoneNumber, setPrimaryPhoneNumber] = useState('');
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState('');
  const [zone, setZone] = useState('');
  const [needVerification, setNeedVerification] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [backupProfile, setBackupProfile] = useState({});

  const navigation = useNavigation();
  const user = useAuthUser(navigation, (user) => {
    const attributes = user?.attributes;
    const {email, family_name, given_name, phone_number} = attributes;
    setFirstName(given_name);
    setLastName(family_name);
    setPrimaryEmail(email);
    setPrimaryPhoneNumber(phone_number);
  });

  useEffect(()=>{
    Auth.currentAuthenticatedUser().then((user)=>{
      setUser(user);
      const attributes = user?.attributes;
      const {email, family_name, given_name, phone_number} = attributes;
      setFirstName(given_name);
      setLastName(family_name);
      setPrimaryEmail(email);
      setPrimaryPhoneNumber(phone_number);

       setBackupProfile({
        firstName: given_name,
        lastName: family_name,
        primaryEmail: email,
        primaryPhoneNumber: phone_number,
        secondaryEmail: '',
        secondaryPhoneNumber: '',
        zone: '',
      });
    });
    setNeedVerification(false);
  },[]);

  useEffect(()=>{
    if (needVerification) {
      navigation.navigate("ConfirmUpdate", {
        email: user?.attributes?.email, 
        isUpdate: true, 
        toUpdate: {
          email: primaryEmail,
          family_name: lastName,
          given_name: firstName,
          phone_number: primaryPhoneNumber
        }
      });
      setNeedVerification(false);
    }
  },[needVerification]);

  const validateForm = () => {
    // First Name and Last Name should contain text only (no numbers or special characters)
    const nameRegex = /^[A-Za-z\s]+$/;
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
    if (!emailRegex.test(primaryEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid primary email address.');
      return false;
    }

    // Phone number should start with '+' and contain digits only
    const phoneRegex = /^\+[0-9]{1,15}$/;
    if (!phoneRegex.test(primaryPhoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Primary Phone number should start with "+" followed by digits.');
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

  const removeFirstTime = async (user) => {
    const username = user?.attributes?.email;
    if(username) {
      AsyncStorage.removeItem(username);
    }
  }

  async function updateUser(user) {
    try {
      // If Primary Email was changed, not change, direct user to enter confirmation code
      if (primaryEmail != user?.attributes?.email) {
        console.log("Needs verification");
        setNeedVerification(true); // Then users would be redirected to enter confirmation code
        return;
      } 
      // If Primary Email was not changed, update user attributes
      else {
        await Auth.updateUserAttributes(user, {
          email: primaryEmail,
          family_name: lastName, 
          given_name: firstName,
          phone_number: primaryPhoneNumber
        });
      }
      Alert.alert('Success', 'Profile updated successfully.');
      removeFirstTime(user);
    } catch (err) {
      Alert.alert('User Update Error', err.message);
    }
  }

  const handleSave = async () => {
    if (validateForm()) {
      const user = await Auth.currentAuthenticatedUser();
      await updateUser(user);

      // Update backup with new values
      setBackupProfile({
        firstName,
        lastName,
        primaryEmail,
        secondaryEmail,
        primaryPhoneNumber,
        secondaryPhoneNumber,
        zone,
      });

      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    // revert values
    setFirstName(backupProfile.firstName);
    setLastName(backupProfile.lastName);
    setPrimaryEmail(backupProfile.primaryEmail);
    setSecondaryEmail(backupProfile.secondaryEmail);
    setPrimaryPhoneNumber(backupProfile.primaryPhoneNumber);
    setSecondaryPhoneNumber(backupProfile.secondaryPhoneNumber);
    setZone(backupProfile.zone);

    setIsEditing(false);
  };


   return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        editable={isEditing}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        editable={isEditing}
      />

      <TextInput
        style={styles.input}
        placeholder="Primary Email"
        keyboardType="email-address"
        value={primaryEmail}
        onChangeText={setPrimaryEmail}
        editable={isEditing}
      />

      <TextInput
        style={styles.input}
        placeholder="Secondary Email"
        keyboardType="email-address"
        value={secondaryEmail}
        onChangeText={setSecondaryEmail}
        editable={isEditing}
      />

      <TextInput
        style={styles.input}
        placeholder="Primary Phone Number"
        keyboardType="phone-pad"
        value={primaryPhoneNumber}
        onChangeText={setPrimaryPhoneNumber}
        editable={isEditing}
      />

      <TextInput
        style={styles.input}
        placeholder="Secondary Phone Number"
        keyboardType="phone-pad"
        value={secondaryPhoneNumber}
        onChangeText={setSecondaryPhoneNumber}
        editable={isEditing}
      />

      <TextInput
        style={styles.input}
        placeholder="Zone"
        value={zone}
        onChangeText={setZone}
        editable={isEditing}
      />

      {!isEditing ? (
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#3B82F6' }]} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#6B7280' }]} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
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
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  editButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
