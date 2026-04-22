import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Button, Text, View } from "react-native";

import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";

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
