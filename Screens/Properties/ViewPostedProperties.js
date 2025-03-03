import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../data/ApiUrl";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const ViewPostedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigation = useNavigation();

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
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setProperties(data.length > 0 ? data : []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    if (value === "highToLow") {
      setProperties([...properties].sort((a, b) => b.price - a.price));
    } else if (value === "lowToHigh") {
      setProperties([...properties].sort((a, b) => a.price - b.price));
    } else {
      fetchProperties();
    }
  };

  const handleEdit = (propertyId) => {
    navigation.navigate("EditProperty", { propertyId });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.heading}>My Properties</Text>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Sort by:</Text>
        <View style={styles.pickerWrapper}>
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
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
      ) : (
        <View style={styles.grid}>
          {renderHeader()}
          {[...properties].reverse().map((item) => {
            const imageUri = item.photo
              ? { uri: `${API_URL}${item.photo}` }
              : require("../../assets/logo.png");
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
                    onPress={() => handleEdit(item._id)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 15 },
  header: {
    flexDirection: Platform.OS === "android" ? "column" : "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: { fontSize: 22, fontWeight: "bold" },
  filterContainer: { flexDirection: "row", alignItems: "center" },
  filterLabel: { fontSize: 16, marginRight: 5 },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    height: Platform.OS === "android" ? 50 : 40,
  },
  picker: { height: "100%", width: 180, fontSize: 14 },
  loader: { marginTop: 50 },
  grid: { justifyContent: "space-between" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    position: "relative",
  },
  image: { width: "100%", height: 150, borderRadius: 8 },
  details: { marginTop: 10 },
  title: { fontSize: 16, fontWeight: "bold" },
  info: { fontSize: 14, color: "#555" },
  budget: { fontSize: 14, fontWeight: "bold", marginTop: 5 },
  editButton: {
    marginTop: 10,
    backgroundColor: "#3498db",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  editButtonText: { color: "#fff", fontWeight: "bold" },
});

export default ViewPostedProperties;
