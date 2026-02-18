import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Auth from "@aws-amplify/auth";
import { countriesList } from "../../data/countries";
import useAuthUser from "../../hooks/useAuthUser";
import RNPickerSelect from "react-native-picker-select";
import { useTranslation } from "react-i18next";

const EditProfile = () => {
  const { t } = useTranslation("profile");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [secondaryEmail, setSecondaryEmail] = useState("");
  const [primaryPhoneNumber, setPrimaryPhoneNumber] = useState("");
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState("");
  const [zoneinfo, setzoneinfo] = useState("");
  const [needVerification, setNeedVerification] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [backupProfile, setBackupProfile] = useState({});

  const navigation = useNavigation();
  const user = useAuthUser();

  useEffect(() => {
    if (user) {
      const attributes = user?.attributes;
      const { email, family_name, given_name, phone_number } = attributes;
      setFirstName(given_name);
      setLastName(family_name);
      setPrimaryEmail(email);
      setPrimaryPhoneNumber(phone_number);
    }
}, [user]);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        const attributes = user?.attributes;
        const { email, family_name, given_name, phone_number, ["custom:Country"]: zoneinfoAttr } =
          attributes;

        const profileData = {
          firstName: given_name || "",
          lastName: family_name || "",
          primaryEmail: email || "",
          primaryPhoneNumber: phone_number || "",
          secondaryEmail: "",
          secondaryPhoneNumber: "",
          zoneinfo: zoneinfoAttr || "",
        };

        setFirstName(profileData.firstName);
        setLastName(profileData.lastName);
        setPrimaryEmail(profileData.primaryEmail);
        setPrimaryPhoneNumber(profileData.primaryPhoneNumber);
        setzoneinfo(profileData.zoneinfo);
        setBackupProfile(profileData);
      })
      .catch((err) => console.log("Error loading user:", err));

    setNeedVerification(false);
  }, []);

  useEffect(() => {
    if (needVerification) {
      navigation.navigate("ConfirmUpdate", {
        email: user?.attributes?.email,
        isUpdate: true,
        toUpdate: {
          email: primaryEmail,
          family_name: lastName,
          given_name: firstName,
          phone_number: primaryPhoneNumber,
          "custom:Country": zoneinfo,
        },
      });
      setNeedVerification(false);
    }
  }, [needVerification]);

  const validateForm = () => {
    // NOTE: No matching translation keys for these validation strings in your JSONs,
    // so leaving them as-is (per your rule: only use existing keys).
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(firstName)) {
      Alert.alert("Invalid Input", "First Name should contain only letters.");
      return false;
    }
    if (!nameRegex.test(lastName)) {
      Alert.alert("Invalid Input", "Last Name should contain only letters.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(primaryEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid primary email address.");
      return false;
    }

    const phoneRegex = /^\+[0-9]{1,15}$/;
    if (!phoneRegex.test(primaryPhoneNumber)) {
      Alert.alert(
        "Invalid Phone Number",
        'Primary Phone number should start with "+" followed by digits.'
      );
      return false;
    }

    return true;
  };

  const removeFirstTime = async (user) => {
    const username = user?.attributes?.email;
    if (username) {
      AsyncStorage.removeItem(username);
    }
  };

  async function updateUser(user) {
    AsyncStorage.setItem('user_updated', 'false');
    try {
      if (primaryEmail !== user?.attributes?.email) {
        console.log("Needs verification");
        setNeedVerification(true);
        return;
      } else {
        await Auth.updateUserAttributes(user, {
          email: primaryEmail,
          family_name: lastName,
          given_name: firstName,
          phone_number: primaryPhoneNumber,
          "custom:Country": zoneinfo,
        });
      }
      Alert.alert("Success", t("PROFILE_UPDATE_SUCCESS"));
      removeFirstTime(user);
    } catch (err) {
      Alert.alert("User Update Error", err.message);
    }
  }

  // ✨ Edit mode handlers
  const handleEdit = () => {
    setBackupProfile({
      firstName,
      lastName,
      primaryEmail,
      primaryPhoneNumber,
      zoneinfo,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (validateForm()) {
      const user = await Auth.currentAuthenticatedUser();
      await updateUser(user);

      setBackupProfile({
        firstName,
        lastName,
        primaryEmail,
        primaryPhoneNumber,
        zoneinfo,
      });

      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (Object.keys(backupProfile).length > 0) {
      setFirstName(backupProfile.firstName);
      setLastName(backupProfile.lastName);
      setPrimaryEmail(backupProfile.primaryEmail);
      setPrimaryPhoneNumber(backupProfile.primaryPhoneNumber);
      setzoneinfo(backupProfile.zoneinfo);
    }
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      {/* No "EDIT_PROFILE" key exists; using existing "EDIT" and "YOUR_PROFILE" isn't semantically perfect,
          so leaving as-is per your rule OR you can change to t("YOUR_PROFILE") if you want. */}
      <Text style={styles.header}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder={t("FIRST_NAME")}
        value={firstName}
        onChangeText={setFirstName}
        editable={isEditing}
      />

      <TextInput
        style={styles.input}
        placeholder={t("LAST_NAME")}
        value={lastName}
        onChangeText={setLastName}
        editable={isEditing}
      />

      <TextInput
        style={styles.input}
        placeholder={t("PRIMARY EMAIL")}
        keyboardType="email-address"
        value={primaryEmail}
        onChangeText={setPrimaryEmail}
        editable={isEditing}
      />

      <TextInput
        style={styles.input}
        placeholder={t("SECONDARY_EMAIL")}
        keyboardType="email-address"
        value={secondaryEmail}
        onChangeText={setSecondaryEmail}
        editable={isEditing}
      />

      <TextInput
        style={styles.input}
        placeholder={t("PHONE_NUMBER")}
        keyboardType="phone-pad"
        value={primaryPhoneNumber}
        onChangeText={setPrimaryPhoneNumber}
        editable={isEditing}
      />

      <TextInput
        style={styles.input}
        // No "SECONDARY_PHONE_NUMBER" key; closest existing is "SECONDARY_PHONE"
        placeholder={t("SECONDARY_PHONE")}
        keyboardType="phone-pad"
        value={secondaryPhoneNumber}
        onChangeText={setSecondaryPhoneNumber}
        editable={isEditing}
      />

      <RNPickerSelect
        onValueChange={(value) => setzoneinfo(value)}
        items={countriesList}
        value={zoneinfo}
        disabled={!isEditing}
        placeholder={{ label: t("SELECT_COUNTRY"), value: null }}
        useNativeAndroidPickerStyle={false}
        style={{
          inputIOS: styles.input,
          inputIOSContainer: {
            zIndex:100,
          },
          inputAndroid: styles.input,
          placeholder: {
            color: "#9CA3AF",
          },
        }}
      />

      {!isEditing ? (
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
          <Text style={styles.buttonText}>{t("EDIT")}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#3B82F6" }]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>{t("SAVE")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#6B7280" }]}
            onPress={handleCancel}
          >
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
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  editButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#3B82F6",
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    color: "#374151",
    paddingRight: 30,
    backgroundColor: "#f9fafb",
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    color: "#374151",
    paddingRight: 30,
    backgroundColor: "#f9fafb",
    marginBottom: 16,
  },
});

export default EditProfile;
