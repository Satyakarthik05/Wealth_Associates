import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const RequestedExpert = ({ closeModal }) => {
  const [selectedExpert, setSelectedExpert] = useState("");

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
      />

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.requestButton}>
          <Text style={styles.buttonText}>Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
