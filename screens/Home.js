//import React from 'react';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import Button from '../components/Button';
//import { Button } from '@react-native-material/core';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   //justifyContent: 'center',
  //   //alignItems: 'center',
  //   backgroundColor: 'white',
  //   // maxWidth: 600,
  //   width: '100%',
  //   // alignSelf: 'center',
  //   justifyContent: 'flex-start', // Aligns children at the top
  //   alignItems: 'flex-end', // Aligns children at the right
  //   padding: 0, // Optional: Adds some padding around the container
  // },
  
  welcomeText: {
    fontStyle : 'italic',  
    textDecorationStyle : 'dashed',
    fontSize : 15,  
    marginBottom : 20,
    marginTop : 10     
  },
  header: {
    flexDirection: 'row',
    // alignItems: 'center',
    padding: 10,
    width: '100%',
    backgroundColor: 'yellow',   
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  userImage: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,    
    marginRight: 10,  
    height: 50,     
    // marginLeft: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 10

  },
  userName: {
    fontWeight: '600',
    marginBottom: 5,
    alignSelf: 'Right',
    marginRight: 10
  },
  logoImage: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    marginRight: 150,  
    height: 50,
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'yellow', // Set the background color to yellow
    width: '100%',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  menu: {
    flexDirection: 'row',
  },
  menuItem: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black', // Set the text color to black
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
 
export default function Home({ signOut }) {
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();

  // return (    
  //   <View style={styles.container}>
                 
  //     <View style={styles.header}>
      
  //     <Image source={require('../assets/saayamforall.jpeg')} style={styles.logoImage}/>
       
        // <TouchableOpacity onPress={() => {navigation.navigate("Profile")}}>
        //     <Image  source={require('../assets/profile.jpg')} style={styles.userImage} 
        //     />
        // </TouchableOpacity>
  //     </View>
      // <View width='35%'>
      //   <Button onPress={() => signOut()}>Sign Out</Button>
      // </View>
  //   </View>
  // )

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/saayamforall.jpeg')}
        style={styles.logo}
      />
      <View style={styles.menu}>
        <Text style={styles.menuItem}>About Us</Text>
        <TouchableOpacity 
          onPress={() => {Linking.openURL('https://www.paypal.com/donate/?hosted_button_id=4KLWNM5JWKJ4S')}}>
        <Text style={styles.menuItem}>Donate</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => {navigation.navigate("Profile")}}>
      <Image
        source={require('../assets/profile.jpg')}
        style={styles.profileIcon}
      />
      </TouchableOpacity>
    </View>
    
  );
}


function GoToScreen({ screenName }) {
  const navigation = useNavigation();

  return (
    navigation.navigate(screenName)
  )
}
