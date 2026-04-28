import ScreenWrapper from "@/components/ScreenWrapper";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function PersonalInfoScreen() {
  const params = useLocalSearchParams<{
    name?: string;
    email?: string;
    password?: string;
    dob?: string;
    accountType?: string;
  }>();

  // Safely extract params
  const name = typeof params.name === "string" ? params.name : "";
  const email = typeof params.email === "string" ? params.email : "";
  const password = typeof params.password === "string" ? params.password : "";
  const dob = typeof params.dob === "string" ? params.dob : "";
  const accountType =
    typeof params.accountType === "string"
      ? params.accountType
      : "landlord";

  // State
  const [school, setSchool] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [description, setDescription] = useState("");
  const [hobbiesError, setHobbiesError] = useState("");

  const validateHobbies = (text: string) => {
    setHobbies(text);

    if (text.trim().length === 0) {
      setHobbiesError("Hobbies are required");
      return false;
    }

    setHobbiesError("");
    return true;
  };

  const handleCompleteSignUp = () => {
    if (!validateHobbies(hobbies)) return;

    const userData = {
      name,
      email,
      password,
      dob,
      school: school.trim(),
      hobbies: hobbies.trim(),
      description: description.trim(),
      accountType,
    };

    console.log("Complete user data:", userData);

    const successMessage =
      accountType === "tenant"
        ? "Tenant account created successfully!"
        : "Landlord account created successfully!";

    alert(successMessage);
    router.replace("/");
  };

  const isFormValid = hobbies.trim().length > 0;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ScreenWrapper>
        <View style={styles.container}>
        <Text style={styles.title}>
          {accountType === "tenant"
            ? "Tenant Information"
            : "Landlord Information"}
        </Text>

        <Text style={styles.subtitle}>
          Let possible clients know more about yourself!
        </Text>

        <Text style={styles.label}>
          Current School/University{" "}
          <Text style={styles.optionalText}>(Optional)</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Trinity College"
          placeholderTextColor="#666"
          value={school}
          onChangeText={setSchool}
        />

        <Text style={styles.label}>
          Hobbies & Interests{" "}
          <Text style={styles.requiredText}>(Required)</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.multilineInput,
            hobbiesError ? styles.inputError : null,
          ]}
          placeholder="e.g., Hiking, Photography, Reading, Gaming..."
          placeholderTextColor="#666"
          value={hobbies}
          onChangeText={validateHobbies}
          multiline
          numberOfLines={3}
        />

        {hobbiesError ? (
          <Text style={styles.errorText}>{hobbiesError}</Text>
        ) : null}

        <Text style={styles.label}>
          About You <Text style={styles.optionalText}>(Optional)</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Tell us a bit about yourself..."
          placeholderTextColor="#666"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              !isFormValid ? styles.buttonDisabled : null,
            ]}
            onPress={handleCompleteSignUp}
            disabled={!isFormValid}
          >
            <Text style={styles.buttonText}>Complete Sign Up</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.noteText}>
          Note: Only hobbies are required. School and description are optional.
        </Text>
        </View>
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
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 30,
    color: "#666",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 15,
  },
  requiredText: {
    color: "red",
    fontSize: 14,
    fontWeight: "normal",
  },
  optionalText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "italic",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 5,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  inputError: {
    borderColor: "red",
  },
  multilineInput: {
    height: 100,
    paddingTop: 15,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    gap: 15,
  },
  button: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#f0f0f0",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  backButtonText: {
    color: "#333",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
  },
  noteText: {
    marginTop: 20,
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
});
