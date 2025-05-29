import React, { useState, useEffect } from 'react';
import { View, CustomButton,IconButton,Button, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Checkbox } from 'react-native-paper';
import { Dimensions } from 'react-native';
// import api from '../../components/api';

export default function Availability() {
  const [timeSlots, setTimeSlots] = useState([{ day: '', startTime: '', endTime: '' }]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const navigation = useNavigation();
  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get('window').width;

  const dayOptions = [
    { label: 'Everyday', value: 'Everyday' },
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
    { label: 'Sunday', value: 'Sunday' },
  ];

  const generateTimeOptions = () => {
    const options = [];
    const periods = ['AM', 'PM'];
  
    for (let period of periods) {
      for (let hour = 1; hour <= 12; hour++) {
        for (let minute of [0, 30]) {
          const hourString = hour.toString().padStart(2, '0');
          const minuteString = minute.toString().padStart(2, '0');
          const timeString = `${hourString}:${minuteString} ${period}`;
          options.push({ label: timeString, value: timeString });
        }
      }
    }
  
    return options;
  };
  
  const timeOptions = generateTimeOptions();
  
  const isTimeSlotValid = (slot) => {
    return slot.day && slot.startTime && slot.endTime;
  };

  const isValidTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return false;
    
    const parseTime = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      hours = parseInt(hours);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return hours * 60 + parseInt(minutes);
    };

    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);
    
    return endMinutes > startMinutes;
  };
  
  const addTimeSlot = () => {
    const lastSlot = timeSlots[timeSlots.length - 1];
    
    if (!isTimeSlotValid(lastSlot)) {
      alert('Please complete the current time slot before adding a new one.');
      return;
    }
    
    if (!isValidTimeRange(lastSlot.startTime, lastSlot.endTime)) {
      alert('End time must be after start time.');
      return;
    }
    
    setTimeSlots([...timeSlots, { day: '', startTime: '', endTime: '' }]);
  };

  const removeTimeSlot = (index) => {
    const newTimeSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(newTimeSlots);
  };

  const updateTimeSlot = (index, field, value) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index][field] = value;
    setTimeSlots(newTimeSlots);
  };

  // Function to fetch availability from the API
  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await api.get('/volunteers/availability'); // Make the API call
      const availabilityData = response.data; // Assuming the data is in response.data

      // If the API returns availability in a format that can directly populate timeSlots
      setTimeSlots(availabilityData.timeSlots || []); // Adjust according to the API response structure
      setChecked(availabilityData.notificationsEnabled || false); // Set notification preference if available
    } catch (error) {
      console.error('Error fetching availability:', error);
      // Handle error appropriately (e.g., show a message to the user)
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // fetchAvailability(); // Call the function on component mount
  }, []);

  const CustomButton = ({ title, onPress, style, textStyle }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
    <Text style={styles.title}>Please Provide Your Available Time Slots for Volunteering</Text>
    {timeSlots.map((slot, index) => (
            <View key={index} style={styles.row}>
              <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => updateTimeSlot(index, 'day', value)}
                items={dayOptions}
                style={pickerSelectStyles}
                value={slot.day}
                useNativeAndroidPickerStyle={false}
                placeholder={{ label: 'Select Day', value: null }}
              />
              </View>
              <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => updateTimeSlot(index, 'startTime', value)}
                items={timeOptions}
                style={pickerSelectStyles}
                value={slot.startTime}
                useNativeAndroidPickerStyle={false}
                placeholder={{ label: 'Start Time', value: null }}
              />
              </View>
              <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => updateTimeSlot(index, 'endTime', value)}
                items={timeOptions}
                style={pickerSelectStyles}
                value={slot.endTime}
                useNativeAndroidPickerStyle={false}
                placeholder={{ label: 'End Time', value: null }}
              />
              </View>
              {/* {index > 0 && (
                <TouchableOpacity style={styles.removeButton} onPress={() => removeTimeSlot(index)}>
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              )} */}
              <TouchableOpacity onPress={() => removeTimeSlot(index)}>
                  <AntDesign name={'closecircleo'} style={styles.removeButtonImage} />
                </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addTimeSlot}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
          <View style={styles.notificationContainer}>
            <Checkbox.Android
              status={checked ? 'checked' : 'unchecked'}
              color='green'
              onPress={() => {
                setChecked(!checked);
              }}
            />
            <Text style={styles.notificationText}>
              Would you like to receive notifications in case of emergencies or critical situations?
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            {/* <CustomButton 
              title="BACK" 
              onPress={() => navigation.navigate('Home')} 
              style={styles.backButton}
              textStyle={styles.backButtonText}
            /> */}
            <CustomButton 
              title="CONFIRM" 
              onPress={() => console.log('Confirm pressed')} 
              style={styles.confirmButton}
              textStyle={styles.confirmButtonText}
            />
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
      padding: 12,
      backgroundColor: '#fff',
      margin: 12,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pickerContainer: {
    marginRight: 5,
    width: 90,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap', // Allow wrapping if needed
  },
  timeButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 10,
  },
  removeButton: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#ff4444',
    borderWidth: 1,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#ff4444',
    fontSize: 8,
  },
  removeButtonImage: {
    color: 'red',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: 'black',
  },
  notificationText: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  button: {
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white'
  },
  backButton: {
    backgroundColor: 'transparent',
    borderColor: '#B0B0B0',
    borderWidth: 1,
  },
  backButtonText: {
    color: '#B0B0B0',
  },
  confirmButton: {
    backgroundColor: '#007BFF',
  },
  iconButton: {
    backgroundColor: 'white',
    borderColor: 'blue',
    borderWidth: 2,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  });

  const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    width: '100%',
    textAlign: 'center',
    overflow: 'hidden',
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    width: '100%',
    textAlign: 'center'
  },
});