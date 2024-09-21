import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as DocumentPicker from 'expo-document-picker';

export default function VolunteerCourse() {
  const [selectedSource, setSelectedSource] = useState('Device');
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);

  // Function to handle file selection from device using expo-document-picker
  const handleFileUpload = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf,image/jpeg,image/jpg',
        multiple: false,
      });

      if (res.type === 'success') {
        // File size validation (max 2MB)
        if (res.size > 2 * 1024 * 1024) {
          Alert.alert('Error', 'File size should not exceed 2MB');
          setFile(null);
          setFileUploaded(false);
          return;
        }

        setFile(res);
        setFileUploaded(true);
      } else {
        Alert.alert('Error', 'Something went wrong while selecting the file.');
        setFile(null);
        setFileUploaded(false);
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong while selecting the file.');
      setFile(null);
      setFileUploaded(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Government ID</Text>

      {/* Select Source */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Select Source</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedSource(value)}
          items={[
            { label: 'Device', value: 'Device' },
            { label: 'Google Drive', value: 'Google Drive' },
            { label: 'Dropbox', value: 'Dropbox' },
          ]}
          value={selectedSource}
          style={{
            inputIOS: pickerSelectStyles.inputIOS,
            inputAndroid: pickerSelectStyles.inputAndroid,
          }}
        />
      </View>

      {/* File Upload Input (visible only if 'Device' is selected) */}
      {selectedSource === 'Device' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Upload File</Text>
          <TouchableOpacity
            style={[styles.inputBox, fileUploaded && styles.fileUploaded]}
            onPress={handleFileUpload}
          >
            <Text>{fileUploaded ? file.name : 'Choose File'}</Text>
          </TouchableOpacity>
          <Text style={styles.fileInfo}>Only JPEG, JPG, or PDF files. Max size: 2MB.</Text>
        </View>
      )}

      {/* Upload and Remove Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, !fileUploaded && styles.disabledButton]}
          onPress={() => {
            if (fileUploaded) {
              Alert.alert('Success', 'File uploaded successfully');
            }
          }}
          disabled={!fileUploaded}
        >
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>

        {file && (
          <TouchableOpacity
            onPress={() => {
              setFile(null);
              setFileUploaded(false);
            }}
            style={styles.removeButton}
          >
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111827',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 5,
  },
  inputBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    backgroundColor: '#F9FAFB',
  },
  fileUploaded: {
    backgroundColor: '#D1FADF', // Light green to indicate file uploaded
  },
  fileInfo: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 5,
  },
  buttonContainer: {
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#34D399',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF', // Grey for disabled button
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#F87171', // Red for remove button
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    color: '#111827',
    backgroundColor: '#F9FAFB',
    paddingRight: 30, // To ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    color: '#111827',
    backgroundColor: '#F9FAFB',
    paddingRight: 30, // To ensure the text is never behind the icon
  },
});