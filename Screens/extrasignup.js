import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";

const { width } = Dimensions.get("window");

const Register_screen = () => {
  const navigation = useNavigation();
  const [fullname, setFullname] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState(null);
  const [constituency, setConstituency] = useState(null);
  const [location, setLocation] = useState("");
  const [expertise, setExpertise] = useState(null);
  const [experience, setExperience] = useState(null);
  const [referralCode, setReferralCode] = useState("");

  const districts = [
    { label: "District 1", value: "district1" },
    { label: "District 2", value: "district2" },
  ];

  const constituenciesByDistrict = {
    district1: [
      { label: "Constituency 1-1", value: "constituency1-1" },
      { label: "Constituency 1-2", value: "constituency1-2" },
    ],
    district2: [
      { label: "Constituency 2-1", value: "constituency2-1" },
      { label: "Constituency 2-2", value: "constituency2-2" },
    ],
  };

  const expertiseOptions = [
    { label: "Finance", value: "finance" },
    { label: "Investment", value: "investment" },
    { label: "Banking", value: "banking" },
    { label: "Insurance", value: "insurance" },
  ];

  const experienceLevels = [
    { label: "Fresher", value: "fresher" },
    { label: "1-3 years", value: "1-3" },
    { label: "3-5 years", value: "3-5" },
    { label: "5+ years", value: "5+" },
  ];

  const handleRegister = async () => {
    if (
      !fullname ||
      !mobile ||
      !email ||
      !district ||
      !constituency ||
      !location ||
      !expertise ||
      !experience
    ) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const userData = {
      FullName: fullname,
      MobileNumber: mobile,
      Email: email,
      District: district,
      Constituency: constituency,
      Location: location,
      Expertise: expertise,
      Experience: experience,
      ReferralCode: referralCode,
      Password: "Wealth", // Hardcoded as per backend
    };

    try {
      const response = await fetch(
        "http://192.168.225.105/agent/AgentRegister",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        Alert.alert("Success", "Registration successful!");
        navigation.navigate("Login");
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      Alert.alert(
        "Error",
        "Failed to connect to the server. Please try again later."
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <Text style={styles.tagline}>Your Trusted Property Consultant</Text>
          <Text style={styles.title}>REGISTER AS AN AGENT</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fullname</Text>
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor="rgba(25, 25, 25, 0.5)"
              onChangeText={setFullname}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              placeholderTextColor="rgba(25, 25, 25, 0.5)"
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(25, 25, 25, 0.5)"
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select District</Text>
            <Dropdown
              data={districts}
              labelField="label"
              valueField="value"
              placeholder="~ Select District ~"
              value={district}
              onChange={(item) => {
                setDistrict(item.value);
                setConstituency(null);
              }}
              style={styles.dropdown}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Constituency</Text>
            <Dropdown
              data={district ? constituenciesByDistrict[district] || [] : []}
              labelField="label"
              valueField="value"
              placeholder="~ Select Constituency ~"
              value={constituency}
              onChange={(item) => setConstituency(item.value)}
              style={styles.dropdown}
              disable={!district}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Location"
              placeholderTextColor="rgba(25, 25, 25, 0.5)"
              onChangeText={setLocation}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Expertise</Text>
            <Dropdown
              data={expertiseOptions}
              labelField="label"
              valueField="value"
              placeholder="~ Select Expertise ~"
              value={expertise}
              onChange={(item) => setExpertise(item.value)}
              style={styles.dropdown}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Experience</Text>
            <Dropdown
              data={experienceLevels}
              labelField="label"
              valueField="value"
              placeholder="~ Select Experience ~"
              value={experience}
              onChange={(item) => setExperience(item.value)}
              style={styles.dropdown}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Referral Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Referral Code"
              placeholderTextColor="rgba(25, 25, 25, 0.5)"
              onChangeText={setReferralCode}
            />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  input_label: {
    display: "flex",
    flexDirection: "column",
    marginBottom: Platform.OS === "android" ? 0 : 0, // Add margin for Android
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    width: Platform.OS === "android" ? "100%" : "270px",
    height: 47,
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 13,
  },
  dropdown: {
    backgroundColor: "#FFF",
    borderColor: "#ccc",
    borderRadius: 10,
    height: 47,
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  card: {
    display: "flex",
    justifyContent: "center",
    width: Platform.OS === "web" ? (width > 1024 ? "60%" : "80%") : "90%",
    marginTop: Platform.OS === "web" ? "3%" : 0,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    alignItems: "center",
    borderWidth: Platform.OS === "web" ? 0 : 1,
    borderColor: Platform.OS === "web" ? "transparent" : "#ccc",
  },
  logo: {
    width: 100,
    height: 70,
    resizeMode: "contain",
    marginBottom: 10,
  },
  tagline: {
    fontSize: 9,
    color: "#000",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginTop: 10,
    marginBottom: 20,
  },
  webInputWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: 20,
    marginTop: 25,
    marginLeft: 15,
    flexWrap: Platform.OS === "web" ? "nowrap" : "wrap",
  },
  inputContainer: {
    width: Platform.OS === "web" ? (width > 1024 ? "30%" : "45%") : "100%",
    marginBottom: 0,
  },
  label: {
    fontSize: 16,
    color: "#191919",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 20,
  },
  registerButton: {
    backgroundColor: "#E82E5F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  cancelButton: {
    backgroundColor: "#424242",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "400",
  },
  loginText: {
    marginTop: 20,
    fontSize: 16,
    color: "#E82E5F",
  },
  loginLink: {
    fontWeight: "bold",
  },
  hoverEffect: {
    borderColor: "#E82E5F",
    borderWidth: 2,
    borderRadius: 10,
  },
});

export default Register_screen;
