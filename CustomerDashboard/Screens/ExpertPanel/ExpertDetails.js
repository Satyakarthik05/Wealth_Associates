import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { API_URL } from "../../../data/ApiUrl";

const ExpertDetails = ({ expertType, onSwitch }) => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (!expertType) return;

    fetch(`${API_URL}/expert/getexpert/${expertType}`)
      .then((response) => response.json())
      .then((data) => {
        setExperts(data.experts || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to fetch experts. Please try again later.");
        setLoading(false);
      });
  }, [expertType]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onSwitch(null)}>
        <Text style={styles.backButton}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.header}>{expertType} Experts</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : experts.length > 0 ? (
        <ScrollView contentContainerStyle={styles.cardContainer}>
          {experts.map((item, index) => (
            <TouchableOpacity
              key={item._id}
              style={[
                styles.expertCard,
                selectedIndex === index && styles.selectedCard,
              ]}
              onPress={() => setSelectedIndex(index)}
            >
              <Image
                source={require("../../../assets/man.png")}
                style={styles.profileImage}
              />
              <Text style={styles.expertName}>{item.Name}</Text>
              <Text style={styles.expertDetails}>
                <Text style={styles.label}>Qualification:</Text>{" "}
                {item.Qualification}
              </Text>
              <Text style={styles.expertDetails}>
                <Text style={styles.label}>Experience:</Text> {item.Experience}{" "}
                Years
              </Text>
              <Text style={styles.expertDetails}>
                <Text style={styles.label}>Location:</Text> {item.Locations}
                {/* Request Expert Button */}
              <TouchableOpacity
                style={styles.requestButton}
                onPress={() => requestExpert(item.Name, expertType)}
              >
                <Text style={styles.requestButtonText}>Request Expert</Text>
              </TouchableOpacity>
              </Text>
              
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noExperts}>
          No experts found for this category.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  backButton: { fontSize: 16, color: "blue", marginBottom: 10 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  expertCard: {
    width: Platform.OS === "web" ? "30%" : "60%",
    backgroundColor: "#fff",
    padding: 16,
    margin: 10,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#007bff",
  },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  expertName: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  expertDetails: { fontSize: 14, color: "#555", textAlign: "center" },
  label: { fontWeight: "bold", color: "#333" },
  noExperts: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  errorText: { textAlign: "center", fontSize: 16, color: "red", marginTop: 20 },
});

export default ExpertDetails;
