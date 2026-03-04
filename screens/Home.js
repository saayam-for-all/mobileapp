import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import Icon from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import api from "../services/api";
//import { Dimensions } from 'react-native';
//const { width, height } = Dimensions.get("window");
import Ionicons from "@expo/vector-icons/Ionicons";
import config from "../components/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated from "react-native-reanimated";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    overflow: "visible",
  },
  topBar: {
    flexDirection: "row",
    padding: 5,
    height: 50,
    backgroundColor: "yellow",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonStyle: {
    width: config.deviceWidth / 3,
    paddingTop: config.deviceHeight / 1.5,
  },
  logo: {
    width: 45,
    height: 45,
    borderRadius: 25,
    paddingLeft: 5,
    marginRight: config.deviceWidth / 2,
  },
  menuItem: {
    marginHorizontal: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchBarContainer: {
    marginTop: 10,
    paddingHorizontal: 0,
  },
  searchBar: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    position: "absolute",
    bottom: 0,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: " rgba(0,0,0,0.3)",
    zIndex: 9998,
  },
  dropdownWrapper: {
    position: "absolute",
    top: 55,
    right: 80,
    zIndex: 9999,
  },
  dropdownMenu: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    width: 220,
    paddingVertical: 5,
  },
  buttonView: {
    width: "45%",
    paddingVertical: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  fullWidthButton: {
    width: "100%",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#a9c9ff",
    borderRadius: 8,
    marginVertical: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  actionButtonText: {
    fontSize: 20,
    color: "#4f8ef7",
    fontWeight: "bold",
  },
  adminButton: {
    marginRight: -40,
  },
});

export default function Home({ signOut }) {
  const { t } = useTranslation("common"); // ✅ common.json
  const navigation = useNavigation();
  const Tab = createBottomTabNavigator();

  const [userName, setUserName] = useState("");
  const [userVolunteer, setVolunteer] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // ✅ store dashboard by key so it's language-independent
  const [selectedDashboardKey, setSelectedDashboardKey] = useState("VOLUNTEER_DASHBOARD");

  const volunteer = "Volunteers";

  const DASHBOARD_OPTIONS = [
    "SUPER_ADMIN_DASHBOARD",
    "ADMIN_DASHBOARD",
    "STEWARD_DASHBOARD",
    "VOLUNTEER_DASHBOARD",
    "BENEFICIARY_DASHBOARD",
  ];

  const getGroup = async (user) => {
    try {
      const session = await fetchAuthSession();
      const userGroup =
        session.tokens?.accessToken?.payload["cognito:groups"];
      //console.log('user group', userGroup)
      if (userGroup && userGroup.includes(volunteer)) {
        setVolunteer(true);
      } 
       //Refresh token 
      const refreshedSession = await fetchAuthSession({ forceRefresh: true });
      //console.log('session', refreshedSession);
      const { idToken, refreshToken, accessToken } = refreshedSession.tokens || {};
       //console.log('group');
    } catch (error) {
      console.log("error getting group", error);
    }
  }
  const getFirstTime = async (user) => {
    const username = user?.attributes?.email;
    if (!username) return;

    AsyncStorage.getItem(username).then((item) => {
      const ft = JSON.parse(item);
      if (ft) {
        Alert.alert(t("DEAR_USER"), t("FILL_PERSONAL_INFO_MESSAGE"), [
          {
            text: t("CANCEL"),
            onPress: () => AsyncStorage.setItem(username, JSON.stringify(false)),
            style: "cancel",
          },
          {
            text: t("OK"),
            onPress: () => navigation.navigate("EditPersonal"),
          },
        ]);
      }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { zIndex: 1 }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Image source={require("../assets/saayamforall.jpeg")} style={styles.logo} />

        <View style={{ position: "relative", zIndex: 9999 }}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPicker((prev) => !prev)}>
            <Ionicons name="build-outline" size={33} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-circle-outline" size={40} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder={t("SEARCH_PLACEHOLDER")}
          placeholderTextColor="#888"
        />
      </View>

      {/* Button Container */}
      <View style={styles.buttonContainer}>
        {selectedDashboardKey === "VOLUNTEER_DASHBOARD" ? (
          <TouchableOpacity
            style={[styles.buttonView, styles.fullWidthButton]}
            onPress={() => navigation.navigate("ManagedReqs")}
          >
            <Text style={styles.buttonText}>{t("MANAGED_REQUESTS")}</Text>
          </TouchableOpacity>
        ) : selectedDashboardKey === "BENEFICIARY_DASHBOARD" ? (
          <>
            <TouchableOpacity
              style={[styles.buttonView, styles.fullWidthButton]}
              onPress={() => navigation.navigate("MyReqs")}
            >
              <Text style={styles.buttonText}>{t("MY_REQUESTS")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonView, styles.fullWidthButton]}
              onPress={() => navigation.navigate("OtherRequests")}
            >
              <Text style={styles.buttonText}>{t("OTHERS_REQUESTS")}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.buttonView, styles.fullWidthButton]}
            onPress={() => navigation.navigate("AllRequests")}
          >
            <Text style={styles.buttonText}>{t("ALL_REQUESTS")}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View>
        {/* Action Buttons */}
        {!userVolunteer && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("PromoteToVolunteer")}
          >
            <Icon name="heart-outline" size={20} color="#4f8ef7" />
            <Text style={styles.actionButtonText}> {t("BECOME_VOLUNTEER")}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "blue" }]}
          onPress={() => navigation.navigate("UserRequest")}
        >
          <Icon name="add-outline" size={20} color="#fff" />
          <Text style={[styles.actionButtonText, { color: "#fff" }]}>
            {" "}
            {t("CREATE_A_REQUEST")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.footer}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Home1") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "Donate") {
                return (
                  <FontAwesome5
                    name="hand-holding-heart"
                    size={size}
                    color={focused ? "#4285F4" : "gray"}
                  />
                );
              } else if (route.name === "Notification") {
                iconName = focused ? "notifications" : "notifications-outline";
              } else if (route.name === "Account") {
                iconName = focused ? "person-circle" : "person-circle-outline";
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#4285F4",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: {
              height: 60,
              paddingBottom: 15,
              paddingTop: 5,
            },
            tabBarLabelStyle: {
              fontSize: 12,
            },
          })}
        >
          <Tab.Screen name="Home1" options={{ title: t("HOME") }} component={HomeTabScreen} />
          <Tab.Screen
            name="Donate"
            component={DonateScreen}
            options={{
              title: t("DONATE"),
              tabBarButton: (props) => (
                <TouchableOpacity {...props} onPress={() => navigation.navigate("Donation")} />
              ),
            }}
          />
          <Tab.Screen
            name="Notification"
            component={NotificationScreen}
            options={{
              title: t("NOTIFICATIONS"),
              tabBarButton: (props) => (
                <TouchableOpacity {...props} onPress={() => navigation.navigate("Notification")} />
              ),
            }}
          />
          <Tab.Screen
            name="Account"
            component={AccountScreen}
            options={{ title: t("PROFILE") }}
          />
        </Tab.Navigator>
      </View>

      {showPicker && (
        <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
          <View style={styles.backdrop} accessible={false} />
        </TouchableWithoutFeedback>
      )}

      {showPicker && (
        <Animated.View style={styles.dropdownWrapper}>
          <View style={styles.dropdownMenu}>
            {DASHBOARD_OPTIONS.map((key) => (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  setShowPicker(false);
                  setSelectedDashboardKey(key);
                }}
                style={{ flexDirection: "row", alignItems: "center", padding: 12 }}
              >
                <Feather
                  name="check"
                  size={25}
                  color={selectedDashboardKey === key ? "#000000ff" : "transparent"}
                  style={{ marginRight: 10 }}
                />
                <Text style={selectedDashboardKey === key ? { fontWeight: "bold" } : null}>
                  {t(key)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

function HomeTabScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function DonateScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Donate Screen</Text>
    </View>
  );
}

function NotificationScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Notification Screen</Text>
    </View>
  );
}

function AccountScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Account Screen</Text>
    </View>
  );
}