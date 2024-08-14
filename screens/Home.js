import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: 'white',
    width: '100%',
    alignSelf: 'center',
  },
  text: {
    textAlign: 'center'
  },
  welcomeText: {
    fontStyle: 'italic',  
    textDecorationStyle: 'dashed',
    fontSize: 15,  
    marginBottom: 20,
    marginTop: 10     
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'yellow',   
  },
  userImage: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,    
    marginRight: 10,  
    height: 50,     
    marginLeft: 'auto'
  },
  userName: {
    fontWeight: '600',
    marginBottom: 5,
    alignSelf: 'Right',
    marginRight: 10
  }, 
  logo: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: width/2.2,
  },
  menuItem: {
    marginHorizontal: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black', // Set the text color to black
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default function Home({ signOut }) {
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();

  return (    
    <View style={styles.container}>
                 
      <View style={styles.header}>
        <Image source={require('../assets/saayamforall.jpeg')} style={styles.logo}/>
        <View style={styles.menu}>
          <TouchableOpacity 
            onPress={() => {Linking.openURL('https://www.paypal.com/donate/?hosted_button_id=4KLWNM5JWKJ4S')}}>
            <Text style={styles.menuItem}>Donate</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => {navigation.navigate("Profile")}}>
          <Image source={require('../assets/profile.jpg')} style={styles.profileIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <Button onPress={() => signOut()}>Sign Out</Button>
        <Button onPress={() => navigation.navigate('UserRequest')}>
          Create Help Request
        </Button>
      </View>
    </View>
  );
}