import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import ViewShot from "react-native-view-shot";
import logo from "../../../assets/logo.png";
import defaultAgentImage from "../../../assets/man.png";

const PropertyCard = ({ property, closeModal }) => {
  const { photo, location, price, propertyType, PostedBy, fullName } = property;
  const viewShotRef = useRef();
  const [agentImage, setAgentImage] = useState(null);

  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const savedImage = await AsyncStorage.getItem("@profileImage");
        if (savedImage) {
          setAgentImage({ uri: savedImage });
        } else {
          setAgentImage(defaultAgentImage); // Set default image if no saved image
        }
      } catch (error) {
        console.error("Error loading profile image:", error);
        setAgentImage(defaultAgentImage); // Ensure fallback in case of error
      }
    };

    loadProfileImage();
  }, []);

  const handleShareOnWhatsApp = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      console.log("Image saved to", uri);

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        alert("Sharing is not available on this platform.");
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: "image/jpeg",
        dialogTitle: "Share Property",
        UTI: "public.image",
      });

      const caption = `Check out this property in ${location} for ₹${price}.`;
      const url = `whatsapp://send?text=${encodeURIComponent(caption)}`;
      Linking.openURL(url)
        .then(() => closeModal())
        .catch(() => alert("WhatsApp is not installed on your device."));
    } catch (error) {
      console.error("Error sharing property:", error);
      alert("Failed to share property.");
    }
  };

  return (
    <View style={styles.templateContainer}>
      <ViewShot
        ref={viewShotRef}
        options={{ format: "jpg", quality: 0.9 }}
        style={{ backgroundColor: "#5a89cc", borderRadius: 10, padding: 10 }}
      >
        <Text style={styles.title}>Property For Sale</Text>
        <View style={styles.header}>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.propertyType}>{propertyType}</Text>
            <Text style={styles.locationText}>Location: {location}</Text>
          </View>
          <Image source={logo} style={styles.logo} />
        </View>

        <View style={styles.imageSection}>
          <Image source={{ uri: photo }} style={styles.propertyImage} />
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>₹{price}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.agentInfo}>
            <Image source={agentImage} style={styles.agentImage} />
            <View style={styles.agentDetails}>
              <Text style={styles.agentName}>{fullName}</Text>
              <Text style={styles.agentPhone}>{PostedBy}</Text>
            </View>
          </View>
        </View>
      </ViewShot>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={closeModal}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleShareOnWhatsApp}>
          <FontAwesome name="whatsapp" size={24} color="#25D366" />
          <Text style={styles.buttonText}>Share on WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  templateContainer: {
    backgroundColor: "#e6708e",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: "100%",
  },
  title: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "600",
    marginBottom: 20,
    color: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 10,
  },
  propertyType: {
    fontSize: 18,
    fontWeight: "bold",
    left: 20,
  },
  logo: {
    width: 60,
    height: 30,
    resizeMode: "contain",
  },
  imageSection: {
    marginTop: 10,
    backgroundColor: "#eee",
    borderRadius: 15,
    overflow: "hidden",
    alignItems: "center",
  },
  propertyImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
  },
  priceTag: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 8,
  },
  priceText: {
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
  },
  agentInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 10,
    padding: 10,
    flex: 2,
    marginRight: 5,
  },
  agentImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#e653b3",
    backgroundColor: "#fff",
    marginRight: 10,
  },
  agentDetails: {
    justifyContent: "center",
  },
  agentName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  agentPhone: {
    fontSize: 14,
    color: "#555",
  },
  locationText: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    left: 9,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: "center",
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#000",
  },
});

export default PropertyCard;
