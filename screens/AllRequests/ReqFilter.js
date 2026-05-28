import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { getCategories, getEnums } from "../../services/requestServices";
import { colors } from "../../styles/theme";
import { text as textStyles, pill, layout } from "../../styles/common";

const { width } = Dimensions.get("window");

const DEFAULT_FILTER_DATA = {
  requestFor: {
    "0": "SELF",
    "1": "OTHER",
  },
  requestPriority: {
    "0": "LOW",
    "1": "MEDIUM",
    "2": "HIGH",
    "3": "CRITICAL",
  },
  requestStatus: {
    "0": "CREATED",
    "1": "MATCHING VOLUNTEER",
    "2": "MANAGED",
    "3": "CLOSED",
    "4": "CANCELLED",
    "5": "DELETED",
  },
  requestType: {
    "0": "INPERSON",
    "1": "HYBRID",
  },
};

function buildCategoryFilter(categories) {
  const filter = {};
  (categories || []).forEach((cat) => {
    filter[cat.catName] = {
      checked: false,
      subcategories: buildCategoryFilter(cat.subCategories || []),
    };
  });
  return filter;
}

function getCheckedCategoryNames(filter) {
  const names = [];
  Object.entries(filter).forEach(([name, state]) => {
    if (state.checked) {
      names.push(name);
    }
    const childNames = getCheckedCategoryNames(state.subcategories);
    names.push(...childNames);
  });
  return names;
}

function setCategoryChecked(filter, catName, checked) {
  const next = { ...filter };
  if (next[catName]) {
    next[catName] = {
      ...next[catName],
      checked,
      subcategories: setAllChecked(next[catName].subcategories, checked),
    };
  } else {
    Object.keys(next).forEach((key) => {
      next[key] = {
        ...next[key],
        subcategories: setCategoryChecked(next[key].subcategories, catName, checked),
      };
    });
  }
  return next;
}

function setAllChecked(filter, checked) {
  const next = {};
  Object.entries(filter).forEach(([name, state]) => {
    next[name] = {
      ...state,
      checked,
      subcategories: setAllChecked(state.subcategories, checked),
    };
  });
  return next;
}

function getCategoryState(filter, catName) {
  for (const [name, state] of Object.entries(filter)) {
    if (name === catName) {
      const childNames = getCheckedCategoryNames(state.subcategories);
      const totalChildren = countAll(state.subcategories);
      if (state.checked && childNames.length === totalChildren) return "checked";
      if (!state.checked && childNames.length === 0) return "unchecked";
      return "indeterminate";
    }
    const found = getCategoryState(state.subcategories, catName);
    if (found) return found;
  }
  return null;
}

function countAll(filter) {
  let count = 0;
  Object.entries(filter).forEach(([, state]) => {
    count += 1 + countAll(state.subcategories);
  });
  return count;
}

const ReqFilter = ({ currentFilters, onGoBack, onClose }) => {
  const filtersRef = useRef({ ...currentFilters });
  const [, updateStyle] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState(
    currentFilters.categoryFilter || {}
  );
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedPriority, setSelectedPriority] = useState(
    currentFilters.selectedPriority || []
  );
  const [isResetClicked, setIsResetClicked] = useState(false);
  const [enums, setEnums] = useState(null);

  const filterData = useMemo(() => {
    if (!enums) return DEFAULT_FILTER_DATA;

    const requestStatus = Array.isArray(enums.requestStatus)
      ? Object.fromEntries(enums.requestStatus.map((s) => [s, s]))
      : enums.requestStatus || DEFAULT_FILTER_DATA.requestStatus;

    return {
      requestFor: enums.requestFor || DEFAULT_FILTER_DATA.requestFor,
      requestPriority: enums.requestPriority || DEFAULT_FILTER_DATA.requestPriority,
      requestStatus,
      requestType: enums.requestType || DEFAULT_FILTER_DATA.requestType,
    };
  }, [enums]);

  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        let arr;
        if (Array.isArray(data)) {
          arr = data;
        } else if (data && Array.isArray(data.categories)) {
          arr = data.categories;
        } else {
          arr = [];
        }
        const valid = arr.filter(
          (cat) =>
            cat.catName &&
            cat.catName !== "cat_name" &&
            cat.catId !== "cat_id"
        );
        setCategories(valid);
        if (Object.keys(categoryFilter).length === 0) {
          setCategoryFilter(buildCategoryFilter(valid));
        }
      } catch (error) {
        console.log("Failed to fetch categories for filter:", error);
      } finally {
        setCategoriesLoading(false);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchEnums() {
      try {
        const data = await getEnums();
        setEnums(data);
      } catch (error) {
        console.log("Failed to fetch enums for filter:", error);
      }
    }
    fetchEnums();
  }, []);

  const toggleStatus = (option) => {
    if (option in filtersRef.current.requestStatus) {
      delete filtersRef.current.requestStatus[option];
    } else {
      filtersRef.current.requestStatus[option] =
        filterData.requestStatus[option];
    }
    updateStyle((s) => s + 1);
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
        setSelectedPriority([]);
      }
    }
  };

  const handleCategoryCheck = (catName) => {
    setCategoryFilter((prev) => {
      const current = getCategoryState(prev, catName);
      const newChecked = current !== "checked";
      return setCategoryChecked(prev, catName, newChecked);
    });
  };

  const toggleExpanded = (catName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  const resetFilter = () => {
    filtersRef.current = {
      requestStatus: {},
      requestPriority: {},
    };
    setCategoryFilter(buildCategoryFilter(categories));
    setExpandedCategories({});
    setSelectedPriority([]);
    setIsResetClicked(true);
    updateStyle((s) => s + 1);
  };

  const applyFilter = () => {
    const checkedCategories = getCheckedCategoryNames(categoryFilter);
    filtersRef.current.categoryFilter = categoryFilter;
    filtersRef.current.checkedCategories = checkedCategories;
    filtersRef.current.selectedPriority = selectedPriority;
    onGoBack(filtersRef.current);
    onClose && onClose();
  };

  const renderCheckbox = (state) => {
    if (state === "checked") {
      return <Text style={styles.checkbox}>☑</Text>;
    }
    if (state === "indeterminate") {
      return <Text style={styles.checkbox}>☒</Text>;
    }
    return <Text style={styles.checkbox}>☐</Text>;
  };

  const renderCategoryTree = (cats, depth = 0) => {
    return cats.map((cat) => {
      const catState = getCategoryState(categoryFilter, cat.catName) || "unchecked";
      const hasChildren = cat.subCategories && cat.subCategories.length > 0;
      const isExpanded = expandedCategories[cat.catName];

      return (
        <View key={cat.catName || cat.catId}>
          <View style={[styles.categoryRow, { paddingLeft: depth * 16 }]}>
            <TouchableOpacity
              style={styles.checkboxArea}
              onPress={() => handleCategoryCheck(cat.catName)}
            >
              {renderCheckbox(catState)}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoryLabel}
              onPress={() => hasChildren && toggleExpanded(cat.catName)}
            >
              <Text style={styles.categoryText}>{cat.catName}</Text>
              {hasChildren && (
                <Text style={styles.arrow}>
                  {isExpanded ? "⌃" : "›"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {hasChildren && isExpanded && (
            <View style={styles.subCategoryList}>
              {renderCategoryTree(cat.subCategories, depth + 1)}
            </View>
          )}
        </View>
      );
    });
  };

  const renderPills = (items, selected, onToggle) => (
    <View style={layout.rowWrap}>
      {items.map((item) => {
        const isSelected = typeof selected === "function"
          ? selected(item)
          : selected.includes(item);
        return (
          <TouchableOpacity
            key={item}
            style={[
              pill.base,
              isSelected && pill.selected,
            ]}
            onPress={() => onToggle(item)}
          >
            <Text
              style={[
                pill.label,
                isSelected && pill.labelSelected,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const ListHeader = () => (
    <View>
      <TouchableOpacity onPress={resetFilter}>
        <Text style={styles.resetText}>Reset Filter</Text>
      </TouchableOpacity>

      <Text style={textStyles.sectionTitle}>Status</Text>
      {renderPills(
        Object.values(filterData.requestStatus),
        (val) => Object.values(filtersRef.current.requestStatus).includes(val),
        (val) => {
          const key = Object.keys(filterData.requestStatus).find(
            (k) => filterData.requestStatus[k] === val
          );
          if (key) toggleStatus(key);
        }
      )}

      <Text style={[textStyles.sectionTitle, { marginTop: 10 }]}>Priority</Text>
      {renderPills(
        ["All", ...Object.values(filterData.requestPriority)],
        (val) =>
          val === "All"
            ? selectedPriority.length === 0
            : selectedPriority.includes(val),
        (val) => togglePriority(val)
      )}

      <Text style={textStyles.sectionTitle}>Categories</Text>
      {categoriesLoading && (
        <ActivityIndicator size="small" color={colors.accent} style={{ marginBottom: 10 }} />
      )}
    </View>
  );

  const ListFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity onPress={onClose} style={styles.textButton}>
        <Text style={styles.textButtonLabel}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={applyFilter}
        style={[pill.base, pill.selected]}
      >
        <Text style={[pill.label, pill.labelSelected]}>Done</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />

      <Animated.View
        style={[
          styles.drawerContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <FlatList
          data={[{ key: "categories" }]}
          keyExtractor={(item) => item.key}
          renderItem={() => (
            <View>{renderCategoryTree(categories)}</View>
          )}
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
    backgroundColor: colors.overlay,
  },
  drawerContainer: {
    width: width * 0.80,
    height: "100%",
    backgroundColor: colors.white,
    position: "absolute",
    left: 0,
    top: 0,
    padding: 20,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  resetText: {
    color: colors.accent,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "600",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 4,
  },
  checkboxArea: {
    paddingRight: 8,
  },
  checkbox: {
    fontSize: 18,
    color: colors.accent,
  },
  categoryLabel: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 15,
    color: "#333",
  },
  subCategoryList: {
    marginLeft: 8,
  },
  arrow: {
    fontSize: 18,
    color: colors.accent,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
    marginTop: 20,
  },
  textButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textButtonLabel: {
    color: colors.accent,
    fontWeight: "600",
  },
});

export default ReqFilter;
