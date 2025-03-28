import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function AgricultureForm() {
  const [formData, setFormData] = useState({
    passBook: "",
    oneB: "",
    rrsr: "",
    fmb: "",
    surveyNumber: "",
    boundaries: "",
  });

  const handleOption = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    Alert.alert("Form Submitted", JSON.stringify(formData, null, 2));
    console.log("Form Data -->", formData);
  };

  const handleCancel = () => {
    setFormData({
      passBook: "",
      oneB: "",
      rrsr: "",
      fmb: "",
      surveyNumber: "",
      boundaries: "",
    });
    Alert.alert("Form Cleared");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Agriculture</Text>

      {/* Yes / No with Tick Box */}
      {["passBook", "oneB", "rrsr", "fmb"].map((item) => (
        <View key={item} style={styles.optionRow}>
          <Text style={styles.label}>{item.toUpperCase()}</Text>

          <TouchableOpacity
            style={styles.checkOption}
            onPress={() => handleOption(item, "Yes")}
          >
            <View
              style={[
                styles.checkbox,
                formData[item] === "Yes" && styles.checked,
              ]}
            >
              {formData[item] === "Yes" && <Text style={styles.tick}>✓</Text>}
            </View>
            <Text>Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkOption}
            onPress={() => handleOption(item, "No")}
          >
            <View
              style={[
                styles.checkbox,
                formData[item] === "No" && styles.checked,
              ]}
            >
              {formData[item] === "No" && <Text style={styles.tick}>✓</Text>}
            </View>
            <Text>No</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Survey Number */}
      <Text style={styles.label}>Survey Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Survey Number"
        value={formData.surveyNumber}
        onChangeText={(text) => handleOption("surveyNumber", text)}
      />

      {/* Boundaries */}
      <Text style={styles.label}>Boundaries</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Boundaries"
        value={formData.boundaries}
        onChangeText={(text) => handleOption("boundaries", text)}
      />

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignSelf: "center",
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#E3F2FD",
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
  checkOption: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#555",
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  tick: {
    color: "#fff",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "#0D47A1",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#DC3545",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
