import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons'; // Importing the icon library
import { FontAwesome } from '@expo/vector-icons';


const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        source={{ uri: 'https://via.placeholder.com/300' }} // Replace with your image URL or local image
        style={styles.image}
      />
      
      {/* Welcome Text */}
      <Text style={styles.title}>Welcome to Saayam</Text>
      <Text style={styles.subtitle}>
        A non-profit organization - is your gateway to assistance and support in times of need. 
        Saayam means Help in Telugu, Sahay in Sanskrit/Hindi, Bangzhu in Mandarin, and Ayuda in Spanish.
      </Text>

      {/* Donate Button with Icon */}
      <View style={styles.container}>
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.buttonWhite}>
          <FontAwesome name="heart" size={20} color="#000" /> 
          <Text style={styles.buttonTextBlack}>Donate</Text>
        </TouchableOpacity>
      </View>
    </View>

      {/* Log In Button */}
      <TouchableOpacity style={styles.buttonBlue}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      {/* Create Account Button */}
      <TouchableOpacity style={styles.buttonBlue}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBlue: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonWhite: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextBlack: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,  // Adds spacing between the icon and text
  },
});

export default WelcomeScreen;
