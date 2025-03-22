import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { API_URL } from "../../../data/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modify_Deatils from "./Modify_Details";
import CustomModal from "../../../Components/CustomModal";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const Agent_Profile = ({ onDetailsUpdates }) => {
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
      const response = await fetch(`${API_URL}/investors/getinvestor`, {
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
    await AsyncStorage.removeItem("authToken");
    navigation.navigate("App");
  };
  const LogOuts = async () => {
    // Show a confirmation alert
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            Alert.alert("Your delete account request is successfuly submited our executive will reach  you out soon to confirm")
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.agentProfileText}>Investor Profile</Text>
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
              {/* <Text style={styles.profileName}>{Details.FullName}</Text> */}
            </View>
            <View style={styles.profileCard}>
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
              <TouchableOpacity style={{display:"flex",alignItems:"center", justifyContent:"center",marginTop:10}} onPress={LogOuts}>
                  <Text style={styles.buttonTexts}>Delete Your Account </Text>
              </TouchableOpacity>
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
  // { label: "Password", icon: "phone", key: "Password" },
  { label: "Location", icon: "map", key: "Location" },
  { label: "Select Skill", icon: "briefcase", key: "SelectSkill" },
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
    fontWeight: "600",
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
    fontWeight: "600",
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
