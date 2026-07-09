import React, { useState, useRef, useEffect } from "react";
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
import Ionicons from "@expo/vector-icons/Ionicons";
import config from "../components/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated from "react-native-reanimated";
import useAuthUser from "../hooks/useAuthUser";
import { colors, borderRadius } from "../styles/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: "100%",
    overflow: "scroll",
  },
  topBar: {
    flexDirection: "row",
    padding: 5,
    height: 50,
    backgroundColor: "yellow",
    justifyContent: "space-between",
    alignItems: "center",
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
    color: colors.black,
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
    borderColor: colors.borderLight,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    backgroundColor: colors.surfaceAlt,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: colors.borderLight,
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
    backgroundColor: colors.overlay,
    zIndex: 9998,
  },
  dropdownWrapper: {
    position: "absolute",
    top: 55,
    right: 80,
    zIndex: 9999,
  },
  dropdownMenu: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    shadowColor: colors.black,
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
    backgroundColor: colors.surfaceAlt,
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
    color: colors.black,
    textAlign: "center",
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#a9c9ff",
    borderRadius: borderRadius.md,
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
  const { t } = useTranslation("common");
  const navigation = useNavigation();
  const Tab = createBottomTabNavigator();

  const user = useAuthUser();
  const [userRole, setUserRole] = useState("Beneficiary");
  const [showPicker, setShowPicker] = useState(false);

  const [selectedDashboardKey, setSelectedDashboardKey] = useState("VOLUNTEER_DASHBOARD");
  const DASHBOARD_OPTIONS = [
    { option: "VOLUNTEER_DASHBOARD", role: "Volunteer" },
    { option: "BENEFICIARY_DASHBOARD", role: "Beneficiary" },
    { option: "ADMIN_DASHBOARD", role: "Admin" },
    { option: "SUPER_ADMIN_DASHBOARD", role: "Admin" },
  ];

  const beneficiary = "Beneficiary";
  const volunteer = "Volunteer";
  const steward = "Steward";
  const admin = "Admin";

  const getGroup = async (user) => {
    try {
      const session = await fetchAuthSession();
      const userGroup =
        session.tokens?.accessToken?.payload["cognito:groups"];

      let role = beneficiary;
      if (userGroup && userGroup.includes(volunteer)) {
        role = volunteer;
      } else if (userGroup && userGroup.includes(steward)) {
        role = steward;
      } else if (userGroup && userGroup.includes(admin)) {
        role = admin;
      } else {
        role = beneficiary;
      }
      setUserRole(role);
    } catch (error) {
      console.log("error getting group", error);
    }
  };

  const getFirstTime = async (user) => {
    const username = user?.attributes?.email;
    if (!username) return;

    AsyncStorage.getItem(username).then((item) => {
      const ft = JSON.parse(item) || false;
      console.log("First time check for user", username, "is", ft);
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

  useEffect(() => {
    if (user) {
      getGroup(user);
      getFirstTime(user);
    }
  }, [user]);

  return (
    <SafeAreaView style={[styles.container, { zIndex: 1 }]}>
      <View style={styles.topBar}>
        <Image source={require("../assets/saayamforall.jpeg")} style={styles.logo} />

        <View style={{ position: "relative", zIndex: 9999 }}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPicker((prev) => !prev)}>
            <Ionicons name="build-outline" size={33} color={colors.black} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-circle-outline" size={40} color={colors.black} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder={t("SEARCH_PLACEHOLDER")}
          placeholderTextColor="#888"
        />
      </View>

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
          <>
            <TouchableOpacity
              style={[styles.buttonView, styles.fullWidthButton]}
              onPress={() => navigation.navigate("ApplicationAnalytics")}
            >
              <Text style={styles.buttonText}>{"Application Analytics"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonView, styles.fullWidthButton]}
              onPress={() => navigation.navigate("GoogleAnalytics")}
            >
              <Text style={styles.buttonText}>{"Google Analytics"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonView, styles.fullWidthButton]}
              onPress={() => navigation.navigate("OtherRequests")}
            >
              <Text style={styles.buttonText}>{t("ALL_REQUESTS")}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View>
        {!(userRole == volunteer) && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("PromoteToVolunteer")}
          >
            <Icon name="heart-outline" size={20} color="#4f8ef7" />
            <Text style={styles.actionButtonText}> {t("BECOME_VOLUNTEER")} </Text>
          </TouchableOpacity>
        )}

        {(userRole == beneficiary) && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("EmergencyContact")}
          >
            <Icon name="heart-outline" size={20} color="#4f8ef7" />
            <Text style={styles.actionButtonText}> {t("EMERGENCY_CONTACT")} </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={async () => {
            try {
              const stored = await AsyncStorage.getItem("personal_info");
              console.log("[Home] personal_info from AsyncStorage:", stored);
              if (stored) {
                const parsed = JSON.parse(stored);
                console.log("[Home] Parsed personal_info:", JSON.stringify(parsed));
                const hasRequired = parsed.streetAddress && parsed.city && parsed.state && parsed.zipCode;
                console.log("[Home] Has required fields (address, city, state, zipCode):", hasRequired);
                if (hasRequired) {
                  navigation.navigate("UserRequest");
                  return;
                }
              }
              Alert.alert(t("DEAR_USER"), t("FILL_PERSONAL_INFO_MESSAGE"), [
                { text: t("CANCEL"), style: "cancel" },
                { text: t("OK"), onPress: () => navigation.navigate("EditPersonal") },
              ]);
            } catch (error) {
              console.log("Failed to check personal info:", error);
              navigation.navigate("UserRequest");
            }
          }}
        >
          <Icon name="add-outline" size={20} color={colors.white} />
          <Text style={[styles.actionButtonText, { color: colors.white }]}>
            {" "}
            {t("CREATE_HELP_REQUEST")}
          </Text>
        </TouchableOpacity>
      </View>

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
            {DASHBOARD_OPTIONS.map((ele) => {
              const key = ele.option;
              const role = ele.role;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => {
                    setShowPicker(false);
                    console.log("Dashboard option selected:", key, "with role:", role);
                    setUserRole(role);
                    setSelectedDashboardKey(key);
                  }}
                  style={{ flexDirection: "row", alignItems: "center", padding: 12 }}
                >
                  <Feather
                    name="check"
                    size={25}
                    color={selectedDashboardKey === key ? colors.black : "transparent"}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={selectedDashboardKey === key ? { fontWeight: "bold" } : null}>
                    {t(key)}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
