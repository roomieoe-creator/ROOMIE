import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../lib/firebase";

type UserRole = "tenant" | "landlord";
// Tenant location options (Republic of Ireland).
const IRISH_COUNTIES = [
  "Carlow",
  "Cavan",
  "Clare",
  "Cork",
  "Donegal",
  "Dublin City",
  "Dublin, South",
  "Dublin, North",
  "Dublin, West",
  "Dublin 1",
  "Dublin 2",
  "Dublin 3",
  "Dublin 4",
  "Dublin 5",
  "Dublin 6",
  "Dublin 7",
  "Dublin 8",
  "Dublin 9",
  "Dublin 10",
  "Dublin 11",
  "Dublin 12",
  "Dublin 13",
  "Dublin 14",
  "Dublin 15",
  "Dublin 16",
  "Dublin 17",
  "Dublin 18",
  "Dublin 20",
  "Dublin 22",
  "Dublin 23",
  "Dublin 24",
  "Galway",
  "Kerry",
  "Kildare",
  "Kilkenny",
  "Laois",
  "Leitrim",
  "Limerick",
  "Longford",
  "Louth",
  "Mayo",
  "Meath",
  "Monaghan",
  "Offaly",
  "Roscommon",
  "Sligo",
  "Tipperary",
  "Waterford",
  "Westmeath",
  "Wexford",
  "Wicklow",
];

export default function SignUpScreen() {
  const router = useRouter();

  // Role toggle drives which sign-up fields are shown.
  const [role, setRole] = useState<UserRole>("tenant");
  const [firstName, setFirstName] = useState("");
  const [fullName, setFullName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  // Controls the county picker modal + in-modal search.
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [dobError, setDobError] = useState("");

  const [loading, setLoading] = useState(false);

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

  const landlordPhoneDigits = phoneNumber.replace(/\D/g, "");
  // Split tenant full name so Firestore still gets first/last fields.
  const tenantNameParts = fullName.trim().split(/\s+/).filter(Boolean);
  const tenantFirstName = tenantNameParts[0] || "";
  const tenantLastName = tenantNameParts.slice(1).join(" ");

  // Role-specific validation: tenant requires DOB + location.
  const isTenantFormValid =
    fullName.trim().length > 0 &&
    username &&
    email &&
    password &&
    confirmPassword &&
    dob.length === 10 &&
    location &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError &&
    !dobError;

  // Role-specific validation: landlord requires company + phone.
  const isLandlordFormValid =
    firstName &&
    lastName &&
    companyName &&
    landlordPhoneDigits.length >= 7 &&
    email &&
    password &&
    confirmPassword &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError;

  const isFormValid = role === "tenant" ? isTenantFormValid : isLandlordFormValid;

  const onSubmit = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please fix all errors before continuing");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        // Keep shared identity fields consistent across both role types.
        firstName: role === "tenant" ? tenantFirstName : firstName.trim(),
        lastName: role === "tenant" ? tenantLastName : lastName.trim(),
        email: email.trim(),
        userType: role,
        avatarUrl: "",
        createdAt: new Date(),
        // Save only fields relevant to the selected role.
        ...(role === "tenant"
          ? {
              fullName: fullName.trim(),
              username: username.trim(),
              DOB: dob,
              location,
            }
          : {
              fullName: `${firstName.trim()} ${lastName.trim()}`.trim(),
              companyName: companyName.trim(),
              phoneNumber: phoneNumber.trim(),
            }),
      });

      Alert.alert("Success", "Account created!");
      router.replace("/(main)/homePage" as never);
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require("@/assets/images/RoomieLogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.formContainer}>
          {/* Tab selector for tenant vs landlord flows. */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, role === "tenant" && styles.tabButtonActive]}
              onPress={() => setRole("tenant")}
              disabled={loading}
            >
              <Text style={[styles.tabText, role === "tenant" && styles.tabTextActive]}>
                Tenant
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, role === "landlord" && styles.tabButtonActive]}
              onPress={() => setRole("landlord")}
              disabled={loading}
            >
              <Text style={[styles.tabText, role === "landlord" && styles.tabTextActive]}>
                Landlord
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tenant and landlord render different primary fields. */}
          {role === "tenant" ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
              />

              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
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
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={setLastName}
              />

              <TextInput
                style={styles.input}
                placeholder="Company Name"
                placeholderTextColor="#999"
                value={companyName}
                onChangeText={setCompanyName}
              />

              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#999"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </>
          )}

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

          {/* Tenant-only location picker, shown after credential fields. */}
          {role === "tenant" ? (
            <TouchableOpacity
              style={[styles.input, styles.dropdownButton]}
              onPress={() => {
                setLocationSearch("");
                setLocationModalVisible(true);
              }}
              disabled={loading}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !location && styles.dropdownPlaceholderText,
                ]}
              >
                {location || "Location"}
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
            onPress={onSubmit}
            disabled={!isFormValid || loading}
          >
            <Text style={styles.buttonText}>{loading ? "Creating..." : "Create Account"}</Text>
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

        <Modal
          visible={locationModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setLocationModalVisible(false)}
        >
          {/* Bottom-sheet county picker with live search filter. */}
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search county..."
                placeholderTextColor="#999"
                value={locationSearch}
                onChangeText={setLocationSearch}
                autoCapitalize="words"
              />
              <ScrollView style={styles.modalList}>
                {IRISH_COUNTIES.filter((county) =>
                  county.toLowerCase().includes(locationSearch.trim().toLowerCase())
                ).map((county) => (
                  <TouchableOpacity
                    key={county}
                    style={styles.countyOption}
                    onPress={() => {
                      setLocation(county);
                      setLocationSearch("");
                      setLocationModalVisible(false);
                    }}
                  >
                    <Text style={styles.countyOptionText}>{county}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setLocationSearch("");
                  setLocationModalVisible(false);
                }}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
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
