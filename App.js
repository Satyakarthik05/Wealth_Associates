import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import logo from "./assets/Wealth Associate Logo New.png";

const { width, height } = Dimensions.get("window"); // Get screen dimensions

const App = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* Left Side - Logo and Branding */}
      <View style={styles.leftContainer}>
        <Image
          source={logo} // Replace with actual logo path
          style={styles.logo}
        />
        <Text style={styles.tagline}>Your Trusted Property Consultant</Text>
      </View>

      {/* Right Side - Login Form */}
      <View style={styles.rightContainer}>
        <Text style={styles.welcomeText}>
          Welcome back! Log in to your account.
        </Text>

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex. 9063392872"
          keyboardType="phone-pad"
          value={mobileNumber}
          onChangeText={setMobileNumber}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot your Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: width > 768 ? "row" : "column", // Row for larger screens, Column for mobile
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  leftContainer: {
    flex: width > 768 ? 1 : 0, // Only show in row mode
    alignItems: "center",
    justifyContent: "center",
    display: width > 768 ? "flex" : "none", // Hide logo on small screens
  },
  rightContainer: {
    flex: 1,
    width: width * 0.9, // Take 90% of screen width
    maxWidth: 400, // Limit max width
    padding: 20,
  },
  logo: {
    width: width > 768 ? 150 : 100, // Adjust logo size
    height: width > 768 ? 150 : 100,
    resizeMode: "contain",
  },
  tagline: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 16,
    color: "#e91e63",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#e91e63",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#e91e63",
    marginTop: 10,
    textAlign: "center",
  },
});

export default App;
