import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { API_URL } from "../../data/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddNRIMember = ({ closeModal }) => {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [locality, setLocality] = useState("");
  const [occupation, setOccupation] = useState("");
  const [mobileIN, setMobileIN] = useState("");
  const [mobileCountryNo, setMobileCountryNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [Details, setDetails] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);

  const countries = [
    { label: "United Arab Emirates", value: "uae" },
    { label: "United States of America", value: "usa" },
    { label: "Saudi Arabia", value: "saudi_arabia" },
    { label: "Canada", value: "canada" },
    { label: "United Kingdom", value: "uk" },
    { label: "Australia", value: "australia" },
    { label: "Kuwait", value: "kuwait" },
    { label: "Qatar", value: "qatar" },
    { label: "Oman", value: "oman" },
    { label: "Singapore", value: "singapore" },
  ];

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

  const handleAddMember = async () => {
    if (
      !name ||
      !country ||
      !locality ||
      !occupation ||
      !mobileIN ||
      !mobileCountryNo
    ) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/nri/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: name,
          Country: country,
          Locality: locality,
          Occupation: occupation,
          MobileIN: mobileIN,
          MobileCountryNo: mobileCountryNo,
          AddedBy: Details.MobileNumber
            ? Details.MobileNumber
            : "Wealthassociate",
          RegisteredBy: "WealthAssociate",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", data.message);
        closeModal();
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to connect to server");
    }
    setLoading(false);
  };

  const renderDropdown = () => {
    return (
      <ScrollView style={styles.dropdown}>
        {countries.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={styles.dropdownItem}
            onPress={() => {
              setCountry(item.value);
              setShowDropdown(false);
            }}
          >
            <Text>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <Text style={styles.header}>Add NRI Member</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex. Vijayawada"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              placeholder="-- Select Country --"
              value={
                countries.find((item) => item.value === country)?.label || ""
              }
              onFocus={() => setShowDropdown(true)}
              editable={false}
            />
            {showDropdown && renderDropdown()}

            <Text style={styles.label}>Locality</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex. Dallas"
              value={locality}
              onChangeText={setLocality}
            />

            <Text style={styles.label}>Occupation</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex. Software Engineer"
              value={occupation}
              onChangeText={setOccupation}
            />

            <Text style={styles.label}>Mobile IN (WhatsApp No.)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex. 9063392872"
              keyboardType="phone-pad"
              value={mobileIN}
              onChangeText={setMobileIN}
            />

            <Text style={styles.label}>Mobile Country No (WhatsApp No.)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex. 9063392872"
              keyboardType="phone-pad"
              value={mobileCountryNo}
              onChangeText={setMobileCountryNo}
            />

            <View style={styles.buttonContainer}>
              {loading ? (
                <ActivityIndicator size="large" color="#E91E63" />
              ) : (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddMember}
                >
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              )}
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
    </KeyboardAvoidingView>
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
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
