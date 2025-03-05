import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../data/ApiUrl"; // Ensure this path is correct

const AddCoreClientForm = ({ closeModal }) => {
  const [form, setForm] = useState({
    companyName: "",
    officeAddress: "",
    city: "",
    website: "",
    mobile: "",
    logo: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.companyName) newErrors.companyName = "Company name is required.";
    if (!form.officeAddress)
      newErrors.officeAddress = "Office address is required.";
    if (!form.city) newErrors.city = "City is required.";
    if (!form.mobile) newErrors.mobile = "Mobile number is required.";
    if (!form.logo) newErrors.logo = "Logo is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddClient = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("companyName", form.companyName);
        formData.append("officeAddress", form.officeAddress);
        formData.append("city", form.city);
        formData.append("website", form.website);
        formData.append("mobile", form.mobile);
        if (form.logo) {
          formData.append("logo", {
            uri: form.logo,
            name: "logo.jpg",
            type: "image/jpeg",
          });
        }

        const response = await fetch(`${API_URL}/coreclient/addCoreClient`, {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const result = await response.json();
        if (response.ok) {
          Alert.alert("Success", "Core client added successfully!");
          closeModal();
        } else {
          Alert.alert("Error", result.message || "Failed to add core client.");
        }
      } catch (error) {
        console.error("Error adding core client:", error);
        Alert.alert("Error", "An error occurred while adding the core client.");
      } finally {
        setLoading(false);
      }
    }
  };

  const selectImageFromGallery = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.status !== "granted") {
        alert("Permission is required to upload a photo.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setForm({ ...form, logo: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Error selecting image from gallery:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Add Core Client</Text>
      </View>

      <Text style={styles.label}>Logo</Text>
      <TouchableOpacity
        onPress={selectImageFromGallery}
        style={styles.uploadContainer}
      >
        {form.logo ? (
          <Image source={{ uri: form.logo }} style={styles.logo} />
        ) : (
          <View style={styles.uploadRow}>
            <Ionicons name="cloud-upload-outline" size={20} color="#555" />
            <Text style={styles.uploadText}> Upload Logo</Text>
          </View>
        )}
      </TouchableOpacity>
      {errors.logo && <Text style={styles.errorText}>{errors.logo}</Text>}

      <Text style={styles.label}>Company Name</Text>
      <TextInput
        placeholder="Ex. Harischandra Townships"
        style={styles.input}
        value={form.companyName}
        onChangeText={(text) => setForm({ ...form, companyName: text })}
      />
      {errors.companyName && (
        <Text style={styles.errorText}>{errors.companyName}</Text>
      )}

      <Text style={styles.label}>Office Address</Text>
      <TextInput
        placeholder="Ex. Road no.1, Srinivasa Nagar Colony"
        style={styles.input}
        value={form.officeAddress}
        onChangeText={(text) => setForm({ ...form, officeAddress: text })}
      />
      {errors.officeAddress && (
        <Text style={styles.errorText}>{errors.officeAddress}</Text>
      )}

      <Text style={styles.label}>City</Text>
      <TextInput
        placeholder="Ex. Vijayawada"
        style={styles.input}
        value={form.city}
        onChangeText={(text) => setForm({ ...form, city: text })}
      />
      {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

      <Text style={styles.label}>Website</Text>
      <TextInput
        placeholder="Ex. www.wealthassociatesindia.com"
        style={styles.input}
        value={form.website}
        onChangeText={(text) => setForm({ ...form, website: text })}
      />

      <Text style={styles.label}>Mobile</Text>
      <TextInput
        placeholder="Ex. 9063392872"
        style={styles.input}
        keyboardType="phone-pad"
        value={form.mobile}
        onChangeText={(text) => setForm({ ...form, mobile: text })}
      />
      {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.addButton, loading && styles.disabledButton]}
          onPress={handleAddClient}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Add</Text>
          )}
        </TouchableOpacity>
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
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#000",
    width: 350,
    padding: 20,
    alignSelf: "center",
  },
  headerContainer: {
    backgroundColor: "#D81B60",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 25,
    padding: 10,
    marginVertical: 5,
  },
  uploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  uploadRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  uploadText: {
    color: "#555",
    fontWeight: "bold",
    marginLeft: 5,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#D81B60",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
});

export default AddCoreClientForm;
