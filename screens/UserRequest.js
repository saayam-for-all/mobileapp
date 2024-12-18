import React, { useState } from 'react';
import { View, Text, Switch, Alert, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Button from '../components/Button';
import Input from '../components/Input';

const sampleDescription = "We need volunteers for our upcoming Community Clean-Up Day on August \
15 from 9:00 AM to 1:00 PM at Cherry Creek Park. Tasks include picking \
up litter, sorting recyclables, and managing the registration table. \
We also need donations of trash bags, gloves, and refreshments.";

export default function UserRequest({isEdit = false, onClose, requestItem={}}) {
  const [forSelf, setForSelf] = useState('Yes');
  const [isCalamity, setIsCalamity] = useState(false);
  const [priority, setPriority] = useState(isEdit&&requestItem?.priority ? requestItem.priority : 'Low');
  const [requestCategory, setRequestCategory] = useState(isEdit&&requestItem?.category ? requestItem.category : 'Health');
  const [requestType, setRequestType] = useState('Remote');
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState((isEdit&&requestItem?.subject) ? requestItem.subject : ''); 
  const [description, setDescription] = useState(isEdit&&requestItem?.description ? requestItem.description : '');
  const navigation = useNavigation();


  const handleSubmit = () => {
    // Validate required fields
    if (!subject || !description) {
      Alert.alert('Validation Error', 'Both Subject and Description are required!');
      return;
    }

    // Proceed with form submission
    console.log({
      forSelf,
      isCalamity,
      priority,
      requestCategory,
      requestType,
      location,
      subject,
      description,
    });
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

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{isEdit ? 'Edit Help Request' : 'Create Help Request'}</Text>
        <View style={styles.alertBox}>
          <Text style={styles.alertTextBold}>
            Note: We do not handle life-threatening emergency requests. Please call your local emergency service if you need urgent help.
          </Text>
        </View>
        <View>
          <Text style={styles.label}>For Self</Text>
          <RNPickerSelect
            onValueChange={(value) => setForSelf(value)}
            items={[
              { label: 'Yes', value: 'Yes' },
              { label: 'No', value: 'No' },
            ]}
            value={forSelf}
            style={{
                  inputIOS: pickerSelectStyles.inputIOS,
                  inputAndroid: pickerSelectStyles.inputAndroid,
            }}
          />
        </View>
        <View style={styles.rowField}>
          <Text style={styles.label}>Is Calamity?</Text>
          <Switch
            value={isCalamity}
            onValueChange={(value) => setIsCalamity(value)}
            style={styles.switch}
          />
        </View>
        <View>
          <Text style={styles.label}>Priority</Text>
          <RNPickerSelect
            onValueChange={(value) => setPriority(value)}
            items={[
              { label: 'Low', value: 'Low' },
              { label: 'Medium', value: 'Medium' },
              { label: 'High', value: 'High' },
            ]}
            value={priority}
            style={{
                  inputIOS: pickerSelectStyles.inputIOS,
                  inputAndroid: pickerSelectStyles.inputAndroid,
            }}
          />
        </View>
        <View>
          <Text style={styles.label}>Request Category</Text>
          <RNPickerSelect
            onValueChange={(value) => setRequestCategory(value)}
            items={[
              { label: 'Health', value: 'Health' },
              { label: 'Education', value: 'Education' },
              { label: 'Electronics', value: 'Electronics' },
              { label: 'Logistics', value: 'Logistics' },
            ]}
            value={requestCategory}
            style={{
                  inputIOS: pickerSelectStyles.inputIOS,
                  inputAndroid: pickerSelectStyles.inputAndroid,
            }}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Request Type</Text>
          <RNPickerSelect
            onValueChange={(value) => setRequestType(value)}
            items={[
              { label: 'In Person', value: 'In Person' },
              { label: 'Remote', value: 'Remote' },
            ]}
            value={requestType}
            style={{
                  inputIOS: pickerSelectStyles.inputIOS,
                  inputAndroid: pickerSelectStyles.inputAndroid,
            }}
          />
        {/* GOOGLE MAP API KEY TO BE ADDED TO ENV */}
          {requestType === "In Person" && (
            <View className="mt-3">
              <Text style={styles.label}>Location</Text>
              <GooglePlacesAutocomplete
                placeholder='Search'
                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  // console.log(data, details);
                  setLocation(details.description);
                }}
                query={{
                  key: 'AIzaSyDv7--yEnq84ZN3l03y50O33M4S89Un4U0',
                  language: 'en',
                }}
                styles={{
                  textInput: pickerSelectStyles.inputAndroid,
                }}
                disableScroll={true}
              />
            </View>
          )}
        <View style={styles.field}>
          <Text style={styles.label}>
            Subject <Text style={{ color: 'red' }}>*</Text> (Max 70 characters)
          </Text>
          <Input
            style={styles.textArea}
            maxLength={70}
            placeholder="Enter subject..."
            value={subject}
            onChangeText={setSubject}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>
            Description <Text style={{ color: 'red' }}>*</Text> (Max 500 characters)
          </Text>
          <Input
            style={[styles.textArea, { minHeight: 100 }]}
            multiline
            numberOfLines={4}
            maxLength={500}
            placeholder="Describe your request..."
            value={description}
            onChangeText={setDescription}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button backgroundColor="red" onPress={isEdit ? onClose : handleCancel}>
            Cancel
          </Button>
          <Button backgroundColor="blue" onPress={handleSubmit}>
            Submit
          </Button>
        </View>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginRight: 8,
  },
  textArea: {
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    backgroundColor: '#f9fafb',
    color: '#374151',
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
    marginBottom: 16,

  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    color: '#374151',
    paddingRight: 30,
    backgroundColor: '#f9fafb',
    marginBottom: 16,
  },
});