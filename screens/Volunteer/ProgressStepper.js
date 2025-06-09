import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function ProgressStepper({ currentStep }) {
  const steps = [
    { label: 'Terms & Conditions', id: 1 },
    { label: 'Identification', id: 2 },
    { label: 'Skills', id: 3 },
    { label: 'Availability', id: 4 }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.lineContainer}>
        {steps.map((_, index) => (
          index !== steps.length - 1 && (
            <View
              key={`line-${index}`}
              style={[
                styles.line,
                currentStep > index + 1 && styles.completedLine,
              ]}
            />
          )
        ))}
      </View>
      
      <View style={styles.stepsContainer}>
        {steps.map((step) => (
          <View key={step.id} style={styles.stepContent}>
            <View
              style={[
                styles.circle,
                (currentStep > step.id || currentStep === step.id) && styles.activeCircle,
              ]}
            >
              {currentStep > step.id ? (
                <FontAwesome name="check" size={20} color="white" />  
              ) : (
                <Text style={styles.stepText}>{step.id}</Text> 
              )}
            </View>

            <Text
              style={[
                styles.label,
                currentStep >= step.id && styles.activeLabel,
              ]}
            >
              {step.label.toUpperCase()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    position: 'relative',
    width: '100%',
    paddingHorizontal: 1,
  },
  lineContainer: {
    position: 'absolute',
    top: 17.5, // Half of circle height to center lines
    left: 45, // Adjust based on your layout
    right: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  stepContent: {
    alignItems: 'center',
  },
  circle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeCircle: {
    backgroundColor: '#34D399',
  },
  stepText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  activeLabel: {
    color: '#111827',
    fontWeight: 'bold',
  },
  label: {
    color: '#9CA3AF',
    textAlign: 'center',
    fontSize: 12,
    maxWidth: 83,
  },
  line: {
    height: 2,
    flex: 1,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  completedLine: {
    backgroundColor: '#34D399',
  },
});