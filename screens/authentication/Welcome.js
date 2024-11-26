import React from 'react';
import {
  Text, View, StyleSheet, SafeAreaView, Linking,
} from 'react-native';
import Button from '../../components/Button';
import Auth from '@aws-amplify/auth';
import Header from '../../components/Header';
import { BannerData } from '../../data/BannerData';
import Banner from '../../components/Banner/Banner';
import { useIsFocused } from '@react-navigation/native';

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
        <Text>
          Saayam is a software platform that brings requesters of help, volunteers,
          volunteer organizations, and donors together. Please find out more
          <Text
            style={styles.advertLinkText}
            onPress={() => { Linking.openURL('https://saayam.netlify.app/'); }}
          >
            {' here.'}
          </Text>
        </Text>

        {/* Sign In and Sign Up buttons */}
        <View style={styles.button}>
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
};

export default Welcome;
