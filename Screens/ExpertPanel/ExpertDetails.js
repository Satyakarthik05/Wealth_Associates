import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
const ExpertDetails = ({ expertType }) => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/expertPanel/getexpert/${expertType}`)
      .then((response) => response.json())
      .then((data) => {
        setExperts(data.experts || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [expertType]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{expertType} Experts</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : experts.length > 0 ? (
        <FlatList
          data={experts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.expertCard}>
              <Text style={styles.expertName}>{item.Name}</Text>
              <Text style={styles.expertDetails}>
                Qualification: {item.Qualification}
              </Text>
              <Text style={styles.expertDetails}>
                Experience: {item.Experience} years
              </Text>
              <Text style={styles.expertDetails}>
                Location: {item.Locations}
              </Text>
              <Text style={styles.expertDetails}>Mobile: {item.Mobile}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noExperts}>
          No experts found for this category.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  expertCard: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    elevation: 3,
  },
  expertName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  expertDetails: {
    fontSize: 14,
    color: "#666",
  },
  noExperts: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});

export default ExpertDetails;
