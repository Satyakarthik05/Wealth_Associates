import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";

const ForgotPassword = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const handleGetOTP = () => {
    alert("OTP Sent to " + mobileNumber);
  };

  const handleCancel = () => {
    alert("Cancelled");
  };

  return (
    <View style={[styles.container, isDesktop && styles.desktopContainer]}>
      <Image
        source={require("../assets/forgot-password-.png")} // Replace with actual image path
        style={[styles.image, isDesktop && styles.desktopImage]}
      />
      <View style={[styles.content, isDesktop && styles.desktopContent]}>
        <Image
          source={require("../assets/forgot-password-.png")} // Replace with your logo URL
          style={styles.logo}
        />
        <Text style={styles.logoText}>Wealth Associates</Text>
        <Text style={styles.subtitle}>Your Trusted Property Consultant</Text>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.label}>Mobile Number</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ex. 9063392872"
            keyboardType="phone-pad"
            value={mobileNumber}
            onChangeText={setMobileNumber}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.otpButton} onPress={handleGetOTP}>
            <Text style={styles.otpButtonText}>Get OTP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 40,
  },
  desktopContainer: {
    flexDirection: "row", // Align items side by side for desktop
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
  desktopImage: {
    marginRight: 40, // Space between image and form
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  desktopContent: {
    width: "50%",
    alignItems: "flex-start",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  inputContainer: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
  },
  input: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  otpButton: {
    backgroundColor: "#E91E63",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  otpButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ForgotPassword;
