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
import { signIn as amplifySignIn } from 'aws-amplify/auth';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import Button from "../../components/Button";
import Spacer from "../../components/Spacer";
import Input from "../../components/Input";
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";
import { colors, fontSize, borderRadius } from "../../styles/theme";
import { layout, text as textStyles } from "../../styles/common";

const CREDENTIALS_KEY = "saayam_credentials";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: colors.surface,
    fontSize: fontSize.lg,
  },
  button: {
    backgroundColor: colors.primary,
    width: "100%",
    height: 50,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: "600",
  },
  forgotPassword: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginTop: 10,
    textDecorationLine: "underline",
  },
  orText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginVertical: 15,
  },
  textDescriptionContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  socialButton: {
    width: "45%",
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: colors.white,
  },
  socialIcon: {
    marginRight: 10,
  },
  signupText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  signupLink: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
  alertText: {
    color: colors.error,
    marginHorizontal: "3%",
    width: "94%",
    marginBottom: 20,
    marginLeft: 5,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.textSecondary,
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

  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      try {
        const { isSignedIn, nextStep } = await amplifySignIn({
          username: emailToUse,
          password: passwordToUse,
        });

        setLoading(false);

        if (shouldPromptSave && Platform.OS === 'ios' && biometricAvailable && !hasStoredCredentials) {
          Alert.alert(
            tCommon("SAVE_PASSWORD") || "Save Password?",
            tCommon("SAVE_PASSWORD_MESSAGE") ||
              "Securely store your password so it's filled automatically the next time you need it.",
            [
              {
                text: tCommon("NOT_NOW") || "Not Now",
                style: "cancel",
                onPress: () => signInCb({ isSignedIn, nextStep }),
              },
              {
                text: tCommon("SAVE_PASSWORD_BUTTON") || "Save Password",
                onPress: async () => {
                  await saveCredentials(emailToUse, passwordToUse);
                  signInCb({ isSignedIn, nextStep });
                },
              },
            ]
          );
        } else {
          signInCb({ isSignedIn, nextStep });
        }
      } catch (err) {
        setLoading(false);
        if (!err.message) {
          console.log("Error when signing in: ", err);
          Alert.alert("Error when signing in: ", err);
        } else {
          if (err.name === "UserNotConfirmedException") {
            console.log("User not confirmed");
            navigation.navigate("Confirmation", {
              email: emailToUse,
              fromSignIn: true,
            });
          }
          if (err.message) {
            setErrorMessage(err.message);
          }
        }
      }
    } else {
      setErrorMessage(`${t("EMAIL_REQUIRED")} / ${t("PASSWORD_REQUIRED")}`);
    }
  };

  const signIn = async () => {
    await performSignIn(email, password, true);
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/saayamforall.jpeg")} style={styles.logo} />

      <View style={styles.textDescriptionContainer}>
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

      <View style={styles.textDescriptionContainer}>
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
          <FontAwesome
            name={showPassword ? 'eye-slash' : 'eye'}
            size={20}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      <Text
        style={[styles.forgotPassword, { textAlign: "left", alignSelf: "flex-start" }]}
        onPress={() => navigation.navigate("ForgetPassword")}
      >
        {t("FORGOT_PASSWORD")}
      </Text>
      <Spacer size={30} />
      <Button onPress={signIn} loading={loading} style={{ width: "100%" }}>
        {t("SIGN_IN")}
      </Button>

      <Spacer size={10} />
      {Platform.OS === 'ios' && biometricAvailable && hasStoredCredentials && (
        <>
          <Button onPress={() => handleBiometricAuth()} style={{ width: '100%' }}>
            {tCommon("SIGN_IN_WITH_BIOMETRIC", { type: biometricType || "" })}
          </Button>
        </>
      )}
      {errorMessage && (
        <Text style={styles.alertText}>
          {errorMessage}
        </Text>
      )}

      {!!errorMessage && <Text style={styles.alertText}>{errorMessage}</Text>}

      <Spacer size={40} />

      <View style={layout.row}>
        <View style={styles.separatorLine} />
        <Text style={[styles.orText, { width: 70, textAlign: "center" }]}>
          {tCommon("OR_WITH")}
        </Text>
        <View style={styles.separatorLine} />
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
        <Text
          style={styles.signupLink}
          onPress={() => navigation.navigate("SignUp")}
        >
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
