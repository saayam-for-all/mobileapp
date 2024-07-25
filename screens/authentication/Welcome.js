import React from 'react';
import {
  Text, View, StyleSheet, SafeAreaView, Linking
} from 'react-native';
import Button from '../../components/Button';
import BackgroundImage from '../../components/BackgroundImage';
import Auth from '@aws-amplify/auth';
import Header from '../../components/Header';
import {BannerData} from '../../data/BannerData';
import Banner from '../../components/Banner/Banner';
import { useIsFocused } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
   //justifyContent: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollImage: {
    flex: 0.60,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  advertLinkText: {      
    color: 'blue'
  },
  title: {
    fontSize: 22,
    margin: 10,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '800',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.95)',
    padding: 15,
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    marginTop: 10,
  },
});

  
const Welcome = ({ navigation }) => ( 
  
  <SafeAreaView style={styles.container}>
            <Header />         
    <View style={styles.scrollImage}>
          <View>{useIsFocused() ? <View><Banner data={BannerData}/></View> : <View></View>}</View>           
       
    </View>
      
      <View style={styles.content}>
        <View>
          <Text>Saayam is a software platform that brings requesters of help, volunteers,
           volunteer organizations and donors together. Please find out more
               <Text style={styles.advertLinkText}                   
                  onPress={() => {Linking.openURL('https://saayam.netlify.app/')}}>
                   {' '} 
                    here.
                  </Text>
          </Text>
          <Text></Text>
        </View>
        <View>
          <Button onPress={() => navigation.navigate('SignIn')}>
            Sign In
          </Button>
        </View>
        <View style={styles.button}>
          <Button onPress={() => navigation.navigate('SignUp')}>
            Sign Up
          </Button>
        </View>
      </View>
    
  </SafeAreaView>
);

export default Welcome;
