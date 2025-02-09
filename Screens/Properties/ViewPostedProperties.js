import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";

const { width } = Dimensions.get("window");
const numColumns = width > 800 ? 4 : 1; // Mobile: Single column, Web: 4 columns

const MyPostedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      // Simulating API call delay for better UI experience
      setTimeout(() => {
        setProperties([
          {
            id: "1",
            title: "Individual House for Sale",
            type: "Independent House",
            location: "Vijayawada",
            budget: "₹50,00,000",
            image: require("../../assets/house.png"), // Corrected local image loading
          },
          {
            id: "2",
            title: "Luxury Villa for Sale",
            type: "Villa",
            location: "Hyderabad",
            budget: "₹1,20,00,000",
            image: require("../../assets/house.png"), // Corrected local image loading
          },
        ]);
        setLoading(false);
      }, 2000); // Simulated delay (2 seconds)
    } catch (error) {
      console.error("Error fetching properties:", error);
      setLoading(false);
    }
  };

  const renderPropertyCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.approvedBadge}>
        <Text style={styles.badgeText}>✔ Approved</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>Property Type: {item.type}</Text>
        <Text style={styles.text}>Location: {item.location}</Text>
        <Text style={styles.text}>Budget: {item.budget}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Posted Properties</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e91e63" />
          <Text style={styles.loadingText}>Fetching properties...</Text>
        </View>
      ) : (
        <FlatList
          data={properties}
          renderItem={renderPropertyCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.grid}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    width: "90%",
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "left",
  },
  grid: {
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    margin: 8,
    width: Platform === "android" ? width / numColumns - 20 : 230,
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  approvedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
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
});

export default MyPostedProperties;
