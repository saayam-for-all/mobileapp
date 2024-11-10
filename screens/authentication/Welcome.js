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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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
  socialButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  orText: {
    marginVertical: 15,
    fontSize: 16,
    fontWeight: '600',
    color: 'gray',
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
});

const Welcome = ({ navigation }) => {
  const signInWithGoogle = async () => {
    try {
      await Auth.federatedSignIn({ provider: 'Google' });
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  const signInWithFacebook = async () => {
    try {
      await Auth.federatedSignIn({ provider: 'Facebook' });
    } catch (error) {
      console.error('Error signing in with Facebook', error);
    }
  };

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

        {/* "Or with" separator */}
        <Text style={styles.orText}>Or sign in with</Text>

        {/* Social sign-in buttons side by side */}
        <View style={styles.socialButtonContainer}>
          <Button style={styles.socialButton} onPress={signInWithGoogle}>
            <FontAwesome5 name="google" size={20} color="black" style={styles.icon} />
            Google
          </Button>
          <Button style={styles.socialButton} onPress={signInWithFacebook}>
            <FontAwesome5 name="facebook-square" size={20} color="blue" style={styles.icon} />
            Facebook
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
