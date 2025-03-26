import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const ViewCallExecutives = () => {
  const [executives, setExecutives] = useState([]);

  useEffect(() => {
    fetch("https://your-api-endpoint.com/call-executives") // Replace with your API
      .then((response) => response.json())
      .then((data) => setExecutives(data))
      .catch((error) => console.error("Error fetching executives:", error));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Registered Call Executives</Text>
      <FlatList
        data={executives}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.detail}>Phone: {item.phone}</Text>
            <Text style={styles.detail}>Location: {item.location}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
    width: "100%",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detail: {
    fontSize: 14,
    color: "#555",
  },
});

export default ViewCallExecutives;
