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
          agents.map((agent) => (
            <View key={agent._id} style={styles.agentCard}>
              <Image
                source={require("../Admin_Pan/assets/man.png")}
                style={styles.agentImage}
              />
              <View style={styles.agentDetails}>
                <Text style={styles.agentText}>{agent.FullName}</Text>
                <Text style={styles.agentText}>
                  Parliament : {agent.District}
                </Text>
                <Text style={styles.agentText}>
                  Constituency: {agent.Contituency}
                </Text>
                <Text style={styles.agentText}>Phno: {agent.MobileNumber}</Text>
                <Text style={styles.agentText}>
                  Referral Code: {agent.MyRefferalCode}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditAgent(agent)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteAgent(agent._id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.message}>No agents found.</Text>
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
            <Text style={styles.modalHeading}>Edit Agent</Text>
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
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
    width: "100%",
    backgroundColor: "#f2f2f2",
  },
  scrollContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    width: "90%",
    textAlign: "left",
    marginBottom: 20,
    marginTop: Platform.OS === "android" ? "10%" : 0,
  },
  agentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "90%",
    maxWidth: 1000,
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: Platform.OS === "ios" ? 0.1 : 0,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: Platform.OS === "android" ? 2 : 0,
  },
  agentImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  agentDetails: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: Platform.OS === "android" ? "column" : "row",
  },
  agentText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  message: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginTop: 20,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    padding: 8,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "50%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ff4444",
    padding: 12,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
