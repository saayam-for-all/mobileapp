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
import i18n from '../../i18n/i18n';
import * as Localization from 'expo-localization';
import { useEffect } from 'react';

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

  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const topOffset = Math.round(config.deviceHeight * 0.03);

  useEffect(() => {
    if (isFocused) {
      const deviceLang = Localization.locale.split('-')[0];

      console.log("Welcome Screen Device Language:", deviceLang);

      if (i18n.language !== deviceLang) {
        i18n.changeLanguage(deviceLang);
      }
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={[styles.container, { marginTop: topOffset }]}>
      <Header />
      <CarouselComponent />

      <View style={styles.content}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', margin: '2%' }}>
          {t('WELCOME_TEXT')}
        </Text>

        <Text style={{ fontSize: 16, margin: '2%' }} >
          {t('WELCOME_INTRO')}
          <Text
            style={styles.advertLinkText}
            onPress={() => { Linking.openURL('https://saayam.netlify.app/'); }}
          >
            {' '}{t('HERE')}
          </Text>
        </Text>

        <Spacer size='30' />

        <Button onPress={() => navigation.navigate('SignIn')} style={{ width: '100%', marginVertical: '3%' }}>
          {t('SIGN_IN')}
        </Button>

        <Button onPress={() => navigation.navigate('SignUp')} style={{ width: '100%', marginVertical: '3%' }}>
          {t('SIGNUP')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
