import React, { useState } from "react";
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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { API_URL } from "../../data/ApiUrl";

const { width, height } = Dimensions.get("window");

const PostProperty = ({ closeModal }) => {
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);

  const selectImageFromGallery = async () => {
    try {
      if (Platform.OS !== "web") {
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.status !== "granted") {
          alert("Permission is required to upload a photo.");
          return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
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
          const reader = new FileReader();
          reader.onloadend = () => {
            setPhoto(reader.result);
          };
          reader.readAsDataURL(file);
        };
        input.click();
      }
    } catch (error) {
      console.error("Error selecting image from gallery:", error);
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.status !== "granted") {
        alert("Permission is required to use the camera.");
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo with camera:", error);
    }
  };

  const removeImage = () => {
    setPhoto(null);
  };

  const validateForm = () => {
    if (!propertyType || !location || !price || !photo) {
      alert("Validation Error: Please fill all fields and upload a photo.");
      return false;
    }
    return true;
  };

  const handlePost = async () => {
    if (validateForm()) {
      try {
        let response;
        if (Platform.OS === "web") {
          // Web sends JSON with Base64 image
          response = await fetch(`${API_URL}/properties/addProperty`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              propertyType,
              location,
              price,
              photo, // This will be Base64 from the web
            }),
          });
        } else {
          // For mobile (FormData)
          const formData = new FormData();
          formData.append("propertyType", propertyType);
          formData.append("location", location);
          formData.append("price", price);
          formData.append("photo", {
            uri: photo,
            name: "photo.jpg",
            type: "image/jpeg",
          });

          console.log(formData);

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
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Post a Property</Text>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Upload Photo</Text>
          <View style={styles.uploadSection}>
            {photo ? (
              <>
                <Image source={{ uri: photo }} style={styles.uploadedImage} />
                <TouchableOpacity
                  onPress={removeImage}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.uploadButtonsContainer}>
                <TouchableOpacity
                  onPress={selectImageFromGallery}
                  style={styles.uploadButton}
                >
                  <FontAwesome5
                    name="cloud-upload-alt"
                    size={20}
                    color="#333"
                  />
                  <Text style={styles.uploadText}> Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={takePhotoWithCamera}
                  style={styles.uploadButton}
                >
                  <FontAwesome5 name="camera" size={20} color="#333" />
                  <Text style={styles.uploadText}> Camera</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Text style={styles.label}>Property Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={propertyType}
              onValueChange={(itemValue) => setPropertyType(itemValue)}
              style={styles.propertyPicker}
            >
              <Picker.Item label="-- Select Type --" value="" />
              <Picker.Item label="Apartment" value="Apartment" />
              <Picker.Item label="House" value="House" />
              <Picker.Item label="Land" value="Land" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. Vijayawada"
            value={location}
            onChangeText={setLocation}
          />
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. 50,00,000"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={styles.postButton}
              onPress={handlePost}
            >
              Post
            </Button>
            <Button
              mode="contained"
              style={styles.cancelButton}
              onPress={closeModal}
            >
              Cancel
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    width: Platform.OS === "web" ? "25vw" : "100%",
    alignSelf: "center",
  },
  header: {
    backgroundColor: "#ff3366",
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    padding: 5,
  },
  input: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 40,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  postButton: {
    backgroundColor: "#ff3366",
    borderRadius: 15,
    flex: 1,
    marginRight: 10,
  },
  formContainer: {
    padding: 20,
  },
  cancelButton: {
    backgroundColor: "#000",
    borderRadius: 15,
    flex: 1,
    marginLeft: 10,
  },
  uploadSection: {
    alignItems: "center",
    marginBottom: 10,
    minHeight: width * 0.4,
  },
  uploadedImage: {
    width: 250, // Fixed width
    height: 150, // Fixed height
    borderRadius: 10,
    resizeMode: "cover",
  },
  removeButton: {
    marginTop: 5,
    backgroundColor: "black",
    padding: 5,
    borderRadius: 5,
  },
  removeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  propertyPicker: {
    height: Platform.OS === "android" ? "" : 40,
  },
  uploadButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  uploadButton: {
    alignItems: "center",
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  uploadText: {
    marginTop: 5,
    color: "#333",
  },
});

export default PostProperty;
