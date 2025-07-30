import React, { useState, useRef, useEffect } from 'react';
import {
  View, StyleSheet, Text, TextInput, TouchableOpacity,
} from 'react-native';
import Auth from '@aws-amplify/auth';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';

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
    marginTop: 50,
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
    marginBottom: 60,
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
    marginBottom: 60,
  },
  codeInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    backgroundColor: '#fff',
  },
  codeInputActive: {
    borderColor: '#4A90E2',
    backgroundColor: '#fff',
  },
  codeInputFilled: {
    borderColor: '#4A90E2',
    backgroundColor: '#F0F8FF',
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

const Confirmation = ({ route, navigation, isUpdate = false }) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const email = !isUpdate ? route.params?.email : "";
  const nav = useNavigation();
  
  const inputRefs = useRef([]);

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

  const handleCodeChange = (text, index) => {
    if (text.length <= 1) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);
      setError('');

      // Auto-focus next input
      if (text && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const confirmSignUp = async () => {
    const authCode = code.join('');
    if (authCode.length === 4) {
      try {
        await Auth.confirmSignUp(email, authCode);
        navigation.navigate('SignIn');
      } catch (err) {
        setError(err.message || 'Something went wrong, please contact support!');
      }
    } else {
      setError('Please enter all 4 digits');
    }
  };

  const confirmUpdate = async () => {
    const authCode = code.join('');
    if (authCode.length === 4) {
      try {
        await Auth.verifyCurrentUserAttributeSubmit('email', authCode);
        nav.navigate('EditProfile');
      } catch (err) {
        setError(err.message || 'Something went wrong, please contact support!');
      }
    } else {
      setError('Please enter all 4 digits');
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

      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.codeInput,
              digit ? styles.codeInputFilled : styles.codeInputActive
            ]}
            value={digit}
            onChangeText={(text) => handleCodeChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="numeric"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>

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

export default Confirmation;