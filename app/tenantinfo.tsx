import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

export default function TenantInfoScreen() {
  const params = useLocalSearchParams<{
    name?: string;
    email?: string;
    password?: string;
    dob?: string;
  }>();

  // Safely extract params as strings
  const name = String(params.name || '');
  const email = String(params.email || '');
  const password = String(params.password || '');
  const dob = String(params.dob || '');

  // Tenant fields
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [aboutYou, setAboutYou] = useState('');

  // Error states
  const [employmentError, setEmploymentError] = useState('');
  const [incomeError, setIncomeError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [hobbiesError, setHobbiesError] = useState('');

  const validateEmployment = (text: string) => {
    setEmploymentStatus(text);
    if (!text.trim()) {
      setEmploymentError('Employment status is required');
      return false;
    }
    setEmploymentError('');
    return true;
  };

  const validateIncome = (text: string) => {
    setAnnualIncome(text);
    if (!text.trim()) {
      setIncomeError('Annual income is required');
      return false;
    }
    if (!/^\d+$/.test(text.trim())) {
      setIncomeError('Please enter a valid number');
      return false;
    }
    setIncomeError('');
    return true;
  };

  const validateLocation = (text: string) => {
    setPreferredLocation(text);
    if (!text.trim()) {
      setLocationError('Preferred location is required');
      return false;
    }
    setLocationError('');
    return true;
  };

  const validateHobbies = (text: string) => {
    setHobbies(text);
    if (!text.trim()) {
      setHobbiesError('Hobbies are required');
      return false;
    }
    setHobbiesError('');
    return true;
  };

  const isFormValid = () => {
    return (
      employmentStatus.trim() &&
      /^\d+$/.test(annualIncome.trim()) &&
      preferredLocation.trim() &&
      hobbies.trim()
    );
  };

  const handleCompleteTenantSignUp = () => {
    const isEmploymentValid = validateEmployment(employmentStatus);
    const isIncomeValid = validateIncome(annualIncome);
    const isLocationValid = validateLocation(preferredLocation);
    const isHobbiesValid = validateHobbies(hobbies);

    if (!isEmploymentValid || !isIncomeValid || !isLocationValid || !isHobbiesValid) {
      return;
    }

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
      accountType: 'tenant',
    };

    console.log('Tenant data:', tenantData);

    alert('Tenant account created successfully!');
    router.replace('/');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ScreenWrapper style={styles.container}>
        <ThemedText type="title">Tenant Information</ThemedText>

        <ThemedText style={styles.subtitle}>
          Tell us about your rental preferences and yourself
        </ThemedText>

        {/* Employment */}
        <ThemedText style={styles.label}>
          Employment Status <ThemedText style={styles.requiredText}>(Required)</ThemedText>
        </ThemedText>
        <TextInput
          style={[styles.input, employmentError && styles.inputError]}
          placeholder="e.g., Employed, Student"
          placeholderTextColor="#666"
          value={employmentStatus}
          onChangeText={validateEmployment}
        />
        {employmentError && <ThemedText style={styles.errorText}>{employmentError}</ThemedText>}

        {/* Income */}
        <ThemedText style={styles.label}>
          Annual Income (€) <ThemedText style={styles.requiredText}>(Required)</ThemedText>
        </ThemedText>
        <TextInput
          style={[styles.input, incomeError && styles.inputError]}
          placeholder="e.g., 45000"
          placeholderTextColor="#666"
          value={annualIncome}
          onChangeText={validateIncome}
          keyboardType="numeric"
        />
        {incomeError && <ThemedText style={styles.errorText}>{incomeError}</ThemedText>}

        {/* Location */}
        <ThemedText style={styles.label}>
          Preferred Location <ThemedText style={styles.requiredText}>(Required)</ThemedText>
        </ThemedText>
        <TextInput
          style={[styles.input, locationError && styles.inputError]}
          placeholder="e.g., Dublin City Centre"
          placeholderTextColor="#666"
          value={preferredLocation}
          onChangeText={validateLocation}
        />
        {locationError && <ThemedText style={styles.errorText}>{locationError}</ThemedText>}

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
          style={[styles.input, styles.multilineInput, hobbiesError && styles.inputError]}
          placeholder="Hiking, Reading, Gaming..."
          placeholderTextColor="#666"
          value={hobbies}
          onChangeText={validateHobbies}
          multiline
          numberOfLines={3}
        />
        {hobbiesError && <ThemedText style={styles.errorText}>{hobbiesError}</ThemedText>}

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
          <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => router.back()}>
            <ThemedText type="defaultSemiBold" style={styles.backButtonText}>
              ← Back
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, !isFormValid() && styles.buttonDisabled]}
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
      </ScreenWrapper>
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
  },
  optionalText: {
    color: '#666',
    fontSize: 14,
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