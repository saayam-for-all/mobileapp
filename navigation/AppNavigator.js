import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";

import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Administration from "../screens/Administration";
import UserRequest from "../screens/UserRequest";
import MyReqs from "../screens/AllRequests/MyReqs";
import OtherRequests from "../screens/AllRequests/OtherRequests";
import ManagedReqs from "../screens/AllRequests/ManagedReqs";
import RequestDetails from "../screens/AllRequests/RequestDetails/RequestDetails";
import PromoteToVolunteer from "../screens/Volunteer/PromoteToVolunteer";
import Welcome from "../screens/MenuScreens/Welcome";
import ChangePassword from "../screens/MenuScreens/ChangePassword";
import PrivacyPolicy from "../screens/MenuScreens/PrivacyPolicy";
import TermsAndConditions from "../screens/MenuScreens/TermsAndConditions";
import EditProfile from "../screens/MenuScreens/EditProfile";
import EditOrganization from "../screens/MenuScreens/EditOrganization";
import EditPersonal from "../screens/MenuScreens/EditPersonal";
import ReqFilter from "../screens/AllRequests/ReqFilter";
import Notification from "../screens/Notifications/Notification";
import Donation from "../screens/Donation/Donation";
import BenevityInfo from "../screens/Benevity/Benevity";
import AdminPanel from "../screens/Admin/AdminPanel";
import Confirmation from "../screens/authentication/Confirmation";
import Skills from "../screens/MenuScreens/Skills";
import Availability from "../screens/MenuScreens/Availability";
import Preferences from "../screens/MenuScreens/Preferences";
import AccountDeletion from "../screens/MenuScreens/AccountDeletion";
import IdentityDocument from "../screens/MenuScreens/IdentityDocument";

const AppStack = createStackNavigator();

export default function App({ signOut }) {
  // ✅ Use existing keys only (mostly in "common" and "profile")
  const { t } = useTranslation(["common", "profile"]);

  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Home">
        {() => <Home signOut={signOut} />}
      </AppStack.Screen>

      <AppStack.Screen name="Profile">
        {() => <Profile signOut={signOut} />}
      </AppStack.Screen>

      <AppStack.Screen name="Administration">
        {() => <Administration signOut={signOut} />}
      </AppStack.Screen>

      {/* No existing key for "User Request" */}
      <AppStack.Screen name="UserRequest" component={UserRequest} options={{ title: "User Request" }} />

      {/* ✅ common.json has these keys */}
      <AppStack.Screen
        name="MyReqs"
        component={MyReqs}
        options={{ title: t("MY_REQUESTS", { ns: "common" }) }}
      />

      <AppStack.Screen
        name="OtherRequests"
        component={OtherRequests}
        options={{ title: t("OTHERS_REQUESTS", { ns: "common" }) }}
      />

      <AppStack.Screen
        name="ManagedReqs"
        component={ManagedReqs}
        options={{ title: t("MANAGED_REQUESTS", { ns: "common" }) }}
      />

      <AppStack.Screen
        name="RequestDetails"
        // No key for "Request Id : " so leaving as-is (dynamic title)
        options={({ route }) => ({ title: "Request Id : " + route.params.reqTitle })}
      >
        {() => <RequestDetails signOut={signOut} />}
      </AppStack.Screen>

      {/* No key for "Promote To Volunteer" */}
      <AppStack.Screen
        name="PromoteToVolunteer"
        component={PromoteToVolunteer}
        options={{ title: "Promote To Volunteer" }}
      />

      {/* No key for "Edit Profile" title */}
      <AppStack.Screen name="EditProfile" options={{ title: "Edit Profile" }}>
        {() => <EditProfile signOut={signOut} />}
      </AppStack.Screen>

      {/* ✅ profile.json/common.json has PERSONAL_INFORMATION */}
      <AppStack.Screen
        name="EditPersonal"
        options={{ title: t("PERSONAL_INFORMATION", { ns: "profile" }) }}
      >
        {() => <EditPersonal signOut={signOut} />}
      </AppStack.Screen>

      {/* ✅ profile.json has IDENTITY_DOCUMENT */}
      <AppStack.Screen
        name="IdentityDocument"
        options={{ title: t("IDENTITY_DOCUMENT", { ns: "profile" }) }}
      >
        {() => <IdentityDocument signOut={signOut} />}
      </AppStack.Screen>

      {/* No key for "Edit Organization" */}
      <AppStack.Screen name="EditOrganization" options={{ title: "Edit Organization" }}>
        {() => <EditOrganization signOut={signOut} />}
      </AppStack.Screen>

      {/* ✅ auth/profile/common have CHANGE_PASSWORD text, but we didn't include "auth" ns here.
          profile.json has CHANGE_PASSWORD, so use that. */}
      <AppStack.Screen
        name="ChangePassword"
        options={{ title: t("CHANGE_PASSWORD", { ns: "profile" }) }}
      >
        {() => <ChangePassword signOut={signOut} />}
      </AppStack.Screen>

      {/* ✅ profile.json has SKILLS */}
      <AppStack.Screen name="Skills" options={{ title: t("SKILLS", { ns: "profile" }) }}>
        {() => <Skills signOut={signOut} />}
      </AppStack.Screen>

      {/* ✅ profile.json has AVAILABILITY */}
      <AppStack.Screen
        name="Availability"
        options={{ title: t("AVAILABILITY", { ns: "profile" }) }}
      >
        {() => <Availability signOut={signOut} />}
      </AppStack.Screen>

      {/* ✅ profile.json has PREFERENCES */}
      <AppStack.Screen
        name="Preferences"
        options={{ title: t("PREFERENCES", { ns: "profile" }) }}
      >
        {() => <Preferences signOut={signOut} />}
      </AppStack.Screen>

      {/* ✅ profile.json has SIGN_OFF */}
      <AppStack.Screen
        name="AccountDeletion"
        options={{ title: t("SIGN_OFF", { ns: "profile" }) }}
      >
        {() => <AccountDeletion signOut={signOut} />}
      </AppStack.Screen>

      {/* ✅ common.json has PRIVACY_POLICY */}
      <AppStack.Screen
        name="PrivacyPolicy"
        options={{ title: t("PRIVACY_POLICY", { ns: "common" }) }}
      >
        {() => <PrivacyPolicy signOut={signOut} />}
      </AppStack.Screen>

      {/* ✅ common.json has TERMS_AND_CONDITIONS */}
      <AppStack.Screen
        name="TermsAndConditions"
        options={{ title: t("TERMS_AND_CONDITIONS", { ns: "common" }) }}
      >
        {() => <TermsAndConditions signOut={signOut} />}
      </AppStack.Screen>

      <AppStack.Screen name="Welcome">
        {() => <Welcome signOut={signOut} />}
      </AppStack.Screen>

      {/* No key for "Filter" */}
      <AppStack.Screen name="ReqFilter" component={ReqFilter} options={{ title: "Filter" }} />

      {/* ✅ common.json has NOTIFICATIONS */}
      <AppStack.Screen
        name="Notification"
        component={Notification}
        options={{ title: t("NOTIFICATIONS", { ns: "common" }) }}
      />

      {/* No key for "Donation" */}
      <AppStack.Screen name="Donation" component={Donation} options={{ title: "Donation" }} />

      {/* No key for "Benevity" */}
      <AppStack.Screen name="Benevity" component={BenevityInfo} options={{ title: "Benevity" }} />

      {/* ✅ common.json has ADMINISTRATE, but your title is "Administration" */}
      <AppStack.Screen name="Admin" component={AdminPanel} options={{ title: "Administration" }} />

      <AppStack.Screen name="ConfirmUpdate" options={{ headerShown: false }}>
        {() => <Confirmation isUpdate={true} />}
      </AppStack.Screen>
    </AppStack.Navigator>
  );
}
