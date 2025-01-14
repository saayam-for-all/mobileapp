import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
} from "react-native";

const ReqFilter = () => {
  const [status, setStatus] = useState("All");
  const [selectedCategories, setSelectedCategories] = useState([]); // Track selected categories
  const [isSubCategoryModalVisible, setSubCategoryModalVisible] =
    useState(false); // Modal for subcategories
  const [currentCategory, setCurrentCategory] = useState(null); // Track the current category for subcategories
  const [selectedSubCategories, setSelectedSubCategories] = useState([]); // Track selected subcategories

  const toggleStatus = (value) => {
    setStatus(value);
  };

  const toggleCategory = (category) => {
    if (category.subCategories) {
      setCurrentCategory(category);
      setSubCategoryModalVisible(true); // Open modal for subcategories
    } else {
      setSelectedCategories((prev) =>
        prev.includes(category.name)
          ? prev.filter((cat) => cat !== category.name)
          : [...prev, category.name]
      );
    }
  };

  const toggleSubCategory = (subCategory) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCategory)
        ? prev.filter((item) => item !== subCategory)
        : [...prev, subCategory]
    );
  };

  const resetFilter = () => {
    setStatus("All");
    setSelectedCategories([]);
    setSelectedSubCategories([]);
  };

  const applyFilter = () => {
    Alert.alert(
      "Filters Applied",
      `Status: ${status}\nCategories: ${selectedCategories.join(
        ", "
      )}\nSubCategories: ${selectedSubCategories.join(", ")}`
    );
  };

  const categories = [
    {
      name: "Logistics",
      subCategories: [
        "Logistics 1",
        "Logistics 2",
        "Logistics 3",
        "Logistics 4",
        "Logistics 5",
        "Logistics 6",
      ],
    },
    {
      name: "Maintenance",
      subCategories: [
        "Maintenance 1",
        "Maintenance 2",
        "Maintenance 3",
        "Maintenance 4",
        "Maintenance 5",
        "Maintenance 6",
      ],
    },
    {
      name: "Education",
      subCategories: [
        "Education 1",
        "Education 2",
        "Education 3",
        "Education 4",
        "Education 5",
        "Education 6",
      ],
    },
    {
      name: "Electronics",
      subCategories: [
        "Electronics 1",
        "Electronics 2",
        "Electronics 3",
        "Electronics 4",
        "Electronics 5",
        "Electronics 6",
      ],
    },
    {
      name: "Health",
      subCategories: [
        "Health 1",
        "Health 2",
        "Health 3",
        "Health 4",
        "Health 5",
        "Health 6",
      ],
    },
    {
      name: "Essentials",
      subCategories: [
        "Essentials 1",
        "Essentials 2",
        "Essentials 3",
        "Essentials 4",
        "Essentials 5",
        "Essentials 6",
      ],
    },
  ];

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryContainer}
      onPress={() => toggleCategory(item)}
    >
      <Text style={styles.categoryText}>{item.name}</Text>
      {item.subCategories ? (
        <Text style={styles.arrow}>›</Text> // Arrow for categories with subcategories
      ) : selectedCategories.includes(item.name) ? (
        <Text style={styles.tick}>✓</Text> // Tick for selected categories
      ) : null}
    </TouchableOpacity>
  );

  const renderSubCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.subCategoryContainer}
      onPress={() => toggleSubCategory(item)}
    >
      <Text style={styles.subCategoryText}>{item}</Text>
      {selectedSubCategories.includes(item) && (
        <Text style={styles.tick}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={resetFilter}>
        <Text style={styles.resetText}>Reset Filter</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Status</Text>
      <View style={styles.optionsContainer}>
        {["All", "Open", "Close"].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              status === option && styles.selectedOption,
            ]}
            onPress={() => toggleStatus(option)}
          >
            <Text
              style={[
                styles.optionText,
                status === option && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.name}
        renderItem={renderCategory}
      />

      {/* Subcategory Modal */}
      <Modal visible={isSubCategoryModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{currentCategory?.name}</Text>
          <FlatList
            data={currentCategory?.subCategories}
            keyExtractor={(item) => item}
            renderItem={renderSubCategory}
          />
          <TouchableOpacity
            onPress={() => setSubCategoryModalVisible(false)}
            style={styles.doneButton}
          >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => Alert.alert("Canceled")}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={applyFilter} style={styles.doneButton}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  resetText: {
    color: "#007BFF",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  optionText: {
    color: "#000",
    fontWeight: "600",
  },
  selectedOption: {
    backgroundColor: "#007BFF",
  },
  selectedOptionText: {
    color: "#FFF",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    marginVertical: 5,
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
  },
  arrow: {
    fontSize: 18,
    color: "#007BFF",
  },
  tick: {
    fontSize: 18,
    color: "#007BFF",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subCategoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  subCategoryText: {
    fontSize: 16,
    color: "#333",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelText: {
    color: "#007BFF",
    fontWeight: "600",
  },
  doneButton: {
    backgroundColor: "#007BFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  doneText: {
    color: "#FFF",
    fontWeight: "600",
  },
});

export default ReqFilter;