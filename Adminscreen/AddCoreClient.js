import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const AddCoreClientForm = ({closeModal}) => {
  const [form, setForm] = useState({
    companyName: "",
    officeAddress: "",
    city: "",
    website: "",
    mobile: "",
    logo: null,
  });

  // const pickImage = () => {
  //   ImagePicker.launchImageLibrary({ mediaType: "photo" }, (response) => {
  //     if (!response.didCancel && !response.error) {
  //       setForm({ ...form, logo: response.assets[0].uri });
  //     }
  //   });
  // };
  const selectImageFromGallery = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.status !== "granted") {
        alert("Permission is required to upload a photo.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Correct option
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0].uri);
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
      <TouchableOpacity onPress={selectImageFromGallery} style={styles.uploadContainer}>
        {form.logo ? (
          <Image source={{ uri: form.logo }} style={styles.logo} />
        ) : (
          <View style={styles.uploadRow}>
            <Ionicons name="cloud-upload-outline" size={20} color="#555" />
            <Text style={styles.uploadText}> Upload Logo</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <Text style={styles.label}>Company Name</Text>
      <TextInput
        placeholder="Ex. Harischandra Townships"
        style={styles.input}
        value={form.companyName}
        onChangeText={(text) => setForm({ ...form, companyName: text })}
      />
      
      <Text style={styles.label}>Office Address</Text>
      <TextInput
        placeholder="Ex. Road no.1, Srinivasa Nagar Colony"
        style={styles.input}
        value={form.officeAddress}
        onChangeText={(text) => setForm({ ...form, officeAddress: text })}
      />
      
      <Text style={styles.label}>City</Text>
      <TextInput
        placeholder="Ex. Vijayawada"
        style={styles.input}
        value={form.city}
        onChangeText={(text) => setForm({ ...form, city: text })}
      />
      
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.buttonText}>Add</Text>
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
});

export default AddCoreClientForm;