import React, { useState } from 'react';
import {
  View, StyleSheet, Text,
} from 'react-native';
import Auth from '@aws-amplify/auth';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
    backgroundColor: '#F8F8F8',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});


const Confirmation = ({ route, navigation, isUpdate=false }) => {
  const [authCode, setAuthCode] = useState('');
  const [error, setError] = useState(' ');
  const email = !isUpdate ? route.params.email : "";
  const nav = useNavigation();

  const confirmSignUp = async () => {
    if (authCode.length > 0) {
      await Auth.confirmSignUp(email, authCode)
        .then(() => {
          navigation.navigate('SignIn');
        })
        .catch((err) => {
          if (!err.message) {
            setError('Something went wrong, please contact support!');
          } else {
            setError(err.message);
          }
        });
    } else {
      setError('You must enter confirmation code');
    }
  };
  const confirmUpdate = async () => {
    if (authCode.length > 0) {
      await Auth.verifyCurrentUserAttributeSubmit(
        'email',
        authCode
      )
        .then(() => {
          nav.navigate('EditProfile');
        })
        .catch((err) => {
          if (!err.message) {
            setError('Something went wrong, please contact support!');
          } else {
            setError(err.message);
          }
        });
    } else {
      setError('You must enter confirmation code');
    }
  }

  return (
    <View style={styles.container}>
      <Text>Check your email for the confirmation code.</Text>
      <Input
        value={authCode}
        placeholder="123456"
        onChange={(text) => setAuthCode(text)}
      />
      {!isUpdate ?
        <Button onPress={() => confirmSignUp()}>Confirm Sign Up</Button>
        :
        <Button onPress={() => confirmUpdate()}>Confirm Email</Button>
      }
      <Text>{error}</Text>
    </View>
  );
};

export default Confirmation;
