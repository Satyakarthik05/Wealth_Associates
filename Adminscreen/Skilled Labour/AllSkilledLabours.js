import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { API_URL } from "../../data/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function AllSkilledLabours() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [formData, setFormData] = useState({
    FullName: "",
    SelectSkill: "",
    MobileNumber: "",
    Location: "",
  });

  // Fetch skilled labours
  useEffect(() => {
    const fetchSkilledLabours = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          console.error("No token found in AsyncStorage");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/skillLabour/list`, {
          method: "GET",
          headers: {
            token: `${token}` || "",
          },
        });

        const data = await response.json();
        if (response.ok && Array.isArray(data.skilledLabours)) {
          setAgents(data.skilledLabours);
        } else {
          setAgents([]);
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkilledLabours();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("No token found in AsyncStorage");
        return;
      }

      const response = await fetch(`${API_URL}/skillLabour/delete/${id}`, {
        method: "DELETE",
        headers: {
          token: `${token}` || "",
        },
      });

      if (response.ok) {
        setAgents((prevAgents) =>
          prevAgents.filter((agent) => agent._id !== id)
        );
      } else {
        console.error("Failed to delete agent");
      }
    } catch (error) {
      console.error("Error deleting agent:", error);
    }
  };

  // Handle edit button click
  const handleEdit = (agent) => {
    setSelectedAgent(agent);
    setFormData({
      FullName: agent.FullName,
      SelectSkill: agent.SelectSkill,
      MobileNumber: agent.MobileNumber,
      Location: agent.Location,
    });
    setEditModalVisible(true);
  };

  // Handle form input changes
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle save after editing
  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("No token found in AsyncStorage");
        return;
      }

      const response = await fetch(
        `${API_URL}/skillLabour/update/${selectedAgent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `${token}` || "",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const updatedAgent = await response.json();
        setAgents((prevAgents) =>
          prevAgents.map((agent) =>
            agent._id === updatedAgent._id ? updatedAgent : agent
          )
        );
        setEditModalVisible(false); // Close the modal
      } else {
        console.error("Failed to update agent");
      }
    } catch (error) {
      console.error("Error updating agent:", error);
    }
  };

  // Render agent card
  const renderAgentCard = (item) => (
    <View key={item._id} style={styles.card}>
      <Image source={require("../../assets/man.png")} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>: {item.FullName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Skill Type</Text>
          <Text style={styles.value}>: {item.SelectSkill}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mobile Number</Text>
          <Text style={styles.value}>: {item.MobileNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>: {item.Location}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => handleDelete(item._id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Skilled Resource</Text>
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {loading ? (
          <Text style={styles.emptyText}>Loading...</Text>
        ) : agents.length > 0 ? (
          <View style={width > 600 ? styles.rowWrapper : null}>
            {agents.map((item) => renderAgentCard(item))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No skilled Resouces found.</Text>
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Skilled Resource</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={formData.FullName}
              onChangeText={(text) => handleChange("FullName", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Skill Type"
              value={formData.SelectSkill}
              onChangeText={(text) => handleChange("SelectSkill", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              value={formData.MobileNumber}
              onChangeText={(text) => handleChange("MobileNumber", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={formData.Location}
              onChangeText={(text) => handleChange("Location", text)}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 15,
    paddingLeft: 10,
  },
  gridContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  rowWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: width > 600 ? "35%" : "90%", // 45% on tablets, 90% on mobile
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15, // Softer shadow
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
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "50%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
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
  cancelButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
});
