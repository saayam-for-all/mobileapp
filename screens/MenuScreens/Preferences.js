import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity,Alert} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Checkbox } from 'react-native-paper';

import useAuthUser from '../../hooks/useAuthUser';

const Preferences = () => {
    const [user, setUser] = useState(undefined);
    const defaultDefaultDashboardView = { 
        label: 'Default Dashboard View', 
        value: 'default' 
    }
    const [defaultDashboardView, setDefaultDashboardView] = useState(defaultDefaultDashboardView);
    const [firstLanguage, setFirstLanguage] = useState('');
    const defaultFirstLanguage = {
        label: 'First Language Preference', 
        value: 'default' 
    }
    const [secondLanguage, setSecondLanguage] = useState('');
    const defaultSecondLanguage = {
        label: 'Second Language Preference', 
        value: 'default' 
    }
    const [thirdLanguage, setThirdLanguage] = useState('');
    const defaultThirdLanguage = {
        label: 'Third Language Preference', 
        value: 'default' 
    }
    const [emailPreference, setEmailPreference] = useState(true);
    const [phonePreference, setPhonePreference] = useState(true);
    const [primaryPhone, setPrimaryPhone] = useState('')
    const [secondaryPhone, setSecondaryPhone] = useState('')
    const [primaryEmail, setPrimaryEmail] = useState('')
    const [secondaryEmail, setSecondaryEmail] = useState('')
    const [checked, setChecked] = React.useState(false);

    const languageOptions = [
        { value: "bn", label: "Bengali" },
        { value: "de", label: "German" },
        { value: "en", label: "English" },
        { value: "es", label: "Spanish" },
        { value: "fr", label: "French" },
        { value: "hi", label: "Hindi" },
        { value: "pt", label: "Portuguese" },
        { value: "ru", label: "Russian" },
        { value: "te", label: "Telugu" },
        { value: "zh", label: "Mandarin Chinese" },
    ];

    const navigation = useNavigation();
    useAuthUser(navigation, (user) => {
        setUser(user);
        setPrimaryPhone(user.attributes.phone_number);
        setSecondaryPhone('1111111111');
        setPrimaryEmail(user.attributes.email);
        setSecondaryEmail('secondary@email.com');
    });

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
            useNativeAndroidPickerStyle={false}
            style={{
                ...pickerSelectStyles
            }}
        />
      
        <RNPickerSelect
            onValueChange={(value) => setFirstLanguage(value)}
            items={languageOptions}
            placeholder = {defaultFirstLanguage}
            value={firstLanguage}
            useNativeAndroidPickerStyle={false}
            style={{
                ...pickerSelectStyles
            }}
        />
        
        <RNPickerSelect
            onValueChange={(value) => setSecondLanguage(value)}
            items={languageOptions}
            placeholder = {defaultSecondLanguage}
            value={secondLanguage}
            useNativeAndroidPickerStyle={false}
            style={{
                ...pickerSelectStyles
            }}
        />

         <RNPickerSelect
            onValueChange={(value) => setThirdLanguage(value)}
            items={languageOptions}
            placeholder = {defaultThirdLanguage}
            value={thirdLanguage}
            useNativeAndroidPickerStyle={false}
            style={{
                ...pickerSelectStyles
            }}
        />

        <Text style={styles.title}>Email Communication Preference</Text>
        <View style={styles.checkboxContainer}>
            <Checkbox
                status={emailPreference ? 'checked' : 'unchecked'}
                color='#007BFF'
                onPress={() => {
                    setEmailPreference(true);
                }}
            />
            <Text style={styles.label}>Primary Email: {primaryEmail}</Text>
        </View>
        <View style={styles.checkboxContainer}>
            <Checkbox
                status={!emailPreference ? 'checked' : 'unchecked'}
                color='#007BFF'
                onPress={() => {
                    setEmailPreference(false);
                }}
            />
            <Text style={styles.label}>Secondary Email: {secondaryEmail}</Text>
        </View>

        <Text style={styles.title}>Phone Communication Preference</Text>
        <View style={styles.checkboxContainer}>
            <Checkbox
                status={phonePreference ? 'checked' : 'unchecked'}
                color='#007BFF'
                onPress={() => {
                    setPhonePreference(true);
                }}
            />
            <Text style={styles.label}>Primary Phone: {primaryPhone}</Text>
        </View>
        <View style={styles.checkboxContainer}>
            <Checkbox
                status={!phonePreference ? 'checked' : 'unchecked'}
                color='#007BFF'
                onPress={() => {
                    setPhonePreference(false);
                }}
            />
            <Text style={styles.label}>Secondary Phone: {secondaryPhone}</Text>
        </View>
        
        <View style={styles.notificationContainer}>
            <Checkbox
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
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
        marginHorizontal: 5
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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 15,
    },
    inputAndroid: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 15,
    },
    placeholder: {
        height: 50,
        color: '#374151',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 15,
    },
});

export default Preferences;
