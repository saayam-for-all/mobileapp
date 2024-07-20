//import React from 'react';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Button from '../components/Button';
import Auth from '@aws-amplify/auth';

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
  }
});
 //let userName = "test";
export default function Home({ signOut }) {
  const [userName, setUserName] = useState('');

  Auth.currentUserInfo().then((user) => {
   
    setUserName(user.attributes.name);
  });
  return (    
    <View style={styles.container}>
                 
      <View style={styles.header}>
        
      <Image source={require('../assets/rn-logo.png')} style={styles.userImage}/>
        <View>
        <Text style={styles.userName}>{userName}</Text>
        </View>

      </View>
      <View width='35%'>
      <Button onPress={() => signOut()}>Sign Out</Button>
      </View>
    </View>
  )
}
