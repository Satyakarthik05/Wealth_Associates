import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
// import { API_URL } from "../../data/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 600;

const RegisterExecute = ({ closeModal }) => {
  const [fullname, setFullname] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("");
  const [constituency, setConstituency] = useState("");
  const [occupation, setOccupation] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [districtSearch, setDistrictSearch] = useState("");
  const [constituencySearch, setConstituencySearch] = useState("");
  const [occupationSearch, setOccupationSearch] = useState("");
  const [showDistrictList, setShowDistrictList] = useState(false);
  const [showConstituencyList, setShowConstituencyList] = useState(false);
  const [showOccupationList, setShowOccupationList] = useState(false);
  const [Details, setDetails] = useState({});

  const districts = [
    { name: "Select District", code: "" },
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

  const occupationOptions = [
    { name: "Govt. Employee", code: "01" },
    { name: "Central Govt. Employee", code: "02" },
    { name: "Private Employee", code: "03" },
    { name: "Software Employee", code: "04" },
    { name: "Self Employed", code: "05" },
    { name: "Business", code: "06" },
    { name: "Others", code: "07" },
  ];

  const filteredDistricts = districts.filter((item) =>
    item.name.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const filteredConstituencies = constituencies.filter((item) =>
    item.name.toLowerCase().includes(constituencySearch.toLowerCase())
  );

  const filteredOccupations = occupationOptions.filter((item) =>
    item.name.toLowerCase().includes(occupationSearch.toLowerCase())
  );

  const getDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/agent/AgentDetails`, {
        method: "GET",
        headers: {
          token: `${token}` || "",
        },
      });
      const newDetails = await response.json();
      setDetails(newDetails);
    } catch (error) {
      console.error("Error fetching agent details:", error);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  useEffect(() => {
    if (Details.MyRefferalCode) {
      setReferralCode(Details.MyRefferalCode);
    }
  }, [Details]);

  const closeAllDropdowns = () => {
    setShowDistrictList(false);
    setShowConstituencyList(false);
    setShowOccupationList(false);
  };

  const handleRegister = async () => {
    console.log("Full Name:", fullname);
    console.log("Mobile:", mobile);
    console.log("Email:", email);
    console.log("District:", district);
    console.log("Constituency:", constituency);
    console.log("Location:", location);
    console.log("Occupation:", occupation);

    if (
      !fullname.trim() ||
      !mobile.trim() ||
      !district.trim() ||
      !constituency.trim() ||
      !location.trim() ||
      !occupation.trim()
    ) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    const selectedDistrict = districts.find((d) => d.name === district);
    const selectedConstituency = constituencies.find(
      (c) => c.name === constituency
    );

    if (!selectedDistrict || !selectedConstituency) {
      Alert.alert("Error", "Invalid district or constituency selected.");
      setIsLoading(false);
      return;
    }

    const referenceId = `${selectedDistrict.code}${selectedConstituency.code}`;

    const userData = {
      FullName: fullname,
      MobileNumber: mobile,
      District: district,
      Contituency: constituency,
      Locations: location,
      Occupation: occupation,
      ReferredBy: referralCode || "WA0000000001",
      Password: "Wealth",
      MyRefferalCode: referenceId,
    };

    try {
      const response = await fetch(`${API_URL}/customer/CustomerRegister`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert("Success", "Registration successful!");
        closeModal();
      } else if (response.status === 400) {
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View
        style={[styles.container, isSmallScreen && styles.smallScreenContainer]}
      >
        <Text style={styles.title}>  Register Customer  </Text>

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex. John Doe"
              value={fullname}
              onChangeText={setFullname}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex. 9063 392872"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select District</Text>
            <TextInput
              style={styles.input}
              placeholder="Search District"
              value={districtSearch}
              onChangeText={(text) => {
                setDistrictSearch(text);
                closeAllDropdowns();
                setShowDistrictList(true);
              }}
              onFocus={() => {
                closeAllDropdowns();
                setShowDistrictList(true);
              }}
            />
            {showDistrictList && (
              <View style={styles.dropdownContainer}>
                <ScrollView style={styles.scrollView}>
                  {filteredDistricts.map((item) => (
                    <TouchableOpacity
                      key={item.name}
                      style={styles.listItem}
                      onPress={() => {
                        setDistrict(item.name);
                        setDistrictSearch(item.name);
                        closeAllDropdowns();
                      }}
                    >
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Constituency</Text>
            <TextInput
              style={styles.input}
              placeholder="Search Constituency"
              value={constituencySearch}
              onChangeText={(text) => {
                setConstituencySearch(text);
                closeAllDropdowns();
                setShowConstituencyList(true);
              }}
              onFocus={() => {
                closeAllDropdowns();
                setShowConstituencyList(true);
              }}
            />
            {showConstituencyList && (
              <View style={styles.dropdownContainer}>
                <ScrollView style={styles.scrollView}>
                  {filteredConstituencies.map((item) => (
                    <TouchableOpacity
                      key={item.code}
                      style={styles.listItem}
                      onPress={() => {
                        setConstituency(item.name);
                        setConstituencySearch(item.name);
                        closeAllDropdowns();
                      }}
                    >
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Occupation</Text>
            <TextInput
              style={styles.input}
              placeholder="Select Occupation"
              value={occupationSearch}
              onChangeText={(text) => {
                setOccupationSearch(text);
                closeAllDropdowns();
                setShowOccupationList(true);
              }}
              onFocus={() => {
                closeAllDropdowns();
                setShowOccupationList(true);
              }}
            />
            {showOccupationList && (
              <View style={styles.dropdownContainer}>
                <ScrollView style={styles.scrollView}>
                  {filteredOccupations.map((item) => (
                    <TouchableOpacity
                      key={item.code}
                      style={styles.listItem}
                      onPress={() => {
                        setOccupation(item.name);
                        setOccupationSearch(item.name);
                        closeAllDropdowns();
                      }}
                    >
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex. Vijayawada"
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Referral Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Referral Code"
              placeholderTextColor="rgba(25, 25, 25, 0.5)"
              onChangeText={setReferralCode}
              value={referralCode}
            />
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              console.log("Cancel button clicked");
              closeModal && closeModal();
            }}
            disabled={isLoading}
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
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 30,
    elevation: 5,
    width: Platform.OS === "android" ? "90%" : "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#ccc",
    height: "100%",
  },
  smallScreenContainer: {
    width: 300,
    padding: 10,
  },
  title: {
    fontSize: 19,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#e91e63",
    textAlign: "center",
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  row: {
    flexDirection: Platform.OS === "android" ? "column" : "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  inputContainer: {
    width: Platform.OS === "android" ? "100%" : "48%",
    marginBottom: 10,
  },
  fullWidth: {
    width: "100%",
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Platform.OS === "android" ? "auto" : 20,
  },
  registerButton: {
    backgroundColor: "#e91e63",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
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
  scrollView: {
    maxHeight: 200,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default RegisterExecute;
