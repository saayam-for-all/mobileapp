import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Animated,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

// Filter from Backend (to be implemented later)
// {
//     "requestFor": {
//         "0": "SELF",
//         "1": "OTHER"
//     },
//     "requestPriority": {
//         "0": "LOW",
//         "1": "MEDIUM",
//         "2": "HIGH",
//         "3": "CRITICAL"
//     },
//     "requestStatus": {
//         "0": "CREATED",
//         "1": "MATCHING VOLUNTEER",
//         "2": "MANAGED",
//         "3": "CLOSED",
//         "4": "CANCELLED",
//         "5": "DELETED"
//     },
//     "requestType": {
//         "0": "INPERSON",
//         "1": "HYBRID"
//     }
// }

// categories = {
//   "catId": {catName: "Category Name", subCategories: [{catName: "SubCategoryName", catId: "catId"}, ...]},
//   ...
// }

// mock data
const filterData = {
  requestFor: {
    "0": "Self",
    "1": "Other",
  },
  requestPriority: {
    "0": "Low",
    "1": "Medium",
    "2": "High",
  },
  requestStatus: {
    "0": "Open",
    "1": "Close",
  },
  requestType: {
    "0": "Personal",
    "1": "Hybrid",
  },
};

const ReqFilter = ({ currentFilters, onGoBack, onClose }) => {
  const filtersRef = useRef({ ...currentFilters });
  const [, updateStyle] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]); // Track selected categories
  const [selectedSubCategories, setSelectedSubCategories] = useState([]); // Track selected subcategories
  const [expandedCategory, setExpandedCategory] = useState(null); // Track which category is expanded
  const [selectedPriority, setSelectedPriority] = useState(
    currentFilters.selectedPriority || [] // Sync on mount
  );
  const [isResetClicked, setIsResetClicked] = useState(false);

  // Animation setup
  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleStatus = (option) => {
    if (option in filtersRef.current.requestStatus) {
      delete filtersRef.current.requestStatus[option];
    } else {
      filtersRef.current.requestStatus[option] =
        filterData.requestStatus[option];
    }
    updateStyle((s) => s + 1); // Force re-render
  };
  const togglePriority = (option) => {
    if (option === "All") {
      setSelectedPriority([]);
      return;
    }

    if (selectedPriority.includes(option)) {
      setSelectedPriority(selectedPriority.filter((p) => p !== option));
    } else {
      if (selectedPriority.length < 2) {
        setSelectedPriority([...selectedPriority, option]);
      } else {
        setSelectedPriority([]); // reset to All
      }
    }
  };

  const toggleCategory = (category) => {
    // Inline expansion instead of modal
    if (expandedCategory === category.name) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category.name);
    }

    setSelectedCategories((prevState) => {
      if (!prevState.includes(category.name)) {
        return [...prevState, category.name];
      }
      return prevState;
    });
  };

  const toggleSubCategory = (subCategory) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCategory)
        ? prev.filter((item) => item !== subCategory)
        : [...prev, subCategory]
    );
  };

  const resetFilter = () => {
    filtersRef.current = {
      requestStatus: {},
      requestPriority: {},
      selectedCategories: [],
      selectedSubCategories: [],
    };
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setExpandedCategory(null);
    setSelectedPriority([]);
    setIsResetClicked(true);
    updateStyle((s) => s + 1);
  };

  const applyFilter = () => {
    if (isResetClicked) {
      Alert.alert("Filters Reset", "Filters have been reset to default");
      setIsResetClicked(false); // reset the flag
    } else {
      Alert.alert(
        "Filters Applied",
        `Status: ${Object.values(filtersRef.current.requestStatus).join(
          ", "
        )}\nCategories: ${selectedCategories.join(
          ", "
        )}\nSubCategories: ${selectedSubCategories.join(", ")}\nPriority: ${selectedPriority.length > 0 ? selectedPriority.join(", ") : "All"
        }`
      );
    }
    filtersRef.current.selectedCategories = selectedCategories;
    filtersRef.current.selectedSubCategories = selectedSubCategories;
    filtersRef.current.selectedPriority = selectedPriority;
    onGoBack(filtersRef.current);
    onClose && onClose();
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
    <View>
      <TouchableOpacity
        style={styles.categoryContainer}
        onPress={() => toggleCategory(item)}
      >
        <Text style={styles.categoryText}>{item.name}</Text>
        <Text style={styles.arrow}>
          {expandedCategory === item.name ? "⌃" : "›"}
        </Text>
      </TouchableOpacity>

      {expandedCategory === item.name && (
        <View style={styles.subCategoryList}>
          {item.subCategories.map((sub) => (
            <TouchableOpacity
              key={sub}
              style={styles.subCategoryContainer}
              onPress={() => toggleSubCategory(sub)}
            >
              <Text style={styles.subCategoryText}>{sub}</Text>
              {selectedSubCategories.includes(sub) && (
                <Text style={styles.tick}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  // Header content for FlatList
  const ListHeader = () => (
    <View>
      <TouchableOpacity onPress={resetFilter}>
        <Text style={styles.resetText}>Reset Filter</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Status</Text>
      <View style={styles.optionsContainer}>
        {Object.keys(filterData.requestStatus).map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              option in filtersRef.current.requestStatus &&
              styles.selectedOption,
            ]}
            onPress={() => toggleStatus(option)}
          >
            <Text
              style={[
                styles.optionText,
                option in filtersRef.current.requestStatus &&
                styles.selectedOptionText,
              ]}
            >
              {filterData.requestStatus[option]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Priority</Text>
      <View style={styles.optionsContainer}>
        {["All", ...Object.keys(filterData.requestPriority).map((k) => filterData.requestPriority[k])].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              (option === "All" && selectedPriority.length === 0) ||
                selectedPriority.includes(option)
                ? styles.selectedOption
                : null,
            ]}
            onPress={() => togglePriority(option)}
          >
            <Text
              style={[
                styles.optionText,
                (option === "All" && selectedPriority.length === 0) ||
                  selectedPriority.includes(option)
                  ? styles.selectedOptionText
                  : null,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Categories</Text>
    </View>
  );

  // Footer content for FlatList
  const ListFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity
        onPress={onClose}
        style={styles.cancelButton}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={applyFilter} style={styles.doneButton}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Semi-transparent overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => navigation.goBack()}
      />

      {/* Drawer container */}
      <Animated.View
        style={[
          styles.drawerContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <FlatList
          data={categories}
          keyExtractor={(item) => item.name}
          renderItem={renderCategory}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  drawerContainer: {
    width: width * 0.80,
    height: "100%",
    backgroundColor: "#FFF",
    position: "absolute",
    left: 0,
    top: 0,
    padding: 20,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
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
    flexWrap: "wrap",
  },
  optionButton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    marginBottom: 10,
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
  subCategoryList: {
    marginLeft: 12,
    marginBottom: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
  },
  subCategoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  subCategoryText: {
    fontSize: 15,
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
    marginTop: 20,
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
