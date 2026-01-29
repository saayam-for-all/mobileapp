import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Spacer from '../../components/Spacer';
import { FontAwesome, Ionicons } from '@expo/vector-icons'; 
import { TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  textDescriptionontainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  errorText: {
    color: 'red',
    marginTop: 12,
    marginHorizontal: '3%',
    width: '94%',
  },
});

function ForgetPassword({ navigation }) {
  const [email, onChangeEmail] = useState('');
  const [editableInput, setEditableInput] = useState(true);
  const [confirmationStep, setConfirmationStep] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [codeLoading, setCodeLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const getConfirmationCode = async () => {
    if (email.length > 4) {
      setCodeLoading(true);
      try {
        await resetPassword({ username: email });
        setEditableInput(true);
        setConfirmationStep(true);
        setErrorMessage('');
        setCodeLoading(false);
      } catch (err) {
        setCodeLoading(false);
        if (err.message) {
          setErrorMessage(err.message);
        }
      }
    } else {
      setErrorMessage('Provide a valid email');
    }
  };

  const postNewPassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    setConfirmLoading(true);
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword
      });
      setConfirmLoading(false);
      setErrorMessage('');
      navigation.navigate('SignIn');
    } catch (err) {
      setConfirmLoading(false);
      if (err.message) {
        setErrorMessage(err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Input
        value={email}
        placeholder="email@example.com"
        onChange={(text) => onChangeEmail(text)}
        editable={editableInput}
        autoCompleteType="email"
        autoCapitalize="none"
        autoFocus
        keyboardType="email-address"
      />
      <Button
        style={{width: '94%', margin: '3%'}}
        onPress={() => getConfirmationCode()}
        loading={codeLoading}
      >
        Reset password
      </Button>
      {confirmationStep && (
        <>
          <Spacer size={10} />
          <View style={styles.textDescriptionontainer}>
            <Text style={{marginHorizontal:'3%'}}>Check your email for the confirmation code.</Text>
            <Spacer size={20} />
          </View>
          <Input
            value={code}
            placeholder="123456"
            onChange={(text) => setCode(text)}
          />
          <View style={styles.textDescriptionontainer}>
            <Text style={{marginHorizontal:'3%'}}>New Password</Text>
            <Spacer size={20} />
          </View>
          <View style={{ width: '94%', flexDirection: 'row', alignItems: 'center', margin: '3%' }}>
            <Input
              value={newPassword}
              placeholder="password"
              onChange={(text) => setNewPassword(text)}
              secureTextEntry={!showPassword}
              autoCompleteType="password"
              style={{ flex: 1 }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#777" />
            </TouchableOpacity>
          </View>
          <View style={{ width: '94%', flexDirection: 'row', alignItems: 'center', margin: '3%' }}>
            <Input
              value={confirmPassword}
              placeholder="password"
              onChange={(text) => setConfirmPassword(text)}
              secureTextEntry={!showPassword}
              autoCompleteType="password"
              style={{ flex: 1 }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#777" />
            </TouchableOpacity>
          </View>
          <Button
            style={{width: '94%', margin: '3%'}}
            onPress={() => postNewPassword()}
            loading={confirmLoading}
          >
            Submit new password
          </Button>
        </>
      )}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
}

export default ForgetPassword;