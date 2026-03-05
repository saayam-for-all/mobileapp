import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Spacer from '../../components/Spacer';
import { FontAwesome, Ionicons } from '@expo/vector-icons'; 
import { TouchableOpacity } from 'react-native';
import { useTranslation } from "react-i18next";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
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
    marginHorizontal: "3%",
    width: "94%",
  },
});

function ForgetPassword({ navigation }) {
  const { t } = useTranslation("auth");

  const [email, onChangeEmail] = useState("");
  const [editableInput, setEditableInput] = useState(true);
  const [confirmationStep, setConfirmationStep] = useState(false);

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  // ✅ separate toggles for each input
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      setErrorMessage(t("EMAIL_REQUIRED"));
    }
  };

  const postNewPassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage(t("PASSWORD_MISMATCH_ERROR"));
      return;
    }
    setConfirmLoading(true);
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword,
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
        placeholder={t("EMAIL")}
        onChange={(text) => onChangeEmail(text)}
        editable={editableInput}
        autoCompleteType="email"
        autoCapitalize="none"
        autoFocus
        keyboardType="email-address"
      />

      <Button style={{ width: "94%", margin: "3%" }} onPress={getConfirmationCode}>
        {t("GET_CONFIRMATION_CODE")}
      </Button>

      {confirmationStep && (
        <>
          <Spacer size={10} />

          <View style={styles.textDescriptionontainer}>
            <Text style={{ marginHorizontal: "3%" }}>{t("ENTER_CODE")}</Text>
            <Spacer size={20} />
          </View>

          <Input value={code} placeholder="123456" onChange={(text) => setCode(text)} />

          <View style={styles.textDescriptionontainer}>
            <Text style={{ marginHorizontal: "3%" }}>{t("NEW_PASSWORD")}</Text>
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

          {/* ✅ Confirm password toggle */}
          <View style={{ width: "94%", flexDirection: "row", alignItems: "center", margin: "3%" }}>
            <Input
              value={confirmPassword}
              placeholder={t("CONFIRM_PASSWORD")}
              onChange={(text) => setConfirmPassword(text)}
              secureTextEntry={!showConfirmPassword}
              autoCompleteType="password"
              style={{ flex: 1 }}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword((v) => !v)}>
              <FontAwesome
                name={showConfirmPassword ? "eye-slash" : "eye"}
                size={20}
                color="#777"
              />
            </TouchableOpacity>
          </View>

          <Button style={{ width: "94%", margin: "3%" }} onPress={postNewPassword}>
            {t("CHANGE_PASSWORD")}
          </Button>
        </>
      )}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
}

export default ForgetPassword;