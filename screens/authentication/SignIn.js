/* eslint-disable no-console */
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Auth from "@aws-amplify/auth";
import Button from "../../components/Button";
import Spacer from "../../components/Spacer";
import Input from "../../components/Input";
//import Ionicons from 'react-native-vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons'; 

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

  const signIn = async () => {
    if (email.length > 4 && password.length > 2) {
      await Auth.signIn(email, password)
        .then((user) => {
          signInCb(user);
        })
        .catch((err) => {
          if (!err.message) {
            console.log("Error when signing in: ", err);
            Alert.alert("Error when signing in: ", err);
          } else {
            if (err.code === "UserNotConfirmedException") {
              console.log("User not confirmed");
              navigation.navigate("Confirmation", {
                email,
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
        autoFocus
      />
      <View style={styles.textDescriptionontainer}>
        <Text>Password</Text>
        <Spacer size={20} />
      </View>
      <View style={{ width: '100%', marginVertical: 10, position: 'relative' }}>
        <TextInput
          style={[styles.input, { paddingRight: 40 }]} // add padding to avoid overlap
          value={password}
          placeholder="Password"
          onChangeText={onChangePassword}
          secureTextEntry={!showPassword}
          autoCompleteType="password"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: 15,
            top: 0,
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 5,
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
        <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#777" />
        </TouchableOpacity>
      </View>
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
      <Button onPress={() => signIn()} style={{ width: '100%' }}>
        Log In
      </Button>
      {errorMessage && (
        <Text
          style={styles.alertText}
        >
          {errorMessage}
        </Text>
      )}
      <Spacer size={40} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1, height: 1, backgroundColor: '#6B7280' }} />
        <View>
          <Text style={{ width: 50, textAlign: 'center', ...styles.orText }}>Or With</Text>
        </View>
        <View style={{ flex: 1, height: 1, backgroundColor: '#6B7280' }} />
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
