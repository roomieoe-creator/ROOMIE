import ScreenWrapper from "@/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {Button, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";

export default function Events() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Roomie</Text>

          <Pressable onPress={() => router.push("/homePage")}>
            <Ionicons
              name="arrow-back-circle-outline"
              size={24}
              color="#000"
            />
          </Pressable>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );


}

const styles = StyleSheet.create ({
    container: {
    padding: 20,
    paddingBottom: 40,
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

})