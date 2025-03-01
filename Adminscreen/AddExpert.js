import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const AddExpertForm = ({closeModal }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 400;

  const [form, setForm] = useState({
    name: "",
    expertType: "",
    qualification: "",
    experience: "",
    location: "",
    mobile: "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <View style={styles.overlay}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={[styles.container, { width: isSmallScreen ? "90%" : 350 }]}> 
            <View style={styles.header}>
              <Text style={styles.headerText}>Add Expert</Text>
            </View>

            {/** Form Fields */}
            {[
              { label: "Name", key: "name", placeholder: "Ex. Vijayawada" },
              { label: "Qualification", key: "qualification", placeholder: "Ex. BA LLB" },
              { label: "Experience", key: "experience", placeholder: "Ex. 5 Years" },
              { label: "Location", key: "location", placeholder: "Ex. Vijayawada" },
              { label: "Mobile", key: "mobile", placeholder: "Ex. 9063392872", keyboardType: "numeric" },
            ].map(({ label, key, placeholder, keyboardType }) => (
              <View style={styles.formGroup} key={key}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={placeholder}
                  value={form[key]}
                  onChangeText={(text) => handleChange(key, text)}
                  keyboardType={keyboardType || "default"}
                />
              </View>
            ))}

            {/** Expert Type Picker */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Expert Type</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={form.expertType}
                  style={styles.picker}
                  onValueChange={(itemValue) => handleChange("expertType", itemValue)}
                >
                  <Picker.Item label="-- Select Type --" value="" />
                  <Picker.Item label="0-1 years" value="0-1 years" />
                  <Picker.Item label="2-3 years" value="2-3 years" />
                  <Picker.Item label="4-5 years" value="4-5 years" />
                  <Picker.Item label="5+ years" value="5+ years" />
                </Picker>
              </View>
            </View>

            {/** Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    width: "90%",
  },
  header: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#E91E63",
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
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#F9F9F9",
  },
  pickerWrapper: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    backgroundColor: "#F9F9F9",
  },
  picker: {
    width: "100%",
    height: 50,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  addButton: {
    backgroundColor: "#E91E63",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  addText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  cancelText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AddExpertForm;
