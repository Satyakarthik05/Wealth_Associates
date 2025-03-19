import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API_URL } from "../data/ApiUrl";

const { width } = Dimensions.get("window");

const ViewAllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editedDetails, setEditedDetails] = useState({
    propertyType: "",
    location: "",
    price: "",
    photo: "",
  });
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false); // State for filter modal
  const [filterCriteria, setFilterCriteria] = useState({
    propertyType: "",
    location: "",
    price: "",
  }); // State for filter criteria

  // Fetch properties data
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_URL}/properties/getApproveProperty`);
      const data = await response.json();
      if (data && Array.isArray(data) && data.length > 0) {
        setProperties(data);
      } else {
        console.warn("API returned empty data.");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique property types and locations from properties
  const uniquePropertyTypes = [
    ...new Set(properties.map((item) => item.propertyType)),
  ];
  const uniqueLocations = [...new Set(properties.map((item) => item.location))];

  // Price options for dropdown
  const priceOptions = [
    { label: "1 Lakh", value: "100000" },
    { label: "2 Lakh", value: "200000" },
    { label: "5 Lakh", value: "500000" },
    { label: "10 Lakh", value: "1000000" },
    { label: "20 Lakh", value: "2000000" },
  ];

  // Apply all filters simultaneously
  const applyFilters = () => {
    let filteredProperties = [...properties];

    // Filter by property type
    if (filterCriteria.propertyType) {
      filteredProperties = filteredProperties.filter(
        (item) => item.propertyType === filterCriteria.propertyType
      );
    }

    // Filter by location
    if (filterCriteria.location) {
      filteredProperties = filteredProperties.filter(
        (item) => item.location === filterCriteria.location
      );
    }

    // Filter by price
    if (filterCriteria.price) {
      filteredProperties = filteredProperties.filter(
        (item) => item.price <= parseFloat(filterCriteria.price)
      );
    }

    return filteredProperties;
  };

  // Reset filters
  const resetFilters = () => {
    setFilterCriteria({
      propertyType: "",
      location: "",
      price: "",
    });
  };

  // Handle Save for Edit Modal
  const handleSave = async () => {
    try {
      const response = await fetch(
        `${API_URL}/properties/approveupdate/${selectedProperty._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedDetails),
        }
      );

      const result = await response.json();
      if (response.ok) {
        // Update the properties list
        const updatedProperties = properties.map((item) =>
          item._id === selectedProperty._id
            ? { ...item, ...editedDetails }
            : item
        );
        setProperties(updatedProperties);
        setIsModalVisible(false);
        Alert.alert("Success", "Property updated successfully.");
      } else {
        Alert.alert("Error", result.message || "Failed to update property.");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      Alert.alert("Error", "An error occurred while updating the property.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.heading}>Approved Properties</Text>
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setIsFilterModalVisible(true)}
              >
                <Text style={styles.filterButtonText}>Filter</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.grid}>
            {applyFilters().map((item) => {
              const imageUri = item.photo
                ? { uri: `${API_URL}${item.photo}` }
                : require("../assets/logo.png");

              return (
                <View key={item._id} style={styles.card}>
                  <Image source={imageUri} style={styles.image} />
                  <View style={styles.details}>
                    <Text style={styles.title}>{item.propertyType}</Text>
                    <Text style={styles.info}>Location: {item.location}</Text>
                    <Text style={styles.budget}>
                      ₹ {parseInt(item.price).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, styles.editButton]}
                      onPress={() => {
                        setSelectedProperty(item);
                        setEditedDetails({
                          propertyType: item.propertyType,
                          location: item.location,
                          price: item.price.toString(),
                          photo: item.photo,
                        });
                        setIsModalVisible(true);
                      }}
                    >
                      <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.deleteButton]}
                      onPress={() => handleDelete(item._id)}
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Filter Modal */}
          <Modal
            visible={isFilterModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsFilterModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Filter Properties</Text>

                {/* Property Type Dropdown */}
                <Text style={styles.filterLabel}>Property Type</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={filterCriteria.propertyType}
                    onValueChange={(value) =>
                      setFilterCriteria({
                        ...filterCriteria,
                        propertyType: value,
                      })
                    }
                  >
                    <Picker.Item label="Select Property Type" value="" />
                    {uniquePropertyTypes.map((type, index) => (
                      <Picker.Item key={index} label={type} value={type} />
                    ))}
                  </Picker>
                </View>

                {/* Location Dropdown */}
                <Text style={styles.filterLabel}>Location</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={filterCriteria.location}
                    onValueChange={(value) =>
                      setFilterCriteria({ ...filterCriteria, location: value })
                    }
                  >
                    <Picker.Item label="Select Location" value="" />
                    {uniqueLocations.map((location, index) => (
                      <Picker.Item
                        key={index}
                        label={location}
                        value={location}
                      />
                    ))}
                  </Picker>
                </View>

                {/* Price Dropdown */}
                <Text style={styles.filterLabel}>Price</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={filterCriteria.price}
                    onValueChange={(value) =>
                      setFilterCriteria({ ...filterCriteria, price: value })
                    }
                  >
                    <Picker.Item label="Select Price" value="" />
                    {priceOptions.map((option, index) => (
                      <Picker.Item
                        key={index}
                        label={option.label}
                        value={option.value}
                      />
                    ))}
                  </Picker>
                </View>

                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      resetFilters();
                      setIsFilterModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Reset</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={() => setIsFilterModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Edit Modal */}
          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Property</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Property Type"
                  value={editedDetails.propertyType}
                  onChangeText={(text) =>
                    setEditedDetails({ ...editedDetails, propertyType: text })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Location"
                  value={editedDetails.location}
                  onChangeText={(text) =>
                    setEditedDetails({ ...editedDetails, location: text })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Price"
                  value={editedDetails.price}
                  onChangeText={(text) =>
                    setEditedDetails({ ...editedDetails, price: text })
                  }
                  keyboardType="numeric"
                />
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSave}
                  >
                    <Text style={styles.modalButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#f5f5f5", padding: 15 },
  header: {
    flexDirection: Platform.OS === "android" ? "column" : "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: { fontSize: 22, fontWeight: "bold", textAlign: "left" },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  loader: { marginTop: 50 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: Platform.OS === "web" ? "30%" : "100%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  image: { width: "100%", height: 150, borderRadius: 8 },
  details: { marginTop: 10 },
  title: { fontSize: 16, fontWeight: "bold" },
  info: { fontSize: 14, color: "#555" },
  budget: { fontSize: 14, fontWeight: "bold", marginTop: 5 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: "#3498db",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: Platform.OS === "web" ? "40%" : "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  saveButton: {
    backgroundColor: "#3498db",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ViewAllProperties;
