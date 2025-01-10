import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import api from '../../components/api'
import { useNavigation } from '@react-navigation/native';
//import { MyReqData } from '../../data/MyReqData';
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

export default function MyReqs() {
  //const [searchQuery, setSearchQuery] = React.useState('');
  const [data, setData]  = useState([]);

  //console.log('My request Data', data);
  const getData = async () => { //test the deplyed api
    try {
      const res = await api.get('/requests/v0.0.1/get-requests');
      //console.log('Data from Axios', res.data);
      const resdata = res.data;  
      setData(resdata["body"]);
    } catch (error) {
      console.log('data error',error)    }   
  }

  useEffect(() => { 
     getData();

  }, []);
  
  if (data && data.length){
  return (    
    <SafeAreaView style={styles.container}>
 
     { /*<AllRequests data={MyReqData}/> */ }  
   
      <AllRequests data={data} />
  
    
    </SafeAreaView>
  )
}}


