import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";

const RequestedPropertyForm = ({ closeModal }) => {
  const [propertyType, setPropertyType] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Requested Property</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Property Title</Text>
        <TextInput style={styles.input} placeholder="Ex. Need 10 acres land" />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Property Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={propertyType}
            onValueChange={(itemValue) => setPropertyType(itemValue)}
            style={styles.picker}
          >
            <Text style={styles.label}>--Select Type--</Text>
            <Picker.Item label="-- Select Type --" value="" />
            <Picker.Item label="Residential" value="residential" />
            <Picker.Item label="Commercial" value="commercial" />
            <Picker.Item label="Land" value="land" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.input} placeholder="Ex. Vijayawada" />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Budget</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex. 50,00,000"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.postButton}>
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
    // marginTop: "20%",
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
    height: 55, // Increase height slightly for proper text visibility
    justifyContent: "center",
    paddingHorizontal: 10, // Ensures text has enough space
  },
  picker: {
    height: 55, // Matches container height
    width: "100%",
    borderWidth: 0,
    backgroundColor: "transparent",
    fontSize: 16, // Adjust font size to fit properly
    textAlignVertical: "center", // Ensures text is centered (Android fix)
    paddingBottom: 6, // Extra padding to prevent text from cutting off
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
