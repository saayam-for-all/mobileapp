import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Auth from '@aws-amplify/auth';
import { countriesList } from '../../data/countries';
import Button from '../../components/Button';
import useAuthUser from '../../hooks/useAuthUser';
import RNPickerSelect from "react-native-picker-select";

import { ProfileFormStyles } from './ProfileStyles';


const EditProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [primaryEmail, setPrimaryEmail] = useState('');
  const [primaryPhoneNumber, setPrimaryPhoneNumber] = useState('');
  const [zoneinfo, setzoneinfo] = useState('');
  const [needVerification, setNeedVerification] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [backupProfile, setBackupProfile] = useState({});

  const navigation = useNavigation();
  const user = useAuthUser(navigation, (user) => {
    const attributes = user?.attributes;
    const { email, family_name, given_name, phone_number } = attributes;
    setFirstName(given_name);
    setLastName(family_name);
    setPrimaryEmail(email);
    setPrimaryPhoneNumber(phone_number);
  });

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        const attributes = user?.attributes;
        const { email, family_name, given_name, phone_number, ["custom:Country"]: zoneinfoAttr } = attributes;

        const profileData = {
          firstName: given_name || '',
          lastName: family_name || '',
          primaryEmail: email || '',
          primaryPhoneNumber: phone_number || '',
          secondaryEmail: '',
          secondaryPhoneNumber: '',
          zoneinfo: zoneinfoAttr || '',
        };

        setFirstName(profileData.firstName);
        setLastName(profileData.lastName);
        setPrimaryEmail(profileData.primaryEmail);
        setPrimaryPhoneNumber(profileData.primaryPhoneNumber);
        setzoneinfo(profileData.zoneinfo);
        setBackupProfile(profileData);
      })
      .catch((err) => console.log('Error loading user:', err));

    setNeedVerification(false);
  }, []);


  useEffect(() => {
    if (needVerification) {
      navigation.navigate("ConfirmUpdate", {
        email: user?.attributes?.email,
        isUpdate: true,
        toUpdate: {
          email: primaryEmail,
          family_name: lastName,
          given_name: firstName,
          phone_number: primaryPhoneNumber,
          "custom:Country": zoneinfo
        }
      });
      setNeedVerification(false);
    }
  }, [needVerification]);

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

    // If all validations pass
    return true;
  };

  const removeFirstTime = async (user) => {
    const username = user?.attributes?.email;
    if (username) {
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
          phone_number: primaryPhoneNumber,
          "custom:Country": zoneinfo,
        });
      }
      Alert.alert('Success', 'Profile updated successfully.');
      removeFirstTime(user);
    } catch (err) {
      Alert.alert('User Update Error', err.message);
    }
  }

  // ✨ Edit mode handlers
  const handleEdit = () => {
    setBackupProfile({
      firstName,
      lastName,
      primaryEmail,
      primaryPhoneNumber,
      zoneinfo,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (validateForm()) {
      const user = await Auth.currentAuthenticatedUser();
      await updateUser(user);

      // Update backup with new values
      setBackupProfile({
        firstName,
        lastName,
        primaryEmail,
        primaryPhoneNumber,
        zoneinfo,
      });

      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (Object.keys(backupProfile).length > 0) {
      setFirstName(backupProfile.firstName);
      setLastName(backupProfile.lastName);
      setPrimaryEmail(backupProfile.primaryEmail);
      setPrimaryPhoneNumber(backupProfile.primaryPhoneNumber);
      setzoneinfo(backupProfile.zoneinfo);
    }
    setIsEditing(false);
  };



  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Profile</Text>

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
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={primaryPhoneNumber}
        onChangeText={setPrimaryPhoneNumber}
        editable={isEditing}
      />

      <RNPickerSelect
        onValueChange={(value) => setzoneinfo(value)}
        items={countriesList}
        value={zoneinfo}
        disabled={!isEditing}
        placeholder={{ label: "Country", value: null }}
        useNativeAndroidPickerStyle={false}
        style={{
          inputIOS: styles.input,
          inputIOSContainer: {
            zIndex:100,
          },
          inputAndroid: styles.input,
          placeholder: {
            color: "#9CA3AF",
          },
        }}
      />

      {!isEditing ? (
        <Button onPress={handleEdit} style={styles.editButton}>Edit</Button>
      ) : (
        <View style={styles.buttonRow}>
          <Button onPress={handleSave} backgroundColor='#3B82F6' style={styles.button}>Save</Button>
          <Button onPress={handleCancel} backgroundColor='#6B7280' style={styles.button}>Cancel</Button>
        </View>
      )}
    </View>
  );
};

const styles = ProfileFormStyles;

export default EditProfile;
