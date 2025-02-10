import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../data/ApiUrl";

const RequestedPropertyForm = ({ closeModal }) => {
  const [propertyTitle, setPropertyTitle] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [Details, setDetails] = useState({});

  const getDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await fetch(`${API_URL}/agent/AgentDetails`, {
        method: "GET",
        headers: {
          token: `${token}` || "",
        },
      });

      const newDetails = await response.json();
      setDetails(newDetails);
      console.log(Details);
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
      PostedBy: Details.MobileNumber, // Sending agent's mobile number as PostedBy
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
        closeModal(); // Close the modal after successful submission
      } else {
        Alert.alert("Error", result.message || "Failed to request property.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Requested Property</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Property Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex. Need 10 acres land"
          value={propertyTitle}
          onChangeText={setPropertyTitle}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Property Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={propertyType}
            onValueChange={(itemValue) => setPropertyType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Type --" value="" />
            <Picker.Item label="Residential" value="residential" />
            <Picker.Item label="Commercial" value="commercial" />
            <Picker.Item label="Land" value="land" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex. Vijayawada"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Budget</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex. 50,00,000"
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.postButton} onPress={handleSubmit}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: 320,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: "black",
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
  inputContainer: {
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
  pickerContainer: {
    borderWidth: 2,
    borderColor: "#bbb",
    borderRadius: 25,
    backgroundColor: "#fff",
    overflow: "hidden",
    height: 55,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  picker: {
    height: 55,
    width: "100%",
    borderWidth: 0,
    backgroundColor: "transparent",
    fontSize: 16,
    textAlignVertical: "center",
    paddingBottom: 6,
  },
  buttonContainer: {
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
  postButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
};

export default RequestedPropertyForm;
