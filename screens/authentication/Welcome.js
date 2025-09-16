import React from 'react';
import {
  Text, View, StyleSheet, SafeAreaView, Linking,
} from 'react-native';
import Button from '../../components/Button';
import Header from '../../components/Header';
import { BannerData } from '../../data/BannerData';
import Banner from '../../components/Banner/Banner';
import { useIsFocused } from '@react-navigation/native';
import Spacer from '../../components/Spacer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollImage: {
    flex: 0.60,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  content: {
    width: '80%',
    margin: '10%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  advertLinkText: {
    color: 'blue',
  },
  button: {
    marginTop: 10,
  },
  orText: {
    marginVertical: 15,
    fontSize: 16,
    fontWeight: '600',
    color: 'gray',
  },
});

const Welcome = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.scrollImage}>
        {useIsFocused() && <Banner data={BannerData} />}
      </View>

      <View style={styles.content}>
        <Text style={{fontSize: 18, fontWeight: 'bold', margin:'2%'}}>Welcome to Saayam</Text>
        <Text style={{fontSize: 16, margin:'2%'}} >
          Saayam is a software platform that brings requesters of help, volunteers,
          volunteer organizations, and donors together. Please find out more
          <Text
            style={styles.advertLinkText}
            onPress={() => { Linking.openURL('https://saayam.netlify.app/'); }}
          >
            {' here.'}
          </Text>
        </Text>
        <Spacer size='30'/>
        {/* Sign In and Sign Up buttons */}
        <Button onPress={() => navigation.navigate('SignIn')} style={{width:'100%', marginVertical:'3%'}}>
          Sign In
        </Button>
        <Button onPress={() => navigation.navigate('SignUp')} style={{width:'100%', marginVertical:'3%'}}>
          Sign Up
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
