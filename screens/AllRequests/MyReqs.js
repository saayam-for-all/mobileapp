import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import Button from '../../components/Button';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { MyReqData } from '../../data/MyReqData';

import config from '../../components/config'

import { Searchbar } from 'react-native-paper';
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
 
export default function MyReqs() {
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = React.useState('');
 
  return (    
    <SafeAreaView style={styles.container}>
        <PaperProvider>     
        
        <View style={{flexDirection:'row'}}>
         <Text style={{width: '90%'}}><Searchbar
      placeholder="Search the request   "
      onChangeText={setSearchQuery}
      value={searchQuery}
      style={{
        height: 30,
        borderColor: 'lightblue',
        borderWidth: 1,
        backgroundColor: 'white',
        margin: 6, 
        marginRight:5             
      }}
      inputStyle={{
        minHeight: 0, 
        minWidth: '80%'
      }}      
    /></Text>
    <Text style={{marginBottom:15}}><Ionicons name="filter" size={24} color="black" /></Text></View>
      
           
      <AllRequests data={MyReqData}/>      
            
    </PaperProvider>
    </SafeAreaView>
  )
}



