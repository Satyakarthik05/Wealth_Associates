import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const navigation = useNavigation();
  return (
    <ImageBackground
      source={
        Platform.OS === "ios"
          ? require("../assets/exp_and.jpg")
          : Platform.OS === "android"
          ? require("../assets/exp_and.jpg")
          : require("../assets/exp.jpg")
      }
      style={styles.container}
      resizeMode="cover"
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/wlogo2.png")} // Company logo
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.quoteContainer}>
        <Image
          source={require("../assets/quote.png")} // Company logo
          style={styles.quote}
          resizeMode="contain"
        />
      </View>

      {/* Card with PNG background */}
      <ImageBackground
        source={require("../assets/cardbg.png")} // Your PNG for the glass effect
        style={styles.card}
        resizeMode="stretch"
      >
        <Text style={styles.welcomeText}>Welcome to Wealth Associates</Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Starting Screen")}
          >
            <Text style={styles.buttonText}> Login </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("RegisterAS")}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Text */}
        <View style={styles.footerTextContainer}>
          <Text style={styles.footerText}>if already registered ?</Text>
          <Text style={styles.footerText2}>new user ?</Text>
        </View>
      </ImageBackground>
      {/* <View>
        <Text>Ceo:Naresh</Text>
      </View> */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  logoContainer: {
    position: "absolute",
    top: Platform.OS === "android" || Platform.OS === "ios" ? 50 : 18,
    alignItems: "left",
  },
  logo: {
    width: Platform.OS === "android" || Platform.OS === "ios" ? 150 : 200,
    height: Platform.OS === "android" || Platform.OS === "ios" ? 68 : 80,
    position: "relative",
    right: Platform.OS === "android" || Platform.OS === "ios" ? -113 : -680,
  },
  quoteContainer: {
    position: "absolute",
    top: Platform.OS === "android" || Platform.OS === "ios" ? 160 : 30,
    alignItems: "left",
  },
  quote: {
    width: Platform.OS === "android" || Platform.OS === "ios" ? 250 : 500,
    height: Platform.OS === "android" || Platform.OS === "ios" ? 128 : 280,
    position: "relative",
    right: Platform.OS === "android" || Platform.OS === "ios" ? 113 : 630,
    left: Platform.OS === "android" || Platform.OS === "ios" ? 75 : 324,
  },
  card: {
    position: "relative",
    top: Platform.OS === "android" || Platform.OS === "ios" ? 90 : 100,
    width: Platform.OS === "android" || Platform.OS === "ios" ? 325 : 580,
    height: Platform.OS === "android" || Platform.OS === "ios" ? 200 : 330,
    // marginLeft:10,
    alignItems: "center", // Centers children (text + buttons)
    justifyContent: "center", // Centers vertically
  },
  welcomeText: {
    fontSize: Platform.OS === "android" || Platform.OS === "ios" ? 15 : 18,
    color: "#fff",
    fontWeight: "bold",
    // marginBottom: 20,
    position: "relative",
    // left:155,
    bottom: Platform.OS === "android" || Platform.OS === "ios" ? 28 : 69,
    textShadowColor: "rgba(0, 0, 0, 0.7)", // Dark shadow for depth
    textShadowOffset: { width: 2, height: 2 }, // Slight offset for natural look
    textShadowRadius: 5, // Smooth blur effect
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: Platform.OS === "android" || Platform.OS === "ios" ? 1 : 10,
    justifyContent: "space-evenly",
    marginLeft: Platform.OS === "android" || Platform.OS === "ios" ? 8 : 18,
  },
  button: {
    backgroundColor: "#e6005c",
    paddingVertical:
      Platform.OS === "android" || Platform.OS === "ios" ? 10 : 15,
    paddingHorizontal:
      Platform.OS === "android" || Platform.OS === "ios" ? 25 : 45,
    borderRadius: 8,
    shadowColor: "#e6005c",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerTextContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 15,
  },
  footerText: {
    color: "#fff",
    fontSize: Platform.OS === "android" || Platform.OS === "ios" ? 12 : 14,
    marginLeft: Platform.OS === "android" || Platform.OS === "ios" ? 34 : 110,
    marginTop: Platform.OS === "android" || Platform.OS === "ios" ? -2 : 5,
    textShadowColor: "rgba(0, 0, 0, 0.7)", // Dark shadow for depth
    textShadowOffset: { width: 2, height: 2 }, // Slight offset for natural look
    textShadowRadius: 5, // Smooth blur effect
  },
  footerText2: {
    color: "#fff",
    fontSize: Platform.OS === "android" || Platform.OS === "ios" ? 12 : 14,
    marginTop: Platform.OS === "android" || Platform.OS === "ios" ? -2 : 5,
    marginLeft: Platform.OS === "android" || Platform.OS === "ios" ? 59 : 140,
    textShadowColor: "rgba(0, 0, 0, 0.7)", // Dark shadow for depth
    textShadowOffset: { width: 2, height: 2 }, // Slight offset for natural look
    textShadowRadius: 5, // Smooth blur effect
  },
});

export default LoginScreen;
