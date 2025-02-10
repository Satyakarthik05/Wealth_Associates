import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import imageCompression from "browser-image-compression";
import { API_URL } from "../../data/ApiUrl";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const PostProperty = ({ closeModal }) => {
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [Details, setDetails] = useState({});
  const [PostedBy, setPostedBy] = useState("");
  const [loading, setLoading] = useState(false); // New loading state

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
      setPostedBy(newDetails.MobileNumber);
      setDetails(newDetails);
    } catch (error) {
      console.error("Error fetching agent details:", error);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!propertyType)
      newErrors.propertyType = "Please select a property type.";
    if (!location) newErrors.location = "Location is required.";
    if (!price) newErrors.price = "Price is required.";
    if (!photo) newErrors.photo = "Please upload a photo.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const blobToFile = async (blobUrl, fileName) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  };

  const handlePost = async () => {
    if (validateForm()) {
      setLoading(true); // Start loading
      try {
        let response;
        if (Platform.OS === "web") {
          const file = await blobToFile(photo, "photo.jpg");

          const formData = new FormData();
          formData.append("propertyType", propertyType);
          formData.append("location", location);
          formData.append("price", price);
          formData.append("photo", file);
          formData.append("PostedBy", PostedBy);

          response = await fetch(`${API_URL}/properties/addProperty`, {
            method: "POST",
            body: formData,
          });
        } else {
          const formData = new FormData();
          formData.append("propertyType", propertyType);
          formData.append("location", location);
          formData.append("price", price);
          formData.append("photo", {
            uri: photo,
            name: "photo.jpg",
            type: "image/jpeg",
          });
          formData.append("PostedBy", PostedBy);

          response = await fetch(`${API_URL}/properties/addProperty`, {
            method: "POST",
            body: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }

        const result = await response.json();
        if (response.ok) {
          alert("Success: Property Posted!");
          closeModal();
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error("Error posting property:", error);
        alert("An error occurred while posting the property.");
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  const selectImageFromGallery = async () => {
    try {
      if (Platform.OS !== "web") {
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

        if (!result.canceled) {
          setPhoto(result.assets[0].uri);
        }
      } else {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (event) => {
          const file = event.target.files[0];
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 800,
            useWebWorker: true,
          };
          const compressedFile = await imageCompression(file, options);
          const blobUrl = URL.createObjectURL(compressedFile);
          setPhoto(blobUrl);
        };
        input.click();
      }
    } catch (error) {
      console.error("Error selecting image from gallery:", error);
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      if (Platform.OS !== "web") {
        const permissionResult =
          await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.status !== "granted") {
          alert("Permission is required to use the camera.");
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
        });

        if (!result.canceled) {
          setPhoto(result.assets[0].uri);
        }
      } else {
        alert("Camera functionality is not supported on the web.");
      }
    } catch (error) {
      console.error("Error taking photo with camera:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // Adjust keyboard offset
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Post a Property</Text>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Upload Photo</Text>
          <View style={styles.uploadSection}>
            {photo ? (
              <View>
                <Image source={{ uri: photo }} style={styles.uploadedImage} />
                <Button
                  mode="outlined"
                  style={styles.removeButton}
                  onPress={() => setPhoto(null)}
                >
                  Remove
                </Button>
              </View>
            ) : (
              <View style={styles.uploadOptions}>
                <TouchableOpacity
                  style={styles.uploadPlaceholder}
                  onPress={selectImageFromGallery}
                >
                  <Text style={styles.uploadPlaceholderText}>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.uploadPlaceholder}
                  onPress={takePhotoWithCamera}
                >
                  <MaterialIcons name="camera-alt" size={24} color="#555" />
                  <Text style={styles.uploadPlaceholderText}>Camera</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {errors.photo && <Text style={styles.errorText}>{errors.photo}</Text>}
          <Text style={styles.label}>Property Type</Text>
          <Picker
            selectedValue={propertyType}
            onValueChange={(value) => setPropertyType(value)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Type --" value="" />
            <Picker.Item label="Apartment" value="Apartment" />
            <Picker.Item label="House" value="House" />
            <Picker.Item label="Land" value="Land" />
          </Picker>
          {errors.propertyType && (
            <Text style={styles.errorText}>{errors.propertyType}</Text>
          )}
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. Vijayawada"
            value={location}
            onChangeText={setLocation}
          />
          {errors.location && (
            <Text style={styles.errorText}>{errors.location}</Text>
          )}
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. 50,00,000"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.postButton, loading && styles.disabledButton]}
              onPress={handlePost}
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.postButtonText}>Post</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          {loading && (
            <ActivityIndicator
              style={styles.loadingIndicator}
              size="large"
              color="#D81B60"
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: Platform.OS === "android" ? "90%" : "40%",
    borderRadius: 30,
  },
  scrollContainer: { flexGrow: 1, padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#ccc",
    backgroundColor: "#D81B60",
    width: "100%",
    borderRadius: 20,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  formContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  label: { fontSize: 16, marginBottom: 8, color: "#555" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    height: Platform.OS === "android" ? "" : 40,
  },
  uploadSection: { alignItems: "center", marginBottom: 20 },
  uploadedImageContainer: {
    alignItems: "center",
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  uploadOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  uploadPlaceholder: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  uploadPlaceholderText: { fontSize: 12, color: "#555", marginTop: 5 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  postButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#D81B60",
    borderRadius: 6,
    paddingVertical: 12,
  },
  postButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#000",
    borderRadius: 6,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: { color: "red", fontSize: 12, marginTop: -8, marginBottom: 10 },
  disabledButton: {
    backgroundColor: "#ccc", // Disabled button color
  },
  loadingIndicator: {
    marginTop: 20,
    alignSelf: "center",
  },
});

export default PostProperty;
