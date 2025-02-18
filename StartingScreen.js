import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";
import { Alert } from "react-native";

// Icons - you'll need to add these to your project
import AgentIcon from "./assets/agent-icon.png";
import CustomerIcon from "./assets/customer-icon.png";
import CoreMemberIcon from "./assets/core-member-icon.png";
import ReferralIcon from "./assets/referral-icon.png";
import WealthAssociatesLogo from "./assets/logo.png";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isTablet = width > 768;

const StartingScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={WealthAssociatesLogo}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.welcomeText}>Welcome To Wealth Associates</Text>
            <Text style={styles.loginAsText}>Login as</Text>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, isSmallDevice && styles.smallButton]}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.buttonText}>Agent Login</Text>
                <Image source={AgentIcon} style={styles.buttonIcon} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, isSmallDevice && styles.smallButton]}
                onPress={() =>
                  Alert.alert(
                    "Only Agent login available This feature is under Development"
                  )
                }
              >
                <Text style={styles.buttonText}>Customer login</Text>
                <Image source={CustomerIcon} style={styles.buttonIcon} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, isSmallDevice && styles.smallButton]}
                onPress={() =>
                  Alert.alert(
                    "Only Agent login available This feature is under Development"
                  )
                }
              >
                <Text style={styles.buttonText}>Core Member login</Text>
                <Image source={CoreMemberIcon} style={styles.buttonIcon} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, isSmallDevice && styles.smallButton]}
                onPress={() =>
                  Alert.alert(
                    "Only Agent login available This feature is under Development"
                  )
                }
              >
                <Text style={styles.buttonText}>Referral login</Text>
                <Image source={ReferralIcon} style={styles.buttonIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 30,
    width: isTablet ? "80%" : "100%",
    maxWidth: 780,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  welcomeText: {
    fontSize: isTablet ? 28 : 22,
    fontWeight: "500",
    color: "#e9356e",
    marginBottom: 20,
    textAlign: "center",
  },
  contentContainer: {
    flexDirection: Platform.OS === "android" ? "column" : "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoContainer: {
    marginRight: isTablet ? 20 : 0,
    marginBottom: isTablet ? 0 : 30,
    width: isTablet ? "45%" : "70%",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: isTablet ? 250 : 150,
  },
  loginContainer: {
    flex: isTablet ? 1 : undefined,
    width: isTablet ? "45%" : "100%",
    alignItems: "center",
  },
  loginAsText: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: "500",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonsContainer: {
    width: "100%",
  },
  button: {
    backgroundColor: "#e9356e",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  smallButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: isTablet ? 18 : 16,
    fontWeight: "500",
  },
  buttonIcon: {
    width: 24,
    height: 24,
    tintColor: "white",
  },
});

export default StartingScreen;
