import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { API_URL } from "../../data/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import avatar from "../../assets/man.png";

const { width } = Dimensions.get("window");

export default function AllSkilledLabours() {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [availableSkills, setAvailableSkills] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);

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
          setFilteredAgents(data.skilledLabours);

          // Extract unique skills and locations
          const skills = [
            ...new Set(data.skilledLabours.map((item) => item.SelectSkill)),
          ];
          const locations = [
            ...new Set(data.skilledLabours.map((item) => item.Location)),
          ];

          setAvailableSkills(skills);
          setAvailableLocations(locations);
        } else {
          setAgents([]);
          setFilteredAgents([]);
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkilledLabours();
  }, []);

  const applyFilters = () => {
    let filtered = [...agents];

    if (selectedSkill) {
      filtered = filtered.filter((item) => item.SelectSkill === selectedSkill);
    }

    if (selectedLocation) {
      filtered = filtered.filter((item) => item.Location === selectedLocation);
    }

    setFilteredAgents(filtered);
    setShowFilterModal(false);
  };

  const resetFilters = () => {
    setSelectedSkill("");
    setSelectedLocation("");
    setFilteredAgents(agents);
    setShowFilterModal(false);
  };

  const renderAgentCard = (item) => (
    <View key={item._id} style={styles.card}>
      <Image source={avatar} style={styles.avatar} />
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
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Skilled Resource</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Resources</Text>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Skill Type:</Text>
              <View style={styles.filterOptions}>
                {availableSkills.map((skill) => (
                  <TouchableOpacity
                    key={skill}
                    style={[
                      styles.filterOption,
                      selectedSkill === skill && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedSkill(skill)}
                  >
                    <Text>{skill}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <ScrollView style={{ maxHeight: 200 }}>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Location:</Text>
                <View style={styles.filterOptions}>
                  {availableLocations.map((location) => (
                    <TouchableOpacity
                      key={location}
                      style={[
                        styles.filterOption,
                        selectedLocation === location && styles.selectedOption,
                      ]}
                      onPress={() => setSelectedLocation(location)}
                    >
                      <Text>{location}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.resetButton]}
                onPress={resetFilters}
              >
                <Text style={styles.buttonText}>Reset</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.applyButton]}
                onPress={applyFilters}
              >
                <Text style={styles.buttonText}>Apply</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        {loading ? (
          <Text style={styles.emptyText}>Loading...</Text>
        ) : filteredAgents.length > 0 ? (
          <View style={width > 600 ? styles.rowWrapper : null}>
            {filteredAgents.map((item) => renderAgentCard(item))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No skilled Resources found.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
  },
  filterButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  filterButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  gridContainer: {
    alignItems: "center",
    paddingBottom: 20,
    justifyContent: "center",
  },
  rowWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: width > 600 ? "35%" : "90%",
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
    width: "auto",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedOption: {
    backgroundColor: "#4a90e2",
    borderColor: "#4a90e2",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "#e0e0e0",
  },
  applyButton: {
    backgroundColor: "#4a90e2",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
