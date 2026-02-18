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
import { useTranslation } from "react-i18next";
import Auth from "@aws-amplify/auth";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import Button from "../../components/Button";
import Spacer from "../../components/Spacer";
import { FontAwesome } from "@expo/vector-icons";

const CREDENTIALS_KEY = "saayam_credentials";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: "#F9FAFB",
    fontSize: 16,
  },
  forgotPassword: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 10,
    textDecorationLine: "underline",
  },
  orText: {
    color: "#6B7280",
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
    borderColor: "#E5E7EB",
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
    color: "red",
    marginHorizontal: "3%",
    width: "94%",
    marginBottom: 20,
    marginLeft: 5,
  },
});

export default function SignIn({ navigation, signIn: signInCb }) {
  const { t } = useTranslation("auth");
  const { t: tCommon } = useTranslation("common");

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
    if (Platform.OS === "ios") {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (compatible && enrolled) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        setBiometricAvailable(true);

        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType("Face ID");
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType("Touch ID");
        }
      }
    }
  };

  const checkStoredCredentials = async () => {
    if (Platform.OS === "ios") {
      try {
        const credentials = await SecureStore.getItemAsync(CREDENTIALS_KEY);
        if (credentials) setHasStoredCredentials(true);
      } catch (error) {
        console.log("Error checking stored credentials:", error);
      }
    }
  };

  const saveCredentials = async (emailToSave, passwordToSave) => {
    if (Platform.OS === "ios") {
      try {
        const credentials = JSON.stringify({ email: emailToSave, password: passwordToSave });
        await SecureStore.setItemAsync(CREDENTIALS_KEY, credentials, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        });
        setHasStoredCredentials(true);
      } catch (error) {
        console.log("Error saving credentials:", error);
      }
    }
  };

  const getStoredCredentials = async () => {
    if (Platform.OS === "ios") {
      try {
        const credentials = await SecureStore.getItemAsync(CREDENTIALS_KEY);
        if (credentials) return JSON.parse(credentials);
      } catch (error) {
        console.log("Error retrieving credentials:", error);
      }
    }
    return null;
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: tCommon("SIGN_IN_WITH_BIOMETRIC", { type: biometricType || "" }),
        fallbackLabel: "Use passcode",
        disableDeviceFallback: false,
      });

      if (result.success) {
        const credentials = await getStoredCredentials();
        if (credentials) {
          onChangeEmail(credentials.email);
          onChangePassword(credentials.password);
          await performSignIn(credentials.email, credentials.password, false);
        }
      } else {
        setErrorMessage("Biometric authentication failed");
      }
    } catch (error) {
      console.log("Biometric auth error:", error);
      setErrorMessage("Biometric authentication error");
    }
  };

  const performSignIn = async (emailToUse, passwordToUse, shouldPromptSave = true) => {
    if (emailToUse.length > 4 && passwordToUse.length > 2) {
      setErrorMessage("");

      try {
        const user = await Auth.signIn(emailToUse, passwordToUse);

        // Offer to save credentials if not already saved
        if (shouldPromptSave && Platform.OS === "ios" && biometricAvailable && !hasStoredCredentials) {
          Alert.alert(
            tCommon("SAVE_PASSWORD") || "Save Password?",
            tCommon("SAVE_PASSWORD_MESSAGE") ||
              "Securely store your password so it's filled automatically the next time you need it.",
            [
              {
                text: tCommon("NOT_NOW") || "Not Now",
                style: "cancel",
                onPress: () => signInCb(user),
              },
              {
                text: tCommon("SAVE_PASSWORD_BUTTON") || "Save Password",
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
      } catch (err) {
        console.log(err);

        if (err?.code === "UserNotConfirmedException") {
          navigation.navigate("Confirmation", { email: emailToUse });
          return;
        }

        if (err?.message) {
          setErrorMessage(err.message);
        } else {
          Alert.alert("Error", "Error when signing in.");
        }
      }
    } else {
      // auth.json doesn’t have ERROR_PROVIDE_EMAIL_PASSWORD, so use existing keys:
      setErrorMessage(`${t("EMAIL_REQUIRED")} / ${t("PASSWORD_REQUIRED")}`);
    }
  };

  const signIn = async () => {
    await performSignIn(email, password, true);
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/saayamforall.jpeg")} style={styles.logo} />

      <View style={styles.textDescriptionontainer}>
        <Text>{t("EMAIL")}</Text>
        <Spacer size={20} />
      </View>

      <TextInput
        style={styles.input}
        value={email}
        placeholder={t("EMAIL")}
        onChangeText={onChangeEmail}
        autoComplete="email"
        autoCapitalize="none"
        keyboardType="email-address"
        autoFocus={!hasStoredCredentials}
      />

      <View style={styles.textDescriptionontainer}>
        <Text>{t("PASSWORD")}</Text>
        <Spacer size={20} />
      </View>

      <View style={{ width: "100%", marginVertical: 10, position: "relative" }}>
        <TextInput
          style={[styles.input, { paddingRight: 40 }]}
          value={password}
          placeholder={t("PASSWORD")}
          onChangeText={onChangePassword}
          secureTextEntry={!showPassword}
          autoComplete="password"
        />

        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: 15,
            top: 0,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            padding: 5,
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#777" />
        </TouchableOpacity>
      </View>

      <Text
        style={[styles.forgotPassword, { textAlign: "left", alignSelf: "flex-start" }]}
        onPress={() => navigation.navigate("ForgetPassword")}
      >
        {t("FORGOT_PASSWORD")}
      </Text>

      <Spacer size={30} />

      <Button onPress={signIn} style={{ width: "100%" }}>
        {t("SIGN_IN")}
      </Button>

      <Spacer size={10} />

      {Platform.OS === "ios" && biometricAvailable && hasStoredCredentials && (
        <Button onPress={handleBiometricAuth} style={{ width: "100%" }}>
          {tCommon("SIGN_IN_WITH_BIOMETRIC", { type: biometricType || "" })}
        </Button>
      )}

      {!!errorMessage && <Text style={styles.alertText}>{errorMessage}</Text>}

      <Spacer size={40} />

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1, height: 1, backgroundColor: "#6B7280" }} />
        <View>
          <Text style={{ width: 70, textAlign: "center", ...styles.orText }}>
            {tCommon("OR_WITH")}
          </Text>
        </View>
        <View style={{ flex: 1, height: 1, backgroundColor: "#6B7280" }} />
      </View>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../../assets/facebook_logo.png")}
            style={[styles.socialIcon, { width: 24, height: 24 }]}
          />
          <Text>{tCommon("FACEBOOK")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../../assets/google_logo.png")}
            style={[styles.socialIcon, { width: 24, height: 24 }]}
          />
          <Text>{tCommon("GOOGLE")}</Text>
        </TouchableOpacity>
      </View>

      <Spacer size={40} />

      <Text style={styles.signupText}>
        {t("NONE_ACCOUNT")}{" "}
        <Text style={styles.signupLink} onPress={() => navigation.navigate("SignUp")}>
          {t("SIGNUP")}
        </Text>
      </Text>
    </View>
  );
}

SignIn.propTypes = {
  navigation: PropTypes.object.isRequired,
  signIn: PropTypes.func.isRequired,
};
