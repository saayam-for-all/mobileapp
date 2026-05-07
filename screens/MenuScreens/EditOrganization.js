import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Button from '../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileFormStyles } from './ProfileStyles';

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

  const [isEditing, setIsEditing] = useState(false);
  const [backupProfile, setBackupProfile] = useState({});

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(organizationName)) {
      Alert.alert('Invalid Input', 'Organization Name should contain only letters.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }

    const phoneRegex = /^\+[0-9]{1,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Phone number should start with "+" followed by digits.');
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      AsyncStorage.setItem('user_updated', 'false');
      Alert.alert('Success', 'Organization details updated successfully.');
      setBackupProfile({
        organizationName,
        organizationType,
        email,
        phoneNumber,
        URL,
        streetAddress,
        streetAddress2,
        city,
        state,
        zipCode,
      });
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setBackupProfile({
      organizationName,
      organizationType,
      email,
      phoneNumber,
      URL,
      streetAddress,
      streetAddress2,
      city,
      state,
      zipCode,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setOrganizationName(backupProfile.organizationName || '');
    setOrganizationType(backupProfile.organizationType || '');
    setEmail(backupProfile.email || '');
    setPhoneNumber(backupProfile.phoneNumber || '');
    setURL(backupProfile.URL || '');
    setStreetAddress(backupProfile.streetAddress || '');
    setStreetAddress2(backupProfile.streetAddress2 || '');
    setCity(backupProfile.city || '');
    setState(backupProfile.state || '');
    setZipCode(backupProfile.zipCode || '');
    setIsEditing(false);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Organization Details</Text>

        <TextInput
          style={styles.input}
          placeholder="Organization Name"
          value={organizationName}
          onChangeText={setOrganizationName}
          editable={isEditing}
        />

        <TextInput
          style={styles.input}
          placeholder="Organization Type"
          value={organizationType}
          onChangeText={setOrganizationType}
          editable={isEditing}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={isEditing}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          editable={isEditing}
        />

        <TextInput
          style={styles.input}
          placeholder="URL"
          value={URL}
          onChangeText={setURL}
          editable={isEditing}
        />

        <TextInput
          style={styles.input}
          placeholder="Street Address"
          value={streetAddress}
          onChangeText={setStreetAddress}
          editable={isEditing}
        />

        <TextInput
          style={styles.input}
          placeholder="Street Address 2"
          value={streetAddress2}
          onChangeText={setStreetAddress2}
          editable={isEditing}
        />

        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
          editable={isEditing}
        />

        <View style={styles.horizontalContainer}>
          <TextInput
            style={[styles.input, { flexGrow: 1 }]}
            placeholder="State"
            value={state}
            onChangeText={setState}
            editable={isEditing}
          />
          <TextInput
            style={[styles.input, { flexGrow: 1 }]}
            placeholder="Zip Code"
            value={zipCode}
            onChangeText={setZipCode}
            editable={isEditing}
          />
        </View>

        {!isEditing ? (
          <Button onPress={handleEdit} style={styles.editButton}>Edit</Button>
        ) : (
          <View style={styles.buttonRow}>
            <Button onPress={handleSave} backgroundColor='#3B82F6' style={styles.button}>Save</Button>
            <Button onPress={handleCancel} backgroundColor='#6B7280' style={styles.button}>Cancel</Button>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = ProfileFormStyles;

export default EditOrganization;
