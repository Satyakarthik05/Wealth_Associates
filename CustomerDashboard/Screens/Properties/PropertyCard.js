import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import ViewShot from "react-native-view-shot";
import logo from "../../../assets/logo.png";
import defaultAgentImage from "../../../assets/man.png";

const PropertyCard = ({ property, closeModal }) => {
  const { photo, location, price, propertyType, PostedBy, fullName } = property;
  const viewShotRef = useRef(null);
  const [agentImage, setAgentImage] = useState(defaultAgentImage);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadProfileImage = async () => {
      try {
        const savedImage = await AsyncStorage.getItem("@profileImage");
        if (isMounted && savedImage) {
          setAgentImage({ uri: savedImage });
        }
      } catch (error) {
        console.error("Error loading profile image:", error);
      }
    };
    loadProfileImage();
    return () => {
      isMounted = false;
    };
  }, []);

  const captureAndShare = async () => {
    if (isSharing) return;
    
    setIsSharing(true);
    try {
      const uri = await viewShotRef.current.capture();
      console.log("Image saved to", uri);

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Sharing not available on this device.");
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: "image/jpeg",
        dialogTitle: "Share Property",
        UTI: "public.image",
      });
    } catch (error) {
      console.error("Error sharing property:", error);
      Alert.alert("Error", "Failed to share property");
    } finally {
      setIsSharing(false);
      closeModal();
    }
  };

  return (
    <View style={styles.container}>
      <ViewShot
        ref={viewShotRef}
        options={{ format: "jpg", quality: 0.9 }}
        style={styles.viewShot}
      >
        <Text style={styles.title}>Property For Sale</Text>
        <View style={styles.header}>
          <View>
            <Text style={styles.propertyType}>{propertyType}</Text>
            <Text style={styles.locationText}>Location: {location}</Text>
          </View>
          <Image source={logo} style={styles.logo} />
        </View>

        <Image source={{ uri: photo }} style={styles.propertyImage} />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>₹{price}</Text>
        </View>

        <View style={styles.agentInfo}>
          <Image source={agentImage} style={styles.agentImage} />
          <View>
            <Text style={styles.agentName}>{fullName}</Text>
            <Text style={styles.agentPhone}>{PostedBy}</Text>
          </View>
        </View>
      </ViewShot>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={closeModal} 
          disabled={isSharing}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={captureAndShare} 
          disabled={isSharing}
        >
          {isSharing ? (
            <ActivityIndicator color="#25D366" />
          ) : (
            <>
              <FontAwesome name="whatsapp" size={24} color="#25D366" />
              <Text style={styles.buttonText}>Share</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 10, 
    borderRadius: 10, 
    backgroundColor: "#e6708e",
    width: "90%",
    maxWidth: 400,
  },
  viewShot: { 
    backgroundColor: "#5a89cc", 
    borderRadius: 10, 
    padding: 10,
    width: "100%",
  },
  title: { 
    textAlign: "center", 
    fontSize: 25, 
    fontWeight: "600", 
    color: "white",
    marginBottom: 10,
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 10,
  },
  propertyType: { 
    fontSize: 18, 
    fontWeight: "bold",
    color: "#fff",
  },
  locationText: { 
    fontSize: 16, 
    fontWeight: "700",
    color: "#fff",
  },
  logo: { 
    width: 60, 
    height: 30, 
    resizeMode: "contain" 
  },
  propertyImage: { 
    width: "100%", 
    height: 180, 
    borderRadius: 10,
    marginVertical: 10,
  },
  priceTag: { 
    position: "absolute", 
    bottom: 100, 
    right: 20, 
    backgroundColor: "#333", 
    padding: 8, 
    borderRadius: 8,
  },
  priceText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
  agentInfo: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#eee", 
    borderRadius: 10, 
    padding: 10, 
    marginTop: 10,
  },
  agentImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 50, 
    borderWidth: 2, 
    borderColor: "#e653b3",
    marginRight: 15,
  },
  agentName: { 
    fontWeight: "bold", 
    fontSize: 16,
    marginBottom: 5,
  },
  agentPhone: { 
    fontSize: 14, 
    color: "#555" 
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
    padding: 12, 
    borderRadius: 8, 
    flex: 1, 
    justifyContent: "center", 
    marginHorizontal: 5,
  },
  buttonText: { 
    marginLeft: 8, 
    fontSize: 16, 
    color: "#000",
    fontWeight: "500",
  },
});

export default PropertyCard;