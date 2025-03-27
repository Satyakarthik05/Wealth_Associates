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
  RefreshControl,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API_URL } from "../../../data/ApiUrl";

const { width } = Dimensions.get("window");

export default function ViewCustomers() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editedCustomer, setEditedCustomer] = useState({
    FullName: "",
    MobileNumber: "",
    Occupation: "",
    MyRefferalCode: "",
    District: "",
    Contituency: "",
    CallExecutiveCall: "",
  });
  const [districts, setDistricts] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch customers and filter by ReferredBy
  const fetchCustomers = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`${API_URL}/customer/allcustomers`);
      if (!response.ok) throw new Error("Failed to fetch customers");

      const data = await response.json();
      // Filter customers by ReferredBy
      const filtered = data.data.filter(
        (customer) => customer.ReferredBy === "WA0000000001"
      );

      // Sort by status (pending first)
      const sortedCustomers = filtered.sort((a, b) => {
        if (a.CallExecutiveCall === "Done" && b.CallExecutiveCall !== "Done")
          return 1;
        if (a.CallExecutiveCall !== "Done" && b.CallExecutiveCall === "Done")
          return -1;
        return 0;
      });

      setCustomers(sortedCustomers);
      setFilteredCustomers(sortedCustomers);
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Failed to load customers");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch districts
  const fetchDistricts = async () => {
    try {
      const response = await fetch(`${API_URL}/alldiscons/alldiscons`);
      if (!response.ok) throw new Error("Failed to fetch districts");
      setDistricts(await response.json());
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      await fetchDistricts();
      await fetchCustomers();
    };
    loadData();
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    await fetchCustomers();
  };

  // Mark customer as done with confirmation
  const handleMarkAsDone = async (customerId) => {
    const confirm = () => {
      if (Platform.OS === "web") {
        return window.confirm(
          "Are you sure you want to mark this customer as done?"
        );
      } else {
        return new Promise((resolve) => {
          Alert.alert("Confirm", "Mark this customer as done?", [
            { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
            { text: "Confirm", onPress: () => resolve(true) },
          ]);
        });
      }
    };

    if (!(await confirm())) return;

    try {
      const response = await fetch(
        `http://localhost:3000/customer/markasdone/${customerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ CallExecutiveCall: "Done" }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      // Optimistic update
      setCustomers((prevCustomers) => {
        const updated = prevCustomers.map((customer) =>
          customer._id === customerId
            ? { ...customer, CallExecutiveCall: "Done" }
            : customer
        );
        return updated.sort((a, b) => {
          if (a.CallExecutiveCall === "Done" && b.CallExecutiveCall !== "Done")
            return 1;
          if (a.CallExecutiveCall !== "Done" && b.CallExecutiveCall === "Done")
            return -1;
          return 0;
        });
      });

      Alert.alert("Success", "Customer marked as done");
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update customer status");
      fetchCustomers(); // Revert to actual data
    }
  };

  // Edit customer functions
  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setEditedCustomer({
      FullName: customer.FullName,
      MobileNumber: customer.MobileNumber,
      Occupation: customer.Occupation,
      MyRefferalCode: customer.MyRefferalCode,
      District: customer.District || "",
      Contituency: customer.Contituency || "",
      CallExecutiveCall: customer.CallExecutiveCall || "",
    });

    // Set constituencies if district exists
    if (customer.District) {
      const selectedDistrict = districts.find(
        (d) => d.parliament === customer.District
      );
      setConstituencies(selectedDistrict?.assemblies || []);
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
        prevCustomers
          .map((customer) =>
            customer._id === selectedCustomer._id
              ? updatedCustomer.data
              : customer
          )
          .sort((a, b) => {
            if (
              a.CallExecutiveCall === "Done" &&
              b.CallExecutiveCall !== "Done"
            )
              return 1;
            if (
              a.CallExecutiveCall !== "Done" &&
              b.CallExecutiveCall === "Done"
            )
              return -1;
            return 0;
          })
      );
      setEditModalVisible(false);
      Alert.alert("Success", "Customer updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update customer");
    }
  };

  // Delete customer functions
  const deleteCustomer = (customerId) => {
    const confirmDelete = () => {
      if (Platform.OS === "web") {
        return window.confirm("Are you sure you want to delete this customer?");
      } else {
        return new Promise((resolve) => {
          Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this customer?",
            [
              {
                text: "Cancel",
                onPress: () => resolve(false),
                style: "cancel",
              },
              {
                text: "Delete",
                onPress: () => resolve(true),
                style: "destructive",
              },
            ]
          );
        });
      }
    };

    confirmDelete().then(async (confirmed) => {
      if (!confirmed) return;

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
        Alert.alert("Success", "Customer deleted successfully");
      } catch (error) {
        console.error("Delete error:", error);
        Alert.alert("Error", "Failed to delete customer");
      }
    });
  };

  // Update constituencies when district changes
  const handleDistrictChange = (district) => {
    setEditedCustomer({
      ...editedCustomer,
      District: district,
      Contituency: "",
    });
    const districtData = districts.find((d) => d.parliament === district);
    setConstituencies(districtData?.assemblies || []);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          Platform.OS !== "web" ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#0000ff"]}
            />
          ) : undefined
        }
      >
        <Text style={styles.heading}>My Customers</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : customers.length === 0 ? (
          <Text style={styles.noCustomersText}>No customers found</Text>
        ) : (
          <View style={styles.cardContainer}>
            {customers.map((customer) => (
              <View
                key={customer._id}
                style={[
                  styles.card,
                  customer.CallExecutiveCall === "Done"
                    ? styles.doneCard
                    : styles.pendingCard,
                ]}
              >
                <Image
                  source={require("../../../assets/man.png")}
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
                  <View style={styles.row}>
                    <Text style={styles.label}>Status</Text>
                    <Text
                      style={[
                        styles.value,
                        customer.CallExecutiveCall === "Done"
                          ? styles.doneStatus
                          : styles.pendingStatus,
                      ]}
                    >
                      :{" "}
                      {customer.CallExecutiveCall === "Done"
                        ? "Done"
                        : "Pending"}
                    </Text>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  {customer.CallExecutiveCall !== "Done" && (
                    <TouchableOpacity
                      style={styles.doneButton}
                      onPress={() => handleMarkAsDone(customer._id)}
                    >
                      <Text style={styles.buttonText}>Done</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditModal(customer)}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteCustomer(customer._id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
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

            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={editedCustomer.FullName}
              onChangeText={(text) =>
                setEditedCustomer({ ...editedCustomer, FullName: text })
              }
              placeholder="Enter full name"
            />

            <Text style={styles.inputLabel}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              value={editedCustomer.MobileNumber}
              onChangeText={(text) =>
                setEditedCustomer({ ...editedCustomer, MobileNumber: text })
              }
              placeholder="Enter mobile number"
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Occupation</Text>
            <TextInput
              style={styles.input}
              value={editedCustomer.Occupation}
              onChangeText={(text) =>
                setEditedCustomer({ ...editedCustomer, Occupation: text })
              }
              placeholder="Enter occupation"
            />

            <Text style={styles.inputLabel}>Referral Code</Text>
            <TextInput
              style={styles.input}
              value={editedCustomer.MyRefferalCode}
              onChangeText={(text) =>
                setEditedCustomer({ ...editedCustomer, MyRefferalCode: text })
              }
              placeholder="Enter referral code"
            />

            <Text style={styles.inputLabel}>District</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={editedCustomer.District}
                onValueChange={handleDistrictChange}
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

            <Text style={styles.inputLabel}>Constituency</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={editedCustomer.Contituency}
                onValueChange={(value) =>
                  setEditedCustomer({ ...editedCustomer, Contituency: value })
                }
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

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleEditCustomer}
              >
                <Text style={styles.modalButtonText}>Save</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  noCustomersText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
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
  doneCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  pendingCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#F44336",
    backgroundColor: "#FFEBEE",
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
    color: "#555",
  },
  value: {
    fontSize: 14,
    color: "#333",
  },
  doneStatus: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  pendingStatus: {
    color: "#F44336",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center",
  },
  doneButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  editButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
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
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    backgroundColor: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#F44336",
    marginRight: 10,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
