import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function PersonalInfoScreen() {
  const params = useLocalSearchParams();
  
  // Get data from previous screen
  const { name, email, password, dob, accountType = 'landlord' } = params;
  
  // State for new fields
  const [school, setSchool] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [description, setDescription] = useState('');
  const [hobbiesError, setHobbiesError] = useState('');

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

  const handleCompleteSignUp = () => {
    // Validate only hobbies (school and description are optional)
    if (!validateHobbies(hobbies)) {
      return;
    }
    
    // Collect all data (school and description can be empty)
    const userData = {
      name,
      email,
      password,
      dob,
      school: school.trim(), 
      hobbies: hobbies.trim(),
      description: description.trim(),
      accountType, // Will be 'landlord'
    };
    
    console.log('Complete user data:', userData);
    
    const successMessage = accountType === 'tenant' 
      ? 'Tenant account created successfully!' 
      : 'Landlord account created successfully!';
    
    alert(successMessage);
    router.replace('/');
  };

  // Form is valid if hobbies is filled (school and description are optional)
  const isFormValid = () => {
    return hobbies.trim().length > 0;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">
          {accountType === 'tenant' ? 'Tenant Information' : 'Landlord Information--- I cant think what to put in here but imma play some mincraft now :D'}
        </ThemedText>
        
        <ThemedText style={styles.subtitle}>
          Let possible clients know more about yourself!
        </ThemedText>

        <ThemedText style={styles.label}>
          Current School/University <ThemedText style={styles.optionalText}>(Optional)</ThemedText>
        </ThemedText>
        <TextInput
          style={styles.input}
          placeholder="e.g., Trinity College"
          placeholderTextColor="#666"
          value={school}
          onChangeText={setSchool}
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

        <ThemedText style={styles.label}>
          About You <ThemedText style={styles.optionalText}>(Optional)</ThemedText>
        </ThemedText>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Tell us a bit about yourself..."
          placeholderTextColor="#666"
          value={description}
          onChangeText={setDescription}
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
            onPress={handleCompleteSignUp}
            disabled={!isFormValid()}
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Complete Sign Up
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedText style={styles.noteText}>
          Note: Only hobbies are required. School and personal description are optional.
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
  },
  noteText: {
    marginTop: 20,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});