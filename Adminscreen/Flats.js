import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { API_URL } from "../data/ApiUrl";

const { width } = Dimensions.get("window");

const PropertyForm = ({ closeModal, propertyId, initialData }) => {
  // Initialize form state with default values
  const [formData, setFormData] = useState({
    bhk: "",
    area: "",
    carpetArea: "",
    totalArea: "",
    furnishing: null,
    projectStatus: null,
    facing: null,
    carParking: null,
    blankLane: null,
    facilities: {
      water: false,
      vastu: false,
      documents: false,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form only once when component mounts
  useEffect(() => {
    if (initialData) {
      setFormData({
        bhk: initialData.bhk || "",
        area: initialData.area || "",
        carpetArea: initialData.carpetArea || "",
        totalArea: initialData.totalArea || "",
        furnishing: initialData.furnishing || null,
        projectStatus: initialData.projectStatus || null,
        facing: initialData.facing || null,
        carParking: initialData.carParking || null,
        blankLane: initialData.blankLane || null,
        facilities: {
          water: initialData.facilities?.water || false,
          vastu: initialData.facilities?.vastu || false,
          documents: initialData.facilities?.documents || false,
        },
      });
    }
  }, []); // Empty dependency array ensures this runs only once

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFacilityChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      facilities: { ...prev.facilities, [key]: value },
    }));
  };

  const handleSubmit = async () => {
    if (!propertyId) {
      Alert.alert("Error", "Property ID is missing");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:3000/properties/${propertyId}/dynamic`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update property");
      }

      Alert.alert("Success", "Property details updated successfully");
      closeModal(true);
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("Error", error.message || "An error occurred while updating");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Update Property Details</Text>

      {/* BHK Input */}
      <Text style={styles.heading}>BHK Type</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 2BHK"
        value={formData.bhk}
        onChangeText={(text) => handleInputChange("bhk", text)}
      />

      {/* Area Input */}
      <Text style={styles.heading}>Area (sq. ft)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 2400 sq.ft"
        keyboardType="numeric"
        value={formData.area}
        onChangeText={(text) => handleInputChange("area", text)}
      />

      {/* Furnishing Checkboxes */}
      <Text style={styles.heading}>Furnishing</Text>
      <View style={styles.checkboxContainer}>
        {["Semi-Furnished", "Fully-Furnished"].map((option) => (
          <Checkbox.Item
            key={option}
            label={option}
            status={formData.furnishing === option ? "checked" : "unchecked"}
            onPress={() =>
              handleInputChange(
                "furnishing",
                formData.furnishing === option ? null : option
              )
            }
          />
        ))}
      </View>

      {/* Project Status */}
      <Text style={styles.heading}>Project Status</Text>
      <View style={styles.checkboxContainer}>
        {["Ready to Move", "Under Construction"].map((option) => (
          <Checkbox.Item
            key={option}
            label={option}
            status={formData.projectStatus === option ? "checked" : "unchecked"}
            onPress={() =>
              handleInputChange(
                "projectStatus",
                formData.projectStatus === option ? null : option
              )
            }
          />
        ))}
      </View>

      {/* Property Facing */}
      <Text style={styles.heading}>Property Facing</Text>
      <View style={styles.checkboxContainer}>
        {["East", "West", "North", "South", "Corner"].map((direction) => (
          <Checkbox.Item
            key={direction}
            label={direction}
            status={formData.facing === direction ? "checked" : "unchecked"}
            onPress={() =>
              handleInputChange(
                "facing",
                formData.facing === direction ? null : direction
              )
            }
          />
        ))}
      </View>

      {/* Carpet Area */}
      <Text style={styles.heading}>Carpet Area (sq. ft)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 2000 sq.ft"
        keyboardType="numeric"
        value={formData.carpetArea}
        onChangeText={(text) => handleInputChange("carpetArea", text)}
      />

      {/* Car Parking */}
      <Text style={styles.heading}>Car Parking</Text>
      <View style={styles.checkboxContainer}>
        {["Yes", "No"].map((option) => (
          <Checkbox.Item
            key={option}
            label={option}
            status={formData.carParking === option ? "checked" : "unchecked"}
            onPress={() =>
              handleInputChange(
                "carParking",
                formData.carParking === option ? null : option
              )
            }
          />
        ))}
      </View>

      {/* Total Flat Area */}
      {/* <Text style={styles.heading}>Total Flat Area (sq. ft)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 3000 sq.ft"
        keyboardType="numeric"
        value={formData.totalArea}
        onChangeText={(text) => handleInputChange("totalArea", text)}
      /> */}

      {/* Project Facilities */}
      <Text style={styles.heading}>Project Facilities</Text>
      <View style={styles.checkboxContainer}>
        {[
          { label: "24-hour Water Supply", key: "water" },
          { label: "100% Vastu", key: "vastu" },
          { label: "Clear Title & Documents", key: "documents" },
        ].map(({ label, key }) => (
          <Checkbox.Item
            key={key}
            label={label}
            status={formData.facilities[key] ? "checked" : "unchecked"}
            onPress={() => handleFacilityChange(key, !formData.facilities[key])}
          />
        ))}
      </View>

      {/* Blank Lane Facility */}
      <Text style={styles.heading}>Bank Loan Facility</Text>
      <View style={styles.checkboxContainer}>
        {["Yes", "No"].map((option) => (
          <Checkbox.Item
            key={option}
            label={option}
            status={formData.blankLane === option ? "checked" : "unchecked"}
            onPress={() =>
              handleInputChange(
                "blankLane",
                formData.blankLane === option ? null : option
              )
            }
          />
        ))}
      </View>

      {/* Buttons Container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.buttonSubmit, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Details</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonCancel, isSubmitting && styles.disabledButton]}
          onPress={() => closeModal(false)}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#E3F2FD",
    flexGrow: 1,
    width: width > 500 ? width * 0.4 : width * 0.9,
    alignSelf: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#0D47A1",
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#1A237E",
  },
  input: {
    borderWidth: 1,
    borderColor: "#90CAF9",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  checkboxContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#64B5F6",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  buttonSubmit: {
    backgroundColor: "#0D47A1",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonCancel: {
    backgroundColor: "#DC3545",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default PropertyForm;
