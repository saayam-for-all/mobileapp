import React, { useState } from 'react';
import {
  View, StyleSheet, Text,
} from 'react-native';
import { confirmSignUp, confirmUserAttribute, updateUserAttributes } from 'aws-amplify/auth';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useNavigation, useRoute } from '@react-navigation/native';

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


const Confirmation = () => {
  const [authCode, setAuthCode] = useState('');
  const [error, setError] = useState(' ');
  const route = useRoute();
  const navigation = useNavigation();
  const isUpdate = route.params.isUpdate;
  const toUpdate = route.params.toUpdate;
  const email = !isUpdate ? route.params.email : "";
  const nav = useNavigation();

  const confirmSignUpPress = async () => {
    if (authCode.length > 0) {
      await confirmSignUp({ username: email, confirmationCode: authCode })
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
  const confirmUpdatePress = async () => {
    if (authCode.length > 0) {
      try {
        await confirmUserAttribute({
          userAttributeKey: 'email',
          confirmationCode: authCode
        });
        await updateUserAttributes({userAttributes: toUpdate});
        navigation.navigate('Profile');
      } catch (err) {
        if (!err.message) {
          setError('Something went wrong, please contact support!');
        } else {
          setError(err.message);
        }
      }
    } else {
      setError('You must enter confirmation code');
    }
  }

  const confirm = async () => {
    if (!isUpdate) {
      await confirmSignUpPress();
    } else {
      await confirmUpdatePress();
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
      <Button style={{width:'94%', margin:'3%'}} onPress={() => confirm()}>{!isUpdate ? 'Confirm Sign Up' : 'Confirm Email'}</Button>
      <Text>{error}</Text>
    </View>
  );
};

export default Confirmation;