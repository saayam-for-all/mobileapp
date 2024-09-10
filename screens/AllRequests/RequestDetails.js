import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import Auth from '@aws-amplify/auth';
import { useNavigation, useRoute } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign' 
import Octicons from '@expo/vector-icons/Octicons'


export default function RequestDetails(item) {
    //const navigation = useNavigation();
    const route = useRoute();
    const req = route.params?.item; 
    const [userName, setUserName] = useState('');

    Auth.currentUserInfo().then((user) => {

        setUserName(user.attributes.name);
      });
   

    return (    
      <SafeAreaView style={styles.container}>            
      
        <View >
            <View style={{flexDirection:'row'}}>
            <Text style={styles.title}> {req.subject}</Text>
            <Text style={{ flex: 1, textAlign: "right" }}><Octicons
                    name="dot-fill"
                    size={15}
                    color={req.status === "Open" ? "orange" : "#aeb6bf"}
                  /> <Text>{req.status}</Text></Text></View>
            <View style={styles.header}>
            <Image source={require('../../assets/rn-logo.png')} style={styles.userImage}/>
           
            <Text style={styles.userName}> {userName}</Text></View>
            <Text>
                {" "}
                <AntDesign name="calendar" size={28} color="black" />{" "}
                <Text style={styles.text}> {req.creationDate}{" "}</Text>
              </Text>
              <Text style={styles.textUpdate}>Last Updated </Text>
              <Text style={styles.textDescription}>  We need volunteers for our upcoming Community Clean-Up Day on August 15 from
9:00 AM to 1:00 PM at Cherry Creek Park. Tasks include picking up litter, sorting recyclables, and managing the registration
table. We also need donations of trash bags, gloves, and refreshments.</Text>
        </View>    
                      
      
      </SafeAreaView>
    )
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      marginLeft:5,
      marginRight:5
      //alignItems: 'center',
      //justifyContent: 'center',
      //marginTop: 20,
    },  
    title: {
        fontSize: 20,
        fontWeight: 'bold'

    },
    userImage: {
        width: 50,
        aspectRatio: 1,
        borderRadius: 25,
        marginRight: 10,  
    
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        //backgroundColor: 'yellow',          
      },
      userName: {
        fontWeight: '600',
        marginBottom: 5,
        marginRight: 10,
        fontSize:20,
      },
      text: {
        fontWeight: '600',
        marginBottom: 20,
        marginRight: 10,
        fontSize:20,
      },
      textUpdate: {
        fontWeight: '400',
        marginBottom: 10,
        marginRight: 10,
        fontSize:20,
      },
      textDescription: {
        fontWeight: '400',
        marginBottom: 10,
        marginRight: 10,
        fontSize:20,
      },
  });