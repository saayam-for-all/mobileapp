import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Checkbox } from "react-native-paper";
import i18n from "../../i18n/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthUser from "../../hooks/useAuthUser";
import { useTranslation } from "react-i18next";

const LANGUAGE_KEY = "appLanguage";

const Preferences = () => {
  const { t } = useTranslation("profile"); // using existing keys you have under profile/common
  const navigation = useNavigation();

  const [user, setUser] = useState(undefined);

  const defaultDefaultDashboardView = {
    label: t("DEFAULT DASHBOARD VIEW"),
    value: "default",
  };

  const [defaultDashboardView, setDefaultDashboardView] = useState(defaultDefaultDashboardView);
  const [firstLanguage, setFirstLanguage] = useState("te");

  const defaultFirstLanguage = {
    label: t("FIRST_LANGUAGE_PREFERENCE"),
    value: "te",
  };

  const [secondLanguage, setSecondLanguage] = useState("");
  const defaultSecondLanguage = {
    label: t("SECOND_LANGUAGE_PREFERENCE"),
    value: "default",
  };

  const [thirdLanguage, setThirdLanguage] = useState("");
  const defaultThirdLanguage = {
    label: t("THIRD_LANGUAGE_PREFERENCE"),
    value: "default",
  };

  const [emailPreference, setEmailPreference] = useState(true);
  const [phonePreference, setPhonePreference] = useState(true);

  const [primaryPhone, setPrimaryPhone] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [secondaryEmail, setSecondaryEmail] = useState("");

  const [checked, setChecked] = React.useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [backupProfile, setBackupProfile] = useState({});

  const languageOptions = [
    { value: "bn", label: t("Bengali") },
    { value: "de", label: t("German") },
    { value: "en", label: t("English") },
    { value: "es", label: t("Spanish") },
    { value: "fr", label: t("French") },
    { value: "hi", label: t("Hindi") },
    { value: "pt", label: t("Portuguese") },
    { value: "ru", label: t("Russian") },
    { value: "te", label: t("Telugu") },
    { value: "zh", label: t("Mandarin Chinese") },
  ];

  useAuthUser(navigation, (user) => {
    setUser(user);
    setPrimaryPhone(user.attributes.phone_number);
    setSecondaryPhone("1111111111");
    setPrimaryEmail(user.attributes.email);
    setSecondaryEmail("secondary@email.com");
  });

  // ✅ Load saved language when Preferences screen mounts
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (saved) {
          setFirstLanguage(saved);
        } else {
          setFirstLanguage("te");
        }
      } catch (e) {
        console.log("Error loading saved language:", e);
      }
    })();
  }, []);

  const handleEdit = () => {
    setBackupProfile({
      defaultDashboardView,
      firstLanguage,
      secondLanguage,
      thirdLanguage,
      emailPreference,
      phonePreference,
      checked,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDefaultDashboardView(backupProfile.defaultDashboardView);
    setFirstLanguage(backupProfile.firstLanguage);
    setSecondLanguage(backupProfile.secondLanguage);
    setThirdLanguage(backupProfile.thirdLanguage);
    setEmailPreference(backupProfile.emailPreference);
    setPhonePreference(backupProfile.phonePreference);
    setChecked(backupProfile.checked);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const langToApply = firstLanguage || "te";

    try {
      console.log("Changing language to:", langToApply);

      await AsyncStorage.setItem(LANGUAGE_KEY, langToApply);
      await i18n.changeLanguage(langToApply);

      Alert.alert(
        t("PREFERENCES UPDATED SUCCESS"),
        // No existing key for "Your preferences have been saved successfully."
        // Closest is preferences.messages.saved, but that lives in preferences.json (not in your profile/common keys list here).
        // So we use the existing success key only.
        t("PREFERENCES UPDATED SUCCESS")
      );

      setIsEditing(false);
    } catch (e) {
      console.log("Error saving/applying language:", e);
      // No existing key for this error message; leaving as-is per your rule
      Alert.alert("Error", "Failed to apply language. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t("PREFERENCES")}</Text>

      <RNPickerSelect
        onValueChange={(value) => setDefaultDashboardView(value)}
        items={[
          { label: t("SUPER_ADMIN_DASHBOARD"), value: "Super Admin Dashboard" },
          { label: t("ADMIN_DASHBOARD"), value: "Admin Dashboard" },
          { label: t("STEWARD_DASHBOARD"), value: "Steward Dashboard" },
          { label: t("VOLUNTEER_DASHBOARD"), value: "Volunteer Dashboard" },
          { label: t("BENEFICIARY_DASHBOARD"), value: "Beneficiary Dashboard" },
        ]}
        placeholder={{ label: t("SELECT DASHBOARD"), value: null }}
        value={defaultDashboardView}
        disabled={!isEditing}
        useNativeAndroidPickerStyle={false}
        style={pickerSelectStyles}
      />

      <RNPickerSelect
        onValueChange={(value) => setFirstLanguage(value)}
        items={languageOptions}
        placeholder={{ label: t("FIRST_LANGUAGE_PREFERENCE"), value: null }}
        value={firstLanguage}
        disabled={!isEditing}
        useNativeAndroidPickerStyle={false}
        style={pickerSelectStyles}
      />

      <RNPickerSelect
        onValueChange={(value) => setSecondLanguage(value)}
        items={languageOptions}
        placeholder={{ label: t("SECOND_LANGUAGE_PREFERENCE"), value: null }}
        value={secondLanguage}
        disabled={!isEditing}
        useNativeAndroidPickerStyle={false}
        style={pickerSelectStyles}
      />

      <RNPickerSelect
        onValueChange={(value) => setThirdLanguage(value)}
        items={languageOptions}
        placeholder={{ label: t("THIRD_LANGUAGE_PREFERENCE"), value: null }}
        value={thirdLanguage}
        disabled={!isEditing}
        useNativeAndroidPickerStyle={false}
        style={pickerSelectStyles}
      />

      <Text style={styles.title}>{t("EMAIL COMMUNICATION PREFERENCE")}</Text>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={emailPreference ? "checked" : "unchecked"}
          disabled={!isEditing}
          color="#007BFF"
          onPress={() => setEmailPreference(true)}
        />
        {/* No key for "Primary Email:" as a combined label; using existing PRIMARY_EMAIL */}
        <Text style={styles.label}>
          {t("PRIMARY_EMAIL")}: {primaryEmail}
        </Text>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={!emailPreference ? "checked" : "unchecked"}
          disabled={!isEditing}
          color="#007BFF"
          onPress={() => setEmailPreference(false)}
        />
        <Text style={styles.label}>
          {t("SECONDARY_EMAIL")}: {secondaryEmail}
        </Text>
      </View>

      <Text style={styles.title}>{t("PHONE COMMUNICATION PREFERENCE")}</Text>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={phonePreference ? "checked" : "unchecked"}
          disabled={!isEditing}
          color="#007BFF"
          onPress={() => setPhonePreference(true)}
        />
        <Text style={styles.label}>
          {t("PRIMARY_PHONE")}: {primaryPhone}
        </Text>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={!phonePreference ? "checked" : "unchecked"}
          disabled={!isEditing}
          color="#007BFF"
          onPress={() => setPhonePreference(false)}
        />
        <Text style={styles.label}>
          {t("SECONDARY_PHONE")}: {secondaryPhone}
        </Text>
      </View>

      <View style={styles.notificationContainer}>
        <Checkbox
          status={checked ? "checked" : "unchecked"}
          disabled={!isEditing}
          color="green"
          onPress={() => setChecked(!checked)}
        />
        {/* You have a key for this setting label */}
        <Text style={styles.notificationText}>{t("RECEIVE EMERGENCY NOTIFICATIONS")}</Text>
      </View>

      {!isEditing ? (
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.buttonText}>{t("EDIT")}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.rowButtons}>
          <TouchableOpacity style={[styles.saveButton, styles.actionButton]} onPress={handleSave}>
            <Text style={styles.buttonText}>{t("SAVE")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.cancelButton, styles.actionButton]} onPress={handleCancel}>
            <Text style={styles.buttonText}>{t("CANCEL")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    marginHorizontal: 5,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  notificationText: {
    flex: 1,
  },
  editButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  rowButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  saveButton: { backgroundColor: "#007BFF" },
  cancelButton: { backgroundColor: "#6B7280" },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
  },
  inputAndroid: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
  },
  placeholder: {
    height: 50,
    color: "#374151",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
  },
});

export default Preferences;
