import ScreenWrapper from "@/components/ScreenWrapper";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [dob, setDob] = useState("");
  const [dobError, setDobError] = useState("");

  const [name, setName] = useState("");

  const validateEmail = (text: string) => {
    setEmail(text);
    setEmailError("");

    const regex = /\S+@\S+\.\S+/;
    if (!regex.test(text)) {
      setEmailError("Please enter a valid email");
      return false;
    }
    return true;
  };

  const formatDOB = (text: string) => {
    let cleaned = text.replace(/\D/g, "");

    if (cleaned.length > 4) {
      cleaned =
        cleaned.slice(0, 2) +
        "/" +
        cleaned.slice(2, 4) +
        "/" +
        cleaned.slice(4, 8);
    } else if (cleaned.length > 2) {
      cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }

    if (cleaned.length > 10) cleaned = cleaned.slice(0, 10);

    setDob(cleaned);
    setDobError("");

    if (cleaned.length === 10) validateAge(cleaned);
  };

  const validateAge = (dateStr: string) => {
    const parts = dateStr.split("/");
    if (parts.length !== 3) return false;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const birthDate = new Date(year, month, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 17) {
      setDobError("You must be at least 17 years old");
      return false;
    }

    setDobError("");
    return true;
  };

  const validatePassword = (text: string) => {
    setPassword(text);

    let errors: string[] = [];
    if (text.length < 6) errors.push("at least 6 characters");
    if (!/[A-Z]/.test(text)) errors.push("a capital letter");
    if (!/\d/.test(text)) errors.push("a number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(text)) errors.push("a special character");

    if (errors.length > 0) {
      setPasswordError(`Password must contain: ${errors.join(", ")}`);
      return false;
    }

    setPasswordError("");
    if (confirmPassword && text !== confirmPassword) setConfirmPasswordError("Passwords do not match");
    else setConfirmPasswordError("");

    return true;
  };

  const validateConfirmPassword = (text: string) => {
    setConfirmPassword(text);
    if (text !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleNext = () => {
    const emailValid = validateEmail(email);
    const passValid = validatePassword(password);
    const confirmValid = validateConfirmPassword(confirmPassword);
    const ageValid = validateAge(dob);

    if (!emailValid || !passValid || !confirmValid || !ageValid) return;

    router.push({
      pathname: "/accounttype",
      params: { name, email, password, dob },
    });
  };

  const isFormValid =
    name.length > 0 &&
    email.length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    dob.length === 10 &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError &&
    !dobError;

    return (
      <ScreenWrapper bg="#9932cc">
        <View style={styles.centerContainer}>
          <Image
            source={require("@/assets/images/RoomieLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
  
          <Text style={styles.title}>Create Account</Text>

          <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={[styles.input, emailError && styles.inputError]}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={validateEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <TextInput
            style={[styles.input, passwordError && styles.inputError]}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={validatePassword}
            secureTextEntry
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <TextInput
            style={[styles.input, confirmPasswordError && styles.inputError]}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={validateConfirmPassword}
            secureTextEntry
          />
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

          <TextInput
            style={[styles.input, dobError && styles.inputError]}
            placeholder="DOB - DD/MM/YYYY"
            placeholderTextColor="#999"
            value={dob}
            onChangeText={formatDOB}
            keyboardType="numeric"
            maxLength={10}
          />
          {dobError ? <Text style={styles.errorText}>{dobError}</Text> : null}

          <TouchableOpacity
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={!isFormValid}
          >
            <Text style={styles.buttonText}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#8A2BE2" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  logo: { width: 150, height: 150, marginBottom: 5 },
  title: { fontSize: 32, fontWeight: "700", marginBottom: 40, color: "#fff" },
  formContainer: { width: 300, alignItems: "center" },
  input: { width: "100%", height: 50, backgroundColor: "#fff", borderRadius: 25, paddingHorizontal: 20, marginBottom: 15 },
  inputError: { borderWidth: 2, borderColor: "#ff4444" },
  errorText: { color: "#ff4444", fontSize: 12, marginBottom: 10 },
  button: { width: "100%", height: 50, backgroundColor: "#4169E1", borderRadius: 25, justifyContent: "center", alignItems: "center", marginTop: 20 },
  buttonDisabled: { backgroundColor: "rgba(65,105,225,0.5)" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});