import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // For the check icon

export default function Complete() {
  const navigation = useNavigation();

  const handleClose = () => {
    // Navigate back to the Home page
    navigation.navigate('Home'); // Assuming your home page is called 'Home'
  };

  return (
    <View style={styles.container}>
      {/* Green checkmark icon */}
      <View style={styles.iconContainer}>
        <FontAwesome name="check-circle" size={100} color="#34D399" />
      </View>

      {/* Congratulations message */}
      <Text style={styles.congratsText}>CONGRATULATIONS</Text>

      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#34D399',
    textAlign: 'center',
    marginBottom: 50,
  },
  closeButton: {
    backgroundColor: '#3B82F6', // Blue button color
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});