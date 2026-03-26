import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import RequestsAnalytics from "./RequestsAnalytics";
import KPIAnalytics from "./KPIAnalytics";
import BeneficiariesAnalytics from "./BeneficiariesAnalytics";
import VolunteerAnalytics from "./VolunteerAnalytics";

const TABS = [
  { id: "requests", label: "Requests" },
  { id: "kpi", label: "KPI" },
  { id: "beneficiaries", label: "Beneficiaries" },
  { id: "volunteers", label: "Volunteers" },
];

const ApplicationAnalytics = () => {
  const [activeTab, setActiveTab] = useState("requests");

  return (
    <View>
      <View style={styles.tabBar}>
        {TABS.map((tab, index) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.tabActive,
              index < TABS.length - 1 && styles.tabMargin,
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

      <View>
        {activeTab === "requests" && <RequestsAnalytics />}
        {activeTab === "kpi" && <KPIAnalytics />}
        {activeTab === "beneficiaries" && <BeneficiariesAnalytics />}
        {activeTab === "volunteers" && <VolunteerAnalytics />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    marginBottom: 8,
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
});

export default ApplicationAnalytics;
