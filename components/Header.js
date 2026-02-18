import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  StatusBar,
  StyleSheet, Platform, Linking
} from "react-native";
import Button from '../components/Button';
import config from '../components/config'
import { useTranslation } from "react-i18next";

const LogoImage = "https://saayamforall.org/wp-content/uploads/2023/03/saayamforall.jpeg";

export default function Header() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>

        <Image source={require('../assets/saayamforall.jpeg')}
          style={{ width: 50, height: 50, alignItems: 'left' }} />
      </View>
      <View style={{ marginLeft: config.deviceWidth / 1.6, alignItems: 'right' }}>
        <Button
          // onPress={() => navigation.navigate('Donate')}>
          onPress={() => { Linking.openURL('https://www.paypal.com/donate/?hosted_button_id=4KLWNM5JWKJ4S') }}>
          {t('DONATE')}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#d1f0ef',
    alignItems: 'center',
    paddingVertical: 3, // instead of flex
    paddingHorizontal: 16,
    marginTop: Platform.OS === "android" ? 20 : 0,
  },
});