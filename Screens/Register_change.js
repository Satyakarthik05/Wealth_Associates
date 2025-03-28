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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import logo1 from "../assets/logo.png";

const RegisterAsScreen = ({ navigation }) => {
  const loginOptions = [
    {
      name: "Agent",
      icon: (
        <MaterialIcons name="real-estate-agent" size={hp("4%")} color="white" />
      ),
      navigateTo: "Register", // This is the screen you want to navigate to
    },
    {
      name: "Customer",
      icon: <FontAwesome5 name="user" size={hp("4%")} color="white" />,
      navigateTo: "RegisterCustomer", // Correct the navigation target if needed
    },
  ];

  return (
    <View style={styles.container}>
      <Image source={logo1} style={styles.logo} />
      <Text style={styles.welcomeText}>Welcome To Wealth Associates</Text>
      <Text style={styles.loginAsText}>Register as</Text>

      {Platform.OS === "web" ? (
        <View style={styles.card}>
          <View style={styles.gridContainer}>
            {loginOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.button}
                onPress={() => navigation.navigate(option.navigateTo)}
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
              onPress={() => navigation.navigate(option.navigateTo)}
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
    // marginRight: Platform.OS === "web" ? hp("15%") : hp("0%"),
    // marginLeft: Platform.OS === "android" ? "0%" : "10%",
    // alignSelf: Platform.OS === "web" ? "flex-end" : "auto",
    marginTop: Platform.OS === "web" ? hp("0%") : hp("0%"),
  },
  welcomeText: {
    fontSize: Platform.OS === "android" ? hp("2.5%") : hp("3%"),
    fontWeight: "bold",
    color: "#D81B60",
    marginBottom: hp("1%"),
    // alignSelf: Platform.OS === "web" ? "flex-start" : "auto",
  },
  loginAsText: {
    fontSize: Platform.OS === "android" ? hp("3%") : hp("3%"),

    fontWeight: "600",
    //marginBottom:Platform.OS === "android" ? hp("2%") : hp("2%"),
    marginTop: Platform.OS === "android" ? hp("3%") : hp("2%"),

    // alignSelf: Platform.OS === "web" ? "flex-start" : "auto",
    // marginLeft: Platform.OS === "android" ? "30%" : "auto",
  },
  card: {
    backgroundColor: "#fff",
    padding: hp("3%"),
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: Platform.OS === "android" ? wp("60%") : wp("60%"),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp("2%"),
  },
  gridContainer: {
    // flexDirection: "row",
    display: "flex",
    flexDirection: Platform.OS === "android" ? "column" : "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: Platform.OS === "web" ? "100%" : "40px",
  },
  button: {
    width: Platform.OS === "web" ? "15%" : wp("38%"),
    maxWidth: Platform.OS === "web" ? 200 : 180,
    height: Platform.OS === "android" ? 100 : "100px",
    // height: hp("12%"),
    // maxHeight: 120,
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
    marginTop: Platform.OS === "web" ? hp("0%") : hp("8%"),

    //justifyContent:Platform.OS === "android"? "center" : "none"
  },
  buttonText: {
    color: "white",
    fontSize: hp("2%"),
    marginTop: hp("1%"),
    textAlign: "center",
  },
});

export default RegisterAsScreen;
