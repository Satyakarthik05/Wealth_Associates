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
import { API_URL } from "../../../data/ApiUrl";

// Import your modal components - ensure these files exist
import HouseUpdateModal from "./Flats";
import ApartmentUpdateModal from "./AgricultureForm";
import LandUpdateModal from "./Plotform";
import CommercialUpdateModal from "./Flats";

const { width } = Dimensions.get("window");

const ViewAllProperties = () => {
  // State management
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editedDetails, setEditedDetails] = useState({
    propertyType: "",
    location: "",
    price: "",
    photo: "",
  });
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [idSearch, setIdSearch] = useState("");
  const [currentUpdateModal, setCurrentUpdateModal] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesRes, typesRes, constituenciesRes] = await Promise.all([
          fetch(`${API_URL}/properties/getallPropertys`),
          fetch(`${API_URL}/discons/propertytype`),
          fetch(`${API_URL}/alldiscons/alldiscons`),
        ]);

        const propertiesData = await propertiesRes.json();
        const typesData = await typesRes.json();
        const constituenciesData = await constituenciesRes.json();

        setProperties(propertiesData);
        setPropertyTypes(typesData);
        setConstituencies(constituenciesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper functions
  const getLastFourChars = (id) => id?.slice(-4) || "N/A";

  const filteredProperties = properties.filter((property) =>
    idSearch
      ? getLastFourChars(property._id)
          .toLowerCase()
          .includes(idSearch.toLowerCase())
      : true
  );

  // Modal handlers
  const handleUpdate = (property) => {
    console.log("Opening update modal for:", property.propertyType);
    setSelectedProperty(property);

    const type = property.propertyType.toLowerCase();
    if (type.includes("house")) setCurrentUpdateModal("house");
    else if (type.includes("apartment")) setCurrentUpdateModal("apartment");
    else if (type.includes("land")) setCurrentUpdateModal("land");
    else if (type.includes("commercial")) setCurrentUpdateModal("commercial");
    else setCurrentUpdateModal(null);

    setIsUpdateModalVisible(true);
  };

  const handleUpdateSave = async (updatedData) => {
    try {
      const response = await fetch(
        `${API_URL}/properties/update/${selectedProperty._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setProperties(
          properties.map((p) =>
            p._id === selectedProperty._id ? { ...p, ...updatedData } : p
          )
        );
        setIsUpdateModalVisible(false);
        Alert.alert("Success", "Property updated successfully");
      } else {
        Alert.alert("Error", result.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update property");
    }
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
    setEditedDetails({
      propertyType: property.propertyType,
      location: property.location,
      price: property.price.toString(),
      photo: property.photo,
    });
    setIsEditModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${API_URL}/properties/update/${selectedProperty._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editedDetails),
        }
      );

      if (response.ok) {
        setProperties(
          properties.map((p) =>
            p._id === selectedProperty._id ? { ...p, ...editedDetails } : p
          )
        );
        setIsEditModalVisible(false);
        Alert.alert("Success", "Changes saved");
      } else {
        const error = await response.json();
        Alert.alert("Error", error.message || "Save failed");
      }
    } catch (err) {
      console.error("Save error:", err);
      Alert.alert("Error", "Failed to save changes");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await new Promise((resolve) => {
      if (Platform.OS === "web") {
        resolve(window.confirm("Delete this property?"));
      } else {
        Alert.alert("Confirm", "Delete this property?", [
          { text: "Cancel", onPress: () => resolve(false) },
          { text: "Delete", onPress: () => resolve(true) },
        ]);
      }
    });

    if (!confirm) return;

    try {
      const response = await fetch(`${API_URL}/properties/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProperties(properties.filter((p) => p._id !== id));
        Alert.alert("Success", "Property deleted");
      } else {
        const error = await response.json();
        Alert.alert("Error", error.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      Alert.alert("Error", "Failed to delete");
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${API_URL}/properties/approve/${id}`, {
        method: "POST",
      });

      if (response.ok) {
        Alert.alert("Success", "Property approved");
        fetchProperties();
      } else {
        const error = await response.json();
        Alert.alert("Error", error.message || "Approval failed");
      }
    } catch (err) {
      console.error("Approve error:", err);
      Alert.alert("Error", "Failed to approve");
    }
  };

  // Modal renderers
  const renderUpdateModal = () => {
    if (!selectedProperty || !currentUpdateModal) return null;

    const modalProps = {
      visible: isUpdateModalVisible,
      property: selectedProperty,
      onClose: () => setIsUpdateModalVisible(false),
      onSave: handleUpdateSave,
    };

    switch (currentUpdateModal) {
      case "house":
        return <HouseUpdateModal {...modalProps} />;
      case "apartment":
        return <ApartmentUpdateModal {...modalProps} />;
      case "land":
        return <LandUpdateModal {...modalProps} />;
      case "commercial":
        return <CommercialUpdateModal {...modalProps} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>All Properties</Text>
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Sort by:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedFilter}
              onValueChange={setSelectedFilter}
              style={styles.picker}
            >
              <Picker.Item label="-- Select Filter --" value="" />
              <Picker.Item label="Price: High to Low" value="highToLow" />
              <Picker.Item label="Price: Low to High" value="lowToHigh" />
            </Picker>
          </View>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by property ID (last 4 chars)"
          value={idSearch}
          onChangeText={setIdSearch}
          maxLength={4}
        />
      </View>

      <View style={styles.grid}>
        {filteredProperties.map((item) => (
          <View key={item._id} style={styles.card}>
            <Image
              source={
                item.photo
                  ? { uri: `${API_URL}${item.photo}` }
                  : require("../../../assets/logo.png")
              }
              style={styles.image}
            />
            <View style={styles.details}>
              <View style={styles.idContainer}>
                <Text style={styles.idText}>
                  ID: {getLastFourChars(item._id)}
                </Text>
              </View>
              <Text style={styles.title}>{item.propertyType}</Text>
              <Text style={styles.info}>Posted by: {item.PostedBy}</Text>
              <Text style={styles.info}>Location: {item.location}</Text>
              <Text style={styles.budget}>
                ₹ {parseInt(item.price).toLocaleString()}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.updateButton]}
                onPress={() => handleUpdate(item)}
              >
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => handleDelete(item._id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.approveButton]}
                onPress={() => handleApprove(item._id)}
              >
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Edit Property Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Property</Text>

          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>Property Type:</Text>
            <Picker
              selectedValue={editedDetails.propertyType}
              onValueChange={(value) =>
                setEditedDetails({ ...editedDetails, propertyType: value })
              }
              style={styles.dropdown}
            >
              <Picker.Item label="Select Type" value="" />
              {propertyTypes.map((type) => (
                <Picker.Item
                  key={type._id}
                  label={type.name}
                  value={type.name}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>Location:</Text>
            <Picker
              selectedValue={editedDetails.location}
              onValueChange={(value) =>
                setEditedDetails({ ...editedDetails, location: value })
              }
              style={styles.dropdown}
            >
              <Picker.Item label="Select Location" value="" />
              {constituencies
                .flatMap((c) => c.assemblies)
                .map((a, i) => (
                  <Picker.Item
                    key={`${a._id}-${i}`}
                    label={a.name}
                    value={a.name}
                  />
                ))}
            </Picker>
          </View>

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
              onPress={() => setIsEditModalVisible(false)}
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
      </Modal>

      {/* Dynamic Update Modals */}
      {renderUpdateModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: Platform.OS === "web" ? 0 : 10,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    minWidth: 200,
    height: 40,
  },
  picker: {
    height: "100%",
    width: "100%",
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: Platform.OS === "web" ? "flex-start" : "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    margin: 10,
    width: Platform.OS === "web" ? "30%" : "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  details: {
    marginBottom: 10,
  },
  idContainer: {
    backgroundColor: "#2ecc71",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  idText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
  info: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  budget: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e74c3c",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    flexWrap: "wrap",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
    margin: 2,
    minWidth: 70,
  },
  editButton: {
    backgroundColor: "#3498db",
  },
  updateButton: {
    backgroundColor: "#9b59b6",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
  },
  approveButton: {
    backgroundColor: "#2ecc71",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdownLabel: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "600",
  },
  dropdown: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  modalButton: {
    padding: 12,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#95a5a6",
  },
  saveButton: {
    backgroundColor: "#3498db",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ViewAllProperties;
