import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Platform,
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
  const [constituencies, setConstituencies] = useState([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationList, setShowLocationList] = useState(false);

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
    fetchConstituencies();
  }, []);

  const fetchConstituencies = async () => {
    try {
      const response = await fetch(`${API_URL}/alldiscons/alldiscons`);
      const data = await response.json();
      setConstituencies(data);
    } catch (error) {
      console.error("Error fetching constituencies:", error);
    }
  };

  const filteredConstituencies = constituencies.flatMap((item) =>
    item.assemblies.filter((assembly) =>
      assembly.name.toLowerCase().includes(locationSearch.toLowerCase())
    )
  );

  const handleRegister = async () => {
    if (!fullName || !skill || !location || !mobileNumber) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (!Details || !Details.MobileNumber) {
      Alert.alert(
        "Error",
        "Agent details are not available. Please try again."
      );
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
          AddedBy: "Admin",
          RegisteredBy: "Admin",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Registration successful");
        setFullName("");
        setSkill("");
        setLocation("");
        setMobileNumber("");
        closeModal();
      } else {
        Alert.alert("Error", data.message || "Registration failed");
      }
    } catch (error) {
      Alert.alert("Error", "Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderDropdown = () => {
    return (
      <View style={styles.dropdownContainer}>
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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
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
            <TouchableOpacity
              onPress={() => {
                setShowDropdown(!showDropdown);
                setShowLocationList(false);
                Keyboard.dismiss();
              }}
              style={styles.input}
            >
              <Text style={{ color: skill ? "#000" : "#aaa" }}>
                {skill || "-- Select Skill Type --"}
              </Text>
            </TouchableOpacity>
            {showDropdown && renderDropdown()}

            <Text style={styles.label}>Location</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ex. Vijayawada"
                value={locationSearch}
                onChangeText={(text) => {
                  setLocationSearch(text);
                  setShowLocationList(true);
                }}
                onFocus={() => {
                  setShowLocationList(true);
                  setShowDropdown(false);
                }}
              />
              {showLocationList && filteredConstituencies.length > 0 && (
                <View style={styles.locationListContainer}>
                  <ScrollView
                    style={styles.locationList}
                    keyboardShouldPersistTaps="always"
                  >
                    {filteredConstituencies.map((item) => (
                      <TouchableOpacity
                        key={`${item.code}-${item.name}`}
                        style={styles.locationListItem}
                        onPress={() => {
                          setLocation(item.name);
                          setLocationSearch(item.name);
                          setShowLocationList(false);
                        }}
                      >
                        <Text>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

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
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Register</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
  inputContainer: {
    marginBottom: 15,
    zIndex: 1, // Add this to establish stacking context
  },
  dropdownContainer: {
    position: "absolute",
    top: 100, // Adjust this value based on your layout
    left: 20,
    right: 20,
    zIndex: 10, // Higher than other elements
  },
  locationListContainer: {
    position: "absolute",
    top: 45, // Position right below the input field
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    maxHeight: 200,
    zIndex: 10, // Higher than other elements
    elevation: 5, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  // locationListContainer: {
  //   position: "absolute",
  //   top: "100%",
  //   left: 0,
  //   right: 0,
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  //   borderRadius: 5,
  //   backgroundColor: "#fff",
  //   maxHeight: 200,
  //   zIndex: 2,
  // },
  locationList: {
    maxHeight: 200,
  },
  locationListItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  registerButton: {
    backgroundColor: "#E91E63",
    padding: 12,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 25,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AddInvestor;
