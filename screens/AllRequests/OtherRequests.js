import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Button from '../../components/Button';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { MyReqData } from '../../data/MyReqData';

import config from '../../components/config'
import AllRequests from '../../components/AllRequests';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 5,
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
 
export default function OtherRequests() {
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();
 
  return (    
    <SafeAreaView style={styles.container}>            
     
           
      <AllRequests data={MyReqData}/>      
            
    
    </SafeAreaView>
  )
}
