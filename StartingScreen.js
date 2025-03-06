import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const StartingScreen = () => {
  const navigation = useNavigation();

  const loginOptions = [
    {
      name: "Agent",
      icon: (
        <MaterialIcons name="real-estate-agent" size={hp("4%")} color="white" />
      ),
      navigateTo: "Login", // Navigate to AgentDashboard
    },
    {
      name: "Customer",
      icon: <FontAwesome5 name="user" size={hp("4%")} color="white" />,
      navigateTo: "CustomerDashboard", // Navigate to CustomerDashboard
    },
    {
      name: "Core Member",
      icon: <Ionicons name="link" size={hp("4%")} color="white" />,
      navigateTo: "CoreDashboard", // Navigate to CoreMemberDashboard
    },
    {
      name: "Referral",
      icon: <FontAwesome5 name="users" size={hp("4%")} color="white" />,
      navigateTo: "ReferralDashboard", // Navigate to ReferralDashboard
    },
    {
      name: "Investor",
      icon: (
        <FontAwesome5 name="hand-holding-usd" size={hp("4%")} color="white" />
      ),
      navigateTo: "Investordashboard", // Navigate to InvestorDashboard
    },
    {
      name: "NRI",
      icon: <MaterialIcons name="flight" size={hp("4%")} color="white" />,
      navigateTo: "NriDashboard", // Navigate to NRIDashboard
    },
    {
      name: "Skilled Resource",
      icon: <FontAwesome5 name="user-tie" size={hp("4%")} color="white" />,
      navigateTo: "SkillDashboard", // Navigate to SkilledResourceDashboard
    },
  ];

  return (
    <View style={styles.container}>
      <Image source={require("./assets/logo.png")} style={styles.logo} />
      <Text style={styles.welcomeText}>Welcome To Wealth Associates</Text>
      <Text style={styles.loginAsText}>Login as</Text>

      {Platform.OS === "web" ? (
        <View style={styles.card}>
          <View style={styles.gridContainer}>
            {loginOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.button}
                onPress={() => navigation.navigate(option.navigateTo)} // Navigate based on option
              >
                {option.icon}
                <Text style={styles.buttonText}>{option.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.gridContainer}>
          {loginOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => navigation.navigate(option.navigateTo)} // Navigate based on option
            >
              {option.icon}
              <Text style={styles.buttonText}>{option.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: hp("5%"),
  },
  logo: {
    width: wp("50%"),
    height: hp("20%"),
    resizeMode: "contain",
    marginBottom: hp("3%"),
  },
  welcomeText: {
    fontSize: Platform.OS === "android" ? hp("3%") : hp("3%"),
    fontWeight: "bold",
    color: "#D81B60",
    marginBottom: hp("1%"),
  },
  loginAsText: {
    fontSize: Platform.OS === "android" ? hp("3%") : hp("3%"),
    fontWeight: "600",
    marginBottom: Platform.OS === "android" ? hp("2%") : hp("2%"),
  },
  card: {
    backgroundColor: "#fff",
    padding: hp("3%"),
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: wp("60%"),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp("2%"),
    height: "400px",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: Platform.OS === "web" ? "100%" : "40px",
  },
  button: {
    width: Platform.OS === "web" ? "15%" : wp("38%"),
    maxWidth: Platform.OS === "web" ? 200 : 180,
    height: hp("12%"),
    maxHeight: 120,
    backgroundColor: "#D81B60",
    borderRadius: Platform.OS === "web" ? 15 : wp("3%"),
    alignItems: "center",
    justifyContent: "center",
    margin: Platform.OS === "web" ? "1.5%" : hp("1.5%"),
    elevation: Platform.OS === "android" ? 5 : 0,
    shadowColor: "#000",
    shadowOffset:
      Platform.OS === "ios" || Platform.OS === "web"
        ? { width: 0, height: 3 }
        : { width: 0, height: 0 },
    shadowOpacity: Platform.OS === "ios" || Platform.OS === "web" ? 0.2 : 0,
    shadowRadius: Platform.OS === "ios" || Platform.OS === "web" ? 5 : 0,
    marginBottom: Platform.OS === "android" ? hp("0%") : hp("10%"),
  },
  buttonText: {
    color: "white",
    fontSize: hp("2%"),
    marginTop: hp("1%"),
    textAlign: "center",
  },
});

export default StartingScreen;
