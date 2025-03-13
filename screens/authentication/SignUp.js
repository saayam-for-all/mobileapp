/* eslint-disable no-console */
import React, { useState } from 'react';
import {
  View, StyleSheet, Text, Alert
} from 'react-native';
import Auth from '@aws-amplify/auth';
import Button from '../../components/Button';
import Input from '../../components/Input';
import PhoneInput from '../../components/PhoneInput';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  warnText:{
    fontSize: 10,
    fontWeight: 'bold',
  },
  innerText:{
    color:'Blue'
  },
  alertText: {
    color: 'red',
    marginHorizontal: '3%',
    width: '94%'
  }
});

export default function SignUp({ navigation }) {
  const [name, onChangeName] = useState('');
  const [lastName, onChangeLastName] = useState('');
  const [email, onChangeEmail] = useState('');
  const [phone_number, onChangePhone] = useState('');
  const [full_phone,setFullPhone] = useState('');
  const [country_code, onChangeCountryCode] = useState('+1');
  const [country_name, onChangeCountryName] = useState("United States");
  const [zoneinfo, onChangeTimeZone] = useState('');
  const [password, onChangePassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [repeatPassword, onChangeRepeatPassword] = useState('');

  const [invalidMessage, setInvalidMessage] = useState(null);
  const errorMessages = {
    password: 'Password must be equal and have greater length than 8 with uppercase, digits and special characters.',
    email: 'Please enter a valid email address.',
    phone: 'Phone number must be valid numeric values.'
  }

  const signUp = async () => {
    const validPassword = password.length > 5 && (password === repeatPassword);
    let errorMessage = null;
    let hasError = false;
    const allFields = [name, lastName, email, phone_number, password, repeatPassword];
    // Detect if there is an empty field
    const isNotEmpty = (value) => typeof value === 'string' && value.trim()!== '';
    const allInputsFilled = allFields.every(isNotEmpty);
    console.log(allInputsFilled);
    if (validPassword && emailValid && isPhoneValid && allInputsFilled) {
      setInvalidMessage(null);
      Auth.signUp({
        username: email, 
        password,
        attributes: {
          email, // optional
          given_name: name,
          // country_code, // later added to db
          "custom:Country": country_name,
          phone_number: full_phone, // later changed into phone without country code
          //zoneinfo,
          family_name: lastName
        },
        validationData: [], // optional
      })
        .then((data) => {
          console.log(data?.user?.username);
          if(data?.user?.username){
            AsyncStorage.setItem(data?.user?.username, JSON.stringify(true))
          }
          console.log('navigation: ', navigation);
          navigation.navigate('Confirmation', { email });
        })
        .catch((err) => {
          if (err.message) {
            popError(err.message);
            setInvalidMessage(err.message);
          }
          console.log(err);
        });
    } else {
      if (!validPassword || password == '') {
        errorMessage = errorMessages.password;
      }
      if (!emailValid || email == '') {
        errorMessage = errorMessages.email;
      }
      if (!isPhoneValid || phone_number == '') {
        errorMessage = errorMessages.phone;
      }
      if (!allInputsFilled) {
        errorMessage = 'Please fill all fields.';
      }
      setInvalidMessage(errorMessage);
      popError(errorMessage);
    }
  };
  const popError = (errorMessage) =>
    Alert.alert('Submission Failed', errorMessage, [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
  ]);
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row"}}><Input
        value={name}
        placeholder="First Name"
        onChange={(text) => onChangeName(text)} 
        width = '45%'  
        autoFocus
      />
      <Input
        value={lastName}
        placeholder="Last Name"
        onChange={(text) => onChangeLastName(text)}
        width = '45%'
        //autoFocus
      /></View>
      {!emailValid && 
        <Text style={styles.alertText}>
          {errorMessages.email}
        </Text>
      }
      <Input
        value={email}
        placeholder="email@example.com"
        
        onChange={(text) => {
          onChangeEmail(text);
          const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          const valid = regex.test(text);
            // address is invalid
            if (!valid) {
              setEmailValid(false);
            } else {
              setEmailValid(true);
            }
          }
        }
        autoCapitalize="none"
        autoCompleteType="email"
        keyboardType="email-address"
      />
      {/* <Input
        value={phone_number}
        placeholder="Phone number"
        onChange={(text) => onChangePhone(text)}
        autoCapitalize="none"
        autoCompleteType="tel"
        keyboardType="phone-pad"
      /> */}
      {!isPhoneValid && 
        <Text style={styles.alertText}>
          {errorMessages.phone}
        </Text>
      }
      <PhoneInput
        countryCode= {country_code}
        setCountryCode={(text) => onChangeCountryCode(text)}
        countryName={country_name} 
        onChangeCountryName={onChangeCountryName}
        setFullPhone={setFullPhone}
        phone={phone_number}
        placeholder="1234567890"
        onChangePhone={(text) => onChangePhone(text)}
        isPhoneValid = {isPhoneValid}
        setIsPhoneValid = {setIsPhoneValid}
        preferredCountries ={['US']}
        label=''
        errorMessage = ""
      />
      {/*<Input
        value={zoneinfo}
        placeholder="PST"
        onChange={(text) => onChangeTimeZone(text)}
        autoCapitalize="none"
       // autoCompleteType="email"
       // keyboardType="email-address"
      />*/}
      <Input
        value={country_name}
        placeholder="United States"
        onChange={(text) => onChangeCountryName(text)}
        autoCapitalize="none"
       // autoCompleteType="email"
       // keyboardType="email-address"
      />
      {!passwordValid && 
        <Text style={styles.alertText}>
          {errorMessages.password}
        </Text>
      }
      <Input
        value={password}
        placeholder="password"
        onChange={(text) => {
          const valid = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/;
          const isValid = valid.test(text);
          if(!isValid) {
            setPasswordValid(false);
          } else {
            setPasswordValid(true);
          }
          onChangePassword(text);
        }}
        secureTextEntry
        autoCompleteType="password"
      />
      <Input
        value={repeatPassword}
        placeholder="Repeat password"
        onChange={(text) => onChangeRepeatPassword(text)}
        secureTextEntry
        autoCompleteType="password"
      />
      <Button
        onPress={() => signUp()}
      >
        Sign Up
      </Button>
      <Text style={styles.warnText}>You will receive one time authentication code sent to your phone from <Text style={{ color: '#538CC6' }}>Saayam For All. </Text> Message and data rates may apply.
      </Text>
      <Text>
        {invalidMessage}
      </Text>
    </View>
  );
}
