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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API_URL } from "../../../data/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const ViewAllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [Details, setDetails] = useState({});

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_URL}/properties/getallPropertys`);
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

  const getDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/investors/getinvestor`, {
        method: "GET",
        headers: {
          token: `${token}` || "",
        },
      });
      const newDetails = await response.json();
      setDetails(newDetails);
      console.log(Details);
    } catch (error) {
      console.error("Error fetching agent details:", error);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);
  const handleBuyNow = async (PostedBy, propertyType, location, price) => {
    try {
      // Send the details to the backend
      const response = await fetch(`${API_URL}/buy/buyproperty`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyType,
          location,
          price,
          PostedBy,
          WantedBy: Details.MobileNumber,
          WantedUserType: "Investor",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Purchase request sent successfully!");
      } else {
        Alert.alert(
          "Error",
          result.message || "Failed to send purchase request."
        );
      }
    } catch (error) {
      console.error("Error sending purchase request:", error);
      Alert.alert(
        "Error",
        "An error occurred while sending the purchase request."
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
      ) : (
        <>
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
                  <Picker.Item label="Price: High to Low" value="lowToHigh" />
                  <Picker.Item label="Price: Low to High" value="highToLow" />
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.grid}>
            {[...properties].reverse().map((item) => {
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
                      style={styles.buyNowButton}
                      onPress={() =>
                        handleBuyNow(
                          item.PostedBy,
                          item.propertyType,
                          item.location,
                          item.price
                        )
                      }
                    >
                      <Text style={styles.buyNowButtonText}>Buy Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
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
  filterLabel: { fontSize: 16, marginRight: 5 },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    height: Platform.OS === "android" ? 50 : 40,
  },
  picker: { height: "100%", width: 180, fontSize: 14 },
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
  buyNowButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  buyNowButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ViewAllProperties;
