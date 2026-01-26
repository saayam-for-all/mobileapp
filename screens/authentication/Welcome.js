import React from 'react';
import {
  Text, View, StyleSheet, SafeAreaView, Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button';
import Auth from '@aws-amplify/auth';
import Header from '../../components/Header';
import { BannerData } from '../../data/BannerData';
import Banner from '../../components/Banner/Banner';
import { useIsFocused } from '@react-navigation/native';
import Spacer from '../../components/Spacer';
import CarouselComponent from '../../components/Carousel';
import config from '../../components/config';

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
  const { t } = useTranslation('auth');
  const topOffset = Math.round(config.deviceHeight * 0.03);
  return (
    <SafeAreaView style={[styles.container , { marginTop: topOffset }]}>
      <Header />
      <CarouselComponent />

      <View style={styles.content}>
        <Text style={{fontSize: 18, fontWeight: 'bold', margin:'2%'}}>{t('WELCOME_TO_SAAYAM')}</Text>
        <Text style={{fontSize: 16, margin:'2%'}} >
          {t('WELCOME_DESCRIPTION')}
          <Text
            style={styles.advertLinkText}
            onPress={() => { Linking.openURL('https://saayam.netlify.app/'); }}
          >
            {' '}{t('WELCOME_LINK_TEXT')}
          </Text>
        </Text>
        <Spacer size='30'/>
        {/* Sign In and Sign Up buttons */}
        <Button onPress={() => navigation.navigate('SignIn')} style={{width:'100%', marginVertical:'3%'}}>
          {t('SIGN_IN_BUTTON')}
        </Button>
        <Button onPress={() => navigation.navigate('SignUp')} style={{width:'100%', marginVertical:'3%'}}>
          {t('SIGN_UP_BUTTON')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
