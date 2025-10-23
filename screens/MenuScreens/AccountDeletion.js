import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountDeletion = ({signOut}) => {
  const navigation = useNavigation();
  const [isChecked, setIsChecked] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      // TODO: Implement AWS Cognito deleteUser() method
      // TODO: Implement backend API call to delete user data

      console.log("Deleting user account...");

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear local storage and redirect to home
      AsyncStorage.clear();

      // TO DELETE: call Auth.signOut() to mimic deletion
      signOut();
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert(
        'Error deleting account',
        'Please try again later',
        [
            { text: 'Ok'},
        ]
      );
    }
  };

  const handleSubmit = () => {
    if (!isChecked) {
      Alert.alert('Error', 'Please acknowledge that you understand the consequences of deleting your account.');
      return;
    } 
    
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to permanently delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          // Handle account deletion logic here
          console.log('Account deletion confirmed');
          handleConfirmDelete();
        }},
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="delete" size={32} color="#e74c3c" />
          <Text style={styles.headerTitle}>Sign Off</Text>
        </View>

        {/* Warning Card */}
        <View style={styles.warningCard}>
          <View style={styles.warningHeader}>
            <Ionicons name="warning" size={24} color="#e74c3c" />
            <Text style={styles.warningTitle}>Warning: Account Deletion</Text>
          </View>
          
          <Text style={styles.warningText}>
            This action will permanently delete your account and all associated 
            data. This action cannot be undone. Please ensure you have backed 
            up any important information before proceeding.
          </Text>
        </View>

        {/* Checkbox Section */}
        <View style={styles.checkboxSection}>
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setIsChecked(!isChecked)}
          >
            <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
              {isChecked && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
            <Text style={styles.checkboxText}>I want to delete my account</Text>
          </TouchableOpacity>
          
          <Text style={styles.acknowledgmentText}>
            By checking this box, you acknowledge that you understand the 
            consequences of deleting your account.
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, !isChecked && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isChecked}
        >
          <Text style={[styles.submitButtonText, !isChecked && styles.submitButtonTextDisabled]}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 12,
  },
  warningCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e74c3c',
    marginLeft: 8,
  },
  warningText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#e74c3c',
  },
  checkboxSection: {
    marginBottom: 40,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  checkboxText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '500',
    flex: 1,
  },
  acknowledgmentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#7f8c8d',
    marginLeft: 32,
  },
  submitButton: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  submitButtonDisabled: {
    backgroundColor: '#ecf0f1',
    color: '#95a5a6',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  submitButtonTextDisabled: {
    color: '#bdc3c7',
  },
});

export default AccountDeletion;