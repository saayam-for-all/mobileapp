import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, Ionicons } from '@expo/vector-icons'; // Using vector icons
import Auth from '@aws-amplify/auth';

export default function ChangePassword() {
  const [user, setUser] = useState(null);
  const [secureEntry, setSecureEntry] = useState([true,true,true]);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confrimPasswordValid, setConfirmPasswordValid] = useState(false);
  const [logPasswordValid, setLogPasswordValid] = useState([false, false]);

  const navigation = useNavigation();

  const getUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setUser(user);
    } catch (err) {
      //signOut();  // If error getting user then signout
      Alert.alert( // show alert to signout
        "Alert", // Title
        "Session timeout. Please sign in again", // Message
        [            
          {
            text: "Logout",
            onPress: () => signOut(),
            style: "destructive", 
          },
        ],
      );  
      console.log("error from cognito : ", err);
    }
  };
  const toggleSecureEntry = (ind) => {
    setSecureEntry(
      secureEntry.map((ele,i)=>{
        return ind == i ? !ele : ele;
      })
    );
  }
  function logError(error, errorMessage) {
    if(error){
      Alert.alert( // show alert to signout
        "Error", // Title
        errorMessage, // Message
        [            
          {
            text: "OK",
            onPress: () => {},
          },
        ],
      ); 
    } else {
      Alert.alert( // show alert to signout
        "Password Updated Successfully", // Title
        '',
        [
          {
            text: 'OK', onPress: () => {
              navigation.navigate('Profile');
            }
          },
        ]
      ); 
    }
  }
  async function changePassword() {
    let errorMessage = '';
    let error = false;
    if(!passwordValid || !confrimPasswordValid) {
      error = true;
      errorMessage = "Please make sure all inputs satisfy the requirement";
    } else {
      if (!user) {
        await getUser();
      }
        const data = await Auth.changePassword(user, oldPassword, password)
          .then(obj=>{console.log("Success: ",obj)})
          .catch(err=> {
            error = true;
            errorMessage = String(err);
          });
    }
    logError(error, errorMessage);
  }

  useEffect(()=>{
    getUser();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry={secureEntry[0]}
          value={oldPassword}
          onChangeText={(text) => setOldPassword(text)}
          accessibilityLabel="Current Password Input"
        />
        <TouchableOpacity onPress={()=>toggleSecureEntry(0)}>
          <FontAwesome name={secureEntry[0] ? 'eye-slash' : 'eye'} size={20} color="#777" />
        </TouchableOpacity>
      </View>

      {!passwordValid && logPasswordValid[0] &&
        <Text style={styles.alertText}>
          Password must have 8+ uppercase, lowercase, digits and special characters.
        </Text>
      }

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={secureEntry[1]}
          value={password}
          onChangeText={(text)=>{
            setLogPasswordValid([true, logPasswordValid[1]]);
            const valid = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/;
            const isValid = valid.test(text);
            if(!isValid) {
              setPasswordValid(false);
            } else {
              setPasswordValid(true);
            }
            if(text == confirmPassword) {
              setConfirmPasswordValid(true);
            }
            setPassword(text)
          }}
          accessibilityLabel="New Password Input"
        />
        <TouchableOpacity onPress={()=>toggleSecureEntry(1)}>
          <FontAwesome name={secureEntry[1] ? 'eye-slash' : 'eye'} size={20} color="#777" />
        </TouchableOpacity>
      </View>
      
      {!confrimPasswordValid && logPasswordValid[1] &&
        <Text style={styles.alertText}>
          Confirm Password different from New Password.
        </Text>
      }

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={secureEntry[2]}
          value={confirmPassword}
          onChangeText={text => {
            setLogPasswordValid([logPasswordValid[0], true]);
            if(text == password) 
              setConfirmPasswordValid(true);
            else
              setConfirmPasswordValid(false);
            setConfirmPassword(text);
          }}
          accessibilityLabel="Confirm Password Input"
        />
        <TouchableOpacity onPress={()=>toggleSecureEntry(2)}>
          <FontAwesome name={secureEntry[2] ? 'eye-slash' : 'eye'} size={20} color="#777" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={changePassword}
      >
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  passwordHint: {
    color: '#777',
    marginBottom: 20,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  alertText: {
    color: 'red',
    marginHorizontal: '3%',
    width: '94%',
    marginBottom: 20,
    marginLeft: 5,
  }
});
