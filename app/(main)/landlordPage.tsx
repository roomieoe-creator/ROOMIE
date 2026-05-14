import ScreenWrapper from "@/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Button,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function LandlordPage() {
  const router = useRouter();

  const [image] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [showFacilities, setShowFacilities] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  // Toggle facility
  const toggleFacility = (facility: string) => {
    if (selectedFacilities.includes(facility)) {
      setSelectedFacilities(selectedFacilities.filter((f) => f !== facility));
    } else {
      setSelectedFacilities([...selectedFacilities, facility]);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Roomie</Text>

          <Pressable onPress={() => router.push("/homePage")}>
            <Ionicons name="arrow-back-circle-outline" size={24} color="#000" />
          </Pressable>
        </View>

        {/* Image Upload */}
        <Pressable style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageText}>+ Add Photos</Text>
              <Text style={styles.subText}>Upload property images</Text>
            </View>
          )}
        </Pressable>

        {/* Address */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            placeholder="e.g. 12 Main Street, Dublin"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />
        </View>

        {/* Price */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price (€ / month)</Text>
          <TextInput
            placeholder="e.g. 1200"
            value={price}
            onChangeText={setPrice}
            style={styles.input}
            keyboardType="numeric"
          />
        </View>

        {/* Facilities */}
        <View style={styles.inputGroup}>
          <Pressable onPress={() => setShowFacilities(true)}>
            <TextInput
              placeholder="Select facilities"
              value={selectedFacilities.join(", ")}
              editable={false}
              style={styles.input}
            />
          </Pressable>

          <Modal visible={showFacilities} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Facilities</Text>

                {["WiFi", "Parking", "Balcony", "Laundry", "Smoking"].map((item) => (
                  <Pressable
                    key={item}
                    style={styles.option}
                    onPress={() => toggleFacility(item)}
                  >
                    <Text
                      style={{
                        color: selectedFacilities.includes(item)
                          ? "#9932cc"
                          : "black",
                        fontWeight: selectedFacilities.includes(item)
                          ? "bold"
                          : "normal",
                      }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}

                <Button
                  title="Close"
                  onPress={() => setShowFacilities(false)}
                />
              </View>
            </View>
          </Modal>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Describe the property..."
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.textArea]}
            multiline
          />
        </View>

        {/* Submit Button */}
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Post Listing</Text>
        </Pressable>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
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

  imageContainer: {
    height: 200,
    borderRadius: 16,
    backgroundColor: "#f2f2f2",
    marginBottom: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
  },
  subText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },

  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 6,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    backgroundColor: "#f7f7f7",
    padding: 14,
    borderRadius: 10,
    fontSize: 14,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#9932cc",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  // ✅ Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
