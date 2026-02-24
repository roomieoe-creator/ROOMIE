import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (text: string) => {
    setEmail(text);
    setEmailError("");

    if (!text) return false;

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

    if (!text) return false;

    if (text.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleLogin = () => {
    const isValid = validateEmail(email) && validatePassword(password);
    if (!isValid) return;
    router.push("/");
  };

  const isFormValid =
    email.length > 0 && password.length >= 6 && !emailError && !passwordError;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.centerContainer}>
        <Image
          source={require('@/assets/images/RoomieLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <ThemedText type="title" style={styles.title}>
          Roomie
        </ThemedText>

        <View style={styles.formContainer}>
          <TextInput
            style={[styles.input, emailError && styles.inputError]}
            placeholder="Email"
            placeholderTextColor="#rgba(255,255,255,0.6)"
            value={email}
            onChangeText={validateEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {emailError ? (
            <ThemedText style={styles.errorText}>{emailError}</ThemedText>
          ) : null}

          <TextInput
            style={[styles.input, passwordError && styles.inputError]}
            placeholder="Password"
            placeholderTextColor="#rgba(255,255,255,0.6)"
            value={password}
            onChangeText={validatePassword}
            secureTextEntry
          />
          {passwordError ? (
            <ThemedText style={styles.errorText}>{passwordError}</ThemedText>
          ) : null}

          <TouchableOpacity
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={!isFormValid}
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Lets Go!
            </ThemedText>
          </TouchableOpacity>

          <Link href="/signup" style={styles.signupLink}>
            <ThemedText type="link">Don't have an account? Sign up</ThemedText>
          </Link>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8A2BE2',
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
    fontSize: 42,
    fontWeight: '700',
    marginBottom: 60,
    textAlign: 'center',
    color: '#fff',
    letterSpacing: 1,
  },
  formContainer: {
    width: 300,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    fontSize: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    color: '#333',
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
    marginTop: -15,
    marginBottom: 15,
    alignSelf: 'flex-start',
    marginLeft: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4169E1',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
    //backgroundColor: '#rgba(65,105,225,0.5)',
    backgroundColor: '#dffffd',
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: '#8A2BE2',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  signupLink: {
    color: '#f5f5f5f', //link wont seem to change color
    padding: 10,
  },
});