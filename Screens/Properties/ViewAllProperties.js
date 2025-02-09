import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const { width } = Dimensions.get("window"); // Get screen width for responsiveness

const dummyProperties = [
  {
    id: "1",
    title: "Luxury Villa for Sale",
    type: "Independent House",
    location: "Hyderabad",
    budget: 7500000,
    image: require("../../assets/house.png"),
    approved: true,
  },
  {
    id: "2",
    title: "Modern House for Sale",
    type: "Independent House",
    location: "Bangalore",
    budget: 8500000,
    image: require("../../assets/house.png"),
    approved: true,
  },
];

const ViewAllProperties = () => {
  const [properties, setProperties] = useState(dummyProperties);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay
      const response = await fetch("YOUR_BACKEND_URL");
      const data = await response.json();

      if (data && Array.isArray(data) && data.length > 0) {
        setProperties([...dummyProperties, ...data]);
      } else {
        console.warn("API returned empty data. Showing only dummy properties.");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    if (value === "highToLow") {
      setProperties([...properties].sort((a, b) => b.budget - a.budget));
    } else if (value === "lowToHigh") {
      setProperties([...properties].sort((a, b) => a.budget - b.budget));
    } else {
      setProperties(dummyProperties); // Reset to original data
    }
  };

  const renderProperty = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      {item.approved && <Text style={styles.approved}>✅ Approved</Text>}
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.info}>Property Type: {item.type}</Text>
        <Text style={styles.info}>Location: {item.location}</Text>
        <Text style={styles.budget}>₹ {item.budget.toLocaleString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>All Properties</Text>
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

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
      ) : (
        <FlatList
          data={properties}
          keyExtractor={(item) => item.id}
          renderItem={renderProperty}
          numColumns={Platform.OS === "web" ? 2 : 1} // Web: 2 columns, Android: 1 column
          contentContainerStyle={styles.grid}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 15 },
  header: {
    flexDirection: Platform.OS === "android" ? "column" : "row",
    float: Platform.OS === "android" ? "left" : "auto",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  heading: { fontSize: 22, fontWeight: "bold", textAlign: "left" },

  // Updated Filter Box for Android
  filterContainer: { flexDirection: "row", alignItems: "center" },
  filterLabel: { fontSize: 16, marginRight: 5 },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    height: Platform.OS === "android" ? 50 : 40, // Increased height for Android
  },
  picker: {
    height: "100%", // Ensures full height usage
    width: 180,
    fontSize: 14,
  },

  loader: { marginTop: 50 },
  grid: { justifyContent: "space-between" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: Platform.OS === "web" ? "25%" : width * 0.9, // Web: 25%, Android: 90% of screen width
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    position: "relative",
  },
  image: { width: "100%", height: 150, borderRadius: 8 },
  approved: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#2ecc71",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
  details: { marginTop: 10 },
  title: { fontSize: 16, fontWeight: "bold" },
  info: { fontSize: 14, color: "#555" },
  budget: { fontSize: 14, fontWeight: "bold", marginTop: 5 },
});

export default ViewAllProperties;
