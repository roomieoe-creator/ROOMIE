import ScreenWrapper from "@/components/ScreenWrapper";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { auth } from "../../lib/firebase";

const HomePage = () => {
  const router = useRouter();

  const onLogout = async () => {
    try {
      await signOut(auth);
      // No need to manually navigate — onAuthStateChanged will handle it
    } catch (error) {
      Alert.alert("Error", "Failed to log out");
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Roomie</Text>

          <View style={styles.icons}>
            {/* Logout button */}
            <Pressable onPress={onLogout}>
              <Feather name="log-out" size={18} color="#000" />
            </Pressable>

            <Pressable onPress={() => router.push("/welcome")}>
              <Feather name="plus-circle" size={24} color="#000" />
            </Pressable>

            <Pressable onPress={() => router.push("/welcome")}>
              <Feather name="bell" size={24} color="#000" />
            </Pressable>
          </View>
        </View>

        <View style={styles.canvas}>
          <Text style={styles.canvasText}>Your content goes here</Text>
        </View>

        <View style={styles.bottomBar}>
          <Pressable style={styles.icons}>
            <MaterialCommunityIcons name="party-popper" size={24} />
          </Pressable>

          <Pressable style={styles.icons}>
            <Feather name="message-circle" size={24} />
          </Pressable>

          <Pressable style={styles.icons}>
            <Feather name="user" size={24} />
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: 16,
  },
  title: {
    color: "black",
    fontSize: 22,
    fontWeight: "bold",
  },
  pill: {
    position: "absolute",
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  canvas: {
    flex: 1,
    margin: 16,
    marginBottom: 90,
    backgroundColor: "grey",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  canvasText: {
    color: "#000",
    fontSize: 16,
  },
});
