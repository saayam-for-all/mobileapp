import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import DropDownPicker from "react-native-dropdown-picker";
import { countriesList } from "../../data/countries";
import { languagesList } from "../../data/languages";
import useAuthUser from "../../hooks/useAuthUser";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
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
    alignItems: "center",
    marginHorizontal: 5,
  },
  editButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#3B82F6",
    marginTop: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    color: "#374151",
    paddingRight: 30,
    backgroundColor: "#f9fafb",
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    color: "#374151",
    paddingRight: 30,
    backgroundColor: "#f9fafb",
    marginBottom: 16,
  },
});

const SearchableDropdown = ({
  data,
  setData,
  value,
  setValue,
  isOpen,
  setOpen,
  placeholder = "Select an item",
  multiple = false,
  disabled = false,
}) => {
  return data !== null ? (
    <DropDownPicker
      multiple={multiple}
      mode={multiple ? "BADGE" : "SIMPLE"}
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
        setValue(v);
        console.log(value);
      }}
      setItems={setData}
    />
  ) : (
    <RNPickerSelect
      onValueChange={(v) => setData(v)}
      items={[]}
      value={value}
      // no existing key for "Fetching data..." so leaving as-is
      placeholder={{ label: "Fetching data...", value: null }}
      style={{
        inputIOS: styles.inputIOS,
        inputAndroid: styles.inputAndroid,
      }}
    />
  );
};

const EditPersonal = () => {
  const { t } = useTranslation("profile");

  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [streetAddress2, setStreetAddress2] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [language, setLanguage] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [backupProfile, setBackupProfile] = useState({});
  const [languageOpen, setLanguageOpen] = useState(false);

  const [countries, setCountries] = useState(countriesList);
  const [languages, setLanguages] = useState(languagesList);
  const defaultCountries = [{ value: t("English"), label: t("English") }];
  const defaultLanguages = [{ value: t("English"), label: t("English") }];

  const navigation = useNavigation();
  const user = useAuthUser(navigation);

  useEffect(() => {
    if (user?.attributes?.["custom:Country"]) {
      setCountry(user.attributes["custom:Country"]);
    }
  }, [user]);

  AbortSignal.timeout ??= function timeout(ms) {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), ms);
    return ctrl.signal;
  };

  useEffect(() => {
    if (countries === null)
      fetch("https://restcountries.com/v3.1/all", { signal: AbortSignal.timeout(10000) })
        .then((response) => response.json())
        .then((data) => {
          const countryList = data.map((country) => ({
            value: country.name.common,
            label: country.name.common,
          }));
          setCountries(countryList);
          console.log(countryList);
        })
        .catch((error) => {
          console.log(error);
          setCountries(defaultCountries);
        });
  }, [countries]);

  useEffect(() => {
    if (languages === null)
      fetch("https://restcountries.com/v3.1/all", { signal: AbortSignal.timeout(10000) })
        .then((response) => response.json())
        .then((data) => {
          const languageSet = new Set();
          data.forEach((country) => {
            if (country.languages) {
              Object.values(country.languages).forEach((language) => languageSet.add(language));
            }
          });
          const langs = [...languageSet].map((lang) => ({ value: lang, label: lang }));
          setLanguages(langs);
          console.log(langs);
        })
        .catch((error) => {
          console.log(error);
          setLanguages(defaultLanguages);
        });
  }, [languages]);

  useEffect(() => {
    if (!isEditing) {
      setLanguageOpen(false);
      setCountryOpen(false);
    }
  }, [isEditing]);

  const validateForm = () => {
    // No existing keys for these validation messages, leaving as-is.
    const dobRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!dobRegex.test(dob)) {
      Alert.alert("Invalid Date of Birth", "DOB should be in the format MM/DD/YYYY.");
      return false;
    }
    return true;
  };

  const handleUpdateProfile = () => {
    if (validateForm()) {
      // You do have this key
      Alert.alert("Success", t("PROFILE_UPDATE_SUCCESS"));
    }
  };

  const handleEdit = () => {
    setBackupProfile({
      dob,
      gender,
      streetAddress,
      streetAddress2,
      country,
      state,
      zipCode,
      language,
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
      {/* No exact key for "Edit Personal Information", best existing is PERSONAL_INFORMATION */}
      <Text style={styles.header}>{t("PERSONAL_INFORMATION")}</Text>

      <TextInput
        style={styles.input}
        // No key for "DOB (MM/DD/YYYY)" — using existing BIRTHDAY
        placeholder={t("BIRTHDAY")}
        value={dob}
        onChangeText={setDob}
        editable={isEditing}
      />

      <RNPickerSelect
        onValueChange={(value) => setGender(value)}
        items={[
          // No keys for "Select Gender", "Other" etc. but you *do* have GENDER and GENDER_OPTIONS in profile.json.
          { label: t("GENDER"), value: "" },
          { label: t("GENDER_OPTIONS.MALE"), value: "male" },
          { label: t("GENDER_OPTIONS.FEMALE"), value: "female" },
          // No "Other" key (you have NON_BINARY, TRANSGENDER, INTERSEX, GENDER_NONCONFORMING)
          { label: t("GENDER_OPTIONS.NON_BINARY"), value: "non_binary" },
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
        placeholder={t("SELECT_COUNTRY")}
        disabled={!isEditing}
      />

      <TextInput
        style={styles.input}
        placeholder={t("STATE")}
        value={state}
        onChangeText={setState}
        editable={isEditing}
      />

      <TextInput
        style={styles.input}
        placeholder={t("ZIP_CODE")}
        value={zipCode}
        onChangeText={setZipCode}
        editable={isEditing}
      />

      <TextInput
        style={styles.input}
        placeholder={t("ADDRESS")}
        value={streetAddress}
        onChangeText={setStreetAddress}
        editable={isEditing}
      />

      <TextInput
        style={styles.input}
        // No key for "Street Address 2" — closest is SECONDARY_PHONE/SECONDARY_EMAIL etc, not appropriate.
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
        // No key for this sentence; leaving as-is
        placeholder="Select Languages (Ordered by Preference)"
        disabled={!isEditing}
      />

      {!isEditing ? (
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.buttonText}>{t("EDIT")}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, { backgroundColor: "#3B82F6" }]} onPress={handleSave}>
            <Text style={styles.buttonText}>{t("SAVE")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: "#6B7280" }]} onPress={handleCancel}>
            <Text style={styles.buttonText}>{t("CANCEL")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default EditPersonal;
