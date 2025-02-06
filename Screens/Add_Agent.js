import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const Add_Agent = ({ closeModal }) => {
  const [fullname, setFullname] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("");
  const [constituency, setConstituency] = useState("");
  const [expertise, setExpertise] = useState("");
  const [experience, setExperience] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);
  const [districtSearch, setDistrictSearch] = useState("");
  const [constituencySearch, setConstituencySearch] = useState("");
  const [expertiseSearch, setExpertiseSearch] = useState("");
  const [experienceSearch, setExperienceSearch] = useState("");
  const [showDistrictList, setShowDistrictList] = useState(false);
  const [showConstituencyList, setShowConstituencyList] = useState(false);
  const [showExpertiseList, setShowExpertiseList] = useState(false);
  const [showExperienceList, setShowExperienceList] = useState(false);
  const mobileRef = useRef(null);
  const emailRef = useRef(null);
  const districtRef = useRef(null);

  const districts = [
    { name: "Araku", code: "01" },
    { name: "Srikakulam", code: "02" },
    { name: "Vizianagaram", code: "03" },
    { name: "Visakhapatnam", code: "04" },
  ];

  const constituencies = [
    { name: "ICHCHAPURAM", code: "01" },
    { name: "PALASA", code: "02" },
    { name: "TEKKALI", code: "03" },
    { name: "PATHAPATNAM", code: "04" },
    { name: "SRIKAKULAM", code: "05" },
    { name: "AMADALAVALASA", code: "06" },
    { name: "ETCHERLA", code: "07" },
    { name: "NARASANNAPETA", code: "08" },
  ];

  const expertiseOptions = [
    { name: "Residential", code: "01" },
    { name: "Commercial", code: "02" },
    { name: "Industrial", code: "03" },
    { name: "Agricultural", code: "04" },
  ];

  const experienceOptions = [
    { name: "0-1 years", code: "01" },
    { name: "1-3 years", code: "02" },
    { name: "3-5 years", code: "03" },
    { name: "5+ years", code: "04" },
  ];

  const filteredDistricts = districts.filter((item) =>
    item.name.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const filteredConstituencies = constituencies.filter((item) =>
    item.name.toLowerCase().includes(constituencySearch.toLowerCase())
  );

  const filteredExpertise = expertiseOptions.filter((item) =>
    item.name.toLowerCase().includes(expertiseSearch.toLowerCase())
  );

  const filteredExperience = experienceOptions.filter((item) =>
    item.name.toLowerCase().includes(experienceSearch.toLowerCase())
  );

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

    setIsLoading(true);

    const selectedDistrict = districts.find((d) => d.name === district);
    const selectedConstituency = constituencies.find(
      (c) => c.name === constituency
    );

    const referenceId = `${selectedDistrict.code}${selectedConstituency.code}`;

    const userData = {
      FullName: fullname,
      MobileNumber: mobile,
      Email: email,
      District: district,
      Contituency: constituency,
      Locations: location,
      Expertise: expertise,
      Experience: experience,
      ReferralCode: referralCode,
      Password: "Wealth",
      RefferedBy: referenceId,
    };

    try {
      const response = await fetch(
        "http://192.168.225.105:3000/agent/AgentRegister",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      setResponseStatus(response.status);

      if (response.ok) {
        const result = await response.json();
        Alert.alert("Success", "Registration successful!");
      } else if (response.status === 400) {
        const errorData = await response.json();
        Alert.alert("Error", "Mobile number already exists.");
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
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.card}>
      <View style={styles.register_main}>
        <Text style={styles.register_text}>Register Wealth Associate</Text>
      </View>

      {responseStatus === 400 && (
        <Text style={styles.errorText}>Mobile number already exists.</Text>
      )}

      <View style={styles.webInputWrapper}>
        {/* Row 1 */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fullname</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor="rgba(25, 25, 25, 0.5)"
                onChangeText={setFullname}
                returnKeyType="next"
                onSubmitEditing={() => mobileRef.current.focus()}
              />
              <FontAwesome
                name="user"
                size={20}
                color="#E82E5F"
                style={styles.icon}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={mobileRef}
                style={styles.input}
                placeholder="Mobile Number"
                placeholderTextColor="rgba(25, 25, 25, 0.5)"
                onChangeText={setMobile}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current.focus()}
                onFocus={() => {
                  setShowDistrictList(false);
                  setShowConstituencyList(false);
                  setShowExpertiseList(false);
                  setShowExperienceList(false);
                }}
              />
              <MaterialIcons
                name="phone"
                size={20}
                color="#E82E5F"
                style={styles.icon}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={emailRef}
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(25, 25, 25, 0.5)"
                onChangeText={setEmail}
                returnKeyType="next"
                onSubmitEditing={() => districtRef.current.focus()}
                onFocus={() => {
                  setShowDistrictList(false);
                  setShowConstituencyList(false);
                  setShowExpertiseList(false);
                  setShowExperienceList(false);
                }}
              />
              <MaterialIcons
                name="email"
                size={20}
                color="#E82E5F"
                style={styles.icon}
              />
            </View>
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select District</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={districtRef}
                style={styles.input}
                placeholder="Search District"
                placeholderTextColor="rgba(25, 25, 25, 0.5)"
                value={districtSearch}
                onChangeText={(text) => {
                  setDistrictSearch(text);
                  setShowDistrictList(true);
                }}
                onFocus={() => setShowDistrictList(true)}
              />
              {showDistrictList && (
                <View style={styles.dropdownContainer}>
                  <FlatList
                    data={filteredDistricts}
                    keyExtractor={(item) => item.code}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => {
                          setDistrict(item.name);
                          setDistrictSearch(item.name);
                          setShowDistrictList(false);
                        }}
                      >
                        <Text>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                    style={styles.list}
                  />
                </View>
              )}
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Constituency</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Search Constituency"
                placeholderTextColor="rgba(25, 25, 25, 0.5)"
                value={constituencySearch}
                onChangeText={(text) => {
                  setConstituencySearch(text);
                  setShowConstituencyList(true);
                }}
                onFocus={() => {
                  setShowConstituencyList(true);
                  setShowDistrictList(false);
                }}
              />
              {showConstituencyList && (
                <View style={styles.dropdownContainer}>
                  <FlatList
                    data={filteredConstituencies}
                    keyExtractor={(item) => item.code}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => {
                          setConstituency(item.name);
                          setConstituencySearch(item.name);
                          setShowConstituencyList(false);
                        }}
                      >
                        <Text>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                    style={styles.list}
                  />
                </View>
              )}
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Experience</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Select Experience"
                placeholderTextColor="rgba(25, 25, 25, 0.5)"
                value={experienceSearch}
                onChangeText={(text) => {
                  setExperienceSearch(text);
                  setShowExperienceList(true);
                }}
                onFocus={() => setShowExperienceList(true)}
              />
              {showExperienceList && (
                <View style={styles.dropdownContainer}>
                  <FlatList
                    data={filteredExperience}
                    keyExtractor={(item) => item.code}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => {
                          setExperience(item.name);
                          setExperienceSearch(item.name);
                          setShowExperienceList(false);
                        }}
                        onFocus={() => {
                          setShowDistrictList(false);
                          setShowConstituencyList(false);
                        }}
                      >
                        <Text>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                    style={styles.list}
                  />
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Row 3 */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Expertise</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Select Expertise"
                placeholderTextColor="rgba(25, 25, 25, 0.5)"
                value={expertiseSearch}
                onChangeText={(text) => {
                  setExpertiseSearch(text);
                  setShowExpertiseList(true);
                }}
                onFocus={() => setShowExpertiseList(true)}
              />
              {showExpertiseList && (
                <View style={styles.dropdownContainer}>
                  <FlatList
                    data={filteredExpertise}
                    keyExtractor={(item) => item.code}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => {
                          setExpertise(item.name);
                          setExpertiseSearch(item.name);
                          setShowExpertiseList(false);
                        }}
                      >
                        <Text>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                    style={styles.list}
                  />
                </View>
              )}
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Location"
                placeholderTextColor="rgba(25, 25, 25, 0.5)"
                onChangeText={setLocation}
                onFocus={() => {
                  setShowDistrictList(false);
                  setShowConstituencyList(false);
                  setShowExpertiseList(false);
                  setShowExperienceList(false);
                }}
              />
              <MaterialIcons
                name="location-on"
                size={20}
                color="#E82E5F"
                style={styles.icon}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Referral Code</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Referral Code"
                placeholderTextColor="rgba(25, 25, 25, 0.5)"
                onChangeText={setReferralCode}
                onFocus={() => {
                  setShowDistrictList(false);
                  setShowConstituencyList(false);
                  setShowExpertiseList(false);
                  setShowExperienceList(false);
                }}
              />
              <MaterialIcons
                name="card-giftcard"
                size={20}
                color="#E82E5F"
                style={styles.icon}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          disabled={isLoading}
          onPress={closeModal}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#E82E5F"
          style={styles.loadingIndicator}
        />
      )}

      {/* <TouchableOpacity style={styles.loginText}>
        <Text>
          Already have an account?{" "}
          <Text style={styles.loginLink}>Login here</Text>
        </Text>
      </TouchableOpacity> */}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.scrollContainer}
      />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    display: "flex",
    justifyContent: "center",
    width: Platform.OS === "web" ? (width > 1024 ? "100%" : "80%") : "80%",
    backgroundColor: "#FFFFFF",
    padding: Platform.OS === "web" ? 20 : 5,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    alignItems: "center",
    borderWidth: Platform.OS === "web" ? 0 : 1,
    borderColor: Platform.OS === "web" ? "transparent" : "#ccc",
    marginTop: Platform.OS === "web" ? "10%" : "0",
  },
  register_main: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E82E5F",
    width: Platform.OS === "web" ? "100%" : 300,
    height: 40,
    borderRadius: 20,
  },
  register_text: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    fontSize: 20,
    color: "#ccc",
  },
  webInputWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    marginTop: 25,
  },
  inputRow: {
    flexDirection: Platform.OS === "android" ? "column" : "row",
    justifyContent: "space-between",
    gap: 5,
  },
  inputContainer: {
    width: Platform.OS === "android" ? "100%" : "30%",
    position: "relative",
    zIndex: 1,
  },
  inputWrapper: {
    position: "relative",
    zIndex: 1,
  },
  input: {
    width: Platform.OS === "android" ? 250 : "200px",
    height: 47,
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 13,
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
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  dropdownContainer: {
    position: "absolute",
    bottom: "100%",
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: "#FFF",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
  },
  list: {
    maxHeight: 150,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default Add_Agent;
