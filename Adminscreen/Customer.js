import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../data/ApiUrl";

const { width } = Dimensions.get("window");

export default function ViewCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editedCustomer, setEditedCustomer] = useState({
    FullName: "",
    MobileNumber: "",
    Occupation: "",
    MyRefferalCode: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_URL}/customer/allcustomers`);
      const data = await response.json();
      setCustomers(data.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      Alert.alert("Error", "Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      const response = await fetch(`${API_URL}/customer/deletecustomer/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCustomers(customers.filter((customer) => customer._id !== id));
        Alert.alert("Success", "Customer deleted successfully.");
      } else {
        throw new Error("Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      Alert.alert("Error", "Failed to delete customer.");
    }
  };

  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setEditedCustomer({
      FullName: customer.FullName,
      MobileNumber: customer.MobileNumber,
      Occupation: customer.Occupation,
      MyRefferalCode: customer.MyRefferalCode,
    });
    setEditModalVisible(true);
  };

  const handleEditCustomer = async () => {
    try {
      const response = await fetch(
        `${API_URL}/customer/updatecustomer/${selectedCustomer._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedCustomer),
        }
      );
      if (response.ok) {
        const updatedCustomer = await response.json();
        setCustomers(
          customers.map((customer) =>
            customer._id === updatedCustomer.data._id
              ? updatedCustomer.data
              : customer
          )
        );
        setEditModalVisible(false);
        Alert.alert("Success", "Customer updated successfully.");
      } else {
        throw new Error("Failed to update customer");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      Alert.alert("Error", "Failed to update customer.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Customers</Text>
      <View
        style={
          Platform.OS === "web" ? styles.gridContainerWeb : styles.gridContainer
        }
      >
        {customers.length > 0 ? (
          customers.map((item) => (
            <View key={item._id} style={styles.card}>
              <Image
                source={require("../assets/man.png")}
                style={styles.avatar}
              />
              <View style={styles.infoContainer}>
                {item.FullName && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.value}>: {item.FullName}</Text>
                  </View>
                )}
                {item.MobileNumber && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Mobile</Text>
                    <Text style={styles.value}>: {item.MobileNumber}</Text>
                  </View>
                )}
                {item.Occupation && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Occupation</Text>
                    <Text style={styles.value}>: {item.Occupation}</Text>
                  </View>
                )}
                {item.MyRefferalCode && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Referral Code</Text>
                    <Text style={styles.value}>: {item.MyRefferalCode}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => openEditModal(item)}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteCustomer(item._id)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noCustomersText}>No customers found.</Text>
        )}
      </View>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Customer</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={editedCustomer.FullName}
              onChangeText={(text) =>
                setEditedCustomer({ ...editedCustomer, FullName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              value={editedCustomer.MobileNumber}
              onChangeText={(text) =>
                setEditedCustomer({ ...editedCustomer, MobileNumber: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Occupation"
              value={editedCustomer.Occupation}
              onChangeText={(text) =>
                setEditedCustomer({ ...editedCustomer, Occupation: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Referral Code"
              value={editedCustomer.MyRefferalCode}
              onChangeText={(text) =>
                setEditedCustomer({ ...editedCustomer, MyRefferalCode: text })
              }
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleEditCustomer}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 15,
    paddingLeft: 10,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  gridContainerWeb: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingBottom: 20,
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
  noCustomersText: {
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
