import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  Platform,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../../data/ApiUrl";

const { width } = Dimensions.get("window");
const numColumns = 3; // Set number of properties per row

const ViewPostedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editedData, setEditedData] = useState({
    propertyType: "",
    location: "",
    price: "",
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.warn("No token found in AsyncStorage.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/properties/getMyPropertys`, {
        method: "GET",
        headers: {
          token: `${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setProperties(data.length > 0 ? data : []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (value) => {
    setSelectedFilter(value);
  
    if (value === "highToLow") {
      setProperties((prevProperties) =>
        [...(Array.isArray(prevProperties) ? prevProperties : [])].sort(
          (a, b) => b.price - a.price
        )
      );
    } else if (value === "lowToHigh") {
      setProperties((prevProperties) =>
        [...(Array.isArray(prevProperties) ? prevProperties : [])].sort(
          (a, b) => a.price - b.price
        )
      );
    } else {
      await fetchProperties(); // ✅ Properly re-fetch data when resetting filter
    }
  };
  

  const handleEditPress = (property) => {
    setSelectedProperty(property);
    setEditedData({
      propertyType: property.propertyType,
      location: property.location,
      price: property.price.toString(),
    });
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedProperty) return;

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await fetch(
        `${API_URL}/properties/editProperty/${selectedProperty._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
          body: JSON.stringify(editedData),
        }
      );

      if (response.ok) {
        console.log("Updated successfully");
        setEditModalVisible(false);
        fetchProperties();
      } else {
        console.error("Failed to update property");
      }
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>My Properties</Text>
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Sort by:</Text>
          <Picker
            selectedValue={selectedFilter}
            onValueChange={handleFilterChange}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Filter --" value="" />
            <Picker.Item label="Price: Low to High" value="lowToHigh" />
            <Picker.Item label="Price: High to Low" value="highToLow" />
          </Picker>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
      ) : (
        <View style={styles.grid}>
          {properties.map((item) => {
            const imageUri = item.photo
              ? { uri: `${API_URL}${item.photo}` }
              : require("../../../assets/logo.png");

            return (
              <View key={item._id} style={styles.card}>
                <Image source={imageUri} style={styles.image} />
                <View style={styles.details}>
                  <Text style={styles.title}>{item.propertyType}</Text>
                  <Text style={styles.info}>Location: {item.location}</Text>
                  <Text style={styles.budget}>
                    ₹ {parseInt(item.price).toLocaleString()}
                  </Text>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditPress(item)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Edit Property Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Property</Text>
            <TextInput
              style={styles.input}
              value={editedData.propertyType}
              onChangeText={(text) =>
                setEditedData({ ...editedData, propertyType: text })
              }
              placeholder="Property Type"
            />
            <TextInput
              style={styles.input}
              value={editedData.location}
              onChangeText={(text) =>
                setEditedData({ ...editedData, location: text })
              }
              placeholder="Location"
            />
            <TextInput
              style={styles.input}
              value={editedData.price}
              keyboardType="numeric"
              onChangeText={(text) =>
                setEditedData({ ...editedData, price: text })
              }
              placeholder="Price"
            />
            <Button title="Save Changes" onPress={handleSaveEdit} />
            <Button
              title="Cancel"
              color="red"
              onPress={() => setEditModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
      flexGrow: 1,
      padding: 15,
      backgroundColor: "#f5f5f5",
      alignItems: "center",
    },
    header: {
      flexDirection: Platform.OS === "android" || Platform.OS === "ios"  ? "column" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginBottom: 15,
    },
    heading: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "left",
    },
    filterContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    filterLabel: { fontSize: 16, marginRight: 5 },
    pickerWrapper: {
      backgroundColor: "#fff",
      borderRadius: 8,
      elevation: 3,
      height: Platform.OS === "android" ? 50 : 40,
    },
    picker: { height: "100%", width: 180, fontSize: 14 },
    loader: { marginTop: 50 },
  
    /** 🟢 Updated Grid & Card Styles for Vertical List **/
    grid: {
      flexDirection: "column", // 🔹 Stack cards vertically
      width: "100%", // Take full width
      alignItems: "center", // Center cards horizontally
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 10,
      marginVertical: 8, // 🔹 Space between cards
      width: "90%", // Make it occupy most of the screen width
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
  
    editButton: {
      marginTop: 10,
      backgroundColor: "#007bff",
      padding: 8,
      borderRadius: 5,
      alignItems: "center",
    },
    editButtonText: { color: "white", fontSize: 14 },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      width: 300,
    },
    modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    input: { borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 5 },
});

export default ViewPostedProperties;
