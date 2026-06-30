import ScreenWrapper from "@/components/ScreenWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { auth, db } from "../lib/firebase";

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

export default function FilterPreferencesScreen() {
  const router = useRouter();
  const [area, setArea] = useState("");
  const [areaModalVisible, setAreaModalVisible] = useState(false);
  const [areaSearch, setAreaSearch] = useState("");
  const [maxRoommates, setMaxRoommates] = useState("2");
  const [budgetMin, setBudgetMin] = useState("400");
  const [budgetMax, setBudgetMax] = useState("1200");
  const [loading, setLoading] = useState(false);
  const [backDestination, setBackDestination] = useState("/signup");

  useEffect(() => {
    const checkSignupFlow = async () => {
      const pendingSignup = await AsyncStorage.getItem("pendingSignup");
      const filterFromSettings = await AsyncStorage.getItem("filterAccessedFromSettings");
      const user = auth.currentUser;

      if (!pendingSignup && !user) {
        router.replace("/signup");
      }

      if (filterFromSettings === "true" && user) {
        setBackDestination("/(main)/settings-profile");
      } else {
        setBackDestination("/signup");
      }
    };

    checkSignupFlow();
  }, [router]);

  const handleSubmit = async () => {
    if (!area.trim()) {
      Alert.alert("Hold On!", "Please enter the area you're interested in.");
      return;
    }

    const min = Number(budgetMin);
    const max = Number(budgetMax);
    const roommates = Number(maxRoommates);

    /*if (!roommates || roommates == null) {
      Alert.alert("Hold On!", "Please choose a valid max number of roommates.");
      return;
    }*/

    if (!min || !max || min > max) {
      Alert.alert("Hold On!", "Please provide a valid budget range.");
      return;
    }

    setLoading(true);
    try {
      let user = auth.currentUser;

      // If there's no auth user, try to create one from pending signup stored earlier
      if (!user) {
        const pendingRaw = await AsyncStorage.getItem("pendingSignup");
        if (!pendingRaw) {
          Alert.alert("Error", "No signup data found. Please complete the signup form.");
          setLoading(false);
          return;
        }

        const pending = JSON.parse(pendingRaw) as {
          fullName: string;
          username: string;
          email: string;
          password: string;
          DOB?: string;
        };

        const cred = await createUserWithEmailAndPassword(
          auth,
          pending.email,
          pending.password
        );
        user = cred.user;

        try {
          await updateProfile(user, { displayName: pending.username });
        } catch (e) {
          console.log("Failed to update profile on creation:", e);
        }

        // seed basic user doc
        await setDoc(
          doc(db, "users", user.uid),
          {
            firstName: pending.fullName?.split(" \u0020")[0] || "",
            lastName: pending.fullName?.split(" \u0020").slice(1).join(" ") || "",
            email: pending.email,
            userType: "tenant",
            avatarUrl: "",
            createdAt: new Date(),
            fullName: pending.fullName,
            username: pending.username,
            DOB: pending.DOB || null,
          },
          { merge: true }
        );

        await AsyncStorage.removeItem("pendingSignup");
      }

      // merge preferences into user doc
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          preferences: {
            area: area.trim(),
            maxRoommates: roommates,
            budgetMin: min,
            budgetMax: max,
          },
          hasCompletedFilter: true,
          filterCompletedAt: new Date(),
        },
        { merge: true }
      );

      await AsyncStorage.setItem("hasCompletedFilter", "true");
      await AsyncStorage.removeItem("filterAccessedFromSettings");
      router.replace("/(main)/homePage");
    } catch (error: unknown) {
      Alert.alert(
        "Save failed",
        error instanceof Error ? error.message : "Unable to save preferences"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={async () => {
              if (backDestination === "/(main)/settings-profile") {
                await AsyncStorage.removeItem("filterAccessedFromSettings");
              }
              router.push(backDestination as never);
            }}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.heading}>Tell us what you want</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Area you're interested in</Text>
          <TouchableOpacity
            style={[styles.input, styles.dropdownButton]}
            onPress={() => {
              setAreaSearch("");
              setAreaModalVisible(true);
            }}
            disabled={loading}
          >
            <Text
              style={[
                styles.dropdownText,
                !area && styles.dropdownPlaceholderText,
              ]}
            >
              {area || "Select a county or area"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Max roommates</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 2"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={maxRoommates}
            onChangeText={setMaxRoommates}
          />
        </View>

        <View style={styles.fieldRow}>
          <View style={styles.fieldHalf}>
            <Text style={styles.label}>Budget min</Text>
            <TextInput
              style={styles.input}
              placeholder="€400"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={budgetMin}
              onChangeText={setBudgetMin}
            />
          </View>
          <View style={styles.fieldHalf}>
            <Text style={styles.label}>Budget max</Text>
            <TextInput
              style={styles.input}
              placeholder="€1200"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={budgetMax}
              onChangeText={setBudgetMax}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Creating..." : "Create Account"}</Text>
        </TouchableOpacity>

        <Modal
          visible={areaModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setAreaModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Select County or Area</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search county or area..."
                placeholderTextColor="#999"
                value={areaSearch}
                onChangeText={setAreaSearch}
                autoCapitalize="words"
              />
              <ScrollView style={styles.modalList}>
                {IRISH_COUNTIES.filter((county) =>
                  county.toLowerCase().includes(areaSearch.trim().toLowerCase())
                ).map((county) => (
                  <TouchableOpacity
                    key={county}
                    style={styles.countyOption}
                    onPress={() => {
                      setArea(county);
                      setAreaSearch("");
                      setAreaModalVisible(false);
                    }}
                  >
                    <Text style={styles.countyOptionText}>{county}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setAreaSearch("");
                  setAreaModalVisible(false);
                }}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={styles.note}>
          You can change these later in your profile if needed.
        </Text>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 12,
    color: "#1f1f1f",
  },
  subheading: {
    fontSize: 16,
    marginBottom: 24,
    color: "#444",
  },
  field: {
    marginBottom: 18,
  },
  fieldRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  fieldHalf: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    width: "100%",
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111",
    backgroundColor: "#fafafa",
  },
  button: {
    marginTop: 12,
    backgroundColor: "#9932cc",
    borderRadius: 25,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  note: {
    marginTop: 20,
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 18,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
  },
  backButtonText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "600",
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
