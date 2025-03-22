import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../data/ApiUrl";

const RequestedPropertyForm = ({ closeModal }) => {
  const [propertyTitle, setPropertyTitle] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [Details, setDetails] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);

  const propertyTypes = [
    { label: "Residential", value: "residential" },
    { label: "Commercial", value: "commercial" },
    { label: "Villa", value: "villa" },
    { label: "Land", value: "land" },
  ];

  const getDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await fetch(`${API_URL}/agent/AgentDetails`, {
        method: "GET",
        headers: {
          token: token || "",
        },
      });

      const newDetails = await response.json();
      setDetails(newDetails);
    } catch (error) {
      console.error("Error fetching agent details:", error);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  const handleSubmit = async () => {
    if (!propertyTitle || !propertyType || !location || !budget) {
      Alert.alert("Error", "Please fill all the fields.");
      return;
    }

    const requestData = {
      propertyTitle,
      propertyType,
      location,
      Budget: budget,
      PostedBy: Details.MobileNumber,
    };

    try {
      const response = await fetch(
        `${API_URL}/requestProperty/requestProperty`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", result.message);
        closeModal();
      } else {
        Alert.alert("Error", result.message || "Failed to request property.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setShowDropdown(false);
      }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Requested Property</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. Need 10 acres land"
            value={propertyTitle}
            onChangeText={setPropertyTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Type</Text>
          <TouchableOpacity
            onPress={() => setShowDropdown(!showDropdown)}
            style={styles.input}
          >
            <Text style={{ color: propertyType ? "#000" : "#aaa" }}>
              {propertyTypes.find((item) => item.value === propertyType)
                ?.label || "-- Select Type --"}
            </Text>
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdown}>
              {propertyTypes.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => {
                    setPropertyType(item.value);
                    setShowDropdown(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. Vijayawada"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Budget</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. 50,00,000"
            keyboardType="numeric"
            value={budget}
            onChangeText={setBudget}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleSubmit} style={styles.postButton}>
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    alignSelf: "center",
    borderWidth: 0.5,
    borderColor: "black",
    elevation: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    backgroundColor: "#e91e63",
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  inputGroup: {
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 2,
    borderColor: "#bbb",
    padding: 10,
    borderRadius: 25,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  dropdown: {
    position: "absolute",
    top: 60, // Adjust this value based on your layout
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    zIndex: 999, // Ensure the dropdown is on top
    elevation: 5, // For Android shadow
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  postButton: {
    backgroundColor: "#e91e63",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  cancelButton: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default RequestedPropertyForm;
