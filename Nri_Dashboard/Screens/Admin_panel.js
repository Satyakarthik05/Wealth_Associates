import { useState, useEffect, useRef } from "react";
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
  PanResponder,
} from "react-native";
import { API_URL } from "../../data/ApiUrl";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomModal from "../../Components/CustomModal";
import { useNavigation } from "@react-navigation/native";

import Agent_Right from "../Agent/Agent_Right";
import RequestedPropertyForm from "./Properties/RequestProperty";
import RequestedProperties from "./Properties/ViewRequestedProperties";
import ViewAllProperties from "./Properties/ViewAllProperties";

const { width, height } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

const menuItems = [
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
];

const Admin_panelnri = () => {
  const navigation = useNavigation();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(
    Platform.OS !== "android"
  );
  const [expandedItems, setExpandedItems] = useState({});
  const [Request, setRequest] = useState(false);
  const [isRequestedPropertiesVisible, setIsRequestedPropertiesVisible] =
    useState(false);
  const [isAllPropertiesVisible, setIsAllPropertiesVisible] = useState(false);

  const [Details, setDetails] = useState({});

  const toggleSidebar = () => {
    if (Platform.OS === "android") {
      setIsSidebarExpanded((prev) => !prev);
    }
  };

  const [refreshKey, setRefreshKey] = useState(0); // State to force refresh

  const handleDetailsUpdated = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment key to force re-render
    getDetails(); // Re-fetch details from the API
  };

  const handleExpertDetails = (expertType) => {
    setIsExpertDetails(true);
    setSelectedSubItem("expert details");
    setExpertType(expertType); // Store the expertType
  };
  useEffect(() => {
    getDetails();
  }, [refreshKey]);

  const toggleMenuItem = (title) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));

    if (Platform.OS === "android" && !isSidebarExpanded) {
      setIsSidebarExpanded(true);
    }
  };

  const handleViewAllPropertiesClick = () => {
    setIsAllPropertiesVisible(true);
    setSelectedSubItem("View All Properties");
  };

  const handleSubItemClick = (subItem) => {
    setRequest(false);
    setIsRequestedPropertiesVisible(false);
    setIsAllPropertiesVisible(false);

    if (Platform.OS === "android") {
      setIsSidebarExpanded(false);
    }

    if (subItem === "Request Property") {
      setRequest(true);
    } else if (subItem === "View Requested Properties") {
      setIsRequestedPropertiesVisible(true);
    } else if (subItem === "View All Properties") {
      setIsAllPropertiesVisible(true);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const closeModal = () => {
    // setIsAddAgentVisible(false);
    setRequest(false);
    // setIsPostedPropertiesVisible(false);
    setIsRequestedPropertiesVisible(false);
    setIsAllPropertiesVisible(false);
  };

  const renderContent = () => {
    //if (isPostedPropertiesVisible) return <MyPostedProperties />;
    if (isRequestedPropertiesVisible) return <RequestedProperties />;
    if (isAllPropertiesVisible) return <ViewAllProperties />;

    return (
      <ScrollView
        style={[styles.container, isWeb ? { overflow: "scroll" } : null]}
        contentContainerStyle={[
          styles.contentContainer,
          isWeb ? { flexGrow: 1 } : null,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Agent_Right onViewAllPropertiesClick={handleViewAllPropertiesClick} />
      </ScrollView>
    );
  };

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
      setDetails(newDetails);
      console.log(Details);
    } catch (error) {
      console.error("Error fetching agent details:", error);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  // PanResponder for swipe-to-close functionality
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50) {
          setIsSidebarExpanded(false);
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {Platform.OS === "android" && (
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      )}

      <View style={styles.navbar}>
        <TouchableOpacity
          onPress={() => {
            // setIsAddAgentVisible(false);
            // setIsViewAgentVisible(false);
            setRequest(false);
            // setIsPostedPropertiesVisible(false);
            setIsRequestedPropertiesVisible(false);
            setIsAllPropertiesVisible(false);
            // setIsViewCustomersModalVisible(false);
            // setIsExpertPanelVisible(false);
            // setIsRegiCusVisible(false);
            // setIsViewSkilledLabourVisible(false);
            // setIsRequestExpertVisible(false);
            // setAddPost(false);
            // setCoreClients(false);
            // setCoreProjects(false);
            // setisRsSkill(false);
            // setIsAgentProfile(false);
            // setSelectedSubItem(null);
          }}
        >
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
        </TouchableOpacity>
        <View style={styles.sear_icons}>
          <View style={styles.rightIcons}>
            <Ionicons name="moon-outline" size={20} color="#000" />
            <Ionicons name="notifications-outline" size={20} color="#000" />
            <Ionicons
              name="person-circle-outline"
              size={20}
              color="#000"
              onPress={() => {
                // setIsAgentProfile(true);
                // setIsAddAgentVisible(false);
                // setIsViewAgentVisible(false);
                setRequest(false);
                // setIsPostedPropertiesVisible(false);
                setIsRequestedPropertiesVisible(false);
                setIsAllPropertiesVisible(false);
                // setIsViewCustomersModalVisible(false);
                // setIsExpertPanelVisible(false);
                // setIsRegiCusVisible(false);
                // setIsViewSkilledLabourVisible(false);
                // setIsRequestExpertVisible(false);
                // setAddPost(false);
                // setCoreClients(false);
                // setCoreProjects(false);
                // setisRsSkill(false);
              }}
            />
          </View>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View
          style={[
            styles.sidebar,
            Platform.OS === "android" &&
              (isSidebarExpanded
                ? styles.expandedSidebar
                : styles.collapsedSidebar),
          ]}
          {...panResponder.panHandlers} // Attach PanResponder to the sidebar
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
                  <Ionicons name={item.icon} size={18} color="#555" />
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
        </View>

        <View style={styles.contentArea} key={refreshKey}>
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

      {Platform.OS === "android" && (
        <TouchableOpacity style={styles.toggleButton} onPress={toggleSidebar}>
          <Ionicons
            name={isSidebarExpanded ? "close-circle-outline" : "menu-outline"}
            size={30}
            color="#000"
          />
        </TouchableOpacity>
      )}

      {/* <CustomModal
        isVisible={isAddAgentVisible}
        closeModal={closeModal}
        style={styles.modalOverlay}
      >
        <Add_Agent closeModal={closeModal} style={styles.modalContent} />
      </CustomModal>

      <Custodal>mModal isVisible={isRequestPropertyVisible} closeModal={closeModal}>
        <RequestProperty closeModal={closeModal} />
      </CustomMo
      <CustomModal isVisible={isRegiCusVisible} closeModal={closeModal}>
        <RegisterExecute closeModal={closeModal} />
      </CustomModal>
      <CustomModal isVisible={isRequestExpertVisible} closeModal={closeModal}>
        <RequestedExpert closeModal={closeModal} />
      </CustomModal>
      <CustomModal isVisible={addPost} closeModal={closeModal}>
        <PostProperty closeModal={closeModal} />
      </CustomModal>
      <CustomModal isVisible={isRskill} closeModal={closeModal}>
        <Rskill closeModal={closeModal} />
      </CustomModal> */}
      <CustomModal isVisible={Request} closeModal={closeModal}>
        <RequestedPropertyForm closeModal={closeModal} />
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
    padding: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    justifyContent: "space-between",
    marginTop: -10,
  },
  logo: {
    width: 100,
    height: 60,
    resizeMode: "contain",
    marginLeft: Platform.OS === "web" ? "0px" : "28%",
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
    gap: Platform.OS === "web" ? "10px" : 10,
    marginLeft: Platform.OS === "android" ? -15 : "0",
  },
  icon: {
    width: 20,
    height: 15,
    // marginRight: 5,
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
    width: 50,
    alignItems: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 5,
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
    height: "100vh",
  },
  toggleButton: {
    position: "absolute",
    top: 18,
    left: 10,
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

export default Admin_panelnri;
