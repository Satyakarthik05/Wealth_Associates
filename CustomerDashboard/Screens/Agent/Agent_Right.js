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
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomModal from "../../../Components/CustomModal";
import PostProperty from "../Properties/PostProperty";
import RequestProperty from "../Properties/RequestProperty";
import RequestExpert from "../ExpertPanel/Requested_expert";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../../data/ApiUrl";
import RequestedProperties from "../../Screens/Properties/ViewRequestedProperties";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Dashboard from "./Admin_Right";

// Import nested action components
import AddCustomer from "./Add_Agent";
import AddInvestor from "../Investors/AddInvestors";
import AddNRI from "../NRI/AddNri";
import AddSkilled from "../SkilledLabour/Rskill";

const { width, height } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

const actionButtons = [
  {
    title: "Post a Property",
    icon: "home",
    component: PostProperty,
  },
  {
    title: "Request a Property",
    icon: "home-search",
    component: RequestProperty,
  },
  {
    title: "Add a member",
    icon: "account-plus",
    component: null, // This will be handled separately
  },
  { title: "Request Expert", icon: "account-check", component: RequestExpert },
];

const nestedActionButtons = [
  { title: "Add an Investor", icon: "account-cash", component: AddInvestor },
  { title: "Add a NRI", icon: "account-clock", component: AddNRI },
  { title: "Add a Skilled", icon: "account-hard-hat", component: AddSkilled },
];

const numColumns = width > 800 ? 4 : 1;

const Agent_Right = ({ onViewAllPropertiesClick }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [propertiess, setPropertiess] = useState([]);
  const [coreClients, setCoreClients] = useState([]);
  const [coreProjects, setCoreProjectes] = useState([]);
  const [Details, setDetails] = useState({ Constituency: "" }); // Default value for Constituency
  const [nearbyProperties, setNearbyProperties] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true); // Loading state for Details

  // Fetch agent details
  const getDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/customer/getcustomer`, {
        method: "GET",
        headers: {
          token: `${token}` || "",
        },
      });
      const newDetails = await response.json();
      console.log("Agent Details API Response:", newDetails); // Log the response
      setDetails(newDetails);
    } catch (error) {
      console.error("Error fetching agent details:", error);
    } finally {
      setLoadingDetails(false); // Set loading to false after fetching
    }
  };

  // Fetch nearby properties
  const fetchNearbyProperties = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("Token not found in AsyncStorage");
        return;
      }

      const response = await fetch(
        `${API_URL}/properties/nearby/${Details.Contituency}`,
        {
          method: "GET",
          headers: {
            token: `${token}` || "",
          },
        }
      );

      const data = await response.json();
      console.log("Nearby Properties API Response:", data);

      if (data && Array.isArray(data.properties)) {
        setNearbyProperties(data.properties);
      } else {
        console.log("No nearby properties found.");
      }
    } catch (error) {
      console.error("Error fetching nearby properties:", error);
    }
  };

  // Fetch core clients
  const fetchCoreClients = async () => {
    try {
      const response = await fetch(`${API_URL}/coreclient/getallcoreclients`);
      const data = await response.json();
      setCoreClients(data);
    } catch (error) {
      console.error("Error fetching core clients:", error);
    }
  };

  // Fetch core projects
  const fetchCoreProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/coreproject/getallcoreprojects`);
      const data = await response.json();
      setCoreProjectes(data);
    } catch (error) {
      console.error("Error fetching core projects:", error);
    }
  };

  // Fetch requested properties
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
        createdAt: item.createdAt,
      }));
      setPropertiess(formattedProperties);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setLoading(false);
    }
  };

  // Get property tag based on creation date
  const getPropertyTag = (createdAt) => {
    const currentDate = new Date();
    const propertyDate = new Date(createdAt);
    const timeDifference = currentDate - propertyDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference <= 3) {
      return "Regular Property";
    } else if (daysDifference >= 4 && daysDifference <= 17) {
      return "Approved Property";
    } else if (daysDifference >= 18 && daysDifference <= 25) {
      return "Wealth Property";
    } else {
      return "Listed Property";
    }
  };

  // Get image by property type
  const getImageByPropertyType = (propertyType) => {
    switch (propertyType.toLowerCase()) {
      case "land":
        return require("../../../assets/Land.jpg");
      case "residential":
        return require("../../../assets/residntial.jpg");
      case "commercial":
        return require("../../../assets/commercial.jpg");
      case "villa":
        return require("../../../assets/villa.jpg");
      default:
        return require("../../../assets/house.png");
    }
  };

  // Fetch all properties
  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_URL}/properties/getApproveProperty`);
      const data = await response.json();
      if (data && Array.isArray(data) && data.length > 0) {
        setProperties(data.slice(-10));
        fetchPropertiess();
      } else {
        console.warn("API returned empty data.");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle action button clicks
  const handleActionButtonClick = (btn) => {
    if (btn.title === "Add a member") {
      setModalContent(
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.nestedModalContent}>
            {nestedActionButtons.map((nestedBtn, index) => (
              <TouchableOpacity
                key={index}
                style={styles.nestedActionButton}
                onPress={() => handleNestedActionButtonClick(nestedBtn)}
              >
                <View style={styles.iconCircle}>
                  <Icon
                    name={nestedBtn.icon}
                    size={Platform.OS === "web" ? 40 : 30}
                    color="#E91E63"
                  />
                </View>
                <Text style={styles.actionText}>{nestedBtn.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableWithoutFeedback>
      );
      setModalVisible(true);
    } else {
      const ModalComponent = btn.component;
      setModalContent(
        <ModalComponent title={btn.title} closeModal={closeModal} />
      );
      setModalVisible(true);
    }
  };

  // Handle nested action button clicks
  const handleNestedActionButtonClick = (nestedBtn) => {
    const ModalComponent = nestedBtn.component;
    setModalContent(
      <ModalComponent title={nestedBtn.title} closeModal={closeModal} />
    );
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Handle view all properties
  const handleViewAllProperties = () => {
    onViewAllPropertiesClick();
  };

  // Fetch data on component mount
  useEffect(() => {
    getDetails();
    fetchCoreClients();
    fetchCoreProjects();
    fetchProperties();
  }, []);

  // Fetch nearby properties when Constituency is available
  useEffect(() => {
    if (!loadingDetails && Details.Contituency) {
      console.log("Constituency:", Details.Contituency);
      fetchNearbyProperties();
    }
  }, [loadingDetails, Details.Contituency]);

  // Define firstRowProperties and secondRowProperties
  const firstRowProperties = properties.slice(0, 5);
  const secondRowProperties = properties.slice(5, 10);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
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
        <Dashboard />

        {/* Core Clients */}
        <Text style={styles.sectionTitle}>Core Clients</Text>
        <View style={styles.cardContainer}>
          {coreClients.map((client, index) => (
            <View key={index} style={styles.card}>
              <Image
                source={{ uri: `${API_URL}${client.photo}` }}
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
                source={{ uri: `${API_URL}${project.photo}` }}
                style={styles.logo}
                resizeMode="contain"
              />
              <View>
                <Text>{project.city}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Nearby Properties */}
        {nearbyProperties.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Nearby Properties</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.requestedPropertiesContainer}
            >
              {nearbyProperties.map((property, index) => {
                const imageUri = property.photo
                  ? { uri: `${API_URL}${property.photo}` }
                  : require("../../../assets/logo.png");
                const propertyTag = getPropertyTag(property.createdAt);

                return (
                  <View key={index} style={styles.propertyCard}>
                    <Image source={imageUri} style={styles.propertyImage} />
                    <View style={styles.approvedBadge}>
                      <Text style={styles.badgeText}>(✓){propertyTag}</Text>
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
              {[...propertiess].reverse().map((item) => (
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
          <ActivityIndicator
            size="large"
            color="#3498db"
            style={styles.loader}
          />
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
                  : require("../../../assets/logo.png");
                const propertyTag = getPropertyTag(property.createdAt);

                return (
                  <View key={index} style={styles.propertyCard}>
                    <Image source={imageUri} style={styles.propertyImage} />
                    <View style={styles.approvedBadge}>
                      <Text style={styles.badgeText}>(✓){propertyTag}</Text>
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
                  : require("../../../assets/logo.png");
                const propertyTag = getPropertyTag(property.createdAt);

                return (
                  <View key={index} style={styles.propertyCard}>
                    <Image source={imageUri} style={styles.propertyImage} />
                    <View style={styles.approvedBadge}>
                      <Text style={styles.badgeText}>(✓){propertyTag}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    ...(isWeb && { height: "auto", overflow: "scroll" }),
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 10,
    paddingBottom: isWeb ? height * 0.1 : 10,
  },
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    marginTop: Platform.OS === "web" ? "auto" : 40,
  },
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
  projectScroll: { marginVertical: 10 },
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
  version: {
    textAlign: "center",
    fontSize: 12,
    marginVertical: 10,
    color: "gray",
  },
  requestedPropertiesContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  requestedPropertiesRow: {
    flexDirection: "row",
  },
  requestcard: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    margin: 8,
    width: Platform.OS === "android" ? 250 : 230,
  },
  images: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  details: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#e91e63",
  },
  loader: { marginTop: 50 },
  nestedModalContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    padding: 20,
    backgroundColor: "#fff", // Light gray background
    borderRadius: 20, // Rounded corners
    margin: 0,
  },
  nestedActionButton: {
    alignItems: "center",
    margin: 10,
    width: isWeb ? 100 : 100,
    borderRadius: 10,
    padding: 10,
  },
});

export default Agent_Right;
