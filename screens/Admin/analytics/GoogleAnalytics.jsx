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

const TabBar = ({ activeTab, onTabChange }) => (
  <View style={styles.pickerWrapper}>
    <Picker
      selectedValue={activeTab}
      onValueChange={onTabChange}
      style={styles.picker}
    >
      {REPORTS.map((r) => (
        <Picker.Item key={r.id} label={r.label} value={r.id} />
      ))}
    </Picker>
  </View>
);

const GoogleAnalytics = () => {
  const [activeTab, setActiveTab] = useState(REPORTS[0].id);
  const [isLoadingInline, setIsLoadingInline] = useState(true);
  const [isLoadingModal, setIsLoadingModal] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const activeReport = REPORTS.find((r) => r.id === activeTab);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved && REPORTS.some((r) => r.id === saved)) {
        setActiveTab(saved);
      }
    });
  }, []);

  const handleTabChange = (reportId) => {
    if (reportId !== activeTab) {
      setIsLoadingInline(true);
      setIsLoadingModal(true);
      setActiveTab(reportId);
      AsyncStorage.setItem(STORAGE_KEY, reportId);
    }
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.tabRow}>
          <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
          <TouchableOpacity
            onPress={() => {
              setIsLoadingModal(true);
              setIsExpanded(true);
            }}
            style={styles.expandBtn}
            accessibilityLabel="Expand report"
          >
            <Text style={styles.expandIcon}>⤢</Text>
          </TouchableOpacity>
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
      </View>

      <Modal visible={isExpanded} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalTabRow}>
              <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
              <TouchableOpacity
                onPress={() => setIsExpanded(false)}
                style={styles.closeBtn}
                accessibilityLabel="Close expanded report"
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalWebviewContainer}>
              {isLoadingModal && (
                <View style={styles.spinner}>
                  <ActivityIndicator size="large" color="#3b82f6" />
                  <Text style={styles.spinnerText}>Loading report...</Text>
                </View>
              )}
              {activeReport && (
                <WebView
                  source={{ uri: activeReport.src }}
                  style={styles.webview}
                  onLoadEnd={() => setIsLoadingModal(false)}
                  onLoadStart={() => setIsLoadingModal(true)}
                  javaScriptEnabled
                  domStorageEnabled
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#f9fafb",
  },
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  picker: {
    height: Platform.OS === "ios" ? 120 : 40,
    color: "#374151",
  },
  expandBtn: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 6,
  },
  expandIcon: {
    fontSize: 16,
    color: "#9ca3af",
  },
  webviewContainer: {
    height: 400,
    position: "relative",
  },
  webview: {
    flex: 1,
  },
  spinner: {
    position: "absolute",
    inset: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    zIndex: 1,
  },
  spinnerText: {
    marginTop: 8,
    fontSize: 13,
    color: "#6b7280",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    width: "100%",
    height: "92%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTabRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#f9fafb",
  },
  closeBtn: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 8,
  },
  closeIcon: {
    fontSize: 16,
    color: "#9ca3af",
  },
  modalWebviewContainer: {
    flex: 1,
    position: "relative",
  },
});

export default GoogleAnalytics;
