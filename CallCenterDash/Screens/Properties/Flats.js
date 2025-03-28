import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Checkbox } from "react-native-paper";

const { width } = Dimensions.get("window");

const PropertyForm = ({ closeModal }) => {
  const [bhk, setBhk] = useState("");
  const [area, setArea] = useState("");
  const [carpetArea, setCarpetArea] = useState("");
  const [totalArea, setTotalArea] = useState("");

  // Exclusive checkboxes (single selection)
  const [furnishing, setFurnishing] = useState(null);
  const [projectStatus, setProjectStatus] = useState(null);
  const [facing, setFacing] = useState(null);
  const [carParking, setCarParking] = useState(null);
  const [blankLane, setBlankLane] = useState(null);

  // Multi-checkbox options
  const [facilities, setFacilities] = useState({
    water: false,
    vastu: false,
    documents: false,
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Property Information Form</Text>

      {/* BHK Input */}
      <Text style={styles.heading}>BHK Type</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 2BHK"
        value={bhk}
        onChangeText={setBhk}
      />

      {/* Area Input */}
      <Text style={styles.heading}>Area (sq. ft)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 2400 sq.ft"
        keyboardType="numeric"
        value={area}
        onChangeText={setArea}
      />

      {/* Furnishing Checkboxes */}
      <Text style={styles.heading}>Furnishing</Text>
      <View style={styles.checkboxContainer}>
        {["Semi-Furnished", "Fully-Furnished"].map((option) => (
          <Checkbox.Item
            key={option}
            label={option}
            status={furnishing === option ? "checked" : "unchecked"}
            onPress={() => setFurnishing(furnishing === option ? null : option)}
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
            status={projectStatus === option ? "checked" : "unchecked"}
            onPress={() =>
              setProjectStatus(projectStatus === option ? null : option)
            }
          />
        ))}
      </View>

      {/* Property Facing */}
      <Text style={styles.heading}>Property Facing</Text>
      <View style={styles.checkboxContainer}>
        {["East", "West", "South", "North"].map((direction) => (
          <Checkbox.Item
            key={direction}
            label={direction}
            status={facing === direction ? "checked" : "unchecked"}
            onPress={() => setFacing(facing === direction ? null : direction)}
          />
        ))}
      </View>

      {/* Carpet Area */}
      <Text style={styles.heading}>Carpet Area (sq. ft)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 2000 sq.ft"
        keyboardType="numeric"
        value={carpetArea}
        onChangeText={setCarpetArea}
      />

      {/* Car Parking */}
      <Text style={styles.heading}>Car Parking</Text>
      <View style={styles.checkboxContainer}>
        {["Yes", "No", "No Space"].map((option) => (
          <Checkbox.Item
            key={option}
            label={option}
            status={carParking === option ? "checked" : "unchecked"}
            onPress={() => setCarParking(carParking === option ? null : option)}
          />
        ))}
      </View>

      {/* Total Flat Area */}
      <Text style={styles.heading}>Total Flat Area (sq. ft)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 3000 sq.ft"
        keyboardType="numeric"
        value={totalArea}
        onChangeText={setTotalArea}
      />

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
            status={facilities[key] ? "checked" : "unchecked"}
            onPress={() =>
              setFacilities({ ...facilities, [key]: !facilities[key] })
            }
          />
        ))}
      </View>

      {/* Blank Lane Facility */}
      <Text style={styles.heading}>Blank Lane Facility</Text>
      <View style={styles.checkboxContainer}>
        {["Yes", "No"].map((option) => (
          <Checkbox.Item
            key={option}
            label={option}
            status={blankLane === option ? "checked" : "unchecked"}
            onPress={() => setBlankLane(blankLane === option ? null : option)}
          />
        ))}
      </View>

      {/* Buttons Container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonCancel} onPress={closeModal}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// *Same CSS, Just Made Responsive*
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#E3F2FD",
    flexGrow: 1,
    width: width * 0.4, // Reduced width (was 0.9 before)
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
  },
  buttonCancel: {
    backgroundColor: "#DC3545",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PropertyForm;
