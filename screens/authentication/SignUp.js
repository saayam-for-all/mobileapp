
import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { signUp } from 'aws-amplify/auth';
import { useTranslation } from "react-i18next";
import Button from '../../components/Button';
import Spacer from '../../components/Spacer';
import Input from '../../components/Input';
import PhoneInput from '../../components/PhoneInput';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  warnText: {
    fontSize: 10,
    fontWeight: "bold",
    marginHorizontal: "3%",
    marginTop: 10,
  },
  alertText: {
    color: "red",
    marginHorizontal: "3%",
    marginTop: 6,
    width: "94%",
  },
  textDescriptionontainer: {
    marginHorizontal: "3%",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default function SignUp({ navigation }) {
  const { t } = useTranslation("auth");

  const [name, onChangeName] = useState("");
  const [lastName, onChangeLastName] = useState("");
  const [email, onChangeEmail] = useState("");
  const [phone_number, onChangePhone] = useState("");
  const [full_phone, setFullPhone] = useState("");
  const [country_code, onChangeCountryCode] = useState("+1");
  const [country_name, onChangeCountryName] = useState("United States");

  const [password, onChangePassword] = useState("");
  const [repeatPassword, onChangeRepeatPassword] = useState("");

  const [passwordValid, setPasswordValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);

  const [loading, setLoading] = useState(false);

  const [invalidMessage, setInvalidMessage] = useState(null);

  // Independent show/hide toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const popError = (message) =>
    Alert.alert(
      t("Error creating account"), 
      message,
      [{ text: "OK" }]
    );

  const validateEmail = (value) => {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(value);
  };

  const validateStrongPassword = (value) => {
    const valid = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/;
    return valid.test(value);
  };

  const signUpUser = async () => {
    const validPassword = password.length > 5 && (password === repeatPassword);
    let errorMessage = null;
    let hasError = false;
    const allFields = [name, lastName, email, phone_number, password, repeatPassword];
    const isNotEmpty = (v) => typeof v === "string" && v.trim() !== "";
    const allInputsFilled = allFields.every(isNotEmpty);

    if (!allInputsFilled) {
      const msg = "Please fill all fields."; // add a translation key later if you want
      setInvalidMessage(msg);
      popError(msg);
      return;
    }

    const emailOk = validateEmail(email);
    setEmailValid(emailOk);
    if (!emailOk) {
      const msg = t("EMAIL_REQUIRED");
      setInvalidMessage(msg);
      popError(msg);
      return;
    }

    const pwOk = validateStrongPassword(password);
    setPasswordValid(pwOk);
    if (!pwOk) {
      const msg = t("PASSWORD_REQUIREMENTS_ERROR");
      setInvalidMessage(msg);
      popError(msg);
      return;
    }

    if (password !== repeatPassword) {
      const msg = t("PASSWORD_MISMATCH_ERROR");
      setInvalidMessage(msg);
      popError(msg);
      return;
    }

    if (!isPhoneValid) {
      const msg = "Invalid phone number."; // add a translation key later if you want
      setInvalidMessage(msg);
      popError(msg);
      return;
    }

    setInvalidMessage(null);

    console.log(allInputsFilled);
    if (validPassword && emailValid && isPhoneValid && allInputsFilled) {
      setInvalidMessage(null);
      setLoading(true);
      signUp({
        username: email, 
        password,
        options: {
          userAttributes: {
            email, // optional
            given_name: name,
            // country_code, // later added to db
            "custom:Country": country_name,
            phone_number: full_phone, // later changed into phone without country code
            //zoneinfo,
            family_name: lastName
          }
        }
      })
        .then((data) => {
          setLoading(false);
          console.log(data?.user?.username);
          if(data?.user?.username){
            AsyncStorage.setItem(data?.user?.username, JSON.stringify(true))
          }
          console.log('navigation: ', navigation);
          navigation.navigate('Confirmation', { email });
        })
        .catch((err) => {
          setLoading(false);
          if (err.message) {
            popError(err.message);
            setInvalidMessage(err.message);
          }
          console.log(err);
        });
    }
  };

  return (
    <View style={styles.container}>
      {/* First/Last Name */}
      <View style={{ flexDirection: "row", width: "100%", paddingHorizontal: "1.5%" }}>
        <View style={{ width: "50%" }}>
          <View style={styles.textDescriptionontainer}>
            <Text>First Name</Text>
          </View>
          <Input value={name} placeholder="First Name" onChange={onChangeName} autoFocus />
        </View>

        <View style={{ width: "50%" }}>
          <View style={styles.textDescriptionontainer}>
            <Text>Last Name</Text>
          </View>
          <Input value={lastName} placeholder="Last Name" onChange={onChangeLastName} />
        </View>
      </View>

      {/* Email */}
      <View style={{ width: "100%" }}>
        <View style={styles.textDescriptionontainer}>
          <Text>{t("EMAIL")}</Text>
        </View>
        <Input
          value={email}
          placeholder="email@example.com"
          onChange={(text) => {
            onChangeEmail(text);
            setEmailValid(validateEmail(text));
          }}
          autoCapitalize="none"
          autoCompleteType="email"
          keyboardType="email-address"
        />
        {!emailValid && <Text style={styles.alertText}>{t("EMAIL_REQUIRED")}</Text>}
      </View>

      {/* Phone */}
      <View style={{ width: "100%" }}>
        <View style={styles.textDescriptionontainer}>
          <Text>Phone Number</Text>
        </View>
        <PhoneInput
          countryCode={country_code}
          setCountryCode={onChangeCountryCode}
          countryName={country_name}
          onChangeCountryName={onChangeCountryName}
          setFullPhone={setFullPhone}
          phone={phone_number}
          placeholder="1234567890"
          onChangePhone={onChangePhone}
          isPhoneValid={isPhoneValid}
          setIsPhoneValid={setIsPhoneValid}
          preferredCountries={["US"]}
          label=""
          errorMessage=""
        />
        {!isPhoneValid && <Text style={styles.alertText}>Invalid phone number.</Text>}
      </View>

      {/* Zone/Country */}
      <View style={{ width: "100%" }}>
        <View style={styles.textDescriptionontainer}>
          <Text>Zone</Text>
        </View>
        <Input
          value={country_name}
          placeholder="United States"
          onChange={onChangeCountryName}
          autoCapitalize="none"
        />
      </View>

      {/* Password (with eye icon) */}
      <View style={{ width: "100%" }}>
        <View style={styles.textDescriptionontainer}>
          <Text>{t("PASSWORD")}</Text>
        </View>

        <View
          style={{
            width: "94%",
            marginHorizontal: "3%",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Input
            value={password}
            placeholder={t("PASSWORD")}
            onChange={(text) => {
              onChangePassword(text);
              setPasswordValid(validateStrongPassword(text));
            }}
            secureTextEntry={!showPassword}
            autoCompleteType="password"
            style={{ flex: 1 }}
          />

          <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
            <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#777" />
          </TouchableOpacity>
        </View>

        {!passwordValid && (
          <Text style={styles.alertText}>{t("PASSWORD_REQUIREMENTS_ERROR")}</Text>
        )}
      </View>
      <Spacer size={40}/>
      <Button
        style={{width: '96%', marginHorizontal: '3%'}}
        onPress={() => signUpUser()}
        loading={loading}
      >
        {t("SIGNUP")}
      </Button>

      <Text style={styles.warnText}>
        You will receive one time authentication code sent to your phone from{" "}
        <Text style={{ color: "#538CC6" }}>Saayam For All.</Text> Message and data rates may apply.
      </Text>

      {invalidMessage ? (
        <Text style={{ marginTop: 10, marginHorizontal: "3%" }}>{invalidMessage}</Text>
      ) : null}
    </View>
  );
}