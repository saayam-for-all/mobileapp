import React, { use, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { fetchUserAttributes, updatePassword } from 'aws-amplify/auth';
import useAuthUser from "../../hooks/useAuthUser";
import { useTranslation } from "react-i18next";
import Button from "../../components/Button";


export default function ChangePassword() {
  // ✅ Option 2: use multiple namespaces
  const { t } = useTranslation(["auth", "common"]);

  const [secureEntry, setSecureEntry] = useState([true, true, true]);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const [logPasswordValid, setLogPasswordValid] = useState([false, false]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const user = useAuthUser();
  
  const toggleSecureEntry = (ind) => {
    setSecureEntry(
      secureEntry.map((ele,i)=>{
        return ind == i ? !ele : ele;
      })
    );
  };

  function logError(error, errorMessage) {
    if (error) {
      // No key exists for title "Error", leaving as-is (per your rule).
      Alert.alert("Error", errorMessage, [{ text: t("OK", { ns: "common" }) }]);
    } else {
      Alert.alert(
        t("PASSWORD_CHANGE_SUCCESS", { ns: "auth" }),
        "",
        [{ text: t("OK", { ns: "common" }), onPress: () => navigation.navigate("Profile") }]
      );
    }
  }

  async function changePassword() {
    let errorMessage = "";
    let error = false;

    if (!passwordValid || !confirmPasswordValid) {
      error = true;
      // No exact key for the original sentence; using existing generic error
      errorMessage = t("ERROR_GENERIC_SUPPORT", { ns: "auth" });
    } else {
      if (!user) {
        error = true;
        // No exact key for the original sentence; using existing generic error
        errorMessage = t("ERROR_GENERIC_SUPPORT", { ns: "auth" });
      }
      setLoading(true);
      try {
        await updatePassword({
          oldPassword: oldPassword,
          newPassword: password,
        });

        setOldPassword("");
        setPassword("");
        setConfirmPassword("");
        console.log("Password updated successfully");
      } catch (err) {
        error = true;
        errorMessage = String(err);
      } finally {
        setLoading(false);
      }
    }

    logError(error, errorMessage);
  }

  const handleCancel = () => {
    setOldPassword("");
    setPassword("");
    setConfirmPassword("");
    setPasswordValid(false);
    setConfirmPasswordValid(false);
    setLogPasswordValid([false, false]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t("CHANGE_PASSWORD", { ns: "auth" })}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t("CURRENT_PASSWORD", { ns: "auth" })}
          secureTextEntry={secureEntry[0]}
          value={oldPassword}
          onChangeText={setOldPassword}
          accessibilityLabel={t("CURRENT_PASSWORD", { ns: "auth" })}
        />
        <TouchableOpacity onPress={() => toggleSecureEntry(0)}>
          <FontAwesome name={secureEntry[0] ? "eye-slash" : "eye"} size={20} color="#777" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t("NEW_PASSWORD", { ns: "auth" })}
          secureTextEntry={secureEntry[1]}
          value={password}
          onChangeText={(text) => {
            setLogPasswordValid([true, logPasswordValid[1]]);
            const valid = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/;
            const isValid = valid.test(text);
            setPasswordValid(isValid);
            setConfirmPasswordValid(text === confirmPassword);
            setPassword(text);
          }}
          accessibilityLabel={t("NEW_PASSWORD", { ns: "auth" })}
        />
        <TouchableOpacity onPress={() => toggleSecureEntry(1)}>
          <FontAwesome name={secureEntry[1] ? "eye-slash" : "eye"} size={20} color="#777" />
        </TouchableOpacity>
      </View>

      {!passwordValid && logPasswordValid[0] && (
        <Text style={styles.alertText}>{t("PASSWORD_REQUIREMENTS_ERROR", { ns: "auth" })}</Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t("CONFIRM_PASSWORD", { ns: "auth" })}
          secureTextEntry={secureEntry[2]}
          value={confirmPassword}
          onChangeText={(text) => {
            setLogPasswordValid([logPasswordValid[0], true]);
            setConfirmPasswordValid(text === password);
            setConfirmPassword(text);
          }}
          accessibilityLabel={t("CONFIRM_PASSWORD", { ns: "auth" })}
        />
        <TouchableOpacity onPress={() => toggleSecureEntry(2)}>
          <FontAwesome name={secureEntry[2] ? "eye-slash" : "eye"} size={20} color="#777" />
        </TouchableOpacity>
      </View>

      {!confirmPasswordValid && logPasswordValid[1] && (
        <Text style={styles.alertText}>{t("PASSWORD_MISMATCH_ERROR", { ns: "auth" })}</Text>
      )}

      <View style={styles.buttonRow}>
        <Button
          loading={loading}
          onPress={changePassword}
          backgroundColor="#3B82F6"
          style={{ flex: 1, paddingVertical: 15, borderRadius: 8, marginHorizontal: 5, borderWidth: 0 }}
        >
          {t("SAVE", { ns: "common" })}
        </Button>

        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.buttonText}>{t("CANCEL", { ns: "common" })}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 25,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  alertText: {
    color: "red",
    marginHorizontal: "3%",
    width: "94%",
    marginBottom: 10,
    marginLeft: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: "#3B82F6",
  },
  cancelButton: {
    backgroundColor: "#6B7280",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  alertText: {
    color: 'red',
    marginHorizontal: '3%',
    width: '94%',
    marginBottom: 20,
    marginLeft: 5,
  }
});
