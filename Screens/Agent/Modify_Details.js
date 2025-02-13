import React, { useState, useRef, useEffect } from "react";
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
  ActivityIndicator,
  FlatList,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../data/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const Modify_Deatils = ({ closeModal }) => {
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
  const [Details, setDetails] = useState({});

  const mobileRef = useRef(null);
  const emailRef = useRef(null);
  const districtRef = useRef(null);

  const navigation = useNavigation();

  const districts = [
    // { name: "Select District", code: "" },
    { name: "Araku", code: "01" },
    { name: "Srikakulam", code: "02" },
    { name: "Vizianagaram", code: "03" },
    { name: "Visakhapatnam", code: "04" },
    { name: "Anakapalli", code: "05" },
    { name: "Kakinada", code: "06" },
    { name: "Amalapuram", code: "07" },
    { name: "Rajahmundry", code: "08" },
    { name: "Narasapuram", code: "09" },
    { name: "Eluru", code: "10" },
    { name: "Machilipatnam", code: "11" },
    { name: "Vijayawada", code: "12" },
    { name: "Guntur", code: "13" },
    { name: "Narasaraopet", code: "14" },
    { name: "Bapatla", code: "15" },
    { name: "Ongole", code: "16" },
    { name: "Nandyal", code: "17" },
    { name: "Kurnool", code: "18" },
    { name: "Anantapur", vacode: "19" },
    { name: "Hindupur", vcode: "20" },
    { name: "Kadapa", code: "21" },
    { name: "Nellore", code: "22" },
    { name: "Tirupati", code: "23" },
    { name: "Rajampet", code: "24" },
    { name: "Chittoor", code: "25" },
  ];

  const constituencies = [
    { name: "ICHCHAPURAM", code: "001" },
    { name: "PALASA", code: "002" },
    { name: "TEKKALI", code: "003" },
    { name: "PATHAPATNAM", code: "004" },
    { name: "SRIKAKULAM", code: "005" },
    { name: "AMADALAVALASA", code: "006" },
    { name: "ETCHERLA", code: "007" },
    { name: "NARASANNAPETA", code: "008" },
    { name: "RAJAM", code: "009" },
    { name: "PALAKONDA", code: "010" },
    { name: "KURUPAM", code: "011" },
    { name: "PARVATHIPURAM", code: "012" },
    { name: "SALUR", code: "013" },
    { name: "BOBBILI", code: "014" },
    { name: "CHEEPURUPALLI", code: "015" },
    { name: "GAJAPATHINAGARAM", code: "016" },
    { name: "NELLIMARLA", code: "017" },
    { name: "VIZIANAGARAM", code: "018" },
    { name: "SRUNGAVARAPUKOTA", code: "019" },
    { name: "BHIMILI", code: "020" },
    { name: "VISAKHAPATNAM EAST", code: "021" },
    { name: "VISAKHAPATNAM SOUTH", code: "022" },
    { name: "VISAKHAPATNAM NORTH", code: "023" },
    { name: "VISAKHAPATNAM WEST", code: "024" },
    { name: "GAJUWAKA", code: "025" },
    { name: "CHODAVARAM", code: "026" },
    { name: "MADUGULA", code: "027" },
    { name: "ARAKU VALLEY", code: "028" },
    { name: "PADERU", code: "029" },
    { name: "ANAKAPALLE", code: "030" },
    { name: "PENDURTHI", code: "031" },
    { name: "YELAMANCHILI", code: "032" },
    { name: "PAYAKARAOPET", code: "033" },
    { name: "NARSIPATNAM", code: "034" },
    { name: "TUNI", code: "035" },
    { name: "PRATHIPADU(Visakhapatnam)", code: "036" },
    { name: "PITHAPURAM", code: "037" },
    { name: "KAKINADA RURAL", code: "038" },
    { name: "PEDDAPURAM", code: "039" },
    { name: "ANAPARTHY", code: "040" },
    { name: "KAKINADA CITY", code: "041" },
    { name: "RAMACHANDRAPURAM", code: "042" },
    { name: "MUMMIDIVARAM", code: "043" },
    { name: "AMALAPURAM", code: "044" },
    { name: "RAZOLE", code: "045" },
    { name: "GANNAVARAM", code: "046" },
    { name: "KOTHAPETA", code: "047" },
    { name: "MANDAPETA", code: "048" },
    { name: "RAJANAGARAM", code: "049" },
    { name: "RAJAHMUNDRY CITY", code: "050" },
    { name: "RAJAHMUNDRY RURAL", code: "051" },
    { name: "JAGGAMPETA", code: "052" },
    { name: "RAMPACHODAVARAM", code: "053" },
    { name: "KOVVUR", code: "054" },
    { name: "NIDADAVOLE", code: "055" },
    { name: "ACHANTA", code: "056" },
    { name: "PALACOLE", code: "057" },
    { name: "NARASAPURAM", code: "058" },
    { name: "BHIMAVARAM", code: "059" },
    { name: "UNDI", code: "060" },
    { name: "TANUKU", code: "061" },
    { name: "TADEPALLIGUDEM", code: "062" },
    { name: "UNGUTURU", code: "063" },
    { name: "DENDULURU", code: "064" },
    { name: "ELURU", code: "065" },
    { name: "GOPALAPURAM", code: "066" },
    { name: "POLAVARAM", code: "067" },
    { name: "CHINTALAPUDI", code: "068" },
    { name: "TIRUVURU", code: "069" },
    { name: "NUZVID", code: "070" },
    { name: "GANNAVARAM", code: "071" },
    { name: "GUDIVADA", code: "072" },
    { name: "KAIKALUR", code: "073" },
    { name: "PEDANA", code: "074" },
    { name: "MACHILIPATNAM", code: "075" },
    { name: "AVANIGADDA", code: "076" },
    { name: "PAMARRU", code: "077" },
    { name: "PENAMALURU", code: "078" },
    { name: "VIJAYAWADA WEST", code: "079" },
    { name: "VIJAYAWADA CENTRAL", code: "080" },
    { name: "VIJAYAWADA EAST", code: "081" },
    { name: "MYLAVARAM", code: "082" },
    { name: "NANDIGAMA", code: "083" },
    { name: "JAGGAYYAPETA", code: "084" },
    { name: "PEDAKURAPADU", code: "085" },
    { name: "TADIKONDA", code: "086" },
    { name: "MANGALAGIRI", code: "087" },
    { name: "PONNURU", code: "088" },
    { name: "VEMURU", code: "089" },
    { name: "REPALLE", code: "090" },
    { name: "TENALI", code: "091" },
    { name: "BAPATLA", code: "092" },
    { name: "PRATHIPADU", code: "093" },
    { name: "GUNTUR WEST", code: "094" },
    { name: "GUNTUR EAST", code: "095" },
    { name: "CHILAKALURIPET", code: "096" },
    { name: "NARASARAOPET", code: "097" },
    { name: "SATTENAPALLE", code: "098" },
    { name: "VINUKONDA", code: "099" },
    { name: "GURAJALA", code: "100" },
    { name: "MACHERLA", code: "101" },
    { name: "YERRAGONDAPALEM", code: "102" },
    { name: "DARSI", code: "103" },
    { name: "PARCHUR", code: "104" },
    { name: "ADDANKI", code: "105" },
    { name: "CHIRALA", code: "106" },
    { name: "SANTHANUTHALAPADU", code: "107" },
    { name: "ONGOLE", code: "108" },
    { name: "KANDUKUR", code: "109" },
    { name: "KONDAPI", code: "110" },
    { name: "MARKAPURAM", code: "111" },
    { name: "GIDDALUR", code: "112" },
    { name: "KANIGIRI", code: "113" },
    { name: "KAVALI", code: "114" },
    { name: "ATMAKUR", code: "115" },
    { name: "KOVUR", code: "116" },
    { name: "NELLORE CITY", code: "117" },
    { name: "NELLORE RURAL", code: "118" },
    { name: "SARVEPALLI", code: "119" },
    { name: "GUDUR", code: "120" },
    { name: "SULLURPETA", code: "121" },
    { name: "VENKATAGIRI", code: "122" },
    { name: "UDAYAGIRI", code: "123" },
    { name: "BADVEL", code: "124" },
    { name: "RAJAMPET", code: "125" },
    { name: "KADAPA", code: "126" },
    { name: "KODUR", code: "127" },
    { name: "RAYACHOTI", code: "128" },
    { name: "PULIVENDLA", code: "129" },
    { name: "KAMALAPURAM", code: "130" },
    { name: "JAMMALAMADUGU", code: "131" },
    { name: "PRODDATUR", code: "132" },
    { name: "MYDUKUR", code: "133" },
    { name: "ALLAGADDA", code: "134" },
    { name: "SRISAILAM", code: "135" },
    { name: "NANDIKOTKUR", code: "136" },
    { name: "KURNOOL", code: "137" },
    { name: "PANYAM", code: "138" },
    { name: "NANDYAL", code: "139" },
    { name: "BANAGANAPALLE", code: "140" },
    { name: "DHONE", code: "141" },
    { name: "PATTIKONDA", code: "142" },
    { name: "KODUMUR", code: "143" },
    { name: "YEMMIGANUR", code: "144" },
    { name: "MANTRALAYAM", code: "145" },
    { name: "ADONI", code: "146" },
    { name: "ALUR", code: "147" },
    { name: "RAYADURG", code: "148" },
    { name: "URAVAKONDA", code: "149" },
    { name: "GUNTAKAL", code: "150" },
    { name: "TADPATRI", code: "151" },
    { name: "SINGANAMALA", code: "152" },
    { name: "ANANTAPUR URBAN", code: "153" },
    { name: "KALYANDURG", code: "154" },
    { name: "RAPTADU", code: "155" },
    { name: "MADAKASIRA", code: "156" },
    { name: "HINDUPUR", code: "157" },
    { name: "PENUKONDA", code: "158" },
    { name: "PUTTAPARTHI", code: "159" },
    { name: "DHARMAVARAM", code: "160" },
    { name: "KADIRI", code: "161" },
    { name: "THAMBALLAPALLE", code: "162" },
    { name: "PILERU", code: "163" },
    { name: "MADANAPALLE", code: "164" },
    { name: "PUNGANUR", code: "165" },
    { name: "CHANDRAGIRI", code: "166" },
    { name: "TIRUPATI", code: "167" },
    { name: "SRIKALAHASTI", code: "168" },
    { name: "SATYAVEDU", code: "169" },
    { name: "NAGARI", code: "170" },
    { name: "GANGADHARA NELLORE", code: "171" },
    { name: "CHITTOOR", code: "172" },
    { name: "PUTHALAPATTU", code: "173" },
    { name: "PALAMANER", code: "174" },
    { name: "KUPPAM", code: "175" },
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

  const getDetails = async () => {
    try {
      // Await the token retrieval from AsyncStorage
      const token = await AsyncStorage.getItem("authToken");

      // Make the fetch request
      const response = await fetch(`${API_URL}/agent/AgentDetails`, {
        method: "GET",
        headers: {
          token: `${token}` || "", // Fallback to an empty string if token is null
        },
      });

      // Parse the response
      const newDetails = await response.json();

      // Update state with the details
      setDetails(newDetails);
      console.log(Details);

      if (newDetails.Expertise) {
        setExpertise(newDetails.Expertise);
        setExpertiseSearch(newDetails.Expertise);
      }
      if (newDetails.Experience) {
        setExperience(newDetails.Experience);
        setExperienceSearch(newDetails.Experience);
      }
    } catch (error) {
      console.error("Error fetching agent details:", error);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);
  useEffect(() => {
    if (Details.MyRefferalCode) {
      setReferralCode(Details.MyRefferalCode); // Pre-fill the referralCode state
    }
  }, [Details]);

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
      ReferredBy: referralCode || "WA0000000001", // Use referralCode if provided, else default
      Password: "Wealth",
      MyRefferalCode: referenceId,
    };

    try {
      const response = await fetch(`${API_URL}/agent/AgentRegister`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.register_main}>
            <Text style={styles.register_text}>Edit Details</Text>
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
                    value={Details.FullName ? Details.FullName : "Your Nmae"}
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
                    value={
                      Details.MobileNumber ? Details.MobileNumber : "yournumber"
                    }
                    keyboardType="number-pad"
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
                    value={Details.Email ? Details.Email : "Your Email"}
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
                <Text style={styles.label}>Select Experience</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Select Experience"
                    placeholderTextColor="rgba(25, 25, 25, 0.5)"
                    value={
                      //   Details.Experience
                      //     ? Details.Experience
                      //     : "Your Experience"
                      experienceSearch
                    }
                    onChangeText={(text) => {
                      setExperienceSearch(text);
                      setShowExperienceList(true);
                    }}
                    onFocus={() => {
                      setShowExperienceList(true);
                      setShowDistrictList(false);
                      setShowConstituencyList(false);
                    }}
                  />
                  {showExperienceList && (
                    <View style={styles.dropdownContainer}>
                      {filteredExperience.map((item) => (
                        <TouchableOpacity
                          key={item.code}
                          style={styles.listItem}
                          onPress={() => {
                            setExperience(item.name);
                            setExperienceSearch(item.name);
                            setShowExperienceList(false);
                          }}
                        >
                          <Text>{item.name}</Text>
                        </TouchableOpacity>
                      ))}
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
                    onFocus={() => {
                      setShowExpertiseList(true);
                      setShowDistrictList(false);
                      setShowConstituencyList(false);
                      setShowExperienceList(false);
                    }}
                  />
                  {showExpertiseList && (
                    <View style={styles.dropdownContainer}>
                      {filteredExpertise.map((item) => (
                        <TouchableOpacity
                          key={item.code}
                          style={styles.listItem}
                          onPress={() => {
                            setExpertise(item.name);
                            setExpertiseSearch(item.name);
                            setShowExpertiseList(false);
                          }}
                        >
                          <Text>{item.name}</Text>
                        </TouchableOpacity>
                      ))}
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
                    value={
                      Details.Locations ? Details.Locations : "Your Location"
                    }
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
            </View>
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Submit</Text>
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
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
  },
  register_main: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E82E5F",
    width: Platform.OS === "web" ? "100%" : 260,
    height: 40,
    borderRadius: 20,
  },
  register_text: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    fontSize: 20,
    color: "#fff",
  },
  card: {
    display: "flex",
    justifyContent: "center",
    width: Platform.OS === "web" ? (width > 1024 ? "100%" : "100%") : "90%",
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
  webInputWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    marginTop: 25,
  },
  scrollView: {
    maxHeight: 200,
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
    width: "100%",
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

export default Modify_Deatils;
