import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../../data/ApiUrl";

const { width } = Dimensions.get("window");
const numColumns = width > 800 ? 4 : 1;

const RequestedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editedDetails, setEditedDetails] = useState({
    propertyTitle: "",
    propertyType: "",
    location: "",
    Budget: "",
  });
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [constituencies, setConstituencies] = useState([]);

  useEffect(() => {
    fetchProperties();
    fetchPropertyTypes();
    fetchConstituencies();
  }, []);

  const fetchPropertyTypes = async () => {
    try {
      const response = await fetch(`${API_URL}/discons/propertytype`);
      const data = await response.json();
      setPropertyTypes(data);
    } catch (error) {
      console.error("Error fetching property types:", error);
    }
  };

  const fetchConstituencies = async () => {
    try {
      const response = await fetch(`${API_URL}/alldiscons/alldiscons`);
      const data = await response.json();
      setConstituencies(data);
    } catch (error) {
      console.error("Error fetching constituencies:", error);
    }
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/requestProperty/getallrequestProperty`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      const formattedProperties = [...data].reverse().map((item) => ({
        id: item._id,
        title: item.propertyTitle,
        type: item.propertyType,
        location: item.location,
        postedBy: item.PostedBy,
        budget: `₹${item.Budget.toLocaleString()}`,
        image: getImageByPropertyType(item.propertyType),
      }));
      setProperties(formattedProperties);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setLoading(false);
    }
  };

  const deleteProperty = async (id) => {
    try {
      await fetch(`${API_URL}/requestProperty/delete/${id}`, {
        method: "DELETE",
      });
      setProperties(properties.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  const handleEdit = (property) => {
    const originalProperty = properties.find((p) => p.id === property.id);
    setSelectedProperty(originalProperty);
    setEditedDetails({
      propertyTitle: originalProperty.title,
      propertyType: originalProperty.type,
      location: originalProperty.location,
      Budget: originalProperty.budget.replace(/[^0-9]/g, ""), // Remove ₹ and commas
    });
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/requestProperty/adminupdateProperty/${selectedProperty.id}`,
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
        const updatedProperties = properties.map((item) =>
          item.id === selectedProperty.id
            ? {
                ...item,
                title: editedDetails.propertyTitle,
                type: editedDetails.propertyType,
                location: editedDetails.location,
                budget: `₹${parseInt(editedDetails.Budget).toLocaleString()}`,
              }
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

  const getImageByPropertyType = (propertyType) => {
    switch (propertyType.toLowerCase()) {
      case "land":
        return require("../../../assets/Land.jpg");
      case "residential":
        return require("../../../assets/residntial.jpg");
      case "commercial":
        return require("../../../assets/commercial.jpg");
      case "villa":
        return require("../../../assets/villa.jpg");
      default:
        return require("../../../assets/house.png");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Requested Properties</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e91e63" />
          <Text style={styles.loadingText}>Fetching properties...</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {properties.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={item.image} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.text}>Property Type: {item.type}</Text>
                <Text style={styles.text}>Location: {item.location}</Text>
                <Text style={styles.text}>Budget: {item.budget}</Text>
                <Text style={styles.text}>PostedBy: {item.postedBy}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.editButton]}
                    onPress={() => handleEdit(item)}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => deleteProperty(item.id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

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
              placeholder="Property Title"
              value={editedDetails.propertyTitle}
              onChangeText={(text) =>
                setEditedDetails({ ...editedDetails, propertyTitle: text })
              }
            />

            {/* Property Type Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Property Type:</Text>
              <View style={styles.dropdown}>
                <Picker
                  selectedValue={editedDetails.propertyType}
                  onValueChange={(value) =>
                    setEditedDetails({ ...editedDetails, propertyType: value })
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Select Property Type" value="" />
                  {propertyTypes.map((type) => (
                    <Picker.Item
                      key={type._id}
                      label={type.name}
                      value={type.name}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Location Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Location:</Text>
              <View style={styles.dropdown}>
                <Picker
                  selectedValue={editedDetails.location}
                  onValueChange={(value) =>
                    setEditedDetails({ ...editedDetails, location: value })
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Select Location" value="" />
                  {constituencies.flatMap((item) =>
                    item.assemblies.map((assembly) => (
                      <Picker.Item
                        key={assembly._id}
                        label={assembly.name}
                        value={assembly.name}
                      />
                    ))
                  )}
                </Picker>
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Budget"
              value={editedDetails.Budget}
              onChangeText={(text) =>
                setEditedDetails({ ...editedDetails, Budget: text })
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    marginBottom: 30,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "left",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    margin: 8,
    width: Platform.OS === "android" ? width / numColumns - 100 : 230,
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  details: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#888",
  },
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
    backgroundColor: "#ff3b30",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
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
    width: Platform.OS === "web" ? "50%" : "90%",
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
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdownLabel: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    height: 50,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  picker: {
    height: "100%",
    width: "100%",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
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

export default RequestedProperties;
