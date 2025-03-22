import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../data/ApiUrl";

const AddInvestor = ({ closeModal }) => {
  const [fullName, setFullName] = useState("");
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [Details, setDetails] = useState(null);
  const [skills, setSkills] = useState(["Land Lord", "Investor"]);
  const [showDropdown, setShowDropdown] = useState(false);

  const getDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/agent/AgentDetails`, {
        method: "GET",
        headers: {
          token: `${token}` || "",
        },
      });
      const newDetails = await response.json();
      setDetails(newDetails);
    } catch (error) {
      console.error("Error fetching agent details:", error);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  const handleRegister = async () => {
    if (!fullName || !skill || !location || !mobileNumber) {
      alert("All fields are required");
      return;
    }

    if (!Details || !Details.MobileNumber) {
      alert("Agent details are not available. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/investors/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          FullName: fullName,
          SelectSkill: skill,
          Location: location,
          MobileNumber: mobileNumber,
          AddedBy: Details.MobileNumber,
          RegisteredBy: "WealthAssociate",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Registration successful");
        setFullName("");
        setSkill("");
        setLocation("");
        setMobileNumber("");
        closeModal();
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderDropdown = () => {
    return (
      <ScrollView style={styles.dropdown}>
        {skills.map((item) => (
          <TouchableOpacity
            key={item}
            style={styles.dropdownItem}
            onPress={() => {
              setSkill(item);
              setShowDropdown(false);
            }}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Register Investor</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            placeholder="Full Name"
          />
          <Text style={styles.label}>Select Category</Text>
          <TextInput
            value={skill}
            onFocus={() => setShowDropdown(true)}
            style={styles.input}
            placeholder="-- Select Skill Type --"
            editable={false}
          />
          {showDropdown && renderDropdown()}
          <Text style={styles.label}>Location</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            style={styles.input}
            placeholder="Location"
          />
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="numeric"
            style={styles.input}
            placeholder="Mobile Number"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Registering..." : "Register"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  dropdown: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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

export default AddInvestor;
