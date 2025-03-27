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
  Modal,
} from "react-native";
import { Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { API_URL } from "../../../data/ApiUrl";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PropertyCard from "./PropertyCard"; // Import the PropertyCard component

const { width } = Dimensions.get("window");

const PostProperty = ({ closeModal }) => {
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [Details, setDetails] = useState({});
  const [PostedBy, setPostedBy] = useState("");
  const [Constituency, setConstituency] = useState("");
  const [loading, setLoading] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [propertyTypeSearch, setPropertyTypeSearch] = useState("");
  const [showPropertyTypeList, setShowPropertyTypeList] = useState(false);
  const [postedProperty, setPostedProperty] = useState(null);
  const [constituencies, setConstituencies] = useState([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationList, setShowLocationList] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState(""); // New state for property-specific details

  // Fetch agent details
  const getDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/skillLabour/getskilled`, {
        method: "GET",
        headers: {
          token: `${token}` || "",
        },
      });

      const newDetails = await response.json();
      setPostedBy(newDetails.MobileNumber);
      setConstituency(newDetails.Contituency);
      setDetails(newDetails);
    } catch (error) {
      console.error("Error fetching agent details:", error);
    }
  };

  // Fetch property types from backend
  const fetchPropertyTypes = async () => {
    try {
      const response = await fetch(`${API_URL}/discons/propertytype`);
      const data = await response.json();
      setPropertyTypes(data);
    } catch (error) {
      console.error("Error fetching property types:", error);
    }
  };

  // Fetch constituencies data
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/alldiscons/alldiscons`);
      const data = await response.json();
      setConstituencies(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getDetails();
    fetchPropertyTypes();
    fetchData();
  }, []);

  // Filter property types based on search input
  const filteredPropertyTypes = propertyTypes.filter((item) =>
    item.name.toLowerCase().includes(propertyTypeSearch.toLowerCase())
  );

  // Filter constituencies based on search input
  const filteredConstituencies = constituencies.flatMap((item) =>
    item.assemblies.filter((assembly) =>
      assembly.name.toLowerCase().includes(locationSearch.toLowerCase())
    )
  );

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!propertyType)
      newErrors.propertyType = "Please select a property type.";
    if (!location) newErrors.location = "Location is required.";
    if (!price) newErrors.price = "Price is required.";
    if (!photo) newErrors.photo = "Please upload a photo.";
    if (!propertyDetails)
      newErrors.propertyDetails = "Property details are required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle property posting
  const handlePost = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("propertyType", propertyType);
        formData.append("location", location);
        formData.append("price", price);
        formData.append("PostedBy", PostedBy);
        formData.append("Constituency", Constituency);
        formData.append("propertyDetails", propertyDetails);

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
          console.error("No photo selected.");
          return;
        }

        const response = await fetch(`${API_URL}/properties/addProperty`, {
          method: "POST",
          body: formData,
          headers: {
            // Don't set Content-Type for FormData, it is automatically set by the browser
          },
        });

        const result = await response.json();
        if (response.ok) {
          alert("Success: Property Posted!");
          setPostedProperty({
            photo,
            location,
            price,
            propertyType,
            PostedBy,
            fullName: `${Details.FullName}`,
            // propertyDetails,
          });
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error("Error posting property:", error);
        alert("An error occurred while posting the property.");
      } finally {
        setLoading(false);
      }
    }
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
          alert("Permission is required to upload a photo.");
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
    }
  };

  // Take photo with camera
  const takePhotoWithCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        alert("Camera permission is required to take a photo.");
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
    }
  };

  // Get placeholder text for property details input
  const getPropertyDetailsPlaceholder = () => {
    switch (propertyType.toLowerCase()) {
      case "land":
        return "Enter area in acres";
      case "apartment":
        return "Enter area in square feet";
      case "residential properties":
        return "Enter number of bedrooms";
      case "commercial properties":
        return "Enter area in square feet";
      case "house":
        return "Enter number of bedrooms";
      default:
        return "Enter property details";
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
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
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Search Property Type"
              placeholderTextColor="rgba(25, 25, 25, 0.5)"
              value={propertyTypeSearch}
              onChangeText={(text) => {
                setPropertyTypeSearch(text);
                setShowPropertyTypeList(true);
              }}
              onFocus={() => {
                setShowPropertyTypeList(true);
              }}
            />
            {showPropertyTypeList && (
              <View style={styles.dropdownContainer}>
                {filteredPropertyTypes.map((item) => (
                  <TouchableOpacity
                    key={`${item.code}-${item.name}`}
                    style={styles.listItem}
                    onPress={() => {
                      setPropertyType(item.name);
                      setPropertyTypeSearch(item.name);
                      setShowPropertyTypeList(false);
                    }}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          {errors.propertyType && (
            <Text style={styles.errorText}>{errors.propertyType}</Text>
          )}
          {propertyType && (
            <>
              <Text style={styles.label}>Property Details</Text>
              <TextInput
                style={styles.input}
                placeholder={getPropertyDetailsPlaceholder()}
                value={propertyDetails}
                onChangeText={setPropertyDetails}
              />
              {errors.propertyDetails && (
                <Text style={styles.errorText}>{errors.propertyDetails}</Text>
              )}
            </>
          )}
          <Text style={styles.label}>Location</Text>
          <View style={styles.inputWrapper}>
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
              }}
            />
            {showLocationList && (
              <View style={styles.dropdownContainer}>
                {filteredConstituencies.map((item) => (
                  <TouchableOpacity
                    key={`${item.code}-${item.name}`}
                    style={styles.listItem}
                    onPress={() => {
                      setLocation(item.name);
                      setLocationSearch(item.name);
                      setShowLocationList(false);
                    }}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          {errors.location && (
            <Text style={styles.errorText}>{errors.location}</Text>
          )}
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.postButton, loading && styles.disabledButton]}
              onPress={handlePost}
              disabled={loading}
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

      {/* Modal to display the PropertyCard after successful posting */}
      <Modal
        visible={!!postedProperty}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPostedProperty(null)}
      >
        <View style={styles.modalContainer}>
          <PropertyCard property={postedProperty} closeModal={closeModal} />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

// Styles (unchanged)
const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "ios" ? 90 : 0,
    flex: 1,
    backgroundColor: "#fff",
    width: Platform.OS === "android" || Platform.OS === "ios" ? "90%" : "40%",
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
    marginBottom: 10,
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
  inputWrapper: {
    position: "relative",
    zIndex: 1,
  },
  dropdownContainer: {
    position: "absolute",
    bottom: "100%",
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: "#e6708e",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    maxHeight: 200,
    overflow: "scroll",
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  uploadSection: { alignItems: "center", marginBottom: 20 },
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
    backgroundColor: "#ccc",
  },
  loadingIndicator: {
    marginTop: 20,
    alignSelf: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default PostProperty;
