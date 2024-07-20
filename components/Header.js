import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  StatusBar,
  StyleSheet,
} from "react-native";

const LogoImage ="https://saayamforall.org/wp-content/uploads/2023/03/saayamforall.jpeg";

export default function Header() {
    return (
        <View style={styles.container}>
        <View style={styles.imageContainer}>
      
         <Image source={{uri: LogoImage}}
             style={{width: 50, height: 50}} />
       </View>
       </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        flex: .15,
        backgroundColor: '#d1f0ef',
        alignItems: 'center',
        marginBottom: 10,        
      },
  });