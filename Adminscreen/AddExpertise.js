import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { API_URL } from "../data/ApiUrl"; // Import the API URL

const { width } = Dimensions.get("window"); // Get screen width
const isMobile = width < 600; // Detect mobile devices

const AddExpertiseModal = ({ closeModal }) => {
  const [expertise, setExpertise] = useState(""); // State for expertise name
  const [code, setCode] = useState(""); // State for expertise code

  // Function to handle adding expertise
  const handleAddExpertise = async () => {
    if (!expertise || !code) {
      Alert.alert("Error", "Please enter both expertise name and code.");
      return;
    }

    try {
      // Make a POST request to the backend using fetch
      const response = await fetch(`${API_URL}/discons/addexpertise`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: expertise,
          code: code,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        Alert.alert("Success", "Expertise added successfully!");
        closeModal(); // Close the modal after successful addition
      } else {
        Alert.alert("Error", data.message || "Failed to add expertise.");
      }
    } catch (error) {
      console.error("Error adding expertise:", error);
      Alert.alert("Error", "Failed to add expertise. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.wrapper}
    >
      <View
        style={[
          styles.container,
          {
            width: Platform.OS === "web" ? "80%" : "90%",
            maxWidth: Platform.OS === "web" ? 350 : 400,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Add Expertise</Text>
        </View>

        {/* Input Field for Expertise Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Expertise Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. Open Lands"
            value={expertise}
            onChangeText={setExpertise}
          />
        </View>

        {/* Input Field for Expertise Code */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Expertise Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. 01"
            value={code}
            onChangeText={setCode}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddExpertise}
          >
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

// Styles remain the same as in your original code
const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  container: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  header: {
    width: "100%",
    backgroundColor: "#C73D5D",
    paddingVertical: 15,
    alignItems: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  formGroup: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    marginTop: 5,
    marginLeft: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 25,
    padding: 12,
    backgroundColor: "#FFF",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#C73D5D",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  addText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  cancelText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AddExpertiseModal;
