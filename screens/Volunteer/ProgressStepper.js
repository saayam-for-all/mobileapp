import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // For check icon

export default function ProgressStepper({ currentStep }) {
  const steps = [
    { label: '', id: 1 },
    { label: '', id: 2 },
    { label: '', id: 3 },
    { label: '', id: 4 }
  ];

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={step.id} style={styles.stepContainer}>
          <View
            style={[
              styles.circle,
              (currentStep > step.id || currentStep === step.id) && styles.activeCircle, // Green circle for current or completed step
            ]}
          >
            {currentStep > step.id ? (
              <FontAwesome name="check" size={20} color="white" />  
            ) : (
              <Text style={styles.stepText}>{step.id}</Text> 
            )}
          </View>

          {/* Step Label */}
          <Text
            style={[
              styles.label,
              currentStep >= step.id && styles.activeLabel,
            ]}
          >
            {step.label.toUpperCase()}
          </Text>

          {/* Line between steps, except for the last one */}
          {index !== steps.length - 1 && (
            <View
              style={[
                styles.line,
                currentStep > step.id && styles.completedLine,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Centers all the step containers
    alignItems: 'center',
    marginBottom: 0,
    alignSelf: 'center', // Centers the entire container on the screen
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 35,  // Increased circle size
    height: 35,  // Increased circle size
    borderRadius: 17.5,  // Adjusted for larger circle
    backgroundColor: '#D1D5DB', // Default grey color
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    backgroundColor: '#34D399', // Green for current and completed steps
  },
  stepText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,  // Increased font size for step number
  },
  activeLabel: {
    color: '#111827', // Active label color
    fontWeight: 'bold',
  },
  label: {
    marginLeft: 8,
    color: '#9CA3AF', // Default grey color for label
  },
  line: {
    height: 2,
    width: 40,
    backgroundColor: '#D1D5DB', // Default grey color
    marginLeft: 10,
    marginRight: 10,
  },
  completedLine: {
    backgroundColor: '#34D399', // Green when completed
  },
});