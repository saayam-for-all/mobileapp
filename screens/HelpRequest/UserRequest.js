import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Alert, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button';
import Input from '../../components/Input';
import api from '../../services/api';
import languagesData from '../../i18n/languagesData';
import * as DocumentPicker from 'expo-document-picker';
import Icon from 'react-native-vector-icons/Feather';
import AudioRecorder from '../../components/AudioRecorder';
import DynamicAdditionalFields from './Categories/DynamicAdditionalFields';

import useAuthUser from '../../hooks/useAuthUser';
import LocationSearchModal from '../../components/LocationSearchModal';

import { createRequest, getCategories, getEnums, predictCategories, checkProfanity } from '../../services/requestServices';
import { Tab, Tabs } from '../../components/Tabs';
import { colors, borderRadius } from '../../styles/theme';

const genderOptions = [
  { label: 'Select', value: 'Select' },
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
  { label: 'Prefer not to say', value: 'Prefer not to say' },
];

// Build language options from languagesData.js
const languageOptions = languagesData.map((lang) => ({
  value: lang.name === "Mandarin Chinese" ? "Chinese" : lang.name,
  label: lang.name,
}));

export default function UserRequest({ isEdit = false, onClose, requestItem = {} }) {
  const { t, i18n } = useTranslation(["common", "categories"]);
  const [loading, setLoading] = useState(false);
  const authUser = useAuthUser();

  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
              {
                headers: {
                  'Accept-Language': 'en',
                  'User-Agent': 'SaayamForAll/1.0',
                },
              },
            );
            const data = await response.json();
            if (data.display_name) {
              updateFormData('location', data.display_name);
            }
          } catch (error) {
            console.error('Location error:', error);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
      );
    }
  };

  const [formData, setFormData] = useState({
    requestForId: 0,
    isCalamity: false,
    requestPriorityId: 1,
    requestCategory: isEdit && requestItem?.category ? requestItem.category : '0.0.0.0.0',
    requestSubCategory: '',
    requestTypeId: 1,
    location: '',
    requestSubject: isEdit && requestItem?.subject ? requestItem.subject : '',
    requestDescription: isEdit && requestItem?.description ? requestItem.description : '',
  });

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
  // Dynamic form for categories
  // Dynamic additional fields state
  const [additionalFieldValues, setAdditionalFieldValues] = useState({});

  const [enums, setEnums] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const navigation = useNavigation();

  // Controls whether the AudioRecorder modal should start recording
  const [isRecorderVisible, setIsRecorderVisible] = useState(false);

  // Single source of truth for the description box content (typed + voice combined)
  const [description, setDescription] = useState(
    isEdit && requestItem?.description ? requestItem.description : ''
  );

  // Keep formData.requestDescription in sync whenever description changes
  const updateDescription = (text) => {
    // Enforce 500 char limit on the combined string
    const capped = text.slice(0, 500);
    setDescription(capped);
    updateFormData('requestDescription', capped);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updatePersonInfo = (field, value) => {
    setOtherPersonInfo(prev => ({ ...prev, [field]: value }));
  };

  const isSelfRequest = () => formData.requestForId === 0;

  // Character count reflects everything visible in the box (typed + transcript)
  const descriptionLength = description.length;

  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories();
      if (categoriesData?.length) {
        const filteredCategories = {};
        for (const cat of categoriesData) {
          if (
            cat.catName &&
            cat.catName !== "cat_name" &&
            cat.catId !== "cat_id" &&
            cat.catId !== "﻿cat_id" &&
            !cat.catName.toLowerCase().includes("cat_name") &&
            !cat.catId.toLowerCase().includes("cat_id")
          ) {
            filteredCategories[cat.catId] = cat;
          }
        }
        console.log("Categories: ", filteredCategories);
        setCategories(filteredCategories);
      } else {
        throw new Error('No categories found');
      }
    } catch (err) {
      console.error('Error getting categories: ', err);
    }
  };

  const submit = async () => {
    if (!authUser?.attributes?.userDbId) {
      Alert.alert('Error', 'User not authenticated properly. Please log in again.');
      return;
    }
    const categoryId = formData.requestSubCategory || formData.requestCategory;
    const requestBody = {
      requesterId: authUser?.attributes?.userDbId,
      requestSubject: formData.requestSubject,
      requestDescription: formData.requestDescription,
      isCalamity: Boolean(formData.isCalamity),
      isLeadVolunteer: 1,
      requestPriority: { requestPriorityId: formData.requestPriorityId },
      requestType: { requestTypeId: formData.requestTypeId },
      requestFor: { requestForId: formData.requestForId },
      helpCategory: {
        catId: (categoryId === 'General' || categoryId === 'GENERAL_CATEGORY')
          ? '0.0.0.0.0'
          : categoryId,
      },
      additionalFields: additionalFieldValues,
    };

    if (!isSelfRequest()) {
      requestBody.guestDetails = {
        reqFname: otherPersonInfo.firstName,
        reqLname: otherPersonInfo.lastName,
        reqEmail: otherPersonInfo.email,
        reqPhone: otherPersonInfo.phone,
        reqAge: otherPersonInfo.age ? Number(otherPersonInfo.age) : null,
        reqGender: otherPersonInfo.gender || null,
        reqPrefLang: otherPersonInfo.preferredLanguage || null,
      };
    }

    if (formData.requestTypeId === 0 && formData.location) {
      requestBody.requestLocation = formData.location;
    }

    console.log('Submitting:', requestBody);
    const response = await createRequest(requestBody);
    console.log('Response:', response.data);

    Alert.alert(
      'Dear User',
      'Help Request Created Successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            if (isEdit) onClose();
            else navigation.navigate('Home');
          },
        },
      ]
    );
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      // FIX: expo-document-picker v10+ no longer uses result.type === "success"
      if (!result.canceled && result.assets?.length) {
        const file = result.assets[0];
        setAttachedFile(file);
        Alert.alert("File Attached", file.name);
      }
    } catch (err) {
      console.log("File picker error:", err);
    }
  };

  const handleSubmit = async () => {
    if (!formData.requestSubject) {
      Alert.alert('Validation Error', 'Subject is required. Please fill out the Description tab.');
      return;
    }
    if (!formData.requestDescription) {
      Alert.alert('Validation Error', 'Description is required. Please fill out the Description tab.');
      return;
    }
    if (!isSelfRequest()) {
      const { firstName, lastName, email } = otherPersonInfo;
      if (!firstName || !lastName || !email) {
        Alert.alert('Validation Error', 'First Name, Last Name, and Email are required for the person you are submitting for!');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Validation Error', 'Please enter a valid email address!');
        return;
      }
    }

    setLoading(true);
    try {
      const profanityResponse = await checkProfanity(
        { subject: formData.requestSubject, description: formData.requestDescription }
      );
      if (profanityResponse?.contains_profanity) {
        Alert.alert(
          'Dear User',
          'The system detects profanity in your help request, please edit your request.\nTrigger words: ' + profanityResponse.profanity,
          [{ text: 'OK', onPress: () => setLoading(false) }]
        );
        return;
      }

      if (!formData.requestCategory || formData.requestCategory === '0.0.0.0.0') {

        const formatApiCategoryName = (name) =>
          name
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

        const defaultCategories = ["Health", "Education", "Electronics", "General"];
        let response = await predictCategories(
          { subject: formData.requestSubject, description: formData.requestDescription }
        );
        const rawCategories = response?.body?.categories ?? [];
        const formattedCategories = rawCategories.map((cat) => ({
          id: cat.category_name,
          name: cat.category_name,
          category_number: cat.category_number,
          displayName: formatApiCategoryName(cat.category_name),
          hierarchy: cat.hierarchy,
          confidence: cat.confidence,
        }));

        const suggestedCategories = [
          { id: "general", name: "General", displayName: "General", category_number: "0.0.0.0.0" },
          ...formattedCategories,
        ];

        const alertCategories = suggestedCategories.map((category) => ({
          text: category.displayName,
          onPress: async () => {
            try {
              if (category.id === "general") {
                formData.requestCategory = category.category_number;
              } else {
                formData.requestSubCategory = category.category_number;
              }
              await submit();
            } catch (error) {
              console.error('Error submitting request with category:', error);
              Alert.alert('Error', 'Failed to submit request. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        }));

        Alert.alert(
          'Dear User',
          'Please fill in categories or select one of the recommended categories',
          [...alertCategories]
        );
      } else {
        await submit();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error during submit user request:', error);
    }
  };

  const handleCancel = () => {
    Alert.alert('Are you sure?', 'Do you really want to cancel the request?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => navigation.navigate('Home') },
    ]);
  };

  useEffect(() => {
    if (Object.keys(categories).length === 0) fetchCategories();
  }, [categories]);

  useEffect(() => {
    const fetchEnumsData = async () => {
      try {
        const data = await getEnums();
        setEnums(data);
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

  useEffect(() => {
    if (formData.requestTypeId === 0 && !formData.location) {
      getUserLocation();
    }
  }, [formData.requestTypeId]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{isEdit ? 'Edit Help Request' : 'Create Help Request'}</Text>

        <View style={styles.alertBox}>
          <Text style={styles.alertTextBold}>
            Note: We do not handle life-threatening emergency requests. Please call your local emergency service if you need urgent help.
          </Text>
        </View>

        {/*
          AudioRecorder lives here — at the top level of the component tree,
          NOT nested inside a <Text> node. This prevents Android layout crashes.
        */}
        <AudioRecorder
          startTrigger={isRecorderVisible}
          onStop={({ uri, transcript }) => {
            if (transcript) {
              // FIX: merge transcript into the single description state directly.
              // This prevents double-appending and keeps the counter accurate.
              const updated = description
                ? description + ' ' + transcript
                : transcript;
              updateDescription(updated);
            }
            setIsRecorderVisible(false);
          }}
        />

        <Tabs>
          <Tab label="Description">
            <View style={styles.field}>
              <Text style={styles.label}>Request Category</Text>
              <RNPickerSelect
                onValueChange={(value) => updateFormData('requestCategory', value)}
                items={Object.keys(categories).map((id) => ({
                  label: t(`categories:REQUEST_CATEGORIES.${categories[id].catName}.LABEL`),
                  value: id,
                }))}
                value={formData.requestCategory}
                style={{
                  inputIOS: pickerSelectStyles.inputIOS,
                  inputIOSContainer: pickerSelectStyles.inputIOSContainer,
                  inputAndroid: pickerSelectStyles.inputAndroid,
                }}
              />
            </View>

            {subCategories.length > 0 && (
              <View style={styles.field}>
                <Text style={styles.label}>Subcategory</Text>
                <RNPickerSelect
                  onValueChange={(value) => updateFormData('requestSubCategory', value)}
                  items={subCategories.map((subCat) => ({
                    label: t(`categories:REQUEST_CATEGORIES.${categories[formData.requestCategory].catName}.SUBCATEGORIES.${subCat.catName}.LABEL`),
                    value: subCat.catId,
                  }))}
                  value={formData.requestSubCategory}
                  style={{
                    inputIOS: pickerSelectStyles.inputIOS,
                    inputIOSContainer: pickerSelectStyles.inputIOSContainer,
                    inputAndroid: pickerSelectStyles.inputAndroid,
                  }}
                />
              </View>
            )}
            {/* Dynamic additional fields from metadata */}
            <DynamicAdditionalFields
              catId={formData.requestSubCategory}
              onChange={setAdditionalFieldValues}
            />

            <View style={styles.field}>
              <Text style={styles.label}>
                Subject <Text style={{ color: 'red' }}>*</Text> (Max 70 characters)
              </Text>
              <Input
                style={styles.input}
                maxLength={70}
                placeholder="Enter subject..."
                value={formData.requestSubject}
                onChangeText={(text) => updateFormData('requestSubject', text)}
              />
            </View>

            <View style={styles.field}>
              {/* Label row: title + attachment icon + mic icon */}
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  Description <Text style={{ color: 'red' }}>*</Text> (Max 500 characters)
                </Text>
                <View style={styles.labelIcons}>
                  <TouchableOpacity onPress={handleFilePick} style={styles.iconButton}>
                    <Icon name="paperclip" size={18} color={colors.text} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsRecorderVisible(true)}
                    style={styles.iconButton}
                  >
                    <Icon
                      name="mic"
                      size={18}
                      color={isRecorderVisible ? colors.error : colors.text}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.textAreaWrapper}>

                {/* COUNTER — reflects all characters in the box (typed + transcript) */}
                <Text style={[
                  styles.charCounterInside,
                  descriptionLength >= 500 && { color: colors.error },
                ]}>
                  {descriptionLength} / 500
                </Text>

                <Input
                  style={[styles.textArea, { minHeight: 100, paddingTop: 30 }]}
                  multiline
                  scrollEnabled={true}
                  maxLength={500}
                  placeholder="Describe your request..."
                  // FIX: drive value directly from description (single source of truth)
                  value={description}
                  onChangeText={(text) => updateDescription(text)}
                />
              </View>

              {attachedFile && (
                <Text style={styles.attachedFileText}>
                  📎 {attachedFile.name}
                </Text>
              )}
            </View>
          </Tab>

          <Tab label="Details">
            <View style={styles.field}>
              <Text style={styles.label}>For Self</Text>
              <RNPickerSelect
                onValueChange={(value) => updateFormData('requestForId', parseInt(value))}
                items={
                  enums?.requestFor
                    ? Object.entries(enums.requestFor).map(([id, val]) => ({
                      label: t(`enums:requestFor.${val}`),
                      value: id,
                    }))
                    : [
                      { label: 'Self', value: '0' },
                      { label: 'Other', value: '1' },
                    ]
                }
                value={String(formData.requestForId)}
                style={{
                  inputIOS: pickerSelectStyles.inputIOS,
                  inputIOSContainer: pickerSelectStyles.inputIOSContainer,
                  inputAndroid: pickerSelectStyles.inputAndroid,
                }}
              />
            </View>

            {!isSelfRequest() && (
              <View style={styles.personInfoSection}>
                <Text style={styles.sectionTitle}>Person Details</Text>
                <Text style={styles.sectionSubtitle}>
                  Please fill the details of the person you are submitting the request for.
                </Text>

                <View style={styles.field}>
                  <Text style={styles.label}>First Name <Text style={{ color: 'red' }}>*</Text></Text>
                  <Input
                    style={styles.input}
                    placeholder="Enter first name..."
                    value={otherPersonInfo.firstName}
                    onChangeText={(text) => updatePersonInfo('firstName', text)}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Last Name <Text style={{ color: 'red' }}>*</Text></Text>
                  <Input
                    style={styles.input}
                    placeholder="Enter last name..."
                    value={otherPersonInfo.lastName}
                    onChangeText={(text) => updatePersonInfo('lastName', text)}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Email <Text style={{ color: 'red' }}>*</Text></Text>
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
                      inputIOSContainer: pickerSelectStyles.inputIOSContainer,
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
                      inputIOSContainer: pickerSelectStyles.inputIOSContainer,
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
                onValueChange={(value) => updateFormData('requestPriorityId', parseInt(value))}
                items={
                  enums?.requestPriority
                    ? Object.entries(enums.requestPriority).map(([id, val]) => ({
                      label: t(`enums:requestPriority.${val}`),
                      value: id,
                    }))
                    : [
                      { label: 'LOW', value: '0' },
                      { label: 'MEDIUM', value: '1' },
                      { label: 'HIGH', value: '2' },
                      { label: 'CRITICAL', value: '3' },
                    ]
                }
                value={String(formData.requestPriorityId)}
                style={{
                  inputIOS: pickerSelectStyles.inputIOS,
                  inputIOSContainer: pickerSelectStyles.inputIOSContainer,
                  inputAndroid: pickerSelectStyles.inputAndroid,
                }}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Request Type</Text>
              <RNPickerSelect
                onValueChange={(value) => updateFormData('requestTypeId', parseInt(value))}
                items={
                  enums?.requestType
                    ? Object.entries(enums.requestType).map(([id, val]) => ({
                      label: t(`enums:requestType.${val}`),
                      value: id,
                    }))
                    : [
                      { label: 'In Person', value: '0' },
                      { label: 'Remote', value: '1' },
                    ]
                }
                value={String(formData.requestTypeId)}
                style={{
                  inputIOS: pickerSelectStyles.inputIOS,
                  inputIOSContainer: pickerSelectStyles.inputIOSContainer,
                  inputAndroid: pickerSelectStyles.inputAndroid,
                }}
              />
            </View>

            {formData.requestTypeId === 0 && (
              <View style={styles.field}>
                <Text style={styles.label}>Location</Text>
                <TouchableOpacity
                  style={styles.locationInput}
                  onPress={() => setIsLocationModalVisible(true)}
                >
                  <Text
                    style={
                      formData.location ? styles.locationText : styles.locationPlaceholder
                    }
                    numberOfLines={1}
                  >
                    {formData.location || 'Search for location...'}
                  </Text>
                </TouchableOpacity>
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

      <LocationSearchModal
        visible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
        onSelectLocation={(displayName) => updateFormData('location', displayName)}
        initialValue={formData.location}
      />
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
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 8,
    shadowColor: colors.black,
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    padding: 4,
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
    color: colors.text,
  },
  input: {
    borderColor: colors.borderLight,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
  },
  textArea: {
    borderColor: colors.borderLight,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
    textAlign: Platform.OS === 'ios' ? 'justify' : 'left',
  },
  attachedFileText: {
    marginTop: 6,
    fontSize: 13,
    color: colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  textAreaWrapper: {
    position: 'relative',
  },
  charCounterInside: {
    position: 'absolute',
    top: 8,
    right: 12,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    zIndex: 10,
  },
  locationInput: {
    borderColor: colors.borderLight,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 16,
    color: colors.text,
  },
  locationPlaceholder: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 8,
    color: colors.text,
    paddingRight: 30,
    backgroundColor: colors.surface,
  },
  inputIOSContainer: {
    zIndex: 100,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 8,
    color: colors.text,
    paddingRight: 30,
    backgroundColor: colors.surface,
  },
});