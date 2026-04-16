import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import PropTypes from "prop-types";

const ChartContainer = ({ title, description, children, style }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <View style={[styles.card, style]}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            {title && <Text style={styles.title}>{title}</Text>}
            {description ? (
              <Text style={styles.description}>{description}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            onPress={() => setIsExpanded(true)}
            style={styles.expandBtn}
            accessibilityLabel="Expand chart"
          >
            <Text style={styles.expandIcon}>⤢</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>{children}</View>
      </View>

      <Modal visible={isExpanded} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderText}>
                {title && <Text style={styles.modalTitle}>{title}</Text>}
                {description ? (
                  <Text style={styles.modalDescription}>{description}</Text>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={() => setIsExpanded(false)}
                style={styles.closeBtn}
                accessibilityLabel="Close expanded chart"
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>{children}</ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

ChartContainer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerText: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  description: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
  },
  expandBtn: {
    padding: 6,
    borderRadius: 6,
  },
  expandIcon: {
    fontSize: 16,
    color: "#9ca3af",
  },
  content: {
    padding: 12,
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
    maxHeight: "92%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalHeaderText: {
    flex: 1,
    paddingRight: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  modalDescription: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  closeBtn: {
    padding: 8,
    borderRadius: 8,
  },
  closeIcon: {
    fontSize: 16,
    color: "#9ca3af",
  },
  modalBody: {
    padding: 20,
  },
});

export default ChartContainer;
