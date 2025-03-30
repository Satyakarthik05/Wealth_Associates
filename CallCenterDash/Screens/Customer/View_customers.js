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
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  });
  const [districts, setDistricts] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [coreMembers, setCoreMembers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [referrerNames, setReferrerNames] = useState({});

  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }
      return token;
    } catch (error) {
      console.error("Error getting auth token:", error);
      throw error;
    }
  };

  const fetchAssignedCustomers = async () => {
    try {
      setRefreshing(true);
      setLoading(true);

      const token = await getAuthToken();

      const [customersRes, agentsRes, coreMembersRes, districtsRes] =
        await Promise.all([
          fetch(`${API_URL}/callexe/mycustomers`, {
            headers: {
              token: `${token}` || "",
            },
          }),
          fetch(`${API_URL}/agent/allagents`),
          fetch(`${API_URL}/core/getallcoremembers`),
          fetch(`${API_URL}/alldiscons/alldiscons`),
        ]);

      if (!customersRes.ok)
        throw new Error("Failed to fetch assigned customers");
      if (!agentsRes.ok) throw new Error("Failed to fetch agents");
      if (!coreMembersRes.ok) throw new Error("Failed to fetch core members");
      if (!districtsRes.ok) throw new Error("Failed to fetch districts");

      const customersData = await customersRes.json();
      const agentsData = await agentsRes.json();
      const coreMembersData = await coreMembersRes.json();
      const districtsData = await districtsRes.json();

      const sortedCustomers = customersData.data.sort((a, b) => {
        if (a.CallExecutiveCall === "Done" && b.CallExecutiveCall !== "Done")
          return 1;
        if (a.CallExecutiveCall !== "Done" && b.CallExecutiveCall === "Done")
          return -1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setCustomers(sortedCustomers);
      setFilteredCustomers(sortedCustomers);
      setAgents(agentsData.data || []);
      setCoreMembers(coreMembersData.data || []);
      setDistricts(districtsData || []);

      loadReferrerNames(
        sortedCustomers,
        agentsData.data || [],
        coreMembersData.data || []
      );
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to load assigned customers"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadReferrerNames = (customers = [], agents = [], coreMembers = []) => {
    const names = {};

    customers.forEach((customer) => {
      if (customer?.ReferredBy && !names[customer.ReferredBy]) {
        names[customer.ReferredBy] = getReferrerName(
          customer.ReferredBy,
          customers,
          agents,
          coreMembers
        );
      }
    });

    setReferrerNames(names);
  };

  const getReferrerName = (
    referredByCode,
    customers = [],
    agents = [],
    coreMembers = []
  ) => {
    if (!referredByCode) return "N/A";

    try {
      const customerReferrer = customers.find(
        (c) => c?.MyRefferalCode === referredByCode
      );
      if (customerReferrer) return customerReferrer?.FullName || "Customer";

      const agentReferrer = agents.find(
        (a) => a?.MyRefferalCode === referredByCode
      );
      if (agentReferrer) return agentReferrer?.FullName || "Agent";

      const coreReferrer = coreMembers.find(
        (m) => m?.MyRefferalCode === referredByCode
      );
      if (coreReferrer) return coreReferrer?.FullName || "Core Member";

      if (referredByCode === "WA0000000001") return "Wealth Associate";

      return "Referrer not found";
    } catch (error) {
      console.error("Error in getReferrerName:", error);
      return "Error loading referrer";
    }
  };

  useEffect(() => {
    fetchAssignedCustomers();
    const interval = setInterval(fetchAssignedCustomers, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (customer) =>
          (customer.FullName &&
            customer.FullName.toLowerCase().includes(
              searchQuery.toLowerCase()
            )) ||
          (customer.MobileNumber &&
            customer.MobileNumber.includes(searchQuery)) ||
          (customer.MyRefferalCode &&
            customer.MyRefferalCode.toLowerCase().includes(
              searchQuery.toLowerCase()
            ))
      );
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, customers]);

  const handleRefresh = async () => {
    await fetchAssignedCustomers();
  };

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
      const token = await getAuthToken();

      const response = await fetch(
        `${API_URL}/customer/markasdone/${customerId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      const result = await response.json();

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
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      });

      setFilteredCustomers((prevCustomers) => {
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
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      });

      Alert.alert("Success", "Customer marked as done");
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", error.message || "Failed to update customer status");
    }
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setEditedCustomer({
      FullName: customer.FullName,
      District: customer.District,
      Contituency: customer.Contituency,
      MobileNumber: customer.MobileNumber,
      Occupation: customer.Occupation,
      MyRefferalCode: customer.MyRefferalCode,
    });

    if (customer.District) {
      const district = districts.find(
        (d) => d.parliament === customer.District
      );
      setConstituencies(district?.assemblies || []);
    }
    setEditModalVisible(true);
  };

  const handleDistrictChange = (district) => {
    setEditedCustomer({
      ...editedCustomer,
      District: district,
      Contituency: "",
    });
    const districtData = districts.find((d) => d.parliament === district);
    setConstituencies(districtData?.assemblies || []);
  };

  const handleSaveEditedCustomer = async () => {
    try {
      const token = await getAuthToken();

      const response = await fetch(
        `${API_URL}/customer/updatecustomer/${selectedCustomer._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
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
      setFilteredCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer._id === selectedCustomer._id
            ? updatedCustomer.data
            : customer
        )
      );

      setEditModalVisible(false);
      Alert.alert("Success", "Customer updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", error.message || "Failed to update customer");
    }
  };

  const handleDeleteCustomer = (customerId) => {
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
              { text: "Delete", onPress: () => resolve(true) },
            ]
          );
        });
      }
    };

    confirmDelete().then(async (confirmed) => {
      if (!confirmed) return;

      try {
        const token = await getAuthToken();

        const response = await fetch(
          `${API_URL}/customer/deletecustomer/${customerId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to delete customer");

        setCustomers((prevCustomers) =>
          prevCustomers.filter((customer) => customer._id !== customerId)
        );
        setFilteredCustomers((prevCustomers) =>
          prevCustomers.filter((customer) => customer._id !== customerId)
        );
        Alert.alert("Success", "Customer deleted successfully");
      } catch (error) {
        console.error("Delete error:", error);
        Alert.alert("Error", error.message || "Failed to delete customer");
      }
    });
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
        <Text style={styles.heading}>My Assigned Customers</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, mobile or referral code"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Loading customers...</Text>
          </View>
        ) : filteredCustomers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.noCustomersText}>
              {searchQuery
                ? "No matching customers found"
                : "No customers assigned to you"}
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefresh}
            >
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cardContainer}>
            {filteredCustomers.map((customer) => (
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
                  {customer.ReferredBy && (
                    <View style={styles.row}>
                      <Text style={styles.label}>Referred By</Text>
                      <Text style={styles.value}>
                        : {referrerNames[customer.ReferredBy] || "Loading..."}
                      </Text>
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
                    onPress={() => handleEditCustomer(customer)}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteCustomer(customer._id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Customer</Text>

            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={editedCustomer.FullName}
              onChangeText={(text) =>
                setEditedCustomer({ ...editedCustomer, FullName: text })
              }
            />

            <Text style={styles.inputLabel}>District</Text>
            <View style={styles.pickerWrapper}>
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

            <Text style={styles.inputLabel}>Constituency</Text>
            <View style={styles.pickerWrapper}>
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

            <Text style={styles.inputLabel}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              value={editedCustomer.MobileNumber}
              onChangeText={(text) =>
                setEditedCustomer({ ...editedCustomer, MobileNumber: text })
              }
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Occupation</Text>
            <TextInput
              style={styles.input}
              placeholder="Occupation"
              value={editedCustomer.Occupation}
              onChangeText={(text) =>
                setEditedCustomer({ ...editedCustomer, Occupation: text })
              }
            />

            <Text style={styles.inputLabel}>Referral Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Referral Code"
              value={editedCustomer.MyRefferalCode}
              onChangeText={(text) =>
                setEditedCustomer({ ...editedCustomer, MyRefferalCode: text })
              }
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEditedCustomer}
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
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 15,
    paddingLeft: 10,
    color: "#333",
  },
  searchContainer: {
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  noCustomersText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  refreshButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
  },
  refreshButtonText: {
    color: "white",
    fontWeight: "bold",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: width > 600 ? "50%" : "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
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
