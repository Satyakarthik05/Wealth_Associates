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
import { Picker } from "@react-native-picker/picker";
import { API_URL } from "../data/ApiUrl";

const { width } = Dimensions.get("window");

export default function ViewAgents() {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
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
  const [districts, setDistricts] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch agents from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch agents
        const agentsResponse = await fetch(`${API_URL}/agent/allagents`);
        if (!agentsResponse.ok) {
          throw new Error("Failed to fetch agents");
        }
        const agentsData = await agentsResponse.json();
        setAgents(agentsData.data);
        setFilteredAgents(agentsData.data);

        // Fetch districts and constituencies
        const disConsResponse = await fetch(`${API_URL}/alldiscons/alldiscons`);
        if (!disConsResponse.ok) {
          throw new Error("Failed to fetch districts and constituencies");
        }
        const disConsData = await disConsResponse.json();
        setDistricts(disConsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter agents based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAgents(agents);
    } else {
      const filtered = agents.filter(
        (agent) =>
          (agent.FullName &&
            agent.FullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (agent.MobileNumber && agent.MobileNumber.includes(searchQuery)) ||
          (agent.MyRefferalCode &&
            agent.MyRefferalCode.toLowerCase().includes(
              searchQuery.toLowerCase()
            ))
      );
      setFilteredAgents(filtered);
    }
  }, [searchQuery, agents]);

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

    // Set constituencies for the current district
    if (agent.District) {
      const selectedDistrict = districts.find(
        (item) => item.parliament === agent.District
      );
      if (selectedDistrict) {
        setConstituencies(selectedDistrict.assemblies);
      }
    }
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

  // Handle delete agent
  const handleDeleteAgent = (agentId) => {
    if (Platform.OS === "web") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this agent?"
      );
      if (!confirmDelete) return;
      deleteAgent(agentId);
    } else {
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

  // Update constituencies when district changes in the modal
  const handleDistrictChange = (itemValue) => {
    setEditedAgent({
      ...editedAgent,
      District: itemValue,
      Contituency: "", // Reset constituency when district changes
    });

    // Update constituencies when district changes
    const selectedDistrict = districts.find(
      (item) => item.parliament === itemValue
    );
    if (selectedDistrict) {
      setConstituencies(selectedDistrict.assemblies);
    } else {
      setConstituencies([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>My Agents</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, mobile or referral code"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {loading ? (
          <Text style={styles.message}>Loading...</Text>
        ) : filteredAgents.length > 0 ? (
          <View style={styles.cardContainer}>
            {filteredAgents.map((agent) => (
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
                <View style={styles.buttonContainer}>
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
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noAgentsText}>
            {searchQuery ? "No matching agents found" : "No agents found."}
          </Text>
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

            {/* District Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>District</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={editedAgent.District}
                  onValueChange={handleDistrictChange}
                  style={styles.picker}
                  dropdownIconColor="#000"
                >
                  <Picker.Item label="Select District" value="" />
                  {districts.map((district) => (
                    <Picker.Item
                      key={district.parliament}
                      label={district.parliament}
                      value={district.parliament}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Constituency Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Constituency</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={editedAgent.Contituency}
                  onValueChange={(itemValue) => {
                    setEditedAgent({
                      ...editedAgent,
                      Contituency: itemValue,
                    });
                  }}
                  style={styles.picker}
                  dropdownIconColor="#000"
                  enabled={!!editedAgent.District}
                >
                  <Picker.Item label="Select Constituency" value="" />
                  {constituencies.map((constituency) => (
                    <Picker.Item
                      key={constituency.name}
                      label={constituency.name}
                      value={constituency.name}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              value={editedAgent.MobileNumber}
              onChangeText={(text) =>
                setEditedAgent({ ...editedAgent, MobileNumber: text })
              }
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Referral Code"
              value={editedAgent.MyRefferalCode}
              onChangeText={(text) =>
                setEditedAgent({ ...editedAgent, MyRefferalCode: text })
              }
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEditedAgent}
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
  scrollContainer: {
    paddingBottom: 20,
    marginBottom: 40,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 15,
    paddingLeft: 10,
  },
  searchContainer: {
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
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
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  editButton: {
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
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
  noAgentsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  message: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
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
    fontSize: 16,
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdownLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 30,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
