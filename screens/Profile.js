import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from "react-native";
import { fetchUserAttributes } from "aws-amplify/auth";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons } from "@expo/vector-icons"; // Using vector icons
import api from "../services/api";
import ProfileImage from "./ProfileImage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthUser from "../hooks/useAuthUser";
import { useTranslation } from "react-i18next";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#777",
    marginBottom: 10,
  },
  userCountry: {
    fontSize: 16,
    color: "#777",
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 15,
    flex: 1,
  },
  optionIcon: {
    marginRight: 15,
  },
  signOutButton: {
    marginTop: 30,
    backgroundColor: "#ff4444",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

const DEFAULT_PROFILE_ICON = require("../assets/rn-logo.png");

export default function Profile({ signOut }) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [isNotificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState({});
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");

  const [profileData, setProfileData] = useState(null);

  useAuthUser(navigation, (user) => {
    setUserName(user.attributes.given_name + " " + user.attributes.family_name);
    setEmail(user.attributes.email);
    setPhone(user.attributes.phone_number);
    setCountry(user.attributes["custom:Country"]);
  });

  useEffect(() => {
    const getImage = async () => {
      const value = await AsyncStorage.getItem("profilePhoto");
      console.log(profilePhoto);
      if (value) setProfilePhoto(JSON.parse(value));
    };
    getImage();
  }, []);

  const confirmSignOut = () => {
    // NOTE: No matching translation keys exist for "Alert", "Are you sure you want to logout?",
    // and the modal button labels "Cancel"/"Logout", so leaving as-is per your rule.
    Alert.alert(
      "Alert",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => signOut(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const getUser = async () => {
      try {
        const userAttributes = await fetchUserAttributes();
        console.log(userAttributes);
        setUserName(
          userAttributes.given_name + " " + userAttributes.family_name
        );
        setEmail(userAttributes.email);
        setPhone(userAttributes.phone_number);
        setCountry(userAttributes["custom:Country"]);
      } catch (err) {
        //signOut();  // If error getting user then signout
        Alert.alert( // show alert to signout
              "Alert", // Title
              "Session timeout. Please sign in again", // Message
              [            
                {
                  text: "Logout",
                  onPress: () => signOut(),
                  style: "destructive", 
                },
              ],
            );  
        console.log("error from cognito : ", err);
      }
    };

  return (
    <>
      <ProfileImage
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        profilePhoto={profilePhoto}
        setProfilePhoto={setProfilePhoto}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsModalOpen(true)}>
            {profilePhoto?.uri ? (
              <Image source={profilePhoto} style={styles.userImage} />
            ) : (
              <Image source={DEFAULT_PROFILE_ICON} style={styles.userImage} />
            )}
          </TouchableOpacity>

          <Text style={styles.userName}>{userName}</Text>

          <Text style={styles.userEmail}>
            {email} | {phoneNumber}
          </Text>

          <Text style={styles.userCountry}>{country}</Text>
        </View>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <FontAwesome name="user-circle-o" size={20} style={styles.optionIcon} />
          <Text style={styles.optionText}>{t("EDIT")}</Text>
          <Ionicons name="chevron-forward" size={20} color="#777" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => navigation.navigate("EditPersonal")}
        >
          <FontAwesome name="user-circle-o" size={20} style={styles.optionIcon} />
          <Text style={styles.optionText}>{t("PERSONAL_INFORMATION")}</Text>
          <Ionicons name="chevron-forward" size={20} color="#777" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => navigation.navigate("IdentityDocument")}
        >
          <FontAwesome name="user-circle-o" size={20} style={styles.optionIcon} />
          <Text style={styles.optionText}>{t("IDENTITY_DOCUMENT")}</Text>
          <Ionicons name="chevron-forward" size={20} color="#777" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <FontAwesome name="lock" size={20} style={styles.optionIcon} />
          <Text style={styles.optionText}>{t("CHANGE_PASSWORD")}</Text>
          <Ionicons name="chevron-forward" size={20} color="#777" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => navigation.navigate("EditOrganization")}
        >
          <FontAwesome name="user-circle-o" size={20} style={styles.optionIcon} />
          <Text style={styles.optionText}>{t("ORGANIZATION_DETAILS")}</Text>
          <Ionicons name="chevron-forward" size={20} color="#777" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate("Skills")}>
          <FontAwesome name="tags" size={20} style={styles.optionIcon} />
          <Text style={styles.optionText}>{t("SKILLS")}</Text>
          <Ionicons name="chevron-forward" size={20} color="#777" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => navigation.navigate("Availability")}
        >
          <FontAwesome name="calendar" size={20} style={styles.optionIcon} />
          <Text style={styles.optionText}>{t("AVAILABILITY")}</Text>
          <Ionicons name="chevron-forward" size={20} color="#777" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => navigation.navigate("Preferences")}
        >
          <FontAwesome name="gear" size={20} style={styles.optionIcon} />
          <Text style={styles.optionText}>{t("PREFERENCES")}</Text>
          <Ionicons name="chevron-forward" size={20} color="#777" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => navigation.navigate("AccountDeletion")}
        >
          <FontAwesome name="sign-out" size={20} style={styles.optionIcon} />
          <Text style={styles.optionText}>{t("SIGN_OFF")}</Text>
          <Ionicons name="chevron-forward" size={20} color="#777" />
        </TouchableOpacity>

        <View style={styles.optionRow}>
          <FontAwesome name="bell" size={20} style={styles.optionIcon} />
          <Text style={styles.optionText}>{t("NOTIFICATIONS")}</Text>
          <Switch value={isNotificationsEnabled} onValueChange={setNotificationsEnabled} />
        </View>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => navigation.navigate("TermsAndConditions")}
        >
          <FontAwesome name="file-text-o" size={20} style={styles.optionIcon} />
          <Text style={styles.optionText}>{t("TERMS_AND_CONDITIONS")}</Text>
          <Ionicons name="chevron-forward" size={20} color="#777" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => navigation.navigate("PrivacyPolicy")}
        >
          <FontAwesome name="shield" size={20} style={styles.optionIcon} />
          <Text style={styles.optionText}>{t("PRIVACY_POLICY")}</Text>
          <Ionicons name="chevron-forward" size={20} color="#777" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate("Welcome")}>
          <FontAwesome name="info-circle" size={20} style={styles.optionIcon} />
          {/* No "HELP_CENTER" key in your JSON; leaving as-is */}
          <Text style={styles.optionText}>Help Center</Text>
          <Ionicons name="chevron-forward" size={20} color="#777" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={confirmSignOut}>
          <FontAwesome name="sign-out" size={20} style={styles.optionIcon} />
          <Text style={styles.optionText}>{t("LOGOUT")}</Text>
          <Ionicons name="chevron-forward" size={20} color="#777" />
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
