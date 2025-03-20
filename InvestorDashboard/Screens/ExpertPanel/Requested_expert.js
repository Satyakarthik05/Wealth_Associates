import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API_URL } from "../../../data/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RequestedExpert = ({ closeModal }) => {
  const [selectedExpert, setSelectedExpert] = useState("");
  const [reason, setReason] = useState("");
  const [Details, setDetails] = useState({});

  const getDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/investors/getinvestor`, {
        method: "GET",
        headers: {
          token: `${token}` || "",
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

  const handleRequest = async () => {
    if (!selectedExpert) {
      Alert.alert("Error", "Please select an expert type.");
      return;
    }

    const requestData = {
      expertType: selectedExpert,
      reason: reason,
      WantedBy: Details ? Details.MobileNumber : "Number",
      UserType: "Investor",
    };

    try {
      const response = await fetch(`${API_URL}/direqexp/direqexp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Request submitted successfully!");
        closeModal();
      } else {
        Alert.alert("Error", result.message || "Failed to submit request.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while submitting the request.");
      console.error(error);
    }
  };

  return (
    <View style={styles.modalContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Requested Expert</Text>
      </View>

      {/* Dropdown */}
      <Text style={styles.label}>Select Expert Type</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedExpert}
          onValueChange={(itemValue) => setSelectedExpert(itemValue)}
          style={styles.picker}
          mode="dropdown"
        >
          <Picker.Item label="-- Select Type --" value="" />
          <Picker.Item label="LEGAL" value="LEGAL" />
          <Picker.Item label="REVENUE" value="REVENUE" />
          <Picker.Item label="ENGINEERS" value="ENGINEERS" />
          <Picker.Item label="ARCHITECTS" value="ARCHITECTS" />
          <Picker.Item label="SURVEY" value="SURVEY" />
          <Picker.Item label="VAASTU PANDITS" value="VAASTU PANDITS" />
          <Picker.Item label="LAND VALUERS" value="LAND VALUERS" />
          <Picker.Item label="BANKING" value="BANKING" />
          <Picker.Item label="AGRICULTURE" value="AGRICULTURE" />
          <Picker.Item
            label="REGISTRATION & DOCUMENTATION"
            value="REGISTRATION & DOCUMENTATION"
          />
          <Picker.Item label="DESIGNING" value="DESIGNING" />
          <Picker.Item
            label="MATERIALS & CONTRACTS"
            value="MATERIALS & CONTRACTS"
          />
        </Picker>
      </View>

      {/* Reason Textbox */}
      <Text style={styles.label}>Reason</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Enter Your Message..."
        placeholderTextColor="#999"
        multiline
        value={reason}
        onChangeText={setReason}
      />

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.requestButton} onPress={handleRequest}>
          <Text style={styles.buttonText}>Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ... (styles remain the same)

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    width: Platform.OS === "android" || Platform.OS === "ios" ? "100%" : "40%",
    marginLeft: 20,
    // height: 360,
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
  },
  header: {
    backgroundColor: "#E91E63",
    width: "100%",
    paddingVertical: 12,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: "center",
    position: "absolute",
    top: 0,
  },
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginTop: 60,
  },
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: "#777",
    borderRadius: 8,
    width: "100%",
    overflow: "hidden",
    marginTop: 5,
    height: Platform.OS === "android" || Platform.OS === "ios" ? 50 : "auto",
  },
  picker: {
    height: 50,
    backgroundColor: "white",
  },
  textArea: {
    borderWidth: 1.5,
    borderColor: "#777",
    borderRadius: 8,
    width: "100%",
    height: 120,
    textAlignVertical: "top",
    padding: 10,
    marginTop: 5,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  requestButton: {
    backgroundColor: "#E91E63",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default RequestedExpert;
