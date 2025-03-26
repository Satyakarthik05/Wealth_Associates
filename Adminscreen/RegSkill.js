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

const Rskill = ({ closeModal }) => {
  const [fullName, setFullName] = useState("");
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Register Skilled Resource</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="Ex. John Dhee"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />

        <Text style={styles.label}>Select Skill</Text>
        <View
          style={
            Platform.OS === "web"
              ? styles.pickerWebContainer
              : styles.pickerContainer
          }
        >
          <Picker
            selectedValue={skill}
            onValueChange={(itemValue) => setSkill(itemValue)}
            style={styles.picker} // No border on Picker
          >
            <Picker.Item label="-- Select Skill Type --" value="" />
            <Picker.Item label="Plumber" value="plumber" />
            <Picker.Item label="Electrician" value="electrician" />
          </Picker>
        </View>

        <Text style={styles.label}>Location</Text>
        <TextInput
          placeholder="Ex. Vijayawada"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
        />

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          placeholder="Ex. 9063392872"
          keyboardType="numeric"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          style={styles.input}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => console.log("Registered")}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    backgroundColor: "#E91E63",
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    padding: 12,
    marginBottom: 15,
  },
  // Mobile Picker (Full Rounded)
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 15,
  },
  // Web Picker (Rounded + Single Border)
  pickerWebContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10, // Rounded corners
    overflow: "hidden",
    marginBottom: 15,
    paddingHorizontal: 10, // Added padding for better look
  },
  picker: {
    height: 50,
    width: "100%",
    borderWidth: 0, // Removes default picker border
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  registerButton: {
    backgroundColor: "#E91E63",
    padding: 12,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 25,
    flex: 1,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Rskill;
