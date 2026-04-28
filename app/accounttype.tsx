import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";

export default function AccountTypeScreen() {
  const params = useLocalSearchParams<{
    name?: string;
    email?: string;
    password?: string;
    dob?: string;
  }>();

  // Safely extract params as strings
  const name = typeof params.name === "string" ? params.name : "";
  const email = typeof params.email === "string" ? params.email : "";
  const password = typeof params.password === "string" ? params.password : "";
  const dob = typeof params.dob === "string" ? params.dob : "";

  const handleTenant = () => {
    router.push({
      pathname: "/tenantinfo",
      params: {
        name,
        email,
        password,
        dob,
        accountType: "tenant",
      },
    });
  };

  const handleLandlord = () => {
    router.push({
      pathname: "/personalinfo",
      params: {
        name,
        email,
        password,
        dob,
        accountType: "landlord",
      },
    });
  };

  return (
    <ScreenWrapper bg="#8A2BE2">
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.title}>Choose Account Type</Text>

        <Text style={styles.subtitle}>
          Are you looking to rent a property or list one for rent?
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.tenantButton]}
            onPress={handleTenant}
          >
            <Text style={styles.buttonEmoji}>👤</Text>
            <Text style={styles.buttonText}>Tenant</Text>
            <Text style={styles.buttonSubtext}>
              Looking to rent a property
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.landlordButton]}
            onPress={handleLandlord}
          >
            <Text style={styles.buttonEmoji}>🏠</Text>
            <Text style={styles.buttonText}>Landlord</Text>
            <Text style={styles.buttonSubtext}>
              Want to list a property for rent
            </Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
    color: "#fff",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    gap: 20,
  },
  button: {
    width: "100%",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  tenantButton: {
    backgroundColor: "#4169E1",
  },
  landlordButton: {
    backgroundColor: "#32CD32",
  },
  buttonEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  buttonSubtext: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    textAlign: "center",
  },
});
