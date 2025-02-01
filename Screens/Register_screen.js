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
  const [expertise, setExpertise] = useState(null);
  const [experience, setExperience] = useState(null);
  const [referralCode, setReferralCode] = useState("");
  const [location, setLocation] = useState("");
  const [hoverConstituency, setHoverConstituency] = useState(false);

  const expertiseOptions = [
    { label: "Finance", value: "1" },
    { label: "Investment", value: "2" },
    { label: "Banking", value: "3" },
    { label: "Insurance", value: "4" },
  ];

  const experienceLevels = [
    { label: "Fresher", value: "1" },
    { label: "1-3 years", value: "2" },
    { label: "3-5 years", value: "3" },
    { label: "5+ years", value: "4" },
  ];

  const districts = [
    { label: "Select District", value: "" }, // Placeholder for selection
    { label: "Srikakulam", value: "Srikakulam" },
    { label: "Parvathipuram_Manyam", value: "Parvathipuram Manyam" },
    { label: "Vizianagaram", value: "Vizianagaram" },
    { label: "Visakhapatnam", value: "Visakhapatnam" },
    { label: "Alluri_Sitharama_Raju", value: "Alluri Sitharama Raju" },
    { label: "Anakapalli", value: "Anakapalli" },
    { label: "Kakinada", value: "Kakinada" },
    { label: "Konaseema", value: "Konaseema" },
    { label: "East_Godavari", value: "East Godavari" },
    { label: "West_Godavari", value: "West Godavari" },
    { label: "Eluru", value: "Eluru" },
    { label: "NTR", value: "NTR" },
    { label: "Krishna", value: "Krishna" },
    { label: "Palnadu", value: "Palnadu" },
    { label: "Guntur", value: "Guntur" },
    { label: "Bapatla", value: "Bapatla" },
    { label: "Prakasam", value: "Prakasam" },
    { label: "Nellore", value: "Nellore" },
    { label: "Tirupati", value: "Tirupati" },
    { label: "Annamayya", value: "Annamayya" },
    { label: "Kadapa", value: "Kadapa" },
    { label: "Nandyal", value: "Nandyal" },
    { label: "Kurnool", value: "Kurnool" },
    { label: "Anantapur", value: "Anantapur" },
    { label: "Sri_Sathya_Sai", value: "Sri Sathya Sai" },
    { label: "Chittoor", value: "Chittoor" },
  ];

  const constituenciesByDistrict = {
    Srikakulam: [
      { label: "Ichchapuram", value: "Ichchapuram" },
      { label: "Palasa", value: "Palasa" },
      { label: "Tekkali", value: "Tekkali" },
      { label: "Pathapatnam", value: "Pathapatnam" },
      { label: "Srikakulam", value: "Srikakulam" },
      { label: "Amadalavalasa", value: "Amadalavalasa" },
      { label: "Etcherla", value: "Etcherla" },
      { label: "Narasannapeta", value: "Narasannapeta" },
    ],
    "Parvathipuram Manyam": [
      { label: "Palakonda", value: "Palakonda" },
      { label: "Kurupam", value: "Kurupam" },
      { label: "Parvathipuram", value: "Parvathipuram" },
      { label: "Salur", value: "Salur" },
    ],
    Vizianagaram: [
      { label: "Rajam", value: "Rajam" },
      { label: "Bobbili", value: "Bobbili" },
      { label: "Cheepurupalli", value: "Cheepurupalli" },
      { label: "Gajapathinagaram", value: "Gajapathinagaram" },
      { label: "Nellimarla", value: "Nellimarla" },
      { label: "Vizianagaram", value: "Vizianagaram" },
      { label: "Srungavarapukota", value: "Srungavarapukota" },
    ],
    Visakhapatnam: [
      { label: "Bhimili", value: "Bhimili" },
      { label: "Visakhapatnam East", value: "Visakhapatnam East" },
      { label: "Visakhapatnam South", value: "Visakhapatnam South" },
      { label: "Visakhapatnam North", value: "Visakhapatnam North" },
      { label: "Visakhapatnam West", value: "Visakhapatnam West" },
      { label: "Gajuwaka", value: "Gajuwaka" },
    ],
    "Alluri Sitharama Raju": [
      { label: "Araku Valley", value: "Araku Valley" },
      { label: "Paderu", value: "Paderu" },
      { label: "Rampachodavaram", value: "Rampachodavaram" },
    ],
    Anakapalli: [
      { label: "Chodavaram", value: "Chodavaram" },
      { label: "Madugula", value: "Madugula" },
      { label: "Anakapalle", value: "Anakapalle" },
      { label: "Pendurthi", value: "Pendurthi" },
      { label: "Elamanchili", value: "Elamanchili" },
      { label: "Payakaraopet", value: "Payakaraopet" },
      { label: "Narsipatnam", value: "Narsipatnam" },
    ],
    Kakinada: [
      { label: "Tuni", value: "Tuni" },
      { label: "Prathipadu", value: "Prathipadu" },
      { label: "Pithapuram", value: "Pithapuram" },
      { label: "Kakinada Rural", value: "Kakinada Rural" },
      { label: "Peddapuram", value: "Peddapuram" },
      { label: "Kakinada City", value: "Kakinada City" },
      { label: "Jaggampeta", value: "Jaggampeta" },
    ],
    Konaseema: [
      { label: "Ramachandrapuram", value: "Ramachandrapuram" },
      { label: "Mummidivaram", value: "Mummidivaram" },
      { label: "Amalapuram", value: "Amalapuram" },
      { label: "Razole", value: "Razole" },
      { label: "Gannavaram", value: "Gannavaram" },
      { label: "Kothapeta", value: "Kothapeta" },
      { label: "Mandapeta", value: "Mandapeta" },
    ],
    "East Godavari": [
      { label: "Rajanagaram", value: "Rajanagaram" },
      { label: "Rajahmundry City", value: "Rajahmundry City" },
      { label: "Rajahmundry Rural", value: "Rajahmundry Rural" },
      { label: "Kovvur", value: "Kovvur" },
      { label: "Nidadavole", value: "Nidadavole" },
      { label: "Achanta", value: "Achanta" },
      { label: "Palakollu", value: "Palakollu" },
      { label: "Narasapuram", value: "Narasapuram" },
      { label: "Bhimavaram", value: "Bhimavaram" },
      { label: "Undi", value: "Undi" },
      { label: "Tanuku", value: "Tanuku" },
      { label: "Tadepalligudem", value: "Tadepalligudem" },
      { label: "Gopalapuram", value: "Gopalapuram" },
    ],
    "West Godavari": [
      { label: "Unguturu", value: "Unguturu" },
      { label: "Denduluru", value: "Denduluru" },
      { label: "Eluru", value: "Eluru" },
      { label: "Polavaram", value: "Polavaram" },
      { label: "Chintalapudi", value: "Chintalapudi" },
      { label: "Tiruvuru", value: "Tiruvuru" },
      { label: "Nuzvid", value: "Nuzvid" },
      { label: "Kaikalur", value: "Kaikalur" },
    ],
    Krishna: [
      { label: "Gannavaram", value: "Gannavaram" },
      { label: "Gudivada", value: "Gudivada" },
      { label: "Pedana", value: "Pedana" },
      { label: "Machilipatnam", value: "Machilipatnam" },
      { label: "Avanigadda", value: "Avanigadda" },
      { label: "Pamarru", value: "Pamarru" },
      { label: "Penamaluru", value: "Penamaluru" },
    ],
    NTR: [
      { label: "Vijayawada West", value: "Vijayawada West" },
      { label: "Vijayawada Central", value: "Vijayawada Central" },
      { label: "Vijayawada East", value: "Vijayawada East" },
      { label: "Mylavaram", value: "Mylavaram" },
      { label: "Nandigama", value: "Nandigama" },
      { label: "Jaggayyapeta", value: "Jaggayyapeta" },
    ],
    Palnadu: [
      { label: "Pedakurapadu", value: "Pedakurapadu" },
      { label: "Tadikonda", value: "Tadikonda" },
      { label: "Mangalagiri", value: "Mangalagiri" },
      { label: "Ponnuru", value: "Ponnuru" },
      { label: "Vemuru", value: "Vemuru" },
      { label: "Repalle", value: "Repalle" },
      { label: "Tenali", value: "Tenali" },
      { label: "Bapatla", value: "Bapatla" },
      { label: "Prathipadu", value: "Prathipadu" },
      { label: "Guntur West", value: "Guntur West" },
      { label: "Guntur East", value: "Guntur East" },
      { label: "Chilakaluripet", value: "Chilakaluripet" },
      { label: "Narasaraopet", value: "Narasaraopet" },
      { label: "Sattenapalle", value: "Sattenapalle" },
      { label: "Vinukonda", value: "Vinukonda" },
      { label: "Gurajala", value: "Gurajala" },
      { label: "Macherla", value: "Macherla" },
    ],
    Guntur: [
      { label: "Yerragondapalem", value: "Yerragondapalem" },
      { label: "Darsi", value: "Darsi" },
      { label: "Parchur", value: "Parchur" },
      { label: "Addanki", value: "Addanki" },
      { label: "Chirala", value: "Chirala" },
      { label: "Santhanuthalapadu", value: "Santhanuthalapadu" },
      { label: "Ongole", value: "Ongole" },
      { label: "Kandukur", value: "Kandukur" },
      { label: "Kondapi", value: "Kondapi" },
      { label: "Markapuram", value: "Markapuram" },
      { label: "Giddalur", value: "Giddalur" },
      { label: "Kanigiri", value: "Kanigiri" },
    ],
    Bapatla: [
      { label: "Kavali", value: "Kavali" },
      { label: "Atmakur", value: "Atmakur" },
      { label: "Kovur", value: "Kovur" },
      { label: "Nellore City", value: "Nellore City" },
      { label: "Nellore Rural", value: "Nellore Rural" },
      { label: "Sarvepalli", value: "Sarvepalli" },
      { label: "Gudur", value: "Gudur" },
      { label: "Sullurpeta", value: "Sullurpeta" },
      { label: "Venkatagiri", value: "Venkatagiri" },
      { label: "Udayagiri", value: "Udayagiri" },
    ],
    Prakasam: [
      { label: "Badvel", value: "Badvel" },
      { label: "Rajampet", value: "Rajampet" },
      { label: "Kadapa", value: "Kadapa" },
      { label: "Kodur", value: "Kodur" },
      { label: "Rayachoti", value: "Rayachoti" },
      { label: "Pulivendla", value: "Pulivendla" },
      { label: "Kamalapuram", value: "Kamalapuram" },
      { label: "Jammalamadugu", value: "Jammalamadugu" },
      { label: "Proddatur", value: "Proddatur" },
      { label: "Mydukur", value: "Mydukur" },
    ],
    Nellore: [
      { label: "Allagadda", value: "Allagadda" },
      { label: "Srisailam", value: "Srisailam" },
      { label: "Nandikotkur", value: "Nandikotkur" },
      { label: "Kurnool", value: "Kurnool" },
      { label: "Panyam", value: "Panyam" },
      { label: "Nandyal", value: "Nandyal" },
      { label: "Banaganapalle", value: "Banaganapalle" },
      { label: "Dhone", value: "Dhone" },
      { label: "Pattikonda", value: "Pattikonda" },
      { label: "Kodumur", value: "Kodumur" },
      { label: "Yemmiganur", value: "Yemmiganur" },
      { label: "Mantralayam", value: "Mantralayam" },
      { label: "Adoni", value: "Adoni" },
      { label: "Alur", value: "Alur" },
    ],
    Tirupati: [
      { label: "Rayadurg", value: "Rayadurg" },
      { label: "Uravakonda", value: "Uravakonda" },
      { label: "Guntakal", value: "Guntakal" },
      { label: "Tadipatri", value: "Tadipatri" },
      { label: "Singanamala", value: "Singanamala" },
      { label: "Anantapur Urban", value: "Anantapur Urban" },
      { label: "Kalyandurg", value: "Kalyandurg" },
      { label: "Raptadu", value: "Raptadu" },
      { label: "Madakasira", value: "Madakasira" },
      { label: "Hindupur", value: "Hindupur" },
      { label: "Penukonda", value: "Penukonda" },
      { label: "Puttaparthi", value: "Puttaparthi" },
      { label: "Dharmavaram", value: "Dharmavaram" },
      { label: "Kadiri", value: "Kadiri" },
    ],
    Annamayya: [
      { label: "Thamballapalle", value: "Thamballapalle" },
      { label: "Pileru", value: "Pileru" },
      { label: "Madanapalle", value: "Madanapalle" },
      { label: "Punganur", value: "Punganur" },
      { label: "Chandragiri", value: "Chandragiri" },
      { label: "Tirupati", value: "Tirupati" },
      { label: "Srikalahasti", value: "Srikalahasti" },
      { label: "Sathyavedu", value: "Sathyavedu" },
      { label: "Nagari", value: "Nagari" },
      { label: "Gangadhara Nellore", value: "Gangadhara Nellore" },
      { label: "Chittoor", value: "Chittoor" },
      { label: "Puthalapattu", value: "Puthalapattu" },
      { label: "Palamaner", value: "Palamaner" },
      { label: "Kuppam", value: "Kuppam" },
    ],
    Nandyal: [
      { label: "Nandyal", value: "Nandyal" },
      { label: "Allagadda", value: "Allagadda" },
      { label: "Srisailam", value: "Srisailam" },
      { label: "Nandikotkur", value: "Nandikotkur" },
      { label: "Panyam", value: "Panyam" },
      { label: "Banaganapalle", value: "Banaganapalle" },
      { label: "Dhone", value: "Dhone" },
    ],
    Kadapa: [
      { label: "Badvel", value: "Badvel" },
      { label: "Kadapa", value: "Kadapa" },
      { label: "Kodur", value: "Kodur" },
      { label: "Rayachoti", value: "Rayachoti" },
      { label: "Pulivendla", value: "Pulivendla" },
      { label: "Kamalapuram", value: "Kamalapuram" },
      { label: "Jammalamadugu", value: "Jammalamadugu" },
      { label: "Proddatur", value: "Proddatur" },
      { label: "Mydukur", value: "Mydukur" },
    ],
    Kurnool: [
      { label: "Nandyal", value: "Nandyal" },
      { label: "Allagadda", value: "Allagadda" },
      { label: "Srisailam", value: "Srisailam" },
      { label: "Nandikotkur", value: "Nandikotkur" },
      { label: "Panyam", value: "Panyam" },
      { label: "Banaganapalle", value: "Banaganapalle" },
      { label: "Dhone", value: "Dhone" },
      { label: "Kurnool", value: "Kurnool" },
      { label: "Pattikonda", value: "Pattikonda" },
      { label: "Kodumur", value: "Kodumur" },
      { label: "Yemmiganur", value: "Yemmiganur" },
      { label: "Mantralayam", value: "Mantralayam" },
      { label: "Adoni", value: "Adoni" },
      { label: "Alur", value: "Alur" },
    ],
    Anantapur: [
      { label: "Rayadurg", value: "Rayadurg" },
      { label: "Uravakonda", value: "Uravakonda" },
      { label: "Guntakal", value: "Guntakal" },
      { label: "Tadipatri", value: "Tadipatri" },
      { label: "Singanamala", value: "Singanamala" },
      { label: "Anantapur Urban", value: "Anantapur Urban" },
      { label: "Kalyandurg", value: "Kalyandurg" },
      { label: "Raptadu", value: "Raptadu" },
      { label: "Sri Sathya Sai", value: "Sri Sathya Sai" },
      { label: "Madakasira", value: "Madakasira" },
      { label: "Hindupur", value: "Hindupur" },
      { label: "Penukonda", value: "Penukonda" },
      { label: "Puttaparthi", value: "Puttaparthi" },
      { label: "Dharmavaram", value: "Dharmavaram" },
      { label: "Kadiri", value: "Kadiri" },
    ],
    Chittoor: [
      { label: "Thamballapalle", value: "Thamballapalle" },
      { label: "Pileru", value: "Pileru" },
      { label: "Madanapalle", value: "Madanapalle" },
      { label: "Punganur", value: "Punganur" },
      { label: "Chandragiri", value: "Chandragiri" },
      { label: "Tirupati", value: "Tirupati" },
      { label: "Srikalahasti", value: "Srikalahasti" },
      { label: "Sathyavedu", value: "Sathyavedu" },
      { label: "Nagari", value: "Nagari" },
      { label: "Gangadhara Nellore", value: "Gangadhara Nellore" },
      { label: "Chittoor", value: "Chittoor" },
      { label: "Puthalapattu", value: "Puthalapattu" },
      { label: "Palamaner", value: "Palamaner" },
      { label: "Kuppam", value: "Kuppam" },
    ],
    "Sri Sathya Sai": [
      { label: "Madakasira", value: "Madakasira" },
      { label: "Hindupur", value: "Hindupur" },
      { label: "Penukonda", value: "Penukonda" },
      { label: "Puttaparthi", value: "Puttaparthi" },
      { label: "Dharmavaram", value: "Dharmavaram" },
      { label: "Kadiri", value: "Kadiri" },
      { label: "Thamballapalle", value: "Thamballapalle" },
    ],
  };

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
      Contituency: constituency,
      Locations: location,
      Expertise: expertise,
      Experience: experience,
      ReferralCode: referralCode,
      Password: "Wealth", // Hardcoded as per backend
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

      if (response.ok) {
        const result = await response.json();
        Alert.alert("Success", "Registration successful!");
        navigation.navigate("Login"); // Redirect to the login screen after successful registration
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

  const handleConstituencyPress = () => {
    if (!district) {
      Alert.alert("Please select a district first.");
      setHoverConstituency(true); // Enable hover effect
    } else {
      setHoverConstituency(false); // Disable hover effect
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <Text style={styles.tagline}>Your Trusted Property Consultant</Text>
          <Text style={styles.title}>REGISTER AS AN AGENT</Text>

          <View style={styles.webInputWrapper}>
            <View style={styles.inputContainer}>
              <View style={styles.input_label}>
                <Text style={styles.label}>Fullname</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Full name"
                    placeholderTextColor="rgba(25, 25, 25, 0.5)"
                    onChangeText={setFullname}
                  />
                  <FontAwesome
                    name="user"
                    size={20}
                    color="#E82E5F"
                    style={styles.icon}
                  />
                </View>
              </View>
              <View style={styles.input_label}>
                <Text style={styles.label}>Mobile Number</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    placeholderTextColor="rgba(25, 25, 25, 0.5)"
                    onChangeText={setMobile}
                  />
                  <MaterialIcons
                    name="phone"
                    size={20}
                    color="#E82E5F"
                    style={styles.icon}
                  />
                </View>
              </View>
              <View style={styles.input_label}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="rgba(25, 25, 25, 0.5)"
                    onChangeText={setEmail}
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

            <View style={styles.inputContainer}>
              <View style={styles.input_label}>
                <Text style={styles.label}>Select District</Text>
                <View style={styles.inputWrapper}>
                  <Dropdown
                    data={districts}
                    labelField="label"
                    valueField="value"
                    placeholder="~ Select District ~"
                    placeholderStyle={{ color: "rgba(25, 25, 25, 0.5)" }}
                    value={district}
                    onChange={(item) => {
                      setDistrict(item.value);
                      setConstituency(null); // Reset constituency when district changes
                    }}
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                  />
                </View>
              </View>
              <View style={styles.input_label}>
                <Text style={styles.label}>Select Constituency</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    hoverConstituency && styles.hoverEffect,
                  ]}
                  onTouchStart={handleConstituencyPress}
                >
                  <Dropdown
                    data={
                      district ? constituenciesByDistrict[district] || [] : []
                    }
                    labelField="label"
                    valueField="value"
                    placeholder="~ Select Constituency ~"
                    value={constituency}
                    onChange={(item) => setConstituency(item.value)}
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    disable={!district}
                  />
                </View>
              </View>
              <View style={styles.input_label}>
                <Text style={styles.label}>Location</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Location"
                    placeholderTextColor="rgba(25, 25, 25, 0.5)"
                    onChangeText={setLocation}
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

            <View style={styles.inputContainer}>
              <View style={styles.input_label}>
                <Text style={styles.label}>Select Expertise</Text>
                <View style={styles.inputWrapper}>
                  <Dropdown
                    data={expertiseOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="~ Select Expertise ~"
                    placeholderStyle={{ color: "rgba(25, 25, 25, 0.5)" }}
                    value={expertise}
                    onChange={(item) => setExpertise(item.value)}
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                  />
                </View>
              </View>
              <View style={styles.input_label}>
                <Text style={styles.label}>Select Experience</Text>
                <View style={styles.inputWrapper}>
                  <Dropdown
                    data={experienceLevels}
                    labelField="label"
                    valueField="value"
                    placeholder="~ Select Experience ~"
                    placeholderStyle={{ color: "rgba(25, 25, 25, 0.5)" }}
                    value={experience}
                    onChange={(item) => setExperience(item.value)}
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                  />
                </View>
              </View>
              <View style={styles.input_label}>
                <Text style={styles.label}>Referral Code</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Referral Code"
                    placeholderTextColor="rgba(25, 25, 25, 0.5)"
                    onChangeText={setReferralCode}
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
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.loginText}
            onPress={() => navigation.navigate("Login")}
          >
            <Text>
              Already have an account?{" "}
              <Text style={styles.loginLink}>Login here</Text>
            </Text>
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
