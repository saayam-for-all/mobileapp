import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';  // Using vector icons

import ProfileImage from './ProfileImage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
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

const DEFAULT_PROFILE_ICON = require('../assets/rn-logo.png');

export default function Profile({ signOut }) {
  const navigation = useNavigation();
  const [isNotificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState({});

  useEffect(() => {
    const getImage = async () => {
      const value = await AsyncStorage.getItem('profilePhoto');
      if(value) setProfilePhoto(JSON.parse(value));
    }
    getImage();
  }, [profilePhoto]);
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
  <>  
    <ProfileImage
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        profilePhoto={profilePhoto}
        setProfilePhoto={setProfilePhoto}
    />
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {/* <Image source={require('../assets/rn-logo.png')} style={styles.userImage} onPress={setIsModalOpen(true)}/> */}
        <TouchableOpacity onPress={()=>setIsModalOpen(true)}>
          {profilePhoto?.uri?
            (<Image source={profilePhoto} style={styles.userImage} />)
            :(<Image source={DEFAULT_PROFILE_ICON} style={styles.userImage} />)
          }
        </TouchableOpacity>
        <Text style={styles.userName}>Jacob Jones</Text>
        <Text style={styles.userEmail}>youremail@domain.com | +01 234 567 89</Text>
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

      <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate('EditOrganization')}>
        <FontAwesome name="user-circle-o" size={20} style={styles.optionIcon} />
        <Text style={styles.optionText}>Edit Organization</Text>
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

      <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate('Welcome')}>
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
  </>
  );
}
