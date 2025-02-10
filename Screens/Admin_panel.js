import { useState, useEffect } from "react";
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  TextInput,
  StatusBar,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { API_URL } from "../data/ApiUrl";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomModal from "../Components/CustomModal";

//importing components
import Agent_Right from "../Screens/Agent/Agent_Right";
import Add_Agent from "../Screens/Agent/Add_Agent";
import ViewAgents from "../Screens/Agent/ViewAgents";
import RegisterExecute from "../Screens/Customer/Regicus";
import ViewCustomers from "../Screens/Customer/View_customers";
import RequestProperty from "../Screens/Properties/RequestProperty";
import MyPostedProperties from "../Screens/Properties/ViewPostedProperties";
import RequestedProperties from "../Screens/Properties/ViewRequestedProperties";
import ViewAllProperties from "../Screens/Properties/ViewAllProperties";
import ExpertPanel from "../Screens/ExpertPanel/Expert_panel";
import ViewSkilledLabours from "../Screens/SkilledLabour/ViewSkilledLabours";
import RequestedExpert from "../Screens/ExpertPanel/Requested_expert";
import PostProperty from "./Properties/PostProperty";

const { width, height } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

const menuItems = [
  {
    title: "Agents",
    icon: "person-add-outline",
    subItems: ["Register Agent", "View Agents"],
  },
  {
    title: "Customers",
    icon: "people-outline",
    subItems: ["Add Customer", "View Customers"],
  },
  {
    title: "Properties",
    icon: "home-outline",
    subItems: [
      "Post Property",
      "Request Property",
      "View Posted Properties",
      "View Requested Properties",
      "View All Properties",
    ],
  },
  {
    title: "Expert Panel",
    icon: "cog-outline",
    subItems: ["View Expert Panel", "Request Expert Panel"],
  },

  {
    title: "Core Clients",
    icon: "business-outline",
    subItems: ["View Core Clients", "View Core Projects"],
  },
  {
    title: "Skilled Club",
    icon: "trophy-outline",
    subItems: ["Register Skilled Labour", "View Skilled Labour"],
  },
];

const Admin_panel = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(
    Platform.OS !== "android"
  );
  const [expandedItems, setExpandedItems] = useState({});
  const [isAddAgentVisible, setIsAddAgentVisible] = useState(false);
  const [isViewAgentVisible, setIsViewAgentVisible] = useState(false);
  const [isRequestPropertyVisible, setIsRequestPropertyVisible] =
    useState(false);
  const [isPostedPropertiesVisible, setIsPostedPropertiesVisible] =
    useState(false);
  const [isRequestedPropertiesVisible, setIsRequestedPropertiesVisible] =
    useState(false);
  const [addPost, setAddPost] = useState(false);
  const [isAllPropertiesVisible, setIsAllPropertiesVisible] = useState(false);
  const [isViewCustomersModalVisible, setIsViewCustomersModalVisible] =
    useState(false);
  const [isExpertPanelVisible, setIsExpertPanelVisible] = useState(false);
  const [isRegiCusVisible, setIsRegiCusVisible] = useState(false);
  const [isViewSkilledLabourVisible, setIsViewSkilledLabourVisible] =
    useState(false);
  const [isRequestExpertVisible, setIsRequestExpertVisible] = useState(false);
  const [selectedSubItem, setSelectedSubItem] = useState(null);
  const [Details, setDetails] = useState({});

  const toggleSidebar = () => {
    if (Platform.OS === "android") {
      setIsSidebarExpanded((prev) => !prev);
    }
  };

  const toggleMenuItem = (title) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));

    if (Platform.OS === "android" && !isSidebarExpanded) {
      setIsSidebarExpanded(true);
    }
  };

  const handleSubItemClick = (subItem) => {
    setIsAddAgentVisible(false);
    setIsViewAgentVisible(false);
    setIsRequestPropertyVisible(false);
    setIsPostedPropertiesVisible(false);
    setIsRequestedPropertiesVisible(false);
    setIsAllPropertiesVisible(false);
    setIsViewCustomersModalVisible(false);
    setIsExpertPanelVisible(false);
    setIsRegiCusVisible(false);
    setIsViewSkilledLabourVisible(false);
    setIsRequestExpertVisible(false);
    setAddPost(false);

    if (Platform.OS === "android") {
      setIsSidebarExpanded(false);
    }

    if (subItem === "Register Agent") {
      setIsAddAgentVisible(true);
    } else if (subItem === "View Agents") {
      setIsViewAgentVisible(true);
    } else if (subItem === "Request Property") {
      setIsRequestPropertyVisible(true);
    } else if (subItem === "View Posted Properties") {
      setIsPostedPropertiesVisible(true);
    } else if (subItem === "View Requested Properties") {
      setIsRequestedPropertiesVisible(true);
    } else if (subItem === "View All Properties") {
      setIsAllPropertiesVisible(true);
    } else if (subItem === "View Customers") {
      setIsViewCustomersModalVisible(true);
    } else if (subItem === "View Expert Panel") {
      setIsExpertPanelVisible(true);
    } else if (subItem === "Add Customer") {
      setIsRegiCusVisible(true);
    } else if (subItem === "View Skilled Labour") {
      setIsViewSkilledLabourVisible(true);
    } else if (subItem === "Register Skilled Labour") {
      setIsRequestExpertVisible(true);
    } else if (subItem === "Post Property") {
      setAddPost(true);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const closeModal = () => {
    setIsAddAgentVisible(false);
    setIsRequestPropertyVisible(false);
    setIsPostedPropertiesVisible(false);
    setIsRequestedPropertiesVisible(false);
    setIsAllPropertiesVisible(false);
    setIsViewCustomersModalVisible(false);
    setIsExpertPanelVisible(false);
    setIsViewAgentVisible(false);
    setIsRegiCusVisible(false);
    setIsViewSkilledLabourVisible(false);
    setIsRequestExpertVisible(false);
    setAddPost(false);
  };

  const renderContent = () => {
    if (isPostedPropertiesVisible) return <MyPostedProperties />;
    if (isRequestedPropertiesVisible) return <RequestedProperties />;
    if (isAllPropertiesVisible) return <ViewAllProperties />;
    if (isViewCustomersModalVisible) return <ViewCustomers />;
    if (isExpertPanelVisible) return <ExpertPanel />;
    if (isViewAgentVisible) return <ViewAgents />;
    if (isViewSkilledLabourVisible) return <ViewSkilledLabours />;
    return <Agent_Right />; // Default component
  };

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
    } catch (error) {
      console.error("Error fetching agent details:", error);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <View style={styles.container}>
      {/* Status Bar Adjustment for Android */}
      {Platform.OS === "android" && (
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      )}

      {/* Top Navbar */}
      <View style={styles.navbar}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <View style={styles.sear_icons}>
          <View style={styles.rightIcons}>
            <Image
              source={require("../assets/usflag.png")}
              style={styles.icon}
            />
            <Text style={styles.language}>English</Text>
            <Ionicons name="moon-outline" size={24} color="#000" />
            <Ionicons name="notifications-outline" size={24} color="#000" />
            <Ionicons name="person-circle-outline" size={30} color="#000" />
          </View>
        </View>
      </View>

      {/* Main Layout */}
      <View style={styles.mainContent}>
        {/* Sidebar */}
        <View
          style={[
            styles.sidebar,
            Platform.OS === "android" &&
              (isSidebarExpanded
                ? styles.expandedSidebar
                : styles.collapsedSidebar),
          ]}
        >
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.title}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => toggleMenuItem(item.title)}
                >
                  <Ionicons name={item.icon} size={24} color="#555" />
                  {isSidebarExpanded && (
                    <Text style={styles.menuText}>{item.title}</Text>
                  )}
                  {isSidebarExpanded && (
                    <Ionicons
                      name={
                        expandedItems[item.title]
                          ? "chevron-up-outline"
                          : "chevron-down-outline"
                      }
                      size={16}
                      color="#555"
                    />
                  )}
                </TouchableOpacity>
                {isSidebarExpanded &&
                  expandedItems[item.title] &&
                  item.subItems &&
                  item.subItems.map((sub, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleSubItemClick(sub)}
                    >
                      <Text style={styles.subMenuText}>{sub}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            )}
          />
          <Text style={styles.lastUpdated}>Last Updated: 30.01.2025</Text>
        </View>

        {/* Main Content Area */}
        <View style={styles.contentArea}>
          <View style={styles.container}>
            <ScrollView>
              <View style={styles.userContent}>
                <Text style={styles.usersContentText}>
                  Welcome Back:
                  <Text style={{ color: "#E82E5F" }}>
                    {" "}
                    {Details.FullName ? Details.FullName : "yourname"}
                  </Text>
                </Text>
                <Text style={styles.usersContentText}>
                  YourReferralcode:
                  <Text style={{ color: "#E82E5F" }}>
                    {Details.MyRefferalCode ? Details.MyRefferalCode : "mycode"}
                  </Text>
                </Text>
                {renderContent()}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>

      {/* Toggle Button for Sidebar (Android Only) */}
      {Platform.OS === "android" && (
        <TouchableOpacity style={styles.toggleButton} onPress={toggleSidebar}>
          <Ionicons
            name={isSidebarExpanded ? "close-circle-outline" : "menu-outline"}
            size={30}
            color="#000"
          />
        </TouchableOpacity>
      )}

      <CustomModal
        isVisible={isAddAgentVisible}
        closeModal={closeModal}
        style={styles.modalOverlay}
      >
        <Add_Agent closeModal={closeModal} style={styles.modalContent} />
      </CustomModal>

      <CustomModal isVisible={isRequestPropertyVisible} closeModal={closeModal}>
        <RequestProperty closeModal={closeModal} />
      </CustomModal>
      <CustomModal isVisible={isRegiCusVisible} closeModal={closeModal}>
        <RegisterExecute closeModal={closeModal} />
      </CustomModal>
      <CustomModal isVisible={isRequestExpertVisible} closeModal={closeModal}>
        <RequestedExpert closeModal={closeModal} />
      </CustomModal>
      <CustomModal isVisible={addPost} closeModal={closeModal}>
        <PostProperty closeModal={closeModal} />
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    width: "100%",
    paddingTop: Platform.OS === "android" ? 0 : StatusBar.currentHeight,
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    justifyContent: "space-between",
  },
  logo: {
    width: 100,
    height: 60,
    resizeMode: "contain",
    marginLeft: Platform.OS === "web" ? "0px" : "17%",
  },
  sear_icons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Platform.OS === "web" ? 0 : "10%",
    gap: Platform.OS === "web" ? "10px" : 0,
  },
  icon: {
    width: 20,
    height: 15,
    marginRight: 5,
  },
  language: {
    marginRight: 10,
    color: "#555",
  },
  mainContent: {
    flexDirection: "row",
    flex: 1,
  },
  sidebar: {
    backgroundColor: "#fff",
    padding: 10,
    borderRightWidth: 1,
    borderColor: "#ddd",
    width: Platform.OS === "android" ? 300 : 250,
    ...(Platform.OS === "web" && { minHeight: "100vh" }),
  },
  expandedSidebar: {
    width: 250,
  },
  collapsedSidebar: {
    width: 70,
    alignItems: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  menuText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginLeft: 10,
  },
  subMenuText: {
    fontSize: 14,
    color: "#FF4081",
    paddingLeft: 35,
    paddingVertical: 5,
  },
  lastUpdated: {
    marginTop: 20,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  contentArea: {
    flex: 1,
    backgroundColor: "#F0F5F5",
    ...(Platform.OS === "web" && { padding: 5 }),
  },
  toggleButton: {
    position: "absolute",
    top: 25,
    left: 20,
    zIndex: 1000,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: Platform.OS === "web" ? "65%" : "100%",
    // backgroundColor: "#fff",
    backgroundColor: "transparent",
    borderRadius: 10,
    padding: 20,
    maxHeight: Platform.OS === "web" ? "80%" : "90%",
    height: 900,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  userContent: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: Platform === "web" ? "row" : "column",
  },
  usersContentText: {
    fontSize: 16,
    fontWeight: "bold",
    // color: "#E82E5F",
  },
});

export default Admin_panel;
