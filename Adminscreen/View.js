import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../data/ApiUrl";

const { width } = Dimensions.get("window");

export default function ViewAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [editedAgent, setEditedAgent] = useState({
    FullName: "",
    District: "",
    Contituency: "",
    MobileNumber: "",
    MyRefferalCode: "",
  });

  // Fetch agents from the API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(`${API_URL}/agent/allagents`);
        if (!response.ok) {
          throw new Error("Failed to fetch agents");
        }
        const data = await response.json();
        setAgents(data.data); // Set the fetched agents
        setLoading(false);
      } catch (error) {
        console.error("Error fetching agents:", error);
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Handle delete agent
  const handleDeleteAgent = (agentId) => {
    if (Platform.OS === "web") {
      // Use window.confirm on Web
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this agent?"
      );
      if (!confirmDelete) return;
      deleteAgent(agentId);
    } else {
      // Use Alert.alert on Mobile
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this agent?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deleteAgent(agentId),
          },
        ]
      );
    }
  };

  // Extracted delete function to avoid duplication
  const deleteAgent = async (agentId) => {
    try {
      const response = await fetch(`${API_URL}/agent/deleteagent/${agentId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete agent");

      setAgents((prevAgents) =>
        prevAgents.filter((agent) => agent._id !== agentId)
      );
      Alert.alert("Success", "Agent deleted successfully.");
    } catch (error) {
      console.error("Error deleting agent:", error);
      Alert.alert("Error", "Failed to delete agent.");
    }
  };

  // Handle edit agent
  const handleEditAgent = (agent) => {
    setSelectedAgent(agent);
    setEditedAgent({
      FullName: agent.FullName,
      District: agent.District,
      Contituency: agent.Contituency,
      MobileNumber: agent.MobileNumber,
      MyRefferalCode: agent.MyRefferalCode,
    });
    setEditModalVisible(true);
  };

  // Handle save edited agent
  const handleSaveEditedAgent = async () => {
    try {
      const response = await fetch(
        `${API_URL}/agent/updateagent/${selectedAgent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedAgent),
        }
      );
      if (!response.ok) throw new Error("Failed to update agent");

      const updatedAgent = await response.json();
      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent._id === selectedAgent._id ? updatedAgent.data : agent
        )
      );
      setEditModalVisible(false);
      Alert.alert("Success", "Agent updated successfully.");
    } catch (error) {
      console.error("Error updating agent:", error);
      Alert.alert("Error", "Failed to update agent.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>My Agents</Text>

        {loading ? (
          <Text style={styles.message}>Loading...</Text>
        ) : agents.length > 0 ? (
          <View style={styles.cardContainer}>
            {agents.map((agent) => (
              <View key={agent._id} style={styles.card}>
                <Image
                  source={require("../assets/man.png")}
                  style={styles.avatar}
                />
                <View style={styles.infoContainer}>
                  {agent.FullName && (
                    <View style={styles.row}>
                      <Text style={styles.label}>Name</Text>
                      <Text style={styles.value}>: {agent.FullName}</Text>
                    </View>
                  )}
                  {agent.District && (
                    <View style={styles.row}>
                      <Text style={styles.label}>District</Text>
                      <Text style={styles.value}>: {agent.District}</Text>
                    </View>
                  )}
                  {agent.Contituency && (
                    <View style={styles.row}>
                      <Text style={styles.label}>Constituency</Text>
                      <Text style={styles.value}>: {agent.Contituency}</Text>
                    </View>
                  )}
                  {agent.MobileNumber && (
                    <View style={styles.row}>
                      <Text style={styles.label}>Mobile</Text>
                      <Text style={styles.value}>: {agent.MobileNumber}</Text>
                    </View>
                  )}
                  {agent.MyRefferalCode && (
                    <View style={styles.row}>
                      <Text style={styles.label}>Referral Code</Text>
                      <Text style={styles.value}>: {agent.MyRefferalCode}</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditAgent(agent)}
                >
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteAgent(agent._id)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noAgentsText}>No agents found.</Text>
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Agent</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={editedAgent.FullName}
              onChangeText={(text) =>
                setEditedAgent({ ...editedAgent, FullName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="District"
              value={editedAgent.District}
              onChangeText={(text) =>
                setEditedAgent({ ...editedAgent, District: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Constituency"
              value={editedAgent.Contituency}
              onChangeText={(text) =>
                setEditedAgent({ ...editedAgent, Contituency: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              value={editedAgent.MobileNumber}
              onChangeText={(text) =>
                setEditedAgent({ ...editedAgent, MobileNumber: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Referral Code"
              value={editedAgent.MyRefferalCode}
              onChangeText={(text) =>
                setEditedAgent({ ...editedAgent, MyRefferalCode: text })
              }
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveEditedAgent}
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
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
  scrollContainer: {
    paddingBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 15,
    paddingLeft: 10,
  },
  cardContainer: {
    flexDirection: "row", // Display cards in a row
    flexWrap: "wrap", // Allow cards to wrap to the next line
    justifyContent: "space-between", // Add space between cards
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: width > 600 ? "30%" : "100%", // Adjust width for responsiveness
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
  noAgentsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  editButton: {
    marginTop: 10,
    backgroundColor: "blue",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  editText: {
    color: "white",
    fontWeight: "bold",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: width > 600 ? "50%" : "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "white",
    fontWeight: "bold",
  },
});
