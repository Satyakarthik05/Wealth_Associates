import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";

const { width, height } = Dimensions.get("window");
import { useNavigation } from "@react-navigation/native";

const MainScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Profile Image Positioned Overlapping Card */}
      <View style={styles.profileContainer}>
        <Image
          source={require("../assets/ped.jpg")}
          style={styles.profileImage}
        />
      </View>

      {/* Card Section */}
      <View style={styles.card}>
        <Image source={require("../assets/wlogo.png")} style={styles.logo} />

        <View style={styles.buttonRow}>
          <View style={styles.buttonColumn}>
            <Text style={styles.subText}>Already registered?</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Starting Screen")}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonColumn}>
            <Text style={styles.subText}>New account ?</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    overflow: "visible", // Prevents cutting off absolute-positioned elements
  },
  profileContainer: {
    position: "absolute",
    top:
      Platform.OS === "android" || Platform.OS === "ios"
        ? height * 0.14
        : height * 0.09, // Adjust positioning to overlap properly
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10, // Ensure it stays above the card
    elevation: 10, // Required for Android
  },
  profileImage: {
    width:
      Platform.OS === "android" || Platform.OS === "ios"
        ? width * 0.35
        : width * 0.1,
    height:
      Platform.OS === "android" || Platform.OS === "ios"
        ? width * 0.35
        : width * 0.1,
    borderRadius: width * 0.28,
    borderWidth: 5,
    borderColor: "#FF3366",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 30,
    borderRadius: 28,
    alignItems: "center",
    width: width > 600 ? "50%" : "90%", // Responsive width for web and mobile
    maxWidth: 600,
    height:
      Platform.OS === "android" || Platform.OS === "ios"
        ? height * 0.58
        : height * 0.59,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  logo: {
    width: width * 0.4,
    height: height * 0.15,
    resizeMode: "contain",
    marginBottom: 10,
    marginTop: 70,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonColumn: {
    alignItems: "center",
    flex: 1,
  },
  subText: {
    fontSize: Platform.OS === "android" || Platform.OS === "ios" ? 10 : 13,
    fontWeight: "bold",
    color: "#777",
    marginBottom: 5,
    marginTop: Platform.OS === "android" || Platform.OS === "ios" ? 30 : 30,
    textAlign: "center",
  },
  button: {
    height: 50,
    width:
      Platform.OS === "android" || Platform.OS === "ios"
        ? width * 0.25
        : width * 0.4,
    maxWidth: 180,
    backgroundColor: "#FF3366",
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "uppercase",
  },
});

export default MainScreen;
