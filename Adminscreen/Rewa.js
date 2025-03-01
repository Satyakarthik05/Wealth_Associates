import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 600;

const Register = ({ closeModal }) => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [selectedExpertise, setSelectedExpertise] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [location, setLocation] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const districts = [
    { label: "Hyderabad", value: "1" },
    { label: "Vijayawada", value: "2" },
    { label: "Chennai", value: "3" },
  ];

  const constituenciesByDistrict = {
    1: [
      { label: "Kukatpally", value: "1" },
      { label: "Madhapur", value: "2" },
    ],
    2: [
      { label: "Benz Circle", value: "3" },
      { label: "Eluru Road", value: "4" },
    ],
    3: [
      { label: "Anna Nagar", value: "5" },
      { label: "T Nagar", value: "6" },
    ],
  };

  const expertiseOptions = [
    { label: "Finance", value: "1" },
    { label: "Investment", value: "2" },
    { label: "Banking", value: "3" },
    { label: "Insurance", value: "4" },
  ];

  const experienceLevels = [
    { label: "Fresher", value: "1" },
    { label: "1-3 years", value: "2" },
    { label: "3-5 years", value: "3" },
    { label: "5+ years", value: "4" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Register Executive Wealth Associate</Text>

        {/* Full Name & Mobile Number */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} placeholder="Ex. John Doe" />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex. 9063 392872"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* District & Constituency */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>District</Text>
            <Dropdown
              data={districts}
              labelField="label"
              valueField="value"
              placeholder="Select District"
              value={selectedDistrict}
              onChange={(item) => {
                setSelectedDistrict(item.value);
                setSelectedConstituency(null);
              }}
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Constituency</Text>
            <Dropdown
              data={selectedDistrict ? constituenciesByDistrict[selectedDistrict] || [] : []}
              labelField="label"
              valueField="value"
              placeholder="Select Constituency"
              value={selectedConstituency}
              onChange={(item) => setSelectedConstituency(item.value)}
              style={styles.input}
            />
          </View>
        </View>

        {/* Location & Expertise */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex. Vijayawada"
              value={location}
              onChangeText={setLocation}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Expertise</Text>
            <Dropdown
              data={expertiseOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Expertise"
              value={selectedExpertise}
              onChange={(item) => setSelectedExpertise(item.value)}
              style={styles.input}
            />
          </View>
        </View>

        {/* Experience & Referral Code */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Experience</Text>
            <Dropdown
              data={experienceLevels}
              labelField="label"
              valueField="value"
              placeholder="Select Experience"
              value={selectedExperience}
              onChange={(item) => setSelectedExperience(item.value)}
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Referral Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Referral Code"
              value={referralCode}
              onChangeText={setReferralCode}
            />
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: isSmallScreen ? "95%" : "90%",
    maxWidth: 500,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#e91e63",
    textAlign: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    justifyContent: "space-between",
  },
  inputContainer: {
    width: Platform.OS === "web" ? "48%" : "100%",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    width: '98%',
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerButton: {
    backgroundColor: "#e91e63",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Register;