import React, { useState, useEffect } from "react";
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
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API_URL } from "../data/ApiUrl";

const AddExpertForm = ({ closeModal }) => {
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

  const [constituencies, setConstituencies] = useState([]);

  // Fetch all constituencies
  useEffect(() => {
    const fetchConstituencies = async () => {
      try {
        const response = await fetch(`${API_URL}/alldiscons/alldiscons`);
        if (!response.ok) {
          throw new Error("Failed to fetch constituencies");
        }
        const data = await response.json();

        // Extract all constituencies from all districts
        const allConstituencies = data.flatMap((district) =>
          district.assemblies.map((assembly) => ({
            name: assembly.name,
            district: district.parliament,
          }))
        );

        setConstituencies(allConstituencies);
      } catch (error) {
        console.error("Error fetching constituencies:", error);
        Alert.alert("Error", "Failed to load location data");
      }
    };

    fetchConstituencies();
  }, []);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.expertType ||
      !form.qualification ||
      !form.experience ||
      !form.location ||
      !form.mobile
    ) {
      Alert.alert("Error", "Please fill all the fields.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/expert/registerExpert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: form.name,
          Experttype: form.expertType,
          Qualification: form.qualification,
          Experience: form.experience,
          Locations: form.location,
          Mobile: form.mobile,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", data.message);
        closeModal();
      } else {
        Alert.alert("Error", data.message || "Failed to register expert.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.overlay}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View
            style={[styles.container, { width: isSmallScreen ? "90%" : 350 }]}
          >
            <View style={styles.header}>
              <Text style={styles.headerText}>Add Expert</Text>
            </View>

            {/** Form Fields */}
            {[
              { label: "Name", key: "name", placeholder: "Enter expert name" },
              {
                label: "Qualification",
                key: "qualification",
                placeholder: "Ex. BA LLB",
              },
              {
                label: "Experience",
                key: "experience",
                placeholder: "Ex. 5 Years",
              },
              {
                label: "Mobile",
                key: "mobile",
                placeholder: "Ex. 9063392872",
                keyboardType: "numeric",
              },
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

            {/** Constituency Picker */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location (Constituency)</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={form.location}
                  style={styles.picker}
                  onValueChange={(value) => handleChange("location", value)}
                >
                  <Picker.Item label="-- Select Constituency --" value="" />
                  {constituencies.map((constituency) => (
                    <Picker.Item
                      key={constituency.name}
                      label={constituency.name}
                      value={constituency.name}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/** Expert Type Picker */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Expert Type</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={form.expertType}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    handleChange("expertType", itemValue)
                  }
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
            </View>

            {/** Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
                <Text style={styles.addText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
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
    backgroundColor: "rgba(0,0,0,0.5)",
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
    maxWidth: 400,
    maxHeight: "90%",
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
    overflow: "hidden",
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
