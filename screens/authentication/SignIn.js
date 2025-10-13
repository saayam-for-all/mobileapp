/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import Auth from "@aws-amplify/auth";
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import Button from "../../components/Button";
import Spacer from "../../components/Spacer";
import Input from "../../components/Input";
//import Ionicons from 'react-native-vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons'; 

const CREDENTIALS_KEY = 'saayam_credentials';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // White background
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB", // Light gray border
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: "#F9FAFB", // Slight gray background
    fontSize: 16,
  },
  button: {
    backgroundColor: "#3B82F6", // Bright blue button
    width: "100%",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFFFFF", // White text
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPassword: {
    color: "#6B7280", // Gray text
    fontSize: 14,
    marginTop: 10,
    textDecorationLine: "underline",
  },
  orText: {
    color: "#6B7280", // Gray text
    fontSize: 14,
    marginVertical: 15,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  textDescriptionontainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  socialButton: {
    width: "45%",
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB", // Light gray border
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
  },
  socialIcon: {
    marginRight: 10,
  },
  signupText: {
    fontSize: 14,
    color: "#6B7280",
  },
  signupLink: {
    color: "#3B82F6",
    textDecorationLine: "underline",
  },
  alertText: {
    color: 'red',
    marginHorizontal: '3%',
    width: '94%',
    marginBottom: 20,
    marginLeft: 5,
  }
});

export default function SignIn({ navigation, signIn: signInCb }) {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState(null);
  const [hasStoredCredentials, setHasStoredCredentials] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
    checkStoredCredentials();
  }, []);

  const checkBiometricAvailability = async () => {
    if (Platform.OS === 'ios') {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (compatible && enrolled) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        setBiometricAvailable(true);
        
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Touch ID');
        }
      }
    }
  };

  const checkStoredCredentials = async () => {
    if (Platform.OS === 'ios') {
      try {
        const credentials = await SecureStore.getItemAsync(CREDENTIALS_KEY);
        if (credentials) {
          setHasStoredCredentials(true);
        }
      } catch (error) {
        console.log('Error checking stored credentials:', error);
      }
    }
  };

  const saveCredentials = async (email, password) => {
    if (Platform.OS === 'ios') {
      try {
        const credentials = JSON.stringify({ email, password });
        await SecureStore.setItemAsync(CREDENTIALS_KEY, credentials, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        });
        setHasStoredCredentials(true);
        console.log('Credentials saved successfully');
      } catch (error) {
        console.log('Error saving credentials:', error);
      }
    }
  };

  const getStoredCredentials = async () => {
    if (Platform.OS === 'ios') {
      try {
        const credentials = await SecureStore.getItemAsync(CREDENTIALS_KEY);
        if (credentials) {
          return JSON.parse(credentials);
        }
      } catch (error) {
        console.log('Error retrieving credentials:', error);
      }
    }
    return null;
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Sign in with ${biometricType}`,
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
      });

      if (result.success) {
        const credentials = await getStoredCredentials();
        if (credentials) {
          // Auto-fill credentials and sign in
          onChangeEmail(credentials.email);
          onChangePassword(credentials.password);
          
          // Automatically sign in
          await performSignIn(credentials.email, credentials.password, false);
        }
      } else {
        setErrorMessage('Biometric authentication failed');
      }
    } catch (error) {
      console.log('Biometric auth error:', error);
      setErrorMessage('Biometric authentication error');
    }
  };

  const performSignIn = async (emailToUse, passwordToUse, shouldPromptSave = true) => {
    if (emailToUse.length > 4 && passwordToUse.length > 2) {
      setErrorMessage("");
      await Auth.signIn(emailToUse, passwordToUse)
        .then((user) => {
          // On successful sign-in, offer to save credentials if not already saved
          if (shouldPromptSave && Platform.OS === 'ios' && biometricAvailable && !hasStoredCredentials) {
            Alert.alert(
              'Save Password?',
              `Securely store your password so it's filled automatically the next time you need it.`,
              [
                {
                  text: 'Not Now',
                  style: 'cancel',
                  onPress: () => signInCb(user),
                },
                {
                  text: 'Save Password',
                  onPress: async () => {
                    await saveCredentials(emailToUse, passwordToUse);
                    signInCb(user);
                  },
                },
              ]
            );
          } else {
            signInCb(user);
          }
        })
        .catch((err) => {
          if (!err.message) {
            console.log("Error when signing in: ", err);
            Alert.alert("Error when signing in: ", err);
          } else {
            if (err.code === "UserNotConfirmedException") {
              console.log("User not confirmed");
              navigation.navigate("Confirmation", {
                email: emailToUse,
              });
            }
            if (err.message) {
              setErrorMessage(err.message);
            }
          }
        });
    } else {
      setErrorMessage("Provide a valid email and password");
    }
  };

  const signIn = async () => {
    await performSignIn(email, password, true);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/saayamforall.jpeg")}
        style={styles.logo}
      />
      <View style={styles.textDescriptionontainer}>
        <Text>Email Address</Text>
        <Spacer size={20} />
      </View>
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Your Email"
        onChangeText={(text) => onChangeEmail(text)}
        autoCompleteType="email"
        autoCapitalize="none"
        keyboardType="email-address"
        autoFocus={!hasStoredCredentials}
      />
      <View style={styles.textDescriptionontainer}>
        <Text>Password</Text>
        <Spacer size={20} />
      </View>
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Password"
        onChangeText={(text) => onChangePassword(text)}
        secureTextEntry
        autoCompleteType="password"
      />
      <Text
        style={[
          styles.forgotPassword,
          { textAlign: "left", alignSelf: "flex-start" },
        ]}
        onPress={() => navigation.navigate("ForgetPassword")}
      >
        Forgot password?
      </Text>
      {/* <TouchableOpacity style={styles.button} onPress={() => signIn()}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity> */}
      <Spacer size={30} />
      <Button onPress={() => signIn()} style={{width: '100%'}}>
        Log In
      </Button>
      <Spacer size={10} />
      {Platform.OS === 'ios' && biometricAvailable && hasStoredCredentials && (
        <>
          <Button onPress={() => handleBiometricAuth()} style={{ width: '100%' }}>
            Sign in with {biometricType}
          </Button>
        </>
      )}
      {errorMessage && (
        <Text
          style = {styles.alertText}
        >
          {errorMessage}
        </Text>
      )}
      <Spacer size={40} />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1, height: 1, backgroundColor: '#6B7280'}} />
        <View>
          <Text style={{width: 50, textAlign: 'center', ...styles.orText}}>Or With</Text>
        </View>
        <View style={{flex: 1, height: 1, backgroundColor: '#6B7280'}} />
      </View>
      {/* <Text style={styles.orText}>Or with</Text> */}
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../../assets/facebook_logo.png")}
            style={[styles.socialIcon, { width: 24, height: 24 }]}
          />
          <Text>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../../assets/google_logo.png")}
            style={[styles.socialIcon, { width: 24, height: 24 }]}
          />
          <Text>Google</Text>
        </TouchableOpacity>
      </View>
      <Spacer size={40} />
      <Text style={styles.signupText}>
        Don’t have an account?{" "}
        <Text
          style={styles.signupLink}
          onPress={() => navigation.navigate("SignUp")}
        >
          Sign up
        </Text>
      </Text>
    </View>
  );
}