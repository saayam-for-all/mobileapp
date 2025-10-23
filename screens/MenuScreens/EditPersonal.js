import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import DropDownPicker from 'react-native-dropdown-picker';
import { countriesList } from "../../data/countries";
import { languagesList } from "../../data/languages";

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
        backgroundColor: '#f9f9f9',
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
        flex: 1,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    editButton: {
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#3B82F6',
        marginTop: 15,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
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

const SearchableDropdown = ({ data, setData, value, setValue, isOpen, setOpen, placeholder = 'Select an item', multiple = false, disabled = false, }) => {
    return (
        data !== null ?
            <DropDownPicker
                multiple={multiple}
                mode={multiple ? 'BADGE' : 'SIMPLE'}
                min={0}
                max={3}
                badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}

                placeholder={placeholder}
                searchable={true}
                style={styles.inputIOS}
                dropDownContainerStyle={styles.inputIOS}
                searchContainerStyle={{ borderBottomColor: "#ccc" }}

                disabled={disabled}
                value={value}
                items={data}
                open={isOpen}
                setOpen={setOpen}
                setValue={(v) => {
                    setValue(v)
                    console.log(value)
                }}
                setItems={setData}
            /> :
            <RNPickerSelect
                onValueChange={(v) => setData(v)}
                items={[]}
                value={value}
                placeholder={{ label: "Fetching data...", value: null }}
                style={{
                    inputIOS: styles.inputIOS,
                    inputAndroid: styles.inputAndroid,
                }}
            />
    )
}

const EditPersonal = () => {
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [streetAddress2, setStreetAddress2] = useState('');
    const [countryOpen, setCountryOpen] = useState(false);
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [language, setLanguage] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [backupProfile, setBackupProfile] = useState({});
    // const [firstLanguage, setFirstLanguage] = useState('');
    // const [secondLanguage, setSecondLanguage] = useState('');
    // const [thirdLanguage, setThirdLanguage] = useState('');
    const [languageOpen, setLanguageOpen] = useState(false);

    const [countries, setCountries] = useState(countriesList);
    const [languages, setLanguages] = useState(languagesList);
    const defaultCountries = [{ value: "English", label: "English" }];
    const defaultLanguages = [{ value: 'English', label: "English" }];

    AbortSignal.timeout ??= function timeout(ms) {
        const ctrl = new AbortController()
        setTimeout(() => ctrl.abort(), ms)
        return ctrl.signal
    }
    useEffect(() => {
        if (countries === null)
            fetch('https://restcountries.com/v3.1/all', { signal: AbortSignal.timeout(10000) })
                .then(response => response.json())
                .then(data => {
                    const countryList = data.map((country, ind) => ({
                        value: country.name.common,
                        label: country.name.common,
                    }));
                    setCountries(countryList);
                    console.log(countryList)
                })
                .catch((error) => {
                    console.log(error);
                    setCountries(defaultCountries)
                });
    }, [countries])
    useEffect(() => {
        if (languages === null)
            fetch('https://restcountries.com/v3.1/all', { signal: AbortSignal.timeout(10000) })
                .then(response => response.json())
                .then(data => {
                    const languageSet = new Set();
                    data.forEach(country => {
                        if (country.languages) {
                            Object.values(country.languages).forEach(language => languageSet.add(language));
                        }
                    });
                    const languages = [...languageSet].map((lang, ind) => ({ value: lang, label: lang }))
                    setLanguages(languages);
                    console.log(languages)
                })
                .catch((error) => {
                    console.log(error);
                    setLanguages(defaultLanguages)
                });;
    }, [languages])

    useEffect(() => {
    if (!isEditing) {
        setLanguageOpen(false);  // ✅ auto-close language dropdown
        setCountryOpen(false);   // ✅ optional: also close country dropdown
    }
}, [isEditing]);

    const validateForm = () => {

        // DOB should match the DD/MM/YY format
        const dobRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
        if (!dobRegex.test(dob)) {
            Alert.alert('Invalid Date of Birth', 'DOB should be in the format DD/MM/YY.');
            return false;
        }
    }
    const handleUpdateProfile = () => {
        if (validateForm()) {
            Alert.alert('Success', 'Profile updated successfully.');
        }
    };

    // ✨ Edit mode handlers
    const handleEdit = () => {
        setBackupProfile({
            dob,
            gender,
            streetAddress,
            streetAddress2,
            country,
            state,
            zipCode,
            language
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        handleUpdateProfile();
        setLanguageOpen(false);
        setCountryOpen(false);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setDob(backupProfile.dob);
        setGender(backupProfile.gender);
        setStreetAddress(backupProfile.streetAddress);
        setStreetAddress2(backupProfile.streetAddress2);
        setCountry(backupProfile.country);
        setState(backupProfile.state);
        setZipCode(backupProfile.zipCode);
        setLanguage(backupProfile.language);
        setLanguageOpen(false);
        setCountryOpen(false);
        setIsEditing(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Edit Personal Information</Text>
            <TextInput
                style={styles.input}
                placeholder="DOB (MM/DD/YYYY)"
                value={dob}
                onChangeText={setDob}
                editable={isEditing}
            />

            <RNPickerSelect
                onValueChange={(value) => setGender(value)}
                items={[
                    { label: 'Select Gender', value: '' },
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Other', value: 'other' },
                ]}
                value={gender}
                disabled={!isEditing}
                style={{
                    inputIOS: styles.inputIOS,
                    inputAndroid: styles.inputAndroid,
                }}
            />
            <SearchableDropdown
                data={countries}
                setData={setCountries}
                value={country}
                setValue={setCountry}
                isOpen={countryOpen}
                setOpen={setCountryOpen}
                placeholder="Select Country"
                disabled={!isEditing}
            />
            <TextInput
                style={styles.input}
                placeholder="State"
                value={state}
                onChangeText={setState}
                editable={isEditing}
            />
            <TextInput
                style={styles.input}
                placeholder="Zip Code"
                value={zipCode}
                onChangeText={setZipCode}
                editable={isEditing}
            />
            <TextInput
                style={styles.input}
                placeholder="Street Address"
                value={streetAddress}
                onChangeText={setStreetAddress}
                editable={isEditing}
            />
            <TextInput
                style={styles.input}
                placeholder="Street Address 2"
                value={streetAddress2}
                onChangeText={setStreetAddress2}
                editable={isEditing}
            />
            <SearchableDropdown
                data={languages}
                multiple={true}
                setData={setLanguages}
                value={language}
                setValue={setLanguage}
                isOpen={languageOpen}
                setOpen={setLanguageOpen}
                placeholder="Select Languages (Ordered by Preference)"
                disabled={!isEditing}
            />
            {!isEditing ? (
                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#3B82F6' }]} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#6B7280' }]} onPress={handleCancel}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

export default EditPersonal;