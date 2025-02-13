import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomModal from "../../Components/CustomModal"; // Ensure this path is correct
import PostProperty from "../Properties/PostProperty"; // Ensure this path is correct
import RequestProperty from "../Properties/RequestProperty"; // Create this component
import AddClubMember from "../Customer/Regicus"; // Create this component
import RequestExpert from "../ExpertPanel/Requested_expert"; // Create this component
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../data/ApiUrl";
import RequestedProperties from "../../Screens/Properties/ViewRequestedProperties";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import the RequestedProperties component

const { width, height } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

const actionButtons = [
  {
    title: "Post a Property",
    subtext: "(Free)",
    icon: "home",
    component: PostProperty,
  },
  {
    title: "Request a Property",
    icon: "home-search",
    component: RequestProperty,
  },
  {
    title: "Add a customer",
    icon: "account-plus",
    component: AddClubMember,
  },
  { title: "Request Expert", icon: "account-check", component: RequestExpert },
];

const coreClients = [
  {
    name: "Harischandra Townships",
    logo: require("../../assets/Logo Final 1.png"),
  },
];

const coreProjects = [
  { name: "Bay Town", logo: require("../../assets/Main-Logo (1) 1.png") },
  { name: "Icon", logo: require("../../assets/Meenakshi-Icon-Blac (2) 1.png") },
  {
    name: "Surya Avenue",
    logo: require("../../assets/Surya Avenue Logo[1] 1.png"),
  },
  { name: "The Park Vue", logo: require("../../assets/Logo 1.png") },
];
const numColumns = width > 800 ? 4 : 1;

const Agent_Right = ({ onViewAllPropertiesClick }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [propertiess, setPropertiess] = useState([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPropertiess();
  }, []);

  const fetchPropertiess = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("Token not found in AsyncStorage");
        setLoading(false);
        return;
      }
      const response = await fetch(
        `${API_URL}/requestProperty/getallrequestProperty`,
        {
          method: "GET",
          headers: {
            token: `${token}` || "",
          },
        }
      );
      const data = await response.json();
      const formattedProperties = data.map((item) => ({
        id: item._id,
        title: item.propertyTitle,
        type: item.propertyType,
        location: item.location,
        budget: `₹${item.Budget.toLocaleString()}`,
        image: getImageByPropertyType(item.propertyType),
      }));
      setPropertiess(formattedProperties);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setLoading(false);
    }
  };

  const getImageByPropertyType = (propertyType) => {
    switch (propertyType.toLowerCase()) {
      case "land":
        return require("../../assets/Land.jpg");
      case "residential":
        return require("../../assets/residntial.jpg");
      case "commercial":
        return require("../../assets/commercial.jpg");
      case "villa":
        return require("../../assets/villa.jpg");
      default:
        return require("../../assets/house.png");
    }
  }; // Initialize navigation

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_URL}/properties/getallPropertys`);
      const data = await response.json();
      if (data && Array.isArray(data) && data.length > 0) {
        setProperties(data.slice(-10)); // Fetch last 10 properties
      } else {
        console.warn("API returned empty data.");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionButtonClick = (btn) => {
    const ModalComponent = btn.component;
    setModalContent(
      <ModalComponent title={btn.title} closeModal={closeModal} />
    );
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleViewAllProperties = () => {
    onViewAllPropertiesClick(); // Call the callback function
    // navigation.navigate("ViewAllProperties");
  };

  // Split properties into two rows
  const firstRowProperties = properties.slice(0, 5);
  const secondRowProperties = properties.slice(5, 10);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {actionButtons.map((btn, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionButton}
            onPress={() => handleActionButtonClick(btn)}
          >
            <View style={styles.iconCircle}>
              <Icon
                name={btn.icon}
                size={Platform.OS === "web" ? 40 : 30}
                color="#E91E63"
              />
            </View>
            <Text style={styles.actionText}>{btn.title}</Text>
            {btn.subtext && <Text style={styles.subtext}>{btn.subtext}</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {/* Render the CustomModal */}
      <CustomModal isVisible={isModalVisible} closeModal={closeModal}>
        {modalContent}
      </CustomModal>

      {/* Core Clients */}
      <Text style={styles.sectionTitle}>Core Clients</Text>
      <View style={styles.cardContainer}>
        {coreClients.map((client, index) => (
          <View key={index} style={styles.card}>
            <Image
              source={client.logo}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        ))}
      </View>

      {/* Core Projects */}
      <Text style={styles.sectionTitle}>Core Projects</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.projectScroll}
      >
        {coreProjects.map((project, index) => (
          <View key={index} style={styles.card}>
            <Image
              source={project.logo}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        ))}
      </ScrollView>

      {/* Requested Properties */}
      {/* Requested Properties */}
      <Text style={styles.sectionTitle}>Requested Properties</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.requestedPropertiesContainer}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#e91e63" />
            <Text style={styles.loadingText}>Fetching properties...</Text>
          </View>
        ) : (
          <View style={styles.requestedPropertiesRow}>
            {propertiess.map((item) => (
              <View key={item.id} style={styles.requestcard}>
                <Image source={item.image} style={styles.images} />
                <View style={styles.approvedBadge}>
                  <Text style={styles.badgeText}>✔ Approved</Text>
                </View>
                <View style={styles.details}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.text}>Property Type: {item.type}</Text>
                  <Text style={styles.text}>Location: {item.location}</Text>
                  <Text style={styles.text}>Budget: {item.budget}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Properties */}
      <View style={styles.propertiesHeader}>
        <Text style={styles.sectionTitle}>Properties</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
      ) : (
        <>
          {/* First Row of Properties */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.propertyScroll}
          >
            {firstRowProperties.map((property, index) => {
              const imageUri = property.photo
                ? { uri: `${API_URL}${property.photo}` }
                : require("../../assets/logo.png");

              return (
                <View key={index} style={styles.propertyCard}>
                  <Image source={imageUri} style={styles.propertyImage} />
                  <View style={styles.approvedBadge}>
                    <Text style={styles.badgeText}>Approved</Text>
                  </View>
                  <Text style={styles.propertyTitle}>
                    {property.propertyType}
                  </Text>
                  <Text style={styles.propertyInfo}>
                    Location: {property.location}
                  </Text>
                  <Text style={styles.propertyBudget}>
                    ₹ {parseInt(property.price).toLocaleString()}
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          {/* Second Row of Properties */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.propertyScroll}
          >
            {secondRowProperties.map((property, index) => {
              const imageUri = property.photo
                ? { uri: `${API_URL}${property.photo}` }
                : require("../../assets/logo.png");

              return (
                <View key={index} style={styles.propertyCard}>
                  <Image source={imageUri} style={styles.propertyImage} />
                  <View style={styles.approvedBadge}>
                    <Text style={styles.badgeText}>Approved</Text>
                  </View>
                  <Text style={styles.propertyTitle}>
                    {property.propertyType}
                  </Text>
                  <Text style={styles.propertyInfo}>
                    Location: {property.location}
                  </Text>
                  <Text style={styles.propertyBudget}>
                    ₹ {parseInt(property.price).toLocaleString()}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </>
      )}

      {/* View All Properties Button */}
      <TouchableOpacity
        style={styles.viewAllButton}
        onPress={handleViewAllProperties}
      >
        <Text style={styles.viewAllButtonText}>View All Properties</Text>
      </TouchableOpacity>

      {/* Version Info */}
      <Text style={styles.version}>Version : 1.0.0.2025</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { padding: 10, paddingBottom: isWeb ? height * 0.1 : 10 }, // Add paddingBottom for web

  // Action Buttons
  actionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  actionButton: {
    backgroundColor: "#fff",
    alignItems: "center",
    margin: 10,
    width: isWeb ? 100 : 80,
  },
  iconCircle: {
    width: isWeb ? 80 : 60,
    height: isWeb ? 80 : 60,
    borderRadius: isWeb ? 40 : 30,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  actionText: {
    fontSize: isWeb ? 14 : 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtext: { fontSize: 12, color: "red", textAlign: "center" },

  // Section Titles
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    marginTop: Platform.OS === "web" ? "auto" : 40,
  },

  // Core Clients & Projects
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: isWeb ? 200 : 150,
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  logo: { width: "80%", height: "80%" },

  // Core Projects Scroll
  projectScroll: { marginVertical: 10 },

  // Properties
  propertiesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  propertyScroll: { marginVertical: 10 },
  propertyCard: {
    width: isWeb ? 250 : 180,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginRight: 10,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  propertyImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  approvedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "green",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
  },
  badgeText: { color: "#fff", fontSize: 12 },
  propertyTitle: { fontSize: 14, fontWeight: "bold", margin: 5 },
  propertyInfo: { fontSize: 12, marginLeft: 5 },
  propertyBudget: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
    color: "green",
  },

  // View All Button
  viewAllButton: {
    backgroundColor: "#E82E5F",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 20,
  },
  viewAllButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Version Info
  version: {
    textAlign: "center",
    fontSize: 12,
    marginVertical: 10,
    color: "gray",
  },
  // Requested Properties Container
  requestedPropertiesContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  // Requested Properties Row
  requestedPropertiesRow: {
    flexDirection: "row",
  },

  // Request Card
  requestcard: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    margin: 8,
    width: Platform.OS === "android" ? 250 : 230, // Adjust width as needed
  },

  // Images
  images: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },

  // Approved Badge
  approvedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "green",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
  },

  // Badge Text
  badgeText: {
    color: "#fff",
    fontSize: 12,
  },

  // Details
  details: {
    padding: 10,
  },

  // Title
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },

  // Text
  text: {
    fontSize: 12,
    color: "#666",
  },

  // Loading Container
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Loading Text
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#e91e63",
  },
  loader: { marginTop: 50 },
});

export default Agent_Right;
