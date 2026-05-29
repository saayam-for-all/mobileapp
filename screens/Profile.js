import React, { useState, useEffect, useCallback } from "react";
import { useIsFocused } from "@react-navigation/native";
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
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import ProfileImage from "./ProfileImage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthUser from "../hooks/useAuthUser";
import { fetchProfileImage } from "../services/volunteerServices";
import { blobToBase64 } from "../utils/blobToBase64";
import { useTranslation } from "react-i18next";
import { colors, fontSize, borderRadius } from "../styles/theme";
import { layout } from "../styles/common";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    marginBottom: 10,
  },
  userName: {
    fontSize: fontSize.title,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: fontSize.lg,
    color: colors.textMuted,
    marginBottom: 10,
  },
  userCountry: {
    fontSize: fontSize.lg,
    color: colors.textMuted,
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  optionText: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    marginLeft: 15,
    flex: 1,
  },
  optionIcon: {
    marginRight: 15,
  },
  signOutButton: {
    marginTop: 30,
    backgroundColor: colors.error,
    paddingVertical: 15,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  signOutButtonText: {
    color: colors.white,
    fontSize: fontSize.xl,
  },
  chevron: {
    marginRight: 15,
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
  const user = useAuthUser();
  const userDbId = user?.attributes?.userDbId;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;
    const getImage = async () => {
      if (userDbId) {
        try {
          const blob = await fetchProfileImage(userDbId);
          if (blob) {
            const base64 = await blobToBase64(blob);
            setProfilePhoto({ uri: base64 });
            await AsyncStorage.setItem('profilePhoto', JSON.stringify({ uri: base64 }));
          }
        } catch (err) {
          console.log("Error fetching profile image:", err);
          const value = await AsyncStorage.getItem('profilePhoto');
          if (value) setProfilePhoto(JSON.parse(value));
        }
      } else {
        const value = await AsyncStorage.getItem('profilePhoto');
        if (value) setProfilePhoto(JSON.parse(value));
      }
    };
    getImage();
  }, [isFocused, userDbId]);

  useEffect(() => {
    if (user) {
      setUserName(
        user.attributes.given_name + " " + user.attributes.family_name
      );
      setEmail(user.attributes.email);
      setPhone(user.attributes.phone_number);
      setCountry(user.attributes["custom:Country"]);
    }
  }, [user]);

  const confirmSignOut = () => {
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

  const renderOption = (icon, label, onPress, right) => (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <FontAwesome name={icon} size={20} style={styles.optionIcon} />
      <Text style={styles.optionText}>{label}</Text>
      {right || <Ionicons name="chevron-forward" size={20} color={colors.textMuted} style={styles.chevron} />}
    </TouchableOpacity>
  );

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

        {renderOption("user-circle-o", t("EDIT"), () => navigation.navigate("EditProfile"))}
        {renderOption("user-circle-o", t("PERSONAL_INFORMATION"), () => navigation.navigate("EditPersonal"))}
        {renderOption("user-circle-o", t("IDENTITY_DOCUMENT"), () => navigation.navigate("IdentityDocument"))}
        {renderOption("lock", t("CHANGE_PASSWORD"), () => navigation.navigate("ChangePassword"))}
        {renderOption("user-circle-o", t("ORGANIZATION_DETAILS"), () => navigation.navigate("EditOrganization"))}
        {renderOption("tags", t("SKILLS"), () => navigation.navigate("Skills"))}
        {renderOption("calendar", t("AVAILABILITY"), () => navigation.navigate("Availability"))}
        {renderOption("gear", t("PREFERENCES"), () => navigation.navigate("Preferences"))}
        {renderOption("sign-out", t("SIGN_OFF"), () => navigation.navigate("AccountDeletion"))}

        <View style={styles.optionRow}>
          <FontAwesome name="bell" size={20} style={styles.optionIcon} />
          <Text style={styles.optionText}>{t("NOTIFICATIONS")}</Text>
          <Switch value={isNotificationsEnabled} onValueChange={setNotificationsEnabled} />
        </View>

        {renderOption("file-text-o", t("TERMS_AND_CONDITIONS"), () => navigation.navigate("TermsAndConditions"))}
        {renderOption("shield", t("PRIVACY_POLICY"), () => navigation.navigate("PrivacyPolicy"))}
        {renderOption("info-circle", t("HELP_CENTER"), () => navigation.navigate("Welcome"))}
        {renderOption("sign-out", t("LOGOUT"), confirmSignOut)}
      </ScrollView>
    </>
  );
}
