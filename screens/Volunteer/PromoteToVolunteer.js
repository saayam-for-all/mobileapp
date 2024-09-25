import React, { useState } from 'react';
import { View, StyleSheet,Button,  Text } from 'react-native';
import ProgressStepper from './ProgressStepper';
import TermsAndConditions from './Steps/TermsAndConditions';
import VolunteerCourse from './Steps/VolunteerCourse';
import PersonalInfo from './Steps/PersonalInfo';   // Placeholder
import Availability from './Steps/Availability';   // Placeholder
import Complete from './Steps/Complete';



export default function PromoteToVolunteer({ navigation }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  const steps = [
    "Terms & Conditions",
    "Volunteer Course",
    "Personal Information",
    "Availability",
  ];

  // Display the correct screen based on the current step
  const displayStep = (step) => {
    switch (step) {
      case 1:
        return (
          <TermsAndConditions
            isAcknowledged={isAcknowledged}
            setIsAcknowledged={setIsAcknowledged}
          />
        );
      case 2:
        return <VolunteerCourse />;
      case 3:
        return <PersonalInfo />;
      case 4:
        return <Availability />;
      case 5:
        return <Complete />;
      default:
        return null;
    }
  };

  // Handle step navigation
  const handleClick = (direction) => {
    let newStep = currentStep;

    if (direction === "next") {
      if (currentStep === 1 && !isAcknowledged) return;
      newStep++;
    } else if (direction === "prev") {
      newStep--;
    }

    if (newStep > 0 && newStep <= steps.length + 1) {
      setCurrentStep(newStep);
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Stepper */}
      <ProgressStepper currentStep={currentStep} />

      {/* Step Content */}
      <View style={styles.stepContent}>
        {displayStep(currentStep)}
      </View>

      {/* Navigation Controls */}
      {currentStep !== steps.length + 1 && (
        <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <Button title="Back" onPress={() => handleClick("prev")} />
          )}
          <Button
            title={currentStep === steps.length ? "Finish" : "Next"}
            onPress={() => handleClick("next")}
            disabled={currentStep === 1 && !isAcknowledged}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  stepContent: {
    flex: 1,
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});