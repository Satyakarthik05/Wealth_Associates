import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { API_URL } from "../../../data/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Add_Agent from "./Add_Agent";
import Modify_Deatils from "./Modify_Details";
import CustomModal from "../../../Components/CustomModal";
import { useNavigation } from "@react-navigation/native";
// import App from "../../../App";

const { width } = Dimensions.get("window");

const Agent_Profile = ({ onDetailsUpdates }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [Details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    getDetails();
  }, []);

  const handleDetailsUpdate = () => {
    getDetails(); // Fetch the updated details
  };

  const getDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/core/getcore`, {
        method: "GET",
        headers: {
          token: token || "",
        },
      });
      const newDetails = await response.json();
      setDetails(newDetails);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching agent details:", error);
      setLoading(false);
    }
  };

  const LogOut = async () => {
    const token = await AsyncStorage.removeItem("authToken");
    navigation.navigate("App");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.agentProfileText}>Customer Profile</Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FF3366"
            style={styles.loader}
          />
        ) : (
          <>
            <View style={styles.profileHeader}>
              <Image
                source={require("../../../assets/man2.png")}
                style={styles.avatar}
              />
              <Text style={styles.profileName}>{Details.name}</Text>
            </View>
            <View style={styles.profileCard}>
              {/* <Text style={styles.sectionTitle}>My Profile</Text> */}
              <View style={styles.profileForm}>
                {profileFields.map(({ label, icon, key }) => (
                  <CustomInput
                    key={key}
                    label={label}
                    icon={icon}
                    value={Details[key]}
                    labelStyle={styles.label}
                  />
                ))}
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={LogOut}>
                  <Text style={styles.buttonTexts}>Logout </Text>
                </TouchableOpacity>
              </View>
            </View>

            <CustomModal
              isVisible={modalVisible}
              closeModal={() => setModalVisible(false)}
            >
              <Modify_Deatils
                closeModal={() => setModalVisible(false)}
                onDetailsUpdate={handleDetailsUpdate}
              />
            </CustomModal>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const profileFields = [
  { label: "Full Name", icon: "user", key: "FullName" },
  { label: "Mobile Number", icon: "phone", key: "MobileNumber" },
  { label: "Password", icon: "envelope", key: "Password" },
  { label: "Select District", icon: "map-marker", key: "District" },
  { label: "Select Constituency", icon: "location-arrow", key: "Contituency" },
  { label: "Location", icon: "map", key: "Locations" },
  { label: "Select Occupation", icon: "briefcase", key: "Occupation" },
  // { label: "Select Experience", icon: "calendar", key: "Experience" },
  { label: "Referral Code", icon: "users", key: "MyRefferalCode" },
];

const CustomInput = ({ label, icon, value }) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={value || "-"}
        editable={false}
        pointerEvents="none"
      />
      <FontAwesome name={icon} size={20} color="#FF3366" style={styles.icon} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  agentProfileText: {
    fontWeight: 600,
    fontSize: 20,
    marginBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  profileForm: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    flexWrap: Platform.OS === "web" ? "wrap" : "nowrap",
    justifyContent: Platform.OS === "web" ? "space-between" : "flex-start",
    width: "100%",
    fontWeight: 600,
    fontSize: 16,
  },
  inputWrapper: {
    width: Platform.OS === "web" ? "30%" : "100%",
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    width: Platform.OS === "web" ? "100%" : 280,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    width: Platform.OS === "web" ? "100%" : 200,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: Platform.OS === "web" ? "40%" : "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#FF3366",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    backgroundColor: "#E82E5F",
    padding: 10,
    borderRadius: 15,
  },
  buttonTexts: {
    color: "#fff",
    fontSize: 16,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 15,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  label: {
    fontSize: 40,
  },
});

export default Agent_Profile;
