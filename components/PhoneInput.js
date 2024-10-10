import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import {CountryPicker, CountryButton} from "react-native-country-codes-picker";

const styles = StyleSheet.create({
    row: {
        width:"100%",
        flexDirection: "row",
        alignItems: "stretch",
    },
    phone: {
        height: 40,
        margin: '3%',
        padding: '3%',
        flexGrow: 8,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    countryCode:{
        height: 40,
        maxWidth:"40%",
        margin: '3%',
        padding: '3%',
        flexGrow: 1,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        backgroundColor: '#fff',
    },

});

function ListHeaderComponent({countries, lang, onPress}) {
    return (
        <View
            style={{
                paddingBottom: 20,
            }}
        >
            {countries?.map((country, index) => {
                return (
                    <CountryButton key={index} item={country} name={country?.name?.[lang || 'en']} onPress={() => onPress(country)} />
                )
            })}
        </View>
    )
}

const PhoneInput = ({
  countryCode, // Default as '+1' in sign up page
  setCountryCode,
  countryName = '', // country name is imported from parent, as the initial state
onChangeCountryName, // *** change another input grid 'country' in signup page
  phone,
  onChangePhone,
  setFullPhone,
  preferredCountries,
  ...wrapperProps
}) => {
    const [show, setShow] = React.useState(false);
    const [search_message, setSearchMessage] = React.useState("");
    // Local variable country_name, initial value given from the parent
    const [country_name, setCountryName] = React.useState(countryName);

  const handleChangeText = (value) => {
    onChangePhone(value);
    setFullPhone(countryCode + value);
    wrapperProps?.clearErrorMessage?.();
  };

  return (
    <View style={{}}>
        <View style={styles.row}>
            <TouchableOpacity
                onPress={() => setShow(!show)}
                style={styles.countryCode}
            >
                <Text style={{}}>
                    {country_name + " (" + countryCode + ")"}
                </Text>
            </TouchableOpacity>
            <CountryPicker
                show={show}
                style={{
                    modal:{
                        width:"100%",
                    },
                    itemsList:{
                        overflow:"hidden",
                        height:"50vh",
                        flexGrow: 0,
                        flexShrink: 0,
                        flexBasis: "60%"
                    },
                    countryMessageContainer: {
                        height:"60%",
                        justifyContent:""
                    },
                    searchMessageText: {
                        padding: "5%"
                    }
                }}
                searchMessage={search_message}
                // when picker button press you will get the country object with dial code
                pickerButtonOnPress={(item) => {
                    setCountryCode(item.dial_code);
                    // First Change the name for phone country
                    setCountryName(item.name.en);
                    // Then Change country field in signup page
                    onChangeCountryName(item.name.en);
                    setFullPhone(item.dial_code + phone)
                    setShow(!show);
                }}
                ListHeaderComponent={ListHeaderComponent}
                popularCountries={['ca','us', 'in']}
            />
            <TextInput
                style={styles.phone}
                keyboardType="phone-pad"
                autoCorrect={false}
                autoComplete="tel"
                textContentType="telephoneNumber"
                onChangeText={handleChangeText}
                value={phone}
                placeholder="Enter Phone"
                placeholderTextColor="#A0A0A0"
            />
        </View>
    </View>
  );
}

export default PhoneInput;