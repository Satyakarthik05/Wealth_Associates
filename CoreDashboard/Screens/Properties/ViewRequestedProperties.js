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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
import { API_URL } from "../../../data/ApiUrl";
const numColumns = width > 800 ? 4 : 1;

const RequestedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("Token not found in AsyncStorage");
        setLoading(false);
        return;
      }
      const response = await fetch(
        `${API_URL}/requestProperty/myrequestedPropertys`,
        {
          method: "GET",
          headers: {
            token: `${token}` || "",
          },
        }
      );
      const data = await response.json();
      const formattedProperties = [...data].reverse().map((item) => ({
        id: item._id,
        title: item.propertyTitle,
        type: item.propertyType,
        location: item.location,
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
          {[...properties].reverse().map((item) => (
            <View key={item.id} style={styles.card}>
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
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
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

export default RequestedProperties;
