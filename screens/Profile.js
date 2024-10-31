import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';  // Using vector icons
import axios from 'axios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',  // Make the text bold
    marginLeft: 15,      // Add margin to align text to the left next to the icon
    flex: 1,             // Make the text take up remaining space
  },
  optionIcon: {
    marginRight: 15,
  },
  signOutButton: {
    marginTop: 30,
    backgroundColor: '#ff4444',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});


  

export default function Profile({ signOut }) {
  const navigation = useNavigation();
  const [isNotificationsEnabled, setNotificationsEnabled] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const API_URL = 'http://10.0.2.2:3000/users'; // For Android Emulator

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(API_URL); // Fetch data from API
        console.log('API Response:', response.data); // Log the API response
  
        const users = response.data || []; // Use the response directly as an array
  
        if (users.length === 0) {
          throw new Error('No users found');
        }
  
        const user = users.find((u) => u.id === "7"); // Use string comparison for 'id'
  
        if (!user) {
          throw new Error('User not found');
        }
  
        // Set form fields with fetched data
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setPhoneNumber(user.phone);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        Alert.alert('Error', error.message); // Display the error message
      }
    };
  
    fetchUserData(); // Call the function on component mount
  }, []);
  

  // Function to trigger the sign-out confirmation
  const confirmSignOut = () => {
    Alert.alert(
      'Alert', // Title
      'Are you sure you want to logout?', // Message
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel', // Makes the button look like a cancel button
        },
        {
          text: 'Logout',
          onPress: () => signOut(),
          style: 'destructive', // Adds red color to signify destructive action
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: 'data:image/jpeg;base64,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' }} style={styles.userImage} />
        <Text style={styles.userName}>{firstName} {lastName}</Text>
        <Text style={styles.userEmail}>{email} | {phoneNumber}</Text>
      </View>

      <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate('EditProfile')}>
        <FontAwesome name="user-circle-o" size={20} style={styles.optionIcon} />
        <Text style={styles.optionText}>Edit Profile</Text>
        <Ionicons name="chevron-forward" size={20} color="#777" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate('ChangePassword')}>
        <FontAwesome name="lock" size={20} style={styles.optionIcon} />
        <Text style={styles.optionText}>Change Password</Text>
        <Ionicons name="chevron-forward" size={20} color="#777" />
      </TouchableOpacity>

      <View style={styles.optionRow}>
        <FontAwesome name="bell" size={20} style={styles.optionIcon} />
        <Text style={styles.optionText}>Notifications</Text>
        <Switch
          value={isNotificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

      <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate('TermsAndConditions')}>
        <FontAwesome name="file-text-o" size={20} style={styles.optionIcon} />
        <Text style={styles.optionText}>Terms & Conditions</Text>
        <Ionicons name="chevron-forward" size={20} color="#777" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate('PrivacyPolicy')}>
        <FontAwesome name="shield" size={20} style={styles.optionIcon} />
        <Text style={styles.optionText}>Privacy Policy</Text>
        <Ionicons name="chevron-forward" size={20} color="#777" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate('UserSearch')}>
        <FontAwesome name="info-circle" size={20} style={styles.optionIcon} />
        <Text style={styles.optionText}>Help Center</Text>
        <Ionicons name="chevron-forward" size={20} color="#777" />
      </TouchableOpacity>

    <TouchableOpacity style={styles.optionRow} onPress={confirmSignOut}>
      <FontAwesome name="sign-out" size={20} style={styles.optionIcon} />
      <Text style={styles.optionText}>Log out</Text>
      <Ionicons name="chevron-forward" size={20} color="#777" />
    </TouchableOpacity>


      
    </ScrollView>
  );
}
