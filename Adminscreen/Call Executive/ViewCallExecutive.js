import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";

const ViewCallExecutives = () => {
  const [executives, setExecutives] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentExecutive, setCurrentExecutive] = useState(null);
  const [editedData, setEditedData] = useState({
    name: "",
    phone: "",
    location: "",
    password: "",
  });

  const fetchExecutives = () => {
    setRefreshing(true);
    fetch("http://localhost:3000/callexe/call-executives")
      .then((response) => response.json())
      .then((data) => setExecutives(data))
      .catch((error) => console.error("Error fetching executives:", error))
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchExecutives();
  }, []);

  const handleEditPress = (executive) => {
    setCurrentExecutive(executive);
    setEditedData({
      name: executive.name,
      phone: executive.phone,
      location: executive.location,
      password: "", // Don't show current password for security
    });
    setEditModalVisible(true);
  };

  const handleDelete = (executive) => {
    if (Platform.OS === "web") {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete ${executive.name}?`
      );
      if (confirmDelete) {
        deleteExecutive(executive._id);
      }
    } else {
      Alert.alert(
        "Delete Executive",
        `Are you sure you want to delete ${executive.name}?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: () => deleteExecutive(executive._id),
            style: "destructive",
          },
        ],
        { cancelable: true }
      );
    }
  };

  const deleteExecutive = (id) => {
    fetch(`http://localhost:3000/callexe/call-executives/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete executive");
        return response.json();
      })
      .then(() => {
        fetchExecutives();
        Alert.alert("Success", "Executive deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting executive:", error);
        Alert.alert("Error", error.message || "Failed to delete executive");
      });
  };

  const handleUpdate = () => {
    if (!editedData.name || !editedData.phone || !editedData.location) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    fetch(
      `http://localhost:3000/callexe/call-executives/${currentExecutive._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editedData,
          // Only send password if it was changed
          password: editedData.password || undefined,
        }),
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update executive");
        return response.json();
      })
      .then(() => {
        fetchExecutives();
        setEditModalVisible(false);
        Alert.alert("Success", "Executive updated successfully");
      })
      .catch((error) => {
        console.error("Error updating executive:", error);
        Alert.alert("Error", error.message || "Failed to update executive");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Registered Call Executives</Text>
      <FlatList
        data={executives}
        refreshing={refreshing}
        onRefresh={fetchExecutives}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.detail}>Phone: {item.phone}</Text>
              <Text style={styles.detail}>Location: {item.location}</Text>
              <Text style={styles.detail}>Password: {item.password}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => handleEditPress(item)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => handleDelete(item)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Edit Executive</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={editedData.name}
                onChangeText={(text) =>
                  setEditedData({ ...editedData, name: text })
                }
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={editedData.phone}
                onChangeText={(text) =>
                  setEditedData({ ...editedData, phone: text })
                }
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={editedData.location}
                onChangeText={(text) =>
                  setEditedData({ ...editedData, location: text })
                }
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                New Password (leave blank to keep current)
              </Text>
              <TextInput
                style={styles.input}
                value={editedData.password}
                onChangeText={(text) =>
                  setEditedData({ ...editedData, password: text })
                }
                secureTextEntry
              />
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdate}
              >
                <Text style={styles.modalButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detail: {
    fontSize: 14,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 60,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    width: "90%",
    maxWidth: 400,
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    padding: 12,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ViewCallExecutives;
