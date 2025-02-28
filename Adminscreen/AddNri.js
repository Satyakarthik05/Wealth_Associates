import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const AddNRIMember = ({ closeModal }) => {
  const [country, setCountry] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "USA", value: "usa" },
    { label: "UK", value: "uk" },
    { label: "Canada", value: "canada" },
    { label: "India", value: "india" },
  ]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Add NRI Member</Text>

      {/* Name Field */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex. Vijayawada"
        placeholderTextColor="#aaa"
      />

      {/* Country Dropdown */}
      <Text style={styles.label}>Country</Text>
      <DropDownPicker
        open={open}
        value={country}
        items={items}
        setOpen={setOpen}
        setValue={setCountry}
        setItems={setItems}
        placeholder="-- Select Country --"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      {/* Locality Field */}
      <Text style={styles.label}>Locality</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex. Dallas"
        placeholderTextColor="#aaa"
      />

      {/* Occupation Field */}
      <Text style={styles.label}>Occupation</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex. Software Engineer"
        placeholderTextColor="#aaa"
      />

      {/* Mobile IN Field */}
      <Text style={styles.label}>Mobile IN (WhatsApp No.)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex. 9063392872"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
      />

      {/* Mobile Country No Field */}
      <Text style={styles.label}>Mobile Country No (WhatsApp No.)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex. 9063392872"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
      />

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    borderColor: "black",
    width: 320,
    alignSelf: "center",
    elevation: 4,
  },
  header: {
    backgroundColor: "#E91E63",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    color: "#333",
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 15,
    marginBottom: 10,
  },
  dropdownContainer: {
    borderColor: "#000",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#E91E63",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  cancelButton: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AddNRIMember;