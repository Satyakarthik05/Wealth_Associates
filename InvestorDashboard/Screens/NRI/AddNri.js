import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { API_URL } from "../../../data/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddNRIMember = ({ closeModal }) => {
  const [name, setName] = useState("");
  const [country, setCountry] = useState(null);
  const [locality, setLocality] = useState("");
  const [occupation, setOccupation] = useState("");
  const [mobileIN, setMobileIN] = useState("");
  const [mobileCountryNo, setMobileCountryNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [Details, setDetails] = useState({});

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
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
  ]);

  const getDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/nri/getnri`, {
        method: "GET",
        headers: {
          token: `${token}` || "",
        },
      });
      const newDetails = await response.json();
      setDetails(newDetails);
      console.log(Details);
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
          RegisteredBy: "Coremember",
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

  return (
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
      <DropDownPicker
        open={open}
        value={country}
        items={items}
        setOpen={setOpen}
        setValue={setCountry}
        setItems={setItems}
        placeholder="-- Select Country --"
        style={styles.dropdown}
      />

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
          <TouchableOpacity style={styles.addButton} onPress={handleAddMember}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    borderColor: "#ccc",
    borderRadius: 15,
    marginBottom: 10,
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
