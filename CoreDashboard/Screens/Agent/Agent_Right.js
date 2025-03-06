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
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomModal from "../../../Components/CustomModal";
import PostProperty from "../Properties/PostProperty";
import RequestProperty from "../Properties/RequestProperty";
import AddClubMember from "../Customer/Regicus";
import RequestExpert from "../ExpertPanel/Requested_expert";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../../data/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    title: "Add a club member",
    icon: "account-plus",
    component: "AddClubMember",
  }, // Updated to open modal
  { title: "Request Expert", icon: "account-check", component: RequestExpert },
];

const Agent_Right = ({ onViewAllPropertiesClick }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [clubMemberModal, setClubMemberModal] = useState(false); // New state for club member modal

  const handleActionButtonClick = (btn) => {
    if (btn.component === "AddClubMember") {
      setClubMemberModal(true); // Open new modal
    } else {
      const ModalComponent = btn.component;
      setModalContent(
        <ModalComponent title={btn.title} closeModal={closeModal} />
      );
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setClubMemberModal(false);
  };

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

        {/* CustomModal */}
        <CustomModal isVisible={isModalVisible} closeModal={closeModal}>
          {modalContent}
        </CustomModal>

        {/* Club Member Registration Modal */}
        <Modal visible={clubMemberModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Register as a Club Member</Text>

              <TouchableOpacity style={styles.registerButton}>
                <Image
                  source={require("../../../assets/man.png")}
                  style={styles.registerIcon}
                />
                <Text style={styles.registerText}>Add as Investor</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.registerButton}>
                <Image
                  source={require("../../../assets/man.png")}
                  style={styles.registerIcon}
                />
                <Text style={styles.registerText}>Add as Customer</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.registerButton}>
                <Image
                  source={require("../../../assets/man.png")}
                  style={styles.registerIcon}
                />
                <Text style={styles.registerText}>Add as NRI</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.registerButton}>
                <Image
                  source={require("../../../assets/man.png")}
                  style={styles.registerIcon}
                />
                <Text style={styles.registerText}>Add as Skilled Resource</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollView: { flex: 1 },
  contentContainer: { flexGrow: 1, padding: 10 },
  actionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  actionButton: {
    backgroundColor: "#fff",
    alignItems: "center",
    margin: 10,
    width: 80,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  actionText: { fontSize: 12, fontWeight: "bold", textAlign: "center" },
  subtext: { fontSize: 12, color: "red", textAlign: "center" },

  // Modal Styling
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E91E63",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: "100%",
    justifyContent: "center",
  },
  registerIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    resizeMode: "contain",
  },
  registerText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: { fontSize: 16, fontWeight: "bold", color: "#333" },
});

export default Agent_Right;
