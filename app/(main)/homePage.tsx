import { Text, View, Button, Alert } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";

import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";

const HomePage = () => {
  const router = useRouter();

  const onLogout = async () => {
    try {
      await signOut(auth); 

      // redirect to login (or welcome)
      router.replace("/welcome");

    } catch {
      Alert.alert("Error", "Failed to log out");
    }
  };

  return (
    <ScreenWrapper>
      <View>
        <Text>Hello</Text>
        <Button title="Logout" onPress={onLogout} />
      </View>
    </ScreenWrapper>
  );
};

export default HomePage;
