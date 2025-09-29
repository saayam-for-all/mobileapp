import React, { useState, useRef, useEffect } from 'react';
import {
  View, StyleSheet, Text, TextInput, TouchableOpacity,
} from 'react-native';
import Auth from '@aws-amplify/auth';
import { useNavigation } from '@react-navigation/native';

const CODE_LENGTH = 6;

const Confirmation = ({ route, navigation, isUpdate = false }) => {
  const [code, setCode] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const email = !isUpdate ? route.params?.email : "";
  const nav = useNavigation();
  
  const inputRef = useRef();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleCodeChange = (text) => {
    // Only allow numeric characters and limit to CODE_LENGTH
    const numericText = text.replace(/\D/g, '').slice(0, CODE_LENGTH);
    setCode(numericText);
    setError('');
  };

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  const confirmSignUp = async () => {
    console.log(code);
    if (code.length === CODE_LENGTH) {
      try {
        await Auth.confirmSignUp(email, code);
        navigation.navigate('SignIn');
      } catch (err) {
        setError(err.message || 'Something went wrong, please contact support!');
      }
    } else {
      setError(`Please enter all ${CODE_LENGTH} digits`);
    }
  };

  const confirmUpdate = async () => {
    if (authCode.length === CODE_LENGTH) {
      try {
        const user = await Auth.currentAuthenticatedUser();
        await Auth.verifyCurrentUserAttributeSubmit('email', code);
        await Auth.updateUserAttributes(user, toUpdate);
        navigation.navigate('Profile');
      } catch (err) {
        if (!err.message) {
          setError('Something went wrong, please contact support!');
        } else {
          setError(err.message);
        }
      }
    } else {
      setError('You must enter confirmation code');
    }
  };

  const resendCode = async () => {
    if (canResend) {
      try {
        if (!isUpdate) {
          await Auth.resendSignUp(email);
        } else {
          // Handle resend for update case
        }
        setTimer(59);
        setCanResend(false);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to resend code');
      }
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Account</Text>
      
      <Text style={styles.subtitle}>
        Code has been sent to <Text style={styles.phoneNumber}>{email}</Text>.{'\n'}
        Enter the code to verify your account.
      </Text>

      <Text style={styles.codeLabel}>Enter Code</Text>

      <TouchableOpacity 
        style={styles.codeContainer} 
        onPress={handleContainerPress}
        activeOpacity={1}
      >
        {/* Hidden TextInput that handles all input */}
        <TextInput
          ref={inputRef}
          style={styles.hiddenTextInput}
          value={code}
          onChangeText={handleCodeChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType="numeric"
          maxLength={CODE_LENGTH}
          autoFocus
          selectTextOnFocus
          autoCorrect={false}
          autoCapitalize="none"
          contextMenuHidden={true}
        />
        
        {/* Visual code input boxes */}
        {Array.from({ length: CODE_LENGTH }, (_, index) => (
          <View
            key={index}
            style={[
              styles.codeInput,
              code[index] ? styles.codeInputFilled : styles.codeInputActive,
              isFocused && index === code.length && styles.codeInputFocused
            ]}
          >
            <Text style={styles.codeDigitText}>
              {code[index] || ''}
            </Text>
          </View>
        ))}
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
          Didn't Receive Code?{' '}
          <TouchableOpacity onPress={resendCode} disabled={!canResend}>
            <Text style={[styles.resendLink, !canResend && { color: '#ccc' }]}>
              Resend Code
            </Text>
          </TouchableOpacity>
        </Text>
        
        {!canResend && (
          <Text style={styles.timerText}>
            Resend code in {formatTimer(timer)}
          </Text>
        )}
      </View>

      <TouchableOpacity 
        style={styles.verifyButton} 
        onPress={isUpdate ? confirmUpdate : confirmSignUp}
      >
        <Text style={styles.verifyButtonText}>Verify Account</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 80,
    paddingHorizontal: 30,
    backgroundColor: '#F8F8F8',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 22,
  },
  phoneNumber: {
    fontWeight: '600',
    color: '#333',
  },
  codeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 50,
    position: 'relative',
  },
  hiddenTextInput: {
    position: 'absolute',
    width: '100%',
    height: 50,
    opacity: 0,
    fontSize: 24,
  },
  codeInput: {
    width: 50,
    height: 50,
    marginHorizontal: 2,
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeInputActive: {
    borderColor: '#4A90E2',
    backgroundColor: '#fff',
  },
  codeInputFilled: {
    borderColor: '#4A90E2',
    backgroundColor: '#F0F8FF',
  },
  codeInputFocused: {
    borderColor: '#4A90E2',
    borderWidth: 3,
  },
  codeDigitText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  resendText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  resendLink: {
    color: '#4A90E2',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  timerText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  verifyButton: {
    width: '100%',
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Confirmation;