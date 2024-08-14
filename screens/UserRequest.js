/*import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import { Picker as SelectPicker } from '@react-native-picker/picker';

export default function UserRequest() {
  const [forSelf, setForSelf] = useState('Yes');
  const [isCalamity, setIsCalamity] = useState(false);
  const [priority, setPriority] = useState('Low');
  const [requestCategory, setRequestCategory] = useState('Health');
  const [requestType, setRequestType] = useState('In Person');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      forSelf,
      isCalamity,
      priority,
      requestCategory,
      requestType,
      description,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Help Request</Text>
        <Text style={styles.noteText}>
          Note: Please call your local emergency number for life-threatening emergencies.
        </Text>
        <View style={styles.field}>
          <Text style={styles.label}>For Self</Text>
          <SelectPicker
            selectedValue={forSelf}
            onValueChange={(itemValue) => setForSelf(itemValue)}
            style={styles.picker}
          >
            <SelectPicker.Item label="Yes" value="Yes" />
            <SelectPicker.Item label="No" value="No" />
          </SelectPicker>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Is Calamity?</Text>
          <Switch
            value={isCalamity}
            onValueChange={(value) => setIsCalamity(value)}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Priority</Text>
          <SelectPicker
            selectedValue={priority}
            onValueChange={(itemValue) => setPriority(itemValue)}
            style={styles.picker}
          >
            <SelectPicker.Item label="Low" value="Low" />
            <SelectPicker.Item label="Medium" value="Medium" />
            <SelectPicker.Item label="High" value="High" />
          </SelectPicker>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Request Category</Text>
          <SelectPicker
            selectedValue={requestCategory}
            onValueChange={(itemValue) => setRequestCategory(itemValue)}
            style={styles.picker}
          >
            <SelectPicker.Item label="Health" value="Health" />
            <SelectPicker.Item label="Safety" value="Safety" />
            <SelectPicker.Item label="Other" value="Other" />
          </SelectPicker>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Request Type</Text>
          <SelectPicker
            selectedValue={requestType}
            onValueChange={(itemValue) => setRequestType(itemValue)}
            style={styles.picker}
          >
            <SelectPicker.Item label="In Person" value="In Person" />
            <SelectPicker.Item label="Online" value="Online" />
          </SelectPicker>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <Input
            multiline
            numberOfLines={4}
            placeholder="Describe your request..."
            value={description}
            onChange={setDescription}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button backgroundColor="red" onPress={() => console.log('Cancel Pressed')}>
            Cancel
          </Button>
          <Button backgroundColor="blue" onPress={handleSubmit}>
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
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  noteText: {
    marginBottom: 20,
    color: 'gray',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  picker: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});*/

import React, { useState } from 'react';
import { View, Text, Switch, Alert, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import Input from '../components/Input';
import { Picker as SelectPicker } from '@react-native-picker/picker';

export default function UserRequest() {
  const [forSelf, setForSelf] = useState('Yes');
  const [isCalamity, setIsCalamity] = useState(false);
  const [priority, setPriority] = useState('Low');
  const [requestCategory, setRequestCategory] = useState('Health');
  const [requestType, setRequestType] = useState('In Person');
  const [description, setDescription] = useState('');
  const navigation = useNavigation();

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      forSelf,
      isCalamity,
      priority,
      requestCategory,
      requestType,
      description,
    });
  };

  const handleCancel = () => {
    Alert.alert(
      "Are you sure?",
      "Do you really want to cancel the request?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => navigation.navigate('Home'),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Help Request</Text>
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>
            <Text style={styles.alertTextBold}>Note:</Text> Please call your local emergency number for life-threatening emergencies.
          </Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>For Self</Text>
          <SelectPicker
            selectedValue={forSelf}
            onValueChange={(itemValue) => setForSelf(itemValue)}
            style={styles.picker}
          >
            <SelectPicker.Item label="Yes" value="Yes" />
            <SelectPicker.Item label="No" value="No" />
          </SelectPicker>
        </View>
        <View style={styles.rowField}>
          <Text style={styles.label}>Is Calamity?</Text>
          <Switch
            value={isCalamity}
            onValueChange={(value) => setIsCalamity(value)}
            style={styles.switch}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Priority</Text>
          <SelectPicker
            selectedValue={priority}
            onValueChange={(itemValue) => setPriority(itemValue)}
            style={styles.picker}
          >
            <SelectPicker.Item label="Low" value="Low" />
            <SelectPicker.Item label="Medium" value="Medium" />
            <SelectPicker.Item label="High" value="High" />
          </SelectPicker>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Request Category</Text>
          <SelectPicker
            selectedValue={requestCategory}
            onValueChange={(itemValue) => setRequestCategory(itemValue)}
            style={styles.picker}
          >
            <SelectPicker.Item label="Health" value="Health" />
            <SelectPicker.Item label="Education" value="Education" />
            <SelectPicker.Item label="Electronics" value="Electronics" />
            <SelectPicker.Item label="Logistics" value="Logistics" />
          </SelectPicker>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Request Type</Text>
          <SelectPicker
            selectedValue={requestType}
            onValueChange={(itemValue) => setRequestType(itemValue)}
            style={styles.picker}
          >
            <SelectPicker.Item label="In Person" value="In Person" />
            <SelectPicker.Item label="Remote" value="Remote" />
          </SelectPicker>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <Input
            style={styles.textArea}
            multiline
            numberOfLines={4}
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
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginRight: 8,
  },
  picker: {
    height: 50,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    color: '#374151',
    paddingHorizontal: 8,
  },
  switch: {
    marginLeft: 'auto',
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