import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, CheckBox, Alert, ScrollView, StyleSheet } from "react-native";

const PlotInfoForm = () => {
  const [formData, setFormData] = useState({
    plotLocation: "",
    area: "",
    plotLength: "",
    plotBreadth: "",
    direction: "",
    approvalStatus: "",
    kidsPlayArea: "",
    waterTap: "",
    undergroundDrainage: "",
    security: "",
    compoundWall: "",
    undergroundElectricity: "",
    readyToConstruction: "",
    clubHouse: "",
    swimmingPool: "",
    gymArea: "",
    yogaArea: ""
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCheckboxChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://your-backend-api.com/savePlot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      Alert.alert("Success", "Plot details saved successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to save plot details.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Plot Info</Text>

      <Text style={styles.label}>Plot Location</Text>
      <TextInput style={styles.input} placeholder="Enter Plot Location" onChangeText={(value) => handleInputChange("plotLocation", value)} />
      
      <Text style={styles.label}>Plot Area</Text>
      <TextInput style={styles.input} placeholder="Enter Plot Area" keyboardType="numeric" onChangeText={(value) => handleInputChange("area", value)} />
      
      <Text style={styles.label}>Length</Text>
      <TextInput style={styles.input} placeholder="Enter Length" keyboardType="numeric" onChangeText={(value) => handleInputChange("plotLength", value)} />
      
      <Text style={styles.label}>Breadth</Text>
      <TextInput style={styles.input} placeholder="Enter Breadth" keyboardType="numeric" onChangeText={(value) => handleInputChange("plotBreadth", value)} />
      
      <Text style={styles.label}>Facing Direction</Text>
      <TextInput style={styles.input} placeholder="Enter Facing Direction" onChangeText={(value) => handleInputChange("direction", value)} />

      <Text style={styles.label}>Project Highlights</Text>
      <View style={styles.checkboxContainer}>
        <CheckBox value={formData.approvalStatus === "NonApproved"} onValueChange={() => handleCheckboxChange("approvalStatus", "NonApproved")} />
        <Text style={styles.label}>Non Approved</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox value={formData.approvalStatus === "Approved"} onValueChange={() => handleCheckboxChange("approvalStatus", "Approved")} />
        <Text style={styles.label}>Approved</Text>
      </View>

      {[
        "KidsPlayArea",
        "WaterTap",
        "UndergroundDrainage",
        "Security",
        "CompoundWall",
        "UndergroundElectricity",
        "ReadyToConstruction",
        "ClubHouse",
        "SwimmingPool",
        "GymArea",
        "YogaArea"
      ].map((field) => (
        <View key={field} style={styles.checkgroup}>
          <Text style={styles.label}>{field.replace(/([A-Z])/g, ' $1').trim()}</Text>
          <View style={styles.check}>
          <View style={styles.checkboxContainer}>
            <CheckBox value={formData[field] === "Yes"} onValueChange={() => handleCheckboxChange(field, "Yes")} />
            <Text style={styles.label}>YES</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox value={formData[field] === "No"} onValueChange={() => handleCheckboxChange(field, "No")} />
            <Text style={styles.label}>NO</Text>
          </View>
          </View>
        </View>
      ))}
<View style={styles.buttoncontainer}>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button1} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
  </View>
      {/* <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
    <Text style={styles.buttonText}>Cancel</Text>
  </TouchableOpacity> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width:400,
    backgroundColor:"#E3F2FD"
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    backgroundColor:"#E3F2FD",
    borderRadius:"10px"
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  checkboxContainer: {
     flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap:10
  },
  check:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },
  checkgroup:{
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0D47A1",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width:"40%"
  },
  button1:{
backgroundColor:"#DC3545",
padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width:"40%"
  },
  buttoncontainer:{
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PlotInfoForm;
