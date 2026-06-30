import ScreenWrapper from "@/components/ScreenWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { updateEmail, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { auth, db } from "../lib/firebase";

export default function SignUpScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [isExistingUser, setIsExistingUser] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [dobError, setDobError] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadExistingProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setIsExistingUser(true);

      setEmail(user.email ?? "");

      try {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.firstName) setFirstName(data.firstName);
          else if (data.fullName) setFirstName(data.fullName);
          if (data.secondName) setSecondName(data.secondName);
          else if (data.username) setSecondName(data.username);
          if (data.DOB) setDob(data.DOB);
        }
      } catch (error) {
        console.log("Error loading saved signup data:", error);
      }
    };

    const loadPendingIfAny = async () => {
      try {
        const pendingRaw = await AsyncStorage.getItem("pendingSignup");
        if (pendingRaw && !auth.currentUser) {
          const pending = JSON.parse(pendingRaw);
          if (pending.firstName) setFirstName(pending.firstName);
          else if (pending.fullName) setFirstName(pending.fullName);
          if (pending.secondName) setSecondName(pending.secondName);
          else if (pending.username) setSecondName(pending.username);
          if (pending.email) setEmail(pending.email);
          if (pending.DOB) setDob(pending.DOB);
          // keep password blank for safety; user can re-enter if needed
          setIsExistingUser(false);
        }
      } catch (e) {
        console.log('No pending signup found:', e);
      }
    };

    loadExistingProfile();
    loadPendingIfAny();
  }, []);

  const validateEmail = (text: string) => {
    setEmail(text);
    setEmailError("");
    const regex = /\S+@\S+\.\S+/;
    if (!regex.test(text)) setEmailError("Please enter a valid email");
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    setPasswordError("");
    const errors: string[] = [];
    if (text.length < 6) errors.push("at least 6 characters");
    if (!/[A-Z]/.test(text)) errors.push("a capital letter");
    if (!/\d/.test(text)) errors.push("a number");
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(text)) errors.push("a special character");
    if (errors.length > 0)
      setPasswordError(`Password must contain: ${errors.join(", ")}`);
    if (confirmPassword && text !== confirmPassword)
      setConfirmPasswordError("Passwords do not match");
    else setConfirmPasswordError("");
  };

  const validateConfirmPassword = (text: string) => {
    setConfirmPassword(text);
    if (text !== password) setConfirmPasswordError("Passwords do not match");
    else setConfirmPasswordError("");
  };

  const formatDOB = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 4) {
      cleaned =
        cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4) + "/" + cleaned.slice(4, 8);
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
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;

    if (age < 17) {
      setDobError("You must be at least 17 years old");
      return false;
    }

    setDobError("");
    return true;
  };

  const isTenantFormValid =
    firstName.trim().length > 0 &&
    secondName.trim().length > 0 &&
    email &&
    (isExistingUser || (password && confirmPassword)) &&
    dob.length === 10 &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError &&
    !dobError;

  const isFormValid = isTenantFormValid;

  const onSubmit = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please fix all errors before continuing");
      return;
    }

    try {
      setLoading(true);
      const currentUser = auth.currentUser;

      if (currentUser) {
        if (currentUser.email !== email.trim()) {
          await updateEmail(currentUser, email.trim());
        }

        try {
          await updateProfile(currentUser, { displayName: `${firstName.trim()} ${secondName.trim()}` });
        } catch (e) {
          console.log('Failed to update auth profile displayName:', e);
        }

        await setDoc(
          doc(db, "users", currentUser.uid),
          {
            firstName: firstName.trim(),
            secondName: secondName.trim(),
            email: email.trim(),
            userType: "tenant",
            avatarUrl: "",
            fullName: `${firstName.trim()} ${secondName.trim()}`,
            username: secondName.trim(),
            DOB: dob,
            hasCompletedFilter: false,
          },
          { merge: true }
        );

        Alert.alert("Success", "Account details updated.");
        router.replace("/post-signup" as never);
      } else {
        // Persist the signup data temporarily and continue to post-signup
        const pending = {
          firstName: firstName.trim(),
          secondName: secondName.trim(),
          email: email.trim(),
          password: password.trim(),
          DOB: dob,
        };
        await AsyncStorage.setItem("pendingSignup", JSON.stringify(pending));
        router.replace("/post-signup" as never);
      }
    } catch (error: any) {
      console.log("FULL ERROR:", error);
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "Email already in use");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "Invalid email");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Error", "Weak password");
      } else {
        Alert.alert("Error", error.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper bg="#9932cc">
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Image
          source={require("@/assets/images/RoomieLogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#999"
            value={firstName}
            onChangeText={setFirstName}
          />

          <TextInput
            style={styles.input}
            placeholder="Second Name"
            placeholderTextColor="#999"
            value={secondName}
            onChangeText={setSecondName}
          />

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
          {confirmPasswordError ? (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
            onPress={onSubmit}
            disabled={!isFormValid || loading}
          >
            <Text style={styles.buttonText}>{loading ? "Continuing..." : "Continue"}</Text>
          </TouchableOpacity>

          <View style={styles.bottomTextContainer}>
            <Text style={styles.infoText}>Already have an account? </Text>
            <Pressable
              onPress={() => router.push("/login")}
              disabled={loading}
            >
              <Text style={styles.loginText}>Login</Text>
            </Pressable>
          </View>

        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 30,
    color: "#fff",
  },
  formContainer: {
    width: 300,
    alignItems: "center",
  },
  tabContainer: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderRadius: 25,
    padding: 4,
    marginBottom: 18,
  },
  tabButton: {
    flex: 1,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 21,
  },
  tabButtonActive: {
    backgroundColor: "#fff",
  },
  tabText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#5f1ca9",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  dropdownButton: {
    justifyContent: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#222",
  },
  dropdownPlaceholderText: {
    color: "#999",
  },
  inputError: {
    borderWidth: 2,
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 8,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#4169E1",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "rgba(65,105,225,0.5)",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
  },
  loginText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    fontSize: 15,
    color: "#222",
    backgroundColor: "#fff",
  },
  modalList: {
    marginBottom: 12,
  },
  countyOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  countyOptionText: {
    fontSize: 16,
    color: "#222",
  },
  modalCloseButton: {
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
