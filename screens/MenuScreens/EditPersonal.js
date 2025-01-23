import { useState,useEffect } from "react";
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

const SearchableDropdown = ({data,setData, value, setValue, isOpen,setOpen,placeholder='Select an item',multiple=false}) => {
    return (
        data !== null ?
            <DropDownPicker
                multiple={multiple}
                mode={multiple? 'BADGE' : 'SIMPLE'}
                min={0}
                max={3}
                badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}

                placeholder={placeholder}
                searchable={true}
                style={styles.inputIOS}
                dropDownContainerStyle={styles.inputIOS}
                searchContainerStyle={{borderBottomColor: "#ccc"}}

                
                value={value}
                items={data}
                open={isOpen}
                setOpen={setOpen}
                setValue={(v)=>{
                    setValue(v)
                    console.log(value)
                }}
                setItems={setData}
            /> :
            <RNPickerSelect
                onValueChange={(v) => setData(v)}
                items={[]}
                value={value}
                placeholder={{label: "Fetching data...", value: null}}
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
    const [country,setCountry] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [language, setLanguage] = useState([]);
    // const [firstLanguage, setFirstLanguage] = useState('');
    // const [secondLanguage, setSecondLanguage] = useState('');
    // const [thirdLanguage, setThirdLanguage] = useState('');
    const [languageOpen, setLanguageOpen] = useState(false);

    const [countries,setCountries] = useState(countriesList);
    const [languages,setLanguages] = useState(languagesList);
    const defaultCountries = [{ value: "English", label: "English" }];
    const defaultLanguages = [{value: 'English',label:"English"}];
    
    AbortSignal.timeout ??= function timeout(ms) {
        const ctrl = new AbortController()
        setTimeout(() => ctrl.abort(), ms)
        return ctrl.signal
      }
    useEffect(()=>{
        if(countries===null)
            fetch('https://restcountries.com/v3.1/all',{ signal: AbortSignal.timeout(10000) })
                .then(response => response.json())
                .then(data => {
                    const countryList = data.map((country,ind) => ({
                        value: country.name.common,
                        label: country.name.common,
                    }));
                    setCountries(countryList);
                    console.log(countryList)
                })
                .catch((error)=>{
                    console.log(error);
                    setCountries(defaultCountries)
                });
    },[countries])
    useEffect(()=>{
        if(languages===null)
            fetch('https://restcountries.com/v3.1/all',{ signal: AbortSignal.timeout(10000) })
                .then(response => response.json())
                .then(data => {
                    const languageSet = new Set();
                    data.forEach(country => {
                        if (country.languages) {
                            Object.values(country.languages).forEach(language => languageSet.add(language));
                        }
                    });
                    const languages = [...languageSet].map((lang,ind) => ({ value: lang, label: lang }))
                    setLanguages(languages);
                    console.log(languages)
                })
                .catch((error)=>{
                    console.log(error);
                    setLanguages(defaultLanguages)
                });;
    },[languages])

    const validateForm = () => {

        // DOB should match the DD/MM/YY format
        const dobRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{2}$/;
        if (!dobRegex.test(dob)) {
            Alert.alert('Invalid Date of Birth', 'DOB should be in the format DD/MM/YY.');
            return false;
        }
    }
    const handleUpdateProfile = () => {
        if (validateForm()) {
          Alert.alert('Success', 'Profile updated successfully.');
          // Proceed with the profile update logic here
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Edit Personal Information</Text>
            <TextInput
                style={styles.input}
                placeholder="DOB (DD/MM/YY)"
                value={dob}
                onChangeText={setDob}
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
            />
            <TextInput
                style={styles.input}
                placeholder="State"
                value={state}
                onChangeText={setState}
            />
            <TextInput
                style={styles.input}
                placeholder="Zip Code"
                value={zipCode}
                onChangeText={setZipCode}
            />
                        <TextInput
                style={styles.input}
                placeholder="Street Address"
                value={streetAddress}
                onChangeText={setStreetAddress}
            />
            <TextInput
                style={styles.input}
                placeholder="Street Address 2"
                value={streetAddress2}
                onChangeText={setStreetAddress2}
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
            />
            <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
                <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>
        </View>
    )
}

export default EditPersonal;