import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function TenantInfoScreen() {
  const params = useLocalSearchParams();
  
  // Get data from previous screens
  const { name, email, password, dob } = params;
  
  // Tenant fields
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [aboutYou, setAboutYou] = useState('');
  
  // Error states for required fields
  const [employmentError, setEmploymentError] = useState('');
  const [incomeError, setIncomeError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [hobbiesError, setHobbiesError] = useState('');

  // Validation functions for each required field
  const validateEmployment = (text: string) => {
    setEmploymentStatus(text);
    
    if (text.trim().length === 0) {
      setEmploymentError('Employment status is required');
      return false;
    } else {
      setEmploymentError('');
      return true;
    }
  };

  const validateIncome = (text: string) => {
    setAnnualIncome(text);
    
    if (text.trim().length === 0) {
      setIncomeError('Annual income is required');
      return false;
    } else if (!/^\d+$/.test(text.trim())) {
      setIncomeError('Please enter a valid number');
      return false;
    } else {
      setIncomeError('');
      return true;
    }
  };

  const validateLocation = (text: string) => {
    setPreferredLocation(text);
    
    if (text.trim().length === 0) {
      setLocationError('Preferred location is required');
      return false;
    } else {
      setLocationError('');
      return true;
    }
  };

  const validateHobbies = (text: string) => {
    setHobbies(text);
    
    if (text.trim().length === 0) {
      setHobbiesError('Hobbies are required');
      return false;
    } else {
      setHobbiesError('');
      return true;
    }
  };

  const handleCompleteTenantSignUp = () => {
    // Validate ALL required fields
    const isEmploymentValid = validateEmployment(employmentStatus);
    const isIncomeValid = validateIncome(annualIncome);
    const isLocationValid = validateLocation(preferredLocation);
    const isHobbiesValid = validateHobbies(hobbies);
    
    if (!isEmploymentValid || !isIncomeValid || !isLocationValid || !isHobbiesValid) {
      return; // Don't proceed if any validation fails
    }
    
    // Collect all tenant data
    const tenantData = {
      name,
      email,
      password,
      dob,
      employmentStatus: employmentStatus.trim(),
      annualIncome: annualIncome.trim(),
      preferredLocation: preferredLocation.trim(),
      moveInDate: moveInDate.trim(),
      hobbies: hobbies.trim(),
      aboutYou: aboutYou.trim(),
      accountType: 'tenant'
    };
    
    console.log('Tenant data:', tenantData);
    alert('Tenant account created successfully!');
    router.replace('/');
  };

  const isFormValid = () => {
    return (
      employmentStatus.trim().length > 0 &&
      annualIncome.trim().length > 0 &&
      /^\d+$/.test(annualIncome.trim()) &&
      preferredLocation.trim().length > 0 &&
      hobbies.trim().length > 0
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Tenant Information</ThemedText>
        
        <ThemedText style={styles.subtitle}>
          Tell us about your rental preferences and yourself
        </ThemedText>

        <ThemedText style={styles.label}>
          Employment Status <ThemedText style={styles.requiredText}>(Required)</ThemedText>
        </ThemedText>
        <TextInput
          style={[styles.input, employmentError ? styles.inputError : null]}
          placeholder="e.g., Employed, Student, Self-Employed"
          placeholderTextColor="#666"
          value={employmentStatus}
          onChangeText={validateEmployment}
        />
        {employmentError ? (
          <ThemedText style={styles.errorText}>
            {employmentError}
          </ThemedText>
        ) : null}

        {/* Annual Income - REQUIRED */}
        <ThemedText style={styles.label}>
          Annual Income (€) <ThemedText style={styles.requiredText}>(Required)</ThemedText>
        </ThemedText>
        <TextInput
          style={[styles.input, incomeError ? styles.inputError : null]}
          placeholder="e.g., 45000"
          placeholderTextColor="#666"
          value={annualIncome}
          onChangeText={validateIncome}
          keyboardType="numeric"
        />
        {incomeError ? (
          <ThemedText style={styles.errorText}>
            {incomeError}
          </ThemedText>
        ) : null}

        <ThemedText style={styles.label}>
          Preferred Location <ThemedText style={styles.requiredText}>(Required)</ThemedText>
        </ThemedText>
        <TextInput
          style={[styles.input, locationError ? styles.inputError : null]}
          placeholder="e.g., Dublin City Centre, Cork"
          placeholderTextColor="#666"
          value={preferredLocation}
          onChangeText={validateLocation}
        />
        {locationError ? (
          <ThemedText style={styles.errorText}>
            {locationError}
          </ThemedText>
        ) : null}

        <ThemedText style={styles.label}>
          Desired Move-in Date <ThemedText style={styles.optionalText}>(Optional)</ThemedText>
        </ThemedText>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#666"
          value={moveInDate}
          onChangeText={setMoveInDate}
        />

        <ThemedText style={styles.label}>
          Hobbies & Interests <ThemedText style={styles.requiredText}>(Required)</ThemedText>
        </ThemedText>
        <TextInput
          style={[styles.input, styles.multilineInput, hobbiesError ? styles.inputError : null]}
          placeholder="e.g., Hiking, Photography, Reading, Gaming..."
          placeholderTextColor="#666"
          value={hobbies}
          onChangeText={validateHobbies}
          multiline
          numberOfLines={3}
        />
        {hobbiesError ? (
          <ThemedText style={styles.errorText}>
            {hobbiesError}
          </ThemedText>
        ) : null}

        {/* About You - OPTIONAL */}
        <ThemedText style={styles.label}>
          About You <ThemedText style={styles.optionalText}>(Optional)</ThemedText>
        </ThemedText>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Tell us a bit about yourself..."
          placeholderTextColor="#666"
          value={aboutYou}
          onChangeText={setAboutYou}
          multiline
          numberOfLines={4}
        />

        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.backButton]} 
            onPress={() => router.back()}
          >
            <ThemedText type="defaultSemiBold" style={styles.backButtonText}>
              ← Back
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, !isFormValid() ? styles.buttonDisabled : null]} 
            onPress={handleCompleteTenantSignUp}
            disabled={!isFormValid()}
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Complete Sign Up
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedText style={styles.noteText}>
          * All fields are required except move-in date and "About You"
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  subtitle: {
    marginBottom: 30,
    color: '#666',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 15,
  },
  requiredText: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'normal',
  },
  optionalText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
  },
  multilineInput: {
    height: 100,
    paddingTop: 15,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 15,
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#f0f0f0',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
    marginLeft: 5,
  },
  noteText: {
    marginTop: 20,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});