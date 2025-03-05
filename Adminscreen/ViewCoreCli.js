import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
} from "react-native";
import { API_URL } from "../data/ApiUrl";

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

const Core_Clients = () => {
  const [coreClients, setCoreClients] = useState([]);

  useEffect(() => {
    // Fetch data from the backend
    const fetchCoreClients = async () => {
      try {
        const response = await fetch(`${API_URL}/coreclient/getallcoreclients`);
        const data = await response.json();
        setCoreClients(data);
      } catch (error) {
        console.error("Error fetching core clients:", error);
      }
    };

    fetchCoreClients();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Core Clients</Text>
      <View style={styles.cardContainer}>
        {coreClients.map((client) => (
          <View key={client._id} style={styles.card}>
            {/* Image with error handling */}
            <Image
              source={{ uri: `${API_URL}${client.photo}` }}
              style={styles.logo}
              resizeMode="contain"
              onError={(e) =>
                console.log("Failed to load image:", e.nativeEvent.error)
              }
              onLoad={() => console.log("Image loaded successfully")}
            />
            <Text style={styles.companyName}>{client.companyName}</Text>
            <Text style={styles.details}>{client.officeAddress}</Text>
            <Text style={styles.details}>{client.city}</Text>
            <Text style={styles.details}>{client.website}</Text>
            <Text style={styles.details}>{client.mobile}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Core_Clients;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    marginTop: Platform.OS === "web" ? 40 : 20,
    textAlign: "center",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: isWeb ? width * 0.3 : width * 0.45, // Responsive width
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 3,
  },
});
