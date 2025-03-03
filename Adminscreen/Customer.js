import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../data/ApiUrl";

const { width } = Dimensions.get("window");

export default function ViewCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_URL}/customer/allcustomers`);
      const data = await response.json();
      setCustomers(data.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      Alert.alert("Error", "Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      const response = await fetch(`${API_URL}/customer/deletecustomer/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCustomers(customers.filter((customer) => customer._id !== id));
        Alert.alert("Success", "Customer deleted successfully.");
      } else {
        throw new Error("Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      Alert.alert("Error", "Failed to delete customer.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Customers</Text>
      <View
        style={
          Platform.OS === "web" ? styles.gridContainerWeb : styles.gridContainer
        }
      >
        {customers.length > 0 ? (
          customers.map((item) => (
            <View key={item._id} style={styles.card}>
              <Image
                source={require("../assets/man.png")}
                style={styles.avatar}
              />
              <View style={styles.infoContainer}>
                {item.FullName && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.value}>: {item.FullName}</Text>
                  </View>
                )}
                {item.MobileNumber && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Mobile</Text>
                    <Text style={styles.value}>: {item.MobileNumber}</Text>
                  </View>
                )}
                {item.Occupation && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Occupation</Text>
                    <Text style={styles.value}>: {item.Occupation}</Text>
                  </View>
                )}
                {item.MyRefferalCode && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Referral Code</Text>
                    <Text style={styles.value}>: {item.MyRefferalCode}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteCustomer(item._id)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noCustomersText}>No customers found.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 15,
    paddingLeft: 10,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  gridContainerWeb: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: width > 600 ? "30%" : "100%",
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: "#ddd",
  },
  infoContainer: {
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    width: "100%",
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    width: 120,
  },
  value: {
    fontSize: 14,
  },
  noCustomersText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
});
