import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity,Alert} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Checkbox } from 'react-native-paper';
import Auth from '@aws-amplify/auth';

const Preferences = () => {
    const [user, setUser] = useState(undefined);
    const defaultDefaultDashboardView = { 
        label: 'Default Dashboard View', 
        value: 'default' 
    }
    const [defaultDashboardView, setDefaultDashboardView] = useState(defaultDefaultDashboardView);
    const [firstLanguage, setFirstLanguage] = useState('');
    const [secondLanguage, setSecondLanguage] = useState('');
    const [thirdLanguage, setThirdLanguage] = useState('');
    const defaultEmailPreference = {
        label: 'Email Communication Preference', 
        value: 'default' 
    }
    const [emailPreference, setEmailPreference] = useState(defaultEmailPreference);
    const defaultPhonePreference = {
        label: 'Phone Communication Preference', 
        value: 'default' 
    }
    const [phonePreference, setPhonePreference] = useState(defaultPhonePreference);
    const [checked, setChecked] = React.useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    const navigation = useNavigation();

    useEffect(()=>{
        Auth.currentAuthenticatedUser().then((user)=>{
        setUser(user);
        });
    },[]);

    async function updatePreferences(user) {
        
    }

    const handleUpdatePreferences = async () => {

    };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Preferences</Text>
      
        <RNPickerSelect
            onValueChange={(value) => setDefaultDashboardView(value)}
            items={[
                { label: 'Super Admin Dashboard', value: 'Super Admin Dashboard' },
                { label: 'Admin Dashboard', value: 'Admin Dashboard' },
                { label: 'Steward Dashboard', value: 'Steward Dashboard' },
                { label: 'Volunteer Dashboard', value: 'Volunteer Dashboard' },
                { label: 'Beneficiary Dashboard', value: 'Beneficiary Dashboard' },
            ]}
            placeholder = {defaultDefaultDashboardView}
            value={defaultDashboardView}
            style={{
                    inputIOS: pickerSelectStyles.inputIOS,
                    inputAndroid: pickerSelectStyles.inputAndroid,
            }}
        />
      
        <TextInput
            style={styles.input}
            placeholder="First Language Preference"
            value={firstLanguage}
            onChangeText={setFirstLanguage}
        />
        
        <TextInput
            style={styles.input}
            placeholder="Second Language Preference"
            keyboardType="email-address"
            value={secondLanguage}
            onChangeText={setSecondLanguage}
        />

        <TextInput
            style={styles.input}
            placeholder="Third Language Preference"
            keyboardType="email-address"
            value={thirdLanguage}
            onChangeText={setThirdLanguage}
        />

        <RNPickerSelect
            onValueChange={(value) => setEmailPreference(value)}
            items={[
                { label: 'Primary Email', value: 'Primary Email' },
                { label: 'Secondary Email', value: 'Secondary Email' },
            ]}
            placeholder = {defaultEmailPreference}
            value={emailPreference}
            style={{
                    inputIOS: pickerSelectStyles.inputIOS,
                    inputAndroid: pickerSelectStyles.inputAndroid,
            }}
        />

        <RNPickerSelect
            onValueChange={(value) => setPhonePreference(value)}
            items={[
                { label: 'Primary Phone', value: 'Primary Phone' },
                { label: 'Secondary Phone', value: 'Secondary Phone' },
            ]}
            placeholder = {defaultPhonePreference}
            value={phonePreference}
            style={{
                    ...pickerSelectStyles
            }}
        />
        
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

        <TouchableOpacity style={styles.button} onPress={handleUpdatePreferences}>
            <Text style={styles.buttonText}>Update Preferences</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 15,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 15,
    },
    picker: {
        height: 50,
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    notificationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    notificationText: {
        flex: 1,
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
    iconContainer: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 15,
    },
    placeholder: {
        height: 50,
        color: '#ccc',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 15,
    },
});

export default Preferences;
