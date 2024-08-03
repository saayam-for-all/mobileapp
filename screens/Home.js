//import React from 'react';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: 'white',
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  text: {
    textAlign: 'center'
  },
  welcomeText: {
    fontStyle : 'italic',  
    textDecorationStyle : 'dashed',
    fontSize : 15,  
    marginBottom : 20,
    marginTop : 10     
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
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
  logoImage: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    marginRight: 150,  
    height: 50,
  }
});
 
export default function Home({ signOut }) {
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();

  return (    
    <View style={styles.container}>
                 
      <View style={styles.header}>
      
      <Image source={require('../assets/saayamforall.jpeg')} style={styles.logoImage}/>
       
        <TouchableOpacity onPress={() => {navigation.navigate("Profile")}}>
            <Image  source={require('../assets/rn-logo.png')} style={styles.userImage} 
            />
        </TouchableOpacity>
      </View>
      <View width='35%'>
        <Button onPress={() => signOut()}>Sign Out</Button>
      </View>
    </View>
  )
}


function GoToScreen({ screenName }) {
  const navigation = useNavigation();

  return (
    navigation.navigate(screenName)
  )
}
