import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import Button from '../components/Button';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
//import { PaperProvider } from 'react-native-paper';
import { MyReqData } from '../data/MyReqData';

import config from '../components/config'

//const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
   // backgroundColor: 'white',
    //maxWidth: 600,
   // width: '100%',
    //alignSelf: 'center',
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
    //marginTop: 20,
  },
  text: {
    textAlign: 'center'
  },
  buttonStyle: {
    
    width: config.deviceWidth/3,
    paddingTop: config.deviceHeight/1.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
   // padding: 5,
    backgroundColor: 'yellow', 
    marginTop: 5,  
    
    
  },
  table: {    
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'red', 
    marginTop:50,  
    flexDirection: 'column',
    height: 600,
   
  },
 
  logo: {
    width: 45,
    height: 45,
    borderRadius: 25,
    //marginRight: width/2.2,
    marginRight: config.deviceWidth/2.1,
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
});
 
export default function Home({ signOut }) {
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();
 
  return (    
    <SafeAreaView style={styles.container}>
             
      <View style={styles.header}>
      
        <Image source={require('../assets/saayamforall.jpeg')} style={styles.logo}/>
        <View style={styles.menu}>
        
          <TouchableOpacity 
          onPress={() => {Linking.openURL('https://www.paypal.com/donate/?hosted_button_id=4KLWNM5JWKJ4S')}}>
           <Text style={styles.menuItem}>Donate</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => {navigation.navigate("Profile")}}>
            <Image  source={require('../assets/profile.jpg')} style={styles.profileIcon} 
            />
        </TouchableOpacity>
        
      </View>
      <View>
      <TouchableOpacity onPress={() => {navigation.navigate("MyReqs")}}>
            <Text style={styles.menuItem}>My Requests</Text>
        </TouchableOpacity>
      </View> 
      <View>
      <TouchableOpacity onPress={() => {navigation.navigate("OtherRequests")}}>
            <Text style={styles.menuItem}>Other Requests</Text>
        </TouchableOpacity>
      </View> 
      <View>
      <TouchableOpacity onPress={() => {navigation.navigate("ManagedReqs")}}>
            <Text style={styles.menuItem}>Managed Requests</Text>
        </TouchableOpacity>
      </View>         
       
    
    </SafeAreaView>
  )
}


function GoToScreen({ screenName }) {
  const navigation = useNavigation();

  return (
    navigation.navigate(screenName)
  )
}

/*<View width='25%'>
<Button onPress={() => signOut()}>Sign Out</Button>
</View>
<TouchableOpacity onPress={() => {navigation.navigate("MyReqs")}}>
            <Text style={styles.menuItem}>My Requests</Text>
        </TouchableOpacity> */
