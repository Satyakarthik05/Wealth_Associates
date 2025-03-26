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
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
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
  const [districts, setDistricts] = useState([]);
  const [constituencies, setConstituencies] = useState([]);

  // Fetch customers and districts/constituencies
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers
        const customersResponse = await fetch(
          `${API_URL}/customer/allcustomers`
        );
        if (!customersResponse.ok) {
          throw new Error("Failed to fetch customers");
        }
        const customersData = await customersResponse.json();
        setCustomers(customersData.data);

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

  // Handle edit customer
  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setEditedCustomer({
      FullName: customer.FullName,
      MobileNumber: customer.MobileNumber,
      Occupation: customer.Occupation,
      MyRefferalCode: customer.MyRefferalCode,
      District: customer.District || "",
      Contituency: customer.Contituency || "",
    });

    // Set constituencies if district exists
    if (customer.District) {
      const selectedDistrict = districts.find(
        (item) => item.parliament === customer.District
      );
      if (selectedDistrict) {
        setConstituencies(selectedDistrict.assemblies);
      }
    }
    setEditModalVisible(true);
  };

  // Handle save edited customer
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
      if (!response.ok) throw new Error("Failed to update customer");

      const updatedCustomer = await response.json();
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer._id === selectedCustomer._id
            ? updatedCustomer.data
            : customer
        )
      );
      setEditModalVisible(false);
      Alert.alert("Success", "Customer updated successfully.");
    } catch (error) {
      console.error("Error updating customer:", error);
      Alert.alert("Error", "Failed to update customer.");
    }
  };

  // Handle delete customer
  const deleteCustomer = (customerId) => {
    if (Platform.OS === "web") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this customer?"
      );
      if (!confirmDelete) return;
      performDelete(customerId);
    } else {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this customer?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => performDelete(customerId),
          },
        ]
      );
    }
  };

  const performDelete = async (customerId) => {
    try {
      const response = await fetch(
        `${API_URL}/customer/deletecustomer/${customerId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete customer");

      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer._id !== customerId)
      );
      Alert.alert("Success", "Customer deleted successfully.");
    } catch (error) {
      console.error("Error deleting customer:", error);
      Alert.alert("Error", "Failed to delete customer.");
    }
  };

  // Update constituencies when district changes
  const handleDistrictChange = (itemValue) => {
    setEditedCustomer({
      ...editedCustomer,
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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>My Customers</Text>

        {customers.length > 0 ? (
          <View style={styles.cardContainer}>
            {customers.map((customer) => (
              <View key={customer._id} style={styles.card}>
                <Image
                  source={require("../assets/man.png")}
                  style={styles.avatar}
                />
                <View style={styles.infoContainer}>
                  {customer.FullName && (
                    <View style={styles.row}>
                      <Text style={styles.label}>Name</Text>
                      <Text style={styles.value}>: {customer.FullName}</Text>
                    </View>
                  )}
                  {customer.MobileNumber && (
                    <View style={styles.row}>
                      <Text style={styles.label}>Mobile</Text>
                      <Text style={styles.value}>
                        : {customer.MobileNumber}
                      </Text>
                    </View>
                  )}
                  {customer.Occupation && (
                    <View style={styles.row}>
                      <Text style={styles.label}>Occupation</Text>
                      <Text style={styles.value}>: {customer.Occupation}</Text>
                    </View>
                  )}
                  {customer.MyRefferalCode && (
                    <View style={styles.row}>
                      <Text style={styles.label}>Referral Code</Text>
                      <Text style={styles.value}>
                        : {customer.MyRefferalCode}
                      </Text>
                    </View>
                  )}
                  {customer.District && (
                    <View style={styles.row}>
                      <Text style={styles.label}>District</Text>
                      <Text style={styles.value}>: {customer.District}</Text>
                    </View>
                  )}
                  {customer.Contituency && (
                    <View style={styles.row}>
                      <Text style={styles.label}>Constituency</Text>
                      <Text style={styles.value}>: {customer.Contituency}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditModal(customer)}
                  >
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteCustomer(customer._id)}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noCustomersText}>No customers found.</Text>
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
              keyboardType="phone-pad"
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

            {/* District Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>District</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={editedCustomer.District}
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
                  selectedValue={editedCustomer.Contituency}
                  onValueChange={(itemValue) => {
                    setEditedCustomer({
                      ...editedCustomer,
                      Contituency: itemValue,
                    });
                  }}
                  style={styles.picker}
                  dropdownIconColor="#000"
                  enabled={!!editedCustomer.District}
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

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleEditCustomer}
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  noCustomersText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
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
    backgroundColor: "#fff",
    height: 30,
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
