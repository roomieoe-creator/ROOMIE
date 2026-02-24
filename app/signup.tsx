import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

// import { supabase } from '../lib/supabase'; -> For when you do authentication the import of the file that connects to the online db

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [dobError, setDobError] = useState('');
  const [name, setName] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Function to automatically format as DD/MM/YYYY
  const formatDOB = (text: string) => {
    // Remove all non-digit characters
    let cleaned = text.replace(/\D/g, '');
    
    if (cleaned.length > 4) {
      // Format: DD/MM/YYYY
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
    } else if (cleaned.length > 2) {
      // Format: DD/MM
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    
    // Limit to 10 characters
    if (cleaned.length > 10) {
      cleaned = cleaned.slice(0, 10);
    }
    
    setDob(cleaned);
    
    // Clear error when user starts typing
    setDobError('');
    
    // Validate when full date is entered
    if (cleaned.length === 10) {
      validateAge(cleaned);
    }
  };

  // Function to check if user is at least 17 years old
  const validateAge = (dateStr: string) => {
    // Parse the date string (DD/MM/YYYY)
    const parts = dateStr.split('/');
    if (parts.length !== 3) return false;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JS
    const year = parseInt(parts[2], 10);
    
    // Create date objects
    const birthDate = new Date(year, month, day);
    const today = new Date();
    
    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Check if at least 17 years old
    if (age < 17) {
      setDobError('You must be at least 17 years old to sign up');
      return false;
    } else {
      setDobError(''); // Clear any previous error
      return true;
    }
  };

  // Function to validate password
  const validatePassword = (text: string) => {
    setPassword(text);
    setPasswordError('');
    
    if (text.length === 0) return;
    
    let errors = [];
    
    // Check minimum length
    if (text.length < 6) {
      errors.push('at least 6 characters');
    }
    
    // Check for capital letter
    if (!/[A-Z]/.test(text)) {
      errors.push('a capital letter');
    }
    
    // Check for number
    if (!/\d/.test(text)) {
      errors.push('a number');
    }
    
    // Check for special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(text)) {
      errors.push('a special character (!@#$%^&*, etc.)');
    }
    
    if (errors.length > 0) {
      setPasswordError(`Password must contain: ${errors.join(', ')}`);
      return false;
    }
    
    // Check if passwords match
    if (confirmPassword && text !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
    
    return true;
  };

  // Function to validate confirm password
  const validateConfirmPassword = (text: string) => {
    setConfirmPassword(text);
    
    if (text !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    } else {
      setConfirmPasswordError('');
      return true;
    }
  };

  const handleNext = () => {
    // Validate all fields before proceeding
    let isValid = true;
    
    if (dob.length === 10 && !validateAge(dob)) {
      isValid = false;
    }
    
    if (!validatePassword(password)) {
      isValid = false;
    }
    
    if (!validateConfirmPassword(confirmPassword)) {
      isValid = false;
    }
    
    if (!isValid) {
      return; 
    }
    
    router.push({
      pathname: '/accounttype',
      params: {
        name,
        email,
        password,
        dob, 
      }
    });
  };

  // Check if all fields are valid for button state
  const isFormValid = () => {
    return (
      name.length > 0 &&
      email.length > 0 &&
      password.length >= 6 &&
      validatePassword(password) === true &&
      confirmPassword === password &&
      dob.length === 10 &&
      validateAge(dob) === true &&
      !dobError &&
      !passwordError &&
      !confirmPasswordError
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.centerContainer}>
      <Image
          source={require('@/assets/images/RoomieLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <ThemedText type="title" style={styles.title}>
          Create Account
        </ThemedText>

        <View style={styles.formContainer}>
          <TextInput 
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <TextInput
            style={[styles.input, passwordError ? styles.inputError : null]}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={validatePassword}
            secureTextEntry
          />
          
          {passwordError ? (
            <ThemedText style={styles.errorText}>
              {passwordError}
            </ThemedText>
          ) : null}
          
          <TextInput
            style={[styles.input, confirmPasswordError ? styles.inputError : null]}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={validateConfirmPassword}
            secureTextEntry
          />
          
          {confirmPasswordError ? (
            <ThemedText style={styles.errorText}>
              {confirmPasswordError}
            </ThemedText>
          ) : null}

          <TextInput
            style={[styles.input, dobError ? styles.inputError : null]}
            placeholder="DOB - DD/MM/YYYY"
            placeholderTextColor="#999"
            value={dob}
            onChangeText={formatDOB}
            keyboardType="numeric"
            maxLength={10}
          />
          
          {dobError ? (
            <ThemedText style={styles.errorText}>
              {dobError}
            </ThemedText>
          ) : null}
          
          <TouchableOpacity 
            style={[styles.button, !isFormValid() ? styles.buttonDisabled : null]} 
            onPress={handleNext}  
            disabled={!isFormValid()}
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Next →
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8A2BE2', // Matching purple background
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150, // Adjust based on your logo size
    height: 150, // Adjust based on your logo size
    marginBottom: 5, // Space between logo and title
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 40,
    textAlign: 'center',
    color: '#fff', // White title
    letterSpacing: 1,
  },
  formContainer: {
    width: 300, // Fixed width for the form
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff', // White background
    borderRadius: 25, // Rounded corners
    fontSize: 16,
    paddingHorizontal: 20,
    marginBottom: 15,
    color: '#333', // Dark text for contrast
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  inputError: {
    borderWidth: 2,
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 15,
    backgroundColor: 'rgba(255,255,255,0.9)', // Semi-transparent background
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4169E1', // Royal Blue
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 20,
    shadowColor: '#4169E1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(65,105,225,0.5)', // Semi-transparent blue when disabled
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});