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
  Alert,
  Modal,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../data/ApiUrl";

const ExpertDetails = ({ expertType, onSwitch }) => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Details, setDetails] = useState({});
  const [PostedBy, setPostedBy] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [selectedExpert, setSelectedExpert] = useState(null); // State to store the selected expert
  const [updatedData, setUpdatedData] = useState({
    // State for updated expert data
    Name: "",
    Qualification: "",
    Experience: "",
    Locations: "",
    Mobile: "",
  });

  useEffect(() => {
    if (!expertType) return;
    fetchExperts();
  }, [expertType]);

  const fetchExperts = () => {
    setLoading(true);
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
  };

  const getDetails = async () => {
    try {
      // const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/agent/AgentDetails`, {
        method: "GET",
        headers: {
          token: `${token}` || "",
        },
      });

      const newDetails = await response.json();
      setPostedBy(newDetails.MobileNumber);
      setDetails(newDetails);
    } catch (error) {
      console.error("Error fetching agent details:", error);
    }
  };

  const modifyExpert = async (expertId, updatedData) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/expert/update/${expertId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Expert updated successfully");
        fetchExperts();
        setIsModalVisible(false); // Close the modal after successful update
      } else {
        Alert.alert("Error", result.message || "Failed to update expert");
      }
    } catch (error) {
      console.error("Error updating expert:", error);
      Alert.alert("Error", "An error occurred while updating the expert");
    }
  };

  const deleteExpert = async (expertId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/expert/delete/${expertId}`, {
        method: "DELETE",
        headers: {
          token: `${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Expert deleted successfully");
        fetchExperts();
      } else {
        Alert.alert("Error", result.message || "Failed to delete expert");
      }
    } catch (error) {
      console.error("Error deleting expert:", error);
      Alert.alert("Error", "An error occurred while deleting the expert");
    }
  };

  const openEditModal = (expert) => {
    setSelectedExpert(expert); // Set the selected expert
    setUpdatedData({
      // Pre-fill the modal with existing data
      Name: expert.Name,
      Qualification: expert.Qualification,
      Experience: expert.Experience,
      Locations: expert.Locations,
      Mobile: expert.Mobile,
    });
    setIsModalVisible(true); // Show the modal
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onSwitch(null)}>
        {/* <Text style={styles.backButton}>Back</Text> */}
      </TouchableOpacity>
      <Text style={styles.header}>{expertType} Experts</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : experts.length > 0 ? (
        <ScrollView contentContainerStyle={styles.cardContainer}>
          {experts.map((item, index) => (
            <View key={item._id} style={styles.expertCard}>
              <Image
                source={require("../../assets/man.png")}
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
              </Text>
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => openEditModal(item)} // Open the modal with expert data
                >
                  <Text style={styles.requestButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    Alert.alert(
                      "Delete Expert",
                      "Are you sure you want to delete this expert?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          onPress: () => deleteExpert(item._id),
                        },
                      ]
                    );
                  }}
                >
                  <Text style={styles.requestButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noExperts}>
          No experts found for this category.
        </Text>
      )}

      {/* Modal for Editing Expert Details */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Edit Expert Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={updatedData.Name}
              onChangeText={(text) =>
                setUpdatedData({ ...updatedData, Name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Qualification"
              value={updatedData.Qualification}
              onChangeText={(text) =>
                setUpdatedData({ ...updatedData, Qualification: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Experience"
              value={updatedData.Experience}
              onChangeText={(text) =>
                setUpdatedData({ ...updatedData, Experience: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={updatedData.Locations}
              onChangeText={(text) =>
                setUpdatedData({ ...updatedData, Locations: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Mobile"
              value={updatedData.Mobile}
              onChangeText={(text) =>
                setUpdatedData({ ...updatedData, Mobile: text })
              }
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => modifyExpert(selectedExpert._id, updatedData)}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    width: Platform.OS === "web" ? "30%" : "90%",
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
  editButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  requestButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  buttons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    flexDirection: "row",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: Platform.OS === "web" ? "40%" : "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ExpertDetails;
