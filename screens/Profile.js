import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import Auth from '@aws-amplify/auth';
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

  },
  userName: {
    fontWeight: '600',
    marginBottom: 5,
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
 
export default function Profile({ signOut }) {
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();
  Auth.currentUserInfo().then((user) => {
   
    setUserName(user.attributes.name);
  });
  return (    
    <View style={styles.container}>
                 
      <View style={styles.header}>
      <TouchableOpacity onPress={() => {navigation.navigate("Home")}}>
        <Image source={require('../assets/saayamforall.jpeg')} style={styles.logoImage}/>
        </TouchableOpacity>
        <View>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <Image source={require('../assets/rn-logo.png')} style={styles.userImage}/>
      </View>
      <View width='35%'>
      <Button onPress={() => signOut()}>Sign Out</Button>
      </View>
    </View>
  )
}