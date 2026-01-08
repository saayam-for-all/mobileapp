import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handlePress = (newActiveTabIndex) => {
    setActiveTab(newActiveTabIndex);
  };

  return (
    <View>
      <View style={styles.tabHeader}>
        {children.map((child, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tab,
              activeTab === index ? styles.activeTab : styles.inactiveTab
            ]}
            onPress={() => handlePress(index)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === index ? styles.activeText : styles.inactiveText
              ]}
            >
              {child.props.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.content}>
        {children.map((child, index) => {
          if (index === activeTab) {
            return <View key={index}>{child.props.children}</View>;
          }
          return null;
        })}
      </View>
    </View>
  );
};

const Tab = ({ children }) => <>{children}</>;

const styles = StyleSheet.create({
  tabHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginRight: 8,
    borderBottomWidth: 2,
  },
  activeTab: {
    borderBottomColor: "#2563EB",
  },
  inactiveTab: {
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  activeText: {
    color: "#2563EB",
  },
  inactiveText: {
    color: "#6B7280",
  },
  content: {
    marginTop: 16,
  },
});

export { Tabs, Tab };