import { auth } from "@/lib/firebase";
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Alert } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";



import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (text: string) => {
    setEmail(text);
    setEmailError("");

    if (!text) {
      setEmailError("Email is required");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(text)) {
      setEmailError("Please enter a valid email");
      return false;
    }

    return true;
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    setPasswordError("");

    if (!text) {
      setPasswordError("Password is required");
      return false;
    }

    if (text.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    const isValid = validateEmail(email) && validatePassword(password);
    if (!isValid) return;

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );

      // No router.push here

    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const isFormValid =
    email.length > 0 &&
    password.length >= 6 &&
    !emailError &&
    !passwordError;

  return (
    <ScreenWrapper bg="#9932cc">
      <View style={styles.centerContainer}>
        <Image
          source={require("@/assets/images/RoomieLogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Roomie</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={[styles.input, emailError && styles.inputError]}
            placeholder="Email"
            placeholderTextColor="black"
            value={email}
            onChangeText={validateEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <TextInput
            style={[styles.input, passwordError && styles.inputError]}
            placeholder="Password"
            placeholderTextColor="black"
            value={password}
            onChangeText={validatePassword}
            secureTextEntry
          />

          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.button,
              !isFormValid && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={!isFormValid}
          >
            <Text style={styles.buttonText}>Lets Go!</Text>
          </TouchableOpacity>

          <Link href="/signup">
            <Text style={styles.signupLink}>
                Don't have an account? Sign up
             </Text>
            <Text style={styles.signupLink}>
              Don't have an account? Sign up
            </Text>
          </Link>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8A2BE2",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 5,
  },
  title: {
    fontSize: 42,
    fontWeight: "700",
    marginBottom: 60,
    textAlign: "center",
    color: "#fff",
    letterSpacing: 1,
  },
  formContainer: {
    width: 300,
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 25,
    fontSize: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    color: "#333",
    shadowColor: "#000",
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
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: -15,
    marginBottom: 15,
    alignSelf: "flex-start",
    marginLeft: 15,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#4169E1",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    shadowColor: "#4169E1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: "rgba(65,105,225,0.4)",
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  signupLink: {
    color: '#f5f5f5f', //link wont seem to change color
    padding: 10,
    textAlign: "center",
  },
});