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
