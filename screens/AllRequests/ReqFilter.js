import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const ReqFilter = () => {
  const [status, setStatus] = useState(['All']); // Default selection is 'All'
  const [categories, setCategories] = useState(['All']); // Default selection is 'All'

  const toggleStatus = (value) => {
    setStatus([value]); // Only allow one option to be selected at a time
  };

  const toggleCategory = (category) => {
    if (category === 'All') {
      if (categories.includes('All')) {
        setCategories([]); // Deselect All if already selected
      } else {
        setCategories(['All']);
      }
    } else {
      if (categories.includes(category)) {
        setCategories(categories.filter((cat) => cat !== category));
      } else {
        setCategories([...categories.filter((cat) => cat !== 'All'), category]);
      }
    }
  };

  const resetFilter = () => {
    setStatus(['All']);
    setCategories(['All']);
  };

  const applyFilter = () => {
    Alert.alert('Filters Applied', `Status: ${status.join(', ')}\nCategories: ${categories.join(', ')}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={resetFilter}>
        <Text style={styles.resetText}>Reset Filter</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Status</Text>
      <View style={styles.optionsContainer}>
        {['All', 'Open', 'Close'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              status.includes(option) && styles.selectedOption,
            ]}
            onPress={() => toggleStatus(option)}
          >
            <Text
              style={[
                styles.optionText,
                status.includes(option) && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.optionsContainer}>
        {['All', 'Logistics', 'Maintenance', 'Education', 'Electronics', 'Health', 'Essentials'].map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.optionButton,
              categories.includes(category) && styles.selectedOption,
            ]}
            onPress={() => toggleCategory(category)}
          >
            <Text
              style={[
                styles.optionText,
                categories.includes(category) && styles.selectedOptionText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => Alert.alert('Canceled')} style={styles.cancelButton}>
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
    backgroundColor: '#F5F5F5',
  },
  resetText: {
    color: '#007BFF',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  optionText: {
    color: '#000',
    fontWeight: '600',
  },
  selectedOption: {
    backgroundColor: '#007BFF',
  },
  selectedOptionText: {
    color: '#FFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelText: {
    color: '#007BFF',
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  doneText: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default ReqFilter;
