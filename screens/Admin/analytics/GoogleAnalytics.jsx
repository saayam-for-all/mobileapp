import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "ga-active-tab";

const REPORTS = [
  {
    id: "overview",
    label: "Overview",
    src: "https://lookerstudio.google.com/embed/reporting/13ae30f7-e7d7-478f-93b5-5739fcc6260c/page/t2tlF",
  },
  {
    id: "detailed",
    label: "Detailed Reports",
    src: "https://lookerstudio.google.com/embed/reporting/f3f99330-c45d-4ae8-83b7-0399df523ccd/page/kIV1C",
  },
  {
    id: "pageviews",
    label: "Page Views",
    src: "https://lookerstudio.google.com/embed/reporting/eb599b30-0561-483a-8f07-c8abc651d749/page/cnelF",
  },
];

const GoogleAnalytics = () => {
  const [activeTab, setActiveTab] = useState(REPORTS[0].id);
  const [isLoadingInline, setIsLoadingInline] = useState(true);

  const activeReport = REPORTS.find((r) => r.id === activeTab);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved && REPORTS.some((r) => r.id === saved)) {
        setActiveTab(saved);
      }
    });
  }, []);

  return (
    <>
      <View style={styles.tabBar}>
        {REPORTS.map((tab, index) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.tabActive,
              index < REPORTS.length - 1 && styles.tabMargin,
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.id && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.webviewContainer}>
        {isLoadingInline && (
          <View style={styles.spinner}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.spinnerText}>Loading report...</Text>
          </View>
        )}
        {activeReport && (
          <WebView
            source={{ uri: activeReport.src }}
            style={styles.webview}
            onLoadEnd={() => setIsLoadingInline(false)}
            onLoadStart={() => setIsLoadingInline(true)}
            javaScriptEnabled
            domStorageEnabled
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    backgroundColor: "#ffffff",
    borderBottomColor: "#3b82f6",
  },
  tabMargin: {
    marginRight: 4,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
  },
  tabLabelActive: {
    color: "#3b82f6",
  },
  webviewContainer: {
    flex: 1,
    position: "relative",
  },
  webview: {
    flex: 1,
  },
  spinner: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    zIndex: 10,
  },
  spinnerText: {
    marginTop: 8,
    color: "#6b7280",
    fontSize: 14,
  },
});

export default GoogleAnalytics;
