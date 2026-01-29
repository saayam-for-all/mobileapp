import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { fetchAuthSession, fetchUserAttributes, updateUserAttribute } from 'aws-amplify/auth';
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
  const user = useAuthUser();

  useEffect(() => {
    if (user) {
      const attributes = user?.attributes;
      const { email, family_name, given_name, phone_number } = attributes;
      setFirstName(given_name);
      setLastName(family_name);
      setPrimaryEmail(email);
      setPrimaryPhoneNumber(phone_number);
    }
  }, [user]);

  useEffect(() => {
    const loadUserAttributes = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const { email, family_name, given_name, phone_number } = attributes;
        const zoneinfoAttr = attributes['custom:Country'];

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
      } catch (err) {
        console.log('Error loading user:', err);
      }
    };

    loadUserAttributes();
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
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(firstName)) {
      Alert.alert('Invalid Input', 'First Name should contain only letters.');
      return false;
    }
    if (!nameRegex.test(lastName)) {
      Alert.alert('Invalid Input', 'Last Name should contain only letters.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(primaryEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid primary email address.');
      return false;
    }

    const phoneRegex = /^\+[0-9]{1,15}$/;
    if (!phoneRegex.test(primaryPhoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Primary Phone number should start with "+" followed by digits.');
      return false;
    }

    return true;
  };

  const removeFirstTime = async (userEmail) => {
    if (userEmail) {
      AsyncStorage.removeItem(userEmail);
    }
  }

  async function updateUser() {
    AsyncStorage.setItem('user_updated', 'false');
    try {
      const currentAttributes = await fetchUserAttributes();
      
      // If Primary Email was changed, redirect to verification
      if (primaryEmail !== currentAttributes.email) {
        console.log("Needs verification");
        setNeedVerification(true);
        return;
      }
      // If Primary Email was not changed, update user attributes
      else {
        await updateUserAttribute({ userAttribute: { attributeKey: 'family_name', value: lastName } });
        await updateUserAttribute({ userAttribute: { attributeKey: 'given_name', value: firstName } });
        await updateUserAttribute({ userAttribute: { attributeKey: 'phone_number', value: primaryPhoneNumber } });
        await updateUserAttribute({ userAttribute: { attributeKey: 'custom:Country', value: zoneinfo } });
      }
      Alert.alert('Success', 'Profile updated successfully.');
      removeFirstTime(currentAttributes.email);
    } catch (err) {
      Alert.alert('User Update Error', err.message);
    }
  }

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
      await updateUser();

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