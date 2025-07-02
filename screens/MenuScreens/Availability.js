import React, { useState, useEffect } from 'react';
import { View, CustomButton,AntDesignButton,Button, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimezonePicker from '../../components/TimeZonePicker';
// import api from '../../components/api';

export default function Availability() {
  const [timeSlots, setTimeSlots] = useState([{ day: '', startTime: '', endTime: '' }]);
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [vacationMode, setVacationMode] = useState(true);
  const navigation = useNavigation();

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
    if (timeSlots.length) {
        const lastSlot = timeSlots[timeSlots.length - 1];
        if (!isTimeSlotValid(lastSlot)) {
        alert('Please complete the current time slot before adding a new one.');
        return;
        }
        
        if (!isValidTimeRange(lastSlot.startTime, lastSlot.endTime)) {
        alert('End time must be after start time.');
        return;
        }
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
      const response = await api.get('/volunteers/availability'); // Make the API call
      const availabilityData = response.data; // Assuming the data is in response.data

      // If the API returns availability in a format that can directly populate timeSlots
      setTimeSlots(availabilityData.timeSlots || []); // Adjust according to the API response structure
      setChecked(availabilityData.notificationsEnabled || false); // Set notification preference if available
    } catch (error) {
      console.error('Error fetching availability:', error);
      // Handle error appropriately (e.g., show a message to the user)
    }
  };
  const fetchAvailabilityFromLocal = async () => {
    const availabilityData = await AsyncStorage.getItem("availabilityData");
    const savedAvailability = JSON.parse(
        availabilityData || "null",
      );
      if (savedAvailability) {
        setTimeSlots(savedAvailability.slots || []);
        setVacationMode(savedAvailability.vacationMode || false);
        setStartDate(new Date(savedAvailability.startDate) || new Date());
        setEndDate(new Date(savedAvailability.endDate) || new Date());
        setSelectedTimezone(savedAvailability.selectedTimezone || "UTC");
      }
  }

  const validateTimeSlots = () => {
    if (timeSlots.length == 0) {
        return { isValid: false, message: "Availability validation fail, please fill in at least one available time" };
    }
    for (const slot of timeSlots) {
      if (!slot.day || !slot.startTime || !slot.endTime) {
        return { isValid: false, message: "Availability validation fail, please fill in all required fields" };
      }
      // TODO: check whether end is later than start
      if (slot.startTime === slot.endTime) {
        return {
          isValid: false,
          message: "Start time and end time should be different",
        };
      }
    }
    return { isValid: true };
  };
  // Handle submit
  const handleSaveClick = async () => {
    try {
      const slotsValidation = validateTimeSlots();
      if (!slotsValidation.isValid) {
        alert(slotsValidation.message);
        return;
      }

      const availabilityData = {
        slots: timeSlots,
        vacationMode,
        startDate,
        endDate,
        selectedTimezone,
        lastUpdated: new Date().toISOString(),
      };

      await AsyncStorage.setItem(
        "availabilityData",
        JSON.stringify(availabilityData),
      );

      Alert.alert(
        'Success', 
        'Time zone: ' + selectedTimezone + ', \n' + 'Time slots: \n' + timeSlots.reduce((acc,curr)=>{
            return acc + '  ' + curr.day + ': ' + curr.startTime + ' to ' + curr.endTime + '\n'
        },''), 
        [
            {
                text: 'Back', 
                onPress: ()=>{navigation.navigate('Profile');}
            },
            {
                text: 'Edit More',
                onPress: ()=>{}
            }
        ]
      );
      // TODO: Replace with actual API call when backend is ready
      // await updateUserAvailability(availabilityData);

    } catch (error) {
      console.error("Error saving availability:", error);
      Alert.alert('Error Saving Availability', error, [{text: 'Ok', onPress: ()=>{}}]);
    }
  };


  
  useEffect(() => {
    // TODO after backend setup
    // fetchAvailability(); // Call the function on component mount
    fetchAvailabilityFromLocal();
  
  }, []);

  const CustomButton = ({ title, onPress, style, textStyle }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
    <Text style={styles.title}>Timezone</Text>
    <TimezonePicker 
        selectedTimezone={selectedTimezone}
        setSelectedTimezone={setSelectedTimezone}
    />
    <VacationMode
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        vacationMode={vacationMode}
        setVacationMode={setVacationMode}
    />
    <Text style={styles.title}>Your Available Time Slots</Text>
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
          <View style={styles.buttonContainer}>
            {/* <CustomButton 
              title="BACK" 
              onPress={() => navigation.navigate('Home')} 
              style={styles.backButton}
              textStyle={styles.backButtonText}
            /> */}
            <CustomButton 
              title="CONFIRM" 
              onPress={handleSaveClick} 
              style={styles.confirmButton}
              textStyle={styles.confirmButtonText}
            />
          </View>
    </View>
    </ScrollView>
  ); 
}

const VacationMode = ({startDate, setStartDate, endDate, setEndDate, vacationMode, setVacationMode}) => {
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
  
    // Format date to MM/DD/YYYY
    const formatDate = (date) => {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    };
  
    // Handle start date change
    const handleStartDateChange = (event, selectedDate) => {
      const date = selectedDate || startDate;
      setShowStartPicker();
      setStartDate(date);
      
      // Ensure end date is not before start date
      if (date > endDate) {
        setEndDate(date);
      }
    };
  
    // Handle end date change
    const handleEndDateChange = (event, selectedDate) => {
      const date = selectedDate || endDate;
      setShowEndPicker();
      setEndDate(date);
      
      // Ensure end date is not before start date
      if (date < startDate) {
        setStartDate(date);
      }
    };
  
    // Show start date picker
    const showStartDatePicker = () => {
      setShowStartPicker(true);
    };
  
    // Show end date picker
    const showEndDatePicker = () => {
      setShowEndPicker(true);
    };
  
    return (
      <View style={vacationStyles.container}>
        {/* Vacation Mode Toggle */}
        <TouchableOpacity 
          style={vacationStyles.vacationModeContainer}
          onPress={() => setVacationMode(!vacationMode)}
        >
          <View style={[vacationStyles.checkbox, vacationMode && vacationStyles.checkedBox]}>
            {vacationMode && <AntDesign name="check" size={18} color="#fff" />}
          </View>
          <Text style={vacationStyles.vacationModeLabel}>Vacation Mode</Text>
        </TouchableOpacity>
  
        {/* Description */}
        <Text style={vacationStyles.descriptionText}>Vacation Mode Description</Text>
  
        {/* Date Inputs Container */}
        {vacationMode &&
        <View style={vacationStyles.datePickerContainer}>
            <View style={vacationStyles.dateContainer}>
            {/* Start Date */}
            <View style={vacationStyles.dateSection}>
                <Text style={vacationStyles.dateLabel}>Start Date</Text>
                <TouchableOpacity 
                style={vacationStyles.dateInput}
                onPress={showStartDatePicker}
                >
                <Text style={vacationStyles.dateText}>{formatDate(startDate)}</Text>
                <AntDesign name="calendar" size={20} color="#666" />
                </TouchableOpacity>
            </View>
    
            {/* End Date */}
            <View style={vacationStyles.dateSection}>
                <Text style={vacationStyles.dateLabel}>End Date</Text>
                <TouchableOpacity 
                style={vacationStyles.dateInput}
                onPress={showEndDatePicker}
                >
                <Text style={vacationStyles.dateText}>{formatDate(endDate)}</Text>
                <AntDesign name="calendar" size={20} color="#666" />
                </TouchableOpacity>
            </View>
            </View>
    
            {/* Date Pickers */}
            {showStartPicker && (
            <DateTimePicker
                testID="startDateTimePicker"
                value={startDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={handleStartDateChange}
                minimumDate={new Date()}
            />
            )}
    
            {showEndPicker && (
            <DateTimePicker
                testID="endDateTimePicker"
                value={endDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={handleEndDateChange}
                minimumDate={new Date()}
            />
            )}
        </View>
        }
      </View>
    );
  };

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
    marginVertical: 10,
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

const vacationStyles = StyleSheet.create({
    container: {
        marginVertical: 10
    },
    
    // Vacation Mode Toggle Styles
    vacationModeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: '#ddd',
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      backgroundColor: '#fff',
    },
    checkedBox: {
      backgroundColor: '#4285f4',
      borderColor: '#4285f4',
    },
    vacationModeLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
    },
    
    // Description Styles
    descriptionText: {
      fontSize: 14,
      color: '#888',
      marginLeft: 30, // Align with checkbox text
    },
    
    datePickerContainer: {
        marginVertical: 5,
        marginLeft: 30,
    },
    // Date Container Styles
    dateContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 15,
    },
    dateSection: {
      flex: 1,
    },
    dateLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#666',
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    dateInput: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 10,
      minHeight: 40,
    },
    dateText: {
      fontSize: 16,
      color: '#333',
      flex: 1,
    },
  });