import React, { useState } from 'react';
import { View, Text, Switch, Alert, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import Button from '../components/Button';
import Input from '../components/Input';

export default function UserRequest() {
  const [forSelf, setForSelf] = useState('Yes');
  const [isCalamity, setIsCalamity] = useState(false);
  const [priority, setPriority] = useState('Low');
  const [requestCategory, setRequestCategory] = useState('Health');
  const [requestType, setRequestType] = useState('In Person');
  const [subject, setSubject] = useState(''); 
  const [description, setDescription] = useState('');
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
        <Text style={styles.title}>Create Help Request</Text>
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
          <Button backgroundColor="red" onPress={handleCancel}>
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