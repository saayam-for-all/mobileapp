import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { View, Text, Switch, Alert, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';
import Input from '../components/Input';
import api from '../components/api';
import languagesData from '../i18n/languagesData';
import * as DocumentPicker from 'expo-document-picker';
import Icon from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native';
import AudioRecorder from '../components/AudioRecorder';

import { getCategories, getEnums } from '../services/requestServices';
import { Tab, Tabs } from '../components/Tabs';

const genderOptions = [
  { label: 'Select', value: 'Select' },
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
  { label: 'Prefer not to say', value: 'Prefer not to say' },
];

// Build language options from languagesData.js
const languageOptions = languagesData.map((lang) => ({
  // Special case: If the language is "Mandarin Chinese", convert its value to "Chinese" to match the locale mapping.
  value: lang.name === "Mandarin Chinese" ? "Chinese" : lang.name,
  label: lang.name,
}));

export default function UserRequest({ isEdit = false, onClose, requestItem = {} }) {
  const { t, i18n } = useTranslation(["common", "categories"]);
  const [loading, setLoading] = useState(false);

  // Consolidated form data
  const [formData, setFormData] = useState({
    request_for: 'SELF', // Will be set from enums
    isCalamity: false,
    priority: isEdit && requestItem?.priority ? requestItem.priority : 'MEDIUM',
    requestCategory: isEdit && requestItem?.category ? requestItem.category : '0.0.0.0.0',
    requestSubCategory: '',
    request_type: 'REMOTE',
    location: '',
    subject: isEdit && requestItem?.subject ? requestItem.subject : '',
    description: isEdit && requestItem?.description ? requestItem.description : '',
  });

  // Separate state for other person's info
  const [otherPersonInfo, setOtherPersonInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    preferredLanguage: 'English',
  });

  const [categories, setCategories] = useState({});
  const [subCategories, setSubCategories] = useState([]);
  const [enums, setEnums] = useState(null);
  const [toSubmit, setToSubmit] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const navigation = useNavigation();

  // State to toggle the floating audio recorder
  const [isRecorderVisible, setIsRecorderVisible] = useState(false);
  const [recordedAudioUri, setRecordedAudioUri] = useState(null);

  // Helper to update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper to update other person info
  const updatePersonInfo = (field, value) => {
    setOtherPersonInfo(prev => ({ ...prev, [field]: value }));
  };

  // Helper to check if request is for self
  const isSelfRequest = () => {
    return formData.request_for === enums?.requestFor?.[0]; // First enum value is typically "SELF"
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories();
      if (categoriesData?.length) {
        const filteredCategories = {}
        for (const cat of categoriesData) {
          if (cat.catName &&
            cat.catName !== "cat_name" &&
            cat.catId !== "cat_id" &&
            cat.catId !== "﻿cat_id" && // Handle BOM characters
            !cat.catName.toLowerCase().includes("cat_name") &&
            !cat.catId.toLowerCase().includes("cat_id")
          )
            filteredCategories[cat.catId] = cat;
        }
        setCategories(filteredCategories);
      } else {
        throw new Error('No categories found');
      }
    }
    catch (err) {
      console.error('Error getting categories: ', err);
    }
  }

  // Integrate API for checking profanity
  const checkProfanity = async () => {
    const res = await api.post(
      "/requests/v0.0.1/checkProfanity",
      { subject: formData.subject, description: formData.description }
    );
    return res.data;
  }

  const getSuggestedCategories = async () => {
    const res = await api.post(
      "/genai/v0.0.1/predict_categories",
      { subject: formData.subject, description: formData.description }
    );
    return res.data;
  }

  const submit = async (category = '') => {
    const submitData = {
      ...formData,
      requestCategory: category || formData.requestCategory
    };

    // Include other person info if not for self
    if (!isSelfRequest()) {
      submitData.otherPerson = otherPersonInfo;
    }

    console.log('Submitting:', submitData);

    Alert.alert(
      'Dear User',
      'Help Request Created Successfully.\nCategory: ' + submitData.requestCategory,
      [
        {
          text: 'OK', onPress: () => {
            if (isEdit) {
              onClose();
            }
            else {
              navigation.navigate('Home');
            }
          }
        },
      ]
    );
  }

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // allow all file types
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        setAttachedFile(result);
        Alert.alert("File Attached", result.name);
      }
    } catch (err) {
      console.log("File picker error:", err);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.subject || !formData.description) {
      Alert.alert('Validation Error', 'Both Subject and Description are required!');
      return;
    }

    // Validate other person info if not for self
    if (!isSelfRequest()) {
      const { firstName, lastName, email } = otherPersonInfo;
      if (!firstName || !lastName || !email) {
        Alert.alert('Validation Error', 'First Name, Last Name, and Email are required for the person you are submitting for!');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Validation Error', 'Please enter a valid email address!');
        return;
      }
    }
    setLoading(true);
    try {
      // Check profanity
      const profanityResponse = await checkProfanity();
      if (profanityResponse?.contains_profanity) {
        const profanity = profanityResponse.profanity;
        Alert.alert(
          'Dear User',
          'The system detects profanity in your help request, please edit your request.\nTrigger words: ' + profanity,
          [
            {
              text: 'OK', onPress: () => {
                console.log("OK pressed for check profanity");
                setLoading(false);
              }
            },
          ]
        );
        return;
      }

      // Check if category is default/empty, then get suggested categories
      if (!formData.requestCategory || formData.requestCategory === '0.0.0.0.0') {
        const defaultCategories = ["Health", "Education", "Electronics", "General"];
        let suggestedCategories = await getSuggestedCategories();
        console.log("Suggested categories: ", suggestedCategories);
        if (!suggestedCategories) suggestedCategories = defaultCategories;
        suggestedCategories.push('General');
        const alertCategories = suggestedCategories.map((category) => {
          return {
            text: category,
            onPress: async () => {
              await submit(category=category);
              setLoading(false);
            }
          }
        });
        Alert.alert(
          'Dear User',
          'Please fill in categories or select one of the recommended categories',
          [...alertCategories]
        );
      }
      else {
        await submit();
        setLoading(false);
      }
    }
    catch (error) {
      setLoading(false);
      console.error('Error during submit user request:', error);
    }
  };

  const handleCancel = () => {
    Alert.alert('Are you sure?', 'Do you really want to cancel the request?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => navigation.navigate('Home'),
      },
    ]);
  };

  useEffect(() => {
    if (Object.keys(categories).length === 0) fetchCategories();
  }, [categories]);

  useEffect(() => {
    const fetchEnumsData = async () => {
      try {
        const data = await getEnums();
        console.log("Enums API response:", data);
        setEnums(data);

        // Set initial request_for value from enums
        if (data?.requestFor?.[0]) {
          updateFormData('request_for', data.requestFor[0]);
        }
      } catch (error) {
        console.error('Error fetching enums:', error);
      }
    };

    fetchEnumsData();
  }, []);

  useEffect(() => {
    if (categories[formData.requestCategory]) {
      setSubCategories(categories[formData.requestCategory].subCategories);
      updateFormData('requestSubCategory', '');
    }
  }, [formData.requestCategory]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{isEdit ? 'Edit Help Request' : 'Create Help Request'}</Text>

        <View style={styles.alertBox}>
          <Text style={styles.alertTextBold}>
            Note: We do not handle life-threatening emergency requests. Please call your local emergency service if you need urgent help.
          </Text>
        </View>

        <Tabs>
          <Tab label="Description">
            {/* Mandatory Descriptions */}

            <View style={styles.field}>
              <Text style={styles.label}>Request Category</Text>
              <RNPickerSelect
                onValueChange={(value) => updateFormData('requestCategory', value)}
                items={Object.keys(categories).map((id) => {
                  return { label: t(`categories:REQUEST_CATEGORIES.${categories[id].catName}.LABEL`), value: id }
                })}
                value={formData.requestCategory}
                style={{
                  inputIOS: pickerSelectStyles.inputIOS,
                  inputAndroid: pickerSelectStyles.inputAndroid,
                }}
              />
            </View>

            {subCategories.length > 0 && (
              <View style={styles.field}>
                <Text style={styles.label}>Subcategory</Text>
                <RNPickerSelect
                  onValueChange={(value) => updateFormData('requestSubCategory', value)}
                  items={subCategories.map((subCat) => {
                    return { label: t(`categories:REQUEST_CATEGORIES.${categories[formData.requestCategory].catName}.SUBCATEGORIES.${subCat.catName}.LABEL`), value: subCat.catId }
                  })}
                  value={formData.requestSubCategory}
                  style={{
                    inputIOS: pickerSelectStyles.inputIOS,
                    inputAndroid: pickerSelectStyles.inputAndroid,
                  }}
                />
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.label}>
                Subject <Text style={{ color: 'red' }}>*</Text> (Max 70 characters)
              </Text>
              <Input
                style={styles.input}
                maxLength={70}
                placeholder="Enter subject..."
                value={formData.subject}
                onChangeText={(text) => updateFormData('subject', text)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Description <Text style={{ color: 'red' }}>*</Text> (Max 500 characters)  <Icon
                  name="paperclip"
                  size={18}
                  color="#374151"
                  style={{ marginLeft: 8 }}
                  onPress={handleFilePick}
                />
              </Text>

              {/* Wrap Input in relative container to position microphone inside */}
              <View style={{ position: 'relative' }}>
                <Input
                  style={[styles.textArea, { minHeight: 100, paddingRight: 40 }]}
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                  placeholder="Describe your request..."
                  value={formData.description}
                  onChangeText={(text) => updateFormData('description', text)}
                />
                  <AudioRecorder
                    visible={isRecorderVisible}
                    onStop={(uri) => {
                      setRecordedAudioUri(uri); // store audio URI
                      setIsRecorderVisible(false); // close recorder
                    }}
                    onClose={() => setIsRecorderVisible(false)}
                  />


                {/* Microphone Icon to open Floating AudioRecorder */}
                <TouchableOpacity
                  onPress={() => setIsRecorderVisible(true)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 16, // adjust to vertically center
                  }}
                >
                </TouchableOpacity>

              </View>

              {attachedFile && (
                <Text style={styles.attachedFileText}>
                  📎 {attachedFile.name}
                </Text>
              )}
            </View>
          </Tab>

          <Tab label="Details">
              {/* Details Field */}

            <View style={styles.field}>
              <Text style={styles.label}>For Self</Text>
              <RNPickerSelect
                onValueChange={(value) => updateFormData('request_for', value)}
                items={
                  enums?.requestFor
                    ? Object.values(enums.requestFor).map((val) => ({
                      label: t(`enums:requestFor.${val}`),
                      value: val,
                    }))
                    : [
                      { label: 'Self', value: '0' },
                      { label: 'Other', value: '1' },
                    ]
                }
                value={formData.request_for}
                style={{
                  inputIOS: pickerSelectStyles.inputIOS,
                  inputAndroid: pickerSelectStyles.inputAndroid,
                }}
              />
            </View>

            {/* Conditional Person Info Section */}
            {!isSelfRequest() && (
              <View style={styles.personInfoSection}>
                <Text style={styles.sectionTitle}>Person Details</Text>
                <Text style={styles.sectionSubtitle}>
                  Please fill the details of the person you are submitting the request for.
                </Text>

                <View style={styles.field}>
                  <Text style={styles.label}>
                    First Name <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <Input
                    style={styles.input}
                    placeholder="Enter first name..."
                    value={otherPersonInfo.firstName}
                    onChangeText={(text) => updatePersonInfo('firstName', text)}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>
                    Last Name <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <Input
                    style={styles.input}
                    placeholder="Enter last name..."
                    value={otherPersonInfo.lastName}
                    onChangeText={(text) => updatePersonInfo('lastName', text)}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>
                    Email <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <Input
                    style={styles.input}
                    placeholder="Enter email..."
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={otherPersonInfo.email}
                    onChangeText={(text) => updatePersonInfo('email', text)}
                  />
                </View>

                <View style={styles.rowFields}>
                  <View style={[styles.field, { flex: 0.6 }]}>
                    <Text style={styles.label}>Phone</Text>
                    <Input
                      style={styles.input}
                      placeholder="Phone number..."
                      keyboardType="phone-pad"
                      value={otherPersonInfo.phone}
                      onChangeText={(text) => updatePersonInfo('phone', text)}
                    />
                  </View>

                  <View style={[styles.field, { flex: 0.4 }]}>
                    <Text style={styles.label}>Age</Text>
                    <Input
                      style={styles.input}
                      placeholder="Age..."
                      keyboardType="number-pad"
                      value={otherPersonInfo.age}
                      onChangeText={(text) => updatePersonInfo('age', text)}
                    />
                  </View>
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Gender</Text>
                  <RNPickerSelect
                    onValueChange={(value) => updatePersonInfo('gender', value)}
                    items={genderOptions}
                    value={otherPersonInfo.gender}
                    style={{
                      inputIOS: pickerSelectStyles.inputIOS,
                      inputAndroid: pickerSelectStyles.inputAndroid,
                    }}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Preferred Language</Text>
                  <RNPickerSelect
                    onValueChange={(value) => updatePersonInfo('preferredLanguage', value)}
                    items={languageOptions}
                    value={otherPersonInfo.preferredLanguage}
                    style={{
                      inputIOS: pickerSelectStyles.inputIOS,
                      inputAndroid: pickerSelectStyles.inputAndroid,
                    }}
                  />
                </View>
              </View>
            )}

            <View style={styles.rowField}>
              <Text style={styles.label}>Is Calamity?</Text>
              <Switch
                value={formData.isCalamity}
                onValueChange={(value) => updateFormData('isCalamity', value)}
                style={styles.switch}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Priority</Text>
              <RNPickerSelect
                onValueChange={(value) => updateFormData('priority', value)}
                items={
                  enums?.requestPriority
                    ? Object.values(enums.requestPriority).map((val) => ({
                      label: t(`enums:requestPriority.${val}`),
                      value: val,
                    }))
                    : [
                      { label: 'LOW', value: '0' },
                      { label: 'MEDIUM', value: '1' },
                      { label: 'HIGH', value: '2' },
                      { label: 'CRITICAL', value: '3' },
                    ]
                }
                value={formData.priority}
                style={{
                  inputIOS: pickerSelectStyles.inputIOS,
                  inputAndroid: pickerSelectStyles.inputAndroid,
                }}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Request Type</Text>
              <RNPickerSelect
                onValueChange={(value) => updateFormData('request_type', value)}
                items={
                  enums?.requestType
                    ? Object.values(enums.requestType).map((val) => ({
                      label: t(`enums:requestType.${val}`),
                      value: val,
                    }))
                    : [
                      { label: 'In Person', value: '0' },
                      { label: 'Remote', value: '1' },
                    ]
                }
                value={formData.request_type}
                style={{
                  inputIOS: pickerSelectStyles.inputIOS,
                  inputAndroid: pickerSelectStyles.inputAndroid,
                }}
              />
            </View>

            {/* Location input for In Person requests */}
            {formData.request_type === "INPERSON" && (
              <View style={styles.field}>
                <Text style={styles.label}>Location</Text>
                <GooglePlacesAutocomplete
                  placeholder='Search'
                  onPress={(data, details = null) => {
                    console.log(data, details);
                    updateFormData('location', details?.description || data.description);
                  }}
                  onFail={(error) => {
                    console.log('Google Place API Error:', error);
                  }}
                  query={{
                    key: '',
                    // key: process.env.GOOGLE_API_KEY,
                    language: 'en',
                  }}
                  styles={{
                    textInput: pickerSelectStyles.inputAndroid,
                  }}
                  disableScroll={true}
                />
              </View>
            )}

          </Tab>
        </Tabs>

        
        <View style={styles.buttonContainer}>
          <Button backgroundColor="red" onPress={isEdit ? onClose : handleCancel}>
            Cancel
          </Button>
          <Button backgroundColor="blue" onPress={handleSubmit} loading={loading}>
            Submit
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f6',
  },
  container: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  alertBox: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  alertText: {
    color: '#92400e',
    fontSize: 14,
  },
  alertTextBold: {
    fontWeight: 'bold',
    color: '#92400e',
    fontSize: 14,
  },
  personInfoSection: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  field: {
    marginBottom: 16,
  },
  rowField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9fafb',
    color: '#374151',
    fontSize: 16,
  },
  textArea: {
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    backgroundColor: '#f9fafb',
    color: '#374151',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    color: '#374151',
    paddingRight: 30,
    backgroundColor: '#f9fafb',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    color: '#374151',
    paddingRight: 30,
    backgroundColor: '#f9fafb',
  },
});