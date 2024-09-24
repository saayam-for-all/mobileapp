import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';  // Correct import for expo-checkbox

const categoriesData = {
  categories: [
    {
      category: "Banking",
      subCategories: [
        {
          category: "Retail Banking",
          subCategories: [
            {
              category: "Accounts",
              subCategories: [
                {
                  category: "Savings Account",
                  subCategories: ["Personal Savings", "Business Savings"]
                },
                {
                  category: "Checking Account",
                  subCategories: ["Personal Checking", "Business Checking"]
                }
              ]
            },
            {
              category: "Loans",
              subCategories: [
                {
                  category: "Personal Loans",
                  subCategories: ["Secured Loan", "Unsecured Loan"]
                },
                {
                  category: "Business Loans",
                  subCategories: ["Short-term Loan", "Long-term Loan"]
                }
              ]
            }
          ]
        },
        {
          category: "Investment Banking",
          subCategories: [
            {
              category: "Corporate Finance",
              subCategories: [
                {
                  category: "Mergers & Acquisitions",
                  subCategories: ["Advisory", "Execution"]
                },
                {
                  category: "Equity Capital Markets",
                  subCategories: ["Initial Public Offering", "Follow-on Offerings"]
                }
              ]
            },
            {
              category: "Sales & Trading",
              subCategories: ["Equities", "Fixed Income"]
            }
          ]
        }
      ]
    },
    "Books",
    "Clothes",
    "College Admissions",
    "Cooking",
    {
      category: "Education",
      subCategories: ["Elementary", "Middle School", "High School", "University"]
    },
    "Employment",
    "Finance",
    "Food",
    "Gardening",
    "Homelessness",
    "Housing",
    "Jobs",
    "Investing",
    "Matrimonial",
    {
      category: "Medical",
      subCategories: ["Brain", "Depression", "Eye", "Hand", "Head", "Leg"]
    },
    "Rental",
    "School",
    "Shopping",
    {
      category: "Sports",
      subCategories: ["Baseball", "Basketball", "Cricket", "Handball", "Jogging", "Hockey", "Running", "Tennis"]
    },
    "Stocks",
    "Travel",
    "Tourism"
  ]
};

const Skills = () => {
  const [checkedCategories, setCheckedCategories] = useState({});

  // Recursive function to render categories and subcategories with checkboxes
  const renderCategories = (categories, parentPath = "") => {
    return categories.map((cat, index) => {
      const isObject = typeof cat === "object";
      const categoryName = isObject ? cat.category : cat;
      const hasSubCategories = isObject && cat.subCategories;

      const currentPath = parentPath ? `${parentPath}.${categoryName}` : categoryName;

      return (
        <View key={index} style={styles.categoryContainer}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={getCheckedStatus(currentPath)}
              onValueChange={() => handleCheckboxChange(currentPath)}
              style={styles.checkbox}
            />
            <Text style={styles.categoryText}>{categoryName}</Text>
          </View>

          {/* Recursively render subcategories */}
          {hasSubCategories && getCheckedStatus(currentPath) && (
            <View style={styles.subCategoryContainer}>
              {renderCategories(cat.subCategories, currentPath)}
            </View>
          )}
        </View>
      );
    });
  };

  // Function to handle checkbox toggle
  const handleCheckboxChange = (categoryPath) => {
    setCheckedCategories((prevCategories) => {
      const checkedStatus = getCheckedStatus(categoryPath);
      const newCategories = { ...prevCategories };
      setCheckboxState(newCategories, categoryPath, !checkedStatus);
      return newCategories;
    });
  };

  // Get the checked status of a category by its path
  const getCheckedStatus = (categoryPath) => {
    const keys = categoryPath.split(".");
    let currentLevel = checkedCategories;

    for (let key of keys) {
      if (!currentLevel[key]) return false;
      currentLevel = currentLevel[key];
    }

    return currentLevel.checked;
  };

  // Set the checkbox state for a category at a given path
  const setCheckboxState = (draft, categoryPath, checked) => {
    const keys = categoryPath.split(".");
    let currentLevel = draft;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        if (checked) {
          currentLevel[key] = { checked: true };
        } else {
          delete currentLevel[key];
        }
      } else {
        if (!currentLevel[key]) {
          currentLevel[key] = {};
        }
        currentLevel = currentLevel[key];
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Select Your Skills For Volunteer Assignments</Text>
      {renderCategories(categoriesData.categories)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoryContainer: {
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
  },
  subCategoryContainer: {
    paddingLeft: 20,
  },
});

export default Skills;