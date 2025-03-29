import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { API_URL } from "../../../data/ApiUrl";

const AddExpertForm = ({ closeModal }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 400;

  const [form, setForm] = useState({
    name: "",
    expertType: "",
    qualification: "",
    experience: "",
    location: "",
    mobile: "",
  });

  const [photo, setPhoto] = useState(null);
  const [file, setFile] = useState(null);
  const [constituencies, setConstituencies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all constituencies
  useEffect(() => {
    const fetchConstituencies = async () => {
      try {
        const response = await fetch(`${API_URL}/alldiscons/alldiscons`);
        if (!response.ok) {
          throw new Error("Failed to fetch constituencies");
        }
        const data = await response.json();

        // Extract all constituencies from all districts
        const allConstituencies = data.flatMap((district) =>
          district.assemblies.map((assembly) => ({
            name: assembly.name,
            district: district.parliament,
          }))
        );

        setConstituencies(allConstituencies);
      } catch (error) {
        console.error("Error fetching constituencies:", error);
        Alert.alert("Error", "Failed to load location data");
      }
    };

    fetchConstituencies();
  }, []);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // Select image from gallery
  const selectImageFromGallery = async () => {
    try {
      if (Platform.OS === "web") {
        // Handle image selection for web
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPhoto(imageUrl); // Set the image URL for display
            setFile(file); // Store the file for FormData
          }
        };
        input.click();
      } else {
        // Handle image selection for mobile
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.status !== "granted") {
          Alert.alert("Permission is required to upload a photo.");
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          setPhoto(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error("Error selecting image from gallery:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  // Take photo with camera
  const takePhotoWithCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Camera permission is required to take a photo.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error opening camera:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.expertType ||
      !form.qualification ||
      !form.experience ||
      !form.location ||
      !form.mobile ||
      !photo
    ) {
      Alert.alert("Error", "Please fill all the fields and upload a photo.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("Name", form.name);
      formData.append("Experttype", form.expertType);
      formData.append("Qualification", form.qualification);
      formData.append("Experience", form.experience);
      formData.append("Locations", form.location);
      formData.append("Mobile", form.mobile);

      // Handle image upload
      if (photo) {
        if (Platform.OS === "web") {
          if (file) {
            // Append the file for web
            formData.append("photo", file);
          } else if (typeof photo === "string" && photo.startsWith("blob:")) {
            // Convert Blob URL to File
            const response = await fetch(photo);
            const blob = await response.blob();
            const file = new File([blob], "photo.jpg", { type: blob.type });
            formData.append("photo", file);
          }
        } else {
          // Append the image URI for mobile
          formData.append("photo", {
            uri: photo,
            name: "photo.jpg",
            type: "image/jpeg",
          });
        }
      } else {
        Alert.alert("Error", "No photo selected.");
        return;
      }

      const response = await fetch(`${API_URL}/expert/registerExpert`, {
        method: "POST",
        body: formData,
        headers: {
          // Don't set Content-Type for FormData, it is automatically set
        },
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", data.message);
        closeModal();
      } else {
        Alert.alert("Error", data.message || "Failed to register expert.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.overlay}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View
            style={[styles.container, { width: isSmallScreen ? "90%" : 350 }]}
          >
            <View style={styles.header}>
              <Text style={styles.headerText}>Add Expert</Text>
            </View>

            {/** Photo Upload Section */}
            <View style={styles.uploadSection}>
              <Text style={styles.label}>Expert Photo</Text>
              {photo ? (
                <View style={styles.photoContainer}>
                  <Image source={{ uri: photo }} style={styles.uploadedImage} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => setPhoto(null)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.uploadOptions}>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={selectImageFromGallery}
                  >
                    <MaterialIcons
                      name="photo-library"
                      size={24}
                      color="#555"
                    />
                    <Text style={styles.uploadButtonText}>Gallery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={takePhotoWithCamera}
                  >
                    <MaterialIcons name="camera-alt" size={24} color="#555" />
                    <Text style={styles.uploadButtonText}>Camera</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/** Form Fields */}
            {[
              { label: "Name", key: "name", placeholder: "Enter expert name" },
              {
                label: "Qualification",
                key: "qualification",
                placeholder: "Ex. BA LLB",
              },
              {
                label: "Experience",
                key: "experience",
                placeholder: "Ex. 5 Years",
              },
              {
                label: "Mobile",
                key: "mobile",
                placeholder: "Ex. 9063392872",
                keyboardType: "numeric",
              },
            ].map(({ label, key, placeholder, keyboardType }) => (
              <View style={styles.formGroup} key={key}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={placeholder}
                  value={form[key]}
                  onChangeText={(text) => handleChange(key, text)}
                  keyboardType={keyboardType || "default"}
                />
              </View>
            ))}

            {/** Constituency Picker */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location (Constituency)</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={form.location}
                  style={styles.picker}
                  onValueChange={(value) => handleChange("location", value)}
                >
                  <Picker.Item label="-- Select Constituency --" value="" />
                  {constituencies.map((constituency) => (
                    <Picker.Item
                      key={constituency.name}
                      label={constituency.name}
                      value={constituency.name}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/** Expert Type Picker */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Expert Type</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={form.expertType}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    handleChange("expertType", itemValue)
                  }
                >
                  <Picker.Item label="-- Select Type --" value="" />
                  <Picker.Item label="LEGAL" value="LEGAL" />
                  <Picker.Item label="REVENUE" value="REVENUE" />
                  <Picker.Item label="ENGINEERS" value="ENGINEERS" />
                  <Picker.Item label="ARCHITECTS" value="ARCHITECTS" />
                  <Picker.Item label="SURVEY" value="SURVEY" />
                  <Picker.Item label="VAASTU PANDITS" value="VAASTU PANDITS" />
                  <Picker.Item label="LAND VALUERS" value="LAND VALUERS" />
                  <Picker.Item label="BANKING" value="BANKING" />
                  <Picker.Item label="AGRICULTURE" value="AGRICULTURE" />
                  <Picker.Item
                    label="REGISTRATION & DOCUMENTATION"
                    value="REGISTRATION & DOCUMENTATION"
                  />
                  <Picker.Item label="AUDITING" value="AUDITING" />
                  <Picker.Item label="LIAISONING" value="LIAISONING" />
                </Picker>
              </View>
            </View>

            {/** Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.addButton, loading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.addText}>Add</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  keyboardView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    width: "90%",
    maxWidth: 400,
  },
  header: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#E91E63",
    paddingVertical: 15,
    alignItems: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  formGroup: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#F9F9F9",
  },
  pickerWrapper: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    backgroundColor: "#F9F9F9",
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
    color: "#333",
  },
  uploadSection: {
    width: "100%",
    marginBottom: 15,
  },
  photoContainer: {
    alignItems: "center",
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#E91E63",
  },
  uploadOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  uploadButton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    width: "45%",
  },
  uploadButtonText: {
    marginTop: 5,
    fontSize: 12,
    color: "#555",
  },
  removeButton: {
    backgroundColor: "#ff4444",
    padding: 8,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  addButton: {
    backgroundColor: "#E91E63",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  addText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "white",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
});

export default AddExpertForm;
